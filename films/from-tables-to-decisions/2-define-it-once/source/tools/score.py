# Defined in the open: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette, reserved for this film by the module's setup thread on 5 November 2026 (/mnt/project-files/modern-data-basics/
# palettes.md), after checking every score.py and music.py on main and on every branch: an organette, the small reed instrument of
# the 1880s that plays a tune punched in a strip of paper, so the tune is defined once, on the strip, and any organette that reads the
# strip plays it the same. The partner, chosen by this film's thread that day: a second organette, a larger one whose reeds sound an
# octave lower, reading the same strip. Every other colour the site lacks either belongs to another culture or sounds like one the
# site has (palettes.md's list), so the film keeps to the one instrument that reads a definition it doesn't hold, as film 4 keeps to
# two ophicleides and film 6 to a repeater's two gongs. Both are made here (music.py has neither).
#  - The organettes (reed(), low()): a free reed, which speaks a moment after the hole in the strip opens over it (its low partials
#    over about 20 ms, its upper ones over about 45) and stops as the hole passes (over 60 ms), with the soft touch of the strip at
#    the start of each note. Short and dry, held at one level, never a bellows' swell: so they read apart from the site's accordion
#    and melodica (held, breathed, swelling) and film 1's telegraph reeds (plucked, then a pure ring). The small one's partials stop
#    at 2.2 kHz; the large one's tone is darker, its partials stopping at 1.5 kHz. No vibrato, nothing that beats: every partial is
#    a whole multiple of its note, the notes are tuned pure, and the two organettes sit exactly an octave apart.
#  - The film's mark: a short tune read from its strip, the same in two places (mark()): E, G, C, B, C, the small organette on one
#    side and the large one an octave lower on the other, note for note. It sounds as the kilogram becomes one definition, the same
#    for everyone; at the title card; as Genie One and the dashboard give the same number from the same definition; and at the end.
#  - C major, A minor for the problem (the copies drifting from the kilogram, which nobody could tell, and three tools giving three
#    numbers for one name), all tuned pure (just intonation from C): A minor's third and fifth are pure here, and D is never held with
#    A or F, whose intervals would beat.
# The module's rules (palettes.md and the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only at a chapter's turn or under a moment on screen; never a bed under the voice. Here
#    that's a line or two from the strip at a chapter's turn and where a definition is made, read or carried, and silence between.
#  - Nothing trembles or pulses, no vibrato; no urgent pulse anywhere (film.json's "urgent" is empty).
#  - Nothing French for the kilogram (palettes.md): an organette is no one country's, and nothing plays the vault's place.
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: a soft knock as a card is set down, a muffled key as a tag is placed
#    or a line is typed, a breath of air as a window opens or a lane runs, a small clink as the copies are weighed, a fine scratch on
#    the cylinder, a pen's stroke through copy number 20 and through a second definition, and a small lock where only one report
#    could read the definition. Never the vault's bell jars rung, a coin, or a till.
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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1889)  # this film's own randomness: the room, the reeds' phases and the strip's touch

# ---- tuning: just intonation from C, so two notes played together are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (48, 130.813)  # C 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
A2, C3, E3, F3, G3, A3, B3, C4, E4, F4, G4, A4, B4, C5, D5, E5, G5 = 45, 48, 52, 53, 55, 57, 59, 60, 64, 65, 67, 69, 71, 72, 74, 76, 79

# ---- the levels, set by tools/quiet.py's measure as one speaker plays the score: the music's loud moments under -26.5 dB of full
# scale and its loudest notes under -23, the effects' loud moments under -43 dB (FX scales them)
OS, OL, FX = 0.048, 0.056, 1.7

# a room round the organettes: a small wooden room, dry, ringing on for under a second, and nothing much above 1.8 kHz. Its level is
# set by what it rings under 1.8 kHz (its gain there about one, so `room` is its share): scaled by all it rings, a room rings about
# 10 dB louder there than its share says, and moves a note's level up or down by where its reflections meet the note's own sound
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.015 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3600)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room, a, b):
    """a note in the room, at its own level: set back to the level it had before the room, measured over its body (a to b seconds,
    once the reed has spoken and before the hole passes). A note too short to have a body just goes into the room"""
    r = _room(s, room); i, j = int(a * SR), int(b * SR)
    if not room or j - i < int(0.3 * SR):
        return r
    return r * float(np.sqrt((s[i:j] ** 2).mean() / max(1e-12, (r[i:j] ** 2).mean())))

