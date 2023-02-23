---
title: "Shell Tricks: Pretty Printing the name of your program"
date: "Thu Jan 27 02:34:16 -0500 2022"
category: dev
tags: [bash, shell]
---

You might need to print or use the name of your program itself --- what you
would see if you ran `basename my-script.sh`. tl;dr: use `${0##*/}`.

This is the same thing as `basename`, but, it is faster since you don't have
to shell out.

To expand on this, first, why would you need the name of your program? Usually
this is for help text, error output, or interactive prompts. I most commonly
use it for errors.

Suppose I had a `/usr/local/bin/mmm-bacon` script:

```bash
#!/usr/bin/env bash

if [[ -f ~/.config/bacon.json ]]; then
  echo "${0##*/}: Error, no bacon!"
  exit 1
fi
```

Here, `${0##*/}` outputs `mmm-bacon`.

Breaking down the syntax:

- `$0` refers to the full path of the script running, which would be
  `/usr/local/bin/mmm-bacon` in the example
- `${ }` is a way to use [parameter expansion][1]
- `##` says replace from the start of the string to the last match
- `*/` match against any character, followed by a `/`

Or, in English: strip everything from the start of the script path to the last
`/` character.

[1]: https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html
