# Lists everyone uses: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette is this film's own (PLAYBOOK.md: vary the sound itself, film to film), and it keeps what the series carries from film to
# film: chords that bloom note by note, the clarinet's mark (1-8-5-1), a plucked note for each role and a bowed D and A for the person.
#  - The bed is a small string section, muted, bowing slowly: each chord blooms note by note, each note a little after the one below it.
#  - A nylon-string guitar plucks the roles, each on the note it has had since One person, many roles: student D, applicant E,
#    researcher G, tutor A, alumna the D above. A value of a list, lit in the yellow of reference data, is plucked on B, the one note
#    the roles leave out.
#  - The cello, bowed, is the person: whenever Linh stands in white paper, it plays the same D and the A above it.
#  - The clarinet carries the series' mark, under the title and on the end card, the same in every film.
# The film moves from B minor, at the airport, to D major, once every list has its home and its owner. The effects are the lists' own:
# paper tags on their strings, index cards and sheets set down, a felt-tip pen that rings, strikes and ticks, muffled keys as code is
# typed, a pin pressed in, a breath of air for each line drawn, and at the airport a plane's engines, far off.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the narration; nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#  - The one exception is feeling: when getting a list wrong makes the wrong thing happen to a real person, a low, muted pulse
#    (music.py's urgent()) rises under the red rings, which pulse with its beat, leaning on the semitone, and fades as the chapter ends.
# And everything stays low and soft: paper, a felt tip, muffled keys, low notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan

# ---- the film's instruments, all low-passed ----
# the levels, set against One person, many roles (PLAYBOOK.md: check a new palette's levels against a film that sounds right): the bed
# sits about 21 dB under the voice while it speaks, the notes over it a little less, and the effects about 12 dB under the music
BED, NOTE, FX = 1.58, 1.5, 2.0
def strings(ch, start, sec, g=0.03, bloom=0.34):
    """a held chord on a small string section, muted, that blooms note by note: each note comes in a little after the one below it
    and swells at its own slow rate, bowed with a slow vibrato; three players to a note, a little apart in tune and across the stereo
    field; only the partials under about 1.3 kHz"""
    x = tt(sec)
    for pan, det, ph0 in ((-0.6, 0.9978, 0.0), (0.6, 1.0022, 1.3), (0.0, 1.0, 2.1)):
        s = np.zeros_like(x)
        for k, m in enumerate(ch):
            f = mf(m) * det; e = np.clip((x - k * bloom) / 2.6, 0, 1) ** 1.6 * np.clip((sec - x) / 3.2, 0, 1)
            vib = 1 + 0.0028 * np.sin(2 * np.pi * (4.6 + 0.3 * k) * x + ph0 + k)
            ph = 2 * np.pi * np.cumsum(f * vib) / SR; bow = 1 + 0.1 * np.sin(2 * np.pi * (0.06 + 0.011 * k) * x + 1.7 * k + ph0)
            s += sum(np.sin(j * ph + 0.3 * j) / j ** 1.4 for j in range(1, 9) if j * f < 1300) * e * bow
        put(filt((s / len(ch)).astype(np.float32), 'low', 1300), start, g * BED * (0.75 if pan == 0 else 1), pan)
def bed(keys, end, g=0.03):
    """the chapter's chords, each from its moment (a little early, so it has bloomed by then) until a little after the next one starts"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        strings(ch, t0 - 1.2, t1 - t0 + 3.6, g)
def guitar(m, start, g=0.03, pan=0.0, sec=2.4):
    """a nylon-string guitar, plucked with the thumb near the middle of the string: a round note whose upper partials fade first"""
    f = mf(m); x = tt(sec); s = np.zeros_like(x)
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
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet: odd harmonics, a breath as it speaks, a slow vibrato that comes in late"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.0 * x) * np.clip((x - 0.35) / 0.5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def cello(m, start, sec, g=0.03, pan=0.0):
    """a cello, bowed: slow to speak and slow to leave"""
    f = mf(m); x = tt(sec); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.4 * x) * np.clip((x - 0.4) / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
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
    """a plane's engines, far off, behind the glass: a low rumble with a slow hum in it, that comes up and slowly goes"""
    x = tt(sec); sw = np.clip(x / 1.8, 0, 1) ** 1.5 * np.clip((sec - x) / (sec * 0.6), 0, 1) ** 1.2
    hum = np.sin(2 * np.pi * 92 * x + 0.6 * np.sin(2 * np.pi * 0.3 * x)) + 0.4 * np.sin(2 * np.pi * 184.5 * x)
    X(((filt(noise(sec), 'band', (55, 420)) * 1.4 + 0.25 * hum) * sw).astype(np.float32), s, g, pan)

