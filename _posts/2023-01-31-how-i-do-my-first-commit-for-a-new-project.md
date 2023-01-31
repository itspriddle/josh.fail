---
title: "How I do my first commit for a new project"
date: "Tue Jan 31 11:07:00 -0500 2023"
category: dev
---

Git isn't super friendly when you are creating a new project, especially on a
team. A simple way to work around this is using an empty commit.

When you first initialize a new repository via `git init`, there are no
commits at all. If you use Pull Requests, this means there isn't a commit yet
to base the first PR on.

A lot of developers will just `git init && git add . && git commit -m
'Import'`. That works but it prevents a team from offering feedback on the
initial code in a PR.

I sometimes also see people use GitHub or GitLab to create the repository with
a basic README or gitignore. This will establish a first commit for you, which
you can then base a PR on. However, if you already have a README or gitignore
in the project, you will run into merge conflicts immediately.

The easiest way I've found to handle this is to initialize repos manually and
use an empty commit as your first commit on any project.

Every new project I setup sees this setup:

```
mkdir new-project
git init
git commit --allow-empty -m 'First commit'
git remote add origin git@github.com:itspriddle/new-project.git
git push -u origin master
```

When I'm ready to import code:

```
git checkout -b import
git add .
git commit -m 'Import project'
git push -u origin checkout
hub pull-request # or open via github.com
```

This will open a new Pull Request with all of the code present for a team to
review.

If you use this often, you can setup a `git msg` alias by adding the following
to `~/.gitconfig`

```
[alias]
  msg = commit --allow-empty -m
```

Then just `git msg 'First commit'` creates an empty commit.
