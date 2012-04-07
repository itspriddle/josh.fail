require 'rubygems'
require 'rack/static'
require 'rack/contrib/not_found'
require 'rack/contrib/try_static'

unless ENV['RACK_ENV'] == 'production'
  use Rack::Static,
    :root => ".",
    :urls => ["/stylesheets"]
end

use Rack::TryStatic,
    :root => "_site",
    :urls => %w[/],
    :try  => ['.html', 'index.html', '/index.html']

run Rack::NotFound.new '_site/404.html'
