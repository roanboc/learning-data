# Which value wins: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette is this film's own (PLAYBOOK.md: vary the sound itself, film to film; the choir and the felt piano are Roles come and
# go's, and the series' viols, strings, reed organ, harps, glass, flutes, celesta, cello and tubular bells other films'), and it keeps
# what the series carries from film to film: the clarinet's mark (1-8-5-1), each role's note, and the D and the A above it for the
# person.
# The series' sound since the author's review of Who is it? (20 October 2026): music plays under the opening, where the story from
# real life is told, then comes in from time to time, at a chapter's turn, under a moment on screen or in a pause without words,
# never as a constant bed under the voice; and nothing in it is tense, trembles or pulses.
#  - Sackbuts, the trombone's softer ancestors, hold the chords: all through the Beagle's story in the first chapter, then only at
#    each chapter's turn, swelling in the pause between two chapters and let go as the new one's voice begins; in the pause before
#    the master data tool's screen and in the wordless moment for the rules, written and tested; after the thirty-three seconds;
#    and from the film's last line to the end card. One player to a note, low to the left and high to the right, and a note the
#    next chord keeps is held through the change: two players on one note would beat against each other, a slow pulse on a phone's
#    speaker. The chords are in E flat and its relative C minor, voiced with no two notes a semitone apart.
#  - A harpsichord gives each source its note: the note of the role whose colour it wears, the same as in every film of the series
#    (the student system the student's D, HR the tutor's A, the research office the researcher's G, the alumni office the alumna's
#    D above), so a value carried from a record sounds where it came from.
#  - A cor anglais is the person: whenever Linh stands in white paper it plays the same D and the A above it, and a value she gives
#    herself comes in on its D.
#  - The clarinet carries the series' mark, under the title and on the end card, here in E flat, over a low harpsichord note.
#  - Every instrument is held straight, without vibrato.
# The Beagle's chronometers tick as they're seen: each of the twenty-two keeps its own rate, and its beat is heard where its second
# hand steps. The sea washes under the two harbours. The effects are the paper's and the desk's: a pencil, cards set down, a book
# shut, muffled keys, a click, a stamp, a pin.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is sustained chords that come and go with the narration; the clocks tick only while they're on screen,
#    each where its own hand steps.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#  - There's no pulse, even for the error: when the newest value wins and HR's typo takes her record, HR's note sounds over a low A
#    on the harpsichord, and the pencil does the rest.
# And everything stays low and soft: knocks, paper, muffled keys, a pencil, low notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan
# while the voice speaks: the clocks' beat steps back under it
_SPEECH = [(G(s, v['id']), G(s, v['id']) + _DUR[s + '/' + v['id']]) for s in _NARR for v in _NARR[s]['vo']]
def speaking(t):
    return any(a - 0.2 <= t <= b + 0.3 for a, b in _SPEECH)

# ---- this film's instruments, all low-passed ----
# the music's levels against the voice, set by measuring (PLAYBOOK.md §5): the bed about 21 dB under the voice as it speaks
BED, NOTE, FX = 2.4, 1.2, 1.2
def _bell(F):
    """how loud a soft sackbut's harmonic at F Hz is: round and warm from its narrow bell, strongest below about 600 Hz, a little
    edge near 1.1 kHz, almost nothing above"""
    return 1 / (1 + (F / 560) ** 2) + 0.1 * np.exp(-((F - 1100) / 220) ** 2)
def sackbut(m, sec, seed):
    """one sackbut, the trombone's softer ancestor, holding note m: it speaks with a breath of air and a slight rise into its pitch,
    its upper harmonics opening a moment after the lower; held straight, without vibrato, with a player's slow, small drift"""
    R = np.random.default_rng(seed); f0 = mf(m); x = tt(sec).astype(np.float64)
    drift = 1 + 0.0007 * np.sin(2 * np.pi * R.uniform(0.06, 0.13) * x + R.uniform(0, 6.3)) + 0.0004 * np.sin(2 * np.pi * R.uniform(0.2, 0.35) * x + R.uniform(0, 6.3))
    ph = 2 * np.pi * np.cumsum(f0 * drift * (1 - 0.005 * np.exp(-x / 0.045))) / SR
    s = np.zeros_like(x)
    for h in range(1, 16):
        F = h * f0
        if F > 1500:
            break
        s += np.sin(h * ph + R.uniform(0, 6.3)) * h ** -0.5 * _bell(F) * np.clip((x - 0.01 * h) / (0.06 + 0.015 * h), 0, 1)
    air = filt(noise(sec), 'band', (300, 1400)) * (0.015 + 0.06 * np.exp(-x / 0.07))
    return (s + air) * (1 + 0.03 * np.sin(2 * np.pi * R.uniform(0.05, 0.1) * x + R.uniform(0, 6.3)))
def hold(m, start, sec, n, g=0.03, rel=1.8, a=0.5):
    """note m held on a sackbut from start, one of n in its chord: it swells in over a seconds, and is let go over rel seconds; low
    notes to the left and high to the right, as the players sit. One player to a note: two on one note beat against each other, and
    a phone's one speaker turns that into a slow pulse"""
    x = tt(sec); e = (np.clip(x / a, 0, 1) ** 1.5 * np.clip((sec - x) / rel, 0, 1)).astype(np.float32)
    put(filt((sackbut(m, sec, m * 31 + int(start * 7)) * e / n).astype(np.float32), 'low', 1200), start, g * BED, max(-0.5, min(0.5, (m - 52) / 26)))
_BED = []
def bed(keys, end, g=0.03, a=0.5, rel=1.8):
    """chords, each from its moment, until end: kept, so play_bed() plays the whole film's at once. Their notes swell in over a
    seconds and are let go over rel"""
    _BED.append((sorted(keys), end, g, a, rel))
