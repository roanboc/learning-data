# What they tell us about ourselves: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, chosen on 3 November 2026 (the series' palettes.md) and checked against every score.py on
# main and on every branch: a Mellotron's flute tape, and tuning forks on wooden resonator boxes, struck with felt. Both are made here
# (music.py has neither). The film is about rough copies, and both instruments are copies of a kind: each Mellotron key plays about
# eight seconds of tape of a real flautist, and a fork gives the ear one pure note.
#  - The Mellotron plays the held notes and chords: a soft start as the tape meets the capstan, the flautist's breath, a faint hiss,
#    held steady (nothing trembles), and each note ends when its tape runs out, about eight seconds after the key goes down, so a chord
#    held longer is played again. Each key's tape is its own, a little louder or softer, a little more or less breathy.
#  - The forks are few and low, and sound only where hearing is on screen: a soft wooden knock, then a pure note that blooms as the box
#    takes it up. The film's mark is the C fork struck in the hand, set on its box, and answered by the Mellotron's chord: C major under
#    the title; at the end, left open, C and G with a D.
#  - Ten bands: when Rod's implant is switched on, the first chord is heard through ten bands, as the implant passes sound, and opens
#    into the full chord as he sings. The same ten bands come back wherever the film is about the copy's rough signal: "ten
#    electrodes", "ten rough signals", music through an implant, "the implant turned sound into pulses".
#  - Each of the five questions has its own note, rising, C D E G A, played as its card is pinned to the wall, and again when the card
#    goes back with its tag, over an open fifth: the questions stay open.
#  - C major, tuned pure over C = 256 Hz (scientific pitch, the forks' own); A minor for the opening's problem, whose chords fall A, G,
#    F to C as the problem turns to its solution. Silence while the implant goes in, and again at "It didn't hear anything".
# The rules the series keeps (its briefs, 3 November 2026):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than
#    half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: every chord is tuned pure (just intonation, see hz()), with no vibrato; D is never held with F
#    or A (their intervals aren't pure here). No urgent pulse: nothing in this film is an error or a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
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
R1 = np.random.default_rng(18)  # this film's own randomness: the tapes' breath and hiss, the room, the paper

# ---- tuning: just intonation from C = 256 Hz, so a chord's notes are whole-number ratios of each other and nothing beats. The chords
# used are C, F, G, A minor, E minor, F with E and C with A, all pure in this table; D sounds only in G major and over C and G
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (60, 256.0)  # C 4: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords, lowest note first, one key to a note
Am, F_, G_, C_, Em = (57, 60, 64), (53, 57, 60), (55, 59, 62), (48, 55, 60, 64), (52, 55, 59)
F7, C6, Cfull, OPEN = (53, 57, 60, 64), (60, 64, 67, 69), (60, 64, 67), (48, 55, 62)
Q = (72, 74, 76, 79, 81)  # the five questions' notes: C D E G A, rising

# ---- the levels: the Mellotron about as far under the voice as the series' other music (matched by loudness, not by peak), the forks
# a little above it; the effects about 12 dB under the music (FX scales them all)
ML_, FK, FX = 0.045, 0.07, 1.6

# a small room round the Mellotron and the forks, ringing on for about a second
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _room(s, room):
    if not room:
        return s
    return np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)

