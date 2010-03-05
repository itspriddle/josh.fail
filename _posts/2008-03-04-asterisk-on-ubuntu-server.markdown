---
layout: post
title: Asterisk on Ubuntu Server
categories:
  - Asterisk
  - Linux
  - Ubuntu
---
I know I've blogged this before, but these are the steps I took most recently to get Asterisk running on a fresh Ubuntu Server (Dapper) installation. The instructions will also work on Feisty or Gutsy server.

    # apt-get install linux-headers-`uname -r` build-essential libssl-dev libncurses5-dev libspeex-dev sox sox-dev
    # mkdir /usr/src/asterisk
    # cd /usr/src/asterisk
    # wget http://downloads.digium.com/pub/asterisk/releases/asterisk-1.4.18.tar.gz
    # wget http://downloads.digium.com/pub/zaptel/zaptel-1.4.9.2.tar.gz
    # tar -vzxf zaptel-1.4.9.2.tar.gz
    # cd zaptel-1.4.9.2.tar.gz
    # ./configure
    # make
    # make install
    # make config
    # cd ..
    # tar -vzxf asterisk-1.4.18.tar.gz
    # cd asterisk-1.4.18
    # ./configure
    # make
    # make install
    # asterisk
    # asterisk -r

If all goes well, you should see the Asterisk console.

Note: I am not 100% sure which repos have the packages mentioned, but I had the universe and multiverse repos added so my sources.list for apt.
