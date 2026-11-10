# Good enough for what?: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the module's setup thread on 5 November 2026 after it checked every score.py on main
# (/mnt/project-files/data-quality/palettes.md, where this film's thread took the partner the same day): cloud-chamber bowls, made
# here (music.py has none).
#  - The lead, the small bowls: the tops of large glass laboratory bottles, cut off and hung, struck softly with felt. Glassware made
#    for one use, found fit for another. Struck, never rubbed: a soft touch of felt, then the glass rings and fades, damped, in about
#    a second. A thin glass shell rings in modes whose pitches aren't harmonics of each other (Rayleigh's ring modes, 1, 2.83, 5.42
#    and 8.77 times the lowest), which is what makes it glass and not a string or a pipe; each mode rings once, at one pitch, so a
#    bowl never wavers. Nothing above 2.3 kHz: no shimmer.
#  - The partner, the large bowls: a second set cut from the biggest bottles, lower (D2 to A3), struck once with a soft beater and
#    left to ring out. What the list is for: each use is heard under its own card as its level is agreed.
#  - The mark, played in turn, never as two bowls struck together: the small bowl alone (A4); then the large one it belongs with (D3);
#    then the small one again, the same note, now heard as the fifth above the large one's D. The bowl hasn't changed, its use has.
#    It sounds where the chart is one chart, made for one use; where good enough means good enough for a use; and under the end card.
#  - D major for what's for a use and agreed; B minor for the problem, the course that drifts and the 41 certificates; A major at
#    "Something had to change", which turns to D; G major for a new place or time. Just intonation from D (see hz()), so nothing beats.
# The rules every film of the module keeps (palettes.md, 5 November 2026):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato. No urgent pulse: nothing in this story is a rush. No
#    figure played again and again. Nothing Flemish or nautical for Mercator: no sea, no ship's bell, no creak of timber.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (four cards, five tags) is one
#    soft sound, never one for each.
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
R1 = np.random.default_rng(1569)  # this film's own randomness: the room, the felt, the phases of the glass

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other. D major (D F sharp A), G major (G B D),
# A major (A C sharp E) and B minor (B D F sharp) are pure in this table
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2, D3, Fs3 = 38, 42, 43, 45, 47, 50, 54                  # the large bowls
B3, Cs4, D4, E4, Fs4, A4, B4, Cs5, D5 = 59, 61, 62, 64, 66, 69, 71, 73, 74  # the small bowls

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the effects well under the music (FX scales them all)
RL, VL, FX = 0.062, 0.057, 1.4

# a room round the bowls: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what it
# rings where the notes are (its gain under 1.5 kHz is one), and each bowl is set back to its own level after it (_held), as the
# video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.018 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a bowl in the room, at its own level: even at a gain of one, the room moves a pure tone's level up or down by where its
    reflections meet it, so the bowl is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- a struck glass shell: its ring modes, each at one pitch and each dying away faster than the one below it, a soft onset where the
# felt meets the glass, and the felt's own small thump. Modes above 2.3 kHz are left out, and the whole is low-passed at 2.4 kHz
_RING = (1.0, 2.828, 5.423, 8.772, 12.867)
def _glass(f, tau, amps, att, thump, band):
    sec = 5 * tau + 0.2; x = np.arange(int(sec * SR)) / SR; s = np.zeros(len(x))
    for r, a in zip(_RING, amps):
        if f * r > 2300:
            break
        s += a * np.exp(-x * r ** 0.7 / tau) * np.sin(2 * np.pi * f * r * x + R1.uniform(0, 2 * np.pi))
    s *= np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2
    nt = int(0.016 * SR)
    s[:nt] += filt(R1.standard_normal(nt).astype(np.float32), 'band', band) * np.exp(-np.arange(nt) / SR / 0.004) * thump
    s *= np.cos(0.5 * np.pi * np.clip((x - sec + 0.1) / 0.1, 0, 1)) ** 2
    return filt(s.astype(np.float32), 'low', 2400)
def bowl(m, s, g=1.0, pan=0.0, tau=0.9, room=0.26):
    """a small bowl, struck softly with felt: it rings and fades, damped, in about a second"""
    put(_held(_glass(hz(m), tau, (1.0, 0.26, 0.07, 0.02), 0.004, 0.028, (300, 1500)), room), s, g * RL, pan)
