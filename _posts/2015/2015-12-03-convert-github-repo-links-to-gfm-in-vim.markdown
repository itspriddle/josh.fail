---
title: "Convert GitHub repo links to GFM in Vim"
date: "Thu Dec 03 23:37:06 -0500 2015"
---

GitHub allows a [shorthand syntax][Writing on GitHub] for linking to commits, pull requests and
issues: user/project@SHA for a commit and user/project#Num for an issue or
pull request. I frequently paste links into Vim when writing git commit or
pull request messages, and wanted a way to automatically convert these to the
shorthand syntax on save.

Drop this code in `~/.vimrc`:

```vim
" Replace GitHub issue/pull/commit URLS with Markdown shorthand syntax
"
" Eg:
"   https://github.com/itspriddle/vim-config/issues/1 becomes
"   itspriddle/vim-config#1
"
"   https://github.com/itspriddle/vim-config/pull/1 becomes
"   itspriddle/vim-config#1
"
"   https://github.com/itspriddle/vim-config/commit/deadbeef becomes
"   itspriddle/vim-config@deadbeef
augroup ft_github
  autocmd BufWritePre .git/{COMMIT,PULLREQ}_EDITMSG
    \ execute 'keeppatterns %s,\vhttps?://github.com/([^/]+)/([^/]+)/(pull|issues|commit)/(\x+),\=submatch(1)."/".submatch(2).(submatch(3) == "commit" ? "@" : "#").(submatch(3) == "commit" ? submatch(4)[0:7] : submatch(4)),gei'
augroup END
```

When you use Vim to write a commit message (`git commit` without the `-m`
flag), or a pull request (`hub pull-request` without the `-m` flag) commit,
issue, or pull request links will be automatically converted the the shorthand
syntax.

[Writing on GitHub]: https://help.github.com/articles/writing-on-github/#references
