# No two alike: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, its own (the module's palettes.md, reserved by this film's thread on 12 November 2026): a bass clarinet and a plucked
# double bass, as a pair. Both are on the site, never together, and no film of this module plays either; both are made here.
#  - The bass clarinet: one reed, low and hollow. It breathes a note out and can hold it: the one who thinks afterwards.
#  - The double bass, plucked: the finger pulls the string aside and lets it go. It speaks at once and lets go: the one who thinks aloud.
# The mark: one question, three rising notes (C sharp, E sharp, B: the chord that asks, left open). In the opening Zilu asks it on the
#    plucked bass, quick, and the answer comes in the other voice, held back: the clarinet, falling, slower (B, A sharp, F sharp). Ran You
#    asks the very same notes on the clarinet, slowly, and is urged on: the bass, rising further (C sharp, E sharp, F sharp). Under the
#    title both ask, and nobody answers yet. At the university Helena asks it softly, and Erin's answer comes on the clarinet, in her own
#    time; when the meeting gives everyone a turn it's asked once more and answered by each voice in turn, never the same way twice; and
#    under the end card the two answer together.
# F sharp major, D sharp minor for the problem. Every interval that sounds together is tuned pure from F sharp (just intonation, see
#    hz()): F sharp, B and C sharp major, D sharp and A sharp minor are pure in this table. G sharp is pure with C sharp only, and B is
#    never held with E sharp: those meet in a tune, one after the other. The scale's fourth and seventh notes are in the mark, so no tune
#    reads as five-note; nothing Chinese for Lu (no zither, chimes, bells, flute, mouth organ or wood block: the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: one voice to a note, steady, no vibrato or bend, its partials harmonic; each note gone before the next
#    chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/na_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 15 dB under the music.

import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    """when a word of a line is spoken, as the film's own wAt() estimates it; a missing word, or one inside a longer word, stops the mix"""
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def Z(sid, lid, off=0):
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1721)  # this film's own randomness: the room, the paper, the pen

# ---- tuning: just intonation from F sharp, so notes that sound together are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 42, 12)
    return 92.49861 * 2 ** o * _JI[pc]
Fs1, B1, Cs2, Ds2, Es2, Fs2, Gs2, As2, B2 = 30, 35, 37, 39, 41, 42, 44, 46, 47
Cs3, Ds3, Es3, Fs3, Gs3, As3, B3, Cs4 = 49, 51, 53, 54, 56, 58, 59, 61

# ---- the levels: the breathed reed and the plucked string matched by loudness, as far under the voice as the module's other music; the
# effects about 15 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LC, LB, FX = 0.041, 0.075, 4.2
LV = [1.0]

# a small wooden room round the two players, ringing for under a second. Its level is set by what it rings where the notes are (its
# gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.014 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a chapter's end): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig

# ---- the bass clarinet. Its tube is closed at the reed, so under its tone holes' cutoff (about 600 Hz) a note is its odd partials, the
# even ones faint: the hollow sound. Above the cutoff all of them sound, falling away fast; and the lowest partials leave the
# instrument less easily than the rest, so a low note is carried by its third, fifth and seventh, as a small speaker needs. A note is
# breathed in: the low partials first, the higher ones a moment later, with a little air through the reed as it starts; then it's held
# steady, and let go. Every note is set to the same loudness over its held part, whatever its pitch
def _rms(x):
    return float(np.sqrt((np.asarray(x, np.float64) ** 2).mean())) if len(x) else 0.0
