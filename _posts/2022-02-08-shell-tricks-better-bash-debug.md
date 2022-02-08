---
title: "Shell Tricks: Better Bash debug"
date: "Wed Feb 08 09:30:45 -0500 2022"
category: dev
---

Toss the following snippet at the top of any Bash script and run with
`DEBUG=1` to automatically activate `set -x` and print its output via `$PS4`.

```
if [ "$DEBUG" ]; then
  export PS4='+ [${BASH_SOURCE##*/}:${LINENO}] '
  set -x
fi
```

From a dirty `ical-week` [script][1] I threw together to calculate the week
number in Calendar.app Reckoning™, here's the `DEBUG` in action:

```
~ % DEBUG=1 =ical-week
+ [ical-week:36] set -e
+ [ical-week:197] main
+ [ical-week:166] local target_date pad=02 advance
+ [ical-week:168] [[ 0 -gt 0 ]]
++ [ical-week:183] date +%F
+ [ical-week:183] : 2022-02-08
+ [ical-week:185] [[ 2022-02-08 =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]
+ [ical-week:190] [[ -n '' ]]
+ [ical-week:194] week_number 2022-02-08 02
+ [ical-week:129] local now=2022-02-08 pad=02 week offset ord dow year_end_dow year_start_dow
++ [ical-week:131] reformat_date 2022-02-08 %-j
++ [ical-week:51] local now=2022-02-08 new_fmt=%-j src_fmt=%F
++ [ical-week:53] date -j -f %F 2022-02-08 +%-j
+ [ical-week:131] ord=39
++ [ical-week:132] reformat_date 2022-02-08 %w
++ [ical-week:51] local now=2022-02-08 new_fmt=%w src_fmt=%F
++ [ical-week:53] date -j -f %F 2022-02-08 +%w
+ [ical-week:132] dow=2
+++ [ical-week:133] reformat_date 2022-02-08 %Y
+++ [ical-week:51] local now=2022-02-08 new_fmt=%Y src_fmt=%F
+++ [ical-week:53] date -j -f %F 2022-02-08 +%Y
++ [ical-week:133] reformat_date 2022-01-01 %w
++ [ical-week:51] local now=2022-01-01 new_fmt=%w src_fmt=%F
++ [ical-week:53] date -j -f %F 2022-01-01 +%w
+ [ical-week:133] year_start_dow=6
++ [ical-week:134] printf %d 1
+ [ical-week:134] offset=1
+ [ical-week:135] week=7
+++ [ical-week:136] reformat_date 2022-02-08 %Y
+++ [ical-week:51] local now=2022-02-08 new_fmt=%Y src_fmt=%F
+++ [ical-week:53] date -j -f %F 2022-02-08 +%Y
++ [ical-week:136] reformat_date 2022-12-31 %w
++ [ical-week:51] local now=2022-12-31 new_fmt=%w src_fmt=%F
++ [ical-week:53] date -j -f %F 2022-12-31 +%w
+ [ical-week:136] year_end_dow=6
+ [ical-week:140] [[ 7 -gt 52 ]]
+ [ical-week:143] printf %02d 7
07+ [ical-week:194] [[ -t 1 ]]
+ [ical-week:194] echo
```

[1]: https://github.com/itspriddle/dotfiles/blob/c74e0ecbec44ca5febb12ce64242613792dfaa28/bin/ical-week
