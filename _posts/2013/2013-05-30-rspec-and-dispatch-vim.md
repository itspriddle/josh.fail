---
date: "Thu May 30 00:37:44 -0400 2013"
title: "RSpec and vim-dispatch"
---

A couple months ago I wrote about how to [Run RSpec in Vim][]. Shortly
afterward, [tpope][] released [vim-dispatch][] which does a better job of
solving that problem.

Now, I simply run `:Dispatch[!] rspec [ARGS]`. Errors open in a Quickfix
window, and you can jump directly to the failing spec.

If I am working on a particularly tricky example group, I use `:Focus`. For
example, to focus on a `context` starting on line 25 of the current file:
`:Focus rspec %:25`. Now, I can run `:Dispatch` without arguments to run just
that example group.

I've really enjoyed how vim-dispatch has changed my workflow.

[Run RSpec in Vim]: {% post_url 2013/2013-02-08-running-rspec-in-vim %}
[tpope]: http://tpo.pe
[vim-dispatch]: https://github.com/tpope/vim-dispatch
