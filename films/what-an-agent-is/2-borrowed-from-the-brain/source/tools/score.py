# Borrowed from the brain: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 4 November 2026 against every score.py on main and on every branch, both series' palettes and the site's
# list of instruments: an Aeolian harp and a toy piano, both made here (music.py has neither).
#  - The Aeolian harp is nature's. A long box of strings, all tuned to one note, is set in an open window, and the wind plays it: no
#    hand touches it. The wind picks which harmonic of the strings speaks, a stronger gust a higher one, so its notes are the strings'
#    harmonics, whole-number multiples of one pitch, in tune with each other by nature: nothing beats. They swell in with a gust and
#    fade as it drops, slowly and once each: nothing trembles. A harp in name only: never plucked, it sounds as harmonics breathing in
#    and out with a faint hush of wind, unlike the site's harps and zither. Nature trying out designs is the wind trying harmonics, a
#    few at a time, and keeping the ones that sound.
#  - The toy piano is the units people built: a small copy of a piano that took its keys but not its strings. A hammer strikes a
#    metal rod, the note rings for a moment, with the rod's own clang a little above it, and it's gone. Played low in its range, with
#    its thunk, so it doesn't sound like the site's celesta or music box.
#  - The film's mark: the wind sounds a note, and the toy piano strikes the same note, short. The idea borrowed, not the living thing
#    (the unit "modelled on a nerve cell", the brothers' twist, the title, McCulloch and Pitts's unit, "an idea, not a brain", the
#    end card). A connection that grows stronger is one harmonic swelling, slowly (in a nerve cell, in the sea slug, in Hebb's cells).
#    A nerve impulse is a soft, low tock, as a lab's loudspeaker plays one, always the same: all or nothing. Each word the model draws
#    is a toy note, the same note for the same word all through (dancing E, buzzing C sharp, waggling G sharp, singing an F, wrong).
#  - E major, tuned pure from E; C-sharp minor for the opening's problem (the harmonics 10, 12 and 15 of a string on A, a minor
#    chord the wind can sound). The wind's strings are tuned to E for home, A and B for the turns.
# The rules the series keeps (its briefs, 3 November 2026, and the author's review of 4 November 2026):
#  - Music only from time to time: under the opening story (Why look to nature, and A thicket to the title), and after it only at a
#    chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks it.
#  - Nothing trembles, pulses or beats: every chord is the harmonics of one string's pitch, or notes tuned pure (just intonation, see
#    hz()), the toy's notes are gone within two seconds, and no urgent pulse: the film's turns are a picture made and a guess, not a
#    rush (film.json lists no urgent chapter). No figure is played again soon after itself.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
#  - Everything low and soft, below about 2.5 kHz; each held note keeps its own level in its room (PLAYBOOK, *Set a room's echo*).

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, math as _math, pathlib as _pl
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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
def jhash(n, s=0):
    """the engine's hash() (core.js), so a sound can fall where the picture's own randomness puts a mark"""
    x = _math.sin(n * 127.1 + s * 311.7) * 43758.5453123
    return x - _math.floor(x)
R1 = np.random.default_rng(1888)  # this film's own randomness: the rooms, the wind, the rods

# ---- tuning: just intonation from E, so a chord's notes are whole-number ratios of each other and nothing beats. The harp's strings are
# tuned to E, A or B, whose harmonics 1 to 6, 8, 10, 12 and 15 all fall on this table; the 9th is played only on E (on B it would sit
# a comma off the table's C sharp)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (40, 82.4069)  # E 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
E1, A1, B1, A0 = 28, 33, 35, 21   # the strings' own notes: E 1, A 1, B 1 and A 0 (MIDI)
def note_of(f):
    """the toy piano's key for a pitch the harp sounds (they must be the same note exactly)"""
    m = int(round(69 + 12 * np.log2(f / 440.0)))
    assert abs(hz(m) - f) < 0.01, 'no key at %.2f Hz' % f
    return m
# the toy's keys, by name: the words the model draws keep their notes all through
E4, F4, Fs4, Gs4, A4, B4, Cs4, Ds4, B3, E5 = 64, 65, 66, 68, 69, 71, 61, 63, 59, 76
DANCING, BUZZING, WAGGLING, SINGING = E4, Cs4, Gs4, F4

# ---- the levels: the harp's strings about as far under the voice as the series' other held music (matched by loudness, not by peak),
# the toy's notes a little above them, as 1.5's plucked strings sit over its bowed ones; the effects about 12 dB under the music (FX
# scales them all)
HL, TL, FX = 0.034, 0.100, 1.3

