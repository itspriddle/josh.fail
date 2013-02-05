title: "Jekyll and Vim"
---
layout: default
---

I've been using Vim full time for a while now and wanted a decent way to
manage blog posts in my [Github Pages](http://pages.github.com/) powered
blog.

[jekyll.vim](https://github.com/csexton/jekyll.vim/) has been around for a
while, but it had a few drawbacks. I spent the last couple of nights getting
to know vimscript a little better, and rewrote it to address these.

Here's [vim-jekyll](https://github.com/itspriddle/vim-jekyll/), my rewrite of
the original with a few improvements:

* Commands to edit/split/vsplit/tabnew a post
* Tab completion for opening existing posts
* Recognizes Octopress blogs and others with custom `_posts` directory
* Customizable template for new posts

Hope it helps some Octopress/vim users!
