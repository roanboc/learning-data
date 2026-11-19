# A first draft, not a blank page: the music and sounds, played by tools/audio.py with From words to data's helpers
# (shared/tools/music.py). This film's palette, reserved on 12 November 2026 in the four architecture series' palettes (the project's
# enterprise-architecture/new-architecture-series/palettes.md): a fortepiano and hummed voices, both made here (music.py has neither).
# Nothing new fitted, so this film pairs two instruments the site has, which no film pairs and no film of this topic plays (Growing
# people's fortepiano, with four hands; Who does what, end to end's and Deleted means deleted's hummed voices). That pairing is the
# palettes file's exception, written down as an assumption in the film's assumptions file.
#  - The fortepiano (fp(), chord()): the piano of about 1800, its small hammers covered in leather, one string to a note. A note speaks at
#    once and fades within a few seconds: in the bass, reedy, its upper partials strong; in the treble, soft and round. The dampers stop
#    a single note soon after it's struck, and are lifted only under a spread chord, whose notes ring on together until it's let go.
#    Cristofori built the first pianos in a harpsichord's case, on its keys and strings: the instrument itself began from what existed,
#    not a blank page. It is what exists, and the draft built from it: chords spread from the bass up under the opening story (the old
#    foundation, the form a thousand years old) and at a chapter's turn, and a note for each kind of element as the draft pins it up.
#    Growing people's fortepiano is kept bright, dry and short, under four hands; this one rings longer, reedier below and rounder above.
#  - The hummed voices (hum()): a few people humming, lips closed, one voice to a note, no vibrato, each note held at one level, each
#    singer with a voice of their own (SINGERS). Under the narration only the two lowest sing (A flat 2 and E flat 3; hum() stops the mix
#    otherwise). They are those who decide, and they sound only where something is confirmed: the place of the foundations in Babylon,
#    the people who decide, each owner's answer at the utility, what an owner confirms again, the model, and in the recap.
#  - The film's own figure (figure()), once in Babylon and once near the end: the fortepiano spreads a chord with one note left hanging
#    (D flat, a fourth over the bass: the draft's unconfirmed element); the voices come in, and it steps down to C, at rest: confirmed.
#    The series' mark (mark()), under the title and the end card: four notes rising like a tower's tiers, a fifth, a fourth and a third
#    (A flat, E flat, A flat, C), on the fortepiano, its last note held by the voices.
#  - A flat major, F minor for the stalled workshops and what the draft got wrong, tuned pure from A flat (hz()). A flat, D flat and
#    E flat major, F and C minor are pure in this tuning; B flat with F (40/27) or with D flat (32/27), and D flat with G, are not, so no
#    two of those ever sound together (the score stops if they would: _pure()), and there's no B flat minor.
# The films' sound (the author's rule, 20 October 2026, and the review of 4 November 2026):
#  - Music plays under the opening story, a chord or a note to each picture. After it, music comes now and then: a chapter's chord as it
#    turns, a note under a moment on screen, or a chord at a pause. Nothing is held under the explaining, and nothing pulses (film.json
#    lists no "urgent" chapter: nothing in this film is a rush).
#  - Nothing trembles: no vibrato; every chord is tuned pure, and every note keeps its own level in the room.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears, from the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed: change one, change both.
#  - Everything stays low and soft, below about 2.4 kHz: workmen's baskets set down, a measuring rope pulled taut, a clay tablet set
#    down, a mud brick pressed with the king's stamp; notes pinned to a wall, a source clipped to each, a soft glass knock as a note an
#    owner confirms turns to glass, a pen, a stroke through, a lock closed, paper, muffled keys, and a breath of air.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word, or one inside a longer word, stops the mix
import json as _json, pathlib as _pl
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
_SPOKEN = []
def _spoken(a, b):
    """whether the voice speaks anywhere between a and b"""
    if not _SPOKEN:
        _SPOKEN.extend((G(sid, v['id']), END(sid, v['id'])) for sid in _NARR for v in _NARR[sid]['vo'])
    return any(s < b and a < e for s, e in _SPOKEN)
R1 = np.random.default_rng(620)  # this film's own randomness (Babylon, about 620 BCE): the room, the leather, the breath

