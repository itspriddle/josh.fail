---
title: "My Vim Setup"
date: "Wed Jul 19 01:47:18 -0400 2017"
category: dev
redirect_from:
- /blog/2017/my-vim-setup.html
- /dev/2017/my-vim-setup.html
---

This is my Vim config. There are many like it, but this one is mine.

## Overview

I intend for this post to be a living document that outlines my Vim setup so I
can easily share new tips and tricks with my coworkers. Hopefully I don't let
it fall too far out of date :trollface:.

My config is highly personalized, and yours should be too! You should use this
post and the [vim directory][] in my [dotfiles][] to learn and find ideas ---
not as a starting point for a new Vim setup.

I'm adverse to change, so I use [Vim 8][] over [Neovim][]. Neovim has changed
too much too quickly for my tastes and the community seems a bit hostile, at
least on [Reddit][Reddit Vim].

I also like defaults, so I use Terminal.app on macOS over iTerm. I've thought
about switching to iTerm for better color support, but I haven't found a new
theme that's made it worth making the change.

[vim directory]: https://github.com/itspriddle/dotfiles/tree/e11769a/vim
[dotfiles]: https://github.com/itspriddle/dotfiles
[Vim 8]: http://www.vim.org
[Neovim]: https://neovim.io
[Reddit Vim]: https://www.reddit.com/r/vim/

## Installation

I use [Homebrew][] to install Vim. One thing I don't like about the default
formula is that it installs a Homebrew version of Ruby. I manage my own Ruby
environment, so I use a [hacked version][My Vim Formula] of their formula to
allow me to build Vim using a custom Ruby.

It is installed with `brew install itspriddle/brews/vim`. Updates come in
automatically with `brew update`, and upgrades happen as normal with `brew
upgrade [vim]`.

[Homebrew]: https://brew.sh/
[My Vim Formula]: https://github.com/itspriddle/homebrew-brews/blob/master/Formula/vim.rb

## ~/.vim/vimrc

I kept all of my settings in `~/.vim/vimrc` for a long time. I felt it got
unwieldy, so I split it into multiple files to try to organize things better.

My [actual `~/.vim/vimrc`][vimrc] is mostly bare because I've split the
configuration into multiple files. It just loads the main files I've created
under `~/.vim/config/` --- which I'll outline below.

[vimrc]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/vimrc


## ~/.vim/config/maps.vim --- Maps

I keep non-plugin specific maps in a separate file --- [maps.vim][]. My
favorites:

- `noremap <space> :` remaps the spacebar key to `:`, letting you start a
colon command with your left or right thumb instead of your right pinky.
- ``nnoremap gV `[v`]``: Visually selects the text that was last edited. I
often use this when I paste a block of code and want to re-indent it.
- `vnoremap <C-q> gq`: Formats the selected paragraph. I use this daily when
writing documentation inside code or writing Markdown files. The main effect
for me is to format paragraphs to be 78 columns wide, though other items from
`'formatoptions'` apply. `nnoremap <C-q> gqap` and `inoremap <C-q> <C-o>gqap`
do the same in normal and insert modes.

[maps.vim]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/maps.vim

## ~/.vim/config/settings-core.vim --- Core Settings

I keep "core settings", like my selected colorscheme and other `set ...`
settings, in a separate file --- [settings-core.vim][]. Most of these are
standard fare, but I'll mention a few favorites.

If you want to print to paper from Vim (`:help hardcopy`), make sure to check
out the [printer settings][]. I don't encounter such settings in the wild
often, so either people are unaware they can print from Vim, or they are just
accepting default values. As an aside, even if you don't want to print to
_paper_, you can still generate a `.ps` file for conversion to `.pdf`.

Undo persistence (`:help undo-persistence`) is a great feature that lets you
use `u` to undo changes after closing a file. It can be enabled with [these
settings][undo settings].

[These settings][general settings] cleanup some of the messages that Vim
displays when starting up, completing files, and entering insert mode.

I like 2 spaces instead of tabs, 78 character lines, and no line wrapping ---
[these settings][tab settings] enable that behavior.

When using `J` to join sentences, Vim will add two spaces after a period.
[These settings][join settings] make it use just a single space. I'm not using
a typewriter after all.

Some special characters are used to show "invisibles", like hard-tabs,
trailing whitespace, and soft line wrapping --- enabled by [these
settings][invisibles settings].

