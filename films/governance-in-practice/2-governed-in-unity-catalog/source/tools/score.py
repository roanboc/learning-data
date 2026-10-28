# Governed in Unity Catalog: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (checked against the prologue, Governance principles and Governance on the map, and against this
# series' other films, so none repeats): low brass, a tuba, a euphonium and a tenor horn, one player to a note, straight tone, and
# crotales, small tuned bronze discs, each bowed at its edge so it sings one pure note; both made here (music.py has neither), played
# softly, so nothing rings above the voice.
#  - The brass holds the chords: under the opening, as Sam's day goes from Yusuf's question to the old path given by hand and the
#    forty-one people it left, and on to the tags, the one policy and the groups; after it, only at a chapter's turn, under a moment
#    on screen or in a pause without words.
#  - The crotales mark what lands, and their marks mean the same all through: one bowed note when a tag reaches its column, a rising
#    fifth when the policy covers a table, and a falling step when someone's access ends.
#  - The opening's problem is in the brass: "all or nothing", the chord swelling and then gone; the old path, the tenor horn climbing
#    for the form and the approval, then waiting through three weeks; the whole table, to one person, with no end date, a suspended
#    chord that never resolves and fades instead; the forty-one, one low chord held still, nothing pulsing, and the nine who moved
#    on, its top note slipping a step. "Something had to change" stops it, and the solution comes in on the home chord.
#  - The tuba says no: one low, short note when a value is refused, or the check stops a table.
#  - The series' mark, four notes, 1-5-4-8, on the euphonium, with a crotale above its last note, under the title and the end card.
#  - E-flat major all through.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, and after it only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the
#    opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: each player holds a straight tone, with no vibrato; every chord is tuned pure (just
#    intonation, see hz()), and the chords on the second degree are left out (their fifth isn't pure here). Nothing pulses, even
#    over the forty-one.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in
#    src/scenes.js (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz: the racks' hum, keys, paper, a pencil, a highlighter, a card into its
# drawer, a tag's string drawn tight, a band of stars laid on, a padlock, a pen's tick.

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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(15)  # this film's own randomness: the room, the breath, the paper, the keys

# ---- tuning: just intonation from E-flat, so a chord's notes are whole-number ratios of each other and nothing beats. The chords
# used are I, IV, V, vi and iii, whose fifths are all pure in this table; F is never held with C or A-flat (a wolf fifth and a
# Pythagorean third, both here)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (51, 155.5635)  # E-flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords, as (tuba, euphonium, tenor horn): one player to a note, the tuba at the root
I, IV, V, vi, iii = (39, 55, 58), (44, 51, 60), (34, 53, 62), (36, 55, 63), (43, 50, 58)

# ---- the levels: the brass sits about as far under the voice as the series' other films' music (matched by loudness, not by peak);
# the crotales a little under it, as their note is pure and high; the effects about 12 dB under the music (FX scales them all)
BL, CL, FX = 0.044, 0.046, 1.6
LEVEL = {'tu': 1.0, 'eu': 1.0, 'th': 0.9}
PAN = {'th': -0.32, 'eu': 0.06, 'tu': 0.3}  # as a brass band sits: the horn at the left, the euphonium in the middle, the tuba right

