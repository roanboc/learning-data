# Who owns which data: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py),
# and checked by tools/quiet.py (the governance films' check: when the music plays, how often, how loud, no repeats, no beats, no pulse,
# held notes kept level).
#
# The film's palette (its row in the series' palette register, 12 November 2026): rototoms and timpani, two instruments the site has,
# paired for the first time, as the register allows where nothing new fits (an assumption in the film's assumptions file, with the
# question on the author's checklist).
# The rototoms: small tuned drums with no shell, struck softly with felt mallets, dry and warm, never rolled and never a run. Each drum is
# tuned to its note by turning it on its own stand, so whoever plays it sets its note, as each factory in Beer's design solved its own
# problems first and each domain answers for its own data. Middle notes (F 3 to D 5), one drum at a time, short phrases with room
# between them, never a steady beat.
# Their partner: timpani, two kettles tuned to B flat 2 and F 2, struck softly with felt sticks and left to ring, never rolled: the
# orchestra's centre, played only where something isn't solved in time and goes up (the warning that reaches that industry's committee in
# the opening, and again when the film comes back to Chile; the tables nobody claimed in time at the utility, archived), and under the
# series' mark.
# Kept apart from the films that have them: the drums sit lower and warmer than Five stages, not a switch's (E flat 4 to C 5, high and
# dry) and are never turned up a step; the timpani sound only where something goes up, never as a wall's weight or under a held organ.
# Nothing Chilean or Andean for Cybersyn (no bombo, no kultrun, no rhythm of a dance): tuned orchestral drums, soft, never a rhythm.
# There is no room round either: they play dry, as the series' other films do.
#
# Keys, tuned pure: B flat major, as just intonation from B flat (every chord's notes are whole-number ratios of each other, so no two
# notes that ring together can beat on a phone's one speaker; no C minor, which isn't pure in it); G minor and D minor for what goes
# wrong (a number out of its range, warnings buried at the centre, the table that kept the old method, the website's wrong answer); F
# major for the next series.
# The series' mark, at the title and at the end card: the root and its fifth, apart (B flat and F), then the third between them, D, which
# makes the chord, each one drum, with the timpani's low B flat under it.
# The film's own figure, *in its own time*: a drum phrase ends open and a drum closes it, as a problem is solved where it's known (the
# factory's manager in the opening; each domain, as in Beer's design; the map at its end). Once in the opening and once at the utility
# the phrase is left open, a rest the length of its set time follows, and the timpani closes it: the warning nobody solved in time, gone
# up to that industry's committee; the tables nobody claimed in three months, archived by the centre.
#
# After the opening story, music comes now and then: a chapter's drums as its picture comes in, a drum under a moment on screen, or a
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
MUS, FXG = 5.5, 2.0
_X = X
def X(sig, start, g=0.3, pan=0.0):
    _X(sig, start, g * FXG, pan)

# ---- just intonation from B flat ----
_JI = {0: 1.0, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def jb(m):
    """a note's pitch (MIDI numbering, B flat 3 = 58) in just intonation from B flat"""
    o, r = divmod(m - 58, 12)
    return 233.0819 * 2.0 ** o * _JI[r]
F2, Bb2, F3, G3, A3, Bb3, C4, D4, Eb4, F4, G4, A4, Bb4, C5, D5 = 41, 46, 53, 55, 57, 58, 60, 62, 63, 65, 67, 69, 70, 72, 74

# ---- the rototoms: the head's modes, an ideal membrane's (1, 1.594, 2.136, 2.296, 2.653, 2.918 times its note), struck about a third
# of the way in with felt, so its note is strongest and the higher modes soft and short; lower and warmer than Five stages': each mode
# rings a little longer, and a lower drum longer still ----
_MODES = ((1.0, 1.0, 0.62), (1.594, 0.34, 0.30), (2.136, 0.16, 0.20), (2.296, 0.10, 0.16), (2.653, 0.05, 0.12), (2.918, 0.03, 0.10))
def roto(m, start, g=0.012, pan=0.0):
    """one rototom struck softly with a felt mallet: its note settles within a few hundredths of a second (not a slide), a soft thump
    from the felt, and nothing above about 2.2 kHz"""
    assert F3 <= m <= D5, 'the rototoms here play F 3 to D 5, not %d' % m
    f = jb(m); k = (233.0 / f) ** 0.3; sec = 2.2; x = tt(sec).astype(np.float64); s = np.zeros_like(x)
    for r, a, d in _MODES:
        fk = f * r
        if fk < 2200:
            s += a * np.exp(-x / (d * k)) * np.sin(2 * np.pi * fk * (x + 0.004 * 0.03 * (1 - np.exp(-x / 0.03))) + 0.4 * r)
    s *= np.minimum(1, x / 0.005) * np.clip((sec - x) / 0.3, 0, 1)
    th = filt(noise(0.05), 'low', 320)[:int(0.05 * SR)] * np.exp(-np.arange(int(0.05 * SR)) / SR / 0.01)
    s[:len(th)] += 0.1 * th / max(1e-9, float(np.abs(th).max()))
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g * MUS, pan)
def phrase(notes, start, step=0.55, g=0.012, pan=0.0):
    """a short phrase: drums one after another, one at a time, `step` seconds apart (never fast enough to be a roll or a run)"""
    for i, m in enumerate(notes):
        roto(m, start + i * step, g, pan)

