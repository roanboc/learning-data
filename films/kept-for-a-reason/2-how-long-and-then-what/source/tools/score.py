# How long, and then what: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, checked on 5 November 2026 against every score.py on main and on every branch, and against
# the module's palettes list (/mnt/project-files/data-protection/palettes.md, where this film's thread set it down): tuned steel
# drawers and a euphonium, both made here (music.py has neither).
#  - The tuned drawers lead: a 1940s office filing cabinet's steel drawers, each tuned to its own note, struck softly with a felt
#    mallet and damped by hand. A short, round, hollow note with a box's warmth under it: the steel's own tone and a few faint,
#    inharmonic ones above it, which die fast, and the drawer's hollow, a low, short body note. The opening's own office is the
#    instrument. A drawer damped by hand stops with a small touch; one left alone rings on.
#  - The mark: a short phrase in which each note is damped at its own set time, and the last is left to ring: each record ends at its
#    date, and the few kept for good ring on. It plays twice, as the drawers empty in 1944 (F major) and as the few folders go to the
#    Archives at the close (B-flat major, other notes), so no figure is played again.
#  - The euphonium, soft, one voice, no vibrato: the few long notes held under the opening, under "Something has to change", and at
#    the end. One voice at a time, so nothing beats.
#  - Keys: D minor under the flood; F major from the law to the university; B-flat major at the university, G minor where a record is
#    kept too long or lost too soon. Every chord is tuned pure (just intonation from D, see hz()).
# The rules the module keeps (its briefs, 5 November 2026):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato. No urgent pulse: nothing in this film is a breach or a
#    rush (film.json's "urgent" is empty).
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen (eight dates, six
#    floors) is one soft sound, never one for each.
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
R1 = np.random.default_rng(1943)  # this film's own randomness: the room, the mallet, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D minor (D F A),
# F major (F A C), B-flat major (B-flat D F), E-flat major (E-flat G B-flat), G minor (G B-flat D) and A major (A C sharp E) are all pure
# in this table; C with G is not (40/27), so no C major or C minor chord, and C sounds only with F, A or E
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the drawers' notes, and the euphonium's
D3, Eb3, F3, G3, A3, Bb3, C4, Cs4, D4, Eb4, E4, F4, G4, A4, Bb4 = 50, 51, 53, 55, 57, 58, 60, 61, 62, 63, 64, 65, 67, 69, 70
F2, G2, A2, Bb2, C3, D2 = 41, 43, 45, 46, 48, 38

# ---- the levels, set so the music's loud moments sit about -28 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the euphonium a little under the drawers; the effects about 16 dB
# under the music (FX scales them all)
DL, EL, FX = 0.070, 0.040, 1.4

# a room round the players: the office at night, small and quiet, ringing on for about a second, nothing much above 1.8 kHz. Its level
# is set by what it rings where the notes are (its gain under 1.5 kHz is one), so a held note keeps its level (held.py)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.12 * SR), max(int(0.12 * SR) + 1, len(s) - int(0.2 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- a tuned steel drawer, struck softly with a felt mallet. The steel's first tone rings on and fades (a low drawer longer); a few
# faint, inharmonic tones above it, as a thin steel box has, die fast. Under it, the drawer's hollow: a low, short body note, the same
# for every drawer, the box's warmth. The felt mallet's touch: a soft, low thump, its top rolled off. damp: when a hand stops it (a
# small touch, and the note gone in a twentieth of a second); without it, the note rings on
def drawer(m, s, g=1.0, pan=0.0, damp=None, ring=None, room=0.3):
    f = hz(m); ring = ring or 0.75 + 0.55 * max(0.0, min(1.0, (300 - f) / 150))
    sec = min(4.2, ring * 3.6) if damp is None else min(4.2, damp + 0.3)
    x = tt(sec).astype(np.float64)
    sig = np.sin(2 * np.pi * f * x) * np.exp(-x / ring)
    for r, a, d in ((2.32, 0.15, 0.28), (3.87, 0.055, 0.15), (5.12, 0.02, 0.09)):
        if f * r < 2300:
            sig = sig + a * np.sin(2 * np.pi * f * r * x + 0.7 * r) * np.exp(-x / (ring * d))
    sig = sig + 0.22 * np.sin(2 * np.pi * 118 * x + 0.3) * np.exp(-x / 0.07)
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.009)) ** 2
    nt = int(0.035 * SR); th = filt(noise(0.035)[:nt], 'band', (120, 800)) * np.exp(-np.arange(nt) / SR / 0.007) * 0.12
    sig[:nt] += th
    if damp is not None:
        sig = sig * np.where(x > damp, np.exp(-(x - damp) / 0.045), 1.0)
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.12) / 0.12, 0, 1)) ** 2
    put(_held(filt(sig.astype(np.float32), 'low', 2300), room), s, g * DL, pan)
    if damp is not None:
        s_knock(s + damp, g * 0.004 * FX, pan, 210)  # the hand's touch
