---
title: "Bootstrapping your development setup with Homebrew"
date: "Wed Apr 08 00:02:59 -0400 2015"
category: dev
redirect_from:
- /blog/2015/bootstrapping-your-development-setup-with-homebrew.html
- /dev/2015/bootstrapping-your-development-setup-with-homebrew.html
---

I maintain a small Homebrew tap for projects I work on at Site5,
[homebrew-site5](https://github.com/itspriddle/homebrew-site5). I came across
a "meta" brew in Josh Peek's
[homebrew-github](https://github.com/josh/homebrew-github/blob/master/github.rb)
Homebrew tap that allows you to install multiple dependencies with a single
command. I adapted it for my own needs at Site5 and it has worked great.

Basically, you create a Homebrew Formula with `depends_on` for each dependency
you need, and then make the installation a no-op:

```ruby
require "formula"

class Site5Devel < Formula
  url "https://raw.githubusercontent.com/itspriddle/homebrew-site5/master/Formula/site5-devel.rb"
  version "HEAD"

  option "with-mysql",      "Install MySQL server"
  option "with-postgresql", "Install PostgreSQL server"

  # Rails apps
  depends_on "dwdiff"
  depends_on "imagemagick"
  depends_on "phantomjs"
  depends_on "pow"
  depends_on "redis"

  # Databases (optional)
  depends_on "mysql"      if build.with? "mysql"
  depends_on "postgresql" if build.with? "postgresql"

  # Utilities
  depends_on "gist"
  depends_on "git"
  depends_on "gnupg"
  depends_on "vim"
  depends_on "ruby-install"
  depends_on "the_silver_searcher"
  depends_on "tree"
  depends_on "vnstat"
  depends_on "wget"
  depends_on "hub"
  depends_on "rename"

  # Noop
  def install; end
end
```

Now when I need to bootstrap a new machine, I can simply run `brew install
itspriddle/site5/site5-devel` and all of the dependencies I need are
installed.
