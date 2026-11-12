"""Run a tool of the series on the film in the current folder: each film's tools/<tool>.py calls run.tool('<tool>.py').
Platform and solution architecture is drawn with The map before the data's engine and look, so it uses that series' lang.py (where
everything lives) and build.py (what a film is made of: its src list in film.json brings in this series' kit, ../../shared/src/psa.js).
From words to data's other tools and instruments (music.py) come next, its legible.py included (it has --overlaps), and the governance
films' checks last: twice.py and hands.py for tools/check.py, and quiet.py, with held.py, for each film's sound."""
import pathlib, runpy, sys

HERE = pathlib.Path(__file__).resolve().parent
EA = HERE.parents[2] / 'enterprise-architecture' / 'shared' / 'tools'
FW = HERE.parents[2] / 'from-words-to-data' / 'shared' / 'tools'
GOV = HERE.parents[2] / 'data-governance' / 'shared' / 'tools'
sys.path[:0] = [str(HERE), str(EA), str(FW)]
sys.path.append(str(GOV))


def tool(name):
    if name == 'quiet.py':
        f = GOV / name
    elif name == 'legible.py':
        f = FW / name
    else:
        f = next((d / name for d in (HERE, EA, FW) if (d / name).exists()), FW / name)
    runpy.run_path(str(f), run_name='__main__')
