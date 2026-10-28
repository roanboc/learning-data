# Off the shelf: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for a new series (PLAYBOOK.md: vary the sound itself): a soft brass choir, warm and unhurried, holds the
# chords; a low music box, small and close, marks the moments that land; and the series' own mark, four notes, 1-5-4-8, on one
# horn with the music box an octave above, plays at the title and the end. D, in open fifths, for the operating room before 2008;
# F major once the checklist holds, and for the university today.
# The sound since the author's review of the master data films (20 October 2026; PLAYBOOK.md §5): music plays under the opening,
# where the story from history is told, then comes in from time to time, at a chapter's turn, under a moment on screen or in a pause
# without words, never as a constant bed under the voice; and nothing in it trembles or pulses.
#  - The horns hold the chords all through the operating room's story, until the title; after that, only at each chapter's turn,
#    swelling in the pause between two chapters and let go as the new one's voice begins, under a few moments on screen, and from
#    the film's last line to the end card. One player to a note, held straight, without vibrato, and a note the next chord keeps is
#    held through the change: two players on one note would beat against each other, a slow pulse on a phone's speaker. The chords
#    are voiced with no two notes a semitone apart, and tuned pure over F.
#  - The music box has one tooth to a note, tuned as the horns are, and never sounds two notes a semitone apart.
#  - There's no pulse, even when the two reports disagree: each number has its note, and when both turn out right, their two
#    notes sound together, a third apart.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is sustained chords that come and go with the narration; nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed. Things
#    that drop into place (a card, a pin, a stamp) land about 0.1 s after they start to move, so their sound comes then.
# The music box means the same thing all through: three notes rising, 1-3-5, for a rule, a copy where the work happens and someone
# who checks; two notes rising a step, to the note just under home, for a question no one can answer yet; and two notes rising
# a third, A to C, when a check holds.
# And everything stays low and soft: wooden knocks, paper, pencils, cork pins and rubber stamps, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads
import itertools, json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan

