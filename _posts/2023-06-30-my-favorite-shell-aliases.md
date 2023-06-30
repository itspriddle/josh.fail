---
title: "My favorite shell aliases"
date: "Fri Jun 30 00:36:58 -0400 2023"
category: dev
---

I tend to use full scripts more than shell aliases, but I do have a few that I
use all the time. I try to keep them all Bash/ZSH compatible so I can just
source one file for either shell---so I avoid things like ZSH's `-g`. Anyway,
here they are...

### cd aliases

These are super handy and I find myself using muscle memory on servers without
them. I tend to just spam `..`.

```bash
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
```

### ls aliases

I think I grabbed most of these from an old CentOS 4 box years ago.

```bash
alias l='ls'
alias ll='ls -lh'
alias la='ls -A'
```

At some point I wanted color all the time, so I threw these in for macOS and
Linux.

```bash
if [ "${OSTYPE:0:6}" = "darwin" ]; then
  alias ls='ls -G'
elif [ "${OSTYPE:0:5}" = "linux" ]; then
  alias ls='ls --color'
fi
```

### Git aliases

I wrote [a while ago][1] about my git aliases. My favorites are `gcomp`, and
`gv`.

```bash
alias gcomp='git checkout master; git pull'
alias gcomp-='git checkout master; git pull; git checkout -'
```

These are great for when I need to rebase.

`gv` is a recent addition. I use [vim-fugitive][2] and love its `:Git`
command. When called without arguments, it shows a nice overview of your repo
like `git status` would. You can then easily commit files with `-`.

```bash
alias gv='vim +Git'
```

### Others

I picked up a few safe guards to avoid clobbering files on accident.

```bash
alias rm='rm -iv'
alias cp='cp -iv'
alias mv='mv -iv'
alias sh='env -i sh'
```

One of my favorites, `path`, prints each item on your `$PATH`, one per line.

```bash
alias path='echo -e ${PATH//:/\\n}'
```

On my Raspberry Pis, I setup `cpu-temp` to output the CPU temperature. It uses
`vcgencmd` which is specific to the Pi and in a non-standard location.

```bash
if [ "${OSTYPE:0:5}" = "linux" ] && [ -f /etc/rpi-issue ]; then
  alias cpu-temp="PATH='/opt/cv/bin:$PATH' vcgencmd measure_temp | egrep -o '[0-9\\.]+'"
fi
```

On my Macs, I sometimes need to flush the DNS cache quickly. I grabbed this
years ago, and I _think_ it can just be shortened to the `mDNSResponder`
entry, but I never really bothered to check (maybe I will after publishing
this).

```bash
if [ "${OSTYPE:0:6}" = "darwin" ]; then
  alias flush-dns='sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder'
fi
```

I like `grep` to show matches in color, so I setup this alias.

```bash
alias grep='grep --color'
```

It's often useful to know your IP, so I setup `what-is-my-ip` a while ago. The
provider has changed a bit over the years.

```bash
alias what-is-my-ip="curl https://ifconfig.me; echo"
```

[1]: {% post_url 2019/2019-10-30-useful-git-configs-and-aliases %}
[2]: https://github.com/tpope/vim-fugitive
