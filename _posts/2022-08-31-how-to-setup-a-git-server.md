---
title: "How to setup a git server"
date: "Wed Aug 31 00:37:58 -0400 2022"
category: dev
---

Here's how I setup a git server with Gitweb on a Raspberry Pi.

First, let's install some packages and setup a git user. Note that I have the
repositories themselves on a USB drive at `/mnt/git-repos`

```
sudo apt-get update
sudo apt-get install git nginx fcgiwrap spawn-fcgi highlight libcgi-pm-perl
sudo adduser --shell /usr/bin/git-shell --disabled-login --home /mnt/git-repos --disabled-password git
sudo chown -R git:git /mnt/git-repos
sudo chmod 755 /mnt/git-repos
```

Next, create `~git/git-shell-commands/no-interactive-login`

```bash
#!/bin/sh
printf '%s\n' "Hi $USER! You've successfully authenticated, but I do not"
printf '%s\n' "provide interactive shell access."
exit 128
EOF
```

Nginx needs to be configured to serve Gitweb via fcgi. I'm using Let's Encrypt
here via [acme.sh](https://github.com/acmesh-official/acme.sh):

```
server {
  listen 80;

  server_name git.priddle.xyz;

  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;

  server_name git.priddle.xyz;

  #include /etc/nginx/snippets/ssl-priddle.xyz.conf;
  ssl_certificate /home/priddle/.acme.sh/git.priddle.xyz/git.priddle.xyz.cer;
  ssl_certificate_key /home/priddle/.acme.sh/git.priddle.xyz/git.priddle.xyz.key ;

  ssl_session_cache shared:le_nginx_SSL:10m;
  ssl_session_timeout 1440m;
  ssl_session_tickets off;

  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers on;

  ssl_ciphers "ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS";
  root /usr/share/gitweb;

  # send anything else to gitweb if it's not a real file
  location ~ ^.*\.git/objects/([0-9a-f]+/[0-9a-f]+|pack/pack-[0-9a-f]+.(pack|idx))$ {
    root /mnt/git-repos;
  }

  location ~ ^.*\.git/(HEAD|info/refs|objects/info/.*|git-(upload|receive)-pack)$ {
    # root /usr/share/gitweb;
    root /mnt/git-repos;

    fastcgi_pass unix:/var/run/fcgiwrap.socket;
    #fastcgi_pass unix:/lib/systemd/system/fcgiwrap.socket;
    fastcgi_param SCRIPT_FILENAME   /usr/lib/git-core/git-http-backend;
    fastcgi_param PATH_INFO         $uri;
    fastcgi_param GIT_PROJECT_ROOT  $document_root;
    fastcgi_param GIT_HTTP_EXPORT_ALL "";

    include fastcgi_params;
  }

  try_files $uri @gitweb;
  location @gitweb {
    fastcgi_pass unix:/var/run/fcgiwrap.socket;
    #fastcgi_pass unix:/lib/systemd/system/fcgiwrap.socket;
    fastcgi_param SCRIPT_FILENAME   /usr/share/gitweb/gitweb.cgi;
    fastcgi_param PATH_INFO         $uri;
    fastcgi_param GITWEB_CONFIG     /etc/gitweb.conf;
    include fastcgi_params;
  }

  # Used by me: Only allow this web page to be accessed on intranet,
  # even though nginx listens globally
  allow 127.0.0.1;
  allow 10.0.1.0/24;
  deny all;
}
```

Gitweb config at `/etc/gitweb.conf` (see also
<https://git-scm.com/docs/gitweb.conf.html>):


```
# The directories where your projects are. Must not end with a slash.
our $projectroot = "/mnt/git-repos";

# Base URLs for links displayed in the web interface.
our @git_base_url_list = qw(https://git.priddle.xyz);

# enable blames

# enable syntax highlighting
$feature{'highlight'}{'default'} = [1];

our $omit_owner = 1;

$feature{'snapshot'}{'default'} = [];
$projects_list_group_categories = 1;

$feature{'blame'}{'default'} = [1];
$feature{'blame'}{'override'} = 1;

$feature{'pickaxe'}{'default'} = [1];
$feature{'pickaxe'}{'override'} = 1;

# vim:ft=perl
```
