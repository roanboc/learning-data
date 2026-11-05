# The map, enforced: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the series thread and taken by this film's thread on 5 November 2026
# (/mnt/project-files/agentic-data-engineering/series-3/palettes.md), checked against 3.4's brake drums, 2.6's bell plates and the
# site's bells: almglocken and boobams, both made here (music.py has neither).
#  - The almglocken, tuned cowbells as the orchestra's percussion uses them, struck softly with yarn mallets: dry and hollow, never a
#    clang. In a herd each animal wears its own bell, so it's heard, found and told apart; here each agent has its own: the planning
#    agent's is A, Anil's workload agent's the high D. Jun's helper has none: it works on his sign-in, so what it does sounds as
#    Jun does, on his boobam.
#  - The boobams, tuned tube drums struck softly with the fingers, warm and wooden: the people who give, watch and stop the badge
#    (Jun's own note is D; Sam's turns are A and D, a person's fourth).
#  - The mark: the planning agent's own note, A, heard alone when it comes, then among the others' notes, still its own. Stopped, its
#    bell is held by a hand and stops short, while the others ring on.
#  - D major for the university and what it can now answer; B minor for the year nobody could place; A major at "Something had to
#    change". Just intonation from D (hz()), so no chord beats.
# The rules the series keeps (its briefs and the video guidelines):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words;
#    never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no roll, no tremolo, no ostinato. No urgent pulse: nothing here is a rush.
#  - Every sound is an event on screen, at the moment it appears: each below uses the picture's own word and offset in src/scenes.js,
#    so sound and picture stay together when the voice is re-timed. A burst on screen (214 tiles) is one soft sound.
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
R1 = np.random.default_rng(3005)  # this film's own randomness: the room, the mallets' touch, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D major, A major
# and B minor are all pure in this table; E with B is not (40/27), so E sounds only with A, C sharp, D or F sharp
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the bells' notes, low in their range, and the boobams'
D4, E4, Fs4, A4, B4, Cs5, D5 = 62, 64, 66, 69, 71, 73, 74
A2, B2, D3, E3, Fs3, A3 = 45, 47, 50, 52, 54, 57
PLAN = A4     # the planning agent's own bell
WORK = D5     # Anil's workload agent's own bell
JUN = D3      # Jun's boobam: his helper, on his sign-in, sounds as he does

# ---- the levels, set so the music's loud moments sit as low as the governance films' (tools/quiet.py), the boobams a little under
# the bells; the effects about 16 dB under the music (FX scales them all)
BL, DL, FX = 0.062, 0.092, 1.4

# a room round the players: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what
# it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask; each note has its own room
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.018 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s

# ---- an almglocke, struck softly with a yarn mallet. Its first tone is clear and hollow and dies away dry (a low bell a little
# longer); its octave and twelfth are faint and quicker; the bell's metal is an out-of-tune partial gone in a few hundredths of a
# second, so it colours the stroke and never rings against another bell. The mallet's touch: a soft, low knock. choke: a hand
# holds the bell that many seconds after the stroke, and it stops short
def bell(m, s, g=1.0, pan=0.0, ring=None, room=0.26, choke=None):
    f = hz(m); ring = ring or 0.55 + 0.3 * max(0.0, min(1.0, (520 - f) / 220))
    sec = min(1.9, 2.7 * ring); x = tt(sec).astype(np.float64)
    sig = np.sin(2 * np.pi * f * x) * np.exp(-x / ring)
    for r, a, d in ((2.0, 0.20, 0.32), (3.0, 0.06, 0.16), (2.76, 0.09, 0.05), (4.2, 0.035, 0.03)):
        if f * r < 2400:
            sig = sig + a * np.sin(2 * np.pi * f * r * x + 0.7 * r) * np.exp(-x / (ring * d))
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.004)) ** 2
    nt = int(0.025 * SR); sig[:nt] += filt(noise(0.025)[:nt], 'band', (250, 1200)) * np.exp(-np.arange(nt) / SR / 0.006) * 0.05
    if choke is not None:
        sig = sig * np.clip(1 - (x - choke) / 0.05, 0, 1)
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.12) / 0.12, 0, 1)) ** 2
    put(_room(filt(sig.astype(np.float32), 'low', 2400), room), s, g * BL, pan)
