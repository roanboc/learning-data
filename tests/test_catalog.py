import json
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
import catalog


class CatalogTests(unittest.TestCase):
    def test_every_release_has_a_catalog_owner(self):
        data = catalog.catalog()
        films = [f for m in data["modules"] for i in m["items"] for f in i["films"]] + data["extras"]
        expected = {p.parent.relative_to(ROOT).as_posix() for p in (ROOT / "films").rglob("release.json")}
        self.assertTrue(expected <= {f["path"] for f in films})
        keys = [k for f in films for k in f["release_keys"]]
        self.assertEqual(len(keys), len(set(keys)))

    def test_portal_aliases_resolve_to_the_real_source(self):
        data = catalog.catalog()
        item = next(i for m in data["modules"] for i in m["items"] if i["id"] == "in-the-weeds")
        self.assertEqual(item["path"], "films/analytics-engineering")
        self.assertEqual(item["url"], "in-the-weeds/")
        self.assertTrue(item["films"])

    def test_membership_and_locales_are_validated(self):
        original = json.loads((ROOT / "modules/data-governance/module.json").read_text())
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            folder = root / "modules/data-governance"
            folder.mkdir(parents=True)
            for bad in (dict(original, items=["duplicate", "duplicate"]), dict(original, name={"en": "Only English"}), dict(original, order=True)):
                (folder / "module.json").write_text(json.dumps(bad))
                with self.assertRaises(ValueError):
                    catalog.load_modules(root)

    def test_learning_sources_are_findable(self):
        item = next(i for m in catalog.catalog()["modules"] for i in m["items"] if i["id"] == "data-governance")
        self.assertIn("site/assets/data-governance/learn.en.js", item["learning"])
        self.assertTrue(all((ROOT / p).is_file() for p in item["learning"]))


if __name__ == "__main__":
    unittest.main()
