# Context and memory, governed: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, checked on 4 November 2026 against every score.py on main and on every branch, and against the
# series' other films (/mnt/project-files/agentic-data-engineering/series-2/palettes.md, where the series thread reserved the lead for
# this film and this film's thread took the partner): struck glass bars and a baritone sarrusophone, both made here (music.py has
# neither).
#  - The glass bars (a crystallophone), struck with soft mallets, low in their range: what the team knows, kept in the open and looked
#    after. Each bar is a pure tone that rings on and fades, with the faint, cool overtones of glass and the small touch of the mallet
#    on it; no resonator under it, nothing that trembles. A bar sounds for the team's memory: a bar for each card as it stands in the
#    file (the memory's figure, D, F sharp, A, B, D), the wrong line's own note (B), and the bars together for what the team approves.
#  - The baritone sarrusophone, the brass double reed, played softly and low, with no vibrato: the people who look after what the team
#    knows. It holds the low note under the opening, and after it sounds only where a person reviews, approves or owns something; never
#    for an agent. A person's approval is its rising fourth, A to D.
#  - The mark, as the series closes: one bar for each of the series' nine lessons, rising once (D, E, F sharp, A, B, D, E, F sharp, A)
#    as the nine lessons' places appear; then each lesson comes in without music, a card set down, and the film ends on the bars
#    together, D major.
#  - D major for the team and what it keeps; B minor for the wrong line and the students it left out; G major for a question and for
#    the library; A major at "Something had to change", which turns to D as the team governs. No E minor chord: its fifth isn't pure
#    in this tuning.
# The rules the series keeps (its briefs, 4 November 2026, as the module's other films do):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord is tuned pure (just intonation from D, see
#    hz()). No urgent pulse: nothing in this story is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen (31 days' tiles, 25
#    ticks in a table, ten marks) is one soft sound, never one for each.
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
R1 = np.random.default_rng(2029)  # this film's own randomness: the room, the breath, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D major (D F sharp
# A), G major (G B D), A major (A C sharp E), B minor (B D F sharp) and F sharp minor are all pure in this table; E with G or with B
# is not (32/27 and 40/27), so no E minor chord, and E sounds only with A, C sharp, D or F sharp
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the glass bars' notes, low in their range, and the sarrusophone's
D3, E3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, D5 = 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 74
D2, E2, Fs2, G2, A2, B2 = 38, 40, 42, 43, 45, 47
MEM = (D3, Fs3, A3, B3, D4)                    # the team's memory: a bar for each card in the file, the back one first
NINE = (D3, E3, Fs3, A3, B3, D4, E4, Fs4, A4)  # the mark: a bar for each of the series' nine lessons
WRONG = B3                                     # the wrong line's own note

# ---- the levels, set so the music's loud moments sit about -28 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the sarrusophone a little under the bars; the effects about
# 16 dB under the music (FX scales them all)
GL, SL, FX = 0.039, 0.024, 1.4

# a room round the players: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.3)).astype(np.float32))(np.arange(int(1.3 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s

# ---- a glass bar, struck with a soft mallet. Its first tone rings on and fades (low bars longer); the bar's overtones, two octaves up
# and higher, are faint and die quickly, as a struck glass bar's do, with the faint, slightly out-of-tune overtone of glass that
# fades in a fifth of a second. The mallet's touch: a small, soft tick with its top rolled off. No resonator, nothing trembles
def glass(m, s, g=1.0, pan=0.0, ring=None, room=0.32):
    f = hz(m); ring = ring or 1.0 + 0.9 * max(0.0, min(1.0, (300 - f) / 150))
    sec = min(5.5, ring * 3.4); x = tt(sec).astype(np.float64)
    sig = np.sin(2 * np.pi * f * x) * np.exp(-x / ring)
    for r, a, d in ((4.0, 0.10, 0.22), (2.756, 0.03, 0.10), (9.9, 0.012, 0.05)):
        if f * r < 2400:
            sig = sig + a * np.sin(2 * np.pi * f * r * x + 0.4 * r) * np.exp(-x / (ring * d))
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.012)) ** 2
    nt = int(0.03 * SR); tk = filt(noise(0.03)[:nt], 'band', (700, 2200)) * np.exp(-np.arange(nt) / SR / 0.004) * 0.06
    sig[:nt] += tk
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.1) / 0.1, 0, 1)) ** 2
    put(_room(filt(sig.astype(np.float32), 'low', 2400), room), s, g * GL, pan)
