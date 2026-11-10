# Saying no, and what instead: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette (the module's palettes.md, row 6: the lead reserved by the setup thread on 5 November 2026; the partner chosen by this
# film's thread on 10 November 2026), made here, as music.py has neither:
#  - The rebec: the small bowed fiddle of the Middle Ages, a pear-shaped body carved from one piece of wood, three gut strings tuned G, D
#    and A, played in one position. Nasal and plain, bowed softly, no vibrato. Its range is narrow: from its open G (G3) to the D an
#    octave and a fifth above (D5), which the fourth finger reaches on the A string; the E above that needs a shift it doesn't make. It
#    plays what it can, well: the film's idea. Each bowed note is a string pulled by the bow's hair in Helmholtz motion (harmonic
#    partials, falling as 1/k), through a small hollow body that sings nasally around 1 to 1.6 kHz; a soft catch of the bow at the start,
#    a faint even hiss of hair on gut while it sounds, nothing that wavers; the bow lifts and the note stops.
#  - Its partner: the same rebec's strings plucked with a finger (pizzicato), short and dry in its small body, for the chords. The same
#    instrument, played another way, in the same narrow range: every other colour the site lacks belongs to another culture or sounds
#    like one it has, as the module's other threads found; and a rebec that only plays what it can carries the film.
# The mark: a phrase that climbs, E G B D, and stops short of the E above it, the note the rebec can't reach; then, after a breath, it
#    ends well lower, on B and the open G, in G major. In the opening it first climbs and stops (the whole sea, which can't be brought
#    back), and lands only when Kazakhstan chooses the part it can save; then whole, under "a no to the whole sea... a yes to the part";
#    at Helena's offer; back at the Aral on Monday; and at the close, its low G held into the end card.
# E minor, resolving to G major. Every chord is tuned pure from E (just intonation, see hz()): E minor, G major, C major, A minor, B minor
#    and B major are pure in this table; D major is not (its A is a comma flat), so D is only ever played with its F sharp, never its A.
#    Nothing Central Asian for the Aral, and no sea birds, fishing-boat horn or wind chimes (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one string, steady, no vibrato or bend, its partials harmonic. No urgent pulse: nothing in
#    the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/sn_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    """when a word of a line is spoken, as the film's own wAt() estimates it; a missing word, or one inside a longer word, stops the mix"""
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(2005)  # this film's own randomness: the room, the bow's hair, the paper

# ---- tuning: just intonation from E, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 40, 12)
    return 82.40689 * 2 ** o * _JI[pc]
# the rebec's notes, from its open G to the D it can reach; the E above it (E5) is the note it can't
G3, A3, B3, C4, D4, E4, Fs4, G4, A4, B4, C5, D5 = 55, 57, 59, 60, 62, 64, 66, 67, 69, 71, 72, 74

# ---- the levels: the bowed and plucked rebec matched by loudness, as far under the voice as the module's other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LR, LZ, FX = 0.1, 0.13, 4.0
LV = [1.0]

# a small room round the instrument, ringing for about three quarters of a second. Its level is set by what it rings where the notes are
# (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.75)).astype(np.float32))(np.arange(int(0.75 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.010 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig

# ---- the rebec's body: a small carved hollow with a few broad resonances, strongest around 1 to 1.6 kHz, which make it nasal; the
# seventh partial and the few above it that are out of tune with a 5-limit scale are kept low
_BODY = ((470, 0.65, 2.4), (1020, 1.3, 3.2), (1560, 1.15, 3.8), (2150, 0.5, 4.5))
def _body(f):
    return 0.28 + sum(g / np.sqrt(1 + (q * (f / fr - fr / f)) ** 2) for fr, g, q in _BODY)
_ODD = {7: 0.3, 11: 0.35, 13: 0.35, 14: 0.3}
def _hair(n, sec):
    """the bow's hair on gut: a faint, even hiss, narrow and low, the same from start to end"""
    return filt(noise(sec + 0.02)[:n], 'band', (700, 1900))

