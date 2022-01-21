---
title: "Warn when macOS adds path_helper to zprofile and profile on OS updates"
date: "Fri Jun 05 17:16:18 -0400 2020"
---

If you like to manually set your `$PATH` on macOS, you may have updated
`/etc/zprofile` (for ZSH) or `/etc/profile` (for Bash) to eliminate calls to
`path_helper`. Unfortunately, macOS will update these files when you install
OS updates. I've been bitten by this changing my `$PATH`, so I came up with
the following snippet to warn when it happens.

For ZSH, in `~/.zshenv` you can add the following to print a red warning when
`path_helper` is enabled:

```sh
if [[ $- == *i* ]] && [[ -r /etc/zprofile ]] && grep -E '^\s*eval `/usr/libexec/path_helper' /etc/zprofile > /dev/null; then
  echo "\033[31m!!! WARNING: macOS path_helper enabled in /etc/zprofile !!!\033[m" >&2
fi
```

If you are using Bash, edit `~/.bash_profile` instead and replace `zprofile`
with `profile` in the snippet.

This has saved me a lot of time troubleshooting issues after installing OS
updates. Hope it helps someone else!
