# Copies that keep the rules: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette reserved for this film in the module's palettes (/mnt/project-files/data-protection/palettes.md, 5 November 2026, 13:20 UTC:
# neither "handpan" nor "hand pan" in any score.py or music.py on main or any branch, nor in any palettes list; the viola in no line of
# this module). Both are made here.
#  - The handpan (handpan()): the steel instrument first made in 2000, two shallow shells joined at the rim, the top hammered into nine
#    tuned fields round a centre note. A field struck softly with the fingers sounds its note, the octave above and the twelfth above,
#    each tuned true, and under them the shell's own hollow hum. D minor and F major only (D, A, B flat, C, D, E, F, G, A), the notes a
#    real one has: a shell made to hold every note true, as Lascaux II is a shell made to hold every painting true. The copy.
#  - The viola (viola()): bowed softly, low on its C and G strings, one voice, no vibrato, its top rolled off. The original, the cave:
#    held under the opening's scenario and problem, it stops as the cave's door shuts, and comes back once at the end, muted, while the
#    cave rests.
#  - The mark (MARK): a short phrase, D, A, B flat, A, first bowed on the viola as the paintings appear, then struck on the handpan note
#    for note as the painters copy them. In the data story the handpan answers only where a copy keeps the rules: the same shape from
#    other notes for made-up learners (A, E, F, E), the masked notes left silent in the share (D, two rests, A), one chord of totals
#    from the clean room (D, A, D); and it stays silent in the chapter where a copy wouldn't keep them, a download.
#  - Just intonation from D, so the notes that ring together are whole-number ratios of each other and nothing beats. Of the handpan's
#    notes, G never rings with C (27/20) nor E with G (32/27) or B flat (64/45): none of those pairs is played.
# The module's rules (its briefs and the governance films' check, tools/quiet.py):
#  - Music under the opening story (the first chapter); no urgent pulse anywhere (film.json's "urgent" is empty). After the opening,
#    music only at a chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as src/scenes.js.
#  - Everything stays low and soft, below about 2.5 kHz; a figure isn't played again and again.

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
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1983)  # this film's own randomness: the room, the bow, the finger

# ---- tuning: just intonation from D
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
C3, D3, E3, F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4 = 48, 50, 52, 53, 55, 57, 58, 60, 62, 64, 65, 67, 69
PAN_NOTES = (D3, A3, Bb3, C4, D4, E4, F4, G4, A4)       # the handpan's nine fields: the ding, then eight round it
MARK = (D3, A3, Bb3, A3)                                 # the original's phrase
MADE = (A3, E4, F4, E4)                                  # the same shape from other notes: made up, true to it, not it
STEP = 0.75                                              # the mark's notes, one after another

# ---- the levels, measured by tools/quiet.py as one speaker plays the score: the music's loud moments under -26.5 dB of full scale and
# its loudest notes under -23, the effects' loud moments under -43 dB (FX scales them)
HL, VL, FX = 0.063, 0.050, 1.45