# ---- tuning: just intonation from A flat 3 (207.65 Hz), so a chord's notes are whole-number ratios of each other and nothing beats.
# Every pitch comes from this one scale, so a note two chords share is the same in both
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (56, 207.652)  # A flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Db2, Eb2, F2, G2, Ab2, Bb2, C3, Db3, Eb3, F3, G3 = 37, 39, 41, 43, 44, 46, 48, 49, 51, 53, 55
Ab3, Bb3, C4, Db4, Eb4, F4, G4, Ab4, Bb4, C5, Db5, Eb5 = 56, 58, 60, 61, 63, 65, 67, 68, 70, 72, 73, 75
# the notes that are never heard together: B flat with F, B flat with D flat, D flat with G (pitch classes counted from A flat)
_IMPURE = {frozenset((2, 9)): 'B flat with F', frozenset((2, 5)): 'B flat with D flat', frozenset((5, 11)): 'D flat with G'}
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

# ---- the levels: the fortepiano and the voices about as far under the narration as the series' other music (matched by loudness, as
# tools/quiet.py measures it); the effects about 16 dB under the music (FX scales them all)
LF, HL, FX = 0.10, 0.030, 2.0

# ---- the room: a plastered hall, small, ringing on for about a second, nothing much above 1.7 kHz. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each note is played into it and set back to its own level, where
# it's held (_held), as the video guidelines ask (held.py checks both)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.014 * SR)] = 0; _IR /= _band(_IR)
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