# ---- this film's instruments ----
# the music's levels against the voice: the horns' chords as loud as the brass choir that held them under every chapter before
# the author's review (three players to a note, each at 0.036), one player to a note now
BED = 2.6
# the tuning: every note pure over F, the film's home. In equal temperament a held major third beats four to eight times a second, a
# tremble that a phone's speaker brings out, so, as in Which value wins, each pitch takes a just ratio over F. G, B, D and E flat can
# each take either of two (D is 5/3 over F, a fourth over A, but 27/16 a fifth over G at 9/8), and each chord takes, of its notes'
# ratios, the set whose partials beat least; a note held into the next chord keeps its tuning
RATIO = {0: (1,), 2: (9 / 8, 10 / 9), 4: (5 / 4,), 5: (4 / 3,), 6: (45 / 32, 25 / 18), 7: (3 / 2,), 9: (5 / 3, 27 / 16), 10: (16 / 9, 9 / 5), 11: (15 / 8,)}
def hz(m, r=None):
    """a note's frequency, tuned over F: r is the ratio its pitch takes, by default the first (and equal temperament for a pitch
    the film doesn't play)"""
    pc = (m - 65) % 12
    return mf(65) * (r or RATIO.get(pc, (2 ** (pc / 12),))[0]) * 2 ** ((m - 65) // 12)
def _bell(F):
    """how loud a horn's harmonic at F Hz is, played softly: round and dark, strongest below about 500 Hz, almost nothing above
    about 1.3 kHz"""
    return 1 / (1 + (F / 480) ** 2)
def rough(fs):
    """how much held horns at these frequencies beat against each other: each pair of partials a few hertz apart counts, most at
    six beats a second, by the softer of the two"""
    ps = [(h * f, h ** -0.6 * _bell(h * f)) for f in fs for h in range(1, 12) if h * f < 1400]; d = 0.0
    for i, (f1, a1) in enumerate(ps):
        for f2, a2 in ps[i + 1:]:
            df = abs(f2 - f1)
            if 0 < df < 40:
                d += min(a1, a2) * df / 6 * np.exp(1 - df / 6)
    return d
def player(m, sec, seed, f0=None):
    """one horn, played softly, holding note m (at f0 Hz, if given): it speaks with a breath of air and a slight rise into its
    pitch, its upper harmonics opening a moment after the lower; then held steady, without vibrato"""
    R = np.random.default_rng(seed); f0 = f0 or hz(m); x = tt(sec).astype(np.float64)
    ph = 2 * np.pi * np.cumsum(f0 * (1 - 0.004 * np.exp(-x / 0.05))) / SR
    s = np.zeros_like(x)
    for h in range(1, 12):
        F = h * f0
        if F > 1400:
            break
        s += np.sin(h * ph + R.uniform(0, 6.3)) * h ** -0.6 * _bell(F) * np.clip((x - 0.012 * h) / (0.07 + 0.02 * h), 0, 1)
    air = filt(noise(sec), 'band', (250, 1200)) * (0.012 + 0.05 * np.exp(-x / 0.08))
    return (s + air) * (1 + 0.03 * np.sin(2 * np.pi * R.uniform(0.05, 0.1) * x + R.uniform(0, 6.3)))
def hold(m, start, sec, n, g=0.03, rel=2.8, a=1.2, f=None):
    """note m held on a horn from start (at f Hz, if given), one of n in its chord: it swells in over a seconds, and is let go over
    rel seconds; low notes to the left and high to the right, as the players sit. One player to a note: two on one note beat against
    each other, and a phone's one speaker turns that into a slow pulse"""
    x = tt(sec); e = (np.clip(x / a, 0, 1) ** 1.5 * np.clip((sec - x) / rel, 0, 1)).astype(np.float32)
    put(filt((player(m, sec, m * 31 + int(start * 7), f) * e / n).astype(np.float32), 'low', 1300), start, g * BED, max(-0.5, min(0.5, (m - 52) / 26)))
_BED = []
def bed(keys, end, g=0.03, a=1.2, rel=2.8):
    """chords, each from its moment, until end: kept, so play_bed() plays the whole film's at once. Their notes swell in over a
    seconds and are let go over rel"""
    _BED.append((sorted(keys), end, g, a, rel))
def play_bed():
    """the film's chords on the horns, as Which value wins plays its sackbuts: a player whose note the next chord keeps holds it
    through the change, the others let go just after it, and the new notes come in a little before it, so they have spoken by
    then. A note a semitone from one that's let go comes in at the change itself, and the other is let go quickly, as one player
    moving a step would: the two never sound together, where they would rub. So does a note whose overtones would beat against one
    that's let go, where the next chord tunes a G or a D the other way. A note that leaves for a passing chord and comes straight
    back is let go quickly enough to come back in, so it never sounds twice at once. A note too low for the horns is played an
    octave up. Each chord is tuned pure (rough()), around the notes it keeps from the chord before"""
    K = [(t, sorted(set(m + 12 if m < 38 else m for m in ch)), end, g, a, rel) for keys, end, g, a, rel in _BED for t, ch in keys]
    K.sort(key=lambda k: k[0])
    on = lambda j: j + 1 < len(K) and K[j + 1][0] <= K[j][2]  # the next chord comes while this one still sounds
    H = []  # each note held: its pitch, when it comes in, when it is let go, its chord's size and level, how long letting go takes,
    # how long swelling in takes, and its frequency
    F = []  # each chord's notes, tuned
    for i, (t0, ch, end, g, a, rel) in enumerate(K):
        prev = K[i - 1][1] if i and on(i - 1) else []
        keep = {m: F[i - 1][m] for m in ch if m in prev}; new = [m for m in ch if m not in prev]
        rs = min(itertools.product(*[RATIO.get((m - 65) % 12, (None,)) for m in new]),
                 key=lambda rs: rough(list(keep.values()) + [hz(m, r) for m, r in zip(new, rs)]))
        F.append({**keep, **{m: hz(m, r) for m, r in zip(new, rs)}})
        for m in ch:
            if m in prev:
                continue
            j = i
            while on(j) and m in K[j + 1][1]:
                j += 1
            H.append([m, t0 - 0.6, K[j + 1][0] if on(j) else K[j][2], len(ch), g, K[j][5], a, F[i][m]])
    def clash(f1, f2):
        """two notes whose overtones, up to the sixth, almost meet: a few hertz and under 3% apart, so they would beat"""
        return any(0.3 <= abs(a * f1 - b * f2) <= min(12, 0.03 * min(a * f1, b * f2))
                   for a in range(1, 7) for b in range(1, 7) if max(a * f1, b * f2) < 1400)
    for o in H:
        for i in H:
            if o[1] < i[1] < o[2] + o[5] and (abs(o[0] - i[0]) == 1 or i[1] > o[2] - 0.61 and clash(o[7], i[7])):
                if i[1] < o[2]:  # it comes in at a change: a step, or a retuning
                    i[1], i[6], o[5] = o[2] - 0.15, min(i[6], 0.45), 0.35
                else:  # it comes in as the other is let go
                    o[5] = max(0.25, i[1] + 0.3 - o[2])
    for h in H:
        back = [b[1] for b in H if b[0] == h[0] and h[2] <= b[1] < h[2] + h[5]]
        if back:
            h[5] = max(0.25, min(back) - h[2])
    for m, s, t1, n, g, rel, a, f in H:
        hold(m, s, t1 - s + rel, n, g, rel, a, f)
def horn(m, start, sec, g=0.05, pan=0.0):
    """one horn, for the mark: a breath in, round and warm, held straight"""
    s = player(m, sec, m * 17 + int(start * 5)) * env(sec, 0.09, min(0.6, sec * 0.45))
    put(norm(filt(s.astype(np.float32), 'low', 1500)), start, g, pan)
def comb(m, start, g=0.05, pan=0.0, sec=2.6):
    """the music box, low: one steel tooth to a note, plucked, its high partial gone at once"""
    f = hz(m); x = tt(sec).astype(np.float64)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 1.25)
    s = s + 0.22 * np.sin(2 * np.pi * f * 5.93 * x) * np.exp(-x * 16) + 0.08 * np.sin(2 * np.pi * f * 2 * x) * np.exp(-x * 4)
    s = s * np.minimum(1, x / 0.002) + 0.06 * filt(noise(sec), 'band', (700, 2000))[:len(x)] * np.exp(-x * 260)
    put(norm(filt(s.astype(np.float32), 'low', 2400)), start, g, pan)
