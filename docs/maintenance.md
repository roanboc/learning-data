# Maintaining the content and its tools

## Decisions, 9 November 2026

Keep one repository and the existing static portal. Organize module metadata first; preserve film folder names, public URLs and browser progress keys. Content changes stay local to a film; shared changes check their actual consumers. Tooling changes have their own regression suite. Audio uses per-film immutable release pointers, with verified local copies assembled at deployment.

This builds on merged PR #177. It does not replace film craft or review rules in AGENTS.md.

## Find a module, series, film, lab or assessment

Start at [the generated catalog](../modules/README.md). It has each module's portal title, each series' source directory and public route, and each film's source link. Labs and assessments link to their current English and Spanish packs. `python site-tools/catalog.py --json` also lists stable film ids, release keys and the check-tool directory.

Each `modules/<id>/module.json` owns its title, description, position and series membership. The portal reads these files directly. `python site-tools/catalog.py --write` regenerates the index; `--check` validates membership, translations and the generated index. New series still declare their rendering/site configuration in `build_series.py`.

Do not move a film's source by hand. Fixed relative paths still exist in its tools, and release discovery still assumes the established layout. First extract those shared tools behind explicit interfaces; then migrate one series with tests for identical generated routes and progress keys. The module catalog supplies the mapping for that later migration.

## Check only the affected work

`python .github/scripts/affected.py --json` shows the plan without running it. `--run` executes that plan locally; CI uses the same film runner. A `player` task builds and compares bytes; a `full` task also checks frames and sound. Published assets and learning packs check their dependent pages without drawing every frame.

The tooling suite (`python -m unittest discover -s tests -v`) covers single-film isolation, shared-engine consumers, translations, renamed/deleted paths, dynamic background assets, player-only execution, catalog membership and safe audio restoration. Changes to the planner or its workflow run these tests instead of selecting every film. A genuine shared-engine change can still affect every consumer. Use `--all --run` for a deliberate full regression.

Keep the inexpensive global static checks. Browser tests follow direct references and the owning asset bundle for dynamically loaded files, including nested `places/` assets. Unknown pages in an explicit audio fetch are errors rather than silently fetching nothing.

Audio pointer changes are compared with the same base commit as the rest of the plan. Initial pointers to existing unchanged tracked MP3s and URL-only edits with unchanged checksums run media validation, without rechecking playback. New audio, changed checksums, removed pointers and actual MP3 removals still select the affected players. The initial bookkeeping change therefore does not check every film; the subsequent removal from Git validates the actual delivery migration.

## Audio outside Git

Audio is ordinary deployment data: it does not need to live in Git. Each film now owns an `audio.json`, with the existing site path, byte size, SHA-256 and a pinned GitHub Release URL for each soundtrack. The release filename is its checksum. This avoids a new storage service and keeps both English and Spanish playback at the same portal URLs.

GitHub Pages serves the assembled audio; visitors do not fetch it from GitHub Releases. No cross-origin player changes are needed. The static checker and page generator can resolve declared audio without downloading it; browser checks fetch the audio for their selected pages, and deployment restores everything. Corrupt downloads never replace a local file. Edited local audio is never silently overwritten.

### Complete the first migration

The initial pointers target `audio-v1`. Tracked audio stays in place until the remote copies are published and verified.

1. Merge this change, then run **Actions → Store audio outside Git → Run workflow**, tag `audio-v1`. It stages the 85 current MP3s, checks their hashes and uploads an audio prerelease. It does not render videos. The prerelease cannot take over the site's latest-video download links.
2. Once the workflow succeeds, run `python site-tools/media.py untrack`. It downloads and verifies **every** remote replacement before removing any path from Git's index. Local audio stays on disk and is ignored. Commit the staged audio removals in a separate change. If verification fails, nothing is untracked.
3. On a clean clone, run `python site-tools/media.py fetch`, then the static checks and a playback smoke test. Deployments also restore and verify the audio before publishing.

This removes about 425 MiB from future checked-out content. Old audio still exists in Git history. Rewriting that history would require a separate coordinated migration; it is not part of this change.

For a small working clone after migration, use `git clone --filter=blob:none --depth 1 https://github.com/roanboc/learning-data.git`. The CI planner keeps commit history for comparisons but filters out historical media blobs.

### Add or replace audio

Generate or copy the MP3 to its usual site path, then run `python site-tools/media.py index --tag audio-v2` (choose a new tag for each batch). It updates changed files' pointers; unchanged soundtracks keep their original release URLs. Commit the changed `audio.json` files. MP3s are ignored, so they do not enter Git automatically.

For new audio that is no longer tracked, stage and publish from the machine holding it:

```
python site-tools/media.py prepare --tag audio-v2 --output /path/to/audio-staging
gh release create audio-v2 /path/to/audio-staging/*.mp3 --prerelease --latest=false --title "Published audio: audio-v2"
python site-tools/media.py verify-remote
```

Publish those assets before merging their pointers. Never replace files of an existing audio release. The manual workflow is useful when the source MP3s are still present in its checkout (the initial migration); future ignored audio must be uploaded from the author's machine as above. Keep audio releases for as long as any manifest references them.

If GitHub CLI is not signed in, use the browser profile that already has access: create the new `audio-v2` release in GitHub, mark it as a **prerelease**, and upload the checksum-named MP3s from the prepared folder. Then run `verify-remote`, which needs no GitHub login for this public repository. The `gh release create` command above is an alternative to that browser upload.

`media.py check` validates pointers and any local files; it permits absent local files in a lean checkout. `fetch --pages '["es/what-an-agent-is/decades-in-the-making/"]'` restores just the owning bundles, including both language alternatives. Plain `fetch` restores all declared audio. Render/downloadable-video releases keep their existing workflow.

Fetch remembers verified local audio in ignored `.cache/audio-state.json`. After pulling a newer pointer it can refresh an unchanged old cached copy automatically, while preserving any audio you edited locally.

## Deployment

Automatic Pages deployment follows a successful **Checks** run on a push to `main`, and checks out that exact SHA. It restores all audio, validates the assembled site, then uploads the Pages artifact. An explicitly requested deployment also restores and validates the site.

## Subsequent structural migrations

The next independent changes are extracting shared rendering/check packages from older film folders, then moving one series into its module. After that, move labs and assessments from formatting-sensitive JavaScript packs to schema-validated authored data, generating the current packs for compatibility. Each migration should preserve output and use its own focused checks. The catalog and per-film audio pointers avoid a central list that every film author must edit.
