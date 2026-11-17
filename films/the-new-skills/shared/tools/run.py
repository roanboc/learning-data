"""Run a tool of the module on the film in the current folder: each film's tools/<tool>.py calls run.tool('<tool>.py').
The module keeps its own lang.py (where everything lives), build.py (what a film is made of), quiet.py and sketch.py. It reuses,
unchanged, the agent films' check.py and edges.py (films/what-an-agent-is/shared/tools/: every moment draws, no word under 28 px,
every place paints in time, nothing shows twice, no arm or camera jumps, nothing painted past a person's picture), the governance
films' checks (names.py, cues.py, quiet.py, twice.py, steady.py, jump.py) and From words to data's other tools and instruments
(music.py). They import lang from here, because this folder comes first."""
import pathlib, runpy, sys

HERE = pathlib.Path(__file__).resolve().parent
AGT = HERE.parents[2] / 'what-an-agent-is' / 'shared' / 'tools'
FW = HERE.parents[2] / 'from-words-to-data' / 'shared' / 'tools'
GOV = HERE.parents[2] / 'data-governance' / 'shared' / 'tools'
sys.path[:0] = [str(HERE), str(AGT), str(FW)]
sys.path.append(str(GOV))


def tool(name):
    f = next((d / name for d in (HERE, AGT, FW) if (d / name).exists() and not (d is AGT and name in ('build.py', 'lang.py', 'run.py', 'quiet.py', 'sketch.py'))), FW / name)
    runpy.run_path(str(f), run_name='__main__')
