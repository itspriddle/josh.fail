---
title: "Shell Tricks: Custom ruby shebangs for speed"
date: "Sun Feb 19 01:48:42 -0500 2017"
category: dev
redirect_from:
- /blog/2017/shell-tricks-custom-ruby-shebangs-for-speed.html
- /dev/2017/shell-tricks-custom-ruby-shebangs-for-speed.html
---

This is part 2 of my series on tricks I've used in shell scripts. In this
post, I'll share a few ways a custom shebang can be used in ruby scripts.

If you don't know what a "shebang" is --- it is the first line commonly seen
in scripts that starts with `#!`. When a script is run, this line determines
the program to run to interpret the rest of the script. Wikipedia has a [more
thorough explanation][shebang wiki].

In a ruby script, this is typically one of the following:

```
#!/usr/bin/env ruby

#!/usr/bin/ruby
```

The first version will use the first `ruby` found on your `PATH` to execute
the script. If you are using a ruby version manager (chruby, rbenv, RVM), a
script with the first shebang will use the correct ruby. Most ruby scripts in
the wild use this version.

The second version specifies a specific ruby to execute the script,
`/usr/bin/ruby`. On OS X this is ruby 2.0.0. If additional rubies are
installed, running a script with the second shebang will *always* use OS X's
ruby 2.0.0. This isn't usually desirable, which is why most scripts use the
first form.

Why not always use the first version?

Two reasons. First, in some cases it actually is desirable to hard-code the
program that will execute your script. Second, you can pass arguments to the
program in a shebang with the second version but not the first.

What?

I'll use a real world example from a little script I wrote recently,
[`shotty`][shotty], where both of these reasons applied.

Glossing over the details of the script itself, it is a ruby script for use on
OS X. OS X comes pre-installed with ruby 2.0.0. That version is pretty old,
but it means a Ruby script is fair game for all OS X users without having to
install anything extra.

Since I can only rely on ruby 2.0.0 features, I want to force the script to
run on that at all times. The easiest way to accomplish this is to specify
`/usr/bin/ruby` in the shebang.

I decided my script would not use any gems. Executing the script with `ruby
--disable=gems` showed a significant speed increase.

Putting both ideas in place, the shebang for `shotty` looks like:

```
#!/usr/bin/ruby --disable=gems
```

The `env` version does not work:

```
#!/usr/bin/env ruby --disable=gems
```

A user on StackExchange [sums up][SE post] why it doesn't work, and some
additional pros and cons.

---

### More shebangs

**Rails runner**

This is like running `rails runner script.rb`:

```
#!/usr/bin/env /Users/priddle/work/rails/bin/rails runner
```

Why? You want to run `./script.rb` instead of `rails runner script.rb`. I've
never used this because I don't like the hard-coded path to `rails` in the
shebang. But it's there :smile:

**AppleScript**

Most AppleScript is shared as compiled files. OS X includes `osascript` which
can be used as a shebang to run non-compiled AppleScript code. This is
probably slightly slower than using a compiled script, but I've never noticed
a difference.

```
#!/usr/bin/env osascript

...AppleScript code
```

[shebang wiki]: https://en.wikipedia.org/wiki/Shebang_(Unix)
[shotty]: https://github.com/itspriddle/shotty
[SE post]: http://unix.stackexchange.com/a/29620
