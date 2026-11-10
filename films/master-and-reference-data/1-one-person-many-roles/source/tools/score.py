# One person, many roles: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The palette is new for this series (PLAYBOOK.md: vary the sound itself, film to film), and it follows the
# watercolour: the chords bloom note by note, each note coming in a little after the one below it, like paint spreading on wet paper;
# a clarinet carries the series' mark, one note, its octave, its fifth and the note again (1-8-5-1), the same one wherever it goes;
# a cello, plucked, is the roles: each role has its own note, the same in every chapter, so when the student role is added to the
# person at the end, it comes in on the note it has had all along; and the cello, bowed, is the person: whenever Linh stands in white
# paper, it plays the same D and the A above it, whatever the chapter's key. The film starts in D minor, in the parish of 1686, and
# ends in D major. The effects are the paper's: a quill or a pencil, a wet brush, a card or an envelope, a stamp, a few muffled keys.
# The series' sound (proposal.md, 20 October 2026, after the author's review of Who is it?: "bring some sounds and music from time to
# time instead of constant sounds"), which tools/quiet.py checks:
#  - The music plays under the opening, where the story from real life is told: the parish of 1686, Linh back to study, and her five
#    records (film.json's "story"). After that it comes in from time to time: a chord at some chapters' turns, the person's two notes
#    and the roles' notes as they appear on screen, the four lanes settled, "four yeses", the series' nine notes and the end card.
#    Never a constant bed under the voice.
#  - Nothing trembles or pulses: one voice to a note, so no two voices beat on a phone's speaker, and no pulse under the errors.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the
#    picture in src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
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

# ---- the series' instruments, all low-passed ----
# the music's levels: the bed sits about 21 dB under the voice, as in the other series' films, and the notes over it a little less
BED, NOTE = 1.66, 1.5
def wash(ch, start, sec, g=0.03, bloom=0.3):
    """a held chord that blooms note by note, like paint on wet paper: each note comes in a little after the one below it and swells at
    its own slow rate; one voice to a note, in the middle, so nothing beats when a phone's speaker adds the two channels together (the
    first version's two detuned voices did); nothing above about 1.4 kHz"""
    x = tt(sec); s = np.zeros_like(x)
    for k, m in enumerate(ch):
        f = mf(m); e = np.clip((x - k * bloom) / 2.2, 0, 1) ** 1.5 * np.clip((sec - x) / 3.0, 0, 1)
        sw = 1 + 0.12 * np.sin(2 * np.pi * (0.05 + 0.013 * k) * x + k)
        s += (np.sin(2 * np.pi * f * x) + 0.22 * np.sin(4 * np.pi * f * x) + 0.06 * np.sin(6 * np.pi * f * x)) * e * sw
    put(filt((s / len(ch)).astype(np.float32), 'low', 1400), start, g * BED * 1.48)  # as loud as the three voices were
def bed(keys, end, g=0.03):
    """the chapter's chords, each from its moment (a little early, so it has bloomed by then) until a little after the next one starts:
    only under the opening's story"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        wash(ch, t0 - 1.2, t1 - t0 + 3.6, g)
def comes(ch, t0, sec=6.0, g=0.03):
    """a chord that comes in for a moment and leaves, blooming by t0: at a chapter's turn, under a moment on screen, or in a pause
    without words"""
    wash(ch, t0 - 1.0, sec, g)
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet: odd harmonics, a breath as it speaks, a slow vibrato that comes in late"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.0 * x) * np.clip((x - 0.35) / 0.5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def pizz(m, start, g=0.03, pan=0.0, sec=1.4):
    """a cello, plucked: a round note whose top fades fast; a role arriving"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.4 * k) * (1 / k ** 1.3) * np.exp(-x * (2.2 + 2.4 * k)) for k in range(1, 7))
    s = s * np.minimum(1, x / 0.004) + 0.04 * filt(noise(sec), 'band', (f, f * 4)) * np.exp(-x * 80)
    put(norm(filt(s.astype(np.float32), 'low', 1600)), start, g * NOTE, pan)
