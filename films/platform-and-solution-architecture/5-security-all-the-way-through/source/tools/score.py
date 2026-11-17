# Security all the way through: the music and sounds, played by tools/audio.py with From words to data's helpers
# (shared/tools/music.py). The series' palettes: /mnt/project-files/enterprise-architecture/new-architecture-series/palettes.md, this
# film's row reserved on 12 November 2026. A crumhorn and a serpent, both made here (music.py has neither):
#  - The lead: a crumhorn, the curved reed of the 1500s whose double reed is shut inside a wind cap. The player's breath reaches the
#    reed only through the cap and the lips never touch it, so each note comes out exactly as its holes set it, at one level, and never
#    past its nine notes, since it can't be overblown: as fixed as a written pass. Played low in its range (B flat 3 to C 5), softly,
#    each note tongued, starting and stopping cleanly, no vibrato. Kept apart from Why Unity Catalog and Unity Gateway govern them's
#    crumhorn (its reed buzzing near 1 kHz, with an electric clavichord): this one's cap is larger, its buzz lower and quieter (near
#    750 Hz), its even harmonics a little stronger, so it sounds rounder, and it plays with a serpent.
#  - The partner: a serpent, the long wooden bass of about 1590, covered in leather and blown like a brass instrument, its notes set as
#    much by the player's lips as by its six holes: soft, round and a little foggy, low (B flat 1 to F 3), each note held at one level.
#    Kept apart from Decades in the making's serpent (lifted near 480 Hz, its long notes swelling once, with a cittern): this one's bore
#    lifts lower (near 360 Hz), a breath of air stays under the whole note, every note is held flat, and it plays with a crumhorn.
#  - Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road. The checkpoint
#    is heard as feet on the road, a lake, paper and a gate's wood.
# The series' mark, the relay, in B flat: the crumhorn plays B flat, C and F rising and lets the F go as the serpent takes it an octave
# down and carries it to B flat; under the title and under the end card. The film's own figure, the pass: the crumhorn plays a short
# phrase, as fixed as a written pass, and the serpent answers it note for note an octave down, as the examiner checks the woman against
# her pass; where a request has no pass of its own (who read the bank details? nobody can say), the serpent's answer stops short after
# two notes; at the end, the whole figure again, as the road stays open. B flat major; G minor and D minor for what goes wrong (the
# hostages, the fear on the roads, the side road; the one account, the key anyone could copy, the slow way; the side road at the
# utility; the keys that can't go away; the quick way that would win again). Every chord is tuned pure from B flat (just intonation,
# see hz()): B flat, E flat and F major and G and D minor are pure in this table; C minor is not, and no chord puts C with G or E flat.
# No chapter is urgent: nothing pulses.
# The rules the films keep (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: every note held at one level, with no vibrato, and let go.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/scenes.js, and
#    panned to where it is drawn. Everything soft: the crumhorn and the serpent below about 2.2 kHz, the effects below about 2.2 kHz
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
R1 = np.random.default_rng(1619)  # this film's own randomness: the room, the breath, the water, the feet and the paper


# a small panelled room round the two instruments, ringing on for about a second. Its level is set by what it rings where the notes are
# (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, so held notes keep their level (held.py)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1400); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
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

def sheet(s, g=0.0045, pan=0.0):
    """a pass, a letter or a card laid down: a short breath of paper, and its faint landing"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.22)[:n], 'band', (320, 1600)) * _bump(x, 0.085, 1.6) * (x < 0.085)
    _fx(fl + 0.5 * _thud(n, 158, 0.02, 0.075) / 1.3, s, g, pan, 1700)
def tick(s, g=0.003, pan=0.0):
    """something small set in place: one soft tick of wood"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (320, 1200)) * np.exp(-x / 0.006) * 0.6 + 0.7 * _thud(n, 262, 0.011), s, g, pan, 1500)
