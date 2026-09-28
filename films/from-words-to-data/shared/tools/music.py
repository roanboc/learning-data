"""The series' instruments and sounds, synthesised in numpy, so every film can have its own music without samples.

Two buses: the music (ML, MR), which ducks under the voice, and the effects (XL, XR), which don't. A film's score
(source/tools/score.py) calls these functions with times from the film's own timeline; tools/audio.py mixes them.
Each film picks its own palette, so the seven films don't sound alike:

  pads      pad(chord, start, seconds, gain, tone)   tone: warm, strings, organ, choir, glass, reed
  notes     felt, kalimba, marimba, harp, lute, epiano, celesta, tbell, pluck, flute(m, start, seconds), bass(m, start, seconds)
  drums     framedrum, handdrum, shaker, woodblock, brush, kick, hat, clock
  patterns  prog, motif, ostinato, pulse, theme (the series' four-note motif, 1-5-6-3, in each film's key and instrument)
  effects   tick, thud, sweep, whoosh, chime, shimmer, bell, buzz, tone, pop, ping, and the series' own: chirp, trill, vervet,
            cry, hiss, bee, whistle, rumble, spark, clay, scratch, rustle, stamp, seal, key, ding, register, card, drawer,
            page, node, link, glitch, heartbeat, stone
"""
import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
ML = MR = XL = XR = None
N = 0
rng = np.random.default_rng(7)


def init(n):
    global ML, MR, XL, XR, N
    N = n
    ML, MR, XL, XR = (np.zeros(n, np.float32) for _ in range(4))


def tt(sec):
    return np.arange(max(1, int(sec * SR)), dtype=np.float32) / SR


def env(sec, a, r):
    m = max(1, int(sec * SR)); e = np.ones(m, np.float32); ai, ri = max(1, min(m, int(a * SR))), max(1, min(m, int(r * SR)))
    e[:ai] = np.linspace(0, 1, ai); e[m - ri:] *= np.linspace(1, 0, ri); return e


mf = lambda m: 440 * 2 ** ((m - 69) / 12)


def _put(L, R, sig, start, g, pan):
    # a sound that starts before 0:00 is trimmed, not skipped
    i = int(start * SR)
    if i < 0:
        sig = sig[-i:]; i = 0
    j = min(N, i + len(sig))
    if j <= i:
        return
    s = (sig[:j - i] * g).astype(np.float32); pan = max(-1.0, min(1.0, pan))
    L[i:j] += s * np.float32(np.sqrt(0.5 * (1 - pan))); R[i:j] += s * np.float32(np.sqrt(0.5 * (1 + pan)))


def put(sig, start, g=1.0, pan=0.0):
    _put(ML, MR, sig, start, g, pan)


def X(sig, start, g=0.3, pan=0.0):
    _put(XL, XR, np.asarray(sig, np.float32), start, g, pan)


def filt(x, kind, f, order=2):
    """low, high or band ("band" takes f=(lo, hi)) filtering, for noise and brightness."""
    if kind == 'band':
        sos = butter(order, [f[0] / (SR / 2), min(0.99, f[1] / (SR / 2))], btype='band', output='sos')
    else:
        sos = butter(order, min(0.99, f / (SR / 2)), btype='low' if kind == 'low' else 'high', output='sos')
    return sosfilt(sos, x).astype(np.float32)


def noise(sec):
    return rng.standard_normal(int(sec * SR)).astype(np.float32)


def norm(s):
    p = float(np.abs(s).max()) if len(s) else 0
    return s / p if p > 0 else s


# ---------------------------------------------------------------- pads
FORMANT = {'ah': [(700, 1.0, 110), (1150, 0.5, 120), (2400, 0.25, 160)], 'oo': [(320, 1.0, 80), (800, 0.35, 100), (2300, 0.08, 150)],
           'eh': [(530, 1.0, 90), (1850, 0.45, 140), (2500, 0.25, 160)]}


