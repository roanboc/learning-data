# The hidden factory: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette, reserved for this film in /mnt/project-files/data-quality/palettes.md on 5 November 2026 and checked again on 10 November
# 2026 against every palettes.md in the project files and every score.py on main and on the module's branches (no anvil anywhere):
# tuned anvils, two sets, both made here (music.py has none).
#  - The small anvils, A3 to F5: tuned steel blocks struck softly with a padded hammer and damped at once, a plain, dull ring with the
#    soft thud of the pad. They play the work nobody sees: the same note struck again, two or three times, is the rework, never a loop.
#  - The large anvils, F2 to C4: a second set, larger and lower, struck once with felt and left to ring out, dark and slow. They play
#    only the fix made once, where the error is born: the ZIP Code written by the sender, the fix moved to the start, the file that keeps
#    every letter and the field that holds the whole name, Beatriz's name written once.
#  - The mark, as the title comes and again on the end card: a small anvil's A struck three times, then the large anvil's F once, left
#    to ring, and quiet.
#  - F major for what is put right; D minor for the problem.
# The rules every film keeps (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story (chapter 1, its title included); after it only from time to time, at a chapter's turn, under a
#    moment on screen or in a pause without words; never a bed under the voice.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato, no urgent pulse (nothing in this story is a rush). Two
#    anvils are never struck together; a small one may sound while a large one rings out, and the two sets' partials stay apart.
#  - Every sound is an event on screen, at the moment it appears, timed from the same word and offset as the picture in src/scenes.js,
#    so sound and picture stay together when the voice is re-timed. A burst on screen (six pencil marks, 21 circles) is one soft sound.
#  - Everything stays low and soft, below about 2.2 kHz: an anvil is bright by nature, so its upper partials are left out, and it never
#    clangs.

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
R1 = np.random.default_rng(1963)  # this film's own randomness: the room
def _rn(m, s, n):
    """a note's own noise (the pad, the felt), the same each time the score plays, so a note always sounds the same"""
    return np.random.default_rng((int(m) * 100003 + int(round(s * 1000))) & 0x7fffffff).standard_normal(n).astype(np.float32)

# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other. F major (F A C), B flat major, C major
# and D minor (D F A, 10:12:15) are pure in this table
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (53, 174.614)  # F 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
F2, A2, C3, F3, A3, Bb3, C4, D4, E4, F4, G4, A4, Bb4, C5, D5, F5 = 41, 45, 48, 53, 57, 58, 60, 62, 64, 65, 67, 69, 70, 72, 74, 77

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the effects about 16 dB under the music (FX scales them all)
AL, BL, FX = 0.070, 0.085, 1.6

# a room round the anvils: a small, quiet workshop, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by
# what it rings where the notes are (its gain under 1.5 kHz is one), so a note that rings on keeps its level, as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.018 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet, a=0.25, b=1.6):
    """a note that rings on, in the room, at its own level: even at a gain of one, the room moves a note's level up or down by where
    its reflections meet it, so the note is set back to the level it had before the room, measured where it rings on (from a to b s)"""
    r = _room(s, wet)
    if not wet:
        return r
    i, j = int(a * SR), min(len(s), int(b * SR))
    return r * float(np.sqrt((s[i:j].astype(np.float64) ** 2).mean() / max(1e-12, (r[i:j].astype(np.float64) ** 2).mean())))

# ---- the small anvils: a tuned steel block rings a strong first partial and a few higher ones that are not its harmonics (2.43, 3.98
# and 5.81 times it), each dying faster than the one below; a padded hammer barely excites the top, and the player's hand damps the
# block, so the note is gone within about a second. The pad lands with a soft, dull thud (noise under 800 Hz, gone in a hundredth of a
# second), and the steel's first touch is a short breath of noise round 1.5 kHz. Nothing above 2.2 kHz
SMALL = ((1.0, 1.0, 1.0), (2.43, 0.24, 2.2), (3.98, 0.09, 3.3), (5.81, 0.035, 4.5))  # ratio, level, how much faster it dies
def anvil(m, s, g=1.0, pan=0.0, damp=0.2, room=0.22):
    f0 = hz(m); sec = damp * 6 + 0.2; n = int(sec * SR); x = np.arange(n) / SR
    sig = np.zeros(n)
    for r, a, k in SMALL:
        if f0 * r < 2200:
            sig += a * np.sin(2 * np.pi * f0 * r * x + r) * np.exp(-x * k / damp)
    sig = sig * np.minimum(1, x / 0.003); sig = sig / max(1e-9, float(np.abs(sig).max()))
    rn = _rn(m, s, n)
    pad = filt(rn, 'band', (140, 800)) * np.exp(-x / 0.010) * 0.55
    touch = filt(rn[::-1].copy(), 'band', (900, 2000)) * np.exp(-x / 0.004) * 0.10
    put(_room(filt((sig + pad + touch).astype(np.float32), 'low', 2200), room), s, g * AL, pan)