# ---- the fortepiano. One string to a note, its partials whole multiples of its pitch (so nothing beats), the leather hammer striking
# near an eighth of the string (a gap at the eighth and sixteenth partials). In the bass the upper partials stay strong, so it's reedy;
# in the treble they fall away quickly, so it's round. Each partial has a prompt sound and a longer aftersound, as a piano string has,
# the upper ones dying first, and the whole note fading within a few seconds; the leather's soft touch and the light wooden action's
# small knock as it speaks; a small, warm soundboard. The damper stops it over a fifth of a second when the key comes up
STRIKE = 1 / 8.0
def _fp(m, d):
    f0 = hz(m); bass = min(1.0, max(0.0, (C4 - m) / 24)); sc = (262 / f0) ** 0.5; tp, ta = 0.30 * sc, 2.6 * sc
    sec = d + 0.4; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 60):
        fk = f0 * k
        if fk > 2400:
            break
        a = abs(np.sin(np.pi * k * STRIKE)) / k ** (1.55 - 0.75 * bass)
        dk = 1 + 0.55 * (k - 1) ** 1.1
        sig += a * np.sin(2 * np.pi * fk * x + 0.5 * k) * (0.62 * np.exp(-x * dk / tp) + 0.38 * np.exp(-x * dk / ta))
    sig *= (1 - np.exp(-x / 0.0015)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    sig /= max(1e-9, float(np.abs(sig).max()))
    nt = int(0.04 * SR); xt = x[:nt]
    sig[:nt] += 0.05 * filt(_nz(0.04), 'band', (160, 900))[:nt] * np.exp(-xt / 0.005) + 0.04 * np.sin(2 * np.pi * 150 * xt) * np.exp(-xt / 0.012)
    sig = sig.astype(np.float32); sig = sig + 0.2 * filt(sig, 'band', (220, 1100))
    return norm(filt(filt(sig, 'low', 2400), 'high', 45))
def fp(m, s, g=1.0, ring=1.2, pan=None, room=0.2):
    """one key struck at s and held ring seconds, then damped"""
    _log(m, s, s + ring + 0.2)
    put(_held(_fp(m, ring), room), s, g * LF, max(-0.35, min(0.35, (m - C4) * 0.02)) if pan is None else pan)
def chord(notes, s, g=1.0, step=0.13, ring=2.4):
    """a chord spread from the bass up with the dampers lifted, every note ringing on until it's let go, together"""
    for i, m in enumerate(notes):
        fp(m, s + step * i, g * (1.0 if i == 0 else 0.86), max(0.5, ring - step * i))

# ---- the hummed voices. A hum is a voice with the lips closed: every harmonic of its pitch, falling away above the first few, shaped by
# the nose's resonance, two weak ones above it, and a dip where the closed mouth swallows the sound; nothing above about 2.3 kHz, and the
# harmonics under about 100 Hz a little weakened, so a low note carries on a phone through its harmonics. A little air through the nose
# as each note starts; the pitch rises from a few cents under in its first twentieth of a second, as a voice finds its note, then holds,
# with no vibrato; the level drifts by a few per cent, slowly, as a held breath does. A note ends when the singer lets it go. Each singer
# has a voice of their own: the resonances sit higher in a higher voice (Who does what, end to end made its four voices this way)
SINGERS = {'bass': ((245, 210), [(1000, 360, 0.13), (2000, 460, 0.04)], (820, 250)),
           'baritone': ((275, 225), [(1080, 380, 0.14), (2080, 480, 0.045)], (870, 260)),
           'alto': ((330, 245), [(1180, 400, 0.15), (2150, 500, 0.05)], (930, 280)),
           'soprano': ((390, 265), [(1280, 420, 0.15), (2250, 500, 0.05)], (990, 300))}
def _singer(m):
    return 'bass' if m <= Bb2 else 'baritone' if m <= F3 else 'alto' if m <= Eb4 else 'soprano'
def _harm(f, v, soft=0.9):
    """the weights of a hummed note's harmonics, at f Hz, in voice v (soft < 1: darker)"""
    (c1, b1), up, (cz, bz) = v; n = max(1, int(2300 // f)); k = np.arange(1, n + 1); fk = f * k
    r = 1 / np.sqrt(1 + ((fk - c1) / (b1 / 2)) ** 2) + sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in up) + 0.01
    r = r * (1 - 0.8 * np.exp(-((fk - cz) / (bz / 2)) ** 2))
    a = r * k ** -(0.85 + 0.6 * (1 - soft)) * np.clip((2300 - fk) / 300, 0, 1) * (fk / 100) / np.sqrt(1 + (fk / 100) ** 2)
    return a / np.sqrt((a ** 2).sum())
ROOM = 0.22  # how much of the room each held note carries
def hum(m, a, b, g=1.0, att=0.16, rel=0.28, pan=None, soft=0.9):
    """one voice holding note m from a to b, then letting it go"""
    assert b > a, 'the voices: a note ends before it starts (%.2f to %.2f)' % (a, b)
    assert (m - KEY[0]) % 12 in (0, 4, 5, 7), 'the voices sing only A flat, C, D flat and E flat: they sound where something is confirmed'
    assert m <= Eb3 or not _spoken(a, b + rel), 'under the narration only the two lowest voices sing (A flat 2, E flat 3): %d at %.1f s' % (m, a)
    v = SINGERS[_singer(m)]; f = hz(m); hold = b - a
    n = int((hold + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    A = _harm(f, v, soft)
    ph = 2 * np.pi * np.cumsum(f * (1 - 0.009 * np.exp(-x / 0.05))) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > hold, np.cos(0.5 * np.pi * np.minimum((x - hold) / rel, 1)) ** 2, 1.0)
    dr = filt(_nz(n / SR + 0.01)[:n], 'low', 0.8); dr = 1 + 0.035 * dr / (np.abs(dr).max() + 1e-9)  # the breath's drift
    s = np.zeros(n)
    for j in range(len(A)):  # the higher harmonics come in a little after the lower and go a little before
        s += A[j] * e ** (1 + 0.12 * j) * np.sin((j + 1) * ph + 0.7 * j * j)
    s = s * dr + 0.010 * filt(_nz(n / SR + 0.01)[:n], 'band', (200, 1400)) * e * dr * (1 + 3 * np.exp(-x / 0.06))
    _log(m, a, b + rel)
    put(_held(filt(s.astype(np.float32), 'low', 2300), ROOM), a, g * HL, (0.12 if m > Eb3 else -0.06) if pan is None else pan)

# ---- what they play
def figure(s, sv, g=1.0, more=False):
    """the film's own figure: the fortepiano spreads A flat and E flat with the D flat a fourth over the bass, left hanging (the draft's
    unconfirmed element); at sv the voices come in on A flat and E flat, the D flat is let go, and the fortepiano steps down to C, at rest
    (confirmed). more: in a pause without words, a third voice takes the C"""
    end = sv + 2.9
    for i, m in enumerate((Ab2, Eb3, Ab3)):
        fp(m, s + 0.14 * i, g * (1.0 if i == 0 else 0.86), end - s - 0.14 * i)
    fp(Db4, s + 0.42, g * 0.95, sv + 0.45 - s - 0.42)
    hum(Ab2, sv, end, g); hum(Eb3, sv + 0.14, end, 0.92 * g)
    fp(C4, sv + 0.5, 0.9 * g, end - sv - 0.5)
    if more:
        hum(C4, sv + 0.55, end, 0.8 * g)
MARK = (Ab3, Eb4, Ab4, C5)  # a fifth, a fourth and a third, rising like a tower's tiers
def mark(s, g=1.0, step=0.42, hold=2.6):
    """the series' mark on the fortepiano, its last note held by the voices: the C, with A flat and E flat under it"""
    for i, m in enumerate(MARK):
        fp(m, s + step * i, g * (0.9 if i < 3 else 0.95), 0.8 if i < 3 else hold + 0.4)
    t3 = s + step * 3 + 0.12
    hum(C5, t3, t3 + hold, 0.7 * g); hum(Ab2, t3 + 0.08, t3 + hold, 0.85 * g); hum(Eb3, t3 + 0.16, t3 + hold, 0.8 * g)

# chords (MIDI note numbers), spread from the bass up
Ab_1, Ab_2, Ab_3, Ab_4, Ab_5, Ab_6 = (Ab2, Eb3, C4), (Eb3, Ab3, C4), (Ab2, Eb3, Ab3, C4, Eb4), (Ab2, C4, Eb4), (C4, Eb4, Ab4), (Ab2, Ab3, Eb4)
Db_1, Db_2, Db_3 = (Db3, Ab3, F4), (Db3, F3, Db4), (Db3, Ab3, Db4, F4)
Eb_1, Eb_2 = (Eb3, G3, Bb3), (Eb3, Bb3, G4)
Fm_1, Fm_2, Fm_3 = (F2, C3, Ab3), (F2, Ab3, C4), (F3, Ab3, C4)

# ---- the sounds on screen: soft, low, one at a time, each made here, on the effects bus
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _hump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _thud(n, f, d):
    x = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.1 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015)
def basket(s, g=0.009, pan=0.0):
    """a workman's basket of rubble set down: a dull, soft landing and a little grit settling"""
    n = int(0.32 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 95, 0.035) + 0.35 * filt(noise(0.34)[:n], 'band', (250, 1100)) * _hump(x, 0.22, 1.4), s, g, pan, 1200)
def rope(s, sec=1.4, g=0.006, pan=0.0):
    """a measuring rope pulled taut over the ground: a soft, fibrous rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (220, 900)) * _hump(x, sec, 1.2) * (0.5 + 0.5 * gr), s, g, pan, 1100)
def clay(s, g=0.012, pan=0.0):
    """a clay tablet set down on wood: a soft, dull knock"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    _fx(np.sin(2 * np.pi * 190 * x) * np.exp(-x * 40) + 0.35 * filt(noise(0.22)[:n], 'band', (250, 900)) * np.exp(-x * 55), s, g, pan, 1200)
def brick(s, g=0.012, pan=0.0):
    """a mud brick set down and pressed with the king's stamp: a low thud, then the stamp's short, damp press"""
    n = int(0.45 * SR); x = np.arange(n) / SR
    sig = _thud(n, 85, 0.04) + 0.25 * filt(noise(0.47)[:n], 'band', (200, 800)) * np.exp(-x / 0.03)
    k = int(0.22 * SR); sig[k:] += 0.5 * filt(noise(0.25)[:n - k], 'band', (300, 1100)) * _hump(x[:n - k], 0.12, 2)
    _fx(sig, s, g, pan, 1100)
def pin(s, g=0.006, pan=0.0):
    """a note pinned to the wall: a soft flap of paper, and the small press of its pin"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.19)[:n], 'band', (420, 1700)) * _hump(x, 0.06) * (x < 0.06)
    _fx(fl + 0.5 * _thud(n, 180, 0.014) * (x >= 0.07), s, g, pan, 1800)
def clip(s, g=0.006, pan=0.0):
    """a source clipped to a note: two small, muffled clicks"""
    s_tap(s, g * FX, pan); s_knock(s + 0.04, g * 0.5 * FX, pan, 420)
def glass(s, g=0.006, pan=0.0):
    """a note turning to glass: one soft glass knock, low, a short ring, nothing bright"""
    n = int(0.5 * SR); x = np.arange(n) / SR
    sig = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x / d) for f, a, d in ((620, 1.0, 0.16), (1290, 0.35, 0.08), (1870, 0.12, 0.05)))
    _fx(sig * np.minimum(1, x / 0.002) + 0.2 * _thud(n, 300, 0.01), s, g, pan, 2000)
def hush(s, sec=1.4, g=0.004, pan=0.0):
    """many small things coming in at once (sources clipped on, notes multiplying, panels turning down): one soft hush that swells
    and fades, never a burst of taps"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1400)) * _hump(x, sec, 1.6), s, g, pan, 1500)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """paper, softly: a sheet or a card coming in"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (250, 2000)) * _hump(x, sec, 2), s, g, pan, 2000)
def pencil(s, sec=0.6, g=0.005, pan=0.0, k=3):
    """a pen on paper, a stroke at a time"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 50)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (600, 1900)) * _hump(x, d, 0.7) * (0.35 + 0.65 * gr), t, g, pan, 2000)
def tick(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pencil(s, 0.22, g, pan, 2)
def strike(s, g=0.006, pan=0.0, sec=0.4):
    """a line struck through: a pen drawn quickly"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (450, 1800)) * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g, pan, 1900)
def drag(s, sec=1.2, g=0.005, pan=0.0):
    """a line drawn across: a slow, dry drag"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (350, 1300)) * _hump(x, sec, 1.0), s, g, pan, 1500)
def knock(s, g=0.010, pan=0.0, f=240):
    """a soft wooden knock, for a card or a window arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.008, pan=0.0):
    """a muffled key, or a tag set in place"""
    s_tap(s, g * FX, pan)
