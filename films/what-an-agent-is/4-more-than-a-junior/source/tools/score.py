# More than a junior: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, chosen on 3 November 2026 and checked against every score.py on main and on every branch, and against the series' other
# films (palettes.md): two instruments, both made here, as music.py has neither.
#  - A concert zither: a flat box of strings on a table, the melody strings plucked with a thumb's plectrum and the open strings below
#    them with the fingers. Each string rings softly for seconds and fades, its higher partials first. It is the counting: Hans's taps,
#    and in the room the agent reading, card after card; it holds the chords too.
#  - A heckelphone: the double reed an octave below the oboe, which Wilhelm Heckel's workshop presented in Germany in September 1904,
#    the autumn of the story. A full, reedy voice, held steady with no vibrato. It is the lift: a small rising step, a second, whenever
#    someone gives the answer away without knowing (the questioner's head; the hint in a question). It also carries the solution's
#    line and the close.
# Neither belongs to a tradition whose music the film could borrow, and nothing here imitates the music of any culture: no mode, ornament
# or rhythm of any tradition, only a major key, its chords and a count.
# The marks mean the same all through:
#  - The count: the zither plucks one note, F, for each tap or card, and stops on the answer, B flat, a fourth above. A count that gets
#    it wrong stops a semitone short, on A, left hanging; a count with no answer runs on, or stops mid-count.
#  - The lift: the heckelphone's A rising to B flat, as a head lifts or a hint lands; never otherwise a rising second.
#  - The solution: the heckelphone's home note, B flat, held, with a line that rises by thirds and falls home.
#  - More, and less: two zither notes rising for the two ways the agent is more than a junior, three falling for the three it is less.
#  - The film's mark, under the title and the end card: the count, F F F and B flat, and the lift over it.
# B-flat major, tuned pure from B flat (just intonation, see hz()), so a chord's notes are whole-number ratios of each other and nothing
# beats. The scale's one impure fifth, C to G, never sounds: no chord holds both, and no run rings them together.
# The rules the series keeps (its briefs, 3 November 2026, as the governance and master data films did):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than
#    half its length, or for 12 seconds without a break.
#  - Nothing trembles or pulses: one string to a note, plucked again only once its last pluck is damped; the reed with no vibrato; every
#    chord tuned pure; and no urgent pulse anywhere, even as the 33 tables turn amber (film.json lists no chapter in "urgent").
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed; Hans's taps are replayed from the
#    picture's own formula (a tap strikes the cobbles 0.37 s after it starts).
# And everything stays low and soft, below about 2.5 kHz: the zither and the heckelphone matched by loudness, the effects about 12 dB under.

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
def unsmooth(y):
    """when the film's ag_in() (a smoothstep) reaches y: the inverse of 3u^2 - 2u^3"""
    y = min(1.0, max(0.0, y)); return 0.5 - np.sin(np.arcsin(1 - 2 * y) / 3)
R4 = np.random.default_rng(1904)  # this film's own randomness: the plucks, the reed's breath, the paper, the cobbles
STRIKE = 0.37                     # a tap strikes the ground this long after it starts (MJ_STRIKE in src/scenes.js)
taps = lambda t0, n, gap: [t0 + i * gap for i in range(n)]

# ---- tuning: just intonation from B flat. B-flat major's chords that the film plays (B flat, E flat, F, G minor, D minor) are all pure
# in this table; C to G is the scale's one narrow fifth, so nothing holds the two together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
BB3 = 233.08
def hz(m):
    o, pc = divmod(m - 58, 12)
    return BB3 * 2 ** o * _JI[pc]
Bb1, F2, Bb2, D3, Eb3, F3, G3, A3, Bb3, C4, D4, Eb4, F4, G4, A4, Bb4, C5, D5, Eb5, F5, G5, A5, Bb5 = \
    34, 41, 46, 50, 51, 53, 55, 57, 58, 60, 62, 63, 65, 67, 69, 70, 72, 74, 75, 77, 79, 81, 82
Eb2, G2, D2 = 39, 43, 38
CH_BB = (Bb2, F3, Bb3, D4, F4)      # B flat, rolled up the open strings
CH_EB = (Eb3, Bb3, Eb4, G4)          # E flat
CH_GM = (G2, D3, G3, Bb3, D4)        # G minor
CH_F = (F2, F3, A3, F4)              # F, without its fifth (C), so nothing rings against a G
CH_DM = (D3, A3, D4, F4)             # D minor
COUNT, ANSWER, SHORT = F4, Bb4, A4   # the count's note, the answer, and the answer missed by a semitone
ARP = (Bb2, D3, F3, Bb3, D4, F4, Bb4, D5, F5, Bb5)  # B-flat major up the strings, for a sweep

# ---- the levels: the zither and the heckelphone matched by loudness (a plucked note's first second against a held reed note), about as
# far under the voice as the series' other music; the effects about 12 dB under the music (FX scales them all)
# After the author's review of the series' opening films (4 November 2026), the music is 3.5 dB lower and the effects 4 dB, so
# the music's and the effects' loud moments sit as low as the governance films' (tools/quiet.py measures them)
ZL, HL, FX = 0.080, 0.057, 2.3

