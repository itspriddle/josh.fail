---
title: "Obsidian Nirvana"
date: "Mon Feb 07 20:18:12 -0500 2022"
category: blog
redirect_from: /blog/2022/obsidian-nirvana.html
---

I really need to do a proper project/post on my [Obsidian][] setup, but I
think I've finally reached planning nirvana.

The short version:

- I have two scripts `ical-buddy-json` and `ical-agenda` which output my
  Calendar.app events to Markdown:
    ```
    ical-buddy-json -- 2022-02-07 | ical-agenda > notebook/agendas/W07.md
    ```

  - The Markdown output uses H6's with sections for:
    - `###### Weekly Overview`: Weekly agregates (meeting count/duration,
      holidays, PTO counts)
    - `###### 2022-02-07-overview`: Daily agregates (meeting count, etc)
    - `###### 2022-02-07-agenda`: A Markdown table of that day's events,
      with the time _between_ events explicitly listed
    - `###### 2022-02-07-standup`: I keep my standup notes in a separate
      `standup.md` file, each day has a section like `## 2022-02-07 - Monday`.
      My daily notes embed that file with the current day and previous work
      day's notes
- Obsidian Weekly notes embed:
  1. Weekly Overview from agenda
  2. Each Daily Note for Mon-Fri for that week
- Obsidial Daily notes:
  1. Embed of Daily Agenda overview
  2. Embed of Daily Standup notes
  3. Embed of Daily Agenda table

I throw the weekly note in the right sidebar of Obsidian and I can quickly
pull up my weekly agenda. I've mapped `cmd-j` to my daily note and
`ctrl-cmd-j` to my weekly note.

I can also easily regenerate the agenda if a new meeting gets added to my
calendar (or if one is canceled). I was previously writing the weekly note
with my Markdown script and it was a pain if I had added content to it.

I'm really enjoying the embed setup as I can still quickly add content to the
daily/weekly notes without _too_ much extra stuff clogging them up.

---

As an aside, I'm still struggling with how much work I want to put into making
this a proper _project_. Making it a full Rubygem seems overkill, and there
would be a temptation to start pulling in dependencies. Maybe just something
where people could `brew install ruby itspriddle/brews/someproject` 🤔

[1]: https://obsidian.md/
