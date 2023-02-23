---
date: Thu Aug  5 14:08:05 -0400 2010
title: Rake tasks to build Titanium Mobile Apps
category: dev
redirect_from:
- /blog/2010/rake-tasks-to-build-titanium-mobile-apps.html
- /dev/2010/rake-tasks-to-build-titanium-mobile-apps.html
tags: [ruby, titanium, rake, mobile, iphone, android]
---

I've been working with [Titanium Mobile](http://www.appcelerator.com/)
to build an iPhone app. Using Titanium Developer to launch
the app in the iPhone simulator is a pain in the ass. It
would be great if I could build via the command line.

I found [this rakefile](http://github.com/plugawy/mikrob/blob/a9e617d2d34e2d634cb7ea2a53059d8938dede0e/Rakefile)
that I was able to adapt for Titanium Mobile. Now I can
validate my app's JavaScript and launch it in the simulator
simply by invoking `rake`.

```ruby
#
# Titanium Mobile Rake tasks
#
# Validate and launch your Titanium Mobile application via Rake
#
# Edit Application::COMPILER if not using OS X
# Requires jsl (install on OS X via homebrew with `brew install jsl`)
#
# Only supports iPhone right now.
#
# Based on http://github.com/plugawy/mikrob/blob/a9e617d2d34e2d634cb7ea2a53059d8938dede0e/Rakefile
#

module Application
  extend self

  SDK_VERSION = ENV['SDK_VERSION'] || "1.4.0"
  IOS_VERSION = ENV['IOS_VERSION'] || "4.0"
  PLATFORM    = ENV['PLATFORM']    || 'iphone'
  COMPILER    = "/Library/Application\\ Support/Titanium/mobilesdk/osx/" +
                "#{SDK_VERSION}/%s/builder.py" % PLATFORM

  def manifest
    @manifest ||= File.read('manifest').lines.inject({}) do |hash, line|
      key, val = line.chomp.sub('#', '').split(': ')
      hash.merge({key.to_sym => val})
    end.freeze
  end

  def name
    manifest[:appname]
  end

  def description
    manifest[:desc]
  end

  def root
    File.expand_path(File.dirname(__FILE__))
  end

  def log
    root + '/log/development.log'
  end

  def appid
    manifest[:appid]
  end

  def launch_in_simulator
    case PLATFORM.to_sym
    when :iphone
      puts %x{#{COMPILER} simulator #{IOS_VERSION} #{root} #{appid} #{name} 1>> #{log} 2>> #{log} &}
    when :android
      # avd_id = 4 # not sure?
      # puts %x{#{COMPILER} simulator #{name} /opt/android-sdk #{root} #{appid} #{avd_id} 1>> #{log} 2>> #{log} &}
    end
  end
end

namespace :application do

  namespace :log do
    desc "Watch #{Application.log} for INFO events"
    task :info do
      sh "clear && tail -f #{Application.log} | grep '[INFO]'"
    end
  end

  desc "Check the JavaScript source with JSLint"
  task :validate_js do
    output = []
    bar = "=" * 80

    output << "Checking JavaScript files for errors with JSLint"
    output << bar

    failed_files = []

    Dir['Resources/**/*.js'].each do |fname|
      results = %x{jsl -nologo -nocontext -nofilelisting -process #{fname} | grep err}.chomp
      errors, warnings = results.split(",")
      e_count = errors.split(' ').first.to_i
      w_count = warnings.split(' ').first.to_i
      if e_count > 0
        failed_files << fname
        fname = "\033[4;31m%s\033[0m" % fname # red underline
      elsif w_count > 0
        fname = "\033[4;93m%s\033[0m" % fname # yellow underline
      end
      output << "#{results}: #{fname}"
    end

    failed = failed_files.size > 0

    output << bar
    if failed
      output << "#{Application.name} will not compile due to JavaScript errors."
    else
      output << "No JavaScript errors found."
    end
    puts "\n#{output.join("\n")}\n#{bar}"
    exit 1 if failed
  end

  desc "Build #{Application.name} (validate JavaScript and launch in simulator)"
  task :build => :validate_js do
    Application.launch_in_simulator
  end

end

task :default => ['application:build']
```

Hope it's of use to someone else.
