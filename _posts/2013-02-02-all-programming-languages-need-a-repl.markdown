---
layout: default
date: "Sat Feb 02 13:55:21 -0500 2013"
title: "All programming languages need a REPL"
---

My girlfriend has recently begun learning Java for college. The shittyness of
Java aside, I've realized that its lack of a REPL makes it much harder to play
around with its features.

A REPL (Read Eval Print Loop), does 4 things:

1. Read: The program **reads** your input when you enter a command with your
   keyboard press enter.
2. Eval: The program **evals**, or runs the command it received from you.
3. Print: The program **prints** the result of that command to your terminal.
4. Loop: The program **loops** back to step 1 so you can run more commands.

Like most Rubyists, I started out hacking on PHP code, and without a REPL.  In
those days, it was difficult to get PHP running properly on Windows. In order
to test code, I typically made changes on a live site and reloaded my browser.
Eventually I switched to Linux, and then OS X, and was able to run simple
scripts right from the terminal. This was a bit easier, but it was still a
pain to do when I just wanted to mess around with a couple functions.

When I switched to Ruby, I discovered IRB, which is Ruby's REPL. When I was
first learning the language, I could enter commands directly into IRB and get
instant feedback. Years later, I still use IRB every day at work to test code.

Compiled languages, like Java, lack REPLs. To test code in Java, you have to
recompile your app and hope it runs as desired. Compiled languages are fine,
but it would be much easier to learn how to use them with a REPL.
