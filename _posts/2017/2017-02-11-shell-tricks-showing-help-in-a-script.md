---
title: "Shell Tricks: Showing help in a script"
date: "Sat Feb 11 23:10:28 -0500 2017"
category: dev
redirect_from: /blog/2017/shell-tricks-showing-help-in-a-script.html
---

This is part 1 of a series of quick and dirty tricks I've used in various
scripts over the years. In this post, I'll show how I like to provide help
text for shell scripts.

In this example, the script can be called with `-h` or `--help` to print the
help text:

```sh
#!/usr/bin/env bash
# Usage: my-script
#
# my-script is kind of good
#
# EXAMPLES
#
# This is the way we use my-script:
#   $ my-script
# 
# Or I guess you could use it like this:
#   $ my-script --hi

# Print help text and exit.
if [[ "$1" = "-h" ]] || [[ "$1" = "--help" ]]; then
  sed -ne '/^#/!q;s/.\{1,2\}//;1d;p' < "$0"
  exit
fi

# The actual script goes here
echo "$@"
```

Running `my-script --help` (or `-h`) outputs:

```
Usage: my-script

my-script is kind of good

EXAMPLES

This is the way we use my-script:
  $ my-script

Or I guess you could use it like this:
  $ my-script --hi
```

The special sauce here is `sed -ne '/^#/!q;s/.\{1,2\}//;1d;p' < "$0"`. Broken
down:

```
sed -ne '...' < "$0"
```

Run the `sed` (stream editor) utility. The `-n` switch disables the
default output behavior, The `-e '...'` switch specifies sed commands to be
run. `< "$0"` means that `sed` will operate on the script itself --- in this
case it will parse the script to print just the help text.

The actual sed commands (`/^#/!q;s/.\{1,2\}//;1d;p`) are actually 4
separate commands separated by `;`: `/^#/!q`, `s/.\{1,2\}//`, `1d` and `p`.
Here's what each does.

```
/^#/!q
```

Match lines that start with `#`. When one is encountered that does NOT start
with `#`, stop looking for matching lines. This allows you to have additional
comments in your script without having them appear in the help text.

```
s/.\{1,2\}//
```

Replace the first two characters in each matched line with an empty string
(i.e. delete them).

```
1d
```

Delete the first line from the matched text. This is the script's shebang and
is not part of the help text.

```
p
```

Print the remaining lines.
