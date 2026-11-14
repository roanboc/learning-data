# Built to change: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The series' palettes: /mnt/project-files/enterprise-architecture/new-architecture-series/palettes.md, this film's row reserved on 12
# November 2026. A cor anglais and a double bass, both made here (music.py has neither). Nothing new fitted, so the film pairs two
# instruments the site has, which no film pairs (the cor anglais is Which value wins' person, with a harpsichord and sackbuts, one of
# Teachers of data's three double reeds, and People before roles has one reserved with a bassoon; the double bass is bowed in Who did
# what, with a lujon, and in Change without surprises, which plucks it once, and No two alike has a plucked one reserved with a bass
# clarinet), and no film of this topic plays either:
#  - The lead: a cor anglais, the alto of the oboe's family, a fifth below the oboe. Its reed sits on a bent crook and its bell is a
#    pear-shaped bulb, which veils its upper harmonics: a darker, softer voice than the oboe of What the business needs to know, and
#    played lower (D flat 4 to D flat 5). Each note is tongued softly, a breath of air through the reed as it speaks, held at one level
#    and let go: no vibrato, no slide, one voice. Its body lifts its sound near 520 Hz and 980 Hz, a little near 2 kHz.
#  - The partner: a double bass, plucked with the side of the finger: single notes, round and low (D flat 2 to A flat 3), each one
#    ringing and dying away, its upper harmonics first; never bowed, never slapped, never a walking line, never a chord struck at once.
#    Its body lifts its air near 65 and 110 Hz and its wood near 230, 420 and 700 Hz.
#  - Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road. The road is heard
#    as porters' feet and hooves on the earth, far off and soft, and the railway as a low rumble, far off, with no whistle.
# The series' mark, the relay, in D flat: the cor anglais plays D flat, E flat and A flat rising and lets the A flat go as the double bass
# takes it an octave down and carries it to D flat; under the title and under the end card. The film's own figure, the carry: a short tune
# the cor anglais plays (D flat, F, A flat, G flat, F, D flat), which the double bass plays again after it, the same notes an octave
# down, as what's the utility's own goes on when the part that played it changes. Alone where nothing carries it (the storm tool's twelve
# years, locked inside: the cor anglais stops on G flat, and nothing takes it up), carried where a part changes and what's the utility's
# own goes with it (Ravi's platform, behind a seam, every number matching on another engine, the storm history kept, and at the end).
# D flat major; B flat minor and F minor for what goes wrong. Every note is tuned pure from D flat (just intonation, see hz()): D flat,
# G flat and A flat major and B flat and F minor are pure in this table; E flat minor is not, and E flat never sounds with B flat or G
# flat. The keys go round by fourths, as the series' films do: after A flat, D flat. No chapter is urgent: nothing pulses.
# The rules the films keep (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: every note held at one level, with no vibrato, and let go.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/scenes.js, and
#    panned to where it is drawn. Everything soft: the cor anglais below about 2.3 kHz, the double bass below about 1.8 kHz, the
#    effects below about 2.2 kHz and well under the music.

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
R1 = np.random.default_rng(1889)  # this film's own randomness: the room, the reed, the feet, the hooves and the railway


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
    """a card, a page or a letter laid down: a short breath of paper, and its faint landing"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.22)[:n], 'band', (300, 1500)) * _bump(x, 0.09, 1.6) * (x < 0.09)
    _fx(fl + 0.5 * _thud(n, 150, 0.02, 0.08) / 1.3, s, g, pan, 1600)
def tick(s, g=0.0025, pan=0.0):
    """something small set in place: one soft tick of wood"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1150)) * np.exp(-x / 0.006) * 0.6 + 0.7 * _thud(n, 247, 0.011), s, g, pan, 1500)
def knock(s, g=0.0038, pan=0.0):
    """a soft knock, once: something that goes wrong, is locked or is turned away, without a beep"""
    n = int(0.2 * SR)
    _fx(_thud(n, 131, 0.03), s, g, pan, 1200)
def thump(s, g=0.004, pan=0.0):
    """a part or a data product set down on the platform: a dull, soft thump of wood"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 92, 0.05) + 0.25 * filt(noise(0.32)[:n], 'band', (150, 600)) * np.exp(-x / 0.05), s, g, pan, 900)
def line(s, sec=0.9, g=0.0028, pan=0.0, pan1=None):
    """a line drawn, written or laid across a map or a page: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _texture(filt(noise(sec + 0.02)[:n], 'band', (220, 1150)) * _bump(x, sec, 1.4) * gr, s, g, pan, pan1, 1350)
def hatch(s, sec=1.6, g=0.0026, pan=0.0, pan1=None):
    """many things drawn at once, as one soft texture: a dry rub with a fine, even grain, swelling in and easing off; never a patter"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = 0.75 + 0.25 * np.abs(np.sin(np.pi * 7.0 * x)) ** 2
    _texture(filt(noise(sec + 0.02)[:n], 'band', (250, 1250)) * _bump(x, sec, 1.1) * gr, s, g, pan, pan1, 1450)
def whisk(s, sec=0.9, g=0.0026, pan=0.0, pan1=None):
    """something carried through the air, a part, a file or a year: one soft breath that rises and falls"""
    n = int(sec * SR); x = np.arange(n) / SR
    _texture(filt(noise(sec + 0.02)[:n], 'band', (350, 1400)) * _bump(x, sec, 2.2), s, g, pan, pan1, 1500)
def feet(s, sec, g=0.0026, pan=0.0, pan1=None, pace=1.5):
    """people walking on an earthen road, farther off: one soft texture of steps that swells in and fades, not a patter of single steps"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.55 + 0.45 * np.abs(np.sin(np.pi * pace * x + 0.4)) ** 3
    _texture(filt(noise(sec + 0.02)[:n], 'band', (100, 600)) * beat * _bump(x, sec, 0.9), s, g, pan, pan1, 700)
