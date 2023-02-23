---
date: Thu Mar 04 17:39:59 -0500 2010
title: gem install without sudo
category: dev
redirect_from:
- /blog/2010/gem-install-without-sudo.
- /dev/2010/gem-install-without-sudo.html
tags: [ruby, gems, zsh, bash]
---

It took me a while to find a clearly documented way to manage
gems without having to use `sudo`. Just drop these lines into your
`~/.zshrc` or `~/.bashrc` file.

```sh
export PATH="$HOME/.gem/ruby/1.8/bin:$PATH"
export GEM_HOME="$HOME/.gem/ruby/1.8"
export GEM_PATH="$HOME/.gem/ruby/1.8"
```

Easy.

[gist]: https://gist.github.com/itspriddle/322210
