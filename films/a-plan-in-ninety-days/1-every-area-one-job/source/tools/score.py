# Every area, one job: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, its first row, reserved 5 November 2026 by the module's setup
# thread; the partner chosen 10 November 2026 by this film's thread, after searching every score.py, music.py and palettes file on main
# and on every branch for "Ondioline": none but this module's reservations): an Ondioline, made here, as music.py has none.
#  - The Ondioline: the small electronic keyboard Georges Jenny built in France from 1941. One valve oscillator, one voice, and a row of
#    switches above the keys that shape that voice into the colour of many instruments. One player, every part: the film's idea. Here
#    it has three colours, each made in code from the same partials: reedy (its own nasal edge: odd partials, a bump near 1.25 kHz),
#    hollow (a narrow band, like a stopped pipe) and bright (a soft brass edge, its upper partials let in a little after the note
#    starts). Played plain: each note held at one level, no vibrato (the real keyboard shakes sideways for one: never here), no slide.
#  - Its partner, the thread's choice: the Ondioline's own low register with its percussion switch on: each note struck and gone, its
#    upper partials first, damped after a third of a second, so the bass never rings (E 2 to D 3). One instrument for every part.
#    Nothing Chilean and no mine's sounds: no drill, no rock, no siren, no bell; the rescue is told in the instrument's own colours.
# The mark: one line passed through three colours in turn, without a break (G, B, D, E, D, high G; reedy, then hollow, then bright,
# each note joined to the next). It is played slowly at "Each part has someone who knows it", one colour for each part as its sheet
# comes in; whole at the title; whole again when the wheel becomes one system, and when Helena's ninety days "work the same way"; and
# at the close an octave lower, held. Where every part runs at once, the three colours sound together: a G major chord, one note in
# each colour, reedy on the left, hollow in the middle, bright on the right.
# G major, E minor for the opening's problem, C major where a chapter turns, D major for the plan. Every chord is tuned pure from G
# (just intonation, see hz()): G, C and D major and E and B minor are pure in this table; A with E is not, and they never sound together.
# No chapter is urgent: nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: each held note at one level from its start to its stop, its colour moving but not its level (each colour at the
#    same power); each damped before the next chapter.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/ea_scenes.js, and
#    panned to where it is drawn on screen. Everything low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

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
    """where something drawn at x (in the 1920 px frame, as the camera shows it) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
def cam(x, cx, z):
    """where a thing drawn at x in a place shows on screen, with the camera at cx and zoom z"""
    return (x - cx) * z + 960
R1 = np.random.default_rng(2010)  # this film's own randomness: the room, the paper



# a small room round the instrument, ringing on for about a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
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


# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here: paper, card and pen, nothing from a mine
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.004, pan=0.0):
    """a sheet laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0035, pan=0.0):
    """a tag or a pill set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """a line drawn out, or a sheet slid along: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.005, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. G, C and D major and
# E and B minor are pure in this table; A with E is not, and they never sound together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 43, 12)
    return 98.0 * 2 ** o * _JI[pc]
E2, G2, A2, B2, C3, D3 = 40, 43, 45, 47, 48, 50
E3, Fs3, G3, A3, B3, C4, D4, E4, Fs4, G4, A4, B4, C5, D5, E5, Fs5, G5 = 52, 54, 55, 57, 59, 60, 62, 64, 66, 67, 69, 71, 72, 74, 76, 78, 79

LO, LPC, FX = 0.088, 0.135, 3.6
LV = [1.0]

