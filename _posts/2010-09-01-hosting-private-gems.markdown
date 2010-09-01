---
layout: post
title: "Hosting Private Gems"
date: Wed Sep 01 01:39:09 -0400 2010
categories:
  - Development
  - Ruby
---

I've written a few gems for work that I can't host on RubyGems. It turned
out to be easier to host these than I thought.

Here are the steps I took to make `gems.mysite.com` host gems that
can be installed with `gem install [gem] --source http://gems.mysite.com/`

### Setup (Remote)

    mkdir -p /home/gems

### Setup (Local)

    git clone git://github.com/itspriddle/private-gem-host.git gems.mysite.com
    cd gems.mysite.com
    curl -O http://gist.github.com/raw/398175/b15c71189eb3883986f19f24df6b8b4c7cf2d003/post-update > .git/hooks/post-update
    chmod +x .git/hooks/post-update
    git remote add production user@mysite.com:/home/gems/.git
    scp -r .git user@mysite.com:/home/gems/

### Setup (Remote, Again)

    cd /home/gems/
    git config receive.denyCurrentBranch ignore

### Apache vhost Configuration

    # /etc/apache2/site-enabled/gems.mysite.com
    <VirtualHost *:80>
      ServerName gems.mysite.com

      DocumentRoot /home/gems/public/

      <Directory /home/gems/public>
        Options Indexes MultiViews FollowSymLinks
        AllowOverride None
        Order Deny,Allow
        Deny from all
        # Only these IPs can reach this site
        Allow from 123.1.1.
      </Directory>
    </VirtualHost>


### Add some gems (Local)

    cp ~/gems/my-secret-library-1.0.0.gem public/gems
    git add public/gems/my-secret-library-1.0.0.gem
    git commit -m "Added My Secret Library 1.0.0"
    git push production master


### Install gems

    gem install my-secret-library --source http://gems.mysite.com/


### How does it work?

The script in `bin/update_gems` is called by the `post-receive` hook you setup.
Each time you push to production, this script will run and then update
the meta files needed (check `/home/gems/public/YAML` on your remote box
for an example). You should see the output when you push.
