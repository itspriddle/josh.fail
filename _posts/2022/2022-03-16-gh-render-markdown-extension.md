---
title: "gh-render-markdown extension"
date: "Wed Mar 16 12:43:34 -0400 2022"
category: dev
tags: [github, markdown, gh-extension, script]
---

I threw together a [gh][1] extension, [gh-render-markdown][2], to quickly
render Markdown using the GitHub API.

Install it with `gh extension install itspriddle/gh-render-markdown`.

Usage:

```sh
gh render-markdown <files>
gh render-markdown < file
gh render-markdown <<< '# markdown'
echo '# markdown' | gh render-markdown
gh render-markdown
# markdown from stdin
^D
```

[1]: https://cli.github.com
[2]: https://github.com/itspriddle/gh-render-markdown