def mark(start, root=53, g=0.07):
    """the series' four notes, 1-5-4-8: one horn, the music box an octave above"""
    for i, iv in enumerate([0, 7, 5, 12]):
        horn(root + iv, start + i * 0.45, 1.0 if i < 3 else 2.8, g * 0.75, (i - 1.5) * 0.12)
        comb(root + 12 + iv, start + i * 0.45, g * 0.6, (i - 1.5) * 0.15, sec=3.2 if i == 3 else 2.4)
def three(times, g=0.05, pans=(-0.4, 0.4, 0.0)):
    """a rule, a copy where the work happens, someone who checks: 1-3-5, rising"""
    for k, t in enumerate(times):
        comb([65, 69, 72][k], t, g, pans[k])
def ask(s, g=0.04):
    """a question no one can answer yet: two notes rising a step, to the E just under home, and left there"""
    comb(62, s, g, -0.3); comb(64, s + 0.3, g, 0.3)

# ---- soft sounds, all low-passed ----
def knock(s, g=0.03, pan=0.0, f=240):
    """a soft wooden knock: a sign, a board or a speech bubble arriving"""
    s_knock(s, g, pan, f)
def tap(s, g=0.016, pan=0.0):
    """a muffled pen or key"""
    s_tap(s, g, pan)
def paper(s, g=0.03, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def rubber(s, g=0.045, pan=0.0):
    """a rubber stamp on paper: a padded thump, and the paper under it"""
    x = tt(0.25); X(norm((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 22) + 0.5 * filt(noise(0.25), 'band', (200, 1200))[:len(x)] * np.exp(-x * 45)).astype(np.float32)), s, g, pan)
