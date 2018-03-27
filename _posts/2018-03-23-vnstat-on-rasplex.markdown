---
layout: default
title: "vnStat on RasPlex"
date: "Fri Mar 23 23:10:32 -0400 2018"
---

tl;dr: Want [vnStat][] on [RasPlex][]? Check out [rasplex-vnstat][]!

I love [vnStat][] for monitoring network traffic on my servers. I wanted to
use it on my Raspberry Pis running RasPlex, but the underlying LibreELEC
distribution does not allow installing software with `apt-get` and does not
include the necessary libraries to compile it from source.

I realized that I could compile it from another Raspberry Pi and copy the
binaries/configs to the RasPlex box. Once I worked out the paths that would be
needed to run it on RasPlex, this was pretty easy to setup.

On a second Raspberry Pi --- in this case a Raspberry Pi 2 Model B+ --- I used
the following process to compile vnStat:

We're going to be working in root owned paths, so get a root shell:

```
sudo -i
```

RasPlex lets user data be written to `/storage/`. Let's create the directories
necessary to run a local installation of vnStat:

```
mkdir -p /storage/local/{src,bin,sbin,etc,run,var/{lib,log}/vnstat}
```

Now download the vnStat source:

```
cd /storage/local/src
wget https://github.com/vergoh/vnstat/releases/download/v1.18/vnstat-1.18.tar.gz
```

And compile it:

```
tar -vzxf vnstat-1.18.tar.gz
./configure --prefix=/storage/local --sysconfdir=/storage/local/etc
make
```

Install it:

```
cp vnstat /storage/local/bin
cp vnstatd /storage/local/sbin
```

Configure it:

```
sed 's|^DatabaseDir.*$|DatabaseDir "/storage/local/var/lib/vnstat"|;s|^LogFile.*$|LogFile "/storage/local/var/log/vnstat/vnstat.log"|;s|^PidFile.*$|PidFile "/storage/local/run/vnstat/vnstat.pid"|' cfg/vnstat.conf > /storage/local/etc/vnstat.conf
```

If you are using WiFi instead of wired ethernet, update `vnstat.conf` to
configure the default interface:

```
sed -i 's|^Interface "eth0"$|Interface "wlan0"|' /storage/local/etc/vnstat.conf
```

Now we can package this installation and copy it to the RasPlex box:

```
tar -vzcf rasplex-vnstat.tar.gz {bin,sbin,etc,run/vnstat,var/{log,lib}/vnstat}
scp rasplex-vnstat.tar.gz root@rasplexip:
```

SSH into the RasPlex box to install `rasplex-vnstat.tar.gz`. Create the necessary directories:

```
mkdir /storage/local
mv rasplex-vnstat.tar.gz /storage/local
cd /local/storage
```

Extract the tarball:

```
tar -vzxf rasplex-vnstat.tar.gz
```

Since `/storage/local/bin` is not in `PATH`, we can update `~/.profile` to add
it:

```
echo 'export PATH="/storage/local/bin:/storage/local/sbin:$PATH"' >> /storage/.profile
```

Test that it works:

```
source /storage/.profile
vnstat --help
```

vnStat will look for a configuration at `~/.vnstatrc`, we can symlink it to
the `vnstat.conf` file generated above:

```
ln -s /storage/local/etc/vnstat.conf /storage/.vnstatrc
```

We need to ensure that `vnstatd` is started to collect traffic stats. I used a
simple crontab to do this. This will create or update the crontab on RasPlex
do check that `vnstatd` is running every 5 minutes and start it if necessary:

```
( crontab -l 2> /dev/null | grep -v vnstatd; echo '*/5 * * * * /usr/bin/pgrep vnstatd >/dev/null || /storage/local/sbin/vnstatd -d > /dev/null' ) | crontab -
```

Either wait ~5 minutes until `pgrep vnstatd` starts, or start it manually:

```
vnstatd -d
```

Done! Now you can run `vnstat` to view your traffic. Hope it helps someone!

[rasplex-vnstat]: https://github.com/itspriddle/rasplex-vnstat
[vnStat]: http://humdi.net/vnstat/
[RasPlex]: http://www.rasplex.com/