def _ir(sec, lo):
    """a room's ring: noise that dies away over sec, its top rolled off at lo, after 20 ms. Its level is set by what it rings below lo
    (its gain there about one), not by all it rings: scaled by all of it, a room rings about 10 dB louder there than its share says"""
    x = np.arange(int(sec * SR)) / SR; ir = (R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32)
    ir = filt(ir, 'low', lo); ir[:int(0.02 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum() * SR / (2 * lo))
ROOM = _ir(1.5, 1800)  # a stone room: the cave's, and the hall's glass
def _room(s, wet, body=None):
    """the room round a note. body (from, to, in samples) is where the note is held: the room still moves a held note's level, up or
    down by where its reflections meet the note's partials, so the note is set back to the level it had there before the room"""
    if not wet:
        return s
    r = np.pad(s, (0, len(ROOM) - 1)) + wet * fftconvolve(s, ROOM).astype(np.float32)
    if body:
        a, b = body; r = r * np.float32(np.sqrt((s[a:b] ** 2).mean() / max(1e-12, float((r[a:b] ** 2).mean()))))
    return r

# ---- the handpan: a field struck softly with the fingers. Its note speaks at once; the octave and the twelfth (two and three times the
# note, tuned true) bloom a moment after it and die sooner, so the note sings and then settles; the shell's hollow hum, an octave under
# the ding (D 2, in tune with every field), answers each strike, the ding's most. The finger's soft thud at the strike; no wobble,
# nothing above about 2.3 kHz
def handpan(m, start, g=1.0, pan=0.0, sec=3.8, room=0.22):
    assert m in PAN_NOTES, 'the handpan has no note %d' % m
    f = hz(m); n = int((sec + 0.3) * SR); x = np.arange(n) / SR
    s = np.zeros(n)
    for k, w, dk, on in ((1, 1.0, 0.42, 0.006), (2, 0.40, 0.24, 0.014), (3, 0.17, 0.15, 0.022)):
        fk = f * k
        if fk > 2300:
            break
        s = s + w * np.minimum(1, x / on) * np.exp(-x / (dk * sec)) * np.sin(2 * np.pi * fk * x + 0.4 * k)
    hum = (0.32 if m == D3 else 0.12) * np.minimum(1, x / 0.03) * np.exp(-x / 0.7) * np.sin(2 * np.pi * hz(D3) / 2 * x)
    thud = filt(noise(0.05), 'band', (180, 900))[:n] if n else 0
    s[:len(thud)] += 0.10 * thud * np.exp(-np.arange(len(thud)) / SR / 0.008)
    s = (s + hum) / 1.4
    a, b = int(0.25 * SR), int(min(1.6, 0.45 * sec) * SR)
    put(_room(filt(s.astype(np.float32), 'low', 2300), room, (a, b)), start, g * HL, pan)
def strike(notes, t, g=1.0, pan=0.0, step=STEP, last=3.8):
    """notes struck one after another, step apart; None is a field left unstruck (a rest)"""
    for i, m in enumerate(notes):
        if m is not None:
            handpan(m, t + i * step, g, pan, last if i == len(notes) - 1 else 3.2)
def chord(notes, t, g=1.0, pan=0.0):
    """fields struck together, with two hands: the low one a moment first"""
    for i, m in enumerate(sorted(notes)):
        handpan(m, t + 0.012 * i, g / len(notes) ** 0.5, pan, 4.2)

# ---- the viola: bowed softly, low on its C and G strings, one voice, no vibrato. A bowed string's partials (each 1/k), shaped by its
# wooden body (resonances near 280 and 600 Hz), the bow's attack soft (the partials come in over a quarter second, the higher ones
# last), the note held at one level, a little rosin hiss while the bow moves, and the strings' short ring when it lifts. Muted (a mute
# on the bridge, at the end), darker and quieter
def viola(m, a, b, g=1.0, pan=-0.08, room=0.24, mute=False):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + 0.7) * SR); x = np.arange(n) / SR
    top = 950 if mute else 1500
    s = np.zeros(n)
    for k in range(1, int(2300 // f) + 1):
        fk = f * k
        body = 0.55 + 0.45 * np.exp(-((fk - 280) / 120) ** 2) + 0.35 * np.exp(-((fk - 600) / 200) ** 2)
        w = body / k * (1.0 if fk < top else np.exp(-(fk - top) / 260))
        on = np.sin(0.5 * np.pi * np.minimum(1, x / (0.22 + 0.05 * k))) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) / (0.06 + 0.22 / k)), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.9 * k)
    s = s / max(1e-9, float(np.abs(s).max()))
    held = np.where(x < sec, 1.0, np.exp(-(x - sec) / 0.05)) * np.minimum(1, x / 0.2)
    bow = filt(noise(n / SR + 0.01)[:n], 'band', (350, 1400)) * 0.010 * held
    put(_room(filt((s + bow).astype(np.float32), 'low', top + 300), room, (int(min(0.6, 0.4 * sec) * SR), int(sec * SR))), a,
        g * VL * (0.7 if mute else 1.0), pan)
def bowed(notes, t, g=1.0, mute=False, step=STEP, last=2.6):
    """a phrase on the viola: each note bowed, a breath of the bow between them, the last one held"""
    for i, m in enumerate(notes):
        d = last if i == len(notes) - 1 else step - 0.05
        viola(m, t + i * step, t + i * step + d, g, mute=mute)

# ---- the effects, soft and low, each where something happens on screen
def glass(s, g=0.016, pan=0.0):
    """a card of glass set down: a soft, round knock"""
    s_knock(s, g * FX, pan, 520)
def tap(s, g=0.009, pan=0.0):
    """a line, a tag or a tick set in place: a muffled tap"""
    s_tap(s, g * FX, pan)
def low(s, g=0.016, pan=0.0):
    """something coral set down, refused or closed: a low, dull knock"""
    s_knock(s, g * FX, pan, 190)