def pin(s, g=0.03, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g, pan, 360); s_tap(s + 0.004, g * 0.5, pan)
def slide(s, g=0.022, pan=0.0, sec=0.42):
    """a binder drawn forward along a wooden shelf: a low, rough slide, and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5 * (1 + 0.4 * np.sin(2 * np.pi * 31 * x)), s, g, pan)
    s_knock(s + sec * 0.92, g * 0.5, pan, 200)
def air(s, sec=0.9, g=0.02, pan=0.0):
    """a breath of air, for an arc drawn or a ring going round"""
    s_air(s, sec, g, pan)

# chords (MIDI note numbers), low to high: D in open fifths for the operating room before 2008; F major for the checklist that
# holds, and for today. No two notes a semitone apart, where they would rub
D5 = [38, 45, 50, 57]; DM = [38, 45, 50, 53, 57]; C5 = [36, 43, 48, 55]; GADD = [43, 50, 55, 59, 62]; ASUS = [45, 52, 57, 62]
FMAJ9 = [41, 48, 52, 55, 57]; BBMAJ9 = [46, 53, 57, 60, 62]; DM9 = [38, 45, 53, 60, 64]; CSUS = [36, 43, 48, 53, 55]
GM7 = [43, 50, 53, 58]; A7SUS = [45, 52, 55, 62]
# under the mark, F in open fifths with the D above: the mark's F, C, B flat and F, on the horn and the music box, never a
# semitone from a note held under them, as they would be from an A or an E
FOPEN = [41, 48, 53, 60, 62]

# the voice's lines, chapter by chapter: when each starts and ends
_V = {s: [(G(s, v['id']), G(s, v['id']) + _DUR[s + '/' + v['id']]) for v in _NARR[s]['vo']] for s in _NARR}
_ORDER = list(_NARR)
def first(J):
    """when a chapter's voice begins"""
    return _V[J][0][0]
def turn(J, chord, g=0.03):
    """a chapter's turn: its chord comes in as the chapter before falls silent, swells in the pause between them, and is let go as
    the new chapter's voice begins, so the voice goes on alone"""
    bed([(_V[_ORDER[_ORDER.index(J) - 1]][-1][1] + 0.9, chord)], first(J), g)
def moment(t0, t1, chord, g=0.03):
    """a chord under a moment on screen, or in a pause without words: it comes in at t0 and is let go at t1"""
    bed([(t0, chord)], t1, g)
def even(a, b, chords):
    """chords one after another, from a to b, each as long"""
    return [(a + (b - a) * i / len(chords), ch) for i, ch in enumerate(chords)]

# 1. The checklist: the opening, with the horns all through it. D in open fifths for the operating room before 2008, D minor as the
#    steps are named, darkening to G minor as they're skipped; D minor again for what patients paid, and A, suspended, with its
#    seventh, as something had to change; C, open, for the study in 2008; D again, bare, as the team pauses,
#    and A, suspended, while the nurse holds them; F major once deaths fall, B flat as it all works together, F again for the one who
#    checks; the mark under the title, over F in open fifths, held until the next chapter's voice. A pencil's tap as each step is
#    named, and a soft stroke as each is struck through; a binder drawn from the guidelines' shelf; a tap as each harm is named;
#    paper as the year turns; a pin as
#    each hospital drops onto the map; a knock as each pause lights, and for each of the nurse's words; a pen's tap for each step
#    confirmed, and two notes rising as the antibiotic is given; the card, and a music box note for each number; 1-3-5 for the
#    list, the copy and the one who checks; a pen's tap as the nurse ticks, and for each box of the sign out
J = 'checklist'
close = G(J, 'breath', -0.7)
bed([(S0(J), D5), (G(J, 'steps', -0.4), DM), (G(J, 'skipped', -0.4), GM7), (G(J, 'paid', -0.4), DM), (G(J, 'change', -0.4), A7SUS),
     (G(J, 'y2008', -0.4), CSUS), (G(J, 'pause', -0.4), D5),
     (G(J, 'hold', -0.4), ASUS), (G(J, 'fell', -0.4), FMAJ9), (G(J, 'worked', -0.4), BBMAJ9), (W(J, 'three', 'someone', -0.3), FMAJ9),
     (close, FOPEN)], first('shelf'), 0.03, 1.5, 3.0)
