---
title: Password Protect Directory (Manually)
category: dev
redirect_from:
- /blog/2007/password-protect-directory-manually.html
- /dev/2007/password-protect-directory-manually.html
tags: [apache, htaccess, password, security]
---

Password protection with Apache is really a piece of cake.

First you'll need to create a password file. It's best practice to place this
outside of your web root so people can't access it. I keep all of mine in
`/home/user/`.

You can call the password file whatever you want, the most common is simply
`.htpasswd`. The file is a simple database of usernames and password hashes.
Each user has its own line; the user `user` with password `pass` might[^1]
have the following entry:

```
user:PxaVD5/NdyKOw
```

The easiest way to encrypt `pass`, is to visit
<http://home.flash.net/cgi-bin/pw.pl>. Just enter the username and password,
and it'll create the exact line you should insert into your password file.
(Optionally, you could use the `htpasswd` command if you have shell access and
your web host has enabled it.)

OK - so you have the password file (`/home/user/.htpasswd`). Now you must
create a file called `.htaccess` in the directory you want to protect (in the
example we'll use `/home/user/www/secretstuff`).

Add these lines:

```
AuthUserFile /home/user/.htpasswd
AuthName "Secret Stuff"
AuthType Basic
<Limit GET>
require valid-user
</Limit>
```

Save it, and then browse to `yoursite.com/secretstuff`, and you should be
prompted for a username and password.

Easy?

[^1]: Note: The hash will NOT always be the same - meaning if you encrypt the
      same string twice, you could get two entirely different hashes. This
      does not, however, affect Apache in any way.

[1]: http://home.flash.net/cgi-bin/pw.pl
