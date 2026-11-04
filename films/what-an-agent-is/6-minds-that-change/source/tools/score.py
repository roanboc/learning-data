# Minds that change: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 3 November 2026 against every score.py on main and on every branch, and against the series' other films:
# a piano played from inside, with no hammers, two ways. Its strings are bowed with rosined threads, one thread to a string, for the
# held notes and chords; the same strings are plucked by hand and damped with felt for the moments. Both are made here (music.py has
# neither). The same strings reached two ways is the film's idea in sound: two ways to one answer, which must agree. No instrument,
# scale or sound from Indian music, and no chant: the reciters' voices are not imitated.
#  - The marks mean the same all through. A verse's four words, a b c d, are four plucked notes rising, F A C D, and each pattern is
#    heard as it's drawn: joined, apart, in pairs, braided. A slip is the wrong note, G for C, plucked and damped short. When the
#    patterns agree, the bowed strings take up the notes the plucked ones played: the two ways agree (agree()). In Check the work, the
#    two routes are the two ways again: their counts end on different notes (134 on D, 131 on C), the slip's G sounds as the double
#    count is found, and, fixed, both end on C, and the bow takes it up.
#  - The three answers are three plucked endings, each different: home (F), a third above (A), the sixth (D); "are you sure?" leaves a G
#    hanging. Bartlett's retellings are a figure that grows shorter, and the two things the man added are two notes it never had.
#  - F major for the reciters, D minor for the problem; the university's chapters turn on D minor, A minor and B flat, and come home to
#    F as the advisers start.
# The rules the series keeps (its briefs, 3 November 2026, as the governance and master data films did):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than
#    half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: each bowed note is one string, held steady with no vibrato, its partials harmonic, as a bowed
#    string's are; every chord is tuned pure (just intonation, see hz()), and G is never held with D or B flat (their intervals aren't
#    pure here); the plucked notes are damped within about a second and a half, so none is held under another. No urgent pulse: the
#    film's turn is a slip found, not a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid):
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(15)  # this film's own randomness: the room, the rosin, the paper, the keys

# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other and nothing beats. The chords used are
# F, B flat, C, D minor and A minor, whose fifths and thirds are all pure in this table; G is never held with D (a fifth of 40/27 here)
# or with B flat (32/27)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (53, 174.614)  # F 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords, as (the bass, (the strings above it, lowest first)), one string to a note
F_, Fo, Bb, Dm, Am = (41, (48, 57, 65)), (41, (48,)), (46, (53, 62, 65)), (38, (45, 53, 57)), (45, (52, 60, 64))
VERSE = (65, 69, 72, 74)  # a b c d: F A C D, the four words of a verse
SLIP = 67                 # G, where C should be

# ---- the levels: the bowed strings about as far under the voice as the series' other music (matched by loudness, not by peak), the
# plucked notes a little above them; the effects about 12 dB under the music (FX scales them all)
# After the author's review of the series' opening films (4 November 2026), the music is 3.5 dB lower and the effects 2 dB, so
# the music's and the effects' loud moments sit as low as the governance films' (tools/quiet.py measures them)
BL, PL, FX = 0.037, 0.080, 1.3

# a small wooden room round the piano, ringing on for about a second and a half
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.5)).astype(np.float32))(np.arange(int(1.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.02 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
# the piano's soundboard: broad resonances that colour every string, bowed or plucked, and nothing much above about 1.5 kHz
BOARD = [(110, 90, 0.8), (240, 170, 1.0), (520, 320, 0.6), (1100, 500, 0.25)]
def _board(fk):
    return sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in BOARD) + 0.25

# ---- the strings, bowed: a rosined thread drawn round one string, slowly and lightly. The bow locks the string's partials into a
# harmonic series, each softer than the last (a light bow and the soundboard round them off); the higher ones speak a moment after the
# first, as a bowed note does, and die first when the thread lifts and the string rings on. A faint hush of rosin while it bows
def bow(m, a, b, g=1.0, att=0.6, rel=1.2, pan=None, room=0.3):
    """one string bowed from a to b, held steady with no vibrato; it swells in over att, and rings down over rel once the thread lifts.
    A note of 1.2 s or more swells a little and eases, once"""
    f = hz(m); sec = max(0.2, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        ak = abs(np.sin(np.pi * k * 0.11)) / k * np.exp(-fk / 1500) * _board(fk)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.25 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * 2.5 * (1 + 0.5 * (k - 1)) / rel), 1.0)
        s = s + ak * on * off * np.sin(2 * np.pi * fk * x + 0.7 * k)
    if sec >= 1.2:
        s = s * (0.88 + 0.12 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    hush = filt(noise(n / SR + 0.01)[:n], 'band', (300, 1400)) * 0.004 * np.where(x < sec, np.minimum(1, x / att), 0)
    s = filt((s + hush).astype(np.float32), 'low', 2400)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), a, g * BL, max(-0.35, min(0.35, (m - 60) * 0.015)) if pan is None else pan)

