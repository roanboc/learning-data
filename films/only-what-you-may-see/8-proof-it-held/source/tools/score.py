# Proof it held: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py). A new
# palette, claimed in /mnt/project-files/data-protection/palettes.md on 5 November 2026 ("lyre" and "tam-tam" were in no score.py,
# music.py or other source on main or any branch, nor in any palettes list in the project files): a round lyre and a tam-tam, both
# made here (music.py has neither).
#  - The round lyre, the early medieval lyre of northern Europe (six gut strings over a hollow wooden body, as found at Sutton Hoo and
#    Trossingen), plucked softly with the fingers: a short, warm ring, no vibrato. Its six strings are tuned D3, G3, B3, D4, E4, G4, in
#    just intonation from G, so every two of them sound pure together and nothing beats. Played strum and block, as many of its players
#    play it today: one hand strums every string while the other stops all but the chosen ones, so only the allowed notes sound, and a
#    stopped string gives only a muted touch. The strum is the proof that the block held: where the film's data is kept from someone, a
#    string is stopped (Elena's place, as the review closes; the masked mobile column; the names, emails and exam support that never
#    reach the study), and the end card's chord is struck with its one string stopped.
#  - The mark: two strings, the outer one (E4) the reference, as the monitor's circle is; the inner one plucked a step higher each time
#    and never lower (G3, B3, D4), until it meets the outer one (E4 with E4: the square as dark as the circle, and the vial thrown away).
#    In the data story the inner note always stays below the outer one: it held.
#  - The tam-tam, struck softly once with a large felt beater: a slow, dark bloom with no clang, kept under 2.5 kHz: the heat that builds
#    unseen in the opening, the turn to the review, and access ending on its date. Three strokes in the film (the palette allows four).
#  - G major for the clinic and for what held; E minor for the child given vaccine that no longer worked.
# The rules the module keeps (its briefs, as the governance and agent films do):
#  - Music under the opening story; after it only at a chapter's turn, under a moment on screen or in a pause without words; never a bed
#    under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every two notes are tuned pure (hz()). No urgent pulse:
#    film.json lists no urgent chapter.
#  - Every sound is an event on screen, at the moment it appears, timed as src/scenes.js times the picture (the same word). A burst on
#    screen is one soft sound, or a few, never one for each.
# And everything stays low and soft, below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# A missing word stops the mix, so a typo can't move a sound
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
R1 = np.random.default_rng(1996)  # this film's own randomness: the room, the breath of the strings

# ---- tuning: just intonation from G, so any two of the lyre's strings are whole-number ratios of each other. G B D (G major), E G B
# (E minor), and D with E (10/9) are all pure; the lyre has no A, C or F sharp, so no chord here can beat
_JI = {0: 1, 2: 9 / 8, 4: 5 / 4, 5: 4 / 3, 7: 3 / 2, 9: 5 / 3, 11: 15 / 8}
KEY = (55, 196.0)  # G 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
D3, G3, B3, D4, E4, G4 = 50, 55, 59, 62, 64, 67
STR = (D3, G3, B3, D4, E4, G4)     # the six strings, the lowest first
OUT = E4                           # the mark's outer string: the reference, the monitor's circle

# ---- the levels, set so the music's loud moments sit under the governance films' (tools/quiet.py): the lyre, the tam-tam a little
# under it, and the effects far under the music (FX scales them all)
LY, TT, FX = 0.060, 0.050, 1.0

# a room round the players: a small wooden room at night, ringing on for about a second, nothing much above 1.8 kHz. Its level is set
# by what it rings where the notes are (its gain under 1.5 kHz is one), and each held sound is set back to its own level (_held)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a sound in the room at its own level: the room moves a note's level by where its reflections meet it, so the sound is set back
    to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the round lyre: a gut string plucked softly with a finger, a short warm ring. Its harmonics as a finger plucking near the bridge
