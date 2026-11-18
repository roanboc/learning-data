# When someone falls behind: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, its own (the module's palettes.md: chosen by this film's thread on 10 November 2026, since the film was added that day and
# no lead was reserved for it; no score on main or on any branch has it, and no other module's palette names it): a lute-harpsichord,
# made here, as music.py has none. Kept when the film was drawn again in Ink line (18 November 2026): only what the picture does changed.
#  - The lute-harpsichord (Lautenwerck): a harpsichord strung with gut instead of wire, so its quills pluck a lute's soft, round tone from
#    a keyboard. One instrument, set up for what it does best: the film's "fit for the role". Each note is a quill plucking a gut string
#    near its end, warm in the low and middle partials, with little above 2 kHz, and dying away in a second or two; the key's release
#    lets the damper stop it.
#  - Its partner, the thread's choice: the same instrument's buff stop, a strip of felt pressed against the strings, so each note is short
#    and muted, almost a pizzicato. The same strings, set another way. Every other plucked or struck colour the site lacks belongs to
#    another culture or sounds like one the site has (the module's long list), as the module's other threads found.
# The mark: a phrase that stumbles, then steadies. E G# B C# B G# A B E: in the opening, as cars leave the line with their doors missing,
#    it's played with one note late and one played twice; at each return a little steadier; at the close it runs smooth, with one note
#    still a touch late: lifting someone's work comes unevenly, and that's fine.
# E major, C sharp minor for the problem. Every chord is tuned pure from E (just intonation, see hz()): E, A and B major, C sharp and G
#    sharp minor are pure in this table; F sharp minor, and F sharp held with A, are not, and are never played or held together.
#    Nothing Japanese for Toyota, no car horn, engine or factory hooter for the plant (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one string, steady, no vibrato or bend, its partials harmonic; each damped before it would ring
#    into the next chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is something a person does or something that comes in on screen, at that moment: a gate rolled shut or open, the line
#    heard from its floor, a complaint handed over and put on a pile, the cord pulled and the line stopping, a tick or a note on a
#    clipboard, a note pressed on the board, a card that says where and when, a panel that comes out of a screen or a phone, a message
#    that comes in or is sent, a line drawn on a chart, a report handed over, the binders lifted off a desk, a marker on a board, a pen
#    in a notebook. Each one below uses the same word and offset as the
#    picture in src/fb_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed. People's
#    steps and what they say have no sound of their own: the voice carries them.
#  - What a hand writes is paced by the film (PK.pace): a row waits until Carmen has walked to it, and a stroke until the pen has crossed
#    to it. So the marker's and the pen's sounds ask the film when each row is written (the people kit's tools/pens.py), and take no
#    word's time: PEN, below.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
import pens
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
# every stroke of the film's three boards (Carmen's) and three pages (Tomás's plan, Helena's notebook), as the film writes them: the
# chapter, who writes at the board (None: a page), and the film's function that gives the rows (src/fb_uni.js)
PEN = pens.written({'A': ('cause', 'carmen', 'fb_boardA'), 'B': ('cause', 'carmen', 'fb_boardB'), 'C': ('gap', 'carmen', 'fb_boardC'),
                    'P': ('gap', None, 'fb_plan'), 'N1': ('time', None, 'fb_note1'), 'N2': ('monday', None, 'fb_note2')})

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

def card(s, g=0.0035, pan=0.0):
    """a card that says where and when, or a sheet that changes hands: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0032, pan=0.0):
    """something small set down or pressed on, a sheet on a pile or a note on the board: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def lift(s, g=0.0035, pan=0.0):
    """a stack of binders lifted off a desk: one dull, low knock of card on wood"""
    n = int(0.14 * SR)
    _fx(_knock(n, 140, 0.026) + 0.2 * filt(noise(0.16)[:n], 'band', (120, 600)) * np.exp(-np.arange(n) / SR / 0.012), s, g, pan, 900)
def slide(s, sec=0.9, g=0.003, pan=0.0):
    """a line drawn out on a chart: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.0045, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def marker(s, sec=1.6, g=0.004, pan=0.0, n=3):
    """a marker on a whiteboard, a word at a time: a soft, low rub, never a squeak"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (350, 1300)) * _bump(x, d, 0.7) * (0.4 + 0.6 * gr), t, g, pan, 1500)
def written(name, hand, g, least=0.28):
    """a board's or a page's rows as the hand writes them (PEN): one soft rub for each row of words and each long mark, a word at a
    time, where the film writes it. A dot, a tick and a short underline are too short to sound"""
    for k in PEN[name]:
        d = k['t1'] - k['t0']
        if d >= least:
            hand(k['t0'], d, g, px(k['x']) * 0.5, max(1, round(d / 0.32)))
