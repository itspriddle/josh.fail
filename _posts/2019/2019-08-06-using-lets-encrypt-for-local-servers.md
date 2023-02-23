---
title: "Using Let's Encrypt for local servers"
date: "Tue Aug 06 02:42:12 -0400 2019"
category: dev
redirect_from:
- /blog/2019/using-lets-encrypt-for-local-servers.html
- /dev/2019/using-lets-encrypt-for-local-servers.html
tags: [ssl, nginx, certbot, letsencrypt, digitalocean]
---

I run a few web services on my local network. I trust my network, but I've
often wanted to use SSL with these services. Using DigitalOcean as a DNS
provider and Let's Encrypt, I finally have this in place. Here's how I set
things up.

### Digital Ocean Setup

I'll assume you already have DigitalOcean setup and hosting DNS for your
domain. You just need to create an API token with read/write access (click the
API link on <https://cloud.digitalocean.com>). Save this token somewhere safe
--- DigitalOcean does not allow you to view it again.

### Certbot Installation

```
sudo apt-get install certbot python-certbot-nginx python3-pip
```

Note the version of `certbot` that is installed. At the time of this writing,
I got version `0.31.0` on Ubuntu Bionic and Raspbian Buster.

Next install the DigitalOcean plugin for `certbot`. Adjust `0.31.0` to match
the `certbot` version if necessary:

```
sudo pip3 install certbot-dns-digitalocean==0.31.0
```

Save the DigitalOcean API token to your system. Replace `TOKEN` with the
actual API token. Protect the directory and file from anyone who isn't `root`:

```
sudo mkdir /etc/letsencrypt
sudo mkdir -m 0700 /etc/letsencrypt/_credentials
sudo sh -c 'echo "dns_digital_ocean_token = TOKEN" > /etc/letsencrypt/_credentials/digitalocean.ini'
sudo chmod 600 /etc/letsencrypt/_credentials/digitalocean.ini
```

Now we're ready to go:

```
sudo certbot certonly \
  --dns-digitalocean \
  --dns-digitalocean-credentials /etc/letsencrypt/_credentials/digitalocean.ini \
  -d example1.priddle.xyz
```

Test that the renewal works okay:

```
sudo certbot renew --dry-run
```

### Nginx Config

I use Nginx on all of my servers.

Let's Encrypt should generate an Nginx configuration file at
`/etc/letsencrypt/options-ssl-nginx.conf`. If it doesn't:

```
sudo vim /etc/letsencrypt/options-ssl-nginx.conf
```

And add the following:

```
# This file contains important security parameters. If you modify this file
# manually, Certbot will be unable to automatically provide future security
# updates. Instead, Certbot will print and log an error message with a path to
# the up-to-date file that you will need to refer to when manually updating
# this file.

ssl_session_cache shared:le_nginx_SSL:1m;
ssl_session_timeout 1440m;

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;

ssl_ciphers "ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS";
```

The vhosts proxy to web servers running on different ports. For example,
instead of accessing `10.0.1.10:8080` I can have Nginx proxy
`example1.priddle.xyz` to it.

The vhost configuration at `/etc/nginx/sites-available/example1.priddle.xyz`:

```
# HTTP config (always redirects to HTTPS)
server {
  listen 80;

  server_name example1.priddle.xyz;

  return 301 https://$server_name$request_uri;
}

# HTTPS config
server {
  listen 443 ssl;

  server_name example1.priddle.xyz;

  # SSL configuration
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_certificate /etc/letsencrypt/live/example1.priddle.xyz/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/example1.priddle.xyz/privkey.pem; # managed by Certbot

  # Example config, replace as needed
  location / {
    proxy_pass http://127.0.0.1:8080/;
  }
}
```

Keep in mind that Let's Encrypt allows wildcard certificates when you use
DNS challenges. This can be done with:

```
sudo certbot certonly \
  --dns-digitalocean \
  --dns-digitalocean-credentials /etc/letsencrypt/_credentials/digitalocean.ini \
  -d \*.priddle.xyz
```

### Local DNS Configuration

At this point there is a certificate generate and installed, but you can't yet
access this in your browser. There are a few ways you can handle this.

**Configure DNS in DigitalOcean**

You can add A records directly to DigitalOcean and just point them to your
local IPs. For example, `example1.priddle.xyz => 10.0.1.10`. I tried this, but
my router filters out any DNS records like this 😭

**Configure in `/etc/hosts`**

If you're on a Mac or Linux system you can use `/etc/hosts`.

```
sudo vim /etc/hosts
```

And add a line like:

```
10.0.1.10	example1.priddle.xyz
```

**Use your PiHole**

I had a PiHole running on my network, so I configured it to serve these
domains.

```
sudo vim /etc/dnsmasq.d/99-custom-domains.conf
```

Add records like the following:

```
address=/example1.priddle.xyz/10.0.1.10
```

You need to restart PiHole's DNS server after making changes:

```
pihole restartdns
```

**Use dnsmasq**

You can use a standard dnsmasq installation just like with PiHole.

---

### Example Nginx Configs

A few example Nginx configs I'm using with this setup:

**Deluge**

```
upstream deluge {
  server 127.0.0.1:8112;
}

server {
  listen 80;

  server_name deluge.priddle.xyz;

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;

  server_name deluge.priddle.xyz;

  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_certificate /etc/letsencrypt/live/deluge.priddle.xyz/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/deluge.priddle.xyz/privkey.pem; # managed by Certbot

  location / {
    proxy_connect_timeout   59s;
    proxy_send_timeout      600;
    proxy_read_timeout      36000s;  ## Timeout after 10 hours
    proxy_buffer_size       64k;
    proxy_buffers           16 32k;
    proxy_pass_header       Set-Cookie;
    proxy_hide_header       Vary;

    proxy_busy_buffers_size         64k;
    proxy_temp_file_write_size      64k;

    proxy_set_header        Accept-Encoding         '';
    proxy_ignore_headers    Cache-Control           Expires;
    proxy_set_header        Referer                 $http_referer;
    proxy_set_header        Host                    $host;
    proxy_set_header        Cookie                  $http_cookie;
    proxy_set_header        X-Real-IP               $remote_addr;
    proxy_set_header        X-Forwarded-Host        $host;
    proxy_set_header        X-Forwarded-Server      $host;
    proxy_set_header        X-Forwarded-For         $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Port        '443';
    proxy_set_header        X-Forwarded-Ssl         on;
    proxy_set_header        X-Forwarded-Proto       https;
    proxy_set_header        Authorization           '';

    proxy_buffering         off;
    proxy_redirect          off;
    proxy_pass http://deluge/;
    add_header X-Frame-Options SAMEORIGIN;
  }
}
```

**Plex**

```
upstream plex {
  server 127.0.0.1:32400;
  keepalive 32;
}

server {
  listen 80;

  server_name plex.priddle.xyz;

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;

  server_name plex.priddle.xyz;

  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_certificate /etc/letsencrypt/live/priddle.xyz/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/priddle.xyz/privkey.pem; # managed by Certbot

  location / {
    # Plex has A LOT of javascript, xml and html. This helps a lot, but if it causes playback issues with devices turn it off. (Haven't encountered any yet)
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml application/xml text/javascript application/x-javascript image/svg+xml;
    gzip_disable "MSIE [1-6]\.";

    # Nginx default client_max_body_size is 1MB, which breaks Camera Upload feature from the phones.
    # Increasing the limit fixes the issue. Anyhow, if 4K videos are expected to be uploaded, the size might need to be increased even more
    client_max_body_size 100M;

    # Forward real ip and host to Plex
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;

    # When using ngx_http_realip_module change $proxy_add_x_forwarded_for to '$http_x_forwarded_for,$realip_remote_addr'
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Sec-WebSocket-Extensions $http_sec_websocket_extensions;
    proxy_set_header Sec-WebSocket-Key $http_sec_websocket_key;
    proxy_set_header Sec-WebSocket-Version $http_sec_websocket_version;

    # Websockets
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";

    # Buffering off send to the client as soon as the data is received from Plex.
    proxy_redirect off;
    proxy_buffering off;
    proxy_pass http://plex;
  }
}
```

**Tautulli (Plex Stats)**

```
upstream tautulli {
  server 127.0.0.1:8181;
}

server {
  listen 80;

  server_name tautulli.priddle.xyz;

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;

  server_name tautulli.priddle.xyz;

  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_certificate /etc/letsencrypt/live/priddle.xyz/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/priddle.xyz/privkey.pem; # managed by Certbot

  location / {
    proxy_pass http://tautulli;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $server_name;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 90;
  }
}
```

**Basic HTML**

```
server {
  listen 80;

  server_name web.priddle.xyz;

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;

  server_name web.priddle.xyz;

  root /var/www/html;
  index index.html;

  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_certificate /etc/letsencrypt/live/priddle.xyz/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/priddle.xyz/privkey.pem; # managed by Certbot

  location / {
    try_files $uri $uri/ =404;
  }
}
```

**Jekyll**

```
server {
  listen 80;

  server_name web.priddle.xyz;

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;

  server_name jekyll.priddle.xyz;

  root /var/www/jekyll-site/_site;
  index index.html;

  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_certificate /etc/letsencrypt/live/priddle.xyz/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/priddle.xyz/privkey.pem; # managed by Certbot

  location / {
    try_files $uri $uri/ =404;
  }
}
```

OR

```
upstream jekyll {
  server 127.0.0.1:3000;
}

server {
  listen 80;

  server_name jekyll.priddle.xyz;

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;

  server_name jekyll.priddle.xyz;

  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_certificate /etc/letsencrypt/live/priddle.xyz/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/priddle.xyz/privkey.pem; # managed by Certbot

  location / {
    proxy_pass http://jekyll;
  }
}
```
