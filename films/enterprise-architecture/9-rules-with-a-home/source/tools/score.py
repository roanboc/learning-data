# Rules with a home: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for Tartu today, soft reed pads in G-flat and a low tuned
# bell for the population register, which rings each time the register answers an office that asks (no borrowed Estonian
# instruments: the story is told in the series' own voice). Then nylon-string plucks and a soft flute over warm pads, here in D-flat
# major, for the present, and the series' own mark, four notes rising 1-3-5-8, on the flute and the nylon string together, at the
# title and the end. The nightly script is the film's one error: a low, muted pulse rises under it, in B-flat minor, one beat for
# every second night it writes to the queue nothing reads, and fades as it's found on the wall. The register's bell comes back,
# softly, wherever something finds its one home: Tartu asked once, in chapter 4; and at the end, as the benefit is paid, as
# Tomás's note gets its answer, and under the end card.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the chapters; nothing repeats in the background. The
#    asks and answers on X-Road, and the reading crossing the wall, repeat in the picture; the sound marks only their first round.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: wooden knocks, paper, muffled keys, low felt notes, filtered below about 2.5 kHz. The bell and
# the nylon string are played with their tops taken off, at 2.2 kHz; the reed pads' highest partials stay under it.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)

# ---- the series' instruments, all low-passed ----
def nylon(m, start, g=0.04, pan=0.0, sec=1.8):
    """a nylon string: a few harmonics that fade from the top, warm and short"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.4) * np.exp(-x * (1.2 + 1.6 * k)) for k in range(1, 8))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2200)), start, g, pan)
def bell(m, start, g=0.03, pan=0.0, sec=3.6):
    """the register's bell, for Tartu, and wherever something finds its one home: a low tuned bell, its partials a little apart
    (the hum an octave down, the minor third above), its top taken off"""
    f = mf(m); x = tt(sec)
    parts = ((0.5, 0.9, 0.5), (1, 0.75, 1), (1.19, 0.5, 0.4), (1.5, 0.42, 0.3), (2.0, 0.34, 0.3), (2.74, 0.2, 0.16), (3.0, 0.16, 0.12))
    s = sum(np.sin(2 * np.pi * f * r * x + r) * np.exp(-x / (sec * d)) * a for r, d, a in parts)
    put(norm(filt((s * np.minimum(1, x / 0.006)).astype(np.float32), 'low', 2200)), start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a note arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pencil(s, g=0.02, pan=0.0, sec=0.5):
    """a pencil on paper: a soft, short scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec), s, g, pan)
def press(s, g=0.1):
    """a stamp or a confirmation: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03, tone='warm'):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, tone)
def air(s, sec=0.9, g=0.03, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g, pan, 140, 900)
def rise(s, sec=1.2, g=0.03):
    """the wall between the network and retail, drawn down the frame: a low roll that grows with it and settles"""
    x = tt(sec); X(filt(noise(sec), 'low', 220) * np.sin(np.pi * x / sec) ** 1.5, s, g)
def crack(s, g=0.03, pan=0.0):
    """day one's rule, cracking in two: a short, dry split, low and soft"""
    x = tt(0.32); X(norm(filt(noise(0.32), 'band', (180, 1500)) * np.exp(-x * 14) * (1 + 0.5 * np.sin(2 * np.pi * 31 * x))), s, g, pan)
    s_knock(s + 0.02, g * 0.6, pan, 170)
pan_x = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.95))   # where a thing sits across the frame, as a pan

# chords (MIDI note numbers): G-flat for Tartu, on reed pads; D-flat major and its neighbours for the present; B-flat minor for the
# script that writes to nothing, and A-flat with its fourth, which shares its notes with both D-flat and G-flat, for questions
GBMAJ9 = [42, 49, 53, 56, 58]; EBM9 = [39, 46, 49, 53, 54]; BMAJ7 = [47, 54, 58, 63]; DBSUS4 = [37, 44, 49, 54, 56]
DBMAJ9 = [37, 44, 48, 51, 53]; BBM9 = [46, 53, 56, 60, 61]; FM7 = [41, 48, 51, 56]; ABSUS4 = [44, 51, 56, 61]; DBMAJ7 = [37, 44, 48, 53]
BBM = [46, 53, 58, 61]; GBMAJ7 = [42, 49, 53, 58]; EBM7 = [39, 46, 49, 54]
def mark(start, root=49, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)


