---
title: "Generate Password LaunchBar Action"
date: "Wed Feb 28 14:19:22 -0500 2018"
redirect_from: /blog/2018/generate-password-launchbar-action.html
---

I often need to generate random passwords when testing development work. To
help with that, I've created a [LaunchBar 6][] Action, [Generate
Password.lbaction][].

The Action makes use of a [Ruby implementation][keepass-password-generator
RubyGem] of the [KeePass Password Generator][]. Since macOS ships with Ruby,
no external dependencies are required. Just install and you're ready to go!

Grab "Generate.Password.zip" from the latest release at
<https://github.com/itspriddle/generate-password.lbaction/releases>. Unzip and
open "Generate Password.lbaction" to install it.

To generate a password, invoke LaunchBar and select "Generate Password". After
running the action, the newly generated password is copied to the system
clipboard.

By default, this Action will generate a 20 character password using
`L{9}d{9}s{2}` as the KeePass character set. This will generate a password
with 9 mixes-case letters, 9 digits, and 2 special characters.

To specify a different character set, press `Space` after selecting the Action
from LaunchBar and type in the desired character set, eg: `S{30}`.

See the project [README][Generate Password.lbaction] for full info.

[Generate Password.lbaction]: https://github.com/itspriddle/generate-password.lbaction
[LaunchBar 6]: https://www.obdev.at/products/launchbar/index.html
[KeePass Password Generator]: https://keepass.info/help/base/pwgenerator.html
[keepass-password-generator RubyGem]: https://github.com/johnbintz/keepass-password-generator