def _voice(f, x, tone, vib):
    ph = 2 * np.pi * f * x + (vib * np.sin(2 * np.pi * 5.2 * x) / 5.2 if vib else 0)
    if tone == 'warm':
        return np.sin(ph) + 0.18 * np.sin(2 * ph)
    if tone == 'strings':
        return sum(np.sin(k * ph) * (1 / k) * np.exp(-0.28 * k) for k in range(1, 10)) * 1.4
    if tone == 'organ':
        return sum(np.sin(k * ph) * w for k, w in ((1, 1), (2, 0.6), (3, 0.42), (4, 0.25), (6, 0.15), (8, 0.1)))
    if tone == 'reed':
        return sum(np.sin(k * ph) * w for k, w in ((1, 1), (3, 0.5), (5, 0.3), (7, 0.18), (9, 0.1)))
    if tone.startswith('choir'):
        fm = FORMANT[tone.split('-')[1] if '-' in tone else 'ah']
        return sum(np.sin(k * ph) * sum(a * np.exp(-((k * f - c) / bw) ** 2 / 2) for c, a, bw in fm) for k in range(1, 16)) * 1.6 + 0.05 * np.sin(ph)
    if tone == 'glass':
        idx = 0.8 + 0.5 * np.sin(2 * np.pi * 0.11 * x)
        return np.sin(ph + idx * np.sin(2 * ph)) * 0.8 + 0.15 * np.sin(4 * ph)
    return np.sin(ph)


def pad(ch, start, sec, g=0.04, tone='warm'):
    """a held chord, three slightly detuned voices across the stereo field, with slow swells"""
    x = tt(sec); e = env(sec, {'organ': 0.6, 'reed': 0.8}.get(tone, 2.4), 3.0); sw = 1 + 0.08 * np.sin(2 * np.pi * 0.07 * x)
    vib = {'strings': 0.004, 'choir': 0.006}.get(tone.split('-')[0], 0)
    for pan, det in ((-0.8, 0.997), (0.8, 1.003), (0.0, 1.0)):
        s = np.zeros_like(x)
        for m in ch:
            s += _voice(mf(m) * det, x, tone, vib * mf(m) * 2 * np.pi if vib else 0).astype(np.float32)
        if tone.startswith('choir'):
            s += 0.02 * filt(noise(sec), 'band', (500, 2600)) * len(ch)
        put(s * e * sw / len(ch), start, g * (0.7 if pan == 0 else 1), pan)


def drone(m, start, sec, g=0.025, tone='sine'):
    x = tt(sec); f = mf(m)
    s = np.sin(2 * np.pi * f * x) if tone == 'sine' else _voice(f, x, tone, 0) * 0.6
    put((s * env(sec, 3, 3)).astype(np.float32), start, g, 0)


# ---------------------------------------------------------------- notes
def _strike(parts, sec, f, click=0.0):
    x = tt(sec); s = sum(np.sin(2 * np.pi * f * r * x + r) * np.exp(-x / d) * a for r, d, a in parts)
    s = s * np.minimum(1, x / 0.004)
    if click:
        s = s + click * filt(noise(sec), 'high', 2000) * np.exp(-x * 120)
    return norm(s.astype(np.float32))


def felt(m, start, g=0.05, pan=0.0):
    f = mf(m); x = tt(3.2)
    s = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (1.1 + 0.9 * k)) * w for k, w in ((1, 1), (2, 0.35), (3, 0.12), (4, 0.05)))
    put((s * np.minimum(1, x / 0.008)).astype(np.float32), start, g, pan)


def kalimba(m, start, g=0.05, pan=0.0):
    put(_strike([(1, 1.4, 1), (6.2, 0.09, 0.35), (3.0, 0.25, 0.08)], 2.4, mf(m), 0.15), start, g, pan)


