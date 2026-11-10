# Runs the module's stills.py (films/locks-before-the-data/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[4] / "locks-before-the-data" / "shared" / "tools"))
import run; run.tool("stills.py")
