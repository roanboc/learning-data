# What the business owns: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The series' palette (README.md, *The look and the sound*): a consort of viols, which no film on the site plays (every score.py on
# main and on every branch, read on 11 November 2026: no viol, no gamba). Each film takes its own members of the consort and its own
# partner sounds. This film:
#  - The lead: the bass viol and its consort, bowed. Gut strings bowed gently, as viols are played: each note swells in with the bow,
#    a breath of rosin as it bites, held steady (no vibrato, no slide), and dies away with the string's own short ring when the bow
#    leaves it. Its partials are a bowed string's, every one exactly in tune: the chords are tuned pure from D (just intonation, hz()),
#    so no two notes beat. It plays under the opening story, the qanats, and comes back where the film comes back to the village.
#  - Its partner: the same bass viol, plucked. A finger on a gut string: a round, short note, its upper partials gone first, and the
#    soft thump of the finger. The present plays it: a chapter's chord as the chapter turns, a note as something lands.
#  - The mark: three notes for the map's three layers this series covers, the business layer between the other two: D, then A, then
#    the F sharp between them, held. Bowed under the title, and again under the end card.
#  - Its sounds: the desert's wind; the water in the tunnel and in the channel, one soft texture each time it runs; earth, as the
#    diggers bring it up and as the tunnel caves in; the windlass's wooden creak and a wooden gate; and at the utility, paper, cards,
#    keys and a pen.
# Nothing Persian is borrowed for the story: no santur, tar, kamancheh, ney, daf or tombak, and no Persian mode; the story is told in
# the series' own voice. D major and its neighbours; B minor and F sharp minor where the story turns to a lack or a loss.
# The rules every film keeps (AGENTS.md; tools/quiet.py checks them):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; never a bed
#    under the voice; a figure never played again soon after itself; music and effects no louder than the governance films'.
#  - Nothing trembles or pulses: no vibrato, every note one voice, tuned pure. No urgent pulse: nothing in this film is a rush.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, and pans to where it's drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: the strings low-passed at 2.3 kHz, the effects below about 2.2 kHz and about 12 dB under the music.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() takes a word's first appearance, and falls back to the line's start when it's missing; here either stops the mix, so a typo
# can't move a sound
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
R1 = np.random.default_rng(1101)  # this film's own randomness: the rooms, the rosin, the water, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major and
# B and F sharp minor are pure in this table. E is never played (against B it's the wolf fifth, against D a second that beats), and
# no chord is held into the next: each is stopped as the next is bowed (until=)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.4162 * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2, Cs3, D3, Fs3, G3, A3, B3, Cs4, D4, Fs4, G4, A4, B4, D5 = 38, 42, 43, 45, 47, 49, 50, 54, 55, 57, 59, 61, 62, 66, 67, 69, 71, 74

# ---- the levels: the bowed and the plucked viol matched by loudness, as far under the voice as the series' other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter: the opening's
# consort a little fuller, as music under a story is
LB, LP, FX = 0.048, 0.095, 2.5
LV = [1.0]

# a small room round the viols, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, as the video guidelines ask
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
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
    """a sound that must be gone by until (a time in the film): faded out over its last 0.2 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.2 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig
_pan = lambda m: max(-0.4, min(0.4, (m - 54) * 0.025))

# ---- the viols
_VP = (1.0, 0.62, 0.4, 0.3, 0.2, 0.13, 0.08, 0.05)   # a bowed gut string's partials: its nasal colour is in the second to fourth
def viol(m, s, hold, g=1.0, pan=None, until=None, rise=0.22, room=0.22):
    """the viol, bowed: the bow brings the note in over rise seconds with a breath of rosin; it's held steady for hold seconds, then
    the bow leaves it and the string rings down. No vibrato: every partial exactly in tune, so a chord tuned pure never beats"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(0.3, until - s - 0.5))
    sec = hold + 0.7; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k, a in enumerate(_VP, 1):
        if f0 * k < 2300:
            sig += a * np.sin(2 * np.pi * f0 * k * x + 0.41 * k)
    e = np.where(x < rise, np.sin(0.5 * np.pi * x / rise) ** 2, 1.0) * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.16))
    sig = sig * e / max(1e-9, float(np.abs(sig).max()))
    r = int(0.25 * SR); xr = np.arange(r) / SR
    ro = filt(R1.standard_normal(r).astype(np.float32), 'band', (max(150, f0 * 1.5), min(2100, max(600, f0 * 5)))) * np.exp(-xr / 0.07)
    sig[:r] += 0.035 * ro / max(1e-9, float(np.abs(ro).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 60)), room, rise, max(rise + 0.2, min(hold, 1.6))), s, until)
    put(sig, s, g * LV[0] * LB, _pan(m) if pan is None else pan)
