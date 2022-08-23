---
title: "Signing git commits with SSH keys"
date: "Tue Aug 23 15:23:57 -0400 2022"
category: dev
---

GitHub [announced today][1] that they have added support for signing commits
and tags with SSH keys. Here's how I set it up on my Mac.

First I created a new SSH key for this purpose:

```
ssh-keygen -t ed25519 -C "gitsigning@priddle.xyz"
```

Next, git needs to be configured to use it:

```
git config --global user.signingkey "$(cat ~/.ssh/id_ed25519_gitsigning.pub)"
git config --global gpg.format ssh
```

ssh-agent needs to be informed of the key. On Mac:

```
ssh-add --allow-use-keychain ~/.ssh/id_ed25519_gitsigning
```

On Linux:

```
ssh-add -K ~/.ssh/id_ed25519_gitsigning
```

Finally, to sign a commit:

```
git commit -S ...
```

Or to sign a tag:

```
git tag -s ...
```

And if you want to always sign (yes, this works for SSH in spite of the GPG
name):

```
git config --global commit.gpgSign true
```

I attempted this a [while back][2] with GPG but it was a pain. Hopefully this
works better 🤞

[1]: https://github.blog/changelog/2022-08-23-ssh-commit-verification-now-supported/
[2]: {% post_url 2019/2019-02-05-signed-commits-with-gitx %}