# leaves them, the higher dying sooner (gut), the hollow body warm near 330 Hz, the finger's soft touch at the start. No vibrato
def lyre(m, s, g=1.0, pan=0.0, ring=None, pos=0.21, room=0.25):
    f = hz(m); ring = ring or (1.45 if f < 200 else 1.2 if f < 300 else 1.0)
    sec = min(4.6, ring * 3.4); x = tt(sec).astype(np.float64); sig = np.zeros_like(x)
    for k in range(1, 14):
        fk = f * k
        if fk > 2300:
            break
        a = abs(np.sin(np.pi * k * pos)) / k ** 1.2
        body = 1 + 0.6 * np.exp(-((fk - 330) / 170) ** 2)
        sig += a * body * np.sin(2 * np.pi * fk * x + 0.31 * k) * np.exp(-x * (1 + 0.6 * (k - 1)) / ring)
    sig *= np.sin(0.5 * np.pi * np.minimum(1, x / 0.004)) ** 2
    nt = int(0.025 * SR); sig[:nt] += filt(noise(0.03)[:nt], 'band', (300, 1600)) * np.exp(-np.arange(nt) / SR / 0.004) * 0.05
    sig *= np.cos(0.5 * np.pi * np.clip((x - sec + 0.2) / 0.2, 0, 1)) ** 2
    put(_held(filt(sig.astype(np.float32), 'low', 2300), room), s, g * LY, pan)
def stopped(m, s, g=1.0, pan=0.0):
    """a string the other hand stops as the strum crosses it: a muted touch, its pitch barely there, gone at once"""
    f = hz(m); x = tt(0.09).astype(np.float64)
    sig = (np.sin(2 * np.pi * f * x) + 0.25 * np.sin(4 * np.pi * f * x)) * np.exp(-x / 0.016) * np.sin(0.5 * np.pi * np.minimum(1, x / 0.003)) ** 2
    sig += filt(noise(0.1)[:len(x)], 'band', (200, 1100)) * np.exp(-x / 0.01) * 0.2
    put(filt(sig.astype(np.float32), 'low', 1500), s, g * LY * 0.3, pan)
def strum(open_, s, g=1.0, pan=0.0, step=0.03, strings=STR):
    """a strum across the strings (all six, the lowest first): the strings in open_ ring, the rest are stopped"""
    for i, m in enumerate(strings):
        p = pan + 0.05 * (i - 2.5)
        if m in open_:
            lyre(m, s + i * step, g * (1.0 if i == 0 else 0.86), p)
        else:
            stopped(m, s + i * step, g, p)
def mark(inner, s, g=1.0, pan=0.0, gap=0.42):
    """the mark: the inner string, then the outer one, the reference"""
    lyre(inner, s, g * 0.95, pan - 0.05); lyre(OUT, s + gap, g, pan + 0.05)

# ---- the tam-tam, struck softly once with a large felt beater: many partials that aren't harmonics of one note, the low ones there at
# once, the higher ones blooming in over a second or more and dying sooner, so the sound swells darkly after the stroke and fades for
# seconds. Its partials sit between the lyre's (which all fall on a grid of 49 Hz, but E4's), and at least 30 Hz from each other, so
# nothing beats; a felt thump at the stroke; nothing above 2 kHz
_TF = []
_r = np.random.default_rng(1979)
for _k in range(1, 34):
    _f = 49.0 * _k + 24.5 + _r.uniform(-5, 5)
    if _f > 1900:
        break
    if all(abs(_f - 326.667 * j) > 16 for j in range(1, 7)) and (_k < 8 or _r.uniform() < 0.6):
        _TF.append(_f)
def tamtam(s, g=1.0, pan=0.0, sec=9.0, room=0.3):
    x = tt(sec).astype(np.float64); sig = np.zeros_like(x)
    for i, f in enumerate(_TF):
        u = min(1.0, (f - 60) / 1200)
        bloom = 0.02 + 1.4 * u ** 0.8            # the higher partials take longer to come in
        decay = 6.5 - 4.5 * u ** 0.7              # and die sooner
        a = (f / 120) ** -0.9 * (0.6 + 0.4 * _r.uniform())
        sig += a * (1 - np.exp(-x / bloom)) * np.exp(-x / decay) * np.sin(2 * np.pi * f * x + _r.uniform(0, 6.28))
    nt = int(0.12 * SR); th = filt(noise(0.13)[:nt], 'low', 220) * np.exp(-np.arange(nt) / SR / 0.03) * 0.5
    sig[:nt] += th
    sig *= np.sin(0.5 * np.pi * np.minimum(1, x / 0.01)) ** 2
    sig *= np.cos(0.5 * np.pi * np.clip((x - sec + 1.5) / 1.5, 0, 1)) ** 2
    sig /= max(1e-9, float(np.abs(sig).max()))
    put(_held(filt(sig.astype(np.float32), 'low', 2000), room), s, g * TT, pan)

# ---- the effects, soft and low, each where something happens on screen
def setdown(s, g=0.020, pan=0.0):
    """a small glass vial set down on the bench: a soft knock, and the glass's short, low ring"""
    s_knock(s, g * FX, pan, 360); x = tt(0.14)
    X((np.sin(2 * np.pi * 1180 * x) * np.exp(-x / 0.03) * 0.25).astype(np.float32), s + 0.004, g * FX, pan)
