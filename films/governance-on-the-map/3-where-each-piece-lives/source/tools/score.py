# Where each piece lives: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series' third film (PLAYBOOK.md: vary the sound itself; A capability, not a project has its saxophone quartet,
# Who does what, end to end its four humming voices, Governance principles' films their brass and music box, recorders and marimba,
# piano, strings and clarinet, glass harmonica and handbells, guitar, electric piano and flute, the double reeds, organ and timpani):
# two keyboards, made here, a harpsichord and a clavichord, both played softly, the harpsichord on its softest stop and low in its range.
#  - The film is about homes and copies, so the harpsichord plays each thing at its home, and the clavichord copies it, a moment later
#    and further away, note for note: quieter, darker, more of it heard as the room's echo, and on the other side of the room.
#  - In Korea, the historians' writing is the home's figure, slowly, on the harpsichord: D, F, A, G, F, E, D. As a sheet is printed,
#    the clavichord copies its first notes, and as the books are laid in four chests the copy is heard four times, further and further
#    away. War comes as wind and far smoke, with no pulse: the four archives' copies play the figure together, a moment apart, and
#    three fall silent one after another as their archives burn, leaving one line, Jeonju's, alone while the scholars keep watch; the
#    seasons change on a held fifth. After the war the harpsichord plays the figure again from that one line, and five copies answer,
#    far apart; D minor turns to D major as the five sets reach the mountains. The historian's climb is the clavichord's even notes,
#    with a rising note as the books are laid open; the annals' three numbers are each a note and its copy; and the same with data:
#    the home's notes, and its three copies'.
#  - At the university, in B-flat: the planner's request is a two-note call, B-flat and F, left unanswered. The owner's phrase, Clara's,
#    falls F, D, B-flat; the page typed by hand plays it one note off, ending on C, until the morning's sync puts it right. Yusuf's
#    seven cards are a note each, the B-flat scale from its first note to its seventh, and Noor's one rule comes back to B-flat. On
#    Noor's map every flow is played forward, the home's note on the harpsichord and the copy's on the clavichord as the arrow reaches
#    it, never back: the arrow Noor stops ends on the clavichord's note, unanswered. The night's check is single clavichord notes, even
#    and slow, one at each copy, and three times it finds the note that's off. At the end every copy plays its home's phrase in tune,
#    the next series' six cards are six notes rising, and the planner's next call is answered.
#  - The series' mark, four notes, 1-5-4-8, on the harpsichord, answered by the clavichord, under the title (in D) and the end card
#    (in B-flat).
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, the annals', and after it only at a
#    chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that
#    after the opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Under the narration the harpsichord stays low (its notes no higher than A, 110 Hz, where the voice isn't), and its copies, an
#    octave up on the clavichord, are softer and further off; higher notes go in the pauses between the lines.
#  - Nothing trembles, pulses or beats: no urgent pulse, no ostinato, no vibrato (the clavichord's Bebung isn't used); every note is
#    tuned pure (just intonation, see hz()), from D, so the two keys share their notes exactly (B-flat is tuned a pure third under D),
#    and a note two instruments share is the same pitch. Nothing imitates the music of another culture: no Korean instrument, mode or
#    rhythm; the story is told in the series' own voice.
#  - Nothing loops. Where the picture repeats (the sheets, the cards, the steps), the sound plays the first few, then softer.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed: change one, change both.
# And everything stays low and soft: brushes on paper, a printing block inked and rubbed and a sheet lifted, books laid in chests, pins,
# a hand drawn back, wind over the hills, men far off on the road, far fire, footsteps on a mountain path, a small fire at night, books
# laid open, keys, cards laid on a desk, a pen on a card, a soft click as a name changes; all below about 2.5 kHz.

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
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x, k=1.0):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field (k > 1 spreads it wider)"""
    return max(-0.8, min(0.8, (x - 960) / 960 * 0.9 * k))
R1 = np.random.default_rng(1303)  # this film's own randomness: the strings' phases, the rooms, the paper, the brushes

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. Korea is in D (minor,
# then major); the university in B-flat, tuned a pure major third under D, so the two keys' shared notes are the same pitch exactly (D,
# F, G, A, B-flat, C, E-flat, E). Only D major's F-sharp, B and C-sharp are its own, and they never sound with B-flat's F. The chords on
# the second degree are left out (their fifths aren't pure here), and so is the seventh degree's in D minor (C with G)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEYS = {'D': (38, 73.416), 'Bb': (34, 73.416 * 0.8)}  # each key's own note (MIDI) and its pitch: D2, and B-flat 1
def hz(m, k='Bb'):
    t, f = KEYS[k]; o, pc = divmod(m - t, 12)
    return f * 2 ** o * _JI[pc]

# ---- the levels: the harpsichord sits about as far under the narrator as the series' other films' music (matched by loudness, not by
# peak); the clavichord a little under it, and further off; the effects about 20 dB under the music (FX scales them all)
RL, FX = 0.082, 1.75
LEVEL = {'hps': 1.0, 'clv': 0.8}
PAN = {'hps': -0.18, 'clv': 0.32}  # the harpsichord a little left of the middle; the clavichord, the copies, across the room from it

# ---- the instruments. Each is a string: every harmonic of its pitch, each dying away at its own rate (the higher, the sooner), a
# quick first fall and then a long ring, as a plucked string's sound does, until the key comes up and the string is damped. The
# harpsichord's quill plucks it near its end, so it's bright and a little nasal (the harmonics near every seventh are missing), with a
# small click as the quill passes; the clavichord's brass tangent strikes it and stays, softer and rounder, darker and shorter. Their
# harmonics stop at 2.7 kHz, and the whole score is low-passed at the end. No string is detuned from its note, and none trembles.
# The two stand in one small room (room(), about a second and a quarter); the copies are further off, in a larger, darker echo (2.4 s)
FL, FR = np.zeros_like(ML), np.zeros_like(MR)
def _ir(sec, lp, seed, pre):
    r = np.random.default_rng(seed); x = np.arange(int(sec * SR)) / SR
    ir = filt((r.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32), 'low', lp); ir[:int(pre * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum())
_IR, _FARL, _FARR = _ir(1.25, 1700, 11, 0.016), _ir(2.4, 1150, 12, 0.035), _ir(2.4, 1150, 13, 0.035)
def _pluck(f, d, tilt, beta, top, t60, half, att, click, rel):
    """a plucked or struck string at f Hz, its key held d seconds and then damped: the sum of its harmonics"""
    x = np.arange(int((d + rel * 2.5 + 0.02) * SR), dtype=np.float32) / SR
    n = np.arange(1, int(2700 // f) + 1); fk = f * n
    a = np.abs(np.sin(np.pi * n * beta)) ** 0.8 / n ** tilt / np.sqrt(1 + (fk / top) ** 4) * fk / np.sqrt(fk ** 2 + 90.0 ** 2)
    a = a / np.sqrt((a ** 2).sum()); T = t60 / (1 + (fk / half) ** 1.3); s = np.zeros(len(x), np.float32); ph = R1.uniform(0, 2 * np.pi, len(n))
    for k in range(len(n)):
        if a[k] < 2e-3:
            continue
        e = 0.45 * np.exp(-6.9 * x / (0.22 * T[k])) + 0.55 * np.exp(-6.9 * x / T[k])
        s += (a[k] * e * np.sin(2 * np.pi * fk[k] * x + ph[k])).astype(np.float32)
    s *= np.exp(-6.9 * np.maximum(x - d, 0) / rel).astype(np.float32) * np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    m = min(len(x), int(0.03 * SR)); s[:m] += click * filt(R1.standard_normal(m).astype(np.float32), 'band', (700, 2300)) * np.exp(-x[:m] / 0.004)
    return s
def _place(sig, s, g, pan, far, send):
    """the note at its place: further off, it's quieter, darker, and more of it is heard as the room's echo"""
    if far > 0:
        sig = filt(sig, 'low', 2300 / (1 + 0.55 * far))
    put(sig, s, g * 0.7 ** far, pan)
    i = int(s * SR); j = min(len(FL), i + len(sig)); wet = g * (send + 0.22 * far) * 0.86 ** far; p = max(-1.0, min(1.0, pan))
    if j > i and wet > 0:
        FL[i:j] += sig[:j - i] * np.float32(wet * np.sqrt(0.5 * (1 - p))); FR[i:j] += sig[:j - i] * np.float32(wet * np.sqrt(0.5 * (1 + p)))
def hps(m, s, d=0.6, g=1.0, k='Bb', pan=None, far=0.0):
    """the harpsichord, on its softest stop: a note at its home"""
    f = hz(m, k); sig = _pluck(f, d, 1.05, 0.14, 1900, min(7.0, 5.0 * (110 / f) ** 0.5), 650, 0.003, 0.05, 0.12)
    _place(sig, s, g * RL * LEVEL['hps'], PAN['hps'] if pan is None else pan, far, 0.12)
def clv(m, s, d=0.6, g=1.0, k='Bb', pan=None, far=1.0):
    """the clavichord: a copy, further off"""
    f = hz(m, k); sig = _pluck(f, d, 1.4, 0.09, 1400, min(4.5, 3.0 * (147 / f) ** 0.4), 480, 0.007, 0.012, 0.07)
    _place(sig, s, g * RL * LEVEL['clv'], PAN['clv'] if pan is None else pan, far, 0.2)
def play(inst, notes, s, step=0.5, last=1.2, g=1.0, k='Bb', **o):
    """notes one after another, each held a little into the next, the last held last seconds"""
    fn = hps if inst == 'hps' else clv
    for i, m in enumerate(notes):
        fn(m, s + i * step, step * 1.08 if i < len(notes) - 1 else last, g, k, **o)
def strum(inst, notes, s, d, g=1.0, k='Bb', step=0.07, **o):
    """a chord played from its lowest note up, each held until d seconds after the first"""
    fn = hps if inst == 'hps' else clv
    for i, m in enumerate(notes):
        fn(m, s + i * step, d - i * step, g, k, **o)
def room(level=0.24):
    """last of all: the copies' far echo, then the whole music bus played into the one small room"""
    ML[:] += fftconvolve(FL, _FARL)[:len(ML)].astype(np.float32); MR[:] += fftconvolve(FR, _FARR)[:len(MR)].astype(np.float32)
    for b in (ML, MR):
        b[:] = b + level * fftconvolve(b, _IR)[:len(b)].astype(np.float32)
