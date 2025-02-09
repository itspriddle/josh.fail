---
title: "Public IP lookup from CloudFlare DNS"
date: "Wed May 29 00:57:41 -0400 2024"
category: dev
---

I wanted a quick way to grab my public IP address from the command line. I
found that CloudFlare's DNS service allows this by looking up TXT records for
`whoami.cloudflare`.

```bash
dig @1.1.1.1 ch txt whoami.cloudflare +short | tr -d '"'
```