# 1. Once only: reed pads in G-flat, from the dawn over Tartu to the title. A swell as the window lights for the birth; air as the
#    record rises to the register, and the bell as it's entered. A muffled key as the phone appears and as the offer is tapped; paper
#    for the application they never made. Air as the camera lifts to the offices; a knock for each office as it arrives, softer for
#    the unnamed; air as the roads are drawn, and a knock for X-Road. For each office's first ask, a muffled key, and the bell as the
#    register answers it, the named two first, then the others. A low felt note for "not asked again". Paper for the second database
#    nobody may build, and a low note as it's crossed out; paper for the list of databases, a muffled key for each line. The bell for
#    "one home", a knock for its owner, air for "asked once", and the bell twice, with a swell, for "once only". The bell under the
#    register once more as the breath begins; then D-flat, and the mark under the title
K = 'tartu'
bed(K, [GBMAJ9], 0, cq(K, 'asks'), g=0.026, tone='reed', bassg=0.016)
bed(K, [EBM9, BMAJ7], cq(K, 'asks'), cq(K, 'link'), g=0.026, tone='reed', bassg=0.016)
bed(K, [GBMAJ9], cq(K, 'link'), cq(K, 'breath'), g=0.026, tone='reed', bassg=0.016)
swell([42, 49, 54, 58], W(K, 'born', 'born', -0.4), 3.0, 0.016, 'reed')
ent = W(K, 'born', 'entered'); air(ent, 1.6, 0.016, 0.2); bell(61, ent + 1.55, 0.02, -0.4)
tap(W(K, 'email', 'the parents', -0.4), 0.012, 0.0); tap(W(K, 'email', 'accept it'), 0.014, 0.0)
paper(C(K, 'never', -0.2), 0.03, -0.45, 0.5)
tOut = W(K, 'asks', 'No office', -0.5); air(tOut, 1.6, 0.02)
for i, x in enumerate([740, 1200]):
    knock(tOut + [0.5, 0.8][i], 0.016, pan_x(x))
for i, (x, y) in enumerate([[330, 282], [220, 382], [330, 482], [1590, 282], [1700, 382], [1590, 482]]):
    s_knock(tOut + 1.0 + (i % 3) * 0.12 + (0.06 if i > 2 else 0), 0.008, pan_x(x), 220 + 12 * (i % 3))
tAsk = W(K, 'asks', 'Each one asks'); air(tAsk + 0.1, 1.4, 0.014)
knock(W(K, 'asks', 'over X-Road', -0.1), 0.016, 0.0)
for i, (x, m) in enumerate(zip([740, 1200, 330, 220, 330, 1590, 1700, 1590], [54, 58, 61, 63, 61, 66, 63, 58])):
    a0 = tAsk + 1.3 + i * 0.41
    tap(a0, 0.008 if i < 2 else 0.005, pan_x(x)); bell(m, a0 + 1.2, 0.016 if i < 2 else 0.009, pan_x(x) * 0.6)
soft(54, W(K, 'asks', 'parents', -0.2), 0.016, 0.6)
tLw = W(K, 'law', 'second database'); paper(tLw - 0.3, 0.026, -0.7, 0.45); soft(42, tLw + 0.5, 0.02, -0.7)
tLs = W(K, 'law', 'listed'); paper(tLs - 0.3, 0.028, -0.6, 0.5)
for k in range(3):
    tap(tLs + 0.1 + k * 0.45, 0.01, -0.6)