# ---- the timpani: two kettles, B flat 2 and F 2, felt sticks, left to ring ----
def timp(m, start, g=0.02, pan=0.0, sec=4.5):
    """a timpani stroke, soft, with a felt stick: the head's modes, tuned close to the harmonics of its note (1, 1.5, 2, 2.5, 3), the
    lowest ringing longest and its pitch settling a hair as it starts; a soft thump that's gone at once, and the felt; nothing bright"""
    assert m in (F2, Bb2), 'the timpani here are two kettles, B flat 2 and F 2, not %d' % m
    f = jb(m); x = tt(sec).astype(np.float64); R = np.random.default_rng(int(start * 10) + m)
    ph = 2 * np.pi * np.cumsum(1 + 0.004 * np.exp(-x / 0.08)) / SR; s = np.zeros_like(x)
    for r, a, d in ((1.0, 1.0, 1.0), (1.5, 0.42, 0.6), (2.0, 0.28, 0.42), (2.5, 0.11, 0.3), (3.0, 0.05, 0.22)):
        s += a * np.sin(f * r * ph + R.uniform(0, 6.3)) * np.exp(-x / d)
    s += 0.4 * np.sin(2 * np.pi * f * 0.64 * x) * np.exp(-x / 0.06) + 0.25 * filt(noise(sec), 'low', 450)[:len(x)] * np.exp(-x / 0.007)
    s *= np.minimum(1, x / 0.008) * np.clip((sec - x) / 0.6, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 1400)), start, g * MUS, pan)

# ---- what they play ----
def damark(s, g=0.0125, pan=0.0):
    """the series' mark: B flat and its fifth, F, apart, then the third between them, D, which makes the chord; the timpani's B flat under"""
    roto(Bb3, s, g, pan - 0.3); roto(F4, s + 0.6, g, pan + 0.3)
    roto(D4, s + 1.3, g * 1.05, pan); timp(Bb2, s + 1.3, g * 1.5, pan)
def own_time(notes, start, close, end, g=0.012, pan=0.0, step=0.55, timpani=None):
    """the film's figure, in its own time: a drum phrase that ends open, then, at `end`, the note that closes it: a drum (solved where
    it's known), or the timpani (not solved in time, gone up to the centre)"""
    phrase(notes, start, step, g, pan)
    if timpani:
        timp(timpani, end, g * 1.6, pan)
    else:
        roto(close, end, g, pan)

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
    """something set down for good, or brought to a stop: a low thud and a knock, nothing bright"""
    x = tt(0.4); X(norm(filt((np.sin(2 * np.pi * 75 * x) * np.exp(-x * 11)).astype(np.float32) + 0.15 * noise(0.4) * np.exp(-x * 40), 'low', 900)), s, g * 1.4, pan)
    knock(s + 0.01, g * 0.45, pan)
def tick_(s, g=0.006, pan=0.0):
    """a tick or a cross drawn: a short soft click"""
    x = tt(0.07); X(norm(filt((np.sin(2 * np.pi * 1250 * x) * np.exp(-x * 80) + 0.3 * noise(0.07) * np.exp(-x * 120)).astype(np.float32), 'low', 2000)), s, g, pan)
