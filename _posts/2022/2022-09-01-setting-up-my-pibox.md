---
title: "Setting up my PiBox"
date: "Thu Sep 01 15:50:53 -0400 2022"
category: dev
tags: [k3s, kubernetes, raspberry-pi, pibox]
---

I picked up a [PiBox][1] and wanted to run it without KubeSail/k3s. The devs at
KubeSail have open sourced all of their [provisioning scripts][2] and I was
able to get things working in a night.

### Flashing the OS

The PiBox ships with a [Raspberry Pi Compute Module 4][3] with EMMC storage.
You have to short some pins to put it in flashing mode. Luckily, KubeSail
thought ahead and put a small switch on the board the CM attaches to.

Power down the PiBox and remove the two screws from the bottom. Slide the
cover apart. Unplug the fan and WiFi cables. Carefully, pop the main board out
from the plastic rails and remove the board from the case.

Make sure the switch on the board is in the `rpiboot` setting.

[`rpiboot`][4] needs to be installed on a separate computer. I used my Mac.

```
brew install libusb pkg-config
git clone --depth=1 https://github.com/raspberrypi/usbboot
cd usbboot
make
sudo ./rpiboot
```

On Linux/WSL it would look like:

```
sudo apt install git libusb-1.0-0-dev pkg-config
git clone --depth=1 https://github.com/raspberrypi/usbboot
cd usbboot
make
sudo ./rpiboot
```

Next, use the [Raspberry Pi Imager][5] to install Raspbian Lite 64 bit. Make
sure to select the 8gb EMMC disk. You should also click the gear icon and
enable SSH, add your keys, and setup WiFi. Write the image to the EMMC. It'll
take quite a while compared to USBs or SDs. Disconnect the board from your
computer when done.

At this point you can either reassemble the PiBox completely or just plug the
main board back in so you can power it up.

### First Boot

We need to install a driver for the PiBox fan. On first boot, the fan will run
at full speed.

Before we get to far, let's install some prerequisites. All commands in this
section are run on the PiBox as root

```
apt-get update -yqq
apt-get full-upgrade -yqq
apt-get autoremove -yqq
apt-get autoclean -yqq
apt-get install -yqq vim lvm2 raspberrypi-kernel-headers git
```

We'll be using a few things from the [`pibox-os`][5] repo, so let's clone it.
On the PiBox:

```
sudo git clone --depth=1 https://github.com/kubesail/pibox-os /usr/local/src/pibox-os
```

Next we'll apply some kernel settings that KubeSail recommends:

```
grep -qxF 'cgroup_enable=memory cgroup_memory=1' /boot/cmdline.txt || sed -i 's/$/ cgroup_enable=memory cgroup_memory=1/' /boot/cmdline.txt
sed -i 's/quiet splash plymouth.ignore-serial-consoles//' /boot/cmdline.txt
```

To reduce wear on the EMMC memory, reduce logging:

```
sed -i 's/.MaxLevelStore.*/MaxLevelStore=info/' /etc/systemd/journald.conf
sed -i 's/.MaxLevelSyslog.*/MaxLevelSyslog=info/' /etc/systemd/journald.conf
sed -i "s/#Storage.*/Storage=volatile/" /etc/systemd/journald.conf
systemctl restart systemd-journald.service
```

And setup a ramdisk for tmp:

```
echo "tmpfs /var/tmp tmpfs defaults,noatime,nosuid,nodev,noexec,mode=0755,size=1M 0 0" >> /etc/fstab
```

Apply some sysctl/limit settings:

```
echo "vm.swappiness=1" >> /etc/sysctl.conf
echo "fs.file-max=1024000" >> /etc/sysctl.conf
echo "* soft nofile 8192" >> /etc/security/limits.conf
```

Disable swap:

```
swapoff -a
systemctl mask  "dev-*.swap"
dphys-swapfile swapoff
dphys-swapfile uninstall
update-rc.d dphys-swapfile remove
apt-get -yqq purge dphys-swapfile || true
```

Build the fan driver:

```
cd /usr/local/src/pibox-os/pwm-fan
tar zxvf bcm2835-1.68.tar.gz
(cd bcm2835-1.68 && ./configure && make && make install)
make && make install
```

If it worked, you should hear the fan turn off.

At this point, it's a good idea to reboot, so:

```
reboot
```

### Configuring Your SSD(s)

Once again, the KubeSail devs have a handy little [script][7] for provisioning
your SSDs on boot. I had already spun up my PiBox and had some data on my
single SSD, so I decided to wipe it all out and start new.

Again, on the PiBox as root, check the volume group:

```
vgdisplay
```

Wipe the old volume group:

```
vgremove pibox-group
```

