---
title: "Sharing git repos between two system users"
date: "Wed Jul 26 15:06:30 -0400 2023"
category: dev
---

I needed a way for two developers to access a git repository on a Linux
machine. Each developer has their own dedicated system user and logins require
2FA. Here's how I got this going.

Our environments at work require 2FA for our user accounts. This means that a
simple approach of allowing each user to SSH to each other won't work since
they can't access each other's phones.

Each user does belong to the same group (i.e. `webdevs`). This means if we can
ensure that files and directories in the repository all have `g+rw`
permissions at least, they can both access them.

Searching for a solution I came across [`git config
core.sharedRepository`][1] which seems like it was designed exactly for this
use case. In short, you can run `git config core.sharedRepository MODE` to
tell git to set file permissions on all new files created during git pull.

It didn't seem to impact newly created files. So, [special group bit][2] to
the rescue. On Linux machines, we can assign this with something like `chmod
g+s path`.

Finally, we need a way to assign `g+rw` permissions on the repo clone itself.

With the background out of the way, here's what I did:

First, we set a temporary umask (my default is 0022) that creates files with
group writable permissions:

```sh
umask 0002
```

Then clone the repository using the `core.sharedRepository` setting mentioned
above:

```sh
git clone -c core.sharedRepository=0664 git@github.com:foo/bar.git /var/www/example.com
```

**Before you forget, remember to set your umask back.** If you don't know what
it is, just exit SSH and sign in again. If you forget, any files you create in
your SSH session are probably going to have unexpected permissions.

Assign the group special bit to the repository root directory:

```sh
chmod g+s /var/www/example.com
```

Fix ownership of the repository:

```sh
sudo chgrp -R webdevs /var/www/example.com
```

Each developer then needs to allow git to access our clone which has
non-standard permissions:

```sh
git config --global --add safe.directory /var/www/example.com
```

Now, each developer can test it by trying to create files and pushing/pulling
from GitHub.

```sh
cd /var/www/example.com
git checkout -b "test-$USER"
echo test > "test-$USER"
git add "test-$USER"
git commit -m "Testing from $USER"
git push -u origin "test-$USER"
```

As files get pushed and pulled the owner will change up a bit but the group
will remain the same. Since we've set the group read/write special bit on the
repository root, both devs can write to all files. Git will ensure files get
664 permissions by default. And lastly, Git doesn't store user or group
permissions, only _execute_ permissions, and `config.sharedRepository` is
smart enough to not clobber your executable files with 664 permissions.

[1]: https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresharedRepository
[2]: https://www.redhat.com/sysadmin/suid-sgid-sticky-bit
