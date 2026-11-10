# The same problem, everywhere: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (PLAYBOOK.md: vary the sound itself, film to film; the series' brass and music box, recorders and
# marimba, piano, strings, clarinet and glockenspiel, glass harmonica and handbells, guitar, electric piano and flute, and double reeds
# are left to the films that have them): a chamber organ and timpani, both made here (music.py has neither).
#  - A small chamber organ holds the chords: one stopped wooden pipe to a note, round and hollow (its notes are mostly odd harmonics),
#    in a box whose shutters open and close, its swell, so a chord comes in from nothing and goes back to it. A pipe speaks with a breath
#    of wind and then holds its note dead steady: no tremulant, nothing that trembles. Each chord is tuned pure over F, the film's home.
#  - Timpani, struck softly with felt, mark the eras: one stroke as each year appears in the corner, on a note of the chord around it.
#  - The series' mark, 1-5-4-8, plays on the organ's open flute, with a timpani stroke under its first and last notes, at the title and
#    at the end.
# D minor for the bank in 2008 and the crisis after it; F major for the title, for 1980, the body of knowledge and the university today;
# each era its own chord at its turn: G minor for 2002, B flat for 2009, D minor again for 2013, C for 2017, E flat for 2024.
# The series' sound since the author's review of the master data films (20 October 2026; PLAYBOOK.md §5): music plays under the opening
# story, the bank that can't add up its risks, until the title; after that, only now and then: at a chapter's turn, swelling in the pause
# between two chapters and let go as the new chapter's voice begins, under a few moments on screen (the flyers going up, two binders
# swapped, the book set on its shelf, the wheel's centre lit, the two green towers, "should we?", the draft still being written, the
# wheel again), and from the film's last line to the end card. Never a bed under the voice, nothing that trembles or pulses, and no
# urgent pulse: this film's turns are questions, not a rush.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is sustained chords that come and go with the narration; nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed. Things that drop
#    into place land a little after they start to move, so their sound comes then.
# And everything stays low and soft: paper, pencils, pens and markers, cork pins, books set on wood, a rubber stamp, footsteps, all
# filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads
import itertools, json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan
lerp = lambda a, b, u: a + (b - a) * u

