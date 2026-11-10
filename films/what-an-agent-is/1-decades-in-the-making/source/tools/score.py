# Decades in the making: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (checked against every score.py on main and against the series' other films, in
# /mnt/project-files/agentic-data-engineering/series-1/palettes.md, so none repeats): a cittern and a serpent, both made here (music.py
# has neither). The cittern is the small wire-strung instrument of the sixteenth century, plucked with a quill; the serpent is the long
# wooden bass horn of the same years, bent like a snake, blown through a cup mouthpiece and fingered on six holes. Both are from Europe
# soon after printing, the opening's own place and time.
#  - The cittern plays the pieces, and the years. Each year on the oak rail has its own note, rising with time, so the road sounds as it
#    is drawn: 1958 is A, 1969 C sharp, 1986 E, 2012 the A above, 2017 C sharp, 2020 E, 2022 F sharp and 2024 the A at the top. At each
#    chapter's turn the rail leaves one year and arrives at the next, and a chord rolls up to the new year's note.
#  - The serpent is the long work: one low note held under each long stretch of time (four hundred years of printing, twenty years of
#    small networks, "long work"), and under the problem in the opening.
#  - The film's mark: pieces plucked one at a time, far apart, then struck together as a chord where they come together (printing's
#    pieces in Mainz, the three pieces in 2012, all the words at once, the agent, the three things, and the end card).
#  - A major, tuned pure; F sharp minor for the opening's problem (books slow, rare and copied with mistakes).
# The rules the series keeps:
#  - Music only from time to time (the author's rule, 20 October 2026): under the opening story, and after it only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the opening
#    no chapter has music for more than half its length, or for 12 seconds without a break, that it comes in at most once every 10
#    seconds on average, that no figure comes back soon after itself, and that the music and the effects sit as low as the governance
#    films' (the author's review, 4 November 2026). No urgent pulse: film.json lists none.
#  - Nothing trembles, pulses or beats: each note is one string or one player, with no vibrato and no chorus (a cittern's courses are
#    pairs of strings in unison; here the pair is tuned exactly, so it can't beat), and every chord is tuned pure (just intonation, see
#    hz()). B is never sounded with D or F sharp, whose intervals aren't pure in this tuning.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz: a quill on parchment, clay and metal type, the press, pages, a flashbulb,
# a 1950s machine's relays and dials, coins, keys, and air as things move.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl, re as _re
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
R1 = np.random.default_rng(1440)  # this film's own randomness: the room, the quill, the type, the paper, the coins

# ---- tuning: just intonation from A, so a chord's notes are whole-number ratios of each other and nothing beats. The chords used are
# A, D, E, F sharp minor and C sharp minor, whose thirds and fifths are all pure in this table
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (45, 110.0)  # A 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the notes, by name
A2, Cs3, D3, E3, Fs2 = 45, 49, 50, 52, 42
A3, Cs4, D4, E4, Fs4, Gs4, A4, B4, C5, Cs5, D5, E5, Fs5, A5 = 57, 61, 62, 64, 66, 68, 69, 71, 72, 73, 74, 76, 78, 81
# the road: each year on the rail, its note
YN = {1958: A3, 1969: Cs4, 1986: E4, 2012: A4, 2017: Cs5, 2020: E5, 2022: Fs5, 2024: A5}

# ---- the levels: the two sit about as far under the voice as the series' other films' music (matched by loudness, not by peak); the
# serpent low and quiet; the effects about 12 dB under the music (FX scales them all). After the author's review (4 November 2026:
# "glitches"), the cittern is 4 dB lower and the serpent 2 dB, so the music's loud moments sit as low as the governance films' (tools/
# quiet.py measures it), and the effects 6 dB lower, as soft as theirs. With the room set by what it rings where the notes are (below),
# the cittern is 1.6 dB higher and the serpent 3.1 dB, so each is as loud as before, its echo now quieter
CL, SL, FX = 0.130, 0.057, 2.25

# a small room of wood and plaster round the players, ringing on for about a second and a half. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own level after it (_held), as
# the video guidelines ask: scaled by all it rang, as at first, the room rang 10 dB louder there than its share said, and made the
# serpent's held notes 1.5 to 4.7 dB louder, each by where the room's reflections met it
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.4)).astype(np.float32))(np.arange(int(1.4 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, amt):
    return np.pad(sig, (0, len(_IR) - 1)) + amt * fftconvolve(sig, _IR).astype(np.float32)
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

# ---- the cittern: wire strings, brass below and steel above, plucked with a quill near the bridge, in pairs tuned exactly together.
# The quill near the bridge gives a bright, even spread of harmonics, the second to the sixth strongest; wire rings on longer than gut,
# and its higher harmonics die first, so a note starts bright and settles to a round tone. Its small, flat body favours its air near
# 270 Hz and its top near 560 and 1150 Hz. The pair is struck a few milliseconds apart, as a quill crosses two strings; nothing above
# about 2.4 kHz
CB = [(270, 90, 0.8), (560, 170, 1.0), (1150, 320, 0.6), (1900, 450, 0.3)]
def _string(f, x, pos):
    sig = np.zeros(len(x)); d1 = 1.6 * (220 / f) ** 0.35
    for k in range(1, int(2400 // f) + 1):
        fk = f * k; dk = d1 / (1 + 0.22 * (k - 1) ** 1.2)
        a = abs(np.sin(np.pi * k * pos)) / k ** 0.75 * np.exp(-fk / 3200) * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in CB) + 0.3)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.9 * k * k) * (0.4 * np.exp(-x / (0.12 * dk)) + 0.6 * np.exp(-x / dk))
    return sig
def cit(m, s, g=0.6, pan=None, ring=2.0):
    """a note on the cittern, plucked at s and damped after ring seconds"""
    f = hz(m); sec = ring + 0.3; x = tt(sec).astype(np.float64); fl = int(0.006 * SR)
    sig = _string(f, x, 0.125); sig[fl:] += 0.8 * _string(f, x[:-fl], 0.14)
    sig = sig * np.minimum(1, x / 0.0018) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.3, 1)) ** 2, 1.0)
    nq = int(0.02 * SR); sig[:nq] += 0.05 * np.abs(sig).max() * filt(noise(0.02), 'band', (900, 2300))[:nq] * np.exp(-np.arange(nq) / SR / 0.003)
    sig = _room(norm(filt(sig.astype(np.float32), 'low', 2400)), 0.25)
    put(sig.astype(np.float32), s, g * CL, max(-0.3, min(0.35, 0.05 + (m - 66) * 0.012)) if pan is None else pan)

