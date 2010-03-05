---
layout: post
title: tar over ssh
categories:
  - Linux
---
I figured out this easy way to make a backup over ssh.

    ssh remoteserver "cd source/dir && tar -vzcf - ." > yourbackup.tgz

You can also do this (not sure if it really makes a difference)

    tar -vzcf - . | ssh remoteserver "cat > yourbackup.tgz"