def big(m, s, g=1.0, pan=0.0, tau=1.9, room=0.3):
    """a large bowl, struck once with a soft beater and left to ring out"""
    put(_held(_glass(hz(m), tau, (1.0, 0.2, 0.05, 0.016, 0.006), 0.012, 0.018, (120, 600)), room), s, g * VL, pan)
def rise(notes, s, step=0.45, g=1.0, pan=0.0, spread=0.3):
    """small bowls struck one after another, the lowest first, each let ring"""
    k = len(notes)
    for i, m in enumerate(notes):
        bowl(m, s + step * i, g * (1.0 if i == k - 1 else 0.85), pan + spread * (i / max(1, k - 1) - 0.5))
def mark(s, g=1.0, pan=0.0):
    """the mark, in turn: the small bowl alone (A4); the large one it belongs with (D3); the small one again, now the fifth above it.
    s is the moment the first is struck; the three are a second apart, so each is heard before the next"""
    bowl(A4, s, g * 0.9, pan + 0.2, tau=1.0)
    big(D3, s + 1.0, g * 0.85, pan - 0.1)
    bowl(A4, s + 2.0, g * 0.9, pan + 0.2, tau=1.2)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.013, pan=0.0, f=230):
    """a card set down, a ruler laid on the chart: a soft wooden knock"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a tag tied on, a chip, a row lit: a muffled tap"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.011, pan=0.0, sec=0.4):
    """a sheet laid down: an index card, a chart, a page of the list's file"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.9, g=0.007, pan=0.0, lo=150, hi=800):
    """a breath of air: something drawn out across the frame"""
    s_air(s, sec, g * FX, pan, lo, hi)

