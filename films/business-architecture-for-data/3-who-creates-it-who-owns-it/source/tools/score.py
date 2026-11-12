# Who creates it, who owns it: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# Its palette (the topic's palettes.md, and decided.md): an English concertina and a clarinet, two instruments the site already has but no
# film pairs, and no film of this topic plays, since nothing new fitted (the film's assumptions file says so, and why).
#  - The lead: an English concertina, Wheatstone's free-reed instrument of 1829, in its baritone size. A button for each note and one
#    steel reed to a note, sounding the same whichever way the bellows move: a note speaks a moment after its button opens, its
#    higher partials a little after its lower, holds level while the button is down, and stops a moment after it's let go, with the
#    pad's soft touch as it opens. One reed to a note, so nothing beats or trembles: no tremolo, and no swell from the bellows. Its
#    reed chambers give it a soft brightness near 1.3 kHz. The notes of its scale alternate between its two ends, so a line passes
#    from one hand to the other, each note heard from the side that holds it, as a share passes from hand to hand and is always held
#    by someone named. It presses chords from the bass up under the opening story and at a chapter's turn, and gives one note as a
#    thing lands.
#  - Its partner: a clarinet, low and soft, in its chalumeau register (D 3 to A 4): the bore's odd partials, each note tongued softly
#    and held at one level, no vibrato and no slides, gone when the breath stops. The steady line under the concertina, as the mirab
#    keeps the turns for the owners: it comes in with the mirab, and with each steward after him.
#  - The film's own figure, played once: where two capabilities both create the account, both instruments take the same D; when the
#    business decides, the clarinet steps down to B and holds it, reading, while the concertina keeps the D.
#  - The series' mark: the three layers, the business layer between the other two: the concertina presses D, then A, and the clarinet
#    holds the F sharp between them. Under the title, and again under the end card.
#  - Its sounds: the desert's wind; the water in the channel, one soft texture; the tunnel's roof falling in, a low fall of earth; the
#    fields' wooden gates and the water let in; the owners' votes; the record's pen; and at the utility, cards, paper, keys, a pen,
#    and knocks and taps as things are set on the wall.
# Nothing Persian is borrowed for the story: no santur, tar, kamancheh, ney, daf or tombak, and no Persian mode; the story is told in the
# series' own voice. D major and its neighbours, tuned pure from D; B minor where the story turns to a loss or a lack (a turn missed,
# the account created twice, the table nobody owns).
# The rules every film keeps (AGENTS.md; tools/quiet.py checks them):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; never a bed
#    under the voice; a figure never played again soon after itself; music and effects no louder than the governance films'.
#  - Nothing trembles or pulses: no vibrato, no tremolo, every note one reed or one bore, tuned pure. No urgent pulse: nothing in this
#    film is a rush.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, and pans to where it's drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: the concertina low-passed at 2.4 kHz, the clarinet at 2.2 kHz, the effects below about 2.2 kHz
# and about 12 dB under the music.

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
R1 = np.random.default_rng(1303)  # this film's own randomness: the room, the reeds' air, the clarinet's breath, the water, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major and
# B minor are pure in this table. E is played only with A (against B it's the wolf fifth, against G a sixth a comma out), and no chord
# is held into the next: each is let go as the next one is pressed (until=)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.4162 * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2, Cs3, D3, E3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5 = \
    38, 42, 43, 45, 47, 49, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74

# ---- the levels: the concertina and the clarinet matched by loudness, as far under the voice as the series' other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter: the opening a
# little fuller, as music under a story is
LC, LK, FX = 0.05, 0.05, 2.1
LV = [1.0]

# a small room round the two, ringing on for under a second, as a concertina and a clarinet sound in a small room. Its level is set by
# what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, as the
# video guidelines ask
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
def _nz(sec):
    return R1.standard_normal(max(1, int(sec * SR))).astype(np.float32)

