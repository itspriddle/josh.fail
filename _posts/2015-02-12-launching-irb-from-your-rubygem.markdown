---
layout: default
title: "Launching IRB from your RubyGem"
date: "Thu Feb 12 23:14:29 -0500 2015"
---

When developing a RubyGem, it is often helpful to launch an IRB console
preloaded with your library. There are a few ways you can do this.

First you can call IRB directly with the path to your gem:

```
# If using bundler
bundle exec irb -r./lib/my_gem.rb

# Without
irb -r./lib/my_gem.rb
```

This works great, and before [Bundler][], I always shipped a `rake console`
task that ran a similar command.


If you are using Bundler you can do this easier with the `bundle console`
command. Behind the scenes it does pretty much the same thing, but it also
sets up Bundler so you have access to dependencies.

For most purposes, `bundle console` is all you need. However, if you need to
add some custom behavior, such as console-only methods, you will need to
script this yourself.

I do this in some private projects to make it easier for debugging. For
example, I am working on a CLI script that connects to multiple databases
depending on the arguments given. In production this never happens at the same
time. In development though, it is pretty useful to access multiple databases
at once. Instead of copying and pasting the connection commands every time, I
can package this in a console script.

In another project, there are some convenience methods that make it easier to
work with the library in the console, but aren't necessarily something that
makes sense as a public API.

To illustrate, lets assume you have a gem called MyGem (using Bundler).

Create a file `lib/my_gem/console.rb` that contains the following:

```ruby
require "bundler/setup"
require "my_gem"
require "irb"

puts "Loading MyGem"

# Connect to the DBs
MyGem.connect_to_db :one
MyGem.connect_to_db :two

# This method will be available in the console
def say_hello
  puts "Say hello"
end

IRB.start
```

Next create a file in `script/console`:

```ruby
require File.expand_path("../../lib/my_gem/console", __FILE__)
```

Now when you want to run MyGem in the console, simply run `./script/console`
and it will require the library, connect to the DBs, and define the
`say_hello`.

[Bundler]: http://bundler.io/
