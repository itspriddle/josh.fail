---
title: "Please Make Your Table Headings Sticky"
date: "Tue Feb 27 16:47:55 -0500 2024"
category: dev
link: https://btxx.org/posts/Please_Make_Your_Table_Headings_Sticky/
---

Someone on Hacker News posted [Please Make Your Table Headings Sticky][],
a plea for web developers to make their table headings sticky.

I've honestly never given it much thought, but I could see it being a nice UX
improvement on large tables.

Turns out it's pretty simple to implement:

```css
table {
  position: sticky;
  top: 0;
}
```

Maybe I'll remember it next time I'm working on a huge table.

[1]: {{ page.link }}
