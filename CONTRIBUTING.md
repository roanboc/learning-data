# Contributing

How to work on this repository. [AGENTS.md](AGENTS.md) is the process every film change follows, from the proposal to the checks; [PLAYBOOK.md](PLAYBOOK.md) holds the craft lessons. This file is the practical setup: what to install, how to make a change, and how to check it.

## What you need

- **Python 3.12.** On Windows, run it as `PYTHONUTF8=1 python ...` (or set `PYTHONUTF8=1`): the tools read UTF-8 scripts, captions and pages, and the Windows default code page can't.
- **Node.js**, for `npx http-server`, which the browser checks use to serve the site.
- **Playwright's Chromium:** `pip install playwright` and `python -m playwright install chromium`.
- **Markdown:** `pip install markdown`, for `site-tools/build_pages.py`.
- **A film's own tools:** `pip install -r requirements.txt` in its `source/` folder, when it has one (most films list theirs, including `edge-tts` for a Spanish soundtrack). FFmpeg comes with `imageio-ffmpeg`; no separate install.

## Making a change

- **Generated files are generated.** Pages made by `site-tools/build_series.py`, the *Decided* tables in the series' `proposal.md` and the legibility report's table are never edited by hand: change the film's own rows (`decided.md`, `site.json`, `release.json`) and run `python site-tools/build_series.py`.
- **Each film keeps its own rows**, so two films never edit the same list; on a merge clash in a generated page, merge the rows in the films' own files and run `build_series.py` again. See *Each film keeps its own rows* in [README.md](README.md).
- **Stay in the film's lane.** A series' shared source is bundled by every film in it; put a film's own helper in that film's source. A shared fix is a new version of every film that draws with it (AGENTS.md, *Rules that always apply*).
- **Write the decision down** in the film's or series' `decided.md`, with its date.

### Changing a film

Work from the film's `source/` folder; its `README.md` says how it builds and publishes. The usual loop is `python tools/build.py`, the film's checks (`tools/check.py`, `tools/quiet.py` where it has one), then `python tools/publish.py` (with `--keep-sound` when only the pictures changed), and `python site-tools/build_series.py`. Never render a video in a session when the author has asked to check it on the site instead (the *What an agent is* films, November 2026): open the pull request and let the release workflow render it.

A film's Spanish narration is an alternate soundtrack beside the English one: `soundtrack.es.mp3` in `site/assets/<key>/`, built by the film's `tools/audio_es.py` where one exists. It voices the published Spanish captions with `es-MX-DaliaNeural`, fits each line to its existing cue, and mixes under the original score and effects; the English files, pictures and timings stay unchanged. It needs network access for the voice and caches each line in `build/es_voice/`.

### Changing the site

The site is plain HTML in `site/`, published as it is. Pages of the series are made by `site-tools/build_series.py` (never edit them by hand); a few hand-written pages are listed in `HAND_PAGES` in that script, so they get the site's header; the Making-of pages are Markdown, built by `site-tools/build_pages.py` from `site/journey/index.md` and `site/es/journey/index.md` (never edit the generated `index.html`). Keep each Spanish page at the same path under `site/es/`, so the language toggle finds it.

Adding a film to a series that `build_series.py` makes needs no hand-made page: add its numbered folder with `source/film.json`, give it a `site.json` (with its `past` row where the series has one), publish its player (`python tools/publish.py` in its source), and run `build_series.py`. A film outside those series starts from the closest existing page (Silent change's, for example) and is added to `HAND_PAGES` and `HAND` in `build_series.py`, with a `release.json` in its own folder and a `data-store` prefix for its progress. A new film page needs its chapter count in `FILMS` in `site-tools/smoke.py`, and a new page under a topic its breadcrumb in `CRUMBS` in `site-tools/check_site.py`.

## Checking a change

Run only the checks your change needs:

```
python .github/scripts/affected.py --run
```

It compares your branch, uncommitted files included, with `origin/main` and picks the checks from what changed. Without `--run` it lists them; `--all` picks every one.

- **Site, static** (`site-tools/check_site.py`): runs when the site, its tools, a Markdown doc, a series' data or a film's Spanish captions changed. Links, header, `hreflang`, breadcrumbs, film numbering, stated lengths, poster and place stamps: a few seconds.
- **Site, in a browser** (`site-tools/smoke.py`): the slow one, so only on the pages a change touched — a changed page, and every page that loads a changed file. A change to `smoke.py` itself checks every page; one to a series' play script in `site-tools/smoke/` its labs and scenarios pages. To name pages yourself: `python site-tools/smoke.py --pages '["", "topics/"]'` (`""` is the home page).
- **Films**: each film whose source changed, or whose `release.json` changed, is built, compared with the site's copy of its player, drawn frame by frame (`tools/check.py`) and sound-checked (`tools/quiet.py`) where it has one. A change to shared code — an engine, a series' shared folder — checks every film that draws with it, from the paths each film lists in its `release.json`. A change to only the site's copy of a film's player builds the film and compares the two. A change to only a film's other published files, such as a soundtrack, a poster or the places' pictures, runs no film job: the site checks cover those files. So a change to one film never checks another film that nothing it uses changed.

The *Checks* workflow (`.github/workflows/checks.yml`) runs the same choice on every pull request and push to `main`; its summary table lists what it picked and why. To run every check by hand: Actions → *Checks* → *Run workflow*. The dbt project has its own workflow, `credential-project.yml`, which runs only when it changes.

### On Windows

- Run every Python tool with `PYTHONUTF8=1` (see above).
- `smoke.py` serves the site with `npx http-server` through Python, and Python on Windows can't start `npx` (it finds only `npx.cmd`, which `subprocess` won't run). Serve the site yourself and point the checks at it:
  ```
  npx http-server site -p 8777 -c-1 -s
  python site-tools/smoke.py --base http://127.0.0.1:8777/ --pages '["topics/"]'
  ```
  Don't substitute `python -m http.server`: its accept queue is too small for the checks' parallel requests, and pages fail with spurious `ERR_CONNECTION_REFUSED`.

## Reviews and renders

A new or changed video is shared with the author for review before it's called done — usually a review page from `site-tools/review_page.py`; when the author asks not to render in the session (the *What an agent is* films, November 2026), the pull request is the review and the author watches the film on the site. The release workflow (`.github/workflows/release.yml`) renders and publishes the videos only when the author starts it; see *Publishing* in [README.md](README.md).

## Licence

Code is MIT ([LICENSE](LICENSE)); films, scripts, captions, images and text are CC BY 4.0 ([LICENSE-CONTENT.md](LICENSE-CONTENT.md)); logos and trademarks belong to their owners ([NOTICE.md](NOTICE.md)).
