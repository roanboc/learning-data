"""Mix the soundtrack: python tools/audio.py, from this film's source folder, after tools/build.py and tools/tts.py. From words to
data's mixer (films/from-words-to-data/shared/tools/audio.py) lays each voiced line at its moment, plays this film's score
(tools/score.py, with that series' instruments in shared/tools/music.py), ducks the music under the voice, and writes build/mix.wav and
dist/soundtrack.mp3 at -16 LUFS. Then run tools/build.py again."""
import pathlib, runpy, sys
HERE = pathlib.Path(__file__).resolve().parent
FW = HERE.parents[2] / 'from-words-to-data' / 'shared' / 'tools'
sys.path[:0] = [str(HERE), str(FW)]
runpy.run_path(str(FW / 'audio.py'), run_name='__main__')
