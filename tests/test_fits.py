"""Text stays in its box (site-tools/fits.py): the rules, on made-up measurements, and the page's part, on a made-up film."""
import math
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
import fits

FLAT = [1, 0, 0, 1, 0, 0]


def box(x0, y0, x1, y1, v=None, **more):
    """a box the page listed under a piece of text; v: how clearly [left, top, right, bottom] show where the text crosses them"""
    return dict(dict(k="s", a=1, solid=0, m=FLAT, l=[x0, y0, x1, y1], v=v, clip=None), **more)


def text(s, x0, y0, x1, y1, boxes, **more):
    """a piece of text whose ink fills [x0, y0, x1, y1], left-aligned, 28 px"""
    return dict(dict(s=s, m=FLAT, l=[x0, y0, x1, y1], px=28, al="l", ax=x0 + 14, a=1, deco=0, lay=0, clip=None, c=boxes), **more)


def moments(*texts, n=4, sid="one"):
    return [dict(t=i * 0.5, sid=sid, texts=list(texts)) for i in range(n)]


def found(frames, **kw):
    never, awhile, briefly = fits.sort(fits.measure_frames(frames), **kw)
    return [x["s"] for x in never], [x["s"] for x in awhile], [x["s"] for x in briefly]


CARD = (100, 100, 500, 300)


