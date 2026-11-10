# Listen first: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (/mnt/project-files/data-management/palettes.md: a lead the setup thread reserved on 5 November 2026,
# which no score on main or on any branch has and no other module's palette names, and a partner this film's thread chose on
# 10 November 2026): Chladni plates, made here, as music.py has none.
#  - The lead: a Chladni plate, a thin square of metal held at its centre and bowed softly at its edge, as Ernst Chladni did in 1787;
#    sand on it gathers where the plate is still, and the sound's shape appears. The bow catches, the plate searches for an instant
#    (a neighbouring way of shaking, faint and gone at once, with the rosin's grain), then it settles into one note and holds it,
#    plain and even. While the bow is drawn, the note carries the bow's own partials, exact multiples of it; when the bow lifts, the
#    plate rings on alone in its one note, purer, and dies away. Nothing else: no shimmer, no beating, nothing that trembles. Kept
#    plain and in the middle of the range (D 3 to A 4, D 5 once or twice), so it can't be taken for a bowed cymbal.
#  - The partner, the thread's choice: a second plate, larger and an octave lower (D 2 to A 3), bowed once and left to settle, with
#    more of the bow's partials, so a phone's small speaker still hears its note. The small plate is what people say, the large one
#    what the systems count; they sound the same note, an octave apart, where the current state is written down. Every other bowed,
#    struck or plucked colour the site lacks either belongs to another culture or sounds like one it has (palettes.md).
#  - The mark: the small plate bowed until its note settles, then the same note again, steadier: what was heard, written down. Always
#    D 4, two single notes about a second and a half apart (so never a figure played again): at "kwashiorkor" as the mothers tell the
#    word and Williams writes it; at "the mothers' word" as Helena writes down what she hears; at "the baseline", with the large plate's
#    D 3 under the steadier note, as the current state is written; and under the end card, the large plate under it too.
#  - D major for what is heard and written down; B minor for the opening's problem (the sick children, the wrong diagnosis), for the
#    data's own (41 days, the warehouse's cost, the findings) and for a fault; G major where people speak and a chapter turns; A major
#    for going to see. Every chord is tuned pure from D (just intonation, see hz()): D, G and A major, and B and F sharp minor, are pure
#    in this table; E minor, and E with G or with B, are not, and are never played or held together. Nothing from Ghana or the Ga people
#    for Accra, and no hospital sounds (the module's palettes.md).
# The rules every film of the module keeps (palettes.md, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice; no figure played again soon after itself; music and effects no louder than
#    the governance films'.
#  - Nothing trembles or pulses: each note one mode of one plate, steady, with no vibrato, its partials harmonic once it has settled;
#    each damped before it would ring into the next chapter where the next chapter's picture changes. No urgent pulse: nothing in this
#    film is a rush.
#  - Every sound is an event on screen, at the moment it appears, as the script plans the picture (script.md, Picture); each one below
#    uses the same word and offset the pictures will (src/scenes.js), so sound and picture stay together when the voice is re-timed. A
#    burst on screen (38 report tiles, 17 going grey, the 31 marks) is one soft sound, never one for each.
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
R1 = np.random.default_rng(1787)  # this film's own randomness: the room, the rosin, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major, and
# B and F sharp minor, are pure in this table; E minor, and E held with G or with B, are not, and never sound together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.41619 * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2, D3, Fs3, G3, A3, B3 = 38, 42, 43, 45, 47, 50, 54, 55, 57, 59
Cs4, D4, E4, Fs4, G4, A4, B4, D5 = 61, 62, 64, 66, 67, 69, 71, 74

# ---- the levels: the two plates matched by loudness, as far under the voice as the module's other music; the effects about 12 dB
# under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LS, LB, FX = 0.05, 0.06, 4.0
LV = [1.0]

# a small room round the plates, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry over its held body
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.014 * SR)] = 0; _IR /= _band(_IR)
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

