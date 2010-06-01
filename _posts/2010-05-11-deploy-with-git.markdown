---
layout: post
title: Deploy with git
date: Tue May 11 23:39:10 EDT 2010
categories:
  - Development
---
I found this git hook that lets you deploy a project with a git push rather
than having to use a full deployment library such as [Capistrano](http://capify.org).
I use this on a bunch of PHP projects that don't need all the features Capistrano
provides.

On the remote server, we're going to assume you're keeping your project in
`/var/www/example.com` from a repository called `example.com`

{% highlight bash %}
mkdir /var/www/example.com
cd /var/www/example.com
git init
git config receive.denyCurrentBranch ignore
cd .git/hooks
curl -O http://gist.github.com/raw/398175/b0a281817b307ca21dd7c21b34cadbd91170ead8/post-update
chmod +x post-update
{% endhighlight %}

On your local development machine:

    cd /path/to/example.com
    git remote add production user@myserver.com:/var/www/example.com/.git
    git push production master

Any time you need to update in the future, just use `git push production [branch]`
and it'll be updated on your remote server.