# ---- the Ondioline: one voice, three colours
REEDY, HOLLOW, BRIGHT = (1.0, 0.0, 0.0), (0.0, 1.0, 0.0), (0.0, 0.0, 1.0)
PAN = {REEDY: -0.22, HOLLOW: 0.0, BRIGHT: 0.22}
def _spec(f0, col):
    """the partials of a note at f0 in a colour (how much of it is reedy, hollow and bright), each colour at the same power, every
    partial gone before 2.35 kHz"""
    k = np.arange(1, 64, dtype=np.float64); fk = f0 * k
    top = np.clip((2350 - fk) / 450, 0, 1) ** 1.5
    reedy = np.where(k % 2 == 1, 1.0, 0.16) / k ** 0.85 * (1 + 0.8 * np.exp(-((fk - 1250) / 320) ** 2))
    hollow = 0.6 * (k == 1) + np.exp(-((fk - max(600.0, 1.55 * f0)) / 160) ** 2)
    bright = 1 / k ** 0.7 * (1 + 0.5 * np.exp(-((fk - 1500) / 420) ** 2))
    out = np.zeros(len(k))
    for v, wgt in zip((reedy, hollow, bright), col):
        if wgt > 0:
            v = v * top; out += wgt * v / np.sqrt((v ** 2).sum())
    return out / np.sqrt((out ** 2).sum())

