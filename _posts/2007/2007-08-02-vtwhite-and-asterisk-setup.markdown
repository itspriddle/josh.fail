---
layout: default
date: "Thu Aug 2 23:26:00 -0400 2007"
link: http://voipcowboy.net/tutorials/vtwhite/vtwhite-and-asterisk/
title: "VTWhite and Asterisk Setup"
---

I picked up a [VTWhite](http://vtwhite.com "Wholesale VoIP Origination and
Termination") account recently for five bucks - if you just want to toy around
with SIP this is a great provider to go with.  They offer DIDs for 75 cents a
month and you only pay for the calls you make - so you don't need to invest
$25 bucks a month to go with a full fledged VoIP account.

VTWhite is a barebones trunk.  It doesn't have any features like voicemail,
forwarding, or simrings - you have to code that stuff yourself.  This means
the configs are a little lighter in some areas, and a little longer in others.

An important note before we dive in: **You do not register to VTWhite's SIP
peer.** They send stuff to you based on IP, not a user.  I've had a few people
ask me how do you register, so hopefully that will save someone some time.

Open your `sip.conf` and copy/paste the following:

    [vtwhite]
    type=friend
    insecure=very
    host=sip.vtwhite.com
    qualify=3600
    nat=no

That's it.  Do a sip reload and then a sip show peers and you should see a
connection between you and VTWhite.

Now, lets move away from Asterisk and make sure everything is setup right on
VTWhite's end.  Log into the control panel and click on node manager.  If you
haven't already, add your PBX's details.  The name can be anything you want -
its internal to the CP to help you organize nodes.  Source IP is the IP of
your PBX.  Destination hostname is your dns name.  Destination port is what
you've set Asterisk to use - it should be 5060.  If you have any reason for it
not to be, you probably shouldn't be using VTWhite.  This is for static IP,
hosted PBXs.  Use DHCP and dyndns at your own risk.

With the node setup, we can add DIDs to it.  Click on Add Number and choose an
area code or state.  Scroll through the list and choose your number.  Notice
the dropdown with your Node in it.  There's only 1 now, but as you add nodes
you can point specific numbers to each.  Click Get Number.

If you get an error, you might not be verified, or you need to add money to
your account.  Otherwise you should see your new number.

Take that number, and create a peer in `sip.conf` for your phone.

    [15553331111]
    type=friend
    host=dynamic
    callerid="VTWhite" <15553331111>
    username=15553331111
    secret=password
    nat=yes
    canreinvite=yes
    disallow=all
    allow=ulaw
    context=vtwhite

Next, we need to setup routes for the new DID.  We're going to structure this
so that you can easily add another peer to `sip.conf` without having to change
the routes.

    [vtwhite]
    include=vtwhite-outgoing
    include=vtwhite-incoming

    [vtwhite-outgoing]
    ; Make sure we pass an 11 digit number to vtwhite's SIP proxy
    exten => _NXXXXXX,1,Goto(1${CALLERID(num):1:3}${EXTEN},1)
    exten => _NXXNXXXXXX,1,Goto(1${EXTEN},1)

    exten => _1NXXNXXXXXX,1,Verbose(1| ${CALLERID(num)} is calling ${EXTEN})
    exten => _1NXXNXXXXXX,2,Dial(SIP/${EXTEN}@vtwhite,40,r)
    exten => _1NXXNXXXXXX,3,Hangup</code>

    [vtwhite-incoming]
    ; Answer the call and strip the number dialed from the sip header
    exten => s,1,Answer
    exten => s,2,Set(VTWDID=${SIP_HEADER(TO):5:11})
    exten => s,3,Goto(${VTWDID},1)

    exten => _1NXXNXXXXXX,1,Verbose(1|Incoming VTWHITE call for ${EXTEN})
    exten => _1NXXNXXXXXX,2,Dial(SIP/${EXTEN},25,r)
    exten => _1NXXNXXXXXX,3,Hangup