# a small room round the instruments, ringing on for about a second and a half
_IR = (lambda x: (R4.standard_normal(len(x)) * np.exp(-6.9 * x / 1.45)).astype(np.float32))(np.arange(int(1.45 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.016 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds)"""
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out

# ---- the concert zither: a steel string plucked near the bridge, by the thumb's plectrum (bright) or a finger (soft). Its partials are
# the string's own, all but harmonic, weighted by where it is plucked; the box lifts them round 270 and 560 Hz. Each fades in two
# stages, quickly and then slowly, the higher ones first, and the pluck itself is a short soft scrape. One string to a note: a string
# plucked again is damped first, and a note can be damped at a time of its own (a chapter's cut, a hand on the strings)
_Z = []
def zit(m, s, g=1.0, pan=None, soft=False, until=None):
    """a string plucked at s"""
    _Z.append(dict(m=m, s=s, g=g, pan=pan, soft=soft, until=until))
def _zsig(f0, sec, soft):
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    beta, p = (0.19, 1.45) if soft else (0.125, 1.1)
    tau1 = (3.0 if soft else 2.6) * (233.0 / f0) ** 0.38; sig = np.zeros(n)
    for k in range(1, 40):
        fk = k * f0 * np.sqrt(1 + 5e-6 * k * k)
        if fk >= 2350:
            break
        ak = abs(np.sin(np.pi * k * beta)) / k ** p
        ak *= (1 + 0.6 * np.exp(-((fk - 270) / 110) ** 2) + 0.35 * np.exp(-((fk - 560) / 170) ** 2) + 0.2 * np.exp(-((fk - 1150) / 300) ** 2))
        ak *= np.exp(-fk / (1700 if soft else 2600))
        tk = tau1 / (1 + 0.3 * (k - 1))
        sig += ak * (0.5 * np.exp(-x / (0.2 * tk)) + 0.5 * np.exp(-x / tk)) * np.sin(2 * np.pi * fk * x + 0.7 * k)
    sig *= 1 - np.exp(-x / (0.0035 if soft else 0.0015))
    m = min(n, int(0.03 * SR)); nz = filt(R4.standard_normal(m).astype(np.float32), 'band', (500, 2000)).astype(np.float64)
    sig[:m] += (0.025 if soft else 0.05) * float(np.abs(sig).max()) * nz / max(1e-9, float(np.abs(nz).max())) * np.exp(-x[:m] / (0.006 if soft else 0.004))
    return norm(filt(sig.astype(np.float32), 'low', 2300, 4))
_ZC = {}
def zflush():
    """every string as it was plucked, each damped at its next pluck or its own time, then into the room"""
    ev = sorted(_Z, key=lambda e: e['s'])
    for i, e in enumerate(ev):
        nxt = next((f['s'] for f in ev[i + 1:] if f['m'] == e['m']), None)
        stop = min([v for v in (nxt, e['until']) if v is not None], default=None)
        f0 = hz(e['m']); sec = min(6.0, 4.6 * (3.0 if e['soft'] else 2.6) * (233.0 / f0) ** 0.38)
        key = (e['m'], e['soft'])
        if key not in _ZC:
            _ZC[key] = _zsig(f0, sec, e['soft'])
        sig = _ZC[key].copy()
        if stop is not None and stop - e['s'] < sec:
            j = max(1, int((stop - e['s']) * SR)); d = int(0.06 * SR)
            sig = sig[:j + d]; sig[j:] *= np.linspace(1, 0, len(sig) - j, dtype=np.float32)
        sig = _room(sig, 0.28, 0.0, min(1.0, len(sig) / SR))
        pan = max(-0.3, min(0.3, (e['m'] - 62) * 0.02)) if e['pan'] is None else e['pan']
        put(sig, e['s'], e['g'] * ZL, pan)
def roll(chord, s, step=0.075, g=0.75, pan=None, soft=True, until=None):
    """a chord rolled up the open strings, a finger at a time"""
    for i, m in enumerate(chord):
        zit(m, s + step * i, g * (1.0 if i else 0.9), pan, soft, until)
def count(times, g=0.7, answer=ANSWER, pan=None, until=None):
    """the count: F for each time but the last, which is the answer (or None, for a count that stops without one)"""
    for i, t in enumerate(times):
        last = i == len(times) - 1
        zit(answer if last and answer else COUNT, t, g * (1.15 if last and answer else 1.0), pan, False, until)
def sweep(s, sec, notes=ARP, g=0.45, pan=None, eased=True, until=None):
    """one soft sweep across the strings, its notes as a smoothstep fill reaches them (or evenly)"""
    for j, m in enumerate(notes):
        u = j / max(1, len(notes) - 1)
        zit(m, s + sec * (unsmooth(u) if eased else u), g, pan, True, until)

# ---- the heckelphone: a wide conical bore and a double reed. A full series of harmonics through the reed's formants (strongest round
# 600 Hz, a second round 1.45 kHz), the higher ones speaking a moment later and leaving first; a little breath through the reed while it
# plays. A phrase is one breath: its notes slurred into each other in 25 ms, as one player moves a finger, so no two of its notes sound
# together. Held steady, with no vibrato
def heck(phrase, s, g=1.0, pan=0.12, att=0.13, rel=0.45, room=0.3):
    """a phrase [(note, seconds), ...] from s, legato"""
    tot = sum(d for _, d in phrase); n = int((tot + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    f = np.empty(n); t0 = 0.0
    for i, (m, d) in enumerate(phrase):
        i0 = int(t0 * SR); i1 = n if i == len(phrase) - 1 else int((t0 + d) * SR); f[i0:i1] = hz(m); t0 += d
    k25 = np.hanning(int(0.025 * SR)); k25 /= k25.sum(); f = np.convolve(np.pad(f, (len(k25), len(k25)), mode='edge'), k25, 'same')[len(k25):-len(k25)]
    ph = 2 * np.pi * np.cumsum(f) / SR
    on = lambda d: np.sin(0.5 * np.pi * np.minimum(x / d, 1)) ** 2
    sig = np.zeros(n)
    for k in range(1, 14):
        fk = k * f
        if fk.min() >= 2350:
            break
        form = 0.22 + np.exp(-((fk - 600) / 230) ** 2) + 0.55 * np.exp(-((fk - 1450) / 320) ** 2) + 0.15 * np.exp(-((fk - 2150) / 300) ** 2)
        ak = form / k ** 0.75 * np.exp(-fk / 1900) * (fk < 2350)
        off = np.where(x > tot, np.exp(-(x - tot) * (3.0 + 0.6 * (k - 1)) / rel), 1.0)
        sig += ak * on(att * (1 + 0.25 * (k - 1))) * off * np.sin(k * ph + 0.6 * k)
    sig /= max(1e-9, float(np.abs(sig).max()))
    br = filt(R4.standard_normal(n).astype(np.float32), 'band', (450, 1700)).astype(np.float64)
    sig += 0.012 * br / max(1e-9, float(np.abs(br).max())) * on(att) * np.where(x > tot, np.exp(-(x - tot) * 6 / rel), 1.0)
    sig = filt(sig.astype(np.float32), 'low', 2350, 4)
    put(_room(sig, room, min(att * 2, tot * 0.5), tot), s, g * HL, pan)
def lift(s_up, hold=1.5, g=0.8, pan=0.12):
    """the lift: A, rising to B flat at s_up"""
    heck([(A3, 0.42), (Bb3, hold)], s_up - 0.42, g, pan, att=0.1, rel=0.5)
def home(s, line=((Bb3, 2.2),), g=0.8, pan=0.12):
    """the solution: the home note held, and its line"""
    heck(list(line), s, g, pan, att=0.22, rel=0.6)

# ---- the effects, soft and low, on the effects bus
def _x(sig, s, g, pan):
    X(norm(filt(np.asarray(sig, np.float32), 'low', 2200)), s, g * FX, pan)
def hoof(s, g=0.011, pan=0.0):
    """a hoof on the cobbles: a dull wooden knock, a low thud and a little grit"""
    x = tt(0.16).astype(np.float64)
    k = np.sin(2 * np.pi * 190 * x) * np.exp(-x / 0.018) + 0.5 * np.sin(2 * np.pi * 410 * x) * np.exp(-x / 0.01) + 0.7 * np.sin(2 * np.pi * 85 * x) * np.exp(-x / 0.03)
    gr = filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (500, 2000)) * np.exp(-x / 0.012) * 0.5
    _x(k + gr, s, g, pan)
def step(s, g=0.005, pan=0.0):
    """a shoe on the cobbles, softer than a hoof"""
    x = tt(0.12).astype(np.float64)
    _x(np.sin(2 * np.pi * 150 * x) * np.exp(-x / 0.014) + filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (300, 1400)) * np.exp(-x / 0.01) * 0.6, s, g, pan)
def murmur(s, sec, g=0.006, pan=0.0):
    """a courtyard's murmur, far off and low: voices too soft to make out, a breath that swells and fades"""
    x = tt(sec).astype(np.float64); sh = filt(R4.standard_normal(len(x)).astype(np.float32), 'low', 3).astype(np.float64)
    sh = np.clip(0.6 + 0.4 * sh / max(1e-9, float(np.abs(sh).max())), 0, 1.2)
    X((filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (220, 900)) * sh * np.sin(np.pi * x / sec) ** 0.6).astype(np.float32), s, g * FX, pan)
def rustle(s, sec=0.7, g=0.008, pan=0.0):
    """a newspaper's rustle: soft paper, with a few small crackles"""
    x = tt(sec).astype(np.float64); body = filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (300, 2000)) * np.sin(np.pi * x / sec) ** 1.5
    cr = (R4.random(len(x)) < 0.004) * R4.standard_normal(len(x)); cr = filt(cr.astype(np.float32), 'band', (600, 2100)) * 3
    X((filt((body + cr * np.sin(np.pi * x / sec)).astype(np.float32), 'low', 2200)).astype(np.float32), s, g * FX, pan)