def roll(notes, s, step=0.1, g=1.0, pan=0.0, ring=None, spread=0.25):
    """bars struck one after another, the lowest first, ringing on together as a chord"""
    k = len(notes)
    for i, m in enumerate(notes):
        glass(m, s + step * i, g * (1.0 if i == 0 else 0.82) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5), ring)

# ---- the baritone sarrusophone: a brass double reed, its bore conical, so every harmonic sounds; the body's warmth near 500 Hz, soft
# above it, and nothing above 1.8 kHz at this level. The higher harmonics speak a moment after the first; a faint breath through the
# reed as the note starts. Held steady, with no vibrato; a note of 1.2 s or more swells a little and eases, once
def sarr(m, a, b, g=1.0, att=0.14, rel=0.5, pan=-0.1, room=0.3):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(1800 // f) + 1):
        fk = f * k
        w = (1 + 1.1 * np.exp(-((fk - 500) / 240) ** 2)) * np.exp(-max(0.0, fk - 650) / 420) / k ** 0.55
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.12 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.6 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.37 * k)
    if sec >= 1.2:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    br = filt(noise(n / SR + 0.01)[:n], 'band', (300, 1400)) * 0.006 * (np.where(x < sec, 1.0, np.exp(-(x - sec) * 20)) + 2.0 * np.exp(-x / 0.06))
    put(_room(filt((s + br).astype(np.float32), 'low', 1800), room), a, g * SL, pan)