def strike(notes, s, step=0.5, g=1.0, pan=0.0, spread=0.0):
    """small anvils struck one after another, each let go before the next: never two at once"""
    k = len(notes)
    for i, m in enumerate(notes):
        anvil(m, s + step * i, g * (1.0 if i == 0 else 0.9), pan + spread * (i / max(1, k - 1) - 0.5) if k > 1 else pan)

# ---- the large anvils: a bigger, heavier block, struck once with felt. Its first partial rings on for seconds; the three above it
# (2.24, 3.68 and 5.12 times it: a block's partials, not a bar's or a bell's) are soft and die much sooner, so the note darkens as it
# rings. The felt starts it softly, with a low, short thud. Kept under 1.9 kHz, and set back to its own level in the room (_held)
LARGE = ((1.0, 1.0, 1.0), (2.24, 0.20, 2.6), (3.68, 0.07, 3.9), (5.12, 0.03, 5.2))
def big(m, s, g=1.0, pan=0.0, ring=2.2, room=0.24):
    f0 = hz(m); sec = ring * 3.4; n = int(sec * SR); x = np.arange(n) / SR
    sig = np.zeros(n)
    for r, a, k in LARGE:
        if f0 * r < 1900:
            sig += a * np.sin(2 * np.pi * f0 * r * x + r) * np.exp(-x * k / ring)
    sig = sig * np.minimum(1, x / 0.007); sig = sig / max(1e-9, float(np.abs(sig).max()))
    felt = filt(_rn(m, s, n), 'band', (60, 420)) * np.exp(-x / 0.03) * 0.35
    put(_held(filt((sig + felt).astype(np.float32), 'low', 1900), room), s, g * BL, pan)
def mark(s):
    """the mark: a small anvil's A struck three times, the work done again; then the large anvil's F once, left to ring, and quiet"""
    strike((A4, A4, A4), s, 0.42, 0.85)
    big(F2, s + 1.5, 1.0, ring=2.4)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a chip, a tag of a name, a row lit"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.008, pan=0.0, step=0.24):
    """a few keys typed"""
    for i in range(n):
        tap(s + i * step, g if i < 2 else g * 0.75, pan)
def paper(s, g=0.012, pan=0.0, sec=0.4):
    """a sheet laid down, or slid across"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=0.6, g=0.007, pan=0.0):
    """a pencil drawing a line: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def chalk(s, sec=0.8, g=0.006, pan=0.0):
    """chalk on the granite bench: drier and lower than the pencil"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.1), s, g * FX, pan)
def stamp(s, g=0.016, pan=0.0):
    """a verdict's tag pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, the street, the night"""
    s_air(s, sec, g * FX, pan, lo, hi)
