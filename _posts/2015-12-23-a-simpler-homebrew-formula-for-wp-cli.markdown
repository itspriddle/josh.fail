---
layout: default
title: "A Simpler Homebrew Formula for WP-CLI"
date: "Wed Dec 23 22:51:38 -0500 2015"
---

I mentioned in my [last post](/blog/2015/running-wordpress-on-os-x.html) that
WP-CLI's Homebrew Formula includes a dependency on Composer I don't need. I
spent a few minutes and came up with a [simpler Formula][My WP-CLI Formula]
with no dependencies. To install, just run `brew install [--HEAD]
itspriddle/brews/wp-cli`. The Formula just downloads pre-compiled phar files
directly from GitHub, this works great for my needs.

[My WP-CLI Formula]: https://github.com/itspriddle/homebrew-brews/blob/master/Formula/wp-cli.rb
