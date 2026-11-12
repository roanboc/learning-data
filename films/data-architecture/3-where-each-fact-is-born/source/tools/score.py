# Where each fact is born: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py), and checked by tools/quiet.py (the governance films' check: when the music plays, how often, how loud, no
# repeats, no beats, no pulse, held notes kept level).
#
# The film's palette (its row in the series' palette register, 12 November 2026): glass bars and a monochord, two instruments the site
# has, paired for the first time, as the register allows where nothing new fits (an assumption in the film's assumptions file, with the
# question on the author's checklist).
# The glass bars (a crystallophone): bars of glass struck softly with yarn mallets, in their middle and upper notes (C 4 to G 5), no
# resonator. A clear, cool note that rings and fades, with the faint overtones of an uncut bar of glass, gone in a tenth of a second
# or two, and the small touch of the yarn. They spread each chord from the bass up under the opening story and at a chapter's turn,
# and give one note as a copy is made or kept: the series draws every record as a card of glass.
# Its partner: a monochord, one long gut string over a long box, its bridge set for each note, plucked softly with the finger at the
# string's middle, so its note is hollow and round: a string plucked at its middle has no even partials. Low (C 2 to G 3), one note
# at a time, where a fact is born; and under the series' mark, as the title and the end card name where each fact is born.
# Kept apart from the two films that have them (Context engineering's monochord, with a twelve-string guitar, and Context and memory,
# governed's glass bars, with a baritone sarrusophone): the monochord is plucked with the finger at its middle, low, and only where a
# fact is born, never quill-plucked or touched for a harmonic; the glass bars sit higher, uncut and dry, and ring a string's
# harmonics, never that film's low memory bars; and there is no room round either: the instruments play dry, as the series' first two
# films do. Nothing Chilean for Cybersyn (no Andean flutes, no charango, no guitar, no rhythm of a dance), and no machine rhythms for
# the telex: the story is told in the series' own voice.
#
# Keys, tuned pure: C major, as just intonation from C (every chord's notes are whole-number ratios of each other, so no two held notes
# can beat on a phone's one speaker; no D minor chord, which isn't pure in it, and D and A never sound together); A minor for what goes
# wrong (a bad day that looks normal; a fact born twice; the power out and the cut nobody matched); G major where something is needed,
# or named; F major where the story opens a door (Cybersyn; master data, the next series).
# The series' mark, at the title, at the rule in chapter 4 and at the end card: the root and its fifth, apart (C and G, the business and
# the systems), then the third between them, E, which makes the chord, with the monochord's low C under it.
# The film's own figure, *born once*: the monochord gives a note where a fact is born, and the glass bars ring its own harmonics above
# it while it still sounds (the octave, the twelfth and the double octave: C 4, G 4 and C 5 over C 3), as copies born of it; a harmonic
# sounds only where its string does. Once where the connection point is born in the network map and billing copies it, and once at
# the end, where each fact has one home and every copy a line back to it. Elsewhere a copy's glass note is a harmonic of the note its
# fact was born on, too: a copy of billing's premise (C 3) rings G 4, a copy of the network map's (A 2) rings E 4.
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
MUS, FXG = 2.5, 1.6
_X = X
def X(sig, start, g=0.3, pan=0.0):
    _X(sig, start, g * FXG, pan)

