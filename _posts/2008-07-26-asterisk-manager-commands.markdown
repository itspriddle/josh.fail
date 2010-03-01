---
layout: post
title: Asterisk Manager Commands
categories:
  - asterisk
---
I've been playing around with the Asterisk Manager lately (which is pretty damn cool, if you ask me).

There doesn't seem to be a list of all the commands available on voip-info right now, so I'm posting these here for my own reference.

These are the Manager commands available on Asterisk 1.4

    AbsoluteTimeout: Set Absolute Timeout (Priv: call,all)
    AgentCallbackLogin: Sets an agent as logged in by callback (Priv: agent,all)
    AgentLogoff: Sets an agent as no longer logged in (Priv: agent,all)
    Agents: Lists agents and their status (Priv: agent,all)
    ChangeMonitor: Change monitoring filename of a channel (Priv: call,all)
    Command: Execute Asterisk CLI Command (Priv: command,all)
    DBGet: Get DB Entry (Priv: system,all)
    DBPut: Put DB Entry (Priv: system,all)
    Events: Control Event Flow (Priv: &lt;none&gt;)
    ExtensionState: Check Extension Status (Priv: call,all)
    Getvar: Gets a Channel Variable (Priv: call,all)
    Hangup: Hangup Channel (Priv: call,all)
    ListCommands: List available manager commands (Priv: &lt;none&gt;)
    Logoff: Logoff Manager (Priv: &lt;none&gt;)
    MailboxCount: Check Mailbox Message Count (Priv: call,all)
    MailboxStatus: Check Mailbox (Priv: call,all)
    MeetmeMute: Mute a Meetme user (Priv: call,all)
    MeetmeUnmute: Unmute a Meetme user (Priv: call,all)
    Monitor: Monitor a channel (Priv: call,all)
    Originate: Originate Call (Priv: call,all)
    Park: Park a channel (Priv: call,all)
    ParkedCalls: List parked calls (Priv: &lt;none&gt;)
    PauseMonitor: Pause monitoring of a channel (Priv: call,all)
    Ping: Keepalive command (Priv: &lt;none&gt;)
    PlayDTMF: Play DTMF signal on a specific channel. (Priv: call,all)
    QueueAdd: Add interface to queue. (Priv: agent,all)
    QueuePause: Makes a queue member temporarily unavailable (Priv: agent,all)
    QueueRemove: Remove interface from queue. (Priv: agent,all)
    Queues: Queues (Priv: &lt;none&gt;)
    QueueStatus: Queue Status (Priv: &lt;none&gt;)
    Redirect: Redirect (transfer) a call (Priv: call,all)
    SetCDRUserField: Set the CDR UserField (Priv: call,all)
    Setvar: Set Channel Variable (Priv: call,all)
    SIPpeers: List SIP peers (text format) (Priv: system,all)
    SIPshowpeer: Show SIP peer (text format) (Priv: system,all)
    Status: Lists channel status (Priv: call,all)
    StopMonitor: Stop monitoring a channel (Priv: call,all)
    UnpauseMonitor: Unpause monitoring of a channel (Priv: call,all)
    UserEvent: Send an arbitrary event (Priv: user,all)
    WaitEvent: Wait for an event to occur (Priv: &lt;none&gt;)
