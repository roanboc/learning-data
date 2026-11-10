# Deleted means deleted: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, checked against every score.py on main and on every branch, and against the module's palettes
# list (/mnt/project-files/data-protection/palettes.md, where this film's thread set it down on 5 November 2026 and changed its partner on
# 10 November 2026): a straw fiddle and one low hummed voice, both made here (music.py has neither).
#  - The straw fiddle leads: the European xylophone of the 1500s to the 1800s, loose wooden bars laid on ropes of straw and struck
#    softly with small wooden beaters. No tubes under its bars, so nothing rings on: each note is low, dry and short, the bar's own
#    tone and two or three faint ones above it that aren't its harmonics (a bar's, at 2.76 and 5.40 times), all gone in a moment.
#    Each tablet set down in Kanesh is one note; on the platform, each copy of Linh's row is one note (hers is B-flat), and a copy
#    that's gone never sounds again.
#  - The mark: a short phrase, one note for each copy, played as the frosted tablets stand behind the history card in Broken, or void.
#    In Every copy, the locked copies have a phrase of their own, a note for each, and when two of them go it plays again without
#    their notes; in Gone, as the timeline ticks, the mark plays once whole, then only its last two notes as the last locked copy
#    goes, then its last note alone with the last pay records, over the voice's one held note, and then nothing.
#  - The hummed voice holds: one low voice, lips closed, no vibrato, one note at a time, the witness to the receipt and the record.
#    It holds under the opening story, under the table's history ("like a receipt"), under the seven days the old files are kept,
#    let go where the seven days end, under her no on her record, under the receipt in Kanesh again, and at the end. (A chamber organ
#    was the first partner; it was dropped because From a branch to production, in this module, leads with a chamber barrel organ.)
#  - Keys: E-flat major, tuned pure from E-flat (see hz()); C minor under the problem in Kanesh, from "But paying the debt" to
#    "Something has to be done", where the voice holds G and lets it fall to E-flat as the tablet breaks.
# The rules the module keeps (its briefs, 5 November 2026):
#  - Music only from time to time: under the opening story (The note that turns up and Broken, or void, to the title), and after it
#    only at a chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks
#    how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no roll on the bars, no ostinato. No urgent pulse: nothing in this film
#    is an error or a rush (film.json's "urgent" is empty). One voice, so nothing beats; its notes tuned pure, and no F with A-flat or C.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed: change one, change both. A burst on
#    screen (eight contract chips, eight year boxes) is one soft sound, never one for each.
# And everything stays low and soft, below about 2.5 kHz: a tablet set on a wooden shelf, packs of tin and rolls of cloth set down,
# silver bars on a scale, a stylus pressing clay, clay pressed and a cylinder seal rolled across it, a tablet breaking (one sound), a
# stamp, a muffled key as a line or code types in, a soft glass knock as a pane or card settles, the shards' one soft fall, a lock's
# click, a breath of air as frost deepens or a file thaws, pencil ticks on the timeline, a pen struck through a row, a paper slide.

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
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1900)  # this film's own randomness: the room, the bars, the clay, the paper

# ---- tuning: just intonation from E-flat, so the notes are whole-number ratios of each other and nothing beats. E-flat major (E-flat
# G B-flat), A-flat major, B-flat major, C minor and G minor are pure in this table; F with C (40/27) and F with A-flat (32/27) are not,
# so the voice never holds F
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (51, 155.563)  # E-flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Eb2, G2, Ab2, Bb2, C3 = 39, 43, 44, 46, 48                                     # the voice's notes
Eb3, F3, G3, Ab3, Bb3, C4, D4, Eb4, F4, G4, Ab4, Bb4 = 51, 53, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70  # the bars'
HERS = Bb3  # Linh's row, wherever a copy of it is
MARK = [Bb3, Eb4, G4, F4, D4, Eb4]  # the mark: one note for each copy, the last coming home

# ---- the levels, set so the music's loud moments sit under the limits tools/quiet.py takes from the governance films the author
# accepted; the voice a little under the bars at their strike; the effects about 16 dB under the music (FX scales them all)
SL, HL, FX = 0.052, 0.038, 1.9

# ---- the room: the merchant's room and the hall at night, small, ringing on for about a second and a quarter, nothing much above
# 1.7 kHz. Its level is set by what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is played
# into it as it's sung and set back to its own level after it (_held), as the video guidelines ask (held.py checks both)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.25)).astype(np.float32))(np.arange(int(1.25 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
ROOM = 0.24  # how much of the room each held note carries; the bars carry less, as they're short and dry
def _room(sig, amt):
    return np.pad(sig, (0, len(_IR) - 1)) + amt * fftconvolve(sig, _IR).astype(np.float32) if amt else sig
