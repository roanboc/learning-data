# Rules and expectations the business owns: the music and sounds, played by tools/audio.py with From words to data's helpers
# (shared/tools/music.py). Its palette (the topic's palettes.md, and decided.md): a flugelhorn and a tenor saxophone, two instruments the
# site already has but no film pairs, and no film of this topic plays, since nothing new fitted (the film's assumptions file says so, and
# why). Two winds, nothing struck or plucked: a note sounds only while someone keeps breathing into it, as a rule lasts only while people
# keep it.
#  - The lead: a flugelhorn, soft and plain (A 3 to E 5). A valved bugle with a wide, conical bore, so its note is dark and round, its
#    fundamental strongest and its few higher partials soft. Each note is tongued softly: the lip settles onto it from a few cents under
#    in its first hundredths of a second, its higher partials speak a moment after its lower, and a breath of air comes with it; then it
#    holds at one level, no vibrato, and stops as the player lets it go. One note at a time. The bugle's calls were signals every player
#    and listener agreed on, each sounded at its proper time, as the mirab kept each farmer's turn: it carries the opening story's line,
#    a note as each thing lands, and the film's figure.
#  - Its partner: a tenor saxophone, low and soft (A 2 to A 4), breathed under the flugelhorn. A single reed on a conical brass body, so
#    every harmonic of its pitch sounds, shaped by the instrument's own resonances (near 430 Hz, 900 Hz and 1.65 kHz), with more air in
#    its note than the brass, a little more as it starts; its pitch settles from a few cents under in its first hundredth of a second,
#    then holds, no vibrato. One note at a time. The steady line under the flugelhorn. Kept apart from Who creates it, who owns it's
#    clarinet, also a single reed in these notes: the saxophone's every harmonic makes it rounder and reedier than the clarinet's hollow
#    chalumeau.
#  - The film's own figure, eight, eight and nine: D, D and E, the E 9/8 of the D, as the shares were set. The flugelhorn plays it where
#    the engineer sets the shares, where the expectation is set first at the utility, as Sehdeh's outlets light again, and where the
#    shares held for three hundred years; the saxophone plays it an octave lower where a dry year gives each hamlet less, but the same
#    share (the same ratio, lower).
#  - The series' mark: the three layers, the business layer between the other two: the flugelhorn plays D, then A, and the saxophone
#    holds the F sharp between them. Under the title, and again under the end card.
#  - Its sounds: the desert's wind; the water in the qanat's channels, one soft texture, falling in a dry year; the silt washing in, and
#    the tunnel choking; the diggers' windlass and pick; the fields' gates and the water let in; the deep well's steel and its motor pump,
#    a low, steady rumble; and at the utility, cards, paper, a pen, a stamp, and knocks and taps as things are set on the wall.
# Nothing Persian is borrowed for the story: no santur or other hammered dulcimer, no ney, no kamancheh, no lute of the region and no
# Persian mode; the story is told in the series' own voice. D major and its neighbours, tuned pure from D; B minor where the story turns
# to a loss (a dry year's fields; the qanat that chokes; the estimated bills; the qanats run dry).
# The rules every film keeps (AGENTS.md; tools/quiet.py checks them):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; never a bed
#    under the voice; a figure never played again soon after itself; music and effects no louder than the governance films'.
#  - Nothing trembles or pulses: no vibrato, no tremolo, one player to a note, tuned pure. No urgent pulse: nothing in this film is a
#    rush, and the motor pump is a steady rumble, never a beat.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, and pans to where it's drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: the flugelhorn low-passed at 2.2 kHz, the saxophone at 2.2 kHz, the effects below about 2.2 kHz and
# about 12 dB under the music.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() takes a word's first appearance, and falls back to the line's start when it's missing; here either stops the mix, so a typo
# can't move a sound
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
def sx(wx, cx, z):
    """where something drawn at wx in a place sits on screen while the camera is centred on cx at zoom z, in the stereo field"""
    return px(960 + (wx - cx) * z)
R1 = np.random.default_rng(1605)  # this film's own randomness: the room, the breath, the water, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major and
# B minor are pure in this table, and D to E and G to A are both 9/8, the figure's step. E is played only with A or D (against B it's
# the wolf fifth, against G a sixth a comma out)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.4162 * 2 ** o * _JI[pc]
A2, B2, D3, E3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5, E5 = \
    45, 47, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76

# ---- the levels: the flugelhorn and the saxophone matched by loudness, as far under the voice as the series' other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter: the opening a
# little fuller, as music under a story is
LF, LS, FX = 0.052, 0.062, 2.4
LV = [1.0]

# a small room round the two, ringing on for under a second, as two players sound in a small room. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, as the video
# guidelines ask
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
def _until(sig, s, until, f=0.2):
    """a sound that must be gone by until (a time in the film): faded out over its last f seconds"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); k = min(n, int(f * SR)); sig[n - k:] *= np.linspace(1, 0, k, dtype=np.float32)
    return sig
def _nz(sec):
    return R1.standard_normal(max(1, int(sec * SR))).astype(np.float32)

# ---- the flugelhorn
_FE = [-9.0]                                        # when the flugelhorn's last note stops: it plays one at a time
def _fbody(f):
    """the flugelhorn's bore and bell: a broad lift where its tone is warmest, near 650 Hz, and its highest partials let go"""
    return (0.7 + 0.6 * np.exp(-0.5 * (np.log(f / 650) / 0.5) ** 2)) * (1.0 if f < 1500 else np.exp(-(f - 1500) / 380))
