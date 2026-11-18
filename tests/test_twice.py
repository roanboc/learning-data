"""Nothing shows twice where a film changes shot or chapter (films/data-governance/shared/tools/twice.py): words shown twice in part,
the list of films still to fix, and the page's part, on a made-up film."""
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "films" / "data-governance" / "shared" / "tools"))
sys.path.insert(0, str(ROOT / ".github" / "scripts"))
import twice
import films as release_films


def found(probs, scenes=(("one", 0), ("two", 4), ("three", 8))):
    return twice.changes({"probs": probs, "scenes": [list(s) for s in scenes]})


def w(f, words, d, line, side="xf"):
    return {"f": f, "side": side, "k": "W", "key": words, "d": d, "ln": line}


class RuleTests(unittest.TestCase):
    def test_frames_of_one_change_are_one_change(self):
        cs = found([w(123, "Change board", 700, "Change board · once a month"), w(125, "Change board", 760, "Change board · once a month"),
                    w(140, "Change board", 720, "Change board · once a month")])
        self.assertEqual(len(cs), 2)  # 123 and 125 are one change; 140 is another
        self.assertEqual(cs[0]["got"]["W"], {"Change board": 760})
        self.assertEqual((cs[0]["sid"], round(cs[0]["t"] - cs[0]["start"], 2)), ("two", 0.1))
        self.assertEqual(twice.line(cs[0]), '   4.10 s  two        +0.10   twice in a chapter crossfade: "Change board" 760 px apart '
                                            '(in "Change board · once a month")')

    def test_a_whole_line_twice_is_said_once(self):
        # the same words shown twice as a whole line are said as a line, not again as words in part
        cs = found([{"f": 123, "side": "dis", "k": "T", "key": "Change board", "d": 300}, w(123, "Change board", 300, "Change board · weekly", "dis")])
        self.assertEqual((cs[0]["got"]["T"], cs[0]["got"]["W"]), ({"Change board": 300}, {}))

    def test_at_two_sizes(self):
        self.assertIn('"Change board" at two sizes', twice.line(found([w(123, "Change board", 1e4, "Change board · once a month")])[0]))

    def test_known_words_are_named_by_chapter_and_words(self):
        c = found([w(123, "Change board", 700, "Change board · once a month"), w(123, "census report", 300, "draft submission · census report")])[0]
        self.assertEqual(twice.known_in(c, [["two", "Change board"]]), {"Change board"})
        self.assertEqual(twice.known_in(c, [["one", "Change board"], ["two", "Change"]]), set())
        self.assertIn('(known) "Change board"', twice.line(c, {"Change board"}))


class ListTests(unittest.TestCase):
    def test_the_words_still_to_fix_are_films_words(self):
        keys = {e["key"] for e in release_films.films()}
        for key, entries in twice.later().items():
            self.assertIn(key, keys)
            self.assertTrue(entries, key)  # a film whose words are all fixed leaves the list
            self.assertEqual(entries, sorted(entries), key)
            for e in entries:
                self.assertEqual(len(e), 2, (key, e))
                self.assertTrue(all(isinstance(x, str) and x for x in e), (key, e))
                self.assertGreaterEqual(len(e[1].split()), twice.WORDS, (key, e))