def clar(m, s, d, g=1.0, pan=None, att=0.1, rel=0.14, room=0.22, until=None, air=1.0):
    """the bass clarinet at s, held d seconds; att and rel are how slowly it's breathed in and let go (a slurred note: short ones)"""
    f0 = hz(m)
    if until is not None:
        d = min(d, max(0.2, until - s - 4 * rel - 0.2))
    n = int((d + 5 * rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 40):
        fk = f0 * k
        if fk > 2300:
            break
        odd = k % 2 == 1
        w = (1.0 if odd else 0.05) / k ** 0.95 if fk < 600 else (0.8 if odd else 0.4) / k ** 0.95 * np.exp(-(fk - 600) / 520)
        w *= fk / np.sqrt(fk * fk + 160.0 ** 2)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.14 * (k - 1))), 1)) ** 2
        off = np.where(x > d, np.exp(-(x - d) / (rel / (1 + 0.22 * (k - 1)))), 1.0)
        sig += w * on * off * np.sin(2 * np.pi * fk * x + 0.37 * k)
    if d >= 1.0:                                     # a long breath is a little fuller in its middle; nothing in it moves faster
        sig *= 0.9 + 0.1 * np.sin(np.pi * np.clip(x / d, 0, 1))
    a, b = min(0.3, d * 0.3), d
    sig *= 0.45 / max(1e-9, _rms(sig[int(a * SR):int(b * SR)]))
    br = filt(noise(n / SR + 0.02)[:n], 'band', (350, 1300))
    br = br / max(1e-9, float(np.abs(br).max())) * (0.01 * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05)) + 0.04 * air * np.exp(-x / 0.06))
    sig = filt(filt((sig + br).astype(np.float32), 'low', 2100), 'high', 45)
    sig = _until(_room(sig, room, a, b), s, until)
    put(sig, s, g * LV[0] * LC, max(-0.3, min(0.3, 0.1 + (m - 48) * 0.012)) if pan is None else pan)

# ---- the double bass, plucked. A long, heavy string pulled aside a sixth of the way along and let go: it speaks at once, round and low,
# its higher partials gone within a moment, and it dies away by itself; the hand may stop it sooner. Under it, the fingertip's soft thump
# and the big body's own warmth. The partials are harmonic, so nothing in a ringing note beats. Every note is set to the same loudness
# over its first four tenths of a second
def _body(f):
    return (1 + 0.6 * np.exp(-((f - 105) / 55) ** 2) + 0.5 * np.exp(-((f - 195) / 70) ** 2)) / (1 + (f / 900) ** 2)
def bass(m, s, g=1.0, pan=None, ring=None, room=0.16, until=None):
    """the double bass plucked at s; ring seconds later the hand stops the string (else it dies away by itself)"""
    f0 = hz(m); t1 = 1.25 * (65 / f0) ** 0.4; d = ring if ring else min(3.0, 2.4 * t1)
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 32):
        fk = f0 * k
        if fk > 1500:
            break
        a = abs(np.sin(np.pi * k * 0.17)) / k ** 1.05 * _body(fk) * fk / np.sqrt(fk * fk + 70.0 ** 2)
        sig += a * np.sin(2 * np.pi * fk * x + 0.5 * k) * np.exp(-x * (1 + 0.42 * (k - 1)) / t1)
    sig *= (1 - np.exp(-x / 0.004)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig *= 0.42 / max(1e-9, _rms(sig[:int(min(0.4, d) * SR)]))
    th = filt(noise(sec + 0.02)[:n], 'band', (70, 330)) * np.exp(-x / 0.016)
    sig = (sig + 0.09 * th / max(1e-9, float(np.abs(th).max()))).astype(np.float32)
    sig = _until(_room(filt(filt(sig, 'low', 1450), 'high', 32), room, 0.0, min(0.8, d)), s, until)
    put(sig, s, g * LV[0] * LB, max(-0.3, min(0.3, -0.12 + (m - 42) * 0.012)) if pan is None else pan)

# ---- what they play
def pluck(notes, s, g=1.0, step=0.22, ring=0.4, last=None, pan=None, until=None, swell=0.0):
    """the bass, a note at a time: each stopped as the next is plucked, the last left to ring (last seconds, or until it dies away)"""
    k = len(notes)
    for i, m in enumerate(notes):
        bass(m, s + step * i, g * (1 + swell * i), pan, last if i == k - 1 else min(ring, step + 0.12), until=until)
def breathe(notes, s, g=1.0, step=0.55, last=1.4, pan=None, until=None, att=0.1, air=1.0):
    """the clarinet, one breath: the first note breathed in, the others slurred from it, the last held (last seconds) and let go"""
    k = len(notes)
    for i, m in enumerate(notes):
        clar(m, s + step * i, last if i == k - 1 else step + 0.02, g, pan, att if i == 0 else 0.045, 0.14 if i == k - 1 else 0.035,
             until=until, air=air if i == 0 else 0.0)
ASK = (Cs2, Es2, B2)                      # the question: three rising notes, left open
HELD_BACK, URGED_ON = (B2, As2, Fs2), (Cs3, Es3, Fs3)    # the two answers: falling, slower; rising further
def ask_plucked(s, g=1.0, octave=0, step=0.22, last=1.5, pan=None, until=None):
    pluck(tuple(m + 12 * octave for m in ASK), s, g, step, 0.4, last, pan, until, swell=0.06)
def ask_breathed(s, g=1.0, octave=0, step=0.55, last=1.3, pan=None, until=None):
    breathe(tuple(m + 12 * octave for m in ASK), s, g, step, last, pan, until, att=0.13)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2000):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top, 4)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.4 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def sheet(s, g=0.0036, pan=0.0):
    """a sheet put up on the wall: a soft flap of paper, and the dull press of its pin"""
    n = int(0.18 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.2)[:n], 'band', (420, 1700)) * _bump(x, 0.08) * (x < 0.08)
    _fx(fl + 0.55 * _knock(n, 165, 0.016, 0.075) / 1.3, s, g, pan, 1800)
