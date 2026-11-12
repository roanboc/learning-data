# People before roles: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, the module's (palettes.md, row 15: chosen by this film's thread on 12 November 2026, as the series was added that day): a
# cor anglais and a bassoon, as a pair, a player to each. Nearly every instrument the site lacks is taken, so the film pairs two the
# site has, in a pair no film has: each plays in other films, and the two meet only inside a reed trio, under an oboe. Both are made
# here, as music.py has neither.
#  - The cor anglais: the oboe's lower cousin, a double reed with a pear-shaped bell that covers its tone. Soft and dark here, each note
#    tongued gently and held level, with no vibrato, and nothing above about 2.3 kHz.
#  - The bassoon: the double reed an octave and more below it, its low notes thin at the bottom and full in the middle, as a bassoon's
#    are. Two players, so never more than two notes at once: every chord is a pair, the rest left to the ear.
#    Two voices, not one: a film about knowing each person, and who they turn to, is played by two who answer each other.
# The mark: the names. Each of the seven has a figure made from the rhythm of their name as it is said, a note for each syllable, starting
#    on their own note of the scale (in the order of the chart's boxes: Yusuf D flat, Noor F, Marta G flat, Jun A flat, Erin B flat, Sam C,
#    Tomás E flat). The bassoon says the first names of two syllables (Yusuf, Marta, Erin, Tomás), the cor anglais those of one (Noor,
#    Jun, Sam). In the opening the seven are seven plain notes, all one length: nobody is known yet. Each figure is first heard as Helena
#    sits down with that person. Where four of them say who they turn to, each one's first name ends on Jun's note. On Friday the seven
#    first names are one phrase, passed between the two voices, which end together; it comes back at the close.
#    At the bridge: single notes that gather where many hands make it new, stand apart in the years it is left, and come together
#    again when the people return.
# D flat major, B flat minor for the problem (the steel bridge and the years the rope is left, the plan she could make by lunch, a
#    change people can't see). Every two notes that sound together are tuned pure from D flat (just intonation, see hz()): D flat, G flat
#    and A flat major, and B flat and F minor, are pure in this table; E flat held with G flat or with B flat is not, and never sounds.
#    Nothing Andean for the bridge: no flute or pipe, no harp, guitar, mandolin, violin, drum or band, no five-note tune, and no river,
#    wind or birdsong played as music (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note steady, with no vibrato, its partials harmonic; each stopped before it would ring into the
#    next chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/pb_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1972)  # this film's own randomness: the room, the paper, the pencil

# ---- tuning: just intonation from D flat, so two notes sounding together are whole-number ratios of each other and nothing beats.
# D flat, G flat and A flat major, and B flat and F minor, are pure in this table; E flat held with G flat or B flat is not
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 37, 12)
    return 69.29566 * 2 ** o * _JI[pc]
Bb1, Db2, Gb2, Ab2, Bb2, Db3, Eb3, F3, Gb3, Ab3, Bb3 = 34, 37, 42, 44, 46, 49, 51, 53, 54, 56, 58
C4, Db4, Eb4, F4, Gb4, Ab4, Bb4, C5, Db5, Eb5 = 60, 61, 63, 65, 66, 68, 70, 72, 73, 75

# ---- the levels: the two reeds matched by loudness, as far under the voice as the module's other music; the effects about 12 dB under
# the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LC, LB, FX = 0.060, 0.067, 3.9
LV = [1.0]

# a small hall round the two players, ringing on for a little over a second. Its level is set by what it rings where the notes are
# (its gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the hall round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), as a room lifts some pitches and
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

