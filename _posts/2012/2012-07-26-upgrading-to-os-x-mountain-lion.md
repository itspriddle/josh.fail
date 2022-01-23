---
date: "Thu Jul 26 00:13:41 -0400 2012"
title: "Upgrading to OS X Mountain Lion"
---

I installed OS X Mountain Lion today and have had a pretty good experience.

What I had to do:

* Install the new OS
* Install iMovie, iPhoto, and Pages updates via Mac App Store
* Install Xcode 4.4 via Mac App Store
* Install Xcode CLI tools (Xcode Preferences > Downloads > Command Line Tools)

Some Rubygems I use were built on libraries that had been updated (such as
Nokogiri and libxml). I went ahead and removed all of my gems and re-installed
them:

    bundle show | awk '{print $2}' | xargs gem uninstall -aIx

[`gem pristine --all`](http://guides.rubygems.org/command-reference/#gem_pristine)
will work too.

Finally, Apple removed the Java runtime I had installed. Fireworks CS5
requires that. It offered to download it for me when I opened the app for the
first time under Mountain Lion.

Other than the Java issue, I think most of these issue are to be expected when
installing an operating system upgrade. Certainly much smoother than the
upgrade from Snow Leopard to Lion.

_EDIT Aug 12:_ I suppose I spoke too soon. I've been having an annoying issue
where my laptop freezes trying to wake up from the screen saver. It seems to
be [this issue](https://discussions.apple.com/thread/4167551?start=0&tstart=0),
but the energy saver fix doesn't seem to fix it.
