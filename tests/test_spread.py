"""Where the right answer sits: check_site.py reads a pack of labs and scenarios as written, and tells a spread pack from one
whose answers can be found by their place."""
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
import check_site as C

# a small pack in the shape of a series' own: comments, apostrophes, brackets and escaped quotes inside the words
PACK = r'''/* A pack. It's "ours": labs:[ and qs:[ each start a line. */
window.X={lang:"en",
labs:[
{id:"write",kind:"compose",film:1,chapter:"a",c:"#000000",name:"Write it",
  w:{slots:[{label:"One",opts:[{t:"right [one], it's \"this\"",ok:true,why:"Yes."},{t:"wrong",ok:false,why:"No: {see}."}]},
    {label:"Two",opts:[{t:"wrong",why:"No."},{t:"right",ok:true,why:"Yes."}]}]}},
{id:"boxes",kind:"sort",film:1,chapter:"b",c:"#000000",name:"Sort it",
  w:{buckets:[["a","A"],["b","B"]],items:[{t:"one",b:"b",why:"."},{t:"two",b:"a",why:"."},{t:"three",b:"b",why:"."}]}},
{id:"look",kind:"pick",film:2,chapter:"c",c:"#000000",name:"Look",w:{opts:[["x","X"],["y","Y"]]}}
],
qs:[
{type:"choice",n:11,lab:"write",film:1,title:"First, (really)",sit:"A sit with opts:[ in its words.",
  opts:[{t:"no",why:"."},{t:"yes",ok:true},{t:"no again",why:"."}],why:"Because."},
{type:"order",n:12,lab:"write",film:1,title:"Second",items:["a","b","c"],why:"."},
{type:"choice",n:21,lab:"look",film:2,title:"Third",opts:[{t:"yes",ok:true},{t:"no",why:"."},{t:"no",why:"."}],why:"."}
],
done:[["a","b"]]};
'''


def pack(text, name="learn.en.js"):
    d = pathlib.Path(tempfile.mkdtemp(dir=ROOT / "tests"))
    (d / name).write_text(text, encoding="utf-8")
    return d / name


