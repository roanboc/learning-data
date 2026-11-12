"""The film's sound, checked: python tools/quiet.py, from this film's source folder, after tools/build.py. The check is the governance
films' (films/data-governance/shared/tools/quiet.py, where its rules are written), run with this series' tools (run.py)."""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"))
import run; run.tool("quiet.py")
