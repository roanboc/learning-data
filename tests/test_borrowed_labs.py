"""The Python labs of Borrowed from the brain: their solutions find what the labs say they find, on freshly made data."""
import pathlib
import shutil
import subprocess
import sys
import tempfile
import unittest

LABS = pathlib.Path(__file__).resolve().parents[1] / "films/what-an-agent-is/2-borrowed-from-the-brain/labs"


class BorrowedLabs(unittest.TestCase):
    def test_solutions_pass_on_fresh_data(self):
        with tempfile.TemporaryDirectory() as tmp:
            copy = pathlib.Path(tmp) / "labs"
            shutil.copytree(LABS, copy, ignore=shutil.ignore_patterns("data", "__pycache__"))
            out = subprocess.run([sys.executable, "check.py", "--solutions"], cwd=copy, capture_output=True, text=True)
            self.assertEqual(out.returncode, 0, out.stdout + out.stderr)
            self.assertEqual(out.stdout.count(": ok"), 3, out.stdout)

    def test_starters_are_unfinished(self):
        for name in ("lab1_reflex_vs_predictor.py", "lab2_foraging_loop.py", "lab3_learning_from_the_miss.py"):
            self.assertIn("NotImplementedError", (LABS / name).read_text(encoding="utf-8"), name)


if __name__ == "__main__":
    unittest.main()