def roll(notes, s, step=0.12, g=1.0, pan=0.0, ring=None, spread=0.25, damp=None):
    """drawers struck one after another, the lowest first, ringing on together as a chord"""
    k = len(notes)
    for i, m in enumerate(notes):
        drawer(m, s + step * i, g * (1.0 if i == 0 else 0.84) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5), damp=damp, ring=ring)
def mark(notes, s, step=0.42, g=1.0, pan=0.0):
    """the mark: each note damped at its own set time, and the last left to ring (notes: (note, damp), damp None to ring)"""
    for i, (m, d) in enumerate(notes):
        drawer(m, s + step * i, g * (0.9 if d is not None else 1.0), pan + 0.12 * (i - len(notes) / 2), damp=d, ring=None if d is not None else 1.6)

# ---- the euphonium: a conical brass bore, so every harmonic sounds, the lower ones strongest; mellow, its body near 450 Hz and
# nothing above 1.6 kHz at this level. The higher harmonics speak a moment after the first; a faint breath as the note starts. Held
# steady, with no vibrato; a note of 1.2 s or more swells a little and eases, once
def euph(m, a, b, g=1.0, att=0.22, rel=0.7, pan=0.08, room=0.3):
    f = hz(m); sec = max(0.4, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(1600 // f) + 1):
        fk = f * k
        w = np.exp(-(k - 1) * 0.5) * (1 + 0.6 * np.exp(-((fk - 450) / 220) ** 2)) * np.exp(-max(0.0, fk - 900) / 380)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.1 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.0 + 0.5 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.31 * k)
    if sec >= 1.2:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    br = filt(noise(n / SR + 0.01)[:n], 'band', (200, 1000)) * 0.004 * (np.where(x < sec, 1.0, np.exp(-(x - sec) * 20)) + 2.0 * np.exp(-x / 0.08))
    put(_held(filt((s + br).astype(np.float32), 'low', 1600), room), a, g * EL, pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap"""
    s_tap(s, g * FX, pan)
def typekey(s, g=0.010, pan=0.0):
    """a typewriter's key, heard softly: the type bar's dull strike on the platen and its small clack, its top rolled off"""
    s_tap(s, g * FX, pan); s_knock(s + 0.004, g * 0.6 * FX, pan, 520)
def typed(s, n, g=0.010, pan=0.0, step=0.12):
    for i in range(n):
        typekey(s + i * step + 0.02 * R1.uniform(), g if i < 2 else g * 0.7, pan)
def glasstap(s, g=0.008, pan=0.0):
    """a card or a pill settling on glass: a small, pure tick, low for glass"""
    x = tt(0.09); X((np.sin(2 * np.pi * 1480 * x) * np.exp(-x / 0.018) * 0.6 + filt(noise(0.09), 'band', (600, 2000))[:len(x)] * np.exp(-x / 0.006)).astype(np.float32), s, g * FX, pan)
def paper(s, g=0.011, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def flick(s, g=0.010, pan=0.0):
    """a page turned over: short and light"""
    paper(s, g, pan, 0.22)
def slide(s, g=0.010, pan=0.0, sec=0.45, shut=True):
    """a steel drawer on its runners, and, as it shuts, its low stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (110, 700))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2, s, g * FX, pan)
    if shut:
        s_knock(s + sec * 0.92, g * 0.9 * FX, pan, 110)
