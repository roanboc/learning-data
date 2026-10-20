# Roles come and go: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette is new for this film (PLAYBOOK.md: vary the sound itself, film to film), and it follows the film's one idea, that roles
# come and go while the person stays:
#  - A small choir, humming on "oo", holds the chords. When the chord changes, a voice whose note the next chord shares holds on through
#    the change; the others end, and the new ones come in, one after another from the lowest. Roles come and go in the voices, too.
#  - A felt piano is the roles, each on the note it has had since One person, many roles (student D, applicant E, researcher G, tutor A,
#    alumna the D above), so a role sounds the same wherever it's painted on, pinned or counted; where the line meets her open roles,
#    their notes make a chord. In Rome, Cato's offices climb on it, a step at a time, as a ladder does.
#  - A glass harmonica, rubbed, is the person: whenever someone stands in white paper as the person, it holds the D and the A above it,
#    the notes film 1's cello gave Linh, longer than anything else.
#  - The clarinet carries the series' mark, one note, its octave, its fifth and the note again (1-8-5-1): on G under the title, in
#    Rome's G minor, and on D on the end card. The film starts in G minor and ends in D major.
# The effects are the film's own: a mallet on a chisel as the stone is cut, a parchment unrolled, a pencil, a rubber, a pin, a brush,
# paper, footsteps on a pavement, and a heart.
# The series' sound (the author, 20 October 2026, after Who is it?): music plays under the opening, where its story from real life is
# told, then comes in from time to time, never as a constant bed under the voice. So the choir sings under Rome, and after that only at a
# few turns: a question before two of the stops for Pause and think (the wrong answer about last year, the late contract), the answer
# after the first, the move to an energy company, and the end card. In between, the music is what's on screen: a role's note as it's
# painted on, pinned or counted, the person's notes whenever someone stands in white paper, the tutor's contracts. The sounds come in
# from time to time, too: one for each thing on screen that matters (a card set down, a line drawn, a date pinned, a red ring), not one
# for every stroke, key or step of the picture.
# Nothing is tense, trembling or pulsing. The choir's voices, the glass and the clarinet are steady tones with no vibrato; no instrument
# plays a note twice, a little out of tune (two such voices beat against each other, and a phone's one speaker turns that into a slow
# pulse); the person's A is a pure fifth above her D, so even their overtones don't beat; and nothing pulses under the error.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops, and nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: knocks, paper, a pencil, low notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def L(sid, lid, off=0):  # when a line's voice ends
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan

# ---- the film's instruments, all low-passed ----
# the music's levels: the choir sits about 21 dB under the voice, as in the other series' films, and the notes over it a little less.
# Each instrument is trimmed to come out as loud as its part in One person, many roles at the same gain (measured on its own, as
# integrated loudness): the choir as its watercolour chords, the felt piano as its plucked cello, the glass as its bowed one
BED, NOTE = 1.66, 1.5
TRIM = {'choir': 0.68, 'piano': 0.9, 'glass': 0.92}
# the choir's vowel, a hum rounded to "oo": each formant's centre, level and width, in Hz
VOW = [(300, 1.0, 85), (790, 0.3, 120), (2250, 0.045, 170)]
def _form(f):
    return sum(a * np.exp(-((f - c) / bw) ** 2 / 2) for c, a, bw in VOW) + 0.03
def _singer(m, sec, seed, cents=0.0):
    """one singer holding note m (cents above or below it): a voice whose overtones are shaped by the vowel, held steady, with no
    vibrato, only the slow drift of someone holding a long note"""
    r = np.random.default_rng(seed); x = tt(sec).astype(np.float64); f0 = mf(m) * 2 ** (cents / 1200)
    dr = 0.0006 * (0.6 * np.sin(2 * np.pi * r.uniform(0.05, 0.11) * x + r.uniform(0, 6.3)) + 0.4 * np.sin(2 * np.pi * r.uniform(0.17, 0.29) * x + r.uniform(0, 6.3)))
    ph = 2 * np.pi * np.cumsum(f0 * (1 + dr)) / SR
    s = np.zeros_like(x)
    for k in range(1, 14):
        if k * f0 > 1800:
            break
        s += np.sin(k * ph + r.uniform(0, 6.3)) * k ** -1.3 * _form(k * f0)
    return s
