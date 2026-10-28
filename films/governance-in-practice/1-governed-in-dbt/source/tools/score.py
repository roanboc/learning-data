# Governed in dbt: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (checked against the prologue, Governance principles and Governance on the map, and against this
# series' five other films, so none repeats): a string quartet, two violins, a viola and a cello, muted, one player to a note, and a
# xylophone with soft rubber mallets, both made here (music.py has neither), played softly, so nothing rings above the voice.
#  - The quartet holds the chords: under the opening, as Jun's day goes from his pull request to the rules that arrive too late,
#    and back to the pull request where a check runs them; after it, only at a chapter's turn, under a moment on screen or in a
#    pause without words.
#  - The xylophone marks what lands, and its marks mean the same all through: one low note when a check turns red, two rising when
#    it turns green, and a soft falling third when a reviewer is asked. Each pin that goes into the loop gets a note of its own, up
#    the scale, as the loop fills.
#  - The opening's problem is in the quartet: the same note four times as the council's minutes carry the same action, a hollow
#    fifth under the question nobody answers, and Anil's path as a line that goes up three notes and comes back to where it began.
#    "Something had to change" stops it, and the solution comes in on the home chord.
#  - The series' mark, four notes, 1-5-4-8, on the xylophone over the quartet, plays under the title and the end card.
#  - B-flat major all through.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, and after it only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the
#    opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: each string is one voice, with no vibrato and no tremolo; every chord is tuned pure (just
#    intonation, see hz()), and the chords on the second degree are left out (their fifth isn't pure here). Nothing pulses, even
#    when a check is red.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in
#    src/scenes.js (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz: keys, paper, a page turning, a pencil, a highlighter, a pin, a card set
# down, a stamp.

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
R1 = np.random.default_rng(14)  # this film's own randomness: the room, the bow's air, the paper, the keys

# ---- tuning: just intonation from B-flat, so a chord's notes are whole-number ratios of each other and nothing beats. The chords
# used are I, IV, V, vi and iii, whose fifths are all pure in this table; C is never held with G or E-flat (a wolf fifth and a
# Pythagorean third, both here)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (58, 233.0819)  # B-flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]

# ---- the levels: a string sits about as far under the voice as the series' other films' music (matched by loudness, not by
# peak); the xylophone a little under it, as it's struck; the effects about 12 dB under the music (FX scales them all)
QL, XL_, FX = 0.03, 0.05, 1.3
LEVEL = {'vn1': 1.0, 'vn2': 0.95, 'va': 1.05, 'vc': 1.1}
PAN = {'vn1': -0.35, 'vn2': -0.12, 'va': 0.14, 'vc': 0.32}  # as a quartet sits: first violin left, cello right

