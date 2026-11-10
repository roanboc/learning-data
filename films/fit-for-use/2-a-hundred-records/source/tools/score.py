# A hundred records: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, reserved for this film by the module's setup thread on 5 November 2026, whose partner this
# film's thread chose the same day after checking every palettes.md in the project files and every score.py on main and on every
# branch (/mnt/project-files/data-quality/palettes.md): one scientist, Félix Savart, measuring sound two ways, by counting and by
# listening, as the film measures a list by profiling it and by looking at it. Both are made here (music.py has neither).
#  - The lead, a Savart wheel: the toothed wheel of the 1830s. A card held against its turning teeth is flicked once by each tooth,
#    and the clicks, close enough, become one note. Played as short plain notes: the card is pressed on, the wheel sings its pitch
#    for a moment, the card is lifted. A soft buzz from the card, kept low and dry, and a little rasp where no two teeth are quite
#    alike (at random, so nothing flutters). It counts: plots lit, cards drawn, a pointer settling, a tag.
#  - The partner, Savart's trapezoid violin of 1819: a flat, symmetrical box with straight sound holes, which the two Academies heard
#    and found very clear and even, a little subdued. Bowed softly and low (G3 to D5), plain, with no vibrato: a few long notes and
#    two-note chords, the people who know, listening. Its tone is a bowed string's, coloured by a few broad resonances of the box,
#    nothing above about 2.3 kHz.
#  - The mark: a few separate clicks of the wheel that, faster, become one clear note, G. It sounds where a few records come to say
#    how good a whole list is (the opening's "And for data"), where the hundred come to seventy-nine, and at the end card, where,
#    once the wheel has stopped, the violin plays that note on.
#  - The wheel and the violin play in turn, never on one note together. G major for the brewery, the method and the team; E minor for
#    the problem (a handful that can mislead, the reprinted certificates, the errors); C major when Gosset's maths works and when he
#    publishes; D major where something has to change and where a question leads on. Just intonation from G (see hz()), so held notes
#    don't beat; A is held only with D and F sharp, the only notes it's pure with in this table.
# The rules every film of the module keeps (the module's README and AGENTS.md, from the author's rules of 20 October and
# 4 November 2026):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato. No urgent pulse: nothing in this story is a rush. No
#    figure played again and again. Nothing borrowed from the opening's place: the brewery and its city get no music of their own.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (a hundred marks, a riffle of
#    cards, lines typed) is one soft texture, never one sound for each.
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
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1899)  # this film's own randomness: the room, the teeth, the bow

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. G major (G B D),
# C major (C E G), D major (D F sharp A), E minor (E G B) and B minor (B D F sharp) are pure in this table; A with C or with E is not
# (32/27 and 40/27), so A sounds only with D or F sharp
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (55, 195.998)  # G 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
G3, A3, B3, C4, D4, E4, Fs4, G4, A4, B4, C5, D5, E5 = 55, 57, 59, 60, 62, 64, 66, 67, 69, 71, 72, 74, 76
MARK = G4                             # the note the clicks become, and the violin plays on at the end

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the wheel's short notes a little over the violin's long ones;
# the effects well under the music (FX scales them all)
WL, VL, FX = 0.110, 0.080, 1.8

# a room round the players: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what
# it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level after it (_held), as
# the video guidelines ask. The wheel gets less of it than the violin: its buzz stays dry
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet, a=0.25, b=0.3):
    """a held note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body (from a seconds after
    its start to b seconds before its end), not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    i, j = int(a * SR), len(s) - int(b * SR)
    if j - i < int(0.05 * SR):
        i, j = 0, len(s)
    return r * float(np.sqrt((s[i:j].astype(np.float64) ** 2).mean() / max(1e-12, (r[i:j].astype(np.float64) ** 2).mean())))
def _level(s, a=0.02, b=0.1):
    """a sound brought to one level, measured over its body: so a note's g says how loud it is, whatever its pitch"""
    i, j = int(a * SR), max(int(a * SR) + 1, len(s) - int(b * SR))
    return s / max(1e-9, float(np.sqrt((s[i:j].astype(np.float64) ** 2).mean())) / 0.5)

# ---- the wheel. Each tooth flicks the card once: a short knock of the card, two soft resonances (the lower near 640 Hz, the upper
# near 1.25 kHz and quicker), so the clicks, close enough, make a note with a low, dry buzz and nothing much above 2 kHz
_CARD = (lambda x: filt((np.exp(-x / 0.0009) * np.sin(2 * np.pi * 640 * x)
                         + 0.4 * np.exp(-x / 0.00035) * np.sin(2 * np.pi * 1250 * x + 0.6)).astype(np.float32), 'low', 1900))(np.arange(int(0.012 * SR)) / SR)
