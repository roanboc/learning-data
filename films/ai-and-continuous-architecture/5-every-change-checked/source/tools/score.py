# Every change, checked: the music and sounds, played by tools/audio.py with From words to data's helpers
# (shared/tools/music.py). This film's palette, reserved on 12 November 2026 in the four architecture series' palettes (the project's
# enterprise-architecture/new-architecture-series/palettes.md): a xylophone and a glass harmonica, both made here (music.py has
# neither). Nothing new fitted that isn't another culture's or the region's, so this film pairs two instruments the site has, which no
# film pairs and no film of this topic plays (Governed in dbt's xylophone, with a string quartet; Fixed where it starts' glass harmonica,
# with handbells). That pairing is the palettes file's exception, written down as an assumption in the film's assumptions file.
#  - The xylophone (xy()): wooden bars, each cut to one note and laid side by side in a row, as bricks are laid in a course, struck
#    softly with yarn mallets. A dry, warm, short note: the bar's own note, the overtone its maker tunes a twelfth above it, a higher
#    mode gone at once, the yarn's soft contact and the mallet's small knock; no tubes ringing under it, nothing rolled. Low in its range
#    (E flat 4 to E flat 5; the series' mark reaches G 5), low-passed at 2.4 kHz. It marks what is laid and what is walked: a note as
#    the river wall is laid and a brick stamped in Babylon, a note for each row as the agent walks a change down the map, and one low
#    note, F, left unanswered where a check stops something. Governed in dbt's xylophone marks a check's red or green; here the checks'
#    ticks are effects, and the xylophone marks bricks and layers.
#  - The glass harmonica (gh(), spread()): glass bowls nested on one spindle, each showing only its rim, sounded by a wet finger as
#    the spindle turns. A nearly pure note that blooms in slowly, holds level and fades when the finger lifts, the bowl ringing on a
#    moment; chords spread from the bass up (A flat 3 to E flat 5). It holds the opening story's chords, and after it sounds only where
#    a person decides: owners confirming changes, an owner saying why, the head of retail taking the new service and deciding where the
#    numbers come from, and the owners deciding at the end. Never for the agent or a check.
#  - The film's own figure (figure()), once in Babylon and once near the end: a phrase on the xylophone that steps down, one note to a
#    stretch of wall or a layer of the map, and the glass harmonica's chord that answers it only once every step is there. Kings laying
#    the river wall again, stretch by stretch, on the same line; and the wall and the map side by side, every layer walked.
#    The series' mark (mark()), under the title and the end card: four notes rising like a tower's tiers, a fifth, a fourth and a third
#    (E flat, B flat, E flat, G), on the xylophone, over the glass harmonica's E flat.
#  - E flat major, C minor where things go wrong, tuned pure from E flat (hz()). E flat, A flat and B flat major, C and G minor are pure
#    in this tuning; F with A flat (32/27), F with C (40/27) and D with A flat are not, so no two of those ever sound together (the
#    score stops if they would: _pure()), and there's no F minor.
# The films' sound (the author's rule, 20 October 2026, and the review of 4 November 2026):
#  - Music plays under the opening story, a chord or a note to each picture. After it, music comes now and then: a note under a moment
#    on screen, a chord where a person decides, or the figure in a pause. Nothing is held under the explaining, and nothing pulses
#    (film.json lists no "urgent" chapter: the wrong date is told after it happened, not as a rush).
#  - Nothing trembles: no vibrato; every chord is tuned pure, and every held note keeps its own level in the room.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears, from the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed: change one, change both.
#  - Everything stays low and soft, below about 2.4 kHz: water at the river wall, workmen's baskets, a stamp pressed into a brick, a
#    stylus in clay, a trowel in the dig, paper, cards set down, a pen's ticks and strokes, a switch thrown, a phone buzzing on a table,
#    a gate's bar, a lock's click, muffled keys, and a breath of air.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word, or one inside a longer word, stops the mix
import json as _json, math as _math, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text(encoding='utf-8'))
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def END(sid, lid):
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(626)  # this film's own randomness (Nabopolassar's reign began in 626 BCE): the room, the yarn, the glass

