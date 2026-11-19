# A Sharper Sketch: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py), and
# checked by tools/quiet.py. Made again on 19 November 2026, when the film became the second of Model the business: its sound once laid
# warm pads under every chapter and pulsed while the numbers disagreed; now it keeps the rules every film keeps (AGENTS.md):
#  - Music under the opening story (China, 1391: the four columns), then only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice; no figure played again soon after itself; nothing pulses; music and effects no
#    louder than the governance films'.
#  - Every sound is an event on screen, at its moment: each uses the same word and offset as the picture in src/scenes.js, and pans to
#    where it's drawn, so sound and picture stay together when the voice is re-timed.
# Its palette is the film's own, as it was: a felt piano, placing notes sparsely like a pencil on paper, over a soft held voice, warm
# and open, in D major. The first film of the series has a harpsichord and a bass clarinet; nothing here is theirs. Nothing Chinese is
# borrowed for the story: no zither, bells, gongs or wood blocks, and no five-note tune; it leans on the semitones (C sharp to D, F
# sharp to G) a five-note tune leaves out. B minor where the story turns to a loss, a burden or a doubt; F sharp minor where a number
# doesn't add up. Tuned pure from D: D, G and A major, B and F sharp minor; E is played only within A major, never with G.
#  - The film's mark: the felt piano rises D, F sharp, A, D over a D major chord: the four columns. Under the title, as the columns
#    are named, at "Like the four columns" in Enrolled when?, and under the end card.
# Everything stays low and soft: the felt piano low-passed at 2.2 kHz, the held voice at 1.6 kHz, the effects below about 2.2 kHz and
# far under the music.

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
R1 = np.random.default_rng(1391)  # this film's own randomness: the felt, the paper, the air, the grain

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.4162 * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2, Cs3, D3, E3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5, E5, Fs5, A5 = \
    38, 42, 43, 45, 47, 49, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 81
DM, DM2, GM, GM7, AM, BM, FSM = (D3, A3, D4, Fs4), (D3, Fs3, A3, D4), (G2, D3, G3, B3), (G2, D3, B3, Fs4), (A2, E3, A3, Cs4), \
    (B2, Fs3, B3, D4), (Fs2, Cs3, Fs3, A3)

# ---- the levels: the two matched by loudness, as far under the voice as the site's other music; the effects far under the music
# (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter: the opening a little fuller
LF, LP, FX = 0.096, 0.0325, 3.4
LV = [1.0]

# a small room round the two, ringing on for under a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, as the video guidelines ask
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
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
_pan = lambda m: max(-0.4, min(0.4, (m - 62) * 0.025))
def _nz(sec):
    return R1.standard_normal(max(1, int(sec * SR))).astype(np.float32)

# ---- the felt piano: a note at a time, like a pencil on paper
def fp(m, s, hold=1.8, g=1.0, pan=None, until=None, room=0.2):
    """the felt piano: a felt hammer strikes the string softly, so the note speaks a moment rounder than a bare hammer's and its upper
    partials are few; they die first, the lower ring on softer while the key is held (hold seconds), and the damper stops it when it's
    let go. Every partial exactly in tune; the felt's small, low thump at the start"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(0.25, until - s - 0.3))
    sec = hold + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    T1 = 2.4 * (147.0 / f0) ** 0.5
    sig = np.zeros(n)
    for k, w in ((1, 1.0), (2, 0.4), (3, 0.15), (4, 0.06), (5, 0.025)):
        f = f0 * k
        if f > 2400:
            break
        sig += w * np.exp(-x / (T1 / (1 + 0.7 * (k - 1)))) * np.sin(2 * np.pi * f * x + 0.37 * k * k)
    sig *= np.minimum(1, x / 0.005) * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.09))
    sig /= max(1e-9, float(np.abs(sig).max()))
    q = int(0.03 * SR); xq = np.arange(q) / SR
    th = filt(_nz(0.03)[:q], 'band', (120, 600)) * np.exp(-xq / 0.008)
    sig[:q] += 0.035 * th / max(1e-9, float(np.abs(th).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 50)), room, 0.02, max(0.3, min(hold, 1.0))), s, until)
    put(sig, s, g * LV[0] * LF, _pan(m) if pan is None else pan)

# ---- the held voice: soft and warm, under the felt piano
def wp(m, s, hold=3.0, g=1.0, pan=None, until=None, att=0.7, room=0.24):
    """a soft held voice, like a reed organ played very quietly: it swells in over att seconds, holds at one level, with no vibrato and
    nothing detuned, and fades as the key is let go. A few partials, all exactly in tune"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(att + 0.2, until - s - 0.5))
    rel = 0.8; sec = hold + rel; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k, w in ((1, 1.0), (2, 0.3), (3, 0.1), (4, 0.04)):
        f = f0 * k
        if f > 1800:
            break
        sig += w * np.sin(2 * np.pi * f * x + 0.7 * k)
    sig *= np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2 * np.where(x < hold, 1.0, np.cos(0.5 * np.pi * np.minimum(1, (x - hold) / rel)) ** 2)
    sig /= max(1e-9, float(np.abs(sig).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1600), 'high', 45)), room, att, max(att + 0.2, hold)), s, until)
    put(sig, s, g * LV[0] * LP, _pan(m) * 0.6 if pan is None else pan)