def cello(m, start, sec, g=0.03, pan=0.0):
    """a cello, bowed: slow to speak and slow to leave"""
    f = mf(m); x = tt(sec); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.4 * x) * np.clip((x - 0.4) / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = sum(np.sin(k * ph) * (1 / k) * np.exp(-0.22 * k) for k in range(1, 9)) + filt(noise(sec), 'band', (f, f * 5)) * 0.05
    put(norm(filt((s * env(sec, 0.45, min(1.2, sec * 0.45))).astype(np.float32), 'low', 1800)), start, g * NOTE, pan)
def person(s, g=0.026, pan=0.0):
    """the person: the bowed D, and the A above it, the same two notes wherever she stands in white paper"""
    cello(50, s, 3.2, g, pan); cello(57, s + 0.55, 2.6, g * 0.55, pan + 0.15)
# each role's note, the same in every chapter
ROLE = {'student': 50, 'applicant': 52, 'researcher': 55, 'tutor': 57, 'alumna': 62}
def role(r, s, g=0.03, pan=0.0):
    pizz(ROLE[r], s, g, pan)
def mark(start, root=62, g=0.05):
    """the series' mark, 1-8-5-1, on the clarinet, over the plucked root"""
    for i, iv in enumerate([0, 12, 7, 0]):
        clarinet(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    pizz(root - 12, start, g * 0.6); pizz(root - 12, start + 1.26, g * 0.5)
def quill(s, sec=0.6, g=0.016, pan=0.0):
    """a quill or a pencil writing: a soft scratch that flutters with the strokes"""
    x = tt(sec); fl = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 7.5 * x + 3 * np.sin(2 * np.pi * 1.3 * x)))
    X(filt(noise(sec), 'band', (700, 2300)) * fl * np.sin(np.pi * x / sec) ** 0.6, s, g, pan)
def tick_(s, g=0.016, pan=0.0):
    """a pencil tick: two short strokes"""
    quill(s, 0.1, g, pan); quill(s + 0.09, 0.16, g * 0.8, pan)
def cross(s, g=0.016, pan=0.0):
    """a pencil cross: two strokes, one after the other"""
    quill(s, 0.14, g, pan); quill(s + 0.2, 0.14, g, pan)
def ring(s, sec=0.8, g=0.016, pan=0.0):
    """a pencil drawn round something: a scratch that swells once round and lifts"""
    x = tt(sec); X(filt(noise(sec), 'band', (600, 2000)) * np.sin(np.pi * x / sec) * (0.7 + 0.3 * np.sin(2 * np.pi * x / sec * 2)), s, g, pan)
