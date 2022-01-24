---
title: How to Mount a USB Drive on Linux
category: dev
redirect_from: /blog/2021/mount-a-usb-drive-on-linux.html
---

Need to mount a USB drive on Linux?

First, plug the drive in. Use `sudo fdisk -l` to view disks attached to the
system. Look for an entry corresponding to the disk you've just inserted:

```
Disk /dev/sda: 119.5 GiB, 128320801792 bytes, 250626566 sectors
Disk model: Flash Drive FIT
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 4FD2D271-36AF-B847-916F-03EABE1BF0CF

Device     Start       End   Sectors   Size Type
/dev/sda1   2048 250626532 250624485 119.5G Linux filesystem
```

We want the Device here, which is `/dev/sda1`.

Next, we must prepare a mount point for the disk. Let's assume this disk will
be known as `/mnt/usb-drive`:

```
sudo mkdir /mnt/usb-drive
```

Now we are ready to mount the drive:

```
sudo mount /dev/sda1 /mnt/usb-drive
```

Try accessing the drive:

```
cd /mnt/usb-drive
ls
```

Yay! Can we write?

```
cd /mnt/usb-drive
touch asdf
touch: cannot touch '/mnt/usb-drive/asdf': Permission denied
```

Oh no! This is happening because the mount directory is owned by root. Change
it to your current user with:

```
sudo chown $USER:$USER /mnt/usb-drive
```

Let's try again:

```
cd /mnt/usb-drive
touch asdf
ls asdf
```

Yay!
