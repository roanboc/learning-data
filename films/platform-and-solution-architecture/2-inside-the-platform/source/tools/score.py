# Inside the platform: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The series' palettes: /mnt/project-files/enterprise-architecture/new-architecture-series/palettes.md, this film's row reserved on 12
# November 2026. The town band of about 1600: a cornett and sackbuts, both made here (music.py has neither). Many European towns kept a
# band of them, paid by the town to play for everyone, as the road's owner kept the station on the mountain, and as the platform team
# keeps the part that watches the whole. The site has a cornett (Skills and workflows, with an autoharp) and sackbuts or trombones (Which
# value wins, The question behind the request, Workloads without secrets), never the two together, and no film of this topic plays either.
#  - The lead: a cornett, the curved wooden pipe of about 1600, lip-blown like a trumpet, fingered like a recorder, in its middle and low
#    notes only (G 4 to D 5): soft, without vibrato, each note tongued plainly with a little breath at its start, held level, and gone a
#    moment after the breath stops. Never the phrase of Skills and workflows: single notes, short lines, and the mark.
#  - The partner: sackbuts, the trombones of 1600, narrow-belled and quiet, low (G 2 to D 4): short plain notes and a few held ones, never
#    a slide between them. A chord is a consort of sackbuts, one player to a note, short, at a turn, never held through a change (as
#    Which value wins holds its chords) and never the held, slide-found notes of The question behind the request.
#  - Nothing from the opening's place: no instrument, scale or sound of Japan. The road is heard as hooves and feet on earth, a load set
#    on a horse and a clerk's brush; no bells, horns or drums of the road.
# The series' mark, the relay, in G: the cornett plays G, A and D rising and lets the D go as a sackbut takes it, an octave down, and
# carries it down to G, as a load is handed from one horse to the next. It's played where the relay is first told, where the station on
# the mountain makes the hard stage two, under the title, on sackbuts alone and lower as the road at night closes the story, and at the
# end. G major; E minor for what goes wrong. Every chord is tuned pure from G (just intonation, see hz()): G, C and D major and E and B
# minor are pure in this table; A minor is not, and is never played. No chapter is urgent: nothing pulses.
# The rules the films keep (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: every note held at one level, without vibrato, and let go.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/scenes.js, and
#    panned to where it is drawn. Everything soft: the sackbuts below about 2.2 kHz, the cornett below about 2.8 kHz, the effects below
#    about 2.2 kHz and well under the music.

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
R1 = np.random.default_rng(1618)  # this film's own randomness: the room, the breath, the hooves on the road


# a small room round the players, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, so held notes keep their level (held.py)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
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

def sheet(s, g=0.006, pan=0.0):
    """a card or a page laid down: a short breath of paper, and its faint landing"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.22)[:n], 'band', (300, 1700)) * _bump(x, 0.09, 1.6) * (x < 0.09)
    _fx(fl + 0.5 * _thud(n, 170, 0.02, 0.08) / 1.3, s, g, pan, 1800)
def tick(s, g=0.005, pan=0.0):
    """something small set in place: one soft tick of wood"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1200)) * np.exp(-x / 0.006) * 0.6 + 0.7 * _thud(n, 260, 0.011), s, g, pan, 1500)
def knock(s, g=0.006, pan=0.0):
    """a soft knock on wood, twice: an alert, without a beep"""
    n = int(0.36 * SR)
    _fx(_thud(n, 150, 0.03) + 0.8 * _thud(n, 150, 0.03, 0.17), s, g, pan, 1200)
def line(s, sec=0.9, g=0.005, pan=0.0):
    """a line drawn out across a map or a page: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (220, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1400)
def brush(s, sec=0.6, g=0.005, pan=0.0, n=3):
    """a brush writing in the clerk's book, a stroke at a time: soft and low, each stroke swelling and lifting"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        _fx(filt(noise(d + 0.02)[:m], 'band', (400, 1600)) * _bump(x, d, 0.8), t, g, pan, 1700)
