---
layout: default
title: "Splitting git repos with git filter-branch"
date: "Tue Apr 03 01:42:27 -0400 2012"
---

While working on a project managed with Git, I needed to split some files into
a new repository.  In order to maintain the git history on these files, I used
`git filter-branch`.  Here are two methods I used.

First, create a copy of the original repo. `git filter-branch` is destructive
and will rewrite your repos history!

    git clone original-project/.git new-project
    cd new-project


In one case, the files I wanted to keep were all isolated to a subdirectory in
the original repo (eg: lib/keep_us). In this case, one can use the 
`--subdirectory-filter` option of `git filter-branch:

    git filter-branch --subdirectory-filter lib/keep_us


Once this command is complete, `new-project` will contain only the files from
`lib/keep_us` (git history only includes these files as well) in the project
root. That is, any files previously in `lib/keep_us` would be in the git root.

For another repo, I needed to split files across different directories. This
is a bit more complicated. In order to do this, you need to get a list of
all files you want to keep. Then, you must traverse each commit and remove any
files that are not in this list.

I used the following ruby script to do this:

```ruby
Dir.chdir "new-project"

all_files_ever = `git log --pretty=format: --name-only --diff-filter=A | sort -`.
                 chomp.split("\n").reject {|line| line.chomp == ""}
keepers = %W(
  app/models/foo.rb
  spec/models/foo_spec.rb
  lib/tasks/foo.rake
)

delete_us = all_files_ever - keepers

`git filter-branch --prune-empty --index-filter "git rm -f --cached --ignore-unmatch #{delete_us.join(' ')}" HEAD`
```

After running this script, you'll be left with only the files specified as
"keepers". Unlike the `--subdirectory-filter` option, these files are left in
their original location. That is, `app/models/foo.rb` is still
`app/models/foo.rb` after the rewrite.

Hope it helps someone else!
