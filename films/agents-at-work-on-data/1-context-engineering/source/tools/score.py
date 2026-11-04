# Context engineering: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette for this film (palettes.md, 4 November 2026: a lead no other film, on main or on a branch, has used): a monochord
# and a twelve-string guitar, both made here, as music.py has neither.
#  - The monochord, one gut string over a long box, its bridge moved to set each note, plucked with a quill: the instrument Guido
#    taught his singers with, each note named exactly. It names a note wherever a meaning is set down: the lines on the page, Mei's
#    answer, each of the four kinds of context. Its harmonic (the string touched at its middle as it's plucked: a pure, round note) is a
#    test that passes.
#  - The twelve-string guitar, fingerpicked softly: each note is a pair of strings tuned exactly together, the four low pairs an octave
#    apart, so one touch sounds two strings (written once, read by people and agents alike). It takes up what the monochord names, and
#    plays the chords of the story. A guess is one of its low notes, a wrong one, stopped short by the hand: in tune, never detuned, only
#    not the note on the page. A pair muted with the side of the hand is something not found, or out of reach.
# The mark: the monochord names one note, and the twelve strings take it up as a chord, each time in its own voicing: as the lines put
# the signs on the page, as the meaning goes onto the page, as Mei writes it in the glossary, as every agent and person reads the same
# page, as the agent cites her definition, and at the close.
# E Dorian for the opening (E minor, and A major for its sixth), E major once the page holds the lines. Every chord is tuned pure from
# E (just intonation, see hz()); F sharp minor and D with A, whose fifths aren't pure here, are never played, and a guess's wrong note is
# never held under a chord. The chant itself isn't scored: the boys and the masters sing in the picture, and the music leaves it to them.
# The rules the series keeps (its briefs, 4 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one string or one pair, steady, with no vibrato or bend, its partials harmonic, and the pairs
#    tuned exactly together (no shimmer, which would beat); the notes damped by the player before they'd ring into the next chapter. No
#    urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() takes a word's first appearance, even inside a longer word, and falls back to the line's start when it's missing; here either
# stops the mix, so a typo can't move a sound
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
R1 = np.random.default_rng(25)  # this film's own randomness: the room, the quill, the paper

# ---- tuning: just intonation from E, so a chord's notes are whole-number ratios of each other and nothing beats. E minor, E major, A
# major, A minor, B major, B minor, G major, C major and C sharp minor are all pure in this table; F sharp minor, and D with A, are not
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 40, 12)
    return 82.40689 * 2 ** o * _JI[pc]
E2, F2, G2, A2, B2, C3, Cs3, D3, E3, G3, Gs3, A3, B3 = 40, 41, 43, 45, 47, 48, 49, 50, 52, 55, 56, 57, 59
Cs4, E4, Gs4, B4 = 61, 64, 68, 71

# ---- the levels: the monochord, its harmonic, the twelve-string and its muted pairs matched by loudness, as far under the voice as the
# series' other music; the effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of
# each chapter below
LM, LH, LT, LD, FX = 0.085, 0.06, 0.05, 0.07, 3.4
LV = [1.0]

# a small room round the instruments, ringing on for about a second
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.016 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
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
    """a sound that must be gone by until (a time in the film, a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig
def _thump(sec, n, f=280, d=0.01):
    """a fingertip's soft touch on a string: a little low noise, gone in a hundredth of a second"""
    x = np.arange(n) / SR; th = filt(noise(sec + 0.02)[:n], 'low', f) * np.exp(-x / d)
    return th / max(1e-9, float(np.abs(th).max()))

# ---- a plucked string's partials: harmonic, each as strong as where it's plucked allows (a string can't move at a point it's held still
# by, so some partials are weak: the pluck's comb), the higher ones softer and gone sooner. The seventh partial, out of tune with every
# note of a 5-limit scale, and the few above it that are, are kept low
_comb = lambda k, at: abs(np.sin(np.pi * k * at))
_ODD = {7: 0.2, 11: 0.4, 13: 0.4, 14: 0.2}
def _string(f0, x, t1, soft, pick, top=2400, p=1.0):
    sig = np.zeros(len(x))
    for k in range(1, 48):
        fk = f0 * k
        if fk > top:
            break
        a = _comb(k, pick) / k ** p * np.exp(-(k - 1) / soft) * _ODD.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * fk * x + 0.5 * k) * np.exp(-x / (t1 / (1 + 0.5 * (k - 1))))
    return sig
