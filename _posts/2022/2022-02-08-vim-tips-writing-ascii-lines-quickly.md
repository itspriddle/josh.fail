---
title: "Vim Tips: Writing ASCII lines quickly"
date: "Tue Feb 08 15:53:47 -0500 2022"
category: dev
tags: [vim, howto]
---

I sometimes need to write an ASCII line (hr) quickly, like `----------`, here
are two ways I do it in Vim.

I sometimes will separate blocks of code with a comment like:

```
// ---------------------------------------------------------------------------
```

To do that quickly in Vim, I will press:

- `i` to enter Insert Mode
- `/`, `/`, `space` to type out <code>// </code>
- `Esc` to exit Insert Mode
- `A`, `-`, `Esc` append `-` to the end of the line, 75 times

You can also use `o` instead of `A` to use this trick with lines instead of
characters, i.e. `5o- [ ] task`, `Esc` would use `o` 5 times to write a new
line below the cursor with `- [ ] task`.

---

When I want the line to be exactly as wide as the line above/below, like with
a Markdown header or table:

```
Header
======
```

Here, when I have my cursor on the "Header" line, I press:

- `yyp` yank and paste the line below
- `j` move down to the newly pasted "Header" line
- `V` visually select the entire 2nd "Header" line
- `r` replace the entire line with...
- `=` the `=` character

I'll also use this with Markdown tables, and do something like:

```
| Num | Header 1 | Another Long Cell |
```

- `yypjVr-` copy and paste the header row, move down to it, visually select
  the new line, replace with all `-` characters
- `k` move back up to the header row
- `0` move the cursor all the way left
- `j` move back down to the first `-`
- `r|` replace with a `|` character
- `l` move right one character to the 2nd `-`
- `r<space>` replace with a single ` ` character
- `k` move back up to header row
- `f|` move to next `|` character

From here, I'll rinse and repeat until the table looks like:


```
| Num | Header 1 | Another Long Cell |
| --- | -------- | ----------------- |
```

Happy lining!
