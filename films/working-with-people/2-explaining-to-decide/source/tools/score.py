# Explaining so people can decide: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (palettes.md, 5 November 2026: a lead the setup thread reserved, which no score on main or on any
# branch has): an aluphone, made here, as music.py has none.
#  - The aluphone: bells of spun aluminium, one design in many sizes, each tuned so its octave and its double octave ring with its note;
#    struck softly with a yarn mallet, they ring round and clear, and a hand on the bell stops each one short. Nothing in a bell's own
#    sound beats: the few modes that aren't tuned with the note are heard only at the strike, gone in a hundredth of a second. Set apart
#    from the site's other struck sounds: not its felt piano (the third and fourth harmonics, no strike), nor its celesta (no octave), nor
#    its tubular bells (a hum below the note and partials that aren't tuned).
#  - Its partner, the thread's choice (palettes.md, 10 November 2026): the aluphone's own largest bells, low, struck with a softer
#    mallet and stopped by the palm: a round, dark note, felt more than heard, with almost nothing over its octave. One instrument, one
#    design in two sizes, as the film's page and its picture are one explanation in two forms. Every other struck colour the site lacks
#    either belongs to another culture or sounds like one it has (the long list in the module's palettes.md).
# The mark: one note set apart, then the chord it belongs to. The average is a note alone: it seems to stand for everything and belongs
# nowhere; the range, and later the whole week, is the chord that note was always part of. It comes when Daniels shows the range (F
# alone, then B flat major); when the week's average, 38%, opens into the whole week (F alone, then the chord built up, row by row, as
# the heat map fills); when the page starts with the decision and then shows what it turns on (D alone, then its chord); when the
# University Council decides; and at the close, its chord held into the end card.
# B flat major; G minor for the problem (the doorway, the cockpit, what isn't known). Every chord is tuned pure from B flat (just
# intonation, see hz()): B flat, E flat and F major, and G and D minor, are pure in this table; C held with E flat or G is not, and they
# never sound together. Nothing pulses and nothing is a rush: film.json lists no urgent chapter. No jet, engine or radio sounds for the
# Air Force: the opening is a measuring room, a drawing office and a scientist's desk, and they sound like paper and wood.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/ed_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1952)  # this film's own randomness: the room, the paper, the wood

# ---- tuning: just intonation from B flat, so a chord's notes are whole-number ratios of each other and nothing beats. B flat, E flat
# and F major, and G and D minor, are pure in this table; C held with E flat or with G is not, and never sounds with them
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 46, 12)
    return 116.5409 * 2 ** o * _JI[pc]
Bb1, D2, F2, G2, A2, Bb2, C3, D3, Eb3, F3, G3, A3 = 34, 38, 41, 43, 45, 46, 48, 50, 51, 53, 55, 57
Bb3, C4, D4, Eb4, F4, G4, A4, Bb4, C5, D5, Eb5, F5 = 58, 60, 62, 63, 65, 67, 69, 70, 72, 74, 75, 77

# ---- the levels: the bells and the low bells matched by loudness, as far under the voice as the module's other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LA, LB, FX = 0.05, 0.068, 3.2
LV = [1.0]

# a small room round the instrument, ringing on for about a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
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
def _thump(sec, n, f=280, d=0.007):
    """the yarn mallet meeting the bell: a little low, soft noise, gone in a few thousandths of a second"""
    x = np.arange(n) / SR; th = filt(noise(sec + 0.02)[:n], 'low', f) * np.exp(-x / d)
    return th / max(1e-9, float(np.abs(th).max()))

# ---- a bell's sound: its note, its octave and its double octave (the three the bell is spun and tuned for), each higher one softer and
# gone sooner; and the bell's untuned modes, heard only at the strike, a hundredth of a second, so nothing that lasts is out of tune
def _bell(f0, x, t1, parts, strike, top=2400):
    sig = np.zeros(len(x))
    for k, a, td in parts:
        if f0 * k <= top:
            sig += a * np.sin(2 * np.pi * f0 * k * x + 0.3 * k) * np.exp(-x / (t1 * td))
    for r, a, d in strike:
        if f0 * r <= top + 200:
            sig += a * np.sin(2 * np.pi * f0 * r * x) * np.exp(-x / d)
    return sig