def boxdown(s, g=0.012, pan=0.0):
    """a box of papers set down on a cabinet: a dull, low knock and a rustle"""
    s_knock(s, g * FX, pan, 150); paper(s + 0.01, g * 0.45, pan, 0.18)
def stamp(s, g=0.018, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def freight(s, g=0.010, pan=0.3):
    """a freight car's door rolled shut, far off: a low rumble along its track, and a dull stop"""
    sec = 1.5; x = tt(sec); X(filt(noise(sec), 'band', (50, 260))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 1.5, s, g * FX, pan)
    s_knock(s + sec * 0.95, g * 0.8 * FX, pan, 80)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def strike(s, g=0.009, pan=0.0, sec=0.4):
    """words struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def pen(s, sec=0.7, g=0.007, pan=0.0):
    """a pen signing: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)

# =============================================================================================================================
# 1. A flood of paper: the opening, with music all through it, D minor. Washington at night: the euphonium's low D, and the drawers'
#    D minor, struck softly. The labels typed as each kind of paper is named. "They fill steel cabinets": the payrolls' drawer slides
#    open, and a drawer's note for each of the four drawers a cabinet holds; boxes set down; "then floors": one soft roll as the floors
#    fill. The flood: the euphonium on A, and G minor's drawers as the Archives' building fills. Eight drawers in ten of no lasting
#    value: three notes, each damped short. The list goes to Congress: a sheet across the air, a card. A new pile, a new list: two
#    keys. Simply kept: the office, D minor low and slow; rent, staff and steel: three knocks. The offices close: a freight car's door,
#    far off, and G minor. Two papers someone will need: two drawers rising, F and A; lost with the rest: a low D, damped. "Something
#    has to change": A major, and the euphonium on A, waiting for the law
F_ = lambda lid, word, off=0: W('flood', lid, word, off)
f0 = S0('flood')
euph(D2, f0 + 0.5, F_('war', 'office', -0.3), 0.7, att=1.4, rel=1.6)
roll((D3, F3, A3), f0 + 0.7, 0.16, 0.75, ring=1.4)
for i, w_ in enumerate(('orders', 'contracts', 'payrolls', 'letters')):
    typed(F_('war', w_, -0.1), 2, 0.009, px((576, 960, 1344, 1728)[i]))
tCab = G('flood', 'cabinets')
slide(tCab - 0.3, 0.010, px(1344), 0.6, shut=False)
for i, m in enumerate((D3, F3, A3, D4)):
    drawer(m, F_('cabinets', 'four', 0.05) + 0.2 * i, 0.55, px(1344), damp=0.5 if i < 3 else None, ring=1.0)
slide(F_('cabinets', 'rooms', -0.3), 0.010, px(1344), 0.5)
boxdown(F_('cabinets', 'rooms', 0.25), 0.012, px(960)); boxdown(F_('cabinets', 'rooms', 0.85), 0.011, px(1344))
roll((A3, D4, F4), F_('cabinets', 'floors', 0.4), 0.3, 0.55, ring=1.2)
tFl = F_('flood', 'flood')
euph(A2, tFl - 0.1, F_('eighty', 'most', -0.4), 0.65, att=0.8, rel=1.2)
roll((G3, Bb3, D4), F_('flood', 'every year', 0.0), 0.2, 0.55, ring=1.5)
knock(F_('flood', 'building', 0.0), 0.012, px(1360), 230)
for i, m in enumerate((F4, D4, A3)):
    drawer(m, F_('eighty', 'eighty', 0.05) + 0.3 * i, 0.5, px(400 + 300 * i), damp=0.32, ring=0.9)
