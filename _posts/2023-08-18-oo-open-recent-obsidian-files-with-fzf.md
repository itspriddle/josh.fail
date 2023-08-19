---
title: "oo - open recent Obsidian files with FZF"
date: "Fri Aug 18 20:42:47 -0400 2023"
category: dev
---

If you're a [fzf][1] and [Obsidian.md][2] user, you might like `oo` to open recent
Obsidian files using fzf.

This depends on the [recent-files-obsidian][3] plugin and [jq][4].

Save this somewhere in your `$PATH`, and then use `oo` to open your files.

```bash
#!/usr/bin/env bash
# Usage: oo
#
# NAME
#   oo - open recently viewed files in Obsidian
#
# SYNOPSIS
#   oo
#
# DESCRIPTION
#   oo uses fzf to display a list of files that Obsidian has recently
#   accessed. Requires jq and https://github.com/tgrosinger/recent-files-obsidian
#
#   Based on https://github.com/junegunn/fzf/wiki/Examples#v
#
# SEE ALSO
#   fzf(1), jq(1)

warn() {
  echo "$@" >&2
}

obsidian_root() {
  git rev-parse --show-toplevel
}

get_candidates() {
  jq -r ".recentFiles[] | .path" "$(obsidian_root)/.obsidian/plugins/recent-files-obsidian/data.json"
}

main() {
  local line size height file
  local -a candidates=()

  if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
    sed -ne '/^#/!q;s/^#$/# /;/^# /s/^# //p' < "$0" |
      awk -v f="${1//-/}" 'f == "h" && $1 == "Usage:" { print; exit }; f != "h"'
    return 1
  fi

  if ! type jq &> /dev/null; then
    warn "jq not found!"
    return 2
  elif ! type fzf-tmux &> /dev/null; then
    warn "fzf-tmux not found!"
    return 2
  fi

  while IFS=$'\n' read -r line; do
    candidates+=("$line")
  done < <(get_candidates)

  size=${#candidates[@]}

  if [[ $size -gt 0 ]]; then
    [[ $size -gt 20 ]] && size=20

    height=$((2 + size)) # 2 extra rows for FZF prompt

    file=$(printf "%s\\n" "${candidates[@]}" | fzf-tmux --no-sort --height "$height" --query "$*")

    if [[ "$file" ]]; then
      obsidian "$file"
    else
      return 1
    fi
  else
    >&2 echo "No recent files found!"
    exit 1
  fi
}

main "$@"
```

[1]: https://github.com/junegunn/fzf
[2]: https://obsidian.md/
[3]: https://github.com/tgrosinger/recent-files-obsidian
[4]: https://github.com/tgrosinger/recent-files-obsidian
[5]: https://github.com/jqlang/jq