# ---- a double reed's sound: harmonic partials, every one of them, as a conical bore gives; the reed's buzz is rich, and the bore and
# the bell let it out in bands (formants) that stay where they are whatever the note. The cor anglais: a little of its lowest partial,
# most near 1 kHz, and its covered bell takes the top away. The bassoon: thin at the very bottom, full near 470 Hz, a second, weaker
# band near 1.15 kHz. The reed speaks in a few hundredths of a second, the upper partials a little after the low ones, with a breath of
# air at the start; then the note holds, shaped by one slow breath (never a tremble), until the player stops the air
def _spec(fk, kind):
    if kind == 'ca':
        return fk / (fk + 180.0) * (0.30 + np.exp(-((fk - 1000.0) / 330.0) ** 2) + 0.55 * np.exp(-((fk - 560.0) / 200.0) ** 2)) / (1 + (fk / 1700.0) ** 4)
    return fk / (fk + 90.0) * (0.22 + np.exp(-((fk - 470.0) / 190.0) ** 2) + 0.40 * np.exp(-((fk - 1150.0) / 260.0) ** 2)) / (1 + (fk / 1800.0) ** 4)
def _reed(f0, d, kind, top=2300):
    """one note: f0 Hz, held d seconds, then stopped"""
    sec = d + 0.4; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 48):
        fk = f0 * k
        if fk > top:
            break
        on = 1 - np.exp(-x / (0.016 + 0.005 * (k - 1)))
        off = np.where(x < d, 1.0, np.exp(-(x - d) / (0.075 / (1 + 0.15 * (k - 1)))))
        sig += _spec(fk, kind) / k ** 0.3 * on * off * np.sin(2 * np.pi * fk * x + 0.5 * k)
    if d >= 1.0:
        sig *= 0.88 + 0.12 * np.sin(np.pi * np.clip(x / d, 0, 1)) ** 0.8    # one slow breath through a long note, about a decibel
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    br = filt(noise(sec + 0.02)[:n], 'band', (600, 1900)) * np.exp(-x / 0.03); br = br / max(1e-9, float(np.abs(br).max()))
    return (sig + 0.02 * br).astype(np.float32)

def ca(m, s, d=1.0, g=1.0, pan=None, room=0.26, until=None):
    """the cor anglais: one note at s, tongued softly and held d seconds; it sits a little to the right"""
    if until is not None:
        d = min(d, max(0.15, until - s - 0.3))
    sig = _reed(hz(m), d, 'ca')
    sig = _until(_room(norm(filt(filt(sig, 'low', 2300), 'high', 120)), room, 0.25 if d > 0.7 else 0.05, d), s, until)
    put(sig, s, g * LV[0] * LC, 0.14 if pan is None else pan)

def bn(m, s, d=1.0, g=1.0, pan=None, room=0.24, until=None):
    """the bassoon: one note at s, held d seconds; it sits a little to the left"""
    if until is not None:
        d = min(d, max(0.15, until - s - 0.3))
    sig = _reed(hz(m), d, 'bn')
    sig = _until(_room(norm(filt(filt(sig, 'low', 2100), 'high', 45)), room, 0.25 if d > 0.7 else 0.05, d), s, until)
    put(sig, s, g * LV[0] * LB, -0.14 if pan is None else pan)

# ---- what they play
def pair(lo, hi, s, d=2.0, g=1.0, until=None, lag=0.05):
    """two notes together, the bassoon below, the cor anglais above (always a pure interval)"""
    bn(lo, s, d, g, until=until); ca(hi, s + lag, d - lag, g, until=until)
def line(notes, s, g=1.0, until=None, pan=None):
    """a figure, a note at a time: (who, note, when, how long) for each, who 'c' the cor anglais or 'b' the bassoon"""
    for who, m, at, d in notes:
        (ca if who == 'c' else bn)(m, s + at, d, g, pan, until=until)

