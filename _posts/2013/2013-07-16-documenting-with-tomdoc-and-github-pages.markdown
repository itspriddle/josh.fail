---
date: "Tue Jul 16 14:05:35 -0400 2013"
title: "Documenting with TomDoc and GitHub Pages"
link: http://www.eng5.com/documenting-with-tomdoc-and-github-pages/
---

I wrote a blog post over at [Eng5](http://eng5.com) outlining how we use
TomDoc and GitHub pages for documentation at Site5. Check it out!

---

Here at Eng5 we love documentation. In the past, we've used [RDoc][] and
[YARD][] --- two different Ruby tools that scan for comments in your code and
generate browsable HTML content for publishing online. The content they
generate is great, but writing and reading the documentation in code is awful.

That's why we started converting all of our projects to [TomDoc][]. TomDoc is
much easier to write than RDoc. It can be used to document any language. Most
importantly, TomDoc is more readable in code.

We used [rdoc.info][] to host our documentation. When we were using RDoc, it
was a great way to quickly publish docs to a central location. Unfortunately,
it doesn't support TomDoc, so we haven't been using it lately.

We already use [GitHub][Site5 GitHub] to host our code, so I thought it made
sense for us to use [GitHub Pages][] to host our documentation as well. Here's
a quick overview of how we set it up.

First, we needed to enable GitHub Pages for our organization, so we created a
repo named `site5.github.io`. This serves as our "root" GitHub page. Any
static files on this repo's master branch can be served over GitHub Pages.

With the initial setup complete, our individual repos are now able to use
GitHub Pages as well. Any project with a `gh-pages` branch will have GitHub
Pages available. For example, our project [Squall][] has GitHub Pages at
<https://site5.github.io/squall/>.

In order to generate HTML from TomDoc, we have created a small Rubygem,
[rake-tomdoc][]. It is basically a wrapper around [yard-tomdoc][] that adds a
`rake tomdoc` task, which handles generating the HTML to push to GitHub Pages.
Now, when we are ready to publish new documentation, it's as simple as `bundle
exec rake tomdoc; git commit -a -m "Updating documentation"; git push origin
gh-pages`. Within a few minutes the changes are available online.

We'll be migrating the rest of our projects to use this setup, so keep an eye
on [github.com/site5][Site5 GitHub] for updates!

---

**EDIT, Feb 28, 2017:** This post has been copied from the old Eng5 blog here
for posterity --- I left the Eng5 team in July 2015, and the rest of the team
disbanded the following August after its acquisition.

[RDoc]: http://rdoc.sourceforge.net/
[YARD]: http://yardoc.org/
[TomDoc]: http://tomdoc.org/
[rdoc.info]: http://rdoc.info/
[Site5 GitHub]: https://github.com/site5?tab=repositories
[GitHub Pages]: http://pages.github.com/
[Squall]: https://github.com/site5/squall
[rake-tomdoc]: https://github.com/site5/rake-tomdoc
[yard-tomdoc]: https://github.com/rubyworks/yard-tomdoc