def knock(s, g=0.0045, pan=0.0):
    """a soft knock on the gate's wood, once: something stopped or struck out, without a beep"""
    n = int(0.2 * SR)
    _fx(_thud(n, 138, 0.03), s, g, pan, 1200)
def seal(s, g=0.0045, pan=0.0):
    """a lock closed, a store shut: a soft, low press with a little wood in it"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 112, 0.04) + 0.22 * filt(noise(0.32)[:n], 'band', (250, 1000)) * np.exp(-x / 0.03), s, g, pan, 1100)
def line(s, sec=0.9, g=0.003, pan=0.0, pan1=None):
    """a line drawn out across a map or a page: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _texture(filt(noise(sec + 0.02)[:n], 'band', (230, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, pan1, 1400)
def hatch(s, sec=1.6, g=0.0028, pan=0.0, pan1=None):
    """many fine strokes drawn at once, as one soft texture: a dry rub with a fine, even grain, swelling in and easing off; never a
    patter of single strokes"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = 0.75 + 0.25 * np.abs(np.sin(np.pi * 8.0 * x)) ** 2
    _texture(filt(noise(sec + 0.02)[:n], 'band', (260, 1300)) * _bump(x, sec, 1.1) * gr, s, g, pan, pan1, 1500)
def lake(s, sec=3.0, g=0.003, pan=0.0):
    """a still lake at the foot of a mountain, small waves on a stony shore, farther off: one soft wash that comes and goes slowly,
    never drops or a patter"""
    n = int(sec * SR); x = np.arange(n) / SR
    sw = 0.55 + 0.45 * np.sin(2 * np.pi * 0.45 * x + 0.7) ** 2
    _fx(filt(noise(sec + 0.02)[:n], 'band', (140, 900)) * sw * _bump(x, sec, 0.9), s, g, pan, 1000)
def brush(s, g=0.003, pan=0.0):
    """long hair let down: one soft brush of it, gone in half a second"""
    n = int(0.5 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.52)[:n], 'band', (400, 1800)) * _bump(x, 0.5, 1.8), s, g, pan, 1900)
def feet(s, sec, g=0.003, pan=0.0, pace=1.5, pan1=None):
    """people walking on a stony road, farther off: one soft texture of steps that swells in and fades, not a patter of single steps"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.55 + 0.45 * np.abs(np.sin(np.pi * pace * x + 0.4)) ** 3
    _texture(filt(noise(sec + 0.02)[:n], 'band', (100, 600)) * beat * _bump(x, sec, 0.9), s, g, pan, pan1, 700)


# ---- tuning: just intonation from B flat, so a chord's notes are whole-number ratios of each other and nothing beats. B flat, E flat
# and F major and G and D minor are pure in this table; C minor is not, and C is never put with G or E flat
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 58, 12)
    return 233.0819 * 2 ** o * _JI[pc]
Bb1, D2, Eb2, F2, G2, Bb2, D3, Eb3, F3, Bb3, C4, D4, Eb4, F4, G4, A4, Bb4 = 34, 38, 39, 41, 43, 46, 50, 51, 53, 58, 60, 62, 63, 65, 67, 69, 70

LC, LS, FX = 0.05, 0.075, 5.0
LV = [1.0]

# ---- the crumhorn. A narrow cylindrical bore stopped at the reed: its odd harmonics strong, its even ones weak; the reed, shut in its
# cap, buzzes softly near 750 Hz and a little near 1.6 kHz; played softly, nothing above about 2.2 kHz. The cap lets the reed speak at
# once (a few hundredths of a second, its upper harmonics a moment later) and stop as cleanly when the tongue stops it; a breath through
# the cap as each note starts; every note at one level, with no swell and no vibrato, since the lips never touch the reed
def _cw(f):
    n = max(1, int(2200 // f)); k = np.arange(1, n + 1); fk = f * k
    a = np.where(k % 2 == 1, 1.0, 0.3) / k ** 0.85 * (1 + 0.45 * np.exp(-((fk - 750) / 300) ** 2) + 0.15 * np.exp(-((fk - 1600) / 300) ** 2))
    return a / np.sqrt((a ** 2).sum())
def crum(m, s, sec, g=1.0, pan=0.12, room=0.28, until=None):
    """the crumhorn holds m from s for sec seconds, and stops"""
    if until is not None:
        sec = min(sec, until - s - 0.15)
    if sec <= 0.08:
        return
    f = hz(m); att, rel = 0.035, 0.08; n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for j, aj in enumerate(_cw(f)):
        k = j + 1
        sig += aj * np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.1 * (k - 1))), 1)) ** 2 * np.sin(2 * np.pi * f * k * x + 0.7 * k)
    sig *= np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    sig = sig / max(1e-9, float(np.abs(sig).max())); nb = min(n, int(0.06 * SR))
    sig[:nb] += 0.04 * filt(noise(0.06), 'band', (450, 1400))[:nb] * np.exp(-np.arange(nb) / SR / 0.015)   # the breath through the cap
    sig = _room(norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 90)), room, min(0.06, sec * 0.2), sec)
    put(_until(sig, s, until), s, g * LV[0] * LC, pan)

