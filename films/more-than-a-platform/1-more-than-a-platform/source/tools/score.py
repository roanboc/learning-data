# More than a platform: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 12 November 2026 against every film's score: chime bars, made here (music.py has none).
#  - Chime bars: single bars of metal, each over its own tube, struck with a yarn mallet, as a station's announcement plays them
#    before it names the next stop. A route has stations; this film names eleven. Each note is the bar's first tone, pure and long over
#    its tube, with the tube's octave faintly above it; the bar's second tone (2.76 times as high) sounds only at the strike, and the
#    mallet is a soft thud. Nothing above 2.2 kHz, no vibrato, and each note simply dies away.
#  - The mark: four notes (G, D, B, G above), the call before an announcement. It plays three times: under the title card, when the
#    last station is named, and under the end card.
#  - G major for the route and what works; E minor for the meeting's two numbers; C major where the film says what changes the
#    answer. Just intonation from G (hz()), so every chord is pure.
# The rules the films keep (tools/quiet.py checks them):
#  - Music only from time to time: under the opening, and after it only at a chapter's turn, under a moment on screen or in a pause
#    without words; never a bed under the voice.
#  - Nothing trembles, pulses or beats; no urgent pulse (film.json's "urgent" is empty: nothing in this film is a rush).
#  - Every sound is an event on screen, at the moment it appears, with the same timing as the picture in src/scenes.js. A station
#    arriving is one soft tap, not a note: eleven notes in a minute would be a tune played under the voice.
# And everything stays low and soft, below about 2.5 kHz.

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
R1 = np.random.default_rng(1112)  # this film's own randomness: the room

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. G major (G B D),
# C major (C E G), D major (D F sharp A), E minor (E G B) and B minor (B D F sharp) are all pure in this table; A with E is not
# (40/27), so no A minor chord, and A sounds only with D or F sharp
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (55, 195.998)  # G 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
G2, A2, B2, C3, D3, E3, Fs3, G3, A3, B3, C4, D4, E4, Fs4, G4, A4, B4, C5, D5 = 43, 45, 47, 48, 50, 52, 54, 55, 57, 59, 60, 62, 64, 66, 67, 69, 71, 72, 74
E2 = 40
MARK = (G3, D4, B3, G4)  # the mark: the call before an announcement

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films', whose sound the author accepted; the effects about 16 dB under the music (FX scales them all)
OL, FX = 0.075, 2.2

# a room round the players: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what
# it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level after it (_held()),
# as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: the room moves a pure note's level up or down by where its reflections meet it, so
    the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- a chime bar, struck with a yarn mallet: the bar's first tone, pure and long over its tube; the tube's octave, faint; the bar's
# second tone only at the strike; the mallet's soft thud. sec is how long it rings
def bar(m, a, g=1.0, pan=0.0, sec=2.6, room=0.3):
    f = hz(m); n = int((sec + 0.1) * SR); x = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * x) * np.exp(-x / (sec * 0.3))
    if 2 * f < 2200:
        s = s + 0.2 * np.sin(2 * np.pi * 2 * f * x + 0.3) * np.exp(-x / (sec * 0.13))
    if 2.756 * f < 2200:
        s = s + 0.16 * np.sin(2 * np.pi * 2.756 * f * x + 0.6) * np.exp(-x / 0.1)
    s = s * np.minimum(x / 0.014, 1) ** 2 * np.clip((sec + 0.1 - x) / 0.25, 0, 1)
    thud = filt(noise(n / SR + 0.01)[:n], 'band', (120, 600)) * 0.05 * np.exp(-x / 0.02)
    s = s + thud; s = s / max(1e-9, float(np.abs(s).max()))
    put(_held(filt(s.astype(np.float32), 'low', 2200), room), a, g * OL, pan)
