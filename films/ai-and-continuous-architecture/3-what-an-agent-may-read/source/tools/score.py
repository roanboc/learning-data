# What an agent may read: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# This film's palette, reserved on 12 November 2026 in the four architecture series' palettes (the project's
# enterprise-architecture/new-architecture-series/palettes.md): a viola d'amore and tuning forks on their boxes, both made here. Nothing
# new fitted, so this film pairs two instruments the site has, which no film pairs and no film of this topic plays (Memory: from one
# chat to the team's viola d'amore, with an ocarina; What they tell us about ourselves' tuning forks, with a Mellotron's flute tape).
# That pairing is the palettes file's exception, written down as an assumption in the film's assumptions file.
#  - The viola d'amore (viola(), stop()): the bowed alto of about 1700, its seven playing strings tuned to a D major chord (A 2, D 3,
#    A 3, D 4, F sharp 4, A 4, D 5), and seven more beneath them that no one touches, tuned the same. When a bowed note is one of
#    theirs, or the same note an octave or two away, those strings ring with it in sympathy and go on ringing after the bow lifts; a
#    note that matches none of them gets no answer, and stops with the bow. Bowed softly and held level, with no vibrato: double stops
#    spread from the bass up under the opening story and at a chapter's turn, and a single note under a moment on screen. Memory's
#    viola d'amore plays phrases, one note at a time, over strings tuned to B major; this one plays in D, and is heard for which notes
#    the strings beneath answer: the copy checked against its original, and a reader that answers only to what it's meant to read.
#  - The tuning forks (fork()): forks on wooden resonator boxes, struck softly with felt: one pure note each, the faintest clang of the
#    fork's high mode gone in a moment, and damped by hand after two or three seconds, so none is held under the voice. What they tell
#    us about ourselves' forks are struck in the hand, set on their boxes and ring four seconds or more, under a Mellotron. Here they
#    are the measure a bowed note is checked against: the A fork gives 440 Hz, and the small tool's one answer is a fork's one note.
#  - The film's own figure (figure()), once in Uruk and once near the end: a fork gives a note, the viola d'amore plays the same note,
#    and the strings beneath answer it: copied, and checked. The series' mark (mark()), under the title and the end card: three forks
#    rising a fifth and a fourth (D, A, D), and the viola d'amore taking the third above them (F sharp), answered.
#  - D major, B minor for what goes wrong (a copy of a copy; the old price; a stranger told a household's medical needs), tuned pure
#    from D (jf()). The chords used (D, G, A and B minor) are all pure in this tuning; E is never held with G or B, whose third and
#    fifth would beat, so there's no E minor. The copies that nobody checked play notes the strings beneath don't answer (G, E, C sharp),
#    and so does what the chat never reads (B).
# The films' sound (the author's rule, 20 October 2026, and the review of 4 November 2026):
#  - Music plays under the opening story, a chord or a note to each picture. After it, music comes now and then: a chapter's chord as it
#    turns, a note under a moment on screen, or a chord at a pause. Nothing is held under the explaining, and nothing pulses (film.json
#    lists no "urgent" chapter: nothing in this film is a rush).
#  - Nothing trembles: no vibrato; every chord is tuned pure, and every note keeps its own level in the room.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears, from the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed.
#  - Everything stays low and soft: a lamp's flame, clay tablets set down, a reed stylus pressed into clay, paper and muffled keys,
#    below about 2.5 kHz.

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
R1 = np.random.default_rng(33)  # this film's own randomness: the room, the bow, the felt, the clay

# ---- tuning: just intonation from D 4 (293.33 Hz, so that the A fork gives 440 Hz), so a chord's notes are whole-number ratios of each
# other and nothing beats. Every pitch comes from this one scale, so a note two chords share is the same in both, and the strings beneath
# are tuned to the same pitches as the notes they answer
JI = [1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8]
def jf(m):
    """the frequency of MIDI note m, tuned pure from D"""
    o, d = divmod(m - 62, 12)
    return 880.0 / 3 * 2.0 ** o * JI[d]