# ---- the low brass. A brass note sounds every harmonic of its pitch, shaped by the bore and the bell, which favour a band of them
# (the tuba's near 250 Hz, the euphonium's near 420, the tenor horn's near 580, all three wide-bored, so mellow); played softly, the
# harmonics above that band fall away fast. Each note speaks from the tongue, a few cents flat for a moment as the lips settle, with
# a puff of breath; its upper harmonics bloom a moment after the lower; then it holds, straight, the breath's support drifting by a
# percent or so, slowly, as a player's does. A small hall round the players rings on for about a second, a few dB under them
BRASS = {  # resonances as (Hz, width, weight); the corner above which a soft note's harmonics fall away; the breath's band
    'tu': ([(120, 90, 0.6), (250, 150, 1.0), (520, 260, 0.3)], 480, (150, 900)),
    'eu': ([(200, 120, 0.5), (420, 220, 1.0), (880, 380, 0.3)], 780, (250, 1300)),
    'th': ([(280, 150, 0.5), (580, 260, 1.0), (1150, 420, 0.3)], 1000, (300, 1600))}
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.3)).astype(np.float32))(np.arange(int(1.3 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _harm(inst, f, soft=1.0):
    """the weights of a note's harmonics on inst, at f Hz"""
    F, fm = BRASS[inst][:2]; n = max(1, int(2500 // f)); k = np.arange(1, n + 1); fk = f * k
    r = sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in F) + 0.06
    a = r / k ** 0.6 / np.sqrt(1 + (fk / (fm * soft)) ** 6) * np.clip((2500 - fk) / 250, 0, 1)
    return a / np.sqrt((a ** 2).sum())
def line(inst, segs, g=1.0, soft=1.0, att=0.15, rel=0.3, room=0.18, pan=None, tie=True, dyn=None):
    """one player's line: segs is [(start, end, note, level)], each note slurred into the next and a note held on where the next
    keeps it (tongued again if not tie); a rest (note None) breaks it. dyn, [(time, level)], shapes it as it goes"""
    run = []
    for s in list(segs) + [(None, None, None, 0)]:
        if s[2] is None:
            if run:
                _line(inst, run, g, soft, att, rel, room, PAN[inst] if pan is None else pan, tie, dyn)
            run = []
        else:
            run.append(s)
def _line(inst, segs, g, soft, att, rel, room, pan, tie, dyn):
    T0, T1 = segs[0][0], segs[-1][1]; gl = 0.05
    n = int((T1 - T0 + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    fs = [hz(m) for _, _, m, _ in segs]; A = [_harm(inst, f, soft) for f in fs]; K = max(len(a) for a in A)
    A = [np.pad(a, (0, K - len(a))) for a in A]
    kx, kf, ka, kv = [], [], [], []
    for i, (a, b, m, v) in enumerate(segs):  # each note steady between short slurs, its harmonics' weights with it
        for t in ((a - T0 + gl / 2 if i else 0.0), (b - T0 - gl / 2 if i < len(segs) - 1 else n / SR)):
            kx.append(t); kf.append(np.log2(fs[i])); ka.append(A[i]); kv.append(v)
    tg = [0.0] + [segs[i][0] - T0 for i in range(1, len(segs)) if segs[i][2] == segs[i - 1][2] and not tie]  # where the tongue starts a note
    lf = np.interp(x, kx, kf)
    for t0 in tg:  # the lips settle: a tongued note starts a few cents flat
        lf = lf - 0.006 * np.exp(-np.maximum(x - t0, 0) / 0.035) * (x >= t0)
    ph = 2 * np.pi * np.cumsum(2 ** lf) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > T1 - T0, np.cos(0.5 * np.pi * np.minimum((x - (T1 - T0)) / rel, 1)) ** 2, 1.0)
    for i in range(1, len(segs)):  # a slur dips for a moment as the valves change; the same note tongued again dips more
        d = 0.75 if (segs[i][2] == segs[i - 1][2] and not tie) else 0.12 if segs[i][2] != segs[i - 1][2] else 0
        if d:
            e = e * (1 - d * np.exp(-((x - (segs[i][0] - T0)) / 0.04) ** 2))
    fq = R1.uniform(0.08, 0.28, 3); fp = R1.uniform(0, 2 * np.pi, 3)
    air = 1 + 0.012 * sum(np.sin(2 * np.pi * a * x + b) for a, b in zip(fq, fp)) / 3  # the breath's support, drifting slowly
    lev = np.interp(x, kx, kv) * air
    if dyn:
        lev = lev * np.interp(x + T0, [d[0] for d in dyn], [d[1] for d in dyn])
    ka = np.array(ka); s = np.zeros(n)
    for j in range(K):  # the upper harmonics bloom a moment after the lower: a brass note warms as it speaks
        aj = np.interp(x, kx, ka[:, j])
        if aj.max() > 1e-4:
            s += aj * e ** (1 + 0.3 * j) * np.sin((j + 1) * ph + 0.7 * j * j)
    lo, hi = BRASS[inst][2]
    br = filt(noise(n / SR + 0.01)[:n], 'band', (lo, hi)); puff = sum(np.exp(-np.maximum(x - t0, 0) / 0.03) * (x >= t0) for t0 in tg)
    s = s * lev + (0.004 * e + 0.03 * puff) * br * lev  # a breath under the note, and the tongue's puff at its start
    s = filt(s.astype(np.float32), 'low', 2400)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), T0, g * BL * LEVEL[inst], pan)
def chord(ch, a, b, g=0.55, step=0.15, att=0.5, rel=0.8, soft=0.9):
    """a held chord, (tuba, euphonium, horn), each player coming in a moment after the one under it"""
    for i, (inst, m) in enumerate(zip(('tu', 'eu', 'th'), ch)):
        if m is not None:
            line(inst, [(a + step * i, b, m, 1.0)], g, soft, att=att, rel=rel)
def prog(seq, end, g=0.6, att=0.5, rel=0.8, soft=0.9, step=0.15, dyn=None):
    """a chorale: seq is [(time, (tuba, euphonium, horn))], a note or None (a rest) for each; each player slurs from chord to chord
    and holds a note the next chord keeps, and one coming in after a rest comes in a moment after the one under it"""
    for i, inst in enumerate(('tu', 'eu', 'th')):
        segs = []
        for k, (t, ch) in enumerate(seq):
            t1 = seq[k + 1][0] if k + 1 < len(seq) else end; m = ch[i]
            if m is not None and (k == 0 or seq[k - 1][1][i] is None):
                t = min(t + step * i, t1 - 0.1)
            segs.append((t, t1, m, 1.0))
        line(inst, segs, g, soft, att=att, rel=rel, dyn=dyn)
def no(s, g=0.9):
    """something refused: the tuba's one low, short note"""
    line('tu', [(s, s + 0.55, 39, 1.0)], g, 0.85, att=0.04, rel=0.3)
def mark(s, g=0.85, step=0.45):
    """the series' mark, 1-5-4-8, on the euphonium, each note tongued, and a crotale above its last"""
    for i, m in enumerate([51, 58, 56, 63]):
        a = s + step * i
        line('eu', [(a, a + (1.9 if i == 3 else step * 0.86), m, 1.0)], g * (1.08 if i == 3 else 1.0), 0.95, att=0.05, rel=0.9 if i == 3 else 0.12)
    crot(87, s + step * 3 - 0.2, 0.7, draw=0.35, ring=1.6)

# ---- the crotales, bowed: a small bronze disc, a bow drawn across its edge, sings one pure note, which swells while the bow draws and
# rings on after, softer and softer; the disc's higher ring, near three times the note, is above the series' ceiling and is taken out.
# Each mark is placed so its note speaks as the thing lands
def crot(m, s, g=1.0, pan=0.12, draw=0.3, ring=1.0):
    f = hz(m); sec = draw + 5 * ring; x = np.arange(int(sec * SR)) / SR  # in double precision, so a long, pure note stays pure
    up = np.sin(0.5 * np.pi * np.minimum(x / draw, 1)) ** 2; dn = np.exp(-np.maximum(x - draw, 0) / ring)
    sig = np.sin(2 * np.pi * f * x) * up * dn * np.clip((sec - x) / 0.05, 0, 1)
    hair = filt(noise(sec)[:len(x)], 'band', (0.8 * f, min(2300, 1.25 * f))) * np.where(x < draw, np.sin(np.pi * x / draw) ** 2, 0)
    sig = norm(filt((sig + 0.02 * hair).astype(np.float32), 'low', 2400))  # and the bow's hair on the edge, while it draws
    sig = np.pad(sig, (0, len(_IR) - 1)) + 0.15 * fftconvolve(sig, _IR).astype(np.float32)
    put(sig.astype(np.float32), s, g * CL, pan)
def tagged(s, g=0.8):
    """a tag reaches its column: one bowed note, B-flat"""
    crot(94, s - 0.3, g)
def covered(s, g=0.8):
    """the policy covers a table: a rising fifth, E-flat to B-flat"""
    crot(87, s - 0.45, g * 0.9, draw=0.25, ring=0.8); crot(94, s - 0.1, g, draw=0.3)
def ended(s, g=0.75):
    """someone's access ends: a falling step, F to E-flat"""
    crot(89, s - 0.45, g, draw=0.25, ring=0.6); crot(87, s - 0.05, g * 0.9, draw=0.35, ring=1.2)

# ---- soft sounds in the rooms and on the pages, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a sheet arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.012, pan=0.0, step=0.13):
    """a few keys typed, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.02, pan=0.0, sec=0.45):
    """a sheet of paper laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pin(s, g=0.022, pan=0.0):
    """a push pin into a card: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.6):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def marker(s, g=0.012, pan=0.0, sec=0.6):
    """a highlighter drawn along a line: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def slide(s, g=0.016, pan=0.0, sec=0.8):
    """a sheet slid or folded: a low, rough slide"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def hum(a, b, g=0.006, pan=0.3):
    """the racks' fans: a steady, low hush, in and out with the shot"""
    sec = b - a; x = tt(sec); e = np.minimum(1, x / 1.2) * np.clip((sec - x) / 0.8, 0, 1)
    X(filt(noise(sec), 'band', (60, 380))[:len(x)] * e, a, g * FX, pan)
def tie(s, g=0.010, pan=0.0):
    """a tag's string drawn tight round what it labels (s, when it's tight): a short, soft pull, and the tag settles"""
    x = tt(0.16); X(filt(noise(0.16), 'band', (500, 1800))[:len(x)] * np.sin(np.pi * x / 0.16) ** 2 * (0.3 + 0.7 * x / 0.16), s - 0.14, g * FX, pan)
    s_tap(s, g * 0.5 * FX, pan)
def card(s, g=0.012, pan=0.0):
    """a card dropped into its drawer (s, when it's in): it slides down between the others, and settles"""
    x = tt(0.35); X(filt(noise(0.35), 'band', (300, 1400))[:len(x)] * np.sin(np.pi * x / 0.35) ** 1.5, s - 0.33, g * 0.8 * FX, pan)
    s_knock(s, g * 0.7 * FX, pan, 230)
def band(s, g=0.010, pan=0.0, sec=0.7):
    """a band of stars laid over a value, sliding in from the left: a soft felt stroke, strongest as it starts"""
    x = tt(sec); X(filt(noise(sec), 'band', (280, 1200))[:len(x)] * np.sin(np.pi * x / sec) ** 0.8 * np.exp(-x / sec), s, g * FX, pan)
def lock(s, g=0.010, pan=0.0):
    """a padlock closing: a small, dull click"""
    s_knock(s, g * FX, pan, 520); s_tap(s + 0.012, g * 0.6 * FX, pan)
def tick(s, g=0.012, pan=0.0):
    """a pen's tick: a short stroke down, a longer one up"""
    pencil(s, g, pan, 0.08); pencil(s + 0.09, g * 0.8, pan, 0.22)
def sign(s, g=0.010, pan=0.0, sec=0.6):
    """a name signed in pen: a few quick strokes"""
    for t in np.sort(R1.uniform(0, sec - 0.12, 5)):
        pencil(s + t, g * R1.uniform(0.6, 1.0), pan, R1.uniform(0.08, 0.14))

# =============================================================================================================================
# 1. Which column: the opening, under the brass all through. Today, the home chord, the players coming in one by one, and the horn's
#    warm sixth as Sam is named; Yusuf's question on the fourth; the table's personal columns on the sixth, darker. The problem: Sam's
#    line on the fourth; nobody could tell him, the sixth again, swelling on "all or nothing" and gone on "nothing"; the old path
#    given by hand, on the fourth, the horn climbing for the form and the approval and waiting through three weeks; the whole table
#    to one person, home, and "no end date" a suspended chord that never resolves, fading instead; the forty-one, the sixth, low and
#    still; the nine who moved on, its top note slipping a step; and "Something had to change" stops it. Then the solution, on the
#    home chord: the tags land, one bowed note; one policy, the fourth, and its stars, the rising fifth; every table, the fifth,
#    tomorrow's waiting; groups, home; December, the fourth, and Planning's access ending, the falling step; a new table tagged and
#    masked as it's built, home; Sam's line, the fourth, and its tick, home; and the title, on the mark
ww = lambda lid, word, off=0: W('which', lid, word, off)
wc = lambda lid, off=0: G('which', lid, off)
sam, yus, tab = ww('runs', 'Sam Okafor'), wc('asks'), ww('asks', 'with every', -0.3)
nm, em, sn = ww('asks', 'name'), ww('asks', 'email'), ww('asks', 'student number')
slow, tell = wc('slowed', -0.4), ww('slowed', 'tell me')
nob, allx, nothing, hand = wc('nobody', -0.3), ww('nobody', 'all or nothing'), ww('nobody', 'nothing'), ww('nobody', 'given by hand', -0.2)
form, mail, weeks, whole, one, noend = (ww('path', w_) for w_ in ('a form', 'an emailed', 'three weeks', 'the whole table', 'to one person', 'no end date'))
forty, fortyW, nine, change = wc('forty', -0.4), ww('forty', 'forty-one'), wc('nine'), wc('change')
now, ident, cls = wc('now', -0.3), ww('now', 'identify'), ww('now', 'the classes')
pol, stars, every, yet = wc('policy', -0.3), ww('policy', 'stars'), ww('policy', 'on every table', -0.3), ww('policy', 'not built yet')
grp, dec = wc('groups', -0.3), wc('december')
built, prot, mn, which = wc('built', -0.3), ww('built', 'protected'), wc('minutes', -0.3), ww('minutes', 'tells him which')
board, title = wc('breath', -0.3), wc('breath', 1.2)
# the scenario: today, the home chord; the horn's warm sixth as Sam is named; Yusuf's question on the fourth; the personal columns
# on the sixth. Then Sam's line, on the fourth; and nobody could tell him: the sixth, swelling on "all or nothing", gone on "nothing"
prog([(0.3, I), (sam, (39, 55, 60)), (sam + 2.6, I), (yus - 0.3, IV), (tab, vi), (slow, IV), (nob, vi)], nothing + 0.2,
     g=0.62, att=1.0, rel=0.15, step=0.6, dyn=[(allx - 0.2, 1.0), (nothing + 0.15, 1.45)])
hum(0.0, tab + 0.6)  # the racks, in the room's first shot
knock(sam + 0.15, 0.010, px(1120), 280); knock(yus + 0.25, 0.010, px(1120), 280)  # Sam's name card, then Yusuf's
marker(nm, 0.008, px(760), 0.4); marker(em, 0.008, px(1080), 0.45); marker(sn, 0.008, px(560), 0.45)  # the columns, lit as named
marker(allx, 0.009, 0.0, 0.9)  # all of it lit: all or nothing
# the old path, given by hand, on the fourth: the horn climbs for the form and the approval and waits through three weeks; the whole
# table to one person, home; and no end date, a suspended fourth over the home note that never resolves, and fades
prog([(hand - 0.1, (44, 51, 56)), (form, IV), (mail, (44, 51, 63)), (whole, (39, 55, 63)), (noend - 0.2, (39, 58, 68))], forty + 0.4,
     g=0.5, att=0.7, rel=0.9, step=0.25, dyn=[(noend, 1.0), (forty + 0.4, 0.25)])
paper(form - 0.05, 0.016, px(330), 0.4); paper(mail + 0.05, 0.014, px(800), 0.35); paper(weeks - 0.05, 0.013, px(1320), 0.35)
pencil(weeks + 0.05, 0.010, px(1320), 1.35)  # three weeks of days crossed through
knock(whole + 0.4, 0.012, px(860), 420); tap(whole + 0.43, 0.007, px(860))  # the key, the whole table, laid down
knock(one + 0.4, 0.011, px(1350), 280)  # to one person, by name
pencil(noend, 0.012, px(1400), 0.8)  # no end date, in red
# the forty-one, on the sixth, low and still, nothing pulsing; the nine who moved on: its top note slips a step; and something had to
# change: it stops
prog([(forty, vi), (nine + 0.3, (36, 55, 62))], change + 0.15, g=0.55, att=0.9, rel=0.5, step=0.3)
tap(forty + 0.2, 0.010, px(700))  # the Permissions tab
# the solution, on the home chord. The tags land: one bowed note, and each string drawn tight; one policy, the fourth, its card pinned,
# and the stars laid row by row, the rising fifth; every table, the fifth, and tomorrow's table set down; groups, home: the names
# gather into rings and the rest fall away; December, the fourth: Planning's card goes, the falling step; a table protected as it's
# built, home: its tag, its stars; Sam's line, the fourth, and its tick, home; the board, and the mark under the title, the
# euphonium leaving the chord to play it
prog([(now, I), (pol, IV), (every, V), (grp, (39, 55, 63)), (dec, IV), (built, I), (mn, IV), (which + 0.4, (39, 55, 63)),
      (board + 0.4, (39, None, 55))], E('which') + 0.3, g=0.6, att=0.6, rel=1.0, step=0.3)
for d, x_ in ((0, 970), (0.2, 700), (0.4, 450), (0.8, 160), (1.2, 1440)):
    tie(ident + 0.9 + d, 0.009, px(x_ + 220))
tagged(ident + 0.9)
knock(cls + 0.15, 0.008, px(1650), 300)  # "Governed in dbt"
pin(pol + 0.55, 0.016, px(1450))  # the policy's card
for i in range(3):  # a band of stars on each learner's row
    band(stars + 1.4 * i / 6, 0.009 * 0.9 ** i, px(800), 0.8)
covered(stars + 1.25)
band(every + 0.3, 0.008, px(500), 1.0)  # on every table that holds direct personal data
covered(every + 1.35, 0.55)
air(yet - 0.3, 0.6, 0.006, px(1400)); knock(yet + 0.4, 0.010, px(1380), 260)  # a table not built yet
air(grp + 0.1, 0.7, 0.006, px(900)); slide(grp + 0.6, 0.010, px(800), 1.0)  # the names gather; the rest fall away
for k in range(3):  # the rings, and the dated tags on their clasps
    knock(grp + 1.0 + 0.18 * k, 0.009, px(560 + 440 * k), 280); tie(grp + 1.5 + 0.18 * k, 0.007, px(560 + 440 * k))
pencil(dec, 0.010, px(1600), 0.8)  # "end of December"
air(dec + 0.1, 0.6, 0.006, px(1440)); ended(dec + 0.8)  # Planning's card goes, and its ring
tie(built + 1.2, 0.009, px(1150)); tagged(built + 1.2)  # tomorrow's table: its tag
band(prot, 0.010, px(1250), 0.9); covered(prot + 0.9)  # and its stars
tick(which, 0.012, px(1500))
knock(board + 0.35, 0.010, px(760), 280); air(board + 1.0, 0.9, 0.007, px(760))  # the second card lights, and lifts
mark(title + 0.3)

# 2. Laid out by area: a chord at the turn; each drawer of the catalog comes; the learner table lifts, its area's tag drawn tight, and
#    its model's domain; the Discover page, its tiles, on the home chord; the grants, each to a group, and Clara's card crossed off;
#    home again
aw = lambda lid, word, off=0: W('area', lid, word, off)
a0 = S0('area')
chord(IV, a0 + 0.2, a0 + 2.6)
tabs = aw('catalog', "the project's tables")
for i in range(5):
    knock(tabs + 0.25 * i + 0.3, 0.010 * 0.9 ** i, px(309 + 322 * i), 220)
air(G('area', 'tag') + 0.1, 0.7, 0.006, px(330))  # the learner table's card lifts
tie(aw('tag', 'as a tag') + 0.5, 0.010, px(400))  # its area, on a tag
paper(aw('tag', 'from the domain') + 0.1, 0.014, px(1260), 0.4); marker(aw('tag', 'names'), 0.008, px(1100), 0.5)
lays = aw('discover', 'lays the tables')
for k in range(6):
    tap(lays + 0.12 * k + 0.15, 0.008 * 0.92 ** k, px([407, 949, 1491][k % 3]))
chord(I, lays - 0.2, aw('discover', 'and more') + 1.3, g=0.5)
gtg, nv = aw('grant', 'goes to a group'), aw('grant', 'never to a person')
knock(gtg + 0.4, 0.010, px(700), 280); knock(gtg + 0.7, 0.009, px(700), 280)
knock(nv + 0.3, 0.010, px(600), 260)  # Clara's card comes
pencil(nv + 1.4, 0.010, px(860), 0.35); air(nv + 1.55, 0.8, 0.006, px(1200))  # crossed, and gone
chord(I, nv + 1.4, E('area') + 0.3, g=0.5)

# 3. A tag from the class: a chord at the turn; the classes in the project, each chip set beside its line; the hook and the macro's
#    line, lit, and what it runs, typed; the tags land on the platform, one bowed note, on the home chord; the governed tag's
#    padlock, and "maybe", crossed out and dropped: the tuba says no; a class changed, the next build, and the new tag; the
#    classifier's suggestion, its owner, and the tag on its column; home
tw_ = lambda lid, word, off=0: W('tag', lid, word, off)
tc = lambda lid, off=0: G('tag', lid, off)
t0_ = S0('tag')
chord(vi, t0_ + 0.2, t0_ + 2.6)
paper(t0_ + 0.3, 0.016, px(960), 0.45)
knock(tw_('classes', 'class says') + 0.15, 0.008, px(1700), 300)  # "Who may see it"
for w_, n_ in (('direct', 2), ('pseudonymous', 1), ('none', 1)):
    for j in range(n_):
        tap(tw_('classes', w_) + 0.1 + 0.08 * j, 0.008, px(1300))
wr = tc('writes', -0.3)
paper(wr + 0.1, 0.014, px(800), 0.4); paper(tw_('writes', 'dbt writes') - 0.05, 0.014, px(980), 0.4)
marker(tw_('writes', 'After each table builds') + 0.3, 0.008, px(700), 0.5); marker(tw_('writes', 'writes the class') + 0.2, 0.008, px(900), 0.5)
keys(tw_('writes', 'to the platform') - 0.05, 8, 0.009, px(960), 0.12)
col = tw_('writes', 'on the column', -0.3)
for d in (0, 0.15, 0.3, 0.6, 0.9):
    tie(col + 1.3 + d, 0.009, px(1200))
tagged(col + 1.3)
chord(I, col + 1.0, col + 4.0)
adm, three, nobc, maybe = tw_('governed', 'an admin'), tw_('governed', 'only those three values'), tw_('governed', 'nobody can'), tw_('governed', 'maybe')
lock(adm + 0.5, 0.012, px(1120)); marker(three, 0.008, px(580), 0.6)
air(nobc + 0.05, 0.8, 0.006, px(1200)); tap(nobc + 0.9, 0.008, px(900))  # "maybe" tries it
pencil(maybe + 0.3, 0.010, px(900), 0.35); no(maybe + 0.5); air(maybe + 0.75, 0.6, 0.005, px(900))  # crossed out, refused, dropped
chg, nb, ct = tw_('next', 'Change a class'), tw_('next', 'the next build'), tw_('next', 'changes the tag')
keys(chg + 0.45, 5, 0.009, px(600), 0.11); pencil(nb, 0.010, px(1140), 0.8); tagged(ct + 0.5)
finds, owner, toc = tw_('classifier', 'finds columns'), tw_('classifier', 'their owner'), tw_('classifier', 'to class')
tap(finds + 0.2, 0.008, px(1200)); knock(owner + 0.2, 0.010, px(1100), 280); tap(owner + 0.45, 0.007, px(1490))
tagged(toc + 0.5)
chord(I, toc + 0.3, E('tag') + 0.3, g=0.5)

# 4. One policy, by tag: a chord at the turn; the policy's page, each field lit as it's said; a padlock on each table, swept into the one
#    policy, which locks; tomorrow's table set down, its tag, one bowed note, and its stars, the rising fifth, on the fifth going home;
#    the row filter, lit; Clara's card, her query's rows, and her stars, on the home chord; Mei's values, and the build's card
pw = lambda lid, word, off=0: W('policy', lid, word, off)
p0 = S0('policy')
chord(I, p0 + 0.2, p0 + 2.6)
for w_ in ('masks', 'tagged direct', 'the whole catalog', 'for everyone', "but the registrar's office"):
    marker(pw('masks', w_), 0.007, px(900), 0.45)
tm = G('policy', 'tomorrow', -0.3)
tbt, btt, soon, tagd = pw('tomorrow', 'table by table'), pw('tomorrow', 'a table built'), pw('tomorrow', 'as soon as'), pw('tomorrow', 'tagged')
for k, d in enumerate((0.25, 0.4, 0.55)):
    lock(tm + d, 0.008 * 0.85 ** k, px([300, 640, 960][k]))
air(tbt + 0.1, 1.0, 0.007, px(1100)); lock(tbt + 0.9, 0.011, px(1700))  # swept into the one policy, which locks
air(btt - 0.2, 0.6, 0.006, px(1400)); knock(btt + 0.5, 0.010, px(1380), 260)  # tomorrow's table
tie(soon + 0.9, 0.009, px(1150)); tagged(soon + 0.9)
band(tagd, 0.010, px(1250), 0.9); covered(tagd + 0.9)
prog([(btt - 0.2, V), (tagd + 0.6, (39, 55, 63))], tagd + 2.4, g=0.5)
tap(pw('rows', 'filter rows') + 0.1, 0.008, px(700))
knock(G('policy', 'clara', 0.1), 0.010, px(250), 280)  # Clara's name card
sees, st_, sr_ = pw('clara', 'and sees', -0.3), pw('clara', 'status'), pw('clara', 'stars')
keys(sees + 0.2, 3, 0.008, px(960), 0.27); marker(st_, 0.008, px(600), 0.5); marker(sr_, 0.008, px(1000), 0.6)
chord(I, sees, sr_ + 2.6, g=0.5)
marker(pw('values', 'sees the values'), 0.008, px(1000), 0.6); knock(pw('values', 'the identity') + 0.4, 0.010, px(1480), 280)

# 5. The scrambled key: a chord at the turn; the student number slides into the machine and the code comes out; the same code in three
#    tables, joined; "anonymous" struck through; the registrar's list through the machine, a code matched and who that is, on the
#    sixth with its top note a step down, as for the nine; still personal, each code counted, and what reading it takes pinned:
#    home
kw = lambda lid, word, off=0: W('key', lid, word, off)
k0 = S0('key')
chord(iii, k0 + 0.2, k0 + 2.6)
slide(kw('code', 'the student number') - 0.2, 0.010, px(400), 1.1); air(kw('code', 'scrambled'), 1.0, 0.007, px(1300))
tap(kw('code', 'scrambled') + 0.55, 0.007, px(1200))
ev = kw('code', 'in every table')
for k in range(3):
    knock(ev + 0.3 + 0.4 * k, 0.010 * 0.9 ** k, px([420, 960, 1500][k]), 260)
jn = kw('code', 'joined')
marker(jn - 0.4, 0.007, px(960), 0.5); pencil(jn, 0.009, px(620), 0.6); pencil(jn + 0.6, 0.009, px(1160), 0.6)
pencil(kw('anon', 'anonymous') + 0.36, 0.011, px(1400), 0.6)
run_, mt = kw('list', 'scramble every number'), kw('list', 'match them')
pencil(run_, 0.007, px(760), 2.0); pencil(mt - 0.3, 0.008, px(1400), 0.4); pencil(mt + 0.2, 0.008, px(1640), 0.4)
knock(mt + 0.5, 0.011, px(1640), 280)  # who that is
chord((36, 55, 62), mt - 0.3, G('key', 'still', 0.2), g=0.5)
stl, cnt, pp = kw('still', 'still personal'), kw('still', 'for counting'), kw('still', 'a purpose')
tap(stl + 0.1, 0.008, px(300))
for k in range(5):
    tick(cnt + 0.24 * k + 0.1, 0.007, px(1190))
pin(pp + 0.2, 0.016, px(1525))
chord(I, pp - 0.1, E('key') + 0.3, g=0.5)

# 6. Groups, with an end date: a chord at the turn; Mei's card; Clara's request, each field lit, and Mei's yes, her tick and her name,
#    on the home chord; the grants, Clara's card crossed off and Planning's group; the directory: Clara's card into Planning's drawer,
#    its date tied on, on the home chord; the sync; someone moving to Finance, and their access following; and on 15 December her
#    card leaving by itself, the falling step, the fourth going home in the pause after it
gw = lambda lid, word, off=0: W('groups', lid, word, off)
g0 = S0('groups')
chord(IV, g0 + 0.2, g0 + 2.6)
knock(g0 + 0.6, 0.010, px(950), 280)  # Mei's name card
top = G('groups', 'yes', -0.3)
paper(top + 0.05, 0.012, px(960), 0.35)
for w_ in ('to Clara', 'to plan', 'until the fifteenth'):
    marker(gw('yes', w_), 0.007, px(960), 0.5)
yes = gw('yes', 'said yes')
tick(yes + 0.1, 0.012, px(540)); sign(yes + 0.65, 0.010, px(800), 0.6); knock(top + 0.7, 0.008, px(1690), 300)
chord(I, yes, yes + 3.2, g=0.5)
gr = G('groups', 'grants', -0.3)
marker(gr - 0.6, 0.007, px(960), 0.5)
knock(gr + 0.5, 0.010, px(600), 260); toc2 = gw('grants', 'to Clara')
pencil(toc2 - 0.1, 0.010, px(860), 0.35); air(toc2 + 0.1, 0.8, 0.006, px(1200))  # Clara's card crossed off
knock(gw('joins', 'a Planning group') + 0.4, 0.010, px(700), 280)
jn2 = gw('joins', 'and Clara joins', -0.3)
card(jn2 + 1.4, 0.012, px(410)); tie(jn2 + 1.3, 0.008, px(600))  # into Planning's drawer, its date tied on
chord(I, jn2 + 1.2, jn2 + 3.6, g=0.45)
pencil(gw('reads', 'reads its groups'), 0.008, px(1345), 0.9)  # the sync
jb, mv, fl = gw('jobs', 'changes jobs'), gw('jobs', 'moves them'), gw('jobs', 'access follows')
card(jb + 0.2, 0.010, px(410)); air(mv, 0.6, 0.006, px(410)); card(mv + 1.5, 0.011, px(990)); air(fl, 1.2, 0.005, px(1400))
en = gw('ends', 'ends by itself')
slide(en, 0.008, px(410), 1.0); ended(en + 0.8)
prog([(en - 0.2, IV), (en + 2.0, I)], E('groups') + 0.3, g=0.5)

# 7. Down to the column: a chord at the turn; the email picked, its thread drawn down to the column and tagged there too, on the home
#    chord; the beta label, and the ghost of a tag travelling; the wallet's file, the email classed there too; a table sketched with an
#    email nobody classed, and the check's message: the tuba says no
lw = lambda lid, word, off=0: W('lineage', lid, word, off)
l0 = S0('lineage')
chord(vi, l0 + 0.2, l0 + 2.6)
pk = lw('pick', 'email')
tap(pk + 0.05, 0.009, px(900)); tap(pk + 0.4, 0.006, px(780)); pencil(pk + 0.2, 0.009, px(1100), 1.0); tap(pk + 1.35, 0.006, px(1400))
chord(I, pk + 0.3, pk + 3.0, g=0.45)
bt = lw('beta', 'follow lineage')
tap(bt + 0.3, 0.006, px(865)); air(bt + 0.25, 1.7, 0.004, px(1100))
nd = lw('need', 'every table', -0.3)
paper(nd + 0.1, 0.014, px(700), 0.4); knock(lw('need', 'built by the project') + 0.15, 0.008, px(1700), 300); marker(lw('need', 'classes it there'), 0.008, px(700), 0.5)
paper(G('lineage', 'stops', -0.2), 0.012, px(570), 0.35)
sto = lw('stops', 'stops')
keys(sto + 0.05, 9, 0.008, px(960), 0.16); no(sto + 0.5)

# 8. Who read this, and when: a chord at the turn; the audit log's rows, each read lit; the access review: its date, its rows, the
#    forty-one names printed and folded away, the falling step; Planning's grant struck through; the two groups, on the home chord
uw = lambda lid, word, off=0: W('audit', lid, word, off)
u0 = S0('audit')
prog([(u0 + 0.2, V), (u0 + 1.6, I)], u0 + 2.8, g=0.5)
who = uw('log', 'who read')
keys(who + 0.05, 3, 0.008, px(960), 0.4)
for i in range(3):
    marker(uw('answer', 'who read') + 0.3 * i, 0.007, px(700), 0.4)
pencil(uw('review', 'Each December'), 0.009, px(1600), 0.8); keys(uw('review', 'reads the grants') + 0.05, 3, 0.008, px(960), 0.4)
gave, gw_, two = G('audit', 'gave'), uw('gave', 'gave way'), uw('gave', 'two groups')
paper(gave - 0.55, 0.016, px(1500), 0.45); slide(gw_ + 0.1, 0.010, px(1500), 1.4); ended(gw_ + 1.45)
pencil(two, 0.010, px(600), 0.9)
reg, dat = uw('two', "the registrar's office"), uw('two', 'the data team')
marker(reg, 0.007, px(700), 0.5); marker(dat, 0.007, px(700), 0.5)
chord(I, two - 0.2, dat + 2.4, g=0.5)

# 9. What the metadata says: Clara's plan, with stars, on the home chord; Noor's map, the class flowing to the platform; there a tag, one
#    bowed note, the policy, the rising fifth, and a group with its date, on the fourth going home; Sam's column masked, his line
#    ticked, the fourth going home; the next film's card lifts; and the end card, on the mark, the chord held to the end
cw = lambda lid, word, off=0: W('close', lid, word, off)
c0 = S0('close')
chord(I, c0 + 0.2, c0 + 3.0, g=0.5)
mp = G('close', 'map', -0.3)
paper(mp + 0.2, 0.014, px(1100), 0.45); pencil(cw('map', 'the project says'), 0.009, px(800), 1.0)
tg2, pl2, gp2, dts = cw('flow', 'become tags'), cw('flow', 'one policy'), cw('flow', 'groups carry'), cw('flow', 'the dates')
tie(tg2 + 0.55, 0.009, px(1270)); tagged(tg2 + 0.6)
covered(pl2 + 0.6)
knock(gp2 + 0.2, 0.009, px(1340), 280); tie(gp2 + 0.45, 0.008, px(1340))  # a group, and its date on the clasp
knock(dts + 0.3, 0.009, px(680), 280); pencil(dts + 0.25, 0.008, px(950), 0.6)  # the directory, its members
prog([(tg2 - 0.2, IV), (gp2, I)], dts + 1.6, g=0.5)
sm = G('close', 'sam', -0.3)
band(sm + 0.6, 0.008, px(1500), 1.0)  # the mobile column masked
w2 = cw('sam', 'tells him which')
tick(w2, 0.012, px(1500))
prog([(w2 - 0.8, IV), (w2 + 0.4, I)], w2 + 2.2, g=0.45)
bd2, end = G('close', 'breath', -0.3), G('close', 'breath', 1.6)
knock(bd2 + 0.6, 0.010, px(1100), 280); air(bd2 + 0.6, 0.9, 0.006, px(1100))  # the next film's card lifts
chord((39, None, 55), end - 0.2, TOT, g=0.55, step=0.3, att=0.9, rel=0.6)
mark(end + 0.6)
soften(2600)
