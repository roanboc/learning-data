# Every change through review: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, reserved for this film by the series on 5 November 2026 (palettes.md, after checking every
# score.py on main and on every branch, music.py and the palettes of series 1 and 2): tuned flowerpots and a nail violin. Both are
# made here (music.py has neither).
#  - The flowerpots: pots of fired clay, each chosen for its note, struck softly with small mallets, as late-twentieth-century
#    percussion music plays them. A pot set down on a table only knocks: the table holds it, and its note dies at once. Lifted free, the
#    same pot rings on its note. An agent sets its change down; a person lifts it, and it rings out: an agent proposes, a person
#    releases. Each pot keeps its own clay (its overtones, a little out of line with the note, as clay's are) and its own level; a
#    chord is a few pots struck one after another, a player's mallet to each.
#  - The nail violin: iron rods set round a wooden box, each silent until a bow is drawn across it; bowed softly and briefly, with no
#    vibrato, its rod rings on a moment after the bow leaves. It plays only under a person's step (a decision, an approval, the
#    release), never under an agent's, so the release is the moment something sings.
#  - The mark: a knock, then the same pot lifted and ringing on its note. It plays where the opening says "an agent proposes, a person
#    releases", where the change waits at production until Noor lifts it, and at the end.
#  - C major, tuned pure over C (see hz()); A minor for the problems: the class plan's 25 for every unit, a change no one checked, the
#    31 units with no class size. The chords used are C, F, G, A minor and E minor, all pure here; D and A never sound together (their
#    fifth isn't pure in this scale), nor D and F.
# The rules the series keeps (its briefs and the author's review of the first films, 4 November 2026):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause; never a bed under the voice. tools/quiet.py checks how long and how often it plays, and that no figure comes back soon.
#  - Nothing trembles, pulses or beats: every note comes from one just scale, no vibrato, no roll. No urgent pulse: nothing in this
#    film is a rush.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as the picture in src/scenes.js,
#    so sound and picture stay together when the voice is recorded again. Effects come one at a time, soft, and under about 2.2 kHz;
#    none of them is clay, so the pots stay music (Decades in the making's clay is an effect).

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
R1 = np.random.default_rng(36)  # this film's own randomness: the room, the paper, the keys

# ---- tuning: just intonation from C 4 (261.63 Hz, as A = 440 Hz tunes it), so a chord's notes are whole-number ratios of each other
# and nothing beats. Every pitch comes from this one scale, so a note two chords share is the same in both
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (60, 440 * 2 ** (-9 / 12))
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
F3, G3, A3, B3, C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, F5, G5, A5, B5, C6 = 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84

# ---- the levels: the pots about as far under the voice as the series' other music (matched by loudness, as tools/quiet.py measures
# it), a pot set down a little under a pot that rings, the nail violin under both (a bowed rod is nearly a pure tone, and it sits where a
# phone plays loudest); the effects about 12 dB under the music (FX scales them all)
PT, KN, NV, FX = 0.063, 0.053, 0.028, 1.6

# a small room round the pots and the rods, ringing on for about a second. Its level is set by what it rings under 1.5 kHz (its gain
# there about one), so a held note keeps its level (the lesson of Plan, define the check, do, check: a room scaled by all it rings rang
# about 12 dB louder there than its share said)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.016 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3000)
def _room(s, room):
    if not room:
        return s
    return np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
def _held(s, room):
    """a held note in the room, at its own level: the room still moves a pure note's level by up to 5 dB, up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body"""
    r = _room(s, room); a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b] ** 2).mean() / max(1e-12, (r[a:b] ** 2).mean())))
def _rms1(x):
    """noise scaled to an RMS of one"""
    x = np.asarray(x, np.float64); return x / max(1e-12, float(np.sqrt((x ** 2).mean())))

# ---- a flowerpot struck with a small mallet. Its note is the clay's lowest mode; two higher modes, a little out of line with the note
# (2.41 and 4.32 times it, as a thick clay bowl's are), sound with the strike and die within a few tenths of a second, so they colour
# the note without ringing against any other. The mallet meets the clay over two milliseconds, with a dry tock of the clay itself. Lifted
# free, the pot rings for two to four seconds (a bigger, lower pot a little longer). Set down, the table holds it: its note dies in a
# few hundredths of a second, and its foot knocks on the wood. Returned dry
def _pot(m, down=False):
    f = hz(m); pr = np.random.default_rng(300 + m)  # this pot's own clay: its modes and its level
    lev, r2, r3 = 10 ** (pr.uniform(-0.8, 0.8) / 20), 2.41 * pr.uniform(0.99, 1.01), 4.32 * pr.uniform(0.99, 1.01)
    big = min(1.0, max(0.0, (330 - f) / 150))
    tau = 0.028 if down else 0.42 + 0.22 * big
    sec = 0.3 if down else 6.5 * tau + 0.1
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for r, a, d in ((1.0, 1.0, tau), (r2, 0.30 if down else 0.22, min(tau, 0.16)), (r3, 0.15 if down else 0.08, min(tau, 0.07))):
        if f * r < 2000:
            sig += a * np.exp(-x / d) * np.sin(2 * np.pi * f * r * x + pr.uniform(0, 2 * np.pi))
    sig *= 1 - np.exp(-x / 0.002)
    tock = _rms1(filt(pr.standard_normal(n).astype(np.float32), 'band', (f * 1.6, min(2000, f * 4.5)), 2)) * np.exp(-x / 0.005)
    sig += (0.3 if down else 0.18) * tock
    if down:  # the pot's foot on the table: a low, short knock of the wood
        sig += 0.45 * np.sin(2 * np.pi * 140 * x) * np.exp(-x * 45) * (1 - np.exp(-x / 0.003))
    return norm(filt(sig.astype(np.float32), 'low', 1800, 2)) * lev
