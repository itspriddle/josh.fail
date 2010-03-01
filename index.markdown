---
layout: default
title: main
---
{% for page in site.posts %}
{% assign body = page.content %}
{% include post.html %}
{% endfor %}
