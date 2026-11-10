# From gaps to a roadmap: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (/mnt/project-files/data-management/palettes.md, reserved by this film's thread on 10 November
# 2026, after searching every score.py, music.py, sound.py and audio.py on main and on all 60 branches, and every palettes.md under
# /mnt/project-files/, for "siren", "Seebeck", "Cagniard" and "rings of holes": sirens appear only as sounds to leave out, never as an
# instrument): a double siren, made here, as music.py has none.
#  - The lead: the upper disc of a double siren, the acousticians' instrument of the mid-1800s. Two brass discs turn on one axle, each
#    pierced with rings of holes; air blown up through a ring as the discs turn comes out in puffs, one for each hole that passes, and
#    the puffs are a note. A ring of 24 holes sounds C; rings of 27, 30, 32, 36, 40, 45 and 48 holes sound the rest of a pure major
#    scale at the same speed. Played as a laboratory plays it, never as an alarm: the axle keeps one speed, and a ring is opened for
#    each note, so nothing wails or slides. Each note starts with a soft breath of air as its valve opens, then holds, hollow and
#    reedy, with the faint hiss of the air through the holes; and when the valve closes it stops, with a little of the room after it.
#    No vibrato: one speed, one pitch. Low and soft, below about 2.3 kHz.
#  - The partner, the thread's choice: the lower disc on the same axle, its rings an octave lower (9, 10, 12, 15, 16, 18, 20 and 24
#    holes: G 2, A 2, C 3, E 3, F 3, G 3, A 3 and C 4; a ring needs a whole number of holes, so it has no D or B at this speed). The
#    two discs turn together, so every note of both is locked to one axle: the chords they sound are pure and perfectly still, and
#    never beat. Two lines on one clock, as the trains of a clock-face timetable are.
#  - The mark: two short phrases, one on each disc, that arrive on the same chord at the same moment, as trains from two directions
#    meet at a hub on the hour: above, E 4 and G 4, half a second apart; below, E 3, starting between them; then both arrive together,
#    the lead opening C 5 and E 5, the partner C 3 and G 3: C major, held still. At the hubs, where the trains meet; at "Like Rail
#    2000's first stage, each works on its own"; and under the end card. Never more often, so it never becomes a figure played again.
#  - C major for what connects and works (the timetable, the hubs, the stages, the yes); A minor for the opening's problem (the waits,
#    the losses, the plan that would cost billions) and for the data's own (the gaps, the licence, the half move); F major where a plan
#    is made (the brochure, the packages, the one page); G major where a chapter turns, and E minor for a question. Every note is a
#    whole number of holes on one axle, so every interval is pure: C, F and G major, and A and E minor, are pure in this table. D held
#    with A is not, and they never sound together.
# Nothing Swiss and no railway sounds for the opening (the module's palettes.md): no alphorn, cowbells, post horn, station chimes or
# whistles, no wheels on rails and no guard's call. The trains on the map are marks on paper, and sound as marks on paper do.
# The rules every film of the module keeps (palettes.md, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice; no figure played again soon after itself; music and effects no louder than
#    the governance films'.
#  - Nothing trembles or pulses: each note one ring of holes at one speed, steady, its partials exact multiples of it; each closed
#    before it would ring into the next chapter where the picture changes. No urgent pulse: nothing in this film is a rush.
#  - Every sound is an event on screen, at the moment it appears, as the script plans the picture; each one below uses the same word
#    and offset as src/gr_scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (about 130
#    projects, nine gaps in a layer, the reports) is one soft sound, never one for each.
# And everything stays low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

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
def END(sid, lid, off=0):
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1982)  # this film's own randomness: the air, the room, the paper

# ---- the axle: it turns AX times a second, so a ring of n holes sounds n * AX Hz. 24 holes give C 4 (261.6 Hz)
AX = 261.6256 / 24
# the upper disc's rings (the lead), and the lower disc's (the partner): a note's name gives its number of holes
UP = dict(C4=24, D4=27, E4=30, F4=32, G4=36, A4=40, B4=45, C5=48, D5=54, E5=60, F5=64, G5=72)
LO = dict(G2=9, A2=10, C3=12, E3=15, F3=16, G3=18, A3=20, C4=24)

# ---- the levels: the two discs matched by loudness, as far under the voice as the module's other music; the effects about 12 dB
# under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LS, LB, FX = 0.05, 0.056, 4.0
LV = [1.0]

