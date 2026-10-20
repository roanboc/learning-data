# One person, many systems: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The palette is new for this film (PLAYBOOK.md: vary the sound itself, film to film): a reed organ holds the
# chords, both its ranks drawing on one bellows, so each chord swells in as the air comes and fades as it goes, with the slow beat of
# two reeds a hair apart; a soft horn carries the series' mark, one note, its octave, its fifth and the note again (1-8-5-1), a nod
# to the post horn of 1874, with its echo coming back off the valley; a harp is the roles, each on the note it has had since
# *One person, many roles*, so a role sounds the same wherever it's added; and a low flute is the person: whenever Linh stands in white
# paper as the person, it plays the same D and the A above it, whatever the chapter's key. The film starts in F major, in the valley of
# 1874, and ends in D major. The effects are the paper's, as in film 1: a pencil, a quill, a wet brush, a card or an envelope, a stamp,
# a few muffled keys; and the valley's own: the treaty's wax, a coin by each door, a pin.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the narration; nothing repeats in the background, and
#    where the picture repeats (the questions running down the registry's links), the sound plays the first round only.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#  - The one exception is feeling: when the application would make her a third number, a low, muted pulse (music.py's urgent())
#    rises under the stamp, leaning on the semitone, and fades as the four systems come in.
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
def END(sid, lid, off=0):
    """when a line's voice ends, as the film's sc.ends has it"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan

# ---- the film's instruments, all low-passed ----
# the music's levels: the organ sits about 21 dB under the voice, as in the other series' films, and the notes over it a little less.
# Each instrument is trimmed to come out as loud as its part in One person, many roles at the same gain (measured on its own, as
# integrated loudness): the organ as its chords, the horn as its clarinet, the harp as its plucked cello, the flute as its bowed one
REED, NOTE = 3.3, 1.5
TRIM = {'horn': 1.33, 'harp': 0.8, 'flute': 0.92}
# one cycle of a reed's tone, kept as a table: a strong fundamental and a long, falling row of harmonics, as a harmonium's reeds speak
_N = 4096
_TAB = (lambda p: sum(a * np.sin(2 * np.pi * (k + 1) * p + 0.4 * k) for k, a in enumerate([1, 0.62, 0.48, 0.30, 0.22, 0.14, 0.10, 0.07, 0.05])))(np.arange(_N + 1) / _N)
_TAB = _TAB / np.abs(_TAB).max()
def _reed(ph):
    p = (ph % 1.0) * _N; i = p.astype(np.int64); fr = p - i
    return _TAB[i] * (1 - fr) + _TAB[i + 1] * fr
def organ(ch, start, sec, g=0.03):
    """a held chord on a reed organ: both ranks draw on one bellows, so the chord swells in over about two seconds, grows a little
    while it's held, breathes with the treadles and fades as the air goes; the ranks are a hair apart, one each side, and beat
    slowly against each other; nothing above about 1.3 kHz"""
    x = tt(sec).astype(np.float64)
    e = np.clip(x / 1.8, 0, 1) ** 1.6 * np.clip((sec - x) / 2.6, 0, 1) * (1 + 0.14 * x / sec) * (1 + 0.05 * np.sin(2 * np.pi * 0.17 * x + start))
    for pan, det in ((-0.6, 0.9982), (0.6, 1.0018)):
        s = np.zeros_like(x)
        for k, m in enumerate(ch):
            ph = np.cumsum(mf(m) * det * (1 + 0.0003 * np.sin(2 * np.pi * (0.11 + 0.02 * k) * x + k))) / SR
            s += _reed(ph) * (0.8 if k == 0 else 1.0)
        put(filt((s * e / len(ch)).astype(np.float32), 'low', 1300), start, g * REED, pan)
def bed(keys, end, g=0.03):
    """the chapter's chords, each from its moment (a little early, so it has swelled by then) until a little after the next one starts"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        organ(ch, t0 - 1.2, t1 - t0 + 3.6, g)
