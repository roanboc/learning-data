# Reports on demand: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette, reserved for this film by the module's setup thread on 5 November 2026 (/mnt/project-files/modern-data-basics/
# palettes.md), after checking every score.py and music.py on main and on every branch: repeater gongs, the coiled steel gongs a
# repeater clock or watch strikes only when someone asks it the time. A repeater has two: the hours are struck on the low one and the
# minutes on the high one. The low gong is the partner, chosen by this film's thread that day: every other colour the site lacks either
# belongs to another culture or sounds like one the site has (palettes.md's list), so the film keeps to the one instrument that answers
# when asked, as film 4 keeps to two ophicleides. Both are made here (music.py has neither).
#  - The gongs (gong(), low()): a steel wire, struck softly near its block by a small hammer with a soft tip, its partials those of a
#    steel bar (1, 2.76 and 5.40 times the note), the higher ones dying first, and damped short, within about a second and a half for
#    the high gong and two for the low. Kept apart from the site's bells, bell plates and crotales: no hum below the note, no minor
#    third inside it, nothing that rings on, and nothing higher than F 5. No two partials sit a little apart, so nothing beats.
#  - The film's mark: silence until asked, then the answer struck once, both gongs together, F 3 on the low one and C 5 on the high one
#    (mark()). It sounds as the speaking clock answers, as Genie One answers Rohan, and at the takeaway; the title card has it too.
#  - F major, D minor for the problem (the exchange that couldn't answer on time, and the report and the week), all tuned pure (just
#    intonation from F): D minor's third and fifth are pure here, and G is never struck with B flat or D, whose intervals would beat.
#    No chime tune: one note at a time, or two struck together, never the quarters' ding-dong or the pips of a time signal.
# The module's rules (palettes.md and the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only at a chapter's turn or under a moment on screen; never a bed under the voice. Here
#    that's a struck note at a chapter's turn and at each answer, and silence between.
#  - Nothing trembles or pulses, no vibrato; no urgent pulse anywhere (film.json's "urgent" is empty).
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: a soft knock as a card is set down, a muffled key as a line is typed or
#    a tag is placed, paper as the report is laid down, a breath of air as a window opens or a lane runs, a small lock for Ingrid's
#    rule and a stamp as the report is retired. Never a telephone's bell, a watch's ticking or the pips of a time signal.
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
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1936)  # this film's own randomness: the room and the hammer's touch

# ---- tuning: just intonation from F, so two notes struck together are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (53, 174.614)  # F 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
D3, E3, F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4, Bb4, C5, D5, F5 = 50, 52, 53, 55, 57, 58, 60, 62, 64, 65, 67, 69, 70, 72, 74, 77

# ---- the levels, set by tools/quiet.py's measure as one speaker plays the score: the music's loud moments under -26.5 dB of full
# scale and its loudest notes under -23, the effects' loud moments under -43 dB (FX scales them)
GL, LL, FX = 0.050, 0.056, 1.5

# a room round the gongs: a small panelled room, ringing on for about a second, and nothing much above 1.8 kHz. Its level is set by
# what it rings under 1.8 kHz (its gain there about one, so `room` is its share): scaled by all it rings, a room rings about 10 dB
# louder there than its share says, and moves a note's level up or down by where its reflections meet the note's own sound
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3600)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room, a, b):
    """a note in the room, at its own level: set back to the level it had before the room, measured over its body (a to b seconds,
    once the hammer has left it and before it's damped). A note too short to have a body just goes into the room"""
    r = _room(s, room); i, j = int(a * SR), int(b * SR)
    if not room or j - i < int(0.3 * SR):
        return r
    return r * float(np.sqrt((s[i:j] ** 2).mean() / max(1e-12, (r[i:j] ** 2).mean())))

