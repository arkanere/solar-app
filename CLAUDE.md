# CLAUDE.md

Ask, don't assume. If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

Simplest solution first. Always implement the simplest thing that could work. Do not add abstractions or flexibility that weren't explicitly requested.

Don't touch unrelated code. If a file or function is not directly part of the current task, do not modify it, even if you think it could be improved.

Flag uncertainty explicitly. If you are not confident about an approach or technical detail, say so before proceeding. Confidence without certainty causes more damage than admitting a gap.

I'm always open to ideas on better ways to do things. Please don't hesitate to suggest a better way, or one that has long lasting impact over a tactical change. (as a few examples)"

## Git workflow

Always use a branch and a pull request. Never commit directly to `main`.

- Start any change on a new branch off `main` (e.g. `feat/…`, `fix/…`, `refactor/…`, `chore/…`).
- "Commit and push" means: commit on the branch, push it, and open a PR against `main`. Opening the PR is part of the workflow, not a separate request.
- Group work into logical, coherent commits where practical, keeping each commit buildable (e.g. keep `package.json` and `package-lock.json` changes together).
- Only commit or push when I ask.

## About Solar-app

This is a open source project.
