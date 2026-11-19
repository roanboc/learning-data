"""Arms, and who is in front of whom (films/people-first/shared/tools/people.py), on a made-up film drawn with the kit's own
people: a near arm across the face, a hand at work above the head, a hand that stops short of what it reaches for, someone hidden
behind someone else, someone or something further away drawn over what is nearer, two solid things in one place, and a board or a
page that is only writing. And the list of what the films still have to put right."""
import json
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
KIT = ROOT / "films" / "people-first" / "shared"
# last on the path, as the films' own tools put it, so the kit's lang.py and check.py hide nobody's
sys.path.append(str(KIT / "tools"))
sys.path.insert(0, str(ROOT / ".github" / "scripts"))
import people
import films as release_films

# a made-up film: one chapter for each thing the check reads, drawn with the kit's own PK.person
FILM = """<!doctype html><meta charset="utf-8">%s<script>
const IDS = ['face', 'far', 'high', 'low', 'short', 'reach', 'behind', 'apart', 'extra', 'order', 'right', 'cars', 'lane', 'pass',
  'plainB', 'plainN', 'drawn'];
const SCENES = IDS.map((id, i) => ({id, start: 4 * i, dur: 4})), TL = {total: 4 * IDS.length};
function filmInfo() { return {scenes: SCENES}; }
function sceneIndex(T) { return Math.max(0, Math.min(IDS.length - 1, Math.floor(T / 4))); }
// a car: a box on its wheels' line, which the film says is solid
function car(ctx, x, y) { ctx.fillRect(x - 200, y - 130, 400, 130); if (PK.watch) PK.watch({solid: 'car', at: [x - 200, y - 130, x + 200, y], ground: y, ctx}); }
// a board someone explains at, and a page of notes, as PK.teach and PK.notes tell the check of them: plain, or drawn as a designer would
const board = (ctx, plain) => PK.watch && PK.watch({teach: 'carmen', over: false, late: [], lag: [], edge: [], plain, a: 1, ctx});
const page = (ctx, plain) => PK.watch && PK.watch({note: true, who: 'ivy', edge: [], tip: null, plain, a: 1, ctx});
function renderFrame(ctx, S, T) {
  const id = IDS[sceneIndex(T)], P = (who, x, floor, o, h) => PK.person(ctx, who, x, floor, h || 600, 'stand', Object.assign({t: T}, o));
  ctx.save(); ctx.scale(S, S);
  // the near arm, drawn over the head, with its hand before the eyes; the far arm, drawn behind the head, with its hand there
  if (id === 'face') P('helena', 700, 900, {reachN: [730, 350]});
  if (id === 'far') P('helena', 700, 900, {reachF: [730, 350]});
  // a hand that writes above the top of the head, and one that writes at the height of the eyes
  if (id === 'high') P('carmen', 700, 900, {reachF: [770, 262]});
  if (id === 'low') P('carmen', 700, 900, {reachF: [800, 372]});
  // a hand that reaches for a point further off than the arm is long, and for one within its length
  if (id === 'short') P('ivy', 700, 900, {reachF: [1000, 500]});
  if (id === 'reach') P('ivy', 700, 900, {reachF: [850, 470]});
  // someone right behind someone else; a step apart; and someone nobody names, far off, behind whoever is near
  if (id === 'behind') { P('sam', 700, 900); P('helena', 712, 906); }
  if (id === 'apart') { P('sam', 700, 900); P('helena', 900, 906); }
  if (id === 'extra') { P(PK.extra(7), 700, 700, null, 300); P('helena', 700, 906); }
  // whoever stands further up the picture is further away: drawn last, they lie over whoever is nearer
  if (id === 'order') { P('sam', 700, 900); P('ivy', 760, 840); }
  if (id === 'right') { P('ivy', 760, 840); P('sam', 700, 900); }
  // two cars in two lanes, the far one drawn over the near one; two in one lane; and two that pass, the far one drawn first
  if (id === 'cars') { car(ctx, 700, 700); car(ctx, 800, 650); }
  if (id === 'lane') { car(ctx, 700, 700); car(ctx, 900, 700); }
  if (id === 'pass') { car(ctx, 800, 650); car(ctx, 700, 700); }
  // a board and a page that are only writing; and the two drawn as a designer would (PK.sk.drawn)
  if (id === 'plainB') board(ctx, true);
  if (id === 'plainN') page(ctx, true);
  if (id === 'drawn') { board(ctx, false); page(ctx, false); }
  ctx.restore();
}
window.__READY__ = true;
</script>""" % "".join('<script src="%s"></script>' % (KIT / "src" / f).as_uri() for f in ("core.js", "people.js"))


