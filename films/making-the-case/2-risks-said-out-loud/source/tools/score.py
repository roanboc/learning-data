# Risks, said out loud: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, row reserved 10 November 2026, 04:02 UTC, after searching every
# score.py, music.py, sound.py and audio.py on main and on all 59 branches, and every palettes.md in the project's files, for
# "verrillon", "musical glasses", "water glasses", "wine glass", "tapped glass" and "glasses": none): tuned water glasses, made here, as
# music.py has none.
#  - The glasses: plain wine glasses, each tuned by the water in it, tapped once near the rim with a felt-tipped stick, as someone taps
#    a glass to ask a room to listen before saying something out loud. Each note is the glass's own round tone, with a faint higher
#    mode that is gone in a tenth of a second and a soft touch of the felt at its start; the water damps it, and a hand stops it within
#    about a second. One tap for each note: never a clink, a toast or a run of taps. Nothing trembles: one tone, no second glass a
#    little out of tune with it.
#  - Their partner: larger goblets and glass bowls, an octave lower, tapped the same way and left to ring for two or three seconds.
#    The opening is in Antarctica and Norway's own expedition; nothing in the score is borrowed from a people or a place: glasses on a
#    table are everyone's.
# The mark: one glass tapped alone (the room asked to listen), then A flat, B flat and D flat said plainly, answered by the partner's
# D flat an octave below: said, and owned. It is played whole when the opening says risks said out loud can be found in time, and on
# the film's last line. An early sign is one high glass (C), softly, a beat before a phrase begins: as flag 14 is read, as R1's and R3's
# signs are written, as the tags show on 16 June, as R3's sign is read to the council, and as the flags come back.
# D flat major, B flat minor for the opening's problem and the pre-mortem's failure. Every chord is tuned pure from D flat (just
# intonation, see hz()): D flat, G flat and A flat major, and B flat and F minor, are pure in this table; E flat minor is not, and is
# never played. No chapter is urgent: nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/rso_scenes.js,
#    and panned to where it is drawn. Everything low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1911)  # this film's own randomness: the room, the felt, the paper, the snow


# a small room round the glasses, ringing on for under a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1900); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
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


# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.004, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0035, pan=0.0):
    """something small set down, a tag or a row: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.003, pan=0.0):
    """a line drawn out, or a row of things slid in: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.004, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def wind(s, sec=4.0, g=0.003, pan=0.0):
    """wind over the ice in fog: one low, soft breath of air that swells in and dies away, no whistle"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 1.5); gr = 0.65 + 0.35 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (90, 520)) * _bump(x, sec, 1.2) * gr, s, g, pan, 700)
def skis(s, g=0.003, pan=0.0):
    """a pair of skis set upright in the snow: a muffled wooden knock and the snow giving under it"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    sn = filt(noise(0.24)[:n], 'band', (300, 1200)) * np.exp(-x / 0.03) * 0.5
    _fx(_knock(n, 170, 0.03) + sn, s, g, pan, 1400)