# ---- the organ ----
# the music's level against the voice: the organ's chords as loud as Off the shelf's horns
ORG = 2.6
# the tuning: every note pure over F, the film's home. In equal temperament a held major third beats several times a second, a tremble
# that a phone's speaker brings out, so each pitch takes a just ratio over F. G, B, D and E flat can each take either of two (D is 5/3 over
# F, a fourth over A, but 27/16 a fifth over G at 9/8), and each chord takes, of its new notes' ratios, the set whose partials beat least
# with the notes it keeps; a note held into the next chord keeps its tuning
RATIO = {0: (1,), 2: (9 / 8, 10 / 9), 4: (5 / 4,), 5: (4 / 3,), 6: (45 / 32, 25 / 18), 7: (3 / 2,), 9: (5 / 3, 27 / 16), 10: (16 / 9, 9 / 5), 11: (15 / 8,)}
def hz(m, r=None):
    """a note's frequency, tuned over F: r is the ratio its pitch takes, by default the first (and equal temperament for a pitch the
    film doesn't play)"""
    pc = (m - 65) % 12
    return mf(65) * (r or RATIO.get(pc, (2 ** (pc / 12),))[0]) * 2 ** ((m - 65) // 12)
# the organ's two stops, each harmonic's strength: a stopped wooden pipe (8'), round and hollow, mostly odd harmonics; and an open flute
# (4'), a little brighter, for the series' mark
GEDACKT = ((1, 1.0), (2, 0.025), (3, 0.16), (4, 0.012), (5, 0.05), (6, 0.006), (7, 0.018), (9, 0.006))
FLUTE = ((1, 1.0), (2, 0.3), (3, 0.12), (4, 0.055), (5, 0.03), (6, 0.012))
def rough(fs):
    """how much held pipes at these frequencies beat against each other: each pair of partials a few hertz apart counts, most at six
    beats a second, by the softer of the two"""
    ps = [(h * f, a) for f in fs for h, a in GEDACKT if h * f < 2000]; d = 0.0
    for i, (f1, a1) in enumerate(ps):
        for f2, a2 in ps[i + 1:]:
            df = abs(f2 - f1)
            if 0.01 < df < 40:
                d += min(a1, a2) * df / 6 * np.exp(1 - df / 6)
    return d
def pipe(f0, sec, seed, stop=GEDACKT, off=None, wind=1.0):
    """one pipe sounding f0 Hz for sec seconds, its key let go at off (if given): it speaks with a breath of wind, its upper harmonics a
    moment before the note settles (low pipes speak more slowly), then holds dead steady; let go, it stops, and the room rings on"""
    R = np.random.default_rng(seed); x = tt(sec).astype(np.float64); n = len(x)
    sp = 0.025 + 0.045 * min(1.6, (220 / f0) ** 0.5)
    s = np.zeros_like(x)
    for h, a in stop:
        F = h * f0
        if F > 2300:
            break
        on = 1 - np.exp(-x / (sp if h == 1 else sp * 0.55))
        chiff = {2: 0.1, 3: 0.22, 4: 0.05, 5: 0.06}.get(h, 0.0) * np.exp(-x / 0.045) * (1 - np.exp(-x / 0.004))
        s += np.sin(2 * np.pi * F * x + R.uniform(0, 6.3)) * (a * on + chiff)
    s += wind * (filt(noise(sec), 'band', (min(1700.0, f0 * 2), min(2200.0, f0 * 7 + 400)))[:n] * 0.05 * np.exp(-x / 0.035)
                 + filt(noise(sec), 'band', (300, 1400))[:n] * 0.004)
    if off is not None:
        s *= np.where(x < off, 1.0, np.exp(-np.maximum(0.0, x - off) / 0.24))
    return s
_BED = []
def bed(keys, end, g=0.03, a=1.2, rel=2.8):
    """chords, each from its moment, until end, on the organ with its box's shutters opening over a seconds before the first and
    closing over rel seconds from end: kept, so play_bed() plays them all at once"""
    _BED.append((sorted(keys), end, g, a, rel))
def play_bed():
    """each bed's chords on the organ: a note the next chord keeps is held through the change, the others are let go just after it,
    and the new ones speak at it, so a step of a semitone never sounds both notes at once. Each chord is tuned pure (rough()), around
    the notes it keeps from the chord before; low notes to the left and high to the right, as the pipes stand"""
    for keys, end, g, a, rel in _BED:
        t_open = keys[0][0] - 0.6
        swell = lambda t: (np.clip((t - t_open) / a, 0, 1) ** 1.5 * np.clip((end + rel - t) / rel, 0, 1)).astype(np.float32)
        ch = [(t, sorted(set(c))) for t, c in keys]; F = []
        for i, (t0, c) in enumerate(ch):
            prev = ch[i - 1][1] if i else []
            keep = {m: F[i - 1][m] for m in c if m in prev}; new = [m for m in c if m not in prev]
            rs = min(itertools.product(*[RATIO.get((m - 65) % 12, (None,)) for m in new]),
                     key=lambda rs: rough(list(keep.values()) + [hz(m, r) for m, r in zip(new, rs)]))
            F.append({**keep, **{m: hz(m, r) for m, r in zip(new, rs)}})
            for m in new:
                j = i
                while j + 1 < len(ch) and m in ch[j + 1][1]:
                    j += 1
                s = t_open if i == 0 else t0 - 0.03
                e = ch[j + 1][0] + 0.02 if j + 1 < len(ch) else end + rel
                sig = pipe(F[i][m], e - s + 1.6, m * 31 + int(s * 7), GEDACKT, off=e - s)
                sig = filt((sig * swell(s + tt(e - s + 1.6))).astype(np.float32), 'low', 2000)
                put(sig, s, g * ORG / len(c), max(-0.5, min(0.5, (m - 52) / 26)))
def flute(m, start, sec, g=0.05, pan=0.0):
    """one note on the organ's open flute, let go after sec seconds, the room ringing on"""
    sig = pipe(hz(m), sec + 1.2, m * 13 + int(start * 7), FLUTE, off=sec, wind=0.7)
    put(norm(filt(sig.astype(np.float32), 'low', 2200)), start, g, pan)

# ---- the timpani ----
def timp(m, start, g=0.07, pan=0.0, sec=4.5):
    """a timpani stroke, soft, with a felt mallet: the head's modes, tuned close to the harmonics of its note (1, 1.5, 2, 2.5, 3), the
    lowest ringing longest and its pitch settling a hair as it starts; a soft thump that's gone at once, and the felt; nothing bright"""
    f = hz(m); x = tt(sec).astype(np.float64); R = np.random.default_rng(int(start * 10) + m)
    ph = 2 * np.pi * np.cumsum(1 + 0.004 * np.exp(-x / 0.08)) / SR; s = np.zeros_like(x)
    for r, a, d in ((1.0, 1.0, 0.9), (1.5, 0.45, 0.55), (2.0, 0.3, 0.4), (2.5, 0.12, 0.28), (3.0, 0.06, 0.2)):
        s += a * np.sin(f * r * ph + R.uniform(0, 6.3)) * np.exp(-x / d)
    s += 0.5 * np.sin(2 * np.pi * f * 0.64 * x) * np.exp(-x / 0.06) + 0.3 * filt(noise(sec), 'low', 500)[:len(x)] * np.exp(-x / 0.007)
    s *= np.minimum(1, x / 0.006) * np.clip((sec - x) / 0.5, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 1500)), start, g, pan)