# ---- the serpent: played softly, held steady with no vibrato. Round and a little foggy: every harmonic, each softer than the last, its
# wooden bore lifting those near 360 Hz (they carry it on a phone, whose speaker drops the low notes), the leather damping the rest,
# nothing above about 1.5 kHz. Like a brass note, its upper harmonics speak a moment after the first, as the lips settle; a breath of air
# stays under the whole note. Each note held at one level, and let go
def _sw(f):
    n = max(1, int(1500 // f)); k = np.arange(1, n + 1); fk = f * k
    a = np.exp(-0.45 * (k - 1)) * (1 + 0.9 * np.exp(-((fk - 360) / 160) ** 2)) / (1 + (fk / 1000) ** 4)
    return a / np.sqrt((a ** 2).sum())
def serp(m, s, sec, g=1.0, pan=-0.12, room=0.3, rel=0.35, until=None):
    """the serpent holds m from s for sec seconds, and lets go over rel"""
    if until is not None:
        sec = min(sec, until - s - rel - 0.05)
    if sec <= 0.1:
        return
    f = hz(m); att = 0.1; n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for j, aj in enumerate(_sw(f)):
        k = j + 1
        sig += aj * np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.25 * (k - 1))), 1)) ** 2 * np.sin(2 * np.pi * f * k * x + 0.4 * k)
    env = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    sig = sig * env / max(1e-9, float(np.abs(sig).max()))
    sig += 0.018 * filt(noise(n / SR + 0.01)[:n], 'band', (160, 800)) * np.minimum(1, x / 0.15) * env   # the breath under it
    sig = _room(norm(filt(filt(sig.astype(np.float32), 'low', 1500), 'high', 40)), room, min(0.25, sec * 0.3), sec)
    put(_until(sig, s, until), s, g * LV[0] * LS, pan)

# ---- what they play
def chord(s, low, low_sec, highs, g=1.0, step=0.0, at=0.25):
    """the serpent's note, and over it the crumhorn's notes one after another (highs: (note, seconds)), from at seconds after"""
    serp(low, s, low_sec, g)
    t = s + at
    for m, d in highs:
        crum(m, t, d * 0.94, 0.9 * g); t += d + step

def mark(s, g=1.0, step=0.34, until=None, hold=1.6):
    """the series' mark, in B flat: the crumhorn's B flat, C and F rising, and the serpent takes the F an octave down and carries it to
    B flat; the crumhorn lets its F go as the serpent takes it, as a letter handed on from station to station"""
    crum(Bb3, s, step * 0.92, g, until=until)
    crum(C4, s + step, step * 0.92, g, until=until)
    crum(F4, s + step * 2, step + 0.04, g, until=until)
    serp(F3, s + step * 3, step - 0.04, 0.9 * g, rel=0.12, until=until)
    serp(Bb2, s + step * 4, hold, 0.9 * g, until=until)
    return s + step * 4