def play_bed():
    """the film's chords on the sackbuts: a player whose note the next chord keeps holds it through the change, the others let go
    just after it, and the new notes come in a little before it, so they have spoken by then. A note a semitone from one that's let
    go comes in at the change itself, and the other is let go quickly, as one player moving a step would: the two never sound
    together, where they would rub. A note that leaves for a passing chord and comes straight back is let go quickly enough to come
    back in, so it never sounds twice at once. A note too low for the bed is played an octave up"""
    K = [(t, sorted(set(m + 12 if m < 38 else m for m in ch)), end, g, a, rel) for keys, end, g, a, rel in _BED for t, ch in keys]
    K.sort(key=lambda k: k[0])
    on = lambda j: j + 1 < len(K) and K[j + 1][0] <= K[j][2]  # the next chord comes while this one still sounds
    H = []  # each note held: its pitch, when it comes in, when it is let go, its chord's size and level, how long letting go takes,
    # and how long swelling in takes
    for i, (t0, ch, end, g, a, rel) in enumerate(K):
        prev = K[i - 1][1] if i and on(i - 1) else []
        for m in ch:
            if m in prev:
                continue
            j = i
            while on(j) and m in K[j + 1][1]:
                j += 1
            H.append([m, t0 - 0.6, K[j + 1][0] if on(j) else K[j][2], len(ch), g, K[j][5], a])
    for o in H:
        for i in H:
            if abs(o[0] - i[0]) == 1 and o[1] < i[1] < o[2] + o[5]:
                if i[1] < o[2]:  # it comes in at a change: a step
                    i[1], i[6], o[5] = o[2] - 0.15, min(i[6], 0.45), 0.35
                else:  # it comes in as the other is let go
                    o[5] = max(0.25, i[1] + 0.3 - o[2])
    for h in H:
        back = [b[1] for b in H if b[0] == h[0] and h[2] <= b[1] < h[2] + h[5]]
        if back:
            h[5] = max(0.25, min(back) - h[2])
    for m, s, t1, n, g, rel, a in H:
        hold(m, s, t1 - s + rel, n, g, rel, a)
