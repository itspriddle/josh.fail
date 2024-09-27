---
title: "Let's Encrypt and Emby"
date: "Fri Sep 13 15:14:54 -0400 2024"
category: dev
---

I finally got around to setting up SSL with Let's Encrypt on my Emby instance.

I use [`acme.sh`][acme.sh] for managing my Let's Encrypt certificates. It's a
simple shell script that Just Works™. I use DigitalOcean for my DNS on my main
network domain, `priddle.network`. `acme.sh` supports DigitalOcean DNS out of
the box.

[acme.sh]: https://github.com/acmesh-official/acme.sh

Emby's SSL setup is a little different than a traditional web server like
Nginx. Namely, you use a `.pfx` file instead of a `.crt` and `.key` pair. I
suppose this isn't _that_ uncommon, since again, `acme.sh` supports it out of
the box.

A lot of setups recommend using Nginx as a reverse proxy to you regular Emby
host---which would be `http://emby.priddle.network:8096` in my case. I tried
this with Plex a while back and it was a pain. You have to setup a lot of
different things to make websockets work correctly.

Emby (and Plex, which I've obviously moved away from) has a built-in SSL
support. You can just point it to your `.pfx` file and it works. Infuse and my
other clients work perfectly.

Since I'll have the certs, I can also setup `http://emby.priddle.network` and
`https://emby.priddle.network` (without ports) to redirect to the Emby server
running on SSL. We'll get back to that in a bit.

First, install `acme.sh`. They recommend running it as root, so I'll do that.

```
sudo -i
curl https://get.acme.sh | sh -s email=ssl@example.com
```

I like getting notifications when my certs renew. I use Slack for this. For
simplicity, I just used a webhook URL. `acme.sh` also supports this out of the
box.

```
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/xxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx"
acme.sh --set-notify --notify-hook slack
```

We need a directory to store the certs that Emby and Nginx will use. Create it
with:

```
sudo mkdir -p /usr/local/etc/ssl/emby.priddle.network/
```

We'll need a script to generate the `.pfx` file from the Let's Encrypt certs.
It'll also need to restart Emby and Nginx. Save it as `/root/reload-emby.sh`:

```sh
#!/usr/bin/env bash
set -e

/root/.acme.sh/acme.sh \
  --to-pkcs12 \
  --password 'real-password' 
  --domain emby.priddle.network

cp /root/.acme.sh/emby.priddle.network_ecc/emby.priddle.network.pfx \
  /usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.pfx

chmod 644 /usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.pfx

systemctl restart emby-server.service
nginx -s reload
```

Don't run this script yet. It'll be run automatically by `acme.sh` when we get the certs.

Make sure to replace `real-password` with a real password. This is the
password that Emby will use to decrypt the `.pfx` file. You also need to
`chmod +x /root/reload-emby.sh` so `acme.sh` can run it.


Next, let's enable SSL on Emby. Go to
<http://emby.local:8096/web/index.html#!/network> and make sure to enable
"Allow remote connections to this Emby Server." Enter your domain name (i.e
`emby.priddle.network`) in "External
domain" and set the "Custom ssl certificate path" to
`/usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.pfx`. Enter the
certificate password (i.e. "real-password"). Save these settings, but
don't restart Emby. We'll do that when we get the certs.

Let's hop over to Nginx and set that up. For me, I'm only using Nginx on my
Ember server to redirect to the real Emby URLs, so I just replaced everything
in `/etc/nginx/sites-enabled/default` with:

```nginx
server {
  listen 80;

  server_name _;

  return 301 https://$host:8920$request_uri;
}

server {
  listen 443 ssl;

  server_name _;

  ssl_certificate         /usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.cert.pem;
  ssl_certificate_key     /usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.key.pem;
  ssl_trusted_certificate /usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.fullchain.pem;

  return 301 https://$host:8920$request_uri;
}
```

I also dropped this in `/etc/nginx/nginx.conf` in the `http { ... }` block:

```nginx
http {
  # ^ other stuff that was already there

  # Disable server tokens (i.e. Nginx) in response headers
  server_tokens off;

  # SSL session settings
  ssl_session_timeout    1d;
  ssl_session_cache      shared:SSL:10m;
  ssl_session_tickets    off;
  
  # Diffie-Hellman parameter for DHE ciphersuites
  ssl_dhparam            /etc/nginx/dhparam.pem;
  
  # Mozilla Intermediate configuration
  ssl_protocols          TLSv1.2 TLSv1.3;
  ssl_ciphers            ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
  
  # OCSP Stapling
  ssl_stapling           on;
  ssl_stapling_verify    on;
  resolver               1.1.1.1 1.0.0.1 8.8.8.8 8.8.4.4 208.67.222.222 208.67.220.220 valid=60s;
  resolver_timeout       2s;
}
```

On my system, I had to create `/etc/nginx/dhparam.pem` with:

```
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

Test the Nginx config with:

```
sudo nginx -t
```

Now we're ready to create the certs. See
<https://github.com/acmesh-official/acme.sh/wiki/dnsapi> for info on different
DNS providers. I'm using DigitalOcean, so I'll set the `DO_API_KEY`
environment variable to my DigitalOcean API key.

```
export DO_API_KEY="key"
```

Next, issue the certs:

```
acme.sh --issue --dns dns_dgon -d emby.priddle.network
```

Install the certs:

```
acme.sh --install-cert -d emby.priddle.network \
  --cert-file /usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.cert.pem \
  --key-file /usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.key.pem \
  --fullchain-file /usr/local/etc/ssl/emby.priddle.network/emby.priddle.network.fullchain.pem \
  --reloadcmd '/root/reload-emby-ssl.sh'
```

If everything worked, you should see the certs in
`/usr/local/etc/ssl/emby.priddle.network/`. The `reloadcmd` will have run
`/root/reload-emby.sh` after the certs were generated. Emby should have
restarted and Nginx should have reloaded.

To test run the following `curl` commands:

```
curl -vs https://emby.priddle.network 2>&1 | grep Location
curl -vs http://emby.priddle.network 2>&1 | grep Location
curl -vs https://emby.priddle.network:8920 2>&1 | grep 'private-network-access-name'
```

And you should see something like:

```
< Location: https://emby.priddle.network:8920/
< Location: https://emby.priddle.network:8920/
< private-network-access-name: Media Server
```

Give it a try in your web browser to make sure everything worked.

Finally, you can test everything fully with:

```
acme.sh --cron --force
```
