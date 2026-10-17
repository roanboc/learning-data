# A hub at work: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py). The
# palette is new for this film (PLAYBOOK.md: vary the sound itself, film to film), and it follows the film's three parts:
#  - a reed organ holds the chords, a working room's warmth; its bellows swell slowly, and its chords change with the narration;
#  - the rules are a felt marimba: round wooden notes when the rules sort the weekend, weigh a match or link on their own;
#  - the AI helper is a vibraphone, its motor slowly turning, when it drafts its note and when it learns;
#  - people deciding are a horn: when the badge says "for Mei", when Mei links the records, and when she unlinks the wrong one.
# The series' mark stays on its clarinet (one note, its octave, its fifth and the note again, 1-8-5-1), here in B flat, the film's home.
# The person's interval from One person, many roles (a D and the A above it) comes back on the marimba when Rafael stands in white paper.
# The effects are the office's: a muffled keyboard, a mouse's click, a card set down, a felt-tip pen, a breath of air.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the narration; nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#  - The one exception is feeling: on Friday, when one of the week's automatic links turns out wrong, a low, muted pulse (music.py's
#    urgent()) rises under the check, leaning on the semitone, and fades once Mei has unlinked it.
# And everything stays low and soft: knocks, paper, muffled keys, a pen, low notes, filtered below about 2.5 kHz.

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
BED, NOTE, FX = 1.75, 1.6, 2.0
def organ(ch, start, sec, g=0.03):
    """a reed organ's chord: two reeds a hair apart on every note, rich in harmonics but kept under about 1.1 kHz; it speaks softly,
    the bellows swell it a little, and it fades when the next chord has come in"""
    x = tt(sec); e = np.clip(x / 0.9, 0, 1) ** 1.6 * np.clip((sec - x) / 2.6, 0, 1); bel = 1 + 0.07 * np.sin(2 * np.pi * 0.11 * x + start)
    for pan, det in ((-0.6, 0.9982), (0.6, 1.0018)):
        s = np.zeros_like(x)
        for k, m in enumerate(ch):
            f = mf(m) * det; ph = 2 * np.pi * f * x + k
            s += sum(np.sin(h * ph) * (0.9 / h ** 1.15) for h in range(1, 9)) * (1.0 if k else 1.15)
        put(filt(filt((s / len(ch) * e * bel).astype(np.float32), 'low', 1100), 'high', 70), start, g * BED, pan)
def bed(keys, end, g=0.03):
    """the chapter's chords, each from its moment (a little early, so it has come in by then) until a little after the next one starts"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        organ(ch, t0 - 0.8, t1 - t0 + 3.2, g)
def mallet(m, start, g=0.03, pan=0.0, sec=1.6):
    """a felt marimba: the round fundamental, its fourth partial (two octaves up) dying fast, a felt attack; the rules at work"""
    f = mf(m); x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 2.6) + 0.22 * np.sin(2 * np.pi * f * 3.98 * x) * np.exp(-x * 11) + 0.05 * np.sin(2 * np.pi * f * 9.9 * x) * np.exp(-x * 26)
    put(norm(filt((s * np.minimum(1, x / 0.007)).astype(np.float32), 'low', 1500)), start, g * NOTE, pan)
def vibe(m, start, g=0.03, pan=0.0, sec=3.0):
    """a vibraphone, its motor slowly turning: a bar's pure tone, a little of its fourth and tenth partials, a tremolo; the AI helper"""
    f = mf(m); x = tt(sec); trem = 1 - 0.28 * (0.5 + 0.5 * np.sin(2 * np.pi * 4.6 * x))
    s = (np.sin(2 * np.pi * f * x) * np.exp(-x * 0.9) + 0.18 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 3.5) + 0.04 * np.sin(2 * np.pi * f * 10 * x) * np.exp(-x * 9)) * trem
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
def card(s, g=0.026, pan=0.0, sec=0.42):
    """a card set down: paper, then a soft knock"""
    x = tt(sec); X(filt(noise(sec), 'band', (220, 1600)) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan); s_knock(s + sec * 0.7, g * 0.5 * FX, pan, 210)
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a tag, a row or a chip set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.016, pan=0.0):
    """a muffled key"""
    s_tap(s, g * FX, pan)
