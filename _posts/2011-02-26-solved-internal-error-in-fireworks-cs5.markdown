---
layout: post
title: "Solved: Internal Error in Fireworks CS5 on OS X"
published: true
categories:
- Development
---

I tried opening Fireworks earlier and got an awesome error "Internal Error",
and the program promptly crashed.

After a bunch of Googling, I found a possible cause was user fonts. So I
ran `mkdir ~/Library/Fonts-backup && mv ~/Library/Fonts/* ~/Library/Fonts-backup`
and rebooted.

I'm happy to report Fireworks now opens. Hope it helps someone else.
