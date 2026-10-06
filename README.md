# Git co-author picker <!-- omit in toc -->

This is a CLI tool that helps you pick co-authors for your git commits.

- [Installation](#installation)
  - [Manual download](#manual-download)
  - [Updating and uninstalling](#updating-and-uninstalling)
- [How it works](#how-it-works)
- [Flags](#flags)
  - [Limit](#limit)
  - [Sorting](#sorting)
  - [Print](#print)
  - [Amend](#amend)

## Installation

`git-coauthors` is a single executable for macOS and Linux (x64 and arm64). It only needs `git`.

To install the latest release into `~/.local/bin`:

```sh
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m); [ "$ARCH" = x86_64 ] && ARCH=x64; [ "$ARCH" = aarch64 ] && ARCH=arm64
mkdir -p ~/.local/bin
curl -fsSL "https://github.com/marcmarina/git-coauthors/releases/latest/download/git-coauthors-$OS-$ARCH.tar.gz" | tar -xz -C ~/.local/bin
```

If `~/.local/bin` isn't on your `PATH`, add `export PATH="$HOME/.local/bin:$PATH"` to your shell profile. Then, inside any git repository:

```sh
git-coauthors
```

On Linux, copying to the clipboard needs `xsel` (X11) or `wl-clipboard` (Wayland) installed. Without them, use [`--print`](#print) to output the authors instead.

### Manual download

1. Download the `.tar.gz` for your system from the [latest release](https://github.com/marcmarina/git-coauthors/releases/latest). Archives are named `git-coauthors-<os>-<arch>.tar.gz`, e.g. `git-coauthors-darwin-arm64.tar.gz` for Apple Silicon Macs.
2. Optionally, check it against `checksums.txt` from the same release: `shasum -a 256 -c checksums.txt --ignore-missing`.
3. Extract it (`tar -xzf <archive>`) and move the `git-coauthors` executable into a folder on your `PATH`.

On macOS, a file downloaded through a browser is quarantined, and macOS will refuse to open it. To clear that:

```sh
xattr -d com.apple.quarantine git-coauthors
```

Files downloaded with `curl`, like the install command above, aren't quarantined.

### Updating and uninstalling

To update, run the install command again; it replaces the executable with the latest release.

To uninstall, delete the executable (e.g. `rm ~/.local/bin/git-coauthors`). Your picked authors are stored in `~/.git-coauthors`; delete that folder too to remove them.

## How it works

Whenever you run the `git-coauthors` command, it will generate a list of authors based on the log for the current repository.

All the authors you pick will be stored in a folder in your home directory, so they are put at the top of the list the next time you run it (unless you use [sorting](#sorting)).

## Flags

This section will go over the flags you can pass to the picker. To see a full list for your installed version you can run `git-coauthors pick -h`.

### Limit

The `-l, --limit <number>` flag will limit the number of commits that will be examined to generate the list of co-authors. This is useful for repositories with a very long history.

### Sorting

The `-s, --sort <field>` flag will sort the list of authors by one of the available fields: `name, email`.

The `-o, --order <direction>` flag just controls the sorting direction: `asc, desc`. Defaults to `asc`.

### Print

The `-p, --print` flag outputs the chosen authors to the console. This can be useful if for some reason the program can't manage to add them to your clipboard automatically.

### Amend

The `-a, --amend` flag adds the chosen authors as `Co-authored-by` trailers to the last commit in the current repository. It needs git 2.32 or later.

Only the commit message changes: anything you've staged stays staged and isn't added to the commit. Authors already in the commit's trailers aren't added again, so running it twice is safe; existing co-authors are never removed.