def rebec(m, s, d=1.0, g=1.0, pan=None, room=0.22, until=None):
    """a bowed note of d seconds: the bow catches the string, draws it at an even pressure, and lifts"""
    f0 = hz(m)
    if until is not None:
        d = min(d, max(0.15, until - s - 0.25))
    sec = d + 0.2; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 40):
        fk = f0 * k
        if fk > 2400:
            break
        sig += _body(fk) / k * _ODD.get(k, 1.0) * np.sin(2 * np.pi * fk * x + 0.7 * k)
    sig /= max(1e-9, float(np.abs(sig).max()))
    e = np.minimum(1, (1 - np.exp(-x / 0.03)) / 0.95) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    catch = filt(noise(0.08)[:int(0.06 * SR)], 'band', (500, 1600)) * np.exp(-np.arange(int(0.06 * SR)) / SR / 0.012)
    sig = sig * e + 0.025 * _hair(n, sec) * e
    sig[:len(catch)] += 0.05 * catch / max(1e-9, float(np.abs(catch).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 90)), room, 0.08, min(d, 1.2)), s, until)
    put(sig, s, g * LV[0] * LR, max(-0.3, min(0.3, (m - 64) * 0.02)) if pan is None else pan)

def pizz(m, s, g=1.0, pan=None, ring=0.45, room=0.18, until=None):
    """the same string plucked with a finger: a soft, dry note that dies in under half a second in the small body"""
    f0 = hz(m)
    if until is not None:
        ring = min(ring, max(0.1, until - s - 0.2))
    sec = ring + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; t1 = 0.3 * (196 / f0) ** 0.3
    sig = np.zeros(n)
    for k in range(1, 30):
        fk = f0 * k
        if fk > 2200:
            break
        a = abs(np.sin(np.pi * k * 0.22)) / (k * 0.22 * np.pi) / k ** 0.6 * _body(fk) * _ODD.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * fk * x + 0.4 * k) * np.exp(-x / (t1 / (1 + 0.7 * (k - 1))))
    sig *= (1 - np.exp(-x / 0.002)) * np.where(x < ring, 1.0, np.exp(-(x - ring) / 0.05))
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2100), 'high', 90)), room, 0.0, min(0.5, ring)), s, until)
    put(sig, s, g * LV[0] * LZ, max(-0.35, min(0.35, (m - 62) * 0.025)) if pan is None else pan)

# ---- what it plays
def chord(notes, s, g=1.0, step=0.1, ring=0.45, until=None):
    """a chord plucked from its lowest string up, a note on each of the rebec's three strings (G3 to C4 on the G string, D4 to G4 on
    the D, A4 to D5 on the A), so no two notes need the same string"""
    for i, m in enumerate(notes):
        pizz(m, s + step * i, g, None, ring, until=until)
def line(notes, s, d=0.5, g=1.0, step=None, last=None, until=None):
    """bowed notes one after another, each d long (step apart), the last held last seconds"""
    step = d if step is None else step
    for i, m in enumerate(notes):
        rebec(m, s + step * i, last if (last and i == len(notes) - 1) else d, g, until=until)
CLIMB = (E4, G4, B4, D5)
def mark(s, g=1.0, land=None, step=0.3, hold=0.7, last=1.8, under=True, until=None):
    """the mark: E G B D climbing, the D held and stopped short of the E above it; then, at land (or after a breath), B and the open G,
    the G held last seconds, with G major plucked under it. land=False: it climbs and stops, and doesn't land"""
    line(CLIMB, s, step, g, step, hold)
    if land is False:
        return
    t = s + step * 3 + hold + 0.45 if land is None else land
    rebec(B3, t, 0.36, g); rebec(G3, t + 0.38, last, g, until=until)   # B on the G string, then the open string itself
    if under:
        chord((G3, D4, B4), t + 0.38, 0.75 * g, step=0.09, ring=0.5, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.4 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.0045, pan=0.0):
    """a sheet pinned to the wall: a soft brush of paper, and the pin's faint press"""
    n = int(0.18 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.2)[:n], 'band', (420, 1700)) * _bump(x, 0.08) * (x < 0.08)
    _fx(fl + 0.5 * _knock(n, 170, 0.014, 0.075) / 1.3, s, g, pan, 1800)
def tap(s, g=0.004, pan=0.0):
    """a pill or a tag set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (260, 1000)) * np.exp(-x / 0.006) + 0.6 * _knock(n, 230, 0.011), s, g, pan, 1500)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """a bar drawn out across the weeks: a dry, even rub of chalk that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (220, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1400)