def lock(s, g=0.009, pan=0.0):
    """a lock closed on a switch: a click and a low knock"""
    s_tap(s, g * FX, pan); s_knock(s + 0.05, g * 0.7 * FX, pan, 180)
def air(s, sec=0.9, g=0.008, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)


# 1. An old foundation: the opening, a chord or a note to each picture. Babylon before dawn, the ruin carried away: A flat, low, and the
#    workmen's baskets; E flat for the tower's name, a low A flat as it's cleared down to its foundation. A god's house where the gods
#    had set it: D flat; a mistake, the tower off its place: F minor, and clay for the millions of bricks; the two questions, a single
#    note each, left open. The specialists: A flat, and the measuring rope pulled taut; a key as the site is measured. The form a
#    thousand years old: a clay tablet set down, D flat, and E flat for "over a thousand years"; Ur on its map: a tablet, and a high C.
#    The king asks the gods: the film's figure, the D flat hanging until the two lowest voices come in at "to confirm", and the C at rest.
#    The first brick, pressed with his stamp, and A flat as his words come in; the tower rising on the exact spot: A flat, wide, and
#    air; a key for its ninety metres; his people's god at home: E flat, then A flat. The present: a knock and a note for the new
#    service, the models and the utility's documents; the two lowest voices for the people who decide; and under the title, the mark
K = 'found'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(0.3, 2.6, 0.007, 0.0)
chord(Ab_1, 0.6, 0.9, 0.18, 4.4)
basket(2.4, 0.008, px(700)); basket(5.2, 0.007, px(560))
fp(Eb4, w('city', 'temple-tower', -0.2), 0.75, 1.8, px(960))
fp(Ab2, w('city', 'down to its foundation', 0.25), 0.8, 2.2)
chord(Db_1, w('belong', "a god's house", -0.2), 0.85, 0.15, 3.6)
chord(Fm_1, w('fixed', 'A mistake', -0.1), 0.85, 0.15, 3.4)
clay(w('fixed', 'millions of bricks', -0.3), 0.010, px(960))
fp(F4, w('need', 'exactly where', -0.3), 0.7, 1.5, px(620) * 0.4)
fp(Db4, w('need', 'how big', -0.3), 0.7, 1.5, px(1300) * 0.4)
tIn = w('inspect', 'inspected', -0.2)
chord(Ab_2, tIn, 0.85, 0.14, 3.2); rope(tIn + 0.2, 1.4, 0.006, px(1300))
tap(w('inspect', 'measured', -0.2), 0.007, px(960))
clay(wc('form', -0.1), 0.012, px(540))
chord(Db_2, w('form', 'A stepped tower', -0.2), 0.8, 0.15, 3.0)
fp(Eb4, w('form', 'over a thousand years', -0.3), 0.7, 1.8, px(540) * 0.4)
clay(wc('ur', -0.3), 0.011, px(1380)); fp(C5, w('ur', 'At Ur', 0.2), 0.62, 2.0, px(1380) * 0.4)
figure(w('gods', 'asked the gods', -0.2), w('gods', 'to confirm', -0.2), 0.95)
brick(w('socle', 'set its foundation', 0.15), 0.012, px(960))
chord(Ab_6, w('socle', 'in his words', -0.2), 0.75, 0.14, 2.8)
tRo = wc('rose', -0.3)
air(tRo, 3.0, 0.007, 0.0); chord(Ab_3, tRo, 0.85, 0.16, 4.4)
tap(w('rose', 'ninety metres', -0.3), 0.007, px(960))
chord(Eb_1, wc('home', 0.1), 0.72, 0.14, 1.9)
chord(Ab_4, w('home', 'belonged', -0.2), 0.8, 0.14, 2.6)
tS = wc('now', 0.3)
knock(tS, 0.009, 0.0); fp(C4, tS, 0.68, 1.5)
tK = w('now', 'industry already knows', -0.3)
knock(tK, 0.008, px(390)); fp(Eb4, tK, 0.64, 1.5, px(390) * 0.4)
tH = w('now', 'utility already has', -0.3)
paper(tH, 0.010, px(1540)); fp(Ab3, tH, 0.64, 1.7, px(1540) * 0.4)
tP = w('confirm', 'the people who decide', -0.3)
hum(Ab2, tP, tP + 2.6, 0.9); hum(Eb3, tP + 0.14, tP + 2.6, 0.85)
tick(w('confirm', 'confirm it'), 0.005, px(1160))
mark(wc('breath', 0.6), 0.95)

