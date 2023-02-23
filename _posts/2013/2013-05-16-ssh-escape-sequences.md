---
date: "Thu May 16 18:27:38 -0400 2013"
title: "SSH Escape Sequences"
category: dev
redirect_from:
- /blog/2013/ssh-escape-sequences.html
- /dev/2013/ssh-escape-sequences.html
tags: [ssh, linux, shell]
---

Today, I learned about a bunch of escape sequences that SSH supports.

| Sequence | Description                                              |
| :------: | :--------------------------------------------------------|
| `~.`     | terminate connection (and any multiplexed sessions)
| `~B`     | send a BREAK to the remote system
| `~C`     | open a command line
| `~R`     | Request rekey (SSH protocol 2 only)
| `~^Z`    | suspend ssh
| `~#`     | list forwarded connections
| `~&`     | background ssh (when waiting for connections to terminate)
| `~?`     | this message
| `~~`     | send the escape character by typing it twice

For example, you can suspend the SSH process itself to return to your local
shell by typing `~^Z` (that's `~ + ctrl + z`). I've been using SSH for years,
but had no idea these existed.
