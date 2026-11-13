# One solution, end to end: the music and sounds, played by tools/audio.py with From words to data's helpers
# (shared/tools/music.py). The series' palettes: /mnt/project-files/enterprise-architecture/new-architecture-series/palettes.md, this
# film's row reserved on 12 November 2026. A tenor recorder and a cittern, both made here (music.py has neither):
#  - The lead: a tenor recorder, the wooden duct flute of the consort of 1600, low in its range (C 4 to C 5). The breath goes through a
#    fixed windway onto the edge, so its tone is nearly a pure tone: the first harmonic strong, the third next, the second weak, a breath
#    of air under it; as each note is tongued, a small chiff, the edge speaking its octave for a moment before the note settles. Woody
#    and breathy, its top kept soft, every note held at one level, no vibrato. Kept apart from One word, one home's recorders (a consort
#    over a marimba) and People and groups' square bass recorder (with a VCS3): this is one tenor, tongued, with a cittern and no pads
#    under it; and from The map before the data's soft flute over nylon plucks by its chiff and its wood.
#  - The partner: a cittern, the small wire-strung lute of 1600, plucked with a quill: in its middle notes only (G 3 to D 5), short and
#    bright, a single note or a light chord, damped by the hand after half a second or so. Kept apart from Decades in the making's
#    cittern (chords rolled and left to ring two seconds, with a serpent): this one is damped short, its pair of strings struck as one,
#    its small body lifting near 330 and 760 Hz, and it plays with a recorder.
#  - Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road. The road is heard
#    as feet and a pack horse's hooves, far off and soft, paper, and a board set down.
# The series' mark, the relay, in E flat: the recorder plays E flat, F and B flat rising and lets the B flat go as the cittern takes it
# an octave down and carries it to E flat; under the title and under the end card. The film's own figure, the parts: one short tune
# shared between the two, a note each in turn, so neither part is the tune without the other (the cittern had its own part-book in
# Morley's First Booke of Consort Lessons, 1599, each player reading only their part of a whole written first). Whole where the officials
# plan the journey end to end; each part alone and out of step where three teams start three pieces nobody has joined, and again where
# billing's vendor and the data team each start their own; whole again at the end, as each solution is planned end to end. E flat major;
# C minor and G minor for what goes wrong (the procession unannounced, too few porters; the three pieces; two lists; the first option's
# fails; the answers late). Every chord is tuned pure from E flat (just intonation, see hz()): E flat, A flat and B flat major and C and
# G minor are pure in this table; F minor is not, and no chord puts F with C or A flat. No chapter is urgent: nothing pulses.
# The rules the films keep (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: every note held at one level, with no vibrato, and let go.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/scenes.js, and
#    panned to where it is drawn. Everything soft: the recorder and the cittern below about 2.3 kHz, the effects below about 2.2 kHz
#    and well under the music.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word is missing; here that stops the mix, so a typo can't move a sound
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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1599)  # this film's own randomness: the room, the breath, the feet, the hooves and the paper


# a small room of wood and plaster round the two players, ringing on for about eight tenths of a second. Its level is set by what it
# rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, so held notes
# keep their level (held.py)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds)"""
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


# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _thud(n, f, d, at=0.0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone, a duller one above it, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.6 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.002) * k
def _moving(sig, s, g, pan0, pan1, k=4):
    """a sound moving across: overlapping pieces, each faded in and out, each panned a little further along"""
    n = len(sig); e = int(0.03 * SR)
    for i in range(k):
        a, b = max(0, i * n // k - e), min(n, (i + 1) * n // k + e); m = b - a; w = np.ones(m, np.float32)
        if a > 0: w[:2 * e] = np.linspace(0, 1, 2 * e)
        if b < n: w[-2 * e:] = np.linspace(1, 0, 2 * e)
        X(sig[a:b] * w, s + a / SR, g * FX, pan0 + (pan1 - pan0) * (i + 0.5) / k)
def _texture(sig, s, g, pan, pan1, top):
    if pan1 is None:
        _fx(sig, s, g, pan, top)
    else:
        _moving(norm(filt(np.asarray(sig, np.float32), 'low', top)).astype(np.float32), s, g, pan, pan1)

def sheet(s, g=0.0042, pan=0.0):
    """a notice, a card or a page laid down: a short breath of paper, and its faint landing"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.22)[:n], 'band', (300, 1500)) * _bump(x, 0.09, 1.6) * (x < 0.09)
    _fx(fl + 0.5 * _thud(n, 150, 0.02, 0.08) / 1.3, s, g, pan, 1600)
def tick(s, g=0.0025, pan=0.0):
    """something small set in place: one soft tick of wood"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1150)) * np.exp(-x / 0.006) * 0.6 + 0.7 * _thud(n, 247, 0.011), s, g, pan, 1500)
def knock(s, g=0.0038, pan=0.0):
    """a soft knock, once: something that goes wrong, or is struck out, without a beep"""
    n = int(0.2 * SR)
    _fx(_thud(n, 131, 0.03), s, g, pan, 1200)
def board(s, g=0.0042, pan=0.0):
    """a wooden board set up at the inn: a low knock of wood, with a little of the wood's own sound after it"""
    n = int(0.32 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 104, 0.045) + 0.5 * _thud(n, 156, 0.02, 0.05) + 0.18 * filt(noise(0.34)[:n], 'band', (200, 900)) * np.exp(-x / 0.035), s, g, pan, 1100)
