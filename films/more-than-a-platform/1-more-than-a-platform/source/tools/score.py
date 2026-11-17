# More than a platform: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 12 November 2026 against every film's score: chime bars, made here (music.py has none).
#  - Chime bars: single bars of metal, each over its own tube, struck with a yarn mallet, as a station's announcement plays them
#    before it names the next stop. A route has stations; this film names eleven. Each note is the bar's first tone, pure and long over
#    its tube, with the tube's octave faintly above it; the bar's second tone (2.76 times as high) sounds only at the strike, and the
#    mallet is a soft thud. Nothing above 2.2 kHz, no vibrato, and each note simply dies away.
#  - The mark: four notes (G, D, B, G above), the call before an announcement. It plays three times: under the title card, when the
#    route's last station is named, and under the end card.
#  - G major for the route and what works; E minor for the half that courses leave out; C major for the foundations and for
#    enterprise data architecture. Just intonation from G (hz()), so every chord is pure.
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
# 1. Beyond the platform: the opening, with music under it. The introduction's map: a low G, then B as gold lights. It works: G and
#    D, with the tag set down. A platform alone: a low E. The four places fill: a tap for each, and C, E and G under them, one by one.
#    The title card: the mark.
b0 = S0('beyond')
Bd = lambda lid, word, off=0: W('beyond', lid, word, off)
bar(G2, b0 + 0.4, 0.9, -0.3, 3.4)
bar(D3, G('beyond', 'basics', 0.2), 0.7, -0.2, 2.6)
bar(B3, Bd('basics', 'decision', -0.3), 0.7, 0.2, 2.6)
tJ = G('beyond', 'matters', 0.1)
knock(tJ, 0.010, px(960), 260); bar(G3, tJ + 0.05, 0.7, -0.1, 2.8); bar(D4, tJ + 0.05, 0.55, 0.2, 2.8)
bar(E2, G('beyond', 'alone', 0.0), 0.85, 0.0, 3.6)
knock(G('beyond', 'alone', 0.25), 0.011, px(960), 240)
for i, (word, m) in enumerate((('organisation', C3), ('word', E3), ('decides', G3), ('see', C4))):
    tap(Bd('still', word, -0.1), 0.008, px((390, 1530, 390, 1530)[i])); bar(m, Bd('still', word, 0.0), 0.6, (-0.4, 0.4, -0.4, 0.4)[i], 2.6)
mark(G('beyond', 'breath', 0.5), 0.9)
bar(G2, G('beyond', 'breath', 0.5), 0.7, 0.0, 3.6)

# 2. Why this portal. Only half: a knock as each card is set down, and E minor, a low E. You join them: one tap. The model and the
#    policy: a knock, a tap. The author: a breath of air as the line draws; a tap for each role; 16+ years: B, and the pill. The
#    pieces gather: soft taps. Learning Data: G, B and D, together. The two halves joined by the gold thread: a low C.
Pt = lambda lid, word, off=0: W('portal', lid, word, off)
knock(Pt('tech', 'technical', -0.2), 0.011, px(460), 230); knock(Pt('neutral', 'neutral', -0.2), 0.011, px(1460), 230)
bar(E2, G('portal', 'half', 0.3), 0.75, 0.0, 3.4)
tap(G('portal', 'join', 0.1), 0.008, px(960))
knock(Pt('wrong', 'model', 0.0), 0.010, px(620), 260); tap(Pt('wrong', 'policy', 0.0), 0.007, px(1300))
air(G('portal', 'author', 0.2), 1.4, 0.006, 0.0, 150, 800)
for i, word in enumerate(('applications', 'data', 'enterprise architecture')):
    tap(Pt('author', word, -0.1), 0.007, px((410, 960, 1510)[i]))
tY = Pt('author', 'sixteen', 0.0)
knock(tY, 0.010, px(960), 260); bar(B3, tY + 0.05, 0.6, 0.0, 2.8)
for i in range(0, 9, 2):
    tap(G('portal', 'slowly', 0.2 + i * 0.32 + 0.9), 0.005, px(330 + i * 157))
