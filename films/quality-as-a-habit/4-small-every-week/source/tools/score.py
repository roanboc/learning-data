# Small, every week: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the module's setup thread on 5 November 2026 after it checked every score.py on main
# (/mnt/project-files/data-quality/palettes.md, where this film's thread took the partner on 10 November 2026): a hydraulophone, made
# here (music.py has none).
#  - The lead: a hydraulophone, played by blocking jets of water with the fingers, each jet a note. A finger closes a jet and the note
#    sounds while it's held: it settles up into its pitch from a little below as the water's pressure builds, holds plain and even,
#    and sags a little as the finger lifts. Hollow, its odd partials stronger than its even ones, with a soft hush of water where the
#    jet meets the finger at its start, and nothing else: no bubbles, no drops, nothing that trembles. Water, steadily, as in a field
#    kept watered. Short jets in the middle of the range, B-flat 3 to G 5.
#  - The partner: the hydraulophone's own low jets, a larger, lower set (E-flat 2 to E-flat 3). A low jet swells in, holds at an even
#    level and dies away, with the same settling at its start. It sounds under the opening, at a chapter's turn and under the mark,
#    never under a whole chapter, and never on a note close to the lead's, so nothing beats.
#  - The mark: one short phrase, a note longer each time it comes back, so it's never the same figure twice. It rises through E-flat
#    major from B-flat 3 (B-flat, E-flat, G, B-flat, C, E-flat, G), each note a short jet and the last one held, the low E-flat under
#    it: two notes where the team grows two generations a year, three at "Small steps, twice a year", four at 1956's wheat, five under
#    the title, six where the turn is kept ("Act: they keep it"), seven under the end card. A week's small change, kept.
#  - E-flat major for what grows and is kept; C minor for the rust, the ruined fields, December's 41 and the wrong work done faster;
#    A-flat major for the farmers and the people at the table; B-flat major where something has to change or a question is asked,
#    which turns to E-flat; G minor for a doubt. Just intonation from E-flat (see hz()), so nothing beats: E-flat, A-flat and B-flat
#    major and C and G minor are pure in this table; F with C or with A-flat is not (27/20 and 32/27), so F sounds only with B-flat,
#    D or E-flat.
# The rules every film of the module keeps (palettes.md, 5 November 2026):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato. No urgent pulse: nothing in this story is a rush. No
#    figure played again and again. Nothing Mexican for the wheat: no instrument, rhythm or tune of the opening's place.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (41 certificates, a card for each
#    week, the ledger's rows, the sprigs on the map) is one soft sound, never one for each.
# And everything stays low and soft, below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid):
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1945)  # this film's own randomness: the room and the water's hush

# ---- tuning: just intonation from E-flat, so a chord's notes are whole-number ratios of each other and nothing beats. E-flat major
# (E-flat G B-flat), A-flat major (A-flat C E-flat), B-flat major (B-flat D F), C minor (C E-flat G) and G minor (G B-flat D) are pure
# in this table; F with C or with A-flat is not (27/20 and 32/27), so F never sounds with them
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (51, 155.563)  # E-flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Eb2, G2, Ab2, Bb2, C3, D3, Eb3 = 39, 43, 44, 46, 48, 50, 51
Bb3, C4, D4, Eb4, F4, G4, Ab4, Bb4, C5, D5, Eb5, G5 = 58, 60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 79
MARK = (Bb3, Eb4, G4, Bb4, C5, Eb5, G5)   # the mark's phrase: each time it comes back, one note longer

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the low jets a little under the lead; the effects well under the
# music (FX scales them all)
JL, LL, FX = 0.046, 0.040, 1.4

# a room round the jets: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what it
# rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level after it (_held), as the
# video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))
def _hush(n, lo, hi):
    """the water's hush: plain noise, low and soft, the same all through"""
    return filt(R1.standard_normal(n).astype(np.float32), 'band', (lo, hi)).astype(np.float64)

# ---- a jet: a finger closes it, and the note sounds while it's held. The water's pressure builds, so the note settles up into its
# pitch from about 15 cents below within a tenth of a second; it holds plain and even; as the finger lifts it dies away and sags
# about 10 cents. Hollow: its third and fifth partials stronger than its second and fourth, growing in as the jet settles. The hush
# where the jet meets the finger, at its start, and a fainter one while it's held; nothing trembles
def jet(m, s, hold=0.35, g=1.0, pan=0.0, rel=0.3, room=0.3):
    f = hz(m); sec = hold + 5 * rel + 0.15; x = tt(sec).astype(np.float64)
    cents = -15 * np.exp(-x / 0.035) - 10 * np.clip((x - hold) / (2 * rel), 0, 1)
    ph = 2 * np.pi * np.cumsum(f * 2 ** (cents / 1200)) / SR
    a = np.where(x < hold, 1.0, np.exp(-(x - hold) / rel)) * np.sin(0.5 * np.pi * np.minimum(1, x / 0.05)) ** 2
    grow = 1 - np.exp(-x / 0.05)
    sig = np.sin(ph)
    for k, h in ((2, 0.05), (3, 0.17), (4, 0.025), (5, 0.07), (7, 0.025)):
        if f * k < 2300:
            sig = sig + h * grow * np.sin(k * ph + 0.4 * k)
    sig = (sig + _hush(len(x), 250, 1300) * (0.12 * np.exp(-x / 0.05) + 0.02)) * a
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.1) / 0.1, 0, 1)) ** 2
    put(_held(filt(sig.astype(np.float32), 'low', 2300), room), s, g * JL, pan)

