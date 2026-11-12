# One language, kept: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py),
# and checked by tools/quiet.py (the governance films' check: when the music plays, how often, how loud, no repeats, no beats, no pulse,
# held notes kept level).
#
# The film's palette (its row in the series' palette register, 12 November 2026): a hammered dulcimer and low handbells, two instruments
# the site has, paired for the first time, as the register allows where nothing new fits (an assumption in the film's assumptions file,
# with the question on the author's checklist). No film of this topic plays either: the dulcimer is played only in The marketplace (with
# cup-muted trumpets, in A major) and handbells only in the governance films.
# The dulcimer: strings struck softly with light hammers faced with leather, each note left to ring a moment and then damped. Each course
# is two strings tuned exactly together, so a note sounds as one and never beats, as one name used the same way everywhere reads as one
# word. Middle and upper notes (E flat 3 to B flat 5), nothing above about 2.2 kHz. Under the opening story it spreads its chords from
# the bass up; after it, it gives single notes and short phrases as a name is built, checked or kept.
# The handbells: low ones only (E flat 3 to E flat 4), each rung once, softly, by the ringer who holds it, and damped at the shoulder
# after a second or so, never a peal. A handbell choir plays its tune only when every ringer reads the same score, as every domain uses
# the glossary's words: a bell answers only where a name agrees with what is kept.
# Kept apart from The marketplace: E flat, not A major; no trumpets; the dulcimer's answer comes from a bell, and only when a name
# agrees. Kept apart from the governance films' handbells: low bells only, one at a time. Nothing Chilean or Andean for Cybersyn (no
# charango, quena, zampona or bombo): the story is told in the series' own voice. There is no room round either: they play dry, as the
# series' other films do.
#
# Keys, tuned pure: E flat major, as just intonation from E flat (every chord's notes are whole-number ratios of each other, so no two
# notes that ring together can beat on a phone's one speaker; no F minor, which isn't pure in it, and F never with C or A flat); C minor
# and G minor for what goes wrong (a factory in trouble that looks like the rest, the points of crisis, the January storm, the option
# turned down, what Cybersyn never did).
# The series' mark, at the title and at the end card: the root and its fifth, apart (E flat and B flat), then the third between them, G,
# which makes the chord, on the dulcimer, with a low handbell's E flat under it.
# The film's own figure, *one name*: two dulcimer notes, B flat up to E flat, answered by a handbell's E flat: a name that agrees with
# what is kept (social unease, defined once; account holder start date, built from its parts; app user, defined in the glossary first;
# the practice that matures one change at a time). The app's "customer" plays the same two notes but ends a step off, on F, and no bell
# answers (the change that opens the film, and again where the review flags it).
# At the coup there is no music, and no sound but what the picture shows.
#
# After the opening story, music comes now and then: a chapter's notes as its picture comes in, a note under a moment on screen, or a
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

# ---- just intonation from E flat ----
_JI = {0: 1.0, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def je(m):
    """a note's pitch (MIDI numbering, E flat 3 = 51) in just intonation from E flat"""
    o, r = divmod(m - 51, 12)
    return 155.5635 * 2.0 ** o * _JI[r]
Eb3, G3, Ab3, Bb3, C4, D4, Eb4, F4, G4, Ab4, Bb4, C5, Eb5, Bb5 = 51, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70, 72, 75, 82

# ---- the hammered dulcimer: a struck string's harmonics, the string struck near its bridge (about an eighth of its length in), by a
# light hammer faced with leather, so the higher harmonics are soft and short; each course two strings tuned exactly together, so the
# note is one note and never beats; left to ring a moment, then damped ----
def dulc(m, start, g=0.011, pan=0.0, sec=2.2):
    """one dulcimer note: a quick, soft strike (the leather), harmonics that die away faster the higher they are, a lower course ringing
    a little longer, nothing above about 2.2 kHz; damped after `sec` seconds"""
    assert Eb3 <= m <= Bb5, 'the dulcimer here plays E flat 3 to B flat 5, not %d' % m
    f = je(m); k = (233.0 / f) ** 0.35; x = tt(sec).astype(np.float64); s = np.zeros_like(x)
    for n in range(1, 12):
        fn = f * n
        if fn > 2200:
            break
        a = abs(np.sin(np.pi * n * 0.12)) / n ** 0.9 / (1 + (fn / 1500.0) ** 2)
        s += a * np.exp(-x / (1.9 * k / (1 + 0.55 * (n - 1)))) * np.sin(2 * np.pi * fn * x + 0.3 * n)
    s *= np.minimum(1, x / 0.003) * np.clip((sec - x) / 0.22, 0, 1)
    th = filt(noise(0.04), 'low', 500)[:int(0.04 * SR)] * np.exp(-np.arange(int(0.04 * SR)) / SR / 0.008)
    s[:len(th)] += 0.06 * th / max(1e-9, float(np.abs(th).max()))
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g * MUS, pan)
def spread(notes, start, step=0.2, g=0.011, pan=0.0, sec=2.6):
    """a chord spread from the bass up, one course after another, `step` seconds apart"""
    for i, m in enumerate(notes):
        dulc(m, start + i * step, g, pan, sec - i * step * 0.5)