def hooves(s, sec, g=0.0024, pan=0.0, pan1=None, pace=2.2):
    """packhorses walking on an earthen road, farther off: one soft texture of hoofbeats that swells in and fades, never single clops"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.45 + 0.55 * np.abs(np.sin(np.pi * pace * x + 0.9)) ** 8
    _texture(filt(noise(sec + 0.02)[:n], 'band', (140, 800)) * beat * _bump(x, sec, 0.9), s, g, pan, pan1, 900)
def rumble(s, sec, g=0.0026, pan=0.0, pan1=None):
    """a train far off: one low, soft rumble that swells as it passes and fades, its wheels an even roll; no whistle"""
    n = int(sec * SR); x = np.arange(n) / SR
    roll = 0.8 + 0.2 * np.abs(np.sin(np.pi * 1.6 * x)) ** 2
    _texture(filt(noise(sec + 0.02)[:n], 'band', (80, 450)) * roll * _bump(x, sec, 1.0), s, g, pan, pan1, 520)


# ---- tuning: just intonation from D flat, so the notes that sound together are whole-number ratios of each other and nothing beats.
# D flat, G flat and A flat major and B flat and F minor are pure in this table; E flat minor is not, and E flat never sounds with B flat
# or G flat
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 61, 12)
    return 277.183 * 2 ** o * _JI[pc]
Db2, F2, Gb2, Ab2, Bb2, C3, Db3, Eb3, F3, Gb3, Ab3 = 37, 41, 42, 44, 46, 48, 49, 51, 53, 54, 56
C4, Db4, Eb4, F4, Gb4, Ab4, Bb4, C5, Db5 = 60, 61, 63, 65, 66, 68, 70, 72, 73

LR, LT, FX = 0.07, 0.2, 7.0
LV = [1.0]

# ---- the cor anglais. A double reed's many harmonics, each a little weaker than the one before, weighted by its body: near 520 Hz,
# most near 980 Hz, a little near 2 kHz; its bulb bell takes off what's above (nothing above about 2.3 kHz). Tongued softly: the note
# speaks over a few hundredths of a second, its upper harmonics a moment later, with a breath of air through the reed that is strongest
# as it speaks; held at one level, and let go. No vibrato
_CB = [(520, 260, 0.55), (980, 380, 1.0), (1950, 500, 0.35)]
_CP = R1.uniform(0, 2 * np.pi, 24)
def _cw(f):
    n = max(1, int(2300 // f)); k = np.arange(1, n + 1); fk = f * k
    a = 1.0 / k ** 0.6 * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in _CB) + 0.15)
    return a / np.sqrt((a ** 2).sum())
def cor(m, s, sec, g=1.0, pan=0.12, room=0.26, rel=0.12, until=None):
    """the cor anglais plays m from s for sec seconds: tongued softly, held level, and let go"""
    if until is not None:
        sec = min(sec, until - s - rel - 0.05)
    if sec <= 0.1:
        return
    f = hz(m); n = int((sec + rel + 0.3) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    off = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    for j, aj in enumerate(_cw(f)):
        k = j + 1; sp = 0.04 * (1 + 0.1 * (k - 1))
        sig += aj * np.sin(0.5 * np.pi * np.minimum(x / sp, 1)) ** 2 * np.sin(2 * np.pi * f * k * x + _CP[j % 24]) * off
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    air = filt(noise(n / SR + 0.01)[:n], 'band', (max(400, 1.5 * f), 2000))
    sig += 0.012 * air * (1 + 2.5 * np.exp(-x / 0.04)) * np.minimum(1, x / 0.01) * off
    sig = _room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 140)), room, min(0.3, sec * 0.3), sec)
    put(_until(sig, s, until), s, g * LV[0] * LR, pan)

# ---- the double bass, plucked with the side of the finger near the end of the fingerboard, a quarter of the way along, so its sound is
# round: the low harmonics strong, the upper ones weaker and gone first; a low string rings longer. The player lets each note go after
# ring seconds. Its body lifts its air near 65 and 110 Hz and its wood near 230, 420 and 700 Hz; its lowest harmonic is held back a
# little, so a phone, which can't play it, hears the note in the ones above (the bass sits about 6 dB under the cor anglais there, and
# about 1 dB under it on a full speaker); a soft, dull touch of the finger as it plucks; nothing above about 1.8 kHz
_DB = [(65, 30, 0.3), (110, 50, 0.5), (230, 110, 1.0), (420, 180, 1.0), (700, 260, 0.55)]
def _pizz(f, x, pos=0.27):
    sig = np.zeros(len(x)); d1 = 0.9 * (70 / f) ** 0.35
    for k in range(1, int(1800 // f) + 1):
        fk = f * k; dk = d1 / (1 + 0.6 * (k - 1) ** 1.15)
        a = abs(np.sin(np.pi * k * pos)) / k ** 0.7 * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in _DB) + 0.3) * (0.45 if k == 1 else 1.0)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.7 * k * k) * (0.35 * np.exp(-x / (0.1 * dk)) + 0.65 * np.exp(-x / dk))
    return sig
def bass(m, s, g=1.0, pan=-0.14, ring=0.9, room=0.24, until=None):
    """a note on the double bass, plucked at s and let go after ring seconds"""
    if until is not None:
        ring = min(ring, until - s - 0.14)
    if ring <= 0.06:
        return
    f = hz(m); sec = ring + 0.14; x = tt(sec).astype(np.float64)
    sig = _pizz(f, x) * np.minimum(1, x / 0.004) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.12, 1)) ** 2, 1.0)
    nf = int(0.02 * SR); sig[:nf] += 0.05 * np.abs(sig).max() * filt(noise(0.02), 'band', (80, 500))[:nf] * np.exp(-np.arange(nf) / SR / 0.005)
    sig = _room(norm(filt(sig.astype(np.float32), 'low', 1800)), room, 0.03, ring)
    put(_until(sig, s, until), s, g * LV[0] * LT, pan)

# ---- what they play
def turn(s, basses, highs, g=1.0, at=0.45, step=0.24, ring=0.8, until=None):
    """at a turn: the double bass's single notes one after another (never together, never struck as a chord), and over them the cor
    anglais's notes in turn (highs: (note, seconds)), from at seconds after"""
    for i, m in enumerate(basses):
        bass(m, s + step * i, 0.9 * g, ring=ring, until=until)
    t = s + at
    for m, d in highs:
        cor(m, t, d * 0.94, 0.9 * g, until=until); t += d
    return t