def _moving(sig, s, g, pan0, pan1, k=4):
    """a sound moving across: overlapping pieces, each faded in and out, each panned a little further along"""
    n = len(sig); e = int(0.03 * SR)
    for i in range(k):
        a, b = max(0, i * n // k - e), min(n, (i + 1) * n // k + e); m = b - a; w = np.ones(m, np.float32)
        if a > 0: w[:2 * e] = np.linspace(0, 1, 2 * e)
        if b < n: w[-2 * e:] = np.linspace(1, 0, 2 * e)
        X(sig[a:b] * w, s + a / SR, g * FX, pan0 + (pan1 - pan0) * (i + 0.5) / k)
def feet(s, sec, g=0.004, pan=0.0, pace=1.6, pan1=None):
    """people walking on an earth road, farther off: one soft texture of steps that swells in and fades, not a patter of single steps"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.55 + 0.45 * np.abs(np.sin(np.pi * pace * x + 0.4)) ** 3
    sig = filt(noise(sec + 0.02)[:n], 'band', (90, 520)) * beat * _bump(x, sec, 0.9)
    if pan1 is None:
        _fx(sig, s, g, pan, 600)
    else:
        _moving(norm(filt(np.asarray(sig, np.float32), 'low', 600)).astype(np.float32), s, g, pan, pan1)
def hooves(s, sec, g=0.004, pan=0.0, pace=1.1, pan1=None):
    """a horse walking on an earth road, farther off: four soft falls to a stride, each a dull knock of earth, heard as one texture
    that swells in and fades, never as a patter of single sounds"""
    n = int(sec * SR); x = np.arange(n) / SR; ph = (pace * x) % 1.0
    fall = sum(np.exp(-((ph - c) % 1.0) / 0.045) * w for c, w in ((0.0, 1.0), (0.24, 0.7), (0.5, 0.9), (0.74, 0.65)))
    sig = filt(noise(sec + 0.02)[:n], 'band', (70, 380)) * (0.3 + 0.7 * np.minimum(1, fall)) * _bump(x, sec, 0.8)
    sig = norm(filt(np.asarray(sig, np.float32), 'low', 450)).astype(np.float32)
    if pan1 is None:
        X(sig, s, g * FX, pan)
    else:
        _moving(sig, s, g, pan, pan1)
def load(s, g=0.007, pan=0.0):
    """a load set on a fresh horse: the straw-wrapped bundles' rustle, and their soft, heavy landing"""
    n = int(0.42 * SR); x = np.arange(n) / SR
    ru = filt(noise(0.44)[:n], 'band', (350, 1500)) * _bump(x, 0.22, 1.2) * (x < 0.22)
    _fx(0.5 * ru + _thud(n, 88, 0.06, 0.16) + 0.4 * _thud(n, 130, 0.03, 0.17), s, g, pan, 1300)


# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. G, C and D major
# and E and B minor are pure in this table; A minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 55, 12)
    return 195.9977 * 2 ** o * _JI[pc]
G2, A2, B2, C3, D3, E3, Fs3, G3, A3, B3, C4, D4, G4, A4, B4, C5, D5 = 43, 45, 47, 48, 50, 52, 54, 55, 57, 59, 60, 62, 67, 69, 71, 72, 74

LC, LS, FX = 0.11, 0.075, 5.0
LV = [1.0]

def cornett(m, s, sec=1.0, g=1.0, pan=None, room=0.2, until=None):
    """the cornett, low and soft: a lip-reed on a conical wooden bore, its lowest partials strong and the rest falling away, with a broad
    hump about 1.1 kHz that gives it its voice, between a trumpet's and a recorder's. Each note is tongued plainly: a little breath, the
    partials speaking one after another within a tenth of a second, then held at one level with no vibrato, and gone a moment after the
    breath stops (at sec)"""
    f0 = hz(m)
    if until is not None:
        sec = min(sec, max(0.2, until - s - 0.2))
    rel = 0.07; n = int((sec + rel * 5) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 16):
        fk = f0 * k
        if fk > 2800:
            break
        a = (1 + 0.5 * np.exp(-((fk - 1100) / 350) ** 2)) / k ** 1.25
        sig += a * np.clip(x / (0.028 + 0.011 * (k - 1)), 0, 1) ** 1.5 * np.sin(2 * np.pi * fk * x + 0.6 * k)
    sig *= np.where(x < sec, 1.0, np.exp(-(x - sec) / rel))
    br = filt(noise(n / SR + 0.02)[:n], 'band', (500, 1800)) * np.exp(-x / 0.045)   # the breath as the tongue lets the air go
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.05 * br / max(1e-9, float(np.abs(br).max()))
    sig = _until(_room(norm(filt(filt(np.asarray(sig, np.float32), 'low', 2800), 'high', 120)), room, 0.12, max(0.3, sec)), s, until)
    put(sig, s, g * LV[0] * LC, max(-0.3, min(0.3, (m - 70) * 0.05)) if pan is None else pan)

def sackbut(m, s, sec=0.8, g=1.0, pan=None, room=0.2, until=None):
    """a sackbut, the trombone of 1600, played softly: a narrow bell, so a round, dark voice, its first partials strong, a broad peak
    about 520 Hz, little above 1.5 kHz. Each note is tongued softly, its upper partials blooming in over the first tenth of a second,
    held at one level with no vibrato and no swell, and let go; never a slide from one note to the next"""
    f0 = hz(m)
    if until is not None:
        sec = min(sec, max(0.2, until - s - 0.25))
    rel = 0.09; n = int((sec + rel * 5) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 26):
        fk = f0 * k
        if fk > 2200:
            break
        a = (0.45 + np.exp(-((fk - 520) / 260) ** 2)) * np.exp(-fk / 1700) / k ** 0.85
        sig += a * np.clip(x / (0.045 + 0.014 * (k - 1)), 0, 1) ** 1.6 * np.sin(2 * np.pi * fk * x + 0.8 * k)
    sig *= np.where(x < sec, 1.0, np.exp(-(x - sec) / rel))
    tg = filt(noise(n / SR + 0.02)[:n], 'band', (200, 1100)) * np.exp(-x / 0.03)   # the lips' soft start
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.04 * tg / max(1e-9, float(np.abs(tg).max()))
    sig = _until(_room(norm(filt(filt(np.asarray(sig, np.float32), 'low', 2200), 'high', 50)), room, 0.15, max(0.3, sec)), s, until)
    put(sig, s, g * LV[0] * LS * (1.0 - 0.2 * max(0, (m - 50) / 12)), max(-0.35, min(0.35, (m - 52) * 0.03)) if pan is None else pan)

def consort(notes, s, sec=1.3, g=1.0, until=None, top=None, topsec=None):
    """a chord on a consort of sackbuts, one player to a note, from the bass up, placed a little apart in the room; top: the cornett's
    note above them, the town band whole"""
    k = len(notes)
    for i, m in enumerate(notes):
        sackbut(m, s + 0.014 * i, sec, g * (1.0 if i == 0 else 0.8), -0.3 + 0.6 * i / max(1, k - 1), until=until)
    if top is not None:
        cornett(top, s + 0.06, topsec or sec, 0.75 * g, 0.1, until=until)

RELAY_C, RELAY_S = (G4, A4, D5), (D4, G3)
def relay(s, g=1.0, step=0.34, low=False, until=None, hold=1.3):
    """the series' mark, in G: the cornett's G, A and D rising, and a sackbut takes the D an octave down and carries it down to G; the
    cornett lets its D go as the sackbut takes it, as a load is handed from one horse to the next. low: on sackbuts alone, an octave
    lower"""
    for i, m in enumerate(RELAY_C):
        if low:
            sackbut(m - 12, s + step * i, 1.0 if i < 2 else step + 0.06, 0.9 * g, until=until)
        else:
            cornett(m, s + step * i, step * 0.92 if i < 2 else step + 0.1, g, until=until)
    sackbut(RELAY_S[0] - (12 if low else 0), s + step * 3, step + 0.04, 0.85 * g, until=until)
    sackbut(RELAY_S[1] - (12 if low else 0), s + step * 4, hold, 0.85 * g, until=until)


# =============================================================================================================================
# 1. The hardest stage: the opening. Japan, the early 1600s: a sackbut's low G alone, the road drawn, the band's G major as the Tōkaidō
#    is named, and two cornett notes as its stations light. The station at dusk: C major as it comes in; a horse arriving, the clerk's
#    book laid down and written; the inn lit, a cornett note, pilgrims' feet. The relay, the mark, as each load goes one stage; the load
#    set on the fresh horse, which walks on. Hakone: E minor as one stage is different, the stage drawn out. The climb: the road drawn up
#    the mountain, a sackbut's low B under "no station", the same horse and porter climbing; the same horses: E, then B, low. The road
#    needed a station: D major. Founded: the band's G major as Hakone appears, the households walking in from both ends, the station
#    lit. Two stages: the mark again as the load changes halfway, set on the fresh horse. The utility: C major as Ravi comes in, his
#    parts drawn; the products under them; nothing watches: E and B, low; the part it was missing: D, then G. The title: the mark, then
#    the band's G major
LV[0] = 0.85
ow = lambda lid, word, off=0: W('road', lid, word, off)
oc = lambda lid, off=0: G('road', lid, off)
END = E('road')
sackbut(G2, 0.6, 3.0, 0.8, 0.0)
line(0.8, 2.6, 0.004, px(1000))
consort((G2, D3, G3, B3), ow('year', 'Tōkaidō', -0.1), 1.6, 0.7)
cornett(B4, ow('year', 'station', 0.3), 1.0, 0.55, px(1100) * 0.4)
cornett(D5, ow('year', 'station', 1.2), 1.6, 0.5, px(820) * 0.4)
consort((C3, E3, G3, C4), oc('parts', -0.5), 1.5, 0.6)
hooves(oc('parts', -0.5), 5.0, 0.0035, 0.85, 1.1, 0.35)
sheet(ow('parts', 'clerk', -0.4), 0.005, px(370))
brush(ow('parts', 'writes', 0.0), 2.4, 0.004, px(370), 5)
cornett(G4, oc('inns', -0.3), 1.6, 0.5, px(470) * 0.4)
feet(oc('inns', -1.4), 6.0, 0.003, -0.75, 1.5, -0.2)
relay(ow('stage', 'one stage', -0.1), 0.7)
load(ow('stage', 'moved', 0.7), 0.006, px(1110))
hooves(ow('stage', 'fresh horses', 0.4), 4.0, 0.0035, px(1080), 1.1, -0.5)
consort((E3, G3, B3), ow('hakone', 'different', -0.2), 1.6, 0.6)
line(ow('hakone', 'Odawara', 0.0), 1.6, 0.004, px(1300))
tick(ow('hakone', 'thirty kilometres', -0.2), 0.004, px(1500))
line(oc('climb', -0.4), 2.0, 0.004, px(1000))
hooves(oc('climb', 0.3), 5.5, 0.003, 0.7, 0.8, 0.45)
sackbut(B2, ow('climb', 'no station', -0.2), 1.6, 0.6, px(940) * 0.4)
tick(ow('same', 'Everywhere else', -0.2), 0.0035, px(440))
sackbut(E3, ow('same', 'same horses', -0.2), 0.8, 0.6)
sackbut(B2, ow('same', 'same horses', 0.55), 1.5, 0.6)
feet(ow('same', 'same horses', -0.6), 6.0, 0.003, 0.4, 0.9, 0.15)
consort((D3, Fs3, A3, D4), ow('need', 'station', -0.1), 1.5, 0.55)
consort((G2, D3, G3, B3), ow('founded', 'Hakone', -0.3), 2.0, 0.65, top=D5, topsec=1.8)
tick(oc('founded', 0.0), 0.0035, px(140))
feet(ow('founded', 'fifty households', -0.4), 4.2, 0.003, px(1700), 1.7, px(1100))
feet(ow('founded', 'fifty households', -0.3), 4.2, 0.003, px(220), 1.6, px(800))
cornett(B4, ow('founded', 'run it', -0.3), 1.4, 0.45, px(920) * 0.4)
for k, x in enumerate((560, 1300)):
    tick(ow('two', 'fifteen', -0.4 + 0.3 * k), 0.0035, px(x))
hooves(oc('two', -0.4), 3.5, 0.003, px(1150), 1.1, px(960))
relay(ow('two', 'changed', -0.3), 0.65)
load(ow('two', 'changed', 0.75), 0.005, px(900))
hooves(ow('two', 'halfway', 0.2), 4.0, 0.003, px(800), 1.1, px(300))
consort((C3, E3, G3), oc('ravi', -0.4), 1.4, 0.55, top=C5, topsec=1.2)
tick(ow('ravi', 'Ravi', -0.2), 0.0035, px(290))
line(ow('ravi', 'parts', -0.2), 1.6, 0.004, px(1190))
line(ow('wrong', 'something under', -0.2), 1.8, 0.0035, px(1190))
sackbut(E3, ow('wrong', 'nothing watches', -0.2), 1.2, 0.55, px(1640) * 0.4)
tick(ow('wrong', 'bill', -0.2), 0.0035, px(1190))
sackbut(B2, ow('wrong', 'bill', 0.2), 1.3, 0.5)
consort((D3, A3, Fs3), ow('better', 'gap', -0.1), 1.2, 0.5)
consort((G2, B2, D3, G3), ow('better', 'part it was missing', -0.3), 2.0, 0.55, top=B4, topsec=1.8)
relay(oc('breath', 0.9), 0.6, until=END)
consort((G2, D3, G3, B3), oc('breath', 0.9) + 5 * 0.34 + 0.2, 2.6, 0.5, until=END, top=D5, topsec=2.4)

# 2. Parts before products: Tomás's map, a page laid down; the band at the chapter's turn, G major; the technology layer lit, a tick, the
#    platform's bar drawn in it, the domains above it. Ravi opens it up: the box drawn out, then the drawing's places; the reference
#    architecture named, a tick. Products change: two pills leave and come; what's missing: a sackbut's E, low
LV[0] = 0.9
dw = lambda lid, word, off=0: W('draw', lid, word, off)
dc = lambda lid, off=0: G('draw', lid, off)
sheet(S0('draw') + 0.2, 0.004, px(960))
consort((G2, D3, B3), S0('draw') + 0.3, 1.3, 0.5)
tick(dw('map', 'technology layer', -0.2), 0.0035, px(700))
line(dw('map', 'data platform', -0.2), 0.8, 0.0035, px(1110))
line(dw('map', 'every domain', -0.3), 1.0, 0.003, px(1110))
line(dw('open', 'opens', -0.1), 1.4, 0.004, px(960))
line(dw('open', 'opens', 1.1), 1.4, 0.0035, px(960))
tick(dw('open', 'reference architecture', -0.2), 0.0035, px(1500))
tick(dw('why', 'Products', 0.9), 0.003, px(747))
tick(dw('why', 'Products', 1.5), 0.003, px(1172))
sackbut(E3, dw('why', 'missing', -0.1), 1.2, 0.45, px(1700) * 0.4)

# 3. Four along the way: each part named, a tick; the sources set in above the first, the uses above the last; a sackbut's low G for the
#    four, its D for the last. One record, through all four: it runs along them, one cornett note at each part as it passes
LV[0] = 0.9
aw = lambda lid, word, off=0: W('along', lid, word, off)
ac = lambda lid, off=0: G('along', lid, off)
sackbut(G2, aw('bring', 'Four parts', -0.1), 1.2, 0.45)
for lid, word, x in (('bring', 'Bring', 322), ('store', 'Store', 747), ('process', 'Process', 1172), ('serve', 'serve', 1597)):
    tick(aw(lid, word, -0.25), 0.0035, px(x))
for k, word in enumerate(('billing', 'meters', 'network map')):
    tick(aw('bring', word, -0.2), 0.003, px(180 + 130 * k))
sackbut(D3, aw('serve', 'serve', -0.1), 1.0, 0.4, px(1597) * 0.4)
for k, word in enumerate(('reports', 'dashboards', 'apps', 'other systems')):
    tick(aw('serve', word, -0.2), 0.003, px(1180 + 170 * k))
t0 = aw('inner', 'one record', -0.4)
line(t0, 3.2, 0.0035, px(960))
for k, (m, u) in enumerate(((G4, 0.086), (A4, 0.31), (B4, 0.53), (D5, 0.75))):
    cornett(m, t0 + 3.2 * u, 0.55 if k < 3 else 1.3, 0.45, px(322 + 425 * k) * 0.4)

# 4. Four across it all: the lines down through every part, and the band at the turn, C major; each band named, a tick; observe, last:
#    a cornett's D, held a moment
LV[0] = 0.9
xw = lambda lid, word, off=0: W('across', lid, word, off)
xc = lambda lid, off=0: G('across', lid, off)
line(xw('more', 'across', -0.3), 0.8, 0.0035, px(960))
consort((C3, G3, C4), xw('more', 'across', -0.2), 1.3, 0.5)
for lid, word in (('govern', 'Catalogue'), ('secure', 'Secure'), ('orch', 'Orchestrate'), ('observe', 'observe')):
    tick(xw(lid, word, -0.25), 0.0035, px(420))
cornett(D5, xw('observe', 'whether', -0.1), 1.2, 0.4, px(420) * 0.4)

# 5. A product under each: the band at the turn, D major; Databricks' mark, a tick; each product set in under its part, a tick, the
#    security's three one by one; under observe, nothing: E minor, sackbuts and the cornett's G
LV[0] = 0.9
pw = lambda lid, word, off=0: W('products', lid, word, off)
pc = lambda lid, off=0: G('products', lid, off)
consort((D3, Fs3, A3, D4), pc('under', 0.0), 1.3, 0.45)
tick(pw('under', 'Databricks', -0.3), 0.0035, px(1665))
tick(pw('in', 'Lakeflow Connect', -0.2), 0.0035, px(322))
for k in range(2):
    tick(pw('in', 'kept', -0.2 + 0.8 * k), 0.003, px(747))
tick(pw('in', 'open format', -0.3), 0.003, px(960))
for k in range(2):
    tick(pw('proc', 'Lakeflow pipelines', -0.2 + 0.8 * k), 0.003, px(1172))
    tick(pw('proc', 'Databricks SQL', -0.2 + 0.8 * k), 0.003, px(1597))
tick(pw('gov', 'Unity Catalog', -0.2), 0.0035, px(1650))
tick(pw('gov', 'Lakeflow Jobs', -0.2), 0.0035, px(1650))
for k in range(3):
    tick(pw('sec', 'three', -0.2 + 2.6 * (0.3 + 0.7 * (k + 0.5) / 3)), 0.003, px(1150 + 230 * k))
consort((E3, B3), pw('obs', 'nothing', -0.2), 1.4, 0.5, top=G4, topsec=1.4)

# 6. Nobody watching: the platform's own tables, a page each as it arrives; nobody reads them: a sackbut's low B. The platform with every
#    domain on it, each watching its own, a tick each; the whole, drawn round and left unwatched. Finance's ticket and the bill, a page
#    each, its bars set in; up by half: E minor, low. Which jobs, whose: a tick each. The two poor choices, a page each, each struck out:
#    B minor
LV[0] = 0.9
nw = lambda lid, word, off=0: W('nothing', lid, word, off)
nc = lambda lid, off=0: G('nothing', lid, off)
for word in ('runs', 'query', 'costs'):
    sheet(nw('records', word, -0.3), 0.0035, px(960))
sackbut(B2, nw('nobody', 'Nobody reads', 0.0), 1.4, 0.45)
sheet(nw('nobody', 'Each domain', -0.1), 0.0035, px(960))
for k in range(4):
    tick(nw('nobody', 'watches its own', -0.3 + 0.25 * k), 0.003, px(435 + 340 * k))
line(nw('nobody', 'nobody watches', -0.1), 1.2, 0.0035, px(960))
sheet(nc('bill', -0.2), 0.0035, px(520))
sheet(nc('bill', 0.0), 0.0035, px(1380))
for k in range(4):
    tick(nc('bill', 0.25 + 0.35 * k), 0.003, px(1030 + 100 * k))
consort((E3, G3, B3), nw('bill', 'half', -0.2), 1.6, 0.5)
tick(nw('cant', 'which jobs', -0.3), 0.003, px(520))
tick(nw('cant', 'whose', -0.3), 0.003, px(520))
sheet(nw('choice', 'pay it', -0.2), 0.0035, px(325))
sheet(nw('choice', 'cut every domain', -0.2), 0.0035, px(715))
for k in range(2):
    tick(nw('choice', 'whether', -0.1 + 0.15 * k), 0.003, px(488 + 390 * k))
consort((B2, D3, Fs3), nw('choice', 'whether', 0.0), 1.4, 0.45)

# 7. Whose part it is: back on the mountain, the station by the lake: the band, G major, with the cornett's B; a load coming up to it,
#    hooves. The highest station, its height, the lake: a tick each. The road's owner kept it: C major. Like that station: a cornett B.
#    The platform team's part: G major, low
LV[0] = 0.9
ww = lambda lid, word, off=0: W('whose', lid, word, off)
wc = lambda lid, off=0: G('whose', lid, off)
consort((G2, D3, G3), S0('whose') + 0.3, 1.6, 0.5, top=B4, topsec=1.6)
hooves(S0('whose') + 0.4, 5.0, 0.003, px(1500), 1.0, px(1100))
for word in ('highest', 'seven hundred', 'by the lake'):
    tick(ww('high', word, -0.2), 0.003, px(960))
tick(ww('kept', 'shogunate', -0.2), 0.003, px(960))
consort((C3, E3, G3, C4), ww('kept', "road's owner", -0.2), 1.5, 0.45)
sheet(wc('like', -0.5), 0.0035, px(960))
cornett(B4, ww('like', 'that station', -0.1), 1.2, 0.4)
for k in range(4):
    tick(ww('team', 'business', -0.2 + 0.25 * k), 0.003, px(435 + 340 * k))
tick(ww('team', 'platform team', -0.3), 0.003, px(1560))
consort((G2, B2, D3, G3), ww('team', 'platform team', 0.2), 1.6, 0.45)

# 8. The part that watches: what it was missing, set in under observe, a tick each, and a cornett's G, then B. The dashboard: a
#    page; its runs, its domains' tags, their costs drawn out; a budget for each domain, filling; the alert, a soft knock and a sackbut's
#    low B. What it found: E minor, low, as the job is lit; the warehouse, a tick. The data team's pull requests, a page each, reviewed,
#    a tick each. Back to June's: the band whole, G major; the ticket closed, a tick; each domain's share, drawn in
LV[0] = 0.9
hw = lambda lid, word, off=0: W('watch', lid, word, off)
hc = lambda lid, off=0: G('watch', lid, off)
for k in range(3):
    tick(hw('build', 'missing part', -0.2 + 0.45 * k), 0.003, px(1400 + 150 * k))
cornett(G4, hw('build', 'missing part', 0.0), 0.5, 0.4, px(1500) * 0.4)
cornett(B4, hw('build', 'missing part', 0.5), 1.2, 0.4, px(1500) * 0.4)
sheet(hc('tags', -0.3), 0.0035, px(960))
line(hc('tags', -0.2), 1.4, 0.003, px(400))
line(hw('tags', 'tag', -0.2), 1.4, 0.003, px(520))
tick(hw('tags', 'splits', -0.3), 0.003, px(960))
line(hw('dash', 'what it cost', -0.3), 0.8, 0.003, px(1030))
line(hw('dash', 'budget', -0.2), 1.6, 0.003, px(1500))
knock(hw('dash', 'alert', -0.1), 0.005, px(1490))
sackbut(B2, hw('dash', 'alert', 0.0), 0.9, 0.4, px(1490) * 0.4)
tick(hw('found', 'One job', -0.2), 0.003, px(560))
tick(hw('found', 'three years', -0.3), 0.003, px(960))
consort((B2, E3, G3), hw('found', 'three years', -0.2), 1.5, 0.45)
tick(hc('idle', 0.0), 0.003, px(560))
for k in range(2):
    sheet(hw('fix', 'changes', -0.2 + 0.4 * k), 0.0035, px(960))
    tick(hw('fix', 'reviews', 0.0 + 0.15 * k), 0.003, px(700))
sheet(hc('back', -0.2), 0.0035, px(1380))
sheet(hc('back', 0.0), 0.0035, px(520))
for k in range(2):
    tick(hc('back', 0.5 + 0.8 * k), 0.003, px(1450 + 100 * k))
consort((G2, D3, G3, B3), hw('back', "June's", -0.2), 1.8, 0.5, top=D5, topsec=1.6)
tick(hw('back', 'closes', -0.2), 0.003, px(520))
line(hw('share', 'own share', -0.3), 0.8, 0.003, px(1380))

# 9. The data practice on the map: its two layers, a page each, and the band at the turn, C major; the eight services set in, drawn
#    out, serving every domain; Databricks under them, a page, realising each; the identity provider and the network, a tick each.
#    Without the software: the reference architecture, a tick, and any product under it, drawn round. The gap: its layer, a page; the
#    platform today and the one it should be, a tick each; what's missing: a sackbut's E, low; the gap drawn between them, a tick; the work that closes it:
#    G major, with the cornett's G
LV[0] = 0.9
rw = lambda lid, word, off=0: W('practice', lid, word, off)
rc = lambda lid, off=0: G('practice', lid, off)
sheet(S0('practice') + 0.2, 0.0035, px(960))
sheet(S0('practice') + 0.6, 0.0035, px(960))
consort((C3, G3, C4), S0('practice') + 0.5, 1.4, 0.45)
line(rw('services', 'eight parts', -0.3), 1.2, 0.0035, px(960))
line(rw('services', 'every domain', -0.3), 0.8, 0.003, px(1125))
sheet(rw('software', 'Databricks', -0.3), 0.0035, px(850))
line(rw('software', 'Databricks', 0.0), 0.8, 0.003, px(850))
tick(rw('software', 'identity provider', -0.3), 0.003, px(1709))
tick(rw('software', 'identity provider', 0.0), 0.003, px(1709))
tick(rc('ref', -0.1), 0.003, px(1500))
line(rw('ref', 'any product', 0.0), 1.0, 0.003, px(960))
sheet(rc('gap', -0.3), 0.0035, px(960))
sackbut(E3, rw('gap', 'missing', -0.1), 1.2, 0.45)
tick(rw('gap', 'today', -0.3), 0.003, px(390))
tick(rw('gap', 'should be', -0.3), 0.003, px(1530))
tick(rw('gap', 'drawn', -0.3), 0.003, px(960))
tick(rw('gap', 'work', -0.3), 0.003, px(960))
line(rw('gap', 'closes', -0.2), 0.6, 0.003, px(1320))
consort((G2, D3, B3, G3), rw('gap', 'closes', 0.1), 1.6, 0.45, top=G4, topsec=1.4)

# 10. A station on the mountain: the road at night, its stations lit, loads going both ways: the mark on sackbuts alone, lower, as its
#     two and a half centuries are named. The drawing whole, a page; one part watching the rest, its lines drawn: G major. "Next": a
#     tick. The end card: the mark, then the band's G major, held to the end
LV[0] = 0.9
zw = lambda lid, word, off=0: W('end', lid, word, off)
zc = lambda lid, off=0: G('end', lid, off)
relay(zw('station', 'two and a half', -0.3), 0.55, low=True, hold=1.6)
sheet(zc('data', -0.5), 0.0035, px(960))
line(zw('data', 'watches the rest', -0.3), 1.0, 0.003, px(1240))
consort((G2, B2, D3, G3), zw('data', 'watches the rest', 0.0), 1.8, 0.45, top=D5, topsec=1.6)
tick(zc('next', -0.1), 0.003, px(960))
relay(zc('breath', 0.6), 0.55, until=TOT)
consort((G2, D3, G3, B3), zc('breath', 0.6) + 5 * 0.34 + 0.2, 3.4, 0.45, until=TOT, top=B4, topsec=3.0)
