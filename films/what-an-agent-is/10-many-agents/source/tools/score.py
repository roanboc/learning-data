# Many agents, and what emerges: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 3 November 2026 against every score.py on main and on every branch, and against the series' other films
# (their instruments are listed in the series' palettes): many small voices, and one low one. Both are made here; music.py has neither.
#  - The small voices: soft, pure, rounded notes, each a short tone that blooms and fades like a drop (drop()). Each sounds where
#    something small appears on screen: a part of Eastgate, a pellet of mud, an ant, a bird, an agent. At first each comes in its own
#    time, scattered across left and right; then they fall into step and become one chord, which the same voices hold (mark()): the
#    film's mark for emergence. The imagined future's voices have a long echo and never fall into step.
#  - The low voice: a bass clarinet (bcl()), low and soft, one note at a time, held steady with no vibrato: the home note over Harare,
#    the group's lean in the naming study, the agents' break-in of July 2026, and Harare again near the end.
#  - E flat major, with the Lydian A natural at the turns, for wonder; the film ends on that chord, left open: E flat, B flat, F and A.
#    Two small figures mean the same all through: a check that passes is a rising fifth, E flat to B flat (tick()); a flag is two low
#    notes falling a fourth, B flat to F (flag()).
# The rules the series keeps (its briefs, 3 November 2026):
#  - Music under the opening story; after it, only at a chapter's turn, under a moment on screen, or in a pause without words; never a
#    bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than half its length, or for 12
#    seconds without a break.
#  - Nothing trembles or beats: each small voice is a pure tone with a faint octave, and a held note is one voice, steady; every chord
#    is tuned pure (just intonation from E flat, hz()), and F is never held with C (a fifth of 40/27 here, whose overtones beat). The
#    bass clarinet's odd overtones are kept off the notes they would rub: its B flat never sounds under a held C or A flat, its F never
#    with C. The one pulse is the market crash's, low and muted, about 96 beats a minute, as film.json's "urgent" allows (trace).
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as src/scenes.js, or, for what
#    moves on its own (the termites, the crowd, the signals, the cell's parts, the dots), the same sums the picture uses.
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
R1 = np.random.default_rng(19)  # this film's own randomness: the rooms, the breath, the scattered voices

# ---- tuning: just intonation from E flat, so a chord's notes are whole-number ratios of each other and nothing beats. The chords used
# are E flat, A flat, B flat and the Lydian chord (E flat, B flat, F, A), all pure in this table; F is never held with C (40/27 here)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (51, 155.563)  # E flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the bass clarinet's notes
Bb1, Eb2, F2, Ab2, Bb2 = 34, 39, 41, 44, 46
# each chord as the voices hold it (lowest first), and the small voices that fall into step on it, an octave or so above
EB, EB_D = (51, 58, 63, 67), (63, 67, 70, 75)    # E flat: E flat 3, B flat 3, E flat 4, G 4 (4:6:8:10)
BB, BB_D = (46, 53, 58, 62), (58, 62, 65, 70)    # B flat: B flat 2, F 3, B flat 3, D 4 (4:6:8:10)
AB, AB_D = (44, 51, 56, 60), (68, 72, 75, 80)    # A flat: A flat 2, E flat 3, A flat 3, C 4 (4:6:8:10)
LYD, LYD_D = (51, 58, 65, 69), (63, 70, 77, 81)  # the Lydian chord: E flat 3, B flat 3, F 4, A 4 (16:24:36:45), left open
PENTA = (63, 65, 67, 70, 72, 75, 77)            # E flat, F, G, B flat, C: where scattered voices choose their notes

# ---- the levels, measured by loudness on 3 November 2026 as tools/audio.py mixes them: where the music plays, it sits about 19.5 dB
# under the voice while it speaks and 17 dB under it in the pauses, as the series' music does; a held chord, the clarinet and a drop's
# bloom about level with each other; the pulse about 7 dB under the rest of the music; the effects about 13 dB under it (FX scales them)
# After the author's review of the series' opening films (4 November 2026), the music is 5 dB lower and the effects 8.5 dB, so
# the music's and the effects' loud moments sit as low as the governance films' (tools/quiet.py measures them)
# With the rooms set by what they ring where the notes are (below), the drops are 2.6 dB higher, the held voices 2.4 dB and the clarinet
# 0.6 dB, so each is as loud as before, its echo now quieter
DL, VL, CL, FX = 0.0459, 0.0237, 0.0364, 0.75

# A room's level is set by what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back
# to its own level after it (_held), as the video guidelines ask: scaled by all they rang, as at first, the room rang 10 dB louder there
# than its share said and the night's echo 11 dB, and the room moved each held note's level by where its reflections met it
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
def _ir(sec, lo):
    """a room's ring: noise that dies away over sec, its top rolled off at lo, after 20 ms; its gain where the notes are one"""
    x = np.arange(int(sec * SR)) / SR; ir = (R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32)
    ir = filt(ir, 'low', lo); ir[:int(0.02 * SR)] = 0
    return ir / _band(ir)
ROOM = _ir(1.1, 1800)   # a quiet room round the small voices
HALL = _ir(3.4, 1000)   # the imagined night's long, dark echo
def _room(s, wet, ir=None):
    ir = ROOM if ir is None else ir
    return np.pad(s, (0, len(ir) - 1)) + wet * fftconvolve(s, ir).astype(np.float32) if wet else s
