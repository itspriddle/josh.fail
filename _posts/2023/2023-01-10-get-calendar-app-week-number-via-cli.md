---
title: "Get Calendar.app week number via CLI"
date: "Tue Jan 10 09:35:11 -0500 2023"
category: dev
---

If you need to get a Calendar.app week number via CLI, here's a script that
does just that.

```sh
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
# Note: I know what you're thinking... "Hey, look at this clown, he doesn't
# know you can just use `date` and '%U', '%W' or '%V'. He probably didn't even
# RTFM!" Well, you're right, I didn't really peruse `man date` much until I
# saw that Calendar.app's week number did not match those from strftime(3). I
# promise, I wanted this entire monstrosity to be a one-liner. But, alas,
# computers.
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
# With all that in mind, we just reach for AppleScript which has NSCalendar
# that can answer this question for us.
#
# See also: https://en.wikipedia.org/wiki/ISO_week_date#Calculating_the_week_number_from_a_month_and_day_of_the_month_or_ordinal_date
week_number() {
  local now="$1" pad="$2" week

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

    -- https://gist.github.com/RichardHyde/3386ac57b55455b71140
    -- Convert date function. Call with string in YYYY-MM-DD HH:MM:SS format (time part optional)
    on convertDate(textDate)
      set resultDate to the current date
      set the month of resultDate to (1 as integer)
      set the day of resultDate to (1 as integer)

      set the year of resultDate to (text 1 thru 4 of textDate)
      set the month of resultDate to (text 6 thru 7 of textDate)
      set the day of resultDate to (text 9 thru 10 of textDate)
      set the time of resultDate to 0

      if (length of textDate) > 10 then
        set the hours of resultDate to (text 12 thru 13 of textDate)
        set the minutes of resultDate to (text 15 thru 16 of textDate)

        if (length of textDate) > 16 then
          set the seconds of resultDate to (text 18 thru 19 of textDate)
        end if
      end if

      return resultDate
    end convertDate

    on run argv
      getWeekFromDate(convertDate(item 1 of argv))
    end run
    " -- "$now"
  )

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
  local target_date pad="02" advance

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

  week_number "$target_date" "$pad" && [[ -t 1 ]] && echo
}

main "$@"
```

I originally tried doing this in pure Bash, but there was always a random edge
case that would break. This AppleScript version seems rock solid.
