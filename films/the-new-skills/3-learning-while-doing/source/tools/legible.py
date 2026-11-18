# Runs the people kit's legible.py (films/people-first/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[4] / "people-first" / "shared" / "tools"))
import run; run.tool("legible.py")