# ---- a bowed plate. rough is how long it takes to settle: 1 the first bowing of the mark (it searches, its grain is heard, and it
# swells a little past its level before it holds), 0.3 an ordinary note, 0 the mark's steadier second bowing (it catches at once)
def _plate(f0, d, rough, big, top=2300):
    """one note: the plate bowed for d seconds, then ringing on alone; returns the sound and its ring's time constant"""
    tr = 1.5 * (147 / f0) ** 0.3 if big else 1.0 * (294 / f0) ** 0.3        # how long it rings once the bow lifts
    sec = d + 3.4 * tr; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    ta = (0.16 if big else 0.11) + 0.08 * rough                              # the bow catching: the note swells in
    sw = 1 - np.exp(-x / ta)
    to = 2.2 * ta; ov = 1 + 0.14 * rough * (x / to) * np.exp(1 - x / to)    # a little past its level, once, as it settles
    ring = np.where(x < d, 1.0, np.exp(-(x - d) / tr))                       # held while bowed, then ringing on
    c, tp = 0.008 * rough, 0.05 + 0.03 * rough                               # its pitch settles up from a few cents below
    ph = 2 * np.pi * f0 * (x - c * tp * (1 - np.exp(-x / tp)))
    sig = np.sin(ph) * sw * ov * ring
    # the bow's own partials, exact multiples of the note, so nothing beats; they leave soon after the bow lifts, as the plate rings
    # on in its one way of shaking. The large plate has more of them, so a small speaker still hears its note
    bowed = sw * ov * np.where(x < d, 1.0, np.exp(-(x - d) / (tr / 3)))
    for k, a in ((2, 0.24 if big else 0.14), (3, 0.1 if big else 0.05), (4, 0.04 if big else 0.015)):
        if k * f0 < top:
            sig += a * (220 / f0) ** 0.25 * np.sin(k * ph + 0.3 * k) * bowed
    # before it settles, the plate shakes for an instant in a neighbouring way (Chladni's next figure), faint, and gone
    r = 1.47 if big else 1.53
    if r * f0 < top:
        sig += (0.04 + 0.08 * rough) * np.sin(2 * np.pi * r * f0 * x + 1.1) * np.exp(-x / (0.05 + 0.06 * rough)) * (1 - np.exp(-x / 0.008))
    # and the rosin's grain as the bow bites the plate's edge, gone as the note settles
    tg = 0.025 + 0.05 * rough
    gr = filt(noise(sec + 0.02)[:n], 'band', (160, 800) if big else (350, 1600)); gr = gr / max(1e-9, float(np.abs(gr).max()))
    sig += (0.03 + 0.05 * rough) * gr * (x / tg) * np.exp(1 - x / tg)
    return sig.astype(np.float32), tr

def _bow(m, s, g, pan, bow, rough, room, until, big):
    f0 = hz(m); d = bow
    if until is not None:
        d = min(d, max(0.3, until - s - 0.6))
    sig, tr = _plate(f0, d, rough, big)
    sig = norm(filt(filt(sig, 'low', 2300), 'high', 40 if big else 60))
    a = min(0.3, 0.5 * d)
    sig = _until(_room(sig, room, a, max(a + 0.2, d)), s, until)
    put(sig, s, g * LV[0] * (LB if big else LS), pan)

def plate(m, s, g=1.0, pan=None, bow=1.2, rough=0.3, room=0.3, until=None):
    """the small plate, the lead: what people say. Bowed at its edge for bow seconds from s, then left to ring"""
    _bow(m, s, g, max(-0.3, min(0.3, (m - 62) * 0.02)) if pan is None else pan, bow, rough, room, until, False)

def big(m, s, g=1.0, pan=None, bow=1.6, rough=0.3, room=0.3, until=None):
    """the large plate, the partner: what the systems count. An octave lower, bowed once and left to settle"""
    _bow(m, s, g, -0.12 if pan is None else pan, bow, rough, room, until, True)

# ---- what they play
def chord(notes, s, g=1.0, step=0.3, bow=1.6, until=None):
    """a chord bowed a plate at a time, from the lowest up: the large plate takes the notes below D 3"""
    for i, m in enumerate(notes):
        (big if m < D3 else plate)(m, s + step * i, g, None, max(0.5, bow - step * i), until=until)

