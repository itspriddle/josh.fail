require 'rubygems'
require 'rack'
require 'rack/contrib/try_static'

use Rack::TryStatic,
  :root => '_site',
  :urls => %w[/],
  :try  => %w[.html index.html /index.html]

run lambda { [404, {'Content-Type' => 'text/html'}, ['not found']]}
