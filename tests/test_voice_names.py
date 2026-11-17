"""Names in the voice: check_site.py takes each line as the voice reads it, and finds a name the voice would misread as written."""
import json
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
import check_site as C

LINES = [
    {"id": "plain", "gap": 0.8, "text": "W. Edwards Deming taught it in Japan in 1950."},
    {"id": "long", "gap": 0.8, "text": "Deming preferred study.", "say": "Deeming preferred study."},
    {"id": "short", "gap": 0.8, "text": "Deming preferred study.", "say": "Demming preferred study."},
    {"id": "other", "gap": 0.8, "text": "They were deeming it done, and redeeming nothing."},
]


def film(lines, say=None):
    """a film's source folder, as the voice tool finds it: src/narration.js, and film.json when the film respells words"""
    d = pathlib.Path(tempfile.mkdtemp(dir=ROOT / "tests"))
    (d / "src").mkdir()
    (d / "src" / "narration.js").write_text('const NARR={\n"one":{"name":"One","lead":1,"tail":1,"vo":' + json.dumps(lines) + "}\n};\n", encoding="utf-8")
    if say is not None:
        (d / "film.json").write_text(json.dumps({"key": "a-film", "say": say}), encoding="utf-8")
    return d


class VoiceNames(unittest.TestCase):
    def setUp(self):
        self.made = []

    def tearDown(self):
        for d in self.made:
            for f in sorted(d.rglob("*"), reverse=True):
                f.rmdir() if f.is_dir() else f.unlink()
            d.rmdir()

    def faults(self, lines, say=None):
        d = film(lines, say)
        self.made.append(d)
        return C.voice_names(d / "src" / "narration.js")

    def test_a_name_as_written_is_found_in_the_text_and_in_the_say(self):
        out = self.faults(LINES)
        self.assertEqual(len(out), 2)
        self.assertIn('one/plain: the voice would read "Deming"', out[0])
        self.assertIn('one/long: the voice would read "Deeming"', out[1])
        self.assertIn('spell it "Demming"', out[0])

    def test_a_line_that_spells_it_for_the_voice_passes(self):
        self.assertEqual(self.faults([LINES[2]]), [])

    def test_the_films_own_respelling_counts(self):
        self.assertEqual(self.faults(LINES[:1], [["\\bJun\\b", "Joon"], ["\\bDeming\\b", "Demming"]]), [])
        self.assertEqual(self.faults(LINES[:1], [["\\bW\\. Edwards Deming\\b", "W Edwards Demming"]]), [])

    def test_a_respelling_for_another_word_does_not(self):
        self.assertEqual(len(self.faults(LINES[:1], [["\\bJun\\b", "Joon"]])), 1)

    def test_the_plain_word_is_left_alone(self):
        self.assertEqual(self.faults([LINES[3]]), [])

    def test_a_story_told_by_several_films_says_its_names_one_way(self):
        bridge = [{"id": "where", "gap": 0.8, "text": "At Quehue, a bridge of grass rope crosses the Apurímac river."},
                  {"id": "who", "gap": 0.8, "text": "Quechua-speaking families make it as minka. Minka is unpaid work."}]
        out = self.faults(bridge)
        self.assertEqual(len(out), 5)
        self.assertIn('one/where: the voice would read "Quehue"', out[0])
        self.assertIn('spell it "Kehweh"', out[0])
        self.assertIn('spell it "Ahpooreemahk"', out[1])
        self.assertIn('spell it "Ketchwa"', out[2])
        self.assertIn('spell it "meenka"', out[3])
        agreed = [["\\bQuehue\\b", "Kehweh"], ["\\bApurímac\\b", "Ahpooreemahk"], ["\\bQuechua\\b", "Ketchwa"], ["\\b[Mm]inka\\b", "meenka"]]
        self.assertEqual(self.faults(bridge, agreed), [])
        # the spellings two of the films first used, set aside when the series settled on one
        out = self.faults(bridge[:1], [["\\bQuehue\\b", "Keway"], ["\\bApurímac\\b", "Apooreemak"]])
        self.assertEqual(len(out), 2)
        self.assertIn('the voice would read "Keway"', out[0])
        self.assertIn('spell it "Kehweh"', out[0])
        self.assertIn('the voice would read "Apooreemak"', out[1])
        # a longer word that only starts the same way is another word
        self.assertEqual(self.faults([{"id": "x", "gap": 0.8, "text": "The Quechuan languages are a family."}]), [])

    def test_ai_is_said_whole_after_the_voice_tools_own_respellings(self):
        line = [{"id": "ai", "gap": 0.8, "text": "Next: AI and continuous architecture."}]
        self.assertEqual(self.faults(line), [])
        out = self.faults([{"id": "ai", "gap": 0.8, "text": "AI helps.", "say": "A I helps."}])
        self.assertEqual(len(out), 1)
        self.assertIn('spell it "AI"', out[0])
        # a voice tool that spells AI "A I", as the shared one did until 16 November 2026, is read before the film's own words
        d = film(line)
        self.made.append(d)
        (d / "tools").mkdir()
        (d / "tools" / "tts.py").write_text("SAY = [(r'\\bdbt\\b', 'D B T'), (r'\\bAI\\b', 'A I')] + []\n", encoding="utf-8")
        self.assertEqual(len(C.voice_names(d / "src" / "narration.js")), 1)
        (d / "film.json").write_text(json.dumps({"key": "a-film", "say": [["\\bA I\\b", "AI"]]}), encoding="utf-8")
        self.assertEqual(C.voice_names(d / "src" / "narration.js"), [])

    def test_a_name_the_films_share_is_said_one_way(self):
        line = [{"id": "who", "gap": 0.8, "text": "Anil runs the sales team."}]
        out = self.faults(line)
        self.assertEqual(len(out), 1)
        self.assertIn('one/who: the voice would read "Anil"', out[0])
        self.assertIn('spell it "Unnil"', out[0])
        self.assertEqual(self.faults(line, [["\\bAnil\\b", "Unnil"]]), [])
        # a spelling set aside on 17 November 2026, which the voice says another way
        out = self.faults(line, [["\\bAnil\\b", "Ah-neel"]])
        self.assertEqual(len(out), 1)
        self.assertIn('the voice would read "Ah-neel"', out[0])

    def test_every_time_a_line_names_it(self):
        # a line's own "say" that spells the name once, and another way the second time, still names it twice
        out = self.faults([{"id": "two", "gap": 0.8, "text": "Anil asked, and Anil waited.", "say": "Unnil asked, and Aneel waited."}])
        self.assertEqual(len(out), 1)
        self.assertIn("names Anil 2 time(s) and gives the voice \"Unnil\" 1", out[0])
        self.assertEqual(self.faults([{"id": "two", "gap": 0.8, "text": "Anil asked, and Anil waited.", "say": "Unnil asked, and unnil waited."}]), [])

    def test_the_films_still_to_say_a_name_one_way_are_left_out_for_that_name_only(self):
        d = film([{"id": "who", "gap": 0.8, "text": "Noor and Anil agree."}])
        self.made.append(d)
        narr = d / "src" / "narration.js"
        self.assertEqual(len(C.voice_names(narr)), 2)
        out = C.voice_names(narr, later=["Noor"])
        self.assertEqual(len(out), 1)
        self.assertIn('"Anil"', out[0])
        self.assertEqual(C.voice_names(narr, later=["Noor", "Anil"]), [])

    def test_no_word_is_respelled_two_ways(self):
        a = film([{"id": "a", "gap": 0.8, "text": "Ingest it with Zerobus."}], [["\\bZerobus\\b", "Zero bus"]])
        b = film([{"id": "b", "gap": 0.8, "text": "Zerobus writes the rows."}], [["\\bZerobus\\b", "Zero-bus"]])
        c = film([{"id": "c", "gap": 0.8, "text": "Zerobus writes the rows."}], [["\\bZerobus\\b", "Zeerobus"]])
        unused = film([{"id": "d", "gap": 0.8, "text": "Nothing to respell here."}], [["\\bZerobus\\b", "Zed bus"]])
        self.made += [a, b, c, unused]
        voices = [x / "src" / "narration.js" for x in (a, b, unused)]
        # a hyphen gives the voice the same sounds as a space, and a pair that changes no line is not read
        self.assertEqual(C.voice_respellings(voices), [])
        out = C.voice_respellings(voices + [c / "src" / "narration.js"])
        self.assertEqual(len(out), 1)
        self.assertEqual(out[0][0], "Zerobus")
        self.assertEqual(sorted(out[0][1]), ["zeerobus", "zero bus"])
        # a film still to voice again for the name keeps its old respelling until then
        later = {C.voice_film(c / "src" / "narration.js"): ["Zerobus"]}
        self.assertEqual(C.voice_respellings(voices + [c / "src" / "narration.js"], later), [])

    def test_the_list_of_films_still_to_fix_names_real_films_and_names(self):
        later = json.loads(C.VOICE_LATER.read_text(encoding="utf-8"))
        for film_dir, names in later.items():
            self.assertTrue((ROOT / "films" / film_dir / "source" / "src" / "narration.js").exists(), film_dir)
            for n in names:
                self.assertTrue(any(r[0].search(n) for r in C.VOICE_NAMES), f"{film_dir}: {n}")

    def test_a_tts_that_only_runs_a_series_tool_uses_the_shared_voice_tools_words(self):
        self.assertIn((r"\bdbt\b", "D B T"), C.tool_respellings(ROOT / "films/platform-and-solution-architecture/8-built-to-change/source"))
        self.assertNotIn("A I", [b for _, b in C.tool_respellings(ROOT / "films/platform-and-solution-architecture/8-built-to-change/source")])


if __name__ == "__main__":
    unittest.main()
