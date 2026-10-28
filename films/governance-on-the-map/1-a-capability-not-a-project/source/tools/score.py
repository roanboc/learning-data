# A capability, not a project: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (PLAYBOOK.md: vary the sound itself; the palettes of Governance principles' eleven films, brass and music
# box, recorders and marimba, piano, strings and clarinet, glass harmonica and handbells, guitar, electric piano and flute, the double
# reeds, organ and timpani, are left to the films that have them): a saxophone quartet, soprano, alto, tenor and baritone, made here
# (music.py has no saxophones), played softly and low, so nothing rings above the voice.
#  - The film is about what lasts whoever does the work, so its one figure is a note handed on: one saxophone holds it, the next comes
#    in on the same note before the first lets go, and the note never stops, whoever plays it. It's heard as keeping the land dry never
#    ended, in 1997, and as what the project built stays.
#  - A project is a phrase that ends: the storm barrier's chord, built as its piers rise, closes on a cadence as "projects end", and
#    the deputy vice-chancellor's planner gets one low note that stops, on "ends in June". The budget's line is the baritone's one
#    long note, drawn out as the line is written and runs on past June.
#  - The water boards' tune, five notes, 1-3-5-4-3, played by the alto as the people behind the dikes form their boards, and copied by
#    the baritone as each landowner keeps his stretch; it comes back whenever the film goes back to Holland.
#  - The voices also come in one at a time as things arrive in order: the dike's layers, low to high; the three landowners' stretches,
#    each note as long as its stretch (the more land, the longer the note); interest, payment and a say; Yusuf's three cards, and the
#    three moving down the map; the green notes of evidence, rising. Two voices meet on one note when the two reports agree, and part
#    when, next year, they might not.
#  - The series' mark, four notes, 1-5-4-8, on the alto, answered by the baritone, plays under the title and the end card.
#  - F major for Holland (F minor for the storm of 1953), D-flat major for the university, tuned from the same F (its F is a pure major
#    third over D-flat), so every note the two keys share is the same pitch in both, and a note can be held from one into the other.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, Holland's, and after it only at a chapter's
#    turn, under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the
#    opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: no urgent pulse; each saxophone is one voice, with no vibrato and no tremolo; every chord is tuned
#    pure (just intonation, see hz()), and a note two voices share is the same pitch exactly. Nothing imitates the music of another
#    culture: no instrument, tune or dance of the Netherlands; the story is told in the series' own voice.
#  - Nothing loops. Where the picture repeats (the stakes, the ticks, the pins, the cards turned over), the sound plays the first few,
#    then softer.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed: change one, change both.
# And everything stays low and soft: water lapping, trickling and pouring, wind, rain and the sea at night, a spade in wet earth, clay
# set down, a mallet on a stake, a staff on bare clay, a knife's notch, a coin, a plough, bicycles, a pumping station, the barrier's
# gates, a crane driving off; and in the university, paper, pins, a pencil, a pen, a marker, a knock at a door, a padlock, all below
# about 2.5 kHz.

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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1101)  # this film's own randomness: the room, the water, the wind, the rain

# ---- tuning: just intonation from the key's own note, so a chord's notes are whole-number ratios of each other and nothing beats.
# Holland is in F; the university in D-flat, tuned from the same F (its D-flat is a pure major third under F), so the notes the two
# keys share (F, A-flat, B-flat, C, D-flat, E-flat and G-flat) are the same pitch in both. F minor uses the same table. The chords on
# the second degree are left out (their fifths aren't pure here)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEYS = {'F': (53, 174.614), 'Db': (49, 174.614 * 4 / 5)}  # each key's own note (MIDI) and its pitch
def hz(m, k='Db'):
    t, f = KEYS[k]; o, pc = divmod(m - t, 12)
    return f * 2 ** o * _JI[pc]

# ---- the levels: a saxophone sits about as far under the voice as the series' other films' music (each matched by loudness, not by
# peak); the effects about 12 dB under the music (FX scales them all)
RL, FX = 0.03, 1.3
LEVEL = {'sop': 0.95, 'alto': 1.15, 'ten': 1.1, 'bari': 1.05}
PAN = {'sop': -0.3, 'alto': -0.1, 'ten': 0.12, 'bari': 0.28}  # as a quartet sits: soprano on the left, baritone on the right