# =============================================================================================================================
# 1. A chart for sailors: the opening, with music all through it.
#    Duisburg, 1569: D major, the large D and three small bowls rising as Mercator's card comes in. The bearing held hour after hour:
#    the small A, then the large low D left to ring. The charts of the time: B minor; the course that drifts off its line, falling.
#    "Something had to change": A major. The stretch: the bowls rising as the chart is drawn out, and D major as every course is
#    straight. Steer it: the small A again, the course that holds. Wright, thirty years later: G major. The price, the sizes: B minor.
#    One chart, made for one use: the mark. The graduation list: G major; 41 printed again: B minor; wrote down what it's for: D major;
#    each use's level: four small bowls rising as the four brass chips come. The title card: D major, the large low D ringing out
F = lambda lid, word, off=0: W('chart', lid, word, off)
c0 = S0('chart')
big(D3, c0 + 0.35, 0.8, 0.0); knock(c0 + 0.35, 0.011, px(1560), 220)
rise((D4, Fs4, A4), c0 + 0.9, 0.55, 0.75, 0.2)
bowl(D5, F('place', 'made for sailors', 0.1), 0.55, 0.2)
# the bearing: the compass card, the small A as its one fixed angle is drawn, the large low D under "held hour after hour"
knock(F('bearing', 'compass', -0.3), 0.012, px(1500), 240)
bowl(A4, F('bearing', 'one fixed', 0.0), 0.65, px(1500))
big(D2, F('bearing', 'held hour', 0.0), 0.75, 0.0)
# the charts of the time: B minor; the chart laid down; the straight line drawn, the two ports
paper(F('plane', 'charts of the time', -0.6), 0.010, 0.0, 0.5)
big(B2, F('plane', 'But on', -0.1), 0.75, 0.0)
bowl(Fs4, F('plane', 'straight line', 0.1), 0.55, px(700))
tap(F('plane', 'two ports', -0.4), 0.008, px(700))
# steer the angle: the small D as the ship sets out, the small B as it leaves the line; missing the coast, the large F sharp, low
bowl(D4, F('drift', 'Steer', 0.0), 0.55, px(700))
bowl(B3, F('drift', 'left the line', 0.0), 0.6, px(500))
big(Fs2, F('landfall', 'miss the coast', 0.0), 0.7, 0.0)
# "Something had to change": A major
tS = F('change', 'Something', -0.1)
big(A2, tS, 0.8, 0.0); bowl(Cs5, tS + 0.4, 0.5, 0.15); bowl(E4, tS + 0.9, 0.5, -0.15)
# the stretch: the chart drawn out towards the poles, the bowls rising with it; every course straight: D major
tSt = F('stretch', 'stretched', 0.0)
air(tSt, 2.6, 0.007, 0.0, 150, 700)
rise((D4, E4, Fs4, A4), tSt + 0.2, 0.6, 0.6, 0.0, 0.4)
big(D3, F('stretch', 'every course', 0.0), 0.75, 0.0)
bowl(D5, F('stretch', 'straight line', 0.0), 0.5, 0.1)
# the ruler laid on the chart; steer it: the small A again, the course that holds
knock(F('ruler', 'rule a line', -0.3), 0.012, px(900), 200)
bowl(A4, F('ruler', 'steer it', 0.0), 0.65, px(900))
# Wright, thirty years later: G major; his card
tW = F('wright', 'Thirty years', -0.1)
knock(tW + 0.1, 0.012, px(1560), 240)
big(G2, tW, 0.75, 0.0); bowl(B4, F('wright', 'exactly', 0.0), 0.5, px(1560))
# the price: the sizes card; every country swells; Greenland as big as Africa, fourteen times smaller: B minor, the shapes redrawn
knock(F('price', 'The price', -0.05), 0.012, px(1560), 240)
bowl(Fs4, F('price', 'swells', 0.0), 0.5, px(1560))
tF = F('greenland', 'fourteen', 0.0)
big(B2, tF - 0.2, 0.7, 0.0); air(tF - 0.2, 1.8, 0.006, px(1560), 150, 700); bowl(D4, tF + 0.5, 0.5, px(1560))
tap(tF + 1.2, 0.008, px(1560))
# right for steering, wrong for comparing countries: a tag each; one chart, made for one use: the mark
tap(F('perfect', 'Right for', -0.1), 0.009, px(350)); tap(F('perfect', 'wrong for', -0.1), 0.009, px(1800))
mark(F('perfect', 'one chart', 0.0), 0.95)
# the graduation list on the bench: G major; seated well: its tag. 41 printed again: B minor, its tag
tD = F('data', 'Data is the same', 0.0)
big(G2, tD, 0.7, 0.0)
paper(F('data', 'In December', 0.0), 0.010, px(960), 0.45)
bowl(B4, F('data', 'graduation list', 0.0), 0.5, px(960))
tap(F('data', 'seated', -0.1), 0.009, px(700))
t41 = F('still', 'forty-one', 0.0)
tap(t41 - 0.1, 0.009, px(1060))
big(B2, t41, 0.7, 0.0); bowl(Fs4, t41 + 0.6, 0.45, px(1100))
# the people who use it, answer for it and build it: a chip each; wrote down what it's for: D major
for w_, x_ in (('use the list', 640), ('answer for it', 960), ('build it', 1290)):
    tap(F('benefit', w_, -0.1), 0.008, px(x_))
big(D3, F('benefit', 'wrote down', 0.0), 0.7, 0.0)
# each use's own level: four small bowls rising as the four brass chips come
tL = F('levels', 'its own level', 0.0)
for i, (m, x_) in enumerate(((D4, 720), (Fs4, 1200), (A4, 720), (D5, 1200))):
    bowl(m, tL + 0.3 * i + 0.05, 0.5, px(x_), tau=0.8)
# the title card: D major, the large low D under it, ringing out
tB = G('chart', 'breath', 0.25)
rise((D4, A4, D5), tB, 0.3, 0.55, 0.0, 0.5)
big(D2, tB + 0.1, 0.8, 0.0, tau=1.7)