# ---- the rooms. Each is an echo made of noise that dies away, low-passed; its level is set by what it rings where the notes are (its
# gain there about one), and a held note is set back to its own level after it (PLAYBOOK: a pure note where the room's reflections
# cancel it came out up to 20 dB quieter than the rest). The window's room, round the harp, rings for about two seconds; the toy's,
# a small one on a table, for about half a second
def _ir(sec, lo):
    x = np.arange(int(sec * SR)) / SR; h = filt((R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32), 'low', lo)
    h[:int(0.018 * SR)] = 0; return h / np.sqrt((h ** 2).sum() * SR / (2 * lo))
_IRW, _IRT = _ir(2.0, 1600), _ir(0.45, 2000)
def _room(s, room, ir):
    if not room:
        return s
    return np.pad(s, (0, len(ir) - 1)) + room * fftconvolve(s, ir).astype(np.float32)
def _held(s, room, a, b):
    """a held note in its room, at its own level: set back to the level it had before the room, measured over its body (a to b s)"""
    r = _room(s, room, _IRW); i, j = int(a * SR), max(int(a * SR) + 1, int(b * SR))
    return r * float(np.sqrt((s[i:j] ** 2).mean() / max(1e-12, (r[i:j] ** 2).mean())))

# ---- the Aeolian harp: one string sounding one harmonic while the wind holds it. The wind's edge on a string is nearly pure, with a
# trace of the string's own octave and twelfth above it, which speak a little after it and fade a little before it; a faint hush of
# wind on the strings; one slow swell over a long note, once
def gust(f, a, b, g=1.0, att=1.2, rel=2.2, pan=0.0, room=0.4):
    """a string sounding the pitch f (a harmonic of its own note) from a to b: it swells in over att as the gust reaches it, holds
    steady, and fades over rel as the wind drops"""
    sec = max(0.3, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    on = lambda k: np.sin(0.5 * np.pi * np.minimum(x / (att * k), 1)) ** 2
    off = lambda k: np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / (rel / k), 1)) ** 2, 1.0)
    s = (np.sin(2 * np.pi * f * x + R1.uniform(0, 6.28)) * on(1) * off(1)
         + 0.14 * np.sin(2 * np.pi * 2 * f * x + 0.6) * on(1.3) * off(1.4) + 0.035 * np.sin(2 * np.pi * 3 * f * x + 1.3) * on(1.6) * off(1.8))
    if sec >= 1.6:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    hush = filt(noise(n / SR + 0.01)[:n], 'band', (260, 1100)) * 0.08 * on(0.7) * off(1)
    s = filt((s + hush).astype(np.float32), 'low', 2400)
    body = (min(att, sec * 0.6), sec) if sec - att > 0.3 else (sec * 0.3, sec + 0.1)
    put(_held(s, room, *body).astype(np.float32), a, g * HL, pan)
def harp(root, ns, a, b, g=1.0, lag=0.25, att=1.2, rel=2.2, fall=0.1, spread=0.22):
    """the strings tuned to root (a MIDI note), sounding the harmonics ns together from a to b: the gust reaches each a moment after
    the one before (lag), the higher ones a little softer (fall); they sit a little apart across the window (spread)"""
    f0 = hz(root)
    for i, k in enumerate(ns):
        gust(f0 * k, a + lag * i, b, g * (1 - fall * min(i, 4)), att=att, rel=rel, pan=spread * (i / max(1, len(ns) - 1) * 2 - 1) if len(ns) > 1 else 0.0)

# ---- the toy piano: a felt-tipped hammer strikes a rod, clamped at one end. The rod rings at its note, with its own clang, a little
# over six times higher (a clamped rod's second mode, 6.27 times its first), which dies within a fifth of a second; the hammer's thunk,
# and the little case's wooden knock. A low note rings longer than a high one. The signal stays under two seconds, room and all
def toy(m, s, g=1.0, pan=0.0, room=0.25):
    f = hz(m); sec = 1.45; x = tt(sec).astype(np.float64)
    d = 0.5 * (330 / f) ** 0.4
    rod = np.sin(2 * np.pi * f * x) * np.exp(-x / d)
    if 6.267 * f < 2500:
        rod = rod + 0.3 * np.sin(2 * np.pi * 6.267 * f * x + 0.4) * np.exp(-x / (0.15 * d))
    thunk = 0.12 * filt(noise(sec)[:len(x)], 'band', (140, 900)) * np.exp(-x / 0.008) + 0.06 * np.sin(2 * np.pi * 190 * x) * np.exp(-x / 0.03)
    sig = (rod * np.minimum(1, x / 0.0015) + thunk) * np.where(x > sec - 0.12, np.cos(0.5 * np.pi * np.minimum((x - (sec - 0.12)) / 0.12, 1)) ** 2, 1)
    sig = norm(filt(sig.astype(np.float32), 'low', 2600))
    put(_room(sig, room, _IRT).astype(np.float32), s, g * TL, pan)
