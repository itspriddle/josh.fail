---
title: "Trying to fix my Audioengine A2+ woes"
date: "Fri Aug 12 11:10:18 -0400 2022"
---

I upgraded my desktop speakers to Audioengine A2+ a while ago. They are
awesome, except for one random bug: they sometimes stop working and require me
to unplug their power.

I haven't been able to figure out what the root cause is yet, but my hunch
says it is a lack of audio. So, I'm trying to use `afplay` via cron to see if
it stops happening.

I grabbed [10-seconds-of-silence.mp3][1] and setup the following cron job:

```
30 * * * * /usr/bin/afplay /Users/priddle/.dotfiles/share/osx/sounds/silence-10.mp3 2>/dev/null
```

🤞 hopefully this helps! It's super annoying to hop on morning calls and not
have audio.

[1]: https://github.com/anars/blank-audio/blob/master/10-seconds-of-silence.mp3