def drop(s, g=0.012, pan=0.0):
    """a drop of vaccine: a tiny, soft plip"""
    x = tt(0.08); f = 900 - 3000 * x
    X((np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.02) * np.sin(np.pi * np.minimum(1, x / 0.004))).astype(np.float32), s, g * FX, pan)
def binned(s, g=0.016, pan=0.0):
    """a vial dropped in the bin: a soft, low knock"""
    s_knock(s, g * FX, pan, 190)
def card(s, g=0.010, pan=0.0, sec=0.35):
    """a card or a page of glass comes in: a short breath of air"""
    s_air(s, sec, g * FX, pan, 220, 1300)
def tap(s, g=0.010, pan=0.0):
    """a row lit, a slot drawn: a muffled tap"""
    s_tap(s, g * FX, pan)
def click(s, g=0.012, pan=0.0):
    """a decision made, an alert sent: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def tick(s, g=0.012, pan=0.0):
    """a proof ticked green: a small, soft knock"""
    s_knock(s, g * FX, pan, 420)
def paper(s, g=0.010, pan=0.0, sec=0.4):
    """a sheet filed"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def quake(s, g=0.020, sec=1.8):
    """the earthquake, far off: a low, soft rumble that swells and fades"""
    x = tt(sec); X(filt(noise(sec), 'low', 140)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, 0.0)

# =============================================================================================================================
# 1. The square on the vial: the opening, with music all through it.
#    The clinic at night: the lyre's home chord, G major, struck with its E stopped. The vial: the mark's first state, the inner string
#    on G under the outer E (lighter than the circle). Heat spoils it and leaves no sign: the tam-tam's first stroke, blooming unseen.
#    Left in the sun: the inner string a step higher, B. Thrown away: three soft knocks in the bin. A child given vaccine that no longer
#    worked: E minor. Something had to change: one D. PATH and a company: the strings rising, G, B, D. The monitor: the mark again, G
#    under E; heat darkens the square: B, then D, never lower; as dark as the circle: E meets E, and a strum over the four low strings, all stopped,
#    the vial thrown away. 1996: G major. The moment of use: G. Over $14 million a year: G major, every string but E. A child still
#    protected: the low strings. Data's same problem: two plucks of the same note, one that failed and one that held. The monitor
#    added to the study: the mark, G under E. The title card: the home chord again, ringing out
Q = lambda lid, word, off=0: W('square', lid, word, off)
strum((D3, G3, B3, D4, G4), 0.3, 0.8, px(700), step=0.05)
setdown(Q('drops', 'two drops', -0.9), 0.016, px(640))
drop(Q('drops', 'two drops', 0.0) + 0.55, 0.010, px(640)); drop(Q('drops', 'two drops', 0.9) + 0.6, 0.009, px(640))
mark(G3, Q('drops', 'vial', 0.05), 0.75, px(640))
for k_, w_ in enumerate(('factory', 'child')):
    tap(Q('cold', w_, -0.1), 0.008, px(300 + 1320 * k_))
tamtam(Q('heat', 'heat', -0.15), 0.8, px(1500))
setdown(Q('sun', 'sun', -0.3), 0.014, px(1300))
mark(B3, Q('sun', 'just like', 0.0), 0.7, px(1300))
for i in range(3):
    binned(Q('threw', 'threw away', 0.2 + i * 0.55 + 0.75), 0.013, px(1060))
strum((G3, B3, E4), Q('child', 'family', -0.1), 0.62, px(1060), step=0.045)
lyre(D4, Q('change', 'see whether', 0.0), 0.55, px(560))
card(Q('asked', 'World Health', -0.6), 0.009, px(1300))
card(Q('path', 'PATH', -0.2), 0.009, px(1300))
for k_, m_ in enumerate((G3, B3, D4)):
    lyre(m_, Q('path', 'vaccine vial monitor', -0.1) + 0.32 * k_, 0.6, px(1100) + 0.05 * k_)
