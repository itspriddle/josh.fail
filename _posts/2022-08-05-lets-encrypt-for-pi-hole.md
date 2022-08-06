---
title: "Let's Encrypt for Pi-hole"
date: "Fri Aug 05 20:35:38 -0400 2022"
---

Here's how I used acme.sh to setup Let's Encrypt for my Pi-holes.

Install:

```
sudo apt-get install socat install lighttpd-mod-openssl
curl https://get.acme.sh | bash -s email=ssl@josh.fail
```

Log out and back in so `acme.sh` is available.

Next, configure lighttpd, in `/etc/lighttpd/external.conf`:

```
server.modules += ( "mod_openssl" )

$HTTP["host"] == "dns1.josh.fail" {
  # Ensure the Pi-hole Block Page knows that this is not a blocked domain
  setenv.add-environment = ("fqdn" => "true")

  # Enable the SSL engine with a LE cert, only for this specific host
  $SERVER["socket"] == ":443" {
    ssl.engine = "enable"
    ssl.pemfile = "/etc/letsencrypt/dns1.josh.fail/hostkey.pem"
    ssl.ca-file =  "/etc/letsencrypt/dns1.josh.fail/fullchain.crt"
    ssl.honor-cipher-order = "enable"
    ssl.cipher-list = "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH"
    ssl.use-sslv2 = "disable"
    ssl.use-sslv3 = "disable"
  }

  # Redirect HTTP to HTTPS
  $HTTP["scheme"] == "http" {
    $HTTP["host"] =~ ".*" {
      url.redirect = (".*" => "https://%0$0")
    }
  }
}

$HTTP["host"] == "dns1.local" {
  $HTTP["scheme"] == "http" {
    $HTTP["host"] =~ ".*" {
      url.redirect = (".*" => "https://dns1.priddle.xyz$0")
    }
  }
}
```

Create a place to store the certificates:

```
sudo mkdir -p /etc/letsencrypt/dns1.josh.fail
sudo chown pi:pi /etc/letsencrypt/dns1.josh.fail
```

Now, issue the cert. I am using Digital Ocean and DNS challenges, so it looked
something like:

```
export DO_API_KEY=asdf
acme.sh --issue --dns dns_dgon --server letsencrypt -d dns1.josh.fail
```

Install the cert and ensure lighttpd is restarted when a new cert is issued:

```
acme.sh --install-cert -d dns1.josh.fail \
  --key-file /etc/letsencrypt/dns1.josh.fail/host.key \
  --fullchain-file /etc/letsencrypt/dns1.josh.fail/fullchain.crt \
  --cert-file /etc/letsencrypt/dns1.josh.fail/host.crt \
  --reloadcmd "cat /etc/letsencrypt/dns1.josh.fail/host.crt /etc/letsencrypt/dns1.josh.fail/host.key > /etc/letsencrypt/dns1.josh.fail/hostkey.pem; sudo service lighttpd restart"
```

Done!