# 2. Forty-one certificates: the Great Hall in December, G major as the chapter turns to it, and a chip for its six ceremonies. The list
#    laid on the granite, the printer's tag, every check passed: the small A and D, all looks well. 41 printed again: B minor, a red
#    chip for each kind of mistake; the cost and the empty folder; seated well. Andrés: the large D, warm, as he comes in. His record,
#    the name without its accents; right for a seat, and on his certificate, not his name: B minor. Was the list good? The small A,
#    alone, ringing into the chapter's end: the question, before the next chapter gives the bowl its use
R = lambda lid, word, off=0: W('reprint', lid, word, off)
r0 = S0('reprint')
tH = R('dec', 'at the university', 0.0)
big(G2, tH, 0.7, 0.0); bowl(D5, R('dec', 'Great Hall', 0.0), 0.45, px(1300))
tap(R('dec', 'six ceremonies', -0.2), 0.008, px(1300)); tap(R('dec', 'two thousand', -0.2), 0.008, px(1300))
paper(R('list', 'The graduation list', -0.1), 0.011, px(960), 0.45)
tap(R('printer', 'four weeks', -0.1), 0.009, px(640))
tP = R('passed', 'every check', -0.1)
tap(tP, 0.009, px(1150))
bowl(A4, tP + 0.1, 0.5, px(1150)); bowl(D5, tP + 0.5, 0.5, px(1150))
t41b = R('reprints', 'forty-one', 0.0)
big(B2, t41b - 0.1, 0.75, 0.0); bowl(D4, t41b + 0.5, 0.45, px(300))
for w_ in ('twenty-six', 'nine', 'six graduates'):
    tap(R('reprints', w_, -0.15), 0.008, px(200))
tap(R('cost', 'a hundred and twenty', -0.2), 0.008, px(1340))
paper(R('cost', 'empty folder', -0.3), 0.009, px(1340), 0.35)
knock(R('seats', 'seated the hall', -0.1), 0.011, px(1090), 230); tap(R('seats', 'within a few', 0.0), 0.008, px(1660))
tA = R('andres', 'Next December', 0.0)
big(D3, tA, 0.65, -0.1); bowl(Fs4, R('andres', 'Andrés', 0.3), 0.45, px(780))
tap(R('andres', 'Andrés', 0.4), 0.007, px(1080))
tap(R('held', 'without its accents', -0.2), 0.008, px(960))
tap(R('seat', 'For seating', -0.1), 0.009, px(660)); tap(R('seat', 'On his certificate', -0.1), 0.009, px(1030))
big(B2, R('seat', "isn't his name", 0.0), 0.6, 0.0)
bowl(A4, R('what', 'depends', 0.0), 0.6, 0.0, tau=1.3)

# 3. One list, four uses: January, three small bowls as the three people come in, and a tag as each is named. What they asked: its
#    card. The four uses, each card set down as it comes, and under it its large bowl as its level is agreed: seating the large D,
#    the certificates the large A, the programme the large F sharp, the government's count the large low D. Together they are one
#    chord, D major, heard a use at a time. Juran's card; good enough always means good enough for a use: the mark
U = lambda lid, word, off=0: W('uses', lid, word, off)
u0 = S0('uses')
rise((Fs4, A4, D5), u0 + 0.4, 0.4, 0.5, -0.2, 0.5)
for lid, x_ in (('malia', 310), ('mei', 690), ('jun', 1070)):
    tap(G('uses', lid, -0.1), 0.008, px(x_))
knock(U('ask2', 'They asked', -0.1), 0.011, px(1525), 240)
for i, (lid, word, m, x_) in enumerate((('seating', 'Within two percent', D3, 550), ('certs', 'Zero wrong', A2, 1370),
                                        ('prog', 'same names', Fs3, 550), ('count', 'exactly', D2, 1370))):
    knock(G('uses', lid, -0.2), 0.011, px(x_), 230)
    big(m, U(lid, word, 0.0), 0.7, px(x_) * 0.5)
knock(U('juran', 'The quality pioneer', -0.2), 0.011, px(960), 230)
mark(U('same', 'good enough always', 0.0), 0.9)

# 4. What each use needs: the row laid on the granite; its critical data, G major. The rows each use leans on lit, a tap each. The
#    six questions, a chip each; DAMA's card and ISO's line. Mercator's chart again, angles over sizes: the small D and A, as the
#    chart's course was steered. Complete and accurate lit. The four levels agreed: the large D; Mei's chip; the two films' cards
N = lambda lid, word, off=0: W('needs', lid, word, off)
n0 = S0('needs')
paper(n0 + 0.3, 0.010, px(560), 0.45)
tC = N('few', 'critical data', -0.1)
big(G2, tC, 0.65, 0.0); bowl(B4, tC + 0.5, 0.45, px(1100))
for w_ in ('each graduate once', 'their ceremony', 'whether'):
    tap(N('seatneeds', w_, -0.25), 0.007, px(560))
