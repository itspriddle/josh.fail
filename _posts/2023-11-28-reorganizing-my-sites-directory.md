---
title: "Reorganizing my ~/Sites directory"
date: "Tue Nov 28 14:51:56 -0500 2023"
category: dev
---

I keep all my websites' source code under `~/Sites`. I've always just named
them like `~/Sites/josh.fail`. A while ago, while looking at how `launchd`
names its plist files, like `com.apple.iTunes`, I realized that would be a
great way to organize my `~/Sites` directory so that sites under the same
domain show up next to each other with `ls` or in Finder.

```text
% ls ~/Sites
fail.josh
io.github.itspriddle
wedding.chrysandjosh
wedding.chrysandjosh.gallery
xyz.priddle
xyz.priddle.cv
xyz.priddle.recipes
xyz.priddle.resume
```

It only took me 25 years to figure out a better way.
