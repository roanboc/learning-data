# The draft and the decision: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (palettes.md, reserved 5 November 2026 by the setup thread): a tangent piano, made here, as music.py
# has none.
#  - The tangent piano: the keyboard of the 1790s whose keys throw small wooden tangents up at the strings; each strikes its string near
#    one end and springs straight away, so the string rings free. The mechanism is the same for every note; the touch, not the mechanism,
#    decides how loud and how bright each one is. Dry and light: a quick wooden strike, a clear string, and a damper that stops it when
#    the key comes up. No two strings to a note, so nothing beats.
#  - Its partner, the thread's choice: the tangent piano's own bass strings under the left hand, touched softly, a round low note with
#    few high partials; heard only under a person's decision (Kasparov's plan, the amateurs deciding, Graham's decision and his
#    approval, Ivy's check, Jun's approval, the decision an agent can't take). One instrument, one player: the mechanism plays, the
#    hand decides, as the film's agent drafts and its people decide. Every other plucked or struck colour the site lacks either belongs
#    to another culture or sounds like one it has (the module's palettes.md), as the thread of Many hats, one picture found too.
# The mark: a phrase played evenly, every note alike, as a mechanism plays (G B D E D B A, ending away from home), then again with one
# note changed by the hand (G B D E D B G, home, the last note held with the left hand's G under it). The even phrase is the agent's
# draft: when the agent drafts in the opening, when its draft appears in a minute, when it drafts again; the changed one is a person's
# check and decision: under the title, when all fifty hours match, and at the close.
# G major, E minor for the opening's problem (the computer wins; what many feared) and for what the draft assumed. Every chord is tuned
# pure from G (just intonation, see hz()): G, C and D major, and E and B minor, are pure in this table; A with C or with E is not, and
# never sounds with them. Nothing Spanish for León, nothing American for New York: no chess clock, no tune of a place.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one string, steady, its partials harmonic; each damped before it would ring into the next
#    chapter. No urgent pulse: nothing in the film is a rush (film.json's "urgent" is empty).
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/dd_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
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
R1 = np.random.default_rng(1998)  # this film's own randomness: the room, the strike, the paper

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. G, C and D major, and
# E and B minor, are pure in this table; A held with C or with E is not, and never sounds with them
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 43, 12)
    return 97.99886 * 2 ** o * _JI[pc]
E2, G2, A2, B2, C3, D3, E3, Fs3, G3, A3, B3 = 40, 43, 45, 47, 48, 50, 52, 54, 55, 57, 59
C4, D4, E4, Fs4, G4, A4, B4, C5, D5, E5, Fs5, G5 = 60, 62, 64, 66, 67, 69, 71, 72, 74, 76, 78, 79

# ---- the levels: the right hand's keys and the left hand's bass matched by loudness, as far under the voice as the module's other
# music; the effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LK, LB, FX = 0.09, 0.121, 3.8
LV = [1.0]

# a small, dry room round the instrument, ringing on for about 0.8 s. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.011 * SR)] = 0; _IR /= _band(_IR)
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
def _strike(sec, n, lo=700, hi=2100, d=0.0025):
    """the wooden tangent meeting the string: a dry, tiny knock, gone in a few thousandths of a second"""
    x = np.arange(n) / SR; k = filt(noise(sec + 0.02)[:n], 'band', (lo, hi)) * np.exp(-x / d)
    return k / max(1e-9, float(np.abs(k).max()))

# ---- a struck string's partials: harmonic, each as strong as where the tangent strikes allows (near one end, about a ninth of the way
# along, so the low partials come in nearly alike and the ninth is missing), brighter the firmer the touch, the higher ones softer and
# gone sooner. The seventh partial, out of tune with every note of a 5-limit scale, and the few above it that are, are kept low
_comb = lambda k, at: abs(np.sin(np.pi * k * at))
_ODD = {7: 0.25, 11: 0.35, 13: 0.35, 14: 0.25}
STRIKE = 0.112
def _string(f0, x, t1, touch, top=2400):
    sig = np.zeros(len(x))
    for k in range(1, 40):
        fk = f0 * k
        if fk > top:
            break
        a = _comb(k, STRIKE) / k ** (1.05 - 0.3 * touch) * np.exp(-(k - 1) / (2.6 + 3.2 * touch)) * _ODD.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * fk * x + 0.3 * k) * np.exp(-x / (t1 / (1 + 0.55 * (k - 1))))
    return sig

