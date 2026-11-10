# One policy for many tables: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film on 5 November 2026 (/mnt/project-files/data-protection/palettes.md: neither "orpharion" nor
# "Helmholtz" in any score.py on main or any branch, nor in any palettes list), both made here (music.py has neither):
#  - The orpharion, the wire-strung lute of Elizabethan England (first made in London in 1580): brass and steel strings plucked softly
#    with the fingertips, so each note rings longer and rounder than a gut lute's, its warmth near 900 Hz and nothing above 2.4 kHz. Its
#    frets are fanned, so strings of different lengths all play in tune on one fretboard, as one policy fits every table, whatever its
#    columns are called. Played plain, a few notes at a time, never strummed, no vibrato.
#  - Helmholtz resonators, the brass spheres of the 1860s that each answer only to their own note: never struck or blown here. The
#    spheres are tuned to A, and only A: after the orpharion plays an A, they answer it, a soft, pure, short bloom at the same pitch; one
#    set out later answers the same note, as the policy follows the tag. A is the tag; the sphere is the policy. Where the story finds
#    its guide (1980) and where a new table is protected the day it appears, the spheres answer in every octave.
#  - The mark: three notes, D, F sharp, A, and the spheres answer the A. It plays where the book of 1980 gives chemicals that behave
#    alike one guide, under the title, and at the end.
#  - D major for the guide and the policy; B minor under the problem (a page for each, and thousands with none), with no A in it: there
#    is no guide yet, so nothing answers. Tuned pure (just intonation from D, see hz()), so no chord beats: D, G and A major and B and
#    F sharp minor are pure in this table; E minor is not (27:32:40), so an E never rings with a G or a B.
# The rules the module keeps (its briefs, 5 November 2026, as the site's other films do):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; no urgent pulse (film.json lists no urgent chapter).
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen (six pills, five
#    chips) is one soft sound, never one for each.
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
R1 = np.random.default_rng(1580)  # this film's own randomness: the room, the fingertips, the air

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
A_ = 9  # A's pitch class: the spheres' note
# the orpharion's notes, low and in the middle
D2, A2, B2, Cs3, D3, E3, Fs3, G3, A3, B3, D4 = 38, 45, 47, 49, 50, 52, 54, 55, 57, 59, 62

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films', whose sound the author accepted; the spheres under the strings; the effects about 16 dB under the
# music (FX scales them all)
OL, SPH, FX = 0.085, 0.42, 2.2

# a room round the player: a small panelled room, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what it
# rings where the notes are (_band: its gain from 100 Hz to 1.5 kHz is one), and each note is set back to its own level after it
# (_held), as the video guidelines ask
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the orpharion: a wire string plucked softly with the fingertip, about a fifth of the way along, so its fifth harmonic is weak;
# brass and steel ring on longer than gut, the fundamental longest, each harmonic above dying a little faster; exact harmonics, so
# nothing beats, and a fingertip's soft touch as it lets the string go
def _string(f, ring):
    n = int((ring + 0.4) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        w = abs(np.sin(np.pi * k * 0.19)) / k ** 1.05 * (1 + 0.45 * np.exp(-((fk - 900) / 350) ** 2))
        s = s + w * np.exp(-x * (1.0 + 0.55 * (k - 1) + fk / 1100) * (2.6 / ring)) * np.sin(2 * np.pi * fk * x + 0.9 * k)
    s = s * np.minimum(1, x / 0.003)
    s = s / max(1e-9, float(np.abs(s).max()))
    tip = filt(noise(n / SR + 0.01)[:n], 'band', (300, 1600)) * 0.02 * np.exp(-x / 0.012)
    return (s + tip).astype(np.float32)
# ---- a Helmholtz sphere answering: a pure tone at its own pitch, swelling in over a seventh of a second and fading
def _sphere(f, sec=1.9, at=0.14):
    n = int((sec + 0.3) * SR); x = np.arange(n) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / at, 1)) ** 2 * np.exp(-np.maximum(0, x - at) / (sec / 3.2))
    return (e * np.sin(2 * np.pi * f * x)).astype(np.float32)
