# Who may see it: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for this film (PLAYBOOK.md: vary the sound itself): a felt piano, close and soft; soft strings that hold a chord and
# go; a low clarinet for the series' mark, 1-5-4-8, under the title and the end card; and a small glockenspiel, darkened, for the two
# things that land again and again: the court's line (two notes, a fourth apart, rising) and a mask settling (a falling third).
# A minor for West Germany in 1983; C major from the moment the court's line runs between a university's columns, and for today.
# Music only now and then (the series' rule since 20 October 2026): the strings hold chords under the opening story, as the
# story's own music, and after that they come in only at a chapter's turn, under a moment on screen and in the wordless pauses. No
# urgent pulse: this film's turn is a decision, not a rush. Nothing loops, and nothing is detuned against itself: each note of a
# chord is one voice, in tune, spread across the stereo field, so nothing beats on a phone's speaker.
# Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
# src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed: paper, a
# string round a bundle of forms, a pencil, a tin box's lid, a small shredder, a binder slid along a shelf, keys typed, a key dropped,
# a pin pressed into cork, a class's chip set down, a scrambler's gears, a wooden knock for each card that arrives and a breath of air
# for each thing carried across. Everything is soft and stays below about 2.5 kHz (soften() at the end makes sure of it).

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    if i < 0:
        raise ValueError('%s/%s has no "%s"' % (sid, lid, word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off

# ---- this film's instruments ----
def piano(m, start, g=0.036, pan=0.0, sec=3.6):
    """a felt piano, close and soft: the felt takes the edge off the hammer, the upper partials die away first, a string's slight
    stretch keeps it a piano"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * np.sqrt(1 + 0.0004 * k * k) * x + 0.4 * k) * np.exp(-x * (0.7 + 0.8 * k)) * w
            for k, w in ((1, 1.0), (2, 0.42), (3, 0.16), (4, 0.07), (5, 0.03)))
    s = s * np.minimum(1, x / 0.012) + 0.03 * filt(noise(sec), 'band', (150, 900))[:len(x)] * np.exp(-x * 80)
    put(norm(filt(s.astype(np.float32), 'low', 2000)), start, g, pan)
def rolled(ms, start, g=0.03, gap=0.11):
    """a chord on the piano, rolled up from the lowest note"""
    for k, m in enumerate(ms):
        piano(m, start + k * gap, g * (1 - 0.06 * k), -0.4 + 0.8 * k / max(1, len(ms) - 1))
CLAR = ((1, 1.0), (2, 0.05), (3, 0.42), (4, 0.04), (5, 0.22), (6, 0.03), (7, 0.1), (9, 0.05))
def clarinet(m, start, sec, g=0.05, pan=0.0):
    """a low clarinet: the odd harmonics of a closed pipe, a little breath at the start, a straight tone, darkened"""
    f = mf(m); x = tt(sec); ph = 2 * np.pi * f * x
    s = sum(np.sin(k * ph) * w for k, w in CLAR)
    s = s + 0.05 * filt(noise(sec), 'band', (f * 2, min(f * 6, 2000)))[:len(x)] * (0.35 + 0.65 * np.exp(-x * 6))
    put(norm(filt((s * env(sec, 0.1, min(0.5, sec * 0.4))).astype(np.float32), 'low', 1600)), start, g, pan)
def strings(ch, start, sec, g=0.028):
    """soft strings: each note of the chord one section, in tune, bowed slowly in a little after the note below it, and spread across
    the stereo field; the bow's weight breathes very slowly, no vibrato"""
    ms = sorted(ch); n = len(ms)
    for j, m in enumerate(ms):
        d = 0.22 * j; f = mf(m); x = tt(sec)
        s = sum(np.sin(2 * np.pi * f * k * x + j + k) * (1 / k) * np.exp(-0.35 * k) for k in range(1, 8))
        s = s * (1 + 0.05 * np.sin(2 * np.pi * (0.06 + 0.01 * j) * x + j)) * env(sec, 1.6 + d, 2.6)
        put(filt(s.astype(np.float32), 'low', 1400), start + d, g * 1.6 / n, -0.6 + 1.2 * j / max(1, n - 1))
def glock(m, start, g=0.04, pan=0.0, sec=2.4):
    """a glockenspiel, struck softly and darkened: a steel bar's partials with the high ones cut, so a round bell is left"""
    f = mf(m); x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 1.6) + 0.25 * np.sin(2 * np.pi * f * 2.756 * x) * np.exp(-x * 7) + 0.08 * np.sin(2 * np.pi * f * 5.404 * x) * np.exp(-x * 14)
    s = s * np.minimum(1, x / 0.002) + 0.03 * filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.exp(-x * 200)
    put(norm(filt(s.astype(np.float32), 'low', 2300, 4)), start, g, pan)
def line2(s, g=0.042):
    """the court's line: two notes, a fourth apart, rising, as the pencil draws it"""
    glock(76, s, g, -0.2); glock(81, s + 0.42, g, 0.2)
def masked(s, g=0.038, pan=0.0):
    """a mask settling over a column: a falling third, the second note as it lands"""
    glock(79, s, g, pan); glock(76, s + 0.3, g * 0.9, pan)
def mark(start, root=48, g=0.06):
    """the series' four notes, 1-5-4-8: the low clarinet, the glockenspiel two octaves above"""
    for i, iv in enumerate([0, 7, 5, 12]):
        clarinet(root + iv, start + i * 0.45, 1.0 if i < 3 else 2.8, g * 0.8, (i - 1.5) * 0.12)
        glock(root + 24 + iv, start + i * 0.45, g * 0.42, (i - 1.5) * 0.15, sec=3.0 if i == 3 else 2.2)
def bed(segs, end, g=0.028):
    """the opening story's chords, one after another (each segment's start and chord), each blooming in under the end of the one before"""
    for i, (s, ch) in enumerate(segs):
        e = segs[i + 1][0] if i + 1 < len(segs) else end
        strings(ch, s - 1.2, e - s + 3.2, g)
def turn(ch, s, notes=(), g=0.024, sec=6.0):
    """a chapter's turn: the strings bloom on one chord and go, with a few notes of the piano over them"""
    strings(ch, s - 0.8, sec, g)
    for k, m in enumerate(notes):
        piano(m, s + 0.4 + 0.55 * k, 0.032, -0.3 + 0.3 * k)

# ---- soft sounds, all low-passed ----
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card, a tag or a speech bubble arriving"""
    s_knock(s, g, pan, f)
def paper(s, g=0.024, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def twine(s, g=0.026, pan=0.0, sec=0.5):
    """string drawn round a bundle of forms: a soft rasp, and the knot pulled"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1300))[:len(x)] * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * x)) * np.sin(np.pi * x / sec) ** 1.5, s, g, pan)
    s_knock(s + sec * 0.85, g * 0.4, pan, 160)
def pencil(s, sec=0.8, g=0.018, pan=0.0):
    """a pencil drawn on paper: graphite's grain, soft"""
    x = tt(sec); gr = np.abs(filt(noise(sec), 'low', 40))[:len(x)]; gr = gr / (gr.max() + 1e-6)
    X(filt(noise(sec), 'band', (500, 2200))[:len(x)] * (0.5 + 0.5 * gr) * env(sec, 0.04, 0.08), s, g, pan)
def tick(s, g=0.013, pan=0.0):
    """a pencil's short stroke"""
    pencil(s, 0.07, g, pan)
def lid(s, g=0.026, pan=0.0, shut=False):
    """the tin box's lid: a soft hinge as it opens, or a small tinny tap as it shuts"""
    x = tt(0.35)
    if shut:
        sig = np.sin(2 * np.pi * 520 * x) * np.exp(-x * 30) + 0.4 * np.sin(2 * np.pi * 1310 * x) * np.exp(-x * 45)
    else:
        sig = filt(noise(0.35), 'band', (600, 1600))[:len(x)] * np.sin(np.pi * x / 0.35) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * (9 + 14 * x) * x)) + 0.3 * np.sin(2 * np.pi * 700 * x) * np.exp(-x * 12)
    X(norm(filt(sig.astype(np.float32), 'low', 2000)), s, g, pan)
