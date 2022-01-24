---
title: "Why Jekyll pwns WordPress"
category: dev
redirect_from: /blog/2012/why-jekyll-pwns-wordpress.html
---

It was just about [two years ago][1] that I converted my WordPress blog into a
Jekyll blog. Overall, I am very happy with the decision, here's why.

## My Content, My Way

I think one of the biggest advantages to using Jekyll, is that it stores
content in simple files. This means that I am free to edit using the program
of my choice. The editor in WordPress is nice if you just want to add a few
sentences and make a bold word here or there. If you are more comfortable with
something that feels like Microsoft Word the WP editor is probably great.

As a developer, and someone who loathes Word, the WP editor just never felt
right. I found myself fighting with it just to do simple things like pasting
code snippets. Ever view your HTML after copy/pasting content around in the WP
editor? It's not at all uncommon to see random empty `<div>` or `<p>` tags all
over the place.

Eventually, I found myself always using the code editor and authoring my own
paragraphs in HTML. I hated this process, and found it eventually made me stay
away from blogging.

I don't have these problems with Jekyll. My [posts][2] are
simple markdown files I compose with MacVim. I can compose a post much faster
this way than I ever could using the WordPress editor. If I decide emacs is
all the rage in 5 years, I won't have to change a thing with my blog. Why not
use the same editor I work with every day to blog with? It just makes sense.

## Git History is Priceless

Maybe it's just because I'm getting older, but I'm becoming more and more
fascinated with looking over the history of my various types of content. I
love seeing dates on photos via EXIF data, dated comments in old websites, or
timestamps (if they're accurate) on old Fireworks PNGs. I can see code or an
image and it brings me back to the time when I was creating it.

With my development work, I can look back and see how far I've grown since my
early beginnings back in 1998. I've been recovering some old posts and noticed
that my writing has improved as well. It's been interesting to see how that
has changed, as well as the topics of writing that were covered.

So how does all of this nostalgia relate to git? For me, git is a natural part
of my every day work flow. Using Jekyll and git, I can store my content _and_,
my layouts in the same place. More importantly, I have a history of my entire
website that I can go back through at any time.

I'm going to repeat that last bit again because it brings me to my next point:
_I have a history of my entire website_.

## Back babe, back in time

Having a history of my website goes much beyond simple nostalgia. I'm
constantly jumping to old projects to copy old code or see old examples. I
used to try keeping copies of different layouts for my sites. This became
pretty cumbersome as the number of sites grew, and I'm extremely sad to say
that I've lost a couple.

Again, I use Git every day to manage code revisions, so using it for my blog
is a no brainer. If I need to check for old examples, I can just poke through
the git history.

After using git, I realize that I have a big issue with not having a history
of all of my content. By nature, with Jekyll and git, **all** of my content is
store with a history. With WordPress, only posts are stored with any sort of
history (and not a very good one, at that).

If I want to truly preserve the history of layouts or posts on a WordPress
blog, I have to do it myself. That means every time I change themes, I need to
make a dated backup. At the very least, I'll need to note the date and theme I
have installed. If I wanted to capture the content stored in the database,
thats a separate backup. This is just a pain in the ass.

Consider this: I could revert my blog to it's original state 2 years ago when
I setup Jekyll with just one `git checkout` command. If I wanted to keep the
posts I've made up until today but revert everything else, it might take two
checkouts. WordPress might install for a new user in 5 minutes, but it sure as
hell doesn't restore from backups or revert history that fast.

I'm going to start tagging versions just before I change the layout. This will
make it very easy to keep multiple archive directories if I wanted to that
showed the site at different dates. Cuz you know, nostalgia is fun :)

## MySQL, It's Not You, It's Me

I really love MySQL -- it's been the only database I've used in production
since 2005. I've written web sites and PBXs that perform millions of queries
a day. As much as I love MySQL, I really think it has no place in my blog.

I think WordPress' database-driven approach to content storage is a drawback
here. First, you have to remember to keep database backups of your content.
If you take an old blog offline or a host crashes, you're pretty much screwed
without a database backup. Keeping backups can be taken care of by cron and
other utilities, but if you're like me, you forgot to make backups on at least
one host and have lost some content.

Assuming you do have a reliable backup, working with your posts can be fairly
difficult. You'll either need a working WordPress installation or know MySQL
in order to do anything with the data.

Jekyll removes MySQL from the equation, and I no longer worry about database
backups (or backups at all for that matter).

## Theming is Easier

I first tried WordPress in 2005 or 2006. The main thing that drew me to it was
the administration area and the plugins that were available. What I didn't
like was the lack of themes, or more specifically, my lack of theming
knowledge.

Not knowing enough PHP to handle a WordPress theme limited me to whatever
prepackaged themes were available. This always felt **wrong** to me. I never
liked having a layout someone else had too. Today I know how to make a
WordPress theme, and I still hate the process. I never liked not being able
create layouts my way.

Jekyll allows me to do themes using the HTML and CSS I know and love. Where
thats not enough, Liquid (Jekyll's template engine) covers the gap. Moreover,
it forces me to code my own themes rather than relying on something else
hundreds of other people are using.

## Static is Fast and Secure

Static HTML is as fast as you can get with HTTP (aside from just sending
headers, text, or something else silly). The content is read in from a static
file and sent as a string of HTML (more or less) to a user's browser.

A stock WordPress installation is considerably slower in comparison. WordPress
is powered by MySQL and PHP. Any page load requires a number of MySQL queries
and some work by PHP to render the HTML to be sent to a user's browser. The
load on either PHP or MySQL can vary drastically depending on themes or
plugins that may be installed.

WP plugins such as WPCache attempt to resolve this issue, and by all rights,
probably do -- if you know enough to install them and take the time to
actually do so.

Static HTML is secure too. The only way you're hacking a Jekyll blog is if you
have the password to the server it's hosted and you edit the files. WordPress
plugins are notorious for introducing security holes that give attackers to
entire blogs or servers _without_ having a server password.

For me, these are unnecessary trade-offs. I don't need a database. I don't
need a full scripting language. I like HTML and it just makes sense to serve
that to begin with.

## Fewer Distractions

I couldn't imagine the time I've wasted searching for WordPress themes or
plugins that I ended up not using. Updating these or installing new ones was a
huge distraction for me that took away from time that could have been better
spent blogging. I finally decided to switch to Jekyll when I realized what
little value these things were really providing me.

## It's More Fun

Since I've switched to Jekyll, blogging is just more fun. Blogging with
WordPress always felt like doing mopping a dirt floor.

Oh, did I mention no more WP directory permission or htaccess issues?

[1]: {% post_url 2010/2010-02-28-oh-hai-jekyll %}
[2]: {{ site.github.repository_url }}/tree/{{ site.github.source.branch }}/_posts
