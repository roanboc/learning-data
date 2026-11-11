# A mandate, written and enforced: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the series thread on 5 November 2026 after checking every score.py on main and on every
# branch (/mnt/project-files/agentic-data-engineering/series-3/palettes.md):
#  - Lead: drawn sound, as on the Oramics machine of the late 1950s and 1960s. Its player drew shapes by hand on strips of film, one for
#    the wave and others for each note's pitch and loudness, and light read them: the machine played exactly what was drawn, nothing
#    more, and stopped when the strip stopped. That is the film's idea, a written, narrow, revocable mandate. Made here (music.py has
#    none): each strip's wave is one period drawn by hand, a few harmonics with uneven weights and phases, never quite a sine and never
#    quite the same twice; each note's loudness is a line drawn by hand, up, along with a slight unevenness, and down. Nothing trembles
#    or slides: a drawn line holds its pitch.
#  - Partner: a bass trumpet in E flat, played softly and low, with no vibrato, only where a person signs, approves, decides or holds
#    the switch, never for the agent: a person's word is the one warm, breathing voice beside the drawn lines. Made here too: a brass
#    tone whose upper harmonics grow as it swells, with the lips' soft start.
#  - Keys, tuned pure (just intonation from E flat, see hz()): E flat major by day and wherever a person's word is heard; C minor, its
#    relative, for the night in test. F is never held with C or A flat (they're not pure together in this table), so nothing beats.
#  - The mark: a line drawn, then played as drawn, and silence when the strip ends (E flat, G, F, B flat, its last note cut, not
#    faded). It sounds three times: as Anil writes the mandate, into the title, and on the end card. Once, as the series closes, the
#    five stages' notes of 3.1 (Five stages, not a switch), drawn and played in E flat: E flat, F, G, A flat, B flat, as each gate passes.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. After the opening, one drawn note or one person's note at a time.
#  - Nothing pulses (no chapter is urgent). Silence where the story turns: from "written nowhere" through "Something had to change".
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: paper as a card is laid down, a pen as the mandate is signed, a soft
#    knock as a stamp lands, a lock closes or a gear turns, a soft tap as a row, a pill or a tick comes.
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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1957)  # this film's own randomness: the room, the strips and the hand that draws on them

# ---- tuning: just intonation from E flat. E flat major (E flat G B flat), A flat major (A flat C E flat), B flat major (B flat D F),
# C minor (C E flat G) and G minor (G B flat D) are all pure in this table; F with C (40/27) and F with A flat (32/27) are not, so
# they're never held together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
KEY = (51, 155.563)  # E flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Bb2, C3, Eb3, G3, Ab3, Bb3, C4, D4, Eb4, F4, G4, Ab4, Bb4 = 46, 48, 51, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70
MARK = (Eb4, G4, F4, Bb4)          # the mark: a line drawn, then played as drawn
STAGES = (Eb4, F4, G4, Ab4, Bb4)   # the five stages' notes of 3.1, in E flat

# ---- the levels: the drawn notes about as far under the voice as the module's other music (matched by loudness, not by peak), the
# bass trumpet a little under them; the effects about 16 dB under the music (FX scales them all)
DL, BL, FX = 0.071, 0.059, 1.2

# a room round the players: a small, dry hall, ringing on for about a second, and nothing much above 1.6 kHz. Its level is set by what
# it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own level in it (_held)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.016 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room):
    """a note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body (from a quarter of a
    second in to 0.3 s before its end; a short note, over all of it)"""
    r = _room(s, room)
    if not room:
        return r
    a, b = int(0.25 * SR), len(s) - int(0.3 * SR)
    if b - a < int(0.1 * SR):
        a, b = 0, len(s)
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the drawn sound. Five strips, each one period of a wave drawn by hand: its first six harmonics, their weights falling as a soft
# line's do, each a little off where the hand wavered, and their phases wherever the line happened to start
def _strip():
    w = np.array([1.0, 0.44, 0.23, 0.12, 0.065, 0.035]) * np.clip(1 + 0.16 * R1.standard_normal(6), 0.7, 1.3)
    return w, R1.uniform(0, 2 * np.pi, 6)