# ---- the serpent: played softly, one player, held steady with no vibrato. Its tone is round and dark: the fundamental strong, each
# harmonic softer than the last, its wooden bore lifting those near 480 Hz (they carry it on a phone, whose speaker drops the low
# notes), the leather damping the rest, nothing above about 1.8 kHz. Like a brass note, its higher harmonics speak a moment after the
# first; a breath of air comes with it
def _ser(f):
    n = max(1, int(1800 // f)); k = np.arange(1, n + 1); fk = f * k
    a = np.exp(-0.4 * (k - 1)) * (1 + 1.0 * np.exp(-((fk - 480) / 220) ** 2)) / (1 + (fk / 1100) ** 4)
    return a / np.sqrt((a ** 2).sum())
def ser(m, a, b, g=0.8, att=0.2, rel=0.6, pan=-0.15):
    """the serpent holds m from a to b, and lets go over rel seconds: a long note swells a little and eases, once"""
    f = hz(m); sec = b - a; n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for j, aj in enumerate(_ser(f)):
        k = j + 1; e = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.3 * (k - 1))), 1)) ** 2
        s = s + aj * e * np.sin(2 * np.pi * f * k * x + 0.4 * k)
    env = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    if sec >= 1.2:
        env = env * (0.84 + 0.16 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s * env; nb = min(n, int(0.3 * SR))
    s[:nb] += 0.02 * filt(noise(0.3), 'band', (200, 1100))[:nb] * np.exp(-np.arange(nb) / SR / 0.07)
    s = _held(filt(s.astype(np.float32), 'low', 1800), 0.4)
    put(s.astype(np.float32), a, g * SL, pan)

# ---- what the two play
def roll(notes, s, step=0.1, g=0.55, ring=2.0, down=False):
    """a chord rolled on the cittern, lowest first (down: highest first), each note let ring"""
    for i, m in enumerate(sorted(notes, reverse=down)):
        cit(m, s + step * i, g * (0.85 if i == 0 else 0.72), ring=ring)
def strum(notes, s, g=0.6, ring=2.4):
    """the pieces together: a chord struck at once, the quill across every course"""
    roll(notes, s, 0.028, g, ring)
def line(notes, g=0.5, ring=1.4):
    """single notes, [(time, note)], each damped as the next is struck"""
    for i, (s, m) in enumerate(notes):
        nx = notes[i + 1][0] if i + 1 < len(notes) else s + ring
        cit(m, s, g, ring=min(ring, max(0.35, nx - s + 0.08)))
def year(yr, s, g=0.5, ring=1.6):
    """a year on the rail: its own note"""
    cit(YN[yr], s, g, ring=ring)
def turn(sid, old, new, below, arrive=2.3, g=0.5):
    """a chapter's turn: the rail leaves the last chapter's year (from 0.7 s) and arrives at the new one (at 2.3 s), the chord rolled up
    to the new year's note. The year it leaves isn't plucked any more: with it, each turn played two figures a second apart, and the
    music came too often (tools/quiet.py, 4 November 2026)"""
    s0 = S0(sid)
    roll(tuple(below) + (YN[new],), s0 + arrive - 0.12 * len(below), 0.12, g, ring=1.7)
def passed(s, g=0.5):
    """a check that passes: two notes rising a fourth, E to A"""
    line([(s, E4), (s + 0.24, A4)], g, ring=1.5)
def magic(s, g=0.4):
    """magic, as people expect it: a bright open fourth, high"""
    cit(E5, s, g, ring=1.6); cit(A5, s + 0.03, g * 0.9, ring=1.6)

# ---- soft sounds of the scenes, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a book set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.02, pan=0.0, sec=0.45):
    """a sheet of paper laid down or slid: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.6):
    """a pen line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def pin(s, g=0.02, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.012, pan=0.0, lo=140, hi=900):
    """something moving or growing: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def _moving(sig, s, g, p0, p1, n=8):
    """a sound that crosses the stereo field from p0 to p1: overlapping slices, each placed a little further along"""
    L = len(sig); ix = np.arange(L); h = L / n
    for i in range(n):
        w = np.cos(0.5 * np.pi * np.clip((ix - (i + 0.5) * h) / h, -1, 1)) ** 2
        X((sig * w).astype(np.float32), s, g, p0 + (p1 - p0) * (i + 0.5) / n)
def whoosh(s, sec=0.7, g=0.012, p0=0.0, p1=0.0):
    """something flying across the frame: a soft whoosh of air that follows it"""
    x = tt(sec); _moving(filt(noise(sec), 'band', (220, 1400))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, p0, p1)
def quill(s, sec, g=0.006, pan=0.0):
    """a quill writing on parchment: short strokes of a soft, dry scratch, with small lifts between the letters"""
    x = tt(sec); n = len(x); e = np.zeros(n, np.float32); t0 = 0.0
    while t0 < sec:
        d = R1.uniform(0.07, 0.22); i0, i1 = int(t0 * SR), min(n, int((t0 + d) * SR))
        if i1 > i0:
            e[i0:i1] = np.sin(np.pi * np.linspace(0, 1, i1 - i0)) ** 0.7 * R1.uniform(0.5, 1.0)
        t0 += d + R1.uniform(0.04, 0.16)
    nz = filt(noise(sec)[:n], 'band', (700, 2000)) * (1 + 0.6 * filt(noise(sec)[:n], 'low', 40))
    X(filt((nz * e).astype(np.float32), 'low', 2100), s, g * FX, pan)
def clay(s, g=0.012, pan=0.0):
    """a small piece of baked clay set down on wood: a short, dull knock with a little grit"""
    x = tt(0.1); b = np.sin(2 * np.pi * 430 * x) * np.exp(-x * 70) + 0.45 * np.sin(2 * np.pi * 1020 * x) * np.exp(-x * 110)
    gr = 0.5 * filt(noise(0.1)[:len(x)], 'band', (600, 2000)) * np.exp(-x * 120)
    X(norm(filt((b + gr).astype(np.float32), 'low', 2000)), s, g * FX, pan)
def iron(s, g=0.016, pan=0.0):
    """a piece set into the iron frame: a dull knock, and a short low ring of metal"""
    x = tt(0.5); r = sum(np.sin(2 * np.pi * f * x) * np.exp(-x * d) * a for f, d, a in ((520, 14, 1.0), (1180, 22, 0.5), (1720, 34, 0.25)))
    X(norm(filt((0.5 * r * np.minimum(1, x / 0.002)).astype(np.float32), 'low', 2200)), s + 0.004, g * 0.5 * FX, pan)
    s_knock(s, g * FX, pan, 200)
def press(s, g=0.02, pan=0.0):
    """the press's platen screwed down on the page: a short wooden creak, and a padded thud"""
    x = tt(0.45); fr = 260 + 90 * np.sin(np.pi * x / 0.45); cr = filt(noise(0.45)[:len(x)], 'band', (180, 900)) * (0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(fr) / SR / 14))
    X((cr * np.sin(np.pi * x / 0.45) ** 2).astype(np.float32), s, g * 0.5 * FX, pan)
    x = tt(0.3); X(norm(filt((np.sin(2 * np.pi * 95 * x) * np.exp(-x * 22) + 0.3 * filt(noise(0.3), 'band', (120, 700))[:len(x)] * np.exp(-x * 30)).astype(np.float32), 'low', 800)), s + 0.42, g * FX, pan)
