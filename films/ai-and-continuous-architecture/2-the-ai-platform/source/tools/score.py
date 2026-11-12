# The AI platform: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# This film's palette, reserved on 12 November 2026 in the four architecture series' palettes (the project's
# enterprise-architecture/new-architecture-series/palettes.md): tuned flowerpots and an ocarina, both made here (music.py has neither).
# Film 1 played the series' first palette (low strings, a soft horn, a harp and a celesta), all of them already on the site; from this
# film on, each film takes its own. Nothing new fitted, so this film pairs two instruments the site has, which no film pairs and no film
# of this topic plays (Every change through review's flowerpots, with a nail violin; Memory: from one chat to the team's ocarina, with a
# viola d'amore). That pairing is the palettes file's exception, written down as an assumption in the film's assumptions file.
#  - The flowerpots (pot(), pots()): pots of fired clay, each chosen for its note, hung on cords so each rings free, and struck softly
#    with felt mallets. The clay's own note; two higher modes a little out of line with it (2.29 and 3.95 times it), which die within a
#    few tenths of a second; and a soft touch of the felt. Each rings for three to five seconds, the bigger, lower pots a little longer,
#    low (A 3 to E 5). They are never set down, so they never knock (Every change through review's pots knock when they're set down, and
#    ring only when lifted: these hang, and only ring). They spread each chord from the bass up, a mallet to each, under the opening
#    story and at a chapter's turn, and give one note as a thing is made or set in place.
#  - The ocarina (phrase()): a twelve-hole alto, breathed softly with no vibrato, in a small room: slurred phrases of two to four notes
#    on one breath (A 4 to C sharp 6), each note starting on its pitch, the breath outlasting the last note a moment (Memory: from one
#    chat to the team's ocarina gives each note its own breath, dry, and stops with it). It answers the pots: what the people in the
#    story do with what was made, the king rebuilding, a tower wrapped in the same brick, what each agent is for, an owner answering.
#  - Both are fired clay, one struck and one breathed, as one baked brick went into a river wall and a temple-tower. The film's own
#    figure, once in Babylon and once at the end, says it: the same three pots struck (A, C sharp, E), then the ocarina playing the same
#    three notes. The series' mark, four notes rising like a tower's tiers (a fifth, a fourth and a third: A, E, A, C sharp), is on the
#    pots, the ocarina taking its last note.
#  - A major, F sharp minor for what goes wrong (the rain carrying the wall away; the model retired with nobody told), tuned pure from A
#    (jf()). The chords used (A, D, E and F sharp minor) are all pure in this tuning; B is never held with D or F sharp, whose third and
#    fifth would beat, so there's no B minor.
# The films' sound (the author's rule, 20 October 2026, and the review of 4 November 2026):
#  - Music plays under the opening story, a chord or a note to each picture. After it, music comes now and then: a chapter's chord as it
#    turns, a note under a moment on screen, or a phrase at a pause. Nothing is held under the explaining, and nothing pulses (film.json
#    lists no "urgent" chapter: nothing in this film is a rush).
#  - Nothing trembles: no vibrato and no roll; every chord is tuned pure, and every note, and each note of a phrase, keeps its own level
#    in the room.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears, from the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed.
#  - Everything stays low and soft: water, wet clay and fired brick, the rain as one soft texture, paper and muffled keys, below about
#    2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text(encoding='utf-8'))
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(22)  # this film's own randomness: the room, the breath, the rain

# ---- tuning: just intonation from A 3 (220 Hz, as A = 440 Hz tunes it), so a chord's notes are whole-number ratios of each other and
# nothing beats. Every pitch comes from this one scale, so a note two chords share is the same in both
JI = [1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8]
def jf(m):
    """the frequency of MIDI note m, tuned pure from A"""
    o, d = divmod(m - 57, 12)
    return 220.0 * 2.0 ** o * JI[d]

# ---- the levels: the pots about as far under the voice as the series' other music (matched by loudness, as tools/quiet.py measures
# it); the ocarina a little under the pots, since a breathed note holds where a struck one dies away
PT, OC = 0.055, 0.024