# 2. What do you do?: paper for the government's letter and a key for each of its lines. The street at noon: air, and E flat as its
#    power flows; F minor as the panels turn themselves down, one soft hush for all seven, and a key for the homes that lose power. A key
#    for Farah's words. The battery set on the street, and D flat as it gives back the noon power in the evening. A new service needs a
#    design: A flat, and a knock for each of its four parts. The last service's workshops: paper, a pin for each question, a hush as
#    the notes multiply; F minor, low, for its eight months, and a low note as the households wait a year. Twelve weeks: a hush for
#    the weeks, a key for "no room", paper for the two pages, a stroke through the blank one, a tick and A flat for something to react to
K = 'ask'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
paper(S0(K) + 0.6, 0.012, px(1050))
for word in ('a plan', 'three suburbs', 'twelve weeks'):
    tap(w('gov', word, -0.2), 0.006, px(1050))
tap(w('gov', 'owns the utility', -0.3), 0.006, px(1050))
air(wc('noon', -0.5), 1.6, 0.008, 0.0)
chord(Eb_2, w('noon', 'at noon', -0.2), 0.72, 0.15, 2.4)
tDn = w('down', 'turn themselves down', -0.2)
chord(Fm_2, tDn, 0.78, 0.15, 2.8); hush(tDn, 1.4, 0.004, 0.0)
tap(w('down', 'on sunny days', -0.3), 0.007, 0.0)
tap(w('farah', 'hears it', -0.3), 0.007, px(1360))
knock(w('battery', 'one large battery', -0.3), 0.010, px(960), 200)
chord(Db_2, w('battery', 'for the evening', -0.3), 0.78, 0.15, 2.6)
chord(Ab_5, wc('design', -0.1), 0.72, 0.13, 2.2)
for i, word in enumerate(('what the utility', 'the steps', 'who does each', 'what each must')):
    knock(w('design', word, -0.3), 0.008, px(340 + i * 420))