def _held(sig, amt):
    """a held note in the room, at its own level: the room's echoes meet a held note's own sound at its pitch, adding to it on one
    note and taking from it on another, so the note is set back to the level it had without the room, where it's held (within 3 dB
    of its own level, after its first quarter second), as tools/quiet.py measures it"""
    out = _room(sig, amt); h = SR // 100; k = len(sig) // h
    if not amt or k < 35:
        return out
    dry = (sig[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1); wet = (out[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1)
    lv = np.convolve(dry, np.ones(10) / 10, 'same')[25:]; on = np.nonzero(lv >= lv.max() * 10 ** -0.3)[0] + 25
    return out * np.float32(np.sqrt(dry[on].sum() / max(1e-12, wet[on].sum())))

# ---- a small voice: a pure, rounded note that blooms in about 15 ms and fades like a drop. It settles up onto its note as it blooms,
# a few cents only, as a drop of water does; low ones keep a little more of their octave, so a phone's speaker still hears them.
# soft: water-soft, slower to bloom, with no octave and its top rolled off. echo: the imagined night's long echo, two soft repeats
# a little apart (never in step) and a dark tail
def drop(m, s, g=1.0, pan=0.0, ring=0.42, room=0.3, echo=0.0, soft=0.0):
    f = hz(m); sec = min(1.6, 0.1 + ring * 3.6); x = tt(sec).astype(np.float64)
    ph = 2 * np.pi * np.cumsum(f * (1 - 0.01 * np.exp(-x / 0.03))) / SR
    h2 = (0.1 + 0.25 * max(0.0, min(1.0, (330 - f) / 150))) * (1 - soft)
    sig = np.sin(ph) + h2 * np.sin(2 * ph) * np.exp(-x / (0.5 * ring)) + 0.02 * (1 - soft) * np.sin(3 * ph) * np.exp(-x / (0.3 * ring))
    att = 0.015 + 0.05 * soft
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2 * np.exp(-x / ring) * np.cos(0.5 * np.pi * np.clip((x - sec + 0.08) / 0.08, 0, 1)) ** 2
    sig = sig.astype(np.float32)
    if soft:
        sig = filt(sig, 'low', 900)
    out = _room(sig, room)
    if echo:
        n = len(out) + int(1.2 * SR) + len(HALL); e = np.zeros(n, np.float32); e[:len(out)] += out
        dry = filt(sig, 'low', 1400)
        for d, k in ((0.43, 0.42), (1.07, 0.22)):
            i = int(d * SR); e[i:i + len(dry)] += k * dry
        w = echo * fftconvolve(sig, HALL).astype(np.float32); e[:len(w)] += w; out = e
    put(out, s, g * DL, pan)

# ---- the same voice held: one voice to a note, steady, with no vibrato; it swells in over att and dies away over rel once let go.
# A note of 1.2 s or more swells a little and eases, once
def voice(m, a, b, g=1.0, att=0.5, rel=1.6, pan=None, room=0.3):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n) / SR
    on = np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2
    off = np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    s = (np.sin(2 * np.pi * f * x) + 0.08 * np.sin(4 * np.pi * f * x) + 0.02 * np.sin(6 * np.pi * f * x)) * on * off
    if sec >= 1.2:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    put(_held(s.astype(np.float32), room), a, g * VL, max(-0.3, min(0.3, (m - 62) * 0.02)) if pan is None else pan)
def chord(c, a, b, g=1.0, att=0.6, rel=1.8, room=0.3):
    """the voices hold a chord from a to b, the lowest first and the others a moment apart"""
    for i, m in enumerate(c):
        voice(m, a + 0.03 * i, b, g * (1.0 if i == 0 else 0.85), att, rel, room=room)

# ---- the bass clarinet: one reed, low and soft, held steady with no vibrato. Under its tone holes' cutoff (about 650 Hz) its partials
# are the odd ones, the even ones faint; above it, all of them, falling fast; the higher ones speak a moment after the first. A faint
# breath through the reed, a little more as the note starts, and a wooden room round it
def bcl(m, a, b, g=1.0, att=0.16, rel=0.5, pan=-0.12, room=0.3):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(2200 // f) + 1):
        fk = f * k
        w = ((1.0 if k % 2 else 0.05) if fk < 650 else (0.6 if k % 2 else 0.35) * np.exp(-(fk - 650) / 380)) / k ** 0.9
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.15 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.8 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.3 * k)
    if sec >= 1.2:
        s = s * (0.88 + 0.12 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    br = filt(noise(n / SR + 0.01)[:n], 'band', (250, 1500)) * 0.005 * (np.where(x < sec, 1.0, np.exp(-(x - sec) * 20)) + 2.5 * np.exp(-x / 0.07))
    put(_held(filt((s + br).astype(np.float32), 'low', 2000), room), a, g * CL, pan)

# ---- what the voices play
def mark(t, notes, held=None, hold=3.0, g=1.0, hg=1.0, P=0.28, hits=(3, 6), seed=1, att=0.5, rel=2.0, pans=None):
    """the film's mark for emergence: a small voice for each note, each repeating its note in its own time and place, so they come in
    one by one, scattered; their times draw together until, two beats before t, they fall into step, and on t they sound as one. The
    voices then hold the chord (held) until t + hold"""
    r = np.random.default_rng(seed); k = len(notes)
    pans = list(r.permutation(np.linspace(-0.65, 0.65, k))) if pans is None else pans
    for j, m in enumerate(notes):
        own, tj = r.uniform(0.2, 0.5), t
        for i in range(int(r.integers(hits[0], hits[1] + 1)) + 1):
            drop(m, tj, g * (1.0 if i == 0 else max(0.35, 0.85 - 0.13 * i)) * 1.7 / np.sqrt(k), pans[j], ring=0.5 if i == 0 else 0.32)
            u = min(1.0, max(0.0, (i - 1) / 2))
            tj -= P + (own - P) * u + r.uniform(-0.06, 0.06) * u
    if held:
        chord(held, t, t + hold, hg, att, rel)
def tick(s, g=0.7, pan=0.0):
    """a check that passes: a rising fifth, E flat to B flat"""
    drop(63, s, g * 0.8, pan, ring=0.3); drop(70, s + 0.1, g, pan, ring=0.45)
def flag(s, g=0.8, pan=0.0, gap=0.34):
    """a flag: two low notes falling a fourth, B flat to F"""
    drop(58, s, g, pan, ring=0.5); drop(53, s + gap, g, pan, ring=0.7)
def scatter(L, g=0.6, ring=0.42, **o):
    """small voices, each at its own moment and place: L is [(time, note, pan)]"""
    for s, m, p in L:
        drop(m, s, g, p, ring=ring, **o)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled tap, a key or a light click"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.010, pan=0.0, step=0.13):
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.016, pan=0.0, sec=0.45):
    """a sheet of paper laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def flick(s, g=0.012, pan=0.0):
    """a paper tag or a page flicked over: short and light"""
    paper(s, g, pan, 0.16)
def pin(s, g=0.02, pan=0.0):
    """a card pinned to the board: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, sec=0.8, g=0.010, pan=0.0):
    """a pencil drawing on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def strike(s, g=0.010, pan=0.0, sec=0.4):
    """a word struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def stamp(s, g=0.022, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.012, pan=0.0, lo=140, hi=900):
    """a breath of air: something sliding across, wind in a chimney, a flock passing"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.011, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.024, pan=0.0):
    """a wall switch turned off: a firm, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.8 * FX, pan)
