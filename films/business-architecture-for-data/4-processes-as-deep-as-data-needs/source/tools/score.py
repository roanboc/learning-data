# Processes, as deep as data needs: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# Its palette (the topic's palettes.md, and decided.md): a cylinder music box and a cello, alone, two instruments the site has but no
# film pairs, and no film of this topic plays, since nothing new fitted (the film's assumptions file says so, and why).
#  - The lead: a cylinder music box, its comb low (D 4 to D 6). A comb of steel teeth, each tuned to one note, plucked by the pins of a
#    turning cylinder, each pin in its place, so one turn of the cylinder gives every note its turn, as a qanat's cycle gives every owner
#    his. A tooth is plucked and rings, dying away, the low teeth longer than the high; it bends a little as it's plucked, so a faint,
#    higher overtone sounds for a moment as it speaks, and its wooden box adds a breath of the octave. A tooth plucked again is stopped
#    by the pin before it's plucked. The comb runs from the low teeth on the left to the high on the right. Played softly, its top cut at
#    2.5 kHz, and never the mechanism's tick, so nothing pulses. It spreads chords from the bass up under the opening story and at a
#    chapter's turn, and gives single quick notes only where the film goes down to the finest level: a split share's minutes, and the
#    one branch drawn in detail.
#  - Its partner: a cello, alone, bowed softly in its middle notes (D 3 to A 4): no vibrato, one note at a time, never a chord. Each
#    note swells in as the bow takes the string, its higher partials a moment after its lower, holds level and stops as the bow leaves
#    it, the string ringing a moment after. A bowed string's partials, all of them there, shaped by the body's resonances, with a faint
#    breath of the bow's hair under the note. The plain line under the music box, at the level where most of the map stays.
#  - The film's own figure, as deep as it needs: the cello plays three plain notes, A, F sharp and D, and the music box divides only the
#    middle one into six quick notes, as one share went down to its minutes and the rest didn't. Twice: where a share is split down to
#    single minutes, and where one branch, check readings, goes to level 3.
#  - The series' mark: the three layers, the business layer between the other two: the music box plays D, then A, and the cello holds
#    the F sharp between them. Under the title, and again under the end card.
#  - Its sounds: the desert's wind; the water in the channel, one soft texture; the fields' wooden gates and the water let in; the lots
#    drawn; the water clock's cup filling through its hole, and sinking; and at the utility, cards, paper, a pen, a stamp, and knocks and
#    taps as things are set on the wall.
# Nothing Persian is borrowed for the story: no santur or other hammered dulcimer, no ney, no lute of the region, and no Persian mode;
# the story is told in the series' own voice. D major and its neighbours, tuned pure from D; B minor where the story turns to a loss
# (the owners at the end of the cycle with none; the estimated bills).
# The rules every film keeps (AGENTS.md; tools/quiet.py checks them):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; never a bed
#    under the voice; a figure never played again soon after itself; music and effects no louder than the governance films'.
#  - Nothing trembles or pulses: no vibrato, no tremolo, one tooth or one string to a note, tuned pure. No urgent pulse: nothing in this
#    film is a rush.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, and pans to where it's drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: the music box low-passed at 2.5 kHz, the cello at 2.2 kHz, the effects below about 2.2 kHz and
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
R1 = np.random.default_rng(1404)  # this film's own randomness: the room, the bow's hair, the water, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major and
# B minor are pure in this table. E is played only with A (against B it's the wolf fifth, against G a sixth a comma out)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.4162 * 2 ** o * _JI[pc]
D3, E3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5, E5, Fs5, G5, A5, B5, D6 = \
    50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 79, 81, 83, 86

# ---- the levels: the music box and the cello matched by loudness, as far under the voice as the series' other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter: the opening a
# little fuller, as music under a story is
LB, LC, FX = 0.046, 0.066, 2.4
LV = [1.0]

# a small room round the two, ringing on for under a second, as a music box and a cello sound in a small room. Its level is set by what
# it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, as the
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

