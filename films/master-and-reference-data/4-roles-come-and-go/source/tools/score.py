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
# The effects are the film's own: a mallet on a chisel as the stone is cut, a parchment unrolled, a pencil, a rubber, a small card turned
# over each night, a pin, a brush, paper, muffled keys, footsteps on a pavement, and a heart.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the narration; nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#  - The one exception is feeling: when Planning asks about last year and every answer still says today, a low, muted pulse
#    (music.py's urgent()) rises under the board, leaning on the semitone, and fades as the chapter ends.
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

# ---- the film's instruments, all low-passed ----
# the music's levels: the choir sits about 21 dB under the voice, as in the other series' films, and the notes over it a little less.
# Each instrument is trimmed to come out as loud as its part in One person, many roles at the same gain (measured on its own, as
# integrated loudness): the choir as its watercolour chords, the felt piano as its plucked cello, the glass as its bowed one
BED, NOTE = 1.66, 1.5
TRIM = {'choir': 0.68, 'piano': 0.9, 'glass': 1.4}
# the choir's vowel, a hum rounded to "oo": each formant's centre, level and width, in Hz
VOW = [(300, 1.0, 85), (790, 0.3, 120), (2250, 0.045, 170)]
def _form(f):
    return sum(a * np.exp(-((f - c) / bw) ** 2 / 2) for c, a, bw in VOW) + 0.03
def _singer(m, sec, seed, cents):
    """one singer holding note m: a voice whose overtones are shaped by the vowel, a vibrato that comes in late, and the slow drift of
    someone holding a long note"""
    r = np.random.default_rng(seed); x = tt(sec).astype(np.float64); f0 = mf(m) * 2 ** (cents / 1200)
    vd = 0.0042 * np.clip((x - 0.8) / 1.4, 0, 1)
    dr = 0.0014 * (0.6 * np.sin(2 * np.pi * r.uniform(0.05, 0.11) * x + r.uniform(0, 6.3)) + 0.4 * np.sin(2 * np.pi * r.uniform(0.17, 0.29) * x + r.uniform(0, 6.3)))
    ph = 2 * np.pi * np.cumsum(f0 * (1 + vd * np.sin(2 * np.pi * r.uniform(4.8, 5.6) * x + r.uniform(0, 6.3)) + dr)) / SR
    s = np.zeros_like(x)
    for k in range(1, 14):
        if k * f0 > 1800:
            break
        s += np.sin(k * ph + r.uniform(0, 6.3)) * k ** -1.3 * _form(k * f0)
    return s * (1 + 0.05 * np.sin(2 * np.pi * r.uniform(0.15, 0.3) * x + r.uniform(0, 6.3)))
def _hum(m, a, b, g):
    """note m, sung from a, held until b and then let go: one singer to a note, as in a small vocal group, placed across the field by
    pitch (two voices on one note a few cents apart beat against each other, and on a phone's one speaker that swells and fades
    like a slow pulse)"""
    sec = b - a + 2.6; x = tt(sec)
    e = (np.clip(x / 1.8, 0, 1) ** 1.6 * np.clip((sec - x) / 2.6, 0, 1)).astype(np.float32)
    s = _singer(m, sec, m * 31 + int(a * 7), 0.0) + filt(noise(sec), 'band', (250, 1100)) * 0.012
    put(filt((s * e).astype(np.float32), 'low', 1500), a, g * BED * TRIM['choir'] * 0.7, max(-0.5, min(0.5, (m - 55) / 28)))
CH = []
def chords(keys):
    """the chapter's chords, each from its moment, kept for the choir, which sings the whole film's at the end"""
    CH.extend(keys)
def choir(keys, end, g=0.03):
    """the choir: each chord comes in a little early, so it has bloomed by its moment, its new voices one after another from the
    lowest; a voice the next chord shares holds on through the change, and the rest end just after the next chord starts"""
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
def fpiano(m, start, g=0.03, pan=0.0, sec=3.4):
    """a felt piano: the felt muffles the hammer's top, two strings a hair apart, and a soft thump as it lands; a role"""
    f = mf(m); x = tt(sec).astype(np.float64); s = np.zeros_like(x)
    for k in range(1, 10):
        fk = k * f * np.sqrt(1 + 0.00035 * k * k)
        if fk > 2000:
            break
        e = 0.7 * np.exp(-x * (1.6 + 0.9 * k)) + 0.3 * np.exp(-x * (0.35 + 0.12 * k))
        for det in (-0.7, 0.7):
            s += k ** -1.7 * np.sin(2 * np.pi * fk * 2 ** (det / 1200) * x + 0.37 * k) * e * 0.5
    s = s + filt(noise(sec), 'band', (90, 420)) * np.exp(-x * 45) * 0.12
    s = s * np.minimum(1, x / 0.005) * np.clip((sec - x) / 0.4, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 1700)), start, g * NOTE * TRIM['piano'], pan)
