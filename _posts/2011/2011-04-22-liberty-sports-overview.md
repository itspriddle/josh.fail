---
title: Theming Liberty Sports Group with WordPress
category: dev
redirect_from:
- /blog/2011/liberty-sports-overview.html
- /dev/2011/liberty-sports-overview.html
---

I was contracted recently by [Allusis Productions](http://allusis.net) to
create a backend for the soon-to-be-released Liberty Sports Group site. After
going over the client's requirements, I decided WordPress would be the best
fit for the site. Here is an overview of my experience setting up and theming
WordPress 3.1.

At first, I thought the process of customizing (eg: hacking) WordPress to work
with a client site would be awful. I'd done it previously (probably
incorrectly), with an early release of WordPress 2.x. The site works well
enough, but because I've hacked it, upgrading WordPress would be extremely
time consuming.

With that in mind, I gave myself a rule: any hacks must go into a plugin.
Which meant that I had to learn how to create a plugin.


## Plug it in, plug it in

When I read up on
[WordPress plugin development](http://codex.wordpress.org/Writing_a_Plugin) I
was pleasantly surprised to see a great deal of documentation. It seems that
the WordPress documentation, as a whole, has gotten better by leaps and bounds
since I've used it (which was about 4 or 5 years ago).

Additionally, I learned a great deal on plugin architecture, WordPress hooks,
etc. from examining other plugins. If you need to write a plugin of your own,
pick apart one that is similar.

I ended up writing two plugins; one is just a collection of small admin hacks,
and the other is an affiliate banner manager. The admin plugin does stuff like
change the admin footer text. The affiliate banner manager allows a user to
upload an image and URL, which is then rotated on the front of the site.

I won't go into the all of the plugins I've installed, but I will advise you
to be weary of what you install. There are thousands of plugins available,
many are great, but many are full of bugs or security vulnerabilities.


## Setup

The setup I went with may be a little unusual to some WordPress developers,
unless you've worked with [Ruby On Rails](http://rubyonrails.org/) and
[Capistrano](https://github.com/capistrano/capistrano) before.

Of course, the entire site is managed with [Git](http://git-scm.com/). The
root structure looks like this:

      Capfile
      config/
        deploy/
          staging.rb
          production.rb
        deploy.rb
        wp-config-development.php
        wp-config-production.php
        wp-config-staging.php
      public/
        ...Wordpress files here

I've setup capistrano stages for production and staging. This allows us to
test changes on a different server than production.

I've chosen to keep our `wp-config.php` files out of the repository.
Developers can create their own to develop locally without affecting the
staging or production sites. When we deploy, capistrano symlinks the
appropriate config file.

The workflow for us now is basically:

* Make edits locally
* Commit and push changes to staging: `git commit && git push origin staging`
* Deploy to staging: `cap staging deploy`
* Verify changes
* Merge staging into master: `git checkout master && git merge staging`
* Push to production: `git push origin master`
* Deploy to production: `cap production deploy`
* Rinse and repeat

The benefits of using capistrano are awesome. If something goes wrong, you can
rollback in seconds, rather than trying to edit PHP files on the fly.


## Theming

The process of actually theming the site was also easier than I had imagined.
The included TwentyTen theme is an excellent resource for seeing how things
are done, and the WordPress Codex is getting better all the time.

The majority of my work theming the site involved taking example HTML pages
which were provided to me, and placing them into the appropriate sections of
the template.

The theme uses WordPress pages throughout, and custom page templates to render
unique content (eg: the contact page, or registration forms). Other areas pull
posts from custom categories (eg: recent news, featured photos).


## The Finish Line

All in all, we got the site finished up for the first round of revisions
pretty quickly. WordPress is a great content management system, and is
becoming more extendible with each release. I'd recommend it for any site
with blog-like content.

