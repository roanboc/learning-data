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


if __name__ == "__main__":
    unittest.main()