bell(54, W(K, 'link', 'one home', -0.1), 0.02, 0.0); knock(W(K, 'link', 'one owner', -0.1), 0.016, 0.0)
air(W(K, 'link', 'asked for once', -0.2), 0.9, 0.014, 0.4)
tOnly = W(K, 'link', 'once only', -0.2); bell(61, tOnly, 0.022, 0.0); bell(66, tOnly + 0.35, 0.016, 0.1)
swell([42, 49, 54, 58, 61], tOnly, 3.0, 0.016, 'reed')
B = C(K, 'breath'); bell(54, B + 0.4, 0.014, -0.2)
bed(K, [DBMAJ9], cq(K, 'breath') + 0.4, None, g=0.03, tone='warm', bassg=0.022)
mark(G(K, 'breath', 1.6), 49)
# 2. The bill from day one: warm pads in D-flat, and B-flat minor through June. Paper as Tomás's note goes up, and air as it moves
#    to the corner; a knock for day one's rule and for the bill, and a low note as it's flagged wrong. A knock for the household;
#    a pencil as June is drawn day by day; a low note as the lights go out for the three weeks away, and a muffled key as the meter
#    stops. A pencil as the estimate is drawn from last June, and a knock and a nylon note for its four hundred and twelve dollars
#    eighty. A muffled key as the meter comes back, air as its stored readings fly to June, and a muffled key as they land; a nylon
#    note for "arrived". Air as the line goes back to the bill and stops, a low note for the cross, and a press for "never corrected"
L = 'bill'
bed(L, [DBMAJ9, GBMAJ9], 0, cq(L, 'away'))
bed(L, [BBM9, EBM9, ABSUS4], cq(L, 'away'), cq(L, 'never'))
bed(L, [BBM9], cq(L, 'never'), None)
paper(S0(L) + 0.3, 0.035, 0.0, 0.6); air(W(L, 'note', 'On day one', -0.7), 1.5, 0.014, 0.4)
knock(W(L, 'note', 'shown one', -0.2), 0.02, -0.2); knock(C(L, 'flag', -0.1), 0.02, 0.3); paper(C(L, 'flag'), 0.018, 0.3, 0.4)
soft(41, W(L, 'flag', 'wrong', -0.1), 0.022, 0.3)
knock(W(L, 'away', 'household', -0.1), 0.018, -0.45)
pencil(W(L, 'away', 'In June', -0.1), 0.012, 0.15, 1.4)
soft(37, W(L, 'away', 'three weeks', -0.2), 0.02, -0.45); tap(W(L, 'away', 'stopped', 0.2), 0.012, -0.45)
pencil(W(L, 'est', 'last year', -0.2), 0.012, 0.15, 1.6)
tAm = W(L, 'est', 'four hundred'); knock(tAm + 0.2, 0.018, 0.1); nylon(56, tAm + 0.25, 0.018, 0.1)
tap(C(L, 'stored', -0.1), 0.012, -0.45)
tBs = W(L, 'stored', 'sent the readings'); air(tBs + 0.2, 2.2, 0.014, -0.15)
for i in range(0, 21, 3):
    tap(tBs + 0.2 + i * 0.07 + 0.9, 0.007, 0.0 + 0.02 * i)
nylon(61, W(L, 'never', 'arrived', -0.2), 0.018, 0.4)
tNc = W(L, 'never', 'never corrected'); air(tNc - 0.9, 0.8, 0.014, 0.3); soft(39, tNc, 0.022, 0.3); press(tNc + 0.15, 0.022)
# 3. A rule on the wall: B-flat minor. A knock as the script appears on the wall, a muffled key for "written by metering"; paper for
#    the readings it looks through, air as it scans them, and a nylon note for each pair it finds. A knock for the billing system and
#    for its queue, and a muffled key as each of the first two bills lands. Air as the new billing system takes the old one's place,
#    and a knock as it lights; a low note as the old queue's line is cut. Then the error: the muted pulse, leaning on the semitone,
#    one beat for every second night the script writes to the queue nothing reads, a muffled key on the nights between, so each
#    bill that flies has its sound; a press as the count reads "corrected nothing", a low note at nineteen hundred. A low roll as the
#    wall and its two sides are drawn, the pulse fading under it, and a muffled key for each side's question
S = 'script'
bed(S, [BBM9, GBMAJ9], 0, cq(S, 'march'), g=0.036)
bed(S, [EBM9, BBM], cq(S, 'march'), cq(S, 'wall'), g=0.034)
bed(S, [GBMAJ7], cq(S, 'wall'), None, g=0.034)
knock(S0(S) + 0.3, 0.02, 0.0); tap(W(S, 'existed', 'analyst', -0.1), 0.012, 0.0)
paper(C(S, 'found', -0.5), 0.026, -0.55, 0.5); air(W(S, 'found', 'estimates', -0.3), 1.6, 0.012, -0.4)
tAc = W(S, 'found', 'actual reading'); nylon(53, tAc + 0.4, 0.016, -0.55); nylon(56, tAc + 0.7, 0.016, -0.55)
tQ = W(S, 'found', 'queued'); knock(tQ - 0.2, 0.018, 0.5); knock(tQ - 0.05, 0.014, 0.5)
for d in (0.1, 0.35):
    tap(tQ + d + 0.9, 0.01, 0.5)
