"""The film's sound, checked: python tools/quiet.py, from this film's source folder, after tools/build.py (it plays tools/score.py on its
own, so it needs no voice). The check is the governance films' (films/data-governance/shared/tools/quiet.py, where its rules are
written, with held.py), run here with this film's lang.py and From words to data's instruments (music.py), as tools/audio.py mixes."""
import pathlib, runpy, sys, types
HERE = pathlib.Path(__file__).resolve().parent
FILMS = HERE.parents[2]
GOV = FILMS / 'data-governance' / 'shared' / 'tools'
sys.path[:0] = [str(HERE), str(FILMS / 'from-words-to-data' / 'shared' / 'tools')]
sys.path.append(str(GOV))
sys.modules.setdefault('run', types.ModuleType('run'))  # the paths are set: the check needn't set the governance films' own
runpy.run_path(str(GOV / 'quiet.py'), run_name='__main__')