def typing(s, sec, g=0.012, pan=0.0, n=5):
    """a few muffled keys, unevenly, while something is typed in"""
    for k in range(n):
        s_tap(s + sec * (k + 0.3 * np.sin(k * 2.3)) / n, g * (0.8 + 0.2 * (k % 2)) * FX, pan)
def click(s, g=0.02, pan=0.0):
    """a mouse button, pressed and let go: two small, dull clicks"""
    for d, gg in ((0.0, 1.0), (0.085, 0.6)):
        x = tt(0.03); X(norm(filt(noise(0.03), 'band', (500, 1800)) * np.exp(-x * 240)), s + d, g * gg * FX, pan)
def air(s, sec=0.7, g=0.018, pan=0.0):
    """a breath of air: a line drawn, a card sliding in, the camera going in"""
    s_air(s, sec, g * FX, pan, 160, 1000)
def wake(s, g=0.02):
    """the screen waking: a low fifth that rises and settles"""
    s_swell(mf(46), s, 1.8, g * FX)
def hatch(s, g=0.012, pan=0.0):
    """a field hatched over: five quick strokes"""
    for k in range(5):
        pen(s + k * 0.07, 0.06, g, pan)
def flow(s0, s1, g=0.010, p0=-0.35, p1=0.35, rate=11.0):
    """the weekend's changes through the rules, as the dabs on screen: a stream of tiny wooden beads, as many as the dabs in flight,
    and a breath under them"""
    r = np.random.default_rng(8); t0 = s0
    while t0 < s1:
        u = (t0 - s0) / max(0.01, s1 - s0); f = min(1, (t0 - s0) / 0.6 + 0.1, (s1 - t0) / 0.8)
        x = tt(0.05); fr = r.uniform(320, 640)
        X(norm(filt((np.sin(2 * np.pi * fr * x) * np.exp(-x * 120)).astype(np.float32), 'low', 1400)), t0, g * f * r.uniform(0.5, 1) * FX, lerp(p0, p1, u) + r.uniform(-0.15, 0.15))
        t0 += r.exponential(1 / rate)
    s_air(s0, s1 - s0, g * 1.2 * FX, 0.0, 200, 900)
lerp = lambda a, b, u: a + (b - a) * u

# chords (MIDI note numbers), low to high: B flat major is home
BB9 = [46, 53, 57, 60, 62]; GM9 = [43, 50, 57, 58, 62]; EBMAJ9 = [39, 46, 50, 53, 55]; CM9 = [36, 43, 51, 55, 58, 62]; FSUS = [41, 48, 53, 58, 60]
F = [41, 48, 53, 57, 60]; EBMAJ7 = [39, 46, 50, 55, 58]; CM7 = [36, 43, 51, 55, 58]; D7SUS4 = [38, 45, 50, 55, 60]; ABMAJ9 = [44, 51, 55, 58, 60]
ABMAJ7 = [44, 51, 55, 60, 63]; FM9 = [41, 48, 51, 55, 56]; BBSUS4 = [46, 53, 58, 60, 63]; DBMAJ7 = [37, 44, 48, 53, 56]; DM9 = [38, 45, 53, 60, 64]
BBMAJ7 = [46, 53, 57, 62]; GM7 = [43, 50, 53, 58, 62]; A7SUS4 = [45, 52, 55, 57, 62]; FMAJ9 = [41, 48, 52, 55, 57]; CSUS4 = [36, 43, 48, 53, 55]
FMAJ7 = [41, 48, 52, 57, 60]; DSUS4 = [38, 45, 50, 55, 57]; BBADD9 = [46, 53, 58, 60, 62]


