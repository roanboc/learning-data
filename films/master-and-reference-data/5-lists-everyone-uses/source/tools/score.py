# Lists everyone uses: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette is this film's own (PLAYBOOK.md: vary the sound itself, film to film), and it keeps what the series carries from film to
# film: chords that bloom note by note, the clarinet's mark (1-8-5-1), a plucked note for each role and a bowed D and A for the person.
#  - The chords are a small string section, muted, bowing slowly: each chord blooms note by note, each note a little after the one below it.
#  - A nylon-string guitar plucks the roles, each on the note it has had since One person, many roles: student D, applicant E,
#    researcher G, tutor A, alumna the D above. A value of a list, lit in the yellow of reference data, is plucked on B, the one note
#    the roles leave out.
#  - The cello, bowed, is the person: whenever Linh stands in white paper, it plays the same D and the A above it.
#  - The clarinet carries the series' mark, under the title and on the end card, the same in every film.
# The film moves from B minor, at the airport, to D major, once every list has its home and its owner. The effects are the lists' own:
# paper tags on their strings, index cards and sheets set down, a felt-tip pen that rings, strikes and ticks, muffled keys as code is
# typed, a pin pressed in, a breath of air for a line drawn, and at the airport a plane's engines, far off.
# The series' sound rule (20 October 2026, after the author's review of Who is it?) sets when it plays:
#  - Music plays under the opening, the airport's story, and its title. After that it comes in from time to time: a chord at a
#    chapter's turn, in the pause before its first words, that fades as they begin; a role's notes, or the person's, at their moment
#    on screen; a chord in the pause after chapter 6, a plucked chord on the first of January, and the mark on the end card. There is
#    no bed under the voice, and where a wrong list happens to a real person, in chapter 10, there is no music at all.
#  - Nothing trembles or pulses: no vibrato, no two players a little out of tune on one note, and no pulse. Every note is tuned pure
#    over D (just intonation), so even the notes of one chord don't beat against each other on a phone's speaker.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the
#    picture in src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: paper, a felt tip, muffled keys, low notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import itertools, json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan

