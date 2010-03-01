---
layout: post
title: Mozilla Thunderbird 2 on Ubuntu
---
Installing Thunderbird 2 on Ubuntu was cake.

<strong>sudo apt-get build-dep mozilla-thunderbird</strong>

<strong>tar -vzxf thunderbird-2.0.0.0.tar.gz</strong>

<strong>sudo mv thunderbird /usr/lib</strong>

<strong>sudo ln -s /usr/lib/thunderbird/thunderbird /usr/bin/thunderbird </strong>

Then, just go to System &gt; Preferences &gt; Menu Layout, and add a new application launcher in Internet.  The command is <strong>/usr/bin/thunderbird</strong> and the icon is in <strong>/usr/lib/thunderbird/icons/</strong>

Enjoy.