def flugel(m, s, hold=1.8, g=1.0, until=None, att=0.075, room=0.2, pan=-0.12):
    """the flugelhorn, soft: the tongue lets the note go, the lip settling onto it from a few cents under; its fundamental strongest,
    its higher partials speaking a moment after its lower, a breath of air with it; it holds level for hold seconds, no vibrato, and
    stops as the player lets it go. One note at a time"""
    assert A3 <= m <= E5, 'the flugelhorn plays A 3 to E 5 here, not %d' % m
    if until is not None:
        hold = min(hold, max(0.2, until - s - 0.2))
    assert s >= _FE[0] - 0.08, 'the flugelhorn plays one note at a time: a note at %.2f s starts before the last one stops (%.2f s)' % (s, _FE[0])
    f0 = hz(m); rel = 0.11; sec = hold + rel + 0.06; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    ph = 2 * np.pi * np.cumsum(f0 * (1 - 0.0046 * np.exp(-x / 0.03))) / SR
    sig = np.zeros(n)
    for k in range(1, 24):
        if f0 * k > 2200:
            break
        r = att * (1 + 0.45 * (k - 1))
        sig += 0.56 ** (k - 1) * _fbody(f0 * k) * np.sin(0.5 * np.pi * np.minimum(1, x / r)) ** 2 * np.sin(k * ph + 0.3 * k * k)
    sig *= np.where(x < hold, 1.0, np.exp(-(x - hold) / (rel / 3))) * np.clip((sec - x) / 0.02, 0, 1)
    sig /= max(1e-9, float(np.abs(sig).max()))
    br = filt(_nz(sec)[:n], 'band', (600, 1800))
    sig += 0.035 * br / max(1e-9, float(np.abs(br).max())) * np.exp(-x / 0.045) * np.minimum(1, x / 0.006)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 90)), room, 0.25, max(0.5, hold)), s, until)
    put(sig, s, g * LV[0] * LF, pan)
    _FE[0] = s + hold

# ---- the tenor saxophone
_SE = [-9.0]                                        # when the saxophone's last note stops
_SF = [(430, 320, 1.0), (900, 440, 0.4), (1650, 560, 0.09)]
def _sharm(f, soft=0.9):
    """the weights of a note's harmonics on the tenor saxophone at f Hz: every harmonic, shaped by its resonances, the lowest a little
    weak, darker the softer it's played; none above 2.2 kHz"""
    n = max(1, int(2200 // f)); k = np.arange(1, n + 1); fk = f * k
    r = sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in _SF) + 0.08
    a = k ** -0.5 * r * (fk / 140) ** 2 / (1 + (fk / 140) ** 2) / (1 + (fk / (1000 * soft)) ** 2) * np.clip((2200 - fk) / 250, 0, 1)
    return a / np.sqrt((a ** 2).sum())
def sax(m, s, hold=2.4, g=1.0, until=None, att=0.07, room=0.22, pan=0.14):
    """the tenor saxophone, soft: the reed speaks and the note swells in over att seconds, its pitch settling from a few cents under;
    every harmonic of its pitch, and a little air through the reed under it; it holds level for hold seconds, no vibrato, and stops
    as the player lets it go. One note at a time"""
    assert A2 <= m <= A4, 'the tenor saxophone plays A 2 to A 4 here, not %d' % m
    if until is not None:
        hold = min(hold, max(0.2, until - s - 0.2))
    assert s >= _SE[0] - 0.08, 'the saxophone plays one note at a time: a note at %.2f s starts before the last one stops (%.2f s)' % (s, _SE[0])
    f0 = hz(m); rel = 0.12; sec = hold + rel + 0.06; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    ph = 2 * np.pi * np.cumsum(f0 * (1 - 0.0035 * np.exp(-x / 0.012))) / SR
    A = _sharm(f0); sig = np.zeros(n)
    for k, a in enumerate(A, 1):
        r = att * (1 + 0.06 * (k - 1))
        sig += a * np.sin(0.5 * np.pi * np.minimum(1, x / r)) ** 2 * np.sin(k * ph + 0.37 * k * k)
    env = np.where(x < hold, 1.0, np.exp(-(x - hold) / (rel / 3))) * np.clip((sec - x) / 0.02, 0, 1)
    sig *= env; sig /= max(1e-9, float(np.abs(sig).max()))
    br = filt(_nz(sec)[:n], 'band', (450, 1300)); br /= max(1e-9, float(np.abs(br).max()))
    sig += br * (0.022 + 0.04 * np.exp(-x / 0.05)) * np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2 * env
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 70)), room, 0.25, max(0.5, hold)), s, until)
    put(sig, s, g * LV[0] * LS, pan)
    _SE[0] = s + hold
def mark(s, g=1.0, step=0.6, last=2.6):
    """the series' mark: the three layers, the business layer between the other two: the flugelhorn's D, then its A, then the
    saxophone's F sharp between them, held"""
    flugel(D4, s, 0.48, g * 0.85); flugel(A4, s + step, 0.5, g * 0.8)
    sax(Fs4, s + 2 * step, last, g * 0.8)
def shares(inst, lo, s, g=1.0, step=0.32, last=1.7):
    """the film's own figure, eight, eight and nine: lo, lo again, and the note 9/8 above it, as the shares were set"""
    hi = lo + 2
    assert abs(hz(hi) / hz(lo) - 9 / 8) < 1e-9, 'the figure steps up by 9/8, not from %d' % lo
    inst(lo, s, step - 0.07, g * 0.9, att=0.05); inst(lo, s + step, step - 0.07, g * 0.9, att=0.05)
    inst(hi, s + 2 * step, last, g)

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
    """the desert's wind, low: two slow gusts across the plain that never fall into step, and no whistle"""
    n = int(sec * SR); x = np.arange(n) / SR; edge = np.minimum(1, x / 2.5) * np.clip((sec - x) / 2.5, 0, 1)
    for p, ph in ((-0.5, 0.0), (0.5, 2.3)):
        sw = 0.55 + 0.45 * np.sin(2 * np.pi * x / 7.9 + ph) * np.sin(2 * np.pi * x / 12.7 + 1.3 * ph)
        _fx(filt(_nz(sec)[:n], 'band', (90, 520)) * sw * edge, s, g, pan + p, 900)