# ---- the English concertina
# the scale alternates between the two ends: of the natural notes C to B, C, E, G and B are on the left and D, F and A on the right, each
# sharp with its own letter; so a line moves from one hand to the other, and each note is heard from the side that holds it
_SIDE = {0: -1, 1: -1, 2: 1, 3: 1, 4: -1, 5: 1, 6: 1, 7: -1, 8: -1, 9: 1, 10: 1, 11: -1}
_cpan = lambda m: 0.22 * _SIDE[m % 12]
def ctina(m, s, hold=1.4, g=1.0, pan=None, until=None, room=0.2):
    """the concertina: the button opens a pad over one steel reed, which speaks a moment later, its higher partials a little after its
    lower, and holds level while the button is down (hold seconds); let go, the pad closes and the reed stops in a moment. Its partials
    are a free reed's, all of them there, falling gently and lifted a little near 1.3 kHz by the reed's chamber; a faint breath of air
    through the reed under the note, and the pad's soft touch as it opens. One reed to a note: nothing beats, nothing trembles"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(0.3, until - s - 0.3))
    sec = hold + 0.15; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 30):
        f = f0 * k
        if f > 2400:
            break
        a = k ** -0.8 * (0.55 + 0.6 * np.exp(-0.5 * (np.log(f / 1300) / 0.5) ** 2)) * (1 - np.exp(-f / 160))
        r = 0.022 * (1 + 0.1 * (k - 1))
        sig += a * np.sin(0.5 * np.pi * np.minimum(1, x / r)) ** 2 * np.sin(2 * np.pi * f * x + 0.41 * k * k)
    sig *= np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.035))
    sig /= max(1e-9, float(np.abs(sig).max()))
    br = filt(_nz(sec)[:n], 'band', (700, 2000))
    sig += 0.008 * br / max(1e-9, float(np.abs(br).max())) * np.minimum(1, x / 0.03) * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.03))
    p_ = int(0.03 * SR); xp = np.arange(p_) / SR
    sig[:p_] += 0.035 * np.sin(2 * np.pi * 95 * xp) * np.exp(-xp / 0.008)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2400), 'high', 70)), room, 0.2, max(0.5, min(hold, 1.6))), s, until)
    put(sig, s, g * LV[0] * LC, _cpan(m) if pan is None else pan)
def cpress(notes, s, hold=2.4, g=1.0, step=0.1, until=None):
    """a chord pressed on the concertina from the bass up, its buttons held together and let go together: a chapter's turn"""
    for i, m in enumerate(notes):
        ctina(m, s + step * i, max(0.4, hold - step * i), g * (0.8 if i == 0 else 0.62), until=until)

# ---- the clarinet
def clar(m, s, hold=2.4, g=1.0, pan=None, until=None, rise=0.07, room=0.22):
    """the clarinet, low in its chalumeau register: a note tongued softly, its higher partials speaking a moment after the lower, held at
    one level for hold seconds, no vibrato, then gone as the breath stops. A closed cylinder: its odd partials strong and its even ones
    faint up to about 1.5 kHz, where the tone holes let the rest go; a little of the breath sounds under the note"""
    f0 = hz(m)
    if until is not None:
        hold = min(hold, max(0.4, until - s - 0.3))
    sec = hold + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 16):
        f = f0 * k
        if f > 2200:
            break
        a = (1.0 if k % 2 else 0.12) * k ** -0.9 * (1.0 if f < 1500 else np.exp(-(f - 1500) / 450))
        sig += a * np.sin(0.5 * np.pi * np.minimum(1, x / (rise * (1 + 0.15 * (k - 1))))) ** 2 * np.sin(2 * np.pi * f * x + 0.23 * k * k)
    sig *= np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.07))
    sig /= max(1e-9, float(np.abs(sig).max()))
    br = filt(_nz(sec)[:n], 'band', (800, 2000))
    sig += 0.01 * br / max(1e-9, float(np.abs(br).max())) * np.minimum(1, x / 0.06) * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.06))
    t_ = int(0.035 * SR); xt = np.arange(t_) / SR; tg = filt(_nz(0.035)[:t_], 'band', (500, 1600)) * np.sin(np.pi * np.minimum(1, xt / 0.035))
    sig[:t_] += 0.03 * tg / max(1e-9, float(np.abs(tg).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 120)), room, 0.25, max(0.5, hold)), s, until)
    put(sig, s, g * LV[0] * LK, 0.08 if pan is None else pan)
