# The team comes first: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (palettes.md, 5 November 2026: a lead the setup thread reserved, which no score on main or on any
# branch has, and which no other module's palette names): tuned ceramic tiles, made here, as music.py has none.
#  - The tiles: glazed stoneware tiles, each cut to its own note, laid flat on strips of felt and struck softly with felt beaters. Each
#    tile is one note: a round, short tone with a faint clink of the glaze in it, the bar's second mode high above it and out of tune
#    with it, as a tile's is, gone almost at once. The felt under it takes the ring quickly: earthy and short, never a shimmer. A tile
#    alone is only a note; the tune is there only when they're laid together.
#  - Its partner, the thread's choice: the big floor tiles at the low end of the same table, thick and wide, struck by a second player
#    with a large, soft beater: a low, round note with almost nothing above it, felt more than heard. Two players at one table of tiles,
#    and neither has the tune alone, as the film's team has no one person the work depends on. A second colour would have meant one the
#    site lacks, and those either belong to another culture or sound like one the site has (the long list in the module's palettes.md),
#    as film 1's and Modern data basics' threads found too.
# The mark: single notes from far apart, in register and across the stereo field, that meet as one chord. It sounds when the women
# form their stokvel and the ring closes; when the group carries the member in hard times; when four people can answer every night
# alert; when the team carries Sam, because everyone had paid in; and at the close, into the end card. Each time in its own voicing.
# A-flat major, F minor for the problem (no bank, the harm a funeral could do, the night alerts on one person, Sam's mother in
# hospital), and A-flat major again as the group, and then the team, holds. Every chord is tuned pure from A flat (just intonation,
# see hz()): A flat, D flat and E flat major, and F and C minor, are all pure in this table; B flat held with D flat or with F is not,
# and is never played. Nothing South African for the stokvels: no tune, rhythm or instrument of the place (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one tile, struck once, steady; each damped before it would ring into the next chapter. No
#    urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/tf_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() takes a word's first appearance, even inside a longer word, and falls back to the line's start when it's missing; here either
# stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1936)  # this film's own randomness: the room, the paper, the coins

# ---- tuning: just intonation from A flat, so a chord's notes are whole-number ratios of each other and nothing beats. A flat, D flat
# and E flat major, and F and C minor, are pure in this table; B flat with D flat or F is not, and never sounds with them
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 44, 12)
    return 103.8262 * 2 ** o * _JI[pc]
Eb2, F2, G2, Ab2, C3, Db3, Eb3, F3, G3, Ab3 = 39, 41, 43, 44, 48, 49, 51, 53, 55, 56
C4, Db4, Eb4, F4, G4, Ab4, C5, Db5, Eb5, F5, Ab5 = 60, 61, 63, 65, 67, 68, 72, 73, 75, 77, 80

# ---- the levels: the tiles and the floor tiles matched by loudness, as far under the voice as the module's other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LH, LL, FX = 0.06, 0.075, 3.2
LV = [1.0]

