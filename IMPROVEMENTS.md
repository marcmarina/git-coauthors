# Improvements

Tick items off as they're fixed.

## Bugs and correctness

- [ ] **`--amend` also commits anything you've staged.** `appendToLastCommit` runs `git commit --amend -m …`, which includes whatever is in the index, so staged changes quietly get folded into the last commit. Refuse when the index is dirty, or warn first.
- [ ] **Amending rebuilds the commit message instead of adding to it.** `getLastCommitMessage` (`src/helpers/git.ts`) glues together simple-git's `message` (`%s`) and `body` (`%b`):
  - A subject that wraps over several lines gets joined into one.
  - If the commit already has `Co-authored-by` trailers, the new ones land in a separate paragraph, so git no longer treats the old ones as trailers.
  - With no commits, `log.latest` is undefined, so the message becomes `"undefined\n\nundefined"`.

  Use `git commit --amend --no-edit --trailer "Co-authored-by: …"` (git ≥ 2.32), which appends correctly and skips duplicates.
- [ ] **`--amend` is passed in the wrong argument slot.** `amendLastCommit` passes it as simple-git's `files` argument, not `options`. It only works because both end up appended to the command. Fix along with the item above.
- [ ] **Exit codes are wrong.** "Not a git repository" calls `process.exit(0)`, and errors caught in `pickAuthors` are logged but the process still exits 0.
- [ ] **Errors go to stdout.** `logger.error` uses `console.log`; it should use `console.error`. `useUnknownInCatchVariables: false` is also what lets `logger.error(err)` typecheck with a non-string `err`.
- [ ] **`--print` doesn't work as the clipboard fallback the README describes.** `clipboardy.write` still runs after printing, so on Linux without xsel/wl-clipboard you get the output and then an error. Skip the clipboard when `-p` is set, or catch clipboard failures and print instead.

## Author list quality

- [ ] **Use `.mailmap` and a faster query.** Read the log with `%aN`/`%aE`, or `git shortlog -sne HEAD`, to respect `.mailmap` and avoid parsing every commit's full metadata. Commit counts would also allow ranking authors by activity.
- [ ] **Remove duplicate people.** `unique` compares `{name, email}` as a pair, so one email used with two name spellings shows up twice. Dedupe by email, case-insensitively.
- [ ] **Leave yourself out.** Filter out `git config user.email`, since you're already the commit author.
- [ ] **Recents from other repos show up everywhere.** `authors.json` is global and grows forever, and recents are added even if that person never committed to this repo. Only show recents that appear in this repo's log, cap the list, or both.
- [ ] **Validate stored recents.** `isAuthor`/`authorSchema` exist but `createJSONStore` doesn't use them, so a hand-edited or corrupt `authors.json` goes straight into the prompt.

## Small features

- [ ] A `--clear-recents` flag (or command). `recentAuthorService.clear()` already exists but nothing in the CLI calls it.
- [ ] A `--no-copy` flag, so `-p` can be used cleanly in scripts.

## Dependencies and tooling

- [ ] **Upgrade outdated dependencies:** commander 9 → 14, zod 3 → 4, ESLint 8 with `.eslintrc` → v9 flat config, husky 8 (`husky install` is deprecated), lint-staged 13, and `@types/node@16` (stale next to `@types/bun`).
- [ ] **Remove what's no longer needed:** `@types/commander` (an empty stub; commander ships its own types) and the unused `getCurrentDirName` in `src/utils/files.ts`.
- [ ] **Drop lodash.** It's only used for `sortBy`, `uniqWith`, `isEqual` and `flatten`, all easy to write inline.
- [ ] **Consider replacing `prompts`**, which hasn't seen much maintenance, with `@clack/prompts` or `@inquirer/prompts`.
- [ ] **Fix ESLint `env.browser: true`**, which is wrong for a CLI.

## Tests and release

- [ ] **Add a spec for `pick-authors.ts`.** It holds the whole flow and the amend/print/clipboard branching where most of the bugs above live. `prompt.ts` has no spec either.
- [ ] **Smoke-test the built binary in CI**, e.g. run `dist/build/linux-x64/git-coauthors --version`, to catch bundling problems in the compiled binary.
- [ ] **Easier distribution:** a Homebrew tap or an `install.sh` instead of the README's curl snippet.