# 1. Monday morning: B flat major. Her name card; the screen waking as she opens the hub, and a key pressed; the room hushed, the two
#    rules set down, then a breath as they fly into the hub and land as its rules, two marimba notes; LakeFusion's tags, the pen's
#    "or another hub", the last tag; the camera going in; the count of the weekend's changes, a few keys, and its four systems set
#    down; the series' mark under the title
J = 'monday'; B = C(J, 'breath'); tOpen = W(J, 'monday', 'opens'); land = C(J, 'hub', 0.2); tPush = END(J, 'lf', 0.5)
tN, tChg, tFour = W(J, 'weekend', 'twelve'), W(J, 'weekend', 'changes'), W(J, 'weekend', 'four systems')
bed([(S0(J), BB9), (C(J, 'rules', -0.3), GM9), (C(J, 'hub', -0.3), EBMAJ9), (C(J, 'lf', -0.3), CM9), (C(J, 'weekend', -0.3), FSUS), (B + 0.3, BB9)], E(J) + 1.0)
card(W(J, 'monday', 'Mei,', -0.2), 0.024, P(326))
tap(tOpen - 0.12, 0.018, P(470)); wake(tOpen, 0.02)
card(W(J, 'rules', 'its rules', -0.2), 0.026, P(1216)); card(W(J, 'rules', 'which value', -0.3), 0.026, P(1216))
air(land, 1.0, 0.02, P(1216)); mallet(58, land + 0.8, 0.03, P(1200)); mallet(65, land + 0.95, 0.026, P(1200))
knock(W(J, 'lf', 'LakeFusion', -0.2), 0.02, P(1015)); knock(W(J, 'lf', 'runs inside', -0.1), 0.02, P(1417), 260)
pen(W(J, 'lf', 'Another hub'), 0.9, 0.013, P(846)); knock(W(J, 'lf', 'Another hub', 0.6), 0.018, P(1358), 220)
air(tPush, 1.6, 0.016, 0.0)
typing(tN, tChg - tN + 0.2, 0.011, P(400), 6)
for i in range(4):
    knock(tFour - 0.3 + i * 0.15, 0.018, P(330), 220 + 20 * i)
mark(B + 0.8)

# 2. Rules act: G minor. The weekend's changes stream through the rules; the three outcomes set down; the five new people and the eight
#    too close to call, a marimba note each as it arrives; the badge "for Mei" on the horn; her inbox sliding in, its rows, and the pen
#    round the one someone is waiting on
J = 'rules'; tMost, tKnown, tNew, tClose, tFirst = C(J, 'most'), C(J, 'known'), C(J, 'new'), C(J, 'close'), C(J, 'first')
win = [(tMost + 0.1, tKnown + 2.4), (tNew - 1.3, tNew - 0.3), (tClose - 0.9, tClose + 0.1)]; TRAVEL = 1.5
bed([(S0(J), GM9), (C(J, 'known', -0.3), EBMAJ7), (C(J, 'new', -0.3), CM7), (C(J, 'close', -0.3), D7SUS4), (C(J, 'first', -0.3), GM9)], E(J) + 1.0)
flow(win[0][0] + 0.2, win[0][1] + TRAVEL, 0.010)
for j, t0 in enumerate([tMost + 0.7, tNew - 0.9, tClose - 0.5]):
    card(t0, 0.022, P(1570))
mallet(43, win[0][1] + TRAVEL, 0.03, P(1570), 2.2)
for i in range(5):
    mallet([55, 57, 58, 62, 65][i], win[1][0] + TRAVEL + i * (win[1][1] - win[1][0]) / 4, 0.022, P(1570))
for i in range(4):
    mallet([50, 51, 50, 51][i], win[2][0] + TRAVEL + i * (win[2][1] - win[2][0]) / 3, 0.02, P(1570))
horn(55, W(J, 'close', 'wait for Mei', -0.1), 1.8, 0.022, P(1700))
card(tFirst - 0.2, 0.028, P(1500)); air(tFirst - 0.2, 0.6, 0.014, P(1500))
for i in range(4):
    knock(tFirst + 0.2 + i * 0.12, 0.014, P(1500), 230 + 15 * i)
