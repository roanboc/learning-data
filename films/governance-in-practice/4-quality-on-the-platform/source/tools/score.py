# Quality on the platform: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (checked against the prologue, Governance principles and Governance on the map, and against this
# series' other films, so none repeats): an accordion, one dry reed to a note, with no tremolo and no musette, and a steel-string
# guitar, fingerpicked; both made here (music.py has neither), played softly, so nothing rings above the voice.
#  - The accordion holds the chords: under the opening, as Clara's morning goes from the numbers she checks to the night whose
#    failure named only itself, the warning nobody owned and the survey, and on to the owners, the monitoring and the one scorecard
#    that came instead; after it, only at a chapter's turn, under a moment on screen or in a pause without words.
#  - The guitar marks what lands, close and soft, and its marks mean the same all through: two notes rising a third when a cell or a
#    check turns green, a single low note when a check stops something going on, and two notes falling a fifth when an issue or an
#    alert reaches its owner.
#  - The opening's problem is in the accordion: Clara's question left on a note outside the chord; the night's failure, which says
#    only its name, on a hollow fifth; the year of warnings, one note held while the days go by, and left alone, with nothing under it,
#    as nobody owned it; the survey on the fourth, never coming home; and under the number nobody knew whose to fix, the bass left
#    alone on the fifth. "Something had to change" stops it, and the solution comes in on the home chord.
#  - The series' mark, four notes, 1-5-4-8, on the accordion's bass, with the guitar an octave above, under the title and the end card.
#  - G major all through.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, and after it only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the
#    opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: each note is one reed, with no second reed a little out of tune beside it, and each guitar
#    note one string, let ring and then damped, never strummed; every chord is tuned pure (just intonation, see hz()), and A is
#    never held with C or E (their intervals aren't pure here), so the fifth chord is played without it. Nothing pulses, even on the
#    red night: the stop is told by the picture, not by a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in
#    src/scenes.js (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz: keys at night, a page from the printer, paper, a pin, a pencil, a
# highlighter, a stamp, an envelope's slide.

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
R1 = np.random.default_rng(24)  # this film's own randomness: the room, the bellows, the paper, the keys

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. The chords used
# are I, IV, V, vi and iii, whose fifths and thirds are all pure in this table; A is never held with C or E (a Pythagorean third and
# a wolf fifth, both here), so V is played as D and F sharp, without its A
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (43, 97.9989)  # G 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords, as (the left hand's bass, (the right hand's notes, lowest first)), one reed to a note
I, IV, V, vi, iii = (43, (59, 62, 67)), (48, (60, 64, 67)), (50, (62, 66, 74)), (40, (59, 64, 67)), (47, (59, 62, 66))

# ---- the levels: the accordion sits about as far under the voice as the series' other films' music (matched by loudness, not by
# peak); the guitar a little under it, as it's played close; the effects about 12 dB under the music (FX scales them all)
AL, GL, FX = 0.045, 0.07, 1.6
LEVEL = {'r': 1.0, 'l': 1.05}
PAN = {'r': -0.12, 'l': -0.22}  # the accordion a little left of centre, its bass side further; the guitar sits right

