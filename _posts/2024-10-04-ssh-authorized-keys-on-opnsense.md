---
title: "~/.ssh/authorized_keys on OPNsense"
date: "Fri Oct 04 22:18:06 -0400 2024"
category: dev
---

Hit a gotcha on OPNsense today with `~/.ssh/authorized_keys` not working as
expected.

I had edited the file manually. Turns out, you have to add authorized keys via
the web interface by editing the user. Annoying way to lose an hour 😭