def mark(start, g=0.06):
    """the series' four notes, 1-5-4-8, on the organ's flute, in F, a timpani stroke under the first and the last"""
    for i, iv in enumerate([0, 7, 5, 12]):
        flute(65 + iv, start + i * 0.45, 0.42 if i < 3 else 2.6, g * (0.85 if i < 3 else 1.0), (i - 1.5) * 0.12)
    timp(53, start, g * 1.1); timp(53, start + 1.35, g)

# ---- soft sounds, all low-passed ----
def _X(sig, s, g, pan):
    """an effect, kept under about 2.3 kHz"""
    X(filt(np.asarray(sig, np.float32), 'low', 2300, 4), s, g, pan)
def _strokes(sec, seed, lo=0.08, hi=0.22):
    """a hand writing or drawing: strokes of uneven length and weight, with small lifts between them"""
    R = np.random.default_rng(seed); n = int(sec * SR); e = np.zeros(n, np.float32); t = 0.0
    while t < sec:
        d = R.uniform(lo, hi); i, j = int(t * SR), min(n, int((t + d) * SR))
        if j > i:
            e[i:j] = R.uniform(0.55, 1.0) * np.sin(np.pi * np.linspace(0, 1, j - i)) ** 0.5
        t += d + R.uniform(0.015, 0.05)
    return e
def knock(s, g=0.026, pan=0.0, f=240):
    """a soft wooden knock: a card or a speech bubble arriving"""
    s_knock(s, g, pan, f)
def tap(s, g=0.016, pan=0.0):
    """a muffled tap"""
    s_tap(s, g, pan)
