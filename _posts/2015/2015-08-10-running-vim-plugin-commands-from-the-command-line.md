---
title: "Running vim plugin commands from the command line"
date: "Mon Aug 10 01:02:25 -0400 2015"
category: dev
redirect_from: /blog/2015/running-vim-plugin-commands-from-the-command-line.html
---

Vim allows you to run commands from the command line using the `+` or `-c`
flags, `vim +PlugUpdate` or `vim -c ":PlugUpdate"`. Many plugin commands aren't
available until you have opened a buffer (eg. rails.vim or git.vim). This has
bugged me for a while and I finally figured out how to make it work.

Trying to run such commands from the command line will raise a Vim error. For
example `vim -c ":Emodel user"` raises `E492: Not an editor command: :Emodel
user`. A trick I found is that Vim's `-s` flag (Read Normal mode commands from
file) runs after the first buffer is loaded and these commands are available.

Instead of using an actual file, Bash/ZSH's [process
substitution](http://tldp.org/LDP/abs/html/process-sub.html) can be used:

```
# Launch vim and run `:Emodel user`
$ vim -s <(echo ":Emodel user")

# Launch vim and run `:Gstatus`
$ vim -s <(echo ":Gstatus")
```

Using this you could easily write scripts/shell functions to start Vim with
commonly used commands:

```sh
emodel() {
  vim -s <(echo ":Emodel $@")
}

emigration() {
  vim -s <(echo ":Emigration $@")
}
```

I'm not sure how useful I'll find this now that I know how to do it, but I'm
glad to have figured it out.
