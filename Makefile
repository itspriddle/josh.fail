jekyll:
	./bin/jekyll --no-auto --no-server

deploy:
	@echo "Deploying code.nevercraft.net to heroku!"
	@echo
	@git push heroku master
