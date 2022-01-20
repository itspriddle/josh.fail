---
layout: default
title: My Work
intro: |
  These are projects I owned or otherwise made major contributions to that
  someone was nice enough to pay me for.
---

{% assign collection = site.projects_work | where_exp: "item", "item.hidden != true" %}
{% include projects/list.html title=page.title intro=page.intro collection=collection %}
