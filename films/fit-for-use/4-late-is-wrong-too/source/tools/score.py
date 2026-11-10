# Late is wrong too: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the module's setup thread on 5 November 2026 after it checked every score.py on main
# (/mnt/project-files/data-quality/palettes.md, where this film's thread took the partner on 10 November 2026, after searching every
# score.py and music.py on main and on every branch, and every palettes.md in the project files: no ice anywhere). Made here; music.py
# has none.
#  - The lead, ice bells: small bells cut from blocks of ice and struck softly with felt. They sound only while they're frozen. A soft
#    start (the felt on wet ice, a short thock), a clear, round ring with its octave and twelfth, a glint above them that's gone in a
#    few hundredths of a second, and a short ring: ice holds a note for less than glass or metal. Nothing above 2.3 kHz.
#  - The partner, large ice bells: a second set, larger and lower (F 2 to F 3), cut from the biggest blocks, struck once with a
#    soft beater and left to ring out. They're the people's side: under a chapter's turn, under what's agreed, and under the opening.
#    A second set of the lead, as films 1, 5, 7 and 8 chose, because every soft colour the site lacks is taken or sounds like one it
#    has. Never two bells on one pitch a little apart, so nothing beats.
#  - The mark: one bell, the student system's, D 5: struck clear when its night's file comes, then the same bell struck again later,
#    duller, its ring short and its glint gone, like ice that has begun to melt: the same file, a day old. In the opening (the night's
#    file, then the list built without it), in chapter 2 (the file of the night before), as the two sources' ages in chapter 5 (the
#    student system's, dull; the portal's own bell, B-flat 4, clear) and, at the end, the other way round: dull while the send waits,
#    clear when the list is fresh.
#  - B-flat major for the coast and the programme, the list in time and the end; G minor for the late night and the problem; E-flat
#    major for people; F major where something has to change, before B-flat. Just intonation from B-flat (see hz()), so nothing beats;
#    no C held with E-flat or G: those aren't pure in this table.
# The rules every film of the module keeps (palettes.md, 5 November 2026):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles or beats: no vibrato, no tremolo, no ostinato. One urgent pulse, in Thirty hours only (film.json's "urgent"):
#    Thursday morning, the file thirty hours late and the printer due at five, until Sam sees the late tables; low and muted, leaning on
#    the semitone for an error, and no bell while it plays (it is tuned equally, the bells justly). No figure played again and again.
#    Nothing Bengali and no sirens for the cyclone warnings; no megaphone's sound.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (23 names ticked, a row of
#    figures) is one soft sound, never one for each. Nothing where the harm is told: the toll of 1970 is heard in silence.
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
R1 = np.random.default_rng(1970)  # this film's own randomness: the room, the felt, the air

# ---- tuning: just intonation from B-flat, so a chord's notes are whole-number ratios of each other and nothing beats. B-flat major
# (B-flat D F), E-flat major (E-flat G B-flat), F major (F A C), G minor (G B-flat D) and D minor (D F A) are pure in this table; C with
# E-flat or with G is not (32/27 and 40/27), so C sounds only with F or A
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (46, 116.541)  # B-flat 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
F2, G2, Bb2, D3, Eb3, F3 = 41, 43, 46, 50, 51, 53
Bb3, D4, Eb4, F4, G4, A4, Bb4, C5, D5, F5 = 58, 62, 63, 65, 67, 69, 70, 72, 74, 77
SIS, PORTAL = D5, Bb4   # the student system's bell, and the portal's

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the large bells a little under the small; the effects well under
# the music (FX scales them all)
IL, BL, FX = 0.075, 0.062, 1.4

# a room round the bells: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what it
# rings where the notes are (its gain under 1.5 kHz is one), and each note is set back to its own level after it (_held), as the
# video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
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