def _held(sig, amt):
    """a held note in the room, at its own level: the room's echoes meet a held note's own sound at its pitch, adding to it on one
    note and taking from it on another, so the note is set back to the level it had without the room, where it's held (within 3 dB
    of its own level, after its first quarter second), as tools/quiet.py measures it"""
    out = _room(sig, amt); h = SR // 100; k = len(sig) // h
    if not amt or k < 35:
        return out
    dry = (sig[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1); wet = (out[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1)
    lv = np.convolve(dry, np.ones(10) / 10, 'same')[25:]; on = np.nonzero(lv >= lv.max() * 10 ** -0.3)[0] + 25
    return out * np.float32(np.sqrt(dry[on].sum() / max(1e-12, wet[on].sum())))

# ---- the straw fiddle. A loose wooden bar, not tuned under its middle as an orchestra's bars are, so its overtones aren't harmonics
# (a free bar's, at 2.756, 5.404 and 8.933 times its tone), each dying faster than the one under it; the straw under the bar takes its
# ring at once, so the bar's own tone is gone in about a fifth of a second (a low bar a little later). The small wooden beater's touch:
# a dry tick, short, its top rolled off; and the straw's soft, low give under the bar. soft < 1: a lighter stroke, with less of the
# overtones. Nothing above 2.4 kHz
def straw(m, s, g=1.0, pan=0.0, soft=1.0):
    f = hz(m); low = max(0.0, min(1.0, (420 - f) / 260)); tau = 0.075 + 0.06 * low
    sec = 0.7; x = tt(sec).astype(np.float64)
    sig = np.sin(2 * np.pi * f * x) * np.exp(-x / tau)
    for r, a, d in ((2.756, 0.30, 0.40), (5.404, 0.10, 0.22), (8.933, 0.035, 0.12)):
        if f * r < 2300:
            sig = sig + a * soft * np.sin(2 * np.pi * f * r * x + 0.6 * r) * np.exp(-x / (tau * d))
    nt = int(0.012 * SR); sig[:nt] += filt(noise(0.012)[:nt], 'band', (500, 1900)) * np.exp(-np.arange(nt) / SR / 0.0025) * 0.10 * soft
    sig = sig + 0.10 * np.sin(2 * np.pi * 140 * x + 0.4) * np.exp(-x / 0.025)
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.002)) ** 2 * np.cos(0.5 * np.pi * np.clip((x - sec + 0.1) / 0.1, 0, 1)) ** 2
    sig = filt((sig / max(1e-9, float(np.abs(sig).max()))).astype(np.float32), 'low', 2400)
    put(_room(sig, 0.12), s, g * SL * (0.75 + 0.25 * soft), pan)
def bars(notes, s, step=0.4, g=1.0, pan=0.0, spread=0.18, soft=1.0):
    """bars struck one after another, step apart; a note None is a rest, where a bar is left unstruck"""
    k = len(notes)
    for i, m in enumerate(notes):
        if m is not None:
            straw(m, s + step * i, g, pan + spread * (i / max(1, k - 1) - 0.5), soft)

