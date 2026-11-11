# Files as data and as context: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, reserved for this film in the module's palettes (5 November 2026) and checked against every
# score.py and music.py on main and on every branch: the tones of an optophone, and tuned paper tubes. Both are made here; music.py has
# neither.
#  - The optophone (opto(), letters(), held()): the reading machine of 1913 that scanned a line of print and turned each letter into
#    its own chord, so blind readers could read print by ear: a page read by a machine into something else. Its tones are fixed, a row
#    of six, each a light chopped by a turning disc, so each is plain and a little rough: rounder than a square, with its odd partials,
#    a grain of the disc where it starts and stops, and no vibrato. The film's row is A 3, C sharp 4, E 4, F sharp 4, A 4 and C sharp 5,
#    the notes of A major and of F sharp minor, the film's two keys, so every chord it plays is one of them. Read letter by letter it
#    reads (the logs read into tables, an invoice read by the function, a contract found and cited, the old logs read again); held,
#    its tones are what was read, as one.
#  - Tuned paper tubes (tube()): the cardboard tubes that charts and plans are rolled in, cut to length and struck softly on their open
#    ends with a felt paddle. For a moment the paddle closes the end, and the air inside sounds its note, with the odd partials of a
#    stopped pipe, and dies away at once: short, dry and hollow, with a papery touch at the start and no ring. The document itself, the
#    file that's kept: the logbooks on their shelves, the files landing in the volume, the contract filed, the logs kept.
#  - The film's mark (mark()): a short line read letter by letter into chords, then the same tones as one held chord. Over the title
#    card, its letters as the function reads an invoice and its held chord as the fields become a row, and over the end card.
#  - Keys: F sharp minor for the problem, A major for the answer, tuned pure (just intonation from A, hz()): every note the film plays
#    is a whole-number ratio of A, so nothing beats.
# The rules the module keeps (its briefs and palettes, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only at a chapter's turn, under a moment on screen, or in a pause without words; never a
#    bed under the voice. After the opening: the three answers at the invoices' turn; F sharp minor for the invoice paid twice; a tube
#    for each file landing in the volume; the mark's letters as the function reads and its chord as the fields become a row; A major
#    as the checks pass and as a person approves; the contract signed, filed and cited; the claims written as data, the 1853 log again;
#    the logs kept and read again, Noor's three answers, the wheel, the four steps, the end card.
#  - Nothing pulses, loops or trembles; no figure is played again soon. Each reading is its own line of letters, so the same tones in
#    the same order come back only with the mark and the three answers.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as src/scenes.js. Where the
#    picture repeats (rows, ticks, names), the first few sound, then softer.
#  - No sea shanty or ship's bell for the logbooks, nothing of the 1840s Navy: the sea is a breath of air, and the logs are paper.
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
R1 = np.random.default_rng(1913)  # this film's own randomness: the rooms and the disc's grain

# ---- tuning: just intonation from A, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
KEY = (57, 220.0)  # A 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the optophone's row, from the lowest: A 3, C sharp 4, E 4, F sharp 4, A 4, C sharp 5
A3, CS4, E4, FS4, A4, CS5 = 57, 61, 64, 66, 69, 73
AMAJ = (A3, CS4, E4, A4)            # A major
AMAJ_HI = (CS4, E4, A4, CS5)        # A major, its upper voicing
FSM = (FS4, A4, CS5)                # F sharp minor
FSM_LO = (A3, CS4, FS4)             # F sharp minor over its third, low in the row
A6 = (A3, CS4, E4, FS4, A4, CS5)    # every tone of the row at once: what the mark's letters read, held as one
# the mark's line, letter by letter: each letter the tones its shape covers on the row
MARK_L = ((A3, E4), (CS4, FS4), (E4, A4), (A3, CS4, CS5), (FS4, A4), (CS4, E4, CS5))
# the tubes, by length: the longest about 78 cm (A 2), the shortest about 31 cm (C sharp 4)
FS2, A2, CS3, D3, E3, FS3 = 42, 45, 49, 50, 52, 54

# ---- the levels: OL an optophone tone, TL a tube, FX the effects. tools/quiet.py measures them against the governance films' sound
OL, TL, FX = 0.019, 0.075, 1.75