def pizz(m, s, g=1.0, pan=None, until=None, room=0.18):
    """the viol, plucked: a round, short note, its upper partials gone first, and the soft thump of the finger"""
    f0 = hz(m); sec = 2.4; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 9):
        if f0 * k < 2200:
            sig += (1 / k ** 1.25) * np.sin(2 * np.pi * f0 * k * x + 0.23 * k) * np.exp(-x * (1.5 + 0.8 * k))
    sig *= np.minimum(1, x / 0.003)
    th = np.sin(2 * np.pi * 95 * x) * np.exp(-x / 0.02)
    sig = norm(filt((sig / max(1e-9, float(np.abs(sig).max())) + 0.18 * th).astype(np.float32), 'low', 2200))
    put(_until(_room(sig, room, 0.0, 0.4), s, until), s, g * LV[0] * LP, _pan(m) if pan is None else pan)
def consort(notes, s, hold, g=1.0, step=0.4, until=None):
    """a chord on the consort, bowed: each viol comes in a little after the one below it, from the bass up, and all stop together"""
    for i, m in enumerate(notes):
        viol(m, s + step * i, max(0.6, hold - step * i), g * (1.0 if i == 0 else 0.8), until=until)
def spread(notes, s, g=1.0, step=0.13, until=None):
    """a chord plucked upwards on the viol, left to ring: a chapter's turn"""
    for i, m in enumerate(notes):
        pizz(m, s + step * i, g * (1.0 if i == 0 else 0.85), until=until)