def water(s, sec, g=0.005, pan=0.0, lo=220, hi=1300, dips=()):
    """water running in a channel: one soft, even texture that swells in, never a burst of drops. dips: (when, how far, how long)
    stretches where less water runs, as in a dry year, falling over a second and coming back"""
    n = int(sec * SR); x = np.arange(n) / SR; edge = np.minimum(1, x / 1.2) * np.clip((sec - x) / 1.4, 0, 1)
    for t0, k, d in dips:
        u = x - (t0 - s); edge = edge * (1 - k * np.clip(u / 1.0, 0, 1) * np.clip((d - u) / 1.2 + 1, 0, 1))
    gr = np.abs(filt(_nz(sec + 0.1)[:n], 'low', 9)); gr = 0.65 + 0.35 * gr / max(1e-9, float(gr.max()))
    _fx((filt(_nz(sec)[:n], 'band', (lo, hi)) * gr + 0.6 * filt(_nz(sec)[:n], 'band', (70, 260))) * edge, s, g, pan, 1600)
def pour(s, g=0.004, pan=0.0, sec=1.3):
    """water let into a field, or out of an outlet: a soft rush that rises and settles"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec)[:n], 'band', (200, 1200)) * _bump(x, sec, 1.2) * (1 - 0.5 * x / sec), s, g, pan, 1500)
def silt(s, sec, g=0.004, pan=0.0):
    """silt washing into the tunnel with the water: a low, thick rush that grows as the silt builds, and no grains"""
    n = int(sec * SR); x = np.arange(n) / SR; e = np.minimum(1, x / (0.6 * sec)) * np.clip((sec - x) / 0.8, 0, 1)
    gr = np.abs(filt(_nz(sec + 0.1)[:n], 'low', 5)); gr = 0.7 + 0.3 * gr / max(1e-9, float(gr.max()))
    _fx(filt(_nz(sec)[:n], 'band', (90, 480)) * gr * e, s, g, pan, 700)
def choke(s, g=0.004, pan=0.0):
    """the tunnel choked: a dull, low settling of earth, and the water's last rush gone"""
    n = int(0.6 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 72, 0.08) + 0.5 * filt(_nz(0.6)[:n], 'band', (80, 400)) * np.exp(-x / 0.18), s, g, pan, 600)
def gate(s, g=0.005, pan=0.0):
    """a wooden board lifted from a channel, or set back: a low knock and a short scrape of wood"""
    n = int(0.32 * SR); x = np.arange(n) / SR
    sc = filt(_nz(0.32)[:n], 'band', (180, 900)) * _bump(x - 0.03, 0.2, 1.0) * (x > 0.03)
    _fx(_knock(n, 170, 0.03) + 0.5 * sc, s, g, pan, 1400)
def creak(s, g=0.0035, pan=0.0, sec=0.55):
    """the windlass turned over the shaft: one slow, low creak of wood on wood, its catches running together into a soft groan"""
    n = int(sec * SR); x = np.arange(n) / SR; rate = 38 + 22 * np.sin(np.pi * x / sec)
    ph = np.cumsum(rate) / SR; tr = np.maximum(0, np.sin(2 * np.pi * ph)) ** 8
    _fx(filt(tr * filt(_nz(sec)[:n], 'band', (250, 1100)) + 0.3 * filt(_nz(sec)[:n], 'band', (200, 600)), 'band', (160, 1200)) * _bump(x, sec, 0.8), s, g, pan, 1300)
def pick(s, g=0.0035, pan=0.0):
    """a pick into the silt, in the tunnel: a dull thud, muffled by earth"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 95, 0.025) + 0.4 * filt(_nz(0.22)[:n], 'band', (100, 500)) * np.exp(-x / 0.03), s, g, pan, 800)
def steel(s, g=0.004, pan=0.0):
    """the deep well's steel pipe set in place: a low, dull knock of metal, damped at once, no ring"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 130, 0.03) + 0.25 * np.sin(2 * np.pi * 377 * x) * np.exp(-x / 0.02) * np.minimum(1, x / 0.002), s, g, pan, 1200)
def pump(s, sec, g=0.0035, pan=0.0):
    """the motor pump: a low, steady rumble that swells in as it starts, holds and fades; never a beat, and no tone in it"""
    n = int(sec * SR); x = np.arange(n) / SR; e = np.minimum(1, x / 1.2) * np.clip((sec - x) / 1.5, 0, 1)
    _fx((filt(_nz(sec)[:n], 'band', (45, 200)) + 0.25 * filt(_nz(sec)[:n], 'band', (200, 600))) * e, s, g, pan, 650)
def card(s, g=0.005, pan=0.0):
    """a card, a sheet or a slip laid down: a soft flap of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(_nz(0.17)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 155, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def knock(s, g=0.005, pan=0.0, f=200):
    """something set down on the glass or the wall: one soft, low knock"""
    n = int(0.16 * SR); _fx(_knock(n, f, 0.022), s, g, pan, 1400)
def tap(s, g=0.004, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(_nz(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 230, 0.012), s, g, pan, 1600)
def stamp(s, g=0.005, pan=0.0):
    """a rubber stamp pressed on a bill: a soft, dull thud, and the paper under it"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 110, 0.03) + 0.4 * filt(_nz(0.2)[:n], 'band', (300, 1400)) * np.exp(-x / 0.02), s, g, pan, 1300)
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
    """things moving across the frame together, or a line going round: a breath of low air"""
    n = int(sec * SR); x = np.arange(n) / SR; _fx(filt(_nz(sec)[:n], 'band', (140, 900)) * _bump(x, sec), s, g, pan, 1000)