# ---- the levels: the viola d'amore about as far under the voice as the series' other music (matched by loudness, as tools/quiet.py
# measures it); the forks a little under it, since a pure tone holds its level where a bowed one's partials spread it
VL, FK = 0.0235, 0.0175

# a small room round the viola d'amore and the forks, ringing on for about a second. Its level is set by what it rings under 1.5 kHz
# (its gain there about one), so a note keeps its level (the lesson of Plan, define the check, do, check: a room scaled by all it rings
# rang about 12 dB louder there than its share said)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.017 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3000)
def _room(s, room):
    if not room:
        return s
    return np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
def _rms1(x):
    """noise scaled to an RMS of one"""
    x = np.asarray(x, np.float64); return x / max(1e-12, float(np.sqrt((x ** 2).mean())))
def _ms(x):
    return max(1e-12, float((np.asarray(x, np.float64) ** 2).mean()))
def _place(dry, s, g, pan, room, body):
    """a note in the room, set back to its own level over its body (from, to, in samples): the room's echoes meet a held note's own
    sound at its pitch, a little louder or quieter by where they fall, so each note is measured without the room and set back to it"""
    wet = _room(dry, room); a, b = body
    put((wet * float(np.sqrt(_ms(dry[a:b]) / _ms(wet[a:b])))).astype(np.float32), s, g, pan)

# ---- the viola d'amore. The seven strings beneath, tuned as the seven bowed ones: A 2, D 3, A 3, D 4, F sharp 4, A 4, D 5
SYM = (45, 50, 57, 62, 66, 69, 74)
def _answer(m):
    """the strings beneath that answer a bowed note m: each tuned to it, or to it an octave or two away (a string an octave away
    rings where its partials meet the note's, from the higher of the two up, and more faintly). [(its lowest partial there, how
    strongly)], empty for a note that is none of theirs"""
    return [(max(jf(m), jf(q)), (1.0, 0.5, 0.25)[abs(q - m) // 12]) for q in SYM if abs(q - m) % 12 == 0 and abs(q - m) <= 24]
def _viola(m, sec, att=0.3, rel=0.4, ring=3.0):
    """one note bowed for sec seconds, steady, with no vibrato. Its partials fall away as a bowed string's do, shaped by the body (a low
    resonance near 290 Hz, another near 820 Hz), the higher ones speaking a moment after the first; a faint rosin hiss from the bow, a
    little more as the note starts. The strings beneath that answer it (_answer()) build while the bow plays and ring on after it
    lifts, about 10 dB under the bowed note and dying away over ring seconds, their higher partials first, whichever strings answer;
    a note none of them answers ends with the bow, over rel seconds.
    Returned dry, with its body (from, to, in samples)"""
    f = jf(m); ans = _answer(m); n = int((sec + (ring if ans else rel) + 0.4) * SR); x = np.arange(n, dtype=np.float64) / SR
    s = np.zeros(n)
    for k in range(1, int(2300 // f) + 1):
        fk = f * k
        body = 0.6 + 0.45 * np.exp(-((fk - 290) / 130) ** 2) + 0.3 * np.exp(-((fk - 820) / 260) ** 2)
        w = body / k ** 1.1 * (1.0 if fk < 1400 else np.exp(-(fk - 1400) / 360))
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.1 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.7 * (k - 1)) / rel), 1.0)
        s += w * on * off * np.sin(2 * np.pi * fk * x + 0.41 * k)
    s /= max(1e-9, float(np.abs(s[:int(sec * SR)]).max()))
    bow = np.where(x < sec, 1.0, np.exp(-(x - sec) * 16)) * np.minimum(1, x / 0.05)
    s += _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (450, 1800), 2)) * 0.004 * bow * (1 + 1.6 * np.exp(-x / 0.1))
    if ans:
        tot = float(np.sqrt(sum(a * a for _, a in ans)))  # the strings ring in their own phases, so they add as their squares do
        held = np.where(x < sec, 1 - np.exp(-x / 0.45), (1 - np.exp(-sec / 0.45)) * np.exp(-(x - sec) * 4.6 / ring))
        for fr, a in ans:
            ph = R1.uniform(0, 2 * np.pi)
            tone = sum(np.sin(2 * np.pi * fr * j * x + ph * j) / j ** 1.5 * np.exp(-np.maximum(0, x - sec) * 0.9 * (j - 1))
                       for j in range(1, 7) if fr * j < 2300)
            s += 0.6 * a / tot * held * tone
    return filt(s.astype(np.float32), 'low', 2300, 2), (int(min(0.3, 0.4 * sec) * SR), int(sec * SR))
