# The pyramid, taken apart: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py), and checked by tools/quiet.py (the governance films' check: when the music plays, how often, how loud, no
# repeats, no beats, no pulse, held notes kept level).
#
# The film's palette (its row in the series' palette register, 12 November 2026): a bowed psaltery and a slate lithophone, two
# instruments the site has, paired for the first time, as the register allows where nothing new fits (an assumption in the film's
# assumptions file, with the question on the author's checklist).
# The bowed psaltery: a triangle of steel strings on a flat box, longest at its base and shortest at its tip, each bowed on its own near
# its pin, either way. A note starts as the bow takes the string, a little rosin first, swells into a thin, clear string tone, holds
# level while the bow moves, and rings on for a moment when the bow leaves it, its top first. Drawn up from the bow's light tip, a note
# takes a moment longer to speak than drawn down from its heel. No vibrato: each string's pitch is set by its pin, so nothing trembles.
# The pyramid's own shape, bowed both ways, as Inés redraws the pyramid with arrows down and up.
# Its partner: a slate lithophone, bars of slate struck softly with felt beaters. Stones that look raw, though each was cut and tuned by
# someone for its note, as every record was designed by someone for a question: each bar was cut under its middle, as a marimba's bars
# are, so its first overtone sits four times its note, in tune with it, not where a raw bar's would. A short, dry note, gone in about a
# second, low (G 2 to D 4), under the psaltery (G 3 to D 5).
# Kept apart from the two films that have them (It feels like understanding's psaltery, with a steel tongue drum, and Ethics we can't
# read's slate, with a melodica): the psaltery bows lower and plays neither film's figures, the bars are tuned where those are raw, and
# there is no room round either; the instruments play dry, as the series' first film does.
# Nothing Chilean for Cybersyn (no Andean flutes, no charango, no guitar, no rhythm of a dance), and no machine rhythms for the telex or
# the printout: the story is told in the series' own voice.
#
# Keys, tuned pure: G major, as just intonation from G (every chord's notes are whole-number ratios of each other, so no two held notes
# can beat on a phone's one speaker; no A minor chord, which isn't pure in it); E minor for what goes wrong (one factory lost among the
# ones that were fine; a bad day; nothing recorded yet; the vague top).
# The series' mark, at the title, in the wordless pause after Inés's redrawing, and at the end card: the root and its fifth, apart
# (G and D, the business and the systems), then the third between them, B, which makes the chord (the layer that joins them).
# The film's own figure, both ways: the psaltery bows a line down, D, B, A, G, as each arrow of the redrawing asks for the next thing,
# and the stones take it back up, G, A, B, D, as each record answers; once where Inés redraws the pyramid, and once more, quicker, where
# Grace's measure is defined first, recorded to fit and read by someone who acts.
#
# After the opening story, music comes now and then: a chapter's chord as its picture comes in, a note under a moment on screen, or a
# pause without words. Nothing is held under the explaining, nothing pulses, nothing trembles, and no figure comes back soon.
# Every sound is an event on screen, at the moment it appears: each uses the same word and offset as its picture in src/scenes.js, so
# sound and picture stay together when the voice is re-timed. Effects are soft, one at a time, and below about 2.4 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice
# reads. kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def px(x, cam=960):
    """where something drawn at x sits in the stereo field, with the camera centred on cam"""
    return max(-0.85, min(0.85, (x - cam) / 960 * 0.9))

# ---- levels: the music and the effects as loud as the governance films the author accepted (tools/quiet.py measures them) ----
MUS, FXG = 2.2, 1.6
_X = X
def X(sig, start, g=0.3, pan=0.0):
    _X(sig, start, g * FXG, pan)

