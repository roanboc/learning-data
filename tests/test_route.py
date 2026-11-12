import json
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
import build_series
import catalog


class RouteTests(unittest.TestCase):
    """modules/route.json: the learning route the Topics and home pages draw."""

    def setUp(self):
        self.route = json.loads((ROOT / "modules/route.json").read_text(encoding="utf-8"))
        self.modules = catalog.load_modules()

    def test_every_topic_is_on_the_route_once(self):
        placed = [t for g in self.route["groups"] for t in g["topics"]]
        self.assertEqual(sorted(placed), sorted(m["id"] for m in self.modules))

    def test_the_route_starts_with_one_topic_and_its_loops_are_one_group_each(self):
        lines = [g["line"] for g in self.route["groups"]]
        self.assertEqual(lines[0], "main")
        self.assertEqual(len(self.route["groups"][0]["topics"]), 1)
        self.assertEqual(lines[-1], "main")
        for loop in build_series.LINES[1:]:
            self.assertLessEqual(lines.count(loop), 1)

    def test_goals_stop_at_films_and_series_of_the_modules(self):
        items = {i for m in self.modules for i in m["items"]}
        for g in self.route["goals"]:
            self.assertTrue(set(g["stops"]) <= items, g["id"])
            self.assertEqual(set(g["name"]), {"en", "es"})
            self.assertEqual(set(g["line"]), {"en", "es"})

    def test_the_data_follows_the_route_in_both_languages(self):
        en, es = build_series.route_data("en"), build_series.route_data("es")
        order = [t for g in self.route["groups"] for t in g["topics"]]
        live = {t["id"] for t in build_series.live()}
        self.assertEqual([t["id"] for t in en["topics"]], [t for t in order if t in live])
        self.assertEqual([t["id"] for t in en["topics"]], [t["id"] for t in es["topics"]])
        self.assertEqual(set(en["text"]), set(es["text"]))
        for t in en["topics"]:
            for i in t["items"]:
                self.assertTrue(i.get("soon") or i["films"], i["id"])

    def test_a_series_in_the_works_leaves_once_it_has_a_film(self):
        topic = next(t for t in build_series.live() if t["id"] == "enterprise-architecture")
        names = [u["id"] for u in build_series.upcoming(topic)]
        self.assertNotIn("enterprise-architecture", names)
        self.assertTrue(all((ROOT / "films" / n / "proposal.md").exists() for n in names), names)

    def test_lengths_read_as_the_site_says_them(self):
        self.assertEqual(build_series.dur(40.5), "40½ min")
        self.assertEqual(build_series.dur(59), "59 min")
        self.assertEqual(build_series.dur(123), "2 h 3 min")
        self.assertEqual(build_series.dur(120), "2 h")

    def test_captions_become_lines_with_their_second(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = pathlib.Path(tmp) / "en.vtt"
            p.write_text("WEBVTT\n\n00:00:01.400 --> 00:00:05.052\nFirst line,\nin two rows.\n\n1\n00:01:02,000 --> 00:01:04,000\n<i>Second</i> line.\n", encoding="utf-8")
            self.assertEqual(build_series.cues(p), [[1, "First line, in two rows."], [62, "Second line."]])


if __name__ == "__main__":
    unittest.main()
