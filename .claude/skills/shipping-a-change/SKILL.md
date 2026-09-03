---
name: shipping-a-change
description: Branch, commit, open a pull request, and drive CI to green in this repo. Use whenever you are about to commit, push, open a PR, or check CI status.
---

# Shipping a change

## Ask before anything outward-facing

Pushing, merging, tagging, deleting or force-pushing a branch, and creating a release are
the user's call, every time. Show the exact command and wait for a plain "yes"; narrating
what you are about to do is not consent. Reading (status, log, diff, fetch, `gh ... view`)
needs no permission. A `PreToolUse` hook turns these commands into a prompt, but the rule
is yours to keep, not the hook's.

## Branch

- Never commit to `main`. `git fetch origin && git switch -c <type>/<slug> origin/main`.
- Stage only files you changed (`git add <path>`), never `git add -A`.

## Commit

- One line, Conventional Commits: `git commit -m "type(scope): summary"`. No body and no
  `Co-Authored-By` trailer. `cz check --rev-range origin/main..HEAD` runs in CI, and
  release-please builds CHANGELOG from these subjects (`feat`/`fix` release;
  `chore`/`docs`/`test`/`style` do not).
- One logical change per commit, each one green on its own.

## Before pushing

- `npm test` (vitest), `npm run lint` (eslint), `npm run format:check` (prettier),
  `npm run version:check`. pre-commit runs prettier/eslint/vitest again on commit.
- ASCII only in tracked source and docs, `lib/i18n/` excepted. Write files as UTF-8: a
  PowerShell redirect or `Set-Content` defaults to UTF-16 and corrupts an otherwise ASCII
  file, which fails the guard for reasons the diff does not show.
- If `zeus build` or `zeus dev` ran, check `.gitignore`: Zeus overwrites it.

## Pull request

- `git push -u origin <branch>` then `gh pr create --base main --title "..." --body "..."`.
- PR body is real content only: no "Generated with Claude Code" line and no co-author
  footer. The repository has a PR template - a body that answers it is enough.

## Watch CI to green

- Poll the authoritative rollup, not `gh pr checks` (its per-check status lags):

  ```
  gh pr view <n> --json statusCheckRollup \
    --jq '[.statusCheckRollup[] | {name:(.name//.context), s:(.conclusion//.state)}]'
  ```

- The checks are: `pre-commit` (prettier, eslint, the file hygiene hooks), `test` (vitest
  plus `version:check`), `commitizen`, `actionlint`, and the OSV dependency scan. Every one
  must be SUCCESS before asking for review.
- The OSV scan uploads SARIF to GitHub code scanning, which needs the repository to be
  public. On a private fork that job fails even with zero vulnerabilities - that is the
  visibility, not the dependencies.

## Merging

- The user merges. All three merge methods are enabled here, so say which one you would use
  and let them choose; do not run `gh pr merge` unprompted.
- Dependabot keeps npm and Actions up to date. Its PRs are reviewed and merged like any
  other; a lockfile bump that turns CI red is worth reading before re-running it.