def gate(s, sec=2.0, g=0.005, pan=0.0, meet=True):
    """the gate's two leaves rolled on their wheels: a low, even roll that slows; shut (meet), a soft, dull meeting at the end"""
    n = int((sec + 0.4) * SR); x = np.arange(n) / SR
    roll = filt(noise(sec + 0.42)[:n], 'band', (80, 500)) * _bump(x, sec, 1.2) * (x < sec)
    _fx(roll + (0.6 * _knock(n, 95, 0.05, sec) if meet else 0), s, g, pan, 900)
def line(s, sec=3.0, g=0.004, pan=0.0):
    """the line moving, heard from the floor: one soft, low texture of carriers on rails that swells in and fades, never a clatter"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 5); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (70, 380)) * _bump(x, sec, 1.3) * gr, s, g, pan, 600)
def halt(s, sec=1.3, g=0.004, pan=0.0):
    """the line slowing to a stop: the same low texture, falling away"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (60, 300)) * np.clip(1 - x / sec, 0, 1) ** 1.5 * np.minimum(1, x / 0.1), s, g, pan, 500)
def cord(s, g=0.0045, pan=0.0):
    """the cord pulled: a soft creak of rope through its eye, then the lamp's switch, one dull click"""
    n = int(0.5 * SR); x = np.arange(n) / SR
    cr = filt(noise(0.52)[:n], 'band', (300, 900)) * _bump(x, 0.22, 1.5) * (x < 0.22)
    _fx(cr + 0.5 * _knock(n, 260, 0.01, 0.3), s, g, pan, 1400)
def screen(s, g=0.003, pan=0.0):
    """a panel that comes out of a screen: a soft, low tap of its frame"""
    n = int(0.1 * SR); x = np.arange(n) / SR
    _fx(0.7 * _knock(n, 170, 0.02) + 0.3 * filt(noise(0.12)[:n], 'band', (200, 800)) * np.exp(-x / 0.008), s, g, pan, 1000)