STRIPS = [_strip() for _ in range(5)]

def drawn(m, a, sec, g=1.0, pan=0.0, strip=0, rise=0.1, fall=0.4, cut=False, room=0.2):
    """a note read from a drawn strip: m at a, held sec; its loudness a line drawn by hand, up over rise, along with a slight
    unevenness (a slow bow of a few per cent, never a tremble), and down over fall; cut=True, the strip ends and the note with it,
    in three hundredths of a second"""
    f = hz(m); w, ph = STRIPS[strip % len(STRIPS)]; tail = 0.03 if cut else fall
    n = int((sec + tail) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for k in range(6):
        if f * (k + 1) > 2200:
            break
        s += w[k] * np.sin(2 * np.pi * f * (k + 1) * x + ph[k])
    hand = 1 + 0.035 * R1.standard_normal(3)
    e = np.interp(x, [0, rise, rise + (sec - rise) * 0.45, sec, sec + tail], [0, hand[0], hand[1] * 0.97, hand[2] * 0.9, 0])
    s = filt((s * e / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2200)
    put(_held(s, room).astype(np.float32), a, g * DL, pan)

def line(ms, a, step, g=1.0, pan=0.0, strip=0, last=1.2, cut=True):
    """notes drawn one after another on one strip, `step` seconds apart, the last held `last` (and, cut, ended with the strip)"""
    for i, m in enumerate(ms):
        end = i == len(ms) - 1
        drawn(m, a + i * step, last if end else step * 0.9, g, pan, strip, rise=0.05, fall=0.12 if not end else 0.3, cut=cut and end)

def mark(a, g=1.0, pan=0.0):
    """the mark: E flat, G, F, B flat, drawn and played as drawn; the last note stops with the strip"""
    line(MARK, a, 0.36, g, pan, strip=1, last=1.3, cut=True)

# ---- the bass trumpet in E flat, softly and low, no vibrato. A brass tone: its harmonics on a soft hump near 500 Hz, the upper ones
# growing as it swells (a brass player's sound brightens as it gets louder), with the lips' soft start, a breath of air in the first
# tenth of a second
def btp(m, a, sec, g=1.0, pan=-0.12, room=0.24):
    """a person's word: one soft, held note on the bass trumpet, at a, held sec"""
    f = hz(m); rel = 0.45; n = int((sec + rel) * SR); x = np.arange(n, dtype=np.float64) / SR
    e = np.interp(x, [0, 0.09, sec * 0.55, sec, sec + rel], [0, 0.78, 1.0, 0.86, 0])
    s = np.zeros(n)
    for k in range(1, 16):
        fk = f * k
        if fk > 2300:
            break
        hump = np.exp(-0.5 * ((fk - 520) / 700) ** 2) + 0.25
        s += hump * k ** -0.7 * e ** (0.55 + 0.22 * (k - 1)) * np.sin(2 * np.pi * fk * x + 0.5 * k)
    s = s / max(1e-9, float(np.abs(s).max()))
    b = int(0.12 * SR); s[:b] += 0.05 * filt(noise(0.12), 'band', (300, 1400))[:b] * np.sin(np.pi * np.arange(b) / b)
    s = filt(s.astype(np.float32), 'low', 2000)
    put(_held(s, room).astype(np.float32), a, g * BL, pan)

# ---- soft sounds, all low-passed
def paper(s, g=0.014, pan=0.0, sec=0.45):
    """a card laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=0.9, g=0.006, pan=0.0):
    """a pen signing: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft knock: a stamp, a lock, a gear"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a soft tap: a row, a pill, a tick"""
    s_tap(s, g * FX, pan)
def air(s, sec=1.4, g=0.007, pan=0.0, lo=140, hi=800):
    """a breath of air: something large moving into its place"""
    s_air(s, sec, g * FX, pan, lo, hi)

# =============================================================================================================================
# 1. Last night, in test: the opening, under the drawn lines. The lab by day, E flat major; the card for Health's heads of school, the
#    night build, and the way to production. The night, C minor: the build fails, nobody at work, finding out why its job; harm alone;
#    October's night, the stamp on HR's model, the teams' numbers; then silence from "written nowhere" through "Something had to
#    change". E flat again: the mark as Anil writes the page, a soft tap for each row, the mandate's line joining the map, a pen and the
#    bass trumpet as he signs, and again as Noor approves; the three tools that hold it. The night in test: the plain check, the agent
#    starts, three rounds, the cause, the fix, its report; a person's yes; written down, held in every tool, taken back; the mark into
#    the title
fw = lambda lid, word, off=0: W('first', lid, word, off)
fc = lambda lid, off=0: G('first', lid, off)
AX, GX = px(1290), px(1670)                         # the agent, and production under glass
drawn(Eb3, fc('place', 0.2), 3.0, 0.8, -0.1, strip=0, rise=0.5, fall=0.9)
drawn(G3, fc('place', 0.9), 2.4, 0.7, 0.1, strip=0, rise=0.5, fall=0.9)
paper(fw('ask', 'heads of school', -0.3), 0.013, px(840))
drawn(Bb3, fw('ask', 'heads of school', -0.1), 1.8, 0.75, px(840), strip=2)
drawn(G3, fw('test', 'built in test'), 1.4, 0.65, px(1120), strip=2)
drawn(Eb4, fw('test', 'reach production'), 1.6, 0.6, GX, strip=2)
# the night: C minor
drawn(C3, fc('fail', -0.4), 3.4, 0.8, 0.0, strip=3, rise=0.7, fall=1.0)
drawn(Ab3, fw('fail', 'failed in test'), 1.5, 0.65, px(1040), strip=3)
paper(fw('fail', 'numbers', -0.2), 0.012, px(420))
drawn(Eb4, fw('nobody', 'Finding out why', -0.1), 1.3, 0.55, AX, strip=3)
line((Ab3, G3), fw('harm', 'harm alone'), 0.5, 0.6, px(1000), strip=3, last=1.4, cut=False)
drawn(Eb3, fc('oct', 0.1), 3.0, 0.65, 0.0, strip=3, rise=0.6, fall=0.9)
paper(fw('oct', "changed HR's model", -0.6), 0.012, px(410))
knock(fw('oct', "changed HR's model", 0.3), 0.012, px(600))
paper(fw('oct', "other teams'"), 0.011, px(500))
drawn(Ab3, fw('overnight', 'changed overnight'), 1.5, 0.6, px(500), strip=3)
# written nowhere, through "Something had to change": silence, but for a tap as each of the three places it wasn't comes
for w_ in ('sign it', 'read it', 'stop it'):
    tap(fw('where', w_, -0.1), 0.009, px(1250))
# the mandate: the mark as Anil writes it, a tap for each row as it comes, its line on the map
P_wrote = fw('mandate', 'wrote its mandate')
paper(P_wrote - 0.2, 0.012, px(520))
mark(P_wrote + 0.1, 0.75, px(520))
for w_ in (('which', 'and where'), ('which', 'Its folders'), ('which', 'its checks'), ('limits', 'Ten rounds'), ('switch', 'A switch'), ('switch', 'undo')):
    tap(fw(w_[0], w_[1], -0.15), 0.008, px(520))
paper(fw('map', 'on the map', -0.3), 0.012, px(1430))
line((Bb3, Eb4), fw('map', 'beside the task', 0.2), 0.42, 0.6, px(1430), strip=1, last=1.4, cut=False)
# signed by Anil, approved by Noor: a pen, a tick, and the bass trumpet for each
P_sign = fw('signed', 'signed it')
pencil(P_sign + 0.1, 0.9, 0.006, px(860)); btp(Bb2, P_sign + 0.1, 1.8, 0.85, -0.12)
P_appr = fw('signed', 'approved')
tap(P_appr + 0.1, 0.010, px(890)); btp(Eb3, P_appr + 0.15, 1.9, 0.8, -0.05)
# the three tools that hold its lines, one by one
P_tools = fw('held', 'the tools')
for i, m in enumerate((Bb3, D4, F4)):
    paper(P_tools - 0.3 + 0.4 * i, 0.010, px(1450)); drawn(m, P_tools - 0.25 + 0.4 * i, 0.9 if i < 2 else 1.6, 0.55, px(1450), strip=4, fall=0.3)
# last night in test: C minor again. The plain check (a gear), its yes; the agent starts; its three rounds, one note each as each fills
drawn(C3, fc('check', -0.5), 2.8, 0.7, 0.0, strip=3, rise=0.6, fall=0.9)
knock(fw('check', 'a plain check'), 0.010, px(400), 300)
tap(fw('check', 'arrived', -0.1), 0.010, px(860))
drawn(G3, fw('check', 'the agent started'), 1.4, 0.6, AX, strip=3)
P_three, P_why = fw('cause', 'In three rounds'), fw('cause', 'found why')
D_r = P_why - P_three + 0.8
for i, m in enumerate((C4, D4, Eb4)):
    drawn(m, P_three + D_r * (i + 0.5) / 3, 0.55 if i < 2 else 1.0, 0.5, px(1210), strip=4, rise=0.04, fall=0.2)
paper(P_why - 0.3, 0.011, px(530))
drawn(Ab3, fw('cause', 'every version', -0.3), 1.3, 0.55, px(530), strip=3)
paper(fw('twice', 'Three tutors', -0.3), 0.011, px(470))
line((Bb3, Ab3), fw('twice', 'counted twice'), 0.55, 0.55, px(470), strip=3, last=1.3, cut=False)
# the fix: the line typed in, checked in test; its report for Anil
drawn(Eb4, fw('fixed', 'fixed one line'), 1.2, 0.55, px(530), strip=0)
drawn(G4, fw('fixed', 'checked it in test'), 1.4, 0.5, px(300), strip=0)
paper(fw('report', 'Twenty minutes', -0.3), 0.012, px(480))
drawn(Bb3, fw('report', 'Twenty minutes', -0.1), 2.0, 0.6, px(480), strip=0)
# production never saw the bug: a person's yes; then written down, held in every tool, taken back
tap(fw('never', 'never saw the bug'), 0.009, GX)
btp(Eb3, fw('never', "a person's yes", -0.1), 1.5, 0.7, px(1660) * 0.5)
for w_, m in (('written down', Eb4), ('held in every tool', G4), ('taken back', Bb4)):
    drawn(m, fw('data', w_, -0.1), 1.2, 0.5, px(500), strip=1, fall=0.35)
# the title
mark(fc('breath', 0.5), 0.7, 0.0)

# 2. One page, on the map: the map's cards laid down; the agent assigned to its role, a low E flat; the mandate's line joining it; the
#    folder and the file, its kind a requirement; the page's cards, each laid down; the gate passed, a person's decision: the bass
#    trumpet; the law's card; the one task, and the word about staff where it only suggests
pw = lambda lid, word, off=0: W('page', lid, word, off)
pc = lambda lid, off=0: G('page', lid, off)
paper(S0('page') + 0.4, 0.012, px(310))
drawn(Eb3, pw('role', 'assigned', -0.1), 2.2, 0.7, px(310), strip=0, rise=0.3)
paper(pw('role', 'its stage', -0.3), 0.012, px(1140))
line((Bb3, Eb4), pw('line', 'one more line', 0.3), 0.45, 0.6, px(1140), strip=1, last=1.5, cut=False)
paper(pc('file', -0.5 + 0.9), 0.012, px(1290))
drawn(G3, pw('file', 'requirement', -0.1), 1.6, 0.55, px(1290), strip=2)
for lid in ('test', 'prod', 'never', 'first', 'twice'):
    paper(pc(lid, -0.3), 0.010, px(1430))
P_gate = pw('gate', 'without a miss', 0.5)
knock(P_gate, 0.010, px(1500), 260); btp(Eb3, P_gate + 0.05, 2.0, 0.8, px(1500) * 0.5)
paper(pc('law', -0.1), 0.011, px(960))
paper(pc('one', -0.1), 0.011, px(920))
drawn(G3, pw('one', 'only suggests', -0.1), 1.6, 0.55, px(1500), strip=2)

# 3. Held in every tool: each tool's card laid down as its line is said; a tick where it may write, a knock where it may not; the hour,
#    the budget, each a drawn note; the project's check ticking its rows, then failing where a grant allows more; the page locked
#    where its App can't push, and E flat again
hw = lambda lid, word, off=0: W('held', lid, word, off)
hc = lambda lid, off=0: G('held', lid, off)
tap(hw('words', 'only words', -0.1), 0.008, px(1250))
for lid in ('grants', 'folders', 'hour', 'rounds', 'budget', 'first', 'agree', 'widen'):
    paper(hc(lid, -0.3), 0.010, px(1430))
drawn(Bb3, hw('grants', 'in test', -0.1), 1.3, 0.55, px(1430), strip=4)
knock(hw('grants', 'in production', -0.1), 0.009, px(1780))
knock(hw('folders', "its App can't push"), 0.009, px(1430))
drawn(G3, hw('hour', 'at sixty minutes'), 1.5, 0.55, px(1430), strip=4)
knock(hw('rounds', 'plain code', -0.2), 0.009, px(1100), 300)
drawn(Eb4, hw('budget', 'fifty thousand'), 1.4, 0.5, px(1430), strip=4)
P_ag = hw('agree', 'checks the page')
for i in range(4):
    tap(P_ag + 0.2 + i * 0.22 + 0.35, 0.008, px(1820))
line((Ab3, G3), hw('agree', 'allows more', -0.2), 0.5, 0.55, px(1430), strip=3, last=1.3, cut=False)
knock(hw('widen', 'the page lives'), 0.011, px(520))
drawn(Eb4, hw('widen', 'the page lives', 0.2), 2.0, 0.55, px(520), strip=0)

# 4. Alone in test, a draft in production: the count and its two columns; the written rule, E flat; a fix it may make, G; the tutor who
#    moved, A flat; HR decides it: the bass trumpet; then the night: C minor, the draft, and Noor's approval on the bass trumpet; the
#    wrong guess's pull request laid down; a plain job, a gear
aw = lambda lid, word, off=0: W('alone', lid, word, off)
ac = lambda lid, off=0: G('alone', lid, off)
paper(S0('alone') + 0.4, 0.011, px(960))
paper(aw('bug', 'The first', -0.3), 0.011, px(490))
drawn(Eb4, aw('bug', 'The rule is written'), 1.4, 0.55, px(490), strip=0)
drawn(G4, aw('may', 'Putting that right'), 1.2, 0.5, px(490), strip=0)
paper(aw('moved', 'The second', -0.3), 0.011, px(1430))
drawn(Ab3, aw('moved', 'Public Health'), 1.4, 0.55, px(1430), strip=3)
btp(Bb2, aw('decide', 'HR decides'), 1.8, 0.8, px(1430) * 0.5)
drawn(C3, ac('draft', -0.6), 2.6, 0.65, 0.0, strip=3, rise=0.6, fall=0.9)
paper(ac('draft', 0.0), 0.011, px(850))
btp(Eb3, aw('draft', 'Noor approves'), 1.6, 0.75, -0.1)
paper(ac('costs', -0.2), 0.011, px(840))
knock(aw('rerun', 'a plain job', -0.1), 0.010, px(840), 300)

# 5. A switch, and an undo: Sam at the switch, the bass trumpet; the four things that follow, a tap each; Anil, who may stop it too,
#    the bass trumpet again; the pull request merged and reverted, a line drawn down; a table's versions laid down; the mandate narrowed
#    or withdrawn, Anil's word, and the night task's stage turned down, B flat to A flat, as 3.1 turned it; December; neither needed
sw = lambda lid, word, off=0: W('stop', lid, word, off)
scc = lambda lid, off=0: G('stop', lid, off)
paper(scc('switch', -0.1), 0.011, px(530))
knock(sw('switch', 'service principal', -0.2), 0.009, px(860), 220)
btp(Bb2, sw('switch', 'service principal'), 1.8, 0.8, px(1640) * 0.5)
for lid, w_ in (('sp', "can't sign in"), ('sp', 'its grants stay'), ('app', "can't reach"), ('app', 'everyone else')):
    tap(sw(lid, w_, -0.1), 0.008, px(300))
btp(Eb3, sw('who', 'Anil may stop it'), 1.6, 0.75, px(1240) * 0.5)
paper(sw('undo', 'a pull request', -0.4), 0.011, px(510))
line((Eb4, Bb3), sw('undo', 'reverted', -0.1), 0.5, 0.55, px(510), strip=1, last=1.4, cut=False)
paper(sw('table', 'keeps its versions', -0.3), 0.011, px(1420))
tap(sw('table', 'restore the one before'), 0.009, px(1300))
paper(sw('back', 'taken back', -0.3), 0.011, px(510))
btp(C3, sw('back', 'narrow or withdraw'), 1.7, 0.75, px(510) * 0.5)
P_wait = sw('back', 'the task waits')
drawn(Bb3, P_wait + 0.1, 0.8, 0.5, px(1830), strip=4, fall=0.2); drawn(Ab3, P_wait + 1.2, 1.4, 0.5, px(1830), strip=4)
tap(sw('december', 'Each December', -0.1), 0.008, px(1180))
drawn(Eb4, sw('none', 'nobody needed'), 1.6, 0.5, px(520), strip=0)

# 6. Five stages, each with its gate: the lab this morning, E flat: its report read; Jun merges, the bass trumpet; it runs in test
#    again, a tick; Noor's yes, the bass trumpet; the question with HR; Nursing's count, E flat. The stages: the five gates passed one
#    by one, the five stages' notes of 3.1 drawn in E flat; written, narrow, revocable. Seven lessons laid down; the film's own, B flat;
#    the road from further off; the next series, lit, an open D; the mark on the end card, and silence when the strip ends
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
paper(cw('morning', 'read the report', -0.3), 0.012, px(850))
drawn(Bb3, cw('morning', 'read the report', -0.1), 2.0, 0.6, px(850), strip=0, rise=0.25)
tap(cw('morning', 'its measures'), 0.008, px(850))
paper(cc('jun', -0.3), 0.012, px(850))
btp(Eb3, cw('jun', 'merged it'), 1.5, 0.75, px(560) * 0.5)
tap(cw('jun', 'ran in test again', 0.3), 0.009, px(560))
btp(G3, cw('jun', 'said yes', 0.2), 1.6, 0.7, px(1670) * 0.5)
paper(cc('hr', -0.3), 0.011, px(840))
paper(cc('count', -0.3), 0.011, px(840))
drawn(Eb4, cc('count', 0.5), 1.6, 0.55, px(1100), strip=0)
paper(cw('three', 'whose identity', -0.3), 0.011, px(560))
P_gates = cw('gate', 'its gate', 0.2)
line(STAGES, P_gates, 0.35, 0.6, px(960), strip=2, last=1.5, cut=False)
for w_, i in (('written,', 0), ('narrow', 1), ('revocable', 2)):
    tap(cw('gate', w_, -0.1), 0.008, px(300 + 230 * i))
for i in range(1, 8):
    paper(cc('l%d' % i, -0.15), 0.009, px(400 + 160 * (i - 1)))
drawn(Bb3, cc('l7', 0.1), 2.0, 0.5, px(1660), strip=0)
air(cw('road', 'a longer road', -0.4), 1.6, 0.007, px(1100))
drawn(D4, cw('next', 'Next', -0.1), 1.8, 0.5, px(1660), strip=4, rise=0.3)
mark(cc('breath', 0.7), 0.65, 0.0)
