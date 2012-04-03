---
layout: post
title: "ZSH Tab Completion for Bundler Binstubs"
date: "Thu Mar 29 12:10:35 -0400 2012"
---

Bundler has a feature called `binstubs`, which places stubs for gem bin
scripts in `./bin`. Unfortunately, ZSH doesn't seem to complete these files
out of the box.

It took quite a bit of trial and error to figure this out, but here is what I
came up with to enable this behavior:

    # Complete $PWD/bin if it exists. Good for bundler with binstubs
    zstyle -e ':completion:*' command-path \
      '[[ -d $PWD/bin ]] && reply=($PWD/bin $path)'

Any time you CD into a directory with a `./bin` directory within, it's
contents will be added to command tab completion.

Note, that you also need to add `./bin` to `$PATH` as described in the bundler
docs.

Enjoy!
