# Moving is easy, agreeing is the work: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, reserved for this film by the module's setup thread on 5 November 2026 after it checked every
# score.py and music.py on main and on every branch (/mnt/project-files/modern-data-basics/palettes.md, where this film's thread took
# the partner): steel reeds sung by electromagnets, made here (music.py has none).
#  - The sender's reeds: steel reeds as in the harmonic telegraphs of the 1870s, where several messages shared one wire, each on its
#    own pitch. A reed is plucked into motion, kept singing for a moment by its magnet (a light buzz, the magnet's), then let go: it
#    rings on, pure, and fades. Soft, short, in the middle of the range; never held like a reed organ. Each railway, and later each way
#    data moves, has its own reed: New South Wales's on the right, A; Victoria's on the left, G sharp, a little apart from it.
#  - The partner, the receiver's reeds: the same steel reeds an octave or two lower, at the far end of the wire. A receiver's reed
#    answers only the pitch its sender agreed, by sympathy, so it has no pluck: it swells in, holds at an even level while its pitch
#    holds, and dies away. It sounds only where something is agreed or settles, at a chapter's turn, and under the opening.
#  - The mark: two reeds a little apart (G sharp and A, one on each side), then tuned to the same note (both on A, together), and
#    only then does a phrase pass from one to the other (D, C sharp, B, A, from left to right). It sounds where the gauge is agreed
#    in 1962, and again where the film comes back to Albury.
#  - D major for what's agreed and what runs through; B minor for the break of gauge and the file that took two days; A major at
#    "Something had to change", which turns to D; G major for a new place. Just intonation from D (see hz()), so nothing beats; no
#    E held with G or B: those aren't pure in this table.
# The rules every film of the module keeps (palettes.md, 5 November 2026):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato. No urgent pulse: nothing in this story is a rush. No
#    figure played again and again. No train whistle, and nothing else borrowed from the opening's place.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (four rows, a flow of events)
#    is one soft sound, never one for each.
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
R1 = np.random.default_rng(1883)  # this film's own randomness: the room, the plucks, the air

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D major (D F sharp
# A), G major (G B D), A major (A C sharp E) and B minor (B D F sharp) are pure in this table; E with G or with B is not (32/27 and
# 40/27), so E sounds only with A, C sharp, D or F sharp
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2 = 38, 42, 43, 45, 47
D3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, Gs4, A4, B4, Cs5, D5 = 50, 54, 55, 57, 59, 61, 62, 64, 66, 68, 69, 71, 73, 74
NSW, VIC = A4, Gs4                    # the two railways' reeds: New South Wales's on the right, Victoria's a little apart on the left
WAYS = (D4, Fs4, A4, B4, D5)          # the five ways data moves, a reed each, in the film's order (MV_ORDER): rising, D major

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the receiver's reeds a little under the sender's; the effects
# well under the music (FX scales them all)
RL, VL, FX = 0.052, 0.040, 1.4

# a room round the reeds: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what it
# rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level after it (_held), as
# the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- a sender's reed: plucked into motion (a small soft tick), kept singing by its magnet for a moment, with the light buzz of the
# magnet's drive (its second to fifth harmonics), then let go: the buzz stops within a few hundredths of a second and the reed rings
# on, pure, and fades. Nothing trembles; the level holds while the magnet holds it
def reed(m, s, g=1.0, pan=0.0, hold=0.25, ring=0.45, room=0.28):
    f = hz(m); sec = hold + 5 * ring + 0.1; x = tt(sec).astype(np.float64)
    a = np.where(x < hold, 1.0, np.exp(-(x - hold) / ring)) * np.sin(0.5 * np.pi * np.minimum(1, x / 0.005)) ** 2
    drive = np.where(x < hold, 1.0, np.exp(-(x - hold) / 0.05))
    sig = np.sin(2 * np.pi * f * x)
    for k, h in ((2, 0.10), (3, 0.055), (4, 0.022), (5, 0.010)):
        if f * k < 2300:
            sig = sig + h * drive * np.sin(2 * np.pi * f * k * x + 0.3 * k)
    sig = sig * a
    nt = int(0.012 * SR); sig[:nt] += filt(R1.standard_normal(nt).astype(np.float32), 'band', (600, 1800)) * np.exp(-np.arange(nt) / SR / 0.0025) * 0.04
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.1) / 0.1, 0, 1)) ** 2
    put(_held(filt(sig.astype(np.float32), 'low', 2400), room), s, g * RL, pan)