# ---- the same strings, plucked by hand and damped with felt: a round, woody note whose higher partials die soonest, damped by hand
# after ring seconds, with the soft touch of the finger leaving the string. Its partials are kept harmonic, so a plucked note can sound
# over a bowed chord without beating; the signal stays under two seconds, room and all, so it's never counted as held
def plk(m, s, g=1.0, ring=0.9, pan=None, room=0.22):
    """a string plucked at s and damped after ring seconds (at most 1.4)"""
    ring = min(ring, 1.4); f = hz(m); sec = ring + 0.2; x = tt(sec).astype(np.float64); sig = np.zeros(len(x))
    d1 = 0.55 * (220 / f) ** 0.4
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        a = abs(np.sin(np.pi * k * 0.14)) / k ** 1.6 * _board(fk)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.4 * k) * np.exp(-x * (1 + 0.5 * (k - 1) ** 1.3) / d1)
    sig = sig * np.minimum(1, x / 0.003) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.18, 1)) ** 2, 1.0)
    sig = sig + 0.02 * filt(noise(sec)[:len(x)], 'band', (150, 900)) * np.exp(-x / 0.008)
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    if room:
        tail = int(min(len(_IR), 1.95 * SR - len(sig)))
        if tail > 0:
            wet = fftconvolve(sig, _IR[:tail]).astype(np.float32); sig = np.pad(sig, (0, tail)); sig[:len(wet)] += room * wet
    put(sig.astype(np.float32), s, g * PL, max(-0.35, min(0.35, (m - 68) * 0.02)) if pan is None else pan)

# ---- what the two play
def chord(c, a, b, g=1.0, att=0.9, rel=1.6):
    """a chord bowed, the bass first and the strings above it a moment apart, held from a to b"""
    bs, rh = c
    for i, m in enumerate((bs,) + tuple(rh)):
        bow(m, a + 0.06 * i, b, g * (1.0 if i == 0 else 0.8), att=att, rel=rel)
def figure(s, notes, step=0.16, g=0.8, ring=0.8, last=1.3):
    """notes plucked one after another, each damped as the next comes; the last rings a little longer"""
    for i, m in enumerate(notes):
        plk(m, s + step * i, g, ring=last if i == len(notes) - 1 else min(ring, step + 0.25))
def pairs(s, notes=VERSE, step=0.13, gap=0.34, g=0.7):
    """a verse in pairs, ab bc cd: each word said twice, with the one before it and the one after"""
    for i in range(len(notes) - 1):
        figure(s + i * (step + gap), (notes[i], notes[i + 1]), step, g, last=0.5)
def braid(s, notes=VERSE, step=0.12, gap=0.18, g=0.65):
    """a verse braided, back and forth, ab ba ab, then bc cb bc: each pair three times, turned round in the middle"""
    t = s
    for i in range(2):
        a, b = notes[i], notes[i + 1]
        figure(t, (a, b, b, a, a, b), step, g, last=0.5); t += 6 * step + gap
def agree(s, notes=VERSE, step=0.16, hold=3.0, g=0.8, gb=0.75):
    """the film's mark: the notes plucked one by one, then taken up by the bow, the same strings held together: two ways agreeing"""
    figure(s, notes, step, g)
    t = s + step * (len(notes) - 1)
    for i, m in enumerate(notes):
        bow(m, t + 0.03 * i, t + hold, gb * (1.0 if i == 0 else 0.85), att=0.4, rel=1.4)

