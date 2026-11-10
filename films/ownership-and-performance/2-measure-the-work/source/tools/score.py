# Measure the work, not the people: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette (the module's palettes.md, film 12's line: the lead reserved by the setup thread on 5 November 2026, the partner this film's
# thread's choice on 10 November 2026), made here, as music.py has neither:
#  - Tuned saw blades, struck softly with felt: tools of the work, tuned. Each blade is a steel disc, cut until its note and the octave
#    above ring together; beside them rings the disc's own mode, about 2.83 times the note, a little shorter: the steel's colour, which
#    no harmonic of a chord's other notes comes near, so nothing beats; two more modes (about 1.73 and 4.11 times the note) sound only
#    for the instant of the strike. No third or fourth harmonic, so it never sounds like the site's felt piano. A felt damper stops each
#    note after its ring, so nothing rings on: low, round and short, with nothing above 2.3 kHz.
#  - Its partner, the thread's choice: the largest blades, low (D2 to D3), damped by the palm as they're struck, so each note speaks once
#    and stops within a third of a second. The same steel, set another way: in this film each measure has a partner, and here one blade
#    rings while the other stops. Every other struck or plucked colour the site lacks belongs to another culture or sounds like one the
#    site has (the module's long list), as the module's other threads found.
# The mark: a note heard alone, then in its chord, where it means something else. A4, alone, as a number is said (541 killed; promises
#    met at 82%; a measure made a target; the last line); then the same A4 inside D minor, where it is the chord's fifth and sounds sad
#    (the number read as the drivers' fault; 82% beside a load of nine), or inside F major, where it is the third and sounds bright (deaths
#    down by three quarters; 82% on its own; the close). A number alone says little; beside its partner it means something.
# F major, D minor for the problem. Every chord is tuned pure from F (just intonation, see hz()): F, B flat and C major, D and A minor are
#    pure in this table; G minor, and G held with D or B flat, are not, and are never played or held together.
#    No car horn, engine or tyres for Vision Zero (the module's palettes.md): the cars on the road make no sound at all.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each blade steady, its main partials harmonic; each damped before it would ring into the next chapter.
#    No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/mw_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1997)  # this film's own randomness: the room, the paper, the pen

# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 41, 12)
    return 87.30706 * 2 ** o * _JI[pc]
F2, A2, Bb2, C3, D3, E3, F3, G3, A3, Bb3 = 41, 45, 46, 48, 50, 52, 53, 55, 57, 58
C4, D4, E4, F4, G4, A4, Bb4, C5, D5, E5, F5 = 60, 62, 64, 65, 67, 69, 70, 72, 74, 76, 77
D2 = 38

# ---- the levels: the ringing blades and the damped low ones matched by loudness, as far under the voice as the module's other music;
# the effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LG, LB, FX = 0.075, 0.1, 3.6
LV = [1.0]

# a small room round the blades, ringing for under a second. Its level is set by what it rings where the notes are (its gain from 100 Hz
# to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.011 * SR)] = 0; _IR /= _band(_IR)
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

# ---- a tuned blade's partials: the note and its octave, tuned by the maker's cuts, and the disc's own mode beside them, each fading sooner
# than the note (ratio, level, how long it rings as a share of the blade's ring); and the two modes heard only at the strike (ratio, level,
# seconds). 2.83 sits between the chord-mates' harmonics (2.67 and 3 times a note), 4 per cent or more from any of them
_TUNED = ((1.0, 1.0, 1.0), (2.0, 0.28, 0.5), (2.83, 0.14, 0.4))
_DISC = ((1.73, 0.06, 0.10), (4.11, 0.05, 0.05))
def _steel(f0, x, t1, top, tuned=1.0, disc=1.0):
    sig = np.zeros(len(x))
    for k, (r, a, d) in enumerate(_TUNED):
        if f0 * r > top:
            break
        sig += a * (tuned if k else 1.0) * np.sin(2 * np.pi * f0 * r * x + 0.4 * k) * np.exp(-x / (t1 * d))
    for r, a, d in _DISC:
        if f0 * r < top:
            sig += disc * a * np.sin(2 * np.pi * f0 * r * x + 1.3 * r) * np.exp(-x / d)
    return sig