# ---- tuning: just intonation from E flat 4 (311.13 Hz), so a chord's notes are whole-number ratios of each other and nothing beats.
# Every pitch comes from this one scale, so a note two chords share is the same in both
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (63, 311.127)  # E flat 4: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Ab3, Bb3, C4, D4, Eb4, F4, G4, Ab4, Bb4, C5, D5, Eb5, G5 = 56, 58, 60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 79
# the notes that are never heard together: F with A flat, F with C, D with A flat (pitch classes counted from E flat)
_IMPURE = {frozenset((2, 5)): 'F with A flat', frozenset((2, 9)): 'F with C', frozenset((11, 5)): 'D with A flat'}
_LEDGER = []  # every note placed: (from, to, MIDI note, line of this score)
def _log(m, a, b):
    import traceback
    _LEDGER.append((a, b, m, [f.lineno for f in traceback.extract_stack() if f.filename.endswith('score.py')][-2:]))
def _pure():
    """stops the mix where two notes that aren't pure in this tuning would sound together"""
    for i, (a, b, m, la) in enumerate(_LEDGER):
        for c, d, q, lb in _LEDGER[i + 1:]:
            k = frozenset(((m - KEY[0]) % 12, (q - KEY[0]) % 12))
            assert not (c < b and a < d and k in _IMPURE), '%s would sound together at %.1f s (score lines %s and %s)' % (_IMPURE[k], max(a, c), la, lb)

# ---- the levels: the xylophone and the glass about as far under the narration as the series' other music (matched by loudness, as
# tools/quiet.py measures it); the effects about 16 dB under the music (FX scales them all)
XL, GL, FX = 0.06, 0.024, 2.0

# ---- the room: a plastered hall, small, ringing on for about a second, nothing much above 1.7 kHz. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is played into it and set back to its own level,
# where it's held (_held), as the video guidelines ask (held.py checks both)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.013 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, amt):
    return np.pad(sig, (0, len(_IR) - 1)) + amt * fftconvolve(sig, _IR).astype(np.float32) if amt else sig