# =============================================================================================================================
# 1. Eight, eight and nine: the opening, the film's story from outside data, with the flugelhorn's plain line over the saxophone's.
#    Sehdeh from above: D major over the wind, the flugelhorn's D, then the saxophone's under it; the chain of shafts lit, a breath of
#    air, and the water running in; the basin's three outlets, the water out of them. The flow rises and falls: B minor; drought, and
#    one hamlet taking more, a low knock, its neighbours' fields dry. The qanat cut away: the silt washing in, and it chokes: a dull
#    settling, the water gone, and B minor. What each hamlet needed: A major, a breath of air as the tunnel is kept open. The shares
#    set: D major, and the film's own figure as the outlets light; built in: a rod set at each outlet. Whatever came in: the bars laid
#    down, the water falling in a dry year and back, the saxophone's D, B and D. The muqannis: G major, the windlass and the pick, the
#    silt scraped away. The mirab: a gate and the water let in at each field in its turn, a note of the flugelhorn at each. Three
#    hundred years on: D major. A dry year: less water, and the figure an octave lower on the saxophone. At the utility: A major and a
#    tap for each tag. In the pause, the title: the mark
K = 'outlets'
LV[0] = 1.1
kw = lambda lid, word, off=0: W(K, lid, word, off)
kc = lambda lid, off=0: G(K, lid, off)
tB = kc('breath'); END1 = E(K)
tQ, tOu = kw('edge', 'one qanat', -0.3), kw('basin', 'three outlets', -0.3)
tFl, tDr, tMo, tTk, tOt = kc('flow'), kw('flow', 'drought', -0.3), kc('more'), kw('more', 'took more', -0.3), kw('more', "the others' fields dry", -0.3)
tSi, tW, tCh, tDu = kc('silt'), kw('silt', 'silt washed', -0.3), kw('silt', 'choke', -0.3), kw('silt', 'dry up', -0.3)
tNe, tFa, tOp = kc('needed'), kw('needed', 'fair share', -0.3), kw('needed', 'the tunnel kept open', -0.3)
tSe, tEn, tSh = kc('set'), kw('set', 'an engineer', -0.3), kw('set', 'eight, eight and nine', -0.3)
tWi, tSa, tWe, tDy, tSs = kw('built', 'eight spans', -0.3), kc('same'), kw('same', 'in a wet year', -0.3), kw('same', 'a dry one', -0.3), kw('same', 'the same shares', -0.3)
tCl, tMu, tCs = kc('clean'), kw('clean', 'the muqannis', -0.3), kw('clean', 'cleared the silt', -0.3)
tMi, tPr = kc('mirab'), kw('mirab', 'the proper time', -0.3)
tHe, tSt, tLs, tIt = kc('held'), kw('held', 'still took', -0.3), kw('less', 'each got less', -0.3), kw('less', 'each still got its share', -0.3)
tLi = kc('link')
TA = [tMi + 0.4, tMi + 1.8, tPr - 0.2, tPr + 1.4]  # the gates lifted in turn (scenes.js)
XG = [1554, 1724, 1894, 2064]                       # the fields' gates in the cut-away village (ba.js BA_VFIELDS, less 6)
# the wind over every outdoor place, low, until the words for the utility
wind(S0(K), tLi - 0.4 - S0(K), 0.0045, 0.0)
# Sehdeh from above: the flugelhorn's D, then the saxophone's under it; the chain lit and the water running in
flugel(D4, S0(K) + 0.8, 3.0, 0.8)
sax(D3, S0(K) + 2.4, 4.6, 0.8)
flugel(Fs4, S0(K) + 4.4, 2.4, 0.74)
air(tQ, 1.8, 0.003, sx(460, 1010, 1.02))
water(tQ, tSi - 0.3 - tQ, 0.0032, sx(880, 1010, 1.02), dips=((tDr, 0.45, tMo - tDr - 0.2),))
flugel(A4, tQ + 1.3, 2.6, 0.72)
sax(A2, tQ + 1.6, 3.4, 0.72)
# the basin and its three outlets, the water out of them, one to each hamlet
sax(D3, kc('basin', 0.2), 3.8, 0.72)
flugel(Fs4, kc('basin', 0.3), 1.9, 0.7)
pour(tOu + 0.15, 0.0034, sx(1080, 1040, 2.1), 1.4)
flugel(E4, tOu + 0.3, 2.2, 0.68)
# a qanat's flow rises and falls: B minor; drought, about one year in four
sax(B2, tFl + 0.2, 3.4, 0.72)
flugel(D4, tFl + 1.0, 2.4, 0.66)
sax(Fs3, tDr + 0.6, 2.8, 0.66)
flugel(Fs4, tDr + 0.8, 2.2, 0.64)
# one hamlet takes more: its outlet lit amber, a low knock; the others' fields dry
knock(tTk + 0.3, 0.0034, sx(1080, 1260, 1.18), 150)
sax(Fs3, tTk - 0.2, 2.0, 0.64)
flugel(Cs4, tTk + 0.2, 1.7, 0.62)
air(tOt + 0.2, 1.6, 0.0026, sx(1700, 1260, 1.18))
flugel(B3, tOt + 0.35, 2.3, 0.64)
sax(B2, tOt + 0.5, 3.0, 0.64)
# the qanat cut away: the silt washing in every year, and a qanat nobody cleaned choking, its water gone, its fields dry
water(tSi - 0.9, tCh + 2.6 - (tSi - 0.9), 0.003, sx(860, 860, 1.25), 200, 1000)
silt(tW + 0.1, tCh - tW + 0.4, 0.0036, sx(900, 860, 1.25))
choke(tCh + 0.3, 0.0042, sx(1000, 1260, 1.05))
flugel(Fs4, tCh + 0.15, 1.7, 0.64)
sax(B2, tCh + 0.45, 2.4, 0.66)
flugel(D4, tDu + 1.4, 1.4, 0.6, until=tNe + 0.2)
# what each hamlet needed, wet year or dry, and the tunnel kept open: A major
water(kc('needed', -0.9), kc('clean', -0.3) - kc('needed', -0.9), 0.0032, sx(1000, 1060, 1.6), dips=((tDy + 0.1, 0.5, tSs + 0.8 - tDy - 0.1),))
sax(A2, tNe + 0.3, 4.4, 0.7)
flugel(Cs4, tFa + 0.1, 2.0, 0.64)
air(tOp + 0.1, 1.8, 0.0028, sx(460, 1010, 1.2))
flugel(E4, tOp + 0.2, 2.1, 0.64)
# the shares set in the 1600s: D major, and the film's own figure as the outlets light, one at a time
sax(D3, tSe + 0.3, tSh - tSe + 1.4, 0.7)
flugel(Fs4, tEn + 0.1, 1.3, 0.62)
shares(flugel, D4, tSh, 0.74)
# built into the outlets: a rod set against the stone at each, as it's measured in spans
for i in range(3):
    tap(tWi + 0.2 + 0.3 * i, 0.0032, sx(1090, 1090, 3.2) + 0.04 * (i - 1))