def _felt(sec, n, lo=120, hi=900):
    """the felt meeting the steel: a tiny, soft thump, low-passed"""
    x = np.arange(n) / SR; q = filt(noise(sec + 0.02)[:n], 'band', (lo, hi)) * np.exp(-x / 0.004)
    return q / max(1e-9, float(np.abs(q).max()))

def blade(m, s, g=1.0, pan=None, ring=None, room=0.22, until=None):
    """a tuned blade struck softly with felt at s; it rings ring seconds, then the felt damper stops it"""
    f0 = hz(m); t1 = 1.9 * (220 / f0) ** 0.3; d = ring if ring else 1.2
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _steel(f0, x, t1, 2300)
    sig *= (1 - np.exp(-x / 0.004)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.025 * _felt(sec, n)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 60)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LG, max(-0.35, min(0.35, (m - 65) * 0.02)) if pan is None else pan)

def low(m, s, g=1.0, pan=None, ring=0.3, room=0.12, until=None):
    """one of the largest blades, struck with the palm resting on it, so it speaks once, round and low, and stops within a third of a second"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.08, until - s - 0.2))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _steel(f0, x, 0.32, 1300, tuned=0.7, disc=0.5)
    sig *= (1 - np.exp(-x / 0.005)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.045))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.04 * _felt(sec, n, 70, 400)
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (70, 240))   # the big disc's body, warm
    sig = _until(_room(norm(filt(filt(sig, 'low', 1300), 'high', 35)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LB, -0.1 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.13, ring=2.0, until=None):
    """a chord struck from its lowest blade up: a low one (below C3) on the palm-damped blades, the rest ringing, damped together"""
    for i, m in enumerate(notes):
        if m < C3:
            low(m, s + step * i, g, None, 0.35, until=until)
        else:
            blade(m, s + step * i, g, None, max(0.5, ring - step * i), until=until)
def pair(ring_m, stop_m, s, g=1.0, ring=1.4, pan=None, until=None):
    """a measure and its partner: one blade rings, a low one stops, struck together"""
    low(stop_m, s, g, pan, 0.3, until=until); blade(ring_m, s, g, pan, ring, until=until)
def mark(s, g=1.0, ring=1.8, until=None):
    """the mark's first half: A4, alone"""
    blade(A4, s, g, 0.0, ring, room=0.26, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.0035, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0032, pan=0.0):
    """something small set down, a pill or a tag: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """a bar drawn out on a sheet: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.4, g=0.0045, pan=0.0, n=2):
    """a pen's soft stroke on paper, a stroke at a time: a line struck through words"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def post(s, g=0.004, pan=0.0):
    """a barrier's post set in the ground: one dull, low knock"""
    n = int(0.14 * SR)
    _fx(_knock(n, 120, 0.03) + 0.15 * filt(noise(0.16)[:n], 'band', (100, 500)) * np.exp(-np.arange(n) / SR / 0.012), s, g, pan, 800)
def cable(s, g=0.004, pan=0.0):
    """the car leaning on the barrier's steel cables: one soft, low give of the cables, a single tone that fades, never a twang"""
    n = int(0.9 * SR); x = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * 98 * x) + 0.3 * np.sin(2 * np.pi * 196 * x) * np.exp(-x / 0.15)) * np.exp(-x / 0.28) * np.minimum(1, x / 0.06)
    _fx(tone + 0.2 * filt(noise(0.92)[:n], 'band', (80, 400)) * _bump(x, 0.35, 1.5) * (x < 0.35), s, g, pan, 600)
def screen(s, g=0.003, pan=0.0):
    """a message coming up on the screen on the wall: a soft, low tap of its frame"""
    n = int(0.1 * SR); x = np.arange(n) / SR
    _fx(0.7 * _knock(n, 170, 0.02) + 0.3 * filt(noise(0.12)[:n], 'band', (200, 800)) * np.exp(-x / 0.008), s, g, pan, 1000)