def roll(notes, s, step=0.12, g=1.0, pan=0.0, hold=0.3, ring=0.6, spread=0.3):
    """reeds plucked one after another, the lowest first, ringing on together as a chord"""
    k = len(notes)
    for i, m in enumerate(notes):
        reed(m, s + step * i, g * (1.0 if i == 0 else 0.85) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5), hold, ring)

# ---- a receiver's reed: the same steel, lower, at the far end of the wire. It answers only the pitch its sender agreed, by sympathy,
# so it has no pluck: it swells in, holds at an even level while its pitch holds, and dies away when it stops. A little of the
# reed's own colour (its second and third harmonics), no buzz, nothing above 1.6 kHz
def recv(m, a, b, g=1.0, att=0.5, rel=0.8, pan=0.0, room=0.3):
    f = hz(m); sec = max(0.4, b - a); n = int((sec + 5 * rel + 0.1) * SR); x = np.arange(n) / SR
    on = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    off = np.where(x > sec, np.exp(-(x - sec) / rel), 1.0)
    s = np.sin(2 * np.pi * f * x)
    for k, h in ((2, 0.12), (3, 0.05)):
        if f * k < 1600:
            s = s + h * np.sin(2 * np.pi * f * k * x + 0.5 * k)
    s = s * on * off
    s = s * np.cos(0.5 * np.pi * np.clip((x - n / SR + 0.1) / 0.1, 0, 1)) ** 2
    put(_held(filt(s.astype(np.float32), 'low', 1600), room), a, g * VL, pan)

# ---- the mark: two reeds a little apart, one on each side (Victoria's G sharp on the left, New South Wales's A on the right), then
# tuned to the same note (both on A, together), and only then does a phrase pass from one to the other, left to right: D, C sharp,
# B, A. The receiver's low D swells in under it: D major. s is the moment the two sound together
def mark(s, g=1.0, side=0.6, hold=3.6):
    reed(VIC, s - 1.1, g * 0.75, -side, hold=0.22, ring=0.4)
    reed(NSW, s - 0.6, g * 0.75, side, hold=0.22, ring=0.4)
    reed(NSW, s, g * 0.6, -side, hold=0.4, ring=0.6); reed(NSW, s, g * 0.6, side, hold=0.4, ring=0.6)
    for i, m in enumerate((D5, Cs5, B4, A4)):
        reed(m, s + 0.75 + 0.26 * i, g * (0.8 if i < 3 else 0.9), -side + 2 * side * i / 3, hold=0.14 if i < 3 else 0.4, ring=0.4 if i < 3 else 0.8)
    recv(D2, s + 0.7, s + 0.7 + hold, g * 0.85, att=0.8, rel=1.2); recv(A2, s + 0.9, s + 0.7 + hold, g * 0.55, att=0.8, rel=1.2)