# the figure of each name: its rhythm as the name is said, starting on that person's own note
NAME = {
    'noor':  (('c', F4, 0.00, 0.46), ('c', Ab4, 0.54, 0.24), ('c', Gb4, 0.84, 0.95)),                                     # NOOR RAH-man
    'sam':   (('c', C5, 0.00, 0.40), ('c', Ab4, 0.48, 0.16), ('c', Bb4, 0.68, 0.36), ('c', Ab4, 1.10, 0.85)),             # SAM o-KAH-for
    'jun':   (('c', Ab4, 0.00, 0.52), ('c', Db5, 0.62, 1.10)),                                                            # JUN PARK
    'yusuf': (('b', Db3, 0.00, 0.36), ('b', Eb3, 0.42, 0.16), ('b', F3, 0.62, 0.16), ('b', Ab3, 0.84, 0.95)),             # YU-suf de-MIR
    'marta': (('b', Gb3, 0.00, 0.36), ('b', F3, 0.42, 0.18), ('b', Ab3, 0.68, 0.36), ('b', Bb3, 1.10, 0.80)),             # MAR-ta SIL-va
    'erin':  (('b', Bb3, 0.00, 0.36), ('b', Ab3, 0.42, 0.18), ('b', F3, 0.68, 1.00)),                                     # E-rin WALSH
    'tomas': (('b', Eb4, 0.00, 0.16), ('b', Db4, 0.20, 0.38), ('b', Bb3, 0.66, 0.16), ('b', Ab3, 0.86, 0.36), ('b', Db3, 1.30, 0.85)),  # to-MÁS or-TE-ga
}
# the seven first names as one phrase, in the order of the row on screen: when each name begins, and when the two voices end together
# (the same numbers as PB_SING and PB_SING_ALL in src/pb_scenes.js, where each name lifts as it is played)
SING, SING_ALL = (0, 0.62, 1.10, 1.72, 2.20, 2.82, 3.30), 4.0
def names(s, g=1.0, close=1.6, until=None):
    line((('b', Db3, SING[0], 0.32), ('b', Eb3, SING[0] + 0.36, 0.18), ('c', F4, SING[1], 0.42),          # Yu-suf, Noor
          ('b', Gb3, SING[2], 0.32), ('b', F3, SING[2] + 0.36, 0.18), ('c', Ab4, SING[3], 0.42),          # Mar-ta, Jun
          ('b', Bb3, SING[4], 0.32), ('b', Ab3, SING[4] + 0.36, 0.18), ('c', C5, SING[5], 0.42),          # E-rin, Sam
          ('b', Eb4, SING[6], 0.16), ('b', Db4, SING[6] + 0.20, 0.42)), s, g, until=until)                # To-más
    pair(Db3, F4, s + SING_ALL, close, g, until=until, lag=0.03)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.0035, pan=0.0):
    """a sheet pinned up or laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0032, pan=0.0, f=210):
    """something small set down, a pill, a tag or a box on the chart: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, f, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """a line drawn out on a sheet: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pencil(s, sec=0.8, g=0.004, pan=0.0, n=1):
    """a pencil's soft drag across paper, a stroke at a time: lower and rounder than a pen"""
    for i in range(n):
        d = sec / n * (0.95 if n == 1 else R1.uniform(0.7, 0.9)); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 45)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (450, 1700)) * _bump(x, d, 0.7) * (0.35 + 0.65 * gr), t, g, pan, 1900)
def ticked(s, g=0.004, pan=0.0):
    """a tick drawn: two quick strokes"""
    pencil(s, 0.24, g, pan, 2)
def sheets(s, sec=1.8, g=0.0032, pan=0.0):
    """the list's lines moved into order: one soft shuffle of paper that rises and settles"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 9); gr = 0.6 + 0.4 * np.abs(gr) / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1500)) * _bump(x, sec, 1.2) * gr, s, g, pan, 1700)
def truck(s, sec=4.8, g=0.0034, pan=0.0):
    """a truck on the steel bridge, far up the gorge: one low, even hum that comes and goes, never an engine's rattle"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 4); gr = 0.8 + 0.2 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (55, 300)) * _bump(x, sec, 1.3) * gr, s, g, pan, 480)
