build: sass jekyll

sass:
	./bin/sass --no-cache --update _sass:stylesheets

jekyll:
	./bin/jekyll --no-auto --no-server
