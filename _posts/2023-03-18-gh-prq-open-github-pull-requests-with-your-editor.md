---
title: "gh-prq - open GitHub Pull Requests with your $EDITOR"
date: "Sat Mar 18 22:17:56 -0400 2023"
category: dev
---

I threw together [gh-prq][1], a [GitHub CLI][2] extension to create Pull
Requests in your `$EDITOR`.

This was one of the few features from [hub][3] that I was still using. `gh`
doesn't yet have a way to compose a Pull Request with your `$EDITOR`, so I
copied the ideas from hub and created `gh prq`.

Install it with:

```sh
gh extension install itspriddle/gh-prq
```

Use it:

```sh
cd project
$EDITOR                              # make some changes
git commit -am 'Add my cool changes' # and commit them
gh prq --push                        # open $EDITOR to create a PR
```

I setup a git alias, so `git prq` will push my branch upstream, copy the newly
created PR URL to my clipboard, and open it in a web browser:

```sh
git config --add alias.prq '!gh prq --push --copy --open'
```

As an aside, I've been using GitHub Copilot lately and it helped with a few
things in this script---namely the open browser and copy to clipboard
functions. I'd say Copilot gets it right about 60% of the time. It does blow
my mind every session or two when it magically prints something I wasn't quite
thinking about.

[1]: https://github.com/itspriddle/gh-prq
[2]: https://cli.github.com
[3]: https://github.com/github/hub