# ---- the organettes: a free reed's partials, each a whole multiple of the note, softer as they rise (tilt), with a little more
# where a small reed's tone is nasal (about 1.1 kHz); the reed speaks, holds one level while the hole is open, and stops as it passes
_PH = R1.uniform(0, 2 * np.pi, 64)
def _reed(m, sec, top, tilt, touch):
    f = hz(m); n = int((sec + 0.1) * SR); x = np.arange(n, dtype=np.float64) / SR
    lo, up = np.zeros(n), np.zeros(n)
    for k in range(1, 64):
        if f * k >= top:
            break
        a = k ** -tilt * (1 + 0.45 * np.exp(-((f * k - 1100) / 420) ** 2))
        (lo if k <= 2 else up)[:] += a * np.sin(2 * np.pi * f * k * x + _PH[k])
    sp = lambda r: np.sin(0.5 * np.pi * np.minimum(1, x / r)) ** 2
    off = np.where(x < sec, 1.0, np.cos(0.5 * np.pi * np.minimum((x - sec) / 0.06, 1)) ** 2)
    s = (lo * sp(0.022) + up * sp(0.045)) * off
    s = s / max(1e-9, float(np.abs(s).max()))
    tick = filt(R1.standard_normal(n).astype(np.float32), 'band', (500, 1600)) * np.exp(-x / 0.004)  # the strip's touch
    return filt((s + touch * tick).astype(np.float32), 'low', top)
def reed(m, t0, sec=0.25, g=1.0, pan=-0.2, room=0.25):
    """the small organette: one hole in the strip, one reed, open for sec seconds"""
    put(_held(_reed(m, sec, 2200, 0.85, 0.05), room, 0.06, sec - 0.02).astype(np.float32), t0, g * OS, pan)
def low(m, t0, sec=0.5, g=1.0, pan=0.2, room=0.25):
    """the large organette: longer reeds, a darker tone"""
    put(_held(_reed(m, sec, 1500, 1.05, 0.035), room, 0.06, sec - 0.02).astype(np.float32), t0, g * OL, pan)
def line(notes, t0, g=1.0, pan=-0.2, who=reed):
    """a line of the strip on one organette: (note, when after t0, how long the hole is open)"""
    for m, at, sec in notes:
        who(m, t0 + at, sec, g, pan)
STRIP = ((E4, 0.0, 0.2), (G4, 0.24, 0.2), (C5, 0.48, 0.34), (B4, 0.9, 0.16), (C5, 1.1, 0.5))
def mark(t0, g=1.0, a=-0.35, b=0.35):
    """the film's mark: the strip's short tune, read the same in two places, the small organette on one side and the large one,
    an octave lower, on the other"""
    for m, at, sec in STRIP:
        reed(m, t0 + at, sec, 0.9 * g, a); low(m - 12, t0 + at, sec, g, b)

# ---- soft sounds, all low-passed, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap: a tag or a pill placed, a line lit"""
    s_tap(s, g * FX, pan)