Create a new volume group. We pass each SSD. Run `fdisk -l` to verify, but
they are likely `/dev/sda1` and `/dev/sdb1` if you have two drives installed.

For me on a single drive:

```
vgcreate pibox /dev/sda1
```

With two drives it (probably) looks like:

```
vgcreate pibox /dev/sda1 /dev/sdb1
```

Next create a logical volume, I'm calling mine "main"

```
lvcreate -n main -l "100%FREE" pibox
```

Create an ext4 filesystem on the volume:

```
mkfs.ext4 -F -m 0 -b 4096 /dev/pibox/main
```

Tune the filesystem for performance on the PiBox:

```
tune2fs -O fast_commit /dev/pibox/main
```

Run an filesystem check to make sure everything is good to go:

```
e2fsck -p -f /dev/pibox/main
```

Finally, configure fstab to mount the volume group on boot. I'm just throwing
it up at `/mnt`:

```
echo '/dev/pibox/main /mnt ext4 defaults,discard,nofail,noatime,data=ordered,errors=remount-ro 0 0 ' >> /etc/fstab
```

Mount the disk:

```
mount /mnt
```

Test writing:

```
touch /mnt/test
rm /mnt/test
```

I want the `pi` user to be able to write here, so I also did:

```
chown pi:pi /mnt/
```

**Important:** It's important to note that under this configuration the main
filesystem is still the CM's EMMC chip. You'll need to configure the software
you are running to store things on the disk.

Another approach is to use a bind mount which basically points one folder at
another on the filesystem.

For example, if you wanted `/var/lib/plexmediaserver` to be on the SSD, you
could do something like:

```
mkdir /mnt/plexlib
```

And in `/etc/fstab`:

```
/mnt/plexlib /var/lib/plexmediaserver none bind
```

To copy exiting files to it:

```
mv /var/lib/plexmediaserver /var/lib/plexmediaserver.bak
mount /var/lib/plexmediaserver
cp -rp /var/lib/plexmediaserver.bak/* /var/lib/plexmediaserver
```

Finally, to add a 2nd disk later on:

```
vgextend pibox /dev/sdb1
lvextend -l "100%FREE" /dev/pibox/main
resize2fs /dev/pibox/main
```

### Building the Display Driver / PiBox Framebuffer

The last thing to setup is the display drivers for the cute little LCD that
comes with the PiBox.

There are two components to this; the display driver itself, and a library of
some sort to interface with it.

I had a little trouble here. The driver requires kernel headers which are
installed via `apt-get install rasberrypi-kernel-headers`, but that version
did not match `uname -r` for me.

I ended up editing the `st7789_module/Makefile` in the `pi-box` source as
follows:

```diff
-KDIR ?= /lib/modules/`uname -r`/build
+KDIR ?= /lib/modules/5.15.61-v8+/build
```

Then I was able to compile and install the driver:

```
cd /usr/local/src/pibox-os/st7789_module
make
mv /lib/modules/5.15.61-v8+/kernel/drivers/staging/fbtft/fb_st7789v.ko{,.BACK}
mv fb_st7789v.ko /lib/modules/5.15.61-v8+/kernel/drivers/staging/fbtft/fb_st7789v.ko
cd /usr/local/src/pibox-os
dtc --warning no-unit_address_vs_reg -I dts -O dtb -o /boot/overlays/drm-minipitft13.dtbo overlays/minipitft13-overlay.dts
cat <<EOF >> /boot/config.txt
dtoverlay=spi0-1cs
dtoverlay=dwc2,dr_mode=host
hdmi_force_hotplug=1
dtoverlay=drm-minipitft13,rotate=0,fps=60
EOF
reboot
```

The next step depends on how you might want to use the LCD. I like the
[pibox-framebuffer][8] that KubeSail made. The only issue is it is specific to
their setup with k3s, so I had to fork it and compile my own version.

I might hack on it more, but for now I just wanted to get things working with
a non k3s setup.

These are the changes I made to `main.go`:

