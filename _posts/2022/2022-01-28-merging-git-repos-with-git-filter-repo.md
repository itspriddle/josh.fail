---
title: "Merging git repos with git-filter-repo"
date: "Fri Jan 28 15:43:49 -0500 2022"
category: dev
redirect_from: /dev/2022/merging-git-repos-with-git-filter-repo.html
tags: [git]
---

I needed to merge multiple git repos into a single one using subdirectories,
while preserving the history. I have used `git filter-branch` [in the past][1]
to do the _inverse_. Searching around, I found [git-filter-repo][2] which made
it a snap.

As an overview, I had the following repos, each with their own existing git
history:

- apps-foo
- apps-bar
- apps-baz

And I wanted to produce a single monorepo with (preserving the git history of
all projects):

```
apps-monorepo
├── bar
├── baz
└── foo
```

First, I created two dirs to work with:

```
mkdir apps-clones
mkdir apps-monorepo
```

Next, I cloned each repo into `app-clones`:

```
cd apps-clones
for app in apps-foo apps-bar apps-baz; do
  git clone git@github.com:org/"$app"
done
```

Now each app can have it's git history rewritten such that it was always in a
subdirectory:

```
cd apps-clones
for app in apps-foo apps-bar apps-baz; do
  (cd "$app" && git filter-repo --force --to-subdirectory "${app##apps-}"/)
done
```

Now, if I viewed the git history for `apps-foo`, I would see all files present
under a `foo/` subdirectory.

On to the monorepo. Each of the repos above need to be imported. This is done
by adding a local git origin pointing to the repo above, and merging it in.


```
cd apps-monorepo
for app in apps-foo apps-bar apps-baz; do
  git remote add "$app" ../apps-clones &&
    git fetch "$app" &&
    git merge "$app"/master --allow-unrelated-histories --no-ff -m "Add ${app##apps-}"
done
```

When this is done, the `apps-monorepo` repo has all 3 projects in
subdirectories and a full git history. The first commit and merge commits per
project are a little wonky, but it's nice to be able to merge projects and
keep their history.

[1]: {% post_url 2012/2012-04-03-splitting-git-repos-with-git-filter-branch %}
[2]: https://github.com/newren/git-filter-repo