# a small room round the table of tiles, ringing on for under a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.85)).astype(np.float32))(np.arange(int(0.85 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), as a room lifts some pitches and
    hollows others, and every note should sound as loud as its neighbours"""
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a time in the film, a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig
def _felt(sec, n, f=300, d=0.008):
    """the felt beater meeting the tile: a little low noise, gone in a few thousandths of a second"""
    x = np.arange(n) / SR; th = filt(noise(sec + 0.02)[:n], 'low', f) * np.exp(-x / d)
    return th / max(1e-9, float(np.abs(th).max()))

# ---- a struck tile: its first mode, round and short as the felt under it takes the ring; the bar's second and third modes, at 2.76 and
# 5.40 times, as a tile's are, out of tune with every note and so kept faint and gone almost at once (they never last long enough to
# beat with anything); a soft clink of the glaze as the beater meets it
def _tile(f0, x, t1, glaze, top=2400):
    sig = np.sin(2 * np.pi * f0 * x) * np.exp(-x / t1)
    for r, a, d in ((2.756, 0.2 * glaze, 0.16), (5.404, 0.06 * glaze, 0.06)):
        if f0 * r < top:
            sig += a * np.sin(2 * np.pi * f0 * r * x + 0.6) * np.exp(-x / (t1 * d))
    return sig

def tile(m, s, g=1.0, pan=None, ring=None, room=0.22, until=None):
    """one tile struck softly with felt at s: a round, short note, damped by the felt it lies on (ring: how long it may sound)"""
    f0 = hz(m); t1 = 0.42 * (260 / f0) ** 0.35; d = ring if ring else 1.1
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _tile(f0, x, t1, 1.0)
    sig *= (1 - np.exp(-x / 0.003)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    clink = filt(noise(0.03)[:int(0.03 * SR)], 'band', (900, 2200)) * np.exp(-np.arange(int(0.03 * SR)) / SR / 0.0025)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.04 * _felt(sec, n); sig[:len(clink)] += 0.025 * clink / max(1e-9, float(np.abs(clink).max()))
    sig = sig.astype(np.float32); sig = sig + 0.2 * filt(sig, 'band', (200, 500))   # the felt strips and the table under them
    sig = _until(_room(norm(filt(filt(sig, 'low', 2300), 'high', 80)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LH, max(-0.4, min(0.4, (m - 64) * 0.02)) if pan is None else pan)

def low(m, s, g=1.0, pan=None, ring=None, room=0.18, until=None):
    """the second player: a big floor tile struck with a large, soft beater, softer at its start and ringing a little longer, a round
    low note with almost nothing above it"""
    f0 = hz(m); t1 = 0.8 * (104 / f0) ** 0.3; d = ring if ring else 1.4
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _tile(f0, x, t1, 0.35, 1500)
    sig *= (1 - np.exp(-x / 0.006)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.08))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.06 * _felt(sec, n, 200, 0.012)
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (80, 200))   # the floor tile's body
    sig = _until(_room(norm(filt(filt(sig, 'low', 1400), 'high', 40)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LL, -0.1 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.12, ring=2.0, until=None, pans=None):
    """tiles struck from the lowest up, the lowest by the second player when it's low, all damped together at the end"""
    for i, m in enumerate(notes):
        r = max(0.4, ring - step * i); p = pans[i] if pans else None
        (low if (i == 0 and m < Ab3) else tile)(m, s + step * i, g, p, r, until=until)
def notes(ms, s, g=1.0, step=0.4, ring=0.6, last=None, pans=None, until=None):
    """single tiles, one after another, each damped before the next but one, so nothing that isn't pure rings together"""
    k = len(ms)
    for i, m in enumerate(ms):
        r = last if (last and i == k - 1) else ring; p = pans[i] if pans else None
        (low if m < Ab3 else tile)(m, s + step * i, g, p, r, until=until)
