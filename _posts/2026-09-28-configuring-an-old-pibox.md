---
title: "Configuring an old PiBox"
date: "Mon Sep 28 17:31:43 -0400 2026"
category: dev
---

About 4 years ago I spent too much money on a [PiBox][1] from KubeSail so I
could have a single enclosure with a Pi and an SSD. It didn't really work out
for me initially, but I'm happy to report I finally got it working how I
originally wanted, if only a few years late.

The PiBox is actually a Raspberry Pi 4 Compute Module with a couple component
boards for SSD, USB, Ethernet, and a mini LCD in a cute little package:

![PiBox]({{ "/images/posts/2026/pibox.png" | relative_url }})

Pi CMs come with eMMC storage, which is slow and prone to wear over time.

When I bought it, I didn't really realize that KubeSail/PiBox was all built
around k3s. I really just wanted a regular ol' Pi OS with an SSD. They
basically overlayed the SSD on the paths for k3s, then tweaked logging, etc to
try to write less to the Pi's built in storage.

Right around the time I bought it, NVMe boot was becoming a thing for Pis.
But not for SATA drives like the ones the PiBox case used. Seems like that is
still the case today for Raspberry Pi OS.

I played with it a bit, but wasn't happy with the overlay stuff and eMMC
performance. So it eventually found its way into my old projects drawer and
sat for years. I pulled it out a couple times and tried again, but never got
anywhere with it.

I've been reorganizing a couple Pis I had in service for DNS and saw the PiBox
sitting in the drawer again. I figured it was worth one more try with Claude
Code, which I assumed knew better than I did or could Google better than me.
And turns out that was true.

Instead of the overlays, what you can do is mount `/boot/firmware` from eMMC
storage, then mount the SSD as `/`. I'm a long time Linux and Pi user, but I
never really had to do anything custom with the boot partition or firmware.
The thought of booting from the eMMC and then putting basically 99.9% of the
OS data on the SSD never occurred to me as a possibility. Definitely a
facepalm moment when I saw the solution.

In short, we need to:

1. Install Raspberry Pi OS on eMMC
2. Copy everything from eMMC to the SSD
3. Configure the system to use the SSD for `/` and eMMC for `/boot/firmware`

First, I installed Raspberry Pi OS Lite. That requires [usbboot][2]. On MacOS
installing that looks like:

```sh
brew install libusb pkg-config
git clone https://github.com/raspberrypi/usbboot
cd usbboot
make
sudo ./rpiboot
```

With that running, there's a boot mode switch on the PiBox carrier board (the
main one the CM attaches to). Disconnect the carrier board from the enclosure.
Flip the switch to 'rpiboot', then connect to your Mac with a USB-C cable.

Then, use Raspberry Pi Imager to install Raspberry Pi OS Lite 64 bit (you
could probably use the desktop version too, but I'm not sure if it would fit
in the eMMC -- mine is only 6.8gb). Installation takes about 15 minutes, with
about 5mb/s write speed.

Once the OS is installed, disconnect the USB-C cable from your Mac. Reinstall
the carrier board in the case. Install the SSD in the PiBox case. Boot as
normal.

Now, we need to format the SSD (for me, `/dev/sda`). I had no data I needed
saved so I formatted it thusly:

```sh
sudo wipefs -a /dev/sda1
sudo wipefs -a /dev/sda
sudo parted -s /dev/sda mklabel gpt
sudo parted -s -a optimal /dev/sda mkpart rootfs ext4 0% 100%
sudo partprobe /dev/sda
sudo mkfs.ext4 -L rootfs /dev/sda1
```

Next, we need to copy the OS from eMMC to the SSD:

```sh
sudo mkdir -p /mnt/ssd
sudo mount /dev/sda1 /mnt/ssd
sudo rsync -axHAX --info=progress2 --exclude=/boot/firmware/* / /mnt/ssd/
mkdir -p /mnt/ssd/boot/firmware
```

The SSD needs to be added to `fstab` and `cmdline.txt`. We need its `PARTUUID`
for that.

```sh
blkid /dev/sda1
```

In `/etc/fstab` swap out the `PARTUUID` on the `/` mount to the one from the
SSD. For me it looks like:

```
proc            /proc           proc    defaults          0       0
PARTUUID=f3a1dba5-01  /boot/firmware  vfat    defaults          0       2
PARTUUID=61e93e61-f0e7-420a-84b9-113e344ccee2  /               ext4    defaults,noatime  0       1
```

We need to make sure that the SATA driver is in initramfs (it was already on
this install):

```sh
lsinitramfs /boot/firmware/initramfs8 | grep -i ahci
```

That should output something like:

```
usr/lib/modules/6.18.50+rpt-rpi-v8/kernel/drivers/ata/ahci.ko.xz
usr/lib/modules/6.18.50+rpt-rpi-v8/kernel/drivers/ata/libahci.ko.xz
```

If it's missing, it can be enabled with:

```sh
echo ahci | sudo tee -a /etc/initramfs-tools/modules
sudo update-initramfs -u
```

Now `cmdline.txt`, we need to update the root `PARTUUID`, add `rootdelay=5`,
and add `pcie_aspm=off`.

```sh
sudo cp /boot/firmware/cmdline.txt{,.bak}
sudo vim /boot/firmware/cmdline.txt
```

Make the changes, ensuring everything is still on a single line in the file.
My updated version looks like:

```
console=serial0,115200 console=tty1 root=PARTUUID=61e93e61-f0e7-420a-84b9-113e344ccee2 rootfstype=ext4 fsck.repair=yes rootwait cfg80211.ieee80211_regdom=US ds=nocloud;i=rpi-imager-1790623015181 rootdelay=5 pcie_aspm=off
```

We can now reboot and test:

```sh
sudo umount /mnt/ssd
sudo reboot
```

After coming back up, we can check with:

```sh
findmnt /
findmnt /boot/firmware
```

It should output something like:

```
TARGET SOURCE    FSTYPE OPTIONS
/      /dev/sda1 ext4   rw,noatime

TARGET         SOURCE         FSTYPE OPTIONS
/boot/firmware /dev/mmcblk0p1 vfat   rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=ascii,shortname=mixed,errors=remount-ro
```

Things are mostly working now, but a few other odds and ends to configure the
custom components.

To enable the built in fan, on the PiBox:

```sh
git clone https://github.com/kubesail/pibox-os.git
cd pibox-os/pwm-fan
tar zxvf bcm2835-1.68.tar.gz
cd bcm2835-1.68
./configure && make && sudo make install
cd ..
make && sudo make install
```

You should notice the fan immediately quiet down (unless you're under load).

I haven't yet been able to get the LCD screen working on the more modern Pi
OS. That's for another day (I'll update this post when I get it working). The
steps are [here][3], but I get a build error at the moment.

With all that in place, everything is good to go!

I heard KubeSail closed shop in late 2025. Sad to see, but I'm glad I was able
to support a small business and finally got the PiBox working how I want.

[1]: https://docs.kubesail.com/guides/pibox/
[2]: https://github.com/raspberrypi/usbboot
[3]: https://docs.kubesail.com/guides/pibox/os/#enabling-the-13-lcd-display
