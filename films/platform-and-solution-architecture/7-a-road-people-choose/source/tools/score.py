# A road people choose: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The series' palettes: /mnt/project-files/enterprise-architecture/new-architecture-series/palettes.md, this film's row reserved on 12
# November 2026. A violin and a mandolin, both made here (music.py has neither). Nothing new fitted, so the film pairs two instruments
# the site has, which no film pairs (the mandolin is Meaning on the platform's, steel-strung, with viols; violins play in the site's
# strings and quartets, and as Savart's trapezoid violin and the horn violin, never with a mandolin), and no film of this topic plays
# either:
#  - The lead: a violin, as it was played about 1600: gut strings, bowed plainly in its low and middle notes (G 3 to E flat 5). The bow
#    drags the string and lets it slip, over and over, so a bowed note is rich in harmonics, each about as strong as the one before
#    over its number; the violin's body lifts its air near 280 Hz and its wood near 460 and 540 Hz, and a little near 1 kHz. Each note
#    swells a little in with the bow and is held level, with a breath of the bow's hair under it, and let go: no vibrato, no slide,
#    one voice. Kept apart from the viols of Meaning on the platform by its own bright, open sound.
#  - The partner: a mandolin, the small gut-strung mandolino of about 1700, plucked with the fingertip: single notes, round and short,
#    gut dying sooner than wire, its upper harmonics first; never the tremolo, never a strummed chord. Its small bowl lifts its air near
#    390 Hz and its top near 850 and 1500 Hz. Kept apart from the cittern of One solution, end to end (wire, a quill, damped short) by
#    gut strings and the finger, and from Meaning on the platform's steel mandolin.
#  - Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road. The road is heard
#    as pilgrims' feet, far off and soft, coins set down, lots shaken, paper, and a wide river.
# The series' mark, the relay, in A flat: the violin plays A flat, B flat and E flat rising and lets the E flat go as the mandolin takes
# it an octave down and carries it to A flat; under the title and under the end card. The film's own figure, the way: a short tune the
# violin sets out on alone (E flat, A flat, C, B flat, E flat, C), which the mandolin takes up a beat behind, the same notes a step
# later, as travellers follow a guide. Alone where nobody takes the road (the villagers before the groups, and the two teams that gave
# up), and followed where people choose it (the pilgrims, metering in March, eight teams by December, and at the end). A flat major;
# F minor for what goes wrong (a farmer who doesn't know the road, six weeks, the teams that gave up, an order). Every note is tuned
# pure from A flat (just intonation, see hz()): A flat, D flat and E flat major and F and C minor are pure in this table; B flat minor
# is not, and no chord or overlap puts B flat with F or D flat. No chapter is urgent: nothing pulses.
# The rules the films keep (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: every note held at one level, with no vibrato, and let go.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/scenes.js, and
#    panned to where it is drawn. Everything soft: the violin and the mandolin below about 2.3 kHz, the effects below about 2.2 kHz
#    and well under the music.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word is missing; here that stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text(encoding='utf-8'))
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
R1 = np.random.default_rng(1771)  # this film's own randomness: the room, the bow, the feet, the coins, the lots and the river


# a small room of wood and plaster round the two players, ringing on for about eight tenths of a second. Its level is set by what it
# rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, so held notes
# keep their level (held.py)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds)"""
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a time in the film, a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig


# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _thud(n, f, d, at=0.0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone, a duller one above it, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.6 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.002) * k
def _moving(sig, s, g, pan0, pan1, k=4):
    """a sound moving across: overlapping pieces, each faded in and out, each panned a little further along"""
    n = len(sig); e = int(0.03 * SR)
    for i in range(k):
        a, b = max(0, i * n // k - e), min(n, (i + 1) * n // k + e); m = b - a; w = np.ones(m, np.float32)
        if a > 0: w[:2 * e] = np.linspace(0, 1, 2 * e)
        if b < n: w[-2 * e:] = np.linspace(1, 0, 2 * e)
        X(sig[a:b] * w, s + a / SR, g * FX, pan0 + (pan1 - pan0) * (i + 0.5) / k)
def _texture(sig, s, g, pan, pan1, top):
    if pan1 is None:
        _fx(sig, s, g, pan, top)
    else:
        _moving(norm(filt(np.asarray(sig, np.float32), 'low', top)).astype(np.float32), s, g, pan, pan1)

def sheet(s, g=0.0042, pan=0.0):
    """a card, a page or a print laid down: a short breath of paper, and its faint landing"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.22)[:n], 'band', (300, 1500)) * _bump(x, 0.09, 1.6) * (x < 0.09)
    _fx(fl + 0.5 * _thud(n, 150, 0.02, 0.08) / 1.3, s, g, pan, 1600)
def tick(s, g=0.0025, pan=0.0):
    """something small set in place: one soft tick of wood"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1150)) * np.exp(-x / 0.006) * 0.6 + 0.7 * _thud(n, 247, 0.011), s, g, pan, 1500)
def knock(s, g=0.0038, pan=0.0):
    """a soft knock, once: something that goes wrong, or is turned away, without a beep"""
    n = int(0.2 * SR)
    _fx(_thud(n, 131, 0.03), s, g, pan, 1200)
def thump(s, g=0.004, pan=0.0):
    """a data product set down on the platform: a dull, soft thump of wood"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 92, 0.05) + 0.25 * filt(noise(0.32)[:n], 'band', (150, 600)) * np.exp(-x / 0.05), s, g, pan, 900)
def coin(s, g=0.0022, pan=0.0):
    """a coin set down on a mat: a small, dull tap, with no ring"""
    n = int(0.09 * SR); x = np.arange(n) / SR
    _fx(0.8 * _thud(n, 392, 0.009) + 0.25 * filt(noise(0.1)[:n], 'band', (500, 1500)) * np.exp(-x / 0.004), s, g, pan, 1600)
def coins(s, sec=2.4, g=0.002, pan=0.0, pan1=None):
    """every household's coins coming in, many at once, as one soft texture: a dry, close chink of cloth purses, never single clinks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = 0.7 + 0.3 * np.abs(np.sin(np.pi * 6.0 * x)) ** 2
    _texture(filt(noise(sec + 0.02)[:n], 'band', (400, 1500)) * _bump(x, sec, 1.2) * gr, s, g, pan, pan1, 1600)
def lots(s, sec=0.8, g=0.0022, pan=0.0):
    """lots shaken in a box and drawn: one soft, dry rattle of wood that swells and stops, not single clicks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = 0.65 + 0.35 * np.abs(np.sin(np.pi * 9.0 * x)) ** 2
    _fx(filt(noise(sec + 0.02)[:n], 'band', (350, 1300)) * _bump(x, sec, 1.2) * gr, s, g, pan, 1500)
def water(s, sec, g=0.0018, pan=0.0, pan1=None):
    """a wide river, far off: one soft wash of water that swells in and eases off"""
    n = int(sec * SR); x = np.arange(n) / SR
    _texture(filt(noise(sec + 0.02)[:n], 'band', (120, 700)) * _bump(x, sec, 0.8), s, g, pan, pan1, 800)
def line(s, sec=0.9, g=0.0028, pan=0.0, pan1=None):
    """a line drawn, written or lit across a map or a page: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _texture(filt(noise(sec + 0.02)[:n], 'band', (220, 1150)) * _bump(x, sec, 1.4) * gr, s, g, pan, pan1, 1350)
def hatch(s, sec=1.6, g=0.0026, pan=0.0, pan1=None):
    """many things drawn at once, as one soft texture: a dry rub with a fine, even grain, swelling in and easing off; never a patter"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = 0.75 + 0.25 * np.abs(np.sin(np.pi * 7.0 * x)) ** 2
    _texture(filt(noise(sec + 0.02)[:n], 'band', (250, 1250)) * _bump(x, sec, 1.1) * gr, s, g, pan, pan1, 1450)
def whisk(s, sec=0.9, g=0.0026, pan=0.0, pan1=None):
    """something carried through the air, a slip, a light or a question: one soft breath that rises and falls"""
    n = int(sec * SR); x = np.arange(n) / SR
    _texture(filt(noise(sec + 0.02)[:n], 'band', (350, 1400)) * _bump(x, sec, 2.2), s, g, pan, pan1, 1500)
def feet(s, sec, g=0.0026, pan=0.0, pace=1.5, pan1=None):
    """people walking on a stony road, farther off: one soft texture of steps that swells in and fades, not a patter of single steps"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.55 + 0.45 * np.abs(np.sin(np.pi * pace * x + 0.4)) ** 3
    _texture(filt(noise(sec + 0.02)[:n], 'band', (100, 600)) * beat * _bump(x, sec, 0.9), s, g, pan, pan1, 700)


# ---- tuning: just intonation from A flat, so the notes that sound together are whole-number ratios of each other and nothing beats.
# A flat, D flat and E flat major and F and C minor are pure in this table; B flat minor is not, and B flat never sounds with F or D flat
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 68, 12)
    return 415.305 * 2 ** o * _JI[pc]
G3, Ab3, Bb3, C4, Db4, Eb4, F4, G4, Ab4, Bb4, C5, Db5, Eb5 = 55, 56, 58, 60, 61, 63, 65, 67, 68, 70, 72, 73, 75

LR, LT, FX = 0.074, 0.093, 7.0
LV = [1.0]

# ---- the violin. A bowed string's harmonics, each about as strong as the one before over its number, weighted by the body: its air
# near 280 Hz, its wood near 460 and 540 Hz, a lift near 1 kHz; nothing above about 2.3 kHz. The bow takes the string and the note
# swells in over swell seconds, its upper harmonics a moment later; a breath of the bow's hair stays under it, a little more as it
# bites; held at one level, and let go with a short ring of the string. No vibrato
_VB = [(280, 70, 0.75), (460, 90, 1.0), (540, 110, 0.9), (720, 170, 0.45), (1050, 320, 0.55), (1800, 520, 0.3)]
_VP = R1.uniform(0, 2 * np.pi, 24)
def _vw(f):
    n = max(1, int(2300 // f)); k = np.arange(1, n + 1); fk = f * k
    a = 1.0 / k ** 0.95 * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in _VB) + 0.3)
    return a / np.sqrt((a ** 2).sum())
