---
title: "Thoughts on Laravel from a Rails veteran"
date: "Thu Aug 03 17:29:40 -0400 2023"
category: dev
---

Random thoughts on my first production project with Laravel...

Good:

- The Http client is awesome, especially for testing
- The high level concepts carry over from Rails, like MVC, routes, caching,
  queues
- Facades are awesome
- The type-hinting magic is really cool but it hasn't clicked for me yet
  exactly how (and where) it works
- Testing is a first class citizen. If you use what's built in, like the Http
  client and not Guzzle, testing is super easy.
- The whole frameworks seems designed around developer convenience. Ruby and
  Rails were all about this. We need more of it in PHP.

Bad?

- Default install doesn't feel customizable. I probably just don't know how...
    - How much bandwidth and disk space is wasted by stuff like sail being
      included for people who aren't using Docker?
- It's still very confusing to choose where to put different classes
- `.env` vs `.env.{development,production}` is confusing. I feel like I should
  be setting `APP_ENV=development` or `APP_ENV=production` with my shell and
  the webserver, but I can't find anyone recommending that.
- Vite and Mix seem so complex compared to the old Rails 3-5 asset pipeline.
- The documentation is great in some spots and very "rest of the owl" in
  others. What's the right way to make a package for Laravel? Why did I have
  to stumble on orchestra/testbench on my own?

Dunno?

- It's kind of weird how commercialized laravel.com is. It feels kind of like
  a trap for devs to toy with free plans and then need the bosses credit card
  at work. I'm sure Envoyer is great, but come on now, subscriptions to
  _deploy_?!

I definitely am enjoying Laravel, but it does make me miss using Rails a
little. I hope I get to be hands on with Laravel more in the future.
