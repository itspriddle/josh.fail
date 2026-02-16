---
title: "ical-guy: a morning with Claude Code"
date: "Sun Feb 15 21:26:41 -0500 2026"
category: dev
---

A few years ago I wanted to automate extracting my calendar events into
markdown files in my Obsidian vault. It turned into a project and a half, a
brittle pipeline of bash, Ruby, AppleScript, and a [fork][2] of [icalBuddy][1]
that was on its last legs. Here's how a few hours on a Sunday morning with
Claude Code replaced it all with a modern EventKit-based Swift CLI.

Before we get into the new CLI, I want to sidebar into one of the biggest and
stupidest problems I had with all of this automation, and what ultimately gave
me the spark to make this new CLI last night---the week number.

In most of the world we use [ISO week date][4], which means that the first
week of the year is the one that contains the first Thursday of the year.
Calendar.app on the other hand does not use ISO 8601 _unless_ the user changes
their calendar settings in System Preferences.

This means that standard scripting tools like `date +%V`, `date +%U` and `date
+%W` all return the wrong week number _sometimes_, depending on the day of
week the 1st of the year fell on.

This seemed like such an easy problem, and indeed once I had the proper math
explained, it is. But figuring it out eluded me. And surprisingly, no one had
really complained about this problem at all. I guess people either used date
libs that handled it and never gave it a 2nd thought, they accepted the wrong
week numbers and manually fixed them. Or more likely, they just didn't care
about week numbers at all and I am a little extra for going that far in my
weekly planning.

Anyway, I was finally able to figure out how to make it work by using
AppleScript with NSCalendar. It worked, but it felt dirty. Whatever, I ran the
script once a week and it was fine.