def paper(s, g=0.03, pan=0.0, sec=0.45):
    """paper, softly: a sheet laid down or passed"""
    x = tt(sec); _X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def page(s, g=0.032, pan=0.0, sec=0.7):
    """a page turned over: paper sweeping through the air, and laid down"""
    x = tt(sec); _X(filt(noise(sec), 'band', (220, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g, pan)
    s_knock(s + sec * 0.85, g * 0.3, pan, 160)
def flick(s, g=0.026, pan=0.0):
    """a desk calendar's page flicked over: a short, dry flick"""
    x = tt(0.2); _X(filt(noise(0.2), 'band', (300, 1900))[:len(x)] * np.exp(-x * 22) * np.minimum(1, x / 0.01), s, g, pan)
    s_tap(s + 0.12, g * 0.4, pan)
def pin(s, g=0.03, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g, pan, 360); s_tap(s + 0.004, g * 0.5, pan)
def pencil(s, sec, g=0.016, pan=0.0, seed=1):
    """a pencil writing or drawing: a soft, grainy scratch that comes and goes with the strokes"""
    x = tt(sec); _X(filt(noise(sec), 'band', (500, 2200))[:len(x)] * _strokes(sec, seed)[:len(x)] * np.clip((sec - x) / 0.05, 0, 1), s, g, pan)
def pen(s, sec, g=0.016, pan=0.0, seed=2):
    """a ballpoint writing: lower and smoother than the pencil"""
    x = tt(sec); _X(filt(noise(sec), 'band', (350, 1700))[:len(x)] * _strokes(sec, seed, 0.1, 0.25)[:len(x)] * np.clip((sec - x) / 0.05, 0, 1), s, g, pan)
def sign(s, sec, g=0.02, pan=0.0, seed=3):
    """a signature: a pen's quick loops, and the last stroke drawn out"""
    pen(s, sec * 0.8, g, pan, seed); pen(s + sec * 0.8, sec * 0.2 + 0.05, g * 0.8, pan, seed + 50)
def marker(s, sec, g=0.018, pan=0.0, seed=4):
    """a felt marker on a whiteboard: low and soft, never a squeak"""
    x = tt(sec); _X(filt(noise(sec), 'band', (250, 1300))[:len(x)] * _strokes(sec, seed, 0.12, 0.3)[:len(x)] * np.clip((sec - x) / 0.05, 0, 1), s, g, pan)
def highlight(s, sec, g=0.018, pan=0.0):
    """a highlighter drawn along a line: one long, soft felt-tip rub"""
    x = tt(sec); _X(filt(noise(sec), 'band', (300, 1400))[:len(x)] * np.sin(np.pi * x / sec) ** 0.7, s, g, pan)
def book(s, g=0.04, pan=0.0, f=95):
    """a book set down on wood: the dull thump of its weight, the board's short knock, and its pages settling (f: lower for a bigger
    board)"""
    x = tt(0.4); th = np.sin(2 * np.pi * f * x) * np.exp(-x * 30) + 0.5 * np.sin(2 * np.pi * f * 1.9 * x) * np.exp(-x * 45)
    X(norm(filt(th.astype(np.float32), 'low', 900)), s, g, pan); s_knock(s + 0.004, g * 0.45, pan, 210)
    _X(filt(noise(0.4), 'band', (300, 1600))[:len(x)] * np.exp(-x * 25) * np.minimum(1, x / 0.01), s + 0.01, g * 0.25, pan)
def cover(s, g=0.028, pan=0.0, sec=0.5):
    """a hard cover swung over: the air it pushes, then a soft clap as it meets the pages"""
    x = tt(sec); _X(filt(noise(sec), 'band', (150, 900))[:len(x)] * np.sin(np.pi * np.clip(x / (sec * 0.85), 0, 1)) ** 2, s, g * 0.6, pan)
    s_knock(s + sec * 0.85, g * 0.7, pan, 180); paper(s + sec * 0.85, g * 0.3, pan, 0.15)
def rubber(s, g=0.045, pan=0.0):
    """a rubber stamp on paper: a padded thump, and the paper under it"""
    x = tt(0.25); X(norm((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 22) + 0.5 * filt(noise(0.25), 'band', (200, 1200))[:len(x)] * np.exp(-x * 45)).astype(np.float32)), s, g, pan)
def step(s, g=0.02, pan=0.0):
    """a footstep on a hard floor beyond a door: the heel, then the sole, low and muffled"""
    x = tt(0.25); h = np.sin(2 * np.pi * 70 * x) * np.exp(-x * 40) + 0.6 * filt(noise(0.25), 'band', (120, 700))[:len(x)] * np.exp(-x * 60)
    X(norm(filt(h.astype(np.float32), 'low', 900)), s, g, pan)
    x2 = tt(0.12); X(norm(filt(noise(0.12), 'band', (150, 800)) * np.exp(-x2 * 50)), s + 0.09, g * 0.45, pan)
def softstep(s, g=0.01, pan=0.0):
    """a footstep on carpet: hardly more than a thud"""
    x = tt(0.2); X(norm(filt((np.sin(2 * np.pi * 85 * x) * np.exp(-x * 35) + 0.5 * filt(noise(0.2), 'band', (150, 500))[:len(x)] * np.exp(-x * 40)).astype(np.float32), 'low', 600)), s, g, pan)
def clunk(s, g=0.03, pan=0.0):
    """a bank of lights switched off: a low, muffled clunk"""
    x = tt(0.2); c = np.sin(2 * np.pi * 120 * x) * np.exp(-x * 45) + 0.4 * np.sin(2 * np.pi * 310 * x) * np.exp(-x * 70)
    X(norm(filt(c.astype(np.float32), 'low', 1000)), s, g, pan)
def photo(s, g=0.02, pan=0.0):
    """a photo laid on the pile: a small, stiff slap of card"""
    x = tt(0.12); _X(filt(noise(0.12), 'band', (300, 1800))[:len(x)] * np.exp(-x * 45) * np.minimum(1, x / 0.004), s, g, pan)
    s_knock(s, g * 0.3, pan, 300)
def box(s, g=0.026, pan=0.0, sec=0.6):
    """a cardboard box lifted off a table: a dry scrape as it leaves, and the air under it"""
    x = tt(sec); _X(filt(noise(sec), 'band', (180, 1200))[:len(x)] * np.exp(-x * 9) * np.minimum(1, x / 0.02), s, g, pan)
    s_knock(s, g * 0.4, pan, 150)
def sticky(s, g=0.02, pan=0.0):
    """a sticky note pressed on: a light tap, and a thumb smoothing it"""
    s_tap(s, g * 0.7, pan); paper(s + 0.05, g * 0.6, pan, 0.18)
def tag(s, g=0.02, pan=0.0):
    """a paper tag dropping onto its string: a light tick as the string takes it, and a small swing"""
    s_tap(s, g * 0.8, pan); s_air(s + 0.03, 0.5, g * 0.5, pan, 200, 900)
def settle(s, g=0.026, pan=0.0):
    """the wheel drawing true: a soft wooden settle"""
    s_air(s - 0.12, 0.5, g * 0.4, pan, 150, 700); s_knock(s, g, pan, 200); s_knock(s + 0.07, g * 0.5, pan, 150)
def slide(s, g=0.022, pan=0.0, sec=0.42):
    """a book drawn along a wooden shelf: a low, rough slide"""
    x = tt(sec); _X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5 * (1 + 0.4 * np.sin(2 * np.pi * 31 * x)), s, g, pan)