knock(F_('eighty', 'eighty', 0.4), 0.012, px(560), 240)
paper(F_('list', 'destroyed', 0.0), 0.010, px(420), 0.45)
air(F_('list', 'list', 0.0), 1.6, 0.008, px(800), 180, 900)
knock(F_('list', 'Congress', 0.05), 0.012, px(1470), 240)
paper(F_('again', 'every new pile', 0.0), 0.010, px(420), 0.5)
typed(F_('again', 'new list', 0.1), 2, 0.009, px(410))
tK = F_('kept', 'simply', -1.6)
roll((D3, A3, D4), tK + 0.3, 0.22, 0.5, ring=1.8)
knock(F_('kept', 'nobody', 0.05), 0.012, px(1060), 240)
for i, w_ in enumerate(('rent', 'staff', 'steel')):
    knock(F_('cost', w_, 0.05), 0.010, px((700, 900, 1110)[i]), (260, 240, 200)[i])
tCl = F_('close', 'close', -0.6)
freight(tCl + 0.2, 0.010, px(1500))
roll((G3, Bb3, D4, G4), tCl + 0.5, 0.16, 0.55, ring=1.6)
knock(F_('close', 'valuable', 0.25), 0.012, px(1440), 240)
drawer(F3, F_('proof', 'prove a claim', 0.1), 0.55, px(640), ring=1.1)
drawer(A3, F_('proof', 'their service', 0.1), 0.55, px(980), ring=1.1)
drawer(D3, G('flood', 'proof') + _DUR['flood/proof'] + 0.8, 0.6, px(640), damp=0.45)
tCh = G('flood', 'change')
euph(A2, tCh - 0.3, E('flood') + 0.6, 0.75, att=0.6, rel=1.4)
roll((A3, Cs4, E4), tCh + 0.1, 0.16, 0.65, ring=1.8)

# 2. Decided once, before: the opening goes on, F major. The law signed: F major, and the euphonium's low F under the desk. The
#    Archives and Congress: two cards. The page turns to a schedule: "how long" and "then", a drawer each. The Archivist's stamp and
#    Congress's, then B-flat to F. At the cabinets: the label typed before its papers, the drawer open, the folder not yet written
#    sliding in on a breath of air; the drawer filled and shut, F. The claim: D minor, the claim's band, held under the euphonium's low
#    D. No paper any other way: a card. The savings: the drawers open and empty, the mark in F major, each note damped at its time and
#    the last left to ring; each emptied drawer shut. The Archives today: three drawers rising, F, A, C, as three folders climb the
#    steps; the family's page and the service record: D minor to F, softly. The university: B-flat major, the euphonium's B-flat; no
#    end date: G minor; one shelf becomes a drawer: its note and a glass tap. The title: B-flat major, the euphonium's B-flat ringing
#    out
B_ = lambda lid, word, off=0: W('before', lid, word, off)
b0 = S0('before')
roll((F3, A3, C4, F4), b0 + 0.4, 0.15, 0.7, ring=1.8)
euph(F2, b0 + 0.6, B_('once', 'schedule', -0.2), 0.6, att=1.0, rel=1.4)
knock(B_('law', 'drafted', 0.05), 0.012, px(280), 240); knock(B_('law', 'committee', 0.05), 0.012, px(1640), 240)
flick(B_('once', 'schedule', 0.1), 0.011, px(960))
drawer(A3, B_('kind', 'how long', 0.05), 0.45, px(1000), ring=0.9)
drawer(C4, B_('kind', 'then', 0.05), 0.45, px(1100), ring=0.9)
stamp(B_('approve', 'Archivist', 0.1), 0.018, px(1000)); stamp(B_('approve', 'Congress', 0.1), 0.018, px(940))
roll((Bb3, D4, F4), B_('approve', 'Congress', 0.5), 0.14, 0.5, ring=1.2)
tLb = B_('approve', 'written')
typed(tLb, 4, 0.009, px(1344), 0.24)
slide(tLb + 1.2, 0.009, px(1344), 0.5, shut=False)
air(tLb + 1.4, 1.4, 0.007, px(1344), 200, 900)
paper(B_('pile', 'pile', 0.0), 0.010, px(1344), 0.5)
slide(B_('pile', 'pile', 1.2), 0.010, px(1344), 0.5)
drawer(F3, B_('pile', 'pile', 1.65), 0.5, px(1344), ring=1.0)
tBd = B_('claim', 'stay until')
knock(tBd + 0.05, 0.012, px(960), 160)
roll((D3, F3, A3), tBd + 0.1, 0.16, 0.5, ring=1.6)
euph(D2, tBd + 0.2, tBd + 2.8, 0.55, att=0.6, rel=1.2)
knock(B_('other', 'destroyed', 0.05), 0.012, px(1460), 240)
tOp = G('before', 'saved')
slide(tOp, 0.009, px(960), 0.6, shut=False)
mark(((C4, 0.38), (A3, 0.55), (F3, 0.8), (F4, None)), tOp + 1.9, 0.42, 0.75, px(960))
slide(tOp + 2.7, 0.009, px(576), 0.5); slide(tOp + 4.5, 0.009, px(1728), 0.5)
knock(B_('saved', 'saves', 0.05), 0.012, px(1480), 240)
knock(B_('budget', 'budget', 0.05), 0.010, px(1400), 260)
tSt = G('before', 'today', -0.4)
for i, m in enumerate((F3, A3, C4)):
    drawer(m, tSt + 0.8 + 0.7 * i + 1.3, 0.45, px(960), ring=1.0)
