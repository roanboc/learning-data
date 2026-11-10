# One list, not twenty: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, row reserved 10 November 2026, 03:40 UTC, after searching every
# score.py, music.py, sound.py and audio.py on main and on every branch, and every palettes.md in the project's files, for "gittern":
# none): a gittern, made here, as music.py has none.
#  - The gittern: the small medieval instrument carved from one block of wood, its gut strings plucked with a quill. Light and quick,
#    each note placed and let go: played soft and low in its range, never strummed, no vibrato, no slide. Its touch is a hand's, a little
#    uneven, short and dry, so it reads as neither the agent films' cittern (wire strings) nor the lute-harpsichord of When someone falls
#    behind (a keyboard). A chord is placed from its lowest note up, one string at a time.
#  - Its partner: its own lowest course, plucked with the thumb's flesh, not the quill, and left to ring: the bass under the opening.
#    No drums, bugles or marches for Larrey, and nothing from the army of his day.
# The mark: one list, in order. Three notes plucked at once, a blur of everyone asking (D, F and B-flat), then the same three, one at a
# time, in order, landing on B-flat. Played whole as the requests come through the one door onto the one list (the opening's end and
# chapter 3's), whole again back with Larrey on Monday, and at the close an octave lower, its B-flat left to ring into the end card.
# B-flat major, G minor for the opening's problem and for every "not now". Every chord is tuned pure from B-flat (just intonation, see
# hz()): B-flat, E-flat and F major, G and D minor are pure in this table; C minor is not, and is never played. No chapter is urgent:
# nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself (each chord here is voiced its own way every time).
#  - Nothing trembles: a plucked note dies away by itself, or is stopped by the hand; each is gone before the next chapter.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/ol_scenes.js, and
#    panned to where it is drawn. Everything low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1792)  # this film's own randomness: the room, the hand's unevenness, the paper


# a small room round the instrument, ringing on for about eight tenths of a second. Its level is set by what it rings where the notes
# are (its gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
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
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def sheet(s, g=0.006, pan=0.0):
    """a sheet pinned to the wall: a soft flap of paper, then the pin's faint press"""
    n = int(0.18 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.2)[:n], 'band', (360, 1700)) * _bump(x, 0.08) * (x < 0.08)
    _fx(fl + 0.5 * _knock(n, 170, 0.014, 0.09) / 1.35, s, g, pan, 1800)
def tap(s, g=0.005, pan=0.0, f=210):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (240, 1000)) * np.exp(-x / 0.007) + 0.6 * _knock(n, f, 0.012), s, g, pan, 1500)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """papers drawn along together, or a line drawn out: one dry, even rub that eases in and off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def rumble(s, sec=3.0, g=0.004, pan=0.0, band=(60, 380)):
    """wagons on a road, or light carriages: one soft, low texture of wheels that swells and fades, never a clatter of single knocks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 7); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', band) * _bump(x, sec, 1.3) * gr, s, g, pan, 700)
def latch(s, g=0.006, pan=0.0):
    """a timber door's latch lifted, and the door swinging open: a low, wooden knock, then a soft breath of air"""
    n = int(0.9 * SR); x = np.arange(n) / SR
    air = filt(noise(0.92)[:n], 'band', (120, 600)) * _bump(x - 0.08, 0.8, 1.6) * (x > 0.08) * 0.5
    _fx(_knock(n, 140, 0.03) + 0.5 * _knock(n, 95, 0.05, 0.04) + air, s, g, pan, 1200)
def glow(s, g=0.004, pan=0.0):
    """a screen coming on: a soft, low swell of air, no tone"""
    n = int(0.6 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.62)[:n], 'band', (150, 650)) * _bump(x, 0.6, 1.2), s, g, pan, 900)

# ---- tuning: just intonation from B-flat, so a chord's notes are whole-number ratios of each other and nothing beats. B-flat, E-flat
# and F major, G and D minor are pure in this table; C minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 46, 12)
    return 116.5409 * 2 ** o * _JI[pc]
Bb1, D2, Eb2, F2, G2, A2, Bb2, C3, D3, Eb3, F3, G3, A3, Bb3 = 34, 38, 39, 41, 43, 45, 46, 48, 50, 51, 53, 55, 57, 58
C4, D4, Eb4, F4, G4, A4, Bb4, C5, D5, Eb5, F5 = 60, 62, 63, 65, 67, 69, 70, 72, 74, 75, 77

LQ, LT, FX = 0.089, 0.11, 3.9   # the quill, the thumb and the effects: the music's loud moments about -30 dB, the effects about 15 dB under
LV = [1.0]