def rustle(s, sec=3.6, g=0.0025, pan=0.0):
    """small notes put up on a wall, one after another: one soft paper texture that swells and eases, not a burst of single taps"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 9)); gr = 0.4 + 0.6 * gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (420, 1700)) * _bump(x, sec, 1.0) * gr, s, g, pan, 1800)

# ---- tuning: just intonation from D flat, so a chord's notes are whole-number ratios of each other and nothing beats. D flat, G flat
# and A flat major, and B flat and F minor, are pure in this table; E flat minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 61, 12)
    return 277.18 * 2 ** o * _JI[pc]
Bb3, Db4, Eb4, F4, Gb4, Ab4, Bb4, C5 = 58, 61, 63, 65, 66, 68, 70, 72
Db5, Eb5, F5, Gb5, Ab5, Bb5, C6, Db6 = 73, 75, 77, 78, 80, 82, 84, 85

LG, LW, FX = 0.062, 0.072, 4.0
LV = [1.0]

def glass(m, s, g=1.0, ring=0.8, pan=None, room=0.16, until=None):
    """one wine glass, tuned by its water, tapped once near the rim with a felt-tipped stick: its round tone, a faint second harmonic,
    a higher mode (about 2.74 times up) gone in a tenth of a second, and a soft touch of the felt at its start; the water damps it, and
    a hand stops it after ring seconds (at most one)"""
    f0 = hz(m); d = min(1.0, ring)
    if until is not None:
        d = min(d, max(0.15, until - s - 0.2))
    sec = d + 0.2; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.sin(2 * np.pi * f0 * x) * np.exp(-x / 0.5) + 0.06 * np.sin(2 * np.pi * 2 * f0 * x) * np.exp(-x / 0.2)
    if f0 * 2.74 < 2400:
        sig += 0.1 * np.sin(2 * np.pi * f0 * 2.74 * x + 0.4) * np.exp(-x / 0.08)
    sig *= np.minimum(1, x / 0.004) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05))
    touch = filt(noise(0.03)[:int(0.03 * SR)], 'band', (700, 1900)) * np.exp(-np.arange(int(0.03 * SR)) / SR / 0.006) * 0.05
    sig = sig / max(1e-9, float(np.abs(sig).max())); sig[:len(touch)] += touch
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 120)), room, 0.0, min(0.6, d)), s, until)
    put(sig, s, g * LV[0] * LG, max(-0.4, min(0.4, (m - 79) * 0.03)) if pan is None else pan)

def bowl(m, s, g=1.0, ring=2.4, pan=None, room=0.18, until=None):
    """the partner: a goblet or a glass bowl, an octave lower, tapped the same way and left to ring: its round tone with a faint second
    harmonic, a short higher mode at the tap, and a slow ring that is let go after ring seconds"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.3, until - s - 0.4))
    sec = d + 0.6; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.sin(2 * np.pi * f0 * x) * np.exp(-x / 1.4) + 0.08 * np.sin(2 * np.pi * 2 * f0 * x) * np.exp(-x / 0.5) \
        + 0.06 * np.sin(2 * np.pi * f0 * 2.7 * x + 0.3) * np.exp(-x / 0.06)
    sig *= np.minimum(1, x / 0.006) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.18))
    touch = filt(noise(0.03)[:int(0.03 * SR)], 'band', (400, 1400)) * np.exp(-np.arange(int(0.03 * SR)) / SR / 0.008) * 0.04
    sig = sig / max(1e-9, float(np.abs(sig).max())); sig[:len(touch)] += touch
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1800), 'high', 80)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LW, -0.12 if pan is None else pan)

def chord(notes, s, g=1.0, step=0.2, ring=2.2, until=None):
    """a chord placed from its lowest note up, one tap at a time: the low notes on the goblets and bowls, left to ring; the rest on the
    glasses, each damped within a second"""
    for i, m in enumerate(notes):
        (bowl(m, s + step * i, g, max(0.8, ring - step * i), until=until) if m < Db5 else glass(m, s + step * i, g, min(1.0, ring), until=until))
def sign(s, g=0.45, pan=None):
    """an early sign: one high glass, softly"""
    glass(C6, s, g, 0.7, pan)
def mark(s, g=1.0, until=None):
    """the mark: one glass alone, the room asked to listen; then A flat, B flat and D flat, said plainly; the partner's D flat answers"""
    glass(F5, s, g, 0.6, 0.0, until=until)
    for i, m in enumerate((Ab5, Bb5, Db6)):
        glass(m, s + 1.1 + 0.36 * i, g, 0.6 if i < 2 else 1.0, until=until)
    bowl(Db5, s + 1.1 + 0.36 * 2 + 0.5, 0.9 * g, 2.6, 0.0, until=until)

# =============================================================================================================================
# 1. Flags across the route: the opening. One goblet, alone, on the ice; D flat major as February 1911 comes in. The route draws: G flat
#    major. Three depots, one glass each as its square appears. Fog: B flat minor, low, and one soft breath of wind. Missed on the way
#    home: the low B flat, left to ring. From above, the party drifts: B flat minor again, other notes. "Something had to change" has
#    nothing under it. The flags drawn out across the route: A flat major. The flags on the ice: G flat major. In fog again, flag 14 is
#    read: the early sign; the depot found: D flat major. Home: a knock as each pair of skis is set up; ninety-nine days: A flat major;
#    the quote: one goblet under it. The university: one glass. Its hidden risks: B flat minor. Said out loud: the mark, whole. The
#    title: D flat major, held.
LV[0] = 0.85
ow = lambda lid, word, off=0: W('depots', lid, word, off)
oc = lambda lid, off=0: G('depots', lid, off)
END = E('depots')
bowl(Db4, 0.6, 0.8, 2.8, 0.0)
chord((Db4, Ab4, F5, Ab5), ow('when', 'Antarctica', 0.2), 0.7, step=0.22, ring=2.6)
card(ow('when', 'Antarctica', -0.2), 0.004, px(460))
chord((Gb4, Bb4, Db5), ow('plan', 'South', 0.0), 0.55, step=0.2, ring=2.2)
tap(ow('plan', 'three', -0.2), 0.0035, px(1300))
for i, m in enumerate((Db5, F5, Ab5)):
    glass(m, ow('depots', 'three', -0.2) + 0.4 * i + 0.12, 0.5, 0.6, 0.0)
