# One word, one home: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for this film (PLAYBOOK.md: vary the sound itself): wood, as the board found at Liye was. A consort of recorders holds
# the chords, one recorder to a note, breathy and soft; a low marimba, played with soft mallets, gives the notes of what appears; and
# the series' mark, 1-5-4-8, plays on the alto recorder with the marimba an octave under it, at the title and the end. E minor for
# Qin and the county's board (no borrowed Chinese instruments or scales: the story is told in the series' own voice); G major, its
# relative, from the moment a university has the same problem, and for today.
# The marimba means the same thing all through. Each meaning of award has its note: violet's, the one that stays, is G, the home
# note; rose's is A and olive's is F-sharp, its neighbours on either side. Each glossary sounds its meaning's note as it's named, the
# three sound together for "three different awards", and when a glossary is made to read from the one that stays, its note steps
# home to G. Every tool reading the glossary is one figure, G and D rising in octaves, left to right, as each screen is reached.
# When the music plays (the series' rule since 20 October 2026; tools/quiet.py checks it):
#  - Under the opening, Qin's story and the board, chords follow the narration. After it, music comes in from time to time: a chord
#    at some chapters' turns, under a moment on screen (the three meanings lit, nobody knowing which to trust, every screen reading
#    award, the keepers thanked) or in the wordless ending, and the marimba's notes as things appear. Never a constant bed under the
#    voice, and no urgent pulse: the film's turns are decisions, not a rush.
#  - Nothing trembles: every chord has one voice to a note, in tune, and the recorders' pitch is summed in double precision, so
#    nothing beats on a phone's one speaker.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the
#    picture in src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: ox carts' wheels, wooden slips, a brush of ink, paper, pins in cork, sticky notes, a pen, muffled
# keys, a rubber stamp and an archive box, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def END(sid, lid, off=0):
    """when a line's voice ends (the scenes' sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
# where something sits across the frame, as a pan: the frame's left edge is -0.75, its right edge 0.75
P = lambda x: max(-0.8, min(0.8, (x - 960) / 960 * 0.75))
# where a point of a place is seen, with the camera at (cx, z): the frame's x
seen = lambda x, cx, z: 960 + (x - cx) * z

# ---- the film's instruments: wood ----
# the levels, set against When strategy moves (PLAYBOOK.md: check a new palette's levels against a film that sounds right), measured on
# their own as tools/audio.py mixes them: the opening's chords sit as its chords do, the marimba's notes and the effects as its notes and
# effects do. The marimba (NOTE) and the effects (FX) come out of their recipes softer, so they're raised by these factors
NOTE, FX = 1.5, 1.35
def _rec(m, sec, a=0.35, r=0.6, vib=0.0):
    """one recorder: an almost pure tone, with a little of its octave and less of its twelfth (so a fifth's overtones, where they
    meet, are too faint to beat), its breath under it and the soft chiff of its start; its pitch summed in double precision"""
    f = mf(m); x = tt(sec).astype(np.float64)
    ph = 2 * np.pi * np.cumsum(f * (1 + vib * np.sin(2 * np.pi * 4.8 * x) * np.clip((x - 0.5) / 0.8, 0, 1))) / SR if vib else 2 * np.pi * f * x
    s = (np.sin(ph) + 0.14 * np.sin(2 * ph) + 0.03 * np.sin(3 * ph)).astype(np.float32)
    br = filt(noise(sec), 'band', (f * 0.8, min(f * 2.5, 2400))) * 0.04
    ch = filt(noise(sec), 'band', (min(f * 2, 1900), 2400)) * np.exp(-tt(sec) * 45) * 0.25
    return ((s + br + ch) * env(sec, a, r)).astype(np.float32)
def consort(ch, start, sec, g=0.03):
    """a held chord on the recorder consort: one recorder to a note, each a little apart across the stereo field, swelling slowly
    (From words to data's pad() gives each note three voices a hair apart, which beat on a phone's one speaker)"""
    sw = (1 + 0.07 * np.sin(2 * np.pi * 0.06 * tt(sec))).astype(np.float32); a, r = min(2.2, sec * 0.4), min(3.0, sec * 0.45)
    for k, m in enumerate(ch):
        put(_rec(m, sec, a, r) * sw / len(ch), start, g * 1.58, (k / max(1, len(ch) - 1) - 0.5) * 0.8)
def comes(ch, t0, sec=6.0, g=0.028, bassg=0.016):
    """a chord that comes in for a moment and leaves, bloomed by t0: at a chapter's turn, under a moment on screen, or in a pause
    without words; its root an octave down, as a low sine"""
    consort(ch, t0 - 1.0, sec, g)
    if bassg:
        drone(ch[0] - 12, t0 - 1.0, sec, bassg, 'sine')
def bed(sid, chords, a=None, b=None, g=0.026, bassg=0.016):
    """the opening's chords, under Qin's story and the board only: spread over the span, each starting 2 s early and lasting 4 s
    longer, so they never drop out while the story is told"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        consort(ch, s0 + i * d - 2.0, d + 4.0, g)
        if bassg:
            drone(ch[0] - 12, s0 + i * d - 2.0, d + 4.0, bassg, 'sine')