def pl(m, s, g=1.0, pan=0.0, ring=2.6, room=0.25, octaves=(0,)):
    """one orpharion note at s; an A is answered by the spheres tuned to it (octaves: the spheres' octaves, from the note's own), all
    in one sound, so the answer is part of the note"""
    sig = _string(hz(m), ring)
    if m % 12 == A_:
        for o in octaves:
            b = _sphere(hz(m) * 2 ** o); i = int(0.12 * SR); sig = np.pad(sig, (0, max(0, i + len(b) - len(sig))))
            sig[i:i + len(b)] += SPH * b / len(octaves) ** 0.5
    put(_held(filt(sig.astype(np.float32), 'low', 2400), room), s, g * OL, pan)
def phrase(notes, s, g=1.0, pan=0.0, ring=2.6, octaves=(0,)):
    """a plain phrase: (note, gap to the next) pairs, one string after another, each left to ring"""
    t = s
    for i, (m, d) in enumerate(notes):
        pl(m, t, g * (1.0 if i == len(notes) - 1 else 0.9), pan, ring=ring, octaves=octaves); t += d

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.007, pan=0.0):
    """a muffled tap: a line lit, a chip placed, a tick"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.009, pan=0.0, sec=0.35):
    """a page laid down or turned, a window opened"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.006, pan=0.0, lo=150, hi=1000):
    """a breath of air: a person or a card moving across, frost forming or clearing, the wind"""
    s_air(s, sec, g * FX, pan, lo, hi)
def pen(s, sec=3.0, g=0.005, pan=0.0):
    """masks set by hand, one after another: one soft texture of a pen, never a burst of ticks"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * (0.75 + 0.25 * np.sin(2 * np.pi * 2.6 * x) ** 2), s, g * FX, pan)
def glass(s, g=0.011, pan=0.0):
    """a pane closing: a dull knock of glass"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.008, g * 0.5 * FX, pan)
def seal(s, g=0.014, pan=0.0):
    """the key sealed: a soft, low press"""
    s_knock(s, g * FX, pan, 140); x = tt(0.12); X(filt(noise(0.12), 'band', (150, 900))[:len(x)] * np.exp(-x / 0.03), s + 0.01, g * 0.4 * FX, pan)