tap(ow('depots', 'depots', -0.1), 0.0035, px(1300))
wind(ow('fog', 'fog', -0.4), 4.2, 0.004, px(1100))
chord((Db4, F4, Bb4), ow('fog', 'fog', 0.1), 0.6, step=0.24, ring=2.8)
tap(ow('fog', 'pass', -0.2), 0.0035, px(450))
card(ow('harm', 'Miss', -0.2), 0.004, px(960))
bowl(Bb3, ow('harm', 'Miss', 0.0), 0.65, 2.6)
slide(ow('along', 'Marks', -0.1), 1.4, 0.003, 0.0)
card(oc('along', 0.2), 0.0035, px(380))
chord((F4, Bb4, Db5), ow('along', 'drift', 0.0), 0.5, step=0.26, ring=2.4)
tap(ow('along', 'missed', -0.2), 0.0035, px(450))
tap(ow('along', 'drift', -0.8) + 4.2, 0.0035, px(1700))
slide(ow('across', 'marked', -0.2), 2.6, 0.003, 0.0)
card(oc('across', 0.3), 0.0035, px(380))
chord((Ab4, C5, Eb5), ow('across', 'marked', 0.1), 0.55, step=0.22, ring=2.2)
tap(ow('across', 'nine', -0.1), 0.003, px(645))
tap(ow('across', 'nine', 0.1), 0.003, px(1275))
chord((Gb4, Db5, Gb5), oc('flags', 0.3), 0.5, step=0.24, ring=2.0)
card(ow('flags', 'twenty', -0.2), 0.004, px(460))
f14 = oc('cross', -0.1 + 2.2)
sign(f14, 0.45, px(1212))
tap(f14 + 0.1, 0.003, px(1212))
chord((Db4, Ab4, F5), oc('cross', -0.1 + 3.6), 0.6, step=0.22, ring=2.4)
tap(oc('cross', -0.1 + 3.7), 0.0035, px(960))
sk = ow('home', 'five', -0.6)
for i, k in enumerate((0.0, 0.5, 0.78, 1.02, 1.3)):
    skis(sk + k + 0.1, 0.003, px(1200 + 64 * i))
card(ow('home', 'Ninety-nine', -0.2), 0.004, px(370))
chord((Ab4, Eb5, Ab5), ow('home', 'Ninety-nine', 0.1), 0.5, step=0.2, ring=1.8)
card(ow('home', 'January', -0.2), 0.004, px(1490))
chord((Db4, F4, Ab4, Db5), ow('home', 'home', 0.0), 0.5, step=0.2, ring=2.4)
card(oc('luck', -0.1), 0.004, px(960))
bowl(Db4, ow('luck', 'Luck', 0.0), 0.5, 2.6, 0.0)
card(ow('data', 'move', -0.3), 0.004, px(570))
glass(F5, ow('data', 'Helena', 0.0), 0.45, 0.8, px(1640) * 0.4)
for word, x in (('stops', 420), ('personal', 1020)):
    card(ow('hidden', word, -0.3), 0.0035, px(x))
chord((Bb3, F4, Db5), ow('hidden', 'missed', 0.0), 0.5, step=0.26, ring=2.4)
mark(ow('found', 'Said', 0.1), 0.6)
chord((Db4, Ab4, Db5, F5), oc('breath', 0.4), 0.65, step=0.24, ring=4.4, until=END)

# 2. How much risk: the chapter turns on G flat major; the council's card, Helena's question, the appetite's sheet, a card each; as each
#    level is said, one note: low, the low goblet; medium, a higher one; high, a glass; "avoided, not just watched" and the two tags, a tap
LV[0] = 0.9
aw = lambda lid, word, off=0: W('appetite', lid, word, off)
ac = lambda lid, off=0: G('appetite', lid, off)
chord((Bb4, Db5, Gb5), S0('appetite') + 0.3, 0.5, step=0.2, ring=2.0)
card(S0('appetite') + 0.9, 0.004, px(960))
card(aw('ask', 'How', -0.2), 0.004, px(960))
card(ac('name', -0.1), 0.004, px(960))
bowl(Db4, aw('low', 'Low', 0.1), 0.5, 1.6, px(1300) * 0.3)
bowl(Ab4, aw('medium', 'Medium', 0.1), 0.5, 1.4, px(1300) * 0.3)
glass(Ab5, aw('high', 'high', 0.1), 0.5, 0.8, px(1300) * 0.3)
tap(aw('means', 'avoided', -0.3), 0.0035, px(960))
tap(aw('who', 'team', -0.2), 0.003, px(330))
tap(aw('who', 'decide', -0.2), 0.003, px(1630))