knock(B_('today', 'kept for good', 0.05), 0.012, px(1480), 240)
roll((D3, F3, A3, D4), G('before', 'family', -0.1), 0.2, 0.45, ring=1.6)
tU = G('before', 'uni', -0.3)
euph(Bb2, tU + 0.3, B_('uni', 'no end date', 0.4), 0.55, att=0.9, rel=1.2)
roll((Bb3, D4, F4), tU + 0.4, 0.16, 0.5, ring=1.4)
knock(B_('uni', 'no end date', 0.05), 0.012, px(960), 180)
drawer(G3, B_('uni', 'no end date', 0.2), 0.45, px(960), ring=1.1)
glasstap(B_('end', 'end date', 0.1), 0.008, px(960))
drawer(F3, B_('end', 'end date', 0.2), 0.45, px(960), ring=1.1)
tT = G('before', 'breath', 0.2)
roll((Bb3, D4, F4, Bb4), tT, 0.18, 0.7, ring=2.2)
euph(Bb2, tT + 0.2, E('before') + 0.4, 0.6, att=1.0, rel=1.8)

# 3. Three lives of a record: the university, B-flat major, music only at its turns. October 2026: a glass tap as the place's name
#    comes in. The tags: two glass taps. "But a record has three lives": three drawers rising, F, B-flat, D, as the three panes stand.
#    Archived, kept cold: a low drawer, damped soon. Deleted at its end date: a drawer damped as the old record goes. Kept for good: a
#    drawer left to ring, B-flat, as the degrees rise. A year a person's details could leak: G minor, softly. A record the law needs,
#    gone too soon: a low G, damped
L_ = lambda lid, word, off=0: W('lives', lid, word, off)
glasstap(S0('lives') + 0.5, 0.007, px(240))
glasstap(L_('pay', 'Pay records', 0.2), 0.007, px(1300)); glasstap(L_('pay', 'applications', 0.2), 0.007, px(1300))
knock(L_('never', 'Nothing', 0.05), 0.011, px(960), 180)
for i, m in enumerate((F3, Bb3, D4)):
    drawer(m, L_('three', 'three lives', 0.1) + 0.24 * i, 0.5, px(605 + 360 * i), ring=1.0)
drawer(D3, L_('archived', 'archived', 0.1), 0.45, px(965), damp=0.5)
drawer(F3, L_('deleted', 'deleted', 0.35), 0.45, px(1325), damp=0.35)
drawer(Bb3, L_('good', 'kept for good', 0.05), 0.5, px(965), ring=1.7)
roll((G3, Bb3, D4), L_('year', 'leak', 0.05), 0.2, 0.45, ring=1.3)
drawer(G3, L_('plan', 'the law', 0.6), 0.5, px(1385), damp=0.4)