# ---- the Mellotron's flute tape: one key, pressed at 0 and let go at sec (at most the tape's eight seconds). The flute's partials are
# harmonic, the lower notes richer; each speaks a moment after the one below it, as breath does; a short breathy chiff as the note
# starts; the breath under it, steady; the tape's faint hiss. When the key goes up the tape stops at once (0.09 s); when the tape runs
# out the flautist's note ends a little more gently (0.3 s). Returned dry, not yet placed
TAPE = 8.0
def _key(m, sec):
    out = sec >= TAPE; sec = min(sec, TAPE); f = hz(m); rel = 0.3 if out else 0.09
    n = int((sec + rel + 0.02) * SR); x = np.arange(n, dtype=np.float64) / SR
    kr = np.random.default_rng(1000 + m)  # this key's own tape: its level and its breath
    lev, br = 10 ** (kr.uniform(-1.2, 1.2) / 20), kr.uniform(0.8, 1.25)
    rich = min(1.0, max(0.0, (420 - f) / 300))
    amps = (1.0, 0.3 + 0.22 * rich, 0.11 + 0.1 * rich, 0.045 + 0.05 * rich, 0.02 + 0.03 * rich, 0.01 + 0.015 * rich)
    s = np.zeros(n)
    for k, a in enumerate(amps, 1):
        if f * k > 2300:
            break
        s = s + a * (1 - np.exp(-x / (0.03 + 0.014 * k))) * np.sin(2 * np.pi * f * k * x + 0.9 * k)
    s = s * (0.9 + 0.1 * np.minimum(1, x / 0.5))
    nz = noise(n / SR + 0.01)[:n].astype(np.float64)
    breath = filt(nz, 'band', (f * 0.9, min(2300, f * 3.2))) * 0.05 * br
    chiff = filt(nz, 'band', (min(2000, f * 1.6), min(2300, f * 5 + 200))) * np.exp(-x / 0.025) * 0.4
    hiss = filt(noise(n / SR + 0.01)[:n], 'band', (700, 2300)) * 0.006
    e = np.minimum(1, x / 0.008) * np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    sig = (s + breath + chiff) * e + hiss * e
    sig = filt(sig.astype(np.float32), 'low', 2300)
    sig = sig + 0.25 * filt(sig, 'band', (500, 1400))  # the tape's boxy middle
    return norm(sig) * lev
def mel(m, a, b=None, g=1.0, pan=None, room=0.28):
    """one Mellotron key, down at a and up at b (or held until its tape runs out)"""
    sec = TAPE if b is None else b - a
    put(_room(_key(m, sec), room).astype(np.float32), a, g * ML_, max(-0.4, min(0.4, (m - 62) * 0.018)) if pan is None else pan)
def chord(notes, a, b=None, g=1.0, top=None):
    """a chord, the keys a moment apart, lowest first; top: a note added later (a, time)"""
    for i, m in enumerate(notes):
        mel(m, a + 0.035 * i, b, g * (1.0 if i == 0 else 0.85))
    if top:
        mel(top[0], top[1], b, g * 0.75)
def line(notes, s, step, hold, g=0.8):
    """a few notes, one after another, each let go as the next comes; the last held for hold seconds"""
    for i, m in enumerate(notes):
        mel(m, s + step * i, s + step * i + (hold if i == len(notes) - 1 else step + 0.12), g)

# ---- ten bands: what the implant passes. The notes are played as above, then split into ten bands from 180 Hz to 2.3 kHz; in each
# band the level is kept and the sound replaced by breath of the same band, as an implant's ten electrodes give the nerve the level
# of each band and not the sound itself. From op, it opens into the full notes over od seconds. One sound, put once
_BANDS = np.geomspace(180, 2300, 11)
def _bands(x):
    out = np.zeros(len(x), np.float32); nz = R1.standard_normal(len(x)).astype(np.float32)
    for lo, hi in zip(_BANDS[:-1], _BANDS[1:]):
        b = filt(x, 'band', (lo, hi), 3); lev = filt(np.abs(b), 'low', 24, 2)
        c = filt(nz, 'band', (lo, hi), 3); out += lev * c / max(1e-9, float(np.sqrt((c ** 2).mean())))
    return out * float(np.sqrt((x ** 2).mean()) / max(1e-9, np.sqrt((out ** 2).mean())))
def tenband(notes, a, b, g=1.0, op=None, od=1.6, pan=0.0, room=0.28):
    """keys held from a to b, heard through ten bands; notes are (m, start, end) inside that span, or plain keys held throughout"""
    sec = b - a + 0.5; n = int(sec * SR); dry = np.zeros(n, np.float32)
    for k in notes:
        m, s0, s1 = (k, a, b) if isinstance(k, int) else k
        s = _key(m, s1 - s0) * (1.0 if isinstance(k, int) and k == notes[0] else 0.85); i = int((s0 - a) * SR)
        dry[i:i + len(s)] += s[:n - i]
    wet = _bands(dry)
    if op is not None:
        x = np.arange(n) / SR; u = np.clip((x - (op - a)) / od, 0, 1); u = np.sin(0.5 * np.pi * u) ** 2
        wet = wet * np.cos(0.5 * np.pi * u) + dry * np.sin(0.5 * np.pi * u)
    put(_room(norm(wet) * 0.9, room).astype(np.float32), a, g * ML_ * 1.6, pan)

