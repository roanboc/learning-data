# Runs the series' check.py (films/data-governance/shared/tools/run.py finds it) on this film, then the film's own check that the frame
# never cuts a word (tools/edges.py). Run it from this film's source folder.
import pathlib, runpy, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"))
import run; run.tool("check.py")
runpy.run_path(str(pathlib.Path(__file__).with_name("edges.py")), run_name="__main__")
