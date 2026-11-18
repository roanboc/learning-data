"""Every shot is seen (site-tools/shots.py): the rule, on made-up lists of shots, the films' own lists of brief shots and the list of
shots still to fix, and the page's part, on a made-up film."""
import json
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
sys.path.insert(0, str(ROOT / ".github" / "scripts"))
import shots
import films as release_films


def chapter(shots_, dur=20.0, end=None, cid="one", fn="ag_shots"):
    return {"id": cid, "dur": dur, "lists": [{"fn": fn, "end": dur if end is None else end, "shots": [{"at": a, "place": p} for a, p in shots_]}]}


def found(*chapters):
    return [(x["chapter"], x["at"], x["why"], round(x["n"], 2)) for x in shots.short(list(chapters))]


class RuleTests(unittest.TestCase):
    def test_shots_in_order_with_time_to_be_seen(self):
        self.assertEqual(shots.on_screen([{"at": 0}, {"at": 5}, {"at": 12}], 20), [(0.0, 5), (5, 7), (12, 8)])
        self.assertEqual(found(chapter([(0, "desk"), (5, "door"), (12, "hall")])), [])

    def test_a_shot_listed_before_one_that_starts_no_later_never_shows(self):
        x = shots.short([chapter([(0, "desk"), (8, "door"), (7.5, "hall"), (12, "desk")])])
        self.assertEqual([(s["at"], s["why"]) for s in x], [(8, "never")])
        self.assertEqual(x[0]["next"], {"at": 7.5, "place": "hall"})
        self.assertIn("the shot at 7.50 s (hall) is listed after it but starts no later, and ag_shots shows the last shot", shots.line(x[0]))
        # two shots at the same time: the first never shows
        self.assertEqual(found(chapter([(0, "desk"), (10, "door"), (10, "hall")])), [("one", 10, "never", 0.0)])

    def test_a_shot_on_screen_for_less_than_a_second(self):
        x = shots.short([chapter([(0, "desk"), (10, "door"), (10.6, "hall")])])
        self.assertEqual([(s["at"], s["why"], round(s["n"], 2)) for s in x], [(10, "short", 0.6)])
        self.assertEqual(shots.line(x[0]), "chapter one: shot 2 of 3, at 10.00 s (door), is on screen for 0.60 s (at least 1.0 s): "
                                            "give it the time to be seen, or leave it out")

    def test_the_first_shows_from_the_chapters_start_and_the_last_until_its_end(self):
        # the first shot is on screen from 0, whatever its at; the last until the list's end, or the chapter's when that comes first
        self.assertEqual(found(chapter([(0.4, "desk"), (1.2, "door")])), [])
        self.assertEqual(found(chapter([(0, "desk"), (19.5, "door")])), [("one", 19.5, "short", 0.5)])
        self.assertEqual(found(chapter([(0, "desk"), (15.5, "door")], end=16)), [("one", 15.5, "short", 0.5)])
        self.assertEqual(found(chapter([(0, "desk"), (19.5, "door")], end=30)), [("one", 19.5, "short", 0.5)])
        self.assertEqual(found({"id": "one", "dur": 20, "lists": [{"fn": "gv_shots", "end": None, "shots": [{"at": 0, "place": ""}, {"at": 19.5, "place": ""}]}]}),
                         [("one", 19.5, "short", 0.5)])

    def test_a_shot_after_its_chapter(self):
        x = shots.short([chapter([(0, "desk"), (21, "door")])])
        self.assertEqual([s["why"] for s in x], ["after"])
        self.assertIn("starts after its chapter ends (20.00 s), so it never shows", shots.line(x[0]))

    def test_a_shot_is_named_by_its_chapter_and_its_time(self):
        x = shots.short([chapter([(0, "desk"), (10, "door"), (10.6, "hall")])])[0]
        self.assertEqual(shots.named([["one", 10.08, "why"]], x), ["one", 10.08, "why"])
        self.assertEqual(shots.named([["one", 9.95], ["one", 10.02]], x), ["one", 10.02])  # the nearest
        self.assertIsNone(shots.named([["one", 10.2]], x))
        self.assertIsNone(shots.named([["two", 10]], x))