# =============================================================================================================================
# 1. Roads, not drivers: the opening. Sweden, 1997: the road, and a low F from the big blade; A4 alone as the 541 are named, then the same
#    A4 in D minor as most crashes are put down to the driver. Teach, fine, blame: a tap each, and a low A under "blame". The drift: a
#    blade's E, unsettled, and the low D as the two cars are ringed; the harm, D minor, slow and low; nothing under "Something had to
#    change". October 1997: B flat major for Vision Zero. Every fatal crash studied: D, F and A, one at a time, as the dots come in; head-on
#    crashes on fast roads, A minor. From 1998, the barrier: its posts set one by one, and C major as it runs. Roundabouts, slower
#    streets: a tap each, and one G. The benefits: A4 alone as deaths fall, then in F major; the two bars drawn, and F, C and A falling
#    gently; the car held by the cables: their low give, and F major. Not who to blame, what to fix; and data work: the wait lit amber,
#    a low D under it; the three pills, F, A and C; and F major, held, under the title card
LV[0] = 0.85
vw = lambda lid, word, off=0: W('vision', lid, word, off)
vc = lambda lid, off=0: G('vision', lid, off)
END = E('vision')
low(F2, 0.6, 0.7, 0.0, ring=0.4)
card(vw('when', 'nineteen', -0.2), 0.004, px(500))
mark(vw('when', 'five', 0.0), 0.7, ring=2.0)
card(vw('counted', 'crashes', -0.1), 0.0035, px(1490))
chord((D2, A3, D4, F4, A4), vw('counted', 'mistake', 0.1), 0.6, step=0.15, ring=2.2)
for wd, x in (('teach', 1280), ('fine', 1495), ('blame', 1706)):
    tap(vw('answer', wd, -0.1), 0.0032, px(x))
low(A2, vw('answer', 'blame', 0.15), 0.6, px(1706) * 0.3, ring=0.35)
blade(E4, vw('drift', 'drifts', 0.0), 0.42, px(820) * 0.4, ring=1.2)
low(D2, vw('drift', 'line', 0.0), 0.6, px(950) * 0.3, ring=0.35)
tap(vw('harm', 'kill', -0.2), 0.0032, px(950))
card(vw('harm', 'families', -0.2), 0.0035, px(960))
chord((D2, F3, A3, D4), vw('harm', 'never', 0.0), 0.5, step=0.32, ring=2.6)
# October 1997: Vision Zero, a plan: B flat major
card(vc('adopt', 0.2), 0.0035, px(540))
chord((Bb2, F3, Bb3, D4, F4), vw('adopt', 'Vision', 0.1), 0.55, step=0.16, ring=2.6)
card(vw('who', 'design', -0.2), 0.0035, px(1380))
# every fatal crash studied: the dots come in, and D, F and A one at a time; the head-on crashes on fast roads, A minor
card(vw('study', 'Every', -0.1), 0.0035, px(480))
for i, m in enumerate((D4, F4, A4)):
    blade(m, vw('study', 'studied', -0.3 + 0.85 * i), 0.4, px(700 + 300 * i) * 0.4, ring=1.0)
tap(vw('found', 'head', -0.1), 0.0032, px(980))
chord((A2, E3, A3, C4), vw('found', 'head', 0.1), 0.5, step=0.15, ring=2.0)
# from 1998: the barrier's posts set one by one as it runs from left to right, and C major
buildT = vw('barrier', 'barrier', -0.3)
card(vc('barrier', 0.2), 0.0035, px(530))
for u in (0.12, 0.32, 0.52, 0.72, 0.9):
    post(buildT + 0.2 + 3.2 * np.arccos(1 - 2 * u) / np.pi, 0.0035, px(-40 + 2000 * u))
chord((C3, G3, C4, E4), buildT + 1.3, 0.5, step=0.2, ring=2.4)
tap(vw('barrier', 'middle', 0.2), 0.0032, px(1500))
# roundabouts for crossroads, and slower where people walk
slide(vw('more', 'Roundabouts', -0.1), 1.6, 0.003, px(960))
tap(vw('more', 'Roundabouts', 0.2), 0.0032, px(540))
tap(vw('more', 'walk', -0.3), 0.0032, px(1500))
blade(G4, vw('more', 'walk', 0.0), 0.4, px(1500) * 0.4, ring=1.2)
# what it gave: A4 alone as deaths fall, then in F major; the two bars, and F, C and A falling gently; traffic grew
card(vc('fell', 0.2), 0.0035, px(530))
mark(vw('fell', 'deaths', 0.0), 0.6, ring=1.3)
chord((F2, F3, C4, F4, A4), vw('fell', 'quarters', 0.1), 0.55, step=0.14, ring=2.4)
card(vw('half', 'country', -0.2), 0.0035, px(1480))
slide(vw('half', 'half', -0.6), 0.9, 0.003, px(1480))
for i, m in enumerate((C5, A4, F4)):
    blade(m, vw('half', 'half', 0.2 + 0.32 * i), 0.38, px(1480) * 0.3, ring=0.9 if i < 2 else 1.6)
