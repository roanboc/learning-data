"""The film's sound, checked: python tools/quiet.py, from this film's source folder, after tools/build.py. The check is the governance
films' (films/data-governance/shared/tools/quiet.py, where its rules are written: music under the opening story, then only now and then,
no figure played again and again, no burst of effects, nothing louder than the films the author accepted, no beats, no pulse, and held
notes at even levels in a room), run here with The map before the data's lang.py, whose look and tools this series uses."""
import pathlib, runpy, sys
F = pathlib.Path(__file__).resolve().parents[4]
sys.path.insert(0, str(F / 'enterprise-architecture' / 'shared' / 'tools'))
import run  # The map before the data's tools first, then From words to data's
sys.path.append(str(F / 'data-governance' / 'shared' / 'tools'))
runpy.run_path(str(F / 'data-governance' / 'shared' / 'tools' / 'quiet.py'), run_name='__main__')