def vln(m, s, sec, g=1.0, pan=0.14, room=0.28, swell=0.14, rel=0.16, until=None):
    """the violin bows m from s for sec seconds: the note swells a little in, holds level, and is let go"""
    if until is not None:
        sec = min(sec, until - s - rel - 0.05)
    if sec <= 0.1:
        return
    f = hz(m); n = int((sec + rel + 0.3) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    off = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    for j, aj in enumerate(_vw(f)):
        k = j + 1; sw = swell * (1 + 0.12 * (k - 1))
        sig += aj * np.sin(0.5 * np.pi * np.minimum(x / sw, 1)) ** 2 * np.sin(2 * np.pi * f * k * x + _VP[j % 24]) * off
    # the string rings a moment after the bow leaves it, its low harmonics only
    rt = np.maximum(x - sec, 0); ring = (x > sec) * (1 - off) * np.exp(-rt / 0.12)
    sig += ring * 0.5 * (np.sin(2 * np.pi * f * x + _VP[0]) + 0.3 * np.sin(2 * np.pi * 2 * f * x + _VP[1]))
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    hair = filt(noise(n / SR + 0.01)[:n], 'band', (max(300, 0.8 * f), 2000))
    bite = 1 + 2.0 * np.exp(-x / 0.05)
    sig += 0.016 * hair * np.sin(0.5 * np.pi * np.minimum(x / swell, 1)) ** 2 * off * bite
    sig = _room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 150)), room, min(0.3, sec * 0.3), sec)
    put(_until(sig, s, until), s, g * LV[0] * LR, pan)

# ---- the mandolin: a gut string plucked with the fingertip, a fifth of the way along, so its sound is round: the first harmonics
# strong, the upper ones weak and gone first. Gut dies sooner than wire; the player lets each note go after ring seconds. Its small bowl
# lifts its air near 390 Hz and its top near 850 and 1500 Hz; a soft touch of the finger as it plucks; one string to a note (a mandolin
# has pairs, and a pair a little apart in tune would beat); nothing above about 2.3 kHz
_MB = [(390, 140, 0.9), (850, 260, 0.75), (1500, 420, 0.35)]
def _gut(f, x, pos=0.2):
    sig = np.zeros(len(x)); d1 = 0.5 * (300 / f) ** 0.3
    for k in range(1, int(2300 // f) + 1):
        fk = f * k; dk = d1 / (1 + 0.8 * (k - 1) ** 1.1)
        a = abs(np.sin(np.pi * k * pos)) / k ** 1.2 * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in _MB) + 0.25)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.9 * k * k) * (0.3 * np.exp(-x / (0.12 * dk)) + 0.7 * np.exp(-x / dk))
    return sig
def man(m, s, g=1.0, pan=-0.16, ring=0.6, room=0.24, until=None):
    """a note on the mandolin, plucked at s with the fingertip and let go after ring seconds"""
    if until is not None:
        ring = min(ring, until - s - 0.12)
    if ring <= 0.06:
        return
    f = hz(m); sec = ring + 0.12; x = tt(sec).astype(np.float64)
    sig = _gut(f, x) * np.minimum(1, x / 0.0025) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.1, 1)) ** 2, 1.0)
    nf = int(0.012 * SR); sig[:nf] += 0.04 * np.abs(sig).max() * filt(noise(0.012), 'band', (200, 900))[:nf] * np.exp(-np.arange(nf) / SR / 0.003)
    sig = _room(norm(filt(sig.astype(np.float32), 'low', 2300)), room, 0.03, ring)
    put(_until(sig, s, until), s, g * LV[0] * LT, pan)

# ---- what they play
def turn(s, mands, highs, g=1.0, at=0.45, step=0.2, ring=0.55, until=None):
    """at a turn: the mandolin's single notes one after another (never together, never strummed), and over them the violin's notes in
    turn (highs: (note, seconds)), from at seconds after"""
    for i, m in enumerate(mands):
        man(m, s + step * i, 0.9 * g, ring=ring, until=until)
    t = s + at
    for m, d in highs:
        vln(m, t, d * 0.94, 0.9 * g, until=until); t += d
    return t

def mark(s, g=1.0, step=0.36, until=None, hold=1.6):
    """the series' mark, in A flat: the violin's A flat, B flat and E flat rising, and the mandolin takes the E flat an octave down and
    carries it to A flat; the violin lets its E flat go as the mandolin takes it, as a letter handed on from station to station"""
    vln(Ab4, s, step * 0.9, g, swell=0.08, until=until)
    vln(Bb4, s + step, step * 0.9, g, swell=0.08, until=until)
    vln(Eb5, s + step * 2, step + 0.04, g, swell=0.08, until=until)
    man(Eb4, s + step * 3, 0.95 * g, ring=step - 0.03, until=until)
    man(Ab4, s + step * 4, 0.95 * g, ring=hold, until=until)
    return s + step * 4