# ---- a tuning fork on its wooden box, struck with felt: a soft wooden knock, then the pure note blooming as the box takes it up, and
# dying away slowly, damped by hand after ring seconds. set_at: struck in the hand first (faint, no box), then set on the box there
def fork(m, s, g=1.0, ring=4.0, pan=0.0, set_at=None):
    f = hz(m); t0 = s if set_at is None else set_at; sec = ring + 0.35; x = tt(sec).astype(np.float64)
    tone = np.sin(2 * np.pi * f * x) * (1 - np.exp(-x / 0.14)) * np.exp(-x / 6.0)
    if 6.27 * f < 2300:
        tone = tone + 0.05 * np.sin(2 * np.pi * 6.27 * f * x) * np.exp(-x / 0.05)
    tone = tone * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.3, 1)) ** 2, 1.0)
    put(_room(tone.astype(np.float32), 0.2).astype(np.float32), t0, g * FK, pan)
    s_knock(t0, 0.03 * g * FX, pan, 170)
    if set_at is not None:
        # in the hand: the felt's knock, and the note faint until the stem meets the box
        y = tt(set_at - s + 0.25).astype(np.float64)
        h = np.sin(2 * np.pi * f * y) * np.minimum(1, y / 0.02) * np.where(y > set_at - s, np.cos(0.5 * np.pi * np.minimum((y - (set_at - s)) / 0.25, 1)) ** 2, 1.0)
        put(h.astype(np.float32), s, g * FK * 0.22, pan); s_knock(s, 0.022 * g * FX, pan, 260)

# ---- soft sounds on screen, all low-passed (soft() keeps what's made here under about 2.2 kHz, steeply)
soft = lambda sig: filt(np.asarray(sig, np.float32), 'low', 2200, 4)
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a tag set in place"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a light click"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.016, pan=0.0, sec=0.45):
    """a sheet or a card laid down: filtered noise with a swell"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2), s, g * FX, pan)
def pin(s, g=0.02, pan=0.0):
    """a card pinned to the wall: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.011, pan=0.0, sec=0.6):
    """a pencil line, or a signature: a soft, even scratch"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6), s, g * FX, pan)
def air(s, sec=0.8, g=0.01, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def cup(s, g=0.012, pan=0.0):
    """a cup set down on its saucer: a soft clink, and the table"""
    x = tt(0.5).astype(np.float64)
    sig = sum(w * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, w, d in ((1180, 1.0, 14), (1730, 0.5, 20), (2210, 0.25, 28)))
    X(norm(soft(sig)), s, g * FX, pan); s_knock(s, g * 0.6 * FX, pan, 200)
def thump(s, g=0.02, pan=0.0):
    """a book set down"""
    s_knock(s, g * FX, pan, 120); x = tt(0.2); X(filt(noise(0.2), 'band', (80, 500))[:len(x)] * np.exp(-x * 30), s, g * 0.6 * FX, pan)
def clunk(s, g=0.018, pan=0.0):
    """the tape machine's lever: a firm, low click"""
    s_knock(s, g * FX, pan, 110); s_tap(s + 0.03, g * 0.6 * FX, pan)
def drop(s, g=0.016, pan=0.0):
    """a drop of sugar water landing: a low, round plip"""
    x = tt(0.25).astype(np.float64); f = 420 - 160 * np.minimum(1, x / 0.05)
    X(norm((np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 22)).astype(np.float32)), s, g * FX, pan)
