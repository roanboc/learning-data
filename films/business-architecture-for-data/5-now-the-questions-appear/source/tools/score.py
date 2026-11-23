# Now the questions appear: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The film keeps the palette it had as film 8 of The map before the data (it moved to Business architecture for data on 23 November
# 2026, with a new opening story; the four series' palettes file notes it there): a celesta over bowed strings for the opening story,
# and a nylon string for the present, with a soft flute in the series' mark. Retuned for the new story and the series:
#  - The opening, the trial well (Iran, in the 1960s): bowed strings, one string to a note, hold the story's chords, in B minor while
#    nobody knows whether the water will come, F sharp minor for what a dry tunnel would cost, and D major as the answer comes. The
#    celesta is the water: where it might be, where the well finds it, each day's bucket, and the water run out to the fields. No
#    borrowed sound of Iran: no santur, no ney, no tar, no daf, and no Persian mode; the story is told in the series' own voice.
#  - Its sounds: the expert's steps on the dry slope, the windlass's rope and the earth tipped from the buckets, the hollow scooped
#    out, the bucket dipped in it, the tunnel dug, and the water running out to the fields.
#  - The present, in D major and its neighbours on the nylon string: a chapter's chord spread up as it starts, and left to ring; a note
#    for each thing that lands; low felt notes for what reaches nothing. The celesta comes back wherever an answer reaches someone in
#    time: as the measure's light climbs to the goal it checks, as Tomás's note gets its answer, and back at the trial well.
#  - The series' mark (mark()): the three layers, the business layer between the other two: the celesta plays D, then A, doubled by
#    the nylon string, and the flute holds the F sharp between them. Under the title, and again under the end card.
# The rules every film keeps (AGENTS.md; tools/quiet.py checks them):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; never a bed
#    under the voice; a figure never played again soon after itself; music and effects no louder than the governance films'.
#  - Nothing trembles or pulses: one voice to a note, no vibrato, tuned pure from D (hz()), so no two notes beat on a phone's speaker.
#    No urgent pulse: nothing in this film is a rush.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: the nylon string and the strings low-passed at 2.2 kHz, the celesta at 2.6 kHz (its upper
# partials die within a tenth of a second), the effects below about 2.2 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() takes a word's first appearance, and falls back to the line's start when it's missing; here either stops the mix, so a typo
# can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1968)  # this film's own randomness: the steps, the earth, the water
LM = 1.45  # the music's level, as loud as the governance films' music (tools/quiet.py), above the instruments' own gains

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major and
# B and F sharp minor are pure in this table; E minor isn't (its fifth is a comma short), so it isn't played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.4162 * 2 ** o * _JI[pc]

# ---- the film's instruments, all low-passed ----
def cel(m, start, g=0.014, pan=0.0):
    """the celesta: the water in the opening, and wherever an answer reaches someone in time; its top taken off"""
    f = hz(m); x = tt(2.0)
    s = sum(np.sin(2 * np.pi * f * r * x + r) * np.exp(-x / d) * a for r, d, a in ((1, 1.1, 1), (4, 0.3, 0.3), (8.2, 0.08, 0.08)))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2600)), start, g * LM, pan)
def nylon(m, start, g=0.02, pan=0.0, sec=1.8):
    """a nylon string: a few harmonics that fade from the top, warm and short"""
    f = hz(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.4) * np.exp(-x * (1.2 + 1.6 * k)) for k in range(1, 8))
    s = s * np.minimum(1, x / 0.004) * np.clip((sec - x) / 0.3, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g * LM, pan)
def ring_(m, start, g=0.03, pan=0.0, sec=3.4):
    """the nylon string, plucked softly and left to ring: its upper partials die away fast, so two strings never hold overtones long
    enough to beat"""
    f = hz(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.5) * np.exp(-x * (0.6 + 0.5 * k * k)) for k in range(1, 7))
    s = s * np.minimum(1, x / 0.004) * np.clip((sec - x) / 0.5, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g * LM, pan)
def turn(ch, s, g=0.026, pan=0.0):
    """a chapter's chord as its first picture comes in, spread up on the nylon string and left to ring: after the opening story, the
    music comes now and then, at a turn, a moment or a pause, instead of being held under the voice"""
    for k, m in enumerate(ch):
        ring_(m, s + 0.12 * k, g * (1.0 if k == 0 else 0.8), pan - 0.3 + 0.15 * k)
