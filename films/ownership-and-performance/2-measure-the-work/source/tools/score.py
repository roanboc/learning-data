# Measure the work, not the people: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette (the module's palettes.md, film 12's line: the lead reserved by the setup thread on 5 November 2026, the partner this film's
# thread's choice on 10 November 2026), made here, as music.py has neither:
#  - Tuned saw blades, struck softly with felt: tools of the work, tuned. Each blade is a steel disc, cut until its note and the octave
#    above ring together; beside them rings the disc's own mode, about 2.83 times the note, a little shorter: the steel's colour, which
#    no harmonic of a chord's other notes comes near, so nothing beats; two more modes (about 1.73 and 4.11 times the note) sound only
#    for the instant of the strike. No third or fourth harmonic, so it never sounds like the site's felt piano. A felt damper stops each
#    note after its ring, so nothing rings on: low, round and short, with nothing above 2.3 kHz.
#  - Its partner, the thread's choice: the largest blades, low (D2 to D3), damped by the palm as they're struck, so each note speaks once
#    and stops within a third of a second. The same steel, set another way: in this film each measure has a partner, and here one blade
#    rings while the other stops. Every other struck or plucked colour the site lacks belongs to another culture or sounds like one the
#    site has (the module's long list), as the module's other threads found.
# The mark: a note heard alone, then in its chord, where it means something else. A4, alone, as a number is said (541 killed; promises
#    met at 82%; a measure made a target; the last line); then the same A4 inside D minor, where it is the chord's fifth and sounds sad
#    (the number read as the drivers' fault; 82% beside a load of nine), or inside F major, where it is the third and sounds bright (deaths
#    down by three quarters; 82% on its own; the close). A number alone says little; beside its partner it means something.
# F major, D minor for the problem. Every chord is tuned pure from F (just intonation, see hz()): F, B flat and C major, D and A minor are
#    pure in this table; G minor, and G held with D or B flat, are not, and are never played or held together.
#    No car horn, engine or tyres for Vision Zero (the module's palettes.md): the cars on the road make no sound at all.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each blade steady, its main partials harmonic; each damped before it would ring into the next chapter.
#    No urgent pulse: nothing in the film is a rush.
#  - Every sound is something a person does or something that comes in on screen, at that moment: a fine handed over, a decision
#    pinned up, a tape run out, a post set in the ground, a marker on the map or the board, a pen in a notebook, a card that says where
#    and when, a screen's panel, a call that comes up, a message sent or one that arrives. Each one below uses the same word and offset
#    as the picture in src/mw_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
#    People's steps and what they say have no sound of their own: the voice carries them. The cars make none either.
#  - What a hand writes is paced by the film (PK.pace): a row waits until Carmen or Helena has walked to it, and a stroke until the pen
#    has crossed to it. So the marker's and the pen's sounds ask the film when each row is written (the people kit's tools/pens.py),
#    and take no word's time: PEN, below.
# And everything stays low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
import pens
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    """when a word of a line is spoken, as the film's own wAt() estimates it; a missing word, or one inside a longer word, stops the mix"""
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1997)  # this film's own randomness: the room, the paper, the pen
# every stroke of the film's five boards (Carmen's and Helena's) and four pages of notes (Helena's), as the film writes them: the
# chapter, who writes at the board (None: a page), and the film's function that gives the rows (src/mw_uni.js). On Monday, the
# team's page is on the board from the start (written before), so it has no strokes
PEN = pens.written({'A': ('manage', 'carmen', 'mw_boardA'), 'B': ('manage', 'helena', 'mw_boardB'), 'R': ('read', 'helena', 'mw_boardR'),
                    'C': ('pairs', 'carmen', 'mw_boardC'), 'D': ('target', 'carmen', 'mw_boardD'), 'N1': ('read', None, 'mw_note1'),
                    'N2': ('pairs', None, 'mw_note2'), 'N3': ('target', None, 'mw_note3'), 'N4': ('monday', None, 'mw_note4')})
