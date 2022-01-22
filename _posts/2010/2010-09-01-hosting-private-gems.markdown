---
date: Wed Sep 01 01:39:09 -0400 2010
title: "Hosting Private Gems"
---

I've written a few gems for work that I can't host on RubyGems. It turned
out to be easier to host these than I thought.

Here are the steps I took to make `gems.mysite.com` host gems that
can be installed with `gem install [gem] --source http://gems.mysite.com/`

### Setup (Remote)

    mkdir -p /home/gems

### Setup (Local)

    git clone git://github.com/itspriddle/private-gem-host.git gems.mysite.com
    cd gems.mysite.com
    curl -O http://gist.github.com/raw/587310/3564b29f31a22a8a0544c1f81565d398cb926b2f/post-update > .git/hooks/post-update
    chmod +x .git/hooks/post-update
    git remote add production user@mysite.com:/home/gems/.git
    scp -r .git user@mysite.com:/home/gems/

### Setup (Remote, Again)

    cd /home/gems/
    git config receive.denyCurrentBranch ignore

### Apache vhost Configuration

    # /etc/apache2/site-enabled/gems.mysite.com
    <VirtualHost *:80>
      ServerName gems.mysite.com

      DocumentRoot /home/gems/public/

      <Directory /home/gems/public>
        Options Indexes MultiViews FollowSymLinks
        AllowOverride None
        Order Deny,Allow
        Deny from all
        # Only these IPs can reach this site
        Allow from 123.1.1.
      </Directory>
    </VirtualHost>


### Add some gems (Local)

    cp ~/gems/my-secret-library-1.0.0.gem public/gems
    git add public/gems/my-secret-library-1.0.0.gem
    git commit -m "Added My Secret Library 1.0.0"
    git push production master


### Install gems

    gem install my-secret-library --source http://gems.mysite.com/


### How does it work?

The script in `bin/update_gems` is called by the `post-receive` hook you setup.
Each time you push to production, this script will run and then update
the meta files needed (check `/home/gems/public/YAML` on your remote box
for an example). You should see the output when you push. Note the `Allow`
directive in the Apache configuration: you need to add IPs that can
access your gem host.

---

`post-update` script from above:

```sh
#!/bin/sh
#
# This hook does two things:
#
#  1. update the "info" files that allow the list of references to be
#     queries over dumb transports such as http
#
#  2. if this repository looks like it is a non-bare repository, and
#     the checked-out branch is pushed to, then update the working copy.
#     This makes "push" function somewhat similarly to darcs and bzr.
#
# To enable this hook, make this file executable by "chmod +x post-update".

git-update-server-info

is_bare=$(git-config --get --bool core.bare)

if [ -z "$is_bare" ]
then
	# for compatibility's sake, guess
	git_dir_full=$(cd $GIT_DIR; pwd)
	case $git_dir_full in */.git) is_bare=false;; *) is_bare=true;; esac
fi

update_wc() {
	ref=$1
	echo "Push to checked out branch $ref" >&2
	if [ ! -f $GIT_DIR/logs/HEAD ]
	then
		echo "E:push to non-bare repository requires a HEAD reflog" >&2
		exit 1
	fi
	if (cd $GIT_WORK_TREE; git-diff-files -q --exit-code >/dev/null)
	then
		wc_dirty=0
	else
		echo "W:unstaged changes found in working copy" >&2
		wc_dirty=1
		desc="working copy"
	fi
	if git diff-index --cached HEAD@{1} >/dev/null
	then
		index_dirty=0
	else
		echo "W:uncommitted, staged changes found" >&2
		index_dirty=1
		if [ -n "$desc" ]
		then
			desc="$desc and index"
		else
			desc="index"
		fi
	fi
	if [ "$wc_dirty" -ne 0 -o "$index_dirty" -ne 0 ]
	then
		new=$(git rev-parse HEAD)
		echo "W:stashing dirty $desc - see git-stash(1)" >&2
		( trap 'echo trapped $$; git symbolic-ref HEAD "'"$ref"'"' 2 3 13 15 ERR EXIT
		git-update-ref --no-deref HEAD HEAD@{1}
		cd $GIT_WORK_TREE
		git stash save "dirty $desc before update to $new";
		git-symbolic-ref HEAD "$ref"
		)
	fi

	# eye candy - show the WC updates :)
	echo "Updating working copy" >&2
	(cd $GIT_WORK_TREE
	git-diff-index -R --name-status HEAD >&2
	git-reset --hard HEAD)
}

if [ "$is_bare" = "false" ]
then
	active_branch=`git-symbolic-ref HEAD`
	export GIT_DIR=$(cd $GIT_DIR; pwd)
	GIT_WORK_TREE=${GIT_WORK_TREE-..}
	for ref
	do
		if [ "$ref" = "$active_branch" ]
		then
			update_wc $ref
		fi
	done
fi

/home/gems/bin/update_gems
```
