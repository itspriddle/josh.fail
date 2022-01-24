---
title: Code Folding in Vim
category: dev
redirect_from: /blog/2007/code-folding-in-vim.html
---

So I learned yet another awesome feature in vim today - code folding.

For those of you who don't know what I'm talking about, code folding lets you
shrink the contents of multiple lines of code into 1 line. A lot of the better
code editors out there do it, like Dreamweaver and ZendStudio. It's a
handy feature when you have scripts with hundreds of lines of code.

There are <a href="http://lua-users.org/lists/lua-l/2004-03/msg00233.html" title="vim Code Folding Tips">several</a>
ways you can fold a portion of code in vim. You could type `10:fold`
for instance, and the 10 lines under the cursor would be folded.
You could also specify the start and end lines manually with
`:[start line],[end line]fold`

An easy way I saw to do this, is to use Shift+V in command mode.  This will
let you highlight lines of code.  So it's as simple as pressing `Shift+V`
then the down arrow until you've highlighted a section of code.
Then you can press **zf** to fold (or type in `:fold`).

Cool right?  There's one more thing I did to keep these folds from session to
session - normally folds will disappear after you close vim unless you
create what is called a view.  I found a <a href="http://www.vim.org/tips/tip.php?tip_id=991">page</a>
on vim.org that explains how to do this automatically.  Just add these lines
into your `~/.vimrc` file:

    autocmd BufWinLeave *.* mkview
    autocmd BufWinEnter *.* silent loadview

This will save your folds when you exit a document and load them when you open
it.

Happy folding!