def marimba(m, start, g=0.05, pan=0.0):
    put(_strike([(1, 0.5, 1), (3.93, 0.09, 0.4), (9.2, 0.03, 0.2)], 1.3, mf(m), 0.1), start, g, pan)


def celesta(m, start, g=0.04, pan=0.0):
    put(_strike([(1, 1.1, 1), (4, 0.3, 0.3), (8.2, 0.08, 0.08)], 2.0, mf(m)), start, g, pan)


def tbell(m, start, g=0.05, pan=0.0, sec=4.0):
    put(_strike([(0.5, sec * 0.9, 0.6), (1, sec * 0.75, 1), (1.19, sec * 0.55, 0.5), (1.56, sec * 0.45, 0.4), (2.0, sec * 0.37, 0.35), (2.74, sec * 0.25, 0.25), (3.0, sec * 0.2, 0.2)], sec, mf(m)), start, g, pan)


def harp(m, start, g=0.05, pan=0.0, bright=1.0, sec=2.6):
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) * (1 / k ** (1.6 / bright)) * np.exp(-x * (0.9 + 0.55 * k * k / bright)) for k in range(1, 11))
    s = s * np.minimum(1, x / 0.003) + 0.05 * filt(noise(sec), 'band', (f * 2, f * 6)) * np.exp(-x * 60)
    put(norm(s.astype(np.float32)), start, g, pan)


def lute(m, start, g=0.05, pan=0.0):
    harp(m, start, g, pan, bright=1.7, sec=1.6)


def epiano(m, start, g=0.05, pan=0.0, sec=2.8):
    f = mf(m); x = tt(sec); idx = 1.8 * np.exp(-x * 3.5) + 0.25
    s = np.sin(2 * np.pi * f * x + idx * np.sin(2 * np.pi * f * x)) * np.exp(-x * 0.9) + 0.12 * np.sin(2 * np.pi * f * 14 * x) * np.exp(-x * 30)
    s = s * np.minimum(1, x / 0.004) * (1 + 0.12 * np.sin(2 * np.pi * 4.5 * x))
    put(norm(s.astype(np.float32)), start, g, pan)