# ---- just intonation from G ----
_JI = {0: 1.0, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def jf(m):
    """a note's pitch (MIDI numbering, G2 = 43) in just intonation from G"""
    o, r = divmod(m - 43, 12)
    return 97.99886 * 2.0 ** o * _JI[r]
G2, A2, B2, C3, D3, E3, G3, A3, B3, C4, D4, E4, F4s, G4, A4, B4, D5 = 43, 45, 47, 48, 50, 52, 55, 57, 59, 60, 62, 64, 66, 67, 69, 71, 74

# ---- the bowed psaltery: one steel string bowed near its pin ----
_BOX = [(380, 0.42), (860, 0.34), (1560, 0.16)]        # its flat box: a few broad lifts, which add no note of their own
def psal(m, start, g=0.014, pan=0.0, sec=2.6, up=False):
    """a string bowed near its pin, either way. The bow takes the string (a touch of rosin first) and the note speaks over a fifth of
    a second or so, its upper partials a little after the fundamental, a moment longer drawn up from the bow's light tip than down from
    its heel; it holds level while the bow moves; then the bow leaves and the string rings on, its top first. A bowed string's partials,
    all in tune with its note; a faint hush of rosin while it bows. One string a note: no vibrato, nothing trembles, nothing beats."""
    assert G3 <= m <= D5, 'the psaltery here bows G 3 to D 5, not %d' % m
    f = jf(m); x = tt(sec).astype(np.float64)
    hold = max(0.45, sec - 1.25)                                          # how long the bow is on the string; the ring takes the rest
    att = 0.26 if up else 0.17
    def take(k):                                                          # the string taking the bow: upper partials a little later
        return np.sin(0.5 * np.pi * np.clip(x / (att * (1 + 0.1 * (k - 1))), 0, 1)) ** 2
    def ring(k):                                                          # level while the bow moves, then the ring, top first
        return np.where(x < hold, 1.0, np.exp(-(x - hold) * (1.8 + 0.6 * k)))
    s = sum(np.sin(2 * np.pi * f * k * x + 0.7 * k) * (1 / k ** 1.15) * take(k) * ring(k) for k in range(1, 12) if f * k < 2300)
    # the rosin: a soft catch as the bow takes the string, then a faint hush while it moves, gone before it leaves
    hush = 0.025 * np.exp(-x / 0.05) * np.clip(x / 0.012, 0, 1) + 0.009 * np.clip(x / att, 0, 1) * np.clip((hold - x) / 0.12, 0, 1)
    s = s + filt(noise(sec), 'band', (max(300.0, f * 1.5), 2100.0))[:len(x)] * hush
    s = s * np.clip((sec - x) / 0.3, 0, 1)
    s = s.astype(np.float32)
    s = 0.6 * s + sum(a * filt(s, 'band', (fc * 0.8, fc * 1.25)) for fc, a in _BOX)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g * MUS, pan)

# ---- the slate lithophone: a bar of slate, cut and tuned, struck softly with a felt beater ----
def slate(m, start, g=0.02, pan=0.0):
    """a bar struck at start: its note, the overtone it was cut to (four times the note) and a faint higher one (ten times), which the
    felt barely wakes and which die within a few tenths of a second, while the note itself fades in about a second, a low bar a little
    longer. The felt's touch is a soft, dull knock. Nothing above about 2.2 kHz"""
    assert G2 <= m <= D4, 'the stones here run G 2 to D 4, not %d' % m
    f = jf(m); tau = 0.42 * (98.0 / f) ** 0.35; sec = min(2.0, tau * 5.0); x = tt(sec).astype(np.float64)
    s = sum(a * np.sin(2 * np.pi * f * r * x + 0.5 * r) * np.exp(-x / (tau * k)) for r, a, k in ((1, 1.0, 1.0), (4, 0.22, 0.3), (10, 0.05, 0.1)) if f * r < 2300)
    s = s * (1 - np.exp(-x / 0.003))
    felt_ = filt(noise(sec), 'low', 650)[:len(x)] * np.exp(-x / 0.008)
    s = s + 0.06 * felt_ / max(1e-9, float(np.abs(felt_).max()))
    s = s * np.clip((sec - x) / 0.2, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g * MUS, pan)

# ---- what they play ----
def chord(notes, s, g=0.013, pan=0.0, step=0.15, ground=None, sec=3.0):
    """a chord bowed one string after another, up the triangle and across the stereo field; ground: a stone under it"""
    if ground is not None:
        slate(ground, s - 0.02, g * 1.5, pan)
    for i, m in enumerate(notes):
        psal(m, s + i * step, g * (1.0 if i == 0 else 0.82), pan - 0.25 + 0.5 * i / max(1, len(notes) - 1), sec)