def _ir(sec, lo):
    """a room's ring: noise that dies away over sec, its top rolled off at lo, after 20 ms. It is scaled so that a held note's ring
    is, on average, as loud as the note itself between 80 Hz and 1.2 kHz (a ring scaled by its whole energy rings far louder than
    the note in the band it keeps, and louder on some notes than on others)"""
    x = np.arange(int(sec * SR)) / SR; ir = (R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32)
    ir = filt(ir, 'low', lo); ir[:int(0.02 * SR)] = 0
    H = np.abs(np.fft.rfft(ir)) ** 2; f = np.fft.rfftfreq(len(ir), 1 / SR)
    return ir / np.sqrt(H[(f > 80) & (f < 1200)].mean())
ROOM = _ir(1.2, 1500)   # a small, quiet room round the machine
def _room(s, wet):
    """a note in the room, then given its own level back: the room's reflections add to some pitches and take from others, so the
    note with its echo is set to the level it has without, where it's held (past its first 0.4 s, before it lets go), and held notes
    sit at even levels"""
    if not wet:
        return s
    y = np.pad(s, (0, len(ROOM) - 1)) + wet * fftconvolve(s, ROOM).astype(np.float32)
    a, b = int(0.4 * SR), len(s) - int(0.2 * SR)
    if b - a < int(0.2 * SR):
        a, b = 0, len(s)
    return (y * np.sqrt(np.mean(s[a:b] ** 2) / max(1e-12, float(np.mean(y[a:b] ** 2))))).astype(np.float32)

# ---- the optophone. One tone held from a to b: its light chopped by the disc, so a fundamental with its odd partials (and a trace of
# the second), each pure and in tune, all under 2.4 kHz. att: how fast it speaks (a letter at once, softened by a few ms so it doesn't
# click; a held chord swells in); rel: how fast it stops. Where it starts and stops, a grain of the disc's edge: a few ms of soft noise,
# once, the roughness at its edges. A tone of 2 s or more swells a little and eases, once
PARTS = ((1, 1.0), (2, 0.06), (3, 0.24), (5, 0.08), (7, 0.03))
def opto(m, a, b, g=1.0, att=0.008, rel=0.035, pan=0.0, room=0.2, grain=1.0):
    f = hz(m); sec = max(0.06, b - a); n = int((sec + rel + 0.02) * SR); x = np.arange(n) / SR
    s = sum(w * np.sin(2 * np.pi * f * h * x) for h, w in PARTS if f * h < 2400)
    s = s * np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2 * np.cos(0.5 * np.pi * np.clip((x - sec) / rel, 0, 1)) ** 2
    if sec >= 2.0:
        s = s * (0.92 + 0.08 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    if grain:
        e = np.exp(-x / 0.004) + 0.6 * np.exp(-np.maximum(0, x - sec) / 0.003) * (x >= sec)
        s = s + grain * 0.05 * filt(R1.standard_normal(n).astype(np.float32), 'band', (600, 1600)) * e
    put(_room(s.astype(np.float32), room), a, g * OL, pan)
def held(ch, a, b, g=1.0, att=0.6, rel=0.9, pan=0.0, room=0.25):
    """a chord held: its tones together, lowest a little louder, swelling in over att and out over rel"""
    for j, m in enumerate(ch):
        opto(m, a + 0.02 * j, b, g * (1.0 - 0.07 * j), att, rel, pan, room, grain=0.4)
def letters(t0, seq, step=0.18, dur=0.14, g=1.0, pan=0.0, fall=0.0):
    """a line read letter by letter: each letter its chord, held a moment, the next as the light moves on. fall: each letter a little
    softer than the one before"""
    for i, ch in enumerate(seq):
        for m in ch:
            opto(m, t0 + i * step, t0 + i * step + dur, g * (1 - fall * i), 0.008, 0.035, pan, 0.15)
def mark(t0, end, g=1.0, pan=0.0):
    """the film's mark: its line read letter by letter, then every tone it read held as one chord until end"""
    letters(t0, MARK_L, 0.18, 0.14, g, pan)
    held(A6, t0 + len(MARK_L) * 0.18 + 0.04, end, g * 0.8, 0.35, 0.9, pan)

# ---- a paper tube, struck on its open end with a felt paddle: for a moment the paddle closes the end, and the air inside sounds its
# note with the odd partials of a stopped pipe, then dies away at once, the card soaking it up (the longer the tube, the longer it
# sounds: about 90 ms at A 2, 50 ms at C sharp 4). A papery touch where the felt meets the card. Dry: no room
def tube(m, s, g=1.0, pan=0.0):
    f = hz(m); sec = 0.4; x = tt(sec); d1 = 0.09 * (110 / f) ** 0.45
    sig = (np.sin(2 * np.pi * f * x) * np.exp(-x / d1) + 0.22 * np.sin(2 * np.pi * 3 * f * x) * np.exp(-x / (d1 * 0.55))
           + 0.07 * np.sin(2 * np.pi * 5 * f * x) * np.exp(-x / (d1 * 0.35)))
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.004)) ** 2
    touch = filt(noise(sec + 0.01)[:len(x)], 'band', (350, 1700)) * np.exp(-x / 0.006) * 0.2
    put(filt((sig + touch).astype(np.float32), 'low', 1800), s, g * TL, pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a number landing"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a row, a key, a light click"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.008, pan=0.0, step=0.28):
    """a value typing itself in: the first keys, then softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """a card or a sheet laid down"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (220, 1500))[:len(x)], 'low', 2200) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def flick(s, g=0.008, pan=0.0):
    """a tag or a line flicked in: short and light"""
    paper(s, g, pan, 0.16)
