---
title: "Detect in-progress git cherry-pick, merge, rebase, or revert"
date: "Thu Jun 01 20:59:33 -0400 2023"
link: https://adamj.eu/tech/2023/05/29/git-detect-in-progress-operation/
category: dev
---

I came across [this post][1] on how to detect in-progress git cherry-pick,
merge, rebase, or revert.

I'm not sure when this would be useful, outside of showing a customized shell
prompt, but still good to know.

```sh
git rev-parse --verify CHERRY_PICK_HEAD
git rev-parse --verify MERGE_HEAD
git rev-parse --verify REBASE_HEAD
git rev-parse --verify REVERT_HEAD
```

[1]: {{ page.link }}
