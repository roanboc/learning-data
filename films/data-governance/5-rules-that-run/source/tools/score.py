# Rules that run: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for this film (PLAYBOOK.md: vary the sound itself): two clarinets hold the chords over a low bowed string, one voice to
# a note, and a harp gives the notes of what appears. The harp means one thing all through: a reading. A pluck for each of the keeper's
# readings of the river, for each check named or written in, for each cell that lights. When a measure meets the level set for it, the
# harp plays an open fifth, D and A, tuned pure: the water at the sixteenth mark, a check that passed, the cell gone green again. One
# low bowed note, alone, for the red cell. The series' mark, 1-5-4-8, plays on a clarinet with the harp an octave above it, at the
# title and the end. D minor for the river and the low year (no borrowed instruments or scales: the story is told in the series' own
# voice); F major, its relative, warmer, for the university and today.
# When the music plays (the series' rule since 20 October 2026; tools/quiet.py checks it):
#  - Under the opening, the Nilometer's story, chords follow the narration; over the dry field they thin to one clarinet. After it,
#    music comes in from time to time: a chord at some chapters' turns, under a moment on screen (the column's gold mark, the owners
#    signing, the cell gone green, the column again beside the scorecard) or in the wordless ending, and the harp's notes as things
#    appear. Never a constant bed under the voice, and no urgent pulse, not even on the red night: one low note says it.
#  - Nothing trembles: one voice to a note, no vibrato, and every pitch from one scale tuned pure on D (fq() below), so a note two
#    chords share is the same pitch in both as one gives way to the other, and each chord is pure on its root; every pitch is summed in
#    double precision, so nothing beats on a phone's one speaker.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the
#    picture in src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: the river's wash, water in a channel, dry wind, footsteps on dry earth, a scroll, oars, paper, pins
# in cork, a pencil, a pen, a marker, muffled keys, a rubber stamp and a sieve, filtered below about 2.5 kHz.

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
def L(sid, t):
    """a time inside a chapter, as the scenes count it, in the film"""
    return S0(sid) + t
# where something sits across the frame, as a pan: the frame's left edge is -0.75, its right edge 0.75
P = lambda x: max(-0.8, min(0.8, (x - 960) / 960 * 0.75))
# where a point of a place is seen, with the camera at (cx, z): the frame's x
seen = lambda x, cx, z: 960 + (x - cx) * z

