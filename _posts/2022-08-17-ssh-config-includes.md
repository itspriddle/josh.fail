---
title: "`~/.ssh/config` includes"
date: "Wed Aug 17 11:20:09 -0400 2022"
category: dev
---

Last night I discovered the `Include` directive in `~/.ssh/config` that I have
wanted all my life.

I'm using it as follows...

In `~/.ssh/config`:

```
Include config.d/*
```

Then various sub-files, like `~/.ssh/config.d/10-home` for my home network:

```
Host *.local
	AddressFamily inet
  User priddle
```

And `~/.ssh/config.d/20-work` for work:

```
Host *.work.com
  User jpriddle
  Port 1234
```

And `~/.ssh/config.d/99-star` for everything else:

```
Host *
	TCPKeepAlive yes
	ServerAliveInterval 300
	ServerAliveCountMax 6
	AddKeysToAgent yes
	IgnoreUnknown UseKeychain
	UseKeychain yes
	ForwardAgent no
	IdentityFile ~/.ssh/id_rsa
```

Why? So I can keep some of this configuration on [GitHub][1] while keeping
some stuff private.

[1]: https://github.com/itspriddle/dotfiles/tree/2dc3e5094918c0f69a5776ac4aa494dbea6dd0e7/ssh
