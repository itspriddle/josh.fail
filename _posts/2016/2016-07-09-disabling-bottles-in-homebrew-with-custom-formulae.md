---
title: "Disabling bottles in Homebrew with custom formulae"
date: "Sat Jul 09 23:28:35 -0400 2016"
category: dev
redirect_from: /blog/2016/disabling-bottles-in-homebrew-with-custom-formulae.html
---

Homebrew recently added bottles for Vim/MacVim --- but they depend on
Homebrew-installed Ruby, Python, and Perl. I prefer to build these from source
so they will use whatever versions of these dependencies currently installed
on my system. Instead of constantly remembering `brew install -s vim` to
install from source, I created a couple small formulae that disable bottles.

For Vim:

```ruby
require "#{HOMEBREW_PREFIX}/Library/Formula/vim"

Vim.bottle :disable
```

For MacVim:

```ruby
require "#{HOMEBREW_PREFIX}/Library/Formula/macvim"

Macvim.bottle :disable
```

Install with `brew install itspriddle/brews/vim` and `brew install
itspriddle/brews/macvim` to compile from source. Upgrade with `brew upgrade
vim` or `brew upgrade macvim` and upgrades will compile from source as well.

I haven't tried anything beyond disabling bottles, but this technique could be
useful to override any Homebrew formula.
