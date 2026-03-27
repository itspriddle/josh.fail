---
title: "Using Direnv to set Herd PHP versions"
date: "Fri Oct 03 21:10:30 -0400 2025"
link: https://builtfast.dev/blog/using-direnv-to-set-herd-php-versions/
category: dev
---

I write an article for [BuiltFast.dev][1] about how I manage [Herd][2] PHP
versions using [Direnv][3].

---

I love the simplicity of [Herd][2] for using PHP on my Macs. One thing that
is slightly annoying is that you have to use Herd specific commands to make
sure you get the right PHP version for each project. Here's a way you can use
[Direnv][3] to set the version automatically when you `cd` into a project.

"But wait, why does that matter, Josh? I ran `herd use 8.3` once, isn't that
enough?". Well I'm glad you asked.

If you follow Herd's docs, and use `herd php`, `herd composer`, etc, then it
works. But if you just run `php`, `composer`, or any other PHP based tool,
you'll get whatever version is set as the global default. This can lead to
some confusion if you have multiple projects using different PHP versions. You
you run `./vendor/bin/pest` you might get a different version of PHP than
`composer exec pest` or `herd php ./vendor/bin/pest`. That might not be an
issue immediately, but tools like Pint and PHPStan behave differently
depending on the PHP version.

Before we get into Direnv, let's talk about `PATH`. On macOS, or any Linux
system, when you run a command like `php`, the system looks through the
directories listed in the `PATH` environment variable, in order, to find an
executable file named `php`. The first one it finds is the one that gets run.

Standard paths on macOS include `/usr/bin`, `/bin`, `/usr/sbin`, `/sbin`, and
for Homebrew installs, `/opt/homebrew/bin` and `/opt/homebrew/sbin`. Herd adds
its own binaries in `~/Library/Application Support/Herd/bin`. This is how
running `php` with Herd installed knows to use their version (assuming you
don't have a Homebrew PHP version installed).

So, knowing how `PATH` works, we can use Direnv to modify it when we enter a
project directory. Direnv allows you to create a `.envrc` file in your project
directory. This file can contain shell commands that are executed when you
enter the directory. We can use this to add the appropriate Herd PHP version
to the front of our `PATH`.

A minor complication is that `PATH` needs a _directory_, and not a specific
file. Herd keeps it's PHP binaries as files like `php81`, `php82`, `php83`,
etc. So we need to work around that some how. We need to create a "shim"
directory that contains the version number and then a `php` file inside of it
that points to the right Herd binary.

Before we can do that, we need to create a function that Direnv can use to set
the right PHP version. You can put this function in your `~/.direnvrc` file so
it's available to all your projects. I'll explain inline what each part does.

```bash
# Sets PATH for Herd PHP versions.
#
# Usage in .envrc:
#
#   use herd_php [system]
#   use herd_php 8.3
use_herd_php() {
  # Path where Herd support files are installed
  local herd_dir="$HOME/Library/Application Support/Herd"

  # If the Herd directory doesn't exist, log an error and exit. This means
  # Herd is not installed.
  if [[ ! -d "$herd_dir" ]]; then
    log_error "Herd not found"
    return 1
  fi

  # Get the version argument passed to the function, if one was passed.
  local version="${1-}"

  # Directory where we will create shims for Herd PHP versions
  local shim_dir="$HOME/.local/share/herd"

  # If no version was passed, check for a .php-version file in the current
  # directory. If it exists, read the version from there.
  if [[ -z "$version" ]] && [[ -f .php-version ]]; then
    version=$(< .php-version)
    log_status "Using PHP version from .php-version: $version"
  fi

  # Initialize an empty variable to hold the version number without dots
  local number

  # Here, we convert version numbers like 8.3.1, 8.3.29, 8.3, to 83.
  #
  # If the version looks like major.minor.patch (i.e. 8.1.3)
  if [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    # delete after the last dot
    version="${version%.*}"

    # remove the dot
    number="${version/./}"
  # If it instead looks like a major.minor version
  elif [[ "$version" =~ ^[0-9]+\.[0-9]+$ ]]; then
    # remote the dot
    number="${version/./}"
  # If it instead is "system", "default", or empty
  elif [[ "$version" =~ ^(system|default)$ ]] || [[ -z "$version" ]]; then
    version="default"
    number=""
  # We found an invalid or unsupported version, log en error and exit
  else
    log_error "Invalid PHP version '$version'"
    log_error "Use 'system', 'default' or a version like '8.3' or '8.3.1'"

    return 1
  fi

  # Get path to relevant Herd PHP binary
  local target_bin="$herd_dir/bin/php${number}"

  # If the file is not executable (it probably doesn't exist). Log an error
  # and suggest some valid versions to use.
  if [[ ! -x "$target_bin" ]]; then
    log_error "Herd PHP $version binary '$target_bin' not found"
    log_error "Try one of these .envrc configurations:"
    log_error
    log_error "- use_herd_php system (Herd default configured version)"

    local suggested

    # Loop through all files in the Herd bin directory
    for f in "$herd_dir"/bin/*; do
      # If the file name matches the pattern php[0-9]+ (eg: php81, php82)
      if [[ "${f##*/}" =~ ^php[0-9]+$ ]]; then
        # strip away everything before "php" and insert a dot after the first
        # character to convert php81 to 8.1, php83 to 8.3, etc.
        suggested="${f##*/php}"
        suggested="${suggested:0:1}.${suggested:1}"

        log_error "- use_herd_php $suggested"
      fi
    done

    return 1
  fi

  # Get path to the target shim file we will create
  local target_shim="$shim_dir/php$number/bin/php"

  # If the shim file doesn't already exist, create it
  if [[ ! -L "$target_shim" ]]; then
    log_status "Creating Herd PHP $version shim at ${target_shim/$HOME/\~}"

    # Make sure the target directory exists
    mkdir -p "${target_shim%/*}"

    # Link the Herd PHP binary to the shim location
    ln -s "$target_bin" "$target_shim"
  fi

  # Add the shim directory to the front of PATH
  PATH_add "$shim_dir/php$number/bin"

  # Add vendor/bin to PATH if it exists, so project specific tools are found
  if [[ -d vendor/bin ]]; then
    PATH_add vendor/bin
  fi

  log_status "using Herd PHP $version shim at ${target_shim/$HOME/\~}"
}
```

Then, in your `.envrc` file in the project root, you can use the function like
this:

```bash
use herd_php 8.3
```

Then another project might use:

```bash
use herd_php 8.4
```

Any time you `cd` into either one, Direnv will automatically set the right PHP
version for you. And when you run `php` it will use the correct version.

This isn't perfect. You do still need to configure Herd in each project to use
the PHP version that you want, so that PHP-FPM uses the correct version for
you. But in the CLI, this has been working great for me.

[1]: {{ page.link }}
[2]: https://herd.laravel.com/
[3]: https://github.com/direnv/direnv
