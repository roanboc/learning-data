# Runs the series' shared render.py (films/from-words-to-data/shared/tools/) on this film. Run it from this film's source folder.
import pathlib, runpy, sys
T = pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"
sys.path.insert(0, str(T))
runpy.run_path(str(T / "render.py"), run_name="__main__")
