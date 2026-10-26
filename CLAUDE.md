# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`git-coauthors` is a TypeScript CLI distributed as standalone binaries on GitHub Releases (not published to npm). It lists authors from the current repo's git log, lets the user multi-select some, and copies `Co-authored-by: Name <email>` trailers to the clipboard. It can also print them (`-p`) or append them to the last commit (`-a`). See README.md for the user-facing flags.

## Commands

The Bun version is pinned in `.tool-versions`. Use Bun for installing, running and testing.

- `bun run build` — build a standalone native binary at `dist/git-coauthors`
- `bun run package` — build every release target and package them as archives in `dist/release` (`scripts/package-release.sh`)
- `bun start` — run the CLI from source against the current directory (it must be a git repo)
- `bun run lint` — ESLint over `.ts` files
- `bun run typecheck` — `tsc` (no emit; Bun handles the build)
- `bun test` — `bun:test`; single file: `bun test src/helpers/git.spec.ts`; single test: `bun test -t "<test name>"`
- `bun run verify` — typecheck + lint + test; runs on the husky `pre-push` hook

The `pre-commit` hook runs lint-staged (`eslint --fix` + `prettier --write` on TS/JS, `sort-package-json` on package.json).

## Architecture

- `src/index.ts` — commander setup. A single `pick` command (the default) wires flags to `commands/pick-authors.ts`.
- `src/commands/pick-authors.ts` — the whole flow: verify cwd is a repo → ensure storage dir exists → validate options with zod → load recent authors → fetch/merge git authors → prompt → save picks as recents → print / amend / copy to clipboard. Errors are caught here and logged.
- `src/application/` — the `Author` domain type (zod schema) and `toCoauthor` formatting.
- `src/helpers/` — side-effecting integrations: `git.ts` (via `simple-git`), `prompt.ts` (`prompts` autocomplete multiselect), `recent-authors.ts` (recents service).
- `src/storage/` — `createJSONStore<T>(path, default)` is a generic file-backed JSON store that never throws (logs and falls back to the default). Data lives in `~/.git-coauthors/` (`STORAGE_DIR`); recents are a single global `authors.json`, not per repo.
- `src/utils/` — array helpers (`unique`, `combineUnique`, `sortBy`), file existence check, and `logger` (chalk-based).

Author ordering: when `--sort` is not given, recents are prepended to the log's authors and deduplicated, so recent picks float to the top. When `--sort` is given, recents are ignored for ordering.

Each directory exposes its public API through an `index.ts` barrel; import from the directory (e.g. `'../utils'`), which is also what tests mock with `mock.module('../utils', ...)`.

## Conventions

- `no-console` is an ESLint error; use `logger` from `src/utils`.
- `import/order` is enforced: alphabetized, with blank lines between groups.
- Tests are colocated as `*.spec.ts` next to the source file and import from `bun:test`. Bun has no automocking or `requireActual`: pass `mock.module` an explicit factory, and spread a copy of the real module (taken before mocking) to keep its other exports. Module mocks are shared across test files in one run and can't be undone, so each spec should also pass on its own. `mock.module` on one of our own barrels also replaces those exports for every other spec in the run; to stub our own modules, use `spyOn` on the barrel's namespace (or on an exported object like `logger`) and `mockRestore()` the spies in `afterAll`.
- `it.each` takes arrays of rows; Jest's tagged-template tables aren't supported.

## Releases

Work happens on short-lived branches merged into `main` through PRs; there is no `develop` branch. `.github/workflows/ci.yml` runs `verify` and `bun run package` on every PR to `main`, and uploads the archives as a workflow artifact.

`.github/workflows/release.yml` runs on every push to `main`. If no `v<version>` tag exists for the version in `package.json`, it verifies, runs `bun run package` and creates a GitHub release with the archives. Each archive is a `.tar.gz` (it keeps the executable bit) holding a single `git-coauthors` executable. Only macOS and Linux are built; there are no Windows builds. Merges that don't change the version publish nothing; to release, bump `version` in `package.json` in the PR being merged.
