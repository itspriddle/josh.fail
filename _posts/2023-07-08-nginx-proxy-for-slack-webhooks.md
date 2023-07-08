---
title: "Nginx proxy for Slack Webhooks"
date: "Sat Jul 08 01:42:49 -0400 2023"
category: dev
---

I have a quick and dirty `slack-notify` script that I've been using for a
while. I threw it on GitHub today, and got the idea of proxying a `slack.`
subdomain on my internal network to Slack so I could avoid pasting the webhook
everywhere I wanted to use it.

**Important:** Don't do this with public DNS! Otherwise, anyone could send to
your webhook.

I have a private DNS server running on my network. I have configured
`slack.priddle.xyz` to point to a VM running Nginx, but you can't access it
from the outside world (try it, `dig +short slack.priddle.xyz @1.1.1.1`).

Anyway, with the warnings out of the way... I came up with this config (with a
little help from [this gist][1]):

```nginx
server {
  server_name _;

  location / {
    proxy_pass https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX;
    proxy_pass_request_headers off;
    proxy_pass_request_body off;
    proxy_redirect off;
    proxy_method POST;
    proxy_set_body $request_body;
  }
}
```

Now, instead of doing `curl ...
https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX`,
I can just `curl ... https://slack.priddle.xyz`.

[1]: https://gist.github.com/developersteve/17203742744b2c1b5c4059d36c31e281
