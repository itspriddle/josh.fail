---
title: "Allow binding ctrl-s and ctrl-q in Terminal.app"
category: dev
redirect_from: /blog/2012/allow-binding-ctrl-s-and-ctrl-q-in-terminal-app.html
---

I ran into an annoying issue trying to configure `ctrl-q` as a Vim mapping in
Terminal.app for OS X. It turns out that [flow
control](http://unix.stackexchange.com/a/12146) was blocking it. I had
mistakenly thought that the flow control keys only applied to things like
`less` or `more`.

I never use flow control, so I've opted to disable it in my shell using
[this tip](http://apple.stackexchange.com/a/34503):

    stty -ixon -ixoff
