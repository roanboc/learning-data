# Strategy is a habit: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, row reserved 10 November 2026 after searching every score.py and
# music.py on main and on every branch, and every palettes.md in the project's files, for "sound stone", "klangstein", "singing stone",
# "rubbed stone", "wet hand" and "granite": none): sound stones, made here, as music.py has none.
#  - The sound stone: a block of granite cut into tongues by deep parallel slits, and stroked with wet hands, as the sculptor Elmar Daucher
#    first made one in 1974, the year Molina and Rowland asked their question. A tongue sings only while the hands keep moving over it,
#    and falls quiet when they stop: a habit, kept or lost. Played plain: one stroke for each note, the tone speaking as the hands start,
#    held at one level while they move, with no swell, no vibrato and no slide, its partials harmonic (the hands' stick and slip lock the
#    tongue to one period); when the hands stop, it rings on by itself and settles. Under it, very softly, the wet hands' rub.
#  - Its partner, the thread's choice: a larger stone, an octave lower, stroked once and left to settle. No other colour the site lacks
#    avoids another culture or an instrument the site has (the module's palettes.md). Nothing is borrowed from the opening's world: no
#    alarms, no countdowns, no clocks, no wind.
# The mark: three notes (E flat, G, B flat: a plan), a breath, and the same three again with the last one moved up a step (E flat, G, C:
# the plan, looked at again), so what changed is heard. It is played whole when the treaty builds in its habit and on the title; its
# moved half alone when London goes further; its first half alone, unmoved, when the first review changes nothing and when the next year
# asks the same three questions; whole again, an octave lower, back in Montreal; and at the close, an octave lower, its moved half held.
# E flat major, C minor for the opening's problem. Every chord is tuned pure from E flat (just intonation, see hz()): E flat, A flat and
# B flat major and C and G minor are pure in this table; F minor is not, and is never played. No chapter is urgent: nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: each stroked note held at one level from the hands' start to their stop; each gone before the next chapter.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/sih_scenes.js, and
#    panned to where it is drawn. Everything low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1974)  # this film's own randomness: the room, the hands, the paper


# a stone hall round the stones, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds, the note's held body), as a room
    lifts some pitches and hollows others, and every note should sound as loud as its neighbours"""
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
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.4 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.004, pan=0.0):
    """a sheet laid down: a soft breath of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.19)[:n], 'band', (360, 1700)) * _bump(x, 0.075) * (x < 0.075)
    _fx(fl + 0.55 * _knock(n, 140, 0.02, 0.065) / 1.3, s, g, pan, 1800)
def tap(s, g=0.0035, pan=0.0):
    """something small set down, a tag or a pill: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (240, 1000)) * np.exp(-x / 0.006) + 0.6 * _knock(n, 190, 0.012), s, g, pan, 1500)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """a line drawn out, or a bar moved along: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (190, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1400)
def pen(s, sec=0.6, g=0.0045, pan=0.0, n=2):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 55)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (650, 2000)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2100)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)

# ---- tuning: just intonation from E flat, so a chord's notes are whole-number ratios of each other and nothing beats. E flat, A flat
# and B flat major and C and G minor are pure in this table; F minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
_EB2 = 440.0 * 2 ** ((39 - 69) / 12)
def hz(m):
    o, pc = divmod(m - 39, 12)
    return _EB2 * 2 ** o * _JI[pc]
C2, Eb2, G2, Ab2, Bb2, C3, D3, Eb3, F3, G3, Ab3, Bb3 = 36, 39, 43, 44, 46, 48, 50, 51, 53, 55, 56, 58
C4, D4, Eb4, F4, G4, Ab4, Bb4, C5, D5, Eb5 = 60, 62, 63, 65, 67, 68, 70, 72, 74, 75

LB, LP_, FX = 0.042, 0.07, 3.8
LV = [1.0]
TONGUE = (1.0, 0.24, 0.09, 0.045, 0.02, 0.01)   # a tongue's partials, from its fundamental up: round and plain
LOWSTONE = (1.0, 0.3, 0.1, 0.04)                 # the larger stone's: rounder still

