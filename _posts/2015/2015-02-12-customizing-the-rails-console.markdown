---
layout: default
title: "Customizing the Rails Console"
date: "Thu Feb 12 23:39:35 -0500 2015"
---

Rails comes with the ability to customize the IRB console when you run `rails
console`. This can be useful to preconfigure behavior for your console when
any developer runs it from any environment.

This example is pulled almost directly from our Rails apps at Site5. First,
create `lib/console.rb` with the following:

```ruby
# Enable tab completion
require 'irb/completion'

app = Rails.application.class.name.split('::').first
env = Rails.env

# Define a custom prompt
# Eg:
#   my_app (development) >
IRB.conf[:PROMPT] ||= {}
IRB.conf[:PROMPT][:RAILS_APP] = {
  PROMPT_I: "#{app} (#{env}) > ",
  PROMPT_N: nil,
  PROMPT_S: nil,
  PROMPT_C: nil,
  RETURN:   "=> %s\n"
}

# Use the custom  prompt
IRB.conf[:PROMPT_MODE] = :RAILS_APP

unless Rails.env.production?
  # Save commands in `~/.app-env-irb-history`
  IRB.conf[:HISTORY_FILE] = File.expand_path("~/.#{app}-#{env}-irb-history")

  # Save 2000 lines of command history
  IRB.conf[:SAVE_HISTORY] = 2000
end
```

Next, edit `config/application.rb` and add the following:

```ruby
module MyApp
  class Application < Rails::Application
    console do
      ARGV.push "-r", root.join("lib/console.rb")
    end
  end
end
```

Under the hood, Rails starts the console with `IRB.start`, the same way the
standard `irb` command does. The code added to `config/application.rb` starts
the console like you had called `irb -rRAILS_ROOT/lib/console.rb`. When you
start the console, `console.rb` is required and your customizations are
loaded.

We've found this is a great way to configure the console environment in
development and production.