def stamp(s, g=0.012, pan=0.0):
    """a mark pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def tuck(s, g=0.008, pan=0.0):
    """a small mark set in a row: a dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def plug(s, g=0.009, pan=0.0):
    """a lane reaching what it feeds: a soft, dull click"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.008, g * 0.6 * FX, pan)
def lock(s, g=0.008, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 480); s_tap(s + 0.012, g * 0.6 * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0, lo=150, hi=900):
    """a breath of air: the sea, something sliding across, a page coming in"""
    s_air(s, sec, g * FX, pan, lo, hi)
def pen(s, sec=1.2, g=0.006, pan=0.0):
    """a pen across paper, signing: a soft, dry rasp that comes and goes as the stroke does"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * (0.6 + 0.4 * np.abs(np.sin(2.3 * np.pi * x / sec))), s, g * FX, pan)

# =============================================================================================================================
# 1. Logbooks into charts: the opening, with music. Washington, 1842: the row's A major swells in, and a tube as the shelves of logbooks
#    glow. A logbook opens: a tube for each thing it records. Thousands of days, each ship its own way: the other logs come in, and as
#    nobody reads them the row turns to F sharp minor, and stays there as captains sail the road they know and the passages run weeks
#    long; then nothing, for "The answers were already in the logs. Someone had to read them.". The office reads its logs into tables: the first line read letter by letter,
#    and A major as the table holds them, month by month; the charts, free, A major again; the log in one set form, sent back, a tube
#    as it leaves and one as it arrives. Brussels: the ten nations, and a pair of tubes as the one log lands. The count: F sharp minor
#    for 183, A major for 135; the nations share their data. Today's documents land, a tube each; what's written for people read into
#    data, a short line of letters; what we write, held from the start. The title: the mark
lw = lambda lid, word, off=0: W('logs', lid, word, off)
lc = lambda lid, off=0: G('logs', lid, off)
held(AMAJ, 0.5, lw('place', 'logbooks', 1.2), 0.9, att=1.6, rel=1.3)
flick(lw('place', 'United States Navy', -0.3), 0.006, px(500))
tube(A2, lw('place', 'logbooks', -0.05), 0.8, px(420))
paper(lw('logbook', 'daily record', -0.7), 0.012, px(960))                  # one logbook opens, close up
for i, (w_, m) in enumerate((('where it was', E3), ('the wind', FS3), ('the weather', A3), ('the current', CS4))):
    tube(m, lw('logbook', w_, -0.15), 0.75 - 0.05 * i, px(700 + 220 * i))  # each heading it keeps
flick(lw('logbook', "the sea's own flow", -0.1), 0.006, px(1250))
air(lw('unread', 'Thousands', -0.3), 0.9, 0.008, px(500), 160, 800)         # the page steps back
for i in (1, 2):
    paper(lw('unread', 'Thousands', 0.15 + 0.3 * i), 0.010 - 0.002 * i, px((700, 1290)[i - 1] + 260))
