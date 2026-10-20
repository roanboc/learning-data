"""How much of each chapter has music under it: python tools/music_share.py
Run after tools/audio.py (it reads build/timeline.json and build/vo/). It plays tools/score.py into the music bus as tools/audio.py does,
ducked under the voice the same way, and counts the half seconds in each chapter where the music is within 32 dB of the chapter's voice,
loud enough to hear under it. The author found the first cut's music, held under every chapter, tense under the explanations
(20 October 2026): after the opening story, music comes now and then. So it fails if a chapter between the first and the last has music
under more than 60% of it."""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"))
import run  # puts the series' tools, then From words to data's, on the path, as every tool here does
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
from lang import *
import music

MAX_SHARE, NEAR, STEP = 0.6, 32, 0.5
info = json.load(open(BUILD / 'timeline.json'))
SR = music.SR; TOT = info['total']; n = int(TOT * SR) + SR
music.init(n)
ST = {s['id']: s for s in info['scenes']}; music.ST.update(ST)
vo = np.zeros(n, np.float32)
for c in info['caps']:
    x, sr = sf.read(str(BUILD / 'vo' / ('%s__%s.wav' % (c['sid'], c['id']))), dtype='float32')
    x = resample_poly(x, 147, 80).astype(np.float32); i = int(c['s'] * SR); vo[i:i + len(x)] += x[:n - i]
ns = {k: v for k, v in vars(music).items() if not k.startswith('_')}
ns.update(ST=ST, TOT=TOT, G=lambda sid, cid, off=0: ST[sid]['start'] + ST[sid]['cues'][cid] + off,
          S0=lambda sid: ST[sid]['start'], E=lambda sid: ST[sid]['start'] + ST[sid]['dur'], cq=lambda sid, cid: ST[sid]['cues'][cid])
exec(compile((ROOT / 'tools' / 'score.py').read_text(), str(ROOT / 'tools' / 'score.py'), 'exec'), ns)
# the duck, as tools/audio.py makes it: 0.42 under a line, 0.67 when the voice rests
CR = 100; DK, LF = 0.42, 0.67; tg = np.full(int(TOT * CR) + CR, LF, np.float32)
for c in info['caps']:
    tg[int(max(0, c['s'] - 0.45) * CR):int((c['e'] + 0.9) * CR)] = DK
dk = np.empty_like(tg); v = LF
for i, x in enumerate(tg):
    v = max(x, v - (LF - DK) / (0.4 * CR)) if x < v else min(x, v + (LF - DK) / (1.2 * CR)); dk[i] = v
duck = np.interp(np.arange(n, dtype=np.float32) / SR, np.arange(len(dk), dtype=np.float32) / CR, dk).astype(np.float32)
mu = (music.ML + music.MR) / 2 * 0.87 * duck; vo *= 0.95
db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
W, bad = int(STEP * SR), []
print('chapter      music under it')
for k, s in enumerate(info['scenes']):
    a, b = int(s['start'] * SR), int((s['start'] + s['dur']) * SR); near = db(vo[a:b]) - NEAR
    share = np.mean([db(mu[i:i + W]) > near for i in range(a, b - W + 1, W)])
    inner = 0 < k < len(info['scenes']) - 1
    if inner and share > MAX_SHARE:
        bad.append(s['id'])
    print('%-10s   %4.0f%%%s' % (s['id'], 100 * share, '   more than %d%%' % (100 * MAX_SHARE) if inner and share > MAX_SHARE else ''))
if bad:
    sys.exit('music is held under %s: let it come now and then' % ', '.join(bad))
print('after the opening, music comes now and then')
