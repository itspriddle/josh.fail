---
title: "Using Vim to convert MySQL output to CSV"
date: "Fri Sep 09 09:09:39 -0400 2022"
category: dev
tags: [vim, mysql, csv]
---

Pretty regularly I am working with MySQL queries and need to present them to
non-technical people in a Google Sheet. Here's my caveman-Vim approach to
doing it.

First, let's see the MySQL query:

```
MariaDB [wpplayground]> select * from wp_users;
+----+------------+------------------------------------+---------------+----------------------+-----------------------+---------------------+---------------------+-------------+--------------+
| ID | user_login | user_pass                          | user_nicename | user_email           | user_url              | user_registered     | user_activation_key | user_status | display_name |
+----+------------+------------------------------------+---------------+----------------------+-----------------------+---------------------+---------------------+-------------+--------------+
|  1 | priddle    | shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh | priddle       | priddle@Jedha.local  | http://localhost:9000 | 2022-06-14 17:40:48 |                     |           0 | priddle      |
|  2 | priddle1   | shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh | priddle1      | priddle1@Jedha.local | http://localhost:9000 | 2022-06-14 17:40:48 |                     |           0 | priddle1     |
|  2 | priddle2   | shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh | priddle2      | priddle2@Jedha.local | http://localhost:9000 | 2022-06-14 17:40:48 |                     |           0 | priddle2     |
+----+------------+------------------------------------+---------------+----------------------+-----------------------+---------------------+---------------------+-------------+--------------+
1 row in set (0.002 sec)
```

I copy that entire text to my clipboard. I've done it with up to 5000 rows
without too much slowness.

Next, on my local machine, I'll open a new empty Vim buffer.

There are two ways you can paste the input. The first works everywhere. Just
run `:set paste` first, and use Ctrl-C etc to paste.

If you're on a Mac, you can also use `:r!pbpaste` from within Vim. This will
use the `pbpaste` command and add its output to the current buffer.

Now, I start the cleanup.

First, the top and bottom table borders get removed; just navigate to them and
press `dd`. Delete the border under the column names too.

That leave us with:

```
| ID | user_login | user_pass                          | user_nicename | user_email           | user_url              | user_registered     | user_activation_key | user_status | display_name |
|  1 | priddle    | shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh | priddle       | priddle@Jedha.local  | http://localhost:9000 | 2022-06-14 17:40:48 |                     |           0 | priddle      |
|  2 | priddle1   | shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh | priddle1      | priddle1@Jedha.local | http://localhost:9000 | 2022-06-14 17:40:48 |                     |           0 | priddle1     |
|  2 | priddle2   | shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh | priddle2      | priddle2@Jedha.local | http://localhost:9000 | 2022-06-14 17:40:48 |                     |           0 | priddle2     |
```

Next, I strip the leading pipe characters:

```
:%s/^|\s\+//
```

Next, the trailing pipe characters are removed:

```
:%s/\s\+|$//
```

Finally, the remaining pipe characters are removed:

```
%s/\s\+|\s\+/,/g
```

And we are left with our formatted CSV:

```
ID,user_login,user_pass,user_nicename,user_email,user_url,user_registered,user_activation_key,user_status,display_name
1,priddle,shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh,priddle,priddle@Jedha.local,http://localhost:9000,2022-06-14 17:40:48,|           0,priddle
2,priddle1,shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh,priddle1,priddle1@Jedha.local,http://localhost:9000,2022-06-14 17:40:48,|           0,priddle1
2,priddle2,shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh,priddle2,priddle2@Jedha.local,http://localhost:9000,2022-06-14 17:40:48,|           0,priddle2
```

D'oh... this one didn't go as smoothly because of that empty cell for `user_activation_key`.

Fix it like so:

```
%s/,|\s\+/,/
```

And the output should look like:

```csv
ID,user_login,user_pass,user_nicename,user_email,user_url,user_registered,user_activation_key,user_status,display_name
1,priddle,shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh,priddle,priddle@Jedha.local,http://localhost:9000,2022-06-14 17:40:48,0,priddle
2,priddle1,shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh,priddle1,priddle1@Jedha.local,http://localhost:9000,2022-06-14 17:40:48,0,priddle1
2,priddle2,shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh,priddle2,priddle2@Jedha.local,http://localhost:9000,2022-06-14 17:40:48,0,priddle2
```

This is definitely brute force, and there are ways to make MySQL export a CSV
file. Still, this is _usually_ faster for me than copying files through VPNs
and such.