CALL = (Bb3, D4, F4, Eb4, D4)    # the pass: the crumhorn's phrase, as fixed as a written pass
def pass_(s, step=0.3, g=1.0, short=False, last=0.7):
    """the film's figure: the crumhorn's call, and the serpent's answer note for note an octave down; short: where a request has no pass
    of its own, the answer stops after two notes"""
    for i, m in enumerate(CALL):
        crum(m, s + step * i, (last if i == len(CALL) - 1 else step * 0.9), g)
    a = s + step * len(CALL) + last - step + 0.15; ans = [m - 12 for m in CALL][:2 if short else None]
    for i, m in enumerate(ans):
        serp(m, a + step * i, (step * 0.85 if i < len(ans) - 1 or short else 0.9), 0.95 * g, rel=0.12 if i < len(ans) - 1 else 0.3)
    return a + step * len(ans)


# =============================================================================================================================
# 1. A pass that matches: the opening. Japan, the early 1600s: the serpent's low B flat and the crumhorn's first phrase as the map
#    appears; a century of war just ended, E flat; the hostages kept in Edo, G minor; the fear on the roads, D minor, a lord's family
#    slipping out and guns going in, each a line along the road. The checkpoint set by Lake Ashi: a tick as the gate is drawn, the lake,
#    and E flat. The checkpoint at dusk: travellers' feet, and B flat as the room opens. The woman walks in; her pass, a sheet, its
#    lines written one by one. The examiner checks her against it: the figure, the crumhorn's call and the serpent's answer, note for
#    note; a tick for each line that matches; her hair let down; no match, a knock. The side road, a line, and the crime, a knock; she
#    walks on; two men pass, and F major. Whoever leaves Edo is seen and checked, the road open: B flat, rising. Two hundred and fifty
#    years: a tick, and E flat to B flat. The utility: one account opens every door, its red lines one soft texture, G minor; its key, a
#    tick, and the log that can't say, a knock, D minor. A pass for every job and every person, checked at the catalogue: B flat. The
#    title: the mark
LV[0] = 0.9
ow = lambda lid, word, off=0: W('pass', lid, word, off)
oc = lambda lid, off=0: G('pass', lid, off)
END = E('pass')
serp(Bb1, 0.6, 3.4, 0.9)
for m, a, d in ((F4, 0.95, 1.0), (D4, 2.0, 0.55), (Eb4, 2.6, 0.55), (F4, 3.2, 1.6)):
    crum(m, a, d, 0.75)
line(0.9, 2.6, 0.0028, px(500), px(1250))
tick(1.6, 0.0025, px(1180))
chord(ow('year', 'century', -0.1), Eb2, 2.4, [(G4, 1.7)], 0.8)
chord(ow('hostages', 'hostages', -0.2), G2, 2.4, [(Bb3, 0.8), (D4, 1.5)], 0.8)
chord(ow('fear', 'slipping', -0.2), D2, 2.6, [(F4, 1.1)], 0.75)
line(ow('fear', 'slipping', 0.0), 2.4, 0.0028, px(1100), px(800))
line(ow('fear', 'guns', 0.0), 2.4, 0.0028, px(800), px(1100))
crum(D4, ow('fear', 'guns', 0.1), 1.6, 0.6)
tick(ow('checkpoint', 'sets', -0.3), 0.003, px(960))
lake(oc('checkpoint', 0.7), 3.6, 0.0028, px(900))
chord(ow('checkpoint', 'Lake Ashi', -0.1), Eb2, 2.6, [(Bb3, 0.7), (Eb4, 0.7), (G4, 1.5)], 0.75)
feet(oc('gate', -1.0), 7.0, 0.003, px(1700), 1.6, px(300))
chord(oc('gate', -0.5), Bb2, 2.6, [(D4, 0.9), (F4, 1.6)], 0.75)
feet(oc('pass', -3.4), 14.0, 0.0024, px(2000), 1.4, px(760))
sheet(oc('pass', 0.3), 0.0045, px(395))
for word in ('who she is', "where she's going", 'her hair', 'any marks'):
    line(ow('says', word, -0.05), 0.55, 0.0022, px(260))