# ---- the accordion. A free reed, one to a note, set going by the bellows: its tone is bright and reedy, every harmonic there, and
# the reed block's chamber lifts a band of them (near 1.1 kHz on the right hand, lower on the bass side, whose fundamental is weaker
# than its next harmonics). A note speaks a moment after its button goes down, its upper harmonics last, as the reed swings wider,
# and it stops soon after the button is let go. The bellows, one for every note, swell a little over a long chord and ease, once,
# as a player draws them; there's no vibrato, and the pitch holds. A breath of air as a pallet opens. A small room of wood and
# plaster round the player rings on for about a second and a half
REED = {  # the chamber's bands as (Hz, width, weight); where the harmonics start to fall away; how fast they fall
    'r': ([(620, 280, 0.5), (1150, 420, 0.9)], 1500, 0.8),
    'l': ([(260, 140, 0.6), (540, 260, 0.8)], 950, 0.65)}
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.4)).astype(np.float32))(np.arange(int(1.4 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _reed(hand, f):
    """the weights of a note's harmonics on one reed of hand ('r' or 'l'), at f Hz"""
    F, fm, sl = REED[hand]; n = max(1, int(2500 // f)); k = np.arange(1, n + 1); fk = f * k
    r = sum(w * np.exp(-((fk - c) / b) ** 2) for c, b, w in F) + 0.45
    a = r / k ** sl / (1 + (fk / fm) ** 2) * np.clip((2500 - fk) / 250, 0, 1)
    if hand == 'l':
        a[0] *= 0.7
    return a / np.sqrt((a ** 2).sum())
def line(hand, segs, g=1.0, att=0.12, rel=0.25, room=0.3, pan=None):
    """one reed's line on hand: segs is [(start, end, note, level)], each note the next button as the last is let go, with no slide; a
    rest (note None) lets go"""
    run = []
    for s in list(segs) + [(None, None, None, 0)]:
        if s[2] is None:
            if run:
                _line(hand, run, g, att, rel, room, PAN[hand] if pan is None else pan)
            run = []
        else:
            run.append(s)
def _line(hand, segs, g, att, rel, room, pan):
    T0, T1 = segs[0][0], segs[-1][1]; xf = 0.03
    n = int((T1 - T0 + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > T1 - T0, np.cos(0.5 * np.pi * np.minimum((x - (T1 - T0)) / rel, 1)) ** 2, 1.0)
    fq = R1.uniform(0.09, 0.3, 3); fp = R1.uniform(0, 2 * np.pi, 3)
    bel = 1 + 0.012 * sum(np.sin(2 * np.pi * a * x + b) for a, b in zip(fq, fp)) / 3  # the hand on the bellows, drifting slowly
    s = np.zeros(n)
    for i, (a, b, m, v) in enumerate(segs):  # the next button: this reed stops as that one speaks, in 30 ms
        p0 = 0 if i == 0 else max(0, int((a - T0 - xf / 2) * SR)); p1 = n if i == len(segs) - 1 else min(n, int((b - T0 + xf / 2) * SR))
        xs, f = x[p0:p1], hz(m); w = np.full(p1 - p0, float(v))
        if i:
            w *= np.sin(0.5 * np.pi * np.clip((xs - (a - T0 - xf / 2)) / xf, 0, 1)) ** 2
        if i < len(segs) - 1:
            w *= np.cos(0.5 * np.pi * np.clip((xs - (b - T0 - xf / 2)) / xf, 0, 1)) ** 2
        if b - a >= 0.95:  # a long note swells a little and eases, once: the bellows drawn, not a pulse
            w *= 0.86 + 0.14 * np.sin(np.pi * np.clip((xs - (a - T0)) / (b - a), 0, 1))
        else:
            w *= 0.86
        es = e[p0:p1] if i == 0 else e[p0:p1] * (1 - np.exp(-np.clip(xs - (a - T0 - xf / 2), 0, None) / 0.035))
        for j, aj in enumerate(_reed(hand, f)):  # the higher harmonics come in as the reed swings wider, and leave first
            if aj > 1e-4:
                s[p0:p1] += aj * w * es ** (1 + min(2.0, 0.2 * j)) * np.sin(2 * np.pi * f * (j + 1) * xs + 0.7 * j * j)
    s = s * bel; lev = e * bel
    s = s + 0.01 * filt(noise(n / SR + 0.01)[:n], 'band', (300, 1500)) * lev * (1 + 3 * np.exp(-x / 0.05))
    s = filt(s.astype(np.float32), 'low', 2400)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), T0, g * AL * LEVEL[hand], pan)
def note(hand, m, s, sec, g=1.0, **o):
    """one held note"""
    line(hand, [(s, s + sec, m, 1.0)], g, **o)
def chord(c, a, b, g=0.6, step=0.12, att=0.3, rel=0.35, top=True):
    """a held chord: the bass button first, then the right hand's notes a moment apart, lowest first. c is (bass, (right hand's
    notes)); top=False leaves out the right hand's top note, when a line plays above it"""
    bs, rh = c
    line('l', [(a, b, bs, 1.0)], g, att=att, rel=rel)
    for i, m in enumerate(rh if top else rh[:-1]):
        line('r', [(a + step * (i + 1), b, m, 0.9)], g, att=att, rel=rel)

# ---- the guitar: steel strings, fingerpicked over the soundhole, close and soft. Each note is one string, plucked by a fingertip (its
# upper harmonics softer than a pick's, and missing those the pluck point can't start), let ring, then damped by the hand; the
# higher harmonics die first, and the note keeps a long, quiet after-sound. Its body's air rings near 100 Hz, its top near 200 and
# 400 Hz; nothing above about 2.4 kHz. It sits a little right of the accordion
GB = [(100, 40, 0.8), (205, 80, 1.0), (400, 160, 0.6)]
def gtr(m, s, g=1.0, pan=0.22, ring=2.2):
    f = hz(m); sec = ring + 0.45; x = tt(sec); sig = np.zeros(len(x)); d1 = 1.4 * (196 / f) ** 0.35
    for k in range(1, int(2400 // f) + 1):
        fk = f * k; dk = d1 / (1 + 0.45 * (k - 1) ** 1.2)
        a = abs(np.sin(np.pi * k * 0.21)) / k ** 1.05 * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in GB) + 0.35)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.6 * k * k) * (0.55 * np.exp(-x / (0.25 * dk)) + 0.45 * np.exp(-x / dk))
    sig = sig * np.minimum(1, x / 0.003) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.4, 1)) ** 2, 1.0)
    sig = sig + 0.06 * filt(noise(sec)[:len(x)], 'band', (90, 600)) * np.exp(-x / 0.008)  # the fingertip on the string
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    sig = np.pad(sig, (0, len(_IR) - 1)) + 0.18 * fftconvolve(sig, _IR).astype(np.float32)
    put(sig.astype(np.float32), s, g * GL, pan)