def thump(s, g=0.004, pan=0.0):
    """loads set down on the road: a dull, soft thump of cloth and wood"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 88, 0.05) + 0.25 * filt(noise(0.32)[:n], 'band', (150, 600)) * np.exp(-x / 0.05), s, g, pan, 900)
def line(s, sec=0.9, g=0.0028, pan=0.0, pan1=None):
    """a line drawn, written or lit across a map or a page: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _texture(filt(noise(sec + 0.02)[:n], 'band', (220, 1150)) * _bump(x, sec, 1.4) * gr, s, g, pan, pan1, 1350)
def hatch(s, sec=1.6, g=0.0026, pan=0.0, pan1=None):
    """many things drawn at once, as one soft texture: a dry rub with a fine, even grain, swelling in and easing off; never a patter"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = 0.75 + 0.25 * np.abs(np.sin(np.pi * 7.0 * x)) ** 2
    _texture(filt(noise(sec + 0.02)[:n], 'band', (250, 1250)) * _bump(x, sec, 1.1) * gr, s, g, pan, pan1, 1450)
def whisk(s, sec=0.9, g=0.0026, pan=0.0, pan1=None):
    """a folded notice carried through the air: one soft breath of paper that rises and falls"""
    n = int(sec * SR); x = np.arange(n) / SR
    _texture(filt(noise(sec + 0.02)[:n], 'band', (350, 1400)) * _bump(x, sec, 2.2), s, g, pan, pan1, 1500)
def feet(s, sec, g=0.0026, pan=0.0, pace=1.5, pan1=None):
    """people walking on a stony road, farther off: one soft texture of steps that swells in and fades, not a patter of single steps"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.55 + 0.45 * np.abs(np.sin(np.pi * pace * x + 0.4)) ** 3
    _texture(filt(noise(sec + 0.02)[:n], 'band', (100, 600)) * beat * _bump(x, sec, 0.9), s, g, pan, pan1, 700)
def hoof(s, sec, g=0.0022, pan=0.0, pan1=None):
    """a pack horse walking on the road, farther off: its four slow, soft footfalls as one low texture, never single clops"""
    n = int(sec * SR); x = np.arange(n) / SR; ph = np.pi * 1.05 * x
    beat = 0.5 + 0.5 * (np.abs(np.sin(ph)) ** 6 + 0.7 * np.abs(np.sin(ph + 1.25)) ** 6)
    _texture(filt(noise(sec + 0.02)[:n], 'band', (80, 420)) * beat * _bump(x, sec, 0.9), s, g, pan, pan1, 500)


# ---- tuning: just intonation from E flat, so a chord's notes are whole-number ratios of each other and nothing beats. E flat, A flat
# and B flat major and C and G minor are pure in this table; F minor is not, and F is never put with C or A flat
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 63, 12)
    return 311.127 * 2 ** o * _JI[pc]
G3, Ab3, Bb3, C4, D4, Eb4, F4, G4, Ab4, Bb4, C5, D5 = 55, 56, 58, 60, 62, 63, 65, 67, 68, 70, 72, 74

LR, LT, FX = 0.066, 0.08, 5.9
LV = [1.0]