<details>
<summary>NSCalendar ical-week script</summary>
```bash
#!/usr/bin/env bash
# Usage: ical-week [-n] [-N[COUNT] | -P[COUNT]] [YYYY-MM-DD]
#
# NAME
#   ical-week -- print the week number according to Calendar.app
#
# SYNOPSIS
#   ical-week [-n] [-N[COUNT] | -P[COUNT]] [YYYY-MM-DD]
#
# DESCRIPTION
#   Prints the week number according to Calendar.app, which differs from the
#   "%U", "%W", and "%V" formats of strftime(3).
#
# OPTIONS
#   -n, --no-pad
#     If set, no prepending 0 is used with single digit week numbers (i.e. Jan
#     1st will return "1" instead of "01").
#
#   -L[COUNT], --last[=COUNT]
#     If set, shows the previous week's number. Specify a COUNT to go back
#     further.
#
#   -N[COUNT], --next[=COUNT]
#     If set, shows the next week's number. Specify a COUNT to go forward
#     further.
#
#   --start-date
#     If set, shows the start date of the week.
#
#   --end-date
#     If set, shows the end date of the week.
#
# SEE ALSO
#   DATE(1), STRFTIME(3)

# Call this script with DEBUG=1 to add some debugging output
if [[ "$DEBUG" ]]; then
  export PS4='+ [${BASH_SOURCE##*/}:${LINENO}] '
  set -x
fi

set -e

# Echoes given args to STDERR
#
# $@ - args to pass to echo
warn() {
  echo "$@" >&2
}

# Prints the Calendar.app week number
#
# $1 - date in %Y-%m-%d format
# $2 - pad string to use with printf (i.e. "" or "02")
#
# Note: I know what you're thinking... "Hey, look at this clown, calculating
# the week number by hand instead of reaching for `date` and '%U', '%W' or
# '%V'. He probably didn't even RTFM!" Well, you're right, I didn't really
# peruse `man date` much until I saw that Calendar.app's week number did not
# match those from strftime(3). I promise, I wanted this entire monstrosity to
# be a one-liner. But, alas, computers.
#
# Anyway, if you've read this far, gather 'round and let me tell you a tale of
# week numbers on macOS.
#
# Calendar.app does not use ISO 8601 unless a user changes their calendar
# setting in System Preferneces -> Language & Region to ISO 8601.
#
# As a result week numbers in Calendar.app do not match those obtained by
# programming languages that use strftime(3) (i.e. `%V` and `%U` in `date`
# or Ruby's `Time#strftime`):
#
#   - %U: is replaced by the week number of the year (Sunday as the first day
#         of the week) as a decimal number (00-53).
#
#   - %V: is replaced by the week number of the year (Monday as the first day
#         of the week) as a decimal number (01-53). If the week containing
#         January 1 has four or more days in the new year, then it is week 1;
#         otherwise it is the last week of the previous year, and the next
#         week is week 1.
#
#   - %W: is replaced by the week number of the year (Monday as the first day
#         of the week) as a decimal number (00-53).
#
# These options are not appropriate to obtain the week number used by
# Calendar.app. Instead, January 1 is Week 1 *always*, which consequently
# means Week 53 only occurs in Calendar.app if December 31 is a Sunday.
#
# The days that `date` considers start of week for its various week number
# options also complicate things.
#
#   - %U: is close to what we want. Its week starts on Sunday like we want,
#         but it uses Week 53 and Week 0. It is a good candidate for manually
#         calculating the week number if we can work around Weeks 53 and 0.
#   - %V: is really what macOS/Calendar.app should be using, but I don't want
#         to change my time preference to make it work right. It is a bad
#         candidate to use for our manual calculation as well since its week
#         starts on Monday.
#   - %W: is also close to what we want, like %U, but its week starts on a
#         Monday.
#
# With all that in mind, we reach for NSDate which does what we want.
#
# See https://en.wikipedia.org/wiki/ISO_week_date#Calculating_the_week_number_from_a_month_and_day_of_the_month_or_ordinal_date
week_number() {
  local now="$1" pad="$2" start_or_end="$3" week

  # https://gist.github.com/RichardHyde/3386ac57b55455b71140
  week=$( osascript -e "
    use scripting additions
    use framework \"Foundation\"

    on getWeekFromDate(theDate)
      try
        set theASDate to theDate as date
        set theNSDate to current application's NSDate's dateWithTimeInterval:0 sinceDate:theASDate
        set theNSCalendar to current application's NSCalendar's currentCalendar()
        set theWeekInteger to (theNSCalendar's component:(current application's NSCalendarUnitWeekOfYear) fromDate:theNSDate) as integer
        return theWeekInteger
      on error
        return -1 as integer
      end try
    end getWeekFromDate

    -- Convert date function. Call with string in YYYY-MM-DD HH:MM:SS format (time part optional)
    on convertDate(textDate)
      set resultDate to the current date
      set the month of resultDate to (1 as integer)
      set the day of resultDate to (1 as integer)

      set the year of resultDate to (text 1 thru 4 of textDate)
      set the month of resultDate to (text 6 thru 7 of textDate)
      set the day of resultDate to (text 9 thru 10 of textDate)
      set the time of resultDate to 0

      return resultDate
    end convertDate

    on pad(v)
      return text -2 thru -1 of ((v + 100) as text)
    end pad

    -- get start/end day of week
    on getStartEndOfDayWeek(theTarget, theDate)
      set theWeekdays to {\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"}
      set theWeekday to weekday of theDate as string

      repeat with i from 1 to (count theWeekdays)
        if item i of theWeekdays = theWeekday then exit repeat
      end repeat

      if theTarget = \"start\" then
        set theResult to theDate - (i - 1) * days
      else
        set theResult to theDate + (7 - i) * days
      end if

      -- return YYYY-MM-DD format
      return (year of theResult as string) & \"-\" & pad(month of theResult as integer) & \"-\" & (day of theResult as string)
    end getStartEndOfDayWeek

    on run argv
      if (item 1 of argv) = \"start\"
        return getStartEndOfDayWeek(\"start\", convertDate(item 2 of argv))
      else if (item 1 of argv) = \"end\"
        return getStartEndOfDayWeek(\"end\", convertDate(item 2 of argv))
      else
        return getWeekFromDate(convertDate(item 2 of argv))
      end if
    end run
    " "$start_or_end" "$now"
  )

  if [[ "$start_or_end" ]]; then
    printf "%s" "$week"
  else
    printf "%${pad}d" "$week"
  fi
}

# Print the help text for this program
#
# $1 - flag used to ask for help ("-h" or "--help")
print_help() {
  sed -ne '/^#/!q;s/^#$/# /;/^# /s/^# //p' < "$0" |
    awk -v f="${1#-h}" '!f&&/^Usage:/||u{u=!/^\s*$/;if(!u)exit}u||f'
}

# Advance a date by weeks forward or backward
#
# $1 - date in %Y-%m-%d format
# $2 - weeks to offset, including + or -
advance_date() {
  local now="$1" offset="$2"

  date -v "$offset" -j -f "%F" "$now" "+%F"
}

main() {
  local target_date pad="02" advance print_date

  while [[ $# -gt 0 ]]; do
    case "$1" in
      -h | --help) print_help "$1"; return 0 ;;
      -n | --no-pad) pad= ; shift ;;
      -N | --next) advance="+1"; shift ;;
      -N[0-9]*) advance="+${1:2}"; shift ;;
      --next=*) advance="+${1#*=}"; shift ;;
      -P | --prev) advance="-1"; shift ;;
      -P[0-9]*) advance="-${1:2}"; shift ;;
      --prev=*) advance="-${1#*=}"; shift ;;
      --start-date) print_date=start; shift ;;
      --end-date) print_date=end; shift ;;
      --) shift; break ;;
      *) break ;;
    esac
  done

  : "${target_date:="${1:-$(date "+%F")}"}"

  if ! [[ "$target_date" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    warn "Invalid date! Use YYYY-MM-DD format!"
    return 1
  fi

  if [[ "$advance" ]]; then
    target_date="$(advance_date "$target_date" "${advance}w")"
  fi

  if week_number "$target_date" "$pad" "$print_date"; then
    # shellcheck disable=SC2015
    [[ -t 1 ]] && echo || true
  fi
}

main "$@"
```
</details>

Fast forward a couple years, and AI coding is now a thing. As I was kicking the
tires around May 2025, I thought of this old script. Surely, AI can solve this
problem for me, right?

Well, no. I don't have the code it tried, but it also landed on a broken
solution like I had. When we tried to add tests, they eventually failed. I
don't actually use much of this automation anymore since my days are less
meeting-heavy. So I gave up, and accepted the fact maybe NSCalendar was the
only way.

Claude's new Opus 4.6 model released in early February 2026, however, is a
game changer. For about 3 weeks now, every night, I make some random idea or
website I thought about a reality. And it solves way more complex problems now
than it did back in in May. So I thought, let's give it another shot.

This time, Claude did deep research on the problem. In fact, it took about 45
minutes of research before it came up with a working solution, essentially
finding the underlying ICU library that NSCalendar uses and implementing the
same week number logic in Bash. I had Claude whip up a script to generate 150
years of test data from the old NSCalendar implementation. Then I went to bed
while it ran, happy to finally have this problem nailed.

<details>
<summary>The working Bash version of ical-week</summary>
#!/usr/bin/env bash
# Usage: ical-week [-n] [-N[COUNT] | -P[COUNT]] [YYYY-MM-DD]
#
# NAME
#   ical-week -- print the week number according to Calendar.app
#
# SYNOPSIS
#   ical-week [-n] [-N[COUNT] | -P[COUNT]] [YYYY-MM-DD]
#
# DESCRIPTION
#   Prints the week number according to Calendar.app, which differs from the
#   "%U", "%W", and "%V" formats of strftime(3).
#
# OPTIONS
#   -n, --no-pad
#     If set, no prepending 0 is used with single digit week numbers (i.e. Jan
#     1st will return "1" instead of "01").
#
#   -L[COUNT], --last[=COUNT]
#     If set, shows the previous week's number. Specify a COUNT to go back
#     further.
#
#   -N[COUNT], --next[=COUNT]
#     If set, shows the next week's number. Specify a COUNT to go forward
#     further.
#
#   --start-date
#     If set, shows the start date of the week.
#
#   --end-date
#     If set, shows the end date of the week.
#
# SEE ALSO
#   DATE(1), STRFTIME(3)

# Call this script with DEBUG=1 to add some debugging output
if [[ "$DEBUG" ]]; then
  export PS4='+ [${BASH_SOURCE##*/}:${LINENO}] '
  set -x
fi

set -e

# Echoes given args to STDERR
#
# $@ - args to pass to echo
warn() {
  echo "$@" >&2
}

# Prints the Calendar.app week number
#
# $1 - date in %Y-%m-%d format
# $2 - pad string to use with printf (i.e. "" or "02")
#
# Note: I know what you're thinking... "Hey, look at this clown, calculating
# the week number by hand instead of reaching for `date` and '%U', '%W' or
# '%V'. He probably didn't even RTFM!" Well, you're right, I didn't really
# peruse `man date` much until I saw that Calendar.app's week number did not
# match those from strftime(3). I promise, I wanted this entire monstrosity to
# be a one-liner. But, alas, computers.
#
# Anyway, if you've read this far, gather 'round and let me tell you a tale of
# week numbers on macOS.
#
# Calendar.app does not use ISO 8601 unless a user changes their calendar
# setting in System Preferneces -> Language & Region to ISO 8601.
#
# As a result week numbers in Calendar.app do not match those obtained by
# programming languages that use strftime(3) (i.e. `%V` and `%U` in `date`
# or Ruby's `Time#strftime`):
#
#   - %U: is replaced by the week number of the year (Sunday as the first day
#         of the week) as a decimal number (00-53).
#
#   - %V: is replaced by the week number of the year (Monday as the first day
#         of the week) as a decimal number (01-53). If the week containing
#         January 1 has four or more days in the new year, then it is week 1;
#         otherwise it is the last week of the previous year, and the next
#         week is week 1.
#
#   - %W: is replaced by the week number of the year (Monday as the first day
#         of the week) as a decimal number (00-53).
#
# These options are not appropriate to obtain the week number used by
# Calendar.app. Instead, January 1 is Week 1 *always*, which consequently
# means Week 53 only occurs in Calendar.app if December 31 is a Saturday.
#
# The days that `date` considers start of week for its various week number
# options also complicate things.
#
#   - %U: is close to what we want. Its week starts on Sunday like we want,
#         but it uses Week 53 and Week 0. It is a good candidate for manually
#         calculating the week number if we can work around Weeks 53 and 0.
#   - %V: is really what macOS/Calendar.app should be using, but I don't want
#         to change my time preference to make it work right. It is a bad
#         candidate to use for our manual calculation as well since its week
#         starts on Monday.
#   - %W: is also close to what we want, like %U, but its week starts on a
#         Monday.
#
# With all that in mind, we calculate the week number using the same
# algorithm as NSCalendar/ICU: week = floor((dayOfYear - 1 + dow(Jan1)) / 7) + 1
# with Sunday as the first day of the week and minimumDaysInFirstWeek = 1.
#
# See https://en.wikipedia.org/wiki/ISO_week_date
week_number() {
  local now="$1" pad="$2" start_or_end="$3"

  if [[ "$start_or_end" ]]; then
    local dow
    dow=$(date -j -f "%F" "$now" "+%w")
    if [[ "$start_or_end" == "start" ]]; then
      printf "%s" "$(date -j -v-${dow}d -f "%F" "$now" "+%F")"
    else
      printf "%s" "$(date -j -v+$((6 - dow))d -f "%F" "$now" "+%F")"
    fi
    return
  fi

  local year="${now:0:4}"
  local day_of_year dow dow_jan1 days_in_year week

  read -r day_of_year dow < <(date -j -f "%F" "$now" "+%j %w")
  dow_jan1=$(date -j -f "%F" "${year}-01-01" "+%w")

  if (( year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) )); then
    days_in_year=366
  else
    days_in_year=365
  fi

  # If the date's week (Sun-Sat) extends into the next year,
  # NSCalendar considers it week 1 of the next year
  if (( 10#$day_of_year + 6 - dow > days_in_year )); then
    week=1
  else
    week=$(( (10#$day_of_year - 1 + dow_jan1) / 7 + 1 ))
  fi

  printf "%${pad}d" "$week"
}

# Print the help text for this program
#
# $1 - flag used to ask for help ("-h" or "--help")
print_help() {
  sed -ne '/^#/!q;s/^#$/# /;/^# /s/^# //p' < "$0" |
    awk -v f="${1#-h}" '!f&&/^Usage:/||u{u=!/^\s*$/;if(!u)exit}u||f'
}

# Advance a date by weeks forward or backward
#
# $1 - date in %Y-%m-%d format
# $2 - weeks to offset, including + or -
advance_date() {
  local now="$1" offset="$2"

  date -v "$offset" -j -f "%F" "$now" "+%F"
}

main() {
  local target_date pad="02" advance print_date

  while [[ $# -gt 0 ]]; do
    case "$1" in
      -h | --help) print_help "$1"; return 0 ;;
      -n | --no-pad) pad= ; shift ;;
      -N | --next) advance="+1"; shift ;;
      -N[0-9]*) advance="+${1:2}"; shift ;;
      --next=*) advance="+${1#*=}"; shift ;;
      -P | --prev) advance="-1"; shift ;;
      -P[0-9]*) advance="-${1:2}"; shift ;;
      --prev=*) advance="-${1#*=}"; shift ;;
      --start-date) print_date=start; shift ;;
      --end-date) print_date=end; shift ;;
      --) shift; break ;;
      *) break ;;
    esac
  done

  : "${target_date:="${1:-$(date "+%F")}"}"

  if ! [[ "$target_date" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    warn "Invalid date! Use YYYY-MM-DD format!"
    return 1
  fi

  if [[ "$advance" ]]; then
    target_date="$(advance_date "$target_date" "${advance}w")"
  fi

  if week_number "$target_date" "$pad" "$print_date"; then
    # shellcheck disable=SC2015
    [[ -t 1 ]] && echo || true
  fi
}

main "$@"
</details>

When I woke up I was about to implement a test of bats tests. But for some
reason bats isn't running on my computer (which is super annoying but for
another day).