def _pan(m, pan):
    return max(-0.3, min(0.3, (m - 59) * 0.02)) if pan is None else pan

def mono(m, s, g=1.0, pan=0.0, ring=None, room=0.3, until=None):
    """the monochord: its one gut string, stopped by the bridge for the note m, plucked with a quill at s. It's plucked a seventh of
    the way along, so its seventh partial (out of tune with every note here) doesn't sound at all; the shorter the length the bridge
    leaves, the fewer its high partials. Its long box lifts the string's low ways and hollows it a little, and it rings on, slowly, until
    the player damps it after ring seconds"""
    f0 = hz(m); t1 = 3.0 * (165 / f0) ** 0.35; d = ring if ring else t1 * 1.4
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _string(f0, x, t1, 5.5 * (165 / f0) ** 0.5, 1 / 7, 2400, 1.1)
    sig *= (1 - np.exp(-x / 0.003)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.08))
    sig /= max(1e-9, float(np.abs(sig).max()))
    q = filt(noise(sec + 0.02)[:n], 'band', (900, 2000)) * np.exp(-x / 0.004)   # the quill's touch
    sig = (sig + 0.03 * q / max(1e-9, float(np.abs(q).max()))).astype(np.float32)
    sig = sig + 0.55 * filt(sig, 'band', (150, 310)) + 0.3 * filt(sig, 'band', (420, 720))   # the long box
    sig = filt(filt(sig, 'low', 2300), 'high', 60)
    sig = _until(_room(norm(sig), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LM, pan)

def mharm(m, s, g=1.0, pan=0.0, ring=None, room=0.35, until=None):
    """the monochord's harmonic: the string touched lightly at its middle as the quill plucks it, so it rings only in its even ways, at
    the note m heard here: a pure, round note, like a small bell, that fades slowly; a test that passes"""
    f0 = hz(m); t1 = 1.8 * (500 / f0) ** 0.3; d = ring if ring else t1 * 2.2
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k, a in ((1, 1.0), (2, 0.07), (3, 0.02)):
        if f0 * k < 2400:
            sig += a * np.sin(2 * np.pi * f0 * k * x) * np.exp(-x / (t1 / (1 + 0.7 * (k - 1))))
    sig *= (1 - np.exp(-x / 0.007)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.08))
    q = filt(noise(sec + 0.02)[:n], 'band', (500, 1500)) * np.exp(-x / 0.005)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.02 * q / max(1e-9, float(np.abs(q).max()))
    sig = _until(_room(norm(filt(sig.astype(np.float32), 'low', 2300)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LH, pan)

GPICK = 0.19   # where the fingertip plucks the twelve-string, as a part of the string's length from the bridge
def course(m, s, g=1.0, pan=None, ring=None, room=0.25, until=None):
    """one course of the twelve-string, plucked softly with a fingertip at s: its two strings sound as one note. Below the B string the
    second string is an octave higher, thin and bright, and lies on the thumb's side, so it sounds a moment first; the B and E courses are
    two strings in unison. The two are tuned exactly together, so the pair never beats or shimmers. The player damps it after ring s"""
    f0 = hz(m); t1 = 2.4 * (196 / f0) ** 0.3; d = ring if ring else t1 * 2.2
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; lag = 0.004; xm = np.maximum(x - lag, 0.0)
    if m < 59:
        two = 0.6 * _string(2 * f0, x, 0.75 * t1, 4.5, 1.7 * GPICK) * (1 - np.exp(-x / 0.003))
    else:
        two = 0.8 * _string(f0, x, 0.95 * t1, 5.5, 1.25 * GPICK) * (1 - np.exp(-x / 0.003))
    one = _string(f0, xm, t1, 6.0, GPICK) * (1 - np.exp(-xm / 0.004)) * (x >= lag)
    sig = (one + two) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.03 * _thump(sec, n)
    sig = sig.astype(np.float32); sig = sig + 0.4 * filt(sig, 'band', (90, 130)) + 0.3 * filt(sig, 'band', (190, 290))   # its body
    sig = _until(_room(norm(filt(filt(sig, 'low', 2400), 'high', 70)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LT, _pan(m, pan))

def damped(m, s, g=1.0, pan=None, room=0.12):
    """a course muted with the side of the hand as it's plucked: short and dull, its two strings together; nothing found, or out of reach"""
    f0 = hz(m); sec = 0.5; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 16):
        if f0 * k > 1600:
            break
        a = _comb(k, GPICK) / k * np.exp(-(k - 1) / 2.2) * _ODD.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * f0 * k * x) * np.exp(-x / (0.14 / (1 + 0.9 * (k - 1))))
        if m < 59 and k % 2 == 0:
            sig += 0.35 * a * np.sin(2 * np.pi * f0 * k * x) * np.exp(-x / 0.06)
    sig *= 1 - np.exp(-x / 0.005)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.12 * _thump(sec, n, 240, 0.014)
    sig = _room(norm(filt(sig.astype(np.float32), 'low', 1500)), room, 0.0, 0.3)
    put(sig, s, g * LV[0] * LD, _pan(m, pan))

# ---- what they play
def guess(m, s, g=1.0, pan=None):
    """a guess: a wrong note, short and low, on a low course stopped by the hand at once: in tune, never detuned, only not the note on
    the page"""
    course(m, s, g, pan, ring=0.32, room=0.15)
def take(notes, s, g=1.0, step=0.14, ring=2.6, until=None, pan=0.0, spread=0.3):
    """the twelve strings take up a chord: fingerpicked from the lowest course up, each course ringing on until the hand damps them all"""
    k = len(notes)
    for i, m in enumerate(notes):
        course(m, s + step * i, g, pan + (i / (k - 1) - 0.5) * spread if k > 1 else pan, ring=max(0.4, ring - step * i), until=until)
def mark(name, notes, s, g=1.0, gap=0.6, step=0.14, ring=2.6, until=None, pan=0.0):
    """the mark: the monochord names one note, and the twelve strings take it up as a chord"""
    mono(name, s, g, pan, ring=ring + gap + 0.3, until=until)
    take(notes, s + gap, 0.9 * g, step, ring, until, pan)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def knock(s, g=0.006, pan=0.0, f=170, d=0.03):
    """a soft knock: something set down on wood"""
    n = int(0.25 * SR); x = np.arange(n) / SR
    _fx(_knock(n, f, d) + 0.15 * filt(noise(0.27)[:n], 'band', (300, 1200)) * np.exp(-x / 0.008), s, g, pan, 1500)
def book(s, g=0.006, pan=0.0):
    """a chant book set down on the desk: its weight, a low, soft knock, and the breath of its pages"""
    n = int(0.4 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 105, 0.05) + 0.25 * filt(noise(0.42)[:n], 'band', (200, 900)) * _bump(x, 0.08) * (x < 0.08), s, g, pan, 1000)
def leaf(s, g=0.006, pan=0.0):
    """a parchment leaf turned: stiffer and slower than paper, a soft, dry flap over half a second, and its fall"""
    n = int(0.7 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.72)[:n], 'band', (220, 1500)) * _bump(x, 0.55, 1.3) * (x < 0.55) + 0.4 * _knock(n, 140, 0.02, 0.55) / 1.35, s, g, pan, 1600)
