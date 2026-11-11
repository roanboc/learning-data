# Prototype first: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, row reserved 10 November 2026, about 03:40 UTC, after searching
# every score.py and music.py on main and on every branch, and every palettes.md in the project's files, for "elastic", "rubber band",
# "band box", "box zither" and "shoebox": none): elastic bands over a small open wooden box, made here, as music.py has none.
#  - The band box: rubber bands of different widths stretched over a small open wooden box and plucked with a fingertip, the instrument
#    many people first make from what is on a desk, in an afternoon, and already real enough to play a tune. Each band is tuned by
#    stretching it a little, listening, and stretching again. Soft, round and short: a fingertip's pluck, the band's few partials gone
#    quickly, the box's warm wooden body under it, and no metal anywhere. Each note is placed and left to fade, never bent or slid.
#  - Its partner, the thread's choice: a bigger box with thicker bands, an octave lower, plucked once and let go.
#    Curitiba is in Brazil, so nothing in the score is borrowed from the opening's place: plain tunes, no syncopated strumming.
# The mark: a rough phrase made better over three rounds, as a prototype is. Round 1, three notes (B flat, G, C: a first try, left
# hanging); round 2, four (B flat, G, A flat, C: smoother, still not home); round 3, the whole phrase (B flat, G, A flat, C, D, E flat),
# coming home to E flat. It stops as soon as it is enough: there is no fourth round. In the opening, round 1 is the street built fast,
# round 2 the children painting, round 3 fifty years on; in the university, round 1 is Graham's first look, round 2 the second review,
# round 3 the answer; on Monday, the whole phrase an octave lower, its last note held into the end card.
# E flat major, C minor for the opening's problem. Every chord is tuned pure from E flat (just intonation, see hz()): E flat, A flat and
# B flat major, C minor and G minor are pure in this table; F minor is not, and is never played. No chapter is urgent: nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: a plucked band only fades; each is damped before the next chapter needs the quiet.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/pf_scenes.js, and
#    panned to where it is drawn. Everything low and soft, below about 2.2 kHz; the effects well under the music.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() takes a word's first appearance, even inside a longer word, and falls back to the line's start when it's missing; here either
# stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1972)  # this film's own randomness: the room, the bands, the street


# a small room round the boxes, ringing on for about eight tenths of a second. Its level is set by what it rings where the notes are
# (its gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), as a room lifts some pitches and
    hollows others, and every note should sound as loud as its neighbours"""
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a time in the film, a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig


# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
FX = 3.8
def _fx(sig, s, g, pan, top=2000):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.005, pan=0.0):
    """a sheet put up: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1700)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 160, 0.016, 0.06) / 1.35, s, g, pan, 1800)
def tap(s, g=0.004, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1000)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 230, 0.011), s, g, pan, 1500)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """a line drawn out, or a chart filling: a dry, even rub that eases in and off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1400)
def pen(s, sec=0.7, g=0.005, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2000)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2000)
def ticked(s, g=0.004, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def rumble(s, sec=3.0, g=0.004, pan=0.0, lo=60, hi=380, at=0.5):
    """engines on a street: one soft, low texture that swells and fades (its peak at at of its length), never a clatter of knocks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 6); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    sh = np.where(x < at * sec, _bump(x, 2 * at * sec, 1.2), _bump(x - (2 * at - 1) * sec, 2 * (1 - at) * sec, 1.2))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (lo, hi)) * sh * gr, s, g, pan, 600)
def knock(s, g=0.005, pan=0.0, f=150):
    """something wooden set down on stone, a barrier or a kiosk: one dull, low knock"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    _fx(_knock(n, f, 0.035) + 0.3 * filt(noise(0.22)[:n], 'band', (120, 700)) * np.exp(-x / 0.012), s, g, pan, 900)
def stones(s, k=5, every=0.55, g=0.0035, pan=0.0, spread=0.15):
    """stones laid by hand: a few soft, dull clacks, far apart, each its own pitch, never a rattle"""
    for i in range(k):
        n = int(0.09 * SR); x = np.arange(n) / SR; f = R1.uniform(330, 520)
        _fx(_knock(n, f, 0.012) + 0.4 * filt(noise(0.1)[:n], 'band', (300, 1100)) * np.exp(-x / 0.006),
            s + i * every + R1.uniform(-0.06, 0.06), g * R1.uniform(0.8, 1.0), max(-0.85, min(0.85, pan + R1.uniform(-spread, spread))), 1300)
def rustle(s, sec=1.6, g=0.0035, pan=0.0):
    """leaves set into a bed: one soft swell of rustling, not a crackle"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 14)); gr = 0.5 + 0.5 * gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (500, 1900)) * _bump(x, sec, 1.6) * gr, s, g, pan, 1900)
