# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`git-coauthors` is a TypeScript CLI (published to npm, bin → `dist/index.js`). It lists authors from the current repo's git log, lets the user multi-select some, and copies `Co-authored-by: Name <email>` trailers to the clipboard. It can also print them (`-p`) or append them to the last commit (`-a`). See README.md for the user-facing flags.

## Commands

Tooling versions are pinned in `.tool-versions` (Node 16, pnpm 8). Use pnpm.

- `pnpm build` — compile with `tsc` into `dist/`
- `pnpm start` — build and run the CLI against the current directory (it must be a git repo)
- `pnpm lint` — ESLint over `.ts` files
- `pnpm test` — Jest (ts-jest); single file: `pnpm test src/helpers/git.spec.ts`; single test: `pnpm test -t "<test name>"`
- `pnpm verify` — typecheck + lint + test; runs on the husky `pre-push` hook

The `pre-commit` hook runs lint-staged (`eslint --fix` + `prettier --write` on TS/JS, `sort-package-json` on package.json).

## Architecture

- `src/index.ts` — commander setup. A single `pick` command (the default) wires flags to `commands/pick-authors.ts`.
- `src/commands/pick-authors.ts` — the whole flow: verify cwd is a repo → ensure storage dir exists → validate options with zod → load recent authors → fetch/merge git authors → prompt → save picks as recents → print / amend / copy to clipboard. Errors are caught here and logged.
- `src/application/` — the `Author` domain type (zod schema) and `toCoauthor` formatting.
- `src/helpers/` — side-effecting integrations: `git.ts` (via `simple-git`), `prompt.ts` (`prompts` autocomplete multiselect), `recent-authors.ts` (recents service).
- `src/storage/` — `createJSONStore<T>(path, default)` is a generic file-backed JSON store that never throws (logs and falls back to the default). Data lives in `~/.git-coauthors/` (`STORAGE_DIR`); recents are a single global `authors.json`, not per repo.
- `src/utils/` — array helpers (`unique`, `combineUnique`, `sortBy`), file existence check, and `logger` (chalk-based).

Author ordering: when `--sort` is not given, recents are prepended to the log's authors and deduplicated, so recent picks float to the top. When `--sort` is given, recents are ignored for ordering.

Each directory exposes its public API through an `index.ts` barrel; import from the directory (e.g. `'../utils'`), which is also what tests mock with `jest.mock('../utils', ...)`.

## Conventions

- `no-console` is an ESLint error; use `logger` from `src/utils`.
- `import/order` is enforced: alphabetized, with blank lines between groups.
- Tests are colocated as `*.spec.ts` next to the source file.
- The build targets CommonJS, and `chalk@4` and `clipboardy@2` are the last majors of those packages that support it. Upgrading them to ESM-only versions would break the build.