paper(wc('last', -0.3), 0.012, px(690))
pin(w('last', 'what do you do', -0.3), 0.006, px(470)); pin(w('last', 'how do you work', -0.3), 0.006, px(900))
knock(w('last', 'night tariff', -0.4), 0.008, px(1530))
hush(wc('stalled', 0.4), 2.6, 0.003, px(690))
chord(Fm_1, w('stalled', 'eight months', -0.3), 0.8, 0.15, 3.0)
fp(F2, w('stalled', 'waited a year', -0.3), 0.75, 1.8)
hush(wc('need', -0.3), 1.2, 0.003, px(800))
tap(w('need', 'no room', -0.3), 0.007, px(800))
tPn = w('need', 'People need', -0.3)
paper(tPn, 0.011, px(620)); paper(tPn + 0.2, 0.010, px(1300))
strike(w('need', 'blank page', -0.3), 0.006, px(860))
tRt = w('need', 'react to', -0.3)
tick(tRt, 0.005, px(1540)); chord(Ab_4, tRt, 0.78, 0.14, 2.6)

# 3. A first draft: Tomás's request: a key, and A flat as the draft is asked for. A knock for each reference model, paper for each of
#    the utility's documents. The draft pinned up: a pin and one fortepiano note for each kind of element as the voice names it, rising
#    (capabilities, the value stream, the processes, the information, the rules). Fifty-eight, each a draft: a hush, and the D flat over
#    A flat, left hanging, unconfirmed. Reacting to a draft: paper for the two pages, a pen as the draft is marked, a key for the answer;
#    and A flat, soft, as the workshops start from the draft
K = 'draft'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tap(w('agent', 'asks', -0.3), 0.006, px(760))
chord(Ab_2, w('agent', 'first draft', -0.3), 0.75, 0.14, 2.4)
for word, y in (('CIM', 140), ("the IEC's list", 322), ('market role model', 504)):
    knock(w('models', word, -0.3), 0.008, px(590), 230)
for word in ("government's request", "network's procedures", 'product rules', 'the map itself'):
    paper(w('docs', word, -0.3), 0.009, px(1600), 0.35)
for (word, off), m, x in zip((('capabilities', -0.2), ('value stream', -0.2), ('processes', -0.2), ('information', -0.2), ('each uses', 0.5)),
                             (Ab3, C4, Eb4, F4, Ab4), (480, 900, 1300, 1650, 1700)):
    t0 = w('two', word, off); pin(t0, 0.005, px(x)); fp(m, t0, 0.62, 2.2 if word != 'each uses' else 1.1, px(x) * 0.4)