def latch(s, g=0.012, pan=0.0):
    """a lock shut, or a door: a small knock and the catch"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.03, g * 0.6 * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0, lo=150, hi=900):
    """a breath of air: something sliding across, a line drawn through"""
    s_air(s, sec, g * FX, pan, lo, hi)
def stone(s, sec=1.4, g=0.010, pan=0.0):
    """stone on stone: the cave's heavy door swinging shut, a low, rough slide that ends in a knock"""
    x = tt(sec); e = np.sin(0.5 * np.pi * np.clip(x / sec, 0, 1)) ** 2 * np.exp(-np.clip(x - 0.7 * sec, 0, None) / 0.12)
    X(filt((filt(noise(sec), 'band', (80, 600))[:len(x)] * e).astype(np.float32), 'low', 700), s, g * FX, pan)
    s_knock(s + sec - 0.05, g * 1.3 * FX, pan, 140)

# =============================================================================================================================
# 1. A copy to visit: Lascaux, 1948 to 1983. The viola alone, low and held, under the scenario and the problem: D on the night hill as
#    the cave opens; the mark as the paintings appear; F as the crowds come; E for their breath; B flat as the algae spread; A as the
#    paintings are lost; C for "Something has to change"; D on the hill again, its bow lifted as the cave's door shuts. A rest. The copy
#    is built: the handpan's first fields; then, as the painters copy each painting, the mark struck on the handpan note for note.
#    Lascaux II opens; millions come; the cave rests, in silence. The hall: the records; the three copies set down; the one that comes
#    to harm; the locks; the title card: the mark on the handpan
cw = lambda lid, word, off=0: W('cave', lid, word, off)
cc = lambda lid, off=0: G('cave', lid, off)
tWalls = cw('cave', 'walls'); sWall = tWalls - 0.8
viola(D3, 0.4, sWall - 0.8, 0.9)
bowed(MARK, sWall + 0.3, 0.95, last=2.8)
tap(cw('cave', 'twenty-one', 0.1), 0.007, px(1480))
viola(F3, cc('crowd', -0.6), cc('air', -0.5), 0.85)
glass(cc('crowd', 0.3), 0.013, px(1480))
viola(E3, cc('air', -0.2), cc('algae', -0.6), 0.85)
for word, x_ in (('warmth', 380), ('water', 680), ('carbon', 1010)):
    tap(cw('air', word, 0.05), 0.007, px(x_))
tAlgae = cw('algae', 'green algae')
viola(Bb3, cc('algae', -0.3), cc('lost', -0.7), 0.85)
low(tAlgae, 0.012, px(1480))
viola(A3, cc('lost', -0.4), cc('change', -0.9), 0.85)
viola(C3, cc('change', -0.6), cc('closed', -0.9), 0.8)
tCloses = cw('closed', 'closes')
viola(D3, cc('closed', -0.5), tCloses + 1.1, 0.85)
stone(tCloses, 1.3, 0.010, px(300))
low(tCloses + 0.25, 0.012, px(1490))
# the copy is built on the same hill, then painted: the handpan's first fields; the mark, note for note
tRebuilt = cw('copy', 'rebuilt')
handpan(D3, tRebuilt - 0.1, 0.8, px(1250))
handpan(A3, cw('copy', 'every bump', 0.2), 0.75, px(1350))
tap(tRebuilt + 1.65, 0.007, px(1450))
strike(MARK, cc('paint', 0.6), 0.9, px(960))
tap(cw('paint', 'natural pigments', 0.05), 0.007, px(380))
# Lascaux II opens: the open fifth; true to the cave, none of it the cave
tL2 = cw('opens', 'Lascaux Two')
glass(tL2 + 0.05, 0.013, px(1480))
chord((A3, D4), tL2 + 0.1, 0.75)
tap(cw('opens', 'true to', 0.05), 0.007, px(720)); tap(cw('opens', 'none of it', 0.05), 0.007, px(1200))
# millions in the copy: one high field, F
glass(cc('millions', 0.25), 0.012, px(1490))
handpan(F4, cc('millions', 0.35), 0.6, px(1250))
# the cave rests: a rest; the scientists' lights, and their hours
tap(cw('rests', 'two hundred', -0.3), 0.006, px(1060))
# the hall: the learners' records, like that cave; the copies asked of them, each set down; the one that comes to harm
handpan(D3, cc('records', 0.2), 0.7, px(960))
glass(cc('records', 0.3), 0.011, px(960))
for word, x_ in (('to build', 300), ('to share', 1480), ('take home', 1480)):
    glass(cw('copies', word, 0.05), 0.012, px(x_))
