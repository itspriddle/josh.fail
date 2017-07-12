---
layout: default
title: "Using Nginx as an SSL proxy to GitHub Pages"
date: "Wed Jul 12 01:37:50 -0400 2017"
---

I love GitHub Pages, but the one feature they're missing is SSL support for
custom domains. I came up with the idea of using Nginx to proxy and found I
[was][Nginx Proxy for GitHub Pages] [not][SSL for GitHub Pages] [alone][NGINX
Reverse proxy settings to Github pages]. I was finally able to get SSL working
on my GitHub Pages site --- and it took me longer to blog about it than set it
up.


A neat "feature" of GitHub Pages is that it uses the `Host` HTTP header to
determine the repo to serve using a request to your own Pages domain. For
example, I have <https://github.com/itspriddle/josh.fail>. I can request the
GitHub Pages site there with `curl -H "Host: josh.fail"
https://itspriddle.github.io`. Unlike a normal request to Pages site under a
custom domain, this one is encrypted since `*.github.io` supports SSL.

Nginx has a great feature called `proxy_pass`, that basically proxies any
request to another URL, and you can adjust headers (and more) along the way.
This allows me to forward requests from `https://josh.fail` on my box to the
Pages install at GitHub in a fairly simple way.

On port 80, requests to `/.well-known/acme-challenge/*` attempt to serve Let's
Encrypt challenge files --- these are used to verify you own your domain
during SSL certificate requests and renewals. Any other request on port 80 is
redirected to use SSL.

```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;

  server_name josh.fail;

  location /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
  }

  location / {
    return 301 https://$server_name$request_uri;
  }
}
```

On port 443, all requests use `proxy_pass` and are forwarded to my own GitHub
Pages site with the `Host: josh.fail` header set. Since GitHub already
aggressively caches, I skip that here. (I _did_ attempt to use `proxy_cache`
and friends, but couldn't get it to work).

```nginx
server {
  listen 443 ssl http2 default_server;
  listen [::]:443 ssl http2 default_server;

  server_name josh.fail;

  include snippets/ssl-params.conf;
  include snippets/ssl-josh.fail.conf;

  location / {
    proxy_pass              https://itspriddle.github.io;
    proxy_intercept_errors  on;

    proxy_redirect          default;
    proxy_buffering         off;
    proxy_set_header        Host                 $host;
    proxy_set_header        X-Real-IP            $remote_addr;
    proxy_set_header        X-Forwarded-For      $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Protocol $scheme;

    # allow GitHub to pass caching headers instead of using our own
    expires off;
  }
}
```

On a cheap Digital Ocean $5/mo VPS using Let's Encrypt, I'm seeing under 100ms
load times. Not bad for a Saturday night hack!

---

I've searched for a solution to this issue for a while. A common one I've seen
is to [use CloudFlare][Secure and fast GitHub Pages with CloudFlare]. The
standard setup involves caching content from the non-SSL version of a site,
which sort of defeats the entire purpose of SSL in my opinion.

But after discovering the `Host` header trick, I think CloudFlare could be a
good option. I may explore using that in the future since it is free.

[Nginx Proxy for GitHub Pages]: https://mtik00.com/2015/08/nginx-proxy-for-github-pages/
[SSL for GitHub Pages]: https://pascal.io/github-pages-https/
[NGINX Reverse proxy settings to Github pages]: https://gist.github.com/taddev/8872330
[Secure and fast GitHub Pages with CloudFlare]: https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/
