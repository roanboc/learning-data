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


if __name__ == "__main__":
    unittest.main()