# chords (MIDI note numbers), low to high
BM9 = [35, 42, 50, 54, 57, 61]; BM7 = [35, 42, 50, 54, 57]; GMAJ7 = [43, 50, 54, 59, 62]; GMAJ9 = [43, 50, 54, 57, 59, 62]
EM9 = [40, 47, 55, 59, 62, 66]; EM7 = [40, 47, 55, 59, 62]; FS7SUS4 = [42, 49, 54, 59, 64]; FS7 = [42, 49, 52, 58, 61]; FSM7 = [42, 49, 52, 57, 61]
CMAJ7S11 = [36, 43, 52, 54, 59]; CMAJ7 = [36, 43, 52, 55, 59]; DMAJ9 = [38, 45, 54, 57, 61, 64]; D69 = [38, 45, 54, 59, 64]
A6 = [45, 52, 54, 57, 61]; ASUS = [45, 52, 57, 59, 62, 64]


# 1. A code outlives its reason: B minor. The plane's engines, far off, as it taxis; the two tags swinging in; Malton's card and the
#    note written on it, and the pen round YYZ; the card for Saigon, written, struck through, and the city's new name written under it;
#    the pen round SGN, and the line to its old name; everyone who reads the codes, a card each; the series' mark under the title
J = 'codes'; B = C(J, 'breath'); tMal, tTook, tNine, tSays, tCost = W(J, 'yyz', 'station code'), W(J, 'sgn', 'took'), W(J, 'sgn', 'nineteen'), W(J, 'sgn', 'still says'), W(J, 'outlives', 'costs')
bed([(S0(J), BM9), (C(J, 'yyz', -0.3), GMAJ7), (C(J, 'sgn', -0.3), EM9), (C(J, 'outlives', -0.3), FS7SUS4), (B + 0.3, BM7)], E(J) + 1.0)
engines(0.3, 9.5, 0.011, P(1700))
tag(C(J, 'three', 0.3), 0.022, P(670)); tag(C(J, 'three', 0.8), 0.02, P(1350))
card(tMal - 0.4, 0.02, P(360)); write(tMal - 0.2, 0.7, 0.011, P(330)); ring(tMal + 0.3, 0.7, 0.013, P(1000)); write(tMal + 0.4, 0.9, 0.011, P(360))
card(tTook - 0.3, 0.02, P(1580)); write(tTook - 0.2, 0.6, 0.011, P(1480)); strike(tNine, 0.5, 0.015, P(1500)); write(tNine + 0.5, 1.0, 0.011, P(1560))
ring(tSays, 0.7, 0.013, P(1090)); air(tSays + 0.3, 0.7, 0.014, P(1300))
for i, x in enumerate([250, 600, 960, 1320, 1670]):
    card(tCost - 0.2 + i * 0.22, 0.013, P(x))
air(tCost + 0.1, 1.4, 0.012, 0.0)
mark(B + 0.8)

# 2. One role, three names: G major, into the chord that doesn't settle when nothing says the names match. The five lists, a card each;
#    her card, on the student's note, and the tutor's as it's added; her tutor role in three records, the tutor's note each time its
#    line reaches one; the pen round each name; the lines to the empty card, its two lines and its cross; HR's email, and the pen round
#    the spreadsheet; her four identifiers, and no kind for any of them
J = 'names'; tLn, tTu, tNo, tSay, tSp, tId = C(J, 'linh'), W(J, 'linh', 'tutors'), W(J, 'match', 'nothing'), W(J, 'match', 'says'), W(J, 'sheet', 'spreadsheet'), W(J, 'kinds', 'identifier')
tN = [W(J, 'three', 'HR calls'), W(J, 'three', 'Payroll'), W(J, 'three', 'learning platform')]
bed([(S0(J), GMAJ7), (C(J, 'three', -0.3), EM9), (C(J, 'match', -0.2), CMAJ7S11), (C(J, 'sheet', -0.3), FSM7), (C(J, 'kinds', -0.3), EM7)], E(J) + 1.0)
for i in range(5):
    card(C(J, 'like', 0.2 + i * 0.18), 0.012, P(290 + i * 340))