# ---- the muted strings. A bowed string sounds every harmonic of its pitch, each weaker than the one under it (the bow's
# sawtooth), shaped by its body's resonances (the violin's near 280, 460 and 550 Hz, the viola's lower, the cello's lower still);
# the mute on the bridge takes away the bright upper harmonics, above about 1.1 kHz on a violin and lower on the others, so it
# sounds veiled. A little of the bow's air, more as it starts; the pitch holds, with no vibrato; the bow's weight drifts by a
# percent or two, slowly, as a player's does. A small room round the players rings on for about a second
BODY = {  # resonances as (Hz, width, weight); the mute's corner; the bow's air band
    'vn1': ([(280, 90, 0.5), (460, 120, 0.9), (550, 140, 1.0), (1050, 450, 0.3)], 1100, (600, 1800)),
    'vn2': ([(280, 90, 0.5), (460, 120, 0.9), (550, 140, 1.0), (1050, 450, 0.3)], 1100, (600, 1800)),
    'va': ([(230, 80, 0.5), (360, 110, 1.0), (430, 120, 0.8), (880, 380, 0.3)], 920, (450, 1500)),
    'vc': ([(100, 40, 0.5), (185, 60, 1.0), (215, 70, 0.8), (420, 160, 0.45), (800, 300, 0.2)], 700, (250, 1100))}
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.014 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _harm(inst, f, soft=1.0):
    """the weights of a note's harmonics on inst, at f Hz"""
    F, fm = BODY[inst][:2]; n = max(1, int(2500 // f)); k = np.arange(1, n + 1); fk = f * k
    r = sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in F) + 0.08
    a = r / k / (1 + (fk / (fm * soft)) ** 2) * np.clip((2500 - fk) / 250, 0, 1)
    return a / np.sqrt((a ** 2).sum())
def line(inst, segs, g=1.0, soft=1.0, att=0.25, rel=0.35, room=0.25, pan=None, tie=False):
    """one player's line: segs is [(start, end, note, level)], each note slurred into the next, and the same note again re-bowed
    unless tie; a rest (note None) breaks it"""
    run = []
    for s in list(segs) + [(None, None, None, 0)]:
        if s[2] is None:
            if run:
                _line(inst, run, g, soft, att, rel, room, PAN[inst] if pan is None else pan, tie)
            run = []
        else:
            run.append(s)
def _line(inst, segs, g, soft, att, rel, room, pan, tie):
    T0, T1 = segs[0][0], segs[-1][1]; gl = 0.06
    n = int((T1 - T0 + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    fs = [hz(m) for _, _, m, _ in segs]; A = [_harm(inst, f, soft) for f in fs]; K = max(len(a) for a in A)
    A = [np.pad(a, (0, K - len(a))) for a in A]
    kx, kf, ka, kv = [], [], [], []
    for i, (a, b, m, v) in enumerate(segs):  # each note steady between short slurs, its harmonics' weights with it
        for t in ((a - T0 + gl / 2 if i else 0.0), (b - T0 - gl / 2 if i < len(segs) - 1 else n / SR)):
            kx.append(t); kf.append(np.log2(fs[i])); ka.append(A[i]); kv.append(v)
    ph = 2 * np.pi * np.cumsum(2 ** np.interp(x, kx, kf)) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > T1 - T0, np.cos(0.5 * np.pi * np.minimum((x - (T1 - T0)) / rel, 1)) ** 2, 1.0)
    for i in range(1, len(segs)):  # the same note again is a new bow: it dips for a moment
        if segs[i][2] == segs[i - 1][2] and not tie:
            e = e * (1 - 0.75 * np.exp(-((x - (segs[i][0] - T0)) / 0.05) ** 2))
    fq = R1.uniform(0.11, 0.37, 3); fp = R1.uniform(0, 2 * np.pi, 3)
    bow = 1 + 0.015 * sum(np.sin(2 * np.pi * a * x + b) for a, b in zip(fq, fp)) / 3  # the bow's weight, drifting slowly
    lev = np.interp(x, kx, kv) * bow; ka = np.array(ka); s = np.zeros(n)
    for j in range(K):  # the higher harmonics come in a little after the lower: a bow takes a moment to catch the string
        aj = np.interp(x, kx, ka[:, j])
        if aj.max() > 1e-4:
            s += aj * e ** (1 + 0.12 * j) * np.sin((j + 1) * ph + 0.9 * j * j)
    lo, hi = BODY[inst][2]
    s = s * lev + 0.012 * filt(noise(n / SR + 0.01)[:n], 'band', (lo, hi)) * e * lev * (1 + 2.0 * np.exp(-x / 0.06))
    s = filt(s.astype(np.float32), 'low', 2400)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), T0, g * QL * LEVEL[inst], pan)
def note(inst, m, s, sec, g=1.0, **o):
    """one held note"""
    line(inst, [(s, s + sec, m, 1.0)], g, **o)
def chord(voices, a, b, g=0.8, step=0.15, att=0.4, rel=0.5, soft=0.9):
    """a held chord, each player coming in a moment after the one under it: voices is {player: note}, lowest first"""
    for i, (inst, m) in enumerate(voices.items()):
        line(inst, [(a + step * i, b, m, 1.0)], g, soft, att=att, rel=rel)
def again(inst, m, times, sec=0.32, g=0.8, fall=0.88):
    """the same note, bowed again at each time, short, each a little softer"""
    for i, t in enumerate(times):
        line(inst, [(t, t + sec, m, 1.0)], g * fall ** i, 0.85, att=0.06, rel=0.18, room=0.2)

