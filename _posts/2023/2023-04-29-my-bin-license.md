---
title: "My bin: license"
date: "Sat Apr 29 20:41:18 -0400 2023"
category: dev
---

I grabbed this simple `license` script from @defunkt back in July 2010 which
prints a copy of the MIT license with my name/email as the copyright.

```sh
#!/bin/sh
# Usage: license
# Prints an MIT license appropriate for totin' around.
#
#   $ license > COPYING
#
# Original version by Chris Wanstrath:
# http://gist.github.com/287717
exec sh -c "tail -n +$(($LINENO + 2)) < $0 | sed s/DATE/$(date +%Y)/"

MIT License

Copyright (c) DATE Joshua Priddle <jpriddle@me.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

It's pretty neat how this works. The `$LINENO` bit basically takes all content
from the `MIT License` line and down, then passes it to `sed` to insert
today's year.

Use it like so:

```sh
license > LICENSE
```