low(cw('copies', 'harm', 0.05), 0.012, px(1100))
# each copy keeps the protection, or isn't made: the locks shut; "To take home" struck through; the work still gets done
latch(cw('rules', 'keeps the protection', 0.3), 0.010, px(900))
handpan(D4, cw('rules', 'keeps the protection', 0.2), 0.6, px(900))
air(cw('rules', "isn't made"), 0.6, 0.008, px(1480), 200, 900)
tap(cw('rules', 'the work', 0.3), 0.007, px(700)); tap(cw('rules', 'the work', 0.45), 0.007, px(1700))
# the title card: the mark, on the handpan
strike(MARK, cc('breath', 0.5), 0.9)

# 2. Where the rules live: the catalog set down, its turn a low D; each column's class, a chip each; the tags; the slips; one policy;
#    the study's copy, read through the rules: the mark answers on the handpan; the rules live here; a copy pulled out and slid out of
#    the catalog, its chips falling, nothing guarding it; An agreement first; four copies asked for: A and D together
hw = lambda lid, word, off=0: W('home', lid, word, off)
hc = lambda lid, off=0: G('home', lid, off)
h0 = S0('home')
handpan(D3, h0 + 0.4, 0.7, px(775))
glass(h0 + 0.45, 0.012, px(435))
tClass = hw('classes', 'a class')
for i in range(5):
    tap(tClass + i * 0.18 + 0.05, 0.005, px(560))
tap(hw('classes', 'a tag', 0.1), 0.006, px(500))
glass(hc('classes', 0.1), 0.011, px(260)); glass(hw('classes', 'Tags that travel', 0.05), 0.011, px(600))
glass(hc('policy', 0.1), 0.012, px(1150))
glass(hc('policy', 1.0), 0.010, px(250))
air(hw('policy', 'hides each class'), 0.6, 0.007, px(435), 200, 900)
glass(hc('inside', 0.5), 0.012, px(1150))
tKeeps = hw('inside', 'keeps them')
tap(tKeeps + 0.1, 0.007, px(1460))
strike(MARK, tKeeps + 0.15, 0.8, px(1150))
glass(hw('catalog', 'the rules live', 0.05), 0.010, px(1370))
tap(hw('catalog', 'not in the records', 0.05), 0.006, px(330))
tLeaves = hw('leave', 'leaves the catalog')
air(tLeaves - 0.4, 2.0, 0.009, px(1300), 150, 800)
tap(tLeaves + 1.0, 0.006, px(1650)); tap(tLeaves + 1.15, 0.005, px(1650))
low(tLeaves + 1.2, 0.012, px(1700))
low(hw('leave', 'none of the rules', -0.25), 0.012, px(1700))
glass(hc('wrote', 0.1), 0.012, px(960))
tap(hw('wrote', 'where the study', -0.15), 0.006, px(960)); tap(hw('wrote', 'what may leave', -0.15), 0.006, px(960))
glass(hw('wrote', 'An agreement first', 0.05), 0.010, px(560))
tFour = hw('four', 'four copies')
for i, x_ in enumerate((560, 1360, 560, 1360)):
    glass(tFour + i * 0.25 + 0.05, 0.010, px(x_))
chord((A3, D4), tFour + 0.1, 0.6)