held(FSM_LO, lw('unread', 'nobody', -0.1), lw('habit', 'routes they knew', 0.9), 0.85, att=1.2, rel=1.0)
air(lc('habit', -1.05), 1.4, 0.008, px(800), 140, 700)                      # out to the sea
held(FSM, lw('habit', 'winds and currents', -0.2), END('logs', 'habit') + 0.4, 0.7, att=0.9, rel=1.0)
held(FSM_LO, lw('weeks', 'weeks longer', -0.1), END('logs', 'weeks') + 0.3, 0.8, att=1.0, rel=1.2)
for i, w_ in enumerate(('the crews', 'food and water', 'cargo')):
    flick(lw('weeks', w_, -0.25), 0.007 - 0.001 * i, px(1290))              # what the weeks cost
# the office reads its logs into tables: the pages fly into the squares, read letter by letter; the table, month by month
air(lw('read', 'read its old logs', -0.6), 1.0, 0.007, px(700), 160, 800)
paper(lw('read', 'read its old logs', -0.3), 0.010, px(300))
letters(lw('read', 'tables', -0.25), ((A3, E4), (CS4, A4), (E4, FS4), (A3, CS5), (CS4, E4), (FS4, CS5), (A3, A4)), 0.17, 0.13, 0.95, px(700))
knock(lw('read', 'each patch', -0.2), 0.010, px(1420), 260)
held(AMAJ, lw('read', 'each patch', 0.1), END('logs', 'read') + 0.6, 0.75, att=0.8, rel=1.0)
for i in range(3):
    tap(lw('read', 'month by month', 0.55 * (i + 1)), 0.007 - 0.0015 * i, px(1300))   # the months turn: June, July, August
# the charts, free, for the one log sent back
flick(lw('charts', 'drew', -0.1), 0.007, px(300))
held(AMAJ_HI, lw('charts', 'drew', 0.0), lw('charts', 'send it back', 1.6), 0.85, att=1.0, rel=1.1)
flick(lw('charts', 'free', -0.1), 0.006, px(800))
tube(A2, lw('charts', 'one set form', 0.05), 0.8, px(380))                  # the log, in one set form
air(lw('charts', 'send it back', 0.1), 1.2, 0.006, px(390), 200, 900)
tube(E3, lw('charts', 'send it back', 1.3), 0.7, px(260))                   # and back at the office
# Brussels, 1853: ten nations, Quetelet in the chair, and the one log they agreed
held(AMAJ, lc('brussels', -0.3), lw('brussels', 'ten nations', 0.6), 0.7, att=1.2, rel=1.0)
flick(lw('brussels', 'Adolphe Quetelet', -0.2), 0.006, px(730))
paper(lw('brussels', 'ten nations', -0.3), 0.011, px(1460))
for i in range(3):
    tap(lw('brussels', 'ten nations', -0.1 + 0.16 * i), 0.007 - 0.002 * i, px(1300))   # the first names, then softer
paper(lw('brussels', 'agreed one log', -0.3), 0.010, px(1440))
tube(A2, lw('brussels', 'agreed one log', -0.25), 0.85, px(1440))
tube(E3, lw('brussels', 'agreed one log', -0.12), 0.65, px(1440))
held(AMAJ_HI, lw('brussels', 'agreed one log', 0.1), END('logs', 'brussels') + 0.5, 0.8, att=0.9, rel=1.0)
# the count: two roads to California, F sharp minor for 183 days, A major for 135
paper(lw('saved', 'own count', -0.3), 0.010, px(1500))
held(FSM, lw('saved', 'own count', 0.1), lw('saved', 'a hundred and thirty-five', -0.2), 0.7, att=1.0, rel=0.5)
knock(lw('saved', 'a hundred and eighty-three', -0.1), 0.010, px(1260), 180)
tube(FS2, lw('saved', 'a hundred and eighty-three', -0.05), 0.85, px(1260))
knock(lw('saved', 'a hundred and thirty-five', -0.1), 0.011, px(1460), 260)
tube(A2, lw('saved', 'a hundred and thirty-five', -0.05), 0.9, px(1460))
held(AMAJ, lw('saved', 'a hundred and thirty-five', 0.0), END('logs', 'saved') + 1.0, 0.85, att=0.5, rel=1.2)
# the nations begin to share their data: the lanes between the ports, and A major again, higher
air(lw('shared', 'share their weather data', 0.0), 1.5, 0.007, px(760), 160, 800)
held(AMAJ_HI, lw('shared', 'share their weather data', 0.1), END('logs', 'shared') + 0.6, 0.65, att=1.0, rel=1.0)
flick(lw('shared', 'still do today', -0.2), 0.006, px(1500))
# today: three documents, a tube each as it lands; read into data, a short line; what we write, held from the start
for i, m in enumerate((CS3, E3, A3)):
    tube(m, lw('same', 'Documents today', -0.35 + 0.35 * i), 0.75, px((420, 960, 1510)[i]))