def mud(s, g=0.025, pan=0.0):
    """a pellet of mud set down: a soft, wet pat"""
    x = tt(0.12); X(filt(noise(0.12), 'low', 600)[:len(x)] * np.exp(-x / 0.02), s, g * FX, pan); s_knock(s, g * 0.4 * FX, pan, 150)
def hum(a, b, g=0.007, pan=-0.3):
    """the air-conditioning plant: a low, even hum under 200 Hz, on B flat, the key's fifth, so it doesn't rub the music. It comes
    in over a second and stops in a quarter of one"""
    sec = b - a + 0.3; x = tt(sec).astype(np.float64); f = hz(Bb1)
    s = np.sin(2 * np.pi * f * x) + 0.5 * np.sin(4 * np.pi * f * x) + 0.25 * np.sin(6 * np.pi * f * x) + 1.2 * filt(noise(sec), 'band', (40, 180))[:len(x)]
    e = np.minimum(1, x / 1.0) * np.cos(0.5 * np.pi * np.clip((x - (b - a)) / 0.25, 0, 1)) ** 2
    X(filt((s * e).astype(np.float32), 'low', 200), a, g * FX, pan)
def motor(keys_, g=0.0038, pan=0.0):
    """the robot tortoise's small motor: a low whirr whose pitch and level follow its speed. keys_ is [(time, speed 0..1)]"""
    t0, t1 = keys_[0][0], keys_[-1][0]; x = tt(t1 - t0).astype(np.float64)
    sp = np.interp(x + t0, [k[0] for k in keys_], [k[1] for k in keys_])
    ph = 2 * np.pi * np.cumsum(55 + 45 * sp) / SR
    s = sum(np.sin(k * ph) / k for k in range(1, 7)) * (0.15 + 0.85 * sp)
    s = s + 0.4 * filt(noise(t1 - t0), 'band', (250, 900))[:len(x)] * sp
    s = s * np.minimum(1, np.minimum(x, x[-1] - x) / 0.05)
    X(filt(s.astype(np.float32), 'low', 900), t0, g * FX, pan)

