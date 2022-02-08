---
title: "Shell Tricks: Colorized output"
date: "Tue Feb 28 18:09:00 -0500 2017"
category: dev
redirect_from:
- /blog/2017/shell-tricks-colorized-output.html
- /dev/2017/shell-tricks-colorized-output.html
---

This is part 3 of my series on tricks I've used in shell scripts. In this
post, I'll share a few ways I've <span style="color:#ff0000;">c</span><span
style="color:#ff7f00;">o</span><span style="color:#ffbf00;">l</span><span
style="color:#ffff00;">o</span><span style="color:#00ff00;">r</span><span
style="color:#00ffff;">i</span><span style="color:#0080ff;">z</span><span
style="color:#0000ff;">e</span><span style="color:#8b00ff;">d</span> text in
shell scripts.

Terminals use [escape codes][ANSI Escape Codes] to control colors. In Bash or
ZSH scripts, these are typically expressed as `\e ...` or `\033 ...` (or
sometimes `^[`, although that is actually typed by pressing `Ctrl-V`, `[`, NOT
`^`, `[`). I tend to see more cases of `\e` than `\033` in the wild.

An example of printing red text:

```
printf "\e[031m%s\e[0m\n" 'Danger is go!'
```

Running that should show:

<span style="color:#ff0000;">Danger is go!</span>

Here, `\e031m` is setting the `031` color, which is red text with no
background. `\e[0m` sets the color back to the default, which is probably
white or black text with no background, depending on your terminal theme.

It is important that you reset the text color. Otherwise all output will
continue to be colorized. Depending on your shell configuration, even commands
run after your script could be colorized inadvertently.

Here is a small script I found years ago that will show you what colors are
available in your terminal:

```bash
#!/bin/sh
# Usage: colordump
# Dump 256 ansi colors to the terminal.

printf "How each ANSI color is displayed on your terminal:\n\n"

i=0
row=0
while [ $i -lt 255 ];
do
    newrow=$(expr $i / 10)
    test $newrow -ne $row && printf "\n"
    row=$newrow
    printf "\e[%dm %03d \e[0m" $i $i
    i=$(expr $i + 1)
done

printf '\n\n     e.g., "\\e[41mTEXT\\e[0m" '
printf "\e[41m(for TEXT like this)\e[0m\n"
```

Run `colordump` to see a full list of colors available.

---

See also: <http://bluesock.org/~willg/dev/ansi.html>

[ANSI Escape Codes]: https://en.wikipedia.org/wiki/ANSI_escape_code
