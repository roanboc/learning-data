# Why Unity Catalog and Unity Gateway govern them: the music and sounds, played by tools/audio.py with From words to data's
# instruments (shared/tools/music.py). A new palette, checked on 4 November 2026 against every score.py on main and against the series'
# other films (/mnt/project-files/agentic-data-engineering/series-2/palettes.md): an electric clavichord and a crumhorn, both made here
# (music.py has neither).
#  - The electric clavichord is the 1960s keyboard whose keys strike its strings with small rubber tips, the tone taken from the strings
#    by pickups. Here it is damped and soft: each key strikes its string exactly where it's set, and the note stops when the key is let
#    go (one set of rules, enforced where it lives). It plays the chords and the film's figure.
#  - The crumhorn is a Renaissance reed whose reed is shut inside a wind cap: the player's breath reaches the reed only through the cap,
#    and it can't overblow past its range. Played softly, low in its range, it is the agent's own voice, and it sounds where something
#    passes the gateway: every call goes through the cap, and no further than it's allowed.
#  - The mark: the same figure for a person and for an agent, B flat, E flat, D flat, G flat. Mei's key plays it on the clavichord alone,
#    when the agent takes it and signs in as her; given a name of its own, under the same rules as people, the agent plays it on the
#    crumhorn with the clavichord, together; the two play it again over the title card, then when Clara and the agent read the
#    learner table the same way, and on the film's last line.
#  - E flat minor for the nights and the trouble, G flat major (its relative major) for what the rules give; A flat minor, C flat
#    major and B flat minor at the turns. No D flat major chord: its fifth isn't pure in this tuning.
# The rules the series keeps (its briefs, 4 November 2026, as the module's other films do):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord is tuned pure (just intonation from E flat, see
#    hz()), so E flat minor, G flat major, A flat minor, C flat major and B flat minor are all pure. No urgent pulse: nothing in this
#    story is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
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
R1 = np.random.default_rng(2026)  # this film's own randomness: the room, the breath, the paper

# ---- tuning: just intonation from E flat, so a chord's notes are whole-number ratios of each other and nothing beats. E flat minor
# (E flat G flat B flat), G flat major (G flat B flat D flat), A flat minor (A flat C flat E flat), C flat major (C flat E flat G flat)
# and B flat minor (B flat D flat F) are all pure in this table; D flat with A flat is not (40/27), so no D flat major chord
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (51, 155.563)  # E flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
FIG = (58, 63, 61, 66)  # the mark: B flat 3, E flat 4, D flat 4, G flat 4

# ---- the levels: the clavichord as loud as the module's other music after the author's review of 4 November 2026 (its loud moments
# about -28 dB of full scale as one speaker plays the score, tools/quiet.py), the crumhorn a little under it; the effects about 16 dB
# under the music, as low as the governance films' (FX scales them all)
CVL, CRL, FX = 0.060, 0.032, 1.35

# a room round the players: a small, dry hall, ringing on for about a second, and nothing much above 1.6 kHz
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s