def run(s, notes, step, g=0.6, pan=0.0):
    """toy notes one after another, step seconds apart"""
    for i, m in enumerate(notes):
        toy(m, s + step * i, g, pan)

# ---- the mark: the wind sounds a harmonic of its strings, and the toy strikes the same note, short
def borrow(root, k, s, hold=2.6, g=0.8, gt=0.7, at=0.9, pan=0.0, att=0.8, rel=1.8):
    f = hz(root) * k
    gust(f, s, s + hold, g, att=att, rel=rel)
    toy(note_of(f), s + at, gt, pan)

# ---- soft sounds, all below about 2.5 kHz and low: each kind at its own level
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled tap: a small thing set in place"""
    s_tap(s, g * FX, pan)
def impulse(s, pan=0.0):
    """a nerve impulse, as a lab's loudspeaker plays one: a soft, low tock, always the same (all or nothing)"""
    s_knock(s, 0.020 * FX, pan, 170); s_tap(s + 0.003, 0.008 * FX, pan)
def paper(s, g=0.016, pan=0.0, sec=0.5):
    """a sheet of paper laid down, or sliding over another: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pen(s, g=0.010, pan=0.0, sec=1.2):
    """a pen drawing on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0, lo=140, hi=900):
    """something moving through the air, or water: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def whirr(s, sec=0.6, g=0.010, pan=0.0):
    """the small motors that turned the perceptron's dials: a low hum, rising a little as it turns"""
    x = tt(sec).astype(np.float64); ph = 2 * np.pi * np.cumsum(110 + 30 * x / sec) / SR
    sig = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * np.sin(np.pi * x / sec) ** 2
    X(filt(sig.astype(np.float32), 'low', 700), s, g * FX, pan)
def spin(s, d, g=0.010, pan=0.0):
    """the wheel of chances spinning down: a soft wooden whirr that slows and stops, with a knock as it lands"""
    x = tt(d).astype(np.float64); u = x / d
    sig = filt(noise(d)[:len(x)], 'band', (180, 900)) * np.minimum(1, x / 0.06) * (1 - u) ** 1.6
    X(sig.astype(np.float32), s, g * FX, pan); knock(s + d, 0.014, pan, 230)
def hum(s, sec, g=0.006, pan=0.0, f=225):
    """a honeybee's wings as it flies in: a soft, round hum, low-passed, falling a little as it slows to land"""
    x = tt(sec).astype(np.float64); ph = 2 * np.pi * np.cumsum(f - 12 * x / sec) / SR
    sig = sum(np.sin(k * ph) / k ** 1.3 for k in range(1, 5)) * np.sin(np.pi * np.minimum(x / sec, 1)) ** 1.5
    X(filt(sig.astype(np.float32), 'low', 800), s, g * FX, pan)

# =============================================================================================================================
# 1. Why look to nature: the opening, with music all through. Washington, 1958: the perceptron's three trials, a toy note for each
#    guess, E when it's right, F when it's wrong, and its dials' small motors as its numbers move. "He modelled it on a nerve cell":
#    the harp's first notes, E and B, as the cell is drawn in ink, and the toy strikes the B as the unit is drawn from it (the mark).
#    "Why look to nature?": F sharp, open. Nature trying out designs: the wind tries harmonics, high and brief, one after another, as the
#    lines that don't last are drawn; "keeping the ones that work": E, G sharp and B settle, one for each design kept. Birds: the
#    strings on A, and a gust (A, high) as the wingtips twist; the brothers' glider: the toy strikes the C sharp the wind holds. The
#    maple seeds: the strings on B, a breath of air for each seed spinning down. "The only working example: a brain": E major, full,
#    as it lights; "nobody could see how a brain was wired": the chord thins to its fifth
nw = lambda lid, word, off=0: W('nature', lid, word, off)
nc = lambda lid, off=0: G('nature', lid, off)
# bb_trial: from "showed a program" + 0.2, 1.75 s a trial; the guess shows at 0.36 of a trial, its numbers move at 1.62 trials
t0 = nw('start', 'showed a program', 0.2)
toy(E4, t0 + 0.63, 0.6, px(820)); toy(F4, t0 + 1.75 + 0.63, 0.55, px(820)); whirr(t0 + 1.75 * 1.62, 0.55, 0.009, px(820))
toy(E4, t0 + 3.5 + 0.63, 0.6, px(820))
# the nerve cell in ink, the arrow, and the unit drawn from it
gust(hz(E1) * 4, nc('cell', -0.2), nc('trying', -0.6), 0.8, att=1.6, rel=1.6, pan=-0.15)
gust(hz(E1) * 6, nc('cell', 0.3), nc('trying', -0.6), 0.65, att=1.6, rel=1.6, pan=0.15)
toy(B3, nw('cell', 'modelled it', 0.6), 0.55, px(1290))
gust(hz(E1) * 9, nc('why', 0.1), nc('trying', -0.5), 0.45, att=0.9, rel=1.4)
# the page turns; nature's trials: the wind tries harmonics as the lines that don't last are drawn, then keeps three
paper(nc('trying', -0.5), 0.014, px(1300), 0.9)
for k, off in ((10, 0.3), (12, 0.85), (9, 1.4), (15, 1.95), (8, 2.5)):
    gust(hz(E1) * k, nc('trying', 0.1) + off, nc('trying', 0.1) + off + 0.35, 0.42, att=0.3, rel=0.7)
