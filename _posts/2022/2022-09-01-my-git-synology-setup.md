---
title: "My Git+Synology setup"
date: "Thu Sep 1 01:16:48 -0400 2022"
category: dev
tags: [git, synology]
---

I upgraded my NAS and setup git on it again. I went a little custom this time
around, so I'm documenting it here if I ever need to do it again.

The easy stuff:

- Enabled user homes
- Create a `vcs` user
- Installed the Git package
- Open Git Server, give `vcs` access to it

Then in a terminal:

```
sudo mkdir -m 0700 /var/services/homes/vcs/.ssh
sudo sh -c "echo 'ssh key' > /var/services/homes/vcs/.ssh/authorized_keys"
sudo chown -R vcs:users /var/services/homes/vcs/.ssh
sudo chmod 600 /var/services/homes/vcs/.ssh/authorized_keys
```

Create a test repo:

```
sudo git init --bare -b master /var/services/homes/vcs/test-repo.git
sudo chown -R vcs:users /var/services/homes/vcs/test-repo.git
```

Test the clone from your local machine:

```
git clone vcs@synology.local:test-repo.git
```

I threw together a quick 'n dirty script to do all this, `create-git-repo`:

```bash
#!/usr/bin/env bash

set -eu

REPO_ROOT=/var/services/homes/vcs
REPO_UNIX_OWNER=vcs
REPO_UNIX_GROUP=users

main() {
  local name="${1:-}"

  if [[ -z "$name" ]]; then
    echo "Must specify repo name" >&2
    return 1
  fi

  name="${name%%.git}.git"

  if [[ -r "$REPO_ROOT/$name" ]]; then
    echo "Repo '$name' already exists!" >&2
    return 1
  fi

  sudo git init --bare -b master "$REPO_ROOT/$name"
  sudo chown -R "$REPO_UNIX_OWNER:$REPO_UNIX_GROUP" "$REPO_ROOT/$name"
}

main "$@"
```

From the NAS, I can run `./create-git-repo new-repo-name`, or pass a subpath
with `./create-git-repo itspriddle/awesome-project`.