# a small room round the siren, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry over its held body
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.016 * SR)] = 0; _IR[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR)); _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds, its held body), as a room lifts
    some pitches and hollows others, and every note should sound as loud as its neighbours"""
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

# ---- one ring of holes, opened for d seconds
# the puff of air one hole lets through as it passes the jet: a smooth bump half a hole's period wide. What is heard is how fast the
# flow changes, so each partial is the bump's own, times its number; the wind chest under the disc lifts the partials near 520 Hz a
# little, which gives the siren its hollow, reedy voice
_PUFF = (lambda u: np.where(np.abs(u - 0.5) < 0.25, 0.5 + 0.5 * np.cos(2 * np.pi * (u - 0.5) / 0.5), 0.0))(np.arange(4096) / 4096)
_PK = np.abs(np.fft.rfft(_PUFF))[:40] / 4096
def _chest(f):
    q, f0 = 1.25, 520.0
    return 0.55 + 1.0 / np.sqrt((1 - (f / f0) ** 2) ** 2 + (f / (f0 * q)) ** 2)
def _ring(n, s, d, breath=1.0, top=2300):
    """one ring of n holes, its valve opened at s (a time in the film) for d seconds. Every partial is a whole multiple of the axle's
    turn, from the film's own clock, so two rings open together are locked to each other and never beat"""
    f0 = n * AX; ta, tr = 0.075, 0.11                                         # the valve opening, the air's pressure building; closing
    sec = d + 6 * tr; m = int(sec * SR); x = np.arange(m, dtype=np.float64) / SR
    t0 = int(round(s * SR)) / SR                                              # where the note lands: the axle's angle there
    ang = 2 * np.pi * AX * (t0 + x)
    gate = np.where(x < d, 1.0, np.exp(-(x - d) / tr)) * np.clip((sec - x) / (2 * tr), 0, 1)
    sig = np.zeros(m)
    for k in range(1, 40):
        if k * f0 >= top:
            break
        # the higher partials come in a moment after the fundamental, as the air's pressure builds behind the valve
        on = (1 - np.exp(-x / (ta * (1 + 0.12 * k)))) ** 1.5
        sig += k * _PK[k] * _chest(k * f0) * np.sin(k * n * ang) * on
    sig *= gate
    # the air through the holes: a soft hiss, puffing with the holes as they pass, and a little more of it as the valve opens
    u = (n * ang / (2 * np.pi)) % 1.0
    puff = np.where(np.abs(u - 0.5) < 0.25, 0.5 + 0.5 * np.cos(2 * np.pi * (u - 0.5) / 0.5), 0.0)
    hs = filt(noise(sec + 0.02)[:m], 'band', (max(200.0, 0.8 * f0), min(2000.0, 6 * f0))); hs = hs / max(1e-9, float(np.abs(hs).max()))
    amp = float(np.abs(sig).max()) or 1.0
    sig += amp * (0.05 * puff * gate + 0.06 * breath * (x / 0.05) * np.exp(1 - x / 0.05)) * hs
    return sig.astype(np.float32)

def _open(n, s, d, g, pan, room, until, low):
    if until is not None:
        d = min(d, max(0.3, until - s - 0.5))
    sig = norm(filt(filt(_ring(n, s, d), 'low', 2300), 'high', 50 if low else 80))
    a = min(0.3, 0.5 * d)
    sig = _until(_room(sig, room, a, max(a + 0.2, d)), s, until)
    if len(sig):
        put(sig, s, g * LV[0] * (LB if low else LS), pan)

def up(name, s, d=1.2, g=1.0, pan=None, room=0.3, until=None):
    """a ring of the upper disc, the lead, opened for d seconds from s"""
    _open(UP[name], s, d, g, max(-0.3, min(0.3, (UP[name] - 36) * 0.006)) if pan is None else pan, room, until, False)

def lo(name, s, d=1.6, g=1.0, pan=None, room=0.3, until=None):
    """a ring of the lower disc, the partner, an octave lower, opened for d seconds from s"""
    _open(LO[name], s, d, g, -0.12 if pan is None else pan, room, until, True)

def chord(los, ups, s, d=1.8, g=1.0, gap=0.25, until=None):
    """the two discs together: the partner's rings first, the lead's a moment later, all held still and locked to one axle"""
    for name in los:
        lo(name, s, d, g / max(1, len(los)) ** 0.5, until=until)
    for name in ups:
        up(name, s + gap, max(0.5, d - gap), g / max(1, len(ups)) ** 0.5, until=until)