WAY = (Eb4, Ab4, C5, Bb4, Eb5, C5)
def way(s, step=0.4, g=1.0, alone=False, n=None, end=None, last=1.3, until=None):
    """the film's figure: the violin sets out on a short tune; followed, the mandolin takes it up a beat behind, the same notes a step
    later, as travellers follow a guide. alone: nobody takes it up, and the violin stops after n notes, on the last held. end: another
    last note"""
    notes = list(WAY[:n] if n else WAY)
    if end is not None:
        notes[-1] = end
    for i, m in enumerate(notes):
        z = i == len(notes) - 1
        vln(m, s + step * i, last if z else step * 0.9, g, swell=0.08, until=until)
        if not alone:
            man(m, s + step * (i + 1), 0.9 * g, ring=0.9 if z else step * 0.9, until=until)
    return s + step * len(notes) + last


# =============================================================================================================================
# 1. Once in a lifetime: the opening. Japan, the 1700s: the mandolin's first notes and the violin as the map appears, its roads drawn.
#    Once in a lifetime, to Ise: the road south drawn, Ise lit, and E flat over C and A flat. From Edo: the Tōkaidō lit along, and D flat.
#    A village at dusk: a farmer who doesn't know the road, F minor, and a soft tick for each thing he doesn't know; the journey's cost,
#    two coins. A way they can follow: the way, alone. The groups: A flat; every household's coins, one soft texture; the lots; two set
#    off, feet. The oshi walks in, feet, and his charms on each house, paper; D flat. At Ise: the pilgrims arrive and are led on, feet;
#    E flat to A flat. The guidebook: paper, its lines, every station lit; C. Nobody is made to go: the way laid out, paid for together,
#    someone expecting them, a tick each, and A flat. So ordinary people go: pilgrims' feet, and the way, followed. 1771: the river, the
#    count, and E flat to A flat. The tale and the prints, paper, and the mandolin alone. The utility: six weeks, F minor; two teams gave
#    up, a knock each. Ravi: the road lit, the teams' lights, a data product set down, and A flat rising. The title: the relay
LV[0] = 0.9
ow = lambda lid, word, off=0: W('ise', lid, word, off)
oc = lambda lid, off=0: G('ise', lid, off)
END = E('ise')
turn(0.6, [Ab3, Eb4, C5], [(Eb4, 1.1), (Ab4, 1.9)], 0.72, at=0.75)
line(0.8, 2.4, 0.0024, px(500), px(1600))
line(oc('once', -0.2), 1.4, 0.002, px(1000), px(760))
tick(ow('once', 'Ise', -0.1), 0.0022, px(760))
turn(ow('once', 'great shrine', -0.3), [C4, Ab4], [(Eb5, 1.6)], 0.62, at=0.35)
line(oc('far', 0.0), 2.6, 0.0022, px(1620), px(820))
turn(ow('far', 'road south', -0.3), [Db4, Ab4], [(F4, 0.7), (Ab4, 1.4)], 0.6, at=0.35)
turn(oc('farmer', -0.6), [F4, C5], [(Ab4, 0.8), (F4, 1.5)], 0.62, at=0.4)
for word, x in (('where to sleep', 1010), ('how far', 1380), ('what it all costs', 1720)):
    tick(ow('farmer', word, -0.2), 0.002, px(x))
coin(ow('cost', 'more than', -0.1), 0.0022, px(930))
coin(ow('cost', 'more than', 0.15), 0.002, px(1006))
way(ow('need', 'a way to go', 0.1), 0.42, 0.62, alone=True, n=4, last=1.1)
turn(oc('group', -0.2), [Ab3, C4, Eb4], [(Ab4, 0.7), (C5, 1.5)], 0.64)
coins(ow('group', 'pays in', -0.4), 2.6, 0.0018, px(300), px(1300))
lots(ow('group', 'chosen by lot', -0.2), 0.8, 0.002, px(745))
feet(ow('group', 'go for everyone', -0.2), 8.2, 0.002, px(800), 1.5, px(1500))
feet(oc('oshi', -0.8), 6.2, 0.0018, px(1900), 1.4, px(1250))
for i in range(4):
    sheet(ow('oshi', 'charms', -0.2 + (3 - i) * 0.3), 0.0018, px((120, 290, 460, 630)[i]))
turn(ow('oshi', 'every year', -0.3), [Db4, F4, Ab4], [(Db5, 1.4)], 0.58, at=0.5)
feet(oc('lodge', -1.2), 4.6, 0.0018, px(450), 1.5, px(780))
turn(oc('lodge', 0.1), [Eb4, G4, Bb4], [(Eb5, 0.8), (C5, 1.5)], 0.6)
feet(ow('lodge', 'guide', 0.2), 5.6, 0.002, px(800), 1.5, px(1500))
sheet(oc('book', -0.4), 0.0038, px(380))
for word in ('every station', 'how far apart', 'the inns', 'the sights'):
    line(ow('book', word, -0.1), 0.5, 0.0016, px(380))
hatch(ow('book', 'every station', -0.2), 1.6, 0.0018, px(1600), px(620))
turn(ow('book', 'the sights', 0.2), [C4, Eb4, Ab4], [(G4, 0.6), (Ab4, 1.3)], 0.56)
for word, x in (('laid out', 760), ('paid for together', 960), ('someone', 1180)):
    tick(ow('choose', word, -0.2), 0.0018, px(x))
