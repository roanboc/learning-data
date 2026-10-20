# Rules with a home: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for Tartu today, soft reed chords in G-flat and a low tuned
# bell for the population register, which rings as the register answers the offices that ask (no borrowed Estonian instruments: the
# story is told in the series' own voice). Then nylon-string plucks and a soft flute for the present, in D-flat major, and the
# series' own mark, four notes rising 1-3-5-8, on the flute and the nylon string together, at the title and the end. The register's
# reeds and bell come back wherever something finds its one home: Tartu asked once, in chapter 4; and at the end, as the benefit is
# paid and nobody is asked twice.
# The series' sound (proposal.md, 20 October 2026, after the author's review of the second version: the music the way the master data
# films have it), which tools/quiet.py checks:
#  - The music plays under the opening, where the story from real life is told: Tartu, until the title. After that it comes in from
#    time to time: a chord at the turn into a chapter that starts something new (two rules, what a rule is about, written once, an
#    ontology), under a moment on screen (Tartu's register, the utility's own words, the tracking table, one map, back in Tartu) or
#    in a pause without words (the bill never corrected, the reading crossing the wall, the end card). Never a bed under the voice.
#  - Nothing trembles or pulses: one voice to a note, so no two voices beat on a phone's speaker (the first version's pads had three,
#    a little apart); the flute holds its notes without vibrato; the bell's partials sit on the chords' tuning; and no pulse under
#    the nightly script: its first nights have their keys, then the picture carries the rest.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the
#    picture in src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#    Where several things arrive together, one sound marks them.
# And everything stays low and soft: wooden knocks, paper, muffled keys, low felt notes, filtered below about 2.5 kHz. The bell and
# the nylon string are played with their tops taken off, at 2.2 kHz; the chords stay under 1.4 kHz.

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
# the chords' level: the opening's sit about 21 dB under the voice while it speaks, as the series' music always has, and a chord
# that comes in for a moment about 19 dB under it (PLAYBOOK.md: check a new palette's levels; at the pads' gain, one voice to a note
# sat 26 dB under, too faint)
LIFT = 1.9
def wash(ch, start, sec, g=0.03, reed=0.0, bloom=0.3):
    """a held chord that blooms note by note, each note a little after the one below it, at its own slow swell; one voice to a note,
    so nothing beats when a phone's speaker adds the two channels together; reed gives it Tartu's reeds, their odd harmonics a
    little stronger and their even ones weaker, kept soft enough that a fifth's harmonics don't beat; nothing above about 1.4 kHz"""
    x = tt(sec); s = np.zeros_like(x)
    for k, m in enumerate(ch):
        f = mf(m); e = np.clip((x - k * bloom) / 2.2, 0, 1) ** 1.5 * np.clip((sec - x) / 3.0, 0, 1)
        sw = 1 + 0.12 * np.sin(2 * np.pi * (0.05 + 0.013 * k) * x + k)
        s += (np.sin(2 * np.pi * f * x) + 0.22 * (1 - reed) * np.sin(4 * np.pi * f * x) + (0.06 + 0.2 * reed) * np.sin(6 * np.pi * f * x)
              + 0.07 * reed * np.sin(10 * np.pi * f * x)) * e * sw
    put(filt((s / len(ch)).astype(np.float32), 'low', 1400), start, g * 1.48 * LIFT)
def bed(keys, end, g=0.026, reed=0.45):
    """the opening's chords, each from its moment (a little early, so it has bloomed by then) until a little after the next one
    starts: only under Tartu's story"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        wash(ch, t0 - 1.2, t1 - t0 + 3.6, g, reed)
def comes(ch, t0, sec=6.0, g=0.03, reed=0.0):
    """a chord that comes in for a moment and leaves, blooming by t0: at a chapter's turn, under a moment on screen, or in a pause
    without words"""
    wash(ch, t0 - 1.0, sec, g, reed)
def nylon(m, start, g=0.04, pan=0.0, sec=1.8):
    """a nylon string: a few harmonics that fade from the top, warm and short"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.4) * np.exp(-x * (1.2 + 1.6 * k)) for k in range(1, 8))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2200)), start, g, pan)
def flute_(m, start, sec, g=0.04, pan=0.0):
    """a soft flute that holds its note steady: no vibrato, so nothing trembles"""
    f = mf(m); x = tt(sec); ph = 2 * np.pi * f * x
    s = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph) + filt(noise(sec), 'band', (f * 0.8, f * 2.2)) * 0.25
    put(norm((s * env(sec, 0.12, min(0.4, sec * 0.4))).astype(np.float32)), start, g, pan)