def _hum(m, a, b, g, att=1.8, rel=2.6, cents=0.0):
    """note m, sung from a, swelling in over att, held until b and then let go over rel: one singer to a note, as in a small vocal
    group, placed across the field by pitch"""
    sec = b - a + rel; x = tt(sec)
    e = (np.clip(x / att, 0, 1) ** 1.6 * np.clip((sec - x) / rel, 0, 1)).astype(np.float32)
    s = _singer(m, sec, m * 31 + int(a * 7), cents) + filt(noise(sec), 'band', (250, 1100)) * 0.012
    put(filt((s * e).astype(np.float32), 'low', 1500), a, g * BED * TRIM['choir'] * 0.7, max(-0.5, min(0.5, (m - 55) / 28)))
CH = []
def chords(keys):
    """the opening's chords, each from its moment, kept for the choir"""
    CH.extend(keys)
def choir(keys, end, g=0.03):
    """the choir under the opening: each chord comes in a little early, so it has bloomed by its moment, its new voices one after
    another from the lowest; a voice the next chord shares holds on through the change, and the rest end just after the next chord
    starts; the last chord is let go at end"""
    keys = sorted(keys)
    for i, (t0, ch) in enumerate(keys):
        prev = keys[i - 1][1] if i else []
        new = [m for m in ch if m not in prev]
        for r, m in enumerate(sorted(new)):
            j = i
            while j + 1 < len(keys) and m in keys[j + 1][1]:
                j += 1
            t1 = keys[j + 1][0] if j + 1 < len(keys) else end
            _hum(m, t0 - 1.2 + r * 0.24, t1 - 0.6, g)
# a chord on its own can be sung in tune with itself, as a small group sings it: each voice at its pure interval above the lowest (a
# third from 5:4, a fifth from 3:2), so no two voices' overtones beat. The opening's chords stay tempered: a voice held from one chord
# into the next would have to slide up to a sixth of a semitone
JUST = {0: 1, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
def bloom(ch, a, b, g=0.03, step=0.22, att=0.9, rel=1.4, ref=None):
    """the choir at one of the film's turns: one chord, sung in tune with itself, its voices coming in one after another from the
    lowest from a, all let go together, so the last of them has ended by b; ref, a note of the chord, stays where the felt piano and the
    glass have it, so the chord can take up the person's D"""
    lo = min(ch); dev = {m: 1200 * np.log2(JUST[(m - lo) % 12] * 2 ** ((m - lo) // 12)) - 100 * (m - lo) for m in ch}
    up = -dev[ref] if ref is not None else 0.0
    for r, m in enumerate(sorted(ch)):
        _hum(m, a + r * step, b - rel, g, att, rel, dev[m] + up)
def fpiano(m, start, g=0.03, pan=0.0, sec=3.4):
    """a felt piano: the felt muffles the hammer's top, one string to a note, and a soft thump as it lands; a role"""
    f = mf(m); x = tt(sec).astype(np.float64); s = np.zeros_like(x)
    for k in range(1, 10):
        fk = k * f * np.sqrt(1 + 0.00035 * k * k)
        if fk > 2000:
            break
        e = 0.7 * np.exp(-x * (1.6 + 0.9 * k)) + 0.3 * np.exp(-x * (0.35 + 0.12 * k))
        s += k ** -1.7 * np.sin(2 * np.pi * fk * x + 0.37 * k) * e
    s = s + filt(noise(sec), 'band', (90, 420)) * np.exp(-x * 45) * 0.12
    s = s * np.minimum(1, x / 0.005) * np.clip((sec - x) / 0.4, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 1700)), start, g * NOTE * TRIM['piano'], pan)
# each role's note, the same in every chapter, and the same as in One person, many roles
ROLE = {'student': 50, 'applicant': 52, 'researcher': 55, 'tutor': 57, 'alumna': 62}
def role(r, s, g=0.03, pan=0.0):
    fpiano(ROLE[r], s, g, pan)
def glass(m, start, sec, g=0.03, pan=0.0):
    """a glass harmonica, rubbed: an almost pure tone that swells in and holds steady, and a faint ring of the glass above it"""
    f = mf(m); x = tt(sec).astype(np.float64); ph = 2 * np.pi * f * x
    s = np.sin(ph) + 0.09 * np.sin(2 * ph + 0.5) + 0.025 * np.sin(3 * ph)
    s += 0.02 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x * 1.5)
    s = s + filt(noise(sec), 'band', (f * 0.9, f * 1.8)) * 0.035
    e = np.clip(x / 0.45, 0, 1) ** 1.5 * np.clip((sec - x) / min(1.4, sec * 0.45), 0, 1)
    put(norm(filt((s * e).astype(np.float32), 'low', 1600)), start, g * NOTE * TRIM['glass'], pan)
FIFTH = 12 * np.log2(1.5)  # a pure fifth, in semitones: a tempered one would beat, slowly, where the D's third overtone meets the A's second
def person(s, g=0.026, pan=0.0, hold=3.4):
    """the person: the glass's D, and the A above it, the same two notes wherever someone stands in white paper as the person"""
    glass(62, s, hold, g, pan); glass(62 + FIFTH, s + 0.55, hold - 0.5, g * 0.55, pan + 0.15)
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet, played straight, as a clarinet is: odd harmonics, and a breath as it speaks"""
    f = mf(m); x = tt(sec); ph = 2 * np.pi * f * x
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def mark(start, root=62, g=0.05):
    """the series' mark, 1-8-5-1, on the clarinet, over the felt piano's root; its fifth pure, as the end chord's is"""
    for i, iv in enumerate([0, 12, FIFTH, 0]):
        clarinet(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    fpiano(root - 12, start, g * 0.6); fpiano(root - 12, start + 1.26, g * 0.5)

# ---- the film's effects, on the effects bus, all soft and low ----
def quill(s, sec=0.6, g=0.016, pan=0.0):
    """a pencil writing: a soft scratch that flutters with the strokes"""
    x = tt(sec); fl = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 7.5 * x + 3 * np.sin(2 * np.pi * 1.3 * x)))
    X(filt(noise(sec), 'band', (700, 2300)) * fl * np.sin(np.pi * x / sec) ** 0.6, s, g, pan)
