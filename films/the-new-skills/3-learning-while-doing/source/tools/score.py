# Learning while doing: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (palettes.md, 5 November 2026: the lead the setup thread reserved for it, which no score on main or
# on any branch has, and which no other module's palette names): a spoke harp, made here, as music.py has none.
#  - The spoke harp: a bicycle wheel whose spokes are each tightened to a note by ear, at the nipple, and plucked with a fingertip: an
#    instrument anyone can make, and learns to play by playing it. Each note is a steel spoke set ringing: a soft pluck, then a clear
#    ring with a steely edge that's gone in a moment (the stiff wire's higher partials, each a little sharp, die first), the rim
#    answering faintly, and a hand laid on the spoke to stop it. Plucked with the flesh of the finger, never the nail: soft, low, damped,
#    never a shimmer.
#  - Its partner, the thread's choice: a larger wheel beside it, its longer spokes tuned an octave and more below, plucked with the side
#    of the thumb and stopped by the palm a moment later: a round, low note, felt more than heard. Two wheels side by side and a player at
#    each, one beside the other, as Ivy learns beside Jun; one instrument in two sizes, so no other instrument is taken. Every other
#    plucked or struck colour the site lacks either belongs to another culture or sounds like one the site has (the long list in the
#    module's palettes.md), as film 1's thread found too.
# The mark, as the setup thread suggested: a note found, then a second beside it, then a short tune built from them. A, alone, as
# Freire's team starts from the town's own words; B beside it as a handful of words is chosen; and from the two, as new words are made
# from a word's syllables, the tune: A B C# B A E A. It comes back as the film says what skills grow from, as Ivy writes changes on her
# own, as she learns what she teaches and the team gets a second name on every job, in the circle's room under Freire's words about
# teaching, and at the close, on both wheels at once.
# A major, F sharp minor for the opening's problem (three adults in four can't read, so can't vote; the primers that make many give up;
# the plan stopped), and A major once the circles teach from people's own words. Every chord is tuned pure from A (just intonation, see
# hz()): A, D and E major, and F sharp and C sharp minor, are pure in this table; B with D or with F sharp is not, and the two never sound
# together. Nothing Brazilian for Angicos: no samba or bossa figure, no berimbau, no instrument of the place (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one spoke, steady, with no vibrato or bend; the partials that would ring on are in tune, and
#    the sharp ones are gone within a few tenths of a second; each note is damped before it would ring into the next chapter. No urgent
#    pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/lw_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1963)  # this film's own randomness: the room, the paper, the keys

# ---- tuning: just intonation from A, so a chord's notes are whole-number ratios of each other and nothing beats. A, D and E major, and
# F sharp and C sharp minor, are pure in this table; B with D, or with F sharp, is not, and never sounds with either
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 45, 12)
    return 110.0 * 2 ** o * _JI[pc]
E2, Fs2, A2, B2, Cs3, D3, E3, Fs3, Gs3 = 40, 42, 45, 47, 49, 50, 52, 54, 56
A3, B3, Cs4, D4, E4, Fs4, Gs4, A4, B4, Cs5, D5, E5 = 57, 59, 61, 62, 64, 66, 68, 69, 71, 73, 74, 76

# ---- the levels: the spoke harp and the larger wheel matched by loudness, as far under the voice as the module's other music; the
# effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LS, LW, FX = 0.05, 0.068, 3.2
LV = [1.0]