KNEW = [700, 580, 1450]  # where each step's note is, across the frame (OS_KNEW)
for word, off, x in zip(['right', 'antibiotic', 'sponge'], [-0.1, -0.15, -0.15], KNEW):
    tap(W(J, 'steps', word, off + 0.1), 0.016, P(x))
slide(W(J, 'skipped', 'written', -0.2), 0.022, P(650), 0.6)
for k, x in enumerate(KNEW):
    paper(W(J, 'skipped', 'often', -0.05 + 0.32 * k), 0.016, P(x), 0.35)
for word, x in [('infections', 752), ('mistakes', 1116), ('deaths', 1532)]:  # each harm's tag, where it is in the frame
    tap(W(J, 'paid', word, -0.1 + 0.1), 0.016, P(x))
paper(G(J, 'y2008', -0.35), 0.022, -0.7, 0.45)
for k, x in enumerate([254, 483, 906, 1098, 1318, 1102, 1552, 1839]):  # the eight hospitals' cities, west to east as they drop
    pin(W(J, 'y2008', 'study', -0.1 + 0.26 * k + 0.1), 0.024 + 0.004 * (k % 3), P(x))
for k, x in enumerate([560, 960, 1360]):
    knock(G(J, 'pause', -0.05 + 0.62 * k), 0.022, P(x), 300)
knock(W(J, 'pause', 'read', 0.0), 0.026, P(1240))
for word, off in [('step', -0.1), ('confirmed', -0.05)]:
    tap(W(J, 'hold', word, off + 0.15), 0.018, 0.0)
knock(W(J, 'hold', 'hold', -0.1), 0.028, P(1300))
comb(69, W(J, 'hold', 'done', -0.1), 0.04, -0.4); comb(72, W(J, 'hold', 'done', 0.04), 0.04, -0.3)
paper(G(J, 'fell', -0.2), 0.026, 0.0, 0.5)
comb(60, W(J, 'fell', 'one point', -0.1), 0.045, -0.2); comb(67, W(J, 'fell', 'zero point', -0.1), 0.045, 0.2)
three([W(J, 'three', 'one agreed'), W(J, 'three', 'a copy'), W(J, 'three', 'someone')])
tap(G(J, 'breath', -1.05), 0.014, P(1676))
for k in range(3):
    tap(G(J, 'breath', 0.25 + 0.45 * k + 0.15), 0.02, -0.2 + 0.2 * k)
mark(G(J, 'breath', 2.1))
# 2. The shelf: the opening's last chord let go as the voice begins. A music box note for Yusuf's name; a knock for the shelf's sign;
#    a low note for the score; a pen for each TBC; the rubber stamp on the minutes; a knock for David's question
J = 'shelf'
comb(65, G(J, 'starts', 0.3), 0.045, 0.0)
knock(W(J, 'shelf', 'thirty', -0.2), 0.03, -0.3)
comb(57, W(J, 'shelf', 'maturity'), 0.04, 0.2)
for n in range(8):
    tap(W(J, 'chart', 'half', -0.2 + 2.2 * n / 8), 0.016, -0.3 + 0.08 * n)