# whatever came in, wet year or dry: the bars laid down; the saxophone's D, B as the water falls, and D as it comes back
card(tWe - 0.2, 0.004, sx(1580, 1180, 1.5))
sax(D3, tWe + 0.1, 0.9, 0.62)
sax(B2, tDy + 0.15, 1.0, 0.6)
sax(D3, tSs + 0.2, 2.4, 0.64)
flugel(Fs4, tSs + 0.6, 2.0, 0.62)
# the muqannis clear the silt: G major, the windlass turned and the pick in the silt, the silt scraped away
water(tCl - 0.9, tHe + 0.2 - (tCl - 0.9), 0.0028, sx(1500, 900, 1.9), 220, 1200)
sax(G3, tCl + 0.3, 2.8, 0.64)
flugel(B3, tMu + 0.2, 2.0, 0.62)
creak(tMu + 0.3, 0.0034, sx(950, 900, 1.9)); pick(tMu + 0.95, 0.0032, sx(840, 900, 1.9))
creak(tMu + 2.4, 0.003, sx(950, 900, 1.9)); slide(tCs + 0.3, 1.6, 0.0026, sx(870, 900, 1.9)); pick(tCs + 1.9, 0.003, sx(840, 900, 1.9))
# the mirab at the gates: a gate lifted and the water let in at each field in its turn, and a note of the flugelhorn at each
sax(A2, tMi + 0.2, 3.0, 0.62)
for i, (t0, m) in enumerate(zip(TA, (A4, Fs4, E4, D4))):
    gate(t0 + 0.05, 0.0042, sx(XG[i], 1960, 1.6)); pour(t0 + 0.25, 0.0032, sx(XG[i] + 40, 1960, 1.6), 1.1)
    flugel(m, t0 + 0.1, 1.0, 0.6)
sax(D3, TA[2] - 0.2, 2.8, 0.62)
# more than three hundred years on, the same shares: D major
water(tHe - 0.9, tLi - 0.6 - (tHe - 0.9), 0.003, sx(1000, 1100, 1.4), dips=((tLs + 0.1, 0.45, 9.0),))
sax(D3, tHe + 0.3, 3.2, 0.66)
flugel(Fs4, tHe + 0.9, 1.3, 0.62)
flugel(A4, tSt + 0.15, 2.0, 0.64)
# a dry year: each got less, and each still got its share: the figure an octave lower, on the saxophone
flugel(A3, tLs + 0.2, 3.6, 0.6)
shares(sax, D3, tIt + 0.1, 0.72, last=1.9)
# at the utility, the data needs the same: A major, and a tap as each tag comes in
sax(A2, tLi + 0.3, 3.0, 0.62)
flugel(Cs4, tLi + 1.0, 1.8, 0.6)
for word in ('what each step expects', 'written down', 'and checked'):
    tap(kw('link', word, -0.1), 0.0032, px(960))
flugel(E4, kw('link', 'written down', 0.1), 1.8, 0.58)
# the pause: the title, and the mark
mark(tB + 0.9, 0.85, last=END1 - tB - 2.6)

# 2. What the business expects: Tomás's next note on the wall, a soft flap of paper, and G major as the chapter turns. Rules with a
#    home's three rules laid down, a knock each, and a tap for each of their three words. His two questions: the saxophone's B, then the
#    flugelhorn's A, asking
K = 'note'
LV[0] = 1.0
nw_ = lambda lid, word, off=0: W(K, lid, word, off)
nc = lambda lid, off=0: G(K, lid, off)
card(S0(K) + 0.3, 0.0042, sx(1000, 1240, 1.3))
flugel(G4, S0(K) + 0.6, 2.0, 0.62)
sax(G3, S0(K) + 1.7, 2.0, 0.6)
tHo = nc('home')
for i in range(3):
    knock(tHo + 0.2 + 0.35 * i, 0.0034, px(350 + 530 * i))
for k, (word, off) in enumerate((('rule a home', 0.1), ('an owner', 0.0), ('a reason', 0.0))):
    tap(nw_('home', word, off), 0.003, px(560 + 300 * k))
sax(B3, nw_('now', 'where rules come from', -0.1), 1.3, 0.58)
flugel(A4, nw_('now', 'who says', -0.1), 1.6, 0.58)

