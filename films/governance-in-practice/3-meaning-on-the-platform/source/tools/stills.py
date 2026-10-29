# Runs data governance's stills.py (films/data-governance/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[4] / "data-governance" / "shared" / "tools"))
import run; run.tool("stills.py")