def mark(s, g=1.0, step=0.36, until=None, hold=1.6):
    """the series' mark, in D flat: the cor anglais's D flat, E flat and A flat rising, and the double bass takes the A flat an octave
    down and carries it to D flat; the cor anglais lets its A flat go as the double bass takes it, as a load handed on from station to
    station"""
    cor(Db4, s, step * 0.9, g, until=until)
    cor(Eb4, s + step, step * 0.9, g, until=until)
    cor(Ab4, s + step * 2, step + 0.04, g, until=until)
    bass(Ab3, s + step * 3, 0.95 * g, ring=step - 0.03, until=until)
    bass(Db3, s + step * 4, 0.95 * g, ring=hold, until=until)
    return s + step * 4

TUNE = (Db4, F4, Ab4, Gb4, F4, Db4)
def carry(s, step=0.4, g=1.0, alone=False, n=None, last=1.0, gap=0.6, until=None):
    """the film's figure: the cor anglais plays a short tune, and the double bass plays it again after it, the same notes an octave down,
    as what's the utility's own goes on when the part that played it changes. alone: nothing carries it on, and the cor anglais stops
    after n notes, the last one held"""
    notes = list(TUNE[:n] if n else TUNE)
    for i, m in enumerate(notes):
        cor(m, s + step * i, last if i == len(notes) - 1 else step * 0.9, g, until=until)
    t = s + step * (len(notes) - 1) + gap
    if alone:
        return s + step * (len(notes) - 1) + last
    for i, m in enumerate(notes):
        bass(m - 12, t + step * i, 0.95 * g, ring=1.2 if i == len(notes) - 1 else step * 0.95, until=until)
    return t + step * (len(notes) - 1) + 1.2