def phrase(notes, start, step=0.5, g=0.011, pan=0.0, sec=2.0):
    """a short phrase: notes one after another, never fast enough to be a run"""
    for i, m in enumerate(notes):
        dulc(m, start + i * step, g, pan, sec)

# ---- the handbells: low bells, rung once and damped at the shoulder. A handbell is tuned so its note and the twelfth above it (three
# times its pitch) ring together, pure; its few other partials are faint and gone at once, so nothing it rings with can beat ----
def hbell(m, start, g=0.012, pan=0.0, sec=1.5):
    """one handbell, rung softly: its note and its twelfth, a faint brightness gone within a tenth of a second, the clapper's soft
    touch; damped at the shoulder after `sec` seconds"""
    assert Eb3 <= m <= Eb4, 'the handbells here are E flat 3 to E flat 4, not %d' % m
    f = je(m); x = tt(sec).astype(np.float64); R = np.random.default_rng(int(start * 10) + m); s = np.zeros_like(x)
    for r, a, d in ((1.0, 1.0, 2.8), (3.0, 0.34, 1.1), (2.0, 0.04, 0.5), (5.3, 0.05, 0.1), (7.9, 0.02, 0.07)):
        if f * r < 2100:
            s += a * np.exp(-x / d) * np.sin(2 * np.pi * f * r * x + R.uniform(0, 6.3))
    s *= np.minimum(1, x / 0.006) * np.clip((sec - x) / 0.3, 0, 1)
    th = filt(noise(0.03), 'low', 900)[:int(0.03 * SR)] * np.exp(-np.arange(int(0.03 * SR)) / SR / 0.005)
    s[:len(th)] += 0.04 * th / max(1e-9, float(np.abs(th).max()))
    put(norm(filt(s.astype(np.float32), 'low', 2100)), start, g * MUS, pan)

# ---- what they play ----
def damark(s, g=0.0115, pan=0.0):
    """the series' mark: E flat and its fifth, B flat, apart, then the third between them, G, which makes the chord; a low handbell's E
    flat under it"""
    dulc(Eb4, s, g, pan - 0.3, 2.8); dulc(Bb4, s + 0.6, g, pan + 0.3, 2.4)
    dulc(G4, s + 1.3, g * 1.05, pan, 2.6); hbell(Eb3, s + 1.3, g * 1.1, pan, 2.2)
def one_name(s, g=0.011, pan=0.0):
    """the film's figure, one name: B flat up to E flat on the dulcimer, and a handbell's E flat answers: a name that agrees with what
    is kept"""
    dulc(Bb3, s, g, pan, 1.6); dulc(Eb4, s + 0.45, g, pan, 2.2); hbell(Eb4, s + 1.0, g * 1.05, pan, 1.6)
def customer(s, g=0.011, pan=0.0):
    """the app's "customer": the same two notes, but the second a step off, on F; no bell answers"""
    dulc(Bb3, s, g, pan, 1.6); dulc(F4, s + 0.45, g, pan, 1.8)

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
    """something brought to a stop: a low thud and a knock, nothing bright"""
    x = tt(0.4); X(norm(filt((np.sin(2 * np.pi * 75 * x) * np.exp(-x * 11)).astype(np.float32) + 0.15 * noise(0.4) * np.exp(-x * 40), 'low', 900)), s, g * 1.4, pan)
    knock(s + 0.01, g * 0.45, pan)
