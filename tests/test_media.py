"""Storage contracts: immutable pointers, scoped fetches and no data loss on a bad download."""
import hashlib
import io
import json
import pathlib
import sys
import tempfile
import unittest
import contextlib
import subprocess
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
import media


def entry(payload=b"example audio"):
    sha = hashlib.sha256(payload).hexdigest()
    return dict(path="site/assets/example/soundtrack.mp3", size=len(payload), sha256=sha,
                url=media.BASE + "audio-test/" + sha + ".mp3")


class MediaTests(unittest.TestCase):
    def test_download_commits_only_verified_content(self):
        payload = b"example audio"
        with tempfile.TemporaryDirectory() as tmp:
            target = pathlib.Path(tmp) / "soundtrack.mp3"
            with patch.object(media.urllib.request, "urlopen", return_value=io.BytesIO(payload)):
                media.download(entry(payload), target)
            self.assertEqual(target.read_bytes(), payload)
            self.assertEqual(list(target.parent.glob(".audio-*")), [])

    def test_bad_download_preserves_the_existing_file(self):
        for payload in (b"bad", b"x" * 100):
            with self.subTest(payload=payload), tempfile.TemporaryDirectory() as tmp:
                target = pathlib.Path(tmp) / "soundtrack.mp3"
                target.write_bytes(b"keep this copy")
                with patch.object(media.urllib.request, "urlopen", return_value=io.BytesIO(payload)):
                    with self.assertRaises(ValueError):
                        media.download(entry(), target)
                self.assertEqual(target.read_bytes(), b"keep this copy")
                self.assertEqual(list(target.parent.glob(".audio-*")), [])

    def test_fetch_refreshes_known_old_audio_but_preserves_local_edits(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            original = entry(b"original")
            target = root / original["path"]
            target.parent.mkdir(parents=True)
            target.write_bytes(b"original")
            media.fetch({original["path"]: original}, root)
            updated = entry(b"updated")
            with patch.object(media.urllib.request, "urlopen", return_value=io.BytesIO(b"updated")), contextlib.redirect_stdout(io.StringIO()):
                media.fetch({updated["path"]: updated}, root)
            self.assertEqual(target.read_bytes(), b"updated")
            target.write_bytes(b"my edits")
            with patch.object(media.urllib.request, "urlopen") as network:
                with self.assertRaises(ValueError):
                    media.fetch({original["path"]: original}, root)
                network.assert_not_called()
            self.assertEqual(target.read_bytes(), b"my edits")

    def test_manifest_rejects_path_escape_and_unpinned_urls(self):
        for change in ({"path": "site/assets/../../../outside.mp3"}, {"url": "https://example.org/a.mp3"},
                       {"url": media.BASE + "latest/a.mp3"}, {"size": -1}, {"sha256": "wrong"}):
            with self.subTest(change=change), self.assertRaises(ValueError):
                media.validate(dict(entry(), **change))

    def test_symlink_cannot_redirect_a_fetch_outside_the_checkout(self):
        with tempfile.TemporaryDirectory() as tmp, tempfile.TemporaryDirectory() as outside:
            root = pathlib.Path(tmp)
            (root / "site/assets").mkdir(parents=True)
            try:
                (root / "site/assets/example").symlink_to(outside, target_is_directory=True)
            except OSError:
                self.skipTest("symlinks unavailable")
            with self.assertRaises(ValueError):
                media.validate(entry(), root)

    def test_duplicate_audio_ownership_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            for name in ("one", "two"):
                folder = root / "films" / name
                folder.mkdir(parents=True)
                (folder / "audio.json").write_text(json.dumps(dict(version=1, files=[entry()])))
            with self.assertRaises(ValueError):
                media.inventory(root)

    def test_scoped_fetch_avoids_unrelated_films_and_keeps_both_languages(self):
        entries = media.inventory()
        chosen = media.selected('["es/what-an-agent-is/decades-in-the-making/"]', entries)
        self.assertIn("site/assets/decades-in-the-making/soundtrack.es.mp3", chosen)
        self.assertIn("site/assets/decades-in-the-making/soundtrack.mp3", chosen)
        self.assertNotIn("site/assets/off-the-shelf/soundtrack.mp3", chosen)
        self.assertEqual(media.selected("[]", entries), {})

    def test_pointers_cover_every_current_soundtrack(self):
        entries = media.inventory()
        current = {p.relative_to(ROOT).as_posix() for p in (ROOT / "site/assets").rglob("*.mp3")}
        self.assertTrue(current <= set(entries))
        self.assertTrue(entries)

    def test_lean_checkout_still_generates_spanish_audio_pages(self):
        import build_series
        path = ROOT / "site/assets/decades-in-the-making/soundtrack.es.mp3"
        with patch.object(pathlib.Path, "is_file", return_value=False):
            self.assertTrue(media.available(path))
            self.assertTrue(build_series.spanish_audio(dict(key="decades-in-the-making")))
            self.assertFalse(build_series.spanish_audio(dict(key="no-such-film")))

    def test_untrack_does_not_touch_git_if_remote_verification_fails(self):
        with patch.object(sys, "argv", ["media.py", "untrack"]), \
             patch.object(media, "inventory", return_value={entry()["path"]: entry()}), \
             patch.object(media, "verify_remote", side_effect=ValueError("replacement unavailable")), \
             patch.object(media.subprocess, "run") as git, contextlib.redirect_stderr(io.StringIO()):
            with self.assertRaises(SystemExit) as error:
                media.main()
            self.assertEqual(error.exception.code, 1)
            git.assert_not_called()

    def test_index_keeps_old_urls_and_only_repoints_changed_audio(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            source = root / "films/example"
            source.mkdir(parents=True)
            audio = root / "site/assets/example/soundtrack.mp3"
            audio.parent.mkdir(parents=True)
            audio.write_bytes(b"original")
            (source / "release.json").write_text(json.dumps([dict(site_player="site/assets/example/film.js")]))
            with patch.object(media, "ROOT", root), contextlib.redirect_stdout(io.StringIO()):
                media.index("audio-v1")
                first = json.loads((source / "audio.json").read_text())
                media.index("audio-v2")
                self.assertEqual(first, json.loads((source / "audio.json").read_text()))
                audio.write_bytes(b"edited")
                media.index("audio-v2")
                updated = json.loads((source / "audio.json").read_text())["files"][0]
                self.assertIn("/audio-v2/", updated["url"])
                self.assertNotEqual(updated["sha256"], first["files"][0]["sha256"])

    def test_film_scopes_and_unknown_scopes_are_explicit(self):
        chosen = media.scoped(media.inventory(), ["off-the-shelf-en"])
        self.assertTrue(chosen)
        self.assertTrue(all(p.startswith("site/assets/off-the-shelf/") for p in chosen))
        with self.assertRaises(ValueError):
            media.scoped(media.inventory(), ["no-such-film"])
        with self.assertRaises(ValueError):
            media.scoped(media.inventory(), tag="audio-no-such-tag")

    def test_auto_tags_are_per_film_and_index_does_not_touch_other_films(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            for name in ("one", "two"):
                folder = root / "films" / name
                folder.mkdir(parents=True)
                (folder / "release.json").write_text(json.dumps([dict(key=name + "-en", site_player=f"site/assets/{name}/film.js")]))
                audio = root / f"site/assets/{name}/soundtrack.mp3"
                audio.parent.mkdir(parents=True)
                audio.write_bytes(name.encode())
            with patch.object(media, "ROOT", root), contextlib.redirect_stdout(io.StringIO()):
                tags = media.index(films=["one-en"])
                self.assertTrue(next(iter(tags)).startswith("audio-one-"))
                first = (root / "films/one/audio.json").read_bytes()
                self.assertFalse((root / "films/two/audio.json").exists())
                other = media.index(films=["two-en"])
                self.assertFalse(tags & other)
                self.assertEqual(first, (root / "films/one/audio.json").read_bytes())
                self.assertEqual(media.index(films=["one-en"]), set())

    def test_interrupted_upload_resumes_only_missing_assets(self):
        audio = entry()
        remote = dict(isPrerelease=True, assets=[])
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            path = root / audio["path"]
            path.parent.mkdir(parents=True)
            path.write_bytes(b"example audio")
            with patch.object(media, "ROOT", root), patch.object(media, "remote_release", return_value=remote), \
                 patch.object(media.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, "", "")) as upload, patch.object(media, "verify_remote") as verify:
                media.publish({audio["path"]: audio}, {audio["path"]: audio})
                command = upload.call_args.args[0]
                self.assertEqual(command[:3], ["gh", "release", "upload"])
                self.assertNotIn("--clobber", command)
                verify.assert_called_once_with({audio["path"]: audio})

    def test_existing_verified_assets_are_not_uploaded_again(self):
        audio = entry()
        remote = dict(isPrerelease=True, assets=[dict(name=audio["sha256"] + ".mp3", size=audio["size"])])
        with patch.object(media, "remote_release", return_value=remote), patch.object(media.subprocess, "run") as upload, patch.object(media, "verify_remote") as verify:
            media.publish({audio["path"]: audio}, {audio["path"]: audio})
            upload.assert_not_called()
            verify.assert_called_once()

    def test_new_audio_release_is_a_prerelease_and_never_latest(self):
        audio = entry()
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            path = root / audio["path"]
            path.parent.mkdir(parents=True)
            path.write_bytes(b"example audio")
            with patch.object(media, "ROOT", root), patch.object(media, "remote_release", return_value=None), \
                 patch.object(media.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, "", "")) as create, patch.object(media, "verify_remote") as verify:
                media.publish({audio["path"]: audio}, {audio["path"]: audio})
                command = create.call_args.args[0]
                self.assertEqual(command[:3], ["gh", "release", "create"])
                self.assertIn("--prerelease", command)
                self.assertIn("--latest=false", command)
                self.assertNotIn("--clobber", command)
                verify.assert_called_once_with({audio["path"]: audio})

    def test_wrong_size_remote_asset_is_never_replaced(self):
        audio = entry()
        remote = dict(isPrerelease=True, assets=[dict(name=audio["sha256"] + ".mp3", size=1)])
        with patch.object(media, "remote_release", return_value=remote), patch.object(media.subprocess, "run") as upload:
            with self.assertRaisesRegex(ValueError, "never overwritten"):
                media.publish({audio["path"]: audio}, {audio["path"]: audio})
            upload.assert_not_called()

    def test_scoped_upload_cannot_create_an_incomplete_shared_initial_release(self):
        audio = entry()
        other = dict(entry(b"other"), path="site/assets/other/soundtrack.mp3")
        with patch.object(media, "remote_release", return_value=None), patch.object(media.subprocess, "run") as upload:
            with self.assertRaisesRegex(ValueError, "shared initial"):
                media.publish({audio["path"]: audio}, {audio["path"]: audio, other["path"]: other})
            upload.assert_not_called()

    def test_publishing_everything_creates_only_the_missing_releases(self):
        done = entry()
        new = dict(entry(b"new audio"), path="site/assets/new/soundtrack.mp3")
        new["url"] = media.BASE + "audio-new/" + new["sha256"] + ".mp3"
        everything = {done["path"]: done, new["path"]: new}
        releases = {"audio-test": dict(isPrerelease=True, assets=[dict(name=done["sha256"] + ".mp3", size=done["size"])]),
                    "audio-new": None}
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            path = root / new["path"]
            path.parent.mkdir(parents=True)
            path.write_bytes(b"new audio")
            with patch.object(media, "ROOT", root), patch.object(media, "remote_release", side_effect=releases.get), \
                 patch.object(media.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, "", "")) as gh, patch.object(media, "verify_remote") as verify:
                media.publish(media.scoped(everything), everything)
                self.assertEqual(gh.call_count, 1)
                command = gh.call_args.args[0]
                self.assertEqual(command[:4], ["gh", "release", "create", "audio-new"])
                self.assertNotIn("--clobber", command)
                self.assertEqual([call.args[0] for call in verify.call_args_list], [{new["path"]: new}, {done["path"]: done}])

    def test_failed_authentication_is_not_treated_as_a_missing_release(self):
        result = subprocess.CompletedProcess([], 1, "", "HTTP 401: bad credentials")
        with patch.object(media.subprocess, "run", return_value=result) as command:
            with self.assertRaisesRegex(ValueError, "lookup failed"):
                media.remote_release("audio-test")
            self.assertEqual(command.call_count, 1)


if __name__ == "__main__":
    unittest.main()