# =============================================================================================================================
# 1. Kept for 250 years: the opening. Japan, the 1860s: the double bass's first notes and the cor anglais as the map appears, its roads
#    drawn; for over 250 years, D flat; a load handed on from Edo and one from Kyoto, hooves. The road kept by adjusting it: the station
#    at dusk, A flat; its horses counted, hooves, and its porters, feet. The helper villages: G flat; their people and a horse walk in,
#    feet and hooves. Travel growing, feet; two horses led away without paying, hooves, a knock, B flat minor. Further away: the chip, a
#    tick; farmers carrying others' loads, feet, F minor. The duty: paper, and its rise, a line. 1764: the Nakasendō drawn, a line; the
#    farmers who rose, feet; a new demand, B flat minor. The armies on the march, heavy feet westward; their money ran out, a knock. The
#    relay stretched no further: F minor, a load crawling, hooves. 1872: the villages freed, D flat; the first railway drawn, a line, and
#    its train, a low rumble. The main line west, a line; the mountains, a knock; the line to Nagoya, a line, and A flat. 1889: the whole
#    line, a line, D flat, the train Tokyo to Kobe, a rumble, and a traveller on foot, far behind. The utility: twelve years inside, one
#    soft texture; support ends, a knock; locked inside, a knock, B flat minor. Ravi: a part slides out, a breath, a new one set down, a
#    thump; what's the utility's own goes with it: the carry. The title: the relay
LV[0] = 0.9
ow = lambda lid, word, off=0: W('kept', lid, word, off)
oc = lambda lid, off=0: G('kept', lid, off)
END = E('kept')
turn(0.6, [Db2, Ab2, F3], [(Ab4, 1.1), (F4, 1.9)], 0.72, at=0.75)
line(0.8, 2.4, 0.0024, px(500), px(1600))
hooves(ow('year', "Tōkaidō's", -0.2), 3.2, 0.0016, px(1500), px(1250))
hooves(ow('year', "Tōkaidō's", 0.4), 3.0, 0.0014, px(460), px(700))
turn(ow('year', 'two hundred and fifty', -0.2), [Db3, F3], [(Ab4, 0.8), (Db5, 1.6)], 0.62, at=0.4)
turn(oc('kept', -0.6), [Ab2, Eb3], [(C5, 0.7), (Ab4, 1.4)], 0.6, at=0.4)
hooves(ow('kept', 'thirty-six', -0.3), 1.6, 0.0018, px(1320))
hooves(ow('kept', 'then a hundred', -0.1), 1.6, 0.0018, px(1440))
feet(ow('kept', 'hundred porters', -0.1), 1.8, 0.0018, px(1180))
turn(ow('helpers', 'nearby villages', -0.2), [Gb2, Db3], [(Bb4, 0.7), (Db5, 1.4)], 0.6, at=0.4)
feet(ow('helpers', 'people and horses', -1.0), 8.0, 0.0018, px(0), px(560))
hooves(ow('helpers', 'people and horses', -0.6), 7.0, 0.0012, px(0), px(500))
feet(oc('grew', -0.6), 5.0, 0.0014, px(960), pace=1.7)
hooves(ow('grew', 'lords', 0.1), 3.0, 0.0016, px(1600), px(1880))
knock(ow('grew', 'without paying', 0.0), 0.0028, px(1640))
turn(ow('grew', 'without paying', 0.1), [Bb2, F3], [(Db5, 0.7), (Bb4, 1.3)], 0.6, at=0.35)
tick(ow('far', 'further away', -0.1), 0.0016, px(1730))
feet(ow('far', 'farmers', -0.6), 6.0, 0.0018, px(1700), px(1300))
turn(ow('far', 'other people', -0.2), [F2, C3], [(Ab4, 0.7), (F4, 1.4)], 0.6, at=0.4)
sheet(oc('times', -0.4), 0.0036, px(960))
line(ow('times', 'several hundred', -0.4), 1.8, 0.0018, px(960))
line(ow('rose', 'Nakasendō', -0.3), 1.2, 0.002, px(1260), px(640))
feet(ow('rose', 'two hundred thousand', -0.9), 3.0, 0.0018, px(900), pace=1.8)
turn(ow('rose', 'new demand', -0.1), [Bb2, Db3, F3], [(F4, 0.8), (Db4, 1.5)], 0.62, at=0.45)
feet(ow('broke', 'armies', -0.3), 5.6, 0.0022, px(1500), px(460), pace=1.9)
knock(ow('broke', 'money ran out', 0.0), 0.003, px(1000))
turn(ow('need', 'stretched', -0.2), [F2, Ab2, C3], [(C5, 0.8), (Ab4, 1.5)], 0.6, at=0.45)
hooves(ow('need', 'stretched', 0.0), 3.6, 0.0012, px(1450), px(1250), pace=1.2)
turn(ow('ended', 'freed', -0.2), [Db3, Ab3], [(F4, 0.8), (Ab4, 1.6)], 0.6, at=0.4)
line(ow('ended', 'first railway', -0.2), 1.0, 0.0018, px(1090), px(1020))
rumble(ow('ended', 'first railway', 0.8), 2.4, 0.002, px(1090), px(1020))
line(ow('route', 'main line', -0.1), 2.2, 0.002, px(1560), px(760))
knock(ow('route', 'far harder', 0.0), 0.003, px(1000))
line(ow('route', 'Nagoya', -0.3), 1.8, 0.0018, px(1560), px(800))
turn(ow('route', "Tōkaidō's route", -0.2), [Ab2, C3, Eb3], [(Eb4, 0.7), (Ab4, 1.4)], 0.58, at=0.45)
line(ow('whole', 'whole line', -0.3), 2.4, 0.0022, px(1570), px(340))
turn(ow('whole', 'whole line', 0.0), [Db2, Ab2, F3], [(Ab4, 0.6), (Db5, 1.6)], 0.64, at=0.5)
rumble(ow('whole', 'Tokyo to Kobe', -0.1), 3.4, 0.0024, px(1570), px(340))
feet(ow('whole', 'two weeks', -0.5), 3.0, 0.0012, px(1500), px(1460), pace=1.2)
hatch(ow('one', 'twelve years', -0.3), 1.4, 0.0016, px(1015))
knock(ow('one', 'ending its support', 0.0), 0.0028, px(1330))
knock(ow('one', 'locked inside', 0.0), 0.003, px(1015))
turn(ow('one', 'locked inside', 0.1), [Bb2, Db3], [(F4, 0.8), (Db4, 1.4)], 0.6, at=0.4)
whisk(ow('ravi', 'any part', 0.1), 1.0, 0.0018, px(1410), px(1570))
thump(ow('ravi', 'any part', 1.4), 0.0034, px(1410))
carry(ow('ravi', "what's the utility's own", 0.0), 0.4, 0.62, until=END)
t_ = mark(oc('breath', 1.0), 0.72, until=END, hold=1.4)
cor(F4, t_ + 0.35, 1.3, 0.5, until=END)