def _bell(f, parts, tau, att, thock, band, top):
    """a struck bell of ice: each partial (ratio, level, how long it rings against the first) dying away on its own, a soft start
    from the felt, and the felt's short thock on the wet surface; nothing above top"""
    sec = 6 * tau + 0.15; x = tt(sec).astype(np.float64); sig = np.zeros_like(x)
    for r, a, d in parts:
        if f * r < top and a > 0:
            sig += a * np.exp(-x / (tau * d)) * np.sin(2 * np.pi * f * r * x + 0.7 * r)
    sig *= np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2
    nt = int(0.035 * SR); sig[:nt] += filt(R1.standard_normal(nt).astype(np.float32), 'band', band) * np.exp(-np.arange(nt) / SR / 0.007) * thock
    sig *= np.cos(0.5 * np.pi * np.clip((x - sec + 0.12) / 0.12, 0, 1)) ** 2
    return filt(sig.astype(np.float32), 'low', top + 100)

# ---- a small ice bell, struck softly with felt: a clear, round ring with its octave and twelfth, a glint above them gone within a
# few hundredths of a second, and a short ring. dull: the same bell later, as ice that has begun to melt: its ring shorter, its upper
# partials and glint mostly gone, a softer start; the pitch doesn't move
def ice(m, s, g=1.0, pan=0.0, ring=None, dull=0.0, room=0.26):
    f = hz(m); tau = (ring or 0.5 * (466.0 / f) ** 0.35) * (1 - 0.45 * dull)
    parts = ((1.0, 1.0, 1.0), (2.0, 0.45 * (1 - 0.8 * dull), 0.42), (3.0, 0.16 * (1 - 0.9 * dull), 0.24), (4.16, 0.06 * (1 - dull), 0.07))
    sig = _bell(f, parts, tau, 0.006 + 0.012 * dull, 0.05 * (1 - 0.5 * dull), (300, 1400) if not dull else (220, 900), 2300)
    put(_held(sig, room), s, g * IL * (1 - 0.15 * dull), pan)
def roll(notes, s, step=0.16, g=1.0, pan=0.0, spread=0.4, ring=None):
    """small bells struck one after another, the lowest first, ringing on together"""
    k = len(notes)
    for i, m in enumerate(notes):
        ice(m, s + step * i, g * (1.0 if i == 0 else 0.85) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5), ring)

# ---- a large ice bell: the same ice, lower, cut from the biggest blocks, struck once with a soft beater and left to ring out. A
# rounder start, a low thump in the felt, its octave and twelfth soft, nothing above 1.6 kHz
def big(m, s, g=1.0, pan=0.0, ring=1.2, room=0.3):
    f = hz(m)
    sig = _bell(f, ((1.0, 1.0, 1.0), (2.0, 0.26, 0.5), (3.0, 0.08, 0.3)), ring, 0.014, 0.06, (110, 520), 1500)
    put(_held(sig, room), s, g * BL, pan)

# ---- the mark: the student system's bell struck clear, then the same bell struck again later, duller
def clear(s, g=1.0, pan=0.0, m=SIS):
    ice(m, s, g, pan, ring=0.55)
def dull(s, g=1.0, pan=0.0, m=SIS):
    ice(m, s, g, pan, ring=0.55, dull=1.0)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=230):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap: a tag, a chip, a row lit"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.011, pan=0.0, sec=0.4):
    """a sheet laid down: a page, a file"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 1700), 4)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, a flag rising, a clock's hands"""
    s_air(s, sec, g * FX, pan, lo, hi)
def water(s, sec=4.6, g=0.012, pan=0.0):
    """the surge: a low swell of water coming in and going over, no wind howl, nothing above 500 Hz"""
    x = tt(sec); X(filt(noise(sec), 'band', (55, 480))[:len(x)] * np.sin(0.5 * np.pi * np.minimum(1, x / (0.45 * sec))) ** 2 * np.cos(0.5 * np.pi * np.clip((x - 0.7 * sec) / (0.3 * sec), 0, 1)) ** 2, s, g * FX, pan)