def _hands(x, d, a=0.05, r=0.08):
    """the wet hands moving over the stone, from 0 to d seconds: their soft rub, as a level"""
    return np.clip(x / a, 0, 1) * np.clip((d - x) / r, 0, 1)
def _rub(n, sec):
    """the wet hands' rub: a soft, low hush with a slow grain, at unit level"""
    r = filt(noise(sec + 0.02)[:n], 'band', (320, 1300)); gr = filt(noise(sec + 0.02)[:n], 'low', 4)
    r = r * (0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max())))
    return r / max(1e-9, float(np.sqrt((r ** 2).mean())))

def tongue(m, s, g=1.0, dur=1.6, pan=None, room=0.22, until=None):
    """one tongue, stroked: the tone speaks as the hands start (0.14 s), sings at one level while they move, and when they stop it rings
    on by itself and settles over about a second, its upper partials first; under it, very softly, the hands' rub"""
    f0 = hz(m); d = dur; ring = 0.38
    if until is not None:
        d = min(d, max(0.3, until - s - 0.7))
    sec = d + 1.4; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k, a in enumerate(TONGUE, 1):
        fk = f0 * k
        if fk > 2300:
            break
        sig += a * np.sin(2 * np.pi * fk * x + 1.3 * k) * np.where(x < d, 1.0, np.exp(-(x - d) / (ring / k ** 0.6)))
    sig *= np.where(x < 0.14, np.sin(0.5 * np.pi * np.minimum(x, 0.14) / 0.14) ** 2, 1.0) * np.clip((sec - x) / 0.3, 0, 1)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.015 * _rub(n, sec) * _hands(x, d)
    a, b = (0.25, max(0.35, min(2.0, d))) if d > 0.45 else (0.12, d + 0.1)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 70)), room, a, b), s, until)
    put(sig, s, g * LV[0] * LB, max(-0.35, min(0.35, (m - 63) * 0.02)) if pan is None else pan)

def settle(m, s, g=1.0, hold=0.6, pan=None, room=0.2, until=None):
    """the partner: the larger stone, stroked once: it speaks slowly (0.25 s), sings for a moment, and is left to settle, fading over
    two seconds or so, its upper partials first"""
    f0 = hz(m); h = hold
    if until is not None:
        h = min(h, max(0.3, until - s - 1.4))
    sec = h + 3.0; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k, a in enumerate(LOWSTONE, 1):
        fk = f0 * k
        if fk > 1400:
            break
        sig += a * np.sin(2 * np.pi * fk * x + 0.9 * k) * np.where(x < h, 1.0, np.exp(-(x - h) / (0.9 / k ** 0.7)))
    sig *= np.where(x < 0.25, np.sin(0.5 * np.pi * np.minimum(x, 0.25) / 0.25) ** 2, 1.0) * np.clip((sec - x) / 0.4, 0, 1)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.012 * _rub(n, sec) * _hands(x, h, 0.08, 0.12)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1400), 'high', 40)), room, 0.25, max(0.45, h + 0.3)), s, until)
    put(sig, s, g * LV[0] * LP_, -0.12 if pan is None else pan)

def chord(notes, s, g=1.0, step=0.16, dur=2.0, until=None):
    """a chord stroked from its lowest note up, the lowest on the larger stone when it's low, all left to settle together"""
    for i, m in enumerate(notes):
        dd = max(0.5, dur - step * i)
        if i == 0 and m < Eb3:
            settle(m, s, g, max(0.4, dd - 1.0), until=until)
        else:
            tongue(m, s + step * i, g, dd, until=until)
def figure(notes, s, g=1.0, step=0.3, dur=0.5, last=None, until=None):
    """a short figure, one stroke for each note"""
    for i, m in enumerate(notes):
        tongue(m, s + step * i, g, last if (last and i == len(notes) - 1) else dur, until=until)