letters(lw('answer', 'read into data', -0.05), ((CS4, A4), (A3, E4), (FS4, CS5), (E4, A4)), 0.16, 0.12, 0.7, px(420))
knock(lw('answer', 'read into data', 0.05), 0.009, px(420), 280)
knock(lw('answer', 'what we write', 0.05), 0.009, px(1510), 280)
held((E4, A4, CS5), lw('answer', 'what we write', 0.1), END('logs', 'answer') + 0.2, 0.6, att=0.4, rel=1.0)
# the title card: the mark
tT = lc('breath', 0.3)
mark(tT, lc('breath', 3.6))

# 2. Invoices, read into data. Today's three answers spring in, a tube each. October's invoices, Rohan's team's checks, the values typed
#    by hand; September's invoice paid twice, on F sharp minor. Each file lands in the volume, a tube each. The function reads the
#    invoice: the mark's letters; the fields become a row: the mark's chord. The model, the checks, Finance's rules; A major as 3,734
#    pass; 126 to a person, each with its reason. The function reads, the checks sort, Rohan's team decides: A major as a person approves
iw = lambda lid, word, off=0: W('invoices', lid, word, off)
ic = lambda lid, off=0: G('invoices', lid, off)
for i, (w_, m, x_) in enumerate((('read them', A3, 380), ('keep them', CS4, 960), ('write them as data', E3, 1540))):
    tube(m, iw('three', w_, -0.3), 0.75, px(x_))
held(AMAJ_HI, iw('three', 'read them', -0.2), iw('three', 'write them as data', 1.6), 0.6, att=0.6, rel=1.0)
flick(ic('october', -0.6), 0.006, px(300))
knock(ic('october', -0.3), 0.010, px(316), 240)
knock(iw('october', 'three thousand', 1.3), 0.010, px(1400), 260)        # 3,860, as the count settles
for i in range(4):
    paper(iw('october', 'P D F files', -0.4 + 0.25 * i), 0.009 - 0.0013 * i, px(770 + 300 * i), 0.3)
paper(ic('check', -0.5), 0.011, px(870))                                   # the invoice, close
for i, w_ in enumerate(('who sent it', 'its number', 'its date', 'its total', 'each line')):
    tuck(iw('check', w_, -0.1), 0.008 - 0.0009 * i, px(1100))
flick(iw('typed', 'typed them in by hand', -0.2), 0.007, px(1300))
keys(iw('typed', 'typed them in by hand', -0.1), 5, 0.007, px(1500), 0.21)
for i in range(2):
    paper(iw('typed', 'sent twice', -0.4 + 0.4 * i), 0.010 - 0.002 * i, px(1335 + 330 * i), 0.3)
    stamp(iw('typed', 'paid twice', -0.2 + 0.25 * i), 0.011 - 0.002 * i, px(1335 + 330 * i))
knock(iw('typed', 'paid twice', 0.05), 0.010, px(1640), 150)
held(FSM_LO, iw('typed', 'paid twice', 0.0), END('invoices', 'typed') + 1.0, 0.75, att=0.4, rel=1.0)
# the volume: each file lands, a tube each; a place for files, governed as tables are
air(ic('volume', -0.6), 0.8, 0.007, px(590), 180, 900)
for i, m in enumerate((A2, CS3, E3, A3)):
    tube(m, iw('volume', 'lands in a volume', -0.15 + 0.35 * i), 0.8 - 0.06 * i, px(330))
paper(iw('volume', 'a place for files', -0.3), 0.010, px(1470))
lock(iw('volume', 'governed in Unity Catalog', -0.25), 0.008, px(1470))
# the function reads the invoice: the mark's letters, as its parts are found; then the fields leave the page and become a row
paper(ic('parse', -0.5), 0.010, px(310))
knock(iw('parse', 'A I parse document', -0.3), 0.010, px(900), 280)
letters(iw('parse', 'reads each file', 0.0), MARK_L, 0.18, 0.14, 0.9, px(310))
for i, w_ in enumerate(('its words', 'its tables', 'where each sits')):
    flick(iw('parse', w_, -0.1), 0.006 - 0.001 * i, px(560))