tap(vw('half', 'traffic', -0.1), 0.0032, px(1480))
# a mistake held: the car leans on the cables, and they give and hold; F major, the A on top
catchT = vw('care', 'mistake', -0.9)
cable(catchT + 0.3, 0.004, px(1250))
tap(vw('care', 'mistake', -0.1), 0.0032, px(960))
chord((F2, C3, A3, C4, F4), vw('care', 'life', 0.2), 0.5, step=0.14, ring=2.2)
# not who to blame, struck through; what in the road to fix
tap(vw('measured', 'blame', -0.1), 0.003, px(700))
pen(vw('measured', 'measured', -0.1), 0.4, 0.004, px(700))
tap(vw('measured', 'fix', -0.3), 0.003, px(1220))
# data work: the flow, its wait lit amber and a low D under it; not who did it, struck through; the three pills, F, A and C
card(vc('data', 0.1), 0.0035, px(960))
low(D2, vw('data', 'flows', -0.1), 0.55, px(700) * 0.3, ring=0.35)
blade(A3, vw('data', 'flows', 0.0), 0.38, px(700) * 0.3, ring=1.2)
tap(vw('data', 'who', -0.1), 0.003, px(960))
pen(vw('data', 'who', 0.3), 0.4, 0.004, px(960))
for wd, m, x in (('Measure', F4, 480), ('read', A4, 960), ('find', C5, 1440)):
    tap(vw('fix', wd, -0.1), 0.0032, px(x))
    blade(m, vw('fix', wd, 0.0), 0.4, px(x) * 0.4, ring=1.1)
chord((F2, F3, C4, A4, C5), vc('breath', 0.4), 0.6, step=0.2, ring=4.2, until=END)

# 2. Management, for this work: the university, a year from now. Helena's name: one C; the sheet for management, B flat major, a plan;
#    the team's page, a tap as each measure comes in; and each pair joined: a blade that rings with a low one that stops
LV[0] = 0.9
gw = lambda lid, word, off=0: W('manage', lid, word, off)
gc = lambda lid, off=0: G('manage', lid, off)
card(gw('uni', 'Helena', -0.1), 0.0035, px(510))
blade(C4, gw('uni', 'Helena', 0.2), 0.42, None, ring=1.4)
card(gc('sides', 0.1), 0.0035, px(590))
card(gc('see', 0.1), 0.0035, px(590))
chord((Bb3, D4, F4), gw('see', 'plans', 0.2), 0.42, step=0.13, ring=1.6)
card(gc('fit', 0.1), 0.0035, px(590))
card(gc('page', 0.1), 0.0035, px(660))
for t0 in (gw('page', 'flows', -0.3), gc('back'), gc('promise'), gc('load')):
    tap(t0 + 0.1, 0.0028, px(500))
tap(gw('days', 'forty', -0.2), 0.0028, px(1000))
pair(C4, F2, gw('pairs', 'speed', 0.0), 0.45, ring=1.4, pan=px(260) * 0.3)
pair(A3, D2, gw('pairs', 'promises', 0.0), 0.45, ring=1.6, pan=px(260) * 0.3)