class RulesTests(unittest.TestCase):
    def test_text_inside_its_box_is_not_listed(self):
        self.assertEqual(found(moments(text("fits", 120, 140, 480, 168, [box(*CARD)]))), ([], [], []))

    def test_text_past_an_edge_that_shows_never_fits(self):
        frames = moments(text("too long", 120, 140, 580, 168, [box(*CARD, v=[None, None, 40, None])]))
        st = fits.measure_frames(frames)[("one", "too long")]
        self.assertEqual((st["n"], st["bad"], st["run"], st["mx"], st["side"]), (4, 4, 4, 80.0, "right"))
        self.assertEqual(found(frames), (["too long"], [], []))

    def test_an_edge_that_does_not_show_is_no_box(self):
        glow = box(110, 120, 400, 200, v=[None, None, 3, None], k="f", a=0.2)  # a wash of light behind the words
        self.assertEqual(found(moments(text("title", 120, 140, 480, 168, [glow, box(*CARD)]))), ([], [], []))
        # ... and the card behind it still holds the words
        card = box(*CARD, v=[None, None, 40, None])
        self.assertEqual(found(moments(text("title", 120, 140, 580, 168, [glow, card]))), (["title"], [], []))

    def test_the_smallest_box_that_holds_the_words_is_theirs(self):
        pill, card = box(110, 130, 300, 180, v=[None, None, 30, None]), box(*CARD)
        st = fits.measure_frames(moments(text("label", 120, 140, 340, 168, [card, pill])))[("one", "label")]
        self.assertEqual((st["bad"], st["mx"], st["b"]), (4, 40.0, [110, 130, 300, 180]))

    def test_a_hair_is_not_an_overflow(self):
        edge = [None, None, 60, None]
        self.assertEqual(found(moments(text("two px", 120, 140, 502, 168, [box(*CARD, v=edge)]))), ([], [], []))
        self.assertEqual(found(moments(text("three px", 120, 140, 503, 168, [box(*CARD, v=edge)]))), (["three px"], [], []))
        # a title is held to a tenth of its size
        big = dict(px=96, ax=168)
        self.assertEqual(found(moments(text("Title", 120, 120, 509, 216, [box(*CARD, v=edge)], **big))), ([], [], []))
        self.assertEqual(found(moments(text("Title", 120, 120, 510, 216, [box(*CARD, v=edge)], **big))), (["Title"], [], []))

    def test_a_second_and_a_half_in_a_row_is_a_fault_and_less_is_not(self):
        inside, past = text("label", 120, 140, 480, 168, [box(*CARD)]), text("label", 120, 140, 560, 168, [box(*CARD, v=[None, None, 40, None])])
        frames = lambda bad: [dict(t=i * 0.5, sid="one", texts=[past if i in bad else inside]) for i in range(20)]
        self.assertEqual(found(frames({4, 5, 6})), ([], [], ["label"]))            # a card springing open, a camera on its way
        self.assertEqual(found(frames({4, 5, 6, 9, 10, 11})), ([], [], ["label"]))  # twice, never long enough in a row
        self.assertEqual(found(frames({4, 5, 6, 7})), ([], ["label"], []))
        self.assertEqual(found(frames({4, 5, 6, 7}), every=0.25), ([], [], ["label"]))  # four moments a quarter second apart
        self.assertEqual(fits.measure_frames(frames({4, 5, 9, 10, 11}))[("one", "label")]["run"], 3)
        # words seen for a moment only are a moment in passing too, even if they never fit
        self.assertEqual(found(moments(past, n=3)), ([], [], ["label"]))

    def test_a_run_goes_on_from_one_chapter_into_the_next(self):
        past = text("label", 120, 140, 560, 168, [box(*CARD, v=[None, None, 40, None])])
        over = lambda a, b: fits.measure_frames(moments(past, n=a) + [dict(t=(a + i) * 0.5, sid="two", texts=[past]) for i in range(b)])
        runs = lambda stats: (stats[("one", "label")]["run"], stats[("two", "label")]["run"])
        listed = lambda stats: [(x["sid"], x["s"]) for x in fits.sort(stats)[0]]
        # two moments in each: one run of four, and a fault, listed once
        self.assertEqual((runs(over(2, 2)), listed(over(2, 2))), ((4, 2), [("one", "label")]))
        # the chapter that shows most of the run has it
        self.assertEqual((runs(over(2, 3)), listed(over(2, 3))), ((2, 5), [("two", "label")]))
        # a card still there for a moment as the next chapter fades in isn't listed again there
        self.assertEqual((runs(over(8, 1)), listed(over(8, 1))), ((9, 1), [("one", "label")]))
        # ... but one that stays for long in both is a fault in both
        self.assertEqual((runs(over(5, 4)), listed(over(5, 4))), ((9, 4), [("one", "label"), ("two", "label")]))
        self.assertIn("at all 2 moments and across a change of chapter, 1.5 s in a row", fits.line(fits.sort(over(2, 2))[0][0]))

    def test_the_tails_of_letters_may_hang_below_a_box(self):
        band = box(100, 136, 500, 166, v=[None, None, None, 60], k="f")  # a highlighter's band, as tall as its line
        self.assertEqual(found(moments(text("gypsy", 120, 140, 300, 172, [band], ds=6))), ([], [], []))
        self.assertEqual(found(moments(text("lower", 120, 146, 300, 172, [band]))), (["lower"], [], []))  # the line itself is below it

    def test_a_box_the_words_only_cross_is_not_theirs(self):
        edge = [None, 60, 60, None]
        strap = box(100, 150, 500, 300, v=edge)  # the words sit on its top edge, more than a quarter of them above it
        self.assertEqual(found(moments(text("on the edge", 120, 140, 300, 168, [strap]))), ([], [], []))
        self.assertEqual(found(moments(text("just inside", 120, 144, 300, 172, [strap]))), (["just inside"], [], []))
        tile = box(100, 100, 250, 300, v=edge)   # they start in it, and more than half of them run on past it
        self.assertEqual(found(moments(text("a long line that starts on a tile", 120, 140, 620, 168, [tile]))), ([], [], []))

    def test_the_same_words_twice_count_once_by_the_copy_that_leaves(self):
        ok, past = text("team", 120, 140, 480, 168, [box(*CARD)]), text("team", 620, 140, 1080, 168, [box(600, 100, 1000, 300, v=[None, None, 40, None])])
        st = fits.measure_frames(moments(ok, past))[("one", "team")]
        self.assertEqual((st["n"], st["bad"], st["mx"]), (4, 4, 80.0))

    def test_decoration_and_named_spills_are_left_out(self):
        edge = box(*CARD, v=[None, None, 40, None])
        self.assertEqual(found(moments(text("texture", 120, 140, 580, 168, [edge], deco=1))), ([], [], []))
        frames = moments(text("on purpose", 120, 140, 580, 168, [edge]))
        self.assertEqual(found(frames, spills=[["one", "on purpose", "a banner that hangs over its pole"]]), ([], [], []))
        self.assertEqual(found(frames, spills=[["two", "on purpose", "another chapter"]]), (["on purpose"], [], []))

    def test_slanted_text_is_not_held_to_an_upright_box(self):
        a = math.radians(-25)
        slant = [math.cos(a), math.sin(a), -math.sin(a), math.cos(a), 300, 200]
        t = text("Learner", 0, -20, 160, 8, [box(*CARD, v=[None, 40, 40, None])], m=slant, ax=14)
        self.assertEqual(found(moments(t)), ([], [], []))

    def test_a_turned_box_is_measured_in_its_own_frame(self):
        a = math.radians(8)
        turn = [math.cos(a), math.sin(a), -math.sin(a), math.cos(a), 400, 300]
        stamp = lambda v: dict(box(0, 0, 300, 60, v=v), m=turn)
        self.assertEqual(found(moments(text("revoked", 20, 16, 280, 44, [stamp(None)], m=turn, ax=34))), ([], [], []))
        st = fits.measure_frames(moments(text("revoked · 12 Aug", 20, 16, 335, 44, [stamp([None, None, 90, None])], m=turn, ax=34)))
        self.assertEqual(st[("one", "revoked · 12 Aug")]["mx"], 35.0)

    def test_text_cut_by_a_clip_at_its_box_is_not_seen_past_it(self):
        t = text("a long line in a window", 120, 140, 700, 168, [box(*CARD, v=[None, None, 40, None])], clip=[100, 100, 500, 300])
        st = fits.measure_frames(moments(t))[("one", "a long line in a window")]
        self.assertEqual((st["bad"], st["cut"]), (0, 4))
        self.assertEqual(found(moments(t)), ([], [], []))

    def test_a_box_cut_by_a_clip_ends_where_the_clip_does(self):
        cut = box(100, 100, 900, 300, v=[None, None, 40, None], clip=[0, 0, 500, 1080])  # a panel sliding in behind a mask
        st = fits.measure_frames(moments(text("words", 120, 140, 560, 168, [cut])))[("one", "words")]
        self.assertEqual((st["bad"], st["mx"]), (4, 60.0))

    def test_text_placed_off_the_frame_is_not_seen(self):
        t = text("waiting in the wings", 2000, 140, 2600, 168, [box(1990, 100, 2300, 300, v=[None, None, 40, None])])
        self.assertEqual(fits.measure_frames(moments(t)), {})

    def test_captions_stay_in_their_box_and_the_frame(self):
        cap = lambda x0, x1, b: dict(t=1, sid="one", id="line", texts=[text("a caption", x0, 900, x1, 990, b, px=96)])
        self.assertEqual(fits.captions([cap(200, 1700, [box(150, 880, 1770, 1040)])]), [])
        self.assertEqual([c[2] for c in fits.captions([cap(200, 1800, [box(150, 880, 1770, 1040)])])], ["runs 30 px past the right of its box"])
        self.assertEqual([c[2] for c in fits.captions([cap(200, 1930, [box(150, 880, 1960, 1040)])])], ["runs off the frame"])
        self.assertEqual([c[2] for c in fits.captions([cap(200, 1700, [])])], ["has no box under it"])