def stroke(s, sec=0.9, g=0.014, pan=0.0, p1=None):
    """a long pencil line: a steady scratch, drawn from one place to another"""
    x = tt(sec); a = filt(noise(sec), 'band', (700, 2200)) * (0.85 + 0.15 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec) ** 0.5
    if p1 is None:
        X(a, s, g, pan); return
    p = pan + (p1 - pan) * (x / sec)
    X(a * np.sqrt(0.5 * (1 - p)), s, g, -1.0); X(a * np.sqrt(0.5 * (1 + p)), s, g, 1.0)
def dotted(s, sec=1.0, g=0.014, pan=0.0, p1=None, step=0.1):
    """a dotted pencil line: a short touch of the lead for each dot"""
    n = max(2, int(sec / step))
    for k in range(n):
        quill(s + k * sec / n, 0.04, g * (0.85 + 0.15 * (k % 2)), pan if p1 is None else pan + (p1 - pan) * k / (n - 1))
def tick_(s, g=0.016, pan=0.0):
    """a pencil tick: two short strokes"""
    quill(s, 0.1, g, pan); quill(s + 0.09, 0.16, g * 0.8, pan)
def ring(s, sec=0.8, g=0.016, pan=0.0):
    """a pencil drawn round something: a scratch that swells once round and lifts"""
    x = tt(sec); X(filt(noise(sec), 'band', (600, 2000)) * np.sin(np.pi * x / sec) * (0.7 + 0.3 * np.sin(2 * np.pi * x / sec * 2)), s, g, pan)
