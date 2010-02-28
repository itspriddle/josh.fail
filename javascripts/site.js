---
layout: nil
---
var foo = [{% for page in site.posts limit:5 %}
'{{ page.title }}'
{% endfor %}]
