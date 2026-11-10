# Runs the series' check.py (films/enterprise-architecture/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"))
import run; run.tool("check.py")