def mark(s, g=1.0, step=0.5, last=3.4):
    """the mark: four notes, the call before an announcement"""
    for i, m in enumerate(MARK):
        bar(m, s + step * i, g * (1.0, 0.85, 0.85, 0.95)[i], pan=(-0.2, 0.1, -0.05, 0.2)[i], sec=last if i == len(MARK) - 1 else 2.0)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.013, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a station arrives, a count appears"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.010, pan=0.0, sec=0.5):
    """a sheet slid onto the table"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.007, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across"""
    s_air(s, sec, g * FX, pan, lo, hi)

# =============================================================================================================================
# 1. It worked: the opening, with music under it. The phone: a low G. A decision: B, and the card set down. It worked: G and D,
#    together. A week later, two numbers: E minor, a low E, then G and B as the two sheets slide onto the table. Which one? Nothing.
#    The title card: the mark.
w0 = S0('worked')
Wk = lambda lid, word, off=0: W('worked', lid, word, off)
bar(G2, w0 + 0.4, 0.9, -0.3, 3.2)
bar(D3, G('worked', 'tap', 0.1), 0.7, -0.3, 2.4)
bar(B3, Wk('tap', 'decision', 0.0), 0.75, 0.1, 2.4)
knock(Wk('seat', 'A new class', 0.0), 0.012, px(1280))
bar(G3, Wk('seat', 'a hundred and forty', 0.0), 0.6, 0.15, 2.2)
tJ = G('worked', 'job', 0.2)
knock(tJ, 0.010, px(1280), 260); bar(G3, tJ + 0.05, 0.75, -0.1, 2.8); bar(D4, tJ + 0.05, 0.6, 0.2, 2.8)
bar(E2, G('worked', 'why', 0.0), 0.85, 0.0, 3.6)
paper(Wk('why', 'two offices', 0.0), 0.010, px(700), 0.6); bar(G3, Wk('why', 'two offices', 0.5), 0.6, -0.25, 2.6)
paper(Wk('why', 'two numbers', 0.0), 0.010, px(1220), 0.6); bar(B3, Wk('why', 'two numbers', 0.5), 0.6, 0.25, 2.6)
tap(Wk('why', 'same meeting', 0.4), 0.008, px(960))
mark(G('worked', 'breath', 0.5), 0.9)
bar(G2, G('worked', 'breath', 0.5), 0.7, 0.0, 3.6)

# 2. One word. "enrolled": one note, G. Three systems, three counts: a tap for each count. Each one is right: G, B and D, together.
#    The platform moves all three: a breath of air along the lanes, and the pill set down. More teams, an agent: a tap for each card.
#    Repeated everywhere: a tap for each count. The platform was never the problem: a low G. What changes the answer: C major, a
#    note for each of the three things.
Wd = lambda lid, word, off=0: W('word', lid, word, off)
bar(G3, Wd('one', 'enrolled', -0.1), 0.8, 0.0, 3.0)
knock(Wd('office', 'one system', 0.0), 0.010, px(960))
for i, (lid, word) in enumerate((('sis', 'signed up'), ('lms', 'can open'), ('fin', 'has paid'))):
    tap(Wd(lid, word, 0.3), 0.008, px((330, 960, 1590)[i]))
tR = Wd('three', 'each one', 0.0)
bar(G3, tR, 0.7, -0.3, 2.8); bar(B3, tR + 0.25, 0.6, 0.0, 2.8); bar(D4, tR + 0.5, 0.6, 0.3, 2.8)
air(G('word', 'moves', 0.5), 1.6, 0.006, px(620), 150, 800)
knock(Wd('moves', 'without', 0.0), 0.011, px(960), 260)
for i in range(3):
    tap(G('word', 'teams', 0.5 + i * 0.25), 0.006, px(1610))
knock(G('word', 'agent', 0.5), 0.010, px(1610), 200)
for i in range(3):
    tap(Wd('repeat', 'everywhere', i * 0.22), 0.007, px(1740))
