---
layout: nil
---
var Site = {
	posts: []
};

Site.posts = [
	{% for post in site.posts %}{
		url: '{{ post.url }}',
		title: '{{ post.title }}',
		date: '{{ post.date }}'
	},{% endfor %}
];
