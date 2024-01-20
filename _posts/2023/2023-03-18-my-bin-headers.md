---
title: "My bin: headers"
date: "Sat Mar 18 22:03:02 -0400 2023"
category: dev
---

One of my most used scripts, I snagged of GitHub way back in 2010: `headers`.

It's stupidly simple:

```sh
#!/bin/sh

curl -sv "$@" 2>&1 >/dev/null |
	grep -v "^\*" |
	grep -v "^}" |
	cut -c3-
```

And I use it like this:

```sh
headers https://www.example.com/
```

Or if I want to follow redirects:

```sh
headers -L https://www.example.com/
```

I know there are plenty of cooler tools out there, but this has treated me
well for 13 years now and works everywhere. I highly recommend throwing it in
your bin, too.
