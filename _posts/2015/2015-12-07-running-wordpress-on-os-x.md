---
title: "Running WordPress on OS X"
date: "Sat Dec 07 00:50:47 -0500 2015"
---

I've been working with WordPress a lot more lately, and I wanted a way to run
it on OS X with as few dependencies as possible. Thanks to [WP-CLI][] and
[PHP's built in web server][] this is now easier than ever before.

[WP-CLI]: http://wp-cli.org/
[PHP's built in web server]: http://php.net/manual/en/features.commandline.webserver.php

## MySQL

MySQL is required and not installed on OS X. I used [MariaDB][], but [MySQL][]
works too. Installation via [Homebrew][] is a snap:

```
brew install mariadb
```

MariaDB ships with a setting `NO_AUTO_CREATE_USER` that prevents you from
creating a user without a password. I don't like bothering with passwords for
development, so I disabled that feature by adding the following to
`~/.my.cnf`:

> Note: This could be a security risk if you are on a shared machine or you
> allow outside traffic through your router/firewall. Understand the risks
> involved before changing this.

```
[mysqld]
sql_mode="NO_ENGINE_SUBSTITUTION"
```

By default MariaDB sets two `sql_mode` settings, `NO_ENGINE_SUBSTITUTION` and
`NO_AUTO_CREATE_USER`. This sets it to use just `NO_ENGINE_SUBSTITUTION`.

With MySQL configured, start the server:

```
mysql.server start
```

[Homebrew]: http://brew.sh/
[MariaDB]: https://mariadb.org/
[MySQL]: https://www.mysql.com/

## PHP

OS X El Capitan ships with PHP 5.5.29. This is sufficient to run WordPress,
but we need to configure PHP to use Homebrew's MySQL. Create or edit
`/etc/php.ini` to configure PHP to use MySQL:

```
sudo cp -n /etc/php.ini.default /etc/php.ini
sudo sed -i '.bak' 's,default_socket[[:space:]]*=$,default_socket = /tmp/mysql.sock,' /etc/php.ini
```

To verify the setting is correct:

```
php -r "echo ini_get('mysql.default_socket');"
```

You should see `/tmp/mysql.sock`.

There may be some other settings to tweak to improve performance, but so far
this seems to work well for my testing purposes.

## WP-CLI

WP-CLI is a great utility that allows you to manage WordPress from the command
line.

There is a [WP-CLI Homebrew Formula][WP-CLI Homebrew Formula], but it includes a
dependency on Composer that I don't need. Installing it is just a matter of
downloading a file and adding it to `PATH`:

```
curl -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x /usr/local/bin/wp
wp --info
```

If you see output like `WP-CLI version:version0.21.1`, the installation was
successful.

[WP-CLI Homebrew Formula]: http://github.com/homebrew/homebrew-php/blob/master/Formula/wp-cli.rb

## WordPress Setup

First download the latest WordPress:

```
mkdir -p wordpress/public
cd wordpress/public
wp core download
```

Next, create `wp-cli.yml` with some settings for WP-CLI (replace usernames,
etc as needed):

```
cd wordpress
cat <<YAML > wp-cli.yml
path: "public"

server:
  docroot: public
  port: 9000

core config:
  dbname: wpplayground
  dbuser: root
  dbhost: localhost
  extra-php: |
    define('WP_HOME',    'http://localhost:9000');
    define('WP_SITEURL', 'http://localhost:9000');

core install:
  admin_user: josh
  admin_password: passw0rd
  admin_email: jpriddle@me.com
  url: http://localhost:9000
  title: "WordPress Playground"
YAML
```

Next, generate `wp-config.php` using the settings added to `wp-cli.yml`:

```
wp core config
```

Create the database:

```
wp db create
```

Finally, install WordPress:

```
wp core install
```

## Using WordPress

WP-CLI includes support for PHP's built in web server, and this will be used
to serve WordPress. To start it:

```
wp server
```

And then open <http://localhost:9000/> in your browser. When done working with
WordPress, just press ctrl-c to kill the web server.

I hope this helps someone else. WP-CLI and PHP's built in web server make this
a much less obtrusive setup than it has been in the past.