for i, k in enumerate((4, 5, 6)):
    gust(hz(E1) * k, nw('trying', 'keeping the ones', 0.2 + 0.25 * i), nc('birds', 0.3), 0.75 - 0.08 * i, att=0.8, rel=2.2, pan=0.2 * (i - 1))
# birds: the strings on A; a gust, high, as the wingtips twist; the glider: the toy strikes the C sharp the wind holds
harp(A1, (4, 6, 5), nc('birds', -0.3), nc('seed', -0.6), 0.72, lag=0.35, att=1.4, rel=2.0)
gust(hz(A1) * 8, nw('wright', 'twisting their wingtips', -0.2), nc('twist', -0.3), 0.45, att=0.8, rel=1.4)
toy(note_of(hz(A1) * 5), nw('twist', 'built that twist', 0.1), 0.5, px(880))
# the maple's seeds: the strings on B, and a breath of air for each seed as it spins down (BB_FALL: -0.4, 0.3 and 1.4 s after "seed")
harp(B1, (4, 6, 5), nc('seed', -0.4), nc('example', -0.2), 0.62, lag=0.4, att=1.2, rel=2.0)
for ts, x in ((-0.4, 430), (0.3, 1230), (1.4, 830)):
    air(nc('seed', ts + 0.3), 1.6, 0.008, px(x), 160, 800)
# a brain, the only working example: E major as it lights; the chord thins as nobody can see how it's wired
harp(E1, (8, 10), nw('example', 'a brain', -0.4), nw('wired', 'nobody could see', 0.2), 0.62, lag=0.3, att=1.0, rel=1.8)
harp(E1, (4, 6, 5), nw('example', 'a brain', -0.6), E('nature') - 0.4, 0.7, lag=0.25, att=1.2, rel=2.2)

# 2. A thicket: the opening story, music all through, with a rest after "Something has to change". Barcelona: the open fifth on E, with
#    the window's wind; under the lens, a thicket: four harmonics close together, E, F sharp, G sharp, B; Golgi's net: one note, E,
#    held, one continuous line. The problem: C sharp minor, low, as nobody can say where a message starts, held through the ward, and
#    gone at "Something has to change". Golgi's stain: six harmonics speak one at a time, in no order, as six cells turn black, and
#    hold; "Nobody knows why": all but the F sharp fade, and it hangs. Young birds: E major, warm; the black cell whole, "like a tree in
#    winter": E, high, over it. He draws: a pen on paper for each cell. A message one way: notes rising as the spark runs in and out.
#    Berlin: "and agree", E major, full. Stockholm: the strings on A; "Golgi still defends his net": his one note again. The neuron:
#    the strings on B; the gaps he drew: E and B, soft. "Nothing to copy": the toy's F sharp, alone; the design: E, G sharp, B on the
#    toy as the signal passes each layer, over E major. The title: the mark, E struck by the toy as the wind sounds it
cw = lambda lid, word, off=0: W('cajal', lid, word, off)
cc = lambda lid, off=0: G('cajal', lid, off)
harp(E1, (4, 6, 8), cc('barcelona', -0.2), cc('thicket', -0.2), 0.62, lag=0.5, att=1.6, rel=1.8)
harp(E1, (8, 10, 9, 12), cc('thicket', -0.2), cc('net', 0.2), 0.5, lag=0.15, att=0.6, rel=1.4, fall=0.06)
gust(hz(E1) * 8, cw('net', 'Camillo Golgi', -0.2), cc('nobody', 0.8), 0.6, att=1.4, rel=1.8)
# the problem: C sharp minor, the harmonics 10, 12 and 15 of a string on A, with its C sharp low
harp(A0, (5, 10, 12, 15), cc('nobody', -0.2), END('cajal', 'change') - 0.6, 0.62, lag=0.4, att=1.6, rel=1.4, fall=0.08)
# Golgi's stain: six cells turn black, it seems at random (BB_PICK, after "turns a few cells black"), each a harmonic, in no order
PICK = (0.15, 0.95, 0.4, 1.4, 0.65, 1.15); STAIN = (10, 6, 12, 5, 9, 8)
tb = cw('stain', 'turns a few cells black')
for p, k in zip(PICK, STAIN):
    gust(hz(E1) * k, tb + p, cw('random', 'Nobody knows why', 0.2) + (2.4 if k == 9 else 0), 0.5 if k != 9 else 0.55, att=0.5, rel=1.6 if k != 9 else 2.0,
         pan=0.3 * (k - 8) / 4)
