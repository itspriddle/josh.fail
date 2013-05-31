---
layout: default
date: "Tue May 28 23:22:46 -0400 2013"
title: "How We Hack At Site5"
---

Hacking for [Site5 Engineering](http://eng5.com/) is an awesome gig. I work
with an [amazing team](https://github.com/site5?tab=members) of highly
opinionated developers from a wide background. In early 2012, we adopted a
semi-formal process for working on software. We've been very happy with how
this has worked out, so I thought it was time to share.

## Step 1: Discuss the change

Code written for Site5 projects usually falls under one of four categories:

* new features
* bug fixes
* code refactoring
* library upgrades

Before someone starts coding, they will typically discuss the changes they
intend to make or the bug to be fixed. Developers use GitHub issues for most
communications on a project.

Sometimes this discussion happens in real-time using our company chat room or
Teamspeak. GitHub issues also make it easy to report bugs or request features
to be discussed at a later date.

We tried Basecamp for these discussions, but found it was a bit difficult for
developers to change context. We did find, however, that it was a great tool
to discuss features with non-developers.

Wherever possible, we try to stick to one topic at a time and keep changes as
small as possible. For example, features are added one at a time, bugs are
fixed one at a time. We've found this makes it much easier for other
developers to review code changes.

## Step 2: Create a new git topic branch

Once a developer is sure of what they are working on, the next step is to
create a new topic branch in git. We try to namespace these using one of the
following:

* feature/name
* bugfix/name
* refactory/name
* upgrade/name

This just makes it easier to determine what a branch is for using just its
name.

## Step 3: Write the code and commit changes

At this point, it is time to start coding. We are pretty much free to code
things as we see fit, unless specifics were mentioned in the original
discussion.

We're strong proponents of BDD, so if a project has a test suite (and most of
them do), we try to follow that process while working.

Where it makes sense, we will usually make one commit describing the changes
that are being made.

If we need to test things on a staging environment, this is where it happens.

## Step 4: Open a new Pull Request and solicit feedback

Once code has been committed, it is time to open a new pull request and
solicit feedback from the rest of the team.

Other developers review the code to ensure that there are no issues with it,
or to offer ideas for refactories. If there are any changes to be made, the
original author will then make them. The new changes will be discussed for any
further feedback, and the process continues.

At least one reviewer must informally sign off on a Pull Request in order for
it to be merged. This is usually just an emoji `:+1:`.

## Step 5: Rebase if needed

We try to avoid cluttering a project's git history with a lot of extra
commits. If there are additional changes added from feedback in Step 4, we
will use `git rebase -i` to squash them down into one commit. Of course, this
is only done where it makes sense -- two commits are better than one if they
better describe the intended changes.

## Step 6: Verify CI build and merge Pull Request

If the project has a test suite, we wait for our CI server (either
[Jenkins](http://jenkins-ci.org) or [Travis CI](https://travis-ci.org)) to
verify the build succeeds. After that, any reviewer can merge the Pull
Request. As a rule, we don't merge our own Pull Requests.

## Step 7: Tie up loose ends

After a Pull Request is merged, we may need to tie up some loose ends such as
deploying an updated Rails app, or replying to customers or staff to inform
them a bug was fixed. This obviously depends on the situation, but it is an
important step nonetheless.

## Step 8: Beer (or Red Bull)

After all that work, it is time to enjoy a beer or a tasty Red Bull!