knock(iw('extract', 'A I extract', -0.3), 0.010, px(1530), 280)
air(iw('extract', 'the fields Finance names', 0.0), 0.9, 0.006, px(900), 220, 1000)
paper(iw('extract', 'the fields Finance names', -0.2), 0.009, px(1220))
held(A6, iw('extract', 'the fields Finance names', 0.7), iw('extract', 'one row for each invoice', 2.2), 0.7, att=0.35, rel=1.0, pan=px(1220))
tap(iw('path', 'the path of its file', -0.3), 0.008, px(1220))
flick(iw('path', 'open the invoice', 0.4), 0.006, px(560))
# the reading is a model's: checked like any other data. Jun's tests, Finance's rules
air(ic('model', -0.3), 0.8, 0.007, px(310), 200, 900)
tuck(iw('model', 'checked like any other data', -0.2), 0.008, px(310))
paper(iw('model', 'Promises and proofs', -0.3), 0.009, px(310))
paper(iw('checks', "Jun Park's", -0.2), 0.010, px(910))
for i, w_ in enumerate(('every field read', 'add up to the total')):
    tuck(iw('checks', w_, -0.1), 0.008 - 0.001 * i, px(680))
paper(iw('rules', "Finance's own rules", -0.2), 0.010, px(1530))
for i, w_ in enumerate(('sent before', 'know the supplier')):
    tap(iw('rules', w_, -0.1), 0.008 - 0.001 * i, px(1300))
# 3,734 pass: the bar fills, A major; 126 to a person, each with its reason, and the nine sent twice
knock(iw('passed', 'seven hundred and thirty-four', -0.2), 0.010, px(700), 260)
held(AMAJ, iw('passed', 'seven hundred and thirty-four', -0.3), END('invoices', 'passed') + 0.4, 0.7, att=1.0, rel=1.0)
knock(iw('person', 'went to a person', -0.2), 0.010, px(1400), 200)
paper(iw('person', 'each with its reason', -0.2), 0.010, px(1230))
for i in range(4):
    tap(iw('person', 'each with its reason', 0.2 * i), 0.007 - 0.0012 * i, px(1100))
tuck(iw('person', 'Nine', -0.2), 0.008, px(1100))
# the function reads, the checks sort, Rohan's team decides: and every payment approved by a person
for i, w_ in enumerate(('The function reads', 'the checks sort', "Rohan's team decides")):
    paper(iw('decides', w_, -0.2), 0.010 - 0.001 * i, px(825 + 410 * i), 0.35)
stamp(iw('decides', 'approves every payment', -0.15), 0.010, px(1230))
held(AMAJ_HI, iw('decides', "Rohan's team decides", -0.1), END('invoices', 'decides') + 0.8, 0.65, att=0.8, rel=1.2)

# 3. Contracts, kept as signed. The contract signed, a tube as it's kept, A major. Its terms as a table, struck out; its metadata, row by
#    row, written by the HR system. Linh's two files; the week added; filed, a tube each, and their metadata. Linh asks: a person or an
#    agent reads the folder, a short line of letters, and cites the signed file, A major held. The films on context; Ingrid's lock
cw = lambda lid, word, off=0: W('contracts', lid, word, off)
cc = lambda lid, off=0: G('contracts', lid, off)
paper(cc('official', -0.6), 0.011, px(960))
pen(cw('official', 'official document', -0.1), 1.3, 0.005, px(1060))
tube(D3, cw('official', 'kept just as it was signed', -0.25), 0.8, px(960))
held(AMAJ_HI, cw('official', 'kept just as it was signed', -0.1), END('contracts', 'official') + 1.0, 0.6, att=0.6, rel=1.0)
flick(cw('official', 'kept just as it was signed', -0.2), 0.006, px(960))
air(cc('beside', -1.1), 1.0, 0.006, px(600), 200, 900)
flick(cw('beside', 'rewrites', -0.3), 0.006, px(920))
knock(cw('beside', 'as a table', -0.05), 0.010, px(920), 150)               # struck out
paper(cw('beside', 'its metadata', -0.3), 0.010, px(1130))
for i, w_ in enumerate(("the contract's ID", 'its version', 'the day it was signed', 'where its file is')):
    tap(cw('beside', w_, -0.2), 0.008 - 0.0012 * i, px(900))