def ticks(s, sec=1.8, g=0.007, pan=0.0):
    """names ticked one after another down a list: one soft texture of pencil on paper that swells in and fades, not a tick for each"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1600), 4)[:len(x)] * np.sin(np.pi * x / sec) ** 2 * (0.75 + 0.25 * np.sin(2 * np.pi * 3.0 * x)), s, g * FX, pan)

# =============================================================================================================================
# 1. The last mile: the opening, with music all through it.
#    November 1970: B-flat major, a large bell and the small ones rising as the camera settles on the coast. The families: E-flat. The
#    cyclone, with the high tide: G minor. The radio's great danger signal: one high bell, F; it meant little there: D minor, low. Most
#    knew, almost nobody took shelter: G minor. The surge: the water comes in over a large low G, and the toll is heard in silence.
#    "Something has to change": F major. 1972, the programme: B-flat major. The volunteers carry the warning the last mile: E-flat; they
#    lead people to the shelters: F. The flags rise, one, two, three, a bell for each, and the whole village reads them: B-flat. 2007,
#    Sidr: G minor, then low tide; warnings for days: E-flat; the volunteers and the shelters: B-flat; still too many, one for every
#    hundred: a single bell. The bench: the student system's bell clear as its file appears, then, as the list is built without it,
#    the same bell, duller: the mark. Every check passes, 23 missing: D minor. Someone notices in time: the bell clear again, B-flat.
#    The title card: B-flat major, the large B-flat under it
O = lambda lid, word, off=0: W('story', lid, word, off)
o0 = S0('story')
big(Bb2, o0 + 0.3, 0.85, ring=1.6)
ice(D4, o0 + 1.3, 0.7, -0.2); ice(F4, o0 + 1.85, 0.7, 0.0); ice(Bb4, o0 + 2.5, 0.75, 0.2, ring=0.7)
# the families on the low islands: E-flat
tF = O('islands', 'families', -0.2)
big(Eb3, tF, 0.7); ice(G4, tF + 0.45, 0.6, 0.25)
ice(Bb4, O('islands', 'great rivers', 0.0), 0.5, -0.2)
# a cyclone comes ashore, with the high tide: G minor
tC = O('ashore', 'a cyclone', -0.1)
big(G2, tC, 0.8, ring=1.4); ice(Bb3, tC + 0.5, 0.55, -0.15); ice(D4, O('ashore', 'high tide', 0.0), 0.5, 0.15)
# the radio's great danger signal: one high bell as its card comes in; it meant little there: D minor, low
tR = O('radio', 'the radio', 0.0)
knock(tR, 0.012, px(1490)); ice(F5, O('radio', 'great danger signal', 0.0), 0.55, px(1490), ring=0.7)
knock(G('story', 'little', 0.2), 0.012, px(1490))
tL = O('little', 'signal number one', 0.0)
big(D3, tL - 0.3, 0.6); ice(A4, tL + 0.2, 0.45, 0.2)
# most knew a storm was coming; almost nobody took shelter: G minor
knock(O('stay', 'know a storm', -0.2), 0.012, px(450))
tN = O('stay', 'almost nobody', 0.0)
tap(tN, 0.009, px(450)); big(G2, tN - 0.1, 0.7); ice(G4, tN + 0.3, 0.5, -0.3)
# the surge: the water comes in over a large low G, then the toll, in silence
water(G('story', 'surge', -0.2), 4.8, 0.012, 0.0)
big(G2, G('story', 'surge', 0.1), 0.7, ring=1.6)
# a warning people can't read is no warning: its card; "Something has to change": F major, the turn to the programme
knock(G('story', 'after', 0.0), 0.012, px(500))
tS = O('after', 'Something', 0.0)
tap(tS, 0.008, px(330)); big(F2, tS - 0.1, 0.75); ice(A4, tS + 0.35, 0.5, -0.2); ice(C5, tS + 0.85, 0.5, 0.2)
# 1972, the programme: B-flat major, by day
tP = G('story', 'cpp', -0.3)
big(Bb2, tP, 0.8, ring=1.5); ice(F4, tP + 0.5, 0.6, -0.25); ice(Bb4, tP + 1.0, 0.6, 0.0); ice(D5, tP + 1.5, 0.55, 0.25, ring=0.7)
knock(G('story', 'cpp', 0.3), 0.012, px(530))
# the volunteers carry each warning the last mile: E-flat; they lead people to the shelters: F
tV = O('mile', 'Volunteers', 0.0)
big(Eb3, tV - 0.1, 0.65); ice(Eb4, tV + 0.4, 0.5, -0.3)
tap(O('mile', 'the last mile', 0.0), 0.008, px(250)); ice(G4, O('mile', 'the last mile', 0.1), 0.5, -0.1)
tLd = O('house', 'lead people', 0.0)
air(tLd, 1.2, 0.006, px(1200), 150, 700); big(F3, tLd, 0.55); ice(C5, tLd + 0.4, 0.45, 0.3)
# the flags rise, one, two, three, a bell for each; a signal the whole village can read: B-flat
for w_, m in (('one', Bb4), ('two', D5), ('three', F5)):
    t_ = O('flags', w_, 0.0); air(t_ - 0.1, 0.7, 0.007, px(640), 200, 1000); ice(m, t_, 0.55, px(640) + 0.15, ring=0.7)
tW = O('flags', 'a signal', 0.0)
knock(tW, 0.012, px(1490)); big(Bb2, tW, 0.75, ring=1.5); ice(Bb3, tW + 0.45, 0.5, 0.3)
# 2007, Sidr: G minor; at low tide, a little light
tSd = G('story', 'sidr', -0.3)
big(G2, tSd, 0.75, ring=1.4); ice(D4, O('sidr', 'Cyclone Sidr', 0.0), 0.5, -0.2)
knock(G('story', 'sidr', 0.4), 0.012, px(360))
ice(Bb4, O('sidr', 'low tide', 0.0), 0.45, 0.2)
# warnings for days, the highest signal since the day before: E-flat
knock(G('story', 'ahead', 0.0), 0.012, px(360))
tH = O('ahead', 'the highest signal', 0.0)
big(Eb3, tH - 0.1, 0.65); ice(G4, tH + 0.35, 0.5, -0.2); ice(Eb4, tH + 0.9, 0.45, 0.2)
# 40,000 volunteers, 1.5 million in shelters: B-flat
knock(G('story', 'shelter', 0.0), 0.012, px(360))
tM = O('shelter', 'a million', 0.0)
tap(tM, 0.008, px(360)); big(Bb2, tM - 0.1, 0.7); ice(F4, tM + 0.35, 0.5, -0.25); ice(D5, tM + 0.8, 0.45, 0.25)
# about 3,400 died: still too many; one for every hundred: a single bell
knock(G('story', 'died', 0.0), 0.012, px(360))
tap(O('died', 'still too many', 0.0), 0.008, px(360))
tE1 = O('died', 'one for every hundred', 0.0)
tap(tE1, 0.008, px(360)); ice(Bb4, tE1 + 0.1, 0.45, 0.0, ring=0.7)
# the bench at night: the student system, its file and the list, the last mile between them; the student system's bell clear as its
# file appears; the file doesn't come; the list is built without it: the same bell, duller (the mark)
tD = G('story', 'data', -0.1)
knock(tD, 0.012, px(300)); big(F2, tD - 0.2, 0.6)
paper(G('story', 'data', 0.3), 0.010, px(760), 0.35); clear(G('story', 'data', 0.3), 0.75, px(760))
knock(G('story', 'data', 0.6), 0.012, px(1350))
tap(O('data', 'last mile', -0.1), 0.007, px(765))
air(O('june', "doesn't come", 0.0), 0.7, 0.006, px(760), 150, 700)
tB = O('june', 'built without it', 0.0)
dull(tB, 0.8, px(760)); big(G2, tB + 0.05, 0.55)
# every check passes; 23 missing: D minor; nothing says so
tap(G('story', 'passed', 0.2), 0.009, px(1100))
t23 = O('passed', 'Twenty-three', 0.0)
air(t23, 0.8, 0.006, px(1350), 150, 700); big(D3, t23 - 0.1, 0.55); ice(A4, t23 + 0.4, 0.4, 0.25)
tap(O('passed', 'nothing says so', 0.0), 0.008, px(1300))
# by day: someone notices in time, the bell clear; all 23 on the list: B-flat
tNo = O('heard', 'notices', 0.0)
tap(tNo + 0.3, 0.008, px(1760)); clear(tNo, 0.7, px(760))
tA = O('heard', 'all twenty-three', 0.0)
tap(tA, 0.009, px(1100)); big(Bb2, tA - 0.1, 0.6)
# the title card: B-flat major, the large B-flat under it
tT = G('story', 'breath', 0.25)
roll((Bb3, F4, Bb4, D5), tT, 0.2, 0.8, ring=0.8); big(Bb2, tT + 0.1, 0.75, ring=1.6)

# 2. Every check green: the night's bench, a large low G as the chapter turns. Each night at two the file comes: the student system's
#    bell, clear. The list built at three; Wednesday, the file doesn't come; at three the list is built from the file of the night
#    before: the same bell, duller, over the large G. Every check passes; the boards' lists, a day old too; 23 missing: D minor, low.
#    Late data looks complete: in the pause after it, E-flat, as if nothing were wrong; the lens finds nothing to see
N = lambda lid, word, off=0: W('green', lid, word, off)
n0 = S0('green')
big(G2, n0 + 0.4, 0.7, ring=1.4)
knock(n0 + 0.6, 0.012, px(340))
tFi = N('night', 'nightly file', 0.0)
paper(tFi, 0.010, px(280), 0.35); clear(tFi, 0.7, px(280))
air(G('green', 'build', 0.0), 1.0, 0.006, px(810), 150, 700); knock(G('green', 'build', 0.5), 0.012, px(1490))
tap(N('wed', 'Wednesday night', 0.0), 0.008, px(960))
air(N('wed', "didn't come", 0.0), 0.7, 0.006, px(280), 150, 700)
tap(N('wed', 'a full disk', 0.0), 0.008, px(400))
air(G('green', 'anyway', 0.0), 1.2, 0.006, px(1760), 160, 800)
tBf = N('anyway', 'the file of the night before', 0.0)
air(tBf, 1.0, 0.006, px(810), 150, 700); dull(tBf + 0.1, 0.8, px(280)); big(G2, tBf + 0.15, 0.55)
tap(G('green', 'green', 0.0), 0.008, px(1490)); tap(G('green', 'green', 0.7), 0.009, px(1300))
knock(N('boards', "the boards' own lists", 0.0), 0.012, px(870))
tap(N('boards', 'passed', 0.0), 0.009, px(1300)); tap(N('boards', 'a day old', 0.0), 0.008, px(700))
tMi = G('green', 'missing', 0.2)
air(tMi, 0.9, 0.006, px(1490), 150, 700); big(D3, tMi - 0.1, 0.6); ice(F4, tMi + 0.45, 0.45, 0.2)
knock(G('green', 'looks', 0.0), 0.012, px(870))
tLk = END('green', 'looks') + 0.3
big(Eb3, tLk, 0.55); ice(G4, tLk + 0.4, 0.45, -0.2); ice(Bb4, tLk + 0.9, 0.4, 0.2)
air(G('green', 'see', 0.2), 2.2, 0.005, px(1480), 160, 700)
tap(N('see', 'None can see', 0.0), 0.009, px(300))

# 3. Thirty hours: Thursday, eight in the morning, the printer due at five: the one urgent pulse, low and muted, until Sam sees the
#    student system's tables late. dbt's check: thirty hours old, the student system's bell, dull, over a large low G. The level there
#    was: set by the builders, agreed with nobody, never run at night; a signal nobody understands: the radio's high bell again, F,
#    over D minor. Malia holds the send. The file comes at 11:40: the bell clear; 712. The 23 new names checked, one soft texture; the
#    list goes at 3:20: B-flat. The December before: G minor, low, and the certificates posted
H = lambda lid, word, off=0: W('hours', lid, word, off)
h0 = S0('hours')
urgent(G('hours', 'eight', -0.3), H('sam', 'late', -0.6), bpm=96, root=43, g=0.034, fade=1.2, steps=(0, 0, 1, 0))
knock(H('eight', 'printer', 0.0), 0.012, px(1360))
tap(H('sam', 'Sam Okafor', 0.0), 0.008, px(440))
knock(H('sam', 'monitoring', -0.3), 0.012, px(960)); tap(H('sam', 'late', 0.0), 0.009, px(960))
knock(G('hours', 'thirty', 0.0), 0.012, px(960))
for i in range(3):
    tap(G('hours', 'thirty', 0.4 + 0.35 * i), 0.006, px(900))
tTh = H('thirty', 'thirty hours', 0.0)
tap(tTh, 0.009, px(1500)); big(G2, tTh - 0.1, 0.65); dull(tTh + 0.35, 0.8, px(1500))
paper(G('hours', 'level', 0.0), 0.010, px(1110), 0.4); tap(H('level', 'a warning after a day', 0.0), 0.008, px(900))
for w_ in ('set by the builders', 'agreed with nobody', 'never run'):
    tap(H('level', w_, 0.0), 0.008, px(900))
tSg = G('hours', 'signal', 0.0)
knock(tSg, 0.012, px(1010)); big(D3, tSg + 0.2, 0.5); ice(F5, H('signal', 'a signal nobody', 0.0), 0.45, px(1010), ring=0.6)
tap(H('calls', 'Malia Fonoti', 0.0), 0.008, px(1520)); knock(G('hours', 'calls', 0.4), 0.012, px(820))
tap(H('calls', 'holds the send', 0.0), 0.009, px(1360))
tAr = H('arrives', 'the file arrives', 0.0)
paper(tAr, 0.010, px(1280), 0.35); clear(tAr, 0.7, px(1280))
air(H('arrives', 'eleven forty', 0.0), 1.2, 0.005, px(1760), 160, 800); air(H('arrives', 'twelve ten', 0.0), 1.0, 0.005, px(1760), 160, 800)
tap(H('arrives', 'seven hundred and twelve', 0.25), 0.009, px(820))
ticks(H('goes', 'checks', 0.0), 1.8, 0.006, px(820))
air(H('goes', 'three twenty', 0.0), 1.4, 0.005, px(1760), 160, 800)
tGo = H('goes', 'the list goes', 0.0)
tap(tGo + 0.4, 0.009, px(1360)); big(Bb2, tGo, 0.65); roll((F4, Bb4, D5), tGo + 0.35, 0.18, 0.6, ring=0.65)
tDc = G('hours', 'december', 0.0)
knock(tDc, 0.012, px(970)); big(G2, tDc + 0.3, 0.5)
tPr = H('december', 'printed late', 0.0)
paper(tPr, 0.009, px(760), 0.5); air(tPr + 0.4, 1.2, 0.005, px(900), 160, 700); ice(Bb3, tPr + 0.1, 0.4, -0.2)
tap(H('december', 'posted', 0.0), 0.008, px(760))

# 4. How fresh, for what: Monday, Sam, Malia and Mei: a large E-flat, and a bell as Mei comes in. The platform sees a table is late;
#    its users say when late is too late. The three uses, a card each; three clocks, a bell for each dial as it sweeps (the
#    certificates' B-flat, the seating's F, Planning's D); the strictest sets the level: the certificates' bell again, over the large
#    B-flat. A nightly file meets it; Hot, warm, cold, a card. The list's rule, agreed and owned. Timeliness, in pencil, inked by
#    its first rule: E-flat, warm
R = lambda lid, word, off=0: W('fresh', lid, word, off)
r0 = S0('fresh')
big(Eb3, G('fresh', 'monday', -0.2), 0.6)
tap(R('monday', 'Malia', 0.0), 0.008, px(975)); tap(R('monday', 'Sam', 0.0), 0.008, px(470))
tMe = R('monday', 'Mei Tanaka', 0.0)
tap(tMe, 0.008, px(1450)); ice(Bb4, tMe - 0.2, 0.45, px(1590))
tap(R('knows', 'The platform', 0.0), 0.008, px(330)); tap(R('knows', 'its users', 0.0), 0.008, px(1345))
for i, c_ in enumerate(('certs', 'seats', 'planning')):
    knock(G('fresh', c_, 0.2), 0.012, px(400 + 560 * i))
tCl = R('clocks', 'three clocks', 0.0)
for i, m in enumerate((Bb4, F4, D4)):
    air(tCl + 0.3 * i + 0.3, 0.9, 0.004, px(400 + 560 * i), 160, 700); ice(m, tCl + 0.3 * i + 0.3, 0.45, px(400 + 560 * i), ring=0.5)
tSt = R('clocks', 'The strictest', 0.0)
big(Bb2, tSt, 0.6); ice(Bb4, tSt + 0.35, 0.5, px(400), ring=0.7)
knock(R('clocks', 'a day old', 0.0), 0.012, px(960))
knock(R('moves', 'Hot', -0.1), 0.011, px(1600))
paper(G('fresh', 'contract', 0.1), 0.011, px(960), 0.45)
tap(R('contract', 'Malia agrees', 0.0), 0.008, px(500)); tap(R('contract', 'Mei owns', 0.0), 0.008, px(860))
paper(G('fresh', 'pencil', 0.0), 0.010, px(960), 0.4)
tFr = R('pencil', 'This is its first rule', 0.0)
big(Eb3, tFr, 0.55); ice(G4, tFr + 0.45, 0.45, 0.0); ice(Eb4, tFr + 1.0, 0.4, 0.2, ring=0.6)

# 5. Say how old it is: from now on the list says how old it is: B-flat, as the chapter turns. Every row carries its sources' age.
#    That Thursday, over a large B-flat: the student system's, thirty hours, its bell dull; the portal's, six hours, its own bell clear. Shown wherever the
#    list is, first in the printer's file. Like the flags: the three bells, quicker now. On good nights too. Data that says its age:
#    F; data that doesn't, can't: a large low G, alone
A = lambda lid, word, off=0: W('age', lid, word, off)
a0 = S0('age')
knock(G('age', 'says', 0.0), 0.012, px(700)); big(Bb2, G('age', 'says', -0.2), 0.6); ice(F4, G('age', 'says', 0.35), 0.45, 0.0)
tap(G('age', 'row', 0.0), 0.008, px(700)); tap(A('row', 'age', 0.0), 0.008, px(1100)); tap(G('age', 'row', 0.8), 0.008, px(1150))
tSs = A('own', 'student system', 0.0); tPo = A('own', 'portal', 0.0)
big(Bb2, tSs - 0.1, 0.45); tap(tSs, 0.008, px(1000)); dull(tSs + 0.05, 0.75, px(1000))
tap(tPo, 0.008, px(1410)); clear(tPo + 0.05, 0.75, px(1410), m=PORTAL)
paper(G('age', 'shown', 0.0), 0.011, px(800), 0.45)
knock(G('age', 'flags', 0.0), 0.011, px(1670))
tFg = G('age', 'flags', 0.25)
for i, m in enumerate((Bb4, D5, F5)):
    ice(m, tFg + 0.22 * i, 0.45, px(1670), ring=0.55)
tap(A('flags', 'everyone', 0.0), 0.008, px(1670))
tap(G('age', 'labelled', 0.0), 0.008, px(560))
paper(A('labelled', 'Here', 0.2), 0.010, px(800), 0.4); tap(A('labelled', 'on good nights', 0.0), 0.008, px(980))
tTr = G('age', 'trust', 0.0)
knock(tTr, 0.012, px(960)); big(F2, tTr - 0.1, 0.55); ice(A4, tTr + 0.4, 0.45, -0.15); ice(C5, tTr + 0.9, 0.4, 0.15)
tCt = G('age', 'cant', 0.0)
knock(tCt, 0.012, px(960)); tap(tCt + 0.5, 0.009, px(1380)); big(G2, END('age', 'cant') + 0.2, 0.55, ring=1.0)

# 6. Warn first, then stop the send: Sam checks the age where it starts: F, a large bell and a small one, as the chapter turns. The
#    receipts, when each file arrived; one level on each. The night's update: the check first; it fails, and Sam and Malia hear at
#    once: a large D; the list is still built, saying its age. That's the warning: E-flat, warm. The send's job: the same check; if it
#    fails, the list waits: the student system's bell, dull. The data isn't stopped. The send is: F, then B-flat, low
T = lambda lid, word, off=0: W('stop', lid, word, off)
t0_ = S0('stop')
big(F2, G('stop', 'source', -0.2), 0.6); ice(C5, G('stop', 'source', 0.35), 0.45, 0.2)
knock(G('stop', 'source', 0.2), 0.012, px(850)); knock(G('stop', 'source', 0.5), 0.012, px(1490))
tap(T('arrived', 'arrived', 0.0), 0.008, px(1170)); tap(T('arrived', 'not the newest row', 0.0), 0.008, px(900))
paper(G('stop', 'level', 0.0), 0.010, px(1090), 0.4); tap(T('level', 'twenty-four hours', 0.0), 0.008, px(1000))
tap(T('level', 'on each', 0.0), 0.008, px(760))
knock(G('stop', 'first', 0.0), 0.012, px(1090))
knock(G('stop', 'tells', 0.2), 0.010, px(800), 190)
tHr = T('tells', 'hear at once', 0.0)
tap(tHr, 0.008, px(1300)); big(D3, tHr - 0.1, 0.6); ice(F4, tHr + 0.4, 0.45, 0.2)
tap(T('tells', 'still built', 0.0), 0.009, px(1000)); tap(T('tells', 'saying its age', 0.0), 0.008, px(1380))
tWn = G('stop', 'warn', 0.0)
knock(tWn, 0.012, px(1010)); big(Eb3, tWn + 0.2, 0.55); ice(G4, tWn + 0.6, 0.45, -0.2); ice(Bb4, tWn + 1.1, 0.4, 0.2, ring=0.6)
knock(G('stop', 'send', 0.1), 0.012, px(1090))
knock(T('waits', 'if not', 0.0), 0.010, px(800), 190)
tWt = T('waits', 'the list waits', 0.0)
tap(tWt, 0.008, px(1000)); dull(tWt + 0.05, 0.7, px(1000))
tap(T('waits', 'told why', 0.0), 0.008, px(1300))
tDa = G('stop', 'data', 0.0)
knock(tDa, 0.012, px(1010)); big(F2, tDa, 0.55); big(Bb2, T('data', 'The send is', 0.0), 0.65, ring=1.4); ice(D4, T('data', 'The send is', 0.4), 0.45, 0.0)

# 7. In time: the coast at dusk, 2007, the flags flying and the volunteers calling: B-flat. The bench: the printer's page with its
#    age; the send waits: the student system's bell, dull; the file comes and the list is fresh: the same bell, clear, and the large
#    B-flat: the mark turned round. Since June, no graduate left off. The film's line: B-flat major, rolled up from the large bell. A
#    use, a measure, a reference and a clock; the end card: the large B-flat and the student system's bell, clear, ringing out
E_ = lambda lid, word, off=0: W('time', lid, word, off)
e0 = S0('time')
big(Bb2, e0 + 0.2, 0.7, ring=1.5); ice(D4, e0 + 0.8, 0.5, -0.25); ice(F4, e0 + 1.4, 0.5, 0.25)
paper(G('time', 'list', 0.2), 0.011, px(680), 0.45)
tSn = E_('list', 'the send', 0.0)
knock(tSn, 0.012, px(1520)); tap(tSn + 0.1, 0.008, px(1500)); dull(tSn + 0.1, 0.7, px(1500))
tFs = E_('list', 'fresh', 0.0)
tap(tFs + 0.3, 0.009, px(1500)); clear(tFs + 0.05, 0.8, px(1500)); big(Bb2, tFs + 0.1, 0.55)
knock(G('time', 'since', 0.0), 0.012, px(600))
tTk = G('time', 'take', 0.0)
knock(tTk, 0.012, px(960)); big(Bb2, tTk - 0.1, 0.7, ring=1.5); roll((D4, F4, Bb4, D5), tTk + 0.3, 0.2, 0.7, ring=0.75)
for w_ in ('a use', 'a measure', 'a reference', 'a clock'):
    tap(E_('series', w_, 0.0), 0.007, 0.0)
tap(E_('series', 'Next', 0.0), 0.007, px(600))
tEn = G('time', 'breath', 0.6)
big(Bb2, tEn, 0.7, ring=1.6); clear(tEn + 0.45, 0.7, 0.0)
