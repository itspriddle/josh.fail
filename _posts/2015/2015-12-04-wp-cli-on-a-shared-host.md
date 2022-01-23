---
title: "wp-cli on a shared host"
date: "Fri Dec 04 18:05:05 -0500 2015"
---

Here's how I installed [wp-cli](http://wp-cli.org/) on a shared host (HostRocket).

First, download the latest version:

```
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
```

Test if it works:

```
php wp-cli.phar --info
```

You should see something like this:

```
PHP binary:binary/usr/bin/php
PHP version:version5.5.29
php.ini used:used/etc/php.ini
WP-CLI root dir:dirphar://wp-cli.phar
WP-CLI global config:config
WP-CLI project config:config
WP-CLI version:version0.21.1
```

If this works for you then move the file into `~/bin` and you are done:

```
mv wp-cli.phar ~/bin/wp
chmod +x ~/bin/wp
```

This didn't work for me though. I hit an issue with HostRocket's PHP setup and saw:

```
???p????Q??
```

It turns out this is due to PHP's `detect_unicode` setting. To test:

```
php -d detect_unicode=Off wp-cli.phar --info
```

This output the correct info.

To address this, I created a small wrapper `wp` in `~/bin/wp`:

```sh
#!/usr/bin/env bash

# We need to disable unicode detection for wp-cli to work
php -d detect_unicode=Off "$(dirname "$0")/wp-cli.phar" "$@"
```

And moved the files into place:

```
mv wp-cli.phar ~/bin/
chmod -x ~/bin/wp-cli.phar
mv wp ~/bin
chmod +x ~/bin/wp
```

Now when I run `wp` it disables `detect_unicode` and works properly.

------------------------------------------------------------------------------

**EDIT, Apr 26, 2016:** I discovered today that I embarrassingly forgot to
pass arguments in the Bash script above. I've corrected it, the missing bit
was the trailing `"$@"`.