def creak(s, g=0.014, pan=0.0, sec=0.5):
    """the balance's beam turning on its post: a soft wooden creak"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (160, 700))[:len(x)] * np.sin(np.pi * x / sec) ** 2), s, g * FX, pan)
def rain(a, b, g=0.008, pan=0.0):
    """rain on a screen: soft, steady, low"""
    sec = b - a; x = tt(sec); X(soft(filt(noise(sec), 'band', (300, 1900))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.8)), a, g * FX, pan)

# ---- 1978, the living room, as Rod doesn't hear it: the kettle, the radio and the telephone, muffled (and, at the end, the telephone
# as he hears it)
def kettle(a, b, g=0.008, pan=0.0):
    """steam from the kettle on the stove, muffled"""
    sec = b - a; x = tt(sec); X(filt(filt(noise(sec), 'band', (400, 1800)), 'low', 650)[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 1.2), a, g * FX, pan)
def radio(s, g=0.01, pan=0.0):
    """a tune on the radio, muffled: a few soft notes, low"""
    for i, (m, d) in enumerate(((69, 0.5), (72, 0.5), (76, 0.9), (74, 0.5), (72, 1.1))):
        t0 = s + sum(dd for _, dd in ((69, 0.5), (72, 0.5), (76, 0.9), (74, 0.5), (72, 1.1))[:i]); f = hz(m); x = tt(d + 0.2).astype(np.float64)
        sig = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(4 * np.pi * f * x)) * np.minimum(1, x / 0.03) * np.exp(-x * 2.2)
        X(filt(sig.astype(np.float32), 'low', 600), t0, g * FX, pan)
def phone(s, g=0.01, pan=0.0, muffled=True, rings=2):
    """the telephone's bell, two short rings and a pause, as Australian telephones rang; muffled, or as Rod hears it"""
    for r in range(rings):
        for k, on in enumerate((0.0, 0.6)):
            t0 = s + r * 3.0 + on; x = tt(0.45).astype(np.float64)
            clap = (np.sin(2 * np.pi * 20 * x) > 0).astype(np.float64)  # the clapper between the two bells
            sig = sum(w * np.sin(2 * np.pi * f * x) for f, w in ((690, 1.0), (735, 0.8), (1905, 0.25))) * (0.55 + 0.45 * clap)
            sig = sig * np.minimum(1, x / 0.01) * np.minimum(1, (0.45 - x) / 0.05)
            X(filt(soft(sig), 'low', 650) if muffled else soft(sig), t0, g * FX, pan)

# =============================================================================================================================
# 1. A rough copy: the opening, under the Mellotron all through, its chords a key change apart, each held for no more than its tape.
#    Melbourne, 1978: A minor for the problem, F for Margaret's voice he can't hear; the room goes on without him, muffled: the
#    kettle, the radio, the telephone. Even a pioneer doubted: A minor, then E minor; "Something had to change": G. Clark's father: F.
#    Ten years, a rough copy: C, the solution's key. The implant goes in in silence; the tape machine's lever; the first chord through
#    ten bands, opening into the full chord as Rod sings. December: a fork as he says the word back. "The copy was rough": ten bands
#    at "ten electrodes", the full chord at "thousands". His brain did the rest: C with A, warm. 2019, the agents, what to keep; the
#    title on the mark: the C fork set on its box, answered by C major
rw = lambda lid, word, off=0: W('rough', lid, word, off)
rc = lambda lid, off=0: G('rough', lid, off)
r0 = S0('rough')
chord(Am, r0 + 0.4, r0 + 7.6, 0.9)
chord(F_, r0 + 7.8, r0 + 14.0, 0.85)
chord(Am, r0 + 14.2, r0 + 20.8, 0.85)
chord(F7, rc('cut', -0.25), rc('doubt', -0.5), 0.8)
kettle(rc('cut'), rc('doubt', 2.6), 0.022, px(290)); radio(rc('cut', 0.9), 0.03, px(650)); phone(rc('cut', 1.7), 0.03, px(1610), True, 2)
chord(Am, rc('doubt', -0.1), rc('doubt', 6.7), 0.8)
chord(Em, rc('doubt', 6.9), rc('change', -0.2), 0.8)
paper(rc('aid', -0.5), 0.012, px(400))
chord(G_, rc('change', -0.05), rc('father', -0.2), 0.85)
air(rc('change', -0.6), 1.6, 0.008, px(1500))
air(rc('father', -0.3), 1.4, 0.009, px(960))
chord(F_, rc('father', -0.1), rc('years', -0.3), 0.85)
chord(C_, rc('years', -0.1), rc('implant', 2.4), 0.9)
air(rw('implant', 'a fine wire', -0.2), 2.4, 0.007, px(960))
for i in range(10):  # the ten rings settle on the spiral, one after another
    tap(rw('implant', 'ten electrodes', -0.2 + 0.35 * i + 0.03), 0.006, px(760 + 40 * i))
