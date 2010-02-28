---
layout: nil
---
var Site = {
	posts: []
};

{% for post in site.posts %}
Site.posts.push({
	date:  '{{ post.date }}',
	title: '{{ post.title }}',
	url:   '{{ post.url }}'
})
{% endfor %}