def ondi(m, s, dur, g=1.0, col=REEDY, col1=None, pan=None, room=0.2, until=None, att=0.04, rel=0.08):
    """one note of the Ondioline, held at one level for dur seconds, its colour moving from col to col1 as it's held (the power stays
    the same), then let go over rel; a bright colour lets its upper partials in a little after the note starts, as brass does"""
    f0 = hz(m); d = dur
    if until is not None:
        d = min(d, max(0.15, until - s - 0.45))
    c1 = col if col1 is None else col1
    sec = d + 0.45; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    S0, S1 = _spec(f0, col), _spec(f0, c1)
    u = np.clip(x / max(d, 1e-3), 0, 1)
    a_, b_, c_ = (S0 ** 2).sum(), (S0 * S1).sum(), (S1 ** 2).sum()
    nrm = np.sqrt((1 - u) ** 2 * a_ + 2 * u * (1 - u) * b_ + u ** 2 * c_)
    br = 0.5 * (col[2] + c1[2]); sig = np.zeros(n)
    for k in np.nonzero((S0 > 1e-4) | (S1 > 1e-4))[0]:
        ak = att + br * 0.006 * k
        sig += ((1 - u) * S0[k] + u * S1[k]) * np.minimum(1, x / ak) * np.sin(2 * np.pi * f0 * (k + 1) * x + 0.9 * k)
    sig = sig / nrm * np.where(x < d, 1.0, np.exp(-(x - d) / rel))
    sig[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    sig = filt(filt(sig.astype(np.float32), 'low', 2400), 'high', 70)
    i, j = int(min(0.1, d * 0.3) * SR), max(int(min(0.1, d * 0.3) * SR) + 16, int(min(d, 1.2) * SR))
    sig = sig * np.float32(0.3 / max(1e-9, float(np.sqrt((sig[i:j] ** 2).mean()))))
    sig = _until(_room(sig, room, 0.0, min(1.2, d)), s, until)
    put(sig, s, g * LV[0] * LO, PAN.get(tuple(col), 0.0) if pan is None else pan)

def perc(m, s, g=1.0, ring=0.32, pan=-0.12, room=0.15, until=None):
    """the partner: the Ondioline's low register with its percussion switch on: struck at once, its upper partials gone first, damped
    after ring seconds, so the bass never rings"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.1, until - s - 0.2))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    S = _spec(f0, REEDY); sig = np.zeros(n)
    for k in np.nonzero(S > 1e-4)[0]:
        sig += S[k] * np.exp(-x / (0.45 / (k + 1) ** 0.7)) * np.sin(2 * np.pi * f0 * (k + 1) * x + 0.9 * k)
    sig *= np.minimum(1, x / 0.004) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.035))
    sig = filt(filt(sig.astype(np.float32), 'low', 1500), 'high', 45)
    sig = _until(_room(norm(sig), room, 0.0, min(0.5, d)), s, until)
    put(sig, s, g * LV[0] * LPC, pan)

def voice(notes, times, last=1.4, cols=None, g=1.0, room=0.2, until=None, pan=None):
    """one voice: each note joined to the next without a break (held until the next begins, with 30 ms of overlap), the last held for
    last seconds; cols are the colours at each note's start and at the last one's end, so a line can pass from colour to colour"""
    cols = cols or [REEDY] * (len(notes) + 1)
    for i, (m, t) in enumerate(zip(notes, times)):
        end = i == len(notes) - 1
        d = last if end else times[i + 1] - t + 0.03
        ondi(m, t, d, g, cols[i], cols[i + 1], PAN.get(tuple(cols[i]), 0.0) if pan is None else pan, room, until,
             att=0.04 if i == 0 else 0.02, rel=0.09 if end else 0.025)
def three(notes, s, dur, g=1.0, until=None):
    """every part at once: three notes held together, one in each colour, reedy on the left, hollow in the middle, bright on the right"""
    for m, c in zip(notes, (REEDY, HOLLOW, BRIGHT)):
        ondi(m, s, dur, g, c, until=until)
MARK = (G4, B4, D5, E5, D5, G5)
MARKC = (REEDY, REEDY, HOLLOW, HOLLOW, BRIGHT, BRIGHT, BRIGHT)
def mark(s, g=1.0, shift=0, step=0.3, last=1.6, bass=(), until=None):
    """the mark: one line through three colours in turn, without a break; the partner's low notes under it at the notes given"""
    voice([m + shift for m in MARK], [s + step * i for i in range(len(MARK))], last, MARKC, g, until=until, pan=0.0)
    for m, i, r in bass:
        perc(m, s + step * i, 0.9 * g, r, until=until)

# =============================================================================================================================
# 1. Every part, at once: the opening. The Atacama, 2010: the partner's low G alone, then the hollow colour's first line as the place is
#    named. The ramp drawn, one slide; the miners' lamps: G, B, D struck low. The rock gives way: E minor, the reedy colour falling.
#    Trapped, 700 m down: the hollow colour going down. The families at the gate: a sigh in E minor. Without help: the reedy B, low.
#    "They have to be found": C major, rising, bright. Any one plan could fail: the low E, struck. The engineer in charge: G major,
#    bright. Each part has someone who knows it: the mark, slowly, one colour for each part as its sheet comes in. The foreman: two
#    colours together. The men's jobs: one note each, a colour each. Day 17, the note: G major, bright, rising. The doves: C major,
#    hollow. Three drills at once: G, B, D struck as their names come. Plan B breaks through: D major. All 33 come up: G major,
#    climbing with the count. Home: the hollow colour, falling home. Every part ran at once: the three colours together. A data
#    manager's work: C major, the turn. The plan: D major. The title: the mark, whole, then the three colours together, held
LV[0] = 0.9
ow = lambda lid, word, off=0: W('rescue', lid, word, off)
oc = lambda lid, off=0: G('rescue', lid, off)
END = E('rescue')
perc(G2, 0.6, 0.8, 0.34, 0.0)
voice((D4, G4), (ow('when', 'Chile', 0.0), ow('when', 'Chile', 0.45)), 2.4, [HOLLOW] * 3, 0.75)
card(ow('when', 'Chile', -0.2), 0.004, px(440))
slide(oc('mine', 0.3), 3.2, 0.003, px(1060))
tap(ow('mine', 'San', -0.2), 0.0035, px(1500))
tap(ow('mine', 'Thirty', -0.1), 0.003, px(1455))
for i, m in enumerate((G2, B2, D3)):
    perc(m, ow('mine', 'deep', -0.2) + 0.2 * i, 0.7, 0.3)
ondi(B3, ow('mine', 'deep', 0.3), 1.6, 0.6, HOLLOW)
voice((B3, G3, E3), [ow('fall', 'gives', -0.1) + 0.36 * i for i in range(3)], 2.0, [REEDY] * 4, 0.75)
perc(E2, ow('fall', 'gives', -0.1) + 0.72, 0.8, 0.34)
tap(ow('fall', 'seven', -0.1), 0.003, px(cam(1110, 1080, 1.3)))
tap(ow('fall', 'road', -0.2), 0.003, px(cam(1110, 1080, 1.3)))
voice((E4, D4, B3), [ow('trapped', 'down', -0.2) + 0.4 * i for i in range(3)], 1.8, [HOLLOW] * 4, 0.6)
tap(ow('trapped', 'seven', -0.1), 0.003, px(cam(1455, 1300, 1.6)))
tap(ow('trapped', 'shelter', -0.1), 0.003, px(cam(1300, 1300, 1.6)))
card(ow('unknown', 'nobody', -0.1), 0.004, px(960))
perc(E2, ow('unknown', 'families', -0.3), 0.7, 0.34)
voice((G4, Fs4, E4), [ow('unknown', 'families', -0.3) + 0.42 * i for i in range(3)], 1.6, [HOLLOW] * 4, 0.55)
card(oc('starve', 0.1), 0.004, px(960))
ondi(B3, ow('starve', 'starve', -0.1), 1.6, 0.55, REEDY)
card(oc('must', 0.1), 0.004, px(960))
perc(C3, ow('must', 'found', -0.1), 0.7, 0.32)
voice((E4, G4), (ow('must', 'found', -0.1), ow('must', 'found', 0.32)), 1.6, [BRIGHT] * 3, 0.55)
for wd, x in (('drilling', 250), ('medicine', 560), ('food', 820), ('engineering', 1080), ('trust', 1420)):
    tap(ow('hard', wd, -0.15), 0.003, px(x))
tap(ow('hard', 'fail', -0.4), 0.0035, px(700))
perc(E2, ow('hard', 'fail', -0.4), 0.7, 0.3)
ondi(B3, ow('hard', 'fail', -0.1), 1.0, 0.5, REEDY)
card(ow('lead', 'engineer', -0.3), 0.004, px(1230))
perc(G2, ow('lead', 'charge', -0.2), 0.7, 0.32)
voice((B3, D4), (ow('lead', 'charge', -0.2), ow('lead', 'charge', 0.2)), 1.4, [BRIGHT] * 3, 0.55)
# the mark, slowly: a colour for each part as its sheet comes in, each held until the next begins
tE, tD, tM = ow('parts', 'engineers', -0.2), ow('parts', 'doctors', -0.2), ow('parts', 'ministers', -0.2)
voice(MARK, (tE, tE + 0.32, tD, tD + 0.32, tM, tM + 0.32), 1.8, (REEDY, REEDY, HOLLOW, HOLLOW, BRIGHT, BRIGHT, BRIGHT), 0.6, pan=0.0)
for m, t in ((G2, tE), (C3, tD + 0.32), (D3, tM), (G2, tM + 0.32)):
    perc(m, t, 0.6, 0.3)
for t, x in ((tE, 960), (tD, 1315), (tM, 1670)):
    card(t, 0.0035, px(x))
tap(ow('camp', 'Esperanza', -0.1), 0.003, px(1500))
card(ow('urzua', 'Luis', -0.3), 0.004, px(1530))
perc(G2, ow('urzua', 'together', -0.3), 0.6, 0.32)
ondi(B3, ow('urzua', 'together', -0.3), 1.6, 0.5, REEDY)
ondi(D4, ow('urzua', 'together', -0.3), 1.6, 0.5, HOLLOW)
card(ow('ration', 'Food', -0.1), 0.004, px(420))
tap(ow('jobs', 'vote', -0.3), 0.0035, px(960))
tS, tP, tY = ow('jobs', 'sick', -0.3), ow('jobs', 'prayers', -0.3), ow('jobs', 'diary', -0.3)
voice((B3, D4, G4), (tS, tP, tY), 1.4, (REEDY, REEDY, HOLLOW, BRIGHT), 0.5, pan=0.0)
for t, x in ((tS, 380), (tP, 720), (tY, 1060)):
    tap(t, 0.003, px(x))
card(ow('note', 'We', -0.3), 0.004, px(cam(810, 1150, 1.25)))
perc(G2, ow('note', 'We', -0.3), 0.7, 0.32)
voice((D4, G4, B4), [ow('note', 'We', -0.3) + 0.34 * i for i in range(3)], 2.2, [BRIGHT] * 4, 0.6)
tD0 = oc('doves', 1.9)
seen = set()
for wd, y in (('food', 380), ('water', 460), ('medicine', 540), ('letters', 620)):
    t = round(max(ow('doves', wd, -0.2), tD0), 2)
    if t not in seen:
        tap(t, 0.003, px(cam(1500, 1320, 1.6))); seen.add(t)
tap(max(ow('doves', 'palomas', -0.2), tD0), 0.003, px(cam(1030, 1320, 1.6)))
perc(C3, ow('doves', 'palomas', -0.2), 0.6, 0.3)
voice((E4, G4), (ow('doves', 'palomas', -0.2), ow('doves', 'palomas', 0.25)), 1.4, [HOLLOW] * 3, 0.5)
for i, (m, x) in enumerate(((G2, 760), (B2, 1000), (D3, 1240))):
    tap(oc('drills', 1.6 + 0.25 * i), 0.003, px(x))
    perc(m, oc('drills', 1.6 + 0.25 * i), 0.65, 0.3, px(x) * 0.4)
ondi(D4, oc('drills', 2.2), 1.8, 0.5, REEDY)
tap(ow('drills', 'never', -0.3), 0.0035, px(700))
tb = ow('through', 'breaks', -0.2)
tap(tb + 0.2, 0.0035, px(700))
perc(D3, tb, 0.7, 0.32)
voice((Fs4, A4, D5), [tb + 0.32 * i for i in range(3)], 1.8, [BRIGHT] * 4, 0.55)
card(ow('up', 'after', -0.3), 0.004, px(400))
tU = ow('up', 'all', -0.2)
perc(G2, tU, 0.7, 0.32)
voice((G4, B4, D5, G5), [tU + 0.75 * i for i in range(4)], 2.0, [BRIGHT] * 5, 0.5)
tap(ow('home', 'back', -0.4), 0.0035, px(960))
perc(G2, ow('home', 'back', -0.4), 0.6, 0.32)
voice((B4, G4), (ow('home', 'back', -0.4), ow('home', 'back', 0.0)), 1.6, [HOLLOW] * 3, 0.5)
card(ow('lesson', 'No', -0.2), 0.004, px(390))
for i, x in enumerate((880, 1560, 1640, 1480)):
    tap(ow('lesson', 'Each', -0.2) + 0.3 * i, 0.0025, px(x))
perc(G2, ow('lesson', 'every', -0.1), 0.7, 0.34)
three((G3, B3, D4), ow('lesson', 'every', -0.1), 2.6, 0.55)
card(ow('data', 'data', -0.2), 0.004, px(960))
perc(C3, ow('data', 'calmer', -0.1), 0.6, 0.32)
voice((C4, E4), (ow('data', 'calmer', -0.1), ow('data', 'calmer', 0.3)), 1.4, [HOLLOW] * 3, 0.5)
card(ow('helena', 'forty', -0.3), 0.004, px(1070))
card(oc('plan', 0.1), 0.004, px(960))
slide(oc('plan', 0.4), 0.7, 0.003, px(960))
perc(D3, ow('plan', 'three', -0.2), 0.6, 0.32)
voice((Fs4, A4), (ow('plan', 'three', -0.2), ow('plan', 'three', 0.2)), 1.6, [HOLLOW] * 3, 0.5)
tap(ow('hear', 'hears', -0.3), 0.0035, px(960))
# the title: the mark, whole, then every colour at once, held into the next chapter's start
mark(oc('breath', 0.3), 0.65, 0, 0.32, 3.4, bass=((G2, 0, 0.34), (C3, 3, 0.3), (D3, 4, 0.3), (G2, 5, 0.34)), until=END)
three((G3, B3, D4), oc('breath', 0.3 + 0.32 * 5), 3.2, 0.5, until=END)

# 2. Her first day: the chapter turns on C major; the promise's sheet; her first day's sheet, then hers; Helena: G major, reedy; the
#    tracker; the oldest request: the low E, struck, and the reedy G; the three rows, a tap each; the team's inboxes; the three
#    temptations, a tap each; "First, she sorts them": G major, hollow, rising
LV[0] = 0.9
fw = lambda lid, word, off=0: W('first', lid, word, off)
fc = lambda lid, off=0: G('first', lid, off)
perc(C3, S0('first') + 0.2, 0.6, 0.32)
voice((E4, G4), (S0('first') + 0.2, S0('first') + 0.55), 1.5, [HOLLOW] * 3, 0.5)
card(S0('first') + 0.8, 0.004, px(960))
card(fc('day', 0.1), 0.004, px(1260))
card(fc('starts', 0.9), 0.004, px(1260))
perc(G2, fw('starts', 'Helena', 0.0), 0.55, 0.3)
voice((B3, D4), (fw('starts', 'Helena', 0.0), fw('starts', 'Helena', 0.36)), 1.3, [REEDY] * 3, 0.5)
card(fw('open', 'tracker', -0.3), 0.004, px(1320))
tap(fw('open', 'inboxes', -0.2), 0.003, px(1320))
tap(fw('oldest', 'waited', -0.2), 0.0035, px(1320))
perc(E2, fw('oldest', 'waited', -0.2), 0.6, 0.3)
ondi(G3, fw('oldest', 'waited', -0.2), 1.3, 0.5, REEDY)
for wd in ('report', 'staff', 'researcher'):
    tap(fw('each', wd, -0.2), 0.003, px(1320))
for wd, x in (('oldest', 1000), ('loudest', 1330), ('everything', 1640)):
    tap(fw('tempt', wd, -0.2), 0.003, px(x))
tap(fw('sort', 'sorts', -0.3), 0.0035, px(1320))
perc(G2, fw('sort', 'sorts', -0.3), 0.6, 0.32)
voice((D4, G4, B4), [fw('sort', 'sorts', -0.3) + 0.34 * i for i in range(3)], 1.5, [HOLLOW] * 4, 0.5, until=E('first'))

# 3. One wheel: the chapter turns on C major, bright; the wheel's sheet, and its ring and spokes drawn, one slide; data governance at its
#    centre, a tap; the ten areas named, one soft slide; Warehousing's dots, one slide; each count, a tap; "forty-four in all": G
#    major, hollow, settling; the two beside it; a new report touches three areas: three notes in turn, reedy, hollow, bright; one
#    system: the mark, whole; the films' titles come in, one slide
LV[0] = 0.9
ww = lambda lid, word, off=0: W('wheel', lid, word, off)
wc = lambda lid, off=0: G('wheel', lid, off)
perc(C3, S0('wheel') + 0.2, 0.6, 0.32)
voice((G4, C5), (S0('wheel') + 0.2, S0('wheel') + 0.55), 1.5, [BRIGHT] * 3, 0.45)
card(S0('wheel') + 0.4, 0.004, px(960))
slide(S0('wheel') + 0.9, 2.4, 0.003, px(860))
tap(ww('centre', 'governance', -0.1), 0.0035, px(860))
slide(ww('centre', 'ten', -0.1), 2.8, 0.0025, px(860))
slide(ww('place', 'puts', -0.1), 2.2, 0.0025, px(611))
for wd, x in (('ten', 611), ('seven', 706), ('five', 1109)):
    tap(ww('counts', wd, -0.1), 0.003, px(x))
tap(ww('rest', 'fewer', -0.1), 0.003, px(860))
tap(ww('rest', 'forty', -0.2), 0.0035, px(1470))
perc(G2, ww('rest', 'forty', -0.2), 0.55, 0.3)
voice((G4, D4), (ww('rest', 'forty', -0.2), ww('rest', 'forty', 0.2)), 1.3, [HOLLOW] * 3, 0.45)
card(ww('beside', 'Two', -0.2), 0.004, px(1600))
tap(ww('touch', 'report', -0.2), 0.0035, px(1470))
voice((D4, E4, G4), (ww('touch', 'modelled', -0.2), ww('touch', 'quality', -0.2), ww('touch', 'safe', -0.2)), 1.3,
      (REEDY, REEDY, HOLLOW, BRIGHT), 0.45, pan=0.0)
tap(ww('one', 'system', -0.2), 0.0035, px(1470))
mark(ww('one', 'system', -0.4), 0.55, 0, 0.3, 1.8, bass=((G2, 0, 0.32), (G2, 5, 0.34)))
slide(ww('titles', 'From', -0.6), 1.2, 0.0025, px(860))

# 4. Who is deep in each: the chapter turns on E minor, low; "11 areas", a sheet; every manager's work, a sheet; she finds who is deep in
#    each: G major, reedy, low, rising; each person's sheet as they're named; where no one is deep, three areas written down, a pen's
#    stroke for each; her part: G major, hollow; Many hats, one picture, a tag
LV[0] = 0.9
dw = lambda lid, word, off=0: W('deep', lid, word, off)
dc = lambda lid, off=0: G('deep', lid, off)
perc(E2, S0('deep') + 0.2, 0.6, 0.32)
voice((B3, G3), (S0('deep') + 0.2, S0('deep') + 0.6), 1.5, [HOLLOW] * 3, 0.5)
card(dw('nobody', 'eleven', -0.4), 0.004, px(1150))
card(dc('manager', 0.1), 0.004, px(1190))
perc(G2, dw('find', 'finds', -0.2), 0.55, 0.3)
voice((G3, B3, D4), [dw('find', 'finds', -0.2) + 0.34 * i for i in range(3)], 1.4, [REEDY] * 4, 0.5)
for lid, wd, x in (('noor', 'Noor', 300), ('noor', 'Sam', 700), ('jun', 'Jun', 1110), ('jun', 'Yusuf', 1520)):
    card(dw(lid, wd, -0.2), 0.0035, px(x))
card(dc('gap', 0.1), 0.004, px(960))
pen(dw('gap', 'writes', -0.2), 1.4, 0.005, px(960), 3)
card(dc('part', 0.2), 0.004, px(1220))
perc(G2, dc('part', 0.2), 0.55, 0.3)
voice((D4, B4), (dc('part', 0.2), dc('part', 0.6)), 1.6, [HOLLOW] * 3, 0.5)
tap(dw('skill', 'Many', -0.2), 0.0035, px(1220))

# 5. Ninety days, three lanes: the chapter turns on D major, the plan's key; Watkins's sheet; the plan laid down and its grid drawn;
#    people, all twelve weeks, one slide; strategy's three steps: three notes in turn, reedy, hollow, bright, in D major; its three
#    dates, a tap each; operations: the urgent problems, the sprints drawn, better ways, their test; "don't change everything on day
#    one": C major, hollow; "and don't wait ninety days to help": G major, bright; back at the mine: G major, reedy, falling
LV[0] = 0.9
lw = lambda lid, word, off=0: W('lanes', lid, word, off)
lc = lambda lid, off=0: G('lanes', lid, off)
perc(D3, S0('lanes') + 0.2, 0.6, 0.32)
voice((A4, Fs4), (S0('lanes') + 0.2, S0('lanes') + 0.6), 1.4, [HOLLOW] * 3, 0.45)
card(lw('watkins', 'borrows', -0.3), 0.004, px(960))
card(lc('lanes', 0.1), 0.004, px(960))
slide(lc('lanes', 0.4), 0.6, 0.003, px(960))
slide(lw('people', 'twelve', -0.2), 0.9, 0.0025, px(1105))
perc(D3, lw('strategy', 'discover', -0.2), 0.55, 0.3)
voice((D4, Fs4, A4), (lw('strategy', 'discover', -0.2), lw('strategy', 'define', -0.2), lw('strategy', 'plan', -0.2)), 1.4,
      (REEDY, REEDY, HOLLOW, BRIGHT), 0.45, pan=0.0)
for wd, x in (('fifteenth', 1105), ('fifth', 1397), ('twenty', 1690)):
    tap(lw('dates', wd, -0.2), 0.003, px(x))
tap(lw('weeks', 'urgent', -0.3), 0.003, px(617))
slide(lw('weeks', 'delivery', -0.3), 1.0, 0.0025, px(1105))
tap(lw('improve', 'propose', -0.3), 0.003, px(1250))
tap(lw('improve', 'tests', -0.3), 0.003, px(1540))
tap(lw('rule', 'change', -0.3), 0.0035, px(620))
tap(lw('rule', 'wait', -0.3), 0.0035, px(1300))
perc(C3, lw('rule', 'change', -0.3), 0.55, 0.3)
voice((E4, D4, G4), (lw('rule', 'change', -0.3), lw('rule', 'wait', -0.3), lw('rule', 'wait', 0.05)), 1.4, (HOLLOW, HOLLOW, BRIGHT, BRIGHT), 0.45, pan=0.0)
perc(G2, lw('rule', 'wait', -0.3), 0.55, 0.3)
tap(lw('desert', 'drills', -0.2), 0.003, px(1000))
tap(lw('desert', 'food', -0.2), 0.003, px(1620))
perc(G2, lw('desert', 'food', -0.2), 0.55, 0.3)
voice((D4, B3, G3), [lw('desert', 'food', -0.2) + 0.4 * i for i in range(3)], 1.6, [REEDY] * 4, 0.5, until=E('lanes'))

# 6. One page, shown: the chapter turns on C major, reedy; the plan; David's name; the one page, then its promise; the tracker: three
#    answers, a tick each; "each has an answer": G major, bright; back at the mine, all 33 came up: the three colours together; "every
#    area is one job": the mark, whole; the two pills; the three pieces of advice and the next film, a sheet each; the close: the mark
#    an octave lower, its last note held with the three colours into the end card
LV[0] = 0.9
yw = lambda lid, word, off=0: W('friday', lid, word, off)
yc = lambda lid, off=0: G('friday', lid, off)
perc(C3, S0('friday') + 0.2, 0.6, 0.32)
voice((E4, G4, C5), [S0('friday') + 0.2 + 0.32 * i for i in range(3)], 1.4, [REEDY] * 4, 0.45)
card(S0('friday') + 0.3, 0.004, px(960))
tap(yw('david', 'David', -0.2), 0.0035, px(1500))
card(yc('david', 0.2), 0.004, px(950))
card(yc('promise', 0.1), 0.004, px(950))
card(yc('heard', 0.0), 0.004, px(960))
for i in range(3):
    ticked(yc('heard', 0.4 + 0.4 * i), 0.004, px(1380))
tap(yw('heard', 'answer', -0.4), 0.0035, px(960))
perc(G2, yw('heard', 'answer', -0.4), 0.6, 0.32)
voice((D4, G4, B4), [yw('heard', 'answer', -0.4) + 0.34 * i for i in range(3)], 1.4, [BRIGHT] * 4, 0.5)
for i, x in enumerate((880, 1560, 1640, 1480)):
    tap(yc('back', 0.4 + 0.25 * i), 0.0025, px(x))
tap(yw('back', 'came', -0.4), 0.0035, px(700))
perc(G2, yw('back', 'came', -0.4), 0.65, 0.34)
three((G3, B3, D4), yw('back', 'came', -0.4), 2.4, 0.5)
tap(yw('same', 'every', -0.3), 0.0035, px(620))
mark(yw('same', 'every', -0.3), 0.55, 0, 0.3, 1.6, bass=((G2, 0, 0.32), (C3, 3, 0.3), (D3, 4, 0.3)))
tap(yw('same', 'waits', -0.4), 0.0035, px(1320))
for t, x in ((yc('running', 0.1), 390), (yc('onepage', 0.1), 960), (yc('words', 0.1), 1530), (yw('next', 'listen', -0.2), 960)):
    card(t, 0.0035, px(x))
card(yc('take', 0.1), 0.0035, px(960))
# the close: the mark an octave lower, slower, its last note held with every colour into the end card
mark(yc('breath', 0.0), 0.55, -12, 0.34, 5.0, bass=((G2, 0, 0.34), (C3, 3, 0.3), (D3, 4, 0.3), (G2, 5, 0.34)), until=TOT)
three((G3, B3, D4), yc('breath', 0.34 * 5), 4.0, 0.45, until=TOT)
