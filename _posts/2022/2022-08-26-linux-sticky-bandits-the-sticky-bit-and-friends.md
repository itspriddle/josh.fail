---
title: "Linux Sticky Bandits (the sticky bit and friends)"
date: "Fri Aug 26 20:51:46 -0400 2022"
category: dev
tags: [linux]
---

I always have to look up [how to apply sticky bit/suid/sgid][1], so I am
bookmarking it here for future reference.

tl;dr:

| Command   | Effect                                                                                                                                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| chmod u+s | a file with this set always executes as the user who owns the file                                                                                                                                    |
| chmod g+s | a file with this set allows the file to be executed as the group that owns the file; a directory with this set causes files created under it to have their group ownership set to the directory owner |
| chmod o+t | file can only be deleted by its owner                                                                                                                                                                 |

[1]: https://www.redhat.com/sysadmin/suid-sgid-sticky-bit