def viola(m, s, sec, g=1.0, pan=-0.1, room=0.3, att=0.3):
    """the viola d'amore, one note bowed from s for sec seconds, in the room"""
    dry, body = _viola(m, sec, att); _place(dry, s, g * VL, pan, room, body)
def stop(notes, s, sec, g=1.0, stag=0.24, pan=-0.1):
    """a double stop, or three strings, spread from the bass up: each note a moment after the one under it, all lifted together"""
    for i, m in enumerate(notes):
        viola(m, s + stag * i, sec - stag * i, g * (1.0 if i == 0 else 0.85), max(-0.6, min(0.6, pan + (m - 62) * 0.02)))

# ---- a tuning fork on its wooden box, struck softly with felt: the felt's soft touch, then one pure note, the box taking it up at
# once; the fork's high mode (6.27 times the note) sounds for a moment with the strike, where it stays under 2.2 kHz; and after ring
# seconds a hand damps it, over a quarter second. Returned dry, with its body
def _fork(m, ring):
    f = jf(m); n = int((ring + 0.3) * SR); x = np.arange(n, dtype=np.float64) / SR
    tone = np.sin(2 * np.pi * f * x + R1.uniform(0, 2 * np.pi)) * (1 - np.exp(-x / 0.03)) * np.exp(-x / 5.0)
    if 6.27 * f < 2200:
        tone += 0.025 * np.sin(2 * np.pi * 6.27 * f * x) * np.exp(-x / 0.025)
    tone += 0.05 * _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (f * 0.8, min(1600, f * 2.5)), 2)) * np.exp(-x / 0.005)
    tone *= np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.25, 1)) ** 2, 1.0)
    return filt(tone.astype(np.float32), 'low', 2200, 2), (int(0.25 * SR), int(ring * SR))
def fork(m, s, g=1.0, ring=2.4, pan=0.0, room=0.2):
    """a fork struck at s and damped ring seconds later, in the room"""
    dry, body = _fork(m, ring); _place(dry, s, g * FK, pan, room, body)

def figure(s, sv, m=69, g=1.0, pan=0.0):
    """the film's own figure: a fork gives the note at s; the viola d'amore plays the same note from sv, the fork damped a moment
    after it comes in, and the strings beneath answer it as the bow lifts: copied, and checked"""
    fork(m, s, g, max(1.6, sv - s + 0.45), pan + 0.15)
    viola(m, sv, 2.4, g, pan - 0.1, att=0.4)
def mark(s, g=1.0):
    """the series' mark: three forks rising a fifth and a fourth (D 4, A 4, D 5), each damped in turn, and the viola d'amore taking
    the third above them (F sharp 5), answered by the strings beneath"""
    for i, m in enumerate((62, 69, 74)):
        fork(m, s + 0.45 * i, g, 2.2 - 0.25 * i, (i - 1.0) * 0.15)
    viola(78, s + 1.35, 2.2, g * 0.9, 0.05, att=0.35)

# chords (MIDI note numbers), each spread on the viola d'amore from the bass up
D_1, D_2, D_3, D_4, D_5 = (50, 57, 66), (57, 66, 74), (62, 69, 78), (62, 66, 69), (50, 62, 69)   # D major: Uruk, the fix
D_6 = (57, 62, 66)
G_1 = (55, 62, 71)                                                                                # G major
A_1 = (57, 64, 73)                                                                                # A major: a need, a question
B_1, B_2 = (47, 54, 62), (59, 66, 74)                                                             # B minor: what goes wrong