def rub(s, sec=0.7, g=0.016, pan=0.0):
    """a rubber across a word: a soft, dry back and forth"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500)) * (0.35 + 0.65 * np.abs(np.sin(2 * np.pi * 5.5 * x))) * np.sin(np.pi * x / sec) ** 0.8, s, g, pan)
def paper(s, g=0.03, pan=0.0, sec=0.45):
    """paper, softly: a card, a sheet or an envelope picked up or set down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def unroll(s, sec=1.1, g=0.02, pan=0.0):
    """a parchment unrolled: a dry rustle, with a crackle here and there"""
    x = tt(sec); r = np.random.default_rng(int(s * 10)); cr = np.zeros_like(x)
    for _ in range(int(sec * 16)):
        i = int(r.integers(0, max(1, len(x) - 400))); cr[i:i + 400] += np.exp(-np.arange(400) / 60.0).astype(np.float32) * r.uniform(0.3, 1.0)
    a = filt(noise(sec), 'band', (250, 1600)) * (0.45 + 0.55 * cr / max(1e-6, cr.max())) * np.sin(np.pi * x / sec) ** 0.7
    X(a, s, g, pan)
def brush(s, g=0.022, pan=0.0, sec=0.8):
    """a wet brush across the paper: a low, soft swish"""
    x = tt(sec); X(filt(noise(sec), 'band', (180, 1200)) * np.sin(np.pi * x / sec) ** 2 * (1 + 0.3 * np.sin(2 * np.pi * 3 * x)), s, g, pan)
def knock(s, g=0.024, pan=0.0, f=240):
    """a soft wooden knock: a card or a tag set down"""
    s_knock(s, g, pan, f)
def pin(s, g=0.02, pan=0.0):
    """a pin pushed into a board: a small knock and a soft tap"""
    s_knock(s, g, pan, 330); s_tap(s + 0.015, g * 0.6, pan)
def chisel(s, g=0.02, pan=0.0):
    """a mallet on a chisel, into stone: a dull knock and a grain of grit, nothing bright"""
    x = tt(0.12); k = np.sin(2 * np.pi * 420 * x) * np.exp(-x * 70) + 0.5 * np.sin(2 * np.pi * 960 * x) * np.exp(-x * 110)
    X(norm(filt((k + filt(noise(0.12), 'band', (600, 2000)) * np.exp(-x * 55) * 0.6).astype(np.float32), 'low', 2200)), s, g, pan)
def carve(s, sec, g=0.018, pan=0.0):
    """a line cut in the stone: a stroke of the mallet every third of a second along it, a little uneven"""
    n = max(2, int(round(sec / 0.3))); r = np.random.default_rng(int(s * 100))
    for k in range(n):
        chisel(s + k * sec / n + r.uniform(-0.02, 0.02), g * (0.8 + 0.25 * r.random()), pan)
def air(s, sec=0.7, g=0.02, pan=0.0):
    """a breath of air: something carried down"""
    s_air(s, sec, g, pan, 160, 1000)
def fly(s, sec, g=0.02, p0=-0.6, p1=0.6):
    """a breath of air that crosses the frame with something moving, from one place to another"""
    x = tt(sec); a = filt(noise(sec), 'band', (160, 1000)) * np.sin(np.pi * x / sec) ** 2; p = p0 + (p1 - p0) * (0.5 - 0.5 * np.cos(np.pi * x / sec))
    X(a * np.sqrt(0.5 * (1 - p)), s, g, -1.0); X(a * np.sqrt(0.5 * (1 + p)), s, g, 1.0)
def moon(s, g=0.016):
    """the moon, each night: a warm swell, low"""
    s_swell(mf(57), s, 2.4, g)
def step(s, g=0.02, pan=0.0):
    """a footstep on the pavement: a soft heel and a scuff"""
    s_knock(s, g, pan, 120); x = tt(0.09); X(filt(noise(0.09), 'band', (220, 1100)) * np.exp(-x * 40), s + 0.02, g * 0.5, pan)
def heart(s, g=0.04, pan=0.0):
    """a heartbeat, once: two low knocks"""
    s_knock(s, g, pan, 90); s_knock(s + 0.28, g * 0.7, pan, 80)

