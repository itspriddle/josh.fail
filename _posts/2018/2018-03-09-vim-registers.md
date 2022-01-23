---
title: "Vim Registers"
date: "Fri Mar 09 23:17:20 -0500 2018"
---

I found this great writeup on Vim registers today.

From user [Benoit][] on [Stack Overflow][]:

Hit <kbd>Ctrl</kbd>-<kbd>R</kbd> then <kbd>"</kbd>. If you have literal control characters in what you have yanked, use <kbd>Ctrl</kbd>-<kbd>R</kbd>, <kbd>Ctrl</kbd>-<kbd>O</kbd>, <kbd>"</kbd>.

Here is an explanation of what you can do with registers. What you can do with registers is extraordinary, and once you know how to use them you cannot live without them.

Registers are basically storage locations for strings. Vim has many registers that work in different ways:

 * `0` (yank register: when you use `y` in normal mode, without specifying a register, yanked text goes there and also to the default register),
 * `1` to `9` (shifting delete registers, when you use commands such as `c` or `d`, what has been deleted goes to register 1, what was in register 1 goes to register 2, *etc.*),
 * `"` (default register, also known as unnamed register. This is where the <kbd>"</kbd> comes in <kbd>Ctrl</kbd>-<kbd>R</kbd>, <kbd>"</kbd>),
 * `a` to `z` for your own use (capitalized `A` to `Z` are for appending to corresponding registers).
 * `_` (acts like `/dev/null` (Unix) or `NUL` (Windows), you can write to it but it's discarded and when you read from it, it is always empty),
 * `-` (small delete register),
 * `/` (search pattern register, updated when you look for text with `/`, `?`, `*` or `#` for instance; you can also write to it to dynamically change the search pattern),
 * `:` (stores last VimL typed command via `Q` or `:`, readonly),
 * `+` and `*` (system clipboard registers, you can write to them to set the clipboard and read the clipboard contents from them)

See `:help registers` for the full reference.

You can, at any moment, use `:registers` to display the contents of all registers. Synonyms and shorthands for this command are `:display`, `:reg` and `:di`.

In Insert or Command-line mode, <kbd>Ctrl</kbd>-<kbd>R</kbd> plus a register name, inserts the contents of this register. If you want to insert them literally (no auto-indenting, no conversion of control characters like `0x08` to backspace, etc), you can use <kbd>Ctrl</kbd>-<kbd>R</kbd>, <kbd>Ctrl</kbd>-<kbd>O</kbd>, register name.
See `:help i_CTRL-R` and following paragraphs for more reference.

But you can also do the following (and I probably forgot many uses for registers).

 * In normal mode, hit <kbd>"</kbd><kbd>:</kbd><kbd>p</kbd>. The last command you used in vim is pasted into your buffer.  
   Let's decompose: `"` is a Normal mode command that lets you select what register is to be used during the next yank, delete or paste operation. So <kbd>"</kbd><kbd>:</kbd> selects the colon register (storing last command). Then <kbd>p</kbd> is a command you already know, it pastes the contents of the register.

   cf. `:help "`, `:help quote_:`

 * You're editing a VimL file (for instance your `.vimrc`) and would like to execute a couple of consecutive lines right now: <kbd>y</kbd><kbd>j</kbd><kbd>:</kbd><kbd>@</kbd><kbd>"</kbd><kbd>Enter</kbd>.  
   Here, <kbd>y</kbd><kbd>j</kbd> yanks current and next line (this is because j is a linewise motion but this is out of scope of this answer) into the default register (also known as the unnamed register). Then the `:@` Ex command plays Ex commands stored in the register given as argument, and `"` is how you refer to the unnamed register. Also see the top of this answer, which is related.

   Do not confuse `"` used here (which is a register name) with the `"` from the previous example, which was a Normal-mode command.

   cf. `:help :@` and `:help quote_quote`

 * Insert the last search pattern into your file in Insert mode, or into the command line, with <kbd>Ctrl</kbd>-<kbd>R</kbd>, <kbd>/</kbd>.

   cf. `:help quote_/`, `help i_CTRL-R`  

   Corollary: Keep your search pattern but add an alternative: `/` <kbd>Ctrl</kbd>-<kbd>R</kbd>, <kbd>/</kbd> `\|alternative`.

 * You've selected two words in the middle of a line in visual mode, yanked them with `y`, they are in the unnamed register. Now you want to open a new line just below where you are, with those two words: `:pu`. This is shorthand for `:put "`. The `:put` command, like many Ex commands, works only linewise.

   cf. `:help :put`

   You could also have done: `:call setreg('"', @", 'V')` then `p`. The `setreg` function sets the register of which the name is given as first argument (as a string), initializes it with the contents of the second argument (and you can use registers as variables with the name `@x` where `x` is the register name in VimL), and turns it into the mode specified in the third argument, `V` for linewise, nothing for characterwise and literal `^V` for blockwise.

   cf. `:help setreg()`. The reverse functions are `getreg()` and `getregtype()`.

 * If you have recorded a macro with `qa`...`q`, then `:echo @a` will tell you what you have typed, and `@a` will replay the macro (probably you knew that one, very useful in order to avoid repetitive tasks)

   cf. `:help q`, `help @`

   Corollary from the previous example: If you have `8go` in the clipboard, then `@+` will play the clipboard contents as a macro, and thus go to the 8th byte of your file. Actually this will work with almost every register. If your last inserted string was `dd` in Insert mode, then `@.` will (because the `.` register contains the last inserted string) delete a line. (Vim documentation is wrong in this regard, since it states that the registers `#`, `%`, `:` and `.` will only work with `p`, `P`, `:put` and <kbd>Ctrl</kbd>-<kbd>R</kbd>).

   cf. `:help @`

   Don't confuse `:@` (command that plays Vim commands from a register) and `@` (normal-mode command that plays normal-mode commands from a register).

   Notable exception is `@:`. The command register does not contain the initial colon neither does it contain the final carriage return. However in Normal mode, `@:` will do what you expect, interpreting the register as an Ex command, not trying to play it in Normal mode. So if your last command was `:e`, the register contains `e` but `@:` will reload the file, not go to end of word.

   cf. `:help @:`

 * Show what you will be doing in Normal mode before running it: `@='dd'` <kbd>Enter</kbd>. As soon as you hit the `=` key, Vim switches to expression evaluation: as you enter an expression and hit <kbd>Enter</kbd>, Vim computes it, and the result acts as a register content. Of course the register `=` is read-only, and one-shot. Each time you start using it, you will have to enter a new expression.

   cf. `:help quote_=`

   Corollary: If you are editing a command, and you realize that you should need to insert into your command line some line from your current buffer: don't press <kbd>Esc</kbd>! Use <kbd>Ctrl</kbd>-<kbd>R</kbd> `=getline(58)` <kbd>Enter</kbd>. After that you will be back to command line editing, but it has inserted the contents of the 58th line.

 * Define a search pattern manually: `:let @/ = 'foo'`

   cf. `:help :let`

   Note that doing that, you needn't to escape `/` in the pattern. However you need to double all single quotes of course.

 * Copy all lines beginning with `foo`, and afterwards all lines containing `bar` to clipboard, chain these commands: `qaq` (resets the *a* register storing an empty macro inside it), `:g/^foo/y A`, `:g/bar/y A`, `:let @+ = @a`.

   Using a capital register name makes the register work in append mode

   Better, if `Q` has not been remapped by `mswin.vim`, start Ex mode with `Q`, chain those “colon commands” which are actually better called “Ex commands”, and go back to Normal mode by typing `visual`.

   cf. `:help :g`, `:help :y`, `:help Q`

 * Double-space your file: `:g/^/put _`. This puts the contents of the black hole register (empty when reading, but writable, behaving like `/dev/null`) linewise, after each line (because every line has a beginning!).

 * Add a line containing `foo` before each line: `:g/^/-put ='foo'`. This is a clever use of the expression register. Here, `-` is a synonym for `.-1` (cf. `:help :range`). Since `:put` puts the text after the line, you have to explicitly tell it to act on the previous one.

 * Copy the entire buffer to the system clipboard: `:%y+`.

   cf. `:help :range` (for the `%` part) and `:help :y`.

 * If you have misrecorded a macro, you can type `:let @a='` <kbd>Ctrl</kbd>-<kbd>R</kbd> `=replace(@a,"'","''",'g')` <kbd>Enter</kbd> `'` and edit it. This will modify the contents of the macro stored in register `a`, and it's shown here how you can use the expression register to do that.

 * If you did `dddd`, you might do `uu` in order to undo. With `p` you could get the last deleted line. But actually you can also recover up to 9 deletes with the registers `@1` through `@9`.

   Even better, if you do `"1P`, then `.` in Normal mode will play `"2P`, and so on.

   cf. `:help .` and `:help quote_number`

 * If you want to insert the current date in Insert mode: <kbd>Ctrl</kbd>-<kbd>R</kbd>`=strftime('%y%m%d')`<kbd>Enter</kbd>.

   cf. `:help strftime()`

Once again, what can be confusing:

 * `:@` is a command-line command that interprets the contents of a register as vimscript and sources it
 * `@`  in normal mode command that interprets the contents of a register as normal-mode keystrokes (except when you use `:` register, that contains last played command without the initial colon: in this case it replays the command as if you also re-typed the colon and the final return key).

 * `"`  in normal mode command that helps you select a register for yank, paste, delete, correct, etc.
 * `"`  is also a valid register name (the default, or unnamed, register) and therefore can be passed as an arguments for commands that expect register names

[Benoit]: https://stackoverflow.com/users/457352
[Stack Overflow]: https://stackoverflow.com/a/3997110
