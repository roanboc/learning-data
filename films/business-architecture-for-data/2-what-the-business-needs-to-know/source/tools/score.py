# What the business needs to know: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# Its palette (the topic's palettes.md, and decided.md): a clavichord and an oboe, two instruments the site already has but no film pairs,
# and no film of this topic plays, since nothing new fitted (the film's assumptions file says so, and why).
#  - The lead: a clavichord. A brass string struck by a brass tangent that stays on it while the key is held, so the tangent both sounds
#    the string and sets its length: a soft, close note, a little metallic, its first sound quick and its aftersound quieter, the
#    tangent's faint knock as it meets the string; and when the key is let go, the cloth damps the string at once. One string to a note,
#    every partial exactly in tune, and no Bebung: nothing trembles. Its small soundboard gives the bass little body, as a clavichord's
#    does. It spreads each chord from the bass up under the opening story and at a chapter's turn, and gives one note as a thing lands.
#  - Its partner: an oboe, low and soft (D 4 to A 5). Its reed's colour is in its middle partials, near 1.1 kHz; each note tongued
#    softly, held at one level, no vibrato and no ornaments, and gone when the breath stops. Plain notes in D major: every orchestra
#    tunes to the oboe's A, one note that means the same to every player, as a share in Mahan meant the same to everyone who held one.
#  - The film's own figure, played once: where a share has to mean the same to everyone, the oboe gives its A and the clavichord's A
#    answers it in unison.
#  - The series' mark: the three layers, the business layer between the other two: the clavichord plays D, then A, and the oboe holds
#    the F sharp between them. Under the title, and again under the end card.
#  - Its sounds: the desert's wind; the water in the channel, one soft texture; the fields' wooden gates and the water let in; the deeds'
#    paper slips; and at the utility, cards, paper, keys, a pen, and knocks and taps as things are set on the wall.
# Nothing Persian is borrowed for the story: no santur, tar, kamancheh, ney, daf or tombak, and no Persian mode; the story is told in
# the series' own voice. D major and its neighbours, tuned pure from D; B minor and F sharp minor where the story turns to a dispute,
# a lack or a loss, and for the concept nobody holds.
# The rules every film keeps (AGENTS.md; tools/quiet.py checks them):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; never a bed
#    under the voice; a figure never played again soon after itself; music and effects no louder than the governance films'.
#  - Nothing trembles or pulses: no vibrato, every note one voice, tuned pure. No urgent pulse: nothing in this film is a rush.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, and pans to where it's drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: the clavichord low-passed at 2.7 kHz, the oboe at 2.4 kHz, the effects below about 2.2 kHz and
# about 12 dB under the music.

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
R1 = np.random.default_rng(1202)  # this film's own randomness: the room, the tangent's knock, the reed's breath, the water, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major and
# B and F sharp minor are pure in this table. E is played only with A (against B it's the wolf fifth, against G a sixth a comma out),
# and no chord is held into the next: each is stopped as the next one is struck (until=)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.4162 * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2, Cs3, D3, E3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5 = \
    38, 42, 43, 45, 47, 49, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74

# ---- the levels: the clavichord and the oboe matched by loudness, as far under the voice as the series' other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter: the opening a
# little fuller, as music under a story is
LC, LO, FX = 0.125, 0.056, 2.1
LV = [1.0]

# a small room round the two, ringing on for under a second, as a clavichord is played close. Its level is set by what it rings where
# the notes are (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, as the video guidelines ask
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
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