def _held(sig, amt):
    """a note in the room, at its own level: the room's echoes meet a note's own sound at its pitch, adding to it on one note and
    taking from it on another, so the note is set back to the level it had without the room where it's held (within 3 dB of its own
    level, after its first quarter second), as tools/quiet.py measures it"""
    out = _room(sig, amt); h = SR // 100; k = len(sig) // h
    if not amt or k < 35:
        return out
    dry = (sig[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1); wet = (out[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1)
    lv = np.convolve(dry, np.ones(10) / 10, 'same')[25:]; on = np.nonzero(lv >= lv.max() * 10 ** -0.3)[0] + 25
    return out * np.float32(np.sqrt(dry[on].sum() / max(1e-12, wet[on].sum())))
def _nz(sec):
    """the film's own noise, the same each time the score plays"""
    return R1.standard_normal(max(1, int(sec * SR))).astype(np.float32)

# ---- the xylophone. A bar of rosewood, free at both ends, undercut by its maker so its first overtone sits a twelfth (three times)
# over its note; the next mode, untuned, a little over six times, dies at once. The yarn mallet meets the bar softly, for a couple of
# thousandths of a second, so the note has no click, only a small, dull knock of wood under yarn. With no tube under it, the note is dry
# and short: about a third of a second at E flat 4, shorter as it rises, the overtone gone first
XY_LO, XY_HI = Eb4, G5
def _tau(m):
    return 0.36 * (311.13 / hz(m)) ** 0.55
def _xy(m):
    f0 = hz(m); tau = _tau(m); sec = 6 * tau + 0.05; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.sin(2 * np.pi * f0 * x) * np.exp(-x / tau)
    for r, a, d in ((3.0, 0.30, 0.34), (6.27, 0.06, 0.11)):  # the twelfth its maker tunes, and a higher mode, gone at once
        if r * f0 < 2400:
            sig += a * np.sin(2 * np.pi * r * f0 * x + 0.4 * r) * np.exp(-x / (d * tau))
    sig *= np.minimum(1, x / 0.0025)
    nk = int(0.03 * SR)
    sig[:nk] += 0.09 * filt(_nz(0.03)[:nk], 'band', (300, 1400)) * np.exp(-x[:nk] / 0.004)
    return norm(filt(filt(sig.astype(np.float32), 'low', 2400), 'high', 120))
def xy(m, s, g=1.0, pan=None, room=0.12):
    """one bar struck softly with a yarn mallet"""
    assert XY_LO <= m <= XY_HI, 'the xylophone plays E flat 4 to G 5'
    _log(m, s, s + 2.2 * _tau(m))
    put(_room(_xy(m), room), s, g * XL, max(-0.35, min(0.35, (m - Bb4) * 0.025)) if pan is None else pan)

# ---- the glass harmonica. A glass bowl turning under a wet finger: nearly a pure note, with a trace of its octave and twelfth from the
# rubbing, that blooms in as the finger finds the rim (slower the lower it is) and holds there, level, with the soft hush of the wet
# finger while it touches; when the finger lifts, the bowl rings on a moment and fades. No tremolo, no vibrato: the spindle turns
# evenly. Each note is held in the room at its own level (_held)
GH_LO, GH_HI = Ab3, Eb5
ROOM = 0.22  # how much of the room each held note carries
def _gh(m, hold):
    f = hz(m); a = float(np.clip(0.42 * (207.4 / f) ** 0.6, 0.22, 0.5)); rel = 0.9
    n = int((hold + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    e = np.where(x < a, np.sin(0.5 * np.pi * np.minimum(x / a, 1)) ** 2, 1.0)
    e = e * np.where(x > hold, np.exp(-(x - hold) / 0.3), 1.0) * np.clip((hold + rel + 0.05 - x) / 0.05, 0, 1)
    ph = 2 * np.pi * f * x
    s = (np.sin(ph) + 0.035 * np.sin(2 * ph + 0.6) + 0.012 * np.sin(3 * ph + 1.3)) * e
    touch = np.minimum(x / a, 1) * np.clip((hold - x) / 0.2, 0, 1)
    s = s + 0.010 * filt(_nz(n / SR + 0.01)[:n], 'band', (f * 0.9, min(2200, f * 2.2))) * touch
    return filt(s.astype(np.float32), 'low', 2400)
def gh(m, a, b, g=1.0, pan=None):
    """one bowl, sounded from a to b, then let go"""
    assert GH_LO <= m <= GH_HI, 'the glass harmonica plays A flat 3 to E flat 5'
    assert b > a, 'the glass: a note ends before it starts (%.2f to %.2f)' % (a, b)
    _log(m, a, b + 0.9)
    put(_held(_gh(m, b - a), ROOM), a, g * GL, max(-0.3, min(0.3, (m - Eb4) * 0.02)) if pan is None else pan)
def spread(notes, s, sec, g=1.0, step=0.2):
    """a chord spread from the bass up, every bowl held until the chord is let go, together"""
    for i, m in enumerate(notes):
        gh(m, s + step * i, s + sec, g * (1.0 if i == 0 else 0.86))

# ---- what they play
def figure(s, steps, answer, g=1.0, step=0.45, hold=2.4):
    """the film's own figure: the xylophone steps down, one note to a stretch or a layer; once every step is there, the glass answers"""
    for i, m in enumerate(steps):
        xy(m, s + step * i, g * (0.92 if i else 1.0))
    spread(answer, s + step * len(steps) + 0.35, hold, g)
MARK = (Eb4, Bb4, Eb5, G5)  # a fifth, a fourth and a third, rising like a tower's tiers
def mark(s, g=1.0, step=0.42, hold=3.0):
    """the series' mark on the xylophone, over the glass harmonica's E flat"""
    gh(Eb4, s, s + step * 3 + hold, 0.9 * g)
    for i, m in enumerate(MARK):
        xy(m, s + 0.1 + step * i, g * (0.9 if i < 3 else 0.96))

# chords (MIDI note numbers), spread from the bass up
EB1, EB2, EB3, EB4 = (Bb3, Eb4, G4), (Eb4, G4, Bb4), (G4, Bb4, Eb5), (Eb4, G4, Bb4, Eb5)
AB1, AB2, AB3 = (Ab3, C4, Eb4), (C4, Eb4, Ab4), (Eb4, Ab4, C5)
BB1, BB2 = (Bb3, D4, F4), (D4, F4, Bb4)
CM1 = (C4, Eb4, G4)
GM1 = (D4, G4, Bb4)

# ---- the sounds on screen: soft, low, one at a time, each made here, on the effects bus
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _hump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _thud(n, f, d):
    x = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.1 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015)
def lap(s, sec=1.2, g=0.006, pan=0.0):
    """the river against the wall: one slow, low lap of water"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (140, 600)) * _hump(x, sec, 1.6), s, g, pan, 700)
def basket(s, g=0.008, pan=0.0):
    """a workman's basket of bricks set down: a dull, soft landing and a little grit settling"""
    n = int(0.32 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 95, 0.035) + 0.35 * filt(_nz(0.34)[:n], 'band', (250, 1100)) * _hump(x, 0.22, 1.4), s, g, pan, 1200)
def stamp(s, g=0.011, pan=0.0):
    """a stamp pressed into a brick's edge: a short, damp press and a low, soft thud as it bears down"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(0.6 * _thud(n, 120, 0.03) + filt(_nz(0.32)[:n], 'band', (300, 1100)) * _hump(x, 0.12, 2), s, g, pan, 1100)
def stylus(s, sec=1.2, g=0.004, pan=0.0, k=4):
    """a stylus drawn through damp clay, a stroke at a time: lower and softer than a pen"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        _fx(filt(_nz(d + 0.02)[:m], 'band', (260, 1000)) * _hump(x, d, 0.8), t, g, pan, 1100)
def clay(s, g=0.011, pan=0.0):
    """a clay tablet set down on wood: a soft, dull knock"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    _fx(np.sin(2 * np.pi * 190 * x) * np.exp(-x * 40) + 0.35 * filt(_nz(0.22)[:n], 'band', (250, 900)) * np.exp(-x * 55), s, g, pan, 1200)
def trowel(s, sec=0.8, g=0.006, pan=0.0):
    """a trowel drawn over packed earth: a dry scrape that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(_nz(sec + 0.02)[:n], 'low', 45)); gr = gr / max(1e-9, float(gr.max()))
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (300, 1300)) * _hump(x, sec, 1.0) * (0.45 + 0.55 * gr), s, g, pan, 1400)
def hush(s, sec=1.4, g=0.004, pan=0.0):
    """many small things coming in at once (stamps, ticks, dots, runs): one soft hush that swells and fades, never a burst of taps"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (300, 1400)) * _hump(x, sec, 1.6), s, g, pan, 1500)
def paper(s, g=0.011, pan=0.0, sec=0.45):
    """paper, softly: a sheet, a letter or a card coming in"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (250, 2000)) * _hump(x, sec, 2), s, g, pan, 2000)