pass_(ow('check', 'checks her', -0.15), g=0.8)
for k in (0, 1, 3):
    tick(ow('check', 'checks her', 0.05 + k * 0.35), 0.0022, px(300))
brush(ow('check', 'unties', 0.3), 0.003, px(700))
tick(ow('check', 'unties', 0.65), 0.0022, px(300))
knock(ow('check', "doesn't match", -0.1), 0.004, px(960))
line(ow('round', 'side road', -0.3), 1.6, 0.0028, px(1100), px(1500))
knock(ow('round', 'crime', 0.0), 0.004, px(1400))
feet(oc('round', -0.4), 9.0, 0.0024, px(740), 1.4, px(-100))
feet(ow('men', 'Most men', -0.4), 7.0, 0.0024, px(1900), 1.6, px(200))
chord(ow('men', 'Most men', 0.0), F2, 2.4, [(C4, 0.8), (F4, 1.5)], 0.7)
chord(ow('better', 'seen and checked', -0.2), Bb1, 3.2, [(D4, 0.7), (F4, 0.7), (Bb4, 1.8)], 0.75)
tick(oc('stands', -0.3), 0.0025, px(200))
serp(Eb2, oc('stands', 0.2), 1.5, 0.7, rel=0.15)
serp(Bb1, oc('stands', 1.75), 2.2, 0.7)
crum(G4, oc('stands', 0.45), 1.4, 0.6)
crum(F4, oc('stands', 2.0), 1.8, 0.6)
hatch(oc('one', 0.5), 1.6, 0.0028, px(700), px(1700))
chord(oc('one', 0.3), G2, 2.4, [(Bb3, 1.6)], 0.7)
tick(ow('copy', 'key', -0.1), 0.0025, px(1180))
knock(ow('copy', "can't say", -0.1), 0.0035, px(1180))
chord(ow('copy', "can't say", 0.0), D2, 2.2, [(F4, 1.4)], 0.65)
hatch(ow('every', 'every job', -0.2), 1.4, 0.0024, px(700), px(1700))
sheet(ow('every', 'checked', -0.4), 0.0035, px(1200))
hatch(ow('every', 'checked', 0.3), 1.8, 0.0022, px(650), px(1750))
chord(ow('every', 'checked', 0.0), Bb2, 2.6, [(D4, 0.8), (F4, 1.6)], 0.7)
t_ = mark(oc('breath', 1.0), 0.75, until=END, hold=1.4)
crum(D4, t_ + 0.4, 1.6, 0.5, until=END)

# 2. One account, every door: the regulator's letter, a sheet, and G minor; Ama's ticket, a sheet; the log, a sheet, every line the
#    same account, a knock. data_loader, a tick; its 47 jobs round it, one soft texture; four laptops, a tick. The key in the script, a
#    sheet. Every table, its red lines, one soft texture. Who read the bank details? Nobody can say: the figure's call, and the
#    serpent's answer stops short. A new account took a ticket and two weeks, a sheet; data_loader at once, a tick. The slow way:
#    G minor, low
LV[0] = 0.9
aw = lambda lid, word, off=0: W('account', lid, word, off)
ac = lambda lid, off=0: G('account', lid, off)
sheet(ac('ask', 0.0), 0.0045, px(1180))
chord(ac('ask', 0.2), G2, 2.2, [(D4, 1.5)], 0.7)
sheet(ac('ticket', 0.0), 0.004, px(1180))
sheet(ac('log', 0.0), 0.0045, px(1180))
knock(aw('log', 'same account', -0.1), 0.0035, px(1500))
tick(aw('jobs', 'first month', -0.3), 0.0025, px(1200))
hatch(aw('jobs', 'forty-seven', -0.3), 1.6, 0.0024, px(600), px(1800))
tick(aw('jobs', 'four people', -0.1), 0.0025, px(1200))
sheet(aw('key', 'script', -0.3), 0.0045, px(1040))
hatch(aw('rights', 'every table', -0.5), 1.4, 0.0024, px(667), px(1733))
pass_(aw('harm', 'nobody can tell', -0.1), g=0.7, short=True)
sheet(aw('how', 'ticket and two weeks', -0.2), 0.0035, px(1440))
tick(aw('how', 'at once', -0.1), 0.0025, px(1720))
chord(ac('slow', 0.1), G2, 2.6, [(Bb3, 2.0)], 0.65)