def quill(s, sec=0.75, g=0.005, pan=0.0):
    """a quill drawing a line across parchment: one long, soft scratch, its grain uneven"""
    n = int(sec * SR); x = np.arange(n) / SR
    gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (800, 2000)) * _bump(x, sec, 0.5) * (0.4 + 0.6 * gr), s, g, pan, 2200)
def card(s, g=0.006, pan=0.0):
    """a card laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a card or a bar slid along: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def joint(s, g=0.005, pan=0.0):
    """an arm's joint turning: a short, muffled rub, and a soft stop"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.24)[:n], 'band', (150, 650)) * _bump(x, 0.16) * (x < 0.16) + 0.4 * _knock(n, 230, 0.01, 0.16) / 1.35, s, g, pan, 1100)
def clip(s, g=0.004, pan=0.0):
    """the paperclip: a small, dull metal tick, its ring cut short"""
    n = int(0.12 * SR); x = np.arange(n) / SR
    _fx(sum(np.sin(2 * np.pi * f * x) * np.exp(-x / d) * a for f, d, a in ((780, 0.02, 1), (2110, 0.008, 0.4))), s, g, pan, 2300)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pen's soft scratch, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)

# =============================================================================================================================
# 1. The lines: the opening, the series' story from outside data. Arezzo, about 1025: the monochord names E, alone, and the twelve
#    strings come in on E minor with the place and year; Guido's name laid down; the church's chants, the Dorian's own colour, A major;
#    by ear, from a master, one low note. The page: a parchment leaf, and the card of the signs. A boy who has never heard the chant
#    guesses, twice, "a step?" and "a leap?": two wrong notes, short and low; the two masters each sing it their own way, two notes that
#    differ; the chant books set down, one for each master; ten years, a low chord that thins and is gone before "Something has to
#    change", which has nothing under it. Guido's answer: a quill draws each line, and the monochord names "one note"; the red line and
#    the yellow one, a fifth apart, as F and C are; the signs settle onto the lines, and the mark: E major arrives, held into the boys
#    singing a chant they have never heard. The ten years shrink; in Rome the pope turns two leaves, and the twelve strings take up the
#    verse he had never heard. One more line, today's staff. The agent reaches for the page, one note for what's on it; Mei's card and
#    the agent's guess, a wrong note; the meaning drawn onto the page, and the mark again in its own voicing; a low E under the title
LV[0] = 0.85
ow = lambda lid, word, off=0: W('lines', lid, word, off)
oc = lambda lid, off=0: G('lines', lid, off)
END = E('lines')
mono(E3, 0.5, 0.9, 0.0, ring=3.4)
take((E2, B2, E3, G3), ow('when', 'Arezzo', 0.2), 0.7, step=0.17, ring=3.2)
card(ow('school', 'Guido'), 0.004, px(1480))
take((A2, E3, A3, Cs4), ow('school', 'chants'), 0.65, step=0.15, ring=3.0)
course(B2, ow('ear', 'master'), 0.55, ring=2.4)
# the page, close: a leaf laid open, the card of the signs; the boy's two guesses as the dotted marks ask how far, each alone
leaf(oc('signs', -0.35), 0.005, px(960))
card(ow('signs', 'remind'), 0.004, px(1380))
how = ow('far', 'show')
guess(F2, how + 0.15, 0.85, px(860)); guess(C3, how + 1.05, 0.8, px(900))
# the masters don't agree: each sings the sign his own way, two notes that differ, from the left and from the right
agree = ow('master', 'agree')
guess(F2, agree + 0.35, 0.75, px(640)); guess(G2, agree + 0.8, 0.75, px(1280))
# as many chant books as masters, each set down as it appears; ten years, low, gone before "Something has to change"
bk = oc('books', -0.4)
for i, x in enumerate((560, 1010, 1460)):
    book(bk + 0.1 + 0.3 * i, 0.005 - 0.001 * (i == 2), px(x))
