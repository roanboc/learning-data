# A hub at work: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py). The
# palette is new for this film (PLAYBOOK.md: vary the sound itself, film to film), and it follows the film's three parts:
#  - a soft synthesiser plays the chords, the hub's own sound: one voice to a note, each chord blooming note by note from the lowest
#    as its filter opens (the first cut's reed organ was One person, many systems' instrument too, and pulsed on a phone's speaker);
#  - the rules are a felt marimba: round wooden notes when the rules land, sort the weekend and weigh a match, and for each question;
#  - the AI helper is a vibraphone with its motor off, when it drafts its note, reads two ways of writing a degree as one, and learns;
#  - people deciding are a horn: when the badge says "for Mei", when Mei links the records, and when she unlinks the wrong one.
# The series' mark stays on its clarinet (one note, its octave, its fifth and the note again, 1-8-5-1), here in B flat, the film's home.
# The person's interval from One person, many roles (a D and the A above it) comes back on the marimba when Rafael stands in white paper.
# The effects are the office's: a muffled key, a mouse's click, a felt-tip pen, a breath of air.
# The series' sound since 20 October 2026, after the author asked for "some sounds and music from time to time instead of constant
# sounds":
#  - Music plays under the opening, Monday morning at the hub, until the title: the chords change with the narration.
#  - After that, music and sounds come in from time to time, never as a bed under the voice: at a chapter's turn, a chord that blooms
#    in the pause between chapters and fades under the first words; under a moment on screen, an instrument's few notes or one effect;
#    and in a pause without words (this week's result on Friday, and the end card).
#  - Nothing loops, trembles or pulses: no urgent pulse (the first cut had one under Friday's wrong link), no vibraphone motor, and one
#    voice to a note everywhere, so nothing beats on a phone's speaker.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: a pen, muffled keys, a breath, low notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def END(sid, lid, off=0):
    """when a line ends, as the film's sc.ends does"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan

# ---- the film's instruments, all low-passed ----
# the levels: the music sits about 21 dB under the voice while it speaks, as in the other series' films, and the effects just over it
BED, NOTE, FX = 1.9, 1.6, 2.0
def pure(ch):
    """how far, in cents, to move each note of a chord so that its fifths, fourths and octaves are pure. An equal-tempered fifth is
    2 cents narrow, so a low note's third harmonic and its fifth's second beat about once every two or three seconds, which a phone's
    one speaker turns into a slow pulse; 2 cents is too little to hear against the other instruments"""
    ch = sorted(ch); c = {ch[0]: 0.0}; todo = [ch[0]]
    while todo:
        a = todo.pop()
        for b in ch:
            if b not in c and (b - a) % 12 in (0, 5, 7):
                c[b] = c[a] + {0: 0.0, 7: 1.955, 5: -1.955}[(b - a) % 12]; todo.append(b)
    return [c.get(m, 0.0) for m in ch]
def synth(ch, start, sec, g=0.03):
    """a soft synthesiser's chord: a sawtooth's harmonics through a gently resonant filter that opens as each note comes in (from
    300 to 800 Hz) and then settles (to about 560 Hz), nothing above 1.8 kHz; one voice to a note (two voices a hair apart beat into
    a pulse on a phone), its fifths pure; the notes come in one after another from the lowest, so the chord blooms as the series'
    chords do; it fades over its last 2.6 seconds"""
    x = tt(sec); ch = sorted(ch)
    for k, (m, c) in enumerate(zip(ch, pure(ch))):
        f = mf(m) * 2 ** (c / 1200); d = 0.14 * k
        e = np.clip((x - d) / 1.6, 0, 1) ** 1.8 * np.clip((sec - x) / 2.6, 0, 1)
        fc = 300 + 500 * np.clip((x - d) / 2.5, 0, 1) ** 0.7 - 240 * np.clip((x - d - 2.5) / 5.0, 0, 1)
        s = sum(np.sin(2 * np.pi * f * h * x + 0.7 * h + k) / h / np.sqrt((1 - (f * h / fc) ** 2) ** 2 + (f * h / fc / 1.3) ** 2)
                for h in range(1, int(1800 / f) + 1))
        put(filt((s * e / len(ch)).astype(np.float32), 'high', 60), start, g * BED, (k - (len(ch) - 1) / 2) * 0.16)
def bed(keys, end, g=0.03):
    """the opening's chords, each from its moment (a little early, so it has come in by then) until a little after the next one starts"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        synth(ch, t0 - 0.8, t1 - t0 + 3.2, g)