# ---- the tenor recorder. The first harmonic carries it, the third next, the second weak and the rest weaker; its wood lifts a little
# near 1.1 kHz; nothing above about 2.2 kHz. Tongued: the edge speaks its octave for a moment (the chiff) as the note starts, with a
# short breath of noise, and the note settles in a few hundredths of a second; a breath of air stays under it. Every note held at one
# level, and stopped by the tongue, with no swell and no vibrato
_RA = np.array([1.0, 0.09, 0.15, 0.035, 0.045, 0.015, 0.015, 0.007])
def _rw(f):
    n = max(1, min(len(_RA), int(2200 // f))); k = np.arange(1, n + 1); a = _RA[:n] * (1 + 0.35 * np.exp(-((f * k - 1100) / 280) ** 2))
    return a / np.sqrt((a ** 2).sum())
def rec(m, s, sec, g=1.0, pan=0.12, room=0.26, rel=0.07, until=None):
    """the recorder holds m from s for sec seconds, and the tongue stops it"""
    if until is not None:
        sec = min(sec, until - s - rel - 0.05)
    if sec <= 0.08:
        return
    f = hz(m); att = 0.03; n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for j, aj in enumerate(_rw(f)):
        k = j + 1
        sig += aj * np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.15 * (k - 1))), 1)) ** 2 * np.sin(2 * np.pi * f * k * x + 0.5 * k)
    sig += 0.28 * np.sin(2 * np.pi * 2 * f * x) * (1 - np.exp(-x / 0.003)) * np.exp(-x / 0.02)       # the chiff: the octave, a moment
    env = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    sig = sig * env / max(1e-9, float(np.abs(sig).max())); nb = min(n, int(0.04 * SR))
    sig[:nb] += 0.06 * filt(noise(0.04), 'band', (700, 2000))[:nb] * np.exp(-np.arange(nb) / SR / 0.008)   # the tongue's breath
    sig += 0.012 * filt(noise(n / SR + 0.01)[:n], 'band', (0.9 * f, min(2000, 4 * f))) * np.minimum(1, x / 0.05) * env   # air under it
    sig = _room(norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 120)), room, min(0.25, sec * 0.3), sec)
    put(_until(sig, s, until), s, g * LV[0] * LR, pan)

# ---- the cittern: wire strings, plucked with a quill near the bridge, so bright: the second to the fifth harmonics nearly as strong as
# the first. Wire rings on, its higher harmonics dying first, but the player damps it with the hand after half a second or so, so each
# note is short. Its small, flat body lifts its air near 330 Hz and its top near 760 and 1400 Hz; its pair of strings, tuned exactly
# together, are struck as one; nothing above about 2.3 kHz
_CB = [(330, 120, 0.8), (760, 220, 1.0), (1400, 380, 0.5)]
def _string(f, x, pos=0.16):
    sig = np.zeros(len(x)); d1 = 0.9 * (260 / f) ** 0.4
    for k in range(1, int(2300 // f) + 1):
        fk = f * k; dk = d1 / (1 + 0.35 * (k - 1) ** 1.2)
        a = abs(np.sin(np.pi * k * pos)) / k ** 0.7 * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in _CB) + 0.25)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.9 * k * k) * (0.35 * np.exp(-x / (0.1 * dk)) + 0.65 * np.exp(-x / dk))
    return sig
def cit(m, s, g=1.0, pan=-0.14, ring=0.5, room=0.22, until=None):
    """a note on the cittern, plucked at s and damped by the hand after ring seconds"""
    if until is not None:
        ring = min(ring, until - s - 0.12)
    if ring <= 0.06:
        return
    f = hz(m); sec = ring + 0.1; x = tt(sec).astype(np.float64)
    sig = _string(f, x) * np.minimum(1, x / 0.0015) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.08, 1)) ** 2, 1.0)
    nq = int(0.015 * SR); sig[:nq] += 0.05 * np.abs(sig).max() * filt(noise(0.015), 'band', (900, 2200))[:nq] * np.exp(-np.arange(nq) / SR / 0.0025)
    sig = _room(norm(filt(sig.astype(np.float32), 'low', 2300)), room, 0.03, ring)
    put(_until(sig, s, until), s, g * LV[0] * LT, pan)

# ---- what they play
def lchord(notes, s, g=1.0, ring=0.9, step=0.02, until=None):
    """a light chord on the cittern: the quill across two or three courses, lowest first, damped after ring seconds"""
    for i, m in enumerate(sorted(notes)):
        cit(m, s + step * i, g * (0.9 if i == 0 else 0.75), ring=ring - step * i, until=until)
def chord(s, cits, highs, g=1.0, ring=0.9, at=0.3, step=0.0):
    """a light chord on the cittern, and over it the recorder's notes one after another (highs: (note, seconds)), from at seconds after"""
    lchord(cits, s, g, ring)
    t = s + at
    for m, d in highs:
        rec(m, t, d * 0.94, 0.9 * g); t += d + step

def mark(s, g=1.0, step=0.34, until=None, hold=1.6):
    """the series' mark, in E flat: the recorder's E flat, F and B flat rising, and the cittern takes the B flat an octave down and
    carries it to E flat; the recorder lets its B flat go as the cittern takes it, as a letter handed on from station to station"""
    rec(Eb4, s, step * 0.9, g, until=until)
    rec(F4, s + step, step * 0.9, g, until=until)
    rec(Bb4, s + step * 2, step + 0.04, g, until=until)
    cit(Bb3, s + step * 3, 0.95 * g, ring=step - 0.03, until=until)
    lchord([Eb4, G4], s + step * 4, 0.95 * g, ring=hold, until=until)
    return s + step * 4