tNs = W(S, 'march', 'new system'); air(tNs - 0.5, 1.4, 0.016, 0.5); knock(tNs + 0.6, 0.016, 0.5)
soft(40, W(S, 'march', 'nothing reads', -0.2), 0.022, 0.5)
tC_ = C(S, 'clean'); per = 0.84
urgent(tC_, C(S, 'wall', 3.0), bpm=60 / per, root=41, g=0.038, fade=2.6, steps=(0, 0, 1, 0))
press(W(S, 'clean', 'corrected nothing'), 0.022); soft(37, W(S, 'clean', 'nineteen hundred'), 0.02, 0.5)
rise(C(S, 'wall', -0.5), 1.4, 0.03)
tNi = W(S, 'wall', 'neither side'); tap(tNi - 0.3, 0.012, -0.28); tap(tNi - 0.1, 0.012, 0.28)
# 4. Five places, no home: D-flat and B-flat minor. Paper for each of the five places the rule is written, from left to right; a
#    nylon note as the regulator's code says why, and a muffled key for each that says how; a low note for the empty place where its
#    home should be, and air as the lines reach for it. Reed pads and the bell as Tartu's register appears beside it, asked once,
#    and the bell again for "once only"
F = 'five'
bed(F, [DBMAJ9, BBM9], 0, cq(F, 'once'))
bed(F, [GBMAJ9], cq(F, 'once'), None, g=0.03, tone='reed', bassg=0.018)
for i, t0 in enumerate([S0(F) + 0.5, W(F, 'where', 'retail code'), W(F, 'where', 'settings'), W(F, 'where', 'notes'), W(F, 'where', 'spreadsheet')]):
    paper(t0 - 0.15, 0.024, pan_x(250 + i * 352), 0.45)
nylon(58, W(F, 'how', 'says why', -0.1), 0.018, pan_x(602))
for i in (0, 2, 3, 4):
    tap(W(F, 'how', 'each say how', 0.1 + 0.12 * max(0, i - 1)), 0.01, pan_x(250 + i * 352))