# ---- just intonation from C ----
_JI = {0: 1.0, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def jf(m):
    """a note's pitch (MIDI numbering, C3 = 48) in just intonation from C"""
    o, r = divmod(m - 48, 12)
    return 130.8128 * 2.0 ** o * _JI[r]
C2, E2, G2, A2, C3, E3, G3 = 36, 40, 43, 45, 48, 52, 55
C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, G5 = 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 79

# ---- the glass bars: an uncut bar of glass, struck softly with a yarn mallet ----
def gbar(m, start, g=0.016, pan=0.0):
    """a glass bar struck at start: its note rings clear and fades over a couple of seconds (a lower bar a little longer), with the
    faint overtones of an uncut bar (2.76 and 5.40 times its note, out of tune with it), which the soft yarn barely wakes and which are
    gone in a tenth of a second or two, so they never hold under a chord; the yarn's touch, a small soft knock. No resonator under it:
    nothing trembles, nothing beats. Nothing above about 2.3 kHz"""
    assert C4 <= m <= G5, 'the glass bars here run C 4 to G 5, not %d' % m
    f = jf(m); tau = 0.9 * (262.0 / f) ** 0.4; sec = min(3.4, tau * 4.0); x = tt(sec).astype(np.float64)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x / tau)
    for r, a, d in ((2.756, 0.07, 0.12), (5.404, 0.02, 0.05)):
        if f * r < 2300:
            s = s + a * np.sin(2 * np.pi * f * r * x + 0.3 * r) * np.exp(-x / d)
    s = s * (1 - np.exp(-x / 0.002))
    yarn = filt(noise(sec), 'low', 900)[:len(x)] * np.exp(-x / 0.006)
    s = s + 0.05 * yarn / max(1e-9, float(np.abs(yarn).max()))
    s = s * np.clip((sec - x) / 0.25, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 2300)), start, g * MUS, pan)

# ---- the monochord: one gut string over a long box, plucked softly with the finger at its middle ----
_BOX = [(150, 0.35), (330, 0.28), (720, 0.12)]          # its long box: a few broad lifts, which add no note of their own
def mono(m, start, g=0.022, pan=0.0):
    """the monochord's string, its bridge set for the note m, plucked at start with the finger at the string's middle: the string starts
    as a triangle with its peak there, where every even partial has a node, so only the odd partials sound (the note, its twelfth, its
    seventeenth...), each fainter than the last, the finger's soft pad taking the top off. It rings on for a few seconds, its higher
    partials fading first, and its long box lifts the low ones. One string, one note: no vibrato, nothing trembles"""
    assert C2 <= m <= G3, 'the monochord here plays C 2 to G 3, not %d' % m
    f = jf(m); tau = 1.4 * (98.0 / f) ** 0.3; sec = min(4.6, tau * 3.2); x = tt(sec).astype(np.float64)
    s = sum((1.0 / n) * np.exp(-0.2 * (n - 1)) * np.sin(2 * np.pi * f * n * x + 0.4 * n) * np.exp(-x * (1 + 0.45 * (n - 1)) / tau)
            for n in range(1, 16, 2) if f * n < 2300)
    s = s * (1 - np.exp(-x / 0.004))
    pad = filt(noise(sec), 'low', 500)[:len(x)] * np.exp(-x / 0.01)
    s = s + 0.04 * pad / max(1e-9, float(np.abs(pad).max()))
    s = s * np.clip((sec - x) / 0.3, 0, 1)
    s = s.astype(np.float32)
    s = 0.65 * s + sum(a * filt(s, 'band', (fc * 0.8, fc * 1.25)) for fc, a in _BOX)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g * MUS, pan)

# ---- what they play ----
def chord(notes, s, g=0.013, pan=0.0, step=0.15):
    """a chord on the glass bars, struck one bar after another from the bass up, across the stereo field"""
    for i, m in enumerate(notes):
        gbar(m, s + i * step, g * (1.0 if i == 0 else 0.85), pan - 0.25 + 0.5 * i / max(1, len(notes) - 1))
def damark(s, g=0.015, pan=0.0):
    """the series' mark: C and its fifth, G, apart, then the third between them, E, which makes the chord; the monochord's C under it"""
    gbar(C4, s, g, pan - 0.3); gbar(G4, s + 0.6, g, pan + 0.3)
    gbar(E4, s + 1.3, g * 1.05, pan); mono(C2, s + 1.3, g * 1.4, pan)
def copies(s, g=0.011, pan=0.0, step=0.38):
    """the film's figure, its second half: the glass bars ring the harmonics of C 3, the note the fact was just born on, as its copies"""
    for i, m in enumerate([C4, G4, C5]):
        gbar(m, s + i * step, g, pan + 0.15 * i)

