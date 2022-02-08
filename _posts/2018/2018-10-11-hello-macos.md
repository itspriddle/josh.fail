---
title: Hello, macOS!
category: dev
redirect_from: /dev/2018/hello-macos.html
---

I threw together this post on macOS basics for my dad a few years back when he
got his first MacBook. Copying it here in case it helps anyone else, or if I
ever need to share again.

## Basics

Sleep, as in standby mode when you close the lid, works really well on macOS.
I haven't tried on Windows since XP, but I remember it being really buggy. If
you're not in the habit of using Sleep then you should feel free to do it with
a Mac. Mine stay on all the time unless I'm on vacation, and I just let them
sleep when I'm not using them.

A lot of the Windows keyboard shortcuts work here if you swap out `Ctrl` for
`Command`:

- Copy: `Command-c`
- Paste: `Command-v`
- Cut: `Command-x`
- Switch app: `Command-Tab` (or `Command-Shift-Tab` to switch backwards)
- Send to Printer: `Command-p`

Some other ones I use a lot. These work in pretty much every app:

- <code>Command-`</code>: When an app has multiple windows open, this will
  cycle between them. 
- `Ctrl-a`: Go to beginning of the line you're typing on. Like the Home button
  in Windows. This one also works on the Raspberry Pi terminal. You can
  remember "beginning of line" by "A" being the first char of the alphabet.
- `Ctrl-e`: Go to end of the line you're typing on. Like the End button in
  Windows. Also works on the Raspberry Pi terminal. Remember "e" for "end" of
  line"
- `Command-Delete`: When typing, this will delete all of the text to the left
  of your cursor. 
- `Option-Delete`: When typing, this will delete the word to the left of your
  cursor.
- `Command-l`: In Safari/Chrome/FireFox, this will highlight the address bar
  so you can type an address quickly. For example, I'll do `Command-l`, type
  `google.com`, then press `return`.
- `Command-n`: In Safari, Finder, Terminal, many others, this will open a new
  window or document. Like `Ctrl-n` in many Windows apps.
- `Command-Shift-4`: Lets you create a screenshot. You'll see your mouse
  change to a cross-hair and you can drag a rectangle around what you want to
  capture. It creates a file on your Desktop. If you wanted to capture a
  specific window, instead of dragging around it, hover with the cross-hairs
  still active and press `Spacebar`.
- `Command-Ctrl-Shift-4`: Like above, but it sends the screenshot to your
  clipboard so you can `Command-v` it. This one won't save the file on your
  desktop.
- `Command-Shift-5`: An "interactive" screenshot tool. This is pretty similar
  to making a screenshot on your phone.

Mac specific:

- `Command-<SpaceBar>`: Opens Spotlight. You can type in the name of an app
  you want to open, or use it as a calculator, and a ton more. You can also
  open Spotlight by clicking on the magnifying glass icon on the upper right
  corner of the screen.
- `Command-w`: close the current window. **Unlike Windows** the application
  _usually_ remains open when you close the Window.
- `Command-q`: will quit the application entirely.
- `Command-Shift-[`, `Command-Shift-Left`: With apps that have tabs, like
  Safari or Terminal, move to the previous tab.
- `Command-Shift-]`, `Command-Shift-Right`: Same as above, but next tab.

Make sure to also check out System Preferences > Trackpad and watch the videos
there. You can change some of the gestures as well. 

## Browsing Files

You browse files using Finder. This is the equivalent of Windows Explorer or
whatever it's called these days.

The filesystem is Linux based like the Raspberry Pi. You don't get
`C:\Documents`, `D:\Blah`, etc. Everything is based out of `/`. 

Your home directory is `/Users/bob` (or whatever your username is).

USB drives, SD cards, etc get mounted at `/Volumes/`.

Inside the Finder, ff you know what folder you want to go to, instead of
clicking though, Inside the Finder you can press `Command-Shift-G` to open a
dialog window where you can specify a folder to open

If you're inside the Finder and want to go to a specific directory, you can
press `Command-Shift-G` to enter it. You can also just click through the
folders.

If you have a file selected in Finder, press `Spacebar` to open a "Quicklook"
preview. 

## Installing Applications

There are three main ways you'll install applications:

- **Mac App Store**: These apps are tied to your iTunes account, app store is
  pretty self-explanatory. Just like your on phone really.
- **Downloaded File**: Sometimes you'll download a file (usually a `.dmg` or
  `.zip`, or a `.pkg`). `.dmg` and `.zip` files will show you a single file
  for the application. You will need to drag that icon into your
  `/Applications` folder. If you just click on it from your Downloads folder,
  it will run but is **not considered installed until you drag it to
  Applications**. Most apps will open Finder for you and show an icon for the
  app itself, and an Applications directory you can drag it to. If not, you
  can drag it to "Applications" on the Finder's left sidebar. `.pkg` files are
  sort of like Windows installers, you should just need to run through the
  steps it tells you.
- **Homebrew**: Homebrew is an open source library that lets you install
  developer tools. It is like `apt-get` on the Raspberry Pi. You will run
  commands in the terminal for this, like `brew update` and `brew install
  python`. 

## iCloud apps

- Photos: If you use iCloud with your phone photos, they will appear in this
  app. You can also hook up a digital camera and extract them.
- Notes: Just like on your phone. 
- iCal: Just like on your phone. 
- Mail: Just like on your phone.
- Contacts: Just like on your phone.
- Reminders: Just like on your phone.
- Messages: Just like on your phone. It should ask you when you run it if you
  want to enable SMS. If you do that and people message you from SMS instead
  of iCloud, you can receive and respond from your computer.
- iBooks: Just like on your phone. One nice thing, is you can drag `.epub`
  files into it and they will upload to iCloud if you have space. Way easier
  than sending to your phone.

For your Microsoft accounts, you should be able to go to System Preferences >
Internet Accounts and use Exchange. That would let you access your Office
Calendar and Mail for example.

## Apps that come with the Mac

- QuickTime: Plays _some_ media files. You might want VLC (see below)
- TextEdit: Notepad/Wordpad equivalent for Mac.
- Terminal: This is in `/Applications/Utilities`. Like Powershell or the
  Raspberry Pi's terminal
- Dictionary: A dictionary lol 
- Digital Color Meter: In `/Applications/Utilities`, shows you RGB colors for
  any pixel on the screen.
- Console: In `/Applications/Utilities`, this will show you any error logs.
  Useful if an app is crashing, it might help you find why.
- Activity Monitor: in `/Applications/Utilities`, this is similar to the
  Windows Task Manager. Shows you processes running and you can kill them.

## Apps to get

- The Unarchiver (Mac App Store): Gives you support for archive files you
  might stumble on like `.rar`. They're all similar to `.zip` files just use
  different programs and algorithms to compress. This app handles most of them
  you'll see.
- AppCleaner (<https://freemacsoft.net/appcleaner/>): Use this to uninstall
  applications when you don't want them anymore. There are almost always extra
  files created as you use an app aside from the one you installed in your
  Applications directory. This app will find them.
- Pages (Mac App Store): This is the Mac version of Microsoft Word. You can
  usually open Word documents with it, but sometimes they don't display
  correctly. Same with exporting as a Word document. If you use Word a lot,
  you might need to try that instead.
- Numbers (Mac App Store): The Mac version of Microsoft Excel. If you get
  crazy with Excel you'll probably want to just stick with the Microsoft
  version, but Numbers is good for occasional stuff.
- Amphetamine (Mac App Store): This app will sit in your top-right menubar. It
  prevents your screen from sleeping. 
- VLC (<https://www.videolan.org/vlc/index.html>): Media player that will play
  any file you can throw at it. This also exists for Windows if you end up
  liking it. 

## Printing & Scanning

**Printing**: Go to System Preferences > Printers and Scanners and try adding
one. A lot of times you don't need a driver or macOS will download it for you.
Otherwise check the vendor's website for a macOS Mojave driver. macOS High
Sierra _might_ work, but is last year's version.

**Print to PDF**: In _any_ app that supports printing, when you press
`Command-p`, there will be an option in the lower left of the print screen
that says "PDF". This will create a PDF file for you that you can use. This is
a great way to send a Pages document to someone on Windows where you know
it'll look right.

**Scanning**: It will really depend on your scanner. You'll probably need a
driver from the vendor. Then you'll use the Preview application to connect to
the scanner. If you can't find good steps on how to do that with your specific
scanner, give me a shout and we can walk through it. 

## Troubleshooting

**Application won't quit**: You can hold option and right click on the app in
your Dock. You should see "Force Quit". This can also be done from the
Activity Monitor App.
