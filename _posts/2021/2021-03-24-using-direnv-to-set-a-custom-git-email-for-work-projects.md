---
title: "Using direnv to set a custom git email for work projects"
date: "Wed Mar 24 00:03:56 -0400 2021"
---

I like to specify a different git author email for personal projects and work
projects. This can be done per-repo with `git config user.name` and `git
config user.email`, but it can be easy to forget as you clone repos. Here is
how I used [direnv][] to accomplish this automatically.

direnv loads shell environment variables based on `.envrc` files. Git's author
email can be set with `GIT_COMMITTER_EMAIL` and `GIT_AUTHOR_EMAIL`. This means
that we can use direnv to set these variables for specific folders.

I keep my work projects under a single directory (`~/work/a2` at the time of
this writing). The simplest way to setup the necessary variables is to add the
following to `~/work/a2/.envrc`:

```sh
export GIT_AUTHOR_EMAIL=me@work.com
export GIT_COMMITTER_EMAIL=me@work.com
```

If you need more custom settings, you could also add a custom function to
`~/.direnvrc` that can then be used in `.envrc` files:

```sh
set_git_author() {
  local email="$1" name="$2"

  if [[ -z "$email" ]] || [[ -z "$name" ]]; then
    >&2 echo "Couldn't set git author!"
    return 1
  fi

  export GIT_COMMITTER_NAME="$name"
  export GIT_COMMITTER_EMAIL="$email"
  export GIT_AUTHOR_NAME="$name"
  export GIT_AUTHOR_EMAIL="$email"
}
```

With the custom function approach, your `.envrc` file would look like:

```sh
set_git_author me@work.com "Not Josh"
```

Once you have edited `.envrc`, you must allow it to be executed by direnv by
running `direnv allow`, in my case:

```
direnv allow ~/work/a2/.envrc
```
Now, any time I `cd ~/work/a2`, the custom email I've specified is set when I
use `git commit`. direnv will search parent directories for `.envrc` files, so
this works in any subdirectory (eg: `~/work/a2/cool-project`). In any other
directory, git will use the default `user.email` I have configured in
`~/.gitconfig`.

[direnv]: https://direnv.net
