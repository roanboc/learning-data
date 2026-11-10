# Owning the outcome: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (palettes.md, 5 November 2026: a lead the setup thread reserved, which no score on main or on any
# branch has, and which no other module's palette names): a daxophone, made here, as music.py has none.
#  - The daxophone: a thin wooden tongue clamped to a block at one end and bowed at the other, its note set by where a small wooden
#    block, held in the other hand, presses on it; a contact pickup in the block hears it. Bowed, the tongue speaks like a voice, which
#    is why it can sound comic: here it is played plainly, each note found and held still, warm and short. No slide but the mark's.
#  - Its partner, the thread's choice: a second, longer and thicker tongue, bowed in short strokes low down, a round wooden bass note
#    with few high partials. The same instrument, cut for another register. Every plucked or struck colour the site lacks either belongs
#    to another culture or sounds like one it has (the module's palettes.md), and a plucked wooden tongue would sound like an African
#    lamellophone, which this film must not borrow (nothing Kenyan for the Green Belt). A bowed note is a note kept alive by the bow,
#    which carries the film's idea: a planted seedling is a short sound that dies; a living tree is a note held.
# The mark: B, D, then G, which wavers into place once, then stays: a seedling that takes. It is played where the story turns: when the
#    women are paid for each tree still alive, under the title card, at the seedling that earned nothing until it lived, when the film
#    comes back to the Green Belt, and at the close, held into the end card.
# G major, E minor for the problem (the streams drying, the counts that drop). Every chord is tuned pure from G (just intonation, see
#    hz()): G, C and D major, E and B minor are pure in this table; A minor, and A held with E or with C, are not, and never sound
#    together. Nothing Kenyan for the Green Belt: no Kenyan tune, rhythm, drum or instrument (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one tongue, steady, with no vibrato, its partials harmonic (a bowed note is periodic); each
#    stopped before it would ring into the next chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/oo_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1977)  # this film's own randomness: the room, the bow, the rain, the paper

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. G, C and D major, and
# E and B minor, are pure in this table; A minor, and A held with E or with C, are not, and never sound together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 43, 12)
    return 97.99886 * 2 ** o * _JI[pc]
E2, G2, A2, B2, C3, D3, E3, Fs3, G3, A3, B3 = 40, 43, 45, 47, 48, 50, 52, 54, 55, 57, 59
C4, D4, E4, Fs4, G4, A4, B4, C5, D5 = 60, 62, 64, 66, 67, 69, 71, 72, 74

# ---- the levels: the bowed lead and the low tongue matched by loudness, as far under the voice as the module's other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LD, LB, FX = 0.048, 0.067, 4.0
LV = [1.0]

# a small wooden room round the players, ringing on for about a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry, over its held body
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.95)).astype(np.float32))(np.arange(int(0.95 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.013 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), as a room lifts some pitches and
    hollows others, and every held note should sound as loud as its neighbours"""
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

# ---- a bowed wooden tongue. Bowed, it moves the way the bow drives it, so its partials are harmonic, a saw-like series; the tongue and
# its block colour them with two soft, woody resonances, and the contact pickup hears little above 2 kHz. The bow takes a moment to catch:
# the fundamental speaks first, the upper partials a few hundredths of a second later. Held, it is still: no vibrato, no swell. When the
# bow lifts, the wood stops it within a tenth of a second. The seventh partial and the few above it that are out of tune with a 5-limit
# scale are kept low
_ODD = {7: 0.25, 11: 0.35, 13: 0.35, 14: 0.25}
def _wood(f):
    """the tongue and its block: a warm resonance low in the voice, a smaller one above it, and little past 2 kHz"""
    return 0.45 + 1.0 * np.exp(-((f - 470) / 230) ** 2) + 0.4 * np.exp(-((f - 1250) / 360) ** 2)
def _bowed(f0, x, cents=None, soft=8.0, top=2300):
    """the bowed tongue's partials at f0; cents (optional, an array as long as x) bends the pitch, for the mark's one waver"""
    ph = 2 * np.pi * f0 * x if cents is None else 2 * np.pi * np.cumsum(f0 * 2 ** (cents / 1200)) / SR
    sig = np.zeros(len(x))
    for k in range(1, 40):
        fk = f0 * k
        if fk > top:
            break
        a = _wood(fk) / k * np.exp(-(k - 1) / soft) * _ODD.get(k, 1.0)
        sig += a * np.sin(k * ph + 0.45 * k) * (1 - np.exp(-x / (0.035 + 0.006 * k)))
    return sig
def _rosin(sec, n):
    """the bow on the wood: a little band-limited hiss, strongest as the bow catches, then faint and even"""
    x = np.arange(n) / SR; r = filt(noise(sec + 0.02)[:n], 'band', (500, 1700))
    return r / max(1e-9, float(np.abs(r).max())) * (0.012 + 0.05 * np.exp(-x / 0.05))

def dax(m, s, g=1.0, pan=None, ring=1.0, room=0.25, until=None, waver=False):
    """the lead: one tongue bowed at s and held for ring seconds, then the bow lifted. waver: the mark's last note, which comes in a
    little flat, rises just past its pitch and settles there once, within half a second, and then stays still"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.15, until - s - 0.3))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    cents = -55 * np.exp(-x / 0.13) * np.cos(2 * np.pi * x / 0.52) if waver else None
    sig = _bowed(f0, x, cents, 8.0 * (196 / f0) ** 0.3)
    sig *= np.minimum(1, x / 0.07) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.08))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + _rosin(sec, n) * np.where(x < d, 1.0, 0.0)
    sig = sig.astype(np.float32)
    sig = _until(_room(norm(filt(filt(sig, 'low', 2200), 'high', 70)), room, min(0.3, d * 0.3), max(min(0.3, d * 0.3) + 0.1, d)), s, until)
    put(sig, s, g * LV[0] * LD, max(-0.35, min(0.35, (m - 64) * 0.02)) if pan is None else pan)

