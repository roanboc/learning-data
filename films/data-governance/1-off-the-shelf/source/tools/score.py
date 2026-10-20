# Off the shelf: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for a new series (PLAYBOOK.md: vary the sound itself): a soft brass choir, warm and unhurried, holds the
# chords; a low music box, small and close, marks the moments that land; and the series' own mark, four
# notes, 1-5-4-8, on one horn with the music box an octave above, plays at the title and the end. D dorian, in open fifths, for the
# market town from 1215 to 1871; F major once the measures finally hold, and for the university today.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the chapters; nothing repeats in the background.
#  - The one exception is feeling: when the two reports disagree, a low, muted pulse (music.py's urgent()) rises under the scene,
#    leans on the semitone, and fades out once Yusuf finds that both are right. It stays below about 1 kHz.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed. Things
#    that drop into place (a card, a pin, a stamp) land about 0.1 s after they start to move, so their sound comes then.
# The music box means the same thing all through: three notes rising, 1-3-5, for a rule, a copy where the work happens and someone
# who checks; two notes a semitone apart for a question no one can answer yet; a note that's a little out of tune for each bushel.
# And everything stays low and soft: wooden knocks, paper, cork pins, rubber stamps and a mallet's thud, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def rel(sid, t):
    """a moment in the film, as seconds into its chapter"""
    return t - S0(sid)

# ---- this film's instruments ----
HORN = (1.0, 0.62, 0.36, 0.2, 0.1, 0.05)  # a horn's harmonics, the lowest strongest
def _harm(ph, w):
    """the sum of w[k-1] sin(k ph), k = 1, 2, ...: one sine and one cosine for every harmonic, by sin((k+1)p) = 2cos(p)sin(kp) - sin((k-1)p)"""
    c2 = 2 * np.cos(ph); s0 = np.zeros_like(ph); s1 = np.sin(ph); out = w[0] * s1
    for a in w[1:]:
        s0, s1 = s1, c2 * s1 - s0; out = out + a * s1
    return out
def horns(ch, start, sec, g=0.036):
    """the bed: a soft brass choir, each chord held by three players a little apart across the stereo field, each breathing on their own,
    with a little of the air through their horns"""
    x = np.arange(max(1, int(sec * SR))) / SR; e = env(sec, 1.8, 3.0)
    for j, (pan, det) in enumerate(((-0.7, 0.9976), (0.7, 1.0024), (0.0, 1.0))):
        sw = 1 + 0.07 * np.sin(2 * np.pi * (0.05 + 0.013 * j) * x + j)
        s = filt((sum(_harm(2 * np.pi * mf(m) * det * x, HORN) for m in ch) / len(ch)).astype(np.float32), 'low', 1500)
        s = s + 0.006 * filt(noise(sec), 'band', (1200, 6000))[:len(x)]
        put((s * e * sw).astype(np.float32), start, g * (0.7 if pan == 0 else 1), pan)