card(oc('years', 0.0), 0.004, px(960)); slide(ow('years', 'ten'), 1.8, 0.003, px(960))
take((E2, B2, G3), oc('years', 0.4), 0.55, step=0.25, ring=3.4, until=oc('change', -0.4))
# Guido's answer: a quill draws each of the four lines; "one note", named; the red line and the yellow, a fifth apart as F and C are
ln = ow('lines', 'lines')
for i in range(4):
    quill(ln - 0.2 + 0.85 * i, 0.75, 0.004, px(960))
mono(B3, ow('lines', 'note'), 0.8, px(960), ring=2.6)
mono(A3, ow('colour', 'F'), 0.75, px(700), ring=2.2); mono(E4, ow('colour', 'C'), 0.7, px(1100), ring=2.4)
# every sign on a line or a space: they settle, a soft tap for each group; the mark, E major at last, held into the boys singing
sits = ow('page', 'sits')
for t in (0.8, 1.35, 1.95):
    tap(sits + t, 0.0035, px(700 + 300 * t))
mark(E3, (E2, B2, E3, Gs3, B3, E4), ow('page', 'page', -0.15), 0.8, ring=3.6, step=0.15)
card(ow('days', 'three', -0.2), 0.004, px(1440))
slide(ow('ten', 'took'), 1.6, 0.003, px(800)); slide(ow('ten', 'made', -0.2), 0.8, 0.003, px(1000))
# Rome: the place's card; the pope turns two leaves; the twelve strings take up the verse he had never heard
card(oc('pope', -0.1), 0.004, px(300))
leaf(ow('pope', 'turns'), 0.005, px(700)); leaf(ow('pope', 'seat', 0.6), 0.0045, px(700))
take((Gs3, B3, E4, Gs4), ow('pope', 'never', -0.2), 0.6, step=0.14, ring=3.0)
# one more line: today's staff
quill(ow('staff', 'more', -0.1), 1.0, 0.004, px(960))
# the agent reaches for the page, and grips it; one note for what's on it
ag = oc('agent', -0.5)
joint(ag + 0.45, 0.0045, px(1400)); tap(ag + 1.6, 0.0035, px(1300))
course(B3, ow('agent', 'page'), 0.55, px(1100), ring=2.2)
# a meaning in someone's head: Mei's card; the agent's guess, a wrong note, and its card
card(ow('head', 'someone', 0.2), 0.004, px(300))
card(ow('head', 'guesses', -0.2), 0.004, px(1560)); guess(F2, ow('head', 'guesses', 0.15), 0.85, px(1500))
# put the meaning on the page: the dotted line drawn from Mei's card to the empty slot, and the mark as it fills, in its own voicing
put_ = ow('put', 'Put')
pen(put_, 0.9, 0.0035, px(600), 5)
mark(B3, (B2, E3, Gs3, B3), put_ + 0.9, 0.75, ring=2.8)
# the title: the monochord's low E, damped before the next chapter
mono(E2, oc('breath', 0.3), 0.8, 0.0, ring=4.6, until=END)