def chalk(s, g=0.006, pan=0.0):
    """a chalk tick on the slate: a touch, and a short dry stroke"""
    x = tt(0.11).astype(np.float64); st = filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (700, 2100)) * np.sin(np.pi * np.clip(x / 0.09, 0, 1))
    _x(st + 0.6 * np.sin(2 * np.pi * 320 * x) * np.exp(-x / 0.006), s, g, pan)
def pencil(s, sec=1.0, g=0.006, pan=0.0):
    """graphite on paper: a soft, grainy scratch"""
    x = tt(sec).astype(np.float64); gr = np.abs(filt(R4.standard_normal(len(x)).astype(np.float32), 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
    X((filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (600, 2100)) * np.sin(np.pi * x / sec) ** 0.5 * (0.3 + 0.7 * gr)).astype(np.float32), s, g * FX, pan)
def creak(s, sec=0.6, g=0.007, pan=0.0):
    """leather drawn tight, as the blinkers go on: a slow, low stick and slip"""
    n = int(sec * SR); x = np.arange(n) / SR; imp = np.zeros(n); t = 0.0
    while t < sec:
        imp[int(t * SR)] = 1 + 0.3 * R4.standard_normal(); t += 0.035 - 0.02 * t / sec + 0.004 * R4.random()
    sig = filt(fftconvolve(imp, np.exp(-np.arange(int(0.006 * SR)) / (0.0015 * SR)))[:n].astype(np.float32), 'band', (250, 1300))
    X((sig * np.sin(np.pi * x / sec) ** 0.8).astype(np.float32) / max(1e-9, float(np.abs(sig).max())), s, g * FX, pan)
def card(s, g=0.006, pan=0.0, sec=0.26):
    """a card laid on the marble: a short soft slide, and its edge settling"""
    x = tt(sec).astype(np.float64)
    X((filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (250, 1500)) * np.sin(np.pi * x / sec) ** 2).astype(np.float32), s, g * FX, pan)
    s_tap(s + sec * 0.85, g * 0.45 * FX, pan)
