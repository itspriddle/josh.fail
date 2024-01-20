---
title: "macOS CLI Commands"
date: "Tue Jun 27 09:10:39 -0400 2023"
category: dev
link: https://saurabhs.org/advanced-macos-commands
---

I saw this list of [macOS CLI Commands][1]. I knew about most of these, and
use many like `pbcopy` and `pbpaste` often.

`sips` looks pretty neat---I've usually just whipped up quick Ruby scripts
with the `mini_magick` gem.

Hopefully people comment with a few more goodies in the [Hacker News
comments][2].

---

A few hours later, and here are more goodies:

```sh
# You can use sips together with iconutil to generate a complete .icns file
# for your app from a single 1024 by 1024 PNG without any third party software:
mkdir MyIcon.iconset
cp Icon1024.png MyIcon.iconset/icon_512x512@2x.png
sips -z 16 16     Icon1024.png --out MyIcon.iconset/icon_16x16.png
sips -z 32 32     Icon1024.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32 32     Icon1024.png --out MyIcon.iconset/icon_32x32.png
sips -z 64 64     Icon1024.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128   Icon1024.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256   Icon1024.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256   Icon1024.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512   Icon1024.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512   Icon1024.png --out MyIcon.iconset/icon_512x512.png
iconutil -c icns MyIcon.iconset

# Generate .ico with ffmpeg (not strictly macOS, but still neat)
ffmpeg -i MyIcon.iconset/icon_256x256.png icon.ico
```

Someone else mentioned the [`ditto`][3] command, which is a more advanced
version of `cp` for macOS. Seems like a great choice for merging directories.

`plutil` has a way to convert binary plist files to XML:

```sh
plutil -convert xml1 -o out.xml in.plist
```

`networkQuality` can show you the quality of your network connection, like
Speedtest CLI:

```
networkQuality
==== SUMMARY ====
Uplink capacity: 1.955 Mbps
Downlink capacity: 352.037 Mbps
Responsiveness: Low (100 RPM)
Idle Latency: 42.875 milliseconds
```

[1]: {{ page.link }}
[2]: https://news.ycombinator.com/item?id=36491704
[3]: https://osxdaily.com/2014/06/11/use-ditto-copy-files-directories-mac-command-line/