# young birds: E major, warm; the cell whole, like a tree in winter: E, high, over it
harp(E1, (4, 5, 6), cc('young', -0.2), cc('drew', 0.4), 0.66, lag=0.3, att=1.4, rel=2.0)
gust(hz(E1) * 16, cc('whole', -0.3), cc('drew', -0.6), 0.4, att=1.4, rel=1.6)
# he draws what he sees: a pen for each cell (bb_drawing: from "drew" + 0.2, "separate cells", and 0.8 s after)
for s0, sec, x in ((cc('drew', 0.2), 1.5, 760), (cw('drew', 'separate cells'), 1.5, 1060), (cw('drew', 'separate cells', 0.8), 1.3, 1400)):
    pen(s0, 0.009, px(x), sec)
# one way: in through the branches, out along one long fibre (bb_message: from "in through the branches" - 1.2, over 3.3 s)
tm = cw('oneway', 'in through the branches', -1.2)
for k, off in ((5, 0.0), (6, 1.1), (8, 1.6), (10, 2.2), (12, 3.0)):
    gust(hz(E1) * k, tm + off, tm + off + 0.6, 0.5, att=0.3, rel=1.3, pan=-0.3 + off * 0.2)
# Berlin: "and agree"
harp(E1, (4, 6, 5, 8, 10, 12), cw('berlin', 'and agree', -0.3), cc('nobel', -0.2), 0.62, lag=0.12, att=0.9, rel=1.6, fall=0.07)
# Stockholm: the strings on A; Golgi still defends his net: his one note, E
harp(A1, (4, 5), cc('nobel', -0.2), cw('nobel', 'still defends his net', -0.3), 0.6, lag=0.3, att=0.8, rel=1.6)
gust(hz(A1) * 6, cc('nobel', 0.4), cc('neuron', 0.2), 0.55, att=1.0, rel=1.6)
# the neuron, the starting point: the strings on B; today's medicines work at the gaps he drew: E and B, soft
harp(B1, (4, 6, 5), cc('neuron', -0.2), cc('medicine', 0.2), 0.6, lag=0.3, att=1.0, rel=1.8)
harp(E1, (6, 8), cc('medicine', 0.0), cc('machines', 0.3), 0.45, lag=0.6, att=1.2, rel=1.8)
# machines had nothing to copy: the toy's F sharp, alone, as the empty circle and its "?" appear
toy(Fs4, cw('machines', 'nothing to copy', -0.3), 0.5, px(1380))
# his picture gave them a design: E major, and the toy's E, G sharp and B as the signal reaches each layer (bb_net: column i lights at
# "passing one message on" - 0.3 + i / 0.95)
harp(E1, (4, 6, 5), cw('design', 'many simple cells', -0.3), cc('today', 0.6), 0.55, lag=0.3, att=1.2, rel=1.8)
tp = cw('design', 'passing one message on', -0.3)
for i, m in enumerate((E4, Gs4, B4)):
    toy(m, tp + i / 0.95, 0.5, px((560, 990, 1400)[i]))
# the title: the mark, and the chord it belongs to
br = cc('breath')
borrow(E1, 8, br - 0.3, hold=2.6, g=0.7, gt=0.6, at=0.9)
harp(E1, (4, 6), br + 0.9, E('cajal') - 1.4, 0.5, lag=0.4, att=1.0, rel=1.8)