chord(F_, rc('implant', 2.6), rc('august', -0.6), 0.8)
air(rw('august', 'went in', 0.2), 1.6, 0.006, px(1250))
played, along = rw('sang', 'played'), rw('sang', 'sang along')
clunk(played - 0.15, 0.035, px(1060))
tenband([48, 60, 64, 67], played, played + 6.6, 0.95, op=along - 0.1, od=1.6)
chord(F_, rc('december', 0.1), rc('roughwas', -0.4), 0.7)
paper(rw('december', 'words', -0.7), 0.01, px(640))
fork(60, rw('december', 'words', 0.9), 0.9, 3.4, px(1260))
tenE, thou = rw('roughwas', 'ten electrodes'), rw('roughwas', 'thousands')
tenband([48, 60, 64, 67], tenE - 0.2, rc('rest', -0.4), 0.85, op=thou - 0.2, od=1.4)
chord(C6, rc('rest', -0.1), rc('y2019', -0.3), 0.85)
chord(F_, rc('y2019', -0.1), rc('same', -0.4), 0.8)
air(rc('same', 0.2), 1.6, 0.008, px(1124))
chord(Am, rc('same', -0.1), rc('copies', -0.1), 0.8)
chord(F_, rc('copies', 0.0), rc('keep', -0.3), 0.8)
for k in range(3):
    paper(rw('copies', 'what people wrote', -0.3 + 0.5 * k), 0.008, px(1300))
chord(G_, rc('keep', -0.1), rc('breath', -0.4), 0.8)
knock(rw('keep', 'like us'), 0.014, px(704)); knock(rw('keep', "where they're not"), 0.014, px(704))
# the title: the mark
fork(60, rc('breath', 0.3), 1.0, 4.6, 0.0, set_at=rc('breath', 0.9))
chord(C_, rc('breath', 1.5), E('rough') + 1.8, 0.85)

# 2. Five questions: the answer comes out of the agent and Mei signs; over coffee each question is a note, rising, as its card is
#    pinned to the wall: C, D, E, G, A. "No answer yet": C and G with a D, left open
fw = lambda lid, word, off=0: W('five', lid, word, off)
fc = lambda lid, off=0: G('five', lid, off)
air(fw('counted', 'counted', -0.2), 1.1, 0.008, px(900)); knock(fw('counted', 'counted', 0.9), 0.014, px(550))
paper(fw('counted', 'query', 0.1), 0.012, px(950))
pencil(fw('signed', 'checked'), 0.011, px(550), fw('signed', 'signed', 0.9) - fw('signed', 'checked'))
knock(fw('signed', 'signed', 0.9), 0.012, px(400), 300)
cup(fc('coffee', 0.3), 0.01, px(670))
for i, lid in enumerate(('jun', 'mei', 'noor', 'sam', 'yusuf')):
    a = fc(lid, 0.5)
    mel(Q[i], a + 0.1, a + 1.9, 0.75)
    pin(a + 1.38, 0.016, px(128 + 350 * i + 158))
knock(fw('noanswer', 'no answer'), 0.012, px(960))
chord(OPEN, fw('noanswer', 'no answer', -0.2), E('five') + 0.2, 0.75)

# the question chapters open as a card comes forward off the wall (a chord, the card's note on top as it lights) and close as it goes
# back with its tag (the card's note over an open fifth, the question left open)
def opens(sid, notes, i, g=0.75, till=6.0):
    s = S0(sid); chord(notes, s + 0.3, s + till, g, top=(Q[i], s + 1.0)); air(s + 0.3, 1.5, 0.007, px(960))