def stroke(name, s, mark=None):
    """the first stroke of a board or a page whose words (or, with mark, whose mark's kind) are s, as the film writes it"""
    return next(k for k in PEN[name] if k['s'] == s and (mark is None or k['mark'] == mark))

# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 41, 12)
    return 87.30706 * 2 ** o * _JI[pc]
F2, A2, Bb2, C3, D3, E3, F3, G3, A3, Bb3 = 41, 45, 46, 48, 50, 52, 53, 55, 57, 58
C4, D4, E4, F4, G4, A4, Bb4, C5, D5, E5, F5 = 60, 62, 64, 65, 67, 69, 70, 72, 74, 76, 77
D2 = 38

# ---- the levels: the ringing blades and the damped low ones matched by loudness, as far under the voice as the module's other music;
# the effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LG, LB, FX = 0.075, 0.1, 3.6
LV = [1.0]

# a small room round the blades, ringing for under a second. Its level is set by what it rings where the notes are (its gain from 100 Hz
# to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.011 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig

# ---- a tuned blade's partials: the note and its octave, tuned by the maker's cuts, and the disc's own mode beside them, each fading sooner
# than the note (ratio, level, how long it rings as a share of the blade's ring); and the two modes heard only at the strike (ratio, level,
# seconds). 2.83 sits between the chord-mates' harmonics (2.67 and 3 times a note), 4 per cent or more from any of them
_TUNED = ((1.0, 1.0, 1.0), (2.0, 0.28, 0.5), (2.83, 0.14, 0.4))
_DISC = ((1.73, 0.06, 0.10), (4.11, 0.05, 0.05))
def _steel(f0, x, t1, top, tuned=1.0, disc=1.0):
    sig = np.zeros(len(x))
    for k, (r, a, d) in enumerate(_TUNED):
        if f0 * r > top:
            break
        sig += a * (tuned if k else 1.0) * np.sin(2 * np.pi * f0 * r * x + 0.4 * k) * np.exp(-x / (t1 * d))
    for r, a, d in _DISC:
        if f0 * r < top:
            sig += disc * a * np.sin(2 * np.pi * f0 * r * x + 1.3 * r) * np.exp(-x / d)
    return sig
def _felt(sec, n, lo=120, hi=900):
    """the felt meeting the steel: a tiny, soft thump, low-passed"""
    x = np.arange(n) / SR; q = filt(noise(sec + 0.02)[:n], 'band', (lo, hi)) * np.exp(-x / 0.004)
    return q / max(1e-9, float(np.abs(q).max()))

def blade(m, s, g=1.0, pan=None, ring=None, room=0.22, until=None):
    """a tuned blade struck softly with felt at s; it rings ring seconds, then the felt damper stops it"""
    f0 = hz(m); t1 = 1.9 * (220 / f0) ** 0.3; d = ring if ring else 1.2
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _steel(f0, x, t1, 2300)
    sig *= (1 - np.exp(-x / 0.004)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.025 * _felt(sec, n)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 60)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LG, max(-0.35, min(0.35, (m - 65) * 0.02)) if pan is None else pan)