def horn(m, start, sec, g=0.04, pan=0.0):
    """a soft horn, far off: it scoops up onto the note, its brass opens a little as it swells, a slow vibrato comes in late; and
    the valley gives it back, twice, fainter and duller each time, from the other side"""
    f = mf(m); x = tt(sec); fr = (1 - 0.022 * np.exp(-x / 0.05)) * (1 + 0.003 * np.sin(2 * np.pi * 4.8 * x) * np.clip((x - 0.45) / 0.5, 0, 1))
    ph = 2 * np.pi * np.cumsum(f * fr) / SR; op = 0.5 + 0.5 * np.clip(x / 0.25, 0, 1)
    s = np.sin(ph) + (0.45 * np.sin(2 * ph) + 0.22 * np.sin(3 * ph) + 0.10 * np.sin(4 * ph) + 0.04 * np.sin(5 * ph)) * op
    s = norm(filt((s * env(sec, 0.07, min(0.5, sec * 0.45))).astype(np.float32), 'low', 1500))
    g = g * NOTE * TRIM['horn']; put(s, start, g, pan)
    put(filt(s, 'low', 900), start + 0.42, g * 0.22, -0.5 - 0.3 * pan); put(filt(s, 'low', 600), start + 0.84, g * 0.08, 0.4)
def harp(m, start, g=0.03, pan=0.0, sec=2.6):
    """a harp, low-passed: a round note that rings and fades; a role arriving"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) * (1 / k ** 1.6) * np.exp(-x * (0.9 + 0.55 * k * k)) for k in range(1, 11))
    s = s * np.minimum(1, x / 0.003) + 0.05 * filt(noise(sec), 'band', (f * 2, f * 6)) * np.exp(-x * 60)
    put(norm(filt(s.astype(np.float32), 'low', 1700)), start, g * NOTE * TRIM['harp'], pan)
def flute(m, start, sec, g=0.03, pan=0.0):
    """a low flute: mostly breath and fundamental, a soft chiff as it speaks, a slow vibrato that comes in late"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0035 * np.sin(2 * np.pi * 4.6 * x) * np.clip((x - 0.5) / 0.7, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.04 * np.sin(3 * ph)
    br = filt(noise(sec), 'band', (f * 0.7, f * 2.5)) * (0.16 + 0.25 * np.exp(-x * 8))
    s = (s + br) * env(sec, 0.16, min(0.6, sec * 0.4)) * (1 + 0.05 * np.sin(2 * np.pi * 0.7 * x))
    put(norm(filt(s.astype(np.float32), 'low', 1400)), start, g * NOTE * TRIM['flute'], pan)
def person(s, g=0.026, pan=0.0):
    """the person: the flute's D, and the A above it, the same two notes wherever she stands in white paper"""
    flute(62, s, 3.0, g, pan); flute(69, s + 0.55, 2.5, g * 0.55, pan + 0.15)
# each role's note, the same in every chapter, and the same as in One person, many roles
ROLE = {'student': 50, 'applicant': 52, 'researcher': 55, 'tutor': 57, 'alumna': 62}
def role(r, s, g=0.03, pan=0.0):
    harp(ROLE[r], s, g, pan)
def mark(start, root=62, g=0.05):
    """the series' mark, 1-8-5-1, on the horn, over the harp's root"""
    for i, iv in enumerate([0, 12, 7, 0]):
        horn(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    harp(root - 12, start, g * 0.6); harp(root - 12, start + 1.26, g * 0.5)
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
def fly(s, sec, g=0.02, p0=-0.6, p1=0.6):
    """a breath of air that crosses the frame with something flying, from one side to the other"""
    x = tt(sec); a = filt(noise(sec), 'band', (160, 1000)) * np.sin(np.pi * x / sec) ** 2; p = p0 + (p1 - p0) * (0.5 - 0.5 * np.cos(np.pi * x / sec))
    X(a * np.sqrt(0.5 * (1 - p)), s, g, -1.0); X(a * np.sqrt(0.5 * (1 + p)), s, g, 1.0)
def stamp(s, g=0.075):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); s_knock(s + 0.01, g * 0.4, 0, 200)
def pat(s, g=0.02, pan=0.0):
    """a postage stamp pressed onto an envelope: a soft pat"""
    s_knock(s, g, pan, 210); x = tt(0.12); X(filt(noise(0.12), 'band', (300, 1600)) * np.exp(-x * 30), s, g * 0.5, pan)