feet(oc('choose', 0.2), 8.0, 0.0014, px(1600), 1.4, px(800))
turn(ow('choose', 'expecting', -0.2), [Ab3, Eb4], [(C5, 1.5)], 0.58, at=0.4)
feet(oc('many', -0.2), 6.8, 0.0022, px(1600), 1.6, px(800))
way(oc('many', 0.3), 0.4, 0.64)
water(oc('ferry', -0.4), 6.2, 0.0016, px(700), px(820))
sheet(ow('ferry', 'two million', -0.4), 0.0036, px(1530))
hatch(ow('ferry', 'two million', -0.2), 2.4, 0.0016, px(1530))
turn(ow('ferry', 'counted', -0.1), [Eb4, Bb4], [(G4, 0.6), (Ab4, 1.4)], 0.58, at=0.4)
sheet(ow('tale', 'comic tale', -0.3), 0.0036, px(330))
sheet(ow('tale', 'prints', -0.3), 0.0036, px(770))
for i, m in enumerate((C5, Db5, Eb5, C5, Ab4)):
    man(m, ow('tale', 'craze', 0.0) + 0.19 * i, 0.55, ring=0.3 if i < 4 else 0.8)
turn(ow('one', 'six weeks', -0.3), [C4, F4], [(Ab4, 0.8), (F4, 1.4)], 0.6, at=0.4)
hatch(ow('one', 'six weeks', -0.4), 1.4, 0.0016, px(1250), px(1570))
knock(ow('one', 'two teams', 0.0), 0.003, px(870))
knock(ow('one', 'two teams', 0.4), 0.0028, px(820))
line(ow('ravi', 'road teams choose', -0.1), 1.6, 0.0022, px(600), px(1720))
turn(ow('ravi', 'road teams choose', 0.2), [Ab3, C4, Eb4, Ab4], [(Eb5, 0.6), (C5, 1.4)], 0.6, at=0.8)
thump(ow('ravi', 'easiest', -0.2), 0.0036, px(1630))
t_ = mark(oc('breath', 1.0), 0.72, until=END, hold=1.4)
vln(C5, t_ + 0.35, 1.3, 0.5, until=END)

# 2. Six weeks: a year ago, F minor; network's team, a tick. Eleven tickets: the card, paper, two of its lines; the slips into the queue,
#    one breath of paper. The pipeline from nothing, paper; the first pull request, paper, sent back, a knock and a line; six weeks, and
#    F minor; the product set down at last, a thump. Two teams gave up: a knock each, what each built, a tick; the way, alone. Nobody
#    did anything wrong: the safe way, a tick, and A flat; not yet the easy one, a knock. An order: paper; use it, a tick, not want it,
#    a knock; the quick way around, a line, and F minor
LV[0] = 0.9
kw = lambda lid, word, off=0: W('weeks', lid, word, off)
kc = lambda lid, off=0: G('weeks', lid, off)
turn(S0('weeks') + 0.4, [C4, F4, Ab4], [(C5, 1.5)], 0.56, at=0.6)
tick(kw('last', "network's", -0.2), 0.002, px(560))
sheet(kc('tickets', -0.2), 0.0036, px(800))
for word in ('a workspace', 'each right'):
    line(kw('tickets', word, 0.0), 0.5, 0.0016, px(800))
whisk(kw('queue', 'Each one', -0.2), 1.6, 0.0018, px(1050), px(1700))
sheet(kw('scratch', 'pipeline', -0.3), 0.0034, px(800))
sheet(kw('scratch', 'first pull request', -0.3), 0.0034, px(1320))
knock(kw('scratch', 'came back', -0.1), 0.003, px(1560))
line(kw('scratch', 'came back', -0.1), 0.6, 0.0016, px(1600))
turn(kc('six', -0.1), [F4, Ab4], [(C5, 0.7), (Ab4, 1.4)], 0.56, at=0.4)
thump(kw('six', 'call centre', -0.2), 0.0034, px(1630))
for i, x in enumerate((600, 1020)):
    knock(kw('gave', 'gave up', 0.3 * i), 0.0028, px(x))
tick(kw('gave', 'Field services', 0.4), 0.0018, px(1020))
tick(kw('gave', 'metering works', 0.3), 0.0018, px(1020))
way(kw('gave', 'gave up', 0.5), 0.44, 0.52, alone=True, n=4, last=1.0)
tick(kw('wrong', 'safe way', -0.1), 0.0018, px(900))
turn(kw('wrong', 'safe way', 0.1), [Ab3, Eb4], [(C5, 1.3)], 0.5, at=0.4)
knock(kw('wrong', 'not yet', -0.1), 0.0024, px(1110))
sheet(kw('order', 'order every team', -0.3), 0.0036, px(1500))
tick(kw('order', 'use it', -0.2), 0.0018, px(1410))
knock(kw('order', 'not want', -0.2), 0.0024, px(1610))
line(kw('order', 'quick way', 0.0), 1.6, 0.0018, px(1180), px(1860))
turn(kw('order', 'way around', 0.0), [F4, C5], [(Ab4, 0.6), (F4, 1.3)], 0.5, at=0.35)