# each role's note, the same in every chapter, and the same as in One person, many roles
ROLE = {'student': 50, 'applicant': 52, 'researcher': 55, 'tutor': 57, 'alumna': 62}
def role(r, s, g=0.03, pan=0.0):
    fpiano(ROLE[r], s, g, pan)
def glass(m, start, sec, g=0.03, pan=0.0):
    """a glass harmonica, rubbed: an almost pure tone that swells in, a faint ring of the glass above it, a slow shimmer"""
    f = mf(m); x = tt(sec).astype(np.float64); s = np.zeros_like(x)
    for det, p in ((-1.5, 0.0), (1.5, 1.1)):
        ph = 2 * np.pi * f * 2 ** (det / 1200) * x + p
        s += 0.5 * (np.sin(ph) + 0.09 * np.sin(2 * ph + 0.5) + 0.025 * np.sin(3 * ph))
    s += 0.02 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x * 1.5)
    s = s + filt(noise(sec), 'band', (f * 0.9, f * 1.8)) * 0.035
    sh = 1 + 0.06 * np.sin(2 * np.pi * 1.3 * x) * np.clip((x - 0.4) / 0.8, 0, 1)
    e = np.clip(x / 0.45, 0, 1) ** 1.5 * np.clip((sec - x) / min(1.4, sec * 0.45), 0, 1)
    put(norm(filt((s * sh * e).astype(np.float32), 'low', 1600)), start, g * NOTE * TRIM['glass'], pan)
def person(s, g=0.026, pan=0.0, hold=3.4):
    """the person: the glass's D, and the A above it, the same two notes wherever someone stands in white paper as the person"""
    glass(62, s, hold, g, pan); glass(69, s + 0.55, hold - 0.5, g * 0.55, pan + 0.15)
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet: odd harmonics, a breath as it speaks, a slow vibrato that comes in late"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.0 * x) * np.clip((x - 0.35) / 0.5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def mark(start, root=62, g=0.05):
    """the series' mark, 1-8-5-1, on the clarinet, over the felt piano's root"""
    for i, iv in enumerate([0, 12, 7, 0]):
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
def flick(s, g=0.018, pan=0.0):
    """a small card turned over: a quick flick of paper, and the card settling"""
    x = tt(0.16); X(filt(noise(0.16), 'band', (500, 2200)) * np.exp(-x * 28) * np.minimum(1, x / 0.01), s, g, pan); s_knock(s + 0.05, g * 0.4, pan, 300)
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
def tap(s, g=0.016, pan=0.0):
    """a muffled key"""
    s_tap(s, g, pan)
def typing(s, sec, g=0.012, pan=0.0, n=5):
    """a few muffled keys, while something is typed in"""
    for k in range(n):
        s_tap(s + k * sec / n, g * (0.8 + 0.2 * (k % 2)), pan)
def pin(s, g=0.02, pan=0.0):
    """a pin pushed into a board: a small knock and a soft tap"""
    s_knock(s, g, pan, 330); s_tap(s + 0.015, g * 0.6, pan)
def chisel(s, g=0.02, pan=0.0):
    """a mallet on a chisel, into stone: a dull knock and a grain of grit, nothing bright"""
    x = tt(0.12); k = np.sin(2 * np.pi * 420 * x) * np.exp(-x * 70) + 0.5 * np.sin(2 * np.pi * 960 * x) * np.exp(-x * 110)
    X(norm(filt((k + filt(noise(0.12), 'band', (600, 2000)) * np.exp(-x * 55) * 0.6).astype(np.float32), 'low', 2200)), s, g, pan)
def carve(s, sec, g=0.018, pan=0.0):
    """a line cut in the stone: a stroke of the mallet every fifth of a second along it, a little uneven"""
    n = max(2, int(round(sec / 0.2))); r = np.random.default_rng(int(s * 100))
    for k in range(n):
        chisel(s + k * sec / n + r.uniform(-0.02, 0.02), g * (0.8 + 0.25 * r.random()), pan)