def wax(s, g=0.014, pan=0.0):
    """a drop of sealing wax: a soft, low dab"""
    s_knock(s, g, pan, 170); x = tt(0.14); X(filt(noise(0.14), 'band', (200, 700)) * np.sin(np.pi * x / 0.14), s, g * 0.5, pan)
def seal(s, g=0.03, pan=0.0):
    """the treaty's seal pressed into its wax: a low press, and the wax giving under it"""
    s_knock(s, g, pan, 120); x = tt(0.32); X(filt(noise(0.32), 'band', (180, 760)) * np.sin(np.pi * x / 0.32) ** 1.5, s + 0.03, g * 0.7, pan)
def coin(s, g=0.016, pan=0.0):
    """a coin set down by a door: a small, dull ring, low-passed, and its knock on the step"""
    x = tt(0.5); c = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, a, d in ((1040, 1, 14), (1530, 0.5, 20), (1960, 0.25, 30)))
    X(norm(filt((c * np.minimum(1, x / 0.002)).astype(np.float32), 'low', 2400)), s, g, pan); s_knock(s, g * 0.6, pan, 300)
def door(s, g=0.022, pan=0.0):
    """a small door set in place: a low wooden knock, and the air it moves"""
    s_air(s - 0.12, 0.3, g * 0.5, pan, 120, 700); s_knock(s, g, pan, 150)
def pin(s, g=0.016, pan=0.0):
    """a pin pushed into the wall: a muffled tap and a small knock"""
    s_tap(s, g, pan); s_knock(s + 0.01, g * 0.5, pan, 330)

# chords (MIDI note numbers), low to high
FMAJ9 = [41, 48, 52, 55, 57, 64]; DM9 = [38, 45, 50, 53, 57, 64]; BBMAJ9 = [46, 53, 57, 60, 62]; F69 = [41, 48, 53, 55, 57, 62]; GM9 = [43, 50, 53, 57, 58]
BBMAJ7 = [34, 46, 50, 53, 57]; GM7D = [38, 50, 53, 55, 58]; CMAJ9 = [36, 43, 52, 55, 59, 62]; AM7 = [45, 52, 55, 60, 64]; G6 = [43, 50, 55, 59, 64]
EM7 = [40, 47, 55, 59, 62]; AM9 = [45, 52, 55, 60, 64, 71]; FMAJ7 = [41, 48, 52, 57, 60]; G7SUS = [43, 50, 53, 55, 60]; C69 = [36, 43, 48, 52, 57, 62]
EBMAJ7 = [39, 46, 50, 55, 58]; DMAJ9 = [38, 45, 54, 57, 61, 64]; BM7 = [47, 54, 57, 62, 66]; GMAJ9 = [43, 50, 54, 57, 59]; A69 = [45, 52, 54, 59, 61]
GMAJ7 = [43, 50, 54, 59, 62]; EM9 = [40, 47, 55, 59, 66]; A7SUS = [45, 52, 55, 57, 62]; GADD9 = [38, 43, 54, 57, 59, 62]; DMAJ7 = [38, 45, 54, 57, 61]
BM9 = [47, 54, 57, 61, 62]
# the post offices of 1874, where each stands across the valley (src/plan.js, M7_PO), and the four systems' cards
PO = [220, 540, 930, 1380, 1700, 1240, 690]; SYS = ['student', 'tutor', 'researcher', 'alumna']