class LaterTests(unittest.TestCase):
    """The list of what the films made before the check still do wrong (site-tools/fits_later.json)."""

    def test_the_list_names_films_and_their_texts(self):
        sys.path.insert(0, str(ROOT / ".github" / "scripts"))
        import films
        keys = [f["key"] for f in films.films()]
        later = fits.later()
        self.assertEqual([k for k in later if k not in keys], [], "not a film's release key")
        self.assertEqual(list(later), [k for k in keys if k in later], "in the films' order, as --later writes it")
        for key, rows in later.items():
            self.assertTrue(rows, key + ": a film with nothing left to fix leaves the list")
            self.assertEqual(rows, sorted(rows), key)
            for row in rows:
                self.assertTrue(len(row) == 2 and all(isinstance(v, str) and v for v in row), (key, row))
            self.assertEqual(len({tuple(r) for r in rows}), len(rows), key + ": a text listed twice")


# A made-up film in the films' own engine's words: a timeline, chapters and renderFrame(ctx, scale, seconds).
FILM = """<!doctype html><meta charset="utf-8"><canvas id="c"></canvas><script>
const TL = { total: 3, caps: [{ s: 0, e: 3, sid: 'one', id: 'line', text: 'A caption, drawn larger on a small screen.' }] }, SCENES = [{ id: 'one' }];
let CAPS_ON = false;
function sceneIndex(t) { return 0; }
function card(x, X, Y, w, h) { x.fillStyle = '#1b2433'; x.strokeStyle = '#7fb0ff'; x.lineWidth = 2; x.beginPath(); x.roundRect(X, Y, w, h, 14); x.fill(); x.stroke(); }
function words(x, s, X, Y, o) { o = o || {}; x.font = '600 ' + (o.size || 28) + 'px sans-serif'; x.textAlign = o.align || 'left'; x.fillStyle = o.color || '#ffffff'; x.fillText(s, X, Y); }
let LAYER = null;
function renderFrame(x, S, t) {
  x.setTransform(S, 0, 0, S, 0, 0); x.globalAlpha = 1; x.fillStyle = '#0a0e17'; x.fillRect(0, 0, 1920, 1080);
  card(x, 100, 100, 400, 160); words(x, 'fits its card', 130, 160);
  card(x, 100, 320, 400, 160); words(x, 'far too long for the card it was laid out in', 130, 380);
  // a wash of light behind a title: a square whose edges fade to nothing
  const g = x.createRadialGradient(1300, 200, 0, 1300, 200, 150); g.addColorStop(0, 'rgba(120,170,255,0.25)'); g.addColorStop(1, 'rgba(120,170,255,0)');
  x.fillStyle = g; x.fillRect(1150, 50, 300, 300); words(x, 'A title wider than its glow', 1300, 210, { align: 'center', size: 40 });
  // a strap across a crate: the words only cross it
  x.fillStyle = '#6b5236'; x.fillRect(700, 560, 520, 260); x.fillStyle = '#8a6c48'; x.fillRect(930, 560, 60, 260); words(x, 'off the shelf', 960, 700, { align: 'center', color: '#20160c' });
  // a card kept as a picture, then drawn on the frame at another place and size
  if (!LAYER) { LAYER = document.createElement('canvas'); LAYER.width = 500 * S; LAYER.height = 200 * S; const q = LAYER.getContext('2d'); q.setTransform(S, 0, 0, S, 0, 0);
    card(q, 10, 10, 300, 120); words(q, 'too long on its layer too', 30, 80); }
  x.drawImage(LAYER, 0, 0, LAYER.width, LAYER.height, 100, 560, 750, 300);
  // words kept inside a window by a clip
  x.save(); card(x, 1300, 560, 300, 120); x.beginPath(); x.rect(1300, 560, 300, 120); x.clip(); words(x, 'a line that scrolls through its window', 1320, 630); x.restore();
  // a card that springs open for the first moment only
  const w = t < 0.5 ? 120 : 400; card(x, 1300, 760, w, 120); words(x, 'springs open', 1320, 830);
  // a ring around a word holds that word, not the one written across its rim, where a table's rule runs
  x.strokeStyle = '#e8c36a'; x.lineWidth = 3; x.beginPath(); x.arc(700, 250, 80, 0, Math.PI * 2); x.stroke(); x.fillStyle = '#ffffff'; x.fillRect(560, 329, 280, 2);
  words(x, 'home', 700, 260, { align: 'center' }); words(x, 'creates', 700, 335, { align: 'center', size: 40 });
  // ... and a badge too small for its number is one it leaves
  x.fillStyle = '#7fb0ff'; x.beginPath(); x.arc(620, 440, 34, 0, Math.PI * 2); x.fill(); words(x, '1,250', 620, 452, { align: 'center', size: 34, color: '#0a0e17' });
  // a highlighter's band, as tall as its line: the tails of the letters hang below it
  x.fillStyle = 'rgba(255,214,102,0.85)'; x.fillRect(900, 100, 200, 40); words(x, 'gypsy', 910, 138, { size: 40, color: '#20160c' });
  // a card with a sheen that fades to nothing halfway down, and a mark struck through it: the sheen has no lower edge to leave
  card(x, 880, 380, 260, 130); const sh = x.createLinearGradient(0, 380, 0, 440); sh.addColorStop(0, 'rgba(255,255,255,0.3)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = sh; x.fillRect(880, 380, 260, 60); x.strokeStyle = '#ff5a4a'; x.lineWidth = 10; x.beginPath(); x.moveTo(890, 446); x.lineTo(1130, 434); x.stroke(); words(x, 'Lock 1', 900, 446, { size: 40 });
  // words given a width to keep to: the browser squeezes them into it
  card(x, 1500, 100, 300, 120); x.font = '600 28px sans-serif'; x.textAlign = 'left'; x.fillStyle = '#ffffff'; x.fillText('squeezed to the width given', 1520, 170, 260);
}
// the engine's caption: larger as the player gets smaller, in a box made from its words
function drawCaption(x, S, t) { if (!CAPS_ON) return; const css = x.canvas.getBoundingClientRect().width || 1920, k = Math.min(2.4, Math.max(1, 15 * 1920 / css / 40)), size = 40 * k;
  x.setTransform(S, 0, 0, S, 0, 0); x.font = '600 ' + size + 'px sans-serif'; x.textAlign = 'center'; const s = 'A caption, larger here.', w = x.measureText(s).width;
  x.fillStyle = 'rgba(0,0,0,0.6)'; x.beginPath(); x.roundRect(960 - w / 2 - 30, 1000 - size * 1.2, w + 60, size * 1.6, 12); x.fill(); x.fillStyle = '#fff'; x.fillText(s, 960, 1000); }
window.__READY__ = true;
</script>"""


