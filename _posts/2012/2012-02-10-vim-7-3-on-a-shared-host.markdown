title: "Vim 7.3 on a shared host"
---
layout: default
---

A [few years ago](/blog/2007/vim-7-on-a-shared-host.html) I blogged about how
I setup Vim on a shared web host. I needed to do this again today; but with a
bit more control as to the features that were compiled:

```sh
#!/usr/bin/sh

wget ftp://ftp.vim.org/pub/vim/unix/vim-7.3.tar.bz2
tar -vjxf vim-7.3.tar.bz2
cd vim73
./configure --prefix="$HOME/local" \
            --with-features=huge \
            --enable-gui=no \
            --with-tlib=ncurses \
            --disable-nls \
            --enable-multibyte \
            --enable-perlinterp \
            --enable-pythoninterp \
            --enable-rubyinterp

make
make install
```

Make sure you have `$HOME/local/bin` in your PATH:

    export PATH="$HOME/local/bin:$PATH"

Something of interest I ran into: there are some X libraries installed on the
host this was deployed to. Without `--enable-gui=no`, this caused Vim to be
compiled with gui features. This in turn, cause `has('gui')` to return `1`
rather than `0` as it should have.
