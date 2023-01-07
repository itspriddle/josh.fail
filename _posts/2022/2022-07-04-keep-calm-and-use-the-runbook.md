---
title: "Keep calm and use the runbook"
date: "Mon Jul 04 11:26:46 -0400 2022"
link: https://www.cortex.io/post/keep-calm-and-use-the-runbook
category: links
---

> Runbooks are important because **they make knowledge easily actionable for
> someone without domain expertise.** This ensures, for example, that the
> engineer who created the service doesn't need to be the first line of
> defense in the event of an outage. Instead, if they create a runbook, anyone
> else can pick it up and take the right steps to fix the problem.

Some [awesome advice][1] in this article. Same goes for alerts:

- Make them focused and concise
- Make them actionable
- Make them so anyone on your team can use them

As usual, the [Hacker News comments][2] have a few really interesting looking
articles mentioned as well:

- This one on [SRE for high traffic gambling sides][3]. tl;dr process can be
  good if you take your time and make sure you're getting value from it
- This one about [do nothing scripts][4] to ease into automation. I actually
  thought this would be about writing stubs/shims that would _eventually_ be
  completed. The author uses these as a sort of guide program that tells you
  the steps you need to run and then waits. I could see this being an
  interesting approach for some tasks like app setup... but then I'm probably
  going to try to automate them anyway. Interesting all the same.

[1]: {{ page.link }}
[2]: https://news.ycombinator.com/item?id=31973859
[3]: https://zwischenzugs.com/2017/04/04/things-i-learned-managing-site-reliability-for-some-of-the-worlds-busiest-gambling-sites/
[4]: https://blog.danslimmon.com/2019/07/15/do-nothing-scripting-the-key-to-gradual-automation/