up = lambda notes, k=12: [m + k for m in notes]
# the phrases: the home's figure, the historians' writing (D minor, and in D major after the war), and its first three notes, the copy
# a sheet carries; the planner's call; the owner's phrase, and the same one note off, as the page typed by hand plays it; Yusuf's seven
# places, the B-flat scale; and the series' mark, 1-5-4-8
HOME, HOMEMAJ = [38, 41, 45, 43, 41, 40, 38], [38, 42, 45, 43, 42, 40, 38]
CALL, OWNER, OFF, SEVEN = [46, 53], [41, 38, 34], [41, 38, 36], [34, 36, 38, 39, 41, 43, 45]
MARK = lambda r: [r, r + 7, r + 5, r + 12]

# ---- the sounds: paper and brushes, the printers' block, chests and books, wind, fire, footsteps, keys, cards and pins; all low-passed
def _swell(sec, rate, depth, seed):
    """a slow, uneven rise and fall, depth deep, about rate times a second"""
    x = tt(sec); r = np.random.default_rng(seed)
    m = filt(r.standard_normal(len(x)).astype(np.float32), 'low', rate); m = m / (np.abs(m).max() + 1e-9)
    return (1 - depth) + depth * (0.5 + 0.5 * m)
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.020, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def brush(s, g=0.008, pan=0.0, sec=0.3):
    """a brush stroke on paper: a soft, broad hush that swells and thins as the brush lifts"""
    x = tt(sec); X(filt(noise(sec), 'band', (220, 1300))[:len(x)] * np.sin(np.pi * x / sec) ** 1.4 * (1 - 0.5 * x / sec), s, g * FX, pan)
def writing(s, sec, g=0.007, pan=0.0):
    """a brush writing: strokes of uneven length, with short pauses as it's lifted; the first few heard, then softer"""
    t0, k = 0.0, 0
    while t0 < sec - 0.12:
        d = R1.uniform(0.14, 0.34); brush(s + t0, g * R1.uniform(0.6, 1.0) * (1 if k < 4 else 0.7), pan, d); t0 += d + R1.uniform(0.06, 0.28); k += 1
def dab(s, g=0.010, pan=0.0):
    """ink dabbed onto the printing block with a pad: two soft, padded pats"""
    s_knock(s, g * FX, pan, 150); s_knock(s + 0.26, g * 0.75 * FX, pan, 140)
def rub(s, sec=0.45, g=0.008, pan=0.0):
    """the sheet rubbed down on the block with a pad: a soft hush, back and forth"""
    x = tt(sec); X(filt(noise(sec), 'band', (200, 1100))[:len(x)] * np.sin(np.pi * x / sec) * (0.65 + 0.35 * np.cos(2 * np.pi * 3.0 * x)), s, g * FX, pan)
def peel(s, g=0.012, pan=0.0):
    """a sheet taken off a block or a board: a short peel"""
    x = tt(0.3); X(filt(noise(0.3), 'band', (400, 1800))[:len(x)] * np.sin(np.pi * x / 0.3) ** 2 * np.linspace(0.6, 1, len(x)), s, g * FX, pan)
def lift(s, g=0.009, pan=0.0):
    """a printed sheet peeled off the block and lifted to the pile: a short peel, a breath of air"""
    peel(s, g, pan); s_air(s + 0.12, 0.4, g * 0.4 * FX, pan, 180, 900)
def printing(s0, s1, g=0.009, pan=0.0):
    """the printers at work, as oh_print paints them (each sheet a turn of 1/0.42 s of the film's time): the block inked, a sheet
    laid on it and rubbed down, and lifted off; only what happens between s0 and s1"""
    for k in range(int(s0 * 0.42) - 1, int(s1 * 0.42) + 2):
        for t0, fn in ((k / 0.42, dab), ((k + 0.36) / 0.42, lambda s, g, p: paper(s, g * 0.8, p, 0.25)), ((k + 0.42) / 0.42, rub), ((k + 0.56) / 0.42, lift)):
            if s0 <= t0 < s1:
                fn(t0, g, pan)
