# Runs The map before the data's render.py (films/enterprise-architecture/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[4] / "enterprise-architecture" / "shared" / "tools"))
import run; run.tool("render.py")