# ---- the xylophone, with soft rubber mallets: a rosewood bar's note (its fundamental, and the overtone its maker tunes to three
# times it), and over its tube the fundamental rings on a little; the rubber is soft, so the strike is round, with only a breath of
# the mallet in it, and nothing above about 2.4 kHz
def xyl(m, s, g=1.0, pan=0.0):
    f = hz(m); d = 0.5 * (466 / f) ** 0.5; sec = 4 * d + 0.1; x = tt(sec)
    sig = (np.sin(2 * np.pi * f * x) * np.exp(-x / d) + 0.16 * np.sin(2 * np.pi * 3 * f * x + 0.4) * np.exp(-x / (d / 3.5))
           + 0.03 * np.sin(2 * np.pi * 6.2 * f * x + 1.1) * np.exp(-x / (d / 8))) * np.minimum(1, x / 0.0025)
    sig = sig + 0.06 * filt(noise(sec)[:len(x)], 'band', (350, 1500)) * np.exp(-x / 0.008)
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    sig = np.pad(sig, (0, len(_IR) - 1)) + 0.12 * fftconvolve(sig, _IR).astype(np.float32)
    put(sig.astype(np.float32), s, g * XL_, pan)
def red(s, g=0.9):
    """a check turns red: one low note"""
    xyl(65, s, g)
def green(s, g=0.85):
    """a check turns green: two notes, rising"""
    xyl(70, s, g); xyl(77, s + 0.2, g * 0.9)
def asked(s, g=0.7):
    """a reviewer is asked: a soft falling third"""
    xyl(74, s, g); xyl(70, s + 0.28, g * 0.85)
def mark(s, g=0.85, step=0.42):
    """the series' mark, 1-5-4-8"""
    for i, m in enumerate([70, 77, 75, 82]):
        xyl(m, s + step * i, g * (1.0 if i < 3 else 1.1))
SCALE = [70, 72, 74, 75, 77, 79]  # the pins' notes, up the scale as the loop fills: B-flat, C, D, E-flat, F, G

# ---- soft sounds on the desks and boards, all low-passed
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
    """a push pin into cork or a poster: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.6):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def marker(s, g=0.012, pan=0.0, sec=0.6):
    """a highlighter drawn along a line: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def page(s, g=0.016, pan=0.0):
    """a page turned: a breath of air as it lifts, and a padded flap as it lies"""
    s_air(s, 0.35, g * 0.5 * FX, pan, 150, 900); paper(s + 0.25, g * 0.7, pan, 0.25)