ALU, ALU_HIT = ((1, 1.0, 1.0), (2, 0.32, 0.55), (4, 0.07, 0.25)), ((2.42, 0.1, 0.012), (5.3, 0.04, 0.006))
LOW, LOW_HIT = ((1, 1.0, 1.0), (2, 0.16, 0.45)), ((2.42, 0.05, 0.015),)

def alu(m, s, g=1.0, pan=None, ring=None, room=0.22, until=None):
    """the aluphone: one bell struck at s with a soft yarn mallet; it rings round and clear, and a hand stops it after ring seconds"""
    f0 = hz(m); t1 = 2.6 * (262 / f0) ** 0.35; d = ring if ring else 0.9
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _bell(f0, x, t1, ALU, ALU_HIT)
    sig *= (1 - np.exp(-x / 0.0025)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.03 * _thump(sec, n)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 90)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LA, max(-0.35, min(0.35, (m - 62) * 0.02)) if pan is None else pan)

def low(m, s, g=1.0, pan=None, ring=None, room=0.18, until=None):
    """the low bells: one of the aluphone's largest, struck with a softer mallet and stopped by the palm after ring seconds: a round,
    dark note with almost nothing over its octave"""
    f0 = hz(m); t1 = 3.0 * (98 / f0) ** 0.3; d = ring if ring else 0.8
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _bell(f0, x, t1, LOW, LOW_HIT, 1500)
    sig *= (1 - np.exp(-x / 0.006)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.08))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.05 * _thump(sec, n, 200, 0.012)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1500), 'high', 40)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LB, -0.12 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.12, ring=2.2, until=None):
    """a chord struck from its lowest bell up, the lowest on the low bells when it's low, every hand lifting together at the end so the
    bells stop as one"""
    for i, m in enumerate(notes):
        r = max(0.4, ring - step * i)
        (low if (i == 0 and m < Bb2) else alu)(m, s + step * i, g, None, r, until=until)
def figure(notes, s, g=1.0, step=0.22, ring=0.5, last=None, until=None, fall=1.0):
    """a short figure, a bell at a time, each stopped before the next but one, so nothing that isn't pure rings together; each a little
    softer than the one before when fall is under one"""
    k = len(notes)
    for i, m in enumerate(notes):
        r = last if (last and i == k - 1) else ring
        (low if m < Bb2 else alu)(m, s + step * i, g * fall ** i, None, r, until=until)
def mark(note, s, chord_notes, c, g=1.0, step=0.14, ring=2.4, until=None, alone=1.6):
    """the mark: one note set apart, struck alone at s and held a moment; then, at c, the chord it belongs to"""
    alu(note, s, 0.9 * g, None, alone, until=until)
    chord(chord_notes, c, g, step, ring, until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2000):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.1 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def sheet(s, g=0.0045, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and the pin's faint press into the board"""
    n = int(0.18 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.2)[:n], 'band', (350, 1700)) * _bump(x, 0.08) * (x < 0.08)
    _fx(fl + 0.55 * _knock(n, 170, 0.016, 0.075) / 1.3, s, g, pan, 1800)
def tag(s, g=0.0035, pan=0.0):
    """a small label set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (280, 1100)) * np.exp(-x / 0.006) + 0.6 * _knock(n, 240, 0.011), s, g, pan, 1500)
def pencil(s, sec=0.7, g=0.005, pan=0.0, n=3):
    """a pencil on paper, a stroke at a time: softer and drier than a pen"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 50)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (600, 1900)) * _bump(x, d, 0.7) * (0.35 + 0.65 * gr), t, g, pan, 2000)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn in pencil: two quick strokes"""
    pencil(s, 0.22, g, pan, 2)
def slide(s, sec=0.9, g=0.0045, pan=0.0):
    """a sheet slid along a wall or a desk: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (220, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1400)
def rustle(s, sec=2.2, g=0.004, pan=0.0):
    """papers laid on a table, pile by pile: one soft texture that swells and settles, never a burst of flicks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 6); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (260, 1300)) * _bump(x, sec, 1.2) * gr, s, g, pan, 1400)