# 2. A word nobody wrote down: the chapter turns on C sharp minor, the twelve strings alone. Clara's question laid down; the goal; the
#    tools slid in, each arm's joint as it reaches; what Catalog and Docs bring back, laid down; nothing says what the word means: a
#    muted pair; the agent reasons from the names: a wrong note, its guess; the answer laid down, its query clipped to it
LV[0] = 0.9
ww = lambda lid, word, off=0: W('word', lid, word, off)
wc = lambda lid, off=0: G('word', lid, off)
take((Cs3, Gs3, Cs4, E4), S0('word') + 0.2, 0.65, step=0.15, ring=2.4)
card(ww('today', 'asks', -0.1), 0.004, px(900))
card(wc('gives', -0.2), 0.004, px(630))
slide(ww('gives', 'tools', -0.3), 1.1, 0.003, px(1660))
for w in ('tables', 'code', 'docs'):
    joint(ww('reads', w, -0.3), 0.004, px(1450))
card(ww('reads', 'tables', 0.6), 0.0035, px(1180)); card(ww('reads', 'docs', 0.6), 0.0035, px(1180))
damped(D3, ww('nothing', 'means'), 0.8, px(1090))
card(ww('names', 'names'), 0.0035, px(1090)); guess(F2, ww('names', 'names', 0.15), 0.85, px(1124))
card(ww('count', 'counts', -0.1), 0.004, px(710)); clip(ww('count', 'query'), 0.004, px(990))

# 3. In one head, and one inbox: the query laid down, and "it runs"; Mei knows at once: the monochord alone names a note; coming back
#    isn't commencing, laid down; the count worked out, a tap for each row; the harm, and the guess again; the email, the letter carried
#    down into the inbox; the agent's arm stops short: a muted pair, out of its reach; what it read and what it wrote, laid down
LV[0] = 0.9
iw = lambda lid, word, off=0: W('inbox', lid, word, off)
ic = lambda lid, off=0: G('inbox', lid, off)
card(S0('inbox') + 0.25, 0.0035, px(990))
tap(iw('query', 'runs', -0.1), 0.004, px(820))
mono(E4, iw('knows', 'knows'), 0.8, px(900), ring=2.6)
card(iw('back', 'coming', -0.3), 0.0035, px(900))
card(ic('right', -0.1), 0.0035, px(960))
for t in (ic('right', 0.0), iw('right', 'were', -0.2), iw('right', 'right', -0.1)):
    tap(t + 0.1, 0.004, px(960))
card(ic('harm'), 0.0035, px(960)); guess(F2, ic('harm', 0.35), 0.85, px(960))
card(ic('email', -0.05), 0.0035, px(900))
knock(ic('inbox', -0.35), 0.004, px(900), 150)
slide(iw('inbox', 'inbox', -0.4), 1.0, 0.003, px(900)); tap(iw('inbox', 'inbox', 0.55), 0.0035, px(900))
joint(iw('inbox', 'agent', -0.5), 0.004, px(1400)); damped(B2, iw('inbox', 'agent', 0.6), 0.75, px(1260))
card(iw('careless', 'reads', -0.3), 0.0035, px(400)); card(iw('careless', 'writes', -0.3), 0.0035, px(1520))

# 4. What an agent reads: each of the four kinds of context, named by the monochord as it arrives, the notes of E major's chord (code,
#    metadata, skills, tools), each with an arm's joint; the gap in the metadata filled with a guess, a wrong note; and context
#    engineering, written down: the twelve strings
LV[0] = 0.9
rw = lambda lid, word, off=0: W('reads', lid, word, off)
for (lid, word), m, x in ((('code', 'Code'), E3, 340), (('meta', 'Metadata'), B3, 1580), (('skills', 'Skills'), Gs3, 340), (('tools', 'tools'), E4, 1580)):
    joint(rw(lid, word, -0.1), 0.0035, px(x)); mono(m, rw(lid, word, 0.15), 0.75, px(x), ring=2.2)