def damark(s, g=0.014, pan=0.0):
    """the series' mark: G and its fifth, D, apart, then the third between them, B, which makes the chord; a stone under it"""
    psal(G3, s, g, pan - 0.3, 3.4); psal(D4, s + 0.6, g, pan + 0.3, 3.0, up=True)
    psal(B3, s + 1.3, g * 1.05, pan, 3.6); slate(G2, s + 1.3, g * 1.5, pan)
DOWN, UP = [D5, B4, A4, G4], [G3, A3, B3, D4]          # the film's figure: down on the psaltery, back up on the stones

# ---- effects: soft, short, below about 2.4 kHz ----
def knock(s, g=0.012, pan=0.0):
    """a soft wooden knock, for a card or a sheet arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 230 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 510 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def glass(s, g=0.008, pan=0.0):
    """a pane of glass set down softly: a dull tap, its ring gone at once"""
    x = tt(0.22); X(norm(filt((np.sin(2 * np.pi * 760 * x) * np.exp(-x * 30) + 0.35 * np.sin(2 * np.pi * 1630 * x) * np.exp(-x * 55)).astype(np.float32), 'low', 2000)), s, g, pan)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """a sheet laid down or pinned, or paper feeding out: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pencil(s, sec=1.2, g=0.005, pan=0.0):
    """a pencil drawing on paper: a soft scratch that swells in and out, its strokes uneven, never a buzz"""
    x = tt(sec); r = np.random.default_rng(int(s * 100) % 997); k = np.zeros_like(x)
    t0 = 0.0
    while t0 < sec:
        d = r.uniform(0.12, 0.3); i0, i1 = int(t0 * SR), int(min(sec, t0 + d) * SR); u = np.linspace(0, 1, max(1, i1 - i0))
        k[i0:i1] = r.uniform(0.5, 1.0) * np.sin(np.pi * u) ** 2; t0 += d * r.uniform(0.9, 1.3)
    X(filt(noise(sec), 'band', (600, 2100)) * k * np.sin(np.pi * x / sec) ** 0.5, s, g, pan)
def press(s, g=0.016, pan=0.0):
    """a stamp, or a decision set down: a low thud and a knock, nothing bright"""
    x = tt(0.4); X(norm(filt((np.sin(2 * np.pi * 75 * x) * np.exp(-x * 11)).astype(np.float32) + 0.15 * noise(0.4) * np.exp(-x * 40), 'low', 900)), s, g * 1.4, pan)
    knock(s + 0.01, g * 0.45, pan)
def tick_(s, g=0.006, pan=0.0):
    """a tick drawn, or a row marked: a short soft click"""
    x = tt(0.07); X(norm(filt((np.sin(2 * np.pi * 1250 * x) * np.exp(-x * 80) + 0.3 * noise(0.07) * np.exp(-x * 120)).astype(np.float32), 'low', 2000)), s, g, pan)
def air(s, sec=0.9, g=0.008, pan=0.0, lo=140, hi=900):
    """things moving together, or light spreading: a breath of low air"""
    s_air(s, sec, g * FXG, pan, lo, hi)
def telex(s, sec, g=0.004, pan=0.0):
    """a telex printing: one soft, muffled texture of keys, uneven, never a clatter or a rhythm"""
    x = tt(sec); r = np.random.default_rng(int(s * 10) % 991); k = np.zeros_like(x); t0 = 0.0
    while t0 < sec:
        i0 = int(t0 * SR); n = int(0.03 * SR); k[i0:i0 + n] += r.uniform(0.4, 1.0) * np.exp(-np.arange(min(n, len(k) - i0)) / (0.006 * SR)); t0 += r.uniform(0.07, 0.16)
    X(filt(noise(sec), 'band', (300, 1300)) * np.minimum(k, 1) * np.sin(np.pi * x / sec) ** 0.4, s, g, pan)