def wood(m, start, g=0.016, pan=0.0):
    """the low marimba, soft mallets: the bar's note, its overtone two octaves up, faint and quick to go, and the mallet's soft knock;
    under 2 s long, so it never holds"""
    f = mf(m); sec = 1.8; x = tt(sec).astype(np.float64); d = 0.75 * (196 / f) ** 0.5
    s = np.sin(2 * np.pi * f * x) * np.exp(-x / d)
    if 4 * f < 2400:
        s = s + 0.2 * np.sin(2 * np.pi * 4 * f * x) * np.exp(-x / (d * 0.15))
    s = (s * np.minimum(1, x / 0.002) * np.clip((sec - x) / 0.3, 0, 1)).astype(np.float32)
    n = int(0.04 * SR); s[:n] += 0.35 * filt(noise(0.04), 'low', 400) * np.exp(-tt(0.04) * 90)
    put(norm(filt(s, 'low', 2200)), start, g * NOTE, pan)
def mark(start, root=67, g=0.05):
    """the series' four notes, 1-5-4-8, rising: the alto recorder, with the marimba an octave under it"""
    for i, iv in enumerate([0, 7, 5, 12]):
        sec = 1.1 if i < 3 else 2.6
        put(norm(filt(_rec(root + iv, sec, 0.06, min(0.45, sec * 0.4), vib=0.002), 'low', 2400)), start + i * 0.42, g * 0.7, (i - 1.5) * 0.12)
        wood(root + iv - 12, start + i * 0.42, g * 0.6, (i - 1.5) * 0.15)
# each meaning's note on the marimba: violet's, the one that stays, is home (G); rose's (A) and olive's (F-sharp) are its neighbours
VIO, ROSE, OLIVE = 67, 69, 66
def home(m, t0, g=0.014, pan=0.0, step=0.28):
    """a glossary made to read from the one that stays: its meaning's note, then home"""
    wood(m, t0, g, pan); wood(VIO, t0 + step, g * 1.1, pan)
def every(times, g=0.014):
    """every tool reading the glossary: G and D rising in octaves, left to right, one note as each screen is reached"""
    for k, (t0, x) in enumerate(times):
        wood([55, 62, 67, 74, 79][k], t0, g * (1 - 0.05 * k), P(x))

# ---- sounds: soft, and low ----
def knock(s, g=0.05, pan=0.0, f=240):
    """a soft wooden knock, for a card or a tag arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.03, pan=0.0):
    """a muffled key, or a click"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g * FX, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, g=0.02, pan=0.0, sec=0.5):
    """a pencil on paper: a soft, short scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec), s, g * FX, pan)
def marker(s, g=0.02, pan=0.0, sec=0.4):
    """a marker's stroke: broader than a pencil, and rougher, as its felt drags on the paper"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1700)) * (0.55 + 0.45 * np.sin(2 * np.pi * 15 * x)) * np.sin(np.pi * x / sec) ** 0.7, s, g * FX, pan)