class ListTests(unittest.TestCase):
    def test_the_shots_still_to_fix_are_films_shots(self):
        keys = {e["key"] for e in release_films.films()}
        for key, entries in shots.later().items():
            self.assertIn(key, keys)
            self.assertTrue(entries, key)  # a film whose shots are all fixed leaves the list
            for e in entries:
                self.assertEqual(len(e), 2, (key, e))
                self.assertIsInstance(e[0], str)
                self.assertIsInstance(e[1], (int, float))

    def test_every_brief_shot_says_why(self):
        for f in sorted(ROOT.glob("films/**/source/film.json")):
            for e in json.loads(f.read_text(encoding="utf-8")).get("brief", []):
                where = f.relative_to(ROOT).as_posix()
                self.assertEqual(len(e), 3, (where, e))
                self.assertIsInstance(e[0], str, where)
                self.assertIsInstance(e[1], (int, float), where)
                self.assertGreater(len(e[2]), 20, where)  # why it is brief, in words

    def test_a_film_that_names_no_kit_is_read_no_further(self):
        with tempfile.TemporaryDirectory() as d:
            page = pathlib.Path(d) / "render.html"
            page.write_text("<script src='film.js'></script>", encoding="utf-8")
            (pathlib.Path(d) / "film.js").write_text("function draw(){}", encoding="utf-8")
            self.assertFalse(shots.picks_shots(page))
            (pathlib.Path(d) / "film.js").write_text("function gv_shots(ctx,S,t,end,shots,dis){}", encoding="utf-8")
            self.assertTrue(shots.picks_shots(page))


# a made-up film: two chapters; the second also runs a chapter's draw only to find its camera (a probe), whose list is left out
FILM = """<!doctype html><meta charset="utf-8"><script>
let AG_PROBE = null, GV_PROBE = null, drawn = 0;
function pick(t, shots) { let i = 0; for (let k = 1; k < shots.length; k++) if (t >= shots[k].at) i = k; return i; }
function ag_shots(ctx, S, t, end, shots, dis) { drawn++; return pick(t, shots); }
function gv_shots(ctx, S, t, end, shots, dis) { drawn++; return pick(t, shots); }
const SCENES = [
  {id: 'one', dur: 10, draw: (ctx, S, t, sc) => ag_shots(ctx, S, t, sc.dur, [{at: 0, place: 'desk'}, {at: 4, place: 'door'}, {at: 4.6, place: 'hall'}])},
  {id: 'two', dur: 8, draw: (ctx, S, t, sc) => {
    GV_PROBE = {}; gv_shots(ctx, S, t, sc.dur, [{at: 0, place: 'probe'}, {at: 0.1, place: 'probe'}]); GV_PROBE = null;
    gv_shots(ctx, S, t, 6, [{at: 0, place: 'office'}, {at: 3, place: 'board'}, {at: 2}]); }},
];
window.__READY__ = true;
</script>"""


class PageTests(unittest.TestCase):
    """What the page's part reads in a made-up film. It needs the browser the film checks use, so it is skipped without one."""

    def test_it_reads_each_list_once_as_given_and_leaves_out_the_probes(self):
        try:
            from playwright.sync_api import sync_playwright
            p = sync_playwright().start()
        except Exception:
            raise unittest.SkipTest("no browser here: the film checks install one")
        try:
            try:
                b = p.chromium.launch(args=["--allow-file-access-from-files"])
            except Exception:
                raise unittest.SkipTest("no browser here: the film checks install one")
            with tempfile.TemporaryDirectory() as d:
                page = pathlib.Path(d) / "render.html"
                page.write_text(FILM, encoding="utf-8")
                self.assertTrue(shots.picks_shots(page))
                r = shots.read(b, page)
                pg = b.new_page()
                pg.goto(page.as_uri())
                self.assertEqual(pg.evaluate(shots.JS, {"fns": list(shots.PICKERS), "step": shots.STEP}), r)
                self.assertGreater(pg.evaluate("drawn"), 0)  # the shots are drawn as before, through the kit's own functions
                self.assertIn("drawn++", pg.evaluate("ag_shots.toString() + gv_shots.toString()"))  # which are given back after
                pg.close()
            b.close()
        finally:
            p.stop()
        self.assertEqual(r["fns"], ["ag_shots", "gv_shots"])
        self.assertEqual([(c["id"], c["dur"]) for c in r["chapters"]], [("one", 10), ("two", 8)])
        self.assertEqual(r["chapters"][0]["lists"], [{"fn": "ag_shots", "end": 10, "shots": [{"at": 0, "place": "desk"}, {"at": 4, "place": "door"}, {"at": 4.6, "place": "hall"}]}])
        self.assertEqual(r["chapters"][1]["lists"], [{"fn": "gv_shots", "end": 6, "shots": [{"at": 0, "place": "office"}, {"at": 3, "place": "board"}, {"at": 2, "place": ""}]}])
        self.assertEqual(found(*r["chapters"]), [("one", 4, "short", 0.6), ("two", 3, "never", 0.0)])


if __name__ == "__main__":
    unittest.main()