# 3. Teams, as customers: the platform as a product, D flat; the teams come in, one soft texture, and the two that gave up slide to
#    their places, a breath. The platform team goes to each: a breath as it sets out, a tick at each team. What it needs, a tick; what
#    gets in its way, a knock. The three things, a knock each. As the oshi did: the strip of road, a line, and A flat. Another series,
#    paper
LV[0] = 0.9
uw = lambda lid, word, off=0: W('users', lid, word, off)
uc = lambda lid, off=0: G('users', lid, off)
turn(uw('product', 'as a product', -0.2), [Db4, F4, Ab4], [(Ab4, 0.6), (C5, 1.3)], 0.56)
whisk(S0('users') + 0.7, 1.6, 0.0016, px(560), px(900))
hatch(uw('product', 'teams', -0.3), 1.2, 0.0016, px(800), px(1240))
for k, x in enumerate((820, 985, 1190, 845, 1005, 1180)):
    tick(uw('sits', 'sits with', -0.4 + k * 1.9 + 0.6), 0.0014, px(x))
tick(uw('sits', 'needs', -0.3), 0.0016, px(900))
knock(uw('sits', 'gets in', -0.3), 0.0022, px(1150))
for word, x in (('waiting', 900), ('not knowing', 940), ('learning', 1000)):
    knock(uw('three', word, -0.3), 0.0022, px(x))
line(uc('story', 0.0), 3.2, 0.002, px(700), px(1500))
turn(uc('story', 0.3), [Ab3, Eb4, Ab4], [(C5, 0.6), (Eb5, 1.3)], 0.52)
sheet(uc('more', -0.3), 0.0034, px(1020))

# 4. A path already laid: the road laid along the platform, a line, and A flat; the template, paper, growing, a line. The form, paper,
#    its fields, a tick each; no tickets: the slip struck, a line, and its chip, a tick. A repository in minutes, paper, and E flat; all
#    it needs, a tick each as it's named; the logic, the team's own, a tick. A team may leave the path: the branch, a line, its light, a
#    breath; that part its own, a tick, and D flat. The quickest way, a tick, and the right one, a tick: E flat to A flat
LV[0] = 0.9
pw = lambda lid, word, off=0: W('path', lid, word, off)
pc = lambda lid, off=0: G('path', lid, off)
line(pw('grow', 'path already laid', -0.1), 1.8, 0.0022, px(600), px(1720))
turn(pw('grow', 'path already laid', 0.2), [Eb4, Ab4, C5], [(Eb5, 0.6), (C5, 1.3)], 0.56)
sheet(pw('grow', 'template', -0.3), 0.0034, px(880))
line(pw('grow', 'grows', 0.0), 0.9, 0.0016, px(800), px(1100))
sheet(pc('form', -0.3), 0.0034, px(910))
for word in ('name', 'owner', 'what it holds'):
    tick(pw('form', word, -0.2), 0.0016, px(760))
line(pw('form', 'No tickets', 0.0), 0.4, 0.0016, px(628))
tick(pw('form', 'No tickets', 0.2), 0.0018, px(740))
sheet(pw('gets', 'repository', -0.3), 0.0034, px(1530))
turn(pw('gets', 'repository', 0.0), [G4, Bb4], [(Eb5, 0.5), (Bb4, 1.1)], 0.5, at=0.35)
for word in ('pipeline', 'tests', 'contract', 'catalogue', 'rights', 'its log'):
    tick(pw('list', word, -0.1), 0.0014, px(1300))
tick(pw('own', 'the logic', -0.3), 0.0016, px(1300))
line(pw('leave', 'leave the path', 0.0), 1.0, 0.0018, px(1290), px(1150))
whisk(pw('leave', 'leave the path', 0.4), 1.4, 0.0014, px(1290), px(1150))
tick(pw('leave', 'its own to run', -0.3), 0.0016, px(930))
turn(pw('leave', 'its own to run', -0.1), [Db4, F4], [(Ab4, 1.2)], 0.48, at=0.35)
tick(pw('right', 'quickest', 0.0), 0.0016, px(1000))
tick(pw('right', 'right one', 0.0), 0.0016, px(1300))
turn(pw('right', 'right one', 0.3), [Eb4, Bb4, G4], [(C5, 0.5), (Ab4, 1.4)], 0.54, at=0.6)

# 5. Rules built in: the guardrails drawn, a line, and C over A flat. The three rules, a tick each as it's named. A team's light goes
#    along, a breath, and each rule's station rings as it passes, a tick; nothing sent back: E flat to A flat. Guardrails, not gates: the
#    light touches a rail and goes on, a tick; guardrails, a tick; not gates, struck, a line
LV[0] = 0.9
rw = lambda lid, word, off=0: W('rules', lid, word, off)
rc = lambda lid, off=0: G('rules', lid, off)
line(rw('built', 'built into', -0.2), 1.6, 0.0018, px(600), px(1720))
turn(rw('built', 'built into', 0.2), [Ab3, Eb4, C4], [(Ab4, 0.6), (C5, 1.2)], 0.5)
for word, x in (('Personal data', 900), ('tests run', 1400), ('owner', 1580)):
    tick(rw('which', word, -0.3), 0.0016, px(x))
