---
date: "Tue Feb 05 19:57:11 -0500 2013"
title: "Fun With Jekyll Posts and Vim Macros"
category: dev
redirect_from:
- /blog/2013/fun-with-jekyll-posts-and-vim-macros.html
- /dev/2013/fun-with-jekyll-posts-and-vim-macros.html
tags: [vim, jekyll, macros]
---

Yesterday, I decided I wanted to edit a bunch of Jekyll posts. Specifically,
I wanted to move the `title` field in each post's YAML front matter to the
bottom. Instead of having to manually edit a few hundred files, I finally
remembered to use Vim macros.

In Vim, a macro is a recording of a number of commands. Once you've _recorded_
a macro, you can replay it any number of times. So the idea for this task was
to record a macro that could I could replay, that would locate the title line
and move it to the bottom of the post's YAML front matter.

To illustrate how this works, let's take a look at this post's YAML front
matter:

```
---
title: "Fun With Jekyll Posts and Vim Macros"
date: "Tue Feb 05 19:57:11 -0500 2013"
---

...
```

To rearrange these lines as desired, you can use these commands in Vim:

```
gg
/title<cr>
dd
/---<cr>
P
```

* `gg`: Move to line 1
* `/^title:<cr>`: Move to the first line starting with "title:"
* `dd`: Delete that line to the default register
* `/^---<cr>`: Move to the next line starting with "\-\-\-"
* `P`: Paste the contents of the default register above the current line

This gives you the proper sorting, but the process needs to be repeated in each
file:

```
---
date: "Tue Feb 05 19:57:11 -0500 2013"
title: "Fun With Jekyll Posts and Vim Macros"
---

...
```

To use this as a macro, you just need to record it with `q`. Expanding on the
commands above:

```
qq
gg
/title<cr>
dd
/---<cr>
P
:w
q
```

* `qq`: Start recording a new macro named "q"
* `gg`: Move to line 1
* `/^title:<cr>`: Move to the first line starting with "title:"
* `dd`: Delete that line to the default register
* `/^---<cr>`: Move to the next line starting with "\-\-\-"
* `P`: Paste the contents of the default register above the current line
* `:w`: Write the file
* `q`: End recording

You now have a macro that can be played back with `@q`. This is much quicker,
but you still need to edit each file and manually press `@q`. To handle this
for multiple files you can use `:args` and `:argdo`.

```
:args _posts/*.markdown
:argdo normal @q
```

* `:args _posts/*.markdown`: Set the files to target
* `:argdo normal @q`: Run `normal @q` for each file. This is the same manually
running `@q` in the file.

After you're done, all the files will be updated. Huzzah, macros!