guess(F2, rw('missing', 'guess', 0.1), 0.85, px(1124))
card(rw('engineering', 'Choosing', -0.2), 0.0035, px(960))
take((E3, Gs3, B3, E4), rw('engineering', 'writing'), 0.6, step=0.14, ring=2.6, until=E('reads'))

# 5. On the page: Mei writes it once in the glossary, and owns it: the mark; the project copies it, with its source, and a new column;
#    the test's four students, a tick each; four of four pass: the monochord's harmonic; the contract laid down; the rule written
LV[0] = 0.9
pw = lambda lid, word, off=0: W('page', lid, word, off)
pc = lambda lid, off=0: G('page', lid, off)
card(pw('glossary', 'writes', -0.1), 0.0035, px(1200))
mark(E4, (E3, B3, E4, Gs4), pw('glossary', 'glossary'), 0.75, ring=2.6)
card(pw('copy', 'copies'), 0.0035, px(1240)); card(pw('copy', 'column', -0.2), 0.0035, px(1240))
card(pc('test', -0.2), 0.0035, px(960))
for i, w in enumerate(('new', 'back', 'second', 'last')):
    ticked(pw('test', w), 0.004, px(700 + 170 * i))
mharm(B4, pw('test', 'last', 1.2), 0.8, px(960), ring=2.4)
card(pc('contract', -0.2), 0.0035, px(960))
card(pc('rule', -0.2), 0.0035, px(960)); pen(pw('rule', 'ask', -0.3), 0.6, 0.0035, px(700), 3)

# 6. One context for the team: each person's own notes, laid down one by one, a small book on each; each agent its owner's: three wrong
#    notes, one each, none of them the same; the one context in the project, reviewed like code; every agent reaches up to it, and the
#    mark: everyone reads the same page; a meaning changed once
LV[0] = 0.9
tw = lambda lid, word, off=0: W('team', lid, word, off)
for i in range(3):
    card(tw('before', 'notes', -0.6 + 0.35 * i), 0.0035, px(160 + 600 * i))
book(tw('masters', 'chant', -0.2), 0.003, px(960))
for i, m in enumerate((F2, C3, D3)):
    guess(m, tw('masters', "owner's", 0.9 * i), 0.7, px(510 + 600 * i))
card(tw('one', 'keeps', -0.2), 0.0035, px(960)); ticked(tw('one', 'reviewed', -0.2), 0.0035, px(770))
for i in range(3):
    joint(tw('same', 'agent', -0.4 + 0.12 * i), 0.003, px(510 + 600 * i))
mark(B3, (B2, Gs3, B3, E4), tw('same', 'page', -0.1), 0.75, ring=2.6)
pen(tw('change', 'changes', -0.1), 0.5, 0.0035, px(1160), 2)

# 7. A verse never heard: Jun's goal laid down; the agent's arm to Docs, and the glossary's card; its arm to Query; its answer, and the
#    mark as it cites Mei's definition; the evidence slid open. The new analyst's card, her agent's arm. Like Guido's boys: the school
#    on the marble, A major on the twelve strings; and the close, the mark from E, held into the end card
LV[0] = 0.9
vw = lambda lid, word, off=0: W('verse', lid, word, off)
vc = lambda lid, off=0: G('verse', lid, off)
card(vw('again', 'asks', -0.2), 0.0035, px(650))
joint(vw('looks', 'looks', -0.2), 0.0035, px(1450)); card(vw('looks', 'looks', 0.5), 0.0035, px(1180))
joint(vw('looks', 'counts', -0.4), 0.0035, px(1450))
card(vw('looks', 'cites', -0.4), 0.0035, px(720))
mark(Gs4, (Gs3, B3, E4, Gs4), vw('looks', 'cites'), 0.75, ring=2.6)
slide(vw('looks', 'cites', 0.1), 1.4, 0.0025, px(1100))
joint(vw('new', 'agent', -0.6), 0.003, px(900)); card(vw('new', 'analyst', -0.2), 0.0035, px(1540))
take((A2, E3, A3, Cs4), vc('boys', -0.1), 0.6, step=0.16, ring=2.4)
mark(E3, (E2, B2, E3, Gs3, B3, E4), vw('once', 'once'), 0.75, ring=5.6, step=0.16, until=TOT)