# chords (MIDI note numbers), low to high, voiced for the choir: where two chords follow each other, they share what they can
GMADD9 = [43, 50, 58, 62, 69]; EBMAJ9 = [39, 46, 58, 62, 65]; CM9 = [48, 51, 58, 62, 67]; D7SUS4 = [38, 50, 57, 60, 67]; BBMAJ7 = [46, 53, 57, 62, 65]
GM9 = [43, 50, 58, 65, 69]; EBMAJ7S11 = [39, 46, 57, 62, 67]; DSUS4 = [38, 50, 57, 62, 67]
A7SUS4 = [45, 52, 55, 57, 62]; DMAJ9 = [38, 50, 57, 61, 64]; BBMAJ9 = [46, 53, 57, 60, 62]; DMAJ9END = [38, 45, 54, 57, 61, 64]


# 1. A ladder of offices: G minor, the opening, with the choir under it while its story is told. The stone tablet set down, and his name
#    cut into it; each office cut as it's named, a step up the felt piano at a time; the sheet; the four lines lifting off onto their
#    rungs, the ladder again, quicker; a tick at a rung's start and at its end; the censorship's rung, a step higher; the census list
#    unrolled, and the names written; "census", large; the series' mark under the title, on G, and the choir lets go as the chapter ends
J = 'rome'; B = C(J, 'breath'); tMar, tEach, tSeq = C(J, 'cato'), C(J, 'roles'), W(J, 'roles', 'sequence')
tOff = [W(J, 'cato', 'quaestor'), W(J, 'cato', 'aedile'), W(J, 'cato', 'praetor'), W(J, 'cato', 'in 195')]
tCen, tWrote = W(J, 'census', 'censor.'), W(J, 'census', 'wrote')
chords([(S0(J), GMADD9), (C(J, 'cato', -0.3), EBMAJ9), (W(J, 'cato', 'praetor', -0.3), CM9), (W(J, 'cato', 'in 195', -0.3), D7SUS4), (C(J, 'roles', -0.3), BBMAJ7),
        (W(J, 'roles', 'a start', -0.3), GM9), (C(J, 'census', -0.3), EBMAJ7S11), (W(J, 'census', 'wrote', -0.3), CM9), (W(J, 'census', 'the census', -0.3), DSUS4), (B + 0.2, GMADD9)])
knock(tMar - 0.35, 0.026, P(760), 150)
carve(tMar, 1.4, 0.018, P(760))
for i, (t0, m) in enumerate(zip(tOff, [55, 57, 58, 60])):
    carve(t0 - 0.1, 0.6, 0.016, P(760)); fpiano(m, t0 - 0.1, 0.03, P(760))
paper(tEach - 0.2, 0.034, P(1470), 0.6)
fly(tSeq - 0.15, 1.65, 0.016, P(760), P(1450))
for i, (x, m) in enumerate(zip([1166, 1321, 1352, 1445], [55, 57, 58, 60])):
    fpiano(m, tSeq + 0.6 + i * 0.24, 0.022, P(x))
tick_(W(J, 'roles', 'a start'), 0.014, P(1300)); tick_(W(J, 'roles', 'an end'), 0.014, P(1400))
fpiano(62, tCen - 0.05, 0.03, P(1794))
unroll(tWrote - 0.3, 1.1, 0.024, P(700))
quill(W(J, 'census', 'every', -0.1), 1.2, 0.013, P(560)); quill(W(J, 'census', 'the census', -0.05), 0.75, 0.017, P(640))
mark(B + 0.8, 55)
choir(CH, S0('census') + 0.6)

# 2. Census date: no music, now the opening's story is told. The paper clears off the campus, a brush; the calendar pinned up; a pencil
#    round the 31st; Planning's card set down with its question, then the alumni office's with its own
J = 'census'; tPl, tAl = C(J, 'planning'), W(J, 'alumni', 'alumni office')
brush(S0(J) + 0.2, 0.02, 0.0, 1.3)
pin(W(J, 'date', 'university', -0.1), 0.022, P(261))
ring(W(J, 'date', 'thirty-first', -0.1), 0.7, 0.015, P(261))
paper(tPl - 0.1, 0.03, P(1380)); paper(tAl - 0.1, 0.03, P(1380))