def low(m, s, g=1.0, pan=None, ring=0.3, room=0.12, until=None):
    """one of the largest blades, struck with the palm resting on it, so it speaks once, round and low, and stops within a third of a second"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.08, until - s - 0.2))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _steel(f0, x, 0.32, 1300, tuned=0.7, disc=0.5)
    sig *= (1 - np.exp(-x / 0.005)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.045))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.04 * _felt(sec, n, 70, 400)
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (70, 240))   # the big disc's body, warm
    sig = _until(_room(norm(filt(filt(sig, 'low', 1300), 'high', 35)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LB, -0.1 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.13, ring=2.0, until=None):
    """a chord struck from its lowest blade up: a low one (below C3) on the palm-damped blades, the rest ringing, damped together"""
    for i, m in enumerate(notes):
        if m < C3:
            low(m, s + step * i, g, None, 0.35, until=until)
        else:
            blade(m, s + step * i, g, None, max(0.5, ring - step * i), until=until)
def pair(ring_m, stop_m, s, g=1.0, ring=1.4, pan=None, until=None):
    """a measure and its partner: one blade rings, a low one stops, struck together"""
    low(stop_m, s, g, pan, 0.3, until=until); blade(ring_m, s, g, pan, ring, until=until)
def mark(s, g=1.0, ring=1.8, until=None):
    """the mark's first half: A4, alone"""
    blade(A4, s, g, 0.0, ring, room=0.26, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.0035, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0032, pan=0.0):
    """something small set down, a pill or a tag: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """a bar drawn out on a sheet: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.4, g=0.0045, pan=0.0, n=2):
    """a pen's soft stroke on paper, a stroke at a time: a line struck through words"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0, hand=None):
    """a tick or a cross drawn: two quick strokes of a pen, or of a marker (hand=marker)"""
    (hand or pen)(s, 0.24, g, pan, 2)
def marker(s, sec=1.6, g=0.004, pan=0.0, n=3):
    """a marker on a whiteboard or a map, a word at a time: a soft, low rub, never a squeak"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (350, 1300)) * _bump(x, d, 0.7) * (0.4 + 0.6 * gr), t, g, pan, 1500)
def written(name, hand, g, least=0.28):
    """a board's or a page's rows as the hand writes them (PEN): one soft rub for each row of words and each long mark, a word at a
    time, where the film writes it. A dot, a tick and an arrow's head are too short to sound; a tick or a cross that matters has its own"""
    for k in PEN[name]:
        d = k['t1'] - k['t0']
        if d >= least:
            hand(k['t0'], d, g, px(k['x']) * 0.5, max(1, round(d / 0.32)))
def post(s, g=0.004, pan=0.0):
    """a barrier's post set in the ground: one dull, low knock"""
    n = int(0.14 * SR)
    _fx(_knock(n, 120, 0.03) + 0.15 * filt(noise(0.16)[:n], 'band', (100, 500)) * np.exp(-np.arange(n) / SR / 0.012), s, g, pan, 800)
def screen(s, g=0.003, pan=0.0):
    """a panel that comes up from a screen, Ivy's or the flow's: a soft, low tap of its frame"""
    n = int(0.1 * SR); x = np.arange(n) / SR
    _fx(0.7 * _knock(n, 170, 0.02) + 0.3 * filt(noise(0.12)[:n], 'band', (200, 800)) * np.exp(-x / 0.008), s, g, pan, 1000)
def _note(n, f, at, d):
    """a soft, round note inside a sound n samples long: a sine with a little of its octave, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.22 * np.sin(2 * np.pi * 2 * f * x)) * np.minimum(1, x / 0.006) * np.exp(-x / d) * k
def ring(s, g=0.0022, pan=0.0):
    """a call that comes up on a screen: two soft, round notes, the second a pure fourth above the first (C, then F), each gone in a
    fifth of a second"""
    n = int(0.6 * SR)
    _fx(_note(n, hz(C4), 0.0, 0.09) + _note(n, hz(F4), 0.17, 0.11), s, g, pan, 1800)
def joined(s, m, g=0.002, pan=0.0):
    """someone joins a call: one soft, round note"""
    n = int(0.4 * SR)
    _fx(_note(n, hz(m), 0.0, 0.1), s, g, pan, 1800)
def pop(s, g=0.0022, pan=0.0, up=True):
    """a message sent (up) or one that arrives: one soft, round blip that rises, or falls, a little"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    f = 430 * 2 ** ((0.4 if up else -0.4) * np.clip(x / 0.07, 0, 1))
    _fx(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.005) * np.exp(-x / 0.04), s, g, pan, 1600)