def mark(s, g=1.0, gap=1.6, last=2.2, under=None, until=None):
    """the mark: the small plate's D 4 bowed until it settles, then the same note again, steadier, and held: what was heard, written
    down. under: the large plate's note, an octave lower, with the steadier note, where the current state is written"""
    plate(D4, s, 0.85 * g, 0.0, bow=1.0, rough=1.0, until=until)
    plate(D4, s + gap, g, 0.0, bow=last, rough=0.0, until=until)
    if under is not None:
        big(under, s + gap, 0.9 * g, -0.12, bow=last, rough=0.0, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def sheet(s, g=0.0045, pan=0.0):
    """a sheet of thick paper pinned to the wall: a soft flap as it's laid flat, and the pin pressed home"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.24)[:n], 'band', (300, 1500)) * _bump(x, 0.09) * (x < 0.09)
    _fx(fl + 0.5 * _knock(n, 190, 0.012, 0.12) / 1.35, s, g, pan, 1800)
def card(s, g=0.004, pan=0.0):
    """a card set down: a short, soft pat of thick paper"""
    n = int(0.14 * SR); x = np.arange(n) / SR
    pt = filt(noise(0.16)[:n], 'band', (350, 1700)) * _bump(x, 0.05) * (x < 0.05)
    _fx(pt + 0.55 * _knock(n, 160, 0.016, 0.045) / 1.35, s, g, pan, 1900)
def flip(s, g=0.0045, pan=0.0):
    """a card turned over: a quick lift of paper through the air, and its soft landing"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    ar = filt(noise(0.32)[:n], 'band', (250, 1200)) * _bump(x, 0.16, 1.4) * (x < 0.16)
    _fx(ar + 0.5 * _knock(n, 150, 0.018, 0.2) / 1.35, s, g, pan, 1600)
def tap(s, g=0.0035, pan=0.0):
    """something small lit or set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 220, 0.012), s, g, pan, 1600)
def pen(s, sec=0.7, g=0.0045, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def knock(s, g=0.005, pan=0.0):
    """a knuckle on a wooden door, twice, softly: a hollow, low knock and a second one a little quieter"""
    n = int(0.4 * SR)
    _fx(_knock(n, 140, 0.03) + 0.4 * _knock(n, 260, 0.012) + 0.8 * _knock(n, 140, 0.03, 0.17) + 0.3 * _knock(n, 260, 0.012, 0.17), s, g, pan, 1100)
def book(s, g=0.0055, pan=0.0):
    """a closed book set down on a table: a low, soft thud, and its pages' faint breath"""
    n = int(0.35 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 95, 0.045) + 0.25 * filt(noise(0.37)[:n], 'band', (200, 900)) * np.exp(-x / 0.03), s, g, pan, 1000)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """a card slid along, or a thread drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def tiles(s, sec=1.0, g=0.0035, pan=0.0):
    """report tiles laid out on a screen: one soft texture of paper settling, that swells in and stops, never a burst of taps"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 18); gr = 0.6 + 0.4 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1400)) * _bump(x, sec, 0.9) * gr, s, g, pan, 1600)
def dim(s, g=0.0035, pan=0.0):
    """tiles going grey together: one soft, low settle, like a sheet laid face down"""
    n = int(0.45 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.47)[:n], 'band', (150, 700)) * _bump(x, 0.3, 1.2) * (x < 0.3) + 0.4 * _knock(n, 110, 0.03, 0.25), s, g, pan, 900)

# =============================================================================================================================
# 1. The mothers' word: the opening, the module's story from outside data. Accra, the early 1930s: the large plate's low D, alone,
#    then D major on the small plate as the clinic comes in; G major for the Ga people's children and their mothers. The sickness:
#    B minor, low; the amber card; the large plate's low F sharp under "killed them"; pellagra and its card, and B minor again, gone
#    before "Something had to change", which has nothing under it. She listens: D major, the large plate's D under the small plate's
#    A and D, and F sharp for the nurses and healers. Three years: B, low. The word: a pen in the notebook, and the mark, as the
#    mothers tell it and Williams writes it down. The displaced child: G major, low. 1933 and 1935, the two papers; A major for the
#    mothers' word in print. The three children who went home: D major, bright. The mothers' name: G major. Then and now, and one A
#    for what the mothers had seen. The university: D major as the picture turns to data; B, low, for 41 days and nobody seeing the
#    whole; the small plate's D for "listens first" and the large plate's D for "what the systems count", an octave apart, as the
#    film's two plates are met; D major for the seven ways to do better, and D major, held, under the title card
LV[0] = 0.9
ow = lambda lid, word, off=0: W('word', lid, word, off)
oc = lambda lid, off=0: G('word', lid, off)
OEND = E('word')
big(D2, 0.3, 0.8, 0.0, bow=2.4)
chord((A3, D4, Fs4), ow('accra', 'Accra', 0.2), 0.65, step=0.32, bow=2.6)
card(ow('cicely', 'Cicely', -0.1), 0.0035, px(1320))
chord((G2, B3, D4), ow('cicely', 'mothers', -0.2), 0.55, step=0.28, bow=1.8)
# the card of the sickness and its three chips, one by one; B minor, low
card(ow('sick', 'Children', -0.1), 0.0035, px(1300))
big(B2, ow('sick', 'sick', -0.1), 0.6, bow=1.8)
for w in ('hands', 'skin', 'wasted'):
    tap(ow('sick', w, 0.05), 0.003, px(1300))
