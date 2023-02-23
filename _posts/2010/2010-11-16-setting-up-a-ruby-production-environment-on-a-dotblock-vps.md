---
date: Tue Nov 16 17:30:00 -0400 2010
title: "Setting up a Ruby production environment on a DotBlock VPS"
category: dev
redirect_from:
- /blog/2010/setting-up-a-ruby-production-environment-on-a-dotblock-vps.html
- /dev/2010/setting-up-a-ruby-production-environment-on-a-dotblock-vps.html
tags: [ruby, rails, git, apache, mysql, ubuntu, hosting]
---

My projects' production environments consist of Git, Ruby, Apache, and usually
a hand full of RubyGems. These are the steps I took to set these up using
Ubuntu 10.04 on my new [DotBlock](http://www.dotblock.com) VPS. These steps
were performed immediately after the VPS was setup, so there weren't any
additional packages/dependencies yet installed.

### Git

I use git extensively to track just about every line of code I write. Ubuntu
is usually a few versions behind on git, so I choose to compile from source
using these steps:

    sudo -i
    apt-get install build-essential zlib1g-dev ibcurl4-openssl-dev tk
    cd /usr/local/src/
    wget http://kernel.org/pub/software/scm/git/git-1.7.3.2.tar.bz2
    tar -vjxf git-1.7.3.2.tar.bz2
    cd git-1.7.3.2
    ./configure --prefix=/usr/local
    make
    make install
    cd ..
    git clone git://git.kernel.org/pub/scm/git/git.git git-HEAD
    cd git-HEAD
    git archive --format=tar origin/man | tar -x -C /usr/local/share/man/ -vf -
    exit


### Ruby

Again, Ubuntu is usually several versions behind with Ruby, so I always
recommend compiling from source. I like to use 1.8.7 as my "system ruby", and
then RVM to install others. Here are the steps to compile Ruby:

    sudo -i
    apt-get install libreadline6-dev openssl bison autoconf libxml2-dev
    cd /usr/local/src/
    wget ftp://ftp.ruby-lang.org:21/pub/ruby/1.8/ruby-1.8.7-p302.tar.gz
    tar -vzxf ruby-1.8.7-p302.tar.gz
    cd ruby-1.8.7-p302
    ./configure --prefix=/usr/local
    make
    make install
    exit


### RubyGems

Once Ruby is compiled, you can install RubyGems.

    sudo -i
    cd /usr/local/src
    wget http://production.cf.rubygems.org/rubygems/rubygems-1.3.7.tgz
    tar -vzxf rubygems-1.3.7.tgz
    cd rubygems-1.3.7
    ruby setup.rb
    exit


### Apache 2 and Passenger (mod_rails)

With RubyGems installed, you can now setup Apache and Passenger to serve Ruby
apps over Apache. I didn't let Ubuntu install Apache for me (by selecting LAMP
during the OS setup). If you did, run `apt-get install apache2-dev` below,
instead of `apt-get install apache2 apache2-dev`.

    sudo -i
    apt-get install apache2 apache2-dev
    gem install passenger
    passenger-install-apache2-module
    cd /etc/apache2/mods-available/
    wget https://gist.github.com/raw/702444/bfdf7232848efa47cb211b7c6fa48188f9e09898/passenger.load
    wget https://gist.github.com/raw/702444/18b083fb1b94a97fee28590313e642700981a57f/passenger.conf
    a2enmod passenger
    /etc/init.d/apache2 restart
    exit


### Bundler

All of the cool kids in the Ruby world use [Bundler](http://gembundler.com) to
manage gem dependencies in apps. I like to install bundler as a system gem so
it is available for deploy users.

    sudo gem install bundler


### MySQL

My database of choice is MySQL. Setup the server and gem client with:

    sudo -i
    apt-get install mysql-server
    gem install mysql2
    exit


### Stop! Hammer Time!

You're now ready to deploy to your new production environment!