MARK, MOVED = (Eb4, G4, Bb4), (Eb4, G4, C5)
def mark(s, g=1.0, shift=0, step=0.3, last=1.6, half=None, low=None, until=None):
    """the mark: three notes, a breath, and the same three again with the last moved up a step; half='plan' or 'moved' plays one half;
    low adds the larger stone under it, low=(note, hold)"""
    t = s
    if half in (None, 'plan'):
        figure(tuple(m + shift for m in MARK), t, g, step, 0.5, 0.8 if half is None else last, until)
        t += 2 * step + 1.2
    if half in (None, 'moved'):
        figure(tuple(m + shift for m in MOVED), t, g, step, 0.5, last, until)
    if low:
        settle(low[0], s if half != 'moved' else t, 0.8 * g, low[1], until=until)
    return t

# =============================================================================================================================
# 1. Look again, for everyone: the opening. The larger stone alone, E flat; E flat major as the world's fridges and spray cans come in;
#    one note left open at the chemists' question. The gases drift up: C minor, rising. Without the layer: the low C and C minor. The
#    station on the ice: a bare fourth; the layer two thirds as thick: a falling figure; "much is still unsure": A flat major, gone before
#    "Something has to change", which has nothing under it. Montreal: E flat major. The habit it builds in: the mark, whole. London goes
#    further: the moved half. Copenhagen brings it forward: its last two notes. The gases gone: E flat major; the layer healing: B flat
#    major; the cancers prevented: E flat, high. A data strategy and its rhythm: a sheet, a tag and four dots. The title: the mark,
#    whole, over the larger stone
LV[0] = 0.85
ow = lambda lid, word, off=0: W('ozone', lid, word, off)
oc = lambda lid, off=0: G('ozone', lid, off)
END = E('ozone')
settle(Eb2, 0.5, 0.85, 2.4, 0.0)
tap(ow('when', 'fridges', -0.1), 0.0035, px(1345))
tap(ow('when', 'spray', -0.1), 0.0035, px(370))
tap(ow('when', 'foam', -0.1), 0.0035, px(540))
chord((Eb3, G3, Bb3, Eb4), ow('when', 'world', -0.1), 0.6, step=0.18, dur=2.8)
card(ow('when', 'gases', -0.2), 0.004, px(900))
card(ow('ask', 'California', -0.3), 0.004, px(490))
tongue(G4, ow('ask', 'where', -0.05), 0.5, 1.6)
chord((C3, Eb3, G3, C4), ow('rise', 'drift', -0.2), 0.55, step=0.3, dur=3.2)
tap(ow('rise', 'ozone', -0.1), 0.0035, px(300))
tap(ow('layer', 'ultraviolet', -0.1), 0.0035, px(1240))
chord((C2, G3, C4, Eb4), ow('harm', 'Without', -0.2), 0.55, step=0.2, dur=3.0)
for word, x in (('skin', 430), ('eyes', 960), ('crops', 1490)):
    tap(ow('harm', word, -0.1), 0.0035, px(x))
