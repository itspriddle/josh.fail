---
title: "Did you know: wildcard SSL certificates and subdomains"
date: "Thu Jun 16 16:05:29 -0400 2022"
category: dev
tags: [ssl, sysadmin]
---

Did you know wildcard SSL certificates only support one level of subdomain?

That is, a certificate for `*.foo.com` will allow one single subdomain, i.e.:

- mail.foo.com
- ftp.foo.com
- www.foo.com

They do **not** work for extra levels, i.e.:

- test.mail.foo.com
- tools.staff.foo.com
- many.many.many.levels.foo.com

You need a _separate_ certificate for each level of subdomains. For example
you would need a separate wildcard certificate for `*.mail.foo.com` to allow
it to work on any subdomain under `mail.foo.com`.

It's a common misconception that a wildcard works on ANYTHING, so I hope this
helps someone out of a head-scratcher.