# 4. One schedule, by kind of record: Washington's lists, one after another: four sheets laid down. One schedule: E-flat major to
#    B-flat as the table comes in. The owners' names: glass taps. The rows: a key each as they come in. A reason for each length: the
#    green reasons glow, one soft chord. Signed: a pen, and B-flat major left to ring. The first clean-up: three drawers, each damped
#    as its year's shelf empties; old applications go on a breath of air
S_ = lambda lid, word, off=0: W('schedule', lid, word, off)
s0 = S0('schedule')
for i in range(4):
    paper(s0 + 0.3 + 0.7 * i, 0.009, px(710 + 170 * i), 0.35)
tOne = S_('one', 'one schedule')
roll((Eb3, G3, Bb3), tOne + 0.1, 0.16, 0.5, ring=1.3)
drawer(Bb3, tOne + 0.75, 0.45, px(960), ring=1.2)
typed(tOne + 0.2, 3, 0.008, px(400))
glasstap(S_('owners', 'Ingrid', 0.05), 0.007, px(700)); glasstap(S_('owners', 'Mei Tanaka', 0.05), 0.007, px(700))
knock(S_('owners', 'Yusuf keeps', 0.1), 0.010, px(400), 260)
for lid, w_ in (('payrow', 'Pay records'), ('academic', 'Academic'), ('others', 'mailing'), ('others', 'applications')):
    typekey(S_(lid, w_, 0.05), 0.008, px(400))
roll((F3, Bb3, D4), S_('reason', 'A reason', 0.1), 0.18, 0.45, ring=1.2)
tSg = S_('signed', 'sign')
pen(tSg + 0.05, 0.7, 0.007, px(1500))
roll((Bb3, D4, F4, Bb4), tSg + 0.6, 0.16, 0.55, ring=1.8)
tGo = G('schedule', 'went')
for i, m in enumerate((D4, Bb3, F3)):
    drawer(m, tGo + 0.9 * i + 0.1, 0.45, px(800), damp=0.42)
air(tGo + 3.0, 1.2, 0.007, px(960), 180, 800)

# 5. The clock starts at an event: the record's line, a glass tap. The event: a drawer, D. How long, counted from it: a breath along
#    the line, and the end date's tap. Linh's eight contracts: one soft sound of cards laid down. Eight end dates: one roll, four
#    drawers, as the dates come in. The first and the last: F, then B-flat, each left to ring. Other kinds, other events: two cards.
#    Friday: a card; the last contract ended. Nobody has to decide: E-flat major as her dates light. As in 1943: the cabinet's drawer
#    again, F, and its label
C_ = lambda lid, word, off=0: W('clock', lid, word, off)
glasstap(S0('clock') + 0.5, 0.007, px(560))
drawer(D4, C_('event', 'event', 0.05), 0.45, px(1000), ring=0.9)
air(C_('event', 'not from', 0.0), 1.4, 0.007, px(1300), 200, 900)
glasstap(C_('event', 'not from', 1.45), 0.007, px(1600))
paper(C_('contract', 'each contract', 0.0), 0.009, px(780), 1.3)
roll((Bb3, D4, F4, Bb4), C_('eight', 'eight end dates', 0.3), 0.3, 0.5, ring=1.2)
drawer(F3, C_('firstc', 'kept until', 0.05), 0.45, px(1140), ring=1.3)
drawer(Bb3, C_('lastc', 'kept until', 0.05), 0.45, px(1140), ring=1.3)
knock(C_('others', 'application', 0.05), 0.011, px(1620), 240); knock(C_('others', 'mailing', 0.05), 0.011, px(1620), 240)
knock(C_('friday', 'Friday', 0.05), 0.011, px(1620), 240); glasstap(C_('friday', 'ends', 0.05), 0.007, px(1420))
roll((Eb3, G3, Bb3, Eb4), G('clock', 'nobody', 0.1), 0.22, 0.45, ring=1.4)
drawer(F3, G('clock', 'as43', 0.15), 0.5, px(1480), ring=1.4)