card(tLn, 0.02, P(280)); role('student', tLn + 0.1, 0.026, P(280)); role('tutor', tTu, 0.028, P(380))
for i, y in enumerate([130, 300, 470]):
    card(tN[i] - 0.3, 0.018, P(1020)); role('tutor', tN[i] + 0.25, 0.024 - 0.002 * i, P(860))
    ring(C(J, 'match', i * 0.25), 0.7, 0.012, P(1080))
air(tNo, 1.0, 0.014, P(1250)); card(tNo + 0.5, 0.016, P(1540)); pen(tNo + 0.9, 0.2, 0.012, P(1540)); pen(tNo + 1.1, 0.2, 0.012, P(1540))
pen(tSay, 0.22, 0.014, P(1540)); pen(tSay + 0.25, 0.22, 0.014, P(1540))
sheet(C(J, 'sheet', -0.2), 0.024, P(1000)); ring(tSp, 0.8, 0.013, P(1000))
for i in range(4):
    card(tId - 0.4 + i * 0.18, 0.014, P(780 + i * 305))

# 3. Typed again: E minor, then the unsettled chord again for the count. Her status in two systems, on the student's note; the file
#    that maps them, and its two rows lit, on the student's note; the two tests, set down and typed; the pen round the same statuses in
#    three places; her country in three records, each on its role's note; the count, a row at a time, and the lines to it; the bracket
#    round her three countries, and the tag that says they're one
J = 'typed'; tMp, tA, tHand, tC, tCnt, tTh = C(J, 'map'), C(J, 'again'), W(J, 'again', 'by hand'), C(J, 'country'), W(J, 'count', 'a count'), W(J, 'count', 'three times')
tCn = [W(J, 'country', 'Vietnam'), W(J, 'country', 'Viet Nam'), W(J, 'country', 'VN at')]
bed([(S0(J), EM9), (C(J, 'map', -0.3), GMAJ7), (C(J, 'again', -0.3), FS7SUS4), (C(J, 'country', -0.3), BM7), (C(J, 'count', -0.3), CMAJ7S11)], E(J) + 1.0)
card(C(J, 'status', -0.2), 0.02, P(750)); role('student', C(J, 'status', 0.0), 0.024, P(750))
card(W(J, 'status', 'active', -0.3), 0.018, P(1120))
sheet(tMp - 0.3, 0.024, P(930)); role('student', tMp + 0.4, 0.024, P(800)); role('student', tMp + 0.7, 0.018, P(1000))
sheet(tA - 0.1, 0.022, P(1500)); keys(tA + 0.2, 2.4, 0.011, P(1500), 8)
sheet(tA + 0.7, 0.02, P(1500)); keys(tA + 1.0, 2.4, 0.01, P(1500), 8)
ring(tHand - 0.2, 0.8, 0.012, P(1500)); ring(tHand + 0.1, 0.8, 0.011, P(1500)); ring(tHand + 0.2, 0.8, 0.012, P(1100))
for i, (r, t0) in enumerate(zip(['tutor', 'student', 'researcher'], [tC - 0.2, tCn[1] - 0.5, tCn[2] - 0.5])):
    card(t0, 0.018, P(860)); role(r, t0 + 0.1, 0.024, P(860))
sheet(tCnt - 0.3, 0.024, P(1550))
for i in range(3):
    s_tap(tCnt + 0.1 + i * 0.2, 0.012, P(1500))
air(tCnt + 0.3, 1.1, 0.012, P(1200))
pen(tTh, 0.7, 0.013, P(1300)); card(tTh + 0.4, 0.014, P(1350))

# 4. The lists that sort: D major. Linh in white paper, on the person's notes; the three lists set down; her status lit on the student's
#    note, her role on the tutor's, her country on the note for a list's value, and the lines down to her; the brackets in felt tip for
#    the university's own and from outside; the airport's tag; then, close up, the pen round the code and round the label, a line to
#    each, and what stores the code and who reads the label
J = 'kinds'; tT, tSo, tRt, tOut, tAir, tSys, tLab = C(J, 'these'), W(J, 'these', 'sort'), W(J, 'own', 'role types'), W(J, 'own', 'from outside'), W(J, 'own', 'airport'), W(J, 'code', 'systems store'), W(J, 'code', 'a label')
bed([(S0(J), DMAJ9), (C(J, 'own', -0.3), GMAJ9), (C(J, 'code', -0.3), A6)], E(J) + 1.0)
person(tT + 0.2, 0.024, P(230))
for i, x in enumerate([620, 970, 1330]):
    card(tT + 0.3 + i * 0.2, 0.016, P(x))