# =============================================================================================================================
# 1. Roads, not drivers: the opening. Sweden, 1997, by a road: a low F from the big blade as the officer walks up; the card, and
#    A4 alone as the 541 are named, then the same A4 in D minor as most crashes are put down to the driver; the officer's pen on the
#    pad as the fine is written, the slip as the driver takes it, and a low A under "blame". That evening, the drift: a blade's E,
#    unsettled, and the low D as the car crosses the line; at home, the harm: D minor, slow and low, and nothing under "had to
#    forgive". October 1997: the card, the decision handed over, B flat major for Vision Zero, and pinned up by the map. Every fatal
#    crash studied: the card, and the tape run out along the marks; on the map the dots come in, D, F and A one at a time, and A
#    minor as the fast two-lane roads light up. From 1998, the barrier: the card, a post set in the ground, and C major as the cables
#    run. Where people walk: one G. The benefits: A4 alone as deaths fall, then in F major; the second card, and F, C and A falling
#    gently; a mistake held by the cables: F major. The roads fixed: the green marker on the map. Data work: the panel from Ivy's
#    screen, a low D under its wait; F, A and C under the three things to do; and F major, held, under the title card
LV[0] = 0.85
vw = lambda lid, word, off=0: W('vision', lid, word, off)
vc = lambda lid, off=0: G('vision', lid, off)
END = E('vision')
low(F2, 0.6, 0.7, 0.0, ring=0.4)
card(vc('when', -0.2), 0.0035, px(370))
pen(vc('when', 0.5), 0.8, 0.004, px(700), 3)
mark(vw('when', 'five', 0.0), 0.7, ring=2.0)
chord((D2, A3, D4, F4, A4), vw('counted', 'mistake', 0.1), 0.6, step=0.15, ring=2.2)
pen(vc('counted', 0.6), 0.7, 0.004, px(700), 2)
card(vw('answer', 'fine', 0.0), 0.003, px(830))            # the slip changes hands (the picture: "fine" -0.7, taken 0.7 s on)
low(A2, vw('answer', 'blame', 0.15), 0.6, px(830) * 0.3, ring=0.35)
blade(E4, vw('drift', 'drifts', 0.0), 0.42, px(820) * 0.4, ring=1.2)
low(D2, vw('drift', 'line', 0.0), 0.6, px(950) * 0.3, ring=0.35)
chord((D2, F3, A3, D4), vw('harm', 'never', 0.0), 0.5, step=0.32, ring=2.6)
# October 1997: Vision Zero, a plan: B flat major, as the decision is handed over; pinned up by the map
card(vw('adopt', 'October', -0.3), 0.0035, px(370))
card(vw('adopt', 'Vision', 0.1), 0.003, px(1250))          # taken: "Vision Zero" -0.5, 0.6 s on
chord((Bb2, F3, Bb3, D4, F4), vw('adopt', 'Vision', 0.1), 0.55, step=0.16, ring=2.6)
tap(vw('who', 'answer', 0.15), 0.0032, px(1272))           # pinned: "answer" -0.6, 0.75 s on
# every fatal crash studied: the tape run out along the marks; on the map, the dots come in, D, F and A one at a time; the head-on
# crashes on fast roads with two lanes, A minor, as those roads light up
card(vc('study', 0.1), 0.0035, px(370))
slide(vc('study', 0.1), 1.6, 0.003, px(1000))              # the tape: the shot's start (study -0.4) and 0.5 s, over 1.6 s
for i, m in enumerate((D4, F4, A4)):
    blade(m, vc('found', 0.1 + 0.9 * i), 0.4, px(800 + 300 * i) * 0.4, ring=1.0)
