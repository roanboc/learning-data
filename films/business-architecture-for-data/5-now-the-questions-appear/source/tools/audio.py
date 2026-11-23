# Runs The map before the data's audio.py (films/enterprise-architecture/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
# The series draws in that series' look, with its tools; its own components are in ../../shared/src/ba.js (see film.json).
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[4] / "enterprise-architecture" / "shared" / "tools"))
import run; run.tool("audio.py")