ring(W(J, 'first', 'waiting on'), 0.8, 0.014, P(1500))

# 3. Waiting, not a new number: E flat major. His name card; the pen's "like Linh, last year"; his application, tapped in on his phone;
#    the search, a breath while it looks; his two old records set down; the dashed line to them, and 74; the new number's stamp coming
#    down, crossed out; the badge "waits for Mei", on the horn
J = 'saturday'; tSearch, tLook, tLikely = C(J, 'search'), W(J, 'search', 'searches'), C(J, 'likely'); tNum, tMei = W(J, 'waits', 'new student'), W(J, 'waits', 'waits for')
bed([(S0(J), EBMAJ9), (C(J, 'search', -0.3), ABMAJ9), (C(J, 'likely', -0.3), FM9), (C(J, 'waits', -0.3), BBSUS4)], E(J) + 1.0)
card(W(J, 'applied', 'Rafael', -0.2), 0.024, P(280))
pen(W(J, 'applied', 'like Linh'), 0.9, 0.012, P(200))
card(W(J, 'applied', 'applied', -0.2), 0.024, P(1120)); typing(W(J, 'applied', 'applied', 0.1), 0.9, 0.011, P(380), 4)
air(tSearch + 0.2, tLook - tSearch + 0.6, 0.014, P(860))
knock(tLook + 0.1, 0.02, P(1540), 220); knock(tLook + 0.25, 0.02, P(1540), 240)
air(tLikely - 0.1, 0.8, 0.016, P(1170)); knock(W(J, 'likely', 'but not', -0.1), 0.018, P(1170), 260)
thud(tNum + 0.3, 0.05 * FX); cross(tNum + 0.4, 0.016, P(1660))
horn(58, tMei, 2.0, 0.022, P(1100))

# 4. Why 74: C minor. The table set down, its rows; the chart; each weight a marimba note as its bar grows, rising for what adds and
#    falling for what takes away; the pen round the dates and the closed email; 74; the score line drawn into the band where a person
#    decides, on the horn; then what would flip it, three notes up, and the pen round "linked by the rules"
J = 'why'; tWhy, t74 = C(J, 'why'), W(J, 'why', 'seventy'); tGiven, tFam, tLittle, tAway = W(J, 'names', 'given'), W(J, 'names', 'family'), W(J, 'dates', 'add a little'), W(J, 'email', 'takes')
tApart, tClosed, tBandW, tAgreed, tAsk = W(J, 'dates', 'one digit'), W(J, 'email', 'closed'), W(J, 'band', 'the band'), W(J, 'flip', 'agreed'), W(J, 'flip', 'without asking')
bed([(S0(J), CM9), (C(J, 'names', -0.3), ABMAJ7), (C(J, 'dates', -0.3), FM9), (C(J, 'email', -0.3), DBMAJ7), (C(J, 'band', -0.3), ABMAJ9), (C(J, 'flip', -0.3), EBMAJ9)], E(J) + 1.0)
card(tWhy - 0.4, 0.022, P(330)); card(tWhy + 0.4, 0.022, P(1340))
for t0 in (tGiven - 0.4, tFam - 0.4, C(J, 'dates', -0.1), C(J, 'email', -0.1)):
    knock(t0, 0.014, P(300), 230)
for t0, m in ((tGiven, 48), (tFam, 51), (tLittle - 0.3, 55), (tAway, 47)):
    mallet(m, t0 + 0.1, 0.03, P(1200))
ring(tApart, 0.6, 0.013, P(416)); ring(tApart + 0.3, 0.6, 0.013, P(576)); ring(tClosed, 0.7, 0.013, P(640))
knock(t74 - 0.2, 0.018, P(1420), 260)
air(tBandW - 0.3, 0.8, 0.014, P(1420)); horn(56, tBandW, 1.8, 0.022, P(1420))
for i, m in enumerate([55, 58, 63]):
    mallet(m, tAgreed - 0.2 + 0.25 * i, 0.02, P(1500 + 100 * i))