_CARD = _CARD / np.abs(_CARD).max()
def _teeth(times, amps, n):
    """the card flicked at each time (in seconds from the start), each flick as loud as its amp: the clicks placed between samples,
    so their spacing is exact and the note true"""
    imp = np.zeros(n + 2); pos = np.asarray(times) * SR; i = np.floor(pos).astype(int); fr = pos - i
    ok = (i >= 0) & (i < n); np.add.at(imp, i[ok], amps[ok] * (1 - fr[ok])); np.add.at(imp, i[ok] + 1, amps[ok] * fr[ok])
    return fftconvolve(imp[:n], _CARD)[:n].astype(np.float32)
def _rasp(k):
    """no two teeth quite alike: each click a little louder or softer, at random, so the rasp is soft and nothing flutters"""
    return 1 + 0.035 * R1.standard_normal(k)

def wheel(m, s, g=1.0, pan=0.0, hold=0.24, rel=0.09, room=0.16):
    """a short plain note: the card pressed on (15 ms), the wheel's pitch for hold seconds, the card lifted"""
    f = hz(m); sec = 0.015 + hold + rel; n = int((sec + 0.05) * SR); k = int(sec * f) + 1
    t = np.arange(k) / f; sig = _teeth(t, _rasp(k), n).astype(np.float64); x = np.arange(n) / SR
    a = np.sin(0.5 * np.pi * np.clip(x / 0.015, 0, 1)) ** 2 * np.where(x < 0.015 + hold, 1.0, np.cos(0.5 * np.pi * np.clip((x - 0.015 - hold) / rel, 0, 1)) ** 2)
    sig = _level((sig * a).astype(np.float32), 0.015, rel + 0.05)
    put(_held(filt(filt(sig, 'high', 110), 'low', 1900, 4), room, 0.015, rel + 0.05), s, g * WL, pan)
def turn(notes, s, step=0.2, g=1.0, pan=0.0, spread=0.3, hold=0.2):
    """the wheel's notes one after another, as a few things come in turn"""
    for i, m in enumerate(notes):
        wheel(m, s + step * i, g, pan + spread * (i / max(1, len(notes) - 1) - 0.5), hold=hold)

# ---- the mark: the wheel turned by hand from still. A few separate clicks (two to five a second), then faster, through a short
# flutter, up into one clear note, MARK, as the wheel reaches its speed; then the card is lifted. Each click is softer as they come
# closer (each about as loud, over a twentieth of a second, as half the note), so the note is no louder than the clicks before it.
# s is when the note arrives; the clicks begin `lead` seconds before it. One sound for the whole mark, so the clicks are never heard
# as a burst of separate effects. The rise reaches the note still climbing a little, so it doesn't hang just under it (where its
# overtones would sit beside the note's own, as a beat)
def mark(s, g=1.0, pan=0.0, lead=2.6, hold=0.7, rel=0.1, room=0.16):
    f = hz(MARK); r0, r1 = 2.2, 5.0; t1 = 0.58 * lead; n = int((lead + hold + rel + 0.05) * SR)
    def rate(t):
        if t < t1:                                     # separate clicks, slowly faster
            return r0 * (r1 / r0) ** (t / t1)
        v = min(1.0, (t - t1) / (lead - t1))          # then up to the note, quickly at first, still rising a little as it
        return np.exp(np.log(r1) + (np.log(f) - np.log(r1)) * np.sin(0.425 * np.pi * v) / np.sin(0.425 * np.pi))  # arrives
    ts, t = [], 0.0
    while t < lead + hold + rel:
        ts.append(t); t += 1.0 / rate(t)
    ts = np.asarray(ts); rt = np.array([rate(u) for u in ts])
    amps = (r0 / rt) ** 0.2 * _rasp(len(ts)) * np.where(ts < t1, 0.8, 1.0)
    sig = _teeth(ts, amps, n).astype(np.float64); x = np.arange(n) / SR
    sig *= np.where(x < lead + hold, 1.0, np.cos(0.5 * np.pi * np.clip((x - lead - hold) / rel, 0, 1)) ** 2)
    body = sig[int(lead * SR):int((lead + hold) * SR)]
    sig = sig / max(1e-9, float(np.sqrt((body ** 2).mean())) / 0.5)
    put(_held(filt(filt(sig.astype(np.float32), 'high', 110), 'low', 1900, 4), room, lead, rel + 0.05), s - lead, g * WL, pan)