# 3. True for a day: the four systems set down; the moon, a low swell; the platform's copy; each status on its role's note as it's
#    named; each night the moon, and every status rubbed out to be written again; Planning's card asking about last year; a pencil round
#    today's date; the red ring on "student". Nothing pulses under the error: after its last words, the choir asks a question, a chord
#    on A held open, and has let go before the film stops there for Pause and think
J = 'flags'; tN, tPf = C(J, 'night'), W(J, 'night', 'platform'); tPl = W(J, 'again', 'Planning')
tSt = [W(J, 'says', 'enrolled'), W(J, 'says', 'casual staff'), W(J, 'says', 'project member'), W(J, 'says', 'graduate')]
nights = [W(J, 'over', 'a day', 0.15), W(J, 'over', 'the next', 0.05)]
SX = [285, 735, 1185, 1635]
knock(tN + 0.25, 0.018, P(SX[0]), 210)
moon(W(J, 'night', 'night', -0.1), 0.016)
paper(tPf - 0.2, 0.026, P(910))
for i, r in enumerate(['student', 'tutor', 'researcher', 'alumna']):
    role(r, tSt[i] - 0.05, 0.026, P(SX[i]))
for k, n in enumerate(nights):
    gk = 1 if k == 0 else 0.75
    moon(n, 0.011 * gk); rub(n, 0.7, 0.014 * gk, 0.0)
paper(tPl - 0.2, 0.03, P(1580))
ring(W(J, 'again', 'today', -0.1), 0.7, 0.015, P(1180))
ring(W(J, 'wrong', 'March', -0.1), 0.8, 0.018, P(1470))
bloom(A7SUS4, L(J, 'wrong', 0.05), E(J) - 0.05, step=0.12, att=0.6, rel=1.2)

# 4. A start and an end: the choir answers, in D major, as the chapter begins, and lets go under its first line. The four cards write in
#    their dates; the form; Linh in white paper, on the person's notes; the line of years drawn; each role painted on, on its note; the
#    second applicant and student periods, on theirs; the line at today; the pencil round the four of 2026; the person's notes, held,
#    on "the person under them"
J = 'bands'; tKnow, tSame, tUn = W(J, 'know', 'knows'), W(J, 'shape', 'same shape'), C(J, 'under')
tApp, tStu, tAlu = C(J, 'first'), W(J, 'first', 'then student'), W(J, 'first', 'Then alumna')
tTut, tAg, tJul, tRes = C(J, 'tutor'), C(J, 'again'), W(J, 'again', 'July'), C(J, 'research')
tYr, tOnce, tPer = W(J, 'research', 'this year'), W(J, 'stays', 'run at once'), W(J, 'stays', 'The person')
bloom(DMAJ9, S0(J) + 0.05, C(J, 'know', 2.3), step=0.15, att=0.8, rel=1.5)
quill(tKnow - 0.2, 1.4, 0.012, 0.0)
paper(tSame - 0.4, 0.03, P(960))
person(tUn, 0.018, P(200), 3.0)
stroke(W(J, 'under', 'bands', -0.2), 1.4, 0.011, P(760), P(1880))
X4 = lambda d: 760 + (d - 2018.5) / 8.5 * 1120
for r, s, d in [('applicant', tApp, 2018.62), ('student', tStu, 2019.15), ('alumna', tAlu, 2022.95), ('tutor', tTut, 2023.14)]:
    role(r, s, 0.03, P(X4(d)))
role('applicant', tAg, 0.026, P(X4(2025.42))); role('student', tJul - 0.2, 0.028, P(X4(2025.55))); role('researcher', tRes, 0.03, P(X4(2026.17)))
stroke(tYr - 0.3, 0.9, 0.011, P(X4(2026.3)))
ring(tOnce, 0.9, 0.015, P(1820))
person(tPer, 0.026, P(200), 4.2)

