---
date: Sun Feb 28 20:40:00 -0500 2010
short_description: |
  <p>
    After migrating my blog from Wordpress to Jekyll, one thing I was missing
    was a functional search box. I threw one together last night.
  </p>
title: jQuery Autocomplete for Jekyll
---

After migrating my blog from Wordpress to Jekyll, one thing I was missing
was a functional search box. I threw one together last night.

The first problem is getting a "database" of blog posts that can be searched
with jQuery. Luckily [Jekyll](http://github.com/mojombo/jekyll) parses anything
with YAML Front Matter, so I was able to whip up a
[posts.json](http://gist.github.com/317965#file_js_posts.json) file that's
dynamically created.

Next, I tried using Ziadin Givan's [jQuery autocomplete plugin](http://www.codeassembly.com/Unobtrusive-jQuery-autocomplete-plugin-with-json-key-value-support/)
but it didn't quite work the way I needed it to. I ended up using it as a starting point to roll [my own](http://gist.github.com/317965#file_js_autocomplete.js).

A sample [gist](http://gist.github.com/317965) is up to get you going, or
see the [full source](http://github.com/itspriddle/itspriddle.github.com).