# ---- the violin. A bowed string's harmonics (each 1/k as loud as the first), coloured by the box: a few broad resonances, the air's
# near 275 Hz and the plates' near 460 Hz, 560 Hz and 1.05 kHz, the odd harmonics a little stronger than the even (a box's
# hollowness), and nothing much above 2.3 kHz. Bowed softly: the higher harmonics come in a little after the lower, with the bow's
# soft bite; then an even tone with a little bow noise under it; when the bow lifts, the string and the box ring on briefly, the
# higher harmonics first to go. No vibrato, no swell within the note
_BOX = ((275, 70, 1.0), (460, 120, 0.8), (560, 140, 0.6), (1050, 420, 0.38))
def _box(fq):
    return (0.2 + sum(gn / (1 + ((fq - f0) / (0.5 * bw)) ** 2) for f0, bw, gn in _BOX)) / (1 + (fq / 2000) ** 4)
def violin(m, a, b, g=1.0, pan=0.0, att=0.4, rel=0.7, room=0.3):
    """a long note, bowed from a to b"""
    f = hz(m); sec = max(0.6, b - a); n = int((sec + 4 * rel + 0.1) * SR); x = np.arange(n) / SR
    sig = np.zeros(n)
    for k in range(1, 40):
        fk = f * k
        if fk > 2400:
            break
        on = np.sin(0.5 * np.pi * np.clip(x / (att * (1 + 0.05 * k)), 0, 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) / (rel / (1 + 0.12 * (k - 1)))), 1.0)
        sig += (1.0 / k) * _box(fk) * (1.1 if k % 2 else 0.88) * on * off * np.sin(2 * np.pi * fk * x + R1.uniform(0, 2 * np.pi))
    env = np.sin(0.5 * np.pi * np.clip(x / att, 0, 1)) ** 2 * np.where(x > sec, np.exp(-(x - sec) / (0.35 * rel)), 1.0)
    bow = filt(R1.standard_normal(n).astype(np.float32), 'band', (450, 1800), 4) * (0.007 + 0.03 * np.exp(-x / 0.09)) * env
    sig = sig + bow * np.sqrt((sig[int(att * SR):int(sec * SR)] ** 2).mean()) / 0.05
    sig *= np.cos(0.5 * np.pi * np.clip((x - n / SR + 0.1) / 0.1, 0, 1)) ** 2
    sig = _level(sig.astype(np.float32), min(att, sec * 0.5), 4 * rel + 0.1)
    put(_held(filt(sig, 'low', 2300, 4), room, min(att, 0.5 * sec), 4 * rel + 0.1), a, g * VL, pan)
def double(m1, m2, a, b, g=1.0, pan=0.0, att=0.4, rel=0.7):
    """a two-note chord, both strings bowed together, the lower a little louder"""
    violin(m1, a, b, g * 0.75, pan - 0.08, att, rel); violin(m2, a, b, g * 0.6, pan + 0.08, att * 1.1, rel)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft wooden knock: a card or a window set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap: a row lit, a tag, a chip"""
    s_tap(s, g * FX, pan)
def jar(s, g=0.010, pan=0.0):
    """a glass jar of seed set on the bench"""
    s_knock(s, g * FX, pan, 470)
def tick(s, g=0.009, pan=0.0):
    """a dial's needle coming to rest"""
    s_knock(s, g * FX, pan, 560); s_tap(s + 0.008, g * 0.5 * FX, pan)
