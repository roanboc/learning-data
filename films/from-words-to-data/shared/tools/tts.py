"""Voice every narration line into build/vo/ and write the timings to src/vodur.js: python tools/tts.py
Each line is reused only when its spoken text, voice, model and synthesis code match the verified cache.
With --keep-timings, it keeps src/vodur.js and fails if a voiced line is more than 0.05 s off it (the release workflow uses this)."""
import argparse, json, os, re, time
import numpy as np, soundfile as sf
from lang import *

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--keep-timings', action='store_true', help='keep the committed timings, and fail if a voiced line is more than 0.05 s off them')
A = ap.parse_args()
import pathlib,sys
sys.path.insert(0,str(next(p for p in pathlib.Path(__file__).resolve().parents if (p/'site-tools/voice_cache.py').is_file())/'site-tools'))
from voice_cache import KokoroVoice

N = load_obj(NARR)
# the voice reads some words better respelled: the series' own, then the film's (film.json "say": [[pattern, words], ...])
SAY = [(r'\bIDs\b', 'I Ds'), (r'\bID\b', 'I D'), (r'\bdbt\b', 'D B T'), (r'\bOED\b', 'O E D'), (r'\bICD\b', 'I C D'),
       (r'\bBCE\b', 'B C E'), (r'\bAI\b', 'A I'), (r'\bHTAP\b', 'H tap'), (r'\bSQL\b', 'sequel'), (r'\bUNESCO\b', 'you nesko')] + [tuple(x) for x in META.get('say', [])]
V = {'voice': 'af_heart', 'lang': 'en-us', 'speed': 0.95}
voice = KokoroVoice(MODELS, V, __file__)
dur = {}; t0 = time.time()
for sid, sc in N.items():
    for ch in sc['vo']:
        fn = BUILD / 'vo' / ('%s__%s.wav' % (sid, ch['id']))
        txt = ch.get('say') or ch['text']
        for a, b in SAY:
            txt = re.sub(a, b, txt)
        generated = voice.save(txt, fn)
        info = sf.info(str(fn)); dur[sid + '/' + ch['id']] = round(info.frames / info.samplerate, 3)
        if generated:
            print(sid, ch['id'], dur[sid + '/' + ch['id']], '%.0fs' % (time.time() - t0), flush=True)
if A.keep_timings:
    old = load_obj(VODUR)
    off = [x for x in sorted(set(old) | set(dur)) if x not in old or x not in dur or abs(old[x] - dur[x]) > 0.05]
    for x in off[:20]:
        print('  %-24s committed %s, voiced %s' % (x, old.get(x, '-'), dur.get(x, '-')))
    if off:
        raise SystemExit('%d lines differ from src/vodur.js: run tools/tts.py and commit the timings' % len(off))
    print('DONE', round(sum(dur.values()), 1), 's of speech; the committed timings match', flush=True)
else:
    VODUR.write_text('const VODUR=' + json.dumps(dur) + ';\n', encoding='utf-8')
    print('DONE', round(sum(dur.values()), 1), 's of speech', flush=True)