def slide(s, g=0.016, pan=0.0, sec=0.8):
    """sheets slid together into a pile: a low, rough slide"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def stamp(s, g=0.02, pan=0.0):
    """a rubber stamp pressed on a sheet: a padded thud"""
    x = tt(0.25); X(norm(filt((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 25) + 0.4 * filt(noise(0.25), 'band', (150, 800))[:len(x)] * np.exp(-x * 35)).astype(np.float32), 'low', 900)), s, g * FX, pan)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)

# =============================================================================================================================
# 1. The rules arrive first: the opening, under the quartet all through. Today, the home chord, and as the loop goes round the
#    first violin climbs and comes back; the pull request on the fourth; Jun's line on the sixth, darker; the rule card's owner
#    underlined; the minutes, the same note four times; nobody answers, a hollow fifth; census day, Anil's path a line going up
#    three notes and back to where it began, each card pinned; "Something had to change" stops it. Then the rules in the project,
#    on the home chord: the checks run, governance turns red, two lines typed, and it turns green; Planning asked by itself; four
#    months of minutes into one pile beside a check that takes a minute; Jun's words change; and the title on the mark
rw = lambda lid, word, off=0: W('rules', lid, word, off)
rc = lambda lid, off=0: G('rules', lid, off)
q, ver, opens, table, awards = rw('loop', 'from a question'), rw('loop', 'new version'), rc('opens', -0.3), rw('opens', 'a new table'), rw('opens', 'the awards conferred')
slow, rules_ = rc('slowed', -0.4), rw('slowed', 'the rules arrive')
rule, has, months, nobody = rc('owner', -0.4), rw('owner', 'has an owner'), rw('months', 'four months'), rw('nobody', 'nobody answers')
census, fac, places = rc('census', -0.4), rw('census', 'Faculty of Health'), rw('census', 'plan its places')
path = [rw('census', 'from Jun'), rw('census', 'to Noor'), rw('census', 'to Planning'), rw('census', 'back to Jun')]
change, live, runs = rc('change'), rc('live', -0.4), rw('live', 'a check runs')
noOwner, how = rw('answers', 'no owner'), rw('answers', 'how to add one')
adds, two, turns = rc('adds'), rw('adds', 'two lines'), rw('adds', 'turns green')
itself, plan = rc('itself'), rw('itself', 'Planning')
mnt, four, check = rc('minute', -0.4), rw('minute', 'four months'), rw('minute', 'a check that takes')
first, arrive, board, title = rc('first', -0.4), rw('first', 'arrive first'), rc('breath', -0.3), rc('breath', 1.2)
# today: the home chord, B-flat, the players coming in one by one; as the loop goes round, the first violin climbs and comes back
chord({'vc': 46, 'va': 53, 'vn2': 58}, 0.3, opens + 0.1, 0.75, step=0.35, att=0.8)
line('vn1', [(1.4, q, 62, 1.0), (q, q + (ver - q) * 0.4, 63, 1.0), (q + (ver - q) * 0.4, ver + 0.3, 65, 1.0), (ver + 0.3, opens + 0.1, 62, 1.0)], 0.7, 0.9, att=0.6)
pencil(q, 0.008, px(960), ver + 0.6 - q)  # the pencil round the loop
# his pull request, on the fourth: E-flat; its table and its words highlighted
tap(opens + 0.15, 0.012, 0.0)
chord({'vc': 39, 'va': 55, 'vn2': 58, 'vn1': 63}, opens + 0.1, slow + 0.1, 0.7, step=0.1, att=0.5)
marker(table, 0.010, px(700), 0.5); marker(awards, 0.010, px(600), 0.6)
# Jun's line, on the sixth: G minor
chord({'vc': 43, 'va': 50, 'vn2': 58, 'vn1': 62}, slow + 0.1, months - 0.1, 0.7, step=0.1, att=0.5)
pencil(has, 0.012, px(560), 0.8)  # "owner" underlined on the rule card
# the minutes, four months of the same action: each sheet set down, and the viola's same note, bowed again, each a little softer;
# the cello and the second violin hold the sixth under them
for i in range(4):
    paper(months + 0.35 * i + 0.1, 0.018 * 0.9 ** i, px([1190, 1645, 1210, 1660][i]), 0.35)
again('va', 62, [months + 0.35 * i + 0.12 for i in range(4)], 0.3, 0.8)
line('vc', [(months - 0.1, nobody, 43, 1.0), (nobody, census + 0.2, 38, 1.0)], 0.7, 0.9, att=0.3)
line('vn2', [(months - 0.1, nobody, 58, 1.0), (nobody, census + 0.2, 57, 1.0)], 0.65, 0.9, att=0.3)
# nobody answers: the red question mark, and a hollow fifth, D and A, with the viola's D between them
note('va', 50, nobody + 0.1, census + 0.2 - nobody - 0.1, 0.6, att=0.5)
# census day: the cards pinned; Anil's question pencilled; his path, each card pinned and each arrow drawn, and the first violin
# going up three notes and back to the one it began on; the third, A, held under it
pin(census + 0.25, 0.020, px(560)); pin(fac - 0.05, 0.020, px(1290)); pencil(places, 0.010, px(1300), 0.9)
for i, t in enumerate(path):
    pin(t - 0.05, 0.018, px([300, 700, 1100, 1500][i]))
    if i:
        pencil(t - 0.05, 0.010, px([500, 900, 1300][i - 1]), 0.45)
chord({'vc': 38, 'va': 57, 'vn2': 62}, census + 0.2, change + 0.6, 0.65, step=0.12, att=0.5, rel=0.8)
line('vn1', [(path[0], path[1], 65, 0.9), (path[1], path[2], 67, 0.95), (path[2], path[3], 69, 1.0), (path[3], change + 0.6, 65, 0.85)], 0.7, 0.9, att=0.2, rel=0.8)
# something had to change: it stops, and in the quiet the arrows fade; the rules in the project come in on the home chord
chord({'vc': 46, 'va': 53, 'vn2': 62, 'vn1': 65}, live + 0.2, adds - 0.2, 0.65, step=0.2, att=0.8)
tap(runs, 0.012, 0.0)
for t in (noOwner - 1.2, runs + 1.3, runs + 1.6, runs + 1.9):  # build, products, reviewers and impact pass: their lights
    tap(t, 0.007, 0.0)
red(noOwner - 0.2)
marker(max(how, noOwner + 1.6), 0.010, px(1200), 0.6)  # the link to its page, lifted
# two lines typed, and it turns green: E-flat, then home
paper(adds, 0.016, px(700), 0.35)
keys(two, 9, 0.011, px(700), 0.11)
chord({'vc': 39, 'va': 55, 'vn2': 63, 'vn1': 67}, adds - 0.2, turns, 0.6, step=0.08, att=0.4, rel=0.3)
green(turns)
chord({'vc': 46, 'va': 53, 'vn2': 62, 'vn1': 65}, turns, mnt + 0.2, 0.65, step=0.06, att=0.3)
tap(itself, 0.010, 0.0)  # Draft becomes Open
asked(plan)  # Planning, asked by itself
# four months of minutes slid into one small pile, beside a check that takes a minute: the fourth, then home
chord({'vc': 39, 'va': 58, 'vn2': 63, 'vn1': 67}, mnt + 0.2, check + 0.2, 0.6, step=0.1, att=0.5)
slide(four + 0.1, 0.014, px(900), 0.9)
knock(check + 0.05, 0.016, px(1500), 300)
chord({'vc': 46, 'va': 53, 'vn2': 62, 'vn1': 65}, check + 0.2, first + 0.3, 0.6, step=0.1, att=0.4)
# and for Jun, the rules arrive first: his words change, and the first violin rises to the home note
chord({'vc': 46, 'va': 53, 'vn2': 62}, first + 0.3, board + 0.4, 0.6, step=0.1, att=0.5)
line('vn1', [(first + 0.3, arrive, 65, 1.0), (arrive, board + 0.4, 70, 1.0)], 0.65, 0.9, att=0.5)
# the board: the first card lights and lifts, and becomes the title, on the mark over the home chord
knock(board + 0.35, 0.014, px(400), 280); air(board + 1.0, 0.9, 0.008, px(400))
chord({'vc': 46, 'va': 53, 'vn2': 58, 'vn1': 62}, board + 0.4, E('rules') + 0.3, 0.6, step=0.2, att=0.8, rel=1.0)
mark(title + 0.3)

# 2. A pin at each step: a chord at the turn; each pin goes in with a note of its own, up the scale, as the loop fills; the learner
#    table's sheet, its owner's pin and its term's; the columns' sheet, their classes and the pin; the tests' sheets and the rule's
#    pin; and the pull request's files, the governance lines in the same change as the code, on the home chord
pw = lambda lid, word, off=0: W('pins', lid, word, off)
pc = lambda lid, off=0: G('pins', lid, off)
p0 = S0('pins')
chord({'vc': 39, 'va': 55, 'vn2': 58}, p0 + 0.2, p0 + 2.6, 0.55, step=0.2, att=0.6, rel=0.8)
pt = [pw('pins1', 'a term'), pw('pins1', 'a class'), pw('pins1', 'an owner'), pw('pins2', 'a rule'), pw('pins2', 'an approval'), pw('pins2', 'a version')]
for i, t in enumerate(pt):
    pin(t - 0.05, 0.018, px([960, 1260, 1330, 1170, 620, 650][i])); xyl(SCALE[i], t, 0.6)
ln_, ow, tm = pc('line', -0.4), pw('learner', 'its owner'), pw('learner', 'the term it holds')
paper(ln_ + 0.3, 0.016, px(500), 0.4)
pin(ow + 0.7, 0.016, px(1010)); xyl(70, ow + 0.7, 0.45)
pin(tm + 0.7, 0.016, px(740)); xyl(72, tm + 0.7, 0.45)
cl_, ident, test, tOwn = pc('columns', -0.4), pw('columns', 'identifies a person'), pw('columns', 'each test'), pw('columns', 'has an owner')
paper(cl_ + 0.1, 0.016, px(900), 0.4)
for k in range(3):
    tap(ident + 0.2 + 0.25 * k, 0.008, px(1600))
pin(ident + 0.8, 0.016, px(1650)); xyl(74, ident + 0.8, 0.45)
paper(test - 0.2, 0.014, px(700), 0.35); paper(tOwn + 0.6, 0.012, px(1400), 0.35)
pin(tOwn + 0.8, 0.016, px(1150)); xyl(75, tOwn + 0.8, 0.45)
rv, wc_ = pc('reviewed', -0.4), pw('reviewed', 'with the code')
tap(rv + 0.2, 0.010, 0.0)
chord({'vc': 46, 'va': 53, 'vn2': 62, 'vn1': 65}, wc_ - 0.1, E('pins') + 0.2, 0.55, step=0.12, att=0.5, rel=0.8)

# 3. Who may build on what: a chord at the turn; the groups' sheets; the site plan, its fences pencilled; the sketch reaching for a
#    private step, stopped: dbt's error, red; Jun's table built on the core, green; a key comes for it and stops at the fence
aw = lambda lid, word, off=0: W('access', lid, word, off)
ac = lambda lid, off=0: G('access', lid, off)
a0 = S0('access')
chord({'vc': 43, 'va': 55, 'vn2': 58, 'vn1': 62}, a0 + 0.2, a0 + 2.4, 0.5, step=0.15, att=0.6, rel=0.8)
paper(aw('groups', 'Groups'), 0.016, px(600), 0.4); paper(aw('groups', 'access') + 0.3, 0.012, px(1300), 0.35)
pv, pub, prot = ac('private'), aw('public', 'public'), aw('public', 'protected')
pencil(pv + 0.1, 0.010, px(400), 1.2); pencil(pub, 0.010, px(900), 0.8); pencil(prot, 0.010, px(1400), 0.8)
dbt = aw('stops', 'dbt stops')
pencil(aw('stops', 'a private one') - 0.1, 0.009, px(300), 0.9)
red(dbt + 0.1)
jn, only, builds = aw('builds', 'new table'), aw('builds', 'only public'), aw('builds', 'so it builds')
knock(jn - 0.2, 0.014, px(1500), 260)
green(max(builds, only + 1.0))
rd = aw('read', 'who may read')
air(rd - 0.1, 1.2, 0.008, px(1700)); knock(rd + 1.2, 0.012, px(1500), 300); tap(rd + 1.45, 0.006, px(1500)); tap(rd + 1.65, 0.005, px(1500))
chord({'vc': 39, 'va': 55, 'vn2': 58}, rd + 1.3, E('access') + 0.3, 0.45, step=0.2, att=0.8, rel=0.8)

# 4. A promise the build keeps: the contract's sheet and its pin; one line of SQL changed, and the contract fails, red; the two
#    versions pinned on the board, the date ringed and the version's pin; the three exposures set down, who uses each and who answers
kw = lambda lid, word, off=0: W('contract', lid, word, off)
kc = lambda lid, off=0: G('contract', lid, off)
k0 = S0('contract')
chord({'vc': 46, 'va': 53, 'vn2': 58, 'vn1': 65}, k0 + 0.2, k0 + 2.4, 0.5, step=0.15, att=0.6, rel=0.8)
paper(k0 + 0.3, 0.016, px(700), 0.4)
con = kw('contract', 'a contract')
pin(con + 0.8, 0.016, px(1450)); xyl(77, con + 0.8, 0.45)
chk, mism = kw('mismatch', 'checks it'), kw('mismatch', 'a mismatch')
keys(chk, 5, 0.010, px(600), 0.14)
red(mism + 0.1)
vr, newv, old, dto, dt = kc('version', -0.4), kw('version', 'a new version'), kw('version', 'the old one'), kw('version', 'a date to go'), kw('date', 'goes on', 0.3)
pin(newv - 0.05, 0.018, px(700)); pin(old - 0.05, 0.018, px(1250))
pin(dto + 0.85, 0.016, px(1500)); xyl(79, dto + 0.85, 0.45)
pencil(dt, 0.011, px(1250), 0.9)  # the date ringed
chord({'vc': 39, 'va': 55, 'vn2': 58, 'vn1': 63}, dt - 0.1, dt + 2.6, 0.5, step=0.15, att=0.6, rel=0.8)
ex = kc('exposures', -0.4)
for i in range(3):
    paper(ex + 0.1 + 0.35 * i, 0.016 * 0.9 ** i, px([450, 960, 1450][i]), 0.35)

# 5. What this change touches: the report written into the pull request; Tuesday's draft, its files; the report again, five who use
#    it and four owners to ask, and Mei's stamp, "breaks"; the column instead, typed; additive, green; a rename, and the impact
#    check fails, red
iw = lambda lid, word, off=0: W('impact', lid, word, off)
ic = lambda lid, off=0: G('impact', lid, off)
i0 = S0('impact')
chord({'vc': 38, 'va': 57, 'vn2': 62, 'vn1': 65}, i0 + 0.2, i0 + 2.4, 0.5, step=0.15, att=0.6, rel=0.8)
tch = ic('touches')
keys(tch + 0.3, 7, 0.009, 0.0, 0.15)
tue = ic('tuesday', -0.3)
page(tue + 0.1, 0.014, 0.0); marker(iw('tuesday', 'or more as awards'), 0.010, px(900), 0.6)
rp, wrote, five, fo = ic('report', -0.4), iw('report', 'wrote it'), iw('report', 'five reports'), iw('report', 'four owners')
keys(rp + 0.5, 4, 0.008, 0.0, 0.15); keys(wrote + 0.2, 8, 0.008, 0.0, 0.22)
for k in range(5):
    tap(five + 0.18 * k, 0.006, px(900))
marker(fo, 0.010, px(900), 0.6)
br = iw('mei', 'breaks')
stamp(br - 0.05, 0.022, px(1500))
note('vc', 43, br, 1.8, 0.6, att=0.15, rel=0.8)  # the stamp lands on the sixth, low
col, cnt = ic('column', -0.4), iw('column', 'counts as an award')
page(col + 0.1, 0.012, 0.0); keys(cnt - 0.2, 6, 0.010, px(900), 0.12)
ad = iw('additive', 'additive')
green(ad + 0.1, 0.8); marker(iw('additive', 'three owners'), 0.008, px(900), 0.5)
fl = iw('renamed', 'would fail')
red(fl + 0.05)
chord({'vc': 43, 'va': 50, 'vn2': 58}, fl + 1.4, E('impact') + 0.3, 0.45, step=0.2, att=0.8, rel=0.8)

# 6. Reviews go to the owners: the review pin glows, at the turn; the reviewers file written by its script, three of its lines
#    joined to their people; GitHub asks them, the falling third; the file behind, red, then caught up, green; a decision as a file
ow_ = lambda lid, word, off=0: W('owners', lid, word, off)
oc = lambda lid, off=0: G('owners', lid, off)
o0 = S0('owners')
chord({'vc': 46, 'va': 53, 'vn2': 58, 'vn1': 62}, o0 + 0.2, o0 + 2.6, 0.5, step=0.15, att=0.6, rel=0.8)
co, wr_ = oc('script', -0.4), ow_('script', 'writes')
paper(co + 0.1, 0.014, px(700), 0.35); keys(wr_, 6, 0.008, px(700), 0.12)
for t, x_ in ((ow_('script', "the registrar's office"), 1400), (ow_('script', 'Planning'), 1450), (ow_('script', 'Clara'), 1500)):
    knock(t + 0.4, 0.012, px(x_), 280)
gh, fails, behind = ow_('asks', 'asks them'), ow_('asks', 'a check fails'), ow_('asks', 'falls behind')
asked(gh + 0.1, 0.65)
red(fails + 0.05)
green(behind + 1.0, 0.8)
dc = oc('decisions', -0.4)
paper(dc + 0.3, 0.016, px(800), 0.4)
for t in (ow_('decisions', 'who decided'), ow_('decisions', 'when'), ow_('decisions', 'why')):
    marker(t, 0.008, px(800), 0.4)

# 7. A check that teaches: its message, and the page it links, turned; a new rule's warning, its date and the day it's an error,
#    pencilled along; the warnings week by week, one note a week, each lower and softer, down to none, and green; Anil's column, red,
#    his one line typed, and green
tw_ = lambda lid, word, off=0: W('teach', lid, word, off)
tc = lambda lid, off=0: G('teach', lid, off)
t0_ = S0('teach')
chord({'vc': 39, 'va': 55, 'vn2': 58, 'vn1': 63}, t0_ + 0.2, t0_ + 2.4, 0.5, step=0.15, att=0.6, rel=0.8)
paper(t0_ + 0.3, 0.014, px(600), 0.35)
for w_ in ('what to add', 'where'):
    marker(tw_('says', w_), 0.008, px(700), 0.4)
page(tw_('says', 'links a page'), 0.016, px(1400))
wn, dec, err = tc('warns', -0.4), tw_('holds', 'the first of December'), tw_('holds', 'then an error')
paper(wn + 0.3, 0.014, px(900), 0.35)
pencil(dec - 0.2, 0.010, px(600), 1.0); pencil(dec + 0.3, 0.008, px(1000), 0.4); pencil(err, 0.010, px(1250), 0.8)
wk, none_ = tw_('fell', 'Week by week'), tw_('fell', 'to none')
for k in range(5):  # forty-one, then fewer each week: the second violin steps down, each softer
    note('vn2', [67, 65, 63, 62, 58][k], wk + 0.3 * k + 0.05, 0.28 if k < 4 else 0.6, [0.75, 0.62, 0.5, 0.4, 0.32][k], att=0.05, rel=0.2, room=0.2)
green(none_ + 0.05, 0.8)
an, sh, clf = tc('anil', -0.4), tw_('anil', 'the check showed'), tw_('anil', 'classify it')
red(sh + 0.05)
paper(clf - 0.2, 0.012, px(1200), 0.3); keys(clf + 0.3, 7, 0.010, px(1200), 0.12)
green(clf + 1.4, 0.8)
chord({'vc': 46, 'va': 53, 'vn2': 62}, clf + 2.0, E('teach') + 0.3, 0.45, step=0.2, att=0.8, rel=0.8)

# 8. An agent on every pull request: the skill's sheet, its steps lit; the agent's comment and its three findings; what it drafted,
#    row by row, and who decides each; its comment with no tick, and each person's yes, on the home chord: people decide
gw = lambda lid, word, off=0: W('agent', lid, word, off)
gc = lambda lid, off=0: G('agent', lid, off)
g0 = S0('agent')
chord({'vc': 38, 'va': 57, 'vn2': 62}, g0 + 0.2, g0 + 2.4, 0.5, step=0.15, att=0.6, rel=0.8)
paper(g0 + 0.6, 0.014, px(700), 0.4)
for w_ in ('run the checks', 'read what they', "draft what's missing"):
    marker(gw('skill', w_), 0.008, px(700), 0.4)
pr8 = gc('found', -0.4)
tap(pr8 + 0.2, 0.010, 0.0)
for w_ in ('no owner', 'ten columns', 'a rule with no test'):
    tap(gw('found', w_), 0.008, px(900))
dS = gc('drafted')
for k in range(3):
    tap(dS + 0.1 + 0.35 * k, 0.007, px(900))
for k in range(3):
    marker(gw('drafted', 'who decides') + 0.25 * k, 0.006, px(1400), 0.3)
nv, ppl = gc('never', -0.4), gw('never', 'People decide')
tap(nv + 0.1, 0.008, 0.0)
for k in range(3):
    knock(ppl + 0.1 + 0.35 * k + 0.5, 0.012, px(1500), 280)
chord({'vc': 46, 'va': 53, 'vn2': 62, 'vn1': 65}, ppl, E('agent') + 0.4, 0.55, step=0.15, att=0.6, rel=0.9)

# 9. Carried with the code: Planning's yes, and the pull request merged, on the home chord; Noor's map, the project the home of five
#    things, and their copies flowing one way, each drift check green; Jun's old line struck through, and his new words; the
#    poster's pins, each giving way to its line in the project, a note each, up the scale; the next film's card lifts; and the end
#    card, on the mark, the chord held to the end
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
c0 = S0('close')
yes = cw('goes', "Planning's yes")
knock(yes + 0.05, 0.012, px(1600), 300)
chord({'vc': 46, 'va': 53, 'vn2': 62, 'vn1': 65}, yes + 0.6, yes + 3.2, 0.55, step=0.12, att=0.5, rel=0.9)
tap(yes + 0.7, 0.010, px(700))  # Open becomes Merged
hm = [cw('home', w_) for w_ in ('owners', 'classes', 'contracts', 'tests', 'decisions')]
for k, t in enumerate(hm):
    knock(t - 0.05, 0.010 if k < 2 else 0.007, px(820), 300)
plat, cat = cw('flow', 'the platform'), cw('flow', 'the catalogue')
air(plat - 0.3, 0.9, 0.008, px(1300)); air(cat - 0.3, 0.9, 0.008, px(1300))
green(plat + 0.8, 0.6); green(cat + 0.8, 0.45)
built, every = cw('after', "after he's built it"), cw('every', 'every change')
pencil(built, 0.012, px(300), 0.8)
note('vn1', 70, every - 0.2, 2.2, 0.55, att=0.5, rel=0.8)
note('vc', 46, every - 0.2, 2.2, 0.5, att=0.5, rel=0.8)
cr = cw('last', 'carries governance')
for j in range(6):  # each pin's words give way to its line: u = (t - carries + 0.6) / 3.0, and pin j's turn at u = (j + 0.5) / 6
    xyl(SCALE[j], cr - 0.6 + 3.0 * (j + 0.5) / 6, 0.4)
bd, end = cc('breath', -0.3), cc('breath', 1.6)
air(bd + 0.6, 0.9, 0.006, px(700))
chord({'vc': 46, 'va': 53, 'vn2': 58, 'vn1': 62}, end - 0.2, TOT, 0.55, step=0.2, att=0.9, rel=0.6)
mark(end + 0.6)
soften(2600)