# a small room round the two wheels, ringing on for about a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), as a room lifts some pitches and
    hollows others, and every note should sound as loud as its neighbours"""
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
def _touch(sec, n, band, d):
    """a fingertip or a thumb leaving the wire: a little soft noise, gone in a few thousandths of a second"""
    x = np.arange(n) / SR; th = filt(noise(sec + 0.02)[:n], 'band', band) * np.exp(-x / d)
    return th / max(1e-9, float(np.abs(th).max()))

# ---- a plucked spoke's partials. A spoke is a short, stiff steel wire: past the second, each partial is a little sharper than a string's
# would be, the more so the higher it is, and those die within a few tenths of a second, so they edge the pluck with steel and never ring
# on against a chord's other notes. The first two are in tune, and ring. The rim answers each pluck faintly, at its own two pitches,
# and is still again in a tenth of a second
RIM = ((236.0, 0.07, 0.09), (611.0, 0.05, 0.05))
def _spoke(f0, x, t1, stiff, top, second, edge):
    sig = np.zeros(len(x))
    for k in range(1, 14):
        fk = f0 * k * (np.sqrt(1 + stiff * k * k) / np.sqrt(1 + stiff * 4) if k > 2 else 1.0)
        if fk > top:
            break
        if k == 1:
            a, d = 1.0, t1
        elif k == 2:
            a, d = second, 0.45 * t1
        else:
            a, d = edge / k ** 1.15, 0.11 / (k - 2) ** 0.55
        sig += a * np.sin(2 * np.pi * fk * x + 0.7 * k) * np.exp(-x / d)
    return sig

def spoke(m, s, g=1.0, pan=None, ring=None, room=0.22, until=None):
    """the spoke harp: one spoke plucked with the flesh of a fingertip at s, so it rings clear with a moment's steely edge; a hand laid on
    it after ring seconds stops it"""
    f0 = hz(m); t1 = 1.7 * (440 / f0) ** 0.35; d = ring if ring else 1.1
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _spoke(f0, x, t1, 0.006, 2300, 0.3, 0.55)
    sig += sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x / dd) for f, a, dd in RIM)
    sig *= (1 - np.exp(-x / 0.0015)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.045))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.03 * _touch(sec, n, (700, 2000), 0.0025)
    sig = sig.astype(np.float32)
    sig = _until(_room(norm(filt(filt(sig, 'low', 2300), 'high', 90)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LS, max(-0.35, min(0.35, (m - 66) * 0.02)) if pan is None else pan)

def wheel(m, s, g=1.0, pan=None, ring=None, room=0.18, until=None):
    """the larger wheel beside it: a long spoke plucked with the side of the thumb, softer at its start, and stopped by the palm after
    ring seconds: a round, low note whose few higher partials are barely sharp and soon gone, felt more than heard"""
    f0 = hz(m); t1 = 2.2 * (110 / f0) ** 0.3; d = ring if ring else 1.0
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _spoke(f0, x, t1, 0.0015, 1400, 0.42, 0.22)
    sig *= (1 - np.exp(-x / 0.004)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.04 * _touch(sec, n, (120, 420), 0.008)
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (80, 200))   # the big wheel's hub and rim, under the low spokes
    sig = _until(_room(norm(filt(filt(sig, 'low', 1400), 'high', 40)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LW, -0.2 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.12, ring=2.2, until=None):
    """a chord plucked from its lowest spoke up, the notes below A3 on the larger wheel, each hand stopping its spokes together at the
    end so they stop as one"""
    for i, m in enumerate(notes):
        r = max(0.4, ring - step * i)
        (wheel if m < A3 else spoke)(m, s + step * i, g, None, r, until=until)
def figure(notes, s, g=1.0, step=0.22, ring=0.5, last=None, until=None, pans=None):
    """a short figure, a note at a time, each stopped before the next but one, so nothing that isn't pure rings together"""
    k = len(notes)
    for i, m in enumerate(notes):
        r = last if (last and i == k - 1) else ring
        (wheel if m < A3 else spoke)(m, s + step * i, g, None if pans is None else pans[i], r, until=until)
TUNE = (A4, B4, Cs5, B4, A4, E4, A4)       # the mark's tune, built from the note found (A) and the one beside it (B)
def mark(notes, s, g=1.0, step=0.22, ring=0.5, last=2.4, bass=(), until=None):
    """the tune on the spoke harp, and the larger wheel's notes beside it, each at the place in the tune it's given"""
    figure(notes, s, g, step, ring, last, until)
    for m, i, r in bass:
        wheel(m, s + step * i, 0.9 * g, None, r, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.4 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.0045, pan=0.0):
    """a sheet pinned up or laid down: a soft flap of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.19)[:n], 'band', (360, 1700)) * _bump(x, 0.075) * (x < 0.075)
    _fx(fl + 0.6 * _knock(n, 160, 0.018, 0.065) / 1.35, s, g, pan, 1900)
def tap(s, g=0.004, pan=0.0):
    """something small set down, a word chip or a pill: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (260, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 230, 0.011), s, g, pan, 1600)