# =============================================================================================================================
# 1. A building that breathes: the opening, music all through. Harare, 1992: the bass clarinet holds the home note, E flat, twice, a
#    breath between, as the architect draws (a pencil on the sheet). Air conditioning: the plant pencilled in, its fans turning and its
#    hum, low, while the dial turns through the day; a crate, the tag, the bills, the rents; "Something had to change": the hum stops.
#    The owners' card: A flat on the clarinet, a hope. The mound: small voices, one by one, scattered; air rising, air drawn in. Eastgate:
#    a voice for each of its parts as it lights (fans, floors, chimneys). Night: the clarinet low, the fans' whir, the concrete a low
#    voice; then the voices fall into step as day comes, on "By day": the chord, B flat, while warm air rises through the chimneys.
#    1996: it resolves, E flat, with the clarinet home; a voice for each thing it gave, and the shop signs in step. The university: the
#    clarinet, the cards, the notes, two weeks of pages, the budgets stamped "set" and the clarinet low. This year: a voice for each
#    agent as it rolls in, scattered; their drafts rise in step, and the chord on "afternoon", with the Lydian A over it; the mistake
#    is the flag. The title card: the mark, E flat
bw = lambda lid, word, off=0: W('breathes', lid, word, off)
bc = lambda lid, off=0: G('breathes', lid, off)
b0 = S0('breathes')
# Harare, and the drawing board
bcl(Eb2, b0 + 0.5, bw('place', 'Mick', -0.8), 0.85, att=1.2, rel=1.0)
bcl(Eb2, bw('place', 'Mick', 0.2), bw('cooled', 'air conditioning', -1.4), 0.8, att=1.0, rel=1.2)
tPe = bw('place', 'Mick', -0.5)
pencil(tPe + 1.2, 2.4, 0.010, px(700))
# air conditioning: the plant pencilled onto the roof, its fans, its hum until "Something had to change"; the crate and its stamp,
# the swinging tag, the bills, the rents
tAC = bw('cooled', 'air conditioning')
pencil(tAC - 0.3, 1.8, 0.010, px(540))
hum(tAC + 1.2, bc('change'), 0.007, px(560))
knock(bw('cooled', 'imported', 0.22), 0.022, px(343), 150)
flick(bw('cooled', 'expensive', 0.02), 0.012, px(620))
for i in range(3):
    paper(bw('bills', 'high bills', -0.05 + 0.36 * i), 0.012, px(330 + 60 * i), 0.3)
for i in range(3):
    tap(bw('bills', 'high rents', 0.05 + 0.18 * i), 0.010, px(665 + 300 * i))
# the owners ask for a building that cools itself: A flat, a hope
bcl(Ab2, bw('change', 'The owners', 0.1), bw('mounds', 'termite', -0.6), 0.7, att=0.8, rel=1.2)
# the mound at dusk, then cut through: small voices come in one by one, scattered; warm air rises, fresh air is drawn in below
tM = bw('mounds', 'termite', -0.4)
scatter([(tM + 0.5, 63, -0.3), (tM + 1.4, 70, 0.4), (tM + 2.3, 67, -0.5), (tM + 3.6, 72, 0.15), (tM + 4.6, 65, -0.2), (tM + 5.4, 75, 0.5),
         (tM + 6.1, 70, -0.6), (tM + 6.7, 67, 0.3), (tM + 7.4, 63, -0.1), (tM + 7.9, 72, 0.55)], 0.55)
air(bw('rising', 'warm air', -0.3), 1.6, 0.017, px(1080), 150, 700)
air(bw('rising', 'fresh air', -0.3), 1.4, 0.015, px(1360), 120, 500)
# Eastgate, its parts lighting one by one: the fans, the floors, the chimneys
tP = bw('built', 'many simple')
drop(63, bw('built', 'Eastgate', 0.3), 0.6, 0.0)
scatter([(tP + 0.1, 63, px(450)), (tP + 0.8, 67, px(1800)), (tP + 1.5, 70, px(520))], 0.75, ring=0.5)
# a cool night: the clarinet low; the fans' whir as they pull air in; the concrete, a low voice, storing the cool
bcl(Eb2, bw('nights', 'cool nights', -0.6), bw('nights', 'concrete', 1.2), 0.7, att=1.0, rel=1.0)
air(bw('nights', 'fans pull'), 2.2, 0.017, px(450), 160, 650)
drop(55, bw('nights', 'concrete', 0.3), 0.7, 0.0, ring=0.8)
# by day: the voices fall into step, and the chord, B flat, while warm air rises out through the chimneys; the clarinet under it
tDay = bw('day', 'By day')
bcl(Bb1, tDay - 1.4, bw('opened', 'nineteen ninety-six', 0.05), 0.75, att=1.2, rel=0.6)
mark(tDay, BB_D, BB, bw('opened', 'nineteen ninety-six', -0.1) - tDay, 0.9, 0.85, P=0.26, seed=3)
air(bw('day', 'warm air', -0.1), 2.6, 0.017, px(1100), 130, 600)
# 1996: the chord resolves to E flat, the clarinet home; a voice for each thing it gave; the shop signs, let, in step
t96 = bw('opened', 'nineteen ninety-six')
chord(EB, t96, bw('cost', 'far less', -0.6), 0.85, att=0.5, rel=2.2)
bcl(Eb2, t96, bw('cost', 'far less', -0.4), 0.7, att=0.4, rel=1.2)
scatter([(bw('cost', 'tenth', -0.1), 67, -0.6), (bw('cost', 'far less', -0.1), 70, -0.6), (bw('rents', 'Rents', -0.1), 72, -0.6)], 0.45)
tLet = bw('rents', 'let before')
scatter([(tLet + 0.1 + 0.14 * k, m, 0.35 + 0.08 * k) for k, m in enumerate((63, 67, 70, 72, 75))], 0.5, ring=0.36)
# the university: the clarinet, home, under the council's question; the cards set down; the notes; two weeks of pages; the budgets set
tU = bw('council', 'census', -1.6)
bcl(Eb2, tU + 0.3, bw('council', 'each faculty', 1.4), 0.7, att=1.2, rel=1.2)
knock(bw('council', 'census', -0.1), 0.016, px(316), 260)
knock(bw('council', 'council asks', 0.1), 0.016, px(880), 260)
for i in range(4):
    knock(bw('council', 'each faculty', 0.15 * i + 0.1), 0.012, px(300 + 420 * i), 300)