card(ow('died', 'nearly', -0.1), 0.0035, px(1300))
big(Fs2, ow('died', 'killed', 0.0), 0.55, bow=1.4)
# pellagra's card, the amber tag on "kept dying", and B minor, gone before "Something had to change"
card(ow('pellagra', 'pellagra', -0.1), 0.0035, px(1300))
tap(ow('pellagra', 'dying', 0.0), 0.003, px(1300))
chord((B2, D4, Fs4), ow('pellagra', 'dying', 0.2), 0.5, step=0.3, bow=1.6, until=oc('change', -0.3))
book(ow('nobook', 'book', -0.1), 0.005, px(1100))
# she listens: the mother and the grandmother on the bench, the nurse beside them; D major, the large plate under the small
chord((D2, A3, D4), ow('listened', 'listened', 0.0), 0.6, step=0.35, bow=2.0)
plate(Fs4, ow('listened', 'healers', 0.0), 0.5, bow=1.2)
card(ow('feared', 'three', -0.1), 0.0035, px(1300))
big(B2, ow('feared', 'feared', 0.0), 0.5, bow=1.0, until=ow('told', 'kwashiorkor', -0.2))
# the word: written in the notebook, then large on its card; the mark, as the mothers tell it and Williams writes it down
pen(ow('told', 'told', 0.1), 0.8, 0.0045, px(760), 3)
card(ow('told', 'kwashiorkor', 0.5), 0.0035, px(1100))
mark(ow('told', 'kwashiorkor', 0.0), 0.75, gap=1.6, last=2.0)
# the displaced child: its meaning under the word; the mother, the new baby on her back, the older child beside her; G major, low
card(ow('means', 'displaced', -0.1), 0.0035, px(1100))
chord((G2, D3, B3), ow('means', 'next', 0.0), 0.5, step=0.3, bow=1.6)
card(ow('maize', 'maize', -0.1), 0.0035, px(1300))
# the two papers, 1933 and 1935; A major for the mothers' word in print
card(ow('wrote', 'nineteen', 0.0), 0.0035, px(1180)); card(ow('wrote', 'two', 0.0), 0.0035, px(1460))
chord((A2, Cs4, E4), ow('wrote', 'mothers', 0.0), 0.5, step=0.28, bow=1.6)
# the three children who went home: the green card, and D major, bright
card(ow('cured', 'Three', -0.1), 0.0035, px(1300))
chord((D3, Fs4, A4), ow('cured', 'cured', 0.0), 0.55, step=0.26, bow=1.8)
# the mothers' name, used worldwide; G major. Then and now; one A for what the mothers had seen
card(ow('name', 'mothers', -0.1), 0.0035, px(1100))
chord((G2, B3, D4), ow('name', 'name', 0.1), 0.5, step=0.3, bow=1.4)
card(ow('known', 'once', -0.1), 0.0035, px(1300))
plate(A4, ow('when', 'comes', 0.2), 0.5, bow=1.2)
# the turn to data: a dissolve to the team's room, D major; 41 working days and nobody seeing the whole, B, low
chord((D2, A3, Fs4), ow('same', 'Data', 0.0), 0.55, step=0.3, bow=1.8)
card(ow('uni', 'forty-one', -0.1), 0.0035, px(1300))
card(ow('uni', 'whole', -0.1), 0.0035, px(1300))
big(B2, ow('uni', 'whole', 0.1), 0.5, bow=1.2)
# Helena at the window; the three chips; the small plate for "listens first", the large plate for "what the systems count"
for w in ('thirty-one', 'three', 'systems'):
    tap(ow('listens', w, 0.0), 0.003, px(1300))
