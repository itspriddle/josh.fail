---
title:   MWP Lazy Upgrader
company: Pressed, LLC
period:  Dec 2016 - Jul 2018
date:    2016-12-19
tags:
  - automation
  - bash
  - managed wordpress
  - php
  - wordpress
  - wordpress plugin
  - wp-cli
project_type: work
---

MWP Lazy Upgrader is a custom WordPress plugin that improves performance for
theme and plugin upgrades on a network filesystem. On network filesystems,
these operations are slow and can timeout for users in WP Admin. Lazy Upgrader
works around these limitations by deferring filesystem writes to a background
job and using symbolic links to install themes and plugins instantly once
source files are available over the network.
