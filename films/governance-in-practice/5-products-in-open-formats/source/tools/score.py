# Products in open formats: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (checked against the prologue, Governance principles and Governance on the map, and against this
# series' other films, so none repeats): a lute, plucked close, one string to a note, and a soft synthesiser, a plain sine-and-triangle
# voice with a slow attack, playing the same lines with it: the same music read by an old instrument and a new one, as the same file is
# read by any tool. Both are made here (music.py's lute is tuned equal, and it has no synthesiser like this), played softly, so nothing
# rings above the voice.
#  - The two play the chords under the opening, as Noor and Clara go over Clara's product, from the six products on Noor's board to
#    the promises typed by hand, the column the catalogue promised and the table no longer had, Anil's report on census day and every
#    promise typed again, and on to the files in open standards that came instead; after it, only at a chapter's turn, under a moment
#    on screen or in a pause without words.
#  - The lute's marks mean the same all through: two notes rising a fourth when a file is written; a note the synthesiser joins on the
#    same pitch, in unison, when another tool reads a file; and a single low note when a change is stopped.
#  - The opening's problem is in the chords: the memory on the sixth; the column that's gone, a note outside the chord, the ninth; Anil's
#    report on a hollow fifth, and as it breaks the ninth left alone; every promise typed again on the fourth, never coming home.
#    "Something had to change" stops it, and the files come in on the home chord, a note at a time.
#  - The series' mark, four notes, 1-5-4-8, on the lute with the synthesiser an octave below, under the title and the end card.
#  - F major all through.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, and after it only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the
#    opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: each note is one voice, with no second voice a little out of tune beside it, no vibrato and no
#    chorus; the lute's notes are single strings, never a pair; the synthesiser is tuned exactly with the lute, and moves from note to
#    note as one voice, the old note fading as the new one comes in 40 ms, with no slide. Every chord is tuned pure (just intonation,
#    see hz()), and G is never held with B flat or D (their intervals aren't pure here), so the chords used are F, B flat, C, D minor
#    and A minor, and a line over B flat or D minor never sits on G.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in
#    src/scenes.js (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz: keys, a card pinned, paper laid down or folded, a pencil, a highlighter, a
# stamp, a book set down.

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
R1 = np.random.default_rng(25)  # this film's own randomness: the room, the plucks, the paper, the keys

# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other and nothing beats. The chords used
# are I, IV, V, vi and iii, whose fifths and thirds are all pure in this table; G is never held with B flat or D (a Pythagorean third
# and a wolf fifth, both here)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (41, 87.3071)  # F 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords, as (the bass, (the notes above it, lowest first)), one voice to a note
I, IV, V, vi, iii = (41, (57, 60, 65)), (46, (58, 62, 65)), (48, (60, 64, 67)), (38, (57, 62, 65)), (45, (57, 60, 64))

# ---- the levels: the two sit about as far under the voice as the series' other films' music (matched by loudness, not by peak); the
# lute a little over the synthesiser, as it's played close; the effects about 12 dB under the music (FX scales them all)
SL, LL, FX = 0.03, 0.055, 1.6
PAN = {'s': -0.14, 'l': 0.16}  # the synthesiser a little left of centre, the lute a little right