# ---- the hummed voice. A hum is a voice with the lips closed: every harmonic of its pitch, falling away above the first few (a soft
# voice's source), shaped by the nose's resonance (near 265 Hz for this low voice), two weak ones above it, and a dip where the closed
# mouth swallows the sound (near 850 Hz); the harmonics above about 2.3 kHz are left out, and those under about 100 Hz a little
# weakened, so its low notes carry on a phone's small speaker, through their harmonics. A little air through the nose as each note
# starts; the pitch rises from a few cents under in its first twentieth of a second, as a voice finds its note, and then holds, with no
# vibrato; the level drifts by a few per cent, slowly and unevenly, as a held breath does. (Made as Who does what, end to end made its
# four voices; here there is one.) A note ends when the voice lets it go: no swell, no fade longer than a breath
VOX = ((265, 220), [(1050, 380, 0.14), (2050, 480, 0.045)], (850, 260), 0.12)
def _harm(f, soft=1.0):
    """the weights of a hummed note's harmonics, at f Hz (soft < 1: darker)"""
    (c1, b1), up, (cz, bz), _ = VOX; n = max(1, int(2300 // f)); k = np.arange(1, n + 1); fk = f * k
    r = 1 / np.sqrt(1 + ((fk - c1) / (b1 / 2)) ** 2) + sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in up) + 0.01
    r = r * (1 - 0.8 * np.exp(-((fk - cz) / (bz / 2)) ** 2))
    a = r * k ** -(0.85 + 0.6 * (1 - soft)) * np.clip((2300 - fk) / 300, 0, 1) * (fk / 100) / np.sqrt(1 + (fk / 100) ** 2)
    return a / np.sqrt((a ** 2).sum())
def hum(segs, g=1.0, soft=0.9, att=None, rel=0.22, pan=0.06):
    """the voice's line: segs is [(start, end, note)], each note slurred into the next"""
    T0, T1 = segs[0][0], segs[-1][1]; att = att or VOX[3]; gl = 0.07
    assert all(b > a for a, b, _ in segs), 'the voice: a note ends before it starts, %s' % [(round(a, 2), round(b, 2), m) for a, b, m in segs]
    assert all(m != 41 and m != 53 for _, _, m in segs), 'the voice never holds F'
    n = int((T1 - T0 + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    fs = [hz(m) for _, _, m in segs]; A = [_harm(f, soft) for f in fs]; K = max(len(a) for a in A)
    A = [np.pad(a, (0, K - len(a))) for a in A]
    kx, kf, ka = [], [], []
    for i, (a, b, m) in enumerate(segs):  # each note steady between short glides, its harmonics' weights with it
        for t in ((a - T0 + gl / 2 if i else 0.0), (b - T0 - gl / 2 if i < len(segs) - 1 else n / SR)):
            kx.append(t); kf.append(np.log2(fs[i])); ka.append(A[i])
    lf = np.interp(x, kx, kf) + np.log2(1 - 0.009 * np.exp(-x / 0.05))
    ph = 2 * np.pi * np.cumsum(2 ** lf) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > T1 - T0, np.cos(0.5 * np.pi * np.minimum((x - (T1 - T0)) / rel, 1)) ** 2, 1.0)
    dr = filt(R1.standard_normal(n).astype(np.float32), 'low', 0.8); dr = 1 + 0.04 * dr / (np.abs(dr).max() + 1e-9)  # the breath's drift
    ka = np.array(ka); s = np.zeros(n)
    for j in range(K):  # the higher harmonics come in a little after the lower and go a little before: softer is darker
        aj = np.interp(x, kx, ka[:, j])
        if aj.max() > 1e-4:
            s += aj * e ** (1 + 0.12 * j) * np.sin((j + 1) * ph + 0.7 * j * j)
    s = s * dr + 0.010 * filt(noise(n / SR + 0.01)[:n], 'band', (200, 1400)) * e * dr * (1 + 3 * np.exp(-x / 0.06))
    put(_held(filt(s.astype(np.float32), 'low', 2300), ROOM), T0, g * HL, pan)
def held(m, a, b, g=1.0, **o):
    """one held note, from a to b"""
    hum([(a, b, m)], g, **o)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft wooden knock"""
    s_knock(s, g * FX, pan, f)
def glass(s, g=0.010, pan=0.0):
    """a card or a pane settling on glass: a soft, low knock and a small, pure tick, low for glass"""
    x = tt(0.18)
    X(norm(filt((np.sin(2 * np.pi * 300 * x) * np.exp(-x * 40) + 0.35 * np.sin(2 * np.pi * 1180 * x) * np.exp(-x / 0.02)).astype(np.float32), 'low', 2000)), s, g * FX, pan)
def pill(s, g=0.007, pan=0.0):
    """a pill or a tag set on a pane: the small tick alone"""
    x = tt(0.09); X((np.sin(2 * np.pi * 1320 * x) * np.exp(-x / 0.016) * 0.6 + filt(noise(0.09), 'band', (600, 1900))[:len(x)] * np.exp(-x / 0.005)).astype(np.float32), s, g * FX, pan)
def typekey(s, g=0.009, pan=0.0):
    """a key, heard softly"""
    s_tap(s, g * FX, pan); s_knock(s + 0.004, g * 0.5 * FX, pan, 520)
def typed(s, n, g=0.009, pan=0.0, step=0.13):
    """a line typing in: a few keys, unevenly, the later ones softer"""
    for i in range(n):
        typekey(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.75, pan)
def air(s, sec=0.8, g=0.007, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, or frost settling"""
    s_air(s, sec, g * FX, pan, lo, hi)
def chink(s, g=0.006, pan=0.0):
    """a silver bar set on the scale's pan: a small, dull metal touch, its ring held short, its top rolled off"""
    x = tt(0.16); X(norm(filt((np.sin(2 * np.pi * 760 * x) * np.exp(-x / 0.035) + 0.5 * np.sin(2 * np.pi * 1730 * x + 1) * np.exp(-x / 0.018)
                             + 0.4 * np.sin(2 * np.pi * 210 * x) * np.exp(-x / 0.02)).astype(np.float32), 'low', 2200)), s, g * FX, pan)
def pack(s, g=0.014, pan=0.0):
    """a pack of tin ingots, wrapped, set down on packed earth: a dull, low thud, and the wrapping's rustle"""
    s_knock(s, g * FX, pan, 120); x = tt(0.25); X(filt(noise(0.25), 'band', (250, 1400))[:len(x)] * np.exp(-x / 0.06), s + 0.01, g * 0.35 * FX, pan)
def cloth(s, g=0.010, pan=0.0):
    """a roll of cloth set down: a soft, padded thump"""
    x = tt(0.3); X(filt(noise(0.3), 'band', (90, 600))[:len(x)] * np.sin(np.pi * np.minimum(1, x / 0.3)) ** 3, s, g * FX, pan)
def stylus(s, sec, g=0.006, pan=0.0, n=5):
    """a reed stylus pressing wedges into soft clay: a few small, dull presses, unevenly, never quite in time"""
    t = 0.0
    for i in range(n):
        x = tt(0.07); X(filt(noise(0.07), 'band', (180, 900))[:len(x)] * np.sin(np.pi * x / 0.07) ** 2, s + t, g * (1.0 if i < 2 else 0.8) * FX, pan)
        t += sec / n * R1.uniform(0.8, 1.15)
def press(s, g=0.010, pan=0.0, sec=0.45):
    """soft clay pressed round the tablet: a low, damp squeeze"""
    x = tt(sec); X(filt(noise(sec), 'band', (110, 650))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def sealroll(s, sec, g=0.008, pan=0.0):
    """a stone cylinder seal rolled across clay: a low, even roll with a little grain, slowing at its end"""
    x = tt(sec); r = filt(R1.standard_normal(len(x)).astype(np.float32), 'low', 9); r = 0.75 + 0.25 * r / (np.abs(r).max() + 1e-9)
    X(filt(noise(sec), 'band', (140, 850))[:len(x)] * np.sin(np.pi * x / sec) ** 0.8 * r * np.linspace(1, 0.75, len(x)), s, g * FX, pan)
def shelf(s, g=0.014, pan=0.0):
    """a clay tablet set on a wooden shelf: a small, dull knock of clay on wood"""
    s_knock(s, g * FX, pan, 190); x = tt(0.1); X(filt(noise(0.1), 'band', (300, 1500))[:len(x)] * np.exp(-x / 0.02), s + 0.003, g * 0.3 * FX, pan)
def slide(s, g=0.008, pan=0.0, sec=0.5):
    """clay or a sheet slid across wood: a low, smooth slide"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def breakclay(s, g=0.016, pan=0.0):
    """a dried clay tablet broken on the floor: one low, dull crack and its pieces settling, as one sound"""
    sec = 0.6; x = tt(sec)
    sig = np.sin(2 * np.pi * 115 * x) * np.exp(-x / 0.05) + 0.9 * filt(noise(sec), 'band', (180, 1500))[:len(x)] * np.exp(-x / 0.05)
    for d, a in ((0.11, 0.35), (0.19, 0.22), (0.31, 0.12)):  # the pieces, settling within the one sound
        sig = sig + a * filt(noise(sec), 'band', (250, 1400))[:len(x)] * np.exp(-np.maximum(0, x - d) / 0.02) * (x >= d)
    X(norm(filt(sig.astype(np.float32), 'low', 1800)), s, g * FX, pan)
def stamp(s, g=0.016, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def crack(s, g=0.009, pan=0.0):
    """a tablet of frosted glass cracking: a short, dry split, its top rolled off"""
    x = tt(0.14); X(norm(filt((filt(noise(0.14), 'band', (600, 2100))[:len(x)] * np.exp(-x / 0.02) + 0.5 * np.sin(2 * np.pi * 420 * x) * np.exp(-x / 0.015)).astype(np.float32), 'low', 2200)), s, g * FX, pan)
def shards(s, g=0.010, pan=0.0):
    """the old file cracking into shards that fade: one split, and the pieces' one soft fall"""
    sec = 0.9; x = tt(sec)
    sig = filt(noise(sec), 'band', (600, 2000))[:len(x)] * np.exp(-x / 0.025) + 0.45 * filt(noise(sec), 'band', (300, 1600))[:len(x)] * np.sin(np.pi * np.clip((x - 0.08) / 0.8, 0, 1)) ** 2
    X(norm(filt(sig.astype(np.float32), 'low', 2100)), s, g * FX, pan)
def lock(s, g=0.009, pan=0.0):
    """a lock's soft click: its bolt, and the case under it"""
    x = tt(0.12); X(norm(filt((np.sin(2 * np.pi * 620 * x) * np.exp(-x / 0.008) + 0.7 * np.sin(2 * np.pi * 410 * x) * np.exp(-np.maximum(0, x - 0.03) / 0.012) * (x >= 0.03)).astype(np.float32), 'low', 1800)), s, g * FX, pan)
def pencil(s, g=0.008, pan=0.0, sec=0.14):
    """a pencil stroke on paper: a soft scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def tick(s, g=0.008, pan=0.0):
    """a tick: two quick pencil strokes"""
    pencil(s, g, pan, 0.10); pencil(s + 0.11, g * 0.85, pan, 0.16)
def strike(s, g=0.008, pan=0.0, sec=0.5):
    """a row struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def paper(s, g=0.009, pan=0.0, sec=0.5):
    """a sheet slid across a desk: a low, smooth slide and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1100))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
    s_knock(s + sec * 0.9, g * 0.5 * FX, pan, 170)

# =========================================================================================== 1. The note that turns up (the opening)
# Kanesh at night, in E-flat; C minor from "But paying the debt". The voice holds the record's notes, the bars set the tablets down
def _w(lid, word, off=0):
    return W('tablet', lid, word, off)
o1 = S0('tablet')
tb = max(W('void', 'broken', 'hands', -0.2) + 1.3, W('void', 'broken', 'broken', -0.1))  # the scene's tb: when the tablet breaks
# the voice breathes between its phrases (a rest of a third of a second or more), as a singer would
hum([(o1 + 0.4, _w('merchants', 'Merchants', -0.6), Eb2)], att=0.9)
hum([(_w('merchants', 'Merchants', -0.25), _w('merchants', 'tin'), Ab2), (_w('merchants', 'tin'), _w('lend', 'lend'), Bb2),
     (_w('lend', 'lend'), END('tablet', 'lend') + 0.6, Eb2)], att=0.5)
bars([Bb3, Eb4, F4, G4], o1 + 0.7, 0.3)                                           # the room at night, before the voice
bars([F4, Eb4, Bb3], _w('merchants', 'weeks', -0.1), 0.36, 0.8, px(1500))         # "Ashur · weeks away", far off
pack(_w('merchants', 'tin'), pan=px(760)); cloth(_w('merchants', 'cloth'), pan=px(1120))
bars([C4, Eb4], END('tablet', 'merchants') + 0.15, 0.35, 0.8)                     # the goods set down
for i in range(3):                                                                # three silver bars settle on the scale
    chink(_w('lend', 'silver', -0.2 + 0.35 * i + 0.3), pan=px(1180))
glass(_w('written', 'who', -0.1), pan=px(456))                                    # "A loan, in clay"
stylus(_w('written', 'clay'), END('tablet', 'written') + 0.2 - _w('written', 'clay'), pan=px(980))
bars([G3, Bb3, C4], END('tablet', 'written') + 0.1, 0.32, 0.85)
press(_w('sealed', 'envelope', -0.1), pan=px(980))                                # the envelope closes
sealroll(_w('sealed', 'rolled'), 1.6, pan=px(980))                                # and the seal rolls across it
glass(_w('sealed', 'nobody', -0.1), pan=px(456))
bars([Bb3, G3], END('tablet', 'sealed') + 0.1, 0.4, 0.8)
glass(_w('keeps', 'proof', -0.1), pan=px(406))                                    # "The proof of the debt"
straw(Eb4, _w('keeps', 'keeps', 1.85), 1.0, px(1200)); shelf(_w('keeps', 'keeps', 1.85), pan=px(1200))  # up on the shelf: one note
# "But paying the debt": C minor, the silver paid back, the tablet still on its shelf for years
hum([(_w('away', 'paying', -0.1), _w('shelf', 'sit'), C3), (_w('shelf', 'sit'), _w('shelf', 'house', -0.3), Ab2),
     (_w('shelf', 'house', -0.3), _w('twice', 'turns'), G2)], att=0.6)
hum([(_w('twice', 'turns', 0.3), _w('twice', 'pays'), C3), (_w('twice', 'pays'), _w('risk', 'Every'), Ab2),
     (_w('risk', 'Every'), G('tablet', 'done', -0.25), C3)], att=0.5)
# "Something has to be done": the voice holds G, and nothing else plays, until the tablet breaks and it falls to E-flat
hum([(G('tablet', 'done'), tb, G2), (tb, W('void', 'receipt', 'handed', -0.3), Eb2)], att=0.6)
for i in range(2):
    chink(_w('away', 'paying', 0.3 + 0.35 * i), 0.005, px(1180))
bars([Eb4, D4, C4], END('tablet', 'away') + 0.05, 0.35, 0.85)                     # the tablet stays
bars([C4, Bb3, G3], END('tablet', 'shelf') + 0.05, 0.4, 0.8, px(1100))            # in Ashur, for years
slide(_w('twice', 'turns'), 0.007, px(1000), 0.5)                                 # it turns up: lifted from the shelf
bars([G3, Ab3], _w('twice', 'turns', 0.1), 0.35, 0.85)
straw(C4, _w('twice', 'claim'), 0.9)                                              # claimed again
glass(_w('twice', 'claim', 0.2), pan=px(416))
bars([Eb4, C4], END('tablet', 'twice') + 0.1, 0.42, 0.8)
bars([C4, D4, Eb4], _w('risk', 'Every', 0.2), 0.45, 0.75, px(960), 0.3)           # every borrower's shelf, rimmed

# =========================================================================================== 2. Broken, or void (the opening)
def _v(lid, word, off=0):
    return W('void', lid, word, off)
o2 = S0('void')
slide(_v('broken', 'hands', -0.2), 0.006, px(900), 1.0)                          # handed back, down to the table
knock(_v('broken', 'hands', 1.0), 0.010, px(980), 200)
breakclay(tb, pan=px(980))                                                        # and broken: one sound
hum([(_v('receipt', 'handed', 0.1), _v('void', 'any', -0.3), Ab2), (_v('void', 'any', -0.3), _v('stays', 'stays', -0.7), Bb2)], att=0.5)
hum([(_v('stays', 'stays', -0.35), END('void', 'found') + 0.3, Eb2)], att=0.5)
bars([Bb3, Eb4, G4], END('void', 'broken') + 0.1, 0.3, 0.9)                      # "Paid", handed back
glass(_v('broken', 'broken', 0.2), pan=px(406))
straw(F4, _v('receipt', 'Ashur'), 0.8, px(1500))                                  # the old tablet, still in Ashur
straw(Eb4, _v('receipt', 'receipt'), 1.0, px(1150)); knock(_v('receipt', 'receipt'), 0.010, px(1150), 210)  # the receipt set down
sealroll(_v('receipt', 'sealed'), 1.4, pan=px(1150))
glass(_v('void', 'any', -0.2), pan=px(446))
stamp(_v('void', 'void', 0.1), pan=px(1100)); straw(Bb3, _v('void', 'void', 0.1), 0.8, px(1100))  # "Void"
bars([D4, Eb4], END('void', 'void') + 0.15, 0.4, 0.85)
glass(_v('stays', 'nobody', -0.1), pan=px(406))
bars([G3, Bb3, Eb4], END('void', 'stays') + 0.1, 0.34, 0.8)
glass(_v('found', 'More', 0.2), pan=px(446))
# the hall: the shelf's tablets become frosted panes, one note for each copy (the mark)
hum([(END('void', 'found') + 0.7, _v('still', 'old', -0.5), Bb2)], att=0.8)
hum([(_v('still', 'old', -0.15), _v('deleted', 'stays', -0.4), C3)], att=0.6)
hum([(_v('deleted', 'stays', -0.05), E('void') - 0.6, Eb2)], att=0.6)
bars(MARK, _v('same', 'Data', -0.1), 0.4, 0.9, px(820), 0.3)
glass(_v('writes', 'writes', -0.2), pan=px(830)); typed(_v('writes', 'writes'), 4, pan=px(830))  # "DELETE · her row"
pill(_v('writes', 'gone'), pan=px(1180))                                          # "Gone"
crack(_v('still', 'broken'), pan=px(520)); crack(_v('still', 'broken', 0.35), 0.008, px(640))  # two old copies crack
straw(G3, _v('still', 'never'), 0.7, px(760))                                     # the rest grey: never used again
pill(_v('deleted', 'stays'), pan=px(960))                                         # "Stays deleted"
bars([Eb4, Bb3, G3, Eb3], G('void', 'breath') + 0.3, 0.45, 0.85)                 # into the title, home

# =========================================================================================== 3. A delete writes a receipt
def _r(lid, word, off=0):
    return W('receipt', lid, word, off)
glass(_r('linh', 'Linh'), pan=px(1120)); glass(_r('asked', 'asked'), 0.009, px(1160)); glass(_r('logged', 'logged'), 0.009, px(1160))
pill(_r('logged', 'approved'), pan=px(1380))
knock(G('receipt', 'night', 0.3), 0.008, px(1120), 300); air(_r('night', 'job'), 0.5, 0.005, px(1120))  # the job's badge, at one
glass(_r('wed', 'Wednesday', -0.2), 0.009, px(620))                              # inside: the list
straw(HERS, _r('wed', 'deletes', -0.5), 0.9, px(620))                             # her row, lit: a copy, one note
air(_r('wed', 'deletes', 0.1), 1.2, 0.006, px(700))                               # and it slides out; it never sounds again
glass(_r('history', 'history', -0.3), 0.009, px(1490)); typed(_r('history', 'history'), 4, pan=px(1490))
held(Eb2, _r('history', 'receipt'), END('receipt', 'history') + 1.0, att=0.5)    # "like a receipt": the voice, for a moment
typed(_r('versions', 'versions'), 3, 0.007, px(1490))
straw(HERS, _r('versions', 'versions', 0.05), 0.85, px(1490))                     # v51, still with her: a copy
glass(_r('ask', 'Ask', -0.1), 0.009, px(620)); typed(_r('ask', 'Ask'), 5, pan=px(620))
pill(_r('ask', 'there'), pan=px(1300))                                            # "She's there"
glass(G('receipt', 'marks'), 0.009, px(520))                                      # a file of the table
pencil(_r('save', 'marks'), 0.007, px(560))                                       # marked deleted
glass(_r('rewrites', 'rewrites', -0.2), 0.008, px(620)); typed(_r('rewrites', 'rewrites'), 4, pan=px(620))
straw(Eb4, _r('rewrites', 'rewrites', 0.3), 0.9, px(900)); glass(_r('rewrites', 'rewrites', 0.3), 0.007, px(900))  # the new file
pill(_r('seven', 'seven', -0.1), pan=px(1400))                                    # "Old files kept 7 days"
glass(_r('vacuum', 'vacuum', -0.1), 0.008, px(620)); typed(_r('vacuum', 'vacuum'), 3, pan=px(620))
held(Eb2, _r('vacuum', 'each'), _r('dec', 'hers'), att=0.6)                       # seven days kept, let go where they end
shards(_r('dec', 'hers'), pan=px(520))                                            # 2 Dec: the old file, in shards
glass(G('receipt', 'back', -0.2), 0.008, px(620)); typed(G('receipt', 'back'), 4, 0.007, px(620))
pill(_r('back', 'query', 0.2), pan=px(1300))                                      # "Those files are gone"

# =========================================================================================== 4. Delete where it starts
def _s(lid, word, off=0):
    return W('source', lid, word, off)
glass(_s('rebuilt', 'semester', -0.3), 0.009, px(850))                           # HR's system
air(_s('rebuilt', 'rebuilt'), 0.5, 0.005, px(1180))                               # the line to the list
straw(HERS, _s('yes', 'straight', -0.3), 0.75, px(1545), 0.6)                     # her row again, dashed: what a rebuild would do
glass(_s('ingrid', 'Ingrid'), 0.008, px(280))
held(Bb2, _s('ingrid', 'puts'), _s('ingrid', 'puts', 2.4), att=0.5)               # her no, on her record
paper(_s('ingrid', 'puts'), 0.006, px(990), 0.35)
pill(_s('follows', 'follows'), pan=px(1440))                                      # "Every table follows"
glass(G('source', 'adds'), 0.009, px(600))                                        # the send log
pill(_s('adds', 'adds', 0.1), pan=px(1300))                                       # "Only ever adds rows"
bars([HERS, G3], _s('own', 'delete', -0.6), 0.3, 0.85, px(600), 0.1)              # her two rows, lit
air(_s('own', 'delete'), 1.2, 0.006, px(700))                                     # and gone
pill(_s('own', 'delete', 0.2), pan=px(1300))
glass(_s('names', 'names', 0.05), 0.008, px(1480)); typed(_s('names', 'names', 0.1), 6, pan=px(1480), step=0.26)
lock(_s('restricted', 'restricted', 0.2), pan=px(1180))                           # the keys, under frost and a lock
pill(_s('code', 'request'), 0.006, px(1380))
bars([F4, Eb4], END('source', 'code') + 0.3, 0.4, 0.85)                           # named by the request alone

# =========================================================================================== 5. Every copy
def _c(lid, word, off=0):
    return W('copies', lid, word, off)
glass(_c('shows', 'shows', -0.3), 0.009, px(960))                                 # the lineage
bars([Eb3, G3, Bb3], _c('shows', 'shows'), 0.4, 0.85, px(700), 0.6)               # each line drawn
pill(_c('shows', 'tag'), pan=px(940))                                             # the tags
air(_c('leaves', 'leaves'), 0.8, 0.005, px(1360))                                 # out of the platform
glass(_c('leaves', 'mailing', -0.1), 0.008, px(970)); straw(HERS, _c('leaves', 'mailing'), 0.8, px(970))  # the tool's copy
slide(_c('drops', 'drops'), 0.006, px(970), 1.0)                                  # dropped at four
pill(_c('drops', 'four', -0.1), pan=px(820))
glass(_c('contract', 'contract'), 0.008, px(1020))
# the locked copies, made each night: one note for each, the oldest first; the first three hold her row
COPIES = [HERS, C4, Eb4, F4, G4]
bars(COPIES, _c('apart', 'copy'), 0.3, 0.85, px(560), 0.2)
air(_c('apart', 'goes'), 1.4, 0.005, px(1000))
lock(_c('apart', 'locked'), pan=px(560))
pill(_c('early', 'delete'), pan=px(1100))                                         # "Can't be deleted early"
pill(_c('use', 'out'), pan=px(1100))                                              # "Out of use"
bars([None, None] + COPIES[2:], _c('use', 'removed'), 0.3, 0.85, px(560), 0.2)    # two go: their notes are left out
pill(_c('last', 'last'), pan=px(1100))                                            # "Goes 24 Dec"
slide(_c('restored', 'restored'), 0.006, px(900), 1.4)                            # a copy restored
pill(_c('restored', 'applies', -0.3), pan=px(1440)); glass(_c('restored', 'applies'), 0.008, px(1050))
strike(_c('restored', 'answered'), pan=px(680))                                   # her row struck out before anyone reads it
knock(_c('void', 'receipt'), 0.010, px(1150), 210)                                # the receipt from Kanesh
held(Eb2, _c('void', 'receipt'), END('copies', 'void') + 1.2, att=0.6)
stamp(_c('void', 'void', 0.1), pan=px(1365))                                      # "Void"

# =========================================================================================== 6. Cold, until its day
def _k(lid, word, off=0):
    return W('cold', lid, word, off)
bars([Eb3, G3], S0('cold') + 0.25, 0.42, 0.8)                                     # the vault, deep under frost
air(G('cold', 'stay', 0.5), 0.6, 0.004, px(700), 300, 1400)                       # her contracts, all at once: one soft sound
glass(_k('pay', 'law', -0.1), 0.008, px(960))
air(G('cold', 'closed'), 1.0, 0.006, px(960), 200, 1500)                          # the pay records under frost
lock(G('cold', 'closed', 0.2), 0.008, px(140))
pill(_k('closed', 'only'), pan=px(500))
glass(G('cold', 'tier'), 0.008, px(960))                                          # the storage's tiers
straw(HERS, G('cold', 'gone'), 0.85, px(700))                                     # "But cold isn't gone": her records, lit
air(G('cold', 'sorted', 0.15), 0.6, 0.004, px(960), 300, 1400)                   # the years, as boxes: one soft sound
slide(_k('sorted', 'year', -0.6), 0.005, px(900), 1.2)
air(_k('january', 'back'), 1.6, 0.006, px(210), 120, 700)                         # 2019 brought back, thawing
straw(Eb3, _k('whole', 'deletes', 0.2), 0.85, px(210)); air(_k('whole', 'deletes', 0.2), 0.9, 0.004, px(210))  # deleted, whole
bars([Bb3, Ab3, G3, Eb3], _k('steps', 'January'), 0.5, 0.8, px(1180), 0.4)        # her four Januaries

# =========================================================================================== 7. Out of the logs
def _l(lid, word, off=0):
    return W('logs', lid, word, off)
glass(S0('logs') + 0.6, 0.008, px(280)); glass(G('logs', 'type', 0.6), 0.008, px(1190))  # Jun, and the query history
pill(_l('year', 'year'), pan=px(640)); pill(_l('year', 'edit'), 0.006, px(900))
typed(_l('typed', 'typed'), 4, 0.006, px(900))                                    # had someone typed her email (dashed: never was)
pill(_l('typed', 'admins'), pan=px(1450))
for i in range(3):                                                                # the request named: each row ticked
    tick(_l('name', 'request', 0.2 + 0.4 * i), 0.007, px(1800))
bars([G3, Bb3, Eb4], _l('name', 'request', 0.2), 0.4, 0.8, px(1500), 0.3)
air(G('logs', 'agents', 0.1), 0.6, 0.004, px(330))                                # the agent
glass(G('logs', 'trace'), 0.008, px(1190)); glass(_l('trace', 'gateway'), 0.008, px(1190))
bars([Eb4, Bb3], _l('masked', 'masked', 0.4), 0.45, 0.8, px(1100))                # the address masked before it's saved
pill(_l('masked', 'deleted'), pan=px(1500))                                       # "Deleted after 30 days"
paper(G('logs', 'ticket'), pan=px(650))                                           # the ticket
pill(_l('clone', 'edits'), 0.006, px(1100)); pill(_l('clone', 'commit'), 0.006, px(1300))
bars([Bb3, D4, F4], _l('clone', 'copied', 0.5), 0.35, 0.8, px(1500), 0.3)        # the commit, copied to every clone

# =========================================================================================== 8. Gone
def _g(lid, word, off=0):
    return W('gone', lid, word, off)
o8 = S0('gone')
air(o8 + 0.2, 1.6, 0.004, px(960))                                                # the timeline
bars(MARK, o8 + 0.25, 0.4, 0.85, px(700), 0.4)                                    # the mark, whole, once more
tick(G('gone', 'dec', 0.6), 0.007, px(330))                                       # 2 Dec
for w in ('list', 'send', 'old', 'mailing'):                                      # the list, the send log, every old file, the tool
    tick(_g('dec', w), 0.006, px(330))
tick(G('gone', 'locked', 0.6), 0.007, px(900))                                    # 24 Dec
bars(MARK[4:], _g('locked', 'last', -0.4), 0.4, 0.85, px(900))                    # the mark's last two notes: the last locked copy
tick(_g('locked', 'last'), 0.006, px(900))
held(Eb2, _g('locked', 'last'), G('gone', 'date'), att=0.7)                       # and the voice, held, until every date has passed
tick(G('gone', 'pay', 0.6), 0.007, px(1600))                                      # Jan 2034
straw(MARK[-1], _g('pay', 'last'), 0.8, px(1600)); tick(_g('pay', 'last'), 0.006, px(1600))  # the last note alone: then nothing
pill(_g('date', 'record', -0.2), pan=px(960))                                     # every step on the record
# Kanesh again: the broken tablet and the receipt, side by side
hum([(G('gone', 'kanesh'), _g('kanesh', 'broken', -0.5), Ab2), (_g('kanesh', 'broken', -0.5), _g('kanesh', 'void', 0.9), Eb2)], att=0.6)
straw(G3, _g('kanesh', 'broken'), 0.8, px(860)); straw(Eb4, _g('kanesh', 'void'), 0.85, px(1120))
glass(G('gone', 'off', 0.3), 0.008, px(1320)); pill(_g('off', 'off'), pan=px(960))  # the list, without her: "Off the list"
# the end: the mark's first two notes, over the voice's E-flat, let go before the film's last seconds fade (tools/audio.py fades
# the last 3.5 s), so the note ends as the voice lets it go, and then nothing
held(Eb2, END('gone', 'last') + 0.3, E('gone') - 3.6, att=0.8)
bars(MARK[:2], G('gone', 'breath', 0.5), 0.42, 0.85)