card(ow('hole', 'Antarctica', -0.3), 0.004, px(520))
figure((G3, C4), ow('hole', 'Antarctica', 0.0), 0.5, 0.3, 2.4, 2.2)
card(oc('thin', -0.1), 0.004, px(520))
slide(oc('thin', 0.2), 2.6, 0.003, px(520))
figure((G4, Eb4, C4), ow('thin', 'thirds', -0.1), 0.5, 0.3, 0.45, 1.2)
card(ow('late', 'unsure', -0.3), 0.004, px(1390))
chord((Ab2, Eb3, Ab3, C4), ow('late', 'unsure', -0.1), 0.5, step=0.18, dur=3.0, until=ow('late', 'Something', -0.4))
card(ow('sign', 'Montreal', -0.2), 0.004, px(960))
chord((Eb2, Bb2, G3, Eb4), ow('sign', 'Montreal', 0.0), 0.6, step=0.18, dur=2.6)
mark(ow('habit', 'habit', -0.1), 0.55)
card(oc('london', 0.1), 0.004, px(960))
mark(ow('london', 'further', -0.1), 0.55, half='moved', last=1.4)
tap(ow('fund', 'fund', -0.2), 0.0035, px(600))
figure((G4, C5), ow('copen', 'forward', -0.2), 0.5, 0.3, 0.5, 1.4)
tap(ow('loud', 'loud', -0.2), 0.0035, px(960))
card(ow('gone', 'nearly', -0.2), 0.004, px(440))
chord((Eb3, Bb3, Eb4, G4), ow('gone', 'nearly', 0.0), 0.55, step=0.15, dur=2.2)
chord((Bb2, F3, Bb3, D4), ow('heal', 'healing', -0.3), 0.55, step=0.2, dur=3.0)
tap(ow('heal', 'forty', -0.2), 0.0035, px(1400))
tap(ow('heal', 'sixty-six', -0.2), 0.0035, px(1400))
card(ow('skin', 'prevent', -0.2), 0.004, px(1490))
chord((G3, Eb4, Bb4), ow('skin', 'prevent', 0.0), 0.5, step=0.15, dur=2.2)
card(ow('data', 'strategy', -0.2), 0.004, px(960))
tap(ow('data', 'world', -0.1), 0.0035, px(960))
r0 = ow('rhythm', 'rhythm', -0.3)
for i in range(4):
    tap(r0 + 0.2 + i * 0.25, 0.003, px(690 + 180 * i))
mark(oc('breath', 0.4), 0.6, last=2.6, low=(Eb2, 3.0), until=END)

# 2. Reviews in the calendar: the chapter turns on E flat major, low; the approval's sheet, then the one page; Rumelt's core, one note
#    for each part as its tag comes in, building A flat major (they fit together); the calendar, a pen for each date, and one open fourth
#    for the year's own review; the tag; the three questions' sheet, and E flat major under it
LV[0] = 0.9
dw = lambda lid, word, off=0: W('dates', lid, word, off)
dc = lambda lid, off=0: G('dates', lid, off)
chord((Bb2, Eb3, G3, Bb3), S0('dates') + 0.4, 0.55, step=0.16, dur=2.2)
card(dw('april', 'Tuesday', -0.3), 0.004, px(500))
card(dc('page', -0.1), 0.004, px(500))
for word, m, dd in (('diagnosis', Ab3, 4.2), ('guiding', C4, 3.4), ('actions', Eb4, 2.0)):
    tap(dw('kernel', word, -0.1), 0.003, px(1050))
    tongue(m, dw('kernel', word, -0.1), 0.45, dd)
cal0 = dw('calendar', 'puts', -0.2)
card(cal0 + 0.4, 0.004, px(520))
for word in ('July', 'October', 'January'):
    pen(dw('dates', word, -0.2), 0.4, 0.004, px(520))
tap(dc('nocomm', -0.2), 0.0035, px(1150))
pen(dw('year', 'Monday', -0.2), 0.4, 0.004, px(520))
chord((Bb3, Eb4), dw('year', 'Monday', 0.0), 0.45, step=0.0, dur=1.8)
card(dw('three', 'same', -0.6) + 0.4, 0.004, px(540))
chord((G3, Bb3, Eb4), dw('three', 'questions', -0.1), 0.45, step=0.16, dur=2.0)

# 3. The first review: the chapter turns on A flat major; the review's sheet; the measures, and the bar drawn down to 24 days; the
#    risks; the map's history on the screen, its rows drawn; the minutes written; the plan holds: a tick, and the mark's first half,
#    unmoved, over the larger stone
LV[0] = 0.9
jw = lambda lid, word, off=0: W('july', lid, word, off)
jc = lambda lid, off=0: G('july', lid, off)
chord((Ab2, Eb3, C4), S0('july') + 0.2, 0.5, step=0.18, dur=2.2)
card(S0('july') + 0.6, 0.004, px(490))
card(jc('measures', -0.1), 0.004, px(490))
slide(jw('measures', 'twenty-four', -0.6), 1.2, 0.003, px(490))
card(jc('risks', -0.1), 0.004, px(560))
tap(jc('map', -0.1), 0.0035, px(600))
slide(jw('map', 'changed', -0.4), 2.0, 0.003, px(600))
pen(jw('none', 'minutes', -0.3), 0.9, 0.0045, px(590), 3)
ticked(jw('counts', 'holds', -0.2), 0.0045, px(520))
mark(jw('counts', 'holds', -0.2), 0.5, half='plan', last=1.0, low=(Eb2, 0.8), until=E('july'))