# ---- the sounds on screen: soft, low, one at a time (soft() keeps what's made here from noise under about 2.2 kHz, steeply)
soft = lambda sig: filt(np.asarray(sig, np.float32), 'low', 2200, 4)
def lamp(s, sec=3.2, g=0.006, pan=0.0):
    """the oil lamp's flame: a low, soft breath that swells and settles"""
    x = tt(sec); X(filt(noise(sec), 'band', (70, 380))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def clay(s, g=0.014, pan=0.0):
    """a clay tablet set down on wood: a soft, dull knock, lower and drier than a brick's"""
    x = tt(0.22); X(norm(filt((np.sin(2 * np.pi * 190 * x) * np.exp(-x * 40) + 0.35 * filt(noise(0.22), 'band', (250, 900))[:len(x)] * np.exp(-x * 55)).astype(np.float32), 'low', 1200)), s, g, pan)
def stylus(s, k=3, g=0.006, pan=0.0, gap=0.42, seed=1):
    """a reed stylus pressed into soft clay, k wedges: each a short, damp press, low, with a small human unevenness"""
    r = np.random.default_rng(seed); t0 = s
    for _ in range(k):
        x = tt(0.09)
        X(soft(filt(noise(0.09), 'band', (300, 1200))[:len(x)] * np.sin(np.pi * x / 0.09) ** 2 + 0.3 * np.sin(2 * np.pi * 160 * x) * np.exp(-x * 60)), t0, g * r.uniform(0.8, 1.1), pan)
        t0 += gap * r.uniform(0.8, 1.2)
def scrape(s, sec=0.6, g=0.007, pan=0.0):
    """a number smoothed out of wet clay and pressed again: a short, soft drag"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (300, 1300))[:len(x)] * np.sin(np.pi * x / sec) ** 2), s, g, pan)
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft wooden knock, for a card or a window arriving"""
    s_knock(s, g, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled key, or a mark set beside a row"""
    s_tap(s, g, pan)
def paper(s, g=0.013, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2), s, g, pan)
def pencil(s, g=0.006, pan=0.0, sec=0.5):
    """a pen on a note: a soft, short scratch"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (500, 1900))[:len(x)] * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec)), s, g, pan)
def strike(s, g=0.007, pan=0.0, sec=0.4):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec))), s, g, pan)
def air(s, sec=0.9, g=0.010, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g, pan, 140, 900)
def press(s, g=0.014, pan=0.0):
    """a stamp or a stop: a low thud and a knock, nothing bright"""
    x = tt(0.3); X(norm(np.sin(2 * np.pi * np.cumsum(60 + 60 * np.exp(-x * 30)) / SR) * np.exp(-x * 14)), s, g, pan); s_knock(s + 0.01, g * 0.4, pan, 200)
def click(s, g=0.011, pan=0.0):
    """a badge clipped on, a key turned, a lock closed: two muffled clicks, close together"""
    s_tap(s, g, pan); s_knock(s + 0.04, g * 0.5, pan, 420)
def slot(s, g=0.010, pan=0.0):
    """an element set in its place: a short, soft slide and a low knock as it settles"""
    x = tt(0.22); X(soft(filt(noise(0.22), 'band', (300, 1500))[:len(x)] * np.sin(np.pi * x / 0.22) ** 2), s, g * 0.8, pan); s_knock(s + 0.18, g * 0.7, pan, 240)
def crack(s, g=0.009, pan=0.0):
    """a mask that gives way: a short, dull crack, a little grit, and nothing bright"""
    x = tt(0.25); X(soft(filt(noise(0.25), 'band', (350, 1500))[:len(x)] * np.exp(-x * 30)), s, g, pan); s_knock(s + 0.005, g * 0.6, pan, 300)
