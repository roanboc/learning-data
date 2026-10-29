# The marketplace: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (checked against the prologue, Governance principles and Governance on the map, and against this
# series' other films, so none repeats): a hammered dulcimer, struck softly with felt hammers and damped, so no string rings on under
# the voice, and two cup-muted trumpets, low and quiet, that answer it: a request, and its answer. Both are made here (music.py has
# neither), played softly.
#  - The dulcimer rolls the chords under the opening, as Anil plans the faculty's places, asks around in September and gets a copy that
#    counts one, and as the products come into one catalogue, a request goes to an owner, and the owner says yes; after it, only at a
#    chapter's turn, under a moment on screen or in a pause without words.
#  - The marks mean the same all through. A request is two notes rising on the dulcimer, B to E, and the owner's yes is the trumpets'
#    answer, a soft third, A and C sharp, a moment later. The key with a date is one trumpet note held, E, which ends, without a fall,
#    on the date. The shop window is the dulcimer's figure across its range, A up to E, every tile a note. In the opening, the emails
#    going out are the request's call three times, unanswered, and the copy's return is the same call played back a tone low, A to D;
#    the copy in the inbox has the call with no answer ("nobody's yes") and a trumpet note held with no date ("no end date"), until
#    "Something had to change" stops it. The partner far off hears the same answer from further away: the trumpets an octave lower.
#  - The series' mark, four notes, 1-5-4-8, on the dulcimer, under the title, the trumpets answering an octave below with its last two
#    notes; under the end card, the last of the series, both play it whole, once.
#  - A major all through.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, and after it only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the
#    opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: each note is one voice, with no second voice a little out of tune beside it, no vibrato and no
#    chorus; the dulcimer's notes are single strings, never the courses of two or three a dulcimer usually has; the trumpets are tuned
#    exactly with the dulcimer and hold their notes steady. Every chord is tuned pure (just intonation, see hz()), and B is never held
#    with D or F sharp (their intervals aren't pure here), so the chords used are A, D, E, F sharp minor and C sharp minor, the E chord
#    voiced without its B, and the request's B only ever sounds over A or E.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in
#    src/scenes.js (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz: keys, an email's soft whoosh, an envelope opened, a card into a tray, a
# stamp, a small key on a ring, a drawer, and the series' paper, pins and pencil.

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
R1 = np.random.default_rng(26)  # this film's own randomness: the room, the hammers, the paper, the keys

# ---- tuning: just intonation from A, so a chord's notes are whole-number ratios of each other and nothing beats. The chords used
# are I, IV, V, vi and iii, whose fifths and thirds are all pure in this table; B is never held with D or F sharp (a Pythagorean third
# and a wolf fifth, both here)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (45, 110.0)  # A 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords, as (the bass, (the notes above it, lowest first)), one string to a note. E is voiced without its B, which only the
# request plays
I, IV, V, vi, iii = (45, (57, 61, 64)), (50, (57, 62, 66)), (52, (56, 64, 68)), (54, (57, 61, 66)), (49, (56, 61, 64))

# ---- the levels: the two sit about as far under the voice as the series' other films' music (matched by loudness, not by peak); the
# trumpets low and quiet; the effects about 12 dB under the music (FX scales them all)
DL, TL, FX = 0.13, 0.04, 1.6
PAN = {'t1': -0.3, 't2': -0.14}  # the trumpets a little left; the dulcimer spreads a little by pitch, low notes left, high right

# a small room of wood and plaster round the players, ringing on for about a second and a half
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.4)).astype(np.float32))(np.arange(int(1.4 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())

# ---- the hammered dulcimer: one steel string to a note, struck near its bridge with a hammer faced with felt, softly, and damped by
# hand once it has rung. The strike near the bridge favours the second to fourth harmonics; the felt rounds them off, and the higher
# ones die sooner; its box's air rings near 190 Hz and its top near 380 and 700 Hz; nothing above about 2.4 kHz
DB = [(190, 70, 0.7), (380, 140, 1.0), (700, 260, 0.6)]
def dulc(m, s, g=1.0, pan=None, ring=1.4):
    """a note on the dulcimer, struck at s, damped after ring seconds"""
    f = hz(m); sec = ring + 0.35; x = tt(sec).astype(np.float64); sig = np.zeros(len(x)); d1 = 1.5 * (220 / f) ** 0.5
    for k in range(1, int(2400 // f) + 1):
        fk = f * k; dk = d1 / (1 + 0.3 * (k - 1) ** 1.2)
        a = abs(np.sin(np.pi * k * 0.12)) / k ** 0.6 * np.exp(-fk / 2600) * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in DB) + 0.35)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.5 * k * k) * (0.5 * np.exp(-x / (0.25 * dk)) + 0.5 * np.exp(-x / dk))
    sig = sig * np.minimum(1, x / 0.005) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.3, 1)) ** 2, 1.0)
    sig = sig + 0.03 * filt(noise(sec)[:len(x)], 'band', (120, 700)) * np.exp(-x / 0.005)  # the felt meeting the string
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    sig = np.pad(sig, (0, len(_IR) - 1)) + 0.22 * fftconvolve(sig, _IR).astype(np.float32)
    put(sig.astype(np.float32), s, g * DL, max(-0.3, min(0.35, 0.06 + (m - 66) * 0.012)) if pan is None else pan)