def cloth(s, sec=0.7, g=0.007, pan=0.0):
    """books laid into a chest in their cloth: a soft, dull rustle, and the books settling"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * _swell(sec, 7, 0.5, int(s * 5) % 83), s, g * FX, pan)
    s_knock(s + sec * 0.7, g * 0.6 * FX, pan, 120)
def chest(s, g=0.012, pan=0.0):
    """a small chest set down on its place: a deep, wooden thump"""
    s_knock(s, g * FX, pan, 110); s_knock(s + 0.02, g * 0.4 * FX, pan, 230)
def pin(s, g=0.016, pan=0.0):
    """a push pin into cork, or a pin into paper on a board: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def sleeve(s, g=0.007, pan=0.0, sec=0.5):
    """a hand reaching out, or drawn back: a silk sleeve's soft swish"""
    x = tt(sec); X(filt(noise(sec), 'band', (200, 1200))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def wind(s, sec, g=0.010, pan=0.0, lo=110, hi=650):
    """wind over the hills: a low, slow, uneven rush that comes and goes"""
    x = tt(sec); e = np.minimum(1, x / 1.2) * np.minimum(1, np.maximum(sec - x, 0) / 1.5) * _swell(sec, 0.7, 0.75, int(s * 3) % 91)
    X(filt(noise(sec), 'band', (lo, hi))[:len(x)] * e, s, g * FX, pan)
def crowd(s, sec, g=0.005, pan=0.0):
    """men coming up the road, far off: many feet, low and blurred, each step at its own moment, so there's no beat"""
    t0 = 0.0
    while t0 < sec:
        x = tt(0.12); X(norm(filt(noise(0.12), 'band', (70, 380)) * np.exp(-x * 30)), s + t0, g * FX * R1.uniform(0.3, 1.0) * min(1, t0 / 1.0 + 0.2), pan + R1.uniform(-0.25, 0.25))
        t0 += R1.uniform(0.03, 0.11)
def crackle(s, sec, g=0.005, pan=0.0, rate=6.0):
    """a fire: small, uneven pops over its low breath"""
    t0 = R1.uniform(0, 0.1)
    while t0 < sec:
        x = tt(0.025); X(norm(filt(noise(0.025), 'band', (300, 1400)) * np.exp(-x * 170)), s + t0, g * FX * R1.uniform(0.25, 1.0), pan + R1.uniform(-0.08, 0.08))
        t0 += R1.exponential(1 / rate)
    x = tt(sec); X(filt(noise(sec), 'band', (60, 280))[:len(x)] * np.minimum(1, x / 0.6) * np.minimum(1, np.maximum(sec - x, 0) / 0.8), s, g * 0.9 * FX, pan)
def grit(s, g=0.007, pan=0.0):
    """a footstep on a mountain path: a soft crunch of earth and grit"""
    x = tt(0.17); X(norm(filt(noise(0.17), 'band', (110, 1000))[:len(x)] * np.exp(-x * 24) * (1 - np.exp(-x * 300))), s, g * FX * R1.uniform(0.75, 1.0), pan)
def walkers(s, sec, phases, g=0.006, pans=(0.0,), near=None):
    """walkers on the path, as oh_walkers paints them: each a step whenever its stride, sin(5.2 t + phase), crosses zero; near(t) (0 to
    1) is how close they've come"""
    for i, ph in enumerate(phases):
        k = int(np.ceil(ph / np.pi))
        while True:
            t0 = (k * np.pi - ph) / 5.2; k += 1
            if t0 >= sec:
                break
            if t0 >= 0:
                grit(s + t0, g * (0.6 + 0.4 * (near(t0) if near else 1)), pans[i % len(pans)])
def hush(s, sec, g=0.006, pan=0.0):
    """snow falling: the softest air"""
    s_air(s, sec, g * FX, pan, 150, 700)
def books(s, g=0.007, pan=0.0):
    """a book laid open on a rack: a soft cover, and its pages settling"""
    s_knock(s, g * 0.7 * FX, pan, 180); paper(s + 0.03, g * 0.6, pan, 0.25)
def pat(s, g=0.012, pan=0.0):
    """a card set down, or pressed onto a board: a small, padded pat"""
    s_knock(s, g * FX, pan, 200); paper(s + 0.01, g * 0.35, pan, 0.12)
def pen(s, g=0.009, pan=0.0, sec=1.2):
    """a pen writing on a card: short strokes, unevenly, never quite in time"""
    x = tt(sec); e = np.zeros(len(x), np.float32); t0 = 0.0
    while t0 < sec - 0.06:
        d = R1.uniform(0.05, 0.13); i, j = int(t0 * SR), min(len(x), int((t0 + d) * SR))
        e[i:j] = np.maximum(e[i:j], np.sin(np.pi * np.arange(j - i) / max(1, j - i)) * R1.uniform(0.5, 1.0)); t0 += d + R1.uniform(0.0, 0.05)
    X(filt(noise(sec), 'band', (500, 1900))[:len(x)] * e, s, g * FX, pan)
def pencil(s, g=0.010, pan=0.0, sec=0.5):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def tick(s, g=0.010, pan=0.0):
    """a tick: two quick pencil strokes"""
    pencil(s, g, pan, 0.12); pencil(s + 0.13, g * 0.85, pan, 0.18)
def marker(s, g=0.011, pan=0.0, sec=0.7):
    """a marker drawn round something: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def strike(s, g=0.012, pan=0.0, sec=0.5):
    """a line struck through: one firm stroke, slowing at its end"""
    x = tt(sec); X(filt(noise(sec), 'band', (420, 1800))[:len(x)] * np.sin(np.pi * np.clip(x / sec, 0, 1)) ** 0.6 * np.linspace(1.0, 0.7, len(x)), s, g * FX, pan)
def slide(s, g=0.014, pan=0.0, sec=0.5):
    """a sheet slid across a desk: a low, smooth slide"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def click(s, g=0.010, pan=0.0):
    """a soft click as a name changes on a screen"""
    s_tap(s, g * FX, pan); s_knock(s + 0.005, g * 0.35 * FX, pan, 520)
def keys(s, sec, g=0.006, pan=0.0):
    """typing, softly: muffled keys, unevenly"""
    t0 = 0.0
    while t0 < sec:
        tap(s + t0, g * R1.uniform(0.6, 1.0), pan); t0 += R1.uniform(0.09, 0.2)
def step(s, g=0.008, pan=0.0):
    """a footstep on an office floor: a dull, low pat"""
    x = tt(0.14); X(norm(filt(noise(0.14), 'band', (90, 650)) * np.exp(-x * 34)), s, g * FX * R1.uniform(0.8, 1.0), pan)
def walk(s, sec, g=0.007, p0=0.0, p1=0.0, per=0.294):
    """someone walking, as gv_walk paints them: a step every 0.294 s"""
    n = int(sec / per)
    for k in range(n):
        step(s + k * per + 0.015 * R1.uniform(), g * (0.85 + 0.15 * (k % 2)) * min(1, (k + 1) / 2, (n - k) / 2), p0 + (p1 - p0) * k / max(1, n))

# =============================================================================================================================
# 1. Nobody writes in a copy: Korea under the Joseon kings, in D minor. The court: the historians write, and the harpsichord plays the
#    home's figure, slowly, twice, the second time to its close. A king dies, the office makes his annals from their notes: B-flat and
#    F under it, then the figure's start; a sheet printed and lifted, and the clavichord copies it; the books laid in four chests, and
#    the copy four times, further and further away; the sealed chest, the king's hand stopped, and a bare fifth. 1592: wind, the men far
#    off on the road, smoke; the four copies play the figure together, and three fall silent as their archives burn. Jeonju's line
#    alone: what would be gone, a note each; the scholars come to the gate; the path, the cave, the fire, the seasons on a held fifth.
#    1603: the lone line gives the figure, the harpsichord plays it again from it as the block is printed; five sets far apart, five
#    copies answering, and D major as they reach the mountains. The climb, the even notes, the books laid open, the figure written; the
#    annals' numbers, a note and its copy each; today, a copy anyone can read. Jeonju's copy rebuilds the rest; the same with data: the
#    home, its three copies, checked. The title, and the mark
w_ = lambda lid, word, off=0: W('copy', lid, word, off)
c_ = lambda lid, off=0: G('copy', lid, off)
e_ = lambda lid, off=0: END('copy', lid) + off
write, prints, kept, nobody, notKing, three = w_('daily', 'write down'), w_('king', 'and prints'), w_('same', 'kept in'), w_('same', 'and nobody'), w_('same', 'not even'), w_('y1592', 'and three')
years, what, whom, why, guard, year = w_('gone', 'a hundred'), w_('gone', 'what was'), w_('gone', 'by whom'), w_('gone', 'and why'), w_('scholars', 'and guard'), w_('scholars', 'for more')
capital, mount, airs, writes, y472, kings, b888 = w_('five', 'one in'), w_('five', 'four high'), w_('climbs', 'airs'), w_('climbs', 'and writes'), w_('survive', 'four hundred'), w_('survive', 'twenty-five'), w_('survive', 'eight hundred')
free, one, way, homeW, oneway, checked = w_('today', 'free'), w_('rebuild', 'one source'), w_('rebuild', 'one way'), w_('trusted', 'from its home'), w_('trusted', 'one way'), w_('trusted', 'checked')
s2, s2b, s3, s3b, s4, s4b, s4c = c_('daily', -0.3), write - 0.2, c_('king', -0.3), prints - 0.2, c_('same', -0.3), kept - 0.3, nobody - 0.3
s5, s5b, s6, s7, s8, s9, s9b, s9c = c_('y1592', -0.3), three - 0.3, c_('left', -0.3), c_('gone', -0.3), c_('change', -0.3), c_('scholars', -0.3), guard - 0.3, year - 0.2
s10, s11, s12, s12b, s12c, s13, s14, s15, s16, s17 = c_('again', -0.3), c_('five', -0.3), c_('climbs', -0.3), airs - 0.3, writes - 0.3, c_('survive', -0.3), c_('today', -0.3), c_('rebuild', -0.3), c_('data', -0.3), c_('breath')
# the court: the historians at their desks at the left, writing (from 0.3, close from s2b); the home's figure, slowly, as they write,
# and again, to its close (C-sharp to D), as the sheet is written close
writing(0.4, s2 - 0.4, 0.005, -0.55); writing(s2 + 0.1, s3 - s2 - 0.3, 0.008, -0.3)
play('hps', HOME, 0.5, 0.55, 1.6, 1.0, 'D')
play('hps', [45, 43, 41, 40, 38, 37, 38], c_('daily', 0.2), 0.55, 1.1, 1.0, 'D')
# the office: a king has died; B-flat and F under the line, its weight; and as the annals are made from the historians' notes, the
# figure's start, the record at its home
strum('hps', [34, 41], s3 + 0.25, 2.4, 0.9, 'D', step=0.12)
paper(w_('king', 'from their notes', -0.1), 0.008, px(700), 0.4)
play('hps', HOME[:4], w_('king', 'his annals', 0.1), 0.5, 1.2, 1.0, 'D')
# the printers (s3b, until the chests): the block inked, a sheet laid and rubbed, and lifted; as it's lifted, in the pause after the
# line, the clavichord copies the figure's start, note for note
printing(s3b, s4, 0.008, px(1000))
LIFT1 = (int(s3b * 0.42 - 0.72) + 1 + 0.72) / 0.42  # the first sheet taken off the block in the shot
play('clv', up(HOME[:4]), max(LIFT1, e_('king', 0.05)), 0.26, 0.7, 1.0, 'D', far=1.0)
# four chests, each filled in turn (from s4 + 0.3, 0.45 s apart): the books laid in, in their cloth; the copy, the figure's first three
# notes, heard four times, each further away, from each chest's place; the four archives pinned on the sheet (from s4b + 0.1, 0.3 apart)
for i, cx in enumerate((330, 750, 1170, 1590)):
    cloth(s4 + 0.3 + 0.45 * i, 0.7, 0.007 if i < 2 else 0.005, px(cx))
    play('clv', up(HOME[:3]), s4 + 0.32 + 0.45 * i, 0.15, 0.55, 1.0 - 0.12 * i, 'D', pan=px(cx, 1.3), far=1.2 + 0.7 * i)
for i, vx in enumerate((700, 1220, 1250, 660)):
    pin(s4b + 0.1 + 0.3 * i + 0.3, 0.012 if i < 2 else 0.008, px(vx))
# nobody may change one: the sealed chest; the king's hand reaches out (from P.notKing - 0.4, over 1.1 s), and stops; nothing plays
# as it reaches; as it stops, a bare fifth, D and A, low; it's drawn back (from P.notKing + 1.4)
sleeve(notKing - 0.4, 0.008, 0.6, 0.9); sleeve(notKing + 1.4, 0.006, 0.6, 1.0)
strum('hps', [38, 45], notKing + 0.75, 2.6, 0.85, 'D', step=0.0)
# 1592: the road over the pass, wind, the men far off coming up it, smoke beyond the hills; the board, smoke over three of the four
# archives (from s5b + 0.2, 0.35 s apart), far fire. The four copies play the figure together, each from its archive's place on the
# sheet, a moment apart; as each archive burns, its copy falls silent; Jeonju's plays on alone, to its last note
wind(s5 - 0.2, 7.5, 0.011, 0.1); crowd(s5 + 0.4, s5b - s5 - 0.3, 0.004, px(1100))
crackle(s5 + 0.6, s5b - s5 - 0.3, 0.003, px(1500)); crackle(s5 + 1.2, s5b - s5 - 0.8, 0.0025, px(380))
BURN = [s5b + 0.2 + 0.35 * i + 0.35 for i in range(3)] + [None]
for j, (vx, burn) in enumerate(zip((700, 1220, 1250, 660), BURN)):
    t0 = s5 + 1.3 + 0.06 * j
    for i, m in enumerate(up(HOME)):
        a = t0 + 0.45 * i
        if burn is not None and a > burn - 0.2:
            break
        d = 0.49 if i < 6 else 1.6
        clv(m, a, min(d, burn - a) if burn else d, 0.62, 'D', pan=px(vx, 2.2), far=1.4 + 0.15 * j)
    if burn:
        crackle(burn - 0.25, 2.4, 0.004, px(vx))
# Jeonju's archive lit on the sheet (from c.left - 0.8), and its bay: the lone copy's note; then, after the line, the figure goes on,
# Jeonju's copy alone, in the middle now
clv(50, c_('left', -0.75), 1.2, 0.8, 'D', pan=0.0, far=1.0)
play('clv', up(HOME[1:]), e_('left', 0.06), 0.45, 1.3, 0.75, 'D', pan=0.0, far=1.0)
# a page of the annals, close: what would be gone, a note each as its tag appears, falling
paper(s7 + 0.3, 0.008, 0.0, 0.5)
for t0, m in ((what, 57), (whom, 53), (why, 50)):
    clv(m, t0 + 0.1, 1.0, 0.7, 'D', pan=0.0, far=1.0)
# something has to change: two scholars of the town come up to the archive's gate (over 2.2 s), on gravel
walk(s8 + 0.1, 2.0, 0.006, px(1500), px(1100), 0.36); walk(s8 + 0.25, 2.0, 0.005, px(1640), px(1250), 0.38)
# into the mountains: the two scholars lead, the keepers carry the chests up the path towards us, the wind over the hills; Jeonju's
# line plays the figure, slowly, as they climb
walkers(s9, s9b - s9, [0, 1.7, 3.4, 5.1], 0.006, (-0.15, 0.1, -0.3, 0.3), near=lambda t: t / 3.0)
wind(s9 - 0.3, s9b - s9 + 0.6, 0.008, 0.2, 140, 700)
play('clv', up(HOME), s9 + 0.25, 0.42, 0.9, 0.7, 'D', pan=0.0, far=1.0)
# the cave by night: the small fire; then the snow, the seasons turning on a held fifth, D and A, Jeonju's copy holding on; they
# change over (from s9c + 0.9); in the pause, the figure's start, softly
crackle(s9b, s9c - s9b + 0.4, 0.006, px(1000), 4.0); crackle(s9c - 0.2, s10 - s9c + 0.1, 0.005, px(1000), 3.0)
sleeve(s9c + 0.9, 0.004, 0.2, 0.8)
hush(s9c, s10 - s9c, 0.006, 0.0)
strum('clv', [50, 57], s9c + 0.05, 2.6, 0.85, 'D', step=0.0, pan=0.0, far=1.2)
play('clv', up(HOME[:3]), e_('scholars', 0.4), 0.42, 1.0, 0.6, 'D', pan=0.0, far=1.4)
# 1603: the court prints them again, from that one copy, open on its stand (from s10 + 0.4): the lone line gives the figure's start,
# and the harpsichord plays the whole figure from it, at its home again, as the block is inked and the sheets lifted
printing(s10, s11, 0.007, px(880))
play('clv', up(HOME[:4]), s10 + 0.5, 0.36, 0.7, 0.8, 'D', pan=px(330), far=1.0)
play('hps', HOME, s10 + 2.0, 0.45, 1.0, 1.0, 'D')
# five sets, far apart: each archive pinned on the sheet as its view appears (from s11 + 0.2, 0.2 s apart), a chest landing on each as
# the line names them (the capital's from P.capital - 0.2, the mountains' from P.mount - 0.4, 0.25 apart, each landing 0.57 s on); each
# copy answers from its place, far apart: the capital's in D minor, and as they reach the mountains, D major. In the pause, the
# harpsichord's D major under them, at home
V5 = {'capital': 430, 'odae': 1060, 'taebaek': 1500, 'myohyang': 1060, 'mani': 1500}
for i, k in enumerate(V5):
    pin(s11 + 0.2 + 0.2 * i + 0.3, 0.008 if i < 2 else 0.005, px(V5[k]))
cap = capital - 0.2 + 0.57
chest(cap, 0.010, px(430)); play('clv', up(HOME[:3]), cap + 0.05, 0.15, 0.7, 0.85, 'D', pan=px(430, 1.4), far=1.6)
for i, k in enumerate(('odae', 'taebaek', 'myohyang', 'mani')):
    t0 = mount - 0.4 + 0.25 * i + 0.57
    chest(t0, 0.008 if i < 2 else 0.005, px(V5[k]))
    play('clv', up(HOMEMAJ[:3]), t0 + 0.05, 0.15, 0.7 if i < 3 else 1.4, 0.8, 'D', pan=px(V5[k], 1.4) * (1 if i % 2 else 0.6), far=2.0 + 0.4 * i)
strum('hps', [38, 45, 50, 54], e_('five', 0.08), c_('climbs', -0.3) - e_('five', 0.08), 0.8, 'D', step=0.1)
# a historian climbs, years later, among the maples, a step every 0.6 s, the wind softer now; the clavichord's even notes, the check
# he makes, in step with him; the books laid open on their racks (from s12b, as each rack fills); the rising notes as they open; and
# he writes down what he finds: the figure's start, at home
walkers(s12, s12b - s12, [0.0], 0.006, (0.1,)); wind(s12 - 0.3, s12b - s12 + 0.6, 0.006, -0.2, 160, 800)
for i, m in enumerate((50, 45, 50, 45)):
    clv(m, s12 + 0.3 + 0.604 * i, 0.5, 0.65, 'D', pan=0.15, far=1.2)
for i, m in enumerate((54, 57)):
    books(s12b + 0.05 + 0.4 * i, 0.006, px(960 + 440 * i)); clv(m, s12b + 0.05 + 0.4 * i, 0.5 if i == 0 else 0.9, 0.7, 'D', far=1.0)
writing(s12c + 0.2, s13 - s12c - 0.5, 0.007, 0.0)
play('hps', HOMEMAJ[:3], s12c + 0.5, 0.5, 1.3, 1.0, 'D')
# the annals survive, complete: the long shelf; each number's tag, a note at home and its copy a moment later; in the pause, D major
for t0, m in ((y472, 38), (kings, 42), (b888, 45)):
    hps(m, t0 - 0.05, 0.9, 0.9, 'D'); clv(m + 12, t0 + 0.25, 0.7, 0.8, 'D', far=1.2)
strum('hps', [38, 45, 50, 54], e_('survive', 0.08), c_('today', -0.2) - e_('survive', 0.08), 0.8, 'D', step=0.1)
# today: a reader at a library's screen; the page comes up (from s14 + 0.3), a click; a copy anyone can read, near, on the clavichord
tap(s14 + 0.3, 0.008, px(1220)); play('clv', up(HOMEMAJ[:3]), s14 + 0.4, 0.2, 0.9, 0.8, 'D', pan=px(1220), far=0.6)
# Jeonju's copy could rebuild the rest: its copy in the middle of the five (from s15, over 0.6 s), its notes; the harpsichord plays the
# whole figure from it, at home; the gold lines from it reach each of the five (P.one + 1.075, 0.206 s apart), and each answers, far off
play('clv', up(HOMEMAJ[:3]), s15 + 0.4, 0.2, 0.8, 0.8, 'D', pan=0.0, far=1.0)
play('hps', HOMEMAJ, s15 + 1.4, 0.45, 1.0, 0.95, 'D')
for i, (vx, m) in enumerate(((400, 50), (960, 54), (1520, 57), (430, 62), (1490, 57))):
    clv(m, one + 1.075 + 0.206 * i, 0.9 if i < 4 else 1.4, 0.7, 'D', pan=px(vx, 1.4), far=2.0)
    air(one + 0.6 + 0.206 * i, 0.6, 0.004, px(vx))
# the same with data: the home, the data team's repository (lit from P.home - 0.3): its notes; its three copies, the table's page, the
# catalogue and a dashboard, as each arrow reaches it (P.oneway + 0.73, 0.233 s apart): the copy's notes; each ticked (P.checked - 0.1)
play('hps', HOMEMAJ[:3], homeW - 0.2, 0.3, 1.0, 0.9, 'D')
for i in range(3):
    play('clv', up(HOMEMAJ[:3]), oneway + 0.73 + 0.233 * i, 0.09, 0.6, 0.75 - 0.1 * i, 'D', pan=px(1460, 1.2), far=1.0 + 0.3 * i)
    tick(checked - 0.1 + 0.25 * i + 0.1, 0.008 if i < 2 else 0.006, px(1720))
# the title, and the mark: the harpsichord, then the clavichord answering it, further off; D and A under its last note, to the end of
# the chapter
play('hps', MARK(38), s17 + 0.5, 0.5, 1.3, 1.0, 'D')
play('clv', MARK(50), s17 + 2.6, 0.5, E('copy') - (s17 + 2.6 + 1.5) - 0.1, 0.9, 'D', far=1.0)
strum('hps', [38, 45], s17 + 4.1, E('copy') - (s17 + 4.1) - 0.15, 0.6, 'D', step=0.15)

# 2. Nine days, in B-flat: the faculty, a chord as the chapter turns; her request asked, typed, sent to the name on the page, and in the
#    pause her call, B-flat and F, unanswered; Jun, who only built it; Clara, ringed in gold, the owner's phrase at home; nine days
#    crossed off; Jun passes it on, the call again; had he said yes; and the page typed by hand plays the owner's phrase one note off
nw_ = lambda lid, word, off=0: W('nine', lid, word, off)
nc_ = lambda lid, off=0: G('nine', lid, off)
ne_ = lambda lid, off=0: END('nine', lid) + off
askTo, plan, goes, wait, built, clara = nw_('asks', 'asks to read'), nw_('asks', 'to plan'), nw_('waits', 'goes to'), nw_('waits', 'and waits'), nw_('built', 'only built'), nw_('since', 'is Clara')
sees, passes, yes, isnt, byHand, nobody2 = nw_('later', 'sees'), nw_('later', 'passes'), nw_('had', 'said yes'), nw_('had', "isn't"), nw_('typed', 'typed by hand'), nw_('typed', 'nobody')
n0, n2, n3, n4, n5, n6, n7, n8 = S0('nine'), askTo - 0.35, wait - 0.4, nc_('since', -0.3), nc_('later', -1.3), sees + 0.3, nc_('had', -0.3), nc_('typed', -0.3)
strum('hps', [34, 41, 46], n0 + 0.3, 1.8, 0.75, step=0.1)
paper(nc_('feb', -0.25), 0.006, -0.5, 0.3)
# her screen: she presses to ask (P.askTo + 0.05), types why (from P.plan - 0.15, over 1.3 s) and until when; it's sent to Jun (from
# P.goes - 0.15), and in the pause after the line, her call, unanswered
tap(askTo + 0.1, 0.010, px(700)); keys(plan - 0.15, 1.3, 0.006, px(700)); keys(plan + 1.35, 0.5, 0.005, px(700))
air(goes - 0.15, 0.6, 0.008, 0.3); tap(goes - 0.1, 0.007, px(900))
play('hps', CALL, ne_('waits', 0.12), 0.45, 1.8, 0.85)
# the data team's room: Jun on the phone, her request in the pile at his elbow (lit from n3 + 0.4); he only built the table
pat(built + 0.05, 0.008, px(1050))
# Planning's room: the product's card, its owner, Clara, ringed in gold (from P.clara - 0.1): the owner's phrase, at home
marker(clara - 0.1, 0.009, px(600), 0.7)
play('hps', OWNER, clara + 0.15, 0.36, 1.3, 0.9)
pat(n4 + 0.6 + 0.2, 0.007, px(910))
# nine days later: the faculty's calendar, the days crossed off one by one (from n5 + 0.3, 0.17 s apart), the day he sees it ringed
for k in range(9):
    pencil(n5 + 0.3 + 0.17 * k, 0.007 if k < 3 else 0.004, px(700 + 80 * (k % 7)), 0.12)
marker(sees - 0.25, 0.008, px(960), 0.5)
# Jun finds her request, and passes it on (the card flies from P.passes - 0.1, over 0.9 s, to Clara); in the pause, the call again,
# still unanswered, from across the room
paper(n6 + 0.3, 0.007, px(1330), 0.3); air(passes - 0.1, 0.9, 0.009, 0.6)
play('hps', CALL, ne_('later', 0.15), 0.45, 1.5, 0.75, pan=0.35)
# had he said yes: his hand on "approve" (from P.yes - 0.3), a gold "no" across it (from P.isnt - 0.1)
sleeve(yes - 0.3, 0.005, 0.2, 0.6); strike(isnt - 0.1, 0.010, 0.0, 0.8)
# the page, close: typed by hand (P.byHand - 0.1), and nobody kept it in step (amber from P.nobody - 0.1); in the pause, the page's
# copy of the owner's phrase, one note off: it ends on C
tap(byHand - 0.05, 0.006, px(700)); tap(byHand + 0.1, 0.005, px(700))
play('clv', up(OFF), ne_('typed', 0.12), 0.32, 1.2, 0.95, pan=0.3, far=1.0)

# 3. Seven places: Sam at the platform's desk, the page's owner line; Sam walks into Yusuf's office; seven blank cards laid on his desk,
#    each written as it's named, and each a note, the B-flat scale from its first note to its seventh; a gold "owner" on three: the
#    owner's phrase at home, and the catalogue's copy of it; and as one has drifted, the platform's copy, one note off
sw_ = lambda lid, word, off=0: W('seven', lid, word, off)
sc_ = lambda lid, off=0: G('seven', lid, off)
se_ = lambda lid, off=0: END('seven', lid) + off
wants, right, more, no = sw_('sam', 'and wants'), sw_('sam', 'the right'), sw_('more', 'more than'), sw_('drift', 'no longer')
t0_, t2, t3, t4 = S0('seven'), wants - 0.25, sc_('asks', -0.3), sc_('counts', -0.35)
pat(t0_ + 0.9 + 0.2, 0.006, px(500))
marker(right, 0.008, px(780), 0.5); sleeve(right - 0.5, 0.004, -0.3, 0.6)
walk(t3 + 0.1, 1.64, 0.007, px(60), px(520))
K7 = ['arch', 'gloss', 'docs', 'repo', 'platform', 'cat', 'tracker']
DK = [460, 900, 1330, 1720, 460, 900, 1330]  # each card's middle on the desk
for i in range(7):
    pat(t4 + 0.3 + 0.2 * i + 0.35, 0.008 if i < 3 else 0.005, px(DK[i]))
for i, k in enumerate(K7):
    a = sc_(k, 0.1); pen(a, 0.006, px(DK[i]), max(1.6, se_(k, 0.4) - a) * 0.85)
    hps(SEVEN[i], a + 0.05, 1.0, 0.85, pan=px(DK[i], 0.8))
# a gold "owner" on three cards (from P.more - 0.1): the repository's, the platform's and the catalogue's; the owner's phrase at its
# home; in the pause, the catalogue's copy; and as one copy no longer matches (P.no), the platform's, one note off, left unresolved
for i in (3, 4, 5):
    pat(more - 0.1 + 0.3, 0.006, px(DK[i]))
play('hps', OWNER, more + 0.1, 0.3, 0.9, 0.85, pan=px(1720, 0.6))
play('clv', up(OWNER), se_('more', 0.1), 0.3, 0.8, 0.85, pan=px(900, 1.2), far=1.0)
play('clv', up(OFF), no + 0.1, 0.3, 1.3, 0.85, pan=px(460, 1.2), far=1.0)

# 4. One home each: Noor pins the seven places on her map, and they land on it, close; one rule, B-flat: the octave Yusuf's seven didn't
#    reach; every other place keeps a copy, the rule's chord copied, further off; a product's owner at home, and its two copies: the
#    catalogue's in tune, the platform's page one note off; as with the annals, the sealed chest, the hand stopped, the bare fifth; a fix
#    goes to its home, and the copy follows, note for note
hw_ = lambda lid, word, off=0: W('home', lid, word, off)
hc_ = lambda lid, off=0: G('home', lid, off)
he_ = lambda lid, off=0: END('home', lid) + off
asApp, oneRule, oneHome, anOwner, keepsW, came = hw_('puts', 'as an application'), hw_('rule', 'one rule'), hw_('every', 'one home'), hw_('every', 'an owner'), hw_('other', 'keeps a copy'), hw_('other', 'came from')
lives, copyIt, pf, nobody4, itsHome, follows = hw_('owner', 'lives in'), hw_('copyit', 'copy it'), hw_('copyit', 'the platform'), hw_('annals', 'nobody'), hw_('fix', 'its home'), hw_('fix', 'follows')
h0, h2, h3, h4, h5, h6, h7 = S0('home'), asApp - 0.3, hc_('rule', -0.3), hc_('other', -0.3), hc_('owner', -0.3), hc_('annals', -0.3), hc_('fix', -0.3)
for i in range(7):
    pin(h0 + 0.6 + 0.3 * i + 0.3, 0.010 if i < 3 else 0.005, px(250 + 140 * i))
for i in range(3):
    pat(h2 + 0.1 + 0.16 * i + 0.3, 0.006, px(330 + 500 * i))
# the rule, on a card laid over the map (from P.oneRule - 0.2): B-flat, the octave the seven places didn't reach, and in the pause the
# chord of the rule; its rows, piece by piece (each home a small house, from P.oneHome - 0.1, 0.22 s apart)
pat(oneRule, 0.010, 0.0); slide(oneRule - 0.15, 0.008, 0.0, 0.4)
hps(46, oneRule + 0.05, 1.2, 0.9)
strum('hps', [34, 41, 46, 50], he_('rule', 0.08), hc_('every', -0.2) - he_('rule', 0.08), 0.8, step=0.09)
for i in range(4):
    knock(oneHome - 0.1 + 0.22 * i + 0.2, 0.006 if i < 2 else 0.004, px(470 + 290), 300)
# every other place keeps a copy, dashed (P.keeps): the rule's chord on the clavichord, further off; each says where it came from
# (from P.came - 0.1, 0.2 s apart), in pencil
strum('clv', [46, 50, 53], keepsW + 0.05, 1.2, 0.85, step=0.08, far=1.2)
for i, vx in enumerate((805, 805, 1265)):
    pencil(came - 0.1 + 0.2 * i + 0.1, 0.006, px(vx), 0.3)
# a product's owner, at home in the repository (lit at P.lives): the owner's phrase; the catalogue and the platform's page copy it
# (from c.copyit - 0.1): in the pause, the catalogue's copy in tune, and the platform's page, typed by hand, one note off
play('hps', OWNER, lives + 0.05, 0.32, 1.0, 0.85, pan=px(480, 0.6))
paper(hc_('copyit', -0.1), 0.006, px(1440), 0.4); tap(pf + 0.6, 0.005, px(1440))
play('clv', up(OWNER), he_('copyit', 0.06), 0.28, 0.9, 0.85, pan=px(1440, 1.2) - 0.25, far=1.0)
play('clv', up(OFF), he_('copyit', 0.62), 0.28, 0.8, 0.8, pan=px(1440, 1.2) + 0.1, far=1.3)
# as with the annals: the sealed chest, the hand that reaches (from s6 + 0.2, over 1.1 s) and stops, and the bare fifth; drawn back
sleeve(h6 + 0.2, 0.007, 0.6, 0.9); sleeve(nobody4 + 0.3, 0.005, 0.6, 1.0)
strum('hps', [38, 45], h6 + 1.35, 2.0, 0.75, 'D', step=0.0)
# a fix goes to its home: a pen at the map's definitions (from P.itsHome - 0.3): two notes at home, C rising to D; the light runs out to
# the glossary's copy (from P.itsHome - 0.2, over 1.1 s), and it follows, note for note, green (from P.follows - 0.1)
pen(itsHome - 0.3, 0.006, px(420), 0.9)
play('hps', [36, 38], itsHome - 0.2, 0.3, 1.0, 0.85)
play('clv', [48, 50], itsHome + 0.95, 0.3, 1.0, 0.85, pan=px(800, 1.2), far=1.0)

# 5. One way: on Noor's map each flow is drawn as it's named, and played forward: the home's note on the harpsichord as it leaves, and
#    the copy's, an octave up, on the clavichord as the arrow reaches it; the tools that read the glossary, copies of a copy, further
#    off; a learner and an award slide down to the tables, a column's class along to the platform; the arrow drawn back is stopped,
#    on the clavichord's note, unanswered; and a copy is never a home: in the pause, the chord
yw_ = lambda lid, word, off=0: W('way', lid, word, off)
yc_ = lambda lid, off=0: G('way', lid, off)
ye_ = lambda lid, off=0: END('way', lid) + off
defGo, uW = yw_('defs', 'go from'), [yw_('tools', s) for s in ('the data team', 'the dashboards', 'the assistant')]
cMap, learner, award, clGo, prGo, backW = yw_('concepts', 'concepts'), yw_('concepts', 'a learner'), yw_('concepts', 'an award'), yw_('class', 'goes from'), yw_('promise', 'goes from'), yw_('back', 'back')
FLOW = [(defGo, 1.0, 41, (518, 632)), (cMap, 0.9, 34, (330, 330)), (clGo, 0.8, 38, (518, 632)), (prGo, 1.4, 41, (518, 1265))]
for t0, d, m, (xa, xb) in FLOW:
    hps(m, t0 + 0.02, 0.8, 0.85, pan=px(xa)); pencil(t0, 0.005, px(xa), d)
    clv(m + 12, t0 + d, 0.8, 0.85, pan=px(xb, 1.3), far=1.0)
for i, t0 in enumerate(uW):
    clv(53, t0 - 0.1, 0.6, 0.6, pan=px(1265, 1.3) + 0.1 * (i - 1), far=1.8); pencil(t0 - 0.7, 0.004, px(1035), 0.6)
air(learner, 1.5, 0.004, px(330)); air(award, 1.5, 0.004, px(330))
pat(clGo + 1.7, 0.006, px(632))
# nothing flows back: the arrow drawn back from the platform (from c.back + 0.1, over 0.9 s): the copy's note, C, and no answer; Noor
# stops it, struck through (from P.back + 0.1), and the note is stopped with it
clv(48, yc_('back', 0.1), backW + 0.15 - yc_('back', 0.1), 0.8, pan=px(632, 1.3), far=1.0)
strike(backW + 0.1, 0.010, px(575), 0.5)
# a copy is never a home: each copy's chip glows (from c.never + 0.1); in the pause, the home's chord, and the copies' under it
strum('hps', [34, 41, 50], ye_('never', 0.08), E('way') - 0.15 - ye_('never', 0.08), 0.8, step=0.1)
strum('clv', [46, 53], ye_('never', 0.5), E('way') - 0.15 - ye_('never', 0.5), 0.7, step=0.1, far=1.4)

# 6. Found by a check: night on the floor; someone types into the platform's page in the dark; a sync stops, its light out; every
#    night the check walks each flow, a single clavichord note at each copy, even and slow; the first night it finds the old owner's
#    name on the table's page, and two more: three times the home's note, and the copy's, a note off; by morning, as the light comes
#    up, each put right, a click as each name changes, and a note to each owner; the morning's sheet pinned on Yusuf's board. As the
#    historians climbed: the books aired, a rising note as each rack fills, and what he found written down. Here a check does it every
#    night: a light going from room to room, a note in each
kw_ = lambda lid, word, off=0: W('check', lid, word, off)
kc_ = lambda lid, off=0: G('check', lid, off)
ke_ = lambda lid, off=0: END('check', lid) + off
types, stops, everyN, old, pageW, twoW, rightW, tells, wrote = kw_('drift', 'if someone'), kw_('drift', 'a sync stops'), kw_('night', 'every night'), kw_('first', 'the old owner'), kw_('first', "the table's"), kw_('first', 'two more'), kw_('morning', 'right by'), kw_('morning', 'tells each'), kw_('climbed', 'wrote down')
k2, k3, k4, k5, k6, k7, k8 = types - 0.3, stops - 0.4, kc_('night', -0.3), kc_('finds', -0.3), kc_('climbed', -0.3), wrote - 0.3, kc_('here', -0.3)
keys(k2 + 0.3, 1.0, 0.006, px(820))
tap(stops + 0.4, 0.006, px(560)); tap(stops + 0.75, 0.004, px(560))
# the walk: each flow in turn (from P.every - 0.3, 0.62 s apart), and the copy at its end lit as the light reaches it (0.5 s on): a
# single clavichord note there, the copy's note from the chapter before, in tune
WALK = [(53, 632), (53, 1092), (53, 1092), (53, 1092), (46, 330), (50, 632), (53, 1265)]
for i, (m, vx) in enumerate(WALK):
    clv(m, everyN - 0.3 + 0.62 * i + 0.5, 0.45, 0.75 if i < 5 else 0.65, pan=px(vx, 1.2), far=1.2)
# the first night: once more along to the platform's page, where it stops (amber from P.old - 0.1); its page and two more on the
# platform's screen (from P.page, and P.two + 0.1, 0.35 apart): each time the home's B-flat, and the copy's note, a note off
for i, t0 in enumerate((old - 0.1, twoW + 0.1, twoW + 0.45)):
    hps(34, t0 - 0.05, 0.7, 0.7, pan=-0.3); clv(48, t0 + 0.2, 0.7, 0.8, pan=px(820 if i == 0 else 1100, 1.2), far=1.0)
pat(pageW, 0.006, px(960))
# by morning, the light coming up (from c.morning - 0.3): each name put right, a click as it changes (from P.right - 0.1, 0.35 s
# apart), and the copy's note in tune; a note to each owner (from P.tells - 0.1, 0.3 apart)
for i in range(3):
    click(rightW - 0.1 + 0.35 * i + 0.1, 0.008, px(1300)); clv(46, rightW - 0.1 + 0.35 * i + 0.12, 0.6 if i < 2 else 1.2, 0.8, pan=px(1100, 1.2), far=1.0)
    pat(tells - 0.1 + 0.3 * i + 0.25, 0.005, px(1500))
# the morning: Yusuf's board, the night's sheet, three put right, pinned (from c.finds + 0.4)
pin(kc_('finds', 0.55), 0.010, px(1030)); paper(kc_('finds', 0.45), 0.006, px(1030), 0.3)
# as the historians climbed to each archive: the books on their racks (each rack full from s6 - 0.2, 0.4 apart): D major, a rising
# note as each fills; and what he found, written down: the figure's start, at home
for i, m in enumerate((50, 54, 57, 62)):
    t0 = max(k6 + 0.05, k6 - 0.2 + 0.4 * i); books(t0, 0.006, px((960, 1400, 940, 1420)[i])); clv(m, t0, 0.5 if i < 3 else 1.0, 0.7, 'D', far=1.0)
writing(k7 + 0.2, k8 - k7 - 0.4, 0.006, 0.0)
play('hps', HOMEMAJ[:3], k7 + 0.3, 0.45, 1.0, 0.85, 'D')
# here, a check does it every night: the floor in the dark, a light going from room to room (from s8 + 0.5, 0.5 s apart): a single
# clavichord note in each, in tune
for i, m in enumerate((46, 50, 53, 50, 46)):
    clv(m, k8 + 0.5 + 0.5 * i + 0.1, 0.45 if i < 4 else 1.2, 0.7, pan=px(260 + 350 * i, 1.1), far=1.2)

# 7. Theirs to change: the floor by day, each team at its own screens; the planner's next request, sent straight to Clara, her call, and
#    this time the answer, the owner's phrase, as she approves it; the plan for the next series, six cards, six notes rising; the annals
#    lasted: the figure at home, in D major, and the reader's copy; one home for every piece: the owner's phrase at home, and every copy
#    of it in tune; the same page on every screen, the same note in each; the request reaches the one who decides; the end card, the mark
vw_ = lambda lid, word, off=0: W('theirs', lid, word, off)
vc_ = lambda lid, off=0: G('theirs', lid, off)
ve_ = lambda lid, off=0: END('theirs', lid) + off
straight, decides, series, eachOf, everyC, oneHomeT, sameW, requestW = vw_('next', 'goes straight'), vw_('next', 'decides'), vw_('plan', 'the next series'), vw_('plan', 'each of its'), vw_('lasted', 'every copy'), vw_('give', 'one home'), vw_('reads', 'the same'), vw_('reads', 'every request')
v0, v3, v5, v6, v7, v8, v9 = S0('theirs'), vc_('next', -0.3), vc_('plan', -0.3), vc_('lasted', -0.3), everyC + 0.6, vc_('give', -0.3), vc_('reads', -0.3)
for i in range(5):
    tap(v0 + 0.3 + 0.2 * i + 0.1, 0.005 if i < 2 else 0.003, px(260 + 350 * i))
# the planner's next request: the page names Clara now; she presses to ask (c.next + 0.2), it goes straight to Clara (from
# P.straight - 0.2), her call; Clara approves it (P.decides + 0.1): the owner's phrase answers it, and comes home to B-flat
tap(vc_('next', 0.25), 0.009, px(700)); air(straight - 0.2, 0.6, 0.008, 0.3)
play('hps', CALL, straight - 0.1, 0.42, 0.8, 0.75)
pat(decides + 0.15, 0.008, px(1400))
play('hps', [53, 50, 46], decides + 0.2, 0.34, 1.6, 0.85, pan=0.15)
# the plan for the next series: its card over the dimmed map (from P.series + 0.1), and six cards, one for each part its films build
# (from P.eachOf, 0.28 s apart): six notes rising, from B-flat to G, low
pat(series + 0.25, 0.008, 0.0)
for i in range(6):
    hps(SEVEN[i], eachOf + 0.28 * i + 0.05, 0.32 if i < 5 else 1.0, 0.8, pan=-0.5 + 0.2 * i)
    pat(eachOf + 0.28 * i + 0.25, 0.005, px(400 + 560 * (i % 3)))
# the annals lasted: the long shelf, the figure at home, in D major; and a reader today, at her screen: the copy, note for note
play('hps', HOMEMAJ, v6 + 0.35, 0.45, 0.9, 0.85, 'D')
play('clv', up(HOMEMAJ[:3]), v7 + 1.3, 0.24, 0.9, 0.8, 'D', pan=px(1220), far=0.8)
# one home for every piece: the map, every flow lit (from P.oneHome - 0.2), the platform's page green now (from s8 + 0.3); the owner's
# phrase at home, and its copies, the catalogue's and the platform page's, both in tune
click(v8 + 0.35, 0.007, px(560))
play('hps', OWNER, oneHomeT - 0.1, 0.3, 1.0, 0.85, pan=px(480, 0.6))
play('clv', up(OWNER), oneHomeT + 0.85, 0.3, 0.9, 0.8, pan=0.45, far=1.0)
play('clv', up(OWNER), oneHomeT + 1.15, 0.3, 0.9, 0.7, pan=0.1, far=1.4)
# everyone reads the same thing: the same page on every screen on the floor (from P.same - 0.2, 0.12 s apart), the same note in each;
# and a request flies to the one who decides (from P.request, over 1.3 s), and comes home
for i in range(5):
    clv(50, sameW - 0.2 + 0.12 * i + 0.1, 0.8 if i < 4 else 1.3, 0.55, pan=px(260 + 350 * i, 1.1), far=1.2)
air(requestW, 1.3, 0.008, -0.2)
hps(46, requestW + 1.3, 1.4, 0.8, pan=-0.5)
# the end card, and the mark: the harpsichord, then the clavichord answering it, further off; B-flat and F under its last note, to the end
end = vc_('breath', 0.2)
play('hps', MARK(34), end + 0.45, 0.5, 1.3, 1.0)
play('clv', MARK(46), end + 2.5, 0.5, TOT - (end + 2.5 + 1.5), 0.9, far=1.0)
strum('hps', [34, 41], end + 4.0, TOT - (end + 4.0), 0.6, step=0.15)
# the rooms; and as the noises' filters have soft edges, last of all the whole score is low-passed, to keep everything under the voice
# below about 2.5 kHz
room()
soften(2500)