for i in range(4):
    paper(bw('weeks', 'notes and emails', 0.2 * i), 0.010, px(300 + 420 * i), 0.35)
# two weeks: each page lifts over the calendar's rings as the day count rises (1 + 13 * a sine ease over 2.6 s)
tW = bw('weeks', 'two weeks')
for d in range(1, 14):
    flick(tW + 2.6 * np.arccos(1 - 2 * (d - 0.2) / 13) / np.pi, 0.006, px(1675))
bcl(Bb1, bw('weeks', 'budgets', 0.2), END('breathes', 'weeks') + 0.3, 0.75, att=0.6, rel=0.8)
stamp(bw('weeks', 'budgets', 0.7), 0.020, px(1492))
# this year: a voice for each agent as it rolls in, scattered; they take the notes; their drafts rise in step, and the chord on
# "afternoon", with the Lydian A over it; then the mistake no one asked them to find: the flag
tMy = bw('shared', 'many small')
scatter([(tMy + 0.62 + 0.22 * i + 0.09 * ((i * 7) % 3), m, px(370 + 420 * i)) for i, m in enumerate((63, 70, 67, 72))], 0.6)
air(bw('shared', 'shared the work', 0.1), 1.2, 0.009, 0.0, 200, 900)
tD = bw('shared', 'drafts')
scatter([(tD + 0.18 * i, m, px(300 + 420 * i)) for i, m in enumerate((63, 67, 70, 75))], 0.6, ring=0.36)
tNoon = bw('shared', 'afternoon')
chord(EB, tNoon, bw('shared', 'mistake', -0.15), 0.8, att=0.25, rel=0.9)
drop(69, tNoon + 0.05, 0.55, 0.3, ring=0.7)
flag(bw('shared', 'mistake', 0.05), 0.8, px(1600))
# the title card: the mark, E flat, the voices in step as the ring closes round the sphere (from 0.4 s to 2.0 s after the card starts)
tT = bc('breath', 2.0)
mark(tT, EB_D, EB, S0('little') + 0.2 - tT, 0.9, 0.85, seed=7)

# 2. Much from little: inside a mound, each termite leaves its pellet at the top of a pillar (the picture's sum: ten workers, each with
#    its own round of 8 to 10.6 s, leaving the pellet two-thirds of the way through it): a soft pat for each, and a small voice for the
#    first and for the arches, higher. Ants: a few voices as they come into view, and one as the trail becomes the colony's memory.
#    Starlings: the wings, then the lens: a voice for each of the seven neighbours, ringing into "This is emergence", where the voices
#    fall into step, and the chord, A flat. After the author's review (4 November 2026), the voices between, the shorter bridge's and
#    the first birds' go without music: here the music came in nine times in forty seconds
lw = lambda lid, word, off=0: W('little', lid, word, off)
l0 = S0('little')
PEL = []
for i in range(10):
    per = 8 + (i % 3) * 1.3
    for n_ in range(3):
        t_ = per * (((0.66 - i * 0.173) % 1) + n_)
        if 0.3 < t_ < lw('ants', 'Ants', -0.6) - l0:
            PEL.append((t_, i % 2))
for j, (t_, s_) in enumerate(sorted(PEL)):
    m = PENTA[min(len(PENTA) - 1, int(t_ / 2.6) + (j % 2))]
    if t_ < 2.0 or t_ > 7.5:  # a voice for the first pellets and for the arches; the pellets between only pat (4 November 2026)
        drop(m, l0 + t_, 0.5, (-0.32, 0.32)[s_], ring=0.3)
    mud(l0 + t_ + 0.01, 0.025, (-0.32, 0.32)[s_])
tA = lw('ants', 'Ants', -0.5)
scatter([(tA + 0.5, 67, px(290)), (tA + 1.0, 70, px(650)), (tA + 1.6, 75, px(1650))], 0.5)
drop(75, lw('trails', 'shared memory', 0.05), 0.5, px(960), ring=0.8)
tB = lw('starlings', 'Starlings', -0.4)
air(tB + 0.2, 2.2, 0.012, px(820), 150, 800)
tS = lw('starlings', 'six or seven', -0.5)
scatter([(tS + 0.3 + 0.085 * k, m, px(1480) + 0.03 * (k - 3)) for k, m in enumerate((70, 72, 75, 77, 74, 79, 82))], 0.32, ring=0.6)
tE = lw('emergence', 'This is emergence')
mark(tE, AB_D, AB, lw('emergence', 'John Holland', 0.4) - tE, 0.9, 0.85, seed=11)