def pencil(s, sec=0.6, g=0.004, pan=0.0, k=3):
    """a pen on paper, a stroke at a time"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(_nz(d + 0.02)[:m], 'low', 50)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(_nz(d + 0.02)[:m], 'band', (600, 1900)) * _hump(x, d, 0.7) * (0.35 + 0.65 * gr), t, g, pan, 2000)
def tick(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pencil(s, 0.22, g, pan, 2)
def strike(s, g=0.006, pan=0.0, sec=0.4):
    """a line struck through, or a cross: a pen drawn quickly"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (450, 1800)) * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g, pan, 1900)
def drag(s, sec=1.2, g=0.005, pan=0.0):
    """something drawn or slid across: a slow, dry drag"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (350, 1300)) * _hump(x, sec, 1.0), s, g, pan, 1500)
def knock(s, g=0.009, pan=0.0, f=240):
    """a soft wooden knock, for a card or a box arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.007, pan=0.0):
    """a muffled key, or a tag set in place"""
    s_tap(s, g * FX, pan)
def lock(s, g=0.008, pan=0.0):
    """a lock's click: a small click and a low knock"""
    s_tap(s, g * FX, pan); s_knock(s + 0.05, g * 0.7 * FX, pan, 180)
def clunk(s, g=0.010, pan=0.0):
    """a street's power switched off: a switch thrown, low and heavy, and the line going quiet"""
    n = int(0.5 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 70, 0.06) + 0.25 * filt(_nz(0.52)[:n], 'band', (200, 700)) * np.exp(-x / 0.02), s, g, pan, 800)