def low(m, s, g=1.0, pan=None, ring=0.6, room=0.2, until=None):
    """the partner: the longer, thicker tongue bowed in one short stroke low down, a round wooden bass note with few high partials"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _bowed(f0, x, None, 3.0, 1300)
    sig *= np.minimum(1, x / 0.06) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.1))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.6 * _rosin(sec, n) * np.where(x < d, 1.0, 0.0)
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (90, 220))   # the block under the long tongue
    sig = _until(_room(norm(filt(filt(sig, 'low', 1300), 'high', 40)), room, min(0.3, d * 0.3), max(min(0.3, d * 0.3) + 0.1, d)), s, until)
    put(sig, s, g * LV[0] * LB, -0.12 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.1, ring=2.0, until=None, lowest=True):
    """a chord: several tongues, each cut for its register, bowed together from the lowest up, the lowest on the long tongue when it's
    low, the bows lifted together"""
    for i, m in enumerate(notes):
        r = max(0.4, ring - step * i)
        (low if (lowest and i == 0 and m < A3) else dax)(m, s + step * i, g, None, r, until=until)
def figure(notes, s, g=1.0, step=0.3, ring=0.4, last=None, hand=None, until=None):
    """a short figure, a note at a time, each bow lifted before the next begins"""
    k = len(notes)
    for i, m in enumerate(notes):
        r = last if (last and i == k - 1) else ring
        (hand or (low if m < A3 else dax))(m, s + step * i, g, None, r, until=until)
MARK = (B3, D4, G4)
def mark(s, g=1.0, step=0.34, last=2.4, octave=0, bass=(), until=None):
    """the mark: B, D, then G, which wavers into place once and stays; the long tongue's notes under it, each at the place it's given"""
    b, d_, gg = (m + 12 * octave for m in MARK)
    dax(b, s, g, None, 0.26, until=until); dax(d_, s + step, g, None, 0.26, until=until)
    dax(gg, s + 2 * step, g, None, last, until=until, waver=True)
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

def card(s, g=0.004, pan=0.0):
    """a sheet pinned to the wall, or a card laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0035, pan=0.0):
    """something small set down, a pill on a screen or a tag: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """a line drawn out on a chart, or struck through a row: a dry, even rub that eases off"""
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
def rain(s, sec=4.0, g=0.004, pan=0.0):
    """rain on bare earth, and the water running off it: one soft, low hiss that swells in and settles, never a patter of drops"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 3); gr = 0.8 + 0.2 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (220, 1300)) * _bump(x, sec, 0.9) * gr, s, g, pan, 1500)