def pluck(m, start, g=0.04, pan=0.0, sec=0.9, bright=1.0):
    """a synth pluck: a bright harmonic tone whose brightness falls fast, like a filter closing"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x) * (1 / k) * np.exp(-x * (2.0 + 5.0 * k / bright)) for k in range(1, 13))
    put(norm((s * np.minimum(1, x / 0.003)).astype(np.float32)), start, g, pan)


def flute(m, start, sec, g=0.04, pan=0.0):
    f = mf(m); x = tt(sec); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.0 * x) * np.minimum(1, x / 0.6)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)
    br = filt(noise(sec), 'band', (f * 0.8, f * 2.2)) * 0.25
    put(norm(((s + br) * env(sec, 0.12, min(0.4, sec * 0.4))).astype(np.float32)), start, g, pan)


def bass(m, start, sec, g=0.05, pan=0.0, pluck_=True):
    f = mf(m); x = tt(sec); s = np.sin(2 * np.pi * f * x) + 0.3 * np.sin(4 * np.pi * f * x) * np.exp(-x * 4)
    e = np.exp(-x * 1.4) if pluck_ else 1
    put(norm((s * e * env(sec, 0.01, 0.12)).astype(np.float32)), start, g, pan)


# ---------------------------------------------------------------- drums
def framedrum(start, g=0.06, pan=0.0, f0=110):
    x = tt(0.7); ph = 2 * np.pi * np.cumsum(f0 * (0.6 + 0.4 * np.exp(-x * 12))) / SR
    s = np.sin(ph) * np.exp(-x * 5.5) + 0.35 * filt(noise(0.7), 'band', (180, 1400)) * np.exp(-x * 30)
    X(norm(s), start, g, pan)


def handdrum(start, g=0.05, pan=0.0):
    framedrum(start, g, pan, 190)


def shaker(start, g=0.03, pan=0.0):
    x = tt(0.12); X(filt(noise(0.12), 'high', 5000) * np.sin(np.pi * x / 0.12) ** 2, start, g, pan)


def woodblock(start, g=0.05, pan=0.0, f=820):
    x = tt(0.1); X(norm(np.sin(2 * np.pi * f * x) * np.exp(-x * 60) + 0.5 * np.sin(2 * np.pi * f * 2.7 * x) * np.exp(-x * 90)), start, g, pan)


def brush(start, g=0.03, pan=0.0, sec=0.28):
    x = tt(sec); X(filt(noise(sec), 'band', (1500, 7000)) * np.sin(np.pi * x / sec) ** 1.5, start, g, pan)


def kick(start, g=0.06):
    x = tt(0.4); ph = 2 * np.pi * np.cumsum(50 + 90 * np.exp(-x * 30)) / SR; X(norm(np.sin(ph) * np.exp(-x * 8)), start, g, 0)


def hat(start, g=0.02, pan=0.2):
    x = tt(0.05); X(filt(noise(0.05), 'high', 7000) * np.exp(-x * 90), start, g, pan)


def clock(start, g=0.05, pan=0.0, hi=True):
    x = tt(0.04); X(norm(np.sin(2 * np.pi * (3200 if hi else 2400) * x) * np.exp(-x * 160) + 0.4 * filt(noise(0.04), 'high', 3000) * np.exp(-x * 200)), start, g, pan)


# ---------------------------------------------------------------- patterns
ST = {}


def span(sid, a=None, b=None):
    s0 = ST[sid]['start'] + (a or 0); s1 = ST[sid]['start'] + (b if b is not None else ST[sid]['dur']); return s0, s1


def prog(sid, chords, a=None, b=None, g=0.06, tone='warm', bassg=0.035, btone='sine'):
    """chords spread over a chapter, each starting 2 s early and lasting 4 s longer, so the bed never drops out"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        pad(ch, s0 + i * d - 2.0, d + 4.0, g, tone)
        if bassg:
            drone(ch[0] - 12, s0 + i * d - 2.0, d + 4.0, bassg, btone)


mrng = np.random.default_rng(11)


def motif(sid, chords, a=None, b=None, every=1.5, g=0.045, inst=felt, up=12):
    """sparse notes from each chord, drifting across the stereo field"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords); t0 = s0 + 0.4
    while t0 < s1 - 0.5:
        ch = chords[min(len(chords) - 1, int((t0 - s0) / d))]; m = ch[int(mrng.integers(1, len(ch)))] + up + (12 if mrng.random() < 0.25 else 0)
        inst(m, t0, g * (0.8 + 0.4 * mrng.random()), float(mrng.uniform(-0.6, 0.6))); t0 += every * (0.75 + 0.5 * mrng.random())


def ostinato(s0, s1, notes, step, inst=marimba, g=0.035, pan=0.0, fade=2.0, swing=0.0):
    """a repeated figure, fading in and out rather than stopping dead"""
    t0 = s0; k = 0
    while t0 < s1:
        f = min(1, (t0 - s0) / fade + 0.05, (s1 - t0) / fade)
        inst(notes[k % len(notes)], t0 + (swing * step if k % 2 else 0), g * f, pan); t0 += step; k += 1


def pulse(s0, s1, bpm, pattern, g=1.0, fade=3.0):
    """a rhythm: pattern is a list of (beat, function, gain, pan) repeated every bar of len(beats) beats"""
    per = 60 / bpm; bar = max(p[0] for p in pattern) // 1 + 1; t0 = s0
    while t0 < s1:
        for beat, fn, gg, pn in pattern:
            tt_ = t0 + beat * per
            if tt_ < s1:
                f = min(1, (tt_ - s0) / fade + 0.05, (s1 - tt_) / fade); fn(tt_, gg * g * f, pn)
        t0 += bar * per


MOTIF = [0, 7, 9, 4]


def theme(start, root, inst=felt, step=0.42, g=0.06, pan=0.0, last=2.4):
    """the series' four notes, 1-5-6-3: one in each film, in its own key and on its own instrument"""
    for i, iv in enumerate(MOTIF):
        inst(root + iv, start + i * step, g * (1.1 if i == 3 else 1), pan + (i - 1.5) * 0.12)
    return start + 3 * step + last