# a small room round the pots and the ocarina, ringing on for about a second. Its level is set by what it rings under 1.5 kHz (its gain
# there about one), so a note keeps its level (the lesson of Plan, define the check, do, check: a room scaled by all it rings rang
# about 12 dB louder there than its share said)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.016 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3000)
def _room(s, room):
    if not room:
        return s
    return np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
def _rms1(x):
    """noise scaled to an RMS of one"""
    x = np.asarray(x, np.float64); return x / max(1e-12, float(np.sqrt((x ** 2).mean())))
def _ms(x):
    return max(1e-12, float((np.asarray(x, np.float64) ** 2).mean()))

# ---- a flowerpot hung on its cord, struck with a felt mallet. Its note is the clay's lowest mode; two higher modes, a little out of line
# with the note (2.29 and 3.95 times it, each pot's own a little apart), sound with the strike and die within a few tenths of a second,
# so they colour the note without ringing against any other. The felt meets the clay over a few milliseconds, with a soft touch of its
# own. Hung free, the pot rings for three to five seconds (a bigger, lower pot a little longer). Returned dry
def _pot(m):
    f = jf(m); pr = np.random.default_rng(900 + m)  # this pot's own clay: its modes and its level
    lev, r2, r3 = 10 ** (pr.uniform(-0.6, 0.6) / 20), 2.29 * pr.uniform(0.99, 1.01), 3.95 * pr.uniform(0.99, 1.01)
    big = min(1.0, max(0.0, (440 - f) / 220))
    tau = 0.52 + 0.2 * big
    n = int((6.9 * tau + 0.1) * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for r, a, d in ((1.0, 1.0, tau), (r2, 0.22, 0.16), (r3, 0.08, 0.07)):
        if f * r < 2000:
            sig += a * np.exp(-x / d) * np.sin(2 * np.pi * f * r * x + pr.uniform(0, 2 * np.pi))
    sig *= 1 - np.exp(-x / 0.0035)
    touch = _rms1(filt(pr.standard_normal(n).astype(np.float32), 'band', (f * 0.9, min(1800, f * 3.0)), 2)) * np.exp(-x / 0.004)
    sig += 0.07 * touch
    return norm(filt(sig.astype(np.float32), 'low', 1800, 2)) * lev
def pot(m, s, g=1.0, pan=None, room=0.28):
    """a pot struck at s; in the room, set back to its own level over its first second (the room's echoes meet a pot's note as they
    meet a held one's, a little louder or quieter by its pitch)"""
    dry = _pot(m); wet = _room(dry, room); a, b = int(0.02 * SR), int(0.9 * SR)
    wet = wet * float(np.sqrt(_ms(dry[a:b]) / _ms(wet[a:b])))
    put(wet.astype(np.float32), s, g * PT, max(-0.6, min(0.6, (m - 66) * 0.03)) if pan is None else pan)
def pots(notes, s, g=1.0, stag=0.16, pan=0.0):
    """a chord on the pots, spread from the bass up, a mallet to each: the first, then the others a moment apart, a little across the
    stereo field by their pitch, round pan"""
    for i, m in enumerate(notes):
        pot(m, s + stag * i, g * (1.0 if i == 0 else 0.86), max(-0.6, min(0.6, pan + (m - 66) * 0.025)))

# ---- the ocarina: a vessel of fired clay, breathed. Its note is nearly a pure tone (a Helmholtz resonator's), with a little of the
# second and third harmonics; the breath comes in over 70 ms and holds level, with no vibrato. A phrase is slurred on one breath: each
# note starts on its pitch, the fingers moving it there in about 25 ms with the slightest dip of the tone, and the breath goes on a
# moment after the last note. A thread of breath noise round the notes, more as it starts. Returned dry, with each note's body
def _phrase(notes, att=0.07, rel=0.09):
    tot = sum(d for _, d in notes); n = int((tot + rel + 0.25) * SR); x = np.arange(n, dtype=np.float64) / SR
    lf = np.empty(n); t0 = 0.0; edges, bodies = [], []
    for i, (m, d) in enumerate(notes):
        a = int(round(t0 * SR)); b = n if i == len(notes) - 1 else int(round((t0 + d) * SR))
        lf[a:b] = np.log(jf(m))
        e = int(round((t0 + d) * SR)); bodies.append((a + int(0.06 * SR), max(a + int(0.06 * SR) + 1, e - int(0.04 * SR))))
        if i:
            edges.append(t0)
        t0 += d
    k = int(0.025 * SR); ker = np.hanning(k); ker /= ker.sum()
    lf = np.convolve(np.pad(lf, (k, k), mode='edge'), ker, mode='same')[k:-k]
    ph = 2 * np.pi * np.cumsum(np.exp(lf)) / SR
    tone = np.sin(ph) + 0.04 * np.sin(2 * ph + 0.3) + 0.015 * np.sin(3 * ph + 0.9)
    env = np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2 * np.cos(0.5 * np.pi * np.clip((x - tot) / rel, 0, 1)) ** 2
    for e in edges:
        env = env * (1 - 0.12 * np.exp(-((x - e) / 0.02) ** 2))
    f0, f1 = min(jf(m) for m, _ in notes), max(jf(m) for m, _ in notes)
    br = _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (f0 * 0.7, min(2400, f1 * 1.5)), 2))
    benv = ((0.014 + 0.05 * np.exp(-x / 0.05)) * np.sin(0.5 * np.pi * np.minimum(1, x / 0.03)) ** 2
            * np.cos(0.5 * np.pi * np.clip((x - tot - 0.03) / (rel + 0.12), 0, 1)) ** 2)
    return filt((tone * env + br * benv).astype(np.float32), 'low', 2400, 2), bodies