def _string(f0, sec, pos, tilt, tau, top):
    """a gut string, plucked at pos along its length: its partials, a little sharp as gut's are, each dying faster than the one below,
    shaped by the small carved body's three hollows"""
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 26):
        fk = f0 * k * np.sqrt(1 + 0.00007 * k * k)
        if fk > top:
            break
        body = 1 + 0.6 * np.exp(-((fk - 300) / 120) ** 2) + 0.45 * np.exp(-((fk - 880) / 260) ** 2) + 0.2 * np.exp(-((fk - 1700) / 300) ** 2)
        sig += abs(np.sin(np.pi * k * pos)) / k ** tilt * body * np.sin(2 * np.pi * fk * x + 0.9 * k) * np.exp(-x / (tau / (1 + 0.3 * (k - 1))))
    return sig, x

def quill(m, s, g=1.0, ring=0.7, pan=None, room=0.12, until=None):
    """the gittern: a gut string plucked with a quill near the bridge, bright at its start and quickly mellow, the quill's faint tick
    first; a hand's touch, a little early or late and a little louder or softer each time; stopped by the hand after ring seconds"""
    s = s + R1.uniform(-0.008, 0.008); g = g * 10 ** (R1.uniform(-1.2, 1.2) / 20)
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.25
    sig, x = _string(f0, sec, 0.13, 1.0, 0.9 if m < Bb3 else 0.7, 2300)
    sig *= np.minimum(1, x / 0.0015) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05))
    tick = filt(noise(sec + 0.02)[:len(x)], 'band', (900, 2200)) * np.exp(-x / 0.002) * 0.05 * float(np.abs(sig).max() or 1)
    sig = _until(_room(norm(filt(filt((sig + tick).astype(np.float32), 'low', 2300), 'high', 70)), room, 0.0, min(0.8, d)), s, until)
    put(sig, s, g * LV[0] * LQ, max(-0.35, min(0.35, (m - 62) * 0.02)) if pan is None else pan)

def thumb(m, s, g=1.0, ring=2.0, pan=None, room=0.14, until=None):
    """the partner: the lowest course, plucked with the thumb's flesh nearer the string's middle, round and soft, its higher partials gone
    first, left to ring, then stopped by the hand"""
    s = s + R1.uniform(-0.006, 0.006); g = g * 10 ** (R1.uniform(-0.8, 0.8) / 20)
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3
    sig, x = _string(f0, sec, 0.27, 1.5, 1.8, 1300)
    sig *= np.minimum(1, x / 0.006) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1300), 'high', 38)), room, 0.0, min(0.8, d)), s, until)
    put(sig, s, g * LV[0] * LT, -0.12 if pan is None else pan)

def chord(notes, s, g=1.0, step=0.16, ring=1.6, until=None):
    """a chord placed from its lowest note up, one string at a time, never strummed: the lowest by the thumb when it's low, the rest by
    the quill, all stopped together"""
    for i, m in enumerate(notes):
        r = max(0.4, ring - step * i)
        (thumb(m, s + step * i, g, r, until=until) if (i == 0 and m < Bb2 + 1) else quill(m, s + step * i, g, r, until=until))
def notes(ms, s, g=1.0, step=0.28, ring=0.45, last=None, until=None):
    """a short line, one note at a time, each stopped before the next"""
    for i, m in enumerate(ms):
        quill(m, s + step * i, g, last if (last and i == len(ms) - 1) else ring, until=until)
ASK = (D4, F4, Bb4)
def mark(s, g=1.0, shift=0, step=0.3, last=1.6, bass=(), until=None):
    """the mark: the three notes plucked at once, a blur of everyone asking; a breath; then the same three, one at a time, in order,
    landing on B-flat; the thumb's low notes under it at the places given (counted in steps after the blur)"""
    for i, m in enumerate(ASK):
        quill(m + shift, s + 0.018 * i, 0.8 * g, 0.5, until=until)
    notes(tuple(m + shift for m in ASK), s + 0.62, g, step, 0.42, last, until)
    for m, i, r in bass:
        thumb(m, s + 0.62 + step * i, 0.9 * g, r, until=until)