# ---- the cylinder music box
def mbox(m, s, g=1.0, pan=None, until=None, room=0.18):
    """a tooth of the comb, plucked by a pin of the turning cylinder: it speaks at once and rings, dying away, the low teeth for about
    three seconds and the high for under two. As it's plucked it bends a little, so a faint overtone far above it sounds for a moment
    (on the low teeth only: on the high ones it's above the box's top); the wooden box adds a breath of the octave. The pin's touch is
    soft and low, never a tick. A tooth plucked again is stopped by the pin first (until=)"""
    assert D4 <= m <= D6, 'the comb runs from D 4 to D 6, not %d' % m
    f0 = hz(m); u = (m - D4) / 24
    sec = 3.0 - 1.3 * u; tau = sec / 6.2
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.sin(2 * np.pi * f0 * x) * np.exp(-x / tau)
    sig += 0.06 * np.sin(2 * np.pi * 2 * f0 * x + 0.6) * np.exp(-x / (0.45 * tau))
    if 6.27 * f0 < 2400:
        sig += 0.16 * (1 - u) * np.sin(2 * np.pi * 6.27 * f0 * x + 1.1) * np.exp(-x / 0.07)
    sig *= np.minimum(1, x / 0.0018) * np.clip((sec - x) / 0.02, 0, 1)    # and it ends at silence, never a step
    p_ = int(0.014 * SR); xp = np.arange(p_) / SR; th = filt(_nz(0.014)[:p_], 'band', (250, 1200))
    sig[:p_] += 0.05 * th / max(1e-9, float(np.abs(th).max())) * np.exp(-xp / 0.004)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2500), 'high', 120)), room, 0.0, 0.8), s, until, 0.04)
    put(sig, s, g * LV[0] * LB, (-0.22 + 0.44 * u) if pan is None else pan)
def mspread(notes, s, g=1.0, step=0.09):
    """a chord spread from the bass up, a pin to each tooth as the cylinder turns: under the story, and at a chapter's turn"""
    for i, m in enumerate(notes):
        mbox(m, s + step * i, g * (0.85 if i == 0 else 0.7))

# ---- the cello
_CE = [-9.0]                                        # when the cello's last note stops: it plays one at a time
def _cbody(f):
    """the cello's body: its resonances lift the partials near 220 Hz, 560 Hz and 1.25 kHz, and let the highest go"""
    return ((0.5 + 0.9 * np.exp(-0.5 * (np.log(f / 220) / 0.35) ** 2) + 0.55 * np.exp(-0.5 * (np.log(f / 560) / 0.3) ** 2)
             + 0.35 * np.exp(-0.5 * (np.log(f / 1250) / 0.25) ** 2)) * (1.0 if f < 1800 else np.exp(-(f - 1800) / 500)))
def cello(m, s, hold=2.4, g=1.0, until=None, rise=0.2, room=0.22, pan=0.1):
    """the cello, alone, bowed softly: the bow takes the string and the note swells in over rise seconds, its higher partials a moment
    after its lower; it holds level for hold seconds, no vibrato; then the bow leaves it and the string rings a moment. A bowed string's
    partials, all of them there, shaped by the body; a faint breath of the bow's hair under the note. One note at a time"""
    assert D3 <= m <= A4, 'the cello plays its middle notes, D 3 to A 4, not %d' % m
    if until is not None:
        hold = min(hold, max(0.5, until - s - 0.35))
    assert s >= _CE[0] - 0.15, 'the cello plays one note at a time: a note at %.2f s starts before the last one stops (%.2f s)' % (s, _CE[0])
    f0 = hz(m); sec = hold + 0.6; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 40):
        f = f0 * k
        if f > 2300:
            break
        r = rise * (1 + 0.06 * (k - 1))
        sig += k ** -1.0 * _cbody(f) * np.sin(0.5 * np.pi * np.minimum(1, x / r)) ** 2 * np.sin(2 * np.pi * f * x + 0.37 * k * k)
    sig *= np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.1)) * np.clip((sec - x) / 0.02, 0, 1)
    sig /= max(1e-9, float(np.abs(sig).max()))
    br = filt(_nz(sec)[:n], 'band', (900, 2100))
    sig += 0.006 * br / max(1e-9, float(np.abs(br).max())) * np.sin(0.5 * np.pi * np.minimum(1, x / rise)) ** 2 * np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.05))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 70)), room, 0.3, max(0.6, hold)), s, until)
    put(sig, s, g * LV[0] * LC, pan)
    _CE[0] = s + hold + 0.1
def mark(s, g=1.0, step=0.55, last=3.0):
    """the series' mark: the three layers, the business layer between the other two: the music box's D, then its A, then the cello's
    F sharp between them, held"""
    mbox(D4, s, g * 0.8); mbox(A4, s + step, g * 0.72)
    cello(Fs4, s + 2 * step, last, g * 0.85)