def brush(s, sec=0.5, g=0.0035, pan=0.0):
    """a broad brush drawn once over paper on the ground: a soft, slow sweep"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1500)) * _bump(x, sec, 1.1), s, g, pan, 1600)
def mute(s, g=0.004, pan=0.0):
    """a fingertip laid on a band to stop it: a short, damped thup of the box, with no note in it"""
    n = int(0.12 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 120, 0.02) + 0.25 * filt(noise(0.14)[:n], 'band', (90, 500)) * np.exp(-x / 0.01), s, g, pan, 700)

# ---- tuning: just intonation from E flat, so a chord's notes are whole-number ratios of each other and nothing beats. E flat, A flat and
# B flat major, C minor and G minor are pure in this table; F minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
_EB2 = 440 * 2 ** ((39 - 69) / 12)
def hz(m):
    o, pc = divmod(m - 39, 12)
    return _EB2 * 2 ** o * _JI[pc]
Eb2, F2, G2, Ab2, Bb2, C3, D3, Eb3, F3, G3, Ab3, Bb3 = 39, 41, 43, 44, 46, 48, 50, 51, 53, 55, 56, 58
C4, D4, Eb4, F4, G4, Ab4, Bb4, C5, D5, Eb5, F5, G5 = 60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77, 79

LB, LX = 0.084, 0.118     # the small box's level and the big box's, on the music bus
LV = [1.0]

def _box(f0, d, sec, tau, p, peaks, top, air):
    """a band plucked over an open box: its partials (where the fingertip plucks sets how much of each; the higher ones go first),
    shaped by the box's wooden body; the fingertip's soft start; the air in the box answering the pluck once; damped after d seconds"""
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 30):
        fk = f0 * k
        if fk > top:
            break
        body = 1 + sum(h * np.exp(-((fk - c) / w) ** 2) for c, h, w in peaks)
        sig += abs(np.sin(np.pi * k * p)) / k ** 1.35 * body * np.sin(2 * np.pi * fk * x + R1.uniform(0, 2 * np.pi)) * np.exp(-x / (tau / k ** 0.75))
    sig *= np.minimum(1, x / 0.005)
    pk = float(np.abs(sig).max() or 1)
    sig += pk * 0.1 * np.sin(2 * np.pi * air * x) * np.exp(-x / 0.045) * np.minimum(1, x / 0.003)
    sig += pk * 0.06 * filt(noise(sec + 0.02)[:n], 'low', 450).astype(np.float64) * np.exp(-x / 0.008)
    return sig * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))

def band(m, s, g=1.0, ring=1.2, pan=None, room=0.18, until=None):
    """the small box: one band plucked with a fingertip, round and short, let fade; damped after ring seconds"""
    d = ring if until is None else min(ring, max(0.15, until - s - 0.3))
    sig = _box(hz(m), d, d + 0.4, 0.6, 0.17, ((250, 1.1, 90), (560, 0.7, 170), (1100, 0.25, 260)), 2200, 205)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 90)), room, 0.0, min(0.8, d)), s, until)
    put(sig, s, g * LV[0] * LB, max(-0.4, min(0.4, (m - 64) * 0.025)) if pan is None else pan)

def big(m, s, g=1.0, ring=2.2, pan=None, room=0.18, until=None):
    """the partner: a thicker band on the bigger box, an octave lower, plucked once and let go"""
    d = ring if until is None else min(ring, max(0.2, until - s - 0.3))
    sig = _box(hz(m), d, d + 0.4, 1.1, 0.22, ((130, 1.0, 50), (310, 0.7, 110), (700, 0.2, 200)), 1400, 118)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1400), 'high', 45)), room, 0.0, min(0.8, d)), s, until)
    put(sig, s, g * LV[0] * LX, -0.2 if pan is None else pan)

def chord(notes, s, g=1.0, step=0.16, ring=1.6, until=None):
    """a chord placed from its lowest note up: the low notes (below E flat 3) on the big box, the rest on the small one"""
    for i, m in enumerate(notes):
        (big(m, s + step * i, g, ring + 0.6, until=until) if m < Eb3 else band(m, s + step * i, g, ring, until=until))
def figure(notes, s, g=1.0, step=0.28, ring=0.7, last=None, until=None):
    """a short tune, one band at a time"""
    for i, m in enumerate(notes):
        band(m, s + step * i, g, last if (last and i == len(notes) - 1) else ring, until=until)

ROUND = {1: (Bb4, G4, C5), 2: (Bb4, G4, Ab4, C5), 3: (Bb4, G4, Ab4, C5, D5, Eb5)}
def mark(r, s, g=1.0, shift=0, step=0.3, last=1.8, low=None, until=None):
    """the mark, round r: round 1 a little uneven, as a first try is; round 3 home to E flat, its last note let ring; low, a big box's
    note under its first"""
    ns = ROUND[r]; t = s
    for i, m in enumerate(ns):
        band(m + shift, t, g, last if i == len(ns) - 1 else 0.8, until=until)
        t += step * ((1.2, 0.75)[i % 2] if r == 1 else 1.0)
    if low is not None:
        big(low, s, 0.8 * g, 2.6, until=until)

# =============================================================================================================================
# 1. A street in a weekend: the opening. Curitiba, Friday 19 May 1972, six in the evening: the big box's low E flat alone, then E flat
#    major as the town comes in; the traffic, one low, slow texture; the truck; the barriers set down; the close: one B flat. The years
#    before: C minor; the plan to knock down buildings: C minor low; the mayor: E flat major. The shopkeepers' fear: C minor, and their
#    sales falling: three notes down. "Something had to change" has nothing under it. The real thing, fast: round 1 of the mark, over the
#    first stones. Saturday morning: A flat major; the streetlights rising, a note each; the kiosks, two knocks; the flowers: B flat major
#    and a rustle. The drivers: C minor, low; the paper and the children painting: round 2. Sales up a little: a step up. Asking for more:
#    four notes rising. Fifty years on: round 3, whole. Not on paper: A flat major. A data team: one high E flat; the loop's three pills,
#    a note each; the title: E flat major, let ring
LV[0] = 0.9
ow = lambda lid, word, off=0: W('street', lid, word, off)
oc = lambda lid, off=0: G('street', lid, off)
END = E('street')
big(Eb2, 0.4, 0.8, 3.0, 0.0)
chord((Eb2, Bb2, G3, Bb3, Eb4), ow('when', 'Curitiba', 0.2), 0.75, step=0.2, ring=2.2)
card(ow('when', 'Curitiba', -0.2), 0.004, px(440))
cl = ow('crews', 'close', -0.2)
rumble(0.2, cl + 2.4, 0.003, px(960), 55, 340, 0.85)
rumble(ow('crews', 'truck', -0.5), 3.6, 0.0035, px(1700), 50, 300, 0.75)
knock(cl, 0.005, px(1830), 140)
knock(cl + 0.6, 0.005, px(110), 150)
band(Bb3, ow('crews', 'close', 0.1), 0.6, 1.6)
chord((C3, G3, C4, Eb4), ow('cars', 'filled', -0.1), 0.6, step=0.18, ring=1.8)
tap(ow('cars', 'squeezed', -0.2), 0.0035, px(960))
card(ow('plan', 'widen', -0.2), 0.004, px(430))
slide(ow('plan', 'knocking', -0.2), 1.4, 0.0035, px(1100))
chord((C3, G3, Eb4), ow('plan', 'knocking', 0.0), 0.55, step=0.2, ring=1.6)
card(ow('mayor', 'Jaime', -0.3), 0.004, px(430))
chord((Eb3, Bb3, Eb4, G4), ow('mayor', 'given', -0.1), 0.55, step=0.16, ring=1.8)
card(ow('fear', 'feared', -0.2), 0.004, px(1410))
chord((C3, Eb4, G4), ow('fear', 'customers', -0.1), 0.5, step=0.18, ring=1.4)
figure((G4, Eb4, C4), ow('fear', 'fall', -0.1), 0.45, 0.3, 0.6, 1.2, until=oc('change', -0.3))
card(ow('change', 'plans', -0.2), 0.004, px(1410))
tap(ow('change', 'show', -0.2), 0.0035, px(1410))
mark(1, ow('real', 'real', 0.0), 0.6, low=Eb2)
stones(oc('real', 0.6), 4, 0.7, 0.003, px(1500), 0.12)
card(ow('saturday', 'handed', -0.3), 0.004, px(440))
chord((Ab2, Eb3, Ab3, C4), ow('saturday', 'handed', 0.0), 0.55, step=0.18, ring=1.8)
stones(ow('weekend', 'stones', -0.2), 5, 0.5, 0.003, px(700), 0.3)
for i, m in enumerate((Eb4, G4, Bb4, Eb5)):
    band(m, ow('weekend', 'streetlights', -0.4) + i * 0.35, 0.42, 0.9, px(240 + i * 500) * 0.5)
for i in range(2):
    knock(ow('weekend', 'kiosks', -0.3) + i * 0.4, 0.004, px(640 + i * 640), 170)
for i, bx in enumerate((330, 860, 1390)):
    rustle(ow('flowers', 'planted', -0.2) + i * 0.35, 1.8, 0.0028, px(bx))
chord((Bb2, F3, Bb3, D4), ow('flowers', 'planted', 0.1), 0.5, step=0.18, ring=1.8)
rumble(ow('drivers', 'drivers', -0.4), 3.0, 0.003, px(100), 55, 320, 0.6)
chord((C3, G3, C4), ow('drivers', 'take', -0.1), 0.5, step=0.2, ring=1.4)
slide(ow('painting', 'paper', -0.4), 1.6, 0.0035, px(990))
for i in range(4):
    brush(ow('painting', 'children', 0.6) + 1.1 * i, 0.55, 0.0028, px(500 + 300 * i))
mark(2, ow('painting', 'children', 0.0), 0.55, low=Ab2)
card(ow('sales', 'shopkeepers', -0.3), 0.004, px(1410))
figure((Eb4, F4), ow('sales', 'up', -0.1), 0.45, 0.32, 0.6, 1.0)
tap(ow('more', 'asking', -0.2), 0.0035, px(1410))
figure((G3, Bb3, Eb4, G4), ow('more', 'more', -0.1), 0.45, 0.22, 0.5, 1.2)
card(ow('today', 'fifty', -0.3), 0.004, px(470))
mark(3, ow('today', 'fifty', -0.1), 0.6, low=Eb2)
card(ow('paper', 'put', -0.3), 0.004, px(470))
chord((Ab3, C4, Eb4), ow('paper', 'real', 0.0), 0.45, step=0.16, ring=1.6)
tap(oc('data', -0.2), 0.0035, px(560))
card(ow('data', 'team', -0.2), 0.004, px(560))
band(Eb5, ow('data', 'team', 0.0), 0.45, 1.6)
for word, off, m, x in (('real', -0.3, G4, 1240), ('learn', -0.2, Bb4, 1600), ('again', -0.3, Eb5, 1420)):
    tap(ow('way', word, off), 0.0035, px(x))
    band(m, ow('way', word, off + 0.1), 0.4, 1.0, px(x) * 0.5)
chord((Eb2, Bb2, G3, Bb3, Eb4, G4), oc('breath', 0.3), 0.7, step=0.2, ring=3.6, until=END)

# 2. The question behind the dashboard: the chapter turns on A flat major, grey February; the request's sheets; the question behind it:
#    a pair rising, open; the new building drawn in dashes; A$140 million: the big box's low C and G; the queue and 41 days: C minor,
#    low; Tuesday 30 March, the new way: E flat major; Ivy's route drawn, a stroke for each box; the real data: a pair; never a person:
#    E flat and B flat with a tick
LV[0] = 0.9
qw = lambda lid, word, off=0: W('question', lid, word, off)
qc = lambda lid, off=0: G('question', lid, off)
chord((Ab2, Eb3, C4), S0('question') + 0.4, 0.5, step=0.18, ring=1.8)
card(qw('ask', 'February', -0.2), 0.004, px(480))
card(qc('email', -0.05), 0.004, px(510))
card(qw('behind', 'bigger', -0.2), 0.004, px(440))
slide(qw('behind', 'new', -0.2), 1.2, 0.0035, px(1410))
figure((Bb3, Eb4), qw('behind', 'building', -0.1), 0.45, 0.34, 0.6, 1.2)
card(qw('cost', 'cost', -0.2), 0.004, px(1460))
for m, i in ((C3, 0), (G2, 1)):
    big(m, qw('cost', 'hundred', -0.1) + 0.3 * i, 0.6, 1.6)
slide(qc('waited', 0.0), 1.6, 0.003, px(1400))
card(qw('waited', 'request', -0.2), 0.004, px(1700))
card(qw('waited', 'forty-one', -0.3), 0.004, px(460))
chord((C3, G3, Eb4), qw('waited', 'forty-one', 0.0), 0.5, step=0.22, ring=1.6)
card(qw('newway', 'Tuesday', -0.2), 0.004, px(980))
chord((Eb3, G3, Bb3, Eb4), qw('newway', 'new', -0.1), 0.5, step=0.15, ring=1.6)
card(qw('page', 'drawn', -0.3), 0.004, px(980))
pen(qw('page', 'route', -0.2), 2.0, 0.004, px(980), 5)
tap(qw('rooms', 'rooms', -0.2), 0.0035, px(980))
card(qw('data', 'bookings', -0.3), 0.004, px(980))
card(qw('data', 'sensors', -0.3), 0.004, px(980))
figure((Bb3, D4), qw('data', 'real', -0.1), 0.42, 0.3, 0.6, 1.0)
tap(qw('governed', 'counts', -0.2), 0.0035, px(980))
ticked(qw('governed', 'never', -0.2), 0.004, px(980))
chord((Eb3, Bb3, G4), qw('governed', 'person', 0.0), 0.45, step=0.16, ring=1.4)

# 3. Something real in two weeks: the chapter turns on B flat major; the Manifesto's sheet; round 1's strip drawn; the agent's draft
#    written out, and a pair under it, G and C; the wrong assumption flagged: C minor, low; Ivy's checks; the glossary and the model:
#    A flat major; Jun's tick; Fast isn't careless; Friday 9 April, Graham sees the prototype: round 1 of the mark; the heat map filling;
#    "what would change your mind?": B flat and C, left open; his answer, written
LV[0] = 0.9
rw = lambda lid, word, off=0: W('real', lid, word, off)
rc = lambda lid, off=0: G('real', lid, off)
chord((Bb2, F3, Bb3, D4), S0('real') + 0.5, 0.5, step=0.18, ring=1.8)
card(rc('manifesto', 0.3), 0.004, px(960))
slide(rw('first', 'round', -0.1), 1.6, 0.0035, px(960))
tap(rw('first', 'one', 0.0), 0.0035, px(520))
card(rw('first', 'when', -0.2), 0.004, px(960))
card(rw('draft', 'drafts', -0.2), 0.004, px(930))
slide(rw('draft', 'drafts', 0.1), 1.6, 0.003, px(930))
figure((G4, C5), rw('draft', 'minute', 0.0), 0.42, 0.3, 0.6, 1.0)
tap(rw('wrong', 'booked', -0.1), 0.004, px(1340))
chord((C3, Eb4), rw('wrong', 'booked', 0.0), 0.5, step=0.2, ring=1.4)
tap(rw('caught', 'notes', -0.2), 0.0035, px(930))
tap(rw('caught', 'sensors', -0.3), 0.0035, px(930))
card(rw('glossary', 'glossary', -0.3), 0.004, px(770))
chord((Ab2, Eb3, C4, Eb4), rw('glossary', 'people', -0.1), 0.5, step=0.16, ring=1.8)
card(rw('glossary', 'model', -0.3), 0.004, px(1270))
ticked(rw('review', 'reviews', -0.1), 0.004, px(1270))
card(rw('fast', 'Fast', -0.1), 0.004, px(960))
tap(rc('friday', 0.4), 0.003, px(640))
tap(rw('friday', 'ten', -0.2), 0.0035, px(1560))
mark(1, rw('friday', 'prototype', 0.0), 0.55, low=Eb2)
slide(rw('heat', 'heat', -0.3), 2.6, 0.003, px(640))
card(rw('mind', 'question', -0.2), 0.004, px(1560))
figure((Bb4, C5), rw('mind', 'change', 0.0), 0.42, 0.4, 0.6, 1.4)
card(rw('answer', 'answer', -0.1), 0.004, px(1560))
pen(rw('answer', 'full', -0.2), 0.5, 0.004, px(1560), 2)
pen(rw('answer', "aren't", -0.3), 0.4, 0.004, px(1560), 2)

# 4. Three rounds, a week each: the chapter turns on E flat major; the rounds strip and the sprint review's sheet; Graham uses it himself,
#    first used: A flat major and a tick; the bars of working days: the waiting bar drawn, then the new way's, with a pair rising; the
#    street on the wall again: the streetlights' four notes, softer; the surprise: G minor; 38% and 93%, the peak drawn round; nobody
#    came: C and G, low; the two buildings: the full one, E flat major, and the quiet one's empty rooms, one low C; his answer moves: round 2
LV[0] = 0.9
nw = lambda lid, word, off=0: W('rounds', lid, word, off)
nc = lambda lid, off=0: G('rounds', lid, off)
chord((Eb3, Bb3, Eb4, G4), S0('rounds') + 0.4, 0.5, step=0.16, ring=1.6)
slide(nc('rounds', -0.2), 1.8, 0.003, px(960))
card(nw('scrum', 'Scrum', -0.1), 0.004, px(960))
ticked(nw('used', 'uses', -0.3), 0.004, px(1280))
chord((Ab2, C4, Eb4, Ab4), nw('used', 'himself', 0.0), 0.5, step=0.16, ring=1.6)
card(nc('waited', -0.1), 0.004, px(960))
slide(nw('waited', 'seven', -0.3), 1.4, 0.003, px(700))
slide(nw('took', 'new', -0.3), 1.8, 0.003, px(500))
figure((Bb3, Eb4), nw('took', 'eleven', 0.0), 0.42, 0.3, 0.6, 1.2)
tap(nc('back', 0.0), 0.0035, px(960))
for i, m in enumerate((Eb4, G4, Bb4, Eb5)):
    band(m, nw('back', 'talk', 0.2) + i * 0.4, 0.36, 0.9)
chord((G2, D3, G3, Bb3, D4), nw('showed', 'surprises', -0.1), 0.5, step=0.16, ring=1.6)
tap(nw('booked', 'thirty-eight', -0.3), 0.0035, px(1130))
tap(nw('booked', 'ninety-three', -0.3), 0.0035, px(1130))
slide(nw('booked', 'ninety-three', -0.3), 0.8, 0.003, px(560))
slide(nw('empty', 'nobody', -0.3), 0.8, 0.003, px(560))
tap(nw('empty', 'nobody', -0.2), 0.0035, px(1130))
for m, i in ((C3, 0), (G2, 1)):
    big(m, nw('empty', 'nobody', 0.0) + 0.34 * i, 0.55, 1.6)
tap(nc('right', 0.2), 0.0035, px(467))
tap(nw('right', 'saw', -0.2), 0.0035, px(1352))
tap(nw('right', 'average', -0.2), 0.0035, px(960))
chord((Eb3, G3, Bb3, Eb4, G4, Bb4), nw('right', 'crowded', -0.1), 0.45, step=0.12, ring=1.4)
big(C3, nw('right', 'empty', 0.0), 0.5, 1.8, px(1352) * 0.4)
card(nw('next', 'second', -0.2), 0.004, px(1560))
mark(2, nw('next', 'moves', 0.0), 0.55, low=Ab2)

# 5. Stop when it's enough: round 3 of the mark, whole, home to E flat, as the answer is plain; the peak marked short; the arrows drawn,
#    the moves, the bookings released; that meets the forecast: A flat major, then E flat; the decision is served: a tick, and the rounds
#    stop with a fingertip laid on a band; there's no fourth round, and no note for it. What stays: B flat major; a product of its own:
#    E flat major, higher; June: Graham's page, and the council's decision: the big box's low E flat under G, B flat and E flat
LV[0] = 0.9
ew = lambda lid, word, off=0: W('enough', lid, word, off)
ec = lambda lid, off=0: G('enough', lid, off)
card(ew('third', 'plain', -0.2), 0.004, px(1560))
mark(3, ew('third', 'plain', 0.0), 0.6, low=Eb2)
slide(ew('third', 'short', -0.2), 0.8, 0.003, px(560))
slide(ew('move', 'Move', -0.1), 2.0, 0.003, px(560))
card(ec('move', 0.1), 0.004, px(1560))
tap(ew('move', 'release', -0.2), 0.0035, px(560))
card(ew('met', 'meets', -0.2), 0.004, px(1560))
chord((Ab2, Eb3, C4, Ab4), ew('met', 'without', -0.1), 0.5, step=0.16, ring=1.2)
chord((Eb3, G3, Bb3, G4), ew('met', 'without', 1.3), 0.5, step=0.16, ring=1.8)
ticked(ew('stop', 'served', -0.2), 0.004, px(960))
mute(ew('stop', 'polish', -0.2), 0.005, px(1500))
card(ew('keep', 'taught', -0.1), 0.004, px(570))
card(ew('keep', 'model', -0.3), 0.004, px(1350))
chord((Bb2, D4, F4), ew('keep', 'definition', 0.0), 0.45, step=0.18, ring=1.4)
card(ew('owns', 'product', -0.3), 0.004, px(870))
chord((Eb3, Bb3, G4, Eb5), ew('owns', 'product', 0.0), 0.45, step=0.16, ring=1.6)
card(ew('council', 'University', -0.3), 0.004, px(1310))
pen(ew('decided', 'building', -0.3), 0.5, 0.004, px(1310), 2)
pen(ew('decided', 'timetable', -0.3), 0.5, 0.004, px(1310), 2)
chord((Eb2, G3, Bb3, Eb4), ew('decided', 'building', 0.0), 0.5, step=0.2, ring=2.0)

# 6. On Monday: the street on the wall: E flat major, as the film began, softer; Helena's two pills, a tick each; the four pieces of advice
#    pinned, a card each, with one E flat under the first and the open question under the third; and the close: the mark, whole, an
#    octave lower, its last note let ring with E flat major; and as the end card comes in, E flat major once more, on both boxes
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
tap(S0('monday') + 0.8, 0.0035, px(560))
chord((Eb2, Bb2, G3, Bb3, Eb4), S0('monday') + 0.9, 0.5, step=0.22, ring=2.0)
card(mw('back', 'weekend', -0.3), 0.004, px(560))
ticked(mw('helena', 'three', -0.2), 0.004, px(1180))
ticked(mw('helena', 'round', -0.2), 0.004, px(1180))
card(mc('define', 0.3), 0.004, px(400))
band(Eb4, mc('define', 0.4), 0.4, 1.4)
card(mw('data', 'real', -0.2), 0.004, px(960))
card(mw('ask', 'Ask', -0.2), 0.004, px(1520))
figure((Bb4, C5), mw('ask', 'change', 0.0), 0.4, 0.4, 0.6, 1.2)
card(mw('stop', 'short', -0.2), 0.004, px(960))
for word, off, x in (('real', -0.3, 960), ('learn', -0.2, 1200), ('repeat', -0.3, 720)):
    tap(mw('take', word, off), 0.003, px(x))
mark(3, mw('take', 'real', 0.0), 0.5, shift=-12, step=0.42, last=4.0, low=Eb2, until=TOT)
chord((G3, Bb3), mw('take', 'real', 0.42 * 5), 0.4, step=0.0, ring=4.0, until=TOT)
chord((Eb2, Bb2, G3, Eb4), mc('breath', 0.6), 0.45, step=0.24, ring=3.6, until=TOT)
