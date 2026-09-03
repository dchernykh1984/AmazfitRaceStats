# Working in AmazfitRaceStats

A Zepp OS mini app for Amazfit watches that shows a rider their live race standing -
place, gaps to the riders ahead and behind and to the leader, per-lap gap dynamics, and
laps - by polling the UniversalBicycleTeam site by competition id and bib number. It is
the Amazfit companion to the Garmin GarminRaceStats data field and speaks the same server
contract, so a race timed for one works for the other.

## Architecture

The watch has no internet on its own. A side service (JavaScript in the Zepp phone app)
issues a single GET to the timing site and hands the result to the device app, which
renders one metric per row. All server values are pre-formatted strings, so the device
app stays trivial.

```
app.json          manifest: app id, version, screen targets, permissions
page/             the device app (on the watch)
app-side/         the side service (in the phone app) - the only network call
setting/          the phone settings screen
lib/              all the real logic, free of Zepp OS imports - the tested part
utils/config/     colors, refresh interval, device shape
scripts/          sync-app-version.mjs, the app.json version gate
test/             vitest, one file per lib module
```

Logic that matters goes in `lib/`; the three runtime entry points stay thin, because
nothing in them can be unit tested.

## Conventions

- Node / Zepp OS (zeus-cli). Local gate: `npm test` (vitest), `npm run lint` (eslint),
  `npm run format:check` (prettier), `npm run version:check`.
- Never commit to `main`. Branch off `origin/main`, one logical change per commit.
- Commit messages: one-line Conventional Commits, no body, no `Co-Authored-By` trailer
  and no co-author line. `cz check --rev-range origin/main..HEAD` runs on every PR, and
  release-please builds `CHANGELOG.md` from these subjects, so the type matters (`fix`
  and `feat` are released; `chore`/`docs`/`test`/`style` are not).
- Versions are never bumped by hand: release-please owns `package.json` and
  `CHANGELOG.md`, and `npm run version:sync` derives both numbers in `app.json` from it.
- ASCII only in tracked source and docs. A `no-non-ascii` pre-commit hook and the
  `.claude` PostToolUse guard both enforce it (`CHANGELOG.md`, `package-lock.json` and
  the `lib/i18n/` translations are exempt). `.claude/` is listed in `.prettierignore` so
  prettier does not reformat the agent docs.
- Pushing, merging, tagging, releasing and anything else outward-facing or hard to
  reverse waits for the user's explicit yes on that exact command. A `PreToolUse` hook
  turns those into a prompt.

## Environment notes

- Write files as UTF-8. A PowerShell redirect, `Set-Content` or `Out-File` defaults to
  UTF-16, which fails the ASCII guard and prettier on a file that looks fine in an
  editor. `file <path>` and `head -c 20 <path> | xxd` tell you which you have.
- `zeus build` and `zeus dev` overwrite `.gitignore`. Restore it before committing, and
  never make it read-only - Zeus then dies with `EPERM`.
- The device polls the side service every 60s, so a settings change takes up to a minute
  to appear on screen.

## Skills

- `shipping-a-change` - branch, commit, open the PR, watch CI to green.
- `review-cycle` - review a branch or PR and land the fixes.
- `releasing` - release-please, the two version numbers, the .zab store bundle.
- `zepp-os-app` - where a change belongs, adding a metric, a locale or a screen shape.
- `on-device-preview` - running the app on the simulator or a watch, and its traps.
- `race-stats-contract` - the server contract shared with GarminRaceStats.