# ---- a low jet: the same water, a larger, lower jet. It swells in as the pressure builds (settling up into its pitch, as the lead
# does), holds at an even level while it's held, and dies away, sagging a little. Its second, third and fifth partials, nothing
# above 1.2 kHz
def low(m, a, b, g=1.0, att=0.8, rel=1.0, pan=0.0, room=0.3):
    f = hz(m); sec = max(0.6, b - a); n = int((sec + 5 * rel + 0.15) * SR); x = np.arange(n) / SR
    cents = -12 * np.exp(-x / 0.09) - 6 * np.clip((x - sec) / (2 * rel), 0, 1)
    ph = 2 * np.pi * np.cumsum(f * 2 ** (cents / 1200)) / SR
    on = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    off = np.where(x > sec, np.exp(-(x - sec) / rel), 1.0)
    s = np.sin(ph)
    for k, h in ((2, 0.06), (3, 0.14), (5, 0.04)):
        if f * k < 1200:
            s = s + h * np.sin(k * ph + 0.5 * k)
    s = (s + _hush(n, 120, 600) * 0.03) * on * off
    s = s * np.cos(0.5 * np.pi * np.clip((x - n / SR + 0.1) / 0.1, 0, 1)) ** 2
    put(_held(filt(s.astype(np.float32), 'low', 1200), room), a, g * LL, pan)

# ---- the mark: its first k notes, rising, each a short jet 0.3 s apart and the last one held, from left to right; the low E-flat
# swells in under the last. s is the moment its first note sounds
def mark(s, k, g=1.0, pan0=-0.3, pan1=0.3, under=2.4):
    for i in range(k):
        last = i == k - 1
        jet(MARK[i], s + 0.3 * i, hold=1.1 if last else 0.16, g=g * (0.85 if last else 0.7), pan=pan0 + (pan1 - pan0) * i / max(1, k - 1),
            rel=0.5 if last else 0.2)
    t1 = s + 0.3 * (k - 1)
    low(Eb2, t1 - 0.1, t1 + under, g * 0.8, att=0.6, rel=0.9)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a chip, a tag, a row"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.012, pan=0.0, sec=0.4):
    """a sheet laid down, an envelope carried"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def leaves(s, sec=1.8, g=0.009, pan=0.0):
    """many sheets or cards, one after another: one soft texture that swells and fades, never a sound for each"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, a wash"""
    s_air(s, sec, g * FX, pan, lo, hi)
def tick(s, g=0.009, pan=0.0):
    """a clock's soft tick"""
    s_knock(s, g * FX, pan, 520)