def phrase(notes, s, g=1.0, pan=0.12, room=0.16):
    """the ocarina, a phrase slurred on one breath from s: [(note, seconds), ...]. In the room, each note is set back to its own level,
    measured over its body, so no note of the phrase is made louder or quieter than the others by where the room's echoes meet it"""
    dry, bodies = _phrase(notes); wet = _room(dry, room)
    pts = [0.5 * (a + b) for a, b in bodies]; ks = [np.sqrt(_ms(dry[a:b]) / _ms(wet[a:b])) for a, b in bodies]
    put((wet * np.interp(np.arange(len(wet)), pts, ks)).astype(np.float32), s, g * OC, pan)

def figure_pots(s, g=1.0, pan=0.0):
    """the film's own figure, first half: the three pots, A, C sharp and E, struck one after another"""
    pots((57, 61, 64), s, g, 0.55, pan)
def figure_oc(s, g=1.0, pan=0.1):
    """and its second: the ocarina playing the same three notes, an octave up, on one breath"""
    phrase([(69, 0.55), (73, 0.55), (76, 1.8)], s, g, pan)
def mark(s, g=1.0):
    """the series' mark: four notes rising like a tower's tiers, a fifth, a fourth and a third (A, E, A, C sharp): three pots, and the
    ocarina taking the last"""
    for i, m in enumerate((57, 64, 69)):
        pot(m, s + 0.45 * i, g, (i - 1.0) * 0.14)
    phrase([(73, 2.4)], s + 1.35, g, 0.16)

# chords (MIDI note numbers), each spread on the pots from the bass up
A_1, A_2, A_3 = (57, 61, 64, 69), (61, 64, 69, 73), (64, 69, 73, 76)        # A major: the city, the fix, what's made once
D_1, D_2, D_3 = (62, 66, 69, 74), (57, 62, 66, 69), (66, 69, 74)            # D major
E_1, E_2, E_3 = (59, 64, 68, 71), (64, 68, 71, 76), (68, 71, 76)            # E major: a question, a need
F_1, F_2, F_3 = (61, 66, 69, 73), (57, 61, 66), (66, 69, 73)                # F sharp minor: what goes wrong

# ---- the sounds on screen: soft, low, one at a time (soft() keeps what's made here from noise under about 2.2 kHz, steeply)
soft = lambda sig: filt(np.asarray(sig, np.float32), 'low', 2200, 4)
def mud(s, g=0.018, pan=0.0):
    """wet clay pressed into a mould: a soft, low slap"""
    x = tt(0.3); X(norm(filt(noise(0.3), 'low', 700) * np.exp(-x * 18) + 0.6 * np.sin(2 * np.pi * 120 * x) * np.exp(-x * 25)), s, g, pan)
def brick(s, g=0.016, pan=0.0):
    """a fired brick set down on another: a dry, low knock and a little grit"""
    x = tt(0.2); X(norm(filt((np.sin(2 * np.pi * 300 * x) * np.exp(-x * 45) + 0.5 * filt(noise(0.2), 'band', (400, 1500)) * np.exp(-x * 50)).astype(np.float32), 'low', 1600)), s, g, pan)