def harpsichord(m, start, g=0.03, pan=0.0, sec=2.6):
    """a harpsichord, one string to a note: a quill plucks it near its end, so it speaks at once, bright and a little hollow, its upper
    harmonics dying first, until the damper falls; darkened below about 2.2 kHz. A pluck is short, so it's set a little louder (1.3)
    to sit with the voice as the score's other notes do"""
    f = mf(m); x = tt(sec).astype(np.float64); s = np.zeros_like(x)
    for h in range(1, 30):
        F = h * f * np.sqrt(1 + 0.00008 * h * h)
        if F > 2600:
            break
        s += np.sin(2 * np.pi * F * x + 0.3 * h) * abs(np.sin(np.pi * h * 0.13)) / h ** 1.1 * np.exp(-x * (0.9 + 0.22 * h))
    s = s * np.minimum(1, x / 0.002) + 0.04 * filt(noise(sec), 'band', (900, 2400)) * np.exp(-x * 120)
    s = s * np.clip((sec - x) / 0.08, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g * NOTE * 1.3, pan)
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet: odd harmonics and a breath as it speaks, held straight, as clarinettists play"""
    f = mf(m); x = tt(sec)
    ph = 2 * np.pi * f * x.astype(np.float64)
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def mark(start, root=63, g=0.042):
    """the series' mark, 1-8-5-1, on the clarinet, here in E flat, over the low E flat on the harpsichord"""
    for i, iv in enumerate([0, 12, 7, 0]):
        clarinet(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    harpsichord(root - 24, start, g * 0.6); harpsichord(root - 24, start + 1.26, g * 0.5)
def cor(m, start, sec, g=0.03, pan=0.0):
    """a cor anglais, softly: a double reed's dark, veiled voice, its harmonics gathered near 1 kHz, a breath as it speaks, held
    straight; nothing above about 2.2 kHz"""
    f = mf(m); x = tt(sec)
    ph = 2 * np.pi * f * x.astype(np.float64)
    w = lambda F: 0.3 + np.exp(-((F - 1000) / 380) ** 2) + 0.25 * np.exp(-((F - 2100) / 300) ** 2)
    s = sum(np.sin(h * ph + 0.2 * h) * w(h * f) / h ** 0.7 for h in range(1, 12))
    s = s + filt(noise(sec), 'band', (f * 1.2, f * 3.5)) * 0.06 * np.exp(-x * 9)
    put(norm(filt((s * env(sec, 0.12, min(0.6, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def person(s, g=0.03, pan=0.0):
    """the person: the same D and the A above it as in every film of the series, on the cor anglais, wherever she stands in white paper"""
    cor(62, s, 2.8, g, pan); cor(69, s + 0.6, 2.4, g * 0.7, pan + 0.1)
# each source on the note of the role whose colour it wears, the same in every film of the series since One person, many roles
SRC = {'sis': 50, 'hr': 57, 'ro': 55, 'ao': 62}
def src(k, s, g=0.03, pan=0.0):
    """a source's note on the harpsichord; a value from Linh herself comes in on the person's cor anglais, its D"""
    if k == 'self':
        cor(62, s, 1.4, g * 0.8, pan)
    else:
        harpsichord(SRC[k], s, g, pan)
def pencil(s, sec=0.6, g=0.014, pan=0.0):
    """a pencil on paper: graphite, a dry scratch that flutters with the strokes"""
    x = tt(sec); fl = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 5.5 * x + 2.4 * np.sin(2 * np.pi * 1.7 * x)))
    X(filt(noise(sec), 'band', (900, 2300)) * fl * np.sin(np.pi * x / sec) ** 0.7, s, g * FX, pan)
def ptick(s, g=0.014, pan=0.0):
    """a pencil tick: a short stroke down and a longer one up"""
    pencil(s, 0.08, g, pan); pencil(s + 0.08, 0.15, g * 0.85, pan)
def pcross(s, g=0.014, pan=0.0):
    pencil(s, 0.14, g, pan); pencil(s + 0.22, 0.14, g, pan)
def pring(s, sec=0.7, g=0.013, pan=0.0):
    """a pencil drawn round something: a scratch that swells once round and lifts"""
    x = tt(sec); X(filt(noise(sec), 'band', (800, 2100)) * np.sin(np.pi * x / sec) * (0.7 + 0.3 * np.sin(4 * np.pi * x / sec)), s, g * FX, pan)
def card(s, g=0.026, pan=0.0, sec=0.4):
    """a card set down: paper, and a soft knock under it as it lands"""
    x = tt(sec); X(filt(noise(sec), 'band', (260, 2000)) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
    s_knock(s + sec * 0.55, g * 0.35 * FX, pan, 170)
def slide(s, sec=0.7, g=0.016, pan=0.0):
    """paper sliding over paper, or a line drawn across: a breath of air"""
    s_air(s, sec, g * FX, pan, 180, 1300)
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a tag or a badge set down"""
    s_knock(s, g * FX, pan, f)
def key(s, g=0.016, pan=0.0):
    """a muffled key"""
    s_tap(s, g * FX, pan)
def typing(s, sec, g=0.012, pan=0.0, n=6):
    """a few muffled keys, at an uneven pace, while something is typed in"""
    for k in range(n):
        s_tap(s + sec * (k + 0.3 * ((k * 7) % 3) / 3) / n, g * (0.8 + 0.2 * (k % 2)) * FX, pan)
def click(s, g=0.02, pan=0.0):
    """a mouse button, pressed and let go"""
    s_tap(s, g * FX, pan); s_tap(s + 0.07, g * 0.6 * FX, pan)
def book(s, g=0.03, pan=0.0):
    """a book set down on a table: a low, soft thud, and its pages"""
    x = tt(0.3); X(norm(filt((np.sin(2 * np.pi * 110 * x) * np.exp(-x * 22)).astype(np.float32), 'low', 600)), s, g * FX, pan)
    card(s - 0.08, g * 0.6, pan, 0.3)
def shut(s, g=0.03, pan=0.0):
    """a book shut: the air pressed out of its pages, then its covers meeting"""
    s_air(s - 0.25, 0.3, g * 0.5 * FX, pan, 200, 1200)
    x = tt(0.25); X(norm(filt((np.sin(2 * np.pi * 150 * x) * np.exp(-x * 30) + 0.3 * filt(noise(0.25), 'band', (300, 1500)) * np.exp(-x * 50)).astype(np.float32), 'low', 1200)), s, g * FX, pan)
def stamp(s, g=0.06):
    """a rubber stamp: a low thud and a knock, nothing bright"""
    thud(s, g * FX); s_knock(s + 0.01, g * 0.4 * FX, 0, 200)
def pin(s, g=0.02, pan=0.0):
    """a pin pushed into paper: a short scratch and a small, low knock"""
    pencil(s - 0.05, 0.06, g * 0.5, pan); s_knock(s, g * FX, pan, 320)
def tock(s, g=0.006, pan=0.0, f=1250):
    """a chronometer's beat, softly: a small wooden click with its case ringing briefly, nothing above about 2.4 kHz"""
    x = tt(0.06); cl = filt(noise(0.06), 'band', (500, 2000)) * np.exp(-x * 260)
    body = 0.55 * np.sin(2 * np.pi * f * x) * np.exp(-x * 95) + 0.45 * np.sin(2 * np.pi * f * 0.48 * x) * np.exp(-x * 70)
    X(norm(filt((cl + body).astype(np.float32), 'low', 2400)), s, g * FX, pan)
def whirr(s, sec=1.6, g=0.012, pan=0.0):
    """a clock running fast: its beat quickening into a soft whirr and slowing again, as its hands sweep ahead"""
    x = tt(sec); u = x / sec; sp = np.sin(np.pi * u) ** 1.5
    ph = 2 * np.pi * np.cumsum(4 + 40 * sp) / SR; am = (0.5 + 0.5 * np.sin(ph)) ** 6
    X(norm(filt((filt(noise(sec), 'band', (500, 1800)) * am * (0.3 + 0.7 * sp)).astype(np.float32), 'low', 2200)), s, g * FX, pan)
def flutter(s, sec=0.9, g=0.012, pan=0.0):
    """cards shaken: paper fluttering, quickly dying away"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500)) * np.abs(np.sin(2 * np.pi * 3.8 * x)) * np.exp(-x * 3.2), s, g * FX, pan)
def sea(start, sec, g=0.02):
    """the sea in a harbour, heard from the water: a low swell, and soft washes that come in at their own, uneven times"""
    x = tt(sec); e = np.clip(x / 2.5, 0, 1) * np.clip((sec - x) / 3.0, 0, 1); R = np.random.default_rng(int(start * 10) + 5)
    for side in (-0.6, 0.6):
        low = filt(noise(sec), 'band', (70, 380)) * (0.65 + 0.35 * np.sin(2 * np.pi * 0.06 * x + side * 3))
        wash = np.zeros_like(x); t0 = 0.5 + R.random() * 2
        while t0 < sec:
            d = 2.0 + R.random() * 1.8; i = int(t0 * SR); j = min(len(x), i + int(d * SR)); u = (x[i:j] - t0) / d
            wash[i:j] += np.sin(np.pi * u) ** 2 * (0.5 + 0.5 * R.random()); t0 += 4.0 + R.random() * 3.5
        X(((0.8 * low + 0.55 * filt(noise(sec), 'band', (300, 1300)) * wash) * e).astype(np.float32), start, g * FX, side)

# the twenty-two chronometers, as src/plan.js makes them (M3_CLK, from wc_rng(53)): where each stands, and its rate
def _rng32(seed):
    M = 0xffffffff; s = [(seed & M) or 1]; im = lambda a, b: (a * b) & M
    def r():
        s[0] = (s[0] + 0x6D2B79F5) & M; v = s[0]; t = im(v ^ (v >> 15), 1 | v); t = ((t + im(t ^ (t >> 7), 61 | t)) & M) ^ t
        return ((t ^ (t >> 14)) & M) / 4294967296
    return r
_R = _rng32(53); CLK = []
for i in range(22):
    _R(); CLK.append((220 + (i % 11) * 148, 1 + (_R() - 0.5) * 0.09))
STD = [9, 13]
def beats(rate, a, b):
    """the moments, inside a chapter, at which a chronometer of this rate steps its second hand (twice a second), from a to b"""
    k0 = int(np.ceil(a * rate * 2)); k1 = int(np.floor(b * rate * 2))
    return [k / (rate * 2) for k in range(k0, k1 + 1)]

# chords (MIDI note numbers), low to high: E flat major, its relative C minor, and their neighbours, with no two notes a semitone
# apart, where they would rub. Where a source's note or the person's sounds, the chord holds it or keeps a step away from it
EB_ADD9 = [39, 46, 51, 53, 55, 58]; EB_MAJ9 = [39, 46, 50, 55, 58, 65]; EB_MAJ7 = [39, 46, 50, 55, 58]; EB_69 = [39, 46, 51, 55, 60, 65]
AB_MAJ9 = [44, 51, 55, 58, 60]; AB_MAJ7 = [44, 51, 55, 60, 63]; AB6 = [44, 51, 53, 56, 60]; FM7 = [41, 48, 51, 56, 60]; F9 = [41, 48, 51, 55, 57]
CM_ADD9 = [36, 43, 51, 55, 62]; GM7 = [43, 50, 53, 58, 62]; BB_SUS4 = [34, 46, 51, 53, 58]; BB_ADD9 = [34, 46, 50, 53, 60]; BB6 = [34, 46, 50, 53, 55]
DB_MAJ9 = [49, 53, 56, 60, 63]

# the voice's lines, chapter by chapter: when each starts and ends
_V = {s: [(G(s, v['id']), G(s, v['id']) + _DUR[s + '/' + v['id']]) for v in _NARR[s]['vo']] for s in _NARR}
_ORDER = list(_NARR)
def turn(J, chord, at=None, g=0.03):
    """a chapter's turn: its chord comes in as the chapter before falls silent, swells in the pause between them, and is let go two
    seconds into the new chapter's voice, or as its first line ends if that's sooner, so the voice goes on alone"""
    a, b = _V[J][0]
    bed([(_V[_ORDER[_ORDER.index(J) - 1]][-1][1] + 0.9 if at is None else at, chord)], min(b, a + 2.0), g, 1.2, 2.8)
def moment(t0, t1, chord, g=0.03):
    """a chord in a pause without words, or under a moment on screen: it comes in at t0 and is let go at t1"""
    bed([(t0, chord)], t1, g, 1.2, 2.8)


# 1. Twenty-two clocks: Plymouth in winter, the opening, with the chords all through it, in E flat. The sea; the Beagle's tag; the
#    card of how a ship finds its longitude, and its home clock beating twice a second; the clock running ahead as it drifts; a second
#    clock beating out of step with it; the tag. Then the cabin: twenty-two clocks set on their shelves, each beating at its own rate;
#    the rate book set down and written in; the two standards ringed, and their beat brought forward; every other clock checked
#    against them, a pencil tick each; the book shut; and in the wordless moment, the clocks alone, until the title and the series'
#    mark
J = 'clocks'; B = C(J, 'breath'); tT, tDr, tTwo, tM = C(J, 'time'), W(J, 'drift', 'And clocks drift'), C(J, 'two'), C(J, 'many')
tR, tWr, tStd, tChk, tDec = C(J, 'rated'), W(J, 'rated', 'written down'), W(J, 'standards', 'the standards'), W(J, 'standards', 'checked against'), W(J, 'before', 'decided before')
bed([(S0(J), EB_ADD9), (C(J, 'time', -0.3), AB_MAJ9), (C(J, 'drift', -0.3), FM7), (C(J, 'two', -0.3), CM_ADD9), (C(J, 'many', -0.3), AB_MAJ7),
     (C(J, 'rated', -0.3), BB_SUS4), (C(J, 'standards', -0.3), EB_MAJ7), (C(J, 'before', -0.3), AB6), (B + 0.3, EB_69)], E(J) + 0.6)
sea(S0(J), tM - S0(J) + 0.5, 0.05)
knock(W(J, 'plymouth', 'HMS Beagle', 0.1), 0.016, P(1124))
card(tT - 0.3, 0.026, P(960))
# the longitude card's two clocks: the home clock from the card's arrival, the second from its own; both step twice a second
S, end = S0(J), tM - 0.9
for t0 in np.arange(tT - S, end - S, 0.5):
    if not (tDr - S <= t0 <= tDr - S + 1.6):
        tock(S + t0, 0.005 if speaking(S + t0) else 0.008, P(1150), 1250)
whirr(tDr, 1.6, 0.012, P(1150))
for t0 in np.arange(tTwo - S, end - S, 0.5):
    if t0 >= tTwo - S + 0.15:
        tock(S + t0, 0.005 if speaking(S + t0) else 0.008, P(1290), 1120)
key(W(J, 'two', 'which one', 0.25), 0.014, P(1285))
# the cabin: each clock set on its shelf, then beating at its own rate until the title covers it
for i, (x, rate) in enumerate(CLK):
    a = tM - 0.3 + i * 0.05 - S; knock(S + a + 0.2, 0.007, P(x), 200 + 9 * (i % 11))
    for b in beats(rate, a + 0.25, B + 2.6 - S):
        t0 = S + b; std = i in STD
        lift = 1 + (1.6 if std else -0.45) * float(np.clip((t0 - tStd) / 0.8, 0, 1)) * (1 - float(np.clip((t0 - B) / 1.0, 0, 1)))
        quiet = (0.45 if speaking(t0) else 1.0) * (1 - 0.6 * float(np.clip((t0 - tR + 0.3) / 0.6, 0, 1)) * (1 - float(np.clip((t0 - tStd + 0.4) / 0.6, 0, 1))))
        room = 1 - float(np.clip((t0 - B - 0.8) / 1.8, 0, 1))
        tock(t0, 0.0042 * lift * quiet * room, P(x), 1180 + 40 * ((i * 7) % 5))
key(W(J, 'many', 'twenty-two', 0.3), 0.012, P(960))
book(tR - 0.15, 0.03, P(430))
pencil(tR + 0.15, 0.8, 0.012, P(330)); pencil(tR + 0.75, 0.6, 0.011, P(330))
for i in range(4):
    pencil(tWr - 0.35 + i * 0.45, 0.5 if i < 3 else 0.2, 0.011, P(520))
for j, i in enumerate(STD):
    pring(tStd + 0.1 + j * 0.45, 0.8, 0.013, P(CLK[i][0])); knock(tStd + 0.45 + j * 0.45, 0.014, P(CLK[i][0]), 250)
for i, (x, rate) in enumerate(CLK):
    if i in STD:
        continue
    sx = CLK[STD[0 if i < 11 else 1]][0]; d = abs(x - sx) / 148
    ptick(tChk - 0.1 + d * 0.16 + 0.45, 0.0075, P(x))
shut(tDec + 0.6, 0.03, P(430))
card(tDec + 0.6, 0.02, P(1150), 0.35)
mark(B + 0.9)

# 2. Linked, and still different: the title's chord turns to B flat, and is let go as the voice begins. Linh in white paper, and the
#    person's two notes; her five records set down, each on its source's note; the lines to her; Mei's office's tag; the sheet for the
#    person, and its fields; the records shaking their heads; then each value carried over from its record and opening in its place,
#    on its source's note; the question written in pencil
J = 'linked'; tFive, tC, tWh = W(J, 'linked', 'five records'), C(J, 'counts'), C(J, 'which')
GR = [W(J, 'counts', 'Four ways'), W(J, 'counts', 'Two birth dates'), W(J, 'counts', 'Two mobile'), W(J, 'counts', 'Four emails')]
turn(J, BB_ADD9, S0(J) - 0.3)
person(C(J, 'linked', -0.3), 0.03, P(196))
key(C(J, 'linked'), 0.012, P(196))
for i, k in enumerate(['sis', 'sis', 'ao', 'hr', 'ro']):
    src(k, tFive - 0.1 + i * 0.16 + 0.12, 0.022, P(652))
slide(tFive + 0.2, 1.3, 0.012, P(400))
knock(W(J, 'linked', "Mei's office", -0.05), 0.018, P(652), 230)
card(C(J, 'needs', -0.2), 0.026, P(1445), 0.45)
for t0 in (W(J, 'needs', 'one name'), W(J, 'needs', 'one birth date'), W(J, 'needs', 'a way to reach'), W(J, 'needs', 'a way to reach', 0.3)):
    key(t0, 0.01, P(1100))
flutter(W(J, 'disagree', 'agree'), 1.0, 0.016, P(652))
FIELDS = [['sis', 'ao', 'hr', 'ro'], ['sis', 'hr'], ['sis', 'hr'], ['sis', 'hr', 'ao', 'sis']]
for g, ks in enumerate(FIELDS):
    for j, k in enumerate(ks):
        src(k, GR[g] + j * 0.3 + 0.47, 0.024, P(1300))
pencil(tWh - 0.05, 0.9, 0.012, P(1700))

# 3. One order, hidden in the code: the turn on F minor. The code card; the three sources numbered as they're named; the pencil round
#    both lines and its tag; "in the code"; Mei's card, and her question mark. Then her record, under "newest wins"; HR's card on its
#    note, and its file sent twice; HR's values take the fields, on HR's note over a low A; the typo and the old mobile ringed and
#    written; the name as HR typed it ringed; the transcript; the cross, and "newest isn't truest" written
J = 'hidden'; tQ, tF1, tF2, tTru = C(J, 'quick'), W(J, 'resend', 'its whole file'), W(J, 'resend', 'every teaching'), C(J, 'truest')
tTypo, tOld, tPr, tNew = W(J, 'typo', "HR's typo"), W(J, 'typo', 'her old mobile'), W(J, 'transcript', 'print her name'), W(J, 'resend', 'always look new')
turn(J, FM7)
card(C(J, 'picks', -0.3), 0.028, P(685), 0.5)
for word in ('the student system', 'the learning platform', 'short courses'):
    pencil(W(J, 'order', word), 0.16, 0.013, P(260))
pring(W(J, 'every', 'for every field'), 0.9, 0.013, P(680))
card(W(J, 'every', 'for every field', 0.6), 0.016, P(640), 0.3)
knock(W(J, 'every', 'inside the code', 0.1), 0.018, P(1180))
card(W(J, 'every', 'the people who own', -0.2), 0.022, P(1480))
pencil(W(J, 'every', "can't see"), 0.4, 0.013, P(1650))
slide(tQ - 1.0, 0.6, 0.014, P(600))
card(tQ - 0.35, 0.028, P(545), 0.5)
knock(W(J, 'quick', 'the newest value', 0.1), 0.02, P(870))
card(W(J, 'resend', 'HR sends', -0.2), 0.024, P(1610)); src('hr', W(J, 'resend', 'HR sends', -0.1), 0.026, P(1610))
for t0, x in ((tF1, 1290), (tF2, 1560)):
    slide(t0, 0.7, 0.014, P(x)); card(t0 + 0.55, 0.016, P(x), 0.3)
src('hr', tNew + 0.15, 0.026, P(545)); harpsichord(45, tNew + 0.15, 0.018, P(545))
pring(tTypo, 0.7, 0.014, P(760)); pencil(tTypo + 0.4, 0.5, 0.012, P(900))
pring(tOld, 0.7, 0.014, P(720)); pencil(tOld + 0.4, 0.4, 0.012, P(840))
pring(tPr, 0.7, 0.014, P(500))
card(C(J, 'transcript', 0.2), 0.026, P(1540))
pcross(tTru - 0.5, 0.014, P(1740))
pencil(tTru - 0.05, 1.0, 0.012, P(1540))

# 4. Two names, both hers: the turn on A flat. Her legal name set down; what each part is, in pencil; the accents ringed; her
#    passport, and the student system's tick and tag, on its note; the name without its accents, on the alumni office's note, its
#    missing marks ringed; the name turned round, on HR's, and the pencil that swaps it; the name she chose, on her own note; what
#    each is for, a line and a card each; the two rules still to write
J = 'names'; tFam, tAcc, tCk, tLo, tLa, tHR, tCh = W(J, 'legal', 'family name first'), W(J, 'legal', 'with its accents'), C(J, 'checked'), C(J, 'lost'), W(J, 'lost', 'lost the accents'), W(J, 'lost', 'HR turned'), C(J, 'chose')
tTr, tCl, tID, tRu, tOwn = C(J, 'transcript'), C(J, 'class'), W(J, 'class', 'her ID card'), C(J, 'rule'), W(J, 'rule', 'its own rule')
turn(J, AB_MAJ9)
card(C(J, 'legal', -0.2), 0.03, P(760), 0.5)
for i, x in enumerate([420, 700, 980]):
    pencil(tFam + i * 0.45, 0.6, 0.011, P(x))
for j, x in enumerate([560, 830]):
    pring(tAcc + j * 0.3, 0.5, 0.012, P(x))
card(W(J, 'legal', 'her passport', -0.2), 0.026, P(1550))
ptick(tCk + 0.35, 0.014, P(1710)); card(tCk + 0.5, 0.016, P(1550), 0.3); src('sis', tCk + 0.5, 0.026, P(1550))
card(tLo, 0.024, P(380)); src('ao', tLo + 0.05, 0.024, P(380))
pring(tLa - 0.2, 0.5, 0.012, P(230)); pring(tLa + 0.1, 0.5, 0.012, P(330))
card(tHR - 0.1, 0.024, P(960)); src('hr', tHR - 0.05, 0.024, P(960))
pencil(W(J, 'lost', 'Linh Nguyen'), 0.7, 0.012, P(800))
card(tCh + 0.3, 0.024, P(1570)); src('self', tCh + 0.35, 0.026, P(1570))
slide(tTr, 0.6, 0.012, P(670)); card(tTr + 0.3, 0.022, P(670))
slide(tCl, 0.6, 0.011, P(1350)); card(tCl + 0.3, 0.02, P(1350))
slide(tID, 0.6, 0.011, P(1690)); card(tID + 0.3, 0.02, P(1690))
for i, x in enumerate([340, 1420]):
    knock(tRu + 0.45 + i * 0.5, 0.018, P(x), 230 + 20 * i); key(tOwn + i * 0.3 + 0.1, 0.012, P(x + 240))

# 5. A rule for each field: the turn on E flat. Jun's card; the rules card and her record set down; each field's rule typed in, a few
#    muffled keys; the four most trusted sources ringed in gold, as the standards were; each winner taking its field on its source's
#    note, the losers sliding aside; "waits for Mei", the typo written, Mei's pin; the order every other field falls back on, three
#    chips; then, in the pause, a chord on B flat, as her record slides away for a master data tool's screen, set down, its trusted
#    source on the student system's note, and the rule saved with a click and a tick; the screen sliding away, the file opening out,
#    its name underlined, the SQL typed and the tests ticked; and the wordless moment for the rules, written and tested, on E flat
J = 'rules'; tLe, tPf, tBi, tMo, tCh, tTo, tSi = C(J, 'legal'), C(J, 'preferred'), C(J, 'birth'), C(J, 'mobile'), C(J, 'chain'), C(J, 'tools'), C(J, 'simplest')
tMost, tPass, tFL, tWM, tTy, tPins, tConf = W(J, 'trust', 'trusts most'), W(J, 'legal', 'checked her passport'), W(J, 'preferred', 'from Linh'), W(J, 'waits', 'waits for Mei'), W(J, 'pin', 'still has the typo'), W(J, 'pin', 'Mei pins'), W(J, 'mobile', 'she confirmed')
tSet, tFile, tSQL, tTest = W(J, 'tools', 'set rules'), W(J, 'simplest', 'a file like this'), W(J, 'simplest', 'the code'), W(J, 'simplest', 'the tests')
turn(J, EB_MAJ9); moment(tTo - 0.8, tTo + 2.0, BB6); moment(C(J, 'breath', -0.9), E(J) + 0.2, EB_69)
card(C(J, 'writes', -0.1), 0.022, P(180), 0.35)
card(C(J, 'writes', 0.0), 0.028, P(670), 0.5); card(C(J, 'writes', 0.4), 0.024, P(1440), 0.45)
for t0, sec, n in ((tLe - 0.2, 1.9, 4), (tPf - 0.2, 1.3, 3), (tBi - 0.2, 1.9, 4), (tMo - 0.2, 1.4, 3)):
    typing(t0, sec, 0.011, P(670), n)
for i in range(4):
    pring(tMost + i * 0.18, 0.45, 0.01, P(1096))
slide(tPass, 0.6, 0.012, P(1250)); src('sis', tPass + 0.25, 0.026, P(1250)); knock(tPass + 0.55, 0.016, P(1420))
src('self', tFL + 0.1, 0.026, P(1250))
src('sis', tBi + 1.0, 0.026, P(1250)); slide(tBi + 0.9, 0.6, 0.011, P(1300))
knock(tWM - 0.05, 0.016, P(1380), 200)
pencil(tTy + 0.1, 0.7, 0.012, P(1400))
pin(tPins + 0.35, 0.02, P(1260))
src('sis', tConf + 0.1, 0.026, P(1250)); slide(tConf, 0.6, 0.011, P(1300))
for i, word in enumerate(['the most trusted source', 'the newest confirmed', 'the most complete']):
    knock(W(J, 'chain', word, 0.1), 0.018, P(1250 + 300 * (i - 1)), 220 + 20 * i)
slide(tTo - 0.3, 0.6, 0.011, P(1440)); card(tTo + 0.2, 0.024, P(1470), 0.45); src('sis', tSet + 0.05, 0.02, P(1520))
click(tSet + 1.8, 0.016, P(1786)); ptick(tSet + 2.15, 0.012, P(1662))
slide(tSi - 0.2, 0.6, 0.011, P(1470)); slide(tSi + 0.1, 0.9, 0.008, P(670)); pencil(tFile, 0.6, 0.011, P(510))
slide(tSQL - 0.5, 0.6, 0.014, P(1020))
card(tSQL - 0.2, 0.024, P(1470)); typing(tSQL, 1.6, 0.011, P(1470), 4)
slide(tTest - 0.2, 0.6, 0.014, P(1020)); card(tTest - 0.1, 0.022, P(1470))
ptick(tTest + 0.45, 0.014, P(1150)); ptick(tTest + 1.05, 0.014, P(1150))

# 6. Four emails, each for something: the last chapter's chord turns to E flat's major seventh. The email column; the three that don't
#    fit sliding in and stopping at its edge; then four contact points, each set down on its source's note; what each is for, one
#    after another; its purpose ringed, its source and its day underlined; the two offices that write to her, each on its note, and
#    the line to the address it uses
J = 'emails'; tFour, tSt, tStaff, tPe, tNewer, tEach = W(J, 'column', 'Linh has four'), C(J, 'study'), W(J, 'study', 'Her staff email'), C(J, 'personal'), W(J, 'personal', 'a newer one'), W(J, 'none', 'Each is for')
tPu, tSo, tDay, tUs, tHR, tAO = W(J, 'kept', 'its purpose'), W(J, 'kept', 'its source'), W(J, 'kept', 'the day she'), C(J, 'use'), W(J, 'use', 'HR writes'), W(J, 'use', 'The alumni office')
turn(J, EB_MAJ7, S0(J) - 0.3)
card(C(J, 'column', -0.2), 0.026, P(660))
for i in range(3):
    slide(tFour + i * 0.25, 0.5, 0.01, P(1300)); knock(tFour + i * 0.25 + 0.62, 0.014, P(1000), 260)
for t0, k, i in ((tSt - 0.1, 'sis', 0), (tStaff - 0.1, 'hr', 1), (tPe + 0.1, 'ao', 2), (tNewer - 0.1, 'sis', 3)):
    card(t0 + 0.1, 0.022, P(710)); src(k, t0 + 0.15, 0.024, P(710))
for i in range(4):
    knock(tEach + i * 0.15 + 0.1, 0.012, P(1100), 250 + 15 * i)
pring(tPu, 0.6, 0.012, P(1060))
pencil(tSo, 0.45, 0.011, P(420)); pencil(tDay, 0.45, 0.011, P(680))
slide(tUs - 0.9, 1.2, 0.012, P(800))
card(tHR, 0.022, P(1550)); src('hr', tHR + 0.05, 0.024, P(1550)); slide(tHR + 0.3, 0.6, 0.01, P(1300))
card(tAO, 0.022, P(1550)); src('ao', tAO + 0.05, 0.024, P(1550)); slide(tAO + 0.3, 0.6, 0.01, P(1300)); pencil(tAO + 0.5, 0.6, 0.011, P(600))

# 7. Every value, with its source: the turn on G minor. Her record; each value's source, its rule and its age, appearing in turn; the
#    record stepping aside; the values that lost, one click away, each on its source's note; the answer to "why 14 March" underlined;
#    the three that read from it, each a line and a card
J = 'sources'; tWhere, tRule, tOldS, tLo, tStill, tClick = W(J, 'says', 'where it came from'), W(J, 'says', 'which rule'), W(J, 'says', 'how old'), C(J, 'lost'), W(J, 'lost', 'still there'), W(J, 'lost', 'one click')
tMar, tTrn, tCls, tAOs = W(J, 'why', 'the fourteenth of March'), W(J, 'read', 'Her transcript'), W(J, 'read', 'her class list'), W(J, 'read', 'the alumni office')
turn(J, GM7)
card(S0(J) + 0.05, 0.022, P(680), 0.45)
for t0 in (tWhere, tRule, tOldS):
    key(t0 + 0.05, 0.012, P(700)); key(t0 + 0.17, 0.009, P(760))
slide(tLo - 0.5, 1.0, 0.012, P(700))
knock(tStill - 0.3, 0.016, P(930)); click(tClick, 0.02, P(990))
slide(tClick + 0.1, 0.5, 0.011, P(1150)); card(tClick + 0.3, 0.022, P(1540))
for i, k in enumerate(['ao', 'hr', 'ro']):
    src(k, tClick + 0.45 + i * 0.12, 0.018, P(1540))
pencil(tMar, 0.7, 0.012, P(600))
for t0 in (tTrn, tCls, tAOs):
    card(t0, 0.02, P(1580)); slide(t0 + 0.2, 0.5, 0.009, P(1300))

# 8. See it before it changes: the turn on F. Mei's card; the rule as it is; the alumni office's request, on its note, typed; the new
#    rule, a draft, the old one stepping back, its text typed; the dry run set down, its rows listed; the count; Linh's row lit, on
#    her own note; Mei's ticks on the sample; the registrar's stamp; version two
J = 'dryrun'; tAs, tPE, tNw, tRec, tDry, tList, tOne, tLinh = C(J, 'asks'), W(J, 'asks', 'for personal email'), W(J, 'asks', 'asks for a new one'), W(J, 'asks', 'confirmed most recently'), W(J, 'dry', 'a dry run'), W(J, 'dry', 'lists every value'), W(J, 'count', 'One thousand'), W(J, 'count', "Linh's among")
tSmp, tAps, tV2, tDate = W(J, 'approve', 'checks a sample'), W(J, 'approve', 'approves'), W(J, 'runs', 'version two'), W(J, 'runs', 'with its date')
turn(J, F9)
card(S0(J) + 0.55, 0.018, P(1528), 0.35)
card(C(J, 'change', -0.1), 0.024, P(360))
card(tAs, 0.022, P(1120)); src('ao', tAs + 0.05, 0.024, P(1120)); typing(tPE, 1.4, 0.01, P(1120), 4)
card(tNw + 0.1, 0.024, P(360)); slide(tNw, 0.6, 0.01, P(450))
typing(tRec - 0.4, 0.9, 0.01, P(360), 3)
card(tDry - 0.2, 0.028, P(740), 0.5)
typing(tList, 1.3, 0.009, P(500), 4)
knock(tOne, 0.018, P(1150))
src('self', tLinh + 0.1, 0.022, P(600))
ptick(tSmp + 0.1, 0.014, P(1330)); ptick(tSmp + 0.6, 0.014, P(1330))
stamp(tAps + 0.15, 0.06)
knock(tV2 + 0.1, 0.016, P(360))

# 9. Elsewhere: the turn on D flat. The bank, its statement and her legal name on it; the app that greets her by the one she chose;
#    the shop, its order, the two addresses and what each is for; then the three parts of the question, one after another, rising on
#    the harpsichord, in E flat
J = 'elsewhere'; tSh, tEach, tQ = C(J, 'shop'), W(J, 'shop', 'each for'), [W(J, 'same', 'which value'), W(J, 'same', 'for what'), W(J, 'same', 'who says so')]
turn(J, DB_MAJ9)
card(C(J, 'bank', -0.2), 0.026, P(960), 0.5)
card(C(J, 'statements', -0.1), 0.022, P(860)); knock(W(J, 'statements', 'legal name', -0.1), 0.014, P(760))
knock(W(J, 'app', 'greets them', -0.25), 0.016, P(1250), 300); key(W(J, 'app', 'greets them', 0.1), 0.012, P(1250)); key(W(J, 'app', 'greets them', 0.22), 0.01, P(1250))
slide(tSh - 1.2, 1.0, 0.012, P(700))
card(tSh - 0.1, 0.026, P(1425), 0.5)
knock(W(J, 'shop', 'a billing address'), 0.012, P(1250)); knock(W(J, 'shop', 'a delivery address'), 0.012, P(1250))
knock(tEach + 0.1, 0.016, P(1700), 250); knock(tEach + 0.4, 0.016, P(1700), 270)
for i, (t0, m) in enumerate(zip(tQ, [63, 67, 70])):
    knock(t0, 0.016, P(620 + 340 * i), 230 + 20 * i); harpsichord(m, t0 + 0.02, 0.018, P(620 + 340 * i))

# 10. Thirty-three seconds: Falmouth in autumn, the turn on E flat, and the sea; the card, and its 33 seconds, then, in the pause, a
#     chord on B flat; in turn, the rate book set down, and every port ticked, one after another, and the tag; the book carried across
#     to Linh's rules; their card, its tag, and the night's tick; from the pause before the last line, A flat, and on the end card,
#     E flat and the series' mark
J = 'home'; B = C(J, 'breath'); tSa, tBef, tPort, tWr, tNight = C(J, 'same'), W(J, 'settled', 'settled before'), W(J, 'settled', 'checked at every port'), W(J, 'same', 'written down'), W(J, 'same', 'tested every night')
turn(J, EB_MAJ9); moment(C(J, 'settled', -0.8), C(J, 'settled', 2.0), BB_SUS4)
bed([(C(J, 'declared', -0.8), AB_MAJ9), (B + 0.3, EB_69)], TOT + 1.0, 0.03, 1.2, 2.8)
sea(S0(J), C(J, 'out') - S0(J) + 1.5, 0.05)
card(W(J, 'out', 'five years', -0.2), 0.024, P(690))
knock(W(J, 'out', 'thirty-three seconds', 0.0), 0.016, P(580))
book(tBef - 0.1, 0.028, P(430))
for i in range(7):
    ptick(tPort + i * 0.18 + 0.15, 0.009, P(700 + 78 * i))
card(tPort + 0.75, 0.016, P(934), 0.3)
slide(tSa - 0.6, 0.9, 0.012, P(450))
knock(tSa + 0.45, 0.014, P(470))
card(tWr - 0.1, 0.026, P(1250)); knock(tWr + 0.45, 0.014, P(1250))
ptick(tNight + 0.1, 0.014, P(1088)); card(tNight + 0.35, 0.016, P(1278), 0.3)
mark(B + 1.1)

# and the chords, where they come in
play_bed()