# ---------------------------------------------------------------- effects
def tick(s, g=0.18, pan=0):
    x = tt(0.05); X(np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 90), s, g, pan)


def thud(s, g=0.4):
    x = tt(0.5); X(np.sin(2 * np.pi * 70 * x) * np.exp(-x * 9) + 0.2 * rng.standard_normal(len(x)) * np.exp(-x * 30), s, g)


def sweep(s, sec=1.0, g=0.08, f0=500, f1=3000, pan=0.3):
    x = tt(sec); ph = 2 * np.pi * np.cumsum(f0 + (f1 - f0) * (x / sec)) / SR; X(np.sin(ph) * np.sin(np.pi * x / sec), s, g, pan)


def whoosh(s, sec=0.9, g=0.12, pan=0.0):
    x = tt(sec); nz = filt(noise(sec), 'band', (300, 3000)); X(nz * np.sin(np.pi * x / sec) ** 2 * 2, s, g, pan)


def chime(s, g=0.16, f=880, pan=0.0):
    x = tt(2.0); X(sum(np.sin(2 * np.pi * f * r * x) * np.exp(-x / d) * a for r, d, a in [(1, 1.6, 1), (2.76, 1.0, 0.5), (5.4, 0.6, 0.3), (8.93, 0.35, 0.15)]), s, g, pan)


def shimmer(s, g=0.05, f=1760):
    x = tt(3.0); X((np.sin(2 * np.pi * f * x) + 0.6 * np.sin(2 * np.pi * f * 1.5 * x)) * np.minimum(1, x / 0.5) * np.exp(-x * 0.9), s, g)


def bell(s, g=0.18, f=523):
    x = tt(4.0); X(sum(np.sin(2 * np.pi * f * r * x) * np.exp(-x / d) * a for r, d, a in [(0.5, 3.5, 0.6), (1, 3.0, 1), (1.19, 2.2, 0.5), (1.56, 1.8, 0.4), (2.0, 1.5, 0.35), (2.74, 1.0, 0.25), (3.0, 0.8, 0.2)]), s, g)


def buzz(s, g=0.12):
    x = tt(0.35); X(np.sign(np.sin(2 * np.pi * 110 * x)) * np.exp(-x * 6) * 0.6 + np.sin(2 * np.pi * 220 * x) * np.exp(-x * 8) * 0.4, s, g)


def tone(s, g=0.24, f=660):
    x = tt(3.2); X((np.sin(2 * np.pi * f * x) + 0.2 * np.sin(4 * np.pi * f * x)) * np.minimum(1, x / 0.3) * np.exp(-x * 0.8), s, g)


def pop(s, g=0.14, pan=0.0):
    x = tt(0.12); X(np.sin(2 * np.pi * (900 + 2000 * x) * x) * np.exp(-x * 30), s, g, pan)


def ping(s, g=0.1, pan=0.0):
    chime(s, g, 1318, pan)


def chirp(s, g=0.06, pan=0.0, f=3200, n=3):
    """a small bird: quick falling whistles"""
    for k in range(n):
        x = tt(0.09); fr = f * (1.25 - 0.45 * x / 0.09) * (1 + 0.05 * k)
        X(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * x / 0.09), s + k * 0.13, g, pan)


