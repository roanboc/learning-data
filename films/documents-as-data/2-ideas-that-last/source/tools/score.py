# Ideas that last, features you test: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, checked on 11 November 2026 against every score.py and music.py on main and on this branch:
# two theremins, and scythe blades struck with a felt mallet. Both are made here; music.py has neither.
#  - The theremin (th(), line(), duo()): Leon Theremin's instrument of 1920, played without touching it, the hand's distance from a rod
#    setting the pitch. A tone near a pure sine, with a soft second and third partial, and the instrument's one mark: it glides from one
#    note to the next instead of stepping. Here it's played still, with no vibrato: each note placed, held, and moved to the next in a
#    short glide. A measuring instrument made into music, for a film about measuring what's new: a phrase tried, adjusted, and tried
#    again. Where a chord is held, two theremins play it together (duo()), each holding one note.
#  - Scythe blades (blade()): the long, thin steel blade of a hand scythe, hung by its heel and struck softly with a felt mallet, as a
#    farmer tests one for a crack by its ring. A clear note with the high, spread partials of a bar of steel, all kept low and quiet, that
#    dies within a second: the field and its harvest, a season done. The blades are cut to length, so each has its own note.
#  - The film's mark (mark()): a short theremin line that rises, glides back a step and settles, then a blade under its last note: a
#    try, a correction, a result. Over the title card and the end card.
#  - Keys: B minor for the problem, D major for the answer, tuned pure (just intonation from D, hz()): every note the film plays is a
#    whole-number ratio of D, so nothing beats.
# The rules the module keeps (tools/quiet.py checks them):
#  - Music under the opening story; after it, only at a chapter's turn, under a moment on screen, or in a pause without words; never a
#    bed under the voice. After the opening: a blade as the module's map lights, the four series as each is named, D major as each idea
#    proves older than its tools; the features' rush with no music, the ideas held as they come; the docs; the loop's ring, a blade at
#    each step, the 188 that match, the ticket closed, a dropped trial; the harvest again, the method, and the end card.
#  - Nothing pulses, loops or trembles; no figure is played again soon: each phrase is its own.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as src/scenes.js.
#  - Nothing of Mexico's own music for the 1940s story: the field is wind in the wheat, and the work is the breeders'.
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
R1 = np.random.default_rng(1920)  # this film's own randomness: the rooms and the mallet's touch

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
D3, FS3, A3, B3, CS4, D4, E4, FS4, G4, A4, B4, CS5, D5 = 50, 54, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74
DMAJ = (D4, FS4, A4)        # D major
DMAJ_LO = (D3, A3, FS4)     # D major, open and low
BMIN = (B3, D4, FS4)        # B minor
BMIN_HI = (D4, FS4, B4)     # B minor over its third

# ---- the levels: TH a theremin, BL a blade, FX the effects. tools/quiet.py measures them against the governance films' sound
TH, BL, FX = 0.030, 0.050, 1.75

def _ir(sec, lo):
    """a room's ring: noise that dies away over sec, its top rolled off at lo, after 20 ms. It is scaled so that a held note's ring
    is, on average, as loud as the note itself between 80 Hz and 1.2 kHz"""
    x = np.arange(int(sec * SR)) / SR; ir = (R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32)
    ir = filt(ir, 'low', lo); ir[:int(0.02 * SR)] = 0
    H = np.abs(np.fft.rfft(ir)) ** 2; f = np.fft.rfftfreq(len(ir), 1 / SR)
    return ir / np.sqrt(H[(f > 80) & (f < 1200)].mean())