def mark(s, g=1.0, step=0.55, last=3.0, until=None):
    """the series' mark: the three layers, the business layer between the other two: the concertina's D, then its A, then the clarinet's
    F sharp between them, held"""
    ctina(D4, s, 1.0, g * 0.75, until=until); ctina(A4, s + step, 1.0, g * 0.7, until=until)
    clar(Fs4, s + 2 * step, last, g * 0.9, until=until)

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
def fall(s, g=0.005, pan=0.0, sec=1.6):
    """the tunnel's roof falling in, under the ground: one low, dull thud, and the earth settling after it, then quiet"""
    n = int(sec * SR); x = np.arange(n) / SR
    th = _knock(n, 62, 0.11) + 0.5 * _knock(n, 94, 0.07, 0.04)
    gr = filt(_nz(sec)[:n], 'band', (80, 520)) * np.exp(-x / 0.45) * np.minimum(1, x / 0.02)
    _fx(th + 0.45 * gr / max(1e-9, float(np.abs(gr).max())), s, g, pan, 700)
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
def dig(s, g=0.004, pan=0.0):
    """a pick into the tunnel's earth, once: a dull, low knock and a little earth falling from it"""
    n = int(0.5 * SR); x = np.arange(n) / SR
    gr = filt(_nz(0.5)[:n], 'band', (120, 700)) * np.exp(-(x - 0.03) / 0.12) * (x > 0.03)
    _fx(_knock(n, 120, 0.035) + 0.35 * gr / max(1e-9, float(np.abs(gr).max())), s, g, pan, 900)

