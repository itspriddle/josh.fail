---
title: "My home network"
date: "Sat Nov 25 20:28:11 -0400 2023"
---

I thought I'd document my home network, or at least the more interesting parts.

### Domain

I own `priddle.network` and use it exclusively for my home network.

I use DigitalOcean to manage my DNS. `acme.sh` and friends all support DO's
DNS API so it's a great way to get SSL certificates for my internal sites. I
guess I don't really need it, but it's easy to setup with an Nginx proxy, so
I've been doing it.

### Modem/Internet

I use an [ARRIS SURFboard DOCSIS 3.0 cable modem][modem] to connect to
Spectrum for Internet. Spectrum manages it entirely via TFTP... but it does
belong to me.

I get about 300Mbps down and 10Mbps up from Spectrum.

[modem]: https://www.target.com/p/arris-surfboard-32x8-docsis-3-0-cable-modem-model-sb6190-white/-/A-50598728#lnk=sametab

### Router

I run [OPNsense][opnsense] on a [Protectli FW4B][router].

I'm not doing anything too fancy with it. I setup `priddle.network` as my
network name and then use OPNsense's DHCP and Unbound modules to set custom
DNS records for every machine on my network. I also setup DHCP to assign my
two Pi-holes as DNS servers for most of the machines on the network (aside
from my wife's work computer).

[opnsense]: https://opnsense.org
[router]: https://protectli.com/product/fw4b/

### Switches

For ethernet, I am using a cheap [24-port TP-Link switch][24-port switch]. I
have a few PoE devices that I power with a [5 port TP-Link PoE switch][poe
switch].

I also have an [8-port Netgear switch][8-port switch]. My coax input is on the
opposite side of my office and most of this gear is in a small [9u
rack][network rack] in the closet. This switch, the cable modem, and router
are plugged in and hidden behind a cabinet.

[24-port switch]: https://www.amazon.com/gp/product/B0779R9LJ3/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[poe switch]: https://www.amazon.com/gp/product/B076HZFY3F/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[8-port switch]: https://www.amazon.com/gp/product/B00KFD0SYK/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[network rack]: https://www.amazon.com/gp/product/B08VDV156F/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1

### WiFi

For WiFi, I recently switched to an [Ubiquiti U6 Pro][wifi] that I run in
standalone mode. I'm not sure yet if I'll switch my router out to an Ubiquiti
gateway. For my apartment, the U6 Pro works just fine.

[wifi]: https://store.ui.com/us/en/products/u6-pro

### Pi-hole DNS servers

I run two instances of Pi-hole, one on a [Raspberry Pi 4 Model B Rev 1.1][rpi
4b] with 2gb of RAM, and another on an older [Raspberry Pi 3 Model B Plus Rev
1.3][rpi 3b+] with 1gb of RAM. They each use a [UCTRONICS PoE hat][poe hat] for
power. 

[rpi 4b]: https://www.raspberrypi.com/products/raspberry-pi-4-model-b/
[rpi 3b+]: https://www.raspberrypi.com/products/raspberry-pi-3-model-b-plus/
[poe hat]: https://www.amazon.com/gp/product/B082ZLDMZ6/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1

### NAS

For my NAS, I am using a [Synology DS1522+][nas]. It has 2 [WD Red Plus
10tb][wd-red 10tb] drives and 3 [WD Red 12gb][wd-red 12tb] drives---for about
40tb of total storage. I upgraded to [32gb of RAM][nas ram] and threw in a couple
[400gb Synology SSDs][nas ssd] for about 745gb of caching.

I primarily use the NAS for sharing media files and for backups (via
TimeMachine and manual ones).

I'm also running Docker on it and run Deluge and a Git server on it.

I'm using about 17tb of storage today and have 21tb free.

I just got a [Tripp Lite SMART1500LCD][ups] to protect it from power outages.

[nas]: https://www.synology.com/en-us/products/DS1522+
[nas ram]: https://www.amazon.com/gp/product/B0899KV2L5/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[nas ssd]: https://www.amazon.com/Synology-2280-SNV3410-400GB-SNV3410-400G/dp/B09QMSS528?th=1
[wd-red 10tb]: https://www.amazon.com/Western-Digital-10TB-Internal-Drive/dp/B08TZPS4QQ/ref=sr_1_1?crid=1W1MCBT71BGU8&qid=1700969443&s=electronics&sprefix=wd+red+10tb%2Celectronics%2C108&sr=1-1&ufe=app_do%3Aamzn1.fos.304cacc1-b508-45fb-a37f-a2c47c48c32f
[wd-red 12tb]: https://www.amazon.com/Western-Digital-12TB-Internal-Drive/dp/B08V1L1WYD/ref=sr_1_1?crid=2SN9F0GHWKB0N&qid=1700969500&s=electronics&sprefix=wd+red+12tb%2Celectronics%2C87&sr=1-1
[ups]: https://www.newegg.com/tripp-lite-smart1500lcd-5-15r/p/N82E16842111052?Item=N82E16842111052

### Media

I've been using Plex since 2016 on Ubuntu with a Gigabyte Intel i3-4010U
(Amazon no longer lists it). Plex has been giving me trouble lately with
playback and I've been wanting to upgrade the hardware a little. I just got a
new [Beelink i5 mini PC][beelink] on sale and switched from Plex to Emby. So
far, so good.

We have 3 TVs and each has an [Apple TV 4K][apple tv] attached with two
[HomePods][homepod] (a 1st generation set in my office, and 2nd generation set
each in the living room and bedroom).

Our 2 bathrooms each have [HomePod minis][homepod mini], mainly so we can yell
at Siri from the shower to add shampoo or soap to our grocery list.

[beelink]: https://www.amazon.com/gp/product/B0C9LTMZ5W/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[apple tv]: https://www.apple.com/apple-tv-4k/
[homepod]: https://www.apple.com/homepod-2nd-generation/
[homepod mini]: https://www.apple.com/homepod-mini/

### Printing

I have a 9 year old [Brother HL-2270DW][brother printer] that works great and
I refuse to upgrade. We've bought toner every 2 years or so. I put
[Printopia][printopia] on my Mac to make it work with AirPrint for our phones
and iPads. I plan on using it until it dies (🤞).

[brother printer]: https://www.amazon.com/gp/product/B00450DVDY/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[printopia]: https://www.decisivetactics.com/products/printopia/

### IoT: Lights/Automation

For lights and automation, I have mostly [Hue][hue lights] color lights.
They're expensive, but they are definitely better than the alternatives.

I've tried [innr White Smart Bulbs][innr white lights] and they work great
software-wise, they don't seem to dim as well as the real Hue lights.

In our living room we have: 3 Hue color lights and a fixture with 2 white Hue
lights.

In our kitchen we have a single fixture with 3 innr white lights.

My office has 4 Hue color lights and an innr color light strip around my TV
stand.

Our bedroom has 2 color Hue lights, one on each nightstand.

When we go out of town, I have 3 [Logitech Circle View Cameras][circle view]
for spying on our cats.

Outside we run a  [meross Outdoor Wi-Fi Outlet][outdoor plug] to control
Christmas decorations with Siri.

I also have a few [meross Smart Plug Minis][smart plug] to control our
Christmas tree lights and a couple other old school lights.

Technically our bed (Tempurpedic) is a smart bed, too. We also have a Roomba.
I pretty much leave them alone besides letting Pi-hole block any tracking they
try to do.

[hue lights]: https://www.philips-hue.com
[innr white lights]: https://www.amazon.com/gp/product/B07SC4CJ7H/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[smart plug]: https://www.amazon.com/gp/product/B084JHJBQT/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[outdoor plug]: https://www.amazon.com/gp/product/B08BFGRY9C/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1
[circle view]: https://www.logitech.com/en-us/products/cameras/circle-view-security-camera.961-000489.html

### Personal Computers/Mobile Devices

This section needs a post of its own, but the personal computers we have are:

- Me:
    - Mac mini M2 Pro (2023)
    - MacBook Air M1 (2020)
    - iPhone 15 Pro (2023)
    - iPad Pro 2nd gen (2020)
    - iPad mini 6th gen (2021)
- Wife:
    - Thinkpad (for work, unknown model)
    - MacBook Air Intel i3 (2016)
    - iPhone 15 Pro (2023)
    - iPad Pro 1st gen (2018)

We have quite a few gaming systems too but I'm not doing anything interesting
with them network-wise.

---

Since OPNsense has support for vnstat, here's what the WAN usage on my router
looked like (i.e. traffic in/out from the internet):

| month   | rx         | tx         | total      | avg. rate   |
| ------- | ---------: | ---------: | ---------: | ----------- |
| Dec '22 | 1.24 TiB   | 74.59 GiB  | 1.31 TiB   | 4.31 Mbit/s |
| Jan '23 | 1.04 TiB   | 66.24 GiB  | 1.10 TiB   | 3.62 Mbit/s |
| Feb '23 | 959.34 GiB | 83.66 GiB  | 1.02 TiB   | 3.70 Mbit/s |
| Mar '23 | 1.03 TiB   | 65.91 GiB  | 1.10 TiB   | 3.60 Mbit/s |
| Apr '23 | 1.21 TiB   | 65.35 GiB  | 1.27 TiB   | 4.31 Mbit/s |
| May '23 | 1.22 TiB   | 56.15 GiB  | 1.28 TiB   | 4.19 Mbit/s |
| Jun '23 | 1.17 TiB   | 74.55 GiB  | 1.24 TiB   | 4.21 Mbit/s |
| Jul '23 | 1.26 TiB   | 113.23 GiB | 1.37 TiB   | 4.51 Mbit/s |
| Aug '23 | 721.31 GiB | 70.74 GiB  | 792.05 GiB | 2.54 Mbit/s |
| Sep '23 | 1.18 TiB   | 85.44 GiB  | 1.27 TiB   | 4.30 Mbit/s |
| Oct '23 | 1.23 TiB   | 82.32 GiB  | 1.31 TiB   | 4.29 Mbit/s |
| Nov '23 | 904.41 GiB | 70.79 GiB  | 975.20 GiB | 3.73 Mbit/s |

Most of that is Google Meet/Skype video calls from my wife and I with work. I
took a trip for work in August and it definitely shows in our bandwidth usage.
