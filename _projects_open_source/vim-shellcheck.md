---
title:  vim-shellcheck
period: Sep 2018 - Present
date:   2018-09-01
github: https://github.com/itspriddle/vim-shellcheck
tags:
  - bash
  - git
  - github
  - open source
  - shellcheck
  - vim plugin
---

Vim wrapper for [ShellCheck][], a static analysis tool for shell scripts.

It adds adds `:ShellCheck` and `:LShellCheck` commands to run ShellCheck on the
current buffer (or custom range/visual selection). Errors are sent to the
quickfix/location list window, and in error windows, `gb` opens the GitHub wiki
page for the error in a browser.

[ShellCheck]: https://github.com/koalaman/shellcheck
