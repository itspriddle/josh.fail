---
title: "How to print help text in shell scripts"
date: "Sun Feb 03 00:36:22 -0500 2019"
category: dev
redirect_from: /blog/2019/how-to-print-help-text-in-shell-scripts.html
---

Good shell scripts should come with documentation that is easy to access.
Usually `some-script -h`, `some-script --help` will print such help -- if the
developer was nice enough to include docs anyway. I think it's a really
important thing to include in any script you're going to share with the
public. I've seen [and tried][1] a few different methods over the years. Here
are a few, how they work, and what I'm using today.

[1]: {% post_url 2017/2017-02-11-shell-tricks-showing-help-in-a-script %}

## 0. Intercepting the -h and \-\-help flags

Before anything, your script needs to detect the `-h` and `--help` flags in
order to know when to print the help text. This will vary depending on the way
your script is written. For example, if you are already handling flags via
`getopt` or similar, you would likely want to place this logic there. I
typically put something like this near the very top of my scripts:

```sh
#!/usr/bin/env bash

# Print help text and exit.
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  ... # some logic to print the help text
  exit 1
fi
```

_How does it work?_

`$1` refers to the first argument passed to the script. If that is `-h`, or
`--help`, print the help text and exit.

## 1. echo

A simple approach is to just `echo` your help text. This works fine, but it's
always had a slight smell to me. You may have to escape characters like
<code>&#96;</code> or swap around single `'` and double quotes `"`. Depending
on your `$EDITOR`, it could be difficult to make large edits to the help text
or shift indentation since you have `echo` and quotes to deal with. Still, for
simple cases, it is often sufficient.

The implementation is as follows:

```sh
#!/usr/bin/env bash

# Print help text and exit.
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  echo "Usage: some-script [options]"
  echo
  echo "Examples:"
  echo
  echo "  - some-script foo"
  echo "  - some-script bar"
  exit 1
fi
```

_How does it work?_

The given text for each `echo` call is printed.

The output looks like:

```
Usage: some-script [options]

Examples:
  - some-script foo
  - some-script bar
```

## 2. cat

Similar to using `echo`, you can also use `cat` with a herestring. This has an
improvement over `echo` since it makes editing the actual help text much
easier. Personally, I'm not a fan of how the indentation looks in this
approach, but that's purely stylistic and a personal preference.

The implementation is as follows:

```sh
#!/usr/bin/env bash

# Print help text and exit.
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  cat <<HELP
Usage: some-script [options]

Examples:

  - some-script foo
  - some-script bar
HELP
  exit 1
fi
```

_How does it work?_

The herestring (i.e. the text between `<<HELP` and `HELP`) is printed.

The output looks like:

```
Usage: some-script [options]

Examples:
  - some-script foo
  - some-script bar
```

## 3. grep with embedded help text

I've grown to like the idea of keeping help text as source comments at the top
of a script. This makes it easy to edit the help text, and more importantly,
it is simple to read when editing the script.

The first implementation of this I saw was something like this:

```sh
#!/usr/bin/env bash
#/ Usage: some-script [options]
#/
#/ Examples:
#/
#/   - some-script foo
#/   - some-script bar

# Print help text and exit.
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  grep "#/" $0 | cut -c 4-
  exit 1
fi
```

I prefer this over `echo` or `cat`, but I find the magic `#/` comment a bit
distracting.

_How does it work?_

Let's split these commands up.

```
grep "#/" $0"
```

This runs the `grep` utility for the script itself (i.e. `$0`), printing any
lines starting with `#/`. These characters should be stripped out before
presenting the help test to the user, so this output is piped (i.e. `|`) to
the next command.

```
cut -c 4-
```

This strips all characters before the 4th in each line.

The output looks like:

```
Usage: some-script [options]

Examples:
  - some-script foo
  - some-script bar
```

## 4. sed with embedded help text