def slide(s, sec=0.9, g=0.006, pan=0.0):
    """a card or a page drawn along: a dry, even rub"""
    x = tt(sec).astype(np.float64); gr = filt(R4.standard_normal(len(x)).astype(np.float32), 'low', 25); gr = 0.65 + 0.35 * gr / max(1e-9, float(np.abs(gr).max()))
    X((filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (220, 1400)) * np.sin(np.pi * x / sec) ** 1.4 * gr).astype(np.float32), s, g * FX, pan)
def paper(s, g=0.006, pan=0.0, sec=0.34):
    """a sheet or an envelope moved: a soft breath of paper"""
    x = tt(sec).astype(np.float64)
    X((filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (300, 2000)) * np.sin(np.pi * x / sec) ** 2 * np.exp(-x / (0.6 * sec))).astype(np.float32), s, g * FX, pan)
def pin(s, g=0.007, pan=0.0):
    """a page pinned to the marble: a small press, and the paper"""
    s_knock(s, g * 0.8 * FX, pan, 300); paper(s - 0.08, g * 0.6, pan, 0.22)
def clip(s, g=0.006, pan=0.0):
    """a badge clipped on: a soft knock with a small hard edge"""
    x = tt(0.08).astype(np.float64); _x(np.sin(2 * np.pi * 420 * x) * np.exp(-x / 0.01) + 0.3 * np.sin(2 * np.pi * 1310 * x) * np.exp(-x / 0.005), s, g, pan)
def lock(s, g=0.008, pan=0.0):
    """a small lock closing: two quick clacks"""
    for d, f in ((0, 560), (0.07, 380)):
        x = tt(0.07).astype(np.float64); _x(np.sin(2 * np.pi * f * x) * np.exp(-x / 0.008) + 0.25 * filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (800, 2000)) * np.exp(-x / 0.004), s + d, g * (1 if d == 0 else 0.7), pan)
def stamp(s, g=0.009, pan=0.0):
    """a rubber stamp pressed on paper: a low, soft thump"""
    x = tt(0.2).astype(np.float64)
    _x(np.sin(2 * np.pi * 95 * x) * np.exp(-x / 0.03) + 0.5 * filt(R4.standard_normal(len(x)).astype(np.float32), 'band', (200, 900)) * np.exp(-x / 0.02), s, g, pan)
def tray(s, g=0.008, pan=0.0):
    """a draft set down in the sandbox's tray: a soft wooden note"""
    x = tt(0.6).astype(np.float64)
    _x(np.sin(2 * np.pi * 196 * x) * np.exp(-x / 0.16) + 0.25 * np.sin(2 * np.pi * 196 * 2.76 * x) * np.exp(-x / 0.05) + 0.1 * np.sin(2 * np.pi * 196 * 5.4 * x) * np.exp(-x / 0.02), s, g, pan)
def glass(s, g=0.006, pan=0.0):
    """a fingertip on the glass: a soft, slightly ringing knock"""
    x = tt(0.4).astype(np.float64)
    _x(np.sin(2 * np.pi * 880 * x) * np.exp(-x / 0.06) + 0.5 * np.sin(2 * np.pi * 1390 * x) * np.exp(-x / 0.04) + 0.6 * np.sin(2 * np.pi * 240 * x) * np.exp(-x / 0.012), s, g, pan)
def tick(s, pitch=Bb3, g=0.006, pan=0.0):
    """a green tick: a low felt note"""
    s_note(hz(pitch), s, g * FX, pan, 1.6)
def amber(s, g=0.008, pan=0.0):
    """an amber mark: a low wooden knock"""
    s_knock(s, g * FX, pan, 150)
def air(s, sec=0.8, g=0.006, pan=0.0, lo=140, hi=900):
    """something light through the air: a badge, a lens, an envelope, a card flying"""
    s_air(s, sec, g * FX, pan, lo, hi)
def tap(s, g=0.006, pan=0.0):
    """a tool or a pill touched: a muffled key"""
    s_tap(s, g * FX, pan)
def wood(s, g=0.007, pan=0.0, f=210):
    """a ladder's rung, a table's top: a soft wooden knock"""
    s_knock(s, g * FX, pan, f)