def turn(sid, ch, g=0.03):
    """a chapter's turn: its chord blooms in the pause before the chapter's first words (which starts 1.8 s before the chapter, and
    lasts 2.6 s), and fades under them"""
    synth(ch, S0(sid) - 1.6, 4.6, g)
def mallet(m, start, g=0.03, pan=0.0, sec=1.6):
    """a felt marimba: the round fundamental, its fourth partial (two octaves up) dying fast, a felt attack; the rules at work"""
    f = mf(m); x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 2.6) + 0.22 * np.sin(2 * np.pi * f * 3.98 * x) * np.exp(-x * 11) + 0.05 * np.sin(2 * np.pi * f * 9.9 * x) * np.exp(-x * 26)
    put(norm(filt((s * np.minimum(1, x / 0.007)).astype(np.float32), 'low', 1500)), start, g * NOTE, pan)
def vibe(m, start, g=0.03, pan=0.0, sec=3.0):
    """a vibraphone with its motor off, so it doesn't tremble: a bar's pure tone, a little of its fourth and tenth partials, ringing
    and fading; the AI helper"""
    f = mf(m); x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 0.9) + 0.18 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 3.5) + 0.04 * np.sin(2 * np.pi * f * 10 * x) * np.exp(-x * 9)
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2000)), start, g * NOTE, pan)
def horn(m, start, sec, g=0.03, pan=0.0):
    """a horn, far off and warm: it scoops up into the note, swells, and its top is dark; a person deciding"""
    f = mf(m); x = tt(sec); sc = 1 - 0.012 * np.exp(-x * 9); vib = 1 + 0.003 * np.sin(2 * np.pi * 4.8 * x) * np.clip((x - 0.5) / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * sc * vib) / SR
    s = sum(np.sin(h * ph) * a for h, a in ((1, 1.0), (2, 0.62), (3, 0.36), (4, 0.2), (5, 0.11), (6, 0.06)))
    s = s + filt(noise(sec), 'band', (f, f * 3)) * 0.03 * np.exp(-x * 5)
    put(norm(filt((s * env(sec, 0.16, min(0.9, sec * 0.5))).astype(np.float32), 'low', 1300)), start, g * NOTE, pan)
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet, the series' mark's: odd harmonics, a breath as it speaks, a slow vibrato that comes in late"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.0 * x) * np.clip((x - 0.35) / 0.5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def mark(start, root=58, g=0.05):
    """the series' mark, 1-8-5-1, on the clarinet, over the marimba's low root"""
    for i, iv in enumerate([0, 12, 7, 0]):
        clarinet(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    mallet(root - 12, start, g * 0.7); mallet(root - 12, start + 1.26, g * 0.55)
def person(s, g=0.03, pan=0.0):
    """the person's interval from film 1, a D and the A above it, on this film's marimba"""
    mallet(50, s, g, pan, 2.4); mallet(57, s + 0.5, g * 0.8, pan + 0.1, 2.4)

# ---- the office's sounds ----
def pen(s, sec=0.6, g=0.014, pan=0.0):
    """a felt-tip pen on paper: a soft, low scratch that follows the strokes"""
    x = tt(sec); fl = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 5.5 * x + 2 * np.sin(2 * np.pi * 1.1 * x)))
    X(filt(noise(sec), 'band', (380, 1500)) * fl * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def tick_(s, g=0.016, pan=0.0):
    """a pen tick: a short stroke down, a longer one up"""
    pen(s, 0.08, g, pan); pen(s + 0.08, 0.15, g * 0.8, pan)
def cross(s, g=0.016, pan=0.0):
    """a pen cross: two strokes, one after the other"""
    pen(s, 0.14, g, pan); pen(s + 0.2, 0.14, g, pan)
def ring(s, sec=0.8, g=0.014, pan=0.0):
    """a pen drawn round something: a scratch that swells once round and lifts"""
    x = tt(sec); X(filt(noise(sec), 'band', (360, 1400)) * np.sin(np.pi * x / sec) * (0.7 + 0.3 * np.sin(4 * np.pi * x / sec)), s, g * FX, pan)
def hatch(s, g=0.012, pan=0.0):
    """a field hatched over: five quick strokes"""
    for k in range(5):
        pen(s + k * 0.07, 0.06, g, pan)
def tap(s, g=0.016, pan=0.0):
    """a muffled key"""
    s_tap(s, g * FX, pan)
def click(s, g=0.02, pan=0.0):
    """a mouse button, pressed and let go: two small, dull clicks"""
    for d, gg in ((0.0, 1.0), (0.085, 0.6)):
        x = tt(0.03); X(norm(filt(noise(0.03), 'band', (500, 1800)) * np.exp(-x * 240)), s + d, g * gg * FX, pan)
def air(s, sec=0.7, g=0.018, pan=0.0):
    """a breath of air: the rules flying into the hub, the camera going in"""
    s_air(s, sec, g * FX, pan, 160, 1000)
def wake(s, g=0.02):
    """the screen waking: a low fifth that rises and settles"""
    s_swell(mf(46), s, 1.8, g * FX)

# chords (MIDI note numbers), low to high: B flat major is home
BB9 = [46, 53, 57, 60, 62]; GM9 = [43, 50, 57, 58, 62]; EBMAJ9 = [39, 46, 50, 53, 55]; CM9 = [36, 43, 51, 55, 58, 62]; FSUS = [41, 48, 53, 58, 60]
BBADD9 = [46, 53, 58, 60, 62]


# 1. Monday morning, the opening: B flat major. Music plays under it: the hub's chords change with the narration, through the weekend's
#    count on the hub's screen and the title. Mei opens the hub: a key, and the screen waking; the two rules fly into the hub and land
#    as its rules, a breath and two marimba notes; the camera going in; the series' mark under the title
J = 'monday'; B = C(J, 'breath'); tOpen = W(J, 'monday', 'opens'); land = C(J, 'hub', 0.2); tPush = END(J, 'lf', 0.5)
bed([(S0(J), BB9), (C(J, 'rules', -0.3), GM9), (C(J, 'hub', -0.3), EBMAJ9), (C(J, 'lf', -0.3), CM9), (C(J, 'weekend', -0.3), FSUS), (B + 0.3, BB9)], E(J) + 0.4)
tap(tOpen - 0.12, 0.018, P(470)); wake(tOpen, 0.02)
air(land, 1.0, 0.02, P(1216)); mallet(58, land + 0.8, 0.03, P(1200)); mallet(65, land + 0.95, 0.026, P(1200))
air(tPush, 1.6, 0.016, 0.0)
mark(B + 0.8)

# 2. Rules act: G minor, and no music under the voice. The weekend's changes stream through the rules in silence; when they land, one
#    low marimba note; the five new people, a note each as they arrive, rising; then the badge "for Mei", on the horn
J = 'rules'; tMost, tKnown, tNew = C(J, 'most'), C(J, 'known'), C(J, 'new')
win = [(tMost + 0.1, tKnown + 2.4), (tNew - 1.3, tNew - 0.3)]; TRAVEL = 1.5
mallet(43, win[0][1] + TRAVEL, 0.03, P(1570), 2.2)
for i in range(5):
    mallet([55, 57, 58, 62, 65][i], win[1][0] + TRAVEL + i * (win[1][1] - win[1][0]) / 4, 0.022, P(1570))
horn(55, W(J, 'close', 'wait for Mei', -0.1), 1.8, 0.022, P(1700))

# 3. Waiting, not a new number: E flat major. At the turn, Saturday's chord; the new number's stamp coming down, crossed out; and the
#    badge "waits for Mei", on the horn
J = 'saturday'; tNum, tMei = W(J, 'waits', 'new student'), W(J, 'waits', 'waits for')
turn(J, EBMAJ9)
thud(tNum + 0.3, 0.05 * FX); cross(tNum + 0.4, 0.016, P(1660))
horn(58, tMei, 2.0, 0.022, P(1100))

# 4. Why 74: C minor. At the turn, back at the hub on Monday, its chord; each weight a marimba note as its bar grows, rising for what
#    adds and falling for what takes away; and the score line drawn into the band where a person decides, on the horn
J = 'why'; tGiven, tFam, tLittle, tAway, tBandW = W(J, 'names', 'given'), W(J, 'names', 'family'), W(J, 'dates', 'add a little'), W(J, 'email', 'takes'), W(J, 'band', 'the band')
turn(J, CM9)
for t0, m in ((tGiven, 48), (tFam, 51), (tLittle - 0.3, 55), (tAway, 47)):
    mallet(m, t0 + 0.1, 0.03, P(1200))
horn(56, tBandW, 1.8, 0.022, P(1420))

# 5. AI suggests: D minor. At the turn, the helper's note appears, on the vibraphone; and when it reads two ways of writing his degree
#    as the same meaning, two notes more
J = 'ai'; tNote, tMean = C(J, 'note'), C(J, 'meaning')
vibe(62, tNote - 0.2, 0.026, P(1370)); vibe(69, tNote + 0.1, 0.02, P(1400))
vibe(65, tMean + 0.6, 0.02, P(816)); vibe(69, tMean + 0.85, 0.017, P(816))

# 6. People decide: F major. Her click on Link, and the horn; then, as the helper learns from her decision, the vibraphone
J = 'decide'; tLk, tTeach = W(J, 'links', 'links them'), C(J, 'teaches')
click(tLk - 0.05, 0.022, P(1060)); horn(53, tLk + 0.1, 1.6, 0.026, P(1060)); horn(60, tLk + 0.55, 2.2, 0.022, P(1060))
vibe(65, tTeach + 0.6, 0.022, P(420)); vibe(72, tTeach + 0.85, 0.016, P(420))

# 7. Published, not pushed: B flat major. At the turn, home again, its chord; the push that doesn't happen, two arrows crossed out; and
#    his birth date hatched over for the alumni office
J = 'publish'; tNot, tNever = W(J, 'published', 'not pushed'), W(J, 'mask', 'never sees')
turn(J, BB9)
cross(tNot - 0.2, 0.015, P(613)); cross(tNot - 0.15, 0.015, P(1307))
hatch(tNever - 0.3, 0.011, P(1540))

# 8. Where it came from: G minor. At the turn, Rafael as white paper, the person's two notes; and the pen round "checked 2016"
J = 'source'; tChk = W(J, 'names', 'checked')
person(S0(J) + 0.4, 0.028, P(330))
ring(tChk, 0.7, 0.014, P(1400))

# 9. Checking the checkers: C minor. At the turn, Friday evening's chord; the one link that was wrong, a pen's cross; Mei's horn as she
#    unlinks it; and in the pause after the office's rule, this week's result ticked, with E flat major and a marimba note
J = 'friday'; tOne, tUnl, tWeek = W(J, 'wrong', 'one was'), W(J, 'wrong', 'Mei unlinks'), END(J, 'until', 0.4)
turn(J, CM9)
cross(tOne, 0.018, P(1130))
horn(48, tUnl + 0.1, 1.8, 0.024, P(940))
tick_(tWeek + 0.2, 0.016, P(850)); synth(EBMAJ9, tWeek - 0.2, 5.4); mallet(63, tWeek + 0.3, 0.024, P(1100))

# 10. Five questions: E flat major, the Friday chord fading under the first words. Each question as it's asked, a marimba note, rising
J = 'five'
for q, m in zip(['explain', 'undo', 'review', 'mask', 'publish'], [51, 53, 55, 58, 60]):
    mallet(m, C(J, q, -0.2), 0.026, P(600))

# 11. Explained and undone: B flat major, Friday evening. At the turn, home; the three parts, each on its own instrument: the rules'
#     marimba, the helper's vibraphone, the people's horn; and after the last words, the last chord, and the series' mark on the end card
J = 'end'; B = C(J, 'breath'); tLast = END(J, 'end', 0.2)
turn(J, BB9)
mallet(58, W(J, 'three', 'Rules', -0.1), 0.03, P(800)); vibe(65, W(J, 'three', 'AI', -0.1), 0.026, P(1150)); horn(62, W(J, 'three', 'People', -0.1), 2.0, 0.024, P(1520))
synth(BBADD9, tLast, TOT - tLast + 1.0)
mark(B + 1.0)