# 1. A treaty for every pair: F major, the valley of 1874. A treaty pencilled between every pair of offices, and the first drops of
#    wax; a letter on its way, a stamp at each border; the treaty of Bern written, signed by twenty-one, and sealed; the old treaties
#    lifting away, the new one pinned up and the territory drawn round; the union's letter and its one stamp; a coin by each door;
#    the post office for the world that nobody built, sketched and crossed out; each office lifted in turn; the rules running out to
#    them; the letter's flight across the valley in the hush, and the series' mark, on the horn, under the title
J = 'bern'; B = C(J, 'breath'); tPair, tTr, tR, tPr = W(J, 'pairs', 'every pair'), W(J, 'pairs', 'postal treaty'), C(J, 'route'), W(J, 'route', 'its route')
tBern, t21, tSig, tOne = W(J, 'signed', 'in Bern'), W(J, 'signed', 'twenty-one'), W(J, 'signed', 'signed'), C(J, 'one')
tTer, tRate, tKept = W(J, 'one', 'postal territory'), W(J, 'one', 'one rate'), W(J, 'one', 'each kept')
tNob, tWorld, tEach, tRules, tE = W(J, 'own', 'Nobody'), W(J, 'own', 'for the world'), W(J, 'own', 'Each country'), W(J, 'own', 'shared the rules'), END(J, 'own')
bed([(S0(J), FMAJ9), (C(J, 'route', -0.3), DM9), (C(J, 'signed', -0.3), BBMAJ9), (tOne - 0.3, F69), (C(J, 'own', -0.3), GM9), (tE, FMAJ9), (B + 0.3, BBMAJ9)], E(J) + 1.0)
quill(tPair + 0.1, 4.0, 0.011, 0.0)
for k in range(3):
    wax(tPair + 0.1 + k * 0.17 + 0.6, 0.014, P([1310, 615, 810][k]))
knock(tTr, 0.016, P(960))
r0 = tR - 0.4; paper(r0 - 0.2, 0.024, P(220), 0.35)
for k, (t0, x) in enumerate([(r0, 220), (r0 + 1.45, 930), (r0 + 3.15, 1700)]):
    pat(t0 + 0.06, 0.02, P(x))
air(r0 + 0.1, 1.3, 0.012, P(575)); air(r0 + 1.8, 1.3, 0.012, P(1315))
knock(tPr, 0.016, P(960))
paper(tBern - 0.3, 0.034, 0.0, 0.6)
quill(tBern, 1.1, 0.014, P(820)); quill(tBern + 0.9, 0.9, 0.012, P(840))
quill(t21 - 0.1, tSig - t21 + 1.4, 0.011, P(1000))
seal(tSig + 1.5, 0.03, P(1300))
air(tOne + 0.2, 1.0, 0.016, 0.0); pin(tOne + 0.85, 0.016, 0.0)
ring(tTer - 0.3, 1.6, 0.014, 0.0); knock(tTer + 0.5, 0.016, P(960))
paper(tRate - 0.3, 0.026, P(400)); pat(tRate + 0.26, 0.022, P(470)); knock(tRate + 0.5, 0.016, P(400))
for i, x in enumerate(PO):
    t0 = tKept + 0.6 + i * 0.14; coin(t0, 0.014, P(x + 40)); coin(t0 + 0.24, 0.006, P(x + 40))
knock(tKept + 0.4, 0.016, P(1520))
air(tNob - 0.3, 1.1, 0.014, P(300)); paper(tNob + 0.75, 0.018, P(220), 0.3)
quill(tNob - 0.1, 1.6, 0.010, 0.0)
quill(tWorld + 0.3, 0.45, 0.016, 0.0); quill(tWorld + 0.6, 0.45, 0.016, 0.0); knock(tWorld + 0.2, 0.016, 0.0)
for i, x in enumerate(PO):
    knock(tEach + 0.2 + i * 0.16, 0.014, P(x), 200 + 12 * i)
air(tRules - 0.4, 1.4, 0.016, 0.0); knock(tRules + 0.2, 0.016, P(1300))
fly(tE + 0.1, 2.2, 0.02, P(220), P(1700)); paper(tE + 2.2, 0.016, P(1700), 0.3)
mark(B + 0.8)