def air(s, sec=0.7, g=0.02, pan=0.0):
    """a breath of air: a line drawn, a card sliding in"""
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
BBMAJ7B = [46, 53, 57, 62, 65]; GM11 = [43, 53, 57, 60, 62]; EBMAJ7 = [39, 51, 55, 58, 62]; F6 = [41, 53, 57, 60, 62]
DM9 = [38, 50, 57, 60, 64]; BBMAJ9 = [46, 53, 57, 60, 62]; GM9B = [43, 53, 58, 62, 65]; EBMAJ7S11B = [39, 51, 57, 58, 62]; A7SUS4B9 = [45, 52, 55, 58, 62]
A7B9 = [45, 52, 55, 58, 61]
DMAJ9 = [38, 50, 57, 61, 64]; BM9 = [47, 50, 57, 61, 66]; GMAJ9 = [43, 50, 57, 59, 66]; D_FS = [42, 50, 57, 62, 66]; EM9 = [40, 50, 55, 59, 66]
A6SUS2 = [45, 52, 57, 59, 66]; GMAJ9S11 = [43, 50, 57, 61, 66]
AM = [45, 52, 57, 60, 64]; FMAJ7 = [41, 52, 57, 60, 65]; DM9B = [38, 52, 57, 60, 65]; E7SUS4 = [40, 52, 57, 59, 62]; ASUS2 = [45, 52, 57, 59, 64]
CMAJ9 = [48, 52, 55, 59, 62]; D69 = [38, 50, 54, 59, 64]; BM7 = [47, 50, 54, 57, 62]; EM7 = [40, 50, 55, 59, 62]; CMAJ7 = [48, 52, 55, 59, 64]
GMAJ7_D = [38, 50, 55, 59, 66]
AM7 = [45, 52, 55, 60, 64]; FMAJ9 = [41, 52, 55, 57, 64]; G6 = [43, 50, 55, 59, 64]; DM9C = [38, 50, 53, 57, 64]
GM11B = [43, 50, 53, 58, 60]; EBMAJ9B = [39, 50, 55, 58, 65]; CM9B = [48, 51, 55, 58, 62]; BBADD9 = [46, 53, 58, 60, 62]
FMAJ7B = [41, 53, 57, 60, 64]; DM9D = [38, 53, 57, 60, 64]; C69 = [48, 52, 57, 60, 62]; A7SUS4 = [45, 52, 55, 57, 62]
DMAJ7 = [38, 50, 57, 61, 66]; DMAJ9END = [38, 45, 54, 57, 61, 64]


# 1. A ladder of offices: G minor. The stone tablet set down, and his name cut into it; each office cut as it's named, a step up the
#    felt piano at a time; the sheet, and its line of years; the four lines lifting off onto their rungs, the ladder again, quicker;
#    a tick at each rung's start and end; the censorship's rung, a step higher; the census list unrolled, and the names, ages and
#    holdings written; "census", large; the series' mark under the title, on G
J = 'rome'; B = C(J, 'breath'); tMar, tEach, tSeq = C(J, 'cato'), C(J, 'roles'), W(J, 'roles', 'sequence')
tOff = [W(J, 'cato', 'quaestor'), W(J, 'cato', 'aedile'), W(J, 'cato', 'praetor'), W(J, 'cato', 'in 195')]
tCen, tWrote = W(J, 'census', 'censor.'), W(J, 'census', 'wrote')
chords([(S0(J), GMADD9), (C(J, 'cato', -0.3), EBMAJ9), (W(J, 'cato', 'praetor', -0.3), CM9), (W(J, 'cato', 'in 195', -0.3), D7SUS4), (C(J, 'roles', -0.3), BBMAJ7),
        (W(J, 'roles', 'a start', -0.3), GM9), (C(J, 'census', -0.3), EBMAJ7S11), (W(J, 'census', 'wrote', -0.3), CM9), (W(J, 'census', 'the census', -0.3), DSUS4), (B + 0.2, GMADD9)])
knock(tMar - 0.35, 0.026, P(760), 150)
carve(tMar, 1.4, 0.018, P(760))
for i, (t0, m) in enumerate(zip(tOff, [55, 57, 58, 60])):
    carve(t0 - 0.1, 0.8, 0.016, P(760)); fpiano(m, t0 - 0.1, 0.03, P(760))
paper(tEach - 0.2, 0.034, P(1470), 0.6)
stroke(W(J, 'roles', 'its year', -0.2), 0.6, 0.012, P(1150), P(1800))
knock(W(J, 'roles', 'one man', -0.05), 0.02, P(1300))
fly(tSeq - 0.15, 1.65, 0.016, P(760), P(1450))
for i, (x, m) in enumerate(zip([1166, 1321, 1352, 1445], [55, 57, 58, 60])):
    fpiano(m, tSeq + 0.6 + i * 0.24, 0.022, P(x))
tick_(W(J, 'roles', 'a start'), 0.014, P(1300)); tick_(W(J, 'roles', 'an end'), 0.014, P(1400))
fpiano(62, tCen - 0.05, 0.03, P(1794)); tick_(tCen + 0.55, 0.014, P(1794))
unroll(tWrote - 0.3, 1.1, 0.024, P(700))
quill(W(J, 'census', 'every', -0.1), 1.2, 0.013, P(560)); quill(W(J, 'census', 'age', -0.1), 0.55, 0.012, P(680)); quill(W(J, 'census', 'owned', -0.1), 1.05, 0.012, P(820))
quill(W(J, 'census', 'the census', -0.05), 0.75, 0.017, P(640))
mark(B + 0.8, 55)