# =============================================================================================================================
# 1. Clever Hans: the opening, B-flat major. Noon in the courtyard, the zither's chord and a far murmur under the first shot only. Hans
#    taps: a hoof on the cobbles and a chalk tick for each, and the count, F at each tap and B flat on the answer, three times (the sum,
#    the fraction, the date). The papers: their rustle and a chord. The calm eye, G minor; "a fraud", the paper turning, and von Osten's
#    good name, low. The commission: their steps, the report, a chord; "He can think!", F; the clouds of 5 over every head, a chord rolled
#    up the strings. "Something had to change": the count starts, F F F, and stops, left unresolved. The solution comes in on the
#    heckelphone's home note: Pfungst, that autumn. Nobody knows: the count runs on past the answer, and the ticks past five knock amber.
#    The blinkers creak on; each of the six right answers out of sight is one plain B flat, and the eighty-nine in sight one soft sweep
#    across the strings. Hans had been watching: the lift, as the line of sight reaches the head. No fraud: E flat to B flat. The lens and
#    the hat's tiny lift: the lift again. The sealed answer: the home note. The room, G minor, then F; and the title on the film's mark
hw = lambda lid, word, off=0: W('hans', lid, word, off)
hc = lambda lid, off=0: G('hans', lid, off)
EX = -0.55  # where Hans and the slate sit in the stereo field, left of centre in the courtyard
murmur(0.2, 5.2, 0.005)
roll(CH_BB, 0.5, 0.09, 0.8)
roll(CH_EB, hw('noon', 'at noon', -0.1), 0.09, 0.6)
roll(CH_BB, hw('taught', 'four years', -0.2), 0.09, 0.6, until=hc('taps', 0.3))
# the three counts, as the picture taps them (t1, t2 and t3 in src/scenes.js)
for t0, n, gap, g in ((hc('taps', 0.1), 5, 0.46, 0.75), (hw('taps', 'fractions', 0.55), 2, 0.46, 0.6), (hw('taps', 'the date', 0.6), 6, 0.44, 0.6)):
    st = [t + STRIKE for t in taps(t0, n, gap)]
    for t in st:
        hoof(t, 0.011, px(560))
    count(st, g, pan=px(700))
for t in [t + STRIKE for t in taps(hc('taps', 0.1), 5, 0.46)]:
    chalk(t + 0.02, 0.006, px(760))
rustle(hc('papers', -0.1), 0.8, 0.008, px(300)); roll(CH_EB, hc('papers', 0.2), 0.08, 0.55)
for i in range(6):
    step(hc('papers', 0.6 + 0.55 * i + 0.12 * R4.random()), 0.004, px(1200 + 90 * i))
roll(CH_GM, hw('how', 'how could', -0.1), 0.1, 0.5)
rustle(hc('fraud', -0.1), 0.8, 0.008, px(1500)); paper(hw('fraud', 'fraud', -0.2), 0.007, px(1500), 0.5)
zit(G2, hw('fraud', 'fraud', -0.2), 0.6, soft=True); zit(D3, hw('fraud', 'secret signs', -0.1), 0.45, soft=True)
roll((G2, D3, G3, Bb3), hc('stake', 0.2), 0.16, 0.5)
for i in range(13):
    step(hc('thirteen', -0.25) + (6 - abs(i - 6)) * 0.2 + 0.1 * R4.random(), 0.0035, px(380 + 95 * i))
card(hw('thirteen', 'found no trick'), 0.006, px(1500)); roll(CH_EB, hw('thirteen', 'found no trick', 0.1), 0.08, 0.5)
rustle(hc('think', -0.1), 0.8, 0.008, px(360)); roll(CH_F, hc('think', 0.2), 0.08, 0.55)
# the clouds of 5, over every head: one string for every other cloud, rolled up the chord
for j, m in enumerate((Bb2, F3, Bb3, D4, F4, Bb4, D5)):
    zit(m, hc('knew', 0.35 + 2 * j * 0.09), 0.42, None, True, hc('change', 0.6))
# something had to change: the count starts, and stops mid-count, unresolved
count([hc('change', 0.9 + 0.46 * i) for i in range(3)], 0.5, answer=None, pan=px(700))
# that autumn: the heckelphone's home note, the solution coming in; Pfungst's pencil
home(G('hans', 'pfungst', -0.1), ((Bb3, 2.6), (D4, 1.3), (C4, 0.6), (Bb3, 2.2)), 0.75)
roll((Bb2, F3, D4), G('hans', 'pfungst', -0.1), 0.12, 0.45)
pencil(hw('pfungst', 'Oskar Pfungst', 0.2), 0.9, 0.005, px(1300))
# nobody there knew: the "?" clouds, amber; nine taps, the count running on past the answer, the ticks past five knocking amber
amber(hc('nobody', 0.1), 0.006, px(700)); amber(hc('nobody', 0.55), 0.005, px(1250))
nst = [t + STRIKE for t in taps(hc('nobody', 0.5), 9, 0.5)]
for i, t in enumerate(nst):
    hoof(t, 0.010, px(560)); chalk(t + 0.02, 0.005, px(1180))
    if i >= 5:
        amber(t + 0.03, 0.006, px(1180))
count(nst[:5], 0.5, answer=None, pan=px(700))
# the blinkers: the leather; seven taps, out of sight; each of the six right answers one plain B flat as its dot turns green
creak(hc('blinkers', 0.2), 0.6, 0.008, px(860))
for t in taps(hc('blinkers', 1.0), 7, 0.62):
    hoof(t + STRIKE, 0.008, px(560))
for i in (7, 23, 41, 58, 76, 92):  # MJ_RIGHT.blind in src/berlin.js
    zit(ANSWER, hc('blinkers', 0.9) + 3.6 * unsmooth((i + 1) / 100), 0.45, px(1600), False)
# in sight: eighty-nine, one soft sweep across the strings as the grid fills; five taps
for t in taps(hc('sight', 0.3), 5, 0.46):
    hoof(t + STRIKE, 0.008, px(560))