# ======================================================================================================================
# 1. Only what changed: Chile in 1972, under music: the factories linked to Santiago; the telex, every afternoon; one number alone, a
#    good day or a bad one; the wall of figures and the factory lost in it; Cyberstride's normal for each factory, the day out of it
#    passed on, first to its manager, then to Santiago; the first results, Beer's telex, a few warnings each beside its normal. Then
#    the utility: Grace's measure, the systems it seems to come from, and the question under it; the title, to the series' mark.
#    The opening story: music under it throughout, a chord with each turn of the story.
CH = 'changed'
chord([G3, B3, D4, G4], S0(CH) + 0.6, 0.012, -0.1, 0.16, ground=G2, sec=3.6)                     # Chile, 1972: G major, lamp-lit
air(W(CH, 'year', 'factories', -0.3), 2.2, 0.006, px(1060), 200, 1000)                           # the factories come in as dots
tCy = W(CH, 'year', 'Cybersyn', -0.2)
knock(tCy, 0.011, px(1160, 940)); chord([C4, E4, G4], tCy + 0.1, 0.012, px(1160, 940), 0.14, ground=C3, sec=3.0)   # Cybersyn: C major
tT = C(CH, 'telex')
telex(tT, 3.4, 0.004, px(1600, 1160))                                                            # the telex prints, every afternoon
psal(D4, W(CH, 'telex', 'afternoon', -0.3), 0.011, px(1600, 1160), 2.6)
tAl = C(CH, 'alone')
paper(tAl - 0.3, 0.011, 0.0, 0.5); psal(B3, tAl + 0.1, 0.011, 0.0, 3.0)                        # one number, alone: one note
glass(C(CH, 'cloth', 0.2), 0.006, 0.0)                                                           # a good day, or a bad one?
tDp = W(CH, 'cloth', 'depended')
knock(tDp - 0.2, 0.009, px(840)); knock(tDp + 0.1, 0.009, px(1640))
psal(D4, tDp + 0.9, 0.011, px(840), 2.6, up=True)                                                # a good day, here
slate(E3, tDp + 1.2, 0.017, px(1640))                                                            # a bad day, there
tL = C(CH, 'lost')
paper(tL - 0.4, 0.01, 0.0, 3.2)                                                                  # the wall of figures, filling
chord([G3, B3, E4], tL + 0.3, 0.012, 0.0, 0.18, ground=E3, sec=3.4)                             # one in trouble, lost: E minor
tNt = W(CH, 'needed', 'needed them')
glass(tNt - 0.3, 0.007, px(990, 990)); psal(F4s, tNt - 0.25, 0.011, px(990, 990), 2.6)          # the factory that needs them
air(W(CH, 'needed', 'only those', -0.2), 1.0, 0.006, 0.0)                                         # the rest dim
tNo = C(CH, 'normal')
knock(tNo + 0.3, 0.011, px(340)); air(W(CH, 'normal', 'history', -0.2), 2.4, 0.005, px(600), 200, 1100)
chord([G3, B3, D4], W(CH, 'normal', 'normal for', -0.1), 0.012, px(600), 0.16, ground=G2, sec=3.2)   # its normal: G major
tCo, tPo = W(CH, 'passed', 'compared'), W(CH, 'passed', 'passed on')
slate(E3, tCo + 0.4, 0.016, px(1000))                                                            # a day well under it
glass(tPo - 0.1, 0.008, px(1490)); psal(B3, tPo, 0.011, px(1490), 2.8)                          # passed on, as a warning
tF = C(CH, 'first')
air(tF + 0.3, 1.1, 0.006, px(1490)); psal(D4, tF + 0.4, 0.011, px(1490, 1000), 2.8, up=True)    # first to the factory's manager
knock(W(CH, 'first', 'time', -0.4), 0.008, px(1520, 1000))                                       # the clock: time to put it right
tSa = W(CH, 'up', 'Santiago')
knock(tSa - 0.5, 0.01, px(800, 940)); psal(G4, tSa - 0.2, 0.011, px(800, 940), 2.8)             # only if it stayed wrong: Santiago
tWk = C(CH, 'works')
paper(tWk + 0.3, 0.008, px(420), 3.4)                                                            # the printout, feeding out
chord([D4, F4s, A4], tWk + 0.4, 0.012, px(420), 0.16, ground=D3, sec=3.2)                       # the first results: D major
tTx = W(CH, 'beer', 'telexed')
telex(tTx - 0.2, 1.6, 0.004, px(1250, 960))
chord([G3, B3, D4, G4], tTx + 0.6, 0.013, 0.0, 0.16, ground=G2, sec=3.4)                        # it really worked: G major
tFw = W(CH, 'handful', 'a few warnings')
for i in range(3):                                                                               # a few warnings: a stone each
    glass(tFw - 0.2 + i * 0.35, 0.006, px(1110, 1000)); slate([G3, B3, D4][i], tFw - 0.15 + i * 0.35, 0.016, px(1110, 1000))