tNone = W(F, 'how', 'None of them'); soft(39, tNone - 0.1, 0.022, -0.1); air(tNone - 0.1, 1.0, 0.012, -0.1)
bell(54, W(F, 'once', 'Tartu', -0.3), 0.018, 0.5); bell(61, W(F, 'once', 'once only', -0.2), 0.02, 0.5)
# 5. Two rules, not one: D-flat, settling in the breath. A knock as day one's rule is set down on the wall; a dry crack as it splits,
#    and air as its halves part. A knock for each of the two rules, on its side, a pencil as each is written, and a knock and a nylon
#    note for each owner. Air as the gate opens, and again as the reading crosses through it; paper for the agreed list, and a nylon
#    note as "replaced readings" lights; a low note where the script once reached across, a muffled key for "unseen"; air again as
#    the reading crosses in the breath
P = 'split'
bed(P, [DBMAJ9, ABSUS4, GBMAJ9], 0, cq(P, 'breath'))
bed(P, [DBMAJ9], cq(P, 'breath'), None, g=0.034)
knock(S0(P) + 0.2, 0.018, 0.0)
tTw = W(P, 'two', 'two rules'); crack(tTw - 0.35, 0.03, 0.0); air(tTw, 1.0, 0.014)
knock(tTw + 0.4, 0.018, -0.5); knock(tTw + 0.55, 0.018, 0.5)
pencil(W(P, 'net', 'an estimate', -0.1), 0.01, -0.5, 2.6); pencil(W(P, 'ret', 'a bill', -0.1), 0.01, 0.5, 2.2)
tG = W(P, 'net', 'Grace'); knock(tG - 0.1, 0.014, -0.5); nylon(61, tG, 0.018, -0.5)
tH = W(P, 'ret', 'head of retail'); knock(tH - 0.1, 0.014, 0.5); nylon(65, tH, 0.018, 0.5)
tX = C(P, 'cross'); air(tX - 0.3, 0.8, 0.014); air(tX + 0.6, 2.2, 0.012, 0.0)
tL = W(P, 'cross', 'agreed list'); paper(tL - 0.5, 0.026, 0.0, 0.5); nylon(68, tL + 0.7, 0.016, 0.0)
soft(42, W(P, 'cross', 'the script', -0.3), 0.016, 0.0); tap(W(P, 'cross', 'unseen', -0.2), 0.01, 0.0)
import math as _m
k_ = _m.ceil((C(P, 'breath') - tX - 0.6) / 2.6); air(tX + 0.6 + k_ * 2.6, 2.2, 0.012, 0.0)
# 6. Where a rule comes from: E-flat minor to A-flat with its fourth. Air as the two rules move down; a knock and a nylon note, rising,
#    for each kind of reason; a knock and a nylon note for the metering rules and for the regulator's retail code. A low note as a
#    rule loses its reason, and another as it loses its owner. Then Ama: a knock for day one's draft, a muffled key for its goal, a
#    pencil as the goal is struck out, and a press and a nylon note as it becomes an obligation
Y = 'why'
bed(Y, [EBM9, GBMAJ9, BBM9, ABSUS4])
air(S0(Y) + 0.1, 1.4, 0.012)
for word, x, m in [('a regulation', 420, 53), ('a principle', 960, 56), ('service level', 1500, 58)]:
    t0 = W(Y, 'reason', word, -0.1); knock(t0, 0.014, pan_x(x)); nylon(m, t0 + 0.05, 0.016, pan_x(x))
for word, x, m in [('metering rules', 480, 61), ('retail code', 1440, 65)]:
    t0 = W(Y, 'these', word, -0.3); knock(t0, 0.016, pan_x(x)); nylon(m, t0 + 0.3, 0.018, pan_x(x))
soft(39, W(Y, 'safe', 'no reason', -0.2), 0.02, -0.5); soft(37, W(Y, 'safe', 'no owner', -0.2), 0.02, 0.5)
knock(W(Y, 'ama', 'Fair, accurate', -0.3), 0.018, 0.5); tap(W(Y, 'ama', 'goals', -0.6), 0.012, 0.5)
pencil(W(Y, 'ama', 'goals', -0.1), 0.012, 0.5, 0.4)
tOb = W(Y, 'ama', 'obligation'); press(tOb - 0.15, 0.02); nylon(61, tOb - 0.1, 0.018, 0.5)
# 7. What a rule is about: D-flat and F minor. A knock for retail's rule; a knock for each fact it builds on, and a muffled key for
#    each concept beneath them; a nylon note as each concept is named, rising. A low roll as the wall and its sides come back; air and a
#    knock for each concept as it becomes a data object on its side, and a muffled key as the estimate becomes part of the reading,
#    with a nylon note for "actual or estimated". A muffled key and a knock for each of the industry's words; a swell for the
#    utility's own
A = 'about'
bed(A, [DBMAJ9, FM7, GBMAJ9, ABSUS4])
knock(S0(A) + 0.3, 0.023, 0.0)
tF = W(A, 'words', 'on facts')
for i, x in enumerate([360, 960, 1560]):
    knock(tF + i * 0.2, 0.018, pan_x(x))
tCc = W(A, 'words', 'on concepts')
for j, x in enumerate([290, 650, 1010, 1520]):
    tap(tCc + j * 0.15, 0.012, pan_x(x))
for word, x, m in [('a reading', 650, 56), ('an estimate', 1010, 58), ('a bill', 1520, 61), ('a connection point', 290, 65)]:
    nylon(m, W(A, 'terms', word, 0.1), 0.016, pan_x(x))
rise(C(A, 'objects', -0.3), 1.2, 0.026)
tDo = W(A, 'objects', 'data object'); air(tDo - 0.6, 1.4, 0.018)
for k, x in enumerate([470, 470, 1450]):
    knock(tDo - 0.6 + k * 0.25 + 1.0, 0.016, pan_x(x))
