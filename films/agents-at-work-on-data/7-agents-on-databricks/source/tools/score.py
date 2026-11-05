# Working with agents on Databricks: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, reserved for this film in the series' palettes (4 November 2026) and checked against every
# score.py on main and on every branch: a tonewheel organ and three Wagner tubas. Both are made here; music.py has neither.
#  - The organ (organ(), play()): every key draws on the same set of turning wheels, as every agent on the platform draws on the same
#    data and tools. Three drawbars, each a pure sine, as a tonewheel is: the 8', the 4' and a little of the 2 2/3'. Every wheel turns
#    all the time, so its phase comes from the film's clock, not from the key: two keys that draw on one wheel add up as one, and a
#    chord that moves to the next keeps turning the wheels they share. The swell pedal brings a chord in and takes it out. No rotating
#    speaker, no vibrato, no percussion, no key click: a tonewheel organ, unlike the site's pipe and reed organs, which speak with a
#    chiff or a reed's buzz.
#  - Three Wagner tubas (wtuba()), played softly, with no vibrato, each its own player on its own note, at its own desk's place in
#    the stereo field: each person's own agent, with its own copy. In the opening each holds its own note as its agent answers, never
#    with the others: 141 low (D flat 2), 177 high (A flat 3), 168 between (G flat 2). On "nobody can tell which" the three
#    notes sound together once, unresolved, and stop. When all three answer 168 a week later, they play the same note, G flat, in
#    octaves, over the organ's G flat major: the only time they agree. One tuba comes back alone, on G flat, as Anil's agent connects
#    to the platform's tool servers.
#  - The film's mark (mark()): three chords from the same wheels, G flat major, E flat minor and C flat major, which share one note,
#    G flat 3, held by one key all through while the voices round it move. It sounds where the agents are brought to the data, under
#    the four ways, and over the end card.
#  - Keys: E flat minor for the problem, G flat major for the platform. Every chord is tuned pure (just intonation from G flat, hz()),
#    from one table: G flat, D flat and C flat major, E flat and B flat minor are all pure in it, so no two held notes beat.
# The rules the series keeps (its briefs, 4 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only at a chapter's turn, under a moment on screen, or in a pause without words; never a
#    bed under the voice. After the opening: a chord at each chapter's turn; the mark under the four ways, and one chord for the
#    fourth; one note as the benchmarks turn Good; the tuba as Anil's agent connects; a low chord for the night's failed check; one
#    note for "Jun decides"; two notes under the statement about skills and tool servers; at the faculty again, E flat minor and then
#    G flat major as the cables reach the platform, a note for each answer, an open fifth for the question left; the mark at the close.
#  - Nothing pulses, loops or trembles; no figure is played again soon. Each voicing is its own, so the same notes in the same order
#    come back only with the mark.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as src/scenes.js. Where the
#    picture repeats (the evidence, the benchmarks' marks, the evaluation's ticks), the first few sound, then softer.
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
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(27)  # this film's own randomness: the rooms

# ---- tuning: just intonation from G flat, so a chord's notes are whole-number ratios of each other and nothing beats. G flat, D flat
# and C flat major and E flat and B flat minor are all pure in this table; A flat minor isn't, so it isn't played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
KEY = (54, 185.0)  # G flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the mark's three chords, voice by voice from the lowest: the bass falls by thirds, G flat 3 is held, the others move a step
GB_M = (42, 49, 54, 58)    # G flat major: G flat 2, D flat 3, G flat 3, B flat 3 (4:6:8:10)
EBM_M = (39, 51, 54, 58)   # E flat minor: E flat 2, E flat 3, G flat 3, B flat 3 (10:20:24:30)
CB_M = (35, 51, 54, 59)    # C flat major: C flat 2, E flat 3, G flat 3, C flat 4 (4:10:12:16)
# the tubas' notes, desk by desk (Anil's, the second, the third), and where each sits
T_ANS, T_PAN = (37, 56, 42), (-0.35, 0.05, 0.45)   # 141, 177 and 168
T_AGREE = (54, 66, 42)                               # 168 a week later: G flat 3, G flat 4 and G flat 2

# ---- the levels: OL an organ key, TL a tuba, FX the effects. tools/quiet.py measures them against the governance films' sound
OL, TL, FX = 0.016, 0.045, 1.5