def hiss(s, sec=1.1, g=0.005, pan=0.0):
    """water from a hose, far off: soft and low"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.minimum(1, x / 0.15) * np.minimum(1, (sec - x) / 0.4), s, g * FX, pan)

# =============================================================================================================================
# 1. A page for each: the road at night in the 1970s, in B minor and with no A, so nothing answers. The opening: B, D, F sharp, rising,
#    held. The guide's card set down; the papers in the cab, lit. "No page at all": G falling to F sharp. The spray; the cloud lifting.
#    "Something had to change": C sharp, E, left open. 1980, "changed the book": D, home. The book: the mark as the three lines run to
#    one guide, D, F sharp, A, and the spheres answer the A in every octave. The new line finds its guide: one A, answered. Guide 111,
#    "every danger": a low D, held. Today's book: F sharp, A, D. The road today, from upwind. The hall: masks drawn by hand, one table at
#    a time; the policy's card; the frost; the seventh table, protected the day it appears: one A, answered in every octave. The title:
#    D, F sharp, A, D
P_ = lambda lid, word, off=0: W('page', lid, word, off)
p0 = S0('page')
phrase(((B2, 0.75), (D3, 0.75), (Fs3, 0.75)), p0 + 0.5, 0.85, ring=3.0)
knock(P_('page', 'guide', 0.1), 0.011, px(1100), 250)
paper(P_('cab', 'papers', -0.1), 0.007, px(1500), 0.3)
knock(G('page', 'none', 1.2), 0.010, px(1100), 230)
air(G('page', 'none', 1.4), 1.4, 0.005, px(1100), 200, 1100)
phrase(((G3, 0.55), (Fs3, 0.55)), END('page', 'none') + 0.1, 0.75, ring=2.2)
hiss(P_('wrong', 'spray'), 1.1, 0.005, px(820))
air(P_('wrong', 'poison', -0.3), 2.6, 0.006, px(1300), 120, 600)
phrase(((Cs3, 0.5), (E3, 0.5)), G('page', 'change', 0.25), 0.75, ring=2.4)
air(P_('book', 'changed'), 0.9, 0.006, px(470), 200, 1100)
pl(D3, P_('book', 'changed', 0.05), 0.8, ring=3.0)
# the book: each line runs to its guide (scenes.js: alike + i * 0.3 + 0.15), and Guide 137 answers
al = P_('share', 'alike')
phrase(((D3, 0.3), (Fs3, 0.3), (A3, 0.3)), al + 0.15, 0.85, ring=3.0, octaves=(-1, 0, 1))
tap(P_('number', 'number', -0.1), 0.006, px(240))
paper(P_('line', 'one', -0.4), 0.008, px(240), 0.4)
pl(A3, P_('line', 'guide', 0.0), 0.8, ring=2.6)
paper(P_('unknown', 'Guide', -0.3), 0.009, px(1385), 0.5)
pl(D2, P_('unknown', 'every', -0.1), 0.8, ring=3.2)
knock(P_('today', 'Canada', -0.3), 0.011, px(960), 240)
phrase(((Fs3, 0.45), (A3, 0.45), (D4, 0.45)), P_('today', 'Canada', -0.2), 0.75, ring=2.6)
# the road today: the wind from upwind, the binoculars, the guide's card
air(P_('upwind', 'upwind', -0.2), 1.3, 0.006, px(300), 150, 900)
tap(P_('upwind', 'binoculars', -0.2), 0.006, px(560))
knock(P_('knows', 'what', -0.3), 0.011, px(1300), 240)
tap(P_('knows', 'far', -0.1), 0.006, px(1300))
# the hall: seven tables, masks drawn by hand, the policy's card, the frost, the seventh table
air(P_('same', 'Data', 0.15), 0.9, 0.005, px(700), 200, 1100)
pen(P_('same', 'table'), 2.0, 0.005, px(700))
air(P_('same', 'until', -0.2), 0.8, 0.005, px(1370), 200, 1100)
tap(P_('same', 'nothing'), 0.006, px(1370))
knock(P_('tag', 'policy', -0.3), 0.011, px(960), 240)
tap(P_('tag', 'tag', 0.1), 0.006, px(960))
air(P_('tag', 'protects'), 0.9, 0.006, px(960), 300, 1400)
air(P_('tag', 'appears', -0.3), 0.9, 0.005, px(1720), 200, 1100)
pl(A3, P_('tag', 'appears', 0.6), 0.8, ring=2.8, octaves=(-1, 0, 1))
air(P_('lands', 'hidden'), 1.6, 0.005, px(960), 300, 1400)
phrase(((D3, 0.6), (Fs3, 0.6), (A3, 0.6), (D4, 0.6)), G('page', 'breath', 0.3), 0.8, ring=3.2)

# 2. A mask for every table: E, F sharp, D at the turn. Mei's card and her table; each class lands, one soft breath; the masks by hand,
#    one soft texture of a pen; the readers of core; the new table read at once. "Everyone reads every name": one low B in the pause.
#    Sam, and the line of light round the whole catalog: D, then A, answered
M_ = lambda lid, word, off=0: W('mask', lid, word, off)
m0 = S0('mask')
phrase(((E3, 0.45), (Fs3, 0.45), (D3, 0.45)), m0 + 0.25, 0.7, ring=2.2)
knock(m0 + 0.9, 0.010, px(290), 250)
paper(m0 + 1.0, 0.008, px(1060), 0.35)
air(M_('day', 'class'), 0.9, 0.005, px(1400), 200, 1100)
tap(M_('day', 'Know', -0.1), 0.006, px(1700))
tap(M_('least', 'whole'), 0.006, px(900))
tap(M_('least', 'year', 0.3), 0.006, px(900))
air(M_('tables', 'catalog', -0.6), 1.2, 0.005, px(700), 200, 1100)
tap(M_('tables', 'thirty-eight', -0.1), 0.006, px(960))
pen(M_('hand', 'masks'), min(4.0, M_('hand', 'remembers') - M_('hand', 'masks')), 0.005, px(700))
air(M_('grants', 'readers'), 0.8, 0.005, px(1500), 200, 1100)
air(M_('grants', 'new', -0.1), 0.8, 0.005, px(1740), 200, 1100)
tap(M_('grants', 'first', -0.2), 0.006, px(1740))
tap(M_('later', 'later', -0.1), 0.006, px(1500))
knock(M_('every', 'everyone', -0.1), 0.010, px(1520), 220)
pl(B2, END('mask', 'every') + 0.15, 0.7, ring=2.4)
air(G('mask', 'sam', 0.1), 1.2, 0.005, px(1700), 200, 1100)
knock(M_('sam', 'Okafor', 0.2), 0.010, px(1350), 250)
phrase(((D3, 0.6), (A3, 0.6)), M_('sam', 'whole', -0.1), 0.7, ring=2.6)

# 3. A policy for each class: A, D, E at the turn. The SQL editor; each part of the policy lights, a tap each; the frost falls on every
#    personal value: F sharp, D. The policies, a tap as each row comes; the row filter's row; the study's view, its faculty tag, the
#    rows that aren't Health's folding away; the table with no faculty column: one low B as every learner shows
C_ = lambda lid, word, off=0: W('parts', lid, word, off)
c0 = S0('parts')
phrase(((A2, 0.45), (D3, 0.45), (E3, 0.45)), c0 + 0.25, 0.7, ring=2.2)
air(c0 + 0.9, 1.2, 0.005, px(1700), 200, 1100)  # Sam goes, once the chapter's crossfade is over
paper(c0 + 1.6, 0.008, px(1270), 0.35)
air(C_('where', 'every', -0.2), 1.2, 0.005, px(400), 200, 1100)
for w_ in (('where', "registrar's"), ('whom', 'except'), ('finds', 'direct'), ('finds', 'any')):
    tap(C_(*w_, -0.1), 0.006, px(1100))
tap(C_('finds', 'tag', -0.1), 0.006, px(400))
air(C_('does', 'mask'), 0.8, 0.006, px(400), 300, 1400)
phrase(((Fs3, 0.5), (D3, 0.5)), C_('does', 'mask', 0.1), 0.65, ring=2.2)
tap(G('parts', 'before', -0.1), 0.006, px(1000))
paper(G('parts', 'each', 0.2), 0.008, px(1270), 0.35)
for w_ in ('special', 'direct', 'pseudonymous', 'indirect'):
    tap(C_('each', w_, -0.15), 0.006, px(1000))
knock(C_('rows', 'rows', -0.1), 0.010, px(1000), 250)
tap(C_('rows', 'Faculty', -0.2), 0.006, px(160))
paper(G('parts', 'shelf'), 0.008, px(1110), 0.35)
tap(C_('shelf', 'faculty'), 0.006, px(1400))
air(C_('shelf', 'tag', 0.1), 1.0, 0.005, px(1110), 200, 1100)
air(G('parts', 'needs', -0.1), 1.0, 0.004, px(1300), 300, 1400)
paper(G('parts', 'without', -0.4), 0.008, px(990), 0.35)
knock(C_('without', 'every', -0.1), 0.009, px(990), 210)
pl(B2, C_('without', 'every', 0.0), 0.65, ring=2.2)

# 4. A function for each way: D, C sharp, B at the turn, falling. The policies shelf lights; the four functions come in, one knock; a
#    tap as each value changes; a mask in a date column: the query stopped, a low knock. The other ways: three cards, one knock; the
#    code; the sealed key, and one low D under it; support left out: frost; no grant
F_ = lambda lid, word, off=0: W('ways', lid, word, off)
f0 = S0('ways')
phrase(((D3, 0.45), (Cs3, 0.45), (B2, 0.45)), f0 + 0.25, 0.7, ring=2.2)
tap(F_('small', 'policies', -0.2), 0.006, px(160))
knock(F_('small', 'function', -0.1), 0.010, px(1270), 250)
for w_ in (('whole', 'stars'), ('whole', 'empty'), ('part', 'digits'), ('part', 'letter'), ('general', 'January'), ('type', 'stays'), ('filter', 'yes'), ('filter', 'no')):
    tap(F_(*w_, -0.1), 0.006, px(1270))
knock(F_('type', 'fails', -0.1), 0.009, px(990), 200)
knock(G('ways', 'other', 0.1), 0.010, px(1270), 250)
tap(G('ways', 'other', 0.5), 0.006, px(160))
tap(F_('code', 'code', -0.2), 0.006, px(820))
seal(F_('code', 'key', -0.2), 0.013, px(960))
pl(D2, F_('code', 'key', -0.1), 0.6, ring=2.6)
air(F_('out', 'left', -0.1), 0.9, 0.005, px(160), 300, 1400)
tap(F_('out', 'grant', -0.2), 0.006, px(1260))

# 5. Who is let through: G, B, D at the turn. The policies, with the groups each lets through; owning isn't enough, a low knock; Mei
#    comes in; her office's chips, one soft breath; registrar-loader; the builder's group; the help desk; the masks in part. Two masks
#    for one reader: the error card, and E falling to C sharp in the pause. The study, its agreement; the agent; the compute
G5 = lambda lid, word, off=0: W('through', lid, word, off)
h0 = S0('through')
phrase(((G3, 0.45), (B3, 0.45), (D4, 0.45)), h0 + 0.25, 0.65, ring=2.2)
paper(h0 + 0.7, 0.008, px(740), 0.4)
knock(G5('owner', 'owning', -0.1), 0.009, px(1650), 210)
air(G('through', 'decide', -0.2), 1.2, 0.005, px(1720), 200, 1100)
knock(G('through', 'decide', 0.3), 0.010, px(1650), 250)
air(G5('decide', 'office', -0.1), 0.8, 0.005, px(500), 200, 1100)
tap(G5('loader', 'registrar-loader', -0.2), 0.006, px(1550))
air(G5('loader', 'through', -0.1), 0.8, 0.005, px(500), 200, 1100)
knock(G5('loader', 'stars', -0.2), 0.009, px(1650), 210)
tap(G5('help', 'help', -0.1), 0.006, px(700))
knock(G('through', 'given', 0.2), 0.010, px(740), 250)
air(G('through', 'two', -0.1), 0.7, 0.005, px(1300), 200, 1100)
knock(G5('two', 'error', -0.1), 0.010, px(1650), 200)
phrase(((E3, 0.55), (Cs3, 0.55)), END('through', 'two') + 0.15, 0.65, ring=2.2)
tap(G5('study', 'study', -0.1), 0.006, px(700))
tap(G5('allows', 'agreement', -0.2), 0.006, px(500))
air(G('through', 'agent', -0.1), 0.9, 0.005, px(1655), 200, 1100)
knock(G('through', 'agent', 0.1), 0.010, px(1650), 250)
knock(G('through', 'compute', 0.1), 0.010, px(1650), 250)
tap(G5('compute', 'serverless', -0.1), 0.006, px(1650))
tap(G5('compute', 'Databricks', -0.1), 0.006, px(1650))
knock(G('through', 'older', -0.1), 0.009, px(1650), 200)

# 6. The day a table appears: F sharp, D, A at the turn, the A answered. Jun; the new table built; its classes land, one breath; the
#    level. "Nobody writes a mask": the masks come anyway, and one A, answered, in every octave. Three readers' views; the rows that
#    aren't Health's fold. On the road, Guide 111: a low D, as in the opening. Here, the table without its level: closed, a dull knock
#    of glass; its builder; the level given, and the frost clears: D, F sharp. The column no one classed; the morning check
A6 = lambda lid, word, off=0: W('appears', lid, word, off)
a0 = S0('appears')
phrase(((Fs3, 0.45), (D3, 0.45), (A2, 0.45)), a0 + 0.25, 0.7, ring=2.4)
knock(a0 + 0.9, 0.010, px(290), 250)
paper(A6('day', 'built', -0.2), 0.008, px(1060), 0.35)
air(A6('classes', 'bring'), 0.9, 0.005, px(1400), 200, 1100)
tap(A6('level', 'level', -0.1), 0.006, px(1500))
air(A6('nine', 'mask', 0.2), 0.8, 0.006, px(900), 300, 1400)
pl(A3, A6('nine', 'mask', 0.2), 0.8, ring=2.8, octaves=(-1, 0, 1))
for w_, x_ in ((('first', 'help'), 360), (('first', 'Planning'), 960), (('study', 'study'), 1560)):
    knock(A6(*w_, -0.2), 0.009, px(x_), 250)
air(A6('study', 'only'), 0.8, 0.005, px(1560), 200, 1100)
pl(D2, A6('road', 'every', -0.1), 0.7, ring=3.0)
glass(G('appears', 'here', -0.05), 0.010, px(1060))
tap(A6('here', 'builder', -0.2), 0.006, px(700))
tap(A6('until', 'owner', -0.1), 0.006, px(1500))
air(A6('until', 'gives', 0.2), 0.8, 0.006, px(1060), 300, 1400)
phrase(((D3, 0.5), (Fs3, 0.5)), A6('until', 'gives', 0.25), 0.65, ring=2.4)
tap(A6('tag', 'tag', -0.2), 0.006, px(900))
tap(A6('check', 'check', -0.2), 0.006, px(900))

# 7. Kept as code: B, C sharp, D at the turn, rising. The pull request; the new files, one breath; the grants already there; Mei's
#    approval: F sharp, A, answered. The job, its runs, run as registrar-loader; each file replaces its policy whole; the day: morning,
#    afternoon. On the road, the new chemical's line runs to its guide: one A, answered. Here, the new table's tags, and the spheres
#    answer in every octave; the sweep; the study's view. The take-away; the next film; the end card: D, F sharp, A, D, the A answered
#    in every octave, ringing on as the film ends
K7 = lambda lid, word, off=0: W('code', lid, word, off)
k0 = S0('code')
phrase(((B2, 0.45), (Cs3, 0.45), (D3, 0.45)), k0 + 0.25, 0.7, ring=2.4)
paper(k0 + 0.6, 0.008, px(600), 0.4)
air(K7('kept', 'code', 0.2), 1.0, 0.005, px(400), 200, 1100)
tap(K7('kept', 'grants', -0.1), 0.006, px(500))
tap(G('code', 'review', -0.1), 0.006, px(400))
tap(K7('review', 'approves', -0.1), 0.006, px(300))
phrase(((Fs3, 0.5), (A3, 0.5)), K7('review', 'approves', 0.0), 0.65, ring=2.4)
paper(G('code', 'runs', -0.2), 0.008, px(1515), 0.4)
tap(K7('runs', 'test', 0.3), 0.006, px(1500))
tap(K7('runs', 'registrar-loader', -0.1), 0.006, px(1450))
tap(K7('runs', 'approver', 0.4), 0.006, px(1500))
paper(G('code', 'whole', 0.4), 0.007, px(600), 0.35)
tap(K7('whole', 'replaces'), 0.006, px(500))
knock(G('code', 'order', -0.2), 0.010, px(1515), 250)
tap(K7('order', 'morning', -0.1), 0.006, px(1420))
tap(K7('order', 'afternoon', -0.1), 0.006, px(1420))
paper(K7('road', 'line', -0.6), 0.008, px(240), 0.4)
pl(A3, K7('road', 'line', 0.6), 0.75, ring=2.6)
tap(K7('road', 'line', 0.9), 0.006, px(715))
air(G('code', 'here', 0.0), 0.9, 0.005, px(1740), 200, 1100)
pl(A3, K7('here', 'tags', -0.1), 0.8, ring=2.8, octaves=(-1, 0, 1))
air(K7('lands', 'hidden', -0.3), 2.0, 0.005, px(960), 300, 1400)
knock(K7('lands', 'study', -0.2), 0.009, px(1520), 250)
air(K7('lands', 'only'), 0.8, 0.005, px(1520), 200, 1100)
knock(G('code', 'take', 0.1), 0.010, px(960), 250)
knock(G('code', 'next', -0.1), 0.010, px(960), 250)
tE = G('code', 'breath', 0.3)
phrase(((D3, 0.6), (Fs3, 0.6), (A3, 0.6), (D4, 0.6)), tE, 0.85, ring=3.4, octaves=(-1, 0, 1))
pl(D2, tE + 2.6, 0.7, ring=3.4)