def browser():
    try:
        from playwright.sync_api import sync_playwright
        p = sync_playwright().start()
    except Exception:
        return None, None
    try:
        return p, fits.launch(p)
    except Exception:
        p.stop()
        return None, None


class PageTests(unittest.TestCase):
    """What the page's part sees in a made-up film. It needs the browser the film checks use, so it is skipped without one."""

    @classmethod
    def setUpClass(cls):
        cls.p, cls.b = browser()
        if not cls.b:
            raise unittest.SkipTest("no browser here: the film checks install one")
        cls.dir = tempfile.TemporaryDirectory()
        cls.page = pathlib.Path(cls.dir.name) / "render.html"
        cls.page.write_text(FILM, encoding="utf-8")

    @classmethod
    def tearDownClass(cls):
        cls.b.close(); cls.p.stop(); cls.dir.cleanup()

    def measured(self, scale):
        r = fits.collect(self.b, self.page, 0.5, scale)
        self.assertEqual((r["total"], len(r["frames"])), (3, 6))
        return fits.measure_frames(r["frames"])

    def test_it_finds_the_words_that_leave_their_box_and_only_those(self):
        for scale in (0.25, 1):
            stats = self.measured(scale)
            never, awhile, briefly = fits.sort(stats)
            self.assertEqual(sorted(x["s"] for x in never), ["1,250", "far too long for the card it was laid out in", "too long on its layer too"], scale)
            self.assertEqual(awhile, [])
            self.assertEqual([x["s"] for x in briefly], ["springs open"])
            self.assertEqual(stats[("one", "fits its card")]["bad"], 0)
            self.assertNotIn(("one", "A title wider than its glow"), {k for k, v in stats.items() if v["bad"]})
            self.assertEqual(stats[("one", "a line that scrolls through its window")]["cut"], 6)
            self.assertFalse(any(v["bad"] for k, v in stats.items() if k[1] == "off the shelf"))
            for fine in ("home", "creates", "gypsy", "Lock 1", "squeezed to the width given"):
                self.assertEqual(stats[("one", fine)]["bad"], 0, (fine, scale))
            self.assertEqual(stats[("one", "1,250")]["bad"], 6, scale)

    def test_a_picture_brings_its_words_to_where_it_is_drawn(self):
        st = self.measured(0.25)[("one", "too long on its layer too")]
        # the layer's card, 300 wide at (10, 10), is drawn at one and a half times its size from (100, 560)
        self.assertEqual([round(v) for v in st["b"]], [115, 575, 565, 755])
        self.assertEqual((st["side"], st["lay"]), ("right", 1))

    def test_captions_are_measured_as_a_phone_draws_them(self):
        r = fits.collect(self.b, self.page, 0.5, 0.25, phone=fits.PHONE)
        self.assertEqual(len(r["frames"]), 1)
        t = r["frames"][0]["texts"][0]
        self.assertEqual((t["s"], t["px"]), ("A caption, larger here.", 96))
        self.assertEqual(fits.captions(r["frames"]), [])

    def test_it_names_who_drew_the_words(self):
        self.assertEqual(fits.collect(self.b, self.page, 0.5, 0.25, who=[[1, "fits its card"]]), ["words"])