# 4. When the world moves: the chapter turns on G minor; the council's decision, the new student, the data the choice needs; the
#    roadmap, its bars drawn, and today's line; the core again, spread along the line: E flat as the diagnosis, its octave below as it
#    grows, G as the policy holds, and the moved note, C, as the actions move; each running note set down; a bar moved up, a bar moved
#    back, and the larger stone, low, for what waits; E flat major as everyone hears why; Noor's map: the platform added, B flat and D;
#    its reason written; the tags; TOGAF's three sheets, and the moved note alone as "some move it" comes in
LV[0] = 0.9
mw = lambda lid, word, off=0: W('moves', lid, word, off)
mc = lambda lid, off=0: G('moves', lid, off)
chord((G2, D3, G3, Bb3), S0('moves') + 0.3, 0.5, step=0.18, dur=2.4)
card(S0('moves') + 0.8, 0.004, px(540))
card(mw('who', 'job', -0.6), 0.004, px(1410))
card(mw('need', 'choose', -0.3), 0.004, px(1410))
s0 = mc('review', -0.3)
card(s0 + 0.5, 0.004, px(960))
slide(s0 + 0.7, 1.6, 0.003, px(960))
tap(mw('review', 'reviews', -0.2), 0.0035, px(1150))
tap(mw('kernel', 'diagnosis', -0.2), 0.0035, px(1500))
tongue(Eb4, mw('kernel', 'diagnosis', 0.0), 0.45, 2.0)
tongue(Eb3, mw('kernel', 'grown', 0.0), 0.4, 2.2)
tongue(G4, mw('kernel', 'guiding', 0.0), 0.45, 2.6)
tongue(C5, mw('kernel', 'move', 0.0), 0.45, 1.6)
tap(mc('up'), 0.0035, px(1500))
slide(mw('up', 'owner', -0.2), 1.6, 0.003, px(700))
tap(mc('waits'), 0.0035, px(1500))
slide(mw('waits', 'mandates', -0.3), 1.6, 0.003, px(1100))
settle(Ab2, mw('waits', 'mandates', 0.0), 0.5, 0.8)
tap(mc('why'), 0.0035, px(1500))
tap(mc('watch'), 0.0035, px(1500))
tap(mw('loud', 'page', -0.3), 0.0035, px(1500))
chord((Bb2, G3, Eb4, G4), mw('loud', 'hears', 0.0), 0.5, step=0.16, dur=2.2)
tap(mc('map'), 0.0035, px(700))
tap(mw('map', 'Noor', -0.2), 0.0035, px(1640))
slide(mw('map', 'platform', -0.2), 1.0, 0.003, px(700))
chord((Bb3, D4), mw('map', 'platform', 0.0), 0.45, step=0.2, dur=1.8)
pen(mw('map', 'reason', -0.2), 0.5, 0.004, px(700))
tap(mw('walk', 'When', -0.2), 0.0035, px(700))
tap(mw('togaf', 'TOGAF', -0.2), 0.0035, px(740))
for word, x in (('fit', 310), ('move', 740), ('new', 1170)):
    card(mw('togaf', word, -0.3), 0.004, px(x))
tongue(C5, mw('togaf', 'move', 0.0), 0.45, 1.6)

