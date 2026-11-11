# Walls, doors and keys: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, taken in the module's palettes list (/mnt/project-files/data-protection/palettes.md, 5 November
# 2026) after checking every score.py on main and on every branch: a douçaine and two soft timpani, both made here (music.py has
# neither).
#  - The douçaine, the soft reed instrument of the 1300s (Machaut names it in the 1360s, the decade before the opening's law), as
#    reconstructed from the one found in the Mary Rose: a double reed on a narrow cylindrical bore closed at its far end, so the sound
#    leaves only by its few holes. Its odd harmonics carry it (the even ones are faint), hollow, reedy and sweet; played softly in its
#    middle range, G3 to D5, one voice, no vibrato. Few doors, each one you can see: each phrase a few notes, and the last left open,
#    on the fifth or the second, never home. Its mark, the film's: D, F, A, one note for each gate as it lights, and then E, left open.
#  - Two timpani, soft, with felt sticks, tuned to D and A: the walls' weight. One low note as a gate or a door shuts; under the
#    opening's turns; and in If someone got in, the film's one urgent chapter, a slow, quiet pulse while the question is asked and
#    while the intruder walks.
#  - D Dorian, the first church mode, for Ragusa and its walls; its flat sixth (B flat) for the plague. No C major chord or G with E:
#    their fifths aren't pure in this tuning (see hz()).
# The rules the module keeps (its briefs, 5 November 2026, as the governance and agent films do):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles or beats: no vibrato, no tremolo; every interval tuned pure (just intonation from D). The only pulse is the
#    urgent one in If someone got in, listed in film.json's "urgent".
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen (five owners'
#    ticks, six copies struck) is one soft sound, never one for each.
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
R1 = np.random.default_rng(1377)  # this film's own randomness: the room, the breath

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D minor (D F A),
# F major (F A C), G minor (G B flat D), B flat major and A minor are all pure in this table; C with G, and E with B, are not
# (40/27), so neither is played together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the douçaine's notes, G3 to D5, and the two timpani
G3, A3, Bb3, B3, C4, D4, E4, F4, G4, A4, Bb4, C5, D5 = 55, 57, 58, 59, 60, 62, 64, 65, 67, 69, 70, 72, 74
D2, A2 = 38, 45

# ---- the levels, set so the music's loud moments sit near -28 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films', whose sound the author accepted; the timpani under the douçaine; the effects about 16 dB under the
# music (FX scales them all)
DL, TL, FX = 0.039, 0.044, 2.0

# a room round the players: a stone hall, ringing on for about a second and a half, nothing much above 1.8 kHz. Its level is set by
# what it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level in it (_held)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.5)).astype(np.float32))(np.arange(int(1.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.025 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the douçaine: a capped double reed on a narrow cylindrical bore, closed at its far end, so its odd harmonics sound and the even
# ones are faint; the body's warmth under 1 kHz, soft above it, nothing above 2.2 kHz. Its higher harmonics speak a moment after the
# first, with a small breath through the reed as the note starts. Held steady, with no vibrato; a note of 1.2 s or more swells a
# little and eases, once
_ODD = {1: 1.0, 2: 0.10, 3: 0.55, 4: 0.05, 5: 0.30, 6: 0.03, 7: 0.15, 8: 0.02, 9: 0.07, 11: 0.035}
def douc(m, a, b, g=1.0, att=0.07, rel=0.22, pan=0.0, room=0.3):
    f = hz(m); sec = max(0.15, b - a); n = int((sec + rel + 0.12) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k, w in _ODD.items():
        fk = f * k
        if fk > 2200:
            continue
        w = w * np.exp(-max(0.0, fk - 1100) / 600)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.18 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.7 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.41 * k)
    if sec >= 1.2:
        s = s * (0.92 + 0.08 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    br = filt(noise(n / SR + 0.01)[:n], 'band', (500, 1900)) * 0.008 * (np.where(x < sec, 1.0, np.exp(-(x - sec) * 20)) + 2.2 * np.exp(-x / 0.05))
    put(_held(filt((s + br).astype(np.float32), 'low', 2200), room), a, g * DL, pan)
def phrase(notes, s, g=1.0, pan=0.0):
    """the douçaine, one note after another: notes is [(note, length)], each joined to the next; returns when the last one ends"""
    t = s
    for m, d in notes:
        douc(m, t, t + d, g * (0.9 if d < 0.5 else 1.0), pan=pan)
        t += d
    return t
def gates(times, last, g=1.0, pan=0.0, hold=1.6):
    """the film's mark: D, F and A, one note for each gate as it lights (times), then E, left open, at last"""
    for i, (m, t0) in enumerate(zip((D4, F4, A4), times)):
        douc(m, t0, (times[i + 1] if i < 2 else last), g * (0.85 + 0.05 * i), pan=pan)
    douc(E4, last, last + hold, g, rel=0.5, pan=pan)

# ---- a timpano, struck softly with a felt stick: its note (the drum's first tuned mode) and the modes tuned above it, a fifth and an
# octave, dying sooner; a low thump of the membrane under the note, gone in a tenth of a second; the felt's soft touch. Nothing rings
# after it but the room
def timp(m, s, g=1.0, pan=0.0, ring=2.4, room=0.35):
    f = hz(m); sec = ring * 1.3 + 0.3; x = tt(sec).astype(np.float64)
    sig = np.sin(2 * np.pi * f * x) * np.exp(-x / ring)
    for r, a_, d in ((1.5, 0.42, 0.55), (2.0, 0.20, 0.4)):
        sig = sig + a_ * np.sin(2 * np.pi * f * r * x + r) * np.exp(-x / (ring * d))
    sig = sig + 0.10 * np.sin(2 * np.pi * f * 2.5 * x) * np.exp(-x / 0.15) + 0.45 * np.sin(2 * np.pi * f * 0.62 * x) * np.exp(-x / 0.1)
    nt = int(0.04 * SR); sig[:nt] += filt(noise(0.04)[:nt], 'low', 600) * np.exp(-np.arange(nt) / SR / 0.008) * 0.12
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.007)) ** 2 * np.cos(0.5 * np.pi * np.clip((x - sec + 0.2) / 0.2, 0, 1)) ** 2
    put(_held(filt(sig.astype(np.float32), 'low', 1400), room), s, g * TL, pan)