# a small room of wood and plaster round the players, ringing on for about a second and a half
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.4)).astype(np.float32))(np.arange(int(1.4 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())

# ---- the synthesiser: one plain voice, a sine with a triangle under it (its odd harmonics, falling as 1/k squared), nothing above
# about 2.4 kHz. A note swells in slowly and fades as it's let go; a long one swells a little and eases, once; the pitch never moves
def _syn(f):
    """the weights of a note's harmonics on the synthesiser, at f Hz"""
    n = max(1, int(2400 // f)); k = np.arange(1, n + 1)
    a = np.where(k % 2 == 1, 0.5 / k ** 2, 0.0); a[0] += 1.0
    a = a * np.clip((2400 - f * k) / 300, 0, 1)
    return a / np.sqrt((a ** 2).sum())
def sline(segs, g=1.0, att=0.5, rel=0.6, room=0.3, pan=None):
    """the synthesiser's line: segs is [(start, end, note, level)], each note the next as the last fades, with no slide; a rest (note
    None) lets go"""
    run = []
    for s in list(segs) + [(None, None, None, 0)]:
        if s[2] is None:
            if run:
                _sline(run, g, att, rel, room, PAN['s'] if pan is None else pan)
            run = []
        else:
            run.append(s)
def _sline(segs, g, att, rel, room, pan):
    T0, T1 = segs[0][0], segs[-1][1]; xf = 0.04
    n = int((T1 - T0 + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > T1 - T0, np.cos(0.5 * np.pi * np.minimum((x - (T1 - T0)) / rel, 1)) ** 2, 1.0)
    s = np.zeros(n)
    for i, (a, b, m, v) in enumerate(segs):  # the next note: this one fades as that one comes in, in 40 ms
        p0 = 0 if i == 0 else max(0, int((a - T0 - xf / 2) * SR)); p1 = n if i == len(segs) - 1 else min(n, int((b - T0 + xf / 2) * SR))
        xs, f = x[p0:p1], hz(m); w = np.full(p1 - p0, float(v))
        if i:
            w *= np.sin(0.5 * np.pi * np.clip((xs - (a - T0 - xf / 2)) / xf, 0, 1)) ** 2
        if i < len(segs) - 1:
            w *= np.cos(0.5 * np.pi * np.clip((xs - (b - T0 - xf / 2)) / xf, 0, 1)) ** 2
        if b - a >= 0.95:  # a long note swells a little and eases, once
            w *= 0.86 + 0.14 * np.sin(np.pi * np.clip((xs - (a - T0)) / (b - a), 0, 1))
        else:
            w *= 0.86
        for j, aj in enumerate(_syn(f)):
            if aj > 1e-4:
                s[p0:p1] += aj * w * e[p0:p1] * np.sin(2 * np.pi * f * (j + 1) * xs + (np.pi if j % 4 == 2 else 0))
    s = filt(s.astype(np.float32), 'low', 2400)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), T0, g * SL, pan)

# ---- the lute: gut strings, plucked with the flesh of a finger near the rose, close and soft. Each note is one string: its upper
# harmonics softer than a steel string's and quick to die, those the pluck point can't start missing; it rings, then the hand damps it.
# Its light body's air rings near 115 Hz, its top near 260 and 520 Hz; nothing above about 2.4 kHz. It sits a little right
LB = [(115, 40, 0.8), (260, 90, 1.0), (520, 200, 0.55)]
def lute(m, s, g=1.0, pan=None, ring=1.8):
    f = hz(m); sec = ring + 0.45; x = tt(sec); sig = np.zeros(len(x)); d1 = 1.1 * (175 / f) ** 0.4
    for k in range(1, int(2400 // f) + 1):
        fk = f * k; dk = d1 / (1 + 0.6 * (k - 1) ** 1.2)
        a = abs(np.sin(np.pi * k * 0.17)) / k ** 1.25 * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in LB) + 0.3)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.6 * k * k) * (0.6 * np.exp(-x / (0.2 * dk)) + 0.4 * np.exp(-x / dk))
    sig = sig * np.minimum(1, x / 0.004) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.4, 1)) ** 2, 1.0)
    sig = sig + 0.05 * filt(noise(sec)[:len(x)], 'band', (120, 800)) * np.exp(-x / 0.006)  # the fingertip on the string
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    sig = np.pad(sig, (0, len(_IR) - 1)) + 0.2 * fftconvolve(sig, _IR).astype(np.float32)
    put(sig.astype(np.float32), s, g * LL, PAN['l'] if pan is None else pan)

# ---- the two together
def duo(segs, g=1.0, att=0.5, rel=0.6, lute_g=0.85):
    """a line both play: the lute plucks each note as it comes, and the synthesiser holds it, moving to the next with no slide"""
    sline(segs, g, att=att, rel=rel)
    for a, b, m, v in segs:
        if m is not None:
            lute(m, a, g * v * lute_g, ring=min(2.2, max(0.9, b - a)))
def chord(c, a, b, g=0.6, step=0.12, att=0.3, rel=0.4, top=True):
    """a chord both play: the lute rolls it, the bass first and then the notes above a moment apart, lowest first, and the
    synthesiser holds each note. c is (bass, (notes above)); top=False leaves out the top note, when a line plays above it"""
    bs, rh = c
    for i, m in enumerate((bs,) + tuple(rh if top else rh[:-1])):
        sline([(a + step * i, b, m, 1.0 if i == 0 else 0.9)], g, att=att, rel=rel)
        lute(m, a + step * i, g * (0.8 if i == 0 else 0.7), ring=min(2.4, max(1.0, b - a - step * i)))
def written(s, g=0.85):
    """a file is written: the lute's two notes rising a fourth, C to F"""
    lute(72, s, g); lute(77, s + 0.2, g * 0.9, ring=2.0)
def reads(s, m=69, g=0.8, sec=2.0):
    """another tool reads a file: the lute plucks a note, and the synthesiser joins it on the same pitch, in unison"""
    lute(m, s, g, ring=sec); sline([(s + 0.04, s + sec, m, 1.0)], g * 0.9, att=0.18, rel=0.8)
