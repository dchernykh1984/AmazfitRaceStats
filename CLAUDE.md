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

## Conventions

- Node / Zepp OS (zeus-cli). Local gate: `npm test` (vitest), `npm run lint` (eslint),
  `npm run format:check` (prettier), `npm run version:check`.
- Never commit to `main`. Branch off `origin/main`, one logical change per commit.
- Commit messages: one-line Conventional Commits, no body, no `Co-Authored-By` trailer
  and no co-author line. `cz check --rev-range origin/main..HEAD` runs on every PR, and
  release-please builds `CHANGELOG.md` from these subjects, so the type matters (`fix`
  and `feat` are released; `chore`/`docs`/`test`/`style` are not).
- ASCII only in tracked source and docs. A `no-non-ascii` pre-commit hook and the
  `.claude` PostToolUse guard both enforce it (`CHANGELOG.md` and `package-lock.json` are
  exempt). `.claude/` is listed in `.prettierignore` so prettier does not reformat the
  agent docs.

## Skills

- `shipping-a-change` - branch, commit, open the PR, watch CI to green.
- `review-cycle` - review a branch or PR and land the fixes.
- `race-stats-contract` - the server contract shared with GarminRaceStats.