def deep(s1, s2, g=1.0):
    """the film's own figure, as deep as it needs: the cello's three plain notes, A, F sharp and D, the middle one divided by the music
    box into six quick notes, as one share went down to its minutes. s1: the first note; s2: the middle one"""
    cello(A3, s1, max(0.6, s2 - s1 - 0.3), g * 0.8)
    cello(Fs3, s2, 1.4, g * 0.8)
    six = (Fs4, A4, D5, Fs5, D5, A4); t6 = [s2 + 0.1 + 0.16 * i for i in range(6)]
    for i, m in enumerate(six):
        nx = next((t6[j] for j in range(i + 1, 6) if six[j] == m), None)   # a tooth plucked again is stopped first
        mbox(m, t6[i], g * (0.6 if i else 0.66), until=nx)
    cello(D3, s2 + 1.62, 2.2, g * 0.8)

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
    """water running in a channel: one soft, even texture that swells in, never a burst of drops"""
    n = int(sec * SR); x = np.arange(n) / SR; edge = np.minimum(1, x / 1.2) * np.clip((sec - x) / 1.4, 0, 1)
    gr = np.abs(filt(_nz(sec + 0.1)[:n], 'low', 9)); gr = 0.65 + 0.35 * gr / max(1e-9, float(gr.max()))
    _fx((filt(_nz(sec)[:n], 'band', (lo, hi)) * gr + 0.6 * filt(_nz(sec)[:n], 'band', (70, 260))) * edge, s, g, pan, 1600)
def pour(s, g=0.004, pan=0.0, sec=1.3):
    """water let into a field, or running along: a soft rush that rises and settles"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec)[:n], 'band', (200, 1200)) * _bump(x, sec, 1.2) * (1 - 0.5 * x / sec), s, g, pan, 1500)
def gate(s, g=0.005, pan=0.0):
    """a wooden board lifted from a channel, or set back: a low knock and a short scrape of wood"""
    n = int(0.32 * SR); x = np.arange(n) / SR
    sc = filt(_nz(0.32)[:n], 'band', (180, 900)) * _bump(x - 0.03, 0.2, 1.0) * (x > 0.03)
    _fx(_knock(n, 170, 0.03) + 0.5 * sc, s, g, pan, 1400)
def lot(s, g=0.004, pan=0.0):
    """a lot drawn and set down: a small wooden token on wood, a dull, short clack"""
    n = int(0.12 * SR); _fx(_knock(n, 380, 0.012) + 0.45 * _knock(n, 560, 0.008, 0.005), s, g, pan, 1800)
def trickle(s, sec, g=0.0018, pan=0.0):
    """water coming into the cup through the hole in its base: a thin, even, quiet stream, swelling in and gone as the cup fills"""
    n = int(sec * SR); x = np.arange(n) / SR; edge = np.minimum(1, x / 0.6) * np.clip((sec - x) / 0.5, 0, 1)
    _fx(filt(_nz(sec)[:n], 'band', (500, 1500)) * edge, s, g, pan, 1700)
def sink(s, g=0.004, pan=0.0):
    """the cup filled, going down: the water closing over its rim, a soft, low gulp, then three bubbles rising, each a small rounded
    note that rises as it nears the surface; then quiet"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    gl = np.sin(2 * np.pi * np.cumsum(np.interp(x, [0, 0.15], [360, 210])) / SR) * np.exp(-x / 0.06) * np.minimum(1, x / 0.004)
    _fx(gl + 0.3 * filt(_nz(0.3)[:n], 'band', (150, 600)) * np.exp(-x / 0.05), s, g, pan, 1200)
    for i, u in enumerate((0.16, 0.38, 0.62)):
        m = int(0.07 * SR); xb = np.arange(m) / SR; f = np.interp(xb, [0, 0.05], [430 + 40 * i, 560 + 40 * i])
        _fx(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-xb / 0.016) * np.minimum(1, xb / 0.003), s + u, g * (0.4 - 0.08 * i), pan, 1400)
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
# 1. A cycle of turns: the opening, the film's story from outside data, with the music box under it and the cello's long, plain notes.
#    The desert from above: D major, spread from the bass up, over the wind, and the cello's D; the chain of shafts lit, a breath of
#    air, and the water reaching the fields, each in its turn, with the cello's A. The cycle: G major as the ring is drawn round, and the
#    day lifted out of it. Another qanat: A major as its channel runs in, the water along it and a gate at every fourth divider, under
#    the cello's A. The village: a gate lifted and the water let in at each field in its turn; the turn missed: B minor. The lots: their
#    panel, a lot set down as each owner's place is drawn, under the cello's F sharp; those at the end of the cycle got none: the water
#    along the turns stops short, and B minor. Every owner's question, a tap each, and the cello's A, asking. The levels: D major as
#    the ladder comes in, a dry rub as each bar is drawn, and the cello's D. The minutes: the film's own figure. The water clock: the
#    basin's water, G major for the mirab, the cup filling through its hole; it sinks: a gulp and three bubbles, and the cello's G for
#    one measure of time. Each owner knew: D major as the ladder comes back, a gate as the water comes, the water along the minutes,
#    a gate as it stops, and the cello's D. Only as deep as each share needs: G major and the cello's G. At the utility: A major, the
#    cello's A and a tap for each tag. In the pause, the title: the mark
K = 'turns'
LV[0] = 1.15
kw = lambda lid, word, off=0: W(K, lid, word, off)
kc = lambda lid, off=0: G(K, lid, off)
tB = kc('breath'); END1 = E(K)
XG = [1554, 1724, 1894, 2064]                       # the fields' gates in the cut-away village (ba.js BA_VFIELDS, less 6)
sx = lambda wx, cx=1880, z=2.0: px(960 + (wx - cx) * z)  # a gate's place on screen while the camera is on the village
tQa, tTu = kw('edge', 'a tunnel', -0.2), kw('edge', 'each owner in turn', -0.3)
tCy, tTw, tFi = kc('cycle'), kw('cycle', 'the turns', -0.2), kw('cycle', 'fifteen shares', -0.2)
tCo, tWp, tCe = kc('complex'), kw('complex', 'the water passed', -0.2), kw('complex', 'certain fields', -0.3)
tMi, tTm, tDry = kc('missed'), kw('missed', 'A turn missed', -0.2), kw('missed', 'leave a field dry', -0.3)
tDr, tPl, tLa, tNo0 = kw('lots', 'drew lots', -0.3), kw('lots', 'their place', -0.6), kc('last'), kw('last', 'usually got none', -0.3)
tNe, tWk, tSt = kc('needed'), kw('needed', 'when their water would come', -0.3), kw('needed', 'when it would stop', -0.3)
tLv, tDa, tSh, tPa = kc('levels'), kw('levels', 'its days', -0.6), kw('levels', "each day's shares", -0.2), kw('levels', 'six parts', -0.3)
tHe, tSi = kw('minutes', 'heirs and buyers', -0.3), kw('minutes', 'single minutes', -0.3)
tCl, tMr, tFl, tSk, tOm = kc('clock'), kw('clock', 'The mirab', -0.1), kw('clock', 'a metal cup', -0.2), kw('sank', 'sank', -0.4), kw('sank', 'one measure', -0.2)
tKn, tCm, tSp, tSm = kc('knew'), kw('knew', 'when their water would come', -0.3), kw('knew', 'when it would stop', -0.3), kw('knew', 'a single minute', -0.3)
tDp, tNo = kc('deep'), kw('deep', 'only as deep', -0.3)
tLi, tL1, tL2 = kc('link'), kw('link', 'its processes drawn in levels', -0.2), kw('link', 'only as deep', -0.2)
# from above: the qanat's chain of shafts lit, its water reaching the fields, each in its turn
mspread((D4, Fs4, A4, D5), S0(K) + 0.6, 0.85)
cello(D3, S0(K) + 1.5, 4.2, 0.8)
wind(S0(K), tCy + 0.4 - S0(K), 0.0055, 0.0)
air(tQa, 2.4, 0.003, px(560))
water(tTu - 0.3, tCy - tTu + 0.3, 0.0034, px(1380))
cello(A3, tTu + 0.15, 2.8, 0.72, until=tCy - 0.2)
# the cycle: one of Mahan's four qanats, the ring of twelve days drawn round, and one day lifted out of it, its fifteen shares
mspread((G4, B4, D5), tCy - 0.1, 0.75)
air(tTw, 2.2, 0.003, px(520))
slide(tFi, 1.0, 0.003, px(1330))
# another qanat: its channel runs in, and the water passes its twelve dividers, each sending it to its fields in turn
mspread((A4, Cs5, E5, A5), tWp, 0.7)
knock(tCo - 0.1, 0.004, px(1410))
water(tWp, tCe + 12 * 0.42 + 0.6 - tWp, 0.0034, px(1410))
for i in (0, 4, 8):
    gate(tCe + 0.42 * i, 0.004, px(1074 + 62 * i))
