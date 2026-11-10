# When someone falls behind: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, its own (the module's palettes.md: chosen by this film's thread on 10 November 2026, since the film was added that day and
# no lead was reserved for it; no score on main or on any branch has it, and no other module's palette names it): a lute-harpsichord,
# made here, as music.py has none.
#  - The lute-harpsichord (Lautenwerck): a harpsichord strung with gut instead of wire, so its quills pluck a lute's soft, round tone from
#    a keyboard. One instrument, set up for what it does best: the film's "fit for the role". Each note is a quill plucking a gut string
#    near its end, warm in the low and middle partials, with little above 2 kHz, and dying away in a second or two; the key's release
#    lets the damper stop it.
#  - Its partner, the thread's choice: the same instrument's buff stop, a strip of felt pressed against the strings, so each note is short
#    and muted, almost a pizzicato. The same strings, set another way. Every other plucked or struck colour the site lacks belongs to
#    another culture or sounds like one the site has (the module's long list), as the module's other threads found.
# The mark: a phrase that stumbles, then steadies. E G# B C# B G# A B E: in the opening, when the plant fails, it's played with one note
#    late and one played twice; at each return a little steadier; at the close it runs smooth, with one note still a touch late: lifting
#    someone's work comes unevenly, and that's fine.
# E major, C sharp minor for the problem. Every chord is tuned pure from E (just intonation, see hz()): E, A and B major, C sharp and G
#    sharp minor are pure in this table; F sharp minor, and F sharp held with A, are not, and are never played or held together.
#    Nothing Japanese for Toyota, no car horn, engine or factory hooter for the plant (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one string, steady, no vibrato or bend, its partials harmonic; each damped before it would ring
#    into the next chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/fb_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    """when a word of a line is spoken, as the film's own wAt() estimates it; a missing word, or one inside a longer word, stops the mix"""
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1984)  # this film's own randomness: the room, the paper, the line

# ---- tuning: just intonation from E, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 40, 12)
    return 82.40689 * 2 ** o * _JI[pc]
E2, Gs2, A2, B2, Cs3, Ds3, E3, Fs3, Gs3, A3, B3 = 40, 44, 45, 47, 49, 51, 52, 54, 56, 57, 59
Cs4, Ds4, E4, Fs4, Gs4, A4, B4, Cs5, Ds5, E5, Gs5, B5 = 61, 63, 64, 66, 68, 69, 71, 73, 75, 76, 80, 83

# ---- the levels: the plucked gut and the buff stop matched by loudness, as far under the voice as the module's other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LG, LB, FX = 0.06, 0.07, 3.2
LV = [1.0]

# a small wooden room round the instrument, ringing for about a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig

# ---- a plucked gut string's partials: harmonic, shaped by where the quill plucks it (close to the nut: a comb with few deep notches),
# gut's softness (the high partials weaker and gone sooner), and nothing above top. The seventh partial and the few above it that are out of
# tune with a 5-limit scale are kept low
_comb = lambda k, at: abs(np.sin(np.pi * k * at))
_ODD = {7: 0.25, 11: 0.35, 13: 0.35, 14: 0.25}
PLUCK = 0.13
def _gut(f0, x, t1, soft, top=2300):
    sig = np.zeros(len(x))
    for k in range(1, 32):
        fk = f0 * k
        if fk > top:
            break
        a = _comb(k, PLUCK) / (k * PLUCK * np.pi) / k ** 0.55 * np.exp(-(k - 1) / soft) * _ODD.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * fk * x + 0.3 * k) * np.exp(-x / (t1 / (1 + 0.6 * (k - 1))))
    return sig
def _quill(sec, n):
    """the quill catching and passing the string: a tiny, soft click, low-passed"""
    x = np.arange(n) / SR; q = filt(noise(sec + 0.02)[:n], 'band', (300, 1400)) * np.exp(-x / 0.003)
    return q / max(1e-9, float(np.abs(q).max()))

