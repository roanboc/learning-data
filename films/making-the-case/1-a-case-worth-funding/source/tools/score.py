# A case worth funding: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, row reserved 10 November 2026, 03:40 UTC, after searching every
# score.py, music.py, sound.py and audio.py on main and on every branch, and every palettes.md in the project's files, for
# "aeolsklavier", "aeolodion", "Schortmann", "wooden reed" and "wood reed": none): an Aeolsklavier, made here, as music.py has none.
#  - The Aeolsklavier: the keyboard Schortmann of Buttelstedt, in Thuringia, made about 1825, the year the Erie Canal opened. Its reeds
#    were thin tongues of wood, not metal, and each note was sounded by its own small bellows, worked from a pedal: softer and sweeter
#    than any metal reed. Its wooden tongue keeps it round and quiet, almost nothing above the third partial, in a hollow wooden body.
#    Played plain, soft and mid-low: each note placed and held at one level from its start to its stop, a small breath of air as it
#    speaks; no bellows swell, no vibrato, no slide.
#  - Its partner: the same instrument's pedal rank, an octave lower (E 2 to B 3), one note at a time, placed and left to settle. It's
#    the lowest note of a chord, when the chord has one that low, and now and then a note alone.
#    Nothing in the score is borrowed from the opening's world: no canal songs, fiddles, boat horns, mule bells or cannon.
# The mark: three short chords side by side, the options (C sharp minor, A major, B major), then the third again, held, coming home to
# E: one clear ask, answered. It is played whole when New York's legislature says yes to the canal; spread across the options chapter,
# one chord as each option is laid down, the third again and home when Helena recommends C; whole when the council says yes; and whole
# at the close, slower, its E held into the end card.
# E major, C sharp minor for the opening's problem. Every chord is tuned pure from E (just intonation, see hz()): E, A and B major and
# C sharp and G sharp minor are pure in this table; F sharp minor is not, and is never played. No chapter is urgent: nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: each note held at one level from its bellows' start to its stop.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/cwf_scenes.js, and
#    panned to where it is drawn. Everything low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1825)  # this film's own randomness: the room, the air, the paper


# a small wooden room round the instrument, ringing on for about a second. Its level is set by what it rings where the notes are (its
# gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
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
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.004, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0035, pan=0.0):
    """a tag or a pill set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.003, pan=0.0):
    """a line drawn out, or a bar growing: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.0045, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def wheels(s, sec=3.0, g=0.004, pan=0.0):
    """wagons on a rough road, far off: one soft, low texture of wheels that swells and fades, not a clatter of single knocks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 7); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (70, 420)) * _bump(x, sec, 1.3) * gr, s, g, pan, 600)
def earth(s, sec=3.0, g=0.0035, pan=0.0):
    """the cutting dug by many hands, heard from along the bank: one soft texture of earth turned and thrown, slow in its grain, never
    a run of single shovel strokes"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 3)); gr = 0.55 + 0.45 * gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (110, 650)) * _bump(x, sec, 1.2) * gr, s, g, pan, 900)

# ---- tuning: just intonation from E, so a chord's notes are whole-number ratios of each other and nothing beats. E, A and B major and
# C sharp and G sharp minor are pure in this table; F sharp minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 40, 12)
    return 82.40689 * 2 ** o * _JI[pc]
Cs2, E2, Fs2, Gs2, A2, B2 = 37, 40, 42, 44, 45, 47
Cs3, Ds3, E3, Fs3, Gs3, A3, B3 = 49, 51, 52, 54, 56, 57, 59
Cs4, Ds4, E4, Fs4, Gs4, A4, B4 = 61, 63, 64, 66, 68, 69, 71
E5 = 76

LR, LPD, FX = 0.0375, 0.0625, 3.8
LV = [1.0]