# 3. Who is asking: Ravi starts with identity, B flat. People sign in as themselves: the analyst, a tick; single sign-on and the second
#    check, a tick each. Each job its own identity, one soft texture; a pass for each run, F major. At Hakone, a pass, a sheet, E flat;
#    a key in a script, a knock
LV[0] = 0.9
ww = lambda lid, word, off=0: W('who', lid, word, off)
wc = lambda lid, off=0: G('who', lid, off)
chord(wc('start', 0.1), Bb1, 2.2, [(D4, 0.7), (F4, 1.3)], 0.65)
tick(wc('people', -0.2), 0.0025, px(1700))
tick(ww('people', 'single sign-on', -0.2), 0.0025, px(1700))
tick(ww('people', 'second check', -0.2), 0.0025, px(1600))
hatch(wc('jobs', -0.2), 1.2, 0.0022, px(680), px(1400))
chord(ww('jobs', 'pass', -0.1), F2, 2.2, [(A4, 1.4)], 0.6)
sheet(wc('story', -0.2), 0.004, px(885))
chord(wc('story', 0.0), Eb2, 2.2, [(G4, 0.7), (Bb4, 1.2)], 0.6)
knock(ww('story', 'A key', -0.2), 0.0035, px(1550))

# 4. Only what it needs: each identity only its rights, its grants drawn, one soft texture, and B flat over D. The billing load and the
#    dashboard, a line each. The billing team, a tick, its grants a line. The bank details locked, a press; nobody else, a tick. A
#    woman's pass named one journey: the road, a line, and F major to B flat
LV[0] = 0.9
lw = lambda lid, word, off=0: W('least', lid, word, off)
lc = lambda lid, off=0: G('least', lid, off)
hatch(lc('rights', 0.3), 1.4, 0.0022, px(700), px(1500))
chord(lc('rights', 0.1), D2, 2.0, [(Bb3, 0.7), (F4, 1.3)], 0.6)
line(lw('jobs', 'billing load', -0.1), 0.7, 0.0024, px(670))
line(lw('jobs', 'outage dashboard', -0.1), 0.8, 0.0024, px(1300))
tick(lw('groups', 'groups', -0.2), 0.0025, px(1700))
line(lw('groups', 'groups', 0.1), 1.0, 0.0024, px(1700), px(900))
seal(lw('bank', 'bank details', -0.3), 0.004, px(950))
tick(lw('bank', 'Nobody else', -0.2), 0.0025, px(1180))
line(lw('story', 'one journey', -0.2), 1.2, 0.0026, px(1800), px(1200))
chord(lw('story', 'one journey', 0.0), F2, 2.0, [(A4, 0.8), (Bb4, 1.3)], 0.6)

