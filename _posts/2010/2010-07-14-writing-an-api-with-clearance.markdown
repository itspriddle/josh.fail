---
date: Wed Jul 14 20:24:24 -0400 2010
title: Writing an API with Clearance
---

Recently, I needed to write an API to work with an iPhone application. I
used [Clearance](http://github.com/thoughtbot/clearance) for authentication.
Unfortunately, it doesn't support HTTP Basic Authentication out of the box,
which made it difficult to use in an API.

I found [this issue](http://github.com/thoughtbot/clearance/issues/34) with
a [patch](http://gist.github.com/159604) that worked. However, the
Thoughtbot guys said that `Rack::Auth::Basic` should be used instead. No
examples were provided.

I tried for a few days to get things to work with Rack and ended up using
that patch.

Today I decided to take another look at this. I found a
[cached slideshow](http://webcache.googleusercontent.com/search?q=cache:D1qO0ICwy8gJ:training.thoughtbot.com/slideshows/api+clearance+http+basic+auth&hl=en&client=safari&gl=us&strip=1)
on Google that had the info I needed to make an API
using a Sinatra app as a Rails Metal.

This is basically how I got HTTP Basic Auth working with Clearance:

{% gist 476335 api.rb %}

Hope it helps someone else having this problem.