def tap(s, g=0.0032, pan=0.0):
    """a tag or a pill set in place: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (260, 1000)) * np.exp(-x / 0.006) + 0.6 * _knock(n, 230, 0.011), s, g, pan, 1500)
def laid(s, g=0.0045, pan=0.0):
    """something wrapped set down on a woven mat: a low, soft thud and the mat's short rustle"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    ru = filt(noise(0.32)[:n], 'band', (500, 1600)) * _bump(x - 0.02, 0.16, 1.5) * (x > 0.02) * (x < 0.18)
    _fx(_knock(n, 92, 0.03) + 0.3 * ru, s, g, pan, 1500)
def rub(s, sec=0.9, g=0.0034, pan=0.0):
    """a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (220, 1250)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def riffle(s, sec=1.2, g=0.0034, pan=0.0, k=4):
    """several pages put up one after another: one soft run of paper, a few gentle swells in it, never separate clicks"""
    n = int(sec * SR); x = np.arange(n) / SR
    sw = 0.55 + 0.45 * np.sin(np.pi * k * x / sec) ** 2
    _fx(filt(noise(sec + 0.02)[:n], 'band', (450, 1700)) * _bump(x, sec, 1.2) * sw, s, g, pan, 1800)
def patter(s, sec=2.0, g=0.003, pan=0.0):
    """many small marks landing on a scale: one soft, grainy texture that comes in and thins out, never a burst of ticks"""
    n = int(sec * SR); x = np.arange(n) / SR
    gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 22)); gr = gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 950)) * _bump(x, sec, 0.9) * (0.35 + 0.65 * gr), s, g, pan, 1200)
def pen(s, sec=0.7, g=0.0036, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (600, 1700)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 1900)
def ticked(s, g=0.0034, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.22, g, pan, 2)
def hop(s, sec=0.9, g=0.0032, pan0=0.0, pan1=0.0):
    """a counter lifted from one place and set down in the next: a faint lift, and a soft landing"""
    n = int(0.06 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.08)[:n], 'band', (500, 1500)) * np.exp(-x / 0.012), s, g * 0.6, pan0, 1700)
    tap(s + sec, g, pan1)

# =============================================================================================================================
# 1. Two answers: the opening. The series' bridge, far off: the two voices, a pluck and a breath, on F sharp, then B as the film leaves
#    it, then C sharp, waiting. Lu: F sharp, low, and the clarinet's slow rise of a fifth as the hall comes in. The gift set down on the
#    mat; "of every kind": B, low and high. Zilu, bold: two quick plucks up to F sharp. Ran You, who holds back: one soft breath that
#    stops. One rule for both: D sharp minor, bare. "Go ahead": the bass runs up, too far. "Wait": nothing, for Ran You never starts.
#    Each needs his own answer: C sharp, waiting. Then the mark: Zilu's question, plucked, and the teacher's answer, breathed, falling,
#    slower; Ran You's question, the same notes breathed, and the answer plucked, rising further. Gongxi's "may I ask": the question's
#    last step, alone. The teacher's reason: a step of each answer. Each gets the answer he needs: F sharp, low and high. Yes to both:
#    B; decisive, one firm pluck on C sharp; skilled, two neat notes up to E sharp; and both among the seventy-seven: F sharp, together.
#    The team's room: the hall's rise, an octave up; one way for all leaves someone out: D sharp, alone. Under the title both ask, the
#    bass, then the clarinet, and its last note is left open
LV[0] = 0.9
ow = lambda lid, word, off=0: W('lu', lid, word, off)
oc = lambda lid, off=0: G('lu', lid, off)
END = E('lu')
luT = oc('where', -0.6)
bass(Fs1, 0.6, 0.85, 0.0, ring=2.6); clar(Cs3, 1.1, 1.5, 0.75, 0.0, att=0.2)
bass(B1, ow('aside', 'leaves', 0.0), 0.75, 0.0, ring=2.0); clar(Ds3, ow('aside', 'leaves', 0.45), 1.3, 0.65, 0.0, att=0.16)
bass(Cs2, ow('aside', 'person', -0.1), 0.75, 0.0, ring=2.0); clar(Es3, ow('aside', 'person', 0.35), 1.5, 0.65, 0.0, att=0.16)
# Lu: the hall comes in, where and when
bass(Fs1, luT + 0.3, 0.85, px(700) * 0.4, ring=2.8)
clar(Fs2, luT + 0.7, 1.15, 0.75, px(1200) * 0.4, att=0.18); clar(Cs3, luT + 1.85, 1.9, 0.75, px(1200) * 0.4, att=0.05, air=0.0)
# the teacher, and the gift at the near end of his mat (the camera is close on him: where each thing is on screen)
bass(B1, ow('gift', 'So', -0.1), 0.7, px(500) * 0.4, ring=2.0); clar(Fs3, ow('gift', 'kind', -0.5), 1.4, 0.6, px(1300) * 0.4, att=0.14)
# the two students: Zilu on the left, bold, and Ran You beside him, who holds back (the camera wide on the two of them)
pluck((Cs2, Fs2), oc('bold', 0.0), 0.95, 0.13, last=1.3, pan=px(450) * 0.5)
clar(As2, oc('holds', 0.1), 1.1, 0.5, px(960) * 0.5 + 0.12, att=0.24, rel=0.2)
# one rule for both would fail one of them: D sharp minor, bare; go ahead, and the bass runs too far; wait, and nothing
bass(Ds2, oc('rule', 0.4), 0.8, -0.1, ring=1.7); clar(As2, oc('rule', 0.75), 1.2, 0.55, 0.12, att=0.14)
pluck((Ds2, Fs2, As2), ow('tell', 'Zilu', -0.1), 0.8, 0.14, last=0.9, pan=px(450) * 0.5, swell=0.12)
bass(Cs2, ow('need', 'needs', -0.2), 0.75, -0.1, ring=1.6); clar(Gs2, ow('need', 'answer', -0.1), 1.2, 0.55, 0.12, att=0.14)
# the same question, twice, and an answer for each
ask_plucked(ow('zilu', 'should', 0.0), 0.95, pan=px(320) * 0.5)
breathe(HELD_BACK, ow('first', 'your', 0.2), 0.75, 0.8, 1.5, px(1420) * 0.4, att=0.14)
ask_breathed(ow('ranyou', 'asks', 0.0), 0.6, step=0.5, last=0.8, pan=px(660) * 0.4)
pluck(URGED_ON, ow('ranyou', 'act', 0.0), 0.95, 0.17, last=1.4, pan=px(1440) * 0.4, swell=0.08)
# the third student, who heard both answers
breathe((Es3, B3), ow('third', 'May', -0.1), 0.5, 0.5, 0.9, px(1320) * 0.4, att=0.16)
# the teacher's reason: a step of each answer, as each line comes in
pluck((Es3, Fs3), ow('why', 'urged', -0.1), 0.85, 0.16, last=1.1, pan=px(640) * 0.4)
breathe((As2, Fs2), ow('why', 'held', -0.2), 0.7, 0.7, 1.2, px(300) * 0.4)
# each gets the answer he needs; yes to both; and both among the seventy-seven
bass(Fs1, ow('fit', 'answer', -0.3), 0.8, -0.1, ring=2.0); clar(As3, ow('fit', 'answer', 0.1), 1.3, 0.55, 0.12, att=0.14)
bass(B1, ow('office', 'yes', -0.2), 0.75, -0.1, ring=1.0)
bass(Cs2, ow('office', 'decisive', -0.2), 0.95, px(300) * 0.4, ring=1.0)
breathe((Ds3, Es3), ow('office', 'skilled', -0.2), 0.65, 0.3, 0.8, px(640) * 0.4, att=0.07)
bass(Fs1, ow('count', 'both', -0.2), 0.85, -0.1, ring=2.6); clar(Fs3, ow('count', 'both', 0.1), 1.9, 0.65, 0.12, att=0.16)
# and a data team: the hall's rise an octave up as the room comes in; a page over each of the eight, one soft run of paper
bass(Fs2, oc('team', -0.2), 0.75, -0.1, ring=1.8)
clar(Fs3, oc('team', 0.1), 0.9, 0.6, 0.12, att=0.16); clar(Cs4, oc('team', 1.0), 1.4, 0.55, 0.12, att=0.05, air=0.0)
bass(Ds2, ow('team', 'leaves', -0.2), 0.75, 0.0, ring=1.3)
# the title: both ask, the bass, then the clarinet, and nobody answers yet
ask_plucked(oc('breath', 0.4), 0.9, step=0.24, last=0.95, pan=-0.15, until=END)
ask_breathed(oc('breath', 1.75), 0.75, octave=1, step=0.55, last=2.0, pan=0.15, until=END)

# 2. Erin's silence: the university. The meeting talks: three plucked notes, softer each, for the first three who speak, and then no
#    more; the clarinet is silent, as Erin is. Helena's guess is wrong: D sharp, low, alone. Tuesday: Erin's note, and the clarinet at
#    last, two soft notes, D sharp up to F sharp. Wednesday: Helena asks, and it's the mark's question, plucked softly, higher than the
#    students'; Erin's answer on the clarinet, in her own time: from the question's last note, down, and up to rest on A sharp. In
#    the pause at the end, the question's first two notes: she goes on asking
LV[0] = 0.9
sw = lambda lid, word, off=0: W('silence', lid, word, off)
sc_ = lambda lid, off=0: G('silence', lid, off)
t0 = sc_('plan', 1.2)                                        # who talks, in turn: the same times as the speech marks
for i, (who_x, m) in enumerate(((236, Fs2), (848, As2), (440, Cs3))):
    bass(m, t0 + i * 1.25 + 0.05, 0.6 - 0.12 * i, px(who_x) * 0.6, ring=0.7)
bass(Ds2, sw('guess', 'wrong', -0.1), 0.8, px(1550) * 0.4, ring=1.3)
breathe((Ds3, Fs3), sc_('note', 0.5), 0.6, 0.7, 1.3, px(610) * 0.4, att=0.18)
ask_plucked(sw('ask', 'how', -0.1), 0.7, octave=1, step=0.3, last=1.2, pan=px(1200) * 0.4)
breathe((B3, Gs3, As3), sw('after', 'think', -0.2), 0.65, 0.75, 1.6, px(720) * 0.4, att=0.2)
pluck((Cs3, Es3), Z('silence', 'say', 0.3), 0.65, 0.34, last=1.3, pan=px(1200) * 0.4, until=E('silence'))

# 3. By degree: five traits, a plucked step for each as its row comes in, F sharp up to C sharp; and "each is a scale": the same five
#    steps on the clarinet in one breath, joined, as the bars are drawn. A typical person's days: the marks land as one soft texture,
#    and the clarinet moves round its usual note and comes back to it. The years: the usual note itself moves up, slowly. Bolivia:
#    nothing. A team has a use for each: the one who rushes ahead (Zilu's two plucks), the one who holds back (Ran You's breath), the
#    one who thinks aloud (two plucks), the one who thinks afterwards (the clarinet, a moment after its tag). Never for assessing: one
#    short, stopped pluck. In the pause at the end, F sharp, low and high: the team together
LV[0] = 0.9
dw = lambda lid, word, off=0: W('degree', lid, word, off)
dc = lambda lid, off=0: G('degree', lid, off)
for i, (wd, m) in enumerate((('open', Fs2), ('organised', Gs2), ('outgoing', As2), ('agreeable', B2), ('steady', Cs3))):
    bass(m, dw('five', wd, -0.25) + 0.05, 0.65, px(600) * 0.4, ring=0.8)
s0 = dw('scale', 'scale', -0.3)
breathe((Fs2, Gs2, As2, B2, Cs3), s0 + 0.15, 0.65, 0.3, 1.3, px(1160) * 0.4, att=0.12)
breathe((As2, B2, Gs2, As2), dw('usual', 'moved', -0.3), 0.6, 0.42, 1.1, px(1020) * 0.4, att=0.12)
g0 = dw('years', 'between', -0.2)
clar(As2, g0 + 0.1, 1.05, 0.6, px(1170) * 0.4, att=0.16); clar(Cs3, g0 + 1.2, 1.3, 0.6, px(1170) * 0.4, att=0.05, air=0.0)
pluck((Cs2, Fs2), dw('team', 'rushes', -0.3), 0.85, 0.13, last=1.0, pan=px(560) * 0.5)
clar(As2, dw('team', 'holds', -0.3), 1.0, 0.5, px(1360) * 0.5, att=0.24, rel=0.2)
pluck((B2, Cs3), dw('team', 'aloud', -0.3), 0.8, 0.15, last=0.9, pan=px(560) * 0.5)
breathe((Es3, Fs3), dw('team', 'afterwards', 0.2), 0.6, 0.5, 1.3, px(1360) * 0.5, att=0.2)
bass(Ds2, dw('never', 'never', -0.2), 0.75, px(1360) * 0.4, ring=0.45)
bass(Fs1, Z('degree', 'outcomes', 0.3), 0.8, -0.1, ring=1.8, until=E('degree'))
clar(Fs3, Z('degree', 'outcomes', 0.6), 1.3, 0.6, 0.12, att=0.16, until=E('degree'))

# 4. A scale, cut in two: Yusuf's idea, three quick plucks, up; the scale again, the clarinet's joined steps as the people come in
#    along it, and this time the stroke of the cut stops it at its third step: a scale, cut in two; then a label for each side, two
#    plucked notes, low and high, where there was a whole scale. Most people are near the middle: the scale's middle note, alone.
#    1991: the ten people, one soft texture, and no music. Near the cut: the middle note moves one small step, and the other label is
#    plucked. Helena says yes: F sharp, a third in the clarinet; her four rules, a tap each, and a pen's tick for each of the three the
#    test's own makers ask for. A test can start a conversation: the question's first two notes, and the clarinet begins to answer;
#    it can't decide anything: one stopped pluck
LV[0] = 0.9
cw = lambda lid, word, off=0: W('cut', lid, word, off)
cc = lambda lid, off=0: G('cut', lid, off)
pluck((As2, Cs3, Fs3), cw('idea', 'idea', -0.1), 0.8, 0.16, last=1.1, pan=px(440) * 0.5, swell=0.06)
cutT = cw('type', 'cut', -0.3)
breathe((Fs2, Gs2, As2, B2, Cs3), cc('type', 0.3), 0.65, 0.26, 0.5, px(960) * 0.4, att=0.12, until=cutT + 0.14)   # cut off by the stroke
bass(Fs2, cw('type', 'One', -0.05), 0.75, px(700) * 0.6, ring=0.8)
bass(Cs3, cw('type', 'other', -0.05), 0.75, px(1240) * 0.6, ring=0.8)
clar(As2, cw('middle', 'middle', -0.3), 1.3, 0.55, 0.0, att=0.2)
butT, hopT = cw('steady', 'But', -0.5), cw('steady', 'small', -0.2)
breathe((As2, B2), hopT + 0.05, 0.6, 0.45, 0.7, 0.0, att=0.1)
bass(Cs3, hopT + 0.9, 0.75, px(1240) * 0.6, ring=0.9)
bass(Fs2, cw('yes', 'yes', -0.1), 0.8, px(430) * 0.4, ring=1.5); clar(As2, cw('yes', 'yes', 0.25), 1.2, 0.55, px(1350) * 0.3, att=0.14)
pluck((Cs3, Es3), cw('start', 'start', -0.1), 0.65, 0.3, last=0.9, pan=px(430) * 0.4)
breathe((Ds3, Fs3), cw('start', 'conversation', 0.1), 0.55, 0.6, 1.0, px(1350) * 0.3, att=0.16)
bass(Cs2, cw('start', 'decide', 0.1), 0.75, 0.0, ring=0.4)

# 5. How I work: the page put up, and its title written: a pen; B major, the bass and a third in the clarinet. Five headings, a tap
#    each. Helena writes hers first: a pen again; and under "asking, instead of guessing", the mark's question, plucked softly. The
#    seven pages: one soft run of paper. All seven have shared a page: three plucks up F sharp's chord; two left a heading out: the
#    same chord on the clarinet with its middle note left out. Erin's page: the end of her answer, two notes. In the pause at the end,
#    one clarinet note, F sharp
LV[0] = 0.9
pw = lambda lid, word, off=0: W('page', lid, word, off)
pc = lambda lid, off=0: G('page', lid, off)
bass(B1, pw('keep', 'How', -0.1), 0.75, -0.1, ring=1.7); clar(Ds3, pw('keep', 'How', 0.3), 1.3, 0.55, 0.12, att=0.14)
ask_plucked(pw('hers', 'asking', -0.1), 0.7, octave=1, step=0.3, last=1.2, pan=px(1520) * 0.4)
pluck((Fs2, As2, Cs3), pw('friday', 'all', -0.1), 0.75, 0.2, last=1.1, pan=-0.1)
breathe((Fs2, Cs3), pw('friday', 'Two', 0.1), 0.55, 0.62, 1.0, 0.12, att=0.14)
breathe((Gs3, As3), pw('erin', 'writing', -0.2), 0.6, 0.6, 1.2, px(430) * 0.4, att=0.18)
clar(Fs3, Z('page', 'nokind', 0.3), 1.4, 0.6, 0.0, att=0.18, until=E('page'))

# 6. For the whole range: she changes the meeting: B, and D sharp in the clarinet; the four steps, a tap each. That Monday: the
#    question once more, plucked, as the meeting comes in; Erin, in her turn: her answer on the clarinet, and this time it goes on, home
#    to F sharp; the one who thinks aloud answers too (the plucked answer, rising), and the one who thinks afterwards (the breathed
#    answer, falling): each voice in turn, never the same way twice. Back in Lu: the hall's slow rise of a fifth. Each person says it
#    for themselves: E sharp up to F sharp, in the clarinet. The advice laid down, a sheet each. And under the end card the bass asks
#    one last time, the clarinet takes the question's last note from it and brings it down a step as the bass comes home: the two
#    answer together, F sharp and its third, held into the end
LV[0] = 0.9
rw = lambda lid, word, off=0: W('range', lid, word, off)
rc = lambda lid, off=0: G('range', lid, off)
bass(B1, rw('change', 'changes', -0.1), 0.75, -0.1, ring=1.7); clar(Ds3, rw('change', 'changes', 0.3), 1.2, 0.55, 0.12, att=0.14)
spT = rw('speaks', 'speaks', -0.3)
ask_plucked(rc('speaks', -0.35), 0.7, octave=1, step=0.3, last=1.0, pan=px(1672) * 0.4)
breathe((B3, Gs3, As3, Fs3), spT + 0.25, 0.65, 0.6, 1.2, px(1060) * 0.4, att=0.2)
pluck(URGED_ON, rw('both', 'aloud', -0.35), 0.75, 0.17, last=1.0, pan=px(680) * 0.5, swell=0.08)
breathe(HELD_BACK, rw('both', 'afterwards', -0.2), 0.6, 0.6, 1.2, px(1230) * 0.5, att=0.16)
# back in Lu, and where the story stops being a guide
clar(Fs2, rc('leader', -0.2), 1.15, 0.65, px(1200) * 0.4, att=0.18); clar(Cs3, rc('leader', 0.95), 1.5, 0.65, px(1200) * 0.4, att=0.05, air=0.0)
hT = rw('asks', 'Helena', -0.5)
breathe((Es3, Fs3), rw('asks', 'says', -0.1), 0.6, 0.5, 1.3, px(720) * 0.4, att=0.18)
# on Monday
# the end: asked one last time, and answered by both
fin = Z('range', 'take', 0.35)
ask_plucked(fin, 0.9, step=0.26, last=1.3, pan=-0.15, until=TOT)
clar(B2, fin + 1.15, 0.85, 0.75, 0.15, att=0.2, rel=0.035, until=TOT); clar(As2, fin + 2.0, 3.6, 0.75, 0.15, att=0.05, air=0.0, until=TOT)
bass(Fs2, fin + 2.0, 0.85, -0.15, ring=2.4, until=TOT); bass(Fs1, fin + 3.1, 0.8, -0.15, ring=3.0, until=TOT)



# ---- what the hands write: the boards and the pages of a notebook. A row waits until whoever writes has walked to it (PK.pace), so
# the marker's and the pen's sounds ask the film when each row is written (the people kit's tools/pens.py). And the messages: a soft
# blip for each that comes in. The gift, set down: one soft landing
import pens
PEN = pens.written({'P': ('silence', 'helena', 'na_boardP'), 'A': ('degree', 'carmen', 'na_boardA'), 'B': ('degree', 'carmen', 'na_boardB'),
                    'C': ('cut', 'carmen', 'na_boardC'), 'R': ('cut', 'helena', 'na_boardR'), 'S': ('page', 'helena', 'na_boardS'),
                    'M': ('range', 'helena', 'na_boardM'),
                    'N1': ('lu', None, 'na_note1'), 'N2': ('silence', None, 'na_note2'), 'N3': ('degree', None, 'na_note3'),
                    'N4': ('cut', None, 'na_note4'), 'N5': ('page', None, 'na_note5'), 'NE': ('page', None, 'na_noteE'), 'N6': ('range', None, 'na_note6')})
def marker(s, sec=1.6, g=0.004, pan=0.0, n=3):
    """a marker on a whiteboard, a word at a time: a soft, low rub, never a squeak"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (350, 1300)) * _bump(x, d, 0.7) * (0.4 + 0.6 * gr), t, g, pan, 1500)