def air(s, sec=0.9, g=0.016, pan=0.0):
    """a breath of air: a binder swung across, a wheel turning"""
    s_air(s, sec, g, pan)

# chords (MIDI note numbers), low to high: D minor for the bank and the crisis; F major for the body of knowledge and today. No two notes
# a semitone apart, where they would rub
DM = [38, 45, 50, 53, 57]; DM9 = [38, 45, 53, 60, 64]; GM = [43, 50, 55, 58, 62]; GM7 = [43, 50, 53, 58]
BBMAJ9 = [46, 53, 57, 60, 62]; A7SUS = [45, 52, 55, 62]; CSUS = [36, 43, 48, 53, 55]; EBMAJ9 = [39, 46, 53, 55, 62]
FMAJ = [41, 48, 53, 57, 60]; FMAJ9 = [41, 48, 52, 55, 57]
# under the mark, F in open fifths with the D above: the mark's F, C, B flat and F, on the flute, never a semitone from a note held
# under them, as they would be from an A or an E
FOPEN = [41, 48, 53, 60, 62]

# the voice's lines, chapter by chapter: when each starts and ends
_V = {s: [(G(s, v['id']), G(s, v['id']) + _DUR[s + '/' + v['id']]) for v in _NARR[s]['vo']] for s in _NARR}
_ORDER = list(_NARR)
def first(J):
    """when a chapter's voice begins"""
    return _V[J][0][0]
def last(J):
    """when a chapter's voice ends"""
    return _V[J][-1][1]
def turn(J, keys=(), g=0.03):
    """a chapter's turn: its chord comes in as the chapter before falls silent, swells in the pause between them, and is let go as the
    new chapter's voice begins, so the voice goes on alone. keys: a moment just before, whose chords lead into it"""
    bed(list(keys) + [(last(_ORDER[_ORDER.index(J) - 1]) + 0.9, TURN[J])], first(J), g)
def moment(t0, t1, chord, g=0.026, rel=2.4):
    """a chord under a moment on screen: it comes in at t0 and is let go at t1"""
    bed([(t0, chord)], t1, g, 1.0, rel)
def year(J, m, off=0.4, g=0.07):
    """a timpani stroke as the year appears in the corner"""
    timp(m, S0(J) + off, g)
# each era's chord at its turn
TURN = {'signs': GM7, 'written': BBMAJ9, 'first': DM9, 'should': CSUS, 'machines': EBMAJ9, 'centre': FMAJ}

# 1. One question: the opening, with the organ all through it, in D minor: the board's question, the answer nowhere, the calendar to
#    Monday, the city's windows, the regulators' finding, the numbers all there and no one to trust them; the floor's lights go out on
#    D minor, and the title comes in on F, with the mark. A timpani stroke as "2008" appears. The man from the board crosses the carpet;
#    the card passes between their hands; a printout from each business line laid on her desk; the pencil rings each code and joins
#    them; the total's question mark in marker; the desk calendar's pages, Friday to Monday; the last figure, and the red second one;
#    the lights going out
J = 'question'
board, some, same, add, trust = W(J, 'ask', 'board'), W(J, 'answer', 'somewhere'), W(J, 'answer', 'same customers'), W(J, 'monday', 'add it up'), W(J, 'trust', 'which to trust')
title = G(J, 'breath', 1.7)
bed([(S0(J), DM), (G(J, 'ask'), BBMAJ9), (W(J, 'ask', 'one question'), GM), (W(J, 'ask', 'how much'), A7SUS), (G(J, 'answer'), DM),
     (W(J, 'answer', 'each with'), BBMAJ9), (G(J, 'monday'), A7SUS), (G(J, 'one'), DM9), (W(J, 'found', 'couldn'), BBMAJ9), (G(J, 'there'), FMAJ),
     (G(J, 'trust'), GM7), (W(J, 'trust', 'or say'), A7SUS), (G(J, 'breath'), DM), (title - 0.3, FOPEN)], first('notnew'), 0.03, 1.8, 3.0)