chord((A2, E3, A3, C4), vw('found', 'two lanes', 0.0), 0.5, step=0.15, ring=2.0)
# from 1998: a post set in the ground, and C major as the cables run down the middle
card(vw('barrier', 'nineteen', -0.6), 0.0035, px(370))
post(vc('barrier', 1.7), 0.0035, px(1010))                # set: the shot's start (barrier -0.4) and 1.6 s, over a second
chord((C3, G3, C4, E4), vw('barrier', 'middle', 0.1), 0.5, step=0.2, ring=2.4)
blade(G4, vw('more', 'walk', 0.0), 0.4, px(1300) * 0.4, ring=1.2)
# what it gave: A4 alone as deaths fall, then in F major; the second card, and F, C and A falling gently
card(vc('fell', 0.2), 0.0035, px(370))
mark(vw('fell', 'deaths', 0.0), 0.6, ring=1.3)
chord((F2, F3, C4, F4, A4), vw('fell', 'quarters', 0.1), 0.55, step=0.14, ring=2.4)
card(vc('half', 0.1), 0.0035, px(370))
for i, m in enumerate((C5, A4, F4)):
    blade(m, vw('half', 'half', 0.2 + 0.32 * i), 0.38, px(700) * 0.3, ring=0.9 if i < 2 else 1.6)
# a mistake held: the car on the cables, its driver unhurt on the phone; F major, the A on top
chord((F2, C3, A3, C4, F4), vw('care', 'life', 0.2), 0.5, step=0.14, ring=2.2)
# not who to blame, what to fix: the roads they fixed, drawn over in green on the map
marker(vw('measured', 'measured', -0.4), 2.6, 0.0035, px(1200), 5)
# data work: the panel from Ivy's screen, its wait lit amber and a low D under it; F, A and C under the three things to do
screen(vw('data', 'slow', -0.4), 0.003, px(320))
low(D2, vw('data', 'flows', -0.1), 0.55, px(320) * 0.3, ring=0.35)
blade(A3, vw('data', 'flows', 0.0), 0.38, px(320) * 0.3, ring=1.2)
for wd, m in (('Measure', F4), ('read', A4), ('find', C5)):
    blade(m, vw('fix', wd, 0.0), 0.4, None, ring=1.1)
chord((F2, F3, C4, A4, C5), vc('breath', 0.4), 0.6, step=0.2, ring=4.2, until=END)

# 2. Management, for this work: the university, a year from now. Helena comes in: one C. Carmen's marker on the board, a row at a time,
#    and B flat major, a plan, as she writes that a leader measures; the cross on hours and tickets per person. July: the
#    card, and Helena's marker as she writes the team's page; each pair joined, a blade that rings with a low one that stops
LV[0] = 0.9
gw = lambda lid, word, off=0: W('manage', lid, word, off)
gc = lambda lid, off=0: G('manage', lid, off)
blade(C4, gw('uni', 'Helena', 0.2), 0.42, None, ring=1.4)
written('A', marker, 0.004)
chord((Bb3, D4, F4), stroke('A', 'a leader measures')['t0'] + 0.2, 0.42, step=0.13, ring=1.6)
k = stroke('A', 'cross', True); ticked(k['t0'], 0.004, px(k['x']) * 0.5, marker)
card(gc('page', 0.1), 0.0035, px(1550))
written('B', marker, 0.004)
for k, (m, b, r) in zip([k for k in PEN['B'] if k['s'] == 'line'], ((C4, F2, 1.4), (A3, D2, 1.6))):
    pair(m, b, k['t0'], 0.45, ring=r, pan=px(k['x']) * 0.3)