# =============================================================================================================================
# 1. Owners, and a water master: the opening, the film's story from outside data, with the concertina under it and the clarinet's long
#    notes over it once the mirab comes. The desert from above: D major, pressed from the bass up, over the wind; the chain of shafts
#    lit, a breath of air, and the water reaching the village. Six shares of time: the dial drawn round, and each share lit in its turn
#    with a note, rising through D major, each from the hand that holds it. Three men: A. The shrine keeper's share: F sharp. Sold, left
#    to children, split: G major, a note as each tag lands, and a dry rub as the shares split finer. Hundreds of owners: A major, a knock
#    as each count lands. The village: D major again, the wind and the channel's water; each field's gate lifted in its turn and the
#    water let in; the turn missed: B minor. The repairs: the tunnel's roof falls in and the water stops; who decides, who pays: E, a
#    question. Decide together: G major as the camera draws back over the whole qanat. The owners meet: a tap as each votes; the repairs
#    agreed: D major, a tick, and the water back. The mirab: the clarinet comes in, low, on A, and holds; a gate lifted and the water let
#    in at each field in turn. His helpers: a dry scrape of the channel. The mirab looked after the water: the clarinet's F sharp; its
#    owners decided: the concertina's D major. The record: G major, a pen as each owner is written, and three notes for the first three
#    men. Generations later: a knock for the years; the keeper's share grows to a third, a breath of air, and splits among twenty,
#    a dry rub; some seventy families, another; every share a named owner: B minor turning to D major as the hand goes round and marks
#    each. At the utility: A major, a tap for each tag. In the pause, the water again; the title: the mark
K = 'owners'
LV[0] = 1.15
kw = lambda lid, word, off=0: W(K, lid, word, off)
kc = lambda lid, off=0: G(K, lid, off)
tB = kc('breath'); END1 = E(K)
XG = [1554, 1724, 1894, 2064]                       # the fields' gates in the cut-away world (ba.js BA_VFIELDS, less 6)
sx = lambda wx, cx=1880, z=2.2: px(960 + (wx - cx) * z)  # a gate's place on screen while the camera is on the village
tSix, tSh, tEa, tMen = kc('six', -0.2), kw('six', 'six shares of time', -0.2), kw('six', 'each a turn', -0.1), kw('six', 'three men', -0.3)
tOne, tKe, tSo, tS2, tS3 = kw('shrine', 'One of the six', -0.1), kw('shrine', 'keeper', -0.3), kw('sold', 'sold', -0.2), kw('sold', 'left to children', -0.2), kw('sold', 'split again and again', -0.2)
tH1, tH2, tTu, tF0, tLose = kw('hundreds', 'two or three hundred owners', -0.3), kw('hundreds', 'ten thousand shares', -0.3), kc('turn', -0.3), kw('turn', 'right field', -0.4), kw('turn', 'lose its crop', -0.2)
tCave, tWho, tNe, tTog, tLook = kw('repairs', 'repairs', -0.2), kw('repairs', 'decide on', -0.2), kc('needed', -0.4), kw('needed', 'decide together', -0.2), kw('needed', 'look after the water', -0.2)
tMe, tVote, tFix = kc('met', -0.3), kw('met', 'voting', -0.2), kw('met', 'size of their shares', 0.4)
tMi, tWm, tGuide, tHe, tClean = kc('mirab', -0.2), kw('mirab', 'water master', -0.2), kw('mirab', 'each field in its turn', -0.3), kc('helpers', -0.2), kw('helpers', 'channels clean', -0.2)
tDe, tLook2, tDec = kc('decided', -0.2), kw('decided', 'looked after the water', -0.2), kw('decided', 'owners decided', -0.2)
tRc, tCh, tFi = kc('record', -0.3), kw('record', 'every change of owner', -0.2), kw('record', 'first three men', -0.2)
tCe, tTd, tDs, tSv, tNm = kw('third', 'Generations later', -0.2), kw('third', 'a third', -0.4), kw('third', 'twenty of his descendants', -0.2), kw('seventy', 'seventy families', -0.2), kw('seventy', 'named owner', -0.5)
tLi, tOw, tLk = kc('link', -0.2), kw('link', 'an owner who decides', -0.2), kw('link', 'someone to look after it', -0.2)
le = lambda lid: kc(lid) + _DUR[K + '/' + lid]        # when a line ends: in the pause after it, the concertina answers
# from above: the new qanat, its shafts lit, the water reaching the village
cpress((D2, A2, Fs3, A3, D4), S0(K) + 0.3, 4.2, 0.85, until=tSix)
wind(S0(K), tTu + 1.0 - S0(K), 0.0055, 0.0)
air(kw('edge', 'was dug', -0.2), 2.2, 0.003, px(700))
water(kw('edge', 'bringing water', -0.2), 3.6, 0.0035, px(1100))
ctina(A3, le('edge') + 0.1, 1.6, 0.5, until=tSix)
# the turn of the water: six shares drawn round, each lit in its turn from the hand that holds it; three men; the keeper's share
air(tSh, 1.4, 0.003, px(640))
for i, m in enumerate((D4, E4, Fs4, G4, A4, B4)):
    ctina(m, tEa + 0.42 * i, 0.42, 0.55, until=tSo)
ctina(A3, tMen + 0.1, 1.6, 0.5, pan=px(1290), until=tSo); ctina(D4, tMen + 0.25, 1.45, 0.45, pan=px(1290), until=tSo)
ctina(Fs4, tOne + 0.1, 2.2, 0.55, pan=px(760), until=tSo)
# sold, left to children, split again and again: each tag, and the shares split finer
cpress((G2, D3, G3, B3), tSo, 3.0, 0.75, until=tH1)
ctina(D4, tS2 + 0.1, 1.0, 0.45, pan=px(1220), until=tH1); ctina(B3, tS3 + 0.1, 1.2, 0.45, pan=px(1220), until=tH1)
slide(tS3 + 0.2, 1.4, 0.003, px(640))
# on many qanats: hundreds of owners, thousands of shares
cpress((A2, E3, A3, Cs4), tH1, 3.2, 0.72, until=tTu)
knock(tH1 + 0.15, 0.004, px(1440)); knock(tH2 + 0.15, 0.004, px(1440))
# the village: each field's water in its turn, the third missed
cpress((D2, A2, D3, Fs3, A3), tTu + 0.2, 3.6, 0.75, until=tLose)
water(tTu, tCave + 0.6 - tTu, 0.0042, sx(2230))
for i, u in ((0, 0.0), (1, 1.3), (3, 2.6)):
    gate(tF0 + u, 0.0045, sx(XG[i])); pour(tF0 + u + 0.2, 0.0035, sx(XG[i]), 1.1)