TUNE = ((0, Eb4), (1, G4), (0, Bb4), (1, Ab4), (0, G4), (1, F4), (0, Eb4))   # the parts: 0, the recorder's note; 1, the cittern's
def parts(s, step=0.32, g=1.0, only=None, lag=0.0, cstep=None, last=1.2, until=None):
    """the film's figure: one tune shared between the two, a note each in turn. only=0 or 1: that part alone, the other's notes left
    out as rests; lag and cstep: the cittern's part out of step with the recorder's (late by lag, at its own step). Whole, the cittern
    lays a light chord under the recorder's last note"""
    cstep = step if cstep is None else cstep
    for i, (who, m) in enumerate(TUNE):
        if only is not None and who != only:
            continue
        if who == 0:
            rec(m, s + step * i, last if i == len(TUNE) - 1 else step * 0.88, g, until=until)
        else:
            cit(m, s + lag + cstep * i, 0.95 * g, ring=cstep * 0.95, until=until)
    if only is None and not lag:
        lchord([Bb3, G4], s + step * (len(TUNE) - 1), 0.8 * g, ring=last, until=until)
    return s + step * len(TUNE) + last


# =============================================================================================================================
# 1. A notice sent ahead: the opening. Japan, 1635: a light chord and the recorder's first phrase as the map appears, its roads drawn;
#    Edo ringed, a tick. Every year each lord makes the journey: lines on every road, one soft texture, and A flat. The road at dusk: the
#    procession walks in from the right, feet, and B flat. Each station's porters and horses, for everyone: E flat. Three hundred,
#    unannounced, too few: C minor, a knock; its loads set down, waiting. The stations need to know: A flat to B flat. The plan: the
#    parts, whole, the recorder and the cittern a note each in turn, as the officials plan the journey end to end; the paper, a sheet,
#    each line written as it's said. The notice runs ahead to Edo, a line, and E flat. The board set up at the inn, and B flat. Porters
#    and a pack horse in from the villages, in time: feet and hooves. The procession passes on, station to station: feet. One road for
#    everyone: E flat. The utility: three pieces, a tick each; nobody has drawn how they join: the parts, each alone and out of step.
#    Sipho designs it end to end: the line lit, end to end, and A flat to E flat. The title: the mark
LV[0] = 0.9
ow = lambda lid, word, off=0: W('ahead', lid, word, off)
oc = lambda lid, off=0: G('ahead', lid, off)
END = E('ahead')
lchord([Bb3, Eb4, G4], 0.6, 0.75, ring=1.6)
for m, a, d in ((Bb4, 1.0, 0.9), (G4, 2.0, 0.45), (Ab4, 2.5, 0.45), (Bb4, 3.0, 1.6)):
    rec(m, a, d, 0.72)
line(0.8, 2.4, 0.0024, px(400), px(1600))
tick(ow('year', 'Edo', -0.2), 0.0024, px(1600))
hatch(oc('journey', -0.6), 2.0, 0.0022, px(400), px(1600))
chord(oc('journey', -0.3), [C4, Eb4, Ab4], [(C5, 1.4)], 0.65)
feet(oc('size', -0.9), 19.5, 0.0024, px(1900), 1.5, px(950))
chord(oc('size', -0.5), [Bb3, D4, F4], [(D4, 0.8), (F4, 1.4)], 0.65)
chord(ow('station', 'everyone', -0.2), [Eb4, G4, Bb4], [(G4, 0.7), (Bb4, 1.3)], 0.62)
chord(ow('problem', 'unannounced', -0.2), [C4, Eb4, G4], [(G4, 0.8), (Eb4, 1.4)], 0.65)
knock(ow('problem', 'too few', -0.1), 0.0034, px(1180))
thump(ow('wait', 'loads', -0.2), 0.0038, px(1400))
chord(ow('need', 'stations', -0.2), [Ab3, C4, Eb4], [(C5, 0.7), (Bb4, 1.3)], 0.6)
parts(oc('plan', -1.6), 0.32, 0.72)
sheet(oc('plan', -0.2), 0.004, px(440))
line(oc('plan', 0.0), 0.6, 0.002, px(440))
line(ow('list', 'who goes', -0.1), 0.6, 0.002, px(440))
for word in ('notice', 'porters', 'which day', 'rest'):
    line(ow('notice', word, -0.1), 0.5, 0.0018, px(440))