# 3. Policy, process, procedure: the policy laid down, a knock, D major as the chapter turns; its words written, a pen. The rules that
#    make it checkable: a line drawn, and a knock as each card lands. The processes, the procedure and the records: a knock and a line
#    drawn for each, G major for the processes that carry the policy out; each record, a tap. ISO 9000's chain: its card, and A, the
#    chain complete
K = 'policy'
pw_ = lambda lid, word, off=0: W(K, lid, word, off)
pc = lambda lid, off=0: G(K, lid, off)
knock(S0(K) + 0.3, 0.004, sx(290, 400, 1.55))
sax(D3, S0(K) + 0.5, 2.4, 0.62)
flugel(Fs4, S0(K) + 1.5, 1.8, 0.6)
pen(pc('retail', 0.2), 0.9, 0.003, sx(290, 400, 1.55), 3)
slide(pc('rules', -0.2), 0.5, 0.0026, sx(290, 520, 1.15))
knock(pw_('rules', 'A data rule', -0.2), 0.0034, sx(500, 520, 1.15)); knock(pc('brule', -0.2), 0.0034, sx(500, 520, 1.15))
for lid, x in (('process', 770), ('procedure', 1210), ('record', 1660)):
    knock(pc(lid, -0.2), 0.0036, sx(x, 520, 1.15)); slide(pc(lid, -0.1), 0.8, 0.0024, sx(x - 200, 520, 1.15))
sax(G3, pc('process', 0.3), 2.2, 0.6)
tap(pw_('record', "each reading's mark", -0.2), 0.003, px(1660)); tap(pw_('record', "each bill's note", -0.2), 0.003, px(1660))
card(pc('iso', -0.2), 0.0042, px(1430))
flugel(A4, pw_('iso', 'record', -0.1), 1.8, 0.6)
sax(D3, pw_('iso', 'record', 0.4), 2.0, 0.58)

# 4. A decision, in a table: the flow drawn, a dry rub, and G major as the chapter turns. The gateway that decides, a knock; the step, a
#    tap. The decision table laid down, its line drawn; the rows lit, a tap each. Grace's team owns it: she comes in, a breath of air,
#    and her tag, a tap. A rule changes in the table: the row slid in and written, and the flugelhorn's G; the flow stays: a tap, and
#    the saxophone's D
K = 'decide'
dw = lambda lid, word, off=0: W(K, lid, word, off)
dc = lambda lid, off=0: G(K, lid, off)
slide(S0(K) + 0.2, 1.0, 0.0026, sx(500, 800, 1.22))
sax(G3, S0(K) + 0.5, 2.4, 0.6)
flugel(D4, S0(K) + 1.6, 1.8, 0.58)
knock(dw('decide', 'decides', -0.1), 0.0034, sx(690, 800, 1.22))
tap(dw('bpmn', 'a step', -0.1), 0.003, sx(410, 800, 1.22)); knock(dw('bpmn', 'its choice', -0.1), 0.0032, sx(690, 800, 1.22))
card(dc('dmn', -0.2), 0.0042, px(700)); slide(dc('dmn', 0.0), 0.4, 0.0022, px(690))
tEs = dw('rows', 'failed or missing', -0.3)
tap(dw('rows', "it's used", -0.3), 0.003, px(700)); tap(tEs + 0.05, 0.003, px(700)); tap(tEs + 0.55, 0.003, px(700))
tOw, tCh_, tSt_ = dc('owns'), dw('owns', 'a rule changes', -0.3), dw('owns', 'the flow stays', -0.3)
air(tOw - 0.4, 1.0, 0.0026, px(1790)); tap(tOw + 0.05, 0.003, px(1500))
slide(tCh_, 0.8, 0.0026, px(700)); pen(tCh_ + 0.4, 0.6, 0.003, px(560), 2)
flugel(G4, tCh_ + 0.5, 1.8, 0.58)
tap(tSt_, 0.003, px(1200)); sax(D3, tSt_ + 0.1, 2.4, 0.58)

# 5. Late, for whom?: billing day drawn, a dry rub; the fault, the meters held back, a low knock, and B minor as the chapter turns. The
#    readings come in by nine, a breath of air across the day, and a tap for their tag; billing ran at six, a knock; the estimated
#    bills counted, a card and a stamp, and the flugelhorn's F sharp. The data team's check and network planning laid down, a card each,
#    each ticked. Late?: the saxophone's A, asking, and a tap for each answer. The rule, a card; billing's never written down, a pen. In
#    the pause, the two answers side by side: B minor, the flugelhorn's B and the saxophone's F sharp
K = 'late'
lw_ = lambda lid, word, off=0: W(K, lid, word, off)
lc = lambda lid, off=0: G(K, lid, off)
slide(S0(K) + 0.2, 1.0, 0.0026, sx(1000, 700, 1.35))
knock(lw_('fault', 'a fault', -0.3), 0.0036, sx(200, 700, 1.35), 150)
sax(B2, S0(K) + 0.6, 3.2, 0.62)
flugel(D4, S0(K) + 2.2, 2.0, 0.58)
air(lc('nine', -0.2), 1.8, 0.0028, px(700)); tap(lw_('nine', 'arrived by nine', -0.2), 0.003, px(1256))
tSix, tEst = lw_('nine', 'at six', -0.3), lw_('nine', 'estimated bills', -0.3)
knock(tSix + 0.1, 0.0034, px(1068)); card(tEst, 0.0042, px(490)); stamp(tEst + 0.35, 0.0042, px(490))
flugel(Fs4, tEst + 0.3, 1.8, 0.58)
card(lc('check', -0.2), 0.0042, px(970)); ticked(lw_('check', 'all was well', -0.2), 0.0034, px(1154))
card(lc('planning', -0.2), 0.0042, px(1460)); slide(lc('planning', 0.0), 0.8, 0.0024, px(1800))
ticked(lw_('planning', 'nothing wrong', -0.2), 0.0034, px(1644))
sax(A3, lc('late', -0.1), 1.6, 0.56)
tap(lw_('late', 'For billing', -0.2), 0.003, px(490)); tap(lw_('late', 'For planning', -0.2), 0.003, px(1460))
card(lc('rule', -0.1), 0.0042, px(960))
tap(lw_('guess', 'guessed its own', -0.2), 0.003, px(970)); pen(lw_('guess', 'never been written down', -0.2), 0.9, 0.003, px(960), 3)
tBl = lc('breath')
flugel(B3, tBl + 0.3, 1.8, 0.58); sax(Fs3, tBl + 0.7, 1.6, 0.56)