def horn(m, start, sec, g=0.05, pan=0.0):
    """one horn, for the mark: a breath in, round and warm, and a slow vibrato once the note is held"""
    f = mf(m); x = np.arange(max(1, int(sec * SR))) / SR; vib = 1 + 0.0035 * np.sin(2 * np.pi * 4.8 * x) * np.clip((x - 0.25) / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = _harm(ph, HORN) + 0.03 * filt(noise(sec), 'band', (f, min(3 * f, 1800)))[:len(x)] * np.exp(-x * 18)
    put(norm(filt((s * env(sec, 0.09, min(0.6, sec * 0.45))).astype(np.float32), 'low', 1500)), start, g, pan)
def comb(m, start, g=0.05, pan=0.0, sec=2.6):
    """the music box, low: a steel tooth plucked, tuned in a pair a hair apart, its high partial gone at once"""
    f = mf(m); x = np.arange(max(1, int(sec * SR))) / SR
    s = (np.sin(2 * np.pi * f * x) + 0.5 * np.sin(2 * np.pi * f * 1.0023 * x + 0.7)) * np.exp(-x * 1.25)
    s = s + 0.22 * np.sin(2 * np.pi * f * 5.93 * x) * np.exp(-x * 16) + 0.08 * np.sin(2 * np.pi * f * 2 * x) * np.exp(-x * 4)
    s = s * np.minimum(1, x / 0.002) + 0.06 * filt(noise(sec), 'band', (700, 2000))[:len(x)] * np.exp(-x * 260)
    put(norm(filt(s.astype(np.float32), 'low', 2400)), start, g, pan)
def mark(start, root=53, g=0.07):
    """the series' four notes, 1-5-4-8: one horn, the music box an octave above"""
    for i, iv in enumerate([0, 7, 5, 12]):
        horn(root + iv, start + i * 0.45, 1.0 if i < 3 else 2.8, g * 0.75, (i - 1.5) * 0.12)
        comb(root + 12 + iv, start + i * 0.45, g * 0.6, (i - 1.5) * 0.15, sec=3.2 if i == 3 else 2.4)
def bed(sid, chords, a=None, b=None, g=0.036, bassg=0.016):
    """the chapter's chords on the brass choir, from a to b seconds into it, each starting 2 s early and lasting 4 s longer"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        horns(ch, s0 + i * d - 2.0, d + 4.0, g)
        if bassg:
            drone(ch[0] - 12, s0 + i * d - 2.0, d + 4.0, bassg, 'warm')
def swell(ch, s, sec=3.0, g=0.018):
    """the brass choir swelling for a moment, as something lights up"""
    horns(ch, s, sec, g)

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
def press(s, g=0.07, pan=0.0):
    """a mallet on a steel punch: a low thud and a dull knock, nothing bright"""
    x = tt(0.5); X(norm((np.sin(2 * np.pi * 72 * x) * np.exp(-x * 10) + 0.35 * filt(noise(0.5), 'band', (120, 800))[:len(x)] * np.exp(-x * 40)).astype(np.float32)), s, g, pan)
    s_knock(s + 0.005, g * 0.45, pan, 170)
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
def clink(s, g=0.03, pan=0.0):
    """a brass weight set down in a scale's pan: a short, low ring, darkened"""
    x = tt(0.6); f = 410
    X(norm(filt((np.sin(2 * np.pi * f * x) * np.exp(-x * 7) + 0.4 * np.sin(2 * np.pi * f * 2.32 * x) * np.exp(-x * 11) + 0.2 * np.sin(2 * np.pi * f * 4.1 * x) * np.exp(-x * 18)).astype(np.float32), 'low', 1800, 4)), s, g, pan)
def air(s, sec=0.9, g=0.02, pan=0.0):
    """a breath of air, for an arc drawn or a ring going round"""
    s_air(s, sec, g, pan)
def three(times, g=0.05, pans=(-0.4, 0.4, 0.0)):
    """a rule, a copy where the work happens, someone who checks: 1-3-5, rising"""
    for k, t in enumerate(times):
        comb([65, 69, 72][k], t, g, pans[k])
def ask(s, g=0.04):
    """a question no one can answer yet: two notes a semitone apart"""
    comb(64, s, g, -0.3); comb(65, s, g, 0.3)

# chords (MIDI note numbers): D dorian in open fifths for the market town; F major for the measures that hold, and for today
D5 = [38, 45, 50, 57]; DM = [38, 45, 50, 53, 57]; C5 = [36, 43, 48, 55]; GADD = [43, 50, 55, 59, 62]; ASUS = [45, 52, 57, 62]
FMAJ9 = [41, 48, 52, 55, 57]; BBMAJ9 = [46, 53, 57, 60, 62]; DM9 = [38, 45, 53, 60, 64]; CSUS = [36, 43, 48, 53, 55]
GM7 = [43, 50, 53, 58]; AM7 = [45, 52, 55, 60]; BBMAJ7 = [46, 53, 57, 62]; A7SUS = [45, 52, 55, 62]

# 1. One measure: open fifths in D for 1215, the charter read again as each year turns; a major chord for the king's standards;
#    a music box out of tune for each bushel; F major once it all works together, 1-3-5 for the law, the copy and the inspector;
#    a weight set in the pan, the mallet on the punch twice, the last mark close; the mark under the title
yrs = [G('measure', 'repeat', 0.2 + 1.3 * i) for i in range(4)]
hall, y1871, shop, close = G('measure', 'kings', -0.4), W('measure', 'county', 'In eighteen', -0.5), G('measure', 'worked', -0.4), G('measure', 'breath', -1.8)
bed('measure', [D5, DM], 0, rel('measure', yrs[0]))
bed('measure', [C5, DM], rel('measure', yrs[0]), rel('measure', hall))
bed('measure', [GADD], rel('measure', hall), rel('measure', y1871))
bed('measure', [DM, ASUS], rel('measure', y1871), rel('measure', shop))
bed('measure', [FMAJ9, BBMAJ9], rel('measure', shop), rel('measure', close))
bed('measure', [FMAJ9], rel('measure', close), None, g=0.04)
paper(G('measure', 'quote', -0.1), 0.03, -0.1, 0.6)
for y in yrs:
    paper(y, 0.028, -0.3, 0.45)
comb(62, W('measure', 'kings', 'standards'), 0.05, 0.2)
for i, m in enumerate([62, 62.7, 61.4, 63.5, 61.8, 64.2]):
    comb(m, W('measure', 'county', 'bushel', -0.3 + 2.2 * i / 7), 0.045, -0.4 + i * 0.16)
knock(W('measure', 'county', 'thirty'), 0.03, 0.0, 220)
three([G('measure', 'three'), W('measure', 'three', 'a copy'), W('measure', 'three', 'an inspector')])
clink(W('measure', 'three', 'checked', 0.5), 0.03, 0.1)
for off in [0.19, 0.79]:
    press(W('measure', 'three', 'again and', off), 0.06, 0.1)
press(G('measure', 'breath', -0.555), 0.085)
mark(G('measure', 'breath', 1.0))
# 2. The shelf: a music box note for Yusuf's name; a knock for the shelf's sign; a low note for the score; a pen for each TBC;
#    the rubber stamp on the minutes; a knock for David's question
bed('shelf', [FMAJ9, BBMAJ9, DM9, CSUS])
comb(65, G('shelf', 'starts', 0.3), 0.045, 0.0)
knock(W('shelf', 'shelf', 'thirty', -0.2), 0.03, -0.3)
comb(57, W('shelf', 'shelf', 'maturity'), 0.04, 0.2)
for n in range(8):
    tap(W('shelf', 'chart', 'half', -0.2 + 2.2 * n / 8), 0.016, -0.3 + 0.08 * n)
rubber(W('shelf', 'council', 'once', 0.005), 0.045)
knock(G('shelf', 'brief', 0.1), 0.026, 0.4, 300)
# 3. Two numbers: a pulse under the disagreement, leaning on the semitone, until both turn out right; a music box note for each
#    number, a semitone apart; both together for the question
bed('numbers', [DM, BBMAJ7, GM7, A7SUS])
urgent(G('numbers', 'week', -0.2), W('decides', 'both', 'right', 0.3), bpm=96, root=38, g=0.05, steps=(0, 0, 1, 0))
comb(64, W('numbers', 'census', 'four', -0.1), 0.05, -0.3)
comb(65, W('numbers', 'draft', 'four', -0.1), 0.05, 0.3)
ask(G('numbers', 'which')); knock(G('numbers', 'which'), 0.026, 0.0, 200)
# 4. Who decides? Two ticks, a third apart, as both are right; the chip and the new row on the glossary; a pin for Monday's card;
#    knocks for the two definitions; air as the arc is drawn, and the question; three notes that don't resolve for three answers;
#    a swell as the chart's row lights; the TBC stamp
right = W('decides', 'both', 'right')
bed('decides', [DM9], 0, rel('decides', right))
bed('decides', [FMAJ9, CSUS, DM9, BBMAJ9, GM7, CSUS], rel('decides', right), None)
comb(65, right, 0.045, -0.2); comb(69, right + 0.08, 0.045, 0.3)
knock(W('decides', 'monday', 'the word', 0.08), 0.024, 0.3, 320)
tap(W('decides', 'monday', 'microcredentials', 0.0), 0.02, 0.2)
pin(G('decides', 'before', 0.0), 0.03, 0.0)
knock(G('decides', 'gov', 0.2), 0.026, -0.3); knock(W('decides', 'gov', 'ours', 0.0), 0.026, 0.3, 280)
air(W('decides', 'gov', 'Who'), 0.9, 0.018, 0.0); ask(W('decides', 'gov', 'Who', 0.6))
for k, word in enumerate(['Mei', 'Jun', 'Planning']):
    comb([69, 67, 64][k], W('decides', 'answers', word, -0.1), 0.045, [-0.5, 0.5, 0.0][k])
swell([53, 60, 65], G('decides', 'tbc', -0.1), 2.4, 0.016)
rubber(W('decides', 'tbc', 'to be', -0.07), 0.05)
# 5. What governance is for: paper as each note is stuck beside policy 12; a knock for "deciding who decides"; the choir swells as
#    each decision goes out to an office, and a note as they land; 1-3-5 in the shop again, and the brass weight set in the pan; a
#    knock as governance's card goes up, a pen for each tick on the decisions; a chord as the four offices get on with the work
bed('for', [DM9, BBMAJ9, FMAJ9, CSUS, FMAJ9])
for word in ['who', 'how']:
    paper(W('for', 'doesnt', word, -0.1), 0.022, 0.2, 0.3)
knock(W('for', 'for', 'deciding', -0.1), 0.028, 0.0)
swell([53, 60, 65, 69], W('for', 'for', 'making', -0.2), 3.4, 0.02)
comb(72, W('for', 'for', 'making', 0.6), 0.04, 0.2)
three([W('for', 'like', 'a rule'), W('for', 'like', 'a copy'), W('for', 'like', 'someone')])
clink(W('for', 'like', 'someone', 0.3), 0.026, 0.1)
knock(W('for', 'mgmt', 'Governance', -0.1), 0.028, -0.2)
for k in range(4):
    tap(W('for', 'mgmt', 'checks', 0.12 * k + 0.1), 0.014, [-0.6, -0.3, 0.3, 0.6][k])
for k, m in enumerate([60, 64, 67]):
    comb(m, W('for', 'mgmt', 'Management', -0.2 + 0.06 * k), 0.035, -0.3 + 0.3 * k)
# 6. Governance at the centre: a knock as DAMA's book is set down; a music box note as each area of its wheel springs in, rising; a
#    horn as governance lights at the centre; the choir as gold joins them; air as the ring goes round for DCAM; knocks for the
#    standards; the choir again as the offices light round the governance office
bed('wheel', [BBMAJ9, FMAJ9, GM7, CSUS])
knock(W('wheel', 'body', 'body', -0.2), 0.03, 0.0)
for k, m in enumerate([60, 62, 65, 67, 69, 72, 74, 77, 79, 81]):
    comb(m, W('wheel', 'wheel', 'eleven', k * 0.24), 0.042 - 0.0015 * k, -0.5 + 0.11 * k)
horn(53, W('wheel', 'wheel', 'governance', -0.1), 1.8, 0.03)
swell([53, 60, 65, 69], W('wheel', 'wheel', 'where', -0.2), 3.0, 0.018)
air(W('wheel', 'others', 'Dee', -0.2), 1.4, 0.018, 0.3); knock(W('wheel', 'others', 'Dee', -0.1), 0.026, 0.4)
knock(W('wheel', 'others', 'eight thousand', -0.1), 0.026, 0.4, 260)
knock(W('wheel', 'others', 'thirty', -0.1), 0.026, 0.0, 280)
swell([53, 60, 65, 69], W('wheel', 'takes', 'shows', -0.2), 3.0, 0.016)
# 7. Listen first: the blank page turned over; a knock as his question goes up on the floor, and as each answer comes in its office;
#    a pin for each answer on his board; the choir as the shelf lights; a key as the test runs, two notes rising as it passes, and
#    the question no one can answer yet where no rule has been agreed
bed('listen', [DM9, BBMAJ9, GM7, CSUS, FMAJ9, BBMAJ9, FMAJ9])
paper(W('listen', 'ask', "doesn't", 0.3), 0.03, 0.1, 1.0)
knock(W('listen', 'ask', 'what slows', -0.1), 0.026, 0.0, 300)
for lid, off, pan in [('jun', 0.2, 0.1), ('mei', 0.2, -0.35), ('sam', 0.2, -0.4), ('plan', 0.1, -0.4)]:
    knock(G('listen', lid, off), 0.024, pan, 300)
for k in range(4):
    pin(G('listen', 'binder', -0.2 + 0.45 * k + 0.08), 0.03, [-0.5, -0.18, 0.19, 0.55][k])
swell([53, 60, 65, 69], W('listen', 'binder', 'They', -0.3), 3.0, 0.018)
tap(W('listen', 'tools', 'carry', -0.3), 0.018, 0.1)
comb(69, W('listen', 'tools', 'carry', 0.25), 0.045, -0.3); comb(72, W('listen', 'tools', 'carry', 0.39), 0.045, -0.2)
ask(W('listen', 'tools', "can't", -0.15), 0.035)
# 8. Where does it run? The binder's cover swung over and laid down; the note pressed on; a highlighter's stroke along each line as
#    it's sorted, and a short one for each colour of his key; the pencil through the line that can go
bed('runs', [FMAJ9, DM9, BBMAJ9, CSUS])
opens = W('runs', 'takes', 'opens', -0.2)
paper(opens, 0.028, 0.2, 0.8); knock(opens + 0.85, 0.02, -0.1, 200)
paper(W('runs', 'takes', 'where', -0.35), 0.022, -0.4, 0.3); tap(W('runs', 'takes', 'where', -0.12), 0.016, -0.4)
for lid, word, off in [('runs', 'run in', -0.1), ('owned', 'decisions', -0.1), ('go', 'go', -0.2)]:
    paper(W('runs', lid, word, off), 0.014, 0.5, 0.3)
for k, (lid, word) in enumerate([('runs', 'required'), ('runs', 'a check'), ('runs', 'a tag'), ('runs', 'a test'), ('owned', 'owns'), ('owned', 'writes'), ('go', 'go')]):
    paper(W('runs', lid, word, -0.45), 0.02, -0.2, 0.8 if k == 4 else 0.45)
paper(W('runs', 'go', 'go', 0.35), 0.02, -0.3, 0.35)
# 9. Where decisions enter: the choir as the poster catches the light; air as the loop goes round; a knock for Jun's question, and
#    the box of pins lifted; a pin at each step where a decision enters, with a music box note rising for each
bed('enter', [FMAJ9, AM7, BBMAJ9, CSUS], 0, cq('enter', 'breath'))
bed('enter', [FMAJ9], cq('enter', 'breath'), None)
swell([53, 60, 65, 69], W('enter', 'places', 'places', -0.4), 3.0, 0.016)
air(W('enter', 'loop', 'loop', -0.1), 2.8, 0.02, 0.0)
knock(W('enter', 'pin', 'another meeting', -0.15), 0.026, 0.5, 300)
tap(W('enter', 'pin', 'It needs', -0.1), 0.016, -0.3); tap(W('enter', 'pin', 'It needs', -0.04), 0.012, -0.3)
for k, (lab, pan) in enumerate([('a term', 0.0), ('a classification', 0.2), ('an owner', 0.33), ('a rule', 0.2), ('an approval', -0.33), ('a version', -0.2)]):
    lid = 'pins' if k < 3 else 'pins2'
    pin(W('enter', lid, lab, -0.15 + 0.09), 0.032, pan)
    comb([65, 67, 69, 72, 74, 77][k], W('enter', lid, lab, -0.15 + 0.09), 0.045, pan)
# 10. The series: a music box note rising as each of the nine binders lights; the first slid off the shelf; a knock for each board's
#     heading, and a pin for each film on governance as a capability and each film on the tools; the mark under the end card
bed('series', [BBMAJ9, FMAJ9, DM9, CSUS], 0, cq('series', 'breath'))
bed('series', [FMAJ9], cq('series', 'breath'), None, g=0.04)
for k, m in enumerate([60, 62, 64, 65, 67, 69, 70, 72, 74]):
    comb(m, W('series', 'next', 'nine', -0.1 + k * 0.12 + 0.05), 0.036, 0.3 + 0.05 * k)
slide(W('series', 'next', 'takes', 0.1), 0.026, 0.4, 0.45)
knock(G('series', 'map', -0.25), 0.028, 0.0)
for k in range(3):
    pin(W('series', 'map', 'three', -0.1 + 0.3 * k + 0.08), 0.028, [-0.47, 0.0, 0.47][k])
knock(G('series', 'tools', -0.25), 0.028, 0.0)
for k in range(6):
    pin(W('series', 'tools', 'six', -0.1 + 0.3 * k + 0.08), 0.028, [-0.47, 0.0, 0.47][k % 3])
mark(G('series', 'breath', 0.5))