def drum(t, g, pan):
    """one stroke of the urgent pulse: the low drum, short and quiet"""
    timp(D2, t, g, pan, ring=1.1)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card or a pill set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a light, a tick"""
    s_tap(s, g * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: the sea, something moving across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def paper(s, g=0.011, pan=0.0, sec=0.4):
    """parchment or a card laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=0.7, g=0.007, pan=0.0):
    """a marker on the board: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def strike(s, g=0.009, pan=0.0, sec=0.4):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def stamp(s, g=0.016, pan=0.0):
    """a seal pressed into wax: a low knock and the soft slap of the matrix"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def lock(s, g=0.010, pan=0.0):
    """a lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.011, pan=0.0):
    """a switch: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def shut(s, g=0.018, pan=0.0):
    """a heavy wooden door meeting its frame"""
    s_knock(s, g * FX, pan, 120); s_knock(s + 0.02, g * 0.5 * FX, pan, 190)
def slide(s, g=0.009, pan=0.0, sec=0.5):
    """a slab of glass slid into place: a soft brush, and its small stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2 * np.exp(-x / sec), s, g * FX, pan)
    s_knock(s + sec * 0.85, g * 0.5 * FX, pan, 330)
def crack(s, g=0.010, pan=0.0):
    """glass cracking, softly: a low knock and a short, dry split"""
    s_knock(s, g * FX, pan, 260); x = tt(0.18); X(filt(noise(0.18), 'band', (400, 1600))[:len(x)] * np.exp(-x / 0.03), s + 0.01, g * 0.7 * FX, pan)

# =============================================================================================================================
# 1. Few gates: Ragusa, 1370s, with music all through it. The walls' weight: the low drum as the city comes in, and the douçaine's
#    first line, D Dorian, left open on E. Its gates light in turn: the mark, D, F, A, one note each. Ships come in on the sea's air.
#    More than goods: A to B flat, the plague's flat sixth. 1348: the low drum, and a line falling to A. Nobody could tell: A rising
#    to E, a question. Shut: the door meets its frame on the low drum, and the ship leaves. Open: the sickness drifts in under B flat
#    falling to A. Something has to change: the line rises to G, open, and the high drum
GA = lambda lid, word, off=0: W('gates', lid, word, off)
g0 = S0('gates')
air(g0 + 0.2, 2.6, 0.008, px(1500), 140, 700)
timp(D2, g0 + 0.4, 0.75, -0.05, ring=2.8)
phrase(((A3, 1.1), (D4, 0.55), (E4, 0.5), (F4, 0.85), (E4, 1.9)), g0 + 0.7, 0.8, px(900))
tW = GA('republic', 'behind high')
gates([tW + 0.5, tW + 1.2, tW + 1.9], tW + 2.6, 0.75, px(1000))
air(GA('trade', 'its ships', -0.4), 2.2, 0.008, px(1700), 140, 650)
tM = GA('more', 'more than', 0.2)
phrase(((A3, 0.5), (Bb3, 1.8)), tM, 0.75, px(1500))
tP = GA('plague', 'thirteen forty-eight')
timp(D2, tP + 0.05, 0.85, px(1100), ring=2.6)
phrase(((D4, 0.45), (C4, 0.45), (Bb3, 0.5), (A3, 1.8)), tP + 0.35, 0.75, px(900))
tQ = GA('tell', 'nobody could')
phrase(((A3, 0.5), (E4, 1.7)), tQ, 0.7, px(945))
tSh = GA('shut', 'Shut')
shut(tSh + 0.9, 0.018, px(945))
timp(D2, tSh + 0.9, 0.9, px(945), ring=2.8)
air(tSh + 0.4, 2.2, 0.008, px(1800), 140, 650)
tO = GA('open', 'Leave it')
air(tO + 0.1, 1.2, 0.007, px(945), 120, 600)
phrase(((Bb3, 2.4), (A3, 1.8)), GA('open', 'walks in', -0.3), 0.7, px(1100))
tC = GA('change', 'The city')
phrase(((D4, 0.45), (E4, 0.45), (F4, 0.55), (G4, 1.9)), tC, 0.8, 0.0)
timp(A2, tC + 1.45, 0.6, 0.1, ring=2.6)

# 2. A month apart: the Great Council's hall, the high drum and a line in F, rising to A. The law written and sealed: the parchment,
#    the seal. The law's card set down. The map: the ship's line to the islet on a breath; a month of moons, a note for each, D, E, F,
#    G; on to the gate, green: A, open. Whoever goes stays the month too: its card. The officers' lanterns: A, C, D. The port open
#    again: ships on the sea's air, F major rising to C. The sickness held on the island: the low drum and A held. The first known
#    law: D leaping to A. Forty days: its card. The same problem in the university's hall: the high drum and D held; people and jobs
#    on a breath; whoever breaks in, the low drum. A few doors, each with a rule, and a place apart: the mark, D, F, A, as the rings
#    light and the place apart opens; then, under the title, the mark again, and E left open
AP = lambda lid, word, off=0: W('apart', lid, word, off)
a0 = S0('apart')
timp(A2, a0 + 0.3, 0.6, 0.0, ring=2.6)
phrase(((F4, 0.4), (G4, 0.4), (A4, 1.7)), a0 + 0.35, 0.7, px(960))
tPs = AP('council', 'passed')
paper(tPs - 0.5, 0.010, px(940), 0.5)
stamp(tPs + 1.0, 0.016, px(1180))
knock(AP('month', 'Anyone', 0.05), 0.012, px(960), 240)
tTh = AP('then', 'Only then')
air(tTh, 1.4, 0.007, px(980), 160, 800)
for k, m in enumerate((D4, E4, F4, G4)):
    douc(m, tTh + 1.0 + 0.55 * k, tTh + 1.55 + 0.55 * k, 0.6, pan=px(1100 + 62 * k))
douc(A4, AP('then', 'enter', 2.0), AP('then', 'enter', 3.6), 0.7, rel=0.45, pan=px(800))
knock(AP('noone', 'stays the month', -0.4), 0.012, px(1410), 240)
tOf = AP('officers', 'health officers')
phrase(((A3, 0.4), (C4, 0.4), (D4, 1.6)), tOf + 0.1, 0.7, px(1300))
tPo = AP('port', 'The port')
air(tPo - 0.2, 2.6, 0.008, px(1600), 140, 650)
phrase(((F4, 0.42), (A4, 0.42), (C5, 1.6)), tPo + 0.3, 0.65, px(1400))
tIs = AP('island', 'held on')
timp(D2, tIs + 0.1, 0.65, px(1270), ring=2.6)
douc(A3, tIs + 0.15, tIs + 2.4, 0.6, rel=0.5, pan=px(1270))
tF = AP('first', 'the first')
phrase(((D4, 0.5), (A4, 1.8)), tF + 0.05, 0.7, 0.0)
knock(AP('forty', 'forty days', 0.4), 0.012, 0.0, 240)
tS = AP('same', "The university's")
timp(A2, tS - 0.3, 0.6, 0.0, ring=2.6)
douc(D4, tS - 0.25, tS + 1.6, 0.55, rel=0.5, pan=0.0)
air(AP('same', 'people and jobs', -0.2), 2.4, 0.007, px(300), 160, 800)
timp(D2, AP('same', 'whoever breaks', 0.1), 0.5, px(300), ring=2.0)
tD = AP('needs', 'a few doors')
gates([tD + 0.2, tD + 0.7, AP('needs', 'a place apart')], AP('needs', 'a place apart', 0.7), 0.7, 0.0)
tT = G('apart', 'breath', 0.4)
timp(D2, tT, 0.8, -0.1, ring=2.8); timp(A2, tT + 1.2, 0.6, 0.1, ring=2.6)
gates([tT + 0.1, tT + 0.6, tT + 1.1], tT + 1.6, 0.8, 0.0, hold=2.4)

# 3. If someone got in: Jun's token struck through. Sam asks what an attacker would: the urgent pulse, the low drum, slow and quiet,
#    while the question stands and the door is shown open to anyone. Each area lit: a tap. The way past the catalog, and data sent
#    anywhere: a breath. The copies set down; the provider's key: a lock. The intruder walks the block: the pulse again, and the
#    copies crack
IN = lambda lid, word, off=0: W('inside', lid, word, off)
strike(IN('token', 'no longer', 0.25), 0.009, px(890))
tAt = IN('asks', 'what an attacker')
pulse(tAt - 0.1, IN('door', 'open internet', 0.4), 46, [(0, drum, 0.55, -0.05)], 1.0, 1.6)
for w_, x_ in (("registrar's", 591), ('learning', 763), ('planning', 935), ('HR', 1107), ('finance', 1279)):
    tap(IN('areas', w_, 0.0), 0.008, px(x_))
air(IN('files', 'past the catalog', 0.0), 0.9, 0.007, px(930), 160, 800)
air(IN('out', 'Data can', 0.2), 1.2, 0.008, px(400), 180, 900)
knock(IN('backups', 'The backups', 0.0), 0.012, px(1290), 260)
lock(IN('key', "the data's key", 0.3), 0.010, px(240))
tWk = IN('key', "can't take", 0.6)
pulse(tWk - 0.1, tWk + 3.0, 46, [(0, drum, 0.6, 0.0)], 1.0, 1.0)
crack(tWk + 2.6, 0.010, px(1290))

# 4. Who secures what: Sam's marker, once for each row. Its data, always: a card. The map: one breath as the areas come, one knock as
#    the owners are named; Who decides, its card. Walls rise along the areas' edges: the two drums, the walls' weight; each request
#    checked, a tap; a mistake stays where it started: D, F, and E left open
WH = lambda lid, word, off=0: W('who', lid, word, off)
for lid, w_ in (('cloud', 'The cloud'), ('makers', "The platform's"), ('rest', 'The university')):
    pencil(WH(lid, w_, 0.05), 0.7, 0.006, px(700))
knock(WH('contract', 'the data is', 0.05), 0.012, px(452), 260)
air(WH('map', 'the areas', -0.2), 1.2, 0.007, px(960), 160, 800)
knock(WH('map', 'the owner', 0.1), 0.011, px(960), 240)
knock(WH('map', 'Who decides', 0.05), 0.012, px(1400), 240)
tWl = WH('trusted', 'A wall', 0.3)
timp(A2, tWl, 0.6, -0.1, ring=2.6); timp(D2, tWl + 1.6, 0.6, 0.1, ring=2.6)
for i in range(5):
    tap(WH('trusted', 'still checked', -0.6 + 0.9 * i + 0.8), 0.007, px(591 + 172 * i))
tSt = WH('small', 'where it started')
phrase(((D4, 0.45), (F4, 0.5), (E4, 1.8)), tSt - 0.2, 0.65, px(1107))

# 5. Few doors: the platform's door shuts on the low drum; the private path opens on a breath; the way out cut, struck; the short list,
#    its card. The catalog, the files' only door: D leaping to A, and a tap for each request. The back door shut: the high drum. An
#    admin switched on: a click. Ragusa's walls, its three gates lit with an officer at each: the mark, and E left open
DO = lambda lid, word, off=0: W('doors', lid, word, off)
tOff = DO('internet', 'comes off', 1.15)
shut(tOff, 0.016, px(470)); timp(D2, tOff, 0.75, px(470), ring=2.6)
air(DO('internet', 'private path', 0.0), 1.4, 0.007, px(1600), 160, 800)
strike(DO('out', 'the way out', 1.0), 0.009, px(400))
knock(DO('out', 'short list'), 0.012, px(240), 240)
tCt = DO('catalog', 'the catalog', 0.2)
phrase(((D4, 0.5), (A4, 1.7)), tCt, 0.65, px(950))
for k in range(3):
    tap(DO('catalog', 'checks every', -0.4 + 1.3 * k + 0.3), 0.007, px(1060))
tBk = DO('back', 'stays shut')
timp(A2, tBk + 0.1, 0.6, px(1132), ring=2.4); knock(tBk + 0.1, 0.012, px(1132), 200)
click(DO('admin', 'switched on', -0.2), 0.010, px(1132))
tLk = DO('like', "Like Ragusa's")
timp(D2, tLk - 0.2, 0.55, 0.0, ring=2.6)
gates([tLk + 0.4, tLk + 0.8, tLk + 1.2], DO('like', 'a rule', 0.2), 0.7, px(1000))

# 6. Rooms apart: one workspace becomes three, on a breath. People's work set down in development, the change in test, the nightly
#    job and its records in production. Each room's own data: a breath. A mistake in development: the low drum, softly. One reviewed
#    path, one note as it reaches each room: D, E, F. Its card. The islet off Ragusa: the ship's line on a breath, a month of moons,
#    D, E, F, G; through the gate, green: A, open
RO = lambda lid, word, off=0: W('rooms', lid, word, off)
air(RO('three', 'becomes three', 0.3), 2.2, 0.008, 0.0, 160, 900)
paper(RO('try', 'try new', 0.1), 0.009, px(620), 0.35)
paper(RO('try', 'in test', 0.1), 0.009, px(930), 0.35)
knock(RO('prod', 'the real records', 0.1), 0.011, px(1240), 260)
air(RO('own', 'Each reaches', 0.1), 1.0, 0.006, 0.0, 180, 900)
timp(D2, RO('mistake', 'a mistake', 0.1), 0.4, px(640), ring=2.0)
tPa = RO('path', 'one reviewed')
phrase(((D4, 0.8), (E4, 0.8), (F4, 1.6)), tPa + 0.2, 0.65, 0.0)
knock(RO('path', 'From a branch', 0.05), 0.012, px(1634), 240)
tIl = RO('islet', 'Like the islet')
air(tIl + 0.2, 1.0, 0.007, px(980), 160, 800)
for k, m in enumerate((D4, E4, F4, G4)):
    douc(m, tIl + 1.0 + 0.4 * k, tIl + 1.4 + 0.4 * k, 0.55, pan=px(1040 + 62 * k))
douc(A4, RO('islet', 'through the gate', 0.4), RO('islet', 'through the gate', 2.2), 0.65, rel=0.45, pan=px(700))

# 7. Keys you can see: the frost of encryption, a breath; a request that may read, its tick. The key leaves the provider for the
#    university's vault: A, D, F, and E left open as it settles. Open, and back: a tap. Can't delete: its pill. Taken back: the low
#    drum and the vault's lock. Every use recorded: a tap for each line. A deleted key kept ninety days: its card. Ragusa at night:
#    the gate shuts on the low drum, the keys lifted; up the street, the palace door closes; everyone knew who held them: D to A
KE = lambda lid, word, off=0: W('keys', lid, word, off)
air(KE('encrypted', 'encrypted', 0.0), 1.2, 0.007, px(930), 180, 900)
tap(KE('encrypted', 'unreadable', 0.5), 0.008, px(1330))
tOw = KE('own', "the university's own", 0.2)
phrase(((A3, 0.6), (D4, 0.6), (F4, 0.8), (E4, 1.8)), tOw + 0.1, 0.65, px(1300))
tap(KE('use', 'may use', 1.2), 0.008, px(1450))
knock(KE('use', "can't delete"), 0.012, px(1680), 240)
tTb = KE('back', 'take it back', 0.6)
timp(D2, tTb, 0.6, px(1680), ring=2.4); lock(tTb + 0.05, 0.011, px(1680))
for i in range(3):
    tap(KE('lose', 'every use', 0.2 + 0.35 * i), 0.007, px(1600))
knock(KE('lose', 'ninety days', -0.2), 0.012, px(1600), 240)
tSh7 = KE('rector', 'shut each')
shut(tSh7 + 0.9, 0.016, px(945)); timp(D2, tSh7 + 0.9, 0.7, px(945), ring=2.8)
tap(tSh7 + 1.0, 0.007, px(1060)); tap(tSh7 + 1.12, 0.006, px(1060))
knock(KE('rector', 'until morning', 1.4), 0.011, px(960), 180)
phrase(((D4, 0.6), (A4, 2.0)), KE('knew', 'Everyone', -0.3), 0.6, 0.0)

# 8. Copies nobody can delete: the attacker's first move, the copies struck through as one soft sound; the data locked: the high drum
#    and a lock. Its card. Every night a copy slides to the place apart; each one locked. Not even an admin: a knock. Once a month,
#    one restored and checked: A to D, the proof. The lock cuts both ways: its pill; Deleted means deleted: its card
CO = lambda lid, word, off=0: W('copies', lid, word, off)
strike(CO('first', 'deletes the backups', 0.3), 0.009, px(1236), 1.2)
tLo = CO('first', 'locks the data', 0.3)
timp(A2, tLo, 0.55, px(1236), ring=2.4); lock(tLo + 0.05, 0.011, px(1236))
knock(CO('first', 'asks for money', 1.6), 0.012, px(1680), 240)
air(CO('night', 'every night'), 1.0, 0.006, px(1698), 180, 900)
for k in range(3):
    slide(CO('night', 'every night', 0.8 + k * (3.2 if k < 2 else 2.6) + 1.4), 0.008, px(1624))
for k in range(3):
    lock(CO('locked', 'locked for', k * 1.6 + 0.2), 0.008, px(1624))
knock(CO('locked', 'not even', -0.2), 0.011, px(1792), 220)
slide(CO('restore', 'restores one', 0.6), 0.008, px(1400))
phrase(((A3, 0.6), (D4, 2.0)), CO('restore', 'restores one', 2.0), 0.6, px(1286))
knock(CO('ways', 'deleted early', -0.4), 0.011, px(1698), 220)
knock(CO('ways', 'Deleted means'), 0.012, px(1276), 240)

# 9. The walk again: no door to find, a knock; a stolen way in, a breath, and its one request ticked. Each way it tries, stopped: a
#    knock for each. Ragusa at dawn, open to the world: the low drum, and the mark as its gates light, E left open; ships come in on
#    the sea's air. The university's data open to those who need it: a breath along the corridor. Few doors, each with a lock you
#    can see: the mark, D, F, G, A, and E left open over both drums
AG = lambda lid, word, off=0: W('again', lid, word, off)
knock(AG('nodoor', 'no door'), 0.012, px(330), 200)
air(AG('stolen', 'With a stolen', 0.0), 1.0, 0.006, px(1520), 180, 900)
tap(AG('stolen', "catalog's checks", -0.6 + 0.5), 0.008, px(1328))
for lid_w, x_ in ((('no', 'No back door'), 1132), (('no', 'nowhere to send'), 300), (('no', 'no key'), 1680), (('no', 'no copy'), 1698)):
    knock(AG(*lid_w), 0.011, px(x_), 200)
tRg = AG('ragusa', 'Ragusa stayed')
timp(D2, tRg - 0.3, 0.6, 0.0, ring=2.8)
gates([tRg + 0.2, tRg + 0.7, tRg + 1.2], AG('ragusa', 'a few gates', 0.4), 0.7, px(1000))
air(tRg + 0.6, 2.4, 0.008, px(1700), 140, 650)
air(AG('open', 'stays open', 0.0), 1.4, 0.007, px(1600), 160, 800)
tEnd = AG('few', 'Few doors', 0.2)
timp(D2, tEnd, 0.75, -0.1, ring=3.0)
phrase(((D4, 0.5), (F4, 0.5), (G4, 0.5), (A4, 0.9)), tEnd + 0.05, 0.75, 0.0)
douc(E4, tEnd + 2.45, min(E('again') - 0.6, tEnd + 5.6), 0.75, rel=0.9, pan=0.0)
timp(A2, tEnd + 2.4, 0.6, 0.1, ring=3.0)