plate(D4, ow('listens', 'listens', 0.1), 0.5, bow=1.0)
big(D3, ow('listens', 'systems', 0.1), 0.6, bow=1.2)
# six weeks on: the five small pages, and the green "7 opportunities"; D major
card(ow('sees', 'Six', 0.0), 0.0035, px(960))
card(ow('sees', 'seven', -0.1), 0.0035, px(1400))
chord((D3, Fs3, A3, D4), ow('sees', 'better', 0.1), 0.55, step=0.26, bow=1.8)
# the title card: D major, held, gone as the next chapter comes in
big(D2, oc('breath', 0.2), 0.7, bow=3.0, until=OEND)
chord((A3, D4, Fs4), oc('breath', 0.5), 0.6, step=0.34, bow=2.6, until=OEND)

# 2. Three questions: the chapter turns on G major. Six weeks lit on her plan; the 31 marks filling; the card of three questions, and a
#    note of D major after each is asked, rising (D, F sharp, A), single notes far enough apart that they never make a figure. The grid
#    lining up; the corridor and a knock at each door; go and see, and A major. Her notebook, and the mark as she writes people's words
#    as Williams kept the mothers'. Four cards of words, nothing under them; a fifth, D and A, after "Keep it", for what already works.
#    Graham's card and its amber tag; the module's card, and the large plate's B, low, as his request waits its turn
LV[0] = 0.9
aw = lambda lid, word, off=0: W('ask', lid, word, off)
chord((G2, B3, D4), S0('ask') + 0.2, 0.55, step=0.3, bow=1.6)
tap(aw('plan', 'six', 0.0), 0.003, px(1240))
pen(aw('who', 'Thirty-one', 0.1), 1.6, 0.0035, px(1300), 4)
card(aw('same', 'three', -0.1), 0.0035, px(1100))
plate(D4, END('ask', 'q1', 0.05), 0.5, bow=0.8)
plate(Fs4, END('ask', 'q2', 0.05), 0.5, bow=0.8)
plate(A4, END('ask', 'q3', 0.05), 0.5, bow=1.0)
slide(aw('side', 'side', -0.2), 1.2, 0.003, px(1200))
for w, x in (("registrar's", 520), ('Finance', 960), ('Facilities', 1400)):
    knock(aw('go', w, 0.0), 0.0045, px(x))
card(aw('lean', 'go', -0.1), 0.0035, px(1300))
chord((A2, Cs4, E4), END('ask', 'lean', 0.1), 0.5, step=0.3, bow=1.2)
pen(aw('words', 'writes', 0.0), 0.7, 0.004, px(760), 3)
mark(aw('words', 'mothers', 0.0), 0.7, gap=1.6, last=1.6)
for lid, name, x in (('clara', 'Clara', 600), ('ingrid', 'Ingrid', 1320), ('anil', 'Anil', 600), ('mei', 'Mei', 1320)):
    card(aw(lid, name, -0.1), 0.0035, px(x))
chord((D4, A4), END('ask', 'mei', 0.1), 0.45, step=0.3, bow=1.0)
card(aw('graham', 'Graham', -0.1), 0.0035, px(1300))
tap(aw('graham', 'waits', 0.0), 0.003, px(1300))
card(aw('behind', 'leading', -0.1), 0.0035, px(1300))
big(B2, END('ask', 'behind', 0.1), 0.5, bow=1.0, until=E('ask'))

# 3. What's written: the chapter turns on the large plate's D and A, low; the three documents set down one by one; the four goals'
#    tiles, a tap each, and D major after the last; the digital strategy's card; the twelve decisions, a pen's stroke for each of the
#    five rows, and a tap for "and 7 more"; the blue threads drawn, the small plate's A as an answer is tied to a decision, and the
#    large plate's D as the decision is tied to a goal
LV[0] = 0.9
rw = lambda lid, word, off=0: W('read', lid, word, off)
chord((D2, A2), S0('read') + 0.2, 0.5, step=0.3, bow=1.4)
for w, x in (('proposing', 700), ('reads', 960), ('written', 1220)):
    card(rw('read', w, 0.0), 0.0035, px(x))
for w, x in (('students', 560), ('research', 820), ('campus', 1080), ('finances', 1340)):
    tap(rw('four', w, 0.0), 0.003, px(x))