def tick_(s, g=0.006, pan=0.0):
    """a tick or a cross drawn: a short soft click"""
    x = tt(0.07); X(norm(filt((np.sin(2 * np.pi * 1250 * x) * np.exp(-x * 80) + 0.3 * noise(0.07) * np.exp(-x * 120)).astype(np.float32), 'low', 2000)), s, g, pan)
def telex(s, n=5, g=0.004, pan=0.0):
    """a telex printing, far off: a few soft, low key strikes, uneven, never a burst"""
    r = np.random.default_rng(int(s * 10) % 991)
    for i in range(n):
        x = tt(0.06); X(norm(filt((np.sin(2 * np.pi * 620 * x) * np.exp(-x * 110) + 0.4 * noise(0.06) * np.exp(-x * 160)).astype(np.float32), 'low', 1600)),
                        s + i * 0.3 + r.uniform(-0.05, 0.05), g * r.uniform(0.75, 1.0), pan)
def air(s, sec=0.9, g=0.008, pan=0.0, lo=140, hi=900):
    """the camera moving on, things coming in together, or a line drawn out: a breath of low air"""
    s_air(s, sec, g * FXG, pan, lo, hi)

# ======================================================================================================================
# 1. The same words: Chile, 1972, in lamp-light, under music: factories send their numbers to Cybersyn's team by telex, once a day (E
#    flat, spread from the bass up); one factory's number beside another's; counted two ways, the factory in trouble looks like the
#    rest (C minor); Santiago needed the same words; social unease, defined one way for every factory (the figure, one name: a bell
#    answers); the operations room, the same icons for anyone (A flat); after the strike, one report a day at CORFO, taken by hand to
#    the palace, its points of crisis (G minor). Then the utility: the app team's change, its first table called customer (the figure
#    ends on F, unanswered); customer means three things already; caught in review. The title, to the series' mark. The opening story:
#    music under it.
SA = 'same'
spread([Eb3, G3, Bb3, Eb4], S0(SA) + 0.6, 0.22, 0.0115, -0.15, 3.0)                                 # Chile, 1972
tFa = W(SA, 'year', 'factories')
air(tFa - 0.2, 2.0, 0.004, px(330), 150, 800)                                                          # numbers along the lines
knock(W(SA, 'year', "Cybersyn's team", -0.3), 0.008, px(1500))                                        # Cybersyn's team, Santiago
telex(W(SA, 'year', 'telex', -0.1), 5, 0.004, px(820))                                                # the telex
tOd = W(SA, 'year', 'once a day')
for i in range(4):
    paper(tOd - 0.2 + i * 0.55, 0.006, px(1330), 0.35)                                                 # the day's strips, one by one
