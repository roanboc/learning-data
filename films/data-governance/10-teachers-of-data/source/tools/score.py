# Teachers of data: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (PLAYBOOK.md: vary the sound itself; the series' brass and music box, recorders and marimba, piano,
# strings and clarinet, glass harmonica and handbells, guitar, electric piano and flute are left to the films that have them): a
# double-reed trio, oboe, cor anglais and bassoon, made here (music.py has no reeds of their kind), played softly and low, so nothing
# rings above the voice.
#  - The film is about teaching, so its one figure is a phrase that one voice plays and another copies: five notes, 3-5-4-2-1, the
#    first two asking and the last three answering. In 1996 the oboe plays it as people understand the rule, and the cor anglais copies
#    it as the people around them keep it; when Anil's guide opens the cor anglais plays it, and the bassoon copies it as his change
#    is signed; Yusuf's oboe plays it as a governance team teaches; and as the stewards pass it on, all three play it in turn. In
#    Bogotá in 2012 the oboe plays it once more, in E-flat minor, and stops a note short: nobody copies it. At the end it's whole again.
#  - The mimes get a light trio, each gesture on a soft staccato note, as a silent film would score them; a check that warns first,
#    governance's mime, gets the mime's notes. The officer's fine is one low bassoon note, and so is each check that stops the work.
#  - The voices also come in one at a time as things arrive in order: the three panels (the people around, the mime, the fine last),
#    the stewards as they're named, the hands that agree a rule, one note for each week crossed off (each quieter, as the warnings
#    fall), and the five things people need, the last held longest, as it's the hardest.
#  - The series' mark, four notes, 1-5-4-8, on the cor anglais, answered by the bassoon, plays under the title and the end card.
#  - G major for Bogotá in 1995 and 1996; E-flat major for the university; E-flat minor for Bogotá in 2012.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, Bogotá's, and after it only at a chapter's
#    turn, under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the
#    opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: no urgent pulse; each reed is one voice, with no vibrato and no tremolo; every chord is tuned
#    pure (just intonation, see hz()), and a note two chords share is held. Nothing imitates the music of another culture: no
#    instrument, rhythm or tune of Colombia's; the story is told in the series' own voice.
#  - Nothing loops. Where the picture repeats (the whistles, the claps, the ticks, the wheel's parts), the sound plays the first few,
#    then softer.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset, and the same paths for the cars, the mimes and the officer), so sound and picture stay together when
#    the voice is re-timed.
# And everything stays low and soft: a car's idle and its tyres rolling back, whistles kept low, hands clapping, a notebook's page,
# paper, pins, a marker on the whiteboard, a frame lifted off its nail, a pencil on the calendar, muffled keys, all below about 2.5 kHz.

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
R10 = np.random.default_rng(10)  # this film's own randomness: the reeds' room, the engines, the claps, the paper

# ---- tuning: just intonation from the key's own note, so a chord's notes are whole-number ratios of each other and nothing beats.
# Bogotá is in G; the university in E-flat, tuned from the same G (its E-flat is a pure major third under G), so the notes the two
# keys share (G, C and D) are the same pitch in both, and a G can be held from one into the other. E-flat minor uses the same E-flat,
# with G-flat, C-flat and D-flat from the same table. The chords on the second degree are left out (their fifths aren't pure here)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEYS = {'G': (55, 196.0), 'Eb': (51, 196.0 * 4 / 5)}  # each key's own note (MIDI) and its pitch
def hz(m, k='Eb'):
    t, f = KEYS[k]; o, pc = divmod(m - t, 12)
    return f * 2 ** o * _JI[pc]

# ---- the levels: a reed sits about as far under the voice as the series' other films' music (each instrument matched by loudness,
# not by peak); the effects about 12 dB under the music (FX scales them all)
RL, FX = 0.03, 1.3
LEVEL = {'oboe': 1.25, 'cor': 1.1, 'bsn': 1.0}
PAN = {'oboe': -0.2, 'cor': 0.05, 'bsn': 0.25}  # where each sits: oboe a little left, bassoon a little right

# ---- the double reeds. Each note is every harmonic of its pitch (a conical bore's, as all three have), shaped by the instrument's
# own resonances (its formants: the oboe's near 1.1 and 1.5 kHz, the cor anglais's lower and veiled, the bassoon's near 470 Hz and
# 1.15 kHz), with the lowest harmonics weak, as theirs are, and darker the softer it's played; the harmonics above about 2.4 kHz are
# left out. A breath of the reed's air under it, a little more as the note starts; the pitch settles from a few cents under in the
# first hundredth of a second, as a reed's does, and then holds, with no vibrato. A small room round the players rings on for under
# a second
REED = {  # formants as (Hz, width, weight); the corner under which the harmonics weaken; the soft roll-off; the onset; the air's band
    'oboe': ([(1150, 520, 1.0), (1480, 520, 0.55), (2350, 650, 0.12)], 520, 1500, 0.06, (800, 1700)),
    'cor': ([(960, 460, 1.0), (1320, 460, 0.32), (2150, 600, 0.09)], 380, 1250, 0.075, (650, 1400)),
    'bsn': ([(470, 230, 1.0), (1150, 380, 0.5), (1980, 520, 0.12)], 200, 950, 0.09, (300, 1100))}
