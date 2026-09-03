---
name: releasing
description: How a version reaches the watch - release-please, the two version numbers in app.json, and the .zab store bundle. Use when a release PR, a version bump, app.json, version:sync/version:check or the store upload is involved.
---

# Releasing

## Who bumps what

`release-please` is the only thing that bumps a version. It watches Conventional Commit
subjects on `main`, keeps an open release PR that rewrites `package.json` and
`CHANGELOG.md`, and, when that PR merges, tags a GitHub Release. Never bump a version by
hand and never edit `CHANGELOG.md` - both are generated.

Only `feat` and `fix` subjects produce a release. `chore`, `docs`, `test`, `style`,
`build`, `ci` and `refactor` land without one, which is usually what you want for agent
config, workflows or tests.

## The two version numbers

A Zepp app carries its version in `app.json`, not in `package.json`:

- `app.version.name` - the string a person sees in the store and on the watch.
- `app.version.code` - an integer the store insists must grow with every upload.

Both are derived from `package.json`, which is the file release-please owns:

- release-please writes `version.name` into `app.json` inside the release PR itself
  (`extra-files` in `release-please-config.json`), so the repository never claims a
  version it did not release.
- `npm run version:sync` writes both numbers. The code is `major * 10000 + minor * 100 +
  patch`, so a minor or patch of 100 or more is refused rather than silently shipped as a
  code that sorts below what is already in the store. The release build runs it before
  `zeus build`, so a CI bundle and a laptop bundle carry the same numbers.
- `npm run version:check` fails when `app.json` and `package.json` disagree on the name.
  It runs on every pull request. The code is deliberately not checked there: release-please
  cannot compute it, so between the release PR and the build it is legitimately one release
  behind.

If `version:check` fails on a branch, the fix is `npm run version:sync`, never editing
`app.json` by hand.

`app.json` is in `.prettierignore`: release-please rewrites it with its own JSON formatter,
and prettier would fight it on every release PR.

## From release to store

Merging the release PR tags a release; the `build-and-distribute` workflow then runs
`version:sync` and `zeus build` and attaches the `.zab` bundle to that GitHub Release. A
release created with the default `GITHUB_TOKEN` does not trigger release-triggered
workflows, which is why `release-please.yml` calls the build workflow directly.

Uploading the `.zab` to the Zepp App Store - listing, screenshots, release notes - is
manual: Zepp has no public publish API. Do not promise an automated store publish.