def mark(apart, together, s, gaps, g=1.0, ring=2.4, until=None):
    """the mark: single notes from far apart, each from its own place in the stereo field and its own register, coming closer in time
    (gaps: the time before each next one), until they meet as one chord, centred, struck together"""
    t = s
    for i, (m, p) in enumerate(apart):
        (low if m < Ab3 else tile)(m, t, 0.85 * g, p, 0.55, until=until)
        t += gaps[i]
    for j, m in enumerate(together):
        (low if (j == 0 and m < Ab3) else tile)(m, t + 0.012 * j, g, 0.0, ring, until=until)
    return t

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.006, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and the pin's faint tap"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.19)[:n], 'band', (360, 1700)) * _bump(x, 0.08) * (x < 0.08)
    _fx(fl + 0.5 * _knock(n, 170, 0.014, 0.075) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down, or a line coming up on a phone: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (240, 1000)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 200, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a bar drawn out along a sheet: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def coin(s, g=0.004, pan=0.0):
    """a coin laid in the tin: a small, dull clink, its ring low-passed and gone at once"""
    n = int(0.12 * SR); x = np.arange(n) / SR
    ring = sum(a * np.sin(2 * np.pi * f * x) for f, a in ((1180, 1.0), (1690, 0.5), (2050, 0.25))) * np.exp(-x / 0.022)
    _fx(ring * np.minimum(1, x / 0.0008) + 0.4 * _knock(n, 240, 0.01), s, g, pan, 2200)
def pour(s, sec=0.9, g=0.0045, pan=0.0):
    """the tin tipped out for one member: coins sliding together, one soft texture that swells and stops, not a shower of clinks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (600, 2000)) * _bump(x, sec, 0.9) * (0.4 + 0.6 * gr), s, g, pan, 2100)

# =============================================================================================================================
# 1. Through other people: the opening, the module's story from outside data. Johannesburg, the 1930s: the second player's low A flat,
#    alone, then A-flat major as the city's name comes up. Three single tiles, one for each woman's work as it's named, from left to
#    right; F minor, low, under the low and irregular pay. The stokvel formed: the mark, as the ring draws itself closed. Coins laid in
#    the tin, the tin tipped out for one member, and four tiles rising as each has her turn. The banks: F minor, low; no loans; the
#    harm: F and C, low, under "could ruin a family"; nothing under "Something had to change", then D-flat major as they build their
#    own way. The rules pinned up; the lines of trust drawn, a chord spread slowly; coins again as almost nobody fails to pay. The
#    burial society: D flat, low. The group carries her: the mark again, in D flat, as the green lines reach her. Ubuntu: A-flat major,
#    held, under "a person is a person through other people". Their savings, their credit, their safety net: a tile each. The two
#    figures pinned up; the team's ring, a chord as every line reaches the work; one high tile as one of them steps away, and the low A
#    flat as the group holds; A-flat major, held, under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('stokvel', lid, word, off)
oc = lambda lid, off=0: G('stokvel', lid, off)
END = E('stokvel')
low(Ab2, 0.5, 0.85, 0.0, ring=3.2)
chord((Ab2, Eb3, Ab3, C4), ow('when', 'Johannesburg', 0.2), 0.7, step=0.18, ring=2.8)
card(ow('when', 'Johannesburg', -0.2), 0.004, px(410))
# washing, sewing, selling: one tile for each woman's work, where she stands
for word, m, x in (('washing', C4, 480), ('sewing', Eb4, 960), ('selling', Ab4, 1440)):
    tile(m, ow('earn', word, -0.1), 0.6, px(x) * 0.6, ring=0.9)
chord((F2, C3, Ab3), ow('earn', 'irregular', -0.1), 0.5, step=0.2, ring=2.2)
# the stokvel formed: the mark, as the ring draws itself closed (from "trust", over 1.6 s)
mark(((Ab2, -0.6), (Eb5, 0.6), (C4, -0.3), (Ab4, 0.3)), (Ab2, C4, Eb4, Ab4), ow('group', 'trust', -0.3), (0.55, 0.45, 0.35, 0.3), 0.75, ring=2.6)
# each pays into the pot: a few coins laid in the tin; the tin tipped out for one; each member's turn, a tile each, rising
p1 = ow('turn', 'pays', -0.1)
for k in (0, 3, 6):
    coin(p1 + k * 0.12 + 0.9, 0.0035, px(1300))
pour(ow('turn', 'takes', 0.0), 0.9, 0.0045, px(1300))
notes((Ab3, C4, Eb4, Ab4), ow('turn', 'until', 0.1), 0.55, step=0.42, ring=0.5, last=1.4)
# the banks: few had an account, and none would lend: F minor, low, and each sheet pinned
card(ow('banks', 'bank', -0.4), 0.004, px(370))
chord((F2, C3, F3, Ab3), ow('banks', 'bank', -0.2), 0.6, step=0.2, ring=2.4)
card(ow('lend', 'lend', -0.3), 0.004, px(1550))
# what one funeral, a term's fees or a lost wage could do
chord((F2, C3), ow('harm', 'ruin', -0.1), 0.55, step=0.3, ring=2.2, until=oc('change', -0.4))
# something had to change, with nothing under it; then their own way, out of trust: D-flat major
card(ow('change', 'built', -0.3), 0.004, px(1450))
chord((Db3, F3, Ab3, Db4), ow('change', 'built', 0.0), 0.6, step=0.16, ring=2.2)
card(ow('rules', 'rules', -0.2), 0.004, px(460))
# every member answers to the others: the lines of trust drawn, a chord spread slowly; almost nobody fails to pay: coins
chord((Ab2, Eb3, C4, Eb4, Ab4), ow('answer', 'answers', -0.2), 0.5, step=0.3, ring=2.2)
n0 = ow('answer', 'nobody', -0.3)
for k in (1, 5):
    coin(n0 + k * 0.1 + 0.9, 0.0032, px(1430))
# the burial society: D flat, low
chord((Db3, Ab3, F4), ow('burial', 'burial', -0.1), 0.5, step=0.22, ring=1.8)
# the group carries her: the mark, in D flat, as the green lines from all the others reach her
mark(((Db3, -0.55), (F5, 0.6), (Ab3, -0.25), (Db4, 0.25)), (Db3, F3, Ab3, Db4), ow('carry', 'carries', -0.2), (0.5, 0.4, 0.32, 0.28), 0.7, ring=2.2)
# Ubuntu: A-flat major, held, under a person is a person through other people
card(ow('ubuntu', 'Ubuntu', -0.2), 0.004, px(1480))
chord((Ab2, Eb3, Ab3, C4, Eb4), ow('ubuntu', 'person', 0.0), 0.6, step=0.2, ring=3.0)
# their savings, their credit, their safety net: a tile for each
for word, m, x in (('savings', Eb4, 330), ('credit', Ab4, 620), ('safety', C5, 910)):
    tile(m, ow('decades', word, -0.1), 0.5, px(x) * 0.6, ring=0.8)
# more than 11 million, over 50 billion rand
card(ow('today', 'million', -0.6), 0.004, px(570)); card(ow('rand', 'billion', -0.6), 0.004, px(1350))
chord((Eb3, G3, Eb4), ow('rand', 'billion', -0.3), 0.45, step=0.15, ring=1.6)
# a team holds its people the same way: a chord as every line reaches the work
card(oc('team', 0.1), 0.004, px(960))
chord((Ab2, C4, Eb4, Ab4), ow('team', 'alone', -0.2), 0.5, step=0.22, ring=2.0)
# one of them steps away, far out of the ring: one high tile; the group holds: the low A flat
tile(C5, ow('step', 'step', -0.1), 0.45, 0.45, ring=1.0)
low(Ab2, ow('step', 'holds', -0.1), 0.6, 0.0, ring=1.6)
# the title: A-flat major, held, damped before the next chapter
chord((Ab2, Eb3, Ab3, C4, Eb4, Ab4), oc('breath', 0.3), 0.7, step=0.18, ring=4.4, until=END)

# 2. The team as a whole: the chapter turns on D-flat major, a year from now. Helena's card; the one-to-ones' card; the reading of the
#    team pinned up, its green bar drawn out and her last team struck through; they might look slow, and what this team really does,
#    each pinned. The balance tips to leading: the low C; their wellbeing first: A-flat major. Wellbeing isn't only comfort: its card;
#    the member carried back into the ring: three tiles rising as the team keeps working together. The gap that matters most: F and C,
#    low, as Sam is marked. The night: F minor, low; three soft taps as the alerts come up; the figure pinned. The lines lean on Sam,
#    and one tile, high and alone, as he has nobody to lean on
LV[0] = 0.9
hw = lambda lid, word, off=0: W('whole', lid, word, off)
hc = lambda lid, off=0: G('whole', lid, off)
chord((Db3, Ab3, Db4, F4), S0('whole') + 0.3, 0.6, step=0.16, ring=2.2)
card(hw('helena', 'Helena', -0.3), 0.004, px(540))
card(hc('weekly', 0.1), 0.004, px(480))
card(hc('whole', 0.1), 0.004, px(960)); slide(hw('whole', 'together', -0.3), 0.9, 0.0035, px(960))
pen(hw('really', 'last', 0.0), 0.5, 0.0045, px(560), 2)
card(hc('slow', 0.2), 0.004, px(600)); card(hw('eleven', 'eleven', -0.6), 0.004, px(1320))
low(C3, hw('weighs', 'weighs', -0.2), 0.55, 0.0, ring=1.4)
chord((Ab2, Eb3, C4, Ab4), hw('first', 'wellbeing', -0.1), 0.55, step=0.2, ring=2.2)
card(hc('comfort', 0.1), 0.004, px(470))
notes((Eb4, Ab4, C5), hw('open', 'together', -0.1), 0.5, step=0.3, ring=0.5, last=1.2, pans=(0.25, 0.3, 0.35))
chord((F2, C3), hw('gap', 'gap', -0.3), 0.5, step=0.25, ring=1.8)
chord((F2, C3, Ab3), hc('sam', -0.1), 0.5, step=0.2, ring=2.0)
for d in (0.4, 1.3, 2.2):
    tap(hw('sam', 'alert', -0.4) + d, 0.0035, px(1340))
card(hw('sixty', 'sixty', -0.5), 0.004, px(1370))
tile(Ab4, hw('leans', 'nobody', -0.1), 0.45, 0.4, ring=1.6)

# 3. Said out loud: the chapter turns on E-flat major; the agent's draft pinned, and its line marked; caught, but only just: two tiles,
#    falling. The next morning: thank you, two tiles rising; the glossary written; the researcher's card, the two kinds of hospital
#    team; in 51 work teams, a tile for each step as it's drawn, the last over the low A flat; the whole team learns: A-flat major
LV[0] = 0.9
aw = lambda lid, word, off=0: W('aloud', lid, word, off)
ac = lambda lid, off=0: G('aloud', lid, off)
chord((Eb3, G3, Eb4), S0('aloud') + 0.3, 0.55, step=0.16, ring=2.0)
card(aw('april', 'drafted', -0.6), 0.004, px(1370)); pen(aw('draft', 'booked', -0.2), 0.4, 0.004, px(1350), 2)
notes((Eb4, C4), aw('caught', 'catches', -0.1), 0.5, step=0.34, ring=0.5, last=1.2, pans=(0.3, 0.3))
card(ac('standup', -0.1), 0.004, px(440))
notes((Eb4, Ab4), aw('thanks', 'Jun', -0.1), 0.5, step=0.3, ring=0.5, last=1.4, pans=(-0.35, -0.35))
card(aw('glossary', 'glossary', -0.3), 0.004, px(1480)); pen(aw('glossary', 'written', 0.0), 0.6, 0.0045, px(1480), 3)
card(ac('name', 0.1), 0.004, px(960))
card(aw('nurses', 'nurses', -0.3), 0.004, px(620)); card(aw('others', 'others', -0.3), 0.004, px(1300))
card(aw('teams', 'teams', -0.4), 0.004, px(960))
s5 = aw('teams', 'safer', -0.3); b5 = aw('teams', 'better', 0.0)
notes((Ab3, C4, Eb4), s5, 0.5, step=(b5 - s5) / 2, ring=0.6, last=1.6, pans=(-0.45, -0.1, 0.25))
low(Ab2, b5, 0.5, 0.25, ring=1.6)
chord((Ab2, Eb3, C4, Ab4), aw('learn', 'learns', -0.3), 0.55, step=0.2, ring=2.4, until=E('aloud'))

# 4. Nobody the only one: the chapter turns on D-flat major; the alerts' chart pinned; Sam and the others pairing, a tick as an alert is
#    answered; the runbook written, a stroke for each step; four people can answer every night alert: the mark, a note for each tick,
#    from far apart, meeting as one chord under the pill; the rota pinned; nothing under the quiet phone; the jobs pinned; Tutu's words,
#    D-flat major as they land; Sam lost nothing: A-flat major
LV[0] = 0.9
pw = lambda lid, word, off=0: W('pairs', lid, word, off)
pc = lambda lid, off=0: G('pairs', lid, off)
chord((Db3, F3, Ab3, Db4), S0('pairs') + 0.3, 0.55, step=0.16, ring=2.0)
card(S0('pairs') + 0.4, 0.004, px(650))
card(pc('pair', 0.1), 0.004, px(440))
a0 = pw('pair', 'alert', -0.2); ticked(a0 + 1.7, 0.0045, px(960))
r0 = pw('runbook', 'runbook', -0.4); card(r0, 0.004, px(470))
for k in range(4):
    pen(r0 + 0.3 + 0.7 * k, 0.45, 0.004, px(470), 2)
# four can answer: a tile for each tick, from far apart, then the four as one chord as the pill comes up
f0 = pw('four', 'four', -0.2); nt = pw('four', 'night', -0.2)
mark(((Ab2, px(300)), (Eb5, px(560)), (C4, px(820)), (Ab4, px(1080))), (Ab2, C4, Eb4, Ab4), f0, (0.42, 0.36, 0.3, max(0.3, nt - f0 - 1.08)), 0.7, ring=2.4)
card(pw('rota', 'rota', -0.5), 0.004, px(1510))
card(pc('two', 0.1), 0.004, px(960))
card(pw('tutu', 'Desmond', -0.3), 0.004, px(960))
chord((Db3, Ab3, F4), pw('tutu', 'able', 0.0), 0.5, step=0.22, ring=2.0)
chord((Ab2, Eb3, C4, Eb4), pw('lost', 'nothing', -0.1), 0.5, step=0.2, ring=2.2, until=E('pairs'))

# 5. The rota holds: F minor, low, as Sam's mother is taken into hospital; the rota pinned, his name struck through, and two tiles as Jun
#    and Erin take his week; the upgrade moved, its card and a tick; two soft taps as the alerts come in the night, and a tick for each
#    as it's answered; nobody calls him: nothing under the words, then the low A flat alone in the pause; Sam back, D flat and F as
#    her first question is about his mother; the team carried Sam: the mark, from the two rings, meeting under "everyone had paid in"
LV[0] = 0.9
kw = lambda lid, word, off=0: W('holds', lid, word, off)
kc = lambda lid, off=0: G('holds', lid, off)
chord((F2, C3, F3, Ab3), S0('holds') + 0.3, 0.55, step=0.2, ring=2.4)
card(kw('call', 'August', -0.3), 0.004, px(1410))
card(kc('week', -0.1), 0.004, px(530))
j0 = kw('week', 'Jun', -0.2); pen(j0, 0.5, 0.0045, px(400), 2)
notes((C4, Ab4), kw('week', 'Erin', -0.1), 0.45, step=0.32, ring=0.5, last=1.2, pans=(0.25, 0.5))
card(kw('work', 'moves', -0.3), 0.004, px(1420)); ticked(kw('work', 'date', -0.1), 0.0045, px(1740))
a1 = kw('alerts', 'alert', -0.3); b0 = kw('alerts', 'answered', -0.3)
tap(a1, 0.0035, px(1320)); tap(a1 + 0.6, 0.0035, px(1320))
ticked(b0 + 0.4, 0.0045, px(1320)); ticked(b0 + 0.9, 0.0045, px(1320))
low(Ab2, kw('nobody', 'him', 0.9), 0.5, 0.0, ring=1.8)
chord((Db4, F4), kw('back', 'mother', -0.1), 0.45, step=0.25, ring=1.6)
pk = kw('paid', 'paid', -0.3); s0 = kw('paid', 'stokvel', -0.4)
card(s0, 0.004, px(540)); card(kw('paid', 'carried', -0.8), 0.004, px(1380))
mark(((Eb3, px(400)), (C5, px(1500)), (Ab3, px(640)), (Eb4, px(1260))), (Ab2, Eb3, Ab3, C4, Eb4), pk - 1.1, (0.4, 0.3, 0.2, 0.2), 0.7, ring=2.6, until=E('holds'))

# 6. Each person, every week: the chapter turns on A-flat major, its third lowest; each card pinned as the one-to-ones go on; Jun's load
#    pinned; the team first, then each person, then herself: three tiles, falling, a step for each; Ubuntu as an ethic pinned; D-flat
#    major as Metz reads it as caring how their lives go; the team at one table: A-flat major, spread
LV[0] = 0.9
ew = lambda lid, word, off=0: W('each', lid, word, off)
ec = lambda lid, off=0: G('each', lid, off)
chord((C3, Ab3, Eb4), S0('each') + 0.3, 0.55, step=0.18, ring=2.0)
card(S0('each') + 0.3, 0.004, px(450)); card(ew('jun', 'September', -0.3), 0.004, px(450)); card(ew('jun', 'teaching', -0.4), 0.004, px(1580))
card(ew('moves', 'moves', -0.3), 0.004, px(450))
tap(ec('review', -0.3), 0.004, px(650))
notes((Eb4, C4, Ab3), ew('order', 'team', -0.2), 0.5, step=ew('order', 'each', 0.0) - ew('order', 'team', 0.0), ring=0.6, last=1.4, pans=(0.3, 0.3, 0.3))
card(ec('ethic', 0.1), 0.004, px(960))
chord((Db3, Ab3, F4), ew('metz', 'caring', -0.1), 0.5, step=0.2, ring=1.8)
chord((Ab2, Eb3, Ab3, C4, Eb4), ec('cares', 0.0), 0.55, step=0.2, ring=2.6, until=E('each'))

# 7. On Monday: the stokvel's room comes back, framed on the wall: the low A flat, then the opening's three tiles as everyone pays in,
#    everyone's turn comes and the group carries her; Helena's team did the same, its card; each piece of advice pinned; and the close,
#    the mark from far apart, meeting as one chord under "Nobody alone", held into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
low(Ab2, S0('monday') + 0.4, 0.55, 0.0, ring=2.0)
for word, off, m, x in (('pays', -0.2, C4, 520), ('turn', -0.2, Eb4, 890), ('carries', -0.3, Ab4, 1260)):
    tile(m, mw('back', word, off), 0.5, px(x) * 0.6, ring=0.9)
card(mw('team', "Helena's", -0.1), 0.004, px(860))
for lid, word, x in (('pair', None, 390), ('leave', 'Protect', 960), ('thank', 'Thank', 1530), ('ask', 'ask', 675), ('new', 'new', 1245)):
    card(mc(lid, 0.1) if word is None else mw(lid, word, -0.1), 0.004, px(x))
t1 = mark(((Ab2, -0.7), (Eb5, 0.7), (C4, -0.35), (Ab4, 0.35)), (Ab2, Eb3, C4, Eb4, Ab4), mw('take', 'Nobody', 0.0), (0.6, 0.5, 0.4, 0.35), 0.6, ring=6.0, until=TOT)