timp(50, S0(J) + 0.8, 0.09)
for k in range(4):
    softstep(S0(J) + 2.0 + 0.42 * k, 0.014, 0.5 - 0.05 * k)
paper(board + 0.2, 0.02, 0.2, 0.3)
for i in range(4):
    paper(some - 0.1 + i * 0.5 + 0.3, 0.028, [-0.6, -0.19, 0.22, 0.62][i], 0.35)
for i in range(4):
    pencil(same - 0.2 + 0.383 * i, 0.34, 0.015, [-0.6, -0.19, 0.22, 0.62][i], 11 + i)
for i in range(3):
    pencil(same + 0.04 + 0.383 * i, 0.3, 0.011, [-0.4, 0.0, 0.42][i], 21 + i)
pencil(same + 1.0, 0.9, 0.015, 0.0, 31)
marker(add - 0.1, 0.7, 0.02, -0.15, 41)
for k in range(3):
    flick(G(J, 'monday', 0.05 + 0.6 * k), 0.024, 0.68)
marker(G(J, 'there', 0.4), 0.6, 0.018, 0.1, 42)
marker(trust - 0.3, 0.9, 0.02, 0.3, 43)
clunk(G(J, 'breath', 0.15), 0.028, 0.3); clunk(G(J, 'breath', 0.75), 0.022, -0.3)
mark(title)
# 2. Not a new problem: no chord at the turn (the title's chord is let go as the voice begins). A timpani stroke on F as "1980" appears,
#    in Los Angeles. A slip for each question on the shared computer; pencil lines from each desk to it; the pen in the dictionary; the
#    marker on the flip chart; a cork pin for each new chapter's flyer, with a chord as they go up; a slip at each lone window; the two
#    binders swung across, with a chord, F, that turns to G minor in the pause before 2002; the pen copying the borrowed page
J = 'notnew'
owns, see, share, dic = W(J, 'questions', 'who owns'), W(J, 'questions', 'who may see'), W(J, 'sharing', 'sharing data'), W(J, 'job', 'dictionary')
meet, share2, learned = W(J, 'la', 'started meeting'), W(J, 'la', 'to share'), W(J, 'la', 'learned')
city, lone, them = W(J, 'chapters', 'city after city'), W(J, 'alone', 'the same lessons'), W(J, 'together', 'learn them')
paper(owns, 0.02, -0.1, 0.25); paper(see, 0.02, 0.12, 0.25)
pencil(share - 0.2, 1.8, 0.011, 0.0, 51)
for k, (off, d) in enumerate([(0.3, 0.6), (1.0, 1.0), (2.1, 1.0)]):
    pen(dic + off, d, 0.016, 0.1, 61 + k)
timp(53, G(J, 'la', -0.1), 0.07)
for k, (t0, d) in enumerate([(meet + 0.3, 1.1), (share2 + 0.3, 0.8), (learned, 0.8)]):
    marker(t0, d, 0.016, -0.3, 71 + k)
for i in range(6):
    pin(city - 0.25 + i * 0.34 + 0.3, 0.028, [-0.48, 0.01, 0.51][i % 3])
moment(city - 0.4, city + 1.9, FMAJ9)
for i in range(3):
    paper(lone - 0.2 + i * 0.35 + 0.15, 0.018, [-0.5, 0.0, 0.5][i], 0.25)
air(them - 0.5 + 0.35, 0.6, 0.016, 0.0)
turn('signs', [(them - 0.6, FMAJ)])
for i in range(6):
    pen(them + 1.25 + i * 0.6, 0.52, 0.014, 0.1, 81 + i)
