---
title: "rsync compression is slow afterall"
date: "Fri Aug 26 21:05:57 -0400 2022"
---

I tested compression in rsync on a big file and, no surprise, it's pretty
slow (about 9x slower).

```
pi@server ~ % rsync -P -auvz Downloads/BigFile foo@synology.local::Share/tmp/
sending incremental file list
BigFile/
BigFile/BigFile.mkv
    978,365,484 100%    9.98MB/s    0:01:33 (xfr#1, to-chk=1/1)
pi@server ~ % rsync -P -auv Downloads/BigFile foo@synology.local::Share/tmp/
sending incremental file list
BigFile/
BigFile/BigFile.mkv
    978,365,484 100%   91.29MB/s    0:00:10 (xfr#1, to-chk=1/1)`
```

- Raspberry Pi 4 8gb + USB 3 drive
- Synology DS1522+ NAS
- 1gb wired network