_IR = (lambda x: (R10.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.012 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _harm(inst, f, soft=1.0):
    """the weights of a note's harmonics on inst, at f Hz"""
    F, lo, hi = REED[inst][:3]; n = max(1, int(2500 // f)); k = np.arange(1, n + 1); fk = f * k
    r = sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in F) + 0.06
    a = k ** -0.6 * r * (fk / lo) ** 2 / (1 + (fk / lo) ** 2) / (1 + (fk / (hi * soft)) ** 2) * np.clip((2500 - fk) / 250, 0, 1)
    return a / np.sqrt((a ** 2).sum())
def line(inst, segs, g=1.0, k='Eb', soft=1.0, att=None, rel=0.12, tongue=False, room=0.22, pan=None, tie=False):
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
    T0, T1 = segs[0][0], segs[-1][1]; att = att or REED[inst][3]; gl = 0.035
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
            s += aj * e ** (1 + 0.16 * j) * np.sin((j + 1) * ph + 0.7 * j * j)
    lo, hi = REED[inst][4]
    s = s * lev + 0.02 * filt(noise(n / SR + 0.01)[:n], 'band', (lo, hi)) * e * lev * (1 + 2.5 * np.exp(-x / (0.012 if tongue else 0.03)))
    s = filt(s.astype(np.float32), 'low', 2400)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), T0, g * RL * LEVEL[inst], pan)
def note(inst, m, s, sec, g=1.0, k='Eb', **o):
    """one held note"""
    line(inst, [(s, s + sec, m, 1.0)], g, k, **o)
def stacc(inst, m, s, g=0.9, k='G', sec=0.16, pan=None):
    """a soft staccato note, tongued"""
    line(inst, [(s, s + sec, m, 1.0)], g, k, 0.85, att=0.014, rel=0.05, tongue=True, pan=pan)
def figure(inst, notes, s, step, g=0.9, k='G', sec=0.16, fall=1.0):
    """staccato notes one after another, each a little softer than the one before (fall)"""
    for i, m in enumerate(notes):
        stacc(inst, m, s + i * step, g * fall ** i, k, sec)
def phrase(inst, notes, s, g=1.0, k='Eb', step=0.42, last=1.6, soft=1.0):
    """notes slurred one after another, each step long, the last held"""
    d = [step] * (len(notes) - 1) + [last]; t = s; segs = []
    for m, dd in zip(notes, d):
        segs.append((t, t + dd, m, 1.0)); t += dd
    line(inst, segs, g, k, soft)
def chord(voices, a, b, g=0.8, k='Eb', step=0.12, att=0.25, rel=0.35):
    """a held chord, each voice coming in a moment after the one under it: voices is {instrument: note}, lowest first"""
    for i, (inst, m) in enumerate(voices.items()):
        line(inst, [(a + step * i, b, m, 1.0)], g, k, 0.8, att=att, rel=rel)
# the teaching phrase, 3-5-4-2-1, in each key, and the series' mark, 1-5-4-8
TEACH = {'G': [71, 74, 72, 69, 67], 'Eb': [67, 70, 68, 65, 63]}
def mark(inst, root, s, g=1.0, k='G', step=0.45, last=1.4):
    phrase(inst, [root, root + 7, root + 5, root + 12], s, g, k, step, last)

# ---- the street: an engine, tyres, whistles, hands
def _sweep(sig, s, g, p0, p1, n=8):
    """a sound placed as it moves across the frame, from pan p0 to p1, in overlapping pieces"""
    L = len(sig); h = max(2, L // n); w = np.hanning(2 * h).astype(np.float32)
    for i in range(-1, L // h + 1):
        a, b = max(0, i * h), min(L, i * h + 2 * h)
        if b > a:
            X(sig[a:b] * w[a - i * h:b - i * h], s + a / SR, g, p0 + (p1 - p0) * min(1, max(0, (a + h) / L)))
def motor(sec, rpm, load):
    """a small car's engine heard from the pavement: four cylinders firing twice a turn, each a dull knock through the exhaust, a
    little uneven; rpm(x) and load(x), x seconds in, set how fast and how hard it runs. Only its low purr comes through"""
    n = int(sec * SR); x = np.arange(n) / SR; r, ld = rpm(x), load(x)
    k = np.floor(np.cumsum(r / 30.0) / SR); hit = np.nonzero(np.diff(k) > 0)[0] + 1
    imp = np.zeros(n, np.float32); imp[hit] = (0.75 + 0.5 * R10.random(len(hit))) * (0.5 + ld[hit])
    t = tt(0.06); ex = np.sin(2 * np.pi * 115 * t) * np.exp(-t / 0.018) + 0.6 * np.sin(2 * np.pi * 290 * t + 0.5) * np.exp(-t / 0.01) + 0.25 * np.sin(2 * np.pi * 470 * t) * np.exp(-t / 0.006)
    s_ = fftconvolve(imp, ex.astype(np.float32))[:n] + 0.12 * filt(noise(sec)[:n], 'band', (90, 500)) * (0.4 + ld)
    return filt(s_.astype(np.float32), 'low', 800)
def tyres(sec, speed):
    """tyres rolling on asphalt: a low rush that rises with the speed (speed(x), in metres a second)"""
    n = int(sec * SR); x = np.arange(n) / SR
    return filt(filt(noise(sec)[:n], 'band', (120, 900)) * (np.clip(speed(x), 0, 30) / 10) ** 1.2, 'low', 1100)
def car_in(t1, v, g=0.012, pan=0.0, Ta=2.4, pre=1.6, idle=2.6, cut=None):
    """a car rolling up at v m/s and braking to a stop by t1, as tt_drive() draws it, then idling a moment and fading; heard from
    the cut (a shot's first frame) if it's already rolling there"""
    s0 = t1 - Ta - pre; sec = pre + Ta + idle; n = int(sec * SR); x = np.arange(n) / SR
    sp = lambda x: np.where(x < pre, v, np.clip(v * (1 - (x - pre) / Ta), 0, v))
    rpm = lambda x: np.where(x < pre, 1300, np.interp(x, [pre, pre + Ta, sec], [1300, 760, 740]))
    ld = lambda x: np.where(x < pre, 0.3, 0.12)
    env = (np.clip((x - (cut - s0)) / 0.25, 0, 1) if cut is not None else np.minimum(1, x / 1.0)) * np.clip((sec - x) / 1.6, 0, 1)
    X((motor(sec, rpm, ld) * 0.8 + tyres(sec, sp) * 0.9) * env[:n], s0, g * FX, pan)
def car_back(t0, t1, dist, g=0.014, pan=0.0):
    """a car rolling slowly back over [t0, t1], dist metres, eased: its tyres, and its engine a little harder"""
    sec = t1 - t0 + 0.8; n = int(sec * SR); x = np.arange(n) / SR; u = np.clip(x / (t1 - t0), 0, 1)
    sp = lambda x: dist / (t1 - t0) * 2 * np.sin(np.pi * np.clip(x / (t1 - t0), 0, 1)) ** 2
    rpm = lambda x: 760 + 260 * np.sin(np.pi * np.clip(x / (t1 - t0), 0, 1))
    ld = lambda x: 0.12 + 0.3 * np.sin(np.pi * np.clip(x / (t1 - t0), 0, 1))
    env = np.minimum(1, x / 0.3) * np.clip((sec - x) / 0.6, 0, 1)
    X((motor(sec, rpm, ld) * 0.7 + tyres(sec, sp) * 1.4) * env[:n], t0, g * FX, pan)
    for k in range(3):  # a little grit under the tyres
        s_knock(t0 + (t1 - t0) * (0.25 + 0.2 * k) + 0.05 * R10.uniform(), g * 0.25 * FX, pan, 160 + 40 * k)
def car_go(t0, g=0.012, pan=0.0, sec=4.0):
    """a car pulling away from the light, as tt_drive() draws it (1.3 t² metres): the engine rising, then fading as it goes"""
    n = int(sec * SR); x = np.arange(n) / SR
    rpm = lambda x: 760 + 1300 * np.clip(x / 2.5, 0, 1) ** 0.7
    ld = lambda x: 0.6 * np.exp(-x / 2.0) + 0.15
    X((motor(sec, rpm, ld) + tyres(sec, lambda x: 2.6 * x) * 0.8) * np.minimum(1, x / 0.15) * np.exp(-x / 1.6), t0, g * FX, pan)
def car_by(tm, v, g=0.01, p0=-0.7, p1=0.7, half=2.6):
    """a car driving past, nearest at tm: its engine and tyres swelling and fading, from one side to the other"""
    sec = 2 * half; n = int(sec * SR); x = np.arange(n) / SR
    sig = (motor(sec, lambda x: np.full(len(x), 1500.0), lambda x: np.full(len(x), 0.35)) * 0.8 + tyres(sec, lambda x: np.full(len(x), v))) \
        * (1 / (1 + ((x - half) / 0.9) ** 2)) * np.clip(x / 0.3, 0, 1) * np.clip((sec - x) / 0.3, 0, 1)
    _sweep(sig.astype(np.float32), tm - half, g * FX, p0, p1)
def whistle(s, f, g=0.008, pan=0.0, sec=0.34):
    """someone on the pavement whistling at a car: a low whistle that rises into its note and stops, a breath round it"""
    n = int(sec * SR); x = np.arange(n) / SR
    fr = f * (1 - 0.16 * np.exp(-x / 0.035)); ph = 2 * np.pi * np.cumsum(fr) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / 0.03, 1)) ** 2 * np.clip((sec - x) / 0.08, 0, 1)
    sig = np.sin(ph) * e + 0.12 * filt(noise(sec)[:n], 'band', (f * 0.85, min(2400, f * 1.2))) * e
    X(filt(sig.astype(np.float32), 'low', 2200), s, g * FX, pan)
def clap(s, g=0.006, pan=0.0):
    """one pair of hands, muffled: a short slap of air, and the palms' low knock"""
    x = tt(0.07); sig = filt(noise(0.07)[:len(x)], 'band', (450, 2000)) * np.exp(-x / 0.011) + 0.5 * filt(noise(0.07)[:len(x)], 'band', (140, 420)) * np.exp(-x / 0.02)
    X(norm(filt((sig * np.minimum(1, x / 0.0015)).astype(np.float32), 'low', 2000)), s, g * FX * R10.uniform(0.75, 1.0), pan)

# ---- soft sounds in the rooms, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a sheet arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.012, pan=0.0, step=0.13):
    """a few keys typed, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R10.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.022, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pin(s, g=0.024, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.6):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def cross(s, g=0.012, pan=0.0):
    """a week crossed off on the calendar: two quick pencil strokes"""
    pencil(s, g, pan, 0.22); pencil(s + 0.27, g * 0.9, pan, 0.22)
def pen(s, g=0.011, pan=0.0, sec=1.2):
    """a ballpoint pen writing in a notebook: short strokes, unevenly, never quite in time"""
    x = tt(sec); e = np.zeros(len(x), np.float32); t0 = 0.0
    while t0 < sec - 0.06:
        d = R10.uniform(0.05, 0.13); i, j = int(t0 * SR), min(len(x), int((t0 + d) * SR))
        e[i:j] = np.maximum(e[i:j], np.sin(np.pi * np.arange(j - i) / max(1, j - i)) * R10.uniform(0.5, 1.0)); t0 += d + R10.uniform(0.0, 0.05)
    X(filt(noise(sec), 'band', (500, 1900))[:len(x)] * e, s, g * FX, pan)
def write(s, sec, g=0.012, pan=0.0):
    """a marker writing on the whiteboard: felt strokes, a soft hush that comes and goes with the letters"""
    x = tt(sec); e = np.zeros(len(x), np.float32); t0 = 0.0
    while t0 < sec - 0.08:
        d = R10.uniform(0.09, 0.22); i, j = int(t0 * SR), min(len(x), int((t0 + d) * SR))
        e[i:j] = np.maximum(e[i:j], np.sin(np.pi * np.arange(j - i) / max(1, j - i)) ** 0.7 * R10.uniform(0.6, 1.0)); t0 += d + R10.uniform(0.02, 0.07)
    X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * e, s, g * FX, pan)
def marker(s, g=0.014, pan=0.0, sec=1.0):
    """a highlighter drawn along a line: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def pat(s, g=0.016, pan=0.0):
    """a note pressed onto the whiteboard: a small, padded pat"""
    s_knock(s, g * FX, pan, 190); paper(s + 0.01, g * 0.35, pan, 0.12)
def slide(s, g=0.02, pan=0.0, sec=0.42):
    """a binder drawn out along a wooden shelf: a low, rough slide, and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
    s_knock(s + sec * 0.92, g * 0.5 * FX, pan, 200)
def flap(s, g=0.016, pan=0.0, sec=0.42):
    """a binder's cover, or a notebook's, swung over (for sec) and laid flat: a breath of air and a padded flap"""
    s_air(s, max(0.15, sec + 0.08), g * 0.5 * FX, pan, 150, 800); s_knock(s + sec, g * FX, pan, 170); paper(s + sec + 0.02, g * 0.4, pan, 0.2)
def wire(s, g=0.014, pan=0.0):
    """a frame lifted off its nail: the hanging wire's small scrape over the nail, and the frame's corner off the wall"""
    x = tt(0.12); X(filt(noise(0.12), 'band', (700, 1900))[:len(x)] * np.sin(np.pi * x / 0.12), s, g * FX, pan)
    s_knock(s + 0.16, g * 0.8 * FX, pan, 230)
def into(s, g=0.022, pan=0.0):
    """something set down in a cardboard box: a low, padded thud, and the box round it"""
    x = tt(0.3); X(norm(filt((np.sin(2 * np.pi * 110 * x) * np.exp(-x * 20) + 0.45 * filt(noise(0.3), 'band', (180, 900))[:len(x)] * np.exp(-x * 30)).astype(np.float32), 'low', 1000)), s, g * FX, pan)
def flutter(s, g=0.016, pan=0.0, sec=0.5):
    """sheets of paper dropping: a few soft flaps of air"""
    x = tt(sec); fl = 0.55 + 0.45 * np.sin(2 * np.pi * (8 + 3 * R10.uniform()) * x) ** 2
    X(filt(noise(sec), 'band', (200, 1300))[:len(x)] * fl * np.sin(np.pi * x / sec), s, g * FX, pan)
def air(s, sec=0.8, g=0.014, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)

# ---- the street's moments, from the picture's own sums: tt_path()'s walks, and the claps as tt_clapping() draws them
def walk_end(t0, pts, v):
    return t0 + max(0.2, sum(_math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts, pts[1:])) / v)
def claps(t0, t1, g, pan):
    """one pair of hands clapping from t0 to t1, as tt_clapping() draws them, about two and a half times a second; the sound is
    each person's own, a little uneven, so a crowd clatters rather than claps in time"""
    t = t0 + R10.uniform(0, 0.35)
    while t < t1:
        clap(t, g * min(1, (t - t0) / 0.3, (t1 - t) / 0.3), pan); t += R10.uniform(0.3, 0.48)

# =============================================================================================================================
# 1. The mime before the fine: Bogotá, 1995, and a year on, in G. As the picture draws it: two cars pass, three roll up and stop on
#    the stripes, a bassoon note as each stops; the oboe weaves between them with the people on foot; a car edges forward at a student
#    crossing in front of it, and the danger is held on a bare fifth, until the oboe climbs the teaching phrase's first two notes, its
#    question, as the city needs another way; the cor anglais tiptoes as the mimes come down the side street, and the first one bows;
#    whistles, and the first car backs off; the mime bows to the next driver, invites him back and shows him the way, and bows his
#    thanks as the car goes; the third driver won't, and the mime shrugs; the officer writes a fine, on one low bassoon note, to
#    applause. Then the three panels, one voice each, in their order; 1996 in held chords, the cars stopping behind the line, and G,
#    home, as people on foot cross in front of them; the teaching phrase as people understand the rule, copied as the people round
#    them keep it, the question answered; the fine, low, for the few; the light turns green and the cars go; and the mark under the title
cw = lambda lid, word, off=0: W('crossing', lid, word, off)
cc = lambda lid, off=0: G('crossing', lid, off)
drivers, zebra, weave = cw('stop', 'drivers stop'), cw('stop', 'zebra'), cw('stop', 'weave')
danger, need, needEnd = cw('risk', 'dangerous'), cc('need'), END('crossing', 'need')
mimes, around, whistled = cw('mayor', 'mimes'), cw('whistle', 'around'), cw('whistle', 'whistle')
steps, word, invites, backUp = cw('mime', 'steps'), cw('mime', 'without a word'), cw('mime', 'invites'), cw('mime', 'back up')
wont, officer, writes, applaud = cw('fine', "still won't"), cw('fine', 'a traffic officer'), cw('fine', 'writes'), cw('fine', 'applaud')
last, cameLast, order = cc('last'), cw('last', 'came last'), cw('last', 'an order')
y96, safe, understand, around2, few, breath = cc('y96'), cc('safe'), cw('most', 'understand'), cw('most', 'the people around'), cw('few', 'few'), cc('breath')
# the opening: Bogotá, 1995, an open G on the bassoon and the cor anglais, as the light turns red
chord({'bsn': 43, 'cor': 62}, 0.4, cc('b95', 1.9), 0.75, 'G', step=0.3, att=0.5)
car_by(2.0, 12, 0.0034, -0.75, 0.75); car_by(2.46, 13, 0.0027, -0.6, 0.85)  # the two that pass while it's still green
for t1, v, m, p in [(drivers - 0.2, 9, 43, -0.15), (drivers + 0.4, 9, 50, 0.05), (zebra + 0.3, 10, 43, -0.05)]:  # three stop on the stripes
    car_in(t1, v, 0.0075, p); stacc('bsn', m, t1 - 0.05, 0.8)
figure('oboe', [67, 71, 69, 72, 71, 74], weave - 0.1, 0.19, 0.8, fall=0.94)  # people on foot weave between the cars
# the cream car edges forward at the student in front of it (the same roll as a car backing off, the other way), and a bare fifth
# comes in under the danger, E and B, the bassoon and the cor anglais held (a third would roughen it), the oboe on the phrase's first
# note; as the city needs another way, the oboe climbs to its second, the question the phrase answers in 1996
car_back(danger - 0.1, danger + 0.4, 0.75, 0.0085, px(880))
chord({'bsn': 40, 'cor': 59}, danger - 0.05, needEnd + 0.5, 0.6, 'G', step=0.2, att=0.6, rel=0.5)
line('oboe', [(danger + 0.5, needEnd + 0.15, 71, 1.0), (needEnd + 0.15, needEnd + 1.7, 74, 1.0)], 0.6, 'G', 0.8, att=0.7, rel=0.6)
# the mimes come down the side street, the cor anglais on tiptoe; the one nearest the crossing bows to everyone
m_in = mimes - 4.4; m_bow = walk_end(m_in, [[1.5, 31], [1.5, 16.0], [-0.9, 15.0]], 2.3) + 0.2
for i, m in enumerate([62, 64, 66, 67, 69, 67, 66, 64]):
    stacc('cor', m, m_in + 1.6 + 0.44 * i, 0.75 if i < 6 else 0.55)
figure('oboe', [74, 67], m_bow + 0.05, 0.3, 0.8)
# the people around whistle (the first few, then softer), and the car on the stripes backs off
for i, (X0, ph, f) in enumerate([(-5.8, 0.3, 1040), (-4.6, 1.1, 1180), (-3.6, 2.0, 1110), (-2.8, 2.9, 1290), (11.8, 0.7, 1230), (13.2, 1.6, 980)]):
    p = max(-0.7, min(0.7, (X0 - 3) / 10)); w0 = around + ph * 0.1
    whistle(w0 + 0.05, f, 0.0028, p)
    if i < 4:
        whistle(w0 + 0.95 + 0.1 * ph, f * 1.02, 0.0018, p)
    if i < 2:
        whistle(w0 + 1.9, f, 0.0011, p)
car_back(whistled + 0.1, whistled + 2.4, 4.4, 0.0095, -0.1)
figure('bsn', [50, 47, 43], whistled + 0.25, 0.6, 0.8)
# the mime walks out to the next car, bows to its driver, invites him back, shows him the way twice, and bows his thanks as it goes
figure('oboe', [74, 71], word - 0.05, 0.3, 0.85)
figure('oboe', [67, 71, 74], invites + 0.1, 0.15, 0.8)
for k in range(2):
    sw = invites + 0.1 + 0.714 + 1.4286 * k
    if sw < backUp + 0.6:
        stacc('cor', [60, 57][k], sw, 0.75)
car_back(backUp + 0.3, backUp + 2.3, 4.7, 0.0095, -0.05)
figure('bsn', [50, 48, 47, 45], backUp + 0.4, 0.45, 0.75)
figure('oboe', [71, 67], backUp + 1.25, 0.25, 0.75)
# the third driver won't: the mime shrugs
figure('cor', [66, 62], wont + 0.65, 0.3, 0.8)
# the officer comes in, opens his notebook and writes the fine, on one low bassoon note; the people applaud; he shuts it
o_end = walk_end(officer - 0.9, [[8.6, 7.8], [3.4, 7.4]], 2.6); wr0 = max(writes, o_end + 0.1)
paper(wr0 + 0.05, 0.014, 0.1, 0.25)
note('bsn', 43, wr0 + 0.2, 1.8, 1.0, 'G')
pen(wr0 + 0.4, 0.010, 0.1, applaud + 0.4 - (wr0 + 0.4))
cl0, cl1 = applaud - 0.3, applaud + 2.4
for X0 in [-5.8, -4.6, -3.6, -2.8, 11.8, 13.2]:
    claps(cl0, cl1, 0.006, max(-0.7, min(0.7, (X0 - 3) / 10)))
for i in (0, 2, 3):  # three of the mimes clap too
    claps(cl0 + 0.15 * i, cl1, 0.005, [-0.4, 0, -0.5, 0.6][i])
flap(applaud + 0.45, 0.010, 0.1, 0.15)
# the three panels pinned up, one voice each, from the top: the people around, the mime, the fine, last; the pencilled arrows
for t0, (inst, m), p in [(last + 0.1, ('oboe', 74), -0.5), (last + 0.9, ('cor', 59), 0.0), (cameLast - 0.1, ('bsn', 43), 0.5)]:
    pin(t0 + 0.05, 0.022, p); note(inst, m, t0 + 0.05, y96 - 0.2 - t0, 0.8, 'G', att=0.2, rel=0.4)
pencil(order + 0.05, 0.010, -0.2, 0.3); pencil(order + 0.4, 0.010, 0.3, 0.3)
# 1996: four cars roll to a stop behind the line, and wait; held chords, C, then D, then G under the phrase
for t1, p in [(y96 + 0.4, -0.3), (y96 + 0.6, 0.4), (y96 + 0.9, -0.1), (y96 + 1.3, 0.15)]:
    car_in(t1, 8, 0.007, p, pre=0.2, idle=2.0, cut=y96 - 0.3)
pen(y96 + 1.8, 0.007, 0.0, 1.0)  # the officer writes the one fine, and shuts his notebook
flap(few - 0.4, 0.008, 0.0, 0.15)
# C, then G, home, as people cross in front of the cars: the bassoon and the cor anglais step down into it, the oboe's G held through
for inst, a, (m0, m1) in [('bsn', y96 - 0.1, (48, 47)), ('cor', y96 + 0.1, (64, 62)), ('oboe', y96 + 0.3, (67, 67))]:
    line(inst, [(a, safe + 0.05, m0, 1.0), (safe + 0.05, cc('most', 0.2), m1, 1.0)], 0.7, 'G', 0.8, att=0.6, rel=0.5, tie=True)
chord({'bsn': 50, 'cor': 66}, cc('most', 0.2), understand - 0.15, 0.6, 'G', step=0.1, att=0.4, rel=0.4)
note('bsn', 43, understand - 0.15, around2 + 2.6 - understand, 0.65, 'G', att=0.35, rel=0.5)
phrase('oboe', TEACH['G'], understand, 0.9, 'G')
phrase('cor', [m - 12 for m in TEACH['G']], around2, 0.85, 'G')
note('bsn', 43, few - 0.05, 0.9, 0.85, 'G', att=0.05, rel=0.3)  # the fine is for the few
# the light turns green and the cars go, one after another; the title, and the mark: the cor anglais, then the bassoon copying it
go = breath + 0.5
for i, p in enumerate([-0.3, -0.1, 0.15, 0.4]):
    car_go(go + 0.3 + 0.25 * i, 0.007 if i < 2 else 0.0045, p)
mark('cor', 55, breath + 1.5, 0.9, 'G')
mark('bsn', 43, breath + 1.5 + 1.8 + 0.1, 0.9, 'G', last=2.6)  # its last note, G, held into the university's E-flat

# 2. Submission day, in E-flat: the bassoon's G becomes the third of E-flat as the cor anglais and the oboe come in; Planning's card
#    turns over and the submission's comes in, and the two voices meet on one note as both are ticked; the decision's card; Send;
#    a tick on each office's glass; Yusuf pins a card to his board; the fine's low note as it lights over "the checks"; the
#    pencilled question marks, and the oboe's question
tw = lambda lid, word, off=0: W('today', lid, word, off)
tc = lambda lid, off=0: G('today', lid, off)
chord({'cor': 58, 'oboe': 63}, S0('today') + 0.4, S0('today') + 3.4, 0.7, step=0.3, att=0.6, rel=0.6)
paper(tw('agree', 'census report') + 0.2, 0.014, px(640), 0.6); knock(tw('agree', 'The submission') - 0.1 + 0.3, 0.016, px(1000), 280)
ag = tw('agree', 'agree:')
for k in (0, 1):
    knock(ag + 0.15 * k + 0.2, 0.012, px([640, 1000][k]), 300)
line('oboe', [(ag - 0.45, ag, 70, 0.8), (ag, ag + 1.3, 67, 0.8)], 0.8, att=0.15, rel=0.4)
line('cor', [(ag - 0.45, ag, 63, 0.8), (ag, ag + 1.3, 67, 0.8)], 0.8, att=0.15, rel=0.4)
air(tw('agree', 'counted') - 0.3, 0.9, 0.010, 0.0)
down = tw('mei', 'written down')
paper(down - 0.25 + 0.55, 0.014, px(915), 0.3); knock(down - 0.25 + 0.85, 0.014, px(915), 260)
send = tc('helped', -1.7)
tap(send + 0.05, 0.014, 0.3)
for k in range(4):
    knock(tw('helped', 'helped') - 0.2 + 0.3 * k + 0.2, 0.012 if k < 2 else 0.008, px([300, 700, 1300, 1700][k]), 300)
pin(tc('fines', -0.5) + 1.3, 0.022, px(1180))
chk = tw('fines', 'the checks')
note('bsn', 39, chk - 0.05, 1.4, 0.9, att=0.08, rel=0.35)
pencil(chk + 0.1, 0.012, 0.3, 0.4)
bf = tw('before', 'before')
pencil(bf - 0.15, 0.010, -0.3, 0.25); pencil(bf + 0.25, 0.010, 0.0, 0.25)
line('oboe', [(bf - 0.1, bf + 0.35, 70, 0.85), (bf + 0.35, bf + 1.5, 72, 0.85)], 0.85, att=0.1, rel=0.5)

# 3. A page beside the check: the call list's new column typed; the change sent back, on the fine's low note; the line to its guide;
#    as the guide opens the cor anglais plays the phrase; the class he chooses, and as the sheet is signed the bassoon copies it; the board's mime lights on the
#    mime's notes; the in-tray tipped into the box; the card pinned to the door; and as two come with their laptops and Yusuf waves
#    them in, a chord on four, then on one
bw = lambda lid, word, off=0: W('beside', lid, word, off)
bc = lambda lid, off=0: G('beside', lid, off)
keys(bw('adds', 'adds a column'), 6, 0.011, px(1150))
note('bsn', 39, bw('adds', 'stops'), 1.3, 0.9, att=0.08, rel=0.35)
tap(bw('no', 'say no') - 0.1, 0.012, 0.2)
pg = bw('says', 'a page')
air(pg - 0.1, 0.6, 0.010, 0.1)
phrase('cor', TEACH['Eb'], pg + 0.1, 0.9)
tap(bc('two', 0.25), 0.012, 0.1)
phrase('bsn', [m - 12 for m in TEACH['Eb']], bc('two', 1.5), 0.9)
nm = bw('mime', 'no mime')
figure('oboe', [70, 63], nm - 0.35, 0.3, 0.8, 'Eb'); pencil(nm + 0.1, 0.012, 0.0, 0.5)
tip = bc('queue', 1.3)
slide(tip + 0.4, 0.016, px(740), 0.5); into(tip + 1.05, 0.016, px(560))
pin(bc('queue', 2.7) + 1.95 + 0.25, 0.022, px(150))
wave = bc('queue', 2.7) + 1.95 + 1.3 + 340 / 300 + 0.1
chord({'bsn': 44, 'cor': 60, 'oboe': 63}, wave, wave + 1.6, 0.7, step=0.15, att=0.4, rel=0.25)
chord({'bsn': 51, 'cor': 58, 'oboe': 63}, wave + 1.6, wave + 3.6, 0.7, step=0.0, att=0.3, rel=0.7)

# 4. Each other: the voices come in one at a time as the stewards are named, Mei's bassoon first, and climb as the last two are, then
#    go as the camera reaches the stamp's box; the whiteboard's two headings and the notes pressed under them; the few ticked, then
#    the others, then the faculties; as the crossing's first panel lights, its oboe note again, in E-flat; and round the table, the
#    stewards telling each other things, the oboe and the cor anglais in turn
ew = lambda lid, word, off=0: W('each', lid, word, off)
ec = lambda lid, off=0: G('each', lid, off)
t0 = ew('meet', 'the people') + 0.1; dt = (ew('meet', 'faculty') + 0.3 - t0) / 4; off = ec('approve', -0.5) + 0.9
line('bsn', [(t0, off, 51, 1.0)], 0.75, att=0.3, rel=0.6)
line('cor', [(t0 + dt, t0 + 4 * dt, 58, 1.0), (t0 + 4 * dt, off, 63, 1.0)], 0.7, att=0.3, rel=0.6)
line('oboe', [(t0 + 2 * dt, t0 + 3 * dt, 67, 1.0), (t0 + 3 * dt, off, 70, 1.0)], 0.65, att=0.3, rel=0.6)
h0, h1 = ew('bring', 'what broke') - 0.15, ew('bring', 'what helped') - 0.15
write(h0, 0.7, 0.010, -0.2); write(h1, 0.7, 0.010, 0.2)
for k, t in enumerate([h0 + 0.75, h0 + 1.15, h1 + 0.8, h1 + 1.3, h1 + 1.8]):
    pat(t, 0.014 if k < 2 else 0.009, [-0.3, -0.2, 0.2, 0.3, 0.25][k])
fw, oth = ew('few', 'the few') + 0.1, ec('joined', 0.2)
for k, t in enumerate([fw, fw + 0.45, oth, oth + 0.45, oth + 0.9]):
    pencil(t, 0.010 if k < 3 else 0.007, 0.3, 0.2)
pencil(ew('joined', 'working') - 0.6, 0.008, 0.3, 0.9)
lit = ew('crossing', 'the crossing') - 0.2
note('oboe', 70, lit + 0.05, 1.5, 0.75, att=0.2, rel=0.4)
pencil(ew('crossing', 'colleagues') + 0.1, 0.010, -0.2, 0.4)
rm = ew('crossing', 'long before') - 0.4
line('oboe', [(rm + 0.9, rm + 1.2, 67, 1.0), (rm + 1.2, rm + 1.5, 68, 1.0), (rm + 1.5, rm + 2.2, 67, 1.0)], 0.7, att=0.06, rel=0.3)
line('cor', [(rm + 1.7, rm + 2.0, 63, 1.0), (rm + 2.0, rm + 2.3, 65, 1.0), (rm + 2.3, rm + 3.2, 63, 1.0)], 0.7, att=0.06, rel=0.4)

# 5. Warn first: the card pinned up and the new rule written; the column nobody described, and the two guesses ringed; the hands that
#    agree it, one voice each; the date in gold; the warning, on the mime's notes, its link and its day; Jun types the description;
#    the calendar's date ringed, and a week crossed off at a time, one note a week, each quieter, down to none, and the tick; in the
#    pause, a chord; the board's three panels lit in their order, one voice each, as in Bogotá; and Bogotá for a moment, in G: the
#    mime's bow, and the officer touching his cap
ww = lambda lid, word, off=0: W('warn', lid, word, off)
wc = lambda lid, off=0: G('warn', lid, off)
pin(ww('brings', 'Yusuf brings') - 0.3 + 0.2, 0.022, px(470))
wr = ww('brings', 'every column') - 0.1; write(wr, END('warn', 'brings') - 0.2 - wr, 0.011, 0.0)
knock(max(ww('why', 'First, why') + 0.1, wc('why', 1.1)), 0.014, 0.0, 260)
g2 = ww('why', 'two numbers')
marker(g2, 0.010, 0.3, 0.5); marker(g2 + 0.25, 0.010, 0.5, 0.5)
up = ww('agree', 'stewards') + 0.2; dz = ww('agree', 'set a date') - 0.05
chord({'bsn': 51, 'cor': 55, 'oboe': 70}, up + 0.1, dz + 0.8, 0.7, step=0.15, att=0.3, rel=0.5)
write(ww('agree', 'date') - 0.1, 0.8, 0.011, 0.1)
wn = ww('warns', 'only warns') - 0.2
figure('oboe', [63, 67, 70], wn + 0.1, 0.15, 0.8, 'Eb')
tap(ww('links', 'links its page') - 0.1, 0.012, 0.1); tap(ww('links', 'names the day'), 0.012, 0.1)
ty = ww('links', 'names the day') + 0.8; ty1 = max(ty + 0.8, min(ty + 1.4, wc('gone', -1.7)))  # Jun's typing, as in the scene
keys(ty, 6, 0.010, 0.1, (ty1 - ty) / 6)
cz, wk = wc('gone', -0.6), ww('gone', 'Four weeks') - 0.1
marker(cz + 0.6, 0.012, 0.3, 0.8)
for k in range(5):  # Bb, Ab, G, F, then E-flat, the warnings' none
    note('cor', [70, 68, 67, 65, 63][k], wk + 0.62 * k + 0.05, 0.45 if k < 4 else 1.4, [0.85, 0.68, 0.53, 0.41, 0.32][k], att=0.05, rel=0.25)
    cross(wk + 0.62 * k, 0.012 if k < 2 else 0.008, 0.1)
pencil(ww('nothing', 'nothing left'), 0.010, 0.4, 0.3)
chord({'bsn': 51, 'cor': 58, 'oboe': 67}, END('warn', 'nothing') - 0.1, END('warn', 'nothing') + 2.2, 0.6, step=0.25, att=0.6, rel=0.6)
L5 = [ww('mime', 'The mime') - 0.1, ww('mime', 'The mime') + 0.45, ww('mime', 'before the fine')]
for t0_, (inst, m) in zip(L5, [('oboe', 70), ('cor', 55), ('bsn', 39)]):
    note(inst, m, t0_, END('warn', 'mime') + 0.5 - t0_, 0.75, att=0.15, rel=0.3)
    pencil(t0_ + 0.15, 0.008, 0.0, 0.35)
bo5 = END('warn', 'mime') + 0.5
figure('oboe', [74, 71, 67], bo5 + 0.4, 0.3, 0.8, 'G'); stacc('bsn', 43, bo5 + 1.05, 0.7, 'G')

# 6. Measured by use: the framed score glows on a hollow fifth; binder 29 drawn off the shelf, and opened; the frame lifted off its
#    nail, carried to the box and let in; the green marker along the policy's line, and the words under it; three sheets pinned up
#    where the frame hung, three notes rising, in the pause before they're read; and as they glow, used, a chord
mw = lambda lid, word, off=0: W('measured', lid, word, off)
mc = lambda lid, off=0: G('measured', lid, off)
chord({'bsn': 51, 'cor': 58}, mw('score', 'two point one') - 0.15, mc('binder', -0.5), 0.6, step=0.1, att=0.4, rel=0.5)
slide(mc('binder', -0.8) + 0.35, 0.018, px(1460))
flap(mw('binder', 'twenty-nine') - 0.1, 0.014, 0.1, 0.8)
fr = mc('nobody', -0.35)
wire(fr + 0.4, 0.014, px(1238)); into(walk_end(fr + 1.25, [[1238, 0], [560, 0]], 330) + 0.45, 0.018, px(560))
marker(mw('work', 'measured') - 0.2, 0.014, 0.2, 1.0); write(mw('work', 'the work') + 0.1, 1.35, 0.010, 0.2)
wz = END('measured', 'work') + 0.15
for i in range(3):
    pin(wz + 0.45 + 0.25 * i + 0.1, 0.020 if i < 2 else 0.014, [-0.4, 0.0, 0.4][i])
for i in range(3):
    note('oboe', [63, 67, 70][i], wz + 0.5 + 0.25 * i, 0.2 if i < 2 else 0.8, 0.7, att=0.03, rel=0.2 if i < 2 else 0.4)
used = mw('paper', 'used')
chord({'bsn': 51, 'cor': 55, 'oboe': 70}, used - 0.1, ST['measured']['start'] + ST['measured']['dur'] + 0.4, 0.75, step=0.15, att=0.4, rel=0.6)

# 7. Teachers of data: Yusuf's pencil on the clipboard (the first strokes, then softer); as he looks up and it teaches, the oboe plays
#    the phrase; the wheel drawn on the whiteboard, its centre and its parts (the first few, then softer) and the gold lines in; week 1
#    done; and as Anil shows the page that helped him, all three play the phrase in turn
xw = lambda lid, word, off=0: W('teach', lid, word, off)
xc = lambda lid, off=0: G('teach', lid, off)
teach = xw('day', 'It teaches')
for k in range(5):
    pencil(S0('teach') + 0.6 + 0.62 * k, 0.010 if k < 2 else 0.006, 0.15, 0.4)
phrase('oboe', TEACH['Eb'], teach + 0.05, 0.85)
c0 = xw('centre', 'the centre') + 0.15; p0 = xw('centre', 'data work') - 0.1; j0 = xw('centre', 'meets') - 0.1
marker(c0, 0.010, 0.0, 0.8)
for k in range(10):
    write(p0 + 0.27 * k, 0.3, 0.008 if k < 3 else 0.004, -0.4 + 0.08 * k)
marker(j0, 0.008, 0.0, 0.9)
tap(xw('path', 'practise') + 0.15, 0.010, -0.2)
ps = xw('pass', 'pass it on')
phrase('oboe', TEACH['Eb'], ps, 0.8); phrase('cor', TEACH['Eb'], ps + 1.9, 0.8); phrase('bsn', [m - 12 for m in TEACH['Eb']], ps + 3.8, 0.8)

# 8. What lasts: the binders thinner; the bar's three parts marked on the board; the grey pages dropped into the box; the five things
#    people need, one note each as its card goes up, the last held longest, and swelling as it glows: the hardest; Bogotá, 2012, in
#    E-flat minor, two cars rolling up to the faded stripes, and the oboe's phrase stopping a note short, nobody copying it; the
#    pavement, quiet; back in E-flat major as "Govern data" lights on the map, the next films' cards; the stewards, the phrase whole;
#    and the end card: the mark, the cor anglais, then the bassoon, and the chord held to the end
lw = lambda lid, word, off=0: W('lasts', lid, word, off)
lc = lambda lid, off=0: G('lasts', lid, off)
paper(S0('lasts') + 0.85, 0.012, px(1320), 1.0)
for s_ in ['ninety-two', 'sixty-four', 'fifty-nine']:
    write(lw('binder', s_) - 0.1, 0.8, 0.009, 0.0)
drop = END('lasts', 'binder') + 0.75
flutter(drop, 0.014, px(560), 0.45); into(drop + 0.35, 0.012, px(560))
five = [lw('needs', s_) - 0.15 for s_ in ['know why', 'want it', 'know how', 'be able', 'see it last']]
for k, t in enumerate(five):
    pin(t + 0.1, 0.018 if k < 2 else 0.012, -0.5 + 0.25 * k)
for k, t in enumerate(five[:4]):
    note('cor', [63, 65, 67, 68][k], t + 0.1, 0.6, 0.8, att=0.12, rel=0.3)
hard = lw('hardest', 'hardest') - 0.3
line('cor', [(five[4] + 0.1, hard, 70, 0.75), (hard, hard + 0.4, 70, 1.0), (hard + 0.4, hard + 0.7, 70, 0.85)], 0.8, att=0.2, rel=0.45, tie=True)
bo = lc('faded', -0.3)
car_in(bo + 2.0, 9, 0.009, -0.1, pre=0.6, idle=1.6); car_in(bo + 4.4, 8, 0.007, 0.25, pre=0.8, idle=1.0)
chord({'bsn': 51, 'cor': 54}, bo + 0.6, bo + 3.4, 0.6, step=0.2, att=0.5, rel=0.8)
line('oboe', [(bo + 0.6 + 0.42 * i, bo + 0.6 + 0.42 * (i + 1) if i < 3 else bo + 0.6 + 0.42 * 3 + 1.3, m, 0.85) for i, m in enumerate([66, 70, 68, 65])], 0.85, rel=0.6)
gov = lw('ends', 'something') - 0.2
chord({'bsn': 51, 'cor': 55}, gov, gov + 2.0, 0.6, step=0.2, att=0.5, rel=0.6)
nx = lw('ends', 'always') - 0.3
for j in range(3):
    knock(nx + 0.35 * j + 0.15, 0.014 if j < 2 else 0.010, [-0.3, 0.1, 0.5][j], 280)
mt = lc('agreed', -0.3)
phrase('oboe', TEACH['Eb'], mt + 0.6, 0.8)
end = lc('breath', -0.2)
mark('cor', 63, end + 0.7, 0.85, 'Eb')
mark('bsn', 51, end + 0.7 + 1.8 + 0.1, 0.85, 'Eb', last=TOT - (end + 0.7 + 1.9 + 1.35))
chord({'oboe': 67, 'cor': 70}, end + 0.7 + 1.9 + 1.35, TOT, 0.6, step=0.2, att=0.6, rel=0.5)
soften(2600)
