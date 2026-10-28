"""When the music plays: python tools/quiet.py, from this film's source folder, after tools/audio.py (it reads build/timeline.json).

This film's sound (the author's review, 20 October 2026, as for the master data films, whose check this is): music plays under the
opening story from history, West Germany's census of 1983 and the line its court drew; after that, music and sounds come in from time to time, at a chapter's
turn, under a moment on screen or in a pause without words, never as a constant bed under the voice; and nothing in it trembles or
pulses. This plays the film's score (tools/score.py) on its own and checks three things:
  - after the opening, no chapter has music for more than half its length, or for more than 12 seconds without a break;
  - no two held sounds are a little out of tune with each other, so that they beat, 0.3 to 12 times a second, when a phone's one
    speaker adds the two channels together, loud enough to move the music's level by a fifth or more;
  - nothing pulses: the score plays none of urgent(), pulse() or ostinato().
The opening is the chapters film.json lists in "story" (by default, the first). Music is what the score puts on the music bus (put()),
not the effects (X()), and it counts while it's within 24 dB of the music's loudest three seconds. A break is a second or more without.
python tools/quiet.py --all prints every beat it finds, not only the first few."""
import json, pathlib, sys
import numpy as np
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / 'shared' / 'tools'))
import run  # the series' tools first, then From words to data's
from lang import *
import music

SHARE, RUN, GAP, FLOOR = 0.5, 12.0, 1.0, 24.0
info = json.loads((BUILD / 'timeline.json').read_text())
SR = music.SR; TOT = info['total']; n = int(TOT * SR) + SR
music.init(n)
ST = {s['id']: s for s in info['scenes']}; music.ST.update(ST)
STORY = META.get('story') or [info['scenes'][0]['id']]

# every held sound on the music bus (two seconds or longer), with the partials it holds: (start, seconds, [(Hz, amplitude)])
HELD, PULSES = [], []
_put = music.put


def partials(sig):
    """the strongest partials of a held sound, past its attack: where its spectrum peaks, within 30 dB of the strongest"""
    a = sig[int(0.4 * SR):int(8.4 * SR)]
    if len(a) < SR:
        a = sig[:int(8 * SR)]
    w = np.hanning(len(a)).astype(np.float32)
    nf = 1 << int(np.ceil(np.log2(len(a) * 4)))
    sp = np.abs(np.fft.rfft(a * w, nf)) * 2 / w.sum(); fr = np.fft.rfftfreq(nf, 1 / SR)
    lo, hi = np.searchsorted(fr, 30), np.searchsorted(fr, 2600)
    s, f = sp[lo:hi], fr[lo:hi]
    if not len(s) or s.max() <= 0:
        return []
    i = np.nonzero((s[1:-1] > s[:-2]) & (s[1:-1] >= s[2:]) & (s[1:-1] > s.max() * 10 ** (-30 / 20)))[0] + 1
    i = i[np.argsort(-s[i])][:24]
    return [(float(f[k]), float(s[k])) for k in i]


def plain(pk):
    """the partials without a vibrato's sidebands: a weaker peak beside a stronger one, mirrored on the stronger one's other side, is
    a note's own vibrato (a clarinet's, a cello's), not a second note"""
    return [(f, a) for f, a in pk
            if not any(b > a and 0.3 <= abs(f - c) <= 12 and any(abs(h - (2 * c - f)) < 0.4 for h, _ in pk) for c, b in pk)]


def put(sig, start, g=1.0, pan=0.0):
    sig = np.asarray(sig, np.float32)
    if len(sig) >= 2 * SR and g > 0:
        p = max(-1.0, min(1.0, pan)); mono = g * (np.sqrt(0.5 * (1 - p)) + np.sqrt(0.5 * (1 + p)))
        HELD.append((start, len(sig) / SR, [(f, a * mono) for f, a in plain(partials(sig))]))
    _put(sig, start, g, pan)


music.put = put
for name in ('urgent', 'pulse', 'ostinato'):
    def played(*a, _f=getattr(music, name), _n=name, **k):
        PULSES.append((_n, a[0] if a else 0.0)); return _f(*a, **k)
    setattr(music, name, played)

# the score, as tools/audio.py plays it
ns = {k: v for k, v in vars(music).items() if not k.startswith('_')}
ns.update(ST=ST, TOT=TOT, G=lambda sid, cid, off=0: ST[sid]['start'] + ST[sid]['cues'][cid] + off,
          S0=lambda sid: ST[sid]['start'], E=lambda sid: ST[sid]['start'] + ST[sid]['dur'], cq=lambda sid, cid: ST[sid]['cues'][cid])