# 3. Inside a nerve cell: E and G sharp at the turn, as the cells are drawn. Each pulse a soft tock, always the same, and nothing for the
#    signals too few to make it fire: all or nothing. The chemical messengers: a breath of air across the gap. "And connections
#    change": G sharp swells as the connection grows; Hebb's two cells fire together, a tock for each, and B joins the G sharp as the
#    link grows stronger. "Learning": E, B and E above, briefly
lw = lambda lid, word, off=0: W('cell', lid, word, off)
lc = lambda lid, off=0: G('cell', lid, off)
harp(E1, (5, 8), S0('cell') + 0.2, S0('cell') + 2.6, 0.55, lag=0.5, att=1.0, rel=1.6)
P1, P2, P3 = lw('fires', 'it fires', -0.15), lc('same', 0.5), lc('same', 1.9)
for p in (P1, P2, P3):
    impulse(p, px(600))
air(lw('gap', 'chemical messengers', 0.7), 1.2, 0.007, px(980), 200, 900)
gust(hz(E1) * 10, lc('change', 0.1), lw('hebb', 'grows stronger', 1.0), 0.5, att=1.6, rel=1.6)
gust(hz(E1) * 12, lw('hebb', 'grows stronger', -0.2), lw('hebb', 'grows stronger', 1.4), 0.42, att=1.0, rel=1.4)
for p in (lw('hebb', 'fire together', -0.6), lw('hebb', 'fire together', 1.2), lw('hebb', 'grows stronger', 0.1), lw('rabbit', 'with use', -0.6), lw('rabbit', 'with use', 0.9)):
    impulse(p, px(430)); impulse(p + 1.0, px(760))
harp(E1, (4, 6, 8), lw('learning', 'connections that change', -0.4), E('cell') + 0.2, 0.5, lag=0.25, att=0.9, rel=1.6)

# 4. Nature's trials: the strings on A at the turn, "six hundred million years". The sea slug learns: G sharp swells as its connection
#    grows, as in a nerve cell. The bee: its wings as it flies in. Colours, scents, the way home: three notes, one for each thing it
#    learns. The octopus's arms reach: a breath of water. The finch's father sings: four notes; the young one practises, near but not
#    yet his. A human brain: E major, all six strings, as it lights; the bulb, a soft click
aw = lambda lid, word, off=0: W('animals', lid, word, off)
ac = lambda lid, off=0: G('animals', lid, off)
harp(A1, (4, 6), S0('animals') + 0.2, aw('long', 'six hundred million', 0.8), 0.55, lag=0.6, att=1.2, rel=1.8)
air(aw('jelly', 'catch food', -0.3), 1.6, 0.006, px(980), 100, 500)
gust(hz(E1) * 10, aw('kandel', 'its connections change', -0.3), aw('kandel', 'its connections change', 2.0), 0.45, att=1.2, rel=1.6, pan=px(1580))
hum(ac('bee', -0.4), 2.7, 0.006, px(1250))
for word, k in (('colours', 6), ('scents', 8), ('the way home', 10)):
    gust(hz(E1) * k, aw('dance', word, -0.1), aw('dance', word, 0.5), 0.42, att=0.25, rel=1.2, pan=px({'colours': 330, 'scents': 600, 'the way home': 900}[word]))
air(aw('octopus', 'each arm', -0.3), 1.6, 0.007, px(820), 120, 600)
# the finch's father sings (from "from its father" - 0.4), and the young one practises (from "practising" - 0.2), not yet his song
tf, ty = aw('finch', 'from its father', -0.3), aw('finch', 'practising', -0.1)
for i, k in enumerate((12, 10, 12, 16)):
    gust(hz(E1) * k, tf + 0.32 * i, tf + 0.32 * i + 0.22, 0.4, att=0.12, rel=0.6, pan=px(760))
for i, k in enumerate((12, 9, 12, 15)):
    gust(hz(E1) * k, ty + 0.36 * i, ty + 0.36 * i + 0.2, 0.34, att=0.12, rel=0.6, pan=px(1240))
harp(E1, (4, 5, 6, 8, 10, 12), aw('human', 'eighty-six billion', -0.3), ac('watts', 0.6), 0.55, lag=0.16, att=1.0, rel=2.0, fall=0.08)
tap(aw('watts', 'twenty watts'), 0.010, px(1600))

# 5. Filling the gaps: no music under the eye; at the hole, a chord with a string missing, E, G sharp, E, G sharp (its B silent), and
#    as the brain fills it in, the B swells into it
gw = lambda lid, word, off=0: W('gaps', lid, word, off)
harp(E1, (4, 5, 8, 10), gw('never', 'a hole there', -0.5), E('gaps') - 1.4, 0.5, lag=0.2, att=0.8, rel=1.2, fall=0.06)
gust(hz(E1) * 6, gw('never', 'fills it in', -0.1), E('gaps') - 1.4, 0.62, att=1.2, rel=1.2)