# ---- the electric clavichord: a string struck by a rubber tip and heard through a pickup near its end, damped. Its partials are
# harmonic (a light string, no stiffness to speak of), shaped by where the pickup sits (a comb of the string's modes) and softened by the
# tip; each dies away on its own, the higher ones sooner; when the key is let go a felt damper stops the string in a tenth of a second.
# A soft thump of the tip as it strikes
def clav(m, a, b=None, g=1.0, pan=0.0, room=0.22):
    """one key, struck at a and let go at b (by default it's held until the note has rung out)"""
    f = hz(m); held = min(4.5, (b - a) if b else 4.5); rel = 0.1
    n = int((held + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    tau = 1.25 * (196.0 / f) ** 0.35
    for k in range(1, 18):
        fk = f * k
        if fk > 2350:
            break
        ak = (abs(np.sin(np.pi * k * 0.14)) + 0.05) / k ** 0.9 * np.exp(-0.2 * (k - 1))
        s += ak * np.exp(-x / (tau / (1 + 0.45 * (k - 1)))) * np.sin(2 * np.pi * fk * x + 0.3 * k)
    s *= np.minimum(1, x / 0.004)
    s *= np.where(x > held, np.cos(0.5 * np.pi * np.minimum((x - held) / rel, 1)) ** 2, 1.0)
    th = int(0.03 * SR); s[:th] += filt(noise(0.03), 'low', 600)[:th] * np.exp(-np.arange(th) / SR / 0.006) * 0.06
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2400)
    put(_room(s, room).astype(np.float32), a, g * CVL, pan)

def roll(ch, a, g=1.0, spread=0.055, b=None, pan=(-0.2, 0.2)):
    """a chord, the keys struck from the lowest up, a moment apart, held to b (or until they ring out)"""
    for i, m in enumerate(ch):
        clav(m, a + spread * i, b, g * (1.0 if i == 0 else 0.8), pan[0] + (pan[1] - pan[0]) * i / max(1, len(ch) - 1))

def figure(a, g=1.0, step=0.36, last=2.2, pan=0.1):
    """the mark on the clavichord: four keys, the last held"""
    for i, m in enumerate(FIG):
        clav(m, a + step * i, a + step * i + (last if i == 3 else step * 0.95), g * (1.0 if i == 3 else 0.85), pan)

# ---- the crumhorn, played softly, low in its range, its reed in a wind cap: a cylindrical bore's odd partials, a reed's buzz round
# a kilohertz, a breath through the cap as it speaks; held steady at one level (the cap leaves the player no swell and no vibrato), and
# stopped short
def crum(m, a, b, g=1.0, pan=-0.1, room=0.3):
    """the crumhorn, from a to b"""
    f = hz(m); sec = max(0.3, b - a); att, rel = 0.05, 0.12
    n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for k in range(1, 40):
        fk = f * k
        if fk > 2300:
            break
        ak = (1.0 if k % 2 else 0.2) / k ** 0.75 * (1 + 0.5 * np.exp(-((fk - 1000) / 420) ** 2))
        s += ak * np.minimum(1, x / (att * (1 + 0.12 * (k - 1)))) * np.sin(2 * np.pi * fk * x + 0.9 * k)
    s *= np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    br = int(0.08 * SR); s[:br] += filt(noise(0.08), 'band', (400, 1500))[:br] * np.exp(-np.arange(br) / SR / 0.02) * 0.05
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2300)
    put(_room(s, room).astype(np.float32), a, g * CRL, pan)

def cfigure(a, g=1.0, step=0.36, last=2.2, pan=-0.15):
    """the mark on the crumhorn, an octave under the clavichord's"""
    for i, m in enumerate(FIG):
        crum(m - 12, a + step * i, a + step * i + (last if i == 3 else step * 0.92), g, pan)

def mark(a, g=1.0, last=2.2):
    """the same figure for a person and for an agent: the clavichord and the crumhorn together"""
    figure(a, g, last=last); cfigure(a, g * 0.9, last=last)

