---
title: "Deluge and OpenVPN on a Raspberry Pi 4"
date: "Tue Aug 06 00:34:26 -0400 2019"
category: dev
redirect_from: /blog/2019/deluge-and-openvpn-on-a-raspberry-pi-4.html
---

I recently got a new Raspberry Pi 4. Since it has gigabit ethernet and USB 3,
I thought it would make a perfect Deluge seedbox (you know, for Ubuntu and
Rasbian ISOs and the like). Here's how I setup Deluge and OpenVPN.

### Prerequisites

- Raspberry Pi running Rasbian Buster, preferably a clean headless install.
- USB Hard Drive
- Private Internet Access VPN account

### Update apt

Update the system to the newest software packages before installing anything
new:

```
sudo apt-get update
sudo apt-get upgrade
```

### Hard Drive Setup

**IMPORTANT:** These steps will delete any data present on your drive!

Plug the drive into your Raspberry Pi. We need to know where it is located.
Run the following command and look for your USB drive:

```
sudo fdisk -l
```

In this case, my USB drive was `/dev/sdb`. Now we need to format it:

```
sudo fdisk /dev/sdb
```

Now let's create a filesystem:

```
sudo mkfs.ext4 /dev/sdb
```

We want the drive mounted on boot. We need the UUID:

```
sudo blkid | grep /dev/sdb
```

We need a destination to mount the drive. This is the path you will use to
access files on the drive. In my case, I have a 4TB Western Digital Passport
drive, so I've named the directory to match. You can replace `passport-4tb`
with something like `usb1`, etc:

```
sudo mkdir /media/passport-4tb
```

Add the drive to fstab. Open the file:

```
sudo vim /etc/fstab
```

Add something like the following. Replace the UUID below with the UUID from
above, and if you didn't use `/media/passport-4tb` as the directory, change
that as well:

```
# Black WD Passport 4tb
UUID="5a11126d-4c6d-4e13-8dd8-a1e7b303648d" /media/passport-4tb ext4 defaults,errors=remount-ro 0 1
```

Test if the drive can be mounted:

```
sudo mount /media/passport-4tb
```

**If you see errors, remove the newly added lines from `/etc/fstab` and try
again!** If you reboot with this error happening your Pi will not come up
properly and you'll need to attach it to a monitor and keyboard.

If no errors were reported, allow the `pi` user to access the drive:

```
sudo chown pi:pi /media/passport-4tb
```

And test that you can actually write to it:

```
touch /media/passport-4tb/testfile
rm /media/passport-4tb/testfile
```

At this point, reboot to test that the drive is mounted properly:

```
sudo reboot
```

Wait for the system to come back up, `ssh` back and:

```
ls /media/passport-4tb
```

You should see `lost+found`.

Hard drive setup complete!

### OpenVPN/Private Internet Access Setup

First install OpenVPN:

```
sudo apt-get install openvpn
```

We need to download some SSL certificates from Private Internet Access:

```
sudo mkdir -p /etc/openvpn/pia-configs
cd /etc/openvpn/pia-configs
sudo wget https://www.privateinternetaccess.com/openvpn/openvpn.zip
sudo cp crl.rsa.2048.pem ca.rsa.2048.crt /etc/openvpn
```

Create the OpenVPN configuration file:

```
sudo vim /etc/openvpn/pia-us-east.conf
```

Add the following:

```
client
dev tun
proto udp
remote us-east.privateinternetaccess.com 1198
resolv-retry infinite
nobind
persist-key
persist-tun
cipher aes-128-cbc
auth sha1
tls-client
remote-cert-tls server
auth-user-pass pia-login.conf
comp-lzo
verb 1
reneg-sec 0
crl-verify crl.rsa.2048.pem
ca ca.rsa.2048.crt
disable-occ
script-security 2
#up /etc/openvpn/update-resolv-conf # intentionally commented out
#down /etc/openvpn/update-resolv-conf # intentionally commented out
```

Create a credentials file:

```
sudo vim /etc/openvpn/pia-login.conf
```

Add your username/password:

```
p123456789
popsecret
```

Deny read access from non-root users:

```
sudo chmod 600 /etc/openvpn/pia-login.conf
```

Set OpenVPN to start the `pia-us-east` connection by default:

```
sudo vim /etc/default/openvpn
```

Add a line with:

```
AUTOSTART="pia-us-east"
```