# 6. A hold stops the clock: the drawer of 2019, a soft knock. The tutor's claim: a card. Due to go in January: a glass tap. If they
#    went, nobody could show what was paid: G minor. A hold placed: its band set down, and a low drawer held, G. What it names: four
#    keys, one a line. The clean-up skips them: the rest go on a breath of air; January. Never just in case: struck through. Lifted: E-flat
#    to B-flat as the band leaves; her records go at the next clean-up, a drawer damped. As in 1943: the cabinet's drawer, D, left to
#    ring
H_ = lambda lid, word, off=0: W('hold', lid, word, off)
knock(S0('hold') + 0.6, 0.010, px(560), 200)
knock(H_('tutor', 'former tutor', 0.05), 0.011, px(1410), 240)
glasstap(H_('due', 'due to go', 0.05), 0.007, px(780))
roll((G3, Bb3, D4), H_('show', 'neither', 0.1), 0.2, 0.45, ring=1.3)
tPl = H_('places', 'places a hold')
stamp(tPl + 0.1, 0.014, px(760))
drawer(G3, tPl + 0.25, 0.5, px(760), ring=1.8)
for w_ in ('names', 'reason', 'placed', 'lift'):
    typekey(H_('names', w_, 0.05), 0.008, px(1440))
air(H_('skips', 'skips', 0.4), 1.0, 0.007, px(400), 180, 800)
knock(H_('skips', 'skips', -0.2), 0.010, px(1250), 240)
strike(H_('never', 'just in case', 0.2), 0.009, px(1250))
tLf = H_('lifts', 'lifts')
roll((Eb3, G3, Bb3), tLf + 0.1, 0.18, 0.45, ring=1.0)
drawer(Bb3, tLf + 0.7, 0.45, px(800), ring=1.3)
drawer(D4, H_('lifts', 'next clean-up', 0.2), 0.4, px(800), damp=0.4)
drawer(D3, G('hold', 'as43', 0.15), 0.5, px(1450), ring=1.5)

# 7. An end date for every record: too soon, a low G damped; too long, a low D left too long. The rule: a card. Nothing outside the
#    schedule, except a hold: its band. Every copy: four glass taps as the four places stand; deleted means deleted: they slide aside.
#    1943 again: the euphonium's low F, and the drawers' F major; the few kept, the rest on time: the mark in B-flat major, other
#    notes, the last left to ring as the few folders go. Every record now has an end date: B-flat major. The end card: the drawers
#    together and the euphonium's low B-flat, ringing out
N_ = lambda lid, word, off=0: W('end', lid, word, off)
drawer(G3, N_('short', 'Deleted too soon', 0.1), 0.45, px(630), damp=0.3)
drawer(D3, N_('long', 'Kept too long', 0.1), 0.45, px(1390), ring=1.9)
knock(N_('laws', 'keep personal', 0.05), 0.011, px(960), 240)
knock(N_('outside', 'outside the schedule', 0.05), 0.011, px(820), 240)
stamp(N_('outside', 'except', 0.1), 0.012, px(1230))
for i in range(4):
    glasstap(N_('copy', 'every copy', 0.1) + 0.35 * i, 0.007, px(405 + 370 * i))
air(N_('dmd', 'Deleted means', 0.1), 1.4, 0.007, px(960), 180, 800)
t43 = G('end', 'pile', -0.3)
euph(F2, t43 + 0.4, t43 + 4.2, 0.55, att=1.0, rel=1.4)
roll((F3, A3, C4), t43 + 0.5, 0.18, 0.45, ring=1.4)
mark(((D4, 0.34), (Bb3, 0.5), (F4, 0.72), (Bb4, None)), N_('few', 'rest went', 0.0), 0.5, 0.7, px(1400))
tE = G('end', 'every', -0.3)
roll((Bb3, D4, F4), tE + 0.5, 0.2, 0.5, ring=1.5)
for i in range(4):
    glasstap(tE + 0.8 + 0.25 * i, 0.006, px(1380))
tEnd = G('end', 'breath', 0.6)
roll((Bb3, D4, F4, Bb4), tEnd, 0.2, 0.75, ring=2.6)
euph(Bb2, tEnd + 0.2, E('end'), 0.6, att=1.2, rel=2.0)