# ---- soft sounds in the room, all low-passed: the noises filtered twice, so almost nothing of them reaches above 2.5 kHz
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a tag on its hook"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled click: a pill coming up, a lock, a switch"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.016, pan=0.0, sec=0.45):
    """a card or a sheet laid on the wall: filtered noise with a swell"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (250, 1800)), 'low', 2000)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.01, pan=0.0, lo=140, hi=900):
    """something passing: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def strike(s, g=0.01, pan=0.0, sec=0.6):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (450, 1600)), 'low', 1800)[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def pencil(s, g=0.01, pan=0.0, sec=0.6):
    """a name signed: a soft, even scratch"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (500, 1800)), 'low', 2000)[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def clink(s, g=0.008, pan=0.0):
    """a small key against its hook: a few soft metal partials, quickly gone"""
    x = tt(0.35)
    sig = (np.sin(2 * np.pi * 1180 * x) + 0.6 * np.sin(2 * np.pi * 1730 * x + 0.4) + 0.3 * np.sin(2 * np.pi * 2210 * x + 1.1)) * np.exp(-x / 0.06)
    sig *= np.minimum(1, x / 0.002)  # a 2 ms touch, so it rings without a click
    X(filt(sig.astype(np.float32), 'low', 2400), s, g * FX, pan)
def flutter(s, sec=2.6, g=0.008, pan=0.0):
    """the log's lines racing past: one soft paper texture that swells in and out, not a burst of flicks"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)

# =============================================================================================================================
# 1. Whose reads were those? The opening, under the clavichord. By day: G flat, open, as Mei is introduced; the faculties' three
#    questions laid on the wall. The agent's ring draws itself: C flat. At night: E flat minor; the questions go into the ring on a
#    breath of air, and the answers settle, one knock each. Her personal key: she holds it up and it goes to the agent's hook, a clink,
#    and the figure, on the clavichord alone (hers, now the agent's). Sam and the log: A flat minor; the Sunday lines race past, one soft
#    texture, and a low open fifth with the amber count. At night again: E flat minor; the arm touches each row. The trick: A flat
#    minor, low. Its calls: a breath of air along the thread out of the room, a clink for the second key, and one note left hanging
#    over the question mark. The log points at Mei: the low fifth again. She did nothing wrong: A flat minor, softly; three lines to
#    what her key opens. Something had to change: nothing. A name of its own: the key comes off the hook, the badge drops, G flat
#    major, and the figure on the crumhorn and the clavichord together, "under the same rules as people". The catalog's record; the
#    stars. Unity Gateway: the crumhorn holds a low G flat as the thread passes the frame. Every morning: G flat. Jun's agent: C flat,
#    then G flat on "one set of rules"; the title card: the figure once more, on both
rw = lambda lid, word, off=0: W('reads', lid, word, off)
rc = lambda lid, off=0: G('reads', lid, off)
r0 = S0('reads')
# by day: G flat, open; the questions laid on the wall
roll((42, 54, 61, 66), r0 + 0.5, 0.85)
for i, word in enumerate(('the same questions', 'how many students', 'in which courses')):
    paper(rw('ask', word), 0.012, px(1576))
roll((46, 58, 61, 65), rw('ask', 'how many students', -0.2), 0.7)
# the agent's ring draws itself
roll((47, 59, 63, 66), rw('mei', 'set up an agent'), 0.75)
# at night: E flat minor; the questions go into the ring, and the answers settle
P_night = rw('mei', 'at night')
roll((39, 51, 58, 66), P_night + 0.05, 0.8)
air(P_night + 0.3, 2.4, 0.008, px(1300))
for i in range(3):
    knock(P_night + 0.3 + 1.4 + 0.7 * i + 0.25, 0.012, px(1580), 260)
# her personal key: held up, it flies to the hook, a clink as it lands; the figure, hers, now the agent's
P_key = rw('key', 'sign in as her', 0.1)
paper(rw('key', 'sign in as her'), 0.012, px(686))
air(P_key, 1.5, 0.006, px(900))
clink(P_key + 1.5, 0.01, px(1130))
figure(P_key + 1.55, 0.8)
# Sam and the log: A flat minor; the record and the log laid up; the Sunday lines race past, and the amber count, low
roll((44, 56, 59, 63), rc('log', 0.2), 0.75)
paper(rc('read', -0.2), 0.012, px(1576))
paper(rw('log', "checks the platform's log"), 0.012, px(826))
flutter(rc('sunday', 0.2), 3.0, 0.007, px(826))
P_2300 = rw('sunday', 'two thousand')
roll((39, 46), P_2300, 0.75)
knock(P_2300, 0.012, px(826), 180)
# at night again: E flat minor; the arm touches each row; everything she can, lit
roll((51, 58, 63, 66), rc('asleep', 0.1), 0.7)
for i in range(4):
    tap(rc('asleep', 0.8 + 0.5 * i + 0.6), 0.008, px(1700))
paper(rw('all', 'all it needed was counts'), 0.012, px(686))
# the trick: A flat minor, low, as the arm turns towards the amber card
roll((44, 51, 59), rw('trick', 'handing names over', -0.6), 0.7)
paper(rc('trick', 0.1), 0.012, px(1540))
# its calls: the thread runs out of the room on a breath of air; the second key, a clink; budget none; and one note left hanging
air(rc('calls', 0.2), 1.6, 0.008, px(1500))
clink(rw('calls', 'another key of hers', 0.4), 0.008, px(1500))
tap(rw('calls', "no one's budget"), 0.01, px(1560))
clav(61, rw('calls', 'what the calls carried', 0.1), None, 0.6, px(1800))
# the log points at Mei: the low fifth, as the line reaches her name
P_pt = rw('blame', 'point at Mei')
roll((39, 46), P_pt + 0.85, 0.7)
# she did nothing wrong: A flat minor, softly; a line to each thing her key opens
roll((56, 59, 63), rc('nothing', 0.3), 0.6)
for i in range(3):
    tap(rw('nothing', 'a personal key', 0.2 + 0.45 * i), 0.008, px(1500))
# something had to change: nothing. A name of its own: the key off the hook, the badge dropped on, G flat major, and the figure on both
P_name = rw('own', 'a name of its own')
clink(P_name + 0.15, 0.008, px(1130))
knock(P_name + 0.95, 0.014, px(1130), 300)
roll((42, 54, 58, 61), P_name + 0.9, 0.75)
mark(rw('own', 'the same rules'), 0.75)
# Unity Catalog: the record, and its stars
paper(rw('catalog', 'Unity Catalog'), 0.012, px(1576))
tap(rw('grants', 'stars where the names are', 0.6), 0.01, px(1576))
tap(rw('grants', 'only the grants'), 0.009, px(1576))
# Unity Gateway: the crumhorn holds a low G flat as the thread passes the frame; the model it may call; counted
P_gw = rc('gateway', 0.6)
crum(42, P_gw, P_gw + 3.4, 0.9)
knock(rw('gateway', "only the ones it's allowed"), 0.012, px(1635))
tap(rw('gateway', 'counts what it spends'), 0.01, px(1635))
# every morning: G flat; the answers ticked; no names seen; the registrar's budget
roll((54, 58, 61, 66), rc('worked', 0.2), 0.75)
tap(rc('worked', 0.6), 0.009, px(1800))
tap(rw('since', "hasn't seen a single name"), 0.009, px(1580))
paper(rw('since', 'three hundred dollars'), 0.012, px(706))
# and the log says whose: the agent's two lines lit
tap(rc('whose', 0.4), 0.008, px(600)); tap(rc('whose', 0.6), 0.008, px(600))
# Jun's census agent: C flat; one set of rules: G flat; the title card: the figure on both
roll((47, 54, 59, 63), rc('jun', 0.3), 0.7)
paper(rc('jun', 0.4), 0.012, px(1580))
roll((42, 58, 61, 66), rc('rules', 0.1), 0.7)
mark(rc('breath', 0.6), 0.75, 2.6)

# 2. A rule it's told, and a rule that holds: A flat minor at the turn, as the page comes up; told, a request; misread, a smear of air;
#    lost, its work piling up; the slip of hidden words. A rule that holds: the arms come back with stars, G flat major, a lock. Both:
#    told, enforced. Two places: the catalog's frame, C flat major; its cards set in; the gateway's frame, and the crumhorn under it
hw = lambda lid, word, off=0: W('holds', lid, word, off)
hc = lambda lid, off=0: G('holds', lid, off)
roll((44, 51, 59, 63), S0('holds') + 0.4, 0.65)
paper(S0('holds') + 0.4, 0.012, px(430))
tap(hw('request', 'a request'), 0.009, px(240))
air(hw('lose', 'misread it'), 1.2, 0.006, px(430))
for i in range(4):
    tap(hw('lose', 'lose it in a long task', 0.3 + 0.35 * i), 0.007, px(1460))
paper(hw('lose', 'words hidden'), 0.01, px(520))
for i in (1, 2):
    tap(hc('enforce', 0.6 + 0.5 * (i - 1) + 0.6), 0.008, px(1700))
roll((42, 54, 58, 61), hc('enforce', 1.7), 0.65)
tap(hw('enforce', 'only ever sees as stars'), 0.01, px(1576))
tap(hw('both', 'tells its agents'), 0.009, px(200)); tap(hw('both', 'enforces them'), 0.011, px(1370))
roll((47, 59, 63, 66), hc('two', 0.3), 0.62)
for lid, word in (('touch', 'the tables'), ('touch', 'the functions'), ('touch', 'the log'), ('ug', 'the models'), ('ug', 'tool servers')):
    knock(hw(lid, word), 0.011, px(950 if lid == 'touch' else 1560), 260)
crum(42, hc('ug', 0.2), hc('ug', 3.4), 0.8)

# 3. A name for the agent: B flat minor at the turn. Beside her, by day: a small agent, signed in as Mei. On its own, at night: E flat
#    minor. A service principal: its card and its grants laid up, read with a lock, write struck out. Jun's page. Switched off: one low
#    note stopped short, a click; the census agent works on, a breath of air. Mei its owner: the tag on the hook, G flat major
nw = lambda lid, word, off=0: W('name', lid, word, off)
nc = lambda lid, off=0: G('name', lid, off)
roll((46, 58, 61, 65), S0('name') + 0.3, 0.62)
paper(nw('beside', "while they're there"), 0.011, px(1546))
tap(nw('beside', 'sign-in'), 0.009, px(700))
roll((39, 51, 58, 66), nc('alone', 0.2), 0.62)
paper(nw('alone', 'a name of its own'), 0.011, px(686))
paper(nw('sp', 'a service principal'), 0.012, px(756))
paper(nw('make', 'grants it only'), 0.012, px(1456))
tap(nw('needs', 'the core tables'), 0.01, px(1300)); strike(nw('needs', 'write nowhere', 0.1), 0.008, px(1300), 0.4)
paper(nc('census', 0.4), 0.012, px(856))
P_off = nw('stop', 'switches off')
clav(39, P_off + 0.2, P_off + 0.55, 0.6, px(950))
tap(P_off + 0.25, 0.012, px(950))
air(nw('stop', 'everyone else works on'), 1.0, 0.007, px(1650))
knock(nw('owner', 'stays its owner', 0.75), 0.012, px(880), 280)
roll((54, 58, 61, 66), nw('owner', 'stays its owner', 0.8), 0.65)

# 4. The same stars: C flat major at the turn, the policy laid up; the group's members, one tap each; the office's group, and the agent
#    not in it. Clara and the agent read the same record: the figure, on the clavichord and the crumhorn together, the mark: the same
#    for a person and for an agent. Nobody wrote a rule for agents: no music. The row filter slides, a breath of air; the group; Health
#    only, a lock. The learner code; the census count; no names read
sw = lambda lid, word, off=0: W('stars', lid, word, off)
sc_ = lambda lid, off=0: G('stars', lid, off)
roll((47, 54, 59, 63), S0('stars') + 0.4, 0.62)
paper(S0('stars') + 0.4, 0.012, px(756))
P_us = sw('everyone', "all the account's users")
paper(P_us, 0.011, px(1576)); tap(P_us + 0.3, 0.008, px(1450))
P_sp = sw('everyone', 'every service principal')
tap(P_sp, 0.008, px(1450)); tap(P_sp + 0.5, 0.008, px(1450))
paper(sw('counts', "the office's group"), 0.011, px(756)); tap(sw('counts', 'all it needs is counts'), 0.009, px(680))
paper(sc_('clara', 0.3), 0.011, px(746)); paper(sc_('clara', 0.6), 0.011, px(1566))
mark(sw('status', "each learner's status", -0.2), 0.75, 2.4)
paper(sw('nobody', 'The rule for people'), 0.011, px(756))
air(sw('rows', 'A row filter', 0.2), 1.4, 0.007, px(856))
paper(sw('rows', 'A row filter', 0.6), 0.011, px(1580)); tap(sw('rows', 'for an agent'), 0.008, px(1450))
tap(sw('rows', 'for an agent', 0.4), 0.01, px(1580))
paper(sw('count', 'eighteen thousand'), 0.012, px(1536)); tap(sw('count', 'without a single name'), 0.009, px(1500))

# 5. Tools in the catalog: A flat minor at the turn, as the frame draws. The function laid in; its grant; the arm touches it. The tool
#    servers, set in; the arms reach two and stop short of the third; registered through Unity Gateway: the crumhorn, a moment
tw = lambda lid, word, off=0: W('tools', lid, word, off)
tc = lambda lid, off=0: G('tools', lid, off)
roll((44, 56, 59, 63), S0('tools') + 0.3, 0.6)
paper(tw('fn', 'a function'), 0.012, px(1510))
tap(tw('grant', 'a grant'), 0.009, px(1510))
tap(tc('run', 1.0), 0.01, px(1300))
for i in range(3):
    knock(tw('servers', 'the tool servers', 0.2 + 0.3 * i), 0.011, px(1440), 260)
P_only = tw('each', 'only these')
for i in range(2):
    tap(P_only - 0.6 + 0.4 * i + 0.7, 0.008, px(1300))
crum(46, tw('servers', 'through Unity Gateway'), tw('servers', 'through Unity Gateway', 2.4), 0.75)
tap(tw('fewest', 'only read'), 0.008, px(1440))

# 6. Through the gateway: the gateway's frame draws itself and the crumhorn holds G flat under it; G flat major as the model services
#    are set in. Mei's keys struck through, taken back. The checks come up. A prompt comes to the door; its email address is hidden, a
#    soft swipe, and it goes on through: the crumhorn, a moment. The hidden words come to the same door and stop there, a dull knock;
#    blocked. The limit's dial. Every call counted under its name: the usage fills on a breath of air, the budget laid under it, and
#    G flat major with the crumhorn under it
gw = lambda lid, word, off=0: W('gateway', lid, word, off)
gc = lambda lid, off=0: G('gateway', lid, off)
P_ug = gw('models', 'In Unity Gateway')
crum(42, P_ug + 0.1, P_ug + 4.4, 0.8)
P_svc = gw('models', 'a service in the catalog')
roll((54, 61, 66, 70), P_svc + 0.1, 0.62)
for i in range(3):
    knock(P_svc + 0.1 + 0.3 * i, 0.011, px(1580), 260)
P_keys = gw('one', "Mei's keys")
paper(P_keys, 0.011, px(420)); strike(P_keys + 0.5, 0.009, px(300), 0.6)
tap(gc('checks', 0.6), 0.009, px(906)); tap(gc('checks', 1.0), 0.009, px(920))
paper(gc('email', 0.2), 0.011, px(700))
P_hide = gw('email', 'hides it')
air(P_hide, 0.6, 0.006, px(760), 300, 1400)
crum(49, P_hide + 0.95, P_hide + 2.3, 0.7)
P_st = gc('trick', 0.2)
paper(P_st, 0.01, px(700)); knock(P_st + 0.9, 0.014, px(820), 170)
tap(gw('trick', 'to trick the agent'), 0.009, px(820))
tap(gc('limit', 1.2), 0.009, px(1420))
P_cnt = gw('count', 'under its name')
paper(P_cnt, 0.012, px(786)); air(P_cnt + 0.3, 1.2, 0.006, px(786))
paper(gw('count', 'its own budget'), 0.011, px(786))
roll((42, 58, 61, 66), gw('count', 'its own budget', 0.1), 0.6, pan=(-0.1, 0.25))
crum(42, gw('count', 'its own budget', 0.15), gw('count', 'its own budget', 2.6), 0.65)

# 7. Seen under its own name: B flat minor at the turn, a month later. The query laid up, the log under it, a tap for each of its lines.
#    Whose reads were those? Now the log says: G flat major. Lineage: the tables, the answer; the gateway's own table. Stopped alone:
#    one low note stopped short, a click. No read of the agent's taken for Mei's: G flat, with its sixth, softly
ew = lambda lid, word, off=0: W('seen', lid, word, off)
ec = lambda lid, off=0: G('seen', lid, off)
roll((46, 53, 58, 61), S0('seen') + 0.4, 0.6)
paper(ew('same', 'The same question'), 0.012, px(856))
P_mei = ew('same', 'lists Mei')
paper(P_mei - 0.3, 0.011, px(916)); tap(P_mei, 0.007, px(900)); tap(P_mei + 0.3, 0.007, px(900))
P_ag = ew('same', 'the registrar agent')
tap(P_ag, 0.008, px(1000)); tap(P_ag + 0.3, 0.008, px(1000))
roll((54, 61, 66, 70), ew('whose', 'Now the log says', 0.1), 0.6)
for i in range(3):
    knock(ew('lineage', 'the tables', -0.2 + 0.25 * i), 0.01, px(640), 270)
paper(ew('lineage', 'the tables', 0.6), 0.011, px(1100))
paper(ew('usage', 'own table'), 0.011, px(1580)); tap(ew('usage', 'the tokens'), 0.008, px(1580))
P_al = ew('stop', 'stop the agent alone')
clav(39, P_al + 0.2, P_al + 0.55, 0.6, px(900))
tap(P_al + 0.25, 0.012, px(900))
paper(ec('mei', 0.3), 0.011, px(916))
roll((42, 58, 63, 66), ec('mei', 0.5), 0.55)

# 8. One set of rules: A flat minor at the turn, the page and the catalog. Every person, agent and tool: their names set in, a tap for
#    each row. One set to keep, one log, one review: C flat major. Jun's agent and the number for the government: its card laid up;
#    seen, limited, counted; the count leaves on a breath of air. Every morning: the answers signed, G flat major. The last line: the
#    figure on both, the mark. Next: a card set down. The end card: G flat major, the clavichord and the crumhorn on G flat together
ow = lambda lid, word, off=0: W('one', lid, word, off)
oc = lambda lid, off=0: G('one', lid, off)
roll((44, 59, 63, 68), S0('one') + 0.3, 0.6)
paper(S0('one') + 0.3, 0.011, px(390))
for word in ('every person', 'every agent', 'every tool'):
    tap(ow('hold', word), 0.008, px(1000))
for word in ('one set to keep', 'one log to read', 'one review'):
    tap(ow('same', word), 0.009, px(1290))
roll((47, 59, 63, 66), ow('same', 'one review', 0.2), 0.58)
paper(oc('number', 0.0), 0.011, px(1580))
for word in ('can see', 'limit', 'account for'):
    tap(ow('checked', word), 0.008, px(1080))
air(ow('checked', 'account for', 0.6), 1.4, 0.007, px(1700))
pencil(oc('morning', 0.8), 0.008, px(1700), 0.6)
roll((54, 58, 61, 66), oc('morning', 0.9), 0.58)
mark(oc('take', 0.3), 0.75, 2.6)
knock(oc('next', 0.1), 0.013, px(960))
P_end = oc('breath')
roll((42, 54, 58, 61, 66), P_end + 0.3, 0.7, b=E('one') - 0.6)
crum(42, P_end + 0.5, E('one') - 0.7, 0.7)
