---
title: "Jekyll image galleries in 2022"
date: "Sun Jun 26 02:28:53 -0400 2022"
category: dev
tags: [jekyll, github-pages]
---

It's been a while since I've attempted to make an image gallery with Jekyll.
Back in the Octopress days, you had to use a separate Jekyll plugin, or
Rakefile to generate it for you. These days, first class support for
[static files][1] (`site.static_files`) makes it a breeze.

For this example, assume that images are in `gallery/` in the root of your
Jekyll/GitHub Pages project.

Add the following to your `_config.yml` to tag all files in `gallery/` with
"gallery: true". This allows you to easily filter out just the relevant files:

```yml
defaults:
  -
    scope:
      path: "gallery"
    values:
      gallery: true
```

Now in a template, fetch the gallery files and use them:

```liquid
{% raw %}{% assign images = site.static_files | where: "gallery", true %}
<ul>
  {% for img in images %}
    <li><a href="{{ img.path }}" title="{{ img.basename }}" class="img">{{ img.basename }}</a></li>
  {% endfor %}
</ul>{% endraw %}
```

If you wanted to add alt tags or descriptions, you could use a data file,
say `_data/photos.yml`:

```yml
image01.jpg:
  title: A nice taco
  description: Tacos are delicious
image02.jpg:
  title: Some Nachos
  description: Mmm cheese
```

Then in a template:

```liquid
{% raw %}{% assign images = site.static_files | where: "gallery", true %}
{% assign photos = site.data.photos %}
<ul>
  {% for img in images %}
    {% assign title = photos[img.basename].title %}
    {% assign description = photos[img.basename].description %}
    <li><a href="{{ img.path }}" title="{{ title }}" class="img">{{ title }} ({{ description }})</a></li>
  {% endfor %}
</ul>{% endraw %}
```

For my usage, I don't need individual pages per image. If you need to do that,
you're going to need to do it manually or with a script of some sort. If you
don't, this is a great way to quickly embed a list of images or files in one
of your templates.

[1]: https://jekyllrb.com/docs/static-files/