def inkbrush(s, sec=0.5, g=0.016, pan=0.0):
    """a brush of ink on wood: a smooth, soft stroke, without a pencil's scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (280, 1400)) * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def tallies(s, sec, n, g=0.01, pan=0.0):
    """pencil strokes counted one by one, n of them over sec"""
    for k in range(n):
        x = tt(0.05); X(filt(noise(0.05), 'band', (600, 2000)) * np.sin(np.pi * x / 0.05), s + sec * k / max(1, n), g * FX * (0.85 + 0.15 * ((k * 7) % 3) / 2), pan)
def press(s, g=0.1, pan=0.0):
    """a rubber stamp or a confirmation: a low thud and a knock, nothing bright"""
    thud(s, g * FX); knock(s + 0.01, g * 0.4, pan)
def pin(s, g=0.02, pan=0.0):
    """a pin pressed into cork: a small, high knock, still under 1.4 kHz"""
    knock(s, g, pan, 330); tap(s + 0.01, g * 0.4, pan)
def stick(s, g=0.02, pan=0.0):
    """a paper note pressed onto the whiteboard: a soft pat"""
    paper(s, g * 0.6, pan, 0.16); knock(s + 0.07, g * 0.5, pan, 210)
def drop(s, g=0.02, pan=0.0):
    """a card dropping into the archive box: a breath of paper and a low, dull knock"""
    paper(s - 0.12, g * 0.4, pan, 0.18); knock(s, g, pan, 150)
def air(s, sec=0.9, g=0.03, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def frost(s, g=0.012, pan=0.0):
    """a card going behind frosted glass: a soft, airy hush"""
    s_air(s, 0.6, g * FX, pan, 500, 2000)
def dust(s, sec=1.4, g=0.008, pan=0.0):
    """cobwebs over a screen nobody opens: the faintest, lowest air"""
    s_air(s, sec, g * FX, pan, 110, 600)
def typing(s, sec, g=0.008, pan=0.0, n=None):
    """keys typed: muffled, a little uneven"""
    n = n or max(2, int(sec * 7))
    for k in range(n):
        tap(s + sec * (k + 0.3 * ((k * 5) % 3) / 2) / n, g * (0.8 + 0.2 * (k % 2)), pan)
def _move(sig, s, g, p0, p1):
    """a sound that crosses the frame with what it belongs to, from pan p0 to p1"""
    p = np.linspace(p0, p1, len(sig)).astype(np.float32)
    X(sig * np.sqrt(0.5 * (1 - p)), s, g * FX, -1.0); X(sig * np.sqrt(0.5 * (1 + p)), s, g * FX, 1.0)
def glide(s, sec, g, p0, p1, lo=150, hi=1000):
    """a breath of air that crosses the frame, as a thing or a light travels from one side to the other"""
    x = tt(sec); _move((filt(noise(sec), 'band', (lo, hi)) * np.sin(np.pi * x / sec) ** 2).astype(np.float32), s, g, p0, p1)

# ---- Qin's own sounds ----
def wheels(s, sec, g, p0, p1, seed=0):
    """an ox cart's wooden wheels on a dirt road: a low roll that bumps now and then, and the axle's creak every turn or so, carried
    across the frame with the cart, and fading as it goes into the distance"""
    x = tt(sec); r = np.random.default_rng(31 + seed)
    b = filt(r.standard_normal(len(x)).astype(np.float32), 'low', 2.5); b = 0.65 + 0.35 * b / (np.abs(b).max() + 1e-9)
    sig = filt(noise(sec), 'band', (45, 240)) * b
    t0 = r.uniform(0.3, 1.0)
    while t0 < sec - 0.6:
        n = int(0.34 * SR); i = int(t0 * SR); y = tt(0.34)
        c = filt(noise(0.34), 'band', (170, 560)) * (0.5 + 0.5 * np.sin(2 * np.pi * r.uniform(38, 52) * y)) * np.sin(np.pi * y / 0.34) ** 2
        sig[i:i + n] += 0.5 * c[:len(sig) - i]
        t0 += r.uniform(1.3, 2.2)
    e = np.minimum(1, x / 0.8) * np.clip((sec - x) / 1.0, 0, 1) * np.linspace(1, 0.7, len(x))
    _move(filt((sig * e).astype(np.float32), 'low', 900), s, g, p0, p1)
def slips(s, g=0.016, pan=0.0, n=5):
    """wooden slips on a mat: a few small, dry knocks close together"""
    r = np.random.default_rng(int(s * 100)); t0 = 0.0
    for k in range(n):
        knock(s + t0, g * r.uniform(0.6, 1.0), pan + r.uniform(-0.08, 0.08), r.uniform(300, 400)); t0 += r.uniform(0.05, 0.12)

# chords (MIDI note numbers): E minor and its neighbours for Qin and the board; G major, its relative, for the university
EM9 = [52, 59, 66, 67, 71]; CMAJ7 = [48, 55, 64, 67, 71]; DSUS4 = [50, 57, 62, 67, 69]; AM9 = [57, 60, 64, 67, 71]; D69 = [50, 57, 64, 66, 71]
CADD9 = [48, 55, 62, 64, 67]; GADD9 = [55, 62, 67, 69, 71]; GMAJ9 = [55, 62, 66, 69, 71]; EM7 = [52, 59, 62, 67, 71]
GOPEN = [55, 59, 62, 67, 74]  # G major with its third low, so the mark's fourth (C) passes over it without rubbing
THREE = [50, 57, 66, 67, 69]  # the three meanings' notes, F-sharp, G and A, held over an open fifth: not settled


# 1. One script: the opening, the one chapter with chords all through, E minor and its neighbours. The road: two ox carts' wooden
#    wheels, low, going away up the road. The gate: the cart going in. Close on the seller's table, the film's notes for its meanings
#    come in with the tags: A for his old state's measure, G, home, for Qin's; the two together, a second apart, for the doubt, over a
#    suspended chord. Back at the gate: a knock for each tag as it's named (one script, one set of measures, one cart width) and a
#    pencil as the ruts are measured; as the empire sets them by law, the old measure is put away (a low knock) and its A steps home to
#    G, and the chords come home to E minor. Close on the seller's table again, C major as the measure has to hold the same everywhere:
#    a knock for Qin's measure, a knock and the home note for the same everywhere, and its third as prices can be trusted. The orders
#    from the capital: the slips on their mat, a knock for the tag, paper for the card, a brush of ink as the king's order is struck and
#    as the emperor's edict is written in, and the home note for the new words. The county: the scribes' brushes, and a wooden tock and
#    the home note as the middle one checks the board; paper for its rules, each old word and the new one. The board found: a knock and
#    an open fifth, low, as it's found in a well, and the county's own records laid out beside it (dry slips); pins for the tally cards,
#    a pencil stroke for each time the new word was used, and one for the old; a knock and the home note for the same word as in the
#    capital; the home note and its third as the board is lit, a glossary that was used. The floor: G major's neighbours, then
#    suspended, for the university's same problem: each screen's note as its card comes up, A for the old words, G for the new, and the
#    two together for the doubt; a breath as the one glossary comes in, in outline, and every tool reading from it; G major, open, under
#    the title, and the mark
S = 'script'
bed(S, [EM9], 0, cq(S, 'one'))
bed(S, [CMAJ7], cq(S, 'one'), cq(S, 'pain'))
tMade = W(S, 'need', 'set them')
bed(S, [AM9, DSUS4], cq(S, 'pain'), tMade - S0(S) - 1.0)
bed(S, [EM9], tMade - S0(S) + 1.0, cq(S, 'relief'))
bed(S, [CMAJ7], cq(S, 'relief'), cq(S, 'words'))
bed(S, [AM9, D69], cq(S, 'words'), cq(S, 'board'))
bed(S, [EM9], cq(S, 'board'), cq(S, 'well'))
bed(S, [CMAJ7], cq(S, 'well'), cq(S, 'used'))
bed(S, [AM9, D69], cq(S, 'used'), cq(S, 'glossary'))
bed(S, [EM9], cq(S, 'glossary'), cq(S, 'bridge'))
bed(S, [CADD9, DSUS4], cq(S, 'bridge'), cq(S, 'needs'))
bed(S, [GADD9], cq(S, 'needs'), cq(S, 'breath'))
bed(S, [GOPEN], cq(S, 'breath') + 0.4, None, g=0.03, bassg=0.022)
tGate, tStall, tBack, tRl, tSl = C(S, 'one', -0.2), C(S, 'pain', -0.3), C(S, 'need', -0.3), C(S, 'relief', -0.3), C(S, 'words', -0.3)
wheels(-0.5, tGate + 0.9, 0.022, P(990), P(1010), 0)
wheels(-0.5, tGate + 0.9, 0.01, P(1150), P(1110), 1)
wheels(tGate - 0.4, tStall - tGate + 0.8, 0.016, P(700), P(780), 2)
wheels(tBack - 0.2, tRl - tBack + 0.5, 0.01, P(805), P(830), 3)
tOld, tQin, tDoubt = W(S, 'pain', 'in one state'), W(S, 'pain', 'than in the next'), W(S, 'pain', 'in doubt', -0.2)
knock(tOld + 0.05, 0.012, P(600)); wood(ROSE, tOld + 0.1, 0.012, P(600))
knock(tQin + 0.05, 0.012, P(1320)); wood(VIO, tQin + 0.1, 0.012, P(1320))
wood(ROSE, tDoubt + 0.15, 0.009, P(900)); wood(VIO, tDoubt + 0.15, 0.009, P(1020))
tN = [W(S, 'need', 'script'), W(S, 'need', 'measures'), W(S, 'need', 'cart widths', 0.05)]
for k, x in enumerate([205, 1510, 670]):
    knock(tN[k] + 0.05, 0.014, P(x), 250 + 14 * k)
pencil(tN[2] - 0.15, 0.009, P(670), 0.6)
knock(tMade + 0.4, 0.012, P(1430), 170); home(ROSE, tMade + 0.15, 0.012, P(1460))
tRs, tRt = W(S, 'relief', 'the same everywhere'), W(S, 'relief', 'could be trusted')
knock(tRl + 0.4, 0.01, P(1320))
knock(tRs + 0.05, 0.012, P(960)); wood(VIO, tRs + 0.12, 0.012, P(960))
wood(71, tRt + 0.15, 0.011, P(1000))
tKg, tEm = W(S, 'words', "the king's"), W(S, 'words', 'became')
slips(tSl + 0.1, 0.012, P(645))
knock(tSl + 0.4, 0.014, P(645))
paper(tKg - 0.2, 0.03, P(1460), 0.5)
inkbrush(tEm - 0.1, 0.5, 0.016, P(1300))
tap(tEm + 0.3, 0.008, P(1250))
inkbrush(tEm + 0.4, 0.45, 0.014, P(1330)); inkbrush(tEm + 0.85, 0.45, 0.012, P(1400))
wood(VIO, tEm + 0.6, 0.014, P(1360))
tCo, tCk = C(S, 'board', -0.4), W(S, 'board', 'kept a list', -0.3)
for k, (d, x) in enumerate([(0.3, 733), (0.9, 1670), (1.6, 733), (2.3, 1670)]):
    inkbrush(tCo + d, 0.35, 0.007, P(x))
knock(tCk + 0.25, 0.012, P(1074), 210); wood(VIO, tCk + 0.3, 0.011, P(1074))
tRu, tWl = W(S, 'board', 'each old', -0.1), W(S, 'well', 'in an old')
paper(tRu, 0.024, P(690), 0.5)
knock(tWl + 0.05, 0.014, P(1090)); wood(40 + 12, tWl + 0.1, 0.014, P(690)); wood(47 + 12, tWl + 0.1, 0.011, P(690))
tRs, tRc = W(S, 'well', 'with thousands'), W(S, 'used', 'use the new')
slips(tRs + 0.1, 0.01, P(1550), 7)
pin(tRc + 0.1, 0.018, P(1550)); tallies(tRc + 0.15, 1.6, 34, 0.007, P(1550))
pin(tRc + 1.7, 0.018, P(1550)); tallies(tRc + 1.75, 0.3, 1, 0.009, P(1550))
tSame = W(S, 'used', 'the same in')
knock(tSame + 0.05, 0.012, P(1550)); wood(VIO, tSame + 0.12, 0.01, P(1550))
tGl = C(S, 'glossary')
wood(VIO, tGl + 0.15, 0.016, P(690)); wood(71, tGl + 0.4, 0.012, P(690))
tWord, tDiff, tOne, tEv = W(S, 'bridge', 'one word'), W(S, 'bridge', 'defined'), W(S, 'needs', 'one glossary'), W(S, 'needs', 'every tool')
for i, x in enumerate([274, 516, 1042, 1284, 1810]):
    wood(ROSE if i < 3 else VIO, tWord + 0.25 * i + 0.05, 0.011, P(x))
wood(ROSE, tDiff + 0.4, 0.008, P(930)); wood(VIO, tDiff + 0.4, 0.008, P(990))
air(tOne - 0.1, 0.8, 0.012, 0.0)
every([(tEv - 0.2 + 1.4 * (1 + 0.08 * i) / 1.32, x) for i, x in enumerate([274, 516, 1042, 1284, 1810])])
mark(G(S, 'breath', 0.2))
# After the opening, music only from time to time: chords at a few turns, moments and pauses, and the marimba's notes as things appear
# 2. Five glossaries: an E minor chord at the turn, Mei at her desk where Who decides left her. Each glossary sounds its meaning's
#    note as it's named: the platform's G, then A for Planning's sheet, the policy's appendix and the 2019 printout, F-sharp for the
#    faculty's tablet; paper for the appendix and the printout, a muffled key for the copy's pill. All five together: a knock for
#    "3 meanings", the three notes as their dots appear, and the three held, unsettled, over an open fifth
F = 'five'
comes(EM9, S0(F) + 0.5, 5.5, 0.024)
wood(VIO, C(F, 'platform', 0.05), 0.016, 0.0)
tap(W(F, 'platform', 'The data', -0.1), 0.008, P(960))
wood(ROSE, C(F, 'sheet', 0.05), 0.015, P(883))
paper(C(F, 'appendix', -0.1), 0.016, P(476), 0.4); wood(ROSE, C(F, 'appendix', 0.05), 0.015, P(476))
wood(OLIVE, C(F, 'dash', 0.05), 0.015, P(564))
paper(C(F, 'tool', -0.1), 0.016, P(268), 0.4); wood(ROSE, C(F, 'tool', 0.05), 0.015, P(268))
t3 = C(F, 'three')
knock(t3 + 0.35, 0.014, P(1420))
for m_, n_ in enumerate([VIO, ROSE, OLIVE]):
    wood(n_, t3 + 0.6 + m_ * 0.2, 0.014, P(1330 + 90 * m_))
comes(THREE, t3 + 1.3, 4.5, 0.02)
# 3. Many is none: a pin for each card as Yusuf puts it up, and a soft knock for each tag under it; a marker as the platform's
#    microcredentials are underlined, with its G, and as the dashboard's degree is, with its F-sharp. A hush as two cards go behind
#    frosted glass. The 2019 tool: the faintest air as cobwebs grow, and a knock and a low, dull A for "last opened 14 months ago".
#    Monday: a knock and G for the one that changed, a dull knock for each "no change". The floor: a soft knock for each "which one?",
#    and A minor, for a moment, as nobody knows which to trust
N = 'none'
for i in range(5):
    pin(S0(N) + 0.1 + 0.3 * i + 0.12, 0.014, P(360 + 300 * i))
    knock(C(N, 'reason', 0.5 + 0.75 * i + 0.05), 0.008, P(360 + 300 * i), 230)
tMc, tDg = W(N, 'differ', 'counts'), W(N, 'differ', 'a degree')
marker(tMc, 0.012, P(360), 0.5); wood(VIO, tMc + 0.1, 0.014, P(360))
marker(tDg, 0.012, P(1260), 0.5); wood(OLIVE, tDg + 0.1, 0.014, P(1260))
tFd = W(N, 'hidden', 'found', -0.3)
frost(tFd, 0.012, P(660)); frost(tFd + 0.15, 0.012, P(960))
tLg = C(N, 'unused', -0.35)
dust(tLg + 0.3, 1.4, 0.008, 0.0)
tMo = W(N, 'unused', 'last opened')
knock(tMo + 0.05, 0.014, P(1240)); wood(ROSE - 12, tMo + 0.1, 0.012, P(1240))
tMn, tFr = W(N, 'monday', 'only one'), W(N, 'monday', 'The other four')
knock(tMn + 0.05, 0.014, P(360)); wood(VIO, tMn + 0.1, 0.014, P(360))
for i in range(1, 5):
    knock(tFr + 0.2 * i + 0.05, 0.01, P(360 + 300 * i), 160)
tWh = W(N, 'none', 'Nobody knows')
for i, x in enumerate([252, 520, 1020, 1288, 1788]):
    knock(tWh - 0.4 + 0.28 * i + 0.05, 0.009, P(x), 200 + 12 * (i % 3))
comes(AM9, tWh + 1.0, 5.0, 0.02)
# 4. One to trust: G major at the turn, as Yusuf brings the owners together. Air as the biggest moves aside, and G and D as the glossary
#    on the platform is chosen. Back in the county office, like the Qin board: the opening's E minor for a moment, the scribes' brushes,
#    and the wooden tock and the home note as the middle one checks the board at his elbow, a soft knock for its tag. Its term, line by
#    line: a muffled key and a note for each, rising (its definition, owner, status and date). The three side by side: paper for each; G
#    for the business glossary, D, lower, for the data dictionary, both for the catalog that shows both
T = 'trust'
comes(GADD9, S0(T) + 0.5, 6.0, 0.026)
air(W(T, 'not', 'Not the', 0.1), 0.9, 0.012, 0.3)
tPk = W(T, 'not', 'the glossary')
wood(VIO, tPk + 0.4, 0.016, 0.0); wood(74, tPk + 0.62, 0.012, 0.0)
tEl, tWk = C(T, 'elbow', -0.3), W(T, 'elbow', 'where the work', -0.2)
comes(EM9, tEl + 0.9, 4.5, 0.02)
inkbrush(tEl + 0.4, 0.35, 0.007, P(seen(733, 1030, 1.42))); inkbrush(tEl + 1.2, 0.35, 0.007, P(seen(1670, 1030, 1.42)))
knock(tWk + 0.25, 0.012, P(seen(1074, 1030, 1.42)), 210); wood(VIO, tWk + 0.3, 0.011, P(seen(1074, 1030, 1.42)))
knock(tWk + 0.55, 0.008, P(seen(1126, 1030, 1.42)))
for wd, m_ in [('a definition', 67), ('an owner', 71), ('a status', 74), ('the date', 79)]:
    t0 = W(T, 'term', wd); tap(t0 - 0.1, 0.008, P(600)); wood(m_, t0 + 0.05, 0.012, P(600))
tWd, tDc, tCt = C(T, 'words', -0.2), W(T, 'dict', 'A data'), W(T, 'dict', 'A catalog')
paper(tWd, 0.02, P(420), 0.4); wood(VIO, tWd + 0.3, 0.013, P(420))
paper(tDc - 0.1, 0.02, P(960), 0.4); wood(62, tDc + 0.2, 0.013, P(960))
paper(tCt - 0.1, 0.02, P(1500), 0.4); wood(VIO, tCt + 0.2, 0.011, P(1500)); wood(62, tCt + 0.2, 0.011, P(1500))
# 5. Every tool reads it: G as the glossary on the platform is lit; a rubber stamp for the 2019 tool, retired; air as each of its
#    owned terms flies across, and a knock and a note as it lands in the glossary's card; a knock for the archive box, and a dull knock
#    for each card dropped in. Then each glossary steps home: Planning's sheet (a muffled key for the link, a click, then A to G as the
#    term opens), the registrar's policy (a marker as its words are struck, keys as the glossary is named, A to G), the faculty's
#    dashboard (F-sharp to G, read from the platform). The data team's room at night: air, and G as its copy says where its words came
#    from, a knock for "checked every night". One way: every tool reading the glossary, a knock for the tag, and a G major chord, the
#    moment on screen, as every office's screen reads award
R = 'read'
wood(VIO, C(R, 'others', 0.3), 0.012, P(360))
tSt, tMv, tAr = W(R, 'tool', 'is retired'), W(R, 'tool', 'Its terms'), W(R, 'tool', 'the rest')
press(tSt + 0.2, 0.024, P(1560))
for j in range(3):
    t0 = tMv + 0.3 * j
    glide(t0, 1.2, 0.012, P(1470), P(270 + 14 * j)); knock(t0 + 1.2, 0.012, P(270 + 14 * j)); wood([67, 71, 74][j], t0 + 1.22, 0.012, P(270))
knock(tAr - 0.6, 0.012, P(1615), 150)
for j in range(4):
    drop(tAr + 0.72 + 0.216 * j, 0.012, P(1615))
tLk, tCl = W(R, 'sheet', 'links'), W(R, 'sheet', 'instead', 0.1)
tap(tLk + 0.1, 0.008, P(780)); tap(tCl, 0.012, P(780))
home(ROSE, tCl + 0.3, 0.014, P(780))
tSy, tAs = W(R, 'policy', 'now says'), W(R, 'policy', 'award, as')
marker(tSy, 0.012, P(900), 0.8)
typing(tAs, 1.5, 0.007, P(900))
home(ROSE, tAs + 1.0, 0.014, P(900))
home(OLIVE, W(R, 'dash', 'read from', 0.1), 0.014, 0.0)
tNt = C(R, 'copy', -0.4)
air(tNt + 0.1, 1.4, 0.01, -0.2)
wood(VIO, W(R, 'copy', 'it says', 0.4), 0.014, P(920))
knock(W(R, 'copy', 'checked against', 0.05), 0.012, P(1290))
tWy = C(R, 'way', -0.4)
every([(tWy + 0.4 + 1.6 * (1 + 0.08 * i) / 1.32, x) for i, x in enumerate([274, 516, 1042, 1284, 1810])])
knock(W(R, 'way', 'one way', 0.05), 0.012, 0.0)
comes(GMAJ9, tWy + 2.0, 5.0, 0.024)
# 6. When a word changes: without a nightly check, a muffled key for each month as the dashboard's line is drawn, a low, dull A as the
#    number steps up, and a dull knock for its question; a knock for each tag. Monday night: an E minor chord at the turn, a knock for
#    the tag, then a pencil and A as the copy's old words are ringed, and a knock for the tag that says why. The change notice: air and
#    paper as it comes in, A and then G as the old words and the new are shown. Like the Qin board: the opening's E minor for a moment
#    over the board's rules, a pencil and A as its old words are underlined, a pencil and G for the new ones. Back to the notice: a note
#    for each part the new words touch, rising, and a knock for each who signs. Tuesday morning: a knock for the tag, a pen as Mei
#    signs, G and D at the tick, and the same three notes as her words' places light. Jun: a pencil under six credit points, paper for
#    the note and for the business rule's card, G as it's the rule, and a muffled key for its line that every report reads it
H = 'change'
tMs = W(H, 'before', 'when a number')
for i in range(12):
    tap(S0(H) + 1.0 + max(0, i - 0.5) / 11 * (tMs - S0(H) - 1.0) / 0.75, 0.005, P(420 + 1080 * i / 11))
wood(ROSE - 12, S0(H) + 1.0 + 7.5 / 11 * (tMs - S0(H) - 1.0) / 0.75, 0.013, P(420 + 1080 * 8 / 11))
knock(tMs + 0.1, 0.014, P(1200), 160)
knock(S0(H) + 1.05, 0.01, P(560)); knock(W(H, 'before', 'found months', 0.05), 0.012, P(1290))
tNg = C(H, 'night', -0.4)
comes(EM7, tNg + 0.5, 6.0, 0.022)
knock(tNg + 0.35, 0.01, 0.0)
tCk = W(H, 'night', 'the check'); tFo = W(H, 'night', 'found it')
pencil(tCk, 0.012, P(seen(750, 960, 1.0)), 0.8); wood(ROSE, tCk + 0.2, 0.013, 0.0); knock(tFo, 0.01, P(1300))
tNt = W(H, 'night', 'sent a')
air(tNt + 0.45, 0.6, 0.012, 0.2); paper(tNt + 0.55, 0.026, 0.0, 0.5)
wood(ROSE, tNt + 0.8, 0.011, -0.1); wood(VIO, tNt + 1.05, 0.012, -0.1)
tLk = C(H, 'like', -0.3)
comes(EM9, tLk + 0.9, 4.0, 0.02)
tOd, tNu = W(H, 'like', 'the old words'), W(H, 'like', 'the new ones')
pencil(tOd + 0.1, 0.008, P(seen(420, 930, 1.05)), 0.6); wood(ROSE, tOd + 0.15, 0.011, P(seen(420, 930, 1.05)))
pencil(tNu + 0.1, 0.008, P(seen(820, 930, 1.05)), 0.6); wood(VIO, tNu + 0.15, 0.012, P(seen(820, 930, 1.05)))
for t0, m_ in zip([C(H, 'list'), W(H, 'list', 'its dashboard'), W(H, 'list', 'The wallet')], [67, 71, 74]):
    knock(t0 - 0.05, 0.008, -0.2, 230); wood(m_, t0, 0.012, -0.2)
tOw = W(H, 'list', 'The wallet', 1.3)
knock(tOw + 0.1, 0.01, 0.4); knock(tOw + 0.3, 0.01, 0.4, 220)
knock(C(H, 'mei', -0.1), 0.01, P(seen(1420, 1160, 1.4)))
tAp = W(H, 'mei', 'approved')
pencil(tAp + 0.1, 0.012, P(seen(1340, 1371, 1.75)), 0.8); wood(VIO, tAp + 0.95, 0.014, 0.0); wood(74, tAp + 1.15, 0.011, 0.0)
tUs = W(H, 'mei', 'where her')
for i, m_ in enumerate([67, 71, 74]):
    wood(m_, tUs + 0.3 * i + 0.1, 0.011, 0.0)
tSx = W(H, 'number', 'six credit')
pencil(tSx, 0.012, P(1100), 0.6); paper(tSx + 0.7, 0.02, P(700), 0.4)
paper(W(H, 'rule', "So it's", 0.1), 0.022, P(960), 0.5)
tSe = W(H, 'rule', 'as a business')
knock(tSe, 0.01, P(700)); wood(VIO, tSe + 0.05, 0.014, P(700))
tap(W(H, 'rule', 'every report'), 0.008, P(900))
# 7. Agreed by people: paper for "a week before"; a sticky note pressed onto the board for each question as it's asked; a marker round
#    the one they agree, G and its third, and the marker again as "at least 6" is written; air as the note flies to the screen, and G
#    and D as its words go in. The keepers: a low E for Clara's definitions, and a low C for Anil's. Thanked: paper for the card, and
#    G major as Clara smiles; then air and a knock for each definition that moves into the glossary, with their notes
A = 'agree'
paper(S0(A) + 0.4, 0.016, P(200), 0.4)
tN = [W(A, 'workshop', 'should a'), W(A, 'workshop', 'from how'), W(A, 'workshop', 'credit points', 0.5)]
for j, (t0, x) in enumerate(zip(tN, [566, 662, 877])):
    stick(t0 + 0.05, 0.016, P(x))
tRg = END(A, 'workshop', -0.2)
marker(tRg, 0.014, P(877), 0.7); wood(VIO, tRg + 0.5, 0.014, P(877)); wood(71, tRg + 0.72, 0.011, P(877))
marker(tRg + 0.6, 0.01, P(1000), 0.5)
tFl = W(A, 'keeps', 'keeps what')
glide(tFl, 1.3, 0.014, P(877), P(1316))
wood(VIO, tFl + 1.1, 0.014, P(1316)); wood(74, tFl + 1.32, 0.011, P(1316))
wood(52, C(A, 'lose', 0.2), 0.012, P(700))
wood(60, W(A, 'lose', 'lose something', 0.3), 0.011, P(860))
tTk = C(A, 'thanks', -0.7)
paper(tTk + 0.2, 0.02, P(230), 0.4)
comes(GMAJ9, tTk + 1.1, 4.5, 0.022)
tBs = W(A, 'thanks', 'move into', -0.3)
for i, m_ in enumerate([71, 74]):
    t0 = tBs + 0.3 + i
    glide(t0, 1.0, 0.01, P(1700), P(1100)); knock(t0 + 1.0, 0.01, P(1000)); wood(m_, t0 + 1.0, 0.012, P(1000))
# 8. One word, one home: paper for binder 12; a pencil's tick and G as 12.4 is lit, and a pencil as Yusuf writes beside it. The floor:
#    air along the arcs, and every tool reading the glossary, as the light reaches each screen. Like the Qin board, used: the opening's
#    E minor for a moment over the board as it was found, and the home note and its third as the board is lit, as in the opening. The
#    floor again, and what one glossary gives: a knock and G as the reports agree, air and every tool's figure as a change goes out
#    along the arcs, a knock and G major's third and fifth as people trust the numbers. In the pause without words, G major, open, to
#    the end, the marimba once under the end card, and the mark
O = 'home'
paper(S0(O) + 0.2, 0.02, P(1000), 0.5)
tTc = W(O, 'policy', "glossary's")
pencil(tTc + 0.1, 0.01, P(1090), 0.3); wood(VIO, tTc + 0.2, 0.014, P(1090))
pencil(tTc + 0.5, 0.008, P(1180), 1.2)
tEy = W(O, 'home', 'every tool')
glide(tEy, 1.0, 0.01, 0.0, -0.5); glide(tEy + 0.05, 1.0, 0.01, 0.0, 0.5)
every([(tEy + 0.9 * (1 + 0.06 * i), x) for i, x in enumerate([274, 516, 1042, 1284, 1810])])
tUd = C(O, 'used', -0.4)
comes(EM9, tUd + 0.8, 3.6, 0.018)
wood(VIO, tUd + 0.5, 0.014, P(690)); wood(71, tUd + 0.75, 0.012, P(690))
tGn = [W(O, 'gain', 'Reports agree'), W(O, 'gain', 'a change'), W(O, 'gain', 'people can')]
knock(tGn[0] + 0.15, 0.01, P(330)); wood(VIO, tGn[0] + 0.2, 0.012, P(330))
glide(tGn[1], 1.0, 0.008, 0.0, -0.5); glide(tGn[1] + 0.05, 1.0, 0.008, 0.0, 0.5)
every([(tGn[1] + 0.9 * (1 + 0.06 * i), x) for i, x in enumerate([274, 516, 1042, 1284, 1810])], 0.011)
knock(tGn[2] + 0.15, 0.01, P(1590)); wood(71, tGn[2] + 0.2, 0.012, P(1590)); wood(74, tGn[2] + 0.45, 0.01, P(1590))
tEn = END(O, 'idea', 0.35)
knock(tEn + 0.65, 0.01, 0.0, 200); wood(71, tEn + 0.7, 0.012, 0.1)
comes(GOPEN, G(O, 'breath', -0.2), TOT - G(O, 'breath') + 1.2, 0.03, bassg=0.022)
mark(G(O, 'breath', 0.6))
# last, the whole score, music and effects, low-passed at 2.6 kHz: the paper's noise reached past 4 kHz in the pauses
soften()