# 2. Census date: B flat major. The paper clears off the campus, a brush; the calendar pinned up; "date" written, and a pencil round
#    the 31st; the word "census" carried over from Rome; Planning's card, and its question typed in; the alumni office's card, the
#    ghost of its email, and its question
J = 'census'; tPl, tAl, tInv = C(J, 'planning'), W(J, 'alumni', 'alumni office'), W(J, 'alumni', 'invited')
chords([(S0(J), BBMAJ7B), (C(J, 'planning', -0.3), GM11), (C(J, 'alumni', -0.3), EBMAJ7), (W(J, 'alumni', 'which of', -0.3), F6)])
brush(S0(J) + 0.2, 0.02, 0.0, 1.3)
pin(W(J, 'date', 'university', -0.1), 0.022, P(261))
quill(W(J, 'date', 'date is', -0.05), 0.5, 0.015, P(300))
ring(W(J, 'date', 'thirty-first', -0.1), 0.7, 0.015, P(261))
fly(W(J, 'date', 'census date', -0.95), 0.85, 0.014, P(597), P(240))
paper(tPl - 0.1, 0.03, P(1380)); typing(W(J, 'planning', 'How', -0.1), 1.9, 0.011, P(1380), 8)
paper(tAl - 0.1, 0.03, P(1380)); paper(tInv - 0.05, 0.02, P(1380), 0.35)
typing(W(J, 'alumni', 'which of', -0.1), 2.0, 0.011, P(1380), 8)

# 3. True for a day: D minor, then the pulse. The four systems set down; the moon; the lines down to the platform's copy, and the
#    copy; each status written as it's named, on its role's note; each night the moon's glow, the date turned over, every status
#    rubbed out and written again; Planning's card asking about last year, typed in, and its badge; a pencil round today's date; the
#    tick on Linh as a student; the red ring and the red note; under the last two lines, the pulse
J = 'flags'; tN, tPf = C(J, 'night'), W(J, 'night', 'platform'); tPl = W(J, 'again', 'Planning')
tSt = [W(J, 'says', 'enrolled'), W(J, 'says', 'casual staff'), W(J, 'says', 'project member'), W(J, 'says', 'graduate')]
nights = [W(J, 'over', 'a day', 0.15), W(J, 'over', 'the next', 0.05)]
chords([(S0(J), DM9), (C(J, 'says', -0.3), BBMAJ9), (C(J, 'over', -0.3), GM9B), (C(J, 'again', -0.3), EBMAJ7S11B), (C(J, 'wrong', -0.3), A7SUS4B9),
        (W(J, 'wrong', 'four months', -0.3), A7B9)])
SX = [285, 735, 1185, 1635]
for i in range(4):
    knock(tN + 0.25 + i * 0.22, 0.018, P(SX[i]), 210 + 15 * i)
moon(W(J, 'night', 'night', -0.1), 0.016)
air(tPf - 0.1, 1.2, 0.016, P(910)); paper(tPf - 0.2, 0.026, P(910))
for i, r in enumerate(['student', 'tutor', 'researcher', 'alumna']):
    quill(tSt[i] - 0.1, 0.85, 0.014, P(SX[i])); role(r, tSt[i] - 0.05, 0.026, P(SX[i]))
for k, n in enumerate(nights):
    gk = 1 if k == 0 else 0.75
    moon(n, 0.011 * gk); flick(n + 0.05, 0.016 * gk, P(1180))
    rub(n, 0.7, 0.014 * gk, 0.0); quill(n + 0.35, 0.85, 0.012 * gk, 0.0)
paper(tPl - 0.2, 0.03, P(1580)); typing(tPl + 0.2, 1.4, 0.011, P(1580), 6)
knock(W(J, 'again', 'census date', -0.1), 0.02, P(1480))
ring(W(J, 'again', 'today', -0.1), 0.7, 0.015, P(1180))
tick_(W(J, 'wrong', 'counts', -0.05), 0.016, P(1350))
ring(W(J, 'wrong', 'March', -0.1), 0.8, 0.018, P(1470))
quill(W(J, 'wrong', 'four months'), 1.5, 0.014, P(1500))
urgent(C(J, 'again', -0.3), E(J) + 0.6, bpm=92, root=45, g=0.04, steps=(0, 0, 1, 0))