# =============================================================================================================================
# 1. Flying ambulances: the opening. The Rhine, 1792: the thumb's low B-flat alone, then B-flat major placed up as its card comes in.
#    The young surgeon: F major, light. The field hospital a league behind: the dimension line drawn. The wounded where they fall: G minor,
#    low. The ambulance setting out behind the wagons: one far, low rumble. A day, or a day and a half: the thumb's low G, alone. Most die
#    waiting: G minor, lower, gone before "Something has to change", which has nothing under it. Larrey's design: pen strokes as it draws
#    itself, then E-flat major. It follows the front line: F major. From 1793: the light carriages, a lighter rumble, and as the wounded
#    are reached, three single notes rising. It works, at Aboukir: B-flat major; none waited more than a quarter of an hour: F, then
#    B-flat. A data team's field: G minor, soft, once. Through one door, onto one list: the papers drawn along, the mark, whole; the title:
#    B-flat major, low, left to ring
LV[0] = 0.85
ow = lambda lid, word, off=0: W('flying', lid, word, off)
oc = lambda lid, off=0: G('flying', lid, off)
END = E('flying')
thumb(Bb2, 0.5, 0.8, 3.0, 0.0)
chord((Bb2, F3, Bb3, D4), ow('rhine', 'Rhine', 0.2), 0.65, step=0.2, ring=2.6)
sheet(ow('rhine', 'Rhine', -0.3), 0.004, px(410))
sheet(ow('rhine', 'Dominique-Jean', -0.3), 0.004, px(440))
chord((F3, A3, C4), ow('rhine', 'surgeon', 0.0), 0.45, step=0.18, ring=1.4)
pen(ow('league', 'league', -0.2), 0.6, 0.004, px(1070), 2)
chord((G2, D3, G3, Bb3), ow('lie', 'fall', -0.1), 0.55, step=0.2, ring=2.4)
rumble(ow('lie', 'sets', -0.2), 3.6, 0.0035, px(960))
thumb(G2, ow('die', 'day', -0.1), 0.6, 1.8)
chord((D2, G2, Bb2, D3), ow('die', 'Most', -0.1), 0.5, step=0.22, ring=2.4, until=oc('speyer', 3.0))
pen(ow('fly', 'flying', 0.0), 2.2, 0.0045, px(1200), 4)
chord((Eb2, Bb2, Eb3, G3), ow('fly', 'carriage', 0.0), 0.5, step=0.18, ring=2.0)
chord((F2, C3, F3, A3), ow('fly', 'follows', 0.0), 0.45, step=0.16, ring=1.4)
rumble(ow('bandage', 'bandage', -0.2), 5.0, 0.003, px(960), (110, 600))
for word, m in (('bandage', F4), ('fall', A4), ('battle', Bb4)):
    quill(m, ow('bandage', word, 0.3), 0.4, 0.9, px(960) * 0.4)
chord((Bb2, F3, D4, F4), ow('aboukir', 'eight', -0.1), 0.55, step=0.16, ring=2.0)
sheet(ow('aboukir', 'Aboukir', -0.3), 0.004, px(440))
sheet(ow('quarter', 'quarter', -0.4), 0.004, px(440))
chord((F2, A3, C4), ow('quarter', 'quarter', 0.0), 0.5, step=0.16, ring=1.2)
chord((Bb2, D3, Bb3, F4), ow('quarter', 'bandaged', -0.3), 0.55, step=0.16, ring=2.2)
chord((G2, Bb3, D4), ow('data', 'many', -0.1), 0.45, step=0.2, ring=1.8)
slide(ow('list', 'door', -0.4), 3.0, 0.0035, px(1250))
mark(ow('list', 'list', 0.4), 0.6, 0, 0.3, 1.8, bass=((Bb2, 2, 2.4),))
chord((Bb1, F2, Bb2, D3), oc('breath', 0.4), 0.6, step=0.2, ring=4.4, until=END)

# 2. Eleven ways in: the chapter turns on G minor, low; each place's sheet set on the wall, a soft tap each as it's named, two by two
#    so none crowd; asked twice: the thumb's D, and the dashed line drawn; whoever reaches the team first: nothing. Jena: G minor, as the
#    walking wounded come in; the worst wounds waited: the thumb's low G, left. The roadmap's first package: its card, and F, then
#    B-flat, as a plan
LV[0] = 0.9
dw = lambda lid, word, off=0: W('doors', lid, word, off)
dc = lambda lid, off=0: G('doors', lid, off)
chord((G2, D3, G3), S0('doors') + 0.3, 0.5, step=0.2, ring=2.0)
for lid, word, x in (('places', 'inboxes', 900), ('places', 'tracker', 1500), ('places', 'spreadsheets', 1180), ('places', 'chat', 1000),
                     ('more', 'form', 1500), ('more', "agents'", 1060), ('more', "council's", 1300)):
    tap(dw(lid, word, -0.2), 0.0035, px(x))