tap(tDo + 1.5, 0.013, -0.5); nylon(56, tDo + 1.45, 0.014, -0.5)
for t0 in (C(A, 'cim', 0.6), W(A, 'cim', 'usage point', -0.2)):
    tap(t0, 0.013, -0.5); knock(t0 + 0.05, 0.013, -0.5)
swell([37, 44, 49, 53], W(A, 'own', 'own words', -0.2), 3.0, 0.016)
# 8. What the process expects: G-flat to A-flat with its fourth. A knock for each step of meter to cash as it arrives, and a soft
#    knock for each rule; a nylon note as each is attached to its step. Air as a rule is pushed inside the step, a low note as it's
#    crossed out, a muffled key for "attached, not inside". Air as retail's side steps back and the rules fold; a pencil for the
#    bracket; a knock for the service level's clock, a muffled key for each of the steps; a knock and a nylon note for the other rule.
#    For each expectation, a knock as it arrives, and air and a nylon note, rising, as the step hands it down
X_ = 'expect'
bed(X_, [GBMAJ9, DBMAJ9, EBM9, ABSUS4])
tMc = W(X_, 'step', 'meter to cash')
for i, x in enumerate([495, 1255, 1665]):
    knock(tMc - 0.2 + i * 0.18, 0.018, pan_x(x))
knock(S0(X_) + 0.4, 0.013, -0.5); knock(S0(X_) + 0.6, 0.013, 0.5)
nylon(61, W(X_, 'step', "network's", -0.1), 0.016, -0.5); nylon(65, W(X_, 'step', "retail's", -0.1), 0.016, 0.3)
air(W(X_, 'inside', 'Attached,', -0.2), 1.1, 0.016, -0.3); soft(39, W(X_, 'inside', 'not inside', 0.2), 0.018, -0.3)
tap(W(X_, 'inside', 'not inside', -0.1), 0.013, -0.5)
air(C(X_, 'time', -0.6), 1.2, 0.021); pencil(W(X_, 'time', 'what to expect', -0.2), 0.016, -0.85, 1.2)
knock(W(X_, 'time', 'service level', -0.3), 0.018, -0.25)
tSt = W(X_, 'comp', 'its steps')
for k in range(3):
    tap(tSt - 0.4 + k * 0.33, 0.012, -0.75 + k * 0.2)
tAr = W(X_, 'comp', 'another rule'); knock(tAr - 0.2, 0.018, -0.27); nylon(63, tAr, 0.014, -0.27)
for k, (t0, t1) in enumerate([(W(X_, 'time', 'Timeliness'), W(X_, 'time', 'an estimate replaced')), (C(X_, 'comp'), W(X_, 'comp', 'every estimate')),
                               (W(X_, 'comp', 'Validity'), W(X_, 'comp', 'every reading'))]):
    knock(t0 - 0.2, 0.018, -0.5); air(t1 - 0.5, 1.0, 0.013, -0.7); nylon([56, 58, 61][k], t1 + 0.4, 0.016, -0.5)
# 9. Written once, checked everywhere: D-flat, B-flat minor for the failure. Paper for retail's rule in its set form, and a pencil
#    for each part as it's named; air as it moves aside. A knock and muffled keys as each check is generated from it; air as the
#    pencil comes for the code, a low note as it's stopped, and a knock for the lock. Air as the rule goes back to a line, a knock
#    for it and a muffled key for each kind of check. A muffled key for each night the job ran, a pencil as that question is struck;
#    a nylon note, rising, for each bill corrected. Air and a knock as billing moves; a low note and a knock for the first bill not
#    corrected, the morning after, and a muffled key for its count. A knock for the billing team, air as the failure flies to it,
#    and a press and a nylon note as it lands; a muffled key for the shared mailbox, and a pencil as it's struck out
Q = 'checks'
bed(Q, [DBMAJ9, GBMAJ9], 0, cq(Q, 'first'))
bed(Q, [BBM9], cq(Q, 'first'), cq(Q, 'team'))
bed(Q, [GBMAJ9, ABSUS4], cq(Q, 'team'), None)
paper(S0(Q) + 0.3, 0.03, 0.0, 0.6)
for word in ['applies to', 'must be true', 'its owner', 'its reason', 'its home', 'when it fails']:
    pencil(W(Q, 'form', word, -0.15), 0.01, 0.0, 0.4)