tCt = w('count', 'each one a draft', -0.1)
hush(wc('count', -0.1), 1.6, 0.003, 0.0)
fp(Ab3, tCt, 0.6, 2.0); fp(Db4, tCt + 0.14, 0.62, 1.86)
paper(wc('react', -0.1), 0.010, px(620)); paper(wc('react', 0.1), 0.010, px(1300))
pencil(w('react', 'faster', -0.2), 2.4, 0.004, px(1300), 5)
tap(w('react', 'faster', 1.0), 0.006, px(960))
tSt = wc('start', -0.2)
tap(tSt, 0.006, px(860)); chord(Ab_5, tSt + 0.1, 0.68, 0.14, 2.2)

# 4. Where each came from: a source clipped to every note (one clip, then a hush for the rest); a knock as each example's source
#    comes in under the wall; a key for each owner as they're named, and A flat, low and open, for the guess (no source says it), then
#    the low F under it, unconfirmed; and a pen as each owner checks every line against its source, with C, soft
K = 'source'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tE = wc('each', -0.1)
clip(tE, 0.006, px(500)); hush(tE + 0.1, 1.4, 0.003, 0.0)
for word, lid in (('Running the battery', 'ex'), ('the battery, as information', 'ex'), ('Crediting', 'bill')):
    knock(w(lid, word, -0.3), 0.007, px(860), 230)
tGs = w('guess', 'marked as a guess', -0.3)
strike(w('guess', 'who decides', -0.3) + 0.1, 0.004, px(860))
fp(F3, tGs, 0.68, 2.0); fp(Ab3, tGs + 0.14, 0.6, 1.86)
for word in ('Grace', 'head of retail', 'Ama'):
    tap(w('owner', word, -0.3), 0.007, px(960))
tCk = w('check', 'check every line', -0.2)
pencil(tCk, 1.6, 0.004, px(960), 4); fp(C4, tCk + 0.2, 0.6, 1.8); fp(Eb4, tCk + 0.34, 0.55, 1.66)

# 5. What's missing, what's wrong: air as a tidy draft's sheen crosses the wall; a key for "nod through"; a stroke through "is it
#    right?" and a key for each of the two questions. Ama finds what's wrong: F minor; a slow drag as the step crosses the wall, and the
#    low F as it's named; a tick for each source, right on its own. The fix: paper for the decision, a pen as the step is redrawn, a pin
#    for the network's new offer, and A flat. Grace finds what's missing: D flat, and a knock for the card; a lock as each source is
#    switched off; a knock for the battery on the street, and a low D flat for the new source the draft never switched off; paper for the
#    procedures written before batteries; and Grace's step, pinned, with C and A flat
K = 'review'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(wc('risk'), 3.0, 0.006, 0.0)
tap(w('risk', 'nod through', -0.3), 0.006, 0.0)
strike(w('ask', "whether it's right", 0.2), 0.006, px(560))
tap(w('ask', "what's missing", -0.3), 0.006, px(900)); tap(w('ask', "what's wrong", -0.3), 0.006, px(1220))
chord(Fm_3, wc('ama', -0.1), 0.75, 0.15, 2.6)
drag(w('ama', "network's list", -0.2), 1.2, 0.005, px(488))
fp(F2, w('join', 'crossed the wall', -0.3), 0.75, 2.0)
tJo = w('join', 'right on its own', -0.3)
tick(tJo, 0.004, px(860)); tick(tJo + 0.3, 0.004, px(1260))
paper(wc('fix', 0.4), 0.010, px(860))
pencil(w('fix', 'each retailer invites', -0.2), 1.0, 0.004, px(886), 3)
tNn = w('fix', 'every retailer on', -0.3)
pin(tNn + 0.2, 0.006, px(1284)); chord(Ab_2, tNn + 0.2, 0.75, 0.14, 2.6)
tGr = wc('grace', -0.1)
chord(Db_3, tGr, 0.72, 0.13, 2.4)
knock(w('grace', 'Before a crew', -0.4), 0.009, px(960), 210)
lock(w('grace', 'switched off and locked', -0.3), 0.008, px(700))
knock(wc('feed', -0.3), 0.008, px(1250), 190)
fp(Db3, w('feed', 'new source', -0.2), 0.72, 2.0)
paper(wc('nodoc', -0.1), 0.010, px(860))
tAd = w('nodoc', 'Grace adds', -0.1)
pin(tAd + 0.2, 0.006, px(886)); pencil(tAd + 0.4, 0.6, 0.004, px(886), 3)
fp(C4, tAd + 0.2, 0.62, 1.9); fp(Ab4, tAd + 0.34, 0.55, 1.76)