sweep(hc('sight', 0.1), 2.4, ARP, 0.42, px(1500))
# Hans had been watching: the lift, as the line of sight reaches the questioner's head
lift(hc('watching', 1.25), 1.6, 0.8)
# no fraud, and no counting: the report, E flat to B flat
card(hc('cheat', 0.1), 0.006, px(960)); roll(CH_EB, hc('cheat', 0.1), 0.08, 0.5); roll(CH_BB, hw('cheat', "Hans couldn't", -0.1), 0.08, 0.55)
# a movement too small for any expert to notice: the lens moves in, and the hat lifts by a hair
air(hc('gift', -0.1), 1.3, 0.005, px(1300))
lift(hc('gift', 1.75), 1.5, 0.75)
# ever since: the answer sealed from the one who asks, on the home note
paper(hc('since', 0.25), 0.007, px(900), 0.4)
home(hc('since', 0.1), ((Bb3, 2.4),), 0.7); roll((Bb2, F3, Bb3, D4), hc('since', 0.2), 0.1, 0.45)
# today: the room, and something else that isn't what it looks like; supervised for what it is
roll(CH_GM, hc('jun', -0.3), 0.1, 0.5)
roll(CH_F, hw('safely', 'more than a junior', -0.2), 0.1, 0.45)
# the title, on the film's mark: the count, and the lift over it
mark = lambda s, hold, g=0.8: (count([s + 0.46 * i for i in range(4)], 0.62 * g), lift(s + 1.38, hold, 0.85 * g), roll((Bb2, F3, Bb3), s + 1.38, 0.1, 0.5 * g))
mark(hc('breath', 0.3), 2.6)

# 2. A junior who needs supervision: the agent at work, the arm's touch and the data coming back (since 4 November 2026 without a zither
#    note for each step of its loop: the notes ran on from the title's last chord, eight seconds of music over the chapter's turn); the
#    advice, pinned; the badge clipped on. The paper junior: its three small jobs, three green ticks; month by month, the calendar's pages;
#    the amber card and the ladder's wobble. "Like Hans": the count, F F and B flat. The two-column card: two notes rising for the two
#    ways it is more, three falling for the three it is less
jw = lambda lid, word, off=0: W('junior', lid, word, off)
jc = lambda lid, off=0: G('junior', lid, off)
tap(jw('agent', 'with hands', 0.8), 0.006, px(1604)); air(jw('agent', 'in a loop'), 1.4, 0.005, px(1360))
card(jw('advice', 'often told', -0.2), 0.006, px(690)); pin(jw('advice', 'often told', 0.1), 0.007, px(690))
clip(jw('advice', 'junior who', 0.3), 0.007, px(1124))
slide(jc('knows', -0.3), 0.8, 0.005, px(600))
for i in range(3):
    tick(jw('knows', 'small jobs', 0.5 + 0.4 * i), (Bb3, D4, F4)[i], 0.006, px(620))
card(jc('less', -0.1), 0.005, px(450))
for i in range(3):
    paper(jw('less', 'month by month', 0.7 * i), 0.005, px(450), 0.3)
amber(jw('careful', 'a mistake'), 0.008, px(660)); wood(jw('careful', 'a mistake', 0.25), 0.005, px(890), 260); wood(jw('careful', 'a mistake', 0.5), 0.003, px(890), 240)
clip(jw('looks', 'like Hans'), 0.004, px(1124))
count([jw('looks', 'like Hans', 0.1 + 0.46 * i) for i in range(3)], 0.5, pan=px(1124))
card(jc('ways', -0.2), 0.006, px(960))
for i, m in enumerate((D4, F4)):
    zit(m, jw('ways', 'two ways', 0.25 * i), 0.5, px(1500))
for i, m in enumerate((F4, D4, Bb3)):
    zit(m, jw('ways', 'in three', 0.25 * i), 0.5, px(1500), until=E('junior') + 0.3)

# 3. More than a junior: Jun's question; the agent reads the 33 tables, card after card, the zither rising through them; the path drawn
#    and its pills; the clock's hand. A new junior's week, its card (since 4 November 2026 not counted: the count, the film's mark, is
#    kept for Hans, the agent's mistake and the evidence). The shelves, a long soft slide of books. The danger: the tables ripple amber, G minor, low; free rein, the ripple again, and its knock. A junior's pace:
#    the paper junior slides in beside Jun, its one card turns amber; the two-column card, its two rows rising
mw = lambda lid, word, off=0: W('more', lid, word, off)
mc = lambda lid, off=0: G('more', lid, off)
card(mc('asks', 0.3), 0.006, px(640))
tRead = mw('reads', 'reads the whole')
for j, m in enumerate((Bb3, D4, F4, Bb4, D5, F5, Bb4, D5, F5, Bb5, F5)):
    zit(m, tRead + 0.3 + 2.4 * (3 * j + 1) / 33, 0.34, px(1340 + 45 * j), True)
tap(mw('reads', 'thirty-three', -0.1), 0.005, px(1760))
tap(mw('reads', 'draws the path'), 0.005, px(1383)); tap(mw('reads', 'draws the path', 1.3), 0.005, px(1591))
air(mw('reads', 'about a minute', -0.2), 1.4, 0.004, px(640))
card(mc('week', -0.2), 0.006, px(300))
slide(mw('lifetimes', 'a thousand', -0.4), 2.8, 0.006, px(1480))
for t, x in ((mw('undersells', 'a danger', -0.1), 1300), (mw('rein', 'change every table'), 1600)):
    amber(t, 0.008, px(x))
roll((G2, D3, Bb3), mw('undersells', 'a danger', 0.1), 0.14, 0.5)
tap(mc('rein', -0.1), 0.005, px(1600))
slide(mc('pace', -0.5), 0.8, 0.005, px(600)); amber(mc('pace', 0.4), 0.007, px(660))
tE3 = mw('pace', "The agent's", -0.4)
card(tE3, 0.006, px(960))
for i, m in enumerate((D4, F4)):
    zit(m, tE3 + 2.4 + 0.25 * i, 0.5, px(1500), until=E('more') + 0.3)

