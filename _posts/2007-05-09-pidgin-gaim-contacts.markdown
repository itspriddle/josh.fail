---
layout: post
title: Pidgin/Gaim Contacts
---

**Update 12/10/07:** _This bug has been resolved in the current version of
Pidgin._

Pidgin (formally Gaim) is an amazing IM client. There was one small thing that
used to bug the shit out of me though.

A handy feature on the buddy list, is the ability to merge multiple screen
names into one contact. The bug I'm talking about, prevents you from manually
specifying which screen name you want at the top of the contact list - IE: the
account you want to IM to if you click on the contact name and he is signed on
with more than one account.

The bug is documented better [here](http://developer.pidgin.im/ticket/782).
I'm really only putting this here so I can find it later.

**On Linux:** Open `~/.purple/prefs.xml` and change the status score for idle
to 0

**On Windows:** Open `C:\Documents and Settings\YOUR WIN USERNAME\Application
Data\.purple\prefs.xml` and change the status score for idle to 0

Just a "workaround" I guess, but works like a charm.