cpress((B2, Fs3, B3, D4), tLose, 3.4, 0.72, until=tCave)
# the repairs: the tunnel's roof falls in, the water below it drains away; who decides, who pays
fall(tCave, 0.0055, px(960))
ctina(E4, tWho + 0.1, 1.8, 0.5, until=tNe)
# the whole qanat: decide together, and someone to look after the water
air(tNe + 0.1, 1.6, 0.003, px(960))
cpress((G2, D3, G3, B3), tTog, 3.0, 0.72, until=tMe)
# the owners meet and vote by shares; the repairs agreed and paid for, and the water back
for i in range(4):
    tap(tVote + 0.4 * i + 0.1, 0.0035, px(490 + 1180 * (sum((0.36, 0.27, 0.22, 0.15)[:i]) + (0.36, 0.27, 0.22, 0.15)[i] / 2)))
cpress((D3, Fs3, A3, D4), tFix - 0.3, 2.6, 0.72, until=tMi)
ticked(tFix, 0.004, px(1070))
water(tFix + 0.6, tDe + 3.0 - (tFix + 0.6), 0.0038, sx(2230))
# the mirab: the clarinet comes in with him, and he lifts each field's gate in its turn
clar(A3, tWm + 0.2, 3.0, 0.8, until=tGuide)
for i in range(4):
    gate(tGuide + 2.1 * i, 0.0045, px(960 + (XG[i] - (1640 if i < 2 else 1880)) * 2.8)); pour(tGuide + 2.1 * i + 0.2, 0.0035, px(960 + (XG[i] - (1640 if i < 2 else 1880)) * 2.8), 1.0)
ctina(D4, tGuide + 0.1, 1.2, 0.45, until=tHe); ctina(Fs4, tGuide + 4.3, 1.2, 0.4, until=tHe)
# his helpers keep the channels clean
slide(tClean, 1.2, 0.003, sx(1496, z=1.85)); slide(tClean + 0.6, 1.2, 0.003, sx(2262, z=1.85))
# the mirab looked after the water; its owners decided
clar(Fs3, tLook2, 2.0, 0.75, until=tDec)
cpress((D2, A2, Fs3, A3, D4), tDec, 3.0, 0.75, until=tRc)
# the record: every change of owner written down, from the first three men on
cpress((G2, D3, G3, B3), tRc + 0.2, 3.0, 0.72, until=tFi)
pen(tCh, 1.4, 0.0035, px(1430), 4)
for i, m in enumerate((D4, Fs4, A4)):
    ctina(m, tFi + 0.3 * i + 0.1, 1.2 - 0.2 * i, 0.45, pan=px(1430), until=tCe)
# generations later: the keeper's share a third, held by twenty; the rest, some seventy families; every share named
knock(tCe + 0.05, 0.004, px(300))
cpress((G2, B2, D3, G3), tTd, 2.8, 0.7, until=tSv)
air(tTd + 0.1, 1.4, 0.003, px(640)); slide(tDs + 0.1, 1.2, 0.003, px(760))
slide(tSv + 0.1, 1.4, 0.003, px(520))
cpress((B2, Fs3, B3, D4), tSv, 2.6, 0.68, until=tNm)
air(tNm, 2.6, 0.0035, px(640))
cpress((D2, A2, D3, Fs3, A3), tNm + 0.3, 3.2, 0.72, until=tLi)
# at the utility, its two tags
cpress((A2, E3, A3, Cs4), tLi, 3.0, 0.7, until=tB)
tap(tOw, 0.0035, px(1120)); tap(tLk, 0.0035, px(1120))
ctina(E4, le('link') + 0.15, 1.6, 0.45, until=tB)
# the pause: the water, as the dial leaves; the title, and the mark
water(tB - 0.4, END1 - tB + 0.2, 0.0028, px(640))
mark(tB + 0.8, 0.85, last=END1 - tB - 2.2, until=END1 - 0.1)