# 6. Written down by its owners: the day carried on, billing's owner, a tap. Billing moves to ten, a dry rub, and D major; what billing
#    needs written down, a card and a pen for each line. Grace comes in, a breath of air; she agrees, a tick, and the flugelhorn's A.
#    Onto the map: the card slid up, the two processes set down, a knock each, the realisation drawn, its reason a tap. At Sehdeh, the
#    shares set first: its card, and the film's own figure as its outlets light; the outlets built to them, a tap. The check built from
#    it: its card and its line, and the flugelhorn's F sharp, the shares' D major
K = 'set'
sw = lambda lid, word, off=0: W(K, lid, word, off)
sc_ = lambda lid, off=0: G(K, lid, off)
tap(sw('whose', 'the owner of the step', -0.1), 0.003, px(1068))
tMv, tWr = sw('ten', 'moves billing to ten', -0.2), sw('ten', 'writes down', -0.3)
slide(tMv, 1.4, 0.0026, px(1300)); card(tWr, 0.0042, px(960)); pen(tWr + 0.45, 0.5, 0.0028, px(800), 2)
sax(D3, tMv + 0.3, 2.6, 0.6)
flugel(Fs4, tMv + 1.4, 2.0, 0.58)
for word, off, d in (('By ten', -0.1, 0.7), ('a reading or an estimate', -0.2, 1.0), ('no more than one', -0.2, 0.8)):
    pen(sw('needs', word, off), d, 0.0028, px(900), 3)
air(sc_('grace', -0.4), 1.0, 0.0026, px(1790)); tAg = sw('grace', 'agrees', -0.2)
ticked(tAg, 0.0034, px(1260)); flugel(A4, tAg + 0.3, 1.8, 0.58)
tMa = sc_('map')
slide(tMa - 0.2, 1.4, 0.0026, px(1200)); knock(tMa + 0.25, 0.0034, px(330)); knock(tMa + 0.6, 0.0032, px(330), 180)
slide(tMa + 1.2, 0.8, 0.0024, px(800)); tap(sw('map', 'reason', -0.2), 0.003, px(1460))
tSf = sw('sehdeh', 'set first')
card(sc_('sehdeh', -0.2), 0.0042, px(420))
sax(D3, tSf - 0.3, 2.6, 0.6)
shares(flugel, D4, tSf, 0.7, step=0.3, last=1.6)
tap(sw('sehdeh', 'the outlets built', -0.2), 0.003, px(1000))
card(sw('first', 'the check', -0.2), 0.0042, px(1460)); slide(sw('first', 'the check', 0.0), 0.4, 0.0022, px(1720))
tap(sw('first', 'the expectation comes first', -0.2), 0.003, px(1460))
flugel(Fs4, sw('first', 'built from it'), 1.8, 0.58)

# 7. Fixed at the source: the meter system set down, a knock, and A major as the chapter turns; what it checks of its own, a tick each.
#    The data platform, a knock, and the line that reads, drawn; never writes back, a low knock. Fixed at the source, by its own team: a
#    tap, and D major. The check on the platform, its card and its line; billing, a knock and its line; reads both, a tap. Each billing
#    morning: the check's cross, a low knock; its result laid down and sent, a card and a line, and the saxophone's B for the accounts
#    with no reading
K = 'source'
ow = lambda lid, word, off=0: W(K, lid, word, off)
oc = lambda lid, off=0: G(K, lid, off)
knock(S0(K) + 0.25, 0.004, sx(330, 400, 1.35))
flugel(E4, S0(K) + 0.5, 1.8, 0.6)
sax(A2, S0(K) + 0.9, 2.6, 0.6)
for word in ('checks each one', 'makes the estimates', "reports what's missing"):
    ticked(ow('checks', word, -0.2), 0.0032, sx(124, 400, 1.35))
tap(ow('source', 'accountable', -0.2), 0.003, sx(330, 400, 1.35))
tRd = oc('reads')
knock(tRd - 0.2, 0.0036, sx(1070, 760, 1.1)); slide(tRd, 0.8, 0.0024, sx(700, 760, 1.1))
knock(ow('reads', 'never writes back', -0.1), 0.0034, sx(700, 760, 1.1), 140)
tFx = ow('reads', 'fixed at the source', -0.3)
tap(tFx, 0.003, sx(330, 760, 1.1)); sax(D3, tFx + 0.3, 2.4, 0.58); flugel(Fs4, tFx + 1.4, 1.6, 0.56)
tOn = oc('only')
card(tOn - 0.1, 0.0042, px(1070)); slide(tOn, 0.6, 0.0022, px(1070))
tAc = ow('both', "billing's accounts", -0.3)
knock(tAc, 0.0036, px(1620)); slide(tAc, 0.8, 0.0024, px(1360)); tap(ow('both', 'runs on the platform', -0.3), 0.003, px(1070))
tLe = oc('lead')
knock(tLe, 0.0034, px(1314), 140); card(tLe - 0.1, 0.0042, px(390)); slide(tLe, 0.8, 0.0024, px(720))
tap(tLe + 0.7, 0.003, px(390)); sax(B2, tLe + 0.4, 2.2, 0.58)

