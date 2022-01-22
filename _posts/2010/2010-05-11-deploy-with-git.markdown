---
date: Tue May 11 23:39:10 -0400 2010
title: Deploy with git
---

I found this git hook that lets you deploy a project with a git push rather
than having to use a full deployment library such as [Capistrano](http://capify.org).
I use this on a bunch of PHP projects that don't need all the features Capistrano
provides.

On the remote server, we're going to assume you're keeping your project in
`/var/www/example.com` from a repository called `example.com`

    mkdir /var/www/example.com
    cd /var/www/example.com
    git init
    git config receive.denyCurrentBranch ignore
    cd .git/hooks
    curl -O http://gist.github.com/raw/398175/b15c71189eb3883986f19f24df6b8b4c7cf2d003/post-update
    chmod +x post-update

On your local development machine:

    cd /path/to/example.com
    git remote add production user@myserver.com:/var/www/example.com/.git
    git push production master

Any time you need to update in the future, just use `git push production [branch]`
and it'll be updated on your remote server.

---

`post-update` script:

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
```