# 3. Read it together: the first reading. The card; a low C and a blade's G as the team turns to the board; Helena's marker, a row at a
#    time, and "who was slow?" struck through; the road in Sweden, and F major, small, as Helena asks the same of the work. June's days
#    taken apart, the wait for access ringed: a low D and an F; nobody was slow: A minor, as the room eases. Monday 19 July: the card,
#    and Ivy's screen, the request accepted and its access asked for, a tap each. September: the card, and F major. The second cause:
#    the card, a low D and an A as Mei brings the report back. Thursday 29 July: the call comes up on Ivy's screen, and a note as Mei
#    joins. December: the days' panel, and F major, the A on top; then Helena's pen, a page of her notebook
LV[0] = 0.9
rw = lambda lid, word, off=0: W('read', lid, word, off)
rc = lambda lid, off=0: G('read', lid, off)
card(S0('read') + 0.4, 0.0035, px(1550))
pair(G4, C3, rc('thurs', 0.4), 0.42, ring=1.2)
written('R', marker, 0.004)
slide(rw('what', 'who was', 0.0), 0.4, 0.003, px(1420))
chord((C4, F4, A4), rw('sweden', 'same', 0.0), 0.4, step=0.15, ring=1.5)
k = stroke('R', 'ring', True)
low(D2, k['t0'], 0.55, px(k['x']) * 0.3, ring=0.35)
blade(F3, k['t0'] + 0.05, 0.4, px(k['x']) * 0.3, ring=1.3)
chord((A2, A3, C4, E4), rw('nobody', 'arranged', 0.5), 0.42, step=0.16, ring=1.8)
card(rc('early', -0.1), 0.0035, px(1550))
a1 = rw('early', 'accepted', -0.3)
screen(a1 - 0.5, 0.003, px(500))
tap(a1, 0.003, px(500)); tap(a1 + 1.0, 0.003, px(500))
card(rc('one', 0.1), 0.0035, px(370))
chord((F2, A3, C4, F4), rw('one', 'one', 0.1), 0.42, step=0.14, ring=1.8)
card(rw('unclear', 'one piece', -0.3), 0.0035, px(370))
pair(A3, D3, rw('unclear', 'came', 0.0), 0.4, ring=1.3)
ring(rc('talk', -0.1), 0.0022, px(250))                     # the call comes up (talk -0.4, 0.3 s on); its card comes with it
joined(rc('talk', 0.2), F4, 0.002, px(140))                 # Mei's tile
screen(rc('dec', -0.1), 0.003, px(320))
chord((F2, C4, F4, A4, C5), rw('dec', 'halved', 0.2), 0.42, step=0.14, ring=1.8)
written('N1', pen, 0.0045)

# 4. Each measure has a partner: Thursday 12 August, at Ivy's screen: the card; promises met at 82%, and the mark: A4 alone, then F major
#    as Sam celebrates; the load of nine against a limit of six, and the same A4 inside D minor. That evening and the next morning, the
#    voice and the people carry it, and finishing before starting is B flat, a rule. Not now: Helena's two messages sent to Graham, and
#    his answer on the campus. Back to six: the two cards, and F major, balanced. Carmen's marker on the board; and on Helena's page,
#    each measure alone hides something: a blade that rings with a low one that stops, as each arrow is drawn
LV[0] = 0.9
pw = lambda lid, word, off=0: W('pairs', lid, word, off)
pc = lambda lid, off=0: G('pairs', lid, off)
card(S0('pairs') + 0.4, 0.0035, px(1550))
screen(pc('aug', 0.4), 0.003, px(320))
mark(pw('aug', 'eighty-two', 0.2), 0.55, ring=2.0)
chord((F2, C4, F4, A4), pw('alone', 'celebrate', 0.0), 0.45, step=0.15, ring=1.8)
screen(pc('nine', 0.0), 0.003, px(360))
chord((D2, A3, D4, F4, A4), pw('nine', 'limit', 0.3), 0.45, step=0.15, ring=2.0)
pair(D4, Bb2, pw('finish', 'finishes', 0.1), 0.4, ring=1.2, pan=px(1060) * 0.3)
f1, f2 = pc('notnow'), pw('notnow', 'reason', 0.2)
pop(f1 + 1.6, 0.0022, px(1600)); pop(f2 + 1.5, 0.0022, px(1600))   # Helena's two messages, sent
pop(f2 + 3.7, 0.0022, px(420))                                       # Graham's answer, sent from the campus
card(pc('six', 0.1), 0.0035, px(1550))
chord((F2, F3, C4, F4, A4), pw('six', 'six', 0.2), 0.42, step=0.14, ring=1.8)
card(pw('six', 'promises met', -0.2), 0.0035, px(1550))
written('C', marker, 0.004)
written('N2', pen, 0.0045)
for k, (m, b, r) in zip([k for k in PEN['N2'] if k['s'] == 'arrow'], ((E4, A2, 1.2), (F4, Bb2, 1.4))):
    pair(m, b, k['t0'], 0.4, ring=r, pan=px(k['x']) * 0.3)