# 2. Tomás's next note: the chapter turns on G major as the note comes in; set aside, a dry rub of paper; the wall back, a breath of
#    air; the five concepts lit, a tap
K = 'note'
LV[0] = 1.0
nw_ = lambda lid, word, off=0: W(K, lid, word, off)
nc = lambda lid, off=0: G(K, lid, off)
cpress((G2, D3, G3, B3), S0(K) + 0.3, 2.4, 0.72)
slide(nc('map', -0.5), 1.0, 0.003, px(1140))
air(nw_('map', 'beneath the capabilities', -0.1), 1.2, 0.003, px(960))
tap(nw_('exactly', 'exactly what each capability does', -0.2), 0.0035, px(960))

# 3. Creates, reads, updates, deletes: the picture carries on from the wall. The matrix drawn: the capabilities move down one side and the
#    concepts across the top, a breath of air each; D major as it's drawn. The four letters: a tap as each comes in. CRUD matrix: a
#    knock. Grace comes in: a tap; the owners written row by row, a pen; what the systems say crossed out, a knock. Down each column: a
#    breath of air as it goes; one C in each column: A. The owner of that capability: F sharp. The connection point's C: a tap; Grace's
#    name carried to its column, air, and the concertina's D and A as it lands
K = 'matrix'
mw = lambda lid, word, off=0: W(K, lid, word, off)
mc = lambda lid, off=0: G(K, lid, off)
air(mw('draws', 'capabilities down one side', -0.4), 1.6, 0.003, px(200))
air(mw('draws', 'concepts across the top', -0.4), 1.6, 0.003, px(1100))
cpress((D3, A3, D4, Fs4), mw('draws', 'a matrix', -0.2), 2.4, 0.7)
for i, word in enumerate(('creates it', 'reads it', 'updates it', 'deletes it')):
    tap(mw('letters', word, -0.1), 0.003, px(1080 + 140 * i))
knock(mw('crud', 'CRUD matrix', -0.2), 0.004, px(200))
tap(mc('people', 0.2), 0.0035, px(1790))
pen(mw('people', 'the people who run each capability', -0.1), 1.6, 0.003, px(480), 4)
knock(mw('people', 'not from what the systems say', 0.3), 0.004, px(900))
air(mw('column', 'reads down each column', -0.2), 3.6, 0.003, px(1100))
ctina(A3, mw('column', 'created by one capability', 0.0), 1.6, 0.55, pan=px(900))
ctina(Fs4, mw('owner', 'the owner of that capability', 0.0), 1.6, 0.5, pan=px(480))
tap(mw('cp', 'Connecting customers creates', -0.1), 0.0035, px(800))
air(mw('cp', "Grace's", -0.4), 1.2, 0.003, px(700))
ctina(D4, mw('cp', "Grace's", 0.7), 1.4, 0.55, pan=px(800)); ctina(A4, mw('cp', "Grace's", 0.95), 1.2, 0.5, pan=px(800))
tap(mc('cp', 0) + _DUR['matrix/cp'] + 1.2, 0.003, px(1300))

# 4. Two that create: the account's column has two, and the film's own figure begins: both instruments take the same D. Serving
#    customers, connecting customers: a tap as each is named. The new home: the cards come to it, a soft flap each; one home, two
#    accounts: B minor. Last year: the numbers' card, a knock, and two first bills on the step. Farah asks why: a tap. Not Tomás's,
#    nor the data team's: a knock as each is struck out
K = 'two'
tw_ = lambda lid, word, off=0: W(K, lid, word, off)
tc = lambda lid, off=0: G(K, lid, off)
tTwo = tw_('two', 'has two', -0.3)
ctina(D4, tTwo + 0.2, 2.6, 0.6, pan=px(1300)); clar(D4, tTwo + 0.2, 2.6, 0.7, pan=px(1300))
knock(tTwo + 0.1, 0.004, px(1300))
tap(tw_('serve', 'Serving customers', -0.2), 0.0035, px(900)); tap(tw_('connect', 'connecting customers', -0.2), 0.0035, px(900))
card(tw_('both', 'a family', -0.2) + 0.3, 0.004, px(320))
card(tw_('both', 'end up with two', -0.3) + 0.3, 0.004, px(1600))
cpress((B2, Fs3, B3, D4), tw_('both', 'end up with two', -0.1), 2.6, 0.7)
knock(tc('last', 0.1), 0.004, px(960))
card(tw_('last', 'two first bills', -0.5), 0.004, px(880)); card(tw_('last', 'two first bills', -0.1), 0.004, px(1040))
tap(tw_('farah', 'asking why', -0.2), 0.0035, px(1790))
knock(tw_('whose', "isn't for Tomás", 0.4), 0.004, px(690)); knock(tw_('whose', 'the data team', 0.4), 0.004, px(1210))