# 3. One sentence, one owner: the chapter turns on D flat major; the register pinned up, a tap as each row comes in; the three parts'
#    tags; R1 pinned up, a pen under its three parts, a tap for each field; the four responses slid in, and one glass as "reduce" is
#    chosen; R1's early sign: the high glass; the standard's tag; R8 reduced long before: A flat major; 25 May, the case, and the
#    council's yes: D flat major with the partner; R3 only a worry: the low B flat, left to ring
LV[0] = 0.9
sw = lambda lid, word, off=0: W('sentence', lid, word, off)
sc_ = lambda lid, off=0: G('sentence', lid, off)
chord((Db4, F4, Ab4), S0('sentence') + 0.2, 0.5, step=0.2, ring=2.2)
card(S0('sentence') + 0.8, 0.004, px(960))
for i in range(3):
    tap(sw('may', 'register', -0.3) + 0.47 * i + 0.1, 0.003, px(960))
for word, x in (('cause', 520), ('happen', 960), ('would', 1400)):
    tap(sw('may', word, -0.1), 0.003, px(x))
card(sc_('r1', -0.1), 0.004, px(610))
pen(sc_('r1', 0.4), 0.8, 0.0035, px(610), 3)
for lid, word in (('owner', 'owner'), ('owner', 'date'), ('rate', 'likely'), ('response', 'reduced'), ('sign', 'sign')):
    tap(sw(lid, word, -0.1), 0.003, px(610))
slide(sw('response', 'avoid', -0.3), 1.6, 0.003, px(1500))
glass(Ab5, sw('response', 'reduced', 0.0), 0.5, 0.8, px(1340) * 0.4)
sign(sw('sign', 'sign', 0.0), 0.45, px(610))
tap(sw('iso', 'standard', -0.3), 0.003, px(1500))
card(sc_('r8', -0.1), 0.004, px(960))
chord((Ab4, Eb5, Ab5), sw('r8', 'Scripts', 0.0), 0.5, step=0.2, ring=1.8)
tap(sw('r8', 'Scripts', -0.2), 0.003, px(960))
card(sc_('eight', -0.1), 0.004, px(960))
tap(sw('eight', 'yes', -0.2), 0.0035, px(960))
chord((Db4, Ab4, Db5, F5), sw('eight', 'yes', 0.0), 0.55, step=0.2, ring=2.4)
card(sc_('vague', -0.1), 0.004, px(960))
bowl(Bb3, sw('vague', 'worry', 0.0), 0.55, 2.4)
tap(sw('vague', 'worry', -0.2), 0.003, px(960))

# 4. It failed. Why? The move begins: A flat and D flat, plain; the failure imagined: B flat minor, low; the pre-mortem's tag; the sheet
#    of why it works; the notes put up on the wall, one soft texture; the two tags; the extract drawn as it's said: the report, the
#    extract, the copy, HR's system, a card for each box and a slide for each arrow; Ivy reads hers: one goblet; R3 written again, and
#    its early sign: the high glass; Yusuf's response: A flat major; what stays behind: a tap
LV[0] = 0.9
pw = lambda lid, word, off=0: W('premortem', lid, word, off)
pc_ = lambda lid, off=0: G('premortem', lid, off)
chord((Ab4, Db5), S0('premortem') + 0.3, 0.5, step=0.24, ring=1.8)
card(S0('premortem') + 0.8, 0.004, px(960))
card(pw('failed', 'January', -0.3), 0.004, px(960))
chord((Bb3, Db4, F4), pw('failed', 'failed', -0.1), 0.55, step=0.26, ring=2.6)
tap(pw('klein', 'pre-mortem', -0.2), 0.003, px(960))
card(pw('easier', 'failure', -0.2), 0.0035, px(960))
rustle(pc_('alone', 0.0), 3.6, 0.0025, px(960))
tap(pw('alone', 'alone', -0.2), 0.003, px(620))
tap(pw('alone', 'turn', -0.3), 0.003, px(1300))
card(pw('extract', 'report', -0.3), 0.0035, px(1610))
card(pw('extract', 'reads', -0.1), 0.0035, px(1030))
slide(pw('extract', 'extract', -0.1), 0.6, 0.003, px(1350))
card(pw('extract', 'copy', -0.3), 0.0035, px(360))
slide(pw('extract', 'copy', -0.1), 0.6, 0.003, px(690))
tap(pw('extract', "HR's", -0.1), 0.003, px(960))
card(pw('ivy', 'hers', -0.2), 0.004, px(720))
bowl(F4, pw('ivy', 'hers', 0.1), 0.5, 2.0, px(1620) * 0.3)
card(pc_('cause', -0.1), 0.004, px(660))
sign(pw('cause', 'sign', 0.0), 0.45, px(660))
tap(pw('yusuf', 'Yusuf', -0.1), 0.003, px(660))
tap(pw('yusuf', 'checked', -0.3), 0.003, px(660))
chord((Ab4, C5, Eb5), pw('yusuf', 'checked', 0.0), 0.5, step=0.22, ring=2.0)
tap(pw('behind', 'stays', -0.4), 0.003, px(660))

