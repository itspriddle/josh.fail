---
title: "A Simpler Homebrew Formula for WP-CLI"
date: "Wed Dec 23 22:51:38 -0500 2015"
category: dev
redirect_from: /blog/2015/a-simpler-homebrew-formula-for-wp-cli.html
---

I mentioned in my [last post][] that WP-CLI's Homebrew Formula includes a
dependency on Composer I don't need. I spent a few minutes and came up with a
[simpler Formula][My WP-CLI Formula] with no dependencies. To install, just
run `brew install [--HEAD] itspriddle/brews/wp-cli`. The Formula just
downloads pre-compiled phar files directly from GitHub, this works great for
my needs.

---

**EDIT, May 12, 2018:** Homebrew now ships with a similar formula for WP-CLI,
so I have removed my version from `itspriddle/brews`.

[last post]: {% post_url 2015/2015-12-07-running-wordpress-on-os-x %}
[My WP-CLI Formula]: https://github.com/itspriddle/homebrew-brews/blob/7442d01/Formula/wp-cli.rb