def air(s, sec=0.9, g=0.008, pan=0.0, lo=140, hi=900):
    """the camera moving on, things coming in together, or a line drawn out: a breath of low air"""
    s_air(s, sec, g * FXG, pan, lo, hi)

# ======================================================================================================================
# 1. Designing freedom: Chile, 1972, in lamp-light, under music: the engineers from factory to factory; about five numbers chosen with
#    each factory's workers and managers; one out of its range (G minor), and the warning; who should it go to?; every warning to
#    Santiago, buried there (G minor, down), the factories waiting; Allende's insistence; room to solve their own; Beer's design: first
#    the factory's own manager, a set time (the figure: a phrase ends open, and the manager's drum closes it as the clock is ticked);
#    the one not solved in time (the figure left open, a rest while its clock runs out, and the timpani's F as it goes up to the
#    committee); each factory's own time, designing freedom (B flat, settled); almost complete control. Then the utility: the catalogue,
#    412 tables, 300 the data team's; the title, to the series' mark. The opening story: music under it.
FR = 'freedom'
phrase([F3, Bb3, D4], S0(FR) + 0.6, 0.6, 0.012, -0.1)                                                 # Chile, 1972
knock(W(FR, 'year', 'engineers', -0.3), 0.009, px(230))                                                # Cybersyn's engineers
air(S0(FR) + 1.2, 2.4, 0.004, px(1050), 150, 700)                                                       # walking to the factory
pane(W(FR, 'five', 'workers', -0.2), 0.006, px(443)); pane(W(FR, 'five', 'managers', -0.2), 0.006, px(640))
tNu = W(FR, 'five', 'five numbers')
paper(tNu - 0.4, 0.008, px(1400), 0.45); pencil(tNu + 0.1, 1.5, 0.004, px(1400))                      # the five numbers, written
phrase([C4, D4], tNu + 0.3, 0.6, 0.011, px(1400))                                                       # chosen
tWa = C(FR, 'warn')
knock(tWa - 0.2, 0.008, px(1450)); air(tWa + 0.0, 1.4, 0.005, px(1450), 200, 1000)                    # one of the five, day by day
phrase([G3, Bb3, D4], W(FR, 'warn', 'out of its range', 0.0), 0.5, 0.012, px(1450))                  # out of its range: G minor
tWr = W(FR, 'warn', 'warning')
paper(tWr - 0.3, 0.008, px(1520), 0.4)                                                                  # OUT OF RANGE
tWh = C(FR, 'who')
air(tWh - 0.6, 1.7, 0.005, 0.0, 150, 800)                                                               # on to the levels
knock(tWh - 0.4, 0.008, px(960)); knock(tWh - 0.1, 0.008, px(960))                                    # the centre; the committee
tTo = W(FR, 'who', 'who')
pane(tTo - 0.1, 0.006, px(960)); roto(D4, tTo + 0.2, 0.011, px(960))                                  # who should it go to?
tSt = W(FR, 'santiago', 'Santiago')
air(tSt - 0.3, 2.2, 0.005, px(960), 200, 1000)                                                          # every warning, to Santiago
tBu = W(FR, 'santiago', 'buried')
paper(tBu - 0.3, 0.007, px(1050), 1.4)                                                                  # the pile on the centre's desk
phrase([D4, Bb3, G3], tBu + 0.1, 0.55, 0.012, px(1050))                                                # buried: G minor, down
pane(W(FR, 'santiago', 'wait', -0.3), 0.006, px(960))                                                  # the factories, waiting
paper(C(FR, 'allende', -0.3), 0.008, px(310), 0.45)                                                    # Allende's insistence
pane(W(FR, 'needed', 'room', -0.2), 0.006, px(960)); pane(W(FR, 'needed', 'only', -0.2), 0.006, px(1190))
phrase([Bb3, C4, D4], W(FR, 'needed', 'only', 0.2), 0.55, 0.011, px(1050))                            # only the ones they couldn't
tFr = C(FR, 'first')
air(tFr - 0.6, 0.8, 0.004, px(1050), 200, 900); pane(tFr - 0.2, 0.006, px(920))                       # the pile cleared; a warning
roto(F4, W(FR, 'first', 'own manager', -0.1), 0.011, px(1060))                                          # first, the factory's own manager
tSe = W(FR, 'time', 'set time')
knock(tSe - 0.4, 0.007, px(960))                                                                        # a clock, its set time
own_time([Bb3, D4, C4], tSe + 0.1, Bb3, C(FR, 'up', 0.4), 0.011, px(960))                             # solved in time: a drum closes it
tIn = W(FR, 'up', 'Only')
pane(tIn - 0.4, 0.006, px(1560))                                                                        # a warning at the fifth
own_time([G3, Bb3, C4], tIn - 0.2, None, W(FR, 'up', 'next level', 0.6), 0.011, px(1560), 0.5, F2)   # not in time: up, the timpani
tEa = W(FR, 'chose', "each factory's time")
knock(tEa - 0.3, 0.007, px(960))                                                                        # each factory's own clock
tDf = W(FR, 'chose', 'designing freedom')
knock(tDf - 0.4, 0.008, px(1420)); phrase([F4, D4, Bb3], tDf + 0.1, 0.6, 0.012, px(1420))            # designing freedom: settled
paper(W(FR, 'control', 'almost complete control', -0.4), 0.008, px(310), 0.45)                         # almost complete control
pane(W(FR, 'control', 'serious problems', 0.0), 0.006, px(310))
tU = C(FR, 'utility')
air(tU - 0.6, 1.2, 0.005, 0.0, 150, 800); phrase([Bb3, F4], tU - 0.2, 0.7, 0.012, 0.0)               # the utility
knock(tU + 0.2, 0.008, px(800))                                                                         # the catalogue
air(W(FR, 'utility', 'catalogue', -0.2), 1.6, 0.004, px(500), 200, 1000)                              # its rows
air(W(FR, 'utility', 'every table', 0.1), 1.8, 0.004, px(800), 200, 1000)                             # every table, a square
pane(W(FR, 'owner', 'three hundred', -0.3), 0.006, px(500))                                            # 300 of them
roto(D4, W(FR, 'owner', 'data team', 0.2), 0.011, px(1300))                                            # the data team's
pane(W(FR, 'owner', 'built them', -0.2), 0.006, px(1100))                                              # owner by default
damark(C(FR, 'breath', 1.2), 0.0125, 0.0)                                                               # the title: the series' mark

