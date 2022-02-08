---
title: "Useful git configs and aliases"
date: "Wed Oct 30 23:03:28 -0400 2019"
category: dev
redirect_from:
- /blog/2019/useful-git-configs-and-aliases.html
- /dev/2019/useful-git-configs-and-aliases.html
---

Here are some of my favorite git configs and aliases.

Most of these settings are in `~/.gitconfig`, the global git configuration
file.

Note that this post duplicates configuration names like `[alias]` in different
sections. Your `~/.gitconfig` file should only include one `[alias]` line, and
all aliases should appear under.

### Colors

I like colors everywhere:

```
[color]
  ui = auto
```

But I'm also particular about which ones I see. I set these up years ago and
have just stuck with them ever since:

```
; Colors for `git status`
[color "status"]
  header    = yellow bold
  added     = green bold
  updated   = green reverse
  changed   = magenta bold
  untracked = red

; Colors for `git diff`
[color "diff"]
  meta       = yellow bold
  frag       = magenta bold
  old        = red bold
  new        = green bold
  whitespace = red reverse
```

### Default `--pretty` format

For things like `git log`, `git show`, etc, I like to keep things simple and
concise, so I set the following:

```
[format]
  pretty = format:%C(red)%h%Creset%C(yellow)%d%Creset %C(magenta)%an%Creset: %s %C(green)(%ar)%Creset
```

For `git log`, git shows commits on a single line with only the most useful
information I need

I often use `git show --format=fuller [sha]` to see the _full_ details of a
commit when I need more context.

### Pulling Branches

Ever run `git fetch` and see dozens of remote branches pulled in? If you run
`git branch --remotes` you'll likely see references to old branches that have
already been merged in to master. You can tell git to clean these
automatically, any time you run `git fetch` or `git pull`, with the following
setting:

```
[fetch]
  prune = true
```

Like to handle things manually? You can create a `git prune-branches` alias:

```
[alias]
  prune-branches = !git branch --merged | grep -v '^master$' | grep -v "\\\\*" | xargs -n 1 git branch -d
```

### Pushing Branches

In older versions of git, `git push` without any branch specified would push
_all_ branches to origin. Since this is hardly ever what you'd want, it is now
disabled by default. But if you want to keep safe in case you come cross any
old git versions, you can add the following:

```
[push]
  default = current
```

This makes `git push` operate on the currently checked out branch only.

### Viewing Branches

I often have a few different branches being worked on at once and it is useful
to see them by the last commit date. The following enables this behavior by
default when running `git branch` commands to list branches:

```
[branch]
  sort = -authordate
```

I also use the following `git recent-branches` alias to show me 10 most recent
branches by date:

```
[alias]
  recent-branches  = for-each-ref --count=10 --sort=-committerdate --format=\"%(refname:short)\" refs/heads/
```

Need the current branch name? Try a `git branch-name` alias (also try `git
branch-name | pbcopy` on MacOS to copy it to your clipboard):

```
[alias]
  branch-name = rev-parse --abbrev-ref HEAD
```

### Disable advice

Git is nice enough to provide advice on certain commands. For example, `git
status` will show advice on how to `git add` files. I find some of these
annoying so I disable the following:

```
[advice]
  statusHints        = false
  pushNonFastForward = false
```

### Nicer `git status`

For a more concise status output, `git status --short --branch` can be used.
It can be setup by default using:

```
[status]
  short = true
  branch = true
```

Want a verbose status once in a while? Try `git status --no-short`.

### Viewing commits

I mentioned above that I often use `git show --format=fuller`, so I have this
alias:

```
[alias]
  showf = show --format=fuller
```

I have this rarely used alias to show a more detailed log view with `git lg`:

```
[alias]
  lg = log --graph --abbrev-commit --date=relative
```

For when I want full log details there's `git full-log`:

```
[alias]
  full-log = log --format=fuller
```

I can see the last commit's SHA with `git last-sha`:

```
[alias]
  last-sha = rev-parse --short HEAD
```

I can see the commits I've made to a local branch but haven't yet pushed
upstream with `git pending`:

> Note: this requires you pushed with `git push -u` to track your remote.

```
[alias]
  pending = !git --no-pager log @{u}.. && echo
```

I can see the last committer with `git last-committer`:

```
[alias]
  last-committer = !git --no-pager log --pretty="%an" --no-merges -1
```

Or I can see the last commit subject with `git last-subject` (great for
copy/pasting into pull requests):

```
[alias]
  last-subject = !git --no-pager log --pretty="%s" -1
```

Sometimes I want to see just the filenames that were changed in a commit, and
`git show-files` does this. It can also work on a branch, like `git show-files
master..HEAD` to show everything changed on the current branch vs master. This
is great when you want to run tests or linters on those files (eg
`make-me-pretty $(git show-files master..HEAD)`):

```
[alias]
  show-files = !git --no-pager show --name-only --format=
```

On MacOS or a system with Ruby's webrick gem installed, `git web` will spawn a
web interface for browsing (close with `git web --close`):

```
[alias]
  web = instaweb --httpd=webrick -b open
```

### Undoing things

For when I've run `git add` on files and I want to backout, `git unstage` does
the job (`git unstage -- .` to unstage everything, or `git unstage -- file1`
to specify files):

```
[alias]
  unstage = reset HEAD -- ...
```

If I've already committed, I have `git undo` to undo the commit (which can
then be unstaged with `git unstage`):

```
[alias]
  undo = reset --soft HEAD^
```

If I've made a typo and haven't pushed yet, I have `git amend` to amend the
last commit. Typically I'll `git amend -a` or `git add changed-file; git
amend`. I like this command to reset the commit date too.

```
[alias]
  amend = !git commit --amend --date=\"$(date)\" -C HEAD
```

### Per-System overrides

I like to keep my default `~/.gitconfig` setup to work for personal projects.
On systems where I need something different, such as my email, I use the
following setup.

In `~/.gitconfig` I include a local, system specific configuration file:

```
[include]
  path = ~/.gitconfig.local
```

Then in _that_ `~/.gitconfig.local` file, specific customizations are made:

```
[user]
  email = work@josh.fail
```

### Bonus: Bash/ZSH aliases

I use these select few shell aliases for things I do all the time. They can be
added to `~/.bashrc` for Bash users or `~/.zshrc` for ZSH users.

The obvious ones:

```
alias gb='git branch'
alias gbd='git branch -d'
alias gco='git checkout'
alias gd='git diff'
alias gdc='git diff --cached'
alias gs='git status'
```

For when I've deleted a lot of files from a repo I have `grm` to remove
them from git as well:

```
alias grm="git status --porcelain | awk '\$1 == \"D\" {print \$2}' | xargs git --git-dir=\$(git rev-parse --git-dir) rm --ignore-unmatch"
```

Finally, two favorites, `gcomp` and `gcomp-` (mnemonic: **g**it **c**heckout
**m**aster **p**ull). `gcomp` checks out master and pulls, `gcomp-` checks out
master and pulls, _then_ checks out the previous branch. Any time I'm about to
push up a new pull request I'll run `gcomp- && git rebase master` to make sure
I'm up to date.

```
alias gcomp='git checkout master; git pull'
alias gcomp-='git checkout master; git pull; git checkout -'
```