ROOM = _ir(1.4, 1400)   # a plain hall, a little larger than a room
def _room(s, wet):
    """a note in the room, then given its own level back where it's held (past its first 0.4 s, before it lets go), so held notes sit
    at even levels"""
    if not wet:
        return s
    y = np.pad(s, (0, len(ROOM) - 1)) + wet * fftconvolve(s, ROOM).astype(np.float32)
    a, b = int(0.4 * SR), len(s) - int(0.2 * SR)
    if b - a < int(0.2 * SR):
        a, b = 0, len(s)
    return (y * np.sqrt(np.mean(s[a:b] ** 2) / max(1e-12, float(np.mean(y[a:b] ** 2))))).astype(np.float32)

# ---- the theremin. One voice playing a line of notes: seq is ((midi, start, end), ...), each note held from start to end, and where a
# note follows the one before within 0.25 s, the voice glides to it over glide s instead of stopping. Near a sine: its fundamental, a
# soft second and third, all under 2.4 kHz. att: how it swells in; rel: how it lets go. A note of 2 s or more swells a little and eases
PARTS = ((1, 1.0), (2, 0.12), (3, 0.06))
def th(seq, g=1.0, att=0.12, rel=0.5, pan=0.0, room=0.25, glide=0.09):
    a0, b0 = seq[0][1], seq[-1][2]; n = int((b0 - a0 + rel + 0.05) * SR); x = np.arange(n) / SR + a0
    f = np.zeros(n, np.float64); amp = np.zeros(n, np.float64)
    for i, (m, a, b) in enumerate(seq):
        f0 = hz(m); i0, i1 = int((a - a0) * SR), int((b - a0) * SR)
        f[i0:] = f0                                                              # each note holds until the next one takes over
        joined = i > 0 and a - seq[i - 1][2] < 0.25
        if joined:                                                               # the glide from the note before
            fp = hz(seq[i - 1][0]); k = min(int(glide * SR), i1 - i0)
            u = np.sin(0.5 * np.pi * np.arange(k) / max(1, k)) ** 2
            f[i0:i0 + k] = fp * (f0 / fp) ** u
            amp[int((seq[i - 1][2] - a0) * SR):i0] = 1.0                          # no break in the sound between them
        sec = b - a; xx = np.arange(i1 - i0) / SR
        env = np.ones(i1 - i0) if joined else np.sin(0.5 * np.pi * np.minimum(1, xx / att)) ** 2
        if sec >= 2.0:
            env = env * (0.93 + 0.07 * np.sin(np.pi * np.clip(xx / sec, 0, 1)))
        amp[i0:i1] = np.maximum(amp[i0:i1], env)
        nxt = seq[i + 1][1] if i + 1 < len(seq) else None
        if nxt is None or nxt - b >= 0.25:                                       # lets go
            r = np.arange(min(int(rel * SR), n - i1)) / SR
            amp[i1:i1 + len(r)] = np.maximum(amp[i1:i1 + len(r)], np.cos(0.5 * np.pi * np.clip(r / rel, 0, 1)) ** 2)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = sum(w * np.sin(h * ph) * (f * h < 2400) for h, w in PARTS)
    put(_room((s * amp).astype(np.float32), room), a0, g * TH, pan)
def note(m, a, b, g=1.0, att=0.35, rel=0.8, pan=0.0, room=0.25):
    """one theremin note, held"""
    th(((m, a, b),), g, att, rel, pan, room)
def line(t0, ms, step=0.42, hold=0.36, g=1.0, pan=0.0, last=0.0, rel=0.6):
    """a short line: each note held for hold, the next gliding on after step; last: how much longer the final note holds"""
    seq = [(m, t0 + i * step, t0 + i * step + hold + (last if i == len(ms) - 1 else 0)) for i, m in enumerate(ms)]
    th(seq, g, 0.1, rel, pan, 0.2)
def duo(ch, a, b, g=1.0, att=0.6, rel=0.9, pan=0.0):
    """a chord held by theremins together, one note each, the lowest a little louder"""
    for j, m in enumerate(ch):
        note(m, a + 0.03 * j, b, g * (1.0 - 0.1 * j), att, rel, pan + 0.12 * (j - 1), 0.25)