thumb(D3, dw('twice', 'twice', -0.2), 0.5, 1.2)
pen(dw('twice', 'twice', -0.1), 0.5, 0.004, px(1000), 2)
chord((G2, Bb3, D4, G4), dw('walk', 'walk', -0.3), 0.45, step=0.22, ring=1.8)
thumb(G2, dw('walk', 'worst', -0.1), 0.55, 2.0)
sheet(dw('package', 'work', -0.3), 0.004, px(1170))
chord((F2, F3, A3, C4), dw('package', 'front', 0.0), 0.45, step=0.16, ring=1.2)
chord((Bb2, F3, Bb3, D4), dw('package', 'June', -0.1), 0.5, step=0.16, ring=2.0, until=E('doors'))

# 3. One front door: the door's latch and its opening; B-flat major, warm, as the light comes through it; the date's card and the form's;
#    a pen's stroke for each of the five questions; what it's for: nothing. The old doors closed kindly: their notes pinned, one soft rub
#    of paper; to data governance: one tap. Sixty-one requests onto one list: the papers drawn along, and the mark, whole; the duplicates
#    join their twins: one soft rub, and the thumb's D; no longer needed, with thanks: a tick, and F; forty-five left: B-flat major
LV[0] = 0.9
rw = lambda lid, word, off=0: W('door', lid, word, off)
rc = lambda lid, off=0: G('door', lid, off)
latch(rw('open', 'opens', -0.25), 0.005, px(325))
chord((Bb1, Bb2, D3, F3), rw('open', 'opens', 0.3), 0.5, step=0.2, ring=2.2)
sheet(S0('door') + 0.9, 0.004, px(780))
sheet(rw('open', 'form', -0.2), 0.004, px(1460))
for word in ('decision', 'By', 'Who', 'data', 'else'):
    pen(rw('five', word, -0.1), 0.3, 0.0035, px(1460), 1)
slide(rw('close', 'note', -0.3), 1.6, 0.0035, px(950))
tap(rw('gov', 'access', -0.2), 0.003, px(950))
g0 = rw('gather', 'sixty-one', -0.3)
slide(g0 + 0.2, 3.2, 0.0035, px(1300))
mark(g0 + 1.6, 0.55, 0, 0.3, 1.4, bass=((Bb2, 0, 1.4),))
slide(rw('twins', 'joins', -0.3), 1.4, 0.003, px(1615))
thumb(D3, rw('twins', 'joins', 0.2), 0.45, 1.0)
pen(rw('thanks', 'closed', -0.2), 0.24, 0.0035, px(1615), 2)
quill(F4, rw('thanks', 'thanks', 0.0), 0.4, 1.0, px(1615) * 0.4)
chord((Bb2, D3, F3, Bb3), rw('left', 'tracker', -0.2), 0.5, step=0.18, ring=2.0, until=E('door'))

# 4. Ordered in the open: Jena again, Larrey's order: the thumb's low G as the worst are carried in, then B-flat major as they're reached;
#    those hurt less can wait: nothing. Anil's card: a tap for each measure as it comes in; what waiting costs: the bracket drawn; divided
#    by the effort: the order written, and F major; near the top: one high B-flat. The dashboard's card; not now: the thumb's low G, and
#    its why and when written. Never by who asks, or how loudly: nothing. The board, open to all: the screen comes on, and E-flat major
LV[0] = 0.9
qw = lambda lid, word, off=0: W('order', lid, word, off)
qc = lambda lid, off=0: G('order', lid, off)
sheet(S0('order') + 0.8, 0.004, px(430))
thumb(G2, qw('rule', 'most', -0.1), 0.5, 1.6)
chord((Bb2, D3, F3, D4), qw('rule', 'first', 0.3), 0.45, step=0.18, ring=1.8)
sheet(qc('weigh', 0.3), 0.004, px(520))
for word in ('value', 'urgency', 'risk'):
    tap(qw('weigh', word, -0.2), 0.003, px(520))
pen(qw('cost', 'waiting', -0.2), 0.5, 0.0035, px(880), 2)
tap(qw('effort', 'effort', -0.2), 0.003, px(520))
pen(qw('effort', 'puts', -0.2), 0.5, 0.0035, px(300), 2)
chord((F2, C3, F3, A3), qw('effort', 'puts', 0.2), 0.45, step=0.16, ring=1.4)
quill(Bb4, qw('anil', 'top', -0.2), 0.45, 1.2, px(700) * 0.4)
sheet(qc('dash', -0.1), 0.004, px(1400))
thumb(G2, qw('dash', 'waits', -0.2), 0.5, 1.6)
pen(qw('dash', 'why', -0.2), 0.5, 0.0035, px(1300), 2)
pen(qw('dash', 'when', -0.1), 0.5, 0.0035, px(1300), 2)
glow(qc('board', 0.0), 0.004, px(960))
chord((Eb2, Bb2, G3, Bb3), qw('board', 'anyone', 0.0), 0.45, step=0.18, ring=2.2, until=E('order'))