def reed(m, s, g=1.0, dur=1.6, pan=None, room=0.2, until=None):
    """one note of the manual: its bellows opens, a small breath of air, and the wooden tongue speaks, a little slowly, as a free reed
    does; then a steady, round tone, almost nothing above its third partial, a hollow wooden body under it; held at one level by the
    note's own bellows; stopped as its valve closes, over a tenth of a second"""
    f0 = hz(m); d = dur
    if until is not None:
        d = min(d, max(0.2, until - s - 0.6))
    sec = d + 0.6; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k, a in ((1, 1.0), (2, 0.34), (3, 0.3), (4, 0.06), (5, 0.05), (6, 0.02), (7, 0.018)):
        fk = f0 * k
        if fk > 2300:
            break
        body = 1 + 0.5 * np.exp(-((fk - 480) / 200) ** 2)
        sig += a * body * np.sin(2 * np.pi * fk * x + 0.9 * k)
    env = np.clip(x / 0.085, 0, 1) ** 1.6 * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    sig = sig * env
    air = filt(noise(sec + 0.02)[:n], 'band', (500, 1800)) * np.exp(-x / 0.05) * np.clip(x / 0.012, 0, 1) * 0.05
    sig = sig / max(1e-9, float(np.abs(sig).max())) + air
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 70)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LR, max(-0.35, min(0.35, (m - 60) * 0.02)) if pan is None else pan)

def pedal(m, s, g=1.0, dur=1.6, pan=None, room=0.18, until=None):
    """the partner: one note of the pedal rank, an octave down, darker and rounder still, slower to speak; held level, then left to
    settle as its valve closes"""
    f0 = hz(m); d = dur
    if until is not None:
        d = min(d, max(0.2, until - s - 0.6))
    sec = d + 0.6; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k, a in ((1, 1.0), (2, 0.42), (3, 0.16), (4, 0.05), (5, 0.03)):
        fk = f0 * k
        if fk > 1200:
            break
        sig += a * np.sin(2 * np.pi * fk * x + 0.6 * k)
    sig *= np.clip(x / 0.13, 0, 1) ** 1.6 * np.where(x < d, 1.0, np.exp(-(x - d) / 0.16))
    air = filt(noise(sec + 0.02)[:n], 'band', (250, 900)) * np.exp(-x / 0.07) * np.clip(x / 0.015, 0, 1) * 0.04
    sig = sig / max(1e-9, float(np.abs(sig).max())) + air
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1200), 'high', 38)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LPD, -0.1 if pan is None else pan)

def chord(notes, s, g=1.0, step=0.12, dur=2.0, until=None):
    """a chord placed from its lowest note up: the lowest on the pedal rank when it's B 3 or lower, the rest on the manual; all stopped
    together"""
    for i, m in enumerate(notes):
        dd = max(0.3, dur - step * i)
        (pedal(m, s + step * i, g, dd, until=until) if (i == 0 and m <= B3) else reed(m, s + step * i, g, dd, until=until))
MARK = ((Cs3, E3, Gs3, Cs4), (A2, E3, A3, Cs4), (B2, Fs3, B3, Ds4))   # the three options, side by side
HOME = (E2, B2, E3, Gs3, B3, E4)                                       # home: E
def mark(s, g=1.0, step=0.42, held=1.0, last=2.4, until=None):
    """the mark: three short chords, the options; the third again, held; and home to E"""
    for i, ch in enumerate(MARK):
        chord(ch, s + step * i, g, 0.0, step * 0.72, until)
    chord(MARK[2], s + step * 3, g, 0.0, held, until)
    chord(HOME, s + step * 3 + held, g, 0.05, last, until)
    return s + step * 3 + held  # when it comes home