def pen(s, sec=1.6, g=0.006, pan=0.0):
    """a line written: one soft, dry texture, not a sound for each letter"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1800))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2, s, g * FX, pan)

# =============================================================================================================================
# 1. Two harvests a year: the opening, with music all through it.
#    Mexico, 1945: E-flat major, a low E-flat and three jets rising as the field comes in; the team: A-flat major. Stem rust: C minor,
#    the jets falling as the stems weaken and the grain shrivels; the field lost: C minor, low. Wheat bought abroad: A-flat. One
#    generation a year: B-flat, slow single jets, falling; the ruined fields: C minor; "Something had to change": B-flat. Two
#    generations a year: the mark, two notes; the two fields, a jet on each side; the seed carried between them. The stems kept: A-flat.
#    "Small steps, twice a year": the mark, three notes. 1948's four wheats: four jets falling, one for each envelope. The field day:
#    A-flat. 1956: the mark, four notes. The university's 41: C minor; the empty folder: A-flat, one jet. A year later, 3: E-flat. The
#    title card: the mark, five notes, the low E-flat under it
H = lambda lid, word, off=0: W('harvests', lid, word, off)
h0 = S0('harvests')
low(Eb3, h0 + 0.3, H('place', 'Rockefeller', 0.3), 0.75, att=1.4, rel=1.2)
jet(Eb4, h0 + 1.0, hold=1.0, g=0.6, pan=-0.2, rel=0.5); jet(G4, h0 + 2.1, hold=1.0, g=0.6, pan=0.0, rel=0.5)
jet(Bb4, h0 + 3.2, hold=1.6, g=0.62, pan=0.2, rel=0.7)
knock(H('place', 'programme', -0.3), 0.014, px(470), 220)
# the team in the wheat: A-flat; a chip each, the agronomists and Norman Borlaug
low(Ab2, G('harvests', 'team', -0.3), H('team', 'Norman', 1.2), 0.65, att=1.2, rel=1.1)
tap(H('team', 'agronomists', -0.2), 0.009, px(630)); jet(Ab4, H('team', 'agronomists', 0.0), hold=0.8, g=0.5, pan=px(630), rel=0.5)
tap(H('team', 'Norman', -0.2), 0.009, px(1290)); jet(C5, H('team', 'Norman', 0.0), hold=1.0, g=0.5, pan=px(1290), rel=0.6)
# stem rust, close up: C minor; the spots come out; one stem weakens and its grain shrivels
tSt = G('harvests', 'rust', -0.4)
low(C3, tSt, H('shrivels', 'weaken', 0.0), 0.65, att=1.2, rel=1.0)
tap(H('rust', 'fungus', -0.3), 0.008, px(1010)); jet(G4, H('rust', 'fungus', 0.0), hold=0.7, g=0.48, pan=px(1010), rel=0.5)
jet(Eb4, H('rust', 'spots', -0.2), hold=1.0, g=0.48, pan=0.15, rel=0.6)
low(G2, H('shrivels', 'weaken', -0.2), H('shrivels', 'lost', 0.4), 0.6, att=0.8, rel=1.0)
jet(D4, H('shrivels', 'weaken', 0.0), hold=0.5, g=0.42, pan=px(1400), rel=0.4)
jet(C4, H('shrivels', 'shrivels', 0.0), hold=1.2, g=0.46, pan=px(1400), rel=0.7)
# the field lost: it browns; a farmer stands in it
air(H('shrivels', 'whole', 0.0), 2.2, 0.007, 0.0, 150, 700)
low(C3, H('shrivels', 'whole', -0.2), H('years', 'Mexico had', -0.4), 0.65, att=1.0, rel=1.0)
jet(G4, H('years', 'Farmers', -0.1), hold=1.0, g=0.44, pan=px(1180), rel=0.6)
# wheat bought abroad: the sacks come in by rail and by sea; A-flat
tB = H('years', 'Mexico had', -0.3)
low(Ab2, tB - 0.1, H('years', 'abroad', 1.4), 0.62, att=1.0, rel=1.1)
air(tB + 0.4, 2.6, 0.007, 0.2, 150, 800)
jet(C5, tB + 0.5, hold=0.8, g=0.44, pan=0.4, rel=0.5)
tap(H('years', 'abroad', -0.3), 0.008, px(1340)); jet(Ab4, H('years', 'abroad', 0.0), hold=1.2, g=0.44, pan=px(1340), rel=0.7)
# the field book: one generation a year, slowly: B-flat, a slow jet for every other year, falling
tSh = G('harvests', 'slow', -0.4)
paper(tSh + 0.1, 0.010, 0.0, 0.45)
low(Bb2, tSh, G('harvests', 'change', 0.2), 0.58, att=1.2, rel=1.0)
tap(H('slow', 'bred', -0.3), 0.008, px(500))
for i, m in enumerate((G4, F4, D4, Bb3)):
    jet(m, G('harvests', 'gens', 0.0) + 1.1 * i, hold=0.5, g=0.4, pan=-0.3 + 0.2 * i, rel=0.45)
# the years of waiting, the fields ruined: C minor; "Something had to change": B-flat
low(C3, G('harvests', 'change', -0.1), H('change', 'Something', -0.2), 0.6, att=0.8, rel=0.8)
jet(Eb4, G('harvests', 'change', 0.6), hold=0.9, g=0.4, pan=0.0, rel=0.6)
tS = H('change', 'Something', 0.0)
low(Bb2, tS - 0.2, END('harvests', 'change') + 1.0, 0.68, att=0.9, rel=1.0)
jet(D4, tS + 0.3, hold=0.6, g=0.48, pan=-0.15, rel=0.5); jet(F4, tS + 0.65, hold=1.2, g=0.48, pan=0.15, rel=0.7)
# two generations a year: the mark, two notes; winter in the Yaqui Valley (left), summer in the highlands (right), over a thousand
# kilometres apart; the seed carried from one to the other and back
tTw = H('two', 'two generations', 0.0)
tap(tTw - 0.2, 0.008, px(1180))
mark(tTw, 2, 0.9)
tYq = H('winter', 'Yah-kee', 0.0)
knock(tYq, 0.012, px(690), 240); jet(G4, tYq + 0.1, hold=0.7, g=0.48, pan=px(690), rel=0.5)
low(Eb3, tYq - 0.2, H('summer', 'over a thousand', 0.5), 0.5, att=1.0, rel=1.0)
tHi = H('summer', 'highlands', 0.0)
knock(tHi, 0.012, px(1090), 240); jet(Bb4, tHi + 0.1, hold=0.8, g=0.48, pan=px(1090), rel=0.5)
tAw = H('summer', 'over a thousand', 0.0)
air(tAw - 0.2, 1.6, 0.008, 0.0, 150, 800); tap(tAw + 0.6, 0.008, px(780))
tC1, tC2 = H('carried', 'other field', -1.0), H('carried', 'sowed', 0.2)
paper(tC1, 0.009, px(690), 0.35); paper(tC2, 0.009, px(1090), 0.35)
low(Eb3, tC1 - 0.2, tC2 + 1.9, 0.5, att=1.0, rel=1.0)
jet(Bb4, tC1 + 1.6, hold=0.6, g=0.42, pan=px(1090), rel=0.5); jet(G4, tC2 + 1.6, hold=0.8, g=0.42, pan=px(690), rel=0.5)
# the stems the rust left standing, a tag each: kept; A-flat
low(Ab2, G('harvests', 'best', -0.4), H('best', 'kept', 1.2), 0.58, att=1.0, rel=1.0)
jet(C5, H('best', 'looked', 0.0), hold=0.8, g=0.44, pan=0.0, rel=0.5)
tK = H('best', 'kept', 0.0)
tap(tK - 0.1, 0.009, px(690)); tap(tK + 0.25, 0.009, px(1370)); jet(Eb5, tK, hold=1.0, g=0.42, pan=px(690), rel=0.6)
# small steps, twice a year, every year: the field book again, and the mark, three notes; half the time
paper(G('harvests', 'small', -0.3), 0.009, 0.0, 0.45)
mark(H('small', 'twice', 0.0), 3, 0.9)
tap(G('harvests', 'half', 0.1), 0.008, px(700))
low(Bb2, G('harvests', 'half', -0.2), H('half', 'four', -0.2), 0.55, att=1.0, rel=0.9)
# 1948: four new wheats, an envelope each, and a jet for each, falling from left to right
tF = H('half', 'four', 0.0)
knock(tF - 0.1, 0.012, px(960), 240); leaves(tF + 0.1, 1.1, 0.008, 0.0)
for i, m in enumerate((Eb5, C5, Bb4, G4)):
    jet(m, tF + 0.1 + 0.25 * i, hold=0.16 if i < 3 else 1.0, g=0.44, pan=px(390 + 380 * i), rel=0.2 if i < 3 else 0.6)
low(Eb3, tF, tF + 2.4, 0.5, att=0.8, rel=1.0)
# the field day, 1954: farmers in the valley's wheat; A-flat
tD = G('harvests', 'farmers', -0.4)
low(Ab2, tD, H('farmers', 'sowed the new seed', 1.0), 0.58, att=1.2, rel=1.1)
jet(Ab4, tD + 0.7, hold=1.0, g=0.44, pan=-0.2, rel=0.6)
tap(H('farmers', 'eight hundred', -0.2), 0.008, px(960)); jet(C5, H('farmers', 'eight hundred', 0.0), hold=0.9, g=0.44, pan=0.0, rel=0.6)
jet(Eb5, H('farmers', 'sowed the new seed', 0.0), hold=1.0, g=0.4, pan=px(820), rel=0.6)
# 1956, all the wheat it needed: the land washes gold, the wheat comes up where the fields are, and the mark, four notes
tM3 = G('harvests', 'enough', -0.4)
air(tM3 + 0.4, 1.8, 0.008, 0.0, 150, 800); leaves(tM3 + 0.8, 1.5, 0.007, px(850))
knock(H('enough', 'needed', -0.6), 0.012, px(1440), 240)
mark(H('enough', 'needed', -0.2), 4, 0.95)
# the university, December 2025: the list; 41 certificates fall on the pile, one soft texture; C minor
tU = G('harvests', 'univ', -0.4)
knock(tU + 0.3, 0.012, px(470), 220)
low(C3, tU + 0.2, H('univ', 'wrong', 1.0), 0.6, att=1.2, rel=1.0)
leaves(H('univ', 'forty-one', -1.8), 2.0, 0.010, px(1190))
jet(G4, H('univ', 'forty-one', 0.1), hold=0.9, g=0.44, pan=px(1190), rel=0.6)
jet(Eb4, H('univ', 'wrong', 0.0), hold=1.2, g=0.44, pan=0.0, rel=0.7)
# the Great Hall: a graduate crosses the stage holding an empty folder; A-flat, one jet as the folder is seen
tHa = G('harvests', 'folder', -0.4)
low(Ab2, tHa + 0.2, G('harvests', 'three', -0.6), 0.52, att=1.4, rel=1.2)
jet(C5, H('folder', 'cross the stage', 0.0), hold=0.9, g=0.4, pan=-0.1, rel=0.6)
jet(G4, H('folder', 'empty folder', 0.0), hold=1.6, g=0.42, pan=0.1, rel=0.8)
# a year later: a small card for each week, each with its measure; December 2025's 41, and December 2026's 3: E-flat
tBe = G('harvests', 'three', -0.4)
low(Eb3, tBe, G('harvests', 'breath', -0.3), 0.52, att=1.2, rel=1.0)
leaves(H('three', 'one small change', -0.4), 2.2, 0.008, 0.0)
tap(H('three', 'measured', -0.3), 0.007, 0.0)
knock(H('three', 'three', -1.6), 0.012, px(640), 200)
knock(H('three', 'three', -0.2), 0.013, px(1280), 250); jet(Eb5, H('three', 'three', 0.0), hold=1.2, g=0.44, pan=px(1280), rel=0.7)
# the title card: the mark, five notes, the low E-flat under it
mark(G('harvests', 'breath', 0.3), 5, 1.0, under=2.6)

# =============================================================================================================================
# 2. Fifteen minutes, every Thursday: four entries. January's first idea, a big clean-up: G minor, a doubt; the next list brings the
#    same errors back: C minor; Mei asks for something smaller, and every Thursday at ten: B-flat turning to E-flat, the clock's jet;
#    the three questions: E-flat, a jet as each comes, the last one open. The rest goes without music: a knock for each card, a tap
#    for each name, a tick for the clock
Q = lambda lid, word, off=0: W('thursdays', lid, word, off)
tI = Q('idea', 'big project', 0.0)
knock(tI - 0.5, 0.013, px(600), 230)
low(G2, tI - 0.6, tI + 1.4, 0.55, att=0.8, rel=0.7)
jet(D5, tI - 0.4, hold=0.5, g=0.42, pan=-0.2, rel=0.4); jet(Bb4, tI + 0.1, hold=0.9, g=0.44, pan=-0.1, rel=0.6)
paper(Q('once', 'clean-up', -0.2), 0.010, px(500), 0.4)
tN = Q('once', 'next list', 0.0)
paper(tN - 0.1, 0.010, px(1420), 0.4)
low(C3, tN - 0.2, tN + 1.8, 0.55, att=0.7, rel=0.7)
jet(Eb4, tN + 0.1, hold=0.35, g=0.42, pan=0.3, rel=0.3); jet(C4, tN + 0.55, hold=1.0, g=0.44, pan=0.35, rel=0.6)
# Mei, Malia, Jun and Sam come to the bench, a name tag each
for lid, word in (('smaller', 'Mei'), ('who', 'Malia'), ('makers', 'Jun'), ('makers', 'Sam')):
    tap(Q(lid, word, -0.3), 0.007, px({'Mei': 720, 'Malia': 330, 'Jun': 1160, 'Sam': 1560}[word]))
tAs = Q('smaller', 'something smaller', 0.0)
knock(tAs - 0.3, 0.013, px(1340), 230)
low(Bb2, tAs - 0.3, G('thursdays', 'every', 0.3), 0.55, att=0.8, rel=0.65)
jet(F4, tAs - 0.1, hold=0.4, g=0.42, pan=0.3, rel=0.35); jet(Bb4, tAs + 0.35, hold=0.9, g=0.44, pan=0.35, rel=0.6)
knock(G('thursdays', 'every', 0.1), 0.013, px(1400), 230)
tTen = Q('every', 'ten', 0.0)
tick(tTen - 0.1, 0.009, px(240))
low(Eb3, G('thursdays', 'every', 0.0), tTen + 1.0, 0.55, att=0.7, rel=0.7)
jet(Eb5, tTen - 0.1, hold=1.0, g=0.42, pan=px(240), rel=0.6)
# three questions, a card each: a jet as each comes, over a low E-flat; the last one is left open, on D
tQ1, tQ2, tQ3 = Q('q1', 'What', 0.0), G('thursdays', 'q2'), G('thursdays', 'q3')
low(Eb3, tQ1 - 0.3, tQ3 + 0.8, 0.5, att=0.8, rel=0.75)
for tq, m, x_ in ((tQ1, G4, 380), (tQ2, Bb4, 960), (tQ3, D5, 1540)):
    knock(tq - 0.2, 0.012, px(x_), 230); jet(m, tq - 0.1, hold=1.1, g=0.42, pan=px(x_), rel=0.6)
knock(G('thursdays', 'results', 0.4), 0.012, px(550), 230)
knock(Q('count', 'people count', -0.2), 0.012, px(1360), 230)

# =============================================================================================================================
# 3. Plan, do, check, act: six entries. The loop, as its four words are said: a jet for each, round and back, over a low E-flat. One
#    turn, from Thursday 1 October, as the loop moves aside: B-flat. Last December's 240 hours: C minor. Malia's question: B-flat, a
#    jet rising. Check: 26 hours and 97 of the hundred, E-flat. Act: the mark, six notes, as the turn is kept. The rest goes without
#    music: a knock for each card and figure, a tap for the hold tag, one soft line written into the round's steps
C = lambda lid, word, off=0: W('cycle', lid, word, off)
c0 = S0('cycle')
low(Eb2, c0 + 0.3, C('loop', 'act', 1.2), 0.6, att=1.0, rel=0.7)
for word, m, x_ in (('plan', G4, 760), ('do,', Bb4, 960), ('check', Eb5, 1160), ('act', Bb4, 960)):
    jet(m, C('loop', word, 0.0), hold=0.16 if word != 'act' else 0.9, g=0.44, pan=px(x_), rel=0.2 if word != 'act' else 0.6)
tap(C('loop', 'Walter', -0.3), 0.008, px(1500))
air(C('wheat', 'sow', -0.3), 1.0, 0.006, 0.0, 150, 700)
# one turn, from Thursday 1 October: the loop moves aside
tO = G('cycle', 'oct')
air(tO - 0.2, 1.6, 0.008, 0.4, 150, 800)
low(Bb2, tO - 0.2, tO + 2.0, 0.55, att=0.8, rel=0.7)
jet(Eb4, tO - 0.1, hold=0.4, g=0.42, pan=0.2, rel=0.35); jet(Bb4, tO + 0.4, hold=1.0, g=0.44, pan=0.45, rel=0.6)
knock(tO + 1.5, 0.013, px(610), 230)
# last December's round: 240 hours, C minor
knock(G('cycle', 'last', 0.1), 0.012, px(610), 230)
tHr = C('last', 'two hundred', 0.0)
knock(tHr - 0.3, 0.012, px(1350), 210)
low(C3, tHr - 0.4, tHr + 2.0, 0.55, att=0.8, rel=0.7)
jet(G4, tHr - 0.1, hold=0.35, g=0.42, pan=px(1350), rel=0.3); jet(Eb4, tHr + 0.35, hold=1.0, g=0.44, pan=px(1350), rel=0.6)
# since September: names fixed where they're born; each night the checks hold the doubtful ones, a tag
knock(G('cycle', 'since', 0.2), 0.012, px(560), 230)
tHo = C('since', 'hold', 0.0)
knock(tHo - 0.6, 0.012, px(560), 230); tap(tHo - 0.1, 0.008, px(1010))
# Malia's question: B-flat, a jet rising
tQ = G('cycle', 'ask')
knock(tQ + 0.1, 0.013, px(710), 230)
low(Bb2, tQ - 0.3, tQ + 2.4, 0.55, att=0.8, rel=0.7)
jet(F4, tQ + 0.2, hold=0.35, g=0.42, pan=px(1560), rel=0.3); jet(D5, tQ + 0.6, hold=1.0, g=0.44, pan=px(1560), rel=0.6)
# the plan, the rest left to the hundred records, the two measures: a card each
knock(G('cycle', 'plan', 0.2), 0.012, px(710), 230)
knock(C('plan', 'hundred records', -0.3), 0.011, px(710), 230)
knock(C('know', "round's hours", -0.3), 0.011, px(420), 230); knock(C('know', 'perfect', -0.3), 0.011, px(990), 230)
# do: from Monday 19 October, 78 names, not 2,140
knock(G('cycle', 'do', 0.2), 0.012, px(540), 230); knock(C('do', 'seventy-eight', -0.3), 0.012, px(540), 210)
# check: 26 hours, not 240; 97 of the hundred perfect: E-flat
t26, t97 = C('check', 'twenty-six', 0.0), C('check', 'ninety-seven', 0.0)
knock(t26 - 0.3, 0.012, px(540), 210); knock(t97 - 0.3, 0.012, px(1380), 210)
low(Eb3, t26 - 0.3, t97 + 1.2, 0.5, att=0.8, rel=0.75)
jet(Eb5, t26, hold=0.9, g=0.42, pan=px(540), rel=0.6); jet(Bb4, t97, hold=1.2, g=0.42, pan=px(1380), rel=0.7)
# act: they keep it, and write it into the round's steps: the mark, six notes; the steps' card, and the new step written in
tA = G('cycle', 'act')
mark(tA + 0.1, 6, 0.95, under=1.8)
knock(tA + 0.2, 0.012, px(960), 230)
pen(C('act', 'steps', -0.6), 1.8, 0.005, px(700))

# =============================================================================================================================
# 4. Measure, simplify, standardise, automate: two entries. The four steps, a jet for each as it lights, rising step by step, the low
#    E-flat under the last; automate first: C minor, falling, as it jumps to the front; and back in order: E-flat, carried into the
#    next chapter's first card. A knock for each card, a breath of air as the step moves
O = lambda lid, word, off=0: W('order', lid, word, off)
for i, (word, m) in enumerate((('measure', Bb3), ('simplify', C4), ('standardise', D4), ('automate', Eb4))):
    jet(m, O('order', word, -0.05), hold=0.18 if i < 3 else 1.1, g=0.46, pan=px(310 + 440 * i), rel=0.22 if i < 3 else 0.6)
low(Eb2, O('order', 'automate', -0.2), O('order', 'automate', 2.0), 0.55, att=0.7, rel=0.7)
for i, lid in enumerate(('measured', 'simple', 'standard', 'auto')):
    knock(G('order', lid, 0.3), 0.012, px(310 + 440 * i), 230)
tFi = O('mess', 'Automate first', 0.0); tBk = G('order', 'mess', 3.6)
air(tFi - 0.2, 1.2, 0.008, px(1300), 160, 800); knock(tFi + 0.6, 0.012, px(960), 220)
low(C3, tFi - 0.3, tBk - 0.3, 0.55, att=0.6, rel=0.65)
for i, m in enumerate((Eb4, D4, C4)):
    jet(m, tFi + 0.1 + 0.4 * i, hold=0.25 if i < 2 else 0.9, g=0.44, pan=-0.1, rel=0.25 if i < 2 else 0.6)
air(tBk, 1.2, 0.008, px(700), 160, 800)
low(Eb3, tBk - 0.2, tBk + 1.8, 0.5, att=0.6, rel=0.7)
jet(G4, tBk + 0.2, hold=1.1, g=0.42, pan=0.1, rel=0.6)

# =============================================================================================================================
# 5. Kept with a check: four entries. The level agreed with Malia: A-flat. Every change of the year has its keeper: in the pause, a
#    phrase as the ledger's rows come, over a low E-flat. A check that holds more names each night: G minor, a doubt. The year's
#    numbers, as the hours come down: E-flat, rising, carried into the next chapter. A knock for each card and window, a tap for each
#    row, one soft texture for the ledger
K = lambda lid, word, off=0: W('kept', lid, word, off)
knock(G('kept', 'last', -0.2), 0.012, px(600), 230)
knock(G('kept', 'forget', -0.2), 0.012, px(1320), 230)
air(K('forget', 'forgets', -0.2), 1.2, 0.006, px(1320), 150, 700)
knock(G('kept', 'level', -0.1), 0.012, px(960), 220)
tAg = K('level', 'agreed', 0.0)
tap(tAg + 0.5, 0.008, px(960))
low(Ab2, tAg - 0.3, tAg + 2.2, 0.55, att=0.8, rel=0.7)
jet(C5, tAg, hold=0.35, g=0.42, pan=0.1, rel=0.3); jet(Eb5, tAg + 0.45, hold=1.0, g=0.44, pan=0.15, rel=0.6)
knock(G('kept', 'below', -0.1), 0.012, px(960), 230)
# the year's ledger: each change and what keeps it; in the pause, a phrase over a low E-flat
tY = G('kept', 'year')
knock(tY - 0.1, 0.012, px(960), 220); leaves(tY + 0.3, 1.9, 0.007, 0.0); tap(K('year', 'keeper', -0.2), 0.008, px(960))
low(Eb3, tY + 0.1, tY + 4.0, 0.52, att=0.8, rel=0.75)
for i, m in enumerate((G4, Bb4, Ab4, G4)):
    jet(m, tY + 0.4 + 0.6 * i, hold=0.3 if i < 3 else 1.3, g=0.42, pan=-0.2 + 0.13 * i, rel=0.3 if i < 3 else 0.7)
# the scorecard: only last night's checks; the dbt project's last step keeps every result, a row for each night
knock(G('kept', 'card', -0.1), 0.012, px(470), 230)
knock(G('kept', 'night', 0.2), 0.012, px(1300), 230); tap(K('night', 'keeps', -0.3), 0.008, px(1100))
for i in range(4):
    tap(K('night', 'table', -0.2 + 0.3 * i), 0.006, px(1300))
# the week on the dashboard, beside what people count; a check that holds more names each night: G minor
knock(G('kept', 'dash', -0.1), 0.012, px(960), 220); air(K('dash', 'dashboard', 0.0), 1.2, 0.006, px(700), 150, 700)
tHm = K('week', 'holds more', 0.0)
low(G2, tHm - 0.6, tHm + 2.0, 0.52, att=0.8, rel=0.7)
jet(D5, tHm - 0.2, hold=0.4, g=0.42, pan=px(700), rel=0.35); jet(Bb4, tHm + 0.3, hold=1.0, g=0.42, pan=px(700), rel=0.6)
tap(tHm + 0.8, 0.008, px(1100))
# the year's numbers, a tile each; as the hours come down, E-flat, rising, into the next chapter
for word, x_ in (('forty-one', 420), ('seventy-nine', 960), ('three hundred', 1500)):
    knock(K('so', word, -0.3), 0.012, px(x_), 230)
tNw = K('so', 'now about', 0.0)
low(Eb3, tNw - 0.2, tNw + 2.6, 0.52, att=0.8, rel=0.75)
for i, m in enumerate((G4, Bb4, Eb5)):
    jet(m, tNw + 0.15 * i, hold=0.2 if i < 2 else 1.2, g=0.42, pan=-0.2 + 0.2 * i, rel=0.25 if i < 2 else 0.7)

# =============================================================================================================================
# 6. At the same table: three entries. The people who use the list and the people who make it, at one table: A-flat, rising. Mexico,
#    1955, the farmers at the table: A-flat. The land for a research station, and a tax on their own wheat: E-flat. A tap for each
#    chip and name tag, a knock for the card
T = lambda lid, word, off=0: W('table', lid, word, off)
tap(T('enough', 'use the list', -0.2), 0.008, px(280)); tap(T('enough', 'make it', -0.2), 0.008, px(960))
tTb = T('enough', 'same table', 0.0)
low(Ab2, tTb - 0.5, tTb + 2.4, 0.55, att=0.8, rel=0.7)
for i, m in enumerate((Ab4, C5, Eb5)):
    jet(m, tTb + 0.3 * i, hold=0.18 if i < 2 else 1.1, g=0.42, pan=-0.3 + 0.3 * i, rel=0.22 if i < 2 else 0.6)
for lid, word, x_, off in (('bring', 'Malia', 280, -0.2), ('bring', "Mei's", 620, -0.2), ('checks', 'Jun', 960, -0.2), ('checks', 'Jun', 1300, 0.2)):
    tap(T(lid, word, off), 0.007, px(x_))
tap(T('asked', 'admissions', 0.0), 0.007, px(1660))
# Mexico, 1955: the farmers and the team at one table
tFm = G('table', 'farmers', -0.4)
low(Ab2, tFm, tFm + 3.4, 0.55, att=1.0, rel=0.75)
jet(Eb4, tFm + 0.5, hold=0.4, g=0.42, pan=-0.2, rel=0.35); jet(Ab4, tFm + 0.9, hold=1.2, g=0.42, pan=0.0, rel=0.6)
# the land for a new research station, and more from a tax on their own wheat: E-flat
tRs, tTx = T('land', 'research station', 0.0), T('land', 'taxed', 0.0)
knock(tRs - 0.5, 0.012, px(960), 230); tap(tTx - 0.2, 0.008, px(1118))
low(Eb3, tRs - 0.4, tTx + 1.8, 0.5, att=0.8, rel=0.75)
jet(G4, tRs - 0.2, hold=0.6, g=0.42, pan=px(680), rel=0.5); jet(Eb5, tTx, hold=1.2, g=0.42, pan=px(1118), rel=0.7)

# =============================================================================================================================
# 7. His name, as he says it: six entries. The Great Hall, Wednesday 9 December: E-flat, warm. Mei reads his name as he says it: one
#    jet held. This December's 3: E-flat, low. The next small change: a jet a step up, carried into Mexico, round after round, rising
#    step by step over a low E-flat. 1963, selling wheat abroad: E-flat, rising, held under the film's promise. The end card: the
#    mark, seven notes. A knock for each card, paper for the certificate, a tap for each mark on it, air for the sacks
S = lambda lid, word, off=0: W('stage', lid, word, off)
s0 = S0('stage')
low(Eb2, s0 + 0.4, s0 + 3.8, 0.55, att=1.0, rel=0.75)
jet(G4, s0 + 1.2, hold=0.8, g=0.42, pan=-0.15, rel=0.5); jet(Bb4, s0 + 2.2, hold=1.2, g=0.42, pan=0.15, rel=0.7)
knock(S('reads', 'Andrés', -0.2), 0.012, px(360), 230)
tSy = S('reads', 'as he says it', 0.0)
low(Eb3, tSy - 0.3, tSy + 2.2, 0.5, att=0.8, rel=0.75)
jet(Eb5, tSy, hold=1.3, g=0.42, pan=px(560), rel=0.7)
# his certificate, every letter; this December's 3, not 41
paper(G('stage', 'cert', -0.4), 0.010, px(960), 0.45)
tEv = S('cert', 'every letter', 0.2)
tap(tEv, 0.008, px(900)); tap(tEv + 0.35, 0.008, px(1100))
t3 = G('stage', 'three', 0.1)
knock(t3, 0.013, px(980), 220)
low(Eb2, t3 - 0.1, t3 + 2.2, 0.5, att=0.8, rel=0.75)
jet(Bb4, t3 + 0.2, hold=1.0, g=0.42, pan=px(700), rel=0.6)
tCh = S('why', 'changed', 0.0)
knock(tCh - 0.4, 0.011, px(380), 230); knock(tCh, 0.011, px(960), 230); knock(S('why', 'confirmed', -0.3), 0.011, px(1540), 230)
# Thursday 17 December: the next small change, a jet a step up; carried into Mexico, round after round, step by step
knock(G('stage', 'next', 0.4), 0.012, px(1240), 230)
tPk = S('next', 'pick', 0.0)
low(Ab2, tPk - 0.3, G('stage', 'mexico', 0.2), 0.5, att=0.8, rel=0.7)
jet(Bb4, tPk, hold=0.35, g=0.42, pan=px(1240), rel=0.3); jet(C5, tPk + 0.45, hold=1.0, g=0.42, pan=px(1240), rel=0.6)
tMx = G('stage', 'mexico', 0.4)
low(Eb2, tMx - 0.4, tMx + 4.6, 0.5, att=1.0, rel=0.75)
for i, m in enumerate((G4, Ab4, Bb4, C5)):
    jet(m, tMx + 1.1 * i, hold=0.5 if i < 3 else 1.1, g=0.4, pan=px(560 + 300 * i), rel=0.4 if i < 3 else 0.6)
# 1963: the sacks leave Mexico, sold abroad; E-flat rising, held under the film's promise
tSl = S('round', 'selling', 0.0)
knock(tSl - 0.4, 0.012, px(1440), 230); air(tSl - 0.2, 2.4, 0.008, 0.3, 150, 800)
low(Eb3, tSl - 0.4, G('stage', 'promise', 1.4), 0.5, att=0.8, rel=0.75)
for i, m in enumerate((G4, Bb4, Eb5)):
    jet(m, tSl - 0.2 + 0.25 * i, hold=0.2 if i < 2 else 1.4, g=0.42, pan=0.1 + 0.15 * i, rel=0.25 if i < 2 else 0.7)
knock(G('stage', 'promise', -0.2), 0.012, px(960), 230); air(G('stage', 'promise', 0.4), 1.8, 0.006, px(1520), 150, 700)
# the eight films, a card each as it's named
for i, (lid, word) in enumerate((('recap', 'Say'), ('recap', 'Measure'), ('recap', 'truth'), ('recap', 'clock'), ('recap2', 'Fix'), ('recap2', 'Answer'),
                                  ('recap2', 'Write'), ('better', 'better'))):
    knock(S(lid, word, -0.15), 0.010, px(335 + 430 * (i % 4)), 230 + 10 * (i % 4))
# the end card: the mark, seven notes, the low E-flat under it, ringing out
mark(G('stage', 'breath', -0.1), 7, 1.0, under=2.3)