# 2. Applying again: D minor, late 2025. Her name card; her two student records, each on the student's note, and the second one's
#    number stamped on; the pencil line between them, stopped by a cross, and its badge; the PhD application, on the applicant's
#    note; the arrow to the person it would create, the empty record, and the stamp over it, under the pulse; then the four systems,
#    each on its role's note
J = 'again'; tSt, tApp, tCre, tNob, tF = C(J, 'still'), W(J, 'still', 'application'), W(J, 'still', 'creates a person'), W(J, 'still', 'nobody looks'), C(J, 'four')
tL, tSec, tNum, tLnk, tTwo = C(J, 'last'), W(J, 'last', 'second student'), W(J, 'last', 'number'), W(J, 'last', 'linked'), W(J, 'last', 'the two')
bed([(S0(J), DM9), (tL - 0.3, BBMAJ7), (tSt - 0.3, GM7D), (tF - 0.2, F69)], E(J) + 1.0)
knock(W(J, 'today', 'Linh Nguyen', -0.2), 0.022, P(340))
paper(tL, 0.026, P(370)); role('student', tL + 0.1, 0.03, P(370))
paper(tSec - 0.2, 0.026, P(370)); role('student', tSec - 0.1, 0.028, P(370))
stamp(tNum + 0.06, 0.06)
quill(tLnk, 0.7, 0.014, P(630)); cross(tTwo, 0.016, P(648)); knock(tTwo + 0.4, 0.018, P(773))
paper(tApp - 0.3, 0.03, P(1530)); role('applicant', tApp - 0.2, 0.026, P(1530))
air(tCre, 0.6, 0.016, P(1360)); paper(tCre + 0.2, 0.024, P(1590)); knock(tCre + 0.3, 0.018, P(1360))
air(tCre + 0.6, 0.5, 0.014, P(1660))
knock(tNob, 0.018, P(1590))
urgent(tSt - 0.3, tF + 0.3, bpm=92, root=38, g=0.058, steps=(0, 0, 1, 0))
for i, word in enumerate(['student system', 'HR', 'research office', 'alumni office']):
    t0 = W(J, 'four', word); knock(t0 - 0.25, 0.016, P(270 + 460 * i), 220 + 20 * i); role(SYS[i], t0 - 0.15, 0.028, P(270 + 460 * i))

# 3. Four ways: C major, on Noor's wall. Her name; the four cards pinned up; the registry's card and its links in pencil, and the
#    first round of questions down them; the lakehouse's copy, and its chart, bar by bar; the master, and the person on the flute as
#    she's kept in one place; the central way's arrows out
J = 'ways'; tKn, tAsk, tGa, tRep, tBk, tCr = W(J, 'registry', 'knows'), W(J, 'registry', 'asks each'), W(J, 'copy', 'gathers'), W(J, 'copy', 'reports'), W(J, 'master', 'read back'), W(J, 'central', 'creates every')
bed([(S0(J), CMAJ9), (C(J, 'registry', -0.3), AM7), (C(J, 'copy', -0.3), FMAJ9), (C(J, 'master', -0.3), G6), (C(J, 'central', -0.3), EM7)], E(J) + 1.0)
knock(C(J, 'noor'), 0.022, P(240))
for i in range(4):
    pin(W(J, 'noor', 'four ways', -0.1 + i * 0.18), 0.014, P(720 + 340 * i))
quill(tKn - 0.2, 1.3, 0.012, 0.0)
for j in range(4):
    tap(tAsk + (0.5 + j * 0.18) / 0.7, 0.012, P(700 + 170 * j))
paper(tGa - 0.2, 0.024, 0.0); air(tGa, 0.8, 0.012, 0.0)
for k in range(3):
    tap(W(J, 'copy', 'reports', 0.1 + 0.15 * k), 0.012, P(1000 + 60 * k))
air(tBk - 0.3, 1.0, 0.014, 0.0); person(W(J, 'master', 'one place', -0.2), 0.022, 0.0)
air(tCr - 0.3, 1.0, 0.014, 0.0)

# 4. After the fact: A minor. The first two cards marked "already here", and "after the fact" under each; the third number neither
#    stops; the last two ticked, and what they cost
J = 'after'; tTwo, tFact, tDo, tEv = W(J, 'have', 'first two'), W(J, 'late', 'after the fact'), W(J, 'cost', 'last two'), W(J, 'cost', 'every system')
bed([(S0(J), AM9), (C(J, 'late', -0.3), FMAJ7), (C(J, 'cost', -0.3), DM9)], E(J) + 1.0)
for i, x in enumerate([720, 1060]):
    knock(tTwo + 0.1 + i * 0.25, 0.018, P(x), 230 + 20 * i); knock(tFact + i * 0.2, 0.014, P(x), 200)