tap(Wd('repeat', 'confidence', 0.0), 0.008, px(1740))
bar(G2, G('word', 'never', 0.0), 0.8, 0.0, 3.4)
for i, (word, m) in enumerate((('how the organisation', C3), ('what was defined', E3), ('who decided', G3))):
    bar(m, Wd('answer', word, 0.0), 0.75, (-0.2, 0.0, 0.2)[i], 3.0)

# 3. The route. Here is the route: G and D. Each station arrives with one soft tap, where it is on the map. The foundations: a
#    low G and D, together. Two side routes leave: a breath of air, E above and E below. They all meet again: G, B and D together.
#    The last station: the mark.
Rt = lambda lid, word, off=0: W('route', lid, word, off)
bar(D3, G('route', 'where', 0.3), 0.7, 0.0, 2.6)
tH = G('route', 'here', 0.0)
bar(G3, tH, 0.8, -0.4, 2.6); bar(D4, tH + 0.45, 0.65, -0.3, 2.6)
for lid, x in (('ea', 300), ('gov', 510), ('model', 760), ('basics', 960), ('ae', 1160), ('dq', 1350), ('mdm', 880), ('prot', 1210), ('agents', 1045), ('dm', 1572)):
    tap(G('route', lid, 0.5), 0.008, px(x))
tF = G('route', 'found', 0.1)
bar(G2, tF, 0.8, -0.35, 3.2); bar(D3, tF + 0.05, 0.65, -0.3, 3.2)
tS = G('route', 'side', 0.3)
air(tS, 1.4, 0.006, px(700), 150, 800); bar(E4, tS + 0.5, 0.55, -0.1, 2.6); bar(E3, tS + 1.6, 0.6, -0.1, 2.6)
tM = G('route', 'meet', 0.2)
bar(G3, tM + 0.7, 0.7, 0.3, 3.0); bar(B3, tM + 0.72, 0.6, 0.35, 3.0); bar(D4, tM + 0.74, 0.55, 0.4, 3.0)
mark(Rt('lead', 'leading data people', 0.4), 0.85)

# 4. One map among many. DAMA's wheel: C and G, as the wheel draws itself. This one is a route: a breath of air as the wheel opens
#    out, and one D as the route arrives.
Wh = lambda lid, word, off=0: W('wheel', lid, word, off)
tW = Wh('dama', "DAMA's wheel", -0.2)
bar(C3, tW, 0.75, 0.0, 3.2); bar(G3, tW + 1.2, 0.6, 0.0, 3.0)
air(G('wheel', 'ours', 0.2), 1.5, 0.006, 0.0, 150, 800)
bar(D3, G('wheel', 'ours', 1.5), 0.7, 0.0, 3.0)

# 5. What you can do here: a tap for each of the six shapes. A goal lights up its stops: B and E, together. What you have done
#    stays: one G as the first station's ring closes.
Hr = lambda lid, word, off=0: W('here', lid, word, off)
for i, t_ in enumerate((Hr('films', 'short films'), G('here', 'ask', 0.2), G('here', 'lab', 0.2), G('here', 'call', 0.2), G('here', 'goal', 0.2), G('here', 'search', 0.3))):
    tap(t_ + 0.05, 0.008, px(210 + i * 300))
tL = Hr('goal', 'lights up', 0.0)
bar(B3, tL, 0.65, 0.0, 2.6); bar(E4, tL + 0.04, 0.5, 0.2, 2.6)
bar(G3, G('here', 'stays', 1.2), 0.7, -0.4, 3.0)

# 6. Start. Platforms have matured: nothing. Everything else: A and F sharp over D, together, short. Start there: a tap, as the next
#    stop lights. The end card: the mark.
tE = G('start', 'hard', 0.3)
bar(D3, tE, 0.7, 0.0, 2.0); bar(Fs3, tE + 0.03, 0.55, 0.15, 2.0); bar(A3, tE + 0.06, 0.5, 0.3, 2.0)
tap(G('start', 'there', 0.1), 0.008, px(300))
mark(G('start', 'breath', 0.5), 0.95, last=2.8)