# ---- the clavichord
def clav(m, s, hold=1.4, g=1.0, pan=None, until=None, room=0.2):
    """the clavichord: the tangent strikes the brass string and stays on it while the key is held (hold seconds), then the cloth damps
    it. Its partials are a struck string's, every one exactly in tune; the tangent at the string's end gives them their slightly
    metallic colour, and the small soundboard gives the bass little body. The first sound dies quickly into a quieter aftersound,
    the higher partials first. The tangent's faint knock at the start, the cloth's soft touch at the end. No Bebung"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(0.25, until - s - 0.3))
    sec = hold + 0.12; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    T1 = 2.4 * (73.4 / f0) ** 0.4
    sig = np.zeros(n)
    for k in range(1, 19):
        f = f0 * k
        if f > 2700:
            break
        a = (0.6 + 0.4 * np.cos(2 * np.pi * k * 0.118)) / k ** 0.85 * (1 - np.exp(-f / 330))
        tau = T1 / (1 + 0.3 * (k - 1))
        sig += a * (0.55 * np.exp(-x / min(0.11, tau)) + 0.45 * np.exp(-x / tau)) * np.sin(2 * np.pi * f * x + 0.37 * k)
    sig *= np.minimum(1, x / 0.0012) * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.03))
    sig /= max(1e-9, float(np.abs(sig).max()))
    m_ = int(0.035 * SR); xk = np.arange(m_) / SR
    kn = filt(_nz(0.035)[:m_], 'band', (600, 2200)) * np.exp(-xk / 0.005)
    sig[:m_] += 0.05 * kn / max(1e-9, float(np.abs(kn).max())) + 0.06 * np.sin(2 * np.pi * 120 * xk) * np.exp(-xk / 0.012)
    r = int(0.06 * SR); i0 = int(hold * SR)
    if i0 + r <= n:
        xr = np.arange(r) / SR; sig[i0:i0 + r] += 0.02 * filt(_nz(0.07)[:r], 'band', (150, 900)) * np.exp(-xr / 0.012)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2700), 'high', 55)), room, 0.25, max(0.5, min(hold, 1.2))), s, until)
    put(sig, s, g * LV[0] * LC, _pan(m) if pan is None else pan)
def cspread(notes, s, hold=2.4, g=1.0, step=0.12, until=None):
    """a chord spread on the clavichord from the bass up, its keys held together and let go together: a chapter's turn"""
    for i, m in enumerate(notes):
        clav(m, s + step * i, max(0.4, hold - step * i), g * (1.0 if i == 0 else 0.85), until=until)