# 8. The data practice: its map, a dry rub, and G major as the chapter turns. The data product, the service it bundles and its
#    contract, a knock each, and the bundling lines drawn. What its contract holds, written in, a pen for each line, and the
#    saxophone's D where its checks are built from it
K = 'practice'
qw = lambda lid, word, off=0: W(K, lid, word, off)
qc = lambda lid, off=0: G(K, lid, off)
slide(S0(K) + 0.2, 0.8, 0.0024, px(500)); air(S0(K) + 0.4, 1.0, 0.0024, px(960))
flugel(B3, S0(K) + 0.6, 2.0, 0.58)
sax(G3, S0(K) + 1.5, 2.2, 0.56)
tPd, tSv, tCt = qw('product', 'a data product', -0.3), qw('bundle', 'the service', -0.3), qw('bundle', 'its contract', -0.3)
knock(tPd, 0.0036, px(700)); knock(tSv, 0.0034, px(320)); knock(tCt, 0.0034, px(800))
slide(tSv + 0.4, 0.6, 0.0022, px(560)); slide(tCt + 0.4, 0.5, 0.0022, px(800))
for word in ('what each of its readers expects', "set by that reader's owner", 'its checks'):
    pen(qw('contract', word, -0.2), 0.5, 0.0026, px(340), 2)
sax(D3, qw('contract', 'its checks', 0.1), 2.2, 0.56)

# 9. Kept, and changed: back at Sehdeh, D major as at the film's start, and the film's own figure once more as the shares held; the
#    tunnel cleaned, a breath of air along the shafts. After the war: the deep well's steel set down, its pump, a low, steady rumble,
#    and its water; the qanat's water falls away under it, and B minor. About half run dry: the count laid down, a knock, and the
#    flugelhorn going down through B minor over the saxophone. The words: the flugelhorn's G, held while it's kept, and the saxophone's D
#    as the world changes. At the utility: the expectation laid down, its owner a tap; prices by the hour, a tap, the line rewritten, a
#    pen, and A major; its check follows, a card and a line. It keeps maturing: the loop drawn round, a breath of air, and D major. The
#    map: the layers lit, a dry rub, drawn, a tick, and the next series' line drawn. Under the end card, without words, the mark
K = 'end'
LV[0] = 1.0
ew = lambda lid, word, off=0: W(K, lid, word, off)
ec = lambda lid, off=0: G(K, lid, off)
tPu, tHa, tKe, tUt, tPr2, tMa2, tNx, tB9 = ec('pumps'), ec('half'), ec('keep'), ec('utility'), ec('prices'), ec('matures'), ec('next'), ec('breath')
wind(S0(K), tKe - 0.4 - S0(K), 0.0042, 0.0)
water(S0(K), tPu - 0.3 - S0(K), 0.003, sx(1080, 1120, 1.5))
sax(D3, S0(K) + 0.4, 3.6, 0.62)
shares(flugel, D4, ew('held', 'the shares held'), 0.68, step=0.3, last=1.6)
air(ew('held', 'the tunnel cleaned', -0.1), 1.8, 0.0026, sx(460, 1000, 1.15))
tWl, tFa2 = ew('pumps', 'deep wells', -0.3), ew('pumps', 'faster than rain', -0.3)
water(tPu - 0.9, tFa2 + 1.2 + 3.2 - (tPu - 0.9), 0.0028, sx(1500, 980, 1.0), 220, 1200)
steel(tWl + 0.1, 0.0042, sx(1010, 980, 1.0))
pump(tWl + 0.6, tKe - 0.6 - (tWl + 0.6), 0.0034, sx(1010, 980, 1.0))
pour(tWl + 0.9, 0.0028, sx(1120, 980, 1.0), 2.2)
sax(B2, tFa2 + 0.2, 3.0, 0.62)
tHf = ew('half', 'about half', -0.1)
knock(tHa + 0.05, 0.0038, px(1520))
flugel(Fs4, tHa + 0.3, 1.3, 0.6); sax(Fs3, tHa + 0.7, 2.2, 0.58)
flugel(D4, tHa + 2.0, 1.3, 0.58); flugel(B3, tHa + 3.7, 2.0, 0.58); sax(B2, tHa + 3.4, 2.6, 0.58)
tap(ew('half', 'from poor upkeep', -0.2), 0.003, px(1520))
flugel(G4, tKe + 0.3, 2.0, 0.58)
sax(D3, ew('keep', 'and change them', 0.1), 2.4, 0.56)
card(tUt - 0.2, 0.0042, px(960)); tap(ew('utility', 'an owner', -0.2), 0.003, px(700))
tCg = ew('prices', 'a reading for every hour', -0.3)
tap(ew('prices', 'change by the hour', -0.2), 0.003, px(960)); pen(tCg, 0.8, 0.0028, px(960), 3)
sax(A2, tCg + 0.1, 2.4, 0.58); flugel(E4, tCg + 0.9, 1.8, 0.56)
tCf = ew('prices', 'its check will follow', -0.2)
card(tCf, 0.0042, px(960)); slide(tCf + 0.1, 0.4, 0.0022, px(960))
air(tMa2 - 0.1, 1.6, 0.0026, px(960))
flugel(Fs4, tMa2 + 0.1, 1.6, 0.58); sax(D3, tMa2 + 0.5, 3.2, 0.56); flugel(A4, tMa2 + 2.0, 1.8, 0.56)
slide(tNx - 0.4, 0.8, 0.0024, px(800)); air(tNx - 0.6, 1.0, 0.0024, px(1760))
ticked(ew('next', 'is drawn', -0.3), 0.0034, px(1240)); slide(ew('next', 'Data architecture', -0.3), 0.8, 0.0024, px(300))
mark(tB9 + 1.7, 0.85, last=E(K) - tB9 - 3.6)