tG = C(CH, 'grace')
chord([C4, E4, G4], tG + 0.05, 0.012, 0.0, 0.16, ground=C3, sec=3.2)                             # the utility: C major
tE = C(CH, 'exists')
for i in range(3):
    glass(tE + 0.3 + i * 0.3, 0.006, px([640, 960, 1280][i], 940))                               # the systems it seems to come from
slate(E3, W(CH, 'exists', 'But it exists'), 0.015, 0.0)                                          # but it exists only because...
paper(W(CH, 'exists', 'someone', -0.4), 0.011, 0.0, 0.5)                                          # the question, pinned under it
pencil(W(CH, 'exists', 'decided', -0.2), 1.8, 0.005, 0.0)
damark(C(CH, 'breath', 1.1), 0.014, 0.0)                                                          # the title: the series' mark

# 2. A famous pyramid: built level by level; where it came from; read from the bottom up; split, half of it right.
#    After the opening, music now and then.
PY = 'pyramid'
tPi = C(PY, 'picture')
for k in range(4):                                                                               # the pyramid, a stone a level
    slate([G2, B2, D3, G3][k], tPi + 0.65 + k * 0.75, 0.015, px(700) + 0.04 * k)
paper(W(PY, 'poet', 'a poet', -0.3), 0.01, px(1590, 1040), 0.5); psal(E4, W(PY, 'poet', 'a poet', 0.2), 0.011, px(1590, 1040), 2.8)   # where is the knowledge?
knock(W(PY, 'ackoff', 'drew', -0.4), 0.009, px(1590, 1040)); knock(W(PY, 'ackoff', 'Ackoff', -0.2), 0.009, px(1590, 1040))
for k, word in enumerate(['data becomes', 'information becomes', 'knowledge becomes', 'wisdom']):  # read from the bottom up
    psal([G3, B3, D4, G4][k], W(PY, 'read', word, -0.05), 0.0105, px(700, 900), 2.2, up=True)
tHa = C(PY, 'half')
pencil(tHa + 0.2, 0.7, 0.005, px(700)); psal(D4, tHa + 0.3, 0.011, px(700), 3.0)               # half right: the fifth, open

# 3. What it gets right: a number needs context; forty-one, alone, and its questions; the measure line by line; people decide, and
#    Grace answers for it; Inés keeps both.
RT = 'right'
tick_(C(RT, 'context', 0.1), 0.006, px(2880 - 840, 2880))
tFo = C(RT, 'forty')
knock(tFo - 0.2, 0.011, px(2880 - 520, 2880))
for i, word in enumerate(['which line', 'what time', 'how many']):
    glass(W(RT, 'forty', word, -0.2), 0.006, px(2880 + 0, 2880))
tM = C(RT, 'measure')
chord([G3, B3, D4], tM + 0.3, 0.012, px(2880 - 300, 2880), 0.16, ground=G2, sec=3.0)          # line by line: now it says something
glass(W(RT, 'measure', 'which lines', -0.1), 0.006, px(2880 - 300, 2880))
tick_(C(RT, 'people', 0.1), 0.006, px(2880 + 280, 2880))
tDc = W(RT, 'grace', 'Grace decides', -0.2)
press(tDc, 0.013, px(2880 + 590, 2880)); psal(G4, tDc + 0.15, 0.011, px(2880 + 590, 2880), 2.8)  # Grace decides
knock(W(RT, 'grace', 'answers', -0.3), 0.009, px(2880 + 450, 2880))
tK = C(RT, 'keeps')
slate(G3, tK + 0.15, 0.015, px(2880 - 840, 2880)); psal(G4, tK + 0.4, 0.011, px(2880 + 280, 2880), 2.8)   # Inés keeps both

