---
title: "Somehow, I Manage: Why We Pair Program"
date: "Thu Mar 23 23:29:43 -0400 2023"
category: mgmt
tags: [mgmt, culture]
---

On my dev team, we pair program for just about everything we do. In fact, this
was the first team I worked with that pair programmed at all. It continues to
work well for us, but there are pros and cons, and what works for one team may
not work for another.

### Why we pair program

Choosing whether or not your team practices pair programming defines your team
culture in a _huge_ way. That doesn't mean pairing is better or worse than
solo work---just that you need to be aware that it is a big decision to make.

On my team we started pairing before I joined. The reason was boring: there
were only two people on the team. As the team grew, they stuck with it, and
found it had a lot of benefits. Code quality improved. People learned faster
and got stuck for less time.

When I joined the team and started leading it, I found the most important
benefit was that it implicitly forced everyone on the team to work
collaboratively. For me as a leader, healthy collaboration comes above all
else when it comes to maintaining my team's culture.

### Pros

- **Collaboration by default.** Development is a team sport even when people
  are working solo. Collaboration can be hard. Especially when the makeup of
  your team or projects have changed. Pair programming forces collaboration by
  default.
- **There are fewer silos.** I really hate silos---projects that only specific
  people can successfully work on---in development and engineering. Pairing
  implicitly forces everyone to share their knowledge as they work together.
- **Safe ways to step out of your comfort zones.** Sometimes people want to
  work on things that are over their heads. It can feel overwhelming to take
  on work like that on your own. Pairing lets you work with a subject matter
  expert who can guide you and help you learn new skills.
- **Time spent stuck on a problem is minimized.** Developers are first and
  foremost problem solvers. We usually enjoy solving those problems. But, it
  can be easy to get stuck on a problem, thinking "I'm almost there!" and
  spend several days on it. Only to find out that another person on the team
  could have helped if we had thought to ask. I still struggle sometimes with
  knowing when to ask for help in dev/management/life. Pair programming
  reduces the time you're stuck since you have someone to bounce ideas off of
  and find different ways of approaching a problem. On my team, pairs will
  also ask for help themselves if they both get stuck. We see very few stories
  stretch on for days at a time with no progress.
- **Onboarding is faster and smoother.** When you change jobs, there is SO
  much to learn and figure out. What apps do you maintain? How do you set them
  up? What systems do you need access to and why? Who is who at this company
  anyway? You can document every aspect for a new hire, but digesting it all
  takes time. Pair programming helps speed these things up in a huge way
  because a new hire can just ask their pair _any_ random question and get an
  answer. I've had several people tell me onboarding with my team was the
  smoothest experience they'd had in their careers and I think a big part of
  that is pair programming.
- **Fewer bugs make it to code reviews.** Pairing serves as a preliminary code
  review of sorts. Two people authoring a Pull Request will both see that code
  as they put up reviews and often notice bugs or style issues that need to be
  fixed. This saves other team members time reviewing and keeps our code
  quality up to par.
- **Shared tools make it easier to troubleshoot issues.** Everyone on my team
  uses VSCode and the LiveShare plugin to do the majority of their coding. We
  don't strictly force it, but everyone does like VSCode. One big benefit to
  using shared tools is if someone has an issue with their config everyone on
  the team can help troubleshoot.

### Cons

- **Fewer things can be worked on in parallel.** A team of 10 solo developers
  might be able to work on 10 things at once (though it's debatable if you
  want your team to do that much at once). If your team pairs, you cut that in
  half to 5. This means the random stuff that comes into your sprints, like
  emergency bug fixes, can be a lot more disruptive. Keeping projects moving
  requires ruthless prioritization when you have a smaller number of pairs on
  your team.
- **Your team may be perceived as delivering slower.** Whenever you talk about
  delivery times, people will instinctively think you could go twice as fast
  if you could work on more at once. That might be true to a certain point,
  but in technology the ol' 9 women can't make a baby in 1 month metaphor
  holds true pretty often. Ruthless prioritization and being very clear with
  your stakeholders with your progress on projects is key to avoiding this
  perception with people outside of your team.
- **It can more challenging as a boss to measure individual performance.** If
  you're a leader who is plugged in to the projects you're leading (which you
  should be), this isn't a _huge_ problem. It does mean you can't just run
  Jira reports to see what tickets someone has worked on (this is a terrible
  metric on its own, though). In practice, I've found it is still pretty easy
  to see if an individual is not carrying their weight just by talking with
  them about the work. If this does happen you can have a conversation with
  them to understand what is going on and talk about any changes you need to
  see.
- **Odd number of team members can be a pain.** This annoys me just because we
  have to think about it every two weeks. I usually just let me team decide
  amongst themselves whether someone will work solo or if we'll have a group
  of 3.
- **Asynchronous communications can take longer to be noticed when people are
  actively engaged in synchronous communications.** Since we pair on Google
  Meet, devs are usually actively in a conversation with each other and not
  paying as much attention to Slack or email. Sometimes as a boss this means I
  have to be a little more patient when I'm asking questions or need
  assistance. On the plus side, if I am not getting a response from someone, I
  can quickly ping their pair who might see and let them know I need a minute.

### Alternatives

- **Always work solo.** This is the most obvious alternative. And it works
  well for most teams, since most teams aren't pairing and there is a lot of
  great software out there.
- **Application focused teams.** Many larger organizations run teams that
  focus on one specific application. In my experience this can work great
  within the walls of that one app, but it really slows down cross-application
  development. You need at least 4 people for such a team to really be
  effective in my opinion. This isn't a great option for small teams that need
  to move quickly.
- **Project focused teams (aka tiger teams).** For shorter projects a small
  group of people from your team (or multiple teams) can work together. I've
  tried this for a couple projects by dedicating a single pair and it works
  pretty well to get that project completed. It can be challenging if a
  subject matter expert is on that team (which is almost always the case), as
  they might be pulled away for _other_ things. Reintegrating the project and
  knowledge to the larger development team has taken a bit longer in my
  experience. Still, I am personally going to continue trying this approach on
  a few more projects to make a final judgement.
- **Ad-hoc pairing.** Developers can pair up or mob as needed. If you don't
  already have tooling in place to support pair programming, it might be a
  little challenging to run ad-hoc pairing sessions. Just being able to share
  your screen with someone will work in a pinch.

### How to start pair programming on your team

If you're still reading and think you want to try pair programming on your
team, here are my recommendations:

- **Understand why you want to make the change.** Are you trying to improve
  code quality? Do you need senior developers to help mentor junior devs?
  These are perfectly valid reasons, but you need to know _why_ to communicate
  it to your team and to measure whether pairing is successful for you.
- **Involve your team in the decision if you can.** If your team is mature and
  your apps aren't on fire, consider involving them in the decision.
- **Consider a slow rollout.** You might have a single pair of developers work
  on a project and pair program. Other people on your team could rotate in
  every sprint. Once everyone had a chance to try pairing, you can add another
  pair, etc until the full team is pairing.
- **Understand that a change like this can be perceived as a lack of trust.**
  If that's actually true, you've got way bigger problems that need to be
  addressed before you should be worrying about pair programming. Even if
  trust on the team is healthy, be ready to reassure them that you trust them.
- **Choose a tool/process up front for developers to run their pairing
  sessions.** `tmux` or `screen` are great choices if you are working on a
  Linux environment that both developers have access to. VSCode with the
  LiveShare plugin is another great choice (and the one we use on my team).
  Amazon Cloud9 or GitHub Codespaces are also great choices, but likely will
  cost money.