# ---- effects: soft, short, below about 2.4 kHz ----
def knock(s, g=0.012, pan=0.0):
    """a soft wooden knock, for a card or a sheet arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 230 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 510 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def pane(s, g=0.008, pan=0.0):
    """a pane of glass set down softly, for a tag or a mark: a dull tap, its ring gone at once"""
    x = tt(0.22); X(norm(filt((np.sin(2 * np.pi * 760 * x) * np.exp(-x * 30) + 0.35 * np.sin(2 * np.pi * 1630 * x) * np.exp(-x * 55)).astype(np.float32), 'low', 2000)), s, g, pan)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """a sheet laid down, a page turned, or a strip of paper: filtered noise with a swell"""
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
    """a decision set down: a low thud and a knock, nothing bright"""
    x = tt(0.4); X(norm(filt((np.sin(2 * np.pi * 75 * x) * np.exp(-x * 11)).astype(np.float32) + 0.15 * noise(0.4) * np.exp(-x * 40), 'low', 900)), s, g * 1.4, pan)
    knock(s + 0.01, g * 0.45, pan)
def tick_(s, g=0.006, pan=0.0):
    """a cross drawn, or a field marked: a short soft click"""
    x = tt(0.07); X(norm(filt((np.sin(2 * np.pi * 1250 * x) * np.exp(-x * 80) + 0.3 * noise(0.07) * np.exp(-x * 120)).astype(np.float32), 'low', 2000)), s, g, pan)
def air(s, sec=0.9, g=0.008, pan=0.0, lo=140, hi=900):
    """things moving together, a line drawn out, or light running along one: a breath of low air"""
    s_air(s, sec, g * FXG, pan, lo, hi)
def telex(s, sec, g=0.004, pan=0.0):
    """a telex printing: one soft, muffled texture of keys, uneven, never a clatter or a rhythm"""
    x = tt(sec); r = np.random.default_rng(int(s * 10) % 991); k = np.zeros_like(x); t0 = 0.0
    while t0 < sec:
        i0 = int(t0 * SR); n = int(0.03 * SR); k[i0:i0 + n] += r.uniform(0.4, 1.0) * np.exp(-np.arange(min(n, len(k) - i0)) / (0.006 * SR)); t0 += r.uniform(0.07, 0.16)
    X(filt(noise(sec), 'band', (300, 1300)) * np.minimum(k, 1) * np.sin(np.pi * x / sec) ** 0.4, s, g, pan)

# ======================================================================================================================
# 1. From the factory itself: Chile in 1972, under music: the network along the country; Cybersyn; the free telex; the mill's own
#    number, and a warning; last month's figure and an office's guess, crossed out; a bad day that looks normal, the mill short of
#    cotton, no help; the number from where it's made; sent by telex, once a day; the reminders; born at the factory, the monochord's
#    first note; read in Santiago as a copy, the same day; six months, before. Then the utility: a fact born in billing and born again
#    in the network map; created twice; the title, to the series' mark. The opening story: music under it throughout.
CH = 'sender'
chord([C4, E4, G4, C5], S0(CH) + 0.6, 0.013, -0.1)                                                 # Chile, 1972: C major, lamp-lit
tCy = W(CH, 'year', 'Cybersyn', -0.2)
knock(tCy, 0.011, px(1160, 1000)); chord([C4, F4, A4], tCy + 0.1, 0.012, px(1160, 1000), 0.16)   # Cybersyn: F major
air(W(CH, 'year', 'every factory', -0.3), 2.0, 0.006, px(1040, 1000), 200, 1000)                    # the factories come in as dots
pencil(W(CH, 'year', 'four thousand', -0.3), 1.4, 0.004, px(470, 1060))                             # the country's length, measured
gbar(G4, W(CH, 'year', 'four thousand', 0.6), 0.011, px(300, 1060))                               # more than 4,000 km
tFr = C(CH, 'free')
telex(tFr, 3.0, 0.004, px(1500, 1080))                                                              # the free telex prints
gbar(E4, W(CH, 'free', 'managers', -0.1), 0.012, px(1790, 1080))                                    # a manager, won over
tOw = C(CH, 'own')
knock(tOw - 0.2, 0.01, px(330)); pencil(tOw + 0.2, 2.2, 0.004, px(620))                            # Cyberstride; the mill's days
tOn = W(CH, 'own', 'own numbers')
paper(tOn - 0.3, 0.01, px(1490), 0.5); gbar(G4, tOn + 0.4, 0.012, px(1060))                        # its own number: a warning
tLa, tGu = W(CH, 'else', 'last month'), W(CH, 'else', 'a guess')
gbar(A4, W(CH, 'else', 'mislead', -0.1), 0.011, px(1060))                                           # a figure from anywhere else
paper(tLa - 0.3, 0.009, px(1490), 0.45); tick_(tLa + 0.5, 0.005, px(1838))                         # last month's, crossed out
paper(tGu - 0.3, 0.009, px(1490), 0.45); tick_(tGu + 0.5, 0.005, px(1838))                         # an office's guess, crossed out
chord([C4, E4, A4], W(CH, 'harm', 'look normal', -0.1), 0.012, px(1020, 960), 0.16)                # a bad day looks normal: A minor
knock(W(CH, 'harm', 'short of cotton', -0.5), 0.009, px(260, 960))                                 # the mill, short of cotton
gbar(E4, W(CH, 'harm', 'never came', -0.1), 0.011, px(966, 960))                                   # no help came
knock(C(CH, 'needed', -0.4), 0.009, px(480))                                                        # the mill
chord([D4, G4, B4], W(CH, 'needed', 'where it was made', -0.1), 0.012, px(480), 0.16)              # where it's made: G major
telex(W(CH, 'sent', 'by telex', -0.2), 2.4, 0.004, px(960))                                         # sent by telex
tOd = W(CH, 'sent', 'once a day')
air(tOd - 0.6, 1.4, 0.006, px(950, 1000), 200, 1000); gbar(C5, tOd + 0.7, 0.011, px(1500, 1000))   # to Santiago, once a day
tKe = W(CH, 'remind', 'keep reminding')
for i in range(3):
    paper(tKe - 0.3 + i * 0.55, 0.008, px(1500, 1000), 0.4)                                          # the reminders, one by one
gbar(D4, tKe + 0.9, 0.0105, px(1500, 1000))                                                          # the last one, pinned
tBh = W(CH, 'born', 'one place where it was born')
mono(C3, tBh - 0.1, 0.022, px(420))                                                                 # born here: the monochord
gbar(G4, W(CH, 'born', 'the factory that made', 0.1), 0.011, px(420))                             # its twelfth, on glass
tCo = C(CH, 'copy')
paper(tCo + 0.2, 0.009, px(1430), 0.45); air(tCo + 0.6, 0.9, 0.005, px(930), 200, 900)            # the copy in Santiago; its line back
gbar(E4, W(CH, 'copy', 'the same day', -0.1), 0.011, px(930))                                      # the same day
tSi = C(CH, 'six')
knock(tSi - 0.2, 0.009, px(1300, 1000)); gbar(A4, tSi + 0.6, 0.011, px(1300, 1000))               # six months late
chord([E4, G4, C5], C(CH, 'utility', -0.3), 0.012, 0.0, 0.16)                                      # the utility: C major
mono(C3, W(CH, 'both', 'billing creates', 0.3), 0.02, px(320))                                     # born in billing
mono(A2, W(CH, 'both', 'network map creates', 0.3), 0.02, px(1600))                                # and born again in the network map
paper(C(CH, 'twice', -0.1), 0.009, px(650), 0.45)
chord([A4, C5, E5], W(CH, 'twice', 'created twice', -0.1), 0.012, px(900), 0.16)                   # created twice: A minor
damark(C(CH, 'breath', 1.1), 0.015, 0.0)                                                            # the title: the series' mark

# 2. Born twice: 14 Quarry Lane; March, the form, billing's premise born; April, the network map's service point born again; the two
#    copies, each a harmonic of the note its record was born on; June, the power out (A minor); the cut at a service point with no
#    account; the call that found no cut; Grace's measure, counting no one. After the opening, music now and then.
TW = 'twice'
knock(C(TW, 'home', -0.3), 0.009, 0.0)                                                              # the house
paper(C(TW, 'march'), 0.007, px(960), 0.4)                                                          # the calendar: March
tSu = W(TW, 'march', 'signed up')
paper(tSu - 0.4, 0.009, px(320), 0.45); pencil(tSu, 1.7, 0.004, px(320))                           # the family's form, filled in
mono(C3, W(TW, 'march', 'of its own', -0.1), 0.02, px(320))                                        # billing's premise: born
paper(C(TW, 'april'), 0.007, px(960), 0.4)                                                          # April
mono(A2, W(TW, 'april', 'network map created', 0.4), 0.02, px(1600))                              # the service point: born again
tCS, tOU = W(TW, 'copies', 'Customer service copied'), W(TW, 'copies', 'outage system copied')
air(tCS - 0.1, 0.9, 0.005, px(320)); gbar(G4, tCS + 0.7, 0.011, px(320))                          # a copy of billing's premise
air(tOU - 0.1, 0.9, 0.005, px(1600)); gbar(E4, tOU + 0.7, 0.011, px(1600))                        # a copy of the service point
paper(C(TW, 'june'), 0.007, px(960), 0.4)                                                           # June
chord([E4, A4, C5], W(TW, 'june', 'power went out', 0.2), 0.012, 0.0, 0.18)                         # the power out: A minor
pane(W(TW, 'saw', 'saw the cut'), 0.007, px(1600)); tick_(W(TW, 'saw', 'no account'), 0.005, px(1600))
knock(C(TW, 'call'), 0.008, px(640))                                                                # the family calls
tick_(W(TW, 'call', 'found no cut'), 0.005, px(320))                                                # no cut found
knock(C(TW, 'count', -0.1), 0.009, px(960)); gbar(A4, W(TW, 'count', 'no customer'), 0.011, px(960))   # no customer counted

# 3. Where it's born: the account, born in billing (G 2), created and corrected there; its copies, its harmonics (G 4, B 4); DAMA's
#    system of record; the matrix, drawn; one "creates", a home (C major); two, born twice (A minor).
BN = 'born'
knock(C(BN, 'place', 0.8), 0.009, px(460))                                                          # the account's card
mono(G2, W(BN, 'place', 'born', -0.1), 0.02, px(460))                                               # where it's born
pencil(W(BN, 'place', 'corrected', 0.1), 0.6, 0.004, px(460))                                       # its name, corrected there
knock(C(BN, 'dama', -0.2), 0.009, px(930))                                                          # DAMA's definition
tOt = W(BN, 'dama', 'Every other')
gbar(G4, tOt + 0.6, 0.011, px(1400)); gbar(B4, tOt + 1.1, 0.011, px(1400))                        # its copies: G 2's harmonics
pencil(W(BN, 'matrix', 'each system', -0.4), 1.6, 0.004, px(960))                                  # the matrix, drawn
chord([C4, E4, G4], C(BN, 'one', 0.3), 0.012, px(1480), 0.3)                                        # one "creates": a home
chord([C4, E4, A4], W(BN, 'two', 'born twice', -0.1), 0.012, px(1480), 0.3)                        # two: born twice, A minor

# 4. One home, one owner: the network map named the connection point's home; Grace agrees; only the network map creates one; billing
#    asks, the network map creates it (the monochord's C 3) and billing copies it (its harmonics on glass: the film's figure, once);
#    the account's home, billing (G 2), and its owner; the rule, to the series' mark.
HO = 'home'
pane(W(HO, 'names', 'the network map', -0.1), 0.007, px(480))                                     # the connection point's home
knock(W(HO, 'names', 'Grace', -0.2), 0.009, px(480)); press(W(HO, 'names', 'agrees', -0.1), 0.012, px(480))   # Grace agrees
tick_(W(HO, 'only', 'creates', 0.2), 0.005, px(780))                                                # billing's "creates", now a copy
pane(W(HO, 'only', 'with its ID', -0.2), 0.006, px(480))                                          # with its ID, when it's planned
tAsk, tCop = W(HO, 'ask', 'It asks'), W(HO, 'ask', 'copies it')
knock(tAsk - 0.2, 0.008, px(280))                                                                    # billing asks the network team
mono(C3, tAsk + 0.5, 0.022, px(860))                                                                # the network map creates it: born
copies(tCop + 0.3, 0.011, px(1400) - 0.15)                                                          # billing copies it: its harmonics
mono(G2, W(HO, 'account', 'billing', 0.1), 0.02, px(780))                                          # the account's home: billing
knock(W(HO, 'account', 'head of retail', -0.2), 0.009, px(780))                                    # its owner
damark(C(HO, 'rule', 0.1), 0.014, 0.0)                                                              # the rule: the series' mark

# 5. A line back: each copy's line back, drawn; which record, and when; its lineage (G major); the address corrected once, at home (the
#    monochord's C 3); by morning each copy has it, a harmonic of that C as each one changes (G 4, C 5, E 5); the measure, traced.
LI = 'lineage'
air(W(LI, 'line', 'line back', -0.1), 1.4, 0.006, 0.0, 200, 1000)                                  # the lines back, drawn
tick_(W(LI, 'line', 'which record', -0.2), 0.005, 0.0)                                              # which record, and when
chord([D4, G4, B4], C(LI, 'called', 0.1), 0.012, 0.0, 0.16)                                         # its lineage: G major
pencil(W(LI, 'council', 'corrected the address', 0.1), 0.7, 0.004, px(1600))                       # the address, corrected
mono(C3, W(LI, 'council', 'at home', -0.1), 0.02, px(1600))                                        # once, at home
tMo = C(LI, 'morning')
for k, (dt, m, x) in enumerate([(0.85, G4, 320), (1.25, C5, 1600), (1.85, E5, 320)]):             # each copy, as the change reaches it
    gbar(m, tMo + dt, 0.011, px(x))
air(W(LI, 'measure', 'each interruption', -0.1), 0.9, 0.005, px(1290))                             # the measure, traced to its records
air(W(LI, 'measure', 'each customer', -0.1), 0.9, 0.005, px(610))

# 6. Three records, three facts: one cut, recorded by more than one system; the meter's event, the call and the interruption, each
#    born in its own system, each on its own note (G 2, E 3, C 3); not three copies, three facts (C major); evidence; the measure.
TH = 'three'
air(C(TH, 'back', 0.6), 1.0, 0.005, 0.0)                                                            # down to three places
pane(W(TH, 'back', 'the cut', -0.2), 0.006, 0.0)                                                    # one cut, on Quarry Lane
knock(W(TH, 'meter', 'power off', -0.3), 0.008, px(380)); mono(G2, W(TH, 'meter', 'born in meter data', -0.1), 0.02, px(380))
knock(W(TH, 'call', "family's call", -0.3), 0.008, px(1540)); mono(E3, W(TH, 'call', 'born in customer service', -0.1), 0.02, px(1540))
knock(W(TH, 'cut', 'interruption', -0.3), 0.008, px(960)); mono(C3, W(TH, 'cut', 'born in the outage system', -0.1), 0.02, px(960))
tick_(W(TH, 'not', 'three copies', 0.3), 0.005, 0.0)                                                 # three copies of one fact? no
chord([E4, G4, C5], W(TH, 'not', 'three facts', -0.1), 0.012, 0.0, 0.2)                            # three facts, three homes
air(W(TH, 'evidence', 'reads the other two', -0.1), 1.2, 0.005, 0.0)                               # evidence, read by the outage system
knock(W(TH, 'evidence', "Grace's measure", -0.3), 0.008, px(1580))                                 # the measure, counting its record

# 7. Two places, one person: two places a customer can start; born in billing (C 3), or in customer service (G 2); the same person?
#    which value wins? master data, the next series (F major); the data practice on the map; the light along each line back.
MA = 'master'
air(W(MA, 'some', 'only one place', 0.2), 0.9, 0.005, 0.0)                                         # the three records leave
mono(C3, W(MA, 'customer', 'in billing', 0.1), 0.02, px(380))                                      # a customer, born in billing
mono(G2, W(MA, 'customer', 'in customer service', 0.1), 0.02, px(1540))                            # or in customer service
pencil(W(MA, 'both', 'same person', -0.3), 0.9, 0.004, 0.0)                                         # the same person?
pane(W(MA, 'both', 'which value wins', -0.1), 0.006, 0.0)                                           # which value wins?
knock(C(MA, 'series', -0.1), 0.009, 0.0); chord([C4, F4, A4], C(MA, 'series', 0.1), 0.012, 0.0, 0.16)   # master data: F major
tMa = C(MA, 'map')
air(tMa - 0.3, 1.0, 0.006, 0.0); knock(tMa + 0.2, 0.008, px(340))                                  # the map: its bands, its objects
pane(W(MA, 'map', 'names its home', -0.2), 0.006, px(1280))                                         # each home, a star
air(W(MA, 'map', 'a line back', 0.2), 1.0, 0.005, px(960), 200, 900)                                # each copy's line back
air(C(MA, 'breath', 0.4), 2.0, 0.005, 0.0, 200, 1000)                                               # the light along each line

# 8. From where it was made: Chile again (the opening's chord); each number born at its factory (C 3); sent once a day; Santiago read
#    copies, with their lines back. The utility: one home (C 3) and every copy a line back (its harmonics: the figure, once more);
#    October: the call finds the cut, the measure counts them; since July, none created twice; how does it travel? (D, left open);
#    the end card, to the series' mark.
BK = 'back'
chord([C4, E4, G4, C5], C(BK, 'chile', -0.1), 0.012, 0.0, 0.16)                                    # Chile again: the opening's chord
mono(C3, W(BK, 'chile', 'born in its factory', -0.1), 0.02, px(260))                               # each number, born at its factory
air(W(BK, 'chile', 'sent from there'), 1.9, 0.006, px(800), 200, 1000)                              # the strips fly to Santiago
pane(W(BK, 'chile', 'once a day', -0.2), 0.006, px(1620))                                           # once a day
paper(W(BK, 'read', 'read copies', -0.2), 0.008, px(1480), 0.45)                                    # read as copies
air(W(BK, 'read', 'knew where', -0.2), 1.2, 0.005, px(800))                                         # each with its line back
mono(C3, W(BK, 'utility', 'one home', 0.1), 0.022, px(1600))                                       # one home
copies(W(BK, 'utility', 'a line back', 0.1), 0.011, -0.15)                                          # every copy: its harmonics
paper(C(BK, 'october', 0.1), 0.007, px(960), 0.4)                                                   # October
knock(W(BK, 'october', 'power went out', 0.4), 0.007, px(640))                                      # the family calls
pane(W(BK, 'october', 'found the cut'), 0.006, px(320))                                             # the call finds the cut
gbar(C5, W(BK, 'october', 'counted them', 0.1), 0.011, px(960))                                    # and the measure counts them
pane(C(BK, 'since', -0.1), 0.006, 0.0)                                                              # since July: none created twice
air(W(BK, 'next', 'A meter reading', -0.2), 1.8, 0.005, px(1080), 200, 900)                        # a replaced reading, on its way
gbar(D5, W(BK, 'next', 'How does it travel', 0.1), 0.0105, 0.0)                                    # how does it travel? left open
damark(C(BK, 'breath', 0.9), 0.014, 0.0)                                                            # the end card: the mark
