#!/usr/bin/env python3
"""PreToolUse guard: never let an agent change the remote or history on its own.

The rule in this repository is that anything outward-facing or hard to reverse - a push,
a merge, a tag, a release, a branch deletion, a history rewrite - happens only after the
person maintaining it says yes to that exact command. Narrating the command is not
consent. This hook makes the harness enforce that rather than leaving it to an agent's
memory: it turns such a command into a permission prompt whatever the session's
permission mode is. It never denies anything, so approving still takes one keystroke.

It guards every shell tool, not just Bash: the same `git push` typed into PowerShell is
the same push, and a guard that only watches one of them is a guard an agent walks past
by picking the other shell.

Read-only inspection (status, log, diff, fetch, gh ... view/list/checks) is untouched.
"""

from __future__ import annotations

import json
import re
import sys

# The shell tools whose commands this guard reads. Both carry the command line in
# tool_input.command.
SHELL_TOOLS = {"Bash", "PowerShell"}

# (pattern, what to tell the person approving it)
RULES = [
    (r"\bgit\s+push\b", "pushes to the remote"),
    (r"\bgit\s+(merge|rebase|cherry-pick|revert)\b", "rewrites the branch history"),
    (r"\bgit\s+reset\s+--hard\b", "throws away working-tree changes"),
    (r"\bgit\s+(tag|checkout\s+-f|clean\s+-[a-z]*f)\b", "tags or discards local state"),
    (r"\bgit\s+branch\s+-[a-zA-Z]*D\b", "deletes a branch"),
    (r"\bgit\s+commit\b.*--amend\b", "rewrites an existing commit"),
    (r"\bgh\s+pr\s+(merge|close|ready)\b", "changes the state of a pull request"),
    (r"\bgh\s+release\b", "touches a GitHub release"),
    (r"\bgh\s+repo\s+(edit|delete|create)\b", "changes the repository itself"),
    (r"\bgh\s+workflow\s+run\b", "starts a workflow run"),
    (r"\bnpm\s+publish\b", "publishes a package"),
]


def reason_for(command: str) -> str | None:
    for pattern, why in RULES:
        if re.search(pattern, command):
            return why
    return None


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except ValueError:
        return 0

    if payload.get("tool_name") not in SHELL_TOOLS:
        return 0

    command = (payload.get("tool_input") or {}).get("command") or ""
    why = reason_for(command)
    if why is None:
        return 0

    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "ask",
                "permissionDecisionReason": (
                    f"This command {why}. The repository asks for an explicit yes before "
                    "anything outward-facing or hard to reverse."
                ),
            }
        },
        sys.stdout,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