def halt(s, g=1.45):
    """a change is stopped: a single low note, the lute's lowest string, F"""
    lute(41, s, g, ring=2.4)
def mark(s, g=1.45, step=0.42):
    """the series' mark, 1-5-4-8: the lute, and the synthesiser an octave below"""
    for i, m in enumerate([65, 72, 70, 77]):
        lute(m, s + step * i, g * (0.8 if i == 3 else 0.7), ring=2.4 if i == 3 else 1.2)
    sline([(s, s + step, 53, 1.0), (s + step, s + 2 * step, 60, 1.0), (s + 2 * step, s + 3 * step, 58, 1.0), (s + 3 * step, s + 3 * step + 1.8, 65, 1.0)],
          g, att=0.06, rel=0.8)

# ---- soft sounds on the desks, boards and screens, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
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
def fold(s, g=0.016, pan=0.0):
    """a sheet folded: two soft creases, each pressed flat"""
    for d, gg in ((0.0, 1.0), (0.18, 0.8)):
        x = tt(0.22); X(filt(noise(0.22), 'band', (400, 2200))[:len(x)] * np.minimum(1, x / 0.004) * np.exp(-x / 0.05), s + d, g * gg * FX, pan)
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
def book(s, g=0.02, pan=0.0):
    """a book set down: its cover meeting the desk, a padded clap, and a breath of air pushed out"""
    x = tt(0.3); X(norm(filt((np.sin(2 * np.pi * 150 * x) * np.exp(-x * 30) + 0.6 * filt(noise(0.3), 'band', (150, 900))[:len(x)] * np.exp(-x * 40)).astype(np.float32), 'low', 1200)), s, g * FX, pan)
    s_air(s + 0.02, 0.35, g * 0.4 * FX, pan, 200, 900)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)

# =============================================================================================================================
# 1. A promise in a file: the opening, under the two all through. Noor's room, the home chord, the top line rising as Noor and Clara
#    go over Clara's product; her board, the six products pinned one by one, on the fourth, and home as each owner comes; Clara's card
#    forward, on the fifth, home on "ready by seven". Until now, in Noor's memory: the sixth, softer; the promise typed by hand, keys,
#    and the table beside it changing week by week, the top line stepping down; the column the catalogue promised and the table no
#    longer had, the top line left on the ninth, a note outside the chord. Anil's report on census day: the chord thins to a hollow
#    fifth, the ninth above it, and as the report breaks the ninth is left alone. Every catalogue its own format: the fourth, never
#    coming home, the top line climbing as every promise is typed again. "Something had to change" stops it. Now: the home chord, a
#    note at a time, as the project's folders are pinned, its files laid out, each standard's tag a step higher; the contract written
#    from the model, on the fourth, the rising fourth as it's written, and as a change that would break it is stopped, everything lets
#    go and the lute's low note in the quiet. Jun's column: home, the rising fourth as its contract grows by a line, and the reports that
#    read it ticked; the ten tables, on the fifth, ticked; whichever catalogue shows them: home, and as the two catalogues read the same
#    file, the synthesiser joins the lute on each; and the title, on the mark
pw = lambda lid, word, off=0: W('promise', lid, word, off)
pc = lambda lid, off=0: G('promise', lid, off)
cards, des, own = pw('room', 'Noor and Clara'), pc('designs', -0.3), pw('designs', 'an owner who keeps it')
cl, cnt, rdy = pc('clara'), pw('clara', 'the count'), pw('clara', 'ready by seven')
ty, hand, wk = pc('typed', -0.3), pw('typed', 'typed by hand'), pw('typed', 'the tables changed')
col, gone = pw('column', 'a column'), pw('column', 'no longer had')
cen, brk = pc('census', -0.3), pw('census', 'could break')
fm, chgc, again, chg = pc('format', -0.3), pw('format', 'change the catalogue'), pw('format', 'every promise is typed again'), pc('change')
now, code, std = pc('now', -0.3), pw('now', 'kept with the code'), pw('now', 'two open standards')
pd, ct = pw('pair', 'one for the product'), pw('pair', "its table's contract")
wr, frm, dis, stp = pc('written', -0.3), pw('written', 'written from'), pw('written', "can't disagree"), pw('written', 'a change that would break it')
jun, grew, nob = pc('jun', -0.3), pw('jun', 'its contract grew'), pw('jun', 'no report broke')
tn, prom, chk = pc('ten', -0.3), pw('ten', 'have a promise'), pw('ten', 'checked on every change')
st, stays, uni = pc('stay', -0.3), pw('stay', 'the promises stay'), pw('stay', "the university's")
board, title = pc('breath', -0.3), pc('breath', 1.2)
# Noor's room: the home chord, the bass first; the top line rises as they go over Clara's product. Her board: each of the six products
# pinned as it comes, on the fourth; home as their owners are written in; Clara's card forward, on the fifth, its owner lit and its
# promise written, home on "ready by seven"
chord(I, 0.3, des + 0.5, 0.7, step=0.3, att=0.8, top=False)
chord(IV, des + 0.5, own, 0.65, step=0.12, att=0.5, top=False)
chord(I, own, cl + 0.1, 0.65, step=0.12, att=0.5, top=False)
chord(V, cl + 0.1, rdy, 0.6, step=0.12, att=0.5, top=False)
chord(I, rdy, ty + 0.2, 0.6, step=0.12, att=0.5, top=False)
duo([(1.0, cards, 69, 1.0), (cards, des + 0.5, 72, 1.0), (des + 0.5, own, 74, 0.95), (own, cl + 0.1, 72, 0.95), (cl + 0.1, rdy, 76, 0.9), (rdy, ty + 0.2, 77, 0.9)], 0.6, att=0.6)
for i in range(6):
    pin(des + 1.05 + 0.3 * i, 0.010, px([505, 960, 1415][i % 3]))