# 5. Six at once: the team's time, a single note as each part comes in (B-flat, D, F, low to high); without the split: requests swell over
#    the rest, G minor, low. At most six in progress: the screen, and F major on "six"; Kanban: nothing; sooner: nothing. When one is done,
#    the top of the list moves in: a card slid along, a tick, and B-flat major: finish, then start
LV[0] = 0.9
sw = lambda lid, word, off=0: W('six', lid, word, off)
sc_ = lambda lid, off=0: G('six', lid, off)
sheet(sc_('split', 0.2), 0.004, px(960))
for word, m in (('half', Bb3), ('third', D4), ('rest', F4)):
    quill(m, sw('split', word, -0.1), 0.4, 0.8, px(960) * 0.4)
chord((G2, D3, Bb3), sw('why', 'take', -0.2), 0.45, step=0.2, ring=1.8)
glow(sc_('limit', 0.0), 0.004, px(960))
chord((F2, F3, C4), sw('limit', 'six', 0.0), 0.45, step=0.16, ring=1.4)
slide(sw('pull', 'moves', -0.3), 1.2, 0.0035, px(1100))
pen(sw('pull', 'moves', 0.9), 0.24, 0.0035, px(1300), 2)
chord((Bb2, F3, D4), sw('pull', 'Finish', 0.0), 0.5, step=0.16, ring=2.0, until=E('six'))

# 6. Not now, and when: the council's decision, its card, and D minor; the rooms' data, its card; near the top: one high B-flat. Clara:
#    her card, a tap for each measure; not now: the thumb's low G; its reason and its dates written; saying it well: nothing. Triage,
#    today: G minor as it comes in, then F major as the longest waits are drawn, each its own; not now always comes with a when: B-flat
LV[0] = 0.9
ww = lambda lid, word, off=0: W('when', lid, word, off)
wc = lambda lid, off=0: G('when', lid, off)
sheet(S0('when') + 0.9, 0.004, px(500))
chord((D3, A3, D4, F4), ww('council', 'timetable', 0.0), 0.45, step=0.18, ring=1.8)
sheet(ww('rooms', "registrar's", -0.3), 0.004, px(1380))
quill(Bb4, ww('rooms', 'top', -0.2), 0.45, 1.2, px(1380) * 0.4)
sheet(ww('clara', 'asks', -0.2), 0.004, px(1380))
for i in range(3):
    tap(ww('clara', 'model', 0.0) + 0.6 * i, 0.003, px(1380))
thumb(G2, ww('same', 'not now', -0.2), 0.5, 1.6)
for word in ("timetable's", 'current', 'new one'):
    pen(ww('reason', word, -0.2), 0.4, 0.0035, px(1300), 2)
sheet(wc('ats', 0.2), 0.004, px(960))
chord((G2, G3, Bb3, D4), wc('ats', 0.5), 0.45, step=0.2, ring=1.6)
chord((F2, A3, C4, F4), ww('ats', 'five', -0.1), 0.4, step=0.16, ring=1.4)
chord((Bb2, D3, F3, D4), ww('never', 'Not now', 0.0), 0.5, step=0.16, ring=2.2, until=E('when'))

# 7. On Monday: Larrey's design, framed on the team's wall: the mark, whole; the two pills: the thumb's D, then B-flat; each thing to do
#    on Monday set on the wall, a card each; and the close, over the board and into the end card: the mark an octave lower, its B-flat
#    left to ring with D and F above it
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
sheet(S0('monday') + 0.8, 0.004, px(440))
mark(mw('back', 'brought', 0.0), 0.5, 0, 0.3, 1.4, bass=((Bb2, 0, 1.2),))
thumb(D3, mw('helena', 'door', -0.2), 0.45, 1.0, px(1110) * 0.4)
thumb(Bb2, mw('helena', 'needed', -0.2), 0.45, 1.4, px(1110) * 0.4)
for lid, word, x in (('close', 'close', 400), ('close', 'ask', 960), ('order', None, 1520), ('time', None, 680), ('tell', None, 1240)):
    sheet(mw(lid, word, -0.2) if word else mc(lid, -0.1), 0.0035, px(x))
glow(mc('breath', -0.2), 0.004, px(960))
mark(mc('breath', 0.6), 0.5, -12, 0.32, 4.6, bass=((Bb1, 0, 2.0), (F2, 2, 4.6)), until=TOT)
chord((D3, F3), mc('breath', 0.62 + 0.32 * 2 + 0.4), 0.4, step=0.2, ring=4.0, until=TOT)