def leaves(s, sec=2.4, g=0.0035, pan=0.0):
    """the wind in young trees on a hillside: one soft, breathy texture that swells in and settles"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 2); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1600)) * _bump(x, sec, 1.2) * gr, s, g, pan, 1700)

# =============================================================================================================================
# 1. Trees still standing: the opening, the module's story from outside data. Kenya, the 1970s: the long tongue's low G alone, then
#    G major as the hills come in; the women tell Maathai what's going wrong, a short figure as they come; E minor, low, as the streams dry
#    up; a falling figure as the forests are cleared; C major, plain, for choices that each made sense; the rain on the bare slope, one
#    soft texture; B minor, low, as the harm falls first on the women, gone before "Something had to change", which has nothing under it.
#    1977: G major as the movement starts; a rising figure as the seedlings grow in the nurseries; the mark, as the women are paid for each
#    tree still alive; D major, then G, for living trees, not the planting. Years later, G major spread wide over the green hills, and the
#    wind in their young trees; a note for each of fuel, food and shelter; D major under the Nobel Prize. The team's room, the long
#    tongue's G; and the mark again, with G major held, under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('trees', lid, word, off)
oc = lambda lid, off=0: G('trees', lid, off)
END = E('trees')
low(G2, 0.5, 0.8, 0.0, ring=2.6)
chord((G3, B3, D4), ow('when', 'Kenya', 0.25), 0.65, step=0.16, ring=2.6)
card(ow('when', 'Kenya', -0.2), 0.0035, px(430))
figure((B3, D4, E4), ow('women', 'rural', 0.1), 0.6, step=0.3, ring=0.38, last=0.9)
chord((E3, G3, B3), ow('streams', 'drying', -0.1), 0.55, step=0.16, ring=2.4)
card(ow('streams', 'streams', -0.3), 0.0035, px(540))
figure((E4, D4, B3), ow('cleared', 'cleared', 0.05), 0.5, step=0.32, ring=0.36, last=0.9)
chord((C4, E4, G4), ow('sense', 'sense', 0.0), 0.45, step=0.14, ring=1.8)
rain(ow('soil', 'washed', -0.6), 4.2, 0.004, px(1040))
chord((B2, D3, Fs3), ow('harm', 'harm', 0.0), 0.55, step=0.16, ring=2.4, until=oc('change', -0.4))
chord((G2, D3, G3, B3), ow('start', 'Green', 0.0), 0.6, step=0.15, ring=2.4)
card(ow('start', 'nineteen', -0.2), 0.0035, px(960))
figure((G3, A3, B3, D4), ow('nursery', 'seedlings', 0.0), 0.5, step=0.34, ring=0.4, last=1.0)
ticked(ow('paid', 'alive', -0.1), 0.004, px(1050))
mark(ow('paid', 'alive', 0.15), 0.6, last=2.4, bass=((G2, 2, 1.4),))
chord((D3, Fs3, A3), ow('answer', 'living', 0.0), 0.5, step=0.14, ring=1.2)
chord((G3, B3, D4), ow('answer', 'living', 1.3), 0.5, step=0.12, ring=1.6)
chord((G2, D3, B3, G4), oc('fifty', 0.1), 0.55, step=0.2, ring=2.6)
leaves(oc('fifty', 0.4), 2.6, 0.003, px(960))
for word, m, x in (('fuel', C4, 980), ('food', E4, 1200), ('shelter', G4, 1440)):
    dax(m, ow('give', word, 0.0), 0.5, px(x) * 0.4, ring=0.5)
card(ow('nobel', 'two', -0.2), 0.0035, px(960))
chord((D3, A3, D4, Fs4), ow('nobel', 'Nobel', 0.0), 0.5, step=0.14, ring=2.0)
low(G2, oc('data', 0.3), 0.6, None, ring=1.4)
tap(ow('data', 'job', -0.1), 0.003, px(1290))
card(ow('data', 'report', -0.2), 0.0035, px(460))
mark(oc('breath', 0.3), 0.6, last=4.2, bass=((G2, 0, 1.2), (D3, 2, 4.2)), until=END)
chord((B3, D4), oc('breath', 0.3 + 0.34 * 2 + 0.6), 0.45, step=0.0, ring=3.4, until=END)

# 2. What she owns: the university, a year from now: the chapter turns on C major, low, and Ivy's sheet; the data mesh's sheet; G major
#    as what Ivy owns comes clear: the timetable change, judged on true counts; one D, held, as the one A comes in; D major under the
#    authority to match
LV[0] = 0.9
qw = lambda lid, word, off=0: W('owns', lid, word, off)
qc = lambda lid, off=0: G('owns', lid, off)
chord((C3, G3, C4, E4), S0('owns') + 0.3, 0.5, step=0.16, ring=2.0)
card(qw('owner', 'Ivy', -0.2), 0.0035, px(580))
card(qw('mesh', 'Zhamak', -0.2), 0.0035, px(580))
chord((G3, D4, G4), qw('truly', 'judged', 0.0), 0.5, step=0.14, ring=1.8)
dax(D4, qw('one', 'accountable', -0.3), 0.55, px(1085) * 0.4, ring=1.6)
chord((D3, Fs3, A3, D4), qw('helena', 'authority', 0.0), 0.45, step=0.13, ring=1.6, until=E('owns'))

# 3. A Monday that looked fine: G major, light, at the chapter's turn; the screen's two pills, a soft tap each; at the Green Belt, the
#    mark, as the seedling lives; E minor, low, as the counts drop; B minor as the rooms that classes use would be released; Ivy's pen;
#    and D major rising to G as she says it first
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
chord((G3, B3, D4, G4), S0('monday') + 0.25, 0.45, step=0.12, ring=1.6)
tap(mw('ran', 'runs', -0.1), 0.003, px(386))
tap(mw('ran', 'check', -0.1), 0.003, px(406))
mark(mw('seedling', 'lived', -0.1), 0.5, last=2.0, bass=((G2, 2, 1.2),))
chord((E3, B3, E4, G4), mw('drop', 'dropped', -0.1), 0.5, step=0.15, ring=2.2)
chord((B2, Fs3, B3, D4), mw('release', 'release', 0.0), 0.5, step=0.15, ring=2.0)
pen(mw('writes', 'ten', -0.2), 1.0, 0.0045, px(630), 4)
figure((D4, Fs4, G4), mw('first', 'first', 0.0), 0.45, step=0.26, ring=0.34, last=1.6, hand=dax)

# 4. Fix it, or raise it: the chapter turns on the long tongue's D; the rows struck through; the hour's highest kept, a figure that
#    settles; Jun's review, a tick; the days run again, the line drawn, and G major for the right counts; the rule's sheet; the check:
#    the long tongue's E as today's count falls, then D major as the refresh is held
LV[0] = 0.9
fw = lambda lid, word, off=0: W('fix', lid, word, off)
fc = lambda lid, off=0: G('fix', lid, off)
low(D3, S0('fix') + 0.3, 0.6, None, ring=1.4)
slide(fw('step', 'kept', 0.1), 0.6, 0.0035, px(330))
figure((Fs4, E4, G4), fw('fix', 'highest', 0.0), 0.45, step=0.26, ring=0.34, last=1.4, hand=dax)
ticked(fw('review', 'every', -0.1), 0.004, px(530))
slide(fw('rerun', 'run', -0.1), 1.8, 0.0035, px(620))
chord((G2, D3, B3, G4), fw('rerun', 'right', 0.0), 0.5, step=0.16, ring=2.0)
card(fw('raise', 'From', -0.2), 0.0035, px(510))
low(E3, fw('holds', 'drop', 0.2), 0.6, px(810) * 0.4, ring=0.6)
chord((D3, A3, D4, Fs4), fw('holds', 'holds', 0.0), 0.45, step=0.13, ring=1.8, until=E('fix'))

# 5. Nobody to blame: B and G at the chapter's turn, low and open; the three parts' sheets; the ticks; E minor at the joins that failed;
#    Dekker's sheet; G major when saying it early is safe; the account's sheet
LV[0] = 0.9
bw = lambda lid, word, off=0: W('blame', lid, word, off)
bc = lambda lid, off=0: G('blame', lid, off)
chord((G2, B3), S0('blame') + 0.25, 0.45, step=0.2, ring=1.8)
for word, x in (('Facilities', 390), ('platform', 960), ('step', 1530)):
    card(bw('each', word, -0.2), 0.0035, px(x))
ticked(bw('fit', 'right', -0.1), 0.004, px(960))
chord((E3, B3, G4), bw('fit', 'fit', -0.3), 0.45, step=0.16, ring=1.8)
card(bw('dekker', 'Sidney', -0.2), 0.0035, px(960))
chord((G3, D4, G4, B4), bw('safe', 'safe', 0.0), 0.45, step=0.13, ring=1.8)
card(bw('account', 'accountable', -0.2), 0.0035, px(960))

# 6. On Monday: back at the Green Belt, the mark, low, the trees still standing; Ivy's true counts, D major; each piece of advice, a sheet
#    pinned; and the close, the mark again, its G held as G major into the end card
LV[0] = 0.9
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
mark(cw('back', 'trees', 0.0), 0.45, last=1.8, octave=-1, bass=((G2, 2, 1.4),))
chord((D3, Fs3, A3), cw('ivy', 'true', 0.0), 0.45, step=0.14, ring=1.4)
card(cc('know', 0.3), 0.0035, px(530))
for lid, word, x in (('watch', 'Watch', 1390), ('say', 'say', 530), ('mend', 'Fix', 1390)):
    card(cw(lid, word, -0.1), 0.0035, px(x))
mark(cw('take', 'Own', 0.1), 0.5, last=5.0, bass=((G2, 0, 2.0), (D3, 2, 5.0)), until=TOT)
chord((B3, D4), cw('take', 'Own', 0.1 + 0.34 * 2 + 0.6), 0.42, step=0.0, ring=4.4, until=TOT)
