---
layout: post
title: jQuery Autocomplete for Jekyll
date: Sun Feb 28 20:40:00 -0500 2010
tags:
  - jquery
  - javascript
  - jekyll
---
After migrating my blog from Wordpress to Jekyll, one thing I was missing
was a functional search box. I threw one together last night.

The first problem is getting a "database" of blog posts that can be searched
with jQuery. Luckily [Jekyll](http://github.com/mojombo/jekyll) parses anything
with YAML Front Matter, so I was able to whip up a `posts.json` file that's
dynamically created.

A sample [gist](http://gist.github.com/317965) is up to get you going, or
see the [full source](http://github.com/itspriddle/itspriddle.github.com).