air(C(Q, 'gen', -0.9), 1.5, 0.014, -0.3)
for i, word in enumerate(['a dbt test', 'quality rule', 'a shape']):
    t0 = W(Q, 'gen', word); knock(t0 - 0.1, 0.016, 0.5)
    for k in range(3):
        tap(t0 + 0.2 + k * 0.35, 0.007, 0.5)
air(C(Q, 'hand', -0.5), 1.2, 0.012, 0.7)
tBh = W(Q, 'hand', 'by hand'); soft(39, tBh - 0.1, 0.02, 0.6); knock(tBh, 0.014, 0.5)
tP = C(Q, 'promise'); air(tP - 1.1, 1.0, 0.012); knock(tP - 0.8, 0.014, -0.5)
for i, x in enumerate([1110, 1400, 1700]):
    tap(tP - 0.6 + i * 0.12, 0.01, pan_x(x))
for i, x in enumerate([540, 760, 980, 1200, 1420, 1640]):
    tap(tP + 0.1 + i * 0.12, 0.006, pan_x(x))
pencil(W(Q, 'promise', 'not whether', 0.1), 0.012, -0.75, 0.5)
tPr = W(Q, 'promise', 'what the rule')
for i, (x, m) in enumerate(zip([540, 760, 980], [56, 58, 61])):
    nylon(m, tPr + 0.2 + i * 0.15, 0.014, pan_x(x))
tF_ = C(Q, 'first'); air(tF_ + 0.2, 0.7, 0.012, 0.14); knock(tF_ + 0.3, 0.012, 0.14)
tMa = W(Q, 'first', 'morning after'); soft(37, tMa - 0.2, 0.022, 0.25); knock(tMa - 0.2, 0.016, 0.25); tap(tMa + 0.5, 0.01, 0.25)
tTl = W(Q, 'team', 'it tells'); knock(tTl - 0.3, 0.016, 0.5); air(tTl - 0.1, 1.0, 0.014, 0.4)
press(tTl + 0.9, 0.018); nylon(61, tTl + 0.95, 0.016, 0.5)
tMb = W(Q, 'team', 'mailbox'); tap(tMb - 0.4, 0.01, -0.36); pencil(tMb + 0.2, 0.012, -0.36, 0.4)
# 10. Generally, an ontology: F minor to A-flat with its fourth. A knock for each concept as it arrives, a muffled key for each
#     relation as it's drawn, and a knock and a nylon note for each rule attached; a swell for "an ontology", a muffled key for
#     "ready for OWL". Air as the graph shrinks into its place in the map, a knock for each layer of the map, and a knock and a nylon
#     note, rising, for each view as it's drawn from it; a swell for "one map, many views". Then one bill as facts: a knock for each,
#     a pencil for the correction nobody said, a low note for its empty place, a muffled key for "never said"; a low note as OWL
#     answers "unknown", and a press as the checks answer "no"
O = 'onto'
bed(O, [FM7, BBM9, GBMAJ9], 0, cq(O, 'open'))
bed(O, [EBM9, ABSUS4], cq(O, 'open'), None)
for i, x in enumerate([260, 820, 1360, 580, 1060, 1360]):
    knock(W(O, 'onto', 'the concepts', -0.2 + i * 0.14), 0.011, pan_x(x))
for i in range(6):
    tap(W(O, 'onto', 'how they relate', 0.1 + i * 0.22), 0.008, -0.4 + i * 0.16)
for i, (x, m) in enumerate(zip([820, 1060, 1640], [56, 58, 61])):
    t0 = W(O, 'onto', 'the rules about', i * 0.25); knock(t0, 0.012, pan_x(x)); nylon(m, t0 + 0.05, 0.014, pan_x(x))
swell([41, 48, 53, 56], W(O, 'onto', 'an ontology', -0.2), 3.0, 0.016); tap(W(O, 'owl', 'ready for OWL', -0.2), 0.01, -0.5)
tV = C(O, 'views'); air(tV - 0.4, 1.6, 0.016, 0.3)
for i in range(6):
    s_knock(tV + 0.1 + i * 0.22, 0.008, -0.6, 220 + 10 * i)