def paper(s, g=0.011, pan=0.0, sec=0.4):
    """a sheet laid down, a page"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 1500), 4)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pen(s, g=0.008, pan=0.0, sec=0.35):
    """a field marked: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1700), 4)[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def flip(s, g=0.009, pan=0.0):
    """a card turned face down"""
    x = tt(0.16); X(filt(noise(0.16), 'band', (300, 1500), 4)[:len(x)] * np.sin(np.pi * x / 0.16) ** 2, s, g * FX, pan); s_knock(s + 0.15, g * 0.8 * FX, pan, 300)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something sliding in or across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def _soft(sec, lo, hi, every):
    """one soft texture for many small things at once: noise in a band, its level wandering smoothly (never a click)"""
    n = int(sec * SR); w = filt(R1.standard_normal(n).astype(np.float32), 'low', 1.0 / every)
    w = 0.6 + 0.4 * w / max(1e-9, float(np.abs(w).max())); x = np.arange(n) / SR
    return filt(noise(sec), 'band', (lo, hi), 4)[:n] * w * np.sin(np.pi * np.clip(x / sec, 0, 1)) ** 2
def riffle(s, sec=0.9, g=0.008, pan=0.0):
    """many cards or marks coming in at once: one soft riffle, swelling and fading"""
    X(_soft(sec, 400, 1500, 0.06), s, g * FX, pan)
def shuffle(s, sec=0.9, g=0.009, pan=0.0):
    """a stack of cards shuffled: one soft swell, lower than a riffle"""
    X(_soft(sec, 250, 1400, 0.1), s, g * FX, pan)
def keys(s, sec=1.6, g=0.006, pan=0.0):
    """lines typed, or a window filling: one soft texture"""
    X(_soft(sec, 500, 1500, 0.08), s, g * FX, pan)
def bars(s, sec=1.6, g=0.006, pan=0.0):
    """bars drawn one after another with a pencil: one soft texture"""
    X(_soft(sec, 350, 1500, 0.12), s, g * FX, pan)

# =============================================================================================================================
# 1. A few careful trials: the opening, with music all through it.
#    Dublin, 1899: G major, the violin's open G and D, the wheel's B as Gosset's name comes; better barley, the wheel's D, two jars.
#    A trial: C major, four plots lit, the wheel counting them; a whole season, then only a handful of results, and the problem:
#    E minor, the two questions. The day's arithmetic: C major for large numbers; "Nobody could say": B minor, the wheel's A for the question.
#    "Something had to change": D major. He worked it out: G major. Three thousand cards by hand: the stack, one shuffle, the wheel
#    counting the four drawn. 1908: C major for the paper, his name turned face down; enough, or more trials: the wheel's B, then its
#    A. The kiln: the pairs drawn, the wheel's B for a little more grain, E minor for worse barley. Still used: three chips, the wheel
#    rising. And for data: the mark. The university: G major as every check passes, E minor for the forty-one. Friday: the violin for
#    the three people, the hundred in one riffle, the hundred marked in another, the wheel for seventy-nine, the map. The title card:
#    the wheel rising through G, then the violin's open G and D
F = lambda lid, word, off=0: W('first', lid, word, off)
f0 = S0('first')
double(G3, D4, f0 + 0.3, F('dublin', 'joins', 0.6), 0.8, att=1.4, rel=1.0)
wheel(B4, F('dublin', 'William', -0.2), 0.6, px(800))
tB = F('barley', 'better', -0.3)
double(G3, B3, tB - 0.2, F('barley', 'best beer', 0.6), 0.7, att=1.0, rel=0.9)
wheel(D5, tB, 0.5, px(1230))
jar(F('barley', 'which', -0.2), 0.010, px(1560)); jar(F('barley', 'how', -0.2), 0.010, px(1740))
# a trial: the four plots lit one after another, the wheel counting them; a whole season; a handful of results, flown to the top
tSo = F('field', 'sowing', 0.1)
double(C4, E4, tSo - 0.6, F('field', 'handful', -0.3), 0.7, att=1.0, rel=0.9)
turn((G4, A4, B4, D5), tSo, 0.18, 0.5, px(900), 0.2, hold=0.16)
air(F('field', 'season', -0.3), 2.6, 0.006, px(1620), 160, 700)
for k in range(4):
    tap(F('field', 'handful', -0.1 + k * 0.2 + 0.75), 0.008, px(645 + k * 160))
# only a handful, and what it can do: E minor, a question card for each mistake
double(B3, E4, F('field', 'handful', 0.6), F('mislead', 'year', 0.4), 0.7, att=0.9, rel=0.9)
knock(F('mislead', 'wrong', -0.2), 0.011, px(380), 230)
double(G3, E4, F('mislead', 'turn', -0.4), END('first', 'mislead') + 1.2, 0.65, att=1.0, rel=0.9)
knock(F('mislead', 'turn', -0.2), 0.011, px(1540), 230); wheel(D5, F('mislead', 'turn', 0.1), 0.45, px(1540))
# the day's arithmetic: C major as the large numbers' curve grows; "Nobody could say": B minor, and the wheel's A as the question
knock(G('first', 'maths', -0.3), 0.012, px(1100), 220)
double(G3, C4, G('first', 'maths', -0.1), F('maths', 'Nobody', -0.4), 0.65, att=1.0, rel=0.8)
double(B3, Fs4, F('maths', 'Nobody', 0.0), END('first', 'maths') + 1.3, 0.65, att=0.9, rel=0.9)
wheel(A4, F('maths', 'Nobody', 0.6), 0.45, px(1100))
# "Something had to change": D major; he worked it out, and how sure: G major, the wheel's D as "For a few" comes
double(D4, Fs4, G('first', 'change', -0.15), F('worked', 'worked', 0.0), 0.7, att=0.6, rel=0.9)
double(G3, B3, F('worked', 'worked', -0.1), END('first', 'worked') + 1.0, 0.7, att=0.8, rel=1.0)
wheel(D5, F('worked', 'worked', 1.0), 0.5, px(1392))
# three thousand cards, by hand: the stack set down, its chip, one shuffle; four drawn, the wheel counting them; 750 samples of four
knock(F('cards', 'by hand', -0.3), 0.013, px(900), 210)
tap(F('cards', 'three thousand', -0.1), 0.008, px(1300))
shuffle(F('cards', 'shuffled', -0.1), 0.9, 0.008, px(900))
turn((G4, B4, D5, B4), F('cards', 'drawn', 0.15), 0.32, 0.5, px(1030), 0.5, hold=0.18)
tap(F('cards', 'drawn', 1.7), 0.008, px(1105))
# 1908: the paper, by Student, C major; his name on a card, turned face down; then G major again
tP = F('student', 'published', -0.3)
paper(tP, 0.011, px(1100), 0.45)
double(C4, E4, tP - 0.1, F('student', 'Student', 0.9), 0.65, att=0.9, rel=0.9)
wheel(G4, F('student', 'Student', -0.1), 0.45, px(1100))
knock(F('student', 'Student', 0.4), 0.010, px(520), 240)
flip(F('student', 'not under', 0.2), 0.009, px(520))
double(G3, D4, F('student', 'not under', 0.6), F('enough', 'enough', -0.6), 0.6, att=1.0, rel=0.9)
# what the tables gave: ENOUGH, the wheel's B; MORE TRIALS, its A, a step short
tE = F('enough', 'enough', -0.3)
knock(tE, 0.010, px(1462), 260); wheel(B4, tE + 0.05, 0.55, px(1462))
tM = F('enough', 'more', -0.3)
knock(tM, 0.010, px(1462), 240); wheel(A4, tM + 0.05, 0.5, px(1462))
# the kiln-dried seed: eleven pairs of plots drawn on a card, a little more grain (the wheel's B), and worse barley: E minor
bars(F('kiln', 'eleven', 0.0), 1.6, 0.006, px(960))
double(D4, G4, F('kiln', 'eleven', -0.2), F('kiln', 'little more', -0.6), 0.6, att=1.0, rel=0.9)
knock(F('kiln', 'little more', -0.2), 0.010, px(960), 240); wheel(B4, F('kiln', 'little more', 0.0), 0.5, px(960))
knock(F('kiln', 'worse', -0.2), 0.010, px(1380), 240)
double(G3, E4, F('kiln', 'worse', -0.1), F('still', 'medicine', -1.0), 0.65, att=0.9, rel=1.0)
# still used: three chips, the wheel rising through G
turn((G4, B4, D5), F('still', 'medicine', -0.15), F('still', 'farming') - F('still', 'medicine'), 0.5, px(1100), 0.5, hold=0.2)
# and for data: a few records, looked at closely, say how good a whole list is: the mark, its note as the list comes in
mark(F('data', 'whole list', 0.0), 0.95, px(960), lead=3.2)
# the university: every check passes, G major; yet forty-one certificates printed again: E minor
for k in range(3):
    knock(F('uni', 'passed', -0.25 + 0.2 * k), 0.008, px(700 + 260 * k), 250)
    tap(F('uni', 'passed', 0.35 + 0.2 * k), 0.008, px(660 + 260 * k))
double(G3, D4, F('uni', 'passed', -0.2), F('uni', 'Yet', 0.1), 0.6, att=0.7, rel=0.8)
paper(F('uni', 'forty-one', -0.3), 0.010, px(1440), 0.4)
double(B3, E4, F('uni', 'forty-one', -0.2), END('first', 'uni') + 1.3, 0.65, att=0.8, rel=1.0)
# Friday: the three people, the violin; the hundred, one riffle; the hundred marked, another; seventy-nine, the wheel; the map
double(G3, B3, G('first', 'friday', 0.1), F('friday', 'hundred', 0.2), 0.6, att=1.0, rel=0.9)
riffle(F('friday', 'hundred', -0.3), 0.9, 0.007, px(1268))
riffle(F('honest', 'Seventy-nine', -0.2), 1.2, 0.006, px(1268))
turn((B4, D5), F('honest', 'Seventy-nine', 0.4), 0.26, 0.5, px(1564), 0.1, hold=0.22)
double(B3, D4, F('honest', 'map', 0.0), G('first', 'breath', -0.6), 0.6, att=0.9, rel=1.0)
# the title card: the wheel rising through G, then the violin's open G and D, ringing into the bench
tT = G('first', 'breath', 0.2)
turn((G4, B4, D5), tT, 0.17, 0.55, 0.0, 0.4, hold=0.22)
double(G3, D4, tT + 0.8, E('first') - 0.6, 0.65, att=0.8, rel=1.1)

# 2. A hundred, by hand: what they agreed in January, the violin; the certificate's need, the wheel. Each field a certificate needs,
#    a tap as it's lit; a field marked wrong, the violin's E; PERFECT, a tap. Two hours later: the mark, its note as seventy-nine
#    comes. Twenty-one with an error: E minor. Each kind of error, a tap as its bar grows. The Friday afternoon measurement: G major
L = lambda lid, word, off=0: W('look', lid, word, off)
for w_, x in (('Malia', 100), ('Mei', 460), ('Jun', 820)):
    tap(L('who', w_, -0.2), 0.007, px(x + 120))
double(G3, D4, L('january', 'January', -0.2), L('january', 'certificate', -0.6), 0.6, att=0.8, rel=0.9)
knock(L('january', 'certificate', -0.3), 0.011, px(1560), 240); wheel(B4, L('january', 'certificate', -0.2), 0.5, px(1560))
air(L('hundred', "December's", -0.2), 0.8, 0.007, px(1450), 160, 800)
paper(L('hundred', 'hundred', 0.0), 0.009, px(1450), 0.4)
knock(L('fields', 'fields', -0.4), 0.010, px(530), 230)
for w_ in ('the names', 'the award', 'the ceremony', 'the date'):
    tap(L('fields', w_, -0.1), 0.007, px(530))
tMk = L('mark', 'mark', 0.5)
pen(tMk, 0.008, px(700)); violin(E4, tMk - 0.05, tMk + 1.3, 0.6, px(700), att=0.35, rel=0.7)
knock(L('mark', 'nothing marked', 0.0), 0.010, px(1390), 240)
tap(L('mark', 'perfect', -0.2), 0.009, px(1570))
# two hours later: the hundred marked in one riffle, and the mark, its note as seventy-nine comes
tap(G('look', 'later', 0.0), 0.007, px(1250))
riffle(L('later', 'seventy-nine', -0.5), 1.2, 0.006, px(560))
mark(L('later', 'seventy-nine', 0.2), 0.9, px(1200), lead=2.6)
# twenty-one with an error, twenty-six in all: E minor; then each kind of error, a tap as its bar grows
double(B3, E4, L('errors', 'Twenty-one', -0.1), L('errors', 'twenty-six', 1.2), 0.6, att=0.7, rel=0.9)
for w_ in (('names', 'Fifteen'), ('names', 'accents'), ('names', 'cut short'), ('names', 'swapped'), ('rest', 'awards'), ('rest', 'ceremonies'), ('rest', 'dates')):
    tap(L(w_[0], w_[1], -0.2), 0.006, px(1500))
# back at the bench, four o'clock: what Thomas Redman calls it, G major; all it needs, a chip each
knock(L('redman', 'Friday afternoon', -0.6), 0.011, px(1540), 240)
double(D4, G4, L('redman', 'Friday afternoon', -0.5), END('look', 'redman') + 0.6, 0.6, att=0.9, rel=0.9)
for w_ in ('a hundred records', 'the people', 'an afternoon'):
    tap(L('tools', w_, -0.15), 0.007, px(1400))

# 3. Is a hundred enough? Gosset's question again: B minor, the wheel's A; the pointer settles on 79, the wheel's G; good to about
#    eight either way, G major. One in five wrong: the violin's E. Seventy-nine of a hundred: the wheel's D. The puzzle, forty-one
#    reprinted: E minor. Put right by hand, nobody counted: the violin's E falling to D; the hidden factory, the wheel's B
Q = lambda lid, word, off=0: W('sure', lid, word, off)
air(S0('sure') + 0.4, 0.9, 0.007, px(1210), 160, 800)
paper(Q('all', 'a hundred records', 0.0), 0.009, px(1210), 0.4)
tQ = Q('question', "Gosset's", -0.4)
knock(tQ, 0.011, px(1540), 240)
double(B3, Fs4, tQ, Q('question', 'trusted', 0.6), 0.6, att=0.8, rel=0.9)
riffle(Q('question', "Gosset's", 0.2), 0.6, 0.006, px(1430))
wheel(A4, Q('question', "Gosset's", 0.8), 0.45, px(1430))
knock(G('sure', 'margin', -0.2), 0.010, px(1540), 240)
wheel(G4, Q('margin', 'like the rest', 1.0), 0.5, px(1500))
double(G3, B3, Q('margin', 'about eight', -0.2), Q('margin', 'between', 0.4), 0.55, att=0.8, rel=0.9)
riffle(Q('act', 'one record in five', -0.3), 0.6, 0.006, px(1490))
violin(E4, Q('act', 'one record in five', -0.1), Q('act', 'wrong', 0.4), 0.55, px(1490), att=0.35, rel=0.7)
air(Q('recent', 'most recent', 0.0), 1.6, 0.006, px(1000), 160, 700)
tap(Q('recent', 'made now', -0.3), 0.007, px(1640))
wheel(D5, Q('plain', 'seventy-nine', -0.3), 0.5, px(1250))
knock(Q('puzzle', 'forty-one', -0.3), 0.011, px(1350), 240)
double(G3, E4, Q('puzzle', 'forty-one', -0.2), Q('puzzle', 'two certificates', 1.2), 0.6, att=0.8, rel=0.9)
knock(Q('over', 'twenty-one', -0.3), 0.011, px(1700), 240)
tHd = Q('hidden', 'by hand', -0.3)
tap(tHd, 0.008, px(1830))
violin(E4, tHd + 0.05, Q('hidden', 'nobody counted', -0.2), 0.55, px(1700), att=0.4, rel=0.6)
violin(D4, Q('hidden', 'nobody counted', -0.1), Q('hidden', 'work', 0.5), 0.55, px(1700), att=0.4, rel=0.8)
knock(Q('factory', 'hidden factory', -0.3), 0.010, px(1630), 240); wheel(B4, Q('factory', 'hidden factory', -0.2), 0.45, px(1630))

# 4. The whole list, described: where to look? D major, a question. The platform's windows, a knock each, the click a tap; the profile
#    reads every row, the wheel's D as it finishes; each metric, a tap as it's named. Two things stand out: E minor; the field's length,
#    the wheel's B; the same name twice, the wheel's E twice. Counts of his own: one soft texture, a knock for each count. Every
#    accent gone: E minor. Only the profile could see them: the wheel rising through G as the 312 light; what each said: G major
P = lambda lid, word, off=0: W('profile', lid, word, off)
tap(P('where', 'how good', -0.2), 0.007, px(1660))
double(D4, A4, P('where', 'where to look', -0.2), P('where', 'two thousand', 1.6), 0.55, att=0.8, rel=0.9)
air(P('describe', 'whole list', -0.3), 1.0, 0.006, px(1210), 160, 800)
knock(P('notebook', 'notebook', -0.4), 0.011, px(490), 240)
tap(P('notebook', 'one click', -0.2), 0.008, px(490))
knock(P('notebook', 'keeps', -0.3), 0.011, px(1400), 240)
knock(P('notebook', 'data profiling', -0.3), 0.010, px(1400), 220)
keys(G('profile', 'profiling', -0.4), 0.8, 0.005, px(1400))
riffle(P('profiling', 'each column', -0.3), 0.9, 0.006, px(780))
wheel(D5, P('profiling', 'every row', 1.3), 0.5, px(780))
for w_ in ('empty', 'different', 'shortest', 'longest'):
    tap(P('columns', w_, -0.2), 0.006, px(780))
knock(P('columns', 'come up most', -0.2), 0.010, px(1530), 240)
tap(P('december', "December's", -0.3), 0.007, px(500))
double(B3, E4, G('profile', 'stand', 0.0), END('profile', 'stand') + 1.2, 0.55, att=0.6, rel=0.9)
tap(P('thirty', 'thirty', -0.2), 0.007, px(1000))
wheel(B4, P('thirty', 'length of the field', -0.4), 0.5, px(760))
turn((E5, E5), P('capitals', 'same name twice', -0.2), 0.36, 0.45, px(1530), 0.0, hold=0.16)
keys(P('metrics', 'custom metrics', -0.4), 2.4, 0.005, px(720))
for w_ in (('fortyone', 'Forty-one'), ('caps', 'Three hundred'), ('accents', 'not one name')):
    knock(P(w_[0], w_[1], -0.3), 0.009, px(1440), 250)
knock(P('accents', 'Eight', -0.3), 0.010, px(1560), 240)
double(G3, E4, P('accents', 'every accent', -0.2), END('profile', 'accents') + 1.2, 0.55, att=0.8, rel=0.9)
knock(G('profile', 'since', 0.2), 0.010, px(1250), 230)
turn((G4, B4, D5), P('everyrow', 'every row', 0.0), 0.2, 0.5, px(1250), 0.3, hold=0.2)
double(G3, B3, P('said', 'how good', -0.3), E('profile') - 0.3, 0.55, att=0.8, rel=1.0)

# 5. Then the checks: the findings, a tap each; the first check's needle settles outside what's allowed, the wheel's B; the third,
#    no accent at all, the violin's E. Mei owns them; each holds for a person to look, a tag each; none stops the list: G major. In the
#    project, with dbt: lines typed; the platform's monitoring, a knock and two taps. What no check can see: the violin's low B;
#    allowed, and wrong: its E. Something outside the list to compare with: D major, leading on
C = lambda lid, word, off=0: W('checks', lid, word, off)
riffle(C('now', 'profile showed', -0.2), 0.7, 0.006, px(900))
CH = ((620, G('checks', 'cut', 0.1)), (900, G('checks', 'upper', 0.1)), (1180, G('checks', 'none', 0.1)))
for x, t0 in CH:
    knock(t0, 0.009, px(x), 250); tick(t0 + 1.7, 0.008, px(x))
wheel(B4, CH[0][1] + 1.75, 0.5, px(620))
violin(E4, CH[2][1] + 1.75, C('none', 'single accent', 1.2), 0.55, px(1180), att=0.35, rel=0.7)
tap(C('chance', 'Eight', -0.2), 0.007, px(1500))
tap(C('owner', 'Mei owns', -0.1), 0.007, px(900))
for i in range(3):
    tap(C('level', 'holds', -0.2 + 0.25 * i), 0.008, px(590 + 280 * i))
double(G3, D4, C('level', 'none stops', -0.2), C('level', 'own', 0.8), 0.55, att=0.8, rel=0.9)
knock(C('dbt', 'the project', -0.2), 0.011, px(990), 240)
keys(C('dbt', 'the project', 0.6), 2.8, 0.005, px(990))
tap(C('dbt', 'Monday', -0.3), 0.007, px(990))
knock(C('monitor', 'monitoring', -0.3), 0.010, px(1680), 240)
tap(C('monitor', 'on time', -0.2), 0.007, px(1680)); tap(C('monitor', 'on time', 0.2), 0.007, px(1680))
tN = C('cant', 'no check', 0.0)
tap(tN, 0.008, px(560)); violin(B3, tN - 0.1, END('checks', 'cant') + 0.8, 0.55, px(560), att=0.5, rel=0.8)
for w_ in ('swapped', 'the awards', 'the ceremonies', 'the dates'):
    tap(C('allowed', w_, -0.1), 0.006, px(560))
knock(C('allowed', 'allowed values', -0.5), 0.010, px(1490), 240); tap(C('allowed', 'allowed values', 0.0), 0.008, px(1270))
tW = C('allowed', 'Allowed, and wrong', 0.3)
pen(tW, 0.008, px(1490)); violin(E4, tW, tW + 1.3, 0.55, px(1490), att=0.35, rel=0.6)
knock(C('outside', 'something outside', -0.2), 0.011, px(1410), 240)
double(D4, A4, C('outside', 'something outside', -0.1), C('outside', 'next film', -0.2), 0.55, att=0.8, rel=0.9)
tap(C('outside', 'next film', -0.3), 0.007, px(1250))

# 6. Look first: back in Dublin, G major; enough, the wheel's B, as in 1908. The team did the same: the hundred,
#    one riffle; the whole list, a tap. Seventy-nine is where they start; measured again: G major. The checks where the errors are:
#    the wheel rising through G as their tags come. The end card: the mark, and once the wheel has stopped, the violin plays its note on
K = lambda lid, word, off=0: W('close', lid, word, off)
k0 = S0('close')
riffle(k0 + 0.4, 0.7, 0.006, px(1030))
double(G3, D4, k0 + 0.6, k0 + 3.6, 0.6, att=0.9, rel=1.0)
tE2 = K('back', 'enough', -0.3)
knock(tE2, 0.010, px(900), 260); wheel(B4, tE2 + 0.05, 0.5, px(900))
knock(K('back', 'more were needed', -0.3), 0.010, px(1180), 240)
riffle(K('same', 'a hundred records', -0.3), 0.9, 0.006, px(1268))
tap(K('same', 'whole list', -0.2), 0.008, px(1564))
knock(G('close', 'start', -0.1), 0.010, px(1540), 240)
double(G3, B3, K('start', 'measure again', -0.2), K('start', 'changes worked', 0.2), 0.55, att=0.8, rel=1.0)
knock(K('measured', 'measured first', -0.4), 0.010, px(1564), 240)
turn((G4, B4, D5), K('measured', 'where the errors are', -0.4), 0.2, 0.5, px(1564), 0.6, hold=0.2)
# the end card: the mark, its note as the film's line begins; the wheel stops, and the violin plays the note on, its open G under it
tEnd = G('close', 'takeaway', -0.4)
tNote = tEnd + 2.1
mark(tNote, 0.9, 0.0, lead=2.1)
violin(MARK, tNote + 0.75, E('close') - 4.2, 0.6, 0.05, att=0.3, rel=1.1)
violin(G3, tNote + 0.9, E('close') - 4.2, 0.45, -0.05, att=0.6, rel=1.1)