def buzz(s, g=0.006, pan=0.0):
    """a phone on a table, buzzing twice as a text arrives: low and short, nothing bright"""
    for k in range(2):
        n = int(0.2 * SR); x = np.arange(n) / SR; f0 = 160
        sig = sum(a * np.sin(2 * np.pi * f0 * h * x) for h, a in ((1, 1.0), (2, 0.4), (3, 0.15))) * _hump(x, 0.2, 0.6)
        _fx(sig, s + 0.32 * k, g, pan, 700)
def creak(s, sec=0.7, g=0.005, pan=0.0):
    """a gate's wooden bar lifted: a slow, soft creak at its pivot"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (220, 700)) * _hump(x, sec, 1.4) * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * x) ** 2), s, g, pan, 900)
def air(s, sec=0.9, g=0.008, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)


# 1. A name and a purpose: the opening, a chord or a note to each picture. Babylon at dawn, the river under its wall: the glass in
#    E flat, low, and the water; a workman's basket set down, and the xylophone's E flat as the wall of baked brick is lit; A flat as it
#    keeps the water out. King after king: the film's figure, the xylophone stepping down as each stretch is laid again on the same line,
#    and the glass's E flat answering once all three are there. Lost among millions: C minor. The king's fear: G minor, and a tablet as
#    his words come in. Every stretch needed to say: B flat. On the edges: E flat, high; the stamp pressed, with the xylophone's note,
#    and a stylus for the brick written by hand. What one reads: A flat, under the king's words. The dig, two and a half thousand years
#    later: air, a trowel, and the xylophone rising as the stamped bricks still say which king built each stretch. The plan: paper, one
#    hush for its sixteen bricks, and A flat. The utility: B flat, a card, a tick for its owner and a key for its source; the map: a hush
#    as every element is stamped, a tick as a change is checked, air as it's walked, and E flat. Under the title, the series' mark
K = 'brick'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(0.3, 2.6, 0.007, 0.0)
spread(EB1, 0.6, 6.6, 0.9, 0.24)
lap(2.0, 1.4, 0.006, px(1680))
basket(w('city', 'workmen', 0.4), 0.007, px(640))
xy(Eb4, w('city', 'wall of baked brick', -0.1), 0.85, px(960))
spread(AB1, w('city', 'to keep', -0.1), 3.0, 0.85, 0.2)
tKa = w('never', 'king after king')
figure(tKa + 0.5, (Bb4, Ab4, G4), EB2, 0.95, 0.5, 2.6)
spread(CM1, w('lost', 'nobody', -0.2), 3.0, 0.85, 0.2)
spread(GM1, w('feared', 'feared', -0.2), 2.8, 0.8, 0.2)
clay(w('feared', 'his words', -0.1), 0.010, px(960))
spread(BB1, w('need', 'Every stretch', -0.2), 3.0, 0.82, 0.2)
spread(EB3, w('edge', 'So on the edges', -0.1), 3.4, 0.78, 0.2)
stamp(w('edge', 'stamped', -0.25), 0.011, px(660)); xy(Bb4, w('edge', 'stamped', -0.05), 0.85, px(660))
stylus(w('edge', 'wrote', -0.1), 1.4, 0.004, px(1490))
clay(wc('reads', -0.1), 0.010, px(960))
spread(AB3, w('reads', 'Nabopolassar', -0.2), 4.0, 0.72, 0.22)
air(w('found', 'About', -0.5), 1.4, 0.007, 0.0)
trowel(w('found', 'dug out', -0.2), 0.8, 0.006, px(1200))
for i, m in enumerate((Eb4, G4, Bb4)):
    xy(m, w('found', 'still said', 0.2 + 0.6 * i), 0.8, px(960 + 160 * (i - 1)))
paper(w('sixteen', 'In one', -0.4), 0.010, px(710))
hush(w('sixteen', 'mapped', -0.1), 2.2, 0.003, px(710))
spread(AB1, w('sixteen', 'sixteen', -0.2), 3.0, 0.8, 0.2)
spread(BB2, w('now', 'At the utility', -0.1), 3.4, 0.8, 0.2)
knock(w('now', 'every element', -0.3), 0.009, px(1330))
tick(w('now', 'who owns', -0.1), 0.005, px(1180)); tap(w('now', 'where it came', -0.1), 0.006, px(1180))
tSo = wc('so', -0.3)
air(tSo, 1.2, 0.006, px(1090)); hush(tSo + 0.3, 1.8, 0.003, px(1090))
tick(w('so', 'checked', 0.1), 0.005, px(1090)); air(w('so', 'walked', 0.1), 2.0, 0.005, px(1090))
spread(EB2, w('so', 'before anyone', -0.2), 3.2, 0.78, 0.22)
mark(wc('breath', 1.3), 0.95)

# 2. What will it touch?: a hush as the day's changes land on the map, and the glass, soft, as each owner confirms one. Planned work:
#    air as the street comes in, the switch thrown as it goes dark, paper for the letters at the doors and the letter. Last year's move:
#    a knock for each table, a key as the letters keep reading the old one. The wrong date: paper for the two days, a cross, and the
#    xylophone's C falling to E flat, C minor, left unanswered; the switch again as the power goes off without warning. Nobody could
#    see: a knock as the old table's unknown readers appear. The ticket: paper, and the phone buzzing with the text it asks for; a key
#    for each of Tomás's two questions
K = 'touch'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
hush(w('busy', 'changes every day', -0.2), 3.0, 0.003, px(1090))
tCf = w('busy', 'each confirmed', -0.2)
gh(Eb4, tCf, tCf + 2.0, 0.8); gh(G4, tCf + 0.2, tCf + 2.0, 0.7)
air(wc('planned', -0.4), 1.4, 0.007, px(1100))
clunk(w('planned', 'switch a street off', 0.2), 0.009, px(560))
paper(w('planned', 'a letter', -0.2), 0.008, px(1100)); paper(w('planned', 'Households', -0.2), 0.011, px(1480))
knock(wc('moved', -0.3), 0.009, px(740)); knock(w('moved', 'to a new table', -0.3), 0.009, px(740))
tap(w('moved', 'kept reading', -0.3), 0.006, px(1180))
paper(wc('wrong', -0.3), 0.010, px(740)); paper(wc('wrong', 0.0), 0.010, px(1180))
tWd = w('wrong', 'wrong date', -0.2)
strike(tWd, 0.006, px(920)); xy(C5, tWd + 0.1, 0.8, px(740)); xy(Eb4, tWd + 0.6, 0.85, px(740))
clunk(w('wrong', 'without warning', -0.2), 0.009, px(1160))
knock(w('nobody', 'could see', -0.2), 0.008, px(1290))
paper(w('ticket', 'in a ticket', -0.3), 0.011, px(880))
buzz(w('ticket', 'for a text', -0.1), 0.006, px(1600))
tap(w('ask', 'what it touches', -0.2), 0.006, px(1540)); tap(w('ask', 'who must agree', -0.2), 0.006, px(1540))

# 3. Checked on every change: a card for the element, and a hush for its runs; a tick as each of the six checks passes, as the voice
#    names it. A check that has never failed: one hush for its run of greens; a knock for the change that breaks the rule, and the
#    xylophone's low F, unanswered, as the check stops it. The case that must fail: a knock, the list slid toward the wall, the low F
#    again as the wall stops it, and a tick: it fails, as it must. Fitness functions: a key. A change that fails one: the gate's bar comes
#    down, and lifts with a creak once it's fixed; the glass, low, as its owner says why
K = 'checks'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
knock(w('like', 'every element', -0.3), 0.009, px(1330))
hush(w('like', 'tested', 0.2), 2.2, 0.003, px(960))
for lid, word in (('list', 'a source'), ('list', 'or a system'), ('none', 'business object'), ('none', 'unlinked'), ('none', 'twice'), ('rule', 'must fail')):
    tick(w(lid, word, 0.3), 0.004, px(420))
hush(w('never', 'never failed', -0.4), 1.2, 0.003, px(810))
knock(w('never', 'shown a change', -0.2), 0.009, px(1590))
tSp = w('never', 'must stop', -0.1)
xy(F4, tSp, 0.9, px(1440)); strike(tSp + 0.05, 0.005, px(1440))
knock(wc('solar', -0.3), 0.009, px(960))
drag(w('solar', 'Sending', 0.0), 3.0, 0.004, px(860))
xy(F4, w('solar', 'must fail', -0.1), 0.9, px(960))
tick(w('solar', 'It does', -0.1), 0.005, px(960))
tap(w('name', 'fitness functions', -0.3), 0.006, px(960))
knock(w('held', 'fails one', -0.2), 0.008, px(1080), 200)
creak(w('held', 'fixed', -0.1), 0.7, 0.005, px(1000))
tWy = w('held', 'owner says why', -0.2)
gh(Bb3, tWy, tWy + 2.0, 0.8); gh(Eb4, tWy + 0.2, tWy + 2.0, 0.72)

# 4. Test the agent first: paper for Tomás's walk, and a soft knock for his day; air as the agent comes in. The test: paper. The
#    social tariff's map: air, a hush as its fourteen elements are found, a key for its five owners. The first run: a hush as it finds
#    thirteen, and the low F, unanswered, where it misses the secure exchange. Nobody had drawn the line: a key at the gap; the line
#    drawn, a knock for the check added, a tick as it passes. Run again: a hush for all fourteen, a tick for the owners, and air as the
#    test loops round to run again
K = 'test'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
paper(S0(K) + 0.6, 0.010, px(840))
knock(w('day', 'a day', -0.3), 0.007, px(620), 300)
air(w('day', 'The map agent', -0.3), 0.9, 0.006, px(1440))
paper(w('before', 'tested', -0.3), 0.010, px(960))
air(wc('tariff', -0.3), 1.2, 0.006, px(820))
hush(w('tariff', 'fourteen', -0.2), 1.0, 0.003, px(820))
tap(w('tariff', 'five owners', -0.3), 0.006, px(1640))
hush(w('first', 'finds thirteen', -0.6), 1.2, 0.003, px(820))
xy(F4, w('first', 'misses', -0.1), 0.9, px(300))
tap(w('line', 'nothing linked', -0.2), 0.006, px(560))
drag(w('gap', 'line is drawn', -0.2), 0.9, 0.004, px(560))
knock(w('gap', 'a check added', -0.2), 0.008, px(920))
tick(w('gap', 'data travels', 0.3), 0.004, px(400))
hush(w('again', 'finds all', -0.1), 1.0, 0.003, px(820))
tick(w('again', 'five owners', -0.2), 0.004, px(1640))
air(w('again', 'The test runs', -0.2), 1.0, 0.005, px(100))

# 5. Walking the change: paper for the ticket, air for the board; the xylophone steps down as the agent passes each row, C, B flat,
#    A flat and G (the elements lit as it passes, from the same ease as scenes.js). A tick for each owner's tag; a low knock as the wall
#    is lit and air as the notice crosses it; a key for each table. The new element: a knock as it comes in, unowned; the low F,
#    unanswered, as the checks stop there; and the glass, E flat, as the head of retail takes it, with a tick as the check passes. Who
#    must agree: a knock for the list, a key for each name; one hush for the IDs and their evidence
K = 'walk'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
paper(S0(K) + 0.6, 0.009, px(960)); air(S0(K) + 0.9, 1.0, 0.005, 0.0)
tWk = w('down', 'walks it', -0.1)
for r, m in enumerate((C5, Bb4, Ab4, G4)):
    y = min(0.985, ((200, 340, 480, 620)[r] + 42 - 110) / 552)
    xy(m, tWk + 2.8 * _math.acos(1 - 2 * y) / _math.pi - 0.05, 0.85, px(1790))
tick(w('work', "Grace's", -0.2), 0.004, px(360))
tick(w('phones', "retail's", -0.2), 0.004, px(1240))
knock(w('wall', 'same terms', -0.3), 0.008, px(960), 180)
air(w('wall', 'network tells', -0.3), 1.0, 0.005, px(960))
for word, x in (('the planned work', 470), ('supply points', 770), ('customer contacts', 1210)):
    tap(w('tables', word, -0.2), 0.005, px(x))
knock(w('new', 'texting service', -0.3), 0.008, px(1510))
xy(F4, w('new', 'checks stop', 0.0), 0.9, px(960))
tTk = w('new', 'takes it', -0.2)
spread(EB1, tTk, 2.4, 0.85, 0.22); tick(tTk + 0.5, 0.004, px(760))
knock(wc('owners', -0.2), 0.008, px(960))
for word in ('Grace, the', 'the head of retail', 'Ama for', 'Inés for'):
    tap(w('owners', word, -0.25), 0.005, px(400))
hush(w('cites', 'ID', -0.2), 1.2, 0.003, px(1100))

# 6. What's really running: a knock for each card, the map and the code, and the running estate. The estate: a hush as its tables and
#    jobs come in, air as their reads flow; a lock's click for read-only, a hush as the data is masked. The reader the map doesn't show:
#    a knock for the contact centre's software and another for its own copy. A household calls: the phone buzzes; a key as the copy
#    changes, a cross where the customer system never hears of it. The count: one hush for its eleven, and a cross for the one in
#    eleven. The head of retail decides: paper for the decision, a pen, and the glass, E flat, as the person decides. On the map, with
#    an owner: a tick
K = 'estate'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
knock(S0(K) + 0.6, 0.008, px(580)); knock(w('intent', 'Only the running', -0.3), 0.008, px(1340))
hush(w('read', 'checked against', -0.3), 1.4, 0.003, px(900))
air(w('read', 'what reads', -0.1), 1.0, 0.005, px(1070))
lock(w('masked', 'read-only', -0.2), 0.007, px(250))
hush(w('masked', 'personal', -0.2), 0.9, 0.003, px(760))
knock(w('copy', 'finds a reader', -0.2), 0.008, px(1420)); knock(w('copy', 'own copy', -0.3), 0.008, px(760))
buzz(w('calls', 'household calls', -0.2), 0.006, px(250))
tap(w('calls', 'copy changes', -0.2), 0.006, px(760))
strike(w('calls', 'never hears', -0.3), 0.005, px(880))
hush(w('count', 'one number', -0.3), 1.0, 0.003, px(880))
strike(w('count', 'in eleven', -0.1), 0.005, px(1034))
tDe = wc('decide', -0.2)
paper(tDe, 0.011, px(1380)); pencil(w('decide', 'the customer', -0.2), 2.0, 0.004, px(1380), 4)
spread(EB2, w('decide', 'decides', -0.2), 3.2, 0.85, 0.22)
tick(w('drawn', 'with an owner', -0.3), 0.004, px(600))

# 7. Back to the river wall: air as Babylon comes back, and the xylophone's E flat and G as its stamped bricks catch the sun; a key for
#    the older king's inscription, and a tablet for each of Nabopolassar's own words. The utility beside the wall: air as the frame
#    opens, a hush as every element is stamped, a tick as a change is checked, and air as it's walked. April: the phone buzzing with the
#    first text, paper for the two days, and a tick for the crews' date. Then, in the pause, the wall and the map side by side: the
#    film's figure once more, the xylophone stepping down the map's six layers, and the glass answering once every layer is there
K = 'back'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(S0(K) + 0.2, 1.4, 0.006, 0.0)
tBb = w('wall', 'brick by brick', -0.2)
xy(Eb4, tBb, 0.8, px(900)); xy(G4, tBb + 0.5, 0.75, px(1000))
tap(w('kept', "older king's", -0.3), 0.005, px(960))
clay(w('kept', 'in his own words', -0.4), 0.010, px(960))
clay(w('asked', 'asked', -0.2), 0.010, px(960))
air(wc('utility', -0.6), 1.6, 0.006, px(1434))
hush(w('utility', 'every element', -0.2), 1.2, 0.003, px(1434))
tick(w('utility', 'checked', 0.1), 0.004, px(1434)); air(w('utility', 'walked', 0.1), 1.8, 0.004, px(1434))
buzz(w('april', 'first texts', -0.2), 0.006, px(580))
paper(w('april', 'two days', -0.3), 0.009, px(1160)); paper(w('april', 'crews reach', -0.3), 0.009, px(1620))
tick(w('date', 'date the crews', -0.1), 0.005, px(1610))
figure(wc('breath', -0.4), (C5, Bb4, Ab4, G4, F4, Eb4), EB4, 0.92, 0.36, 2.2)

# 8. Every change, checked: paper as the answer's note comes in, and a pen as it's written; the glass, A flat, as the owners decide;
#    under the end card, without words, the series' mark
K = 'end'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tA = wc('answer')
paper(tA + 0.2, 0.011, px(960)); pencil(tA + 0.5, 6.0, 0.004, px(960), 12)
tOd = w('walkit', 'let the owners decide', -0.2)
spread(AB2, tOd, 2.6, 0.8, 0.22)
mark(wc('breath', 0.7), 0.95, hold=3.0)

_pure()
