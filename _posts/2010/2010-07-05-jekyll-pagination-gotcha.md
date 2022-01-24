---
date: Mon Jul  5 22:03:09 -0400 2010
title: Jekyll Pagination Gotcha
category: dev
redirect_from: /blog/2010/jekyll-pagination-gotcha.html
---

If you're using Jekyll and pagination (see [Template data](http://wiki.github.com/mojombo/jekyll/template-data)),
make sure you're using `index.html` and **NOT** `index.markdown` or `index.md`.

If you don't use a `.html` extension, pagination will not work.