def pot(m, s, g=1.0, pan=None, room=0.3):
    """a pot lifted free, struck at s: it rings"""
    put(_room(_pot(m), room).astype(np.float32), s, g * PT, max(-0.45, min(0.45, (m - 66) * 0.03)) if pan is None else pan)
def knock(m, s, g=1.0, pan=None):
    """the same pot set down on the table, struck at s: it only knocks"""
    put(_room(_pot(m, True), 0.15).astype(np.float32), s, g * KN, max(-0.45, min(0.45, (m - 66) * 0.03)) if pan is None else pan)
def pots(notes, s, g=1.0, stag=0.14, pans=None):
    """a few pots struck one after another, a mallet to each: the first, then the others a moment apart"""
    for i, m in enumerate(notes):
        pot(m, s + stag * i, g * (1.0 if i == 0 else 0.84), None if pans is None else pans[i])
def mark(m, s, lift, g=1.0, pan=0.0):
    """the mark: the pot set down at s only knocks; lifted, at lift, the same pot rings on its note"""
    knock(m, s, g, pan); pot(m, lift, g, pan)

# ---- the nail violin: an iron rod bowed softly. The rod rings in its lowest bending mode, a nearly pure note (its next mode, more
# than six times higher, is above everything here); the bow's stick and slip add a little of the second and third harmonics while it
# draws, and a faint grain of rosin. The bow takes the rod over a fifth of a second and draws at an even weight, so nothing trembles;
# when it leaves, the harmonics stop and the rod rings on, dying over about a second. Returned dry
def _nail(m, sec, rel=0.8):
    f = hz(m); nr = np.random.default_rng(800 + m)  # this rod's own bow and level
    lev = 10 ** (nr.uniform(-0.6, 0.6) / 20)
    n = int((sec + 5 * rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    on = np.clip(x / 0.22, 0, 1) ** 1.6
    rod = np.where(x < sec, on, on[min(n - 1, int(sec * SR))] * np.exp(-np.maximum(0, x - sec) / rel))
    bow = np.where(x < sec, on, on[min(n - 1, int(sec * SR))] * np.maximum(0, 1 - (x - sec) / 0.06))
    ph = 2 * np.pi * f * x
    sig = np.sin(ph) * rod + (0.12 * np.sin(2 * ph + 0.4) + 0.04 * np.sin(3 * ph + 1.0)) * bow
    grain = _rms1(filt(nr.standard_normal(n).astype(np.float32), 'band', (f * 0.97, f * 1.03), 2))
    hiss = _rms1(filt(nr.standard_normal(n).astype(np.float32), 'band', (900, 2000), 2))
    sig = sig + (0.022 * grain + 0.010 * hiss * (1 + 2 * np.exp(-x / 0.08))) * bow
    return norm(filt(sig.astype(np.float32), 'low', 2200, 2)) * lev
def nail(m, a, b, g=1.0, pan=None, room=0.3):
    """the nail violin, one rod bowed from a to b; it rings on after the bow leaves"""
    put(_held(_nail(m, b - a), room).astype(np.float32), a, g * NV, max(-0.5, min(0.5, (m - 76) * 0.04)) if pan is None else pan)

# ---- soft sounds on screen, all low-passed (soft() keeps what's made here under about 2.2 kHz, steeply)
soft = lambda sig: filt(np.asarray(sig, np.float32), 'low', 2200, 4)
def _across(sig, s, g, p0, p1):
    """an effect that moves across the frame while it plays, from pan p0 to p1: its two sides placed together, so heard as one"""
    sig = np.asarray(sig, np.float32); p = np.linspace(p0, p1, len(sig)).astype(np.float32)
    X(sig * np.sqrt(0.5 * (1 - p)), s, g, -1.0); X(sig * np.sqrt(0.5 * (1 + p)), s, g, 1.0)
def _swell(sec, a=0.4, r=0.6):
    x = np.arange(int(sec * SR)) / SR; return (np.minimum(1, x / a) * np.minimum(1, np.maximum(0, sec - x) / r)).astype(np.float32)
def card(s, g=0.014, pan=0.0):
    """a card set in place: a soft papery tuck"""
    x = tt(0.16); X(soft(filt(noise(0.16), 'band', (400, 2000))[:len(x)] * np.exp(-x * 30)), s, g * FX, pan); s_knock(s + 0.01, g * 0.45 * FX, pan, 320)
def sheet(s, g=0.013, pan=0.0, sec=0.45):
    """a page laid down: filtered noise with a swell"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (250, 1900))[:len(x)] * np.sin(np.pi * x / sec) ** 2), s, g * FX, pan)
def slide(s, sec=0.9, g=0.009, p0=0.0, p1=0.0):
    """a card, a row or a line sliding across: a soft, even brush of paper"""
    x = tt(sec); _across(soft(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5), s, g * FX, p0, p1)
def keys(a, b, g=0.018, pan=0.0):
    """a line typed in: soft keys, far off and unhurried, as one texture that comes and goes with the words"""
    sec = b - a; n = int(sec * SR); sig = np.zeros(n, np.float32); t = 0.05
    while t < sec - 0.05:
        k = int(t * SR); m = min(n - k, int(0.05 * SR)); y = np.arange(m) / SR
        sig[k:k + m] += filt(R1.standard_normal(m).astype(np.float32), 'band', (300, 1400))[:m] * np.exp(-y * 85) * R1.uniform(0.6, 1.0)
        t += R1.uniform(0.11, 0.19)
    X(soft(sig * _swell(sec, 0.2, 0.2)[:n]), a, g * FX, pan)
def tick(s, g=0.01, pan=0.0):
    """a pencil tick: a quick, soft stroke"""
    x = tt(0.12); X(soft(filt(noise(0.12), 'band', (600, 2000))[:len(x)] * np.sin(np.pi * x / 0.12) ** 0.7), s, g * FX, pan)
def tap(s, g=0.009, pan=0.0):
    """a muffled key, or a pill set in place"""
    s_tap(s, g * FX, pan)
def pencil(s, sec=0.5, g=0.008, pan=0.0):
    """a line drawn: a soft, even scratch"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6), s, g * FX, pan)
def lock(s, g=0.012, pan=0.0):
    """a lock closing: a soft, low double click"""
    s_knock(s, g * FX, pan, 200); s_tap(s + 0.035, g * 0.6 * FX, pan)
def stop(s, g=0.011, pan=0.0):
    """something crossed out, or held: a soft, dull bump"""
    s_knock(s, g * FX, pan, 150)
def air(s, sec=0.8, g=0.008, p0=0.0, p1=None):
    """something moving through the air of the room: a low breath, from p0 to p1"""
    x = tt(sec); _across(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, p0, p0 if p1 is None else p1)

# where the path's six stations stand (src/scenes.js: ec_path at x 150, 1620 wide), for the opening and the end
STN = [px(150 + (i + 0.5) * 1620 / 6) for i in range(6)]

# =============================================================================================================================
# 1. The agent's first pull request: the opening, under the pots all through, a chord to each picture. Today, the university: C, open,
#    and the pull request set down, a knock. What a pull request is: F. The class plan: C; the faculties hire from it: G. Classes of 25,
#    and a laboratory of 16: A minor, and a low pot for the nine left without a bench. Every faculty: E minor. A unit dropped, its
#    classes doubled: A minor and F. An agent approving its own change: a knock that nothing lifts, and A minor as it reaches
#    production; "That had to change": G, waiting. Now every change goes through review: C, the two changes set down; the rules, set
#    in the tools: F. The path: the evidence set down, then a pot for each station as it lights, rising; another agent's review, a pot
#    and no bow; the people's approval and the second person's release, each a pot lifted with the nail violin over it. What they saw:
#    the bow, and F; 263 more classes: C. And for data: the mark, an agent proposes (the knock) and a person releases (the same pot,
#    lifted, ringing, the bow above it). The title: C, the pots one by one, and the bow on G
w = lambda lid, word, off=0: W('first', lid, word, off)
wc = lambda lid, off=0: G('first', lid, off)
# today, at the university; on Tuesday the planning agent opened its first pull request
pots((C4, G4, E5), 0.7, 0.85, stag=0.85)
air(w('place', 'Planning', -0.4), 0.8, 0.006, px(330))
knock(C4, w('place', 'opened', 0.05), 0.9, px(1150))
# a change put forward, for people to read, and to accept or not
pots((F3, C4, A4), wc('what', -0.1), 0.8, stag=0.3)
tap(w('what', 'a change put forward', 0.05), 0.009, px(800)); tap(w('what', 'for people to read', 0.05), 0.009, px(780))
tick(w('what', 'to accept', 0.1), 0.009, px(1100))
# Planning's class plan for next semester; the faculties hire their tutors from it
sheet(w('plan', "Planning's", -0.3), 0.013, px(550), 0.5)
pots((E4, G4, C5), w('plan', "Planning's", -0.35), 0.8, stag=0.2)
card(w('tutors', 'hire', 0.0), 0.012, px(1360))
pots((G3, D4, B4), w('tutors', 'hire', -0.05), 0.75, stag=0.25)
# classes of 25; but a laboratory holds 16: sixteen go to the benches, and nine are left without one
pots((C4, E4), w('labs', 'twenty-five', -0.1), 0.6, stag=0.3)
pots((A3, E4, C5), w('labs', 'But a laboratory', -0.1), 0.8, stag=0.2)
slide(w('labs', 'holds sixteen'), 1.6, 0.006, px(1250), px(1650))
tap(w('labs', 'holds sixteen', 1.6), 0.01, px(1600)); pot(A3, w('labs', 'holds sixteen', 1.6), 0.65)
# every faculty plans with that number: the four faculties, one after another
for i in range(4):
    tap(w('stakes', 'every faculty', -0.1 + 0.18 * i), 0.007, px(220 + 300 * i))
pots((E4, G4, B4), w('stakes', 'every faculty', -0.15), 0.7, stag=0.18)
# a change that dropped a unit, or doubled its classes: students without a class, tutors paid for classes that never run
pots((A3, C4, A4), w('wrong', 'dropped', -0.1), 0.8, stag=0.15); stop(w('wrong', 'dropped', 0.2), 0.01, px(550))
pots((F3, A3, F4), w('wrong', 'doubled', -0.1), 0.75, stag=0.15); tap(w('wrong', 'doubled', 0.2), 0.008, px(900))
card(w('wrong', 'without a class', -0.3), 0.012, px(1400)); card(w('wrong', 'pay tutors', 0.0), 0.012, px(1400))
pots((E4, G4), w('wrong', 'pay tutors', -0.05), 0.65, stag=0.25)
# an agent that could approve its own change: a knock, and nothing lifts it; into production before anyone had looked
knock(C4, w('own', 'approve its own', 0.05), 0.95, px(830))
slide(w('own', 'put it there', 0.0), 0.6, 0.007, px(1530), px(1590)); card(w('own', 'put it there', 0.1), 0.011, px(1735))
pots((A3, E4), w('own', 'put it there', 0.05), 0.75, stag=0.3)
tap(w('own', 'before anyone', 0.05), 0.008, px(800))
# that had to change: the approval crossed out, the room dims, and G waits
stop(w('change', 'had to change', 0.0), 0.012, px(830))
pots((G3, B3, D4), w('change', 'had to change', 0.3), 0.8, stag=0.25)
# now every change, an agent's or a person's, goes through review; the rules are set in the tools
pots((C4, E4, G4, C5), wc('review', 0.1), 0.85, stag=0.18)
knock(C4, w('review', "an agent's", 0.05), 0.75, px(430)); knock(G3, w('review', "a person's", 0.05), 0.75, px(430))
pencil(w('review', 'goes through review', 0.0), 0.6, 0.007, px(800)); tap(w('review', 'goes through review', 0.35), 0.008, px(1050))
pots((F4, A4, C5), w('review', 'the rules are set', 0.0), 0.8, stag=0.2)
for i in range(3):
    tap(w('review', 'the rules are set', 0.1 + 0.2 * i), 0.007, px(700 + 260 * i))
# the path: the evidence handed in (set down), checks on what changed, a diff, each station lighting as it's said
slide(wc('path', 0.1), 0.8, 0.007, px(300), px(1650))
knock(C4, w('path', 'its evidence', 0.05), 0.85, STN[0])
pot(E4, w('path', 'Checks build', 0.05), 0.75, STN[1]); pot(G4, w('path', 'a diff shows', 0.05), 0.75, STN[2])
# another agent's review, for reference: a pot, and no bow; the people's approval, and a second person's release: lifted, and bowed
pot(A4, w('release', 'Another agent', 0.05), 0.7, STN[3])
pot(C5, w('release', 'People approve', 0.05), 0.8, STN[4]); nail(E5, w('release', 'People approve', 0.1), w('release', 'People approve', 2.1), 0.8, STN[4])
pot(C4, w('release', 'a second person', 0.05), 0.9, STN[5]); nail(G5, w('release', 'a second person', 0.15), w('release', 'a second person', 2.4), 0.8, STN[5])
# Jun and Noor saw exactly what would change: their names, under the bow; more classes in 161 units, and nothing else
tap(w('saw', 'Jun', 0.05), 0.007, STN[4]); tap(w('saw', 'Noor', 0.05), 0.007, STN[5])
nail(A5, w('saw', 'Jun', 0.0), w('saw', 'Jun', 1.9), 0.65, px(1450))
card(w('saw', 'more classes', -0.2), 0.012, px(530)); pots((F4, C5), w('saw', 'more classes', -0.15), 0.7, stag=0.3)
# the faculties can hire for 263 more classes in time, with a place for every student
card(w('answer', 'two hundred', -0.1), 0.012, px(470))
pots((G3, C4, E4, G4), w('answer', 'two hundred', -0.15), 0.8, stag=0.2)
tick(w('answer', 'a place for every student', 0.1), 0.009, px(1050)); pot(E5, w('answer', 'a place for every student', 0.05), 0.6)
# and for data: an agent proposes, a person releases (the mark), and nothing reaches production that a person hasn't seen
tap(wc('data', 0.25), 0.007, px(960))
mark(C4, w('data', 'an agent proposes', 0.05), w('data', 'a person releases', 0.05), pan=px(960))
nail(E5, w('data', 'a person releases', 0.15), w('data', 'a person releases', 2.4), 0.8, px(1320))
card(w('data', 'nothing reaches', -0.1), 0.012, px(960))
# the title: the change lifted, C, the pots one by one, and the bow on G
pots((C4, E4, G4, C5), wc('breath', 0.3), 0.85, stag=0.4)
nail(G5, wc('breath', 1.0), wc('breath', 3.4), 0.75, 0.1)

# =============================================================================================================================
# 2. What the agent hands in: Clara's ticket, at the chapter's turn: C, low and open. The glossary read first, the owner's name; the
#    branch drawn, the schema, production behind glass and locked; the five stages, and stage four lit, one pot; the two tests; the pull
#    request set down, a knock, its rows one by one; and what it wasn't sure of: A minor, low
hw = lambda lid, word, off=0: W('hands', lid, word, off)
hc = lambda lid, off=0: G('hands', lid, off)
card(hw('ticket', 'Clara asked', 0.0), 0.012, px(1580))
pots((G3, E4, C5), hw('ticket', 'Clara asked', -0.1), 0.75, stag=0.3)
pencil(hw('glossary', 'read the glossary', 0.0), 0.5, 0.007, px(1260)); card(hw('glossary', 'A class size', 0.0), 0.012, px(1580))
tap(hw('glossary', "set by the unit's school", 0.45), 0.008, px(1500))
slide(hw('branch', 'its own branch', 0.0), 1.1, 0.007, px(900), px(1500))
card(hw('branch', 'development schema', 0.0), 0.011, px(800)); card(hw('branch', 'Production', 0.0), 0.011, px(1530))
lock(hw('branch', 'only read', 0.05), 0.011, px(1400))
slide(hc('stage', 0.2), 0.9, 0.007, px(300), px(1700))
card(hw('stage', 'the map', 0.0), 0.011, px(440)); pot(E4, hw('stage', 'stage four', 0.05), 0.7, px(1300))
card(hw('tests', 'every student', 0.0), 0.011, px(1010)); card(hw('tests', 'no class is planned', 0.0), 0.011, px(1010))
knock(C4, hc('says', -0.25), 0.85, px(1220))
for word in ('what changed', 'and why', 'copies the glossary'):
    tap(hw('says', word, 0.05), 0.008, px(900))
tick(hw('says', 'copies the glossary', 0.85), 0.009, px(900))
tap(hw('evidence', 'shows its evidence', 0.05), 0.008, px(900)); tick(hw('evidence', 'before and after', 0.1), 0.009, px(1300))
tap(hw('unsure', "wasn't sure", 0.05), 0.008, px(900))
pots((A3, E4), hw('unsure', 'thirty-one units', -0.05), 0.7, stag=0.3)

# =============================================================================================================================
# 3. What changed, and what it touches: the project's lineage at the chapter's turn: F. The class plan lights, then the classes by
#    faculty after it; every test passes: G, rising. The dbt command typed; the impact report. Then the two tables, the lines from row
#    to row: one pot as they're compared; the diff typed in; "each one up, 263 more": C. A reviewer sees what it does to the data: one
#    pot, high
cw = lambda lid, word, off=0: W('checks', lid, word, off)
cc = lambda lid, off=0: G('checks', lid, off)
sheet(cc('only', -0.6), 0.012, px(900), 0.5)
pots((F3, C4, A4), cc('only', -0.55), 0.75, stag=0.3)
tap(cw('only', 'the whole project', 0.3), 0.008, px(400))
card(cw('only', 'dbt builds', 0.0), 0.011, px(1140)); keys(cw('only', 'dbt builds', 0.3), cw('only', 'dbt builds', 1.5), 0.016, px(1140))
tap(cw('only', 'what changed', 0.05), 0.008, px(830)); tap(cw('only', 'everything that depends', 0.05), 0.008, px(1200))
pots((G4, B4, D5), cw('here', 'Every test passes', -0.05), 0.7, stag=0.2); tick(cw('here', 'Every test passes', 0.1), 0.009, px(1500))
card(cw('impact', 'The impact report', 0.0), 0.011, px(1230))
tap(cw('impact', 'a column is added', 0.05), 0.008, px(1230)); tap(cw('impact', 'nothing that reads', 0.05), 0.008, px(1230))
tap(cw('impact', 'who to tell', 0.05), 0.008, px(1230))
card(cw('diff', 'the same table', 0.0), 0.011, px(460)); card(cw('diff', 'from main', 0.0), 0.011, px(1460))
slide(cw('diff', 'compared unit by unit', 0.0), 1.2, 0.007, px(780), px(1140)); pot(E4, cw('diff', 'compared unit by unit', 0.05), 0.65, px(960))
card(cc('none', -0.3), 0.011, px(960)); keys(cc('none', -0.2), cw('none', 'classes changed', 0.9), 0.015, px(700))
pots((C4, E4, G4), cw('none', 'each one up', 0.15), 0.75, stag=0.25); tick(cw('none', 'each one up', 0.25), 0.009, px(1500))
card(cw('sees', 'to the data', -0.3), 0.011, px(600)); pot(G5, cw('sees', 'to the data', -0.25), 0.55, px(600))

# =============================================================================================================================
# 4. An agent's review, for reference: the governance review agent comes in, Yusuf beside it: E minor, an agent's chord, no bow. Its
#    rules ticked one by one; the 31 units with no class size: A minor; its suggestion: one pot; who decides, posted as a comment; it
#    never approves, never blocks. Yusuf decides yes, for data governance, where the change and the glossary differ: the pot lifted and
#    the nail violin, a person's decision; the second push set down,
#    a knock. Two agents, only through the pull request, and a person between them: the bow again, over C
rw = lambda lid, word, off=0: W('review', lid, word, off)
rc = lambda lid, off=0: G('review', lid, off)
air(rw('second', 'a second agent', -0.2), 0.9, 0.007, px(1000))
pots((E4, B4, G5), rw('second', 'a second agent', 0.0), 0.7, stag=0.3)
card(rw('second', 'reads the pull request', -0.2), 0.011, px(1575))
tap(rw('second', 'the governance review agent', 0.1), 0.008, px(1000)); tap(rw('second', 'a name of its own', 0.05), 0.008, px(1575))
card(rc('rules', -0.1), 0.011, px(1575))
for word, off in (('an owner', 0), ('words from the glossary', 0), ('words from the glossary', 0.6), ('a test for each rule', 0), ('the impact named', 0)):
    tick(rw('rules', word, off + 0.05), 0.008, px(1400))
tap(rw('missing', 'One thing', 0.05), 0.008, px(1575)); pots((A3, E4), rw('missing', 'thirty-one units', -0.05), 0.7, stag=0.3)
tap(rw('missing', 'stay at', 0.05), 0.008, px(1400)); tap(rw('missing', 'nobody is told', 0.05), 0.008, px(1640))
card(rc('suggests', 0.0), 0.011, px(1575)); pot(G4, rc('suggests', 0.05), 0.6, px(1575))
tap(rw('suggests', 'a warning every night', 0.05), 0.008, px(1500)); tap(rw('suggests', 'not a failing check', 0.05), 0.008, px(1450))
card(rw('who', 'who decides', 0.0), 0.011, px(1575)); tap(rw('who', 'as a comment', 0.05), 0.008, px(1450))
card(rc('comment', 0.0), 0.011, px(1575))
stop(rw('comment', 'never approves', 0.1), 0.01, px(1350)); stop(rw('comment', 'never blocks', 0.1), 0.01, px(1350))
tap(rw('comment', 'only for reference', 0.05), 0.008, px(1450))
# Yusuf decides: yes; the planning agent adds the warning, in a second push
card(rc('yusuf', 0.1), 0.012, px(1580)); tick(rw('yusuf', 'yes', 0.1), 0.009, px(1814))
pot(C4, rw('yusuf', 'yes', 0.05), 0.85, px(1080)); nail(E5, rw('yusuf', 'yes', 0.15), rw('yusuf', 'yes', 2.0), 0.8, px(1580))
card(rw('yusuf', 'adds the warning', -0.6), 0.011, px(1580)); knock(C4, rw('yusuf', 'a second push', 0.05), 0.75, px(1080))
# two agents worked together only through the pull request, and a person decided between them
card(rw('together', 'only through the pull request', -0.3), 0.011, px(960))
pencil(rw('together', 'only through the pull request', 0.0), 0.6, 0.007, px(500)); pencil(rw('together', 'only through the pull request', 0.3), 0.6, 0.007, px(1420))
tick(rw('together', 'a person decided', 0.1), 0.009, px(960))
pots((C4, G4), rw('together', 'a person decided', 0.0), 0.7, stag=0.3); nail(C6, rw('together', 'a person decided', 0.2), rw('together', 'a person decided', 2.0), 0.6, px(960))

# =============================================================================================================================
# 5. Who approves, from the map: the map's steps come in, at the chapter's turn: F. After a pull request, every step a person's: a bow
#    for each as it's named, the analytics engineer, the release approver who approves the change, and releases it, rising; owners don't
#    review pull requests, a tap, and what a word means is decided first in the glossary, ticked. The planning contributor's steps end at
#    the pull request: a knock, and nothing lifted. GitHub's teams,
#    written from the roles; the rules on main, locked for everyone; an agent's approval never counts. After the second push, set down:
#    Jun approves the code again, the pot lifted and a bow; Clara and the faculties are told what it touches, a tap for each
uw = lambda lid, word, off=0: W('rules', lid, word, off)
uc = lambda lid, off=0: G('rules', lid, off)
sheet(uw('map', 'on the map', -0.3), 0.013, px(960), 0.5)
pots((F3, C4, A4, F4), uw('map', 'on the map', -0.25), 0.75, stag=0.25)
for i in range(3):
    tap(uw('map', "a person's", 0.05 + 0.15 * i), 0.007, px(1620))
nail(C5, uw('steps', 'The analytics engineer', 0.05), uw('steps', 'The analytics engineer', 1.3), 0.7, px(1100))
nail(E5, uw('steps', 'The release approver', 0.05), uw('steps', 'The release approver', 1.3), 0.7, px(1100))
nail(G5, uw('steps', 'releases it', 0.05), uw('steps', 'releases it', 1.6), 0.7, px(1100))
tap(uw('word', "Owners don't review", 0.05), 0.008, px(610)); tick(uw('word', 'in the glossary', 0.1), 0.008, px(1260))
for i in range(3):
    tap(uw('none', "The planning contributor's steps", 0.05 + 0.2 * i), 0.007, px(1100))
knock(C4, uw('none', 'end at the pull request', 0.05), 0.8, px(1550)); stop(uw('none', 'holds none', 0.1), 0.01, px(1550))
card(uc('written', 0.2), 0.011, px(480)); pencil(uw('written', 'written from those roles', 0.0), 0.6, 0.007, px(930))
card(uw('written', 'the teams that approve', 0.0), 0.011, px(1410))
tap(uw('written', 'takes over a role', 0.05), 0.008, px(300)); tick(uw('written', 'the approvals follow', 0.1), 0.009, px(300))
card(uw('main', 'the rules on main', 0.0), 0.011, px(510)); lock(uw('main', 'not even an administrator', 0.05), 0.012, px(400))
card(uc('person', 0.0), 0.011, px(1390))
tick(uw('person', 'a person', 0.05), 0.008, px(1100)); tick(uw('person', 'a team of people', 0.05), 0.008, px(1100))
stop(uw('person', "An agent can't", 0.45), 0.01, px(1100)); tap(uw('person', 'never counts', 0.05), 0.008, px(1150))
card(uc('own', -0.1), 0.011, px(1390)); stop(uw('own', 'their own pull request', 0.35), 0.01, px(1100))
tick(uw('own', "didn't push it", 0.1), 0.009, px(1100))
# after the second push: Jun approves the code again; Clara and the faculties are told what it touches
card(uw('again', 'the second push', -0.2), 0.011, px(960)); knock(C4, uw('again', 'the second push', -0.15), 0.75, px(960))
card(uw('again', 'Jun approves', -0.3), 0.011, px(960))
pot(C4, uw('again', 'Jun approves', 0.3), 0.8, px(600)); nail(C5, uw('again', 'Jun approves', 0.35), uw('again', 'Jun approves', 1.6), 0.65, px(600))
tick(uw('again', 'Jun approves', 0.3), 0.008, px(500))
card(uw('again', 'Clara', -0.3), 0.011, px(960))
tap(uw('again', 'Clara', 0.05), 0.008, px(600)); tap(uw('again', 'the faculties', 0.05), 0.008, px(600))

# =============================================================================================================================
# 6. A person releases: Jun merges, at the chapter's turn: C, low, as the branch joins main; merging isn't the release. That night
#    the release builds main in test: test passes, one pot; it goes on to production and waits there, set down: a knock. On Wednesday
#    morning Noor approves: the same pot lifted, ringing, and the bow (the mark, across the night); whoever starts it can't approve it,
#    locked. The release signs in, with no secret; the bundle deploys, and the build runs in production: C, and the bow, high. The
#    planning agent only reads production: no music, a lock
ew = lambda lid, word, off=0: W('release', lid, word, off)
ec = lambda lid, off=0: G('release', lid, off)
slide(ec('merge', -0.5), 1.0, 0.007, px(900), px(1500))
pots((C4, G4, E5), ew('merge', 'goes into main', 0.6), 0.75, stag=0.3)
tick(ew('merge', 'Jun merges it', 0.05), 0.009, px(700)); tap(ew('merge', "the agents don't merge", 0.05), 0.008, px(1100))
card(ew('merge', "merging isn't the release", 0.0), 0.012, px(880))
card(ec('night', 0.2), 0.011, px(1200)); tap(ew('night', 'That night', 0.05), 0.008, px(1700))
slide(ew('night', 'builds main in test', 0.0), 1.4, 0.006, px(700), px(1050))
pot(E4, ew('night', 'Only if test passes', 0.4), 0.65, px(880)); tick(ew('night', 'Only if test passes', 0.45), 0.009, px(1100))
slide(ew('night', 'go on to production', 0.0), 0.6, 0.007, px(1150), px(1250))
knock(C4, ew('waits', 'it waits', 0.05), 0.85, px(1500)); tap(ew('waits', 'until a release approver', 0.05), 0.008, px(1500))
slide(ew('noor', 'On Wednesday morning', 0.0), 0.5, 0.006, px(1650), px(1700))
pot(C4, ew('noor', 'Noor approves', 0.2), 0.9, px(1500)); nail(G5, ew('noor', 'Noor approves', 0.3), ew('noor', 'Noor approves', 2.6), 0.85, px(1500))
tick(ew('noor', 'Noor approves', 0.4), 0.009, px(1500)); lock(ew('noor', 'Whoever starts', 0.05), 0.012, px(700))
card(ew('signs', 'sign in to Databricks', -0.2), 0.011, px(870))
for word, off in (('its own service principal', -0.4), ('its own service principal', 0.0), ('its own service principal', 0.6)):
    tap(ew('signs', word, off + 0.05), 0.007, px(870))
lock(ew('signs', 'no secret to steal', 0.05), 0.011, px(870))
card(ew('bundle', 'deploys the project', -0.3), 0.011, px(1540)); tick(ew('bundle', 'as a bundle', 0.3), 0.008, px(1300))
tick(ew('bundle', 'runs the build', 0.6), 0.008, px(1300))
pots((C4, E4, G4, C5), ew('bundle', 'runs the build', 0.55), 0.8, stag=0.22); nail(C6, ew('bundle', 'runs the build', 0.8), ew('bundle', 'runs the build', 3.0), 0.6, px(1540))
card(ew('reads', 'only reads production', -0.3), 0.011, px(1040)); lock(ew('reads', 'only reads production', 0.05), 0.011, px(900))
tap(ew('reads', "the release's job", 0.05), 0.008, px(850)); tick(ew('reads', "a person's yes", 0.1), 0.009, px(1200))

# =============================================================================================================================
# 7. An agent proposes, a person releases: since Wednesday, the plan, at the chapter's turn: C, warm; 263 more classes; the 31 units
#    still to set. The path again, each station as it's said: the evidence set down, a knock; checks, a diff, the review, each set in
#    place; approval and the second person's release, lifted and bowed. For agents, as for people. The lesson: the mark, the last time, and
#    the end card on the C chord it completes, the bow on E
ow = lambda lid, word, off=0: W('close', lid, word, off)
oc = lambda lid, off=0: G('close', lid, off)
tap(ow('faculties', 'Since Wednesday', 0.05), 0.008, px(200))
sheet(ow('faculties', 'the faculties', -0.1), 0.013, px(550), 0.5)
pots((E4, C5, G5), ow('faculties', 'the faculties', -0.15), 0.75, stag=0.3)
card(ow('faculties', 'two hundred', 0.0), 0.012, px(1400)); tick(ow('faculties', 'a place for every student', 0.1), 0.009, px(1300))
card(ow('faculties', 'a list of the thirty-one', 0.0), 0.012, px(1400))
slide(oc('path', 0.2), 0.8, 0.007, px(300), px(1650))
knock(C4, ow('path', 'evidence', 0.05), 0.8, STN[0])
tap(ow('path', 'checks', 0.05), 0.008, STN[1]); tap(ow('path', 'a diff', 0.05), 0.008, STN[2]); tap(ow('path', 'a review', 0.05), 0.008, STN[3])
pot(C5, ow('roles', 'approval', 0.05), 0.75, STN[4]); nail(E5, ow('roles', 'approval', 0.1), ow('roles', 'approval', 1.5), 0.7, STN[4])
pot(C4, ow('roles', "a second person's release", 0.05), 0.85, STN[5])
nail(G5, ow('roles', "a second person's release", 0.15), ow('roles', "a second person's release", 2.0), 0.7, STN[5])
tap(ow('both', 'For agents', 0.05), 0.008, px(700)); tap(ow('both', 'for people', 0.05), 0.008, px(1220))
# an agent proposes; a person releases: the mark, the last time
mark(C4, ow('lesson', 'An agent proposes', 0.05), ow('lesson', 'A person releases', 0.05), pan=0.0)
nail(E5, ow('lesson', 'A person releases', 0.15), ow('lesson', 'A person releases', 2.6), 0.8, 0.0)
pots((C4, E4, G4, C5), oc('breath', 0.4), 0.8, stag=0.35); nail(G5, oc('breath', 1.2), oc('breath', 3.6), 0.65, 0.0)