mark(G3, Q('square', 'square', 0.1), 0.7, px(1180))
lyre(B3, Q('darkens', 'darkens', 0.0), 0.62, px(1180)); lyre(OUT, Q('darkens', 'darkens', 0.42), 0.62, px(1180))
mark(D4, Q('darkens', 'never', 0.1), 0.62, px(1180))
lyre(G3, Q('lighter', 'used', -0.1), 0.5, px(1000))
mark(E4, Q('darker', 'As dark', 0.0), 0.62, px(1300), gap=0.5)
strum((), Q('darker', 'thrown away', 0.0), 1.0, px(1300), step=0.04, strings=STR[:4])
strum((G3, B3, D4, G4), Q('cents', 'ninety-six', -0.05), 0.65, px(400), step=0.04)
lyre(G3, Q('moment', 'moment of use', 0.1), 0.5, px(900))
card(Q('saves', 'UNICEF', -0.2), 0.009, px(1080))
strum((D3, G3, B3, D4, G4), Q('saves', 'fourteen million', 0.0), 0.62, px(1080), step=0.045)
lyre(D3, Q('protects', 'still protects', 0.0), 0.55, px(1060)); lyre(G3, Q('protects', 'still protects', 0.5), 0.45, px(1060))
lyre(B3, Q('mark', 'failed', 0.0), 0.5, px(520)); lyre(B3, Q('mark', 'one that held', 0.1), 0.5, px(1400))
card(Q('adds', 'adds the monitor', -0.4), 0.009, px(560))
mark(G3, Q('adds', 'proof', 0.0), 0.62, px(820))
tE = G('square', 'breath', 0.5)
strum((D3, G3, B3, D4, G4), tE, 0.72, 0.0, step=0.06)

# 2. Four promises. Mei and the agreement, as An agreement first set it down; today is the study's first review: the tam-tam's second
#    stroke, the turn to the review. Each promise lit as it's read: a muffled tap. Four proofs: an open fifth, G and D, the question
#    still open
P = lambda lid, word, off=0: W('promises', lid, word, off)
card(G('promises', 'months', -0.4), 0.009, px(1040))
tamtam(P('today', 'first review', -0.1), 0.65, px(960))
for lid_, w_ in (('who', 'Who'), ('never', 'Never'), ('where', 'Where'), ('ends', 'Ends')):
    tap(P(lid_, w_, -0.1), 0.007, px(1040))
lyre(G3, P('four', 'four proofs', 0.0), 0.5, px(1040)); lyre(D4, P('four', 'four proofs', 0.08), 0.42, px(1040))

# 3. Who could read it. The grants: a tap as each row comes in. The directory's group, then the review: a breath of air for each page.
#    Elena moved: a step down, D to B. Mei keeps Anil and removes Elena: a click for each decision; as the review closes, the strum with
#    Elena's string stopped (B), the rest ringing. The agent on the review too: one high G. The proof of who: the mark, G under E,
#    in the pause at the end
V = lambda lid, word, off=0: W('review', lid, word, off)
card(G('review', 'first', -0.3), 0.009, px(1250))
tap(V('grants', 'grants', 0.3), 0.008, px(1250)); tap(V('grants', 'grants', 0.7), 0.007, px(1250))
card(V('group', 'in the group', -0.2), 0.009, px(1220))
card(V('every', 'Every three months', -0.2), 0.009, px(1250))
lyre(D4, V('moved', 'moved', 0.0), 0.5, px(1250)); lyre(B3, V('moved', 'moved', 0.45), 0.45, px(1250))
click(V('keeps', 'keeps Anil', 0.0), 0.011, px(1600)); click(V('keeps', 'removes Elena', 0.0), 0.011, px(1600))
strum((D3, G3, D4, E4, G4), V('keeps', 'review closes', 0.0), 0.6, px(1250), step=0.04)
lyre(G4, V('agent', 'An agent', 0.1), 0.42, px(960))
tR = G('review', 'breath', -0.2)
tick(tR, 0.011, px(380)); mark(G3, tR + 0.12, 0.6, px(380))

# 4. A class and a policy. Every column its class, as every vial its monitor: the outer string alone, the reference. The morning check's
#    page. Friday, one found: the inner string close under the outer, D under E, the gap; the alert sent: a click. The new column: a
#    tap. Mei classes it direct, and the policy masks it with no new rule: the strum with E stopped, the masked string. Thirty-one hours
#    with no class: the lowest string alone
K = lambda lid, word, off=0: W('gap', lid, word, off)
lyre(OUT, K('like', 'monitor on every vial', 0.1), 0.45, px(560))
card(K('seven', 'seven', -0.2), 0.009, px(1250))
mark(D4, K('friday', 'found one', 0.0), 0.55, px(1250))
click(K('friday', 'found one', 0.9), 0.011, px(900))
card(K('mobile', 'mobile number', -0.2), 0.009, px(1250))
tap(K('load', 'new column', 0.1), 0.008, px(1250))
tap(K('phone', 'phone number', 0.0), 0.008, px(1500))
click(K('mei', 'direct', 0.0), 0.010, px(1400))
strum((D3, G3, B3, D4, G4), K('policy', 'masks it', 0.0), 0.55, px(1300), step=0.04)
lyre(D3, K('hours', 'thirty-one hours', 0.0), 0.55, px(960), ring=1.6)