class Spread(unittest.TestCase):
    def setUp(self):
        self.made = []

    def tearDown(self):
        for p in self.made:
            for f in p.parent.iterdir():
                f.unlink()
            p.parent.rmdir()

    def read(self, text, name="learn.en.js"):
        p = pack(text, name)
        self.made.append(p)
        return C.learn_pack(p), p.relative_to(ROOT)

    def test_reads_a_pack_as_written(self):
        P, _ = self.read(PACK)
        self.assertEqual([q["type"] for q in P["qs"]], ["choice", "order", "choice"])
        self.assertEqual(P["qs"][0]["title"], "First, (really)")
        self.assertEqual(P["qs"][0]["opts"], [("no", False), ("yes", True), ("no again", False)])
        self.assertEqual((P["qs"][1]["n"], P["qs"][1]["start"]), (3, None))
        self.assertEqual(list(P["labs"]), ["write", "boxes", "look"])
        self.assertEqual(P["labs"]["write"]["rows"][0][0], ('right [one], it\'s "this"', True))
        self.assertEqual([[r for _, r in row] for row in P["labs"]["write"]["rows"]], [[True, False], [False, True]])
        self.assertEqual(P["labs"]["boxes"]["boxes"], [1, 0, 1])
        self.assertEqual(P["labs"]["look"]["rows"], [])  # options to look at, none marked right

    def test_a_spread_pack_passes(self):
        P, rel = self.read(PACK)
        self.assertEqual(C.spread_faults(rel, P, set(P["labs"])), [])

    def test_every_answer_in_one_place_fails(self):
        P, rel = self.read(PACK.replace('{t:"yes",ok:true},{t:"no",why:"."},{t:"no",why:"."}', '{t:"no",why:"."},{t:"yes",ok:true},{t:"no",why:"."}'))
        out = C.spread_faults(rel, P, set(P["labs"]))
        self.assertEqual(len(out), 1, out)
        self.assertIn("option 2 in 2 of its 2 scenarios", out[0])

    def test_a_lab_with_every_row_first_fails_only_where_a_page_shows_it(self):
        text = PACK.replace('{t:"wrong",why:"No."},{t:"right",ok:true,why:"Yes."}', '{t:"right",ok:true,why:"Yes."},{t:"wrong",why:"No."}')
        P, rel = self.read(text)
        out = C.spread_faults(rel, P, set(P["labs"]))
        self.assertTrue(any('lab "write"' in x and "every row" in x for x in out), out)
        self.assertEqual(C.spread_faults(rel, P, {"boxes"}), [])

    def test_cards_box_by_box(self):
        for boxes, want in (([0, 0, 1, 1], True), ([1, 1, 0, 0], True), ([0, 1, 2, 3], True), ([2, 0, 3, 1], False), ([0, 1, 1, 0], False),
                            ([0, 1, 0], False), ([0, 0, 1], True), ([0, 1], False), ([0, 0, 0], False), ([3, 2, 1, 0], False)):
            self.assertEqual(C.box_by_box(boxes), want, boxes)
        P, rel = self.read(PACK.replace('{t:"one",b:"b",why:"."},{t:"two",b:"a",why:"."}', '{t:"two",b:"a",why:"."},{t:"one",b:"b",why:"."}'))
        self.assertTrue(any("box by box (1, 2, 2)" in x for x in C.spread_faults(rel, P, set(P["labs"]))))

    def test_how_many_in_one_place(self):
        self.assertEqual([C.spread_most(n, k) for n, k in ((2, 4), (3, 3), (3, 2), (5, 2), (6, 4), (7, 3), (7, 4), (12, 2))], [1, 1, 2, 3, 3, 3, 3, 6])

    def test_the_spanish_pack_keeps_the_english_places(self):
        P, rel = self.read(PACK)
        same, _ = self.read(PACK.replace("First, (really)", "Primero"), "learn.es.js")
        self.assertEqual(C.spread_faults(rel, P, set(P["labs"]), same), [])
        moved, _ = self.read(PACK.replace('{t:"no",why:"."},{t:"yes",ok:true},{t:"no again",why:"."}', '{t:"yes",ok:true},{t:"no",why:"."},{t:"no again",why:"."}'), "learn.es.js")
        out = C.spread_faults(rel, P, set(P["labs"]), moved)
        self.assertEqual(len(out), 1, out)
        self.assertIn("learn.es.js: scenario 1", out[0])

    def test_an_order_that_starts_in_order_fails(self):
        P, rel = self.read(PACK.replace('items:["a","b","c"],', 'items:["a","b","c"],start:[0,1,2],'))
        self.assertTrue(any("not in order" in x for x in C.spread_faults(rel, P, set())))
        P, rel = self.read(PACK.replace('items:["a","b","c"],', 'items:["a","b","c"],start:[2,0,1],'))
        self.assertEqual(C.spread_faults(rel, P, set()), [])

    def test_the_first_films_questions_are_read_from_its_pack(self):
        text = ('window.LEARN={lang:"en",\nstops:{a:{lab:{qs:[{q:"Not a Pause and think question",eng:"x"}]}}},\n'
                'think:{ui:{toggle:"Pause"},\n  qs:{\n  "in":{stop:"a",q:"One?",opts:[{t:"aaa"},{t:"bbb",near:true},{t:"ccc",ok:true}],why:"."},\n'
                '  "next":{stop:"b",more:{href:"x/",label:"Go deeper: {it}"},q:"Two?",opts:[{t:"aaa",ok:true},{t:"bbb",near:true},{t:"ccc"}],why:"."}}},\n'
                'quiz:{ui:{},\n  qs:[\n  {stop:"a",type:"choice",title:"T",opts:[{t:"x",ok:true},{t:"y",why:"."}],why:"."}\n  ]}};\n')
        p = pack(text)
        self.made.append(p)
        qs = C.think_questions(p)
        self.assertEqual(list(qs), ["in", "next"])
        self.assertEqual(qs["next"], [("aaa", True, False), ("bbb", False, True), ("ccc", False, False)])
        self.assertEqual(C.think_faults(p), [])
        self.assertEqual([q["title"] for q in C.learn_pack(p)["qs"]], ["T"])


if __name__ == "__main__":
    unittest.main()
