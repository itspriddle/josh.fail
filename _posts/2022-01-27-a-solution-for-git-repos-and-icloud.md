---
title: "A solution for git repos and iCloud?"
date: "Thu Jan 27 01:17:12 -0500 2022"
category: dev
redirect_from: /dev/2022/a-solution-for-git-repos-and-icloud.html
---

If you're tried keeping a git repo in an iCloud (or Dropbox) folder before,
you know it works fine --- until it doesn't. _Something_ inevitably happens
one day while one of your devices is syncing, and your repo is corrupted, such
that a bunch of your files look like they've been changed. A workaround I've
been playing with is custom `$GIT_DIR` set via [direnv][1]. Here's how I set
it up.

For a little more background, I've been using [Obsidian][2] for about 6 months
to manage my notes for work. I had previously been using a simple
`~/work/notebook` directory full of Markdown files and editing in Vim. I keep
a private git server on a Raspberry Pi that I use to backup my notebook. 

When I made the switch to Obsidian, I naturally wanted to access my notes from
my mobile devices. I already knew that git + cloud syncing was a bad idea, but
feeling lazy, I tried syncing my whole notebook directory[^1] --- `.git/` and
all. It worked fine for a month or so, until I would randomly switch from my
desktop to laptop and `git status` would report a bunch of changed files.

I knew about `$GIT_DIR`, which [Git Internals - Environment Variables][3]
describes as:

> `GIT_DIR` is the location of the `.git` folder. If this isn’t specified, Git
> walks up the directory tree until it gets to `~` or `/`, looking for a
> `.git` directory at every step.

I [already use direnv][4], so setting a shell variable in a specific folder is
easy.

First, I moved the `.git/` dir out of the main project folder (notice the
subtle difference with the 2nd `/`):

```
mv ~/work/notebook/.git ~/work/notebook.git
```

Next, I told direnv to tell Git I'd like it to use that separate directory:

```
echo 'export GIT_DIR=~/work/notenook.git' >> .envrc
```

Testing that it works:

```
cd ~/work/notenook
git status
## master...origin/master
```

This has been working pretty well for me for a few months. I still get the
peace of mind of having my content backed up to git, and iCloud hasn't gotten
in the way.

I have run into a couple minor issues:

1. I use Vim to work with my notes sometimes too. I use [vim-plug][5] to
   manage my Vim plugins. If I try `:PlugUpdate` while inside
   `~/work/notebook`, it refuses to run because I've set `$GIT_DIR`. Not
   really a big deal --- I just `cd` to bounce home (you did know that `cd`
   without args takes you `$HOME`, right?) then try again.
2. `git clone --bare` does not work for duplicating this setup on a new
   machine. I had tried `git --bare clone git@git.local:notebook.git
   ~/work/notebook.git`, but `cd ~/work/notebook; git status` reported `fatal:
   this operation must be run in a work tree`. I had to `git clone
   git@git.local:notebook.git ~/work/notebook-new && mv
   ~/work/notebook-new/.git ~/work/notebook.git`.

Hopefully this setup continues to work 🤞

[^1]: I _actually_ keep the real files for my notebook in `~/Library/Mobile
    Documents/iCloud~md~obsidian/Documents/notebook`. But, that's a pain to
    `cd` into, so I symlinked `~/work/notebook` to it.

[1]: https://direnv.net
[2]: https://obsidian.md
[3]: https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables
[4]: {% post_url 2021/2021-03-24-using-direnv-to-set-a-custom-git-email-for-work-projects %}
[5]: https://github.com/junegunn/vim-plug