```diff
diff --git a/main.go b/main.go
index 8c945b4..5fcb99c 100644
--- a/main.go
+++ b/main.go
@@ -135,9 +135,9 @@ func diskStats(w http.ResponseWriter, req *http.Request) {
        var responseData DiskStatsResponse

        responseData.RootUsage = strings.Split(shell("df", strings.Split("/", " ")), "\n")
-       responseData.K3sUsage = strings.Split(shell("df", strings.Split("/var/lib/rancher/k3s/", " ")), "\n")
-       responseData.K3sStorageUsage = strings.Split(shell("du", strings.Split("-b --max-depth=1 /var/lib/rancher/k3s/storage/", " ")), "\n")
-       responseData.K3sVersion = shell("k3s", strings.Split("--version", " "))
+       // responseData.K3sUsage = strings.Split(shell("df", strings.Split("/var/lib/rancher/k3s/", " ")), "\n")
+       // responseData.K3sStorageUsage = strings.Split(shell("du", strings.Split("-b --max-depth=1 /var/lib/rancher/k3s/storage/", " ")), "\n")
+       // responseData.K3sVersion = shell("k3s", strings.Split("--version", " "))
        responseData.MountPoints = shell("findmnt", strings.Split("-s -J -e", " "))
        responseData.Lvs = shell("lvs", strings.Split("--reportformat json --units=b", " "))
        responseData.Pvs = shell("pvs", strings.Split("--reportformat json --units=b", " "))
@@ -362,7 +362,7 @@ func stats() {
        var found = false
        for _, p := range parts {
                device := p.Mountpoint
-               if device != "/var/lib/rancher" {
+               if device != "/mnt" {
                        continue
                }
                s, _ := disk.Usage(device)
```

And these changes were applied to the build scripts to run on a M1 Mac Mini:

```diff
diff --git a/build.sh b/build.sh
index f83b325..7fcc0b2 100755
--- a/build.sh
+++ b/build.sh
@@ -22,7 +22,7 @@ mkdir -p output

 DOCKER_BUILDKIT=1 ${BUILDX_PREFIX} build \
   --pull \
-  --platform "linux/amd64,linux/arm64" \
+  --platform "linux/arm64" \
   --build-arg BUILD_VERSION="$(cat VERSION.txt)" \
   -t ${TAG} \
   -o output/ .
diff --git a/go-build.sh b/go-build.sh
index 03e1143..ee58854 100755
--- a/go-build.sh
+++ b/go-build.sh
@@ -1,5 +1,6 @@
 #!/bin/bash
-
+export GOOS=linux
+export GOARCH=arm64
 go mod download

 go mod verify
```

I had to install Docker Desktop, and then compiled with:

```
TARGETARCH=arm64 sh build.sh
```

Copy the binary to the PiBox:

```
scp output/pibox-framebuffer-linux-arm64-v20 pi@pibox.local:
```

Back on the PiBox, as root:

```
mkdir -p /opt/kubesail/
mv /home/pi/pibox-framebuffer-linux-arm64-v20 /opt/kubesail
ln -s /opt/kubesail/pibox-framebuffer-linux-arm64-v20 /opt/kubesail/pibox-framebuffer
```

Test that it works:

```
sudo /opt/kubsail/pibox-framebuffer
```

And the LCD should light up!

To wrap things up, we need to setup systemd to load the framebuffer.

I had a bit of trouble here too. The recommended configuration is:

```
cat <<'EOF' > /etc/systemd/system/pibox-framebuffer.service
[Unit]
Requires=multi-user.target
After=multi-user.target
[Service]
ExecStart=/opt/kubesail/pibox-framebuffer
Restart=always
RestartSec=5s
[Install]
WantedBy=multi-user.target
EOF
```

That didn't work for me, `systemctl start pibox-framebuffer.service` would
hang indefinitely. I changed `pibox-framebuffer.service` like so:

```
[Unit]
Description=pibox framebuffer
[Service]
ExecStart=/opt/kubesail/pibox-framebuffer
Restart=on-failure
Type=simple
[Install]
WantedBy=multi-user.target
```

The notable change, I think, was `Type=simple`. StackOverflow posts mentioned
that hangs can happen without that on processes that don't fork and exit,
which is exactly what the `pibox-framebuffer` command does.

To apply the systemd changes:

```
systemctl daemon-reload
systemctl enable pibox-framebuffer.service
systemctl start pibox-framebuffer.service
```

_Note:_ I had some odd behavior when I was starting the service and the PiBox
hadn't _booted_ with the service coming up---there would be a small spot of 3
or 4 pixels that blinked blue. Rebooting seemed to fix it.

### Happy Hackity

That's it! What are you still doing here? Go on and hack something already!

---

### Updates

I had hoped to boot from the SSD, but according to these posts, that's not
possible yet.

- <https://www.jeffgeerling.com/blog/2021/raspberry-pi-os-now-has-sata-support-built>
- <https://github.com/raspberrypi/firmware/issues/1653>

[1]: https://pibox.io
[2]: https://github.com/kubesail/pibox-os/blob/main/provision-os.sh
[3]: https://www.raspberrypi.com/products/compute-module-4/
[4]: https://github.com/raspberrypi/usbboot
[5]: https://www.raspberrypi.com/software/
[6]: https://github.com/kubesail/pibox-os
[7]: https://github.com/kubesail/pibox-os/blob/main/provision-disk.sh
[8]: https://github.com/kubesail/pibox-framebuffer
