---
date: Fri Jul 23 14:16:49 -0400 2010
title: API authentication in Sinatra with Clearance or Authlogic
---

I needed HTTP basic authentication for a [Sinatra](http://sinatrarb.com)
app running as a Rails Metal. I have two apps, one running
[Clearance](http://github.com/thoughtbot/clearance) and another running
[Authlogic](http://github.com/binarylogic/authlogic).

Using the info from my [previous post](/blog/writing-an-api-with-clearance.html),
I wrote a small Sinatra plugin that works with both Clearance and Authlogic.

{% gist 487806 sinatra_authentication.rb %}

Throw the file above in `lib/sinatra_authentication.rb`. Then, your metal,
`app/metals/api.rb` would look something like this:

{% gist 487806 api.rb %}

Authlogic doesn't have an `authenticate` method, so I added this to
`app/models/user.rb`:

{% gist 487806 user.rb %}

Hope it helps someone else.