def bell(m, start, g=0.03, pan=0.0, sec=3.6):
    """the register's bell, for Tartu, and wherever something finds its one home: a low tuned bell, the hum an octave down and the
    minor third and fifth above on the chords' own tuning, so they don't beat against them, one partial a little apart, its top
    taken off"""
    f = mf(m); x = tt(sec)
    parts = ((0.5, 0.9, 0.5), (1, 0.75, 1), (2 ** (3 / 12), 0.5, 0.4), (2 ** (7 / 12), 0.42, 0.3), (2.0, 0.34, 0.3), (2.74, 0.2, 0.16), (2 ** (19 / 12), 0.16, 0.12))
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
def swell(ch, s, sec=5.0, g=0.016, reed=0.0):
    """a soft chord that swells for a moment on screen, blooming by s"""
    wash(ch, s - 0.6, sec, g, reed, 0.2)
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

# chords (MIDI note numbers): G-flat for Tartu, on the reeds; D-flat major and its neighbours for the present; B-flat minor for the
# bill never corrected, and A-flat with its fourth, which shares its notes with both D-flat and G-flat, for questions
GBMAJ9 = [42, 49, 53, 56, 58]; EBM9 = [39, 46, 49, 53, 54]; BMAJ7 = [47, 54, 58, 63]
DBMAJ9 = [37, 44, 48, 51, 53]; BBM9 = [46, 53, 56, 60, 61]; FM7 = [41, 48, 51, 56]; ABSUS4 = [44, 51, 56, 61]; DBMAJ7 = [37, 44, 48, 53]
def mark(start, root=49, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute_(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)


# 1. Once only, the opening: the reeds in G-flat under all of it, from the dawn over Tartu to the title. A swell as the window lights
#    for the birth; air as the record rises to the register, and the bell as it's entered. A muffled key as the phone appears and as
#    the offer is tapped; paper for the application they never made. Air as the camera lifts to the offices; a knock for each named
#    office as it arrives, and one on each side for the unnamed; air as the roads are drawn, and a knock for X-Road. For the named
#    offices' first asks, a muffled key, and the bell as the register answers; softer keys as the others ask, and the bell once for
#    them. A low felt note for "not asked again". Paper for the second database nobody may build, and a low note as it's crossed out;
#    paper for the list of databases, a muffled key for each line. The bell for "one home", a knock for its owner, air for "asked
#    once", and the bell twice, with a swell, for "once only". The bell under the register once more as the breath begins; then
#    D-flat, and the mark under the title
K = 'tartu'
B = C(K, 'breath')
bed([(0, GBMAJ9), (C(K, 'asks', -0.3), EBM9), (C(K, 'law', -0.3), BMAJ7), (C(K, 'link', -0.3), GBMAJ9)], B + 0.4)
swell([42, 49, 54, 58], W(K, 'born', 'born', -0.4), 5.0, 0.014, 0.45)
ent = W(K, 'born', 'entered'); air(ent, 1.6, 0.016, 0.2); bell(61, ent + 1.55, 0.02, -0.4)
tap(W(K, 'email', 'the parents', -0.4), 0.012, 0.0); tap(W(K, 'email', 'accept it'), 0.014, 0.0)
paper(C(K, 'never', -0.2), 0.03, -0.45, 0.5)
tOut = W(K, 'asks', 'No office', -0.5); air(tOut, 1.6, 0.02)
for i, x in enumerate([740, 1200]):
    knock(tOut + [0.5, 0.8][i], 0.016, pan_x(x))
for i, x in enumerate([275, 1645]):
    s_knock(tOut + 1.0 + 0.06 * i, 0.01, pan_x(x), 226)
tAsk = W(K, 'asks', 'Each one asks'); air(tAsk + 0.1, 1.4, 0.014)
knock(W(K, 'asks', 'over X-Road', -0.1), 0.016, 0.0)
for i, (x, m) in enumerate(zip([740, 1200], [54, 58])):
    a0 = tAsk + 1.3 + i * 0.41; tap(a0, 0.008, pan_x(x)); bell(m, a0 + 1.2, 0.016, pan_x(x) * 0.6)
for i, x in enumerate([330, 220, 330, 1590, 1700, 1590]):
    tap(tAsk + 1.3 + (i + 2) * 0.41, 0.005, pan_x(x))
bell(61, tAsk + 1.3 + 4.5 * 0.41 + 1.2, 0.009, 0.0)
soft(54, W(K, 'asks', 'parents', -0.2), 0.016, 0.6)
tLw = W(K, 'law', 'second database'); paper(tLw - 0.3, 0.026, -0.7, 0.45); soft(42, tLw + 0.5, 0.02, -0.7)
tLs = W(K, 'law', 'listed'); paper(tLs - 0.3, 0.028, -0.6, 0.5)
for k in range(3):
    tap(tLs + 0.1 + k * 0.45, 0.01, -0.6)
bell(54, W(K, 'link', 'one home', -0.1), 0.02, 0.0); knock(W(K, 'link', 'one owner', -0.1), 0.016, 0.0)
air(W(K, 'link', 'asked for once', -0.2), 0.9, 0.014, 0.4)
tOnly = W(K, 'link', 'once only', -0.2); bell(61, tOnly, 0.022, 0.0); bell(66, tOnly + 0.35, 0.016, 0.1)
swell([42, 49, 54, 58, 61], tOnly, 5.0, 0.014, 0.45)
bell(54, B + 0.4, 0.014, -0.2)
comes(DBMAJ9, B + 0.4, 8.5, 0.026)
mark(G(K, 'breath', 1.6), 49)
# 2. The bill from day one: the title's D-flat fades under its first line; then no chords until the bill is never corrected, when
#    B-flat minor comes in, in the pause before the script. Paper as Tomás's note goes up, and air as it moves to the corner; a knock
#    for day one's rule and for the bill, and a low note as it's flagged wrong. A knock for the household; a pencil as June is drawn
#    day by day; a low note as the lights go out for the three weeks away, and a muffled key as the meter stops. A pencil as the
#    estimate is drawn from last June, and a knock and a nylon note for its four hundred and twelve dollars eighty. A muffled key as
#    the meter comes back, air as its stored readings fly to June, and a few muffled keys as they land; a nylon note for "arrived".
#    Air as the line goes back to the bill and stops, a low note for the cross, and a press for "never corrected"
L = 'bill'
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
for i in range(0, 21, 6):
    tap(tBs + 0.2 + i * 0.07 + 0.9, 0.007, 0.0 + 0.02 * i)
nylon(61, W(L, 'never', 'arrived', -0.2), 0.018, 0.4)
tNc = W(L, 'never', 'never corrected'); air(tNc - 0.9, 0.8, 0.014, 0.3); soft(39, tNc, 0.022, 0.3); press(tNc + 0.15, 0.022)
comes(BBM9, tNc + 1.2, 6.5, 0.026)
# 3. A rule on the wall: no chords; B-flat minor fades under its first line. A knock as the script appears on the wall, a muffled key
#    for "written by metering"; paper for the readings it looks through, air as it scans them, and a nylon note for each pair it
#    finds. A knock for the billing system and for its queue, and a muffled key as each of the first two bills lands. Air as the new
#    billing system takes the old one's place, and a knock as it lights; a low note as the old queue's line is cut. Then the nights:
#    a muffled key for each of the first three bills the script writes to the queue nothing reads, and no pulse; the picture carries
#    the rest. A press as the count reads "corrected nothing", a low note at nineteen hundred. A low roll as the wall and its two
#    sides are drawn, and a muffled key for each side's question
S = 'script'
knock(S0(S) + 0.3, 0.02, 0.0); tap(W(S, 'existed', 'analyst', -0.1), 0.012, 0.0)
paper(C(S, 'found', -0.5), 0.026, -0.55, 0.5); air(W(S, 'found', 'estimates', -0.3), 1.6, 0.012, -0.4)
tAc = W(S, 'found', 'actual reading'); nylon(53, tAc + 0.4, 0.016, -0.55); nylon(56, tAc + 0.7, 0.016, -0.55)
tQ = W(S, 'found', 'queued'); knock(tQ - 0.2, 0.018, 0.5); knock(tQ - 0.05, 0.014, 0.5)
for d in (0.1, 0.35):
    tap(tQ + d + 0.9, 0.01, 0.5)
tNs = W(S, 'march', 'new system'); air(tNs - 0.5, 1.4, 0.016, 0.5); knock(tNs + 0.6, 0.016, 0.5)
soft(40, W(S, 'march', 'nothing reads', -0.2), 0.022, 0.5)
tC_ = C(S, 'clean')
for k in range(3):
    tap(tC_ + k * 0.42, 0.011 - 0.002 * k, 0.5)
press(W(S, 'clean', 'corrected nothing'), 0.022); soft(37, W(S, 'clean', 'nineteen hundred'), 0.02, 0.5)
rise(C(S, 'wall', -0.5), 1.4, 0.03)
tNi = W(S, 'wall', 'neither side'); tap(tNi - 0.3, 0.012, -0.28); tap(tNi - 0.1, 0.012, 0.28)
# 4. Five places, no home: no chords, until Tartu's register appears beside it. Paper for each of the five places the rule is
#    written, from left to right; a nylon note as the regulator's code says why, and a muffled key for each that says how; a low note
#    for the empty place where its home should be, and air as the lines reach for it. The reeds and the bell as Tartu's register
#    appears, asked once, and the bell again for "once only"
F = 'five'
for i, t0 in enumerate([S0(F) + 0.5, W(F, 'where', 'retail code'), W(F, 'where', 'settings'), W(F, 'where', 'notes'), W(F, 'where', 'spreadsheet')]):
    paper(t0 - 0.15, 0.024, pan_x(250 + i * 352), 0.45)
nylon(58, W(F, 'how', 'says why', -0.1), 0.018, pan_x(602))
for i in (0, 2, 3, 4):
    tap(W(F, 'how', 'each say how', 0.1 + 0.12 * max(0, i - 1)), 0.01, pan_x(250 + i * 352))
tNone = W(F, 'how', 'None of them'); soft(39, tNone - 0.1, 0.022, -0.1); air(tNone - 0.1, 1.0, 0.012, -0.1)
tTa = W(F, 'once', 'Tartu', -0.3); swell(GBMAJ9, tTa, 6.0, 0.026, 0.45)
bell(54, tTa, 0.018, 0.5); bell(61, W(F, 'once', 'once only', -0.2), 0.02, 0.5)
# 5. Two rules, not one: G-flat at the turn, and D-flat in the pause as the reading crosses the wall. A knock as day one's rule is
#    set down on the wall; a dry crack as it splits, and air as its halves part. A knock for each of the two rules, on its side, a
#    pencil as each is written, and a knock and a nylon note for each owner. Air as the gate opens, and again as the reading crosses
#    through it; paper for the agreed list, and a nylon note as "replaced readings" lights; a low note where the script once reached
#    across, a muffled key for "unseen"; air again as the reading crosses in the pause
P = 'split'
comes(GBMAJ9, S0(P) + 0.4, 6.5)
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
comes(DBMAJ9, C(P, 'breath', 0.2), 5.5, 0.026)
# 6. Where a rule comes from: no chords; it goes on from the two rules. Air as the two rules move down; a knock and a nylon note,
#    rising, for each kind of reason; a knock and a nylon note for the metering rules and for the regulator's retail code. A low note
#    as a rule loses its reason, and another as it loses its owner. Then Ama: a knock for day one's draft, a muffled key for its goal,
#    a pencil as the goal is struck out, and a press and a nylon note as it becomes an obligation
Y = 'why'
air(S0(Y) + 0.1, 1.4, 0.012)
for word, x, m in [('a regulation', 420, 53), ('a principle', 960, 56), ('service level', 1500, 58)]:
    t0 = W(Y, 'reason', word, -0.1); knock(t0, 0.014, pan_x(x)); nylon(m, t0 + 0.05, 0.016, pan_x(x))
for word, x, m in [('metering rules', 480, 61), ('retail code', 1440, 65)]:
    t0 = W(Y, 'these', word, -0.3); knock(t0, 0.016, pan_x(x)); nylon(m, t0 + 0.3, 0.018, pan_x(x))
soft(39, W(Y, 'safe', 'no reason', -0.2), 0.02, -0.5); soft(37, W(Y, 'safe', 'no owner', -0.2), 0.02, 0.5)
knock(W(Y, 'ama', 'Fair, accurate', -0.3), 0.018, 0.5); tap(W(Y, 'ama', 'goals', -0.6), 0.012, 0.5)
pencil(W(Y, 'ama', 'goals', -0.1), 0.012, 0.5, 0.4)
tOb = W(Y, 'ama', 'obligation'); press(tOb - 0.15, 0.02); nylon(61, tOb - 0.1, 0.018, 0.5)
# 7. What a rule is about: F minor at the turn, and D-flat for the utility's own words. A knock for retail's rule; a knock for each
#    fact it builds on, and one muffled key for the concepts beneath them; a nylon note as each concept is named, rising. A low roll as
#    the wall and its sides come back; air and a knock for each concept as it becomes a data object on its side, and a muffled key as
#    the estimate becomes part of the reading, with a nylon note for "actual or estimated". A muffled key and a knock for each of the
#    industry's words
A = 'about'
comes(FM7, S0(A) + 0.4, 6.5)
knock(S0(A) + 0.3, 0.023, 0.0)
tF = W(A, 'words', 'on facts')
for i, x in enumerate([360, 960, 1560]):
    knock(tF + i * 0.2, 0.018, pan_x(x))
tap(W(A, 'words', 'on concepts'), 0.012, 0.0)
for word, x, m in [('a reading', 650, 56), ('an estimate', 1010, 58), ('a bill', 1520, 61), ('a connection point', 290, 65)]:
    nylon(m, W(A, 'terms', word, 0.1), 0.016, pan_x(x))
rise(C(A, 'objects', -0.3), 1.2, 0.026)
tDo = W(A, 'objects', 'data object'); air(tDo - 0.6, 1.4, 0.018)
for k, x in enumerate([470, 470, 1450]):
    knock(tDo - 0.6 + k * 0.25 + 1.0, 0.016, pan_x(x))
tap(tDo + 1.5, 0.013, -0.5); nylon(56, tDo + 1.45, 0.014, -0.5)
for t0 in (C(A, 'cim', 0.6), W(A, 'cim', 'usage point', -0.2)):
    tap(t0, 0.013, -0.5); knock(t0 + 0.05, 0.013, -0.5)
swell([37, 44, 49, 53], W(A, 'own', 'own words', -0.2), 5.0, 0.026)
# 8. What the process expects: no chords; it goes on from what a rule is about. A knock for each step of meter to cash as it arrives,
#    and a soft knock for each rule; a nylon note as each is attached to its step. Air as a rule is pushed inside the step, a low note
#    as it's crossed out, a muffled key for "attached, not inside". Air as retail's side steps back and the rules fold; a pencil for
#    the bracket; a knock for the service level's clock, a muffled key for each of the steps; a knock and a nylon note for the other
#    rule. For each expectation, a knock as it arrives, and air and a nylon note, rising, as the step hands it down
X_ = 'expect'
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
tAr = W(X_, 'comp', 'another rule'); knock(tAr - 0.2, 0.018, -0.2); nylon(63, tAr, 0.014, -0.2)
for k, (t0, t1) in enumerate([(W(X_, 'time', 'Timeliness'), W(X_, 'time', 'an estimate replaced')), (C(X_, 'comp'), W(X_, 'comp', 'every estimate')),
                               (W(X_, 'comp', 'Validity'), W(X_, 'comp', 'every reading'))]):
    knock(t0 - 0.2, 0.018, -0.5); air(t1 - 0.5, 1.0, 0.013, -0.7); nylon([56, 58, 61][k], t1 + 0.4, 0.016, -0.5)
# 9. Test the data, track the business: D-flat at the turn, and A-flat with its fourth as the tracking table is generated. Paper for
#    retail's rule in its set form, and a pencil for each part as it's named; air as it folds away. A knock for the data rule, and
#    paper for the readings it's about; a nylon note as each mark is ticked. A knock and muffled keys as each test is generated from
#    it; air as the pencil comes for the code, a low note as it's stopped, and a knock for the lock. Air as the tests fold into their
#    pills, and a nylon note, rising, as each passes. A knock for the June bill, and a low note as it isn't corrected. Air as the
#    line runs from retail's rule, a knock and muffled keys as the tracking table is written, a pencil under the bills it lists; air
#    as it folds into its pill. A muffled key for the nights the job ran, a pencil as that question is struck; a nylon note, rising,
#    for each bill corrected. Air and a knock as billing moves; a low note and a knock for the first bill not corrected, the morning
#    after, and a muffled key for its count. A knock for the billing team, air as the list flies to it, and a press and a nylon note
#    as it lands; a muffled key for the shared mailbox, and a pencil as it's struck out
Q = 'checks'
comes(DBMAJ9, S0(Q) + 0.4, 6.5)
paper(S0(Q) + 0.3, 0.03, 0.0, 0.6)
for word in ['applies to', 'must be true', 'its owner', 'its reason', 'its home', 'when it fails']:
    pencil(W(Q, 'form', word, -0.15), 0.01, 0.0, 0.4)
air(C(Q, 'data', -0.9), 1.4, 0.014, -0.3)
knock(W(Q, 'data', 'about the data', -0.3), 0.016, -0.5); paper(W(Q, 'data', 'every reading', -0.3), 0.022, 0.5, 0.45)
nylon(61, W(Q, 'data', 'data is right', 0.3), 0.016, 0.5)
for i, word in enumerate(['a dbt test', 'quality rule', 'a shape']):
    t0 = W(Q, 'gen', word); knock(t0 - 0.1, 0.016, 0.5)
    for k in range(3):
        tap(t0 + 0.2 + k * 0.35, 0.007, 0.5)
air(C(Q, 'hand', -0.5), 1.2, 0.012, 0.7)
tBh = W(Q, 'hand', 'by hand'); soft(39, tBh - 0.1, 0.02, 0.6); knock(tBh, 0.014, 0.5)
tAr_ = W(Q, 'biz', 'all be right'); air(tAr_ - 0.3, 0.9, 0.012, 0.5)
for i, (x, m) in enumerate(zip([1150, 1430, 1700], [56, 58, 61])):
    nylon(m, tAr_ + 0.3 + i * 0.15, 0.014, pan_x(x))
tUn = W(Q, 'biz', 'uncorrected'); knock(tUn - 0.3, 0.016, -0.7); soft(37, tUn, 0.02, -0.6)
tTt = W(Q, 'track', 'tracking table'); air(tTt - 0.4, 0.8, 0.012, 0.1); knock(tTt - 0.1, 0.016, 0.5)
for k in range(3):
    tap(tTt + 0.2 + k * 0.5, 0.007, 0.5)
comes(ABSUS4, tTt + 0.3, 5.5)
pencil(W(Q, 'track', 'listing', 0.0), 0.012, 0.5, 0.6)
tP = C(Q, 'promise'); air(tP - 1.1, 1.0, 0.012)
for i, x in enumerate([540, 760, 980, 1200, 1420, 1640]):
    tap(tP + 0.1 + i * 0.12, 0.006, pan_x(x))
pencil(W(Q, 'promise', 'not whether', 0.1), 0.012, -0.75, 0.5)
tPr = W(Q, 'promise', 'what the rule')
for i, (x, m) in enumerate(zip([540, 760, 980], [56, 58, 61])):
    nylon(m, tPr + 0.2 + i * 0.15, 0.014, pan_x(x))
tF_ = C(Q, 'first'); air(tF_ + 0.2, 0.7, 0.012, 0.14); knock(tF_ + 0.3, 0.012, 0.14)
tMa = W(Q, 'first', 'morning after'); soft(37, tMa - 0.2, 0.022, 0.25); knock(tMa - 0.2, 0.016, 0.25); tap(tMa + 0.5, 0.01, 0.25)
knock(C(Q, 'team', -0.2), 0.014, 0.5)
tTl = W(Q, 'team', 'the list goes'); air(tTl + 0.1, 1.0, 0.014, 0.4)
press(tTl + 1.1, 0.018); nylon(61, tTl + 1.15, 0.016, 0.5)
tMb = W(Q, 'team', 'mailbox'); tap(tMb - 0.5, 0.01, -0.36); pencil(tMb + 0.2, 0.012, -0.36, 0.4)
# 10. Generally, an ontology: F minor at the turn, and G-flat for "one map, many views". A knock for each concept as it arrives, a
#     muffled key for a few of the relations as they're drawn, and a knock and a nylon note for each rule attached; a muffled key for
#     "ready for OWL". Air as the graph shrinks into its place in the map, and a knock and a nylon note, rising, for each view as it's
#     drawn from it. Then one bill as facts: a knock for each, a pencil for the correction nobody said, a low note for its empty
#     place, a muffled key for "never said"; a low note as OWL answers "unknown", and a press as the tracking table answers "no"
O = 'onto'
comes(FM7, S0(O) + 0.4, 7.5)
for i, x in enumerate([260, 820, 1310, 580, 1060, 1310]):
    knock(W(O, 'onto', 'the concepts', -0.2 + i * 0.14), 0.011, pan_x(x))
for i in range(0, 6, 2):
    tap(W(O, 'onto', 'how they relate', 0.1 + i * 0.22), 0.008, -0.4 + i * 0.16)
for i, (x, m) in enumerate(zip([820, 1060, 1590], [56, 58, 61])):
    t0 = W(O, 'onto', 'the rules about', i * 0.25); knock(t0, 0.012, pan_x(x)); nylon(m, t0 + 0.05, 0.014, pan_x(x))
tap(W(O, 'owl', 'ready for OWL', -0.2), 0.01, -0.5)
tV = C(O, 'views'); air(tV - 0.4, 1.6, 0.016, 0.3)
for word, m in [('the glossary', 56), ('the models', 58), ('the ontology', 61), ('the checks', 65)]:
    t0 = W(O, 'views', word, -0.2); knock(t0, 0.012, 0.35); nylon(m, t0 + 0.3, 0.014, 0.35)
swell([42, 49, 54, 58], W(O, 'views', 'one map', -0.2), 5.0, 0.04)
tO = C(O, 'open')
for i, x in enumerate([330, 900, 1470]):
    knock(tO - 0.3 + i * 0.15, 0.012, pan_x(x))
tNev = W(O, 'open', 'never happened'); pencil(tNev - 0.6, 0.012, -0.65, 0.7); soft(40, tNev - 0.3, 0.02, -0.65)
tap(tNev + 0.1, 0.01, -0.5)
soft(42, W(O, 'open', 'simply unknown', -0.1), 0.02, -0.5)
press(W(O, 'job', "tracking table's job", -0.5), 0.022)
# 11. Back in Tartu: no chords until Tartu, where the reeds come back with the bell; then D-flat and the mark on the end card. Paper
#     as the household's bill comes back; a nylon note as it's corrected, and a press and a nylon note for its $144.40 back. Muffled
#     keys as the 1,900 are counted and ticked, and a press. A knock for each rule, and a press and a nylon note as each owner
#     confirms it. The bell for Tartu's card, again as the benefit is paid, and once more for "nobody asked twice". Paper for Tomás's
#     note and for its answer, a pencil as the answer is written, and a short one as the note is marked; paper for the next question.
#     The bell under the end card, then the mark
Z = 'end'
paper(S0(Z) + 0.3, 0.03, -0.6, 0.5)
tBk = W(Z, 'refund', 'forty back'); nylon(56, tBk - 0.6, 0.016, -0.6); press(tBk, 0.022); nylon(61, tBk + 0.05, 0.018, -0.6)
t19 = W(Z, 'refund', 'nineteen hundred')
for k in range(0, 6, 2):
    tap(t19 + k * 0.27, 0.008, -0.6)
tFc = W(Z, 'refund', 'found and corrected')
for k in range(0, 5, 2):
    tap(tFc + k * 0.18, 0.007, -0.55)
press(tFc + 0.9, 0.016)
tCf = C(Z, 'confirm'); knock(tCf - 0.4, 0.014, -0.1); knock(tCf - 0.2, 0.014, -0.1)
for word, m in [('Grace', 61), ('head of retail', 65)]:
    t0 = W(Z, 'confirm', word, 0.2); press(t0, 0.018); nylon(m, t0 + 0.05, 0.016, -0.1)
tTa = C(Z, 'tartu', -0.6); swell(GBMAJ9, tTa, 6.5, 0.026, 0.45)
bell(54, tTa, 0.016, -0.1); bell(61, W(Z, 'tartu', 'is paid', -0.2), 0.018, -0.1); bell(58, W(Z, 'tartu', 'asked twice', -0.4), 0.014, -0.1)
tA = C(Z, 'answer'); paper(tA - 1.0, 0.026, 0.55, 0.45)
tAn = W(Z, 'answer', 'an answer'); paper(tAn - 0.2, 0.032, 0.55, 0.5)
pencil(tAn, 0.01, 0.55, W(Z, 'owner', 'generated from it') - tAn + 0.8); pencil(tAn + 0.4, 0.012, 0.55, 0.4)
paper(W(Z, 'next', 'Next:', -0.1), 0.03, 0.55, 0.5)
Bz = G(Z, 'breath'); comes(DBMAJ7, Bz + 0.4, TOT + 1.0 - (Bz - 0.6), 0.026)
bell(61, Bz + 0.6, 0.014, 0.3)
mark(Bz + 1.4, 49)