def click(s, g=0.0035, pan=0.0):
    """a screen opened or a tab chosen: one small, dull click"""
    n = int(0.05 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.07)[:n], 'band', (500, 1600)) * np.exp(-x / 0.003) + 0.4 * _knock(n, 380, 0.006), s, g, pan, 1800)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """a card slid along, or lines drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.005, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def paper(s, g=0.004, pan=0.0):
    """a sheet of paper taken up in a hand: one soft rustle that swells and settles, not a crackle"""
    sec = 0.5; n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 18); gr = 0.6 + 0.4 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (400, 1800)) * _bump(x, sec, 1.6) * gr, s, g, pan, 1900)
def book(s, g=0.005, pan=0.0):
    """a book laid down: its covers' soft, low thump, and the pages' breath under them"""
    n = int(0.35 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 110, 0.04) + 0.3 * filt(noise(0.37)[:n], 'band', (250, 1200)) * _bump(x, 0.12, 1.2) * (x < 0.12), s, g, pan, 1300)
def keys(s, sec=1.2, g=0.0035, pan=0.0):
    """typing, heard from beside the desk: a few soft, dull key presses, unevenly spaced, as one texture"""
    t = 0.0
    while t < sec:
        n = int(0.04 * SR); x = np.arange(n) / SR; v = R1.uniform(0.6, 1.0)
        _fx(v * (filt(noise(0.06)[:n], 'band', (300, 1200)) * np.exp(-x / 0.004) + 0.5 * _knock(n, R1.uniform(260, 320), 0.006)), s + t, g, pan, 1400)
        t += R1.uniform(0.13, 0.24)
def crowd(s, sec=2.6, g=0.0035, pan=0.0):
    """a street full of people, heard from across it: one soft, low murmur that swells in and settles, no single voice in it"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 3); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (180, 700)) * _bump(x, sec, 1.2) * gr, s, g, pan, 800)

# =============================================================================================================================
# 1. Their own words: the opening, the module's story from outside data. Angicos, January 1963: the larger wheel's low A, alone, then
#    A major on the spoke harp as the town comes in; the classes' sheet; one note each for the farm workers, the builders and the
#    washerwomen as each comes in, where each stands; D major, low, as the night class and its students come in. The problem: F sharp
#    minor, low; the paper the farmer signs, the letter read for the washerwoman; the primers, and a falling figure in F sharp minor as
#    many give up, gone before "Something has to change", which has nothing under it. Freire's team: the mark's first note, A, alone,
#    as it starts from the town's own words; the words written down, a pen; the six words chosen, a soft tap each, and B beside A. The
#    circle meets, A major, low; the projector switched on; one note for the word, belota; its three syllables, three notes; and the
#    tune built from the two notes as new words are built from the syllables. One small step each evening: a note for each step up the
#    hours, to the octave at the fortieth; the last class's tick; the street on the day the president comes, its murmur, and A major
#    from both wheels. The count, its sheet, and C sharp minor, open, as people still argue over it. The plan: D major rising as the
#    windows light; stopped: the larger wheel's F sharp, stopped short, as they go dark. The book laid down, D major; the primers' figure
#    once more, as data tutorials can feel like them; the tune on both wheels as the film says what skills grow from; A major, held,
#    under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('circles', lid, word, off)
oc = lambda lid, off=0: G('circles', lid, off)
END = E('circles')
wheel(A2, 0.6, 0.85, 0.0, ring=3.2)
chord((A3, Cs4, E4, A4), ow('when', 'Angicos', 0.3), 0.7, step=0.17, ring=2.8)
card(oc('when', 0.2), 0.004, px(450))
card(oc('adults', 0.2), 0.004, px(450))
for word, m, x in (('farm', A3, 860), ('builders', Cs4, 1240), ('washerwomen', E4, 1620)):
    spoke(m, ow('adults', word, 0.0), 0.55, px(x) * 0.5, ring=1.0)