We'll use CloudFlare for DNS. This is an important step since we aren't
relying on OpenVPN to update DNS servers (I couldn't get it to work). If this
isn't done, OpenVPN can't resolve domain names.

```
sudo vim /etc/dhcpd.conf
```

Add a line to the bottom:

```
static domain_name_servers=1.1.1.1 1.0.0.1
```

Restart dhcpd and check that the changes were applied:

```
sudo /etc/init.d/dhcpcd restart
cat /etc/resolv.conf
```

You should see entries for `1.1.1.1` and `1.0.0.1`.

We can now try to start OpenVPN. We need to load the changes made to
`/etc/default/openvpn` first:

```
sudo systemctl daemon-reload
```

Now start OpenVPN:

```
sudo systemctl start openvpn
```

Check that the `tun` interface was created:

```
ifconfig
```

And verify you have an entry like this:

```
tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500
        inet 10.17.10.6  netmask 255.255.255.255  destination 10.17.10.5
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 100  (UNSPEC)
        RX packets 10185045  bytes 5262987527 (4.9 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 10933224  bytes 2755533996 (2.5 GiB)
        TX errors 0  dropped 91016 overruns 0  carrier 0  collisions 0
```

Check that your IP has changed. Run this on your main work station, and on the
Raspberry Pi and verify the IPs are different:

```
curl v4.ifconfig.co
```

At this point we can reboot and OpenVPN should come up on its own.

```
sudo reboot
```

After the Pi comes back up, try `ifconfig` and `curl v4.ifconfig.co` again and
verify their output is the same as before the reboot.

OpenVPN setup complete!

### iptables Setup

OpenVPN can crash, or an invalid config change could prevent it starting
altogether. If that happens, Deluge will happily seed on another interface
where your activity is visible. We can use `iptables` to firewall WAN traffic
when OpenVPN is down.

First we'll create a recovery script. In case things go wrong, this will allow
you to clear the firewall and start over.

```
vim firewall-blank.sh
```

Add the following:

```
# Allow everything
iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT

# Flush existing rules
iptables -F INPUT
iptables -F OUTPUT
iptables -F FORWARD
```

Run it:

```
sudo sh firewall-blank.sh
```

Check it was applied:

```
sudo iptables -L -n
```

You should see output like this:

```
Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
```

Now we will create another script for the real firewall:

```
vim firewall.sh
```

Add the following:

```
# Allow everything
iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT

# Flush existing rules
iptables -F INPUT
iptables -F OUTPUT
iptables -F FORWARD

# Allow established connections
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -m state --state RELATED,ESTABLISHED -j ACCEPT

# Accept all TUN connections (tun = VPN tunnel)
iptables -A OUTPUT -o tun+ -j ACCEPT
iptables -A INPUT -i tun+ -j ACCEPT

# Allow loopback device (internal communication)
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow all local traffic.
#
# IMPORTANT: Edit your IP address on the two lines below. For 192.168.1.x
# use `192.168.1.0/24`.
iptables -A INPUT -s 10.0.1.0/24 -j ACCEPT
iptables -A OUTPUT -d 10.0.1.0/24 -j ACCEPT

# Allow traffic to Cloudflare DNS, this is key!
iptables -A INPUT -s 1.1.1.1 -j ACCEPT
iptables -A OUTPUT -d 1.1.1.1 -j ACCEPT
iptables -A INPUT -s 1.0.0.1 -j ACCEPT
iptables -A OUTPUT -d 1.0.0.1 -j ACCEPT

# Allow multicast DNS (eg: raspberrypi.local)
iptables -A INPUT -p udp --sport 5353 -j ACCEPT
iptables -A OUTPUT -p udp --dport 5353 -j ACCEPT

# Allow VPN establishment
iptables -A OUTPUT -p udp --dport 1198 -j ACCEPT
iptables -A INPUT -p udp --sport 1198 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 1198 -j ACCEPT
iptables -A INPUT -p tcp --sport 1198 -j ACCEPT

# Allow traffic to PIA
# IMPORTANT: This **MUST** match the server name set in your pia config file
iptables -A INPUT -s us-east.privateinternetaccess.com -j ACCEPT
iptables -A OUTPUT -d us-east.privateinternetaccess.com -j ACCEPT

# Set default policies to log and drop all communication unless specifically allowed
iptables -P INPUT DROP
iptables -P OUTPUT DROP
iptables -P FORWARD DROP
```

Run the firewall script:

```
sudo sh firewall.sh
```

Verify the rules have been added:

```
sudo iptables -L -n
```

Let's disable IPv6 too so we only have to manage one set of rules:

```
sudo vim /etc/sysctl.conf
```

Add the following line to the bottom of the file:

```
net.ipv6.conf.all.disable_ipv6 = 1
```

Check that you can access the world:

```
curl -L google.com
```

At this point the firewall is working, but it is not persisted on reboots. To
solve that:

```
sudo apt-get install iptables-persistent
sudo sh -c 'iptables-save -c > /etc/iptables/rules.v4'
```

Let's reboot:

```
sudo reboot
```

And verify the rules are still active:

```
sudo iptables -L -n
```

Firewall setup complete!

### Deluge Setup

Now let's setup Deluge. First install it:

```
sudo apt-get install deluged deluge-web deluge-console
```

We'll use a dedicated system user to run the program:

```
sudo adduser --system --gecos "Deluge Service" --disabled-password --group --home /var/lib/deluge deluge
```

Create logging directories:

```
sudo mkdir -p /var/log/deluge
sudo chown -R deluge:deluge /var/log/deluge
sudo chmod -R 750 /var/log/deluge
```

Create a systemd unit to start/stop deluge-web:

```
sudo vim /etc/systemd/system/deluge-web.service
```

Add the following:

```
[Unit]
Description=Deluge Bittorrent Client Web Interface
Documentation=man:deluge-web
After=network-online.target deluged.service
Wants=deluged.service

[Service]
Type=simple
UMask=027

ExecStart=/usr/bin/deluge-web -l /var/log/deluge/web.log -L warning

Restart=on-failure

[Install]
WantedBy=multi-user.target
```

We'll also configure deluge-web to use the deluge user:

```
sudo mkdir /etc/systemd/system/deluge-web.service.d
sudo vim /etc/systemd/system/deluge-web.service.d/user.conf
```

Add the following:

```
# Override service user
[Service]
User=deluge
Group=deluge
```

Create a systemd unit to start/stop deluged:

```
sudo vim /etc/systemd/system/deluged.service
```

Add the following:

```
[Unit]
Description=Deluge Bittorrent Client Daemon
Documentation=man:deluged
Wants=sys-devices-virtual-net-tun0.device
After=sys-devices-virtual-net-tun0.device

[Service]
Type=simple
UMask=007

ExecStart=/usr/bin/deluged -d -l /var/log/deluge/daemon.log -L warning

Restart=on-failure

# Time to wait before forcefully stopped.
TimeoutStopSec=300

[Install]
WantedBy=multi-user.target
```

We'll also configure deluged to use the deluge user:

```
sudo mkdir /etc/systemd/system/deluged.service.d
sudo vim /etc/systemd/system/deluged.service.d/user.conf
```

Add the following:

```
# Override service user
[Service]
User=deluge
Group=deluge
```

Load the new configs:

```
sudo systemctl daemon-reload
```

Start `deluged` and `deluge-web`:

```
sudo systemctl start deluged
sudo systemctl start deluge-web
```

Now open your browser to `http://raspberrypi.local:8112` and you should see
the Deluge web interface. If that works, run the following to start the
services on boot:

```
sudo systemctl enable deluged
sudo systemctl enable deluge-web
```

Now we will move Deluge configs to the USB hard drive. This way, if the Pi's
SD card ever becomes corrupt, the Deluge configuration is saved to more
durable storage.

First shutdown Deluge:

```
sudo systemctl stop deluged
sudo systemctl stop deluge-web
```

Copy the existing configuration files to the USB drive:

```
sudo mkdir /media/passport-4tb/Deluge
sudo cp -rp /var/lib/deluge/.config/deluge /media/passport-4tb/Deluge/Config
```

Now we'll use a bind mount to place these files in the location Deluge
expects. First, move the old files out of the way, and create an empty
directory:

```
sudo mv /var/lib/deluge/.config/deluge /var/lib/deluge/.config/deluge-old
sudo mkdir /var/lib/deluge/.config/deluge
```

Open up `/etc/fstab` again, and add the following (make sure to edit
`passport-4tb` if you used another name):

```
/media/passport-4tb/Deluge/Config     /var/lib/deluge/.config/deluge/  none bind
```

Test that you can mount it:

```
sudo mount /var/lib/deluge/.config/deluge
sudo ls /var/lib/deluge/.config/deluge
```

Start Deluge again and it now uses the config files from the USB drive:

```
sudo systemctl start deluged
sudo systemctl start deluge-web
```

Now to configure Deluge to look on the USB drive.

First let's create some directories:

```
sudo mkdir /media/passport-4tb/Deluge/Downloads \
  /media/passport-4tb/Deluge/Watch \
  /media/passport-4tb/Deluge/Torrents
```

And allow the `pi` user and `deluge` group access:

```
sudo chown pi:deluge /media/passport-4tb/Deluge/Downloads \
  /media/passport-4tb/Deluge/Watch \
  /media/passport-4tb/Deluge/Torrents
```

Back to the web interface at `http://raspberrypi.local:8112`.

1. Click the Preferences button in the top navbar.
2. Click Downloads on the left sidebar of the Preferences window.
3. Set "Download to" to `/media/passport-4tb/Deluge/Downloads`.
4. Leave "Move completed to" unchecked.
5. Check "Copy of .torrent files to" and set it to
   `/media/passport-4tb/Deluge/Torrents`.
6. Check "Autoadd .torrent files from" and set it to
   `/media/passport-4tb/Deluge/Watch`.
7. _Optional_: If you want, check "Add torrents in Paused state".

At this point Deluge should be fully setup! Reboot the Pi once more:
that both services started:

```
sudo reboot
```

And verify both services started

```
sudo systemctl status deluged
sudo systemctl status deluge-web
```

And make sure you can still access the web interface at `http://raspberrypi.local:8112`.

A couple small conveniences before we wrap up:

```
cd /home/pi
ln -s /media/passport-4tb/Deluge/Downloads
ln -s /media/passport-4tb/Deluge/Watch
```

If you have a `.torrent` file on your work station, you can upload it and have
it automatically added to Deluge:

```
scp ubuntu.iso.torrent pi@raspberrypi.local:Watch
```

Or to download a file:

```
scp pi@raspberrypi.local:Downloads/ubuntu.iso .
```

Deluge setup complete!