# 5. The business decides: Grace and the head of retail decide it together: G major. Serving customers creates the account: a tick;
#    connecting customers only reads it: the figure ends, once: the concertina keeps the D, and the clarinet steps down to B and holds
#    it. Tells retail: the arrow drawn. The account's owner: a tap. The decision: its card, a pen for its date, and a tap as it's pinned
#    to the account. In the pause: the new home, one account and one first bill, and D major
K = 'decides'
dw_ = lambda lid, word, off=0: W(K, lid, word, off)
dc = lambda lid, off=0: G(K, lid, off)
cpress((G2, D3, G3, B3), dw_('who', 'decide it together', -0.2), 2.6, 0.7)
ticked(dw_('creates', 'Serving customers creates', 0.2), 0.004, px(1300))
tRd = dw_('creates', 'only reads the account', -0.2)
ctina(D4, tRd, 3.2, 0.6, pan=px(1300)); clar(D4, tRd, 0.9, 0.7, pan=px(1300)); clar(B3, tRd + 0.9, 2.3, 0.7, pan=px(1300))
slide(dw_('tells', 'tells retail', -0.3), 0.8, 0.003, px(1236))
tap(dw_('owner', 'head of retail', 0.0), 0.0035, px(1300))
tCd, tPin = dw_('dated', 'on the map', -0.4), dw_('dated', 'settle it again', -0.4)
card(tCd + 0.1, 0.0045, px(960)); pen(tCd + 0.6, 0.5, 0.003, px(700), 2)
tap(tPin + 0.7, 0.0035, px(1390))
card(dw_('since', 'one account', -0.3), 0.004, px(320)); card(dw_('since', 'one first bill', -0.3) + 0.2, 0.004, px(960))
ticked(dw_('since', 'one first bill', 0.6), 0.004, px(1290))
cpress((D2, A2, Fs3, A3, D4), dc('breath', 0.1), 2.6, 0.7, until=E(K) + 0.3)

# 6. Owners and stewards: the owner's card, a soft flap. Too many accounts for one person: a knock as the count lands, and B minor. The
#    steward's card: the clarinet comes back, as the mirab did, on A. Named by the owner: the arrow drawn. Like the mirab: the clarinet's
#    F sharp, and the channel's water, softly. The data team: its card, and a pick into the tunnel's earth, once, as the diggers are named
K = 'stewards'
sw_ = lambda lid, word, off=0: W(K, lid, word, off)
sc_ = lambda lid, off=0: G(K, lid, off)
card(S0(K) + 0.35, 0.0045, px(360))
knock(sw_('cant', 'three hundred and ten thousand accounts', -0.2), 0.004, px(960))
cpress((B2, Fs3, B3, D4), sw_('cant', 'day to day', -0.2), 2.4, 0.66)
tSt = sw_('names', 'names a steward', -0.2)
card(tSt + 0.05, 0.0045, px(960)); clar(A3, tSt + 0.3, 2.6, 0.75)
slide(tSt + 0.25, 0.8, 0.003, px(660))
clar(Fs3, sw_('mirab', 'Like the mirab', 0.0), 2.4, 0.7)
water(sw_('mirab', 'Like the mirab', -0.2), 3.0, 0.0025, px(1144))
card(sw_('diggers', 'the data team builds', -0.3) + 0.05, 0.0045, px(1560))
dig(sw_('diggers', 'as diggers', -0.1), 0.004, px(1744))