# 4. A start and an end: D major. Each system's dates written in; the form, and each field as it's said; the form folded up to the top;
#    Linh in white paper, on the person's notes; the line of years drawn; each role painted on, a brush and its note; the second
#    applicant and student periods, on theirs; today's line, and its tag; the arrows, and the pencil round the four of 2026; the person's
#    notes, held, on "the person under them"
J = 'bands'; tKnow, tSame, tUn = W(J, 'know', 'knows'), W(J, 'shape', 'same shape'), C(J, 'under')
tF = [W(J, 'shape', 'the person'), W(J, 'shape', 'kind of role'), W(J, 'shape', 'office that owns'), W(J, 'shape', 'when it starts'), W(J, 'shape', 'when it ends')]
tApp, tStu, t19, t22, tAlu = C(J, 'first'), W(J, 'first', 'then student'), W(J, 'first', 'nineteen'), W(J, 'first', 'twenty-two'), W(J, 'first', 'Then alumna')
tTut, tTf, tAg, tJul, tRes = C(J, 'tutor'), W(J, 'tutor', 'from'), C(J, 'again'), W(J, 'again', 'July'), C(J, 'research')
tMarch, tDec, tYr = W(J, 'research', 'March'), W(J, 'research', 'December'), W(J, 'research', 'this year')
tFol, tOnce, tPer = W(J, 'stays', 'follow'), W(J, 'stays', 'run at once'), W(J, 'stays', 'The person')
chords([(S0(J), DMAJ9), (C(J, 'shape', -0.3), BM9), (C(J, 'under', -0.3), GMAJ9), (C(J, 'first', -0.3), D_FS), (C(J, 'tutor', -0.3), EM9), (C(J, 'again', -0.3), A6SUS2),
        (C(J, 'research', -0.3), GMAJ9S11), (C(J, 'stays', -0.3), DMAJ9)])
for i in range(4):
    quill(tKnow - 0.2 + i * 0.4, 0.8, 0.013, P(SX[i]))
paper(tSame - 0.4, 0.03, P(960))
for k, t0 in enumerate(tF):
    quill(t0 - 0.1, 0.5, 0.013, P(900))
air(tUn - 0.6, 0.9, 0.016, 0.1); knock(tUn - 0.1, 0.016, P(1100))
person(tUn, 0.018, P(200), 3.0)
stroke(W(J, 'under', 'bands', -0.2), 1.4, 0.011, P(760), P(1880))
X4 = lambda d: 760 + (d - 2018.5) / 8.5 * 1120
for r, s, d, sec in [('applicant', tApp, 2018.62, 0.6), ('student', tStu, 2019.15, t22 - t19 + 0.5), ('alumna', tAlu, 2022.95, 1.0), ('tutor', tTut, 2023.14, 1.0)]:
    role(r, s, 0.03, P(X4(d)))
brush(tApp + 0.1, 0.016, P(X4(2018.62)), 0.6); brush(t19 - 0.25, 0.018, P(X4(2020.5)), t22 - t19 + 0.5); brush(tAlu, 0.016, P(X4(2024)), 1.0)
brush(tTf - 0.1, 0.016, P(X4(2024.5)), 1.0)
role('applicant', tAg, 0.026, P(X4(2025.42))); brush(tAg + 0.05, 0.014, P(X4(2025.45)), 0.5)
role('student', tJul - 0.2, 0.028, P(X4(2025.55))); brush(tJul - 0.2, 0.016, P(X4(2026)), 1.0)
role('researcher', tRes, 0.03, P(X4(2026.17))); brush(tMarch - 0.1, 0.016, P(X4(2026.6)), tDec - tMarch + 0.4)
stroke(tYr - 0.3, 0.9, 0.011, P(X4(2026.3))); knock(tYr + 0.1, 0.016, P(X4(2026.3)))
quill(tFol - 0.1, 0.45, 0.013, P(X4(2019))); quill(tFol + 0.35, 0.4, 0.013, P(X4(2022.95)))
ring(tOnce, 0.9, 0.015, P(1820))
person(tPer, 0.026, P(200), 4.2)

# 5. A contract each term: A minor. "film 1: one band" written, and its arrow; the band breaking into seven contracts, the tutor's note
#    once for each, left to right; HR's card typed in; a pencil mark at every contract's start, then at every end; a pin at 15 January,
#    in a gap: not staff; a pin at census date, in a contract: staff, on the tutor's note
J = 'terms'; tOneB, tNew = W(J, 'drew', 'one band'), W(J, 'hr', 'new contract')
tBet, tNot, tCD, tIs = W(J, 'jan', 'between'), W(J, 'jan', "isn't staff"), W(J, 'jan', 'census date'), W(J, 'jan', 'she is.')
chords([(S0(J), AM), (C(J, 'hr', -0.3), FMAJ7), (C(J, 'every', -0.3), DM9B), (C(J, 'jan', -0.3), E7SUS4), (W(J, 'jan', 'census date', -0.3), ASUS2)])
X5 = lambda d: 760 + (d - 2022.6) / 4.4 * 1120
quill(tOneB - 0.4, 0.9, 0.014, P(X5(2023.14))); quill(tOneB, 0.35, 0.012, P(X5(2023.14)))
for k, d in enumerate([2023.3, 2023.75, 2024.3, 2024.75, 2025.3, 2025.75, 2026.3]):
    fpiano(57, tNew + 0.1 + k * 0.13, 0.022 * (1 - 0.05 * k), P(X5(d)))