knock(W(J, 'late', 'Neither', 0.2), 0.018, P(890))
for k, x in enumerate([1400, 1740]):
    knock(tDo + 0.1 + k * 0.2, 0.016, P(x)); tick_(tDo + 0.3 + k * 0.2, 0.016, P(x - 40))
knock(tEv + 0.2, 0.018, P(1570))

# 5. The lightest that works: from the question to C major. The coexistence card lifted forward; its diagram opening out into the
#    picture, a long breath, each system's chip landing on its own card on its role's note; the two doors where people are created,
#    each on its system's note; the links; the badge; Bern, small, with one far note of the horn; each system lifted; and the person,
#    on the flute, as they share her
J = 'lightest'; tW, tLk, tShare = C(J, 'which'), W(J, 'those', 'links are'), W(J, 'bern', 'share the person')
bed([(S0(J), G7SUS), (tW + 3.0, CMAJ9), (C(J, 'those', -0.3), AM7), (C(J, 'bern', -0.3), FMAJ9), (tShare - 0.2, C69)], E(J) + 1.0)
air(tW + 0.3, 0.6, 0.014, P(1400)); air(tW + 1.2, 1.8, 0.018, P(1100))
BIG = [310, 760, 1210, 1660]
for j in range(4):
    role(SYS[j], tW + 2.64 + 0.12 * j, 0.026, P(BIG[j]))
door(W(J, 'doors', 'the application'), 0.02, P(174)); role('applicant', W(J, 'doors', 'the application', 0.1), 0.024, P(174))
door(W(J, 'doors', 'HR'), 0.02, P(624)); role('tutor', W(J, 'doors', 'HR', 0.1), 0.024, P(624))
knock(W(J, 'doors', 'two doors', 0.3), 0.016, P(535)); knock(W(J, 'those', 'read the person', 0.3), 0.016, P(520))
air(tLk - 0.2, 0.8, 0.014, P(1400)); knock(tLk + 0.3, 0.016, P(1400)); knock(tLk + 1.1, 0.02, P(960), 260)
paper(W(J, 'bern', 'Like Bern', -0.3), 0.026, P(1600)); horn(62, W(J, 'bern', 'Like Bern', -0.1), 2.0, 0.026, P(1600))
for i, x in enumerate(BIG):
    knock(W(J, 'bern', 'Each system', 0.2 + i * 0.15), 0.014, P(x), 210 + 15 * i)
person(tShare, 0.024, 0.0)

# 6. Elsewhere: E flat major. "A heavier way"; the bank's panel and the country's, each set down; each hub, and the systems or
#    agencies that read it, one after another
J = 'elsewhere'
bed([(S0(J), EBMAJ7), (C(J, 'country', -0.3), GM9)], E(J) + 1.0)
knock(W(J, 'bank', 'heavier'), 0.018, P(960))
for i, x in enumerate([500, 1420]):
    paper(C(J, 'bank', 0.1 + i * 0.25), 0.026, P(x))
for i, (lid, hub, many, x) in enumerate([('bank', 'customer hub', 'every product', 80), ('country', 'population register', 'agencies', 1000)]):
    knock(W(J, lid, hub, -0.2), 0.02, P(x + 201), 200)
    for k in range(3):
        knock(W(J, lid, many, 0.1 + k * 0.25), 0.014, P(x + 590), 230 + 20 * k)