# =============================================================================================================================
# 1. Clinton's Ditch: the opening. The pedal's low E, alone; E major as New York State comes in, and its sheet. Farms spreading west: A
#    major. The only way east, by wagon: the wheels, far off, and C sharp minor. A ton for a hundred dollars: the sheet, its bar, and G
#    sharp minor. A family, no price that paid: C sharp minor, softly. The canal, as a plan: the line drawn, and A major. The federal
#    government wouldn't pay: C sharp minor, low, gone before "Something had to change", which has nothing under it. The case: its sheet,
#    a pen's stroke for each part; the legislature's yes: the mark, whole, coming home to E on "yes". The digging: the earth, one soft
#    texture. The land taken: C sharp minor, quietly. Open: E major. Under nine dollars: B major; the tolls: A major; the port: E major.
#    A data team: one note; the title, E major, held
LV[0] = 0.85
ow = lambda lid, word, off=0: W('ditch', lid, word, off)
oc = lambda lid, off=0: G('ditch', lid, off)
END = E('ditch')
pedal(E2, 0.5, 0.85, 3.4)
chord((E2, B2, E3, Gs3, B3), ow('when', 'eighteen', 0.2), 0.7, step=0.16, dur=3.0)
card(ow('when', 'eighteen', -0.3), 0.004, px(330))
chord((A2, E3, A3, Cs4), ow('farms', 'west', 0.0), 0.55, step=0.15, dur=2.2)
tap(ow('farms', 'west', -0.2), 0.0035, px(560))
tap(ow('farms', 'coast', -0.2), 0.0035, px(1225))
wheels(ow('road', 'wagon', -0.3), 3.2, 0.004, px(900))
chord((Cs3, Gs3, Cs4, E4), ow('road', 'wagon', 0.1), 0.5, step=0.16, dur=2.2)
tap(ow('road', 'rough', -0.2), 0.0035, px(1080))
card(ow('cost', 'ton', -0.2), 0.004, px(620))
slide(ow('cost', 'hundred', -0.1), 1.0, 0.003, px(540))
chord((Gs2, Ds3, Gs3, B3), ow('cost', 'hundred', 0.1), 0.5, step=0.16, dur=2.0)
tap(ow('harm', 'plenty', -0.1), 0.0035, px(1540))
tap(ow('harm', 'price', -0.1), 0.0035, px(1540))
chord((Cs3, E3, Gs3), ow('harm', 'price', 0.1), 0.5, step=0.18, dur=2.2)
slide(ow('canal', 'canal', -0.1), 3.0, 0.003, px(900))
chord((A2, Cs3, E3, A3), ow('canal', 'canal', 0.1), 0.55, step=0.15, dur=2.4)
tap(ow('canal', 'miles', -0.3), 0.0035, px(900))
tap(ow('refuse', 'federal', -0.2), 0.0035, px(750))
chord((Cs2, Gs2, E3), ow('refuse', 'pay', 0.0), 0.5, step=0.2, dur=2.2, until=oc('change', -0.3))
card(ow('refuse', 'Jefferson', -0.2), 0.004, px(750))
tap(ow('refuse', 'Critics', -0.1), 0.0035, px(750))
card(ow('case', 'legislature', -0.6), 0.004, px(1360))
for word in ('Where', 'cost', 'taxes'):
    pen(ow('what', word, -0.1), 0.3, 0.004, px(1360), 2)
tap(ow('yes', 'fifteenth', -0.2), 0.0035, px(1360))
mark(ow('yes', 'yes', -(3 * 0.42 + 1.0)), 0.6)
earth(ow('dug', 'Thousands', -0.3), 3.4, 0.0035, px(960))
for word in ('Thousands', 'Ireland', 'engineers'):
    tap(ow('dug', word, -0.2), 0.003, px(400))
tap(ow('land', 'taken', -0.2), 0.0035, px(960))
chord((Cs3, E3, Gs3, Cs4), ow('land', 'taken', 0.1), 0.45, step=0.18, dur=2.4)
tap(ow('open', 'opened', 0.1), 0.0035, px(1180))
chord((E3, Gs3, B3, E4), ow('open', 'opened', 0.1), 0.6, step=0.14, dur=2.2)
card(oc('cheaper', -0.2), 0.004, px(620))
slide(ow('cheaper', 'nine', -0.1), 0.8, 0.003, px(540))
chord((B2, Fs3, B3, Ds4), ow('cheaper', 'nine', 0.1), 0.5, step=0.15, dur=1.8)
card(oc('tolls', -0.1), 0.004, px(620))
slide(ow('tolls', 'tolls', 0.0), 2.6, 0.003, px(620))
chord((A2, E3, A3, Cs4), ow('tolls', 'seven', 0.0), 0.5, step=0.15, dur=1.8)
tap(ow('port', 'busiest', -0.2), 0.0035, px(1430))
chord((E2, B2, E3, Gs3, B3, E4), ow('port', 'busiest', 0.0), 0.55, step=0.14, dur=2.6)
card(ow('data', 'team', -0.3), 0.0035, px(1200))
card(ow('same', 'parts', -0.4), 0.0035, px(1200))
reed(E4, ow('same', 'parts', 0.0), 0.45, 1.6)
chord((E2, B2, E3, Gs3, B3, E4), oc('breath', 0.3), 0.65, step=0.2, dur=4.4, until=END)

