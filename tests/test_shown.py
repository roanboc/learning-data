"""What a film drawn with the people kit times but never shows (films/people-first/shared/tools/shown.py): a shot listed before one
that starts no later never comes on screen, and a row of a board or a page still being written when its chapter ends is cut off."""
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
# last on the path, as the films' own tools put it, so the kit's lang.py and check.py hide nobody's
sys.path.append(str(ROOT / "films/people-first/shared/tools"))
import shown


def chapter(shots, rows=(), dur=60.0, end=None):
    return {"id": "pairs", "dur": dur, "lists": [{"end": dur if end is None else end, "shots": [{"at": a, "place": p} for a, p in shots]}],
            "rows": [dict(on="page", who="helena", words=w, mark=m, t0=t1 - 0.8, t1=t1) for w, m, t1 in rows]}


class Shots(unittest.TestCase):
    def test_in_order(self):
        self.assertEqual(shown.on_screen([{"at": 0}, {"at": 5}, {"at": 12}], 20), [(0.0, 5), (5, 7), (12, 8)])
        self.assertEqual(shown.problems([chapter([(0, "team"), (5, "corner"), (12, "campus")])])[2], [])

    def test_listed_before_one_that_starts_earlier(self):
        # Graham's answer from the campus, listed before mid-September but starting after it
        probs = shown.problems([chapter([(0, "team"), (38.0, "corner"), (44.3, "campus"), (43.9, "team"), (50.0, "corner")])])[2]
        self.assertEqual(len(probs), 1)
        self.assertIn("the shot at 44.3 s (campus) never shows", probs[0])
        self.assertIn("the shot at 43.9 s (team) is listed after it", probs[0])

    def test_same_time(self):
        probs = shown.problems([chapter([(0, "team"), (10, "corner"), (10, "campus")])])[2]
        self.assertEqual(len(probs), 1)
        self.assertIn("the shot at 10.0 s (corner) never shows", probs[0])

    def test_too_short(self):
        probs = shown.problems([chapter([(0, "team"), (10, "corner"), (10.6, "campus")])])[2]
        self.assertEqual(len(probs), 1)
        self.assertIn("on screen for 0.6 s", probs[0])

    def test_after_its_chapter(self):
        probs = shown.problems([chapter([(0, "team"), (61, "campus")])])[2]
        self.assertEqual(len(probs), 1)
        self.assertIn("starts after its chapter ends", probs[0])

    def test_the_last_runs_to_the_chapters_end(self):
        probs = shown.problems([chapter([(0, "team"), (59.5, "campus")], end=80)])[2]
        self.assertEqual(len(probs), 1)
        self.assertIn("the shot at 59.5 s (campus) is on screen for 0.5 s", probs[0])


class Rows(unittest.TestCase):
    def test_written_in_time(self):
        self.assertEqual(shown.problems([chapter([(0, "notes")], [("Read them together", "", 58.0), ("", "hl", 59.0)])])[2], [])

    def test_cut_off(self):
        probs = shown.problems([chapter([(0, "notes")], [("Growth: each one's own goals", "", 61.0)])])[2]
        self.assertEqual(len(probs), 1)
        self.assertIn('"Growth: each one\'s own goals" on Helena\'s page is written from 60.2 to 61.0 s, after its chapter ends', probs[0])

    def test_words_need_a_second_and_a_mark_less(self):
        probs = shown.problems([chapter([(0, "notes")], [("Nobody was slow", "", 59.2), ("Nobody was slow", "hl", 59.6)])])[2]
        self.assertEqual(len(probs), 1)
        self.assertIn('"Nobody was slow" on Helena\'s page is finished 0.8 s before its chapter ends (at least 1.0 s, to read it)', probs[0])
        probs = shown.problems([chapter([(0, "notes")], [("Nobody was slow", "hl", 59.9), ("", "tick", 60.4)])])[2]
        self.assertEqual(len(probs), 2)
        self.assertIn("a highlighter's band over \"Nobody was slow\" on Helena's page is finished 0.1 s before", probs[0])
        self.assertIn("a tick on Helena's page is written from 59.6 to 60.4 s, after its chapter ends", probs[1])


if __name__ == "__main__":
    unittest.main()