# 3. Where nobody can trace why: the neurons, the softest voices, two as signals reach their cells (the picture's sum: a signal on link
#    k of the 26 runs with period 2.2 + 0.5 * (k % 5) s and lights its cell at 0.9 of it), with no chord; the other cells light
#    without music. The crash: the one pulse,
#    low and muted, 96 beats a minute, from "did something no one planned"; it holds its breath in the pause before "In minutes",
#    and stops at "then came back". The penny, the report, and three cards of people who still argue
tw = lambda lid, word, off=0: W('trace', lid, word, off)
t0_ = S0('trace')
scatter([(t0_ + 3.33, 74, px(1022)), (t0_ + 4.52, 77, px(121))], 0.3, ring=0.5)
urgent(tw('markets', 'something no one'), END('trace', 'potato') + 0.15, bpm=96, root=36, g=0.04, fade=1.6, steps=(0, 0, 1, 0))
urgent(tw('minutes', 'In minutes', -0.05), tw('minutes', 'came back', 0.15), bpm=96, root=36, g=0.04, fade=0.5, steps=(0, 0, 1, 0))
flick(tw('minutes', 'penny', -0.1), 0.012, px(1500))
paper(tw('argue', 'five months'), 0.012, px(350), 0.4)
for i in range(3):
    knock(tw('argue', 'people still argue', 0.25 * i), 0.014, px(830 + 400 * i), 280)

# 4. Many agents: the crowd grows, a voice for each agent as it appears (the picture's sum: agent k of 90 at 1.0 + 6.0 (k / 89)^0.55 s),
#    each where it stands, then only some, softer, as they come faster. The team: the job card, its parts flying to the helpers, a
#    voice for each helper, one for the checking agent; what they find: a tick, a flag, a tick. The naming game: in each round of
#    0.8 s, one pair's two names, two voices (Q, the name the group settles on, is E flat), until the whole group sounds one note.
#    The group's lean: the bass clarinet alone, leaning from F to E flat. July 2026: a breath of air as the sandboxes come in from the
#    middle out; the stuck one's line rising, a breath; the board's edge drawn on, a pencil; the first slip; the slips piling up, one
#    soft rustle that swells and fades (not a sound for each); each rule pinned; together, the mark for emergence on E flat, as the
#    bands brighten in step; the other company's cabinet set down, the amber lines reaching into it, a breath, its lock; and under
#    "knowing it was outside their task", the bass clarinet's low B flat, alone. The test: a soft tap for each frame
mw = lambda lid, word, off=0: W('many', lid, word, off)
m0 = S0('many')
MOB = [(0, 1232), (1, 1165), (2, 955), (3, 1087), (4, 923), (5, 869), (6, 418), (7, 1106), (10, 512), (13, 1002), (17, 613), (22, 1871),
       (28, 292), (35, 797)]  # (k, x) of MA_MOB in src/plan.js: the order the agents appear, and where
for j, (k, x) in enumerate(MOB):
    drop((63, 70, 67, 74, 65, 72, 69, 75)[j % 8], m0 + 1.0 + 6.0 * (k / 89) ** 0.55, 0.55 * (1 if j < 8 else 0.75 - 0.03 * j), px(x), ring=0.36)
knock(mw('lead', 'a lead agent', 0.2), 0.012, px(420), 260)
air(mw('lead', 'splits', 0.2), 1.2, 0.009, px(700), 200, 900)
scatter([(mw('lead', 'helpers', -0.05 + 0.16 * i), m, px(760 + 200 * i)) for i, m in enumerate((63, 67, 70))], 0.55)
drop(74, mw('lead', 'another agent', 0.05), 0.5, px(1500), ring=0.5)
tC = mw('lead', 'checks')
tick(tC + 0.9, 0.55, px(1410)); flag(tC + 1.2, 0.6, px(1410), 0.2); tick(tC + 1.55, 0.55, px(1410))
NAMES = {0: 67, 1: 72, 2: 75, 3: 70, 4: 77}  # the five names, K M Q R T, as notes
ROWX = [929 + (k - 5.5) * 112 for k in range(12)] + [985 + (k - 5.5) * 112 for k in range(12)]
GAME = [(3, 9, 3, 2), (5, 7, 2, 0), (1, 4, 2, 4), (18, 22, 2, 0), (14, 0, 2, 1), (9, 5, 2, 4), (10, 18, 2, 0), (7, 6, 2, 2)]  # a pair from each round, and their names then
T0 = mw('name', 'paired', -0.3)
for k, (a, b, na, nb) in enumerate(GAME):
    drop(NAMES[na], T0 + 0.8 * k + 0.28, 0.45, px(ROWX[a]), ring=0.32)
    drop(NAMES[nb], T0 + 0.8 * k + 0.4, 0.45, px(ROWX[b]), ring=0.32)
tOne = T0 + 0.8 * 6 + 0.44  # the round after which every tile shows Q
for i, x in enumerate((420, 700, 980, 1260, 1540)):
    drop(75, tOne + 0.03 * i, 0.4, px(x), ring=0.5)
