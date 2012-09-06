---
layout: default
title: "Restoring files from OS X Time Machine with Terminal.app"
date: "Wed Sep 05 23:40:59 -0400 2012"
---

I use Time Machine on OS X to keep backups of my hard drive. Overall it is a
great program. However, restoring files can be a slow and cumbersome process.

I've tried using `cp` in Terminal.app:

    cd /Volumes/Backup/Backups.backupdb/Joshua\ Priddle’s\ MacBook\ Pro/Latest/Macintosh\ HD/Users/priddle
    cp secret_docs.txt ~/

It _appears_ to work, until you try working with a restored file. The file
will have incorrect permissions and you will not be able to write to it.

I finally spent 10 seconds to Google this problem, and found
[this solution](http://support.apple.com/kb/HT5139).

In short, to restore files from Time Machine in the terminal, you should use
`tmutil` instead of `cp`:

    cd /Volumes/Backup/Backups.backupdb/Joshua\ Priddle’s\ MacBook\ Pro/Latest/Macintosh\ HD/Users/priddle
    tmutil restore -v secret_docs.txt ~/
