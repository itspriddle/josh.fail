---
title: Good times with rar
category: dev
redirect_from:
- /blog/2007/good-times-with-rar.html
- /dev/2007/good-times-with-rar.html
tags: [linux, rar]
---

So I decided today I was going to make a DVD backup of my music collection.
I also decided I was going to use **rar** to do this.

After about an hour of googling, I had come up with

    $ rar a -r -v2100m -vn -m0 -tk -ri15 ~/music-2007-05-26 music

That seemed to work perfectly. The `a` is for add, `r` is for recursive,
`v2100m` says split into 2100mb files, `vn` simply says to call the file
`.rar`, `.r00`, `.r01` rather than `file.part1.rar`, `file.part2.rar`, `m0`
says not to use compression, `tk` maintains the date on the file, `ri15` says
to run as the highest priority on the system.

I got halfway done and decided to check a rar. So I ran `rar e
music-2007-05-25.rar` and found that the files were there, but none of the
directories had been copied. So I stopped the process and tried just about
every switch I could find. Another hour of googling - and I find out that
`rar e` does that, `rar x` maintains the directories.

I really hate linux some days. What a waste of time that was.
