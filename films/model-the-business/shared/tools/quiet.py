"""The film's sound, checked: python tools/quiet.py, from a film's source folder, after tools/build.py (it plays tools/score.py on its
own). The check is the governance films' (films/data-governance/shared/tools/quiet.py, where its rules are written, with held.py),
run here with From words to data's lang.py and instruments, as this series' other tools are."""
import pathlib, runpy, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import run  # this series' tools first, then From words to data's
GOV = pathlib.Path(__file__).resolve().parents[3] / 'data-governance' / 'shared' / 'tools'
sys.path.append(str(GOV))
runpy.run_path(str(GOV / 'quiet.py'), run_name='__main__')