line(ow('notice', 'ahead', 0.0), 4.2, 0.0022, px(300), px(1650))
chord(ow('notice', 'ahead', 0.2), [Eb4, G4], [(Bb4, 0.7), (Eb4, 1.4)], 0.58)
board(ow('board', 'board', 0.7), 0.0042, px(840))
chord(ow('board', 'board', 0.6), [Bb3, D4], [(F4, 0.6), (D4, 1.3)], 0.58)
feet(oc('ready', 0.2), 11.0, 0.0022, px(-150), 1.6, px(330))
hoof(oc('ready', 0.65), 9.5, 0.0022, px(-150), px(250))
feet(oc('relay', -1.2), 12.6, 0.0022, px(1950), 1.5, px(1450))
chord(oc('relay', 0.3), [Ab3, Eb4], [(C5, 0.6), (Ab4, 1.2)], 0.55)
feet(oc('shared', -2.4), 6.8, 0.0016, px(-150), 1.7, px(250))
chord(ow('shared', 'each journey', -0.2), [G3, Bb3, Eb4], [(Bb4, 0.6), (G4, 1.4)], 0.6)
for i, x in enumerate((795, 1275, 1670)):
    tick(oc('one', 0.1 + i * 0.35), 0.0022, px(x))
line(ow('one', 'nobody', -0.2), 1.6, 0.0022, px(1000), px(1600))
parts(ow('one', 'nobody', 0.3), 0.32, 0.6, lag=0.17, cstep=0.41, last=0.5)
line(ow('sipho', 'end to end', -0.4), 2.2, 0.0024, px(600), px(1650))
tick(ow('sipho', 'platform', -0.3), 0.0022, px(1000))
chord(ow('sipho', 'end to end', 0.6), [Ab3, C4, Eb4], [(Eb4, 0.7), (G4, 1.4)], 0.58)
t_ = mark(oc('breath', 1.0), 0.72, until=END, hold=1.4)
rec(G4, t_ + 0.35, 1.5, 0.5, until=END)

# 2. Three pieces: the government's direction, a sheet. The agency, a tick. Billing's vendor's piece, a tick, and the cittern's part
#    alone; the data team's table, a tick and its drop, and the recorder's part alone, out of step; IT's server, a tick. Two lists,
#    a knock; the joins nobody has drawn, a line, and C minor. The ticket, a sheet, and B flat to E flat
LV[0] = 0.9
pw = lambda lid, word, off=0: W('pieces', lid, word, off)
pc = lambda lid, off=0: G('pieces', lid, off)
sheet(S0('pieces') + 0.3, 0.004, px(960))
tick(pc('agency', -0.3), 0.0022, px(280))
tick(pc('vendor', -0.2), 0.0022, px(795))
parts(pw('vendor', 'offers', 0.0), 0.34, 0.6, only=1)
tick(pc('table', -0.3), 0.0022, px(1275))
tick(pc('table', 0.75), 0.002, px(1275))
parts(pw('table', 'table', 0.3), 0.42, 0.6, only=0, last=0.6)
tick(pc('server', -0.2), 0.0022, px(1670))
knock(pw('two', 'two lists', -0.2), 0.0034, px(1000))
line(pw('two', 'nobody', -0.2), 1.6, 0.0022, px(1000), px(1600))
chord(pw('two', 'nobody', 0.0), [C4, G4], [(Eb4, 0.8), (C4, 1.4)], 0.6)
sheet(pc('ticket', -0.3), 0.0042, px(890))
tick(pw('ticket', 'retail', -0.1), 0.002, px(890))
chord(pc('ticket', 0.2), [Bb3, D4, F4], [(F4, 0.6), (Eb4, 1.2)], 0.55)

# 3. Three architects: the ticket goes to Sipho, a line. What each looks after, a tick each. The rule between them: what every team
#    could use goes into the platform, a line; what would change the map goes to Tomás first, a line. As on the Tōkaidō: the strip of
#    road, a line, and A flat to E flat
LV[0] = 0.9
hw = lambda lid, word, off=0: W('three', lid, word, off)
hc = lambda lid, off=0: G('three', lid, off)
line(S0('three') + 0.5, 1.4, 0.002, px(890), px(300))
tick(hw('tomas', 'keeps', -0.3), 0.0022, px(640))
tick(hw('ravi', 'builds', -0.3), 0.0022, px(1050))
tick(hw('sipho', 'designs', -0.3), 0.0022, px(230))
chord(hw('sipho', 'end to end', -0.1), [Eb4, G4, Bb4], [(Bb4, 1.4)], 0.55)
line(hw('rule', 'every team', -0.1), 0.5, 0.002, px(1450))
line(hw('rule', 'change the map', -0.1), 0.5, 0.002, px(1450))
line(hc('story', 0.0), 3.2, 0.0022, px(1290), px(1850))
chord(hc('story', 0.2), [Ab3, C4, Ab4], [(Eb4, 0.6), (G4, 1.4)], 0.55)