chord((D3, A3, D4, Fs4), oc('guides', 0.2), 0.6, step=0.16, ring=2.4)
card(ow('guides', 'twenty', -0.2), 0.004, px(1380))
# three adults in four can't read or write, so they can't vote; the paper the farmer signs, the letter someone reads for the washerwoman
chord((Fs2, Cs3, Fs3, A3), oc('read', 0.2), 0.6, step=0.18, ring=2.6)
card(oc('read', 0.1), 0.004, px(490))
paper(ow('letters', 'sign', 0.25), 0.004, px(1100))
paper(ow('letters', 'letters', 0.25), 0.0035, px(1500))
# the children's primers: nothing about their own lives, and many give up; nothing under "Something has to change"
PRIMER = (Cs4, A3, Fs3)
figure(PRIMER, ow('primers', 'give', 0.0), 0.55, step=0.3, ring=0.6, last=1.4, until=oc('change', -0.4))
# the town's own words: the note found, A, alone; written down; a handful chosen, a tap for each word, and B beside A
spoke(A4, ow('own', 'words', 0.1), 0.6, 0.0, ring=2.2)
card(oc('own', 0.1), 0.004, px(480))
pen(ow('listen', 'write', 0.0), 0.7, 0.004, px(1080), 3)
f0 = ow('listen', 'handful', -0.1)
for i, x in enumerate((215, 330, 440)):
    tap(f0 + 0.4 + i * 0.2, 0.003, px(x)); tap(f0 + 1.0 + i * 0.2, 0.003, px(x + 40))
spoke(B4, ow('listen', 'choose', 0.0), 0.55, 0.05, ring=1.8)
# the culture circle meets each evening: A major, low; the projector switched on for the picture; one note for its word, belota; its three
# syllables; and the tune, built from the two notes found, as new words are made from them
chord((A2, E3, A3, Cs4), oc('circle', 0.0), 0.55, step=0.16, ring=2.4)
click(ow('picture', 'picture', -0.3), 0.003, px(930))
spoke(Cs5, ow('picture', 'belota', 0.0), 0.5, px(1360) * 0.4, ring=1.4)
figure((A4, B4, Cs5), ow('syllables', 'break', 0.1), 0.5, step=0.3, ring=0.5, last=0.9)
mark(TUNE, ow('syllables', 'new', 0.1), 0.6, step=0.22, ring=0.45, last=1.8)
# one small step each evening, by doing, together: the hours fill, a note for each step up, to the octave at the fortieth hour
card(oc('steps', 0.3), 0.0035, px(1360))
h0, h1 = oc('steps', 0.6), ow('forty', 'fortieth', 0.3)
for i, m in enumerate((A3, Cs4, E4)):
    spoke(m, h0 + (h1 - h0) * (i + 0.4) / 4, 0.45, px(1360) * 0.4, ring=0.9)
spoke(A4, h1, 0.5, px(1360) * 0.4, ring=1.2)
ticked(ow('forty', 'April', -0.2), 0.0045, px(1360))
# the last class: the president of Brazil comes, and the street is full; A major from both wheels
pres = ow('forty', 'president', -0.3)
crowd(pres, 2.8, 0.0035, px(960))
chord((A2, E3, A3, Cs4, E4), pres + 0.1, 0.6, step=0.14, ring=2.6)
# the count: about 300, still argued over: C sharp minor, open
card(ow('count', 'count', -0.1), 0.004, px(450))
chord((Cs4, E4, Gs4), ow('count', 'argue', 0.1), 0.45, step=0.2, ring=1.6)
# the method spreads, a national plan: D major rising as the windows light; stopped that April, Freire jailed: the larger wheel's F sharp,
# stopped short, as the windows go dark, and nothing after it
s0 = ow('spread', 'spreads', -0.2)
figure((D4, Fs4, A4, D5), s0 + 0.3, 0.5, step=0.55, ring=0.7, last=1.4)
card(ow('spread', 'national', -0.2), 0.004, px(470))
k0 = ow('stop', 'stops', -0.1)
wheel(Fs2, k0, 0.7, None, ring=0.55, room=0.12); spoke(Cs4, k0 + 0.05, 0.4, None, ring=0.4, room=0.1)
tap(k0 + 0.4, 0.004, px(470))
# abroad, the book, laid down: D major, low
book(oc('book', 0.2), 0.005, px(580))
chord((D3, Fs3, A3, D4), oc('book', 0.3), 0.5, step=0.15, ring=2.0)
# learning data work can feel like those primers: their figure once more
figure(PRIMER, ow('data', 'nothing', 0.0), 0.45, step=0.3, ring=0.6, last=1.2)
# skills grow on the real work, beside someone who knows: the tune on both wheels; the title, A major, held, gone before the next chapter
mark(TUNE, ow('real', 'beside', -0.1), 0.6, step=0.22, ring=0.45, last=2.0, bass=((A2, 0, 1.0), (E3, 3, 0.8), (A2, 6, 2.0)))
chord((A2, E3, A3, Cs4, E4, A4), oc('breath', 0.3), 0.65, step=0.17, ring=4.4, until=END)