def paper(s, g=0.03, pan=0.0, sec=0.45):
    """paper, softly: a card, a sheet or an envelope picked up or set down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def brush(s, g=0.022, pan=0.0, sec=0.8):
    """a wet brush across the paper: a low, soft swish"""
    x = tt(sec); X(filt(noise(sec), 'band', (180, 1200)) * np.sin(np.pi * x / sec) ** 2 * (1 + 0.3 * np.sin(2 * np.pi * 3 * x)), s, g, pan)
def knock(s, g=0.024, pan=0.0, f=240):
    """a soft wooden knock: a card or a tag set down"""
    s_knock(s, g, pan, f)
def tap(s, g=0.016, pan=0.0):
    """a muffled key"""
    s_tap(s, g, pan)
def typing(s, sec, g=0.014, pan=0.0, n=5):
    """a few muffled keys, while something is typed in"""
    for k in range(n):
        s_tap(s + k * sec / n, g * (0.8 + 0.2 * (k % 2)), pan)
def air(s, sec=0.7, g=0.02, pan=0.0):
    """a breath of air: a line drawn, a card sliding in"""
    s_air(s, sec, g, pan, 160, 1000)
def stamp(s, g=0.075):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); s_knock(s + 0.01, g * 0.4, 0, 200)
def heart(s, g=0.04, pan=0.0):
    """a heartbeat, once: two low knocks"""
    s_knock(s, g, pan, 90); s_knock(s + 0.28, g * 0.7, pan, 80)

# chords (MIDI note numbers), low to high
DM9 = [38, 45, 50, 53, 57, 64]; BBMAJ7 = [34, 46, 50, 53, 57]; GM7 = [43, 50, 53, 58, 62]; FMAJ7 = [41, 48, 52, 57, 60]; A7SUS = [45, 52, 55, 57, 62]
FMAJ9 = [41, 48, 52, 55, 57, 64]; C69 = [36, 43, 48, 52, 57, 62]; AM7 = [45, 52, 55, 60, 64]; DM7 = [38, 45, 53, 57, 60]; E7SUS4 = [40, 47, 52, 57, 62]
CMAJ9 = [36, 43, 52, 55, 59, 62]; G6 = [43, 50, 55, 59, 64]; EM9 = [40, 47, 55, 59, 66]; CMAJ7 = [36, 43, 52, 55, 59]; B7SUS4 = [47, 52, 54, 57, 64]
GMAJ9 = [43, 50, 54, 57, 59]; DSUS2 = [38, 45, 50, 52, 57]; GMAJ7 = [43, 50, 54, 59, 62]; DMAJ9 = [38, 45, 54, 57, 61, 64]; BM7 = [47, 54, 57, 62, 66]
GADD9 = [38, 43, 54, 57, 59, 62]; A69 = [45, 52, 54, 59, 61]; DMAJ7 = [38, 45, 54, 57, 61]; EBMAJ7 = [39, 46, 50, 55, 58]; F6 = [41, 48, 53, 57, 62]
BBMAJ9 = [46, 53, 57, 60, 62]


# 1. One record, wherever you go: D minor, and the parish's paper. The book set down and written in, row by row, a tick for those who can
#    read; Olof struck through, and where he went; the certificate lifted; the tag on the road; the next book, and his name in it; then,
#    under the hush, the card of 1947 and its stamp; the line from one book to the next, and the person's two notes on "followed";
#    the series' mark under the title
J = 'parish'; B = C(J, 'breath'); tWho = W(J, 'book', 'who lived', -0.15)
bed([(S0(J), DM9), (C(J, 'moved', -0.3), BBMAJ7), (C(J, 'number', -0.7), GM7), (C(J, 'once', -0.2), FMAJ7), (W(J, 'once', 'followed'), A7SUS), (B + 0.3, DM9)], E(J) + 1.0)
paper(W(J, 'book', 'keep a book', -0.4), 0.04, P(460))
quill(W(J, 'book', 'every household'), 0.9, 0.016, P(300))
quill(tWho, 2.9, 0.013, P(300))
tick_(max(tWho + 0.5, W(J, 'book', 'whether they')), 0.016, P(600))
quill(C(J, 'moved'), 0.5, 0.02, P(700)); quill(C(J, 'moved', 0.5), 1.5, 0.013, P(700))
paper(W(J, 'moved', 'carried'), 0.03, P(800))
knock(W(J, 'moved', 'new parish', -0.2), 0.022, P(1700))
paper(W(J, 'moved', 'the next book', -0.3), 0.035, P(1590))
quill(W(J, 'moved', 'the next book', 0.9), 2.3, 0.013, P(1650))
paper(C(J, 'number', 0.1), 0.035, 0.0)
stamp(W(J, 'number', 'a number'), 0.07)
air(C(J, 'once', 0.9), 1.4, 0.026, P(1100))
person(W(J, 'once', 'followed'), 0.024, P(1228))
mark(B + 0.8)

# 2. Back to study: F major. Her name card; her record from her first degree, on the student's note; her phone, and a few muffled keys
#    as she applies; the new record, on the same note, and its number stamped on, as in 1947; the line towards the old record, a breath,
#    and the pencil's cross where it stops
J = 'back'; tGrad, tOnl, tNum = W(J, 'today', 'graduated'), W(J, 'applies', 'online'), W(J, 'applies', 'number')
bed([(S0(J), FMAJ9), (C(J, 'back', -0.3), BBMAJ7), (C(J, 'applies', -0.3), C69), (C(J, 'nothing', -0.2), DM7)], E(J) + 1.0)
knock(W(J, 'today', 'Linh Nguyen', -0.2), 0.024, P(230))
paper(tGrad, 0.028, P(270)); role('student', tGrad + 0.1, 0.032, P(270))
tap(C(J, 'applies', -0.1), 0.018, P(560)); typing(C(J, 'applies', 0.3), 1.2, 0.012, P(560), 5)
paper(tOnl, 0.028, P(930)); role('student', tOnl + 0.1, 0.03, P(930))
stamp(tNum - 0.05, 0.06)
air(W(J, 'nothing', 'linked'), 0.7, 0.018, P(645))
cross(W(J, 'nothing', 'graduated with'), 0.016, P(595))

# 3. Five records, five Linhs: A minor. Three blank cards set down as the five are counted; a pencil round the old number and the new;
#    each record named on its role's note; a pencil round the alumni office's number, the old one; her application, on the applicant's
#    note, and the transcript it asks for typed in; "required"; a pencil round the degree her own record holds; the
#    alumni office's email, on the alumna's note; a pencil round the master's she's already doing; the lines to her fading; the tag
J = 'five'; tFive, tApp, tTr = W(J, 'now', 'five records'), W(J, 'transcript', 'her application'), W(J, 'transcript', 'a transcript')
bed([(S0(J), AM7), (C(J, 'alumni', -0.3), FMAJ7), (C(J, 'research', -0.3), DM7), (C(J, 'transcript', -0.3), E7SUS4), (C(J, 'none', -0.2), AM7)], E(J) + 1.0)
for i, x in enumerate([270, 930, 930]):
    knock(tFive + i * 0.15, 0.016, P(x), 220 + 20 * i)
ring(W(J, 'students', 'the old number'), 0.7, 0.015, P(400)); ring(W(J, 'students', 'the new'), 0.7, 0.015, P(1032))
role('alumna', W(J, 'alumni', 'alumni office'), 0.032, P(270))
ring(W(J, 'alumni', 'only the old'), 0.7, 0.015, P(400))
role('tutor', W(J, 'hr', 'HR'), 0.032, P(930))
role('researcher', W(J, 'research', 'research office'), 0.032, P(930))
paper(tApp - 0.2, 0.03, P(1540)); role('applicant', tApp - 0.1, 0.026, P(1540))
typing(tTr, 1.0, 0.012, P(1430), 5); knock(tTr + 1.0, 0.018, P(1720))
ring(W(J, 'transcript', 'the university gave'), 0.8, 0.016, P(200))
paper(W(J, 'invite', 'invites her', -0.2), 0.03, P(1540), 0.5); role('alumna', W(J, 'invite', 'invites her', -0.1), 0.026, P(1540))
ring(W(J, 'invite', 'already doing'), 0.8, 0.016, P(880))
air(W(J, 'none', 'nobody'), 1.4, 0.016, P(600))
knock(W(J, 'none', 'one person', -0.3), 0.02, P(930))

# 4. The kinds of data: C major, a chord at the turn, then no music but the person's. A shelf for each kind as it's named; Linh in white
#    paper, master data, and the person's notes; her roles' colours, a brush; the two lists, and the value that sorts her; the slips of
#    what happens to her; the glossary's card; the arrow between the first two, and the next film's tag
J = 'kinds'
comes(CMAJ9, S0(J))
for k, (lid, x) in enumerate([('master', 270), ('reference', 730), ('trans', 1190), ('meta', 1650)]):
    knock(C(J, lid, -0.3), 0.022, P(x), 200 + 20 * k)
person(C(J, 'master', 0.1), 0.024, P(270))
brush(W(J, 'master', 'shared by'), 0.02, P(270), 1.2)
paper(C(J, 'reference', 0.2), 0.024, P(730)); brush(W(J, 'reference', 'casual tutor'), 0.018, P(730))
for t0 in (C(J, 'trans', 0.4), W(J, 'trans', 'an enrolment', 0.3), W(J, 'trans', 'a payslip', 0.1)):
    paper(t0, 0.02, P(1190), 0.35)
paper(W(J, 'meta', 'the definition', -0.2), 0.024, P(1650))
air(W(J, 'apart', 'tells them'), 0.7, 0.02, P(480)); knock(W(J, 'apart', 'tells them', 0.3), 0.02, P(480))

# 5. The role, called the person: E minor, a chord at the turn. Noor's name; the model pinned up; the learner lit, and its keys' card;
#    a pencil round the learner, and her note; round the other roles; the empty place for a person, a low bowed note and no answer;
#    the tag; the decision typed in
J = 'role'; tWr = W(J, 'none', 'writes it')
comes(EM9, S0(J))
knock(C(J, 'opens'), 0.024, P(210))
paper(W(J, 'opens', 'own model', -0.5), 0.034, P(1230), 0.7)
brush(C(J, 'learner', 0.3), 0.018, P(700))
air(W(J, 'learner', 'with keys', -0.5), 0.5, 0.018, P(1000)); paper(W(J, 'learner', 'with keys', -0.2), 0.026, P(1490))
ring(C(J, 'someone', 0.3), 0.8, 0.016, P(700))
quill(W(J, 'someone', "It's how", -0.4), 1.2, 0.014, P(1000))
ring(C(J, 'none', 0.4), 0.7, 0.013, P(380)); ring(C(J, 'none', 0.8), 0.7, 0.013, P(560))
cello(47, C(J, 'none', 0.2), 2.6, 0.018, P(735))
knock(C(J, 'none', 0.6), 0.02, P(1040))
knock(tWr - 0.6, 0.022, P(220)); typing(tWr - 0.2, 1.6, 0.012, P(220), 6)

# 6. Four things, kept apart: G major, the person's notes first. The lanes, a brush; the person in white paper, on her two notes, and
#    her card; each role on its note; the two contact points, and "shared" on two notes at once; three identifiers, each a key, as a
#    system issues them; the tag; enterprise architecture's card sliding in, its actor, and the actor assigned to the student's and
#    the tutor's notes; then, without words, the four lanes settled, on a G major chord that turns to D as the next chapter opens
J = 'apart'; B = C(J, 'breath')
comes(GMAJ7, B + 0.2)
brush(C(J, 'draws', 0.3), 0.02, P(900), 1.2)
person(C(J, 'person'), 0.026, P(210))
knock(C(J, 'person', 0.3), 0.022, P(210))
role('student', W(J, 'roles', 'student'), 0.032, P(980)); role('tutor', W(J, 'roles', 'tutor'), 0.032, P(1560))
role('researcher', W(J, 'roles', 'researcher'), 0.032, P(980)); role('alumna', W(J, 'roles', 'each with', 0.5), 0.032, P(1560))
knock(W(J, 'contacts', 'an email'), 0.02, P(980)); knock(W(J, 'contacts', 'each with'), 0.02, P(1564))
pizz(50, W(J, 'contacts', 'some shared'), 0.022, P(1700)); pizz(57, W(J, 'contacts', 'some shared'), 0.018, P(1760))
for k, t0 in enumerate([W(J, 'ids', 'a student number'), W(J, 'ids', 'a staff number'), W(J, 'ids', 'a staff number', 1.1)]):
    tap(t0, 0.026, P(880 + 400 * k))
knock(C(J, 'none', 0.1), 0.02, P(210))
air(C(J, 'ea'), 0.7, 0.024, P(1300))
knock(W(J, 'ea', 'is an actor'), 0.022, P(950))
role('student', W(J, 'ea', 'assigned to'), 0.028, P(1500)); role('tutor', W(J, 'ea', 'assigned to', 0.35), 0.028, P(1500))
knock(W(J, 'ea', 'for a time'), 0.02, P(1260))

# 7. Who keeps what: D major, a chord at the turn. The sheet set down; Mei's card; the roles' rows, then the details' rows, in pencil;
#    a brush over each keeper as it's named; the person's row, on her two notes; the steward's tick
J = 'keeps'
comes(DMAJ9, S0(J))
paper(C(J, 'write', 0.3), 0.034, P(940), 0.6)
knock(C(J, 'write', 0.9), 0.022, P(1675))
quill(C(J, 'roles', 0.3), 1.8, 0.013, P(900)); quill(C(J, 'attrs', 0.3), 1.6, 0.013, P(900))
for t0 in (C(J, 'legal', 0.3), C(J, 'own', 0.3), W(J, 'own', 'home address'), C(J, 'hr', 0.3)):
    brush(t0, 0.018, P(1250), 0.6)
person(C(J, 'mei', 0.2), 0.024, P(900))
tick_(W(J, 'mei', 'who someone'), 0.017, P(1300))

# 8. Elsewhere: no chord, only the notes of the people in it. The three panels, a brush each; the person's notes as the first Linh
#    appears; in each industry its own roles, plucked; the wall between the nurse's and the patient's records; the line to a friend's
#    loan; the meter; the account holder moving out, a breath of air; the occupant, and a heartbeat for life support; then the same
#    four things, four notes
J = 'elsewhere'; X0, X1, X2 = 170, 820, 1470
for i in range(3):
    brush(C(J, 'every', 0.2 + i * 0.25), 0.018, P([400, 960, 1520][i]), 0.8)
person(C(J, 'nurse', -0.2), 0.02, P(320))
pizz(58, C(J, 'nurse', 0.4), 0.03, P(X0 + 400)); knock(W(J, 'nurse', 'as a patient'), 0.022, P(X0 + 410), 160); pizz(53, W(J, 'nurse', 'as a patient', 0.2), 0.03, P(X0 + 400))
pizz(55, C(J, 'bank', 0.3), 0.03, P(X1 + 400)); pizz(50, W(J, 'bank', 'guarantees'), 0.03, P(X1 + 400))
air(W(J, 'bank', "a friend's loan"), 0.6, 0.018, P(X1 + 380)); knock(W(J, 'bank', "a friend's loan", 0.3), 0.02, P(X1 + 420))
tap(C(J, 'home'), 0.02, P(X2 + 40))
pizz(53, W(J, 'home', 'the account holder', -0.3), 0.03, P(X2 + 400)); air(W(J, 'home', 'moved out'), 1.8, 0.02, 0.85)
pizz(57, W(J, 'home', 'the person who stays'), 0.03, P(X2 + 400)); heart(W(J, 'home', 'the power on'), 0.04, P(X2 + 300))
for i, m in enumerate([50, 53, 57, 62]):
    pizz(m, C(J, 'same', 0.3 + i * 0.2), 0.026, -0.3 + i * 0.2)

# 9. Named once: C major, a chord at the turn. DAMA's name; the wheel drawn, a breath; its wedge for reference and master data, lit;
#    the tag; each of the four ways set down; the tag for the film that chooses one
J = 'dama'; tRM = W(J, 'dama', 'reference and master')
comes(CMAJ9, S0(J))
knock(C(J, 'dama', -0.2), 0.022, P(440))
air(C(J, 'dama', 0.2), 1.0, 0.02, P(440))
brush(tRM, 0.02, P(520)); pizz(52, tRM, 0.026, P(520)); knock(tRM + 0.3, 0.02, P(560))
for k, (word, x) in enumerate([('a registry', 1210), ('a copy', 1660), ('a master that', 1210), ('one place', 1660)]):
    knock(W(J, 'four', word, -0.2), 0.022, P(x), 220 + 20 * k)
knock(C(J, 'later', 0.4), 0.02, P(1460))

# 10. Not only people: D minor at the turn, then the four questions with no chord, then D major on "four yeses". Linh in white paper,
#     on her notes, and her tag; each industry's row, plucked on its first thing; the sheet of questions; the three things put to them;
#     a tick or a cross for each answer, in pencil; the verdicts; the supplier turning white, mastered, on two notes
J = 'entities'; tAsk, tY = W(J, 'which', 'Ask four'), C(J, 'yes')
comes(DM9, S0(J)); comes(DMAJ9, tY - 0.2)
person(C(J, 'only', -0.2), 0.022, P(200))
knock(C(J, 'only', 0.3), 0.02, P(200))
for lid, word, m in [('uni', 'employers', 57), ('health', 'patients', 58), ('bank', 'customers', 53), ('utility', 'meters', 57), ('shop', 'products', 60)]:
    pizz(m, W(J, lid, word, -0.1), 0.026, P(700))
paper(tAsk - 0.3, 0.032, 0.0, 0.6)
QX = [1000, 1335, 1670]
for j in range(3):
    knock(tAsk + 0.5 + j * 0.2, 0.018, P(QX[j]), 230 + 20 * j)
ANS = [[1, 1, 1, 1], [0], [1, 1, 0]]
for i, q in enumerate(['q1', 'q2', 'q3', 'q4']):
    for j in range(3):
        if i < len(ANS[j]):
            (tick_ if ANS[j][i] else cross)(C(J, q, 0.6 + j * 0.35), 0.015, P(QX[j]))
knock(C(J, 'q1', 1.6), 0.016, P(QX[1])); knock(C(J, 'q3', 1.6), 0.016, P(QX[2]))
pizz(50, tY + 0.3, 0.03, P(QX[0])); pizz(57, tY + 0.42, 0.024, P(QX[0]))

# 11. The series: no chord; its nine notes are its music. The line drawn in pencil, and this film on it; the four parts set down blank,
#     a soft knock each as they're counted; then each part named, and its two films set on the line, nine notes rising along it, left
#     to right; and a wordless moment to read them, as the last notes ring
J = 'series'; PX = [590, 960, 1330, 1700]
quill(S0(J), 1.6, 0.013, 0.0)
pizz(50, S0(J) + 0.2, 0.032, P(200))
for g, x in enumerate(PX):
    knock(W(J, 'parts', 'four parts', 0.12 * g), 0.014, P(x), 220 + 20 * g)
for g, (word, (a, b)) in enumerate(zip(['Who someone', 'Roles and', 'Sharing', 'keeping'], [(52, 55), (57, 59), (62, 64), (67, 69)])):
    pizz(a, W(J, 'names', word, 0.15), 0.026, P(PX[g])); pizz(b, W(J, 'names', word, 0.4), 0.026, P(PX[g]))

# 12. Found first: D major, on the end card. Her application, on the applicant's note; the line that finds her, a breath, and a tick;
#    the student's band painted in, a brush and the student's note; its chip; a tick for her degree, already on file; the alumni
#    office's card, and its tick; the person's notes under the line; the D major chord and the series' mark on the end card
J = 'found'; B = C(J, 'breath'); tAp, tFind, tRole = W(J, 'now', 'Linh applies'), W(J, 'now', 'finds her'), W(J, 'adds', 'a role')
comes(DMAJ9, B, TOT + 1.0 - (B - 1.0))
paper(tAp - 0.3, 0.03, P(1540)); role('applicant', tAp - 0.2, 0.026, P(1540))
air(tFind, 0.8, 0.02, P(900)); tick_(tFind + 0.7, 0.016, P(1260))
brush(tRole, 0.02, P(560), 0.8); role('student', tRole + 0.1, 0.034, P(560))
knock(tRole + 0.3, 0.02, P(920))
tick_(W(J, 'there', 'Her degree'), 0.016, P(1260))
paper(W(J, 'there', 'the alumni', -0.3), 0.028, P(1540)); tick_(W(J, 'there', 'sees'), 0.016, P(1260))
person(C(J, 'know', -0.1), 0.026, 0.0)
mark(B + 1.0)
