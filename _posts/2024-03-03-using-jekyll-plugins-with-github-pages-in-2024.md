---
title: "Using Jekyll plugins with GitHub Pages in 2024"
date: "Sun Mar 03 00:03:49 -0500 2024"
category: dev
---

I've been avoiding adding pagination to this blog forever since GitHub Pages
doesn't allow the plugin by default. Now that we can deploy to Pages with
GitHub Actions, I finally got it all working. I've done a couple hack jobs
with GitHub Actions and Jekyll, but this new workflow is pretty simple. Here's
what it looks like.

```yaml
{% raw %}name: Deploy Jekyll site to GitHub Pages

# Allow only one concurrent deployment, skipping runs queued between the run
# in-progress and latest queued. However, do NOT cancel in-progress runs as we
# want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Run this workflow on pushes to gh-pages
on:
  push:
    branches:
      - gh-pages

# Use Ruby 3.2 in all jobs
env:
  RUBY_VERSION: 3.2

jobs:
  build:
    runs-on: ubuntu-latest

    if: "!contains(github.event.head_commit.message, '[ci skip]')"

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
      - uses: Setup ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: ${{ env.RUBY_VERSION }}
          bundler-cache: true
      - name: Build site
        run: bundle exec jekyll build --destination _site --verbose --trace
        env:
          # For jekyll-github-metadata
          JEKYLL_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          JEKYLL_ENV: "production"
          PAGES_REPO_NWO: ${{ github.repository }}
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4{% endraw %}
```