ring(tAsk, 0.8, 0.014, P(1760))

# 5. AI suggests: D minor. The helper's note on the vibraphone, a note for each line it drafts; the form, and his words typed in; the
#    old record set down; the dashed bracket, read as the same meaning, two notes; the buttons only a person presses, and the pen's
#    "for Mei to press"
J = 'ai'; tNote, tDraft, tForm, tWrote, tSame, tMean, tSug, tDec = C(J, 'note'), W(J, 'note', 'drafted'), C(J, 'form'), W(J, 'form', 'he wrote'), C(J, 'same'), C(J, 'meaning'), C(J, 'suggests'), W(J, 'suggests', "It doesn't")
bed([(S0(J), DM9), (C(J, 'form', -0.3), BBMAJ7), (C(J, 'same', -0.3), GM7), (C(J, 'meaning', -0.3), FMAJ9), (C(J, 'suggests', -0.3), A7SUS4)], E(J) + 1.0)
card(tNote - 0.4, 0.022, P(1370)); vibe(62, tNote - 0.2, 0.026, P(1370)); vibe(69, tNote + 0.1, 0.02, P(1400))
for t0, m in zip([tDraft - 0.3, tDraft + 0.5, tDraft + 1.3, tSame + 0.5, tSame + 1.5, tSug + 0.2], [62, 64, 65, 67, 69, 74]):
    vibe(m, t0, 0.018, P(1300))
card(tForm - 0.2, 0.022, P(446)); typing(tWrote + 0.2, 2.6, 0.011, P(446), 7)
card(tSame - 0.2, 0.022, P(446))
pen(tMean + 0.2, 0.7, 0.01, P(816)); vibe(65, tMean + 0.6, 0.02, P(816)); vibe(69, tMean + 0.85, 0.017, P(816))
knock(tDec - 0.2, 0.016, P(1000), 250); knock(tDec - 0.05, 0.016, P(1230), 230); pen(tDec + 0.2, 0.9, 0.011, P(1560))

# 6. People decide: F major. The pointer to Link, and her click, on the horn; her decision card sliding out of the screen; her reason
#    typed in; her name and the time, and a tick; unlink and the versions kept, set down; the line to the helper, a breath, and the
#    vibraphone as it learns
J = 'decide'; tLinks, tLk, tWhyD, tName, tTeach, tUnl, tVer = C(J, 'links'), W(J, 'links', 'links them'), W(J, 'links', 'writes'), W(J, 'keeps', 'her name'), C(J, 'teaches'), W(J, 'undo', 'unlinking'), W(J, 'undo', 'every version')
bed([(S0(J), FMAJ9), (C(J, 'keeps', -0.3), DM9), (C(J, 'teaches', -0.3), BBMAJ7), (C(J, 'undo', -0.3), CSUS4), (END(J, 'undo', -0.6), FMAJ7)], E(J) + 1.0)
click(tLk - 0.05, 0.022, P(1060)); horn(53, tLk + 0.1, 1.6, 0.026, P(1060)); horn(60, tLk + 0.55, 2.2, 0.022, P(1060))
card(tLk + 0.35, 0.026, P(1260)); air(tLk + 0.35, 0.6, 0.014, P(1260))
typing(tWhyD, 2.0, 0.011, P(1260), 8)
knock(tName - 0.2, 0.014, P(1100), 230); tick_(tName, 0.016, P(1680))
knock(tUnl - 0.3, 0.018, P(900), 250); knock(tVer - 0.1, 0.016, P(1330), 230); knock(tVer + 0.25, 0.016, P(1610), 250)
air(tTeach + 0.1, 0.8, 0.014, P(760)); vibe(65, tTeach + 0.6, 0.022, P(420)); vibe(72, tTeach + 0.85, 0.016, P(420))