# 5. A contract each term: "film 1: one band" written; the band breaking into seven contracts, the tutor's note once for each, left to
#    right; HR's card; a pin at 15 January, in a gap: not staff; a pin at census date, in a contract: staff, on the tutor's note
J = 'terms'; tOneB, tNew = W(J, 'drew', 'one band'), W(J, 'hr', 'new contract')
tBet, tCD, tIs = W(J, 'jan', 'between'), W(J, 'jan', 'census date'), W(J, 'jan', 'she is.')
X5 = lambda d: 760 + (d - 2022.6) / 4.4 * 1120
quill(tOneB - 0.4, 0.9, 0.014, P(X5(2023.14)))
for k, d in enumerate([2023.3, 2023.75, 2024.3, 2024.75, 2025.3, 2025.75, 2026.3]):
    fpiano(57, tNew + 0.1 + k * 0.13, 0.022 * (1 - 0.05 * k), P(X5(d)))
paper(C(J, 'hr', -0.1), 0.028, P(1540))
X5b = lambda d: 760 + (d - 2025.55) / 1.05 * 1120
pin(tBet + 0.55, 0.02, P(X5b(2026.04)))
pin(tCD + 0.55, 0.02, P(X5b(2026.25))); role('tutor', tIs, 0.026, P(X5b(2026.25)))

# 6. One line, one date: the line drawn top to bottom at census date; where it crosses each open role, that role's note, so the four make
#    a chord; folded into one person, on the person's notes; the line carried back a year, and the two roles still open there; the alumni
#    office's card, with its filter; her student and alumna notes together
J = 'line'; tLine, tOneP, tMove = W(J, 'draw', 'one line'), W(J, 'once', 'one person'), C(J, 'back')
tDot = [C(J, 'open'), W(J, 'open', 'tutor'), W(J, 'open', 'researcher'), W(J, 'open', 'alumna')]
X6 = lambda d: 760 + (d - 2024.55) / 2.45 * 1120
xC, xC0 = X6(2026.246), X6(2025.246)
stroke(tLine - 0.1, 0.9, 0.013, P(xC))
for i, r in enumerate(['student', 'tutor', 'researcher', 'alumna']):
    role(r, tDot[i] - 0.05, 0.026, P(xC))
person(tOneP + 0.3, 0.022, P(200), 3.4)
fly(tMove - 0.1, 1.5, 0.016, P(xC), P(xC0))
role('tutor', W(J, 'back', 'a tutor'), 0.022, P(xC0)); role('alumna', W(J, 'back', 'an alumna'), 0.022, P(xC0))
paper(W(J, 'filter', 'alumni office', -0.1), 0.028, P(650))
role('student', W(J, 'since', 'back', 0.15), 0.022, P(420)); role('alumna', W(J, 'since', 'back', 0.15), 0.016, P(420))

# 7. What a role is for: a "relates to" tag over each open role as it's named, on its note; Ana in white paper, on the person's notes,
#    from her side, and her coral band, on the researcher's note; the dotted line from her to Linh; the pencil round December, where the
#    relationship ends; both people, on the person's notes, from either side
J = 'relates'; tMa, tUnit, tProj = W(J, 'items', "master's"), W(J, 'items', 'one unit'), W(J, 'items', 'one project')
tRl, tAna, tSup, tEnds, tBoth = W(J, 'people', 'relate'), W(J, 'people', 'Ana'), W(J, 'people', 'supervises'), W(J, 'ends', 'ends with'), W(J, 'ends', 'Both')
role('student', tMa, 0.024, P(1105)); role('tutor', tUnit - 0.1, 0.024, P(1509)); role('researcher', tProj - 0.1, 0.024, P(1602))
person(tRl, 0.016, P(1716), 3.0)
role('researcher', tAna, 0.022, P(1716))
dotted(tSup - 0.2, 1.1, 0.012, P(1640), P(280), 0.14)
ring(tEnds + 0.4, 0.7, 0.015, P(1300))
person(tBoth - 0.1, 0.02, P(200), 3.6); person(tBoth + 0.25, 0.016, P(1716), 3.2)

