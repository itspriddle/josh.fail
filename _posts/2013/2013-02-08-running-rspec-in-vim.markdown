---
layout: default
date: "Fri Feb 08 20:39:59 -0500 2013"
title: "Running RSpec in Vim"
---

Today, I finally got `:make` working for RSpec files in Vim.

First, you need [vim-rails][] installed. It includes support for RSpec's error
format. As outlined in its [FAQ][], you need to manually add a snippet of code
to your `~/.vimrc` to enable `:make` for specs. I don't need test-unit
support, so I adapted the example:

```vim
autocmd FileType ruby
  \ if expand("%") =~# '_spec\.rb$' |
  \   compiler rspec | setl makeprg=rspec\ $*|
  \ else |
  \   compiler ruby | setl makeprg=ruby\ -wc\ \"%:p\" |
  \ endif
```

This didn't work for me at first - I use `rbenv` and Vim was trying to use the
default system Ruby at `/usr/bin/ruby`. After a bit of Googling, I found the
issue was with OS X's `/etc/zshenv`. Specifically, it uses
`/usr/libexec/path_helper` which changes `$PATH`. I removed `/etc/zshenv` and
Vim used the correct `rbenv` provided Ruby.

With this in place, you can run `:make` to run the entire test suite via
`rspec`; or pass arguments to it. Run the current spec: `:make %`. Pass
extra arguments: `:make --fail-fast %`.

If there are any failures, you can open the QuickFix window with `:copen` to
view them in a list. Jump to the one you want to edit and press `<Enter>` and
Vim will bring you directly to that line.

Glad I finally got this working. I'll probably use it daily.

**NOTE**: If you use Bundler, you need to either use [binstubs][] or add `bundle exec `
to the `makeprg` above.

[vim-rails]: https://github.com/tpope/vim-rails
[FAQ]: https://github.com/tpope/vim-rails#faq
[binstubs]: http://mislav.uniqpath.com/2013/01/understanding-binstubs