def mark(t0, end, g=1.0, pan=0.0):
    """the film's mark: a line that rises, glides back a step and settles on D, a blade under its last note, held until end"""
    th(((A3, t0, t0 + 0.42), (D4, t0 + 0.46, t0 + 0.88), (FS4, t0 + 0.92, t0 + 1.3), (E4, t0 + 1.34, t0 + 1.7), (FS4, t0 + 1.74, end)),
       g * 0.9, 0.12, 1.0, pan, 0.25)
    blade(D3, t0 + 1.74, 0.7, pan)
    note(A3, t0 + 1.9, end, g * 0.55, 0.6, 1.0, pan - 0.15)

# ---- a scythe blade, hung by its heel and struck softly with felt: a clear fundamental with the spread partials of a thin steel bar
# (2.76 and 5.40 times it), each dying faster than the one below, the fundamental within about 0.9 s; a soft thud of felt where it's
# struck. Dry, low-passed under 2.2 kHz
def blade(m, s, g=1.0, pan=0.0):
    f = hz(m); sec = 1.2; x = tt(sec)
    sig = (np.sin(2 * np.pi * f * x) * np.exp(-x / 0.22) + 0.18 * np.sin(2 * np.pi * 2.76 * f * x) * np.exp(-x / 0.09)
           + 0.05 * np.sin(2 * np.pi * 5.40 * f * x) * np.exp(-x / 0.04))
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.003)) ** 2
    felt = filt(noise(sec + 0.01)[:len(x)], 'band', (150, 900)) * np.exp(-x / 0.008) * 0.25
    put(filt((sig + felt).astype(np.float32), 'low', 2200), s, g * BL, pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a number landing"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a row, a tick, a light click"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """a card or a sheet laid down"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (220, 1500))[:len(x)], 'low', 2200) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def flick(s, g=0.008, pan=0.0):
    """a tag flicked in: short and light"""
    paper(s, g, pan, 0.16)
def tuck(s, g=0.008, pan=0.0):
    """a small mark set in a row: a dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def strike(s, sec=0.4, g=0.007, pan=0.0):
    """a line struck through a card: a pencil's short rasp"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1500))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0, lo=150, hi=900):
    """a breath of air: wind over the field, something sliding across"""
    s_air(s, sec, g * FX, pan, lo, hi)
# =============================================================================================================================
# 1. A foot for bare feet: the opening, with music. Jaipur, the 1960s: the workshop's still air, and D major, low and open, as the
#    hospital is named; the foot from abroad, a blade, and the music turns to B minor and stays there through the shoe, the floor it
#    can't sit on, and the foot given up; then nothing for "They needed a foot for the life they lived". The two of them: a theremin
#    rises; the feet made and fitted, a tap each; each trial, walked, squatted, sat, where it hurt, changed; the bare foot, D major; what
#    people could do on it, ticked one by one; an hour, far less; from 1975, free, and the count, D major again, higher; the foot kept
#    changing, and the question stayed; the platform's changes, with no music, then the ideas and the quick, honest test held. The title: the mark
sw = lambda lid, word, off=0: W('foot', lid, word, off)
scq = lambda lid, off=0: G('foot', lid, off)
air(0.3, 3.6, 0.007, px(420), 160, 800)                                      # the window's light, still air in the room
duo(DMAJ_LO, 0.6, sw('place', 'lost a leg', 1.0), 0.85, att=1.6, rel=1.3)
flick(sw('place', 'Jaipur', -0.3), 0.006, px(300))
flick(sw('place', 'Sawai Man Singh', -0.2), 0.006, px(300))
paper(sw('abroad', 'an artificial foot', -0.3), 0.010, px(1180))
blade(B3, sw('abroad', 'from abroad', -0.05), 0.75, px(1180))
duo(BMIN, sw('abroad', 'from abroad', 0.1), sw('gave', 'gave it up', 1.0), 0.8, att=1.2, rel=1.0)
flick(sw('shoe', 'in a shoe', -0.2), 0.006, px(1180))
flick(sw('shoe', 'barefoot', -0.2), 0.006, px(760))
flick(sw('shoe', 'under water', -0.2), 0.006, px(760))
knock(sw('squat', 'heavy and stiff', -0.1), 0.009, px(1180), 180)
for i, w_ in enumerate(('squat', 'sit on the floor')):
    strike(sw('squat', w_, 0.1), 0.35, 0.006, px(820 + 260 * i))
note(FS4, sw('gave', 'gave it up', 0.0), END('foot', 'gave') + 0.3, 0.6, att=0.9, rel=1.0)
# the surgeon and the craftsman; the feet made, fitted and tried, again and again
air(scq('team', -0.4), 1.0, 0.007, px(960), 160, 800)
line(sw('team', 'Pramod Karan Sethi', -0.2), (D4, FS4, A4), step=0.5, hold=0.46, g=0.75, pan=px(420), last=1.4)
tap(sw('made', 'wood and rubber', -0.1), 0.007, px(960))
tap(sw('made', 'cured like a tyre', -0.1), 0.006, px(960))
tuck(sw('made', 'fitted them', -0.2), 0.008, px(960))
paper(scq('tried', -0.3), 0.010, px(960))
for i, w_ in enumerate(('walked on it', 'squatted', 'sat on the floor')):
    tuck(sw('tried', w_, -0.2), 0.008 - 0.001 * i, px(700 + 260 * i))
blade(A3, sw('tried', 'where it hurt', -0.05), 0.6, px(960))
th(((A4, sw('tried', 'changed it', 0.0), sw('tried', 'changed it', 1.0)), (D5, sw('tried', 'changed it', 1.05), sw('tried', 'tried again', 0.9))),
   0.5, 0.3, 0.8, px(960), 0.25, glide=0.5)                                    # changed, and tried again: a glide up
# the bare foot: D major; what people could do on it
knock(sw('foot', 'looked and bent', -0.2), 0.010, px(960), 260)
duo(DMAJ, sw('foot', 'looked and bent', -0.1), END('foot', 'foot') + 0.6, 0.75, att=0.6, rel=1.1)
for i, w_ in enumerate(('walked barefoot', 'sat cross-legged', 'climbed trees')):
    flick(sw('could', w_, -0.25), 0.007 - 0.001 * i, px(760 + 200 * i))
paper(sw('hour', 'about an hour', -0.3), 0.010, px(960))
# from 1975, free; the count
paper(sw('free', 'nineteen seventy-five', -0.3), 0.010, px(960))
blade(FS3, sw('free', 'fitted it free', -0.1), 0.75, px(960))
knock(sw('free', 'seven hundred thousand', -0.2), 0.010, px(960), 260)
duo((FS4, A4, D5), sw('free', 'seven hundred thousand', -0.1), END('foot', 'free') + 0.8, 0.7, att=0.5, rel=1.1)
# the foot kept changing; the question stayed
flick(sw('kept', 'kept changing', -0.3), 0.006, px(1240))
flick(sw('kept', 'the first question', -0.3), 0.006, px(1240))
note(B3, sw('kept', 'the first question', 0.0), END('foot', 'kept') + 0.6, 0.5, att=0.7, rel=0.9)
# today: the platform's changes come and go, no music; then the ideas and the test
air(sw('same', 'Data platforms', -0.9), 1.0, 0.007, px(960), 160, 800)
for i in range(3):
    flick(sw('same', 'every month', -0.6 + 0.42 * i), 0.006 - 0.001 * i, px((300, 1380, 520)[i]))
knock(sw('same', 'What lasts', -0.2), 0.009, px(960), 260)
line(sw('same', 'What lasts', -0.1), (A3, D4, E4), step=0.45, hold=0.4, g=0.7, last=0.8)
knock(sw('same', 'a quick, honest way', -0.2), 0.009, px(960), 300)
tM = scq('breath', 0.3)
mark(tM, scq('breath', 3.8))

# 2. What the module showed: the map walked, a blade as data is born and one as it's read; each series named, a blade each, lower to
#    higher; their ideas with no music; the last, Documents and closing remarks, D major; each idea older than its tools, held
rw = lambda lid, word, off=0: W('recap', lid, word, off)
rc = lambda lid, off=0: G('recap', lid, off)
blade(D4, rw('walk', 'where data is born', -0.2), 0.6, px(400))
blade(A3, rw('walk', 'who reads it', -0.2), 0.55, px(1500))
for i, (lid, w_, m) in enumerate((('moves', 'Data that moves', D3), ('software', 'Data as software', FS3),
                                  ('tables', 'From tables to decisions', A3), ('docs', 'Documents and closing remarks', D4))):
    paper(rw(lid, w_, -0.4), 0.010, px(282 + 450 * i))
    blade(m, rw(lid, w_, -0.3), 0.6, px(282 + 450 * i))
for lid, x_ in (('fresh', 282), ('once', 282), ('watches', 732), ('readers', 1182)):
    tuck(rc(lid, -0.2), 0.007, px(x_))
note(FS4, rw('docs', 'Documents and closing remarks', 0.6), END('recap', 'docs') + 0.4, 0.5, att=0.8, rel=0.9, pan=px(1580))
knock(rw('older', 'older than the tools', -0.3), 0.009, px(960), 260)
duo(DMAJ, rw('older', 'older than the tools', -0.2), END('recap', 'older') + 1.0, 0.65, att=0.7, rel=1.2)

# 3. Why the films stay light. What changes fast: tags falling past, a flick for the first few, no music. A film of every button, out
#    of date: B minor held low. What changes slowly: the four ideas, a blade each. For the how: Databricks and dbt, a theremin line up.
#    Not on Databricks? The ideas, each linked to your own platform; most have an answer, D major. How to choose: two reasons struck
#    out, the real need held
lw = lambda lid, word, off=0: W('light', lid, word, off)
lc = lambda lid, off=0: G('light', lid, off)
for i in range(3):
    flick(lw('fast', 'new features', -0.6 + 0.8 * i), 0.006 - 0.001 * i, px(130))
paper(lw('date', 'every button', -0.3), 0.010, px(810))
duo(BMIN_HI, lw('date', 'within months', -0.4), END('light', 'date') + 0.9, 0.5, att=0.6, rel=1.0, pan=px(810))
for i, (w_, m) in enumerate((('agree what data means', D3), ('test it', FS3), ('govern it', A3), ('serve it', D4))):
    blade(m, lw('slow', w_, -0.3), 0.5, px(1500))
paper(lc('source', -0.3), 0.010, px(960))
line(lw('source', 'official documentation', -0.2), (D4, E4, FS4, A4), step=0.4, hold=0.36, g=0.6, pan=px(960), last=1.0)
flick(lw('source', 'the people who build it', -0.3), 0.006, px(960))
air(lc('other', -0.4), 0.9, 0.007, px(500), 180, 900)
paper(lw('other', 'your own platform', -0.3), 0.010, px(1470))
air(lw('other', 'for each one', -0.2), 1.0, 0.006, px(970), 200, 900)       # the four lanes reach the platform
tap(lw('other', 'for each one', 0.7), 0.007, px(1470))
duo((A3, D4, FS4), lw('other', 'another name', -0.4), END('light', 'other') + 0.8, 0.55, att=0.6, rel=1.0, pan=px(1470))
for i, w_ in enumerate(("because it's new", 'because a film showed it')):
    flick(lw('need', w_, -0.4), 0.006, px(560 + 800 * i))
    strike(lw('need', w_, 0.3), 0.4, 0.007, px(560 + 800 * i))
knock(lw('need', 'a real need', -0.4), 0.010, px(960), 260)
note(D4, lw('need', 'a real need', -0.3), END('light', 'need') + 1.0, 0.6, att=0.4, rel=1.1)
note(A4, lw('need', 'a real need', -0.1), END('light', 'need') + 1.0, 0.45, att=0.5, rel=1.1, pan=0.1)

# 4. Test what's new. The loop's ring draws itself, a theremin gliding once round; a blade at each step as it's named, lowest to highest.
#    A short loop learns more: three small arcs. Investigate: the ticket, the docs. Adapt: the sandbox fills, and D major as 188 match;
#    the 12, B minor. Implement: the project, its tests, the review, Finance's check, the ticket closed: a blade. Iterate: each month's
#    reasons, row by row. The dropped trial, struck; two days, not a year, held
ow = lambda lid, word, off=0: W('loop', lid, word, off)
oc = lambda lid, off=0: G('loop', lid, off)
th(((D4, ow('loop', 'small and quick', -0.1), ow('loop', 'small and quick', 0.6)), (A4, ow('loop', 'small and quick', 0.65), ow('loop', 'small and quick', 1.3)),
    (FS4, ow('loop', 'small and quick', 1.35), ow('loop', 'small and quick', 2.0)), (D4, ow('loop', 'small and quick', 2.05), ow('loop', 'small and quick', 2.6))),
   0.55, 0.2, 0.7, px(400), 0.2, glide=0.45)                                   # once round the ring
for i, (w_, m, x_) in enumerate((('investigate', A3, 400), ('adapt', CS4, 610), ('implement', E4, 400), ('iterate', A4, 190))):
    blade(m, ow('loop', w_, -0.2), 0.5 - 0.04 * i, px(x_))
paper(oc('shorter', -0.3), 0.010, px(1390))
air(ow('shorter', 'the workshop in Jaipur', -0.1), 0.9, 0.006, px(1500), 200, 900)
for i in range(3):
    tap(ow('shorter', 'the sooner you try it', 0.35 * i + 0.4), 0.007 - 0.0012 * i, px(1380 + 120 * i))
tuck(ow('shorter', 'where it hurts', -0.2), 0.008, px(988))
# investigate: Finance's ticket; the official docs
air(oc('need', -0.4), 0.8, 0.006, px(1640), 180, 900)                       # Jun comes in
paper(ow('need', 'typed every invoice', -0.5), 0.011, px(1020))
flick(ow('need', 'a real need', -0.2), 0.006, px(740))
paper(ow('read', 'the official docs', -0.4), 0.010, px(1020))
for i, w_ in enumerate(('what they do', 'what they cost', 'where they stop')):
    tuck(ow('read', w_, -0.2), 0.007 - 0.001 * i, px(780))
# adapt: the sandbox, two days; 200 invoices; compared: 188 match, 12 don't
air(oc('adapt', -0.3), 0.8, 0.006, px(1020), 200, 900)
flick(ow('adapt', 'in a sandbox', -0.3), 0.006, px(900))
air(ow('adapt', 'two hundred', -0.2), 1.4, 0.005, px(1000), 300, 1100)        # the 200 squares, as one soft texture
air(ow('compare', 'compared', 0.0), 1.6, 0.005, px(1000), 250, 1000)          # each compared
knock(ow('compare', 'a hundred and eighty-eight', -0.2), 0.010, px(900), 260)
duo((D4, FS4), ow('compare', 'a hundred and eighty-eight', -0.1), ow('compare', 'twelve', -0.3), 0.6, att=0.5, rel=0.6, pan=px(900))
note(B3, ow('compare', 'twelve', -0.1), END('loop', 'compare') + 0.5, 0.45, att=0.4, rel=0.9, pan=px(900))
flick(ow('learned', 'where it works', -0.4), 0.006, px(740))
# implement: one use case in the data project, its tests and a way back; reviewed, checked, the ticket closed
paper(ow('implement', 'the data project', -0.4), 0.010, px(1020))
tuck(ow('implement', 'its tests', -0.2), 0.008, px(780))
tuck(ow('implement', 'a way back', -0.2), 0.007, px(1030))
for i, w_ in enumerate(('The data team reviewed', "checked October's results", 'ticket closed')):
    flick(ow('review', w_, -0.3), 0.006, px(900))
    tap(ow('review', w_, 0.8), 0.007 - 0.001 * i, px(760))                   # each tag turns to a tick
blade(D4, ow('review', 'ticket closed', 0.8), 0.6, px(900))
note(FS4, ow('review', 'ticket closed', 0.9), END('loop', 'review') + 0.9, 0.45, att=0.5, rel=1.0, pan=px(900))
# iterate: each month, what went to a person, and why
paper(ow('iterate', 'each month', -0.3), 0.010, px(1020))
for i in range(4):
    tuck(ow('iterate', 'and why', -0.2 + 0.18 * i), 0.007 - 0.0012 * i, px(1130))
# a trial that ended in no
paper(ow('drop', 'They tried', -0.4), 0.010, px(1020))
flick(oc('list', -0.3), 0.006, px(900))
knock(ow('list', 'dropped it', -0.3), 0.009, px(920), 180)
note(E4, ow('list', 'dropped it', -0.2), END('loop', 'list') + 0.6, 0.4, att=0.4, rel=0.8, pan=px(920))
knock(ow('cost', 'two days', -0.3), 0.010, px(1020), 260)
duo((A3, CS4, E4), ow('cost', 'two days', -0.2), END('loop', 'cost') + 1.0, 0.6, att=0.5, rel=1.1, pan=px(1020))

# 5. Keep the method. The field again, at harvest: wind in the wheat, and D major as the method is named, a blade for the two places.
#    Keep the ideas, test the features. The module's four series, a blade each; Databricks and dbt; what's left for people, held. Start
#    from the docs, the loop. The end card: the mark
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
air(0.0 + S0('close'), 3.6, 0.007, px(420), 160, 800)
paper(cw('feet', 'long gone', -0.4), 0.010, px(1500))
paper(cw('feet', 'The method', -0.3), 0.010, px(1500))
blade(A3, cw('feet', 'how people live', -0.1), 0.6, px(1500))
duo(DMAJ_LO, cw('feet', 'how people live', 0.1), END('close', 'feet') + 0.6, 0.6, att=0.8, rel=1.0)
air(cc('keep', -1.0), 1.0, 0.007, px(960), 160, 800)                         # back to the map
knock(cw('keep', 'keep the ideas', -0.3), 0.009, px(960), 260)
knock(cw('keep', 'test the features', -0.3), 0.009, px(960), 300)
for i, (w_, m) in enumerate((('moving data', D4), ('running the platform', E4), ('serving it', FS4), ('reading documents', A4))):
    paper(cw('module', w_, -0.3), 0.009, px(560 + 800 * (i % 2)), 0.35)
    blade(m, cw('module', w_, -0.25), 0.4, px(560 + 800 * (i % 2)))
for i in range(2):
    knock(cw('team', 'Databricks and dbt', -0.3 + 0.4 * i), 0.008, px(480 + 960 * i), 280)
knock(cw('team', 'agreeing what the data means', -0.3), 0.009, px(960), 240)
duo((D4, FS4, B4), cw('team', 'agreeing what the data means', -0.2), END('close', 'team') + 0.5, 0.55, att=0.6, rel=1.0)
paper(cw('end', 'the official docs', -0.3), 0.010, px(480))
air(cw('end', 'Investigate', -0.2), 2.0, 0.006, px(1320), 200, 900)          # the loop draws itself
tuck(cw('end', 'keep going', -0.3), 0.008, px(1320))
tE = cc('breath', 0.3)
mark(tE, E('close') - 0.6)
