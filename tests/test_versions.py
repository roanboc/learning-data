"""Every page links the site's own scripts, stylesheets and pictures by their versions (site-tools/build_series.py's stamp()), so a
browser that keeps them for four hours fetches a changed player as soon as the page that loads it is new (18 November 2026)."""
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
import build_series


class VersionTests(unittest.TestCase):
    def test_a_link_takes_its_files_version_and_a_new_one_when_the_file_changes(self):
        page = "when-things-go-wrong/silent-change/index.html"
        html = '<script src="../../assets/silent-change/film.js?v=0123456789"></script><img src="../../assets/sketch-poster.jpg" alt="">'
        out = build_series.stamp(page, html)
        self.assertIn(f'film.js?v={build_series.asset_v("assets/silent-change/film.js")}"', out)
        self.assertIn(f'sketch-poster.jpg?v={build_series.asset_v("assets/sketch-poster.jpg")}"', out)
        self.assertEqual(build_series.stamp(page, out), out)  # stamped again, the same
        was = build_series._V.pop("assets/silent-change/film.js")
        try:
            build_series._V["assets/silent-change/film.js"] = "fedcba9876"  # as if the player had changed
            self.assertIn('film.js?v=fedcba9876"', build_series.stamp(page, out))
        finally:
            build_series._V["assets/silent-change/film.js"] = was

    def test_links_to_pages_other_sites_and_missing_files_are_left_as_they_are(self):
        page = "index.html"
        for html in ('<a href="topics/">Topics</a>', '<script src="https://cdn.example.org/x.js"></script>',
                     '<img src="assets/no-such-picture.jpg" alt="">', '<use href="assets/icons.svg#play"/>'):
            self.assertEqual(build_series.stamp(page, html), html)


if __name__ == "__main__":
    unittest.main()