def steelwork(s, sec=2.4, g=0.0032, pan=0.0):
    """the steel bridge set across the gorge: a low, dull roll, and its soft, heavy landing"""
    n = int((sec + 0.4) * SR); x = np.arange(n) / SR
    roll = filt(noise(sec + 0.42)[:n], 'band', (70, 420)) * _bump(x, sec, 1.2) * (x < sec)
    _fx(roll + 0.6 * _knock(n, 88, 0.06, sec), s, g, pan, 800)
def gathering(s, sec=3.4, g=0.0034, pan=0.0):
    """people coming onto both banks: one soft texture of many feet on dry ground that swells in and settles, never a patter"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 7); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (140, 800)) * _bump(x, sec, 1.1) * gr, s, g, pan, 1000)
def cord(s, sec=0.9, g=0.0034, pan=0.0):
    """a rope of grass taking weight: one soft, dry creak"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 22)); gr = gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (260, 900)) * _bump(x, sec, 1.6) * (0.3 + 0.7 * gr), s, g, pan, 1200)

BOX = (240, 480, 720, 960, 1200, 1440, 1680)   # where the chart's seven boxes are drawn (PB_X7)
OUT = (3, 2, 4, 1, 5, 0, 6)                    # the order they come in: from the middle outwards

# =============================================================================================================================
# 1. The bridge they went back to: the opening. The gorge: the bassoon's lowest D flat and, far above it, the cor anglais; the bridge
#    hanging: one phrase that dips and rises as the rope does, passed from one voice to the other; many hands: single notes that
#    gather into a pair. 1968: the steel set across, and B flat minor; the truck; then single notes, far apart, as the rope is left,
#    down to the bassoon's lowest B flat. October 1972: one note, alone; the keeper's words: B flat minor, then A flat, waiting; and
#    when the new year came, D flat. "Only now does everyone come": two notes apart, then a run that gathers both voices. Each June:
#    the banks filling; four notes for four communities; minka, G flat; UNESCO, A flat; "like if we died", B flat minor, and a rest.
#    Steel: one voice; rope: both. The chart's seven boxes: seven taps, all alike; the seven people: seven plain notes, one length
#    each, nobody known yet. D flat, held, under the title card
LV[0] = 0.9
ow = lambda lid, word, off=0: W('bridge', lid, word, off)
oc = lambda lid, off=0: G('bridge', lid, off)
END = E('bridge')
bn(Db2, 0.6, 3.4, 0.8); ca(Ab4, 1.5, 2.5, 0.6)
tap(ow('where', 'Apurímac', -0.3), 0.003, px(380))
line((('c', Ab4, 0.00, 0.26), ('c', F4, 0.32, 0.26), ('b', Db4, 0.64, 0.26), ('b', Ab3, 0.96, 0.46),
      ('b', Db4, 1.50, 0.26), ('c', F4, 1.82, 0.26), ('c', Ab4, 2.14, 1.30)), ow('rope', 'hangs', -0.2), 0.7)