But then, it dawned on me: why am I doing this in Bash? I've built a couple
small Rust CLIs in recent weeks. Seems like a good choice for this.

So I set Claude to work implementing a Rust version.
<details>
<summary>The Rust version of ical-week</summary>
```rust
use chrono::{Datelike, Days, NaiveDate};

fn is_leap_year(year: i32) -> bool {
    year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
}

fn days_in_year(year: i32) -> u32 {
    if is_leap_year(year) { 366 } else { 365 }
}

/// Calculate the week number matching macOS Calendar.app (NSCalendar/ICU).
///
/// Sunday is the first day of the week. January 1 is always week 1.
/// If a date's Sun–Sat week extends into the next year, it returns 1.
pub fn week_number(date: NaiveDate) -> u32 {
    let day_of_year = date.ordinal();
    let dow = date.weekday().num_days_from_sunday();
    let dow_jan1 = NaiveDate::from_ymd_opt(date.year(), 1, 1)
        .unwrap()
        .weekday()
        .num_days_from_sunday();

    // If the date's week (Sun-Sat) extends into the next year,
    // NSCalendar considers it week 1 of the next year
    if day_of_year + 6 - dow > days_in_year(date.year()) {
        1
    } else {
        (day_of_year - 1 + dow_jan1) / 7 + 1
    }
}

/// Return the Sunday that starts the week containing `date`.
pub fn week_start(date: NaiveDate) -> NaiveDate {
    let dow = date.weekday().num_days_from_sunday();
    date.checked_sub_days(Days::new(dow.into())).unwrap()
}

/// Return the Saturday that ends the week containing `date`.
pub fn week_end(date: NaiveDate) -> NaiveDate {
    let dow = date.weekday().num_days_from_sunday();
    date.checked_add_days(Days::new((6 - dow).into())).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn d(y: i32, m: u32, d: u32) -> NaiveDate {
        NaiveDate::from_ymd_opt(y, m, d).unwrap()
    }

    #[test]
    fn jan1_is_always_week1() {
        for year in 2000..=2030 {
            assert_eq!(week_number(d(year, 1, 1)), 1, "Jan 1, {year}");
        }
    }

    #[test]
    fn sunday_starts_new_week() {
        // 2023-01-07 is Saturday (end of week 1), 2023-01-08 is Sunday (week 2)
        assert_eq!(week_number(d(2023, 1, 7)), 1);
        assert_eq!(week_number(d(2023, 1, 8)), 2);
    }

    #[test]
    fn week_53_dec31_saturday() {
        // 2005: Jan 1 is Saturday, Dec 31 is Saturday → week 53
        assert_eq!(week_number(d(2005, 12, 31)), 53);
        // 2011: Jan 1 is Saturday, Dec 31 is Saturday → week 53
        assert_eq!(week_number(d(2011, 12, 31)), 53);
    }

    #[test]
    fn year_end_spill_is_week1() {
        // 2023-12-31 is Sunday → its week spills into 2024 → week 1
        assert_eq!(week_number(d(2023, 12, 31)), 1);
        // 2024-12-30 is Monday → week spills into 2025 → week 1
        assert_eq!(week_number(d(2024, 12, 30)), 1);
    }

    #[test]
    fn leap_year_boundaries() {
        // 2024 is a leap year
        assert_eq!(week_number(d(2024, 2, 29)), 9);
        assert_eq!(week_number(d(2024, 3, 1)), 9);
    }

    #[test]
    fn week_start_and_end() {
        // 2023-01-11 is Wednesday
        assert_eq!(week_start(d(2023, 1, 11)), d(2023, 1, 8));
        assert_eq!(week_end(d(2023, 1, 11)), d(2023, 1, 14));

        // Sunday returns itself as start
        assert_eq!(week_start(d(2023, 1, 8)), d(2023, 1, 8));
        // Saturday returns itself as end
        assert_eq!(week_end(d(2023, 1, 14)), d(2023, 1, 14));
    }
}
```
</details>

