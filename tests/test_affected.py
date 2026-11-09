"""Selection contracts: content changes must neither escape their owner nor lose dependants."""
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".github/scripts"))
import affected


class SelectionTests(unittest.TestCase):
    def plan(self, *paths):
        return affected.plan(list(paths), False)

    def test_inventory_does_not_lose_release_entries_when_folders_change(self):
        declared = [e["key"] for p in (ROOT / "films").rglob("release.json")
                    for e in json.loads(p.read_text(encoding="utf-8"))]
        self.assertCountEqual([f["key"] for f in affected.films()], declared)
        self.assertEqual(len(declared), len(set(declared)))

    def test_one_film_source_selects_only_its_owner(self):
        p = self.plan("films/data-governance/1-off-the-shelf/source/src/scenes.js")
        self.assertEqual([(f["key"], f["checks"]) for f in p["films"]], [("off-the-shelf-en", "full")])

    def test_documentation_never_draws_frames(self):
        p = self.plan("films/data-governance/1-off-the-shelf/source/README.md")
        self.assertEqual(p["films"], [])
        self.assertTrue(p["site"])

    def test_planner_changes_do_not_schedule_all_films(self):
        p = self.plan(".github/scripts/affected.py", ".github/workflows/checks.yml")
        self.assertTrue(p["tooling"])
        self.assertEqual(p["films"], [])
        self.assertEqual(p["pages"], [])

    def test_shared_engine_keeps_every_consumer(self):
        p = self.plan("films/inner-life-of-data/source/src/engine3.js")
        self.assertEqual({f["key"] for f in p["films"]}, {f["key"] for f in affected.films()})

    def test_shared_style_does_not_select_unrelated_series(self):
        p = self.plan("films/data-governance/shared/src/people.js")
        keys = {f["key"] for f in p["films"]}
        self.assertIn("off-the-shelf-en", keys)
        self.assertNotIn("inner-life-of-data-en", keys)

    def test_player_only_plan_skips_sound_and_frames_locally(self):
        p = self.plan("site/assets/off-the-shelf/film.js")
        self.assertEqual([(f["key"], f["checks"]) for f in p["films"]], [("off-the-shelf-en", "player")])
        names = [s[0] for s in affected.steps(p)]
        self.assertFalse(any("every moment" in n or "sound" in n for n in names))
        self.assertTrue(any("build" in n for n in names))

    def test_soundtrack_only_does_not_schedule_film(self):
        p = self.plan("site/assets/off-the-shelf/soundtrack.mp3")
        self.assertEqual(p["films"], [])
        self.assertIn("data-governance/off-the-shelf/", p["pages"])

    def test_audio_pointer_selects_its_playback_pages(self):
        p = affected.plan(["films/data-governance/1-off-the-shelf/audio.json"], False, base=None)
        self.assertEqual(p["films"], [])
        self.assertIn("data-governance/off-the-shelf/", p["pages"])
        self.assertNotIn("sketch/", p["pages"])

    def test_deleted_audio_pointer_keeps_its_dependants(self):
        with patch.object(pathlib.Path, "is_file", return_value=False):
            p = affected.plan(["films/data-governance/1-off-the-shelf/audio.json"], False, base=None)
        self.assertIn("data-governance/off-the-shelf/", p["pages"])
        self.assertEqual(p["films"], [])

    def test_initial_pointers_to_unchanged_tracked_audio_only_validate_media(self):
        p = self.plan("films/data-governance/1-off-the-shelf/audio.json")
        self.assertTrue(p["media"])
        self.assertEqual(p["pages"], [])
        self.assertEqual(p["films"], [])

    def test_a_changed_or_untracked_mp3_still_checks_playback(self):
        for name in ("site/assets/off-the-shelf/soundtrack.mp3", "site/assets/off-the-shelf/soundtrack.es.mp3"):
            p = self.plan("films/data-governance/1-off-the-shelf/audio.json", name)
            self.assertIn("data-governance/off-the-shelf/", p["pages"])

    def test_url_only_pointer_change_skips_playback_but_checksum_change_does_not(self):
        path = "films/data-governance/1-off-the-shelf/audio.json"
        current = json.loads((ROOT / path).read_text())
        old = json.loads(json.dumps(current))
        old["files"][0]["url"] = "https://old-release.example/audio.mp3"
        result = subprocess.CompletedProcess([], 0, json.dumps(old))
        with patch.object(affected.subprocess, "run", return_value=result):
            self.assertEqual(affected.audio_paths(path, [path], "base"), [])
            old["files"][0]["sha256"] = "0" * 64
            result.stdout = json.dumps(old)
            self.assertEqual(affected.audio_paths(path, [path], "base"), [current["files"][0]["path"]])

    def test_audio_comparison_uses_the_base_commit_not_the_pr_head(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            def git(*args):
                return subprocess.run(["git", *args], cwd=root, check=True, capture_output=True, text=True).stdout.strip()
            git("init", "-q")
            git("config", "user.name", "Test")
            git("config", "user.email", "test@example.org")
            (root / "site").mkdir()
            (root / "site/index.html").write_text('<audio src="assets/example/soundtrack.mp3"></audio>')
            folder = root / "films/example"
            folder.mkdir(parents=True)
            name = "films/example/audio.json"
            old = dict(version=1, files=[dict(path="site/assets/example/soundtrack.mp3", sha256="a" * 64)])
            (root / name).write_text(json.dumps(old))
            git("add", ".")
            git("commit", "-qm", "base")
            base = git("rev-parse", "HEAD")
            old["files"][0]["sha256"] = "b" * 64
            (root / name).write_text(json.dumps(old))
            git("commit", "-qam", "new audio pointer")
            with patch.object(affected, "ROOT", root), patch.object(affected, "WEB", root / "site"):
                self.assertEqual(affected.pages([name], base=base), {""})
                self.assertEqual(affected.pages([name], base="HEAD"), set())

    def test_module_metadata_is_checked_without_rendering(self):
        p = self.plan("modules/data-governance/module.json")
        self.assertTrue(p["site"])
        self.assertTrue(p["tooling"])
        self.assertEqual(p["films"], [])

    def test_nested_dynamic_asset_and_deleted_asset_keep_owner_pages(self):
        for asset in ("places/desk.webp", "places/deleted-picture.webp", "places/places.json"):
            with self.subTest(asset=asset):
                p = self.plan("site/assets/off-the-shelf/" + asset)
                self.assertIn("data-governance/off-the-shelf/", p["pages"])
                self.assertIn("es/data-governance/off-the-shelf/", p["pages"])
                self.assertNotIn("sketch/", p["pages"])
                self.assertEqual(p["films"], [])

    def test_spanish_captions_do_not_render_english_film(self):
        p = self.plan("films/data-governance/1-off-the-shelf/source/src/i18n/es/captions.js")
        self.assertEqual(p["films"], [])
        self.assertTrue(p["site"])

    def test_series_learning_change_selects_only_its_pages(self):
        p = self.plan("site/assets/data-governance/learn.en.js")
        self.assertEqual(p["pages"], ["data-governance/labs/", "data-governance/scenarios/"])
        self.assertEqual(p["films"], [])

    def test_explicit_full_regression_still_exists(self):
        p = affected.plan([], True)
        self.assertEqual(len(p["films"]), len(affected.films()))
        self.assertIsNone(p["pages"])

    def test_rename_reports_both_owners(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            def git(*args):
                return subprocess.run(["git", *args], cwd=root, check=True, capture_output=True)
            git("init", "-q")
            git("config", "user.name", "Test")
            git("config", "user.email", "test@example.org")
            (root / "old.js").write_text("original")
            git("add", ".")
            git("commit", "-qm", "base")
            git("mv", "old.js", "new.js")
            with patch.object(affected, "ROOT", root):
                _, paths = affected.changed("HEAD")
            self.assertEqual(paths, ["new.js", "old.js"])

    def test_ci_film_selection_works_without_a_base_branch(self):
        r = subprocess.run([sys.executable, str(ROOT / ".github/scripts/affected.py"),
                            "--base", "missing-ref", "--film", "off-the-shelf-en", "--tier", "player", "--json"],
                           cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        p = json.loads(r.stdout)
        self.assertEqual(len(p["films"]), 1)
        self.assertEqual(p["films"][0]["checks"], "player")


if __name__ == "__main__":
    unittest.main()
