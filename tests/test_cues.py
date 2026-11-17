"""The words a film's pictures wait for (films/data-governance/shared/tools/cues.py): the build stops on one its line doesn't say,
however the film writes the helper, and never on a name that only looks like it."""
import json
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
# last on the path, as the films' own tools put it, so its lang.py and build.py hide nobody's
sys.path.append(str(ROOT / "films/data-governance/shared/tools"))
import cues

NARR = {
    "port": {"name": "The port", "lead": 1, "tail": 1, "vo": [
        {"id": "cost", "gap": 0.8, "text": "Loading costs under 16 cents a ton, against $5.83 by hand.",
         "say": "Loading costs under sixteen cents a ton, against five dollars eighty-three by hand."},
        {"id": "pair", "gap": 0.8, "text": "Through June, Sam works beside Noor, Jun and Erin, against the clock, again and again."},
        {"id": "same", "gap": 0.8, "text": "The first chapter says ships."}]},
    "team": {"name": "The team", "lead": 1, "tail": 1, "vo": [
        {"id": "plan", "gap": 0.8, "text": "The plan changes: the reports move in August."},
        {"id": "same", "gap": 0.8, "text": "The second chapter says reports."}]},
}
SHORT = 'const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);'


def scene(sid, body, short=SHORT):
    return 'scene("%s",(ctx,S,t,sc)=>{%s\n%s\n});\n' % (sid, short, body)


class Film:
    """a film's source folder: src/narration.js, its scene files, and tools/score.py when it has a score"""

    def __init__(self, narr=NARR):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = pathlib.Path(self.tmp.name) / "film" / "source"
        (self.root / "src").mkdir(parents=True)
        (self.root / "tools").mkdir()
        (self.root / "src" / "narration.js").write_text("const NARR=" + json.dumps(narr) + ";\n", encoding="utf-8")
        self.files = []

    def write(self, name, js, folder=None):
        f = (folder or self.root / "src") / name
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(js, encoding="utf-8")
        self.files.append(f)
        return self

    def faults(self):
        return cues.misplaced(self.root / "src" / "narration.js", self.files, self.root / "tools" / "score.py")


