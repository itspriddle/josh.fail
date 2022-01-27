---
title: "Shell Tricks: Detecting if your script is being piped"
date: "Thu Jan 27 02:13:48 -0500 2022"
category: dev
---

If you need to check if a shell script is being piped to another program (i.e.
`bash yourscript.sh | less`) you can use `test -t 1` and friends.

I use this in most scripts that I have that output some kind of color or
special formatting. That way if I pipe them to a different program it receives
input without any colors.

Suppose you have `example.sh`:

```bash
#!/usr/bin/env bash

if [[ -t 1 ]]; then
  printf "\e[031%s\e[0m\n" "Danger!"
else
  echo "Danger!"
fi
```

If you run `bash example.sh` you'll see "Danger!" in red text. But, if you run
`bash example.sh | cat` you'll see "Danger!" in your default text color.

---

**Note:** `test` is the same as `[`, while Bash/ZSH also have `[[` which accepts
    the same arguments as `test` but adds new behavior. You probably always
    want to use `[[` unless you're targeting POSIX sh.