paper(C(J, 'hr', -0.1), 0.028, P(1540)); typing(W(J, 'hr', 'offers', -0.1), 2.6, 0.01, P(1540), 9); typing(W(J, 'hr', 'one unit', -0.1), 0.5, 0.01, P(1540), 3)
quill(W(J, 'every', 'starts', -0.1), 0.95, 0.012, 0.0); quill(W(J, 'every', 'ends', -0.1), 0.95, 0.012, 0.1)
X5b = lambda d: 760 + (d - 2025.55) / 1.05 * 1120
knock(tBet - 0.3, 0.018, P(X5b(2026.04))); pin(tBet + 0.55, 0.02, P(X5b(2026.04))); quill(tNot - 0.1, 0.5, 0.014, P(X5b(2026.04)))
knock(tCD - 0.3, 0.018, P(X5b(2026.25))); pin(tCD + 0.55, 0.02, P(X5b(2026.25))); quill(tIs - 0.05, 0.4, 0.014, P(X5b(2026.25)))
role('tutor', tIs, 0.026, P(X5b(2026.25)))

# 6. One line, one date: G major. Planning's card; the line drawn top to bottom at census date, and its tag; where it crosses each open
#    role, a dot and that role's note, so the four make a chord; the three rows counted; folded into one person, a breath of air, the
#    person's notes, and a tick; the line carried back a year, and the two roles still open there; the badge, "as it was"; the line
#    carried forward; the alumni office's filter, typed in; the tick, and her student and alumna notes together; a pencil round July
J = 'line'; tLine, tCen = W(J, 'draw', 'one line'), W(J, 'draw', 'census'); tCnt, tOneP = W(J, 'once', 'counts once'), W(J, 'once', 'one person')
tMove, tFil, tFw, tRole = C(J, 'back'), C(J, 'filter'), W(J, 'filter', 'a filter'), W(J, 'filter', 'student role')
tDot = [C(J, 'open'), W(J, 'open', 'tutor'), W(J, 'open', 'researcher'), W(J, 'open', 'alumna')]
chords([(S0(J), GMAJ9), (C(J, 'open', -0.3), EM9), (C(J, 'once', -0.3), CMAJ9), (W(J, 'once', 'one person', -0.3), D69), (C(J, 'back', -0.3), BM7), (C(J, 'kept', -0.3), EM7),
        (C(J, 'filter', -0.3), CMAJ7), (C(J, 'since', -0.3), GMAJ7_D)])
X6 = lambda d: 760 + (d - 2024.55) / 2.45 * 1120
xC, xC0 = X6(2026.246), X6(2025.246)
paper(W(J, 'draw', 'Planning', -0.2), 0.028, P(650))
stroke(tLine - 0.1, 0.9, 0.013, P(xC)); knock(tCen + 0.05, 0.018, P(xC))
for i, r in enumerate(['student', 'tutor', 'researcher', 'alumna']):
    role(r, tDot[i] - 0.05, 0.026, P(xC))
for i in range(3):
    knock(tCnt - 0.1 + i * 0.3, 0.015, P(650), 230 + 20 * i)
air(tOneP - 0.2, 1.0, 0.014, P(650)); person(tOneP + 0.3, 0.022, P(200), 3.4); tick_(tOneP + 0.5, 0.015, P(380))
fly(tMove - 0.1, 1.5, 0.016, P(xC), P(xC0))
role('tutor', W(J, 'back', 'a tutor'), 0.022, P(xC0)); role('alumna', W(J, 'back', 'an alumna'), 0.022, P(xC0))
knock(W(J, 'kept', 'stays', -0.05), 0.018, P(880))
paper(W(J, 'filter', 'alumni office', -0.1), 0.028, P(650)); fly(tFil - 0.5, 1.5, 0.014, P(xC0), P(xC))
typing(tFw - 0.1, tRole - tFw + 0.6, 0.011, P(650), 8)
tick_(W(J, 'since', 'back', -0.05), 0.016, P(380)); role('student', W(J, 'since', 'back', 0.15), 0.022, P(420)); role('alumna', W(J, 'since', 'back', 0.15), 0.016, P(420))
ring(W(J, 'since', 'July', -0.1), 0.8, 0.015, P(X6(2025.55)))

