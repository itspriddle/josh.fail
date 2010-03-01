---
layout: post
title: Good times with rar
---
So I decided today I was going to make a DVD backup of my music collection.  I also decided I was going to use rar to do this.

After about an hour of googling, I had come up with

<code>$ rar a -r -v2100m -vn -m0 -tk -ri15 ~/music-2007-05-26 music</code>

That seemed to work perfectly.  The <strong>a</strong> is for add, <strong>r</strong> is for recursive, <strong>v2100m</strong> says split into 2100mb files, <strong>vn</strong> simply says to call the file .rar, .r00, .r01 rather than file.part1.rar, file.part2.rar, <strong>m0</strong> says not to use compression, <strong>tk</strong> maintains the date on the file, <strong>ri15</strong> says to run as the highest priority on the system.

I got  halfway done and decided to check a rar.  So I ran <code>rar e music-2007-05-25.rar</code> and found that the files were there, but none of the directories had been copied.  So I stopped the process and tried just about every switch I could find.  Another hour of googling - and I find out that <code>rar e</code> does that, <code>rar x</code> maintains the directories.

I really hate linux some days.  What a waste of time that was.