# 3. Made up, for building: A at the turn; Jun's cards; the clone page, refused; the clone someone left out would make, coral; a masked
#    copy, still about real people; made-up learners: the mark's shape from other notes; the script, the unit test passed; dbt's clone
#    and sample struck through; like Lascaux II: the shape again; Jun's change runs on them
mw = lambda lid, word, off=0: W('madeup', lid, word, off)
mc = lambda lid, off=0: G('madeup', lid, off)
handpan(A3, mc('day', 0.1), 0.6, px(300))
tap(mc('jun', 0.45), 0.006, px(1380)); glass(mc('jun', 0.65), 0.012, px(550))
glass(mc('ask', 0.35), 0.012, px(550))
glass(mc('clone', 0.05), 0.012, px(720))
low(mw('clone', 'refuses', 0.05), 0.012, px(140))
low(mc('exempt', 0.05), 0.012, px(470))
tap(mw('exempt', 'every real name', 0.05), 0.006, px(1100)); tap(mw('exempt', "no column's class", 0.05), 0.006, px(1150))
glass(mc('masked', 0.05), 0.012, px(540))
tap(mw('masked', 'real people', 0.05), 0.006, px(1200))
low(mw('masked', 'as it is', 0.05), 0.011, px(650))
glass(mc('madeup', 0.05), 0.012, px(540))
strike(MADE, mc('madeup', 0.5), 0.75, px(540))
tap(mw('madeup', 'none of them', 0.05), 0.006, px(420))
glass(mc('script', 0.25), 0.012, px(720))
tap(mw('script', 'For size', 0.05), 0.006, px(720)); tap(mw('script', 'columns', 0.05), 0.006, px(720))
glass(mc('unit', 0.05), 0.012, px(720))
tap(mw('unit', 'if nine', 0.05), 0.006, px(720)); tap(mw('unit', 'fewer than ten', 0.1), 0.007, px(1200))
glass(mw('never', 'clone', 0.05), 0.010, px(250)); glass(mw('never', 'sample', 0.05), 0.010, px(640))
air(mw('never', 'never used'), 0.6, 0.008, px(400), 200, 900)
glass(mc('lascaux', 0.05), 0.012, px(400))
strike(MADE, mc('lascaux', 0.5), 0.7, px(1060))
tap(mw('lascaux', 'not one is real', 0.05), 0.006, px(850))
glass(mc('runs', 0.25), 0.012, px(570))
tap(mw('runs', 'no record', 0.05), 0.006, px(1300))

# 4. Protected before it leaves: D at the turn; the hospital and its question; Mei, the agreement, its signatures; the share's page; the
#    policies that don't travel, coral; the learner table refused; the totals: the mark with its masked notes left silent; Show the
#    least; no end date, and the job that ends it
sw = lambda lid, word, off=0: W('share', lid, word, off)
sc_ = lambda lid, off=0: G('share', lid, off)
handpan(D4, sc_('day', 0.1), 0.55, px(1400))
glass(sc_('hospital', 0.05), 0.012, px(1710)); glass(sc_('hospital', 0.45), 0.012, px(1010))
tap(sc_('agreement', 0.35), 0.006, px(200)); glass(sc_('agreement', 0.45), 0.012, px(1010))
tap(sw('agreement', 'signed', 0.05), 0.007, px(1010))
glass(sc_('opensharing', 0.05), 0.012, px(1010)); glass(sw('opensharing', 'The marketplace', 0.05), 0.010, px(1650))
low(sw('travel', 'travel', 0.05), 0.012, px(800))
tap(sw('why', 'left out', 0.05), 0.006, px(750)); tap(sw('why', 'its own platform', 0.05), 0.006, px(780))
tap(sc_('every', 0.05), 0.006, px(800)); low(sw('every', 'every name', 0.05), 0.012, px(1490))
air(sc_('totals', 0.0), 0.6, 0.007, px(1000), 200, 900)
glass(sc_('totals', 0.35), 0.012, px(1010))
strike((D3, None, None, A3), sc_('totals', 0.45), 0.75, px(1010))
tap(sw('totals', 'small counts', 0.1), 0.007, px(1490)); glass(sw('totals', 'Show the least', 0.05), 0.010, px(1650))
tap(sw('ends', 'no end date', 0.05), 0.006, px(700)); glass(sw('ends', 'a job', 0.15), 0.012, px(1010))

# 5. A room for both: F at the turn, the harder question; each side's rows set down and locked, and the coral cross between them; the
#    clean room's page, each side's columns' names; the notebook, its lines; approved; it hides nothing by itself; run by the hospital:
#    one chord of totals; the answer's rows; Lascaux's scientists
rw = lambda lid, word, off=0: W('room', lid, word, off)
rc = lambda lid, off=0: G('room', lid, off)
r0 = S0('room')
glass(r0 + 0.65, 0.012, px(1010))
handpan(F4, r0 + 0.7, 0.55, px(1010))
tHw, tUr = rw('both', "the hospital's weeks"), rw('both', "the university's results")
glass(tHw + 0.05, 0.012, px(1275)); latch(tHw + 0.35, 0.008, px(1275))
glass(tUr + 0.05, 0.012, px(745)); latch(tUr + 0.35, 0.008, px(745))
low(rw('both', 'neither', 0.1), 0.012, px(1010))
glass(rc('cleanroom', 0.05), 0.012, px(1010)); glass(rc('cleanroom', 0.85), 0.010, px(1250))
glass(rc('view', 0.05), 0.010, px(765)); tap(rw('view', 'a shelf', 0.05), 0.006, px(800))
glass(rc('code', 0.05), 0.012, px(1010))
tap(rw('code', 'matches', 0.05), 0.006, px(1010)); tap(rw('code', 'counts', 0.05), 0.006, px(1010))
glass(rw('approve', 'approves it on', 0.1), 0.012, px(1300))
low(rw('hides', 'hides nothing', 0.05), 0.012, px(700)); tap(rw('hides', 'under ten', 0.05), 0.006, px(1010))
tap(rc('runs', 0.35), 0.006, px(750))
tTable = rw('runs', 'one table')
glass(tTable + 0.05, 0.012, px(1700))
chord((D3, A3, D4), tTable + 0.1, 0.8, px(1500))
tap(rw('answer', 'Twelve weeks', 0.05), 0.006, px(1700)); tap(rw('answer', 'four to seven', 0.05), 0.006, px(1700))
glass(rc('lascaux', 0.45), 0.012, px(920))