# 2. The decision first: the chapter turns on A major; the old warehouse's sheet and what it costs every year, under it the pedal's low G
#    sharp; the licence's end and the ask, a sheet each; the decision, in one line: B major, a question; governance and this ask, a sheet
#    each; the five questions, a soft tap as each comes in, and a tick for each; a checklist, not a form: a tap; heavy methods, what the
#    law requires, only when required, then light ones: a tap each, and E major as the chapter closes on the light one
LV[0] = 0.9
dw = lambda lid, word, off=0: W('decide', lid, word, off)
dc = lambda lid, off=0: G('decide', lid, off)
chord((A2, E3, A3, Cs4), S0('decide') + 0.6, 0.5, step=0.15, dur=2.0)
card(dw('old', 'warehouse', -0.3), 0.004, px(980))
card(dw('pay', 'licence', -0.2), 0.004, px(1570))
pedal(Gs2, dw('pay', 'licence', 0.1), 0.55, 1.6)
card(dw('renew', 'ends', -0.3), 0.0035, px(1570))
card(dw('helena', 'council', -0.3), 0.0035, px(980))
card(dc('first', 0.2), 0.004, px(1250))
chord((B2, Fs3, B3, Ds4), dw('first', 'decision', 0.0), 0.5, step=0.15, dur=2.0)
card(dw('capability', 'Governance', -0.2), 0.0035, px(940))
card(dw('capability', 'ask', -0.2), 0.0035, px(1560))
card(dw('five', 'questions', -0.4), 0.004, px(1275))
for word in ('needed', 'value', 'bought', 'afforded', 'delivered'):
    tap(dw('questions', word, -0.6), 0.003, px(1275))
for i in range(5):
    ticked(dw('checklist', 'checklist', -0.2) + 0.3 * i, 0.004, px(760))
tap(dw('checklist', 'form', -0.2), 0.0035, px(930))
tap(dw('heavy', 'heavy', -0.2), 0.003, px(1480))
tap(dw('law', 'law', -0.2), 0.003, px(1480))
tap(dc('only', 0.1), 0.003, px(1480))
tap(dc('light', 0.1), 0.003, px(1450))
chord((E3, B3, E4, Gs4), dw('light', 'quickly', 0.0), 0.5, step=0.14, dur=1.8)

# 3. Three options: carrying on has a price too, a tap; each option laid down, with the mark's chord for it (A: C sharp minor; B: A
#    major; C: B major, each voiced its own way here); the warehouse's logs, a slide; the seventeen nobody opens, the pedal's low C sharp,
#    short; C recommended: the third again, held, and home to E
LV[0] = 0.9
pw = lambda lid, word, off=0: W('options', lid, word, off)
pc = lambda lid, off=0: G('options', lid, off)
tap(pw('options', 'nothing', -0.2), 0.0035, px(1185))
card(pc('a', -0.1), 0.004, px(775))
chord((Cs3, Gs3, Cs4, E4), pc('a', 0.1), 0.45, step=0.12, dur=1.2)
card(pc('b', -0.1), 0.004, px(1185))
chord((A2, Cs3, E3, A3), pc('b', 0.1), 0.45, step=0.12, dur=1.2)
slide(pc('logs', 0.0), 0.9, 0.003, px(1635))
pedal(Cs2, pw('unopened', 'Seventeen', 0.0), 0.5, 0.7)
card(pc('c', -0.1), 0.004, px(1595))
chord((B2, Ds3, Fs3, B3), pc('c', 0.1), 0.45, step=0.12, dur=1.2)
tap(pw('recommend', 'recommends', 0.1), 0.0035, px(1595))
chord((Ds3, Fs3, B3, Fs4), pw('recommend', 'recommends', 0.0), 0.5, step=0.0, dur=1.0)
chord((E2, Gs3, B3, E4), pw('recommend', 'recommends', 1.0), 0.5, step=0.06, dur=2.2)

# 4. Once, and every year: the canal's tolls, its sheet again, and A major low; option C's costs, a sheet; what stops and what starts,
#    two bars growing; the saving: E major; the payback drawn, a slide; covered in about 17 months: one note, B; five years on, A$970,000
#    ahead: E major, voiced higher; Rohan checks every figure: a tick
LV[0] = 0.9
cw = lambda lid, word, off=0: W('costs', lid, word, off)
cc = lambda lid, off=0: G('costs', lid, off)
card(cw('running', 'counted', -0.4), 0.004, px(920))
chord((A2, E3, A3), cw('running', 'counted', 0.0), 0.45, step=0.16, dur=1.8)
card(cw('forty', 'Running', -0.3), 0.004, px(880))
card(cw('stops', 'stops', -0.5), 0.004, px(1520))
slide(cw('stops', 'stops', -0.3), 0.8, 0.003, px(1440))
slide(cw('stops', 'starts', -0.2), 0.6, 0.003, px(1300))
chord((E3, B3, E4, Gs4), cw('stops', 'saving', 0.0), 0.5, step=0.14, dur=2.0)
card(cc('payback', -0.3), 0.004, px(1000))
slide(cc('payback', 0.1), 1.6, 0.003, px(900))
reed(B3, cw('payback', 'seventeen', 0.0), 0.5, 1.2)
chord((E2, Gs3, B3, E4), cw('five', 'nine', 0.0), 0.5, step=0.14, dur=2.2)
ticked(cw('rohan', 'checks', -0.1), 0.0045, px(1000))