chord((D4, Fs4, A4), END('read', 'four', 0.1), 0.5, step=0.3, bow=1.2)
card(rw('digital', 'digital', -0.1), 0.0035, px(960))
card(rw('assess', 'twelve', -0.1), 0.0035, px(1300))
for w in ('budget', 'casual', 'timetable', 'courses', 'research'):
    pen(rw('twelve', w, 0.0), 0.3, 0.0035, px(1300), 1)
tap(rw('twelve', 'seven', 0.0), 0.003, px(1300))
slide(rw('tie', 'tied', -0.1), 1.0, 0.003, px(900))
slide(rw('tie', 'goal', -0.3), 0.9, 0.003, px(1200))
plate(A3, rw('tie', 'decision', 0.0), 0.5, bow=1.0)
big(D3, rw('tie', 'goal', 0.1), 0.55, bow=1.2, until=E('read'))

# 4. What the systems count: people show where it hurts, the small plate's F sharp; the systems show how much, the large plate's B. The
#    tracker's 41 days, a card; the warehouse's 38 tiles laid out, one soft texture; 17 going grey together; 21 lit; the cost and the
#    licence, and the large plate's F sharp, low; three findings, B minor, and a card for each; the Thursdays' card and its four bars
#    falling, a tap each, and D major for what already works; the data quality module's card; and the small plate's A, plain, for
#    writing down what works
LV[0] = 0.9
cw = lambda lid, word, off=0: W('count', lid, word, off)
plate(Fs4, cw('hurts', 'hurts', 0.1), 0.5, bow=1.0)
big(B2, cw('hurts', 'much', 0.0), 0.55, bow=1.4)
card(cw('tracker', 'forty-one', -0.1), 0.0035, px(1300))
tiles(cw('logs', 'thirty-eight', -0.1), 1.0, 0.003, px(1100))
dim(cw('unopened', 'Seventeen', 0.2), 0.0035, px(1100))
tap(cw('used', 'twenty-one', 0.1), 0.003, px(1100))
card(cw('cost', 'costs', -0.1), 0.0035, px(1400))
tap(cw('cost', 'licence', 0.0), 0.003, px(1400))
big(Fs2, END('count', 'cost', 0.1), 0.5, bow=1.2)
chord((B2, D4), cw('beside', 'findings', 0.0), 0.5, step=0.3, bow=1.2)
for lid, w, x in (('eleven', 'eleven', 560), ('copies', 'three', 960), ('forty', 'forty', 1360)):
    card(cw(lid, w, -0.1), 0.0035, px(x))
card(cw('thurs', 'works', -0.1), 0.0035, px(1300))
for w in ('Reprinted', 'fell', 'forty-one', 'three'):
    tap(cw('fell', w, 0.0), 0.003, px(1300))
chord((D3, Fs4, A4), END('count', 'fell', 0.1), 0.5, step=0.3, bow=1.2)
card(cw('small', 'Small', -0.1), 0.0035, px(1300))
plate(A4, END('count', 'keep', 0.1), 0.45, bow=0.9, until=E('count'))