def soft(m, start, g=0.02, pan=0.0):
    """a low felt note, for something that reaches nothing or is lost"""
    f = hz(m); x = tt(3.2)
    s = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (1.1 + 0.9 * k)) * w for k, w in ((1, 1), (2, 0.35), (3, 0.12), (4, 0.05)))
    put((s * np.minimum(1, x / 0.008)).astype(np.float32), start, g * LM, pan)
def flute_(m, start, sec, g=0.012, pan=0.0):
    """a soft flute, held steady, without vibrato (nothing trembles), with a breath as it speaks"""
    f = hz(m); x = tt(sec); ph = 2 * np.pi * f * x
    s = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)
    br = filt(noise(sec), 'band', (f * 0.8, min(2200, f * 2.2))) * 0.25 * (0.35 + 0.65 * np.exp(-x * 6))
    put(norm(((s + br) * env(sec, 0.12, min(0.4, sec * 0.4))).astype(np.float32)), start, g * LM, pan)
def bowed(f, sec, rise=1.6):
    """one bowed string, one voice, no vibrato: a few harmonics, the higher ones a moment after the lower as the bow takes the string,
    held level, and a ring as the bow leaves it"""
    x = tt(sec); r = min(rise, sec * 0.4)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) * (0.55 / k ** 1.1) * np.minimum(1, x / (r * (0.6 + 0.25 * k)))
            for k in range(1, 6) if f * k < 2200)
    return (filt(s.astype(np.float32), 'low', 2200) * env(sec, r, min(2.4, sec * 0.35))).astype(np.float32)
def strings(ch, start, sec, g=0.03, bass=True):
    """the opening's chords, bowed and held: one string to a note, each a little after the last, across the stereo field, and the
    root an octave down under them"""
    n = len(ch)
    for i, m in enumerate(ch):
        put(bowed(hz(m), sec - 0.3 * i), start + 0.3 * i, g * LM * 1.4 / n, -0.6 + 1.2 * i / max(1, n - 1))
    if bass:
        put(bowed(hz(ch[0] - 12), sec, 2.2), start, g * LM * 0.5, 0.0)
def swell(ch, s, sec=3.2, g=0.022):
    """after the opening, a short bowed chord under a moment, instead of a held bed"""
    strings(ch, s, sec, g, bass=False)

# chords (MIDI note numbers), all pure from D: B minor while nobody knows, F sharp minor for the loss, G and A on the way, D major as the
# answer comes; in the present, D major and its neighbours
BM7 = [47, 50, 54, 57]; GMAJ7 = [43, 47, 50, 54]; DMAJ = [50, 54, 57, 62]; FSM7 = [42, 49, 52, 57]; ASUS4 = [45, 50, 52, 57]
AMAJ = [45, 49, 52, 57]; DMAJ7 = [50, 54, 57, 61]; DMAJ9 = [50, 57, 61, 64, 66]
GMAJ9 = [43, 50, 54, 57, 59]; BM9 = [47, 54, 57, 61, 62]; ASUS = [45, 52, 57, 59, 62]; FSM = [42, 49, 54, 57]
MARK = [62, 69, 66]
def mark(start, g=0.05, step=0.5, hold=2.6):
    """the series' mark: D, then A, on the celesta, doubled by the nylon string, and the flute holding the F sharp between them"""
    for i, m in enumerate(MARK[:2]):
        cel(m + 12, start + step * i, g * 0.3, (i - 0.5) * 0.3)
        nylon(m, start + step * i, g * 0.5, (i - 0.5) * 0.3, sec=2.0)
    flute_(MARK[2] + 12, start + step * 2, hold, g * 0.3, 0.0)

# ---- the sounds ----
def knock(s, g=0.014, pan=0.0):
    """a soft wooden knock, for a card or a note arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def tap(s, g=0.01, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.022, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.5):
    """a pencil on paper: a soft, short scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec), s, g, pan)
