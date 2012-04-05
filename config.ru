require 'rubygems'
require 'bundler'
Bundler.require

use Rack::TryStatic,
    :root => "_site",
    :urls => %w[/],
    :try  => ['.html', 'index.html', '/index.html']

run lambda { [404, {'Content-Type' => 'text/html'}, ['Not Found']]}