# 7. Search before create: D major. The application and its door, on the applicant's note; each field lit with a brush as it's
#    named; the search's line, its tag and its lens; the three lanes as they're said: a role added (a tick, and the applicant's note),
#    a card into Mei's queue, and a new person, given her first role
J = 'search'; tCh, tSea, tRo, tMe, tNw = W(J, 'door', 'one change'), W(J, 'door', 'searches'), W(J, 'clear', 'adds a role'), W(J, 'clear', "Mei's office"), W(J, 'nobody', 'new person')
bed([(S0(J), DMAJ9), (C(J, 'compares', -0.3), BM7), (C(J, 'clear', -0.3), GMAJ9), (C(J, 'nobody', -0.3), A69)], E(J) + 1.0)
paper(tCh - 0.4, 0.028, P(470)); role('applicant', tCh - 0.3, 0.024, P(470)); door(tCh, 0.02, P(790))
for word in ['the name', 'birth date', 'email', 'number from']:
    brush(W(J, 'compares', word, -0.1), 0.016, P(470), 0.4)
air(tSea - 0.1, 0.7, 0.016, P(1000)); knock(tSea + 0.2, 0.016, P(1015)); knock(tSea + 0.5, 0.014, P(1170), 190)
for lid, word, y in [('clear', 'clear match', 228), ('clear', 'likely', 428), ('nobody', 'nobody', 628)]:
    t0 = W(J, lid, word); air(t0 - 0.2, 0.6, 0.010, P(1200)); knock(t0, 0.014, P(1450), 260 - y // 10)
tick_(tRo, 0.016, P(1400)); role('applicant', tRo, 0.024, P(1320))
air(tMe, 0.6, 0.012, P(1250)); paper(tMe + 0.6, 0.02, P(1340), 0.3)
role('applicant', tNw, 0.024, P(1320))

# 8. Who may create a person: G major. The sheet set down; Mei's card; each system's row, on its role's note, and a tick for the two
#    that may create; Mei's office's bar, a brush, and her tick
J = 'rule'; tTh = W(J, 'add', 'already there')
bed([(S0(J), GMAJ7), (C(J, 'add', -0.3), EM9), (tTh - 0.2, A7SUS)], E(J) + 1.0)
paper(C(J, 'write', 0.2), 0.034, P(960), 0.6); knock(C(J, 'write', 0.8), 0.02, P(1675))
for i, (r, lid, word, off) in enumerate([('applicant', 'write', 'only the application', 0.2), ('tutor', 'write', 'HR', 0.1), ('researcher', 'add', 'research', 0.1), ('alumna', 'add', 'alumni', 0.1)]):
    t0 = W(J, lid, word, off); role(r, t0, 0.024, P(560))
    if i < 2:
        tick_(t0 + 0.3, 0.016, P(994))
brush(W(J, 'add', 'add roles'), 0.02, P(960), 0.8); tick_(tTh + 0.2, 0.018, P(890))

# 9. Found: D major, October 2026. Her application, on the applicant's note, and its fields typed in; the search's line to her, a tick
#    for each value that matches, and for the person found; the person's notes as she's found; the applicant's band painted in, its
#    note, and its chip; the stamp that would have made a third number lifting away; the tags
J = 'found'; tFi, tAppl, tNo = W(J, 'finds', 'finds her'), W(J, 'adds', 'applicant'), W(J, 'adds', 'No new number')
bed([(S0(J), DMAJ9), (C(J, 'finds', -0.3), GADD9), (C(J, 'adds', -0.3), A69), (tNo - 0.2, DMAJ7)], E(J) + 1.0)
paper(C(J, 'applies', -0.3), 0.03, P(1460)); role('applicant', C(J, 'applies', -0.2), 0.026, P(1460))
typing(W(J, 'applies', 'Linh applies'), 1.7, 0.011, P(1500), 8)
air(tFi, 0.8, 0.018, P(800))
for t0 in [tFi + 0.4, W(J, 'finds', 'birth date'), W(J, 'finds', 'same email'), W(J, 'finds', 'student number')]:
    tick_(t0, 0.015, P(1820))
tick_(tFi + 0.6, 0.016, P(1100)); person(tFi + 0.8, 0.024, P(560))
brush(tAppl - 0.1, 0.02, P(560), 0.6); role('applicant', tAppl, 0.03, P(560)); knock(tAppl + 0.2, 0.018, P(960))
air(tNo - 0.1, 1.0, 0.016, P(1724))
knock(tNo + 0.3, 0.018, P(1500)); knock(W(J, 'adds', 'nothing to merge', 0.2), 0.018, P(1500))

# 10. Kept apart: B minor. The other Linh's name card; the search's table laid down, and a tick or a cross for each value; the tag;
#     her own person, in white paper, given the applicant's note; her record, and her own number stamped on; the tag
J = 'apart'; tAn, tNp = W(J, 'other', 'another Linh'), W(J, 'only', 'new person')
bed([(S0(J), BM9), (C(J, 'born', -0.3), GMAJ7), (C(J, 'only', -0.3), EM9), (tNp - 0.2, A7SUS)], E(J) + 1.0)
paper(tAn - 0.1, 0.028, P(932)); knock(tAn, 0.02, P(1630))
tick_(tAn + 0.85, 0.016, P(956))
for word in ['another year', 'another email', 'never studied']:
    cross(W(J, 'born', word, 0.35), 0.015, P(956))
knock(W(J, 'only', 'name agrees'), 0.018, P(932))
air(tNp - 0.1, 0.9, 0.016, P(1660)); paper(tNp + 0.2, 0.024, P(1630)); role('applicant', tNp + 0.4, 0.026, P(1660))
knock(tNp + 0.6, 0.016, P(1630)); stamp(W(J, 'only', 'own number', 0.06), 0.06)

# 11. The person, published: C major. The product's card; its badge; each promise lit with a brush as it's said, and the platform's
#     lines with it; the platform's card, and its grant, each set down, and who may read it typed in; the synced table, its arrow,
#     and the application on the applicant's note, its arrow and its tag
J = 'product'; tCn, tVe, tNo, tSt, tAp = W(J, 'contract', 'contract'), W(J, 'contract', 'new version'), W(J, 'contract', 'nothing that reads'), W(J, 'synced', 'synced table'), W(J, 'synced', 'application')
bed([(S0(J), CMAJ9), (C(J, 'contract', -0.3), AM7), (C(J, 'tools', -0.3), FMAJ9), (C(J, 'synced', -0.3), G6)], E(J) + 1.0)
paper(W(J, 'behind', 'the person', -0.4), 0.03, P(840)); knock(W(J, 'behind', 'data product'), 0.018, P(1100))
brush(W(J, 'behind', 'owned by'), 0.016, P(900), 0.6)
paper(C(J, 'contract', -0.3), 0.026, P(1330)); brush(C(J, 'contract'), 0.014, P(1200), 0.6)
for t0 in [tCn, tVe, tNo]:
    brush(t0, 0.018, P(1100), 0.6)
knock(C(J, 'tools'), 0.014, P(1700))
paper(W(J, 'tools', 'governs', -0.3), 0.026, P(1330)); typing(W(J, 'tools', 'who may read'), 0.8, 0.011, P(1000), 5)
paper(tSt - 0.3, 0.026, P(1060)); air(tSt, 0.5, 0.014, P(790))
air(tAp, 0.5, 0.014, P(1340)); role('applicant', tAp + 0.1, 0.024, P(1630)); knock(W(J, 'synced', 'applicant waits'), 0.016, P(1630))

# 12. One person, shared: B flat major, the valley again; each office lifted, and the rules running out to them; the campus; each
#     system lifted, on its role's note; the person on the flute, shared; D major for the line, and the series' mark on the end card
J = 'shared'; B = C(J, 'breath'); tRu, tHe, tEa = W(J, 'bern', 'shared the rules'), C(J, 'here'), W(J, 'here', 'each system')
bed([(S0(J), BBMAJ9), (tHe - 0.6, FMAJ9), (C(J, 'idea', -0.3), DMAJ9)], TOT + 1.0)
for i, x in enumerate(PO):
    knock(W(J, 'bern', 'post office', 0.15 + i * 0.12), 0.013, P(x), 200 + 12 * i)
for i, x in enumerate(PO):
    tap(tRu + i * 0.08 + 0.95, 0.010, P(x))
air(tHe - 0.6, 1.1, 0.016, 0.0)
for i in range(4):
    role(SYS[i], tEa + 0.1 + i * 0.15, 0.024, P(270 + 460 * i))
person(W(J, 'here', 'one person'), 0.026, 0.0)
mark(B + 1.0)
