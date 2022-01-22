---
layout: page
title: My Open Source Projects
intro: |
  I love open source software -- it lets me put food on the
  table. I give back whenever I can.

  Check out all of my projects at
  [github/itspriddle](https://github.com/itspriddle).
---

{% assign collection = site.projects_open_source | where_exp: "item", "item.hidden != true" %}
{% include project.html title=page.title intro=page.intro collection=collection %}
