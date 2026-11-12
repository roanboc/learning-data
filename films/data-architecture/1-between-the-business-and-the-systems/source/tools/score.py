# Between the business and the systems: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py), and checked by tools/quiet.py (the governance films' check: when the music plays, how often, how loud, no
# repeats, no beats, no pulse, held notes kept level).
#
# The film's palette, its own (no score.py or palettes file on the site has it, 12 November 2026): an anémocorde, the keyboard
# instrument made in Paris in 1789 whose strings are sounded by wind. A bellows keeps the wind, and a key lets it through to its
# strings, which speak while the key is down and ring on for a moment after the wind stops. So each note starts with a breath, swells
# quickly into a full, soft string tone with nothing plucked or bowed in it, holds level, and rings down, its top first. The film's
# idea in one object: the wind is the same for every note, and the keys choose which strings it sounds, as the engineers chose what to
# measure only once they'd drawn the mill (and cybernetics, Stafford Beer's field, takes its name from the Greek for a steersman).
# Its partner: the anémocorde's long bass strings, an octave and more lower, for the ground of each chord.
# Nearest on the site: Borrowed from the brain's Aeolian harp, which the wind plays by itself, in its strings' nearly pure harmonics
# that swell in over a second. Kept apart by the keys: chosen notes with a full string tone, a breath before each one, a quick swell,
# and a ring after the wind stops.
# Nothing Chilean for Cybersyn (no Andean flutes, no charango, no guitar, no rhythm of a dance), and no machine rhythms for the mill
# or the telex: the story is told in the series' own voice.
#
# Keys, tuned pure: E major, as just intonation from E (every chord's notes are whole-number ratios of each other, so no two held
# notes can beat on a phone's one speaker); C-sharp minor for the problems (six months late, and the 180 households without a text).
# The series' mark, at the title and the end card and twice in the film: the root and its fifth, apart (the business and the
# systems), then the third between them, which makes the chord (the layer that joins them).
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