def green(s, g=0.85):
    """a cell or a check turns green: two notes rising a third"""
    gtr(67, s, g); gtr(71, s + 0.2, g * 0.9)
def halt(s, g=0.9):
    """a check stops something going on: a single low note, the open sixth string"""
    gtr(40, s, g, ring=2.4)
def reach(s, g=0.8):
    """an issue or an alert reaches its owner: two notes falling a fifth"""
    gtr(74, s, g); gtr(67, s + 0.3, g * 0.9)
def mark(s, g=0.75, step=0.42):
    """the series' mark, 1-5-4-8: the accordion's bass, and the guitar an octave above"""
    for i, m in enumerate([43, 50, 48, 55]):
        last = i == 3
        note('l', m, s + step * i, 1.8 if last else step, g, att=0.04, rel=0.8 if last else 0.1, pan=-0.1)
        gtr(m + 12, s + step * i, g * (0.75 if last else 0.65), ring=2.4 if last else 1.0)

# ---- soft sounds on the desks, boards and screens, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a book set down"""
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
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.6):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def strike(s, g=0.012, pan=0.0, sec=0.6):
    """a line struck through: a pencil drawn quickly, firmer as it starts"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def marker(s, g=0.012, pan=0.0, sec=0.6):
    """a highlighter drawn along a line: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def slide(s, g=0.016, pan=0.0, sec=0.8):
    """something slid across a desk: a low, rough slide"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def stamp(s, g=0.02, pan=0.0):
    """a rubber stamp pressed on a sheet: a padded thud"""
    x = tt(0.25); X(norm(filt((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 25) + 0.4 * filt(noise(0.25), 'band', (150, 800))[:len(x)] * np.exp(-x * 35)).astype(np.float32), 'low', 900)), s, g * FX, pan)
def printer(s, g=0.012, pan=0.0, sec=1.0):
    """a page from the printer: a low, even whirr, and the sheet sliding out"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 700))[:len(x)] * np.sin(np.pi * x / sec) ** 0.8, s, g * FX, pan)
    slide(s + sec - 0.3, g * 0.9, pan, 0.5)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)

# =============================================================================================================================
# 1. Which number to trust: the opening, under the accordion all through. Planning's room, the home chord, the top note rising as
#    Clara checks the numbers; as they leave, the fourth and then the fifth, which doesn't come home: it turns to the sixth, her
#    memory, and her question is left on a note outside the chord. The night's checks, keys at night and the failed line lit, on a
#    hollow fifth; a year of warnings, one note held, unchanging, and left alone as nobody owned it; the survey on the fourth, never
#    coming home; the failed line printed, the census envelope's number struck through, and under the question nobody could answer,
#    the bass alone on the fifth. "Something had to change" stops it. Then the solution: the home chord, a button at a time, the top
#    note climbing a step as the check names its owner, its kind of quality and its level; monitoring, on the fourth; the morning's
#    scorecard, home, and the guitar's falling fifth as each owner's issue reaches them. Monday 19 October, the sixth, the top note
#    climbing over the chord as the enrolments make six; what's built from them stops: everything lets go, and the guitar's low note
#    in the quiet; Planning keeps the day before's numbers, on the fourth. By noon, the fifth, the top note climbing as the six
#    emails are added, home that night, and the guitar's rising third as every check passes; Clara's numbers ticked, who answers for
#    each; and the title, on the mark
tw = lambda lid, word, off=0: W('trust', lid, word, off)
tc = lambda lid, off=0: G('trust', lid, off)
chk, cen, lists = tw('room', 'checks the numbers'), tw('leave', 'census numbers'), tw('leave', 'the lists')
sl, yus, said, qn = tc('slowed', -0.3), tw('slowed', 'Yusuf'), tw('slowed', 'Clara said'), tw('slowed', 'which number')
rn, fail, whose = tc('ran', -0.3), tw('ran', 'a failed one'), tw('ran', 'not whose data')
yr, warn, nob = tc('year', -0.3), tw('year', 'A warning'), tw('year', 'nobody owned it')
sv, svw, rated, avg = tc('survey', -0.3), tw('survey', 'a survey'), tw('survey', 'people rated'), tw('survey', 'three point nine')
br, brk, chn, nk, chg = tc('broken', -0.3), tw('broken', 'a broken night'), tw('broken', 'change a number'), tw('broken', 'nobody knew whose'), tc('change')
now, own, kind, lvl = tc('now', -0.3), tw('now', 'names its owner'), tw('now', 'the kind of quality'), tw('now', 'the level its owner chose')
wt, mon = tc('watch', -0.3), tw('watch', 'watches for')
mo, iss = tc('morning', -0.3), tw('morning', 'an issue for each owner')
oc, five, lim = tc('oct', -0.3), tw('oct', 'five more'), tw('six', 'the five the learning team allows')
built, stp, kept = tw('stopped', 'Everything built'), tw('stopped', 'stopped'), tw('stopped', 'Planning kept')
nn, night, alln = tc('noon', -0.3), tw('noon', 'that night'), tw('noon', 'all a hundred and sixty')
tr, num, who = tc('trust', -0.3), tw('trust', 'which numbers to trust'), tw('trust', 'who answers for each')
board, title = tc('breath', -0.3), tc('breath', 1.2)
# Planning's room: the home chord, the bass first; the top note rises as Clara checks the numbers. As they leave, a tag on a thread to
# the government, on the fourth, and one to the faculties, on the fifth
chord(I, 0.3, cen - 0.2, 0.7, step=0.3, att=0.8, top=False)
chord(IV, cen - 0.2, lists - 0.1, 0.65, step=0.1, att=0.4, top=False)
chord(V, lists - 0.1, sl + 0.1, 0.6, step=0.1, att=0.4, top=False)
line('r', [(1.0, chk, 71, 1.0), (chk, cen - 0.2, 74, 1.0), (cen - 0.2, lists - 0.1, 72, 0.95), (lists - 0.1, sl + 0.1, 74, 0.95)], 0.65, att=0.6)
marker(chk + 0.1, 0.008, px(700), 0.6)
for t in (cen, lists):
    pencil(t, 0.008, px(1100), 0.7); tap(t + 0.7, 0.008, px(1100))
