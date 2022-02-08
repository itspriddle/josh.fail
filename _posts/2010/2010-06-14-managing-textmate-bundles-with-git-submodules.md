---
date: "Mon Jun 14 16:54:10 -0400 2010"
title: Managing TextMate bundles with git submodules
category: dev
redirect_from:
- /blog/2010/managing-textmate-bundles-with-git-submodules.html
- /dev/2010/managing-textmate-bundles-with-git-submodules.html
---

I've been using [TextMate](http://macromates.com/) nearly every day for 2
years. Over that time I've customized it exactly to my liking with a bunch of
extra bundles, plugins, and theme tweaks. I've tried a few different things
to try to manage my `~/Library/Application Support/TextMate` directory.

I got bored one day and decided I'd try managing them with
[git submodules](http://www.kernel.org/pub/software/scm/git/docs/git-submodule.html).
It was more of an exercise in learning the `git submodule` command, but it
turns out it's also a great way to maintain my TextMate config.

Read up on submodules yourself, but the important thing to note here is that
a submodule acts as a git "symlink" to a specific commit on a repo. Instead
of keeping the entire `Bundles` directory (and subfiles) in your repo, a
`.gitmodules` file keeps track of the clone url and the local file path.
Take a look at my [Bundles directory](http://github.com/itspriddle/textmate-config/tree/master/Bundles/)
on GitHub for a visual representation of what I'm talking about.

If you don't care about the specifics, just check out my
[TextMate Config](http://github.com/itspriddle/textmate-config). If you do...
keep reading.

The steps boil down to this

1. Create repo in `~/Library/Application Support/TextMate`
2. Add submodules in `~/Library/Application Support/TextMate/Bundles`
3. Initialize submodules
4. Maintain submodules


**Create repo**

This is best done from a blank support directory, so backup
`~/Library/Application Support/TextMate` and then empty it. Then run
`cd ~/Library/Application Support/TextMate && git init` to create the
repository. Create your bundles directory with `mkdir Bundles`.


**Add submodules**

Add submodules using `git submodule add [repo url] [file path]`. Using
the repo you created before, you might add Dr. Nic's
[Ruby On Rails](http://github.com/drnic/ruby-on-rails-tmbundle) bundle with
the following command:

    git submodule add git://github.com/drnic/ruby-on-rails-tmbundle.git "Bundles/Ruby on Rails.tmbundle"

This command, tells git to add a submodule for Dr. Nic's repo on GitHub to
`Bundles/Ruby on Rails.tmbundle`. Repeat this process for any other bundles
you have.


**Initialize submodules**

You probably jumped ahead already and noticed that your `Bundles/` directory
is essentially empty. In order to actually download submodules, you need to
initialize them with `git submodule init`, then update them with
`git submodule update`. You'll see git download each submodule and print
the sha1 hash of the commit it used.  Reload TextMate, and you're ready to rock.


**Maintain submodules**

It's likely you're going to need to update your bundles at some point - either
a new version is released, or you've decided you no longer need a bundle.

To add a new submodule you'd simply run `git submodule add` again, as before.

Updating submodules is slightly different, and admittedly, a little cumbersome.
Let's say Dr. Nic updated the Rails bundle. Here are the steps I'd take to
pull those changes:

    cd Bundles/Ruby\ on\ Rails.tmbundle
    git pull origin master
    cd ../..
    git add Bundles/Ruby\ on\ Rails.tmbundle
    git commit -m "Updating Ruby on Rails bundle"

Deleting submodules is a bit of a pain, and requires Google every time I need
to do it. First, you need to manually edit both `.gitmodules` and `.git/config`,
and remove the offending submodule. The not-so-obvious step, is removing
the module from git itself. Do do this, you'd run
`git rm --cached Bundles/Bundle to delete.tmbundle`. Commit those 3
changes and you've successfully removed the bundle from your repo.


**Notes on committing**

When you run `git submodule add`, git will automatically update and stage your
`.gitmodules` file for you. To commit the bundle too, run
`git add Bundles/MY Bundle.tmbundle`. Again, this is committing a pointer
to the submodule, not the entire bundle's contents.

**Sharing/Installation on a new Mac**

If you need to help a friend clone your setup, or install TextMate on a new
Mac, you'll be very happy you took the time to do this. Just run (replacing
your repo URL):

    git clone git://github.com/itspriddle/textmate-config.git ~/Library/Application\ Support/TextMate
    cd ~/Library/Application\ Support/TextMate
    git submodule init
    git submodule update

Boom - good to hack.

I'll also note that this same method can easily be applied for [vim configs](http://github.com/itspriddle/vim-config).