# 7. What a role is for: C major. A "relates to" tag over each open role as it's named, set down on its note; the line of years drawing in;
#    Ana in white paper, on the person's notes, from her side; her coral band, on the researcher's note; her card; the dotted line from
#    her to Linh, and its tag; the dates; the dashed line to the project's end, and the pencil round December; both people, on the
#    person's notes, from either side
J = 'relates'; tMa, tUnit, tProj = W(J, 'items', "master's"), W(J, 'items', 'one unit'), W(J, 'items', 'one project')
tRl, tAna, tSup, tEnds, tBoth = W(J, 'people', 'relate'), W(J, 'people', 'Ana'), W(J, 'people', 'supervises'), W(J, 'ends', 'ends with'), W(J, 'ends', 'Both')
chords([(S0(J), CMAJ9), (C(J, 'items', -0.3), AM7), (W(J, 'items', 'Each tutor', -0.3), FMAJ9), (W(J, 'items', 'Her researcher', -0.3), G6), (C(J, 'people', -0.3), FMAJ9),
        (W(J, 'people', 'Ana Ruiz', -0.3), DM9C), (C(J, 'ends', -0.3), EM7), (W(J, 'ends', 'Both', -0.3), CMAJ9)])
knock(tMa - 0.1, 0.018, P(1105)); role('student', tMa, 0.024, P(1105))
knock(tUnit - 0.2, 0.018, P(1509)); role('tutor', tUnit - 0.1, 0.024, P(1509))
knock(tProj - 0.2, 0.018, P(1602)); role('researcher', tProj - 0.1, 0.024, P(1602))
person(tRl, 0.016, P(1716), 3.0)
role('researcher', tAna, 0.022, P(1716)); paper(tAna - 0.1, 0.026, P(1705))
dotted(tSup - 0.2, 1.1, 0.012, P(1640), P(280))
knock(tSup + 0.4, 0.018, P(960)); knock(W(J, 'ends', 'own dates', -0.1), 0.014, P(960))
stroke(tEnds - 0.1, 0.7, 0.011, P(1110))
ring(tEnds + 0.4, 0.7, 0.015, P(1300))
person(tBoth - 0.1, 0.02, P(200), 3.6); person(tBoth + 0.25, 0.016, P(1716), 3.2)

# 8. Elsewhere: B flat major, darkening, then home again. The company's sheet; his period painted to June, its end, and its tag; his
#    steps away down the street; the person who stays, on the person's notes, and her period; her heart, and its first beats; its tag
#    and the arrow; the heart carried to his band, its dotted line, and the red ring at 14 June; the note; then carried down to hers,
#    its line running on, the note, and the person's notes again
J = 'elsewhere'; tCo, tAH, tOut, tJun, tEnd = W(J, 'energy', 'company'), W(J, 'moves', 'account holder'), W(J, 'moves', 'moves out'), W(J, 'moves', 'June'), W(J, 'moves', 'role ends')
tSt, tLS, tGo = W(J, 'need', 'person who stays'), W(J, 'need', 'life support'), W(J, 'need', 'goes on')
tHis, tClose, tHer, tStays = W(J, 'kept', 'his account'), W(J, 'kept', 'close'), W(J, 'kept', 'Kept on her'), W(J, 'kept', 'it stays')
chords([(S0(J), BBMAJ9), (C(J, 'moves', -0.3), GM11B), (C(J, 'need', -0.3), EBMAJ9B), (C(J, 'kept', -0.3), CM9B), (W(J, 'kept', 'Kept on her', -0.3), BBADD9)])
XE = lambda d: 460 + (d - 2026) * 720; xJ = XE(2026.45)
paper(tCo - 0.3, 0.03, P(661), 0.6)
brush(tAH - 0.2, 0.016, P(XE(2026.2)), tJun - tAH + 0.2); stroke(W(J, 'moves', 'role ends', -0.15), 0.3, 0.012, P(xJ)); knock(tJun, 0.016, P(xJ + 86))
for k in range(1, 7):
    step(tOut + k * 0.467, 0.018 * (1 - 0.11 * k), P(1664 + 420 * (k / 6)))
person(tSt, 0.02, P(1357), 3.4); brush(tSt, 0.016, P(XE(2026.5)), 1.3)
heart(tLS - 0.05, 0.03, P(1357))
S8 = S0(J); _bt = [S8 + (np.pi / 2 + 2 * np.pi * k) / 5.4 - 0.08 for k in range(40)]; _bt = [b for b in _bt if b > tGo - 0.1][:3]
for k, b in enumerate(_bt):
    heart(b, 0.032 * (1 - 0.25 * k), P(1357))