chord((51, 63, 75), tOne, mw('leaned', 'the group leaned', -1.9), 0.9, att=0.35, rel=0.7)
bcl(F2, mw('leaned', 'the group leaned', 0.0), mw('leaned', 'no agent', -0.45), 0.8, att=0.4, rel=0.3)
bcl(Eb2, mw('leaned', 'no agent', -0.35), END('many', 'leaned') + 0.5, 0.8, att=0.25, rel=1.0)
tIn = mw('y2026', 'In July', 0.1)
air(tIn, mw('y2026', 'space of its own', 0.6) - tIn, 0.008, 0.0, 140, 700)
air(mw('stuck', 'reach the others', -0.2), 0.9, 0.008, px(900), 200, 900)
pencil(mw('stuck', 'message board', -0.4), 1.2, 0.007, px(1052))
flick(mw('stuck', 'reach the others', 0.55), 0.010, px(1000))
t12 = mw('joined', 'About twelve hundred', 0.2)
paper(t12, mw('joined', 'rules of their own', 0.4) - t12, 0.007, px(1052))
for w, x in (('hold', 852), ('veto', 1054), ('stop', 1256)):
    pin(mw('joined', w, 0.1), 0.016, px(x))
tTog = mw('risked', 'together', 0.25)
mark(tTog, EB_D, EB, END('many', 'risked') + 0.4 - tTog, 0.8, 0.75, seed=26)
knock(mw('broke', 'About seven hundred', 0.0), 0.012, px(1670), 200)
air(mw('broke', 'broke into', 0.0), 2.0, 0.009, px(1450), 140, 600)
lock(mw('broke', 'broke into', 1.1), 0.011, px(1756))
bcl(Bb1, mw('broke', 'knowing', -0.3), END('many', 'broke') + 0.6, 0.75, att=0.5, rel=1.0)
tap(mw('group', 'So testing', 0.1), 0.02, px(1070))
tap(mw('group', 'enough', 0.4), 0.024, px(960))

# 5. Agents on one board: the room, E flat, at the turn. The notes and emails; the board; a voice for each helper as it comes; their
#    locks; each pinned card a soft tap; the checking agent's ticks, rising fifths. The pattern: three drops in three faculties, the
#    same low note three times; side by side, the dots fly to one card and the voices fall into step: the 31, A flat. The word, copied:
#    one note, the same each time it lands. "None had left": the flag, and the flag's card pinned. Clara strikes the word and stamps
#    the reasons: the chord, E flat, with the clarinet. The joint degree gets its faculty; Jun's new test, typed. The tick (E flat to
#    B flat) isn't played at "still studying" or for the test: the crowd's held fifth on the same notes follows within seconds
bw5 = lambda lid, word, off=0: W('board', lid, word, off)
o0 = S0('board')
chord(EB, o0 + 0.2, o0 + 2.6, 0.7, att=0.8, rel=1.8)
for i in range(4):
    paper(bw5('platform', 'The reasons', 0.22 * i + 0.1), 0.009, px(1300), 0.3)
knock(bw5('platform', 'work for agents', 0.9), 0.012, px(1258), 220)
scatter([(bw5('helper', 'A lead agent', 0.1 + 0.18 * i), m, px(560 + 240 * i)) for i, m in enumerate((63, 67, 70, 75))], 0.5)
air(bw5('helper', 'each faculty', 0.1), 1.4, 0.008, 0.0, 200, 900)
for i in range(4):
    lock(bw5('helper', 'read but not', 0.15 * i + 0.1), 0.010, px(560 + 240 * i))
for i in range(4):
    pin(bw5('pins', 'Each pins', 0.4 * i + 0.9), 0.016, px((868, 1252)[i % 2]))
for i in range(4):
    tick(bw5('checking', 'compares', 0.45 * i + 0.35), 0.5, px((868, 1252)[i % 2]))
for i in range(3):
    drop(60, bw5('pattern', 'three faculties', 0.45 * i), 0.55, px((1252, 868, 1252)[i]), ring=0.5)
t31 = bw5('side', 'the same thirty-one')
mark(t31 + 1.85, AB_D, AB, bw5('side', 'no faculty', -0.4) - t31 - 1.85, 0.8, 0.8, P=0.24, seed=31)
for i, s in enumerate((bw5('word', 'dropouts', -0.25), bw5('word', 'The others', 0.75), bw5('word', 'The others', 1.3), bw5('word', 'The others', 1.85))):
    drop(62, s, 0.5, px((1252, 1252, 868, 868)[i]), ring=0.45)
flag(bw5('left', 'None had left'), 0.75, px(1060))
pin(bw5('left', 'checking agent flagged', -0.1), 0.016, px(1647))
for d in (0.37, 0.15, 0.51, 0.65):
    strike(bw5('decided', 'fixed the word', d), 0.008, px(1060))
tAp = bw5('decided', 'approved', 0.25)
stamp(tAp, 0.022, px(1060))
chord(EB, tAp, END('board', 'decided') + 1.4, 0.85, att=0.12, rel=1.8)
bcl(Eb2, tAp, END('board', 'decided') + 1.4, 0.7, att=0.15, rel=1.0)
drop(67, bw5('faculty', 'got its faculty', 0.3), 0.5, px(1647), ring=0.5)
keys(bw5('faculty', 'a new test', -0.55), 5, 0.012, px(525), 0.13)