knock(cw('writes', 'The HR system', -0.2), 0.010, px(870), 240)
plug(cw('writes', 'writes that metadata', 0.5), 0.008, px(1000))
tuck(cw('writes', 'nobody has to read it back', -0.2), 0.008, px(1140))
air(cc('linh', -1.0), 0.8, 0.006, px(900), 200, 900)
for i in range(2):
    paper(cw('linh', 'two files', -0.3 + 0.3 * i), 0.010 - 0.002 * i, px(920 + 420 * i), 0.35)
tap(cw('week', 'thirteenth of November', -0.2), 0.007, px(920))
tuck(cw('week', 'added a week', -0.2), 0.008, px(1340))
flick(cw('week', 'for marking', -0.3), 0.006, px(1130))
paper(cw('alike', 'look alike', -0.6), 0.009, px(1400))                     # the folder
for i, m in enumerate((A2, CS3)):
    tube(m, cw('alike', 'look alike', 0.55 + 0.12 * i), 0.8, px(1060))       # each file filed
flick(cw('alike', 'By their metadata', -0.2), 0.007, px(1450))
# Linh asks; a person or an agent reads the folder, and cites the signed file
paper(cw('ends', 'Linh asks', -0.3), 0.010, px(760))
air(cw('ends', 'a person or an agent', -0.3), 0.6, 0.006, px(1134), 200, 900)
letters(cw('ends', 'finds the signed version', -0.15), ((E4, CS5), (A3, FS4), (CS4, A4), (E4, FS4, A4)), 0.17, 0.13, 0.75, px(1186))
knock(cw('ends', 'cites its file', -0.2), 0.010, px(1570), 260)
held(AMAJ, cw('ends', 'cites its file', -0.1), END('contracts', 'ends') + 0.8, 0.7, att=0.5, rel=1.0, pan=px(1570) * 0.5)
for i, w_ in enumerate(('Context engineering', 'Context and memory')):
    paper(cw('context', w_, -0.3), 0.009, px(800 + 770 * i), 0.35)
air(cw('context', "an agent's context", -0.4), 0.8, 0.006, px(1186), 200, 900)
lock(cc('who', 0.0), 0.009, px(990))
lock(cw('who', 'Data protection', -0.2), 0.006, px(990))
held(FSM, cc('who', -0.2), cw('who', 'Data protection', 1.4), 0.55, att=0.8, rel=1.0)

# 4. Written as data. The third answer, the best: A major. Before: spreadsheets by email, typed into payroll, F sharp minor. Now: the
#    claims app writes each claim as data the moment it's made, the mark's chord held, with no letters to read; its metadata row by
#    row; its contract in YAML. The log of 1853 again: the two tubes of Brussels, and A major
ww = lambda lid, word, off=0: W('written', lid, word, off)
wc = lambda lid, off=0: G('written', lid, off)
tube(E3, wc('best', -0.6), 0.75, px(1540))
held(AMAJ_HI, wc('best', -0.55), END('written', 'best') + 0.9, 0.6, att=0.5, rel=1.0)
for i in range(3):
    paper(wc('before', 0.2 + 0.3 * i), 0.010 - 0.002 * i, px(260 + 60 * i), 0.35)
held(FSM_LO, wc('before', 0.2), ww('before', 'someone typed', 0.4), 0.6, att=0.6, rel=1.0)
air(ww('before', 'by email', 0.4), 1.2, 0.006, px(730), 200, 900)
flick(ww('before', 'someone typed', 0.0), 0.006, px(960))
knock(ww('before', 'into payroll', -0.3), 0.009, px(1570), 240)
plug(ww('before', 'into payroll', 0.6), 0.007, px(1360))
knock(wc('json', -0.4), 0.010, px(340), 240)
plug(ww('json', "the moment it's made", 0.2), 0.008, px(610))
held(A6, ww('json', "the moment it's made", -0.2), ww('json', 'a row any system can read', 1.0), 0.7, att=0.3, rel=1.0, pan=px(940) * 0.5)
for i in range(3):
    plug(ww('json', 'a row any system can read', -0.3 + 0.25 * i), 0.007 - 0.001 * i, px(1340))
paper(ww('meta', 'who claimed', -0.3), 0.009, px(940))
for i, w_ in enumerate(('who claimed', 'on which contract', "whether it's approved", 'and when')):
    tap(ww('meta', w_, -0.2), 0.007 - 0.001 * i, px(900))
