---
date: "Sat Feb 23 03:00:14 -0500 2013"
title: "Xcode 4.6 and ruby-build"
category: dev
redirect_from: /blog/2013/xcode-4-6-and-ruby-build.html
---

I've been having trouble compiling Ruby 1.9.3 since updating to Xcode 4.6.
After a little Googling, it turns out that the error is with some invalid
CFLAGS set in Ruby's compile scripts.

The flag can be tweaked as follows:

```
CFLAGS="-Wno-error=shorten-64-to-32" rbenv install 1.9.3-p392
```

Hopefully future versions of Ruby will address this.