# ---- the film's tuning: one scale, pure on D ----
# every note the film plays takes its pitch from here: the ratio of each step to D (just intonation), D2 at its usual pitch. A note
# that two chords share is then the same pitch in both, so nothing beats as one chord gives way to the next, and the chords below
# are chosen so each of their notes is pure against the root (no chord holds C and G together, the one fifth this scale leaves narrow)
JUST = (1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8)
def fq(m):
    """a note's pitch in the film's scale (m: its MIDI number)"""
    k = int(round(m)) - 38
    return mf(38) * JUST[k % 12] * 2.0 ** (k // 12)

# ---- the film's instruments: two clarinets, a low bowed string, a harp ----
# the levels, set against One word, one home (PLAYBOOK.md: check a new palette's levels against a film that sounds right), measured on
# their own as tools/audio.py mixes them: a chord here sits as its chords do (its comes() at the same gain), the harp's notes as its
# marimba's. The harp (NOTE) and the effects (FX) come out of their recipes softer, so they're raised by these factors
NOTE, FX = 1.5, 1.35
def _clar(f, sec, a=0.45, r=0.8):
    """a clarinet: its odd partials strong (the first, third and fifth) and its even ones faint, a little breath, the soft start of the
    reed; no vibrato; its pitch summed in double precision; nothing above about 2.3 kHz"""
    x = tt(sec).astype(np.float64); ph = 2 * np.pi * f * x; s = np.zeros_like(x)
    for k, a_ in ((1, 1.0), (2, 0.035), (3, 0.3), (4, 0.025), (5, 0.1), (7, 0.035)):
        if k * f < 2300:
            s += a_ * np.sin(k * ph + 0.2 * k)
    br = filt(noise(sec), 'band', (f * 0.9, min(f * 3.2, 2300))) * 0.02
    ch = filt(noise(sec), 'band', (min(f * 2, 1800), 2300)) * np.exp(-tt(sec) * 40) * 0.08
    return ((s.astype(np.float32) + br + ch) * env(sec, a, r)).astype(np.float32)
def _bow(f, sec, a=1.4, r=1.6):
    """a low bowed string: its partials falling as a bowed string's do, the upper ones softer still, and the bow's faint hiss; one note,
    held, swelling in and out; nothing above about 2 kHz"""
    x = tt(sec).astype(np.float64); s = np.zeros_like(x)
    for k in range(1, 18):
        if k * f < 2000:
            s += (1 / k) * np.exp(-0.1 * k) * np.sin(2 * np.pi * f * k * x + 0.5 * k)
    bw = filt(noise(sec), 'band', (min(f * 3, 900), 1800)) * 0.012
    return ((0.6 * s.astype(np.float32) + bw) * env(sec, a, r)).astype(np.float32)
def chord(ch, start, sec, g=0.026):
    """a held chord: the bowed string on its root, the two clarinets a little apart across the stereo field, one note each (ch: the
    root's note, then the clarinets'), all in the film's scale, swelling slowly"""
    root, *up = ch; a, r = min(2.2, sec * 0.4), min(3.0, sec * 0.45)
    sw = (1 + 0.06 * np.sin(2 * np.pi * 0.06 * tt(sec))).astype(np.float32)
    put(_bow(fq(root), sec, a, r) * sw, start, g * 0.88, 0.0)
    for k, m in enumerate(up):
        put(_clar(fq(m), sec, a, r) * sw, start, g * 0.48, (-0.35, 0.35)[k % 2])
def comes(ch, t0, sec=5.5, g=0.024):
    """a chord that comes in for a moment and leaves, bloomed by t0: at a chapter's turn, under a moment on screen, or in a pause
    without words"""
    chord(ch, t0 - 1.0, sec, g)
def bed(ch, s0, s1, g=0.026):
    """the opening's chords, under the Nilometer's story only: each starts 2 s early and lasts 4 s longer, so they never drop out
    while the story is told"""
    chord(ch, s0 - 2.0, s1 - s0 + 4.0, g)
def bowed(m, start, sec, g=0.02):
    """the bowed string alone, one low note"""
    put(_bow(fq(m), sec, min(1.4, sec * 0.35), min(1.8, sec * 0.45)), start, g, 0.0)
def solo(notes, start, g=0.02, pan=-0.15):
    """one clarinet, alone: (note, seconds) one after another, each slurred into the next"""
    t0 = start
    for m, d in notes:
        put(_clar(fq(m), d + 0.25, 0.18, 0.3), t0, g, pan); t0 += d
def hp(m, start, g=0.014, pan=0.0, f=None):
    """the harp: a string plucked softly, its partials fading fast, the upper ones faster; under 2 s, so it never holds"""
    f = f or fq(m); sec = 1.9; x = tt(sec).astype(np.float64); s = np.zeros_like(x)
    for k in range(1, 9):
        if k * f < 2300:
            s += (1 / k ** 1.8) * np.exp(-x * (1.1 + 0.7 * k * k)) * np.sin(2 * np.pi * f * k * x + 0.3 * k)
    s = (s * np.minimum(1, x / 0.004) * np.clip((sec - x) / 0.35, 0, 1)).astype(np.float32)
    s += 0.05 * filt(noise(sec), 'band', (min(f * 2, 1500), 2300)) * np.exp(-tt(sec) * 70)
    put(norm(filt(s, 'low', 2300)), start, g * NOTE, pan)
D3, A3 = 50, 57
def level(start, g=0.014, pan=0.0):
    """a measure meeting its level: the harp's open fifth, D and A (pure, as the scale has it), the lower string first"""
    hp(D3, start, g, pan); hp(A3, start + 0.09, g * 0.85, pan)
def mark(start, root=65, g=0.05):
    """the series' four notes, 1-5-4-8, rising: a clarinet, with the harp an octave above it"""
    for i, iv in enumerate([0, 7, 5, 12]):
        sec = 1.1 if i < 3 else 2.6
        put(norm(_clar(fq(root + iv), sec, 0.06, min(0.45, sec * 0.4))), start + i * 0.42, g * 0.62, (i - 1.5) * 0.12)
        hp(root + iv + 12, start + i * 0.42, g * 0.45, (i - 1.5) * 0.15)

# chords: the bowed root, then the clarinets' notes. D minor and its neighbours for the river; F major, its relative, for today
RIVER = (38, 57, 64)    # D, with A and E over it: open, the river
FIELD = (41, 57, 60)    # F major: the flood's green fields
NEED = (45, 62, 64)     # A with D and E: suspended, a measure needed
NILO = (41, 60, 65)     # F, with C and F: open, the Nilometer (the chord the title comes back to)
KEEP = (36, 52, 60)     # C, with E and C: the readings, every day
SIXT = (38, 57, 66)     # D major: the sixteenth mark
BELOW = (43, 58, 62)    # G minor: below it
BBMAJ = (46, 62, 65)    # B-flat major
FMAJ = (41, 57, 60)     # F major: what the river allows
UNI = (41, 57, 67)      # F, with A and G: the university, warm
UNI4 = (46, 62, 72)     # B-flat, with D and C
QUEST = (43, 58, 69)    # G minor, with B-flat and A: an open question
FOPEN = (41, 60, 65)    # F, with C and F: open, so the mark's B-flat passes over it freely

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
def pen(s, g=0.016, pan=0.0, sec=0.6):
    """a pen signing: smoother than a pencil, in little loops"""
    x = tt(sec); X(filt(noise(sec), 'band', (420, 1700)) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 5.5 * x))) * np.sin(np.pi * x / sec) ** 0.8, s, g * FX, pan)