# 6. No other way out: no handpan, no copy. Elena's card and her ask; the laptop, coral, and the rules it keeps none of; the agreement's
#    line; the studies' workspace, every way out off, one by one; the switches kept as code; the network; a photo of a screen, and her
#    confidentiality agreement; she cleans it where it is; Lascaux's closed door
ow = lambda lid, word, off=0: W('out', lid, word, off)
oc = lambda lid, off=0: G('out', lid, off)
glass(oc('elena', 0.05), 0.012, px(440)); glass(oc('elena', 1.45), 0.012, px(440))
low(ow('file', 'a file on a laptop', 0.05), 0.012, px(1110)); tap(ow('file', 'no rules', 0.05), 0.006, px(1100))
glass(ow('file', 'nothing is downloaded', -0.25), 0.012, px(750)); tap(ow('file', 'nothing is downloaded', 0.05), 0.006, px(750))
glass(oc('switches', 0.25), 0.012, px(660)); tap(oc('switches', 0.45), 0.006, px(1400))
glass(ow('switches', 'Grants by design', 0.05), 0.010, px(230)); low(ow('switches', 'switched off', 0.05), 0.011, px(1160))
tDR, tEN, tCT, tDF = ow('ways', 'Downloading results'), ow('ways', 'exporting notebooks'), ow('ways', 'copying a table'), ow('ways', 'downloading a file')
for s_ in (tDR, tDR + 0.3, tEN, tCT, tDF, tDF + 0.4):
    low(s_ + 0.05, 0.009, px(1170))
glass(oc('code', 0.05), 0.012, px(660))
glass(ow('code', 'reviewed change', 0.05), 0.010, px(250)); glass(ow('code', 'audit log', 0.05), 0.010, px(620))
glass(oc('network', 0.05), 0.012, px(660)); glass(ow('network', 'Network, storage and keys', 0.05), 0.010, px(330))
tPhoto = ow('photo', 'photo')
low(min(tPhoto, oc('photo', 0.3)) + 0.05, 0.011, px(300))
air(tPhoto + 0.3, 0.4, 0.006, px(300), 300, 1500)
glass(ow('photo', 'confidentiality', -0.55), 0.012, px(960)); tap(ow('photo', 'confidentiality', 0.05), 0.006, px(960))
glass(oc('clean', 0.05), 0.012, px(660)); tap(ow('clean', 'where it is', 0.05), 0.007, px(160)); glass(oc('clean', 0.35), 0.010, px(440))
glass(oc('lascaux', 0.05), 0.012, px(660)); latch(oc('lascaux', 0.6), 0.008, px(380))

# 7. Every copy, kept: on the hill, the viola again, muted, bowing the mark while the cave rests; the four copies set down; three ticks,
#    the download struck through and never made; the end card: the mark, on the handpan
kw = lambda lid, word, off=0: W('kept', lid, word, off)
kc = lambda lid, off=0: G('kept', lid, off)
k0 = S0('kept')
bowed(MARK, k0 + 0.6, 0.9, mute=True, last=3.4)
for i, x_ in enumerate((560, 1360, 560, 1360)):
    glass(kc('four', i * 0.25 + 0.05), 0.010, px(x_))
tap(kw('each', 'Jun got', 0.1), 0.007, px(1100)); tap(kw('each', 'the hospital', 0.1), 0.007, px(1700))
tap(kw('each', 'clean room', 0.1), 0.007, px(1100))
tNever = kw('each', 'never made')
air(tNever, 0.6, 0.008, px(1360), 200, 900); low(tNever + 0.35, 0.011, px(1600))
strike(MARK, kc('breath', 0.5), 0.85)
