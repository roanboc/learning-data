"""Voice every narration line into build/vo/ and write the timings to src/vodur.js: python tools/tts.py
A line whose voice file exists is reused: after changing its words, delete build/vo/<chapter>__<id>.wav.
With --keep-timings, it keeps src/vodur.js and fails if a voiced line is more than 0.05 s off it (the release workflow uses this)."""
import argparse, os, re, time
import numpy as np, soundfile as sf
from lang import *

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--keep-timings', action='store_true', help='keep the committed timings, and fail if a voiced line is more than 0.05 s off them')
A = ap.parse_args()
from kokoro_onnx import Kokoro

N = load_obj(NARR)
# the voice reads some words better respelled: the series' own, then the film's (film.json "say": [[pattern, words], ...])
SAY = [(r'\bIDs\b', 'I Ds'), (r'\bID\b', 'I D'), (r'\bdbt\b', 'D B T'), (r'\bOED\b', 'O E D'), (r'\bICD\b', 'I C D'),
       (r'\bBCE\b', 'B C E'), (r'\bAI\b', 'A I'), (r'\bHTAP\b', 'H tap'), (r'\bSQL\b', 'sequel'), (r'\bUNESCO\b', 'you nesko')] + [tuple(x) for x in META.get('say', [])]
V = {'voice': 'af_heart', 'lang': 'en-us', 'speed': 0.95}
k = Kokoro(str(MODELS / 'kokoro-v1.0.onnx'), str(MODELS / 'voices-v1.0.bin'))
dur = {}; t0 = time.time()
for sid, sc in N.items():
    for ch in sc['vo']:
        fn = BUILD / 'vo' / ('%s__%s.wav' % (sid, ch['id']))
        if fn.exists():
            info = sf.info(str(fn)); dur[sid + '/' + ch['id']] = round(info.frames / info.samplerate, 3); continue
        txt = ch.get('say') or ch['text']
        for a, b in SAY:
            txt = re.sub(a, b, txt)
        s, sr = k.create(txt, voice=V['voice'], speed=V['speed'], lang=V['lang'])
        nz = np.where(np.abs(s) > 0.01)[0]
        s = s[max(0, nz[0] - 240):nz[-1] + 480] if len(nz) else s
        sf.write(str(fn), s, sr); dur[sid + '/' + ch['id']] = round(len(s) / sr, 3)
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
    open(VODUR, 'w').write('const VODUR=' + json.dumps(dur) + ';\n')
    print('DONE', round(sum(dur.values()), 1), 's of speech', flush=True)