# 6. Borrowed, not copied: the mark as McCulloch and Pitts draw Cajal's cell as a unit, the wind's B and the toy's B. Three inputs
#    arrive, a tap each; it fires: a toy note. The weights nudged: the small motors again. The cat's cell fires for the edge at its
#    angle: a few soft tocks where the spikes are drawn. The layers: the toy's B, E and G sharp as edges, shapes and the answer light.
#    "An idea, not a brain": the mark again, on E. One real cell takes seven layers: the wind holds a B, and the toy climbs seven notes
#    to reach it. A child: a tap for each of three examples; a model: a breath for its great many. The bird: the wind, on A
bw = lambda lid, word, off=0: W('borrowed', lid, word, off)
bc = lambda lid, off=0: G('borrowed', lid, off)
tu0 = bc('unit', 0.9)
borrow(E1, 6, tu0, hold=bw('unit', 'a simple unit', 0.4) - tu0, g=0.6, gt=0.55, at=bw('unit', 'a simple unit', -0.2) - tu0, pan=px(1230), rel=1.4)
for i in range(3):
    tap(bc('adds', 0.7 + i * 0.22), 0.009, px(1230))
toy(B4, bw('adds', 'fires if the total', 0.2), 0.5, px(1230))
whirr(bw('weights', 'nudged'), 1.1, 0.008, px(1230))
# Baltimore, 1959: a tock for each spike bb_spikes draws (near the angle the cell fires for) while its card shows, at most five
te, tA, tF = bc('edges'), bw('edges', 'fire for edges', -0.3), bc('feed', -0.4)
s0 = S0('borrowed'); ks = [k for k in range(int((tA - s0) / 0.05) + 1, int((tF - s0) / 0.05))
                           if jhash(k, 17) <= np.exp(-(0.95 * np.sin((k * 0.05 - (te - s0)) * 0.85)) ** 2 / 0.03) * 0.85]
for k in ks[:5]:
    impulse(s0 + k * 0.05, px(1080 + 640))
# networks that read pictures: edges, shapes, the answer (bb_layers, after "Networks": edges at 0.82 s, shapes 1.73, the answer 2.55)
tl = bc('layers')
for off, m, x in ((0.82, B3, 760), (1.73, E4, 1130), (2.55, Gs4, 1500)):
    toy(m, tl + off, 0.5, px(x))
air(bw('today', 'billions of weights', -0.6), 1.2, 0.006, px(1190), 200, 900)
borrow(E1, 8, bc('copy', -0.2), hold=2.0, g=0.6, gt=0.55, at=bw('copy', 'an idea', 0.1) - bc('copy', -0.2), pan=px(800), rel=1.3)
# one cell takes a network of seven layers to mimic: the wind holds a B for the cell; the toy climbs a note a layer, reaching it
# (bb_oneCell's signal reaches layer i at "five to eight layers" + 1 + i / 1.6)
tn = bw('complex', 'five to eight layers', 1.0)
gust(hz(E1) * 12, bc('complex', 1.3), tn + 6 / 1.6 + 0.5, 0.42, att=1.2, rel=1.3, pan=px(440))
run(tn, (B3, Cs4, Ds4, E4, Fs4, Gs4, B4), 1 / 1.6, 0.42, px(1100))
# a child, a few examples (bb_examples: the three tiles at "a few examples" - 0.28, + 0.04 and + 0.36); a model, a great many
for off in (-0.28, 0.04, 0.36):
    tap(bw('child', 'a few examples', off), 0.010, px(420 + (off + 0.28) * 560))
air(bw('child', 'a great many', -0.4), 1.6, 0.007, px(1400), 220, 1000)
# the bird flaps; the plane borrowed only its wing
harp(A1, (5, 8), bc('wing', 0.1), bw('wing', 'not the flapping', 0.9), 0.48, lag=0.5, att=0.9, rel=1.6)

# 7. Likely words: the toy plays the sentence as the model writes it, a note a word, ending open. The bars for every word: a breath.
#    Each spin of the wheel: a wooden whirr and a knock, and the word it lands on, on the toy: dancing E, buzzing C sharp; turned
#    down, E again; turned up, waggling G sharp, then singing, an F, wrong. Many people at once: a breath; the close choice tips to
#    waggling. The two answers: a soft knock as each card comes in
yw = lambda lid, word, off=0: W('likely', lid, word, off)
yc = lambda lid, off=0: G('likely', lid, off)
step = (yw('one', 'one word at a time') - yc('one') + 0.6) / 9
run(yc('one', 0.3), (B3, E4, Fs4, Gs4, B4, Gs4, Fs4, E4, Fs4), step, 0.36, px(900))
air(yw('chance', 'every word it knows', -0.4), 1.4, 0.006, px(900), 220, 1000)
SPINS = ((yw('wheel', 'spinning a wheel', -0.2), 2.2, DANCING), (yw('wheel', 'but not always', -0.3), 2.0, BUZZING),
         (yw('low', 'almost always wins', -0.6), 2.0, DANCING), (yw('high', 'answers vary more', -0.5), 1.8, WAGGLING),
         (yw('high', 'more often go wrong', -0.7), 1.6, SINGING), (yw('busy', 'tip a close choice', -1.3), 1.8, WAGGLING))