# ---- the gongs: a steel wire's partials (ratio, level, how long it lasts in seconds), the higher dying first; the hammer's soft touch
# (a short, low tick of steel on steel, under 2 kHz); then the damper, which stops the wire over a quarter of a second
_HI = ((1.0, 1.0, 0.95), (2.76, 0.15, 0.30), (5.40, 0.045, 0.12))
_LO = ((1.0, 1.0, 1.35), (2.76, 0.11, 0.38), (5.40, 0.030, 0.14))
def _gong(m, parts, damp, touch):
    f = hz(m); n = int((damp + 0.3) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for r, a, d in parts:
        if f * r < 2300:
            s += a * np.exp(-x / d) * np.sin(2 * np.pi * f * r * x + 0.3 * r)
    s *= np.minimum(1, x / 0.003) * np.where(x < damp, 1.0, np.cos(0.5 * np.pi * np.minimum((x - damp) / 0.25, 1)) ** 2)
    s = s / max(1e-9, float(np.abs(s).max()))
    tick = filt(R1.standard_normal(n).astype(np.float32), 'band', (600, 1900)) * np.exp(-x / 0.005)
    return filt((s + touch * tick).astype(np.float32), 'low', 2300)
def gong(m, t0, g=1.0, pan=0.14, damp=1.3, room=0.3):
    """the high gong, struck at t0 and damped after `damp` seconds: the minutes, the answer"""
    put(_held(_gong(m, _HI, damp, 0.05), room, 0.08, min(0.9, damp)).astype(np.float32), t0, g * GL, pan)
def low(m, t0, g=1.0, pan=-0.14, damp=1.9, room=0.3):
    """the low gong, struck at t0 and damped after `damp` seconds: the hours"""
    put(_held(_gong(m, _LO, damp, 0.035), room, 0.1, min(1.2, damp)).astype(np.float32), t0, g * LL, pan)
def mark(t0, g=1.0, hi=C5):
    """the film's mark: silence until asked, then the answer struck once, both gongs together"""
    low(F3, t0, g, damp=2.1); gong(hi, t0, 0.85 * g, damp=1.5)

# ---- soft sounds, all low-passed, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a disc set in place, a tile set on the dashboard"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a tag or a pill placed, a line typed"""
    s_tap(s, g * FX, pan)
def keys(s, n, sec, g=0.008, pan=0.0):
    """a few muffled keys, spread over sec: a question typed"""
    for i in range(n):
        s_tap(s + sec * i / max(1, n - 1), g * FX * (0.85 + 0.15 * (i % 2)), pan)
def paper(s, g=0.013, pan=0.0, sec=0.45):
    """a sheet, or a stack of them, laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: a window opening, a lane running, the map lighting"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def stamp(s, g=0.018, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)

# =============================================================================================================================
# 1. The speaking clock: the opening, music all through it. London, 1936, D minor: the low gong alone, one note at a time, as callers
#    ring the exchange and the operator reads the time from the wall; never quite exact, late when the board is busy, a watch set by it
#    out; asked again and again; then nothing under "Something had to change". F major as the Post Office's engineers build the machine:
#    the high gong comes in, for Jane Cain's words on the glass discs, the right moment, Greenwich; the dial, and silence until it's
#    asked; "They heard the time": the mark, the answer struck once. The calls, on demand, no operator. The university: D minor again,
#    the low gong under the report and the week; F major as any question is answered when it's asked; the mark at the title card
cw = lambda lid, word, off=0: W('clock', lid, word, off)
c0 = S0('clock')
low(D3, c0 + 0.7, 0.9, damp=2.2)
low(A3, cw('rang', 'To know', 0.1), 0.75)
tap(cw('rang', 'telephone exchange', 0.1), 0.008, px(1300))
low(F3, cw('rang', 'asked the operator', 0.2), 0.75)
gong(A4, cw('wall', 'clock', 0.1), 0.55, pan=px(1120), damp=1.0)
tap(cw('exact', 'never quite', 0.3), 0.010, px(1290))
low(E3, cw('exact', 'exact to the second', 0.0), 0.7)
tap(cw('late', 'just when'), 0.010, px(1640))
low(Bb3, cw('late', 'just when', 0.1), 0.7)
tap(cw('out', 'could be out', 0.0), 0.009, px(960))
tap(cw('out', 'could be out', 0.2), 0.010, px(960))
low(A3, cw('out', 'could be out', 0.3), 0.7, damp=1.7)
low(D3, cw('again', 'And the time', 0.0), 0.75)
low(F3, cw('again', 'again and again', 0.0), 0.65, damp=1.5)
# something had to change: no music, no sound. Then the machine, F major
air(cw('built', 'So the Post', 0.0), 1.0, 0.008, px(960), 140, 700)
low(F3, cw('built', 'a machine', 0.0), 0.8)
knock(cw('built', 'the speaking clock', -0.1), 0.014, px(1620), 250)
gong(A4, cw('built', 'the speaking clock', 0.0), 0.6, damp=1.2)
# Jane Cain: her words run to the disc (a breath of air along the lane), the disc set in place
air(cw('cain', 'recorded', 0.0), 1.4, 0.008, px(980), 160, 900)
gong(C5, cw('cain', 'recorded', 0.15), 0.55, pan=px(760), damp=1.1)
knock(cw('cain', 'recorded', 0.4), 0.012, px(1420), 200)
tap(cw('cain', 'glass discs', 0.0), 0.009, px(1420))
gong(F4, cw('played', 'right moment', -0.2), 0.6, damp=1.2)
air(cw('played', 'right moment', -0.3), 0.7, 0.007, px(960), 200, 1000)
air(cw('greenwich', 'Greenwich', -0.6), 0.8, 0.007, px(1200), 180, 900)
tap(cw('greenwich', 'Greenwich', -0.2), 0.010, px(1384))
low(C4, cw('greenwich', 'Greenwich', 0.0), 0.65)
# the dial: the tag, then T, I and M, a finger in each hole; silence until it's asked
tap(cw('dial', 'From the', 0.2), 0.009, px(1400))
low(Bb3, cw('dial', 'anyone in London', -0.1), 0.6, damp=1.6)
for word in ('T', 'I', 'M'):
    knock(cw('dial', word, -0.05), 0.010, px(700), 300)
# they heard the time: the mark, the answer struck once
mark(cw('heard', 'the time', -0.05), 0.9)
knock(cw('heard', 'a tenth', -0.2), 0.012, px(1560), 250)
knock(cw('calls', 'twelve million', -0.3), 0.012, px(1560), 230)
low(A3, cw('calls', 'twelve million', 0.0), 0.6)
tap(cw('demand', 'on demand', -0.2), 0.010, px(1560))
gong(F4, cw('demand', 'on demand', 0.0), 0.55, damp=1.1)
gong(A4, cw('demand', 'for anyone', 0.0), 0.5, damp=1.1)
tap(cw('operator', 'no longer'), 0.010, px(1560))
low(C4, cw('operator', 'no longer', 0.1), 0.6)
# the university: the report laid down, the week; D minor again
paper(cw('report', 'At the university', 0.0), 0.012, px(400), 0.5)
low(D3, cw('report', 'At the university', 0.1), 0.75)
tap(cw('report', 'forty-page'), 0.009, px(400))
knock(cw('week', 'Any other'), 0.012, px(1310), 240)
for d in range(5):
    tap(cw('week', 'a week', -0.6 + 0.32 * d + 0.16), 0.006, px(1000 + 120 * d))
low(A3, cw('week', 'a week', 0.4), 0.65, damp=1.6)
# now any question is answered when it's asked; the questions that come back have a dashboard of their own
air(cw('now', 'Now', 0.4), 1.0, 0.008, px(960), 150, 800)
gong(A4, cw('now', 'answered', 0.0), 0.55, damp=1.2)
tap(cw('own', 'a dashboard', 0.0), 0.009, px(1440))
low(F3, cw('own', 'a dashboard', 0.1), 0.65)
# the title card: the mark
mark(G('clock', 'breath', 0.4), 0.8, F4)

# 2. Ask for the answer. Pay day in Finance: the low gong at the turn. Rohan's need, the week it used to take; he asks, the question
#    typed, and nothing; then the answer, struck once (the mark). What it counted, on-costs, the query, each set down; and Semester 1,
#    one high note; the budget set by lunch, B flat
aw = lambda lid, word, off=0: W('ask', lid, word, off)
a0 = S0('ask')
low(F3, a0 + 0.4, 0.7)
tap(aw('payday', 'Thursday', 0.0), 0.009, px(400))
knock(aw('rohan', 'budget', -0.1), 0.013, px(1140), 240)
knock(aw('casual', 'paid for the hours', -0.2), 0.012, px(1310), 240)
knock(aw('needs', 'one number', -0.2), 0.012, px(1140), 240)
for d in range(5):
    tap(aw('used', 'That used', 0.6 + 0.3 * d), 0.006, px(900 + 120 * d))
tAsks = aw('asks', 'Today')
air(tAsks, 0.9, 0.009, px(1300), 160, 900)
keys(tAsks + 0.75, 6, 1.3, 0.007, px(1500))
mark(aw('answer', 'one point', -0.1), 0.9)
tap(aw('counted', 'what it counted', 0.6), 0.009, px(1300))
tap(aw('oncosts', 'On-costs', 0.0), 0.009, px(1300))
tRan = aw('query', 'it ran')
for i in range(5):
    tap(tRan - 0.4 + 0.2 * i, 0.006, px(1100))
keys(aw('next', 'and Semester', 0.0), 3, 0.6, 0.007, px(1500))
gong(A4, aw('s1', 'Two point', -0.05), 0.6, damp=1.2)
air(aw('lunch', 'By lunch', -0.2), 0.8, 0.008, px(1300), 160, 900)
knock(aw('lunch', 'By lunch', 0.3), 0.012, px(1140), 240)
tap(aw('lunch', 'is set', -0.2), 0.009, px(1140))
low(Bb3, aw('lunch', 'is set', 0.0), 0.6)

# 3. What it answers from: the low gong at the turn; Genie One and the Genie Agent behind it, joined by a lane; the two earlier films;
#    the agent's window, a high note as it opens; its four pages, each tab a tap: the measure and its fields, the owners' rules (Ingrid's
#    with a small lock), the examples, the tests, run; it runs as the person asking, G; the team's work has moved: A and C together for
#    good models and their context; its first user, F
xw = lambda lid, word, off=0: W('context', lid, word, off)
x0 = S0('context')
low(A3, x0 + 0.4, 0.65)
knock(xw('agent', 'Genie One', 0.0), 0.012, px(1050), 240)
air(xw('agent', 'a Genie Agent', 0.0), 0.6, 0.007, px(1320), 200, 900)
knock(xw('agent', 'a Genie Agent', 0.2), 0.012, px(1610), 240)
knock(xw('films', 'Two earlier', 0.3), 0.011, px(1080), 240)
knock(xw('films', 'Two earlier', 0.7), 0.011, px(1600), 260)
air(xw('put', 'Here is', -0.4), 0.7, 0.007, px(1300), 160, 800)
knock(xw('put', 'Here is', 0.1), 0.013, px(1320), 220)
gong(F4, xw('put', 'Here is', 0.4), 0.55, damp=1.1)
knock(xw('data', 'one measure', -0.2), 0.011, px(1320), 260)
for i in range(3):
    tap(xw('data', 'by faculty', 0.53 * i), 0.007, px(1100 + 200 * i))
tap(xw('defined', 'Rohan defined', 0.0), 0.008, px(1320))
for lid, word in (('rules', 'Its rules'), ('examples', 'Its examples'), ('tests', 'And its tests')):
    tap(xw(lid, word, -0.1), 0.009, px(1100))
knock(xw('rohans', "Rohan's", 0.0), 0.012, px(1100), 240)
lock(xw('ingrid', "Ingrid's", 0.1), 0.010, px(1560))
air(xw('reads', "never anyone's", -0.4), 0.7, 0.006, px(1320), 180, 800)
knock(xw('examples', 'questions Finance', 0.0), 0.011, px(1320), 250)
knock(xw('examples', 'the query', 0.0), 0.011, px(1320), 270)
tap(xw('tests', 'known answers', -0.2), 0.008, px(1500))
tap(xw('tests', 'known answers', 0.4), 0.008, px(1500))
tap(xw('tests', 'run after', 0.0), 0.008, px(1320))
tap(xw('asker', 'Each answer', 0.3), 0.009, px(1320))
low(G3, xw('asker', 'Each answer', 0.4), 0.6)
air(xw('moved', "So the data team's", -0.2), 0.9, 0.008, px(960), 150, 800)
tap(xw('models', 'Not a report', 0.0), 0.008, px(960))
tap(xw('models', 'good models', 0.1), 0.009, px(960))
gong(A4, xw('models', 'good models', 0.1), 0.5, damp=1.1); gong(C5, xw('models', 'good models', 0.1), 0.45, damp=1.1)
tap(xw('small', 'its first user', -0.4), 0.009, px(960))
gong(F4, xw('small', 'its first user', -0.3), 0.5, damp=1.1)

# 4. The questions that come back: the low gong at the turn, the pay days set out; the three questions, each a tile set down; one
#    dashboard, like the machine of 1936: F on the low gong and A on the high; the pay run's figures, C, as they show; refreshed, sent;
#    Ask Genie; the report laid down, its first page lit, retired with a stamp, B flat; the rule of thumb, each line set down; every
#    other question asked when it's needed, F
bw = lambda lid, word, off=0: W('back', lid, word, off)
b0 = S0('back')
low(C4, b0 + 0.5, 0.6)
tap(bw('some', 'every pay day', -0.2), 0.008, px(400))
for i in range(3):
    tap(bw('some', 'Some questions', 0.4 + 0.5 * i), 0.007, px(600 + 360 * i))
for lid, word, x in (('cost', 'What did', 420), ('hours', 'How many', 960), ('waiting', 'How many', 1500)):
    knock(bw(lid, word, 0.0), 0.012, px(x), 240)
tOne = bw('machine', 'one dashboard')
air(tOne - 0.1, 0.9, 0.008, px(960), 150, 800)
low(F3, tOne, 0.7); gong(A4, tOne, 0.55, damp=1.2)
gong(C5, bw('today', 'nine point', -0.2), 0.5, damp=1.1)
tap(bw('today', 'nine point', 1.6), 0.008, px(960))
knock(bw('claims', 'forty-three', -0.3), 0.011, px(1500), 260)
tap(bw('refresh', 'It refreshes', 0.0), 0.008, px(500))
air(bw('refresh', 'goes to', 0.0), 0.7, 0.006, px(500), 180, 800)
tap(bw('genie', 'Ask Genie', -0.3), 0.009, px(1600))
tap(bw('genie', 'the same', -0.2), 0.008, px(1500))
paper(bw('replaced', 'It replaced', 0.0), 0.012, px(490), 0.5)
knock(bw('replaced', 'It replaced', 0.2), 0.012, px(1350), 240)
tap(bw('pageone', 'first page', -0.4), 0.008, px(490))
stamp(bw('retired', 'retired', -0.2), 0.016, px(490))
low(Bb3, bw('retired', 'retired', 0.3), 0.6, damp=1.6)
air(bw('rule', 'A rule', -0.2), 0.8, 0.007, px(960), 150, 700)
for lid, word, off in (('rule', 'A rule', 0.0), ('rule', 'comes back', -0.2), ('rule', 'someone acts', -0.2)):
    tap(bw(lid, word, off), 0.007, px(960))
tap(bw('other', 'Every other', 0.0), 0.008, px(960))
gong(F4, bw('other', 'Every other', 0.1), 0.55, damp=1.2)

# 5. Asked when it's needed: 1936's machine, the low gong at the turn; at the university, one dashboard, its tag set down; every
#    other question, F on the high gong; the budget set in a morning, B flat; the four steps and the official docs, set down; the takeaway: the mark, the
#    answer struck once; the next film, its card set down; the end card: the low gong, once
ew = lambda lid, word, off=0: W('close', lid, word, off)
e0 = S0('close')
low(F3, e0 + 0.5, 0.7)
tap(ew('then', 'In nineteen', 0.0), 0.008, px(400))
tap(ew('then', 'anyone could', 0.0), 0.009, px(1600))
tap(ew('uni', 'one dashboard', 0.0), 0.009, px(960))
tap(ew('every', 'good models', 0.0), 0.009, px(960))
gong(F4, ew('every', 'good models', 0.1), 0.5, damp=1.1)
knock(ew('budget', "And Health's", 0.0), 0.012, px(1140), 240)
tap(ew('budget', 'in a morning', -0.2), 0.009, px(1140))
low(Bb3, ew('budget', 'in a morning', 0.0), 0.6)
knock(ew('old', 'None', 0.3), 0.012, px(960), 240)
for word in ('investigate', 'adapt', 'implement', 'iterate'):
    tap(ew('docs', word, -0.1), 0.007, px(960))
knock(ew('docs', 'the official docs', 0.0), 0.012, px(960), 250)
mark(ew('takeaway', 'Ask for', -0.05), 0.85)
knock(ew('nextfilm', 'Next', 0.0), 0.012, px(960), 240)
low(F3, G('close', 'breath', 0.6), 0.75, damp=2.2)