# 3. Read it together: the first reading. The Thursday sheet: a low C and a blade's G; what slowed the work, and who was slow struck through;
#    Sweden's question again: F major, small. June's days taken apart: the bar drawn; the wait for access lit, a low D and an F; the three
#    reasons, a tap each; nobody was slow: A minor in the pause. The wait shrinks to a day: F major. The second cause: a low D and an A.
#    December: the two pills, and F major, the A on top
LV[0] = 0.9
rw = lambda lid, word, off=0: W('read', lid, word, off)
rc = lambda lid, off=0: G('read', lid, off)
card(rc('thurs', 0.2), 0.0035, px(1030))
pair(G4, C3, rc('thurs', 0.4), 0.42, ring=1.2)
tap(rw('what', 'what', -0.1), 0.003, px(1030))
tap(rw('what', 'Never', -0.1), 0.003, px(1030)); pen(rw('what', 'Never', 0.3), 0.4, 0.004, px(1030))
tap(rw('sweden', 'Sweden', -0.1), 0.003, px(1030))
chord((C4, F4, A4), rw('sweden', 'same', 0.0), 0.4, step=0.15, ring=1.5)
card(rc('june', 0.1), 0.0035, px(1030))
slide(rc('june', 0.5), 1.6, 0.0032, px(1030))
low(D2, rw('access', 'waiting', 0.0), 0.55, px(840) * 0.3, ring=0.35)
blade(F3, rw('access', 'waiting', 0.05), 0.4, px(840) * 0.3, ring=1.3)
for wd, y in (('started', 650), ('dataset', 720), ('five', 790)):
    tap(rw('why', wd, -0.2), 0.003, px(800))
tap(rw('nobody', 'Nobody', -0.1), 0.003, px(1030))
tap(rw('nobody', 'arranged', -0.4), 0.003, px(1030))
chord((A2, A3, C4, E4), rw('nobody', 'arranged', 0.5), 0.42, step=0.16, ring=1.8)
card(rc('early', 0.1), 0.0035, px(1030))
slide(rw('one', 'September', -0.1), 1.2, 0.003, px(860))
tap(rw('one', 'September', -0.1), 0.003, px(1030))
chord((F2, A3, C4, F4), rw('one', 'one', 0.1), 0.42, step=0.14, ring=1.8)
card(rc('unclear', 0.1), 0.0035, px(1030))
pair(A3, D3, rw('unclear', 'came', 0.0), 0.4, ring=1.3)
card(rc('talk', 0.1), 0.0035, px(1030))
tap(rw('dec', 'December', -0.1), 0.003, px(1030))
tap(rw('dec', 'halved', -0.2), 0.003, px(1030))
chord((F2, C4, F4, A4, C5), rw('dec', 'halved', 0.2), 0.42, step=0.14, ring=1.8)
tap(rw('most', 'waits', -0.2), 0.003, px(1030))

# 4. Each measure has a partner: promises met at 82%, and the mark: A4 alone, then in F major, a number to celebrate; the load of nine
#    against a limit of six, its line drawn, and the same A4 inside D minor. Carrying too much, tired people: a tap each. Finish before
#    starting: B flat, a rule; not now, a tap. The three extra pieces finished, a tick each; back to six: F major, balanced. Accelerate;
#    and each pair: a blade that rings with a low one that stops
LV[0] = 0.9
pw = lambda lid, word, off=0: W('pairs', lid, word, off)
pc = lambda lid, off=0: G('pairs', lid, off)
card(pw('aug', 'eighty', -0.3), 0.0035, px(780))
mark(pw('aug', 'eighty', 0.2), 0.55, ring=2.0)
tap(pw('alone', 'celebrate', -0.4), 0.003, px(1150))
chord((F2, C4, F4, A4), pw('alone', 'celebrate', 0.0), 0.45, step=0.15, ring=1.8)
card(pw('nine', 'nine', -0.2), 0.0035, px(1010))
slide(pw('nine', 'limit', -0.2), 0.6, 0.003, px(1050))
chord((D2, A3, D4, F4, A4), pw('nine', 'limit', 0.3), 0.45, step=0.15, ring=2.0)
tap(pw('carry', 'carrying', -0.3), 0.003, px(800))
tap(pw('last', 'tired', -0.2), 0.003, px(760))
tap(pw('finish', 'finishes', -0.1), 0.003, px(1010))
pair(D4, Bb2, pw('finish', 'finishes', 0.1), 0.4, ring=1.2)
tap(pw('notnow', 'Two', -0.1), 0.003, px(1010))
sixT = pw('six', 'back', -0.6)
for i in range(3):
    ticked(sixT + 0.25 + 0.4 * i, 0.004, px(1050 - 74 * i))