# 4. Everything it touches: the page, a sheet, and B flat. Each neighbour, a tick, as it's said; the letter and the bill. In the
#    middle, the solution, and E flat; the platform under it, a tick. Out of scope, dashed, a line. Fixed: the three rules, a tick
LV[0] = 0.9
cw = lambda lid, word, off=0: W('context', lid, word, off)
cc = lambda lid, off=0: G('context', lid, off)
sheet(S0('context') + 0.3, 0.0038, px(1190))
chord(S0('context') + 0.5, [Bb3, F4], [(D4, 0.7), (F4, 1.3)], 0.55)
for word, x in (('agency', 720), ('customer system', 1670), ('billing', 1690), ('call centre', 1670), ('households', 720)):
    tick(cw('around', word, -0.2), 0.002, px(x))
tick(cw('around', 'letter', -0.2), 0.0018, px(780))
tick(cw('around', 'a bill', -0.2), 0.0018, px(900))
chord(cc('middle', -0.1), [G3, Bb3, Eb4], [(G4, 0.6), (Eb4, 1.3)], 0.55)
tick(cw('middle', 'platform', -0.3), 0.002, px(1190))
line(cw('out', 'tenants', -0.2), 0.7, 0.002, px(1190))
tick(cw('fixed', 'rules', -0.3), 0.002, px(1180))

# 5. Three qualities, measured: the nine qualities a standard lists, one soft texture; the three that matter, a tick. Each measure, a
#    card, a sheet. Speed hardly matters, a tick
LV[0] = 0.9
qw = lambda lid, word, off=0: W('quality', lid, word, off)
qc = lambda lid, off=0: G('quality', lid, off)
chord(S0('quality') + 0.4, [Ab3, C4, Eb4], [(Ab4, 1.4)], 0.5)
hatch(qc('nine', -0.3), 1.4, 0.0022, px(760), px(1640))
tick(qw('nine', 'picks', 0.0), 0.0022, px(1200))
chord(qw('nine', 'picks', 0.1), [Bb3, Eb4, G4], [(Bb4, 0.6), (G4, 1.2)], 0.5)
for lid, x in (('sec', 760), ('rel', 1200), ('change', 1640)):
    sheet(qc(lid, -0.2), 0.0036, px(x))
tick(qc('speed', 0.2), 0.002, px(1200))

# 6. Two options: the table of measures, a sheet, and E flat. The first, inside billing: billing, a tick; its fails, a knock each, and
#    C minor. The second: the platform, a tick; the answers, a tick; billing's ask runs up to the answers and back, a line. Its marks,
#    a tick each, and B flat to E flat. Its risk, a knock; handled, a tick, and E flat
LV[0] = 0.9
xw = lambda lid, word, off=0: W('options', lid, word, off)
xc = lambda lid, off=0: G('options', lid, off)
sheet(S0('options') + 0.3, 0.0036, px(1600))
chord(S0('options') + 0.5, [Eb4, G4, Bb4], [(G4, 0.7), (Eb4, 1.3)], 0.5)
tick(xw('first', 'billing', -0.1), 0.002, px(1069))
for word, y in (('reads it', 548), ('waits', 608), ('October', 668)):
    knock(xw('fails', word, -0.1), 0.003, px(1069))
chord(xw('fails', 'October', 0.4), [C4, Eb4, G4], [(C4, 1.5)], 0.55)
tick(xw('second', 'platform', -0.3), 0.002, px(1056))
tick(xw('second', 'answers', -0.2), 0.002, px(1195))
line(xw('asks', 'asks', 0.2), 1.8, 0.002, px(1036), px(1195))
for word in ('logs', 'pull request', 'May'):
    tick(xw('holds', word, 0.0), 0.002, px(1300))
chord(xw('holds', 'May', 0.3), [Bb3, D4, F4], [(Bb4, 0.6), (F4, 1.2)], 0.5)
knock(xw('risk', 'depends', -0.1), 0.0028, px(1060))
tick(xw('risk', 'day before', -0.2), 0.002, px(1060))
tick(xw('risk', 'keeps', 0.0), 0.002, px(1788))
chord(xw('risk', 'keeps', 0.3), [G3, Eb4, G4], [(Bb4, 1.4)], 0.5)