for word, m in [('the glossary', 56), ('the models', 58), ('the ontology', 61), ('the checks', 65)]:
    t0 = W(O, 'views', word, -0.2); knock(t0, 0.012, 0.35); nylon(m, t0 + 0.3, 0.014, 0.35)
swell([42, 49, 54, 58], W(O, 'views', 'one map', -0.2), 3.0, 0.016)
tO = C(O, 'open')
for i, x in enumerate([330, 900, 1470]):
    knock(tO - 0.3 + i * 0.15, 0.012, pan_x(x))
tNev = W(O, 'open', 'never happened'); pencil(tNev - 0.6, 0.012, -0.65, 0.7); soft(40, tNev - 0.3, 0.02, -0.65)
tap(tNev + 0.1, 0.01, -0.5)
soft(42, W(O, 'open', 'simply unknown', -0.1), 0.02, -0.5)
press(W(O, 'job', "checks' job", -0.5), 0.022)
# 11. Back in Tartu: D-flat, then G-flat on the reed pads for Tartu, and D-flat again. Paper as the household's bill comes back; a
#     nylon note as it's corrected, and a press and a nylon note for its $144.40 back. Muffled keys as the 1,900 are counted and
#     ticked, and a press. A knock for each rule, and a press and a nylon note as each owner confirms it. The bell for Tartu's card,
#     again as the benefit is paid, and once more for "nobody asked twice". Paper for Tomás's note and for its answer, a pencil as
#     the answer is written, and a short one as the note is marked; paper for the next question. A swell in the breath, the bell
#     under the end card, then the mark
Z = 'end'
bed(Z, [DBMAJ9, GBMAJ9], 0, cq(Z, 'tartu'))
bed(Z, [GBMAJ9], cq(Z, 'tartu'), cq(Z, 'answer'), g=0.03, tone='reed', bassg=0.018)
bed(Z, [DBMAJ9, ABSUS4], cq(Z, 'answer'), cq(Z, 'breath'))
paper(S0(Z) + 0.3, 0.03, -0.6, 0.5)
tBk = W(Z, 'refund', 'forty back'); nylon(56, tBk - 0.6, 0.016, -0.6); press(tBk, 0.022); nylon(61, tBk + 0.05, 0.018, -0.6)
t19 = W(Z, 'refund', 'nineteen hundred')
for k in range(6):
    tap(t19 + k * 0.27, 0.008, -0.6)
tFc = W(Z, 'refund', 'found and corrected')
for k in range(5):
    tap(tFc + k * 0.18, 0.007, -0.55)
press(tFc + 0.9, 0.016)
tCf = C(Z, 'confirm'); knock(tCf - 0.4, 0.014, -0.1); knock(tCf - 0.2, 0.014, -0.1)
for word, m in [('Grace', 61), ('head of retail', 65)]:
    t0 = W(Z, 'confirm', word, 0.2); press(t0, 0.018); nylon(m, t0 + 0.05, 0.016, -0.1)
bell(54, C(Z, 'tartu', -0.6), 0.016, -0.1); bell(61, W(Z, 'tartu', 'is paid', -0.2), 0.018, -0.1); bell(58, W(Z, 'tartu', 'asked twice', -0.4), 0.014, -0.1)
tA = C(Z, 'answer'); paper(tA - 1.0, 0.026, 0.55, 0.45)
tAn = W(Z, 'answer', 'an answer'); paper(tAn - 0.2, 0.032, 0.55, 0.5)
pencil(tAn, 0.01, 0.55, W(Z, 'owner', 'generated from it') - tAn + 0.8); pencil(tAn + 0.4, 0.012, 0.55, 0.4)
paper(W(Z, 'next', 'Next:', -0.1), 0.03, 0.55, 0.5)
swell([37, 44, 49, 53], G(Z, 'breath', 0.2), 3.0, 0.02)
bed(Z, [DBMAJ7], cq(Z, 'breath'), None, g=0.034, tone='strings', bassg=0.026)
bell(61, G(Z, 'breath', 0.6), 0.014, 0.3)
mark(G(Z, 'breath', 1.4), 49)
