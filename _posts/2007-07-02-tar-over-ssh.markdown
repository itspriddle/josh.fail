---
layout: post
title: tar over ssh
categories:
  - linux
---
I figured out this easy way to make a backup over ssh.

    ssh remoteserver "cd source/dir &amp;&amp; tar -vzcf - ." &gt; yourbackup.tgz

You can also do this (not sure if it really makes a difference)

    tar -vzcf - . | ssh remoteserver "cat &gt; yourbackup.tgz"