# 5. Five layers: the mark, both plates, as the current state is written down: the small plate's D at "baseline", then the same note
#    again, steadier, with the large plate's D an octave below it. Each page pinned, and one note as its picture completes, down
#    through D major from the top layer to the bottom: strategy the small plate's A, business its F sharp, information its D,
#    application the large plate's A, technology its D. ArchiMate's two objects, a tap each; Helena's five beside them, "Information"
#    lit, and the two plates' D together, an octave apart; the five layers land on Noor's map; and G major for the map to come
#    (the module's palettes.md: the same note, an octave apart, where the current state is written down)
LV[0] = 0.9
lw = lambda lid, word, off=0: W('layers', lid, word, off)
mark(lw('baseline', 'baseline', 0.0), 0.75, gap=1.6, last=2.0, under=D3)
sheet(lw('five', 'page', 0.0), 0.004, px(600))
sheet(lw('strat', 'Strategy', -0.1), 0.004, px(600))
tap(lw('strat', 'Governing', 0.0), 0.003, px(1300)); tap(lw('strat', 'delivering', 0.0), 0.003, px(1300))
plate(A4, END('layers', 'strat', 0.1), 0.45, bow=1.0)
sheet(lw('biz', 'Business', -0.1), 0.004, px(600))
slide(lw('ways', 'eleven', -0.1), 1.0, 0.003, px(1300))
tap(lw('ways', 'forty-one', 0.0), 0.003, px(1300))
plate(Fs4, END('layers', 'ways', 0.1), 0.45, bow=1.0)
sheet(lw('info', 'Information', -0.1), 0.004, px(600))
tap(lw('staff', 'copied', 0.0), 0.003, px(1300))
plate(D4, END('layers', 'staff', 0.1), 0.45, bow=1.0)
sheet(lw('app', 'Application', -0.1), 0.004, px(600))
tiles(lw('app', 'thirty-eight', -0.1), 0.8, 0.003, px(1300))
big(A3, END('layers', 'app', 0.1), 0.5, bow=1.0)
sheet(lw('tech', 'Technology', -0.1), 0.004, px(600))
tap(lw('tech', 'servers', 0.0), 0.003, px(1300))
big(D3, END('layers', 'tech', 0.1), 0.5, bow=1.0)
tap(lw('archi2', 'business', 0.0), 0.003, px(800)); tap(lw('archi2', 'application', 0.0), 0.003, px(800))
tap(lw('own', 'own', 0.0), 0.003, px(1300))
plate(D4, END('layers', 'own', 0.1), 0.5, bow=1.4, rough=0.0)
big(D3, END('layers', 'own', 0.1), 0.45, bow=1.4, rough=0.0)
tap(lw('map', 'map', 0.0), 0.003, px(1100))
card(lw('today', 'map', -0.1), 0.0035, px(1300))
chord((G2, B3, D4), END('layers', 'today', 0.1), 0.5, step=0.3, bow=1.2, until=E('layers'))

# 6. Sent back: the chapter turns on the large plate's B, low, as a finding could read as someone's fault; each card turned over, and a
#    note after each (D, then F sharp); the seven blue cards, four and three, and D major; the milestone, the five small pages and the
#    seven cards; the summary sent, and an open fifth, A and E, as she asks what she got wrong; replies, and a line struck and written
#    again. Accra comes back: the opening's D major, the large plate under the small. "In their words": the two plates' A together, an
#    octave apart, left open for the mark's D.
#    Next; and the mark under the end card, the large plate under its steadier note, then D major, held, to the end
LV[0] = 0.9
bw = lambda lid, word, off=0: W('back', lid, word, off)
bc = lambda lid, off=0: G('back', lid, off)
big(B2, S0('back') + 0.2, 0.5, bow=1.2)
card(bw('blame', 'fault', -0.2), 0.0035, px(1100))
flip(bw('not1', 'one', -0.1), 0.004, px(1100))
plate(D4, END('back', 'not1', 0.1), 0.45, bow=0.9)
flip(bw('not2', 'partners', -0.3), 0.004, px(1100))
plate(Fs4, END('back', 'not2', 0.1), 0.45, bow=0.9)
card(bw('seven', 'Seven', -0.1), 0.0035, px(800)); card(bw('seven2', 'data', -0.1), 0.0035, px(1200))
chord((D2, Fs4, A4), END('back', 'seven2', 0.1), 0.5, step=0.3, bow=1.4)
card(bw('march', 'Monday', -0.1), 0.0035, px(1300))
card(bw('pages', 'five', -0.1), 0.0035, px(700)); tap(bw('pages', 'seven', 0.0), 0.003, px(1300))
slide(bw('sends', 'sends', -0.1), 1.0, 0.003, px(1300))
chord((A3, E4), END('back', 'sends', 0.1), 0.45, step=0.3, bow=1.2)
tap(bw('fix', 'write', 0.0), 0.003, px(1300))
pen(bw('fix', 'change', -0.1), 0.6, 0.004, px(900), 2)
chord((D2, A3, D4), bw('accra', 'Accra', 0.0), 0.5, step=0.32, bow=1.8)
plate(A3, END('back', 'knew', 0.1), 0.5, bow=1.4, rough=0.0)
big(A2, END('back', 'knew', 0.1), 0.45, bow=1.4, rough=0.0)
card(bw('next', 'Next', -0.1), 0.0035, px(1300))
mark(bw('take', 'write', 0.0), 0.7, gap=1.8, last=2.4, under=D3)
big(D2, bc('breath', 0.3), 0.6, bow=3.4, until=TOT)
chord((A3, Fs4), bc('breath', 0.6), 0.5, step=0.4, bow=3.0, until=TOT)