def mark(s, g=1.0, low=D3, high=A3, mid=Fs3, step=0.55, last=3.0, until=None):
    """the series' mark: the three layers, the business layer between the other two: the low note, the high, then the one between, held"""
    viol(low, s, 0.6, g * 0.85, until=until); viol(high, s + step, 0.6, g * 0.85, until=until)
    viol(mid, s + 2 * step, last, g, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _nz(sec):
    return R1.standard_normal(max(1, int(sec * SR))).astype(np.float32)
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k
def wind(s, sec, g=0.006, pan=0.0):
    """the desert's wind, low: two slow gusts across the field that never fall into step, and no whistle"""
    n = int(sec * SR); x = np.arange(n) / SR; edge = np.minimum(1, x / 2.5) * np.clip((sec - x) / 2.5, 0, 1)
    for p, ph in ((-0.5, 0.0), (0.5, 2.1)):
        sw = 0.55 + 0.45 * np.sin(2 * np.pi * x / 7.3 + ph) * np.sin(2 * np.pi * x / 11.9 + 1.3 * ph)
        _fx(filt(_nz(sec)[:n], 'band', (90, 520)) * sw * edge, s, g, pan + p, 900)
def water(s, sec, g=0.005, pan=0.0, lo=220, hi=1300):
    """water running in the tunnel or the channel: one soft, even texture that swells in, never a burst of drops"""
    n = int(sec * SR); x = np.arange(n) / SR; edge = np.minimum(1, x / 1.2) * np.clip((sec - x) / 1.4, 0, 1)
    gr = np.abs(filt(_nz(sec + 0.1)[:n], 'low', 9)); gr = 0.65 + 0.35 * gr / max(1e-9, float(gr.max()))
    _fx((filt(_nz(sec)[:n], 'band', (lo, hi)) * gr + 0.6 * filt(_nz(sec)[:n], 'band', (70, 260))) * edge, s, g, pan, 1600)
def pour(s, g=0.004, pan=0.0, sec=1.3):
    """water let into a field: a soft rush that rises and settles"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec)[:n], 'band', (200, 1200)) * _bump(x, sec, 1.2) * (1 - 0.5 * x / sec), s, g, pan, 1500)
def gate(s, g=0.005, pan=0.0):
    """a wooden board lifted from a channel: a low knock and a short scrape of wood"""
    n = int(0.32 * SR); x = np.arange(n) / SR
    sc = filt(_nz(0.32)[:n], 'band', (180, 900)) * _bump(x - 0.03, 0.2, 1.0) * (x > 0.03)
    _fx(_knock(n, 170, 0.03) + 0.5 * sc, s, g, pan, 1400)
def creak(s, sec=1.2, g=0.004, pan=0.0):
    """the windlass turning: a low, dry creak of wood on wood, its pitch wandering a little, once round"""
    n = int(sec * SR); x = np.arange(n) / SR
    f = 260 + 70 * np.sin(np.pi * x / sec) + 20 * np.sin(2 * np.pi * 2.3 * x); ph = 2 * np.pi * np.cumsum(f) / SR
    fr = (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 34 * x))) * filt(_nz(sec)[:n], 'band', (200, 700))
    _fx((0.6 * np.sin(ph) * fr + 0.3 * fr) * _bump(x, sec, 0.8), s, g, pan, 1200)
def earth(s, g=0.005, pan=0.0, sec=0.7):
    """earth tipped out: a soft, low pour of dry soil, settling"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec)[:n], 'band', (120, 900)) * _bump(x, sec, 0.7) * (1.2 - x / sec) + 0.6 * _knock(n, 90, 0.05, 0.02), s, g, pan, 1200)
def cavein(s, g=0.008, pan=0.0, sec=2.2):
    """the tunnel's roof coming down: one low, muffled fall of earth, and a dull thud under it"""
    n = int(sec * SR); x = np.arange(n) / SR
    rb = filt(_nz(sec)[:n], 'band', (40, 300)) * np.minimum(1, x / 0.06) * np.exp(-x / 0.7)
    _fx(rb + 0.9 * _knock(n, 62, 0.12, 0.04) + 0.5 * _knock(n, 75, 0.1, 0.38), s, g, pan, 700)
def card(s, g=0.005, pan=0.0):
    """a card or a sheet laid down: a soft flap of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(_nz(0.17)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 155, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def knock(s, g=0.005, pan=0.0):
    """something set down on the glass: one soft, low knock"""
    n = int(0.16 * SR); _fx(_knock(n, 200, 0.022), s, g, pan, 1400)
def tap(s, g=0.004, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(_nz(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 230, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """paper slid along, or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(_nz(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.6, g=0.004, pan=0.0, k=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(_nz(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(_nz(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.004, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def keys(s, sec=1.2, g=0.0035, pan=0.0):
    """text typed in on a screen: one soft, even texture of keys, never a burst of separate clicks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(_nz(sec + 0.02)[:n], 'low', 14)); gr = 0.6 + 0.4 * gr / max(1e-9, float(gr.max()))
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (300, 1200)) * _bump(x, sec, 0.8) * gr, s, g, pan, 1300)
def air(s, sec=0.9, g=0.003, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    n = int(sec * SR); x = np.arange(n) / SR; _fx(filt(_nz(sec)[:n], 'band', (140, 900)) * _bump(x, sec), s, g, pan, 1000)

# =============================================================================================================================
# 1. Water under the desert: the opening, the film's story from outside data, with the consort under it. Iran, the desert's edge:
#    D major, bowed in from the bass up, over the wind. The water nobody sees: a low swell of water under the sand as the chain lights.
#    The qanat cut away: G, as the tunnel is drawn, and the water runs down it. The shafts: D again, higher; the windlass creaks as the
#    earth comes up, and it's tipped out. Never enough: B minor; a gate lifted and water let in for each field in turn. Fragile: the
#    tunnel caves in, the water drains, F sharp minor and then only a low F sharp as the fields dry. Whose water, who keeps it
#    flowing: G, held open. Each part its own people: D major; the windlass turns as the diggers clear the tunnel, the earth tipped
#    out, and the water runs again; the share of time lit: A, high. The mirab: A major, as he lifts the third field's gate. The
#    diggers: G. Centuries: D major, full. Today: B minor, then G, the wind again over the desert, and a soft knock for each date.
#    The utility: the plucked viol comes in, the present's instrument, for the data team and for the business. The title: the mark
K = 'water'
LV[0] = 1.19
kw = lambda lid, word, off=0: W(K, lid, word, off)
kc = lambda lid, off=0: G(K, lid, off)
tQ, tS, tN, tF, tNd, tSh, tM, tD, tL, tT, tK = (kc(i) for i in ('qanat', 'shafts', 'never', 'fragile', 'needed', 'shares', 'mirab', 'diggers', 'lasted', 'today', 'link'))
tB = kc('breath'); END1 = E(K)
tRun, tCave, tCut = kw('qanat', 'brings', -0.2), kw('fragile', 'One cave-in', -0.1), kw('fragile', 'cut off', -0.2)
tFix = tSh + 0.9; tBack = tFix + 5.2
T0 = [tN + 0.6, tN + 2.2, tN + 3.8, tN + 5.4]; T1 = [tBack, tBack + 2.6, kw('mirab', 'keeps', -0.3), kw('diggers', 'paid')]
XG = [1554, 1724, 1894, 2064]                       # the fields' gates in the cut-away world (ba.js BA_VFIELDS, less 6)
sx = lambda wx, cx=1880, z=1.6: px(960 + (wx - cx) * z)  # a gate's place on screen while the camera is on the village
# the consort: each chord stopped as the next is bowed
consort((D2, A2, Fs3, A3), kc('edge', -0.9), tQ - 0.7 - kc('edge', -0.9), 0.9, step=0.45, until=tQ - 0.6)
consort((G2, D3, B3), tQ - 0.6, tS - 0.3 - (tQ - 0.6), 0.85, step=0.4, until=tS - 0.3)
consort((D3, A3, Fs4), tS - 0.3, tN - 0.4 - (tS - 0.3), 0.8, step=0.35, until=tN - 0.4)
consort((B2, Fs3, D4), tN - 0.4, tCave - (tN - 0.4), 0.8, step=0.35, until=tCave)
consort((Fs2, Cs3, A3), tCave, 2.0, 0.75, step=0.3, until=tCut + 0.4)
viol(Fs2, tCut + 0.4, tNd - 0.9 - tCut, 0.8, until=tNd - 0.5)
consort((G2, B2, D3), tNd - 0.5, tSh - 0.1 - (tNd - 0.5), 0.8, step=0.4, until=tSh - 0.1)
consort((D2, Fs3, A3, D4), tSh - 0.1, tM - 0.3 - (tSh - 0.1), 0.85, step=0.4, until=tM - 0.3)
viol(A4, kw('town', 'ninety-six', -0.2), 1.6, 0.6, until=tM - 0.3)
consort((A2, A3, Cs4), tM - 0.3, tD - 0.3 - (tM - 0.3), 0.8, step=0.35, until=tD - 0.3)
consort((G2, D3, B3), tD - 0.3, tL - 0.3 - (tD - 0.3), 0.8, step=0.4, until=tL - 0.3)
consort((D2, A2, Fs3, D4, A4), tL - 0.3, tT - 0.6 - (tL - 0.3), 0.9, step=0.35, until=tT - 0.6)
tUn = kw('today', 'UNESCO', -0.3)
consort((B2, Fs3, B3, D4), tT - 0.6, tUn - (tT - 0.6), 0.75, step=0.35, until=tUn)
consort((G2, D3, G3, B3), tUn, tK - 0.5 - tUn, 0.75, step=0.35, until=tK - 0.5)
# the desert, the water nobody sees, the tunnel and its people
wind(0.0, tQ + 0.4, 0.007, 0.0)
water(kw('edge', 'water', -0.3), 3.2, 0.0035, px(800), 120, 600)
water(tRun, tCave + 2.8 - tRun, 0.005, -0.1)
creak(kw('shafts', 'earth', -0.5), 1.6, 0.005, sx(950, 960, 2.0))
earth(kw('shafts', 'earth', 1.3), 0.005, sx(950, 960, 2.0))
for i, t0 in enumerate(T0):
    gate(t0, 0.005, sx(XG[i])); pour(t0 + 0.2, 0.004, sx(XG[i]), 1.2)
cavein(tCave, 0.009, sx(900, 930, 1.9))
for k in range(3):
    creak(tFix + 1.6 * k, 1.3, 0.004, px(940))
earth(tFix + 1.5, 0.004, px(940)); earth(tFix + 3.1, 0.004, px(940))
water(tFix + 1.4, tT - 0.4 - (tFix + 1.4), 0.0045, 0.1)
slide(kw('shares', 'shares of time', -0.3), 1.2, 0.003, px(960)); slide(kw('town', 'In one town', -0.2), 1.2, 0.003, px(960))
for i, t0 in enumerate(T1):
    gate(t0, 0.005, sx(XG[i], 1880, 2.1 if i == 2 else 1.6)); pour(t0 + 0.2, 0.0035, sx(XG[i], 1880, 2.1 if i == 2 else 1.6), 1.2)
wind(tT - 0.7, tB + 1.2 - (tT - 0.7), 0.005, 0.0)
knock(kw('today', 'Qasabeh', -0.2), 0.004, px(300)); knock(kw('today', 'UNESCO', -0.2), 0.004, px(300))
# the utility: the plucked viol, for the data team and for the business
pizz(D3, kw('link', 'keeps the channel', -0.3), 0.8, px(780))
pizz(A3, kw('link', 'The water', -0.3), 0.75, px(1500))
mark(tB + 1.4, 0.85, last=END1 - tB - 3.0, until=END1)

# 2. Tomás's map: the chapter turns on D major, plucked, as the wall comes in. The map's six layers laid down one by one, a soft knock
#    each, and a pen for each question on its left. This series' part: its bracket drawn, and B minor's third, D and F sharp, as the
#    rest dims. A tap as each of the three layers' insides is named. The series after it: a breath of air down the map, a tap for each
#    of the two, and a low D as this part lights again: they start from here
K = 'map'
LV[0] = 1.0
mw = lambda lid, word, off=0: W(K, lid, word, off)
spread((D3, A3, D4, Fs4), S0(K) + 0.3, 0.8)
t0 = mw('drawn', 'layer by layer', -0.4)
for l in range(6):
    knock(t0 + 0.3 * l, 0.004, px(780))
for word in ('why it exists', 'how it works', 'what runs it'):
    pen(mw('drawn', word, -0.3), 0.4, 0.0035, px(420), 2)
slide(mw('part', 'one part', -0.1), 1.0, 0.0035, px(1190))
spread((D3, Fs3), mw('part', 'one part', 0.2), 0.75, step=0.3)
for word in ('capabilities', 'the work', 'concepts'):
    tap(mw('three', word, -0.2), 0.004, px(1000))
air(mw('next', 'the data', -0.3), 1.2, 0.003, px(1190))
tap(mw('next', 'the data', 0.1), 0.0035, px(1300)); tap(mw('next', 'the platform', -0.2), 0.0035, px(1300))
pizz(D2, mw('next', 'start from here', -0.2), 0.8, px(1190))

# 3. Three answers: the chapter turns on B minor as the ticket comes in, paper. Three places for three answers, slid in; each count a
#    knock as it lands. Last year's two reports, paper; parliament's question, a knock, and a low F sharp, plucked, for no answer. Each
#    count right about something: a tick each. Which one is a customer: A and C sharp, plucked together and left open
K = 'three'
tw_ = lambda lid, word, off=0: W(K, lid, word, off)
tc = lambda lid, off=0: G(K, lid, off)
spread((B2, Fs3, B3, D4), tc('ticket', -0.3), 0.75, step=0.15)
card(tc('ticket', -0.2), 0.005, px(960))
slide(tc('answers', -0.1), 0.8, 0.003, px(960))
for lid, x in (('billing', 380), ('network', 960), ('own', 1540)):
    knock(tc(lid, -0.15), 0.005, px(x))
card(tw_('last', 'annual report', -0.3), 0.004, px(1540)); card(tw_('last', "regulator's return", -0.3), 0.004, px(960))
knock(tc('minister', -0.25), 0.005, px(380))
pizz(Fs2, tw_('minister', "couldn't say", -0.1), 0.7, px(380))
for i, x in enumerate((380, 960, 1540)):
    ticked(tw_('which', 'right about', -0.1 + 0.25 * i), 0.0035, px(x + 230))
spread((A3, Cs4), tw_('which', 'But which', 0.0), 0.7, step=0.0)

# 4. Whose meaning?: the picture carries on from Three answers, so no chord. The two first ideas, a tap each. Tomás asks: a breath of
#    air as the counts rise, and one plucked F sharp, a question. The analyst's table: a card, its lines typed, the two merges a breath
#    of air each. None given, someone had to choose: a pen. The account and the connection point, each a card, and its owner a plucked
#    note: D, then A. No owner: a low B. The window onto the village: the wind, the channel's water and its gate, and the bowed viol
#    once, D, the story's own voice: the diggers don't decide whose turn it is
K = 'whose'
ww = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: G(K, lid, off)
tap(ww('pick', 'pick one', -0.2), 0.0035, px(660)); tap(ww('pick', 'fix its own', -0.2), 0.0035, px(1540))
air(wc('who', -0.2), 1.3, 0.003, 0.0)
pizz(Fs3, wc('who', 0.3), 0.7, px(320))
card(wc('analyst', -0.4), 0.0045, px(1540))
keys(ww('analyst', 'one customer per address', -0.2), 1.2, 0.003, px(1540))
air(ww('analyst', 'merged', -0.4), 1.0, 0.003, px(900)); air(ww('analyst', 'merged', -0.2), 1.0, 0.003, px(1100))
pen(ww('choose', 'someone had to choose', -0.2), 0.5, 0.0035, px(880), 2)
card(wc('account', -0.2), 0.0045, px(380)); pizz(D3, ww('account', 'head of retail', -0.2), 0.7, px(380))
card(wc('point', -0.2), 0.0045, px(960)); pizz(A3, ww('point', 'Grace', -0.2), 0.7, px(960))
pizz(B2, ww('none', 'no owner', -0.3), 0.7, px(1540))
tTu = wc('turn')
wind(tTu - 0.5, E(K) - tTu + 0.8, 0.004, 0.0); water(tTu - 0.2, E(K) - tTu + 0.6, 0.003, px(800))
gate(tTu + 0.4, 0.004, px(800))
viol(D3, tTu + 0.1, 2.4, 0.75, px(800), until=E(K) + 0.4)

# 5. Who owns what: the chapter turns on G major, plucked, on the wall. Each column's heading written, a pen; each note stuck up, a
#    card, five for the business, three for the data team. The shareholders and the diggers: the bowed viol, the water's owners low
#    on G, the channel's keepers higher on B. Both matter: two pink notes stuck up. In the pause, the two columns side by side: D major,
#    plucked upwards
K = 'owns'
ow = lambda lid, word, off=0: W(K, lid, word, off)
oc = lambda lid, off=0: G(K, lid, off)
spread((G2, D3, G3, B3), S0(K) + 0.3, 0.75)
pen(oc('writes', -0.1), 0.5, 0.0035, px(470), 2)
for word in ('what its data means', 'who creates it', 'the rules on it', 'the quality it needs', 'the decisions it serves'):
    card(ow('business', word, -0.2), 0.0035, px(470))
pen(oc('team', -0.2), 0.5, 0.0035, px(1080), 2)
for word in ('stored', 'moved', 'checked'):
    card(ow('team', word, -0.2), 0.0035, px(1080))
viol(G2, ow('like', 'one owns', -0.2), 1.4, 0.7, px(470))
viol(B2, ow('like', 'the other keeps', -0.2), 1.4, 0.65, px(1080))
card(ow('both', 'A channel nobody', -0.2), 0.0035, px(1080)); card(ow('both', 'water nobody owns', -0.2), 0.0035, px(470))
spread((D3, Fs3, A3, D4, Fs4), oc('breath', 0.2), 0.7, step=0.16, until=E(K) + 0.6)

# 6. Only what data needs: the chapter turns on A major, plucked. The BIZBOK Guide's core: a tap for its heading, and a knock and a
#    plucked note for each of its four parts, rising through D major. The parts around it, a tap each; the rest of business
#    architecture, a tap each, softer. Only what matters for data: the line drawn round it. The diagram slides aside, a breath of air;
#    the four films to come, a card each, and their numbers on the parts, a tap each. One film each, in that order: the cards light
#    in turn, A, B, C sharp, D, rising
K = 'parts'
pw = lambda lid, word, off=0: W(K, lid, word, off)
pc = lambda lid, off=0: G(K, lid, off)
spread((A2, A3, Cs4), S0(K) + 0.3, 0.7, step=0.15)
tap(pw('core', 'BIZBOK', -0.2), 0.0035, px(960))
for word, x, m in (('capabilities', 770, Fs3), ('value streams', 1150, A3), ('information', 770, D4), ('the organisation', 1150, Fs4)):
    knock(pw('core', word, -0.2), 0.0045, px(x)); pizz(m, pw('core', word, 0.0), 0.55, px(x))
for word, x in (('stakeholders', 700), ('products', 1220), ('policies', 700), ('initiatives', 1220), ('and more', 960)):
    tap(pw('around', word, -0.2), 0.0035, px(x))
for word, x in (('partners', 330), ('finance', 330), ('how the organisation', 1590)):
    tap(pw('wider', word, -0.2), 0.0025, px(x))
slide(pw('only', 'only', -0.2), 1.2, 0.0035, px(960))
air(pc('four', -0.6), 1.4, 0.003, px(700))
for i, word in enumerate(('What the business', 'Who creates', 'The processes', 'The rules')):
    card(pw('four', word, -0.2), 0.004, px(1470)); tap(pw('four', word, 0.05), 0.003, px(500))
for i, m in enumerate((A3, B3, Cs4, D4)):
    pizz(m, pc('each', 0.35 * i), 0.55, px(1470))

# 7. The owners answer: the chapter turns on F sharp minor as the ticket comes back, paper; the reply typed. Ama and her tags, a tap
#    each. The decision: a card, each row written, its number a tap. Built and tested: a tick each, and G, then B, plucked. The merged
#    table: a card, struck through with a pen as it's retired. Checked by Ama, then closed: a tap, and A major, plucked. This year:
#    the two reports, paper; they agree, and each number says what it counts: D major, plucked upwards
K = 'answer'
aw = lambda lid, word, off=0: W(K, lid, word, off)
ac = lambda lid, off=0: G(K, lid, off)
spread((Fs2, Cs3, Fs3, A3), S0(K) + 0.3, 0.7, step=0.16)
card(S0(K) + 0.35, 0.0045, px(670))
keys(aw('back', 'one question', -0.2), 1.3, 0.003, px(690))
for word, x in (('obligations', 1660), ('She decides', 1660)):
    tap(aw('ama', word, -0.2), 0.0035, px(x))
card(ac('both', -0.2), 0.0045, px(690))
for word in ('accounts', 'connection points'):
    pen(aw('both', word, -0.2), 0.5, 0.0035, px(500), 2)
for i in range(2):
    tap(ac('builds', -0.1 + 0.3 * i), 0.0035, px(1080))
    ticked(aw('builds', 'tests them', -0.2 + 0.3 * i), 0.004, px(1160))
pizz(G3, aw('builds', 'tests them', 0.0), 0.6, px(1160)); pizz(B3, aw('builds', 'tests them', 0.3), 0.6, px(1160))
card(ac('retired', -0.3), 0.004, px(1430))
pen(aw('retired', "never the business's", -0.4), 0.6, 0.0035, px(1430), 1)
tap(aw('checks', 'checks', -0.1), 0.0035, px(300))
tap(aw('checks', 'closes', -0.1), 0.0035, px(300)); spread((A2, Cs3, A3), aw('checks', 'closes', 0.0), 0.65, step=0.14)
card(ac('same', 0.1), 0.004, px(470)); card(ac('same', 0.4), 0.004, px(1140))
spread((D3, Fs3, A3, D4), aw('same', 'each number', -0.2), 0.6, step=0.18, until=E(K) + 0.6)

# 8. The data practice on the map: the chapter turns on G major, high, plucked, as its heading comes in; its outlines drawn, a slide.
#    The data team and its service: a knock and a plucked note each, D and A. Its tickets: a knock, and the lines between them drawn,
#    a pen. The two business objects, a knock each, and their lines to the service drawn; their owners' tags, a tap each, and B,
#    plucked, as the meaning stays with them. Film by film, the practice fills in: a breath of air for each film's outlines, and a
#    tap for each of its tags
K = 'practice'
qw = lambda lid, word, off=0: W(K, lid, word, off)
qc = lambda lid, off=0: G(K, lid, off)
spread((G3, B3, D4, G4), qc('itself', -0.1), 0.65, step=0.14)
slide(qw('itself', 'the data practice', -0.1), 1.0, 0.003, px(700))
knock(qw('actor', 'business actor', -0.3), 0.0045, px(320)); pizz(D3, qw('actor', 'business actor', -0.2), 0.6, px(320))
knock(qw('actor', 'business services', -0.3), 0.0045, px(320)); pizz(A3, qw('actor', 'business services', -0.2), 0.6, px(320))
knock(qw('tickets', 'tickets', -0.3), 0.0045, px(320)); pen(qw('tickets', 'tickets', 0.0), 0.6, 0.003, px(320), 2)
knock(qw('objects', 'Account', -0.3), 0.0045, px(1640)); knock(qw('objects', 'connection point', -0.3), 0.0045, px(1245))
slide(qw('objects', 'Account', 0.1), 1.2, 0.003, px(900))
for x in (1245, 1640):
    tap(qw('objects', 'owners', 0.0), 0.0035, px(x))
pizz(B3, qw('objects', 'stays with', -0.1), 0.6, px(1449))
for word, x in (('glossary', 1450), ('owners', 1440), ('processes', 800), ('products', 800)):
    air(qw('fills', word, -0.3), 0.8, 0.0025, px(x)); tap(qw('fills', word, -0.1), 0.003, px(x))

# 9. The water and the channel: back to the village from above, the consort bowed once more, softly, D major, with the wind and the
#    water in the channel; the diggers and the shareholders, a bowed note each. At the utility, the same, plucked: the data team and
#    the business. Tomás's next note goes up on the wall, paper, and a question, plucked: B, then A. Under the end card, without words,
#    the mark, bowed, its F sharp held to the end
K = 'end'
ew = lambda lid, word, off=0: W(K, lid, word, off)
ec = lambda lid, off=0: G(K, lid, off)
tU, tNx, tB9 = ec('utility'), ec('next'), ec('breath')
wind(S0(K), tNx - 0.2 - S0(K), 0.005, 0.0); water(S0(K) + 0.3, tNx - 0.6 - S0(K), 0.0035, px(1480))
viol(D3, ew('village', 'diggers', -0.3), 1.6, 0.7, px(800), until=tU - 0.5)
viol(A3, ew('village', 'shareholders', -0.3), 1.6, 0.65, px(1480), until=tU - 0.5)
pizz(D3, ew('utility', 'data team', -0.3), 0.7, px(800)); pizz(A3, ew('utility', 'What flows', -0.3), 0.65, px(1480))
card(tNx - 0.1, 0.0045, px(860))
pizz(B3, ew('next', 'what the business', 0.0), 0.6, px(860)); pizz(A3, ew('next', 'what the business', 0.45), 0.6, px(860))
mark(tB9 + 2.0, 0.85, low=D3, high=A3, mid=Fs3, step=0.6, last=E(K) - tB9 - 3.6, until=E(K))
viol(D2, tB9 + 3.2, E(K) - tB9 - 4.0, 0.55, until=E(K))