# 2. Beside Jun, an hour a day: the chapter turns on D major; Ivy's card; the screen opened on the team's real project; the pairing's card,
#    and the keys as one of them types; at the swap, the two wheels swap, each going where the other was; each small change's card, and
#    a tick as someone else reviews it; the fifth week's, the 14 rooms' pill, and A major as it goes in; the six weeks filling, a note
#    for each week; Ivy on her own: the tune, the spoke harp alone, and the larger wheel's A as Jun reviews it; two people, one
#    keyboard: both wheels at once
LV[0] = 0.9
bw = lambda lid, word, off=0: W('beside', lid, word, off)
bc = lambda lid, off=0: G('beside', lid, off)
chord((D3, Fs3, A3, D4), S0('beside') + 0.2, 0.55, step=0.16, ring=2.2)
card(bw('ivy', 'Ivy', -0.1), 0.004, px(1400))
click(bw('jun', 'opens', -0.3), 0.003, px(1430))
card(bc('pair', 0.3), 0.0035, px(1630))
keys(bw('pair', 'types', 0.0), 1.2, 0.003, px(960))
sw = bw('pair', 'swap', 0.0)
figure((A4, E4), sw, 0.45, step=0.45, ring=0.6, last=1.2, pans=(px(1160) * 0.5, px(760) * 0.5))
figure((E3, A3), sw, 0.5, step=0.45, ring=0.6, last=1.2, pans=(px(760) * 0.5, px(1160) * 0.5))
for (word, off, x) in (('check', -0.2, 370), ('clearer', -0.2, 960), ('better', -0.2, 1550)):
    card(bw('small', word, off), 0.0035, px(x))
for (word, off, x) in (('Noor', -0.1, 370), ('Sam', -0.1, 960), ('Sam', 0.5, 1550)):
    ticked(bw('review', word, off), 0.004, px(x))
card(bw('fifth', 'fifth', -0.2), 0.0035, px(960))
tap(bw('fourteen', 'renumbered', -0.1), 0.0035, px(960))
ticked(bw('fourteen', 'goes', -0.1), 0.0045, px(960))
chord((A3, Cs4, E4), bw('fourteen', 'goes', 0.0), 0.5, step=0.14, ring=1.4)
figure((A3, B3, Cs4, E4, Fs4, A4), bw('count', 'twenty-five', -0.3), 0.45, step=0.4, ring=0.45, last=1.0)
card(bw('own', 'writes', -0.2), 0.0035, px(960))
mark(TUNE, bw('own', 'writes', 0.0), 0.5, step=0.2, ring=0.4, last=1.2)
ticked(bw('own', 'reviews', -0.1), 0.004, px(960))
wheel(A2, bw('own', 'reviews', 0.0), 0.6, None, ring=1.4)
card(bw('xp', 'extreme', -0.2), 0.0035, px(960))
chord((A2, E3, A3, Cs4, E4), bw('xp', 'two', 0.0), 0.5, step=0.14, ring=2.2, until=E('beside'))