# 5. Where it went, and who read it. Lineage: a breath of air as its lines are drawn. Mobile went nowhere: one stopped string, a touch
#    and nothing more. The study's columns reach it only as the code and the year: two plucks, G and D. Names, emails and exam support
#    never reach it: the strum with B, E and the high G stopped. The audit log's pages: air; the rows: taps. No one else: the proofs of
#    never and where, the mark, B under E. Yogyakarta: a far, low rumble; the monitors still good: the mark from the lowest string, D
#    under E. Proof finds the harm: a card
L = lambda lid, word, off=0: W('reads', lid, word, off)
card(G('reads', 'lineage', 0.2), 0.009, px(960))
s_air(L('lineage', 'column by column', -0.3), 1.0, 0.007 * FX, px(960), 200, 1000)
stopped(B3, L("nowhere", "went nowhere", 0.0), 1.3, px(1300))
lyre(G3, L('study', 'learner code', 0.0), 0.45, px(980)); lyre(D4, L('study', 'the year', 0.0), 0.42, px(1600))
strum((D3, G3, D4), L('never', 'never reach', -0.1), 0.55, px(960), step=0.045)
card(L('audit', 'audit log', -0.3), 0.009, px(1250))
tap(L('hours', 'night load', -0.2), 0.008, px(1250)); tap(L('hours', 'night load', 0.4), 0.007, px(1250))
tap(L('months', 'Anil', 0.0), 0.007, px(1250)); tap(L('months', 'Elena', 0.0), 0.007, px(1250))
tick(L('months', 'No one else', 0.1), 0.011, px(330)); mark(B3, L('months', 'No one else', 0.25), 0.55, px(330))
quake(L('quake', 'earthquake', -0.2), 0.016)
mark(D3, L('doses', 'still good', 0.0), 0.55, px(1300), gap=0.5)
card(L('doses', 'fifty thousand', -0.3), 0.009, px(460))
card(G('reads', 'proof', -0.1), 0.009, px(1200))

# 6. Until its date. Each member's place given until that date; on the day, the directory takes them out, and the grants made from the
#    contract end: the tam-tam's third stroke. On 1 July Yusuf checks: a soft knock as each line is ticked. The register: a sheet
#    filed. The proof of the end: the mark, B under E, in the pause at the end
N_ = lambda lid, word, off=0: W('ends', lid, word, off)
card(N_('place', 'place in the group', -0.3), 0.009, px(1040))
tamtam(N_('day', 'On the day', -0.05), 0.6, px(1040))
for w_ in ('empty', 'no grant', 'gone'):
    tick(N_('july', w_, -0.1), 0.009, px(700))
paper(N_('register', 'Every proof', -0.2), 0.009, px(1040), 0.4)
tN = G('ends', 'breath', -0.2)
tick(tN, 0.011, px(380)); mark(B3, tN + 0.12, 0.55, px(380))

# 7. Proof it held. The monitor on the vial: the outer string, the reference; whether the cold held: the mark from the lowest string,
#    D under E. The study's records: a card. Each record as it's named, a string a step higher (D, G, B, D). The take-away, in silence.
#    The series' eight films: a tap for every two as they come in. The end card: the home chord struck with its one string stopped, the
#    strum that proves the block held, and the low D under it, ringing out
H = lambda lid, word, off=0: W('held', lid, word, off)
lyre(OUT, H('vial', 'monitor', 0.0), 0.45, px(1260))
mark(D3, H('cold', 'whether the cold held', 0.1), 0.5, px(900), gap=0.55)
card(G('held', 'records', -0.3), 0.009, px(960))
for k_, (w_, m_) in enumerate((('who could read', D3), ('who did', G3), ('where each column', B3), ('ended on its date', D4))):
    lyre(m_, H('list', w_, -0.1), 0.42, px(560 + 260 * k_))
for k_ in range(4):
    tap(H('hope', 'Protection', 0.15) + 0.7 * k_, 0.007, px(300 + 440 * k_))
tH = G('held', 'breath', 0.5)
strum((D3, G3, B3, D4, G4), tH, 0.75, 0.0, step=0.065)
lyre(D3, tH + 0.9, 0.45, 0.0, ring=1.8)