def trill(s, g=0.05, pan=0.0, f=2600, sec=0.6):
    x = tt(sec); fr = f * (1 + 0.08 * np.sign(np.sin(2 * np.pi * 22 * x))); X(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * x / sec), s, g, pan)


def vervet(s, g=0.06, pan=0.0, kind='leopard'):
    """a monkey's alarm call, stylised: leopard, short loud barks; eagle, a low double cough; snake, a chutter"""
    spec = {'leopard': (6, 0.09, 0.16, 900), 'eagle': (2, 0.14, 0.28, 520), 'snake': (10, 0.04, 0.07, 1400)}[kind]
    n, d, gap, f = spec
    for k in range(n):
        x = tt(d); nz = filt(noise(d), 'band', (f * 0.7, f * 1.6)); v = np.sin(2 * np.pi * f * 0.5 * x) * 0.5
        X((nz * 1.5 + v) * np.sin(np.pi * x / d), s + k * gap, g, pan)


def cry(s, g=0.05, pan=0.0):
    """a raptor's call, far off and gentle"""
    x = tt(0.9); fr = 2600 - 900 * (x / 0.9) ** 0.7; X(np.sin(2 * np.pi * np.cumsum(fr) / SR + 0.6 * np.sin(2 * np.pi * 30 * x)) * np.sin(np.pi * x / 0.9) ** 1.2, s, g, pan)


def hiss(s, g=0.04, pan=0.0, sec=1.0):
    x = tt(sec); X(filt(noise(sec), 'high', 4500) * np.sin(np.pi * x / sec), s, g, pan)


def bee(s, g=0.04, pan=0.0, sec=1.6):
    x = tt(sec); f = 230 * (1 + 0.03 * np.sin(2 * np.pi * 3 * x)); ph = 2 * np.pi * np.cumsum(f) / SR
    X(filt(np.sign(np.sin(ph)).astype(np.float32), 'low', 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * x)) * np.sin(np.pi * x / sec), s, g, pan)


def whistle(s, g=0.04, pan=0.0):
    """a dolphin's signature whistle: one shape of rising and falling pitch, its name"""
    x = tt(1.1); fr = 7000 + 3500 * np.sin(np.pi * x / 1.1 * 1.5) * np.sin(np.pi * x / 1.1); X(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * x / 1.1) ** 1.5, s, g, pan)


def rumble(s, g=0.08, pan=0.0):
    """an elephant's low rumble, lifted an octave or two so small speakers carry it"""
    x = tt(1.6); f = 70 + 12 * np.sin(np.pi * x / 1.6); ph = 2 * np.pi * np.cumsum(f) / SR
    X(norm((np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)) * np.sin(np.pi * x / 1.6)), s, g, pan)


def spark(s, g=0.05, pan=0.0, f=4200):
    x = tt(0.35); X(np.sin(2 * np.pi * f * x) * np.exp(-x * 18) + 0.4 * np.sin(2 * np.pi * f * 1.5 * x) * np.exp(-x * 25), s, g, pan)


def clay(s, g=0.1, pan=0.0):
    x = tt(0.2); X(norm(np.sin(2 * np.pi * 230 * x) * np.exp(-x * 35) + 0.8 * filt(noise(0.2), 'band', (300, 1600)) * np.exp(-x * 45)), s, g, pan)


def scratch(s, g=0.05, pan=0.0, sec=0.8):
    """a pen or stylus on a surface: bursts of bright noise"""
    x = tt(sec); nz = filt(noise(sec), 'band', (2500, 8000)); gate = (np.sin(2 * np.pi * 9 * x + 3 * np.sin(2 * np.pi * 2.3 * x)) > 0.2).astype(np.float32)
    X(nz * filt(gate, 'low', 60) * np.sin(np.pi * x / sec), s, g, pan)


def rustle(s, g=0.05, pan=0.0, sec=0.6):
    x = tt(sec); nz = filt(noise(sec), 'band', (1200, 6000)) * (rng.random(len(x)) < 0.25); X(filt(nz.astype(np.float32), 'low', 5000) * np.sin(np.pi * x / sec) * 2, s, g, pan)