# 7. Why, written down: the record, a sheet, and A flat; kept with the code, a tick. Each row written as it's said, a line. Ama, a
#    tick; the principles, a line each; both hold, a tick, and E flat. Agreed, a tick for each; accepted, a tick, and B flat to E flat.
#    A year on, the answer lit, a line
LV[0] = 0.9
rw = lambda lid, word, off=0: W('record', lid, word, off)
rc = lambda lid, off=0: G('record', lid, off)
sheet(S0('record') + 0.3, 0.0038, px(1200))
chord(S0('record') + 0.5, [Ab3, C4, Eb4], [(C5, 0.6), (Ab4, 1.3)], 0.5)
tick(rw('writes', 'code', -0.2), 0.0018, px(1700))
for lid, word in (('decided', 'Decided'), ('decided', 'Considered'), ('why', 'Why'), ('why', 'consequence')):
    line(rw(lid, word, 0.1), 1.4, 0.0016, px(1100))
tick(rw('check', 'Ama', -0.2), 0.002, px(1750))
for word in ('use what', 'customer information'):
    line(rw('check', word, -0.1), 0.8, 0.0016, px(1100))
tick(rw('check', 'Both hold', 0.0), 0.0022, px(1300))
chord(rw('check', 'Both hold', 0.2), [G3, Bb3, Eb4], [(Eb4, 0.6), (Bb4, 1.3)], 0.5)
for word, x in (('Sipho', 640), ('Ravi', 780), ('head of retail', 980)):
    tick(rw('agreed', word, -0.1), 0.0018, px(x))
tick(rw('agreed', 'accepted', -0.1), 0.0022, px(790))
chord(rw('agreed', 'accepted', 0.3), [Bb3, D4], [(F4, 0.5), (Eb4, 1.4)], 0.5)
line(rc('later', -0.2), 0.9, 0.0018, px(700), px(1500))

# 8. Most of it is already there: the six, a tick each as it's said, and E flat; the four new ones, softer. Sending a file out moves
#    into the platform, a line, and lands, a tick; the platform, a tick; the regulator's reports use it next, a line, and B flat.
#    On the Tōkaidō, the stations were already there: the strip of road, a line, and A flat to E flat
LV[0] = 0.9
uw = lambda lid, word, off=0: W('reuse', lid, word, off)
uc = lambda lid, off=0: G('reuse', lid, off)
tick(uw('count', 'six', -0.3), 0.002, px(700))
chord(uw('count', 'six', 0.0), [Eb4, Bb4], [(G4, 0.6), (Bb4, 1.2)], 0.5)
for word in ('customer accounts', 'template', 'connectors', 'masks', 'gateway', 'monitoring'):
    tick(uw('six', word, -0.2), 0.0018, px(700))
for word in ('match', 'sending', 'discount', 'letter'):
    tick(uw('four', word, -0.2), 0.0015, px(1450))
tick(uw('out', 'Every team', -0.2), 0.0018, px(1530))
line(uw('out', 'Ravi', -0.1), 1.4, 0.0018, px(1450), px(1520))
tick(uw('out', 'Ravi', 1.3), 0.002, px(1530))
chord(uw('out', 'Ravi', 1.4), [Bb3, D4, F4], [(D4, 0.5), (Bb4, 1.3)], 0.5)
line(uw('out', 'use it', -0.2), 0.6, 0.0018, px(1580))
line(uc('story', 0.0), 3.2, 0.002, px(700), px(1700))
chord(uc('story', 0.3), [Ab3, Eb4], [(Ab4, 0.6), (G4, 1.4)], 0.5)

# 9. Told ahead: the design, a sheet; a notice to each team, carried through the air, and each card as it lands, a sheet; the vendor's
#    April release, a tick. As a notice went ahead to every station: the road down the teams, a line, and E flat
LV[0] = 0.9
tw = lambda lid, word, off=0: W('told', lid, word, off)
tc = lambda lid, off=0: G('told', lid, off)
sheet(S0('told') + 0.3, 0.0034, px(740))
for word in ('platform team', 'integration', 'retail', 'vendor'):
    whisk(tw('each', word, -0.6), 0.9, 0.0022, px(944), px(1176))
    sheet(tw('each', word, -0.1), 0.003, px(1520))
tick(tw('april', 'April', 0.0), 0.002, px(1520))
line(tc('story', 0.2), 3.0, 0.002, px(1140))
chord(tc('story', 0.0), [Bb3, Eb4, G4], [(Eb4, 0.6), (Bb4, 0.6), (G4, 1.2)], 0.5)