class WaysTests(unittest.TestCase):
    """Each film is drawn both ways (fits.WAYS), so the check finds the same on the machine a film is made on, where letters sit
    where their font says, and on the one that checks it and renders the video, which moves each letter to a whole pixel."""

    def parts(self, *pasts):
        """what sort() finds each way, for one line that ends this far past its card's right edge in each"""
        return [fits.sort(fits.measure_frames(moments(text("a line", 130, 140, 500 + past, 168, [box(*CARD, v=[40] * 4)])))) for past in pasts]

    def test_a_fault_one_way_is_a_fault_and_the_line_says_which(self):
        never, awhile, briefly = fits.both(self.parts(0.2, 3.0))
        self.assertEqual([(x["s"], x["mx"], x["ways"]) for x in never], [("a line", 3.0, ["video"])])
        self.assertTrue(fits.line(never[0]).endswith("in the video only"), fits.line(never[0]))
        never, awhile, briefly = fits.both(self.parts(3.0, 0.2))
        self.assertTrue(fits.line(never[0]).endswith("in the site's player only"), fits.line(never[0]))

    def test_a_fault_both_ways_is_listed_once_by_the_way_it_is_worst_in(self):
        never, awhile, briefly = fits.both(self.parts(4.0, 6.5))
        self.assertEqual([(x["mx"], x["ways"]) for x in never], [(6.5, ["player", "video"])])
        self.assertNotIn("only", fits.line(never[0]))
        self.assertEqual(fits.both(self.parts(0.2, 0.4)), ([], [], []))

    @unittest.skipUnless(sys.platform.startswith("linux"), "only Linux has both ways: elsewhere the browser places letters its own way, and CI holds the other")
    def test_each_way_places_letters_its_own_way_whatever_the_machine(self):
        import base64
        p, b = browser()
        if not b:
            raise unittest.SkipTest("no browser here: the film checks install one")
        b.close()
        font = base64.b64encode((ROOT / "films" / "inner-life-of-data" / "source" / "fonts" / "manrope-latin.woff2").read_bytes()).decode()
        with tempfile.TemporaryDirectory() as d:
            page = pathlib.Path(d) / "page.html"
            page.write_text('<!doctype html><meta charset="utf-8"><style>@font-face{font-family:M;src:url(data:font/woff2;base64,%s)}</style>' % font, encoding="utf-8")
            wide = []
            try:
                for way in range(len(fits.WAYS)):
                    b = fits.launch(p, way)
                    pg = b.new_page()
                    pg.goto(page.as_uri())
                    wide.append(pg.evaluate("""async () => { await document.fonts.load('600 28px M'); const x = document.createElement('canvas').getContext('2d');
                        return [28, 280].map(px => { x.font = '600 ' + px + 'px M'; return x.measureText('one row per credential awarded').width; }); }"""))
                    b.close()
            finally:
                p.stop()
        (small, large), (whole, _) = wide
        # the player: each letter where its font says, so the same words at ten times the size are ten times as wide
        self.assertAlmostEqual(small * 10, large, delta=0.05)
        self.assertGreater(abs(small - round(small)), 0.01)
        # the video: every letter on a whole pixel, and the line a little wider or narrower for it
        self.assertAlmostEqual(whole, round(whole), delta=1e-6)
        self.assertGreater(abs(whole - small), 0.5)


