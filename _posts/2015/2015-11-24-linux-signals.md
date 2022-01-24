---
title: "Linux Signals"
date: "Tue Nov 24 19:00:00 -0500 2015"
category: dev
redirect_from: /blog/2015/linux-signals.html
---

I found a great list of signals in Linux.

### COMMON SIGNALS

Signal name | Number | Default action | Description
:---------: | :----: | :------------: | -----------
SIGHUP      | 1      | Term           | Some daemons interpret this to mean "re-read your configuration"
SIGINT      | 2      | Term           | This signal is sent by C on the terminal
SIGTRAP     | 5      | Core           | Trace/breakpoint trap
SIGBUS      | 7      | Core           | Invalid memory access (bad alignment)
SIGFPE      | 8      | Core           | Arithmetic error such as divide by zero
SIGKILL     | 9      | Term           | Lethal signal, cannot be caught or ignored
SIGSEGV     | 11     | Core           | Invalid memory access (bad address)
SIGPIPE     | 13     | Term           | Write on a pipe with no one to read it
SIGALRM     | 14     | Term           | Expiry of alarm clock timer
SIGTERM     | 15     | Term           | Polite "please terminate" signal
SIGCHLD     | 17     | Ignore         | Child process has terminated

From: <http://www.linuxvoice.com/core-technology-signals/>