cello(A3, tCe + 0.1, 3.4, 0.7, until=tMi - 0.6)
# the village: each field's water in its turn, the third missed, and that field drying
wind(tMi - 1.0, tLv - tMi + 0.4, 0.005, 0.0)
water(tMi - 0.8, tNe + 2.0 - tMi, 0.0036, sx(2230))
for i, u in ((0, -0.6), (1, 0.6), (3, 2.0)):
    gate(tTm + u, 0.0045, sx(XG[i])); pour(tTm + u + 0.2, 0.0035, sx(XG[i]), 1.1)
mspread((D4, Fs4, B4), tDry + 0.1, 0.72)
cello(B3, tDry + 0.4, 2.6, 0.7, until=tDr - 0.2)
# the lots: their panel over the village, and a lot set down as each owner's place in the cycle is drawn
card(tDr - 0.4, 0.004, px(1280))
cello(Fs3, tDr + 0.1, 2.8, 0.66, until=tLa)
for j in range(7):
    lot(tPl + 0.42 * j + 0.12, 0.0035, px(1220 + 580 / 7 * (j + 0.5)))
# those near the end of the cycle: the water along the turns stops short, and none for the last
pour(tLa - 0.2, 0.0034, px(1430), 1.5)
mspread((B4, D5, Fs5), tNo0 + 0.05, 0.7)
cello(B3, tNo0 + 0.4, 2.2, 0.66, until=tNe + 0.6)
# every owner's two questions, and the cello's A, asking
tap(tWk, 0.0035, px(960 + (1640 - 1900) * 2.2)); tap(tSt, 0.0035, px(960 + (2150 - 1900) * 2.2))
cello(A3, tWk + 0.2, 3.0, 0.66, until=tLv - 0.4)
# the cycle kept in levels: the ladder comes in, a bar at a time
mspread((D4, Fs4, A4, D5, Fs5), tLv - 0.3, 0.8)
cello(D3, tLv + 0.4, 3.2, 0.72, until=tHe - 0.2)
for t0 in (tDa, tSh, tPa):
    slide(t0 + 0.05, 0.8, 0.0028, px(960))