def shredder(s, sec=1.4, g=0.024, pan=0.0):
    """a small shredder: its motor's low hum, and paper going through"""
    x = tt(sec); hum = np.sin(2 * np.pi * 98 * x) + 0.5 * np.sin(2 * np.pi * 196 * x) + 0.2 * np.sin(2 * np.pi * 294 * x)
    crunch = filt(noise(sec), 'band', (300, 1800))[:len(x)] * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 11 * x)))
    X(norm(filt(((0.5 * hum + crunch) * env(sec, 0.12, 0.3)).astype(np.float32), 'low', 2000)), s, g, pan)
_krng = np.random.default_rng(4)
def keys(s, n=6, g=0.012, pan=0.1, gap=0.13):
    """keys typed, muffled, in an uneven run"""
    t0 = s
    for _ in range(n):
        s_tap(t0, g * float(_krng.uniform(0.7, 1.1)), pan); t0 += gap * float(_krng.uniform(0.6, 1.4))
def keydrop(s, g=0.02, pan=0.0):
    """a key on a string dropped on paper: a small, low tink, and the paper under it"""
    x = tt(0.4); sig = np.sin(2 * np.pi * 1180 * x) * np.exp(-x * 22) + 0.6 * np.sin(2 * np.pi * 1730 * x) * np.exp(-x * 30)
    X(norm(filt(sig.astype(np.float32), 'low', 2200)), s, g, pan); paper(s + 0.01, g * 0.6, pan, 0.18)