# until now, in her memory: the fifth turns to the sixth, softer; as Clara says what slowed her down, the top note falls, and her
# question is left on the ninth, a note outside the chord. The night's checks: the chord thins to a hollow fifth, the question still
# above it, keys at night as each line comes, the failed one lit, and a card with no name. A year of warnings: one note held while the
# days go by; under "nobody owned it" the bass lets go, and the note is left alone
line('l', [(sl + 0.1, nob + 0.3, 40, 1.0)], 0.55, att=0.8, rel=1.2)
line('r', [(sl + 0.3, nob + 0.3, 59, 0.9)], 0.5, att=0.8, rel=1.2)
line('r', [(sl + 0.5, rn + 0.2, 64, 0.9)], 0.5, att=0.8, rel=0.6)
line('r', [(sl + 0.3, said, 71, 0.9), (said, qn, 67, 1.0), (qn, yr + 0.2, 66, 0.9)], 0.55, att=0.6)
tap(yus + 0.2, 0.007, px(1600))
keys(rn + 0.35, 8, 0.006, px(960), 0.2); tap(fail + 0.1, 0.008, px(960))
pencil(whose, 0.008, px(1300), 0.6)
slide(warn, 0.008, px(960), nob - warn + 0.3); pencil(nob, 0.009, px(1300), 0.6)
# the survey: the year's note steps up to the fourth's, and never comes home: people rated their data, a sheet each, fanned on the desk,
# and what it came to, on a card. A broken night: the failed line printed, the census envelope set down; as its number is struck through
# the right hand lets go, and under the question nobody could answer the bass is left alone on the fifth. "Something had to change" stops it
line('r', [(yr + 0.2, sv + 0.1, 71, 0.9), (sv + 0.1, avg, 72, 0.9), (avg, chn, 71, 0.85)], 0.5, att=1.0, rel=0.5)
line('l', [(sv + 0.1, nk, 48, 1.0), (nk, chg + 0.6, 50, 1.0)], 0.5, att=0.8, rel=0.9)
for i, m in enumerate((60, 64)):
    line('r', [(sv + 0.3 + 0.2 * i, chn, m, 0.9)], 0.48, att=0.8, rel=0.5)
for t, x_ in ((svw, 290), (rated, 750), (rated + 0.35, 1210)):
    paper(t, 0.012, px(x_), 0.35)
paper(avg, 0.012, px(1500), 0.3)
printer(brk - 0.5, 0.012, px(760))
paper(br + 0.3, 0.014, px(1300), 0.4)
strike(chn, 0.010, px(1300), 0.6); pencil(chn + 0.5, 0.008, px(1450), 0.4)
pencil(nk, 0.009, px(400), 0.8)
# now: the home chord, a button at a time; the check pinned to the board, and as it names its owner, the kind of quality and the level,
# the top note climbs a step for each. Monitoring, on the fourth, its line drawn through the band it has learned. Each morning, home:
# the scorecard laid down, and an envelope slides out from under it to each owner; the top note lets go, and the guitar's falling fifth
# as they reach them
chord(I, now + 0.1, wt + 0.1, 0.6, step=0.25, att=0.7, top=False)
chord(IV, wt + 0.1, mo + 0.1, 0.55, step=0.1, att=0.4, top=False)
chord(I, mo + 0.1, oc + 0.1, 0.55, step=0.1, att=0.4, top=False)
line('r', [(own, kind, 67, 0.9), (kind, lvl, 71, 0.95), (lvl, wt + 0.1, 74, 1.0), (wt + 0.1, mo + 0.1, 76, 0.9), (mo + 0.1, iss + 0.2, 74, 0.85)], 0.55, att=0.3, rel=0.6)
pin(now + 0.3, 0.016, px(960))
for t, x_ in ((own, 700), (kind, 960), (lvl, 1250)):
    pencil(t, 0.008, px(x_), 0.6)