def clink(s, g=0.01, pan=0.0):
    """small metal type, or a coin, touching another: two soft clinks, the metal kept low"""
    for d, gg in ((0.0, 1.0), (R1.uniform(0.04, 0.08), 0.6)):
        fs = [R1.uniform(1050, 1250), R1.uniform(1500, 1700), R1.uniform(1950, 2150)]
        x = tt(0.3); c = sum(np.sin(2 * np.pi * f * x) * np.exp(-x * (20 + 0.01 * f)) for f in fs) * np.minimum(1, x / 0.002)
        X(norm(filt(c.astype(np.float32), 'low', 2300)), s + d, g * gg * FX, pan)
def coin(s, g=0.01, pan=0.0):
    """a coin set down on a stack: one short clink and a soft knock under it"""
    fs = [R1.uniform(1100, 1300), R1.uniform(1600, 1800)]
    x = tt(0.2); c = sum(np.sin(2 * np.pi * f * x) * np.exp(-x * 30) for f in fs) * np.minimum(1, x / 0.002)
    X(norm(filt(c.astype(np.float32), 'low', 2300)), s, g * 0.7 * FX, pan); s_knock(s, g * 0.6 * FX, pan, 330)
def bulb(s, g=0.016, pan=0.0):
    """a flashbulb firing: a soft, dull pop, with no bright fizz"""
    x = tt(0.25); X(norm(filt((filt(noise(0.25), 'band', (250, 1600))[:len(x)] * np.exp(-x * 26) + 0.6 * np.sin(2 * np.pi * 140 * x) * np.exp(-x * 40)).astype(np.float32), 'low', 1700)), s, g * FX, pan)
def relay(s, g=0.01, pan=0.0):
    """a relay closing in a machine of 1958: a small, dull double click"""
    tap(s, g, pan); s_knock(s + 0.012, g * 0.7 * FX, pan, 520)
def dial(s, g=0.006, pan=0.0, n=3, step=0.07):
    """a dial nudged round: a few tiny detent clicks"""
    for i in range(n):
        tap(s + i * step + 0.02 * R1.uniform(), g * (1 - 0.15 * i), pan)
