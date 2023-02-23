---
date: Mon Mar 01 13:06:16 -0500 2010
title: Forcing SSL with Apache
category: dev
redirect_from:
- /blog/2010/forcing-ssl-with-apache.html
- /dev/2010/forcing-ssl-with-apache.html
tags: [apache, ssl, https, htaccess]
---

For my own reference really, here are the steps I took to setup an Apache vhost
to redirect all non-SSL requests to https:

```
<VirtualHost *:80>
        ServerName example.com
        KeepAlive Off

        RewriteEngine On
        RewriteRule ^/(.*)$ https://example.com/$1 [R=301,L]
</VirtualHost>
<VirtualHost *:443>
        ServerName example.com
        DocumentRoot /var/www/html

        <Directory /var/www/html>
                Options Indexes MultiViews FollowSymLinks
                AllowOverride None
        </Directory>

        SSLEngine on
        SSLOptions +FakeBasicAuth +ExportCertData +StrictRequire
        SSLCertificateFile    /etc/ssl/certs/example.com.crt
        SSLCertificateKeyFile /etc/ssl/private/example.com.key
        BrowserMatch ".*MSIE.*" \
                nokeepalive ssl-unclean-shutdown \
                downgrade-1.0 force-response-1.0
</VirtualHost>
```

[gist]: https://gist.github.com/itspriddle/318614