# 2. Twelve years inside: B flat minor; the maker's letter, paper. The control room bought it: the tool, paper; what it records, a tick
#    each. All twelve years inside, one soft texture; only it can read them, a knock. Its one way out: the export, a breath and paper;
#    the regulator's measure, a tick; little else, a knock. Grace's engineers: their card, paper; the line from those storms, a line;
#    the lines they pick, one soft texture. Without them, a knock; blind, F minor. Only the maker: paper, the lock, a knock; at its
#    price, a tick. Nobody asked: the card, paper, two ticks; how the data would come out: the carry, alone, and nothing takes it up.
#    What else holds the utility like this: the lock, a knock; the data platform's own product, a tick, and G flat, unresolved
LV[0] = 0.9
lw = lambda lid, word, off=0: W('locked', lid, word, off)
lc = lambda lid, off=0: G('locked', lid, off)
turn(S0('locked') + 0.4, [Bb2, F3], [(Db5, 1.4)], 0.56, at=0.6)
sheet(lc('letter', -0.2), 0.0036, px(1580))
sheet(lw('bought', 'bought', -0.4), 0.0034, px(1015))
for word in ('every storm', 'each fault', 'each line that failed'):
    tick(lw('bought', word, -0.1), 0.0016, px(1015))
hatch(lw('inside', 'twelve years', -0.2), 1.4, 0.0016, px(1015))
knock(lw('inside', 'only it can read', 0.0), 0.003, px(1015))
whisk(lw('export', 'one way out', 0.0), 0.6, 0.0016, px(1262), px(1330))
sheet(lw('export', 'one way out', -0.3), 0.0034, px(1590))
tick(lw('export', "regulator's measure", 0.4), 0.0016, px(1400))
knock(lw('export', 'little else', -0.2), 0.0026, px(1400))
sheet(lc('grace', -0.2), 0.0034, px(1590))
line(lw('grace', 'those storms', -0.3), 0.7, 0.0016, px(1206), px(1356))
hatch(lw('grace', 'strengthen', -0.2), 1.2, 0.0014, px(1590))
knock(lw('blind', 'Without them', 0.0), 0.0028, px(1306))
turn(lw('blind', 'blind', -0.1), [F3, Ab3], [(C5, 0.7), (Ab4, 1.4)], 0.56, at=0.4)
sheet(lc('maker', -0.2), 0.0034, px(1580))
knock(lw('maker', 'Only the maker', 0.0), 0.0026, px(1015))
tick(lw('maker', 'at its price', -0.2), 0.0016, px(1580))
sheet(lw('wrong', 'when it was bought', -0.4), 0.0034, px(1580))
tick(lw('wrong', 'when it was bought', 0.0), 0.0015, px(1460))
tick(lw('wrong', 'when it was bought', 0.3), 0.0015, px(1460))
carry(lw('wrong', 'would come out', -0.1), 0.42, 0.52, alone=True, n=4, last=1.2)
knock(lw('harder', 'holds', 0.0), 0.0024, px(1015))
tick(lw('harder', "data platform's", -0.2), 0.0016, px(1700))
turn(lw('harder', "data platform's", 0.0), [Gb2, Db3], [(Bb4, 1.3)], 0.5, at=0.45)

# 3. Build or buy: the two columns, paper, and D flat. Buy: a tool to record storms, a tick. Build: its rules, its measures, data
#    products, a tick each; hosting capacity set down on the platform, a thump. Before buying, ask: the card, paper; each question
#    ticked. The new tool: its card, paper; each night its records go down to the storage, a breath; an open format, and A flat. Its
#    agreement: paper; any day, its seal, a tick, and D flat. The platform the same: its product bought, a tick; built on it, a tick
LV[0] = 0.9
bw = lambda lid, word, off=0: W('buy', lid, word, off)
bc = lambda lid, off=0: G('buy', lid, off)
sheet(bw('start', 'build or buy', -0.4), 0.0034, px(1310))
turn(bw('start', 'build or buy', 0.0), [Db3, F3, Ab3], [(Db5, 1.3)], 0.56, at=0.6)
tick(bw('buy', 'a tool', -0.2), 0.0016, px(950))
for word, x in (('its rules', 1420), ('its measures', 1600), ('data products', 1450)):
    tick(bw('build', word, -0.2), 0.0016, px(x))
thump(bw('build', 'hosting capacity', 0.6), 0.0034, px(970))
sheet(bc('ask', -0.2), 0.0034, px(1060))
for word in ('how the data', 'what format', 'how long'):
    tick(bw('ask', word, 0.0), 0.0016, px(1000))
sheet(bc('new', -0.2), 0.0032, px(1665))
whisk(bw('new', 'each night', -0.2), 1.6, 0.0014, px(1788))
turn(bw('new', 'open format', 0.0), [Ab2, Eb3], [(Ab4, 0.6), (C5, 1.3)], 0.52, at=0.4)
sheet(bc('any', -0.2), 0.0034, px(1060))
tick(bw('any', 'any day', 0.0), 0.0018, px(1236))
turn(bw('any', 'any day', 0.2), [Db2, F3], [(F4, 0.6), (Ab4, 1.2)], 0.5, at=0.4)
tick(bw('platform', 'its product bought', -0.2), 0.0016, px(1420))
tick(bw('platform', "utility's own", -0.2), 0.0016, px(980))

