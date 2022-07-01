---
title: "My favorite Bash resources"
date: "Wed Jun 29 13:28:33 -0400 2022"
category: dev
---

Bash is everywhere and I write a stupid amount of it for that very reason.
It's pretty hard to write _good_ Bash. Here are some resources I've used to
try and level up my code.

My two favorite resources lately are the [pure-bash-bible][1] and
[neofetch][2], both by [@dylanaraps][3].

I think the pure Bash bible was a side project that resulted from Neofetch.

The reason I like to refer to these projects is that Dylan has pretty much
covered everything you'd ever want to do in Bash and Linux.

Neofetch is a CLI tool that reports back information about *nix systems; like
your CPU count/speed, RAM amount, disk usage, etc. It works on just about
every Linux there is as far as I can tell. So if you ever find yourself
looking to query free RAM on macOS and Linux, neofetch already figured it out
for you. Funny enough, I don't actually use it on any of my computers. But,
I've referred to it many times over the years to see how to find information
on a server.

The pure-bash-bible is helpful for Bash syntax and generally doing things that
would normally require you to use an external program. I've found this doesn't
really matter a _ton_ in practice, since most POSIX systems end up with the
same utilities. It can be handy if you're targeting macOS/BSD and Linux/GNU
where some utilities work differently.

Finally, I can't mention Bash resources and not preach about [ShellCheck][4].
This tool helps you find bugs and follow best practices in your shell scripts.
Things like quoting variables or using `=` when you meant `-eq` get called
out. There are a variety of plugins available for various `$EDITORS`, too
(like [vim-shellcheck][5] by some dude named Josh).

I use ShellCheck for **every** Bash script I write now, and I force it on
every person I see writing Bash code. Seriously, do yourself a favor and use
it.

[1]: https://github.com/dylanaraps/pure-bash-bible
[2]: https://github.com/dylanaraps/neofetch
[3]: https://github.com/dylanaraps
[4]: https://www.shellcheck.net
[5]: https://github.com/itspriddle/vim-shellcheck
