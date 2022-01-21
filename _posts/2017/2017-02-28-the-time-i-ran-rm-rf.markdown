---
title: "The time I ran `rm -rf /`"
date: "Tue Feb 28 22:23:16 -0500 2017"
---

A lot of sysadmins have had that holy shit moment where they ran `rm -rf /`.
Here's mine.

I was working on a script to cleanup old data for a number of customers. The
file structure was something like:

```
/var/customers/GROUP_ID/ACCOUNT_ID
```

The script took input as a list of account IDs and ran the equivalent of:

```
rm -rf /var/customers/GROUP_ID/ACCOUNT_ID
```

I'm sure you already see where this is going :smile:

The list I had accidentally contained a line of spaces, eg:

```
abc123
abc456
  
xyz123
xyz123
```

The script was written in PHP (because that's what I knew at the time), but
the bash equivalent is something like this:

```
cd /var/customers

while IFS='' read -r account_id; do
  rm -rf ${account_id:1:3}/${account_id}
done < list.txt
```

That expands to:

```
rm -rf abc/abc123
rm -rf abc/abc456
rm -rf   /
rm -rf xyz/xyz123
rm -rf xyz/xyz123
```

Thankfully I didn't walk way while this was running, and I quickly realized
something was wrong and killed the script. But I managed to delete just about
everything BUT `/var`, including `/bin` and `/usr`. A couple other coworkers
were able to restore the server to working order and no customer data was
lost.

Lessons I learned that day:

1. Don't be lazy when working with customer data. I managed to generate a bad
   list of account IDs. I used it directly in a shell command with no sanity
   checks. I knew I was being lazy, but thought, "I know this," and took
   shortcuts anyway.

2. Always get a second set of eyes on scripts that edit/destroy important
   data. Another developer might have told me how dangerous my script was.

3. Do dry runs. The simplest one-liners can go horribly wrong. Prefix commands
   with `echo` or similar to avoid actually saving or destroying data.
   Carefully review the output to make sure you aren't seeing anything
   unexpected.

4. This is the type of mistake you only make once. I had never made a mistake that
   big on the job. I thought for sure I would be fired --- my hands literally
   trembled as I typed the message to my coworkers to let them know what I had
   done. Of course I wasn't and I learned to be more careful when dealing with
   customer data.

_Originally drafted on Mar 17, 2016._
