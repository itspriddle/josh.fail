---
date: Sat Mar 13 13:57:35 -0500 2010
title: Formatting MySQL Queries For Asterisk
category: dev
redirect_from:
- /blog/2010/formatting-mysql-queries-for-asterisk.html
- /dev/2010/formatting-mysql-queries-for-asterisk.html
---

If you've ever used the MySQL module with [Asterisk](http://asterisk.org),
you've probably had loads of fun formatting queries.

This query:

    SELECT * FROM accounts WHERE extension = '${EXTEN}'
    AND enabled = 'Y' AND balance > 0.00 LIMIT 1;

Becomes:

    SELECT\ *\ FROM\ accounts\ WHERE\ extension\ =\ \'${EXTEN}\'\
    AND\ enabled\ =\ \'Y\'\ AND\ balance\ >\ 0.00\ LIMIT\ 1;

That probably doesn't seem too difficult, but if you have huge queries, it's
really easy to miss a character that needs to be escaped. Needless to say,
if you put code like that into production, your PBX is going to die when
the dialplan hits that code.

I finally threw together a script to do this automatically.

Now, I can run:

    asterisk-format-query <<'QUERY'
    SELECT * FROM accounts WHERE extension = '${EXTEN}'
    AND enabled = 'Y' AND balance > 0.00 LIMIT 1;
    QUERY

*NOTE:* Above, I used a quoted [heredoc](http://en.wikipedia.org/wiki/Here_document#Unix-Shells).
This prevents your shell from trying to interpolate things like `${EXTEN}`.

```ruby
#!/usr/bin/env ruby

# = USAGE
#  asterisk-format-query <<'QUERY'
#  "SELECT * FROM users WHERE extension = '200' LIMIT 1;"
#  QUERY
#
#  echo "SELECT * FROM users WHERE extension = '200' LIMIT 1;" | asterisk-format-query
#
#  Results are copied to your systems clipboard if `pbcopy`, `xclip`,
#  or `putclip` are installed.
#

module AsteriskQuery
  extend self

  # Print usage
  def usage
    require 'rdoc/usage'
    RDoc.usage('USAGE')
  end

  # Format our SQL query for use with Asterisk's MYSQL cmd
  def format_query(query)
    # This '###' hackery is so gsub doesn't
    # choke on the backslashes we need to add
    # when '\1' is printed
    query.gsub(/([ \,\"\'])/, '###' + '\1').gsub('###', '\\')
  end

  # Stolen from http://github.com/defunkt/gist/blob/ff3dc6daf792ae4ed7338d749e2341b3b2eb9bd6/lib/gist.rb#L118
  # Tries to copy passed content to the clipboard
  def copy(content)
    cmd = case true
    when system("type pbcopy > /dev/null")
      :pbcopy
    when system("type xclip > /dev/null")
      :xclip
    when system("type putclip > /dev/null")
      :putclip
    end

    if cmd
      IO.popen(cmd.to_s, 'r+') { |clip| clip.print content }
    end

    content
  end

  # Formats query and tries to copy it to the clipboard
  def parse
    query = copy format_query($stdin.read)
  end

end

if $stdin.tty?
  puts AsteriskQuery.usage
else
  puts AsteriskQuery.parse
end
```

[gist]: https://gist.github.com/itspriddle/330887