# 4. Seams: the seam drawn, a line, and G flat. Behind it a part slides out, a breath, and a new one comes in, a tick; nothing in front of
#    it changes: the carry. The tables are files: the seam along the platform, a line; an open table format, a tick. Another engine reads
#    them, a line. The logic, code: the repository, paper, and its line to hosting capacity. No seam: schedules, alerts, dashboards, a
#    tick each; the product's own, a knock. Lock-in, a tick; the price of what it does well, a tick, and A flat. What leaving would
#    cost: paper; not found, its seal, a tick. The railway on the road's route: the strip, a line, the train, a low rumble; what changed
#    was what carried the loads: D flat
LV[0] = 0.9
sw_ = lambda lid, word, off=0: W('seams', lid, word, off)
sc_ = lambda lid, off=0: G('seams', lid, off)
line(sc_('what', 0.6), 0.9, 0.0018, px(1090))
turn(sw_('what', 'such as a format', 0.0), [Gb2, Bb2, Db3], [(Db5, 0.6), (Bb4, 1.2)], 0.54, at=0.5)
whisk(sw_('behind', 'replaced', -0.2), 0.9, 0.0016, px(925), px(820))
tick(sw_('behind', 'replaced', 0.7), 0.0018, px(925))
carry(sw_('behind', 'nothing in front', 0.0), 0.4, 0.56)
line(sw_('files', 'files', -0.2), 1.6, 0.0018, px(706), px(1830))
tick(sw_('files', 'open table format', -0.2), 0.0016, px(1410))
line(sw_('read', 'read them', -0.3), 0.6, 0.0014, px(1260))
sheet(sc_('code', -0.3), 0.0034, px(1060))
line(sw_('code', 'logic', 0.6), 0.5, 0.0014, px(960))
for word, x in (('schedules', 970), ('alerts', 1100), ('dashboards', 1250)):
    tick(sw_('not', word, -0.2), 0.0016, px(x))
knock(sw_('not', "product's own", 0.0), 0.0026, px(1100))
tick(sw_('lock', 'lock-in', -0.2), 0.0016, px(1100))
tick(sw_('lock', 'price', 0.0), 0.0016, px(1100))
turn(sw_('lock', 'does well', -0.1), [Ab2, C3], [(Eb4, 0.6), (C5, 1.2)], 0.5, at=0.4)
sheet(sc_('chosen', -0.2), 0.0034, px(1080))
tick(sw_('chosen', 'not found', 0.0), 0.0018, px(1276))
line(sc_('story', -0.2), 1.2, 0.0016, px(860), px(1370))
rumble(sc_('story', 0.4), 2.0, 0.0018, px(860), px(1370))
turn(sw_('story', 'What changed', 0.0), [Db2, F3, Ab3], [(F4, 0.6), (Db5, 1.4)], 0.52, at=0.5)

# 5. A date on every part: the table, paper; the four stages, a tick each as it's named. A date to look at it again, and its maker's
#    end of support: each column written, a line. The storm tool on its way out, a tick; when its maker stopped improving it, a knock,
#    and F minor. Two more near their end, a tick each. Each gets its plan, a tick each; years ahead: D flat
LV[0] = 0.9
dw = lambda lid, word, off=0: W('dates', lid, word, off)
dc = lambda lid, off=0: G('dates', lid, off)
sheet(dw('stage', 'every technology', -0.3), 0.0034, px(1310))
for word, x in (('tried', 1100), ('in use', 1250), ('on its way out', 1420), ('retired', 1620)):
    tick(dw('stage', word, -0.2), 0.0015, px(x))
line(dw('date', 'look at it again', -0.2), 0.8, 0.0014, px(1460))
line(dw('date', 'end of support', -0.2), 0.8, 0.0014, px(1660))
tick(dw('storm', 'on its way out', 0.0), 0.0016, px(1250))
knock(dw('storm', 'stopped improving', 0.0), 0.0024, px(1250))
turn(dw('storm', 'stopped improving', 0.2), [F2, Ab2], [(C5, 0.7), (F4, 1.3)], 0.5, at=0.4)
for i in range(2):
    tick(dw('two', 'near their end', 0.3 * i), 0.0015, px(1250))
for i in range(3):
    tick(dw('plan', 'its plan', 0.25 * i), 0.0014, px(806))
turn(dw('plan', 'years ahead', 0.0), [Db3, Ab3], [(Ab4, 0.6), (F4, 1.3)], 0.5, at=0.4)

# 6. A way out, tested: the exit plan, paper; how it would leave, how long, at what cost, a tick each; the platform's product too, a
#    tick. Untried, a guess: a knock; tried each year, a tick, and A flat. Grace's hosting capacity: its card, paper, its streets' bars,
#    one soft texture. A week in test on another engine: it hops across, a breath; the seven days fill, one soft texture; the same files,
#    a line. Eleven lines changed: the card, paper, and its lines, one soft texture. Unchanged: the card, paper; the contract, the owner,
#    the glossary, a tick each; every number matches: the carry. Set up again: the card, paper, a tick each. The whole platform: the
#    card, paper; about eight months, a tick; a migration, a tick; not a rewrite, a knock. The utility knows what it would take: D flat
LV[0] = 0.9
ew = lambda lid, word, off=0: W('exit', lid, word, off)
ec = lambda lid, off=0: G('exit', lid, off)
sheet(S0('exit') + 1.5, 0.0034, px(1060))
for word in ('how it would leave', 'how long', 'what cost'):
    tick(ew('plan', word, 0.0), 0.0015, px(900))
