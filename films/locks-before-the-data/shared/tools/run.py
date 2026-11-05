"""Run a tool of the module on the film in the current folder: each film's tools/<tool>.py calls run.tool('<tool>.py').
The module keeps its own lang.py (where everything lives), build.py (what a film is made of), check.py (every moment draws, every word
reads, and every picture is made without holding the page), contrast.py (every word stands out from what is behind it) and quiet.py,
which runs the governance films' sound check (GOV's quiet.py) with this lang.py. It reuses, unchanged, the governance films' checks
(names.py and cues.py when a film is built; twice.py, steady.py and jump.py when it's checked), the agent films' edges.py (AGT), and
From words to data's other tools and its instruments (music.py): they import lang from here, because this folder comes first."""
import pathlib, runpy, sys

HERE = pathlib.Path(__file__).resolve().parent
FW = HERE.parents[2] / 'from-words-to-data' / 'shared' / 'tools'
GOV = HERE.parents[2] / 'data-governance' / 'shared' / 'tools'
AGT = HERE.parents[2] / 'what-an-agent-is' / 'shared' / 'tools'
sys.path[:0] = [str(HERE), str(FW)]
sys.path += [str(GOV), str(AGT)]


def tool(name):
    f = HERE / name if (HERE / name).exists() else FW / name
    runpy.run_path(str(f), run_name='__main__')