def closes(sid, i, end=None, hold=None):
    s = S0(sid) + (ST[sid]['dur'] - 2.8 if end is None else end); pin(s + 1.9, 0.016, px(128 + 350 * i + 158)); knock(s + 2.0, 0.012, px(128 + 350 * i + 158), 300)
    chord((60, 67), s + 1.8, E(sid) + 0.9 if hold is None else s + 1.8 + hold, 0.6, top=(Q[i], s + 1.95))

# 3. What the copy taught us: F at the turn, card 1's C on top. 1958: the page, and its three words. Words guessed one at a time. The
#    listener: a low fork, G, as she hears. Predict, compare, learn: three notes as the loop draws. Rod: ten rough signals through ten
#    bands, opening into the full chord at "the voices it remembered"; and one note, started earlier, whose tape runs out at "the copy
#    stops". The dotted way back: a D, alone
tw = lambda lid, word, off=0: W('taught', lid, word, off)
tc = lambda lid, off=0: G('taught', lid, off)
opens('taught', F_, 0)
paper(tw('perceptron', 'rough copy', -0.5), 0.012, px(960))
for w, xx in (('senses', 937), ('remembers', 1029), ('acts', 1455)):
    knock(tw('senses', w, -0.1), 0.012, px(xx))
air(tc('descend'), 2.4, 0.007, px(840))
for k in range(5):
    tap(tw('descend', 'guessing', 0.2 + 0.55 * k), 0.008, px(240 + 150 * k))
fork(55, tc('y2022', 0.9), 0.8, 4.4, px(590))
line((72, 76, 79), tc('friston', 0.3), 0.53, 0.9, 0.6)
knock(tw('friston', 'predict', -0.2), 0.01, px(1280))
stops = tw('stops', 'stops')
mel(67, stops - TAPE + 0.05, None, 0.7)
ten, voices = tw('rods', 'ten rough signals'), tw('rods', 'voices')
tenband([60, 64], ten - 0.1, stops - 0.05, 0.8, op=voices - 0.2, od=1.4)
for k in range(3):
    knock(tw('levels', ('the next word', 'the next word', 'where the story')[k], (-0.2, 0.9, -0.2)[k]), 0.01, px(860))
for k in range(3):
    tap(tw('cell', 'five to eight', 0.4 + 0.6 * k), 0.008, px(1090))
mel(74, tw('nobody', 'nobody knows', -0.2), tw('nobody', 'nobody knows', 2.4), 0.6)
closes('taught', 0)

# 4. A mind of its own? G at the turn, card 2's D on top. The poem's pages. Three generations drawing: a pencil each, and a note each,
#    held as the next comes, until the three are one chord. Lovelace's words; Boden's three cards. What a person brings: F, warm, held
#    into Clark's reason, his father, as in the opening
mw = lambda lid, word, off=0: W('mixing', lid, word, off)
mc = lambda lid, off=0: G('mixing', lid, off)
opens('mixing', G_, 1)
for k in range(3):
    paper(S0('mixing') + 3.2 + 1.1 * k, 0.007, px(500))
H0 = mc('others', 0.15)
for k, (a, b) in enumerate(((H0, H0 + 1.4), (H0 + 1.75, H0 + 2.85), (H0 + 3.2, H0 + 4.3))):
    pencil(a, 0.009, px(980), b - a)
    mel((60, 64, 67)[k], a, H0 + 5.6, 0.6)
paper(mw('lovelace', 'whatever', -0.2), 0.012, px(960))
for k in range(3):
    knock(mw('boden', 'three ways', 0.3 * k), 0.012, px(390 + 570 * k))
for w in ('a life', 'an intention', 'a reason'):
    knock(mw('brings', w, -0.15), 0.01, px(970))
chord(F_, mw('brings', 'a life', -0.3), mc('reason', -0.5), 0.7)
air(mc('reason', -0.4), 1.4, 0.008, px(960))
chord(F_ + (65,), mc('reason', -0.3), mc('science', -0.2), 0.75)
for w in ('not for science', ):
    knock(mw('science', w, -0.15), 0.01, px(500))
knock(mw('choice', 'what we mean', -0.15), 0.01, px(500)); knock(mw('choice', 'a choice', -0.15), 0.01, px(500))
closes('mixing', 1)

