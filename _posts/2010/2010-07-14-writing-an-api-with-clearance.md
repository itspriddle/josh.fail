---
date: Wed Jul 14 20:24:24 -0400 2010
title: Writing an API with Clearance
category: dev
redirect_from:
- /blog/2010/writing-an-api-with-clearance.html
- /dev/2010/writing-an-api-with-clearance.html
tags: [ruby, rails, clearance, api, authentication]
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

```ruby
# Put this in app/metals/api.rb
require 'sinatra/base'

class Api < Sinatra::Base

  before do
    content_type :json
    authenticate if api_request?
  end

  helpers do
    def api_request?
      request.path_info.match %r{/api/}i
    end

    def authenticate
      unless authenticated?
        response['WWW-Authenticate'] = %(Basic realm="My API")
        throw(:halt, [401, "Unauthorized\n"])
      end
    end

    def authenticated?
      auth = Rack::Auth::Basic::Request.new(request.env)
      auth.provided? && auth.basic? &&
        auth.credentials && @current_user = User.authenticate(*auth.credentials)
    end

    def current_user
      @current_user
    end
  end

  get '/api/account.json' do
    current_user.to_json
  end
end
```

Hope it helps someone else having this problem.

[gist]: https://gist.github.com/itspriddle/476335