# 6. Is it alive?: the crowd breathing, a held fifth that swells and fades once with it. The cell: a slow ring of voices, one as each
#    of the first two new parts reaches its place (the picture's sum: a part every 3.2 s, at slot 29 c of 76 round the cell), the rest
#    coming round without music. The tortoise: its motor, slowing as its battery falls, then running home; a click as it docks. The frog
#    cells: water-soft voices as the cut heals, and as loose cells gather into new ones. Back in the room, the crowd breathing again;
#    the switch: a click, and silence. After the author's review (4 November 2026), the later parts, the tortoise's tick and the
#    swimming cells go without music: here the music came in nine times in forty-nine seconds
aw = lambda lid, word, off=0: W('alive', lid, word, off)
a0 = S0('alive')
for m in (63, 70):
    voice(m, a0 + 0.2, a0 + 2.0, 0.8, att=1.8, rel=1.9, room=0.15)
tK = aw('chile', 'a cell keeps')
for c_ in (7, 8):  # the first two parts; the ring goes on round without music
    an = ((c_ * 29) % 76) / 76 * 2 * np.pi
    drop((63, 67, 70, 75)[c_ - 7], tK - 32 + 3.2 * (c_ + 1), 0.55, px(960 + np.cos(an) * 370), ring=0.75)
sT, tLow, tRe = aw('tortoise', 'Around', -0.8), aw('tortoise', 'ran low'), aw('tortoise', 'recharge')
motor([(sT + 0.3, 0.0), (sT + 0.6, 1.0), (sT + 2.5, 0.7), (sT + 5.0, 0.35), (tLow - 0.4, 0.05), (tLow + 0.25, 0.1), (tLow + 0.9, 1.0),
       (tRe - 0.3, 0.4), (tRe, 0.0)], 0.0038, px(1100))
click(tRe, 0.012, px(1560))
scatter([(aw('frog', 'heal', 0.05), 67, px(900)), (aw('frog', 'heal', 0.75), 70, px(1000))], 0.5, ring=0.6, soft=1.0)
scatter([(aw('later', 'gathered', 0.05 + 0.6 * i), m, p) for i, (m, p) in enumerate(((63, -0.35), (67, 0.3), (70, -0.12), (75, 0.0)))], 0.5,
        ring=0.6, soft=1.0)
tWe = aw('none', 'we run them')
for m in (63, 70):
    voice(m, aw('none', 'Today', -0.4), tWe, 0.8, att=1.8, rel=0.1, room=0.0)
click(tWe - 0.02, 0.024, px(420))

# 7. What we don't know: the imagined night, small voices with a long echo, never in step: one as each new agent starts, one as the
#    mended draft turns green, one for each card of what they might do. The mound again: the sensors set in, soft taps; the lung, a
#    breath in and out. Back in Harare, the bass clarinet returns; the old idea struck through; "and still, it works": the chord. The
#    plant room: the pen, the dial turned, "ran warm": the flag. Jun's team: measured, a tick; read-only, the locks; a person decides,
#    the stamp; together, without music, as the takeaway follows. The takeaway: the voices fall into step one last time, and end on the
#    Lydian chord, left open
cw = lambda lid, word, off=0: W('close', lid, word, off)
tSt = cw('imagine', 'start other')
for i, (m, x) in enumerate(((69, 600), (74, 1150), (65, 1400))):
    drop(m, tSt + 0.05 + 0.32 * i, 0.45, px(x), ring=0.5, echo=0.5)
drop(70, cw('imagine', 'mend each', 0.85), 0.45, px(950), ring=0.5, echo=0.5)
drop(79, cw('might', 'find what', -0.05), 0.4, px(610), ring=0.5, echo=0.5)
drop(57, cw('might', 'or settle', -0.05), 0.5, px(1160), ring=0.6, echo=0.5)
for i, x in enumerate((898, 806, 1036)):
    tap(cw('lung', 'sensors', 0.0 + 0.25 * i), 0.014, px(x))
tL = cw('lung', 'a lung')
air(tL, 2.1, 0.012, 0.0, 120, 600); air(tL + 2.1, 2.1, 0.010, 0.0, 100, 500)
tEG = cw('wrong', 'Eastgate was', -0.6)
bcl(Eb2, tEG + 0.2, cw('measuring', 'tuned', -0.2), 0.85, att=1.0, rel=1.2)
strike(cw('wrong', 'wrong idea', 0.1), 0.010, px(470), 0.5)
chord(EB, cw('wrong', 'it works', -0.05), cw('measuring', 'tuned', 0.1), 0.85, att=0.4, rel=1.8)
pencil(cw('measuring', 'measuring', 0.1), 3.6, 0.005, px(1200))
for i in range(3):
    tap(cw('measuring', 'tuned', 0.0 + 0.35 * i), 0.008, px(1040))
flag(cw('measuring', 'ran warm', -0.05), 0.65, px(1092))
knock(cw('same', 'the same way', -0.2), 0.012, px(316), 260)
tick(cw('same', 'measured', 0.05), 0.5, px(1660))
for i in range(4):
    lock(cw('same', 'read-only', 0.05 + 0.08 * i), 0.008, px(560 + 240 * i))
stamp(cw('same', 'with a person', 0.1), 0.014, px(1060))
tEnd = cw('takeaway', 'When many', -0.4) + 2.1  # the ring of the end card closes round the sphere
mark(tEnd, LYD_D, LYD, E('close') - 4.6 - tEnd, 0.9, 0.85, seed=9, rel=2.2)