for s_, d, m in SPINS:
    spin(s_, d, 0.009, px(1600)); toy(m, s_ + d, 0.5, px(1600))
knock(yw('again', 'a different answer', -0.4), 0.014, px(960)); knock(yw('again', 'one word changes', -0.3), 0.014, px(960))
tap(yc('dial', -0.2), 0.010, px(300))
air(yc('busy', -0.1), 3.6, 0.007, px(200), 200, 900)

# 8. Sure, and wrong: the question, a knock; each date the model gives, a toy note of its own, none of them home; "all wrong": a low
#    knock. The pages, the test: paper. "Brains fill gaps too": the gap chord again, and its missing B swells in. "A checked one": a
#    knock as the evidence opens
sw = lambda lid, word, off=0: W('sure', lid, word, off)
sc_ = lambda lid, off=0: G('sure', lid, off)
knock(sc_('missing', 0.3), 0.014, px(840))
toy(Ds4, sw('missing', 'still writes likely words', -0.2), 0.5, px(630))
toy(A4, sw('birthday', 'three different dates', -0.5), 0.45, px(960)); toy(Cs4, sw('birthday', 'three different dates', 0.3), 0.45, px(1290))
knock(sw('birthday', 'all wrong', -0.1), 0.016, px(960), 150)
paper(sc_('once', -0.2), 0.012, px(600)); paper(sc_('tests', -0.2), 0.012, px(560))
harp(E1, (4, 5, 8, 10), sw('brains', 'fill gaps too', -0.4), sw('brains', 'fill gaps too', 3.0), 0.42, lag=0.2, att=0.8, rel=1.6, fall=0.06)
gust(hz(E1) * 6, sw('brains', 'fill gaps too', 0.4), sw('brains', 'fill gaps too', 3.0), 0.5, att=1.0, rel=1.6)
knock(sw('fluent', 'a checked one', -0.4), 0.014, px(1400))

# 9. A picture that held: E major at the turn, as the drawing shows checked. The electron microscope's picture slides in: a breath;
#    "showed the gap": a tap. Models built on that picture: the toy's E, G sharp and B as the signal crosses each layer. They fill gaps,
#    a little differently each time: each spin of the wheel lands on its word's note, dancing, buzzing, waggling. Checked against the
#    evidence: E major blooms as "Checked" shows. The loop: a breath. The end card: the mark, E struck by the toy as the wind sounds it,
#    and the chord, fading
hw = lambda lid, word, off=0: W('held', lid, word, off)
hc = lambda lid, off=0: G('held', lid, off)
harp(E1, (4, 6, 8), hw('held', 'others could check it', -0.4), hc('gap', 0.4), 0.5, lag=0.3, att=0.9, rel=1.6)
air(hw('gap', 'electron microscopes', -0.3), 1.0, 0.007, px(1300), 200, 900)
tap(hw('gap', 'showed the gap', -0.2), 0.010, px(1130))
tu = hw('built', 'simple units')
for i, m in enumerate((E4, Gs4, B4)):
    toy(m, tu + i / 0.9, 0.45, px((620, 960, 1300)[i]))
HSP = ((hc('fill', 0.2), 1.6, DANCING), (hw('fill', 'a little differently', -0.6), 1.5, BUZZING), (hw('fill', 'a little differently', 1.1), 1.4, WAGGLING))
for s_, d, m in HSP:
    spin(s_, d, 0.008, px(1000)); toy(m, s_ + d, 0.45, px(1000))
harp(E1, (4, 5, 6), hw('check', "as Cajal's drawings", 0.3), END('held', 'check') + 0.8, 0.5, lag=0.25, att=0.9, rel=1.6)
air(hw('next', 'in a loop', 0.2), 1.6, 0.007, px(960), 200, 900)
hb = hc('breath')
borrow(E1, 8, hb - 0.2, hold=2.4, g=0.66, gt=0.58, at=0.9)
harp(E1, (4, 6, 5), hb + 1.0, E('held') - 0.5, 0.48, lag=0.4, att=1.2, rel=2.4)
