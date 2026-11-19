# The map behind the sketch: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# Its palette (decided.md, and the film's assumptions file): a harpsichord and a bass clarinet, two instruments the site already has
# but no film pairs, and no film of this topic (From words to data, A Sharper Sketch) plays, since nothing new fitted: every rare
# instrument the threads have looked for is some film's already, or sounds like one, or belongs to another culture.
#  - The weft: a harpsichord, one eight-foot register, one string to a note. The quill plucks the string close to its end, so a note
#    speaks at once, clear and a little nasal, then rings on softer until the damper falls. It runs across, a note at a time, as the
#    things of the story are set in place, and spreads a chord from the bass up under the opening story and at a chapter's turn.
#  - The warp: a bass clarinet, low and soft (D 2 to C 4). Its odd partials carry its hollow colour; each note tongued softly, held at
#    one level, no vibrato, and gone when the breath stops. It holds the long threads the harpsichord's notes run across.
#  - The mark, warp and weft: the harpsichord rises, F, A, C, F, while the bass clarinet falls, C, A, F, and they meet on the A, one
#    note, where the two threads cross; then they hold one F major chord together, the cloth. Under the title, at "warp and weft" in
#    the story, at the two maps crossed, and under the end card.
#  - Its sounds: the grain set down by the houses, the registers' pages lost on the wind, a brush's strokes for each name and each
#    plot, the students' rope, a sack carried from one house to the next; at the university, cards, knocks, taps, a pen and a breath of
#    air as things are set on the glass.
# Nothing Chinese is borrowed for the story: no zither, stone chimes, bronze bells, gongs, wood or temple blocks, no mouth organ or
# other free reeds, and no five-note tune; the story is told in the series' own voice, F major and its neighbours, every phrase
# leaning on the semitones (E to F, A to B flat) that a five-note tune leaves out. D minor where the story turns to a loss, a burden
# or a doubt. Tuned pure from F: F, B flat and C major, D and A minor; G is played only within C major, never with B flat or D.
# The rules every film keeps (AGENTS.md; tools/quiet.py checks them):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; never a bed
#    under the voice; no figure played again soon after itself; music and effects no louder than the governance films'.
#  - Nothing trembles or pulses: no vibrato, one string and one voice to a note, tuned pure. No urgent pulse: nothing here is a rush.
#  - Every sound is an event on screen, at its moment: each uses the same word and offset as the picture in src/scenes.js, and pans
#    to where it's drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: the harpsichord low-passed at 2.8 kHz, the bass clarinet at 2.0 kHz, the effects below about
# 2.2 kHz and far under the music.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word is missing; here a missing word, or one inside a longer word, stops the mix
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
def LE(sid, lid):
    """when a line ends"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1381)  # this film's own randomness: the quill, the breath, the room, the paper, the grain

# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 41, 12)
    return 87.3071 * 2 ** o * _JI[pc]
D2, E2, F2, A2, Bb2, C3, D3, E3, F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4, Bb4, C5, D5, E5, F5 = \
    38, 40, 41, 45, 46, 48, 50, 52, 53, 55, 57, 58, 60, 62, 64, 65, 67, 69, 70, 72, 74, 76, 77

# ---- the levels: the two matched by loudness, as far under the voice as the site's other music; the effects far under the music
# (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter: the opening a little fuller
LH, LB, FX = 0.093, 0.042, 3.4
LV = [1.0]

# a small room round the two, ringing on for under a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, as the video guidelines ask
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.95)).astype(np.float32))(np.arange(int(0.95 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.014 * SR)] = 0; _IR /= _band(_IR)
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
_pan = lambda m: max(-0.4, min(0.4, (m - 60) * 0.025))
def _nz(sec):
    return R1.standard_normal(max(1, int(sec * SR))).astype(np.float32)

# ---- the harpsichord: the weft
def hpd(m, s, hold=1.6, g=1.0, pan=None, until=None, room=0.22):
    """the harpsichord, one eight-foot register: the quill plucks the string close to its end (so the partials near each multiple of
    eight are weak), the note speaks at once and its higher partials die first, the lower ring on softer while the key is held (hold
    seconds), and the damper falls when it's let go. One string to a note, every partial exactly in tune; the quill's small click at
    the start, the jack's soft fall at the end"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(0.25, until - s - 0.3))
    sec = hold + 0.12; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    T1 = 2.6 * (110.0 / f0) ** 0.45
    sig = np.zeros(n)
    for k in range(1, 40):
        f = f0 * k
        if f > 3000:
            break
        a = (0.12 + abs(np.sin(np.pi * k * 0.125))) / k ** 0.8 * (1 - np.exp(-f / 260))
        tau = T1 / (1 + 0.32 * (k - 1))
        sig += a * (0.55 * np.exp(-x / min(0.16, tau)) + 0.45 * np.exp(-x / tau)) * np.sin(2 * np.pi * f * x + 0.41 * k * k)
    sig *= np.minimum(1, x / 0.0008) * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.04))
    sig /= max(1e-9, float(np.abs(sig).max()))
    q = int(0.02 * SR); xq = np.arange(q) / SR
    ck = filt(_nz(0.02)[:q], 'band', (900, 2400)) * np.exp(-xq / 0.004)
    sig[:q] += 0.05 * ck / max(1e-9, float(np.abs(ck).max()))
    r = int(0.06 * SR); i0 = int(hold * SR)
    if i0 + r <= n:
        xr = np.arange(r) / SR; dm = filt(_nz(0.07)[:r], 'band', (140, 700)) * np.exp(-xr / 0.012)
        sig[i0:i0 + r] += 0.02 * dm / max(1e-9, float(np.abs(dm).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2800), 'high', 60)), room, 0.04, max(0.3, min(hold, 0.9))), s, until)
    put(sig, s, g * LV[0] * LH, _pan(m) if pan is None else pan)
