---
layout: post
title: "Wage intergalactic war on your Titanium Mobile apps with TiFighter"
published: true
categories:
- Development
- iPhone
- Appcelerator
---

Over the last 10 months, I've had the opportunity to work with Titanium
Mobile for a few different projects. I was immediately drawn to Titanium
because projects are written in JavaScript (which I know) as opposed to
Objective C or Java (which I don't know). JavaScript is all well and good,
but I still found myself missing things from jQuery, like `$.each`, `$.map`
and friends.

While writing my first app, I found myself slowly adding helpers I needed. I
created [this extraction](https://github.com/itspriddle/titanium_mobile-helpers)
and added bits and pieces to it over a few more projects.

When I started work on DotBlock mobile, there was one last jQuery pattern I
really wanted to use in Titanium, `$(el).fn`. Stuff like
`$(el).attr('height')`. So, I set out to create something that working
similarly with Titanium objects.

Thus was born [TiFighter](https://github.com/itspriddle/ti-fighter). Here's
the login window right from DotBlock mobile (with a few extra comments added),
which shows some of TiFighter's usage (note that I've aliased `$` to
`TiFighter` outside of this script):

<script src="https://gist.github.com/846492.js?file=dotblock.login.js"> </script>

TiFighter has been an awesome time saver while working on DotBlock Mobile,
and I'm sure it will prove useful in my Titanium apps as well. I hope it
is useful to other developers as well.