tL = G('portal', 'ld', 0.1)
bar(G3, tL, 0.75, -0.3, 3.0); bar(B3, tL + 0.25, 0.6, 0.0, 3.0); bar(D4, tL + 0.5, 0.55, 0.3, 3.0)
bar(C3, Pt('eda', 'Joining', 0.0), 0.75, 0.0, 3.4)

# 3. The foundations. The route begins: G and D. Each of its first stations arrives with one soft tap. The many voices on tools:
#    nothing, as the tags appear (no burst); the foundations: a low C. The layers of the business: a tap for each. Governance's three
#    reasons: one low E under them. The newer way: C, E and G, one after another, as glossary, checks and code join up.
Fd = lambda lid, word, off=0: W('found', lid, word, off)
tR = Fd('route', 'route', 0.0)
bar(G3, tR, 0.75, -0.6, 2.8); bar(D4, tR + 0.45, 0.6, -0.5, 2.8)
tap(G('found', 'ea', 0.6), 0.008, px(300)); tap(G('found', 'gov', 0.6), 0.008, px(510))
bar(C3, Fd('tools', 'far fewer', 0.0), 0.7, 0.0, 3.0)
for i, word in enumerate(('does', 'needs', 'systems', 'connect')):
    tap(Fd('how', word, 0.0), 0.006, px(960))
bar(E2, G('found', 'slow', 0.2), 0.7, -0.4, 3.4)
knock(Fd('policies', 'policies', 0.0), 0.010, px(430), 230)
tN = Fd('newer', 'glossary', -0.2)
bar(C4, tN, 0.6, 0.0, 2.6); bar(E4, (tN + Fd('newer', 'code', -0.2)) / 2, 0.55, 0.3, 2.6); bar(G4, Fd('newer', 'code', -0.2), 0.55, 0.6, 2.6)
knock(Fd('newer', 'code', 0.4), 0.010, px(1315), 260)

# 4. The rest of the route. The main line: a tap as each station arrives. Deeper into each layer: B and D. Two branch lines leave: a
#    breath of air, E above and E below. They meet again: G, B and D together. The last station: the mark.
Rs = lambda lid, word, off=0: W('rest', lid, word, off)
tMn = Rs('main', 'main line', 0.0)
for i, x in enumerate((760, 960, 1160, 1350)):
    tap(tMn + 0.7 + i * 0.55, 0.007, px(x))
tD = Rs('deeper', 'each layer', 0.0)
bar(B3, tD, 0.6, 0.0, 2.6); bar(D4, tD + 0.3, 0.5, 0.2, 2.6)
tB = G('rest', 'branch', 0.2)
air(tB, 1.4, 0.006, px(700), 150, 800); bar(E4, tB + 0.6, 0.5, -0.1, 2.6)
tap(Rs('share', 'shares', 0.5), 0.007, px(880)); tap(Rs('share', 'shares', 1.2), 0.007, px(1210))
bar(E3, Rs('agents', 'AI agents', 0.4), 0.55, 0.1, 2.6); tap(Rs('agents', 'AI agents', 0.6), 0.007, px(1045))
tM = Rs('whole', 'ends', 0.6)
bar(G3, tM, 0.65, 0.3, 3.0); bar(B3, tM + 0.02, 0.55, 0.35, 3.0); bar(D4, tM + 0.04, 0.5, 0.4, 3.0)
tap(Rs('whole', 'data management', 0.3), 0.007, px(1572))
mark(Rs('lead', 'leading data people', 0.4), 0.85)

# 5. A real project. The project opens: a breath of air, and a low G. The build ends green: G and D. The folders most projects leave
#    out: a soft tap as each is marked, then the metadata's bracket: C and E. The tool wars: nothing. The capabilities: one knock for
#    each block. Using them well: D and G.
Pj = lambda lid, word, off=0: W('project', lid, word, off)
air(Pj('real', 'real project', -0.3), 1.0, 0.006, px(630), 150, 800); bar(G2, Pj('real', 'real project', 0.0), 0.7, -0.3, 3.0)
tG = Pj('open', 'run', 0.0)
bar(G3, tG, 0.6, 0.5, 2.6); bar(D4, tG + 0.03, 0.5, 0.55, 2.6)
for word in ('glossary', 'owners', 'architecture map', 'data products', 'contracts', 'decisions'):
    tap(Pj('list', word, -0.1), 0.005, px(400))
