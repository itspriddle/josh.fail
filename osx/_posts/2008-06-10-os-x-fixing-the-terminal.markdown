--- 
layout: post
title: "OS X: Fixing the Terminal"
---
This might not be a problem for everyone, but I got used to using home, end, page up, and page down to navigate through the command line and documents through the console.  I was quite suprised to see that these seemingly basic features were missing from OS X's Terminal.app.

After a ton of Googling, I came across <a href="http://tech.inhelsinki.nl/gnu_developement_under_mac_os_x/">this article</a> which pointed me in the right direction.

First, I created a file called ~/.inputrc which contains the following:

    # allow the use of the Home/End keys
    "\e[1~": beginning-of-line
    "\e[4~": end-of-line

    # allow the use of the Delete/Insert keys
    "\e[3~": delete-char
    "\e[2~": quoted-insert

Next, under Terminal &gt; Preferences &gt; Keyboard, find Home, End, Page Up, and Page Down, and enter the following values for each.  Make sure to choose 'Send string to shell:' as the action.  <strong>Note: Do not type the literal characters.  Use the delete one character button to delete the values there. </strong>

    Home: \033[1~  (Type: Ctrl+[, [, 1, ~)
    End: \033[4~  (Type: Ctrl+[, [, 4, ~)
    Page Up: \033[5~  (Type: Ctrl+[, [, 5, ~)
    Page Down: \033[6~  (Type: Ctrl+[, [, 6, ~)

Once you've done this, just restart Terminal.app, and you're golden.

* Special thanks to the owner of the blog above who literally saved the day for me on my Mac.
