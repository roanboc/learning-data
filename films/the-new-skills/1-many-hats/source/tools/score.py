# Many hats, one picture: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (palettes.md, 5 November 2026: a lead the setup thread reserved, which no score on main or on any
# branch has, and which no other module's palette names): a harpejji, made here, as music.py has none.
#  - The harpejji: steel strings laid flat across a board, tapped with the fingertips of both hands as on a keyboard, a string player's
#    sound under a pianist's hands: one player, two crafts. Each note is a string pressed onto its fret by a fingertip, which sets it
#    ringing from that point; it rings round and clear through the pickup, and stops when the finger lifts and the string's damper
#    takes it. Tapped and short, never strummed.
#  - Its partner, the thread's choice: the harpejji's own low strings under the left hand, each tapped with the side of the thumb and
#    damped by the palm a moment later: a round, wooden bass note, felt more than heard. One player, two hands, two crafts, as the film's
#    generalist is one person with depth in one thing and enough of the others to join them. Every other plucked or struck colour the
#    site lacks either belongs to another culture or sounds like one it has (the long list in the module's palettes.md), as Modern data
#    basics' film threads found too.
# The mark: three short figures in three registers that turn out to be one phrase. In the opening, each of the three jobs has its own
# figure, in its own register: the earth low (D, E, F sharp, under the left hand), the timber high (A, G, B), the rubble in the middle
# (C sharp, A, D). When Ding Wei's plan makes the three jobs one, they're played as one phrase, in one register: D E F# A G B C# A D.
# It comes back, each time in its own voicing, when Ding Wei sees the three as one, when Ivy sees at the join what no one part could,
# when the film comes back to Kaifeng, and at the close.
# D major, B minor for the opening's problem (the fire and the three jobs), and D major once the plan makes them one. Every chord is
# tuned pure from D (just intonation, see hz()): D, G and A major, B and F sharp minor are all pure in this table; E minor, and E with
# G or B, are not, and are never played or held together. The 14 rooms that don't match are the left hand's C, a note outside the chord,
# stopped short: in tune, never detuned, only not where it belongs. Nothing Chinese for Kaifeng: no pentatonic tune, no gong, no
# instrument of the place (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one string, steady, with no vibrato or bend, its partials harmonic; each damped before it
#    would ring into the next chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/mh_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
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
R1 = np.random.default_rng(1015)  # this film's own randomness: the room, the earth, the water, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major, and
# B and F sharp minor, are pure in this table; E minor, and E held with G or with B, are not, and never sound together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.41619 * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2, C3, Cs3, D3, E3, Fs3, G3, A3, B3 = 38, 42, 43, 45, 47, 48, 49, 50, 52, 54, 55, 57, 59
Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5, Fs5, G5, A5, B5 = 61, 62, 64, 66, 67, 69, 71, 73, 74, 78, 79, 81, 83

# ---- the levels: the right hand's taps and the left hand's thumb matched by loudness, as far under the voice as the module's other
# music; the effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LH, LL, FX = 0.052, 0.07, 3.2
LV = [1.0]

# a small room round the instrument, ringing on for about a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.014 * SR)] = 0; _IR /= _band(_IR)
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
def _thump(sec, n, f=320, d=0.006):
    """a fingertip pressing a string onto its fret: a little low noise, gone in a few thousandths of a second"""
    x = np.arange(n) / SR; th = filt(noise(sec + 0.02)[:n], 'low', f) * np.exp(-x / d)
    return th / max(1e-9, float(np.abs(th).max()))

# ---- a tapped string's partials: harmonic, each as strong as where the string is set ringing allows (it's tapped onto its fret, close
# to one end, so the low partials come in nearly alike) and as the pickup hears it (a pickup under a string hears little of the ways
# that keep still there: its comb, softened as two pickups blend), the higher ones softer and gone sooner. The seventh partial, out of
# tune with every note of a 5-limit scale, and the few above it that are, are kept low
_comb = lambda k, at: abs(np.sin(np.pi * k * at))
_ODD = {7: 0.2, 11: 0.35, 13: 0.35, 14: 0.2}
TAP, PICKUP = 0.06, 0.21
def _string(f0, x, t1, soft, top=2400):
    sig = np.zeros(len(x))
    for k in range(1, 40):
        fk = f0 * k
        if fk > top:
            break
        a = _comb(k, TAP) / (k * TAP * np.pi) / k ** 0.35 * (0.3 + 0.7 * _comb(k, PICKUP)) * np.exp(-(k - 1) / soft) * _ODD.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * fk * x + 0.4 * k) * np.exp(-x / (t1 / (1 + 0.5 * (k - 1))))
    return sig