def found():
    """What the check lists in the made-up film, by chapter: {chapter id: [kind, ...]} for the kinds this file is about."""
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
            people.watch(pg)
            r = pg.evaluate(people.JS, people.limits())
            pg.close()
        b.close()
    finally:
        p.stop()
    out = {}
    for kind, chapter, line in r["probs"]:
        if kind in people.LATER_KINDS:
            out.setdefault(chapter, []).append((kind, line))
    return out


class PageTests(unittest.TestCase):
    """What the page's part finds in a made-up film. It needs the browser the film checks use, so it is skipped without one."""

    @classmethod
    def setUpClass(cls):
        cls.got = found()

    def kinds(self, chapter):
        return [k for k, line in self.got.get(chapter, [])]

    def test_the_near_arm_across_the_face(self):
        self.assertEqual(self.kinds("face"), ["face"])
        self.assertIn("helena's arm lies across their own face", self.got["face"][0][1])
        self.assertEqual(self.kinds("far"), [])

    def test_a_hand_at_work_above_the_head(self):
        self.assertEqual(self.kinds("high"), ["high"])
        self.assertIn("carmen holds a hand above their head", self.got["high"][0][1])
        self.assertEqual(self.kinds("low"), [])

    def test_a_hand_that_stops_short(self):
        self.assertEqual(self.kinds("short"), ["short"])
        self.assertRegex(self.got["short"][0][1], r"ivy's hand stops \d+ px short of what it reaches for, for 4\.0 s")
        self.assertEqual(self.kinds("reach"), [])

    def test_someone_hidden_behind_someone_else(self):
        self.assertEqual(self.kinds("behind"), ["behind"])
        self.assertIn("sam is hidden behind helena", self.got["behind"][0][1])
        self.assertEqual(self.kinds("apart"), [])
        # someone nobody names, far off: whoever is near may stand in front of them
        self.assertEqual(self.kinds("extra"), [])

    def test_whoever_is_further_away_is_drawn_first(self):
        self.assertEqual(self.kinds("order"), ["order"])
        self.assertIn("ivy is further away than sam but is drawn over them", self.got["order"][0][1])
        self.assertEqual(self.kinds("right"), [])

    def test_solid_things(self):
        self.assertEqual(self.kinds("cars"), ["order"])
        self.assertIn("a car is further away than another car but is drawn over it", self.got["cars"][0][1])
        self.assertEqual(self.kinds("lane"), ["solid"])
        self.assertIn("two solid things (car, car) are in one place", self.got["lane"][0][1])
        self.assertEqual(self.kinds("pass"), [])


    def test_a_board_or_a_page_that_is_only_writing(self):
        self.assertEqual(self.kinds("plainB"), ["plain"])
        self.assertIn("the board carmen explains at is only writing", self.got["plainB"][0][1])
        self.assertEqual(self.kinds("plainN"), ["plain"])
        self.assertIn("ivy's page of notes is only writing", self.got["plainN"][0][1])
        self.assertEqual(self.kinds("drawn"), [])


class ListTests(unittest.TestCase):
    def test_what_is_still_to_put_right_names_films_and_kinds(self):
        keys = {e["key"]: e for e in release_films.films()}
        listed = json.loads((ROOT / "site-tools" / "people_later.json").read_text(encoding="utf-8"))
        for key, rows in listed.items():
            self.assertIn(key, keys)
            self.assertTrue(rows, key)  # a film with everything put right leaves the list
            # only the films drawn with the people kit run this check
            self.assertTrue(any("films/people-first/shared" in p for p in keys[key]["paths"]), key)
            for row in rows:
                self.assertEqual(len(row), 2, (key, row))
                self.assertIn(row[0], people.LATER_KINDS, (key, row))
                self.assertTrue(isinstance(row[1], str) and row[1], (key, row))
            self.assertEqual(len({tuple(r) for r in rows}), len(rows), key)


if __name__ == "__main__":
    unittest.main()