# 5. Copy it wire by wire: C at the turn, card 3's E on top. The worm's map drawn, its dials; the fly's map; a drop of sugar, and the
#    tick; 86 billion: A minor as the head fills. Music on the radio, through an implant: the tune through ten bands, blurred. Searle's
#    simulated rain, soft; the balance turns, and comes level: F, "nobody knows"
ww = lambda lid, word, off=0: W('wire', lid, word, off)
wc = lambda lid, off=0: G('wire', lid, off)
opens('wire', C_, 2)
knock(ww('worm', 'three hundred and two', -0.1), 0.012, px(960))
knock(ww('wriggles', 'wriggles', -0.3), 0.01, px(1600)); knock(ww('wriggles', 'not much more', -0.2), 0.01, px(1600))
pencil(ww('wriggles', 'how each', -0.4), 0.009, px(960), 1.2)
tap(ww('wriggles', 'how each', 0.6), 0.008, px(700)); tap(ww('wriggles', 'how each', 1.0), 0.008, px(1220))
air(wc('fly', 0.8), 1.0, 0.007, px(960)); knock(ww('fly', 'a hundred and thirty-nine', -0.1), 0.01, px(1480))
drop(ww('sugar', 'sugar', -0.4), 0.014, px(1040))
tap(ww('sugar', 'sugar', 0.4), 0.007, px(560)); tap(ww('sugar', 'predicted'), 0.007, px(1360)); knock(ww('sugar', 'sugar', 1.4), 0.012, px(960), 300)
chord(Am, ww('billion', 'eighty-six billion', -0.3), wc('act', -0.6), 0.65)
mus = ww('speech', 'music', -0.4)
tenband([(64, mus, mus + 0.5), (67, mus + 0.5, mus + 1.0), (72, mus + 1.0, mus + 1.9), (71, mus + 1.9, mus + 2.3), (67, mus + 2.3, mus + 3.2), (48, mus, mus + 3.2)],
        mus, mus + 3.3, 0.8, pan=px(720))
rain(wc('exactly', -0.2), wc('others', -0.4), 0.012, px(870))
knock(ww('searle', 'simulated rainstorm', -0.2), 0.01, px(870))
knock(ww('others', 'a mind is', -0.3), 0.012, px(1250)); creak(ww('others', 'a mind is'), 0.012, px(960), 1.2)
creak(ww('who', 'Nobody knows'), 0.01, px(960), 1.6)
chord(F_, ww('who', 'Nobody knows', 0.2), wc('who', 2.2), 0.6)
closes('wire', 2)

# 6. Why does it feel like anything? A minor at the turn, with card 4's G: the chord's seventh. "The implant turned sound into pulses":
#    the chord through ten bands, cut off at "It didn't hear anything", and silence; "Rod did": a fork, and C major, warm. The hard
#    problem: F as the picture of their life appears. Two theories: the net's links, the news spreading. 2025: the marks on the test;
#    "Science doesn't know yet": a D, alone
ew = lambda lid, word, off=0: W('feels', lid, word, off)
ec = lambda lid, off=0: G('feels', lid, off)
opens('feels', Am, 3, till=5.0)
tenband([60, 64, 67], ec('pulses', 0.4), ec('didnt', 0.15), 0.8, od=1.0)
fork(60, ec('roddid', 0.1), 1.0, 3.8, px(1250))
chord(C_, ec('roddid', 0.5), ec('chalmers', 1.4), 0.7)
hard = ew('chalmers', 'the hard problem')
chord(F_, hard - 0.2, ec('why', 3.0), 0.6)
knock(ew('why', 'physical'), 0.01, px(500)); knock(ew('why', 'rich inner life'), 0.01, px(1460))
for k in range(4):
    tap(ec('one', 0.3 + 0.45 * k), 0.007, px(700))
air(ew('another', 'news shared', -0.2), 1.4, 0.008, px(1320))
knock(ew('one', 'work as one'), 0.01, px(700)); knock(ew('another', 'news shared', 0.2), 0.01, px(1320))
paper(ec('test', -0.2), 0.012, px(960))
for k in range(4):
    pencil(ew('test', 'challenged', -0.4 + 0.6 * k), 0.008, px(700 + 180 * k), 0.35)
