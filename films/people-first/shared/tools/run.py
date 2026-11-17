"""Run a tool of the people kit on the film in the current folder: each film's tools/<tool>.py calls run.tool('<tool>.py').
The kit keeps its own lang.py (where everything lives), build.py (what a film is made of), check.py and people.py (its own checks,
on people), quiet.py and sketch.py. It reuses, unchanged, From words to data's other tools and instruments (tts.py, audio.py,
captions.py, legible.py, pace.py, stills.py, render.py, publish.py, music.py) and the governance films' checks (names.py, cues.py,
quiet.py, twice.py, jump.py). They import lang from here, because this folder comes first."""
import pathlib, runpy, sys

HERE = pathlib.Path(__file__).resolve().parent
FW = HERE.parents[2] / 'from-words-to-data' / 'shared' / 'tools'
GOV = HERE.parents[2] / 'data-governance' / 'shared' / 'tools'
sys.path[:0] = [str(HERE), str(FW)]
sys.path.append(str(GOV))


def tool(name):
    f = next((d / name for d in (HERE, FW) if (d / name).exists()), FW / name)
    runpy.run_path(str(f), run_name='__main__')