tap(ow('rope', 'keshwa', -0.3), 0.003, px(960))
pair(Db3, F4, ow('incas', 'crossed', -0.2), 2.4, 0.6)
pair(Gb2, Db5, oc('only', 0.2), 2.2, 0.55)
# many hands: single notes, each a little sooner than the last, until two sound together
line((('c', F4, 0.00, 0.40), ('b', Ab3, 0.52, 0.34), ('c', Ab4, 0.94, 0.26), ('b', Db3, 1.24, 1.50), ('c', Db5, 1.44, 1.30)), ow('wear', 'made new', -0.3), 0.65)
cord(ow('wear', 'made new', -0.6), 0.9, 0.003, px(470))
# 1968: the steel bridge set across the gorge, and a truck on it
steelwork(ow('steel', 'steel', -0.3), 2.4, 0.0032, px(950))
tap(ow('steel', 'steel', -0.3), 0.003, px(960))
bn(Bb2, ow('steel', 'steel', 0.3), 2.6, 0.7); ca(F4, ow('steel', 'steel', 0.8), 2.1, 0.55)
tap(ow('steel', 'almost', -0.2), 0.003, px(960))
truck(ow('need', 'cars', -0.5), 4.8, 0.0034, px(950))
ca(F4, ow('need', 'few', 0.0), 1.3, 0.55)
# 1970: left to wear. Single notes, far apart, each alone
tap(oc('left', 0.2), 0.003, px(960))
ca(Db5, oc('left', 0.4), 1.1, 0.5)
tap(ow('left', 'decaying', -0.2), 0.003, px(960))
bn(F3, oc('left', 3.2), 1.1, 0.55)
cord(oc('left', 1.6), 1.4, 0.003, px(960))
ca(Bb4, oc('left', 5.9), 1.2, 0.45)
bn(Bb1, ow('skill', 'die', -0.5), 2.8, 0.75)
# October 1972: one note, alone; his words; and what they decided
tap(ow('keeper', 'October', -0.1), 0.003, px(250))
ca(Ab4, ow('keeper', 'decided', 0.1), 1.5, 0.5)
card(ow('sad', 'My', -0.3), 0.0035, px(960))
pair(Bb2, Db4, ow('sad', 'My', 0.1), 2.6, 0.55)
card(oc('rebuild', -0.2), 0.0035, px(960))
pair(Ab2, C5, oc('rebuild', 0.4), 2.0, 0.55)
pair(Db3, Ab4, ow('did', 'did', -0.1), 2.4, 0.65)
# few came; only now does everyone come: two notes apart, then both voices in one rising run
line((('b', F3, 0.00, 0.50), ('c', Ab4, 0.70, 0.60)), ow('all', 'few', -0.2), 0.5)
card(ow('all', 'Only', -0.3), 0.0035, px(960))
line((('b', Db3, 0.00, 0.20), ('c', F4, 0.18, 0.20), ('b', Ab3, 0.36, 0.20), ('c', Ab4, 0.54, 0.20), ('b', Db4, 0.72, 1.70), ('c', Db5, 0.90, 1.52)),
     ow('all', 'everyone', -0.2), 0.65)
# each June: the banks filling, four notes for four communities, about a thousand people
gathering(oc('today', -0.1), 3.4, 0.0034, 0.0)
line((('b', Db3, 0.00, 0.30), ('b', F3, 0.36, 0.30), ('c', Ab4, 0.72, 0.30), ('c', Db5, 1.08, 1.20)), ow('today', 'four', -0.1), 0.6)
card(ow('today', 'thousand', -0.4), 0.0035, px(960))
card(ow('minka', 'minka', -0.2), 0.0035, px(1550))
pair(Gb2, Bb4, ow('minka', 'minka', 0.2), 2.4, 0.55)
card(ow('unesco', 'strengthening', -0.5), 0.0035, px(960))
pair(Ab2, Eb5, ow('unesco', 'strengthening', -0.1), 2.4, 0.5)
card(ow('died', 'If', -0.4), 0.0035, px(960))
pair(Bb2, F4, ow('died', 'If', 0.0), 2.6, 0.55)
# steel: a way across, one voice; rope: a way to be together, both
truck(oc('turn', -0.6), 4.8, 0.003, px(950))
tap(ow('turn', 'carry', -0.3), 0.003, px(948))
bn(Db3, ow('turn', 'carry', -0.1), 1.2, 0.6)
tap(ow('turn', 'together', -0.4), 0.003, px(960))
pair(Db4, F4, ow('turn', 'together', -0.2), 2.2, 0.6)
# a data team, read both ways: the chart pinned up, seven boxes, all alike; then the seven, a plain note each, from the left
card(oc('data', 0.1), 0.0035, px(960))
for j, i in enumerate(OUT):
    tap(ow('data', 'roles', -0.6) + j * 1.0 / 7, 0.0026, px(BOX[i]), 190)