pencil(own, 0.007, px(960), 0.9)
air(cl + 0.1, 1.2, 0.008, px(1100))
marker(cnt, 0.007, px(760), 0.5); pencil(rdy, 0.008, px(900), 0.7)
# until now, in Noor's memory: the sixth, softer; the promise typed into the catalogue by hand; the table beside it, week by week, the
# top line stepping down; the column it promised, gone: the top line on the ninth, outside the chord. Anil's report: the third leaves,
# a hollow fifth under the ninth, and as the report breaks the fifth lets go and the ninth is left alone. Every catalogue its own
# format: the fourth, the top line never coming home, climbing as every promise is typed again; "Something had to change" stops it
sline([(ty + 0.2, brk + 0.6, 38, 1.0)], 0.55, att=0.8, rel=1.2); lute(38, ty + 0.2, 0.45, ring=2.4)
sline([(ty + 0.4, brk + 0.6, 57, 0.9)], 0.5, att=0.8, rel=1.2); lute(57, ty + 0.4, 0.4, ring=2.0)
sline([(ty + 0.6, cen + 0.3, 65, 0.9)], 0.5, att=0.8, rel=0.8); lute(65, ty + 0.6, 0.4, ring=2.0)
duo([(ty + 0.4, wk, 72, 0.9), (wk, col, 69, 0.9), (col, fm + 0.3, 76, 0.95), (fm + 0.3, chgc, 74, 0.9), (chgc, again, 72, 0.9), (again, again + 1.4, 74, 0.9),
     (again + 1.4, chg + 0.6, 77, 0.95)], 0.55, att=0.6, rel=0.5)
chord(IV, fm + 0.3, chg + 0.6, 0.5, step=0.15, att=0.8, rel=0.5, top=False)
keys(hand, 10, 0.006, px(560), 0.3)
for i in range(5):
    tap(wk + 0.25 + 0.48 * i, 0.006, px(1300))
marker(col, 0.007, px(500), 0.5); pencil(gone, 0.009, px(560), 0.5)
knock(brk, 0.010, px(1300), 200)
strike(chgc + 0.3, 0.010, px(560), 0.6)
for i in range(3):
    keys(again + 1.2 * i, 5, 0.006, px(1400), 0.18)
# now: the home chord, a note at a time; the project's folders pinned; its two files laid out, and each standard's tag a step higher
chord(I, now + 0.1, wr + 0.2, 0.6, step=0.25, att=0.7, top=False)
duo([(code, pd, 69, 0.9), (pd, ct, 72, 0.95), (ct, wr + 0.2, 74, 0.9)], 0.5, att=0.4, rel=0.6)
pin(code, 0.012, px(320))
paper(std, 0.012, px(1240), 0.45); paper(std + 0.6, 0.012, px(1240), 0.45)
tap(pd, 0.007, px(1700)); tap(ct, 0.007, px(1700))
# the contract written from the model: the fourth, the rising fourth as it's written, the threads drawn; a change that would break it
# is stopped: everything lets go, and the lute's low note in the quiet
chord(IV, wr + 0.2, stp + 0.6, 0.55, step=0.12, att=0.4, top=False)
sline([(wr + 0.3, stp + 0.6, 74, 0.9)], 0.45, att=0.5, rel=0.4)
written(frm + 0.3)
for k in range(3):
    pencil(dis - 0.4 + 0.47 * k, 0.007, px(960), 0.4)