# 7. An owner nobody wrote down: the outage table, a knock; Ama's report, a soft flap, and its line drawn to the table. Whoever built it
#    has left: B minor. Which system: a knock, struck out; which capability creates outages: no music, as the question is asked;
#    operating the network creates them: a tap; outages are Grace's: a tick; her outage desk lead, their steward: the clarinet's A.
#    Found by capability, not by system: D major
K = 'unwritten'
uw = lambda lid, word, off=0: W(K, lid, word, off)
uc = lambda lid, off=0: G(K, lid, off)
knock(S0(K) + 0.5, 0.004, px(500))
card(uw('table', "Ama's yearly report", -0.3) + 0.05, 0.0045, px(1280)); slide(uw('table', 'counts them', 0.2), 0.7, 0.003, px(960))
cpress((B2, D3, Fs3, B3), uw('left', 'Whoever built it has left', -0.2), 2.6, 0.66)
knock(uw('asks', 'which system', -0.2), 0.004, px(1240))
tap(uw('grace', 'Operating the network', -0.1), 0.0035, px(1240))
ticked(uw('grace', "Grace's", -0.1), 0.004, px(500)); clar(A3, uw('grace', 'outage desk lead', -0.2), 2.2, 0.7)
cpress((D3, Fs3, A3, D4), uw('found', 'found by capability', -0.2), 2.6, 0.7, until=E(K) + 0.4)

# 8. The data practice on the map: the table leaves first, and the chapter turns on G major, high, as the map comes in. The data owner
#    and the data steward join the map, a knock each. Each domain's owner: a tap; each owner's stewards: a tap
K = 'practice'
qw = lambda lid, word, off=0: W(K, lid, word, off)
cpress((G3, B3, D4, G4), S0(K) + 0.7, 2.4, 0.66)
knock(qw('roles', 'the data owner', -0.3), 0.004, px(1590)); knock(qw('roles', 'the data steward', -0.3), 0.004, px(1790))
tap(qw('holds', "Each domain's owner", 0.0), 0.0035, px(1440)); tap(qw('stewards', 'names the stewards', 0.0), 0.0035, px(1790))

# 9. Every share, a name: back to the village, D major as at the film's start, with the wind and the channel's water; every share's
#    owner marked, a breath of air; the mirab at a gate, the water let in, and the clarinet's A. At the utility: G major as the matrix
#    comes back; each concept's one C, its owner and its steward, a tap. Tomás's next note goes up, paper, and its question on the
#    concertina: B, then A. Under the end card, without words, the mark, its F sharp held to the end
K = 'end'
ew = lambda lid, word, off=0: W(K, lid, word, off)
ec = lambda lid, off=0: G(K, lid, off)
tU, tN, tB9 = ec('utility'), ec('next'), ec('breath')
tS9 = ew('village', 'the mirab looks after', -0.6)
wind(S0(K), tU - S0(K), 0.005, 0.0); water(S0(K) + 0.3, tU - 0.4 - S0(K), 0.0035, px(1500))
cpress((D2, A2, Fs3, A3, D4), S0(K) + 0.4, 3.6, 0.72)      # held until the clarinet takes over, as the mirab does
air(ew('village', 'every share', -0.1), 1.8, 0.003, px(210))
gate(tS9 + 0.1, 0.0045, px(580)); pour(tS9 + 0.3, 0.0035, px(580), 1.2); clar(A3, tS9 + 0.3, 2.2, 0.65, until=tU - 0.6)
cpress((G2, D3, B3), tU - 0.2, 2.2, 0.66)
tap(ew('utility', 'a steward who looks after it', -0.2), 0.0035, px(1100))
card(tN - 0.2, 0.0045, px(860))
ctina(B3, ew('next', 'where each one is', -0.1), 0.9, 0.55, pan=px(860)); ctina(A3, ew('next', 'where each one is', 0.35), 1.4, 0.55, pan=px(860))
mark(tB9 + 1.6, 0.85, step=0.6, last=E(K) - tB9 - 3.4, until=E(K))