# 5. Benefits with owners: the table pinned up: A major; each benefit's row, a soft tap; some aren't money: the pedal's C sharp; the
#    step after the decision: one slide along the strip; track the benefits: B major; each quarter: a tick for each, and E major
LV[0] = 0.9
bw = lambda lid, word, off=0: W('benefits', lid, word, off)
bc = lambda lid, off=0: G('benefits', lid, off)
card(bw('each', 'benefits', -0.3), 0.004, px(1220))
chord((A2, Cs3, E3, A3), bw('each', 'benefits', 0.0), 0.45, step=0.15, dur=1.8)
for lid, word in (('saving', 'saving'), ('staff', 'staff'), ('owner', 'owner')):
    tap(bw(lid, word, -0.4), 0.003, px(1220))
pedal(Cs3, bw('money', 'money', -0.1), 0.45, 1.2)
slide(bw('ward', 'step', -0.4), 1.4, 0.003, px(1100))
chord((B2, Fs3, B3, Ds4), bw('ward', 'track', 0.0), 0.45, step=0.15, dur=1.8)
for i in range(3):
    ticked(bw('quarter', 'quarter', 0.0) + 0.4 * i, 0.004, px(1780))
chord((E3, Gs3, B3, E4), bw('quarter', 'pitch', 0.3), 0.45, step=0.14, dur=1.8)

# 6. Ten minutes, one ask: the council meets: C sharp minor, low; the page comes close, a slide; the ask picked out, a tap; Mei's question:
#    one note, G sharp; the answer, option A: A major, short; the council says yes: the mark, whole, home to E as the line ends
LV[0] = 0.9
aw = lambda lid, word, off=0: W('ask', lid, word, off)
ac = lambda lid, off=0: G('ask', lid, off)
chord((Cs2, Gs2, Cs3, E3), S0('ask') + 0.6, 0.45, step=0.18, dur=2.0)
tap(aw('ten', 'minutes', -0.2), 0.003, px(1125))
slide(ac('page', -0.4), 1.6, 0.0025, px(480))
tap(aw('ask', 'ask', -0.2), 0.003, px(700))
reed(Gs3, aw('mei', 'waiting', 0.0), 0.45, 1.2)
tap(aw('wait', 'option', -0.3), 0.003, px(500))
chord((A2, E3, A3), aw('wait', 'option', 0.0), 0.45, step=0.12, dur=1.2)
tap(aw('yes', 'yes', -0.2), 0.0035, px(1125))
mark(ac('yes', 0.1), 0.55)

# 7. On Monday: the canal's case pinned up: E major, low; Helena's case beside it: A major; each piece of advice laid down; the four
#    parts, a tap each; and the close: the mark, whole and slower, its E held into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
card(S0('monday') + 0.8, 0.004, px(520))
chord((E2, B2, E3, Gs3), S0('monday') + 0.8, 0.45, step=0.16, dur=2.0)
tap(mw('helena', 'tolls', -0.2), 0.003, px(520))
card(mw('helena', "Helena's", -0.3), 0.004, px(1400))
chord((A2, E3, A3, Cs4), mw('helena', 'seventeen', 0.0), 0.45, step=0.15, dur=1.8)
for lid, x in (('start', 390), ('carry', 960), ('count', 1530), ('owners', 530), ('check', 1390)):
    card(mc(lid, 0.1), 0.0035, px(x))
for word in ('Options', 'costs', 'benefits', 'ask'):
    tap(mw('take', word, -0.2), 0.003, px(960))
mark(mc('take', 0.2), 0.5, step=0.55, held=1.2, last=5.0, until=TOT)
