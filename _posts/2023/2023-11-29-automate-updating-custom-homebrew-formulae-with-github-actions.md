---
title: "Automate updating custom Homebrew formulae with GitHub Actions"
date: "Wed Nov 29 00:53:01 -0500 2023"
category: dev
---

I have a few projects I use custom Homebrew taps with. I never remember to
update the formulae versions when I update the projects. So, I finally decided
to automate the process with GitHub Actions.

First, a quick detour on [Homebrew taps][1]. These additional repositories of
formulae you can install with Homebrew. You _must_ name them with a
`homebrew-` prefix. In the root of the repository, you need a `Formula/`
directory. This directory contains one or more `.rb` files that specify how
Homebrew should install a piece of software.

Homebrew taps are useful if you want a way for other macOS users to quickly
install your software without having to download your main project repo or
`curl` a bunch of files. Since they are under your control, you don't need to
submit pull requests to the main `Homebrew/homebrew-core` project. Personally,
I use them because none of my projects are all that popular.

With that out of the way, I'll recap how I recently automated this for my
[`slack-notify`][2] project.

### Homebrew Tap Setup

First, I created a new repository [itspriddle/homebrew-slack-notify][3]. This
will contain the formula to install `slack-notify` (via `brew install
itspriddle/slack-notify/slack-notify`). The formula lives in
`Formula/slack-notify.rb` and looks something like:

```ruby
class SlackNotify < Formula
  version "0.0.2"

  homepage "https://github.com/itspriddle/slack-notify"
  url      "https://github.com/itspriddle/slack-notify/archive/v#{version}.tar.gz"
  sha256   "2cfbed59688dbc74a1341b09f885216bf3bddd8302853cb3f4911f73373eafd4"

  head "https://github.com/itspriddle/slack-notify.git"

  def install
    bin.install "bin/slack-notify"
    man1.install "share/man/man1/slack-notify.1"
  end
end 
```

Whenever I release a new version of `slack-notify`, the version number and
SHA256 checksum for the release need to be updated in the formula.

To handle updating the formula, I created this script in
`.github/scripts/update-formula` in `homebrew-slack-notify`:

```bash
#!/usr/bin/env bash

set -e

# Require VERSION to be set, and not blank. If missing, exit with the message
# "Must specify version".
: "${VERSION:?Must specify version}"

# Calculate the SHA256 checksum for the release. We fetch it straight from
# GitHub with `curl` and pipe the output to the `shasum` command to get a
# SHA256 checksum. That command outputs two words and we just need the first,
# so fetch it with `awk`
SHASUM=$(
  curl -sL "https://github.com/itspriddle/slack-notify/archive/$VERSION.tar.gz" |
    shasum -a 256 |
    awk '{ print $1 }'
)

# This writes a new version of the Formula/slack-notify.rb file using the
# VERSION number and SHASUM we set above.
#
# `cat <<EOF` prints a string with the formula (i.e. the entire
# `SlackNotify` class definition down to the second `EOF` line). This is
# written to the slack-notify.rb file using `>` redirection.

# The `${0%/*}/../../Formula/slack-notify.rb` part finds the slack-notify.rb
# file relative to this update-formula file itself. `${0%/*}` is bash
# parameter expansion which deletes the first occurrence of `/*` (i.e.
# everything after the last slash) from the value of `$0`. Then we just use
# standard relative paths to go up 2 directories.
cat <<EOF > "${0%/*}/../../Formula/slack-notify.rb"
class SlackNotify < Formula
  version "${VERSION#v}"

  homepage "https://github.com/itspriddle/slack-notify"
  url      "https://github.com/itspriddle/slack-notify/archive/v#{version}.tar.gz"
  sha256   "$SHASUM"

  head "https://github.com/itspriddle/slack-notify.git"

  def install
    bin.install "bin/slack-notify"
    man1.install "share/man/man1/slack-notify.1"
  end
end
EOF
```

This script requires an environment variable to be set, `VERSION`, which
specifies git tag name for the release. It fetches the release and calculates
the SHA256 checksum. Then the formula file is updated with those values.

It is run like:

```bash
VERSION=v0.0.2 .github/scripts/update-formula 
```

Next, the actual GitHub Actions workflow

```yaml
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version'
        required: true
        type: string

jobs:
  update-formula:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update formula
        run: |
          mkdir -p Formula

          VERSION='{% raw %}${{ github.event.inputs.version }}{% endraw %}' ./.github/scripts/update-formula

          git config --global user.name 'Joshua Priddle'
          git config --global user.email 'jpriddle@me.com'
          git add Formula/slack-notify.rb
          git commit -m 'Updated slack-notify to {% raw %}${{ github.event.inputs.version }}{% endraw %}'
          git push origin master
```

_Note_: I had to update the repository settings on GitHub to allow actions to
write access.

This workflow gets triggered manually. Using Github CLI, I can run it like:

```sh
gh workflow run release.yml -f version=v0.0.2 -R itspriddle/homebrew-slack-notify
```

Since GitHub Actions includes GitHub CLI, the release workflow for
`slack-notify` (_not_ `homebrew-slack-notify`) can trigger it. My
[release.yml][4] workflow looks like:

```yaml
name: Upload zip on new tag

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    permissions:
      actions: write
      contents: write
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3
      - name: Get version
        id: version
        run: echo "VERSION=${GITHUB_REF##refs/tags/}" >> "$GITHUB_ENV"
      - name: Prepare zip archive
        run: VERSION={% raw %}${{ env.VERSION }}{% endraw %} make archive
      - name: Upload archive to release
        uses: softprops/action-gh-release@v1
        with:
          files: pkg/slack-notify-{% raw %}${{ env.VERSION }}{% endraw %}.zip
      - name: Update homebrew tap
        run: gh workflow run release.yml -f version=${% raw %}{{ env.VERSION }}{% endraw %} -R itspriddle/homebrew-slack-notify
        env:
          GITHUB_TOKEN: {% raw %}${{ secrets.GH_TOKEN }}{% endraw %}
```

This workflow runs any time a tag with a prefix of `v` is pushed. It creates a
zip of the release and uploads it to the GitHub release. Then it triggers the
`homebrew-slack-notify` workflow with the version number of the release.

No more forgetting to update the formulae!

[1]: https://docs.brew.sh/Taps
[2]: https:/github.com/itspriddle/slack-notify
[3]: https:/github.com/itspriddle/homebrew-slack-notify
[4]: https://github.com/itspriddle/slack-notify/blob/4026d6288f7c79c025b65e2da880116065fe67db/.github/workflows/release.yml
