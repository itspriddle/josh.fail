---
layout: default
date: Tue May 11 23:39:10 -0400 2010
short_description: |
  <p>
    I found this git hook that lets you deploy a project with a git push
    rather than having to use a full deployment library such as
    <a href="http://capify.org">Capistrano</a>. I use this on a bunch of PHP
    projects that don&rsquo;t need all the features Capistrano provides.
  </p>
title: Deploy with git
---

I found this git hook that lets you deploy a project with a git push rather
than having to use a full deployment library such as [Capistrano](http://capify.org).
I use this on a bunch of PHP projects that don't need all the features Capistrano
provides.

On the remote server, we're going to assume you're keeping your project in
`/var/www/example.com` from a repository called `example.com`

    mkdir /var/www/example.com
    cd /var/www/example.com
    git init
    git config receive.denyCurrentBranch ignore
    cd .git/hooks
    curl -O http://gist.github.com/raw/398175/b15c71189eb3883986f19f24df6b8b4c7cf2d003/post-update
    chmod +x post-update

On your local development machine:

    cd /path/to/example.com
    git remote add production user@myserver.com:/var/www/example.com/.git
    git push production master

Any time you need to update in the future, just use `git push production [branch]`
and it'll be updated on your remote server.