tap(stp + 0.1, 0.007, px(960))
halt(stp + 0.75)
# Jun's column: home; the rising fourth as its contract grows by a line; its readers ticked, one by one
chord(I, jun + 0.1, tn + 0.2, 0.55, step=0.2, att=0.6, top=False)
written(grew + 0.3)
tap(jun + 0.4, 0.006, px(200))
for i in range(3):
    pencil(nob + 0.3 * i, 0.007, px(1590), 0.25)
# the ten tables other teams read, each listed and ticked, checked on every change: the fifth, the top line climbing
chord(V, tn + 0.1, st + 0.1, 0.5, step=0.15, att=0.5, top=False)
duo([(tn + 0.3, prom, 72, 0.85), (prom, chk, 76, 0.9), (chk, st + 0.1, 79, 0.9)], 0.45, att=0.5, rel=0.5)
for i in range(5):
    tap(tn + 0.25 + 0.32 * i, 0.005, px(600 + 180 * i))
for i in range(4):
    pencil(prom + 0.4 * i, 0.006, px(300 + 600 * (i % 2)), 0.25)
marker(chk, 0.007, px(700), 0.5)
# whichever catalogue shows them: home; the two catalogues laid out, and as each reads the same file the synthesiser joins the lute on
# its note; the university's, in gold
chord(I, st + 0.1, board + 0.4, 0.5, step=0.15, att=0.4, top=False)
sline([(st + 0.2, board + 0.4, 77, 0.85)], 0.4, att=0.6, rel=0.6)
paper(st + 0.2, 0.012, px(530), 0.4); paper(st + 0.6, 0.012, px(1390), 0.4)
reads(stays + 0.45, 69); reads(stays + 0.7, 72)
pencil(uni, 0.008, px(960), 1.0)
# the board: the fifth card lights and lifts, and becomes the title, on the mark over the held notes
knock(board + 0.35, 0.014, px(960), 280); air(board + 1.0, 0.9, 0.008, px(960))
for i, m in enumerate((60, 65)):
    sline([(board + 0.4 + 0.2 * i, E('promise') + 0.3, m, 0.9)], 0.5, att=0.8, rel=1.0)
mark(title + 0.3)

# 2. Written by its owner: the fourth at the turn; Clara's file laid down, "written by its owner" in pencil and the rising fourth; each
#    part lit as it's named; then Clara at her desk: the data team's tag on its thread, then hers, in gold, and home under them
ow_ = lambda lid, word, off=0: W('owner', lid, word, off)
oc_ = lambda lid, off=0: G('owner', lid, off)
o0 = S0('owner')
chord(IV, o0 + 0.2, o0 + 2.6, 0.5, step=0.15, att=0.6, rel=0.8)
paper(o0 + 0.3, 0.014, px(960), 0.45)
wro = ow_('file', 'its owner writes')
pencil(wro, 0.009, px(1500), 0.8); written(wro + 0.4)
for w_ in ('what the product is for', 'how to use it'):
    marker(ow_('for', w_), 0.007, px(800), 0.5)
for w_ in ('as its owner', 'the table it offers', 'its service levels', 'ready by seven'):
    marker(ow_('names', w_), 0.007, px(900), 0.5)
marker(oc_('ask', 0.2), 0.007, px(900), 0.5)
dt_, clk = ow_('keeps', 'The data team builds'), ow_('keeps', 'Clara keeps')
pencil(dt_, 0.008, px(600), 0.6); tap(dt_ + 0.5, 0.007, px(560))
pencil(clk, 0.008, px(900), 0.6); tap(clk + 0.5, 0.007, px(880)); marker(clk + 0.1, 0.007, px(700), 0.5)
chord(I, clk - 0.2, E('owner') + 0.3, 0.45, step=0.2, att=0.7, rel=0.9, top=False)
sline([(clk, E('owner') + 0.3, 69, 0.9)], 0.4, att=0.6, rel=0.9)