def frost(s, sec=0.9, g=0.007, pan=0.0):
    """glass frosting over: a soft, high breath, kept under 2 kHz"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (600, 1900))[:len(x)] * np.sin(np.pi * x / sec) ** 2), s, g, pan)
def typing(s, sec, g=0.005, pan=0.0, seed=3):
    """someone typing: muffled keys in a human rhythm, quicker and slower, with a short stop between words"""
    r = np.random.default_rng(seed); t0 = s
    while t0 < s + sec:
        s_tap(t0, g * r.uniform(0.7, 1.1), pan + r.uniform(-0.05, 0.05))
        t0 += r.uniform(0.11, 0.19) + (r.uniform(0.15, 0.3) if r.random() < 0.18 else 0)


# 1. A copy, checked: the opening, a chord or a note to each picture. Uruk at night, the scribe at his tablet by the lamp: D, all three
#    notes answered by the strings beneath, the lamp's flame and his stylus. The tablet he copies: G, and the clay set down; his
#    original from Borsippa: A, answered, and the way it came. Copies made by hand: the original's A again as its card arrives; then
#    the slip, and the copies that carry it, falling (G, E, C sharp), none of them answered; and B minor for the one wrong number. The
#    learning kept for the initiated: an open fifth, and a high F sharp for "not for every eye". What a reader had to know: A, a
#    question, and a knock for each of the three. The film's figure, as he checks his copy: the A fork as the original and his copy
#    come in, the viola d'amore playing the same A as he checks, and the strings beneath answering; a mark set beside each other line.
#    What he writes at its end: the stylus; who may read it: D, as the quote comes in. The tablet today: G, and D for "how far to trust
#    it". The tower's base: A in octaves for the tablet's square, and a fork for the one archaeologists measured. Then the present: D
#    as the chat and the households come in, a key for each question; B, unanswered, for what it reads; and D, F sharp and A, each
#    answered, for what it should read. Under the title, the series' mark
K = 'tablet'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
lamp(0.5, 3.4, 0.006, px(1000))
stop(D_1, 0.6, 4.4, 0.9, 0.26, 0.0)
stylus(0.9, 3, 0.006, px(1060), 0.45, seed=1)
air(0.9, 0.9, 0.008, px(1550))
tSc = wc('scribe')
stop(G_1, tSc, 4.0, 0.85, 0.24, -0.15); clay(tSc + 0.2, 0.013, px(310))
stylus(w('scribe', 'stage by stage', -0.2), 3, 0.005, px(310), 0.5, seed=2)
viola(69, w('from', 'original', -0.2), 2.4, 0.8, px(1100) * 0.5)
air(w('from', 'Borsippa'), 1.8, 0.008, px(1500))
tSl = wc('slip')
clay(tSl - 0.3, 0.012, px(270)); viola(69, tSl - 0.3, 1.6, 0.75, px(270) * 0.5)
clay(w('slip', 'by hand', -0.3), 0.011, px(730))
tSs = w('slip', 'could slip', 0.1)
scrape(tSs, 0.6, 0.007, px(730)); viola(67, tSs, 1.4, 0.7, px(730) * 0.5)
for word, m, x in (('copy of a copy', 64, 1190), ('every slip', 61, 1650)):
    tc = w('chain', word, -0.3); clay(tc, 0.010, px(x)); viola(m, tc, 1.3, 0.68, px(x) * 0.5)
stop(B_1, w('chain', 'one wrong number', -0.2), 4.4, 0.85, 0.26, 0.0)
stop((50, 57), w('few', 'initiated', -0.3), 3.6, 0.8, 0.3, -0.1)
viola(78, w('few', 'not for every eye', -0.3), 2.0, 0.6, 0.1)
stop(A_1, wc('need', -0.2), 4.2, 0.85, 0.24, 0.0); clay(wc('need', -0.2), 0.010, px(820))
for word in ('where', 'checked', 'who it was'):
    knock(w('need', word, -0.3), 0.008, px(1060), 220)
tCk, tK = wc('checked'), w('checked', 'checks')
clay(tCk - 0.3, 0.012, px(460)); clay(tCk - 0.1, 0.011, px(1460))
figure(tCk - 0.1, tK - 0.3, 69, 0.95, 0.0)
for i in range(0, 8, 2):
    tap(tK + 0.32 * i + 0.1, 0.006, px(962))
stylus(w('writes', 'where it came from', -0.3), 5, 0.006, px(1460), 0.44, seed=4)
stop(D_2, wc('who', 0.2), 4.4, 0.85, 0.26, 0.05)
tLa = wc('lasted')
stop(G_1, tLa - 0.4, 3.6, 0.8, 0.24, 0.0)
viola(74, w('lasted', 'how far to trust it', -0.2), 2.2, 0.7, 0.0)
stop((45, 57), w('base', 'a hundred and eighty', -0.3), 3.6, 0.8, 0.3, -0.1)
fork(62, w('base', 'archaeologists', -0.2), 0.85, 2.6, px(1100) * 0.5)
tNo = wc('now')
stop(D_3, tNo - 0.2, 3.6, 0.85, 0.24, 0.0); air(tNo - 0.2, 1.4, 0.008, 0.0)
for word, x in (('bills', 470), ('prices', 850), ('planned work', 1450)):
    tap(w('now', word, -0.3), 0.008, px(x))
tRe = wc('reads')
viola(59, tRe - 0.1, 1.8, 0.75, 0.0); air(tRe - 0.1, 1.0, 0.007, 0.0)
for word, m, x in (('original', 62, 560), ('checked', 66, 960), ('who may read', 69, 1370)):
    viola(m, w('should', word, -0.3), 1.8, 0.7, px(x) * 0.5)
mark(wc('breath', 0.9), 0.95)

# 2. Whatever it could reach: Tomás and Farah, and paper for each of her two complaints; B minor, low, for the second, a stranger told
#    a household's medical needs. Air as the chat's first version reaches out; a knock for each of the copies it reads, paper for the
#    contact centre's notes, and a key as the copy turns out a year old. B minor, high, as the harm is named; a knock for the stranger,
#    paper for the breach Ama reports; and A, a need, as the official figures are named, and a key for "only what it's meant to read"
K = 'reach'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
paper(wc('price', -0.2), 0.012, px(690))
tSt = wc('stranger', -0.2)
paper(tSt, 0.012, px(1230)); stop(B_1, tSt + 0.1, 3.8, 0.8, 0.26, px(1230) * 0.4)
tR = wc('reach')
air(tR - 0.3, 1.4, 0.009, 0.0)
knock(tR + 0.6, 0.009, px(600)); knock(tR + 0.9, 0.008, px(960), 210); paper(tR + 1.2, 0.010, px(1320))
tap(w('export', 'nobody kept', -0.3), 0.008, px(600))
stop(B_2, w('harm', 'price that had changed', -0.3), 3.8, 0.8, 0.26, 0.0)
knock(w('harm', 'reached a stranger', -0.3), 0.009, px(1320))
paper(w('harm', 'Ama', -0.2), 0.011, px(960))
stop(A_1, w('need', 'official figures', -0.3), 3.6, 0.8, 0.24, px(740) * 0.4)
tap(w('need', 'only what', -0.3), 0.008, px(1200))

# 3. Context from the map: Inés; air as Tomás's map rises, and D as it comes; air as it opens into the view; a slot for each data
#    product as it's named; paper and keys for the tariffs' contract, a key for its owners; a slot for the glossary and paper for its
#    term. Air as the chat's lines reach up to what it reads, and A, answered; two strokes through the old exports; a key for the new
#    prices, and D, high and answered, as the chat's answer changes with them
K = 'ines'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tMp = w('draw', "Tomás's map", -0.6)
air(tMp, 1.6, 0.009, 0.0); stop(D_1, tMp, 3.8, 0.8, 0.26, 0.0)
air(wc('products', -0.4), 2.0, 0.008, 0.0)
for word, x in (('tariffs', 475), ('planned work', 709), ('help pages', 943), ('account', 1411)):
    slot(w('products', word, -0.2), 0.008, px(x))
paper(w('contract', 'contract', -0.1), 0.011, px(1460)); typing(w('contract', 'what it holds', -0.3), 2.2, 0.005, px(1460), seed=5)
tap(w('contract', 'who owns it', -0.2), 0.008, px(700))
slot(w('terms', 'glossary', -0.3), 0.008, px(1177)); paper(w('terms', 'account holder', -0.3), 0.010, px(1500))
tRd = w('only', 'reads those', -0.2)
air(tRd, 1.2, 0.008, px(800)); viola(69, tRd, 2.2, 0.75, px(800) * 0.5)
for x in (1476, 1646):
    strike(w('only', 'no exports', -0.3) + (x - 1476) / 1700, 0.007, px(x))
tap(w('fresh', 'prices change', -0.2), 0.008, px(475))
tAns = w('fresh', "chat's answer", -0.3)
tap(tAns, 0.008, px(1000)); viola(74, tAns, 2.2, 0.7, px(1000) * 0.5)

# 4. Only what it's meant to read: a key for each level as it's set; a slot as medical needs comes in. B, which the strings beneath
#    don't answer, as the chat never reads it; a slot for the mask, and its crack; air as the chat's place is built round what it may
#    read, and D, close, as it holds only that; a clip for its own identity; a key as the account is left out; and D, answered, for
#    the holder's own sign-in, a key turning in it, and a key for "theirs, and no one else's"
K = 'level'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tPu = w('level', 'public')
for t0, x in ((tPu, 475), (tPu + 0.15, 709), (tPu + 0.3, 943), (w('level', 'internal'), 1177), (w('level', 'confidential'), 1411),
              (w('level', 'restricted'), 1645)):
    tap(t0 - 0.2, 0.006, px(x))
slot(w('level', 'restricted', -0.4), 0.008, px(1645))
viola(59, w('never', 'never reads', -0.3), 1.8, 0.75, px(1645) * 0.4)
slot(wc('mask', -0.1), 0.008, px(1645))
crack(w('mask', 'one wrong rule', 0.1), 0.008, px(1645))
tPl = w('place', 'a place of its own', -0.2)
air(tPl, 1.8, 0.008, px(800)); stop(D_4, tPl, 3.8, 0.8, 0.24, px(800) * 0.4)
click(w('identity', 'own identity', -0.3), 0.009, px(560))
tap(w('account', "isn't there", -0.3), 0.008, px(1411))
tSi = w('signin', 'own sign-in', -0.4)
click(tSi + 0.3, 0.008, px(1487)); viola(62, tSi, 2.2, 0.75, px(1411) * 0.5)
tap(w('signin', 'theirs', -0.3), 0.008, px(1600))

# 5. Hand it to a person: air as the street's homes come in, and a knock for its planned work; a key for "from a person"; frost over
#    the two homes the chat can't tell; a knock for the priority team's list and a lock on it; a slot for the small tool; air as a
#    signed-in household's question travels to it; and the tool's one answer, a fork's one note. A stroke through "why?"; a knock for
#    the person who calls back, a pen for what they see, and a click as they pick up the phone; then air as the chat hands over, D as
#    it does, and a key as it tells the household a person will call
K = 'tool'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(S0(K) + 0.5, 1.2, 0.008, 0.0); knock(S0(K) + 0.6, 0.009, px(960))
tap(w('cut', 'from a person', -0.3), 0.007, px(960))
frost(w('which', 'medical needs', -0.3), 0.9, 0.006, px(780))
tAn = wc('answer')
knock(tAn - 0.2, 0.009, px(1600)); click(tAn + 0.1, 0.008, px(1790))
slot(w('answer', 'small tool', -0.3), 0.008, px(1220))
air(w('answer', 'signed-in', -0.2), 1.8, 0.007, px(1000))
fork(74, w('answer', 'hand this', -0.3), 0.85, 2.2, px(1220) * 0.5)
strike(wc('why', -0.2), 0.007, px(1510))
knock(w('why', 'calls them back', -0.3), 0.009, px(300))
pencil(w('why', 'sees why', -0.3), 0.005, px(880), 0.9)
click(w('why', 'checks who', -0.3), 0.008, px(470))
tHo = w('today', 'hands over', -0.3)
air(tHo, 1.0, 0.008, px(560)); stop(D_5, tHo, 3.8, 0.8, 0.26, 0.0)
tap(w('today', 'tells', -0.3), 0.008, px(960))

# 6. Who agrees: paper as the ticket comes in, a key as its rows fill, and a key for each owner who agrees; a knock for the pull request
#    and a pen for its link; a key as the data team reviews it; a knock for the test, a key as Ama checks it; and the ticket closed,
#    a stamp, and D
K = 'who'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
paper(S0(K) + 0.5, 0.012, px(505))
tap(wc('owners', -0.2), 0.007, px(505))
for t0 in (w('owners', 'Grace', -0.1), w('owners', 'retail', -0.1), w('owners', 'tariffs and accounts', 0.4)):
    tap(t0, 0.008, px(820))
knock(wc('team', -0.2), 0.010, px(1405)); pencil(wc('team', 0.0), 0.005, px(955), 0.5)
tap(w('team', 'reviews', -0.3), 0.008, px(1056))
knock(wc('ama', -0.2), 0.010, px(1405))
tap(w('ama', 'nothing restricted', -0.2), 0.008, px(1056))
tDo = w('ama', "chat's place", 0.3)
press(tDo, 0.011, px(505)); stop(D_6, tDo, 3.8, 0.8, 0.24, px(505) * 0.4)

# 7. On Databricks: a knock as its window opens; a key as the app's own identity is named; a slot as Unity Catalog's tree fills, a key
#    for each grant as it comes in, and a stop for everything else, with no grant; keys for the search index and the function; paper for
#    the function's card, and its one answer, yes or no, the same fork as the small tool's; a knock for Databricks' own advice
K = 'dbx'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
knock(S0(K) + 0.3, 0.010, 0.0)
tap(w('app', 'own identity', -0.3), 0.008, px(880))
slot(w('schema', 'one schema', -0.4), 0.008, px(300))
for t0 in (w('schema', 'Unity Catalog', -0.3), w('schema', 'one schema', -0.3), w('schema', 'select', -0.3)):
    tap(t0 + 0.05, 0.007, px(900))
press(w('schema', 'nothing else', -0.3), 0.010, px(880))
tap(w('index', 'search index', -0.4), 0.007, px(300)); tap(w('index', 'may read', -0.3), 0.007, px(900))
tap(w('fn', 'function', -0.4), 0.007, px(300)); tap(w('fn', 'may run', -0.3), 0.007, px(900))
paper(w('fn', 'reads only', -0.3), 0.011, px(1280))
fork(74, w('fn', 'yes or no', -0.3), 0.85, 2.0, px(1640) * 0.5)
knock(wc('advice', -0.1), 0.009, px(960))

# 8. Read from the original: Uruk again, his copy set down; the film's figure again, the A fork as he "copied from the original", the
#    viola d'amore's A as he "checked his copy", answered. Air as the chat's place comes in beside it; a key for each of the three months'
#    lines; and in the pause, as his copy's last lines and the chat's place light together, D, answered
K = 'back'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
clay(S0(K) + 0.4, 0.012, px(420))
figure(w('scribe', 'copied from the original', -0.2), w('scribe', 'checked his copy', -0.2), 69, 0.95, px(420) * 0.4)
air(wc('chat', -0.3), 1.6, 0.008, px(1340))
tap(w('chat', 'official products', -0.3), 0.007, px(1340))
tap(wc('since', -0.2), 0.008, px(1340)); tap(w('since', 'every one', -0.3), 0.007, px(1340))
knock(wc('none', -0.2), 0.008, px(1340))
stop(D_3, wc('breath', 0.0), 3.4, 0.85, 0.26, 0.0)

# 9. What an agent may read: paper as the answer's note comes in, and a pen as it's written; under the end card, without words, the
#    series' mark
K = 'end'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tA = wc('answer')
paper(tA + 0.2, 0.012, px(960)); pencil(tA + 0.5, 0.005, px(960), 5.4)
mark(wc('breath', 0.3), 0.95)

# the effects a little louder, by about 7 dB, so they sit where the films the author accepted sit (their loud moments about -45.5 dB,
# as tools/quiet.py measures them)
for _b in (XL, XR):
    _b *= 2.2
