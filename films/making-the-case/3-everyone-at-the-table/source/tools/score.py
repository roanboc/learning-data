# Everyone at the table: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (/mnt/project-files/data-management/palettes.md: reserved by this film's thread on 10 November
# 2026, after searching every score.py, music.py, audio.py and sound.py on main and on every branch: no film whistles as music, and
# whistles are effects only in Teachers of data and What's in a word): whistling, made here, as music.py has none.
#  - The lead: people round a table whistling softly through their lips, the one instrument everyone at the table already has. Low in
#    the range (B 4 to B 5, a few notes up to E 6). Each note placed with a soft breath before it, held level, and let go with the
#    breath outlasting it: no vibrato, no slide, no scoop (each note starts on its pitch and stays there), nothing that trembles. A
#    purer tone than the site's flutes and ocarina: its second harmonic about 30 dB down, its third about 40, nothing above; a small,
#    dry room, never a hall. Every whistle is a tune, never a call: none rises into its note, as people whistle at a car.
#  - The tune is passed round the table: five whistlers in their seats, left to right across the picture, each placing one note, so
#    every voice is its own note and together they make one tune. Each breathes in its own way (where its breath sits, and how much),
#    never in its own tuning, so two whistlers on one note never beat.
#  - The partner: a lower whistler, softer and darker (E 4 to E 5: more of its second harmonic, its breath lower), who holds the last
#    note of a tune under the others, and whistles alone under the opening's problem.
#  - The mark: B 4, E 5, G sharp 5 and B 5 passed round the table, one whistler each (each one heard), then the same four whistled by
#    everyone together over the partner's E 4, a fifth below them (the same story for everyone). Four times: as each worry of 1850
#    has its answer and everyone has seen the same picture; as the data manager asks each one and tells everyone the same story; as
#    everyone reads the same page; and under the takeaway, held into the end card.
#  - E major for the table and the plan; C sharp minor for the opening's problem (the worries, the loudest voices), for a constraint
#    and for bad news; A major where a plan is shown to everyone and where a chapter turns; B major where a plan is accepted and the
#    count is made. Every note is tuned pure from E (just intonation, see hz()): E, A and B major, and C sharp and G sharp minor, are
#    pure in this table; F sharp minor, and F sharp held with C sharp, are not, and never sound together. Nothing from the opening's
#    world: no Victorian parlour music, no brass band, no organ, no street cries.
# The rules every film of the module keeps (palettes.md, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice; no figure played again soon after itself; music and effects no louder than
#    the governance films'.
#  - Nothing trembles or pulses: each note steady, with no vibrato; each one gone before the next chapter where the picture changes.
#    No urgent pulse: nothing in this film is a rush.
#  - Every sound is an event on screen, at the moment it appears, as the script plans the picture (script.md, Script); each one below
#    uses the same word and offset the pictures do (src/et_scenes.js), so sound and picture stay together when the voice is re-timed.
#    A burst on screen (the 38 reports, the twelve copies of the newspaper, the fourteen short lines) is one soft sound, never one each.
# And everything stays low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() takes a word's first appearance, even inside a longer word, and falls back to the line's start when it's missing; here either
# stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid, off=0):
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1850)  # this film's own randomness: the room

# ---- tuning: just intonation from E, so a chord's notes are whole-number ratios of each other and nothing beats. E, A and B major,
# and C sharp and G sharp minor, are pure in this table; F sharp minor, and F sharp held with C sharp, are not, and never sound together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 40, 12)
    return 82.40689 * 2 ** o * _JI[pc]
E4, Fs4, Gs4, A4, B4, Cs5, Ds5, E5, Fs5, Gs5, A5, B5, Cs6, E6 = 64, 66, 68, 69, 71, 73, 75, 76, 78, 80, 81, 83, 85, 88