def click(s, g=0.011, pan=0.0):
    """a button pressed: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def thud(s, g=0.016, pan=0.0):
    """something heavier set down: a basket of letters"""
    s_knock(s, g * FX, pan, 150); paper(s + 0.01, g * 0.4, pan, 0.18)
def whirr(s, sec=2.0, g=0.006, pan=0.0):
    """the sorting machine running: a low, even hum of belts and rollers that swells in and out once, never a rhythm"""
    x = tt(sec); X(filt(noise(sec), 'band', (90, 520))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)

# =============================================================================================================================
# 1. Dead letters: the opening, with music all through it.
#    Washington, 1899: the city, F A C on the small anvils; the Dead Letter Office, D minor. A dead letter, the low A, alone. Moved on,
#    no address: D C. The room filling, the clerks: A C D E. Collins: about a thousand a day, the same D struck three times. Unseen, and it never fixes the next letter: F E D, falling.
#    News someone never gets: the low A. Something has to change: B flat major. 1943, the zones: C major as the envelope goes into its
#    hole. 1963: written by the sender, once: the large anvil's F. Machines: F A C F, rising; billions saved: A C. The fix moved to the start: the large anvil's F again. The university, by
#    hand: the same D, twice; the same errors back: the same two strikes. A name put right once: F A C. The title: the mark.
S = lambda lid, word, off=0: W('dead', lid, word, off)
s0 = S0('dead')
air(s0 + 0.3, 3.4, 0.006, 0.0, 150, 700)
strike((F4, A4, C5), s0 + 0.2, 0.55, 0.7, px(900), 0.4)
# the reading room, its baskets and sacks; the card: 6,312,731 a year; the Dead Letter Office, D minor
knock(S('mail', 'six', 2.2), 0.012, px(1230), 240)
strike((D4, F4, A4), END('dead', 'mail') + 0.1, 0.55, 0.7, px(900), 0.3)
# the reading table: three envelopes slide in; the card; a pencil note on the first
paper(S('means', 'dead letter', -0.6), 0.010, px(780), 0.5)
knock(S('means', 'dead letter', 0.2), 0.012, px(1420), 240)
anvil(A3, S('means', 'dead letter', 0.25), 0.75, px(1420))
pencil(S('moved', 'address', -0.6), 1.2, 0.006, px(600))
strike((D4, C4), END('dead', 'moved') + 0.15, 0.55, 0.6, px(600))
paper(S('street', 'street', -0.5), 0.010, px(1570), 0.5)
paper(S('street', 'spelt', -0.4), 0.010, px(1160), 0.5)
strike((A3, C4, D4, E4), END('dead', 'street') + 0.1, 0.55, 0.6, px(960), 0.4)
# the room: the clerks at the tables; Collins, close, writes "Hyde Park, Mass." beside the address; about a thousand a day
tap(G('dead', 'collins', 1.0), 0.008, px(300))
paper(G('dead', 'collins', 1.8), 0.009, px(820), 0.4)
pencil(G('dead', 'collins', 2.6), 1.6, 0.006, px(900))
knock(S('collins', 'thousand', -0.2), 0.012, px(300), 240)
strike((D4, D4, D4), END('dead', 'collins') + 0.25, 0.42, 0.7, px(1000))
# a new basket comes in, with the same kinds of address; it never fixes the next letter: F E D, falling
thud(S('unseen', 'next', 0.9), 0.012, px(780))
strike((F4, E4, D4), END('dead', 'unseen') + 0.2, 0.55, 0.65, px(900), 0.3)
# nearly three million destroyed: the sacks go; the card; one letter left; news someone never gets, the low A
air(G('dead', 'lost', 0.0), 2.0, 0.006, px(1800), 150, 700)
knock(G('dead', 'lost', 0.4), 0.012, px(1600), 240)
anvil(A3, END('dead', 'lost') + 0.2, 0.7, px(820))
# something has to change, where the address is written: the room steps back, the card; B flat major
knock(S('change', 'where', -0.3), 0.012, px(960), 240)
strike((Bb3, D4, F4), END('dead', 'change') + 0.1, 0.55, 0.7, px(960), 0.3)
# 1943: the zones; a young clerk; the envelope comes in, its zone underlined, and goes into hole 16. C major
paper(G('dead', 'zones', 0.1), 0.009, px(1080), 0.4)
pencil(S('zones', 'a number', -0.2), 0.7, 0.006, px(1140))
air(S('zones', 'sort by it', -0.2), 1.3, 0.006, px(900), 200, 900)
tap(S('zones', 'sort by it', 1.15), 0.010, px(700))
strike((C4, E4, G4), S('zones', 'sort by it', 1.25), 0.55, 0.6, px(700), 0.3)
# 1963: the ZIP Code, written by the sender: the code in pen, the card; once, at the start: the large anvil's F
pen = S('zip', 'five digits', -0.2)
pencil(pen, 1.3, 0.006, px(1100))
knock(S('zip', 'written by', -0.2), 0.012, px(1560), 240)
big(F2, S('zip', 'written by', -0.1), 0.9, px(1300), ring=2.2)
# anyone, and soon machines: the case by the first digit; the machine runs; F A C F, rising; 1969, the cards
tap(S('sort', 'anyone', -0.3), 0.008, px(560))
whirr(S('sort', 'machines', 0.0), 2.2, 0.006, px(1180))
strike((F4, A4, C5, F5), END('dead', 'sort') + 0.1, 0.5, 0.6, px(1180), 0.4)
knock(S('used', 'eighty-three', -0.1), 0.012, px(330), 240)
knock(S('used', 'billions', -0.3), 0.012, px(860), 240)
strike((A4, C5), END('dead', 'used') + 0.1, 0.55, 0.55, px(860))
# the fix moved to the start: the envelope of 1899 slides in beside 1963's; the pencil arrow from the end to the start; the large F
paper(G('dead', 'start', -0.2), 0.010, px(1360), 0.6)
tap(G('dead', 'start', 0.5), 0.008, px(1360))
pencil(S('start', 'written once', -0.4), 1.5, 0.006, px(980))
tap(S('start', 'written once', -0.2), 0.008, px(560))
big(F2, S('start', 'written once', 1.25), 0.85, px(640), ring=2.2)
# the university, 2025: the copy on Malia's screen; pencil marks in its cells, by hand: the same D, twice; the next list, the same
# marks, the same errors back: the same two strikes
pencil(S('campus', 'by hand', -0.2), 2.0, 0.005, px(560))
strike((D4, D4), S('campus', 'by hand', -0.1), 0.45, 0.65, px(560))
pencil(S('same', 'new list', 0.6), 2.0, 0.005, px(560))
strike((D4, D4), END('dead', 'same') + 0.1, 0.45, 0.65, px(560))
# count it, fix it where it's born: the grey tag, the card; a name put right once, for every list after: F A C
stamp(S('promise', 'Count', -0.2), 0.012, px(712))
knock(S('promise', 'born', -0.6), 0.012, px(1530), 240)
strike((F4, A4, C5), END('dead', 'promise') + 0.2, 0.55, 0.65, px(1300), 0.3)
# the title: the mark, its large anvil ringing on into the next chapter's first seconds
mark(G('dead', 'breath', 0.15))

# 2. Every name, by hand: the copy's rows ticked; the platform's SQL editor, the list downloaded; a name checked against the document
#    seen at enrolment; the call; three names corrected; to the printer. The Great Hall, the folders open and empty: D C A, falling.
#    The bench: a hundred records, the 21 circled; 21 in 100 against 41 in 2,031, and the question: D E. 1899 and 2025 side by side,
#    each at the end, unseen: the same F, twice
H_ = lambda lid, word, off=0: W('hand', lid, word, off)
tap(G('hand', 'malia', 0.5), 0.008, px(860))
for i_ in range(3):
    pencil(H_('malia', 'by hand', -0.5 + 0.9 * i_), 0.25, 0.005, px(1380))
knock(H_('down', 'download', -0.5), 0.011, px(1430), 240)
keys(H_('down', 'download', -0.3), 3, 0.007, px(1300), 0.35)
tap(H_('down', 'platform', 0.0), 0.009, px(1100))
tap(H_('down', 'platform', 0.3), 0.009, px(1640))
paper(H_('down', 'spreadsheet', -0.1), 0.010, px(1430), 0.4)
knock(H_('docs', 'documents', -0.2), 0.011, px(1270), 240)
for i_ in range(3):
    pencil(H_('docs', 'documents', 0.3 + 1.4 * i_), 0.25, 0.005, px(1380))
tap(H_('docs', 'phone', 0.4), 0.008, px(1728))
keys(G('hand', 'sent', 0.3), 3, 0.007, px(1400), 0.7)
stamp(H_('sent', 'thirteenth', -0.6), 0.012, px(1040))
air(G('hand', 'printed', -1.1), 1.0, 0.007, px(1600), 200, 900)
knock(H_('printed', 'printed again', -0.6), 0.012, px(420), 240)
strike((D4, C4, A3), END('hand', 'printed') + 0.1, 0.55, 0.65, px(820), 0.3)
paper(G('hand', 'hundred', -0.2), 0.010, px(600), 0.6)
pencil(H_('hundred', 'found', -0.2), 2.4, 0.004, px(600))
knock(H_('hundred', 'twenty-one', -0.1), 0.012, px(1570), 240)
knock(H_('five', 'but only', -0.1), 0.012, px(1570), 240)
chalk(H_('five', 'but only', 0.9), 0.5, 0.006, px(1556))
strike((D4, E4), END('hand', 'five') + 0.1, 0.5, 0.6, px(1556))
tap(H_('like', 'at the end', -0.3), 0.008, px(960))
strike((F4, F4), END('hand', 'like') + 0.2, 0.45, 0.6, px(960))

# 3. Nobody counts it: Redman's sheet, the two teams in pencil and the room behind the second: A D F, as the sheet comes; Feigenbaum's
#    line and the line that redoes its parts; the team's copy, careful and needed; it hides three things: D F A. The three grey tags;
#    the printer's 41; where the errors are born, a card that isn't there. Redman's advice: count it, then take it to the people who
#    make the data: F G A, rising, in the pause
D_ = lambda lid, word, off=0: W('hidden', lid, word, off)
paper(S0('hidden') + 0.2, 0.010, px(660), 0.6)
strike((A3, D4, F4), S0('hidden') + 0.5, 0.55, 0.6, px(660), 0.3)
knock(G('hidden', 'redman', 0.3), 0.012, px(1560), 240)
pencil(G('hidden', 'redman', 0.6), 0.8, 0.006, px(365))
pencil(G('hidden', 'redman', 2.0), 0.6, 0.005, px(655))
pencil(G('hidden', 'redman', 2.4), 0.8, 0.006, px(945))
pencil(D_('steps', 'one team', -0.2), 1.1, 0.006, px(945))
paper(G('hidden', 'plant', -0.5), 0.010, px(660), 0.6)
pencil(G('hidden', 'plant', 0.2), 1.3, 0.005, px(560))
pencil(D_('plant', 'hidden plant', -0.3), 0.7, 0.005, px(700))
knock(D_('plant', 'hidden plant', -0.4), 0.012, px(1560), 240)
paper(G('hidden', 'needed', -0.6), 0.010, px(540), 0.6)
knock(G('hidden', 'needed', 0.2), 0.012, px(1460), 240)
strike((D4, F4, A4), END('hidden', 'three') + 0.1, 0.55, 0.6, px(1060), 0.3)
stamp(G('hidden', 'hours', 0.0), 0.011, px(1100))
stamp(G('hidden', 'rate', 0.0), 0.011, px(1100))
knock(D_('rate', 'printer', -0.2), 0.012, px(1710), 240)
stamp(G('hidden', 'cause', 0.0), 0.011, px(1100))
chalk(D_('cause', 'born', -0.4), 0.8, 0.005, px(360))
knock(G('hidden', 'advice', 0.2), 0.012, px(1410), 240)
strike((F4, G4, A4), END('hidden', 'advice') + 0.3, 0.55, 0.6, px(1410), 0.3)

# 4. Count it: Noor and Malia, and the three ways: C F, as the chapter turns. The calendar, the bars for each list, the year; two
#    months of one person's work: the same D, twice. The system tables, the rounds on three Mondays. The list against the copy: 517
#    changed by hand, 26 got past; about one in four: A F D, falling. Two stopwatches; the wrong names took 170 of 240 hours: the same
#    D, three times. The rule of ten
C_ = lambda lid, word, off=0: W('count', lid, word, off)
strike((C4, F4), S0('count') + 0.5, 0.55, 0.6, px(960))
tap(C_('august', 'Noor', -0.3), 0.008, px(500))
tap(C_('august', 'Malia', -0.2), 0.008, px(1420))
for i_ in range(3):
    tap(C_('august', 'three ways', -0.2 + 0.3 * i_), 0.008, px(960))
paper(G('count', 'cal', -0.3), 0.010, px(560), 0.6)
for w_, off_, x_ in (('two hundred', -0.4, 1300), ('fifty', -0.3, 1060), ('thirty', -0.3, 1040)):
    s_knock(C_('cal', w_, off_), 0.008 * FX, px(x_), 200)
tap(G('count', 'year', 0.6), 0.009, px(1200))
knock(C_('year', 'two months', -0.2), 0.012, px(1400), 240)
strike((D4, D4), END('count', 'year') + 0.1, 0.45, 0.6, px(1400))
paper(G('count', 'rounds', -0.6), 0.010, px(960), 0.6)
for i_ in range(3):
    tap(G('count', 'query', 0.6 + 0.6 * i_), 0.008, px(1100))
for i_ in range(3):
    tap(C_('query', 'audit log', 0.4 + 0.6 * i_), 0.008, px(1100))
tap(C_('query', 'three Mondays', 0.0), 0.009, px(1560))
paper(G('count', 'copy', -0.6), 0.010, px(960), 0.6)
air(G('count', 'changed', -0.6), 2.4, 0.005, px(560), 200, 900)
knock(G('count', 'changed', -0.6), 0.011, px(1245), 240)
knock(C_('changed', 'twenty-six', 0.0), 0.011, px(1665), 240)
knock(G('count', 'quarter', 0.2), 0.012, px(550), 240)
knock(C_('quarter', 'one in four', 0.0), 0.012, px(1260), 240)
strike((A4, F4, D4), END('count', 'quarter') + 0.2, 0.55, 0.6, px(800), 0.3)
paper(G('count', 'minutes', -0.6), 0.010, px(960), 0.6)
click(G('count', 'minutes', 0.2), 0.010, px(560))
click(C_('minutes', 'A wrong one', 0.0), 0.010, px(1360))
s_knock(G('count', 'wrong', -0.2), 0.008 * FX, px(560), 200)
strike((D4, D4, D4), END('count', 'wrong') + 0.2, 0.42, 0.6, px(960))
knock(G('count', 'ten', 0.2), 0.012, px(960), 240)

# 5. Cut short again: Beatriz's name as she writes it, in brass: F A C. Its 33 characters measured; her two graduations. The portal:
#    her name cut short; "This isn't my name", and the three letters she types; March's certificate. August: December's list, cut
#    short again, held: the same D, twice. Noor, Jun, Mei and Malia; the student system's record, its field; the five whys, each a
#    card; the two causes. Unity Catalog's lineage, the path from the list back to the student system: a small anvil's note as the
#    light reaches each column, C, A, F, falling back to where the name is born. What the platform can't see; people have to tell you
P_ = lambda lid, word, off=0: W('back', lid, word, off)
knock(G('back', 'beatriz', 0.1), 0.012, px(540), 240)
strike((F4, A4, C5), END('back', 'beatriz') + 0.1, 0.55, 0.6, px(540), 0.3)
pencil(G('back', 'long', 0.2), 1.3, 0.005, px(500))
stamp(P_('long', 'thirty-three', -0.3), 0.011, px(800))
tap(P_('beatriz', 'March', -0.3), 0.008, px(1300))
tap(P_('beatriz', 'December', -0.3), 0.008, px(1300))
knock(G('back', 'feb', -0.3), 0.011, px(1430), 240)
click(P_('feb', 'cut short', 0.3), 0.011, px(1640))
keys(P_('feb', 'corrected', -0.25), 3, 0.007, px(1500), 0.3)
paper(P_('feb', "March's certificate", 0.6), 0.010, px(1430), 0.4)
knock(P_('cutagain', "December's list", -0.4), 0.011, px(530), 240)
stamp(P_('cutagain', 'cut short again', 0.2), 0.012, px(920))
strike((D4, D4), END('back', 'cutagain') + 0.1, 0.45, 0.6, px(920))
for w_, x_ in (('Mei', 1180), ('Malia', 1620), ('Noor', 300), ('Jun', 740)):
    tap(P_('ask', w_, -0.3), 0.008, px(x_))
knock(P_('why1', 'The list', 0.6), 0.011, px(450), 240)
for i_ in range(5):
    knock(G('back', 'why%d' % (i_ + 1), -0.2), 0.011, px(1490 - 235 * i_), 240)
pencil(P_('why4', 'thirty', -0.9), 0.9, 0.005, px(600))
stamp(P_('why4', 'thirty', -0.2), 0.011, px(700))
knock(P_('causes', 'a field', -0.2), 0.011, px(1550), 240)
knock(P_('causes', 'no way back', -0.2), 0.011, px(1550), 240)
knock(G('back', 'lineage', 0.1), 0.011, px(960), 240)
tL0 = P_('lineage', 'column by column', -0.3); tL1 = G('back', 'path', 3.4)
anvil(C5, tL0 + 0.1, 0.6, px(1350))
anvil(A4, (tL0 + tL1) / 2, 0.6, px(900))
anvil(F4, tL1 - 0.05, 0.62, px(420))
for k_ in range(5):
    tap(G('back', 'tell', -0.3 + 0.22 * k_), 0.007, px((250, 560, 960, 1360, 1660)[k_]))
knock(P_('tell', 'people', -0.2), 0.012, px(960), 240)

# 6. Four bones: the fishbone drawn, as Kaoru Ishikawa taught: D F A, as the chapter turns; the spine, the head, the card; each bone
#    as it's named, and the line where data passes between systems; each cause, a card, and its count. Nobody did anything wrong, each
#    cause made sense when it was made: C A F, falling softly, in the pause
B_ = lambda lid, word, off=0: W('bones', lid, word, off)
strike((D4, F4, A4), S0('bones') + 0.6, 0.55, 0.6, px(960), 0.3)
pencil(B_('fish', 'draws', -0.2), 1.9, 0.006, px(760))
knock(B_('fish', 'Kaoru Ishikawa', -0.2), 0.011, px(1630), 240)
knock(B_('fish', 'the problem', -0.3), 0.011, px(1640), 240)
for w_, x_ in (('people', 500), ('process', 1100), ('systems', 500), ('interfaces', 1100)):
    pencil(B_('four', w_, -0.3), 0.7, 0.005, px(x_))
pencil(B_('four', 'where data', -0.2), 1.0, 0.004, px(1200))
for lid_, w_, x_ in (('people', 'paper forms', 715), ('people', 'thirty-five', 810), ('process', 'every fix', 1325),
                     ('systems', 'the thirty-character', 820), ('systems', 'until', 685), ('inter', 'the nightly', 1380)):
    paper(B_(lid_, w_, {'thirty-five': 0.5, 'until': -0.3}.get(w_, -0.4)), 0.008, px(x_), 0.3)
for lid_, w_, off_ in (('people', 'thirty-five', -0.2), ('people', 'thirty-five', 1.0), ('systems', 'thirty-nine', -0.2), ('systems', 'three hundred', -0.2)):
    tap(B_(lid_, w_, off_), 0.008, px(800))
tap(G('bones', 'accents', -0.1), 0.008, px(1380))
pencil(B_('nobody', 'Each cause', -0.3), 2.2, 0.004, px(860))
strike((C5, A4, F4), END('bones', 'nobody') + 0.2, 0.6, 0.55, px(960), 0.3)

# 7. Where it's born: the fishbone under a dark veil, the card; each cause gets its owner: F A. The bench at night: Sam and the student
#    system team; the nightly file; the letter with its accent goes through, and arrives whole: one small anvil's C. Beatriz's field,
#    made longer, from 30 to 100: the large anvil's F. The bench by day: a correction goes from Malia to Mei's office, made once: one
#    small anvil's A; the copy goes. Old names. Jun's checks in dbt: two hold, one stops. The names held for Mei's office, a list to
#    work through; a night's file losing its letters, stopped; the two levels. In the pause: F A C
N_ = lambda lid, word, off=0: W('born', lid, word, off)
knock(G('born', 'fixed', 0.0), 0.011, px(960), 240)
strike((F4, A4), S0('born') + 0.25, 0.55, 0.6, px(960))
for k_, x_ in enumerate((1460, 900, 1540, 820, 900, 800)):
    tap(N_('fixed', 'with its owner', -0.2 + 0.22 * k_), 0.007, px(x_))
air(G('born', 'night', -0.3), 2.0, 0.006, 0.0, 150, 700)
tap(N_('night', 'Sam', -0.3), 0.008, px(520))
tap(N_('night', 'the student system team', -0.2), 0.008, px(1300))
knock(N_('file', 'keeps every letter', -0.8), 0.010, px(1300), 240)
air(N_('file', 'keeps every letter', -0.2), 2.2, 0.005, px(1300), 250, 1000)
anvil(C5, N_('file', 'keeps every letter', 2.0), 0.6, px(1660))
knock(N_('file', 'family name field', -0.6), 0.011, px(1310), 240)
pencil(N_('file', 'a hundred', -0.3), 1.5, 0.005, px(1500))
big(F2, N_('file', 'a hundred', 0.25), 0.85, px(1500), ring=2.2)
tap(G('born', 'mei', 0.0), 0.008, px(520))
tap(G('born', 'mei', 0.3), 0.008, px(1420))
knock(G('born', 'mei', 0.4), 0.011, px(960), 240)
air(G('born', 'mei', 0.6), 1.6, 0.005, px(970), 200, 900)
anvil(A4, N_('mei', 'made once', -0.15), 0.62, px(360))
paper(N_('mei', 'keeps no copy', -0.2), 0.009, px(1560), 0.5)
tap(N_('mei', 'keeps no copy', 0.2), 0.008, px(1560))
knock(G('born', 'old', -0.2), 0.011, px(960), 240)
tap(G('born', 'jun', 0.0), 0.008, px(300))
knock(N_('jun', 'in dbt', -0.4), 0.011, px(1320), 240)
tap(N_('jun', 'on the student', -0.2), 0.007, px(1320))
keys(N_('jun', 'in dbt', 0.2), 3, 0.007, px(1320), 0.5)
tap(N_('jun', 'owned by Mei', 0.0), 0.008, px(1320))
for k_, off_ in enumerate((0.8, 1.3, 1.8)):
    stamp(N_('jun', 'in dbt', off_), 0.011 if k_ < 2 else 0.013, px(1560))
paper(G('born', 'hold', -0.6), 0.010, px(960), 0.6)
stamp(G('born', 'hold', 0.8), 0.011, px(700))  # as the tag shows: it springs in from 0.4 s before, still faint
stamp(N_('hold', 'or in capitals', 0.2), 0.011, px(1320))
knock(N_('hold', 'holds for', -0.2), 0.011, px(960), 240)
for i_ in range(5):
    tap(N_('hold', 'a list', -0.4 + 0.25 * i_), 0.006, px(960))
paper(G('born', 'stop', -0.6), 0.010, px(960), 0.6)
tap(G('born', 'stop', 1.0), 0.008, px(330))
chalk(N_('stop', 'stops the update', -0.6), 0.6, 0.005, px(900))
stamp(N_('stop', 'stops the update', -0.3), 0.014, px(700))
s_knock(N_('stop', 'stops the update', 0.0), 0.008 * FX, px(1018), 170)
tap(N_('stop', 'the list keeps', 0.0), 0.008, px(1300))
tap(N_('stop', 'Sam is told', -0.2), 0.008, px(1360))
paper(G('born', 'levels', -0.6), 0.010, px(960), 0.6)
stamp(G('born', 'levels', 1.0), 0.011, px(520))
stamp(N_('levels', 'a file losing', 1.0), 0.013, px(1400))
strike((F4, A4, C5), END('born', 'levels') + 0.3, 0.55, 0.55, px(960), 0.3)

# 8. Put right once: the morning, December's list, its names taking back their accents, nobody typing: F G A C, rising with the count.
#    Beatriz's record, held; Mei's office types the three letters; the tag turns green: the large anvil's F, once. The arrows to
#    December's list and every list after. The scorecard and its new row, the hand-check hours. 1963's envelope, its code written at
#    the start, beside her name written once. The graduations office. The end card: the mark
O_ = lambda lid, word, off=0: W('once', lid, word, off)
knock(S0('once') + 0.6, 0.011, px(680), 240)
knock(O_('morning', 'a hundred and sixty-one', -0.6), 0.011, px(1430), 240)
strike((F4, G4, A4, C5), O_('morning', 'a hundred and sixty-one', -0.4), 0.75, 0.55, px(680), 0.3)
tap(O_('morning', 'nobody typed', -0.2), 0.008, px(1300))
knock(G('once', 'written', -0.4), 0.011, px(960), 240)
stamp(O_('written', 'holds', -0.2), 0.011, px(1520))
tap(O_('written', "Mei's office", -0.2), 0.008, px(1400))
keys(O_('written', 'in full', -0.3), 3, 0.007, px(1300), 0.24)
stamp(O_('written', 'once', 0.0), 0.012, px(1520))
big(F2, O_('written', 'once', 0.05), 0.95, px(1520), ring=2.4)
tap(O_('written', 'once', 0.2), 0.008, px(1000))
chalk(O_('written', 'for every list after', -0.3), 0.9, 0.005, px(960))
tap(O_('written', 'for every list after', 0.3), 0.008, px(640))
tap(O_('written', 'for every list after', 0.6), 0.008, px(1280))
knock(G('once', 'score', -0.1), 0.011, px(960), 240)
tap(O_('score', 'hours', 0.2), 0.009, px(960))
tap(O_('score', 'beside the checks', -0.2), 0.007, px(960))
pencil(O_('post', 'put a code', -0.2), 1.3, 0.006, px(600))
paper(O_('post', 'written by', -0.4), 0.010, px(1410), 0.6)
tap(O_('post', 'put a code', 0.6), 0.008, px(560))
tap(O_('post', 'written by', 0.6), 0.008, px(1410))
mark(G('once', 'breath', 0.2))
