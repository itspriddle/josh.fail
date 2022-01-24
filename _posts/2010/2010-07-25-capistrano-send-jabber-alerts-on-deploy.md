---
date: Sun Jul 25 23:18:14 -0400 2010
title: "Capistrano: Send Jabber alerts on deploy"
category: dev
redirect_from: /blog/2010/capistrano-send-jabber-alerts-on-deploy.html
---

I use this Capistrano recipe at work to send a broadcast to the office when I
deploy an update. We use Jabber, and have a broadcast user that forwards
messages to every user.

```ruby
require 'xmpp4r'
namespace :jabber do
  namespace :notify do
    desc "Send a Broadcast indicating the system is online."
    task :up do
      send_jabber_message("The system is back online.")
    end

    desc "Send a Broadcast indicating the system is going down."
    task :down do
      reason   = ENV['JABBER_REASON']   || ENV['REASON'] || "for an update"
      deadline = ENV['JABBER_DOWNTIME'] || ENV['UNTIL']  || "1 minute"
      send_jabber_message("The system is going down #{reason}. Expected downtime is #{deadline}.")
    end
  end
end

def send_jabber_message(broadcast_message)
  conf     = YAML.load_file('./config/jabber.yml')
  message  = Jabber::Message::new(conf[:broadcast], "BROADCAST: #{broadcast_message}").set_type(:normal).set_id('1')
  server   = Jabber::JID::new(conf[:username])
  client   = Jabber::Client::new(server)
  client.connect
  client.auth(conf[:password])
  client.send(message)
end

before "deploy:web:disable", "jabber:notify:down"
after  "deploy:web:enable", "jabber:notify:up"
```

`jabber.yml`:

```yml
---
:username: alerts@jabber.example.com
:password: secretagentman
:broadcast: broadcast@jabber.example.com
```

Copy `jabber.yml` to `config/jabber.yml`. Edit the details in it:

```
username: The Jabber account that will be **SENDING** alerts
          to the broadcast account

password: The password for the above Jabber account

broadcast: The Jabber broadcast account configured to forward
           messages to all users
```

Drop `jabber.rb` to `config/deploy/jabber.rb`. Add
`load "config/deploy/jabber.rb"` to `config/deploy.rb`.

When you deploy and Capistrano hits the `web:disable`
and `web:enable` tasks, a message will be sent to your
users indicating the system is down. You can customize this
message like so:

```
JABBER_REASON='a database migration' JABBER_DOWNTIME='10 minutes' cap deploy
JABBER_REASON='everything is broken' JABBER_DOWNTIME='a long time' cap deploy:web:disable
```

[gist]: https://gist.github.com/itspriddle/490141