def _ir(sec, lo):
    """a room's ring: noise that dies away over sec, its top rolled off at lo, after 20 ms. It is scaled so that a held note's ring
    is, on average, as loud as the note itself between 80 Hz and 1.2 kHz (a ring scaled by its whole energy rings far louder than
    the note in the band it keeps, and louder on some notes than on others)"""
    x = np.arange(int(sec * SR)) / SR; ir = (R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32)
    ir = filt(ir, 'low', lo); ir[:int(0.02 * SR)] = 0
    H = np.abs(np.fft.rfft(ir)) ** 2; f = np.fft.rfftfreq(len(ir), 1 / SR)
    return ir / np.sqrt(H[(f > 80) & (f < 1200)].mean())
ROOM = _ir(1.5, 1500)   # a quiet hall round the organ and the tubas
def _room(s, wet):
    """a note in the room, then given its own level back: the room's reflections add to some pitches and take from others (up to
    4 dB either way here), so the note with its echo is set to the level it has without, where it's held (past its first 0.4 s, before
    it lets go), and held notes sit at even levels"""
    if not wet:
        return s
    y = np.pad(s, (0, len(ROOM) - 1)) + wet * fftconvolve(s, ROOM).astype(np.float32)
    a, b = int(0.4 * SR), len(s) - int(0.2 * SR)
    if b - a < int(0.2 * SR):
        a, b = 0, len(s)
    return (y * np.sqrt(np.mean(s[a:b] ** 2) / max(1e-12, float(np.mean(y[a:b] ** 2))))).astype(np.float32)