# ---- the saxophones. Each note is every harmonic of its pitch (a conical bore's), shaped by the instrument's own resonances (its
# formants: the soprano's near 820 Hz, the alto's near 600, the tenor's near 430 and the baritone's near 300, each with a second
# above), with the lowest harmonics a little weak, and darker the softer it's played; the harmonics above about 2.4 kHz are left out.
# The breath of air through the reed under it, more than a double reed's, a little more as the note starts; the pitch settles from a
# few cents under in the first hundredth of a second, and then holds, with no vibrato. A small room round the players rings on for
# about a second
SAX = {  # formants as (Hz, width, weight); the corner under which the harmonics weaken; the soft roll-off; the onset; the air's band
    'sop': ([(820, 520, 1.0), (1500, 600, 0.36), (2250, 600, 0.08)], 300, 1500, 0.05, (900, 2000)),
    'alto': ([(600, 420, 1.0), (1200, 520, 0.4), (1950, 600, 0.09)], 210, 1250, 0.055, (650, 1600)),
    'ten': ([(430, 320, 1.0), (900, 440, 0.4), (1650, 560, 0.09)], 140, 1000, 0.06, (450, 1300)),
    'bari': ([(300, 230, 1.0), (650, 360, 0.42), (1300, 480, 0.1)], 95, 760, 0.07, (300, 1000))}
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.05)).astype(np.float32))(np.arange(int(1.05 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.014 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _harm(inst, f, soft=1.0):
    """the weights of a note's harmonics on inst, at f Hz"""
    F, lo, hi = SAX[inst][:3]; n = max(1, int(2500 // f)); k = np.arange(1, n + 1); fk = f * k
    r = sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in F) + 0.08
    a = k ** -0.5 * r * (fk / lo) ** 2 / (1 + (fk / lo) ** 2) / (1 + (fk / (hi * soft)) ** 2) * np.clip((2500 - fk) / 250, 0, 1)
    return a / np.sqrt((a ** 2).sum())
def line(inst, segs, g=1.0, k='Db', soft=1.0, att=None, rel=0.14, tongue=False, room=0.24, pan=None, tie=False):
    """one player's line: segs is [(start, end, note, level)], each note slurred into the next, or tongued, and the same note again
    re-tongued unless tie; a rest (note None) breaks it"""
    run = []
    for s in list(segs) + [(None, None, None, 0)]:
        if s[2] is None:
            if run:
                _line(inst, run, g, k, soft, att, rel, tongue, room, PAN[inst] if pan is None else pan, tie)
            run = []
        else:
            run.append(s)
def _line(inst, segs, g, k, soft, att, rel, tongue, room, pan, tie):
    T0, T1 = segs[0][0], segs[-1][1]; att = att or SAX[inst][3]; gl = 0.04
    assert all(b > a for a, b, _, _ in segs), '%s: a note ends before it starts, %s' % (inst, [(round(a, 2), round(b, 2), m) for a, b, m, _ in segs])
    n = int((T1 - T0 + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    fs = [hz(m, k) for _, _, m, _ in segs]; A = [_harm(inst, f, soft) for f in fs]; K = max(len(a) for a in A)
    A = [np.pad(a, (0, K - len(a))) for a in A]
    kx, kf, ka, kv = [], [], [], []
    for i, (a, b, m, v) in enumerate(segs):  # each note steady between short glides, its harmonics' weights with it
        for t in ((a - T0 + gl / 2 if i else 0.0), (b - T0 - gl / 2 if i < len(segs) - 1 else n / SR)):
            kx.append(t); kf.append(np.log2(fs[i])); ka.append(A[i]); kv.append(v)
    lf = np.interp(x, kx, kf) + np.log2(1 - 0.006 * np.exp(-x / 0.02))
    ph = 2 * np.pi * np.cumsum(2 ** lf) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > T1 - T0, np.cos(0.5 * np.pi * np.minimum((x - (T1 - T0)) / rel, 1)) ** 2, 1.0)
    for i in range(1, len(segs)):  # a tongued change, or the same note again, dips for a moment
        if tongue or (segs[i][2] == segs[i - 1][2] and not tie):
            e = e * (1 - 0.6 * np.exp(-((x - (segs[i][0] - T0)) / 0.02) ** 2))
    lev = np.interp(x, kx, kv); ka = np.array(ka); s = np.zeros(n)
    for j in range(K):  # the higher harmonics come in a little after the lower and go a little before: softer is darker
        aj = np.interp(x, kx, ka[:, j])
        if aj.max() > 1e-4:
            s += aj * e ** (1 + 0.14 * j) * np.sin((j + 1) * ph + 0.9 * j * j)
    lo, hi = SAX[inst][4]
    s = s * lev + 0.026 * filt(noise(n / SR + 0.01)[:n], 'band', (lo, hi)) * e * lev * (1 + 2.5 * np.exp(-x / (0.012 if tongue else 0.035)))
    s = filt(s.astype(np.float32), 'low', 2400)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), T0, g * RL * LEVEL[inst], pan)
def note(inst, m, s, sec, g=1.0, k='Db', **o):
    """one held note"""
    line(inst, [(s, s + sec, m, 1.0)], g, k, **o)
def stacc(inst, m, s, g=0.9, k='Db', sec=0.18, pan=None):
    """a soft, short note, tongued"""
    line(inst, [(s, s + sec, m, 1.0)], g, k, 0.85, att=0.016, rel=0.06, tongue=True, pan=pan)
def figure(inst, notes, s, step, g=0.9, k='Db', sec=0.18, fall=1.0):
    """short notes one after another, each a little softer than the one before (fall)"""
    for i, m in enumerate(notes):
        stacc(inst, m, s + i * step, g * fall ** i, k, sec)
def phrase(inst, notes, s, g=1.0, k='Db', step=0.42, last=1.6, soft=1.0):
    """notes slurred one after another, each step long, the last held"""
    d = [step] * (len(notes) - 1) + [last]; t = s; segs = []
    for m, dd in zip(notes, d):
        segs.append((t, t + dd, m, 1.0)); t += dd
    line(inst, segs, g, k, soft)
def chord(voices, a, b, g=0.8, k='Db', step=0.12, att=0.25, rel=0.4):
    """a held chord, each voice coming in a moment after the one under it: voices is {instrument: note}, lowest first"""
    for i, (inst, m) in enumerate(voices.items()):
        line(inst, [(a + step * i, b, m, 1.0)], g, k, 0.8, att=att, rel=rel)
def hand(m, seq, g=0.8, k='Db', over=0.5):
    """the film's figure: one note handed on. seq is [(instrument, start)]: each voice comes in on the same note, the one before lets
    go over seconds later, and the last holds to its end, (instrument, start, end)"""
    for i, it in enumerate(seq):
        inst, a = it[0], it[1]; b = seq[i + 1][1] + over if i < len(seq) - 1 else it[2]
        line(inst, [(a, b, m, 1.0)], g, k, 0.8, att=0.6, rel=0.7)
# the water boards' tune, 1-3-5-4-3, in F; and the series' mark, 1-5-4-8
BOARDS = [53, 57, 60, 58, 57]
def mark(inst, root, s, g=1.0, k='F', step=0.45, last=1.4):
    phrase(inst, [root, root + 7, root + 5, root + 12], s, g, k, step, last)

# ---- outside: water, wind, rain and the sea, and the work on the dike. All low-passed; the slow swells are uneven, so nothing pulses
def _swell(sec, rate, depth, seed):
    """a slow, uneven rise and fall, depth deep, about rate times a second"""
    x = tt(sec); r = np.random.default_rng(seed)
    m = filt(r.standard_normal(len(x)).astype(np.float32), 'low', rate); m = m / (np.abs(m).max() + 1e-9)
    return (1 - depth) + depth * (0.5 + 0.5 * m)
def _fade(sec, a, r):
    x = tt(sec); return np.minimum(1, x / a) * np.clip((sec - x) / r, 0, 1)
def lap(s, sec, g=0.010, pan=0.0, seed=1):
    """water lapping at a bank: a low, uneven wash"""
    X(filt(noise(sec), 'band', (110, 800)) * _swell(sec, 1.2, 0.7, 100 + seed) * _fade(sec, 0.8, 1.0), s, g * FX, pan)
def trickle(s, sec, g=0.008, pan=0.0):
    """water running off a field into a ditch: a soft, uneven trickle"""
    X(filt(noise(sec), 'band', (380, 1500)) * _swell(sec, 6.0, 0.6, 43) * _fade(sec, 0.6, 1.0), s, g * FX, pan)
def rush(s, sec, g=0.014, pan=0.0, a=0.8, r=1.4, seed=7):
    """water pouring through a gap: a low, full rush that swells unevenly"""
    X(filt(noise(sec), 'band', (90, 900)) * _swell(sec, 0.8, 0.35, 200 + seed) * _fade(sec, a, r), s, g * FX, pan)
def wind(s, sec, g=0.010, pan=0.0, seed=1):
    """wind over the dike: low air that rises and falls"""
    X(filt(noise(sec), 'band', (110, 700)) * _swell(sec, 0.5, 0.55, 300 + seed) * _fade(sec, 1.0, 1.4), s, g * FX, pan)
def gale(s, sec, g=0.016, pan=0.0):
    """the storm at night: wind in gusts, and the sea breaking on the dike, both low"""
    wind(s, sec, g, pan, 9); x = tt(sec); r = np.random.default_rng(57); e = np.zeros(len(x), np.float32); t0 = 0.6
    while t0 < sec - 0.8:  # each wave arriving: a swell of low noise
        d = r.uniform(1.0, 1.6); i, j = int(t0 * SR), min(len(x), int((t0 + d) * SR))
        e[i:j] = np.maximum(e[i:j], np.sin(np.pi * np.arange(j - i) / max(1, j - i)) ** 2 * r.uniform(0.6, 1.0)); t0 += r.uniform(1.1, 1.9)
    X(filt(noise(sec), 'band', (70, 600)) * e * _fade(sec, 0.6, 1.2), s, g * 1.1 * FX, pan)
def rain(s, sec, g=0.008, pan=0.0):
    """steady rain on grass and water: a soft, even hush, and drops, all under 2.2 kHz"""
    x = tt(sec); r = np.random.default_rng(61); d = np.zeros(len(x), np.float32)
    for t0 in np.sort(r.uniform(0, sec, int(sec * 40))):
        i = int(t0 * SR); j = min(len(x), i + int(0.012 * SR)); d[i:j] += r.uniform(0.3, 1.0) * np.exp(-np.arange(j - i) / (0.003 * SR))
    sig = filt(noise(sec), 'band', (300, 2000)) * 0.8 + filt(d * noise(sec)[:len(x)], 'band', (500, 2000)) * 2.5
    X(filt((sig * _fade(sec, 1.2, 1.2)).astype(np.float32), 'low', 2200), s, g * FX, pan)
def spade(s, g=0.016, pan=0.0):
    """a spade into wet earth: a low thud, and the earth giving"""
    x = tt(0.3); X(norm(filt((np.sin(2 * np.pi * 95 * x) * np.exp(-x * 26) + 0.5 * filt(noise(0.3), 'band', (150, 700))[:len(x)] * np.exp(-x * 14)).astype(np.float32), 'low', 900)), s, g * FX, pan)
def clay(s, g=0.016, pan=0.0):
    """a load of clay set down: a low, padded thump"""
    x = tt(0.35); X(norm(filt((np.sin(2 * np.pi * 70 * x) * np.exp(-x * 18) + 0.4 * filt(noise(0.35), 'band', (100, 500))[:len(x)] * np.exp(-x * 20)).astype(np.float32), 'low', 700)), s, g * FX, pan)
def crumble(s, g=0.012, pan=0.0):
    """clay breaking off into the water: a soft, low fall"""
    clay(s, g, pan); x = tt(0.5); X(filt(noise(0.5), 'band', (120, 800)) * np.exp(-x * 6) * np.minimum(1, x / 0.04), s + 0.05, g * 0.6 * FX, pan)
def stake(s, g=0.016, pan=0.0):
    """a mallet on a wooden stake: a dull knock, and the stake going in"""
    s_knock(s, g * FX, pan, 170); spade(s + 0.01, g * 0.35, pan)
def staff(s, g=0.014, pan=0.0):
    """a staff's foot on bare clay: a dull, low tap"""
    s_knock(s, g * FX, pan, 140)
def notch(s, g=0.009, pan=0.0, sec=0.8):
    """a knife cutting a notch in a tally stick: a few short scrapes"""
    for k in range(int(sec / 0.2)):
        x = tt(0.12); X(filt(noise(0.12), 'band', (600, 2000))[:len(x)] * np.sin(np.pi * x / 0.12), s + 0.2 * k + 0.03 * R1.uniform(), g * (1 - 0.15 * k) * FX, pan)
def coin(s, g=0.006, pan=0.0):
    """a coin into a palm: a small, dull clink, its ring kept under 2.4 kHz"""
    x = tt(0.25); sig = sum(np.sin(2 * np.pi * f * x) * np.exp(-x * d) * w for f, d, w in ((1180, 40, 1.0), (1730, 55, 0.6), (2210, 70, 0.3)))
    X(norm(filt((sig * np.minimum(1, x / 0.002)).astype(np.float32), 'low', 2400)), s, g * FX, pan)
def step(s, g=0.008, pan=0.0):
    """a footstep on grass, or a floor: a dull, low pat"""
    x = tt(0.14); X(norm(filt(noise(0.14), 'band', (90, 650)) * np.exp(-x * 34)), s, g * FX * R1.uniform(0.8, 1.0), pan)
def walk(s, sec, g=0.008, p0=0.0, p1=0.0, per=0.32):
    """someone walking, a step every half stride"""
    n = int(sec / per)
    for k in range(n):
        step(s + k * per + 0.02 * R1.uniform(), g * (0.85 + 0.15 * (k % 2)), p0 + (p1 - p0) * k / max(1, n))
def slosh(s, g=0.010, pan=0.0):
    """someone wading: a soft, low splash"""
    x = tt(0.5); X(filt(noise(0.5), 'band', (140, 1000)) * np.exp(-x * 7) * np.minimum(1, x / 0.04), s, g * FX, pan)
def rustle(s, sec=0.8, g=0.008, pan=0.0):
    """grass, or turf laid: a soft, dry rustle"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1800)) * np.sin(np.pi * x / sec) ** 1.2 * _swell(sec, 8, 0.5, 71), s, g * FX, pan)
def plough(s, sec, g=0.007, pan=0.0):
    """a plough through the earth, and the ox's slow steps"""
    X(filt(noise(sec), 'band', (120, 700)) * _swell(sec, 2.0, 0.4, 81) * _fade(sec, 0.8, 1.2), s, g * FX, pan)
    for k in range(int(sec / 0.71)):
        s_knock(s + 0.4 + 0.71 * k, g * 0.5 * FX * (1 if k < 2 else 0.6), pan, 110)
def bike(s, sec, g=0.007, p0=0.0, p1=0.0):
    """a bicycle on the road on the dike: its tyres' soft hiss, swelling as it comes nearer"""
    x = tt(sec); sig = filt(noise(sec), 'band', (200, 1300)) * np.minimum(1, x / sec * 1.6) * np.clip((sec - x) / 0.6, 0, 1)
    n = 6
    for k in range(n):
        a = k / n; X(sig[int(a * len(sig)):int((a + 1 / n) * len(sig))], s + a * sec, g * FX, p0 + (p1 - p0) * a)
def hum(s, sec, g=0.004, pan=0.0):
    """the pumping station, far off: a low, steady hum"""
    x = tt(sec); sig = sum(np.sin(2 * np.pi * 75 * k * x) * w for k, w in ((1, 1.0), (2, 0.5), (3, 0.25), (4, 0.12)))
    X((sig * _fade(sec, 1.0, 1.2)).astype(np.float32), s, g * FX, pan)
def rumble(s, sec, g=0.012, pan=0.0):
    """concrete and steel settling into place, far off: a low roll that rises and falls"""
    x = tt(sec); X(filt(noise(sec), 'low', 180) * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def gate(s, g=0.016, pan=0.0):
    """a gate of steel set down in the water: a deep, soft thump"""
    x = tt(0.6); X(norm(filt((np.sin(2 * np.pi * 52 * x) * np.exp(-x * 7) + 0.3 * filt(noise(0.6), 'low', 300)[:len(x)] * np.exp(-x * 9)).astype(np.float32), 'low', 400)), s, g * FX, pan)
def engine(s, sec, g=0.008, p0=0.0, p1=0.0):
    """the last crane driving off: a low engine, fading as it goes"""
    x = tt(sec); r = filt(noise(sec), 'low', 240) * np.exp(-x * 0.8) * np.minimum(1, x / 0.3)
    n = 6
    for k in range(n):
        a = k / n; X(r[int(a * len(r)):int((a + 1 / n) * len(r))], s + a * sec, g * FX, p0 + (p1 - p0) * a)

# ---- in the university: soft sounds in the rooms, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a sheet arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.020, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pin(s, g=0.022, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pat(s, g=0.014, pan=0.0):
    """a card pressed onto glass, or a speech bubble arriving: a small, padded pat"""
    s_knock(s, g * FX, pan, 200); paper(s + 0.01, g * 0.35, pan, 0.12)
def pencil(s, g=0.011, pan=0.0, sec=0.5):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def tick(s, g=0.011, pan=0.0):
    """a tick: two quick pencil strokes"""
    pencil(s, g, pan, 0.12); pencil(s + 0.13, g * 0.85, pan, 0.18)
def pen(s, g=0.010, pan=0.0, sec=1.2):
    """a pen writing: short strokes, unevenly, never quite in time"""
    x = tt(sec); e = np.zeros(len(x), np.float32); t0 = 0.0
    while t0 < sec - 0.06:
        d = R1.uniform(0.05, 0.13); i, j = int(t0 * SR), min(len(x), int((t0 + d) * SR))
        e[i:j] = np.maximum(e[i:j], np.sin(np.pi * np.arange(j - i) / max(1, j - i)) * R1.uniform(0.5, 1.0)); t0 += d + R1.uniform(0.0, 0.05)
    X(filt(noise(sec), 'band', (500, 1900))[:len(x)] * e, s, g * FX, pan)
def marker(s, g=0.012, pan=0.0, sec=0.8):
    """a marker drawn along a line, or round a card: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def slide(s, g=0.016, pan=0.0, sec=0.5):
    """a sheet, or a report, slid across a desk: a low, smooth slide, and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def flap(s, g=0.014, pan=0.0, sec=0.5):
    """a cover swung over and laid flat: a breath of air and a padded flap"""
    s_air(s, max(0.15, sec + 0.08), g * 0.5 * FX, pan, 150, 800); s_knock(s + sec, g * FX, pan, 170); paper(s + sec + 0.02, g * 0.4, pan, 0.2)
def flip(s, g=0.010, pan=0.0):
    """a card turned over on its pin: a quick breath of air and a small paper snap"""
    s_air(s, 0.28, g * 0.6 * FX, pan, 200, 1100); paper(s + 0.2, g * 0.5, pan, 0.12)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def lock(s, g=0.012, pan=0.0):
    """a padlock on a screen: a soft metal click, low"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.05, g * 0.6 * FX, pan)
def peel(s, g=0.012, pan=0.0):
    """a card taken off the planner: a short peel, and paper"""
    x = tt(0.3); X(filt(noise(0.3), 'band', (400, 1800))[:len(x)] * np.sin(np.pi * x / 0.3) ** 2 * np.linspace(0.6, 1, len(x)), s, g * FX, pan)

# =============================================================================================================================
# 1. Behind the dike: Holland around 1300, in F. The wet land at dawn, an open F, low, and the water lapping; a farmer cuts a ditch's
#    end, a spade in wet earth at each stroke, and the water runs off, the alto rising as the land dries. As it sinks, the tenor goes
#    down with it, and the baritone comes in under it, a bare fifth, below the river; then the dike, its layers of clay set down, and
#    a voice for each, low to high, F major as the grass comes. The weakest stretch: the chord thins and the alto sags. The breach: the
#    river over the low stretch, clay breaking off, the water pouring through, on a low D; the flood spreads, the alto falling; the
#    family carries the winter's food up, on B-flat; a dike is never finished, a note for each small picture, falling. Then mended,
#    F again, and the water boards: the alto's tune as the people gather on the dike, the baritone copying it as each stretch is staked;
#    the three stretches, each note as long as its stretch; the board walking, a staff on bare clay, the clerk's notch, a coin; interest,
#    payment and a say, a voice each, F major; the farm behind kept dikes; the charter, B-flat to F; today, the tune on the soprano,
#    bicycles and the pumping station; the same with data, the open F again. Yusuf's board, and D-flat, the university; the two reports
#    agree, two voices meeting on one note; and the mark under the title
dw = lambda lid, word, off=0: W('dike', lid, word, off)
dc = lambda lid, off=0: G('dike', lid, off)
drained, dries, lower, weakest = dw('sinks', 'drained'), dw('sinks', 'as it dries'), dw('sinks', 'lower than'), dw('weak', 'weakest')
breaks, floodsE, homes, food = dw('floods', 'breaks'), dw('floods', 'floods everyone'), dw('floods', 'homes'), dw('floods', "the winter's food")
settles, wears, storms = dw('never', 'settles'), dw('never', 'wears'), dw('never', 'storms')
more, relies, paysW, sayW = dw('stretch', 'the more land'), dw('pays', 'relies'), dw('pays', 'pays for'), dw('pays', 'a say')
since, country, trustW = dw('rijnland', 'since'), dw('rijnland', 'in a country'), dw('trust', 'trust')
sec, wk, br, fl, fm, vg = dries - 0.6, dc('weak', -0.3), breaks - 0.5, floodsE - 0.3, homes - 0.3, settles - 0.9
md, gt, st, ae, bw, pc = dc('need', -0.3), dc('boards', -0.3), dc('stretch', -0.3), more - 0.4, dc('walks', -0.3), dc('pays', -0.3)
sf, ch, td, sm, pj, tr, breath = dc('safe', -0.3), dc('rijnland', -0.3), country - 0.3, dc('same', -0.3), dc('project', -0.3), dc('trust', -0.3), dc('breath')
dikes = dc('dikes')
# the wet land at dawn: an open F, low, and the river lapping; the farmer's spade at each stroke (cp_dig's period, 1.5 s) until the
# ditch is cut, then the water running off the field
note('bari', 41, 0.4, sec + 0.2, 0.7, 'F', att=1.2, rel=0.8); note('ten', 48, 1.0, sec - 0.8, 0.7, 'F', att=1.2, rel=0.4)
lap(0.0, sec + 0.8, 0.010, -0.3)
for k in range(1, 20):
    if 1.5 * k > drained + 1.58:
        break
    spade(1.5 * k, 0.014 if k < 3 else 0.010, px(1180))
trickle(drained + 1.6, sec + 0.6 - (drained + 1.6), 0.009, px(1100))
phrase('alto', [53, 55, 57], drained + 0.3, 0.75, 'F', step=0.9, last=1.4)
# the section: the field sinks as it dries, the tenor down with it, and under it the baritone, a bare fifth, below the river's level;
# then the dike's layers, clay set down, a voice for each, low to high, and the grass
air(dries, 2.4, 0.008, 0.0)
line('ten', [(dries, dries + 0.8, 48, 1.0), (dries + 0.8, dries + 1.6, 46, 1.0), (dries + 1.6, dikes - 0.1, 45, 1.0)], 0.7, 'F', 0.8, att=0.4, rel=0.5)
note('bari', 38, lower - 0.1, dikes - 0.4 - (lower - 0.1), 0.7, 'F', att=0.5, rel=0.4)
for k in range(4):
    clay(dikes + 0.15 + 0.35 * k, 0.016 if k < 2 else 0.011, px(960))
rustle(dikes + 1.15, 0.9, 0.008, 0.0)
for k, (inst, m) in enumerate((('bari', 41), ('ten', 48), ('sop', 60))):
    note(inst, m, dikes + 0.1 + 0.35 * k + 0.35 * (k == 2), weakest - 0.3 - (dikes + 0.1 + 0.35 * k + 0.35 * (k == 2)), 0.7, 'F', att=0.3, rel=0.6)
# the weakest stretch: the wind over the crest; the alto alone, A sagging to G
wind(wk, br - wk + 0.6, 0.009, 0.0, 1)
line('alto', [(dikes + 0.8, weakest + 0.5, 57, 1.0), (weakest + 0.5, br + 0.2, 55, 0.8)], 0.7, 'F', 0.75, att=0.3, rel=0.6)
# the breach: the river rising over the low stretch (0 to 1.2 s), cutting a gap (0.9 to 2.4 s), clay breaking off, and pouring through,
# over the land behind; a low D, and the tenor's A under the flood
rush(br, 1.6, 0.010, 0.0, a=1.2, r=0.4, seed=1)
for k in range(4):
    crumble(br + 0.95 + 0.4 * k + 0.1 * R1.uniform(), 0.012 if k < 2 else 0.008, px(960))
rush(br + 1.6, fm - br - 1.0, 0.016, 0.0, a=0.6, r=1.6, seed=2)
note('bari', 38, br + 0.3, fm + 0.6 - br - 0.3, 0.75, 'F', att=0.8, rel=0.6)
note('ten', 45, br + 0.9, fm + 0.6 - br - 0.9, 0.65, 'F', att=0.8, rel=0.6)
# the flood spreads, the cattle wading off: the alto falling
for k in range(3):
    slosh(fl + 1.0 + 1.1 * k, 0.008, px(700 + 300 * k))
_d = fm + 0.6 - (fl + 0.3)
phrase('alto', [53, 52, 50], fl + 0.3, 0.7, 'F', step=_d / 4, last=_d / 2)
# the farmhouse: the son wading to the door, the wife lifting a sack up the ladder, into the loft; B-flat, the winter's food
lap(fm, vg - fm + 0.4, 0.008, px(900), 2)
slosh(fm + 0.4, 0.010, px(1300)); slosh(fm + 1.2, 0.008, px(1250))
clay(food + 0.2, 0.010, px(560))
chord({'bari': 46, 'ten': 53, 'alto': 62}, food - 0.2, vg + 0.4, 0.6, 'F', step=0.15, att=0.5, rel=0.6)
# a dike is never finished: three small pictures, settling, worn by cattle, torn by a storm, a note for each, falling
clay(settles + 0.3, 0.008, px(355))
step(wears + 0.3, 0.010, px(960)); step(wears + 0.65, 0.008, px(960))
wind(storms - 0.1, 1.8, 0.016, px(1565), 2)
for t0, m in zip((settles, wears, storms), (48, 46, 45)):
    note('ten', m, t0 + 0.05, 1.2, 0.65, 'F', att=0.15, rel=0.4)
# mended: the gap filled with clay and turf, a spade patting it down, as the camera pulls back; F again
for k in range(3):
    spade(md + 0.6 + 0.7 * k, 0.010 if k < 2 else 0.007, px(1242 - 140 * k))
rustle(md + 2.2, 0.8, 0.006, 0.0)
chord({'bari': 41, 'ten': 48}, md + 0.3, gt + 0.4, 0.65, 'F', step=0.3, att=0.6, rel=0.6); note('alto', 57, md + 0.9, gt + 0.1 - md - 0.9, 0.65, 'F', att=0.6, rel=0.3)
# the water boards: the people gather on the dike in the morning, the alto's tune; the stretches staked, a mallet on each stake
# (cp_bankStakes: from st + 0.5, half a second apart), and the baritone copying the tune
wind(gt, st - gt + 0.4, 0.006, 0.0, 3)
phrase('alto', BOARDS, gt + 0.4, 0.8, 'F', step=0.42, last=1.3)
for k in range(4):
    stake(st + 0.9 + 0.5 * k, 0.016 if k < 2 else 0.011, px(560 + 260 * k))
_st = min(0.42, (ae + 0.05 - (st + 0.3) - 0.9) / 4)
phrase('bari', [m - 12 for m in BOARDS], st + 0.3, 0.75, 'F', step=_st, last=0.9)
# from above, the three lands and their stretches: a note for each, as long as its stretch (11, 6 and 3.5 of CP_TS's units)
for i, (inst, m, ln) in enumerate((('bari', 41, 11), ('ten', 48, 6), ('alto', 57, 3.5))):
    note(inst, m, ae + 0.2 + 0.45 * i, 3.0 * ln / 11, 0.65, 'F', att=0.25, rel=0.4)
# every year the board walks the dikes (cp_boardWalk, from bw + 0.2): steps on the grass, the staff on the bare clay twice, the clerk's
# notch, the landowner coming up, and his coin
s0 = bw + 0.2
walk(s0, 2.2, 0.007, -0.4, 0.0); staff(s0 + 2.2, 0.014, px(1000)); staff(s0 + 2.825, 0.011, px(1000))
notch(s0 + 2.8, 0.008, px(860)); walk(s0 + 2.8, 1.5, 0.006, 0.5, 0.2); coin(s0 + 4.4, 0.006, px(1240))
note('ten', 45, s0 + 2.2, 1.6, 0.55, 'F', att=0.2, rel=0.5)
# whoever relies on the dikes pays for them, and has a say: interest, payment and a say, a card and a voice each; F major, held as the
# farm behind kept dikes comes, the baritone under it
for t0, x_, (inst, m) in zip((relies, paysW, sayW), (560, 960, 1360), (('ten', 53), ('alto', 57), ('sop', 60))):
    pat(t0 + 0.2, 0.012, px(x_)); note(inst, m, t0 + 0.1, sf + 0.4 - t0 - 0.1, 0.6, 'F', att=0.25, rel=0.6)
note('bari', 41, sf + 0.2, ch - 0.1 - sf - 0.2, 0.6, 'F', att=0.5, rel=0.3)
phrase('sop', [60, 62, 60, 57], sf + 1.1, 0.55, 'F', step=0.6, last=1.4)
plough(sf, ch - sf + 0.3, 0.006, px(1200))
# Rijnland's charter, its seal on a cord: B-flat, then F as the year comes
paper(ch + 0.1, 0.012, 0.0, 0.6)
for k, (inst, m0, m1) in enumerate((('bari', 46, 41), ('ten', 50, 48), ('alto', 53, 57))):
    line(inst, [(ch + 0.2 + 0.15 * k, since + 0.1, m0, 1.0), (since + 0.1, td + 0.5, m1, 1.0)], 0.6, 'F', 0.8, att=0.4, rel=0.6)
# today: the road on the dike, two people cycling towards us, the pumping station; the tune on the soprano, lighter
bike(td + 0.2, 3.4, 0.006, 0.4, 0.1); bike(td + 0.6, 3.2, 0.005, -0.3, -0.05); hum(td, sm - td + 0.4, 0.003, px(1500))
phrase('sop', [m + 12 for m in BOARDS], td + 0.5, 0.6, 'F', step=0.38, last=1.1)
# the same with data: the dike from above, every stretch kept: the opening's open F again, softly
wind(sm, pj - sm + 0.3, 0.006, 0.0, 4)
line('bari', [(sm + 0.1, pj + 0.3, 41, 1.0), (pj + 0.3, tr + 0.4, 37, 1.0)], 0.55, 'F', 0.8, att=0.6, rel=0.6)
line('ten', [(sm + 0.4, pj + 0.5, 48, 1.0), (pj + 0.5, tr + 0.4, 44, 1.0)], 0.55, 'F', 0.8, att=0.6, rel=0.6)
# Yusuf's board: the bar's three parts washed in (cp_board's fill, from pj + 0.3, 0.4 s apart); D-flat, the university, the F held
for j in range(3):
    marker(pj + 0.4 + 0.4 * j, 0.010, -0.3 + 0.3 * j, 0.6)
note('alto', 53, pj + 0.7, tr + 0.4 - pj - 0.7, 0.6, att=0.5, rel=0.6)
# kept up, everyone can trust the data: the two reports ticked, joined in gold, and two voices meeting on one note
tick(trustW - 0.2, 0.011, -0.3); tick(trustW - 0.05, 0.010, 0.3); marker(trustW + 0.05, 0.012, 0.0, 0.8)
line('alto', [(trustW - 0.4, trustW + 0.45, 56, 0.8), (trustW + 0.45, breath + 0.2, 53, 0.8)], 0.7, att=0.2, rel=0.5)
line('ten', [(trustW - 0.4, trustW + 0.45, 49, 0.8), (trustW + 0.45, breath + 0.2, 53, 0.8)], 0.7, att=0.2, rel=0.5)
# the title, and the mark: the alto, then the baritone copying it, its last note, F, held into the university's D-flat
mark('alto', 53, breath + 0.6, 0.85)
mark('bari', 41, breath + 0.6 + 1.8 + 0.1, 0.85, last=S0('ends') + 0.2 - (breath + 0.6 + 1.9 + 1.35))

# 2. When the project ends, in D-flat: the floor in December, the alto taking the baritone's F as the chord comes; "sent", the two
#    reports ticked and joined; the planner's flag, and one low note that stops, as the project ends in June; a knock at the open door,
#    Yusuf's steps; the question left open, on the alto; the report opened, each line ticked, and a low note for nothing after June;
#    the drift, the tenor slipping a semitone as the light goes amber, then red; the dike nobody walks, the open F, bleak, and the
#    wind; next year imagined, two voices starting on one note and parting; the report closed, and slid back across the desk
ew = lambda lid, word, off=0: W('ends', lid, word, off)
ec = lambda lid, off=0: G('ends', lid, off)
e0 = S0('ends')
wentIn, same, endsJ, isnt, cantSee = ew('went', 'went in'), ew('went', 'the same'), ew('budget', 'ends in June'), ew('cant', "isn't"), ew('cant', "can't see")
lists, nothing, likeD, notWhat = ew('report', 'lists'), ew('report', 'nothing after'), ew('drift', 'like a dike'), ew('needs', 'not what')
dv, yk, rp, dr, lk, ag, nd = ec('budget', -0.4), ec('cant', -0.3), ec('report', -0.3), ec('drift', -0.3), likeD - 0.3, ec('again', -0.3), ec('needs', -0.3)
note('alto', 53, e0 - 0.3, 3.7, 0.6, att=0.6, rel=0.6); note('ten', 44, e0, 3.4, 0.6, att=0.6, rel=0.6); note('bari', 37, e0 + 0.35, 3.05, 0.6, att=0.6, rel=0.6)
knock(wentIn + 0.4, 0.014, px(1146), 260); tick(same + 0.1, 0.011, px(440)); tick(same + 0.25, 0.010, px(939)); marker(same + 0.15, 0.011, px(690), 0.8)
pin(endsJ + 0.1, 0.020, px(1500))
note('bari', 37, endsJ + 0.05, 1.3, 0.85, att=0.08, rel=0.25)
knock(yk + 0.35, 0.016, px(1766), 210); knock(yk + 0.6, 0.012, px(1766), 210)
walk(ec('lose'), 0.9, 0.006, px(1766), px(1560))
pat(cantSee + 0.05, 0.010, px(800))
line('alto', [(END('ends', 'lose') + 0.1, END('ends', 'lose') + 0.6, 56, 0.8), (END('ends', 'lose') + 0.6, END('ends', 'lose') + 1.9, 58, 0.8)], 0.7, att=0.15, rel=0.5)
flap(rp + 0.3, 0.012, 0.0, 0.6)
for j in range(7):
    tick(lists + 0.15 + 0.3 * j, 0.010 if j < 2 else 0.006, -0.3)
note('ten', 44, nothing + 0.1, 1.6, 0.7, att=0.3, rel=0.7)
line('ten', [(dr + 1.0, dr + 2.2, 56, 0.8), (dr + 2.2, min(dr + 3.4, lk - 0.3), 55, 0.8)], 0.65, att=0.3, rel=0.5)
wind(lk, ag - lk + 0.4, 0.008, 0.0, 5)
chord({'bari': 41, 'ten': 48}, lk + 0.3, ag - 0.3, 0.55, 'F', step=0.3, att=0.6, rel=0.5)
line('alto', [(ag + 0.2, ag + 0.9, 53, 0.8), (ag + 0.9, ag + 2.4, 54, 0.8)], 0.65, att=0.3, rel=0.6)
line('bari', [(ag + 0.2, ag + 0.9, 53, 0.8), (ag + 0.9, ag + 2.4, 52, 0.8)], 0.65, att=0.3, rel=0.6)
pencil(ag + 1.05, 0.010, px(800), 0.4)
flap(nd + 0.2, 0.012, 0.0, 0.6); slide(notWhat - 0.1, 0.016, 0.1, 1.2)

# 3. What, not who: Noor's room, Yusuf's steps, and D-flat at the chapter's turn; his three cards pinned at the top of the map, a voice
#    each; Noor's marker; the test's three chips, each card failing it, and moving down the map, the tenor stepping down with each;
#    Holland: the water boards' tune, then the open F over the dry fields; govern data in gold, underlined, all four voices
ww = lambda lid, word, off=0: W('what', lid, word, off)
wc = lambda lid, off=0: G('what', lid, off)
w0 = S0('what')
gteam, gloss, stew, restr, sysW, proc = ww('three', 'the governance'), ww('three', 'the glossary'), ww('three', 'the stewards'), ww('test', 'a restructure'), ww('test', 'a new system'), ww('test', 'a new process')
reorg, glossR, meet, govD = ww('fail', 'reorganised'), ww('fail', 'a glossary'), ww('fail', 'a meeting'), ww('govern', 'govern data')
ts, down, wb, wd, wg = wc('tests', -0.3), wc('down'), wc('board', -0.3), wc('dry', -0.4), wc('govern', -0.3)
walk(w0 + 0.4, 1.4, 0.006, 0.8, 0.5)
chord({'ten': 44, 'alto': 53}, w0 + 0.2, w0 + 2.6, 0.55, step=0.3, att=0.6, rel=0.6)
for t0, x_, (inst, m) in zip((gteam, gloss, stew), (980, 1150, 1320), (('alto', 56), ('ten', 53), ('bari', 49))):
    pin(t0 + 0.2, 0.020, px(x_)); note(inst, m, t0 + 0.15, 0.9, 0.65, att=0.12, rel=0.4)
tap(ts + 0.55, 0.010, px(1250))
for k, t0 in enumerate((restr, sysW, proc)):
    knock(t0 + 0.1, 0.010, px(1100 + 120 * k), 300)
for t0 in (reorg, glossR, meet):
    paper(t0 + 0.05, 0.010, 0.2, 0.3)
for j in range(3):
    air(down + 0.1 + 0.3 * j, 0.9, 0.008, 0.1)
figure('ten', [56, 53, 49], down + 0.15, 0.3, 0.75, sec=0.5, fall=0.92)
wind(wb, wg - wb, 0.006, 0.0, 6)
phrase('alto', BOARDS, wb + 0.3, 0.75, 'F', step=0.4, last=1.1)
chord({'bari': 41, 'ten': 48}, wd + 0.3, wg + 0.4, 0.55, 'F', step=0.3, att=0.6, rel=0.6)
chord({'bari': 37, 'ten': 44, 'alto': 53, 'sop': 61}, govD - 0.15, govD + 2.8, 0.65, step=0.15, att=0.4, rel=0.7)
marker(govD + 0.5, 0.012, px(1123), 0.8)

# 4. Seven, and one more: a pin for each card as it's named (the first few, then softer); a token from each film, a knock each, and a
#    chord for this term; two sheets slid onto the desk, the wheel's parts lit, the list ticked, and the one it finds, ringed, with
#    the alto's question; the eighth card pinned, its empty corner dashed in, and the baritone's low D-flat alone: nobody does it yet
sw_ = lambda lid, word, off=0: W('seven', lid, word, off)
sc_ = lambda lid, off=0: G('seven', lid, off)
twoF, asCk, oneMore = sw_('check', 'two frameworks'), sw_('check', 'as checklists'), sw_('more', 'one more')
ck, kr, yet = sc_('check', -0.3), sc_('more', 2.6), sc_('yet')
for j in range(7):
    pin(sc_('c%d' % (j + 1)) + 0.15, 0.018 if j < 3 else 0.011, px(408 + 374 * (j % 4) + 175))
for j in range(7):
    knock(sc_('term') + 0.45 + 0.2 * j, 0.010 if j < 2 else 0.006, px(560 + 374 * (j % 4)), 300)
chord({'bari': 37, 'ten': 44, 'alto': 53}, sc_('term') + 0.3, sc_('term') + 2.7, 0.55, step=0.2, att=0.5, rel=0.6)
slide(ck + 0.15, 0.014, -0.4, 0.7); slide(twoF + 0.05, 0.014, 0.4, 0.7)
for k in range(10):
    if k != 5:
        tap(asCk + 0.12 * k + 0.1, 0.008 if k < 3 else 0.004, -0.4)
for j in range(7):
    tick(asCk + 0.3 + 0.22 * j, 0.009 if j < 2 else 0.005, 0.4)
pencil(oneMore + 0.3, 0.011, 0.4, 0.6)
line('alto', [(oneMore + 0.1, oneMore + 0.6, 56, 0.8), (oneMore + 0.6, oneMore + 1.9, 58, 0.8)], 0.65, att=0.15, rel=0.5)
pin(kr + 0.45, 0.020, px(1530))
for k in range(4):
    pencil(yet + 0.1 + 0.12 * k, 0.007, px(1700), 0.1)
note('bari', 37, yet + 0.1, 1.8, 0.75, att=0.2, rel=0.6)

# 5. Coloured by evidence: each note of evidence pinned under its card, and its colour washed in; the key laid down. The green ones
#    rising, one voice, four soft notes; the two amber ones, the tenor held; the red one, the baritone alone, low; and as the gold rings
#    go round the red card and the two amber ones, where the money should go, a chord, from G-flat home to D-flat. Then Holland: the
#    board walking its dike, the staff on bare clay, the notch and the coin, to the water boards' tune; and the morning's scorecard
cw_ = lambda lid, word, off=0: W('colour', lid, word, off)
cc_ = lambda lid, off=0: G('colour', lid, off)
evid, uses, mayRead, learner, moneyW = cw_('colour', 'with evidence'), cw_('amber', 'who uses'), cw_('amber', 'who may read'), cw_('red', 'learner'), cw_('money', 'the money')
walkC, nightC = cc_('walk', -0.3), cc_('night', -0.3)
greens = [cc_('green', 0.4 + 0.55 * k) for k in range(4)]
when = {0: evid, 2: mayRead, 4: uses, 7: learner}
when.update({j: greens[i] for i, j in enumerate((1, 3, 5, 6))})
for i, j in enumerate(sorted(when, key=when.get)):
    pin(when[j] + 0.25, 0.018 if i < 3 else 0.011, px(583 + 374 * (j % 4)))
paper(cc_('key', -0.1), 0.012, 0.0, 0.5)
figure('sop', [56, 61, 65, 68], greens[0] + 0.2, 0.55, 0.6, sec=0.45, fall=0.95)
line('ten', [(uses + 0.2, mayRead + 0.2, 51, 1.0), (mayRead + 0.2, mayRead + 1.5, 54, 1.0)], 0.6, att=0.2, rel=0.5)
note('bari', 37, learner + 0.2, 1.8, 0.75, att=0.2, rel=0.6)
for k, d in enumerate((0.1, 0.5, 0.7)):
    marker(moneyW + d, 0.011 if k == 0 else 0.008, px([1705, 1331, 583][k]), 0.8)
chord({'bari': 42, 'ten': 49, 'alto': 58}, moneyW - 0.1, moneyW + 1.3, 0.6, step=0.15, att=0.4, rel=0.3)
chord({'bari': 37, 'ten': 49, 'alto': 56}, moneyW + 1.3, moneyW + 2.8, 0.6, step=0.0, att=0.3, rel=0.6)
s5 = walkC - 2.0  # cp_boardWalk(x, tt, cw - 2.0): the walkers are on their way at the cut
walk(walkC, s5 + 2.2 - walkC, 0.006, -0.3, 0.0); staff(s5 + 2.2, 0.013, px(1000)); staff(s5 + 2.825, 0.010, px(1000))
notch(s5 + 2.8, 0.008, px(860)); walk(s5 + 2.8, 1.5, 0.006, 0.5, 0.2); coin(s5 + 4.4, 0.005, px(1240))
wind(walkC, nightC - walkC + 0.3, 0.006, 0.0, 7)
phrase('alto', BOARDS, walkC + 0.3, 0.7, 'F', step=0.42, last=1.2)
paper(nightC + 0.2, 0.010, px(1180), 0.4)
chord({'bari': 37, 'ten': 44, 'alto': 53}, nightC + 0.3, nightC + 2.7, 0.55, step=0.2, att=0.5, rel=0.6)

# 6. What people can ask for: Clara at Planning, the number ringed in pencil, her question; Anil's screen, locked; the services, a pin
#    and a dotted line each as it's named (the first few, then softer), each card turned over to its promise in turn, the alto
#    climbing with them, and the new term's promise lit gold, a chord; Holland, a landowner's hand raised for his say, F; the stewards'
#    meeting, "reviewed" and its tick, and D-flat
aw = lambda lid, word, off=0: W('ask', lid, word, off)
ac = lambda lid, off=0: G('ask', lid, off)
tenW, hasSay = aw('ten', 'ten working'), aw('say', 'has a say')
hp, fx, sy, rv, promise = ac('help', -0.3), ac('help', 1.3), ac('say', -0.3), ac('review', -0.3), ac('promise')
pencil(hp + 0.15, 0.010, px(1006), 0.7); pat(ac('help') + 0.05, 0.010, px(471))
lock(fx + 0.3, 0.010, px(650)); pat(fx + 0.25, 0.010, px(1110))
for j in range(7):
    s_j = ac('s%d' % (j + 1))
    pin(s_j + 0.1, 0.016 if j < 2 else 0.009, px(40 + 264 * j + 124)); pencil(s_j + 0.25, 0.006 if j < 2 else 0.004, px(40 + 264 * j + 124), 0.6)
for j in range(7):
    flip(promise + 0.15 + 0.22 * j, 0.010 if j < 2 else 0.006, px(40 + 264 * j + 124))
figure('alto', [56, 58, 60, 61, 63, 65, 68], promise + 0.25, 0.22, 0.55, sec=0.2, fall=0.97)
chord({'bari': 37, 'ten': 44, 'alto': 53, 'sop': 61}, tenW - 0.25, tenW + 2.3, 0.6, step=0.15, att=0.4, rel=0.6)
wind(sy, rv - sy + 0.3, 0.006, 0.0, 8)
chord({'ten': 48, 'alto': 57}, hasSay - 0.6, hasSay + 1.6, 0.55, 'F', step=0.2, att=0.4, rel=0.6)
pen(ac('review', 0.4), 0.009, 0.1, 0.9); tick(ac('review', 1.2), 0.010, 0.2)
chord({'bari': 37, 'ten': 44, 'alto': 53}, ac('review', 1.15), ac('review', 3.6), 0.6, step=0.15, att=0.4, rel=0.7)

# 7. A line every year: the one page, its three lines lit; the new line in the budget written in pen, and the baritone's long note for
#    it, drawn out, as the line runs on past June on the planner, the other voices joining it on "the capability's"; the gold thread
#    from the budget to govern data and on to every capability, the alto rising along it; and the red card first, the low D-flat
lw = lambda lid, word, off=0: W('line', lid, word, off)
lc = lambda lid, off=0: G('line', lid, off)
ptime, tools, aLine, capab, which, red = lw('time', "people's time"), lw('time', 'the tools'), lw('budget', 'a line'), lw('budget', "the capability's"), lw('money', 'whichever'), lw('first', 'the red card')
pl, mn = capab - 0.4, lc('money', -0.3)
for k, t0 in enumerate((ptime, ptime + 0.5, tools)):
    marker(t0 + 0.05, 0.010 if k < 2 else 0.008, 0.0, 0.6)
pen(aLine + 0.05, 0.010, 0.2, 1.5)
note('bari', 37, aLine + 0.05, pl + 2.4 - aLine, 0.75, att=0.5, rel=0.8)
chord({'ten': 44, 'alto': 53}, capab - 0.1, pl + 2.4, 0.55, step=0.2, att=0.5, rel=0.8)
marker(pl + 0.3, 0.010, px(1300), 1.8)
pin(mn + 0.45, 0.016, px(400)); air(mn + 0.6, which + 1.0 - mn - 0.6, 0.008, -0.2)
phrase('alto', [49, 53, 56, 61], mn + 0.7, 0.55, step=max(0.3, (which + 1.0 - (mn + 0.7)) / 3), last=1.2)
pencil(red - 0.1, 0.010, px(1700), 0.5)
note('bari', 37, red, 1.6, 0.75, att=0.2, rel=0.6)

# 8. What it keeps: the storm of 1953 at night, the wind and the sea on the dike; the storm barrier rising in stages, its piers, its
#    road, its gates set down, the quartet building F major with them, and closing on a cadence as "projects end"; the last crane
#    driving off. Today, rain, two of the board's people walking a dike and testing its side, and the handed note: keeping the land dry
#    never ended. June: the project's card off the planner, the line staying; what it built stays, D-flat, the note still held; next
#    November, imagined, the reports ticked and joined, the glossary's card and the office hours' on the glass; the end card, the mark,
#    the alto, then the baritone, and the chord held to the end
kw = lambda lid, word, off=0: W('keeps', lid, word, off)
kc = lambda lid, off=0: G('keeps', lid, off)
k0 = S0('keeps')
big, projE, juneW, keepsIt, agree, meanW, askW = kw('floods', 'big projects'), kw('floods', 'and projects end'), kw('june', 'June'), kw('stays', 'something keeps'), kw('nov', 'agree'), kw('gives', 'one meaning'), kw('gives', 'someone to ask')
bp, tr8, jn, sy8, nv = big - 0.5, kc('never', -0.3), kc('june', -0.3), kc('stays', -0.3), kc('nov', -0.3)
gale(k0, bp - k0 + 0.6, 0.014, 0.0)
rumble(bp + 0.1, 2.2, 0.010, 0.0)
for k in range(4):
    gate(bp + 0.3 + 0.45 * k, 0.010 if k < 2 else 0.006, px(500 + 300 * k))
gate(bp + 4.3, 0.014, 0.0)
lap(bp, tr8 - bp + 0.3, 0.006, 0.2, 3)
engine(projE + 0.2, 2.8, 0.006, 0.2, 0.8)
# (the piers rise from bp + 0.1, the gates come down from bp + 2.8 and are shut by bp + 4.4: I as the piers rise, V as the gates come
# down, and I, closing, as they're shut). The baritone sounds each chord's root afresh, as the piers and gates move; the others slur
for k, (inst, ms) in enumerate((('bari', (41, 48, 41)), ('ten', (48, 52, 53)), ('alto', (57, 55, 57)), ('sop', (60, 60, 60)))):
    segs = [(bp + 0.2 + 0.4 * k, bp + 2.9, ms[0], 1.0), (bp + 2.9, bp + 4.3, ms[1], 1.0), (bp + 4.3, tr8 + 0.2, ms[2], 1.0)]
    for sg in ([[x] for x in segs] if inst == 'bari' else [segs]):
        line(inst, sg, 0.6, 'F', 0.8, att=0.4 if sg[0] is segs[0] else 0.12, rel=0.6 if sg[-1] is segs[-1] else 0.25, tie=True)
stop = tr8 + 2.0  # the rainy dike: the second walker stops and tests the side with his staff (scenes.js: stop + 0.2, 1.5 taps a second)
rain(tr8, jn - tr8 + 0.4, 0.008, 0.0)
walk(tr8 + 0.1, 1.9, 0.006, -0.2, 0.1)
staff(stop, 0.010, 0.1)
for k in range(1, 8):
    t0 = stop + 0.2 + k / 1.5
    if t0 > jn - 0.1:
        break
    staff(t0, 0.009 if k < 3 else 0.006, 0.1)
hand(53, [('alto', kc('never', 0.1)), ('ten', kc('never', 1.4)), ('bari', kc('never', 2.7), kc('never', 4.1))], 0.6, 'F')
peel(juneW + 0.25, 0.012, px(1300))
chord({'bari': 37, 'ten': 44, 'alto': 53}, keepsIt - 0.1, keepsIt + 2.3, 0.6, step=0.2, att=0.5, rel=0.7)
tick(kc('nov', 0.85), 0.010, -0.3); tick(kc('nov', 1.0), 0.009, 0.3); marker(agree + 0.05, 0.011, 0.0, 0.8)
pat(meanW, 0.010, px(1150)); pat(askW, 0.010, px(1220))
end = kc('breath')
mark('alto', 49, end + 0.7, 0.85, 'Db')
mark('bari', 37, end + 0.7 + 1.8 + 0.1, 0.85, 'Db', last=TOT - (end + 0.7 + 1.9 + 1.35))
chord({'ten': 53, 'alto': 56}, end + 0.7 + 1.9 + 1.35, TOT, 0.55, step=0.2, att=0.6, rel=0.5)
# the noises' filters have soft edges, so last of all the whole score is low-passed, to keep everything under the voice below about 2.5 kHz
soften(2500)
