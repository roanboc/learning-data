# When strategy moves: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for Kenya in 2007, a felt piano over pizzicato strings and
# soft held chords in F-sharp minor (no borrowed Kenyan instruments: the story is told in the series' own voice). Then nylon-string
# plucks and a soft flute, in A major, F-sharp minor's relative, for the present, and the series' own mark, four notes rising
# 1-3-5-8, on the flute and the nylon string together, at the title and the end. The change has its own figure, the ripple: soft
# notes falling on the felt piano, one for each layer as the light reaches it, down to the agent's counter in Kenya, down the map as
# Tomás walks it, and down the map again in his answer. The felt piano comes back, softly, wherever the change reaches a household:
# the bill, the letter and the call centre's answer, the tenant found, and the first bills in July.
# When the music plays (the author's review, 20 October 2026, as for the master data films; tools/quiet.py checks it):
#  - Under the opening, Kenya's story, chords follow the narration. After it, music comes in from time to time: a chord at some
#    chapters' turns, under a moment on screen (the light reaching the bottom of the map, a call that goes the same way every time,
#    the page in the morning, Kenya again in July) or in a pause without words, and the notes of what appears. Never a constant bed
#    under the voice.
#  - Nothing trembles or pulses: every chord has one voice to a note, the felt piano one string, and the flute's pitch is summed in
#    double precision, so nothing beats on a phone's one speaker; and no pulse under "by tomorrow".
#  - Nothing loops, and every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the
#    picture in src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: wooden knocks, paper, muffled keys, low felt notes, filtered below about 2.5 kHz. The felt piano
# and the pizzicato are played with their tops taken off, at 2.2 and 1.6 kHz, like the nylon string.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
# where something sits across the frame, as a pan: the frame's left edge is -0.75, its right edge 0.75
P = lambda x: max(-0.8, min(0.8, (x - 960) / 960 * 0.75))
# the scenes' cubic ease, and its inverse (src/scenes.js: ease, d10_inv), for the notes that fall from the bus
_ease = lambda u: 4 * u ** 3 if u < 0.5 else 1 - (-2 * u + 2) ** 3 / 2
def _inv(f, v):
    a, b = 0.0, 1.0
    for _ in range(24):
        m = (a + b) / 2; a, b = (m, b) if f(m) < v else (a, m)
    return (a + b) / 2

# ---- the series' instruments, all low-passed ----
def nylon(m, start, g=0.04, pan=0.0, sec=1.8):
    """a nylon string: a few harmonics that fade from the top, warm and short"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.4) * np.exp(-x * (1.2 + 1.6 * k)) for k in range(1, 8))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2200)), start, g, pan)
def fpiano(m, start, g=0.04, pan=0.0, sec=3.4):
    """the felt piano, for Kenya, the ripple, and wherever the change reaches a household: a hammer softened with felt, one string
    (the first version's two strings a hair apart beat on a phone's speaker), its partials in tune with each other, so one note's
    octave doesn't beat with the next, its upper partials fading first, and its top taken off"""
    f = mf(m); x = tt(sec).astype(np.float64); s = np.zeros(len(x), np.float32)
    for k, w in ((1, 1.0), (2, 0.42), (3, 0.16), (4, 0.07), (5, 0.03)):
        s += (1.5 * w * np.sin(2 * np.pi * f * k * x) * np.exp(-x * (0.6 + 0.7 * k))).astype(np.float32)
    x = x.astype(np.float32)
    th = np.zeros_like(x); n = min(len(x), int(0.03 * SR)); th[:n] = (filt(noise(0.03), 'low', 600) * np.exp(-tt(0.03) * 90))[:n]
    s = s * np.minimum(1, x / 0.007) + 0.6 * th
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g, pan)
def pizz(m, start, g=0.04, pan=0.0):
    """a pizzicato string: plucked with a finger, round and short, with the body's knock under it"""
    f = mf(m); x = tt(0.8)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.4 * k) * (1 / k ** 1.3) * np.exp(-x * (5.0 + 2.5 * k)) for k in range(1, 7))
    s = s * np.minimum(1, x / 0.002) + 0.25 * np.sin(2 * np.pi * 280 * x) * np.exp(-x * 40)
    put(norm(filt(s.astype(np.float32), 'low', 1600)), start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0, f=240):
    """a soft wooden knock, for a card or a note arriving"""
    s_knock(s, g, pan, f)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pencil(s, g=0.02, pan=0.0, sec=0.5):
    """a pencil on paper: a soft, short scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec), s, g, pan)
def marker(s, g=0.02, pan=0.0, sec=0.4):
    """a marker's stroke: broader than a pencil, and rougher, as its felt drags on the paper"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1700)) * (0.55 + 0.45 * np.sin(2 * np.pi * 15 * x)) * np.sin(np.pi * x / sec) ** 0.7, s, g, pan)