for i, (who, m) in enumerate((('b', Db3), ('c', F4), ('b', Gb3), ('c', Ab4), ('b', Bb3), ('c', C5), ('b', Eb4))):
    (ca if who == 'c' else bn)(m, ow('data', 'people', -0.5) + i * 0.2, 0.2 if i < 6 else 0.9, 0.55, px(BOX[i]) * 0.4)
tap(ow('plan', 'boxes', -0.3), 0.003, px(960), 170)
pair(Ab2, C5, ow('plan', 'Know', -0.2), 1.8, 0.5)
pair(Db2, F4, oc('breath', 0.3), 4.4, 0.7, until=END)

# 2. A chart and a list: the university, a year from now: D flat, the bassoon and then the cor anglais; Helena's sheet; the two
#    sheets on her desk; the bar drawn and seven taps as the boxes come; the count, and its lines drawn; the plan she could make by
#    lunch: a quick rise in B flat minor, too easy; the list sorted: one shuffle; the lines up lit; the boxes lit one after another,
#    seven taps, all alike; the standard's sheet, and its two lines; and as she sits down with each of them, two notes that ask
LV[0] = 0.9
aw = lambda lid, word, off=0: W('chart', lid, word, off)
ac = lambda lid, off=0: G('chart', lid, off)
line((('b', Db3, 0.00, 1.80), ('c', Ab4, 0.50, 1.30)), S0('chart') + 0.3, 0.6)
card(ac('mon', 0.4), 0.0035, px(1400))
deskT = aw('helena', 'Two', -0.4)
card(deskT + 0.3, 0.0035, px(960)); card(deskT + 0.62, 0.0032, px(1490))
slide(aw('two', 'seven', -0.3), 1.1, 0.003, px(960))
for j, i in enumerate(OUT):
    tap(aw('two', 'seven', -0.3) + j * 1.1 / 7, 0.0026, px(BOX[i]), 190)
tap(aw('two', 'forty-six', -0.3), 0.003, px(1240))
pencil(aw('two', 'forty-six', -0.1), 1.4, 0.003, px(1690))
slide(aw('tempt', 'plan', -0.3), 1.2, 0.003, px(1100))
line((('b', Bb2, 0.00, 0.16), ('b', Db3, 0.17, 0.16), ('b', F3, 0.34, 0.16), ('c', Bb4, 0.51, 0.70)), aw('tempt', 'plan', -0.2), 0.55)
tap(aw('tempt', 'lunch', -0.3), 0.003, px(470))
sheets(aw('sort', 'sort', -0.2), 1.8, 0.0032, px(1620))
tap(aw('sort', 'sort', 1.0), 0.003, px(900))
tap(aw('sort', 'Every', -0.2), 0.0028, px(900))
tap(aw('sort', 'changes', 0.0), 0.003, px(470))
slide(aw('boxes', 'reports', -0.3), 0.9, 0.003, px(960))
for i in range(7):
    tap(aw('boxes', 'boxes', -0.3) + i * 0.22, 0.0026, px(BOX[i]), 190)
card(aw('iso', 'standard', -0.3), 0.0035, px(1420))
tap(aw('iso', 'value', -0.2), 0.0028, px(1420))
tap(aw('iso', 'differences', -0.3), 0.0028, px(1420))
card(aw('before', 'sits', -0.3), 0.0035, px(1420))
line((('c', F4, 0.00, 0.40), ('c', Ab4, 0.46, 1.00)), aw('before', 'sits', 0.0), 0.5, until=E('chart'))