def board(s, sec=1.1, g=0.005, pan=0.0):
    """the measuring board's head piece slid down its wooden upright to a flyer's head: a low wooden rub, and a soft stop"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (120, 650)) * _bump(x, sec * 0.9, 1.1) + 0.6 * _knock(n, 130, 0.03, sec * 0.88), s, g, pan, 900)
def seat(s, sec=0.8, g=0.004, pan=0.0):
    """a seat moved on its runners, or a pedal along its track: a short, low, smooth rub that settles"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (140, 700)) * _bump(x, sec, 1.6) + 0.4 * _knock(n, 150, 0.02, sec * 0.92), s, g, pan, 1000)
def drift(s, sec=2.2, g=0.004, pan=0.0):
    """the moved classes carried to other hours: one soft, airy sweep, low, as of cards moved across a board, never a patter of taps"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 9); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (240, 1000)) * _bump(x, sec, 1.3) * gr, s, g, pan, 1200)

# =============================================================================================================================
# 1. No average pilot: the opening, the module's story from outside data. The measuring room, 1950: the low B flat, alone, then B flat
#    major as the room comes in; the board's head piece slid down to a flyer's head; the measurer's pencil; E flat major as the figures
#    go to the designers. The average man: F, alone, the note set apart. The doorway: G minor, low, as half the men stoop; the cockpit:
#    G minor again, in another voicing, gone before "Something had to change", which has nothing under it. Daniels's office, 1952: his
#    question; the count, a bell for each measurement that leaves fewer, each lower and softer, and nothing at all for "not one". His
#    note, its line underlined. The range: F alone, then B flat major, the chord it belongs to: the mark. The cockpit for the range: F
#    major, the seat and the pedals moving; a car's seat. Data's average: F alone once more, then, as the number opens into the week, B
#    flat major built up, row by row; the title, B flat major held
LV[0] = 0.85
ow = lambda lid, word, off=0: W('pilot', lid, word, off)
oc = lambda lid, off=0: G('pilot', lid, off)
END = E('pilot')
low(Bb1, 0.5, 0.8, 0.0, ring=3.2)
chord((Bb2, F3, Bb3, D4), ow('when', 'nineteen', 0.2), 0.7, step=0.17, ring=3.0)
sheet(ow('when', 'nineteen', -0.3), 0.004, px(336))
board(ow('when', 'measured', -0.4), 1.2, 0.0045, px(632))
pencil(ow('when', 'hundred', -0.2), 0.8, 0.0045, px(1450), 3)
sheet(ow('why', 'designed', -0.2), 0.004, px(336))
chord((Eb3, G3, Bb3, Eb4), ow('why', 'designed', 0.1), 0.6, step=0.15, ring=2.4)
# the drawing office: the average man, a note alone
sheet(oc('avg', 0.1), 0.004, px(295))
alu(F4, ow('avg', 'average', 0.0), 0.7, px(295) * 0.4, ring=2.2)
tag(ow('easy', 'easiest', -0.1), 0.0035, px(295)); tag(ow('easy', 'commonest', -0.1), 0.0035, px(295))
# the doorway, and half the men stoop: G minor, low
sheet(oc('door', -0.3), 0.004, px(870))
chord((G2, D3, G3, Bb3), ow('door', 'stoop', -0.3), 0.6, step=0.16, ring=2.4)
tag(ow('door', 'half', -0.1), 0.0035, px(870))
sheet(oc('cockpit', -0.3), 0.004, px(1535))
tag(ow('cockpit', 'control', -0.1), 0.0035, px(1535)); tag(ow('cockpit', 'pedal', -0.1), 0.0035, px(1535))
chord((D3, G3, Bb3, D4), ow('cockpit', 'safely', -0.2), 0.55, step=0.18, ring=2.0, until=oc('change', -0.4))
# Daniels's office, 1952: his card; his plain question; the middle band shaded
sheet(ow('daniels', 'Lieutenant', -0.2), 0.004, px(1350))
alu(F4, ow('asked', 'average', 0.1), 0.55, px(1350) * 0.4, ring=1.6)
sheet(ow('ten', 'ten', -0.2), 0.004, px(1390))
slide(ow('band', 'middle', -0.2), 0.9, 0.0035, px(1390))
# the count: a bell for each measurement that leaves fewer (1,055, 302, 143, 73, 28, 12, 6, 3, 2), each lower and softer; then nothing
sheet(oc('height', -0.4), 0.004, px(1270))
for i, (lid, word, off) in enumerate((('height', 'one', -0.1), ('chest', 'three', -0.1), ('fewer', 'hundred', -0.1), ('fewer', 'seventy', -0.1),
                                      ('fewer', 'twenty', -0.1), ('fewer', 'twelve', -0.1), ('fewer', 'six', -0.1), ('fewer', 'six', 0.3), ('fewer', 'two', -0.1))):
    alu((F5, D5, C5, Bb4, A4, F4, D4, C4, Bb3)[i], ow(lid, word, off), 0.62 * 0.9 ** i, px(1270) * 0.4, ring=0.38)
tag(ow('none', 'not', 0.2), 0.0035, px(1060))
# his note, its second sentence underlined as the voice reads it
sheet(oc('note', -0.2), 0.004, px(1380))
pencil(ow('note', 'virtually', -0.2), 1.8, 0.004, px(1380), 4)
# the range: F alone, then the chord it belongs to, as nine flyers in ten fit: the mark
sheet(ow('range', 'range', -0.2), 0.004, px(1410))
mark(F4, ow('range', 'range', -0.1), (Bb2, F3, Bb3, D4, F4), ow('range', 'nine', -0.1), 0.65, step=0.15, ring=2.6)
tag(ow('range', 'nine', -0.1), 0.0035, px(1410))
# the cockpit for the range: its seat and pedals moving to each pilot; by the 1970s, the middle ninety in every hundred; a car's seat
sheet(oc('fit', -0.1), 0.004, px(960))
chord((F3, A3, C4, F4), ow('seats', 'ninety', -0.1), 0.55, step=0.15, ring=2.2)
seat(ow('adjust', 'rise', -0.2), 0.8, 0.004, px(500)); seat(ow('adjust', 'pedals', -0.1), 0.7, 0.0035, px(620))
seat(ow('car', 'slides', -0.2), 0.9, 0.004, px(1470))
# data's average: one number, alone; then the week it hides, B flat major built up as the map fills, and the low bell under the peak
sheet(ow('data', 'one', -0.2), 0.004, px(960))
alu(F4, ow('data', 'one', 0.0), 0.5, px(960) * 0.4, ring=1.4)
figure((Bb2, D3, F3, Bb3, D4, F4), ow('lead', 'show', -0.1), 0.6, step=0.3, ring=1.4, last=2.4)
low(Bb1, ow('lead', 'turns', -0.1), 0.6, None, ring=1.6)
# the title, B flat major, held, stopped before the next chapter
chord((Bb1, F2, Bb2, D3, F3, Bb3), oc('breath', 0.3), 0.7, step=0.18, ring=4.6, until=END)

# 2. One page for the University Council: the chapter turns on E flat major. Graham's cards; the agreed question, written; late April's
#    answer, a small B flat major; one page by Tuesday 1 June, a low G alone (waiting, and the risk); the team's room: the twelve pages
#    spread out in the order of the work, a single high D far along them for the answer on page nine; the week's average; Helena's
#    question, and D alone, the decision, not yet first
LV[0] = 0.9
pw = lambda lid, word, off=0: W('page', lid, word, off)
pc = lambda lid, off=0: G('page', lid, off)
chord((Eb3, Bb3, Eb4, G4), S0('page') + 0.3, 0.55, step=0.16, ring=2.2)
sheet(pw('uni', 'Graham', -0.1), 0.004, px(1320)); sheet(pw('ask', 'Council', -0.2), 0.004, px(1320))
tag(pw('full', 'always', -0.3), 0.0035, px(1180))
sheet(pw('q', 'agreed', -0.2), 0.004, px(1340)); pencil(pw('q', 'writing', -0.1), 0.8, 0.0045, px(1340), 3)
tag(pw('april', 'answer', -0.1), 0.0035, px(1340))
figure((D4, F4, Bb4), pw('april', 'answer', 0.0), 0.5, step=0.18, ring=0.6, last=1.4)
sheet(pw('june', 'one', -0.2), 0.004, px(1320))
low(G2, pw('june', 'one', 0.0), 0.6, None, ring=1.4)
tag(pw('ivy', 'Ivy', -0.1), 0.003, px(760)); tag(pw('ivy', 'Helena', -0.1), 0.003, px(1250))
slide(pw('draft', 'twelve', -0.2), 1.6, 0.004, px(900))
for word, x in (('data', 392), ('method', 774), ('checks', 1084)):
    tag(pw('draft', word, -0.1), 0.003, px(x))
tag(pw('draft', 'answer', -0.1), 0.0035, px(1260))
alu(D5, pw('draft', 'nine', 0.0), 0.45, px(1260) * 0.4, ring=1.6)
sheet(pw('chart', 'average', -0.3), 0.004, px(960))
tag(pw('thesis', 'thesis', -0.2), 0.003, px(960)); tag(pw('thesis', 'nothing', -0.2), 0.003, px(960))
sheet(pw('who', 'who', -0.2), 0.004, px(1030))
alu(D5, pw('who', 'decide', 0.0), 0.45, px(1030) * 0.4, ring=1.8, until=E('page'))

# 3. The decision first: the University Council's room before a meeting, the papers laid at each place; the page lifted from the pile
#    with D, alone, the decision; Minto's pyramid, built from the top down: the answer high, then its reasons, then the evidence low under
#    them, one chord from the top; the page written top down, a pencil's strokes for each part; B flat major as the three lines are in,
#    the chord the decision turns on; the method and the other charts slid to the back; the true finding laid on the pile
LV[0] = 0.9
fw = lambda lid, word, off=0: W('first', lid, word, off)
fc = lambda lid, off=0: G('first', lid, off)
rustle(fw('pile', 'pile', -0.4), 2.6, 0.0035, px(960))
tag(fw('pile', 'decide', -0.1), 0.0035, px(960))
alu(D5, fw('start', 'decision', -0.2), 0.55, 0.0, ring=2.0)
sheet(fw('minto', 'Barbara', -0.2), 0.004, px(960))
alu(Bb4, fw('minto', 'answer', -0.1), 0.5, 0.0, ring=2.6)
alu(D4, fw('minto', 'reasons', -0.1), 0.5, -0.1, ring=2.0); alu(F4, fw('minto', 'reasons', 0.05), 0.5, 0.1, ring=1.9)
low(Bb1, fw('minto', 'evidence', -0.1), 0.55, None, ring=1.6)
sheet(fc('decision', -0.2), 0.004, px(960))
pencil(fw('answer', 'rooms', -0.2), 0.9, 0.0045, px(900), 4)
for word in ('peak', 'bookings', 'take'):
    pencil(fw('three', word, -0.2), 0.5, 0.004, px(900), 2)
chord((Bb2, D3, F3, Bb3, D4), fw('three', 'take', 0.7), 0.5, step=0.14, ring=2.0)
slide(fw('back', 'back', -0.3), 1.4, 0.004, px(700)); sheet(fw('back', 'back', -0.1), 0.0035, px(1510))
sheet(fw('seats', 'true', -0.2), 0.0035, px(1510))
slide(fw('holds', "doesn't", -0.2), 1.2, 0.0035, px(1510))
tag(fw('holds', 'holds', -0.3), 0.0035, px(1510))

# 4. What it turns on: the week's average, 38%, laid beside the page, and F alone, the note set apart; the whole week drawn, row by row,
#    and the chord it belongs to built up with it, slowly: the mark; the low B flat under the peak; the academics and Facilities, each
#    right, a tick each; Daniels's count, its last steps, falling; booked isn't used: four bells and a fifth that doesn't sound; Tufte's
#    and Knaflic's cards; the page and the picture together, D alone for what to decide and its chord for what it turns on; Helena's
#    route, a bell for each step on it, F major rising
LV[0] = 0.9
tw = lambda lid, word, off=0: W('turns', lid, word, off)
tc = lambda lid, off=0: G('turns', lid, off)
sheet(tw('hides', 'average', -0.3), 0.004, px(1540))
alu(F4, tw('hides', 'average', 0.0), 0.55, px(1540) * 0.4, ring=2.2)
slide(tw('map', 'whole', -0.4), 1.2, 0.0035, px(300))
sheet(tw('map', 'heat', -0.2), 0.004, px(690))
figure((Bb2, F3, D4, F4, Bb4), tw('map', 'heat', 0.3), 0.55, step=0.42, ring=1.6, last=2.6)
low(Bb1, tw('peak', 'ninety', -0.1), 0.6, None, ring=1.6)
tag(tw('right', 'academics', -0.2), 0.0035, px(1500)); ticked(tw('right', 'right', -0.1), 0.004, px(1790))
pencil(tw('corridors', 'empty', -0.3), 0.8, 0.0035, px(400), 3)
tag(tw('corridors', 'Facilities', -0.2), 0.0035, px(1500)); ticked(tw('corridors', 'saw', 0.2), 0.004, px(1830))
sheet(tw('daniels', 'Daniels', -0.3), 0.004, px(1550))
figure((D5, C5, Bb4), tw('daniels', 'count', 0.0), 0.45, step=0.3, ring=0.4, last=0.9, fall=0.85)
sheet(tw('used', 'booked', -0.3), 0.004, px(1550))
figure((Bb3, D4, F4, Bb4), tw('used', 'five', -0.4), 0.45, step=0.26, ring=0.42, last=0.9)
sheet(tw('tufte', 'Edward', -0.2), 0.004, px(1540)); sheet(tw('knaflic', 'Cole', -0.2), 0.004, px(1540))
slide(tc('together', -0.2), 1.6, 0.0035, px(500))
mark(D5, tw('together', 'says', -0.1), (Bb2, F3, Bb3, D4), tw('together', 'shows', -0.1), 0.5, step=0.15, ring=2.2, alone=1.4)
sheet(tw('route', 'crosses', -0.3), 0.004, px(730))
_r0 = tw('route', 'teams', -0.2)
for i, m in enumerate((F3, A3, C4, F4)):
    alu(m, _r0 + 0.35 + 0.55 * i, 0.45, px(301 + 262 * i) * 0.4, ring=0.5 if i < 3 else 1.0, until=E('turns'))

# 5. What isn't known, in their words: the moved classes carried across the week, one soft sweep, and F major, light, as they land; the
#    forecast met, a pencil line; what isn't known: G minor, low; how far the answer holds: B flat major, out of the minor. The
#    registrar's office: Mei; said back, a tick; one word she stops at, a low G alone, stopped short; the page in her words, a pencil
#    line; her question; the page's answer, E flat major; the same page for everyone, three sheets and B flat major
LV[0] = 0.9
uw = lambda lid, word, off=0: W('unknown', lid, word, off)
uc = lambda lid, off=0: G('unknown', lid, off)
drift(uw('take', 'move', -0.1), 2.4, 0.004, px(1410))
low(F2, uw('take', 'move', 2.2), 0.5, None, ring=1.4); alu(A4, uw('take', 'move', 2.3), 0.4, px(1410) * 0.4, ring=1.2)
alu(C5, uw('take', 'move', 2.45), 0.38, px(1410) * 0.4, ring=1.0)
tag(uw('take', 'move', 0.3), 0.0035, px(1410))
pencil(uw('forecast', 'meets', -0.2), 0.8, 0.004, px(500), 3)
pencil(uw('unknown', "isn't", -0.2), 0.8, 0.004, px(500), 3)
chord((G2, D3, G3, Bb3), uw('unknown', 'known', 0.1), 0.5, step=0.18, ring=2.2)
chord((Bb2, F3, D4, F4), uw('holds', 'today', -0.1), 0.5, step=0.15, ring=2.2)
tag(uw('mei', 'Mei', -0.1), 0.003, px(1640))
tag(uw('says', 'two', -0.2), 0.0035, px(1640))
low(G2, uw('word', 'utilisation', -0.1), 0.5, None, ring=0.5, room=0.12)
tag(uw('word', 'seats', -0.2), 0.003, px(280)); tag(uw('word', 'booked', -0.2), 0.003, px(1610))
pencil(uw('words', 'means', -0.2), 0.8, 0.004, px(960), 3)
tag(uw('which', 'which', -0.2), 0.0035, px(1600))
pencil(uw('plan', 'answers', -0.2), 0.9, 0.004, px(960), 3)
chord((Eb3, Bb3, Eb4, G4), uw('plan', 'answers', 0.3), 0.45, step=0.15, ring=1.8)
for i in range(3):
    sheet(uc('same', 0.1 + i * 0.35), 0.0035, px((405, 960, 1515)[i]))
chord((F3, Bb3, D4, F4), uw('same', 'numbers', 0.0), 0.5, step=0.14, ring=2.2, until=E('unknown'))

# 6. They decide: Graham's office: the page slid into its envelope of a day, the picture beside it, his name; the University Council's
#    room: E flat major as it meets; its two questions, a tick each, both answered on the page; the decision: D alone, then its chord, the
#    mark; nothing under "the choice, not the numbers"; B flat major, high and soft, as the page lets them see what they're choosing
LV[0] = 0.9
dw = lambda lid, word, off=0: W('decide', lid, word, off)
dc = lambda lid, off=0: G('decide', lid, off)
slide(dw('sends', 'page', -0.4), 1.0, 0.0035, px(1145)); sheet(dw('sends', 'picture', -0.4), 0.0035, px(1590))
pencil(dw('sends', 'name', -0.3), 0.7, 0.004, px(1145), 3)
tag(dw('sends', 'Tuesday', -0.2), 0.003, px(1355))
chord((Eb3, G3, Bb3, Eb4), dc('meets', 0.3), 0.55, step=0.16, ring=2.2)
tag(dw('asks', 'sure', -0.3), 0.0035, px(300)); tag(dw('asks', 'which', -0.3), 0.0035, px(300))
ticked(dw('asks', 'both', -0.1), 0.004, px(560)); ticked(dw('asks', 'both', 0.2), 0.004, px(580))
sheet(dw('defers', 'defer', -0.3), 0.004, px(1030))
mark(D5, dw('defers', 'defer', -0.2), (Bb2, F3, D4, F4, D5), dw('defers', 'timetable', -0.1), 0.55, step=0.16, ring=2.6)
tag(dw('argued', 'choice', -0.3), 0.0035, px(320))
chord((D4, F4, Bb4, D5), dw('see', 'see', 0.0), 0.45, step=0.14, ring=2.6, until=E('decide'))

# 7. On Monday: Daniels's three prints, a sheet each; his count, its first steps, falling, as "he counted"; Ivy's page did the same: D
#    alone, then its chord; the four cards; and the close: D alone on "Lead", then the chord it belongs to on "show", the low B flat
#    under it, held into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
for i, x in enumerate((370, 970, 1550)):
    sheet(S0('monday') + 0.6 + 0.3 * i, 0.0035, px(x))
figure((F5, D5, C5, Bb4), mw('back', 'counted', 0.0), 0.42, step=0.26, ring=0.38, last=0.8, fall=0.85)
tag(mw('back', 'plainly', -0.2), 0.003, px(970)); tag(mw('back', 'left', -0.2), 0.003, px(1550))
mark(D5, mw('ivy', 'decision', -0.1), (Bb2, D3, F3, D4), mw('ivy', 'choice', -0.1), 0.5, step=0.15, ring=2.0, alone=1.4)
for lid, x in (('one', 530), ('two', 1390), ('three', 530), ('four', 1390)):
    sheet(mc(lid, -0.1), 0.0035, px(x))
alu(D5, mc('take', 0.05), 0.5, 0.0, ring=1.6)
chord((Bb1, F2, Bb2, F3, Bb3, D4, F4), mw('take', 'show', -0.1), 0.55, step=0.17, ring=5.6, until=TOT)