# 5. Not a target: Monday 13 September: the card, and the director's message arriving on Helena's laptop: a low A and a blade's C.
#    Fair questions: F major, small. Carmen's marker on the board; Goodhart, then Strathern: the mark, A4 alone at "target", then inside
#    D minor: a number pushed to move means something else. SPACE: the card, as Jun helps Ivy. Deming: A minor, low. Helena's answer
#    sent: B flat major, a rule kept; the director's reply arrives: the page goes to the quarterly review, no one ranked, F major, the A
#    on top. In the pause, Helena's pen: the count crossed out, the team's page ticked, and B flat, low, under the tick
LV[0] = 0.9
tw = lambda lid, word, off=0: W('target', lid, word, off)
tc = lambda lid, off=0: G('target', lid, off)
card(S0('target') + 0.6, 0.0035, px(370))
pop(tc('mon', 1.2), 0.0022, px(1460), up=False)
pair(C4, A2, tc('mon', 1.4), 0.4, ring=1.3)
chord((F3, A3, C4), tw('fair', 'fair', 0.1), 0.4, step=0.14, ring=1.4)
written('D', marker, 0.004)
mark(tw('strathern', 'target', 0.0), 0.5, ring=1.4)
chord((D2, F3, A3, D4, A4), tw('strathern', 'good', 0.5), 0.45, step=0.15, ring=1.9)
card(tc('space', 2.6), 0.0035, px(1550))
chord((A2, C4, E4), tw('deming', 'system', 0.1), 0.42, step=0.16, ring=1.6)
chord((Bb2, D4, F4, Bb4), tw('no', 'no', 0.3), 0.42, step=0.14, ring=1.6)
pop(tw('no', 'shows', 2.5), 0.0022, px(1460))                        # her answer, typed in, sent
pop(tw('review', 'takes', -0.2), 0.0022, px(1460), up=False)         # the director's reply
chord((F2, A3, C4, F4, A4), tw('review', 'ranked', 0.3), 0.42, step=0.14, ring=1.8)
written('N3', pen, 0.0045)
for kind in ('cross', 'tick'):
    k = stroke('N3', kind, True); ticked(k['t0'], 0.0045, px(k['x']) * 0.5)
chord((Bb2, F3, D4), stroke('N3', 'tick', True)['t0'] + 0.1, 0.4, step=0.16, ring=1.6, until=E('target'))

# 6. On Monday: back in Sweden, the barrier road: the card, and F major, low, as the voice says what Sweden fixed. The university,
#    December: the team smiles at the board, and F, A and C, as in the opening's close. Helena's pen, a page of her notebook: each
#    measure paired, a blade with its low partner; the next film's card; and the close: A4 alone, then F major, held into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
card(S0('monday') + 1.0, 0.0035, px(370))
chord((F2, A3, F4), mw('back', 'fixed', 0.3), 0.42, step=0.16, ring=1.8)
for wd, m in (('measured', F4), ('read', A4), ('fixed', C5)):
    blade(m, mw('helena', wd, 0.0), 0.38, px(1000) * 0.4, ring=1.0)
written('N4', pen, 0.0045)
k = stroke('N4', 'Pair each measure')
pair(C4, F2, k['t0'], 0.4, ring=1.3, pan=px(k['x']) * 0.3)
card(mc('next', 0.4), 0.0035, px(370))
mark(mw('end', 'together', 0.2), 0.5, ring=1.5)
chord((F2, F3, C4, F4, A4), mw('end', 'people', 0.3), 0.5, step=0.16, ring=5.0, until=TOT)
