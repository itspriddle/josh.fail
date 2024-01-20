---
title: "Star Wars in telnet or bash"
date: "Mon Jan 23 11:31:11 -0500 2023"
category: dev
---

An oldie but a goodie I had to look up today---the entirety of Star Wars
Episode IV is available via telnet.

```
telent telnet towel.blinkenlights.nl
```

If you're on a mac or other system without telnet, you can use Bash:

```
bash -c 'cat < /dev/tcp/towel.blinkenlights.nl/23'
```

Computers: So dumb. So fun.