def stamp(s, g=0.14, pan=0.0):
    thud(s, g * 0.8); x = tt(0.06); X(filt(noise(0.06), 'high', 1500) * np.exp(-x * 80), s + 0.01, g, pan)


def seal(s, g=0.12, pan=0.0):
    """wax pressed under a seal: a soft squash and a low thud"""
    x = tt(0.5); X(filt(noise(0.5), 'low', 700) * np.exp(-x * 8) * 1.5, s, g, pan); thud(s + 0.05, g * 0.6)


def key(s, g=0.06, pan=0.0):
    x = tt(0.07); X(norm(filt(noise(0.07), 'band', (1500, 6000)) * np.exp(-x * 110) + 0.4 * np.sin(2 * np.pi * 900 * x) * np.exp(-x * 140)), s, g, pan)


def ding(s, g=0.08, pan=0.0, f=2093):
    x = tt(1.4); X(np.sin(2 * np.pi * f * x) * np.exp(-x * 3) + 0.3 * np.sin(2 * np.pi * f * 2.4 * x) * np.exp(-x * 6), s, g, pan)


def register(s, g=0.1, pan=0.0):
    """a cash register: keys, a bell, and the drawer"""
    for k in range(3):
        key(s + k * 0.09, g * 0.8, pan)
    ding(s + 0.32, g, pan, 1760); drawer(s + 0.42, g * 0.8, pan, 0.35)


def card(s, g=0.05, pan=0.0):
    x = tt(0.14); X(filt(noise(0.14), 'band', (1800, 7000)) * np.sin(np.pi * x / 0.14) ** 2, s, g, pan); tick(s + 0.12, g * 0.4, pan)


def drawer(s, g=0.06, pan=0.0, sec=0.5):
    x = tt(sec); X(filt(noise(sec), 'band', (200, 1500)) * np.sin(np.pi * x / sec) * (1 + 0.5 * np.sin(2 * np.pi * 30 * x)), s, g, pan); thud(s + sec * 0.95, g * 0.5)


def page(s, g=0.05, pan=0.0):
    x = tt(0.5); X(filt(noise(0.5), 'band', (800, 5000)) * np.sin(np.pi * x / 0.5) ** 2 * (1 + 0.6 * np.sin(2 * np.pi * 14 * x)), s, g, pan)


def node(s, g=0.05, pan=0.0, f=1568):
    """a point of meaning lighting up: a soft, glassy FM ping"""
    x = tt(1.2); X(np.sin(2 * np.pi * f * x + 1.5 * np.exp(-x * 6) * np.sin(2 * np.pi * f * 3.5 * x)) * np.exp(-x * 3.2), s, g, pan)


def link(s, g=0.04, pan=0.0, sec=0.35):
    x = tt(sec); fr = 800 + 2200 * (x / sec) ** 1.5; X(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * x / sec), s, g, pan)


def glitch(s, g=0.05, pan=0.0):
    x = tt(0.3); X(np.sign(np.sin(2 * np.pi * 180 * x)) * (np.sin(2 * np.pi * 23 * x) > 0) * np.exp(-x * 7) * 0.6, s, g, pan)


def heartbeat(s, g=0.08):
    for d in (0, 0.28):
        x = tt(0.3); X(norm(np.sin(2 * np.pi * 55 * x) * np.exp(-x * 14)), s + d, g * (1 if d == 0 else 0.7), 0)


def stone(s, g=0.1, pan=0.0):
    """a chisel on stone, or a stylus pressed into clay: a hard, short knock"""
    x = tt(0.15); X(norm(np.sin(2 * np.pi * 520 * x) * np.exp(-x * 50) + filt(noise(0.15), 'band', (900, 4000)) * np.exp(-x * 60)), s, g, pan)
