"""Exercise the required-status shell guard without installing a YAML parser in CI."""
import itertools
import os
import pathlib
import shutil
import subprocess
import textwrap
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]


class WorkflowTests(unittest.TestCase):
    @unittest.skipUnless(shutil.which("bash"), "the Actions guard runs in Bash")
    def test_required_status_rejects_failed_cancelled_or_unplanned_work(self):
        workflow = (ROOT / ".github/workflows/checks.yml").read_text(encoding="utf-8")
        required = workflow.split("  required:\n", 1)[1]
        self.assertIn("needs: [plan, site, film]", required)
        self.assertIn("if: always()", required)
        script = textwrap.dedent(required.split("        run: |\n", 1)[1])
        states = ("success", "skipped", "failure", "cancelled")
        for plan, site, film in itertools.product(states, repeat=3):
            with self.subTest(plan=plan, site=site, film=film):
                result = subprocess.run(["bash", "-c", script], capture_output=True,
                                        env=dict(os.environ, PLAN=plan, SITE=site, FILM=film))
                expected = plan == "success" and site in states[:2] and film in states[:2]
                self.assertEqual(result.returncode == 0, expected)


if __name__ == "__main__":
    unittest.main()
