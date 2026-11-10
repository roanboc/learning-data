# Runs the module's render.py (films/fit-for-use/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[4] / "fit-for-use" / "shared" / "tools"))
import run; run.tool("render.py")
