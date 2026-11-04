# Runs the module's audio.py (films/what-an-agent-is/shared/tools/run.py finds it) on this film. Run it from this film's source folder.
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[4] / "what-an-agent-is" / "shared" / "tools"))
import run; run.tool("audio.py")
