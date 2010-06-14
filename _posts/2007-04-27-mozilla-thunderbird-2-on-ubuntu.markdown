---
layout: post
title: Mozilla Thunderbird 2 on Ubuntu
categories:
  - Linux
  - Ubuntu
---
Installing Thunderbird 2 on Ubuntu was cake.

    sudo apt-get build-dep mozilla-thunderbird
    tar -vzxf thunderbird-2.0.0.0.tar.gz
    sudo mv thunderbird /usr/lib
    sudo ln -s /usr/lib/thunderbird/thunderbird /usr/bin/thunderbird

Then, just go to System &gt; Preferences &gt; Menu Layout, and add a new
application launcher in Internet.  The command is `/usr/bin/thunderbird`
and the icon is in `/usr/lib/thunderbird/icons/`

Enjoy.
