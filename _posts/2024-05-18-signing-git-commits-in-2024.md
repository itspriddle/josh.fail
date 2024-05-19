---
title: "Signing Git commits in 2024"
date: "Sat May 18 22:23:32 -0400 2024"
category: dev
---

Following [this post][1], I've set up SSH key signing for my Git commits.

I created a new key and asked to use `~/.ssh/id_ed25519_git` as the filename:

```sh
ssh-keygen -t ed25519 -C "git signing" -f ~/.ssh/id_ed25519_git
```

On my Macs, I told SSH to use the MacOS keychain to store the key:

```sh
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_git
```

I added the public key to my GitHub account.

Next, to configure Git. I don't want this on every machine. I have this in
`~/.gitconfig` to load in a separate `~/.gitconfig.local` file for
machine-specific settings:

```gitconfig
[include]
	path = ~/.gitconfig.local
```

Then in `~/.gitconfig.local`:

```gitconfig
[user]
	signingkey = ~/.ssh/id_ed25519_git.pub

[gpg]
	format = ssh

[gpg "ssh"]
	allowedSignersFile = ~/.ssh/allowed_signers

[commit]
	gpgsign = true

[tag]
	gpgsign = true
```

Git also needs to know which keys are allowed to sign commits.

```sh
cp ~/.ssh/id_ed25519_git.pub ~/.ssh/allowed_signers
```

Finally, to test:

```
mkdir test-repo
cd test-repo
git init
git commit --allow-empty -m "Test commit"
git verify-commit HEAD
```

[1]: https://dev.to/ccoveille/how-to-get-the-verified-badge-on-github-with-ssh-key-signing-3kbe