# ---- the levels: the whistlers as far under the voice as the module's other music, the partner a little softer; the effects about
# 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LS, LP, FX = 0.030, 0.027, 4.0
LV = [1.0]

# a small, dry room round the table, gone in about half a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry over its held body
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.45)).astype(np.float32))(np.arange(int(0.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.009 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds, its held body), as a room lifts
    some pitches and hollows others, and every note should sound as loud as its neighbours"""
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a time in the film, a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig

# ---- a whistled note. The five whistlers sit left to right across the picture; each breathes in their own way (where the breath
# sits, from lo to hi Hz, and how much of it), and all are tuned alike
SEAT = (-0.56, -0.28, 0.0, 0.28, 0.56)
_AIR = ((640, 1900, 1.0), (580, 1750, 0.85), (700, 2050, 0.95), (610, 1820, 1.1), (660, 1980, 0.9))
_ss = lambda u: (lambda c: c * c * (3 - 2 * c))(np.clip(u, 0, 1))

def _whistle(f0, d, lo, hi, air, dark):
    """one note: the breath before it, the tone held level for d seconds, the breath outlasting it. The tone starts on its pitch and
    stays there: no slide, no scoop, no vibrato. Returns the sound and how long its breath comes before the tone"""
    pre, ta, tr, post = (0.13, 0.075, 0.11, 0.30) if dark else (0.11, 0.055, 0.09, 0.26)
    sec = pre + d + tr + post; n = int(sec * SR); x = np.arange(n) / SR
    env = _ss((x - pre) / ta) * (1 - _ss((x - pre - d) / tr))
    ph = 2 * np.pi * f0 * np.maximum(0.0, x - pre)
    # nearly a pure tone: the second harmonic about 30 dB down (the partner's 26, so a phone's small speaker still hears its note),
    # the third about 40, nothing above
    h2, h3 = (0.05, 0.016) if dark else (0.032, 0.01)
    tone = np.sin(ph) + h2 * np.sin(2 * ph + 0.5)
    if 3 * f0 < 2300:
        tone = tone + h3 * np.sin(3 * ph + 1.2)
    # the breath: swelling in before the tone, falling back to a whisper as the tone catches, and opening a little as the lips let go
    b = filt(noise(sec + 0.05)[:n], 'band', (lo, hi)); b = b / max(1e-9, float(np.sqrt((b ** 2).mean())))
    t1 = pre + d + tr
    before = _ss(x / pre) ** 1.2
    under = 0.3 + 0.7 * np.exp(-np.maximum(0.0, x - pre) / 0.05)
    after = (0.3 + 0.5 * _ss((x - pre - d) / tr)) * np.exp(-np.maximum(0.0, x - t1) / (0.13 if dark else 0.11))
    sig = tone * env + air * np.where(x < pre, before, np.where(x < pre + d, under, after)) * b
    return sig.astype(np.float32), pre

def _note(m, s, d, g, pan, lo, hi, air, dark, room, until):
    """a note whose tone arrives at s; its breath begins a moment before"""
    if until is not None:
        d = min(d, max(0.25, until - s - 0.45))
    sig, pre = _whistle(hz(m), d, lo, hi, air, dark)
    sig = norm(filt(filt(sig, 'low', 2300), 'high', 150))
    sig = _until(_room(sig, room, pre + min(0.25, 0.5 * d), pre + d), s - pre, until)
    put(sig, s - pre, g * LV[0], pan)

def wh(m, s, d=0.7, g=1.0, seat=2, pan=None, room=0.16, until=None):
    """one whistler at the table places one note: m, from seat (0 to 4, left to right), its tone at s, held d seconds"""
    lo, hi, air = _AIR[seat]
    _note(m, s, d, g * LS, SEAT[seat] if pan is None else pan, lo, hi, 0.075 * air, False, room, until)

def low(m, s, d=1.6, g=1.0, pan=-0.14, room=0.16, until=None):
    """the partner: the lower, darker whistler, a little softer (E 4 to E 5)"""
    assert E4 <= m <= E5, 'the partner whistles from E 4 to E 5'
    _note(m, s, d, g * LP, pan, 300, 1150, 0.06, True, room, until)

# ---- what they play
def _seats(k):
    """k whistlers, spread left to right round the table"""
    return {1: (2,), 2: (1, 3), 3: (0, 2, 4), 4: (0, 1, 3, 4), 5: (0, 1, 2, 3, 4)}[k]

def tune(notes, s, step=0.55, g=1.0, last=1.0, hold=None, under=None, pans=None, until=None):
    """a tune passed round the table: each note from the next whistler to the right, step seconds after the one before, held until a
    moment after the next comes in; the last held last seconds. hold: the partner holds the tune's last note under the others, an
    octave lower (or under, a note of its own), for hold seconds"""
    st = _seats(len(notes))
    for i, m in enumerate(notes):
        wh(m, s + i * step, last if i == len(notes) - 1 else step + 0.1, g, st[i], None if pans is None else pans[i], until=until)
    if hold:
        low(notes[-1] - 12 if under is None else under, s + (len(notes) - 1) * step, hold, 0.9 * g, until=until)

def together(notes, s, d=2.2, g=1.0, under=None, until=None):
    """everyone at once: a whistler for each note, left to right from the lowest, placed together (a few hundredths of a second apart,
    as people start together); under: the partner's note below them. Each one softer, so the chord is no louder than a tune"""
    st = _seats(len(notes)); k = 1.3 / np.sqrt(len(notes) + (under is not None))
    if under is not None:
        low(under, s, d + 0.5, g * k, until=until)
    for i, m in enumerate(notes):
        wh(m, s + 0.025 * (i + 1), d, g * k, st[i], until=until)

def mark(each, s, g=1.0, last=2.4, pans=None, until=None):
    """the mark: B 4, E 5, G sharp 5 and B 5 passed round the table at the times in each, one whistler each, left to right (or at
    pans, where each one appears on screen): each one heard. Then, at s, the same four whistled by everyone together over the
    partner's E 4, a fifth below the lowest, held last seconds: the same story for everyone"""
    for i, (m, t) in enumerate(zip((B4, E5, Gs5, B5), each)):
        nxt = each[i + 1] if i < 3 else s
        wh(m, t, max(0.45, min(0.9, nxt - t + 0.1)), 0.9 * g, (0, 1, 3, 4)[i], None if pans is None else pans[i], until=until)
    together((B4, E5, Gs5, B5), s, last, g, under=E4, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def sheet(s, pan=0.0, g=0.0045):
    """a large sheet of paper laid flat on a board: a soft flap, and its edge settling"""
    n = int(0.24 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.26)[:n], 'band', (280, 1400)) * _bump(x, 0.1) * (x < 0.1)
    _fx(fl + 0.45 * _knock(n, 170, 0.014, 0.12) / 1.35, s, g, pan, 1800)
def card(s, pan=0.0, g=0.004):
    """a card set down: a short, soft pat of thick paper"""
    n = int(0.14 * SR); x = np.arange(n) / SR
    pt = filt(noise(0.16)[:n], 'band', (350, 1700)) * _bump(x, 0.05) * (x < 0.05)
    _fx(pt + 0.55 * _knock(n, 160, 0.016, 0.045) / 1.35, s, g, pan, 1900)
def tap(s, pan=0.0, g=0.0032, f=220):
    """something small set down or lit: one soft, short tap (f: its knock, lower for the things that weigh less on the grid)"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, f, 0.012), s, g, pan, 1600)
def pen(s, sec=0.7, pan=0.0, n=3, g=0.004):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * (0.72 + 0.16 * ((i * 7) % 3) / 2); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def slide(s, sec=0.9, pan=0.0, g=0.0032):
    """a block or a card slid along, or a thread drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def tiles(s, sec=1.0, pan=0.0, g=0.0032, band=(300, 1400)):
    """many small things laid out (pages, tiles, lines): one soft texture of paper settling, that swells in and stops, never a burst"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 18); gr = 0.6 + 0.4 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', band) * _bump(x, sec, 0.9) * gr, s, g, pan, 1600)
def dim(s, pan=0.0, g=0.0032):
    """things going grey together: one soft, low settle, like a sheet laid face down"""
    n = int(0.45 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.47)[:n], 'band', (150, 700)) * _bump(x, 0.3, 1.2) * (x < 0.3) + 0.4 * _knock(n, 110, 0.03, 0.25), s, g, pan, 900)

# =============================================================================================================================
# 1. The elms of Hyde Park: the opening, the module's story from outside data. London, 1850: a tune passed round as the park comes in,
#    the partner under its last note; A major for the royal commission. The problem, C sharp minor: the partner alone, a note after
#    each worry, sinking to E as the exhibition is in doubt, gone before "Something had to change", which has nothing under it.
#    Paxton: A major passed round as he sees a way to answer every worry; the pen as the sketch draws itself; one soft texture for
#    the same few parts; the newspaper, and A major whistled together as it's shown to everyone at once. B major as the design is
#    accepted; a tune that rises with the arch over the elms; E major together as the hall opens. Each worry's answer, a whistler
#    each, and everyone together for the same picture: the mark. The university: B major as the picture turns to data; C sharp minor,
#    the partner alone, for the loudest voices; the mark again, at each of the data manager's words, and everyone together for the
#    same story; E major, open, under the title card
LV[0] = 1.0
ow = lambda lid, word, off=0: W('elms', lid, word, off)
oc = lambda lid, off=0: G('elms', lid, off)
OEND = E('elms')
tune((B4, Cs5, E5), 0.5, step=0.6, last=1.4, hold=2.4)
card(oc('london', 0.1), px(380))
card(ow('commission', 'royal', -0.2), px(1540))
tune((Cs5, E5), END('elms', 'commission', 0.15), step=0.55, last=1.2, hold=2.0, under=A4)
# 245 designs turned down; the committee's own hall of brick, drawn: a low rub as it's laid
card(ow('designs', 'turned', -0.2), px(380))
tiles(ow('designs', 'drawn', -0.2), 2.4, px(960), 0.0028, (150, 700))
tune((E5, Cs5, B4), ow('designs', 'drawn', 0.2), step=0.6, last=1.6, hold=2.4, under=E4)
# the problem: mocked, and every worry in turn; the partner alone, C sharp minor, sinking to E; nothing under "Something had to change"
tap(ow('mocked', 'mocked', -0.3), px(960))
low(Gs4, END('elms', 'mocked', 0.1), 1.3, 0.9)
card(ow('stake', 'stake', -0.3), px(380))
low(Cs5, END('elms', 'stake', 0.1), 1.4, 0.9)
card(oc('trees', 0.1), px(380))
low(B4, END('elms', 'trees', 0.1), 1.2, 0.85)
card(oc('times', 0.1), px(1540))
low(A4, END('elms', 'times', 0.1), 1.2, 0.85)
card(oc('bricks', 0.1), px(380))
low(Gs4, END('elms', 'bricks', 0.1), 1.3, 0.85)
card(oc('doubt', 0.1), px(1540))
low(E4, END('elms', 'doubt', 0.1), 1.0, 0.8, until=oc('change', -0.3))
# Joseph Paxton, a gardener who built glasshouses: his sheet, the glasshouse drawing itself, and A major passed round
sheet(ow('paxton', 'gardener', -0.2), px(500))
pen(ow('paxton', 'glasshouses', -0.2), 1.8, px(500), 3)
tune((Cs5, E5, A5), END('elms', 'paxton', 0.1), step=0.55, last=1.4, hold=2.2)
# the sketch on blotting paper, drawing itself; the same few parts, laid one after another
sheet(ow('sketch', 'eleventh', -0.2), px(550))
pen(ow('sketch', 'sketched', -0.2), 3.4, px(550), 4)
tune((E5, Gs5, Fs5), ow('sketch', 'sketched', 0.3), step=0.7, last=1.6, hold=2.4, under=B4)
card(oc('parts', 0.1), px(600))
tiles(ow('parts', 'same', -0.3), 1.8, px(600))
tune((A5, Fs5, E5), END('elms', 'parts', 0.1), step=0.55, last=1.4, hold=2.2)
# the newspaper's page, then twelve copies of it: one soft texture of paper, and A major whistled together, shown to everyone at once
sheet(oc('showed', 0.1), px(570))
tiles(ow('showed', 'whole', -0.2), 1.6, px(560), 0.003, (350, 1500))
together((Cs5, E5, A5), ow('showed', 'whole', 0.0), 2.0, 0.9, under=A4)
# the park again: the hall of iron and glass drawn, accepted (B major passed round), on one condition; the elms outlined in green
tiles(oc('accepted', 0.2), 2.4, px(960), 0.0026, (450, 1700))
tap(ow('accepted', 'accepted', -0.3), px(380))
tune((Ds5, Fs5, B5), ow('accepted', 'accepted', 0.1), step=0.5, last=1.2, hold=2.0)
card(ow('accepted', 'condition', -0.2), px(1540))
tap(ow('accepted', 'three', -0.2), px(960))
# the arch rising over the elms: a tune that rises with it, the partner under its last note
tune((E5, Fs5, Gs5, B5), ow('arch', 'arched', -0.4), step=0.6, last=1.6, hold=2.4)
# opened on 1 May 1851: E major whistled together as the crowd comes in under the glass
card(ow('opened', 'months', -0.3), px(380))
together((E5, Gs5, B5), ow('opened', 'first', -0.2), 2.2, 0.9, under=E4)
card(ow('visits', 'six million', -0.4), px(1540))
tune((Gs5, Fs5, B5), END('elms', 'visits', 0.1), step=0.55, last=1.6, hold=2.2)
card(ow('surplus', 'surplus', -0.2), px(380))
# each worry had an answer: the mark, a whistler for each answer as it appears, where it appears, then everyone together over the
# partner as the same picture comes in (the small newspaper page, a card)
_a0 = ow('answer', 'answer', -0.3)
mark([_a0 + 0.3 + 0.3 * i for i in range(4)], ow('answer', 'same picture', -0.2), 1.0, 2.4, pans=[px(x) for x in (380, 1540, 380, 1540)])
card(ow('answer', 'same picture', -0.4), px(960))
# a year from now, a university: its stakeholders, and B major passed round as the picture turns to data
sheet(ow('data', 'stakeholders', -0.3), px(960))
tune((B4, Ds5, Fs5), ow('data', 'stakeholders', 0.1), step=0.55, last=1.4, hold=2.2, under=Fs4)
tap(ow('uni', 'says yes', -0.2), px(960))
tiles(ow('uni', 'fourteen', -0.2), 1.6, px(960), 0.0028, (300, 1300))
tune((Gs5, E5, Fs5, B4), ow('uni', 'fourteen', 0.2), step=0.5, last=1.4, hold=2.0, under=E4, pans=[px(x) for x in (1170, 1060, 860, 750)])
# listen only to the loudest: C sharp minor, the partner alone, as the loud ones swell and HR's reports land in payroll's weeks
low(Cs5, ow('loud', 'loudest', 0.0), 1.2, 0.85)
tap(ow('loud', "HR's", -0.2), px(960))
low(Gs4, END('elms', 'loud', 0.1), 1.2, 0.8)
# so its data manager asks each one, in their own words, and tells everyone the same story: the mark, a whistler at each of her
# words, then everyone together as the same small page goes to each
mark([ow('asks', w_) for w_ in ('each one', 'need', 'own words', 'everyone')], ow('asks', 'same story', 0.0), 0.95, 2.2,
     pans=[px(x) for x in (760, 880, 1040, 1160)])
tap(ow('moves', 'plan', -0.2), px(960))
# the title card: E major, open, held, gone as the next chapter comes in
tune((B4, E5), oc('breath', 0.3), step=0.6, last=2.6, hold=3.2, until=OEND)

# 2. Everyone it touches: the chapter turns on A major as the council says yes. The 38 reports laid out, the 21 slid to the platform,
#    the 17 going grey together. Helena's list, a pen's stroke as each group of names is written; B major passed round for the
#    fourteen. The grid's axes drawn and its two questions; a soft tap as each of the fourteen is placed, lower for those with less
#    power to shape the plan. The quiet ones ringed and asked too: C sharp minor turning to E, the partner under it
LV[0] = 0.9
mw = lambda lid, word, off=0: W('map', lid, word, off)
mc = lambda lid, off=0: G('map', lid, off)
sheet(mc('may', 0.1), px(960))
tune((E5, A5), S0('map') + 0.3, step=0.6, last=1.4, hold=2.2)
tap(mw('may', 'old warehouse', -0.2), px(960))
tiles(mc('reports', 0.1), 1.4, px(960))
slide(mw('reports', 'move', -0.2), 1.4, px(1300))
dim(mw('reports', 'seventeen', -0.1), px(600))
sheet(mw('list', 'starts a list', -0.2), px(550))
for lid, word in (('first', 'first names'), ('more', 'uses'), ('more', 'makes'), ('more', 'pays'), ('more', 'decides'), ('more', 'whose')):
    pen(mw(lid, word, -0.1), 0.45, px(550), 1)
card(mw('more', 'keeps going', -0.2), px(1230))
tap(mc('fourteen', 0.1), px(550))
tune((Fs5, Ds5, B5), END('map', 'fourteen', 0.1), step=0.5, last=1.4, hold=2.0)
slide(mc('grid', 0.3), 0.8, px(960))
tap(mw('grid', 'shape', -0.3), px(150))
tap(mw('grid', 'touch', -0.3), px(960))
card(mw('mendelow', 'power', -0.3), px(400))
# the fourteen, in the order the picture places them (src/et_scenes.js, S14), each where it sits on the grid (src/et_uni.js, ET_FOURTEEN)
_S14 = [('both', 'deputy', -0.2), ('both', 'director', -0.2), ('fin', 'Finance', -0.2), ('fin', 'HR', -0.2), ('deans', 'deans', -0.3),
        ('deans', 'IT', -0.2), ('near', "registrar's", -0.2), ('near', 'Planning', -0.2), ('team', 'team', -0.2), ('near', 'Facilities', -0.2),
        ('near', 'data partners', -0.2), ('near', 'two hundred and sixty', -0.3), ('quiet', 'staff', -0.2), ('quiet', 'students', -0.2)]
_AT = [(0.80, 0.94), (0.62, 0.82), (0.90, 0.70), (0.74, 0.66), (0.18, 0.84), (0.34, 0.68), (0.60, 0.40), (0.86, 0.44), (0.95, 0.58),
       (0.52, 0.26), (0.76, 0.28), (0.62, 0.12), (0.16, 0.20), (0.30, 0.10)]
for (lid, word, off), (xi, yp) in zip(_S14, _AT):
    tap(mw(lid, word, off), px(190 + 1580 * xi), 0.0028, 160 + 100 * yp)
tune((Cs5, Gs5, E5), mw('asked', 'asked too', 0.0), step=0.55, last=1.4, hold=2.4, until=E('map'))

# 3. In their own words: the same question, an open fifth passed between two whistlers and left unanswered; a pen as she writes. Each
#    answer a card, and one whistler's note after it, from that person's side of the table: E, G sharp, B, then the staff's question
#    on C sharp. Each answer beside each name on her map, a pen's stroke for each row, and E major passed round, the partner under it.
#    Who speaks to whom, a tap as each row comes in; one voice for each: a single whistler, held
LV[0] = 0.9
ww = lambda lid, word, off=0: W('words', lid, word, off)
wc = lambda lid, off=0: G('words', lid, off)
sheet(wc('want', 0.2), px(570))
tune((B4, Fs5), END('words', 'want', 0.1), step=0.6, last=1.2)
pen(ww('writes', 'their words', -0.2), 0.8, px(570), 2)
for lid, word, x, m in (('david', 'One', 500, E5), ('rohan', 'Month-end', 1420, Gs5), ('ingrid', 'Every', 500, B5), ('reps', 'Who', 1420, Cs5)):
    card(ww(lid, word, -0.2), px(x))
    wh(m, END('words', lid, 0.1), 1.1, 0.85, 0 if x < 960 else 4, px(x))
card(ww('team', 'Time', -0.2), px(960))
sheet(wc('judge', 0.1), px(960))
pen(ww('judge', 'map', -0.8), 1.6, px(700), 5)
tune((Gs5, B5, E6), END('words', 'judge', 0.1), step=0.5, last=1.4, hold=2.2)
sheet(wc('often', 0.2), px(710))
for lid, word in (('speak', 'deputy'), ('speak', 'data partner'), ('speak', 'Noor'), ('yusuf', 'Yusuf')):
    tap(ww(lid, word, -0.2), px(710))
wh(E5, ww('one', 'One person', 0.1), 1.8, 0.9, 2)
card(ww('teachers', 'Teachers', -0.3), px(520))

# 4. One page, every month: the page laid down, and a falling third to E, the partner under it. Its four parts, a tap each; the line
#    for each of the fourteen, one soft texture; the same story for everyone: the mark, a whistler as the same small page reaches the
#    lines, then everyone together once it has reached them all. The first page's pill, the measures page and its thread; bad news, a
#    tap, and C sharp minor, a whistler's C sharp over the partner's G sharp, gone as the chapter ends
LV[0] = 0.9
pw = lambda lid, word, off=0: W('page', lid, word, off)
pc = lambda lid, off=0: G('page', lid, off)
sheet(pw('same', 'same page', -0.2), px(580))
tune((Gs5, E5), END('page', 'same', 0.1), step=0.6, last=1.4, hold=2.0)
for word in ('Where', 'measures', 'risks', 'decisions'):
    tap(pw('holds', word, -0.2), px(580))
sheet(pc('lines', 0.1), px(1390))
tiles(pw('lines', 'short line', -0.2), 2.4, px(1390))
_s0 = pw('nobody', 'same story', -0.3)
mark([_s0 + 0.1 + 0.42 * i for i in range(4)], _s0 + 1.9, 0.95, 2.2, pans=[px(1700)] * 4)
tap(pw('first', 'Monday', -0.2), px(1390))
card(pw('link', 'links', -0.3), px(1430))
slide(pw('link', 'links', -0.1), 0.8, px(1020))
tiles(pw('link', 'links', 0.3), 1.4, px(1430))
tap(pw('bad', 'bad news', -0.2), px(580))
tune((Cs5,), END('page', 'bad', 0.15), last=1.6, hold=1.8, under=Gs4, until=E('page'))

# 5. A real constraint: the chapter turns on A major in HR's office. HR's reports on the timeline, the year's end and payroll's
#    weeks; July with no room for a surprise: C sharp minor, a whistler's E over the partner's C sharp. The plan changes: the block
#    slides to August, and the opening's first tune comes back, once payroll's year is done. The June page and its decision; the July
#    page, agreed. In Hyde Park the roof rose over the elms: the opening's rising tune, as the arch rises again; and here the block
#    slides on, round payroll's weeks
LV[0] = 0.9
jw = lambda lid, word, off=0: W('june', lid, word, off)
jc = lambda lid, off=0: G('june', lid, off)
sheet(jc('wed', 0.2), px(960))
tune((E5, Cs5), S0('june') + 0.4, step=0.6, last=1.4, hold=2.0, under=A4)
tap(jw('july', 'July', -0.2), px(760))
tap(jw('payroll', 'thirtieth', -0.3), px(1100))
slide(jw('payroll', 'last returns', -0.3), 0.8, px(1200))
tap(jw('worst', 'least', -0.3), px(960))
tune((E5,), END('june', 'worst', 0.1), last=1.4, hold=1.8, under=Cs5)
tap(jw('real', 'fact', -0.3), px(960))
slide(jw('change', 'August', -0.4), 1.4, px(1000))
tune((B4, Cs5, E5), END('june', 'change', 0.1), step=0.55, last=1.4, hold=2.2)
tap(jw('page', 'decisions needed', -0.2), px(580))
sheet(jw('council', 'July page', -0.2), px(580))
tap(jw('council', 'agrees', -0.3), px(1220))
tune((E5, Fs5, Gs5, B5), jw('elms', 'roof', -0.2), step=0.6, last=1.6, hold=2.4)
slide(jw('elms', 'moved', -0.4), 1.4, px(1000))

# 6. Heard: not everyone hears yes, C sharp minor falling, the partner's G sharp under its last note. Clara's forecast waits its turn;
#    the old extract left behind. Every month they see the plan move: the seven pages, one soft texture, and a tune that climbs with
#    them. In 1850, each answer again, a tap each, and A major whistled together for the same picture, as when the paper showed it to
#    everyone. The same small page by each of the fourteen; On Monday, a stroke for each line; Next. The takeaway: the mark, a
#    whistler at each of its first words, and everyone together over the partner on "the same story", held into the end card; then
#    E major, open, held to the end
LV[0] = 0.9
hw = lambda lid, word, off=0: W('heard', lid, word, off)
hc = lambda lid, off=0: G('heard', lid, off)
sheet(hc('yes', 0.1), px(540))
tune((Gs5, E5, Cs5), END('heard', 'yes', 0.1), step=0.55, last=1.2, hold=1.8, under=Gs4)
card(hw('clara', 'forecast', -0.2), px(1420))
tap(hw('clara', 'reason', -0.2), px(1420))
sheet(hc('seen', 0.0), px(490))
dim(hw('seen', 'left behind', -0.3), px(490))
tiles(hw('stay', 'every month', -0.3), 2.4, px(860))
tune((Cs5, E5, Fs5, Gs5), hw('stay', 'every month', 0.0), step=0.6, last=1.4, hold=2.0)
sheet(hc('ldp', 0.1), px(960))
for i, x in enumerate((380, 1540, 380, 1540)):
    tap(hw('paxton', 'answered', -0.2) + 0.3 * i, px(x))
card(hw('paxton', 'same picture', -0.4), px(960))
together((Cs5, E5, A5), hw('paxton', 'same picture', -0.1), 2.0, 0.85, under=A4)
tiles(hw('uni', 'same page', -0.3), 2.0, px(960))
sheet(hc('monday', 0.1), px(960))
for t in (hw('monday', 'list', -0.2), hw('monday', 'ask', -0.2), hc('monday2', 0.1), hw('monday2', 'send', -0.2), hc('monday3', 0.1)):
    pen(t, 0.4, px(960), 1)
card(hw('next', 'Next', -0.1), px(960))
mark([hw('take', w_) for w_ in ('Know', 'each person', 'needs', 'data')], hw('take', 'same story', 0.0), 0.95, 3.0)
together((E5, B5), hc('breath', 0.7), 3.6, 0.8, under=E4, until=TOT)