# 3. Someone signs: the turn on G minor, a timpani stroke on D as "2002" appears. The two signatures, side by side; the two lines ruled
#    in gold
J = 'signs'
year(J, 50)
for k, (word, d, pan) in enumerate([('sign for', 1.15, -0.18), ('figures', 1.1, 0.27)]):
    sign(W(J, 'law', word, -0.05), d, 0.02, pan, 91 + k)
ans = W(J, 'top', 'answered')
pen(ans, 0.5, 0.012, -0.18, 95); pen(ans + 0.4, 0.5, 0.012, 0.27, 96)
# 4. Written down: the turn on B flat, a timpani stroke as "2009" appears. The book set on its shelf, with a chord, F; its cover opened at
#    the wheel, and its two rings sketched in pencil; a soft knock as each area comes in round the rim; a chord as the centre lights gold,
#    governance, until the rim draws true and settles; air as the wheel turns once; a knock for each other guide's note; the cover closed
J = 'written'
turn(J)
year(J, 46)
know, dm = W(J, 'dmbok', 'knowledge'), W(J, 'dmbok', 'DMBOK')
set_ = know - 0.9
book(set_ + 0.95, 0.042, 0.19)
moment(set_ + 0.85, set_ + 2.2, FMAJ9)
cover(dm + 0.9 + 0.5, 0.024, 0.0, 0.9)
draws = W(J, 'wheel', 'draws', 0.2)
pencil(draws, (W(J, 'wheel', 'wheel') + 0.3 - draws) * 0.85, 0.010, 0.0, 41)
named = [W(J, 'wheel', 'architecture'), W(J, 'wheel', 'modelling'), 0, W(J, 'wheel', 'security'), 0, 0, 0, 0, W(J, 'wheel', 'metadata'), W(J, 'wheel', 'quality')]
rest = [2, 4, 5, 6, 7]
for k in range(10):
    t0 = named[k] - 0.15 if named[k] else W(J, 'wheel', 'more', -0.1) + rest.index(k) * 0.16
    knock(t0 + 0.12, 0.014, 0.5 * np.sin(2 * np.pi * k / 10), 280 + 8 * k)
hub, gov = W(J, 'hub', 'hub'), W(J, 'hub', 'governance')
moment(hub - 0.3, gov + 1.4, FOPEN, 0.028)
settle(gov + 1.25, 0.024)
air(W(J, 'decide', 'balance', -0.1), 2.0, 0.012, 0.0)
part = W(J, 'guides', 'part')
for t0, pan in [(G(J, 'guides', 0.15), 0.6), (part - 0.1, -0.6), (part + 1.2, 0.6)]:
    knock(t0 + 0.08, 0.02, pan, 300)
cover(W(J, 'takes', 'shows', -0.2), 0.026, 0.0, 0.9)
# 5. Governance first: the turn on D minor, a timpani stroke as "2013" appears and another, on A, as "2023" does. The page turned to the
#    second principle; the towers standing up, row by row; a chord under the two green towers; a sticky note for each finding
J = 'first'
turn(J)
year(J, 50)
page(G(J, 'own', -0.85) + 0.2, 0.03, 0.1, 0.8)
yr = G(J, 'ten', -0.3)
timp(45, yr + 0.2, 0.06)
for r in range(4):
    knock(yr + 0.3 + r * 0.28 + 0.35, 0.012, -0.3 + 0.2 * r, 260 - 20 * r)
two, met = W(J, 'ten', 'two'), W(J, 'ten', 'met')
moment(two - 0.25, met + 0.4, A7SUS)
for k, word in enumerate(['underfunded', 'narrow', 'attention']):
    sticky(W(J, 'programmes', word, -0.1) + 0.25, 0.02, [0.25, 0.48, 0.28][k])