def held(notes, s, hold=3.0, g=1.0, until=None):
    """a chord on the held voice, its notes together"""
    for i, m in enumerate(notes):
        wp(m, s, hold, g * (1.0 if i == 0 else 0.78), until=until)
def mark(s, last=2.6, g=1.0, step=0.42, until=None):
    """the film's mark: the felt piano rises D, F sharp, A, D, one column at a time, over D major held"""
    for i, m in enumerate((D4, Fs4, A4, D5)):
        fp(m, s + step * i, step + 0.5 if i < 3 else last, g * (0.75 if i < 3 else 0.85), until=until)
    held(DM, s + step * 3 - 0.2, last, g * 0.9, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k
def knock(s, g=0.0042, pan=0.0, f=190):
    """something set down: a register laid down, a card landing on the glass: one soft, low knock"""
    n = int(0.16 * SR); _fx(_knock(n, f, 0.022), s, g, pan, 1400)
def tap(s, g=0.003, pan=0.0):
    """something small set down, a box or a word coming in: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(_nz(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 230, 0.012), s, g, pan, 1600)
def card(s, g=0.0042, pan=0.0):
    """a card, a sheet or a page laid down: a soft flap of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(_nz(0.17)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 155, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def slide(s, sec=0.9, g=0.003, pan=0.0):
    """paper slid along, or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(_nz(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def brush(s, sec=0.5, g=0.003, pan=0.0, k=2):
    """a brush's strokes on paper, a field written in a register: soft, dry and short, a stroke at a time"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(_nz(d + 0.02)[:m], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(_nz(d + 0.02)[:m], 'band', (300, 1400)) * _bump(x, d, 0.8) * (0.4 + 0.6 * gr), t, g, pan, 1600)
def pen(s, sec=0.5, g=0.003, pan=0.0, k=2):
    """a pen's soft scratch on glass, a word written in the sketch's colour, a stroke at a time"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(_nz(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(_nz(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def air(s, sec=0.9, g=0.0028, pan=0.0):
    """the camera going down to the land, a sheet lifted away, a picture changing: a breath of low air"""
    n = int(sec * SR); x = np.arange(n) / SR; _fx(filt(_nz(sec)[:n], 'band', (140, 900)) * _bump(x, sec), s, g, pan, 1000)
def grain(s, sec=1.2, g=0.0032, pan=0.0):
    """grain set down by the houses, year after year: one soft texture that swells in and settles, never a burst of grains"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(_nz(sec + 0.1)[:n], 'low', 14)); gr = 0.6 + 0.4 * gr / max(1e-9, float(gr.max()))
    _fx(filt(_nz(sec)[:n], 'band', (300, 1500)) * gr * _bump(x, sec, 1.2) * (1 - 0.4 * x / sec), s, g, pan, 1600)
def sack(s, g=0.004, pan=0.0):
    """a sack of grain set down: a dull, low thump and the grain settling"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 110, 0.04) + 0.35 * filt(_nz(0.3)[:n], 'band', (300, 1200)) * _bump(x - 0.02, 0.22, 1.0) * (x > 0.02), s, g, pan, 1300)
def pages(s, sec=1.6, g=0.003, pan=0.0):
    """books laid one after another, or pages turned: one soft flutter of paper that rises and settles, not a burst of flicks"""
    n = int(sec * SR); x = np.arange(n) / SR; fl = np.abs(filt(_nz(sec + 0.1)[:n], 'low', 18)); fl = 0.55 + 0.45 * fl / max(1e-9, float(fl.max()))
    _fx(filt(_nz(sec)[:n], 'band', (350, 1700)) * fl * np.minimum(1, x / 0.3) * np.clip((sec - x) / (0.7 * sec), 0, 1) ** 1.5, s, g, pan, 1800)

# =============================================================================================================================
# 0. Four columns: the opening, the story from outside data, with the held voice under it and the felt piano placing its notes.
#    The title on the land at dusk: the mark. China, 1391, the registers made again: D major. A village changes: G major as children
#    are born, B minor as parents die, D again as fields are bought and sold. A new total can't show what changed: F sharp minor, and
#    the felt piano's two questions, sold or hidden. The burden: B minor, low, a sack set down by each house. What the court needed:
#    G, then A as the book rises and lands. The four columns: D major, the mark's four notes as each column is named. They add up: G,
#    then D as the field arrives. Checked, and sent back: A major, then F sharp minor at "doesn't add up". Each number with its story:
#    D major, full, a note for each column as it lights. The same need for data: G with its major seventh, then D at "which day".
#    Each chord is held until the next, and in the pauses between lines the felt piano answers with a note of its chord, so the
#    music runs under the whole story
K = 'cols'
LV[0] = 1.08
kw = lambda lid, word, off=0: W(K, lid, word, off)
kc = lambda lid, off=0: G(K, lid, off)
tWh, tCh, tBo, tDi, tSo, tTo, tHa, tNe, tWr, tCo, tSu, tAr, tBa, tDo, tSt, tDa, tDay = kc('when', -0.2), kc('change', -0.15), \
    kw('change', 'born', -0.2), kw('change', 'die', -0.1), kw('change', 'sold', -0.1), kc('total', -0.15), kc('harm', -0.2), kc('need', -0.15), \
    kw('need', 'where', -0.15), kc('cols', -0.15), kc('sum', -0.15), kw('sum', 'arrives', 0.2), kc('back', -0.15), kw('back', "doesn't", -0.2), \
    kc('story', -0.15), kc('data', -0.15), kw('data', 'which day', -0.15)
mark(S0(K) + 0.5, last=tWh - S0(K) - 1.8, g=0.9, until=tWh)
held(DM2, tWh, 9, 0.85, until=tCh); fp(A4, LE(K, 'when') + 0.2, 1.6, 0.5, pan=px(1200), until=tCh)
held(GM, tCh, 9, 0.8, until=tDi); fp(B4, tBo + 0.2, 1.4, 0.5, pan=px(700), until=tDi)
held(BM, tDi, 9, 0.75, until=tSo)
held(DM, tSo, 9, 0.75, until=tTo); fp(Fs4, LE(K, 'change') + 0.2, 1.4, 0.45, pan=px(960), until=tTo)
held(FSM, tTo, 9, 0.75, until=tHa)
fp(Cs5, kw('total', 'sold', 0.3), 1.0, 0.45, pan=px(700), until=tHa); fp(A4, kw('total', 'hidden', 0.3), 1.2, 0.45, pan=px(1300), until=tHa)
held((B2, Fs3, B3), tHa, 9, 0.8, until=tNe); fp(Fs4, LE(K, 'harm') + 0.3, 1.6, 0.45, pan=px(1100), until=tNe)
held(GM, tNe, 9, 0.75, until=tWr)
held(AM, tWr, 9, 0.75, until=tCo); fp(E4, LE(K, 'need') + 0.3, 1.4, 0.45, pan=px(960), until=tCo)
held(DM2, tCo, 9, 0.8, until=tSu)
for word, m, x in (('held', D4, 1248), ('came in', Fs4, 1056), ('went out', A4, 864), ('holds now', D5, 672)):
    fp(m, kw('cols', word, -0.1), 1.3, 0.5, pan=px(x), until=tSu)
held(GM, tSu, 9, 0.75, until=tAr)
held((D3, A3, Fs4), tAr, 9, 0.75, until=tBa); fp(B4, kw('sum', 'add up', 0.1), 1.0, 0.45, pan=px(760), until=tAr)
held(AM, tBa, 9, 0.75, until=tDo)
held(FSM, tDo, 9, 0.75, until=tSt); fp(Cs4, kw('back', 'sent', 0.1), 1.6, 0.45, pan=px(1440), until=tSt)
held((D3, A3, D4, Fs4), tSt, 9, 0.85, until=tDa)
for i, m in enumerate((A4, B4, D5, Fs5)):
    fp(m, kc('story', 0.4 + i * 0.55), 1.0, 0.42, pan=px(1248 - 192 * i), until=tDa)
held(GM7, tDa, 9, 0.75, until=tDay)
held(DM, tDay, 9, 0.75, until=E(K) + 0.5); fp(A4, LE(K, 'data') + 0.3, 1.4, 0.45, pan=px(672), until=E(K) + 0.5)
# the village head on the road; the child born and the parent gone; the field sold; the questions; the burden; the book; the columns
air(kc('when', 0.4), 1.6, 0.0026, px(400))
card(kw('change', 'fields', 0.0), 0.0034, px(900))
slide(kw('change', 'sold', 0.0), 1.2, 0.0028, px(820))
tap(kw('total', 'total', 0.05), 0.003, px(940))
slide(kw('total', 'sold', -0.1), 1.0, 0.0026, px(700)); slide(kw('total', 'hidden', -0.1), 1.4, 0.0026, px(1250))
for k_, x in enumerate((780, 1080, 1360)):
    sack(kw('harm', 'falls', 0.3 * k_), 0.0036, px(x))
air(kc('need', 0.3), 1.2, 0.0026, px(960)); knock(kc('need', 1.1), 0.004, px(960), 170)
card(kc('cols', 0.2), 0.004, px(960))
for word, x in (('held', 1248), ('came in', 1056), ('went out', 864), ('holds now', 672)):
    brush(kw('cols', word, 0.0), 0.5, 0.0028, px(x), 2)
slide(kw('sum', 'leaves', 0.0), 1.1, 0.0028, px(960)); tap(kw('sum', 'arrives', 0.4), 0.0032, px(760))
knock(kc('back', 0.0), 0.0038, px(560), 180); knock(kc('back', 0.3), 0.0038, px(1000), 180)
knock(kw('back', "doesn't", -0.3), 0.0036, px(1430), 200); slide(kw('back', 'sent', 0.0), 1.1, 0.0028, px(1520))
pen(kw('data', 'what it counts', -0.1), 0.5, 0.0026, px(672), 2); pen(kw('data', 'which day', -0.1), 0.5, 0.0026, px(672), 2)

# 1. The sketch on the map: the opening is over, and the music comes only at a turn. The sketch as the first film left it: B minor
#    under the room's change, the held voice alone. Each box named: a tap. The pins: one soft slide as they come in. Where each box
#    lives: the felt piano's A. The map left behind: a breath of air. The three questions: a tap each. Every model starts simple and
#    gets sharper: G, then D, under the light sweeping across
K = 'drawn'
LV[0] = 1.0
dw = lambda lid, word, off=0: W(K, lid, word, off)
dc = lambda lid, off=0: G(K, lid, off)
held((B2, Fs3, D4), S0(K) + 0.2, 2.6, 0.7)
for word, x in (('student', 576), ('class', 1368), ('enrolment', 972), ('term', 1368), ('course', 576)):
    tap(dw('recap', word, -0.15), 0.0026, px(x))
slide(dw('recap', 'place', 0.0), 1.2, 0.0026, px(960))
fp(A4, dw('map', 'where', -0.1), 1.6, 0.5, pan=px(960))
air(dw('map', 'right', -0.1), 1.0, 0.0026, px(960))
for i, x in enumerate((1368, 1368, 576)):
    tap(dc('over', 0.8 + 0.5 * i), 0.0026, px(x))
held((G2, D3, B3), dc('normal', 0.4), 1.6, 0.7); fp(D5, dc('normal', 0.5), 1.2, 0.45, pan=px(300))
held((D3, A3, Fs4), dc('normal', 2.2), 2.2, 0.7); air(dc('normal', 0.5), 2.8, 0.0024, px(960))

# 2. Two numbers: the question, a tap as it comes; the two numbers, a card each; every test passed, a tap. The difference is in the
#    meaning: the felt piano's low F sharp, alone. A wider question: G with its major seventh, the chapter's turn. The reference laid
#    over the sketch: a sheet slid across. In the wordless end, the felt piano answers once more, B, then D
K = 'two'
tw_ = lambda lid, word, off=0: W(K, lid, word, off)
tc = lambda lid, off=0: G(K, lid, off)
held((B2, Fs3, B3), S0(K) + 0.2, 2.4, 0.65)
tap(tc('q', 0.0), 0.003, px(800))
card(tc('nums', 0.0), 0.0038, px(1500)); card(tc('nums', 1.6), 0.0038, px(1500))
tap(tc('clean', 0.2), 0.0026, px(1500))
fp(Fs3, tc('meaning', 0.1), 2.0, 0.55, pan=px(960))
held(GM7, tc('check', 0.0), 2.6, 0.7)
card(tw_('tcsi', 'TCSI', 0.4), 0.0034, px(1200))
slide(tc('mcds', 4.2), 1.4, 0.0028, px(960))
fp(B4, tc('breath', 0.4), 1.2, 0.45, pan=px(700)); fp(D5, tc('breath', 1.3), 1.4, 0.45, pan=px(1200))

# 3. What is a class?: the reference laid over the sketch, a sheet slid across; the one box split in three, a tap each, and the felt
#    piano's A major as the unit, the offering and the class each come; Genie counted places: a low knock; the count corrected: one
#    soft slide and a tap where it lands. The grain: D, held, the chapter's turn
K = 'cls'
cw = lambda lid, word, off=0: W(K, lid, word, off)
cc = lambda lid, off=0: G(K, lid, off)
slide(cc('ref', -0.1), 1.4, 0.0028, px(960))
for k_ in range(3):
    tap(cc('hiding', 0.3 + 0.25 * k_), 0.0028, px(1100 + 140 * k_))
for lid, m, x in (('unit', A4, 760), ('offering', Cs5, 1100), ('classes', E5, 1440)):
    fp(m, cc(lid, 0.9), 1.2, 0.45, pan=px(x))
knock(cc('genie', 0.3), 0.0036, px(1500), 150)
slide(cc('genie', 2.2), 1.0, 0.0024, px(1500)); tap(cc('genie', 3.25), 0.003, px(1500))
held((D3, A3, Fs4), cc('grain', 0.0), 2.4, 0.7)

# 4. Whose census date?: the reference over the sketch, a sheet slid across; the date moved to each unit enrolment, a breath of air;
#    the summer intensive, a tap for each date; adopted: G to D on the held voice, and the count lands with a tap
K = 'census'
sc2 = lambda lid, off=0: G(K, lid, off)
held((G2, D3, G3, B3), S0(K) + 0.2, 2.2, 0.65)
slide(sc2('ref', -0.1), 1.4, 0.0028, px(960))
tap(sc2('summer', 0.3), 0.0028, px(1200)); tap(sc2('summer', 1.1), 0.0028, px(1450))
air(sc2('adopt', 0.3), 1.4, 0.0026, px(700))
held((D3, A3, D4, Fs4), sc2('adopt', 1.5), 2.2, 0.65); tap(sc2('adopt', 2.65), 0.003, px(1600))

# 5. One student, two courses: two students counted twice, a low knock; the reference has the answer, a sheet slid across, the new
#    box set down, a tap; counted once: the felt piano's D, and the count lands. The link deserves its own box: A major, the turn
K = 'courses'
oc = lambda lid, off=0: G(K, lid, off)
fp(B3, oc('twice', 0.2), 1.6, 0.5, pan=px(960))
knock(oc('one', 0.3), 0.0036, px(900), 150)
slide(oc('admission', -0.1), 1.4, 0.0028, px(960)); air(oc('admission', 3.0), 1.4, 0.0024, px(960)); tap(oc('admission', 3.7), 0.003, px(760))
fp(D5, oc('once', 0.6), 1.4, 0.45, pan=px(1600)); tap(oc('once', 1.65), 0.003, px(1600))
held(AM, oc('link', 0.3), 2.4, 0.65)

# 6. Enrolled when?: an enrolment's story, frame by frame, a tap each; kept with its date: the snapshot, a card, and the count lands,
#    the felt piano's F sharp. Like the four columns: the film's mark again, as the four columns of the present are written, a pen
#    for each
K = 'time'
ew = lambda lid, word, off=0: W(K, lid, word, off)
ec = lambda lid, off=0: G(K, lid, off)
held((Fs2, Cs3, A3), S0(K) + 0.2, 2.2, 0.6)
for k_ in range(4):
    tap(ec('change', 0.4 + 0.9 * k_), 0.0026, px(640 + 220 * k_))
card(ec('snap', 0.3), 0.0036, px(760)); fp(Fs4, ec('snap', 2.7), 1.4, 0.45, pan=px(1700)); tap(ec('snap', 2.6), 0.0028, px(1700))
card(ec('cols', 0.2), 0.0036, px(960))
for word, x in (('census date', 592), ('came in', 838), ('went out', 1082), ('today', 1328)):
    pen(ew('cols', word, -0.1), 0.4, 0.0024, px(x), 2)
for i, (word, m) in enumerate((('census date', D4), ('came in', Fs4), ('went out', A4), ('today', D5))):
    fp(m, ew('cols', word, -0.1), 1.0 if i < 3 else 2.2, 0.5 if i < 3 else 0.55, pan=px(592 + 245 * i))
held(DM, ew('cols', 'today', -0.3), 2.6, 0.7)

# 7. Three levels of precision: the camera zooms in twice, a breath of air each; the three levels agree, a tap each. Same meaning,
#    three levels: A major, then D, the turn
K = 'levels'
lc = lambda lid, off=0: G(K, lid, off)
held((D3, A3, D4), S0(K) + 0.2, 2.0, 0.6)
air(lc('logical', 0.2), 1.4, 0.0026, px(960)); air(lc('physical', 0.2), 1.2, 0.0026, px(960))
for k_ in range(3):
    tap(lc('agree', 0.6 * k_), 0.0026, px(600 + 360 * k_))
held(AM, lc('agree', 2.2), 1.8, 0.6); fp(E5, lc('agree', 2.4), 1.2, 0.42, pan=px(1300))

# 8. Check, adopt, extend, record: the reference lifted away, a sheet slid off, and the differences set down, a tap for three; adopt,
#    the felt piano's D; extend, its A; record, a card. A starting point, not a cage: G, then D, the turn
K = 'fit'
fc = lambda lid, off=0: G(K, lid, off)
slide(fc('lift', 0.3), 1.8, 0.0028, px(960))
for k_ in range(3):
    tap(fc('lift', 2.2 + 0.75 * k_), 0.0026, px(600 + 360 * k_))
fp(D5, fc('adopt', 0.4), 1.4, 0.45, pan=px(700)); fp(A4, fc('extend', 0.4), 1.4, 0.45, pan=px(1220))
card(fc('record', 0.8), 0.0036, px(960))
held((G2, D3, G3, B3), fc('cage', 0.2), 1.8, 0.62); held(DM2, fc('cage', 2.2), 2.0, 0.62)

# 9. Pull back: the Head of School asks again, a tap; Genie answers, 118, and the film resolves: D major, held, the felt piano's A. The
#    sketch's new version, a card. The story comes back: the Yellow Registers fell behind:
#    B minor, low, as the land comes in; the register laid down every ten years, a knock each; taxes paid every year, one soft texture
#    of grain, not a burst; they fell behind, and the music waits. The white registers, written each year: G major, and one flutter of pages as they're laid down; the yellow
#    ones a formality: F sharp minor, low. A model that doesn't fit: B minor as the room of the present comes back; side copies, a
#    sheet laid down for each; the end card: the film's mark
K = 'end'
nw_ = lambda lid, word, off=0: W(K, lid, word, off)
nc = lambda lid, off=0: G(K, lid, off)
tap(nc('asks', 0.0), 0.003, px(800))
held(DM2, nc('answer', 0.2), 3.0, 0.7); fp(A4, nc('answer', 0.3), 1.6, 0.45, pan=px(1500))
card(nc('version', 0.2), 0.0034, px(1660))
held((B2, Fs3, B3), nc('yellow', -0.6), 2.8, 0.65); air(nc('yellow', -0.8), 1.4, 0.0024, px(960))
knock(nw_('yellow', 'every ten years', -0.2), 0.0036, px(420), 170); knock(nw_('yellow', 'every ten years', 0.2), 0.0036, px(1500), 170)
grain(nw_('yellow', 'every year', -0.15), 1.6, 0.0028, px(960))
held(GM, nw_('white', 'white registers', 0.0), 2.6, 0.62); pages(nw_('white', 'white registers', 0.1), 1.6, 0.0028, px(960))
held(FSM, nw_('white', 'formality', -0.2), 2.4, 0.6)
held((B2, Fs3, D4), nc('side', -0.6), 2.2, 0.6); air(nc('side', -0.8), 1.2, 0.0024, px(960))
for i, x in enumerate((335, 1585, 335, 1585)):
    card(nw_('side', 'side copies', -0.3 + 0.25 * i), 0.0026, px(x))
tap(nw_('side', 'kept for show', -0.2), 0.0026, px(960))
mark(nc('tag', -0.4), last=3.2, g=0.85)