To avoid a magic comment, `sed` can be used instead. I came across this trick
a while back ([maybe
here](https://github.com/mislav/dotfiles/blob/7b80de2/bin/git-sync)).

```sh
#!/usr/bin/env bash
# Usage: some-script [options]
#
# Examples:
#
#   - some-script foo
#   - some-script bar

# Print help text and exit.
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  sed -ne '/^#/!q;s/.\{1,2\}//;1d;p' < "$0"
  exit 1
fi
```

I love the simplicity of this method. Editing the help text is easy, and the
extra two `# ` characters don't affect things much when I wrap text at 80
columns. It's easy to read the text when editing the script. Most of all, it
is a small 4-line snippet that can be dropped in any bash/sh script.

I used a variation of this snippet in most of my shell scripts for several
years.

_How does it work?_

This one uses the `sed` utility on the script itself (again, `$0`). Let's
break down the `sed` command:

`-ne`: This is two separate switches, `-n` (don't print each line), and `-e`
to specify the `sed` commands to run.

The commands are `/^#/!q;s/.\{1,2\}//;1d;p`. These are actually 4 separate
commands, each is separated by `;`. Every line in the script is passed to each
command before proceeding to the next; that is: `/^#/!q` runs on each line,
then `s/.\{1,2\}//` runs on each line, `1d` runs on each line, and `p` runs on
each line.

Let's break down the commands.

`/^#/!q`: If the line doesn't start with `#`, quit `sed` immediately. This
serves two purposes. First, _only_ the initial block of text starting with `#`
is considered as part of the help text. Second, any other comments that come
after this block aren't included as part of the help text. In the example
above, this line is true and causes `sed` to quit on the blank line.
Otherwise, the `# Print help text and exit.` line would be included in the
help text. After this runs for each line, the matched text is sent to the next
command.

`s/.\{1,2\}//`: Delete the first 1 or two characters. For lines starting with
`#` only, this makes them completely blank. Other lines, such as the shebang
(`#!/usr/bin/env bash`) and the help text `# Examples:` have their first two
characters removed (becoming `/usr/bin/env bash` and `Examples:`). After this
runs for each line, the updated text is sent to the next command.

`1d`: Delete the first line. At this point, the first line is the script's
shebang. That isn't part of the help text, so delete it. After this runs, the
rest of the lines are sent to the next command.

`p`: If we made it this far, print each line.

The output looks as expected:

```
Usage: some-script [options]

Examples:
  - some-script foo
  - some-script bar
```

## 5. sed + awk, so -h and \-\-help behave differently

All of these methods are fine, but one minor UX issue is that `-h` and
`--help` both return the same long form help text. Typically, `-h` is reserved
for a shorter variant, that would explain the most common options, while
`--help` would be reserved for printing the full help text.

This method is based on
[`rbenv-help`](https://github.com/rbenv/rbenv/blob/59785f6/libexec/rbenv-help#L29-L87).

It allows printing just the `Usage` section when a script is called with `-h`,
and the entire help text when called with `--help`.

```sh
#!/usr/bin/env bash
# Usage: some-script foo [options]
#        some-script bar [options]
#
# Examples:
#
#   - some-script foo
#   - some-script bar

# Print help text and exit.
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  sed -ne '/^#/!q;s/^#$/# /;/^# /s/^# //p' < "$0" |
    awk -v f="${1#-h}" '!f && /^Usage:/ || u { u=!/^\s*$/; if (!u) exit } u || f'
  exit 1
fi
```

This one is a bit more complicated. Let's break down the `sed` command first:

`-ne`: Same as above, don't automatically print lines and take the given
string as `sed` commands.

`/^#/!q`: Same as above, if the line doesn't start with `#` then quit `sed`
immediately. The help text is passed to the next command.

`s/^#$/# /`: If the line is just `#` with no trailing spaces, add a trailing
space. The updated text is passed to the next command.

`/^# /s/^# //p`: This is three separate commands that run on the _same line_
(notice they aren't separated by `;`, that would make them run on all lines in
order like explained above). `/^# /` matches a line starting with `# `, this
is passed to the next action; `s/^# //` deletes the leading `# ` characters,
the updated text is passed to the next action; `p` prints the updated text.

This is exactly what we need for the `--help` long help text. To get `-h` to
print shorter text, the formatted help text is piped to `awk`. This is how we
will strip away the unnecessary examples for the short help text.

The awk command works as follows:

`-v f="${1#-h}"`: Sets an internal `awk` variable named `f` to the value of
`$1`, with a `-h` prefix deleted. For `-h`, this sets `f=""`. For `--help`,
this sets `f="-help"`.

`!f && /^Usage:/ || u { u=!/^\s*$/; if (!u) exit } u || f`: is the actual awk
program. Broken down:

`!f && /^Usage:/ || u { ... }`: If the `f` variable set above is empty (i.e.
the user passed `-h`), _and_ the line starts with `Usage:` or a variable `u`
is set, run the code in between `{` and `}`. This variable, `u`, will be used
to track whether or not the Usage text section is still being printed. It is
`false` at first.

`u=!/^\s*$/`: If the line isn't blank or just spaces, set `u` to `true`.
Otherwise, set `u` to `false`.

`if (!u) { exit }`: If `u` is not set (e.g., the line is blank), quit `awk`
now. This is expected to happen once the Usage text has been completely
printed, and stops printing the remaining help text.

`u || f`: If `u` is `true`, the line is a Usage line and it is printed. If the
user passed `--help`, nothing has been printed yet, so print the line. (The
`awk` print call is implicit, this is similar to `u || f { print }`

Phew! With that done, now `-h` and `--help` provide different output.

With `-h`, the output is short:

```
Usage: some-script foo [options]
       some-script bar [options]
```

With `--help`, the output is long:

```
Usage: some-script foo [options]
       some-script bar [options]

Examples:

  - some-script foo
  - some-script bar
```

I love having these separate options in my scripts. One great use-case is when
you are handling invalid arguments, a pattern I sometimes use is:

```sh
# Something happened, we detected an invalid command!
echo "Error: Invalid command!" >&2
$0 -h
```

This would give output like:

```
Error: Invalid command!
Usage: some-script foo [options]
       some-script bar [options]
```

## But really, just use anything please!

I really like the simplicity of the last two examples above, and found I
couldn't justify not shipping docs with my scripts anymore.

But maybe you don't. That's okay. Just make sure to provide _something_ when
the user tries `-h` and `--help` --- even if it is just a one line `echo
"some-script <cmd1|cmd2>"`. They probably won't thank you, but at least they
won't rage :smile:.