# 6. Should we?: the turn on C, a timpani stroke as "2017" appears, and on A as "Europe · 2018" does. The second edition set on the
#    shelf; the bubble, "Should we?", and a suspended chord as the room goes still; the letter passed over the counter; the register's
#    cover opened; the reply slid across, its rows copied, and stamped; the reply handed back
J = 'should'
turn(J)
year(J, 48)
book(W(J, 'ethics', 'second', -0.95) + 0.95, 0.04, 0.28)
should = W(J, 'ethics', 'should')
knock(should - 0.15 + 0.1, 0.02, 0.0, 300)
moment(should - 0.2, G(J, 'law', -0.6), A7SUS)
fd = G(J, 'law', -0.3)
timp(45, fd + 0.2, 0.06)
paper(fd + 1.15, 0.02, 0.0, 0.3)
cover(W(J, 'law', 'answer', -0.1) - 0.1, 0.022, 0.38, 0.5)
slide6 = W(J, 'law', 'hold', -0.35)
paper(slide6 + 0.1, 0.022, -0.5, 0.5)
pen(slide6 + 0.45, 0.45 + 0.18 * 3, 0.014, -0.5, 101)
rubber(W(J, 'law', 'prove', -0.08) + 0.15, 0.045, -0.4)
fd2 = G(J, 'people', -0.75)
paper(fd2 + 0.85, 0.02, 0.0, 0.3)
# 7. Machines that learn: the turn on E flat, a timpani stroke as "2024" appears and on F as "Now" does. Each photo laid on the pile, the
#    notebook copying it in pencil; the box lifted, a knock for each question; the revision set on the shelf; the highlighter along the
#    article's title; the draft set down and leaning on the books, a sticky note for each new section, its pages lifting under a chord,
#    F, as it's called a living body of knowledge; its tag dropping onto its string
J = 'machines'
turn(J)
year(J, 51)
what = W(J, 'learn', 'whatever')
for i, l in enumerate([S0(J) + 0.65, S0(J) + 1.1, S0(J) + 1.55, S0(J) + 2.0, what - 0.2, what + 0.75, what + 1.2]):
    photo(l, 0.018, 0.1)
    pencil(l + 0.08, 0.45, 0.011, 0.35, 111 + i)
tB = G(J, 'ask', -0.55)
box(tB + 0.8, 0.022, 0.1)
knock(W(J, 'ask', 'where', -0.15) + 0.1, 0.02, -0.48, 300); knock(W(J, 'ask', 'who', -0.15) + 0.1, 0.02, 0.17, 280)
book(W(J, 'revision', 'revision', -0.3) + 0.95, 0.04, 0.33)
highlight(W(J, 'act', 'governance', -0.15), 0.9, 0.016, 0.0)
tE = G(J, 'third', -0.5)
timp(53, tE + 0.2, 0.06)
dset = W(J, 'third', 'third', -0.1)
book(dset + 0.95, 0.026, 0.49, 120); knock(dset + 1.6, 0.014, 0.49, 260)
for word in ['AI governance', 'data ethics', 'sustainability']:
    sticky(W(J, 'third', word, -0.15) + 0.25, 0.018, 0.49)
living = W(J, 'living', 'living')
paper(living - 0.2, 0.012, 0.4, 2.2)
moment(living - 0.35, living + 1.0, FMAJ9)
tag(W(J, 'planned', 'twenty', -0.25) + 0.35, 0.018, 0.55)
# 8. Still at the centre: the turn on F, a timpani stroke as "Today" appears. A cork pin for the question's card, and for each sketch as
#    it's pinned above it; the newest copy drawn up off the shelf, and the draft settling upright; the cover opened at the wheel, and a
#    chord as its centre lights again; the copy set down on Yusuf's desk; footsteps in the corridor, coming to his door; from the last
#    line, F in open fifths under the end card, and the mark
J = 'centre'
turn(J)
year(J, 53)
pin(W(J, 'because', 'question', 0.15), 0.03, 0.0)
for i, word in enumerate(['nineteen', 'two thousand', 'every']):
    pin(W(J, 'every', word, 0.15), 0.026, [-0.51, 0.0, 0.51][i]); paper(W(J, 'every', word, 0.0), 0.012, [-0.51, 0.0, 0.51][i], 0.3)
pick = W(J, 'grows', 'book', -0.2)
slide(pick + 0.28, 0.02, 0.25, 0.3); knock(pick + 0.9, 0.014, 0.57, 220)
gov8, centre8 = W(J, 'grows', 'governance'), W(J, 'grows', 'centre')
cover(gov8 - 0.85 + 0.5, 0.024, 0.0, 0.9)
moment(gov8 - 0.2, centre8 + 0.3, FMAJ9, 0.026, 2.2)
book(W(J, 'today', 'lead', -1.25) + 0.95, 0.032, 0.19, 110)
for k in range(5):
    step(G(J, 'breath', -0.9 + 0.55 * k), lerp(0.009, 0.022, k / 4), lerp(-0.85, -0.72, k / 4))
bed([(last(J) + 0.6, FOPEN)], TOT + 1.0, 0.03, 1.5, 3.0)
mark(G(J, 'breath', 1.4))

# and the organ's chords, where they come in
play_bed()