dulc(Bb3, tOd + 0.4, 0.0105, px(1330), 2.4)                                                            # once a day
tOn = W(SA, 'same', "one factory's")
paper(tOn - 0.3, 0.008, px(300), 0.45); dulc(G3, tOn, 0.0105, px(300), 2.0)                          # one factory's sheet
tAn = W(SA, 'same', "another's")
paper(tAn - 0.3, 0.008, px(1620), 0.45); dulc(G3, tAn, 0.0105, px(1620), 2.0)                        # another's
pane(W(SA, 'same', 'measured the same way', -0.2), 0.006, px(960))                                    # the same way?
pencil(W(SA, 'absent', 'one way', -0.1), 1.0, 0.004, px(300))                                         # every absence counted
tAw = W(SA, 'absent', 'another way')
pencil(tAw - 0.1, 1.0, 0.004, px(1620)); pane(tAw + 0.2, 0.006, px(960))                             # absent without leave, only; not equal
phrase([C4, G3], W(SA, 'absent', 'in trouble', -0.1), 0.55, 0.011, px(1620), 2.2)                    # in trouble, like the rest: C minor
tCo = W(SA, 'needed', 'compare')
pane(tCo - 0.3, 0.006, px(960)); phrase([D4, Eb4], tCo - 0.1, 0.5, 0.0105, px(960), 2.0)             # to compare them, and add them up
tEf = W(SA, 'unease', "every factory's model")
knock(tEf - 0.3, 0.008, px(960))                                                                        # the one definition
pencil(W(SA, 'unease', 'share of the workers', -0.2), 1.0, 0.004, px(960))                            # how it's worked out
tPa = W(SA, 'unease', 'payroll')
paper(tPa - 0.2, 0.007, px(300), 0.4); paper(tPa, 0.007, px(1620), 0.4)                              # pinned over both sheets
one_name(tPa + 0.3, 0.011, px(960))                                                                    # one way, for every factory
tick_(tPa + 0.5, 0.005, px(1500))                                                                      # factory 31: 11%
tOp = W(SA, 'icons', 'operations room')
air(tOp - 0.5, 1.2, 0.005, 0.0, 150, 800); spread([Ab3, C4, Eb4], tOp - 0.1, 0.22, 0.0105, 0.0, 2.6)  # the operations room
air(W(SA, 'icons', 'same icons', -0.2), 1.4, 0.004, px(960), 200, 1000)                               # every factory, the same icons
pane(W(SA, 'icons', 'anyone', -0.1), 0.006, px(960))                                                  # anyone could read them
tRe = C(SA, 'report')
air(tRe - 0.7, 1.7, 0.004, 0.0, 150, 800)                                                               # on to CORFO
tOr = W(SA, 'report', 'one report')
paper(tOr - 0.3, 0.008, px(400), 0.45); dulc(Eb4, tOr, 0.0105, px(400), 2.2)                        # one report
knock(W(SA, 'report', 'every day', -0.3), 0.008, px(400))                                              # written every day at CORFO
tHa = W(SA, 'days', 'Taken by hand')
air(tHa - 0.1, 1.6, 0.004, px(700), 200, 900)                                                          # taken by hand
pane(W(SA, 'days', 'presidential palace', -0.3), 0.006, px(1520))                                     # the presidential palace
pencil(W(SA, 'days', 'national production', -0.2), 0.9, 0.004, px(1000))                             # national production
phrase([G3, Bb3], W(SA, 'days', 'points of crisis', -0.1), 0.5, 0.0105, px(1000), 2.0)               # the points of crisis: G minor
pencil(W(SA, 'days', 'few days old', -0.5), 0.8, 0.004, px(1000))                                     # a few days old
tU = C(SA, 'utility')
air(tU - 0.6, 1.2, 0.005, 0.0, 150, 800)                                                                # the utility
knock(W(SA, 'utility', 'opens a change', -0.3), 0.008, px(450))                                       # the app team's change
customer(W(SA, 'utility', 'called customer', 0.2), 0.011, px(450))                                    # called customer: ends on F
knock(C(SA, 'fourth', -0.2), 0.008, px(1370))                                                           # the glossary
tTh = W(SA, 'fourth', 'three things')
for i in range(3):
    pane(tTh - 0.2 + i * 0.3, 0.005, px(1100))                                                          # its three meanings
tick_(W(SA, 'fourth', 'a fourth', -0.2), 0.005, px(1100))                                             # a fourth?
press(W(SA, 'caught', 'catches', -0.1), 0.008, px(450))                                                # caught in review
tick_(W(SA, 'caught', 'before it reaches', -0.2), 0.005, px(300))                                     # stopped, before a table
damark(C(SA, 'breath', 1.2), 0.0115, 0.0)                                                               # the title: the series' mark

# 2. A fourth meaning: everyone who signs in; read as one of the other three; the January storm (C minor); the review flags it (the
#    figure ends on F once more, unanswered); what the data architecture keeps, in the repository with the map. Now and then, from here.
FO = 'fourth'
tEv = W(FO, 'signs', 'everyone')
phrase([Eb4, G4], tEv - 0.1, 0.5, 0.0105, px(1425), 2.0)                                              # everyone who signs in
for wd in ['account holder', 'partner', 'tenant', 'grown-up child']:
    pane(W(FO, 'signs', wd, -0.2), 0.005, px(1425))                                                     # each one, as they're named
tTa = W(FO, 'read', 'take it')
for i in range(3):
    tick_(tTa + 0.1 + i * 0.5, 0.004, px(860))                                                          # read as any of the three
