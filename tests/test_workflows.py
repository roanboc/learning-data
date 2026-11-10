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

    @unittest.skipUnless(shutil.which("bash"), "the Actions step runs in Bash")
    def test_audio_workflow_blank_tag_publishes_every_missing_release(self):
        workflow = (ROOT / ".github/workflows/audio.yml").read_text(encoding="utf-8")
        tag = workflow.split("      tag:\n", 1)[1].split("      film:\n", 1)[0]
        self.assertIn("required: false", tag)
        script = textwrap.dedent(workflow.split("        run: |\n", 1)[1])
        script = script.replace("python site-tools/media.py publish", "printf '%s|'")
        cases = {("", ""): "", ("audio-v1", ""): "--tag|audio-v1|",
                 ("", "one-en"): "--film|one-en|", ("audio-x", "one-en"): "--tag|audio-x|--film|one-en|"}
        for (value, film), expected in cases.items():
            with self.subTest(tag=value, film=film):
                result = subprocess.run(["bash", "-c", script], capture_output=True, text=True,
                                        env=dict(os.environ, TAG=value, FILM=film))
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(result.stdout, expected or "|")

    def test_audio_workflow_publishes_when_audio_reaches_main(self):
        workflow = (ROOT / ".github/workflows/audio.yml").read_text(encoding="utf-8")
        triggers = workflow.split("\non:\n", 1)[1].split("\npermissions:\n", 1)[0]
        push = triggers.split("  push:\n", 1)[1].split("  schedule:\n", 1)[0]
        self.assertIn("    branches: [main]\n", push)
        for path in ("films/**/audio.json", "site/assets/**/*.mp3", "site-tools/media.py", ".github/workflows/audio.yml"):
            self.assertIn(f"      - '{path}'\n", push)
        self.assertRegex(triggers, r"  schedule:\n    - cron: '[0-9*/,-]+( [0-9*/,-]+){4}'\n")
        self.assertIn("  workflow_dispatch:\n", triggers)
        # A push or a scheduled run has no inputs: it publishes everything missing, in the blank run's queue.
        self.assertIn("group: audio-release-${{ inputs.tag || 'all' }}\n", workflow)
        self.assertIn("cancel-in-progress: false\n", workflow)


    def test_pushes_to_main_are_never_cancelled_and_publish_queues(self):
        # Cancelling main's Checks runs left Publish site with no passing run to publish (10 Nov).
        checks = (ROOT / ".github/workflows/checks.yml").read_text(encoding="utf-8")
        block = checks.split("\nconcurrency:\n", 1)[1].split("\njobs:\n", 1)[0]
        self.assertIn("group: checks-${{ github.ref == 'refs/heads/main' && github.sha || github.ref }}\n", block)
        self.assertIn("cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}\n", block)
        pages = (ROOT / ".github/workflows/pages.yml").read_text(encoding="utf-8")
        # Only a deployment that will run joins the queue, so a skipped run can't replace a waiting one.
        self.assertNotIn("\nconcurrency:", pages)
        deploy = pages.split("  deploy:\n", 1)[1]
        self.assertIn("    concurrency:\n      group: pages\n      cancel-in-progress: false\n", deploy)
        # Main's runs finish in any order: an older commit than the live one never replaces it.
        self.assertIn("compare/$live...$target", deploy)
        # The queue keeps only the newest waiting run, whatever commit it started for, so each run deploys the newest
        # commit whose Checks passed, and checks out and deploys that same commit.
        self.assertIn("checks.yml/runs?branch=main&event=push&status=success&per_page=1", deploy)
        self.assertEqual(deploy.count("${{ steps.newer.outputs.sha }}"), 2)
        # The live commit comes from the site itself: a Pages deployment records main's newest commit, not the built one.
        self.assertIn('/version.txt?t=', deploy)
        self.assertIn("git rev-parse HEAD > site/version.txt", deploy)
        # deploy-pages gives up after 10 minutes and cancels; the deploy step waits for the sync itself.
        self.assertNotIn("actions/deploy-pages", deploy)
        self.assertIn('gh api -X POST "repos/$GITHUB_REPOSITORY/pages/deployments" --input -', deploy)
        self.assertIn("succeed) exit 0", deploy)


if __name__ == "__main__":
    unittest.main()
