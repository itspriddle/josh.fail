---
layout: default
date: Sat Mar 13 13:57:35 -0500 2010
short_description: |
  <p>
    If you&rsquo;ve ever used the MySQL module with
    <a href="http://asterisk.org">Asterisk</a>, you&rsquo;ve probably had
    loads of fun formatting queries.
  </p>
  <p>This query:</p>
  <pre><code>SELECT * FROM accounts WHERE extension = '${EXTEN}' AND enabled = 'Y' AND balance &gt; 0.00 LIMIT 1;
  </code></pre>
  <p>Becomes:</p>
  <pre><code>SELECT\ *\ FROM\ accounts\ WHERE\ extension\ =\ \'${EXTEN}\'\ AND\ enabled\ =\ \'Y\'\ AND\ balance\ &gt;\ 0.00\ LIMIT\ 1;
  </code></pre>
  <p>
    That probably doesn&rsquo;t seem too difficult, but if you have huge
    queries, it&rsquo;s really easy to miss a character that needs to be
    escaped. Needless to say, if you put code like that into production, your
    PBX is going to die when the dialplan hits that code.
  </p>
  <p>
    I finally threw together a script to do this automatically.
  </p>
title: Formatting MySQL Queries For Asterisk
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

<script src="http://gist.github.com/330887.js"> </script>