tGo = rw('back', 'no first', -0.6)
whisk(tGo, 4.4, 0.0012, px(600), px(1720))
for dt, x in ((1.52, 900), (2.88, 1420), (3.87, 1680)):
    tick(tGo + dt, 0.0015, px(x))
turn(tGo + 4.2, [Bb4, G4], [(Eb5, 0.5), (C5, 1.2)], 0.5, at=0.35)
tick(rw('rails', 'keep a team', 0.3), 0.0016, px(1000))
tick(rw('rails', 'Guardrails', 0.0), 0.0016, px(900))
line(rw('rails', 'not gates', 0.0), 0.5, 0.0014, px(1110))

# 6. A guide, and someone to ask: the guide, paper, and D flat; each step and how long, one soft texture each; whom to ask, a tick.
#    The teams' questions fly in, a breath each, and a tick as each row is written. A question in the channel, a tick; the answer the
#    same day, a tick, and E flat. As the guidebooks did: the strip of road, a line, and A flat
LV[0] = 0.9
gw = lambda lid, word, off=0: W('guide', lid, word, off)
gc = lambda lid, off=0: G('guide', lid, off)
sheet(gc('guide', -0.3), 0.0034, px(900))
turn(gc('guide', 0.0), [F4, Ab4, Db5], [(F4, 0.6), (Ab4, 1.2)], 0.5)
hatch(gw('guide', 'every step', -0.2), 1.2, 0.0014, px(700))
hatch(gw('guide', 'how long', -0.2), 1.0, 0.0014, px(1100))
tick(gw('guide', 'whom to ask', -0.2), 0.0016, px(900))
for i in range(3):
    whisk(gw('grows', 'questions', -0.7 + i * 1.1), 0.7, 0.0014, px(1880), px(1290))
    tick(gw('grows', 'questions', 0.2 + i * 1.1), 0.0014, px(1290))
tick(gw('channel', 'a question', -0.3), 0.0016, px(1500))
tick(gw('channel', 'answer', -0.3), 0.0016, px(1650))
turn(gw('channel', 'same day', 0.0), [Bb4, Eb4], [(G4, 0.5), (Eb5, 1.2)], 0.48, at=0.35)
line(gc('story', 0.0), 3.2, 0.0018, px(1260), px(1800))
turn(gc('story', 0.4), [C4, Ab4, Eb4], [(Ab4, 0.6), (C5, 1.4)], 0.5)

# 7. Two days: March, metering's team tries again, A flat; its light along the path, a breath at each step. Monday morning: the form,
#    paper, each value written, a line. By lunch: its repository, a tick, its logic, paper. Tuesday: the review, a tick, the tests pass,
#    a tick, and E flat. By Tuesday evening: checked meter reads set down, a thump, and its owner, a tick. Two days, a tick; not six
#    weeks, struck, a line: the way, followed. Metering's spreadsheets, a tick, retired, a line
LV[0] = 0.9
dw = lambda lid, word, off=0: W('days', lid, word, off)
dc = lambda lid, off=0: G('days', lid, off)
turn(S0('days') + 0.4, [Ab3, C4, Eb4], [(G4, 0.5), (Ab4, 1.3)], 0.52)
for lid, word in (('monday', 'fills in'), ('lunch', 'repository'), ('lunch', 'writes its logic'), ('tuesday', 'reviews')):
    whisk(dw(lid, word, -0.4), 0.8, 0.0012, px(700), px(1300))
sheet(dw('monday', 'fills in', -0.3), 0.0032, px(910))
for i in range(3):
    line(dw('monday', 'the form', 0.1 + i * 0.7), 0.5, 0.0014, px(1000))
tick(dw('lunch', 'repository', 0.0), 0.0016, px(900))
sheet(dw('lunch', 'writes its logic', -0.3), 0.0032, px(1530))
tick(dw('tuesday', 'reviews', -0.2), 0.0016, px(1460))
tick(dw('tuesday', 'tests pass', 0.0), 0.0016, px(1300))
turn(dw('tuesday', 'tests pass', 0.2), [Eb4, G4], [(Bb4, 1.2)], 0.48, at=0.35)
thump(dw('live', 'catalogue', -0.3), 0.0034, px(1230))
tick(dw('live', 'owner', -0.2), 0.0016, px(1230))
tick(dc('two', 0.0), 0.0016, px(1060))
line(dw('two', 'six weeks', 0.0), 0.5, 0.0014, px(1290))
way(dw('two', 'six weeks', 0.6), 0.4, 0.56)
tick(dw('two', 'spreadsheets', -0.5), 0.0014, px(640))
line(dw('two', 'retired', -0.1), 0.6, 0.0014, px(1020))

