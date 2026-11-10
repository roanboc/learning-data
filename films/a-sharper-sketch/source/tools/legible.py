# Runs From words to data's legible.py on this film, with this film's own lang.py: python tools/legible.py [--overlaps]
import pathlib, runpy, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
runpy.run_path(str(HERE.parents[2] / "from-words-to-data" / "shared" / "tools" / "legible.py"), run_name="__main__")
