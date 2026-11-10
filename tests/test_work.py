import pathlib
import subprocess
import sys
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
import work


class WorkspaceTests(unittest.TestCase):
    def init(self, root):
        root.mkdir()
        def git(*args):
            return work.git(*args, root=root)
        git("init", "-q")
        git("config", "user.name", "Test"); git("config", "user.email", "test@example.org")
        (root / "site-tools").mkdir()
        (root / "site-tools/work.py").write_text("# workspace tool")
        (root / ".gitignore").write_text(".cache/\n")
        git("add", "."); git("commit", "-qm", "base")

    def test_creates_isolated_tree_and_prevents_duplicate_film_claims(self):
        with tempfile.TemporaryDirectory() as tmp:
            root, tree = pathlib.Path(tmp) / "main", pathlib.Path(tmp) / "film-a"
            self.init(root)
            original = work.git("branch", "--show-current", root=root)
            film = dict(key="a-en", dir="films/a/source")
            work.start(film, "video/a", tree, "HEAD", root)
            self.assertEqual(work.git("branch", "--show-current", root=root), original)
            self.assertEqual(work.git("branch", "--show-current", root=tree), "video/a")
            self.assertEqual(work.git("status", "--porcelain", root=tree), "")
            self.assertEqual(work.worktrees(root)[1]["film"]["key"], "a-en")
            with self.assertRaisesRegex(ValueError, "already has"):
                work.start(dict(key="a-es", dir="films/a/source"), "video/a-es", pathlib.Path(tmp) / "other", "HEAD", root)

    def test_refuses_existing_or_nested_destination_without_changing_it(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp) / "main"
            self.init(root)
            for path in (root / "nested", root):
                with self.assertRaises(ValueError):
                    work.start(dict(key="a-en", dir="films/a/source"), "video/a", path, "HEAD", root)
            self.assertEqual(len(work.worktrees(root)), 1)

    def test_regenerates_before_running_the_affected_plan(self):
        with patch.object(work.subprocess, "run") as execute:
            work.refresh_and_check("origin/main")
        commands = [call.args[0] for call in execute.call_args_list]
        self.assertEqual([c[1] for c in commands], ["site-tools/build_series.py", "site-tools/build_pages.py", "site-tools/catalog.py", ".github/scripts/affected.py"])
        self.assertEqual(commands[-1][-3:], ["--base", "origin/main", "--run"])

    def test_simultaneous_claims_cannot_create_two_video_workspaces(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp) / "main"
            self.init(root)
            def create(number):
                try:
                    return work.start(dict(key="a-en", dir="films/a/source"), f"video/a-{number}",
                                      pathlib.Path(tmp) / f"film-{number}", "HEAD", root)
                except ValueError as error:
                    return error
            with ThreadPoolExecutor(max_workers=2) as pool:
                results = list(pool.map(create, (1, 2)))
            self.assertEqual(sum(isinstance(r, pathlib.Path) for r in results), 1)
            self.assertEqual(sum(isinstance(r, ValueError) for r in results), 1)
            self.assertEqual(len(work.worktrees(root)), 2)

    def test_failed_regeneration_stops_before_checks(self):
        with patch.object(work.subprocess, "run", side_effect=subprocess.CalledProcessError(1, "generator")) as execute:
            with self.assertRaises(subprocess.CalledProcessError):
                work.refresh_and_check("origin/main")
            self.assertEqual(execute.call_count, 1)


if __name__ == "__main__":
    unittest.main()