def riffle(s, sec, g=0.008, pan=0.0, rate=30.0, lo=500, hi=1900, swell=True):
    """paper or cards riffled, many at once: one soft texture, placed as one sound. A bed of filtered noise that flutters as the sheets
    pass (faster for a higher rate, up to 12 times a second), with a few flicks standing out of it, at most eight a second, each with a
    2.5 ms attack; it swells in and fades out. Played as separate grains, up to sixty a second, each starting at full strength, it
    sounded like crackle (the author's review, 4 November 2026)"""
    n = int(sec * SR); x = np.arange(n) / SR
    fl = filt(R1.standard_normal(n + SR // 10).astype(np.float32), 'low', min(12.0, 0.4 * rate))[SR // 10:]
    fl = 0.65 + 0.35 * fl / max(1e-9, float(np.abs(fl).max()))
    out = 0.55 * filt(noise(sec + 0.05)[:n], 'band', (lo, hi)) * fl
    for t0 in np.sort(R1.uniform(0, max(0.01, sec - 0.05), min(int(sec * 8), int(sec * rate)))):
        i = int(t0 * SR); j = min(n, i + int(0.04 * SR)); u = np.arange(j - i) / SR
        out[i:j] += filt(noise(0.05)[:j - i], 'band', (lo, hi)) * np.minimum(1, u / 0.0025) * np.exp(-u * 120) * R1.uniform(0.5, 1.0)
    e = np.sin(np.pi * x / sec) if swell else np.minimum(1, x / 0.08) * np.minimum(1, (sec - x) / 0.08)
    X(filt((out * e).astype(np.float32), 'low', 2000), s, g * FX, pan)
def keys(s, n, g=0.008, pan=0.0, step=0.13):
    """a few keys typed, the first two at g and the rest softer; at most about eight a second"""
    for i in range(n):
        tap(s + i * step + 0.04 * R1.uniform(), g if i < 2 else g * 0.6, pan)
def hum(s, sec, g=0.006, f=110.0):
    """a machine's soft hum, in tune with the music's A, swelling in and fading"""
    x = tt(sec); h = np.sin(2 * np.pi * f * x) + 0.5 * np.sin(4 * np.pi * f * x) + 0.2 * np.sin(6 * np.pi * f * x)
    X((h * np.sin(np.pi * np.clip(x / sec, 0, 1)) ** 1.5).astype(np.float32), s, g * FX, 0.0)

# =============================================================================================================================
# 1. An idea that waited: the opening, with music all through. Europe in the 1440s, a scribe copies a book letter by letter: the home
#    chord, slowly, the serpent's A under it, and the quill. Slow and rare: F sharp minor, the serpent falling to F sharp as night falls
#    over days of copying. Cambridge's library, 122 books on four lecterns: D, and the books set out, all 122. Every copy adds mistakes:
#    a note copied three times that drifts down on the copies. "Something has to change": the serpent holds C sharp, a question. The idea
#    is four hundred years old: Mainz on the wall's rail, its note E, and China, A, four hundred years back, the serpent holding the span.
#    Bi Sheng's clay pieces, made one by one, set in the iron frame and printed: A major as the page comes off; lifted out to use again.
#    Korea, 1377: the metal pieces, C sharp, and the oldest book that survives, C sharp minor, softly. Mainz: Gutenberg brings the pieces
#    together, E; each of the five, as it comes, plucked on its own; and struck together as Fust puts up the money, the serpent under
#    "years of trying". By 1500: a note for each town as its press opens, scattered, then more and more; cheaper books, far more
#    readers: D to A, the serpent under it. All at once: the three notes struck together; it had taken four hundred years: they come
#    apart again, and the serpent holds the span. Today: the agent joins Jun's team, A at the top (2024's note); some fear it, the
#    serpent's low F sharp; some expect magic, a bright fourth. Its ideas are decades old: the rail is drawn and each year sounds as its
#    tab drops, the serpent under "long work"; and the title, on the mark: the chord struck, the serpent's A under it
ow = lambda lid, word, off=0: W('story', lid, word, off)
oc = lambda lid, off=0: G('story', lid, off)
# the scribe, letter by letter
roll((A3, Cs4, E4, A4), 0.35, 0.2, 0.55, ring=3.0)
ser(A2, 0.5, oc('rare', -0.25), 0.75)
line([(2.5, Cs5), (3.3, B4), (4.3, A4), (ow('europe', 'letter by'), E4), (ow('europe', 'letter by', 0.5), Fs4), (ow('europe', 'letter by', 0.95), E4)], 0.42, ring=1.6)
quill(0.7, oc('rare') - 0.9, 0.006, px(820))
# slow and rare: F sharp minor; the night falls over days of copying, and the light comes back
roll((A3, Cs4, Fs4), oc('rare', 0.05), 0.25, 0.45, ring=2.6)
ser(Fs2, oc('rare', -0.25), oc('cambridge', 0.1), 0.75)
# Cambridge's library, its whole collection, 122 books on four lecterns: D, the serpent on D; the books set out, all 122, and the count
cb0 = oc('cambridge', -0.3); held, bk = ow('cambridge', 'held'), ow('cambridge', 'a hundred')
roll((A3, D4, Fs4), cb0 + 0.45, 0.22, 0.45, ring=2.6)
ser(D3, oc('cambridge', 0.1), oc('mistakes', -0.4), 0.65)
knock(held, 0.010, px(330), 220); knock(held + 0.05, 0.007, px(560), 240)
riffle(held, bk + 1.2 - held, 0.0045, px(900), rate=34, lo=180, hi=1100)
knock(bk - 0.6, 0.010, px(960), 260)
cit(Fs4, bk + 1.25, 0.4, ring=2.2)
# every copy adds mistakes: three sheets laid down, one copied from the next; the note copied with them, which drifts on the copies
cp, ms = ow('mistakes', 'copy'), ow('mistakes', 'mistakes')
ser(Fs2, oc('mistakes', -0.4), oc('change', -0.25), 0.65)
paper(oc('mistakes', -0.2), 0.010, px(430), 0.4); paper(cp - 0.3, 0.010, px(960), 0.4); paper(cp + 0.5, 0.010, px(1460), 0.4)
line([(oc('mistakes', -0.15), Cs5), (cp - 0.25, Cs5), (cp + 0.55, Cs5), (ms + 0.05, C5), (ms + 0.35, B4)], 0.38, ring=1.6)
pencil(cp - 0.4, 0.006, px(620), 0.6); pencil(cp + 0.4, 0.006, px(1270), 0.6)
# something has to change: the serpent holds C sharp, a question, and lets it go
ser(Cs3, oc('change', -0.2), oc('change', 2.1), 0.8, rel=0.9)
# the idea is four hundred years old: the rail drawn on the wall; Mainz, 1450, lit, its note E; China, the 1040s, A, four hundred years
# back; Korea between them; the serpent holds the span
wl, will, four = oc('old', -0.4), ow('old', 'will change'), ow('old', 'four hundred')
whoosh(wl, 1.2, 0.007, px(200), px(1700))
cit(E4, will + 0.1, 0.5, ring=2.4)
cit(A3, four + 0.4, 0.5, ring=2.6); cit(Cs4, four + 0.62, 0.32, ring=2.2)
ser(A2, four, oc('clay', 1.2), 0.75)
# Bi Sheng's clay: a piece made for each character, one after another; A as the first comes. Ten knocks for the pieces as they appear,
# not twenty-two: at seven a second they ran into a patter
cl0, each = oc('clay'), ow('clay', 'each character')
cit(A3, cl0 + 0.25, 0.42, ring=2.2)
line([(ow('clay', 'piece'), E4), (each, Cs4), (each + 0.9, E4)], 0.36, ring=1.6)
nclay = 10
for k in range(nclay):
    t0 = cl0 + (each - cl0 + 1.2) * (k + 0.5) / nclay + 0.05 * R1.uniform(-1, 1)
    clay(t0, 0.012 if k < 3 else 0.006 * R1.uniform(0.6, 1.0), px(420 + 30 * (k % 6)))
# set in the iron frame, inked, a page printed and lifted off: A major as it comes; the pieces lifted out to be used again
st, pr, ag = ow('frame', 'set them'), ow('frame', 'printed'), ow('frame', 'used them')
for k in range(8):
    iron(st + 0.15 + 0.17 * k + 0.03 * R1.uniform(), 0.011 if k < 2 else 0.006, px(700 + 50 * k))
tap(pr - 0.45, 0.006, px(1000)); paper(pr - 0.2, 0.010, px(1100), 0.6); press(pr - 0.15, 0.014, px(1000))
roll((A3, Cs4, E4, A4), pr + 0.35, 0.14, 0.5, ring=2.6)
paper(ag - 0.3, 0.010, px(1200), 0.6)
for k in range(6):
    clay(ag + 0.2 + 0.22 * k + 0.04 * R1.uniform(), 0.008 if k < 2 else 0.005, px(900 - 60 * k))
# Korea, 1377: the book opens; the metal pieces on their tray, C sharp; the oldest book printed with them that survives: C sharp minor
ko, mt, od = oc('korea'), ow('korea', 'cast in metal'), ow('korea', 'the oldest')
paper(ko + 1.4, 0.010, px(1080), 0.9)
clink(mt - 0.35, 0.010, px(330)); clink(mt - 0.1, 0.006, px(400))
cit(Cs4, mt + 0.05, 0.5, ring=2.4)
roll((Cs4, E4, Gs4, Cs5), od + 0.05, 0.2, 0.42, ring=2.8)
# Mainz: Gutenberg brings the other pieces together, E; the five pieces, each plucked as it comes: metal letters, ink, the press, paper,
# a lender; and struck together as Fust puts up the money, the serpent under "years of trying"
mz, tg = oc('mainz', -0.3), ow('mainz', 'brought')
paper(tg + 0.4, 0.008, px(560), 0.5)
cit(E4, tg + 0.15, 0.5, ring=2.4)
for (lid, word), m in zip((('pieces', 'Letters'), ('pieces', 'an ink'), ('pieces', 'a press'), ('pieces', 'and paper'), ('fust', 'a lender')), (A3, E4, A4, Cs5, E5)):
    t0 = W('story', lid, word, -0.2)
    cit(m, t0 + 0.12, 0.42, ring=1.8); knock(t0 + 0.1, 0.008, px(250 + 352 * [A3, E4, A4, Cs5, E5].index(m)), 250)
lend, mon = ow('fust', 'a lender'), ow('fust', 'the money')
for k in range(3):
    knock(lend - 0.45 + 0.33 * k, 0.005, px(1700 - 60 * k), 150)
clink(mon - 0.35, 0.008, px(1500))
strum((A3, E4, A4, Cs5, E5), mon - 0.25, 0.6, ring=2.8)
ser(A2, mon - 0.25, oc('towns', 0.3), 0.7)
# by 1500: the year counts on, and each town's light comes on with its press: a note for each of the first, then for more and more,
# softer; presses in more than 200 towns; cheaper books, far more readers: D to A, the serpent under it
_tw = [(float(a), float(b), int(c)) for a, b, c in _re.findall(r'\["[^"]+",(-?[\d.]+),(-?[\d.]+),(\d+)\]', (_pl.Path('src') / 'dm_map.js').read_text())]
y0t, y1t = oc('towns', 0.2), ow('towns', 'thirty thousand', 0.6)
SPR = [A4, Cs5, E5, Fs5, A5, E5, Cs5, Fs5]
for i, (lon, lat, yr) in enumerate(sorted(_tw, key=lambda v: v[2])):
    if i > 6 and i % 5:
        continue
    t0 = y0t + (yr - 1450) / 50 * (y1t - y0t) + 0.1
    cit(SPR[i % len(SPR)] if i else E4, t0, 0.34 if i < 4 else 0.24, pan=px(157.04 + (lon + 16) * 26.77) * 0.7, ring=1.4)
knock(max(ow('towns', 'two hundred', -0.2), oc('towns', 2.7)), 0.008, px(1540), 260)
ch, rd = ow('cheaper', 'cheaper'), ow('cheaper', 'far more')
knock(ch - 0.2, 0.008, px(1540), 260)
roll((A3, D4, Fs4, A4), ch - 0.15, 0.14, 0.48, ring=1.6)
ser(D3, ch - 0.2, rd - 0.2, 0.6, rel=0.3)
roll((A3, Cs4, E4, A4, Cs5), rd - 0.25, 0.14, 0.55, ring=2.8)
ser(A2, rd - 0.25, oc('seemed', 1.0), 0.7)
# all at once: the three notes struck together; it had taken four hundred years: Korea and China lit, the notes apart again, and the
# serpent holds the span, "About 400 years"
once, tk = ow('seemed', 'all at once'), ow('seemed', 'It had taken')
strum((A3, Cs4, E4), once, 0.5, ring=1.6)
cit(E4, tk + 0.15, 0.4, ring=1.8); cit(Cs4, tk + 0.42, 0.4, ring=1.8); cit(A3, tk + 0.62, 0.42, ring=2.4)
ser(A2, tk + 0.6, oc('agent', 0.4), 0.75)
# today: an agent joins Jun's team, A at the top, 2024's note; some fear it, the serpent's low F sharp; some expect magic
jn = ow('agent', 'joins')
air(jn - 0.3, 1.0, 0.008, px(1100)); cit(A5, jn, 0.38, ring=2.0)
fr, mg = ow('nowhere', 'fear'), ow('nowhere', 'magic')
knock(fr - 0.2, 0.007, px(270), 260); ser(Fs2, fr - 0.15, fr + 1.0, 0.6, rel=0.4)
knock(mg - 0.2, 0.007, px(1690), 260); magic(mg - 0.1, 0.36)
# its ideas are decades old: the rail drawn, each tab dropping with its year's note; the serpent under "long work"; the title, on the
# mark: the chord struck, the serpent's A under it
dc, un = ow('ideas', 'decades'), ow('ideas', 'understand')
whoosh(dc - 0.6, 2.0, 0.006, px(0), px(1920))
for yr in (1958, 1986, 2012, 2022):
    t0 = dc - 0.4 + (yr - 1958) / 66 * 1.8
    year(yr, t0 + 0.1, 0.42, ring=1.8); knock(t0 + 0.12, 0.005, px(960 + (yr - 1991) * 24), 300)
ser(A2, ow('ideas', 'long work', -0.1), un + 0.9, 0.7)
ti = oc('breath', 0.4)
strum((A3, Cs4, E4, A4, Cs5), ti + 0.1, 0.62, ring=3.2)
ser(A2, ti + 0.05, E('story') - 0.2, 0.8, rel=1.0)

# 2. A machine that learns: the turn, the rail back to 1958, A at the bottom of the road. The perceptron is shown to reporters, the
#    flashbulbs; it hums as it starts. Each trial: a card shown, a lamp for its guess, right or wrong, and a dial nudged when wrong; the
#    rush of the next forty-three; the fiftieth, right: the check that passes, E to A. The newspaper: walk, talk, conscious, marked
#    with a pencil, no music (the check has just played). 1969: no straight line splits them; the rail moves on to 1969, C sharp, over the serpent's F sharp; the money goes
#    elsewhere, the coins away, and the machine goes quiet
lw = lambda lid, word, off=0: W('learns', lid, word, off)
lc = lambda lid, off=0: G('learns', lid, off)
l0 = S0('learns')
roll((A3, Cs4, E4), l0 + 2.5 - 0.24, 0.12, 0.5, ring=1.8, down=True)
rep, perc = lw('navy', 'reporters'), lw('navy', 'perceptron')
for b in (rep + 0.15, rep + 0.85, perc + 0.7):
    bulb(b, 0.012, px(1570))
relay(perc - 0.1, 0.008, px(470)); hum(perc - 0.1, 2.2, 0.004)
sh = lw('cards', 'Shown') + 0.1; ends = []; e_ = sh
for d in (1.7, 1.4, 1.05, 1.05, 1.05, 1.05):
    ends.append(e_ + d); e_ += d
for k, (d, wrong) in enumerate(zip((1.7, 1.4, 1.05, 1.05, 1.05, 1.05), (1, 1, 0, 1, 0, 1))):
    t0 = ends[k] - d; g_ = 1.0 if k < 3 else 0.7
    paper(t0 + 0.02 * d, 0.006 * g_, px(560), 0.22)
    relay(t0 + 0.42 * d, 0.006 * g_, px(560))
    knock(t0 + 0.58 * d, 0.008 * g_, px(560), 200 if wrong else 300)
    if wrong:
        dial(t0 + 0.62 * d, 0.004 * g_, px(470), 3, 0.08)
tc = lw('fifty', 'tell them apart', -0.9)
riffle(ends[5], tc - ends[5], 0.004, px(500), rate=26, lo=300, hi=1400)
relay(tc + 0.46, 0.008, px(560)); knock(tc + 0.64, 0.010, px(560), 300)
passed(lw('fifty', 'tell them apart', -0.15), 0.5)
paper(lw('paper', 'newspaper', -0.2), 0.010, px(1300), 0.6)
pencil(lw('paper', 'walk'), 0.005, px(1300), 0.5)
sg, sm, bk1 = lw('layer', 'single layer'), lw('layer', 'some patterns'), lw('layer', 'a book')
air(sg, 0.8, 0.006, px(1420))
ser(Fs2, sm + 0.6, bk1 + 2.2, 0.6, rel=0.7)
knock(bk1 - 0.15, 0.010, px(1640), 200); paper(bk1 - 0.1, 0.006, px(1640), 0.3)
year(1969, bk1 + 0.8, 0.45, ring=1.8)
mo = lw('layer', 'money')
for i in range(5):
    clink(mo + 0.13 * i, 0.006 * (1 - 0.12 * i), px(880 + 30 * i))
whoosh(mo + 0.1, 1.4, 0.006, px(900), px(1900))
relay(mo + 0.2, 0.006, px(470))

# 3. Learning from mistakes: the turn, 1969 to 1986, C sharp to E. The paper pinned; the network on its panel. It guesses: the signal
#    climbs the layers, a note at each, and stops on G sharp, wrong, left unresolved; the error passed back layer by layer, air
#    moving back across them, no music (a line coming down made the chapter's music come in five times in thirty seconds); the error
#    made smaller. Many examples slide in; the layers in between find patterns, a note for each, rising to A at last. Slow computers, few
#    examples: twenty years, the serpent holding F sharp under the bracket as the rail moves on
mw = lambda lid, word, off=0: W('mistakes', lid, word, off)
mc = lambda lid, off=0: G('mistakes', lid, off)
turn('mistakes', 1969, 1986, (A3, Cs4))
th = mw('layers', 'three researchers', -0.4)
paper(th, 0.010, px(290), 0.5); pin(th + 0.6, 0.012, px(290))
air(mc('layers', 0.4), 0.9, 0.006, px(1200))
gw = mw('guess', 'guess')
paper(gw - 0.6, 0.006, px(700), 0.25)
line([(gw - 0.1 + 1.3 * l / 3, m) for l, m in enumerate((A3, Cs4, E4, Gs4))], 0.36, ring=1.6)
pb = mw('back', 'passed back')
whoosh(pb, 2.2, 0.006, px(1440), px(900))
mn, sl = mw('patterns', 'many examples'), mw('small', 'slow')
for k in range(5):
    paper(mn + (sl - mn) * k / 14 + 0.03 * R1.uniform(), 0.005 * (1 - 0.15 * k), px(700), 0.2)
pencil(mw('patterns', 'in between', -0.3), 0.005, px(1170), 0.5)
no = mw('patterns', 'no one')
line([(no - 0.3 + 0.3 * k, m) for k, m in enumerate((Cs5, E5, Fs5, A5))], 0.3, ring=1.0)
knock(sl - 0.3, 0.012, px(250), 160)
tw = mw('small', 'twenty years')
pencil(tw + 0.2, 0.006, px(1100), 2.0)
ser(Fs2, tw, E('mistakes') - 0.3, 0.6, rel=0.8)

# 4. The power to run: the turn, to 2012; the three pieces fly in, the ideas, data and power, a note as each lands, and struck together
#    with 2012's A on top. A far bigger network; the photos, a million and more; two graphics chips, and hundreds of small sums at once;
#    the contest, its misses marked, 15 and then 26. The ideas were old, the serpent's A; what was new was the power to run them: the
#    pieces struck together again
pw = lambda lid, word, off=0: W('power', lid, word, off)
pc = lambda lid, off=0: G('power', lid, off)
pi_ = pw('together', 'the pieces')
for i, m in enumerate((A3, Cs4, E4)):
    t0 = pi_ - 0.1 + 0.15 * i
    cit(m, t0 + 0.3, 0.42, ring=1.2); air(t0, 0.5, 0.005, px(([-300, 700, 1800][i] + 280 + 480 * i) / 2 + 200))
strum((A3, Cs4, E4, A4), pi_ + 0.75, 0.55, ring=2.0)
air(pw('photos', 'A team', -0.4), 0.6, 0.005, px(960))
air(pw('photos', 'much bigger', -0.3), 1.4, 0.007, px(1040), 120, 700)
mi = pw('photos', 'a million')
riffle(mi - 0.6, 1.5, 0.005, px(400), rate=16, lo=400, hi=1800)
tg2 = pw('chips', 'two graphics', -0.2)
knock(tg2 + 0.1, 0.008, px(1400), 320); knock(tg2 + 0.3, 0.007, px(1400), 300)
riffle(pw('chips', 'hundreds'), 2.0, 0.003, px(1400), rate=60, lo=300, hi=1200)
paper(pw('contest', 'image contest', -0.2), 0.008, px(960), 0.5)
# the misses marked as the grid fills, 15 and then 26: a few soft taps while the marks come, not one for each (26 in a second rattled)
f15, f26 = pw('contest', 'fifteen', -0.6), pw('next', 'twenty-six', -0.6)
for k in range(5):
    tap(f15 + 0.2 * k + 0.05 * R1.uniform(), 0.005, px(550))
for k in range(7):
    tap(f26 + 0.14 * k + 0.04 * R1.uniform(), 0.0035, px(1370))
nw0 = pc('new', -0.2)
for i in range(3):
    knock(nw0 + 0.12 * i + 0.3, 0.006, px(480 + 480 * i), 260)
ser(A2, pw('new', 'were old'), pw('new', 'What was new', 0.3), 0.55, rel=0.6)
strum((A3, Cs4, E4, A4, Cs5), pw('new', 'What was new', 0.2), 0.55, ring=2.2)

# 5. Attention: the turn, 2012 to 2017, A to C sharp. The paper, set aside. Before, one word at a time: a note for each word as it's
#    read, "report" and "it" on the same A; then all the words at once: struck together. "It" is the report: the two As, together, an
#    octave apart. The work split across many chips, and a model that grows far bigger: D, the serpent under it
aw = lambda lid, word, off=0: W('attention', lid, word, off)
ac = lambda lid, off=0: G('attention', lid, off)
turn('attention', 2012, 2017, (E4, A4))
paper(aw('paper', 'Attention Is', -0.6), 0.010, px(960), 0.5)
paper(ac('before', -0.6), 0.008, px(500), 0.6)
air(ac('before', -0.3), 0.8, 0.005, px(1180))
ow1 = aw('before', 'one word', -0.2)
line([(ow1 + 0.42 * i, m) for i, m in enumerate((Cs4, E4, Fs4, E4, A4, Cs5, A4, Fs4, E4))], 0.32, ring=1.2)
al = aw('once', 'all the words', -0.2)
strum((Cs4, E4, Fs4, A4, Cs5), al, 0.5, ring=2.0)
air(al + 0.2, 1.2, 0.005, px(1180), 200, 1000)
itw = aw('report', 'it learns', -0.2)
cit(A3, itw + 0.1, 0.42, ring=1.8); cit(A4, itw + 0.12, 0.4, ring=1.8)
mch = aw('bigger', 'many chips', -0.5)
for k in range(8):
    tap(mch + 0.08 * k, 0.005, px(583 + 160 * k))
gr = aw('bigger', 'grow', -0.3)
air(gr, 1.6, 0.006, px(1190), 120, 700)
roll((D4, Fs4, A4, D5), gr + 0.1, 0.14, 0.42, ring=2.2)
ser(D3, gr, E('attention') - 0.4, 0.5, rel=0.8)

# 6. The written web: the turn, 2017 to 2020, C sharp to E. Text from the web and books, flowing in. Guess the next word, check it,
#    adjust: three notes, E, A (the check, a fourth up) and F sharp; then billions of times, the cycle a soft riffle, and grammar,
#    facts and ways of writing taken in under it, without notes of their own. 175 billion numbers to tune, the dials turning. It wrote
#    fluently, typing on; but it only carried on the text: a phrase that stops on B over E, unresolved
ww = lambda lid, word, off=0: W('web', lid, word, off)
wc = lambda lid, off=0: G('web', lid, off)
turn('web', 2017, 2020, (A4, Cs5))
riffle(wc('text'), wc('task', 0.6) - wc('text'), 0.003, px(300), rate=7, lo=300, hi=1600)
knock(wc('task', -0.3), 0.007, px(520), 260)
gs, ck, adj = ww('task', 'guess the next'), ww('task', 'check it'), ww('task', 'adjust')
line([(gs - 0.15, E4), (ck - 0.05, A4), (adj - 0.15, Fs4)], 0.36, ring=1.3)
keys(gs + 0.4, 3, 0.005, px(520), 0.08); tap(ck, 0.006, px(700))
bl = ww('billions', 'Billions')
riffle(bl, wc('largest', -0.3) - bl, 0.003, px(500), rate=22, lo=300, hi=1300)
lg = wc('largest', -0.2)
whoosh(lg, 1.2, 0.006, px(1080), px(1450))
hd = ww('largest', 'a hundred and seventy-five', -0.2)
air(hd - 0.2, 1.8, 0.006, px(1450), 120, 700)
for k in range(4):
    dial(hd + 0.4 + 0.5 * k, 0.003, px(1200), 2, 0.09)
knock(wc('help', -0.3), 0.007, px(530), 260)
fl, ca = ww('help', 'fluently'), ww('help', 'carried on')
keys(fl, int((ca + 0.4 - fl) / 0.17), 0.005, px(400), 0.17)
line([(ca - 0.15, A4), (ca + 0.25, Cs5), (ca + 0.65, B4)], 0.36, ring=1.8)
ser(E3, ca - 0.2, E('web') - 0.5, 0.5, rel=0.8)

# 7. Helpful, with hands: the turn, 2020 to 2022, E to F sharp, over D. People rank a model's answers; the model trained on their
#    choices. Preferred to a model a hundred times bigger: air, no music (the check that passes has its place in 1958). Since 2024: the
#    rail on to 2024, the A at the top; step by step before it answers, a note for each step, the answer on A. Its hands for tools: search, a query, a file; what comes
#    back. A model that reasons, with hands, in a loop: a note for each, and, "that's an agent", struck together
hw = lambda lid, word, off=0: W('helpful', lid, word, off)
hc = lambda lid, off=0: G('helpful', lid, off)
turn('helpful', 2020, 2022, (A4, D5))
for i in range(3):
    knock(hc('rank', 0.2 + 0.2 * i), 0.006, px(930), 260)
be = hw('rank', 'best', -0.6)
for i in range(3):
    tap(be + 0.55 * i + 0.25, 0.006, px(1180))
whoosh(hw('trained', 'trained', -0.3), 1.0, 0.005, px(1240), px(1450))
air(hw('smaller', 'a hundred times', -0.5), 1.2, 0.006, px(1300), 120, 700)
s0h = hc('steps')
roll((Cs5, E5, A5), s0h + 1.0 - 0.24, 0.12, 0.48, ring=1.7)
sp = hw('steps', 'step by step')
line([(sp - 0.2, Cs4), (sp + 0.3, E4), (sp + 0.8, Fs4), (sp + 1.1, A4)], 0.34, ring=1.4)
for word in ('search', 'run a query', 'read a file'):
    tap(hw('tools', word, 0.25), 0.007, px(1400))
whoosh(hw('tools', 'what comes back', -0.2), 1.2, 0.006, px(1400), px(700))
line([(hw('agent', 'reasons'), A3), (hw('agent', 'hands'), Cs4), (hw('agent', 'in a loop'), E4)], 0.4, ring=1.6)
air(hw('agent', 'in a loop', -0.5), 0.9, 0.006, px(960))
strum((A3, Cs4, E4, A4, E5), hw('agent', 'an agent', -0.1), 0.55, ring=2.4)

# 8. Why it seemed so sudden: the agent flies to its place on the rail and lands on 2024, its A; the rail pulls back to the whole road,
#    and the late years flash one after another at "sudden", their notes climbing quickly. Three things arrived together: struck at once.
#    Computing power: the curve, and its steep rise, doubling, a run that climbs faster and faster. Data, the web and labelled examples;
#    money, $900 and then tens of millions, the coins stacking. The three fly into the rail; a light runs back along it: the late years
#    crowded into one quick chord, then 1986, 1969 and 1958 far apart, and the serpent's A under "long work". Printing waited 400 years
#    for its pieces, each plucked as it comes and struck together; these ideas waited decades for theirs: the same, higher. Jun's team
#    knows where it came from: the light runs up the road, a note for each year. The end card: the mark, the pieces apart, then together
sw = lambda lid, word, off=0: W('sudden', lid, word, off)
sc = lambda lid, off=0: G('sudden', lid, off)
s0 = S0('sudden')
whoosh(s0 + 0.5, 1.4, 0.007, px(960), px(1500))
year(2024, s0 + 1.85, 0.48, ring=1.8); knock(s0 + 1.87, 0.006, px(1500), 300)
sd = sw('why', 'sudden', -0.1)
roll([YN[yr] for yr in (2012, 2017, 2020, 2022, 2024)], sd, 0.13, 0.4, ring=1.1)
strum((A3, Cs4, E4), sw('three', 'three things', -0.1), 0.48, ring=1.8)
pencil(sc('compute', 0.2), 0.005, px(400), 1.7)
db = sw('compute', 'doubled')
pencil(db, 0.006, px(400), sw('compute', 'six months', 0.4) - db)
line([(db + d, m) for d, m in ((0.05, A3), (0.6, E4), (1.0, A4), (1.25, Cs5), (1.42, E5))], 0.32, ring=1.0)
air(sc('data', -0.2), 0.8, 0.005, px(960))
paper(sw('data', 'the web', -0.3), 0.007, px(1080), 0.35); paper(sw('data', 'millions', -0.3), 0.007, px(1080), 0.35)
air(sc('money', -0.2), 0.8, 0.005, px(1500))
nn = sw('money', 'nine hundred', -0.3)
coin(nn + 0.1, 0.008, px(1300)); coin(nn + 0.3, 0.007, px(1300))
# tens of millions: six stacks grow, a coin set down as each begins and one as the tallest tops out; a clink for each of their 63
# coins made a metallic buzz (the author's review, 4 November 2026)
tm = sw('money', 'tens of millions', -0.4)
for i in range(6):
    coin(tm + 0.08 * i + 0.06 + 0.02 * R1.uniform(), 0.005, px(1490 + 50 * i))
coin(tm + 0.24 + 0.66, 0.004, px(1640))
T_IN, T_RUN = sc('long', -0.35), sc('long', 0.9)
for i in range(3):
    whoosh(T_IN + 0.12 * i, 1.0, 0.005, px(370 + 590 * i), px(1150))
roll([YN[yr] for yr in (2012, 2017, 2020, 2022, 2024)], T_RUN - 0.25, 0.05, 0.4, ring=1.3, down=True)
for yr in (1986, 1969, 1958):
    year(yr, T_RUN + (2024 - yr) / 66 * 1.8, 0.42, ring=2.0 if yr == 1958 else 1.4)
ser(A2, sw('long', 'long work', -0.25), sc('printing', -0.6), 0.75)
pp = sc('printing', -0.3)
paper(pp, 0.008, px(450), 0.5)
for word, m in (('metal letters', A3), ('paper', Cs5), ('a press', A4), ('a lender', E5)):
    cit(m, sw('printing', word, -0.1), 0.36, ring=1.4)
ab = sw('printing', 'a lender', 0.3)
strum((A3, E4, A4, Cs5, E5), ab, 0.5, ring=2.0)
ser(A2, ab, ab + 1.9, 0.6, rel=0.6)
paper(sc('decades', -0.3), 0.008, px(1470), 0.5)
line([(sw('decades', 'chips', -0.1), A4), (sw('decades', 'data', -0.1), Cs5), (sw('decades', 'money', -0.1), E5)], 0.32, ring=1.2)
strum((A4, Cs5, E5), sw('decades', 'money', 0.3), 0.42, ring=1.6)
wh = sw('team', 'where it came from', -0.3)
for yr in (1958, 1969, 1986, 2012, 2017, 2020, 2022, 2024):
    year(yr, wh + (yr - 1958) / 66 * 0.9, 0.3 if yr < 2012 else 0.24, ring=1.5)
en = sc('breath', 0.6)
line([(en + 0.05, A3), (en + 0.45, Cs4), (en + 0.85, E4)], 0.45, ring=2.0)
strum((A3, Cs4, E4, A4, Cs5), en + 1.3, 0.6, ring=3.0)
ser(A2, en + 1.25, TOT - 0.2, 0.7, rel=0.2)
soften(2500)