def press(s, g=0.02):
    """a stamp or a confirmation: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def air(s, sec=0.9, g=0.012, pan=0.0):
    """things moving across the frame together, or the camera moving: a breath of low air"""
    s_air(s, sec, g, pan, 140, 900)
def rise(s, sec=1.2, g=0.024):
    """the wall between the network and retail, drawn down the frame: a low roll that grows with it and settles"""
    x = tt(sec); X(filt(noise(sec), 'low', 220) * np.sin(np.pi * x / sec) ** 1.5, s, g)
def step(s, g=0.008, pan=0.0):
    """a step on the dry slope: a short, low crunch of grit"""
    x = tt(0.12); X(norm(filt(noise(0.12), 'band', (180, 1100)) * np.exp(-x * 34) * (1 + 0.5 * np.sin(2 * np.pi * 40 * x))), s, g, pan)
def steps(s, sec, g=0.008, pan0=0.0, pan1=0.0, every=0.55):
    """someone walking on the slope: a step every half second or so, each a little different"""
    k, t0 = 0, s
    while t0 < s + sec:
        step(t0, g * R1.uniform(0.75, 1.0), pan0 + (pan1 - pan0) * (t0 - s) / sec); k += 1
        t0 += every * R1.uniform(0.9, 1.1)
def rope(s, sec=1.0, g=0.006, pan=0.0):
    """the windlass turning: its rope wound on the wooden drum, a low, dry rub that rises and falls once"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 700)) * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * x)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def earth(s, sec=0.5, g=0.01, pan=0.0):
    """a leather bucket of earth tipped out: dry earth sliding and settling, low"""
    x = tt(sec); X(filt(noise(sec), 'band', (150, 900)) * np.sin(np.pi * x / sec) ** 1.2 * np.exp(-x * 2), s, g, pan)
def scoop(s, sec=0.7, g=0.008, pan=0.0):
    """the hollow scooped out of damp ground: a soft, wet scrape"""
    x = tt(sec); X(filt(noise(sec), 'band', (200, 800)) * np.sin(np.pi * x / sec) ** 2 * (0.8 + 0.2 * np.sin(2 * np.pi * 3 * x)), s, g, pan)
def dip(s, g=0.008, pan=0.0):
    """the bucket dipped into the hollow: a small, low slosh of water"""
    x = tt(0.4); X(filt(noise(0.4), 'band', (160, 1100)) * np.sin(np.pi * np.minimum(1, x / 0.4)) ** 1.5 * np.exp(-x * 3), s, g, pan)