# ---- just intonation from E ----
_JI = {0: 1.0, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def jf(m):
    """a note's pitch (MIDI numbering, E2 = 40) in just intonation from E"""
    o, r = divmod(m - 40, 12)
    return 82.40689 * 2.0 ** o * _JI[r]

# ---- the anémocorde: the wind let through to a string by its key ----
_BODY = [(290, 0.5), (640, 0.4), (1180, 0.24)]          # its soundboard: a few broad resonances, which add no note of their own
_BASS = [(170, 0.55), (400, 0.42), (780, 0.22)]         # the bass strings' longer board
def anem(m, start, g=0.016, pan=0.0, sec=2.8, bass=False):
    """a note on the anemocorde: the wind reaches the string as its key opens (a breath first), the string speaks over about a tenth
    of a second, its upper partials a little after the fundamental, and holds level while the key is down; then the key closes, the
    wind stops and the string rings down, its upper partials first. One string a note: no vibrato, nothing trembles, nothing beats.
    bass: its long bass strings, lower, darker and longer"""
    f = jf(m); x = tt(sec).astype(np.float64)
    hold = max(0.35, sec - (1.6 if bass else 1.25))                     # how long the key is down; the string's ring takes the rest
    d0, d1 = (1.5, 0.75) if bass else (2.1, 1.05)
    def speak(k):                                                       # the string taking the wind: upper partials a little later
        return np.sin(0.5 * np.pi * np.clip((x - 0.035) / (0.085 + 0.03 * k), 0, 1)) ** 2
    def ring(k):                                                        # level while the key is down, then the ring, top first
        return np.where(x < hold, 1.0, np.exp(-(x - hold) * (d0 + d1 * k)))
    s = sum(np.sin(2 * np.pi * f * k * x + 0.4 * k) * (1 / k ** 1.5) * speak(k) * ring(k) for k in range(1, 8) if f * k < 2300)
    # the breath: the wind arriving before the string speaks, then a faint hush while the key is down, gone as it closes
    wind = 0.06 * np.sin(np.pi * np.clip(x / 0.12, 0, 1)) ** 2 + 0.01 * np.clip(x / 0.15, 0, 1) * np.clip((hold - x) / 0.12 + 1, 0, 1) * (x < hold + 0.12)
    s = s + filt(noise(sec), 'band', (max(140.0, f * 0.9), min(1700.0, f * 3.2))) * wind
    s = s * np.clip((sec - x) / 0.3, 0, 1)
    s = s.astype(np.float32)
    s = 0.55 * s + sum(a * filt(s, 'band', (fc * 0.8, fc * 1.25)) for fc, a in (_BASS if bass else _BODY))
    put(norm(filt(s.astype(np.float32), 'low', 2100 if not bass else 1500)), start, g * MUS, pan)
def low(m, start, g=0.016, pan=0.0, sec=3.6):
    """the anemocorde's long bass strings, alone"""
    anem(m, start, g, pan, sec, bass=True)
def spread(ch, s, g=0.014, pan=0.0, step=0.12, ground=None, sec=2.8):
    """a chord let through one string after another, up the keyboard and across the stereo field; ground: the bass strings under it"""
    if ground is not None:
        low(ground, s - 0.04, g * 1.25, pan, sec + 0.8)
    for i, m in enumerate(ch):
        anem(m, s + i * step, g * (1.0 if i == 0 else 0.82), pan - 0.25 + 0.5 * i / max(1, len(ch) - 1), sec)
def damark(s, root=52, g=0.016, pan=0.0):
    """the series' mark: the root and its fifth, apart, then the third between them, which makes the chord; the bass strings under it"""
    anem(root, s, g, pan - 0.3, 3.4); anem(root + 7, s + 0.6, g, pan + 0.3, 3.0)
    anem(root + 4, s + 1.3, g * 1.05, pan, 3.6); low(root - 12, s + 1.3, g * 1.1, pan, 4.2)

# ---- effects: soft, short, below about 2.4 kHz ----
def knock(s, g=0.012, pan=0.0):
    """a soft wooden knock, for a card or a sheet arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 230 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 510 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def glass(s, g=0.008, pan=0.0):
    """a pane of glass set down softly: a dull tap, its ring gone at once"""
    x = tt(0.22); X(norm(filt((np.sin(2 * np.pi * 760 * x) * np.exp(-x * 30) + 0.35 * np.sin(2 * np.pi * 1630 * x) * np.exp(-x * 55)).astype(np.float32), 'low', 2000)), s, g, pan)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """a sheet laid down or pinned: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def flip(s, g=0.008, pan=0.0):
    """a calendar's page turned over: a short, papery flick"""
    x = tt(0.2); X(filt(noise(0.2), 'band', (400, 2200)) * np.sin(np.pi * x / 0.2) ** 3, s, g, pan)
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
    """an owner's tick drawn: a short soft click"""
    x = tt(0.07); X(norm(filt((np.sin(2 * np.pi * 1250 * x) * np.exp(-x * 80) + 0.3 * noise(0.07) * np.exp(-x * 120)).astype(np.float32), 'low', 2000)), s, g, pan)
def air(s, sec=0.9, g=0.008, pan=0.0, lo=140, hi=900):
    """things moving together, or light spreading: a breath of low air"""
    s_air(s, sec, g * FXG, pan, lo, hi)
def rain(s, sec, g=0.006, pan=0.0):
    """rain against a window, as one soft texture that swells in and out: no drops, no crackle"""
    x = tt(sec); e = np.minimum(1, x / 1.2) * np.clip((sec - x) / 1.8, 0, 1)
    X(filt(noise(sec), 'band', (350, 1900)) * e * (0.85 + 0.15 * np.sin(2 * np.pi * 0.23 * x)), s, g, pan)
def thunder(s, g=0.02, pan=0.0, sec=3.2):
    """thunder far off: a low rumble that rolls in and dies away, nothing that cracks"""
    x = tt(sec); e = (1 - np.exp(-x / 0.25)) * np.exp(-x / 1.1)
    X(norm(filt(noise(sec), 'band', (35, 220)).astype(np.float32) * e.astype(np.float32)), s, g, pan)
def telex(s, sec, g=0.004, pan=0.0):
    """the telex printing in the next room: one soft, muffled texture of keys, uneven, never a clatter or a rhythm"""
    x = tt(sec); r = np.random.default_rng(int(s * 10) % 991); k = np.zeros_like(x); t0 = 0.0
    while t0 < sec:
        i0 = int(t0 * SR); n = int(0.03 * SR); k[i0:i0 + n] += r.uniform(0.4, 1.0) * np.exp(-np.arange(min(n, len(k) - i0)) / (0.006 * SR)); t0 += r.uniform(0.07, 0.16)
    X(filt(noise(sec), 'band', (300, 1300)) * np.minimum(k, 1) * np.sin(np.pi * x / sec) ** 0.4, s, g, pan)
def textin(s, g=0.006, pan=0.0):
    """a text arriving on a phone: two soft wooden taps, close together, nothing that beeps"""
    knock(s, g, pan); knock(s + 0.09, g * 0.8, pan)
def lights(s, sec=1.2, g=0.006, pan=0.0):
    """windows lighting up along a street: one warm swell, not a light at a time"""
    air(s, sec, g, pan, 120, 700)

# ======================================================================================================================
# 1. Before any computer: Chile in 1971, under music; then the mill, the drawing and its five numbers; then the utility. The
#    opening story: music under it throughout, a chord with each turn of the story.
WK = 'walk'
spread([52, 59, 64, 68], S0(WK) + 0.5, 0.013, -0.1, 0.16, ground=40, sec=3.6)                 # Chile, 1971: E major, lamp-lit
air(W(WK, 'year', 'factories', -0.3), 2.2, 0.006, px(1280), 200, 1000)                           # the factories come in as dots
spread([57, 61, 64], C(WK, 'corfo', -0.1), 0.012, px(1260), 0.14, ground=45)                     # CORFO: A major
knock(C(WK, 'corfo', -0.1), 0.012, px(1260))
tL, tO, tNd = C(WK, 'lag'), C(WK, 'old'), C(WK, 'need')
knock(tL - 0.2, 0.01, px(1690)); paper(tL, 0.01, px(1190), 0.5)                                  # the calendar; the report sets off
low(37, tL - 0.1, 0.018, 0.0, 4.2); anem(64, tL + 0.3, 0.012, px(1690), 3.2); anem(56, tL + 0.9, 0.011, px(1500), 3.2)   # C-sharp minor
for k in range(1, 7):                                                                             # six months, a page each
    flip(tL + 0.4 + k / 6 * (tO + 0.6 - tL - 0.4) - 0.05, 0.007, px(1690))
low(37, tO + 0.2, 0.016, px(1690), 3.8); anem(61, tO + 0.25, 0.011, px(1690), 3.0)                 # half a year old: the ring
spread([57, 64, 69], tNd + 0.2, 0.012, px(600), 0.16, ground=45, sec=3.2)                        # each factory, now: A major
anem(71, tNd + 1.6, 0.009, px(600), 2.6)
spread([59, 63, 66], C(WK, 'beer', -0.2), 0.012, px(420), 0.15, ground=35, sec=3.4)              # CORFO's team and Beer: B major
tC = C(WK, 'cyber')
knock(tC - 0.1, 0.011, px(1080))
spread([52, 59, 64, 68, 71], tC + 0.2, 0.012, px(1180), 0.32, ground=40, sec=3.6)                # Cybersyn: the lines to Santiago
air(tC + 0.3, 3.0, 0.007, px(1280), 180, 900)
# the mill: the engineers walk it, draw it, then ring about five numbers on the drawing
tWt, tD, tCh = C(WK, 'went'), C(WK, 'drew'), C(WK, 'chose')
spread([57, 61, 64], tWt - 0.3, 0.011, 0.0, 0.18, ground=45, sec=3.2)                            # into the mill: A major
paper(tD, 0.012, 0.0, 0.5); spread([52, 56, 59], tD + 0.1, 0.011, 0.0, 0.15, ground=40)          # the sheet; E major
pencil(tD + 0.25, 2.6, 0.005, 0.0)
for t0, m, x in [(tCh + 0.2, 64, 300), (tCh + 0.6, 66, 600), (tCh + 1.0, 68, 1560), (W(WK, 'five', 'produced', -0.2), 71, 900), (W(WK, 'five', 'absent', -0.2), 73, 560)]:
    pencil(t0, 0.7, 0.004, px(x)); anem(m, t0 + 0.1, 0.01, px(x), 2.4)                          # a number ringed: a note each
low(35, C(WK, 'five', 0.2), 0.012, 0.0, 3.6)                                                     # under them, the B
tM = C(WK, 'meant')
spread([52, 59, 64, 68, 71], tM + 0.4, 0.013, 0.0, 0.1, ground=40, sec=3.6)                      # each number in its place: E major
# the utility: plenty of data, and no agreed picture of what it means
tSm, tSt = C(WK, 'same'), C(WK, 'starts')
for i in range(6):
    glass(tSm + 0.2 + i * 0.35, 0.006, px(260 + (i % 3) * 400 + (i % 2) * 40 + 165))
low(37, tSm + 0.3, 0.015, 0.0, 4.0); anem(64, tSm + 0.9, 0.01, -0.2, 3.0)                         # C-sharp minor again
anem(68, tSm + 2.4, 0.01, px(760), 2.8)                                                          # which one is right?
paper(tSt + 0.2, 0.012, px(780), 0.5); pencil(tSt + 0.6, 1.4, 0.005, px(780)); pencil(tSt + 1.4, 0.9, 0.004, px(640)); pencil(tSt + 1.9, 0.9, 0.004, px(920))
spread([57, 61, 64], tSt + 0.3, 0.011, px(780), 0.15, ground=45)                                 # where she starts: A major
damark(C(WK, 'breath', 1.5), 52, 0.015, 0.0)                                                     # the title: the series' mark

# 2. Tomás's map: the six layers stacking, each confirmed by its owners; the business objects; then the information layer, where data
#    architecture works, and Inés. After the opening, music now and then.
MP = 'map'
tSx = C(MP, 'six', -0.2)
for i in range(6):
    knock(tSx + 0.2 + i * 0.4, 0.008, px(1100))
spread([52, 59, 64, 68], tSx + 0.4, 0.012, 0.0, 0.2, ground=40, sec=3.2)                        # the map: a chapter's chord
for i in range(6):
    tick_(C(MP, 'drawn', 0.4 + i * 0.18), 0.005, px(1700))
tBz = W(MP, 'biz', 'its concepts')
for i in range(3):
    glass(tBz + 0.46 * i, 0.006, px(900 + i * 300, 1060))
tBo = C(MP, 'bo')
knock(tBo + 0.4, 0.01, px(1190, 1060)); anem(68, tBo + 0.45, 0.012, px(1190, 1060), 2.8)         # a business object, defined once
tU = W(MP, 'under', 'data architecture', -0.2)
air(tU - 0.2, 0.9, 0.007, px(1140, 1050)); anem(52, tU, 0.012, -0.1, 3.0); anem(56, tU + 0.5, 0.012, 0.1, 3.0)   # the layer between
tHr = C(MP, 'hers', -0.2)
anem(59, tHr + 0.2, 0.011, px(1800, 1060), 2.6); anem(64, tHr + 0.55, 0.011, px(1800, 1060), 2.8)                # Inés

# 3. Three meanings: her question; three sheets, drawn in pencil; the stamp; the team's decision.
TH = 'three'
knock(C(TH, 'asks', 0.2), 0.011, 0.0)
for i in range(3):
    paper(C(TH, 'three', 0.2 + i * 0.35), 0.01, px([575, 1020, 1465][i], 1020), 0.4)
pencil(C(TH, 'web', 0.0), 2.2, 0.005, px(575, 850))
press(C(TH, 'real', 0.1), 0.014, px(590, 850))
pencil(C(TH, 'analyst', 0.0), 2.2, 0.005, 0.0)
pencil(C(TH, 'togaf', 0.0), 1.8, 0.005, px(1465, 1210))
anem(61, W(TH, 'togaf', 'a phase', 0.1), 0.011, px(1465, 1210), 2.6)                              # phase C
tWr = C(TH, 'writes', 0.6)
knock(tWr, 0.012, 0.0); press(tWr + 0.5, 0.012, 0.0)
spread([57, 61, 64, 69], tWr + 0.5, 0.012, 0.0, 0.14, ground=45, sec=3.2)                       # the decision, written down

# 4. One discipline: DAMA's book; data and information, then one word for both; TOGAF's four domains; ArchiMate's two layers and the
#    gap between them; the map's layer drawn there, to the series' mark.
DM = 'dama'
knock(C(DM, 'dmbok', 0.2), 0.012, px(420))
tDa, tIn = W(DM, 'dmbok', 'data as', -0.2), W(DM, 'dmbok', 'information as', -0.2)
glass(tDa, 0.006, px(860)); anem(64, tDa + 0.05, 0.011, px(860), 2.6)
glass(tIn, 0.006, px(1520)); anem(71, tIn + 0.05, 0.011, px(1520), 2.8)
air(C(DM, 'form', 0.1), 1.0, 0.006, px(1190))
tOn = C(DM, 'one')
air(tOn + 0.3, 1.2, 0.007, px(1260)); glass(tOn + 1.05, 0.007, px(1260))
anem(64, tOn + 1.1, 0.012, px(1260), 3.0); low(52, tOn + 1.1, 0.013, px(1260), 3.4)               # two words as one: an octave
tDo = C(DM, 'domains')
for i in range(4):
    knock(tDo + 0.3 + i * 0.28, 0.008, px(2385 + i * 330, 2880))
air(W(DM, 'domains', 'but groups'), 1.0, 0.006, 0.0)
tAm = C(DM, 'archimate', 0.2)
air(tAm, 1.0, 0.007, 0.0); glass(tAm + 0.2, 0.006, px(2960, 2880)); glass(tAm + 0.5, 0.006, px(2960, 2880))
low(40, C(DM, 'between', -0.2), 0.014, 0.0, 3.4)                                                  # nothing in between
tDr = C(DM, 'draws', 0.2)
knock(tDr, 0.01, 0.0); damark(tDr + 0.3, 52, 0.014, 0.0)                                         # a layer drawn there: the mark

# 5. One word, six records: the business object and its owner; six records, each where its system is named; the storm, the texts,
#    the 180 households in the dark; and the line between the word and its records, owned by nobody.
PT = 'point'
X0 = 3840
tWd = C(PT, 'word', 0.2)
glass(tWd, 0.008, 0.0); anem(68, tWd + 0.2, 0.012, 0.0, 2.8)                                      # connection point
knock(W(PT, 'grace', 'Grace', -0.1), 0.01, px(X0 + 1320, X0 + 960))
REC = [(C(PT, 'names'), 90), (W(PT, 'names', 'Meter'), 550), (W(PT, 'names', 'Billing'), 1010), (C(PT, 'more'), 1470), (W(PT, 'more', 'The outage'), 320), (W(PT, 'more', 'the data platform'), 1240)]
for t0, x in REC:
    glass(t0 - 0.2, 0.007, px(X0 + x + 180, X0 + 960))
tSm2 = C(PT, 'storm')
rain(tSm2 - 0.3, 9.0, 0.005, px(X0 + 500, X0 + 960))
thunder(W(PT, 'storm', 'a storm', 0.25), 0.018, px(X0 + 500, X0 + 960))
low(37, W(PT, 'storm', 'cut', -0.1), 0.016, -0.2, 4.0); anem(64, W(PT, 'storm', 'cut', 0.4), 0.01, -0.2, 3.0)   # C-sharp minor
tTx = C(PT, 'texts', -0.1)
textin(tTx + 0.1, 0.007, px(X0 + 1330, X0 + 960)); glass(tTx + 0.15, 0.006, px(X0 + 1330, X0 + 960))
lights(tTx + 0.6, 1.2, 0.006, 0.0)
tMs = C(PT, 'missed')
low(37, tMs + 0.2, 0.016, px(X0 + 1700, X0 + 960), 4.2)                                           # 180 households: no text
knock(tMs + 0.5, 0.01, px(X0 + 1330, X0 + 960))
air(C(PT, 'nobody', -0.6), 1.0, 0.006, 0.0)
tNb = W(PT, 'nobody', 'Nobody', -0.3)
anem(52, tNb, 0.012, -0.25, 3.2); anem(59, tNb + 0.6, 0.012, 0.25, 3.2)                           # nobody: the fifth, with nothing between

# 6. An architecture of its own: what the line is for; the systems come and go and the points stay; meaning, storage and the join;
#    the six lines drawn and owned; the decision on the network's ID; the next storm, every text delivered.
OW = 'own'
air(C(OW, 'for', 0.3), 1.0, 0.006, 0.0)
tOl = C(OW, 'outlives')
for i in range(7):
    knock(tOl + i * 2.4 / 7, 0.006, px(X0 + 700, X0 + 960))
paper(W(OW, 'march', 'Billing', 0.2), 0.01, px(X0 + 900, X0 + 960), 0.4)
tSo = W(OW, 'join', 'Someone', -0.1)
anem(59, tSo + 0.1, 0.011, px(X0 + 60, X0 + 960), 2.8)                                            # the join: nobody
tDs = C(OW, 'discipline', 0.3)
anem(64, tDs, 0.011, px(X0 + 60, X0 + 960), 2.8)                                                  # the join: data architecture
tLn = C(OW, 'lines')
ORD = [0, 2, 3, 5, 1, 4]                                                                          # the order the lines arrive
for i in range(6):
    k = ORD[i]; x = [270, 730, 1190, 1650, 500, 1420][i]
    pencil(tLn + 0.3 + k * 0.35, 0.8, 0.004, px(X0 + x, X0 + 960))
    tick_(tLn + 0.9 + k * 0.35 + 0.2, 0.005, px(X0 + x, X0 + 960))
for k, m in enumerate([52, 56, 59, 64, 68, 71]):
    anem(m, tLn + 0.35 + k * 0.35, 0.011, -0.5 + 0.2 * k, 2.6 if k < 5 else 3.4)                  # each line drawn: rising to the chord
for i in range(6):
    glass(W(OW, 'decides', 'carries', -0.2) + ORD[i] * 0.17, 0.005, px(X0 + [270, 730, 1190, 1650, 500, 1420][i], X0 + 960))
press(C(OW, 'decides', 0.1), 0.014, px(X0 + 380, X0 + 960))
tMt = C(OW, 'matched')
knock(tMt - 0.2, 0.01, px(X0 + 1330, X0 + 960)); tick_(tMt + 1.0, 0.006, px(X0 + 1330, X0 + 960))
tNx = C(OW, 'next')
rain(tNx - 0.4, 5.0, 0.004, px(X0 + 500, X0 + 960)); thunder(tNx + 0.1, 0.012, px(X0 + 500, X0 + 960))
lights(tNx + 0.6, 1.2, 0.006, 0.0)
spread([52, 59, 64, 68, 71], tNx + 1.6, 0.013, 0.0, 0.12, ground=40, sec=3.6)                    # every one got its text: E major

# 7. The data practice on the map: the layers behind the model; the lines redrawn and owned; what the next films add.
PR = 'practice'
spread([57, 61, 64, 69], C(PR, 'adds', 0.2), 0.012, 0.0, 0.16, ground=45, sec=3.0)              # the data practice: A major
air(C(PR, 'above', -0.2), 1.0, 0.006, 0.0); air(C(PR, 'layer', -0.2), 1.0, 0.006, 0.0)
tRe = C(PR, 'realises')
for i in range(6):
    pencil(tRe + 0.3 + ORD[i] * 0.25, 0.6, 0.0035, px(X0 + [270, 730, 1190, 1650, 500, 1420][i], X0 + 960))
tOw = C(PR, 'owned')
for i in range(6):
    tick_(tOw + 0.2 + ORD[i] * 0.15 + 0.3, 0.005, px(X0 + [270, 730, 1190, 1650, 500, 1420][i], X0 + 960))
spread([52, 56, 59, 64], tOw + 0.4, 0.012, 0.0, 0.1, ground=40, sec=3.2)                        # each line owned
for k, word in enumerate(['born', 'travels', 'owns']):
    t0 = W(PR, 'later', word, -0.2); glass(t0, 0.005, 0.0); anem([71, 73, 76][k], t0 + 0.05, 0.009, 0.1 * k, 2.4)

# 8. Draw it first: Chile's drawing again, its numbers sent by telex; then the utility's model, every home lit, and the pyramid that's
#    only half right; the end card, to the series' mark.
BK = 'back'
spread([52, 59, 64, 68], C(BK, 'chile', -0.2), 0.012, 0.0, 0.16, ground=40, sec=3.4)            # Chile's drawing: the opening's chord
telex(C(BK, 'same', -0.2), 3.2, 0.004, px(1300))
damark(C(BK, 'ines', -0.3), 64, 0.013, 0.0)                                                     # Inés drew the business first too: an octave up
tHm = C(BK, 'home')
lights(tHm + 0.2, 1.4, 0.007, 0.0); textin(tHm + 0.8, 0.006, px(X0 + 860, X0 + 960))
tPy = W(BK, 'pyramid', 'famous pyramid', -0.2)
pencil(tPy, 1.4, 0.004, px(X0 + 1560, X0 + 960))
anem(59, W(BK, 'pyramid', 'half right', -0.1), 0.011, px(X0 + 1560, X0 + 960), 2.6); anem(61, W(BK, 'pyramid', 'half right', 0.35), 0.01, px(X0 + 1560, X0 + 960), 3.0)
damark(C(BK, 'breath', 1.6), 52, 0.015, 0.0)                                                     # the end card: the mark