# ---- the trumpets, each with a cup mute: low and quiet, one voice each, held steady, with no vibrato. A soft trumpet is mostly its
# fundamental, each harmonic softer than the last, the brass lifting a few near 1 kHz; the cup over the bell takes the edge off,
# nothing above about 2.2 kHz, a round, hollow tone. Its higher harmonics speak a moment after the first, as a brass note does
def _tpt(f):
    """the weights of a cup-muted trumpet's harmonics, played softly, at f Hz"""
    n = max(1, int(2400 // f)); k = np.arange(1, n + 1); fk = f * k
    a = np.exp(-0.62 * (k - 1)) * (1 + 0.6 * np.exp(-((fk - 1000) / 450) ** 2)) / (1 + (fk / 1500) ** 4)
    return a / np.sqrt((a ** 2).sum())
def tpt(m, a, b, g=1.0, att=0.09, rel=0.3, pan=None, room=0.35):
    """one trumpet holds m from a to b, and lets go over rel seconds: no fall in pitch, and a long note swells a little and eases, once"""
    f = hz(m); sec = b - a; n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for j, aj in enumerate(_tpt(f)):
        k = j + 1; e = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.35 * (k - 1))), 1)) ** 2
        s = s + aj * e * np.sin(2 * np.pi * f * k * x + 0.3 * k)
    env = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    if sec >= 0.95:
        env = env * (0.86 + 0.14 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s * env; nb = min(n, int(0.2 * SR))  # and a breath of air as the note speaks
    s[:nb] += 0.012 * filt(noise(0.2), 'band', (300, 1500))[:nb] * np.exp(-np.arange(nb) / SR / 0.04)
    s = filt(s.astype(np.float32), 'low', 2300)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), a, g * TL, PAN['t1'] if pan is None else pan)

# ---- what the two play
def roll(c, a, b, g=0.6, step=0.12, top=True, ring=2.6):
    """a chord rolled on the dulcimer, the bass first and the notes above a moment apart, lowest first, each let ring until b (at most
    ring seconds) and damped. c is (bass, (notes above)); top=False leaves out the top note, when the line plays above it"""
    bs, rh = c
    for i, m in enumerate((bs,) + tuple(rh if top else rh[:-1])):
        dulc(m, a + step * i, g * (0.8 if i == 0 else 0.65), ring=min(ring, max(0.8, b - a - step * i)))
def line(notes, g=0.6, ring=1.6):
    """the dulcimer's line: [(time, note)], each struck as it comes and damped when the next is struck, or after ring seconds"""
    for i, (s, m) in enumerate(notes):
        nx = notes[i + 1][0] if i + 1 < len(notes) else s + ring
        dulc(m, s, g, ring=min(ring, max(0.5, nx - s + 0.25)))
def ask(s, g=0.8):
    """a request: two notes rising on the dulcimer, B to E"""
    dulc(71, s, g, ring=1.1); dulc(76, s + 0.24, g * 0.95, ring=1.6)
def returned(s, g=0.75):
    """the same call played back a tone low, A to D: the copy coming back"""
    dulc(69, s, g, ring=1.1); dulc(74, s + 0.24, g * 0.95, ring=1.6)
def yes(s, g=1.0, low=False, sec=1.4):
    """the owner's yes: the trumpets' answer, a soft third, A and C sharp; low, an octave lower, heard from further away"""
    o = -12 if low else 0
    tpt(69 + o, s, s + sec, g, pan=PAN['t1']); tpt(73 + o, s + 0.03, s + sec, g * 0.9, pan=PAN['t2'])
def held(s, e, g=0.9, rel=0.14):
    """the key with a date: one trumpet holds E from s, and ends, without a fall, at e"""
    tpt(64, s, e, g, att=0.14, rel=rel, pan=PAN['t2'])
def window(s, step=0.25, g=0.6, notes=(57, 61, 64, 69, 73, 76)):
    """the shop window: the dulcimer's figure across its range, A up to E, a note for each tile as it comes"""
    for i, m in enumerate(notes):
        dulc(m, s + step * i, g * (0.8 if i < len(notes) - 1 else 0.95), ring=1.3 if i < len(notes) - 1 else 2.0)
def mark(s, g=1.45, step=0.42):
    """the series' mark, 1-5-4-8, on the dulcimer; the trumpets answer an octave below with its last two notes, 4 and 8"""
    for i, m in enumerate([69, 76, 74, 81]):
        dulc(m, s + step * i, g * (0.8 if i == 3 else 0.7), ring=2.2 if i == 3 else 1.0)
    a = s + 4 * step + 0.25
    tpt(62, a, a + step, g * 0.8, att=0.07, rel=0.1, pan=PAN['t1']); tpt(69, a + step, a + step + 1.6, g * 0.8, att=0.07, rel=0.7, pan=PAN['t2'])
