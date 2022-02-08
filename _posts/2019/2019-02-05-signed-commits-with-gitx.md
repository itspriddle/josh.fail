---
title: "Signed commits with GitX"
date: "Tue Feb 05 01:11:29 -0500 2019"
category: dev
redirect_from:
- /blog/2019/signed-commits-with-gitx.html
- /dev/2019/signed-commits-with-gitx.html
---

I recently setup Git to use my [Keybase][] GPG key to automatically sign my
commits. [GitX][] doesn't support that out of the box --- but a quick `git`
wrapper makes it work like a charm.

First, if you haven't yet, enable signing on all of your commits. In
`~/.gitconfig`:

```
[commit]
  gpgsign = true
```

Create the script. It _must_ be named `git`, so you don't want to put it
anywhere in your `$PATH`. For example:

```
mkdir -p ~/.gitx
touch ~/.gitx/git
chmod +x ~/.gitx/git
```

Add this to the script:

```sh
#!/usr/bin/env bash

args=("$@")

if [[ "$1" = "commit-tree" ]] && [[ "$(git config --get commit.gpgsign)" = "true" ]]; then
  args=("commit-tree" "-S" "${args[@]:1}")
fi

git "${args[@]}"
```

In GitX go to Preferences > General, click the Git Executable box, and select
the script you've just created.

To test, make a commit with GitX. To see if it has been signed properly, run
`git log --pretty="format:%G?" -1`. If you see `G`, it works!

[GitX]: https://github.com/gitx/gitx
[Keybase]: https://keybase.io/itspriddle