role('student', tSo, 0.026, P(620)); role('tutor', tSo + 0.25, 0.026, P(970)); value(tSo + 0.5, 0.022, P(1330))
air(tSo + 0.3, 1.4, 0.013, P(700))
pen(tRt - 0.4, 0.6, 0.012, P(800)); pen(tOut - 0.3, 0.6, 0.012, P(1500))
tag(tAir - 0.2, 0.013, P(1700))
ring(tSys - 0.4, 0.6, 0.013, P(1040)); air(tSys - 0.2, 0.5, 0.012, P(1040)); card(tSys, 0.014, P(1040))
ring(tLab, 0.6, 0.013, P(1200)); air(tLab - 0.2, 0.5, 0.012, P(1240)); card(tLab + 0.2, 0.014, P(1270))

# 5. A home for each list: G major, rising to A, ready for D. Jun's name card; each list given its home, a card each; role types as a
#    table, its columns drawn in; the owners lit on their roles' notes, the registrar's on the student's and HR's on the tutor's; the
#    names by system, a row at a time, and all three lit on the tutor's note
J = 'home'; tHome, tTb, tHR, tReg, tMp, tAll = W(J, 'jun', 'one home'), C(J, 'table'), W(J, 'owners', 'HR owns'), W(J, 'owners', 'registrar'), C(J, 'map'), W(J, 'map', 'all mean')
tFi = [W(J, 'five', s) for s in ('Role types', 'identifier types', 'relationship types', 'consent purposes', 'countries')]
tMn = [W(J, 'map', s) for s in ('Casual Academic', 'CAS', 'and tutor')]
bed([(S0(J), GMAJ7), (C(J, 'five', -0.3), D69), (C(J, 'table', -0.3), EM9), (C(J, 'owners', -0.3), GMAJ9), (C(J, 'map', -0.3), ASUS)], E(J) + 1.0)
card(C(J, 'jun'), 0.018, P(200))
for i, t0 in enumerate([tHome - 0.1] + [k - 0.25 for k in tFi]):
    card(t0, 0.014, P(750))
sheet(tTb - 0.2, 0.024, P(1190)); air(tTb - 0.2, 0.5, 0.012, P(900))
for k, word in enumerate(['code', 'label', 'who owns', 'the date']):
    pen(W(J, 'table', word, -0.3), 0.3, 0.01, P(700 + 300 * k))
role('tutor', tHR, 0.028, P(1300)); role('student', tReg, 0.028, P(1300))
sheet(tMp - 0.2, 0.022, P(1190))
for i in range(3):
    s_tap(tMn[i] - 0.3, 0.012, P(1100)); role('tutor', tAll + i * 0.15, 0.024 - 0.004 * i, P(1500))

# 6. Read, not typed: D major. The list, and the two tests set down; what they typed, struck through in felt tip, and the line that
#    reads the list typed in its place; a line from each test to the list, pinned; the new status, on the student's note; a tick on each
#    test as it follows; the platform, the list as one table and its lineage, a line and a card at a time
J = 'read'; tT, tRd, tFr, tCh, tFo, tL = C(J, 'tests'), W(J, 'tests', 'read their'), W(J, 'tests', 'from the list'), W(J, 'once', 'Change'), W(J, 'once', 'follows'), C(J, 'lineage')
tOne, tLin, tTab, tRep = W(J, 'lineage', 'one table'), W(J, 'lineage', 'its lineage'), W(J, 'lineage', 'the tables'), W(J, 'lineage', 'reports')
bed([(S0(J), DMAJ9), (C(J, 'once', -0.3), BM7), (C(J, 'lineage', -0.3), GMAJ7), (C(J, 'breath'), D69)], E(J) + 1.0)
card(tT - 0.6, 0.018, P(960)); sheet(tT - 0.3, 0.022, P(360)); sheet(tT + 0.05, 0.02, P(1560))
for d, x in ((0, 360), (0.35, 1560)):
    strike(tRd + d, 0.8, 0.014, P(x)); keys(tRd + 1.0 + d, 1.4, 0.01, P(x), 6)
    air(tFr + d, 0.7, 0.013, P(660 if x < 960 else 1260)); pin(tFr + 0.6 + d, 0.018, P(690 if x < 960 else 1230))
    tick(tFo + d, 0.014, P(x + 180))