def whole(s, g=1.5, step=0.46):
    """the mark whole, once, for the series: the dulcimer strikes 1-5-4-8 and the trumpets play it with it, an octave below, each
    holding its note until the next comes, the last until the end"""
    for i, m in enumerate([69, 76, 74, 81]):
        dulc(m, s + step * i, g * (0.8 if i == 3 else 0.7), ring=2.6 if i == 3 else 1.0)
    for i, m in enumerate([57, 64, 62, 69]):
        last = i == 3
        tpt(m, s + step * i, s + step * i + (2.4 if last else step), g * 0.8, att=0.07, rel=0.9 if last else 0.08, pan=PAN['t1'] if i % 2 == 0 else PAN['t2'])

# ---- soft sounds on the desks, screens and the campus, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.012, pan=0.0, step=0.13):
    """a few keys typed, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.02, pan=0.0, sec=0.45):
    """a sheet of paper laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pin(s, g=0.022, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.6):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def strike(s, g=0.012, pan=0.0, sec=0.6):
    """a line struck through: a pencil drawn quickly, firmer as it starts"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def marker(s, g=0.012, pan=0.0, sec=0.6):
    """a highlighter drawn along a line: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def stamp(s, g=0.02, pan=0.0):
    """a rubber stamp pressed on a sheet: a padded thud"""
    x = tt(0.25); X(norm(filt((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 25) + 0.4 * filt(noise(0.25), 'band', (150, 800))[:len(x)] * np.exp(-x * 35)).astype(np.float32), 'low', 900)), s, g * FX, pan)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def _moving(sig, s, g, p0, p1, n=8):
    """a sound that crosses the stereo field from p0 to p1: overlapping slices, each placed a little further along"""
    L = len(sig); ix = np.arange(L); h = L / n
    for i in range(n):
        w = np.cos(0.5 * np.pi * np.clip((ix - (i + 0.5) * h) / h, -1, 1)) ** 2
        X((sig * w).astype(np.float32), s, g, p0 + (p1 - p0) * (i + 0.5) / n)
def whoosh(s, sec=0.7, g=0.012, p0=0.0, p1=0.0):
    """an email sent: a soft whoosh of air that follows the envelope across the frame"""
    x = tt(sec); _moving(filt(noise(sec), 'band', (220, 1500))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, p0, p1)
def opened(s, g=0.014, pan=0.0):
    """an envelope opened: its flap lifted with a dry little tear, and the sheet drawn out"""
    x = tt(0.22); imp = np.zeros(len(x), np.float32); k = R1.choice(len(x), 40, replace=False); imp[k] = R1.uniform(0.3, 1.0, 40)
    X(norm(filt(imp, 'band', (700, 2200))) * np.sin(np.pi * x / 0.22) ** 1.5, s, g * FX, pan)
    paper(s + 0.18, g * 0.8, pan, 0.4)
def tray(s, g=0.02, pan=0.0):
    """a card dropped into a wooden tray: a light slap and a soft knock under it"""
    x = tt(0.12); X(norm(filt(noise(0.12), 'band', (250, 1400))[:len(x)] * np.exp(-x / 0.02)), s, g * 0.6 * FX, pan)
    s_knock(s + 0.006, g * 0.8 * FX, pan, 210)
def keyring(s, g=0.012, pan=0.0):
    """a small key on a ring: two soft clinks, metal kept low"""
    for d, gg, fs in ((0.0, 1.0, (1180, 1630, 2050)), (0.055, 0.7, (1270, 1710, 2180))):
        x = tt(0.3); c = sum(np.sin(2 * np.pi * f * x) * np.exp(-x * (18 + 0.01 * f)) for f in fs) * np.minimum(1, x / 0.002)
        X(norm(filt(c.astype(np.float32), 'low', 2300)), s + d, g * gg * FX, pan)