# a share split among heirs and buyers, down to single minutes: the film's own figure
deep(tHe, tSi)
# the water clock: the basin's water, the mirab, and the cup filling through the hole in its base
water(tCl - 0.6, tKn - tCl - 0.2, 0.0026, px(1060), 300, 1100)
mspread((G4, B4, D5, G5), tMr, 0.7)
trickle(tFl + 0.1, tSk - tFl, 0.0018, px(968))
# it fills and sinks: one measure of time
sink(tSk + 0.05, 0.004, px(968)); knock(tSk + 0.9, 0.0028, px(976), 150)
cello(G3, tOm, 2.4, 0.66, until=tKn - 0.4)
# each owner knew when their water would come and when it would stop, down to a single minute
mspread((Fs4, A4, D5), tKn - 0.4, 0.75)
gate(tCm, 0.004, px(470)); water(tCm, tSp - tCm + 0.8, 0.003, px(700)); gate(tSp + 0.1, 0.004, px(1000))
cello(D3, tSm, 2.6, 0.7, until=tNo - 0.1)
# only as deep as each share needs
mspread((G4, B4, D5), tNo + 0.05, 0.7)
cello(G3, tNo + 0.5, 2.6, 0.66, until=tLi - 0.3)
# at the utility: its processes drawn in levels, and only as deep as each one needs
mspread((A4, Cs5, E5), tLi, 0.7)
cello(A3, tLi + 0.5, 3.0, 0.66, until=tL2 + 1.6)
tap(tL1 + 0.1, 0.0035, px(960)); tap(tL2 + 0.1, 0.0035, px(960))
# the pause: the title, and the mark
mark(tB + 0.9, 0.85, last=END1 - tB - 2.4)

# 2. Where it's born: Tomás's next note on the wall, and G major as it comes in, high. His matrix comes in, a dry rub; its creating
#    squares lit, a tap; a capability, a tap, and not how the work runs, a knock. The processes: the cello's A, and a knock as their
#    tag lands
K = 'note'
LV[0] = 1.0
nw_ = lambda lid, word, off=0: W(K, lid, word, off)
nc = lambda lid, off=0: G(K, lid, off)
card(S0(K) + 0.7, 0.004, px(860))
mspread((G4, B4, D5, G5), S0(K) + 0.8, 0.7)
slide(nc('matrix', -0.5), 1.0, 0.003, px(700))
tap(nw_('matrix', 'which capability creates', -0.2), 0.0032, px(900))
tap(nw_('matrix', 'what the utility can do', -0.2), 0.0032, px(1090)); knock(nw_('matrix', 'how the work runs', -0.2), 0.0035, px(1090))
tPr = max(nw_('process', 'the processes', -0.2), nc('process', 0.5))
knock(tPr, 0.004, px(960)); cello(A3, tPr + 0.1, 2.2, 0.7)

# 3. Four bands: the picture carries on from the wall. Grace's process map drawn: D major, and a knock as each band lands. The bands
#    only sort them: a tap. The operational band: a tap, and a breath of air along it as its three processes are named. An empty band:
#    the strategic and the evaluation bands' processes left as outlines, a knock each, and the cello's B for the finding. Level one:
#    a breath of air as the thirteen light, and A major as their tag lands
K = 'bands'
bw_ = lambda lid, word, off=0: W(K, lid, word, off)
bc = lambda lid, off=0: G(K, lid, off)
tGr = bw_('map', "Grace's", -0.3)
mspread((D4, Fs4, A4, D5), tGr + 0.1, 0.7)
for k in range(4):
    knock(tGr + 0.6 * (k + 1) - 0.3, 0.0032, px(830))