def press(s, g=0.1):
    """a stamp or a confirmation: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def held(ch, start, sec, g=0.03):
    """a held chord, soft and warm: one voice to a note, each a little apart across the stereo field, swelling slowly. (From words to
    data's pad() gives each note three voices a hair apart, which beat when a phone's one speaker adds the two channels together)"""
    x = tt(sec).astype(np.float64); e = env(sec, min(2.4, sec * 0.4), min(3.0, sec * 0.45)); sw = 1 + 0.08 * np.sin(2 * np.pi * 0.07 * x)
    for k, m in enumerate(ch):
        ph = 2 * np.pi * mf(m) * x
        put(((np.sin(ph) + 0.18 * np.sin(2 * ph)) * e * sw / len(ch)).astype(np.float32), start, g * 1.58, (k / max(1, len(ch) - 1) - 0.5) * 0.8)
def comes(ch, t0, sec=6.0, g=0.03, bassg=0.016):
    """a chord that comes in for a moment and leaves, bloomed by t0: at a chapter's turn, under a moment on screen, or in a pause
    without words; its root an octave down, as a low sine"""
    held(ch, t0 - 1.0, sec, g)
    if bassg:
        drone(ch[0] - 12, t0 - 1.0, sec, bassg, 'sine')
def swell(ch, s, sec=3.0, g=0.03):
    """a soft swell, instead of a shimmer: a short held chord"""
    held(ch, s, sec, g)
def flute(m, start, sec, g=0.04, pan=0.0):
    """From words to data's flute, its phase summed in double precision: summed in single (music.tt() gives float32 times), a long
    note's pitch slips by about a hertz at a time, and beats with the same note on the nylon string"""
    f = mf(m); x = tt(sec).astype(np.float64); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.0 * x) * np.minimum(1, x / 0.6)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)
    br = filt(noise(sec), 'band', (f * 0.8, f * 2.2)) * 0.25
    put(norm(((s + br) * env(sec, 0.12, min(0.4, sec * 0.4))).astype(np.float32)), start, g, pan)
def air(s, sec=0.9, g=0.03, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g, pan, 140, 900)
def _move(sig, s, g, p0, p1):
    """a sound that crosses the frame with what it belongs to, from pan p0 to p1"""
    p = np.linspace(p0, p1, len(sig)).astype(np.float32)
    X(sig * np.sqrt(0.5 * (1 - p)), s, g, -1.0); X(sig * np.sqrt(0.5 * (1 + p)), s, g, 1.0)
def glide(s, sec, g, p0, p1, lo=150, hi=1000):
    """a breath of air that crosses the frame, as a light travels from one side to the other"""
    x = tt(sec); _move(filt(noise(sec), 'band', (lo, hi)) * np.sin(np.pi * x / sec) ** 2, s, g, p0, p1)
def rise(s, sec=1.2, g=0.03):
    """the wall between the network and retail, drawn down the frame: a low roll that grows with it and settles"""
    x = tt(sec); X(filt(noise(sec), 'low', 220) * np.sin(np.pi * x / sec) ** 1.5, s, g)

# ---- Kenya's own sounds ----
def bus(s, sec, g, p0, p1):
    """the bus west, on the map: a low engine and its tyres on the road, carried across the frame with it"""
    x = tt(sec); e = (np.minimum(1, x / 0.8) * np.clip((sec - x) / 1.2, 0, 1)).astype(np.float32)
    sig = filt(noise(sec), 'band', (60, 380)) * (1 + 0.3 * np.sin(2 * np.pi * 11 * x)) + 0.3 * filt(noise(sec), 'band', (300, 900))
    _move((sig * e).astype(np.float32), s, g, p0, p1)

# chords (MIDI note numbers): F-sharp minor and its neighbours for Kenya; A major, its relative, and its neighbours for the present
FSM9 = [42, 49, 52, 56, 57]; DMAJ7 = [38, 45, 49, 54]; CSSUS = [49, 54, 56, 61]; AMAJ7 = [45, 52, 56, 61]; BM9 = [47, 50, 54, 57, 61]
AMAJ9 = [45, 52, 56, 59, 61]; DMAJ9 = [38, 45, 49, 52, 54]; E6 = [40, 47, 52, 54, 56]; ESUS4 = [40, 47, 52, 57, 59]
# the ripple: soft notes falling, one for each layer the change reaches
RIP = [76, 73, 71, 69, 66, 64]
def ripple(times, g=0.016, pan=0.0, notes=RIP):
    for k, (t0, m) in enumerate(zip(times, notes)):
        fpiano(m, t0, g * (1 - 0.06 * k), pan)
