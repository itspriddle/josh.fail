---
layout: post
title: API authentication in Sinatra with Clearance or Authlogic
date: Fri Jul 23 14:16:49 EDT 2010
short_description: |
  <p>
    I needed HTTP basic authentication for a <a href="http://sinatrarb.com">Sinatra</a>
    app running as a Rails Metal. I have two apps, one running
    <a href="http://github.com/thoughtbot/clearance">Clearance</a> and another running
    <a href="http://github.com/binarylogic/authlogic">Authlogic</a>.
  </p>
  <p>
    Using the info from my
    <a href="/blog/writing-an-api-with-clearance.html">previous post</a>, I
    wrote a small Sinatra plugin that works with both Clearance and Authlogic.
  </p>
---

I needed HTTP basic authentication for a [Sinatra](http://sinatrarb.com)
app running as a Rails Metal. I have two apps, one running
[Clearance](http://github.com/thoughtbot/clearance) and another running
[Authlogic](http://github.com/binarylogic/authlogic).

Using the info from my [previous post](/blog/writing-an-api-with-clearance.html),
I wrote a small Sinatra plugin that works with both Clearance and Authlogic.

<script src="http://gist.github.com/487806.js?file=sinatra_authentication.rb"> </script>

Throw the file above in `lib/sinatra_authentication.rb`. Then, your metal,
`app/metals/api.rb` would look something like this:

<script src="http://gist.github.com/487806.js?file=api.rb"> </script>

Authlogic doesn't have an `authenticate` method, so I added this to
`app/models/user.rb`:

<script src="http://gist.github.com/487806.js?file=user.rb"> </script>

Hope it helps someone else.