def mark(t, g=1.0, hold=1.9, until=None):
    """the mark: two short phrases that arrive on the same chord at the same moment, t, as trains from two directions meet at a hub:
    above, E 4 and G 4; below, E 3, starting between them; then together, C 3 and G 3 below, C 5 and E 5 above"""
    up('E4', t - 1.0, 0.42, 0.8 * g, until=until); up('G4', t - 0.5, 0.42, 0.8 * g, until=until)
    lo('E3', t - 0.72, 0.62, 0.85 * g, until=until)
    for name in ('C3', 'G3'):
        lo(name, t, hold + 0.2, 0.75 * g, until=until)
    for name in ('C5', 'E5'):
        up(name, t, hold, 0.7 * g, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def sheet(s, g=0.0045, pan=0.0):
    """a sheet of thick paper pinned to the wall: a soft flap, and the pin pressed home"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.24)[:n], 'band', (300, 1500)) * _bump(x, 0.09) * (x < 0.09)
    _fx(fl + 0.5 * _knock(n, 180, 0.012, 0.12) / 1.35, s, g, pan, 1800)
def card(s, g=0.004, pan=0.0):
    """a card or a slip set down: a short, soft pat of thick paper"""
    n = int(0.14 * SR); x = np.arange(n) / SR
    pt = filt(noise(0.16)[:n], 'band', (350, 1700)) * _bump(x, 0.05) * (x < 0.05)
    _fx(pt + 0.55 * _knock(n, 150, 0.016, 0.045) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0035, pan=0.0):
    """something small marked or lit: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """a slip slid along, or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def tiles(s, sec=1.0, g=0.0035, pan=0.0):
    """many small things laid out together: one soft texture of paper settling, that swells in and stops, never a burst of taps"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 18); gr = 0.6 + 0.4 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1400)) * _bump(x, sec, 0.9) * gr, s, g, pan, 1600)
def pen(s, sec=0.7, g=0.0045, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def stamp(s, g=0.005, pan=0.0):
    """a verdict pressed onto a page: a low, soft press, rounded, with no ring"""
    n = int(0.25 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 110, 0.035) + 0.2 * filt(noise(0.27)[:n], 'band', (200, 800)) * np.exp(-x / 0.02), s, g, pan, 1000)

# =============================================================================================================================
# 1. Every hour, at the same minutes: the opening, the module's story from outside data. Switzerland in the 1970s: the partner's low
#    C, alone, under the valleys; the lead's E and G for the small towns and the line between them. The motorway: A minor, low; the
#    share of travel falling, a bar at a time. The platform: departures at odd minutes, the lead's notes at odd moments, never a
#    figure; the people waiting: A minor. At a loss: the partner's A, low. The brochure: F major, an idea. The fast new lines drawn
#    across the map, then dropped: A minor. "Something had to change" has nothing under it. The clock: C major, its departures marked
#    at the same minutes. Rail 2000: G major, planning turned around. The hub: the mark, as the trains meet. The slow stretch in
#    amber: A minor. Only the gaps: the lead's C. The slogan: F major. The vote: G major. Three planned lines fade, one stays: E
#    minor, then C. 2004: C major, the new line green; under an hour; Bern's platforms full, a still chord; 2,500 km: F, then C. The
#    turn to data: C major, low; the nine slips: A minor; the long bar broken half way; three stages, three notes. The title card:
#    C major, held
LV[0] = 0.9
ow = lambda lid, word, off=0: W('clock', lid, word, off)
oc = lambda lid, off=0: G('clock', lid, off)
OEND = E('clock')
lo('C3', 0.4, 3.0, 0.8, 0.0)
up('E4', ow('swiss', 'valleys', -0.1), 1.3, 0.6)
up('G4', ow('swiss', 'railways', -0.2), 1.8, 0.6)
# the motorway, and the railways' share of travel falling, a bar at a time
slide(ow('cars', 'motorways', -0.2), 1.0, 0.003, px(1100))
chord(('A2',), ('E4',), ow('cars', 'fell', 0.0), 1.8, 0.6)
card(ow('cars', 'quarter', -0.1), 0.0035, px(1200)); card(ow('cars', 'sixth', -0.1), 0.0035, px(1300))
# the platform: departures at odd minutes, a note at an odd moment for each of three, never a figure
sheet(ow('odd', 'different', -0.2), 0.004, px(1300))
up('A4', ow('odd', 'different', 0.1), 0.6, 0.45)
up('C5', ow('odd', 'hour', 0.3), 0.5, 0.4)
up('E4', ow('odd', 'wait', 0.0), 1.6, 0.45)
# the people waiting: A minor, low
chord(('A2', 'E3'), ('C4',), ow('whom', 'students', 0.0), 2.0, 0.5)
# fewer riders; the railways at a loss
lo('A2', ow('debt', 'loss', -0.1), 1.6, 0.6)
# the brochure of 1972: F major, an idea
card(ow('engineers', 'engineers', -0.1), 0.0035, px(1200))
chord(('F3',), ('A4', 'C5'), ow('engineers', 'timetable', 0.0), 1.8, 0.5)
# the fast new lines drawn across the map, then dropped: A minor
slide(ow('fast', 'fast', -0.1), 1.2, 0.0035, px(960))
chord(('A3',), ('E4',), ow('fast', 'dropped', 0.0), 1.6, 0.5, until=oc('change', -0.2))
# "Something had to change" has nothing under it. The clock: C major, its departures marked at the same minutes
tap(ow('clock', 'clock', 0.0), 0.003, px(1180))
chord(('C3',), ('G4',), ow('clock', 'every', 0.0), 2.0, 0.55)
for w in ('line', 'hour', 'minutes'):
    tap(ow('clock', w, 0.0), 0.0028, px(1180))
# Rail 2000: G major, planning turned around
card(ow('around', 'Rail', -0.1), 0.0035, px(800))
chord(('G2',), ('B4', 'D5'), ow('around', 'timetable', 0.0), 1.8, 0.5)
# the hub: the mark, as the trains from every direction meet there, just before the hour
mark(ow('hubs', 'leave', -0.1), 0.8)
# the slow stretch between two hubs, in amber: A minor
tap(ow('slow', 'slow', 0.0), 0.003, px(1200))
chord(('A2', 'E3'), ('A4',), ow('slow', 'gap', 0.0), 1.6, 0.5)
# only the gaps: the lead's C, plain
up('C5', ow('only', 'gaps', 0.0), 1.2, 0.45)
# the slogan: F major
card(ow('slogan', 'slogan', -0.1), 0.0035, px(960))
chord(('F3', 'C4'), ('A4',), ow('slogan', 'necessary', 0.0), 1.8, 0.5)
# the vote: G major
stamp(ow('vote', 'approved', 0.0), 0.0045, px(1200))
chord(('G3',), ('D5',), ow('vote', 'approved', 0.1), 1.4, 0.45)
# four planned new lines: three fade, one stays: E minor, then C
chord(('E3',), ('B4',), ow('costs', 'stages', 0.0), 1.4, 0.45)
lo('C3', ow('costs', 'needed', 0.0), 1.6, 0.55)
up('G4', ow('costs', 'most', 0.0), 1.4, 0.45)
# 2004: the first stage; about 130 projects lit along the lines, one soft texture; the new line green: C major
tiles(ow('opened', 'projects', -0.2), 1.2, 0.003, px(960))
chord(('C3', 'G3'), ('E4',), ow('opened', 'heart', -0.1), 2.0, 0.5)
# Bern to Zürich under an hour: the lead's G, then C
up('G4', ow('hour', 'hour', -0.1), 0.7, 0.45); up('C5', ow('hour', 'connected', 0.0), 1.6, 0.5)
# Bern's platforms full every half hour: a still chord, both discs
tiles(ow('bern', 'platforms', -0.2), 1.0, 0.0028, px(960))
chord(('C3', 'E3'), ('G4', 'C5'), ow('bern', 'minutes', 0.0), 2.0, 0.5)
# 2,500 km each, the most in Europe: F, then C
card(ow('far', 'kilometres', -0.1), 0.0035, px(1100))
chord(('F3',), ('C5',), ow('far', 'Europe', 0.0), 1.4, 0.45)
up('E5', ow('far', 'year', 0.0), 1.4, 0.4)
# the turn to data: the team's room; C major, low
chord(('C3',), ('E4',), ow('same', 'Data', 0.0), 1.8, 0.5)
for w in ('need', 'gaps', 'stages'):
    card(ow('same', w, -0.1), 0.0032, px(960))
# the university, 2027: today and the target, nine amber slips between them, one soft texture: A minor
tiles(ow('uni', 'nine', -0.1), 1.0, 0.003, px(960))
chord(('A2',), ('C4', 'E4'), ow('uni', 'gaps', 0.1), 1.6, 0.45)
# all at once, broken half way: the lead's long D, its valve closed where the money stops
up('D4', ow('risk', 'once', 0.0), 1.2, 0.4, until=ow('risk', 'stopped', 0.1))
tap(ow('risk', 'stopped', 0.0), 0.003, px(960))
# three stages, each useful on its own: three notes, one for each, on the lead
for w, m in (('three', 'C4'), ('useful', 'E4'), ('approved', 'G4')):
    up(m, ow('team', w, 0.0), 0.9, 0.42)
# the title card: C major, held, gone as the next chapter comes in
chord(('C3', 'G3'), ('E4', 'C5'), oc('breath', 0.3), 3.6, 0.55, gap=0.4, until=OEND)

# 2. Nine gaps: the chapter turns on G major as the room comes back. Noor's map: today beside the target; where they differ, an amber
#    mark. The references, a card. The nine gaps, a soft sound for each layer as its slips appear, never one for each slip. Nine, too
#    many at once: A minor
LV[0] = 0.85
gw = lambda lid, word, off=0: W('gaps', lid, word, off)
chord(('G2',), ('D4', 'B4'), S0('gaps') + 0.5, 1.6, 0.45)
card(gw('plan', 'roadmap', -0.1), 0.0032, px(1300))
slide(gw('beside', 'beside', -0.2), 0.9, 0.003, px(960))
tap(gw('differ', 'gap', 0.0), 0.003, px(960))
card(gw('names', 'gaps', -0.1), 0.0032, px(960))
for lid, w in (('strat', 'slow'), ('biz', 'eleven'), ('info', 'three'), ('app', 'two'), ('tech', 'servers')):
    card(gw(lid, w, -0.1), 0.0035, px(1100))
chord(('A2', 'E3'), ('C4',), gw('nine', 'Nine', 0.0), 1.8, 0.45)

# 3. Six pieces of work: F major as the slips slide into the cards. Each package card set down as it's named; the old warehouse's
#    reports and servers sliding into one. Each ends in something people can see: C major, the lead's E
LV[0] = 0.85
pw = lambda lid, word, off=0: W('work', lid, word, off)
slide(pw('group', 'packages', -0.2), 1.1, 0.0032, px(960))
chord(('F3',), ('C5',), pw('group', 'finish', 0.0), 1.6, 0.45)
slide(pw('two', 'reports', -0.2), 0.8, 0.003, px(1200))
for lid, w in (('p1', 'front'), ('p2', 'Retire'), ('p3', 'partners'), ('p4', 'owner'), ('p5', 'measures'), ('p6', 'agents')):
    card(pw(lid, w, -0.1), 0.0034, px(1000))
chord(('C3',), ('E4', 'G4'), pw('end', 'door', 0.0), 1.6, 0.45)
tap(pw('end', 'switched', 0.0), 0.003, px(1300))

# 4. What each unlocks: the cards slide into order along a line of months. The front door: E minor, a question answered, its arrows
#    drawn. The licence in amber: A minor, low. Sam's catch: a tap; the owners first: F major. The arrows joining the packages. The
#    timetable's lesson: the hub's arrival chord, without its phrases
LV[0] = 0.85
dw = lambda lid, word, off=0: W('order', lid, word, off)
slide(dw('order', 'order', -0.2), 1.2, 0.0032, px(960))
chord(('E3',), ('G4', 'B4'), dw('door', 'first', 0.0), 1.4, 0.42)
slide(dw('door', 'list', -0.2), 0.7, 0.0028, px(1000))
card(dw('worth', 'licence', -0.1), 0.0034, px(1300))
chord(('A2',), ('E4',), dw('worth', 'December', 0.0), 1.6, 0.42)
tap(dw('sam', 'catch', 0.0), 0.003, px(1500))
slide(dw('owners', 'owners', -0.2), 0.8, 0.003, px(900))
chord(('F3', 'C4'), ('A4',), dw('owners', 'move', 0.0), 1.4, 0.42)
slide(dw('wait', 'wait', -0.1), 0.9, 0.0028, px(960))
chord(('C3', 'G3'), ('E4', 'C5'), dw('rail', 'first', 0.0), 1.6, 0.42)

# 5. Each stage on its own: three stage lines drawn on the roadmap; G major. The one test: the lead's A, a question. The half move in
#    amber across stage one: A minor; slid whole into stage two: F major. Each stage as it's said, a note higher each time: C, E, G.
#    The slogan again: F major. Rail 2000's first stage, each working on its own: the mark
LV[0] = 0.85
sw = lambda lid, word, off=0: W('stages', lid, word, off)
slide(sw('set', 'stages', -0.3), 1.0, 0.003, px(960))
chord(('G2',), ('D4', 'G4'), sw('set', 'stages', 0.0), 1.4, 0.42)
card(sw('test', 'test', -0.1), 0.0034, px(960))
up('A4', sw('test', 'use', 0.0), 1.2, 0.4)
tap(sw('half', 'half', 0.0), 0.003, px(1000))
chord(('A2', 'E3'), (), sw('no', 'paid', 0.0), 1.4, 0.5)
slide(sw('whole', 'whole', -0.1), 1.0, 0.003, px(1100))
chord(('F3',), ('A4', 'C5'), sw('whole', 'once', 0.0), 1.4, 0.42)
for lid, w, m in (('s1', 'Thursday', 'C4'), ('s2', 'platform', 'E4'), ('s3', 'seven', 'G4')):
    tap(sw(lid, w, -0.1), 0.0028, px(1100))
    up(m, END('stages', lid, 0.1), 0.9, 0.38)
card(sw('dates', 'day', -0.1), 0.0032, px(900))
chord(('F3',), ('C5',), sw('fast', 'possible', 0.0), 1.2, 0.4)
mark(END('stages', 'rail', 0.4), 0.75, until=E('stages'))

# 6. On one page: F major as the page is pinned; each of its six parts drawn in, a soft pen for each, never music under the voice. The
#    same plan for everyone: C major, the lead's G and E
LV[0] = 0.85
gp = lambda lid, word, off=0: W('page', lid, word, off)
sheet(gp('page', 'page', -0.2), 0.0045, px(960))
chord(('F3',), ('A4',), gp('page', 'page', 0.2), 1.4, 0.42)
for lid, w in (('where', 'four'), ('must', 'decide'), ('princ', 'five'), ('pic', 'picture'), ('road', 'three'), ('meas', 'days')):
    pen(gp(lid, w, -0.1), 0.6, 0.0035, px(960), 2)
chord(('C3',), ('G4', 'E5'), gp('same', 'same', 0.0), 1.6, 0.42, until=E('page'))

# 7. Approved: the council's room, G major, low. The dean's question: E minor. The far dates are loose: F major. The council's yes,
#    a green pill: the arrival chord, C major, held. One package needs money: A minor, low, its card in amber. The ninety days end:
#    the lead's C. Back to Switzerland: the hub, its chord. At the university: stage one's three things, a tap each. The capability:
#    F major. And the mark under the end card, then C major, held, to the end
LV[0] = 0.85
yw = lambda lid, word, off=0: W('yes', lid, word, off)
yc = lambda lid, off=0: G('yes', lid, off)
card(yw('ready', 'milestone', -0.1), 0.0034, px(1200))
chord(('G2', 'G3'), ('B4',), yw('council', 'council', 0.0), 1.6, 0.42)
chord(('E3',), ('B4',), yw('arts', 'waits', 0.0), 1.2, 0.38)
chord(('F3',), ('C5',), yw('loose', 'starts', 0.0), 1.4, 0.4)
stamp(yw('approve', 'approves', 0.0), 0.005, px(960))
chord(('C3', 'G3'), ('E4', 'G4', 'C5'), yw('approve', 'approves', 0.1), 2.2, 0.5)
card(yw('money', 'money', -0.1), 0.0034, px(1300))
lo('A2', yw('money', 'month', 0.0), 1.4, 0.45)
up('C5', yw('end', 'read', 0.0), 1.2, 0.4)
tap(yw('back', 'hubs', 0.0), 0.003, px(960))
chord(('C3', 'E3'), ('G4',), yw('back', 'connected', 0.0), 1.6, 0.42)
for w, x in (('door', 760), ('list', 960), ('measure', 1160)):
    tap(yw('uni', w, 0.0), 0.0028, px(x))
chord(('F3', 'A3'), ('C5',), yw('cap', 'doesn', 0.0), 1.4, 0.4)
mark(yc('breath', 1.2), 0.75, hold=2.6, until=TOT)
lo('C3', yc('breath', 1.2) + 3.0, 2.4, 0.5, until=TOT)
up('G4', yc('breath', 1.2) + 3.2, 2.0, 0.4, until=TOT)