# 4. No memory of yesterday: a session, a question; the count, stopping a semitone short at 4,812; the glossary's card, Jun's pointing
#    hand, the arm and the data; the count again, landing on 4,867. The next morning: the sessions slide; the faculty bars, a
#    note each, the total short again, amber. The paper junior slides in beside Jun. The two-column card: memory, a falling third. The team's notes, pinned; the lesson
#    written, on the heckelphone's home note; and every session after, a green tick each, the zither rising to the answer
yw = lambda lid, word, off=0: W('memory', lid, word, off)
yc = lambda lid, off=0: G('memory', lid, off)
slide(yc('count', -0.5), 0.7, 0.005, px(1600)); card(yc('count', 0.2), 0.005, px(1500))
count([yc('first', -0.9 + 0.3 * i) for i in range(4)], 0.5, answer=SHORT, pan=px(1500))
paper(yw('first', 'shows how'), 0.005, px(1500))
card(yc('glossary', -0.1), 0.006, px(660)); tap(yw('glossary', 'points it', 1.8), 0.005, px(880)); air(yw('glossary', 'points it', 1.8), 1.2, 0.004, px(1100))
tAgain = yc('again', 0.2)
count([tAgain - 0.9 + 0.3 * i for i in range(4)], 0.55, pan=px(1500))
slide(yc('next', -0.5), 1.0, 0.005, px(1300)); slide(yc('next', 0.2), 1.0, 0.005, px(1700))
card(yw('next', 'asks for', -0.1), 0.005, px(1500))
for i, m in enumerate((Bb3, D4, F4)):
    zit(m, yc('out', -0.3 + 0.564 + 0.2 * i), 0.4, px(1500), True)
zit(SHORT, yw('out', 'add up'), 0.5, px(1500), until=yc('told', -0.4)); amber(yw('out', 'left the', -0.1), 0.008, px(1560))
slide(yc('told', -0.5), 0.8, 0.005, px(600))
card(yc('none', -0.4), 0.006, px(960))
zit(F4, yc('none', 0.1), 0.45, px(1500)); zit(D4, yw('none', 'no memory'), 0.45, px(1500))
pin(yc('notes', -0.2), 0.008, px(810))
pencil(yc('lesson', -0.1), 2.6, 0.005, px(810))
home(yc('lesson', -0.3), ((Bb3, 2.0), (D4, 1.2)), 0.6)
for i in range(3):
    t0 = yc('whoever', 0.1 + 0.45 * i)
    air(t0, 0.6, 0.004, px(760 + 440 * i)); slide(t0 + 0.3, 0.4, 0.004, px(760 + 440 * i))
    tick(t0 + 1.0, (D4, F4, Bb4)[i], 0.006, px(910 + 440 * i)); zit((D4, F4, Bb4)[i], t0 + 1.0, 0.45, px(760 + 440 * i), until=E('memory') + 0.3)

# 5. Nothing to lose: Jun's question; two in the morning, a low E-flat chord under the night, the tables built, a key at a time; three
#    tables nothing reads, flown to their cards; the draft, its pen. A junior would ask around: three small questions, the ladder. The
#    two-column card, career and what a mistake costs, two notes falling; "nothing to lose", G minor. Its rights: the glass, the arm's
#    touch, the draft into the sandbox's tray, and "Waiting for a person" on the home note. The yearly table: the calendar's day ringed in
#    pencil, its card turning green, flown back. Two people: two stamps, and B flat. A junior grows into the one who approves: the ladder's
#    rungs; the agent's review, for reference
lw = lambda lid, word, off=0: W('lose', lid, word, off)
lc = lambda lid, off=0: G('lose', lid, off)
card(lc('faster', 0.2), 0.006, px(640))
tN = lw('faster', 'the nightly run', -0.3)
roll((Eb2, Bb2, G3, Eb4), tN + 0.3, 0.14, 0.45, until=lc('three', 1.6))
for i in range(8):
    tap(tN + 0.5 + 0.38 * i + 0.05 * R4.random(), 0.0035, px(1500))
tFind = lw('three', 'nothing seems')
for k in range(3):
    slide(tFind + 0.25 * k, 0.8, 0.005, px(900 - 150 * k))
card(lc('drafts', 0.3), 0.006, px(550)); pencil(lc('drafts', 0.5), 0.6, 0.005, px(750))
for k in range(3):
    s_knock(lw('junior', 'asked around', 0.25 * k), 0.004 * FX, px((470, 560, 720)[k]), 340)
wood(lw('junior', 'a career', -0.2), 0.005, px(890), 230)
card(lc('agent', -0.5), 0.006, px(960))
zit(F4, lw('agent', 'no career'), 0.45, px(1500)); zit(D4, lw('agent', 'costs it'), 0.45, px(1500))
roll((G2, D3, Bb3), lw('nothing', 'nothing to lose', -0.1), 0.14, 0.5)
tR, tW, tP = lw('rights', 'it reads'), lw('rights', 'writes only'), lw('rights', 'wait for')
glass(tR + 0.9, 0.005, px(1316)); tap(tW + 0.6, 0.004, px(846)); tray(tW + 0.55, 0.008, px(640))
tap(tP, 0.004, px(640)); home(tP, ((Bb3, 2.2),), 0.6)
tOne = lw('yearly', 'one of the three')
tap(tOne, 0.004, px(860)); pencil(tOne + 0.3, 0.9, 0.005, px(880))
tick(lw('yearly', 'once a year', -0.1), Bb3, 0.006, px(700))
slide(lc('yearly', 4.7), 0.9, 0.005, px(900))
stamp(lw('two', 'Jun reviews', 0.3), 0.009, px(690)); stamp(lw('two', 'Noor approves', 0.4), 0.009, px(700))
roll(CH_BB, lw('two', 'Noor approves', 0.45), 0.09, 0.5)
for k in range(3):
    wood(lw('approves', 'grows into', 0.3 + 0.45 * k), 0.004, px(760), 200 + 15 * k)