# ---- the oboe
def oboe(m, s, hold=2.4, g=1.0, pan=None, until=None, rise=0.08, room=0.22):
    """the oboe: a note tongued softly, its higher partials speaking a moment after the lower, held at one level for hold seconds, no
    vibrato, then gone as the breath stops. Its reed's colour is in its middle partials, near 1.1 kHz; a little of the reed's breath
    sounds under the note"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(0.4, until - s - 0.3))
    sec = hold + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 12):
        f = f0 * k
        if f > 2500:
            break
        a = (0.22 + np.exp(-0.5 * (np.log(f / 1150) / 0.55) ** 2)) * k ** -0.35
        sig += a * np.sin(0.5 * np.pi * np.minimum(1, x / (rise * (1 + 0.18 * (k - 1))))) ** 2 * np.sin(2 * np.pi * f * x + 0.29 * k * k)
    sig *= np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.06))
    sig /= max(1e-9, float(np.abs(sig).max()))
    br = filt(_nz(sec)[:n], 'band', (900, 2200))
    sig += 0.012 * br / max(1e-9, float(np.abs(br).max())) * np.minimum(1, x / 0.05) * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.05))
    t_ = int(0.04 * SR); xt = np.arange(t_) / SR; tg = filt(_nz(0.04)[:t_], 'band', (700, 2000)) * np.sin(np.pi * np.minimum(1, xt / 0.04))
    sig[:t_] += 0.04 * tg / max(1e-9, float(np.abs(tg).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2400), 'high', 180)), room, 0.25, max(0.5, hold)), s, until)
    put(sig, s, g * LV[0] * LO, _pan(m) * 0.5 if pan is None else pan)
def mark(s, g=1.0, step=0.55, last=3.0, until=None):
    """the series' mark: the three layers, the business layer between the other two: the clavichord's D, then its A, then the oboe's
    F sharp between them, held"""
    clav(D4, s, 1.0, g * 0.9, until=until); clav(A4, s + step, 1.0, g * 0.85, until=until)
    oboe(Fs4, s + 2 * step, last, g, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
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
    """water running in the channel: one soft, even texture that swells in, never a burst of drops"""
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
def card(s, g=0.005, pan=0.0):
    """a card, a sheet or a slip laid down: a soft flap of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(_nz(0.17)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 155, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def knock(s, g=0.005, pan=0.0):
    """something set down on the glass or the wall: one soft, low knock"""
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
def air(s, sec=0.9, g=0.003, pan=0.0):
    """things moving across the frame together, or a hand going round: a breath of low air"""
    n = int(sec * SR); x = np.arange(n) / SR; _fx(filt(_nz(sec)[:n], 'band', (140, 900)) * _bump(x, sec), s, g, pan, 1000)

# =============================================================================================================================
# 1. A share of water: the opening, the film's story from outside data, with the clavichord under it and the oboe's few long notes
#    over it. The desert villages: D major, spread from the bass up, over the wind and the channel's water; a gate lifted and the
#    water let in for each field in turn. Shares of time: the oboe comes in on F sharp. Sold, split or left to your children: G, a tap
#    as a share splits, and a note as the child appears. Not the same everywhere: B minor, the oboe on D. Every six days, every
#    twenty-two: A major, and a line drawn for each row of days. The 1960s, the deeds: G, a knock for the year, the oboe on B as the
#    deeds are asked for, and a soft flap of paper as each slip lands. More than a day: B minor, and a low B alone as the last slip runs
#    past the day's end. The disputes: F sharp minor, the oboe on C sharp; the water stops as the fields dry, and a low F sharp is left.
#    A share had to mean the same to everyone: G, then the film's own figure, once: the oboe gives its A, and the clavichord's A
#    answers it in unison. In Mahan: D major, full, and the oboe's F sharp; a breath of air as the hand goes once round the day.
#    Each chord in the opening is held until the next is struck, and in the longer pauses between lines the clavichord answers with a
#    note of its chord, so the music runs under the whole story, even where the desert's wind isn't heard. Fifteen shares: G, a line
#    drawn as they are, and another as the twelve days come round. Exactly one day: A major, a tap for the 96 minutes, then D major and
#    the oboe's D, and a tick. Another qanat, three men, seventy families: G; the shares split bit by bit, a dry rub; a note for each
#    of the two. Sold, inherited, split: three rising notes; thirty seconds, a tap; still adding up: A, then D, and a tick. At the
#    utility: A major, the oboe on C sharp, a tap for each tag. In the pause, the water again as each share lights in turn; the title:
#    the mark
K = 'shares'
LV[0] = 1.15
kw = lambda lid, word, off=0: W(K, lid, word, off)
kc = lambda lid, off=0: G(K, lid, off)
tB = kc('breath'); END1 = E(K)
XG = [1554, 1724, 1894, 2064]                       # the fields' gates in the cut-away world (ba.js BA_VFIELDS, less 6)
sx = lambda wx, cx=1880, z=1.45: px(960 + (wx - cx) * z)  # a gate's place on screen while the camera is on the village
DAY = lambda i: px(490 + 295 * (i + 0.5))          # a share of the day's bar, in the panel (b2_daybar)
SLIP = [616, 847, 1036, 1204, 1351, 1456, 1540]     # each deed's slip along the day (b2_deeds)
T0 = [S0(K) + u for u in (1.2, 3.2, 5.2, 7.2)]      # each field's turn, as the picture lifts its gate
tSh, tSo, tSa, tTu, tDe, tAs = kw('edge', 'shares of time', -0.3), kw('sold', 'sold', -0.15), kw('same', "didn't", -0.15), kc('turns', -0.2), kc('deeds', -0.15), kw('deeds', 'asked', -0.2)
tAd, tOv, tFo, tBr, tNe, tMs, tEv = kc('added', -0.15), kw('added', 'twenty-four', -0.1), kc('fought', -0.15), kw('fought', 'broke apart', -0.2), kc('needed', -0.15), kw('needed', 'mean the same', -0.1), kw('needed', 'everyone', -0.05)
tMa, tFi, tAs2, tEx, tSe, tMe, tUp, tLi = kc('mahan', -0.3), kw('fifteen', 'fifteen shares', -0.25), kc('adds', -0.15), kw('adds', 'exactly one day', -0.2), kc('seventy', -0.2), kc('meant', -0.15), kw('meant', 'still add up', -0.25), kc('link', -0.2)
tWd = kw('deeds', 'written deeds', -0.1); tMt = kw('added', 'more than', -0.3)
le = lambda lid: kc(lid) + _DUR[K + '/' + lid]        # when a line ends: in the pause after it, the clavichord answers
# the clavichord's chords, each stopped as the next is struck, and the oboe's long notes over them
cspread((D2, A2, Fs3, A3, D4), S0(K) + 0.3, 9, 0.9, until=tSh)
clav(D3, tSh, 9, 0.55, until=tSo); clav(A3, tSh + 0.14, 9, 0.5, until=tSo); oboe(Fs4, tSh + 0.3, 2.4, 0.8, until=tSo)
cspread((G2, D3, G3, B3), tSo, 9, 0.85, until=tSa)
clav(D4, kw('sold', 'children', -0.25), 1.2, 0.55, pan=DAY(3), until=tSa)
cspread((B2, Fs3, B3, D4), tSa, 9, 0.8, until=tTu); oboe(D5, kw('same', 'mean', 0.0), 1.8, 0.7, until=tTu)
cspread((A2, E3, A3, Cs4), tTu, 9, 0.8, until=tDe)
clav(E4, kw('turns', 'On another', -0.2), 1.3, 0.55, pan=px(1290), until=tDe)
clav(Cs4, le('turns') + 0.15, 9, 0.45, pan=px(1290), until=tDe)
cspread((G2, B2, D3, G3), tDe, 9, 0.8, until=tAs)
oboe(B4, tAs, 2.8, 0.7, until=tAd)
cspread((B2, D3, Fs3, B3), tAd, 9, 0.8, until=tOv)
clav(B2, tOv, 9, 0.9, pan=px(1560), until=tFo)
cspread((Fs2, Cs3, Fs3, A3), tFo, 9, 0.8, until=tBr); oboe(Cs5, kw('fought', 'fought', -0.1), 2.4, 0.7, until=tBr)
clav(Fs2, tBr, 9, 0.9, until=tNe)
cspread((G2, D3, B3), tNe, 9, 0.75, until=tMs)
oboe(A4, tMs, 2.8, 0.85, until=tMa); clav(A4, tEv, 2.0, 0.8, pan=0.0, until=tMa)
cspread((D2, A2, Fs3, A3, D4, Fs4), tMa, 9, 0.85, until=tFi)
oboe(Fs4, kw('mahan', 'every share', -0.1), 3.2, 0.6, until=tFi)
cspread((G2, D3, G3, B3, D4), tFi, 9, 0.8, until=tAs2)
clav(D4, le('fifteen') + 0.15, 9, 0.5, pan=px(1480), until=tAs2)
cspread((A2, Cs3, E3, A3), tAs2, 9, 0.75, until=tEx)
cspread((D3, Fs3, A3, D4), tEx, 9, 0.8, until=tSe); oboe(D5, tEx + 0.25, 3.4, 0.7, until=tSe)
clav(A3, le('adds') + 0.15, 9, 0.5, until=tSe); clav(D4, le('adds') + 0.27, 9, 0.45, until=tSe)
cspread((G2, B2, G3, D4), tSe, 9, 0.75, until=kw('seventy', 'bit by bit', -0.2))
clav(B3, kw('seventy', 'bit by bit', -0.2), 1.4, 0.6, pan=px(1240), until=tMe)
clav(D4, kw('seventy', 'seventy families', -0.2), 9, 0.6, pan=px(1680), until=tMe)
clav(B3, le('seventy') + 0.15, 9, 0.5, pan=px(1240), until=tMe)
cspread((D2, A2, D3, Fs3, A3), tMe, 9, 0.75, until=kw('meant', 'sold', -0.2))
for word, m in (('sold', D4), ('inherited', Fs4), ('split', A4)):
    clav(m, kw('meant', word, -0.2), 9, 0.6, pan=px(1640), until=tUp)
clav(A3, tUp, 0.8, 0.6, pan=px(1240), until=tLi); clav(D4, tUp + 0.4, 9, 0.65, pan=px(1240), until=tLi)
cspread((A2, E3, A3, Cs4), tLi, 9, 0.75, until=tB)
oboe(Cs5, kw('link', 'defined once', -0.1), 3.0, 0.65, until=tB)
clav(E4, le('link') + 0.15, 9, 0.45, until=tB)
mark(tB + 0.8, 0.85, last=END1 - tB - 2.2, until=END1 - 0.1)
# the desert village: its wind, the channel's water, each field's gate lifted in its turn and the water let in
wind(S0(K), tMa + 1.2 - S0(K), 0.006, 0.0)
water(S0(K) + 0.5, tBr + 1.4 - (S0(K) + 0.5), 0.0045, sx(2230))
for i, t0 in enumerate(T0):
    gate(t0, 0.005, sx(XG[i])); pour(t0 + 0.2, 0.0038, sx(XG[i]), 1.2)
tap(kw('sold', 'split', -0.1), 0.0035, DAY(2))
# the 1960s and the deeds: the year, each slip landing on the day, the last two past its end
knock(tDe + 0.05, 0.004, px(300))
for i in range(5):
    card(tWd + 0.5 * i + 0.25, 0.0042, px(SLIP[i]))
for i in range(2):
    card(tMt + 0.5 * i + 0.25, 0.0042, px(SLIP[5 + i]))
# the turns of the water: a line drawn as each row of days fills
slide(kw('turns', 'every six', -0.3), 1.0, 0.003, px(1290)); slide(kw('turns', 'every twenty-two', -0.3), 1.4, 0.003, px(1290))
# in Mahan: the hand round the day, the fifteen shares, the twelve days, the 96 minutes and the day that adds up
air(kw('mahan', 'measured', -0.1), 2.2, 0.0035, px(640))
slide(tFi + 0.05, 1.6, 0.003, px(640)); slide(kw('fifteen', 'every twelve', -0.1), 1.4, 0.0025, px(1480))
tap(kw('adds', 'ninety-six', -0.2), 0.0035, px(1350))
ticked(tEx + 0.4, 0.004, px(1710))
# the other qanat: the first day moves aside, the second splits bit by bit, as fine as thirty seconds, and still adds up
air(tSe, 1.4, 0.003, px(520))
slide(kw('seventy', 'bit by bit', -0.2), 2.6, 0.003, px(1240))
tap(kw('meant', 'thirty seconds', -0.2), 0.0035, px(1560))
ticked(tUp + 0.65, 0.004, px(1490))
# at the utility, its two tags; in the pause, the water as each share lights in turn
tap(tLi, 0.0035, px(960)); tap(kw('link', 'each thing', -0.2), 0.0035, px(960))
water(tB - 0.3, END1 - tB + 0.2, 0.003, px(640))

# 2. Tomás's next note: the chapter turns on G major as the note comes in. The note slid aside; the eight capabilities dealt along the
#    top, a breath of air, and a tap as the strategy layer is named. Each one needs, creates or changes something: a line drawn down to
#    each outline, a pen's stroke, and a note as each lands, rising: D, F sharp, A. The information layer: a tap
K = 'note'
LV[0] = 1.0
nw_ = lambda lid, word, off=0: W(K, lid, word, off)
nc = lambda lid, off=0: G(K, lid, off)
cspread((G2, D3, G3, B3), S0(K) + 0.3, 2.4, 0.8)
slide(nc('caps', -0.4), 1.2, 0.003, px(1180))
tap(nw_('caps', 'capabilities', -0.2), 0.0035, px(130))
air(nw_('caps', 'eight things', -0.5), 1.2, 0.003, px(960))
for word, m, x in (('needs', D4, 382), ('creates', Fs4, 846), ('changes', A4, 1542)):
    pen(nw_('each', word, -0.2), 0.4, 0.0035, px(x), 1); clav(m, nw_('each', word, -0.1), 1.2, 0.6, pan=px(x))
tap(nw_('concepts', 'information layer', -0.3), 0.0035, px(130))

# 3. Never a blank page: the blank page set aside, a dry rub of paper. The industry's reference models: the chapter turns on D major as
#    their four places come in. The IEC's card, a knock; CIM's boxes, a breath of air, and the lines between them drawn. The IEC's
#    list of what a utility does: G major as its eight parts come in, and its objects beneath them. ArchiMate's glyphs: a tap. The Smart
#    Grid Architecture Model's planes, from the bottom up: a note for each, rising through D major; the power station to the home, a
#    line drawn. The market's roles: a knock; its metering point, a tap. Other industries: a breath of air. Back on the wall, the first
#    draft: A major as CIM's notes come in, a tap as each element says where it came from, and a knock as every one is marked a draft
K = 'blank'
bw_ = lambda lid, word, off=0: W(K, lid, word, off)
bc = lambda lid, off=0: G(K, lid, off)
slide(bw_('blank', 'blank page', 0.1), 1.2, 0.0035, px(470))
cspread((D3, A3, D4, Fs4), bc('models', 0.0), 2.6, 0.8)
knock(bw_('iec', 'Common Information', -0.3), 0.0045, px(270))
air(bw_('cim', 'cables', -0.3), 1.6, 0.003, px(790)); slide(bw_('cim', 'how they relate', -0.3), 1.0, 0.003, px(790))
air(bw_('irm', 'what a distribution', -0.3), 1.0, 0.003, px(960))
cspread((G2, B2, D3, G3), bw_('irm', 'what a distribution', -0.2), 2.6, 0.75)
tap(bw_('arch', 'ArchiMate', -0.3), 0.0035, px(1580))
for j, m in enumerate((D3, Fs3, A3, D4, Fs4)):
    clav(m, bc('sgam', -0.1 + 0.28 * j), 1.6 - 0.2 * j, 0.6, pan=px(760))
slide(bw_('sgam', 'from the power station', -0.1), 1.4, 0.003, px(760))
knock(bw_('roles', 'who does what', -0.3), 0.0045, px(960)); tap(bw_('roles', 'electricity market', -0.2), 0.0035, px(960))
air(bc('others', 0.2), 1.2, 0.003, px(960))
slide(bw_('first', 'first draft', -0.3), 0.9, 0.003, px(960))
cspread((A2, E3, A3, Cs4), bw_('first', 'first draft', -0.3), 2.6, 0.75)
tap(bw_('first', 'where each element', -0.2), 0.0035, px(960))
knock(bw_('draft', "isn't", -0.2), 0.004, px(700))

# 4. What each capability needs: the picture carries on from the wall, so no chord. The people who run each one, a tap. Connecting
#    customers lights: a note, A; its two new concepts each a card as it's stuck up. Serving customers: D, and its two new concepts.
#    Operating the network: F sharp. Created or only read: the legend's two lines drawn, a pen. Most from CIM: a tap
K = 'needs'
dw_ = lambda lid, word, off=0: W(K, lid, word, off)
dc = lambda lid, off=0: G(K, lid, off)
tap(dw_('through', 'people who run', -0.2), 0.0035, px(960))
clav(A3, dc('connect', -0.2), 1.6, 0.6, pan=px(846))
card(dw_('connect', 'connection request', 0.0), 0.004, px(730)); card(dw_('connect', 'capacity', 0.0), 0.004, px(990))
clav(D4, dc('serve', -0.2), 1.6, 0.6, pan=px(1542))
card(dw_('serve', 'bills', 0.0), 0.004, px(1620)); card(dw_('serve', 'complaints', 0.0), 0.004, px(1620))
clav(Fs4, dc('operate', -0.2), 1.6, 0.6, pan=px(382))
pen(dw_('creates', 'creates', -0.2), 0.5, 0.0035, px(1200), 2)
tap(dw_('most', 'CIM already', -0.2), 0.0035, px(1290))

# 5. In the business's words: the picture carries on, and the connection point is lifted off the wall, a breath of air. CIM's words
#    aren't the utility's: F sharp minor. The two reference models' names, a knock each. Grace's people: a tap, and their three sheets,
#    a soft flap each. On the map: it turns to glass, a breath of air, and the reference models' names kept beside it, a tap. As in
#    Mahan: the oboe's D, and the channel's water once more, softly. One definition, written: a pen; its domain, a tap. Back on the
#    wall, the domains drawn: a note for the network's, D, and for retail's, A. The shared word: a card; its owners, a tap; and D major
#    as each word's owner is easy to find
K = 'words'
ww = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: G(K, lid, off)
air(wc('but', 0.2), 1.2, 0.003, px(850))
cspread((Fs2, Cs3, Fs3, A3), ww('but', "aren't", -0.15), 2.6, 0.75)
knock(ww('usage', 'usage point', -0.2), 0.0045, px(340)); knock(ww('usage', 'metering point', -0.2), 0.0045, px(1580))
tap(wc('grace', -0.2), 0.0035, px(960))
for word, x in (('forms', 500), ('reports', 960), ('customers', 1420)):
    card(ww('grace', word, -0.2), 0.004, px(x))
air(ww('map', 'the map uses', -0.2), 0.9, 0.0025, px(960)); tap(ww('map', 'keeps the reference', -0.2), 0.0035, px(960))
oboe(D5, ww('mahan', 'measure', -0.2), 2.4, 0.65)
water(wc('mahan', -0.2), 3.8, 0.0025, px(630))
pen(ww('one', 'one definition', -0.2), 0.6, 0.0035, px(800), 2); tap(ww('one', 'in its domain', -0.2), 0.0035, px(760))
slide(wc('domains', -0.4), 1.2, 0.003, px(845))
clav(D4, ww('domains', "The network's", -0.2), 1.6, 0.6, pan=px(660)); clav(A3, ww('domains', "retail's", -0.2), 1.6, 0.6, pan=px(1620))
card(ww('shared', 'location', -0.2), 0.004, px(1290)); tap(ww('shared', 'owner', -0.2), 0.0035, px(960))
cspread((D3, Fs3, A3, D4), ww('shared', 'easy to find', -0.2), 2.4, 0.7, until=E(K) + 0.4)

# 6. A concept nobody holds: the picture carries on, and the capability that hurts turns red: B minor. Thirty-four working days: a
#    knock. The street: a light wind as the solar comes on. How much solar can each street take?: the oboe's B, a question. No system, no
#    report, no owner: a knock each. Grace's engineers' word: its card laid down, and G major. The voltage rising: a breath of air; its
#    limit drawn, a tap. Back on the wall, the concept lifted: air; its owner, a tap; no data yet, a knock; the data team later, a tap.
#    In the pause, as the card goes back on the map: B minor again, softer and higher, and the card slid back
K = 'missing'
mw = lambda lid, word, off=0: W(K, lid, word, off)
mc = lambda lid, off=0: G(K, lid, off)
cspread((B2, Fs3, B3, D4), mw('hurts', 'hurts', -0.2), 2.6, 0.75)
knock(mw('hurts', 'thirty-four', -0.2), 0.0045, px(846))
tSt, tBk = mc('wait', -0.8), mc('owner', -0.8)
wind(tSt, tBk + 1.2 - tSt, 0.004, 0.0)
oboe(B4, mw('wait', 'how much solar', -0.1), 2.4, 0.65)
for word, x in (('No system', 520), ('no report', 960), ('nobody owns', 1400)):
    knock(mw('nobody', word, -0.1), 0.0045, px(x))
card(mw('name', 'hosting capacity', -0.2), 0.0045, px(560))
cspread((G2, D3, G3, B3), mw('name', 'hosting capacity', -0.1), 2.6, 0.7)
air(mw('name', 'the solar', -0.2), 2.4, 0.003, px(960)); tap(mw('name', 'limits', -0.4), 0.0035, px(1830))
air(mw('owner', 'on the map', -0.3), 1.2, 0.003, px(970))
tap(mw('owner', 'Grace', -0.2), 0.0035, px(700)); knock(mw('owner', 'no data', -0.2), 0.004, px(1000))
tap(mw('first', 'build it later', -0.3), 0.0035, px(1300))
tPz = mc('breath')
cspread((B2, D3, Fs3, B3), tPz + 0.1, 2.0, 0.65, until=E(K) + 0.5)
slide(tPz + 0.2, 1.2, 0.003, px(990))

# 7. A glossary from the map: the chapter turns on D major as the business object comes in, a card. Its four parts, a tap each as each
#    is named. It's carried into its row, a dry rub, and the glossary drawn round it, a breath of air. A table is enough: a tap. Every
#    term has an owner: its owners' column written, a pen, and the oboe's F sharp. Later, what the data team builds points to its
#    terms: a knock for each chip, and its arrow drawn
K = 'glossary'
gw = lambda lid, word, off=0: W(K, lid, word, off)
gc = lambda lid, off=0: G(K, lid, off)
cspread((D3, A3, D4, Fs4), S0(K) + 0.3, 2.4, 0.75)
card(S0(K) + 0.9, 0.0045, px(960))
for word in ('a name', 'a definition', 'a domain', 'an owner'):
    tap(gw('object', word, -0.2), 0.003, px(500))
slide(gc('drawn', -0.1), 1.1, 0.003, px(700)); air(gc('drawn', 0.4), 1.3, 0.0025, px(960))
tap(gw('tool', 'A table is enough', -0.2), 0.0035, px(960))
pen(gw('tool', 'every term has an owner', -0.3), 0.6, 0.0035, px(1500), 2)
oboe(Fs4, gw('tool', 'every term has an owner', 0.0), 2.2, 0.65)
for word, x, ex in (('each table', 260, 210), ('report', 1660, 1710)):
    knock(gw('point', word, -0.2), 0.004, px(x)); slide(gw('point', word, 0.0), 0.7, 0.0025, px((x + ex) / 2))

# 8. The data practice on the map: the glossary leaves first, and the chapter turns on G major, high, as the map comes in. The
#    glossary's domains, a tap; the three domains drawn, a knock each; each new object as it joins its domain, a knock. Each sits in
#    its domain with its owner: the owners' tags, a tap, and no chord, so the village's D major comes in fresh
K = 'practice'
qw = lambda lid, word, off=0: W(K, lid, word, off)
qc = lambda lid, off=0: G(K, lid, off)
cspread((G3, B3, D4, G4), S0(K) + 0.7, 2.4, 0.7)
tap(qw('domains', "glossary's domains", -0.2), 0.0035, px(1245))
for word, x in (('the network', 1245), ('retail', 1635), ('what they share', 1635)):
    knock(qw('domains', word, -0.3), 0.004, px(x))
for word, x in (('Meter readings', 1245), ('hosting capacity', 1245), ('bills', 1635), ('Location', 1635)):
    knock(qw('join', word, -0.3), 0.004, px(x))
tap(qw('already', 'its owner', -0.3), 0.0035, px(1440))

# 9. One meaning, everywhere: back to Mahan's village, D major as at the film's start, with the wind and the channel's water; the day
#    adding up, a tick; the oboe's F sharp, the same to everyone; and one field's gate lifted, the water let in. At the utility: G major
#    as the wall comes back; the owners' tags, a tap. Tomás's next note goes up, paper, and its question on the clavichord: B, then A.
#    Under the end card, without words, the mark, its F sharp held to the end
K = 'end'
ew = lambda lid, word, off=0: W(K, lid, word, off)
ec = lambda lid, off=0: G(K, lid, off)
tU, tN, tB9 = ec('utility'), ec('next'), ec('breath')
tS9 = ew('village', 'shared', -0.4)
wind(S0(K), tU - S0(K), 0.005, 0.0); water(S0(K) + 0.3, tU - 0.4 - S0(K), 0.0035, px(1500))
cspread((D2, A2, Fs3, A3, D4), S0(K) + 0.4, 3.0, 0.75)
oboe(Fs4, ew('village', 'the same', -0.2), 2.2, 0.65, until=tU - 0.6)
ticked(ew('village', 'counted', 0.1), 0.004, px(930))
gate(tS9 + 0.1, 0.0045, px(670)); pour(tS9 + 0.3, 0.0035, px(670), 1.2)
cspread((G2, D3, B3), tU - 0.2, 2.2, 0.7)
tap(ew('utility', 'in its domain', -0.2), 0.0035, px(960))
card(tN - 0.2, 0.0045, px(860))
clav(B3, ew('next', 'who creates', -0.1), 0.9, 0.6, pan=px(860)); clav(A3, ew('next', 'who creates', 0.35), 1.4, 0.6, pan=px(860))
mark(tB9 + 1.1, 0.85, step=0.6, last=E(K) - tB9 - 3.0, until=E(K))