tick(ew('plan', "platform's own product", -0.2), 0.0015, px(1420))
knock(ew('guess', 'guess', -0.1), 0.0022, px(900))
tick(ew('guess', 'tries it', 0.0), 0.0016, px(820))
turn(ew('guess', 'tries it', 0.2), [Ab2, C3, Eb3], [(Ab4, 0.6), (Eb4, 1.2)], 0.5, at=0.45)
sheet(ec('grace', -0.2), 0.0034, px(1610))
hatch(ew('grace', 'how much solar', 0.0), 1.4, 0.0012, px(1530))
whisk(ew('week', 'runs on', 0.0), 1.2, 0.0016, px(970), px(1410))
hatch(ew('week', 'runs on', 0.4), 3.4, 0.0012, px(1078), px(1306))
line(ew('week', 'same files', -0.3), 0.6, 0.0014, px(1260))
sheet(ec('lines', -0.2), 0.0034, px(1060))
hatch(ew('lines', 'eleven', 0.0), 1.0, 0.0012, px(1250))
sheet(ec('same', -0.2), 0.0034, px(1610))
for word in ('The contract', 'the owner', 'the glossary'):
    tick(ew('same', word, 0.0), 0.0015, px(1500))
carry(ew('same', 'every number matches', 0.0), 0.4, 0.54)
sheet(ec('again', -0.2), 0.0034, px(1060))
for word in ('its schedule', 'its alerts', 'who may read it'):
    tick(ew('again', word, -0.2), 0.0015, px(900))
sheet(ec('whole', -0.2), 0.0034, px(1610))
tick(ew('whole', 'eight months', -0.2), 0.0016, px(1500))
tick(ew('whole', 'a migration', 0.0), 0.0016, px(1480))
knock(ew('whole', 'not a rewrite', 0.0), 0.0024, px(1480))
turn(ew('known', 'knows', -0.1), [Db2, Ab2], [(Ab4, 0.6), (Db5, 1.3)], 0.5, at=0.4)

# 7. Twelve winters, kept: Grace's ticket, paper; kept, A flat. The maker brings the twelve years out, one breath as they fly to be
#    checked, and each one checked, one soft texture. They land in the storage, a breath; storm history set down, a thump; owned by
#    network: the carry. From March the new tool: its card, paper; each night's records go down, a breath. Checked in test, a tick; the
#    ticket closes, a tick. The old tool switched off, a knock. Next year's work, chosen from all twelve winters: the card, paper, and
#    D flat
LV[0] = 0.9
tw = lambda lid, word, off=0: W('storm', lid, word, off)
tc = lambda lid, off=0: G('storm', lid, off)
sheet(S0('storm') + 1.5, 0.0034, px(1610))
turn(tw('ticket', 'kept', -0.1), [Ab2, C3, Eb3], [(C5, 1.3)], 0.5, at=0.5)
whisk(tw('out', 'all twelve years', -0.3), 1.8, 0.0014, px(1015), px(1560))
hatch(tw('out', 'checks each', 0.1), 1.8, 0.0012, px(1560))
whisk(tw('land', 'land', -0.2), 1.6, 0.0014, px(1560), px(1740))
thump(tw('land', 'storm history', 0.5), 0.0034, px(1410))
carry(tw('land', 'owned by network', 0.0), 0.4, 0.52)
sheet(tc('night', -0.3), 0.0032, px(1665))
whisk(tw('night', "each night's", -0.2), 1.4, 0.0012, px(1788))
tick(tw('check', 'check them', 0.0), 0.0015, px(1610))
tick(tw('check', 'ticket closes', 0.0), 0.0018, px(1420))
knock(tw('off', 'switched off', 0.0), 0.0024, px(1015))
sheet(tc('winters', -0.3), 0.0032, px(1010))
turn(tw('winters', 'twelve winters', -0.2), [Db3, F3, Ab3], [(F4, 0.6), (Db5, 1.3)], 0.5, at=0.45)