# 8. Counted at the ferry: what Ravi counts, paper, and A flat; each row written, a line; each number, a tick. December: the eleven
#    teams, one soft texture; eight have chosen it: the way, followed, ending on A flat. Field services: its server switched off, a
#    knock; its jobs carried onto the platform, a breath, and set down, a thump. Metering's check: out of its data product, a breath,
#    into the template, a tick; every team gets it: C over A flat. At Ise: the strip of road, a line, and E flat to A flat
LV[0] = 0.9
cw = lambda lid, word, off=0: W('count', lid, word, off)
cc = lambda lid, off=0: G('count', lid, off)
sheet(cc('counts', -0.3), 0.0034, px(1510))
turn(cc('counts', 0.0), [Ab3, Eb4, Ab4], [(C5, 1.3)], 0.5, at=0.6)
for word in ('How many', 'how long', 'what teams say'):
    line(cw('three', word, -0.1), 0.6, 0.0014, px(1400))
hatch(cc('dec', -0.3), 1.6, 0.0014, px(1220), px(1760))
tick(cw('dec', 'eight', -0.2), 0.0016, px(1760))
way(cw('dec', 'chosen', 0.0), 0.4, 0.54, end=Ab4)
tick(cw('days', 'two to four', -0.2), 0.0016, px(1760))
tick(cw('days', 'nine in ten', -0.2), 0.0016, px(1760))
tick(cw('server', 'Field services', -0.4), 0.0016, px(560))
knock(cw('server', 'switched off', 0.0), 0.0024, px(1020))
whisk(cw('server', 'onto the platform', -0.4), 1.2, 0.0014, px(1020), px(760))
thump(cw('server', 'onto the platform', 0.6), 0.0032, px(830))
whisk(cw('back', 'adds a check', 0.0), 1.3, 0.0014, px(1230), px(640))
tick(cw('back', 'adds a check', 1.2), 0.0016, px(640))
turn(cw('back', 'every team', 0.0), [C4, Eb4], [(Ab4, 0.5), (C5, 1.2)], 0.48, at=0.35)
line(cc('story', -0.2), 3.2, 0.0018, px(640), px(1160))
turn(cc('story', 0.6), [Eb4, Bb4, G4, Eb4], [(Ab4, 1.4)], 0.5, at=0.85)

# 9. The data practice on the map: its layers, paper, and A flat; the platform, a tick; the path among its services, a tick and its
#    ring, a line. The data products, one soft texture; the lines serving them, a line; their owners, a tick each. The goal, a tick;
#    the outcomes, a tick each; realised, a line: E flat to A flat
LV[0] = 0.9
aw = lambda lid, word, off=0: W('practice', lid, word, off)
ac = lambda lid, off=0: G('practice', lid, off)
sheet(S0('practice') + 0.3, 0.0034, px(960))
turn(S0('practice') + 0.5, [Ab3, C4, Ab4], [(Eb5, 0.6), (C5, 1.2)], 0.48)
tick(ac('intro', -0.2), 0.0016, px(1000))
tick(aw('path', 'path', -0.3), 0.0016, px(735))
line(aw('path', 'a new data product', -0.4), 0.8, 0.0014, px(735))
hatch(aw('serves', 'each data product', -0.3), 1.0, 0.0014, px(570), px(1490))
line(aw('serves', 'serves', -0.1), 1.0, 0.0014, px(735), px(1380))
for i, x in enumerate((760, 1220, 1680)):
    tick(aw('serves', 'owned', -0.2 + i * 0.15), 0.0013, px(x))
tick(aw('goal', 'teams choose', -0.3), 0.0016, px(1050))
tick(aw('goal', 'eight teams', -0.3), 0.0016, px(560))
tick(aw('goal', 'first data product', -0.3), 0.0016, px(1590))
line(aw('goal', 'realised', -0.1), 0.8, 0.0014, px(800), px(1300))
turn(aw('goal', 'first data product', 0.6), [Eb4, G4, Bb4], [(C5, 0.5), (Ab4, 1.4)], 0.5, at=0.6)

# 10. The road, chosen: the road at dusk, pilgrims walking on to Ise, feet; the way laid out, paid for together, someone expecting
#     them, a tick each, and A flat. On the data platform: the road lit end to end, a line, and the way, followed, once more. What made
#     it, a tick each; and someone counts, a tick. "Next", a tick. The end card: the relay
LV[0] = 0.9
zw = lambda lid, word, off=0: W('end', lid, word, off)
zc = lambda lid, off=0: G('end', lid, off)
feet(S0('end') + 0.1, 9.6, 0.0022, px(100), 1.5, px(700))
for word, x in (('The way', 700), ('paid for', 960), ('someone', 1220)):
    tick(zw('road', word, -0.2), 0.0015, px(x))
turn(zw('road', 'expecting', -0.2), [Ab3, Eb4, C4], [(Eb5, 0.6), (Ab4, 1.4)], 0.56, at=0.5)
line(zc('data', -0.4), 1.8, 0.0022, px(600), px(1720))
way(zc('data', 0.4), 0.4, 0.58)
for word, x in (('path', 1080), ('rules', 1310), ('a guide', 1080), ('someone to ask', 1290)):
    tick(zw('what', word, -0.2), 0.0014, px(x))
tick(zw('what', 'counts', -0.2), 0.0016, px(1180))
tick(zc('next', -0.1), 0.0018, px(1180))
t_ = mark(zc('breath', 0.7), 0.68, until=TOT, hold=2.6)
vln(C5, t_ + 0.5, 2.4, 0.45, until=TOT)