This worked great! I even started writing up the project README and a GitHub
Actions workflow to run the tests I'd made.

But then I remembered how I'm extra...

If this is going to be a compiled CLI, why are we fighting macOS? Wait, I bet
Swift has the same API as NSCalendar for week numbers. Oh, wait again, the
entire point of this project years ago was to extract ical info and iCalBuddy
wasn't great for my purposes. It doesn't emit structured output. I had
hundreds of lines of bash and Ruby to parse its output and fake json. Is it
easier in 2026 than it was in 2014 when iCalBuddy was last update?

Turns out, yes!

I started by making an empty directory and cloning icalbuddy's source core
into it. Then I asked Claude in plain english:

> I want to know the feasibility of building a Swift replacement for this
> icalbuddy project. It works but it is kind of buggy. There is no standardized
> format for events so it is hard to use for automation. And there are issues
> with Google and perhaps others with recurring events. I had to resort to
> grabbing more days' info than I wanted. I dont really know Swift at all to
> know if this can be done. If we did, what might it look like?

Claude then scanned the code for about 10 minutes and came back with a full
detailed implementation plan to create a v1 that dumped the week's calendar
events as JSON. Turns out "EventKit" is the framework for this, and Apple
solved all those problems that annoyed me with icalBuddy like recurring events
and time zones.

The first version worked perfectly. My wife happened to be out to breakfast
with some girlfriends this morning. So I spent the morning implementing some
text formatting options to make ical-guy behave a little more like icalBuddy.

A few hours later, and you can `brew install itspriddle/brew/ical-guy` to get
the new CLI.

I still can't believe how fast this all came together. The original Bash/Ruby
version took me weeks of fine tuning and late nights to get right. All to
_barely_ have a cobbled together version that mostly behaved if I was careful
with it. The new version took a few hours on a Sunday morning, and is way more
robust than the old one. And I didn't have to crack a single Swift tutorial.
In fact the only pain point was figuring out I needed to install Xcode because
the CLI tools I typically use didn't include some testing frameworks Claude
wanted to use.

This is a super simple example, but it really shows the potential of AI
coding. Barriers to entry that involve skill simply no longer exist.

If you want to check out the source for the new CLI, it's on GitHub at
[itspriddle/ical-guy][3].

[1]: https://hasseg.org/icalBuddy/
[2]: https://github.com/ali-rantakari/icalBuddy
[3]: https://github.com/itspriddle/ical-guy
[4]: https://en.wikipedia.org/wiki/ISO_week_date
