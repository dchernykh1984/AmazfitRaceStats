---
name: review-cycle
description: Review a branch or PR for correctness and cleanup, then land the fixes. Use when asked to review the current diff or a PR before it merges.
---

# Review cycle

- Review the actual diff against `origin/main`, not the whole tree
  (`git diff origin/main...HEAD`, or `gh pr diff <n>`).
- Prefer real correctness bugs; report cleanup only when it clearly earns its place. Do
  not invent findings to hit a count.
- The built-in `/code-review` and `/security-review` commands are the fast way in; this
  skill is what to look for once you are reading the diff.

## What to look for in this repository

- **Backward compatibility.** A stored row setting is an index into `METRICS`, so an
  insert or a reorder silently changes what every installed watch shows - only appending
  is safe. Unknown server keys must stay ignored rather than throwing.
- **Failure is a display state.** No network, a 404 before the race has data, malformed
  JSON: each replies with null stats so the watch keeps its last standings and shows
  `--`. A change that lets a fetch failure throw or blank the screen is a bug.
- **Logic in the wrong file.** Anything worth testing belongs in `lib/`; `page/`,
  `app-side/` and `setting/` cannot be unit tested and should stay thin.
- **Coverage.** New behaviour in `lib/` without a test in `test/` is incomplete, and a
  new metric or locale needs the catalogue and locale-completeness tests to still pass.
- **Both screen shapes.** Layout changes affect round (diamond rows, capped at 9 fields)
  and square (two columns, up to 10) differently.
- **The version files.** `app.json` is written by release-please and `version:sync`, never
  by hand; a diff that edits it directly is wrong unless it is the release PR.
- **Hygiene.** ASCII outside `lib/i18n/`, prettier-clean, no secrets or personal paths in
  tracked files, no new runtime dependency without a reason (it lands in the OSV scan).

## Landing the fixes

- Apply the valid fixes on the branch, re-run the local gate (`npm test`, `npm run lint`,
  `npm run format:check`, `npm run version:check`).
- Keep each fix a one-line Conventional Commit with no attribution or co-author line.
- Ask before pushing, then drive CI back to green (see the `shipping-a-change` skill)
  before handing back.