card(lw('approves', 'its review', -0.2), 0.006, px(1560))

# 6. Asked the way Pfungst asked: back in Berlin, five taps and the count; the line of sight. At the right number, the head lifts: the
#    lift, with the lens. Pfungst's laboratory: three taps on the table, the count, and the lift as the one who thinks of three lifts their
#    head, and Pfungst's own in the mirror. Hans's name; the test with its hint, and the answer pulled to B: the lift; the reasoning, its
#    steps. Jun's first question gives the answer away: the lift, softly, then struck out; the second asks without it. The evidence, the
#    count landing on B flat; the government's draft, two green ticks, and the home note with B flat under it
aw = lambda lid, word, off=0: W('asked', lid, word, off)
ac = lambda lid, off=0: G('asked', lid, off)
ast = [t + STRIKE for t in taps(ac('berlin', 0.4), 5, 0.5)]
for t in ast:
    hoof(t, 0.010, px(560))
count(ast, 0.6, pan=px(700))
air(ac('lift', -0.2), 1.3, 0.005, px(1300))
lift(aw('lift', 'the right number', 0.45), 1.5, 0.8)
tap(aw('lift', 'a fifth', -0.2), 0.004, px(1500))
tC6 = ac('unaware', -0.5); pt = taps(tC6 + 0.5, 3, 0.55)
for t in pt:
    wood(t + 0.25, 0.006, px(560), 230)
count([t + 0.25 for t in pt], 0.55, pan=px(800))
lift(pt[2] + STRIKE + 0.12, 1.3, 0.7)
card(tC6 + 0.6, 0.006, px(960))
tap(aw('name', "Hans's name", -0.1), 0.005, px(1124))
card(aw('hint', 'a hint like', -0.3), 0.006, px(670))
card(aw('hint', 'pulled models', 0.2), 0.005, px(1480)); lift(aw('hint', 'pulled models', 0.45), 1.3, 0.7)
for k in range(3):
    tap(aw('hint', 'their reasoning', 0.35 + 0.5 * k), 0.004, px(1600))
card(ac('jun', 0.1), 0.006, px(680)); lift(ac('jun', 0.55), 1.0, 0.5)
pencil(aw('jun', 'without the answer', 0.1), 0.5, 0.006, px(680))
card(aw('jun', 'in the question', -0.2), 0.006, px(680)); tap(aw('jun', 'in the question', 1.3), 0.004, px(916))
slide(ac('how', -0.5), 0.5, 0.004, px(1600)); paper(ac('how', -0.1), 0.005, px(1600))
count([ac('how', -0.4 + 0.3 * i) for i in range(4)], 0.5, pan=px(1600))
slide(aw('draft', 'the draft for', -0.2), 0.8, 0.005, px(1700))
tOk = aw('draft', 'seven too')
tick(tOk, Bb3, 0.007, px(1600)); tick(tOk + 0.12, F4, 0.006, px(1830))
home(tOk - 0.1, ((Bb3, 2.0),), 0.65); roll((Bb2, F3, Bb3, D4), tOk, 0.09, 0.5, until=E('asked'))

# 7. For what it is: noon in the courtyard again, the opening's chord and the heckelphone's line, the close: Hans was never a pupil. The
#    badge flies back to the paper junior and clips on. Less than a person: the card. Its caution, its memory and its
#    yes: the lock, the pinned notes, two stamps, the heckelphone rising by thirds, a note for each. This week: four cards, the zither
#    climbing to the answer on the fourth. The takeaway card; and the end card on the film's mark
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
home(cc('pupil', 0.9), ((Bb3, 1.2), (D4, 0.9), (C4, 0.45), (Bb3, 1.0)), 0.7); roll((Bb2, F3, D4), cc('pupil', 0.9), 0.12, 0.45, until=cc('junior', -0.6))
tMove = cw('junior', "isn't a junior", -0.2)
air(tMove, 1.6, 0.005, px(900)); clip(tMove + 1.6, 0.007, px(660))
card(cc('less', -0.5), 0.006, px(960))
lock(cw('lives', 'its rights', 0.2), 0.008, px(640))
pin(cw('lives', "the team's notes", 0.1), 0.007, px(960))
stamp(cw('lives', 'with a person', 0.0), 0.008, px(1280)); stamp(cw('lives', 'with a person', 0.25), 0.007, px(1280))
heck([(Bb3, cw('lives', "the team's notes") - cw('lives', 'its rights')), (D4, cw('lives', 'with a person') - cw('lives', "the team's notes")), (F4, 0.9)],
     cw('lives', 'its rights', -0.2), 0.6, att=0.2, rel=0.6)
for i, phrase in enumerate(('a path in a minute', 'a count checked twice', 'a yearly table kept', 'a lesson for every session')):
    t = cw('week', phrase, -0.15)
    card(t, 0.005, px((860, 1536, 860, 1536)[i])); zit((Bb3, D4, F4, Bb4)[i], t + 0.1, 0.45, px((860, 1536, 860, 1536)[i]), until=cc('takeaway', -0.3))
card(cc('takeaway', -0.2), 0.006, px(960))
mark(cw('takeaway', 'looks like', 1.0), 3.8)
zflush()

# the effects once more through a gentle low-pass, so the shared taps and knocks stay soft above 2.5 kHz too
XL[:] = filt(XL, 'low', 2300, 3); XR[:] = filt(XR, 'low', 2300, 3)