# ---- the tonewheel organ. A key held from a to b: its three drawbars, each the pure sine of one wheel, whose phase is the film's
# clock. att: how fast it speaks (a key on its own speaks at once, softened by a few ms so it doesn't click; a chord swells in on the
# pedal); rel: how fast it stops. A note of 2 s or more swells a little and eases, once
BARS = ((1, 1.0), (2, 0.38), (3, 0.12))  # 8', 4', 2 2/3'
def organ(m, a, b, g=1.0, att=0.08, rel=0.12, pan=None, room=0.3):
    f = hz(m); sec = max(0.2, b - a); n = int((sec + rel + 0.02) * SR); x = np.arange(n) / SR
    k = (int(a * SR) + np.arange(n)) / SR   # the wheels turn all the time: their phase is the film's clock
    s = sum(w * np.sin(2 * np.pi * f * h * k) for h, w in BARS if f * h < 2400)
    s = s * np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2 * np.cos(0.5 * np.pi * np.clip((x - sec) / rel, 0, 1)) ** 2
    if sec >= 2.0:
        s = s * (0.92 + 0.08 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    put(_room(s.astype(np.float32), room), a, g * OL, max(-0.3, min(0.3, (m - 52) * 0.025)) if pan is None else pan)
VW = (0.95, 0.8, 0.85, 0.75)  # each voice's weight, from the lowest
def play(seq, end, g=1.0, att=0.8, rel=1.0):
    """an organist's hands: seq is [(time, chord)], each chord its voices from the lowest. A voice whose note doesn't change is held,
    one key, through the change, so the wheels the chords share keep turning; one that moves lets go as its next key speaks (legato).
    The swell pedal opens over att at the first chord and closes over rel after end"""
    for j in range(len(seq[0][1])):
        k = 0
        while k < len(seq):
            m, a = seq[k][1][j], seq[k][0]; k2 = k + 1
            while k2 < len(seq) and seq[k2][1][j] == m:
                k2 += 1
            b = seq[k2][0] if k2 < len(seq) else end
            organ(m, a + (0.03 * j if k == 0 else 0), b, g * VW[j], att if k == 0 else 0.08, rel if k2 == len(seq) else 0.12)
            k = k2
def mark(t0, t1, t2, end, g=1.0, att=0.5, rel=0.8):
    """the film's mark: G flat major at t0, E flat minor at t1, C flat major at t2, with G flat 3 held all through"""
    play([(t0, GB_M), (t1, EBM_M), (t2, CB_M)], end, g, att, rel)

# ---- a Wagner tuba: one player, soft, with no vibrato. A conical brass voice, darker than a horn: its partials, exactly in tune,
# gather round a dark formant near 420 Hz and fall away above about 950 Hz; the more it swells, the more the upper ones bloom (each
# follows the note's swell raised to a power that grows with its number), so it speaks dark and opens a little as it swells. A breath
# at the start, and the lips settle onto the note in the first 40 ms, a few cents, once. A note of 1.2 s or more swells once and eases
def wtuba(m, a, b, g=1.0, att=0.3, rel=0.6, pan=0.0, room=0.3, dyn=0.75):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR
    e = np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2 * np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    if sec >= 1.2:
        e = e * (0.86 + 0.14 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    ph = 2 * np.pi * np.cumsum(f * (1 - 0.004 * np.exp(-x / 0.04))) / SR
    s = np.zeros(n)
    for k in range(1, int(2200 // f) + 1):
        fk = f * k; w = k ** -0.9 * (0.3 + np.exp(-((fk - 420) / 280) ** 2)) * np.exp(-max(0.0, fk - 950) / 300)
        s += w * (dyn * e) ** (1 + 0.5 * (k - 1)) * np.sin(k * ph)
    s = s / max(1e-9, float(np.abs(s).max())) * np.cos(0.5 * np.pi * np.clip((x - x[-1] + 0.05) / 0.05, 0, 1)) ** 2
    br = filt(noise(n / SR + 0.01)[:n], 'band', (300, 1400)) * 0.006 * (np.exp(-x / 0.06) + 0.2 * (x < sec))
    put(_room(filt((s + br).astype(np.float32), 'low', 2000), room), a, g * TL, pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft wooden knock: a card set down, an answer landing"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a key, a light click"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.008, pan=0.0, step=0.28):
    """a question or a line of code typing itself in: the first keys, then softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """a card or a sheet laid down"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (220, 1500))[:len(x)], 'low', 2200) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def flick(s, g=0.008, pan=0.0):
    """a tag or a line flicked in: short and light"""
    paper(s, g, pan, 0.16)
def stamp(s, g=0.012, pan=0.0):
    """a mark pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def tuck(s, g=0.008, pan=0.0):
    """a small mark set in a row: a dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def plug(s, g=0.009, pan=0.0):
    """a cable or a thread plugging in: a soft, dull click"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.008, g * 0.6 * FX, pan)
def lock(s, g=0.008, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 480); s_tap(s + 0.012, g * 0.6 * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0, lo=150, hi=900):
    """a breath of air: something sliding across, a page coming in, copies fading away"""
    s_air(s, sec, g * FX, pan, lo, hi)

# =============================================================================================================================
# 1. Three answers: the opening, with music. Monday at the Faculty of Health: the organ swells in on E flat minor; on what active means two
#    voices rise a half step (C flat major, over E flat), and the question is B flat minor. Each agent's answer is its own tuba, alone;
#    on "nobody can tell which" the three sound together, and stop. The plan short of 27 projects: a low E flat minor, and at the copy
#    with every name, its G flat falls to F; then nothing, for "Something had to change". Sam and Jun: D flat major, and the mark as
#    the agents are brought to the data, home to G flat major as their cables reach the platform. A week later: the three tubas on
#    G flat, in octaves, over the organ's G flat major. When every agent reads the same data: D flat major, G flat major on "the
#    answers agree", opening upward as the title comes in
tw = lambda lid, word, off=0: W('three', lid, word, off)
tc = lambda lid, off=0: G('three', lid, off)
tCen, tAsk = tw('active', 'those that', -0.1), tw('asks', 'He asks', -0.2)
play([(0.5, (39, 46, 54, 58)), (tCen, (39, 47, 54, 59)), (tAsk, (41, 49, 53, 58))], tw('asks', 'own copy', 0.9), att=1.6, rel=1.4)
paper(tw('anil', 'Anil', -0.05), 0.010, px(650))                    # Anil's name
knock(tw('anil', "next year's", -0.05), 0.013, px(1590), 260)       # the card of next year's places
for i, w_ in enumerate(('lab space', 'equipment', 'research support')):
    flick(tw('anil', w_, -0.05), 0.006 - 0.001 * i, px(1440))       # its lines
tap(tCen + 0.02, 0.010, px(1590))                                   # started, not yet ended
paper(tAsk + 0.02, 0.012, px(960))                                  # the question
for i, (s_, x_) in enumerate(((tw('asks', 'his agent'), 450), (tw('asks', 'two colleagues', 0.3), 1000), (tw('asks', 'theirs'), 1600))):
    tap(s_ + 0.05, 0.009 - 0.001 * i, px(x_))                       # each agent wakes
for i, x_ in enumerate((540, 1140, 1720)):
    plug(tw('asks', 'Each set up', 1.3 + 0.3 * i), 0.009, px(x_))   # each one's cable reaches its own copy
flick(tw('asks', 'Each set up', 0.82), 0.006, px(400))              # "their own agent"
flick(tw('asks', 'own copy', 0.02), 0.006, px(1150))                # "their own copy"
# Anil's spreadsheet: the yearly research report; a shared project splits in half; 141, on the first tuba
paper(tw('report', 'spreadsheet', -0.28), 0.013, px(1300))
tap(tw('report', 'research report', 0.42), 0.008, px(1200))
tuck(tw('half', 'as half', 0.6), 0.008, px(1250))
t1 = tw('half', 'reads it as a count')
wtuba(T_ANS[0], t1 + 0.1, tw('table', 'The second', -1.1), 0.9, pan=T_PAN[0])
knock(t1 + 0.62, 0.012, px(1440), 240)
# the second desk: the copy of the projects table, every unit with Health in its name, the Bridge Health Lab; 177, the second tuba
paper(tw('table', 'The second', 0.42), 0.013, px(1450))
for i in range(3):
    tap(tw('table', 'with Health', 0.03 + 0.45 * i), 0.008 - 0.001 * i, px(1300))
tap(tw('bridge', 'Bridge Health', 0.05), 0.009, px(1300))
t2 = tw('bridge', 'one hundred', -0.9)
wtuba(T_ANS[1], t2 + 0.1, tw('folder', 'The third', -0.95), 0.75, pan=T_PAN[1])
knock(t2 + 0.62, 0.012, px(1450), 240)
# the third desk: the folder of reports, its pages; 168, the third tuba
paper(tw('folder', 'folder of reports', -0.28), 0.013, px(444))
for i in (0, 2, 4):
    flick(tw('folder', 'folder of reports', 0.05 + 0.187 * i), 0.006 - 0.0008 * i, px(150 + 118 * i))
t3 = tw('folder', 'one hundred', -0.9)
wtuba(T_ANS[2], t3 + 0.1, tw('which', 'One is right', -0.55), 0.9, pan=T_PAN[2])
knock(t3 + 0.62, 0.012, px(1630), 240)
# nobody can tell which: the three together, once, unresolved, and they stop
tN = tw('which', 'nobody can tell')
for i in range(3):
    wtuba(T_ANS[i], tN + 0.05 * i, END('three', 'which') - 0.3, 0.65, att=0.35, rel=0.5, pan=T_PAN[i])
# planned for the lowest: the plan, its gap; a low E flat minor, whose G flat falls to F at the copy with every name; then nothing
knock(tw('short', 'Plan for', 0.05), 0.012, px(1440), 260)
knock(tw('short', 'twenty-seven', -0.05), 0.010, px(1440), 150)
play([(tw('short', 'Plan for', 0.1), (39, 46, 54)), (tw('names', 'And a copy', -0.1), (39, 46, 53))], tw('names', "every researcher's", 2.3),
     att=1.0, rel=0.9)
paper(tw('names', 'And a copy', 0.22), 0.008, px(1450), 0.6)
tap(tw('names', "every researcher's", 0.02), 0.010, px(1450))
# Sam and Jun bring the agents to the data: their cards; D flat major; the agents roll in, and the mark; G flat major as their
# cables reach the platform's tools, and the locks: each reads only what its person may read
paper(tw('bring', 'So Sam', 0.32), 0.010, px(1340))
paper(tw('bring', 'Jun', -0.08), 0.010, px(1700))
tB, tS = tw('bring', 'bring the agents', -0.15), tw('same', 'the same governed')
air(tB, 1.6, 0.010, px(500), 150, 800)
play([(tw('bring', 'So Sam', 0.1), (37, 49, 53, 56)), (tB, GB_M), (tB + 1.5, EBM_M), (tB + 3.0, CB_M), (tS, GB_M)],
     tw('same', 'only what', 0.9), att=1.5, rel=1.4)
for i, x_ in enumerate((950, 1040, 1130)):
    plug(tS + 1.23 + 0.185 * i, 0.010, px(x_))
for i, x_ in enumerate((337, 677, 1017)):
    lock(tw('same', 'only what', 0.05 + 0.11 * i), 0.008, px(x_))
# a week later: the three answers rise, the same, each with its tuba on G flat, in octaves, over the organ's G flat major
tA = tw('week', 'all three')
play([(tw('week', 'A week later', 0.05), (42, 54, 58, 61))], tw('week', 'its definition', 1.4), att=1.2, rel=1.5)
for i in range(3):
    wtuba(T_AGREE[i], tA + 0.05 + 0.25 * i, tw('week', 'its definition', 0.9), 0.85, att=0.35, rel=0.9, pan=T_PAN[i])
    knock(tA + 0.62 + 0.25 * i, 0.010, px((400, 1000, 1600)[i]), 240)
for j in range(3):          # the evidence under each: its query, its table, its definition
    for i in range(3):
        tap(tw('week', 'its query', -0.2 + 0.12 * j + 0.693 * i), 0.007 if j == 0 else 0.0035, px((400, 1000, 1600)[j] - 130 + 130 * i))
# Anil checks it in a minute: the tick; the plan reaches every project. The copies fade, and are deleted
stamp(tw('minute', 'Anil checks', 0.82), 0.012, px(1600))
paper(tw('minute', 'plans space', -0.28), 0.010, px(1440))
stamp(tw('minute', 'plans space', 0.35), 0.009, px(1440))
tD = tw('minute', 'The copies')
air(tD + 0.3, 1.1, 0.012, px(1150), 140, 700)
for i, x_ in enumerate((540, 1150, 1745)):
    flick(tD + 0.52 + 0.2 * i, 0.006, px(x_))
# every agent reads the same data through the same tools: D flat major, G flat major on "the answers agree", and the title
play([(tw('data', 'When every', 0.05), (37, 44, 53, 56)), (tw('data', 'the answers agree', -0.1), (42, 46, 54, 58)), (tc('breath', 0.05), (42, 49, 58, 66))],
     tc('breath', 3.5), att=1.2, rel=1.0)

# 2. One place: D flat major as the shelf grows into Databricks; Unity Catalog and what it holds; the people at work; the four ways
#    spring in, and the mark as the first three light, one chord each; the fourth, G flat major, higher; each way's thread
pw = lambda lid, word, off=0: W('place', lid, word, off)
p0 = S0('place')
air(p0 + 0.25, 1.5, 0.010, px(960), 150, 700)
play([(p0 + 0.3, (37, 44, 49, 53))], p0 + 3.2, att=0.7, rel=1.0)
knock(pw('holds', 'Unity Catalog', -0.15), 0.011, px(960), 280)
for i, w_ in enumerate(('its tables', 'its definitions', 'who may read')):
    tap(pw('holds', w_, 0.05), 0.008 - 0.001 * i, px(560 + 400 * i))
for i, w_ in enumerate(('editors', 'notebooks', 'dashboards')):
    tap(pw('people', w_, -0.05), 0.007 - 0.001 * i, px(460 + 440 * i))
for i in range(3):
    plug(pw('people', 'People', 1.6 + 0.25 * i), 0.006, px(630 + 380 * i))
tF4 = pw('four', 'four ways')
for i, x_ in enumerate((250, 720, 1190, 1660)):
    knock(tF4 + 0.15 + 0.18 * i, 0.011 - 0.001 * i, px(x_), 300)
nm = [pw('answer', 'Agents that answer', -0.15), pw('servers', 'Tool servers', -0.15), pw('builds', 'Agents the team', -0.15),
      pw('writes', 'write code', -0.15)]
mark(nm[0], nm[1], nm[2], nm[2] + 1.8)
play([(nm[3], (54, 58, 61, 66))], nm[3] + 2.1, att=0.3, rel=0.9)
tTo = pw('each', 'same tools')
for i in range(4):
    plug(tTo + 0.7 + 0.2 * i, 0.007 - 0.001 * i, px(540 + 280 * i))

# 3. Agents that answer: B flat minor as the first way lights. Genie One: the question types itself in, the answer lands, its source;
#    the Genie Agent's page slides in, its parts, its cards; the benchmarks, their SQL answers, and one note as they turn Good; the
#    answer with its code
aw = lambda lid, word, off=0: W('ask', lid, word, off)
a0 = S0('ask')
play([(a0 + 0.2, (46, 53, 58, 61))], a0 + 2.6, att=0.4, rel=0.8)
air(a0 + 0.45, 0.6, 0.007, px(960), 200, 900)
keys(aw('genie', 'Genie One', 0.25), 6, 0.008, px(1250))
knock(aw('genie', 'business questions', 0.45), 0.012, px(630), 260)
tap(aw('genie', 'where its words', -0.05), 0.009, px(560))
flick(aw('genie', 'where its words', 0.95), 0.007, px(1450))
air(aw('care', 'For questions', 0.25), 0.7, 0.009, px(1100), 180, 900)
for s_ in (aw('projects', 'governed table', -0.4), aw('instr', 'Its instructions', -0.2), aw('bench', 'Its tests', -0.2)):
    tap(s_ + 0.05, 0.006, px(400))                                  # each part lit in turn
paper(aw('projects', 'governed table', -0.25), 0.010, px(1100))
paper(aw('instr', 'Its instructions', -0.05), 0.010, px(1100))
for i in range(3):
    paper(aw('bench', 'Its tests', -0.05 + 0.733 * i), 0.009 - 0.001 * i, px(1100), 0.3)
    tap(aw('bench', 'right answer', -0.05 + 0.3 * i), 0.008 - 0.001 * i, px(1150))
tR = aw('runs', 'runs them')
organ(66, tR, tR + 2.4, 1.7, att=0.25, rel=0.9, pan=0.15)
for i in range(3):
    stamp(tR + 0.05 + 0.5 * i, (0.011, 0.008, 0.006)[i], px(1550))
paper(aw('sql', 'shows its', -0.05), 0.010, px(1100))
tap(aw('sql', 'shows its', 0.15), 0.008, px(700))

# 4. Tools any agent can use: G flat major as the second way lights. The tool servers slide in, the agent's hand to them, the panel
#    the platform runs them in, each named; Anil's agent signs in as Anil, and its tuba, G flat; it touches each tool in turn; the
#    count of active projects written once, reviewed and approved; the agents call it, and each gets 168; the open standard's plugs
ow = lambda lid, word, off=0: W('tools', lid, word, off)
o0 = S0('tools')
play([(o0 + 0.2, (42, 54, 58, 61))], o0 + 2.6, att=0.4, rel=0.8)
for i in range(5):
    paper(ow('second', 'tool servers', 0.45 + 0.15 * i), 0.009 - 0.001 * i, px(1528), 0.3)
tap(ow('second', 'the hands', 0.45), 0.008, px(1232))
air(ow('runs', 'The platform runs', -0.2), 0.6, 0.007, px(1528), 200, 900)
for i, (l_, w_) in enumerate((('query', 'runs queries'), ('query', 'governed function'), ('query', 'searches'), ('genie', 'Genie One'), ('genie', 'each Genie Agent'))):
    tap(ow(l_, w_, -0.05), 0.006, px(1528))
lock(ow('anil', 'sign-in', -0.15), 0.009, px(420))
lock(ow('anil', 'only what', 0.05), 0.008, px(474))
tCo = ow('anil', 'connects')
wtuba(54, tCo, tCo + 2.9, 0.8, att=0.35, rel=0.7, pan=px(420))
for i in range(4):
    tap(tCo + 0.5 + 0.55 * i, 0.008 - 0.001 * i, px(1232))
air(ow('once', 'count of active', -0.7), 1.0, 0.007, px(300), 150, 700)
paper(ow('once', 'count of active', 0.25), 0.012, px(456))
stamp(ow('once', 'any faculty', 0.3), 0.010, px(600))
stamp(ow('once', 'any faculty', 0.9), 0.009, px(700))
tCa = ow('calls', 'Every agent')
for i in (1, 2, 3):
    tap(tCa + 0.65 + 0.2 * i, 0.007, px((390, 610, 830)[i - 1]))   # each lands in the row
plug(tCa + 0.8, 0.008, px(300))
for i in range(4):
    st_ = tCa + (0.45 + 0.2 * i if i else 0)
    tap(st_ + 1.6, 0.008 - 0.001 * i, px(300 + 220 * i))           # each gets 168
for i in range(5):
    plug(ow('mcp', 'open standard', 0.2 + 0.12 * i), 0.009 - 0.001 * i, px(1232))

# 5. Agents the team builds. Night: the nightly job; its check fails, on a low E flat minor; "Why?"; the project check agent draws
#    itself, built in code, Agent Bricks, Agent Runtime, the job's thread; each step reaching a tool. Morning: the evaluation, its
#    cases, the judges', the sums' and Mei and Jun's marks, the first few, then softer, and a low knock where they mark what's wrong.
#    The note for Jun, opened; one note as Jun decides
bw = lambda lid, word, off=0: W('build', lid, word, off)
b0 = S0('build')
paper(b0 + 0.75, 0.010, px(366))
tFa = bw('fails', 'disagrees')
knock(tFa + 0.05, 0.013, px(366), 150)
play([(tFa, (39, 46, 51, 54))], tFa + 2.7, att=0.5, rel=1.0)
flick(bw('fails', 'find out why', 0.05), 0.009, px(200))
air(bw('bricks', 'project check agent', -0.2), 1.2, 0.009, px(980), 150, 800)
tap(bw('bricks', 'in code', 0.05), 0.008, px(1430))
paper(bw('bricks', 'Agent Bricks', -0.05), 0.011, px(980))
knock(bw('runtime', 'Agent Runtime'), 0.011, px(980), 220)
air(bw('runtime', 'the job calls', -0.1), 0.9, 0.007, px(800), 200, 900)
for i in range(3):
    tap(bw('runtime', 'every step', 0.5 + 0.6 * i), 0.008 - 0.001 * i, px(1330))
paper(bw('before', 'Before anyone', 0.05), 0.012, px(960))
for i, (w_, o_) in enumerate((('twelve', -0.2), ('Two projects', -0.1), ("And Health's", -0.1), ("And Health's", 0.7))):
    paper(bw('cases', w_, o_ + 0.05), 0.009 - 0.001 * i, px(600), 0.3)
for c_, (w_, o_, x_) in enumerate((('Judges', 0.2, 1330), ('plain test', 0.1, 1500), ('Mei and Jun', 0.1, 1690))):
    for i in range(4):
        if c_ == 2 and i == 2:
            knock(bw('judges', w_, o_ + 0.3 * i), 0.010, px(x_), 170)   # Mei and Jun mark what's wrong
        else:
            tuck(bw('judges', w_, o_ + 0.3 * i), (0.008, 0.006, 0.005, 0.004)[i] * (1.0 if c_ == 0 else 0.7), px(x_))
paper(bw('note', 'Its note', -0.05), 0.012, px(960))
flick(bw('note', 'Jun reads'), 0.007, px(960))
flick(bw('note', 'Jun reads', 0.5), 0.006, px(960))
tDe = bw('note', 'decides')
knock(tDe + 0.05, 0.009, px(960), 260)
organ(54, tDe, tDe + 2.2, 1.3, att=0.3, rel=1.0, pan=0.0)

# 6. Agents that write code: C flat major as the fourth way lights. Sam's card; the pipeline's code types in; Genie Code's panel, with
#    his rights; the team's skills, one by one; their threads to both agents; SKILL.md; the skill in use, its claim, the query and the
#    result behind it; Jun's agent; the tool servers and Databricks' own skills. The statement: B flat 3 under its violet line, D flat
#    4 under its blue one. The two drafts, each reviewed by its person, approved by a second; what reaches production
cw = lambda lid, word, off=0: W('code', lid, word, off)
c0 = S0('code')
play([(c0 + 0.2, (47, 51, 54, 59))], c0 + 2.6, att=0.4, rel=0.8)
paper(cw('sam', 'Sam builds', -0.15), 0.010, px(229))
keys(cw('sam', 'pipelines', 0.05), 6, 0.008, px(900), 0.24)
air(cw('genie', 'Genie Code', -0.1), 0.6, 0.008, px(1600), 200, 900)
lock(cw('genie', 'his rights', -0.05), 0.008, px(1600))
for i in range(3):
    flick(cw('skills', "the team's skills", 0.05 + 0.2 * i), 0.006 - 0.001 * i, px(1600))
air(cw('skills', 'the same files', 0.9), 1.0, 0.008, 0.0, 200, 900)
paper(cw('skills', 'open format', -0.05), 0.010, px(960))
tap(cw('profile', 'follows', -0.15), 0.008, px(1600))
paper(cw('profile', 'follows', 0.35), 0.008, px(1600), 0.3)
tap(cw('profile', 'the query', 0.05), 0.008, px(1600))
tap(cw('profile', 'every claim', -0.15), 0.007, px(1600))
tap(cw('jun', "Jun's own", 0.4), 0.008, px(1745))
paper(cw('reach', 'same tool servers', -0.15), 0.010, px(1640))
paper(cw('reach', "Databricks' own", -0.05), 0.010, px(1250))
tTe = cw('teach', 'Skills teach', -0.2)
knock(tTe + 0.05, 0.010, px(960), 260)
organ(58, tTe, cw('teach', 'do the work', 1.0), 1.2, att=0.4, rel=1.0, pan=-0.12)
organ(61, cw('teach', 'tool servers let', -0.2), cw('teach', 'do the work', 1.0), 1.15, att=0.4, rel=1.0, pan=0.12)
for i in range(2):
    paper(cw('draft', 'a draft', -0.15 + 0.2 * i), 0.010 - 0.001 * i, px(400 + 540 * i))
    stamp(cw('draft', 'reviews it', -0.05 + 0.25 * i), 0.010 - 0.002 * i, px(400 + 540 * i))
stamp(cw('draft', 'a second person', 0.35), 0.012, px(700))
air(cw('draft', 'production', -0.1), 1.3, 0.010, px(1100), 150, 800)

# 7. The same answer: E flat minor, back at the faculty; G flat major as the three blue cables reach the platform, each plugging in;
#    the question; a key of the organ for each answer as it rises, 168, and its evidence, softer than the first time; the plan; the
#    takeaway; an open fifth for the question left, whose reads and who pays; the next film's card; the mark over the end card
sw = lambda lid, word, off=0: W('same', lid, word, off)
s0 = S0('same')
play([(s0 + 0.2, (39, 51, 54, 58))], s0 + 2.7, att=0.6, rel=0.8)
tRe = sw('read', 'the same governed', -0.2)
play([(tRe, (42, 49, 58, 61))], tRe + 2.6, att=0.6, rel=1.0)
for i, d_ in enumerate((1.01, 1.13, 1.33)):
    plug(tRe + d_, 0.008, px((416, 1036, 1640)[i]))
paper(sw('asked', 'Asked for', -0.15), 0.010, px(960))
tNs = sw('asked', 'one hundred', -0.8)
for i, m in enumerate((54, 58, 61)):
    organ(m, tNs + 0.05 + 0.25 * i, tNs + 3.0, 0.95, att=0.3, rel=1.0, pan=px((400, 1000, 1600)[i]) * 0.6)
    knock(tNs + 0.62 + 0.25 * i, 0.008, px((400, 1000, 1600)[i]), 240)
for j in range(3):
    for i in range(3):
        tap(sw('asked', 'its query', -0.2 + 0.12 * j + (sw('asked', 'its definition') - sw('asked', 'its query') + 0.6) * i / 3), 0.0035,
            px((400, 1000, 1600)[j] - 130 + 130 * i))
paper(sw('plans', 'Anil plans', -0.08), 0.010, px(1440))      # the plan as it now stands springs in, space for every project
knock(sw('takeaway', 'The platform', -0.25), 0.010, px(960), 260)
tWh = sw('left', 'whose reads')
flick(tWh - 0.05, 0.009, px(480))
flick(sw('left', 'who pays', -0.05), 0.009, px(1450))
play([(tWh - 0.1, (49, 56))], tWh + 2.6, att=0.5, rel=1.0)
paper(sw('next', 'the next film', -0.25), 0.010, px(960))
tEnd = G('same', 'breath', 0.1)
mark(tEnd, tEnd + 1.2, tEnd + 2.4, E('same') + 0.5, att=0.6, rel=0.5)