def bells(notes, s, step=0.16, g=1.0, pan=0.0, spread=0.3):
    """bells struck one after another, as written, ringing on together"""
    k = len(notes)
    for i, m in enumerate(notes):
        bell(m, s + step * i, g * (1.0 if i == 0 else 0.85) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5))

# ---- a boobam, struck softly with the fingers: a warm, wooden note from the skin over its tube; the pitch settles a little as the
# skin does, the tube keeps the first tone and little above it, and the finger's thump is soft and short
def boobam(m, s, g=1.0, pan=0.0, ring=None, room=0.22, choke=None):
    f = hz(m); ring = ring or (0.45 if f < 130 else 0.36)
    sec = min(1.6, 3.2 * ring); x = tt(sec).astype(np.float64)
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.02 * np.exp(-x / 0.03))) / SR
    sig = np.sin(ph) * np.exp(-x / ring) + 0.16 * np.sin(2 * ph + 0.3) * np.exp(-x / (0.4 * ring)) + 0.05 * np.sin(3 * ph + 0.5) * np.exp(-x / (0.25 * ring))
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.005)) ** 2
    nt = int(0.04 * SR); sig[:nt] += filt(noise(0.04)[:nt], 'low', 500) * np.exp(-np.arange(nt) / SR / 0.01) * 0.10
    if choke is not None:
        sig = sig * np.clip(1 - (x - choke) / 0.05, 0, 1)
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.1) / 0.1, 0, 1)) ** 2
    put(_room(filt(sig.astype(np.float32), 'low', 1600), room), s, g * DL, pan)