# 6. Only what's confirmed: as each owner confirms their part, their notes turn to glass, one soft glass knock for each owner's sweep:
#    the voices come in, A flat for the network's, E flat for retail's, and the fortepiano's C for the rules. A stroke through
#    "confirm" beside the agent, which never confirms. What an owner corrects: a pen as the agent drafts it again, a glass knock and a
#    low voice as they confirm it; a stroke through what they strike out, and air as it leaves the map. Five weeks: a knock for the
#    tally, a key for each of its rows. The model: the voices, with A flat spread under them; a key for the plan, to the government
K = 'confirm'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
t0 = w('owners', 'confirms their part', -0.3)
for d, x in ((0.0, 700), (1.0, 1180), (2.0, 1500)):
    glass(t0 + d + 0.3, 0.006, px(x))
hum(Ab2, t0, t0 + 4.2, 0.9); hum(Eb3, t0 + 1.0, t0 + 4.2, 0.85); fp(C4, t0 + 2.0, 0.62, 2.2)
strike(w('never', 'never confirms', 0.1), 0.006, px(1400))
pencil(w('again', 'corrects', -0.1), 1.0, 0.004, px(886), 3)
tFc = w('again', 'for them to confirm', -0.1)
glass(tFc + 0.3, 0.006, px(886)); hum(Ab2, tFc, tFc + 2.2, 0.85)
strike(w('again', 'strike out', -0.2), 0.006, px(1682))
air(w('again', 'leaves the map', -0.1), 1.0, 0.006, px(1682))
knock(wc('weeks', -0.2), 0.009, px(960))
for word in ('forty-one', 'nine corrected', 'eight struck out', 'four added'):
    tap(w('weeks', word, -0.3), 0.006, px(960))
tMo = w('model', 'becomes the model', -0.3)
hum(Ab2, tMo - 0.2, tMo + 3.0, 0.9); hum(Eb3, tMo - 0.06, tMo + 3.0, 0.85); chord(Ab_4, tMo, 0.72, 0.14, 2.8)
tap(max(w('plan', 'reaches the government', -0.3), wc('plan', 0.25)), 0.006, px(700))

# 7. Back to the old foundation: Babylon on the left, A flat as it comes back; a tick and the two lowest voices for "the place,
#    confirmed"; a clay tablet for the king's own words. The utility on the right: a knock for its design, a key for each of what the
#    plan started from, and C with the two lowest voices for only what the owners confirmed; a key for five weeks. Next summer: air as
#    the street comes in, and D flat as its homes store their noon power; a key for the wall nothing crossed. Then the film's figure,
#    once more, in the pause: the D flat hanging over Babylon and the utility side by side, until the voices, three of them now, come in
K = 'back'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
chord(Ab_6, S0(K) + 0.5, 0.75, 0.15, 2.6)
tKc = w('king', 'confirmed', -0.2)
tick(tKc, 0.005, px(318)); hum(Ab2, tKc, tKc + 2.0, 0.85); hum(Eb3, tKc + 0.12, tKc + 2.0, 0.8)
clay(w('called', 'the one who examines', -0.3), 0.011, px(450))
knock(wc('utility', -0.3), 0.009, px(1300))
tap(w('utility', "industry's models", -0.3), 0.006, px(1200)); tap(w('utility', 'own documents', -0.3), 0.006, px(1630))
tOw = w('utility', 'only what the owners', -0.3)
tick(tOw, 0.005, px(1180)); fp(C4, tOw, 0.6, 2.0, px(1180) * 0.4); hum(Ab2, tOw + 0.3, tOw + 2.4, 0.85); hum(Eb3, tOw + 0.42, tOw + 2.4, 0.8)
tap(wc('weeks', -0.2), 0.006, px(1412))
air(wc('summer', -0.3), 1.4, 0.007, px(1420))
chord(Db_1, w('summer', 'Next summer', -0.2), 0.72, 0.15, 2.6)
tap(wc('wall', -0.2), 0.006, px(1420))
tFg = END('back', 'wall') + 0.4
figure(tFg, max(tFg + 1.6, wc('breath', -0.4)), 0.92, more=True)

# 8. A first draft, not a blank page: paper as the answer's note comes in, and a pen as it's written; under the end card, without
#    words, the series' mark
K = 'end'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tA = wc('answer')
paper(tA + 0.2, 0.012, px(960)); pencil(tA + 0.5, 6.0, 0.004, px(960), 12)
mark(wc('breath', 0.3), 0.95, hold=3.0)

_pure()
