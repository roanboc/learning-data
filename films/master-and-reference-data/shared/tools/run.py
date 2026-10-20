"""Run a tool of the series on the film in the current folder: each film's tools/<tool>.py calls run.tool('<tool>.py').
This series keeps its own lang.py (where everything lives) and build.py (what the film is made of), and reuses From words to
data's other tools and its instruments (music.py) unchanged: they import lang from here, because this folder comes first."""
import pathlib, runpy, sys

HERE = pathlib.Path(__file__).resolve().parent
FW = HERE.parents[2] / 'from-words-to-data' / 'shared' / 'tools'
sys.path[:0] = [str(HERE), str(FW)]


def tool(name):
    f = HERE / name if (HERE / name).exists() else FW / name
    runpy.run_path(str(f), run_name='__main__')
