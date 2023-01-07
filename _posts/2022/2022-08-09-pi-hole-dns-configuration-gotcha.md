---
title: "Pi-hole/DNS configuration gotcha"
date: "Tue Aug 09 15:05:22 -0400 2022"
category: dev
---

I've been running Pi-hole off and on for a few years. It mostly works great,
but it would randomly stop working and I'd see ads again. I could never track
down what was happening --- until recently.

I've been redesigning my home network the last couple of weeks. This included
revamping my Pi-hole setup, and I finally set about fixing that problem.

Like many of you, when I setup my computers' DNS servers to use Pi-hole, I saw
that secondary server option and plugged in Google or CloudFlare. I thought
that configuration would behave such that the Pi-hole was always used unless
it was offline, and then the computer would fallback to the secondary DNS
server.

That is **not** what happens!

To test this, I setup two separate Pi-holes and configured my computers to use
them. Hourly, I saw random PTR requests hitting that second Pi-hole.

As it turns out, your computer can use _any_ DNS server at _any_ time. In an
effort to add redundancy, I'd inadvertantly set my computers to randomly
choose a non-Pi-hole DNS server.

I ended up leaving that 2nd Pi-hole on my network and have set all my
computers to use them. Solid ad-blocking, finally!