def approve(s, g=1.0, hold=1.4, pan=-0.1):
    """a person approves: the sarrusophone's rising fourth, A to D"""
    sarr(A2, s, s + 0.42, g * 0.9, att=0.1, rel=0.25, pan=pan); sarr(D3, s + 0.48, s + 0.48 + hold, g, att=0.12, rel=0.8, pan=pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a row lit, a key"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.009, pan=0.0, step=0.13):
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.012, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def flick(s, g=0.010, pan=0.0):
    """a page flicked over: short and light"""
    paper(s, g, pan, 0.16)
def slide(s, g=0.010, pan=0.0, sec=0.3):
    """an index card slid into the file: a soft, short brush of card on card, and its small stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2 * np.exp(-x / sec), s, g * FX, pan)
    s_knock(s + sec * 0.8, g * 0.5 * FX, pan, 330)
def strike(s, g=0.009, pan=0.0, sec=0.4):
    """a word struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def pencil(s, sec=0.6, g=0.007, pan=0.0):
    """a pen writing: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def stamp(s, g=0.018, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.012, pan=0.0):
    """a script starts: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def binned(s, g=0.012, pan=0.0):
    """something dropped in the bin: a soft, low knock and a rustle"""
    s_knock(s, g * FX, pan, 170); paper(s + 0.01, g * 0.6, pan, 0.2)

# =============================================================================================================================
# 1. Lucía's first job: the opening, with music all through it.
#    Planning, today: the bars' home chord, D major, and the sarrusophone's low D under it; the calendar's page. Her agent: a bar. The
#    team's memory: a bar for each card as it stands in the file, the back one first (the memory's figure); people's ticks: a person's
#    approval, A to D. The library's question: G major, open. The draft: an open fifth, A and E. A plain check stops it: the stamp, and
#    B minor, the sarrusophone on B; the census report, a card. The 386 left out: two bars falling. The library would have bought for
#    fewer: G under B minor, the sarrusophone on G as the ring closes round the very ones. The evidence opens; the line lights: its
#    own note, B, with the sarrusophone's B. In May: approved, D major, and "Right, for rooms": the sarrusophone's D. Lost since last
#    week: three bars falling as the three words fall, then B minor held. Still there: the sarrusophone swells on A, and "Something
#    had to change" is A major; "governs": D major. The five ways: a bar rising for each, and a person's approval for "A person
#    reviews". Found: B rising to D, the stamp, the record. Now: the memory's figure again, the sarrusophone's D. All 18,412: G major
#    to D as the people come in. For data: one soft roll as the marks appear; the wrong lesson's own note, and the stamp. The title
#    card: the bars' home chord and the low D
F = lambda lid, word, off=0: W('first', lid, word, off)
f0 = S0('first')
roll((D3, A3, D4, Fs4), f0 + 0.5, 0.13, 0.8, ring=2.2)
sarr(D2, f0 + 0.8, F('place', 'Lucía', 0.3), 0.75, att=1.4, rel=1.4)
flick(F('place', 'Monday', 0.0), 0.010, px(200))
glass(A3, F('memory', 'Her agent', -0.05), 0.55, px(1060))
tL = F('memory', 'lessons')
for k, m in enumerate(MEM):
    glass(m, tL + 0.16 * k + 0.04, 0.62, px(1530) + 0.04 * (k - 2), ring=1.3)
slide(tL + 0.02, 0.010, px(1530)); slide(tL + 0.66, 0.010, px(1530))
approve(F('memory', 'approved', 0.1), 0.85, hold=2.2)
# the library's question
tQ = F('job', 'library', -0.4)
knock(tQ + 0.1, 0.014, px(430), 260)
roll((G3, B3, D4), tQ + 0.2, 0.12, 0.65)
# the draft, and the plain check that stops it
tD = F('draft', 'eighteen', -0.3)
paper(tD + 0.05, 0.010, px(1500), 0.35)
glass(A3, tD + 0.12, 0.5, px(1500)); glass(E4, tD + 0.3, 0.4, px(1500))
tS = F('check', 'stopped')
click(tS - 0.65, 0.012, px(1500))
stamp(tS + 0.1, 0.018, px(1660))
sarr(B2, tS + 0.12, F('online', 'study online', -0.3), 0.75, att=0.35, rel=1.0)
roll((B3, D4, Fs4), tS + 0.14, 0.09, 0.6, ring=1.6)
knock(F('check', 'census report', -0.1), 0.014, px(1500), 220)
# the 386 left out: two bars falling as the pill comes; the people who study online move out of the room
tN = F('online', 'three hundred', -0.2)
glass(Fs3, tN + 0.05, 0.5, px(860)); glass(D3, tN + 0.45, 0.5, px(860))
air(F('online', 'study online', 0.0), 1.0, 0.008, px(300), 160, 700)
# what the library would have bought: its card; G under B minor as the ring closes round the very ones
knock(F('books', 'would have', -0.15), 0.014, px(1460), 240)
sarr(G2, F('books', 'very ones', -0.1), END('first', 'books') + 0.9, 0.75, att=0.6, rel=1.2)
roll((G3, B3, D4), F('books', 'very ones', 0.0), 0.12, 0.55, ring=1.8)
# the evidence, and the one line in the team's memory: its own note
tE = F('line', 'evidence')
paper(tE - 0.1, 0.010, px(440), 0.4)
glass(WRONG, F('line', "team's memory", -0.15), 0.65, px(1380), ring=1.8)
sarr(B2, F('line', "team's memory", -0.1), F('line', 'Count only', 0.6), 0.6, att=0.5, rel=0.9)
slide(F('line', 'Count only', -0.2), 0.009, px(1380))
# approved in May for exam rooms: D major, and a person's D
roll((D3, Fs3, A3), F('may', 'approved as', 0.0), 0.11, 0.6)
sarr(D3, F('may', 'Right, for rooms', -0.05), END('first', 'may') + 0.5, 0.7, att=0.25, rel=0.9)
# lost since last week: three bars falling as the three words fall away, then B minor held, and nobody saw
tW3 = F('lost', 'three words', -0.3)
for i, m in enumerate((A3, Fs3, D3)):
    glass(m, tW3 + 0.12 + 0.24 * i, 0.5 - 0.06 * i, px(1100 - 120 * i), ring=1.2)
sarr(B2, F('lost', 'nobody', -0.2), END('first', 'lost') + 1.0, 0.7, att=0.8, rel=1.2)
glass(Fs3, F('lost', 'nobody', 0.0), 0.4, px(960), ring=1.8)
# still there: every agent reads it; something had to change: the sarrusophone swells on A, A major
sarr(A2, F('still', 'questions', -0.2), F('govern', 'governs', -0.6), 0.65, att=1.2, rel=0.8)
roll((Cs4, E4), F('still', 'Something', 0.0), 0.14, 0.5, ring=1.6)
# the team governs its context and memory like any data: D major
tG = F('govern', 'governs', -0.5)
roll((D3, A3, D4, Fs4), tG, 0.12, 0.75, ring=2.0)
sarr(D2, tG + 0.05, F('govern', 'any data', 0.4), 0.7, att=0.5, rel=1.2)
knock(F('govern', 'context', -0.15), 0.012, px(610), 260); knock(F('govern', 'memory', -0.15), 0.012, px(1310), 260)
# the five ways, a bar rising for each; a person's approval for "A person reviews"; a lock for "never change"
glass(D3, F('five', 'an owner', -0.05), 0.5, px(520))
glass(Fs3, F('five', 'Agents may read', -0.05), 0.5, px(960)); lock(F('five', 'Agents may read', 0.1), 0.010, px(860))
approve(F('five', 'A person', -0.1), 0.75, hold=1.0, pan=px(1400))
glass(B3, F('kept', 'kept only', -0.05), 0.5, px(700))
glass(D4, F('kept', 'everywhere', -0.05), 0.5, px(1220))
# found against its source, deleted, with a record of why
paper(F('found', 'source', -0.8), 0.010, px(480), 0.4)
glass(B3, F('found', 'found and', -0.1), 0.5, px(1400)); glass(D4, F('found', 'found and', 0.2), 0.5, px(1400))
stamp(F('found', 'deleted', 0.0), 0.018, px(1560))
paper(F('found', 'record', -0.2), 0.010, px(960), 0.4)
# now her agent starts with what the team knows: the memory's figure, and the sarrusophone's D under it
tK = F('now', 'what the team knows', -1.4)
for k, m in enumerate(MEM):
    glass(m, tK + 0.5 + 0.18 * k, 0.55, px(1530) + 0.04 * (k - 2), ring=1.3)
sarr(D2, tK + 0.6, F('now', 'who approved', 0.8), 0.65, att=1.0, rel=1.2)
# the library buys for all 18,412: G major to D as the people come in
tA = F('all', 'for all')
knock(tA - 0.8, 0.014, px(1370), 240)
roll((G3, B3, D4), tA, 0.13, 0.6, ring=1.4); roll((D3, Fs3, A3, D4), tA + 1.3, 0.12, 0.7, ring=2.0)
air(tA + 0.2, 1.4, 0.008, px(400), 160, 700)
# and for data: the cards; one soft roll as the ten marks appear; the wrong lesson's own note, and the stamp: it stays gone
knock(F('data', 'what agents read', -0.15), 0.012, px(600), 260); knock(F('data', 'what they count', -0.15), 0.012, px(1320), 260)
roll((D4, Fs4, A4), F('data', 'what they count', 0.65), 0.2, 0.45, ring=1.2)
glass(WRONG, F('data', 'a wrong lesson', 0.0), 0.5, px(960), ring=1.4)
stamp(F('data', 'stays gone', 0.0), 0.016, px(960))
# the title card: the bars' home chord, D major, and the low D
tT = G('first', 'breath', 0.3)
roll((D3, A3, D4, Fs4, A4), tT, 0.16, 0.85, ring=2.6)
sarr(D2, tT + 0.1, E('first') + 0.4, 0.7, att=1.0, rel=1.6)

# 2. What an agent reads: a bar for the turn as the four kinds of context come; each card set down as it's named; the memory, the
#    wrong line's note's neighbour, B; the marks of what's governed, rising; a soft tap as each question lights its column; the
#    questions a chat can't answer, one low knock; the team's context and memory answer all five: D major, and a person's D under it
R = lambda lid, word, off=0: W('reads', lid, word, off)
r0 = S0('reads')
glass(Fs3, r0 + 0.4, 0.45, 0.0, ring=1.6)
for i, w_ in enumerate(('code', 'metadata', 'skills', 'tools')):
    knock(R('began', w_, -0.1), 0.010, px((475, 1445, 475, 1445)[i]), 260)
glass(B3, R('adds', 'memory', -0.1), 0.5, px(960), ring=1.6)
knock(R('adds', 'memory', -0.1), 0.010, px(960), 260)
roll((D4, Fs4, A4), R('data', 'gets what', 0.1), 0.16, 0.45, ring=1.2)
for lid in ('owns', 'may', 'reviews', 'kept', 'gone'):
    tap(G('reads', lid, -0.15), 0.008, 0.0)
knock(R('chat', 'none of them', 0.05), 0.010, px(560), 170)
tAn = R('chat', "The team's context", 0.25)
roll((D3, Fs3, A3, D4), tAn, 0.12, 0.65, ring=1.8)
sarr(D2, tAn + 0.1, tAn + 2.4, 0.6, att=0.6, rel=1.2)

# 3. Context, reviewed like code: the repository set down; a soft tap as each part of it lights; CODEOWNERS, its lines typed. A
#    change: the pull request laid down; its owner reviews it (the sarrusophone's D), a second person approves it (A to D); the
#    agent's lock. The history, a row at a time. One way to Databricks: three bars rising as the arrow goes; the table and the skill
#    set down, their rows; nobody edits there (a lock); a change starts in the repository: D major, gently
C = lambda lid, word, off=0: W('code', lid, word, off)
c0 = S0('code')
knock(c0 + 0.1, 0.012, px(495), 240)
for w_ in ('the page for agents', 'the skills', "dbt's descriptions", 'the contracts'):
    tap(C('lives', w_, -0.1), 0.008, px(495))
knock(C('owner', 'an owner', -0.15), 0.012, px(1400), 240)
keys(C('owner', 'an owner', 0.05), 3, 0.007, px(1400), 0.3)
paper(C('pull', 'pull request', -0.3), 0.011, px(1400), 0.4)
sarr(D3, C('pull', 'its owner reviews', 0.5), C('pull', 'its owner reviews', 1.6), 0.7, att=0.12, rel=0.7, pan=px(1400))
approve(C('pull', "second person's", 0.5), 0.85, hold=1.4, pan=px(1400))
lock(C('propose', 'never approve', -0.05), 0.010, px(1400))
paper(C('history', 'history', -0.3), 0.010, px(1400), 0.35)
for w_ in ('who changed', 'and why'):
    tap(C('history', w_, -0.15), 0.007, px(1400))
tOW = C('oneway', 'one way')
air(tOW - 0.2, 0.9, 0.009, px(510), 180, 900)
roll((D3, A3, D4), tOW - 0.1, 0.22, 0.5, pan=-0.1, ring=1.4, spread=0.5)
knock(C('comments', 'Unity Catalog', -0.25), 0.012, px(930), 240)
knock(C('skills', 'Unity Gateway', -0.25), 0.012, px(1560), 240)
for w_ in ('Unity Catalog object', 'an owner', 'permissions', 'a record'):
    tap(C('object', w_, -0.1), 0.007, px(1560))
lock(C('nobody', 'Nobody', -0.05), 0.010, px(1700))
roll((D3, Fs3, A3), C('nobody', 'A change starts', 0.0), 0.14, 0.5, ring=1.8)

# 4. Memory, kept like data: B minor at the turn, the sarrusophone on B. The agents write their sessions: a pen for each. The daily
#    step: a click as it turns up; the line it keeps unasked slides in, with no one's note. How the campus line lost its words: its own
#    note, B; the two lines merge, F sharp settling to D. Split in two: G major, the proposals' cards and a lock. Each morning: the
#    script, the pull request, its two files. The person confirms; the owner of its meaning approves: the stamp, a person's approval
#    and D major. Yusuf owns the memory as a whole: the sarrusophone's low D. The load: the memory's figure as the cards stand in the
#    team's store, and its lock
M = lambda lid, word, off=0: W('memory', lid, word, off)
m0 = S0('memory')
sarr(B2, m0 + 0.3, m0 + 2.6, 0.6, att=0.8, rel=1.2)
glass(Fs3, m0 + 0.35, 0.45, 0.0, ring=1.6); glass(B3, m0 + 0.5, 0.4, 0.0, ring=1.6)
for i in range(3):
    pencil(M('different', 'agents write', 0.2 + 0.3 * i), 0.5, 0.006, px(270))
paper(M('lakebase', 'lasting memory', -0.3), 0.009, px(1400), 0.3)
click(M('daily', 'A step', -0.15), 0.011, px(590))
slide(M('daily', 'keeps what', 0.15), 0.010, px(1400))
glass(WRONG, M('how', 'campus line', -0.15), 0.55, px(960), ring=1.6)
tMg = M('how', 'merged')
glass(Fs4, tMg + 0.05, 0.4, px(960), ring=1.0); glass(D4, tMg + 1.0, 0.45, px(960), ring=1.6)
slide(tMg + 0.5, 0.009, px(960))
lock(M('room', 'nothing records', 0.1), 0.008, px(960))
tSp = M('split', 'split it in two')
roll((G3, B3, D4), tSp - 0.1, 0.13, 0.55, ring=1.8)
knock(tSp - 0.15, 0.012, px(370), 240)
for i in range(2):
    slide(M('split', 'only proposals', 0.2 + 0.3 * i), 0.008, px(370))
lock(M('split', 'no agent reads', -0.05), 0.009, px(370))
click(M('morning', 'a script', -0.25), 0.011, px(300))
paper(M('morning', 'pull request', -0.2), 0.010, px(1400), 0.35)
tap(M('morning', 'one file', 0.0), 0.008, px(1400)); tap(M('morning', 'one file', 0.35), 0.008, px(1400))
paper(M('confirm', 'The person', -0.3), 0.009, px(1400), 0.3)
tAp4 = M('confirm', 'approves', 0.2)
stamp(tAp4, 0.018, px(1680))
approve(tAp4 + 0.05, 0.85, hold=1.4, pan=px(1400))
roll((D3, Fs3, A3), tAp4 + 0.55, 0.12, 0.5, ring=1.8)
knock(M('yusuf', 'data governance', -0.4), 0.012, px(1400), 240)
sarr(D2, M('yusuf', 'as a whole', -0.2), M('yusuf', 'as a whole', 1.9), 0.65, att=0.5, rel=1.0, pan=px(420))
click(M('load', 'a script loads', -0.25), 0.011, px(980))
tSt = M('load', "the team's store")
for k, m in enumerate(MEM):
    glass(m, tSt + 0.15 * k + 0.02, 0.55, px(1530) + 0.04 * (k - 2), ring=1.3)
lock(M('load', 'none may change', -0.05), 0.010, px(1530))

# 5. Kept, then deleted: the strip of days comes in as one soft brush; the team decides both: the sarrusophone. The scheduled job: a
#    click; each day the oldest falls into the bin. Its owner checks the entry: the stamp, the sarrusophone's D. A proposal naming a
#    student is turned down: two bars falling a fourth, B to F sharp. The chat dropped in the bin; still in the team's memory: the
#    wrong line's note; the docs' words laid down. The sync: a click, its arrows. Deleted where it's kept: the pull request, a person's
#    approval; the next load, the line struck through and slid out. The record stays; no agent will read the line again: D major
K = lambda lid, word, off=0: W('keep', lid, word, off)
k0 = S0('keep')
air(k0 + 0.15, 1.1, 0.008, 0.0, 200, 1000)
sarr(A2, K('decide', 'decisions', -0.1), K('decide', 'decisions', 1.6), 0.6, att=0.4, rel=1.0)
glass(D4, K('decide', 'decisions', 0.0), 0.4, 0.0, ring=1.6)
click(K('thirty', 'scheduled job', -0.25), 0.011, px(420))
tDel = K('thirty', 'deletes them')
for n_ in range(2):
    t_ = tDel + 1.7 * n_ + 0.62
    if t_ < G('keep', 'again', -0.5):
        binned(t_, 0.010, px(172))
paper(G('keep', 'again', -0.25), 0.010, px(510), 0.35)
tCk = K('again', 'its owner does', 0.1)
stamp(tCk, 0.016, px(720))
sarr(D3, tCk + 0.05, tCk + 1.6, 0.65, att=0.15, rel=0.9, pan=px(510))
paper(K('names', 'names no student', -0.7), 0.009, px(1410), 0.3)
stamp(K('names', 'names no student', 0.2), 0.016, px(1664))
glass(B3, K('names', 'names no student', 0.25), 0.5, px(1410), ring=1.0); glass(Fs3, K('names', 'names no student', 0.59), 0.5, px(1410), ring=1.4)
paper(G('keep', 'traps', -0.25), 0.009, px(460), 0.35)
binned(K('traps', 'delete the chat', 0.75), 0.011, px(460))
glass(WRONG, K('nothing', 'deletes nothing', -0.1), 0.55, px(1420), ring=1.8)
paper(K('nothing', 'the docs say', -0.35), 0.010, px(540), 0.4)
click(K('sync', 'the sync', -0.25), 0.011, px(1060))
air(K('sync', 'the sync', 0.3), 0.7, 0.007, px(1300), 180, 900)
paper(K('where', 'where a thing', -0.2), 0.010, px(530), 0.4)
approve(K('where', 'says why', 0.85), 0.8, hold=1.2, pan=px(530))
click(K('where', 'its entry', -0.35), 0.011, px(1175))
strike(K('where', 'next load', -0.25), 0.008, px(1480))
slide(K('where', 'next load', 0.4), 0.009, px(1480))
paper(K('record', 'The record', -0.3), 0.010, px(530), 0.35)
for w_ in ('who added', 'who deleted', 'and why'):
    tap(K('record', w_, -0.15), 0.007, px(530))
roll((D3, Fs3, A3, D4), K('record', 'No agent', 0.0), 0.13, 0.6, ring=2.0)

# 6. What the team knows: back in Planning, the bars' home chord and the low D. Her agent's answer: D major rising, A, D, F sharp, as
#    its evidence opens. The library buys for every student: G major. Every agent and every newcomer starts from what the team knows:
#    a person's approval for "approved by people". Where the series began: the context, set down. Nine
#    films, nine lessons: the mark, a bar for each lesson rising once as their places appear, in the pause before the first; then each
#    lesson's card set down as it's said, with no music under the voice. The longer road: D major, and the low D; "Next": a fourth
#    rising. The end card: the bars together, D major, and the low D under them, ringing out
X_ = lambda lid, word, off=0: W('close', lid, word, off)
x0 = S0('close')
roll((D3, A3, D4), x0 + 0.4, 0.14, 0.6, ring=2.0)
sarr(D2, x0 + 0.5, X_('again', 'asks again', 0.6), 0.6, att=0.8, rel=1.2)
knock(X_('again', 'asks again', -0.4), 0.012, px(410), 240)
paper(X_('answer', 'with its evidence', -0.1), 0.010, px(460), 0.4)
roll((A3, D4, Fs4), X_('answer', 'with its evidence', 0.1), 0.18, 0.55, ring=1.8)
knock(G('close', 'library', -0.3), 0.012, px(1370), 240)
roll((G3, B3, D4), X_('library', 'online or on campus', -0.1), 0.13, 0.55, ring=1.1)
approve(X_('same', 'what the team knows', -0.05), 0.75, hold=1.6)
knock(G('close', 'began', -0.3), 0.010, px(960), 260)
tNn = X_('began', 'Nine films', 0.15)
for i, m in enumerate(NINE):
    glass(m, tNn + 0.16 * i, 0.5, px((364, 960, 1556)[i % 3]), ring=1.4)
for i in range(1, 10):
    knock(G('close', 'l%d' % i, -0.1), 0.009, px((364, 960, 1556)[(i - 1) % 3]), 260)
tRd = X_('road', 'a longer road', 0.1)
air(tRd - 0.4, 1.8, 0.008, px(700), 160, 800)
roll((D3, A3, D4, Fs4), tRd, 0.14, 0.6, ring=1.6)
sarr(D2, tRd + 0.1, tRd + 2.6, 0.6, att=0.6, rel=1.4)
glass(A3, X_('next', 'Next', -0.05), 0.45, px(1560), ring=0.9); glass(D4, X_('next', 'Next', 0.35), 0.5, px(1560), ring=1.0)
tEnd = G('close', 'breath', 0.6)
roll((D3, A3, D4, Fs4, A4, D5), tEnd, 0.17, 0.85, ring=2.8)
sarr(D2, tEnd + 0.2, E('close'), 0.7, att=1.2, rel=2.0)
