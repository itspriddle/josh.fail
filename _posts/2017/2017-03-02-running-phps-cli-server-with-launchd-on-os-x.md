---
title: "Running PHP's CLI Server with launchd on OS X"
date: "Thu Mar 02 00:00:10 -0500 2017"
category: dev
redirect_from: /blog/2017/running-phps-cli-server-with-launchd-on-os-x.html
---

Here's how I configured [launchd][] to run WordPress via [PHP's Built-in web
server][] on OS X.

Why? I primarily use Ruby and already have a (non-PHP) web server setup on
port 80. Instead of installing Apache or Nginx when I periodically need a
WordPress site running, `php -S` can be used. But it's a pain to remember to
turn on.

I hacked together this [launchd.plist][] file to keep the server running:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>KeepAlive</key>
  <true/>
  <key>Label</key>
  <string>net.nevercraft.wordpress-playground</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PHP_INI_SCAN_DIR</key>
    <string>/Users/priddle/.dotfiles/src/php</string>
    <key>SERVER_NAME</key>
    <string>localhost</string>
  </dict>
  <key>ProgramArguments</key>
  <array>
    <string>php</string>
    <string>-S</string>
    <string>localhost:9000</string>
    <string>-t</string>
    <string>/Users/priddle/work/wordpress-playground/public</string>
    <string>-c</string>
    <string>/etc/php.ini</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>WorkingDirectory</key>
  <string>/Users/priddle/work/wordpress-playground/public</string>
  <key>StandardErrorPath</key>
  <string>/Users/priddle/Library/Logs/wordpress-playground.log</string>
  <key>StandardOutPath</key>
  <string>/Users/priddle/Library/Logs/wordpress-playground.log</string>
</dict>
</plist>
```

### Notes

```
<key>PHP_INI_SCAN_DIR</key>
<string>/Users/priddle/.dotfiles/src/php</string>
```

These lines specify the directory to a a custom `php.ini` file. If you have
one, replace `/Users/priddle/.dotfiles/src/php` with the _directory_ it is in;
eg: for `/Users/priddle/.dotfiles/src/php/php.ini`, specify
`/Users/priddle/.dotfiles/src/php`. If you do not have a custom `php.ini`,
delete these lines.

```
<string>localhost:9000</string>
```

This line specifies the hostname and port. You can change them if you want and
know what you are doing. I'd suggest just leaving `localhost`, and change the
port if you already have something running on `9000` or you want a different
number.

```
<string>/Users/priddle/work/wordpress-playground/public</string>
```

This line specifies the path to your WordPress install. You **must** change
this, unless your login name happens to be `priddle` and your blog happens to
be at `~/work/wordpress-playground/public`. Note that it must be replaced
**twice**, once below `<string>-t</string>` and again below
`<key>WorkingDirectory</key>`.

```
<key>StandardErrorPath</key>
<string>/Users/priddle/Library/Logs/wordpress-playground.log</string>
<key>StandardOutPath</key>
<string>/Users/priddle/Library/Logs/wordpress-playground.log</string>
```

These lines specify the log path for STDOUT and STDERR. Any output from a
standard `php -S localhost:9000 -t <dir>` is written to this file. In
addition, if you enable `WP_DEBUG`, anything logged with `error_log()` will be
written here as well.

Save your edited file to
`~/Library/net.nevercraft.wordpress-playground.plist`.

To enable:

```
launchctl load ~/Library/net.nevercraft.wordpress-playground.plist
```

To disable:

```
launchctl unload ~/Library/net.nevercraft.wordpress-playground.plist
```

To view the logs:

```
tail -f ~/Library/Logs/wordpress-playground.log
```

To totally uninstall:

```
launchctl unload ~/Library/net.nevercraft.wordpress-playground.plist
rm -f ~/Library/net.nevercraft.wordpress-playground.plist
```

[PHP's Built-in web server]: http://php.net/manual/en/features.commandline.webserver.php
[launchd.plist]: https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man5/launchd.plist.5.html#//apple_ref/doc/man/5/launchd.plist
[launchd]: https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man8/launchd.8.html