class WhereTests(unittest.TestCase):
    """CI runs the check from each film's source folder, in the film's language (affected.py's steps)."""

    def setUp(self):
        import films
        self.inv = {e["key"]: e for e in films.films()}

    def test_every_film_is_found_from_its_own_folder(self):
        for e in self.inv.values():
            got = fits.at(ROOT / e["dir"], e["lang"], self.inv)
            self.assertIsNotNone(got, e["key"])
            self.assertEqual((got[0], got[2]), (e["key"], fits.entry_page(e)))

    def test_the_first_films_have_no_film_json_and_are_found_by_their_release_entry(self):
        src = ROOT / "films/inner-life-of-data/source"
        self.assertFalse((src / "film.json").exists())
        self.assertEqual(fits.at(src, "en", self.inv)[0], "inner-life-of-data-en")
        key, _, page, _ = fits.at(src, "es", self.inv)
        self.assertEqual((key, page), ("inner-life-of-data-es", src / "dist" / "es" / "render.html"))

    def test_a_film_being_made_is_found_by_its_film_json(self):
        with tempfile.TemporaryDirectory() as d:
            src = pathlib.Path(d).resolve() / "9-a-new-film" / "source"
            src.mkdir(parents=True)
            self.assertIsNone(fits.at(src, "en", self.inv))
            (src / "film.json").write_text("{}", encoding="utf-8")
            self.assertEqual(fits.at(src, "en", self.inv), ("9-a-new-film", None, src / "dist" / "render.html", src))

    def test_a_folder_that_is_no_films_is_refused(self):
        self.assertIsNone(fits.at(ROOT / "site-tools", "en", self.inv))


if __name__ == "__main__":
    unittest.main()