# 7. Published, not pushed: B flat major. The four systems set down, and the feed; his change at its top; the push that doesn't happen,
#    two arrows crossed out; each system reading what concerns it, a soft key for each line; the student system's three ticks; the
#    alumni office's invite struck through, and its tick; the birth date hatched over, and the tag that says how
J = 'publish'; tPub, tNot, tReads = W(J, 'published', 'published'), W(J, 'published', 'not pushed'), W(J, 'published', 'reads')
tOld, tDeg, tStop, tNever, tNeed = W(J, 'app', 'old number'), W(J, 'app', 'degree'), W(J, 'alumni', 'stops'), W(J, 'mask', 'never sees'), W(J, 'mask', "doesn't need")
bed([(S0(J), BB9), (C(J, 'app', -0.3), GM7), (C(J, 'alumni', -0.3), EBMAJ9), (C(J, 'mask', -0.3), CM9)], E(J) + 1.0)
for i, x in enumerate([370, 1550, 370, 1550]):
    knock(S0(J) + 0.4 + i * 0.12, 0.016, P(x), 220 + 15 * i)
card(S0(J) + 0.3, 0.02, P(960)); mallet(58, tPub - 0.1, 0.024, P(960))
air(tNot - 0.25, 0.4, 0.012, P(600)); air(tNot - 0.25, 0.4, 0.012, P(1320)); cross(tNot - 0.2, 0.015, P(613)); cross(tNot - 0.15, 0.015, P(1307))
for i, x in enumerate([680, 1240, 680, 1240, 680]):
    tap(tReads + i * 0.12, 0.012, P(x))
for t0 in (tOld - 0.2, tOld + 0.5, tDeg):
    tick_(t0, 0.015, P(110))
pen(tStop, 0.5, 0.013, P(1450)); tick_(tStop + 0.4, 0.015, P(1290))
hatch(tNever - 0.3, 0.011, P(1540)); knock(tNeed - 0.1, 0.018, P(1550), 240)

# 8. Where it came from: G minor. Rafael in white paper, the person's two notes; the line to his record, and the record set down; each
#    value and where it came from, set down; the pen round "checked 2016"; the email and the application it came from; the runners-up
J = 'source'; tWhere, tSys, tChk, tEmail, tApp, tNewest = C(J, 'where'), W(J, 'names', 'student system'), W(J, 'names', 'checked'), C(J, 'email'), W(J, 'email', 'application'), W(J, 'email', 'newest')
tStays, tWin = W(J, 'typo', 'stays'), W(J, 'typo', "doesn't win")
bed([(S0(J), GM9), (C(J, 'names', -0.3), EBMAJ7), (C(J, 'email', -0.3), CM9), (C(J, 'typo', -0.3), DSUS4)], E(J) + 1.0)
person(S0(J) + 0.4, 0.028, P(330)); card(S0(J) + 0.4, 0.022, P(1240)); air(S0(J) + 0.9, 0.8, 0.014, P(520))
for t0 in (tWhere + 0.4, tWhere + 0.55, tWhere + 0.7):
    knock(t0, 0.013, P(820), 230)
for i, t0 in enumerate((tSys - 0.2, tSys, tSys + 0.2)):
    knock(t0, 0.015, P(1350), 240 + 10 * i)
ring(tChk, 0.7, 0.014, P(1400))
knock(tEmail + 0.1, 0.014, P(820), 230); knock(tApp - 0.1, 0.016, P(1380), 250)
knock(tNewest + 0.4, 0.012, P(1380), 220)
knock(tStays, 0.013, P(1300), 220)