def trickle(s, sec=1.6, g=0.006, pan=0.0):
    """a thin trickle of water: a soft, high-ish wash, swelling and fading, nothing in drops"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1800)) * np.sin(np.pi * x / sec) ** 2 * (0.8 + 0.2 * np.sin(2 * np.pi * 2.3 * x)), s, g, pan)
def dig(s, sec=3.0, g=0.012, pan=0.0):
    """the tunnel dug up the slope: a low roll of earth that comes and settles, as the line grows on screen"""
    x = tt(sec); X(filt(noise(sec), 'band', (90, 500)) * np.sin(np.pi * x / sec) ** 1.5 * (0.75 + 0.25 * np.sin(2 * np.pi * 1.1 * x)), s, g, pan)
def flow(s, sec=6.0, g=0.012, pan=0.0):
    """water running out of the new qanat and along the channel to the fields: one low, soft texture that rises, moves, and fades"""
    x = tt(sec)
    X(filt(noise(sec), 'band', (140, 1100)) * env(sec, 1.2, 2.0) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.6 * x)), s, g, pan)


# 1. A trial well: bowed strings under the opening story, in B minor as the qanats are named, G as the expert walks the slope, D as the
#    cost is told, F sharp minor for what a dry tunnel would leave, A as the builders need to know, D as the well is sunk, B minor while
#    the hollow fills, D with its seventh for real groundwater, A with its fourth for the question, and D as the answer comes in time.
#    The celesta as the groundwater under the mountains is lit; the expert's steps up the slope, and the celesta for the damp patch and
#    the greener plants; air as the camera draws back for the cost, and a knock for its tag; the celesta, low, for "all year, or only in
#    spring?"; a trickle, and low notes for the dry fields and the money gone; the celesta's question as the builders ask it. The well:
#    for each bucket of earth, the rope on the windlass and the earth tipped out; the celesta for the damp ground, the hollow scooped
#    out, then each day the bucket dipped in it and a celesta note as the day's bar rises; two notes for real groundwater; the tunnel
#    dug; paper for the question, a knock for when the answer comes, a note for "choosing", and the celesta as the answer moves to "in
#    time"; the water run out to the fields, the celesta rising as each field turns green, and knocks for the return. D major for the
#    wordless moment, and the mark under the title.
#    Every sound uses the same word and offset as its picture in src/scenes.js (the trial scene)
K = 'trial'
B = G(K, 'breath')
for ch, a, b in [(BM7, S0(K) + 0.4, C(K, 'survey')), (GMAJ7, C(K, 'survey'), C(K, 'cost')), (DMAJ, C(K, 'cost'), C(K, 'sure')),
                 (FSM7, C(K, 'sure'), C(K, 'know')), (ASUS4, C(K, 'know'), C(K, 'trial')), (DMAJ, C(K, 'trial'), C(K, 'dip')),
                 (BM7, C(K, 'dip'), C(K, 'trickle')), (DMAJ7, C(K, 'trickle'), C(K, 'act')), (ASUS4, C(K, 'act'), C(K, 'time')),
                 (DMAJ, C(K, 'time'), B)]:
    strings(ch, a - 1.2, b - a + 3.2, 0.03)
strings(DMAJ7, B + 0.2, E(K) - B + 1.0, 0.026)
# the slope, the groundwater, the expert, the cost
tWet = W(K, 'edge', 'under the mountains', -0.3); cel(69, tWet + 0.2, 0.012, px(300)); cel(74, tWet + 0.55, 0.01, px(200))
tWk = W(K, 'survey', 'walks', -0.2); steps(tWk + 0.1, 2.9, 0.007, -0.15, -0.3)
cel(71, W(K, 'survey', 'damp patch', -0.1), 0.011, -0.4); cel(74, W(K, 'survey', 'greener', -0.1), 0.01, -0.2)
air(C(K, 'cost', -0.3), 1.4, 0.01, 0.0); knock(W(K, 'cost', 'thirteen', -0.2), 0.012, px(1100))
cel(64, W(K, 'sure', 'flow all year', -0.2), 0.011, px(1440 * 0.78 + 220))
trickle(W(K, 'need', 'trickle'), 1.6, 0.005, px(1200)); soft(45, W(K, 'need', 'fields dry', -0.1), 0.018, px(1600))
soft(42, W(K, 'need', 'the money gone', -0.1), 0.017, 0.0)
tQ = W(K, 'know', 'is there', -0.2); cel(76, tQ, 0.011, -0.3); cel(74, tQ + 0.45, 0.009, -0.3)
# the well, sunk: a bucket of earth comes up every 2.4 s, from just after "sink" until the damp ground
tSink, tDamp = W(K, 'trial', 'sink', -0.2), W(K, 'dip', 'damp ground')
tTop = tSink + 0.5 + 2.4
while tTop < tDamp + 0.6:
    rope(tTop - 1.1, 1.0, 0.006, -0.25); earth(tTop + 0.15, 0.5, 0.009, -0.15)
    tTop += 2.4
cel(69, tDamp, 0.012, -0.2)
scoop(W(K, 'dip', 'hollow', -0.1), 0.7, 0.008, -0.2)
tDays = W(K, 'dip', 'next few days', -0.2)
knock(tDays + 0.1, 0.01, px(1540))
for k, m in enumerate([69, 71, 69]):
    dip(tDays + 1.3 + k * 2.6, 0.007, -0.2)
    cel(m, tDays + (k + 1) * 2.6 - 0.35, 0.01, px(1300 + 120 * k))
tM = W(K, 'trickle', 'More than'); cel(74, tM, 0.012, px(1540)); cel(78, tM + 0.4, 0.011, px(1540))
dig(W(K, 'trickle', 'Only then', 0.4), 3.0, 0.011, 0.1)
# the question, why it mattered, and the answer in time
paper(W(K, 'act', 'how fast', -0.3), 0.02, px(1450), 0.5)
knock(W(K, 'act', 'It mattered', -0.3), 0.012, px(1450))
cel(73, W(K, 'act', 'choosing', -0.1), 0.01, px(1450))
tAn = W(K, 'time', 'brought'); cel(74, tAn + 0.95, 0.012, px(1600)); cel(81, tAn + 1.3, 0.012, px(1700))
# the water, out to the fields, and what it repaid
tRe = C(K, 'repaid')
flow(tRe - 0.2, 7.5, 0.01, 0.35)
for i, m in enumerate([62, 66, 69, 74]):
    cel(m + 12, tRe + 2.4 + i * 0.7, 0.009, 0.3 + 0.12 * i)
knock(W(K, 'repaid', 'ten to', -0.2), 0.01, px(1600)); knock(W(K, 'repaid', 'crops', -0.2), 0.009, px(1600))
mark(B + 1.6)
# 2. The backlog, read again: the chapter's chord, D major, as Tomás's note goes up, with paper; muffled keys as the forty-two are dealt
#    into their grid; a knock for the count, and for each of the three read close; soft stamps as most are marked urgent; a low note as
#    he can't tell which matter; a knock for each layer of the map as it stacks; and a nylon note for a trial well for every request
L = 'backlog'
turn(DMAJ9, S0(L) + 0.3, 0.026, 0.0)
paper(S0(L) + 0.3, 0.026, 0.0, 0.6)
tDeal = W(L, 'pile', 'their backlog')
for i in range(10):
    tap(tDeal + i * 0.19, 0.008, 0.65 - i * 0.12)
knock(W(L, 'pile', 'forty-two'), 0.014, 0.08)
for word, pan in [('reports', -0.45), ('dashboards', 0.08), ('extracts', 0.6)]:
    knock(W(L, 'pile', word, -0.1), 0.016, pan)
for k in range(4):
    press(W(L, 'pile', 'urgent', k * 0.13), 0.012)
soft(47, C(L, 'test', -0.2), 0.018, -0.6)
tMap = W(L, 'test', "Now there's")
for i in range(6):
    knock(tMap + 0.3 + i * 0.185, 0.009, 0.5)
knock(W(L, 'test', 'trial well', -0.1), 0.014, 0.5); nylon(69, W(L, 'test', 'who will'), 0.02, 0.5)
# 3. Up from a request: G as the request arrives, with a knock; a knock for each step it's traced up, and a nylon note as it first
#    serves a decision; a press, and the fifth and the octave, as it reaches the top. Then the lobby's dashboard: a knock; a muffled
#    key for "never out of date", two for "who decides", and low felt notes for "no one" and "reaches nothing"
U = 'up'
turn(GMAJ9, S0(U) + 0.3, 0.024, -0.2)
knock(C(U, 'first', 0.1), 0.016, -0.35)
for word, lid, m in [('to decide', 'first', 62), ('maintaining assets', 'climb', None), ('replace assets', 'climb', None)]:
    t0 = W(U, lid, word, -0.2); knock(t0, 0.012, -0.35)
    if m:
        nylon(m, t0 + 0.05, 0.02, -0.35)
tap(W(U, 'first', "Grace's"), 0.01, -0.55)
top = W(U, 'climb', 'reaches the top')
press(top, 0.02); nylon(69, top + 0.05, 0.018, -0.35); nylon(74, top + 0.3, 0.016, -0.35)
knock(C(U, 'lobby', 0.1), 0.016, 0.46)
tap(W(U, 'live', 'never out of date'), 0.009, 0.55)
tap(W(U, 'live', 'who decides'), 0.01, 0.46); tap(W(U, 'live', 'who decides', 0.4), 0.01, 0.46)
soft(47, W(U, 'live', 'No one'), 0.02, 0.46); soft(42, W(U, 'live', 'reaches nothing'), 0.018, 0.46)
# 4. Half of them: D as the goals, decisions and requests go up, with knocks and muffled keys; air as all forty-two are traced; nylon
#    notes, rising, as the goals light; a knock for the regulator; a low note as the other half reach nothing; a knock for each of the
#    three read close; paper for each one's question, and air as they go back
H_ = 'half'
turn(DMAJ9, S0(H_) + 0.2, 0.022, 0.0)
for i, pan in enumerate([-0.7, -0.2, 0.32, 0.76]):
    knock(S0(H_) + 0.2 + i * 0.1, 0.009, pan)
for i in range(0, 7, 2):
    tap(S0(H_) + 0.4 + i * 0.06, 0.007, -0.8 + i * 0.27)
for i in range(4):
    tap(S0(H_) + 0.65 + i * 0.22, 0.006, -0.6 + i * 0.4)
air(C(H_, 'all', 0.2), 2.4, 0.012)
reach = W(H_, 'all', 'Twenty-one reach')
for i, (m, pan) in enumerate(zip([62, 66, 69, 74], [-0.7, -0.2, 0.32, 0.76])):
    nylon(m, reach + 0.6 + i * 0.15, 0.016, pan)
knock(W(H_, 'all', 'obligation'), 0.01, 0.44)
soft(47, C(H_, 'none'), 0.02, 0.44)
for word, pan in [('needed once', -0.65), ('nobody acts', 0.0), ('nobody can', 0.65)]:
    knock(W(H_, 'none', word, -0.3), 0.014, pan)
for j, pan in enumerate([-0.5, 0.14, 0.79]):
    paper(W(H_, 'back', 'one question', j * 0.25), 0.018, pan, 0.4)
air(W(H_, 'back', 'goes back'), 1.7, 0.02)
air(W(H_, 'back', 'decide with', 0.4), 1.3, 0.016)
# 5. Down from a goal: G as the chapter turns; a nylon note as the goal lands from above, and one for each row it implies, falling,
#    A, F sharp, D, with a muffled key for each; a knock as the method's name, Goal-Question-Metric, comes in, and a muffled key as the
#    decision row lights, the step the film adds; air as the shape moves aside; knocks for the goal, its outcome and each step of its
#    path; a soft stamp for "how would anyone check?"; paper for the planners' request; a knock for the measure; a press as the two
#    lines meet at one decision; then the celesta, rising, as the measure's light climbs to the goal and crosses to the outcome, now
#    checkable, with a soft press for its tick; D major for the wordless moment
D = 'down'
turn(GMAJ9, S0(D) + 0.2, 0.022, 0.0)
r0 = W(D, 'way', 'the other way'); knock(r0 + 0.9, 0.01, 0.0); nylon(74, r0 + 0.95, 0.018, 0.0)
for word, m, n in [('implies decisions', 69, 2), ('needs questions', 66, 4), ('needs a measure', 62, 4)]:
    t0 = W(D, 'way', word, -0.2); nylon(m, t0, 0.017, 0.0)
    for j in range(n):
        tap(t0 + j * 0.08, 0.006, -0.5 + j * (1.0 / max(1, n - 1)))
knock(W(D, 'gqm', 'Goal', -0.3), 0.01, 0.0)
tap(W(D, 'gqm', 'a decision added', -0.1), 0.01, 0.45)
air(C(D, 'better', -0.5), 1.6, 0.012, -0.3)
knock(W(D, 'better', 'Take'), 0.014, 0.08)
knock(W(D, 'better', 'a better network', -0.3), 0.012, 0.66)
press(W(D, 'better', 'nobody could', 0.1), 0.018)
for word in ['Its decision', 'its question']:
    knock(W(D, 'measure', word), 0.012, 0.08)
paper(W(D, 'measure', 'the planners asked'), 0.02, 0.67)
knock(W(D, 'unit', 'The measure'), 0.014, 0.08)
tap(W(D, 'unit', 'per year'), 0.009, 0.55)
meet = W(D, 'meet', 'meet at one')
press(meet, 0.02)
chk = W(D, 'meet', 'can be checked')
for k, m in enumerate([69, 74, 78]):
    cel(m, chk + 0.1 + k * 0.35, 0.012, 0.08)
cel(81, chk + 1.25, 0.012, 0.6); press(chk + 1.2, 0.016)
turn(DMAJ9, G(D, 'breath', 0.3), 0.022, 0.0)
# 6. A goal with no measure: B minor as the chapter turns, with a knock for the goal; knocks for the measured half and its measure, a
#    soft press for its tick; a low note for the people who pay it; knocks for retail's decision and
#    question, muffled keys for the homes and for those falling behind, and a low note for the empty slot; a knock for the register,
#    muffled keys for its rings; paper for Farah's note, a pencil for each year she has asked; a short bowed chord in F sharp minor as
#    a goal without a measure can't be steered
M_ = 'missing'
turn(BM9, S0(M_) + 0.2, 0.022, 0.0)
knock(S0(M_) + 0.2, 0.014, 0.0)
lA = W(M_, 'afford', 'network charge', -0.2)
knock(lA + 0.3, 0.012, -0.6); knock(lA + 0.8, 0.012, -0.6); press(lA + 0.85, 0.012)
soft(47, W(M_, 'afford', 'but none'), 0.02, 0.2)
dc = W(M_, 'behind', 'Retail decides'); knock(dc, 0.012, 0.1); tap(dc + 0.5, 0.009, 0.1)
for k in range(4):
    tap(dc + 0.6 + k * 0.08, 0.006, 0.6 + k * 0.06)
qu = W(M_, 'behind', 'Its question'); knock(qu, 0.012, 0.1)
for k in range(5):
    tap(qu + 0.4 + k * 0.2, 0.006, 0.62 + 0.04 * k)
knock(W(M_, 'register', 'The hardship'), 0.014, 0.7)
help_ = W(M_, 'register', 'already getting')
for k in range(3):
    tap(help_ - 0.3 + k * 0.1, 0.009, 0.66 + 0.04 * k)
paper(W(M_, 'farah', 'asked for'), 0.022, -0.48, 0.5)
for k in range(3):
    pencil(W(M_, 'farah', 'for years', k * 0.25), 0.011, -0.6 + k * 0.1, 0.25)
swell(FSM, W(M_, 'farah', 'A goal'), 3.2, 0.02)
# 7. What counts: A with its fourth as the chapter turns, with knocks for the goal and its measure; air as the measure moves up, a
#    pencil as the timeline is drawn; a knock for each report, and a nylon note for each span, the second lower than the first; a
#    muffled key for each clock as it starts; a low note for "neither"; paper for the definition, a
#    pencil for each line of it, a nylon note as the measure is drawn, and a soft press as each open question is answered; then a short
#    bowed chord in D as everyone gets the same number, muffled keys as the numbers roll to it, and a soft press for the reports' ticks
Q = 'count'
turn(ASUS, S0(Q) + 0.2, 0.022, 0.0)
knock(S0(Q) + 0.6, 0.014, 0.0); knock(W(Q, 'two', 'new solar', -0.3), 0.012, 0.0)
air(W(Q, 'disagree', 'Two reports', -0.8), 1.0, 0.012, -0.3)
pencil(W(Q, 'disagree', 'Two reports', -0.2), 0.01, -0.2, 0.8)
r1, r2 = W(Q, 'disagree', 'thirty-four'), W(Q, 'disagree', 'twenty-one')
knock(r1 - 0.3, 0.016, 0.22); knock(r2 - 0.3, 0.016, 0.72)
nylon(71, r1 + 0.6, 0.016, 0.0); nylon(66, r2 + 0.6, 0.016, 0.15)
for k, pan in enumerate([-0.85, 0.85, -0.35, 0.7]):
    tap(W(Q, 'clock', 'start', k * 0.25), 0.009, pan)
soft(42, W(Q, 'clock', 'Neither'), 0.02, 0.31)
paper(C(Q, 'define'), 0.026, 0.0, 0.6)
for word in ['complete application', 'new meter', 'Monday', 'Grace writes']:
    pencil(W(Q, 'define', word), 0.011, 0.0, 0.4)
tFr = W(Q, 'define', 'complete application'); nylon(74, tFr + 0.8, 0.018, -0.1)
knock(C(Q, 'define', 0.3), 0.009, 0.75)
for word in ['complete application', 'Monday']:
    press(W(Q, 'define', word, 0.4), 0.012)
tSm = C(Q, 'same')
swell(DMAJ, tSm, 3.0, 0.02)
for k in range(6):
    tap(tSm + 0.25 + k * 0.16, 0.006, 0.22 if k % 2 == 0 else 0.72)
press(tSm + 1.2, 0.016)
# 8. A home and an owner: G as the capabilities go up, with a knock for each; paper as each measure's note goes up, and a nylon note
#    as the last hangs under its capability; a knock for each owner; a low felt note for each as the number moves, and a short bowed
#    chord in D for what an owner does
O = 'home'
turn(GMAJ9, S0(O) + 0.2, 0.022, 0.0)
for i in range(8):
    knock(S0(O) + 0.2 + i * 0.06, 0.009, -0.82 + i * 0.234)
tap(W(O, 'home', 'home on the map'), 0.008, 0.0)
for k, (word, m, pan) in enumerate([('Interruptions', None, -0.61), ('Days to connect', None, 0.0), ('Households', 69, 0.61)]):
    t0 = W(O, 'homes', word, -0.1); paper(t0, 0.02, pan, 0.45)
    if m:
        nylon(m, t0 + 0.7, 0.016, pan)
for t0, pan in [(W(O, 'owner', 'Grace'), -0.61), (W(O, 'owner', 'Grace', 0.3), 0.0), (W(O, 'owner', 'head of retail'), 0.61)]:
    knock(t0, 0.012, pan)
acts = W(O, 'means', 'acts when')
for k, (m, pan) in enumerate(zip([50, 52, 57], [-0.61, 0.0, 0.61])):
    soft(m, acts + k * 0.3, 0.016, pan)
swell(DMAJ, W(O, 'means', 'An owner'), 3.0, 0.018)
# 9. By capability, not by request: D as the twenty-one go up and turn into reports, with muffled keys; a knock for the count; a low
#    roll as the wall is drawn, and a low note as it stands; air as the reports fly to their products; a knock and a nylon note for
#    each product, rising, the last on retail's side; knocks for the owners, muffled keys as the questions fan out, a low note for "its
#    own side"
B_ = 'build'
turn(DMAJ9, S0(B_) + 0.2, 0.022, 0.0)
for k in range(5):
    tap(S0(B_) + 0.2 + k * 0.14, 0.006, -0.7 + k * 0.35)
tBe = W(B_, 'reports', 'could become')
for k in range(6):
    tap(tBe + k * 0.15, 0.008, -0.7 + k * 0.28)
knock(W(B_, 'reports', 'twenty-one reports'), 0.014, 0.0)
dom = W(B_, 'group', 'the domain'); rise(dom - 0.2, 1.2, 0.022); soft(43, dom + 0.8, 0.018, 0.0)
four = W(B_, 'group', 'four data products'); air(four - 0.4, 1.4, 0.02)
for i, (m, pan) in enumerate(zip([62, 66, 69, 74], [-0.55, -0.55, -0.55, 0.5])):
    t0 = four + 0.2 + i * 0.25; knock(t0, 0.012, pan); nylon(m, t0 + 0.05, 0.016, pan)
for i, pan in enumerate([-0.55, -0.55, -0.55, 0.5]):
    knock(W(B_, 'each', 'one owner', i * 0.12), 0.009, pan)
for k in range(6):
    tap(W(B_, 'each', 'many questions', k * 0.11), 0.006, -0.1 if k % 2 == 0 else 0.85)
soft(45, W(B_, 'each', 'own side'), 0.018, 0.0)
# 10. Back at the trial well: the opening's strings, in D, and the celesta as the well is lit; the bucket dipped once in the hollow.
#     A knock for each part of the builders' chain as it comes, from the goal down to the measure, and a nylon note for the measure,
#     low; a muffled key for the builders, and the dashed line to the hollow; then the celesta, rising,
#     as the answer climbs from the measure to the goal, a soft press for its tick, and a note for "in time"
V = 'well'
strings(DMAJ, S0(V) + 0.2, 6.0, 0.024, bass=False)
cel(74, W(V, 'back', 'trial well', -0.1), 0.011, px(560))
dip(S0(V) + 1.9, 0.006, px(560))
tG = C(V, 'goal'); tDec = W(V, 'goal', 'A decision'); tMs = C(V, 'measure'); tMe = W(V, 'measure', 'And a measure')
for t0, y in [(tG + 0.1, 150), (tDec - 0.1, 290), (tMs + 0.1, 470), (tMe - 0.1, 614)]:
    knock(t0, 0.012, px(510))
nylon(62, tMe - 0.05, 0.016, px(510))
tap(W(V, 'goal', 'by the builders'), 0.008, px(560))
tUp = W(V, 'reach', 'reached', -0.6)
for k, m in enumerate([62, 66, 69, 74]):
    cel(m + 12, tUp + k * 0.25, 0.011, px(510))
press(tUp + 1.0, 0.014); cel(78, W(V, 'reach', 'in time', -0.2), 0.011, 0.0)
# 11. Questions that matter: G as the notes come back, with paper; a soft press as Grace confirms each measure, paper for the draft;
#     paper for the answer, with the celesta, as Tomás's note gets one, and a pencil as it's written and as the dot on his question
#     fills halfway; paper for the next question; a short bowed chord in D as the three notes glow; the celesta once, under the end
#     card, before the mark
Z = 'end'
turn(GMAJ9, S0(Z) + 0.3, 0.02, 0.0)
for d, pan in [(0.3, -0.55), (0.4, 0.62), (0.5, -0.55), (0.7, -0.55)]:
    paper(S0(Z) + d, 0.016, pan, 0.45)
press(W(Z, 'confirm', 'Grace', 0.3), 0.02); press(W(Z, 'confirm', 'definitions'), 0.018)
paper(W(Z, 'confirm', 'head of retail'), 0.016, -0.55, 0.4)
cA = C(Z, 'answer')
paper(cA, 0.026, 0.6, 0.5); cel(74, cA + 0.25, 0.011, 0.6)
pencil(cA + 0.2, 0.008, 0.6, 3.0); pencil(cA + 1.6, 0.011, 0.62, 0.4)
paper(W(Z, 'next', 'Next'), 0.022, 0.55, 0.5)
swell(DMAJ7, G(Z, 'breath', 0.2), 4.6, 0.02)
cel(78, G(Z, 'breath', 0.6), 0.011, 0.3)
mark(G(Z, 'breath', 1.4))