def keys(s, n, sec, g=0.007, pan=0.0):
    """a few muffled keys, spread over sec: lines typed"""
    for i in range(n):
        s_tap(s + sec * i / max(1, n - 1), g * FX * (0.85 + 0.15 * (i % 2)), pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: a window opening, a lane running, a ring drawn"""
    s_air(s, sec, g * FX, pan, lo, hi)
def clink(s, g=0.007, pan=0.0, f=880):
    """a small brass weight set on a balance's pan: a short, soft tick, under 2 kHz"""
    x = tt(0.14)
    sig = (np.sin(2 * np.pi * f * x) * np.exp(-x / 0.03) + 0.35 * np.sin(2 * np.pi * f * 1.47 * x) * np.exp(-x / 0.018)) * np.minimum(1, x / 0.002)
    X(norm(filt(sig.astype(np.float32), 'low', 1800)), s, g * FX, pan)
def scrape(s, sec=0.4, g=0.007, pan=0.0, lo=350, hi=1400):
    """a fine scratch, or a pen's stroke through a line: soft noise that rises and falls, under 1.5 kHz"""
    x = tt(sec); X(filt(noise(sec), 'band', (lo, hi))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def lock(s, g=0.009, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)

# =============================================================================================================================
# 1. A kilogram anyone can make: the opening, music all through it. Near Paris, 1889, C major: the small organette rises as the
#    vault's light comes up and the cylinder becomes the kilogram; a line spreads left to right as the forty copies go out; F and C as
#    each country checks its weights. A minor from "But only": the copies dim, one line falls; the two organettes move apart as the
#    copies drift; a line left hanging as nobody can tell; one low A as everything rests on one object; then nothing under "Something
#    had to change". C major again from the vote: the conference, the constant, fixed; the large organette alone as any lab makes a
#    kilogram from it; the mark as the copies all turn gold, one definition, the same for everyone. The university: A minor again,
#    the three numbers each a note of its own, a question left open; C major as it's defined once, the same note in each tool that
#    reads it; the mark at the title card
kw = lambda lid, word, off=0: W('kilo', lid, word, off)
k0 = S0('kilo')
tap(k0 + 0.6, 0.007, px(400))
line(((C4, 0.0, 0.3), (E4, 0.34, 0.3), (G4, 0.68, 0.5)), k0 + 0.5, 0.85, px(960))
low(C3, k0 + 0.5, 0.9, 0.8)
knock(kw('place', 'platinum', 0.05), 0.012, px(1245), 250)
knock(kw('place', 'becomes', 0.05), 0.013, px(960), 230)
line(((G4, 0.0, 0.22), (C5, 0.26, 0.45)), kw('place', 'becomes', 0.1), 0.8, px(960))
# forty copies go out, round the world: the line spreads from left to right as the arc fills
for i, (m, at) in enumerate(((E4, 0.0), (G4, 0.24), (A4, 0.48), (G4, 0.72))):
    reed(m, kw('copies', 'Forty', 0.1) + at, 0.2, 0.75, (-0.5, -0.17, 0.17, 0.5)[i])
for i in range(3):
    clink(kw('copies', 'checks', 0.1 + 0.4 * i), 0.006, px((700, 1250, 980)[i]), (880, 990, 830)[i])
low(F3, kw('copies', 'against its copy', 0.0), 0.5, 0.7); reed(C5, kw('copies', 'against its copy', 0.0), 0.4, 0.6, px(960))
# but only the cylinder is the kilogram: A minor
low(A2, kw('only', 'only', -0.05), 0.8, 0.8)
line(((C5, 0.0, 0.3), (B4, 0.38, 0.3), (A4, 0.76, 0.5)), kw('only', 'only', 0.4), 0.7, px(960))
for i in range(3):
    tap(kw('only', 'every', 0.5 + 0.45 * i), 0.008, px(1450 + 130 * i))
clink(kw('only', 'weighed', 0.0), 0.007, px(1580), 930)
# they drift apart: the two organettes move apart, one up and one down
for (hi, lo_, at) in ((C5, A3, 0.0), (D5, G3, 0.4), (E5, C3, 0.8)):
    reed(hi, kw('drift', 'drifted', 0.0) + at, 0.3 if at < 0.8 else 0.45, 0.65, px(1700))
    low(lo_, kw('drift', 'drifted', 0.0) + at, 0.3 if at < 0.8 else 0.45, 0.7, px(1240))
tap(kw('drift', 'fifty', 0.1), 0.008, px(1520))
# nobody can tell which has moved: a line left hanging
tap(kw('which', 'Nobody', 0.05), 0.008, px(300))
tap(kw('which', 'Nobody', 0.65), 0.008, px(960))
line(((A4, 0.0, 0.3), (B4, 0.36, 0.5)), kw('which', 'which has moved', 0.0), 0.7, px(960))
# everything rests on one object, in one place, which could be scratched
low(A2, kw('rests', 'rests', 0.0), 0.7, 0.75)
scrape(kw('rests', 'scratched', 0.0), 0.45, 0.006, px(960), 500, 1500)
tap(kw('rests', 'scratched', 0.25), 0.008, px(520))
# something had to change: no music, no sound. Then 2018, C major
knock(kw('vote', 'conference', -0.3), 0.013, px(356), 240)
low(C3, kw('vote', 'conference', -0.2), 0.6, 0.75); line(((G4, 0.0, 0.25), (C5, 0.3, 0.45)), kw('vote', 'conference', -0.2), 0.7, px(356))
tap(kw('vote', 'anew', 0.05), 0.008, px(356))
reed(E5, kw('vote', 'anew', 0.1), 0.45, 0.6, px(356))
# from May 2019, a constant of nature: the Planck card
knock(kw('constant', 'From', 0.4), 0.013, px(960), 230)
low(C3, kw('constant', 'From', 0.45), 0.8, 0.75); line(((G4, 0.0, 0.25), (C5, 0.28, 0.25), (E5, 0.56, 0.5)), kw('constant', 'From', 0.45), 0.7, px(960))
tap(kw('constant', 'fixed', -0.15), 0.008, px(960))
# any lab can make a kilogram from it: the large organette alone, a second maker; the Kibble balance and its field
line(((C3, 0.0, 0.25), (E3, 0.3, 0.25), (G3, 0.6, 0.25), (C4, 0.9, 0.55)), kw('make', 'lab', 0.0), 0.8, px(1300), low)
knock(kw('make', 'Kibble', -0.2), 0.013, px(1580), 240)
air(kw('make', 'weighs', 0.0), 1.0, 0.007, px(1580), 160, 800)
# one definition, the same for everyone: the copies turn gold, and the mark
mark(kw('same', 'the same for everyone', -0.1), 0.95)
# the United States' standard: copy number 20 struck through, the balance in its place
knock(kw('us', 'United States', -0.2), 0.012, px(360), 240)
line(((E4, 0.0, 0.3), (G4, 0.36, 0.45)), kw('us', 'such a balance', 0.0), 0.6, px(360))
scrape(kw('us', 'copy number', 0.05), 0.35, 0.006, px(360), 400, 1400)
tap(kw('us', 'copy number', 0.95), 0.008, px(360))
# the university: the same problem, A minor; three tools, three numbers, each a note of its own; a question left open
tap(kw('uni', 'At the university', 0.0), 0.008, px(300))
low(A2, kw('uni', 'At the university', 0.0), 0.7, 0.75)
tap(kw('uni', 'measure', 0.05), 0.008, px(960))
for i, (m, who) in enumerate(((E4, reed), (A3, low), (C5, reed))):
    knock(kw('three', 'three tools', 0.25 + 0.4 * i), 0.011, px((360, 960, 1560)[i]), 240)
    who(m, kw('three', 'three tools', 0.3 + 0.4 * i), 0.3, 0.65, px((360, 960, 1560)[i]))
tap(kw('three', 'nobody', 0.0), 0.008, px(960))
reed(B4, kw('three', 'nobody', 0.1), 0.5, 0.6, px(960))
# now it's defined once: C major, the gold card; and every tool gives the same number, the same note in each
knock(kw('now', 'defined once', 0.2), 0.013, px(960), 230)
low(C3, kw('now', 'defined once', 0.2), 0.6, 0.75); line(((E4, 0.0, 0.22), (G4, 0.26, 0.22), (C5, 0.52, 0.45)), kw('now', 'defined once', 0.2), 0.7, px(960))
for i in range(3):
    tap(kw('now', 'every tool', 0.35 * i), 0.007, px((400, 960, 1520)[i]))
    reed(C5, kw('now', 'every tool', 0.05 + 0.35 * i), 0.22, 0.55, px((400, 960, 1520)[i]))
# the title card: the mark
mark(G('kilo', 'breath', 0.4), 0.85)

# 2. Three numbers, one name: A minor. The large organette at the turn; the HR system and the claims app, their cards set down; Health's
#    question, a line that rises and stops; the three windows, each set down with its number; all three under one name, their three
#    notes together; the budget short, one low A; Rohan, whose definition lived only in his report: a short line, then a small lock
ew = lambda lid, word, off=0: W('three', lid, word, off)
e0 = S0('three')
low(A2, e0 + 0.4, 0.7, 0.7)
knock(ew('what', 'Casual', -0.2), 0.012, px(490), 240)
knock(ew('what', 'tutors hired', 0.0), 0.011, px(1150), 250)
knock(ew('what', 'claim', 0.0), 0.011, px(1150), 260)
knock(ew('asked', 'Planning', 0.0), 0.012, px(960), 230)
line(((E4, 0.0, 0.3), (A4, 0.36, 0.5)), ew('asked', 'Planning', 0.1), 0.65, px(960))
for i, (lid, word) in enumerate((('sheet', 'spreadsheet'), ('payroll', "Payroll's"), ('finance', "Finance's"))):
    knock(ew(lid, word, -0.2), 0.011, px((360, 960, 1560)[i]), 240)
tap(ew('finance', 'what the university', 0.0), 0.008, px(1500))
for i in range(3):
    tap(ew('right', 'Each', 0.3 + 0.35 * i), 0.007, px((360, 960, 1560)[i]))
line(((A3, 0.0, 0.5),), ew('right', 'all three', 0.0), 0.65, px(960), low)
reed(E4, ew('right', 'all three', 0.12), 0.45, 0.6, px(600)); reed(C5, ew('right', 'all three', 0.24), 0.4, 0.55, px(1320))
knock(ew('short', 'Budget', -0.1), 0.012, px(700), 230)
low(A2, ew('short', 'three hundred', 0.0), 0.8, 0.75)
for i in range(3):
    tap(ew('short', 'one tutorial', -0.3 + 0.35 * i), 0.006, px(600 + 180 * i))
line(((G4, 0.0, 0.3), (E4, 0.36, 0.45)), ew('inside', 'Rohan', -0.3), 0.6, px(1030))
tap(ew('inside', 'Rohan', 0.0), 0.007, px(700))
lock(ew('inside', 'only inside', 0.6), 0.009, px(1560))

# 3. Its owner, its words, its rules: C major. Like the kilogram, the Planck card, low C and G at the turn; the empty card for one
#    definition; defined once in September, a short rise as the definition is set down; each line of it a tap as it comes in;
#    Ingrid, for the claims' fields, one note; the other two numbers, each a card and a note of its own
ow = lambda lid, word, off=0: W('once', lid, word, off)
knock(ow('like', 'Like', -0.2), 0.012, px(960), 230)
low(C3, ow('like', 'Like', -0.1), 0.6, 0.7); reed(G4, ow('like', 'Like', -0.1), 0.45, 0.6, px(960))
tap(ow('like', 'one definition', 0.0), 0.007, px(960))
knock(ow('sept', 'September', 0.1), 0.012, px(960), 240)
line(((C5, 0.0, 0.25), (E5, 0.3, 0.45)), ow('sept', 'September', 0.2), 0.6, px(960))
tap(ow('sept', 'Rohan', 0.0), 0.007, px(300))
tap(ow('sept', 'Jun', 0.0), 0.007, px(1640))
for lid, word, off in (('owner', 'owner', -0.2), ('words', 'words', -0.2), ('words', 'Also called', -0.1), ('rules', 'claims approved', 0.0),
                       ('rules', 'by casual staff', 0.0), ('rules', 'for teaching', 0.0), ('rules', 'plus on costs', 0.0), ('period', 'Counted', 0.0)):
    tap(ow(lid, word, off), 0.007, px(960))
tap(ow('ingrid', 'The claims', 0.0), 0.007, px(1640))
reed(F4, ow('ingrid', 'Ingrid', -0.1), 0.45, 0.55, px(1640))
knock(ow('names', 'casual hours contracted', 0.0), 0.011, px(750), 240)
reed(E4, ow('names', 'casual hours contracted', 0.05), 0.35, 0.55, px(750))
knock(ow('names', 'casual pay paid', 0.0), 0.011, px(1210), 250)
reed(G4, ow('names', 'casual pay paid', 0.05), 0.4, 0.55, px(1210))

# 4. Near the data, built as code: the platform comes up, low C and E at the turn; the metric view and the fact beside it, each set
#    down; grouped by faculty, unit and teaching period; Finance's lock; every tool reads it, a short line; the data project's window,
#    its YAML typed; built as Meaning built awards conferred; the pull request, Rohan's approval and Noor's, a line that settles; its
#    words, each line lit
nw = lambda lid, word, off=0: W('near', lid, word, off)
n0 = S0('near')
air(n0 + 0.2, 0.9, 0.007, px(650), 150, 800)
low(C3, n0 + 0.4, 0.5, 0.7); reed(E4, n0 + 0.4, 0.35, 0.55, px(650))
knock(nw('home', 'metric view', 0.0), 0.012, px(430), 240)
knock(nw('home', 'beside', 0.0), 0.011, px(430), 260)
for word in ('by faculty', 'unit', 'teaching period'):
    tap(nw('view', word, -0.1), 0.007, px(990))
lock(nw('gov', 'who may read', 0.0), 0.008, px(300))
for i in range(4):
    tap(nw('every', 'every tool', -0.3 + 0.3 * i), 0.006, px(1580))
line(((G4, 0.0, 0.25), (A4, 0.3, 0.25), (C5, 0.6, 0.45)), nw('every', 'every tool', 0.0), 0.6, px(1580))
air(nw('yaml', 'Jun', -0.1), 0.8, 0.007, px(640), 160, 900)
keys(nw('yaml', 'YAML', -0.2), 8, 2.4, 0.006, px(640))
knock(nw('yaml', 'as Meaning', 0.0), 0.011, px(1550), 240)
knock(nw('review', 'pull request', -0.2), 0.012, px(1550), 230)
tap(nw('review', 'pull request', 0.75), 0.008, px(1550))
tap(nw('review', 'the change to production', 0.35), 0.008, px(1550))
line(((E4, 0.0, 0.25), (G4, 0.3, 0.25), (C5, 0.6, 0.5)), nw('review', 'the change to production', 0.4), 0.6, px(1550))
for word in ('a name to show', 'a description', 'synonyms', 'its format'):
    tap(nw('meta', word, 0.0), 0.007, px(640))

# 5. The same idea in dbt: decades of BI tools, each window set down, low G at the turn; no other tool could read them, two soft
#    crosses and a falling line; a new tool, its definitions written again; dbt's MetricFlow window opens, low C and C above; its
#    YAML typed, Planning's card; open source; either can be a measure's home: the measure set in one, a short line as it lands;
#    never a second definition: a pen's stroke through it
dw = lambda lid, word, off=0: W('dbt', lid, word, off)
for i in range(3):
    knock(dw('old', 'decades', -0.2 + 0.3 * i), 0.011, px(370 + 560 * i), 240 + 15 * i)
low(G3, dw('old', 'decades', 0.0), 0.5, 0.65)
tap(dw('own', 'no other tool', 0.0), 0.007, px(650)); tap(dw('own', 'no other tool', 0.12), 0.007, px(1210))
line(((B4, 0.0, 0.3), (A4, 0.36, 0.45)), dw('own', 'no other tool', 0.1), 0.55, px(930))
knock(dw('own', 'a new tool', 0.0), 0.011, px(930), 250)
keys(dw('own', 'writing', 0.0), 6, 2.0, 0.006, px(930))
air(dw('mf', 'dbt', -0.1), 0.8, 0.007, px(645), 160, 900)
low(C3, dw('mf', 'dbt', 0.0), 0.45, 0.65); reed(C5, dw('mf', 'dbt', 0.0), 0.4, 0.5, px(645))
keys(dw('mf', 'YAML', -0.2), 6, 1.2, 0.006, px(645))
knock(dw('planning', 'Planning', 0.0), 0.011, px(1550), 240)
tap(dw('planning', 'learners', 0.0), 0.007, px(645))
tap(dw('source', 'open source', 0.0), 0.008, px(1450))
knock(dw('choose', 'Either', 0.0), 0.011, px(450), 240); knock(dw('choose', 'Either', 0.3), 0.011, px(1470), 255)
air(dw('choose', 'Choose', 0.0), 1.2, 0.006, px(600), 160, 800)
knock(dw('choose', 'Choose', 1.2), 0.012, px(450), 230)
line(((E4, 0.0, 0.3), (C5, 0.36, 0.5)), dw('choose', 'Choose', 1.2), 0.55, px(450))
tap(dw('choose', 'never', 0.0), 0.007, px(1470))
scrape(dw('choose', 'never', 0.3), 0.5, 0.006, px(1470), 400, 1400)

# 6. A format any tool can read: the tools round the hub; Apache Ossie at the centre, a rising line over low C; the ring of fifty
#    organisations; the converters run out to each tool; dbt writes the project's measures in Ossie, and reads them; casual teaching
#    cost travels from its home over the format into a tool that reads it, and a short line as it arrives; each rule kept inside the
#    measure; and a converter's notice, a line that falls
pw = lambda lid, word, off=0: W('open', lid, word, off)
air(pw('common', 'For tools', 0.0), 0.9, 0.007, px(960), 150, 800)
low(C3, pw('common', 'common format', 0.0), 0.8, 0.7)
line(((G4, 0.0, 0.25), (C5, 0.28, 0.25), (E5, 0.56, 0.5)), pw('common', 'common format', 0.0), 0.6, px(960))
tap(pw('began', 'began', 0.0), 0.007, px(960))
air(pw('began', 'more than fifty', 0.0), 1.4, 0.006, px(960), 160, 800)
tap(pw('began', 'Databricks', 0.0), 0.007, px(960))
air(pw('conv', 'Converters', 0.0), 1.6, 0.006, px(960), 160, 900)
for word in ('a metric view', 'MetricFlow', 'many others'):
    tap(pw('conv', word, 0.0), 0.007, px(960))
air(pw('writes', 'dbt writes', -0.1), 0.8, 0.006, px(1460), 160, 900)
knock(pw('writes', 'dbt writes', 0.0), 0.011, px(1460), 240)
keys(pw('writes', 'each time', -0.3), 5, 0.8, 0.006, px(1460))
air(pw('writes', 'reads Ossie', 0.0), 0.8, 0.006, px(1265), 180, 900)
tap(pw('writes', 'reads Ossie', 0.1), 0.007, px(1615))
air(pw('travel', 'casual teaching cost', 0.2), 2.2, 0.006, px(960), 160, 800)
tap(pw('travel', 'casual teaching cost', 2.3), 0.008, px(1600))
line(((G4, 0.0, 0.22), (C5, 0.26, 0.45)), pw('travel', 'casual teaching cost', 2.3), 0.6, px(1600))
air(pw('inside', 'Keep', -0.1), 0.8, 0.006, px(500), 160, 900)
tap(pw('inside', 'inside the measure', 0.0), 0.007, px(500))
tap(pw('inside', 'travels', 0.2), 0.007, px(520))
tap(pw('check', 'a converter', 0.0), 0.008, px(1450))
line(((B4, 0.0, 0.3), (A4, 0.36, 0.5)), pw('check', 'a converter', 0.05), 0.55, px(1450))

# 7. One number, in every tool: pay day, low C at the turn and the dashboard set down; Rohan asks Genie One, the question typed, the
#    answer one note; the dashboard's Ask Genie gives the same, from the same definition: the mark, the small organette at Genie One and
#    the large one at the dashboard; last semester's three names, each card set down; the budget, every tutorial's tutor in it, a line
#    that rises; like the kilogram, one definition: low C and G; the standards, set out; the four steps; the end card: the mark
sw = lambda lid, word, off=0: W('same', lid, word, off)
s0 = S0('same')
tap(sw('today', 'Today', 0.0), 0.007, px(400))
knock(sw('today', 'pay day', -0.2), 0.012, px(1610), 230)
low(C3, sw('today', 'pay day', -0.1), 0.6, 0.65)
air(sw('asks', 'Rohan asks', -0.2), 0.8, 0.007, px(930), 160, 900)
keys(sw('asks', 'Rohan asks', 0.0), 7, 2.2, 0.006, px(930))
reed(C5, sw('asks', 'one point', 0.0), 0.5, 0.55, px(930))
tap(sw('dash', 'Ask Genie', 0.0), 0.008, px(1450))
mark(sw('dash', 'gives the same', 0.0), 0.85, px(930), px(1610))
for i, (word, x) in enumerate((('Last', 775), ('the other two', 1225), ('each under', 1675))):
    knock(sw('last', word, -0.2 if i == 0 else 0.1 * i), 0.011, px(x), 240 + 10 * i)
knock(sw('budget', 'budget', -0.4), 0.012, px(1000), 230)
for i in range(3):
    tap(sw('budget', "every tutorial's", -0.3 + 0.3 * i), 0.006, px(800 + 200 * i))
line(((C5, 0.0, 0.22), (E5, 0.26, 0.22), (G5, 0.52, 0.45)), sw('budget', "every tutorial's", 0.0), 0.5, px(1000))
knock(sw('kilo', 'Like the kilogram', -0.1), 0.012, px(700), 230)
low(C3, sw('kilo', 'Like the kilogram', 0.0), 0.6, 0.65); reed(G4, sw('kilo', 'Like the kilogram', 0.0), 0.45, 0.55, px(700))
knock(sw('kilo', 'one definition', -0.2), 0.011, px(1330), 245)
tap(sw('kilo', 'held by no', 0.0), 0.008, px(960))
knock(sw('close', 'standards', -0.1), 0.011, px(960), 240)
for i, word in enumerate(('investigate', 'adapt', 'implement', 'iterate')):
    tap(sw('close', word, -0.1), 0.007, px(330 + 420 * i))
tap(sw('close', 'official docs', -0.2), 0.008, px(960))
mark(G('same', 'breath', 0.5), 0.8)
