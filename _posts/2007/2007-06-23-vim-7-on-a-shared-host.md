---
title: Vim 7 on a Shared Host
category: dev
redirect_from:
- /blog/2007/vim-7-on-a-shared-host.html
- /dev/2007/vim-7-on-a-shared-host.html
tags: [vim, linux]
---

I did this about 8 months ago and never wrote down my steps. I just had to
figure it out again for another server, and thought I'd write it down here to
save myself (and possibly someone else) time.

First, this requires you have SSH access to your host. If you don't, this post
wasn't meant for you. Then again... you probably wouldn't need vim7 if you
didn't. Anyway, open a shell and enter these commands:

    $ mkdir -p ~/local/src
    $ cd ~/local/src
    $ wget ftp://ftp.vim.org/pub/vim/unix/vim-7.1.tar.bz2
    $ tar -vjxf vim-7.1.tar.bz2
    $ cd vim71
    $ ./configure --prefix=$HOME/local
    $ make
    $ make install

Vim is now installed in `$HOME/local/bin/vim`. To use that instead of
`/usr/bin/vim` (your webhost's OLD vim), open `~/.bash_profile` (create it if
it doesn't exist) and add `$HOME/local/bin` to **the front** of your path. My
path looks like this:

    export PATH=$HOME/local/bin:$PATH

That will look for any programs in `$HOME/local/bin` first. If they're not
there, move on the system defined path to look.

**Note:** When I did this, vim wasn't importing `/etc/vimrc`, so I had to copy
it to my home dir.

    $ cp /etc/vimrc ~/.vimrc

You'll likely need to make some edits so everything works/looks how you want.
