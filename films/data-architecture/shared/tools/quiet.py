"""The film's sound, checked: python tools/quiet.py, from a film's source folder, after tools/build.py. The check is the governance
films' (films/data-governance/shared/tools/quiet.py, where its rules are written), run here with this series' lang.py."""
import pathlib, runpy, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import run  # the series' tools first, then From words to data's, then the governance films' (held.py)
runpy.run_path(str(run.GOV / 'quiet.py'), run_name='__main__')
