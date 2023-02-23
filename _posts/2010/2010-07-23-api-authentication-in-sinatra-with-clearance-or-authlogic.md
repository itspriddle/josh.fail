---
date: Fri Jul 23 14:16:49 -0400 2010
title: API authentication in Sinatra with Clearance or Authlogic
category: dev
redirect_from:
- /blog/2010/api-authentication-in-sinatra-with-clearance-or-authlogic.html
- /dev/2010/api-authentication-in-sinatra-with-clearance-or-authlogic.html
tags: [ruby, rails, sinatra, clearance, authlogic, authentication, api]
---

I needed HTTP basic authentication for a [Sinatra][] app running as a Rails
Metal. I have two apps, one running [Clearance][] and another running
[Authlogic][].

Using the info from my [previous post][] I wrote a small Sinatra plugin that
works with both Clearance and Authlogic.

```ruby
module MyApp
  module Sinatra
    module Authentication
      def self.registered(app)
        app.before do
          content_type :json
          authenticate if api_request?
        end
        app.helpers Helpers
      end

      module Helpers
        def api_request?
          request.path_info.match %r{^/api/}i
        end

        def authenticate
          unless authenticated?
            response['WWW-Authenticate'] = %(Basic realm="API")
            throw(:halt, error('Unauthorized', 401))
          end
        end

        def authenticated?
          auth = Rack::Auth::Basic::Request.new(request.env)
          auth.provided? && auth.basic? &&
            auth.credentials && @current_user = ::User.authenticate(*auth.credentials)
        end

        def current_user
          @current_user
        end

        def render(output, code = 200)
          out = { :response => output }.to_json + "\n"
          [code.to_i, out]
        end

        def error(output = 'ERROR', code = 400)
          render(output, code)
        end
      end
    end
  end
end
```

Trow the file above in `lib/sinatra_authentication.rb`. Then, your metal,
`app/metals/api.rb` would look something like this:

```ruby
require 'sinatra_authentication'

class Api < Sinatra::Base
  register ::MyApp::Sinatra::Authentication
  
  get '/api/ping' do
    render "Authentication successful"
  end
end
```

Authlogic doesn't have an `authenticate` method, so I added this to
`app/models/user.rb`:

```ruby
class User < ActiveRecord::Base
  acts_as_authentic

  def self.authenticate(username, password)
    c = find_by_username(username)
    c && c.valid_password?(password) ? c : nil
  end
end
```

Hope it helps someone else.

[Sinatra]: http://sinatrarb.com
[Clearance]: http://github.com/thoughtbot/clearance
[Authlogic]:http://github.com/binarylogic/authlogic
[previous post]: {% post_url 2010/2010-07-14-writing-an-api-with-clearance %}
[gist]: https://gist.github.com/itspriddle/487806
