---
title: "git pr: push current branch and open pull request"
date: "Sat Feb 28 16:57:47 -0500 2015"
category: dev
redirect_from: /blog/2015/git-pr-push-current-branch-and-open-pull-request.html
---

I use the awesome [hub][] utility to open pull requests on GitHub from the
command line. I love being able to do this from the terminal. Since I almost
always need to push a branch and copy the pull request URL to my clipboard, I
wrote a wrapper to handle these steps in one command.

This script does the following:

1. Pushes the branch to GitHub and tracks it.
2. Opens a pull request.
3. Copies the pull request URL to the clipboard (for pasting into HipChat, etc).

```sh
#!/bin/sh
# Usage: git pr [options]
#
# Help: Pushes the current branch upstream and opens a Pull Request. On OS X,
# the PR URL is copied to the clipboard. Requires a repo with github.com as
# the remote named origin and the `hub` CLI tool https://github.com/github/hub
#
# Examples:
#     git pr
#     git pr -b base-branch
#     git pr -m "This is my PR"
#     echo "This is my PR" | git pr -F -

set -e

# Internal, used with the $BROWSER variable to copy the pull request URL to
# the clipboard.
if [[ "$1" = "--pbcopy" ]]; then
  shift
  printf "%s" $1 | pbcopy
  exit
fi

# Check if the `hub` command is installed
if ! type hub &> /dev/null; then
  echo "Error: \`hub\` not found. Install from https://github.com/github/hub"
  exit 1
fi

# Check if the repo has a GitHub URL
if ! git config --get remote.origin.url 2> /dev/null | grep github &> /dev/null; then
  echo "Error: Remote \`origin' is not on GitHub, or is not setup."
  exit 1
fi

# Get the current branch name
branch=$(git symbolic-ref HEAD | sed 's|refs/heads/||g')

# Ensure we're not on the master branch
if [[ "$branch" = "master" ]]; then
  echo "Error: You are on \`master', checkout a new branch first!"
  exit 1
fi

# Push the branch to GitHub and track it
git push -u origin $branch

# Open the pull request. On OS X, copy the pull request URL to the clipboard.
# On Linux let `hub` print the pull request URL.
if [[ "$OSTYPE" = darwin* ]]; then
  # Hack to copy the pull request URL to the clipboard automatically
  BROWSER="$0 --pbcopy" hub pull-request -o "$@"
  echo "Created pull request - $(pbpaste)"
else
  hub pull-request "$@"
fi
```

When I'm ready to open a new pull request for feedback, I can simply run `git
pr` to push the remote branch and open the pull request. Some examples of how
I use it:

```
# Open $EDITOR to compose the pull request subject and message
git pr

# Supply a subject
git pr -m "My new feature"

# Supply a subject and message
git pr -m "My new feature

This is a more detailed description of my new feature."
```

I've been using this script several times a week for about 3 years now, and it
has worked great for me --- I hope it helps someone else!

[hub]: https://github.com/github/hub