# 10. The first of July: built, a tick; tested with a sample, a tick, and B flat. The first bills, a sheet, and E flat; nine homes in
#     ten lit, one soft texture. Two days late, a knock, and C minor; August's answers used, a tick. The log, a sheet; one reader, a
#     tick. The ticket, a sheet; checked and closed, a tick, and A flat to E flat
LV[0] = 0.9
jw = lambda lid, word, off=0: W('july', lid, word, off)
jc = lambda lid, off=0: G('july', lid, off)
line(S0('july') + 0.3, 1.0, 0.0018, px(620), px(1660))
tick(jw('built', 'built', 0.1), 0.002, px(620))
tick(jw('built', 'tested', 0.1), 0.002, px(900))
chord(jw('built', 'June', 0.2), [Bb3, D4], [(F4, 0.6), (Bb4, 1.2)], 0.5)
sheet(jc('bills', -0.2), 0.0038, px(750))
hatch(jw('bills', 'nine', 0.0), 1.2, 0.002, px(566), px(935))
chord(jw('bills', 'nine', 0.2), [G3, Eb4, G4], [(Bb4, 0.6), (Eb4, 1.4)], 0.55)
knock(jc('late', 0.4), 0.003, px(1660))
chord(jc('late', 0.6), [G3, D4], [(Bb4, 0.6), (G4, 1.2)], 0.5)
tick(jw('late', 'Billing', -0.2), 0.002, px(1660))
sheet(jc('log', -0.2), 0.0034, px(1200))
tick(jw('log', 'one reader', 0.0), 0.002, px(1200))
sheet(jc('closed', -0.2), 0.0034, px(1650))
tick(jw('closed', 'closes', 0.0), 0.0022, px(1650))
chord(jw('closed', 'closes', 0.3), [Ab3, C4, Eb4], [(G4, 0.6), (Eb4, 1.5)], 0.55)

# 11. The data practice on the map: its layers, a sheet, and B flat. The new parts, one soft texture; the platform's services, one
#     soft texture, the new one a tick, and the lines serving them, a line. The work package, a sheet; to the first of July, a line and
#     a tick. Each quality a requirement, one soft texture, realised, a line: A flat to E flat
LV[0] = 0.9
aw = lambda lid, word, off=0: W('practice', lid, word, off)
ac = lambda lid, off=0: G('practice', lid, off)
sheet(ac('intro', -0.6), 0.0034, px(960))
chord(ac('intro', 0.0), [Bb3, F4], [(D4, 0.6), (Bb4, 1.3)], 0.5)
hatch(aw('app', 'new parts', -0.3), 1.0, 0.0018, px(340), px(1540))
hatch(aw('tech', 'reused', -0.4), 1.0, 0.0018, px(500), px(1100))
tick(aw('tech', 'sending', -0.2), 0.002, px(525))
line(aw('tech', 'services', 0.6), 1.2, 0.0016, px(500), px(1500))
sheet(ac('work', -0.2), 0.0032, px(840))
line(aw('work', 'July', -0.2), 0.5, 0.0016, px(1150))
tick(aw('work', 'July', 0.2), 0.002, px(1427))
hatch(aw('req', 'requirement', -0.3), 1.0, 0.0018, px(530), px(1610))
line(aw('req', 'realised', -0.2), 1.2, 0.0016, px(500), px(1500))
chord(aw('req', 'realised', 0.2), [Ab3, C4, Eb4], [(Ab4, 0.6), (G4, 1.4)], 0.5)

# 12. Each journey, planned: the road at dusk, the courier gone ahead, quick feet, and the procession from the right, feet. On the data
#     platform, each solution planned end to end: the line lit end to end, a line, and the parts, whole again. Its context, qualities,
#     options and why, a tick each; most of it already there, a tick; what's new, a tick. "Next", a tick. The end card: the mark
LV[0] = 0.9
zw = lambda lid, word, off=0: W('end', lid, word, off)
zc = lambda lid, off=0: G('end', lid, off)
feet(S0('end') + 0.1, 4.4, 0.0016, px(700), 2.6, px(0))
feet(S0('end') + 0.4, 9.6, 0.0022, px(1500), 1.5, px(1050))
line(zc('data', -0.2), 2.2, 0.0022, px(600), px(1650))
parts(zc('data', 0.1), 0.32, 0.62)
for word, x in (('context', 760), ('qualities', 1010), ('options', 1250), ('why', 1530)):
    tick(zw('data', word, -0.2), 0.0018, px(x))
tick(zc('most', -0.2), 0.0018, px(1000))
tick(zw('most', 'new', -0.3), 0.0018, px(1420))
tick(zc('next', -0.1), 0.0022, px(1210))
t_ = mark(zc('breath', 0.7), 0.68, until=TOT, hold=2.6)
rec(G4, t_ + 0.5, 2.4, 0.45, until=TOT)