# 3. Two hours every Thursday: the chapter turns on E major; the tools' docs, a card each; the March weeks stacked, a card each, and F sharp
#    and A, low, as no quiet week comes; the April week's card; A major as the two hours come into it; the meeting asked for, its card,
#    and the slide as it's offered another time; the docs' tab, the lines tried on the project, the notes written; Sam's feed: one note,
#    a question; the reading's cards
LV[0] = 0.9
tw = lambda lid, word, off=0: W('thursday', lid, word, off)
tc = lambda lid, off=0: G('thursday', lid, off)
chord((E3, Gs3, B3, E4), S0('thursday') + 0.2, 0.5, step=0.16, ring=2.0)
card(tc('tools', 0.1), 0.0035, px(590)); card(tc('tools', 0.4), 0.0035, px(1330))
q0 = tc('wait', -0.2)
for i in range(3):
    card(q0 + 0.3 + i * 0.35, 0.003, px(930 + 60 * i))
chord((Fs3, A3), tw('wait', 'never', 0.0), 0.45, step=0.2, ring=1.4)
card(tc('time', -0.2), 0.0035, px(800))
tap(tw('time', 'two', -0.1), 0.0035, px(1013))
chord((A3, Cs4, E4, A4), tw('time', 'two', 0.0), 0.5, step=0.13, ring=1.8)
card(tw('helena', 'meeting', -0.2), 0.0035, px(1013))
slide(tw('helena', 'offered', -0.2), 1.2, 0.0035, px(1100))
click(tw('pick', 'Databricks', -0.1), 0.003, px(700))
slide(tw('try', 'try', -0.1), 1.0, 0.003, px(1300))
pen(tw('try', 'write', 0.1), 0.8, 0.004, px(960), 3)
card(tw('ivy', "sensors'", -0.1), 0.004, px(1100))
spoke(Cs5, tw('ivy', 'number', 0.0), 0.45, px(1100) * 0.4, ring=1.6)
card(tw('read', 'guide', -0.2), 0.0035, px(1040)); card(tw('read', 'notes', -0.2), 0.0035, px(1540))

# 4. Teach it to keep it: the chapter turns on A major, rising; her card; her page, and a pen for each part she teaches; the two things she
#    couldn't explain, ticked as she learns them: the note found and the one beside it; the study's card; Freire's words in the circle's
#    room: the larger wheel plays three notes up, and the spoke harp answers with them down, as whoever teaches learns and whoever learns
#    teaches; and the whole team reads a count the same way: A major across both wheels, a note for each of the five, where each stands
LV[0] = 0.9
hw = lambda lid, word, off=0: W('teach', lid, word, off)
hc = lambda lid, off=0: G('teach', lid, off)
figure((A3, Cs4, E4), S0('teach') + 0.3, 0.5, step=0.22, ring=0.6, last=1.6)
card(S0('teach') + 0.7, 0.0035, px(450))
card(hw('may', 'page', -0.2), 0.004, px(1510))
for lid, word in (('peak', 'most'), ('gap', 'zero'), ('heads', 'heads')):
    pen(hw(lid, word, -0.2), 0.7, 0.004, px(1510), 3)
l0 = hw('ready', 'learned', -0.1)
ticked(l0, 0.004, px(1240)); ticked(l0 + 0.2, 0.004, px(1200))
figure((A4, B4), l0 + 0.1, 0.5, step=0.45, ring=0.7, last=1.4)
card(hc('study', 0.2), 0.0035, px(960))
card(hc('freire', 0.3), 0.0035, px(960))
figure((A3, B3, Cs4), hw('freire', 'whoever', 0.0), 0.5, step=0.3, ring=0.6, last=1.0)
figure((Cs5, B4, A4), hw('freire', 'and', 0.1), 0.45, step=0.3, ring=0.6, last=1.4)
sa = hw('spread', 'same', -0.2)
ticked(sa, 0.004, px(960))
for i, (m, x) in enumerate(zip((A2, E3, A3, Cs4, E4), (260, 610, 960, 1310, 1660))):
    (wheel if m < A3 else spoke)(m, sa + 0.1 + 0.16 * i, 0.5, px(x) * 0.6, ring=2.2 - 0.16 * i, until=E('teach'))