# 3. Four questions, seven people: the week's dots; the four questions: the two notes that ask, answered low; nothing under what she
#    never asks. Then each of the seven, one at a time: the figure of their name, in the pause as they come in (AHEAD seconds before
#    their line, as in the picture), and their sheet. None of it is on the chart: nothing plays; the chart never has a note, only taps
LV[0] = 0.9
sw = lambda lid, word, off=0: W('seven', lid, word, off)
sc_ = lambda lid, off=0: G('seven', lid, off)
AHEAD = 1.55
for i in range(2):
    tap(sw('hour', 'Monday', -0.1) + i * 0.25, 0.0026, px(1160))
for i in range(5):
    tap(sw('hour', 'Thursday', -0.6) + i * 0.24, 0.0026, px(1270 + i * 80))
card(sc_('four', 0.1), 0.0035, px(1420))
line((('c', F4, 0.00, 0.36), ('c', Ab4, 0.42, 0.60), ('b', Db3, 1.00, 1.20)), sc_('four', 0.3), 0.5)
for lid, word, off in (('q12', 'proud', -0.4), ('q12', 'more', -0.5), ('q34', 'way', -0.5), ('q34', 'know', -0.5)):
    pencil(sw(lid, word, off), 0.3, 0.0032, px(1300))
tap(sw('never', 'never', -0.2), 0.003, px(1420))
for i, who in enumerate(('noor', 'sam', 'jun', 'yusuf', 'marta', 'erin', 'tomas')):
    at = sc_(who, -AHEAD); side = px(1400 if i % 2 == 0 else 560)
    line(NAME[who], at + 0.1, 0.6, pan=px(540 if i % 2 == 0 else 1380) * 0.4)
    card(at + (0.6 if i else 1.0), 0.0035, side)

# 4. Who they turn to: one name, again and again: Jun's note, four times; Marta's first name, then Jun's note; Erin's; Noor's; Sam's:
#    each with its pencil line. On the chart: his box, a tap; its one line up; every line up; and the lines the chart doesn't have,
#    in pencil. Ubuntu: two voices, a tenth apart; anyone can lead: a rise passed from one voice to the other; and Jun's own figure,
#    with a second voice learning it beside him, a step behind
LV[0] = 0.9
tw = lambda lid, word, off=0: W('turn', lid, word, off)
tc = lambda lid, off=0: G('turn', lid, off)
X5 = (280, 620, 960, 1300, 1640)
hT = tw('hears', 'one name', -0.2)
for n, slot in enumerate((1, 3, 0, 4)):
    ca(Ab4, hT + n * 0.45, 0.24 if n < 3 else 0.7, 0.5, px(X5[slot]) * 0.4)
aM, aE, aN, aS = tw('ask', 'asks', -0.1), tw('ask', 'So does', 0.1), tw('show', 'shows', -0.1), tw('show', 'load', -0.3)
line((('b', Gb3, 0.00, 0.30), ('b', F3, 0.34, 0.18), ('c', Ab4, 0.62, 0.70)), aM - 0.1, 0.55); pencil(aM, 0.9, 0.0034, px(790))
line((('b', Bb3, 0.00, 0.30), ('b', Ab3, 0.34, 0.18), ('c', Ab4, 0.62, 0.70)), aE - 0.1, 0.55); pencil(aE, 0.9, 0.0034, px(1130))
line((('c', F4, 0.00, 0.40), ('c', Ab4, 0.50, 0.80)), aN - 0.1, 0.55); pencil(aN, 0.9, 0.0034, px(620))
line((('c', C5, 0.00, 0.40), ('c', Ab4, 0.50, 0.80)), aS - 0.1, 0.55); pencil(aS, 0.9, 0.0034, px(1300))
tap(tw('box', 'one box', -0.3), 0.003, px(960), 190)
slide(tw('box', 'line', -0.3), 0.7, 0.003, px(960))
slide(tw('shows', 'manages', -0.4), 0.9, 0.003, px(960))
pencil(tw('shows', 'turn', -0.5), 1.5, 0.0034, px(960), 4)
card(tw('ubuntu', 'Ubuntu', -0.1), 0.0035, px(960))
pair(Db3, F4, tw('ubuntu', 'person', -0.2), 2.6, 0.55)
card(tw('shared', 'shared', -0.3), 0.0035, px(650))
card(tw('review', 'forty-two', -0.4), 0.0035, px(1430))
tap(tw('title', 'Anyone', -0.3), 0.003, px(960))
line((('b', Db3, 0.00, 0.30), ('b', Ab3, 0.36, 0.30), ('c', F4, 0.72, 1.20)), tw('title', 'Anyone', -0.1), 0.55)
line(NAME['jun'], tw('room', 'makes room', -0.2), 0.55)
tap(tw('room', 'March', -0.3), 0.003, px(1130))
line((('b', Ab3, 0.00, 0.52), ('b', Db4, 0.62, 1.30)), tw('room', 'newcomer', -0.4), 0.55, until=E('turn'))