def drawer(s, g=0.016, pan=0.0, sec=0.5, shut=True):
    """a wooden drawer slid along its runners, and, shut, a soft knock as it closes"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
    if shut:
        s_knock(s + sec * 0.92, g * 0.8 * FX, pan, 180)

# =============================================================================================================================
# 1. Asking around: the opening, under the dulcimer all through. Today in the Faculty of Health, the home chord, the line rising as Anil
#    plans the places; the certificate, on the fourth, its units laid down and its placement on the line's ninth, and the calendar's
#    pages; how many to offer, on the fifth, the learners and the two a unit from finishing. In September, the sixth, softer, the line
#    falling: nobody to ask. He asks around: the fifth, and the request's call three times as the emails go out, unanswered; the copy
#    comes back, the same call a tone low. It counted one, on the fourth; the census report two, the line left on the ninth, outside the
#    chord; one place offered, the sixth, the line falling as the learner steps back. The copy in his inbox: a hollow fifth; "nobody's
#    yes", the call with no answer; "no end date", a trumpet note held with no date, until "Something had to change" stops everything.
#    Now: the home chord, a note at a time, and the shop window's figure as the products come; you find one, the fourth, and ask its
#    owner, on the fifth, the call. This morning: home; the search, keys, the product, and he asks, the call; Clara's yes, the trumpets'
#    third and the home chord, the stamp of approval; the key until January, a trumpet note held to the end of the shot. Her table
#    agrees: home, the line to the third; a second place, the fourth and home; the old copy deleted; and the title, on the mark
aw = lambda lid, word, off=0: W('asking', lid, word, off)
ac = lambda lid, off=0: G('asking', lid, off)
card, cert, ce, ahead = ac('today', 0.6), ac('cert', -0.3), ac('cert'), aw('cert', 'arranged months ahead')
count, ct, unit = ac('count', -0.3), ac('count'), aw('count', 'a unit from finishing')
sept, nob, whom = ac('sept', -0.3), aw('sept', 'nobody owned'), aw('sept', 'whom to ask')
around, asked0, col = ac('around', -0.3), ac('around'), aw('around', 'a colleague')
one, cnt, cen, said2, which = ac('one', -0.3), aw('one', 'one learner'), ac('two'), aw('two', 'said two'), aw('two', 'which was right')
off, op, wait = ac('offered', -0.3), aw('offered', 'offered one place'), aw('offered', 'would have waited')
inb, lead, nyes, nend, chg = ac('inbox', -0.3), aw('inbox', 'lead back'), aw('inbox', "nobody's yes"), aw('inbox', 'no end date'), ac('change')
now, dp, own = ac('now', -0.3), aw('now', 'data products'), aw('now', 'its owner')
find, asko = ac('find'), aw('find', 'ask its owner')
mor, found, asked = ac('morning', -0.3), aw('morning', 'found'), aw('morning', 'and asked')
yes0, sy, jan = ac('yes', -0.3), aw('yes', 'said yes'), aw('yes', 'until the end of January')
agr, ag, two = ac('agrees', -0.3), aw('agrees', 'agrees'), aw('agrees', 'two')
sec, sp, nw = ac('second', -0.3), aw('second', 'a second place'), aw('second', 'no one waits')
del0, dl = ac('deleted', -0.3), aw('deleted', 'deleted')
board, title = ac('breath', -0.3), ac('breath', 1.2)
# today: the home chord, slowly, and the line rising as Anil plans the places
roll(I, 0.3, cert, 0.7, step=0.3, top=False)
line([(1.1, 64), (card, 69), (aw('today', 'plans'), 73), (aw('today', 'places'), 76)], 0.6)
# the certificate: the fourth; its units laid down one by one, the placement on the line's ninth; the calendar's pages turn to next
# semester, the line on the seventh and home to the chord
roll(IV, cert + 0.05, count, 0.65, top=False)
line([(ce + 0.1, 74), (ce + 2.14, 76), (ahead + 0.2, 73), (ahead + 2.3, 69)], 0.55)
for i in range(4):
    knock(ce + 0.7 + 0.48 * i, 0.010, px(260 + 300 * i), 250)
for k in range(4):
    paper(ahead + 0.2 + 0.577 * k, 0.008, px(1600), 0.3)
pencil(ahead + 2.31, 0.008, px(1600), 0.7)
# how many to offer: the fifth; the learners, each as they come; the two a unit from finishing, lit, and the note in pencil
roll(V, count + 0.05, sept, 0.6, top=False)
line([(ct + 0.3, 71), (ct + 1.6, 68), (unit, 76)], 0.55)
for i in range(7):
    tap(ct + 0.2057 * i + 0.1, 0.005, px(300 + 220 * i))
pencil(unit + 0.1, 0.009, px(960), 1.0)
# in September: the sixth, softer, in Noor's grey of memory; the line falls; "whom to ask?" in pencil
roll(vi, sept + 0.05, around, 0.5, step=0.2, top=False)
line([(nob, 73), (whom, 69), (whom + 1.2, 66)], 0.45)
pencil(whom, 0.009, px(1250), 0.9)
# he asks around: the fifth, softer, and the call three times as the emails go out across the campus, unanswered; the copy comes back,
# and the same call, a tone low, as it lands
roll(V, around + 0.05, one, 0.45, step=0.2, top=False)
for k in range(3):
    whoosh(asked0 + 0.6 * k, 0.6, 0.010, px(330), px([1180, 1440, 1700][k]))
    ask(asked0 + 0.6 * k + 0.05, 0.55 if k == 0 else 0.45)
whoosh(col, 1.8, 0.010, px(1440), px(330))
returned(col + 1.62, 0.6)
# the copy counted one: the fourth; its count ringed in pencil. The census report said two: the line on the ninth, outside the chord,
# struck again, softer, as the question mark is drawn, and left there
roll(IV, one + 0.05, off, 0.5, step=0.2, top=False)
line([(one + 0.3, 66), (cnt, 69)], 0.45)
pencil(cnt, 0.009, px(960), 0.7)
paper(cen, 0.012, px(1500), 0.45)
line([(said2, 76), (which, 76)], 0.45)
pencil(which, 0.010, px(1130), 0.9)
# one place offered: the sixth; the place card pinned; the learner a unit from finishing steps back, a semester later, the line falling
roll(vi, off + 0.05, inb, 0.5, step=0.2, top=False)
line([(op, 73), (wait, 69), (wait + 1.0, 66)], 0.45)
pin(op + 0.1, 0.012, px(810))
air(wait, 1.4, 0.008, px(1300)); pencil(wait + 0.4, 0.008, px(1520), 0.8)
# the copy in his inbox, opened: a hollow fifth; the codes can lead back to a name, the line drawn down to it, and the fifth again;
# nobody's yes: the call, and no answer; no end date: a trumpet note held, with no date, until "Something had to change" stops it all
dulc(45, inb + 0.1, 0.5, ring=2.6); dulc(52, inb + 0.3, 0.45, ring=2.4)
opened(inb + 0.3, 0.012, px(960))
pencil(lead, 0.009, px(315), 0.6); dulc(45, lead + 0.1, 0.4, ring=2.4); dulc(52, lead + 0.3, 0.35, ring=2.2)
ask(nyes, 0.5)
pencil(nyes + 0.35, 0.009, px(700), 0.8); pencil(nend + 0.35, 0.009, px(1300), 0.8)
held(nend + 0.1, chg + 0.1, 0.85, rel=0.08)
# now: the home chord, a note at a time; the shop window's figure, a note for each product as it comes; their owners, in gold
roll(I, now + 0.1, find, 0.55, step=0.3, top=False)
window(dp + 0.35, 0.25, 0.6)
marker(own, 0.007, px(960), 0.7)
# you find what you need, the fourth, and the tile lifts; you ask its owner, on the fifth, the call, as the request comes up
roll(IV, find - 0.1, asko - 0.1, 0.5, step=0.2, top=False)
air(find, 0.8, 0.007, px(960))
roll(V, asko - 0.1, mor, 0.5, step=0.2, top=False)
ask(asko + 0.3, 0.65)
paper(asko + 0.2, 0.008, px(1650), 0.4)
# this morning: home; near award typed into the catalogue's search; the product comes up and lifts; he asks: the fifth, and the call
roll(I, mor + 0.1, asked - 0.1, 0.55, step=0.2, top=False)
keys(mor + 0.5, 10, 0.007, px(830), 0.12)
tap(found + 0.1, 0.006, px(830)); dulc(76, found + 0.2, 0.45, ring=1.4); air(found + 0.5, 0.6, 0.006, px(830))
tap(asked + 0.3, 0.008, px(700))
roll(V, asked - 0.1, sy + 0.2, 0.5, step=0.2, top=False)
ask(asked + 0.35, 0.65)
# Clara says yes: the trumpets' soft third, the home chord under it, and the request stamped approved; the key until January rises:
# a trumpet note held, which ends, without a fall, as the shot ends
yes(sy + 0.3, 1.0)
roll(I, sy + 0.25, jan + 0.6, 0.55, step=0.15)
stamp(sy + 0.4, 0.012, px(1100))
keyring(jan + 0.15, 0.010, px(1300))
held(jan + 0.05, agr - 0.1, 0.8)
# her table agrees with the census report: home, the line to the third; the tick, and the count, two, ringed
roll(I, agr + 0.05, sec, 0.5, step=0.2, top=False)
line([(ag, 73), (two, 76)], 0.5)
pencil(ag, 0.008, px(960), 0.6); pencil(ag + 0.3, 0.009, px(1130), 0.8)
# a second place: the fourth, its card pinned; no one waits a semester: home, the line rising as the learner steps forward
roll(IV, sec + 0.05, nw - 0.1, 0.5, step=0.2, top=False)
pin(sp + 0.1, 0.012, px(1110)); dulc(69, sp + 0.1, 0.45, ring=1.4)
roll(I, nw - 0.1, board, 0.5, step=0.2, top=False)
line([(nw + 0.1, 73), (nw + 1.0, 76)], 0.5)
air(nw, 1.4, 0.008, px(1300))
# the old copy deleted: the attachment lifts away, and the label
air(dl, 1.0, 0.008, px(960)); paper(dl + 0.2, 0.008, px(960), 0.5); tap(dl + 0.35, 0.006, px(780))
# the board: the sixth card lights and lifts, and becomes the title, on the mark
knock(board + 0.35, 0.014, px(1640), 280); air(board + 1.0, 0.9, 0.008, px(1640))
roll(I, board + 0.4, title + 0.3, 0.4, step=0.2, top=False)
mark(title + 0.3)

# 2. A shop window: the sixth at the turn, a new place; Sam's screen fills, each product's tile a small key's tap; on the big screen, the
#    marketplace, the shop window's figure, every tile a note; their domains and owners marked; a price tag hung and crossed out, a
#    pencil; near award typed; the idea's card pinned on Noor's map; the semantic link drawn, and as Clara's product lifts, home to the end
ww = lambda lid, word, off=0: W('window', lid, word, off)
wc = lambda lid, off=0: G('window', lid, off)
w0 = S0('window')
roll(iii, w0 + 0.2, w0 + 2.8, 0.5, step=0.2)
on_ = ww('ontos', 'Ontos')
for i in range(6):
    tap(on_ + 0.267 * i + 0.1, 0.005, px(300 + 150 * (i % 3)))
mk = ww('shows', 'every product')
window(mk + 0.15, 0.25, 0.55)
marker(ww('shows', 'its domain'), 0.006, px(960), 0.6); marker(ww('shows', 'its owner'), 0.006, px(960), 0.6)
sold = wc('sold')
tap(sold + 0.3, 0.005, px(1180)); strike(ww('sold', 'nothing is sold'), 0.009, px(1180), 0.6)
ty = wc('types')
keys(ty + 0.3, 10, 0.007, px(1300), 0.1)
idea = ww('types', 'an idea')
pin(idea + 0.1, 0.012, px(960))
fd, lk, lna = wc('finds', -0.3), ww('finds', 'linked to it'), ww('finds', 'Learners near an award')
tap(fd + 0.35, 0.006, px(1200)); pencil(lk, 0.008, px(1300), 1.0)
roll(I, lna - 0.2, E('window') + 0.3, 0.45, step=0.2, top=False)
line([(lna, 73), (lna + 1.2, 76)], 0.45)
air(lna, 0.8, 0.006, px(1510))

# 3. Read before you ask: the fourth at the turn; the product's page, "from the project", a sheet laid down; each part of its promise
#    lit as it's named; the contract's tab; the two columns that can lead back to a learner, marked; a purpose and an end date, on a card
#    in pencil, on the sixth, held through the pause
rw = lambda lid, word, off=0: W('read', lid, word, off)
rc = lambda lid, off=0: G('read', lid, off)
r0 = S0('read')
roll(IV, r0 + 0.2, r0 + 2.8, 0.5, step=0.2)
fr = rw('before', 'from the files')
paper(fr, 0.010, px(960), 0.45); tap(fr + 0.5, 0.006, px(1500))
for t_ in (rc('for'), rc('counts'), rc('ready'), rw('ready', 'where to ask')):
    marker(t_, 0.006, px(900), 0.6)
tap(rc('contract', -0.2), 0.007, px(560))
tw_ = rc('two')
marker(tw_, 0.007, px(500), 0.6); marker(tw_ + 0.4, 0.007, px(500), 0.6)
pp = rw('purpose', 'a purpose')
pencil(pp, 0.008, px(1400), 0.8)
roll(vi, pp - 0.2, E('read') + 0.3, 0.45, step=0.2, top=False)
line([(pp, 73), (pp + 1.4, 69)], 0.4)

# 4. Ask, with a purpose: home at the turn; he presses Request access, the form comes up; why, and for how long, marked; his reason
#    typed; ninety days; Submit, and the request, the call, on the fifth. On the platform, its own button, in preview; the redirect,
#    a breath across; every request comes to one place: the tray set down, his card into it, and home, held through the pause
kw = lambda lid, word, off=0: W('ask', lid, word, off)
kc = lambda lid, off=0: G('ask', lid, off)
a0 = S0('ask')
roll(I, a0 + 0.2, a0 + 2.8, 0.5, step=0.2)
as_ = kc('asks')
tap(as_ + 0.7, 0.008, px(1500)); air(as_ + 1.1, 0.6, 0.007, px(960))
marker(kw('form', 'why'), 0.006, px(800), 0.5); marker(kw('form', 'for how long'), 0.006, px(800), 0.5)
keys(kw('writes', 'to plan'), 24, 0.006, px(900), 0.14)
nd = kw('ninety', 'ninety days')
tap(nd + 0.2, 0.007, px(810))
tap(nd + 1.3, 0.008, px(1420))
roll(V, nd + 1.1, nd + 3.6, 0.45, step=0.2, top=False)
ask(nd + 1.35, 0.65)
pl = kc('platform', -0.3)
air(pl + 0.4, 0.6, 0.006, px(470))
tap(kw('platform', 'its request button', 0.4), 0.007, px(260)); marker(kw('platform', 'in preview'), 0.006, px(460), 0.5)
whoosh(kw('platform', 'brought him here'), 1.2, 0.008, px(560), px(1050))
o1 = kc('one')
knock(o1 + 0.5, 0.012, px(1450), 220)
tray(o1 + 1.55, 0.016, px(1450))
roll(I, o1 + 1.45, E('ask') + 0.3, 0.45, step=0.2, top=False)
line([(o1 + 1.6, 76)], 0.45, ring=2.0)

# 5. The owner decides: the fourth at the turn; who builds the table and who owns it, each tag set; the request passes the first, an
#    email's whoosh, and comes to the second; what governance promises, a sheet laid down, the service marked; she answers by the
#    afternoon, his reason marked. Her page: his reason beside the product's purpose; ninety days typed; Approve: the trumpets' third,
#    the home chord, the stamp; the key until the 31st of January, a trumpet note held, ending without a fall; fewer days, or no, with a
#    reason, a pencil line; the request is the record, its rows marked one by one, and home to the end
ow = lambda lid, word, off=0: W('owner', lid, word, off)
oc = lambda lid, off=0: G('owner', lid, off)
o0 = S0('owner')
roll(IV, o0 + 0.2, o0 + 2.8, 0.5, step=0.2)
cl_ = oc('clara')
tap(cl_ + 0.25, 0.006, px(360)); tap(cl_ + 0.6, 0.006, px(1480))
ow_ = ow('clara', "the product's owner")
whoosh(ow_, 1.8, 0.009, px(0), px(1300))
fv = oc('five', -0.3)
paper(fv + 0.1, 0.010, px(960), 0.45); marker(ow('five', 'five working days'), 0.007, px(900), 0.6)
an = oc('afternoon')
marker(an + 0.4, 0.006, px(780), 0.6)
marker(ow('reason', 'what the product is for'), 0.007, px(560), 0.5); marker(ow('reason', 'what the product is for', 0.4), 0.007, px(1380), 0.5)
keys(ow('reason', 'so she says'), 7, 0.006, px(330), 0.11)
yz = ow('reason', 'says yes')
tap(yz + 0.5, 0.008, px(700)); stamp(yz + 0.55, 0.012, px(1600))
yes(yz + 0.6, 1.0)
roll(I, yz + 0.55, yz + 3.0, 0.5, step=0.15)
d31 = ow('reason', 'thirty-first')
keyring(d31 + 0.2, 0.010, px(1520))
held(d31 + 0.1, d31 + 2.6, 0.8)
fe = oc('fewer')
tap(fe + 0.2, 0.006, px(1100)); pencil(fe + 0.6, 0.008, px(1500), 0.8)
rc_ = oc('record', -0.3)
pin(rc_ + 0.3, 0.012, px(960))
rows = [ow('record', w_) for w_ in ('who asked', 'why', 'who said yes', 'until when')]
for t_ in rows:
    marker(t_, 0.006, px(960), 0.5)
roll(I, rows[3] - 0.1, E('owner') + 0.3, 0.45, step=0.2, top=False)
line([(rows[3] + 0.1, 76)], 0.45, ring=2.0)

# 6. A key with a date: the third at the turn; a drawer for each product's readers, the first slid open; one person by name, a card,
#    crossed out; Anil's card dropped into the readers' drawer; the sync to the platform, a breath; his key, on its ring, and a trumpet
#    note held, ending without a fall. The platform's one grant, marked, and since when, in pencil. A week before: the catalogue's notice.
#    On the date: his card lifted out and the drawer shut; the sync; and the trumpet note held as his key turns grey, ending, without a
#    fall, as it does. Clara sees every reader, marked, and home to the end
yw = lambda lid, word, off=0: W('key', lid, word, off)
yc = lambda lid, off=0: G('key', lid, off)
y0 = S0('key')
roll(iii, y0 + 0.2, y0 + 2.8, 0.5, step=0.2)
drawer(yw('group', 'a group'), 0.012, px(660), 0.5, shut=False)
nv = yw('group', 'never')
paper(nv, 0.008, px(1340), 0.35); strike(yw('group', 'one person'), 0.009, px(1478), 0.5)
pu = yw('readers', 'puts Anil')
knock(pu + 1.15, 0.010, px(540), 230); paper(pu + 1.0, 0.006, px(540), 0.3)
hd = yw('readers', 'until his date')
air(hd, 1.0, 0.007, px(1350))
keyring(hd + 0.7, 0.010, px(1290))
held(hd + 0.65, hd + 3.0, 0.8)
marker(yw('once', 'was given'), 0.007, px(700), 0.6); pencil(yw('once', 'when the product went live'), 0.008, px(1300), 0.9)
tap(yw('week', 'reminds him'), 0.008, px(830))
out = yw('date', 'takes him out')
paper(out, 0.008, px(540), 0.4); drawer(out + 1.0, 0.012, px(660), 0.45)
air(out + 0.8, 0.8, 0.007, px(1350))
ends = yw('date', 'his access ends')
held(out - 0.1, ends + 0.85, 0.8)
er = yw('every', 'every reader')
marker(er, 0.007, px(780), 0.6)
roll(I, er - 0.2, E('key') + 0.3, 0.45, step=0.2, top=False)
line([(er, 73)], 0.4, ring=2.0)

# 7. A known reader: the fourth at the turn; the faculty's plan, a new file laid down and typed in, its owner and its table marked, a
#    note in pencil; the next change: the impact check's report comes up, the faculty's plan marked beside the census dashboard, and who
#    to ask; both are asked: two letters across the campus, an email's whoosh each, and as each lands, a note, the line rising, home
#    held through the end and into the next chapter's campus
dw = lambda lid, word, off=0: W('reader', lid, word, off)
dc = lambda lid, off=0: G('reader', lid, off)
d0 = S0('reader')
roll(IV, d0 + 0.2, d0 + 2.8, 0.5, step=0.2)
paper(d0 + 0.3, 0.010, px(860), 0.45)
ad = dc('adds')
keys(ad + 0.2, 20, 0.006, px(700), 0.18)
marker(ad + 3.2, 0.006, px(700), 0.5); marker(max(dw('adds', 'who uses what'), ad + 4.0), 0.006, px(800), 0.5)
pencil(dw('adds', 'in the project'), 0.008, px(1400), 0.9)
nx = dc('next', -0.3)
tap(nx + 0.2, 0.007, px(960))
marker(dw('next', 'names the Faculty'), 0.007, px(800), 0.6); marker(dw('next', 'census dashboard', 0.4), 0.007, px(600), 0.6)
bt = dc('both')
whoosh(bt, 1.375, 0.009, px(1460), px(1300)); whoosh(bt + 0.55, 1.375, 0.009, px(1460), px(330))
roll(I, bt + 1.2, E('reader') + 0.6, 0.45, step=0.2, top=False)
line([(bt + 1.375, 73), (bt + 1.925, 76)], 0.5, ring=2.0)
knock(bt + 1.4, 0.008, px(1300), 260); knock(bt + 1.95, 0.008, px(330), 260)

# 8. Outside the university: the sixth at the turn, softly, far off; a thread to the partner, a breath. Its request on Mei's screen:
#    the call, on the fifth. Awards' contract, each part marked, and no one's personal data, in pencil. Mei says yes: the stamp, and the
#    trumpets' answer an octave lower, heard from further away, over the home chord. Sam's share, its recipient set down; the partner
#    reads the table itself, a thread drawn; a copy by email, struck out; a key that ends on a date, on its ring, a trumpet note held;
#    the same contract laid down. A private exchange: its one product, a note; its sign; two partners, and home to the end
xw = lambda lid, word, off=0: W('outside', lid, word, off)
xc = lambda lid, off=0: G('outside', lid, off)
x0 = S0('outside')
roll(vi, x0 + 0.2, x0 + 2.8, 0.4, step=0.25)
air(xc('same', 0.4), 1.4, 0.006, px(680))
pt = xc('partner', -0.3)
roll(V, pt + 0.4, pt + 3.0, 0.45, step=0.2, top=False)
ask(pt + 0.6, 0.6)
for w_ in ('each award', 'its credit points', 'its faculty'):
    marker(xw('holds', w_), 0.006, px(500), 0.5)
pencil(xw('holds', "no one's personal data", 0.2), 0.008, px(1400), 0.9)
my = xw('share', 'says yes')
tap(my + 0.1, 0.007, px(1250)); stamp(my + 0.4, 0.010, px(1300))
yes(my + 0.3, 0.95, low=True)
roll(I, my + 0.25, my + 2.6, 0.45, step=0.2, top=False)
org = xw('share', 'another organisation')
paper(org + 0.1, 0.008, px(700), 0.4)
air(xw('share', 'on any platform'), 0.6, 0.006, px(1460))
pencil(xw('reads', 'the table itself'), 0.007, px(960), 0.6)
nc = xw('reads', 'not a copy')
whoosh(nc, 0.6, 0.008, px(460), px(960)); strike(nc + 0.6, 0.009, px(960), 0.5)
ky = xw('reads', 'a key')
keyring(ky + 0.15, 0.010, px(1180))
held(ky + 0.1, ky + 2.4, 0.75)
paper(xw('reads', 'the same contract'), 0.010, px(1430), 0.45)
fi = xw('exchange', 'find it')
dulc(69, fi + 0.15, 0.5, ring=1.6)
tap(xw('exchange', 'a private exchange'), 0.006, px(960))
only = xw('exchange', 'only they see')
knock(only + 0.2, 0.008, px(350), 260); knock(only + 0.55, 0.008, px(1570), 260)
roll(I, only - 0.2, E('outside') + 0.3, 0.45, step=0.2, top=False)
line([(only + 0.2, 73), (only + 1.0, 76)], 0.45, ring=2.0)

# 9. Part of governance: home at the turn, this morning; he asked, the call, and she answered, the trumpets' third. A place for each
#    learner. The old copy gone; the key until the 31st of January, lit: a trumpet note held, ending, without a fall, as his access ends
#    by itself. Clara knows who reads her table, marked. Finding and getting data: the shop window's figure. The board, each card lit in
#    turn; and the end card: both play the mark, whole, once, for the series
zw = lambda lid, word, off=0: W('close', lid, word, off)
zc = lambda lid, off=0: G('close', lid, off)
z0 = S0('close')
roll(I, z0 + 0.2, zw('morning', 'answered', 1.6), 0.5, step=0.25, top=False)
ask(zw('morning', 'asked'), 0.6)
yes(zw('morning', 'answered', 0.2), 0.9)
zd = zw('gone', 'thirty-first')
held(zd + 0.1, zw('gone', 'ends by itself', 0.9), 0.8)
marker(zw('seen', 'who reads'), 0.006, px(780), 0.6)
ls = zc('last', -0.3)
roll(I, ls + 0.1, ls + 3.4, 0.45, step=0.2, top=False)
window(ls + 0.3, 0.22, 0.5)
bd, end = zc('breath', -0.3), zc('breath', 1.6)
for i in range(6):
    pin(bd + 0.35 + 0.3 * i, 0.007, px([505, 960, 1415][i % 3]))
whole(end + 0.4)
soften(2600)
