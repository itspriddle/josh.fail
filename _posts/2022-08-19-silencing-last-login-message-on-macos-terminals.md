---
title: "Silencing \"last login\" message on macOS terminals"
date: "Fri Aug 19 11:28:43 -0400 2022"
category: dev
---

I got annoyed by the "Last login: Fri Aug 19: 11:23:33" messages I saw in
Terminal.app when opening new tabs (in spite of seeing them daily for years).
Here's how I solved it.

It turns out this behavior _used_ to be handled by `~/.hushlogin`, which I
already have in place to surpress `/etc/motd` output. Around macOS Yosemite
that behavior changed so it only works in new _windows_, not new _tabs_.

I found [this SO post][1] that outlines what the cause is and how one can tell
Terminal.app to use a custom login command.

In Terminal.app preferences, General, I set "Shells open with" to "Command"
with:

```
/usr/bin/login -fpql priddle /bin/zsh -l
```

I'm mainly documenting this here so I remember what I did if I need to revert
or apply it to other Macs. Time will tell if I regret it 😅

[1]: https://stackoverflow.com/questions/15769615/remove-last-login-message-for-new-tabs-in-terminal#comment109701003_16181082