card(tCh, 0.014, P(960)); role('student', tCh + 0.6, 0.024, P(960))
sheet(tL - 0.2, 0.02, 0.0); air(tOne, 0.6, 0.012, P(600)); card(tOne - 0.1, 0.014, P(510))
air(tLin, 0.4, 0.011, P(720)); card(tTab - 0.2, 0.014, P(920))
card(tRep - 0.3, 0.014, P(1370)); card(tRep, 0.012, P(1370))

# 7. A change, with a date: A, then D on the first of January. Her tutor role across the years, on the tutor's note; the new name, in
#    dashed felt tip; the pull request, its two lines typed; HR's review, and the tick as HR approves, on the tutor's note; the day it
#    changes, a dashed line and its tag; the pen round the old name's end; her past contracts, a sheet each
J = 'change'; tN, tSes, tPr, tOwn, tApp, tJan, tEnd, tCon = C(J, 'next'), W(J, 'next', 'Sessional'), W(J, 'pr', 'pull request'), W(J, 'pr', 'who owns'), W(J, 'pr', 'approves'), W(J, 'from', 'first of January'), W(J, 'ended', 'ended'), W(J, 'ended', 'past contracts')
bed([(S0(J), A6), (C(J, 'pr', -0.3), FSM7), (C(J, 'from', -0.3), DMAJ9), (C(J, 'ended', -0.3), BM7)], E(J) + 1.0)
sheet(tN - 0.4, 0.02, P(1100), 0.6); role('tutor', tN - 0.2, 0.024, P(860))
pen(tSes - 0.2, 0.5, 0.011, P(1360))
sheet(tPr - 0.4, 0.024, P(1060)); keys(tPr, 0.4, 0.011, P(1000), 3); keys(tPr + 0.4, 0.4, 0.01, P(1000), 3)
card(tOwn - 0.3, 0.014, P(900)); role('tutor', tApp + 0.1, 0.028, P(1100)); tick(tApp + 0.3, 0.015, P(1200))
air(tJan - 0.4, 0.5, 0.012, P(1460)); card(tJan - 0.3, 0.014, P(1500))
ring(tEnd, 0.7, 0.013, P(1000))
for i, yr in enumerate([2023, 2024, 2025, 2026]):
    card(tCon - 0.2 + i * 0.2, 0.012, P(760 + 200 * i))

# 8. From outside: B minor, then D as her country appears once. The standard's grid set down; the line from it, every month, and the
#    university's copy; the glossary's card, the line marked copied, and the project's file; the three spellings beside the list, and
#    each sliding into its one row, which lights on the note for a list's value; the pen round the code; the count, with one bar
J = 'outside'; tSo, tLd, tCp, tO, tAp, tVN, tCnt = W(J, 'else', 'someone else'), W(J, 'iso', 'loaded'), W(J, 'glossary', 'copied'), C(J, 'once'), W(J, 'once', 'appears'), W(J, 'once', 'VN.'), W(J, 'count', 'the count')
bed([(S0(J), BM9), (C(J, 'iso', -0.3), GMAJ7), (C(J, 'glossary', -0.3), EM9), (C(J, 'once', -0.3), ASUS), (C(J, 'count', -0.3), DMAJ9)], E(J) + 1.0)
sheet(tSo - 0.1, 0.022, P(1430))
air(tLd, 0.7, 0.013, P(885)); card(tLd + 0.1, 0.016, P(450)); card(tLd + 0.3, 0.012, P(885))
card(C(J, 'glossary', -0.1), 0.016, P(1330)); air(tCp - 0.3, 0.6, 0.012, P(890)); card(tCp, 0.012, P(910)); sheet(tCp + 0.2, 0.02, P(430))
for i in range(3):
    s_tap(tO - 0.2 + i * 0.15, 0.01, P(880))
for t0 in (tAp, tAp + 0.3, tVN - 0.6):
    air(t0, 0.7, 0.012, P(760))
value(tAp + 0.5, 0.024, P(450)); ring(tVN + 0.15, 0.6, 0.013, P(215))
sheet(tCnt - 0.3, 0.022, P(470))

# 9. Lists about people: E minor, to G once the title isn't asked. Linh's form set down, its choices appearing; the pen round the two
#    choices that mean "another term" and "prefer not to say"; why it's asked, on a card; the pen round the titles that tell whether
#    someone is married; the strike through the title, and the field going, the gender field sliding up into its place
J = 'people'; tS, tTi, tGe, tInc, tPur, tMar, tIf, tAsk = C(J, 'some'), W(J, 'some', 'titles'), W(J, 'some', 'gender'), W(J, 'short', 'inclusive'), W(J, 'short', 'purpose'), W(J, 'title', 'married'), W(J, 'title', 'If it'), W(J, 'title', "isn't asked")
bed([(S0(J), EM7), (C(J, 'short', -0.3), GMAJ9), (C(J, 'title', -0.3), CMAJ7), (tAsk, GMAJ7)], E(J) + 1.0)
sheet(tS - 0.3, 0.022, P(1030))
for i in range(5):
    s_tap(tTi + i * 0.1, 0.008, P(700 + i * 110))