# 5. Checked where the data is: the catalogue across every way to the data, a sheet, and B flat; every request through it, one soft
#    texture; the dashboard's request for the bank details, stopped, a knock. The laptop in the office, a line, checked like any other,
#    a tick. No side roads: the files under the tables, a line, and the side road struck out, a knock, D minor. Encrypted, a press; set
#    once, a tick. As at Hakone: the gate, a tick, and F major to B flat
LV[0] = 0.9
kw = lambda lid, word, off=0: W('checked', lid, word, off)
kc = lambda lid, off=0: G('checked', lid, off)
sheet(kw('every', 'checked', -0.5), 0.004, px(1200))
chord(kw('every', 'checked', -0.3), Bb1, 2.2, [(F4, 1.5)], 0.6)
hatch(kw('every', 'checked', 0.6), 1.6, 0.0022, px(680), px(1700))
knock(kw('every', 'what they may', 0.5), 0.0035, px(880))
line(kw('net', 'a laptop', -0.2), 1.3, 0.0024, px(330), px(627))
tick(kw('net', 'a laptop', 0.5), 0.0022, px(610))
line(kw('side', 'files', -0.4), 1.2, 0.0026, px(230), px(820))
knock(kw('side', 'without', -0.1), 0.0035, px(440))
chord(kw('side', 'without', 0.1), D2, 2.0, [(A4, 0.7), (F4, 1.2)], 0.6)
seal(kw('enc', 'encrypted', -0.2), 0.0035, px(1840))
tick(kw('enc', 'set once', -0.3), 0.0022, px(1180))
tick(kc('story', -0.3), 0.0025, px(1780))
chord(kc('story', 0.0), F2, 2.0, [(C4, 0.7), (F4, 1.3)], 0.6)

# 6. No key in the code: two keys that can't go away, a tick each, and G minor. The secret store shut on them, a press, and E flat; the
#    job's code, a sheet. Every pull request checked, a sheet; merged, a tick. The old key cancelled, a knock; data_loader switched off,
#    a line through it, and B flat
LV[0] = 0.9
sw_ = lambda lid, word, off=0: W('secrets', lid, word, off)
sc_ = lambda lid, off=0: G('secrets', lid, off)
tick(sw_('some', 'password', -0.3), 0.0025, px(1180))
tick(sw_('some', "supplier's", -0.3), 0.0025, px(1180))
chord(sw_('some', 'password', 0.0), G2, 2.0, [(D4, 1.4)], 0.6)
seal(sw_('store', 'secret store', 0.9), 0.004, px(1560))
chord(sw_('store', 'secret store', 0.3), Eb2, 2.0, [(G4, 1.4)], 0.6)
sheet(sw_('store', 'asks', -0.3), 0.004, px(950))
tick(sw_('store', 'never written', -0.2), 0.0022, px(1250))
sheet(sc_('pr', -0.2), 0.004, px(950))
tick(sw_('pr', 'merged', -0.1), 0.0022, px(950))
sheet(sc_('off', -0.3), 0.0035, px(880))
knock(sw_('off', 'cancelled', -0.2), 0.0035, px(880))
line(sw_('off', 'switched off', -0.1), 0.6, 0.0024, px(1400), px(1600))
chord(sw_('off', 'switched off', 0.2), Bb1, 2.2, [(D4, 0.6), (Bb3, 1.4)], 0.6)

# 7. A name on every line: the log, a sheet, a name on every line, a tick, and F major. The regulator asks again, a sheet; the answer,
#    a sheet, in ten minutes, a tick; Ama closes her ticket, a tick, and B flat
LV[0] = 0.9
gw = lambda lid, word, off=0: W('log', lid, word, off)
gc = lambda lid, off=0: G('log', lid, off)
sheet(gc('log', -0.7), 0.004, px(1180))
tick(gw('log', 'names', -0.1), 0.0022, px(1500))
chord(gw('log', 'names', 0.1), F2, 2.0, [(C4, 0.6), (A4, 1.3)], 0.55)
sheet(gc('again', -0.2), 0.004, px(1180))
sheet(gc('who', -0.3), 0.004, px(1180))
tick(gw('who', 'ten minutes', -0.3), 0.0022, px(1180))
tick(gw('closed', 'closes', -0.1), 0.0025, px(800))
chord(gw('closed', 'closes', 0.1), Bb1, 2.2, [(F4, 0.7), (D4, 1.4)], 0.6)

