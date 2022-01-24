---
title: "Building GitHub Pages Locally"
date: "Tue Feb 10 23:30:00 -0500 2015"
category: dev
redirect_from: /blog/2015/building-github-pages-locally.html
---

GitHub recently released a [pages-gem][] making it easy to duplicate the
environment they use to build [GitHub Pages][]. Add a little [Rack][], and
[Pow][], and you can be running GitHub Pages locally in no time.

First, create a `Gemfile`, or add the following to an existing one:

```ruby
gem "pages-gem"
gem "rack-contrib"
```

And install the gems:

```
bundle install
```

Now create a Rackup file, `config.ru` with the following:

```ruby
require 'rack/static'
require 'rack/contrib/not_found'
require 'rack/contrib/try_static'

# Find HTML files based on the request URI
use Rack::TryStatic,
  root: '_site',
  urls: %w[/],
  try:  %w[.html index.html /index.html]

# Render 404.html when a page is not found
run Rack::NotFound.new '_site/404.html'
```

Enable the site in Pow:

```
ln -s ~/.pow/yourblog ~/www/yourblog.com
```

Build the blog:

```
jekyll build
```

And open it in your browser:

```
open http://yourblog.dev/
```

Finally, to ensure GitHub doesn't serve your `Gemfile` and `config.ru`, add the
following to `_config.yml`:

```yaml
exclude:
  - Gemfile
  - Gemfile.lock
  - config.ru
```

Now any time you want to work on your blog, you can make your changes and run
`jekyll build` and see them in your browser before pushing to GitHub.

[GitHub Pages]: https://rack.github.io/
[Pow]: http://pow.cx/
[pages-gem]: https://github.com/github/pages-gem
[rack]: https://rack.github.io/
