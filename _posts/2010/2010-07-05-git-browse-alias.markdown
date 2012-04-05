---
layout: post
title: "`git browse` alias"
date: "Mon Jul 5 21:22:45 -0400 2010"
short_description:
  <p>
    I recently wrote a
    <a href="https://git.wiki.kernel.org/index.php/Aliases">git alias</a> to
    open a repo in your web browser.
  </p>
  <p>
    Why not just install <a href="http://github.com/defunkt/hub">hub</a> and
    use <code>hub browse</code> I hear you ask? Well, because
    <code>browse</code> is the only feature of <code>hub</code> I actually
    used, and it only works on <a href="http://github.com">GitHub</a> repos.
    This one doesn&rsquo;t wrap the <code>git</code> executable, and works
    outside of GitHub.
  </p>
---

I recently wrote a [git alias](https://git.wiki.kernel.org/index.php/Aliases)
to open a repo in your web browser.

Why not just install [hub](http://github.com/defunkt/hub) and use `hub browse`
I hear you ask? Well, because `browse` is the only feature of `hub` I actually
used, and it only works on [GitHub](http://github.com) repos. This one doesn't
wrap the `git` executable, and works outside of GitHub.

This assumes that the URLs for both git and web are the same (except for
the git parts). Eg:

    Git: git@github.com:itspriddle/dotfiles.git
    Web: http://github.com/itspriddle/dotfiles

    Git: git://example.com/scripts/hacks.git
    Web: http://example.com/scripts/hacks

    Git: http://example.com/private/ninja-training.git
    Web: http://example.com/private/ninja-training

Add the following to `~/.gitconfig` under the `[alias]` section (or
create it if you haven't created any aliases):

    browse  = !open $( \
      echo \"`git config remote.origin.url`\" | \
      ruby -e \"url = ARGF.read\" \
           -e \"url.sub!(/^(git\\:\\/\\/|git@|http\\:\\/\\/|https\\:\\/\\/)/, '')\" \
           -e \"url.sub!(':', '/')\" \
           -e \"url.sub!(/\\.git\\$/, '')\" \
           -e \"print 'http://' + url\" \
    )

Run `git browse` from your repo and watch in awe as it opens in your web
browser.

It's admittedly a bit fragile, but has worked on all of the repositories
that I work with regularly.  Feel free to [fork it](http://gist.github.com/462049)
if you have improvements.

This will only work for OS X, but you should be able to get it working
on Linux with something like [gnome-open](http://embraceubuntu.com/2006/12/16/gnome-open-open-anything-from-the-command-line/).
