# Who does what, end to end: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series' second film (PLAYBOOK.md: vary the sound itself; A capability, not a project has its saxophone quartet,
# Governance principles' films their brass and music box, recorders and marimba, piano, strings and clarinet, glass harmonica and
# handbells, guitar, electric piano and flute, the double reeds, organ and timpani, and Governance you can use takes none of ours):
# four voices humming, alto, tenor, baritone and bass, lips closed, on "mm", made here (music.py's choir sings "oo" and "ah", with
# vibrato and three voices to a note), one voice to a note, softly and low.
#  - The film is about roles, so each role has a short phrase of its own, and the phrase stays whoever sings it. In Madrid, Palma's
#    request is a phrase on the alto, A-C-D-E, that rises and isn't answered; as most of his slips come back, it falls a step; as the
#    door closes on the millions who use his words, it's cut off, on a bare fifth; and in Lima, seventeen years on, it rises again,
#    still unanswered.
#  - As the academies join in 1951, the four voices come in one at a time, from the lowest, and meet on A major: the academies' chord.
#    Today's steps get one phrase each, handed down from voice to voice: the member who proposes (the alto), the commission that drafts
#    (the baritone), the academy that approves (the bass), and all four answering in the academies' chord as the word goes in. As
#    "to budget" is found in the year's list, Palma's phrase comes back as it was in 1892, and this time the chord answers it.
#  - At the university, in E-flat, Clara's request is the same phrase on the alto, E-flat-G-A-flat-B-flat, and each step answers it in
#    its own voice: the steward's three falling notes on the tenor, the owner's cadence on the baritone, the glossary's one low note on
#    the bass; as every copy follows, the bass's note is copied up through the other voices. The agent's step is the only sound in the
#    score that isn't a voice: a soft, pure tone, a little apart, because the agent is software, not a person.
#  - When Mei is on leave, her phrase is sung by the baritone, an octave lower, unchanged, and comes back to the tenor on her return.
#    The glossary's list gets a chord at each week's turn. At the end, Clara's six steps light on six notes of her phrase, rising, and
#    it closes on the chord the academies sang.
#  - The series' mark, four notes, 1-5-4-8, on the alto, answered by the bass, plays under the title and the end card.
#  - A minor for Madrid and Lima, A major as the academies join; E-flat major for the university. The two keys share no note, so a
#    voice in one always stops before a voice in the other starts.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, the dictionary's, and after it only at a
#    chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that
#    after the opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Under the narration, only the two lowest voices hum, the baritone no higher than E (165 Hz): the alto and the tenor sit where the
#    narrator speaks, so their phrases go in the pauses between the lines (see the times below, each from the line it follows).
#  - Nothing trembles, pulses or beats: no urgent pulse; each voice is one voice, with no vibrato and no tremolo; every chord is tuned
#    pure (just intonation, see hz()), and a note two voices share is the same pitch exactly. Nothing imitates the music of another
#    culture: no guitar, no Andean flute, no tune or rhythm of Spain or Peru; the story is told in the series' own voice.
#  - Nothing loops. Where the picture repeats (the slips, the cards, the ticks, the hands), the sound plays the first few, then softer.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed: change one, change both.
# And everything stays low and soft: paper slips passed along a table, a ribbon untied, a pen on paper, red ink struck through a word,
# a heavy door closing far off, a letter sealed, chairs pushed back as delegates stand, cards set down, a show of hands, a phone's soft
# tap, footsteps on the floor as the request travels, keys, ticks, pins in a board, a page signed, cards dropped in a box, all below
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
R1 = np.random.default_rng(1202)  # this film's own randomness: the room, the paper, the pen

# ---- tuning: just intonation from the key's own note, so a chord's notes are whole-number ratios of each other and nothing beats.
# Madrid and Lima are in A (minor, then major); the university in E-flat. The keys share no note, and no voice holds across the change.
# The chords on the second degree are left out (their fifths aren't pure here), and so is B with F-sharp in A
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEYS = {'A': (45, 110.0), 'Eb': (39, 77.782)}  # each key's own note (MIDI) and its pitch: A2, and E-flat 2
def hz(m, k='Eb'):
    t, f = KEYS[k]; o, pc = divmod(m - t, 12)
    return f * 2 ** o * _JI[pc]

# ---- the levels: the voices sit about as far under the narrator as the series' other films' music (each matched by loudness, not
# by peak); the effects about 12 dB under the music (FX scales them all)
RL, FX = 0.028, 1.3
LEVEL = {'alto': 1.2, 'ten': 1.2, 'bari': 1.15, 'bass': 1.15, 'agent': 0.5}
PAN = {'alto': -0.28, 'ten': -0.1, 'bari': 0.1, 'bass': 0.26}  # as a quartet stands: the alto on the left, the bass on the right

