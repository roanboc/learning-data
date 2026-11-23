# Guards: Claude Code hooks and GitHub checks

One script, [`guard.py`](guard.py), runs both as Claude Code's hooks ([`.claude/settings.json`](../../.claude/settings.json))
and as GitHub's *Guards* check ([`.github/workflows/guards.yml`](../workflows/guards.yml)), so the same rules hold whoever
pushes. This repository's own rules are in [`local.py`](local.py). `guard.py` is the same file in
[learning-data-project](https://github.com/roanboc/learning-data-project/tree/main/.github/hooks): change one, copy it to the other.

| When | What it does | Why |
|---|---|---|
| Before a shell command | Refuses force-push, a push to main, a commit with Co-authored-by, Claude-Session or "Generated with Claude Code" lines, `gh pr merge` without a squash and an explicit message, a release workflow run, `rm -rf` on `/`, `~`, `.git`, `..` or `*` | Main's history is roanboc's alone, one squash per pull request; the release runs only when Rodrigo starts it |
| | Refuses film renders, `media.py untrack`, removing an MP3 by hand | Films render in the release workflow; audio untracks itself once its release copy verifies |
| | Refuses runs over about ten minutes (`affected.py --all --run`, `smoke.py` without `--pages`, `twice.py --all`) and says to use the pull request's checks | Long runs go to GitHub (Rodrigo, 19 Nov 2026) |
| | Refuses `cat` of a file over 300 KB | Tokens: grep it or read a part |
| | Pipes noisy checks (`affected.py --run`, `check_site.py`, `unittest`, `smoke.py`, a film's `tools/check.py` and others) through `guard.py trim`: short output as it is; long output keeps the failures with a few lines around them and the last 25 lines, and saves the whole log, whose path it prints | Tokens: a passing run's thousand lines aren't read |
| Before a merge or workflow run through the GitHub tools | Squash only, with an explicit title and message and no Claude lines; the branch holds the latest `origin/main` (it fetches first); no release workflow | Parallel merges left pages stale and broke the site (19 Nov 2026) |
| Before Edit or Write | Refuses credentials files and text that looks like a token or key; files whose first lines say they're generated; soundtracks and the search file. Asks first for `release.yml`, `pages.yml`, `audio.yml` | Secrets never enter the repository; generated files come from their generator |
| Before Read | Refuses a whole read of built output (a film's `film.js`, `build/`, `dist/`) or of a file over 300 KB; reading with offset and limit is fine | Tokens |
| After Edit or Write | A film's `site.json`: kicker ≤ 32, h1 ≤ 75, lead ≤ 300 characters in English and Spanish (`check_site.py`'s `INTRO_MOST`), both languages changed together, no new "module". A page under `site/`: no new "module". Narration and Spanish captions: no new release status, stock "Something had to change" or "A I" | The same rules `check_site.py` holds, on the one file, in a second instead of minutes |
| Session start | The branch, how far it is from `origin/main`, and the rules above in five lines | |
| Before a turn ends | Once each: commits not pushed (the container is reclaimed); a film's source changed with no file under `docs/assumptions/`, or with no page rebuilt under `site/` | Work isn't lost; the pull request is complete |

On GitHub, *Guards* runs the tests beside the script, then `guard.py ci`: on every changed file, the credentials and token checks
and the same after-edit checks (a problem marked `!` in `local.py` fails, the rest warn), and every commit's message. A Claude
author or trailer warns on a pull request (the squash message must leave it out) and fails on main. It takes seconds.

Run the tests: `python -m unittest discover -s .github/hooks -p 'test_*.py'`. Try a hook by hand:
`echo '{"tool_input":{"command":"git push origin main"}}' | python3 .github/hooks/guard.py pre-bash`.

**Where the hooks load.** Claude Code reads `.claude/settings.json` from the folder a session starts in. A session started in
this repository (a local clone, or a cloud session with this one repository) runs them from this repository's settings. This
project's cloud sessions start in the folder that holds both repositories, so the cloud environment's setup script runs
`python3 learning-data/.github/hooks/guard.py install . </dev/null` there (or the same from `learning-data-project`): it writes
that folder's `.claude/settings.json` from this one, each hook calling `guard.py dispatch <event>`, which runs every
repository's guard and joins their answers (a refusal wins). GitHub's *Guards* check holds every change either way.