# a made-up film: three chapters, each fading into the next over XF seconds, as the engine lays the chapter before (OFF) over the next
FILM = """<!doctype html><meta charset="utf-8"><script>
const XF = 0.8, OFF = document.createElement('canvas'); OFF.width = 192; OFF.height = 108;
const SCENES = [{id: 'one', start: 0, dur: 4}, {id: 'two', start: 4, dur: 4}, {id: 'three', start: 8, dur: 4}, {id: 'four', start: 12, dur: 4}];
const TL = {total: 16};
// what each chapter writes, in the 1920 px frame
const LINES = {
  one: [['Change board', 200, 300], ['Policy 19', 300, 500]],
  // the words alone before, now in a longer line elsewhere: twice; the line from before, where it was: once
  two: [['Change board · once a month', 900, 600], ['Policy 19', 300, 500], ['for the review agent', 200, 800], ['at noon', 1500, 300]],
  // a longer line that starts where the one before did: the words they share stay put; "the review" is all of neither line, and
  // "at noon" too short to count; a whole line from before, elsewhere: twice
  three: [['Change board · weekly', 900, 600], ['Policy 19', 700, 500], ['the review checklist', 1200, 800], ['lunch at noon', 1500, 900]],
};
// a heading on top of every frame, crossfade or not: it stays, so the words it shares with a chapter don't show twice
const HEADING = ['Why the Change board meets', 100, 100];
// the fourth chapter: a line on a room's wall stays, drawn the same before, during and after a dissolve, while a label in the room
// leaves, laid on the frame from the dissolve's canvas (as the agent films' kit does, AG_BUFS.cut): the words they share show once
const AG_BUFS = {cut: document.createElement('canvas')}; AG_BUFS.cut.width = 192; AG_BUFS.cut.height = 108;
function four(ctx, S, t) {
  if (t < 0.9) return;
  const label = c => { c.save(); c.scale(S, S); c.font = '40px sans-serif'; c.fillText('Change board', 200, 300); c.restore(); };
  ctx.save(); ctx.scale(S, S); ctx.font = '40px sans-serif'; ctx.fillText('Change board wall', 900, 200); ctx.restore();
  if (t < 2) label(ctx);
  else if (t < 2.5) {
    const b = AG_BUFS.cut.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); b.clearRect(0, 0, 192, 108); label(b);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - (t - 2) / 0.5; ctx.drawImage(AG_BUFS.cut, 0, 0); ctx.restore();
  }
}
function chapter(ctx, S, id) {
  ctx.save(); ctx.scale(S, S); ctx.font = '40px sans-serif'; ctx.textAlign = 'left';
  for (const [s, x, y] of LINES[id]) ctx.fillText(s, x, y);
  ctx.restore();
}
function renderFrame(ctx, S, T) {
  let i = 0; for (let k = 1; k < SCENES.length; k++) if (T >= SCENES[k].start) i = k;
  const t = T - SCENES[i].start;
  if (SCENES[i].id === 'four') four(ctx, S, t); else chapter(ctx, S, SCENES[i].id);
  if (i && t < XF) {
    const o = OFF.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, 192, 108); chapter(o, S, SCENES[i - 1].id);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - t / XF; ctx.drawImage(OFF, 0, 0); ctx.restore();
  }
  ctx.save(); ctx.scale(S, S); ctx.font = '30px sans-serif'; ctx.fillText(...HEADING); ctx.restore();
}
window.__READY__ = true;
</script>"""


class PageTests(unittest.TestCase):
    """What the page's part finds in a made-up film. It needs the browser the film checks use, so it is skipped without one."""

    def test_words_twice_in_part_at_a_chapter_crossfade(self):
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
                pg = b.new_page()
                pg.goto(page.as_uri())
                pg.wait_for_function("window.__READY__===true")
                r = twice.read(pg)
                fresh = twice.check(pg, known=[])
                known = twice.check(pg, known=[["one", "Policy 19"], ["two", "Change board"]])
                pg.close()
            b.close()
        finally:
            p.stop()
        self.assertEqual((r["dis"], r["xf"]), (1, 3))
        cs = twice.changes(r)
        self.assertEqual([(c["sid"], c["side"], {k: sorted(v) for k, v in c["got"].items() if v}) for c in cs],
                         [("two", "xf", {"W": ["Change board"]}), ("three", "xf", {"T": ["Policy 19"]})])
        self.assertEqual(cs[0]["line"], {"Change board": "Change board · once a month"})
        self.assertEqual(cs[0]["got"]["W"]["Change board"], 762)  # from (200, 300) to (900, 600)
        self.assertEqual(len(fresh[1]), 2)
        self.assertIn('"Change board" 762 px apart (in "Change board · once a month")', fresh[1][0])
        # the words still to fix are listed in what it checked and don't fail; an entry it no longer finds is named, to take off the list
        self.assertEqual(len(known[1]), 1)
        self.assertIn('"Policy 19"', known[1][0])
        self.assertIn('1 shows words twice in part, known and still to fix', known[0])
        self.assertIn('(no longer twice) chapter one, "Policy 19"', known[0])


if __name__ == "__main__":
    unittest.main()
