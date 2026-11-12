"""Run a tool of the series on the film in the current folder: each film's tools/<tool>.py calls run.tool('<tool>.py').
This series keeps its own lang.py (where everything lives), build.py (what the film is made of) and quiet.py (which runs the governance
films' sound check), and reuses From words to data's other tools and its instruments (music.py) unchanged: they import lang from here,
because this folder comes first. The governance films' folder comes last, for the checks they share (quiet.py's held.py)."""
import pathlib, runpy, sys

HERE = pathlib.Path(__file__).resolve().parent
FW = HERE.parents[2] / 'from-words-to-data' / 'shared' / 'tools'
GOV = HERE.parents[2] / 'data-governance' / 'shared' / 'tools'
sys.path[:0] = [str(HERE), str(FW)]
sys.path.append(str(GOV))


def tool(name):
    f = HERE / name if (HERE / name).exists() else FW / name
    runpy.run_path(str(f), run_name='__main__')