# ---- the voices. A hum is a voice with the lips closed: every harmonic of its pitch, falling away above the first few (a soft
# voice's source), shaped by the nose's resonance (near 250 Hz for the bass, 320 for the alto), two weak ones above it, and a dip
# where the closed mouth swallows the sound (near 800 to 1000 Hz); the harmonics above about 2.3 kHz are left out, and those under
# about 100 Hz a little weakened, so the bass's lowest notes carry on a phone's small speaker, through their harmonics. A little air through
# the nose as each note starts; the pitch rises from a few cents under in its first twentieth of a second, as a voice finds its note,
# and then holds, with no vibrato; the level drifts by a few per cent, slowly and unevenly, as a held breath does. The four stand in
# one small room, which rings on for about a second and a quarter: the whole music bus is played into it at once, last of all (room())
VOX = {  # the nasal resonance (Hz, width); two weak ones above it (Hz, width, weight); the dip (Hz, width); the onset
    'alto': ((320, 300), [(1250, 420, 0.12), (2250, 500, 0.035)], (1000, 300), 0.10),
    'ten': ((285, 260), [(1120, 400, 0.13), (2150, 500, 0.04)], (900, 280), 0.11),
    'bari': ((265, 220), [(1050, 380, 0.14), (2050, 480, 0.045)], (850, 260), 0.12),
    'bass': ((250, 190), [(1000, 360, 0.15), (2000, 460, 0.05)], (800, 250), 0.13)}
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.25)).astype(np.float32))(np.arange(int(1.25 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.016 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _harm(inst, f, soft=1.0):
    """the weights of a hummed note's harmonics, at f Hz (soft < 1: darker)"""
    (c1, b1), up, (cz, bz), _ = VOX[inst]; n = max(1, int(2300 // f)); k = np.arange(1, n + 1); fk = f * k
    r = 1 / np.sqrt(1 + ((fk - c1) / (b1 / 2)) ** 2) + sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in up) + 0.01
    r = r * (1 - 0.8 * np.exp(-((fk - cz) / (bz / 2)) ** 2))
    a = r * k ** -(0.85 + 0.6 * (1 - soft)) * np.clip((2300 - fk) / 300, 0, 1) * (fk / 100) / np.sqrt(1 + (fk / 100) ** 2)
    return a / np.sqrt((a ** 2).sum())
def line(inst, segs, g=1.0, k='Eb', soft=1.0, att=None, rel=0.22, pan=None, tie=False):
    """one singer's line: segs is [(start, end, note, level)], each note slurred into the next, and the same note again re-sung
    unless tie; a rest (note None) breaks it"""
    run = []
    for s in list(segs) + [(None, None, None, 0)]:
        if s[2] is None:
            if run:
                _line(inst, run, g, k, soft, att, rel, PAN[inst] if pan is None else pan, tie)
            run = []
        else:
            run.append(s)
def _line(inst, segs, g, k, soft, att, rel, pan, tie):
    T0, T1 = segs[0][0], segs[-1][1]; att = att or VOX[inst][3]; gl = 0.07
    assert all(b > a for a, b, _, _ in segs), '%s: a note ends before it starts, %s' % (inst, [(round(a, 2), round(b, 2), m) for a, b, m, _ in segs])
    n = int((T1 - T0 + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    fs = [hz(m, k) for _, _, m, _ in segs]; A = [_harm(inst, f, soft) for f in fs]; K = max(len(a) for a in A)
    A = [np.pad(a, (0, K - len(a))) for a in A]
    kx, kf, ka, kv = [], [], [], []
    for i, (a, b, m, v) in enumerate(segs):  # each note steady between short glides, its harmonics' weights with it
        for t in ((a - T0 + gl / 2 if i else 0.0), (b - T0 - gl / 2 if i < len(segs) - 1 else n / SR)):
            kx.append(t); kf.append(np.log2(fs[i])); ka.append(A[i]); kv.append(v)
    lf = np.interp(x, kx, kf) + np.log2(1 - 0.009 * np.exp(-x / 0.05))
    ph = 2 * np.pi * np.cumsum(2 ** lf) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > T1 - T0, np.cos(0.5 * np.pi * np.minimum((x - (T1 - T0)) / rel, 1)) ** 2, 1.0)
    for i in range(1, len(segs)):  # the same note again: a breath between, for a moment
        if segs[i][2] == segs[i - 1][2] and not tie:
            e = e * (1 - 0.7 * np.exp(-((x - (segs[i][0] - T0)) / 0.04) ** 2))
    dr = filt(R1.standard_normal(n).astype(np.float32), 'low', 0.8); dr = 1 + 0.04 * dr / (np.abs(dr).max() + 1e-9)  # the breath's drift
    lev = np.interp(x, kx, kv) * dr; ka = np.array(ka); s = np.zeros(n)
    for j in range(K):  # the higher harmonics come in a little after the lower and go a little before: softer is darker
        aj = np.interp(x, kx, ka[:, j])
        if aj.max() > 1e-4:
            s += aj * e ** (1 + 0.12 * j) * np.sin((j + 1) * ph + 0.7 * j * j)
    s = s * lev + 0.010 * filt(noise(n / SR + 0.01)[:n], 'band', (200, 1400)) * e * lev * (1 + 3 * np.exp(-x / 0.06))
    put(filt(s.astype(np.float32), 'low', 2300), T0, g * RL * LEVEL[inst], pan)
def note(inst, m, s, sec, g=1.0, k='Eb', **o):
    """one held note"""
    line(inst, [(s, s + sec, m, 1.0)], g, k, **o)
def phrase(inst, notes, s, g=1.0, k='Eb', step=0.4, last=1.2, soft=1.0, rel=0.22):
    """notes slurred one after another, each step long, the last held"""
    d = [step] * (len(notes) - 1) + [last]; t = s; segs = []
    for m, dd in zip(notes, d):
        segs.append((t, t + dd, m, 1.0)); t += dd
    line(inst, segs, g, k, soft, rel=rel)
def chord(voices, a, b, g=0.8, k='Eb', step=0.12, att=0.3, rel=0.4):
    """a held chord, each voice coming in a moment after the one under it: voices is {singer: note}, lowest first"""
    for i, (inst, m) in enumerate(voices.items()):
        line(inst, [(a + step * i, b, m, 1.0)], g, k, 0.8, att=att, rel=rel)
def mark(inst, root, s, g=1.0, k='Eb', step=0.45, last=1.4):
    """the series' mark, 1-5-4-8"""
    phrase(inst, [root, root + 7, root + 5, root + 12], s, g, k, step, last)
def room(level=0.26):
    """the singers' room, last of all: the whole music bus played into it at once, as four voices stand in one room. (One room for
    all of them sounds the same as one for each line, and a held note's partials are measured as it's sung, not as the room's
    echo of it, which splits a short note's peak in two)"""
    for b in (ML, MR):
        b[:] = b + level * fftconvolve(b, _IR)[:len(b)].astype(np.float32)
AGENT = []
def agent(m, s, sec, g=0.8, pan=0.55):
    """the agent's step: a soft, pure tone, a little apart. It isn't a voice: one sine, no air, no rise to its pitch; and it isn't in the
    singers' room: it's placed after room(), with only a little of it"""
    AGENT.append((m, s, sec, g, pan))
def _agent(m, s, sec, g, pan):
    x = tt(sec); e = np.sin(0.5 * np.pi * np.minimum(x / 0.09, 1)) ** 2 * np.cos(0.5 * np.pi * np.clip((x - (sec - 0.4)) / 0.4, 0, 1)) ** 2
    sig = (np.sin(2 * np.pi * hz(m) * x) * e).astype(np.float32)
    sig = np.pad(sig, (0, len(_IR) - 1)) + 0.1 * fftconvolve(sig, _IR).astype(np.float32)
    put(sig.astype(np.float32), s, g * RL * LEVEL['agent'], pan)
# the phrases: Palma's request in A minor, rising, 1-3-4-5; Clara's the same in E-flat major; the steward's three falling notes, from
# the request's last; the owner's cadence, 5 to 1; and the academies' chord, root, fifth, octave and tenth, entering from the lowest
PALMA, CLARA, STEWARD, OWNER = [57, 60, 62, 64], [63, 67, 68, 70], [58, 56, 55], [46, 51]
ACAD = {'bass': 45, 'bari': 52, 'ten': 57, 'alto': 61}
ACAD_EB = {'bass': 39, 'bari': 46, 'ten': 51, 'alto': 55}

# ---- the sounds: paper, a pen, a door, cards, chairs, hands, keys, steps, pins and a box; all low-passed
def _swell(sec, rate, depth, seed):
    """a slow, uneven rise and fall, depth deep, about rate times a second"""
    x = tt(sec); r = np.random.default_rng(seed)
    m = filt(r.standard_normal(len(x)).astype(np.float32), 'low', rate); m = m / (np.abs(m).max() + 1e-9)
    return (1 - depth) + depth * (0.5 + 0.5 * m)
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a sheet arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.020, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def slip(s, sec=0.9, g=0.010, p0=0.0, p1=0.0):
    """a paper slip slid along a wooden table: a dry, soft slide that moves with it"""
    x = tt(sec); sig = filt(noise(sec), 'band', (300, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 1.2 * _swell(sec, 10, 0.4, int(s * 7) % 89)
    for j in range(4):
        a = j / 4; X(sig[int(a * len(sig)):int((a + 0.25) * len(sig))], s + a * sec, g * FX, p0 + (p1 - p0) * a)
def ribbon(s, g=0.010, pan=0.0, sec=0.8):
    """a ribbon untied: a soft pull, and the bundle's slips loosening"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1900))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * _swell(sec, 9, 0.5, 23), s, g * FX, pan)
    paper(s + 0.6 * sec, g * 0.7, pan, 0.35)
def pen(s, g=0.010, pan=0.0, sec=1.2):
    """a pen writing: short strokes, unevenly, never quite in time"""
    x = tt(sec); e = np.zeros(len(x), np.float32); t0 = 0.0
    while t0 < sec - 0.06:
        d = R1.uniform(0.05, 0.13); i, j = int(t0 * SR), min(len(x), int((t0 + d) * SR))
        e[i:j] = np.maximum(e[i:j], np.sin(np.pi * np.arange(j - i) / max(1, j - i)) * R1.uniform(0.5, 1.0)); t0 += d + R1.uniform(0.0, 0.05)
    X(filt(noise(sec), 'band', (500, 1900))[:len(x)] * e, s, g * FX, pan)
def strike(s, g=0.013, pan=0.0, sec=0.7):
    """a pen struck through a word in red ink: one firm stroke, slowing at its end"""
    x = tt(sec); e = np.sin(np.pi * np.clip(x / sec, 0, 1)) ** 0.6 * np.linspace(1.0, 0.7, len(x))
    X(filt(noise(sec), 'band', (420, 1800))[:len(x)] * e, s, g * FX, pan)
def door(s, g=0.018, pan=0.0):
    """a heavy door closing far off, down a corridor: a deep, soft thud, and the corridor ringing on, low"""
    x = tt(1.8); th = np.sin(2 * np.pi * 58 * x) * np.exp(-x * 8) + 0.5 * filt(noise(1.8), 'low', 240)[:len(x)] * np.exp(-x * 11)
    tail = filt(noise(1.8), 'low', 280)[:len(x)] * np.exp(-x * 2.6) * np.minimum(1, x / 0.03) * 0.3
    X(norm(filt((th + tail).astype(np.float32), 'low', 420)), s, g * FX, pan)
def seal(s, g=0.012, pan=0.0):
    """wax pressed on a letter: a soft, padded press, and the paper under it"""
    s_knock(s, g * FX, pan, 170); paper(s + 0.03, g * 0.45, pan, 0.2)
def chair(s, g=0.009, pan=0.0, sec=0.42):
    """a chair pushed back on a wooden floor: a low, short scrape"""
    x = tt(sec); X(filt(noise(sec), 'band', (110, 620))[:len(x)] * np.sin(np.pi * x / sec) * _swell(sec, 14, 0.6, int(s * 10) % 97), s, g * FX, pan)
def pat(s, g=0.014, pan=0.0):
    """a card set down, or pressed onto a board: a small, padded pat"""
    s_knock(s, g * FX, pan, 200); paper(s + 0.01, g * 0.35, pan, 0.12)
def sleeve(s, g=0.007, pan=0.0, sec=0.45):
    """a hand raised: a sleeve's soft swish"""
    x = tt(sec); X(filt(noise(sec), 'band', (200, 1200))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def book(s, g=0.014, pan=0.0):
    """a hand laid on a thick book, or the book set down: a deep, padded thump"""
    s_knock(s, g * FX, pan, 130); paper(s + 0.02, g * 0.25, pan, 0.15)
def pin(s, g=0.022, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.011, pan=0.0, sec=0.5):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def tick(s, g=0.011, pan=0.0):
    """a tick: two quick pencil strokes"""
    pencil(s, g, pan, 0.12); pencil(s + 0.13, g * 0.85, pan, 0.18)
def marker(s, g=0.012, pan=0.0, sec=0.8):
    """a marker drawn along a line, or round a number: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def slide(s, g=0.016, pan=0.0, sec=0.5):
    """a sheet, or a report, slid across a desk: a low, smooth slide, and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def flip(s, g=0.010, pan=0.0):
    """a card turned over, or a name changed on it: a quick breath of air and a small paper snap"""
    s_air(s, 0.28, g * 0.6 * FX, pan, 200, 1100); paper(s + 0.2, g * 0.5, pan, 0.12)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def peel(s, g=0.012, pan=0.0):
    """a sheet taken off a board: a short peel, and paper"""
    x = tt(0.3); X(filt(noise(0.3), 'band', (400, 1800))[:len(x)] * np.sin(np.pi * x / 0.3) ** 2 * np.linspace(0.6, 1, len(x)), s, g * FX, pan)
def keys(s, sec, g=0.006, pan=0.0):
    """typing, softly: muffled keys, unevenly"""
    t0 = 0.0
    while t0 < sec:
        tap(s + t0, g * R1.uniform(0.6, 1.0), pan); t0 += R1.uniform(0.09, 0.2)
def step(s, g=0.008, pan=0.0):
    """a footstep on the floor: a dull, low pat"""
    x = tt(0.14); X(norm(filt(noise(0.14), 'band', (90, 650)) * np.exp(-x * 34)), s, g * FX * R1.uniform(0.8, 1.0), pan)
def walk(s, sec, g=0.007, p0=0.0, p1=0.0, per=0.294):
    """someone walking, as gv_walk paints them: a step every 0.294 s"""
    n = int(sec / per)
    for k in range(n):
        step(s + k * per + 0.015 * R1.uniform(), g * (0.85 + 0.15 * (k % 2)) * min(1, (k + 1) / 2, (n - k) / 2), p0 + (p1 - p0) * k / max(1, n))
def sign(s, g=0.011, pan=0.0):
    """a signature: three quick strokes and a flourish"""
    for k, d in enumerate((0.0, 0.14, 0.26)):
        pencil(s + d, g * (1 - 0.15 * k), pan, 0.1)
    pencil(s + 0.38, g * 0.9, pan, 0.3)
def drop(s, g=0.014, pan=0.0):
    """paper dropped into a cardboard box: a soft, hollow thump, and the paper settling"""
    s_knock(s, g * FX, pan, 150); paper(s + 0.04, g * 0.6, pan, 0.4)

# =============================================================================================================================
# 1. Words that weren't in it: Madrid in 1892, by lamplight, in A minor. The academy at night, a bare fifth, low; the director's hand on
#    the dictionary, the chord under the fourth; Palma unties his bundle and passes his slips up the table, the fifth again, and as he
#    asks, his phrase on the alto, rising, unanswered. The slips come back, F major under them, and his phrase falls a step as he holds
#    one to the lamp. Lima, the schoolroom: the dictionary's chord again, and on the dominant as the word is struck out in red; the
#    millions with no way in, and the far door closing on his phrase, a bare fifth. Lima, 1909: the pen; his phrase again, still
#    unanswered; the letter sealed, and the bass alone: something has to change. Mexico City, 1951: the voices come in one at a time as
#    the delegates stand and Spain's card is set down, and the four meet on A major. Today: the steps, a phrase each, handed down from
#    voice to voice, and the academies' chord as the word goes in; twenty-three academies, the bus stop, a phone; the year's list, and
#    Palma's phrase as it was, answered by the chord. The university, E-flat, and the mark under the title
w_ = lambda lid, word, off=0: W('words', lid, word, off)
c_ = lambda lid, off=0: G('words', lid, off)
e_ = lambda lid, off=0: END('words', lid) + off
joins, dictW, more, among, budget = w_('palma', 'joins'), w_('palma', 'the dictionary'), w_('brings', 'more than'), w_('down', 'among'), w_('down', 'to budget')
wrongW, noway, assoc, spain, where = w_('wrong', 'count as wrong'), w_('millions', 'no way'), w_('y1951', 'form an association'), w_('y1951', 'Spain'), w_('propose', 'from where')
approves, view, free, every, everyone = w_('drafts', 'approves'), w_('drafts', 'gives its view'), w_('twenty', 'free online'), w_('anyone', 'every step'), w_('anyone', 'everyone')
s1b, up0, dn0, pick, s5, s7, breath = dictW - 0.4, more + 0.9, c_('down', 0.15), among - 0.2, c_('millions', -0.5), c_('later', -0.3), c_('breath')
s11, s13, o0, b0, s14 = c_('drafts', -0.3), view - 0.4, view + 0.5, view + 2.0, free - 0.4
shut = noway + 1.9  # ee_door: closing from P.noway + 0.2, over 1.7 s
# the academy at night: A and E, low, a bare fifth, the lamps' warmth; the director's hand on the dictionary, the chord under the
# fourth, D and A, its weight; then the fifth again. As the slips come back, F major; in Lima, the dictionary's chord again, and the
# dominant, E and B, as the word is struck out; the millions, F major, until the door shuts. The bass and the baritone each sing one
# line through all of it, slurring from chord to chord
b1, w1 = c_('brings', -0.2), c_('wrong', 0.3)
line('bass', [(0.3, s1b, 45, 1.0), (s1b, b1, 38, 1.0), (b1, dn0, 45, 1.0), (dn0, w1, 41, 1.0), (w1, wrongW + 0.1, 38, 1.0), (wrongW + 0.1, s5, 40, 1.0),
              (s5, shut, 41, 1.0)], 0.75, 'A', 0.8, att=1.4, rel=0.12)
line('bari', [(1.2, s1b, 52, 1.0), (s1b, b1, 45, 1.0), (b1, dn0 + 0.15, 52, 1.0), (dn0 + 0.15, w1, 48, 1.0), (w1, wrongW + 0.1, 45, 1.0),
              (wrongW + 0.1, s5 + 0.1, 47, 1.0), (s5 + 0.1, shut, 48, 1.0)], 0.7, 'A', 0.8, att=1.2, rel=0.12)
chair(joins + 0.5, 0.007, px(1290)); book(dictW + 0.35, 0.012, px(368))
# Palma unties the bundle (from c.brings + 0.3, over 0.8 s), and passes the slips up the table, one every 0.42 s from up0, each 1.5 s
# on its way: the first few heard, then softer, then not; as he asks, his phrase, in the pause after the line, rising, unanswered
ribbon(c_('brings', 0.3), 0.010, px(1450), 0.8)
for i in range(6):
    slip(up0 + 0.42 * i, 1.3, 0.010 if i < 3 else 0.005, px(1540), px(420 + 22 * i))
phrase('alto', PALMA, e_('brings', 0.08), 0.7, 'A', step=0.3, last=0.45)
# most come back to a pile at his elbow (from dn0, 0.16 s apart); he holds the last one up to the lamp, "to budget", and in the pause
# his phrase falls a step
for i in range(4):
    slip(dn0 + 0.16 * i, 0.9, 0.009 if i < 2 else 0.005, px(700), px(1490))
paper(pick + 0.45, 0.010, px(1450), 0.3)
line('alto', [(e_('down', 0.1), e_('down', 0.65), 64, 1.0), (e_('down', 0.65), c_('wrong', -0.3), 62, 1.0)], 0.65, 'A', 0.8, att=0.12, rel=0.25)
# Lima: the teacher's pen strikes the word out in red (from P.wrongW + 0.1, over 0.7 s), and the pupil looks up
strike(wrongW + 0.1, 0.013, px(960), 0.7)
# the millions who use the words, one picture after another (each from s5 + 0.15, 0.5 s apart); far off, the door closing on them,
# and Palma's phrase rising in the pause, cut off as the door shuts; the low voices stop with it, and come back on a bare fifth, A and E
for i, x_ in enumerate((500, 1000, 1430)):
    pat(s5 + 0.15 + 0.5 * i + 0.3, 0.010, px(x_))
line('alto', [(e_('millions', 0.12), e_('millions', 0.47), 57, 1.0), (e_('millions', 0.47), e_('millions', 0.82), 60, 1.0), (e_('millions', 0.82), shut, 62, 1.0)], 0.65, 'A', 0.85, att=0.1, rel=0.07)
door(shut, 0.012, 0.0)
chord({'bass': 45, 'bari': 52}, shut + 0.15, c_('later', 4.0), 0.6, 'A', step=0.0, att=0.3, rel=1.6)
# Lima, 1909: Palma, older, writes to a friend in Madrid (from s7 + 0.6, for 6.5 s); his phrase again in the pause, still unanswered,
# softer, alone; he seals the letter (from c.change + 0.4, over 0.5 s); and the bass comes in alone on A: something has to change
pen(s7 + 0.6, 0.008, px(900), 6.4)
phrase('alto', PALMA, e_('later', 0.1), 0.55, 'A', step=0.3, last=0.4)
seal(c_('change', 0.75), 0.012, px(960))
# Mexico City, 1951: the five delegates stand as the line names them (each from P.assoc - 0.9, 0.12 s apart), chairs pushed back, and
# shake hands; Madrid, 1956: Spain's card set down beside theirs. The voices come in one at a time, the bass on A, the baritone as they
# stand, the tenor and the alto in the pause, and meet on A major, the academies' chord
for i, x_ in enumerate((300, 560, 820, 1100, 1360)):
    chair(assoc - 0.9 + 0.12 * i, 0.009 if i < 2 else 0.006, px(x_))
pat(spain + 1.0, 0.014, px(1667))
note('ten', 57, e_('y1951', 0.06), c_('today', -0.3) - e_('y1951', 0.06), 0.62, 'A', att=0.3, rel=0.3)
note('alto', 61, e_('y1951', 0.3), c_('today', -0.3) - e_('y1951', 0.3), 0.6, 'A', att=0.3, rel=0.3)
# today: a member writes a word on a card (from c.today + 0.3, for 4 s), and a member in another city (from P.where, for 1.8 s); the
# chord's fifth held, then the fourth (D and A) as they propose, and the proposer's three notes on the alto, in the pause. The
# commission drafts each change: the drafter's three notes on the baritone, as one of them explains (from s11 + 0.6). The Spanish
# Academy approves it, a show of hands (from P.approves + 0.1, staggered by a tenth): the bass's yes, E to A. Every other academy
# gives its view, the change going out to their twenty-two cards (from o0) and back ticked (from b0): the bass on F-sharp and E as it
# goes out; and as the word goes in, after the line, the tenor and the alto join them in the academies' chord
pen(c_('today', 0.3), 0.008, px(960), 3.8); pen(where, 0.007, px(1380), 1.7)
line('bass', [(c_('change', 0.1), c_('propose'), 45, 1.0), (c_('propose'), s11 + 1.3, 38, 1.0)], 0.7, 'A', 0.8, att=1.0, rel=0.4)
line('bari', [(assoc - 0.8, c_('propose'), 52, 1.0), (c_('propose'), s11 + 0.6, 45, 1.0), (s11 + 0.6, s11 + 0.96, 49, 1.0), (s11 + 0.96, s11 + 1.32, 50, 1.0),
              (s11 + 1.32, free + 0.3, 52, 1.0)], 0.66, 'A', 0.8, att=0.6, rel=0.6)
phrase('alto', [57, 59, 61], e_('propose', 0.08), 0.6, 'A', step=0.32, last=0.3)
for k, i in enumerate(sorted(range(7), key=lambda i: (i * 3) % 7)):
    if k < 4:
        sleeve(approves + 0.1 + ((i * 3) % 7) * 0.1, 0.007 if k < 2 else 0.004, px(240 + 240 * i))
line('bass', [(approves + 0.05, approves + 0.85, 40, 1.0), (approves + 0.85, o0, 45, 1.0), (o0, o0 + 0.8, 42, 1.0), (o0 + 0.8, e_('drafts', 0.1), 40, 1.0),
              (e_('drafts', 0.1), free + 0.3, 45, 1.0)], 0.68, 'A', 0.8, att=0.3, rel=0.6)
paper(s13 + 0.15, 0.008, 0.0, 0.7)
for j in range(3):
    air(o0 + 0.05 + 0.3 * j, 0.9, 0.006 if j == 0 else 0.004, (-0.5, 0.5, 0.0)[j])
for j in range(5):
    tap(b0 + 0.9 + 0.17 * j, 0.008 if j < 2 else 0.004, (-0.5, 0.5, -0.3, 0.3, 0.0)[j])
note('ten', 57, e_('drafts', 0.08), c_('twenty', -0.3) - e_('drafts', 0.08), 0.62, 'A', att=0.25, rel=0.3)
note('alto', 61, e_('drafts', 0.3), c_('twenty', -0.3) - e_('drafts', 0.3), 0.6, 'A', att=0.25, rel=0.3)
book(c_('twenty', 0.9), 0.010, 0.0)
# free online: at a bus stop, someone looks the word up on a phone (its card from s14 + 0.4)
tap(s14 + 0.45, 0.010, px(1500)); tap(s14 + 0.62, 0.007, px(1500))
# each year's update: the list of what's new laid down; the dominant, E and B, waiting; in the pause, Palma's phrase as it was in
# 1892, over it; and as "to budget" is lit gold in the list, the chord answers it: A and E under the line, then the academies' chord
paper(c_('update', -0.2), 0.012, 0.0, 0.5)
line('bass', [(c_('update', 0.3), c_('isin', 0.2), 40, 1.0), (c_('isin', 0.2), e_('isin', 1.25), 45, 1.0)], 0.62, 'A', 0.8, att=0.6, rel=0.3)
line('bari', [(c_('update', 0.5), c_('isin', 0.2), 47, 1.0), (c_('isin', 0.2), e_('isin', 1.25), 52, 1.0)], 0.6, 'A', 0.8, att=0.6, rel=0.3)
phrase('alto', PALMA, e_('update', 0.06), 0.62, 'A', step=0.24, last=0.3, rel=0.18)
marker(c_('isin', 0.2), 0.010, px(900), 0.6)
chord({'ten': 57, 'alto': 61}, e_('isin', 0.06), e_('isin', 1.25), 0.62, 'A', step=0.22, att=0.25, rel=0.3)
# the same with data: the university's floor; E-flat, low, held as the line says what it gives; then the fourth, as every step has
# someone to do it, and E-flat again, as everyone can use the same words
line('bass', [(c_('same', 0.35), every, 39, 1.0), (every, everyone - 0.1, 44, 1.0), (everyone - 0.1, e_('anyone', 0.4), 39, 1.0)], 0.62, 'Eb', 0.8, att=0.9, rel=0.6)
line('bari', [(c_('same', 0.6), every, 46, 1.0), (every, everyone - 0.1, 48, 1.0), (everyone - 0.1, e_('anyone', 0.4), 46, 1.0)], 0.58, 'Eb', 0.8, att=0.9, rel=0.6)
# the title, and the mark: the alto, then the bass, two octaves under it; the baritone and the tenor under the bass's last note
mark('alto', 63, breath + 0.9, 0.8)
mark('bass', 39, breath + 0.9 + 1.9, 0.85, last=E('words') + 0.6 - (breath + 0.9 + 1.9 + 1.35))
chord({'bari': 46, 'ten': 55}, breath + 0.9 + 1.9 + 1.35, E('words') + 0.4, 0.55, step=0.25, att=0.5, rel=0.6)

# 2. Three ways to count, in E-flat: Clara's report laid on the desk, its rows, the note of how each faculty counts; one learner's year,
#    and as Health's row is ringed, nine points lower, the fourth under it sinks a semitone. The emails, and nobody decided: a bare
#    fifth. Now a service: E-flat as its line lights, the full chord in the pause; she asks, her request written as she says it, and it
#    goes: her phrase on the alto, rising, unanswered for now
tw_ = lambda lid, word, off=0: W('three', lid, word, off)
tc_ = lambda lid, off=0: G('three', lid, off)
fac, nineW, less, nobody, define, ten, asksW = tw_('compares', 'faculty by'), tw_('nine', 'nine points'), tw_('nine', 'less likely'), tw_('email', 'nobody'), tw_('service', 'define'), tw_('service', 'ten working'), tw_('asks', 'asks')
rp, em, sv, rq = fac - 0.7, tc_('email', -0.3), tc_('service', -0.3), ten + 0.2
slide(rp + 0.05, 0.014, 0.0, 0.6)
for i in range(3):
    marker(fac - 0.1 + 0.35 * i, 0.008 if i == 0 else 0.006, px(500), 0.5)
for t0 in (tc_('business'), tc_('science'), tc_('health')):
    pat(t0 - 0.05, 0.008, px(1400))
slide(tc_('nine', -0.2), 0.010, 0.0, 0.8)
for i in range(3):
    tap(nineW - 0.4 + 0.3 * i + 0.1, 0.008, px(430 + (0, 82, 1217)[i]))
pencil(less + 0.05, 0.011, px(560), 0.85)
line('bass', [(nineW - 0.2, tc_('email', -0.6), 44, 1.0)], 0.6, 'Eb', 0.8, att=0.4, rel=0.5)
line('bari', [(nineW - 0.05, less, 48, 1.0), (less, tc_('email', -0.6), 47, 1.0)], 0.6, 'Eb', 0.8, att=0.4, rel=0.5)
paper(em + 0.2, 0.008, px(960), 0.5)
chord({'bass': 39, 'bari': 46}, nobody - 0.2, tc_('service', -0.6), 0.55, step=0.2, att=0.5, rel=0.6)
pin(sv + 0.25, 0.014, px(960)); marker(define, 0.011, px(900), 0.6)
chord({'bass': 39, 'bari': 46}, define - 0.05, tc_('asks', -0.1), 0.62, step=0.2, att=0.4, rel=0.35)
chord({'ten': 55, 'alto': 63}, END('three', 'service') + 0.06, tc_('asks', -0.3), 0.58, step=0.2, att=0.3, rel=0.3)
for i in range(3):
    pen(rq + 0.3 + 0.8 * i, 0.008, px(960), 0.75)
pen(asksW + 0.2, 0.007, px(1250), 0.4); air(asksW + 1.0, 1.0, 0.012, 0.4)
phrase('alto', CLARA, END('three', 'asks') + 0.08, 0.62, step=0.3, last=0.85)

# 3. A request, followed: the floor, her request flying from her hands to Mei's, Noor's and Yusuf's steps behind it; Mei drafts, keys,
#    and the steward's phrase on the tenor in the pause; the agent reads and ticks, its note slides up, what it touches lit one by one,
#    and its pure tone in the pause; the registrar decides, the owner's cadence, her decision written, dated and signed; the
#    definition pinned on the map, once; the map publishes it, the glossary's low E-flat; and every copy follows, the bass's note copied
#    up an octave on the data team's copy, and on through the tenor and the alto after the line; the path through the rooms, a tag
#    at each step, and, in the pause, the full chord: every step answered
rw_ = lambda lid, word, off=0: W('request', lid, word, off)
rc_ = lambda lid, off=0: G('request', lid, off)
re_ = lambda lid, off=0: END('request', lid) + off
draftsW, ex, checks, listsW, three, two = rw_('mei', 'drafts'), rw_('mei', 'with an'), rw_('agent', 'checks'), rw_('agent', 'lists'), rw_('agent', 'three'), rw_('agent', 'two dash')
decides, onceW, gloss, dt, dash, asst = rw_('owner', 'decides'), rw_('once', 'once'), rw_('once', 'glossary'), rw_('copies', 'data team'), rw_('copies', 'the dashboards'), rw_('copies', 'the assistant')
st = [rw_('steps', s) for s in ('Ask', 'draft', 'check', 'decide', 'publish', 'follow')]
r0 = S0('request')
air(r0 + 1.0, 2.6, 0.012, -0.3); walk(r0 + 0.6, 3.4, 0.006, -0.85, px(676)); walk(r0 + 0.8, 4.4, 0.005, -0.85, px(812))
pat(r0 + 3.6, 0.008, px(528))
keys(draftsW - 0.1, 1.5, 0.006, px(1100)); keys(ex - 0.1, 1.6, 0.005, 0.0)
phrase('ten', STEWARD, re_('mei', 0.1), 0.65, step=0.36, last=0.55)
rd = (listsW - 0.5 - (checks + 0.15)) / 4
for i in range(4):
    tick(checks + 0.15 + (i + 1) * rd - 0.1, 0.009 if i < 2 else 0.006, px(1100))
slide(listsW - 0.3, 0.010, 0.2, 0.7)
for j, t0 in enumerate([three - 0.15 + 0.3 * i for i in range(3)] + [two - 0.15 + 0.35 * i for i in range(2)]):
    tap(t0 + 0.1, 0.007 if j < 2 else 0.004, 0.2)
agent(65, re_('agent', 0.1), 1.35)
line('bari', [(decides - 0.3, decides + 0.4, 46, 1.0), (decides + 0.4, re_('owner', 1.5), 51, 1.0)], 0.68, 'Eb', 0.8, att=0.3, rel=0.4)
note('bass', 39, decides + 0.4, re_('owner', 1.5) - decides - 0.4, 0.6, att=0.4, rel=0.4)
pat(decides - 0.2, 0.010, px(1500))
for i in range(4):
    pen(decides - 0.05 + 0.3 * i, 0.007 if i < 2 else 0.005, px(1500), 0.4)
pen(decides + 0.9, 0.006, px(1500), 0.3); sign(decides + 1.1, 0.010, px(1500))
pin(onceW + 0.15, 0.020, px(968))
note('bass', 39, gloss - 0.1, 2.3, 0.65, att=0.25, rel=0.6)
chord({'bass': 39, 'bari': 51}, dt - 0.1, asst + 0.9, 0.65, step=0.1, att=0.3, rel=0.6)
chord({'bass': 39, 'bari': 51, 'ten': 58, 'alto': 63}, re_('copies', 0.0), rc_('steps', -0.3), 0.6, step=0.18, att=0.3, rel=0.3)
for k, t0 in enumerate(st):
    pat(t0 - 0.05 + 0.15, 0.010 if k < 3 else 0.007, px(420 + 216 * k))
chord(ACAD_EB, re_('steps', 0.1), E('request') - 0.2, 0.65, step=0.2, att=0.4, rel=0.6)

# 4. Roles, not people: on Noor's map, a role over each step as it's named, a pat each; who fills each role clipped on, and as the line
#    says roles stay, the four voices, a role each, in the pause; the reviewer's rights, close, and the agent's tone; what it may do,
#    ticked, what it may not, struck; people decide, the owner's cadence, and the chord in the pause. Then the academies' table, Madrid
#    in 1892, the bare fifth in A, and today's steps lit as their pictures show them: the drafter's three notes, the bass's yes, and the
#    academies' chord in the pause
ow_ = lambda lid, word, off=0: W('roles', lid, word, off)
oc_ = lambda lid, off=0: G('roles', lid, off)
oe_ = lambda lid, off=0: END('roles', lid) + off
r4 = [ow_('role', s) for s in ('the one', 'the steward', 'the reviewer', 'the owner')]
actorW, team, stay, rights, readW, whoW, notW = ow_('actor', 'an actor'), ow_('actor', 'a team'), ow_('actor', 'roles stay'), ow_('software', 'rights'), ow_('may', 'read'), ow_('may', 'who uses'), ow_('maynot', 'may not')
sameW, members = ow_('academies', 'same way'), ow_('academies', 'members')
V4, s3_4 = oe_('academies', 0.15), members - 0.3
for i, t0 in enumerate(r4):
    pat(t0 - 0.12 + 0.2, 0.010 if i < 2 else 0.007, px(420 + 216 * i + 108))
for i in range(4):
    knock(actorW + 0.05 + 0.2 * i + 0.25, 0.008 if i < 2 else 0.005, px(528 + 216 * i), 330)
knock(team + 0.2, 0.007, px(1290), 300); air(ow_('actor', 'Actors come', 0.1), 1.4, 0.006, 0.0)
chord({'bass': 39, 'bari': 46, 'ten': 55, 'alto': 63}, oe_('actor', 0.06), oc_('software', -0.35), 0.6, step=0.18, att=0.3, rel=0.35)
for k in range(3):
    pencil(rights - 0.1 + 0.15 * k, 0.006, px(700), 0.25)
agent(65, oe_('software', 0.08), 1.2)
tick(readW + 0.1, 0.009, px(760)); tick(whoW + 0.05, 0.008, px(760)); strike(notW + 0.05, 0.010, px(760), 0.5)
air(oc_('people', -1.0), 1.0, 0.007, 0.0)
line('bari', [(oc_('people', -0.05), oc_('people', 0.6), 46, 1.0), (oc_('people', 0.6), oc_('academies', -0.25), 51, 1.0)], 0.66, 'Eb', 0.8, att=0.25, rel=0.35)
note('bass', 39, oc_('people', 0.6), oc_('academies', -0.25) - oc_('people', 0.6), 0.6, att=0.3, rel=0.35)
chord({'ten': 55, 'alto': 63}, oe_('people', 0.08), oc_('academies', -0.3), 0.58, step=0.2, att=0.25, rel=0.3)
for i in range(3):
    pat(sameW - 0.5 + 0.15 * i + 0.2, 0.008, px(960 - 230 + 230 * i))
q4 = s3_4 + 0.75
line('bass', [(sameW, V4 - 0.05, 45, 1.0), (V4 - 0.05, V4 + 0.7, 40, 1.0), (V4 + 0.7, E('roles') - 0.2, 45, 1.0)], 0.64, 'A', 0.8, att=0.5, rel=0.5)
line('bari', [(sameW + 0.2, q4, 52, 1.0), (q4, q4 + 0.3, 49, 1.0), (q4 + 0.3, q4 + 0.6, 50, 1.0), (q4 + 0.6, E('roles') - 0.2, 52, 1.0)], 0.62, 'A', 0.8, att=0.5, rel=0.5)
for k, i in enumerate(sorted(range(7), key=lambda i: (i * 3) % 7)):
    if k < 3:
        sleeve(V4 + ((i * 3) % 7) * 0.08, 0.006 if k < 2 else 0.004, px(240 + 240 * i))
chord({'ten': 57, 'alto': 61}, V4 + 0.75, E('roles') - 0.2, 0.58, 'A', step=0.2, att=0.3, rel=0.5)

# 5. What each step needs: a light along the steps; each thing a step writes dropped into the information band as it's named, a pat
#    each; the copies' card opened, each copy a tick; a home marked at each card's corner, and E-flat under the line that names them;
#    Noor's room, the next film's card pinned, and the chord in the pause
nw_ = lambda lid, word, off=0: W('needs', lid, word, off)
nc_ = lambda lid, off=0: G('needs', lid, off)
writes, termW, each, info, home = nw_('reads', 'writes'), nw_('term', 'the term'), nw_('term', 'each saying'), nw_('home', 'information'), nw_('home', 'a home')
air(writes - 0.2, 1.8, 0.008, 0.0)
for i, t0 in enumerate([nc_(l, -0.1) for l in ('req', 'draft', 'note', 'decision')] + [nw_('term', 'its copies', -0.1)]):
    pat(t0 + 0.35, 0.010 if i < 2 else 0.007, px(560 + 160 * i))
flip(each - 0.3, 0.008, px(960))
for j in range(3):
    tick(each + 0.25 + 0.4 * j, 0.008 if j == 0 else 0.006, px(800 + 160 * j))
for i in range(6):
    pencil(home + 0.1 + 0.15 * i, 0.006 if i < 2 else 0.004, px(500 + 170 * i), 0.15)
chord({'bass': 39, 'bari': 46}, info - 0.2, nc_('breath') - 0.3, 0.6, step=0.2, att=0.6, rel=0.5)
s2_5 = home + 1.35
pat(s2_5 + 0.9, 0.012, px(1160)); pin(s2_5 + 1.1, 0.018, px(1160))
chord({'ten': 55, 'alto': 63}, END('needs', 'home') + 0.08, nc_('breath') - 0.3, 0.58, step=0.2, att=0.3, rel=0.5)

# 6. A chart that follows: Yusuf's office on his first day, the old chart, half its names to be confirmed, a bare fifth on the fourth
#    under them; taken down. Drawn from the map: E-flat as it comes up on his screen, its columns as they're said; the calendar turned
#    to February, three weeks ringed. Mei on leave: her phrase sung by the baritone, an octave lower, unchanged, as the colleague's name
#    clips onto her role; the chart's row changes, and back; and in the pause, her phrase back on the tenor. The old chart dropped in
#    the box marked retired. A steward's time: her calendar's Thursdays painted in, and as she nods, the chord
hw_ = lambda lid, word, off=0: W('chart', lid, word, off)
hc_ = lambda lid, off=0: G('chart', lid, off)
he_ = lambda lid, off=0: END('chart', lid) + off
half, drawn, col, feb, threeW = hw_('first', 'half'), hw_('drawn', 'drawn'), [hw_('drawn', s) for s in ('step', 'role', 'who')], hw_('feb', 'February'), hw_('feb', 'three')
coll, chg, ret, nobodyW, timeW = hw_('colleague', 'colleague'), hw_('colleague', 'chart'), hw_('colleague', 'returns'), hw_('retype', 'Nobody'), hw_('time', 'time')
chord({'bass': 44, 'bari': 51}, half - 0.15, he_('first', 0.3), 0.58, step=0.2, att=0.5, rel=0.5)
for k in (0, 2, 4):
    tap(half - 0.15 + 0.14 * k + 0.1, 0.006, px(820 + 205 * (k % 4)))
peel(hc_('drawn', -0.4), 0.012, px(400)); peel(hc_('drawn', -0.25), 0.010, px(1500)); slide(hc_('drawn', 0.0), 0.010, 0.4, 0.6)
slide(hc_('drawn', 0.45), 0.010, -0.3, 0.5)
chord({'bass': 39, 'bari': 46}, drawn + 0.1, col[2] + 0.6, 0.6, step=0.2, att=0.4, rel=0.5)
for i in range(3):
    tap(col[i] - 0.1, 0.007, px(400 + 300 * i))
flip(feb - 0.05, 0.010, px(1550)); marker(threeW - 0.1, 0.010, px(1550), 1.0)
flip(coll + 0.3, 0.010, px(1100))
phrase('bari', [m - 12 for m in STEWARD], coll + 0.3, 0.68, step=0.4, last=1.0)
flip(chg - 0.05, 0.009, px(500)); flip(ret - 0.05, 0.009, px(500))
phrase('ten', STEWARD, he_('colleague', 0.1), 0.65, step=0.36, last=0.7)
drop(nobodyW + 0.15 + 0.55, 0.014, px(560))
for k in range(4):
    marker(timeW - 0.05 + 0.28 * k, 0.007 if k < 2 else 0.005, px(560 + 200 * k), 0.4)
chord(ACAD_EB, he_('time', 0.08), E('chart') - 0.25, 0.6, step=0.2, att=0.4, rel=0.5)

# 7. The glossary, run as a product: the product card pinned on his board, E-flat; each of its lines lit as it's said, a marker; the
#    week's list, and the week's chord; who reads each term; the nine, each on a card, and their owners' yes, the owner's cadence; into
#    the box; the dictionary's list of what's new on a phone; the week's list on every screen on the floor, and the week's chord again
pw_ = lambda lid, word, off=0: W('product', lid, word, off)
pc_ = lambda lid, off=0: G('product', lid, off)
pe_ = lambda lid, off=0: END('product', lid) + off
glW, ownW, users, prom, week, counts, retired, yes, everyW = pw_('itself', 'glossary'), pw_('owner', 'owner'), [pw_('users', s) for s in ('people', 'reports', 'tables', 'agents')], pw_('promise', 'promise'), pw_('week', 'week'), pw_('counts', 'counts'), pw_('nine', 'retired'), pw_('nine', 'yes'), pw_('yearly', 'everyone')
pr = [pw_('promise', s) for s in ('owner', 'definition', 'example', 'status', 'change', 'ten')]
pin(glW + 0.25, 0.018, px(980))
chord({'bass': 39, 'bari': 46}, glW - 0.1, pc_('owner', -0.4), 0.58, step=0.2, att=0.5, rel=0.5)
for k, t0 in enumerate([ownW] + users[::2] + pr[::2] + [pe_('promise', 0.35)]):
    marker(t0 - 0.1, 0.008 if k < 3 else 0.005, px(700 + 60 * k), 0.4)
for i in range(4):
    tap(week + 0.05 + 0.25 * i, 0.006 if i < 2 else 0.004, px(960))
chord({'bass': 39, 'bari': 46}, week - 0.1, pc_('counts', -0.2), 0.6, step=0.2, att=0.4, rel=0.4)
chord({'ten': 55, 'alto': 63}, pe_('week', 0.06), pc_('counts', -0.35), 0.58, step=0.2, att=0.3, rel=0.35)
for i in range(4):
    tap(counts + 0.6 + 0.1 * i, 0.005, px(900))
for i in range(4):
    pat(pc_('nine', -0.2) + 0.35 + 0.1 * i + 0.3, 0.008 if i < 2 else 0.005, px(560 + 260 * i))
for i in range(4):
    tick(retired - 0.1 + 0.18 * i + 0.3, 0.007 if i < 2 else 0.004, px(800 + 160 * i))
line('bari', [(yes - 0.3, yes + 0.35, 46, 1.0), (yes + 0.35, pc_('yearly', -0.3), 51, 1.0)], 0.66, 'Eb', 0.8, att=0.25, rel=0.4)
note('bass', 39, yes + 0.35, pc_('yearly', -0.3) - yes - 0.35, 0.6, att=0.3, rel=0.4)
drop(yes - 0.1 + 0.55 + 0.6, 0.014, px(560))
tap(pc_('yearly', 0.05), 0.010, px(1500)); tap(pc_('yearly', 0.22), 0.007, px(1500))
chord({'bass': 39, 'bari': 46}, everyW - 0.2, E('product') - 0.3, 0.6, step=0.2, att=0.4, rel=0.5)
chord({'ten': 55, 'alto': 63}, pe_('yearly', 0.06), E('product') - 0.3, 0.58, step=0.2, att=0.3, rel=0.5)

# 8. Where it is: Clara's request, its six steps lit one by one, each with its date, on six notes of her phrase, rising from the bass
#    to the baritone; each working day ticked. Her report: each faculty's note turned to the examiners' day, Health's rate rising to
#    sit beside the others: the fourth that sank in January comes back up, and E-flat as the nine points are gone. Lima, 1909: Palma
#    seals his letter, and his phrase in the pause, in A, still unanswered. Planning, today: Clara looks up at her request on the wall
#    screen and smiles, and in the pause, her phrase, and the chord the academies sang. Noor's map, lit part by part, the voices coming
#    in under it from the lowest, the full chord as all of it lights; the end card, the mark, the alto, then the bass, held to the end
ww_ = lambda lid, word, off=0: W('where', lid, word, off)
wc_ = lambda lid, off=0: G('where', lid, off)
we_ = lambda lid, off=0: END('where', lid) + off
could, decided, oneW, nineX, gone, askW, hers = ww_('along', 'could'), ww_('eight', 'decided'), ww_('oneway', 'one'), ww_('oneway', 'nine'), ww_('oneway', 'gone'), ww_('palma', 'ask'), ww_('hers', 'hers')
roleW, everyX, useW = ww_('gives', 'role'), ww_('gives', 'everyone'), ww_('gives', 'use')
dd = [could - 0.15 + 0.42 * i for i in range(6)]
for i in range(6):
    tap(dd[i] + 0.05, 0.008 if i < 3 else 0.005, px(150 + 192 * i + 60))
line('bass', [(dd[0], dd[1], 39, 1.0), (dd[1], dd[2], 43, 1.0), (dd[2], dd[5], 44, 1.0)], 0.66, 'Eb', 0.8, att=0.15, rel=0.4)
line('bari', [(dd[3], dd[4], 46, 1.0), (dd[4], dd[5], 48, 1.0), (dd[5], dd[5] + 0.9, 51, 1.0)], 0.64, 'Eb', 0.8, att=0.12, rel=0.6)
for k in range(8):
    tick(decided + 0.25 + 0.13 * k, 0.006 if k < 2 else 0.003, px(200 + 96 * k))
for i in range(3):
    flip(oneW - 0.25 + 0.15 * i, 0.007, px(1400))
line('bari', [(nineX - 0.1, nineX + 1.0, 47, 1.0), (nineX + 1.0, gone + 0.1, 48, 1.0), (gone + 0.1, we_('oneway', 0.3), 46, 1.0)], 0.62, 'Eb', 0.8, att=0.3, rel=0.5)
line('bass', [(nineX - 0.1, gone + 0.1, 44, 1.0), (gone + 0.1, we_('oneway', 0.3), 39, 1.0)], 0.6, 'Eb', 0.8, att=0.3, rel=0.5)
marker(nineX - 0.1, 0.008, px(560), 1.2)
seal(askW + 0.1, 0.012, px(960))
phrase('alto', PALMA, we_('palma', 0.06), 0.55, 'A', step=0.27, last=0.42, rel=0.18)
step(hers + 0.65, 0.006, px(470))
phrase('alto', CLARA, we_('hers', 0.06), 0.6, step=0.24, last=0.6, rel=0.25)
chord({'bass': 39, 'bari': 46}, we_('hers', 0.45), wc_('gives', 0.6), 0.58, step=0.12, att=0.3, rel=0.4)
note('ten', 51, we_('hers', 0.8), wc_('gives', -0.3) - we_('hers', 0.8), 0.55, att=0.15, rel=0.3)
# Noor's map: lit part by part as the line names them, a soft marker each; as all of it lights, after the line, the four voices come
# in from the lowest; then the end card, and the mark
for k, t0 in enumerate((ww_('gives', 'anyone', -0.2), ww_('gives', 'step', -0.2), roleW - 0.3, ww_('gives', 'words', -0.2), everyX - 0.1)):
    marker(t0, 0.006 if k < 2 else 0.004, px((520, 960, 960, 960, 1400)[k]), 0.5)
end = wc_('breath', 0.2)
chord({'bass': 39, 'bari': 46, 'ten': 55, 'alto': 63}, we_('gives', 0.06), end + 0.3, 0.6, step=0.25, att=0.4, rel=0.4)
mark('alto', 63, end + 0.75, 0.8)
mark('bass', 39, end + 0.75 + 1.9, 0.85, last=TOT - (end + 0.75 + 1.9 + 1.35))
chord({'bari': 46, 'ten': 55}, end + 0.75 + 1.9 + 1.35, TOT, 0.5, step=0.2, att=0.6, rel=0.4)
# the singers' room; then the agent's tones, outside it; and as the noises' filters have soft edges, last of all the whole score is
# low-passed, to keep everything under the voice below about 2.5 kHz
room()
for a_ in AGENT:
    _agent(*a_)
soften(2500)
