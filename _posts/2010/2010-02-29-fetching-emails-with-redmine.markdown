---
layout: default
date: Mon Mar 01 13:42:29 -0500 2010
short_description: |
  <p>
    Redmine has an awesome feature built in that lets you check an email
    account to import new tickets into your project.
  </p>
  <p>
    Unfortunately, I didn&rsquo;t see a clear way to do this without exposing
    your IMAP username/password to your cron.logs. I wrote a small script that
    reads the username/password/host from your <code>config/email.yml</code>
    file.
  </p>
title: Fetching Emails with Redmine
---

Redmine has an awesome feature built in that lets you check an email account
to import new tickets into your project.

Unfortunately, I didn't see a clear way to do this without exposing your IMAP
username/password to your cron.logs. I wrote a small script that reads
the username/password/host from your `config/email.yml` file.

**NOTE** If you are using a different email account than the one in
`config/email.yml` then you should create `config/imap.yml` and include that
in this script. ** **DO NOT** ** add extra fields to `config/email.yml` or
you'll break things.

{% gist 318651 fetch_redmine_emails.rb %}