def pop(s, g=0.0022, pan=0.0, up=True):
    """a message sent (up) or one that arrives: one soft, round blip that rises, or falls, a little"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    f = 430 * 2 ** ((0.4 if up else -0.4) * np.clip(x / 0.07, 0, 1))
    _fx(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.005) * np.exp(-x / 0.04), s, g, pan, 1600)
L, RT = px(330), px(1590)   # where the cards sit: at the top left, or at the top right


EN = lambda sid, lid, off=0: G(sid, lid) + _DUR[sid + '/' + lid] + off   # when a line ends, as the film's sc.ends has it

# =============================================================================================================================
# 1. Same people, another way: the opening. Fremont, 1982: the card, and E major as the plant comes in, low; the gate rolled shut
#    behind the last of its people (its leaves meet 3.4 s on), and C sharp minor under the jobs lost. The hall: the line heard from
#    its floor as the film cuts in; the card; the station nobody came to, the buff stop's low C#; Joe's complaint handed over, read
#    and put on the pile; the doors left out, and the mark, stumbling: one note late, one played twice; "The problem is the workers":
#    G sharp minor, low. A name that followed them: the buff stop's low G#. 1984: the card, and A major as the plant opens again; the
#    gate rolled open; the card for the same people, hired back, and a note each, rising. Japan: the card, and B major spread slowly.
#    Back in Fremont, in small teams: E major; the cord pulled, the lamp's click, and the line slowing to a stop. Within two years: the
#    card, the mark again, steadier, low, and a tick on the inspector's clipboard. One study: the card. Both were right: the manager's
#    pen on his clipboard, then C sharp minor resolving to A; the same people: E major. Tomás at his desk, looking in turn at what he
#    was taught, what's in his way and what he's asked to do: E, G# and B; and E major, held, under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('nummi', lid, word, off)
oc = lambda lid, off=0: G('nummi', lid, off)
END = E('nummi')
buff(E2, 0.5, 0.8, 0.0, ring=0.4)
card(oc('when', -0.2), 0.0035, L)
chord((E3, B3, E4, Gs4), ow('when', 'Fremont', 0.2), 0.65, step=0.17, ring=2.8)
gate(ow('close', 'closes', -0.2), 3.4, 0.005, px(960))                # the picture: shut = "closes" -0.2, rolled over 3.4 s
chord((Cs3, Gs3, Cs4, E4), ow('close', 'thousands', 0.0), 0.55, step=0.16, ring=2.2)
# the hall, as it was
line(oc('name', -0.5), 3.4, 0.004, px(960))                            # the cut: name -0.5
card(oc('absent', 0.1), 0.0035, L)
buff(Cs3, ow('absent', 'five', -0.2), 0.7, px(1060), ring=0.3)        # the empty station, at 1060
tg = ow('absent', 'complaints', 0.1)
card(tg + 1.0, 0.003, px(1640))                                        # the form changes hands: "complaints" +0.1, taken 1.0 s on
tap(oc('cars', 1.0), 0.003, px(1690))                                  # put on the pile: cars +1.0
mark(ow('cars', 'missing', 0.1), 0.6, step=0.2, steady=0.0, last=1.2, bass=((Cs3, 0, 0.3), (A2, 6, 0.3)))
chord((Gs2, Ds3, Gs3, B3), ow('blame', 'workers', 0.0), 0.5, step=0.18, ring=1.8)
buff(Gs2, ow('harm', 'name', 0.1), 0.6, None, ring=0.35)
# 1984: A major as the plant opens again; its gate rolled open (nothing to meet); the same people back at the gate, a note each, rising
card(oc('reopen', 0.2), 0.0035, L)
chord((A2, E3, A3, Cs4), oc('reopen', 0.2), 0.6, step=0.16, ring=2.4)
gate(ow('reopen', 'reopen', -0.2), 2.6, 0.0045, px(960), meet=False)   # the picture: open = "reopen" -0.2, rolled over 2.6 s
card(oc('hire', 0.1), 0.0035, L)
figure((E3, Gs3, B3, Cs4, E4), ow('hire', 'same', -0.3), 0.45, step=0.3, ring=0.9)
# Japan: B major, spread slowly, as they work beside the people there
card(oc('japan', 0.2), 0.0035, L)
chord((B2, Fs3, B3, Ds4, Fs4), oc('japan', 0.4), 0.5, step=0.4, ring=2.6)
# small teams: E major; Joe pulls the cord (down from "pull" +0.2, the lamp lit 0.15 s later), and the line slows to a stop
chord((E3, Gs3, B3, E4), ow('teams', 'teams', -0.1), 0.5, step=0.12, ring=1.8)
cord(ow('cord', 'pull', 0.15), 0.0045, px(620))
halt(ow('cord', 'the line stops', 0.2), 1.8, 0.004, px(960))          # the picture: stop = "the line stops" +0.2
# within two years: the mark again, steadier, low; the inspector's tick, his hand on the clipboard from "faults"
card(oc('quality', 0.1), 0.0035, L)
mark(ow('quality', 'years', 0.2), 0.55, step=0.2, steady=0.6, last=1.6, octave=-1, bass=((E2, 0, 0.3), (B2, 8, 0.4)))
ticked(ow('quality', 'faults', 0.2), 0.004, px(1300))
card(ow('fell', 'One study', -0.2), 0.0035, L)
# both were right about what they saw: the manager notes the absences (his hand on the clipboard from right +0.8); C sharp minor
# resolving to A major; the same people, a different system: E major
pen(oc('right', 0.8), 0.7, 0.004, px(1100), 2)
chord((Cs3, Gs3, Cs4, E4), ow('right', 'Both', -0.1), 0.45, step=0.14, ring=1.2)
chord((A2, E3, A3, Cs4), ow('right', 'saw', 0.3), 0.45, step=0.14, ring=1.6)
chord((E3, B3, E4, Gs4), ow('same', 'country', 0.1), 0.5, step=0.12, ring=2.0)
# what surrounds him: a note each as he looks; the title: E major, held, damped before the next chapter
for wd, m in (('taught', E3), ('way', Gs3), ('asked', B3)):
    gut(m, ow('around', wd, -0.1), 0.45, None, ring=1.0)
chord((E2, B2, E3, Gs3, B3, E4), oc('breath', 0.3), 0.65, step=0.18, ring=4.4, until=END)

# 2. Behind the team: the university, a year from now, in the room chapter 1 ends in. A major as it opens; the card; Helena presses a
#    report's note on the platform's side of the board; a review comes out of Jun's laptop; the team's days out of Sam's, their line
#    drawn as they fall from 41 to 24, and A major's upper notes as it lands; Tomás's weeks out of his screen, and a short figure that
#    keeps pace, then catches on one note; at Helena's table, the card, and the two lines out of her laptop: the buff stop's low C# as
#    one falls behind; she comes to his desk, and a single B as she asks
LV[0] = 0.9
bw = lambda lid, word, off=0: W('behind', lid, word, off)
bc = lambda lid, off=0: G('behind', lid, off)
chord((A2, E3, A3, Cs4), S0('behind') + 0.4, 0.5, step=0.16, ring=2.2)
card(bw('move', 'the data team', -0.3), 0.0035, L)
tap(S0('behind') + 6.1, 0.003, px(1020))                               # the note pressed on: tPut, 6.1 s in
screen(bw('code', 'reviewed', 0.1), 0.003, px(1590))
screen(bc('days', -0.1), 0.003, px(1570))
t41, t24 = bw('days', '41', -0.2), bw('days', '24', 0.2)
slide(t41, t24 - t41, 0.003, px(1570))
chord((A3, Cs4, E4), bw('days', '24', 0.3), 0.42, step=0.14, ring=1.4, lowest=False)
screen(bc('less', 0.3), 0.003, px(300))
figure((E4, Gs4, B4, A4), bw('less', 'some weeks', -0.1), 0.42, step=0.24, ring=0.45, last=0.9, times=(0, 0.24, 0.48, 0.86))
card(bw('helena', 'as The team', -0.3), 0.0035, RT)
screen(bc('shared', -0.3), 0.003, px(1520))
buff(Cs3, bw('shared', 'falling behind', 0.1), 0.6, px(1520) * 0.4, ring=0.35)
gut(B3, bc('ask', 1.9), 0.42, None, ring=1.4, until=E('behind'))     # Helena at his desk: ask -0.8, 2.6 s of walking

# 3. Find the cause: the seminar's card, and an open fifth as Carmen starts; her marker on the board, a row at a time (PEN); the
#    one-to-one's card, and G sharp minor, quiet, then nothing while they talk; a note of E major's chord as each blocker is cleared:
#    E as he pairs with Jun, G# with the card for his Thursdays, B as the readers become his; June's card, and the buff stop's low C#,
#    alone; a report handed to Sam, and E an octave up as his load is lighter; at NUMMI, the cord, and A major as help comes; Helena
#    lifts the binders off his desk; and Edmondson's board: E major, open
LV[0] = 0.9
cw = lambda lid, word, off=0: W('cause', lid, word, off)
cc = lambda lid, off=0: G('cause', lid, off)
chord((E2, B2, E3, B3), S0('cause') + 0.3, 0.42, step=0.2, ring=2.0)
card(S0('cause') + 0.8, 0.0035, L)
written('A', marker, 0.004)
chord((Gs2, Ds3, Gs3, B3), cc('wed', -0.2), 0.45, step=0.18, ring=1.6)
card(cc('wed', 0.2), 0.0035, L)
gut(E3, cw('pair', 'pairs', -0.1), 0.45, px(700) * 0.4, ring=1.2)
card(cw('pair', 'Thursday', 0.1), 0.0035, L)                           # the card: tTh = "Thursday" -0.5, and 0.6
gut(Gs3, cw('pair', 'Thursday', 0.3), 0.45, None, ring=1.2)
gut(B3, cw('readers', 'become', -0.1), 0.45, px(1560) * 0.4, ring=1.2)
card(cc('hard', 0.2), 0.0035, L)
buff(Cs3, cw('hard', 'more', 0.3), 0.55, None, ring=0.4)
tS = cw('patience', 'For two months', -0.4)
card(tS + 2.6, 0.003, px(690))                                         # the report changes hands: tS + 1.6 + 1.0
gut(E4, tS + 3.0, 0.42, None, ring=1.4)
cord(cw('cord', 'pulling', 0.2), 0.0045, px(620))                      # down from "pulling" +0.25, the lamp lit at +0.4
chord((A2, E3, A3, Cs4), cw('cord', 'help', 0.0), 0.45, step=0.14, ring=1.8)
lift(cw('cord', "Helena's part", -0.6) + 2.1, 0.0035, px(446))         # tLift: tX + 1.4 + 0.1 + 0.6
written('B', marker, 0.004)
chord((E3, B3, E4, Gs4), cw('safe', 'wrong', 0.6), 0.45, step=0.16, ring=2.0, until=E('cause'))

# 4. Against the team's own change: Carmen's board, a row at a time (PEN), and the buff stop's low C# under her question; at Helena's
#    table, the two lines out of her laptop, each drawn to June as the voice says it; he improved: E, G# and B, rising; the gap, the
#    buff stop's C#, short; Tomás writes his plan in his notebook (PEN); "Agreed": A major; and the card for every first Wednesday
LV[0] = 0.9
gw = lambda lid, word, off=0: W('gap', lid, word, off)
gc = lambda lid, off=0: G('gap', lid, off)
buff(Cs3, S0('gap') + 0.4, 0.6, None, ring=0.35)
written('C', marker, 0.004)
screen(gc('feb', 0.3), 0.003, px(1520))
slide(gw('june', '24', -0.1), 0.7, 0.0028, px(1450))
slide(gw('june', '35', -0.1), 0.7, 0.0028, px(1450))
figure((E4, Gs4, B4), gw('faster', 'improved', -0.1), 0.42, step=0.2, ring=0.45, last=1.0)
buff(Cs3, gw('faster', 'faster', 0.0), 0.55, px(1660) * 0.4, ring=0.3)
written('P', pen, 0.0045)
chord((A2, E3, A3, Cs4), EN('gap', 'plan', 2.0), 0.45, step=0.14, ring=1.6)   # "Agreed.": tE = the plan's end +1.6, and 0.4
card(gc('month', 0.2), 0.0035, RT)

# 5. Give it time: September's card; a review comes out of his screen, approved, and a short rising figure; October's card; Jun's
#    two messages come in, and his answer goes; on the campus, the chat out of her phone, and her "No rush." sent; December, at
#    Helena's table: the two lines out of her laptop, drawn on to December, and the mark, steadier still, as the gap closes; the
#    evening's card and G sharp minor, soft; said now, not later: a single B; her notebook (PEN), and A major, open, under "months,
#    or even years"
LV[0] = 0.9
tw = lambda lid, word, off=0: W('time', lid, word, off)
tc = lambda lid, off=0: G('time', lid, off)
card(S0('time') + 0.6, 0.0035, RT)
screen(tw('uneven', 'September', -0.4), 0.003, px(300))
figure((Gs4, B4, Cs5), tw('uneven', 'September', -0.1), 0.42, step=0.18, ring=0.4, last=0.9)
card(tw('uneven', 'In October', 0.4), 0.0035, RT)                      # the card: tO = "In October" -0.2, and 0.6
pop(tw('uneven', 'goes back', -0.2), 0.0022, px(300), up=False)       # j1
pop(tw('uneven', 'twice', -0.1), 0.0022, px(300), up=False)           # j2
ta = EN('time', 'uneven', 1.6)
pop(ta, 0.0022, px(300))                                               # his answer, typed in, sent
screen(ta + 0.6, 0.0028, px(560))                                      # the campus: tC = ta +0.3, its chat out at +0.3
pop(tc('dec', -1.6), 0.0022, px(560))                                  # "No rush.": tb
screen(tc('dec', 0.2), 0.003, px(1520))
slide(tw('dec', '14', -0.1), 0.7, 0.0028, px(1450))
slide(tw('dec', '20', -0.1), 0.7, 0.0028, px(1450))
mark(tw('dec', 'closed', 0.0), 0.5, step=0.19, steady=0.85, last=1.0, bass=((E2, 0, 0.3), (B2, 8, 0.4)))
chord((Gs2, Ds3, Gs3, B3), tc('honest', -0.1), 0.42, step=0.18, ring=1.6)
card(tc('honest', 0.2), 0.0035, RT)
gut(B3, tw('role', 'now', 0.0), 0.42, None, ring=1.4)
written('N1', pen, 0.0045)
chord((A2, E3, A3, Cs4, E4), tw('years', 'years', 0.4), 0.42, step=0.2, ring=2.2)

# 6. On Monday: back at NUMMI, the line heard from its floor in 1982; in 1984, E major as their work changes; Helena comes in with her
#    coffee: a note each as the voice says she found, cleared and gave (E, G#, B); her notebook (PEN); the next film's card; and the
#    close: the mark an octave higher, smooth but for one note a touch late, its last note held as E major into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
line(S0('monday') + 0.4, 2.6, 0.0035, px(960))
chord((E3, B3, E4, Gs4), mw('back', 'work', 0.4), 0.45, step=0.14, ring=1.8)
for wd, m in (('found', E4), ('cleared', Gs4), ('gave', B4)):
    gut(m, mw('helena', wd, 0.0), 0.42, px(1000) * 0.4, ring=1.0)
written('N2', pen, 0.0045)
card(mc('next', 0.3), 0.0035, RT)
mark(mw('take', 'time', 0.3), 0.5, step=0.24, steady=1.0, last=5.0, octave=1, bass=((E2, 0, 0.4), (A2, 6, 0.4), (E3, 8, 0.5)), until=TOT)
chord((Gs3, B3, E4), mw('take', 'time', 0.3 + 0.24 * 8 + 0.11), 0.45, step=0.0, ring=5.0, until=TOT, lowest=False)
