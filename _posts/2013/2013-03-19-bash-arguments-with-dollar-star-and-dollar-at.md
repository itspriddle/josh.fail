---
date: "Tue Mar 19 23:30:53 -0400 2013"
title: "Bash Arguments with $* and $@"
---

Today, I wondered what the difference between `$*` and `$@` in Bash were. This
is a tough one to Google for, so I'm copying the answer I found on [Bash
Hackers][1]:

| Variable | Result                      |
| :------: | :-------------------------: |
| `$*`     | `$1 $2 $3 ... ${N}`         |
| `$@`     | `$1 $2 $3 ... ${N}`         |
| `"$*"`   | `"$1c$2c$3c...c${N}"`       |
| `"$@"`   | `"$1" "$2" "$3" ... "${N}"` |

[1]: http://wiki.bash-hackers.org/scripting/posparams#all_positional_parameters