# ---- soft sounds in the room, on the table and the wall, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a light click"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.012, pan=0.0, step=0.13):
    """a few keys typed, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.02, pan=0.0, sec=0.45):
    """a sheet of paper laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pin(s, g=0.022, pan=0.0):
    """a card pinned to the wall: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.6):
    """a pen line on paper, or a signature: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def strike(s, g=0.012, pan=0.0, sec=0.6):
    """a word struck through: a pen drawn quickly, firmer as it starts"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something sliding across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)

# =============================================================================================================================
# 1. Kept by heart: the opening, under the bowed strings all through. Dawn by the river: an open fifth on F, low, and A joins it as the
#    Rigveda is named; a hymn passed from teacher to student, the verse plucked and echoed, softer. Memory changes: the chord thins to A
#    alone, re-bowed; the tiles put back one by one, and the slip, G for C; the slip taught on, and fading as the generations pass, D
#    under the A for the fear; "Something had to keep them exact", and it stops. The patterns, each heard as it's drawn over the open
#    fifth: joined, apart, in pairs, braided; "agree in every pattern": the bow takes up the verse's notes, and the slip's G sounds
#    once, short, outside them. It worked: F major, warm; the reciters today, the verse once, joined. "It's the same with data": B flat,
#    then home to F as "check each answer more than one way", and the title on the mark
kw = lambda lid, word, off=0: W('kept', lid, word, off)
kc = lambda lid, off=0: G('kept', lid, off)
k0 = S0('kept')
# dawn: the open fifth, A joining as the Rigveda is named, and held until memory changes
bow(41, k0 + 0.4, kc('changes'), 1.0, att=2.4, rel=1.8); bow(48, k0 + 1.1, kc('changes'), 0.85, att=2.4, rel=1.8)
bow(57, kw('families', 'Rigveda'), kc('changes'), 0.7, att=1.6, rel=1.8)
# every hymn lives in memory: the verse, plucked by the teacher, and passed on, softer, by the student
figure(kw('lives', 'lives'), VERSE, 0.2, 0.75)
figure(kw('lives', 'passed'), VERSE, 0.2, 0.5)
# but memory changes: A alone, bowed again; D joins under it for the fear, until "Something had to keep them exact"
bow(57, kc('changes', -0.1), END('kept', 'exact'), 0.75, att=1.0, rel=1.6)
bow(50, kw('lose', 'in a few generations'), END('kept', 'exact'), 0.65, att=1.4, rel=1.6)
# we rebuild it: the tiles put back one by one; a word can slip: the wrong note, short
figure(kw('rebuild', 'we rebuild it'), VERSE, 0.3, 0.55)
plk(SLIP, kw('rebuild', 'a word can slip', 0.25), 0.7, ring=0.35)
# taught to a student, the slip becomes the hymn; in a few generations, fainter, and only a fragment as the hymns are lost
figure(kw('taught', 'Taught'), (65, 69, SLIP, 74), 0.22, 0.55)
figure(kw('lose', 'in a few generations', 0.4), (65, 69, SLIP, 74), 0.26, 0.4)
figure(kw('lose', 'lose their hymns'), (65, 69), 0.34, 0.28, last=0.9)
# the patterns, over the open fifth: each row heard as it's drawn
bow(41, kc('patterns', 0.2), kw('agree', 'agree'), 0.8, att=1.6, rel=1.2); bow(48, kc('patterns', 0.6), kw('agree', 'agree'), 0.7, att=1.6, rel=1.2)
figure(kw('ways', "as it's recited"), VERSE, 0.13, 0.6)
figure(kw('ways', 'word by word'), VERSE, 0.22, 0.55, ring=0.3, last=0.4)
pairs(kw('ways', 'in pairs'), step=0.12, gap=0.16, g=0.55)
braid(kw('ways', 'braided'), step=0.11, gap=0.12, g=0.5)
# agree in every pattern: the bow takes up the verse; so a word that slipped would show: the G, once, short, outside them
agree(kw('agree', 'agree'), VERSE, 0.16, kc('worked') - kw('agree', 'agree') - 0.4, 0.7, 0.7)
plk(SLIP, kw('agree', 'would show'), 0.6, ring=0.3)
# it worked: F major, warm, until "the same with data"; the reciters today, the verse once, joined
chord(F_, kc('worked', -0.1), kc('data'), 0.9, att=1.2, rel=1.4)
figure(kw('later', 'still learn'), VERSE, 0.15, 0.45)
# it's the same with data: B flat; then home to F as each answer is checked more than one way, held into the title
chord(Bb, kc('data', -0.05), kc('ways2', 0.1), 0.8, att=0.7, rel=1.2)
chord(F_, kc('ways2', 0.05), kc('breath', 3.0), 0.8, att=1.0, rel=1.6)
# the title card: the film's mark, the verse plucked and taken up by the bow
agree(kc('breath', 0.4), VERSE, 0.2, 3.2, 0.75, 0.7)

# 2. Three answers: the room, D minor at the turn. Each answer card a plucked ending of its own: home, a third above, the sixth; a light
#    click as each card comes out of the agent. "Are you sure?": a G, left hanging. The search for the review: keys, and a low knock
#    as it comes back empty
tw = lambda lid, word, off=0: W('three', lid, word, off)
tc = lambda lid, off=0: G('three', lid, off)
chord(Dm, S0('three') + 0.2, tc('paper', 0.6), 0.75, att=0.9, rel=1.6)
pin(tw('paper', 'is writing', 0.8), 0.016, px(1620))
for lid, word, off, end in (('science', 'Engineering', -0.25, 65), ('health', 'Health', -0.2, 69), ('third', 'Business', -0.35, 74)):
    tap(tw(lid, word, off), 0.014, px(960))
    figure(tw(lid, word), (72, end), 0.24, 0.6, last=1.2)
plk(SLIP, tw('sure', 'are you sure'), 0.55, ring=1.4)
keys(tc('review', 0.2), 5, 0.010, px(960), 0.2)
knock(tw('review', "there's no", 0.5), 0.022, px(960), 150)

# 3. Ours change too: A minor at the turn. Clara's paper opened; the two year cards sliding into one. Cambridge: a page laid down and
#    slid across the desk; the retellings, a figure that grows shorter, A C E D, then A C E, then A C; one line rising out of the last
#    retelling, a breath of air; "canoe" struck through. The two things he added: G and B flat, two notes the figure never had (not
#    played again on "surest" since 4 November 2026: the same two notes five seconds later were one figure too many). Seattle: each bar
#    rises with a soft tap; "The question had changed the memory": A minor again, a moment
ow = lambda lid, word, off=0: W('ours', lid, word, off)
oc = lambda lid, off=0: G('ours', lid, off)
chord(Am, S0('ours') + 0.2, oc('too', 0.4), 0.7, att=0.9, rel=1.6)
paper(ow('own', 'paper from last year', -0.1), 0.016, px(1120))
air(ow('joined', 'two years into one', -0.3), 0.9, 0.010, px(1120))
paper(ow('century', 'Frederic Bartlett'), 0.014, px(665))
paper(ow('century', 'retell'), 0.010, px(1000))
figure(ow('far', 'again and again', -0.1), (69, 72, 76, 74), 0.2, 0.5)
figure(ow('far', 'again and again', 0.5), (69, 72, 76), 0.2, 0.45)
figure(ow('far', 'over years', 0.15), (69, 72), 0.2, 0.42)
air(ow('shorter', 'their own world', -0.15), 0.7, 0.008, px(1100))
strike(ow('shorter', 'a canoe became', 0.5), 0.011, px(960), 0.5)
plk(67, ow('added', 'totem'), 0.55, ring=0.7); plk(70, ow('added', 'pilgrimage'), 0.55, ring=0.7)
tap(ow('hit', 'hit each other', -0.6), 0.012, px(290)); tap(ow('smashed', 'smashed', -0.4), 0.012, px(1630))
chord(Am, oc('question', -0.1), END('ours', 'question') + 1.2, 0.6, att=0.8, rel=1.4)

# 4. Rebuilt, not replayed: D minor at the turn. A memory rebuilt from a few details: three notes, D F A. The model writes one word at a
#    time: a plucked note for each word as it drops into the line; asked again in a new chat, another first word, another first note;
#    the gap's word is picked the same way, one more note like the others. "Are you sure?" leaves the G hanging, as in Three answers,
#    and the answer turns over to Business with the same ending it had there
rw = lambda lid, word, off=0: W('rebuilt', lid, word, off)
chord(Dm, S0('rebuilt') + 0.2, G('rebuilt', 'details', 0.3), 0.7, att=0.9, rel=1.6)
figure(rw('details', 'a few details'), (62, 65, 69), 0.3, 0.45)
figure(rw('writes', 'one at a time', -0.1), (65, 69, 72, 74), 0.75, 0.45)
figure(rw('again', 'another route', -0.2), (62, 69, 72, 74), 0.75, 0.45)
plk(74, rw('gap', 'something likely', 0.2), 0.45, ring=0.8)
plk(SLIP, G('rebuilt', 'bend', 0.1), 0.5, ring=1.2)
figure(G('rebuilt', 'bend', 1.45), (72, 74), 0.24, 0.5, last=1.0)

# 5. Check the work: B flat at the turn. Every answer shows where it came from: keys for the query, paper for last year's. "Like the
#    reciters' patterns": the verse in pairs, softly. The two routes: a click as each lights; they don't agree: D for 134, C for 131;
#    three students counted twice: the slip's G. Fixed: both routes end on C, and the bow takes it up with F and A under it, held while
#    the agent changes its answer and "a mind that changes with the evidence is doing its job". Monday's card slides back in. Every
#    night: one soft F as the moon turns, twice. The team's record pinned; the next chat starts from it, a soft F as its thread reaches
#    the ring; Clara signs. The advisers start: F major, and it carries into the last chapter
cw = lambda lid, word, off=0: W('check', lid, word, off)
cc = lambda lid, off=0: G('check', lid, off)
chord(Bb, S0('check') + 0.2, cc('instead', 0.5), 0.75, att=0.9, rel=1.6)
keys(cw('shows', 'the query', -0.2), 6, 0.010, px(960))
paper(cw('shows', "last year's paper", -0.1), 0.014, px(1520))
pairs(cw('second', "reciters' patterns"), VERSE, 0.13, 0.3, 0.5)
tap(cw('counts', 'data platform', 0.2), 0.012, px(550)); tap(cw('counts', 'student system', 0.2), 0.012, px(1370))
plk(74, cw('disagree', 'a hundred and thirty-four'), 0.6, ring=1.1, pan=px(550))
plk(72, cw('disagree', 'a hundred and thirty-one'), 0.6, ring=1.1, pan=px(1370))
plk(SLIP, cw('twice', 'counted twice'), 0.6, ring=0.35)
both = cw('fixed', 'both say')
plk(72, both, 0.6, ring=0.8, pan=px(550)); plk(72, both + 0.14, 0.6, ring=0.8, pan=px(1370))
for i, m in enumerate((65, 69, 72)):
    bow(m, both + 0.2 + 0.04 * i, END('check', 'job') + 0.3, 0.75 if m == 72 else 0.6, att=0.5, rel=1.4)
for k in range(2):
    plk(65, cw('nightly', 'every night', 0.7 * k), 0.4, ring=0.6)
air(cc('monday'), 1.0, 0.010, px(300))
pin(cw('written', 'written down'), 0.016, px(400))
plk(65, cw('written', 'the next chat', 0.5), 0.4, ring=0.8, pan=px(750))
pencil(cw('person', 'signs', -0.2), 0.012, px(1300), 1.0)
chord(F_, cw('next', 'start in'), E('check') + 2.0, 0.8, att=1.2, rel=1.8)

# 6. Every pattern, every time: back by the river. The verse once, a note to each row as it lights; "the work holds": the mark, the
#    verse plucked and taken up by the bow; the end card on F
ew = lambda lid, word, off=0: W('every', lid, word, off)
figure(ew('hymn', 'every time'), VERSE, 0.35, 0.45)
agree(ew('holds', 'the work holds'), VERSE, 0.18, 2.6, 0.7, 0.65)
chord(F_, G('every', 'breath', -0.2), E('every') - 0.2, 0.8, att=1.0, rel=2.2)