class CueWords(unittest.TestCase):
    def setUp(self):
        self.film = Film()
        self.addCleanup(self.film.tmp.cleanup)

    def faults(self, js):
        return self.film.write("scenes.js", js).faults()

    # ---- what is read
    def test_the_helper_written_in_full_is_read_as_before(self):
        out = self.faults(scene("port", 'draw(wAt(sc,"cost","sixteen",-0.2),wAt(sc,"cost","16"));', short=""))
        self.assertEqual(out, ['scenes.js, line 2: port/cost: "16" isn\'t in what the voice reads'])

    def test_a_short_name_for_the_helper_is_read(self):
        # A path for every provider: the voice reads the figures as words, so "16" and "5.83" are never said
        out = self.faults(scene("port", 'const b0=w("cost","16",-0.2),h0=w("cost","5.83",-0.2),ok=w("cost","sixteen");'))
        self.assertEqual(out, ['scenes.js, line 2: port/cost: "16" isn\'t in what the voice reads',
                               'scenes.js, line 2: port/cost: "5.83" isn\'t in what the voice reads'])

    def test_every_way_the_films_write_the_short_name(self):
        for short in ('const w=(id,s,o)=>wAt(sc,id,s,o);', 'const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");',
                      'const w=(id,s)=>wAt(sc,id,s);', 'const A=(id,w,o)=>wAt(sc,id,w,o),w=A;', 'let w;w=(id,s,o)=>wAt(sc,id,s,o);',
                      'const w = (id, word, off) => wAt(sc, id, word, off);'):
            with self.subTest(short=short):
                name = "A" if "A=" in short else "w"
                film = Film(); self.addCleanup(film.tmp.cleanup)
                out = film.write("scenes.js", scene("team", 'x(%s("plan","July"), %s( "plan" , "August" , 0.1 ));' % (name, name), short=short)).faults()
                self.assertEqual(out, ['scenes.js, line 2: team/plan: "July" isn\'t in what the voice reads'])

    def test_keeping_it_trues_helper_is_the_same_one(self):
        out = self.faults(scene("team", 'x(kt_w(sc,"plan","July"),kt_w(sc,"plan","August"));', short=""))
        self.assertEqual(out, ['scenes.js, line 2: team/plan: "July" isn\'t in what the voice reads'])

    def test_a_word_that_first_comes_inside_a_longer_one(self):
        # The team comes first: Jun came in on "June", five words before he is named
        out = self.faults(scene("port", 'x(w("pair","Jun",-0.3),w("pair","Jun and"),w("pair","again"),w("pair","Sam works"),w("pair","Sam wor"));'))
        self.assertEqual(out, ['scenes.js, line 2: port/pair: "Jun" first comes inside a longer word ("June")',
                               'scenes.js, line 2: port/pair: "again" first comes inside a longer word ("against")',
                               'scenes.js, line 2: port/pair: "Sam wor" first comes inside a longer word ("Sam works")'])

    def test_each_chapters_short_name_reads_its_own_chapter(self):
        js = scene("port", 'x(w("same","ships"),w("same","reports"));') + scene("team", 'x(w("same","ships"),w("same","reports"));')
        self.assertEqual(self.faults(js), ['scenes.js, line 2: port/same: "reports" isn\'t in what the voice reads',
                                           'scenes.js, line 5: team/same: "ships" isn\'t in what the voice reads'])

    def test_a_line_the_chapter_does_not_have(self):
        self.assertEqual(self.faults(scene("team", 'x(w("cost","sixteen"));')), ["scenes.js, line 2: no line team/cost"])

    def test_a_scene_written_as_a_function(self):
        js = 'scene("team",function(ctx,S,t,sc){const w=(id,s,o)=>wAt(sc,id,s,o);\nx(w("plan","July"));});\n'
        self.assertEqual(self.faults(js), ['scenes.js, line 2: team/plan: "July" isn\'t in what the voice reads'])

    # ---- only where the name really is the helper
    def test_a_name_that_wraps_something_else_is_not_read(self):
        for short in ('const w=(id,s)=>width(sc,id,s);', 'const w=(id,s,o)=>wAt(sc,s,id,o);', 'const w=(id,s,o)=>wAt(other,id,s,o);',
                      'const w=(id,s,o)=>wAt(sc,id,s,o)*2;', 'const w=(a,b)=>a+b;'):
            with self.subTest(short=short):
                film = Film(); self.addCleanup(film.tmp.cleanup)
                self.assertEqual(film.write("scenes.js", scene("team", 'x(w("plan","July"));', short=short)).faults(), [])

    def test_a_parameter_of_the_same_name_hides_the_helper(self):
        body = ('const wide=["plan"].map(w=>w("plan","July"));\n'
                'function box(x,w){return w("plan","July");}\n'
                'const tall=(h,w)=>{const a=w("plan","July");return a;};\n'
                'x(w("plan","never said"));')
        self.assertEqual(self.faults(scene("team", body)), ['scenes.js, line 5: team/plan: "never said" isn\'t in what the voice reads'])

    def test_another_declaration_of_the_name_hides_it_to_the_end_of_its_block(self):
        body = ('if(t>1){const w=pick(S);x(w("plan","July"));}\n'
                'for(const w of marks){x(w("plan","July"));}\n'
                'x(w("plan","never said"));')
        self.assertEqual(self.faults(scene("team", body)), ['scenes.js, line 4: team/plan: "never said" isn\'t in what the voice reads'])

    def test_a_name_given_another_value_is_no_longer_read(self):
        body = 'x(w("plan","first"));\nw=other;\nx(w("plan","July"));'
        self.assertEqual(self.faults(scene("team", body, short='let w=(id,s,o)=>wAt(sc,id,s,o);')),
                         ['scenes.js, line 2: team/plan: "first" isn\'t in what the voice reads'])

    def test_a_short_name_does_not_outlive_its_chapter(self):
        js = scene("port", 'x(w("cost","sixteen"));') + 'scene("team",(ctx,S,t,sc)=>{\nx(w("plan","July"));\n});\n'
        self.assertEqual(self.faults(js), [])

    def test_comments_strings_and_methods_are_not_calls(self):
        body = ('// x(w("plan","July"), wAt(sc,"plan","July"))\n'
                '/* w("plan","July") */ const s=\'w("plan","July")\',q="wAt(sc,\\"plan\\",\\"July\\")";\n'
                'x(o.w("plan","July"),wc_glowAt(sc,"plan","July"),o?.w("plan","July"));')
        self.assertEqual(self.faults(scene("team", body)), [])

    def test_a_word_from_a_list_is_not_read(self):
        body = 'const ts=["July","August"].map(k=>w("plan",k)),u=w(id,"July"),v=w("plan",words[i]);'
        self.assertEqual(self.faults(scene("team", body)), [])

    # ---- a function outside the scenes, handed its sc
    def test_outside_the_scenes_any_chapter_with_the_line_will_do(self):
        js = ('function marks(sc){const w=(id,s)=>wAt(sc,id,s);\n'
              'return [w("same","ships"),w("same","reports"),w("same","boats"),w("plan","July"),wAt(sc,"cost","sixteen"),w("nowhere","word")];}\n'
              + scene("port", "marks(sc);"))
        self.assertEqual(self.faults(js), ['scenes.js, line 2: port/same: "boats" isn\'t in what the voice reads',
                                           'scenes.js, line 2: team/plan: "July" isn\'t in what the voice reads',
                                           'scenes.js, line 2: no line "nowhere" in any chapter'])

    def test_an_inner_function_with_its_own_sc_is_outside_the_scenes(self):
        body = 'const other=(sc)=>{const v=(id,s)=>wAt(sc,id,s);return v("cost","sixteen")+wAt(sc,"cost","sixteen");};'
        self.assertEqual(self.faults(scene("team", body)), [])  # team has no line "cost", but this sc is whoever calls other()

    def test_a_shared_file_may_time_a_line_this_film_does_not_have(self):
        shared = pathlib.Path(self.film.tmp.name) / "shared" / "src"
        js = 'function kit_open(sc){const w=(id,s)=>wAt(sc,id,s);return [w("elsewhere","word"),w("plan","July")];}\n'
        out = self.film.write("kit.js", js, folder=shared).faults()
        self.assertEqual(out, ['kit.js, line 1: team/plan: "July" isn\'t in what the voice reads'])

    # ---- the rest of the file's contract
    def test_brackets_that_cannot_be_paired_fall_back_to_the_old_reading(self):
        js = scene("team", 'x(wAt(sc,"plan","July"),w("plan","July"));') + "}\n"
        self.assertEqual(self.faults(js), ['scenes.js, line 2: team/plan: "July" isn\'t in what the voice reads'])

    def test_a_file_that_names_no_helper_is_not_read(self):
        self.assertEqual(cues.moments('const w=(a,b)=>a+b;scene("x",()=>w("plan","July"));'), [])

    def test_the_score_is_read_as_before(self):
        (self.film.root / "tools" / "score.py").write_text(
            "soft(58, W('team', 'plan', 'August', -0.2), 0.03)\ntap(W('team', 'plan', 'their marts'), 0.02)\n", encoding="utf-8")
        self.assertEqual(self.film.faults(), ['score.py: team/plan: "their marts" isn\'t in what the voice reads'])

    def test_escaped_quotes_are_read_as_the_film_reads_them(self):
        narr = {"one": {"vo": [{"id": "a", "text": 'She said "go", and it\'s done.'}]}}
        film = Film(narr); self.addCleanup(film.tmp.cleanup)
        js = scene("one", 'x(w("a","\\"go\\""),w(\'a\',\'it\\\'s\'),w("a","it\\u0027s"),w("a","stop"));')
        self.assertEqual(film.write("scenes.js", js).faults(), ['scenes.js, line 2: one/a: "stop" isn\'t in what the voice reads'])


if __name__ == "__main__":
    unittest.main()