def same(s, g=1.0, pan0=-0.5, pan1=0.5, m=NSW):
    """the same note in two places at once: two reeds on A, together"""
    reed(m, s, g * 0.6, pan0, hold=0.35, ring=0.6); reed(m, s, g * 0.6, pan1, hold=0.35, ring=0.6)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a platform"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a row lit, a tag"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.012, pan=0.0, sec=0.4):
    """a sheet laid down, a file sent"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.011, pan=0.0):
    """a change arrives: a soft, dull click, like a telegraph sounder's, far off"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def strike(s, g=0.009, pan=0.0, sec=0.4):
    """a word struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def rumble(s, sec=2.4, g=0.010, pan=0.0):
    """a train running past, far off: a low swell of air and wheels, no whistle"""
    x = tt(sec); X(filt(noise(sec), 'band', (70, 420))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2, s, g * FX, pan)

# =============================================================================================================================
# 1. A break of gauge: the opening, with music all through it.
#    June 1883: D major, the receiver's low D and the reeds rising as the camera draws back to the border. The railways from Sydney and
#    from Melbourne: each its own reed, New South Wales's A on the right and Victoria's G sharp on the left, a little apart. Each its
#    own gauge: B minor; the gauge end-on, each colony's rails with its reed. Every passenger changes trains: B minor under the
#    lifting. What it cost: G major, low. Their reasons: New South Wales's reed steps from G sharp to A as it changes, and Victoria's
#    keeps its G sharp. 79 years: B minor, still; "Something had to change": A major. 1962, one agreed gauge: the mark, the phrase
#    passing from one side to the other as the freight runs straight through. Up by a third: D major. The university's file: G major
#    for the new place, B minor for the two days; "Agree what it means": the two reeds on one note, and the phrase passes through.
#    The title card: D major, the receiver's low D
F = lambda lid, word, off=0: W('gauge', lid, word, off)
g0 = S0('gauge')
recv(D3, g0 + 0.3, F('june', 'Murray River', 0.4), 0.8, att=1.4, rel=1.2)
reed(D4, g0 + 1.1, 0.7, -0.15, hold=0.3, ring=0.6); reed(Fs4, g0 + 1.55, 0.65, 0.0, hold=0.3, ring=0.6); reed(A4, g0 + 2.0, 0.7, 0.15, hold=0.45, ring=0.8)
recv(A2, F('june', 'the border', -0.2), F('june', 'Victoria', 0.6), 0.7, att=1.0, rel=1.0)
reed(D5, F('june', 'the border', 0.3), 0.55, 0.0, hold=0.3, ring=0.7)
# Albury, its platform and new bridge; the railways from Sydney (right) and from Melbourne (left), each with its own reed
knock(F('bridge', 'At Albury', -0.1), 0.014, px(890), 200)
air(F('bridge', 'a new bridge', 0.0), 0.9, 0.007, px(640), 160, 700)
recv(D3, F('bridge', 'At Albury', -0.1), F('bridge', 'from Melbourne', -0.4), 0.6, att=0.9, rel=1.0)
reed(NSW, F('bridge', 'from Sydney', -0.05), 0.75, 0.6, hold=0.35, ring=0.7)
reed(VIC, F('bridge', 'from Melbourne', -0.05), 0.75, -0.6, hold=0.35, ring=0.7)
# each its own gauge: B minor; the gauge end-on, each colony's rails with its reed; the hand's length between them
tOwn = F('gauge', 'its own gauge')
recv(B2, G('gauge', 'gauge', -0.1), tOwn + 1.4, 0.75, att=1.0, rel=1.1)
reed(D4, tOwn - 0.2, 0.5, -0.2, hold=0.3, ring=0.6); reed(Fs4, tOwn + 0.15, 0.5, 0.2, hold=0.3, ring=0.6)
knock(tOwn + 0.6, 0.012, px(1480), 240)
reed(NSW, F('gauge', 'the distance', 0.0), 0.7, 0.45, hold=0.3, ring=0.6)
reed(VIC, F('wider', "Victoria's rails", 0.0), 0.7, -0.45, hold=0.3, ring=0.6)
knock(F('wider', "a hand's length", 0.0), 0.010, px(1480), 170)
recv(B2, F('wider', 'no train', -0.3), END('gauge', 'wider') + 1.0, 0.6, att=0.8, rel=1.0)
# every passenger changes trains, every crate and bale lifted across: the two trains come in, three soft knocks for the lifting
tP = F('change', 'every passenger')
rumble(tP - 0.4, 2.2, 0.010, -0.5); rumble(tP - 0.1, 2.2, 0.010, 0.5)
for i, w_ in enumerate(('every crate', 'bale of wool', 'lifted')):
    knock(F('change', w_, 0.1), 0.012, px(900 + 60 * (i - 1)), 210)
recv(Fs2, F('change', 'every crate', -0.2), F('change', 'lifted', 0.8), 0.6, att=1.0, rel=1.0)
reed(B3, F('change', 'every crate', 0.0), 0.5, -0.1, hold=0.3, ring=0.6)
# what it cost: time and money, a tag each; G major, low
tap(F('cost', 'travellers time', -0.1), 0.010, px(560)); tap(F('cost', 'traders money', -0.1), 0.010, px(1000))
recv(G2, F('cost', 'travellers time', -0.3), F('cost', 'every journey', 0.6), 0.6, att=1.0, rel=1.0)
reed(B3, F('cost', 'travellers time', 0.0), 0.45, px(560), hold=0.25, ring=0.5); reed(D4, F('cost', 'traders money', 0.0), 0.45, px(1000), hold=0.25, ring=0.5)
# their reasons: New South Wales's reed steps from the first gauge's G sharp to its own A; Victoria's keeps its G sharp
tap(F('reasons', 'changed its gauge', -0.1), 0.009, px(1250))
reed(VIC, F('reasons', 'changed its gauge', 0.0), 0.6, 0.55, hold=0.2, ring=0.35); reed(NSW, F('reasons', 'changed its gauge', 0.45), 0.7, 0.55, hold=0.3, ring=0.6)
tap(F('reasons', 'Victoria kept', -0.1), 0.009, px(370))
reed(VIC, F('reasons', 'Victoria kept', 0.1), 0.7, -0.55, hold=0.45, ring=0.7)
# 79 years: B minor, still; "Something had to change": A major
tY = F('years', 'seventy-nine years')
tap(tY, 0.009, px(250))
recv(B2, tY - 0.3, F('years', 'Something', -0.5), 0.75, att=1.2, rel=0.9)
roll((B3, D4, Fs4), F('years', 'everything stopped', 0.1), 0.2, 0.5, ring=0.8)
tS = F('years', 'Something had to change')
recv(A2, tS - 0.2, END('gauge', 'years') + 1.2, 0.75, att=1.0, rel=1.1)
roll((Cs4, E4), tS + 0.2, 0.18, 0.5, ring=0.8)
# 1962: the year, the gold line laid towards Melbourne, and one agreed gauge: the mark, the phrase passing from one side to the other
# as the freight runs straight through
knock(F('agreed', 'nineteen sixty-two', 0.0), 0.012, px(250), 230)
air(F('agreed', 'opened a new line', 0.0), 2.6, 0.008, px(500), 160, 800)
mark(F('agreed', 'agreed gauge', 0.0), 1.0, hold=4.0)
rumble(F('through', 'Freight ran', -0.4), 3.0, 0.011, 0.0)
rumble(F('through', 'from April', 0.2), 3.0, 0.010, 0.0)
# up by a third: D major
tT3 = F('third', 'by a third', -0.1)
roll((D4, Fs4, A4, D5), tT3, 0.13, 0.75, ring=0.9)
recv(D3, tT3 + 0.1, tT3 + 2.6, 0.6, att=0.6, rel=1.0)
# the university: G major as the map comes in; the HR system and the finance system, the file sent each teaching period, its columns
tU = F('files', 'At the university')
recv(G2, tU - 0.4, tU + 2.8, 0.6, att=1.0, rel=1.0); reed(B4, tU + 0.1, 0.45, -0.3, hold=0.3, ring=0.6)
knock(tU, 0.012, px(250), 240); knock(tU + 0.3, 0.012, px(250), 220)
paper(F('files', 'as a file', -0.2), 0.011, px(500), 0.45)
knock(F('files', 'as a file', -0.1), 0.012, px(1500), 240)
# two days on its columns: B minor; the tag
tap(F('days', 'two days', -0.1), 0.010, px(1300))
recv(B2, F('days', 'two days', -0.3), F('days', 'each column', 0.9), 0.6, att=0.9, rel=1.0)
reed(Fs4, F('days', 'each column', 0.0), 0.5, 0.3, hold=0.3, ring=0.6)
# never the hard part: A, a question; agree what it means: the two reeds on one note; and it passes straight through, left to right
recv(A2, F('hard', 'never the hard part', -0.2), F('hard', 'Agree what it means', 0.2), 0.55, att=0.9, rel=0.9)
same(F('hard', 'Agree what it means', 0.0), 0.95)
for i, m in enumerate((A4, B4, Cs5)):
    reed(m, F('hard', 'passes straight through', 0.0) + 0.24 * i, 0.6, -0.5 + 0.5 * i, hold=0.14, ring=0.4)
# the title card: D major, the receiver's low D under it
tB = G('gauge', 'breath', 0.25)
roll((D3, A3, D4, Fs4, A4, D5), tB, 0.16, 0.8, ring=1.1)
recv(D2, tB + 0.15, E('gauge') - 0.6, 0.7, att=1.2, rel=1.4)

# 2. What got easier: the module's mark rising a fourth as its name comes; the four jobs that took teams, a soft tap as each comes, and
#    D major as they get easier; Databricks and dbt, a card each. Linh's contract: its own reed, B. The change that reaches the
#    platform: one reed and a sounder's click; the whole file again: the reeds all at once. The names from 2003: paper
P = lambda lid, word, off=0: W('promise', lid, word, off)
p0 = S0('promise')
tM = P('module', 'Modern data basics', -0.2)
reed(A4, tM, 0.6, -0.1, hold=0.3, ring=0.6); reed(D5, tM + 0.36, 0.65, 0.1, hold=0.4, ring=0.8)
recv(D3, tM + 0.3, tM + 2.4, 0.55, att=0.8, rel=1.0)
for w_ in ('Moving data', 'running a platform', 'serving data', 'reading documents'):
    tap(P('teams', w_, -0.1), 0.008, 0.0)
tE = P('now', 'much of it', -0.2)
recv(D3, tE, tE + 2.2, 0.55, att=0.7, rel=1.0); reed(Fs4, tE + 0.2, 0.5, 0.0, hold=0.3, ring=0.6)
knock(P('now', 'Databricks', -0.1), 0.012, px(760), 240); knock(P('now', 'dbt', -0.1), 0.012, px(1160), 240)
for w_ in ('what got easier', 'what still needs', 'the official docs'):
    tap(P('each', w_, -0.1), 0.008, 0.0)
knock(P('light', 'courses', -0.1), 0.012, px(550), 240); knock(P('advice', 'architectural advice', -0.1), 0.012, px(1370), 240)
# Linh's contract, T-26188, and its way into the HR system
tC = P('linh', 'contract T', -0.6)
paper(tC + 0.1, 0.010, px(960), 0.35)
reed(B4, tC + 0.35, 0.55, 0.0, hold=0.3, ring=0.6)
air(P('born', 'born in', 0.0), 0.9, 0.007, px(450), 180, 900)
# one change, as it's made: it reaches the platform as one reed and a sounder's click; then the whole file, the reeds all at once
tR = P('events', 'reached the platform', 0.5)
click(tR, 0.011, px(960)); reed(NSW, tR, 0.55, px(960), hold=0.3, ring=0.6)
tWf = P('batch', 'whole file', 1.0)
paper(P('batch', 'twentieth of July', 0.0), 0.011, px(430), 0.5)
roll((D4, Fs4, A4), tWf, 0.0, 0.55, ring=0.6, spread=0.2)
# the names from 2003: the book's card, and its three words
paper(P('eip', 'have had names', -0.2), 0.010, px(960), 0.4)
for i in range(3):
    tap(P('eip', 'Enterprise Integration Patterns', 0.25 * i), 0.007, px(620 + 240 * i))

# 3. Five ways to move it: each way's own reed as its lane draws, rising through D major, a lane at a time (the connector D, the query
#    F sharp, the mirror A, the share B, the API D); Sam's page and its rows; T-26188 landing in bronze; Rohan's page; then the five
#    together as they light in turn, and "Moving is easy now": the receiver's D and A
Y = lambda lid, word, off=0: W('ways', lid, word, off)
y0 = S0('ways')
reed(WAYS[0], Y('connector', 'managed connector', -0.1), 0.6, px(600), hold=0.3, ring=0.6); click(Y('connector', 'managed connector', -0.1), 0.010, px(600))
knock(Y('sam', 'picked', -0.2), 0.012, px(1300), 240)
tap(Y('sam', 'picked', 0.0), 0.008, px(1300)); tap(Y('sam', 'the tables', 0.0), 0.008, px(1300))
for w_ in ('reads only', 'tries again', 'keeps its place'):
    tap(Y('keeps', w_, -0.1), 0.007, px(1300))
knock(Y('bronze', 'lands in bronze', 0.1), 0.012, px(960), 220)
reed(WAYS[1], Y('query', 'A query in place', 0.0), 0.6, px(600), hold=0.3, ring=0.6)
tap(Y('ledger', 'reads it there', -0.1), 0.008, px(960))
tap(Y('large', 'large volumes', 0.2), 0.008, px(960))
reed(WAYS[2], Y('mirror', 'A mirror', 0.0), 0.6, px(1330), hold=0.3, ring=0.6)
knock(Y('rohan', 'Microsoft Fabric', -0.2), 0.012, px(650), 240)
tap(Y('rohan', 'appear there', 0.2), 0.008, px(650))
reed(WAYS[3], Y('share', 'A share', 0.0), 0.6, px(1330), hold=0.3, ring=0.6)
tap(Y('share', 'Products in open formats', -0.1), 0.008, px(960))
reed(WAYS[4], Y('api', 'an API', 0.0), 0.6, px(1330), hold=0.3, ring=0.6)
tap(Y('api', 'an app asks', 0.0), 0.008, px(1640))
tEa = Y('easy', 'Each does', 0.3)
for i, m in enumerate(WAYS):
    reed(m, tEa + 0.35 * i, 0.5, (-0.4, -0.4, 0.4, 0.4, 0.4)[i], hold=0.2, ring=0.45)
tEz = Y('easy', 'Moving is easy now', -0.1)
recv(D3, tEz, tEz + 2.4, 0.6, att=0.5, rel=1.0); recv(A3, tEz + 0.15, tEz + 2.4, 0.4, att=0.5, rel=1.0)

# 4. The work that's left: a gold seal at each interface, the same note in two places (A on the left, then on the right). Ingrid and
#    Noor agree the HR system's contract: two reeds a little apart, then on one note. Its four parts: a tap for each value; "Read it
#    wrong": B minor; a cancelled contract struck through, arriving as a change (one reed, the sounder's click), closed and kept;
#    what's personal locked; written down, and Jun's tests pass on every row: A rising to D. Two cards for the films that go deeper
C = lambda lid, word, off=0: W('contract', lid, word, off)
c0 = S0('contract')
reed(NSW, C('left', 'The contract', 0.0), 0.55, px(486), hold=0.3, ring=0.6)
reed(NSW, C('left', 'each interface', 0.3), 0.55, px(1440), hold=0.3, ring=0.6)
tAg = C('noor', 'agrees its contract', 0.0)
reed(VIC, tAg - 0.55, 0.65, -0.5, hold=0.22, ring=0.4); reed(NSW, tAg - 0.1, 0.65, 0.5, hold=0.22, ring=0.4)
same(tAg + 0.4, 0.9)
recv(A2, tAg + 0.5, tAg + 2.6, 0.5, att=0.6, rel=1.0)
knock(C('fields', 'First', -0.4), 0.012, px(960), 240)
for w_ in ('C Eh S', 'F T', 'C O N'):
    tap(C('fields', w_, -0.1), 0.008, px(500))
strike(C('con', 'not contract', -0.1), 0.008, px(1100))
tWr = C('con', 'Read it wrong', 0.0)
knock(tWr, 0.012, px(530), 200)
recv(B2, tWr - 0.1, tWr + 2.4, 0.6, att=0.6, rel=1.0); reed(Fs4, tWr + 0.2, 0.45, -0.2, hold=0.3, ring=0.6)
tap(C('owner', 'by name', -0.1), 0.008, px(1300))
strike(C('delete', 'cancelled', -0.1), 0.008, px(1300))
tCh = C('arrive', 'as a change', -0.1)
click(tCh, 0.011, px(1300)); reed(NSW, tCh, 0.5, px(1300), hold=0.3, ring=0.6)
knock(C('history', 'closes', -0.1), 0.011, px(1300), 220); paper(C('history', 'keeps its history', -0.1), 0.009, px(1300), 0.35)
lock(C('personal', 'Names', 0.0), 0.010, px(1300))
lock(C('never', 'Bank details', 0.0), 0.010, px(1300))
paper(C('standard', 'write it down', -0.2), 0.010, px(1270), 0.4)
knock(C('standard', "Jun Park's", -0.3), 0.012, px(300), 240)
tPs = C('standard', 'every row', 0.0)
reed(A4, tPs, 0.55, px(1270), hold=0.25, ring=0.5); reed(D5, tPs + 0.32, 0.6, px(1270), hold=0.35, ring=0.7)
knock(C('silent', 'Silent change', -0.1), 0.012, px(550), 240)
knock(C('ahead', 'A platform that watches itself', -0.1), 0.012, px(1370), 240)

# 5. One gauge: back at Albury, the trains run through; "agreeing the gauge": the mark again. The university now: HR's contracts reach
#    Rohan the day they're made, meaning what HR means: the same note at both ends. The standards: two cards; the wheel drawn, its four
#    words; the struggle's card. The end card, as the film's line is said: D major, the receiver's low D, ringing out
A = lambda lid, word, off=0: W('agreed', lid, word, off)
a0 = S0('agreed')
rumble(a0 + 0.3, 3.2, 0.010, 0.0); rumble(a0 + 3.3, 3.2, 0.009, 0.0)
mark(A('ran', 'agreeing the gauge', 0.1), 0.95, hold=3.4)
tMn = A('ours', 'meaning just', -0.2)
same(tMn, 0.85, px(486), px(1440))
recv(D3, tMn + 0.1, tMn + 2.2, 0.5, att=0.6, rel=1.0)
knock(A('two', 'Enterprise Integration Patterns', -0.1), 0.012, px(550), 240)
knock(A('two', 'Open Data Contract Standard', -0.1), 0.012, px(1370), 240)
air(A('wheel', 'reinvent the wheel', -0.1), 1.6, 0.008, px(960), 160, 800)
for w_ in ('Investigate', 'adapt', 'implement', 'iterate'):
    tap(A('wheel', w_, -0.1), 0.007, px(960))
knock(A('struggle', 'a struggle', -0.2), 0.012, px(960), 220)
tEnd = A('takeaway', 'Let the tools', -0.3)
roll((D3, A3, D4, Fs4, A4), tEnd, 0.17, 0.8, ring=1.2)
recv(D2, tEnd + 0.2, E('agreed') - 2.4, 0.65, att=1.4, rel=1.4)