exec(compile((ROOT / 'tools' / 'score.py').read_text(), str(ROOT / 'tools' / 'score.py'), 'exec'), ns)

# when the music sounds, as one speaker plays it: its level every 10 ms, against its loudest three seconds
m = (music.ML + music.MR).astype(np.float64); fr = len(m) // (SR // 100)
e = np.sqrt((m[:fr * (SR // 100)].reshape(fr, -1) ** 2).mean(1)); e = np.convolve(e, np.ones(5) / 5, 'same')
ref = np.sqrt(np.convolve(e ** 2, np.ones(300) / 300, 'valid').max()) if fr > 300 else e.max()
on = e > ref * 10 ** (-FLOOR / 20)
story = np.zeros(fr, bool)
for sid in STORY:
    s = ST[sid]; story[int(s['start'] * 100):int((s['start'] + s['dur']) * 100)] = True


def runs(x):
    """the stretches of x, joined across breaks shorter than GAP: [(first frame, frame after the last)]"""
    d = np.diff(np.concatenate([[0], x.astype(np.int8), [0]])); a, b = np.nonzero(d == 1)[0], np.nonzero(d == -1)[0]
    out = []
    for s, t in zip(a, b):
        if out and s - out[-1][1] < GAP * 100:
            out[-1][1] = t
        else:
            out.append([s, t])
    return out


R = runs(on & ~story)
fails = []
mmss = lambda t: '%d:%04.1f' % (max(0, t) // 60, max(0, t) % 60)
print('%-12s %7s %7s %9s' % ('chapter', 'length', 'music', 'longest'))
for s in info['scenes']:
    a, b = int(s['start'] * 100), int((s['start'] + s['dur']) * 100)
    share = on[a:b].mean() if b > a else 0.0
    if s['id'] in STORY:
        print('%-12s %6.1fs %6.0f%% %9s  the opening: music may play throughout' % (s['id'], s['dur'], share * 100, ''))
        continue
    full = max([(t - r) / 100 for r, t in R if t > a and r < b] + [0])
    bad = []
    if share > SHARE:
        bad.append('music for %.0f%% of it' % (share * 100))
    if full > RUN:
        bad.append('%.1f s of music without a break' % full)
    print('%-12s %6.1fs %6.0f%% %8.1fs  %s' % (s['id'], s['dur'], share * 100, full, '; '.join(bad) or 'ok'))
    fails += ['%s: %s' % (s['id'], x) for x in bad]

# beats: two held partials a little apart, sounding together for a second and a half or more, the weaker within 10 dB of the stronger
# and within 20 dB of the music's loudest three seconds, so the beat moves the music's level by a fifth or more
H = sorted(HELD, key=lambda h: h[0]); quiet = ref * np.sqrt(2) * 10 ** (-20 / 20); beats = []
for i, (s1, d1, p1) in enumerate(H):
    for j in range(i, len(H)):
        s2, d2, p2 = H[j]
        if s2 > s1 + d1 - 1.5:
            break
        if min(s1 + d1, s2 + d2) - max(s1, s2) < 1.5:
            continue
        for x, (fa, aa) in enumerate(p1):
            for y, (fb, ab) in enumerate(p2):
                if j == i and y <= x:
                    continue
                df = abs(fa - fb)
                if 0.3 <= df <= 12 and max(fa, fb) <= 1.03 * min(fa, fb) and min(aa, ab) >= quiet and min(aa, ab) >= 0.32 * max(aa, ab):
                    beats.append((max(s1, s2), df, min(fa, fb), max(fa, fb)))
if beats:
    beats.sort(); seen = sorted({round(b[0]) for b in beats})
    print('\n%d pairs of held notes beat, from %s to %s (%d places), on a phone\'s one speaker:' % (len(beats), mmss(beats[0][0]), mmss(beats[-1][0]), len(seen)))
    for t, df, fa, fb in (beats if '--all' in sys.argv else beats[:6]):
        print('  %s  %.1f Hz and %.1f Hz beat %.1f times a second' % (mmss(t), fa, fb, df))
    fails.append('%d pairs of held notes a little out of tune with each other, so they beat: one note on two voices a little apart (give it one), '
                 'or, in a timbre rich in overtones, a tempered fifth whose overtones meet (tune the fifth pure, or soften its overtones)' % len(beats))
for name, t in PULSES:
    fails.append('%s() at %s: nothing pulses' % (name, mmss(t)))

print()
if fails:
    raise SystemExit('The music doesn\'t follow the film\'s sound (the author\'s review, 20 October 2026):\n  ' + '\n  '.join(fails))
print('The music follows the film\'s sound: the opening (%s) has its music, the rest comes in from time to time, and nothing beats or pulses.'
      % ', '.join(STORY))