rubber(W(J, 'council', 'once', 0.005), 0.045)
knock(G(J, 'brief', 0.1), 0.026, 0.4, 300)
# 3. Two numbers: no chord at the turn, in so short a chapter. A music box note for each number, F for the census and A for the
#    draft, apart; and the question, with a knock as it goes up, ringing into the pause
J = 'numbers'
comb(65, W(J, 'census', 'four', -0.1), 0.05, -0.3)
comb(69, W(J, 'draft', 'four', -0.1), 0.05, 0.3)
ask(G(J, 'which')); knock(G(J, 'which'), 0.026, 0.0, 200)
# 4. Who decides? The turn on C, open, as the question rings. The two numbers' notes together, a third apart, as both are right; the chip and the new row on
#    the glossary; a pin for Monday's card; knocks for the two definitions; air as the arc is drawn; a knock as Jun reaches Yusuf's
#    office, and the question; three notes that don't resolve for three answers; the TBC stamp; and the operating room before the
#    checklist, a pencil's tap as each one's step is named, and the question no one can answer yet, where no one checks them all
J = 'decides'
turn(J, CSUS)
right = W(J, 'both', 'right')
comb(65, right, 0.045, -0.2); comb(69, right + 0.08, 0.045, 0.3)
knock(W(J, 'monday', 'the word', 0.08), 0.024, 0.3, 320)
tap(W(J, 'monday', 'microcredentials', 0.0), 0.02, 0.2)
pin(G(J, 'before', 0.0), 0.03, 0.0)
knock(G(J, 'gov', 0.2), 0.026, -0.3); knock(W(J, 'gov', 'which', 0.0), 0.026, 0.3, 280)
air(W(J, 'gov', 'which'), 0.9, 0.018, 0.0)
knock(W(J, 'ask', 'takes', 0.5), 0.024, 0.15, 260); ask(W(J, 'ask', 'who', 0.05))
for k, word in enumerate(['Mei', 'Jun', 'Planning']):
    comb([69, 67, 64][k], W(J, 'answers', word, -0.1), 0.045, [-0.5, 0.5, 0.0][k])
rubber(W(J, 'tbc', 'to be', -0.07), 0.05)
for k, x in enumerate([360, 930, 1180]):
    tap(W(J, 'room', 'everyone', 0.32 * k + 0.1), 0.014, P(x))
ask(W(J, 'room', 'no one'), 0.035)
# 5. What governance is for: the turn on B flat. Paper as each note is stuck beside policy 12; a knock for "deciding who decides"; the
#    horns as each decision goes out to an office and lands; 1-3-5 for the checklist again, the page, the copy in the room and the
#    nurse; a knock as governance's card goes up, and a pen for each tick on the decisions
J = 'for'
turn(J, BBMAJ9)
for word in ['who', 'how']:
    paper(W(J, 'doesnt', word, -0.1), 0.022, 0.2, 0.3)
knock(W(J, 'for', 'deciding', -0.1), 0.028, 0.0)
moment(W(J, 'for', 'making', -0.2), W(J, 'for', 'making', 1.0), [53, 60, 65, 69], 0.024)
three([W(J, 'like', 'a rule'), W(J, 'like', 'a copy'), W(J, 'like', 'someone')])
knock(W(J, 'mgmt', 'Governance', -0.1), 0.028, -0.2)
for k in range(4):
    tap(W(J, 'mgmt', 'checks', 0.12 * k + 0.1), 0.014, [-0.6, -0.3, 0.3, 0.6][k])
# 6. Listen first: the turn on G minor. The blank page turned over; a knock as his question goes up on the floor, and as each
#    answer comes in its office; a pin for each answer on his board; the horns as the shelf lights; a key as the rule is checked,
#    two notes rising as it holds, and the question no one can answer yet where no rule has been agreed
J = 'listen'
turn(J, GM7)
paper(W(J, 'ask', "doesn't", 0.3), 0.03, 0.1, 1.0)
knock(W(J, 'ask', 'what slows', -0.1), 0.026, 0.0, 300)
for lid, off, pan in [('jun', 0.2, 0.1), ('mei', 0.2, -0.35), ('sam', 0.2, -0.4), ('plan', 0.1, -0.4)]:
    knock(G(J, lid, off), 0.024, pan, 300)
for k in range(4):
    pin(G(J, 'binder', -0.2 + 0.45 * k + 0.08), 0.03, [-0.5, -0.18, 0.19, 0.55][k])