def mark(start, root=57, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.026, bassg=0.016):
    """the opening's chords, under Kenya's story only: spread over the span, each starting 2 s early and lasting 4 s longer, so they
    never drop out while the story is told"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        held(ch, s0 + i * d - 2.0, d + 4.0, g)
        if bassg:
            drone(ch[0] - 12, s0 + i * d - 2.0, d + 4.0, bassg, 'sine')


# 1. Money by phone: the opening, the one chapter with chords all through: F-sharp minor, held, and the felt piano for the people:
#    a note as the man appears in Nairobi, three for his family upcountry. The bus west, low, carried along the road; a pizzicato note
#    falling for each banknote lost on the way, a low felt note for "not all of it arrives", and a thin note as what's left arrives.
#    The network's strategy: paper as its note goes up, and two felt notes; air as it moves aside for the phones. The phones: a knock
#    for each, muffled keys as the menu is chosen and sent, air along the arc, and two notes on the felt piano as the family's phone
#    confirms it. A knock for each layer as the map stacks; air as the strategy flies into its layer; a knock and a pizzicato note for
#    each thing it took, lower the further down the map; paper at the agent's counter as the cash goes in and comes out, and a felt
#    piano note for mobile money. Then the ripple, down every layer to the counter; air as the counter comes forward; paper as the
#    cash is handed over upcountry, and the felt piano; then A major, and the mark under the title
K = 'kenya'
bed(K, [FSM9], 0, cq(K, 'cash'))
bed(K, [DMAJ7, CSSUS], cq(K, 'cash'), cq(K, 'strategy'))
bed(K, [BM9, ESUS4], cq(K, 'strategy'), cq(K, 'launch'))
bed(K, [AMAJ7, E6], cq(K, 'launch'), cq(K, 'idea'))
bed(K, [DMAJ7, BM9, FSM9, DMAJ7], cq(K, 'idea'), cq(K, 'link'))
bed(K, [ESUS4], cq(K, 'link'), cq(K, 'breath'))
fpiano(66, W(K, 'home', 'A man', -0.1), 0.016, 0.3)
for j, m in enumerate([61, 64, 69]):
    fpiano(m, W(K, 'home', 'his family', -0.1 + j * 0.12), 0.012, -0.4)
air(W(K, 'home', 'sends', -0.3), 2.2, 0.01, -0.05)
tB0 = C(K, 'cash', 0.2)
bus(tB0 - 0.2, 5.4, 0.02, 0.35, -0.4)
for j, (ud, m) in enumerate([(0.34, 57), (0.55, 54), (0.76, 52)]):
    td = tB0 + 4.6 * _inv(_ease, ud / 0.94); pizz(m, td, 0.014, 0.25 - 0.3 * j); paper(td + 0.05, 0.008, 0.25 - 0.3 * j, 0.35)
soft(42, W(K, 'cash', 'not all', 0.2), 0.02, -0.35)
fpiano(61, tB0 + 4.75, 0.01, -0.45)
tS = C(K, 'strategy')
paper(tS + 0.1, 0.03, P(1400), 0.5)
tNs = W(K, 'strategy', 'new strategy', 0.1)
fpiano(69, tNs, 0.014, P(1400)); fpiano(73, tNs + 0.22, 0.012, P(1400))
tL = C(K, 'launch')
air(tL - 0.6, 1.1, 0.012, 0.2)
knock(tL + 0.3, 0.014, 0.6); knock(tL + 0.38, 0.014, -0.6)
tSel, tOK, tGo = W(K, 'launch', 'money sent', -0.3), W(K, 'launch', 'from a phone', 0.2), W(K, 'launch', 'confirmed', -0.7)
for t0 in (tSel, tOK, tGo - 0.5):
    tap(t0, 0.012, 0.6)
pizz(64, tGo, 0.012, 0.6); glide(tGo, 1.0, 0.016, 0.6, -0.6)
fpiano(69, tGo + 1.0, 0.016, -0.6); fpiano(73, tGo + 1.18, 0.014, -0.6)
tI = C(K, 'idea')
tMk = W(K, 'idea', 'Making it real', -0.2)
for i in range(6):
    knock(tMk + 1.4 * (i + 0.5) / 6, 0.01, P(1260), 262 - 12 * i)
tFly = W(K, 'idea', 'much more', 0.3)
air(tFly, 1.2, 0.016, P(700)); knock(tFly + 1.2, 0.016, P(1100)); pizz(61, tFly + 1.22, 0.014, P(1100))
for ln, wd, m, x in [('bank', 'central bank', 69, 1180), ('bank', 'held in trust', 66, 1180), ('agents', 'become agents', 66, 1480),
                     ('menu', 'register', 64, 1180), ('menu', 'short menu', 61, 1120), ('menu', 'simplest', 59, 1100)]:
    t0 = W(K, ln, wd, -0.2); knock(t0 + 0.1, 0.012, P(x)); pizz(m, t0 + 0.12, 0.012, P(x))
tA = C(K, 'agents')
knock(tA + 0.1, 0.016, P(360)); paper(tA + 0.15, 0.016, P(360), 0.4)
tIn = W(K, 'agents', 'changing', -0.2)
paper(tIn + 0.75, 0.016, P(360), 0.4); paper(tIn + 1.9, 0.016, P(360), 0.35)
fpiano(73, W(K, 'agents', 'mobile money', 0.3), 0.014, P(360))
tLk = W(K, 'link', 'every layer', -0.3)
ripple([tLk + 1.1 * i / 4 for i in range(5)] + [tLk + 1.7], 0.016, P(976))
tG = W(K, 'link', 'shop counter', -0.1)
air(tG, 1.6, 0.014, -0.3)
tGv = W(K, 'link', 'where people', -0.3)
paper(tGv + 0.8, 0.014, 0.0, 0.4); paper(tGv + 2.3, 0.018, 0.0, 0.45); fpiano(69, tGv + 2.35, 0.014, 0.0); fpiano(73, tGv + 2.6, 0.012, 0.0)
bed(K, [AMAJ9], cq(K, 'breath') + 0.4, None, g=0.03, bassg=0.022)
mark(G(K, 'breath', 1.6), 57)
# After the opening, music only from time to time: chords at a few turns, moments and pauses, and the notes of what appears
# 2. A direction: an A major chord at the turn, for the present, and the nylon string. Paper as Tomás's note goes up, and air as it
#    moves aside; paper for the direction, and a highlighter's stroke as each of its phrases is read; a knock for the agency, air for
#    the arrow to it, and a nylon note for each eligible home it lights; a knock for the utility, and a low felt note as it doesn't
#    know which. Paper for the minister's office's note, and a knock for the clock; no pulse under "by tomorrow"
D = 'direction'
comes(AMAJ9, S0(D) + 0.4, 7.0, 0.03)
paper(S0(D) + 0.3, 0.03, 0.0, 0.5)
air(C(D, 'letter', -0.5), 0.9, 0.014, 0.4)
paper(C(D, 'letter', 0.2), 0.034, -0.05, 0.6)
for wd in ['first of July', 'every eligible', 'social tariff', 'a discount', 'automatically', 'no forms']:
    marker(W(D, 'tariff', wd, -0.1), 0.008, -0.15, 0.45)
tKn = W(D, 'agency', 'another organisation')
knock(tKn - 0.2, 0.018, P(1590)); air(tKn, 0.8, 0.012, 0.3)
for k, i in enumerate([1, 4, 6, 9]):
    nylon([69, 73, 76, 81][k], W(D, 'agency', 'social services', 0.2 + i * 0.05), 0.012, P(1590))
tNot = W(D, 'agency', 'not to the utility')
knock(tNot - 0.3, 0.018, P(1590)); soft(45, tNot + 0.2, 0.02, P(1590))
paper(C(D, 'ask', 0.1), 0.032, 0.0, 0.5)
tTm = W(D, 'ask', 'by tomorrow')
knock(tTm - 0.2, 0.014, P(1222))
# 3. Down every layer: paper for the direction's sentence, beside the whole map. The ripple, a note at a time, as the light reaches
#    each layer; a knock and a nylon note for each element the change adds, a muffled key for each it touches, and another as its
#    owner is named; air as the camera goes back; paper for who must agree, a knock for each owner, and a short swell for the list.
#    In the wordless moment the light reaches the bottom, the ripple falls again, quickly, as each layer pulses, over an A major chord
H = 'walk'
Lw = {k: C(H, k) for k in ['mot', 'out', 'str', 'bus', 'inf', 'runs', 'owners']}
paper(C(H, 'easy', 0.2), 0.03, P(270), 0.5)
tW = C(H, 'walk')
ripple([tW + 2.3, Lw['str'], Lw['bus'], Lw['inf'], Lw['runs'], W(H, 'runs', 'secure exchange')], 0.016, P(300))
WALK = [('mot', 'new driver', 1, 290, 69), ('mot', 'keep bills', 0, 760, 0), ('out', 'an outcome', 1, 1290, 73), ('str', 'selling energy', 0, 1290, 0),
        ('str', 'serving customers', 0, 1508, 0), ('str', 'meeting obligations', 0, 1726, 0), ('bus', 'new product', 1, 260, 64), ('bus', 'new step', 1, 965, 69),
        ('bus', 'new partner', 1, 1450, 73), ('bus', 'agreement', 1, 1745, 76), ('inf', 'eligibility', 1, 960, 71), ('runs', 'billing system', 0, 590, 0),
        ('runs', 'customer system', 0, 1020, 0), ('runs', 'secure exchange', 1, 1180, 66)]
OWNED = {'new driver', 'keep bills', 'an outcome', 'meeting obligations', 'new product', 'new step', 'agreement', 'eligibility', 'billing system', 'customer system', 'secure exchange'}
for ln, wd, nw, x, m in WALK:
    t0 = W(H, ln, wd, -0.15)
    if nw:
        knock(t0 + 0.05, 0.014, P(x)); nylon(m, t0 + 0.1, 0.014, P(x))
    else:
        tap(t0 + 0.1, 0.01, P(x))
    if wd in OWNED:
        tap(t0 + 0.6, 0.007, P(x))
tap(W(H, 'str', 'serving customers', 0.5), 0.007, P(1399))
air(C(H, 'owners', 0.6), 2.2, 0.012, 0.3)
paper(C(H, 'owners', 1.0), 0.026, P(1440), 0.5)
for i in range(5):
    knock(C(H, 'owners', 1.3 + i * 0.3), 0.01, P(1200))
swell([45, 52, 57, 61], W(H, 'owners', 'the list'), 3.0, 0.016)
ripple([G(H, 'breath', li * 0.22) for li in range(6)], 0.012, P(300))
comes(AMAJ9, G(H, 'breath', -0.2), E(H) - G(H, 'breath') + 3.6, 0.03)
# 4. Ask once: a knock for each organisation; paper and a nylon note for the principle, a pencil as it's written, and a muffled key
#    for "as in Tartu"; a knock for the household and paper for the form it won't fill in, two marker strokes as it's crossed out.
#    Paper and a knock for the agreement, a muffled key for Ama; air that crosses with what goes and with what comes back, and a
#    nylon note for each home the utility now knows; a dull knock and a low note where what never goes stops at the agreement's edge,
#    and a pencil as it's struck through. A knock for each bar of when it starts: the agreement today, changing the systems later.
#    No chord: the walk's last one carries into it
O = 'once'
knock(C(O, 'knows', -0.1), 0.018, P(1595)); knock(C(O, 'knows', 0.2), 0.018, P(325))
tOo = W(O, 'knows', 'Once only', -0.1)
paper(tOo, 0.03, 0.0, 0.5); nylon(69, tOo + 0.3, 0.016, 0.0)
pencil(W(O, 'knows', "don't make", -0.2), 0.01, 0.0, 0.6)
tap(W(O, 'knows', 'as in Tartu', -0.1), 0.01, P(1300))
knock(W(O, 'knows', 'a household', -0.3), 0.016, P(800))
paper(W(O, 'knows', 'prove', -0.2), 0.026, P(1110), 0.45)
tX = W(O, 'knows', 'already knows', -0.1)
marker(tX, 0.018, P(1110), 0.42); marker(tX + 0.45, 0.018, P(1110), 0.42)
tAg = W(O, 'least', 'the agreement', -0.1)
paper(tAg, 0.03, 0.0, 0.55); knock(tAg + 0.05, 0.012, 0.0); tap(tAg + 0.5, 0.01, P(1218))
nylon(64, W(O, 'least', 'the least', -0.1), 0.012, -0.1)
tGo = W(O, 'least', 'matching details', -0.2)
glide(tGo + 0.2, 1.5, 0.016, -0.7, 0.7); knock(tGo + 1.4, 0.01, P(1595))
tBk = W(O, 'least', 'eligible', -0.2)
glide(tBk + 0.2, 1.5, 0.016, 0.7, -0.7)
for k, i in enumerate([1, 4, 6, 9]):
    nylon([69, 73, 76, 81][k], tBk + 1.3 + i * 0.06, 0.011, P(325))
tNo = W(O, 'never', 'which support', -0.2)
knock(tNo + 0.45, 0.02, P(1240), 160); soft(40, tNo + 0.47, 0.02, P(1240)); pencil(tNo + 0.5, 0.012, 0.0, 0.5)
knock(W(O, 'first', 'starts today', -0.2), 0.014, P(600)); pencil(W(O, 'first', 'starts today', 0.0), 0.008, P(600), 0.8)
knock(W(O, 'first', 'changing the systems', -0.3), 0.014, P(1100)); pencil(W(O, 'first', 'changing the systems', -0.1), 0.008, P(1100), 0.8)
# 5. The wall holds: a D major chord at the turn, a low roll as the wall is drawn, a knock for each side's element; paper for Tomás's
#    draft and a marker as its line crosses the wall, a knock for the principles and a nylon note as the third lights; two low felt
#    notes, a semitone apart, as the wall turns red; two marker strokes as Ama crosses it out, and a third through the draft. Paper for
#    the decision, a pencil for each of its rows, and a soft press and a low note as the wall holds; a nylon note for each principle
#    checked, rising, a press for the stamp, and an A major chord, the moment on screen, as the call goes the same way every time
V = 'wall'
comes(DMAJ9, S0(V) + 0.4, 6.0, 0.03)
rise(S0(V) + 0.4, 1.2, 0.026)
knock(S0(V) + 0.6, 0.014, P(610)); knock(S0(V) + 0.8, 0.014, P(1470)); knock(S0(V) + 1.0, 0.012, P(1470), 210)
paper(C(V, 'draft', 0.1), 0.03, P(1440), 0.5)
tap(W(V, 'draft', 'network charge'), 0.01, P(610))
tLn = W(V, 'draft', 'the network too', -0.3)
x = tt(1.3); _move((filt(noise(1.3), 'band', (350, 1700)) * (0.55 + 0.45 * np.sin(2 * np.pi * 15 * x)) * np.sin(np.pi * x / 1.3) ** 0.5).astype(np.float32), tLn, 0.016, P(1268), P(812))
marker(tLn + 1.3, 0.012, P(824), 0.25)
tC_ = C(V, 'check', 0.4)
knock(tC_, 0.016, P(490)); paper(tC_ + 0.02, 0.016, P(490), 0.4)
nylon(64, W(V, 'check', 'third principle', -0.2), 0.016, P(490))
tRd = W(V, 'cross', 'cross the wall', -0.1)
soft(41, tRd, 0.022, 0.0); soft(40, tRd + 0.14, 0.02, 0.0)
tOut = W(V, 'cross', 'crosses it out', -0.1)
marker(tOut, 0.022, P(960), 0.35); marker(tOut + 0.35, 0.022, P(960), 0.35); marker(tOut + 0.5, 0.014, P(1440), 0.6)
tRec = W(V, 'decide', 'decision', -0.2)
paper(tRec, 0.034, P(1430), 0.6)
tWr, tWe = W(V, 'decide', 'written down'), W(V, 'decide', 'crosses the wall', 0.4)
for k in range(5):
    pencil(tWr + (tWe - tWr) * k / 5, 0.009, P(1430), 0.4)
tNn = W(V, 'decide', 'nothing new', 0.2)
press(tNn, 0.02); soft(45, tNn + 0.05, 0.018, 0.0)
tTk = W(V, 'same', 'the principles', -0.2)
for i, m in enumerate([69, 73, 76]):
    nylon(m, tTk + i * 0.35, 0.014, P(490)); tap(tTk + i * 0.35, 0.008, P(860))
press(W(V, 'same', 'Checked', -0.1), 0.028)
comes(AMAJ9, W(V, 'same', 'every time', -0.2), 5.0, 0.026)
# 6. New rules, with homes: a knock for each layer of the map's slice and for eligibility; paper for the form, and a nylon note for
#    each of its labels as it's named, rising; then, for each rule, paper as it's written in and a pencil for each of its lines; air as
#    it moves onto the map, a knock as it lands beside its home, and a nylon note as the realisation line reaches it. Paper for the
#    catalogue, a muffled key for the call centre, a nylon note for "on the social tariff", and a soft press as the rest is masked.
#    No chord: only the notes of what appears
R = 'rules'
knock(S0(R) + 0.25, 0.01, P(490)); knock(S0(R) + 0.45, 0.01, P(490), 220); knock(S0(R) + 0.5, 0.014, P(255))
tap(W(R, 'new', 'Eligibility', 0.1), 0.01, P(255))
paper(W(R, 'new', 'new rules', -0.3), 0.026, P(1410), 0.5)
for wd, m in [('a home', 64), ('an owner', 69), ('a reason', 73)]:
    nylon(m, W(R, 'new', wd, -0.1), 0.012, P(1410))
tRs = [C(R, 'r1'), C(R, 'r2'), C(R, 'r3')]; tCat = W(R, 'r3', 'the call centre sees', -0.9)
RW = [('r1', 'The discount', 'every bill', [500, 222]), ('r2', 'An answer', 'kept only', [500, 512]), ('r3', 'only billing', 'reads it', [500, 632])]
for k, (ln, w0, w1, (mx, my)) in enumerate(RW):
    paper(tRs[k] - 0.3, 0.024, P(1410), 0.4)
    if k < 2:
        rows = [W(R, ln, w0, -0.2), W(R, ln, w1, 0.2), W(R, ln, 'Its reason', -0.1), W(R, ln, 'Its reason', 0.6)]
    else:
        rows = [W(R, ln, w0, -0.2), W(R, ln, w0, 0.3), W(R, ln, w0, 0.7)]
    for r_ in rows:
        pencil(r_, 0.008, P(1410), 0.35)
    tGo_ = tRs[k + 1] - 0.5 if k < 2 else tCat
    air(tGo_, 1.2, 0.014, P(1100)); knock(tGo_ + 1.2, 0.014, P(mx + 190)); nylon([64, 66, 69][k], tGo_ + 1.5, 0.012, P(mx))
paper(tCat + 0.5, 0.024, P(1410), 0.5)
tap(W(R, 'r3', 'the call centre sees', -0.2), 0.01, P(1500))
nylon(69, W(R, 'r3', 'on the social tariff', -0.1), 0.014, P(1500))
press(W(R, 'r3', 'nothing more', -0.1), 0.016)
# 7. Down to the counter: paper for the bill, the letter and the call centre's answer as each arrives, and the felt piano as each is
#    lit, where the change reaches the household; a muffled key for the caller's question and another for the answer. Air as the
#    three move up; a knock for the tenant's home, air along each side's dashed line, a nylon note for what the agency knows and a low
#    note for what the utility doesn't; a dull knock and a low note for "no match". Then the felt piano as the tenant's home is found,
#    paper for the application, and a soft press for its tick. No chord: the felt piano is the household's
N = 'counter'
for d, x in [(0.1, 370), (0.5, 960), (0.9, 1550)]:
    paper(C(N, 'down', d), 0.024, P(x), 0.45)
tBl, tLt, tCc = W(N, 'down', 'a line on the bill', -0.2), W(N, 'down', 'a letter', -0.2), W(N, 'down', "call centre's", -0.2)
for t0, m, x in [(tBl, 69, 370), (tLt, 73, 960), (tCc, 76, 1550)]:
    fpiano(m, t0 + 0.2, 0.014, P(x))
tap(tCc + 0.1, 0.01, P(1550)); tap(tCc + 0.8, 0.01, P(1550))
air(C(N, 'miss', -0.4), 1.6, 0.014, 0.0)
tTn = W(N, 'miss', 'tenants')
knock(tTn - 0.4, 0.016, P(820)); air(tTn - 0.1, 0.6, 0.008, P(620))
nylon(69, W(N, 'miss', 'The agency knows'), 0.012, P(420))
tLl = W(N, 'miss', "landlord's name")
air(tLl - 0.1, 0.6, 0.008, P(1300)); knock(tLl + 0.5, 0.016, P(865), 170); soft(40, tLl + 0.52, 0.018, P(865))
soft(45, W(N, 'miss', "the utility doesn't"), 0.016, P(890))
tRt = C(N, 'route')
fpiano(66, tRt + 0.6, 0.016, P(820)); fpiano(73, tRt + 0.82, 0.014, P(820))
paper(W(N, 'route', 'an application', -0.3), 0.028, P(1290), 0.5)
press(W(N, 'route', 'later in', 0.2), 0.02)
# 8. Where the data lands: a D major chord at the turn, from the household to the data; air as the bill slides in, a muffled key as
#    its line lights, a knock for the product, air as the line flows into it, a knock as its columns come in, a knock and a nylon note
#    for the new column, and a pencil's tick and a nylon note as amount due keeps its meaning. The contract: paper as it comes in, and
#    a knock for version 1; a muffled key for each line added, and a nylon note as the new column joins version 1; a knock for
#    "breaks nothing", and a muffled key as the contract stays at version 1. A low felt note for the second version, faint, the last
#    resort, a knock for its tag and a pencil for each of its reasons. Lineage: paper, air for the search, a nylon note for each reader
#    found, rising, a muffled key for each owner, and a soft press as each is told. The exchange: a knock for each side and for the
#    agreement, a nylon note as the contract realises it, paper for the contract, air that crosses with what goes and what comes
#    back, and a pencil round the wheel for how often
L_ = 'lands'
comes(DMAJ9, S0(L_) + 0.4, 6.0, 0.03)
air(S0(L_) + 0.2, 1.6, 0.012, -0.4)
tap(W(L_, 'line', 'discount line', -0.2), 0.01, P(320))
tPr = W(L_, 'line', 'the accounts', -0.3)
knock(tPr, 0.018, P(1270)); air(tPr + 0.3, 0.7, 0.01, P(660)); tap(tPr + 0.5, 0.008, P(1700))
knock(W(L_, 'line', 'gets a new', -0.3), 0.014, P(1270))
tNw = W(L_, 'line', 'new column', -0.1)
knock(tNw + 0.05, 0.012, P(1270)); nylon(73, tNw + 0.1, 0.014, P(1270))
tKp = W(L_, 'line', 'keeps its meaning', -0.2)
pencil(tKp + 0.1, 0.01, P(1270), 0.3); nylon(69, tKp + 0.15, 0.014, P(1270))
tV_ = C(L_, 'version', -0.3)
paper(tV_, 0.024, P(1410), 0.5); knock(tV_ + 0.05, 0.014, P(277))
tAd = W(L_, 'version', 'A new column', -0.1)
for k in range(2):
    tap(tAd + 0.1 + k * 0.18, 0.008, P(1410))
nylon(73, tAd + 0.2, 0.014, P(277))
knock(W(L_, 'version', 'breaks nothing', -0.1), 0.012, P(277))
tap(W(L_, 'version', 'stays at', 0.1), 0.01, P(1410))
tS2 = W(L_, 'version', 'A second version', -0.2)
soft(42, tS2 + 0.1, 0.014, P(702))
knock(W(L_, 'version', 'last resort', -0.1), 0.012, P(702))
tRm = W(L_, 'version', 'removing or', -0.1)
pencil(tRm, 0.008, P(702), 0.35); pencil(tRm + 0.5, 0.008, P(702), 0.35)
paper(C(L_, 'lineage', -0.5), 0.026, 0.0, 0.5)
air(W(L_, 'lineage', 'finds', -0.1), 1.0, 0.012, -0.3)
tE = [W(L_, 'lineage', 'a measure', -0.2), W(L_, 'lineage', 'a report', -0.2), W(L_, 'lineage', 'collections', -0.3)]
for t0, m in zip(tE, [64, 68, 71]):
    nylon(m, t0 + 0.8, 0.012, P(1300)); tap(t0 + 0.9, 0.007, P(1560))
tT_ = W(L_, 'lineage', 'Each owner', -0.1)
for i in range(3):
    paper(tT_ + i * 0.35, 0.008, P(1300), 0.3); press(tT_ + i * 0.35 + 0.9, 0.012)
knock(C(L_, 'exchange', -0.3), 0.016, P(245))
knock(W(L_, 'exchange', 'the agency', -0.2), 0.016, P(1675))
tToo = W(L_, 'exchange', 'too', -0.3)
knock(tToo, 0.014, 0.0); nylon(69, tToo + 0.8, 0.012, 0.0)
paper(C(L_, 'exchange', -0.1), 0.03, 0.0, 0.55)
tap(W(L_, 'exchange', 'own contract', -0.2), 0.008, P(700))
glide(W(L_, 'exchange', 'what goes', 0.1), 1.2, 0.016, -0.6, 0.6)
glide(W(L_, 'exchange', 'comes back', 0.1), 1.2, 0.016, 0.6, -0.6)
tOf = W(L_, 'exchange', 'how often', -0.1)
pencil(tOf, 0.01, P(900), 1.2); nylon(64, tOf + 1.2, 0.012, P(900))
# 9. The path: a knock for each plateau as it arrives, rising; a muffled key for its name; a nylon note as each step of the order
#    lights in gold, rising; air as the camera moves down; paper for each set of changes, and a muffled key for each change in it.
#    No chord
T_ = 'path'
for i, x in enumerate([240, 720, 1200, 1680]):
    knock(S0(T_) + 0.5 + i * 0.3, 0.014, P(x), 220 + 22 * i)
tap(W(T_, 'plateaus', 'plateaus', -0.1), 0.008, 0.0)
tOr = W(T_, 'plateaus', 'in the order', -0.1)
for i, (m, x) in enumerate(zip([61, 64, 69], [480, 960, 1440])):
    nylon(m, tOr + 0.35 * i, 0.014, P(x))
air(C(T_, 'dates', -0.9), 1.8, 0.012, 0.0)
for wd, x, items in [('first of July', 480, ['the match', 'the bills', "call centre's"]), ('By December', 960, ['second route']), ('Next year', 1440, ['the outcome'])]:
    paper(W(T_, 'dates', wd, -0.3), 0.022, P(x), 0.4)
    for iw in items:
        tap(W(T_, 'dates', iw, -0.25), 0.008, P(x))
# 10. Answered in a day: an A major chord for the morning, paper for the page, a pencil for each row as it's written; a soft press and
#     a nylon note as it's lit, air as it moves aside; a knock and a low note for what an unmapped organisation finds instead, and
#     three low felt notes, falling, for what it finds in production
Q = 'page'
comes(AMAJ9, S0(Q) + 0.4, 6.0, 0.03)
paper(S0(Q) + 0.3, 0.036, 0.0, 0.65)
for wd in ['what changes', 'who owns', 'ready by July', "what isn't"]:
    pencil(W(Q, 'page', wd, -0.2), 0.012, 0.0, 0.5)
tDy = W(Q, 'day', 'in a day', -0.1)
press(tDy, 0.02); nylon(69, tDy + 0.05, 0.016, P(540))
air(C(Q, 'day', -0.7), 1.6, 0.014, -0.4)
tUn = W(Q, 'day', 'an unmapped', -0.2)
knock(tUn, 0.018, P(1460)); soft(42, tUn + 0.05, 0.018, P(1460))
for i, m in enumerate([47, 46, 45]):
    soft(m, W(Q, 'day', 'finds out', i * 0.4), 0.016, P(1460))
# 11. The first of July: a muffled key as each row of homes appears, paper as the bills drop in, and the felt piano, rising, as the
#     discount lights the eligible homes; a soft press for their ticks, a nylon note for the one the match missed. Air as the street
#     moves aside; paper for the measure Farah asked for, a knock for the goal, a pencil for each year she asked, a muffled key for
#     each home falling behind, a press and a nylon note as it's confirmed, and a short swell as the goal can be steered. Kenya again,
#     a few years on: the opening's F-sharp minor chord comes back for a moment, the felt piano scattered as the phones spread, a
#     pizzicato note for the man and his family, and the same two notes as money sent home arrives. Then Tomás's note and its answer:
#     paper, a knock for each layer as the map stacks, the ripple once more as the change lands in every layer, air as the map moves
#     up, a knock as each owner, rule and contract lands, and the plateaus in order, the series' four notes on the nylon string; low
#     notes as the map goes stale, a muffled key for each week since it was updated; paper for the next note. In the pause without
#     words, as the notes glow, an A major chord to the end, the felt piano once under the end card, and the mark
J = 'july'
for r in range(6):
    tap(S0(J) + 0.2 + r * 0.12 + 0.2, 0.007, 0.0)
tFb = W(J, 'bills', 'first bills', -0.2)
paper(tFb + 0.2, 0.022, 0.0, 1.3)
tDs = W(J, 'bills', 'the discount', -0.2)
for k, (m, x) in enumerate(zip([64, 66, 69, 71, 73], [695, 1355, 915, 1135, 1025])):
    fpiano(m, tDs + k * 0.12, 0.012, P(x))
tNn = W(J, 'bills', 'nine in ten', -0.2)
press(tNn + 0.2, 0.016); nylon(66, tNn + 0.45, 0.012, P(1465))
tM = C(J, 'measure')
air(tM - 0.6, 1.6, 0.014, -0.3)
paper(tM - 0.2, 0.028, P(1340), 0.5)
tFB = W(J, 'measure', 'falling behind', -0.2)
for fb in range(5):
    knock(tFB + fb * 0.12, 0.008, P(500), 200)
tYr = W(J, 'measure', 'since 2024', -0.2)
for k in range(4):
    pencil(tYr + k * 0.25, 0.008, P(1310), 0.2)
tCf = W(J, 'measure', 'confirms', -0.1)
press(tCf, 0.022); nylon(69, tCf + 0.05, 0.016, P(1340))
tGl = W(J, 'measure', 'the goal', -0.3)
knock(tGl, 0.016, P(1340)); swell([45, 52, 57, 61], tGl + 0.2, 3.0, 0.016)
tKy = C(J, 'kenya')
comes(FSM9, tKy - 0.2, 7.0, 0.026)
tMany = W(J, 'kenya', 'within', -0.2)
for k, (m, p) in enumerate(zip([66, 69, 73, 71, 76, 73], [-0.3, 0.2, -0.1, 0.35, 0.0, -0.4])):
    fpiano(m, tMany + 0.3 + k * 0.5, 0.008, p)
pizz(61, tKy + 1.4, 0.01, 0.3)
for j in range(3):
    pizz([64, 66, 69][j], tKy + 1.6 + j * 0.1, 0.009, -0.4)
tSn = W(J, 'kenya', 'money sent home', -0.3)
pizz(64, tSn, 0.012, 0.3); glide(tSn, 1.0, 0.016, 0.3, -0.4); fpiano(69, tSn + 1.0, 0.016, -0.4); fpiano(73, tSn + 1.18, 0.014, -0.4)
tAn = C(J, 'answer')
paper(tAn - 0.6, 0.028, P(620), 0.5)
for i in range(6):
    knock(tAn - 0.3 + 1.4 * (i + 0.5) / 6, 0.008, P(1300), 262 - 12 * i)
tAw = W(J, 'answer', 'has an answer', -0.1)
paper(tAw, 0.032, P(620), 0.55)
tIo = W(J, 'answer', 'in order', -0.2)
pencil(W(J, 'answer', 'an answer'), 0.006, P(620), tIo + 0.6 - W(J, 'answer', 'an answer'))
tLd = W(J, 'answer', 'lands', -0.2)
ripple([tLd + li * 0.24 for li in range(6)], 0.016, P(934))
air(W(J, 'answer', 'walked down', -0.2), 1.6, 0.012, 0.3)
tO_, tR_, tC2 = W(J, 'answer', 'owners', -0.3), W(J, 'answer', 'rules', -0.3), W(J, 'answer', 'contracts', -0.3)
for i in range(4):
    knock(tO_ + 0.15 * (3 - i) + 0.8, 0.01, P(1050), 230 + 10 * (3 - i))
for i in range(3):
    knock(tR_ + 0.2 * (2 - i) + 0.8, 0.01, P(1394), 250 + 10 * (2 - i))
for i in range(2):
    knock(tC2 + 0.2 * (1 - i) + 0.8, 0.01, P(1733), 270 + 10 * (1 - i))
for i, (m, x) in enumerate(zip([57, 61, 64, 69], [1000, 1240, 1500, 1790])):
    nylon(m, tIo + i * 0.2 + 0.1, 0.014, P(x))
tSt = W(J, 'next', 'goes stale', -0.3)
soft(47, tSt + 0.2, 0.016, P(1300)); soft(45, tSt + 0.6, 0.016, P(1300))
for n_ in range(1, 14):
    tap(tSt + 0.2 + 2.2 * n_ / 13, 0.005, P(1395))
paper(W(J, 'next', 'Next', -0.1), 0.03, P(640), 0.5)
comes(AMAJ7, G(J, 'breath'), TOT - G(J, 'breath') + 1.0, 0.034, bassg=0.026)
fpiano(76, G(J, 'breath', 0.6), 0.014, 0.3)
mark(G(J, 'breath', 1.4), 57)