def written(name, hand, g, least=0.28):
    """a board's or a page's rows as the hand writes them (PEN): one soft rub for each row and each long mark, a word at a time"""
    for k in PEN[name]:
        d = k['t1'] - k['t0']
        if d >= least:
            hand(k['t0'], d, g, px(k['x']) * 0.5, max(1, round(d / 0.32)))
def pop(s, g=0.0022, pan=0.0, up=True):
    """a message sent (up) or one that arrives: one soft, round blip that rises, or falls, a little"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    f = 430 * 2 ** ((0.4 if up else -0.4) * np.clip(x / 0.07, 0, 1))
    _fx(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.005) * np.exp(-x / 0.04), s, g, pan, 1600)

for name in ('P', 'A', 'B', 'C', 'R', 'S', 'M'):
    written(name, marker, 0.004)
for name in ('N1', 'N2', 'N3', 'N4', 'N5', 'NE', 'N6'):
    written(name, pen, 0.004)
laid(W('lu', 'gift', 'is taught', 0.0), 0.004, px(1220))
pop(W('silence', 'note', 'short note', 0.0), 0.0022, px(1200), up=False); pop(W('silence', 'miss', "can't", -0.4), 0.0022, px(1200), up=False); pop(W('silence', 'miss', "can't", 0.6), 0.0022, px(1200), up=False)