# 8. Elsewhere: as the film moves to an energy company, the choir takes up the person's two notes into B flat major, and lets go under
#    its first line. The company's sheet; his period's end; his steps away down the street; the person who stays, on the person's notes;
#    her heart, and its first beats; the heart carried to his band, and the red ring at 14 June; then carried down to hers, and the
#    person's notes again
J = 'elsewhere'; tCo, tOut = W(J, 'energy', 'company'), W(J, 'moves', 'moves out')
tSt, tLS, tGo = W(J, 'need', 'person who stays'), W(J, 'need', 'life support'), W(J, 'need', 'goes on')
tHis, tClose, tHer, tStays = W(J, 'kept', 'his account'), W(J, 'kept', 'close'), W(J, 'kept', 'Kept on her'), W(J, 'kept', 'it stays')
XE = lambda d: 460 + (d - 2026) * 720; xJ = XE(2026.45)
bloom(BBMAJ9, S0(J) - 1.4, C(J, 'energy', 1.6), step=0.2, att=1.0, rel=1.6, ref=62)
paper(tCo - 0.3, 0.03, P(661), 0.6)
stroke(W(J, 'moves', 'role ends', -0.15), 0.3, 0.012, P(xJ))
for k in range(1, 7):
    step(tOut + k * 0.467, 0.018 * (1 - 0.11 * k), P(1664 + 420 * (k / 6)))
person(tSt, 0.02, P(1357), 3.4)
heart(tLS - 0.05, 0.03, P(1357))
S8 = S0(J); _bt = [S8 + (np.pi / 2 + 2 * np.pi * k) / 5.4 - 0.08 for k in range(40)]; _bt = [b for b in _bt if b > tGo - 0.1][:2]
for k, b in enumerate(_bt):
    heart(b, 0.032 * (1 - 0.25 * k), P(1357))
fly(tHis - 0.6, 0.9, 0.014, P(1357), P(XE(2026.09)))
ring(tClose - 0.1, 0.7, 0.017, P(xJ))
air(tHer - 0.15, 0.9, 0.014, P(XE(2026.09)))
person(tStays + 0.3, 0.02, P(1357), 3.4)

# 9. One table, any date: the table set down; a tick beside each of its two tests; a pin for each date the question takes; the late
#    contract's row lit, on the tutor's note; a pencil round the day it began. After its last words, the choir asks its question again,
#    on A, and has let go before the film stops there for Pause and think
J = 'table'; tPf = W(J, 'row', 'platform')
tP = [W(J, 'asat', 'census date'), W(J, 'asat', 'last year'), W(J, 'asat', 'today')]
paper(tPf - 0.2, 0.034, P(1140), 0.6)
tick_(W(J, 'tests', 'end before', 0.18), 0.015, P(454)); tick_(W(J, 'tests', 'belongs', 0.18), 0.015, P(454))
for k, (t0, x) in enumerate(zip(tP, [1286, 1500, 1690])):
    pin(t0 - 0.1, 0.017, P(x))
role('tutor', W(J, 'late', 'a contract'), 0.022, P(1140))
ring(W(J, 'late', 'the day it began', -0.1), 0.8, 0.015, P(1350))
bloom(A7SUS4, L(J, 'late', 0.4), E(J) - 0.05, step=0.22, att=1.0, rel=1.6)

# 10. The person stays: the line at today; a note on each of the four roles open on it; the pencil round December, and round an end
#     ahead; the person's notes, held, on "the person stays"; then, on the end card, the choir in D major, and the series' mark on D
J = 'stays'; B = C(J, 'breath'); tTo, tDec, tGrad = C(J, 'today'), W(J, 'next', 'December'), W(J, 'next', 'graduate')
tD = [W(J, 'today', 'a student'), W(J, 'today', 'a tutor'), W(J, 'today', 'a researcher'), W(J, 'today', 'an alumna')]
X10 = lambda d: 760 + (d - 2025.4) / 2.6 * 1120; xN = X10(2026.3)
stroke(tTo - 0.2, 0.9, 0.013, P(xN))
for i, r in enumerate(['student', 'tutor', 'researcher', 'alumna']):
    role(r, tD[i] - 0.05, 0.026, P(xN))
ring(tDec - 0.1, 0.7, 0.015, P(X10(2026.97))); ring(tGrad + 0.2, 0.7, 0.015, P(X10(2027.75)))
person(W(J, 'last', 'The person', -0.1), 0.026, P(200), 4.4)
bloom(DMAJ9END, B - 0.2, TOT + 1.0, step=0.24, att=1.4, rel=2.0)
mark(B + 1.0, 62)