def key(m, s, g=1.0, pan=None, ring=None, touch=0.55, room=0.16, until=None):
    """the right hand: a key pressed at s throws its tangent at the string, which rings free; the touch sets how loud and how bright;
    the key comes up after ring seconds and the damper stops the string"""
    f0 = hz(m); t1 = 1.7 * (262 / f0) ** 0.35; d = ring if ring else 0.9
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _string(f0, x, t1, touch)
    sig *= (1 - np.exp(-x / 0.0012)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.045))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + (0.03 + 0.03 * touch) * _strike(sec, n)
    sig = sig.astype(np.float32); sig = sig + 0.2 * filt(sig, 'band', (220, 520))   # the soundboard's warmth
    sig = _until(_room(norm(filt(filt(sig, 'low', 2300), 'high', 80)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LK * (0.55 + 0.6 * touch), max(-0.35, min(0.35, (m - 66) * 0.02)) if pan is None else pan)

def low(m, s, g=1.0, pan=None, ring=None, room=0.14, until=None):
    """the left hand, only under a person's decision: a bass string touched softly, so it speaks round, with few high partials, and is
    damped when the key comes up"""
    f0 = hz(m); t1 = 2.3 * (98 / f0) ** 0.3; d = ring if ring else 1.2
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _string(f0, x, t1, 0.2, 1300)
    sig *= (1 - np.exp(-x / 0.003)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.03 * _strike(sec, n, 300, 900, 0.004)
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (90, 220))   # the soundboard under the bass strings
    sig = _until(_room(norm(filt(filt(sig, 'low', 1300), 'high', 40)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LB, -0.15 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.11, ring=2.0, touch=0.5, until=None, bass=None):
    """a chord played from its lowest key up, every key lifted together at the end so the strings stop as one; bass: the left hand's
    note under it (a person's decision), played with its first key"""
    if bass is not None:
        low(bass, s, g, None, ring + 0.3, until=until)
    for i, m in enumerate(notes):
        key(m, s + step * i, g, None, max(0.4, ring - step * i), touch, until=until)
def figure(notes, s, g=1.0, step=0.2, ring=0.45, last=None, touch=0.5, touches=None, until=None):
    """a short figure, a key at a time, each lifted before the next but one, so nothing that isn't pure rings together; touches: each
    note's own touch, as a hand gives them (the mechanism alone gives every note the same)"""
    k = len(notes)
    for i, m in enumerate(notes):
        key(m, s + step * i, g, None, last if (last and i == k - 1) else ring, touches[i] if touches else touch, until=until)
EVEN = (G4, B4, D5, E5, D5, B4, A4)                   # the mark, as the mechanism plays it: every note alike, ending away from home
HAND = (G4, B4, D5, E5, D5, B4, G4)                   # and as the hand plays it: one note changed, home
SHAPE = (0.45, 0.5, 0.58, 0.66, 0.56, 0.48, 0.5)      # the hand's touch along it: a little more towards the top, and back
def draft(notes, s, g=1.0, step=0.17, until=None):
    """the even phrase: every key pressed alike and lifted alike, as a mechanism would"""
    figure(notes, s, g, step, 0.3, 0.6, 0.5, None, until)
def decide(notes, s, g=1.0, step=0.21, last=3.0, bass=G2, until=None):
    """the phrase in a person's hands: shaped by the touch, its last note held, and the left hand's bass under that last note"""
    figure(notes, s, g, step, 0.42, last, 0.5, SHAPE, until)
    low(bass, s + step * (len(notes) - 1), 0.9 * g, None, last + 0.2, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.6 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def sheet(s, g=0.0035, pan=0.0):
    """a sheet pinned to the wall: a soft swish of thick paper, and the pin's faint press"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    sw = filt(noise(0.22)[:n], 'band', (350, 1600)) * _bump(x, 0.09, 1.5) * (x < 0.09)
    _fx(sw + 0.5 * _knock(n, 170, 0.014, 0.085) / 1.3, s, g, pan, 1800)
def tick(s, g=0.0045, pan=0.0):
    """a tick drawn on paper, or set on a screen: one quick, dry stroke of a pen, down and up, softer where it turns"""
    d = 0.11; m = int(d * SR); x = np.arange(m) / SR
    env = _bump(x, d, 0.7) * (1 - 0.5 * np.exp(-((x - 0.035) / 0.012) ** 2))
    _fx(filt(noise(d + 0.02)[:m], 'band', (800, 2100)) * env, s, g, pan, 2200)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """a line drawn out, or a sheet slid along: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (220, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1400)
def pen(s, sec=1.6, g=0.005, pan=0.0, n=4):
    """a pen writing a line on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 50)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def press(s, g=0.004, pan=0.0):
    """a pill set down on a screen, or a verdict: one soft, short press"""
    n = int(0.1 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.12)[:n], 'band', (300, 1100)) * np.exp(-x / 0.008) + 0.7 * _knock(n, 230, 0.014), s, g, pan, 1500)
def wake(s, sec=1.2, g=0.0035, pan=0.0):
    """the agent waking to work: a soft, low breath of air that swells and settles, never a whir or a beep"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (160, 700)) * _bump(x, sec, 1.6), s, g, pan, 800)

# =============================================================================================================================
# 1. Two amateurs, three computers: the opening, the module's story from outside data. New York, 1997: G major as the champion sits
#    down at the board; the computer wins, E minor; what many feared, E and B, low; what their skill is worth, B and D, left open; and
#    nothing under "Something has to change". León, 1998: C major, with the machine, not against it; the plan, the player's: the left
#    hand's G under D major's G, the first decision. 2005: D major as the field comes in, anyone at all; a sheet for each entry the film
#    follows; the winners, three notes, the mark's opening; at home, G major; "then the two of them decide": the left hand's D; the
#    final drawn, a line each; first prize, G major, wide; the supercomputer out, E and B, low; Kasparov's lesson laid down; how they
#    worked with the machines, G major, high. Data work's machine: the agent drafts, and the even phrase; what's left for the people,
#    E minor; choosing: the left hand's G; and under the title, the even phrase, then the hand's, home, held
LV[0] = 0.85
cw = lambda lid, word, off=0: W('chess', lid, word, off)
cc = lambda lid, off=0: G('chess', lid, off)
CEND = E('chess')
chord((G3, D4, G4, B4), cw('when', 'York', 0.1), 0.65, step=0.17, ring=2.8)
sheet(cw('when', 'May', -0.2), 0.0035, px(420))
sheet(cw('when', 'computer', -0.1), 0.003, px(1690))
chord((E3, B3, E4, G4), cw('loses', 'wins', 0.0), 0.6, step=0.16, ring=2.6)
sheet(cc('loses', 0.1), 0.003, px(430))
chord((E3, B3), cw('fear', 'fear', 0.0), 0.55, step=0.3, ring=2.2)
chord((B3, D4), cw('worth', 'worth', -0.1), 0.5, step=0.22, ring=1.8, until=cc('change', -0.3))
# León: with the machine, not against it; each with a computer; the plan, the player's, the first decision
chord((C4, E4, G4), cw('leon', 'with', 0.0), 0.55, step=0.15, ring=2.2)
sheet(cw('leon', 'León', -0.1), 0.0035, px(350))
sheet(cw('each', 'choice', -0.3), 0.003, px(1070))
chord((D4, G4, B4), cw('plan', 'plan', -0.1), 0.55, step=0.13, ring=2.2, bass=G2)
# 2005: anyone may enter; three of the entries; the winners
chord((D4, Fs4, A4, D5), cw('free', 'anyone', 0.0), 0.5, step=0.2, ring=2.2)
sheet(cw('free', 'anyone', -0.1), 0.0035, px(960))
for word, lid, x in (('Grandmasters', 'entrants', 420), ('supercomputer', 'entrants', 420), ('amateur', 'winners', 420)):
    sheet(cw(lid, word, -0.1), 0.003, px(x))
figure((G4, B4, D5), cw('winners', 'three', 0.0), 0.5, step=0.22, ring=0.5, last=1.4)
# at home: their own experience, three programs compared, deeper where it matters, and then they decide
chord((G3, B3, D4), cw('how', 'experience', 0.0), 0.5, step=0.14, ring=1.8)
slide(cw('how', 'compare', 0.2), 0.8, 0.0035, px(960))
chord((Fs4, A4, D5), cw('deeper', 'decide', -0.1), 0.55, step=0.12, ring=2.2, bass=D3)
# the final: the lines run on; first prize; the supercomputer out before the last eight
slide(cc('final', 0.1), 1.0, 0.0035, px(700))
slide(cw('final', 'beat', -0.1), 0.9, 0.0035, px(1250))
chord((G3, D4, G4, B4, D5), cw('final', 'prize', -0.2), 0.55, step=0.13, ring=2.4)
chord((E3, B3), cw('final', 'supercomputer', 0.1), 0.5, step=0.25, ring=1.6)
sheet(cc('lesson', 0.2), 0.0035, px(960))
chord((C4, G4, E5), cw('lesson', 'better', 0.0), 0.45, step=0.18, ring=2.0)
chord((B3, D4, G4), cw('counts', 'worked', -0.1), 0.5, step=0.15, ring=2.0)
# data work's machine: the agent drafts in a minute, and the even phrase; what's left for the people; choosing, the left hand's G
wake(cw('data', 'write', -0.2), 1.2, 0.0035, px(390))
sheet(cw('data', 'draft', -0.1), 0.0035, px(850))
draft(EVEN, cw('data', 'minute', 0.1), 0.55)
chord((G3, B3, E4), cw('ask', 'leaves', 0.0), 0.5, step=0.16, ring=1.8)
sheet(cw('left', 'decides', -0.2), 0.0035, px(1520))
chord((D4, B4), cw('left', 'choosing', 0.0), 0.5, step=0.2, ring=2.0, bass=G2)
press(cw('cheap', 'Judgement', -0.1), 0.0035, px(1520))
# the title: the even phrase, as the agent wrote it; then the hand's, one note changed, home, the left hand's G under it, held
t0 = cc('breath', 0.3)
draft(EVEN, t0, 0.5, 0.17)
decide(HAND, t0 + 2.2, 0.55, 0.21, last=2.0, bass=G2, until=CEND)

# 2. A draft in a minute: the university, a year from now: the chapter turns on G major; Graham's card; his decision, the left hand's C
#    under C major; his question, B and D, left open; Ivy's card, her task; she asks the agent; in a minute, the draft, the even phrase,
#    quicker and higher in the middle; its tests passing, ticked; the figures laid down; "it sounds sure", G major, even and plain
LV[0] = 0.9
dw = lambda lid, word, off=0: W('draft', lid, word, off)
dc = lambda lid, off=0: G('draft', lid, off)
chord((G3, B3, D4, G4), S0('draft') + 0.3, 0.55, step=0.16, ring=2.2)
sheet(dw('uni', 'Graham', -0.1), 0.0035, px(1320))
chord((E4, G4, C5), dw('building', 'decide', -0.1), 0.5, step=0.14, ring=2.0, bass=C3)
sheet(dw('building', 'Council', -0.2), 0.003, px(1320))
sheet(dw('q', 'question', -0.1), 0.0035, px(1320))
chord((B3, D4), dw('q', 'hours', 0.2), 0.5, step=0.24, ring=1.8)
sheet(dw('ivy', 'Wednesday', -0.1), 0.0035, px(520))
sheet(dw('ivy', 'model', -0.1), 0.003, px(520))
sheet(dw('ask', 'asks', -0.1), 0.0035, px(550))
wake(dw('ask', 'draft', 0.0), 1.4, 0.0035, px(1232))
draft((G4, B4, D5, E5, D5, B4, A4, G4, B4, D5), dc('minute', 0.2), 0.5, 0.14)
tick(dw('tidy', 'pass', -0.1), 0.0035, px(904))
sheet(dw('figure', 'teaching', -0.4), 0.0035, px(340)); sheet(dw('figure', 'busiest', -0.4), 0.0035, px(760))
chord((G4, B4, D5), dw('sure', 'sure', 0.0), 0.45, step=0.0, ring=1.4, touch=0.5)
press(dw('almost', 'open', -0.2), 0.003, px(1560))

# 3. What it assumed: the notes laid down; one line stops her: E minor, low; Graham's card in February; the tests ticked; no test can
#    know what Graham means: E and B, open; the sensors' hours come in, one soft line of them; one in five, nobody: E minor again, higher;
#    what Graham would have weighed, C and E, low; nobody careless: G major, warm; what she'd given, a press for each pill
LV[0] = 0.9
aw = lambda lid, word, off=0: W('assumed', lid, word, off)
ac = lambda lid, off=0: G('assumed', lid, off)
sheet(ac('notes', 0.3), 0.0035, px(550))
chord((E3, G3, B3), aw('line', 'stops', 0.0), 0.55, step=0.18, ring=2.2)
sheet(aw('graham', 'Graham', -0.1), 0.0035, px(1320))
sheet(ac('tests', 0.1), 0.003, px(550))
for i in range(4):
    tick(aw('tests', 'pass', -0.1) + 0.35 * i + 0.08, 0.0035, px(908))
chord((E3, B3, E4), aw('meaning', 'know', 0.0), 0.5, step=0.22, ring=1.8)
slide(aw('sensors', 'sensors', -0.1), 1.4, 0.0035, px(600))
chord((B3, E4, G4), aw('fifth', 'nobody', 0.0), 0.5, step=0.16, ring=2.0)
sheet(aw('harm', 'weighed', -0.2), 0.0035, px(1320))
chord((C4, E4), aw('harm', 'bookings', 0.0), 0.45, step=0.25, ring=1.8)
chord((G3, D4, G4), aw('common', 'careless', 0.1), 0.5, step=0.15, ring=2.0)
sheet(ac('task', 0.1), 0.0035, px(550))
for word, x in (('task', 290), ('decision', 560), ('words', 840)):
    press(aw('task', word, -0.1), 0.0035, px(x))

# 4. Frame it, then ask: the chapter turns on D major; the definition typed in, which the voice carries; Graham approves it, as its
#    owner: the left hand's G under G major; three things, not one, three notes rising; each card laid down and its line drawn to the
#    agent; the new draft, the even phrase, in the middle; the week worked out by hand, a pen, row by row; a tick for each day; all
#    fifty hours match: the hand's phrase, the left hand's G under its last note
LV[0] = 0.9
fw = lambda lid, word, off=0: W('frame', lid, word, off)
fc = lambda lid, off=0: G('frame', lid, off)
FEND = E('frame')
chord((D4, Fs4, A4), fw('frame', 'frames', 0.0), 0.5, step=0.16, ring=2.0)
press(fw('frame', 'frames', -0.1), 0.003, px(1560))
press(fw('owner', 'approves', 0.1), 0.0035, px(374))
chord((B3, D4, G4), fw('owner', 'approves', 0.1), 0.5, step=0.13, ring=2.2, bass=G2)
figure((D4, G4, B4), fw('three', 'three', 0.0), 0.5, step=0.3, ring=0.6, last=1.4)
for lid, x in (('decision', 390), ('words', 970), ('counts', 1550)):
    sheet(fc(lid, 0.1), 0.0035, px(x)); slide(fc(lid, 0.5), 0.8, 0.003, px(x))
wake(fc('counts', 1.2), 1.2, 0.003, px(960))
sheet(fc('draft', 0.3), 0.0035, px(550))
draft(EVEN, fw('draft', 'apart', 0.0), 0.45, 0.17)
pen(fw('hand', 'hand', -0.2), 2.2, 0.0045, px(625), 5)
for i in range(5):
    tick(fc('match', 0.24 * i + 0.06), 0.0035, px(1076))
decide(HAND, fc('match', 1.3), 0.5, 0.2, last=2.2, bass=G2, until=FEND)

# 5. Someone else approves: Ivy opens her pull request: C major, soft; the reasoning, a line at a time, a soft press each; Jun at the
#    table; his question, and the answer; he approves it: the left hand's D under D major, and the merge, a press; stand-up the next
#    morning: G major; what she nearly missed laid down; Helena's thanks, C major, warm; the team's new way laid down
LV[0] = 0.9
rw = lambda lid, word, off=0: W('review', lid, word, off)
rc = lambda lid, off=0: G('review', lid, off)
chord((C4, E4, G4), rc('pr', 0.2), 0.5, step=0.15, ring=2.0)
press(rw('pr', 'author', -0.1), 0.003, px(1390))
for word in ('asked', 'assumed', 'changed', 'checked'):
    press(rw('reason', word, -0.1), 0.0025, px(400))
sheet(rw('jun', 'Nobody', -0.1), 0.0035, px(1490))
press(rw('asks', 'asks', -0.1), 0.003, px(560)); press(rw('asks', 'answer', -0.2), 0.003, px(560))
chord((Fs4, A4, D5), rw('merge', 'approves', -0.1), 0.5, step=0.13, ring=2.0, bass=D3)
press(rw('merge', 'approves', -0.1), 0.0035, px(980)); press(rw('merge', 'merged', -0.1), 0.0035, px(980))
sheet(rw('merge', 'told', -0.2), 0.0035, px(1490))
chord((G3, B3, D4, G4), rc('standup', -0.2), 0.5, step=0.16, ring=2.0)
sheet(rc('standup', 0.3), 0.003, px(420)); sheet(rw('standup', 'nearly', -0.2), 0.0035, px(1390))
chord((E4, G4, C5), rw('thanks', 'thanks', 0.0), 0.5, step=0.14, ring=2.0)
sheet(rw('thanks', 'asking', -0.3), 0.0035, px(420))

# 6. The skills that grow: the draft's card, and the work moving to either side of it: a note going down and one going up; before and
#    after laid down; the World Economic Forum's report laid down, C major, plain; the skills rising: G, A, B, D; what an agent can do,
#    a press each; it can't take the decision: the left hand's G under G major; the agent films' cards
LV[0] = 0.9
gw = lambda lid, word, off=0: W('grows', lid, word, off)
gc = lambda lid, off=0: G('grows', lid, off)
sheet(S0('grows') + 0.8, 0.003, px(950))
key(G3, gw('moves', 'either', 0.0), 0.5, px(700), 1.4); key(D5, gw('moves', 'either', 0.25), 0.5, px(1220), 1.4)
sheet(gw('before', 'Before', -0.1), 0.0035, px(390)); sheet(gw('after', 'After', -0.1), 0.0035, px(1540))
sheet(gc('wef', 0.2), 0.0035, px(960))
chord((C4, G4, C5), gw('wef', 'analytical', 0.0), 0.45, step=0.18, ring=2.0)
figure((G4, A4, B4, D5), gw('rising', 'fastest', -0.2), 0.45, step=0.2, ring=0.4, last=1.2)
for word, x in (('draft', 780), ('test', 780), ('say', 780)):
    press(gw('cant', word, -0.1), 0.003, px(x - 150))
chord((D4, G4, B4), gw('cant', 'decision', -0.1), 0.5, step=0.14, ring=2.2, bass=G2)
sheet(gc('films', 0.1), 0.0035, px(610)); sheet(gw('films', 'govern', -0.1), 0.0035, px(1310))

# 7. On Monday: back to 2005: G major, as at home that evening; deciding: the left hand's E under E minor's turn home (E minor, then
#    G); Ivy did the same: the left hand's C under C major; Graham's answer laid down; each step laid down; and the close: the even
#    phrase, then the hand's, home, its last note held with the left hand's G into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
chord((G3, D4, G4, B4), mw('back', 'amateurs', 0.0), 0.5, step=0.17, ring=2.2)
chord((B3, E4, G4), mw('not', 'deciding', -0.1), 0.5, step=0.14, ring=2.0, bass=E2)
chord((C4, E4, G4, C5), mw('ivy', 'decided', -0.1), 0.5, step=0.13, ring=2.0, bass=C3)
sheet(mw('rooms', 'counts', -0.2), 0.0035, px(550))
for lid, off, x in (('one', 0.3, 350), ('two', 0.1, 880), ('three', 0.1, 350), ('four', 0.1, 880)):
    sheet(mc(lid, off), 0.0035, px(x))
t1 = mw('last', 'decide', 0.4)
draft(EVEN, t1, 0.45, 0.17)
decide(HAND, t1 + 2.1, 0.5, 0.22, last=5.0, bass=G2, until=TOT)
chord((B3, D4), t1 + 2.1 + 0.22 * 6, 0.45, step=0.0, ring=5.0, until=TOT)
