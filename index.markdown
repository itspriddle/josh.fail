---
layout: default
title: main
---
{% for page in paginator.posts %}
1
{% assign body = page.content %}
{% include post.html %}
{% endfor %}

<div>PAGE ({{ paginator.posts }})/{{ paginator.total_pages }}
  {% unless paginator.page == 1 %}<a href="/page{{ paginator.previous_page }}.html">Previous</a>{% endunless %}
  {% unless paginator.page == paginator.total_pages %}<a href="/page{{ paginator.next_page }}.html">Next</a>{% endunless %}
</div>