# 4. The question comes first: the pyramid, drawn like a factory; nothing recorded until someone decides; the definition, written
#    first, and its owner; the momentary cut; the records, made to fit; the question deciding them; the mill in Chile, drawn first.
FI = 'first'
air(C(FI, 'drawn', 0.3), 0.8, 0.005, px(700))
tFa = W(FI, 'factory', 'data goes in')
air(tFa, 0.8, 0.006, px(130), 120, 700); air(tFa + 1.4, 0.8, 0.006, px(700), 300, 1400)         # data in at the bottom, wisdom out
tN = C(FI, 'nothing')
glass(tN + 0.5, 0.007, px(1450)); slate(E3, tN + 0.9, 0.015, px(1450))                          # nothing recorded yet
tSo = W(FI, 'before', 'someone')
paper(tSo - 0.2, 0.011, px(530), 0.5); knock(tSo + 0.4, 0.008, px(330))                         # the definition, and its owner
psal(D4, C(FI, 'five', 2.6), 0.011, px(530), 2.8)                                                 # written down
glass(C(FI, 'short', 0.1), 0.007, px(530))
tRe = C(FI, 'records')
for i in range(3):
    knock(tRe + 0.4 + i * 0.67, 0.007, px(1450))                                                 # each cut, recorded
tCa = C(FI, 'came')
air(tCa, 0.8, 0.006, px(1000))
for i in range(3):
    tick_(tCa + 0.6 + i * 0.3, 0.005, px(1700))
chord([G3, B3, D4, G4], tCa + 0.5, 0.012, px(1000), 0.15, ground=G2, sec=3.2)                   # the question came first: G major
tCh = C(FI, 'chile')
paper(tCh - 0.1, 0.01, px(1450), 0.5)
tCs = W(FI, 'chile', 'chose', -0.2)
pencil(tCs, 0.8, 0.004, px(1450)); psal(B3, tCs + 0.2, 0.011, px(1450), 2.8)                     # the number, chosen on the drawing

# 5. No raw data: the question, large; a meter's readings, which look raw; what someone chose for them; the book's title; the stamp.
RW = 'raw'
slate(G2, C(RW, 'either', 0.25), 0.017, 0.0)                                                     # raw data? a raw stone, it seems
glass(C(RW, 'reading', -0.2), 0.007, px(2880 - 480, 2880))
for i, word in enumerate(['half hour', 'kilowatt', 'decimal']):                                  # chose, chose, chose
    psal([G4, B4, D5][i], W(RW, 'chose', word, -0.15), 0.0105, px(2880 - 40, 2880), 2.4)
knock(C(RW, 'book', 0.1), 0.012, px(2880 + 565, 2880))
tSt = W(RW, 'every', 'designed', 0.1)
press(tSt, 0.014, px(2880 - 560, 2880))
chord([G3, B3, D4], tSt + 0.15, 0.012, px(2880 - 560, 2880), 0.15, ground=G2, sec=3.0)          # designed, for a question

# 6. No separate levels, no clear top: the levels run together; DAMA's line; one record of a cut, data to one and information to
#    another; the top clouds over; in practice, a person, deciding.
LV = 'levels'
air(C(LV, 'apart', 0.4), 1.4, 0.006, px(700), 160, 900)
knock(C(LV, 'dama', 0.3), 0.01, px(1590))
glass(W(LV, 'dama', 'data is'), 0.006, px(500)); glass(W(LV, 'dama', 'information is'), 0.006, px(900))
glass(C(LV, 'same'), 0.007, px(1500))
slate(B3, W(LV, 'same', 'data to', -0.2), 0.015, px(1450)); psal(B4, W(LV, 'same', 'information to', -0.2), 0.011, px(1450), 2.8)   # the same record, two ways
tTo = C(LV, 'top')
air(tTo + 0.2, 1.2, 0.006, px(700, 880), 140, 700)                                 # the top clouds over
glass(W(LV, 'wisdom', 'what wisdom', -0.2), 0.006, px(1500, 880)); glass(W(LV, 'wisdom', 'how a system', -0.2), 0.006, px(1500, 880))
tPe = W(LV, 'person', 'a person', -0.2)
slate(G3, tPe, 0.015, px(700)); psal(G4, tPe + 0.25, 0.011, px(700), 3.2)                       # the top: a person, deciding

# 7. Arrows both ways: Inés redraws it; down, each arrow asking for the next thing, on the psaltery; the definition decides what's
#    recorded; up, each record answering, on the stones, to a person who decides; then the data practice on the map, and the pause
#    without words, to the series' mark.
BO = 'both'
air(C(BO, 'redraw', 1.0), 1.2, 0.006, px(700), 160, 900)
for word in ['decision', 'question', 'needs a measure', 'needs a definition']:
    knock(W(BO, 'down', word, -0.2), 0.007, px(900))                                             # each box, as it's named
