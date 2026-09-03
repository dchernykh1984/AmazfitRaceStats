---
name: on-device-preview
description: Run the app on the Zepp OS simulator or a real watch with the Zeus CLI, and read the traps that make it silently not launch. Use when asked to run, preview, build or debug the app outside the unit tests.
---

# Running the app for real

The unit tests cover `lib/` only. Anything about drawing, settings or the network has to be
seen in the simulator or on a watch.

## The commands

- `npm run dev` - build and run against a device emulator (`zeus dev -t "Amazfit GTR 4"`).
- `npm run preview` - QR preview on a real watch through the Zepp app in Developer Mode.
- `npm run build` - the `.zab` store bundle; runs `version:sync` first.

The Zeus CLI version is pinned in `package.json` and fetched with `npx` on demand, so it is
not a tracked dependency. `zeus dev` also needs a Zepp account login (`zeus login`) and the
device emulator it downloads afterwards. Installing the simulator, logging in to a Zepp
account, or installing anything else on the machine is the user's call - ask first, do not
run installers on your own.

## Traps

- **`zeus build` and `zeus dev` overwrite `.gitignore`.** Restore it (`git checkout --
  .gitignore`) before committing so the clobbered version never lands. Never make the file
  read-only to prevent it: `zeus dev` then crashes with `EPERM`.
- **A placeholder `appId` silently refuses to launch the device page.** The dev preview is
  cloud-mediated, so `app.json`'s `appId` must be an app really registered under the
  developer's Zepp account. With an unregistered id the settings screen and the side
  service still run and nothing reports an error - only the watch page never appears. If
  the device page is the only part that does not start, suspect the id before the code.
- **The device polls the side service every 60s** (`REFRESH_MS`), so a settings change can
  take up to a minute to show on screen. That is not a bug to chase.
- The simulator writes a `sim-debug.log`; the app's own lines are tagged, which is the
  fastest way to tell "did not launch" from "launched and drew nothing".
- On Windows the simulator additionally needs the TAP virtual network adapter renamed to
  `tun`, or it starts without a network.

## Devices

`app.json` targets round 466, round 480 and square 390. A layout change needs a look at
both a round and a square target, not just the one that was easy to start.