def basket(s, sec=1.2, g=0.012, pan=0.0):
    """a reed basket carried: a soft creak of the weave, swelling and settling with the steps"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (500, 1500)) * np.sin(np.pi * x / sec) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 1.6 * x)) ** 2), s, g, pan)
def water(s, sec=3.0, g=0.014, pan=0.0):
    """the river along the bank: low water lapping, rising and falling slowly"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 700)) * np.sin(np.pi * x / sec) ** 2 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * x)), s, g, pan)
def fire(s, sec=2.4, g=0.014, pan=0.0):
    """the kiln's fire: a low breath that swells as it's stoked"""
    x = tt(sec); X(filt(noise(sec), 'band', (70, 450)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def smear(s, sec=0.7, g=0.011, pan=0.0):
    """bitumen spread with a trowel: a slow, low, sticky drag"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (150, 700)) * np.sin(np.pi * x / sec) ** 2 * (0.75 + 0.25 * np.cos(2 * np.pi * 2.2 * x))), s, g, pan)
def slump(s, sec=3.4, g=0.012, pan=0.0):
    """a wall of mud brick giving way in the rain: a low, wet slide that swells and settles"""
    x = tt(sec); X(filt(noise(sec), 'band', (70, 380)) * np.sin(0.5 * np.pi * np.minimum(1, x / (sec * 0.35))) * np.exp(-np.maximum(0, x - sec * 0.35) * 1.4), s, g, pan)
def rain(s, sec, g=0.006, pan=0.0, att=1.6, rel=2.4, ease=0.6, at=None):
    """rain: one soft texture, a steady fall of water with a low body, in over att and out over rel, nothing in it ticking; it eases to
    ease of its level from at (seconds into it) on"""
    x = tt(sec); hi = filt(noise(sec), 'band', (350, 2000)); lo = filt(noise(sec), 'band', (90, 400))
    e = np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2 * np.cos(0.5 * np.pi * np.clip((x - (sec - rel)) / rel, 0, 1)) ** 2
    if at is not None:
        e = e * (1 - (1 - ease) * np.clip((x - at) / 2.0, 0, 1))
    X(soft((0.8 * hi + 0.5 * lo) * e), s, g, pan)
def scrape(s, sec=0.9, g=0.009, pan=0.0):
    """a trowel drawn over old brickwork: a soft, dry scrape"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (400, 1600)) * np.sin(np.pi * x / sec) ** 2), s, g, pan)
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft wooden knock, for a card or a window arriving"""
    s_knock(s, g, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled key, or a mark set beside a row"""
    s_tap(s, g, pan)
def paper(s, g=0.013, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (250, 2000)) * np.sin(np.pi * x / sec) ** 2), s, g, pan)
def pencil(s, g=0.006, pan=0.0, sec=0.5):
    """a pen on a note: a soft, short scratch"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (500, 1900)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec)), s, g, pan)
def air(s, sec=0.9, g=0.010, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g, pan, 140, 900)
def press(s, g=0.014, pan=0.0):
    """a stamp or a stop: a low thud and a knock, nothing bright"""
    x = tt(0.3); X(norm(np.sin(2 * np.pi * np.cumsum(60 + 60 * np.exp(-x * 30)) / SR) * np.exp(-x * 14)), s, g, pan); s_knock(s + 0.01, g * 0.4, pan, 200)
def click(s, g=0.011, pan=0.0):
    """a switch thrown, or a lock closed: two muffled clicks, close together"""
    s_tap(s, g, pan); s_knock(s + 0.04, g * 0.5, pan, 420)
def slot(s, g=0.010, pan=0.0):
    """an element set in its place: a short, soft slide and a low knock as it settles"""
    x = tt(0.22); X(soft(filt(noise(0.22), 'band', (300, 1500)) * np.sin(np.pi * x / 0.22) ** 2), s, g * 0.8, pan); s_knock(s + 0.18, g * 0.7, pan, 240)
def typing(s, sec, g=0.005, pan=0.0, seed=3):
    """someone typing: muffled keys in a human rhythm, quicker and slower, with a short stop between words"""
    r = np.random.default_rng(seed); t0 = s
    while t0 < s + sec:
        s_tap(t0, g * r.uniform(0.7, 1.1), pan + r.uniform(-0.05, 0.05))
        t0 += r.uniform(0.11, 0.19) + (r.uniform(0.15, 0.3) if r.random() < 0.18 else 0)


# 1. Mud and fired brick: the opening, a chord or a note to each picture. Babylon at dawn, across the river: A, and the river; the
#    ocarina as the king is named, rebuilding. The two walls: D; the brickfield, its moulder and carrier: an open fifth, wet clay and a
#    basket; the inner wall's hundred million bricks: E. The rain: F sharp minor, and the rain itself, one soft texture, for as long as
#    it falls on screen; a falling fourth and the wall's slow slide as it's carried away, and the ocarina falling at the king's "heap of
#    ruins". The people inside: F sharp minor again, and its low A for "neither enemies nor the river". The need: D, then E, waiting; the
#    fired brick: A, with a knock, the kiln's fire and the bitumen's drag for its three cards, and the boat that brings the bitumen. The
#    river wall: D, then the film's figure, the three pots, as the embankment of baked brick is built, a brick set down for each course;
#    the tower wrapped in the same brick: the ocarina plays the same three notes. The skin: a note. The embankment holds: A, and the
#    storm again over the river; the dig, two and a half thousand years later: a low note, a trowel and a brush; his bricks, still in
#    place: a fifth. Then the present: D as the six agents come in, a note for their roles, a note for each thing under every one (a
#    model, tools, memory, search), A as they're made once and shared, and the ocarina for what stays each agent's own; under the
#    title, the series' mark
K = 'brick'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
pots(A_1, 0.6, 0.9, 0.3, 0.0)
water(0.5, 4.2, 0.012, 0.0)
phrase([(69, 0.5), (71, 0.5), (73, 1.6)], w('city', 'Nabopolassar', -0.1), 0.9, 0.1)
pots(D_1, wc('walls', -0.3), 0.85, 0.2, -0.2)
tMb = w('walls', 'mud brick')
pots((57, 64), tMb - 0.5, 0.75, 0.35, -0.3)
basket(tMb - 0.1, 1.4, 0.011, px(336)); mud(tMb + 0.3, 0.016, px(726)); mud(tMb + 1.0, 0.013, px(726))
pots(E_1, w('count', 'inner wall', -0.2), 0.85, 0.2, 0.2)
tR, tNe = wc('rain'), wc('need')
pots(F_1, tR - 0.5, 0.9, 0.2, 0.0)
rain(tR + 0.1, tNe + 0.4 + 2.4 - (tR + 0.1), 0.006, 0.0, 1.6, 2.4, 0.55, w('rain', 'heap of ruins') - tR)
tCa = w('rain', 'carried', -0.3)
pots((66, 61), tCa, 0.8, 0.4, 0.1); slump(tCa + 0.2, 3.4, 0.012, px(1240))
phrase([(78, 0.45), (76, 0.45), (73, 1.7)], w('rain', 'heap of ruins', -0.2), 0.85, 0.15)
pots(F_2, wc('harm', -0.2), 0.8, 0.2, 0.25)
pot(57, w('harm', 'neither', -0.2), 0.75, px(1240))
pots(D_2, wc('need', 0.2), 0.8, 0.2, 0.1)
pots(E_2, w('need', 'needed', -0.2), 0.8, 0.2, 0.0)
pots(A_2, wc('fired', -0.3), 0.9, 0.18, 0.0)
tBa, tKi, tBi = w('fired', 'baked', -0.3), w('fired', 'kilns', -0.3), w('fired', 'bitumen', -0.3)
brick(tBa + 0.1, 0.014, px(360)); fire(tKi, 2.4, 0.013, px(960)); smear(tBi + 0.15, 0.7, 0.011, px(1560))
water(w('fired', 'bitumen', -0.6), 3.6, 0.012, px(1500))
pots(D_3, wc('river', -0.1), 0.8, 0.2, -0.2)
tEm = w('river', 'embankment')
figure_pots(tEm, 0.95, -0.2)
for i in range(3):
    brick(tEm + 1.4 + 0.8 * i, 0.012 - 0.001 * i, px(700 + 90 * i))
tWr = w('tower', 'wrapped', -0.2)
figure_oc(tWr, 0.95, px(1300) * 0.6)
knock(tWr, 0.009, px(1370), 180)
pot(69, w('tower', 'sixteen', -0.3), 0.7, px(1400) * 0.6)
pots(A_3, w('held', 'protected', -0.2), 0.9, 0.18, 0.0)
water(wc('held', 0.2), 3.8, 0.014, 0.0)
tX = w('held', 'two and a half', -0.2)
rain(wc('held', 0.4), tX + 1.4 - wc('held', 0.4), 0.004, 0.0, 1.4, 1.4)
pot(57, tX + 0.3, 0.8, 0.0)
scrape(tX + 0.6, 0.9, 0.008, px(860)); scrape(w('held', 'archaeologists', 0.1), 0.7, 0.007, px(1060))
pots((64, 69), w('held', 'still in place', -0.1), 0.8, 0.35, 0.0)
tN = wc('now')
pots(D_1, tN - 0.3, 0.85, 0.18, 0.0); air(tN - 0.4, 1.3, 0.009, 0.0)
pot(66, w('now', 'role', -0.1), 0.7, 0.0)
for word, m, x in [('a model', 64, 700), ('tools', 69, 880), ('memory', 73, 1040), ('search', 76, 1220)]:
    pot(m, w('same', word, -0.1), 0.65, px(x) * 0.6)
pots(A_2, w('once', 'made once', -0.1), 0.85, 0.18, 0.0); air(w('once', 'made once', -0.1), 2.2, 0.008, 0.0)
phrase([(76, 0.5), (81, 1.6)], w('once', 'stays its own', -0.1), 0.85, 0.1)
mark(wc('breath', 1.2), 0.95)

# 2. Each its own way: Tomás and Ravi; Ravi's note, with paper, and E, its question, open. Air as the six agents come in a row; a knock
#    for each of the three ways the voice names, as its card arrives, and air as the other three go off their own ways; F sharp minor
#    as the questions nobody can answer come up, and a knock for the second
K = 'ways'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
paper(wc('note', -0.3), 0.012, px(380)); pots(E_1, wc('note', -0.3), 0.8, 0.2, px(380) * 0.5)
air(wc('follow', -0.4), 1.1, 0.009, 0.0)
for lid, x in (('chat', 510), ('key', 900), ('tool', 1300)):
    knock(wc(lid, -0.1), 0.010, px(x))
air(wc('rest', -0.2), 1.0, 0.008, px(1000))
pots(F_2, w('nobody', 'which model', -0.2), 0.8, 0.2, 0.0)
knock(w('nobody', 'what all of it costs', -0.2), 0.009, 0.0, 200)

# 3. A model retired: F sharp minor as the provider's notice comes in, with paper. Three months later: a switch, and a low pot, as the
#    crew planner stops; paper and a pen for the rosters by hand, air as the fourteen jobs slip; F sharp minor, high and thin, as the
#    households are told again; air as the six agents come back with their question marks, and a knock for "nobody can say"
K = 'retired'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
pots(F_1, S0(K) + 0.6, 0.85, 0.2, px(760) * 0.5); paper(S0(K) + 0.5, 0.012, px(760))
tSt = w('stop', 'stops', -0.1)
click(tSt, 0.011, 0.0); pot(57, tSt + 0.05, 0.85, 0.0)
tHa = w('hand', 'by hand', -0.4)
paper(tHa, 0.012, px(380)); pencil(tHa + 0.4, 0.006, px(380), 1.8)
air(w('hand', 'slip', -0.1), 1.4, 0.009, px(1000))
pots(F_3, w('told', 'told again', -0.2), 0.8, 0.2, 0.0)
air(wc('which', -0.2), 1.0, 0.008, 0.0)
knock(w('which', 'Nobody', -0.2), 0.010, 0.0, 200)

# 4. Platform or application: D as the test comes in; a knock for each of its cards, and A as a platform is named. A knock for the
#    tray; a slot for the model as it slides into it, and for tools, memory and search as each is named; D, high, as they're the
#    platform's. Then what each agent is for: a knock for its panel, a key for its purpose, instructions and logic, and the ocarina as
#    its owner answers for it
K = 'test'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
pots(D_2, wc('test', -0.2), 0.8, 0.2, 0.0)
knock(wc('app', -0.2), 0.010, px(510)); knock(wc('plat', -0.2), 0.010, px(1410))
pots(A_1, w('plat', 'a platform', -0.2), 0.8, 0.2, px(1410) * 0.5)
knock(wc('model', -0.3), 0.008, px(1410), 200)
tCu = w('model', 'could use')
slot(tCu + 1.4, 0.010, px(1100))
for lid, word, x in (('tools', 'tools', 1260), ('memory', 'memory', 1420), ('memory', 'search', 1580)):
    slot(w(lid, word, -0.1), 0.009, px(x))
pots(D_3, w('shared', "platform's", -0.2), 0.8, 0.2, px(1410) * 0.5)
knock(wc('own', -0.2), 0.010, px(510))
for word in ('purpose', 'instructions', 'logic'):
    tap(w('own', word, -0.2), 0.008, px(360))
phrase([(71, 0.45), (73, 0.45), (69, 1.5)], w('own', 'owner', -0.2), 0.85, px(380) * 0.4)

# 5. Under every agent: A, and air, as the map builds; a slot for each of the platform's services as it's named; air as the agents' lines reach
#    down to the services they use; D as the platform is drawn once, under all of them; and a note for "which service"
K = 'map'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
pots(A_2, S0(K) + 0.6, 0.8, 0.2, 0.0); air(S0(K) + 0.6, 1.6, 0.009, 0.0)
for word, x in (('reach a model', 1020), ('call a tool', 1220), ('remember', 1420), ('search', 1620)):
    slot(w('foot', word, -0.1), 0.008, px(x))
air(w('apps', 'using', -0.2), 1.4, 0.008, px(1300))
pots(D_1, w('once', 'under all of them', -0.2), 0.8, 0.2, 0.0)
pot(76, w('part', 'which service', -0.1), 0.7, px(1300) * 0.6)

# 6. One door to every model: air as the gateway slides in, and A as it's named, one door; air as the calls go through it; a key for the
#    agent's identity; keys as the log writes each call down; a stop and a low pot as the agent stuck in a loop meets its limit; a
#    stop as the model with no terms dims, and paper for the utility's terms; air as the vendor's model moves behind the gateway, and the
#    ocarina as it's there
K = 'gateway'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(w('gate', 'gateway', -0.2), 1.8, 0.009, 0.0)
pots(A_1, w('gate', 'one door', -0.1), 0.85, 0.2, 0.0)
air(w('gate', 'goes through', -0.4), 1.2, 0.007, 0.0)
tap(w('id', 'identity', -0.3), 0.010, px(1052))
typing(w('log', 'which agent', -0.2), 2.6, 0.005, px(330), seed=5)
tLm = w('limit', 'stuck', 1.3)
press(tLm, 0.012, px(1100)); pot(57, tLm + 0.02, 0.8, px(1100) * 0.5)
press(w('allow', 'only models', -0.1), 0.011, px(1230))
paper(w('allow', 'terms', -0.2), 0.012, px(1672))
tVe = w('vendor', 'set to', -0.2)
air(tVe, 1.8, 0.009, px(600))
phrase([(73, 0.45), (69, 1.5)], tVe + 1.7, 0.85, px(1060) * 0.4)

# 7. The next retirement: the room glides on. Paper for the notice, and a low pot as the model's retirement is shown; a key for each of
#    the three agents the log shows; a knock for the replacement; a key for each tick as each agent's checks pass; a key for each owner
#    who agrees; A, and air, as all three move; and the ocarina for "no household told twice"
K = 'swap'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tRe = w('next', 'retires')
paper(tRe - 0.1, 0.012, px(1672)); pot(61, tRe, 0.8, px(890) * 0.5)
for i in range(3):
    tap(w('three', 'log', -0.2 + 0.25 * i), 0.008, px(330))
knock(w('checks', 'replacement', -0.3), 0.010, px(1390))
for i, x in enumerate((540, 820, 1660)):
    tap(w('checks', 'results', -0.2 + 0.3 * i), 0.009, px(x + 76))
for i, x in enumerate((540, 820, 1660)):
    tap(w('move', 'owners agree', -0.2 + 0.2 * i), 0.007, px(x - 70))
tAl = w('move', 'all three', -0.2)
pots(A_3, tAl, 0.85, 0.2, 0.0); air(w('move', 'move', -0.2), 1.2, 0.009, px(1100))
phrase([(76, 0.45), (81, 1.6)], wc('none', 0.2), 0.85, px(1672) * 0.4)

# 8. Who owns what: no music, as the room holds. A knock as Ravi's team is named, and a pen as the line round the platform is drawn; a
#    knock for the owners as they come in; a key for each, the head of retail and Grace; and keys as each team's costs come up
K = 'owners'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
pencil(w('platform', 'owner', -0.2), 0.005, px(1050), 1.2)
knock(w('platform', "Ravi's team", -0.2), 0.010, px(1050))
knock(w('agents', 'owner', -0.2), 0.009, px(960), 220)
tap(w('agents', 'head of retail', -0.1), 0.008, px(260)); tap(w('agents', 'Grace', -0.1), 0.008, px(820))
typing(w('cost', 'each team', -0.6), 1.4, 0.005, px(330), seed=8)

# 9. On Databricks: a knock as its window opens, and E, high, as the door comes back; a slot as Unity Catalog's pane fills; keys as the
#    models' rows come in, a key for their limits, and air for their calls; a knock for each of the split's two tags, and one for the
#    fallback; paper and keys for the tools' page, and a lock as they take the data's permissions; and paper and keys for the last
#    page (no note as the same gateway lights: Babylon's figure comes eight seconds later)
K = 'dbx'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
knock(S0(K) + 0.3, 0.010, 0.0)
pots(E_3, S0(K) + 0.8, 0.8, 0.2, px(1160) * 0.5)
slot(w('ug', 'Unity Catalog', -0.3), 0.009, px(300))
typing(w('teams', 'which models', -0.2), 1.0, 0.005, px(900), seed=11)
tap(w('teams', 'limits', -0.2), 0.008, px(1250))
air(w('teams', 'keeps track', -0.2), 0.9, 0.007, px(1600))
knock(wc('split', -0.2), 0.009, px(780)); knock(wc('split', 0.05), 0.008, px(1000))
knock(w('split', 'fall back', -0.2), 0.009, px(780), 210)
paper(wc('tools', -0.1), 0.011, px(900)); typing(wc('tools', 0.3), 0.9, 0.005, px(800), seed=12)
click(w('tools', 'same permissions', -0.2), 0.010, px(452))
paper(wc('any', -0.1), 0.011, px(900)); typing(wc('any', 0.3), 0.6, 0.005, px(1500), seed=13)

# 10. One brick, many purposes: Babylon again, the river at dawn, and a brick set down for the one baked brick; the film's figure
#     again, the three pots as the river wall lights, and the ocarina playing the same three notes as the temple-tower lights. Then the
#     present: D as the six agents come back on one platform, and in the pause, as each one's purpose lights, the ocarina
K = 'brickback'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
water(S0(K) + 0.4, 3.6, 0.012, 0.0)
brick(S0(K) + 1.15, 0.013, 0.0)
tRw = w('same', 'river wall', -0.1)
figure_pots(tRw, 0.95, px(520) * 0.5)
figure_oc(max(w('same', 'temple-tower', -0.1), tRw + 1.7), 0.95, px(1100) * 0.4)
pots(D_1, wc('agents', -0.4), 0.8, 0.2, 0.0); air(wc('agents', -0.4), 1.3, 0.008, 0.0)
phrase([(73, 0.5), (76, 1.7)], wc('breath', 0.2), 0.8, 0.0)

# 11. The AI platform: A as Ravi's note gets its answer, with paper, and a pen as the answer is written; under the end card, without
#     words, the series' mark
K = 'end'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tAn = wc('answer')
pots(A_2, tAn + 0.3, 0.85, 0.2, px(1040) * 0.5); paper(tAn + 0.3, 0.012, px(1040))
pencil(tAn + 0.6, 0.005, px(1040), 5.6)
mark(wc('breath', 0.3), 0.95)

# the effects a little louder, by 6 dB, so they sit where the films the author accepted sit (their loud moments about -45.5 dB, as
# tools/quiet.py measures them)
for _b in (XL, XR):
    _b *= 2.0