tap(bw_('sort', 'only sort them', -0.2), 0.0032, px(830))
tap(bw_('ops', 'the work customers feel', -0.2), 0.0032, px(830)); air(bw_('ops', 'connecting a home', -0.3), 2.6, 0.003, px(830))
tD, tMs = bw_('empty', 'nobody setting direction', -0.3), bw_('empty', 'nobody measuring', -0.3)
knock(tD, 0.0035, px(830)); cello(B3, tD + 0.2, 2.2, 0.66); knock(tMs, 0.0035, px(830))
air(bw_('one', 'These thirteen', -0.1), 1.4, 0.003, px(830))
mspread((A4, Cs5, E5), bw_('one', 'level one', -0.2), 0.66)

# 4. Levels, and how deep: the map's macro processes move into a row, a breath of air; G major as level two is named, a tap for meter
#    to cash, a dry rub as its processes grow under it, the level-2 card laid down and a tap for each thing a process has. Level three:
#    a dry rub as its flow is drawn; level four, a tap, kept out of the model, a knock. The reference: a card. Breadth first: the
#    branches grow everywhere, a breath of air, and D major. Depth on pain: a dry rub as the branch is drawn deeper, and the cello's B
#    for what hurts. The branches not drawn deeper: a pen as their dashed feet are drawn. As in Mahan: its card, and D major with the
#    cello's D
K = 'levels'
lw_ = lambda lid, word, off=0: W(K, lid, word, off)
lc = lambda lid, off=0: G(K, lid, off)
tL2_ = lw_('two', 'Level two', -0.2)
air(S0(K) + 0.3, 1.6, 0.003, px(960))
mspread((G4, B4, D5), tL2_ - 0.1, 0.66)
tap(tL2_, 0.0032, px(889)); slide(tL2_ + 0.3, 0.9, 0.0028, px(889)); card(tL2_ + 0.4, 0.004, px(1580))
for word in ('a trigger', 'an output', 'one person accountable'):
    tap(lw_('two', word, -0.2), 0.003, px(1500))
slide(lw_('three', 'drawn as a flow', -0.4), 0.8, 0.0028, px(1060)); tap(lw_('three', 'Level four', -0.2), 0.003, px(810))
knock(lw_('three', 'stays out', -0.3), 0.0035, px(950))
card(lw_('apqc', "APQC's process framework", -0.3), 0.004, px(385))
air(lw_('breadth', 'everywhere', -0.6), 1.8, 0.003, px(960)); mspread((D4, Fs4, A4), lw_('breadth', 'everywhere', -0.5), 0.66)
slide(lw_('pain', 'level three only', -0.3), 0.7, 0.0028, px(1060)); cello(B3, lw_('pain', 'what hurts', -0.3), 2.4, 0.66)
pen(lw_('says', "weren't drawn deeper", -0.3), 0.8, 0.003, px(960), 3)
tMa = lw_('mahan', 'As in Mahan', -0.2)
card(tMa, 0.004, px(1580)); mspread((Fs4, A4, D5, Fs5), tMa + 0.2, 0.66); cello(D3, tMa + 0.7, 2.6, 0.66)

# 5. Meter to cash: the tree leaves, a breath of air; meter to cash moves to the top, a dry rub, and A major as it lights; a tap for
#    each of its tags. Level two: a tap. The SIPOC laid down, the cello's G under it, and a pen for its trigger and owner. The SIPOC
#    leaves, a dry rub; the concepts laid down and their lines drawn. Born in the process that first writes them: a tick for each,
#    and D major. The payment, not on the map yet: a pen as its outline is drawn, the cello's B, and a tick where it's born
K = 'cash'
cw_ = lambda lid, word, off=0: W(K, lid, word, off)
ccq = lambda lid, off=0: G(K, lid, off)
air(S0(K) + 0.1, 0.9, 0.003, px(960)); slide(S0(K) + 0.5, 1.4, 0.0028, px(866))
mspread((A4, Cs5, E5, A5), cw_('m2c', 'Meter to cash', -0.1), 0.66)
tap(cw_('m2c', 'one macro process', -0.2), 0.003, px(560)); tap(cw_('m2c', "from a meter's reading", -0.2), 0.003, px(1240))
tap(cw_('five', 'At level two', -0.2), 0.003, px(1460))
tSi_ = ccq('sipoc')
card(tSi_ - 0.2, 0.0045, px(870)); cello(G3, tSi_ + 0.1, 2.4, 0.66)
pen(cw_('sipoc', 'its trigger', -0.3), 0.6, 0.003, px(870), 2)
tOb = ccq('objects')
slide(tOb - 0.5, 0.6, 0.0028, px(870)); card(tOb, 0.004, px(745)); slide(tOb + 0.1, 0.6, 0.0028, px(745))
tR, tBl = cw_('born', 'readings in reading meters', -0.3), cw_('born', 'bills in making bills', -0.3)
ticked(tR + 0.1, 0.0035, px(300)); ticked(tBl + 0.1, 0.0035, px(1190)); mspread((Fs4, A4, D5), tR + 0.15, 0.66)
pen(cw_('missing', 'the payment', -0.3), 0.7, 0.003, px(1510), 3)
cello(B3, cw_('missing', "wasn't on the map yet", -0.3), 2.0, 0.66)
ticked(cw_('missing', 'born in collecting', -0.2), 0.0035, px(1510))