# 2. Owned by default: hosting capacity, on the map Grace's; the method, the table, the website; May: older cables carry less, the
#    method changed, the table kept the old one (G minor); nobody told; four months, more solar than the streets could take (D minor);
#    ninety families; nobody was careless. Now and then, from here on.
DF = 'default'
air(S0(DF) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # on to hosting capacity
tHc = W(DF, 'one', 'hosting capacity')
knock(tHc - 0.4, 0.008, px(960)); phrase([D4, F4], tHc - 0.1, 0.6, 0.011, px(960))                   # its table
pane(W(DF, 'one', 'how much solar', -0.2), 0.006, px(960))
knock(C(DF, 'map', -0.3), 0.008, px(320)); knock(W(DF, 'map', "Grace's", -0.2), 0.007, px(320))       # on the map, Grace's
paper(W(DF, 'map', 'defined', -0.2), 0.008, px(370), 0.45)                                             # the engineers' method
air(W(DF, 'built', 'table', -0.2), 1.4, 0.004, px(900), 200, 1000)                                    # method, table, website
knock(W(DF, 'built', 'website', -0.4), 0.008, px(1560)); pane(W(DF, 'built', 'website', -0.1), 0.006, px(1560))
paper(C(DF, 'may', -0.3), 0.007, px(180), 0.4)                                                          # May
pencil(W(DF, 'may', 'changed', -0.2), 0.8, 0.004, px(370))                                             # the method, changed
tKe = W(DF, 'may', 'kept the old')
tick_(tKe - 0.2, 0.005, px(1000)); phrase([G3, D4], tKe - 0.1, 0.6, 0.012, px(1000))                  # the table kept the old one
tNt = W(DF, 'theirs', 'theirs to tell')
pencil(tNt - 0.3, 0.6, 0.004, px(660)); tick_(tNt, 0.005, px(660))                                    # nobody told
pane(W(DF, 'theirs', 'no way to know', -0.2), 0.006, px(1106))
tFm = W(DF, 'four', 'four months')
for i, d in enumerate([0.2, 0.8, 1.4]):
    paper(tFm + d, 0.006, px(180), 0.35)                                                                # June, July, August
tMo = W(DF, 'four', 'more solar')
pane(tMo - 0.2, 0.006, px(1560)); phrase([A3, D4, F4], tMo + 0.1, 0.55, 0.012, px(1560))             # more solar than they could: D minor
air(W(DF, 'ninety', 'bought panels', -0.3), 1.4, 0.004, px(980), 200, 900)                            # ninety families
pane(C(DF, 'ninety', -0.1), 0.006, px(1000))
press(W(DF, 'ninety', 'only part', -0.2), 0.009, px(980))                                              # only part of the power
tNc = W(DF, 'careless', 'Nobody was careless')
knock(tNc - 0.2, 0.008, px(1560)); roto(Bb3, tNc + 0.1, 0.011, px(1560))                              # nobody was careless
pane(W(DF, 'careless', 'one team', -0.2), 0.006, px(1560))

# 3. The business that knows: the rule; each product to whoever owns the capability that creates its data; planning the network,
#    hosting capacity, Grace's; serving customers, accounts, the head of retail's; a measure that crosses domains, the enterprise
#    domain's, Ama's; the data team builds and runs; the centre keeps what all share; as in Beer's design (the figure: a phrase ends
#    open, a drum closes it); on the map with its date.
KN = 'knows'
air(S0(KN) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # down to the rule
tOr = W(KN, 'rule', 'one rule')
knock(tOr - 0.2, 0.008, px(480)); phrase([F4, Bb4], tOr, 0.7, 0.011, 0.0)                             # one rule
pane(W(KN, 'each', 'capability', 0.2), 0.006, px(480))
for k, (lid, w0, lid1, w1, x) in enumerate([('hosting', 'Planning the network', 'hosting', "Grace's", 380),
                                             ('accounts', 'Serving customers', 'accounts', 'head of retail', 960),
                                             ('measure', 'crosses domains', 'measure', 'enterprise domain', 1540)]):
    t0, t1 = W(KN, lid, w0), W(KN, lid1, w1)
    knock(t0 - 0.3, 0.007, px(x)); air(t0 - 0.3, 0.6, 0.003, px(x), 200, 900); knock(t0 + 0.3, 0.007, px(x))
    knock(t1 - 0.2, 0.007, px(x))                                                                       # its capability, its product, its owner
roto(D4, W(KN, 'hosting', "Grace's", 0.2), 0.011, px(380))                                             # Grace's, method and all
roto(Bb4, W(KN, 'measure', 'enterprise domain', 0.2), 0.011, px(1540))                                 # the enterprise domain: Ama
pane(W(KN, 'team', 'builds and runs', -0.3), 0.006, px(500)); pane(W(KN, 'team', 'centre', -0.2), 0.006, px(1340))
tBe = W(KN, 'beer', "Beer's design")
pane(tBe - 0.2, 0.006, px(710))
own_time([D4, F4, C4], tBe + 0.1, Bb3, W(KN, 'beer', 'problems first', 0.2), 0.011, px(710))          # solved first: a drum closes it
press(W(KN, 'date', 'agree', -0.2), 0.009, px(1520))                                                   # on the map, with its date

# 4. Data as a product: what one is; published only with five things, each ticked as it's said; the one catalogue lists them all.
PR = 'product'
air(S0(PR) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # on to the product
tWh = C(PR, 'what')
knock(tWh - 0.2, 0.008, px(960)); phrase([D4, Bb3], tWh + 0.2, 0.7, 0.011, px(960))                  # a data product
pane(tWh + 0.4, 0.006, px(960))
pane(W(PR, 'five', 'five things', -0.2), 0.006, px(700))                                              # its five things, faint
for lid in ['owner', 'docs', 'lineage', 'contract', 'access']:
    tick_(C(PR, lid, 0.1), 0.005, px(560))                                                              # each one, ticked as it's said
tCa = C(PR, 'catalogue')
air(tCa - 0.7, 1.0, 0.004, px(700), 150, 800); knock(tCa - 0.3, 0.008, px(1520))                     # the card moves; the catalogue
air(tCa, 1.6, 0.004, px(1520), 200, 1000)
phrase([F4, Bb3], W(PR, 'catalogue', 'who answers', 0.0), 0.7, 0.011, px(1520))                       # and who answers for it

# 5. Four words: warehouse, lakehouse, mesh, fabric, each card as it's named; different questions; the lakehouse and the mesh; so they
#    mix: the utility's target, one catalogue (settled); one platform or several, the next series (F major).
WD = 'words'
air(S0(WD) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # on to the four words
for k, wd in enumerate(['warehouse', 'lakehouse', 'mesh', 'fabric']):
    knock(W(WD, 'hear', wd, -0.2), 0.007, px(270 + 460 * k))                                            # each card, as it's named
tQu = W(WD, 'differ', 'different questions')
pane(tQu - 0.2, 0.006, px(270)); pane(tQu + 0.4, 0.006, px(1650))                                      # the questions they answer
roto(D4, C(WD, 'lakehouse', 0.3), 0.011, px(730))                                                       # a lakehouse
roto(F4, C(WD, 'mesh', 0.3), 0.011, px(1190))                                                           # a mesh
air(C(WD, 'mix', 0.0), 0.6, 0.004, 0.0, 200, 800)                                                       # the two not in the target, dimmed
pane(W(WD, 'mix', 'mesh of owners', -0.3), 0.006, px(960))
tOc = W(WD, 'mix', 'one catalogue')
knock(tOc - 0.3, 0.008, px(960)); phrase([F4, D4, Bb3], tOc - 0.1, 0.55, 0.011, px(960))             # one catalogue: settled
tPl = C(WD, 'platform', -0.2)
pane(tPl, 0.006, px(960)); phrase([F4, A4, C5], tPl + 0.2, 0.55, 0.011, px(960))                      # the next series: F major

# 6. The target and its gaps: the baseline, as it is, and the target; each difference a gap, into the roadmap with an owner and a
#    quarter; hosting capacity first; three months to claim (the figure left open, a rest while the clock runs, and the timpani's B flat
#    as what nobody claimed is archived); readers told first; retired; the centre steps in only where it isn't solved in time.
GP = 'gaps'
air(S0(GP) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # down to the gaps
knock(W(GP, 'two', 'baseline', -0.3), 0.008, px(460))
tTg = W(GP, 'two', 'target')
knock(tTg - 0.3, 0.008, px(1460)); phrase([D4, Bb3], tTg, 0.7, 0.011, px(1460))                      # as it is, and as it should be
for wd in ['three hundred', 'few', 'email']:
    pencil(W(GP, 'today', wd, -0.3), 0.5, 0.004, px(460))                                               # today's three rows
for wd in ['every table', 'retired', 'only the platform']:
    pencil(W(GP, 'target', wd, -0.3), 0.5, 0.004, px(1460))                                             # the target's three
tGa = C(GP, 'gap')
pane(tGa, 0.006, px(960)); air(tGa, 1.2, 0.004, px(960), 200, 900)                                    # the gaps between them
knock(W(GP, 'gap', 'roadmap', -0.3), 0.008, px(700)); knock(W(GP, 'gap', 'quarter', -0.1), 0.007, px(860))
knock(W(GP, 'hurts', 'hosting capacity', -0.3), 0.007, px(260)); knock(W(GP, 'hurts', 'most readers', -0.3), 0.007, px(560))
tCl = W(GP, 'three', 'claim')
knock(tCl - 0.3, 0.007, px(260)); knock(tCl - 0.2, 0.006, px(480))                                    # claim the tables; the clock
tAr = W(GP, 'unclaimed', 'archived')
own_time([D4, F4, G4], tCl - 0.1, None, tAr - 0.3, 0.011, px(480), 0.55, Bb2)                         # not claimed in time: the centre
air(tAr + 0.1, 1.4, 0.004, px(1610), 200, 900)                                                         # into the archive
pane(W(GP, 'unclaimed', 'told first', -0.2), 0.006, px(1610))
press(W(GP, 'unclaimed', 'retired', -0.2), 0.009, px(1610))                                            # then retired
pane(C(GP, 'centre', -0.1), 0.006, px(960))                                                            # the centre steps in only...

# 7. On the map: the data practice's map, its domains and their concepts; the enterprise domain joins; a data product in each domain;
#    hosting capacity brings together its contract and its data, Grace's; every table points to its product; the map and the platform
#    say the same thing (settled); in the wordless moment, the figure once more, a drum closing it.
MP = 'map'
air(S0(MP) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # over to the map
tDo = C(MP, 'domains')
knock(tDo - 0.3, 0.008, px(960)); pane(tDo + 0.2, 0.006, px(960))                                     # the bands; the domains
phrase([D4, F4], tDo + 0.3, 0.7, 0.011, px(700))
tCo = W(MP, 'domains', 'concepts')
pencil(tCo - 0.2, 1.0, 0.004, px(700)); knock(tCo + 0.3, 0.007, px(700))                              # their concepts; their owners
knock(W(MP, 'enterprise', 'cross them', -0.2), 0.008, px(1620)); roto(G4, C(MP, 'enterprise', 0.0), 0.011, px(1620))  # it joins
tPr = C(MP, 'product')
knock(tPr + 0.2, 0.008, px(400)); air(tPr + 0.2, 1.4, 0.004, px(960), 200, 900)                      # a product in each domain
tBr = W(MP, 'hosting', 'brings together')
pencil(tBr - 0.3, 0.8, 0.004, px(280))                                                                  # its contract and its data
roto(D4, W(MP, 'hosting', 'Grace owns', 0.2), 0.011, px(280))                                          # and Grace owns it
air(W(MP, 'same', 'points to its product', -0.3), 1.4, 0.004, px(1200), 200, 1000)                    # every table, pointing
tSt = W(MP, 'same', 'same thing')
pane(tSt - 0.2, 0.006, px(960)); phrase([C4, D4, Bb3], tSt, 0.6, 0.011, px(960))                     # the same thing: settled
own_time([F4, G4], C(MP, 'breath', 0.3), Bb3, C(MP, 'breath', 1.9), 0.0105, px(280), 0.6)            # the product, in a wordless moment

# 8. Solved where it's known: Chile again, each factory first, the one not solved in time up to the committee (the timpani's F); the
#    utility: each domain first; 246 claimed, in 31 products; 54 archived; the next method, a new version; readers told a week ahead,
#    and no family bought panels its street couldn't take (B flat, the benefit); who keeps them speaking one language? (left open);
#    the end card, to the series' mark.
BK = 'back'
phrase([Bb3, D4], S0(BK) + 0.4, 0.7, 0.012, -0.1)                                                     # Chile again
tFi = W(BK, 'chile', 'first')
knock(tFi - 0.2, 0.006, px(960))                                                                        # each factory first
tNo = W(BK, 'chile', 'not solved in time')
pane(tNo - 0.6, 0.006, px(1560)); timp(F2, tNo + 0.8, 0.018, px(1200))                                # up to the committee
tUt = C(BK, 'utility')
air(tUt - 0.6, 1.2, 0.005, 0.0, 150, 800); phrase([F4, Bb4], tUt - 0.2, 0.7, 0.011, 0.0)             # the utility
pane(W(BK, 'utility', 'solves', -0.2), 0.006, px(800))
tTw = W(BK, 'claimed', 'two hundred')
air(tTw - 0.2, 1.6, 0.005, px(800), 200, 1000); pane(tTw + 0.2, 0.006, px(500))                       # 246 claimed
press(W(BK, 'archived', 'other', -0.2), 0.009, px(1300))                                               # 54 archived
tMe = C(BK, 'method')
air(tMe - 0.7, 1.7, 0.004, 0.0, 150, 800)                                                               # on to hosting capacity
pencil(W(BK, 'method', 'changed their method', -0.2), 0.8, 0.004, px(370))                            # the next method
tNv = W(BK, 'method', 'new version')
tick_(tNv - 0.1, 0.005, px(960)); roto(D4, tNv + 0.2, 0.011, px(960))                                 # a new version
pane(W(BK, 'told', 'week ahead', -0.2), 0.006, px(1560))                                               # readers told a week ahead
tNf = W(BK, 'told', 'no family')
knock(tNf - 0.2, 0.008, px(1500)); phrase([Bb3, D4, F4], tNf + 0.1, 0.6, 0.012, px(1500))            # no family bought panels
tLa = W(BK, 'next', 'one language')
pane(tLa - 0.4, 0.006, 0.0); roto(G4, tLa - 0.1, 0.0105, 0.0)                                         # one language? left open
damark(C(BK, 'breath', 1.0), 0.0125, 0.0)                                                               # the end card: the mark