# 5. Promised beside delivered: the chapter turns on E flat major; the ledger's sheet; a tick for each promise delivered; the old
#    warehouse's saving: G and the high E flat; what didn't work: the larger stone, a low C; the deans' tags; next year starts from here:
#    its sheet, and the mark's first half, unmoved, for the same three questions, over the larger stone
LV[0] = 0.9
yw = lambda lid, word, off=0: W('year', lid, word, off)
yc = lambda lid, off=0: G('year', lid, off)
chord((Eb2, G3, Bb3, Eb4), S0('year') + 0.3, 0.55, step=0.18, dur=2.4)
card(yw('two', 'promised', -0.3), 0.004, px(680))
for lid in ('days', 'promise', 'people', 'warehouse', 'partners'):
    ticked(yc(lid, 0.1), 0.004, px(900))
chord((G4, Eb5), yw('warehouse', 'saves', -0.1), 0.45, step=0.2, dur=1.8)
tap(yw('didnt', "didn't", -0.1), 0.0035, px(900))
settle(C2, yw('didnt', "didn't", 0.0), 0.55, 0.8)
tap(yw('deans', 'deans', -0.3), 0.0035, px(1575))
tap(yw('deans', 'risk', -0.2), 0.0035, px(1575))
card(yc('next', 0.4), 0.004, px(960))
mark(yw('next', 'same', -0.1), 0.5, half='plan', last=1.2, low=(Eb2, 1.0))
tap(yw('next', 'again', -0.2), 0.0035, px(960))

# 6. On Monday: the treaty's habit on the wall: its sheet, and the mark, whole, an octave lower (the small first step, then the habit of
#    looking again), over the larger stone; a tick for each habit Helena's strategy kept; the list, and each row set down; the whole job:
#    E flat major, wide; the loop's six steps, one note each, rising, and "And again" an octave above where it began; nothing under the
#    takeaway; and the close: the mark an octave lower, its moved half held over the larger stone into the end card
LV[0] = 0.9
nw = lambda lid, word, off=0: W('monday', lid, word, off)
nc = lambda lid, off=0: G('monday', lid, off)
card(S0('monday') + 0.8, 0.004, px(470))
figure(tuple(m - 12 for m in MARK), nw('back', 'first', -0.1), 0.5, 0.3, 0.5, 0.8)
card(nw('back', 'habit', -0.3), 0.004, px(570))
mark(nw('back', 'habit', 0.0), 0.5, shift=-12, half='moved', last=1.6, low=(Eb2, 1.0))
for word in ('quarter', 'moved', 'beside'):
    ticked(nw('helena', word, -0.2), 0.004, px(1200))
card(nc('cal', -0.2), 0.004, px(710))
for lid, word, off in (('read', 'measures', -0.3), ('move', 'loud', -0.4), ('page', 'page', -0.3), ('end', 'promised', -0.3)):
    tap(nw(lid, word, off), 0.003, px(700))
tap(nc('job', -0.2), 0.0035, px(860))
chord((Eb2, Bb2, G3, Eb4, G4), nw('job', 'whole', 0.0), 0.45, step=0.18, dur=3.0)
for word in ('area', 'stages', 'real', 'table'):
    tap(nw('job', word, -0.2), 0.003, px(860))
for word, m in (('Discover', Eb4), ('define', F4), ('plan', G4), ('Deliver', Ab4), ('measure', Bb4), ('improve', C5)):
    tongue(m, nw('loop', word, -0.2), 0.42, 0.9 if m == C5 else 0.5)
tongue(Eb5, nw('loop', 'again', -0.2), 0.42, 1.2)
t1 = nc('take') + _DUR['monday/take'] + 0.45
figure(tuple(m - 12 for m in MARK), t1, 0.5, 0.3, 0.5, 0.8, until=TOT)
t2 = t1 + 2 * 0.3 + 1.2
for i, m in enumerate(tuple(m - 12 for m in MOVED)):
    tongue(m, t2 + 0.3 * i, 0.5, 4.0 - 0.3 * i, until=TOT)
settle(Eb2, t2, 0.45, 3.0, until=TOT)