def pen(s, sec=0.8, g=0.005, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def wind(s, sec=4.0, g=0.004, pan=0.0):
    """salt and dust blown across the seabed: one soft, low hush that swells in and fades, never a howl"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 2); gr = 0.8 + 0.2 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (120, 700)) * _bump(x, sec, 1.2) * gr, s, g, pan, 900)
def water(s, sec=3.0, g=0.004, pan=0.0):
    """water coming in: a low, soft swell of moving water, smooth, no splash"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (90, 520)) * _bump(x, sec, 1.5), s, g, pan, 700)
def earth(s, sec=1.8, g=0.004, pan=0.0):
    """the dam laid across the strait: a low, even roll of earth and stone, and one soft, dull settling at its end"""
    n = int((sec + 0.4) * SR); x = np.arange(n) / SR
    roll = filt(noise(sec + 0.42)[:n], 'band', (70, 420)) * _bump(x, sec, 1.3) * (x < sec)
    _fx(roll + 0.5 * _knock(n, 80, 0.06, sec), s, g, pan, 800)

# =============================================================================================================================
# 1. Save what can be saved: the opening. The Aral Sea before 1960: E minor, plucked, and a long bowed B over it; the farms along the
#    rivers: C major; the sea shrinking, 1960 to 2004: a bowed line falling a step at a time, as slowly as the year counts; the split:
#    B minor; the harbour at Aralsk, grey: E minor, low; the dust: one soft hush. The whole sea back? The mark climbs and stops short;
#    "Something had to change": nothing. The choice: the mark lands, on the open G, in G major. The dam: an earthen roll, and C major;
#    finished, and the river let through: D with its F sharp, and the water; the sea rising: G major, and the water swelling; the fish:
#    a short rising line; the plants: C major; the shore: G major again; the south, not saved: E minor; the no and the yes: the whole
#    mark. Data work: two bare notes; the honest no: G major; and G major, held, under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('aral', lid, word, off)
oc = lambda lid, off=0: G('aral', lid, off)
END = E('aral')
rebec(E4, 0.6, 1.8, 0.6)
card(ow('sea', 'Aral', -0.3), 0.0035, px(350))
chord((G3, E4, B4), ow('sea', 'Aral', 0.2), 0.7, step=0.14, ring=0.5)
rebec(B4, ow('sea', 'fourth', 0.0), 2.2, 0.65)
tap(ow('rivers', 'cotton', -0.1), 0.0032, px(1600))
chord((G3, E4, C5), ow('rivers', 'cotton', 0.2), 0.6, step=0.14, ring=0.5)
tap(ow('rivers', 'families', -0.2), 0.0032, px(1600))
rebec(C5, ow('rivers', 'families', 0.3), 1.6, 0.55)
# 1960 to 2004: a step down at a time, as the counter runs
for i, m in enumerate((B4, A4, G4, Fs4, E4)):
    rebec(m, ow('shrank', 'shrank', 0.2 + 1.7 * i), 1.5, 0.55)
card(ow('shrank', 'lost', -0.3), 0.0035, px(350))
for wd, x in (('split', 985), ('north', 1300), ('south', 1300)):
    tap(ow('split', wd, -0.1), 0.0032, px(x))
chord((B3, Fs4, D5), ow('split', 'two', 0.1), 0.55, step=0.16, ring=0.5)
# Aralsk, grey, and the dust
chord((B3, E4, B4), oc('towns', -0.1), 0.6, step=0.18, ring=0.55)
card(ow('towns', 'Aralsk', -0.3), 0.0035, px(1480)); card(ow('towns', 'salty', -0.3), 0.0035, px(1480))
rebec(E4, ow('towns', 'jobs', 0.0), 1.8, 0.5)
card(ow('dust', 'Storms', -0.2), 0.0035, px(1480))
wind(ow('dust', 'Storms', 0.0), 4.4, 0.004, px(1100))
# the whole sea back? The mark climbs, and stops short of the note it can't reach. Then nothing, for "Something had to change"
card(ow('whole', 'whole', -0.3), 0.0035, px(370))
mark(ow('whole', 'rivers', -0.1), 0.6, land=False)
# the choice: it lands, on the open G
card(ow('chose', 'chose', -0.3), 0.0035, px(370))
rebec(B3, ow('chose', 'northern', 0.0), 0.36, 0.6); rebec(G3, ow('chose', 'northern', 0.38), 2.0, 0.6)
chord((G3, D4, B4), ow('chose', 'northern', 0.38), 0.5, step=0.12, ring=0.6)
# the dam, laid across the strait; finished, and the river let through; the sea rising
card(ow('dam', 'dam', -0.3), 0.0035, px(1510))
earth(ow('dam', 'Kok', -0.1), 1.8, 0.0045, px(930))
chord((C4, E4, C5), ow('dam', 'thirteen', 0.0), 0.55, step=0.14, ring=0.5)
card(ow('done', 'finished', -0.3), 0.0035, px(390))
tap(ow('done', 'river', -0.3), 0.0032, px(1420))
water(ow('done', 'upstream', -0.1), 2.6, 0.0035, px(1400))
rebec(Fs4, ow('done', 'arrive', 0.1), 1.5, 0.5); rebec(D5, ow('done', 'arrive', 0.1), 1.5, 0.4)
water(ow('rose', 'rose', -0.2), 3.4, 0.0045, px(1000))
chord((B3, G4, D5), ow('rose', 'higher', 0.0), 0.6, step=0.15, ring=0.55)
card(ow('rose', 'faster', -0.3), 0.0035, px(370))
rebec(B4, ow('rose', 'level', 0.0), 1.8, 0.5)
# the fish back, the catch, the plants, the shore
card(ow('fresh', 'salty', -0.4), 0.0035, px(350))
line((G4, A4, B4), ow('fresh', 'fish', 0.1), 0.26, 0.5, last=0.9)
card(ow('fresh', 'catch', -0.3), 0.0035, px(1500))
card(ow('plants', 'plants', -0.3), 0.0035, px(350))
chord((G3, E4, C5), ow('plants', 'abroad', 0.0), 0.5, step=0.13, ring=0.5)
slide(oc('shore', 0.3), 1.0, 0.0032, px(1050))
tap(ow('shore', 'Aralsk', -0.3), 0.0032, px(1250)); tap(ow('shore', 'kilometres', -0.3), 0.0032, px(1300))
chord((G3, D4, B4), ow('shore', 'towards', 0.1), 0.55, step=0.14, ring=0.55)
# the south, not saved
card(ow('south', 'southern', -0.3), 0.0035, px(370))
wind(ow('south', 'shrinking', -0.3), 3.6, 0.0032, px(1050))
chord((G3, E4, B4), ow('south', 'dry', 0.1), 0.5, step=0.16, ring=0.5)
# a no to the whole sea, said plainly, and a yes to the part: the whole mark, landing on "yes"
tap(ow('no', 'no', -0.1), 0.0032, px(930))
mark(ow('no', 'whole', -0.2), 0.6, land=ow('no', 'yes', 0.0), last=1.6)
tap(ow('no', 'yes', -0.1), 0.0032, px(900))
# data work: two bare notes; the honest no, G major
card(ow('data', 'asked', -0.3), 0.0035, px(960))
tap(ow('data', 'bare', -0.1), 0.0032, px(620)); tap(ow('data', 'neither', -0.1), 0.0032, px(1300))
rebec(E4, ow('data', 'bare', 0.2), 0.8, 0.45)
rebec(Fs4, ow('data', 'neither', 0.2), 0.8, 0.42)
tap(ow('instead', 'honest', -0.1), 0.0032, px(960))
chord((B3, G4, D5), ow('instead', 'need', 0.1), 0.5, step=0.14, ring=0.5)
# the title: G major, bowed and held, the open G under it, gone before the next chapter
pizz(G3, oc('breath', 0.3), 0.6, None, 0.5)
rebec(D4, oc('breath', 0.4), 4.0, 0.42, until=END); rebec(B4, oc('breath', 0.4), 4.0, 0.42, until=END)

# 2. Two asks, the same weeks: a year from now. The turn: E minor, plucked; Clara's request and the registrar's, a sheet each; the one
#    list; Jun and Noor's weeks, and the two bars drawn; the yes to both and the bare no, a sheet each; and B, alone, as she asks
LV[0] = 0.9
aw = lambda lid, word, off=0: W('asks', lid, word, off)
ac = lambda lid, off=0: G('asks', lid, off)
chord((B3, E4, B4), S0('asks') + 0.3, 0.55, step=0.16, ring=0.5)
card(aw('clara', 'Clara', -0.3), 0.0035, px(580))
card(aw('same', "registrar's", -0.3), 0.0035, px(960))
card(aw('list', 'list', -0.3), 0.0035, px(960))
tap(aw('list', 'module', -0.3), 0.0030, px(960))
card(ac('both', 0.0), 0.0035, px(660))
slide(aw('both', 'Jun', -0.3), 1.0, 0.0032, px(560)); slide(aw('both', 'weeks', -0.3), 1.0, 0.0032, px(640))
rebec(G4, aw('both', 'August', 0.2), 1.2, 0.42); rebec(A4, aw('both', 'August', 0.2), 1.2, 0.38)
card(aw('yes', 'yes', -0.2), 0.0035, px(470))
card(aw('bare', 'bare', -0.2), 0.0035, px(470))
tap(aw('asks', 'asks', -0.2), 0.0030, px(1000))
rebec(B4, aw('asks', 'asks', 0.3), 1.6, 0.48)

# 3. What's the date for? Fisher and Ury's sheet; the position and the question, a tag each; the meeting: G major, soft; what the date
#    is for, a sheet each; what the budget needs: a single bowed G; her position and her interests; said back: G major, the B on top
LV[0] = 0.9
dw = lambda lid, word, off=0: W('date', lid, word, off)
dc = lambda lid, off=0: G('date', lid, off)
card(dw('book', 'Fisher', -0.3), 0.0035, px(540))
tap(dw('position', 'asks', -0.1), 0.0030, px(1400))
slide(dw('position', 'why', -0.2), 0.6, 0.0030, px(1400))
tap(dw('position', 'date', -0.2), 0.0030, px(1400))
chord((B3, G4, D5), dc('wed', 0.0), 0.5, step=0.16, ring=0.5)
card(dw('wed', 'Wednesday', -0.2), 0.0035, px(960))
card(dw('budget', 'budget', -0.3), 0.0035, px(530))
card(dw('new', 'model', -0.3), 0.0035, px(1390))
tap(dw('enough', 'current', -0.2), 0.0030, px(530))
rebec(G4, dw('enough', 'current', 0.2), 1.4, 0.45)
card(dw('interest', 'position', -0.2), 0.0035, px(470)); card(dw('interest', 'interests', -0.2), 0.0035, px(1390))
tap(dw('back', 'says', -0.2), 0.0030, px(960))
chord((G3, D4, B4), dw('back', 'nods', 0.2), 0.48, step=0.15, ring=0.55)

# 4. The trade-off, in the open: the turn: C major; the one list, and Clara and Mei; August's weeks, three bars drawn; the new model past
#    the month's end: E minor, short; the refresh fits: a single G; the order, fair criteria, the options, a sheet each; the options for
#    both: B minor, then G major
LV[0] = 0.9
pw = lambda lid, word, off=0: W('open', lid, word, off)
pc = lambda lid, off=0: G('open', lid, off)
chord((C4, E4, C5), S0('open') + 0.3, 0.5, step=0.15, ring=0.5)
card(pw('side', 'puts', -0.3), 0.0035, px(960))
card(pc('weeks', -0.2), 0.0035, px(940))
slide(pw('weeks', 'rooms', -0.3), 1.0, 0.0032, px(680)); slide(pw('weeks', 'model', -0.3), 1.6, 0.0032, px(900))
tap(pw('weeks', 'six', 0.2), 0.0030, px(1390))
chord((G3, E4, B4), pw('weeks', 'test', 0.1), 0.5, step=0.15, ring=0.5)
slide(pw('refresh', 'Refreshing', -0.2), 0.8, 0.0030, px(1015))
tap(pw('refresh', 'week', -0.2), 0.0030, px(1015))
rebec(G4, pw('refresh', 'week', 0.3), 1.2, 0.45)
card(pw('order', 'order', -0.2), 0.0035, px(530))
card(pw('fair', 'Fisher', -0.3), 0.0035, px(1390))
card(pw('options', 'options', -0.3), 0.0035, px(960))
chord((B3, Fs4, D5), pw('options', 'budget', 0.0), 0.45, step=0.15, ring=0.5)
chord((B3, G4, D5), pw('options', 'December', 0.3), 0.48, step=0.15, ring=0.55, until=E('open'))

# 5. A no, and what instead: Ury's sheet; the dam's yes and no, back from the opening, a tap each; the yes: a bowed G; the no: a plucked
#    E, alone; her offer: the mark, landing as the first date is named; the second date, a sheet; would that work? D and its F sharp,
#    unresolved; Clara's to choose, a sheet; agreed: the dates written in, a tick, and G major
LV[0] = 0.9
fw = lambda lid, word, off=0: W('offer', lid, word, off)
fc = lambda lid, off=0: G('offer', lid, off)
card(fw('ury', 'Ury', -0.3), 0.0035, px(960))
tap(fw('dam', 'Kok', -0.2), 0.0028, px(960))
tap(fw('dam', 'yes', -0.1), 0.0030, px(960)); tap(fw('dam', 'no', -0.1), 0.0030, px(960))
tap(fw('yes', 'yes', -0.1), 0.0030, px(960))
rebec(G4, fw('yes', 'yes', 0.2), 1.0, 0.45)
tap(fw('no', 'no', -0.1), 0.0030, px(960))
pizz(E4, fw('no', 'no', 0.2), 0.55, None, 0.4)
card(fw('refresh', 'offer', -0.2), 0.0035, px(530))
mark(fw('refresh', 'offer', 0.1), 0.55, land=fw('refresh', 'refreshed', 0.0), last=1.6)
card(fw('october', 'new', -0.3), 0.0035, px(1390))
tap(fw('work', 'work', -0.4), 0.0030, px(960))
rebec(Fs4, fw('work', 'work', 0.2), 1.3, 0.45); rebec(D5, fw('work', 'work', 0.2), 1.3, 0.38)
card(fw('choose', 'choose', -0.3), 0.0035, px(960))
pen(fw('agrees', 'dates', -0.2), 1.0, 0.0045, px(1370), 4)
ticked(fw('agrees', 'writing', -0.1), 0.0045, px(1724))
tap(fw('agrees', 'not', -0.1), 0.0030, px(960))
chord((B3, G4, D5), fw('agrees', 'agrees', 0.1), 0.5, step=0.14, ring=0.55)

# 6. Kept, on time: each date ticked green as it's kept, a bowed note each, rising: G, B, D; reviewed, a tag; November, a sheet; what it
#    built: C major, then G
LV[0] = 0.9
kw = lambda lid, word, off=0: W('kept', lid, word, off)
kc = lambda lid, off=0: G('kept', lid, off)
for lid, word, m, x in (('aug', 'refreshed', G4, 480), ('sep', 'budget', B4, 960), ('oct', 'ready', D5, 1440)):
    ticked(kw(lid, word, 0.5), 0.0045, px(x))
    rebec(m, kw(lid, word, 0.6), 1.2, 0.42)
tap(kw('oct', 'reviewed', -0.2), 0.0030, px(1440))
card(kw('next', 'November', -0.2), 0.0035, px(570))
tap(kw('trust', 'clear', -0.1), 0.0030, px(570)); tap(kw('trust', 'trust', -0.2), 0.0030, px(570))
chord((G3, E4, C5), kw('trust', 'trust', 0.3), 0.45, step=0.15, ring=0.5)
chord((G3, D4, B4), kw('trust', 'keep', 0.4), 0.48, step=0.15, ring=0.6, until=E('kept'))

# 7. On Monday: back at the Aral, the mark, landing on "saved"; what Helena did, a note each as each pill comes in: E, G, B, then the open
#    G; the four steps, a sheet each; the next film's tag; the last line's two pills, and the close: the mark once more, its open G held
#    with B and D into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
tap(mw('back', 'whole', -0.2), 0.0030, px(400))
mark(mw('back', 'promise', -0.2), 0.5, land=mw('back', 'saved', 0.0), last=1.6, under=False)
tap(mw('back', 'saved', -0.2), 0.0030, px(400))
for wd, m in (('asked', E4), ('showed', G4), ('offered', B4), ('kept', G3)):
    tap(mw('helena', wd, -0.1), 0.0030, px(1220))
    rebec(m, mw('helena', wd, 0.1), 1.3, 0.4)
card(mc('ask', 0.3), 0.0035, px(530))
for lid, word, x in (('show', 'Put', 1390), ('offer', 'Say', 530), ('write', 'Let', 1390)):
    card(mw(lid, word, -0.1), 0.0035, px(x))
tap(mw('next', 'next', -0.1), 0.0030, px(960))
tap(mw('take', 'Never', -0.1), 0.0030, px(560)); tap(mw('take', 'say', -0.1), 0.0030, px(1260))
mark(mw('take', 'when', 0.3), 0.55, last=6.0, until=TOT)
rebec(D4, mw('take', 'when', 0.3 + 0.9 + 0.7 + 0.45 + 0.38 + 0.3), 5.6, 0.36, until=TOT)
rebec(B4, mw('take', 'when', 0.3 + 0.9 + 0.7 + 0.45 + 0.38 + 0.6), 5.2, 0.32, until=TOT)