knock(tLS + 0.3, 0.016, P(1128)); quill(tLS + 0.45, 0.4, 0.012, P(1270))
fly(tHis - 0.6, 0.9, 0.014, P(1357), P(XE(2026.09))); dotted(tHis - 0.3, 0.8, 0.012, P(XE(2026.1)), P(xJ))
ring(tClose - 0.1, 0.7, 0.017, P(xJ)); quill(tClose + 0.2, 1.1, 0.013, P(600))
air(tHer - 0.15, 0.9, 0.014, P(XE(2026.09))); dotted(tHer + 0.5, 1.2, 0.012, P(XE(2026.1)), P(1180))
quill(tStays - 0.1, 0.9, 0.013, P(560)); person(tStays + 0.3, 0.02, P(1357), 3.4)

# 9. One table, any date: F major, then waiting on A. The table set down, and its rows; each column lit as it's named, the two dates
#    together; the tests' card, and a tick for each; the question's card, and a pin for each date; the recorded_at column typed in; the
#    late contract's row lit, on the tutor's note; a pencil round the day it began
J = 'table'; tPf, tRow, tTwo, tQ = W(J, 'row', 'platform'), W(J, 'row', 'a row'), W(J, 'tests', 'two tests'), W(J, 'asat', 'question')
tCol = [W(J, 'cols', 'the person'), W(J, 'cols', 'role type'), W(J, 'cols', 'its owner'), W(J, 'cols', 'relates'), W(J, 'cols', 'valid from'), W(J, 'cols', 'and to')]
tP = [W(J, 'asat', 'census date'), W(J, 'asat', 'last year'), W(J, 'asat', 'today')]
chords([(S0(J), FMAJ7B), (C(J, 'cols', -0.3), DM9D), (C(J, 'tests', -0.3), BBMAJ9), (C(J, 'asat', -0.3), C69), (C(J, 'late', -0.3), AM7), (C(J, 'breath', -0.6), A7SUS4)])
TCX = [436, 626, 816, 1058, 1268, 1472]
paper(tPf - 0.2, 0.034, P(1140), 0.6)
for i in range(8):
    tap(tRow - 0.2 + i * 0.2, 0.012, P(1140))
for k in range(6):
    knock(tCol[k] - 0.05, 0.013, P(TCX[k]), 250 + 10 * k)
paper(tTwo - 0.1, 0.026, P(749)); tick_(W(J, 'tests', 'end before', 0.18), 0.015, P(454)); tick_(W(J, 'tests', 'belongs', 0.18), 0.015, P(454))
paper(tQ - 0.2, 0.026, P(1531))
for k, (t0, x) in enumerate(zip(tP, [1286, 1500, 1690])):
    pin(t0 - 0.1, 0.017, P(x))
typing(W(J, 'late', 'recorded', -0.2), 0.6, 0.011, P(1700), 4)
brush(W(J, 'late', 'a contract', -0.1), 0.012, P(1140), 0.5); role('tutor', W(J, 'late', 'a contract'), 0.022, P(1140))
ring(W(J, 'late', 'the day it began', -0.1), 0.8, 0.015, P(1350))

# 10. The person stays: D major. The line at today, and its tag; a dot and a note on each of the four roles open on it; the pencil round
#     December; the student period running on, and the pencil round an end ahead; the line of years widening to all of her roles; the
#     person's notes, held, on "the person stays"; the series' mark on the end card, on D
J = 'stays'; B = C(J, 'breath'); tTo, tDec, tGrad, tCome = C(J, 'today'), W(J, 'next', 'December'), W(J, 'next', 'graduate'), C(J, 'come')
tD = [W(J, 'today', 'a student'), W(J, 'today', 'a tutor'), W(J, 'today', 'a researcher'), W(J, 'today', 'an alumna')]
chords([(S0(J), DMAJ9), (C(J, 'next', -0.3), BM9), (W(J, 'next', 'graduate', -0.3), GMAJ9), (C(J, 'come', -0.3), EM9), (C(J, 'last', -0.3), A6SUS2),
        (W(J, 'last', 'The person', -0.3), DMAJ7), (B + 0.2, DMAJ9END)])
X10 = lambda d: 760 + (d - 2025.4) / 2.6 * 1120; xN = X10(2026.3)
stroke(tTo - 0.2, 0.9, 0.013, P(xN)); knock(tTo + 0.35, 0.016, P(xN))
for i, r in enumerate(['student', 'tutor', 'researcher', 'alumna']):
    role(r, tD[i] - 0.05, 0.026, P(xN))
ring(tDec - 0.1, 0.7, 0.015, P(X10(2026.97)))
brush(tGrad - 0.1, 0.014, P(X10(2027.4)), 0.8); ring(tGrad + 0.2, 0.7, 0.015, P(X10(2027.75)))
air(tCome - 0.4, 1.8, 0.016, 0.0)
person(W(J, 'last', 'The person', -0.1), 0.026, P(200), 4.4)
mark(B + 1.0, 62)

# the whole film's chords, sung through
choir(CH, TOT + 1.0)