# 3. The contract, from the model: the sixth at the turn; what the contract promises, in pencil, line by line; a pencil that stops
#    short; the generated tag; the script writes it, the rising fourth, its two sources laid down, the standard's tag; each line of the
#    model threaded to its line. Jun's pull request: edited by hand, the products check fails, the low note; made in the model and the
#    script run, it's written again, the rising fourth, and passes, home to the end
cw_ = lambda lid, word, off=0: W('contract', lid, word, off)
cc_ = lambda lid, off=0: G('contract', lid, off)
c0 = S0('contract')
chord(vi, c0 + 0.2, c0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
for w_ in ('each column', 'its type', 'always there', 'identify a person', 'the tests it must pass'):
    pencil(cw_('each', w_), 0.008, px(700), 0.5)
nb_ = cc_('nobody')
tap(nb_ + 1.0, 0.006, px(940)); tap(cw_('nobody', 'types it', 0.3), 0.007, px(1700))
scr = cw_('script', 'A script writes it')
tap(scr, 0.007, px(600)); written(scr + 0.4)
mdl = cw_('script', 'from the model')
paper(mdl + 0.4, 0.012, px(480), 0.4); paper(mdl + 0.8, 0.010, px(480), 0.4)
tap(cw_('script', 'Open Data Contract Standard'), 0.006, px(1600))
sd = cw_('side', 'each line')
for k in range(5):
    pencil(sd + 0.3 * k, 0.006, px(960), 0.5)
pr_, fl_, rl_ = cc_('check', -0.3), cw_('check', 'a check fails'), cw_('check', "breaks the standard's rules")
tap(pr_ + 0.1, 0.008, px(960)); pencil(pr_ + 0.6, 0.008, px(1500), 0.7)
for i in range(5):
    tap(fl_ + 0.1 * i, 0.005, px(400 + 230 * i))
halt(fl_ + 0.55)
pencil(rl_ - 0.1, 0.008, px(1400), 0.8)
written(rl_ + 0.4)
marker(rl_ + 1.2, 0.007, px(700), 0.5)
chord(I, rl_ + 0.2, E('contract') + 0.3, 0.45, step=0.15, att=0.6, rel=0.8)

# 4. Every shared table, in one product: the fourth at the turn; the data team's thirty-three tables put up; the ten other teams read,
#    lit; the six products, each of the ten flying to its own. Jun's pull request: a shared table in no product stops it, the low note;
#    a product takes it in, its file written, the rising fourth; and it passes, home to the end
hw_ = lambda lid, word, off=0: W('shared', lid, word, off)
hc_ = lambda lid, off=0: G('shared', lid, off)
h0 = S0('shared')
chord(IV, h0 + 0.2, h0 + 2.6, 0.5, step=0.15, att=0.6, rel=0.8)
for i in range(4):
    pin(h0 + 0.5 + 0.45 * i, 0.008, px(400 + 330 * i))
marker(hw_('ten', 'ten are read'), 0.007, px(960), 0.6)
one = hw_('ten', 'each is in exactly one')
knock(one + 0.2, 0.010, px(505), 260); knock(one + 0.5, 0.010, px(1415), 260); air(one + 0.4, 1.8, 0.008, px(960))
pin(hw_('ten', 'six products'), 0.010, px(960))
tap(hc_('same', 0.3), 0.007, px(960))
np_, tk = hw_('new', 'in no product'), hw_('new', 'until a product takes it in')
halt(np_ + 0.6)
written(tk + 0.5)
marker(tk + 2.4, 0.007, px(700), 0.5)
chord(I, tk + 1.7, E('shared') + 0.3, 0.45, step=0.15, att=0.6, rel=0.8)

# 5. A change that would break it: the sixth at the turn; the model's line renamed, keys, and the contract follows by itself, the
#    rising fourth; the census dashboard set down, its thread struck; the rename's pull request, the impact check fails, the low note;
#    on the board, version 1 pinned, a date to go in pencil and ringed, version 2 slid in beside it; credentials' two versions, the first's
#    date ringed, its contract stamped deprecated; and better, add: Jun's column again, the rising fourth, every reader ticked, home
bw_ = lambda lid, word, off=0: W('break', lid, word, off)
bc_ = lambda lid, off=0: G('break', lid, off)
b0 = S0('break')
chord(vi, b0 + 0.2, b0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
keys(bw_('follows', 'a model changes'), 5, 0.007, px(400), 0.15)
written(bw_('follows', 'its contract follows', 0.4))
knock(bc_('some', 0.1), 0.010, px(1560), 260); strike(bw_('some', 'break the readers', 0.3), 0.010, px(1450), 0.5)
tap(bc_('rename', -0.2), 0.008, px(960))
halt(bw_('rename', 'the impact check fails', 0.5))
marker(bw_('rename', "it's breaking"), 0.007, px(700), 0.5); marker(bw_('rename', 'needs a new version'), 0.007, px(700), 0.5)
sy_ = bc_('stays', -0.3)
pin(sy_ + 0.3, 0.012, px(560)); pin(sy_ + 0.9, 0.010, px(460))
dt5 = bw_('stays', 'a date to go')
pencil(dt5, 0.008, px(820), 0.8)
nw5 = bw_('stays', 'the new one goes beside it')
slide(nw5, 0.010, px(1300), 0.8); pin(nw5 + 0.8, 0.012, px(1360))
tw5 = bc_('two', -0.3)
paper(tw5 + 0.2, 0.012, px(640), 0.4)
marker(bw_('two', 'has two'), 0.007, px(500), 0.5); pencil(bw_('two', 'thirty-first'), 0.008, px(700), 0.8)
paper(bw_('two', 'its contract says', 0.2), 0.012, px(1300), 0.4)
stamp(bw_('two', 'deprecated', 0.2), 0.012, px(1300)); pencil(bw_('two', 'on its way out'), 0.008, px(1500), 0.7)
tap(bc_('add', 0.1), 0.006, px(300))
nc_ = bw_('add', 'a new column')
written(nc_ + 0.4)
nb5 = bw_('add', 'breaks nobody')
for i in range(3):
    pencil(nb5 + 0.3 * i, 0.007, px(1590), 0.25)
chord(I, nb5, E('break') + 0.3, 0.45, step=0.15, att=0.6, rel=0.8)

# 6. Who reads it: the fourth at the turn; Clara's descriptor laid down; its reader, the census dashboard, on its thread, and where
#    that comes from, in pencil; the two products it's built from, set down and threaded. Mei's descriptor: the products that read it,
#    lit; and as she tells each of their owners, a letter folded and slid to each, home through the pause
rw_ = lambda lid, word, off=0: W('readers', lid, word, off)
rc_ = lambda lid, off=0: G('readers', lid, off)
r0 = S0('readers')
chord(IV, r0 + 0.2, r0 + 2.6, 0.5, step=0.15, att=0.6, rel=0.8)
paper(r0 + 0.3, 0.012, px(600), 0.45)
rec = rw_('says', 'from the record')
pencil(rec, 0.007, px(1200), 0.6); knock(rec + 0.5, 0.010, px(1550), 260); pencil(rec + 1.0, 0.008, px(1550), 0.9)
bf6 = rw_('built', "what it's built from")
knock(bf6 + 0.1, 0.010, px(1550), 260); knock(bf6 + 1.1, 0.010, px(1550), 260)
for i in range(3):
    pencil(bf6 + 0.3 + 0.5 * i, 0.006, px(1200), 0.4)
wh6 = rc_('when', -0.3)
paper(wh6 + 0.2, 0.012, px(560), 0.4)
for i in range(3):
    marker(rw_('when', 'one of them changes', 0.4 * i), 0.006, px(500), 0.4)
tap(rw_('when', 'Mei knows'), 0.007, px(240))
tl6 = rw_('when', 'who to tell')
for i in range(3):
    fold(tl6 + 0.8 * i, 0.010, px(1300)); slide(tl6 + 0.8 * i + 0.3, 0.008, px(1450), 0.5)
chord(I, tl6 + 0.1, E('readers') + 0.3, 0.45, step=0.2, att=0.7, rel=0.9, top=False)
sline([(tl6 + 0.3, E('readers') + 0.3, 69, 0.9)], 0.4, att=0.6, rel=0.9)

# 7. Open standards: home at the turn; the two files laid down; a book for each standard set down, and threaded to its file; who keeps
#    them, and the licence; a newer edition behind each. Three tools read the contract: as each window comes, the synthesiser joins the
#    lute on its note, F, then A, then C; the check, typed in a terminal, and the files valid; the versions the project keeps, lit, and
#    in the pause, home
ew_ = lambda lid, word, off=0: W('open', lid, word, off)
ec_ = lambda lid, off=0: G('open', lid, off)
e0 = S0('open')
chord(I, e0 + 0.2, e0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
bf7 = ew_('both', 'Both files')
paper(bf7, 0.012, px(500), 0.4); paper(bf7 + 0.3, 0.012, px(1420), 0.4)
book(ew_('both', 'one for data products'), 0.016, px(500)); book(ew_('both', 'one for data contracts'), 0.016, px(1420))
tap(ew_('bitol', 'Bitol'), 0.006, px(960)); tap(ew_('bitol', 'free for anyone'), 0.006, px(960))
vr = ew_('bitol', 'versioned')
book(vr + 0.2, 0.010, px(560)); book(vr + 0.6, 0.010, px(1480))
tk7 = ew_('tools', 'Tools that know them')
for i, m in enumerate((65, 69, 72)):
    reads(tk7 + 0.25 + 0.66 * i, m, 0.75, sec=2.4 - 0.4 * i)
ck7 = ew_('tools', 'a check holds')
keys(ck7, 8, 0.007, px(500), 0.12); marker(ew_('tools', "the standard's rules"), 0.007, px(700), 0.6)
kp7 = ec_('keeps', -0.3)
paper(kp7 + 0.2, 0.012, px(960), 0.45); pin(kp7 + 0.6, 0.010, px(560))
marker(ew_('keeps', 'its catalogue reads today'), 0.007, px(900), 0.6); marker(ew_('keeps', 'moves when'), 0.007, px(1300), 0.6)
chord(I, ec_('breath', -0.2), E('open') + 0.3, 0.45, step=0.2, att=0.7, rel=0.9)

# 8. A catalogue over the platform: the third at the turn; Sam's screens, and as Ontos fills, it reads the files: the synthesiser joins
#    the lute; the contract dropped in, and read; the products laid out by domain, each with its team; Clara's product on its way: the
#    steward's note, and its owner publishes, a stamp; the nightly policy, its lines lit, and governance told, a notice folded; a column
#    linked to its business term; a Labs project, as it is, lit; and on Noor's map, the files at home, pinned, and the catalogue's copy,
#    one way, home to the end
kw_ = lambda lid, word, off=0: W('catalogue', lid, word, off)
kc_ = lambda lid, off=0: G('catalogue', lid, off)
k0 = S0('catalogue')
chord(iii, k0 + 0.2, k0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
reads(kw_('ontos', 'Ontos', 0.4), 69, 0.7)
tap(kc_('imports', -0.2), 0.008, px(960))
ff8 = kw_('imports', 'from its file')
slide(ff8 - 0.3, 0.010, px(960), 0.7); tap(ff8 + 0.4, 0.007, px(960))
reads(ff8 + 0.7, 72, 0.7)
ly = kw_('imports', 'lays the products')
for i in range(3):
    tap(ly + 0.4 * i, 0.006, px(700))
marker(kw_('imports', 'each with its team'), 0.007, px(1100), 0.5)
tap(kc_('steward', -0.2), 0.007, px(960))
pencil(kw_('steward', 'A steward'), 0.008, px(1300), 0.8)
stamp(kw_('steward', 'published', 0.3), 0.012, px(1500))
tap(kw_('policy', 'Each night'), 0.007, px(400))
for w_ in ('an active one', 'with no owner', 'is tagged'):
    marker(kw_('policy', w_), 0.006, px(700), 0.5)
told = kw_('policy', 'governance is told')
marker(told, 0.006, px(700), 0.5); fold(told + 0.3, 0.010, px(1300))
tap(kw_('link', 'link each column'), 0.007, px(560)); knock(kw_('link', 'the business term'), 0.010, px(1500), 260)
for w_ in ('comes as it is', 'no formal support'):
    marker(kw_('labs', w_), 0.006, px(800), 0.6)
hm8 = kc_('home', -0.3)
air(hm8 + 0.5, 2.0, 0.006, px(1150))
tap(kw_('home', 'the files'), 0.006, px(1720)); pin(kw_('home', 'at home'), 0.012, px(1100))
cp8 = kw_('home', 'holds a copy')
air(cp8 - 0.4, 1.0, 0.008, px(1300)); tap(cp8 + 0.3, 0.007, px(1550))
chord(I, cp8, E('catalogue') + 0.3, 0.45, step=0.2, att=0.7, rel=0.8)

# 9. Outlives the tool: home at the turn, at dawn; Anil reads the promise, and plans from it by seven; the catalogue swaps for another,
#    the file laid down, its standard's tag; the owner lit; and as the other catalogue reads it, the synthesiser joins the lute; as the
#    catalogue goes and the file stays, home, held to the end; the next film's card lifts; and the end card, on the mark
zw_ = lambda lid, word, off=0: W('close', lid, word, off)
zc_ = lambda lid, off=0: G('close', lid, off)
z0 = S0('close')
chord(I, z0 + 0.2, z0 + 3.0, 0.5, step=0.25, att=0.8, rel=0.9)
marker(zw_('march', 'read its promise'), 0.007, px(1370), 0.5); pencil(zw_('march', 'plan from it'), 0.007, px(1370), 0.6)
tap(zw_('march', 'by seven'), 0.007, px(1480))
air(zw_('changed', 'the catalogue has changed'), 1.0, 0.008, px(960))
paper(zw_('file', "it's a file"), 0.012, px(960), 0.45); tap(zw_('file', 'in an open format'), 0.006, px(1400))
marker(zw_('file', 'kept with the code'), 0.007, px(700), 0.5)
reads(zw_('file', 'any tool', 0.4), 69, 0.75)
ot = zw_('last', 'outlives the tool')
air(ot, 1.2, 0.006, px(960))
chord(I, ot - 0.2, TOT, 0.45, step=0.2, att=0.8, rel=0.6, top=False)
bd, end = zc_('breath', -0.3), zc_('breath', 1.6)
knock(bd + 0.55, 0.010, px(1640), 280); air(bd + 0.6, 0.9, 0.006, px(1640))
mark(end + 0.6)
soften(2600)