moment(W(J, 'binder', 'They', -0.3), W(J, 'binder', 'They', 1.5), [53, 60, 65, 69], 0.024)
tap(W(J, 'tools', 'carry', -0.3), 0.018, 0.1)
comb(69, W(J, 'tools', 'carry', 0.25), 0.045, -0.3); comb(72, W(J, 'tools', 'carry', 0.39), 0.045, -0.2)
ask(W(J, 'tools', "can't", -0.15), 0.035)
# 7. Where does it run? The turn on A, suspended. The binder's cover swung over and laid down; the note pressed on; a highlighter's
#    stroke along each line as it's sorted, and a short one for each colour of his key; the pencil through the line that can go
J = 'runs'
turn(J, A7SUS)
opens = W(J, 'takes', 'opens', -0.2)
paper(opens, 0.028, 0.2, 0.8); knock(opens + 0.85, 0.02, -0.1, 200)
paper(W(J, 'takes', 'where', -0.35), 0.022, -0.4, 0.3); tap(W(J, 'takes', 'where', -0.12), 0.016, -0.4)
for lid, word, off in [('runs', 'run in', -0.1), ('owned', 'decisions', -0.1), ('go', 'go', -0.2)]:
    paper(W(J, lid, word, off), 0.014, 0.5, 0.3)
for k, (lid, word) in enumerate([('runs', 'a field'), ('runs', 'a check'), ('runs', 'every night'), ('runs', 'a label'), ('owned', 'owns'), ('owned', 'writes'), ('go', 'go')]):
    paper(W(J, lid, word, -0.45), 0.02, -0.2, 0.8 if k == 4 else 0.45)
paper(W(J, 'go', 'go', 0.35), 0.02, -0.3, 0.35)
# 8. What's worth keeping: the turn on F, fading as his board catches the light; a pin as each gold card goes up under an answer, with
#    a music box note rising for each; on the floor, a knock as the owners decide, paper as a copy lands with each team, and a tap
#    for each tick as governance checks
J = 'keep'
turn(J, FMAJ9)
for k, (lid, word) in enumerate([('rules', 'Rules'), ('words', 'One'), ('classes', 'A class'), ('owners', 'a list')]):
    pin(W(J, lid, word, 0.08), 0.032, [-0.5, -0.18, 0.19, 0.55][k])
    comb([65, 69, 72, 77][k], W(J, lid, word, 0.08), 0.045, [-0.5, -0.18, 0.19, 0.55][k])
knock(W(J, 'decide', 'Owners', -0.05), 0.026, -0.5, 300)
for k in range(2):
    paper(W(J, 'act', 'use it', 0.2 + 0.14 * k), 0.016, 0.3 + 0.3 * k, 0.3)
for k in range(4):
    tap(W(J, 'act', 'kept', -0.1 + 0.12 * k), 0.014, [-0.6, -0.3, 0.3, 0.6][k])
# 9. The series: the turn on B flat, swelling in the wordless pause after the floor. A music box note rising as each of the nine
#    binders lights; the first slid off the shelf; a knock as Noor's room comes in, a pin for each film on her map, a knock for the
#    data team's board and a pin for each film on the tools; after the last line, F in open fifths under the end card, and the
#    mark
J = 'series'
turn(J, BBMAJ9)
for k, m in enumerate([60, 62, 65, 67, 69, 72, 74, 77, 79]):
    comb(m, W(J, 'next', 'nine', -0.1 + k * 0.12 + 0.05), 0.036, 0.3 + 0.05 * k)
slide(W(J, 'next', 'follows', 0.1), 0.026, 0.4, 0.45)
knock(G(J, 'map', -0.25), 0.028, 0.0)
for k in range(3):
    pin(W(J, 'map', 'on the', 0.3 * k + 0.08), 0.028, 0.3)
knock(G(J, 'tools', -0.25), 0.028, 0.0)
for k in range(6):
    pin(W(J, 'tools', 'six', -0.1 + 0.3 * k + 0.08), 0.028, [-0.47, 0.0, 0.47][k % 3])
bed([(_V[J][-1][1] + 0.2, FOPEN)], TOT + 1.0, 0.032, 1.5, 3.0)
mark(G(J, 'breath', 0.5))

# and the chords, where they come in
play_bed()