# 8. The safe way, the easy way: the quick way would win again, a knock, and G minor. The safe way made the easy way: E flat to B flat;
#    the template, a sheet, a tick for each thing a new job starts with. Twelve new jobs, one soft texture; not one borrowed account, a
#    tick. The series that builds each lock, a tick, and F major
LV[0] = 0.9
dw = lambda lid, word, off=0: W('default', lid, word, off)
dc = lambda lid, off=0: G('default', lid, off)
knock(dw('why', 'quick way', -0.3), 0.0035, px(1180))
chord(dw('why', 'quick way', 0.0), G2, 2.0, [(Bb3, 0.6), (D4, 1.2)], 0.55)
serp(Eb2, dw('template', 'easy way', -0.1), 1.3, 0.6, rel=0.15)
serp(Bb1, dw('template', 'easy way', 1.25), 1.8, 0.6)
crum(Bb4, dw('template', 'easy way', 0.15), 1.2, 0.5)
crum(Bb3, dw('template', 'easy way', 1.4), 1.4, 0.5)
sheet(dc('start', -0.3), 0.004, px(1180))
for word in ('identity', 'rights', 'secrets', 'log'):
    tick(dw('start', word, -0.1), 0.002, px(836))
hatch(dw('quick', 'twelve', -0.2), 1.4, 0.0022, px(1000), px(1350))
tick(dw('quick', 'not one', -0.2), 0.0022, px(1180))
tick(dw('handoff', 'Locks before the data', -0.4), 0.0025, px(1180))
chord(dw('handoff', 'Locks before the data', -0.2), F2, 2.0, [(A4, 0.6), (F4, 1.3)], 0.55)

# 9. The data practice on the map: its layers, a sheet, and B flat; the data platform, a sheet; each security service, a tick as it's
#    named; the services serving every product and job, one soft texture. The rule as a principle, a sheet: E flat, then B flat
LV[0] = 0.9
pw = lambda lid, word, off=0: W('practice', lid, word, off)
pc = lambda lid, off=0: G('practice', lid, off)
sheet(pc('intro', -0.6), 0.0035, px(960))
chord(pc('intro', 0.1), Bb1, 2.0, [(D4, 1.5)], 0.55)
sheet(pc('parts', -0.2), 0.0035, px(1210))
for word, x in (('identity provider', 290), ('catalogue', 805), ('secret store', 1085), ('audit log', 1355)):
    tick(pw('services', word, -0.3), 0.0022, px(x))
hatch(pw('uses', 'uses', -0.6), 1.4, 0.0022, px(340), px(1570))
sheet(pw('principle', 'principle', -0.3), 0.0035, px(960))
serp(Eb2, pw('principle', 'principle', -0.1), 1.2, 0.6, rel=0.15)
serp(Bb1, pw('principle', 'principle', 1.15), 1.8, 0.6)
crum(G4, pw('principle', 'principle', 0.1), 1.1, 0.5)
crum(F4, pw('principle', 'principle', 1.3), 1.5, 0.5)

# 10. Nobody goes round: the road at dusk, travellers' feet, a woman among them; the figure whole again, the call and the answer, as the
#     road stays open. On the data platform, every request checked, one soft texture; by default for every domain, a tick. "Next", a
#     tick. The end card: the mark, to the end
LV[0] = 0.9
zw = lambda lid, word, off=0: W('end', lid, word, off)
zc = lambda lid, off=0: G('end', lid, off)
feet(S0('end') + 0.2, 7.5, 0.0026, px(2000), 1.6, px(300))
feet(S0('end') + 2.4, 8.0, 0.0022, px(2060), 1.4, px(600))
pass_(zw('road', 'looked hardest', -0.3), g=0.65)
hatch(zc('data', 0.6), 1.8, 0.0022, px(680), px(1700))
tick(zw('domains', 'by default', -0.3), 0.0025, px(1180))
tick(zc('next', -0.1), 0.0025, px(1180))
t_ = mark(zc('breath', 0.7), 0.7, until=TOT, hold=2.6)
crum(D4, t_ + 0.5, 2.4, 0.45, until=TOT)