tMt = Pj('meta', 'business', -0.1)
bar(C3, tMt, 0.65, -0.2, 3.0); bar(E3, tMt + 0.3, 0.55, -0.1, 3.0)
for i in range(3):
    knock(Pj('show', 'same capabilities', i * 0.2), 0.009, px(520 + i * 440), 240)
tWl = Pj('well', 'using', 0.0)
bar(D3, tWl, 0.6, 0.0, 2.8); bar(G3, tWl + 0.25, 0.55, 0.0, 2.8)

# 6. Beyond DAMA. The wheel draws itself: C and G. What this portal adds: a knock for each card. The enterprise around the
#    paradigms brightens: a breath of air. Enterprise data architecture: C, E and G, together, held.
Dm = lambda lid, word, off=0: W('dama', lid, word, off)
tW = Dm('dama', "DAMA's wheel", -0.2)
bar(C3, tW, 0.7, 0.0, 3.2); bar(G3, tW + 1.0, 0.55, 0.0, 3.0)
for i, word in enumerate(('enterprise architecture', 'AI agents', 'leadership')):
    knock(Dm('further', word, -0.1), 0.009, px((330, 1590, 1590)[i]), 240)
air(Dm('why', 'enterprise', 0.0), 1.6, 0.006, 0.0, 150, 800)
tE = Dm('means', 'Enterprise data architecture', -0.1)
bar(C3, tE, 0.75, -0.2, 3.6); bar(E3, tE + 0.03, 0.6, 0.0, 3.6); bar(G3, tE + 0.06, 0.55, 0.2, 3.6)

# 7. Learn by doing. The question rises: a knock. The right answer: G and B. The near miss: nothing. The lab's button: a tap, and the
#    event lands in bronze: a soft knock. The scenario's pick: a tap; the steps fall into order: D. A goal lights its stops: B and E.
#    Progress stays: one G as the ring closes.
Dg = lambda lid, word, off=0: W('doing', lid, word, off)
knock(Dg('question', 'stops', 0.0), 0.010, px(960), 240)
tOk = Dg('close', 'close', 0.4)
bar(G3, tOk, 0.6, 0.4, 2.6); bar(B3, tOk + 0.03, 0.5, 0.45, 2.6)
tEn = Dg('enrol', 'Enrol', 0.5)
tap(tEn, 0.008, px(450)); knock(tEn + 1.8, 0.010, px(1560), 220)
tap(Dg('scenario', 'make the call', 1.2), 0.007, px(560))
bar(D4, Dg('scenario', 'order', 2.2), 0.55, 0.4, 2.6)
tLg = Dg('goal', 'lights up', 0.0)
bar(B3, tLg, 0.6, 0.0, 2.6); bar(E4, tLg + 0.04, 0.5, 0.2, 2.6)
bar(G3, G('doing', 'stays', 1.2), 0.65, -0.4, 3.0)

# 8. Start. Platforms have matured: nothing. Everything else: a tap as each of the four words lights, then A and F sharp over D,
#    together, short. Start there: a tap, as the next stop lights. The end card: the mark.
St = lambda lid, word, off=0: W('start', lid, word, off)
for i, word in enumerate(('organisation', 'meaning', 'decisions', 'people')):
    tap(St('hard', word, -0.1), 0.006, px((330, 750, 1170, 1590)[i]))
tH = END('start', 'hard') + 0.2
bar(D3, tH, 0.7, 0.0, 2.0); bar(Fs3, tH + 0.03, 0.55, 0.15, 2.0); bar(A3, tH + 0.06, 0.5, 0.3, 2.0)
tap(G('start', 'there', 0.1), 0.008, px(300))
mark(G('start', 'breath', 0.5), 0.95, last=2.8)