# 5. Nobody the only one: only one person knows how, and he's away: the larger wheel's F sharp, stopped short, under a spoke's C sharp, as
#    Sam goes; the nine jobs' card; the runbook's card, and a pen for each step written down; the second names come in, a tap, and the
#    note found and the one beside it, low, as every job has two names; Ivy's name, a tap; the work goes on: a tick, and A major
LV[0] = 0.9
nw = lambda lid, word, off=0: W('two', lid, word, off)
nc = lambda lid, off=0: G('two', lid, off)
a0 = nw('absence', 'absence', -0.3)
wheel(Fs2, a0 + 0.3, 0.6, None, ring=0.7, room=0.12); spoke(Cs4, a0 + 0.35, 0.4, None, ring=0.6, room=0.1)
card(nc('list', 0.1), 0.004, px(880))
card(nw('pairs', 'write', -0.2), 0.0035, px(1440))
pen(nw('pairs', 'step', -0.1), 1.2, 0.004, px(1440), 4)
tap(nw('june', 'every', -0.1), 0.0035, px(1100))
figure((A3, B3), nw('june', 'two', 0.0), 0.5, step=0.45, ring=0.7, last=1.4)
tap(nw('ivy', "Ivy's", -0.1), 0.0035, px(1300))
ticked(nw('away', 'goes', -0.2), 0.0045, px(1670))
chord((A2, E3, A3, Cs4, E4), nw('away', 'goes', 0.0), 0.5, step=0.14, ring=2.0, until=E('two'))

# 6. Why it works: the chapter turns on E major; the cards of what's known, one each; the newcomer moving in from the edge of the real
#    work, a note at each step in, rising; the rule of thumb built up in its parts: the larger wheel's low A for the seventy, then E and A
#    above it for the twenty and the ten; the lines tried on the work, a rub
LV[0] = 0.9
yw = lambda lid, word, off=0: W('why', lid, word, off)
yc = lambda lid, off=0: G('why', lid, off)
chord((E3, B3, E4, Gs4), S0('why') + 0.3, 0.5, step=0.16, ring=2.0)
card(yc('trades', 0.1), 0.0035, px(960))
card(yw('lave', 'Jean', -0.1), 0.0035, px(460))
for word, m in (('edge', E4), ('tasks', A4), ('beside', Cs5)):
    spoke(m, yw('edge', word, 0.0), 0.45, px(1350) * 0.4, ring=1.1)
card(yw('ericsson', 'Anders', -0.1), 0.0035, px(960))
card(yc('rule', 0.1), 0.0035, px(960))
wheel(A2, yw('rule', 'seventy', 0.0), 0.6, px(780) * 0.4, ring=2.6)
spoke(E4, yw('twenty', 'twenty', 0.0), 0.45, px(1380) * 0.4, ring=1.8)
spoke(A4, yw('twenty', 'ten', 0.0), 0.45, px(1500) * 0.4, ring=1.6)
slide(yw('docs', 'work', -0.2), 1.0, 0.003, px(1260))

# 7. On Monday: back in Angicos, the circle's room: the tune on the larger wheel, low, as their own words come back; Ivy's three, a tick
#    each; the four things to do, a card each; and the close: the tune on both wheels at once, its last note held as A major into the end
#    card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
mark(tuple(m - 24 for m in TUNE), mw('back', 'own', 0.0), 0.6, step=0.26, ring=0.5, last=1.6)
for word in ('learned', 'taught', 'second'):
    ticked(mw('ivy', word, -0.1), 0.004, px(1250))
card(mc('real', 0.3), 0.0035, px(400))
card(mw('step', 'small', -0.1), 0.0035, px(960))
card(mw('time', 'calendar', -0.2), 0.0035, px(1520))
card(mw('teach', 'Write', -0.1), 0.0035, px(960))
cl = mw('last', 'teach', 0.4)
mark(TUNE, cl, 0.55, step=0.24, ring=0.5, last=5.0, bass=tuple((m - 24, i, 0.5 if i < 6 else 5.0) for i, m in enumerate(TUNE)), until=TOT)
chord((Cs4, E4), cl + 0.24 * 6, 0.45, step=0.0, ring=5.0, until=TOT)
