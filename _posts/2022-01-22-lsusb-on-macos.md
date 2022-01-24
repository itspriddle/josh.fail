---
title: "lsusb on macOS"
date: "Sat Jan 22 15:12:44 -0500 2022"
category: dev
---

[Shelby][] shared [`lsusb`][lsusb] yesterday, a bash script that provides `lsusb`
on macOS for listing USB devices.

```
~ % lsusb
Bus 000 Device 001: ID 2109:0817 VIA Labs, Inc. USB3.0 Hub 
Bus 000 Device 006: ID 152d:0583 JMicron Technology Corp. External  Serial: DD56419883A28
Bus 000 Device 004: ID 058f:8468 Alcor Micro, Corp. Mass Storage Device  Serial: 058F84688461
Bus 000 Device 003: ID 2109:0817 VIA Labs, Inc. USB3.0 Hub 
Bus 000 Device 002: ID 2109:2817 VIA Labs, Inc. USB2.0 Hub 
Bus 000 Device 005: ID 2109:2817 VIA Labs, Inc. USB2.0 Hub 
Bus 000 Device 007: ID 2109:8817 VIA Labs, Inc. USB Billboard Device  Serial: 0000000000000001
Bus 000 Device 008: ID 2109:8817 VIA Labs, Inc. USB Billboard Device  Serial: 0000000000000001
Bus 002 Device 001: ID b58e:9e84 b58e Yeti Stereo Microphone  Serial: 797_2019/12/16_08248
Bus 003 Device 001: ID 043e:9a44 LG Electronics USA Inc. USB3.1 Hub 
Bus 003 Device 003: ID 043e:9a00 LG Electronics USA Inc. Hub 
Bus 003 Device 009: ID 043e:9a4d LG Electronics USA Inc. LG UltraFine Display Camera 
Bus 003 Device 002: ID 043e:9a46 LG Electronics USA Inc. USB2.1 Hub 
Bus 003 Device 006: ID 05ac:0265 Apple Inc. Magic Trackpad 2  Serial: CC29394016EJ17LA2
Bus 003 Device 005: ID 10c4:ea60 Silicon Laboratories, Inc. MuteSync Button  Serial: S7GWBRO3JUH8AF
Bus 003 Device 024: ID 3434:0111 3434 Keychron Q2 
Bus 003 Device 004: ID 043e:9a02 LG Electronics USA Inc. Hub  Serial: 0C0B00896BFB
Bus 003 Device 008: ID 043e:9a40 LG Electronics USA Inc. USB Controls 
Bus 003 Device 007: ID 043e:9a4b LG Electronics USA Inc. USB Audio 
Bus 000 Device 000: ID 2109:0817 VIA Labs, Inc. USB 3.1 Bus 
Bus 000 Device 001: ID 1d6b:1100 Linux Foundation USB 3.0 Bus 
Bus 000 Device 001: ID 1d6b:1100 Linux Foundation USB 3.0 Bus 
```

[Shelby]: https://shelbydenike.com
[lsusb]: https://github.com/jlhonora/lsusb

