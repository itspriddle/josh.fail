---
title: "Using Direnv to set PHP versions"
date: "Sat Jun 17 00:06:15 -0400 2023"
category: dev
---

I've missed having something like [chruby][2] for use with PHP. I am a huge
fan of [Direnv][2]. Since chruby is _really_ not much more than setting your
`$PATH`, I figured I could do the same for PHP with Direnv.

I primarily use macOS and Homebrew. The default `php` formula installs the
latest PHP version. I also use `shivammathur/php` taps to install older
verisons.

```sh
brew install php
brew install shivammathur/php@7.4
```

With Homebrew's setup, you really just need to set `$PATH` (and optionally
`$MANPATH` to the right locations for everything to Just Work™.

To accomplish that, I setup the following function in `~/.direnvrc`:

```bash
# Sets PATH for Homebrew core and shivammathur/php taps
#
# Usage in .envrc:
#
#   use homebrew_php
#   use homebrew_php 8.2
use_homebrew_php() {
  local version="$1"
  local optdir="${HOMEBREW_PREFIX-/opt/homebrew}/opt/php${version:+"@$version"}"

  if [[ -d "$optdir" ]]; then
    PATH_add "$optdir/bin"
    PATH_add "$optdir/sbin"
    MANPATH_add "$optdir/share/man"
  else
    >&2 echo "Unknown PHP version"
    return 1
  fi
}
```

In each PHP project where I want a custom PHP version, just add the following
to `.envrc` in the project root:

```sh
use homebrew_php 7.4
```

To enable it run (from the project root):

```sh
direnv allow
```

Check that you see the right PHP with:

```sh
which php
/opt/homebrew/opt/php@7.4/bin/php
```

You can also check that man pages work properly:

```sh
man php
```

Scroll to the bottom and make sure the version reported matches the expected
PHP version you configured.

Homebrew takes care to setup distinct versioned `php.ini` files for you. But,
if you need to set a custom one, you could also define `$PHPRC`. For example,
if you had `config/php/php.ini` in the root of your project, you could
configure it with:

```sh
export PHPRC="$PWD/config/php"
```

_Note:_ The `$PHPRC` variable should point to a _folder_, not the full path to
`php.ini`.

---

I've also used a similar approach on Linux servers. On our dev server at work,
we maintain apps with a few different PHP versions. They are installed as
`php` for the default PHP 7.4 binary, then we have `php8` and `php72`, etc.

To make this work with Direnv, I just created a separate directory tree and
symlinked each PHP binary and accompanying commands.

Besides `php`, you also have these commands in `/usr/bin` or similar:

- pear
- peardev
- pecl
- phar
- phar.phar
- php
- php-cgi
- php-config
- phpdbg
- phpize

There are commands in `/usr/sbin` (currently just the one):

- php-fpm

How you set these up will depend on your OS and package manager, but a rough
idea is:

```sh
mkdir -p /usr/local/opt/php-bins/{7.4,7.2,8.0}/{bin,sbin}

for "$bin" in pear peardev pecl phar phar.phar php php-cgi php-config phpdbg phpize; do
  ln -s /usr/bin/"$bin" /usr/local/opt/php-bins/7.2/bin/"$bin"
  ln -s /usr/bin/"$bin" /usr/local/opt/php-bins/7.4/bin/"$bin"
  ln -s /usr/bin/"$bin" /usr/local/opt/php-bins/8.0/bin/"$bin"
done

ln -s /usr/sbin/php-fpm /usr/local/opt/php-bins/7.2/sbin/php-fpm
ln -s /usr/sbin/php-fpm74 /usr/local/opt/php-bins/7.4/sbin/php-fpm
ln -s /usr/sbin/php-fpm80 /usr/local/opt/php-bins/8.0/sbin/php-fpm
```

Then, in the project root, I just add the following to `.envrc`:

```sh
PATH_add /usr/local/opt/php-bins/7.4/bin
PATH_add /usr/local/opt/php-bins/7.4/sbin
```

[1]: https://github.com/postmodern/chruby
[2]: https://github.com/direnv/direnv