def marker(s, g=0.02, pan=0.0, sec=0.4):
    """a marker's stroke: broader than a pencil, and rougher, as its felt drags on the paper"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1700)) * (0.55 + 0.45 * np.sin(2 * np.pi * 15 * x)) * np.sin(np.pi * x / sec) ** 0.7, s, g * FX, pan)
def press(s, g=0.03, pan=0.0):
    """a rubber stamp: a low thud and a knock, nothing bright (the thud's own noise kept under 1.2 kHz)"""
    x = tt(0.5); X(filt((np.sin(2 * np.pi * 70 * x) * np.exp(-x * 9) + 0.2 * noise(0.5) * np.exp(-x * 30)).astype(np.float32), 'low', 1200), s, g * FX, pan)
    knock(s + 0.01, g * 0.4, pan)
def pin(s, g=0.02, pan=0.0):
    """a pin pressed into cork: a small, high knock, still under 1.4 kHz"""
    knock(s, g, pan, 330); tap(s + 0.01, g * 0.4, pan)
def air(s, sec=0.9, g=0.03, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
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
    """a breath of air that crosses the frame, as the camera or a thing travels from one side to the other"""
    x = tt(sec); _move((filt(noise(sec), 'band', (lo, hi)) * np.sin(np.pi * x / sec) ** 2).astype(np.float32), s, g, p0, p1)
def slip(s, g=0.012, pan=0.0):
    """a paper slip landing on a pile: a breath of paper and the softest pat"""
    paper(s - 0.08, g * 0.5, pan, 0.14); knock(s, g * 0.4, pan, 190)

# ---- the river's own sounds ----
def wash(s, sec, g=0.02, pan=0.0, seed=0):
    """the Nile against its banks: a low wash that swells and falls slowly, never in a beat"""
    x = tt(sec); r = np.random.default_rng(41 + seed)
    m = filt(r.standard_normal(len(x)).astype(np.float32), 'low', 0.35); m = 0.6 + 0.4 * m / (np.abs(m).max() + 1e-9)
    e = np.minimum(1, x / 1.5) * np.clip((sec - x) / 1.8, 0, 1)
    X(filt(noise(sec), 'band', (70, 520)) * m * e, s, g * FX, pan)
def trickle(s, sec, g=0.008, pan=0.0):
    """water running in a field's channel: a soft, uneven trickle"""
    x = tt(sec); r = np.random.default_rng(43)
    m = filt(r.standard_normal(len(x)).astype(np.float32), 'low', 6.0); m = 0.5 + 0.5 * np.abs(m) / (np.abs(m).max() + 1e-9)
    e = np.minimum(1, x / 0.8) * np.clip((sec - x) / 1.0, 0, 1)
    X(filt(noise(sec), 'band', (380, 1500)) * m * e, s, g * FX, pan)
def wind(s, sec, g=0.012, pan=0.0):
    """dry wind over a cracked field: low air that rises and falls"""
    x = tt(sec); r = np.random.default_rng(47)
    m = filt(r.standard_normal(len(x)).astype(np.float32), 'low', 0.5); m = 0.55 + 0.45 * m / (np.abs(m).max() + 1e-9)
    e = np.minimum(1, x / 1.2) * np.clip((sec - x) / 1.4, 0, 1)
    X(filt(noise(sec), 'band', (110, 700)) * m * e, s, g * FX, pan)
def step(s, g=0.01, pan=0.0):
    """a footstep on dry earth: a dull, low pat"""
    x = tt(0.14); X(norm(filt(noise(0.14), 'band', (90, 650)) * np.exp(-x * 34)), s, g * FX, pan)
def walk(s, sec, g=0.01, p0=0.0, p1=0.0):
    """someone walking, as gv_walk moves them: a step every half stride, while they move"""
    n = int(sec / 0.294)
    for k in range(1, n + 1):
        step(s + k * 0.294, g * (0.85 + 0.15 * (k % 2)), p0 + (p1 - p0) * k / max(1, n))
def oar(s, g=0.012, pan=0.0):
    """an oar dipped and pulled through the water: a soft, low splash"""
    x = tt(0.5); X(filt(noise(0.5), 'band', (160, 1100)) * np.exp(-x * 7) * np.minimum(1, x / 0.03), s, g * FX, pan)
def lap(s, sec=1.6, g=0.012, pan=0.0):
    """water lapping at the column, close: a few soft laps, rising"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 800)) * (0.55 + 0.45 * np.sin(2 * np.pi * 1.3 * x) ** 2) * np.sin(np.pi * x / sec), s, g * FX, pan)
def scroll(s, g=0.016, pan=0.0, sec=0.8):
    """a scroll or a folded sheet opened: dry paper, unrolling"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1900)) * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * x) ** 2) * np.sin(np.pi * x / sec), s, g * FX, pan)
def sift(s, sec=1.0, g=0.01, pan=0.0):
    """a sieve shaken: a soft, fine hush, coming and going a few times"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000)) * np.abs(np.sin(2 * np.pi * 3.0 * x)) * np.sin(np.pi * x / sec), s, g * FX, pan)


# 1. The measured river: the opening, the one chapter with chords all through. The Nile in flood: D, open, and the river's low wash; the
#    boats sail on. The flood's green fields: F major and water in a channel. The low year: the chords thin to one clarinet, alone over
#    a low bowed D, and dry wind; a knock for the tag; the tax scribe's steps on the dry earth, his scroll, a knock for "a tax set by
#    guess", and his reach for the basket. A fair tax needs a measure: suspended, as the camera crosses the river. Roda Island: F, open;
#    a knock for each tag and the harp's D for the Nilometer; air as we go down into the well, a knock for the column's tag. The keeper's
#    days: C, and a harp pluck for each reading, rising with the water, the scribe's pencil after each, a knock for "read every day".
#    The landing: paper as the sheet is handed over, a knock for its tag, oars as the boat crosses to Fustat. Sixteen cubits: D major;
#    water lapping at the column as it rises, the harp's open fifth as the mark lights gold, a knock for its "16". Due in full; below it,
#    G minor: a knock for each tag. The farmer keeps his basket: B-flat, then F major, a marker through the guess. The official opens the
#    readings: paper, a knock and a harp note for the tax known before the harvest. What a quality score should be: the university's F,
#    a knock and a rising harp note for each tag, the water settling; F, open, under the title, and the mark
S = 'river'
tFl, tLo, tMe, tNi, tKe, tSi, tBe, tBn, tSc, tBr = (C(S, k) for k in ('flood', 'low', 'measure', 'nilometer', 'keeper', 'sixteen', 'below', 'benefit', 'score', 'breath'))
pDry, pCross = W(S, 'low', 'When', -0.3), C(S, 'measure', -0.3)
bed(RIVER, S0(S), tFl - 0.3)
bed(FIELD, tFl - 0.3, pDry)
bowed(38, pDry - 0.6, pCross - pDry + 1.8, 0.016)
solo([(57, 1.5), (55, 0.7), (53, 1.5), (52, 0.7), (50, 1.4), (52, 0.6), (53, 2.2)], pDry + 0.6, 0.018)
bed(NEED, pCross + 0.3, tNi - 0.2)
bed(NILO, tNi - 0.2, tKe - 0.4)
bed(KEEP, tKe - 0.4, tSi - 0.3)
bed(SIXT, tSi - 0.3, tBe)
bed(BELOW, tBe, tBn - 0.3)
tAllows = W(S, 'benefit', 'what the river')
bed(BBMAJ, tBn - 0.3, tAllows + 0.4)
bed(FMAJ, tAllows + 0.4, tSc - 0.3)
bed(UNI, tSc - 0.3, W(S, 'score', 'those who decide'))
bed(UNI4, W(S, 'score', 'those who decide'), tBr)
chord(FOPEN, tBr - 0.6, S0('survey') - tBr + 1.4, 0.03)
# the Nile, and the fields
wash(0.0, tFl + 0.4, 0.03, 0.0)
trickle(tFl - 0.4, pDry - tFl + 1.0, 0.009, P(700))
# the low year: wind; the tag; the tax scribe walks in from the right, unrolls his scroll, and reaches for the basket
wind(pDry - 0.2, pCross - pDry + 0.6, 0.016, 0.1)
knock(W(S, 'low', 'the fields stay dry') + 0.05, 0.012, P(700))
pTax, pGuess, pEat = W(S, 'low', 'a land tax', -1.0), W(S, 'low', 'set by guess'), W(S, 'low', 'needs to eat', -0.2)
walk(pTax, 590 / 330, 0.008, P(seen(1520, 900, 1.12)), P(seen(930, 900, 1.12)))
scroll(pGuess - 0.4, 0.014, P(seen(880, 900, 1.12)), 0.9)
knock(pGuess + 0.05, 0.013, P(seen(930, 900, 1.12)), 210)
paper(pEat + 0.1, 0.01, P(seen(760, 900, 1.12)), 0.5)
# across the river, to Roda Island; its tags; down into the well, and the column's tag
glide(pCross + 0.3, 2.4, 0.012, -0.3, 0.5)
pRoda = tNi - 0.2
knock(W(S, 'nilometer', 'Roda Island') - 0.1 + 0.05, 0.012, P(1300))
pNilo = W(S, 'nilometer', 'Nilometer')
knock(pNilo + 0.05, 0.012, 0.0); hp(D3, pNilo + 0.1, 0.012, 0.0)
pWell = W(S, 'nilometer', 'a well open', -0.4)
air(pWell + 0.1, 1.6, 0.012, 0.0)
knock(W(S, 'nilometer', 'a column', 0.1) + 0.05, 0.012, P(640))
# the keeper's days: four readings, a harp note for each, rising with the water; the scribe writes each one down
pDays, pOff, pOffW = C(S, 'keeper', -0.4), W(S, 'keeper', 'and the officials', -0.2), W(S, 'keeper', 'the officials')
d0, d1 = pDays + 0.2, pOff + 0.4; dd = (d1 - d0) / 4
for i, m_ in enumerate([50, 52, 53, 55]):
    hp(m_, d0 + (i + 0.18) * dd, 0.012, P(1060))
    pencil(d0 + (i + 0.3) * dd, 0.006, P(1240), 0.35)
knock(W(S, 'keeper', 'every day') + 0.05, 0.011, P(800))
# the landing: the sheet handed over, its tag, and the boat crossing to Fustat
paper(pOff + 0.3, 0.012, P(seen(1450, 1300, 1.45)), 0.4)
knock(pOffW + 0.05, 0.011, P(1120))
paper(pOffW + 0.5, 0.008, P(seen(1550, 1300, 1.45)), 0.3)
for k in range(3):
    oar(pOffW + 1.1 + 1.05 * k, 0.012 * (1 - 0.18 * k), P(seen(1500 - 200 * k, 1300, 1.45)))
# sixteen cubits: the water rises at the column, the mark lights gold, its tag
pS16, pAt16 = C(S, 'sixteen', -0.3), W(S, 'sixteen', 'sixteen', 0.3)
lap(pS16 + 0.2, pAt16 - pS16 + 0.4, 0.01, 0.0)
level(pAt16 + 0.05, 0.016, 0.1)
knock(pAt16 + 0.15, 0.012, P(1260))
# due in full; below sixteen, not in full
pFull = W(S, 'sixteen', 'the tax', -0.3)
knock(pFull + 0.35, 0.012, 0.0); knock(tBe + 0.05, 0.011, 0.0, 190)
# the low year again: the guess struck through; the official across the river opens the readings, and knows the tax
marker(tAllows, 0.012, P(seen(930, 880, 1.14)), 0.7)
pDiwan = W(S, 'benefit', 'officials', -0.4)
scroll(pDiwan + 0.35, 0.012, P(seen(1180, 1020, 1.12)), 0.9)
pBefore = W(S, 'benefit', 'before the harvest')
knock(pBefore + 0.05, 0.012, P(1180)); hp(65, pBefore + 0.12, 0.012, P(1180))
# what a quality score should be: three tags, one by one, each with its note; the water settles; the title and the mark
for k, (wd, m_) in enumerate([('a measure', 53), ('a level', 57), ('those who decide', 60)]):
    t0 = W(S, 'score', wd); knock(t0 + 0.05, 0.011, P([700, 640, 1180][k])); hp(m_, t0 + 0.1, 0.012, P([700, 640, 1180][k]))
wash(tBr - 0.3, 3.5, 0.012, 0.0, 1)
mark(G(S, 'breath', 0.9))

# After the opening, music only from time to time: chords at a few turns, moments and pauses, and the harp's notes as things appear
# 2. A survey: the university's F at the turn, as Yusuf takes binder 9 down: the binder slid out, the page turned, a pencil under
#    "monitored"; the survey's form laid on top, a pencil tick for each owner's number and a ring round the platform's four. His board:
#    a pin for the chart, a marker for its bars, a harp note as the platform's bar lights, a pencil for the average. David at the door:
#    a knock on its frame, paper for his name card and his question. The survey can't say: a pin for the question, and like a guess at
#    the flood, the opening's lone clarinet for a moment, and its dry wind, as the field shows through; air as the chart fades to pencil.
#    Yusuf needs a measure: suspended, an open question, as he opens his notebook
S = 'survey'
comes(UNI, S0(S) + 0.6, 5.0, 0.022)
pTake = W(S, 'binder', 'binder nine', 0.2)
paper(pTake - 0.4, 0.012, P(seen(1560, 1300, 1.34)), 0.5); knock(pTake + 0.1, 0.012, P(seen(1560, 1300, 1.34)), 170)
pPage, pMon, pForm = W(S, 'binder', 'says', -0.3), W(S, 'binder', 'monitored', -0.1), W(S, 'survey', 'a survey', -0.2)
paper(pPage - 0.1, 0.014, 0.0, 0.5); pencil(pMon, 0.01, P(560), 0.7)
paper(pForm, 0.016, P(1500), 0.7)
pNums, pRing = W(S, 'spring', 'from one', -0.2), END(S, 'spring', -0.16)
for k in range(5):
    pencil(pNums + 0.24 * k, 0.006, P(1100), 0.12)
pencil(pRing, 0.009, P(1180), 0.7)
pBoard, pShort, pAvg = C(S, 'short', -0.5), W(S, 'short', 'short-course'), C(S, 'average', 0.1)
pin(pBoard + 0.15, 0.016, P(seen(290, 780, 1.06)))
for k in range(7):
    marker(pBoard + 0.4 + 0.2 * k, 0.005, P(seen(700, 780, 1.06)), 0.18)
hp(60, pShort, 0.012, P(820))
pencil(pAvg, 0.009, P(820), 1.1)
pDoor, pAsk = C(S, 'david', -0.5), W(S, 'david', 'can we', -0.1)
knock(pDoor + 0.15, 0.012, P(seen(165, 760, 1.2)), 160); knock(pDoor + 0.33, 0.009, P(seen(165, 760, 1.2)), 160)
paper(pDoor + 0.4, 0.008, P(seen(520, 760, 1.2)), 0.3); paper(pAsk, 0.01, P(seen(250, 760, 1.2)), 0.3)
pCant, pFlood, pNot = C(S, 'cant', -0.3), W(S, 'guess', 'a guess'), W(S, 'guess', 'not the data')
pin(pCant + 0.25, 0.014, P(1180))
solo([(57, 1.2), (55, 0.6), (53, 1.8)], pFlood - 0.1, 0.014)
wind(pFlood - 0.2, pNot - pFlood + 0.4, 0.011, -0.2)
air(pNot - 0.1, 1.0, 0.01, -0.2)
pNeeds = C(S, 'needs', -0.4)
comes(NEED, pNeeds + 0.8, 4.4, 0.02)
paper(pNeeds + 0.7, 0.012, P(seen(1230, 1000, 1.3)), 0.5)

# 3. What already runs: like the keeper, the opening's D for a moment, and a harp pluck as he reads the water. The data team's room at
#    night: the faintest air, the monitors' glow. Jun's screen: last night's checks run, a muffled key every few lines, quick at first and
#    slower as the count settles; a harp note for each check named (F, A, C), and a knock for each of the three marks. One line grows to
#    fill the screen: air; a knock for each empty tag, and G minor, an open question
S = 'runs'
comes(RIVER, S0(S) + 0.4, 4.0, 0.02)
hp(D3, S0(S) + 0.5, 0.012, P(1060))
pRoom = W(S, 'keeper', 'the data team', -0.2)
s_air(pRoom + 0.2, 2.2, 0.008 * FX, P(1500), 110, 600)
pRun, pRunE = W(S, 'checks', 'a hundred'), C(S, 'id', -0.3)
r0, r1 = pRun - 1.4, pRunE
for k in range(22):
    # the k-th muffled key where the count passes k/22 of 160: n = 160 (1 - (1 - u)^2.4)
    u = 1 - (1 - (k + 0.5) / 22) ** (1 / 2.4)
    tap(r0 + u * (r1 - r0), 0.006 * (1 - 0.4 * k / 22), P(900 + 30 * ((k * 7) % 5)))
for cid, m_ in (('id', 53), ('twice', 57), ('census', 60)):
    hp(m_, C(S, cid, 0.05), 0.012, P(800))
for i in range(3):
    knock(C(S, 'pass', 0.6 * i + 0.1), 0.01, P(480 + 360 * i), [250, 220, 180][i])
pBig, pOwn, pDim = C(S, 'names', -0.1), W(S, 'not', 'whose'), W(S, 'not', 'what kind')
air(pBig + 0.1, 0.9, 0.012, 0.0)
knock(pOwn + 0.05, 0.012, P(690), 200); knock(pDim + 0.05, 0.012, P(1230), 200)
comes(QUEST, pDim + 0.6, 4.6, 0.02)

# 4. An owner and a dimension: the university's F at the turn, as Yusuf asks. His notebook: paper, and a pen for each word. The rule
#    register: paper, a pen for each owner written in, and a harp note as the learning team's rows light; a harp note for each of the six
#    dimensions as it's named, rising, the sixth (no checks yet) softer; a pen for each dimension written in, a pencil for the footnote.
#    The line from the night before, its two tags filled in: a knock and a harp note each, F, then A
S = 'owner'
comes(UNI, S0(S) + 0.8, 4.6, 0.022)
pNb, pW1 = C(S, 'two', 0.5), W(S, 'two', 'two things')
paper(pNb - 0.1, 0.012, 0.0, 0.5)
pen(pW1 - 0.2, 0.012, P(500), 0.6); pen(pW1 + 0.4, 0.012, P(560), 0.8)
pReg, pLearn = C(S, 'owner', -0.3), W(S, 'learning', 'learning team')
paper(pReg - 0.05, 0.014, 0.0, 0.5)
for i in range(6):
    pen(pLearn - 1.4 + i * 0.32 if i < 4 else pLearn + 0.7 if i == 4 else pLearn + 1.3, 0.006, P(1030), 0.5)
hp(60, pLearn - 0.15, 0.011, P(800))
six = [W(S, 'six', w) for w in ('completeness', 'uniqueness', 'validity', 'consistency', 'accuracy', 'timeliness')]
for i, t0 in enumerate(six):
    hp([53, 55, 57, 60, 62, 65][i], t0 - 0.1, 0.011 * (0.65 if i == 5 else 1), P(330 + 230 * i))
pE1, pE2, pEndE = W(S, 'empty', 'completeness'), W(S, 'empty', 'uniqueness'), END(S, 'empty')
for t0 in sorted([pE1, pE2, pEndE + 0.1, pE1 + 0.3, pEndE + 0.5, pEndE + 0.9]):
    pen(t0, 0.006, P(1250), 0.45)
pencil(W(S, 'jun', 'beside'), 0.007, P(700), 1.2)
pTags = END(S, 'jun', -0.2)
knock(pTags + 0.35, 0.012, P(690)); hp(53, pTags + 0.4, 0.012, P(690))
knock(pTags + 0.85, 0.012, P(1230)); hp(57, pTags + 0.9, 0.012, P(1230))

# 5. The scorecard: it writes itself, and the university's F, warm, under it as a moment on screen: the faintest patter as its cells
#    fill, a harp note as the rows, the columns and one cell light. What didn't pass comes in under it: paper; a knock for whose it is.
#    David's question: paper. Planning's row: the harp's open fifth as its check, matched to the census report, lights green, paper for
#    its card. Clara's room: a soft knock as she nods, and the fifth again, for "it passed"
S = 'scorecard'
pScr, pFill = L(S, 0.9), L(S, 1.4)
comes(UNI, pFill + 0.8, 5.6, 0.022)
for k in range(24):
    tap(pFill + 3.4 * (k + 0.5) / 24 + 0.03 * ((k * 5) % 3), 0.004, P(500 + (k * 137) % 900))
for wd, m_ in (('area', 53), ('dimension', 57), ('in each cell', 60)):
    hp(m_, W(S, 'row', wd), 0.011, 0.0)
pUnder, pWhose = C(S, 'under', -0.3), W(S, 'under', 'whose')
air(pUnder + 0.2, 1.0, 0.01, 0.0); knock(pWhose + 0.05, 0.011, P(seen(560, 960, 1.5)))
pDoor = C(S, 'answer', -0.3)
paper(pDoor + 0.2, 0.01, P(seen(250, 760, 1.2)), 0.3)
pAcc = W(S, 'census', 'census')
level(pAcc - 0.15, 0.014, P(seen(1240, 960, 1.5)))
paper(pAcc + 0.05, 0.01, P(seen(1240, 960, 1.5)), 0.35)
pNod, pTick = W(S, 'passed', 'it passed'), END(S, 'passed', 0.1)
knock(pNod + 0.1, 0.008, P(1400), 180); level(pTick, 0.012, P(1400))

# 6. Whose level? The column again, for a moment: D major, and the harp's fifth as the water reaches its sixteenth mark, a knock for its
#    "16". Tom's card: paper. Tom at his desk: paper for his name card and his words. His card again: a pen for the reason, keys for the
#    level typed in, a knock for each of the night's three answers, and a muffled key as the marker runs to six. Planning's room: paper
#    for Clara's name card and her words. Her card: a knock for each answer. The owners sign: the university's F, warm, under it; a pen
#    for each signature and a stamp for each card. Jun's screen: a harp note as each rule's line lights. The board: a pin for the card
#    with nobody beside it, slips landing against it, a marker through it, "off", and the bowed string's low D as it goes grey
S = 'level'
pAt16 = W(S, 'cubits', 'sixteen cubits')
comes(SIXT, pAt16 + 0.2, 4.0, 0.02)
lap(L(S, 0.3), pAt16 - L(S, 0.3) + 0.3, 0.009, 0.0)
level(pAt16 + 0.05, 0.015, 0.1); knock(pAt16 + 0.15, 0.012, P(1260))
pCard = C(S, 'who', -0.3)
paper(pCard + 0.05, 0.014, P(800), 0.6)
pDesk, pWalk = C(S, 'email', -0.3), W(S, 'email', 'one or two')
paper(pDesk + 0.4, 0.008, P(seen(1680, 1000, 1.08)), 0.3); paper(pWalk - 0.1, 0.01, P(seen(560, 1000, 1.08)), 0.3)
pChose, pWarn, pStop, pFive = C(S, 'chose', -0.3), W(S, 'chose', 'warn on any'), W(S, 'chose', 'stop'), W(S, 'chose', 'above five')
pen(pChose + 0.1, 0.008, P(900), 0.9)
typing(pWarn - 0.1, pFive + 0.4 - pWarn, 0.006, P(900))
knock(pWarn + 0.05, 0.011, P(1600), 250); knock(pWarn + 0.2, 0.011, P(1600), 220); knock(pStop + 0.05, 0.012, P(1600), 180)
for k in range(1, 7):
    tap(pWarn + (pFive - pWarn) * k / 6, 0.005, P(1420))
pPlan, pAny, pGov = C(S, 'planning', -0.3), C(S, 'any'), W(S, 'any', 'because')
paper(pPlan + 0.5, 0.008, P(seen(1640, 1250, 1.35)), 0.3); paper(pAny, 0.01, P(seen(1440, 1250, 1.35)), 0.3)
pPcard = pGov - 0.4
knock(pPcard + 0.35, 0.011, P(1600), 250); knock(pPcard + 0.5, 0.012, P(1600), 180)
pSigns, pCsign = C(S, 'signs'), W(S, 'signs', 'with its level')
comes(UNI, pSigns + 0.3, 5.0, 0.022)
pen(pSigns - 0.15, 0.012, P(700), 0.65); press(pSigns + 0.6, 0.032, P(1100))
TS = pCsign + 0.3
paper(TS + 0.1, 0.012, P(1100), 0.5)
pen(TS + 0.6, 0.012, P(700), 0.6); press(TS + 1.25, 0.032, P(1100))
pPage = W(S, 'signs', 'into the check', -0.1)
hp(57, pPage + 0.45, 0.011, P(800)); hp(60, pPage + 0.75, 0.011, P(800))
pLone, pOff = C(S, 'ignored', -0.3), W(S, 'ignored', 'switched off')
pin(pLone + 0.2, 0.014, P(1250))
for k in range(5):
    slip(pLone + 0.9 + 0.35 * k, 0.01, P(1500))
marker(pOff + 0.3, 0.012, P(1050), 0.5); pencil(pOff + 0.75, 0.008, P(1370), 0.4)
bowed(38, pOff + 0.5, 3.2, 0.014)

# 7. Tom reads his row: the office door, a soft knock as Tom comes in. The scorecard: a harp note, low, as the amber cell he knows
#    lights; paper as the enrolment comes out of its cell, a knock and a harp note left open for its certificate; the same low note for
#    the one he's never seen, and a knock for each of its lines. The board: keys for the email as it was typed, the sieve, and a harp
#    note as it comes out clean, a knock for its tag. The slips nobody read, landing one on another, and a knock for the team's own. The
#    office again: the university's F, warm, as Tom looks up: now it's his team's
S = 'row'
knock(L(S, 0.6), 0.01, P(300), 170)
pKnows, pWalkin, pCert, pNever, pTyped = (W(S, 'knows', 'he knows'), W(S, 'knows', 'a walk-in'), W(S, 'knows', 'certificate'),
                                          W(S, 'never', 'never seen'), W(S, 'never', 'emails typed'))
hp(52, pKnows, 0.011, P(410))
paper(pWalkin - 0.25, 0.012, P(500), 0.5)
knock(pCert + 0.1, 0.01, P(890), 230); hp(59, pCert + 0.2, 0.009, P(890))
hp(52, pNever + 0.05, 0.011, P(930))
for k in (1, 2):
    knock(pTyped + 0.25 * k + 0.05, 0.008, P(400), 210)
pSpaces, pClean, pCl, pBroke = W(S, 'never', 'spaces'), C(S, 'cleans', -0.3), W(S, 'cleans', 'cleans them'), W(S, 'cleans', 'nothing broke')
typing(pSpaces - 0.2, 1.0, 0.006, 0.0)
sift(pClean + 0.1, 1.2, 0.01, 0.0)
hp(57, pCl + 0.65, 0.011, 0.0); knock(pBroke + 0.05, 0.011, 0.0)
pNobody, pNow = C(S, 'nobody', -0.3), C(S, 'now')
for k in range(9):
    slip(pNobody + 0.15 + 1.6 * (k + 0.5) / 9, 0.008 * (0.8 + 0.2 * (k % 2)), P(960 + 20 * ((k * 3) % 4 - 1.5)))
knock(pNow + 0.1, 0.012, 0.0, 230)
comes(UNI, END(S, 'now', 0.5), 4.6, 0.022)

# 8. A check, or a list? Tom's list: a harp note as its one row lights. Two cards on his desk: paper for each; the list lit, A and C.
#    The list again: keys as Tom types a note on the row
S = 'list'
hp(60, L(S, 0.8), 0.011, P(500))
pCards, pPpl, pData, pList, pWorks = (C(S, 'people', -0.3), W(S, 'people', 'what people do'), W(S, 'people', 'not the data'),
                                      W(S, 'people', 'a list'), W(S, 'people', 'works through'))
paper(pData - 0.2, 0.012, P(560), 0.5); paper(pPpl - 0.2, 0.012, P(1360), 0.5)
hp(57, pList + 0.05, 0.011, P(1360)); hp(60, pList + 0.2, 0.01, P(1360))
typing(pWorks, 1.4, 0.006, P(600))

# 9. One red night: the data team's room at night, the faintest air. A muffled key for each walk-in as the count rises to six, a knock
#    for "over 5", and as the check fails, its line grows: air, and a low knock. The board: a stamp for each report held, Planning's
#    second. The morning: the scorecard's one red cell, and one low note on the bowed string, alone. The issue log: a pen as the failure
#    is written in, a knock for its date. Tom: paper for his words. His card: paper. The list: a key for each of the six rows. By noon:
#    a pen for each email written in, a knock for each tick, the clock. That night: the cell washes back to green, the harp's open fifth
#    and the university's F; the issue log: a stamp, closed
S = 'night'
s_air(L(S, 0.5), 2.0, 0.008 * FX, 0.2, 110, 600)
pMore, pNoE, pOver, pBig = W(S, 'five', 'five more'), W(S, 'five', 'with no email'), W(S, 'six', 'over'), W(S, 'six', 'the check fails')
cnt0, cnt1 = pMore, max(pMore + 0.8, pNoE + 0.6)
for k in range(1, 6):
    tap(cnt0 + (cnt1 - cnt0) * k / 5 - 0.05, 0.008, P(1400))
knock(pOver + 0.1, 0.012, P(1400), 200)
air(pBig + 0.3, 1.0, 0.012, 0.0); knock(pBig + 0.5, 0.012, 0.0, 140)
pStop, pPlanH = W(S, 'stops', 'stops'), W(S, 'stops', "Planning's")
for t0, x in ((pStop, 610), (pStop + 0.45, 610), (pStop + 0.9, 1300), (pPlanH, 1300)):
    press(t0 + 0.05, 0.026, P(x))
pMorn, pRed, pLog, pDate = C(S, 'morning', -0.4), W(S, 'morning', 'one red cell'), W(S, 'morning', 'an issue', -0.3), W(S, 'morning', 'with a date')
bowed(38, pRed - 0.3, 3.4, 0.02)
pen(pLog + 0.3, 0.01, P(700), 1.3); knock(pDate + 0.05, 0.01, P(560))
pTom = C(S, 'tom', -0.3)
paper(pTom + 0.4, 0.01, P(seen(700, 900, 1.08)), 0.3)
paper(C(S, 'chose', -0.2), 0.012, P(900), 0.5)
pList = C(S, 'list', -0.3)
for i in range(1, 6):
    tap(pList + 0.4 + 0.22 * i, 0.007, P(960))
pNoon, pReg = C(S, 'noon', -0.4), W(S, 'noon', 'registered')
paper(pNoon + 0.1, 0.01, 0.0, 0.5); knock(pNoon + 0.3, 0.008, P(1800), 300)
for i in range(6):
    t0 = pReg + 0.1 + 0.42 * i
    pen(t0, 0.005, P(560 if i < 3 else 1360), 0.5); knock(t0 + 0.42, 0.007, P(860 if i < 3 else 1660), 260)
pGreen, pGr = C(S, 'green', -0.4), W(S, 'green', 'green')
level(pGr + 0.1, 0.014, P(seen(510, 960, 1.5)))
comes(UNI, pGr + 0.4, 5.0, 0.022)
pClose = END(S, 'green', 0.4)
press(pClose + 0.45, 0.026, P(900))

# 10. Measured, not surveyed: binder 9's line runs now, the university's F under it at the turn: a marker along the line, a pencil for
#     each note written beside it. A rule without an owner: paper, a red pencil for "needs an owner", and a duller stamp, sent back;
#     the same card again, paper, a pen and a stamp. Yusuf's board: like the Nilometer, the opening's D, and the harp's open fifth as
#     the column shows with its gold mark; air as the chart fades to pencil. A harp note for what it can trust, a low one for what's held
#     back, a knock for who fixes it. His shelf: binder 15 slid out. The lesson, and in the wordless ending F, open, and the mark
S = 'measured'
pRuns = W(S, 'runs', 'runs now')
comes(UNI, pRuns + 0.6, 4.4, 0.022)
marker(pRuns, 0.012, P(700), 1.2)
for wd, off, sec in (('every rule', 0, 1.3), ('a level', 0, 1.2), ('a scorecard', 0, 1.3), ('what ran', -0.2, 1.3)):
    pencil(W(S, 'runs', wd, off), 0.008, P(560), sec)
pBack, pOwn, pSent = C(S, 'back', -0.4), W(S, 'back', 'an owner'), W(S, 'back', 'sent back')
paper(pBack + 0.1, 0.012, P(900), 0.6)
pencil(pOwn + 0.2, 0.008, P(560), 0.8); press(pSent + 0.05, 0.026, P(1100))
pSwap = END(S, 'back', 0.25)
paper(pSwap, 0.012, P(1100), 0.5); pen(pSwap + 0.35, 0.012, P(700), 0.45); press(pSwap + 0.9, 0.03, P(1100))
pNilo, pGuessW = W(S, 'like', 'the Nilometer'), W(S, 'like', 'not a guess')
comes(RIVER, pNilo + 0.5, 4.2, 0.02)
level(pNilo + 0.1, 0.014, P(seen(760, 950, 1.15)))
air(pGuessW, 1.0, 0.01, P(seen(400, 950, 1.15)))
pTrust, pHeld, pFix = W(S, 'knows', 'which data'), W(S, 'knows', "what's held back"), W(S, 'knows', 'who fixes it')
hp(65, pTrust + 0.05, 0.011, P(1243)); hp(45, pHeld + 0.05, 0.011, P(960)); knock(pFix + 0.05, 0.012, P(1000), 230)
pFilm = W(S, 'next', 'the next film')
paper(pFilm - 0.25, 0.012, P(seen(1720, 1500, 1.3)), 0.5); knock(pFilm + 0.3, 0.012, P(seen(1720, 1500, 1.3)), 170)
pEnd = C(S, 'lesson', -0.3)
chord(FOPEN, pEnd - 0.6, TOT - pEnd + 1.0, 0.03)
mark(pEnd + 2.6)