for w_ in ('the name as printed', 'the award', 'the date'):
    tap(N('certneeds', w_, -0.2), 0.007, px(560))
for w_, x_ in (('Is it complete', 480), ('Unique', 960), ('Valid', 1440), ('Consistent', 480), ('Accurate', 960), ('On time', 1440)):
    tap(N('ask6', w_, -0.15), 0.006, px(x_))
knock(N('dama', 'six dimensions', -0.2), 0.011, px(960), 230); tap(N('dama', 'eye-so', -0.2), 0.007, px(960))
knock(N('lean', "Mercator's chart", -0.1), 0.011, px(960), 230)
bowl(D4, N('lean', "Mercator's chart", 0.1), 0.5, -0.1); bowl(A4, N('lean', 'angles over sizes', 0.0), 0.55, 0.1)
tap(N('seatdim', 'complete', -0.2), 0.008, px(480)); tap(N('certdim', 'accurate', -0.2), 0.008, px(960))
tAg = N('agreed', 'was agreed', -0.2)
paper(G('needs', 'agreed', -0.3), 0.010, px(960), 0.45)
big(D3, tAg, 0.65, 0.0)
tap(N('agreed', 'Malia', -0.1), 0.007, px(550)); tap(N('agreed', 'Planning', -0.1), 0.007, px(1370))
tap(N('owner', 'Mei owns', -0.2), 0.008, px(960))
knock(N('films', 'Rules that run', -0.2), 0.011, px(680), 230); knock(N('films', 'Too good', -0.2), 0.011, px(1240), 230)

# 5. Written beside the data: the list's file opens, the small D and F sharp. Its lines lit as the voice names them, a tap each; the dbt
#    file and Catalog Explorer, each set down, their tags as one soft sound. Governance first, then the tools: the large D under
#    "your governance". Mercator's chart again, its title: the opening's three small bowls, rising, and the small D. The list now says
#    what it's for: the four uses' large bowls again, in turn, ringing together as one chord. The next film's card. The end card:
#    the mark, and the large low D ringing out under it
V = lambda lid, word, off=0: W('written', lid, word, off)
v0 = S0('written')
tDc = V('contract', 'the file', -0.3)
paper(tDc, 0.011, px(960), 0.45)
bowl(D4, tDc + 0.1, 0.5, -0.15); bowl(Fs4, tDc + 0.55, 0.5, 0.15)
for w_ in ('its dimension', 'its level', 'who agreed', 'what a failure'):
    tap(V('rule', w_, -0.15), 0.006, px(700))
paper(G('written', 'critical', -0.5), 0.009, px(960), 0.4); tap(V('critical', 'marked', -0.2), 0.007, px(700))
knock(G('written', 'dbt', -0.4), 0.011, px(960), 230)
tap(V('dbt', 'its dimension', -0.15), 0.006, px(700)); tap(V('dbt', 'its owner', -0.15), 0.006, px(900))
knock(G('written', 'tag', -0.4), 0.011, px(960), 230)
tap(V('tag', 'governed tag', -0.2), 0.008, px(1300)); tap(V('tag', 'whoever finds', -0.2), 0.007, px(700))
knock(V('gov', 'governance', -0.2), 0.011, px(610), 230); knock(V('gov', 'your tools', -0.2), 0.011, px(1310), 230)
big(D3, V('gov', 'governance', -0.1), 0.65, -0.2)
tBk = G('written', 'back', 0.0)
rise((D4, Fs4, A4), tBk + 0.2, 0.5, 0.55, 0.0, 0.4)
knock(V('back', 'in its title', -0.1), 0.011, px(1570), 230)
bowl(D5, V('back', 'for the use', 0.0), 0.45, px(1570))
tFu = V('list', 'four uses', -0.3)
paper(tFu, 0.010, px(960), 0.45)
for i, (m, x_) in enumerate(((D3, 550), (A2, 1370), (Fs3, 550), (D2, 1370))):
    big(m, tFu + 0.15 + 0.5 * i, 0.5, px(x_) * 0.5, tau=1.6)
knock(G('written', 'next', 0.0), 0.011, px(960), 230)
tT = V('take', 'Ask', -0.3)
mark(tT, 0.9)
big(D2, tT + 3.0, 0.75, 0.0, tau=2.0)