# 6. Where it hurts: only check readings stays lit, a soft knock. Last winter's complaints, doubled: their card, a knock, and B minor
#    with the cello's B; two in three about estimated bills, a knock. Every night: the meters set down, a knock; their readings rise, a
#    breath of air; one sends none, a low knock; one fails, a knock; the estimate laid down and its line drawn. Estimate after
#    estimate: a tap as each bill rises, and a knock for the one that caught up, with the cello's F sharp. Check readings goes to
#    level three: the film's own figure again; BPMN's step, a tap, their order, a line drawn, and the choice, a knock
K = 'pain'
pw_ = lambda lid, word, off=0: W(K, lid, word, off)
pc = lambda lid, off=0: G(K, lid, off)
knock(pw_('one', 'one branch', -0.2), 0.003, px(400))
tCx = pw_('farah', 'complaints about bills doubled', -0.3)
knock(tCx, 0.004, px(380)); mspread((B4, D5, Fs5), tCx + 0.1, 0.66); cello(B3, tCx + 0.5, 2.4, 0.66)
knock(pw_('farah', 'two in three', -0.3), 0.004, px(1010))
tSe = pw_('nightly', 'send a reading', -0.2)
knock(pc('nightly', -0.2), 0.003, px(390), 170); air(tSe, 1.6, 0.003, px(400))
knock(pw_('nightly', "When one doesn't", -0.2), 0.0032, px(390), 140); knock(pw_('nightly', 'fails a check', -0.2), 0.0032, px(630))
tEs = pw_('nightly', 'uses an estimate', -0.3)
card(tEs, 0.004, px(1050)); slide(tEs + 0.2, 0.6, 0.0026, px(1000))
tBs = pw_('weeks', 'estimate after estimate', -0.4)   # the bills rise one every 0.65 s from 0.4 s before the words
for k in range(3):
    tap(tBs + 0.65 * k + 0.15, 0.003, px(220 + 170 * k))
knock(tBs + 0.65 * 3 + 0.2, 0.004, px(730)); cello(Fs3, tBs + 0.65 * 3 + 0.3, 2.2, 0.64, until=pc('deeper'))
deep(pc('deeper', 0.1), pw_('deeper', 'level three', -0.3))
tap(pw_('deeper', 'steps', -0.1), 0.003, px(505)); slide(pw_('deeper', 'their order', -0.2), 0.5, 0.0026, px(666))
knock(pw_('deeper', 'the choices', -0.2), 0.0032, px(790))

# 7. Level three: check readings, drawn in BPMN, its tag a tap; G major as the flow is drawn: the start, a tap; the check, a knock; its
#    note, a pen. It passes: the choice, a tap; to billing, a knock. It fails, or never came: the end drawn, a knock; the estimate, a
#    knock; in its place, a line drawn. A second kind of reading, born here: the data object laid down, the cello's A, and one quick
#    note of the music box as it's born, at the finest level. The data team's tables: the flow leaves, a breath of air; the table laid
#    down; taken from the meters, no estimate in it: B minor with the cello's B, and a knock for what's missing; the question laid
#    down. Grace decides: the glossary's card, a pen for its line, a tick, and G major. The head of retail: the bill laid down, its
#    stamp; the ticket laid down; the estimates written into the table, a pen. Now Farah can see: her count set down, a knock, a tap
#    for how long, and D major, the cello's D held into the pause
K = 'flow'
fw_ = lambda lid, word, off=0: W(K, lid, word, off)
fc = lambda lid, off=0: G(K, lid, off)
tap(S0(K) + 1.6, 0.003, px(560))
tG = fw_('gather', 'every reading is checked', -0.6)
mspread((G4, B4, D5, G5), tG, 0.62)
tap(tG + 0.05, 0.003, px(150)); knock(tG + 0.62, 0.0032, px(410)); pen(tG + 1.2, 0.6, 0.0028, px(420), 2)
tPs, tFa_ = fc('pass'), fc('fail')
tap(tPs - 0.2, 0.003, px(690)); knock(tPs + 0.3, 0.0032, px(1160))
knock(tFa_ - 0.2, 0.0032, px(1430)); knock(tFa_ + 0.47, 0.0032, px(690)); slide(tFa_ + 1.13, 0.7, 0.0026, px(1000))
tSec = fw_('sees', 'a second kind of reading', -0.4)
card(tSec, 0.004, px(1090)); cello(A3, tSec + 0.1, 2.4, 0.64)
mbox(E5, fw_('sees', 'born here', -0.2), 0.6, pan=px(1090))
tSm_ = fc('same')
air(tSm_ - 0.6, 0.6, 0.0026, px(800)); card(tSm_ - 0.1, 0.0045, px(460))
tBo = fw_('same', 'took readings from the meters', -0.3)
mspread((Fs4, B4, D5), tBo, 0.64); cello(B3, tBo + 0.4, 2.2, 0.64)
knock(tBo + 0.2, 0.0032, px(460)); card(fw_('same', "Farah couldn't see", -0.3), 0.004, px(1230))
tGr_ = fc('grace')
card(tGr_ - 0.2, 0.0045, px(1230)); pen(fw_('grace', 'what the check sends on', -0.3), 0.8, 0.003, px(1080), 3)
tDc = fw_('grace', 'decides', -0.1)
ticked(tDc, 0.0035, px(1090)); mspread((G4, B4, D5), tDc + 0.1, 0.62)
tRe = fc('retail')
card(tRe - 0.2, 0.0045, px(260)); stamp(fw_('retail', 'each bill says', -0.2), 0.0042, px(310))
card(fw_('retail', 'a ticket', -0.3), 0.0045, px(1230)); pen(fw_('retail', 'take readings from the check', 0.2), 1.2, 0.003, px(660), 4)
tFh = fc('farah')
knock(tFh + 0.05, 0.004, px(1230)); tap(fw_('farah', 'for how long', -0.2), 0.003, px(1150))
mspread((D4, Fs4, A4, D5), tFh + 0.3, 0.64); cello(D3, tFh + 0.9, E(K) - tFh - 1.9, 0.64)