mel(74, ec('science', 0.0), ec('science', 2.6), 0.55)

# 7. Could a machine feel? A minor at the turn, card 4 still out. Llinás: A minor as night falls on the sky and the brain hums, fading
#    in deep sleep. Into the neuron, to its tubes: one high note while the pearl shimmers, let go as "a warm, wet brain would wipe out"
#    it. The book and its two quotes; the fourteen signs; the gap between showing the signs and feeling: F as the picture appears
nw = lambda lid, word, off=0: W('machine', lid, word, off)
nc = lambda lid, off=0: G('machine', lid, off)
chord(Am, nc('then', -0.8), nc('then', 2.8), 0.65)
dream = nw('llinas', 'dreaming')
for i, m in enumerate(Am):
    mel(m, dream - 0.3 + 0.035 * i, nc('sleep', 1.4), 0.6 if i else 0.7)
knock(nw('llinas', 'forty times', -0.1), 0.01, px(1490))
air(nc('penrose', -0.4), 2.8, 0.008, px(960))
micro, wipe = nw('penrose', 'microtubules'), nw('critics', 'wipe out')
mel(79, micro, wipe + 0.1, 0.5)
knock(micro + 0.2, 0.01, px(960)); knock(wipe + 0.3, 0.01, px(560)); knock(nc('disagree', 0.3), 0.01, px(1360)); knock(nw('disagree', 'tests go on', -0.1), 0.01, px(960))
thump(nc('y2001', -0.2), 0.016, px(600)); paper(nc('y2001', 1.2), 0.01, px(1390)); paper(nc('y2007', 0.4), 0.01, px(1390))
paper(nc('y2023', 0.5), 0.012, px(510))
knock(nw('none', 'None'), 0.01, px(960)); knock(nw('none', 'nothing obvious'), 0.01, px(960))
air(nc('whether'), 1.6, 0.008, px(500))
chord(F_, nc('whether', 0.2), nc('whether', 4.4), 0.65)
closes('machine', 3)

# 8. What makes us human? F at the turn, card 5's A on top. 1637: Descartes' words. Today, machines do: the question goes into the ring
#    and the answer comes out, rising. Four cards. Rod hears Margaret: C major, and the fork as her words reach him; the telephone,
#    clear now, and he turns to it. The agent's task flies into the ring; Mei lifts her sign-off; card 5 goes back with its A. "We
#    don't have the answers yet": C, held into the end card, where the C fork is set on its box once more, and the Mellotron answers
#    with C and G and a D, left open
hw = lambda lid, word, off=0: W('human', lid, word, off)
hc = lambda lid, off=0: G('human', lid, off)
opens('human', F_, 4)
paper(hc('descartes', 2.4), 0.01, px(790))
air(hc('today', 0.6), 0.9, 0.008, px(800)); tap(hc('today', 1.3), 0.008, px(1124))
line((72, 74, 76, 79), hc('today', 1.5), 0.5, 1.4, 0.55)
for lid, xx in (('body', 620), ('life', 1300), ('feelings', 620), ('choosing', 1300)):
    knock(hc(lid, -0.1), 0.01, px(xx))
chord(C_, hc('heard', 0.2), hc('heard', 6.2), 0.7)
fork(60, hc('heard', 2.3), 0.9, 3.6, px(1250))
phone(hc('heard', 4.0), 0.022, px(1610), False, 1)
for w in ('like us', "where they're not", "still don't know"):
    knock(hw('building', w), 0.01, px(960))
closes('human', 4, end=G('human', 'helps') - S0('human') - 0.4, hold=2.2)
air(hw('helps', 'what to hand', -0.4), 1.6, 0.009, px(1000)); tap(hw('helps', 'what to hand', 1.0), 0.008, px(1750))
paper(hw('helps', 'what to keep', -0.3), 0.01, px(580))
chord(C_, hc('answers', -0.4), hc('breath', 0.5), 0.7)
fork(60, hc('breath', 0.3), 1.0, 4.4, 0.0, set_at=hc('breath', 0.9))
chord(OPEN, hc('breath', 1.5), E('human') + 0.5, 0.8)