def spread(notes, s, hold=2.4, g=1.0, step=0.11, until=None):
    """a chord spread on the harpsichord from the bass up, its keys held together and let go together"""
    for i, m in enumerate(notes):
        hpd(m, s + step * i, max(0.4, hold - step * i), g * (1.0 if i == 0 else 0.82), until=until)

# ---- the bass clarinet: the warp
def bcl(m, s, hold=2.2, g=1.0, pan=None, until=None, rise=0.09, room=0.25):
    """the bass clarinet: a note tongued softly, its higher partials speaking a moment after the lower, held at one level for hold
    seconds, no vibrato, then gone as the breath stops. Its odd partials are strong and its even ones weak, as a closed tube's are, up
    to the bore's cutoff near 1.3 kHz; a little of the breath sounds under the note"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(0.4, until - s - 0.3))
    sec = hold + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 24):
        f = f0 * k
        if f > 2000:
            break
        a = (1.0 if k % 2 else 0.2) / k ** 0.85 / (1 + (f / 1300) ** 4)
        sig += a * np.sin(0.5 * np.pi * np.minimum(1, x / (rise * (1 + 0.2 * (k - 1))))) ** 2 * np.sin(2 * np.pi * f * x + 0.23 * k * k)
    sig *= np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.07))
    sig /= max(1e-9, float(np.abs(sig).max()))
    br = filt(_nz(sec)[:n], 'band', (max(200, f0 * 3), 1700))
    sig += 0.014 * br / max(1e-9, float(np.abs(br).max())) * np.minimum(1, x / 0.06) * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.05))
    t_ = int(0.035 * SR); xt = np.arange(t_) / SR; tg = filt(_nz(0.035)[:t_], 'band', (500, 1600)) * np.sin(np.pi * np.minimum(1, xt / 0.035))
    sig[:t_] += 0.03 * tg / max(1e-9, float(np.abs(tg).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2000), 'high', 45)), room, 0.25, max(0.5, hold)), s, until)
    put(sig, s, g * LV[0] * LB, _pan(m) * 0.5 if pan is None else pan)

# ---- the mark: warp and weft
def mark(s, chord_at=None, last=2.6, g=1.0, step=0.45, until=None):
    """the harpsichord rises F, A, C, F while the bass clarinet falls C, A, F; they meet on the A, where the threads cross, and hold
    F major together, the cloth (at chord_at, by default just after the lines have crossed)"""
    ca = chord_at if chord_at is not None else s + 4 * step + 0.1
    for i, (h, b) in enumerate(((F3, C4), (A3, A3), (C4, F3))):
        hpd(h, s + step * i, step + 0.15, g * 0.8, until=until)
        bcl(b, s + step * i, step + 0.05, g * 0.85, rise=0.06, until=until)
    hpd(F4, s + step * 3, 0.5, g * 0.75, until=until)
    bcl(F2, ca, last, g * 0.9, until=until)
    spread((F3, A3, C4, F4), ca + 0.05, last, g * 0.8, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k
def knock(s, g=0.005, pan=0.0, f=200):
    """something set down on the glass, a register laid on the land: one soft, low knock"""
    n = int(0.16 * SR); _fx(_knock(n, f, 0.022), s, g, pan, 1400)
def tap(s, g=0.004, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(_nz(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 230, 0.012), s, g, pan, 1600)
def card(s, g=0.005, pan=0.0):
    """a card or a slip laid down: a soft flap of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(_nz(0.17)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 155, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """paper slid along, or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(_nz(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def brush(s, sec=0.5, g=0.0035, pan=0.0, k=2):
    """a brush's strokes on paper, a name or a plot written: soft, dry and short, a stroke at a time"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(_nz(d + 0.02)[:m], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(_nz(d + 0.02)[:m], 'band', (300, 1400)) * _bump(x, d, 0.8) * (0.4 + 0.6 * gr), t, g, pan, 1600)
def pen(s, sec=0.6, g=0.0035, pan=0.0, k=3):
    """a pen's soft scratch on paper or glass, a stroke at a time"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(_nz(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(_nz(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0035, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def air(s, sec=0.9, g=0.003, pan=0.0):
    """things moving across the frame, or the camera going down to the land: a breath of low air"""
    n = int(sec * SR); x = np.arange(n) / SR; _fx(filt(_nz(sec)[:n], 'band', (140, 900)) * _bump(x, sec), s, g, pan, 1000)
def grain(s, sec=1.2, g=0.0035, pan=0.0):
    """grain poured into sacks by the houses, one soft texture that swells in and settles, never a burst of grains"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(_nz(sec + 0.1)[:n], 'low', 14)); gr = 0.6 + 0.4 * gr / max(1e-9, float(gr.max()))
    _fx(filt(_nz(sec)[:n], 'band', (300, 1500)) * gr * _bump(x, sec, 1.2) * (1 - 0.4 * x / sec), s, g, pan, 1600)
def sack(s, g=0.0045, pan=0.0):
    """a sack of grain set down: a dull, low thump and the grain settling"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 110, 0.04) + 0.35 * filt(_nz(0.3)[:n], 'band', (300, 1200)) * _bump(x - 0.02, 0.22, 1.0) * (x > 0.02), s, g, pan, 1300)
def pages(s, sec=2.6, g=0.0035, pan=0.0):
    """a register's pages lost on the wind: one soft flutter of paper that rises and thins away, not a burst of flicks"""
    n = int(sec * SR); x = np.arange(n) / SR; fl = np.abs(filt(_nz(sec + 0.1)[:n], 'low', 18)); fl = 0.55 + 0.45 * fl / max(1e-9, float(fl.max()))
    _fx(filt(_nz(sec)[:n], 'band', (350, 1700)) * fl * np.minimum(1, x / 0.3) * np.clip((sec - x) / (0.7 * sec), 0, 1) ** 1.5, s, g, pan, 1800)
def rope(s, sec=0.8, g=0.003, pan=0.0):
    """a cord drawn tight across a field: a soft, rising rub of fibre"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec)[:n], 'band', (250, 900)) * _bump(x, sec, 1.0) * (0.5 + 0.5 * x / sec), s, g, pan, 1100)

# =============================================================================================================================
# 1. Lost registers: the opening, the story from outside data, with the harpsichord under it and the bass clarinet's long notes.
#    The title on the land at dusk: the mark, warp and weft. China, 1368, after years of war: D minor, the bass clarinet's low D; a
#    new dynasty: B flat major. What every household owes: F major as the grain is set down by each house, one soft texture; and
#    work: C major, a tap as each worker takes up a pole, a brick, a hoe. The old registers lost in the war: D minor, the pages lost
#    on the wind; no fixed measure: the bass clarinet's A alone, as the sacks lose their size. Zhejiang: A minor; three names written
#    under other households', a brush's stroke for each slip. The burden: D minor, low, a sack set down at each house. What the court
#    needed to know: B flat, then C major on "whose", a tap as the field is outlined, and the harpsichord's A as the house glows.
#    Each chord is held until the next is struck, and in the pauses between lines the harpsichord answers with a note of its chord,
#    so the music runs under the whole story
K = 'lost'
LV[0] = 1.15
kw = lambda lid, word, off=0: W(K, lid, word, off)
kc = lambda lid, off=0: G(K, lid, off)
tWar, tDyn, tOwe, tWork, tLost, tMeas, tHide, tUnd, tHarm, tBur, tNeed, tWho = kw('when', 'war', -0.2), kw('when', 'new dynasty', -0.2), kc('owe', -0.15), \
    kw('owe', 'work', -0.15), kc('lost', -0.15), kw('lost', 'measure', -0.1), kc('hide', -0.15), kw('hide', 'under', -0.1), kc('harm', -0.2), \
    kw('harm', 'burden', -0.1), kc('need', -0.15), kw('need', 'whose', -0.15)
mark(S0(K) + 0.6, last=2.2, g=0.9, until=tWar)
bcl(D3, tWar, 9, 0.8, until=tDyn); spread((D2, A2, D3, F3, A3), tWar + 0.05, 9, 0.8, until=tDyn)
spread((Bb2, F3, Bb3, D4), tDyn, 9, 0.8, until=tOwe); bcl(Bb2, tDyn + 0.2, 9, 0.7, until=tOwe)
hpd(F4, LE(K, 'when') + 0.2, 9, 0.5, pan=px(560), until=tOwe)
spread((F2, C3, F3, A3), tOwe, 9, 0.8, until=tWork); bcl(F3, kw('owe', 'grain', 0.0), 9, 0.65, until=tWork)
spread((C3, G3, C4, E4), tWork, 9, 0.75, until=tLost)
for word, m, x in (('carrying', E4, 1360), ('building', G4, 640), ('mending', C5, 1060)):
    hpd(m, kw('owe', word, -0.1), 1.0, 0.55, pan=px(x), until=tLost)
spread((D2, A2, D3, F3), tLost, 9, 0.8, until=tHide); bcl(D3, tLost + 0.3, 2.6, 0.7, until=tMeas)
bcl(A2, tMeas, 9, 0.75, until=tHide)
hpd(E4, LE(K, 'lost') + 0.15, 9, 0.45, pan=px(960), until=tHide)
spread((A2, E3, A3, C4), tHide, 9, 0.75, until=tHarm)
hpd(E4, LE(K, 'hide') + 0.2, 9, 0.5, pan=px(1200), until=tHarm)
spread((D2, A2, D3, F3), tHarm, 9, 0.85, until=tNeed); bcl(D3, tBur, 9, 0.75, until=tNeed)
hpd(A3, LE(K, 'harm') + 0.2, 9, 0.45, pan=px(700), until=tNeed)
spread((Bb2, F3, Bb3, D4), tNeed, 9, 0.75, until=tWho)
spread((C3, G3, C4, E4), tWho, 9, 0.75, until=E(K) + 0.6); bcl(C3, tWho + 0.2, 9, 0.6, until=E(K) + 0.6)
hpd(A4, kw('need', 'lived', 0.0), 1.6, 0.55, pan=px(1100), until=E(K) + 0.6)
# the city's people on the road; the grain by each house; the workers; the pages; the names; the burden; the field and the house
grain(kw('owe', 'grain', 0.05), 1.4, 0.0032, px(900))
for word, x in (('carrying', 1360), ('building', 640), ('mending', 1060)):
    tap(kw('owe', word, -0.5), 0.003, px(x))
air(tLost + 0.1, 1.0, 0.003, px(960))
pages(kc('lost', 0.3), 3.2, 0.0034, px(760))
for i, x in enumerate((700, 960, 1220)):
    brush(tUnd + 0.5 * i + 1.0, 0.36, 0.0032, px(x), 2)
air(kc('hide', -0.2), 1.6, 0.0028, px(1300))
for k_, x in enumerate((640, 960, 1280)):
    sack(tBur + 0.3 * k_ + 0.3, 0.004, px(x))
tap(tWho + 0.1, 0.0034, px(1180))

# 2. Two registers: the court decides, F major, as the two books are laid down, a knock for each. The Yellow Registers: B flat; the
#    yellow book opens, a page; a village unit of a hundred and ten, F over a low F. The fish-scale registers: C major as the camera
#    goes down to the field, a breath of air; the students' rope drawn tight; the field's outline traced, a brush along it; its shape,
#    its size and its owner's name, a tap each. Drawn plot by plot: D minor, then F, the harpsichord's notes as the plots are drawn.
#    One job each: F, the harpsichord's F for the household register, the bass clarinet's for the land. Warp and weft: the mark, the
#    bass clarinet falling as the warp is drawn and the harpsichord rising across it, the two meeting on the A, and the cloth held.
#    A count again: F major, full, and a knock as the number lands. Sold, and its tax went with it: B flat to F, a breath of air as
#    the sack is carried across, a sack set down, and a tick for the family that no longer pays
K = 'two'
LV[0] = 1.1
tw_ = lambda lid, word, off=0: W(K, lid, word, off)
tc = lambda lid, off=0: G(K, lid, off)
tDe, tYe, tFi, tMe, tSc, tJo, tWa, tWe, tCl, tCo, tSo, tTx = tc('decide', -0.15), tc('yellow', -0.15), tc('fish', -0.15), tw_('fish', 'measured', -0.1), \
    tc('scales', -0.15), tc('jobs', -0.15), tw_('warp', 'warp', -0.05), tw_('warp', 'weft', -0.05), tw_('warp', 'cloth', -0.1), tc('count', -0.15), \
    tc('sold', -0.15), tw_('sold', 'tax', -0.1)
spread((F2, C3, F3, A3, C4), tDe, 9, 0.8, until=tYe); bcl(F2, tDe + 0.2, 9, 0.6, until=tYe)
hpd(C5, LE(K, 'decide') + 0.15, 9, 0.45, pan=px(960), until=tYe)
spread((Bb2, F3, Bb3, D4), tYe, 9, 0.8, until=tFi)
spread((F2, C3, A3, C4), tw_('yellow', 'hundred', -0.15), 9, 0.7, until=tFi); bcl(F2, tw_('yellow', 'hundred', 0.0), 9, 0.6, until=tFi)
spread((C3, G3, C4, E4), tFi, 9, 0.75, until=tSc); bcl(C3, tFi + 0.3, 9, 0.55, until=tSc)
for word, m, x in (('shape', G4, 1300), ('size', E4, 1600), ("owner's", C5, 1900)):
    hpd(m, tw_('fish', word, -0.1), 1.0, 0.5, pan=px(x), until=tSc)
spread((D2, A2, D3, F3, A3), tSc, 9, 0.75, until=tJo)
for i, m in enumerate((A3, C4, D4, F4)):
    hpd(m, tSc + 1.4 + 0.75 * i, 1.2, 0.45, pan=px(780 + 120 * i), until=tJo)
spread((F2, C3, F3, A3), tJo, 9, 0.75, until=tWa)
hpd(F4, tw_('jobs', 'household', -0.05), 1.4, 0.55, pan=px(640), until=tWa); bcl(F2, tw_('jobs', 'land', -0.05), 9, 0.65, pan=px(1280) * 0.5, until=tWa)
mark(tWa, chord_at=tCl, last=tCo - tCl - 0.2, g=0.95, until=tCo)
spread((F2, C3, F3, A3, C4, F4), tCo, 9, 0.8, until=tSo); bcl(F2, tCo + 0.2, 9, 0.6, until=tSo)
spread((Bb2, F3, Bb3, D4), tSo, 9, 0.75, until=tTx)
spread((F2, C3, A3, F4), tTx, 9, 0.75, until=E(K) + 0.4); bcl(F2, tTx + 0.2, 9, 0.55, until=E(K) + 0.4)
hpd(A4, tw_('sold', 'no family', 0.0), 1.6, 0.5, pan=px(560), until=E(K) + 0.4)
# the two books laid down, the yellow one opened; the camera down to the field; the rope, the outline, the three names; the plots
knock(tc('decide', 0.3), 0.0042, px(640), 170); knock(tc('decide', 0.5), 0.0042, px(1280), 170)
card(tc('yellow', 1.5), 0.0042, px(760))
air(tc('fish', 0.2), 1.8, 0.003, px(1300))
rope(tMe - 0.5, 0.8, 0.003, px(1500))
slide(tMe + 0.1, 2.4, 0.003, px(1550))
for word, x in (('shape', 1300), ('size', 1600), ("owner's", 1900)):
    tap(tw_('fish', word, 0.0), 0.003, px(x))
card(tc('scales', 0.6), 0.0042, px(960))
for i in range(4):
    brush(tSc + 1.3 + 0.75 * i, 0.4, 0.003, px(780 + 120 * i), 2)
tap(tw_('jobs', 'one job', -0.05), 0.0032, px(960))
slide(tw_('count', 'count', 0.2), 2.4, 0.0026, px(1200)); knock(tw_('count', 'count', 2.6), 0.0042, px(1200))
air(tw_('sold', 'tax', 0.0), 1.5, 0.003, px(960)); sack(tw_('sold', 'tax', 1.45), 0.004, px(1200))
ticked(tw_('sold', 'no family', 0.1), 0.0034, px(560))

# 3. The sketch we drew: the opening is over, and the music comes only at a turn. The same need: F major, then C, as the line between
#    the court and the university is drawn. The intro's promise, a card. The sketch: a tap as each box is named, and a line drawn as
#    they're joined. Noor slides in, a breath of air. Each box needs a place: a harpsichord note for each of its four parts, rising,
#    F, A, C, E. The map: the four fly up, a breath of air; the enterprise architecture films, a card
K = 'sketch'
LV[0] = 1.0
sw = lambda lid, word, off=0: W(K, lid, word, off)
sc_ = lambda lid, off=0: G(K, lid, off)
spread((F2, C3, A3, C4), S0(K) + 0.3, 2.0, 0.75)
bcl(C3, sw('same', 'same need', 0.0), 1.8, 0.55); hpd(E4, sw('same', 'same need', 0.15), 1.6, 0.5)
slide(sw('same', 'same need', 0.0), 0.9, 0.003, px(960))
card(sc_('promise', -0.1), 0.0042, px(960))
for word, x in (('student', 650), ('class', 1050), ('enrolment', 850), ('term', 1050), ('course', 650)):
    tap(sw('drew', word, 0.0), 0.003, px(x))
slide(sw('drew', 'course', 0.3), 1.2, 0.0026, px(850))
air(sc_('noor', -0.3), 1.2, 0.003, px(200))
for word, m, x in (('for', F4, 760), ('answers', A4, 1180), ('written', C5, 760), ('means', E5, 1180)):
    hpd(m, sw('place', word, 0.0), 1.1, 0.5, pan=px(x))
air(sc_('map', 0.25), 1.4, 0.003, px(960))
card(sw('map', 'enterprise', 0.1), 0.0042, px(960))

# 4. What it does: the chapter turns on C major as the capabilities come in, a tap for every other tile. HERM's frame, a line drawn.
#    What, not how: a tap as each how changes. Learning and teaching opens: A minor then F, a breath of air, a tap as each of its
#    capabilities comes, and a knock as the boxes land in their places. Counting on census date: the bass clarinet's D, low, and the
#    term moved across to planning, a breath of air
K = 'does'
dw = lambda lid, word, off=0: W(K, lid, word, off)
dc = lambda lid, off=0: G(K, lid, off)
spread((C3, G3, C4, E4), S0(K) + 0.4, 2.2, 0.7)
for i in range(0, 8, 2):
    tap(dc('caps', 0.5 + i * 0.32), 0.0028, px(300 + 450 * (i % 4)))
slide(dw('herm', 'Herm', 0.0), 1.2, 0.0026, px(960))
for i in range(3):
    tap(dw('what', 'Systems', 1.5 * i), 0.0028, px(1300))
spread((A2, E3, A3, C4), dc('open', 0.0), 1.8, 0.7); hpd(F4, dc('open', 1.5), 2.0, 0.5)
air(dc('open', 0.1), 1.4, 0.003, px(960))
for i in range(5):
    tap(dc('open', 0.6 + i * 0.22), 0.0026, px(300 + 320 * i))
for word, x in (('awards', 310), ('learner', 954)):
    knock(dw('open', word, 1.0), 0.0038, px(x))
bcl(D3, dw('census', 'planning', -0.1), 1.6, 0.6)
air(dw('census', 'planning', 0.1), 1.0, 0.003, px(700))
tap(dw('census', 'planning', 0.0), 0.003, px(380))

# 5. What it needs to know: the chapter turns on F major, low, as the domains come in. Each owner named, a tap. Mei slides in, a
#    breath of air. The boxes fall into their domains, a knock as each lands. An owner decides: B flat, then F, as "builds" is struck
#    out, a pen's stroke, and the two cards come in
K = 'knows'
nw_ = lambda lid, word, off=0: W(K, lid, word, off)
nc = lambda lid, off=0: G(K, lid, off)
spread((F2, A2, F3, C4), S0(K) + 0.4, 2.2, 0.7); bcl(F2, S0(K) + 0.6, 1.8, 0.5)
for word, x in (('person', 300), ('student', 760), ('course', 1220), ('staff', 1680), ('finance', 300)):
    tap(nw_('domains', word, 0.0), 0.0028, px(x))
air(nc('mei', -0.4), 1.2, 0.003, px(220))
for word, x in (('student', 500), ('enrolment', 640), ('the course', 1150), ('class', 1290), ('term', 1420)):
    knock(nw_('drop', word, 0.85), 0.0036, px(x))
pen(nw_('decides', 'build', 0.4), 0.4, 0.0032, px(520), 2)
spread((Bb2, F3, Bb3, D4), nw_('decides', 'mean', -0.1), 1.4, 0.6); hpd(F4, nw_('decides', 'good', -0.05), 1.8, 0.5)
card(nw_('decides', 'mean', 0.0), 0.004, px(920)); card(nw_('decides', 'good', 0.0), 0.004, px(1490))

# 6. Where it's written: the chapter turns on A minor as the student system comes in, a knock; HR's and Finance's, a knock each.
#    Students, enrolments and courses, a tap each. The data platform's copies: a knock, a line drawn for each copy, a tap for each
#    tag. The two disagree, a tap; the record wins: C major, the record's word along the line, a breath of air, and a tick; a mistake
#    fixed where it was written: the pen goes back to the record, a pen's stroke, and the harpsichord's E settles on F
K = 'kept'
pw = lambda lid, word, off=0: W(K, lid, word, off)
pc_ = lambda lid, off=0: G(K, lid, off)
spread((A2, E3, A3, C4), S0(K) + 0.5, 2.0, 0.7)
knock(pc_('sor', 0.4), 0.004, px(480))
knock(pw('sis', 'HR', 0.0), 0.0036, px(315)); knock(pw('sis', 'Finance', 0.0), 0.0036, px(645))
for word in ('Students', 'enrolments', 'courses'):
    tap(pw('sis', word, 0.0), 0.0028, px(250))
knock(pc_('copies', -0.2), 0.004, px(1420))
for i in range(3):
    slide(pw('copies', 'copies', 0.3 + 0.25 * i), 0.6, 0.0024, px(950))
for word, x in (('read', 1180), ('count', 1400), ('never', 1420)):
    tap(pw('copies', word, 0.0), 0.0028, px(x))
tap(pw('fix', 'disagree', 0.0), 0.003, px(1200))
air(pw('fix', 'wins', 0.1), 0.8, 0.0026, px(950))
spread((C3, G3, C4, E4), pw('fix', 'wins', -0.05), 1.6, 0.65); ticked(pw('fix', 'wins', 0.1), 0.0034, px(560))
pen(pw('fix', 'fixed', 0.6), 0.5, 0.0032, px(470), 2)
hpd(E4, pw('fix', 'fixed', 0.0), 0.7, 0.5); hpd(F4, pw('fix', 'fixed', 0.65), 1.8, 0.5)

# 7. What the words mean: the chapter turns on F major as the glossary comes in, a knock; the award's card, a card; the model copies
#    it, a pen's run as the words are typed. The sketch's words looked up: a tap as each comes, a tick for the three that are the
#    university's, and D minor as two of them aren't. Unit offering and teaching period, a card each, and each old word struck out.
#    Who does what: a tap for each, the three rising, F, A, C, on the harpsichord
K = 'means'
mw = lambda lid, word, off=0: W(K, lid, word, off)
mc = lambda lid, off=0: G(K, lid, off)
spread((F2, C3, F3, A3, C4), S0(K) + 0.4, 2.0, 0.65)
knock(mc('gloss', 0.3), 0.004, px(380))
card(mc('gloss', 1.0), 0.004, px(1210))
pen(mw('first', 'copies', 0.0), 2.0, 0.0026, px(1210), 5)
tap(mw('first', 'word for word', 0.0), 0.003, px(1560))
for i, x in enumerate((760, 900, 1080, 1250, 1400)):
    tap(mc('look', 0.0) + 0.12 * i, 0.0026, px(x))
for i, x in ((0, 760), (2, 1080), (4, 1400)):
    ticked(mw('look', "sketch's words", 0.6 + 0.3 * i), 0.0026, px(x))
spread((D3, A3, D4, F4), mw('look', 'two of them', -0.05), 1.8, 0.6); bcl(D3, mw('look', 'two of them', 0.1), 1.6, 0.5)
card(mw('cls', 'unit offerings', 0.0), 0.004, px(960)); pen(mw('cls', 'not classes', 0.0), 0.36, 0.003, px(900), 2)
card(mw('term', 'teaching periods', 0.0), 0.004, px(1500)); pen(mw('term', 'not terms', 0.0), 0.36, 0.003, px(1250), 2)
for word, m, x in (('Owners', F4, 330), ('stewards', A4, 820), ('data team', C5, 1380)):
    tap(mw('gov', word, 0.0), 0.0028, px(x)); hpd(m, mw('gov', word, 0.0), 1.2, 0.45, pan=px(x))

# 8. Warp and weft: the two maps crossed, and the mark as their threads are drawn: the harpsichord rising across, the bass clarinet
#    falling down, meeting on the A, and the cloth held as the threads cross. Each crossing: one soft run of paper as the cells come in.
#    The sketch hangs on the map: F major as the board comes back, a knock, and a slide as the pins are set. All but two: a tap as each
#    question is pinned. In the pause without words, the harpsichord answers: D minor, then F, the question left open
K = 'cross'
xw = lambda lid, word, off=0: W(K, lid, word, off)
xc = lambda lid, off=0: G(K, lid, off)
mark(xw('cross', 'warp', -0.05), chord_at=xw('cross', 'needs to know', 0.1), last=2.4, g=0.9)
slide(xc('one', 0.2), 1.9, 0.0026, px(1180))
knock(xc('hang', 0.2), 0.004, px(960))
spread((F2, C3, F3, A3, C4), xc('hang', 0.1), 2.2, 0.6)
slide(xc('hang', 0.8), 2.2, 0.0024, px(960))
tap(xw('two', 'class', 0.0), 0.003, px(1640)); tap(xw('two', 'term', 0.0), 0.003, px(1640))
spread((D2, A2, D3, F3), xc('breath', -0.3), 1.6, 0.6); hpd(E4, xc('breath', 1.0), 0.7, 0.5); hpd(F4, xc('breath', 1.6), 2.0, 0.5)

# 9. Where the work starts: the question, a card, as the pause's F still rings. The five steps come in, a tap each; each lights in
#    turn, a knock; and only then is the model built: F major, the bass clarinet's F under the harpsichord's
K = 'start'
sw2 = lambda lid, word, off=0: W(K, lid, word, off)
sc2 = lambda lid, off=0: G(K, lid, off)
card(sc2('q', 0.2), 0.004, px(960))
for i in range(5):
    tap(sc2('q', 1.2 + 0.2 * i), 0.0026, px(300 + 330 * i))
for i, (lid, word) in enumerate((('flow', 'ticket'), ('flow', 'map'), ('flow', 'glossary'), ('build', 'contract'), ('build', 'model'))):
    knock(sw2(lid, word, 0.0), 0.0034, px(300 + 330 * i))
spread((F2, C3, A3, C4, F4), sw2('build', 'model', -0.05), 2.2, 0.6); bcl(F2, sw2('build', 'model', 0.1), 1.8, 0.5)
tap(sw2('build', 'exists', 0.0), 0.003, px(960))

# 10. Pull back: the two registers on the land again, F major over the bass clarinet's F, a knock as each is laid down, and the keepers
#    come in; the university's map: a breath of air as the room comes over the land, the dashboard's card, and the bass clarinet's D,
#    low, at "wrong"; a line drawn to the record and to its owner, a card each. The next film, a card. Under the end card, without
#    words, the mark, warp and weft, its F major held to the end
K = 'end'
ew = lambda lid, word, off=0: W(K, lid, word, off)
ec = lambda lid, off=0: G(K, lid, off)
spread((F2, C3, F3, A3, C4), S0(K) + 0.3, 2.4, 0.7)
knock(S0(K) + 0.5, 0.0038, px(640), 170); knock(S0(K) + 0.75, 0.0038, px(1280), 170)
bcl(F2, S0(K) + 0.5, 2.4, 0.5)
air(ec('uni', -0.3), 1.0, 0.003, px(960)); card(ec('uni', 0.35), 0.004, px(510))
bcl(D3, ew('uni', 'wrong', -0.05), 1.6, 0.55)
slide(ew('uni', 'whose record', 0.0), 1.0, 0.0026, px(970)); card(ew('uni', 'whose record', 0.4), 0.0038, px(1430)); card(ew('uni', 'whose record', 0.7), 0.0038, px(1430))
card(ew('next', 'next film', 0.0), 0.004, px(970))
mark(ec('tag', 0.2), last=E(K) - ec('tag', 2.2) - 0.2, g=0.85, until=E(K))

# PLAYBOOK.md: the whole score, music and effects, is low-passed at 2.6 kHz last, so no instrument rings above the voice
soften()