# 8. The data practice on the map: the flow and its people leave first, and the chapter turns on G major, high, as the map comes in;
#    its title, a dry rub. The data team's own processes join it, a knock each. Each drawn like the utility's: the card laid down, and
#    each reads meter readings, its line drawn. None goes deeper: a pen as its level 3, not drawn, is outlined, and the cello's D
K = 'practice'
qw = lambda lid, word, off=0: W(K, lid, word, off)
qc = lambda lid, off=0: G(K, lid, off)
slide(S0(K) + 0.2, 0.7, 0.0026, px(500)); mspread((B4, D5, G5), S0(K) + 0.6, 0.62)
for word in ('answering a data request', 'building a data product', 'taking on a source'):
    knock(qw('joins', word, -0.3), 0.0035, px(800))
card(qw('same', 'its trigger', -0.3), 0.004, px(800)); slide(qw('same', 'what it reads and writes', -0.3), 0.9, 0.0026, px(1050))
tNd = qw('none', 'None goes deeper', -0.2)
pen(tNd, 0.4, 0.003, px(650), 2); cello(D3, tNd + 0.1, 2.3, 0.64)

# 9. As deep as it needs: back to the qanat's cycle, in its levels, and D major as at the film's start; only the split share down to
#    the minute, the cello's F sharp; every owner knew when their water would come: a gate, and the water along the minutes. At the
#    utility: the wall comes back, a breath of air as every process is drawn to level two, and A major; the branch that hurt drawn
#    deeper, a dry rub, and a tap for each tag. Tomás's next note goes up, paper, and its question on the cello: B, then A. Under the
#    end card, without words, the mark, its F sharp held to the end
K = 'end'
ew = lambda lid, word, off=0: W(K, lid, word, off)
ec = lambda lid, off=0: G(K, lid, off)
tU, tN, tB9 = ec('utility'), ec('next'), ec('breath')
mspread((D4, Fs4, A4, D5, Fs5), S0(K) + 0.4, 0.7)
cello(Fs3, ew('village', 'down to the minute', -0.3), 2.2, 0.62)
tK = ew('village', 'every owner knew', -0.3)
gate(tK, 0.004, px(470)); water(tK, 2.8, 0.003, px(700))
air(tU - 0.9, 1.3, 0.003, px(960))
tL2e, tHu, tEe = ew('utility', 'drawn to level two', -0.3), ew('utility', 'the branch that hurt', -0.3), ew('utility', 'an estimate is born', -0.3)
mspread((A4, Cs5, E5), tL2e, 0.62)
slide(tHu, 0.6, 0.0026, px(1060)); tap(tHu + 0.2, 0.003, px(1340)); tap(tEe, 0.003, px(1380))
card(tN - 0.2, 0.0045, px(860))
tQ = ew('next', 'what the business expects', -0.1)
cello(B3, tQ, 0.9, 0.6); cello(A3, tQ + 1.05, 1.6, 0.6)
mark(tB9 + 1.7, 0.85, step=0.6, last=E(K) - tB9 - 3.6)