# 5. What won't change yet: all seven in the room, and the day's sheet; a change people can't see: B flat minor; what she can
#    promise: G flat; its two lines, a tap each. The gorge again: one note, alone, and then the pair it went back to. Her week's
#    sheet, and Friday's tick; and in the pause, the seven first names as one phrase, each name lifting on screen as it is played
LV[0] = 0.9
fw = lambda lid, word, off=0: W('friday', lid, word, off)
fc = lambda lid, off=0: G('friday', lid, off)
card(max(fc('fri', 0.3), S0('friday') + 2.5), 0.0035, px(960))
card(fw('fear', 'change', -0.4), 0.0035, px(960))
pair(Bb2, Db4, fw('fear', 'change', 0.0), 2.2, 0.5)
card(fw('stays', 'promise', -0.4), 0.0035, px(960))
pair(Gb2, Bb4, fw('stays', 'stays', -0.2), 2.0, 0.5)
tap(fw('notall', 'nothing', -0.3), 0.0028, px(960)); tap(fw('notall', 'only', -0.3), 0.0028, px(960))
tap(fw('keeper', 'steel', -0.3), 0.003, px(952))
ca(Ab4, fc('keeper', 0.5), 1.2, 0.45)
tap(fw('keeper', 'keeper', -0.3), 0.003, px(960))
pair(Db3, Ab4, fw('keeper', 'keeper', 0.2), 2.0, 0.5)
card(fc('week', 0.0), 0.0035, px(960))
ticked(fw('week', 'first', -0.2), 0.004, px(1220))
tap(fw('knows', 'planned', -0.3), 0.003, px(960)); tap(fw('knows', 'seven', -0.3), 0.003, px(960))
names(fc('breath', -0.5), 0.6, close=1.1, until=E('friday'))

# 6. On Monday: the gorge today: the truck on the steel, and what they went back for: a third, close; the two sheets, and the
#    question: two notes that rise and wait; each piece of advice written; the next film's tag; and at the close, the seven first
#    names again as the row lifts, name by name, the two voices ending together and held into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
truck(S0('monday') + 0.4, 4.8, 0.003, px(940))
tap(S0('monday') + 0.9, 0.003, px(948))
tap(mw('back', 'each other', -0.3), 0.003, px(960))
pair(Db4, F4, mw('back', 'each other', -0.1), 2.4, 0.55)
tap(mw('same', 'who', -0.3), 0.003, px(620))
line((('c', Ab4, 0.00, 0.40), ('c', C5, 0.46, 1.10)), mw('same', 'who', -0.1), 0.5)
card(mc('m1', 0.2), 0.0035, px(960))
for lid, word, off in (('m1', 'sit', -0.3), ('m2', 'Ask', -0.2), ('m3', 'Notice', -0.2), ('m4', 'say', -0.3)):
    pencil(mw(lid, word, off), 0.3, 0.0032, px(700))
tap(mw('next', 'Wellbeing', -0.2), 0.003, px(960))
tap(mc('take', 0.0), 0.003, px(960))
names(mc('take', 0.3), 0.62, close=5.0, until=TOT)
