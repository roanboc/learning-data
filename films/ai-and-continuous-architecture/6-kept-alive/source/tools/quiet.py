"""The film's sound, checked: python tools/quiet.py, from this film's source folder, after tools/build.py. The check is the governance
films' (films/data-governance/shared/tools/quiet.py, where its rules are written), run here with The map before the data's lang.py."""
import pathlib, runpy, sys
FILMS = pathlib.Path(__file__).resolve().parents[4]
sys.path.insert(0, str(FILMS / "enterprise-architecture" / "shared" / "tools"))
import run  # The map before the data's tools first, then From words to data's
GOV = FILMS / "data-governance" / "shared" / "tools"
sys.path.append(str(GOV))
runpy.run_path(str(GOV / "quiet.py"), run_name="__main__")