# 5. The early sign: the chapter turns on G flat major; the week's card; the catalog's screen; the five columns the report shows, ticked;
#    the two personal tags: the high glass, the sign itself; the two columns struck out; what stays behind and what's rebuilt, a card
#    each, and D flat major as the report is rebuilt; R3 as a risk and as an issue: a card each, the arrow drawn between, and the low
#    B flat under what could have happened; the next film's tag
LV[0] = 0.9
gw = lambda lid, word, off=0: W('sign', lid, word, off)
gc = lambda lid, off=0: G('sign', lid, off)
chord((Gb4, Bb4, Db5), S0('sign') + 0.3, 0.5, step=0.2, ring=2.0)
card(S0('sign') + 0.8, 0.004, px(960))
tap(gc('columns', -0.1), 0.0035, px(740))
pen(gw('columns', 'shows', -0.2), 0.3, 0.0035, px(700), 2)
tap(gw('tags', 'home', -0.2), 0.003, px(990))
tap(gw('tags', 'home', 0.05), 0.003, px(990))
sign(gw('tags', 'home', 0.0), 0.5, px(990))
pen(gw('stays', 'behind', -0.4), 0.8, 0.0035, px(300), 2)
card(gc('stays', 1.7), 0.004, px(530))
card(gc('stays', 2.3), 0.004, px(1390))
chord((Db4, F4, Ab4, Db5), gc('stays', 2.4), 0.5, step=0.2, ring=2.2)
card(gc('issue', 0.1), 0.004, px(440))
slide(gw('issue', 'become', -0.3), 0.7, 0.003, px(960))
card(gw('issue', 'issue', -0.3), 0.004, px(1480))
bowl(Bb3, gw('issue', 'issue', 0.0), 0.55, 2.4)
tap(gw('locks', 'Locks', -0.2), 0.003, px(960))

# 6. Read every month: the chapter turns on D flat major, low; the council's page; a tap as each of the three risks fills its row, and
#    the high glass as R3's sign is read; R8 closed: A flat major; R7 watched: its card and the next film's tag; said early: F and A
#    flat on the glasses; hidden: only its tag; back on the ice, the flags: the high glass, and a beat later D flat major;
#    Monday's four steps, a card each; the last line: the mark, whole; the end card: D flat major, held
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monthly', lid, word, off)
mc = lambda lid, off=0: G('monthly', lid, off)
chord((Db4, Ab4, F5), S0('monthly') + 0.3, 0.5, step=0.22, ring=2.2)
card(S0('monthly') + 0.8, 0.004, px(960))
for word in ('R1', 'R4', 'R3'):
    tap(mw('three', word, -0.1), 0.003, px(800))
sign(mw('three', 'sign', 0.0), 0.45, px(1280))
card(mc('closed', -0.1), 0.004, px(520))
tap(mw('closed', 'closed', -0.2), 0.003, px(520))
chord((Ab4, C5, Eb5), mw('closed', 'closed', 0.0), 0.5, step=0.22, ring=2.0)
card(mc('r7', -0.1), 0.004, px(1400))
tap(mw('r7', 'How', -0.2), 0.003, px(1400))
tap(mw('trust', 'builds', -0.3), 0.003, px(640))
chord((F5, Ab5), mw('trust', 'builds', 0.0), 0.45, step=0.22, ring=0.9)
tap(mw('trust', 'spends', -0.3), 0.003, px(1280))
sign(mw('flags', 'flags', -0.1), 0.45, px(1212))
tap(mc('flags', 0.4), 0.003, px(960))
chord((Db4, F4, Ab4), mw('flags', 'flags', -0.1) + 0.9, 0.5, step=0.24, ring=2.2)
for word, x in (('take', 540), ('sentence', 1380), ('owner', 540), ('sign', 1380)):
    card(mw('monday', word, -0.3), 0.0035, px(x))
mark(mw('take', 'Name', 0.0), 0.55)
chord((Db4, Ab4, Db5, F5), mc('breath', 0.7), 0.55, step=0.26, ring=5.0, until=TOT)