tSn = W(FO, 'storm', 'six names')
pane(tSn - 0.3, 0.006, px(960)); phrase([C4, G3], tSn + 0.2, 0.55, 0.011, px(960), 2.2)             # the January storm: C minor
pane(W(FO, 'flag', 'three meanings', -0.2), 0.006, px(1300))
tCb = W(FO, 'flag', "can't be called")
tick_(tCb - 0.2, 0.005, px(300)); customer(tCb + 0.1, 0.0105, px(450))                               # flagged: still a step off
tKe = C(FO, 'keeps')
air(tKe - 0.6, 1.7, 0.004, 0.0, 150, 800)                                                               # over to the repository
knock(tKe + 0.5, 0.008, px(850))
for wd in ['with the map', 'names', 'reference model', 'principles', 'decisions']:
    knock(max(W(FO, 'keeps', wd), tKe + 1.0) - 0.2, 0.006, px(850))                                    # each folder, as it's named
spread([Eb4, G4, Bb4], tKe + 0.7, 0.25, 0.0105, px(850), 2.4)                                         # what it keeps
air(tKe + 1.2, 1.0, 0.004, px(200), 200, 900)                                                          # read by the review

# 3. Names with parts: the standard; the thing, from the glossary (E flat), what about it (G), the kind of value (B flat), each as it's
#    named; the whole name (the figure: a bell answers); defined once, as social unease was; customer never a name on its own; older
#    names mapped once.
NA = 'names'
air(S0(NA) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # on to the names
pane(W(NA, 'parts', 'international standard', -0.3), 0.006, px(960))
tAh = W(NA, 'thing', 'account holder')
knock(tAh - 0.2, 0.007, px(400)); dulc(Eb4, tAh, 0.0105, px(400), 2.0)                               # the thing, from the glossary
tSt = W(NA, 'about', 'start')
knock(tSt - 0.2, 0.007, px(700)); dulc(G4, tSt, 0.0105, px(700), 2.0)                                # what about it
pane(W(NA, 'kind', 'short list', -0.3), 0.005, px(400))                                               # the short list of kinds
tDa = W(NA, 'kind', 'a date')
knock(tDa - 0.2, 0.007, px(900)); dulc(Bb4, tDa, 0.0105, px(900), 1.8)                               # the kind of value: a date
one_name(W(NA, 'kind', 'Account holder start date', 0.1), 0.011, px(600))                            # the whole name: it agrees
pane(W(NA, 'once', 'social unease', -0.2), 0.006, px(1510))                                           # as with social unease
knock(W(NA, 'once', 'defined once', -0.3), 0.007, px(1510))                                           # defined once
tick_(W(NA, 'never', 'like customer', -0.2), 0.005, px(1400))                                         # customer: never on its own
tCp = W(NA, 'old', 'connection point')
pencil(W(NA, 'old', 'premise', -0.5), 0.8, 0.004, px(500)); knock(tCp - 0.1, 0.007, px(700))        # premise, mapped once

# 4. The industry's words: the Common Information Model (A flat); its four words; the utility's own words mapped to them, line by line;
#    a new system or a partner matched through words they already know; whoever signs in is none of the three: a D left open.
MO = 'model'
air(S0(MO) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # on to the model
tCi = max(W(MO, 'industry', 'Common Information Model'), S0(MO) + 2.6)
knock(tCi - 0.3, 0.008, px(1350)); spread([Ab3, C4, Eb4], tCi, 0.22, 0.0105, px(1350), 2.4)         # the industry's words
for lid, wd in [('usage', 'usage point'), ('usage', 'service location'), ('party', 'a customer'), ('party', 'customer account')]:
    pane(W(MO, lid, wd, -0.2), 0.005, px(1350))                                                         # each of its words
knock(W(MO, 'map', 'own words', -0.3), 0.007, px(500))                                                 # the utility's own words
pencil(W(MO, 'map', 'a connection point', -0.1), 0.9, 0.004, px(900))                                 # mapped, line by line
pencil(W(MO, 'map', 'an account holder', -0.1), 0.9, 0.004, px(900))
tNs = W(MO, 'why', 'new system')
pane(tNs - 0.3, 0.006, px(1690)); pane(W(MO, 'why', 'partner', -0.3), 0.006, px(1690))               # a new system, a partner
tKn = W(MO, 'why', 'already know')
pane(tKn - 0.3, 0.005, px(1690)); phrase([C4, Eb4], tKn, 0.5, 0.0105, px(1500), 2.0)                 # through words they already know
tNo = W(MO, 'none', 'none of the three')
tick_(tNo - 0.3, 0.005, px(500)); dulc(D4, tNo + 0.2, 0.0105, px(500), 2.4)                          # none of the three: left open

# 5. A few principles: a rule, why it holds, what follows (a settled third); one name, from the glossary, and the 180 households (C);
#    one home; flows with their contracts; and every table in a data product, owned by the business that creates its data (B flat).
PR = 'principles'
air(S0(PR) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # on to the principles
tSr = max(W(PR, 'few', 'short rule'), S0(PR) + 2.7)
knock(tSr - 0.3, 0.008, px(500)); phrase([G4, Eb4], tSr, 0.5, 0.0105, px(500), 2.2)                  # a principle: a short rule
pencil(W(PR, 'few', 'why it holds', -0.2), 0.6, 0.004, px(500)); pencil(W(PR, 'few', 'what follows', -0.2), 0.6, 0.004, px(500))
dulc(C4, W(PR, 'name', 'households', 0.0), 0.0105, px(500), 2.2)                                     # 180 households without a text
knock(C(PR, 'home', -0.1), 0.007, px(1420)); pencil(W(PR, 'home', 'every copy', -0.4), 0.7, 0.004, px(1420))
knock(C(PR, 'flow', -0.1), 0.007, px(500)); pencil(W(PR, 'flow', 'contract', -0.5), 0.7, 0.004, px(500))
knock(C(PR, 'product', -0.1), 0.007, px(1420))
tOb = W(PR, 'product', 'owned by')
pencil(tOb - 0.5, 0.7, 0.004, px(1420)); spread([Bb3, D4, F4], tOb, 0.22, 0.0105, px(1420), 2.4)   # owned by the business: B flat

# 6. Decisions, written down: the record beside the map (its fields, as they're named); decision seven, decided by Grace, the head of
#    retail and Ama on 14 October; why; the option turned down (C minor); what follows; it outlives the meeting, and the next team
#    reads why (E flat, rising).
DE = 'decisions'
air(S0(DE) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # on to the decisions
paper(max(W(DE, 'record', 'written down'), S0(DE) + 2.6) - 0.3, 0.008, px(400), 0.45)                 # the decisions folder
tWh = max(W(DE, 'record', 'what was decided'), S0(DE) + 2.8)
paper(tWh - 0.3, 0.009, px(1320), 0.5); phrase([Bb3, Eb4, G4], tWh, 0.45, 0.0105, px(1320), 2.2)   # a record, written down
tick_(C(DE, 'seven', -0.1), 0.005, px(400))                                                            # decision 7
pencil(W(DE, 'seven', 'customer is never', -0.2), 1.0, 0.004, px(1320))
tGr = W(DE, 'seven', 'Grace')
air(tGr - 0.4, 1.0, 0.004, px(400), 200, 900); knock(tGr - 0.1, 0.007, px(1320))                    # the three who decided
pencil(C(DE, 'why', 0.2), 0.8, 0.004, px(1320))                                                        # why
tEl = W(DE, 'else', 'one definition')
pencil(tEl - 0.2, 0.8, 0.004, px(1320)); phrase([Eb4, C4], tEl + 0.1, 0.55, 0.0105, px(1320), 2.2)  # turned down: C minor
pencil(C(DE, 'follows', 0.1), 0.8, 0.004, px(1320))                                                    # what follows
air(W(DE, 'outlives', 'meeting', 0.2), 1.4, 0.004, px(400), 150, 700)                                 # the meeting goes
tNt = W(DE, 'outlives', 'next team')
pane(tNt - 0.2, 0.006, px(400)); spread([Eb4, G4, Bb4], tNt + 0.2, 0.25, 0.0105, px(400), 2.4)     # the next team reads why

# 7. Kept with every change: back to the change; checked against what's kept; the data team reviews; retail asked in a ticket; the head
#    of retail defines app user in the glossary first; the table built from it, the check and the review pass (the figure: a bell
#    answers); on the map, app user joins retail's concepts with its owner and decision 7; in the wordless moment, E flat and a low bell.
KE = 'kept'
air(S0(KE) + 0.8, 1.7, 0.004, 0.0, 150, 800)                                                            # back to the change
tCh = max(W(KE, 'every', 'checked against'), S0(KE) + 2.6)
pane(tCh - 0.2, 0.006, px(960)); phrase([G3, Eb4], tCh, 0.55, 0.0105, px(960), 2.2)                  # every change, checked
knock(W(KE, 'team', 'data team', -0.3), 0.007, px(270))                                                # reviewed by the data team
pane(W(KE, 'team', "isn't theirs", -0.2), 0.005, px(370))                                             # not theirs to decide
paper(W(KE, 'ticket', 'in a ticket', -0.3), 0.009, px(1540), 0.45)                                    # a ticket to retail
knock(W(KE, 'ticket', 'head of retail', -0.2), 0.007, px(1700))
pencil(W(KE, 'ticket', 'glossary first', -0.2), 1.0, 0.004, px(1380))                                # app user, in the glossary first
pane(C(KE, 'term', 0.2), 0.005, px(1380))
pencil(W(KE, 'built', 'app user', -0.2), 0.8, 0.004, px(300))                                         # the table, built from it
tCp = W(KE, 'built', 'check passes')
tick_(tCp - 0.1, 0.005, px(300)); one_name(tCp + 0.1, 0.011, px(450))                                # the check passes: it agrees
tick_(W(KE, 'built', 'so does the review', -0.1), 0.005, px(300))                                     # and so does the review
tMp = C(KE, 'map')
air(tMp - 0.9, 1.7, 0.004, 0.0, 150, 800)                                                               # over to the map
knock(max(W(KE, 'map', 'app user'), tMp + 0.8) - 0.1, 0.007, px(760))                                # app user joins retail
pane(W(KE, 'map', 'its owner', 0.0), 0.005, px(830))                                                  # its owner
tick_(W(KE, 'map', 'decision seven', -0.3), 0.005, px(760))                                           # and a link to decision 7
tBk = C(KE, 'breath', 0.3)
dulc(Eb4, tBk, 0.0105, px(760), 2.6); hbell(Eb3, tBk + 0.6, 0.011, px(760), 2.0)                     # kept, in the wordless moment

# 8. Never finished: Chile again, how far it reached (E flat, spread); what it never did (C minor); the telex, used regularly; Beer,
#    later; the coup, the room dismantled: no music; the documents carried out; the ideas held (a low bell, alone). The utility: never
#    finished, maturing one change at a time (the figure: a bell answers); the first year's counts; the end card, to the series' mark.
BK = 'back'
spread([Eb3, G3, Bb3, Eb4], S0(BK) + 0.4, 0.22, 0.011, -0.15, 3.0)                                  # Chile again
knock(W(BK, 'chile', 'more than a hundred', -0.3), 0.007, px(1110))                                   # more than a hundred
tNv = C(BK, 'never')
paper(tNv - 0.2, 0.008, px(1250), 0.45)                                                                # never ran as designed
tick_(W(BK, 'never', 'operations room', -0.2), 0.005, px(750)); tick_(W(BK, 'never', 'simulator', -0.2), 0.005, px(750))
phrase([Eb4, C4, G3], W(BK, 'never', 'simulator', 0.4), 0.5, 0.0105, px(1250), 2.2)                 # what it never did: C minor
tTx = C(BK, 'telex', 0.1)
tick_(tTx, 0.005, px(750)); dulc(Bb3, tTx + 0.2, 0.0100, px(1250), 2.0)                              # the telex, used regularly
paper(W(BK, 'model', 'Beer', -0.3), 0.007, px(1250), 0.45)                                            # Beer, later
air(W(BK, 'coup', 'dismantled', 0.1), 2.4, 0.003, px(960), 120, 600)                                  # the room dismantled: no music
paper(W(BK, 'papers', 'carried', -0.2), 0.006, px(1150), 0.6)                                         # the documents, carried out
pane(W(BK, 'papers', 'future', -0.4), 0.005, px(960))                                                  # kept for the future
hbell(Eb3, W(BK, 'held', 'ideas held', 0.0), 0.011, px(960), 2.0)                                     # the ideas held: a low bell
tUt = C(BK, 'utility')
air(tUt - 0.6, 1.2, 0.005, 0.0, 150, 800)                                                               # the utility, its map
pane(W(BK, 'utility', 'never finished', -0.2), 0.005, px(960))
one_name(W(BK, 'utility', 'one change at a time', 0.1), 0.011, px(760))                              # one change at a time
knock(W(BK, 'year', 'nine names', -0.2), 0.007, px(620)); knock(W(BK, 'year', 'fourteen decisions', -0.2), 0.007, px(1300))
damark(C(BK, 'breath', 1.0), 0.0115, 0.0)                                                               # the end card: the mark