def fourth(s, g=1.0, pan=-0.1, lo=A2, hi=D3):
    """a person gives, watches or stops: the boobams' rising fourth, A to D"""
    boobam(lo, s, g * 0.85, pan); boobam(hi, s + 0.42, g, pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a pill, a row lit"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.009, pan=0.0, step=0.3):
    """a few keys typed"""
    for i in range(n):
        tap(s + i * step + 0.04 * R1.uniform(), g if i < 2 else g * 0.7, pan)
def paper(s, g=0.012, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, or many things at once"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.012, pan=0.0):
    """a switch thrown, or a script started: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def cross(s, g=0.009, pan=0.0, sec=0.35):
    """something crossed out: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def seal(s, g=0.012, pan=0.0):
    """verified: a small seal pressed on"""
    s_knock(s, g * FX, pan, 200); x = tt(0.07); X(filt(noise(0.07), 'band', (220, 1100))[:len(x)] * np.exp(-x / 0.012), s + 0.004, g * 0.4 * FX, pan)

# =============================================================================================================================
# 1. Whose change was that? The opening, with music all through it.
#    Today, at the university: the home chord, D major, without A (the planning agent's note waits for it); Planning's two tickets.
#    Jun's helper, on his sign-in: Jun's boobam, D, as it puts on his badge. Since Monday, the planning agent: its own bell, A, alone,
#    the mark's first time; owned by Clara, who answers for it: a person's fourth. October: B minor, the boobam's B; the question's
#    bells; the year's 214 changes, one soft breath as the tiles come. Every one said Jun: his D. Two days from memory; nine he can't
#    place: two bells falling in B minor. Couldn't fully answer: B minor again, low. Whatever Jun could; to stop it, stop Jun: his
#    switch thrown, his D held short. Something had to change: A major. A place on the map: the D under its A; a role, an owner, only
#    the rights its work needs. Sam writes it into every tool: the badge drops in with its bell, the three tools a card each. Wednesday:
#    the switch thrown, its bell held short, while the workload agent's high D and Jun's and Lucía's notes go on. One search: D major.
#    For data: the mark, its A among the others' notes. The title card: the home chord, with A in it now
F = lambda lid, word, off=0: W('whose', lid, word, off)
f0 = S0('whose')
boobam(D3, f0 + 0.4, 0.8, px(600)); boobam(Fs3, f0 + 0.8, 0.6, px(760))
bells((D4, Fs4), f0 + 1.3, 0.3, 0.7, px(900))
knock(F('place', 'a new column', 0.05), 0.014, px(1490), 240)
knock(F('place', 'a filter', 0.05), 0.014, px(1490), 260)
# Jun's helper, a coding agent in his editor, on his sign-in, with his name and his rights
air(F('helper', "Jun Park's helper", -0.3), 0.8, 0.007, px(560), 180, 800)
knock(F('helper', 'in his editor', 0.05), 0.013, px(1566), 240)
boobam(JUN, F('helper', 'his own sign-in', 0.15), 0.75, px(560))
tap(F('helper', 'his name', 0.05), 0.009, px(1400)); tap(F('helper', 'his rights', 0.05), 0.009, px(1400))
# since Monday, the planning agent: its own bell, alone; owned by Clara, who answers for it
air(F('monday', 'a new agent', -0.2), 0.8, 0.007, px(500), 180, 800)
bell(PLAN, F('monday', 'the planning agent', 0.1), 0.75, px(500), ring=0.9)
fourth(F('monday', 'owned by Clara', 0.05), 0.6, px(420))
tap(F('monday', 'answers for', 0.05), 0.009, px(1500))
# October: the auditors, and their question about the year's 214 changes
tA = G('whose', 'auditors', 0.25)
boobam(B2, tA, 0.75, px(600))
knock(F('auditors', 'can be trusted', -0.75), 0.013, px(800), 230)
knock(F('which', 'which had an agent', 0.05), 0.013, px(800), 250)
bells((Fs4, D4), F('which', 'which had an agent', 0.15), 0.22, 0.55, px(800))
air(F('which', 'two hundred', 0.0), 1.2, 0.008, px(1560), 160, 900)
# every one said Jun Park, in the code's history and in the query log
boobam(JUN, F('jun', 'said Jun Park', 0.1), 0.7, px(1560))
paper(F('jun', "the code's history", 0.0), 0.010, px(826), 0.35)
paper(F('jun', 'log of queries', 0.0), 0.010, px(826), 0.35)
# two days from memory: the tiles sorted; nine he can't place
knock(F('days', 'two days', 0.05), 0.013, px(736), 240)
air(F('days', 'two days', 0.25), 1.4, 0.007, px(1560), 200, 1000)
bells((B4, Fs4), F('days', 'for nine', 0.05), 0.3, 0.6, px(1560))
boobam(B2, F('days', 'for nine', 0.1), 0.6, px(1300))
# so the university couldn't fully answer; who to ask, what else to check
knock(F('wrong', "couldn't fully answer", 0.05), 0.013, px(736), 220)
boobam(B2, F('wrong', "couldn't fully answer", 0.15), 0.65, px(700))
bell(D4, F('wrong', 'was wrong', 0.0), 0.45, px(700))
tap(F('wrong', 'who to ask', 0.05), 0.009, px(700)); tap(F('wrong', 'what else to check', 0.05), 0.009, px(780))
# the helper could do whatever Jun could; to stop it, they'd have had to stop Jun
tap(F('all', 'whatever Jun could', 0.05), 0.009, px(1500))
tap(F('all', 'far more than a ticket needs', 0.05), 0.009, px(1500))
knock(F('all', 'to stop it', 0.05), 0.013, px(1580), 250)
click(F('all', 'stop Jun', 0.0), 0.013, px(1580))
boobam(JUN, F('all', 'stop Jun', 0.05), 0.7, px(560), choke=0.18)
# something had to change: A major
tC = G('whose', 'change', 0.15)
boobam(A2, tC, 0.75, px(760)); bells((E4, Cs5), tC + 0.3, 0.24, 0.6, px(960))
# a place on the university's map: a role, an owner, and only the rights its work needs
knock(F('badge', "a place on the university's map", 0.2), 0.014, px(1576), 240)
boobam(D3, F('badge', "a place on the university's map", 0.25), 0.6, px(1500)); bell(PLAN, F('badge', "a place on the university's map", 0.55), 0.6, px(1500))
tap(F('badge', 'a role', 0.05), 0.009, px(1500)); tap(F('badge', 'an owner', 0.05), 0.009, px(1500))
lock(F('badge', 'only the rights', 0.1), 0.010, px(1500))
# Sam wrote that place into every tool, under its own name: its badge drops in, with its bell; Databricks, GitHub and dbt
fourth(G('whose', 'three', 0.3), 0.55, px(420), D3, A3)
bell(PLAN, F('three', 'own name', 0.35), 0.7, px(500), ring=0.8)
for w_ in ('Databricks', 'GitHub', 'dbt'):
    knock(F('three', w_, 0.05), 0.011, px(1580), 260)
tap(F('three', 'wrote that place', 0.05), 0.009, px(1500))
# since Monday: its commits, and every query naming it
paper(F('since', 'says planning agent bot', -0.6), 0.010, px(1580), 0.35)
tap(F('since', 'says planning agent bot', 0.05), 0.009, px(1580))
paper(F('since', 'every query', 0.0), 0.010, px(1580), 0.35)
bells((D4, A4), F('since', 'every query', 0.65), 0.24, 0.45, px(1580))
# Wednesday: the switch thrown; its bell held short; the workload agent, Jun and Lucía work on
tW = F('tried', 'the planning agent stopped', -0.2)
knock(G('whose', 'tried', 0.5), 0.012, px(856), 240)
click(tW, 0.013, px(856))
bell(PLAN, tW + 0.05, 0.6, px(1010), choke=0.22)
tap(F('tried', 'for ten minutes', 0.05), 0.009, px(856))
bell(WORK, F('tried', "Anil's workload agent", 0.05), 0.55, px(1560))
boobam(JUN, F('tried', 'and Jun', 0.1), 0.5, px(700)); boobam(Fs3, F('tried', 'Lucía', 0.1), 0.5, px(760))
# if the auditors ask again: one search
keys(G('whose', 'ask', 0.55), 4, 0.007, px(960), 0.3)
bells((D4, Fs4), F('ask', 'one search', 0.1), 0.2, 0.5, px(560))
# and for data: every change says who made it, person or agent: the mark, its A among the others' notes; no more than the map says
tD = F('data', 'who made it', 0.0)
bell(PLAN, tD, 0.6, px(560)); bell(WORK, tD + 0.3, 0.5, px(760)); boobam(JUN, tD + 0.6, 0.55, px(960))
lock(F('data', 'no tool lets', 0.1), 0.010, px(560))
# the title card: the home chord, D major, with the planning agent's A in it now
tT = G('whose', 'breath', 0.3)
boobam(D3, tT, 0.8, px(860)); boobam(A2, tT + 0.05, 0.55, px(1060))
bells((D4, Fs4, A4, D5), tT + 0.35, 0.2, 0.75, 0.0, 0.5)

# 2. One name in every tool: Lucía's card, her names, at the turn; now the planning agent's own card, with its bell; a service
#    principal, as the workload agent has: its bell. To sign in, a secret: B minor, low; it can leak. Its runs sign in with passes:
#    GitHub vouches, tokens come back and end on their own; no secret it can see or leak: D major, gently
N = lambda lid, word, off=0: W('name', lid, word, off)
n0 = S0('name')
knock(N('one', 'one name in every tool', -0.4), 0.013, px(846), 240)
boobam(Fs3, N('one', 'one name in every tool', -0.3), 0.55, px(500))
for i in range(3):
    tap(N('one', 'one name in every tool', 0.2 + 0.3 * i), 0.008, px(846))
knock(G('name', 'too', 0.4), 0.013, px(1580), 240)
bell(PLAN, G('name', 'too', 0.5), 0.6, px(500), ring=0.8)
tap(N('dbx', 'a service principal', 0.05), 0.008, px(1580)); tap(N('gh', 'reads planning agent bot', 0.05), 0.008, px(1580))
tap(N('dbt', 'that same service principal', 0.05), 0.008, px(1580))
bell(WORK, N('dbx', "Anil's workload agent", 0.1), 0.45, px(1580))
knock(N('keys', 'needs a secret', 0.05), 0.013, px(790), 220)
boobam(B2, N('keys', 'it can leak', 0.0), 0.6, px(1520)); bell(D4, N('keys', 'it can leak', 0.25), 0.4, px(1520))
cross(N('keys', 'it can leak', -0.3), 0.007, px(1186))
knock(N('pass', 'its runs sign in', 0.05), 0.012, px(840), 240)
tap(N('pass', 'GitHub vouches', 0.05), 0.008, px(1540)); tap(N('pass', 'GitHub vouches', 0.35), 0.008, px(1540))
paper(N('pass', 'gets back tokens', 0.0), 0.009, px(1000), 0.3)
lock(N('so', 'no secret', 0.1), 0.010, px(840))
bells((Fs4, D4), N('so', 'no secret', 0.3), 0.22, 0.45, px(840))

# 3. Written from the map: Noor's map at the turn, a person's fourth; the agent's place, its A; the three steps, a card each; people
#    do the rest. By hand, tool by tool: crossed out; a script: its click, and the tools come in one after another, D, F sharp, A
#    rising, one way. The group and its grants; its only member: the agent's A among the group's D; a second agent in the role, the
#    same. Unity Gateway, GitHub, dbt: a card each. Governed first, read only: a lock; its memory second; where they disagree, the
#    definition wins: D major. Each night, the check: the boobam's low A. Tuesday, by hand: B minor; that night the check failed,
#    two bells falling; in the morning Sam took it back: a person's fourth, and D major. The map changes first, through review, and
#    the tools follow: three cards; never the other way: a low knock
M = lambda lid, word, off=0: W('map', lid, word, off)
m0 = S0('map')
fourth(M('who', "Noor's map", 0.0), 0.55, px(400), A2, D3)
knock(M('who', 'Its name', 0.2), 0.013, px(730), 240)
bell(PLAN, M('who', 'Its name', 0.3), 0.5, px(730))
knock(M('steps', 'planning contributor', 0.05), 0.012, px(1320), 250)
for i in range(3):
    knock(M('steps', 'the drafting steps', 0.25 * i), 0.010, px(750 + 440 * i), 260)
tap(M('steps', 'calls', 1.3), 0.007, px(900))
knock(G('map', 'script', 0.4), 0.012, px(660), 240)
cross(M('script', 'doesn\'t type', 0.7), 0.008, px(1090))
click(M('script', 'A script', 0.0), 0.012, px(1090))
air(M('script', 'writes every tool\'s settings', -0.1), 0.8, 0.008, px(1300), 180, 900)
bells((D4, Fs4, A4), M('script', 'writes every tool\'s settings', 0.2), 0.26, 0.55, px(1600), 0.4)
knock(M('uc', 'a group named for the role', 0.05), 0.012, px(840), 240)
lock(M('uc', 'names masked', 0.05), 0.009, px(840))
tap(M('uc', 'build only', 0.05), 0.008, px(840))
boobam(D3, M('member', 'its only member', 0.0), 0.5, px(840)); bell(PLAN, M('member', 'its only member', 0.3), 0.5, px(840))
tap(M('member', 'a second agent', 0.05), 0.008, px(840))
knock(M('ug', 'In Unity Gateway', 0.05), 0.012, px(1540), 240)
tap(M('ug', 'the one model', 0.05), 0.008, px(1540)); tap(M('ug', 'the tool servers', 0.05), 0.008, px(1540))
knock(G('map', 'gh', 0.05), 0.012, px(1540), 250)
tap(M('gh', 'one repository', 0.05), 0.008, px(1540)); tap(M('gh', 'two permissions', 0.05), 0.008, px(1540))
knock(M('gh', 'In dbt', 0.05), 0.012, px(840), 260)
tap(M('gh', 'a target of its own', 0.05), 0.008, px(840))
knock(M('context', 'governed', 0.05), 0.012, px(880), 240)
lock(M('context', 'read only', 0.05), 0.009, px(880))
knock(M('memory', 'Its memory', 0.05), 0.012, px(1540), 250)
tap(M('memory', 'in Lakebase', 0.05), 0.008, px(1540))
tWin = M('memory', 'the definition wins', 0.05)
tap(tWin, 0.008, px(880)); bells((D4, Fs4), tWin + 0.15, 0.24, 0.45, px(880))
# each night, the check; Tuesday, by hand; the check failed; taken back in the morning
tN = G('map', 'night', 0.35)
boobam(A2, tN, 0.6, px(560))
knock(tN + 0.1, 0.012, px(840), 240)
for i in range(4):
    tap(M('night', 'compares them', 0.3 * i), 0.007, px(840))
knock(M('tuesday', 'was given the right', 0.05), 0.013, px(1540), 220)
boobam(B2, M('tuesday', 'by hand', 0.0), 0.6, px(1540))
tF = M('failed', 'the check failed', 0.05)
bells((B4, Fs4), tF, 0.3, 0.55, px(840))
tap(M('failed', "a right the map doesn't hold", 0.05), 0.008, px(840))
tB = M('failed', 'took it back', 0.3)
fourth(tB, 0.55, px(420)); bell(D4, tB + 0.5, 0.4, px(1540))
# one way: the map changes first, through review, and the tools follow; never the other way
for w_, x_ in (('the map changes first', 700), ('through review', 1140), ('the tools follow', 1580)):
    knock(M('oneway', w_, 0.05), 0.011, px(x_), 250)
s_knock(M('oneway', 'never the other way', 0.4), 0.012 * FX, px(1140), 170)

# 4. A place of its own: its place, its own bell, A, alone in it; drafts set down; Jun's and Lucía's work untouched, locked. GitHub:
#    its branches; a pull request opened; a push to main refused: a low knock. It doesn't merge: a person's D. Databricks, from
#    development: production behind glass; even a wrong grant can't write: a lock. Its own schemas, one for each layer, a card
#    each; it owns what it makes: its A over the D; others' work untouched
O = lambda lid, word, off=0: W('own', lid, word, off)
o0 = S0('own')
air(O('where', 'a place of its own', -0.1), 1.0, 0.008, px(1180), 160, 800)
bell(PLAN, O('where', 'a place of its own', 0.3), 0.55, px(1180), ring=0.8)
tap(O('where', 'a place of its own', 0.55), 0.008, px(1100)); tap(O('where', 'a place of its own', 0.85), 0.008, px(1430))
lock(O('where', "can't touch", 0.05), 0.009, px(700)); lock(O('where', "can't touch", 0.35), 0.009, px(1180))
knock(G('own', 'branches', 0.35), 0.012, px(1190), 240)
tap(O('branches', 'writes only to branches', 0.1), 0.008, px(1190))
paper(O('branches', 'opens a pull request', 0.0), 0.009, px(1190), 0.3)
s_knock(O('branches', "can't push to main", 0.3), 0.012 * FX, px(1190), 170)
boobam(D3, O('merge', "doesn't merge", 0.05), 0.5, px(700))
tap(O('merge', 'its approval never counts', 0.05), 0.008, px(700))
knock(O('merge', 'The next film', 0.05), 0.012, px(1590), 250)
knock(O('dbx', 'the development workspace', 0.25), 0.012, px(860), 240)
lock(O('dbx', 'can only be read', 0.1), 0.010, px(860))
tap(O('dbx', 'even a wrong grant', 0.05), 0.008, px(780))
for i, w_ in enumerate(('one for each layer', 'one for each layer', 'planning agent marts')):
    knock(O('schemas', w_, 0.3 * i if i < 2 else 0.0), 0.010, px(1100), 260)
boobam(D3, O('owns', 'owns what it makes', 0.0), 0.5, px(1000)); bell(PLAN, O('owns', 'owns what it makes', 0.3), 0.55, px(1000))
tap(O('owns', 'written over', 0.05), 0.008, px(1640))

# 5. Under its own name: every log says whose work it is; its commits, its name lit; the workload agent's work, its own bell; one
#    typed by anyone: an amber row, no bell; its own, made through its App, verified: a seal. The query history, its lines lit; the
#    audit log, a row each. One search: typed; its pull request; what it changed: D major. Jun's name only on what Jun did: his D
L = lambda lid, word, off=0: W('logs', lid, word, off)
l0 = S0('logs')
paper(L('now', 'every log', 0.0), 0.010, px(1200), 0.35)
bell(PLAN, L('gh', 'read planning agent bot', 0.05), 0.55, px(1200))
bell(WORK, L('gh', "every other agent's work", 0.05), 0.45, px(1200))
cross(L('verified', 'type that name', 0.1), 0.007, px(1200))
seal(L('verified', 'marks them verified', 0.05), 0.012, px(1700))
tap(L('verified', 'through its App', 0.05), 0.008, px(700))
paper(L('qh', 'the query history', -0.3), 0.010, px(1200), 0.35)
tap(L('qh', 'its service principal', 0.05), 0.008, px(1200)); tap(L('qh', 'its service principal', 0.25), 0.008, px(1200))
paper(G('logs', 'audit', 0.0), 0.010, px(1200), 0.35)
tap(L('audit', 'each table it reads', 0.05), 0.008, px(1200)); tap(L('audit', 'each schema it makes', 0.05), 0.008, px(1200))
keys(G('logs', 'search', 0.35), 4, 0.007, px(1200), 0.3)
paper(L('search', 'every pull request', -0.2), 0.010, px(1200), 0.35)
knock(L('search', 'what each one changed', 0.05), 0.012, px(880), 240)
bells((A4, D5, Fs4), L('search', 'what each one changed', 0.3), 0.22, 0.5, px(880), 0.3)
knock(G('logs', 'jun', 0.3), 0.012, px(926), 240)
boobam(JUN, L('jun', 'only on what Jun did', 0.05), 0.6, px(500))

# 6. Stopped, and only it: Jun and his helper, one switch: his D held short, B minor. Each tool on its own: Databricks deactivated,
#    a switch; GitHub suspended, a switch; keeps its rights: a lock; no one stops with it. Wednesday: its next call refused, its bell
#    held short; the workload agent works on, its own bell; turned back on, its bell rings on: every right, as
#    before. Clara owns it and answers for it: her card, and no music; it never approves, never grants itself a right. Whose change was
#    that? Every log: the mark, its A among the others', still its own; one search. The map says what it may do: D major. Next: a
#    fourth rising. The end card: the home chord, the planning agent's A in it, ringing out
P_ = lambda lid, word, off=0: W('stop', lid, word, off)
p0 = S0('stop')
click(P_('before', 'stopping Jun', 0.0), 0.012, px(1580))
boobam(JUN, P_('before', 'stopping Jun', 0.05), 0.6, px(560), choke=0.18); boobam(B2, P_('before', 'stopping Jun', 0.35), 0.5, px(700))
tap(P_('each', 'on its own', 0.05), 0.008, px(1580))
click(P_('dbx', 'deactivates', 0.05), 0.012, px(1580))
lock(P_('dbx', 'keeps its rights', 0.05), 0.009, px(1500))
click(P_('gh', 'suspends', 0.05), 0.012, px(1580))
tap(P_('gh', 'can no longer reach', 0.05), 0.008, px(1500))
tap(P_('each', 'no one stops', 0.05), 0.008, px(1500))
tFl = P_('wed', 'next call failed', 0.4)
bell(PLAN, tFl, 0.55, px(1010), choke=0.2)
tap(tFl + 0.4, 0.008, px(1290))
bell(WORK, P_('on', "Anil's workload agent", 0.1), 0.45, px(1560))
tOn = P_('on', 'Turned back on', 0.1)
click(tOn, 0.011, px(1010)); bell(PLAN, tOn + 0.3, 0.6, px(1010), ring=0.9)
lock(P_('on', 'every right', 0.1), 0.009, px(1010))
knock(G('stop', 'never', 0.35), 0.012, px(420), 240)
tap(P_('never', 'answers for its work', 0.05), 0.008, px(1500))
tap(P_('never', 'never approves', 0.05), 0.008, px(1500)); tap(P_('never', 'grants itself a right', 0.05), 0.008, px(1500))
# whose change was that? every log says: the mark, its A among the others' notes, still its own; one search
tWh = P_('back', 'every log says', 0.0)
paper(tWh - 0.2, 0.010, px(960), 0.35)
boobam(JUN, tWh + 0.5, 0.5, px(960)); bell(WORK, tWh + 0.25, 0.45, px(960)); bell(PLAN, tWh, 0.6, px(960), ring=0.9)
tap(P_('back', 'one search', 0.05), 0.008, px(560))
# the map says what it may do; every tool holds it to that: D major
tTk = G('stop', 'take', 0.25)
boobam(D3, tTk, 0.6, px(960)); bells((Fs4, A4, D5), tTk + 0.3, 0.22, 0.55, 0.0, 0.4)
knock(G('stop', 'next', 0.0), 0.012, px(960), 250)
bells((A4, D5), G('stop', 'next', 0.3), 0.4, 0.45, px(960))
# the end card: the home chord, with the planning agent's A in it, ringing out
tE = G('stop', 'breath', 0.6)
boobam(D3, tE, 0.75, px(860)); boobam(A2, tE + 0.05, 0.5, px(1060))
bells((D4, Fs4, A4, D5), tE + 0.4, 0.22, 0.7, 0.0, 0.5)
bell(PLAN, tE + 2.4, 0.4, 0.0, ring=0.9)