def pin(s, g=0.024, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g, pan, 360); s_tap(s + 0.004, g * 0.5, pan)
def slide(s, g=0.022, pan=0.0, sec=0.42):
    """a binder drawn forward along a wooden shelf: a low, rough slide, and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5 * (1 + 0.4 * np.sin(2 * np.pi * 31 * x)), s, g, pan)
    s_knock(s + sec * 0.92, g * 0.5, pan, 200)
def air(s, sec=0.9, g=0.014, pan=0.0):
    """a breath of air, for something carried across or a line drawn on"""
    s_air(s, sec, g, pan)
def chip(s, g=0.02, pan=0.0):
    """a class's chip set down beside a column"""
    s_knock(s, g, pan, 320); paper(s, g * 0.5, pan, 0.12)
def gears(s, sec, g=0.018, pan=0.0):
    """the scrambler's small gears turning: soft ticks over a low whirr"""
    x = tt(sec); w = filt(noise(sec), 'band', (150, 700))[:len(x)] * 0.4; tk = np.zeros_like(x); step = int(SR / 14); seg = int(0.02 * SR)
    for i in range(0, len(x), step):
        j = min(len(x), i + seg); tk[i:j] += np.exp(-np.arange(j - i) / SR * 250) * (1.0 if (i // step) % 2 else 0.6)
    X(norm(filt(((w + tk) * env(sec, 0.1, 0.2)).astype(np.float32), 'low', 1800)), s, g, pan)

# chords (MIDI note numbers): A minor for 1983, C major for today
AM9 = [45, 52, 59, 60, 64]; AM7 = [45, 52, 55, 60, 64]; FMAJ7 = [41, 48, 52, 57, 64]; DM9 = [38, 45, 53, 57, 64]; ESUS = [40, 47, 52, 57, 59]
FADD9 = [41, 48, 55, 57, 60]; CE = [40, 48, 55, 60, 64]; CADD9 = [36, 43, 50, 52, 55]; GADD = [43, 50, 55, 59, 62]; CMAJ9 = [36, 43, 52, 55, 59, 62]

# 1. Counted, not known: the strings hold the story's chords; the piano falls in at the start, a note for the stop, the court's chord
#    rolled as it decides, a lift for 1987, E and C for the two permissions; the court's line in two notes each time it's drawn; and
#    the paper of 1983 at the counter, on the column, at the table: a bundle's string, a pencil, the tin box, the shredder. The mark
#    under the title, in C, where the story arrives in a university's data
lift, down, tie = G('counted', 'answer', 0.2), W('counted', 'stops', 'stops'), W('counted', 'stops', 'stops', 0.9)
dec, slip, slipBack, count = W('counted', 'rules', 'decides'), W('counted', 'insig', 'computers'), G('counted', 'forbid', 0.1), W('counted', 'forbid', 'counting')
line, split, rem = G('counted', 'line', 0.05), W('counted', 'apart', 'kept'), W('counted', 'apart', 'removed')
th, arrow, cross, y87 = G('counted', 'back', -0.2), W('counted', 'back', 'given'), W('counted', 'back', "don't"), G('counted', 'y1987', -0.1)
morph, title = W('counted', 'between', 'between'), G('counted', 'breath', 0.7)
bed([(S0('counted'), AM9), (G('counted', 'correct', -0.3), FMAJ7), (G('counted', 'boycott', -0.4), DM9), (G('counted', 'stops', -0.5), ESUS),
     (G('counted', 'rules', -0.4), FADD9), (dec, CE), (G('counted', 'insig', -0.4), AM7), (G('counted', 'line'), FMAJ7), (th, DM9), (y87, CADD9),
     (G('counted', 'one'), AM9), (G('counted', 'another'), FMAJ7), (morph, CMAJ9)], E('counted') + 1.5)
for k, m in enumerate([64, 60, 57]):
    piano(m, S0('counted') + 0.4 + 0.6 * k, 0.034, 0.2 - 0.2 * k)
twine(lift - 0.5, 0.024, -0.1, 0.45); paper(lift, 0.022, -0.1, 0.4)
for k, word in enumerate(['housing', 'schools', 'transport']):
    t0 = W('counted', 'answer', word); air(t0 - 0.15, 0.9, 0.01, 0.1 + 0.1 * k); pin(t0 + 0.75, 0.018, 0.1 + 0.1 * k)
paper(G('counted', 'correct', -0.2), 0.018, 0.0, 0.4); pencil(W('counted', 'correct', 'correct', -0.1), 0.8, 0.018, 0.1)
for i in range(3):
    paper(G('counted', 'boycott', 0.15 + 0.6 * i), 0.022, -0.15 + 0.12 * i, 0.7)
piano(45, down, 0.03, 0.0); paper(down, 0.022, -0.1, 0.4); twine(tie, 0.026, -0.1, 0.5); knock(down + 0.1, 0.016, 0.2, 300)
paper(dec - 0.2, 0.024, 0.0, 0.8); rolled([60, 64, 67], dec, 0.028)
for k in range(4):
    paper(slip + 0.08 * k, 0.01, 0.2 + 0.15 * (k % 2), 0.2)
air(slip + 1.1, 0.8, 0.012, 0.5); paper(slipBack, 0.012, 0.3, 0.3)
paper(count - 0.3, 0.018, 0.5, 0.4)
for k in range(5):
    tick(count + 0.16 * k, 0.012, 0.5)
pencil(line, 0.9, 0.022, 0.0); line2(line + 0.1)
paper(split, 0.02, 0.0, 0.5); lid(split + 0.3, 0.024, -0.5); paper(split + 1.8, 0.018, -0.5, 0.25)
paper(rem, 0.014, -0.5, 0.3); shredder(rem + 0.6, 1.5, 0.022, -0.5); lid(rem + 1.5, 0.02, -0.5, True)
knock(th, 0.014, 0.5, 300); pencil(arrow, 0.7, 0.018, 0.4); tick(cross, 0.014, 0.4); tick(cross + 0.18, 0.014, 0.4)
paper(y87, 0.024, 0.0, 0.8); piano(60, y87, 0.03, -0.1); piano(67, y87 + 0.5, 0.03, 0.1)
pencil(y87 + 0.9, 0.6, 0.02, 0.0); line2(y87 + 0.95); paper(y87 + 1.6, 0.018, 0.0, 0.4); lid(y87 + 1.9, 0.022, -0.5); paper(y87 + 3.2, 0.016, -0.5, 0.25)
for k in range(20):
    tick(y87 + 2.0 + 0.13 * k, 0.008, 0.5)
piano(64, G('counted', 'one'), 0.032, 0.3); knock(G('counted', 'one', 0.1), 0.016, 0.5)
piano(60, G('counted', 'another'), 0.032, -0.3); knock(G('counted', 'another', 0.1), 0.016, -0.5)
air(morph, 1.6, 0.014, 0.0); line2(morph + 0.3); paper(morph + 0.4, 0.018, 0.0, 0.8)
mark(title + 0.6)

# 2. The census list: the title's chord carries over and goes; a breath of air as the gold light runs along the list's header; a
#    knock for Clara's card; the sticky note pressed on and written; the learner table's card slid in, and status ringed in pencil
air(W('census', 'counts', 'no names', -0.2), 1.4, 0.01, 0.0)
knock(W('census', 'term', 'Clara'), 0.014, -0.2, 300)
still = W('census', 'term', 'still'); paper(still, 0.02, 0.4, 0.25); pencil(still + 0.2, 1.0, 0.012, 0.4)
paper(G('census', 'status', -0.2), 0.02, -0.5, 0.5); pencil(W('census', 'status', 'status'), 0.7, 0.014, -0.5)

# 3. The old path: a turn into Yusuf's office; the binder drawn off the shelf, opened on the desk; a question on the piano for which
#    and how, a semitone apart; a memory, three notes falling over a soft chord; the old path's papers, the calendar's pages, the
#    printout unrolled, the key dropped on it; Sam's keys; a low note as nine names go grey
turn(FADD9, S0('path'), (69, 65))
take = G('path', 'binder', 0.3); slide(take, 0.024, 0.3, 0.45); knock(S0('path') + 0.5, 0.012, -0.2, 300)
paper(G('path', 'policy', -0.2), 0.022, 0.0, 0.6)
piano(64, W('path', 'which', 'which'), 0.03, 0.2); piano(65, W('path', 'which', 'how'), 0.03, 0.4)
mem = G('path', 'until', -0.1); strings(AM7, mem - 0.3, 6.0, 0.016)
for k, m in enumerate([64, 60, 57]):
    piano(m, mem + 0.2 + 0.5 * k, 0.028, 0.2 - 0.2 * k)
paper(G('path', 'form'), 0.022, -0.4, 0.5); paper(G('path', 'approval'), 0.022, 0.0, 0.4)
later, ended = G('path', 'weeks'), W('path', 'ended', 'ended'); knock(later - 0.3, 0.014, 0.6, 280)
for k in range(3):
    paper(later + 1.2 * k + 0.9, 0.014, 0.6, 0.25)
for k in range(5):
    paper(ended + 1.8 * k + 1.3, 0.014, 0.6, 0.25)
paper(W('path', 'weeks', 'whole', -0.2), 0.022, -0.5, 1.4); keydrop(W('path', 'weeks', 'granted', 0.5), 0.02, 0.2)
plat = G('path', 'checks', -0.4); keys(plat + 0.4, 7, 0.012, 0.3); knock(plat + 0.4, 0.012, 0.0, 300)
piano(45, G('path', 'nine', 0.3), 0.03, 0.0)

# 4. At the column: a turn up into C as the path starts somewhere else; a knock for Mei's card; a chip set down as each class is
#    said; a breath as the file's line lights; two low notes, a semitone together, as the check stops a column; ticks for the codes;
#    a ring round the student's ID; the chip for direct, and the court's line drawn at the column; two notes rising as the check passes
turn(CADD9, S0('column'), (60, 64, 67))
knock(S0('column') + 0.6, 0.012, -0.2, 300)
for k, (lid_, word) in enumerate([('pseudo', 'Pseudonymous'), ('direct', 'identifies'), ('direct', 'name'), ('direct', 'email'), ('none', 'none')]):
    chip(W('column', lid_, word, 0.05), 0.02, -0.1 + 0.05 * k)
air(W('column', 'written', 'beside'), 0.6, 0.01, 0.0)
stops = W('column', 'written', 'stops'); piano(52, stops, 0.024, -0.1); piano(53, stops, 0.024, 0.1)
for k in range(2):
    tick(W('column', 'looks', 'most', 0.25 * k), 0.014, 0.2)
pencil(G('column', 'nothing'), 0.8, 0.014, 0.0)
chip(G('column', 'mei', 0.6), 0.022, -0.2)
cl = W('column', 'mei', "court's"); pencil(cl, 1.0, 0.018, -0.3); line2(cl + 0.1)
ok = G('column', 'mei', 3.6); piano(67, ok + 0.2, 0.03, -0.1); piano(72, ok + 0.45, 0.03, 0.1)

# 5. The mask follows: a turn as the class leaves the file; air as the chip flies; the chip set down as the column's tag; a knock for
#    the rule; then on the board, a falling third each time a mask settles: the learner table, the wallet, the table built tomorrow,
#    each after a breath of air along its string; the near-award list, which never had the email, a chord rolled
turn(FMAJ7, S0('mask'), (65, 69))
air(W('mask', 'stay', 'stay'), 1.0, 0.014, 0.3)
keys(G('mask', 'built', 0.0), 5, 0.01, 0.3); chip(W('mask', 'built', 'as a tag', 0.05), 0.02, -0.3)
knock(G('mask', 'rule'), 0.014, 0.2, 300); air(W('mask', 'rule', 'stars'), 0.8, 0.01, 0.2)
bytag, every, tom = W('mask', 'bytag', 'by tag'), W('mask', 'every', 'every'), W('mask', 'every', 'tables built')
air(bytag, 0.8, 0.01, -0.1); masked(bytag + 0.5, 0.036, -0.1)
air(every, 0.9, 0.01, 0.2); masked(every + 1.4, 0.036, 0.3)
pin(tom + 0.4, 0.022, 0.3); air(tom + 0.2, 0.9, 0.01, 0.3); masked(tom + 1.4, 0.034, 0.35)
rolled([48, 55, 60, 64], G('mask', 'never', 0.1), 0.026)

# 6. A purpose and a date: a turn as the request reaches its owner; Mei's yes on the screen, a knock and two notes rising, as when the
#    check passed; the access card carried across the floor and pinned; a high E, soft, for each end date; the scrambler's gears for
#    the one ID, and again for the list of them, a pencil writing each key down; two low notes as one matches; a knock for the tag,
#    paper for the card, a knock for the agent's card
turn(CADD9, S0('purpose'), (64, 60))
yes = W('purpose', 'yes', 'yes'); knock(yes + 0.1, 0.016, 0.0, 300); piano(67, yes + 0.2, 0.03, -0.1); piano(72, yes + 0.45, 0.03, 0.1)
grp = W('purpose', 'group', 'a Planning'); air(grp - 0.2, 1.0, 0.014, -0.2); pin(grp + 0.8, 0.024, -0.4)
piano(76, W('purpose', 'group', 'ends'), 0.024, -0.3)
scram = W('purpose', 'key', 'scrambled'); paper(scram - 0.6, 0.012, -0.3, 0.6); gears(scram - 0.2, 1.0, 0.018); paper(scram + 0.2, 0.012, 0.3, 0.6)
back = W('purpose', 'back', 'Anyone'); gears(back + 0.3, 2.6, 0.016)
for k in range(8):
    tick(back + 0.3 + 0.325 * (k + 1), 0.009, 0.5)
piano(57, back + 2.9, 0.028, 0.0); piano(60, back + 3.05, 0.026, 0.2); pencil(back + 2.9, 0.4, 0.012, 0.3)
so = W('purpose', 'back', 'so even'); knock(so, 0.014, 0.0, 300); paper(so, 0.012, 0.6, 0.3)
piano(76, W('purpose', 'back', 'end date'), 0.024, 0.6)
knock(W('purpose', 'agent', 'agent'), 0.014, -0.3, 300)

# 7. Why the stars: a knock as each speech bubble comes; the gold card pinned, and a chord rolled for the way to more; paper as the
#    copies appear on the offices' glass, one after another
knock(G('stars', 'asks', 0.6), 0.014, -0.4, 300); knock(W('stars', 'why', 'why'), 0.014, 0.4, 300)
more = W('stars', 'more', 'the way'); pin(more + 0.1, 0.022, 0.4); rolled([48, 55, 60, 64, 67], more + 0.15, 0.026)
copied = W('stars', 'no', 'copied')
for k, (r, dt) in enumerate([(0, 0.0), (3, 0.35), (4, 0.6), (1, 0.85), (0, 1.1), (3, 1.3), (4, 1.5), (1, 1.7)]):
    paper(copied - 0.2 + dt, 0.012, -0.8 + 0.4 * r, 0.2)

# 8. Read from the grants: a turn into December; the plan into the tray; the calendar's page; the high E as the access ends; air as
#    the names glide into their groups, a knock as each group's card comes in over them; on the table, E and C again for the two
#    permissions, a knock for each tag, a falling third as the band settles, the chip set down; the strings and the mark under the
#    end card
turn(CADD9, S0('grants'), (67, 72))
paper(W('grants', 'plan', 'faculties'), 0.02, -0.6, 0.6); paper(W('grants', 'plan', 'fifteenth', 0.3), 0.016, -0.3, 0.25)
ends = W('grants', 'plan', 'ends'); piano(76, ends, 0.024, -0.6); air(ends, 1.0, 0.008, -0.6)
two = W('grants', 'two', 'two'); air(two + 0.3, 1.4, 0.01, 0.0)
for k in range(2):
    knock(two + 0.95 + 0.11 * k, 0.014, -0.3 + 0.6 * k, 300)
piano(64, G('grants', 'one'), 0.032, 0.3); knock(G('grants', 'one', 0.2), 0.014, -0.3)
piano(60, G('grants', 'another'), 0.032, -0.3); knock(G('grants', 'another', 0.2), 0.014, 0.3)
masked(W('grants', 'another', 'another', 0.6), 0.036, 0.3); chip(W('grants', 'write', 'once', 0.05), 0.02, 0.3)
endc = G('grants', 'breath', -0.2); strings(CMAJ9, endc - 1.0, E('grants') - endc + 2.0, 0.026)
mark(endc + 0.7)

# every effect above, 4 dB up together: the softest still reads on a phone's speaker, and the loudest stays about 20 dB under the voice
for b in (XL, XR):
    b *= 1.6
soften(2500)