# 9. Checking the checkers: C minor. Leila's name card; the check sliding out of her screen; the two records, and the rules' decision
#    hatched over; her ticks, one after another; then the one that was wrong, a pen's cross, and under it the pulse, until Mei's
#    horn unlinks it; the office's rule typed in, line by line; this week's result, ticked, and E flat major
J = 'friday'; tLeila, tChecks, tPair, tNotW, tSway = W(J, 'friday', 'Leila'), W(J, 'friday', 'checks fifty'), W(J, 'blind', 'each pair'), W(J, 'blind', 'but not'), W(J, 'blind', 'so she')
tOne, tUnl = W(J, 'wrong', 'one was'), W(J, 'wrong', 'Mei unlinks'); tStop, tMore, tAuto, tEvery, tUnt = C(J, 'stop'), W(J, 'stop', 'more than'), W(J, 'stop', 'automatic'), W(J, 'until', 'Every match'), W(J, 'until', 'until new')
tWeek = END(J, 'until', 0.4)
bed([(S0(J), CM9), (C(J, 'blind', -0.3), ABMAJ7), (C(J, 'wrong', -0.3), FM9), (tUnl + 0.6, EBMAJ7), (C(J, 'stop', -0.3), ABMAJ9), (C(J, 'until', -0.3), BBSUS4), (tWeek, EBMAJ9)], E(J) + 1.0)
card(tLeila - 0.2, 0.024, P(320))
card(tChecks - 0.3, 0.028, P(1260)); air(tChecks - 0.3, 0.6, 0.014, P(1260))
knock(tPair - 0.2, 0.016, P(900), 230); knock(tPair - 0.05, 0.016, P(1100), 250); hatch(tNotW - 0.1, 0.01, P(1270))
for i in range(0, 50, 2):
    if i != 22:
        tick_(tSway + i * 0.05, 0.008, P(840 + (i % 10) * 88))
cross(tOne, 0.018, P(1130))
urgent(tOne - 0.3, tUnl + 1.4, bpm=96, root=36, g=0.068, steps=(0, 0, 1, 0))
ring(tUnl, 0.7, 0.014, P(1130)); horn(48, tUnl + 0.1, 1.8, 0.024, P(940)); knock(tUnl + 0.2, 0.016, P(940), 230)
card(tStop - 0.1, 0.024, P(1260))
for t0, n in ((tMore - 0.3, 6), (tAuto, 5), (tEvery - 0.2, 6), (tUnt - 0.1, 5)):
    typing(t0, 0.9, 0.01, P(1100), n)
tick_(tWeek + 0.2, 0.016, P(850)); mallet(63, tWeek + 0.3, 0.024, P(1100))

# 10. Five questions: E flat major. The sheet set down; a university, a hospital and a bank, a knock each; five places numbered; then
#     each question as it's asked, a marimba note, rising
J = 'five'; tAsk, tFive = C(J, 'ask'), W(J, 'ask', 'five questions')
QS = ['explain', 'undo', 'review', 'mask', 'publish']
bed([(S0(J), EBMAJ9), (C(J, 'explain', -0.3), CM7), (C(J, 'undo', -0.3), ABMAJ9), (C(J, 'review', -0.3), FM9), (C(J, 'mask', -0.3), GM7), (C(J, 'publish', -0.3), BBSUS4)], E(J) + 1.0)
card(tAsk - 0.5, 0.026, P(960))
for k, (word, x) in enumerate([('a university', 360), ('a hospital', 560), ('a bank', 730)]):
    knock(W(J, 'ask', word, -0.15), 0.018, P(x), 220 + 20 * k)
for i in range(5):
    tap(tFive + i * 0.12, 0.011, P(300))
for i, (q, m) in enumerate(zip(QS, [51, 53, 55, 58, 60])):
    mallet(m, C(J, q, -0.2), 0.026, P(600))

# 11. Explained and undone: B flat major, Friday evening. The three parts, each on its own instrument: the rules' marimba, the helper's
#     vibraphone, the people's horn; the line, and the series' mark on the end card
J = 'end'; B = C(J, 'breath')
bed([(S0(J), BB9), (C(J, 'end', -0.3), EBMAJ9), (B + 0.3, BBADD9)], TOT + 1.0)
mallet(58, W(J, 'three', 'Rules', -0.1), 0.03, P(800)); vibe(65, W(J, 'three', 'AI', -0.1), 0.026, P(1150)); horn(62, W(J, 'three', 'People', -0.1), 2.0, 0.024, P(1520))
air(C(J, 'end', -0.1), 1.0, 0.014, P(1190))
mark(B + 1.0)