pencil(mon, 0.007, px(1300), 1.6)
paper(mo + 0.2, 0.014, px(670), 0.45)
for i in range(3):
    slide(iss + 0.3 * i, 0.010, px(1300 + 150 * i), 0.7)
reach(iss + 0.9)
# Monday 19 October: the sixth again; the walk-in from February pinned up, and the night's five, one by one; as they make six, more
# than the learning team allows, the top note climbs a step over the chord. What's built from them stops: everything lets go, and in
# the quiet the guitar's low note, as each is stamped. Planning keeps the day before's numbers, on the fourth
chord(vi, oc + 0.1, built, 0.5, step=0.2, att=0.7, rel=0.5, top=False)
line('r', [(oc + 0.3, lim, 71, 0.9), (lim, built, 72, 0.95)], 0.5, att=0.6, rel=0.5)
pin(oc + 0.3, 0.014, px(530)); pin(oc + 0.7, 0.012, px(530))
for i in range(5):
    pin(five + 0.28 * i + 0.1 + 0.04 * R1.uniform(), 0.010, px(420 + 50 * i))
pencil(lim, 0.009, px(530), 0.6)
for i in range(4):
    pencil(built + 0.25 * i, 0.007, px(1100 + 120 * i), 0.5)
halt(stp + 0.1); stamp(stp + 0.6, 0.012, px(1300))
chord(IV, kept, nn + 0.1, 0.45, step=0.2, att=0.8, rel=0.5)
paper(kept + 0.1, 0.010, px(1500), 0.35)
# by noon: the fifth, as the clock goes round and Tom adds the six emails, the top note climbing; that night, home, and the guitar's
# rising third as every check passes
fx = [nn + 0.7 + (i + 1) / 6 * (night - nn - 1.2) for i in range(6)]
chord(V, nn + 0.1, night, 0.5, step=0.2, att=0.6, rel=0.4, top=False)
chord(I, night, board + 0.4, 0.5, step=0.15, att=0.4, rel=0.6, top=False)
line('r', [(nn + 0.3, fx[1], 74, 0.9), (fx[1], fx[3], 76, 0.9), (fx[3], night, 78, 0.95), (night, num, 79, 0.9), (num, board + 0.4, 74, 0.85)], 0.5, att=0.6, rel=0.6)
for i, t in enumerate(fx):
    keys(t - 0.35, 3 + i % 2, 0.006, px(900), 0.11)
green(alln + 0.1)
# Clara knows which numbers to trust: her census numbers ticked one by one, and who answers for each, a gold tag on a thread each
for i in range(4):
    pencil(num + 0.25 * i, 0.008, px(700), 0.3)
for i in range(3):
    tap(who + 0.3 * i + 0.6, 0.008, px(1100 + 200 * i))
# the board: the fourth card lights and lifts, and becomes the title, on the mark over the right hand
knock(board + 0.35, 0.014, px(505), 280); air(board + 1.0, 0.9, 0.008, px(505))
for i, m in enumerate((62, 67)):
    line('r', [(board + 0.4 + 0.2 * i, E('trust') + 0.3, m, 0.9)], 0.5, att=0.8, rel=1.0)
mark(title + 0.3)

# 2. An owner, a dimension, a level: the fourth at the turn; the test's sheet, its line lit, and a pill on a thread for its owner and its
#    dimension; dbt_project.yml, the short-course folders lit and pencilled; builtin.sql, its dimension lit; the test's levels lit and
#    pencilled; the decision, as a card. Jun's pull request: its checks, the governance check stops it, the guitar's low note; the line
#    that gives it an owner typed in, and the check turns green, the rising third, on the home chord through the pause
ow_ = lambda lid, word, off=0: W('owner', lid, word, off)
oc_ = lambda lid, off=0: G('owner', lid, off)
o0 = S0('owner')
chord(IV, o0 + 0.2, o0 + 2.6, 0.5, step=0.15, att=0.6, rel=0.8)
paper(o0 + 0.15, 0.014, px(960), 0.45)
marker(ow_('test', 'a dbt test'), 0.007, px(700), 0.5)
for t in (ow_('test', 'names its owner'), ow_('test', 'its dimension')):
    pencil(t, 0.008, px(1150), 0.6); tap(t + 0.55, 0.008, px(1500))
f_ = oc_('folder', -0.3)
paper(f_ + 0.1, 0.014, px(960), 0.4); marker(ow_('folder', 'from the folder'), 0.007, px(700), 0.5)
marker(ow_('folder', 'short-course data'), 0.007, px(700), 0.5)
for d in (0.3, 0.7):
    pencil(ow_('folder', 'short-course data', d), 0.008, px(1300), 0.8)
k_ = oc_('kind', -0.3)
paper(k_ + 0.1, 0.014, px(960), 0.4); pencil(ow_('kind', 'empty values'), 0.008, px(1200), 0.8)
marker(ow_('kind', 'checks completeness'), 0.007, px(700), 0.5)
marker(ow_('level', 'in the test'), 0.007, px(700), 0.5)
for w_, x_ in (('warn on one', 760), ('stop above five', 760)):
    marker(ow_('level', w_), 0.007, px(700), 0.5); pencil(ow_('level', w_, 0.2), 0.008, px(x_ + 200), 0.8)
