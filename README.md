# Git co-author picker <!-- omit in toc -->

This is a CLI tool that helps you pick co-authors for your git commits.

- [How it works](#how-it-works)
- [Flags](#flags)
  - [Limit](#limit)
  - [Sorting](#sorting)
  - [Print](#print)
  - [Amend](#amend)

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

The `-a, --amend` flag will append the chosen authors to the last commit in the current repository.

> Note that if you run the command after having amended once, it won't replace the existing coauthors, it will just add new ones at the end.
