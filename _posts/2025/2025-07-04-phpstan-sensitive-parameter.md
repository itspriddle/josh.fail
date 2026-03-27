---
title: "phpstan-sensitive-parameter"
date: "Fri Jul 04 20:48:11 -0400 2025"
link: https://github.com/built-fast/phpstan-sensitive-parameter
category: dev
---

I wanted a way to automatically detect parameters in PHP functions and methods
that might contain sensitive information, so I created [this][1] PHPStan
extension to help identify parameters that should be marked with the
`#[\SensitiveParameter]` attribute.

[1]: {{ page.link }}