knock(oc_('log', -0.2), 0.012, px(960), 260)
marker(ow_('log', 'who chose it'), 0.007, px(900), 0.5); marker(ow_('log', 'and why'), 0.007, px(900), 0.5)
pr, wo, fxo = oc_('in', -0.3), ow_('in', 'without an owner'), ow_('in', 'get in', 0.5)
tap(pr + 0.1, 0.008, px(960))
for i in range(5):
    tap(pr + 0.8 + 0.35 * i, 0.005, px(700))
halt(wo + 0.35); keys(wo + 0.45, 6, 0.006, px(960), 0.18)
keys(fxo, 7, 0.008, px(960), 0.13); tap(fxo + 1.1, 0.007, px(700))
green(fxo + 1.75)
chord(I, fxo + 1.6, E('owner') + 0.3, 0.5, step=0.2, att=0.6, rel=0.8)

# 3. Written from the run: the sixth at the turn, the red night's results; a card for them, an arrow to each script, the scripts typed
#    in and what each wrote; the scorecard laid out, learning's six of seven ringed, the cells that didn't run in grey and pencilled;
#    the issue reaches the learning team, the guitar's falling fifth, on the fourth; what didn't pass, why the level is there, a cause
#    to fill in and a date, lit as they're said
rw_ = lambda lid, word, off=0: W('run', lid, word, off)
rc_ = lambda lid, off=0: G('run', lid, off)
r0 = S0('run')
chord(vi, r0 + 0.2, r0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
two, res = rw_('read', 'two scripts'), rw_('read', "dbt's results")
paper(r0 + 0.5, 0.010, px(400), 0.35); pencil(res, 0.008, px(800), 0.9)
keys(two, 6, 0.007, px(1200), 0.14); keys(two + 0.7, 6, 0.007, px(1200), 0.14)
tap(res + 0.6, 0.007, px(1500)); tap(res + 1.2, 0.007, px(1500))
sc = rc_('scorecard', -0.3)
paper(sc + 0.2, 0.012, px(960), 0.45)
marker(rw_('learning', 'six of seven', -0.3), 0.008, px(500), 0.5)
nrw = rw_('notrun', 'not run')
marker(nrw - 0.2, 0.007, px(1000), 0.6); pencil(nrw, 0.009, px(450), 0.9)
iz = rc_('issue', -0.3)
reach(iz + 0.4)
chord(IV, iz + 0.3, iz + 3.0, 0.45, step=0.2, att=0.6, rel=0.8)
for t in (rw_('issue', 'an issue to answer'), rw_('issue', "what didn't pass"), rw_('issue', 'why the level is there')):
    marker(t, 0.007, px(800), 0.5)
pencil(rw_('due', 'A cause'), 0.008, px(800), 0.6); marker(rw_('due', 'a date to answer by'), 0.007, px(800), 0.5)

# 4. Which check goes where: home at the turn; the data's way on Yusuf's board, a pin at each of the four places as it's named, what
#    each catches set down, a thread from each to the data's owner; prevent, check and watch, each pencilled as it lights its places,
#    check on the fifth and watch home; and in the pause, the four pins lit together
ww_ = lambda lid, word, off=0: W('where', lid, word, off)
wc_ = lambda lid, off=0: G('where', lid, off)
w0 = S0('where')
chord(I, w0 + 0.2, w0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
for t, x_ in ((ww_('one', 'A dbt test'), 1150), (ww_('more', "where it's typed"), 380), (ww_('more', "where it's loaded"), 640), (ww_('more', "the platform's tables"), 900)):
    pin(t, 0.014, px(x_))
ea = ww_('each', 'Each catches')
for i in range(4):
    paper(ea + 0.3 * i, 0.008, px(380 + 260 * i), 0.3)
pencil(ww_('each', "each tells the data's owner"), 0.008, px(1300), 1.0)
pv, ck, wt4 = wc_('prevent'), wc_('check'), wc_('watch')
for t, x_ in ((pv, 380), (ck, 640), (wt4, 900)):
    pencil(t, 0.008, px(x_), 0.6)
chord(V, ck, wt4, 0.42, step=0.15, att=0.6, rel=0.4)
chord(I, wt4, E('where') + 0.3, 0.45, step=0.12, att=0.4, rel=0.8)
for i in range(4):
    tap(wc_('breath', 0.1) + 0.05 * i, 0.005, px(380 + 260 * i))

# 5. Where it's typed: the fourth at the turn; the email as typed, the clean-up lit, and the pencil note; from 2 November, the sign-up
#    form: an email typed, trimmed as it's typed, and ticked, the rising third; the test on the source, lit, its red pill, and "should
#    never fail" in pencil; the requirement pinned, and once the old emails are corrected, the clean-up struck through and the test's
#    since, home
yw_ = lambda lid, word, off=0: W('typed', lid, word, off)
yc_ = lambda lid, off=0: G('typed', lid, off)
y0 = S0('typed')
chord(IV, y0 + 0.2, y0 + 2.6, 0.5, step=0.15, att=0.6, rel=0.8)
ev = yw_('cleaned', 'every night')
paper(y0 + 0.3, 0.010, px(960), 0.4); marker(ev, 0.007, px(700), 0.5); pencil(ev, 0.008, px(1300), 1.0)
paper(yw_('cleaned', 'cleaned them'), 0.008, px(960), 0.35)
cke = yw_('form', 'checks each email')
keys(cke, 10, 0.006, px(1340), 0.16); green(cke + 1.75); tap(cke + 2.0, 0.007, px(1500))
src = yc_('source', -0.3)
paper(src + 0.1, 0.012, px(960), 0.4)
marker(yw_('source', 'A test on the source'), 0.007, px(500), 0.5); marker(yw_('source', 'recorded since'), 0.007, px(900), 0.5)
knock(yw_('source', 'stops the build'), 0.010, px(450), 260)
pencil(yw_('never', 'should never fail'), 0.009, px(900), 0.8); pencil(yw_('never', 'the form has broken'), 0.008, px(900), 0.6)
gs = yc_('goes', -0.3)
pin(gs + 0.2, 0.012, px(1500))
strike(yw_('goes', 'the clean-up goes'), 0.010, px(600), 0.8); strike(yw_('goes', 'checks every row'), 0.010, px(500), 0.7)
chord(I, yw_('goes', 'checks every row', -0.2), E('typed') + 0.3, 0.45, step=0.15, att=0.6, rel=0.8)

# 6. Where it's loaded: the third at the turn; the platform team's pipeline, each system's files flowing into its tables; the
#    pipeline's file, an expectation lit on each table; at the enrolments' door, the rows going through, and the two with no ID kept
#    out: the guitar's low note, and their count; the count reaches the learning team in its issue, the falling fifth; and the two given
#    their IDs where they're kept, the rising third
lw_ = lambda lid, word, off=0: W('loaded', lid, word, off)
lc_ = lambda lid, off=0: G('loaded', lid, off)
l0 = S0('loaded')
chord(iii, l0 + 0.2, l0 + 2.6, 0.5, step=0.15, att=0.6, rel=0.8)
air(lw_('loads', "each system's files", -0.3), 2.0, 0.008, px(960))
ex, rl = lc_('expect', -0.3), lw_('expect', 'rules on each table')
paper(ex + 0.1, 0.012, px(960), 0.4)
for i in range(3):
    marker(rl + 0.3 * i, 0.006, px(800), 0.4)
ap, kp = lc_('apart', -0.3), lw_('apart', 'kept out')
for i in range(4):
    slide(ap + 0.3 + 0.5 * i, 0.006, px(500 + 150 * i), 0.5)
halt(kp + 0.2); pencil(kp + 1.2, 0.008, px(1100), 0.5)
re_ = lc_('reaches', -0.3)
reach(re_ + 0.4)
marker(lw_('reaches', 'reaches its owner'), 0.007, px(800), 0.5)
fxl = lw_('reaches', "fixed where it's kept")
keys(fxl + 0.2, 4, 0.007, px(1340), 0.15); keys(fxl + 1.2, 4, 0.007, px(1340), 0.15)
green(fxl + 2.3)

# 7. What no rule names: the sixth at the turn, one night; the new badges come in, half with no credit lit; credit_points' tests ticked,
#    and "no rule for it"; the badges' quality page, its alert, what the platform learns, the profile drawn, the usual band and that
#    night's point; the alert crosses the campus without words, on the fourth, and reaches the learning team, the falling fifth, home;
#    the next morning, Tom reads it; the test it became typed in, and the decision stamped
aw_ = lambda lid, word, off=0: W('watch', lid, word, off)
ac_ = lambda lid, off=0: G('watch', lid, off)
a0 = S0('watch')
chord(vi, a0 + 0.2, a0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
for i in range(6):
    tap(a0 + 0.35 + 0.2 * i + 0.05 * R1.uniform(), 0.005, px(500 + 180 * i))
marker(aw_('half', 'no credit'), 0.007, px(960), 0.5)
ps = ac_('passed', -0.3)
paper(ps + 0.1, 0.012, px(960), 0.4); pencil(aw_('passed', 'Every test passed'), 0.008, px(700), 0.4)
pencil(aw_('passed', 'no rule said'), 0.009, px(1300), 0.7)
knock(aw_('caught', 'caught it'), 0.010, px(1300), 280)
tap(aw_('learns', 'learns when'), 0.007, px(1500))
pf, cn = aw_('profile', 'a profile'), aw_('profile', 'counts, each night')
paper(pf, 0.010, px(960), 0.35); pencil(cn, 0.007, px(900), 1.6)
marker(aw_('profile', 'usually one in twelve'), 0.006, px(900), 0.6)
tw2 = aw_('two', 'one in two')
tap(tw2, 0.008, px(1400)); knock(tw2 + 0.6, 0.010, px(1500), 300)
al = ac_('alert', -0.3)
air(al + 0.4, 3.4, 0.008, px(1200))
chord(IV, al + 0.2, al + 3.9, 0.45, step=0.25, att=0.9, rel=0.4)
reach(al + 3.85)
chord(I, al + 3.9, al + 5.8, 0.45, step=0.1, att=0.4, rel=0.9)
bc = ac_('became', -0.3)
tap(bc - 2.1, 0.007, px(1340))
keys(aw_('became', 'became a test'), 6, 0.007, px(700), 0.15)
stamp(aw_('became', 'confirmed it', 0.3), 0.012, px(1500)); tap(aw_('became', 'confirmed it', 0.4), 0.006, px(1400))

# 8. One scorecard: home at the turn; the platform's results come in, a row at a time, and the table column lit; the scorecard, the
#    platform's table under the tests', each table's owner from the project; a thread from each result to one owner, the shared inbox
#    struck through, and the falling fifth; measured, not surveyed: the survey struck, and last night's 160 of 160, the rising third,
#    on the home chord; the governance check's measures lit
cw_ = lambda lid, word, off=0: W('card', lid, word, off)
cc_ = lambda lid, off=0: G('card', lid, off)
c0 = S0('card')
chord(I, c0 + 0.2, c0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
ld = cw_('land', 'land on the platform')
for i in range(5):
    tap(ld - 0.3 + 0.32 * i, 0.005, px(960))
marker(cw_('land', 'by table'), 0.007, px(600), 0.5)
on = cw_('reads', 'owner is in the project')
paper(on - 0.3, 0.012, px(960), 0.4); marker(on + 0.3, 0.007, px(1300), 0.6); marker(cw_('reads', 'the scorecard reads them'), 0.007, px(900), 0.6)
sh, one = cw_('inbox', 'not a shared inbox'), cw_('inbox', 'reaches one owner')
for i in range(3):
    pencil(one + 0.25 * i, 0.007, px(900 + 200 * i), 0.9)
strike(sh, 0.010, px(500), 0.6)
reach(one + 1.0)
ns = cw_('measured', 'not surveyed')
strike(ns, 0.010, px(500), 0.6); tap(ns + 0.3, 0.006, px(300))
t160 = cw_('measured', 'a hundred and sixty of')
green(t160 + 0.3); chord(I, t160 + 0.2, t160 + 3.2, 0.42, step=0.15, att=0.6, rel=0.8)
pencil(cw_('platform', 'twenty-two checks'), 0.008, px(1300), 0.5)
od = cw_('platform', 'every test had an owner')
tap(od, 0.007, px(960)); marker(od + 0.6, 0.007, px(900), 0.5)

# 9. Rules, and monitoring for the rest: home at the turn; this morning, Clara opens the scorecard; one amber cell ringed, and its row
#    under Not passed lit; Tom's list to follow up; a gold pin on each domain; Clara's numbers ticked and who answers for each, home,
#    the top note rising; the data's way, its three words pencilled; the next film's card lifts; and the end card, on the mark, the
#    right hand held to the end
zw_ = lambda lid, word, off=0: W('close', lid, word, off)
zc_ = lambda lid, off=0: G('close', lid, off)
z0 = S0('close')
chord(I, z0 + 0.2, z0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
op = zw_('opens', 'opens the scorecard')
tap(op, 0.008, px(400)); marker(op + 0.8, 0.007, px(390), 0.5)
paper(zc_('amber', -0.2), 0.010, px(960), 0.4); marker(zw_('amber', 'One amber cell'), 0.008, px(450), 0.5)
marker(zw_('amber', 'no email'), 0.007, px(960), 0.6); tap(zw_('amber', 'the learning team'), 0.007, px(1340))
owc = zw_('else', 'every cell has an owner')
for i in range(4):
    pin(owc + 0.35 * i, 0.010, px(250))
kn, nm, whz = zc_('knows', -0.3), zw_('knows', 'which numbers to trust'), zw_('knows', 'who answers for each')
for i in range(4):
    pencil(nm + 0.25 * i, 0.008, px(700), 0.3)
for i in range(3):
    tap(whz + 0.3 * i + 0.6, 0.008, px(1100 + 200 * i))
chord(I, kn + 0.1, kn + 3.8, 0.45, step=0.2, att=0.7, rel=0.9, top=False)
line('r', [(kn + 0.3, whz, 71, 0.9), (whz, kn + 3.8, 74, 0.9)], 0.45, att=0.6, rel=0.9)
rw, mn = zw_('last', 'Rules you write'), zw_('last', 'monitoring for the rest')
pencil(rw, 0.008, px(380), 0.5); pencil(rw + 0.3, 0.008, px(640), 0.5); pencil(mn, 0.008, px(900), 0.5)
bd, end = zc_('breath', -0.3), zc_('breath', 1.6)
knock(bd + 0.55, 0.010, px(960), 280); air(bd + 0.6, 0.9, 0.006, px(960))
for i, m in enumerate((62, 67)):
    line('r', [(end - 0.2 + 0.2 * i, TOT, m, 0.9)], 0.5, att=0.9, rel=0.6)
mark(end + 0.6)
soften(2600)