for i in range(5):
    s_tap(tGe + i * 0.1, 0.008, P(700 + (i % 3) * 150))
ring(tInc, 0.6, 0.012, P(1000)); ring(tInc + 0.3, 0.6, 0.012, P(800))
card(tPur - 0.2, 0.014, P(1030))
ring(tMar - 0.2, 0.5, 0.012, P(820)); ring(tMar, 0.5, 0.012, P(930)); write(tMar - 0.1, 0.5, 0.009, P(820))
strike(tIf + 0.45, 0.6, 0.016, P(1030))
air(tAsk, 0.5, 0.011, P(1030)); air(tAsk + 0.3, 0.8, 0.013, P(1030))

# 10. Elsewhere: B minor, to F sharp, the chord that pulls hardest, for getting a list wrong. The two industries set down; a person in
#     white paper in each, on the person's notes; each industry's list, a row at a time, and the value that decides, lit on the note
#     for a list's value; then the wrong values, and the pulse under the red rings round the people they happen to
J = 'elsewhere'; tE, tTy, tCh, tRel, tTold, tW, tPer = C(J, 'every'), W(J, 'bank', 'customer types'), W(J, 'bank', 'checks'), W(J, 'hosp', 'relationship'), W(J, 'hosp', 'may be told'), C(J, 'wrong'), W(J, 'wrong', 'real person')
bed([(S0(J), BM9), (C(J, 'bank', -0.3), GMAJ7), (C(J, 'hosp', -0.3), EM9), (C(J, 'wrong', -0.3), FS7)], E(J) + 1.0)
sheet(tE + 0.1, 0.022, P(500)); sheet(tE + 0.35, 0.02, P(1400))
for t1, t2, x, g in ((tTy, tCh, 100, 0.022), (tRel, tTold, 1000, 0.016)):
    person(t1 - 0.2, g, P(x + 108)); card(t1 - 0.1, 0.016, P(x + 500))
    for k in range(3):
        s_tap(t1 + 0.2 + k * 0.15, 0.01, P(x + 500))
    value(t2, 0.022, P(x + 650))
ring(tPer - 0.3, 0.7, 0.012, P(208)); ring(tPer - 0.2, 0.7, 0.012, P(1108))
# the pulse, under the rings; src/scenes.js pulses them with the same beat (92 a minute, from tPer - 0.3)
urgent(tPer - 0.3, E(J) + 0.3, bpm=92, root=42, g=0.06, steps=(0, 0, 1, 0))

# 11. Who keeps it: D major, with a turn back to the airport's B minor for its code. Linh in white paper, on the person's notes; her
#     role on the tutor's note, her status on the student's, her country on the note for a list's value; each one's list, a card
#     each; the airport's tag; each owner underlined, then each date; the series' mark on the end card
J = 'keeps'; B = C(J, 'breath'); tR, tSt, tCy, tOne, tA, tKe, tWh = W(J, 'linh', 'role'), W(J, 'linh', 'status'), W(J, 'linh', 'country'), W(J, 'linh', 'one list'), C(J, 'airport'), W(J, 'airport', 'who keeps'), W(J, 'airport', 'from when')
bed([(S0(J), DMAJ9), (C(J, 'airport', -0.3), BM7), (W(J, 'airport', 'But now', -0.3), GMAJ9), (C(J, 'line', -0.3), ASUS), (B, D69)], TOT + 1.0)
person(S0(J) + 0.4, 0.024, P(400))
role('tutor', tR, 0.028, P(780)); role('student', tSt, 0.028, P(780)); value(tCy, 0.024, P(780))
for i in range(3):
    card(tOne + i * 0.15, 0.013, P(1310)); pen(tKe + i * 0.15, 0.5, 0.01, P(1250)); pen(tWh + i * 0.15, 0.5, 0.01, P(1250))
tag(tA - 0.2, 0.012, P(1700))
mark(B + 1.0)

# the effects, brought to their level, and nothing in them above about 2.5 kHz
for b in (XL, XR):
    b[:] = filt(b, 'low', 2400, 4) * FX