# 8. The whole practice, on the map: its layers, paper, and D flat; its owner and its files, a tick each. Grace's role, a tick, and
#    its line. Hosting capacity, its service and its contract, a tick each. What it means: its line, and the business object, a tick.
#    The data object, a tick; realises, its line, and A flat. The pipeline and models, a tick; owned by network, a tick. The output
#    port and the website, a tick each, and the line between them. The platform's services, one soft texture; realised, a line;
#    Databricks, a tick. The artifacts: realised, a line; the models, a tick, and their line; the utility's own, drawn round them, a
#    line. The seam runs between them: a line, and G flat; another product, a tick, and its line. What breaks: the light up to Grace,
#    a line, and F minor rising. The three series named, a tick each; this series: D flat
LV[0] = 0.9
aw = lambda lid, word, off=0: W('practice', lid, word, off)
ac = lambda lid, off=0: G('practice', lid, off)
sheet(S0('practice') + 0.3, 0.0034, px(960))
turn(S0('practice') + 0.5, [Db2, Ab2, Db3], [(F4, 0.6), (Ab4, 1.2)], 0.48)
tick(aw('intro', 'owner', -0.2), 0.0016, px(510))
tick(aw('intro', 'files', -0.2), 0.0016, px(1638))
tick(aw('owner', "data owner's", -0.2), 0.0015, px(510))
line(aw('owner', 'role', 0.0), 0.4, 0.0013, px(510))
tick(aw('product', 'Hosting capacity', -0.2), 0.0015, px(870))
tick(aw('product', 'its service', -0.2), 0.0014, px(1245))
tick(aw('product', 'its contract', -0.2), 0.0014, px(1245))
line(aw('term', 'What it means', -0.1), 0.8, 0.0013, px(1020), px(1420))
tick(aw('term', 'business object', -0.2), 0.0015, px(1635))
tick(aw('info', 'data object', -0.2), 0.0015, px(1635))
line(aw('info', 'realises', 0.0), 0.5, 0.0013, px(1800))
turn(aw('info', 'realises', 0.3), [Ab2, Eb3], [(Eb4, 0.6), (C5, 1.2)], 0.46, at=0.4)
tick(aw('app', 'pipeline and models', -0.2), 0.0015, px(1190))
tick(aw('app', 'owned by network', -0.1), 0.0014, px(1190))
tick(aw('port', 'output port', -0.2), 0.0015, px(775))
tick(aw('port', 'website', -0.2), 0.0014, px(485))
line(aw('port', 'website reads', 0.0), 0.5, 0.0013, px(660), px(600))
hatch(aw('tech', "platform's services", -0.2), 0.9, 0.0012, px(455), px(915))
line(aw('tech', 'realises', 0.0), 0.6, 0.0013, px(680))
tick(aw('tech', 'Databricks', -0.2), 0.0015, px(690))
line(aw('files', 'open format', 0.0), 0.6, 0.0013, px(1638))
tick(aw('files', 'the models', -0.2), 0.0015, px(1265))
line(aw('files', 'as code', 0.0), 0.5, 0.0013, px(1265))
line(aw('files', "utility's repository", -0.2), 1.2, 0.0013, px(1100), px(1850))
line(aw('seam', 'seam runs', -0.2), 1.4, 0.0016, px(1055))
turn(aw('seam', 'seam runs', 0.4), [Gb2, Db3], [(Db5, 0.6), (Bb4, 1.3)], 0.48, at=0.45)
tick(aw('seam', 'Another product', -0.2), 0.0015, px(690))
line(aw('seam', 'same files', 0.0), 0.5, 0.0013, px(1100), px(1010))
line(aw('up', 'what breaks', -0.2), 2.8, 0.0016, px(1638), px(510))
turn(aw('up', 'lead up', -0.1), [F2, C3, F3], [(F4, 0.4), (Ab4, 0.4), (C5, 1.2)], 0.48, at=0.5)
for word in ('Business architecture', 'Data architecture'):
    tick(aw('three', word, 0.1), 0.0014, px(960))
turn(aw('three', 'this series', 0.1), [Db2, F3, Ab3], [(Ab4, 0.6), (Db5, 1.4)], 0.48, at=0.5)

# 9. Kept, never finished: the road at dusk, D flat; horses added, villages called on, rules rewritten, a tick each. A porter carries a
#    load in from the villages, feet; it broke them: B flat minor. The railway's bank laid in, a line, and a train going by, not
#    stopping, a low rumble; the towns declined: F minor. The utility: products end, a knock; needs grow, people move on, a tick each.
#    So it's kept: each part with a stage and a date, a way out tested, the map changed, a tick each. What's the utility's own goes with
#    it: the carry. "Next", a tick. The end card: the relay
LV[0] = 0.9
zw = lambda lid, word, off=0: W('end', lid, word, off)
zc = lambda lid, off=0: G('end', lid, off)
turn(S0('end') + 0.4, [Ab2, Db3, F3], [(F4, 0.6), (Ab4, 1.3)], 0.54, at=0.5)
for word, x in (('horses added', 800), ('villages called', 960), ('rules rewritten', 1120)):
    tick(zw('road', word, -0.2), 0.0015, px(x))
feet(zc('never', -1.0), 7.0, 0.0018, px(330), px(900), pace=1.3)
turn(zw('never', 'broke them', -0.2), [Bb2, Db3, F3], [(Db5, 0.7), (Bb4, 1.3)], 0.52, at=0.45)
line(zw('towns', 'railway came', -1.2), 1.2, 0.0016, px(1900), px(0))
rumble(zw('towns', 'railway came', 0.0), 4.6, 0.0022, px(1900), px(0))
turn(zw('towns', 'declined', -0.1), [F2, Ab2, C3], [(Ab4, 0.7), (F4, 1.4)], 0.5, at=0.45)
knock(zw('kept', 'products end', -0.1), 0.0022, px(1100))
tick(zw('kept', 'needs grow', -0.1), 0.0015, px(1260))
tick(zw('kept', 'people move on', -0.1), 0.0015, px(1430))
for word in ('a stage', 'a way out', 'the map'):
    tick(zw('each', word, 0.0), 0.0016, px(1260))
carry(zw('data', "utility's own", 0.0), 0.4, 0.56)
tick(zc('next', -0.1), 0.0018, px(1260))
t_ = mark(zc('breath', 0.7), 0.68, until=TOT, hold=2.6)
cor(F4, t_ + 0.5, 2.4, 0.45, until=TOT)
