---
layout: post
title: Rake tasks to build Titanium Mobile Apps
date: Thu Aug  5 14:08:05 EDT 2010
categories:
  - Development
  - Ruby
  - iPhone
  - Appcelerator
---
I've been working with [Titanium Mobile](http://www.appcelerator.com/)
to build an iPhone app. Using Titanium Developer to launch
the app in the iPhone simulator is a pain in the ass. It
would be great if I could build via the command line.

I found [this rakefile](http://github.com/plugawy/mikrob/blob/a9e617d2d34e2d634cb7ea2a53059d8938dede0e/Rakefile)
that I was able to adapt for Titanium Mobile. Now I can
validate my app's JavaScript and launch it in the simulator
simply by invoking `rake`.

<script src="http://gist.github.com/510088.js?file=Rakefile"> </script>

Hope it's of use to someone else.