tap(pw('six', 'back', -0.1), 0.003, px(1010))
chord((F2, F3, C4, F4, A4), pw('six', 'six', 0.2), 0.42, step=0.14, ring=1.8)
tap(pw('six', 'December', -0.4), 0.003, px(1150))
card(pc('accel', 0.1), 0.0035, px(1010))
card(pw('honest', 'Speed', -0.2), 0.0035, px(780))
pair(E4, A2, pw('honest', 'Speed', 0.1), 0.4, ring=1.2, pan=px(780) * 0.3)
card(pw('honest', 'Promises', -0.2), 0.0035, px(1240))
pair(F4, Bb2, pw('honest', 'Promises', 0.1), 0.4, ring=1.4, pan=px(1240) * 0.3)

# 5. Not a target: the director's message on the screen; a low A and a blade's C. Fair questions: F major, small. Goodhart, then Strathern:
#    the mark, A4 alone at "target", then inside D minor: a number pushed to move means something else. Deming: A minor, low. Helena's
#    reply: B flat major, a rule kept; the page to the quarterly review, no one ranked: F major, the A on top
LV[0] = 0.9
tw = lambda lid, word, off=0: W('target', lid, word, off)
tc = lambda lid, off=0: G('target', lid, off)
screen(tc('mon', 0.1), 0.003, px(640))
pair(C4, A2, tc('mon', 0.5), 0.4, ring=1.3)
tap(tw('fair', 'faster', -0.3), 0.003, px(400))
tap(tw('fair', 'help', -0.3), 0.003, px(360))
tap(tw('fair', 'fair', -0.1), 0.003, px(820))
chord((F3, A3, C4), tw('fair', 'fair', 0.1), 0.4, step=0.14, ring=1.4)
card(tc('goodhart', 0.1), 0.0035, px(630))
card(tw('strathern', 'Marilyn', -0.2), 0.0035, px(630))
mark(tw('strathern', 'target', 0.0), 0.5, ring=1.4)
chord((D2, F3, A3, D4, A4), tw('strathern', 'good', 0.5), 0.45, step=0.15, ring=1.9)
card(tc('split', 0.1), 0.0035, px(630))
card(tc('space', 0.1), 0.0035, px(630))
card(tw('deming', 'Deming', -0.3), 0.0035, px(530))
chord((A2, C4, E4), tw('deming', 'system', 0.1), 0.42, step=0.16, ring=1.6)
card(tw('no', 'no', -0.2), 0.0035, px(630))
chord((Bb2, D4, F4, Bb4), tw('no', 'no', 0.3), 0.42, step=0.14, ring=1.6)
tap(tw('review', 'quarterly', -0.2), 0.003, px(630))
tap(tw('review', 'ranked', -0.3), 0.003, px(630))
chord((F2, A3, C4, F4, A4), tw('review', 'ranked', 0.3), 0.42, step=0.14, ring=1.8)

# 6. On Monday: back in Sweden, the road, measured and fixed: F major, low; Helena's three pills, F, A and C, as in the opening's close; the
#    four sheets, a card each, and the pair: a blade with its low partner; the next film's tag; the last line's pills; and the close: A4
#    alone, then F major, held into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
tap(mw('back', 'measured', -0.1), 0.0032, px(960))
tap(mw('back', 'fixed', -0.1), 0.0032, px(960))
chord((F2, A3, F4), mw('back', 'fixed', 0.3), 0.42, step=0.16, ring=1.8)
for wd, m in (('measured', F4), ('read', A4), ('fixed', C5)):
    tap(mw('helena', wd, -0.1), 0.0032, px(1250))
    blade(m, mw('helena', wd, 0.0), 0.38, px(1250) * 0.4, ring=1.0)
card(mc('flow', 0.3), 0.0035, px(530))
card(mw('pair', 'Pair', -0.1), 0.0035, px(1390))
pair(C4, F2, mw('pair', 'balances', 0.0), 0.4, ring=1.3, pan=px(1390) * 0.3)
card(mw('read', 'Read', -0.1), 0.0035, px(530))
card(mw('rank', 'rank', -0.2), 0.0035, px(1390))
tap(mw('next', 'falls', -0.2), 0.0032, px(960))
for wd, x in (('Measure', 630), ('Fix', 1290)):
    tap(mw('end', wd, -0.1), 0.0032, px(x))
mark(mw('end', 'together', 0.2), 0.5, ring=1.5)
chord((F2, F3, C4, F4, A4), mw('end', 'people', 0.3), 0.5, step=0.16, ring=5.0, until=TOT)
