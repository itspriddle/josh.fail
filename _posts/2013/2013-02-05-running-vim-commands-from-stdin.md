---
date: "Tue Feb 05 20:33:48 -0500 2013"
title: "Running Vim commands from stdin"
category: dev
redirect_from:
- /blog/2013/running-vim-commands-from-stdin.html
- /dev/2013/running-vim-commands-from-stdin.html
tags: [vim]
---

Vim has a handy feature that allows you to run commands from a file when you
open a new session.

For example, suppose you have a file, `/tmp/my-vim-commands` containing
`ggIHello World`. To execute this, open MacVim with `mvim -s
/tmp/my-vim-commands`. When the session starts, it will run those commands.
Then move to the top of the buffer, switch to Insert mode at the beginning of
the line, and enter the text "Hello World".

To read commands in from stdin instead of an actual file, you can use `cat`
and `/dev/stdin`:

```
cat <<CMD | mvim -s /dev/stdin
gg
IHello World
CMD
```

**Note**: This doesn't seem to work with console Vim, it throws an error "Vim:
Warning: Input is not from a terminal".
