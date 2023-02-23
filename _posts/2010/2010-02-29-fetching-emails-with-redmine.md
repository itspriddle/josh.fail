---
date: Mon Mar 01 13:42:29 -0500 2010
title: Fetching Emails with Redmine
category: dev
redirect_from:
- /blog/2010/fetching-emails-with-redmine.html
- /dev/2010/fetching-emails-with-redmine.html
tags: [redmine, ruby, email, imap]
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

```ruby
#!/usr/bin/env ruby

require 'yaml'

conf = YAML.load_file('/home/redmine/config/email.yml')["production"]["smtp_settings"]

opts = {
  'unknown_user'        => 'create',
  'port'                => '993',
  'host'                => conf["address"],
  'username'            => conf["user_name"],
  'password'            => conf["password"],
  'project'             => 'project_slug',
  'tracker'             => 'bug',
  'ssl'                 => '1',
  'no_permission_check' => '1'
}

args = opts.map {|key, val| "#{key}=#{val}" }.join(' ')

cmd = "cd /home/redmine && /usr/local/bin/rake redmine:email:receive_imap RAILS_ENV=production #{args}"
system(cmd)
```

[gist]: https://gist.github.com/itspriddle/318651