air(wc('yaml', -0.5), 1.0, 0.006, px(600), 200, 900)
paper(wc('yaml', 0.5), 0.010, px(1250))
for i in range(3):
    tap(ww('yaml', 'its contract', -0.2 + 0.27 * i), 0.006 - 0.001 * i, px(1100))
flick(ww('yaml', 'an open standard', -0.2), 0.006, px(1040))
flick(ww('yaml', "the app's code", -0.2), 0.006, px(1520))
paper(ww('log', 'the log of eighteen fifty-three', -0.4), 0.010, px(436))
tube(A2, ww('log', 'the log of eighteen fifty-three', -0.35), 0.85, px(436))
tube(E3, ww('log', 'the log of eighteen fifty-three', -0.22), 0.65, px(436))
held(AMAJ, ww('log', 'one form', -0.1), END('written', 'log') + 0.8, 0.7, att=0.8, rel=1.2)
flick(ww('log', 'kept by everyone', -0.3), 0.006, px(436))
tuck(ww('log', 'nobody has to read it back', -0.3), 0.007, px(436))

# 5. Keep the file. The logs, kept: a tube for each volume on the shelf, A major; climate scientists read them again, a new line of
#    letters, held as the million reports land; keep the file, a tube. Noor's three answers, a tube each. The wheel draws itself: A
#    major. The four steps round the ring, a tube each. In short: the three answers set down, with no music. The end card: the mark
kw = lambda lid, word, off=0: W('close', lid, word, off)
kc = lambda lid, off=0: G('close', lid, off)
for i, m in enumerate((A2, CS3, E3, FS3, A3)):
    tube(m, kc('kept', -0.4 + 0.12 * i), 0.8 - 0.06 * i, px(140 + 64 * i))
held(AMAJ, kc('kept', -0.3), kw('kept', 'were kept', 0.6), 0.6, att=0.6, rel=0.8)
air(kw('kept', 'climate scientists', -0.4), 2.0, 0.007, px(1000), 160, 800)  # the reports spread across the sea
letters(kw('kept', 'read them again', -0.4), ((A3, CS4), (E4, A4), (FS4, CS5), (CS4, A4), (A3, E4, FS4), (E4, CS5), (A3, A4)), 0.17, 0.13, 0.85, px(1000))
paper(kw('kept', 'a million weather reports', -0.4), 0.010, px(1500))
held(AMAJ_HI, kw('kept', 'a million weather reports', -0.2), kw('again', 'better readers', 1.4), 0.65, att=0.6, rel=1.1)
knock(kw('again', 'Keep the file', -0.2), 0.009, px(960), 260)
tube(A2, kw('again', 'Keep the file', -0.15), 0.85, px(960))
flick(kw('rule', 'one of three answers', -0.3), 0.006, px(300))
for i, (lid, w_, m) in enumerate((('write', 'If we write it', E3), ('official', "If it's official", CS3), ('read', "If it's written for people", A2))):
    paper(kw(lid, w_, -0.3), 0.009, px(1290), 0.35)
    tube(m, kw(lid, w_, -0.25), 0.75, px(1290))
for i in range(3):
    paper(kw('docs', 'documents differ', -0.5 + 0.2 * i), 0.009 - 0.0015 * i, px(920 + 110 * i), 0.3)
for i in range(2):
    flick(kw('docs', 'the standards', -0.2 + 0.15 * i), 0.006 - 0.001 * i, px(900 + 150 * i))
air(kw('docs', 'reinvent the wheel', -0.6), 1.4, 0.007, px(1560), 200, 900)
held(AMAJ_HI, kw('docs', 'reinvent the wheel', -0.5), END('close', 'docs') + 1.0, 0.6, att=0.9, rel=1.0, pan=px(1560) * 0.5)
paper(kw('iterate', 'the official docs', -0.3), 0.010, px(990))
for i, (w_, m, x_) in enumerate((('Investigate', A2, 1560), ('adapt', CS3, 1750), ('implement', E3, 1560), ('iterate', A3, 1370))):
    tube(m, kw('iterate', w_, -0.2), 0.75 - 0.05 * i, px(x_))
flick(kc('data', -0.1), 0.006, px(300))
for i, w_ in enumerate(('read documents', 'keep the file', "write what's yours")):
    tuck(kw('data', w_, -0.3), 0.008 - 0.001 * i, px(1290))           # in short: the three answers set down, with no music
tE = kc('breath', 0.3)
mark(tE, E('close') - 0.6)