[settings-core.vim]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-core.vim
[printer settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-core.vim#L157-L177
[undo settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-core.vim#L113-L117
[general settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-core.vim#L23-L30
[tab settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-core.vim#L39-L55
[join settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-core.vim#L57-L58
[invisibles settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-core.vim#L60-L64

## ~/.vim/config/settings-plugins.vim --- Plugin Settings

I keep plugin specific settings in a separate file ---
[settings-plugins.vim][]. I won't go into these here, the important parts are
outlined below with their corresponding plugins.

[settings-plugins.vim]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-plugins.vim

## ~/.vim/config/plug.vim --- Plugins

I use [vim-plug][] to manage my plugins. I follow the recommended setup and
keep a full copy of the plugin in `autoload/plug.vim`. I periodically run
`:PlugUpgrade` and commit the updated `autoload/plug.vim`.

My plugins are specified in [plug.vim][My Plugins]. Settings specific to those
plugins are kept in [settings-plugins.vim][].

This is a big list, but that doesn't mean you should jump to install 50
plugins yourself. Understand the shortcomings a plugin aims to solve before
you decide if you need to install it. The plugins I use all enhance Vim in a
useful way for my work, and when they no longer do, I'll uninstall them. Take
the effort to learn how to work with a default Vim installation --- it can be
invaluable when setting up servers or VMs via `ssh`.

Notable plugins and their configs are outlined below.

[vim-plug]: https://github.com/junegunn/vim-plug
[My Plugins]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/plug.vim

### Core Plugins

These "core" plugins are general ones that enhance Vim itself.

[vim-colors-solarized][]: Solarized Dark is my preferred colorscheme, and has
been for 6 years. I occasionally switch to Solarized Light.

[vim-sensible][]: Sensible/minimal default config. Everyone should use this,
and it is a great configuration for barebones or embedded systems.

[vim-unimpaired][]: Handy pairs of maps, `cob` to toggle `'bg'` from light to
dark, `cos` to toggle `:set spell`, `col` to toggle `:set list`, `cow` to
toggle `:set wrap`, etc. `[b` and `]b` to navigate open buffers, and `[q` and
`]q` to navigate to Quickfix lines. `yo` is shorthand for `:set paste`, `o`,
`:set nopaste`. I've also [mapped][vim-unimpaired settings] `yp` to to the
same in the current line --- these are super useful.

[vim-scriptease][]: Provides some helpers for working with Vimscript. I
primarily use the `:Vedit` and similar commands to quickly open Vim plugin
files when I have an idea or need to troubleshoot.

[lightline.vim][]: A lightweight alternative to Powerline --- in pure
Vimscript. Works out of the box with Solarized and other popular themes. I use
[these customizations][lightline.vim settings] to change colors when switching
from light to dark (via unimpaired's `cob`, or `:set bg=<dark|light>` and to
assign a custom filename in Quickfix windows.

[QFEnter.vim][]: Maps to open files in the Quickfix window in splits, vsplits,
etc. These are included in ack.vim and older versions of ag.vim (which I do
not use).

[vim-altscreen][]: Keeps the terminal clean when using `:!` commands.

[vim-togglecursor][]: Changes the cursor to a blinking `|` in insert mode, and
a blinking `_` in replace mode. Works great with Vim 8 and Terminal.app.

[simple-url-browse][]: This plugin overrides `gx` from NetRW to open URLs
under the cursor. The NetRW version breaks on URLs with "#" or "?" characters
in them.

[simple-qf-toggle][]: Provides `<Plugin>` maps to open and close the Quickfix
and Location List windows. I [map these][simple-qf-toggle settings] to `coq`
for the Quickfix List and `coQ` for the Location List.

[vim-colors-solarized]: https://github.com/altercation/vim-colors-solarized
[vim-sensible]: https://github.com/tpope/vim-sensible
[vim-unimpaired]: https://github.com/tpope/vim-unimpaired
[vim-unimpaired settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-plugins.vim#L188-L193
[vim-scriptease]: https://github.com/tpope/vim-scriptease
[lightline.vim]: https://github.com/itchyny/lightline.vim
[lightline.vim settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/plugin/lightline.vim
[QFEnter.vim]: https://github.com/yssl/QFEnter
[vim-altscreen]: https://github.com/fcpg/vim-altscreen
[vim-togglecursor]: https://github.com/jszakmeister/vim-togglecursor
[simple-url-browse]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/plugin/simple-url-browse.vim
[simple-qf-toggle]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/plugin/simple-qf-toggle.vim
[simple-qf-toggle settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-plugins.vim#L49-L55

### Unix Plugins

These plugins bring some frequently used Unix tools and behaviors to Vim.

[vim-eunuch][]: Vim commands for common Unix utilities. `:Chmod`, `:Move` and
friends. New files with shebangs are automatically set executable.
`:SudoWrite` is fantastic when you forget to `sudo vim`.

[vim-rsi][]: Gives you Readline keybindings, like `<C-a>` and `<C-e>` in
command mode to go to the start and end of the line.

[vim-eunuch]: https://github.com/tpope/vim-eunuch
[vim-rsi]: https://github.com/tpope/vim-rsi

### Editing Plugins

These plugins enhance the editing experience in Vim.

[simple-tab][]: A mini plugin that maps `<Tab>` to `<C-p>` and `<S-Tab>` to
`<C-n>` to complete words in the open file. I've tried SuperTab and other
alternatives in the past and found I don't need most of their features. You
might not like this one unless you're a minimalist.

[splitjoin.vim][]: Simplifies the transition between multiline and single-line
code. In Ruby, press `gS` on `puts hi if true` or `{ key: val, key2: val }` to
split them into multiline statements, or `gJ` to convert the multiline version
into the single-line one.

[vim-easy-align][]: Plugin to help align code. I have [several
maps][vim-easy-align settings] that cover most of my usage (like aligning hash
keys on `:`, or aligning multiple lines of method calls on `,`). I use these
daily to align code, typically I visually select a block and then use
`<leader>a=`, `<leader>a,`, or `<leader>a:`.

[vim-abolish][]: Abolish helps work with "word variants". I use the coercion
commands the most: `crs` in `SomeClass` converts it to `some_class`, or `cr-`
in `some_class` converts it to `some-class`.

[vim-characterize][]: This plugin lets you press `ga` on a UTF character to
see the character code. Very rarely used, but useful when I need it (and
remember to use it).

[vim-commentary][]: A lightweight plugin to comment code based on Vim's
`'commentstring'` setting. I use the `gcc` normal mode map and `gc` in visual
mode to toggle comments.

[vim-endwise][]: Smartly adds method endings when typing. Eg: `def foo<cr>`
will add an `end` automatically. Includes multi-language support.

[vim-repeat][]: This is a utility plugin that _other_ plugins use (like
[splitjoin.vim][], [vim-easy-align][]). It allows you to use `.` to repeat
plugin commands.

[vim-speeddating][]: Allows incrementing/decrementing dates using `<C-a>` and
`<C-x>` just like numbers. (Did you know `<C-a>` and `<C-x>` increment and
decrement numbers out of the box?)

[vim-surround][]: Helps work with surrounding characters. For example, in
`"foobar"`, press `cs"'` to **c**hange **s**urrounding from **"** to **'**;
`[blah]`, `cs[{` changes it to `{blah}`. I use this almost daily.

[vim-stripper][]: Automatically strips trailing whitespace when saving
buffers. Files can be excluded, like Markdown, where trailing whitespace is
significant. Includes a `:Stripper` command to manually strip trailing
whitespace.

[simple-tab]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/plugin/simple-tab.vim
[splitjoin.vim]: https://github.com/AndrewRadev/splitjoin.vim
[vim-easy-align]: https://github.com/junegunn/vim-easy-align
[vim-easy-align settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-plugins.vim#L84-L116
[vim-abolish]: https://github.com/tpope/vim-abolish
[vim-characterize]: https://github.com/tpope/vim-characterize
[vim-commentary]: https://github.com/tpope/vim-commentary
[vim-endwise]: https://github.com/tpope/vim-endwise
[vim-repeat]: https://github.com/tpope/vim-repeat
[vim-speeddating]: https://github.com/tpope/vim-speeddating
[vim-surround]: https://github.com/tpope/vim-surround
[vim-stripper]: https://github.com/itspriddle/vim-stripper

### File Browsing & Searching Plugins

These plugins help jump to files. I use a variety of these, and plain `:e
path/to/file` depending on the context and my mood.

[vim-filebeagle][]: Lightweight file browser, somewhere between `:Explore` and
`:NERDtree`. I like `-` to call the browser, so I have [these
settings][vim-filebeagle settings] in place. Press `-` from a buffer to see
the parent directory, you can navigate around to open a new file with `<cr>`
or create files with `+`. You can even create directories by pressing `+` in
the FileBeagle browser and specifying a path ending in a `/` (eg: `foo/bar/`).

[fzf.vim][]: I use the built in Vim plugin for [fzf][] (_not_ the
fuller-featured [plugin][fzf.vim full]). I have a few custom [helpers][fzf
helpers] and [settings][fzf settings]: `:FZFBuffers` allows searching open
buffers and `:FZFMRU` allows searching most recently used files.

[vim-gutentags][]: Automatic ctags integration. I prefer to keep my tags files
under `.git`, and I have some [Gutentags customizations][vim-gutentags
settings] and [Vim customizations][Vim tags settings] in place to accommodate
that.

[simple-ag][]: I use [the_silver_searcher][] as a fast replacement for `grep`.
I've used ack.vim and ag.vim in the past to integrate it with Vim, but I find
I don't use many of their features. For that reason, I've implemented a simple
version that covers all of my needs. `:Ag` searches for the current word under
the cursor and opens the results in the Quickfix list --- `:LAg` does the same
but places results in the Location List. `:Ag <query>` and `:LAg <query>`
search for specific queries and allow options to be passed to `ag`, eg: `:Ag
-Q 'foo bar'`. If you use this, you probably want [QFEnter.vim][], which I
outlined above. Note that I wrote this over configuring `'grepprg'` because
I've not found a good way to silently run `:grep`.

[vim-filebeagle]: https://github.com/jeetsukumaran/vim-filebeagle
[vim-filebeagle settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-plugins.vim#L128-L133
[fzf.vim full]: https://github.com/junegunn/fzf.vim
[fzf.vim]: https://github.com/junegunn/fzf/blob/master/plugin/fzf.vim
[fzf]: https://github.com/junegunn/fzf
[fzf settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-plugins.vim#L7-L20
[fzf helpers]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/plugin/fzf-helpers.vim
[vim-gutentags]: https://github.com/ludovicchabant/vim-gutentags
[vim-gutentags settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-plugins.vim#L135-L149
[Vim tags settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-core.vim#L32-L33
[simple-ag]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/plugin/simple-ag.vim
[the_silver_searcher]: https://github.com/ggreer/the_silver_searcher

### Git & GitHub Integration

I use Git and GitHub almost daily. These plugins help working with commit
messages and browsing code on GitHub.

[vim-git][]: Provides basic git integration for things like editing commit
messages or rebasing. I have a few customizations in place for [commit
messages][vim-git gitcommit settings]. For rebasing (eg `git rebase -i`),
those same settings are included, and some [handy maps][vim-git gitrebase
settings] are implemented to quickly change a line to "pick", "squash", etc.

[vim-fugitive][]: Provides a lot more integration with Git. Some favorites are
`:Gstatus` and `:Gwrite` to stage things, and `:Gcommit` to commit, all from
Vim.

[vim-rhubarb][]: Provides GitHub integration. I only use `:Gbrowse` --- it is
a great way to browse and share code with coworkers. Use `V` to make a visual
selection and `:Gbrowse -` will open GitHub with those lines selected. Call
`:Gbrowse!` to copy the URL to the clipboard.

[simple-gist][]: Is a small plugin I made that allows posting buffers/lines to
GitHub Gist --- basically a slightly smarter version of `:w !gist`. There are
other more robust plugins out there if you want to _manage_ Gists from Vim,
but I only need to _create_ them.

Finally, I have an [autocmd][GitHub Issues autocmd] in place to update GitHub
URLs to use the shorthand syntax, eg: "https://github.com/foo/bar/issue/1"
becomes "foo/bar#1" when saving git commit or pull request messages.

[vim-git]: https://github.com/tpope/vim-git
[vim-git gitrebase settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/after/ftplugin/gitrebase.vim
[vim-git gitcommit settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/after/ftplugin/gitcommit.vim
[vim-fugitive]: https://github.com/tpope/vim-fugitive
[vim-rhubarb]: https://github.com/tpope/vim-rhubarb
[simple-gist]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/plugin/simple-gist.vim
[GitHub Gist]: https://gist.github.com
[GitHub Issues autocmd]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/after/plugin/git.vim#L21-L33

### Ruby on Rails

Ruby on Rails makes up the bulk of my day to day work. I have a bunch of
plugins and customizations to help.

[vim-rails][]: This plugin is an absolute must have if you work with Rails
projects in Vim --- and the one in this list I couldn't live without. I use
the file browsing maps daily, `:Emodel` to open a model, `:Econtroller` to
open a controller, `:AS` to open an alternate file in a split. Using
[vim-projectionist][] I have defined [several others][vim-rails projections],
like `:Eseed` to open `db/seeds.rb` and `:Efactory` to open factories under
`spec/factories/`. It also provides enhanced syntax highlighting for Rails
specific classes and methods.

[vim-ruby][]: Provides Ruby syntax and indentation. I use this version over
the one shipped with Vim itself because it is often more up to date. I have a
few [customizations and maps][vim-ruby settings] setup, including `<leader>d`
to run the current test file and `<leader>D` to run the current test line via
vim-test.

[vim-test][]: A test runner (works for RSpec, MiniTest, lots of others).
Errors are sent to the Quickfix list so you can navigate to offending tests
easily. On Vim 8 I use [vim-dispatch][] as the test strategy. Should work out
of the box with Neovim. I test mostly with Ruby. My [vim-test settings][]
enable Ruby test runners and enable Dispatch as the runner.

[vim-rake][]: Provides Rake integration for non-Rails projects. I mostly use
this for the `:Elib` helper to browse files under `lib/`, though I
occasionally use `:Rake`.

[vim-bundler][]: Provides Bundler integration. I've seen performance hits in
the past with this, so I've installed and uninstalled it about 5 times. I'm
trying it again :smile:.

[vim-haml][]: Provides syntax highlighting for HAML and SASS.

[vim-ruby-minitest][]: Provides syntax highlighting for Minitest files.

[vim-coffee-script][]: Provides syntax highlighting for CoffeeScript files.

[vim-rails]: https://github.com/tpope/vim-rails
[vim-rails projections]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/after/plugin/rails.vim
[vim-ruby]: https://github.com/vim-ruby/vim-ruby
[vim-ruby settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/plugged/supplemental/after/ftplugin/ruby.vim
[vim-test]: https://github.com/janko-m/vim-test
[vim-test settings]: https://github.com/itspriddle/dotfiles/blob/e11769a/vim/config/settings-plugins.vim#L178-L186
[vim-dispatch]: https://github.com/tpope/vim-dispatch
[vim-rake]: https://github.com/tpope/vim-rake
[vim-bundler]: https://github.com/tpope/vim-bundler
[vim-haml]: https://github.com/tpope/vim-haml
[vim-ruby-minitest]: https://github.com/sunaku/vim-ruby-minitest
[vim-coffee-script]: https://github.com/kchmck/vim-coffee-script
[vim-projectionist]: https://github.com/tpope/vim-projectionist

### Markdown, Liquid, and Jekyll

I write a ton of Markdown, for documentation at work and this blog. These
plugins help.

[vim-markdown][]: Provides Markdown syntax highlighting. This version is
sometimes more up to date than the one that ships with Vim itself.

[vim-marked][]: Integrates [Marked][] --- a Markdown viewer for macOS --- with
Vim. It provides `:MarkedOpen`, `:MarkedClose`, and `MarkedToggle` to handle
launching Marked with the current Markdown buffers loaded.

[vim-liquid][]: Provides enhanced Markdown syntax highlighting for Liquid.
Liquid is used in Jekyll/GitHub Pages, and I use it in some work projects.

[vim-jekyll][]: Provides Jekyll integration. I use this to manage posts on
this blog.

[vim-markdown]: https://github.com/tpope/vim-markdown
[vim-marked]: https://github.com/itspriddle/vim-marked
[Marked]: http://marked2app.com
[vim-liquid]: https://github.com/tpope/vim-liquid
[vim-jekyll]: https://github.com/itspriddle/vim-jekyll

### Other Syntax Plugins

Other syntax plugins I use:

[nginx.vim][]: Provides syntax highlighting for Nginx config files.

[ansible-vim][]: Provides syntax highlighting for Ansible config files.

[vim-crystal][]: Provides syntax highlighting for Crystal Language files.

[vim-css3-syntax][]: Provides extended syntax highlighting for CSS3 selectors
and attributes.

[html5.vim][]: Provides extended syntax highlighting for HTML5 tags and
attributes.

[vim-javascript-indent][]: Provides improved indentation in JavaScript files.

[vim-jquery][]: Provides syntax highlighting for jQuery functions.

[vim-bats][]: Provides syntax highlighting for Bats test files.

[vim-applescript][]: Provides syntax highlighting for AppleScript files.

[nginx.vim]: https://github.com/chr4/nginx.vim
[ansible-vim]: https://github.com/pearofducks/ansible-vim
[vim-crystal]: https://github.com/rhysd/vim-crystal
[vim-css3-syntax]: https://github.com/hail2u/vim-css3-syntax
[html5.vim]: https://github.com/othree/html5.vim
[vim-javascript-indent]: https://github.com/itspriddle/vim-javascript-indent
[vim-jquery]: https://github.com/itspriddle/vim-jquery
[vim-bats]: https://github.com/markcornick/vim-bats
[vim-applescript]: https://github.com/itspriddle/applescript.vim


### Supplemental

Since I'm using a package manager, I try to avoid random entries in
`~/.vim/plugin` and friends. I keep a "plugin" of my own I call
[supplemental][] under `~/.vim/plugged/supplemental`. It includes mini plugins
and other customizations. There are quite a few goodies in here if you look
around, some of which, the "simple" plugins, have been covered above.

[supplemental]: https://github.com/itspriddle/dotfiles/tree/e11769a/vim/plugged/supplemental