# ---- the tuning: every note pure over D, the film's home ----
# In equal temperament a held major third beats four to eight times a second, a tremble that a phone's speaker brings out. So each
# pitch takes a just ratio over D instead. E, B and C natural can take either of two (E is 9/8 over D a fifth above A, but 10/9 a
# fifth under B), and each chord takes, of its notes' ratios, the set whose partials beat least
RATIO = {0: (1,), 2: (9 / 8, 10 / 9), 4: (5 / 4,), 5: (4 / 3,), 7: (3 / 2,), 9: (5 / 3, 27 / 16), 10: (16 / 9, 9 / 5), 11: (15 / 8,)}
PART = (1, 2, 3, 4, 5, 6, 8)  # the strings' partials: no seventh, which falls between a minor seventh's two tunings and beats with both
def hz(m, r=None):
    """a note's frequency, tuned over D: r is the ratio its pitch takes, by default the first (and equal temperament for a pitch the
    film doesn't play)"""
    pc = (m - 62) % 12
    return mf(62) * (r or RATIO.get(pc, (2 ** (pc / 12),))[0]) * 2 ** ((m - 62) // 12)
def beats(fs):
    """how much a chord's partials beat against each other: each pair a few hertz apart counts, most at six beats a second, by the
    softer of the two"""
    ps = [(j * f, j ** -1.4) for f in fs for j in PART if j * f < 1300]; d = 0.0
    for i, (f1, a1) in enumerate(ps):
        for f2, a2 in ps[i + 1:]:
            df = abs(f2 - f1)
            if 0 < df < 40:
                d += min(a1, a2) * df / 6 * np.exp(1 - df / 6)
    return d
def tune(ch):
    """a chord's frequencies: of the ratios its notes can take, the set that beats least"""
    rs = min(itertools.product(*[RATIO.get((m - 62) % 12, (None,)) for m in ch]), key=lambda rs: beats([hz(m, r) for m, r in zip(ch, rs)]))
    return [hz(m, r) for m, r in zip(ch, rs)]

# ---- the film's instruments, all low-passed ----
# the levels, set against One person, many roles (PLAYBOOK.md: check a new palette's levels against a film that sounds right): the
# chords sit about 21 dB under the voice, the notes a little less, and the effects about 12 dB under the music
BED, NOTE, FX = 2.5, 1.5, 2.0
def strings(ch, start, sec, g=0.03, bloom=0.34, a=2.6, r=3.2):
    """a held chord on a small string section, muted, that blooms note by note: each note comes in a little after the one below it,
    its upper partials a little after its lowest, each note in its own place across the stereo field, low to high. One player to
    a note, bowing steadily, with no vibrato; only the partials under about 1.3 kHz"""
    x = tt(sec); n = len(ch); out = np.clip((sec - x) / r, 0, 1) ** 1.5
    for k, f in enumerate(tune(ch)):
        s = sum(np.sin(2 * np.pi * j * f * x + 0.3 * j) / j ** 1.4 * np.clip((x - k * bloom) / (a * (1 + 0.08 * (j - 1))), 0, 1) ** 1.6
                for j in PART if j * f < 1300)
        put(filt((s * out / n).astype(np.float32), 'low', 1300), start, g * BED, (k / (n - 1) - 0.5) * 1.0)
def bed(keys, end, g=0.03):
    """the opening's chords, each from its moment (a little early, so it has bloomed by then) until a little after the next one starts"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        strings(ch, t0 - 1.2, t1 - t0 + 3.6, g)
def turn(sid, ch, g=0.026):
    """a chord at a chapter's turn: it blooms in the pause after the last chapter's last words, and fades as the new one's begin"""
    strings(ch, C(sid, _NARR[sid]['vo'][0]['id'], -2.4), 4.6, g, bloom=0.18, a=1.3, r=2.6)
def guitar(m, start, g=0.03, pan=0.0, sec=2.4, f=None):
    """a nylon-string guitar, plucked with the thumb near the middle of the string: a round note whose upper partials fade first"""
    f = f or hz(m); x = tt(sec); s = np.zeros_like(x)
    for k in range(1, 12):
        fk = f * k * (1 + 0.00012 * k * k) ** 0.5
        if fk > 2000:
            break
        s += abs(np.sin(np.pi * k * 0.23)) / k * np.sin(2 * np.pi * fk * x + 0.2 * k) * np.exp(-x * (1.0 + 0.9 * k))
    s = s * np.minimum(1, x / 0.003) + 0.03 * filt(noise(sec), 'band', (f, f * 3)) * np.exp(-x * 70)
    put(norm(filt(s.astype(np.float32), 'low', 1800)), start, g * NOTE, pan)
# each role's note, the same in every chapter and every film; and the note for a value of a list, in reference data's yellow
ROLE = {'student': 50, 'applicant': 52, 'researcher': 55, 'tutor': 57, 'alumna': 62}
def role(r, s, g=0.028, pan=0.0):
    guitar(ROLE[r], s, g, pan)
def value(s, g=0.024, pan=0.0):
    guitar(59, s, g, pan)
def roll(ch, s, g=0.022, pan=0.0, step=0.11):
    """a chord rolled on the guitar, low to high, each note left to ring"""
    for k, f in enumerate(tune(ch)):
        guitar(0, s + k * step, g * (1 - 0.1 * k), pan + 0.12 * (k - 1), 2.8, f)
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet, held steady, as clarinettists play: odd harmonics, and a breath as it speaks"""
    f = hz(m); x = tt(sec); ph = 2 * np.pi * f * x
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def cello(m, start, sec, g=0.03, pan=0.0):
    """a cello, bowed without vibrato: slow to speak and slow to leave"""
    f = hz(m); x = tt(sec); ph = 2 * np.pi * f * x
    s = sum(np.sin(k * ph) * (1 / k) * np.exp(-0.22 * k) for k in range(1, 9)) + filt(noise(sec), 'band', (f, f * 5)) * 0.05
    put(norm(filt((s * env(sec, 0.45, min(1.2, sec * 0.45))).astype(np.float32), 'low', 1800)), start, g * NOTE, pan)
def person(s, g=0.026, pan=0.0):
    """the person: the bowed D, and the A above it, the same two notes wherever she stands in white paper"""
    cello(50, s, 3.2, g, pan); cello(57, s + 0.55, 2.6, g * 0.55, pan + 0.15)
def mark(start, root=62, g=0.05):
    """the series' mark, 1-8-5-1, on the clarinet, over the root, plucked"""
    for i, iv in enumerate([0, 12, 7, 0]):
        clarinet(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    guitar(root - 12, start, g * 0.6); guitar(root - 12, start + 1.26, g * 0.5)
def paper_(s, sec, lo, hi, g, pan, sharp=2):
    """filtered noise that swells once and fades: the grain of every paper sound below"""
    x = tt(sec); X(filt(noise(sec), 'band', (lo, hi)) * np.sin(np.pi * x / sec) ** sharp, s, g, pan)
def tag(s, g=0.02, pan=0.0):
    """a paper tag swinging in on its string: three flutters of card, each softer, and the string's soft tick as it settles"""
    for k in range(3):
        paper_(s + k * 0.12, 0.1, 350, 1700, g * (1 - 0.28 * k), pan + 0.04 * k)
    s_knock(s + 0.42, g * 0.45, pan, 330)
def card(s, g=0.02, pan=0.0):
    """an index card set down: a short slide of paper, and a soft tap as it lands"""
    paper_(s, 0.16, 300, 1500, g * 0.7, pan); s_knock(s + 0.14, g * 0.5, pan, 210)
def sheet(s, g=0.024, pan=0.0, sec=0.5):
    """a larger sheet or a file set down: a longer breath of paper, and a low, soft landing"""
    paper_(s, sec, 220, 1500, g, pan); s_knock(s + sec * 0.7, g * 0.32, pan, 170)
def pen(s, sec=0.6, g=0.013, pan=0.0):
    """a felt-tip pen drawing a line or a ring: a smooth, soft scratch, rounder than a pencil's"""
    x = tt(sec); fl = 0.8 + 0.2 * np.sin(2 * np.pi * 9 * x)
    X(filt(noise(sec), 'band', (420, 1500)) * np.sin(np.pi * x / sec) ** 0.8 * fl, s, g, pan)
def ring(s, sec=0.7, g=0.013, pan=0.0):
    """the pen drawn round something: the scratch swells once round, and lifts"""
    x = tt(sec); X(filt(noise(sec), 'band', (420, 1400)) * np.sin(np.pi * x / sec) * (0.75 + 0.25 * np.sin(4 * np.pi * x / sec)), s, g, pan)
def strike(s, sec=0.5, g=0.016, pan=0.0):
    """the pen struck through something: one firm stroke"""
    x = tt(sec); X(filt(noise(sec), 'band', (380, 1500)) * np.minimum(1, x / 0.03) * np.exp(-x * 2.5 / sec), s, g, pan)
def tick(s, g=0.015, pan=0.0):
    """a tick in felt tip: a short stroke down and a longer one up"""
    pen(s, 0.09, g, pan); pen(s + 0.1, 0.18, g * 0.85, pan)
def write(s, sec, g=0.011, pan=0.0):
    """handwriting in felt tip: the scratch comes and goes with the letters"""
    x = tt(sec); fl = 0.45 + 0.55 * np.abs(np.sin(2 * np.pi * 5.5 * x + 2.5 * np.sin(2 * np.pi * 1.1 * x)))
    X(filt(noise(sec), 'band', (450, 1500)) * fl * np.sin(np.pi * x / sec) ** 0.5, s, g, pan)
def keys(s, sec, g=0.012, pan=0.0, n=5):
    """a few muffled keys, while code is typed"""
    for k in range(n):
        s_tap(s + k * sec / n, g * (0.8 + 0.2 * (k % 2)), pan)
def air(s, sec=0.6, g=0.016, pan=0.0):
    """a breath of air: a line drawn from one thing to another, or something sliding into place"""
    s_air(s, sec, g, pan, 180, 900)
def pin(s, g=0.02, pan=0.0):
    """a pin pressed in: a small, soft knock"""
    s_knock(s, g, pan, 380); s_tap(s + 0.02, g * 0.4, pan)
def engines(s, sec, g=0.011, pan=0.6):
    """a plane's engines, far off, behind the glass: a low rumble with a steady hum in it, an octave in tune, that comes up and slowly goes"""
    x = tt(sec); sw = np.clip(x / 1.8, 0, 1) ** 1.5 * np.clip((sec - x) / (sec * 0.6), 0, 1) ** 1.2
    hum = np.sin(2 * np.pi * 92 * x) + 0.4 * np.sin(2 * np.pi * 184 * x)
    X(((filt(noise(sec), 'band', (55, 420)) * 1.4 + 0.25 * hum) * sw).astype(np.float32), s, g, pan)

# chords (MIDI note numbers), low to high; tune() gives each its pure tuning
BM9 = [35, 42, 50, 54, 57, 61]; BM7 = [35, 42, 50, 54, 57]; GMAJ7 = [43, 50, 54, 59, 62]; GMAJ9 = [43, 50, 54, 57, 59, 62]
EM9 = [40, 47, 55, 59, 62, 66]; EM7 = [40, 47, 55, 59, 62]; FS7SUS4 = [42, 49, 54, 59, 64]; DMAJ9 = [38, 45, 54, 57, 61, 64]
DADD9 = [38, 45, 54, 57, 64]; D = [50, 57, 66]


# 1. A code outlives its reason: B minor, the one stretch with music under the voice, the airport's story. The plane's engines, far
#    off, as it taxis; the two tags swinging in; Malton's card and the note written on it, and the pen round YYZ; the card for Saigon,
#    struck through, and the city's new name written under it; the pen round SGN; everyone who reads the codes, a card each; the
#    series' mark under the title, and the chord fading as the next chapter begins
J = 'codes'; B = C(J, 'breath'); tMal, tTook, tNine, tSays, tCost = W(J, 'yyz', 'station code'), W(J, 'sgn', 'took'), W(J, 'sgn', 'nineteen'), W(J, 'sgn', 'still says'), W(J, 'outlives', 'costs')
bed([(S0(J), BM9), (C(J, 'yyz', -0.3), GMAJ7), (C(J, 'sgn', -0.3), EM9), (C(J, 'outlives', -0.3), FS7SUS4), (B + 0.3, BM7)], S0('names') + 0.4)
engines(0.3, 9.5, 0.011, P(1700))
tag(C(J, 'three', 0.3), 0.022, P(670)); tag(C(J, 'three', 0.8), 0.02, P(1350))
card(tMal - 0.4, 0.02, P(360)); write(tMal - 0.2, 0.7, 0.011, P(330)); ring(tMal + 0.3, 0.7, 0.013, P(1000))
card(tTook - 0.3, 0.02, P(1580)); strike(tNine, 0.5, 0.015, P(1500)); write(tNine + 0.5, 1.0, 0.011, P(1560))
ring(tSays, 0.7, 0.013, P(1090))
for i, x in enumerate([250, 600, 960, 1320, 1670]):
    card(tCost - 0.2 + i * 0.22, 0.013, P(x))
mark(B + 0.8)

# 2. One role, three names: no chord of its own, as the opening's fades under its first words. Her card, on the student's note, and
#    the tutor's as it's added; her tutor role in three records, the tutor's note each time its line reaches one, the same note for
#    the same role; the pen round the names; the empty card, and its cross; HR's spreadsheet, and the pen round it; her identifiers
J = 'names'; tLn, tTu, tNo, tSay, tSp, tId = C(J, 'linh'), W(J, 'linh', 'tutors'), W(J, 'match', 'nothing'), W(J, 'match', 'says'), W(J, 'sheet', 'spreadsheet'), W(J, 'kinds', 'identifier')
tN = [W(J, 'three', 'HR calls'), W(J, 'three', 'Payroll'), W(J, 'three', 'learning platform')]
card(C(J, 'like', 0.2), 0.012, P(290))
card(tLn, 0.02, P(280)); role('student', tLn + 0.1, 0.026, P(280)); role('tutor', tTu, 0.028, P(380))
for i in range(3):
    role('tutor', tN[i] + 0.25, 0.024, P(860))
ring(C(J, 'match'), 0.7, 0.012, P(1080))
card(tNo + 0.5, 0.016, P(1540)); pen(tSay, 0.22, 0.014, P(1540)); pen(tSay + 0.25, 0.22, 0.014, P(1540))
sheet(C(J, 'sheet', -0.2), 0.024, P(1000)); ring(tSp, 0.8, 0.013, P(1000))
card(tId - 0.4, 0.014, P(780))

# 3. Typed again: an E minor chord at the turn. Her status, on the student's note; the file that maps them; the two tests, set down
#    and typed; the pen round the same statuses typed again; her country in three records, each on its role's note; the count; the
#    bracket round her three countries, and the tag that says they're one
J = 'typed'; tMp, tA, tHand, tC, tCnt, tTh = C(J, 'map'), C(J, 'again'), W(J, 'again', 'by hand'), C(J, 'country'), W(J, 'count', 'a count'), W(J, 'count', 'three times')
tCn = [W(J, 'country', 'Vietnam'), W(J, 'country', 'Viet Nam'), W(J, 'country', 'VN at')]
turn(J, EM9)
role('student', C(J, 'status', 0.0), 0.024, P(750))
sheet(tMp - 0.3, 0.024, P(930))
sheet(tA - 0.1, 0.022, P(1500)); keys(tA + 0.2, 1.2, 0.011, P(1500), 4)
ring(tHand + 0.1, 0.8, 0.012, P(1300))
for r, t0 in zip(['tutor', 'student', 'researcher'], [tC - 0.2, tCn[1] - 0.5, tCn[2] - 0.5]):
    role(r, t0 + 0.1, 0.024, P(860))
sheet(tCnt - 0.3, 0.024, P(1550))
pen(tTh, 0.7, 0.013, P(1300)); card(tTh + 0.4, 0.014, P(1350))

# 4. The lists that sort: a D major chord at the turn. Linh in white paper, on the person's notes; the three lists set down; her
#    status lit on the student's note, her role on the tutor's, her country on the note for a list's value; the brackets in felt tip
#    for the university's own and from outside; the airport's tag; then the pen round the code and round the label
J = 'kinds'; tT, tSo, tRt, tOut, tAir, tSys, tLab = C(J, 'these'), W(J, 'these', 'sort'), W(J, 'own', 'role types'), W(J, 'own', 'from outside'), W(J, 'own', 'airport'), W(J, 'code', 'systems store'), W(J, 'code', 'a label')
turn(J, DMAJ9)
person(tT + 0.2, 0.024, P(230)); card(tT + 0.3, 0.016, P(970))
role('student', tSo, 0.026, P(620)); role('tutor', tSo + 0.25, 0.026, P(970)); value(tSo + 0.5, 0.022, P(1330))
pen(tRt - 0.4, 0.6, 0.01, P(800)); pen(tOut - 0.3, 0.6, 0.01, P(1500))
tag(tAir - 0.2, 0.013, P(1700))
ring(tSys - 0.4, 0.6, 0.013, P(1040)); ring(tLab, 0.6, 0.013, P(1200))

# 5. A home for each list: a G major chord at the turn. Jun's name card; the lists given their home; role types as a table; the owners
#    lit on their roles' notes, HR's on the tutor's and the registrar's on the student's; the names by system, and all three lit as
#    one, on the tutor's note
J = 'home'; tHome, tTb, tHR, tReg, tMp, tAll = W(J, 'jun', 'one home'), C(J, 'table'), W(J, 'owners', 'HR owns'), W(J, 'owners', 'registrar'), C(J, 'map'), W(J, 'map', 'all mean')
turn(J, GMAJ7)
card(C(J, 'jun'), 0.018, P(200)); card(tHome - 0.1, 0.014, P(750))
sheet(tTb - 0.2, 0.024, P(1190))
role('tutor', tHR, 0.028, P(1300)); role('student', tReg, 0.028, P(1300))
sheet(tMp - 0.2, 0.022, P(1190)); role('tutor', tAll, 0.024, P(1500))

# 6. Read, not typed: a D major chord at the turn. The two tests set down; what they typed, struck through in felt tip, and the line
#    that reads the list typed in its place; each test pinned to the list; the new status, on the student's note; a tick on each test
#    as it follows; the platform, and the list as one table. Then, in the pause after the chapter, the list with everything that
#    reads it, and a D major chord that blooms there and fades as the next chapter begins
J = 'read'; B = C(J, 'breath'); tT, tRd, tFr, tCh, tFo, tL = C(J, 'tests'), W(J, 'tests', 'read their'), W(J, 'tests', 'from the list'), W(J, 'once', 'Change'), W(J, 'once', 'follows'), C(J, 'lineage')
tOne = W(J, 'lineage', 'one table')
turn(J, DMAJ9)
sheet(tT - 0.3, 0.022, P(360))
for d, x in ((0, 360), (0.35, 1560)):
    strike(tRd + d, 0.8, 0.014, P(x)); pin(tFr + 0.6 + d, 0.018, P(690 if x < 960 else 1230)); tick(tFo + d, 0.014, P(x + 180))
keys(tRd + 1.0, 1.0, 0.01, P(360), 4)
role('student', tCh + 0.6, 0.024, P(960))
sheet(tL - 0.2, 0.02, 0.0); card(tOne - 0.1, 0.014, P(510))
strings(DADD9, B - 1.6, 6.2, 0.026, bloom=0.26, a=1.8, r=3.0)

# 7. A change, with a date: the chord of the pause fades under its first words. The new name, in dashed felt tip; the pull request,
#    typed; HR approves, on the tutor's note, with a tick; the day it changes, its tag, and a D major chord rolled on the guitar; the
#    pen round the old name's end; her past contracts
J = 'change'; tSes, tPr, tApp, tJan, tEnd, tCon = W(J, 'next', 'Sessional'), W(J, 'pr', 'pull request'), W(J, 'pr', 'approves'), W(J, 'from', 'first of January'), W(J, 'ended', 'ended'), W(J, 'ended', 'past contracts')
pen(tSes - 0.2, 0.5, 0.011, P(1360))
sheet(tPr - 0.4, 0.024, P(1060)); keys(tPr, 0.4, 0.011, P(1000), 3)
role('tutor', tApp + 0.1, 0.028, P(1100)); tick(tApp + 0.3, 0.015, P(1200))
card(tJan - 0.3, 0.014, P(1500)); roll(D, tJan, 0.022, P(1300))
ring(tEnd, 0.7, 0.013, P(1000))
card(tCon - 0.2, 0.012, P(760))

# 8. From outside: a B minor chord at the turn. The standard's grid set down; the university's copy, loaded; the glossary's card, and
#    the project's file; the three spellings, each sliding into its one row, which lights on the note for a list's value; the pen
#    round the code
J = 'outside'; tSo, tLd, tCp, tAp, tVN = W(J, 'else', 'someone else'), W(J, 'iso', 'loaded'), W(J, 'glossary', 'copied'), W(J, 'once', 'appears'), W(J, 'once', 'VN.')
turn(J, BM9)
sheet(tSo - 0.1, 0.022, P(1430))
card(tLd + 0.1, 0.016, P(450))
card(C(J, 'glossary', -0.1), 0.016, P(1330)); sheet(tCp + 0.2, 0.02, P(430))
for t0 in (tAp, tAp + 0.3, tVN - 0.6):
    air(t0, 0.7, 0.012, P(760))
value(tAp + 0.5, 0.024, P(450)); ring(tVN + 0.15, 0.6, 0.013, P(215))

# 9. Lists about people: an E minor chord at the turn. Linh's form set down; the pen round the two choices that mean "another term"
#    and "prefer not to say"; why it's asked, on a card; the pen round the titles that tell whether someone is married; the strike
#    through the title, and the gender field sliding up into its place
J = 'people'; tS, tInc, tPur, tMar, tIf, tAsk = C(J, 'some'), W(J, 'short', 'inclusive'), W(J, 'short', 'purpose'), W(J, 'title', 'married'), W(J, 'title', 'If it'), W(J, 'title', "isn't asked")
turn(J, EM7)
sheet(tS - 0.3, 0.022, P(1030))
ring(tInc, 0.6, 0.01, P(1000)); ring(tInc + 0.3, 0.6, 0.01, P(800))
card(tPur - 0.2, 0.014, P(1030))
ring(tMar, 0.5, 0.012, P(930))
strike(tIf + 0.45, 0.6, 0.016, P(1030))
air(tAsk + 0.3, 0.8, 0.013, P(1030))

# 10. Elsewhere: a B minor chord at the turn, the airport's key. The two industries set down; a person in white paper in each, on the
#     person's notes; the value that decides, lit on the note for a list's value; then, with no music, the red rings round the people
#     a wrong list happens to
J = 'elsewhere'; tE, tTy, tCh, tRel, tTold, tPer = C(J, 'every'), W(J, 'bank', 'customer types'), W(J, 'bank', 'checks'), W(J, 'hosp', 'relationship'), W(J, 'hosp', 'may be told'), W(J, 'wrong', 'real person')
turn(J, BM9)
sheet(tE + 0.1, 0.022, P(960))
for t1, t2, x, g in ((tTy, tCh, 100, 0.02), (tRel, tTold, 1000, 0.015)):
    person(t1 - 0.2, g, P(x + 108)); value(t2, 0.022, P(x + 650))
ring(tPer - 0.3, 0.7, 0.012, P(208)); ring(tPer - 0.2, 0.7, 0.012, P(1108))

# 11. Who keeps it: a D major chord at the turn. Linh in white paper, on the person's notes; her role on the tutor's note, her status on
#     the student's, her country on the note for a list's value; their lists; the airport's tag; the owners underlined, then the
#     dates; a G major chord in the pause before the last line; and the end card, in D major, with the series' mark
J = 'keeps'; B = C(J, 'breath'); tR, tSt, tCy, tOne, tA, tKe, tWh = W(J, 'linh', 'role'), W(J, 'linh', 'status'), W(J, 'linh', 'country'), W(J, 'linh', 'one list'), C(J, 'airport'), W(J, 'airport', 'who keeps'), W(J, 'airport', 'from when')
turn(J, DMAJ9)
person(S0(J) + 0.4, 0.024, P(400))
role('tutor', tR, 0.028, P(780)); role('student', tSt, 0.028, P(780)); value(tCy, 0.024, P(780))
card(tOne, 0.013, P(1310)); pen(tKe, 0.6, 0.01, P(1250)); pen(tWh, 0.6, 0.01, P(1250))
tag(tA - 0.2, 0.012, P(1700))
strings(GMAJ9, C(J, 'line', -1.5), 3.6, 0.022, bloom=0.16, a=1.0, r=2.2)
strings(DADD9, B - 1.4, TOT - B + 2.4, 0.03, bloom=0.3, a=2.0, r=3.0)
mark(B + 1.0)

# the effects, brought to their level, and nothing in them above about 2.5 kHz
for b in (XL, XR):
    b[:] = filt(b, 'low', 2400, 4) * FX