def gut(m, s, g=1.0, pan=None, ring=None, room=0.25, until=None):
    """the lute stop: a gut string plucked by its quill at s; the key is held ring seconds, then the damper stops it"""
    f0 = hz(m); t1 = 1.6 * (196 / f0) ** 0.35; d = ring if ring else 1.0
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _gut(f0, x, t1, 3.4 * (196 / f0) ** 0.4)
    sig *= (1 - np.exp(-x / 0.0016)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.03 * _quill(sec, n)
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (160, 400))   # the case and soundboard, warm
    sig = _until(_room(norm(filt(filt(sig, 'low', 2200), 'high', 60)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LG, max(-0.35, min(0.35, (m - 64) * 0.02)) if pan is None else pan)

def buff(m, s, g=1.0, pan=None, ring=0.25, room=0.15, until=None):
    """the buff stop: the same string plucked with felt pressed against it, so it speaks softly and stops within a quarter second"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.08, until - s - 0.2))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _gut(f0, x, 0.22, 1.6, 1400)
    sig *= (1 - np.exp(-x / 0.003)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.04))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.04 * _quill(sec, n)
    sig = sig.astype(np.float32); sig = sig + 0.35 * filt(sig, 'band', (110, 260))
    sig = _until(_room(norm(filt(filt(sig, 'low', 1500), 'high', 45)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LB, -0.12 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.11, ring=2.0, until=None, lowest=True):
    """a chord spread from its lowest string up, the lowest on the buff stop when it's low, the keys released together"""
    for i, m in enumerate(notes):
        r = max(0.4, ring - step * i)
        (buff if (lowest and i == 0 and m < A3) else gut)(m, s + step * i, g, None, r if not (lowest and i == 0 and m < A3) else 0.35, until=until)
def figure(notes, s, g=1.0, step=0.22, ring=0.5, last=None, hand=None, until=None, times=None):
    """a short figure, a note at a time; times (optional) gives each note's own offset, for a phrase that stumbles"""
    k = len(notes)
    for i, m in enumerate(notes):
        r = last if (last and i == k - 1) else ring
        at = s + (times[i] if times else step * i)
        (hand or gut)(m, at, g, None, r, until=until)
PHRASE = (E4, Gs4, B4, Cs5, B4, Gs4, A4, B4, E4)
def mark(s, g=1.0, step=0.2, steady=1.0, last=2.2, octave=0, bass=(), until=None):
    """the mark: E G# B C# B G# A B E. steady (0 to 1): at 0 the fourth note comes late and the sixth is played twice; at 1 it runs even,
    but for the seventh, still a touch late"""
    notes = list(m + 12 * octave for m in PHRASE); times = [step * i for i in range(len(notes))]
    late = (1 - steady) * 0.22 + 0.05
    times[3] += late; times = [tt + (late if i > 3 else 0) for i, tt in enumerate(times)]
    times[6] += 0.06
    if steady < 0.5:
        notes.insert(6, notes[5]); times.insert(6, times[5] + step * 0.5); times = times[:6] + [times[6]] + [tt + step * 0.5 for tt in times[7:]]
    figure(tuple(notes), s, g, step, 0.5, last, gut, until, times)
    for m, i, r in bass:
        buff(m, s + times[min(i, len(times) - 1)], 0.9 * g, None, r, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.006, pan=0.0):
    """a sheet laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down, a pill or a tag: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a line drawn out on a chart: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def gate(s, sec=2.0, g=0.005, pan=0.0):
    """the gate's two leaves rolled shut on their wheels: a low, even roll that slows, and a soft, dull meeting"""
    n = int((sec + 0.4) * SR); x = np.arange(n) / SR
    roll = filt(noise(sec + 0.42)[:n], 'band', (80, 500)) * _bump(x, sec, 1.2) * (x < sec)
    _fx(roll + 0.6 * _knock(n, 95, 0.05, sec), s, g, pan, 900)
def line(s, sec=3.0, g=0.004, pan=0.0):
    """the line moving, heard from the floor: one soft, low texture of carriers on rails that swells in and fades, never a clatter"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 5); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (70, 380)) * _bump(x, sec, 1.3) * gr, s, g, pan, 600)
def halt(s, sec=1.3, g=0.004, pan=0.0):
    """the line slowing to a stop: the same low texture, falling away"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (60, 300)) * np.clip(1 - x / sec, 0, 1) ** 1.5 * np.minimum(1, x / 0.1), s, g, pan, 500)
def cord(s, g=0.005, pan=0.0):
    """the cord pulled: a soft creak of rope through its eye, then the lamp's switch, one dull click"""
    n = int(0.5 * SR); x = np.arange(n) / SR
    cr = filt(noise(0.52)[:n], 'band', (300, 900)) * _bump(x, 0.22, 1.5) * (x < 0.22)
    _fx(cr + 0.5 * _knock(n, 260, 0.01, 0.3), s, g, pan, 1400)
def steps(s, n=4, g=0.004, pan0=0.0, pan1=0.0, gap=0.42):
    """someone walking over: a few soft footfalls on a concrete floor, each one low and dull"""
    for i in range(n):
        m = int(0.12 * SR)
        _fx(_knock(m, 110, 0.022) + 0.2 * filt(noise(0.14)[:m], 'band', (150, 600)) * np.exp(-np.arange(m) / SR / 0.01), s + gap * i, g, pan0 + (pan1 - pan0) * i / max(1, n - 1), 900)

# =============================================================================================================================
# 1. Same people, another way: the opening. Fremont, 1982: E major as the works comes in, low; the gate rolled shut, and C sharp minor
#    under the jobs lost. The line, far off, as one soft texture; the empty place, the buff stop's low C#; the complaints' card; the doors
#    left out, and the mark, stumbling: one note late, one played twice. Many said it was the workers: G sharp minor, low; the harm, the
#    buyers' and the workers' cards; nothing under "Something had to change". 1984: A major as the plant reopens, and the workers come
#    back, a note each, rising; the arc across the Pacific: B major spread slowly; the teams, E major; the cord pulled, the lamp's click,
#    the team leader's steps, and the line halting. The results: three cards, and the mark, steadier now; the two sides, both right: a C#
#    minor that resolves to A; the same people: E major. The empty desk; and E major, held, under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('nummi', lid, word, off)
oc = lambda lid, off=0: G('nummi', lid, off)
END = E('nummi')
buff(E2, 0.5, 0.8, 0.0, ring=0.4)
chord((E3, B3, E4, Gs4), ow('when', 'Fremont', 0.2), 0.65, step=0.17, ring=2.8)
card(ow('when', 'Fremont', -0.2), 0.004, px(430))
gate(ow('close', 'closes', -0.1), 2.2, 0.005, px(960))
chord((Cs3, Gs3, Cs4, E4), ow('close', 'thousands', 0.0), 0.55, step=0.16, ring=2.2)
card(ow('name', 'worst', -0.3), 0.004, px(1480))
line(oc('absent', -0.2), 3.4, 0.004, px(960))
buff(Cs3, ow('absent', 'five', -0.2), 0.7, px(940), ring=0.3)
card(ow('absent', 'complaints', -0.2), 0.0035, px(1520))
mark(ow('cars', 'missing', 0.1), 0.6, step=0.2, steady=0.0, last=1.2, bass=((Cs3, 0, 0.3), (A2, 6, 0.3)))
card(ow('blame', 'said', -0.2), 0.0035, px(960))
chord((Gs2, Ds3, Gs3, B3), ow('blame', 'workers', 0.0), 0.5, step=0.18, ring=1.8)
card(ow('harm', 'bought', -0.2), 0.0035, px(380)); card(ow('harm', 'workers', -0.2), 0.0035, px(1540))
# 1984: A major, and the same people back at the line, a note each, rising
chord((A2, E3, A3, Cs4), oc('reopen', 0.2), 0.6, step=0.16, ring=2.4, until=oc('japan', -0.4))
card(oc('reopen', 0.2), 0.0035, px(960))
for i, m in enumerate((E3, Gs3, B3, Cs4, E4)):
    gut(m, ow('hire', 'same', -0.6 + i * 0.25), 0.45, px((260, 600, 940, 1280, 1620)[i]) * 0.4, ring=0.9)
tap(ow('hire', 'eight', -0.1), 0.0035, px(960))
# the arc across the Pacific, drawn out slowly: B major spread, and a slide for the line drawn
slide(ow('japan', 'fly', -0.2), 2.4, 0.0035, px(960))
chord((B2, Fs3, B3, Ds4, Fs4), ow('japan', 'fly', 0.2), 0.5, step=0.4, ring=2.6)
card(ow('japan', 'Groups', -0.1), 0.0035, px(960))
# small teams: E major; the cord, the lamp, the team leader's steps over, and the line halting
chord((E3, Gs3, B3, E4), ow('teams', 'teams', -0.1), 0.5, step=0.12, ring=1.8)
cord(ow('cord', 'pull', -0.1), 0.005, px(940))
steps(ow('cord', 'pull', 0.4), 4, 0.0035, px(1620), px(1110))
halt(ow('cord', 'stops', -0.3), 1.3, 0.004, px(960))
# within two years: the results, three cards, and the mark again, steadier, low
card(oc('quality', 0.2), 0.0035, px(390)); card(ow('fell', 'Absence', -0.1), 0.0035, px(960)); card(ow('fell', 'study', -0.2), 0.0035, px(1530))
mark(ow('quality', 'years', 0.2), 0.55, step=0.2, steady=0.6, last=1.6, octave=-1, bass=((E2, 0, 0.3), (B2, 8, 0.4)))
# both right about what they saw: C sharp minor resolving to A major; the same people, a different system: E major
card(ow('right', 'Managers', -0.1), 0.0035, px(520)); card(ow('right', 'Workers', -0.1), 0.0035, px(1400))
chord((Cs3, Gs3, Cs4, E4), ow('right', 'Both', -0.1), 0.45, step=0.14, ring=1.2)
chord((A2, E3, A3, Cs4), ow('right', 'saw', 0.3), 0.45, step=0.14, ring=1.6)
tap(ow('same', 'different', -0.1), 0.0035, px(960))
chord((E3, B3, E4, Gs4), ow('same', 'country', 0.1), 0.5, step=0.12, ring=2.0)
# the empty desk, the three things that surround it, a tag each; the title: E major, held, damped before the next chapter
for wd, x in (('taught', 500), ('way', 960), ('asked', 1420)):
    tap(ow('around', wd, -0.1), 0.0032, px(x))
chord((E2, B2, E3, Gs3, B3, E4), oc('breath', 0.3), 0.65, step=0.18, ring=4.4, until=END)

# 2. Behind the team: the university, a year from now. The reports moving onto the platform: one soft slide; reviewed, a tick; the team's
#    line drawn on the chart, and A major as it falls; Tomás's card, and a low E under him; his weeks, uneven: a short figure that keeps
#    pace, then catches on one note; Helena's card; the two pills, green and amber; and B, alone, as she asks
LV[0] = 0.9
bw = lambda lid, word, off=0: W('behind', lid, word, off)
bc = lambda lid, off=0: G('behind', lid, off)
chord((A2, E3, A3, Cs4), S0('behind') + 0.2, 0.55, step=0.16, ring=2.2)
slide(bw('move', 'moves', -0.1), 2.6, 0.0035, px(960))
ticked(bw('code', 'reviewed', -0.1), 0.0045, px(1740))
card(bc('days', 0.0), 0.0035, px(960))
slide(bw('days', 'fall', -0.1), 2.4, 0.0035, px(900))
chord((A3, Cs4, E4), bw('days', '24', 0.3), 0.45, step=0.14, ring=1.4, lowest=False)
card(bw('tomas', 'Tomás', -0.1), 0.004, px(1330))
buff(E2, bw('tomas', 'reads', 0.3), 0.6, None, ring=0.4)
card(bc('less', 0.2), 0.0035, px(1360))
figure((E4, Gs4, B4, A4), bw('less', 'unevenly', 0.4), 0.45, step=0.24, ring=0.45, last=0.9, times=(0, 0.24, 0.48, 0.86))
card(bw('helena', 'Helena', -0.1), 0.004, px(570))
tap(bw('shared', 'shared', -0.1), 0.0035, px(570)); tap(bw('shared', 'One', -0.1), 0.0035, px(570))
gut(B3, bw('ask', 'asks', 0.2), 0.45, None, ring=1.6)

# 3. Find the cause: the two books' cards; the one-to-one: G sharp minor, quiet, then nothing while they talk; each cause's card, and a
#    note of E major's chord as each blocker is cleared (a pill each); the hard time: the buff stop's low C#, alone, and a long rest;
#    back at NUMMI: the cord, and A major; psychological safety: E major, open
LV[0] = 0.9
cw = lambda lid, word, off=0: W('cause', lid, word, off)
cc = lambda lid, off=0: G('cause', lid, off)
card(cw('mager', 'Mager', -0.2), 0.004, px(540)); card(cw('gilbert', 'Gilbert', -0.2), 0.004, px(1380))
chord((Gs2, Ds3, Gs3, B3), cc('wed', -0.1), 0.45, step=0.18, ring=1.6)
card(cw('wed', 'Wednesday', -0.1), 0.0035, px(960))
card(cc('skill', 0.1), 0.0035, px(390))
for lid, word, off, m, x in (('pair', 'pairs', -0.1, E3, 390), ('pair', 'protected', -0.2, Gs3, 390), ('readers', 'become', -0.1, B3, 960), ('patience', 'lighter', -0.2, E4, 1530)):
    tap(cw(lid, word, off), 0.0032, px(x))
    gut(m, cw(lid, word, off + 0.1), 0.45, px(x) * 0.4, ring=1.2)
card(cc('fit', 0.1), 0.0035, px(960))
card(cc('hard', 0.1), 0.0035, px(1530))
buff(Cs3, cw('hard', 'more', 0.3), 0.55, px(1530) * 0.4, ring=0.4)
cord(cc('cord', 0.3), 0.0045, px(940))
chord((A2, E3, A3, Cs4), cw('cord', 'help', 0.0), 0.45, step=0.14, ring=1.8)
card(cc('safe', 0.2), 0.0035, px(960))
chord((E3, B3, E4, Gs4), cw('safe', 'wrong', 0.6), 0.45, step=0.16, ring=2.0, until=E('cause'))

# 4. Against the team's own change: the chart; the two lines drawn as February and June are named; the gap, the buff stop's C#, short;
#    he improved: a rising E G# B; the team, faster; his plan written: a pen; agreed, a tap and A major; the first Wednesdays, one soft
#    tap each as each month comes in, and B major under them
LV[0] = 0.9
gw = lambda lid, word, off=0: W('gap', lid, word, off)
gc = lambda lid, off=0: G('gap', lid, off)
card(S0('gap') + 0.6, 0.0035, px(960))
slide(gw('june', '24', -0.8), 1.4, 0.0035, px(900))
buff(Cs3, gw('june', '35', 0.6), 0.6, None, ring=0.3)
figure((E4, Gs4, B4), gw('faster', 'improved', -0.1), 0.45, step=0.2, ring=0.45, last=1.0)
figure((E4, Gs4, B4, E5), gw('faster', 'faster', -0.1), 0.42, step=0.12, ring=0.4, last=1.2)
tap(gw('own', 'stays', -0.2), 0.0032, px(960))
pen(gw('plan', 'writes', -0.1), 1.0, 0.005, px(610), 4)
tap(gw('plan', 'agrees', -0.1), 0.0035, px(610))
chord((A2, E3, A3, Cs4), gw('plan', 'agrees', 0.2), 0.45, step=0.14, ring=1.6)
for i in range(6):
    tap(gw('month', 'Wednesday', -0.2 + i * 0.27), 0.0025, px(1240 + i * 150))
chord((B2, Fs3, B3, Ds4), gw('month', 'month', 0.4), 0.42, step=0.16, ring=1.8, until=E('gap'))

# 5. Give it time: the lines drawn on through the autumn; September, a short rising figure; October, the same figure catching on a note;
#    December: the mark, steadier still, and the gap: E major; the December evening: G sharp minor, soft; said now, not later: a single
#    B; months, or years: a slow line drawn, and A major, open; private: nothing
LV[0] = 0.9
tw = lambda lid, word, off=0: W('time', lid, word, off)
tc = lambda lid, off=0: G('time', lid, off)
slide(tw('uneven', 'unevenly', -0.2), 3.0, 0.0035, px(1100))
figure((Gs4, B4, Cs5), tw('uneven', 'September', -0.1), 0.42, step=0.18, ring=0.4, last=0.9)
figure((Gs4, B4, B4, A4), tw('uneven', 'October', -0.1), 0.4, step=0.18, ring=0.4, last=0.9, times=(0, 0.18, 0.5, 0.74))
mark(tw('dec', 'half', 0.3), 0.5, step=0.19, steady=0.85, last=1.6, bass=((E2, 0, 0.3), (B2, 8, 0.4)))
chord((Gs2, Ds3, Gs3, B3), tc('honest', -0.1), 0.42, step=0.18, ring=1.6)
card(tw('honest', 'Wednesday', -0.1), 0.0035, px(960))
gut(B3, tw('role', 'now', 0.0), 0.42, None, ring=1.4)
slide(tw('years', 'months', -0.2), 2.0, 0.0032, px(700))
chord((A2, E3, A3, Cs4, E4), tw('years', 'years', 0.4), 0.42, step=0.2, ring=2.2)

# 6. On Monday: back at NUMMI, the line moving, and the mark nearly even; Helena's three pills, a note each (E, G#, B); each piece of
#    advice laid down; the next film's tag; the last line's three pills, and the close: the mark an octave higher, smooth but for one
#    note a touch late, its last note held as E major into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
line(S0('monday') + 0.4, 2.6, 0.0035, px(960))
tap(mw('back', 'people', -0.1), 0.0032, px(960)); tap(mw('back', 'surrounded', -0.1), 0.0032, px(960))
chord((E3, B3, E4, Gs4), mw('back', 'work', 0.4), 0.45, step=0.14, ring=1.8)
for wd, m in (('found', E4), ('cleared', Gs4), ('gave', B4)):
    tap(mw('helena', wd, -0.1), 0.0032, px(1180))
    gut(m, mw('helena', wd, 0.0), 0.42, px(1180) * 0.4, ring=1.0)
card(mc('team', 0.3), 0.0035, px(530))
for lid, word, x in (('cause', 'Ask', 1390), ('clear', 'Clear', 530), ('plan', 'Let', 1390)):
    card(mw(lid, word, -0.1), 0.0035, px(x))
tap(mw('next', 'Growing', -0.1), 0.0032, px(960))
for wd, x in (('Find', 490), ('clear', 960), ('give', 1430)):
    tap(mw('take', wd, -0.1), 0.0032, px(x))
mark(mw('take', 'time', 0.3), 0.5, step=0.24, steady=1.0, last=5.0, octave=1, bass=((E2, 0, 0.4), (A2, 6, 0.4), (E3, 8, 0.5)), until=TOT)
chord((Gs3, B3, E4), mw('take', 'time', 0.3 + 0.24 * 8 + 0.11), 0.45, step=0.0, ring=5.0, until=TOT, lowest=False)