def tapn(m, s, g=1.0, pan=None, ring=None, room=0.25, until=None):
    """the right hand: one string tapped onto its fret by a fingertip at s, so it rings from there, round and clear through the pickup;
    the finger lifts after ring seconds and the string's damper stops it"""
    f0 = hz(m); t1 = 2.0 * (220 / f0) ** 0.3; d = ring if ring else 1.2
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _string(f0, x, t1, 4.2 * (220 / f0) ** 0.45)
    sig *= (1 - np.exp(-x / 0.0022)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.035 * _thump(sec, n)
    sig = sig.astype(np.float32); sig = sig + 0.25 * filt(sig, 'band', (180, 420))   # the board, and the pickup's warmth
    sig = _until(_room(norm(filt(filt(sig, 'low', 2300), 'high', 70)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LH, max(-0.35, min(0.35, (m - 66) * 0.02)) if pan is None else pan)

def low(m, s, g=1.0, pan=None, ring=None, room=0.2, until=None):
    """the left hand: a low string tapped with the side of the thumb, softer at its start, and damped by the palm after ring seconds: a
    round bass note with few high partials, felt more than heard"""
    f0 = hz(m); t1 = 2.4 * (98 / f0) ** 0.3; d = ring if ring else 1.0
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _string(f0, x, t1, 2.4, 1500)
    sig *= (1 - np.exp(-x / 0.004)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.05 * _thump(sec, n, 220, 0.01)
    sig = sig.astype(np.float32); sig = sig + 0.35 * filt(sig, 'band', (90, 200))   # the board under the low strings
    sig = _until(_room(norm(filt(filt(sig, 'low', 1500), 'high', 45)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LL, -0.15 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.12, ring=2.2, until=None, lowest=True):
    """a chord tapped from its lowest string up, the lowest by the left hand's thumb when it's low, each finger lifting together at the
    end so the strings stop as one"""
    for i, m in enumerate(notes):
        r = max(0.4, ring - step * i)
        (low if (lowest and i == 0 and m < A3) else tapn)(m, s + step * i, g, None, r, until=until)
def figure(notes, s, g=1.0, step=0.22, ring=0.5, last=None, hand=None, until=None):
    """a short figure, a note at a time, each lifted before the next but one, so nothing that isn't pure rings together"""
    k = len(notes)
    for i, m in enumerate(notes):
        r = last if (last and i == k - 1) else ring
        (hand or (low if m < A3 else tapn))(m, s + step * i, g, None, r, until=until)
PHRASE = (D4, E4, Fs4, A4, G4, B4, Cs5, A4, D5)       # the mark, whole
FIG_EARTH, FIG_TIMBER, FIG_RUBBLE = (D3, E3, Fs3), (A5, G5, B5), (Cs4, A3, D4)   # its three figures, each in its own register
def mark(notes, s, g=1.0, step=0.2, ring=0.55, last=2.4, bass=(), until=None):
    """the mark: the phrase in one register, and the left hand's notes under it, each at the place in the phrase it's given"""
    figure(notes, s, g, step, ring, last, tapn, until)
    for m, i, r in bass:
        low(m, s + step * i, 0.9 * g, None, r, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.006, pan=0.0):
    """a card laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a card slid along, or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def spade(s, g=0.006, pan=0.0):
    """a spade driven into earth: a low, dull thud, and the soil's short hiss as it gives"""
    n = int(0.45 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 85, 0.05) + 0.3 * filt(noise(0.47)[:n], 'band', (150, 900)) * _bump(x, 0.25, 1.2) * (x < 0.25), s, g, pan, 1100)
def water(s, sec=2.6, g=0.005, pan=0.0):
    """water let into a trench: one soft, low rush that swells in and settles, never a burst of drops"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 4); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (120, 800)) * _bump(x, sec, 1.1) * gr, s, g, pan, 900)
def rumble(s, sec=3.0, g=0.004, pan=0.0):
    """carts on a road, far off: one soft, low texture of wheels that swells and fades, not a clatter of single knocks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 7); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (70, 420)) * _bump(x, sec, 1.3) * gr, s, g, pan, 600)
def raft(s, g=0.006, pan=0.0):
    """a raft's timbers touching the stone at the gate: a hollow wooden knock, low"""
    n = int(0.35 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 120, 0.045) + 0.5 * _knock(n, 180, 0.03, 0.05) + 0.1 * filt(noise(0.37)[:n], 'band', (200, 700)) * np.exp(-x / 0.02), s, g, pan, 1200)
def tip(s, sec=1.1, g=0.005, pan=0.0):
    """rubble tipped into a trench: a low, soft slither of earth and broken tile, one sound that pours and stops"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (100, 700)) * _bump(x, sec, 0.8) + 0.5 * _knock(n, 95, 0.06, sec * 0.7), s, g, pan, 900)

# =============================================================================================================================
# 1. One move, three jobs: the opening, the module's story from outside data. Kaifeng, 1015: the left hand's low D, alone, then D major
#    as the city comes in. The fire: B minor, low. The burned buildings, their cards laid down; Ding Wei's card; the three jobs, each
#    with its figure in its own register as its route is drawn across the city: the earth low, the timber high, the rubble in the middle.
#    The carts' far-off rumble as the routes cross the crowded city, and B minor once more, low, gone before "Something has to change",
#    which has nothing under it. The plan: the three figures as one phrase, the mark, as the three routes become one line. The streets
#    dug: a spade, twice; the canal's water let in; a raft's knock at the palace gate under G major; the rubble tipped in, and D major as
#    the streets are streets again. Shen Kuo's card; the saving, A major, and D as the city gets its streets back. The diggers, the
#    boatmen and the carters, a card each, and the mark again, low, in octaves, as Ding Wei sees the three as one; one high D as the
#    film finds what falls between the parts; and D major, held, under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('trench', lid, word, off)
oc = lambda lid, off=0: G('trench', lid, off)
END = E('trench')
low(D2, 0.5, 0.85, 0.0, ring=3.4)
chord((D3, A3, D4, Fs4), ow('when', 'Kaifeng', 0.2), 0.7, step=0.17, ring=3.0)
card(ow('when', 'year', -0.2), 0.004, px(420))
chord((B2, Fs3, B3, D4), ow('fire', 'fire'), 0.65, step=0.16, ring=2.6)
for w, x in (('gates', 612), ('hall', 902), ('treasury', 1180), ('library', 1520)):
    card(ow('burns', w, 0.1), 0.0035, px(x))
card(ow('ding', 'Ding', -0.1), 0.004, px(900))
chord((G2, D3, G3, B3), ow('ding', 'charge'), 0.55, step=0.15, ring=2.2)
# the three jobs, each a route across the city with its own figure: the earth from far off, low; the timber from the docks, high; the
# rubble carted out, in the middle
card(oc('cost', -0.1), 0.0035, px(1400))
figure(FIG_EARTH, ow('earth', 'dug', 0.1), 0.75, step=0.24, ring=0.55, last=1.2)
figure(FIG_TIMBER, ow('timber', 'hauled', 0.1), 0.6, step=0.22, ring=0.5, last=1.1)
figure(FIG_RUBBLE, ow('rubble', 'carted', 0.1), 0.65, step=0.22, ring=0.5, last=1.2)
rumble(ow('cost', 'carts', -0.2), 3.2, 0.004, px(960))
chord((B2, D3, Fs3, B3), ow('cost', 'slow'), 0.5, step=0.2, ring=2.4, until=oc('change', -0.4))
# the plan: the three routes become one line, and the three figures one phrase: the mark, the left hand's D, A and D under it
mark(PHRASE, ow('plan', 'makes', -0.1), 0.75, step=0.2, ring=0.5, last=2.6, bass=((D2, 0, 1.6), (A2, 3, 1.0), (D3, 8, 2.6)))
# the streets dug: a spade, and again as the trench deepens; the canal's bank broken and its water let in
spade(ow('dig', 'dug', -0.1), 0.006, px(820)); spade(ow('dig', 'trenches', -0.3), 0.005, px(1100))
water(ow('canal', 'lets', -0.2), 2.8, 0.005, px(700))
low(A2, ow('canal', 'breaks', 0.1), 0.6, None, ring=1.6)
# rafts and boats float up to the palace gate, and a raft's timbers touch its stone: G major, as the work comes to the door
chord((G3, B3, D4, G4), ow('boats', 'float', -0.1), 0.55, step=0.14, ring=2.0)
raft(ow('boats', 'gate', 0.2), 0.006, px(1420))
# the rubble tipped into the trenches, and the streets are streets again: D major
tip(ow('fill', 'rubble', -0.2), 1.2, 0.005, px(960))
chord((D3, Fs3, A3, D4), ow('fill', 'again', -0.1), 0.6, step=0.15, ring=2.4)
# Shen Kuo's card and his words; the saving, A major, and D as the city gets its streets back
card(oc('shen', 0.1), 0.0035, px(500)); card(ow('shen', 'Shen', -0.2), 0.004, px(1430))
chord((A2, E3, A3, Cs4), ow('saving', 'saving'), 0.55, step=0.14, ring=1.8)
card(ow('saving', 'hundreds', -0.1), 0.0035, px(960))
chord((D3, A3, Fs4, D4), ow('saving', 'streets', -0.1), 0.55, step=0.12, ring=2.2)
# the diggers, the boatmen and the carters, a card each; Ding Wei saw the three as one: the mark, low, the two hands in octaves
for w, x in (('diggers', 420), ('boatmen', 960), ('carters', 1500)):
    card(ow('one', w, 0.05), 0.0035, px(x))
one = ow('one', 'one', -0.2)
figure((D3, E3, Fs3, A3, G3, B3, Cs4, A3, D4), one, 0.6, 0.22, 0.45, 2.2, tapn)
figure((D2, Fs2, G2, A2, D3), one, 0.55, 0.44, 0.6, 2.2, low)
# what falls between the parts: one high D; the title, D major, held, damped before the next chapter
tapn(D5, ow('see', 'between', 0.1), 0.5, 0.1, ring=2.0)
chord((D2, A2, D3, Fs3, A3, D4), oc('breath', 0.3), 0.7, step=0.18, ring=4.6, until=END)

# 2. One question to follow: the university, a year from now: the chapter turns on G major, and the module's promise laid down. Ivy's
#    card, and the left hand's low D under her depth; Helena's card, then the card of her one role, and one D in both hands at once, two
#    octaves apart, under "one role" (two sides of one role); her plan for Ivy's month; Graham's cards; his question, and B and D
#    together, a question left open; Ivy's goals written, Helena's agreement set down; the first, and A, D and F sharp rising
LV[0] = 0.9
qw = lambda lid, word, off=0: W('question', lid, word, off)
qc = lambda lid, off=0: G('question', lid, off)
chord((G2, B2, D3, G3), S0('question') + 0.2, 0.6, step=0.16, ring=2.4)
card(S0('question') + 1.0, 0.004, px(960))
card(qw('ivy', 'Ivy', -0.1), 0.004, px(1320))
low(D2, qw('depth', 'statistics', -0.1), 0.7, None, ring=2.0)
card(qc('helena', 0.4), 0.004, px(990))
card(qw('role', 'managing', -0.2), 0.0035, px(990))
low(D2, qw('role', 'one', -0.05), 0.6, None, ring=1.8); tapn(D4, qw('role', 'one', -0.05), 0.45, None, ring=1.8)
card(qw('month', 'month', -0.1), 0.0035, px(990))
card(qw('graham', 'Graham', -0.1), 0.004, px(1320)); card(qw('graham', 'Council', -0.2), 0.0035, px(1320))
card(qw('q', 'question', -0.1), 0.004, px(1320))
chord((B3, D4), qw('q', 'hours', 0.4), 0.55, step=0.2, ring=1.8)
pen(qw('goals', 'writes', -0.1), 0.8, 0.005, px(1260), 4)
tap(qw('goals', 'agrees', -0.1), 0.004, px(1260))
figure((A3, D4, Fs4), qw('first', 'route', 0.1), 0.55, step=0.2, ring=0.6, last=1.6, hand=tapn)

# 3. A few days with each: each person's card as Ivy meets them, and one note of D major's chord for each, a string apiece, low to high
#    (Mei D, Sam F sharp, Yusuf A, Noor D, Jun F sharp), panned where each card is on screen; the hour a day with Jun; the two films'
#    cards; the question's card, and the five notes together, as she asks each the same question
LV[0] = 0.9
pw = lambda lid, word, off=0: W('parts', lid, word, off)
pc = lambda lid, off=0: G('parts', lid, off)
for lid, name, word, m, x in (('mei', 'Mei', 'timetable', D3, 300), ('sam', 'Sam', 'sensor', Fs3, 446), ('yusuf', 'Yusuf', 'never', A3, 920),
                              ('noor', 'Noor', 'map', D4, 960), ('jun', 'Jun', 'trust', Fs4, 1555)):
    card(pw(lid, name, -0.1), 0.0035, px(x))
    (low if m < A3 else tapn)(m, pw(lid, word, 0.1), 0.6, px(x) * 0.4, ring=1.8)
card(pc('pair', 0.5), 0.0035, px(960))
card(pw('films', 'moves', -0.2), 0.0035, px(640)); card(pw('films', 'drawn', -0.2), 0.0035, px(1280))
card(pw('ask', 'who', -0.1), 0.0035, px(960))
chord((D3, Fs3, A3, D4, Fs4), pw('ask', 'decision', 0.2), 0.55, step=0.13, ring=2.6)

# 4. The whole route, on one page: the chapter turns on D, low; Ivy draws each layer of her page, a pen's strokes each time; the rule's
#    pill laid down; at the join, the mark, in the middle, with the left hand's B and D under it; 172 rooms that match, a tick; the 14
#    that don't, the left hand's C, outside the chord, stopped short; nothing as they drop out without a word; 172, not 186, laid down;
#    and G major, then D, as the timetable and the sensors are put side by side
LV[0] = 0.9
gw = lambda lid, word, off=0: W('page', lid, word, off)
gc = lambda lid, off=0: G('page', lid, off)
low(D2, S0('page') + 0.2, 0.6, None, ring=2.2)
pen(gw('draw', 'draws', -0.1), 0.9, 0.005, px(1100), 4)
for lid, word in (('decision', 'decision'), ('question', 'question'), ('data', 'data'), ('born', 'born'), ('keeps', 'keeps')):
    pen(gw(lid, word, -0.1), 0.6, 0.0045, px(1100), 3)
tap(gw('keeps', 'rule', -0.1), 0.0035, px(1394))
mark(PHRASE, gw('join', 'sees', -0.1), 0.6, step=0.18, ring=0.45, last=2.0, bass=((B2, 0, 1.0), (G2, 3, 1.0), (A2, 6, 0.9), (D3, 8, 2.0)))
ticked(gw('names', '172', 0.4), 0.0045, px(960))
low(C3, gw('fourteen', '14', 0.1), 0.75, None, ring=0.35, room=0.12)
card(gw('drop', '172', -0.2), 0.0035, px(960))
chord((G2, D3, G3, B3), gw('nobody', 'side', -0.2), 0.5, step=0.14, ring=1.4)
chord((D3, Fs3, A3, D4), gw('nobody', 'side', 1.0), 0.5, step=0.14, ring=2.4, until=E('page'))

# 5. Deep in one, enough of the rest: the chapter turns on F sharp minor; the T drawn: its deep stroke, the left hand's low D, long, and
#    its wide bar, a chord spread across the strings; the frameworks' cards; Range's card; the tangle drawn; the 14 rooms matched, a
#    tick, and A major; someone sees across them: D major, from the lowest string to the highest
LV[0] = 0.9
hw = lambda lid, word, off=0: W('shape', lid, word, off)
chord((Fs2, Cs3, Fs3, A3), S0('shape') + 0.2, 0.5, step=0.16, ring=2.0)
low(D2, hw('t', 'deep', 0.0), 0.75, None, ring=2.4)
chord((A3, D4, Fs4, A4), hw('t', 'wide', -0.1), 0.55, step=0.09, ring=1.8, lowest=False)
card(hw('t', 'name', -0.3), 0.0035, px(960))
card(G('shape', 'lists', 0.2), 0.004, px(580)); card(hw('lists', 'DAMA', -0.1), 0.0035, px(1360))
card(hw('range', 'Range', -0.1), 0.004, px(1350))
slide(hw('messy', 'messy', -0.2), 1.2, 0.0035, px(540))
ticked(hw('essential', 'matched', 0.2), 0.0045, px(1124))
chord((A2, Cs3, E3, A3), hw('essential', 'day', 0.0), 0.5, step=0.14, ring=1.8)
chord((D2, A2, Fs3, D4, A4), hw('across', 'across', 0.0), 0.55, step=0.16, ring=2.6, until=E('shape'))

# 6. From her page: a tick as Ivy's first goal is met, and D, F sharp and A; the team takes up the question from her page: G major,
#    high; the catalog draws its lineage, a line slid out; and one D as the decision and the question stay on Ivy's page
LV[0] = 0.9
kw = lambda lid, word, off=0: W('kept', lid, word, off)
ticked(kw('goal', 'met', 0.0), 0.0045, px(340))
figure((D4, Fs4, A4), kw('goal', 'route', 0.1), 0.5, step=0.16, ring=0.7, last=1.6, hand=tapn)
card(G('kept', 'team', 0.3), 0.0035, px(960))
chord((G3, D4, G4, B4), kw('team', '186', 0.1), 0.5, step=0.14, ring=1.8, lowest=False)
slide(kw('catalog', 'draws', -0.1), 1.6, 0.004, px(670))
card(kw('cant', 'decision', -0.2), 0.0035, px(1540))
tapn(D4, kw('cant', 'page', 0.1), 0.5, px(1540) * 0.4, ring=2.2)

# 7. On Monday: Kaifeng comes back, framed on the wall: the three figures, each in its register, as the three jobs are named; the mark as
#    Ivy saw the parts as one; each piece of advice laid down; and the close, the mark an octave higher, from D, its last note held as
#    D major into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
figure((D3, E3, Fs3), mw('back', 'dig', 0.0), 0.5, step=0.2, ring=0.45, last=0.8, hand=low)
figure((A4, G4, B4), mw('back', 'float', 0.0), 0.45, step=0.18, ring=0.4, last=0.8, hand=tapn)
figure((Cs5, A4, D5), mw('back', 'cart', 0.0), 0.45, step=0.18, ring=0.4, last=1.4, hand=tapn)
mark(PHRASE, mw('ivy', 'one', -0.2), 0.55, step=0.17, ring=0.4, last=1.8,
     bass=((D2, 0, 1.0), (Fs2, 2, 0.8), (G2, 4, 0.8), (A2, 6, 0.8), (D3, 8, 1.8)))
card(mc('depth', 0.3), 0.0035, px(400))
for lid, word, x in (('words', 'words', 960), ('route', 'route', 1520), ('ask', 'Ask', 960)):
    card(mw(lid, word, -0.1), 0.0035, px(x))
mark(tuple(m + 12 for m in PHRASE), mw('take', 'whole', 0.1), 0.5, step=0.24, ring=0.5, last=5.0,
     bass=((D2, 0, 2.0), (A2, 3, 1.2), (D3, 8, 5.0)), until=TOT)
chord((Fs3, A3, D4), mw('take', 'whole', 0.1 + 0.24 * 8), 0.5, step=0.0, ring=5.0, until=TOT, lowest=False)