DT = [W(BO, 'down', 'asks'), W(BO, 'down', 'needs a measure'), W(BO, 'down', 'needs a definition'), W(BO, 'decides', 'decides')]
for k in range(4):                                                                               # down: what asks, on the left
    psal(DOWN[k], DT[k] - 0.05, 0.0105, px(440), 2.2)
knock(C(BO, 'decides', 0.5), 0.008, px(900))                                                     # the records
UT = [W(BO, 'up', 'answer the'), W(BO, 'up', 'answers'), W(BO, 'up', 'person')]
for k in range(3):                                                                               # up: what answers, on the right
    slate(UP[k], UT[k] - 0.05, 0.016, px(1360))
slate(UP[3], UT[2] + 0.45, 0.016, px(1360)); psal(G4, UT[2] + 0.5, 0.011, px(900), 3.0)          # and a person decides
tMa = C(BO, 'map')
air(tMa - 0.2, 1.0, 0.006, 0.0)
glass(W(BO, 'map', 'business object', -0.3), 0.007, px(1100)); knock(W(BO, 'map', 'owned by Grace', -0.2), 0.008, px(1615))
glass(C(BO, 'realise', 0.1), 0.007, px(1100)); air(W(BO, 'realise', 'realises', -0.1), 0.9, 0.005, px(1100), 200, 1000)
knock(C(BO, 'traces', -0.1), 0.009, px(330))
pencil(W(BO, 'traces', 'what it counts', -0.1), 0.9, 0.004, px(695)); pencil(W(BO, 'traces', 'where the counts', -0.1), 1.1, 0.004, px(610))
damark(C(BO, 'breath', 0.3), 0.013, 0.0)                                                          # the counts run up: the mark

# 8. Defined first: Chile again, its numbers never raw: the mill drawn, the number chosen, its normal, the warning, a person; then
#    Grace's measure, the figure once more, quicker: defined first, recorded to fit, read by someone who acts; counted the same way
#    every year; and the next question, which record is the fact; the end card, to the series' mark.
BK = 'back'
tC8 = C(BK, 'chile')
paper(tC8 - 0.2, 0.01, 0.0, 0.5); chord([G3, B3, D4, G4], tC8 - 0.1, 0.012, 0.0, 0.16, ground=G2, sec=3.4)   # the opening's chord
tDr = C(BK, 'drew')
pencil(tDr, 1.8, 0.004, px(570))
tCw = W(BK, 'drew', 'chose')
pencil(tCw, 0.8, 0.004, px(570)); psal(B3, tCw + 0.2, 0.011, px(570), 2.6)                       # the number chosen
glass(W(BK, 'person', 'only what changed', -0.1), 0.007, px(1450))                                # only what changed, passed on
tDf, tRf, tRb = W(BK, 'grace', 'defined first'), W(BK, 'grace', 'recorded to fit'), W(BK, 'grace', 'read by')
for k in range(4):                                                                               # defined first: down, quicker
    psal(DOWN[k], tDf - 0.1 + k * 0.3, 0.0095, px(440) + 0.12 * k, 1.9)
knock(tRf, 0.008, px(1100))                                                                      # recorded to fit
for k in range(4):                                                                               # read by someone who acts: back up
    slate(UP[k], tRb - 0.1 + k * 0.3, 0.015, px(1360) - 0.12 * k)
tYr = W(BK, 'year', 'renewed first', -0.2)
glass(W(BK, 'year', 'every year', -0.2), 0.006, px(330)); knock(tYr, 0.008, px(1600)); knock(tYr + 0.3, 0.008, px(1600))
chord([G3, B3, D4], tYr + 0.35, 0.012, px(1100), 0.15, ground=G2, sec=3.0)                      # renewed first: G major
tMo = W(BK, 'next', 'more than one', -0.2)
glass(tMo, 0.007, px(290)); glass(tMo + 0.4, 0.007, px(290))                                     # recorded by more than one system
psal(A4, W(BK, 'next', 'Which record', -0.1), 0.0105, px(1100), 3.0)                              # which is the fact? left open
damark(C(BK, 'breath', 1.0), 0.014, 0.0)                                                          # the end card: the mark
