# Growing people: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, the module's (palettes.md, film 13's line, reserved by the setup thread on 5 November 2026), made here, as music.py has none:
#  - The fortepiano: the piano of the 1790s, its small hammers covered in leather, its strings thin and its wooden action light and quick:
#    the instrument that grew into the piano. Each note is a leather hammer striking near an eighth of the string, so the attack is bright
#    and the upper partials die within a fraction of a second, leaving a short, clear tone; a quiet knock of the wooden action under it;
#    and the dampers, which on these instruments stop a note almost at once when the key comes up. Kept bright, dry and short, so it is
#    never the site's felted or electric pianos.
#  - Its partner, the thread's choice: four hands at one keyboard, as teacher and pupil played in the 1790s. A second player on the same
#    fortepiano's low notes, touched softly, round, with few high partials: the one who supports while the other learns. The same
#    instrument in two pairs of hands, so no other instrument is taken (the module's long list), and it carries the film's idea.
# The mark (the module's suggestion): a small figure in the treble, B flat C D F, the children and the new analyst; it returns, fuller, in
#    the middle, an octave lower with a companion above each note and the second player under it, when Ivy has grown; at the close the
#    small figure is heard again over the fuller one, for the next graduate.
# B-flat major, G minor for the problem. Every chord is tuned pure from B flat (just intonation, see hz()): B flat, E flat and F major, G
#    and D minor are pure in this table; C held with E flat or with G is not, and the score never holds them together.
#    Nothing Japanese for lesson study, and no school bell or chalk for the classrooms (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note steady, its partials harmonic, no detuned unisons; each damped before it would ring into the
#    next chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is something a person does or something that comes in on screen, at that moment: a door slid open or shut, a book
#    or a sheet passed from hand to hand, the seedling's pot in Ivy's hands, a card that says where and when, a mark on a screen, a
#    call that comes up and Graham joining it, a change or a message sent, Carmen's marker on her boards and a pen in the notebooks.
#    Each one below uses the same word and offset as the picture in src/gp_scenes.js, and pans to where it is drawn, so sound and
#    picture stay together when the voice is re-timed. People's steps and what they say have no sound of their own: the voice carries
#    them. The chalk on the classroom's blackboard has none either (no school bell or chalk).
#  - What a hand writes is paced by the film (PK.pace): a row waits until Carmen has walked to it, and a stroke until the pen has
#    crossed to it. So the marker's and the pen's sounds ask the film when each row is written (the people kit's tools/pens.py),
#    and take no word's time: PEN, below. A page is heard only while it is on screen.
# And everything stays soft and below about 2.4 kHz; the effects about 12 dB under the music.

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
def E_(sid, lid, off=0):
    """when a line of the voice ends, as the film's sc.ends has it"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1872)  # this film's own randomness: the room, the paper, the wood
# every stroke of Carmen's two boards and of the five pages of notes (Ivy's, and once Helena's), as the film writes them: the chapter,
# who writes at the board (None: a page), and the film's function that gives the rows (src/gp_uni.js)
PEN = pens.written({'A': ('tuesday', 'carmen', 'gp_boardA'), 'B': ('tuesday', 'carmen', 'gp_boardB'),
                    'N1': ('goals', None, 'gp_note1'), 'N2': ('tuesday', None, 'gp_note2'), 'N3': ('both', None, 'gp_note3'),
                    'N4': ('next', None, 'gp_note4'), 'N5': ('monday', None, 'gp_note5')})

# ---- tuning: just intonation from B flat, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 58, 12)
    return 233.0819 * 2 ** o * _JI[pc]
G1, Bb1, D2, Eb2, F2, G2, A2, Bb2, C3, D3, Eb3, F3, G3, A3 = 31, 34, 38, 39, 41, 43, 45, 46, 48, 50, 51, 53, 55, 57
Bb3, C4, D4, Eb4, F4, G4, A4, Bb4, C5, D5, Eb5, F5, G5 = 58, 60, 62, 63, 65, 67, 69, 70, 72, 74, 75, 77, 79

# ---- the levels: the two players matched by loudness, as far under the voice as the module's other music; the effects about 12 dB under
# the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LF, LL, FX = 0.13, 0.155, 3.8
LV = [1.0]

# a small salon round the instrument, ringing for under a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.010 * SR)] = 0; _IR /= _band(_IR)
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

# ---- the strings: harmonic partials (no detuned unisons, so nothing beats), shaped by where the leather hammer strikes (near an eighth of
# the string: a comb with a notch at the eighth and ninth partials), the upper partials dying first; a prompt sound and a quieter, longer
# aftersound, as a piano's strings have. bright: how hard the leather meets the string (the first player 1, the second softer)
STRIKE = 1 / 8.5
def _strings(f0, x, bright, top):
    sc = (262 / f0) ** 0.5; tp, ta = 0.42 * sc, 2.0 * sc
    sig = np.zeros(len(x))
    for k in range(1, 40):
        fk = f0 * k
        if fk > top:
            break
        a = abs(np.sin(np.pi * k * STRIKE)) / k ** (1.25 - 0.4 * bright)
        dk = 1 + 0.6 * (k - 1) ** 1.1
        sig += a * np.sin(2 * np.pi * fk * x + 0.5 * k) * (0.7 * np.exp(-x * dk / tp) + 0.3 * np.exp(-x * dk / ta))
    return sig
def _action(sec, n):
    """the light wooden action under each note: the key's fall and the hammer's flight, one small, dull knock"""
    x = np.arange(n) / SR
    k = filt(noise(sec + 0.02)[:n], 'band', (140, 700)) * np.exp(-x / 0.006) + 0.6 * np.sin(2 * np.pi * 170 * x) * np.exp(-x / 0.012)
    return k / max(1e-9, float(np.abs(k).max()))

def fp(m, s, g=1.0, pan=None, ring=None, room=0.22, until=None):
    """the first player: a key struck at s and held ring seconds, then the damper stops the note at once"""
    f0 = hz(m); d = ring if ring else 0.8
    if until is not None:
        d = min(d, max(0.1, until - s - 0.25))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _strings(f0, x, 1.0, 2400)
    sig *= (1 - np.exp(-x / 0.0012)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.05 * _action(sec, n)
    sig = sig.astype(np.float32); sig = sig + 0.25 * filt(sig, 'band', (380, 1300))   # the soundboard, small and bright
    sig = _until(_room(norm(filt(filt(sig, 'low', 2400), 'high', 70)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LF, max(-0.3, min(0.4, (m - 62) * 0.02)) if pan is None else pan)

def lo(m, s, g=1.0, pan=None, ring=0.5, room=0.18, until=None):
    """the second player, on the low notes: touched softly, round, with few high partials, and let go after ring seconds"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.1, until - s - 0.25))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _strings(f0, x, 0.35, 1300)
    sig *= (1 - np.exp(-x / 0.002)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.03 * _action(sec, n)
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (90, 260))
    sig = _until(_room(norm(filt(filt(sig, 'low', 1300), 'high', 35)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LL, -0.18 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.12, ring=1.8, until=None, low=True):
    """a chord spread from its lowest note up, the notes below F3 the second player's, the keys let go together"""
    for i, m in enumerate(notes):
        r = max(0.35, ring - step * i)
        (lo if (low and m < F3) else fp)(m, s + step * i, g, None, r, until=until)
def figure(notes, s, g=1.0, step=0.2, ring=0.45, last=None, until=None):
    """a short figure for the first player, a note at a time"""
    k = len(notes)
    for i, m in enumerate(notes):
        fp(m, s + step * i, g, None, last if (last and i == k - 1) else ring, until=until)
MARK = (Bb4, C5, D5, F5)
def mark(s, g=1.0, step=0.2, last=1.4, bass=(), until=None):
    """the mark: B flat C D F, small, in the treble; bass: the second player's notes under it, (note, at which note, ring)"""
    figure(MARK, s, g, step, 0.45, last, until)
    for m, i, r in bass:
        lo(m, s + step * i, 0.9 * g, None, r, until=until)
GROWN = ((Bb3, D4), (C4, F4), (D4, F4), (F4, Bb4))
def grown(s, g=1.0, step=0.26, last=2.4, until=None):
    """the mark returned, fuller, in the middle: an octave lower, a companion above each note, and the second player's B flat, F and
    B flat under it (C sounds only with F, never with E flat or G)"""
    for i, (a, b) in enumerate(GROWN):
        r = last if i == 3 else 0.55
        fp(a, s + step * i, g, None, r, until=until); fp(b, s + step * i + 0.015, 0.75 * g, None, r, until=until)
    lo(Bb1, s, 0.9 * g, None, step * 2 + 0.2, until=until); lo(F2, s + step * 2, 0.85 * g, None, step + 0.2, until=until)
    lo(Bb2, s + step * 3, 0.9 * g, None, last, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _hump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _thud(n, f, d, at=0):
    x = np.arange(n) / SR - at; on = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.1 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * on
def _tone(n, f, at, d):
    """a soft, round note inside a sound n samples long: a sine with a little of its octave, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.22 * np.sin(2 * np.pi * 2 * f * x)) * np.minimum(1, x / 0.006) * np.exp(-x / d) * k

def card(s, g=0.0035, pan=0.0):
    """a card that says where and when: a soft flap of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.19)[:n], 'band', (420, 1700)) * _hump(x, 0.06) * (x < 0.06)
    _fx(fl + 0.5 * _thud(n, 180, 0.014, 0.07), s, g, pan, 1800)
def tap(s, g=0.0035, pan=0.0):
    """something small set in a hand or marked on a screen: the seedling's pot, a cross or a tick: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1100)) * np.exp(-x / 0.006) + 0.6 * _thud(n, 230, 0.011), s, g, pan, 1500)
def door(s, sec=0.75, g=0.004, pan=0.0):
    """a wooden door slid along its groove: a low, dry rumble of wood on wood that eases off, and the small knock as it stops"""
    n = int((sec + 0.12) * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.14)[:n], 'low', 18); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    rub = filt(noise(sec + 0.14)[:n], 'band', (110, 640)) * _hump(x, sec, 0.8) * gr
    _fx(rub + 0.7 * _thud(n, 150, 0.02, sec - 0.02), s, g, pan, 1100)
def paper(s, sec=0.3, g=0.0035, pan=0.0):
    """a sheet or a book lifted, turned or taken from a hand: one soft rustle"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (380, 1500)) * _hump(x, sec, 1.4), s, g, pan, 1700)
def given(s, g=0.004, pan=0.0):
    """a book taken from a hand: the soft press of its cover, and a little of its pages"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 165, 0.02) + 0.35 * filt(noise(0.24)[:n], 'band', (350, 1300)) * _hump(x, 0.12, 1.5), s, g, pan, 1400)
def slide(s, sec=0.9, g=0.0032, pan=0.0):
    """something drawn out or moved along: a notebook turned round on a table, a line through words, the route's boxes as they come:
    a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (450, 1600)) * _hump(x, sec, 1.2) * gr, s, g, pan, 1800)
def pen(s, sec=0.7, g=0.0042, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 50)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (650, 2000)) * _hump(x, d, 0.7) * (0.35 + 0.65 * gr), t, g, pan, 2100)
def marker(s, sec=1.6, g=0.004, pan=0.0, n=3):
    """a marker on a whiteboard, a word at a time: a soft, low rub, never a squeak"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (350, 1300)) * _hump(x, d, 0.7) * (0.4 + 0.6 * gr), t, g, pan, 1500)
def written(name, hand, g, shown, least=0.28):
    """a board's or a page's rows as the hand writes them (PEN): one soft rub for each row of words and each long mark, a word at a
    time, where the film writes it, while the board or the page is on screen (shown: the spans of the film's seconds when it is).
    A dot, a tick and an arrow's head are too short to sound"""
    for k in PEN[name]:
        d = k['t1'] - k['t0']
        if not any(a <= k['t0'] and k['t1'] <= b + 0.3 for a, b in shown):
            print('  %s: "%s" is written at %.1f s, while the film shows something else' % (name, k['s'], k['t0']))
        elif d >= least:
            hand(k['t0'], d, g, px(k['x']) * 0.5, max(1, round(d / 0.32)))
def ring(s, g=0.0022, pan=0.0):
    """a call that comes up on a screen: two soft, round notes, the second a fourth above the first, each gone in a fifth of a second"""
    n = int(0.6 * SR)
    _fx(_tone(n, hz(F4), 0.0, 0.09) + _tone(n, hz(Bb4), 0.17, 0.11), s, g, pan, 1800)
def joined(s, m, g=0.002, pan=0.0):
    """someone joins a call: one soft, round note"""
    n = int(0.4 * SR)
    _fx(_tone(n, hz(m), 0.0, 0.1), s, g, pan, 1800)
def pop(s, g=0.0022, pan=0.0, up=True):
    """a change or a message sent (up), or one that arrives: one soft, round blip that rises, or falls, a little"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    f = 430 * 2 ** ((0.4 if up else -0.4) * np.clip(x / 0.07, 0, 1))
    _fx(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.005) * np.exp(-x / 0.04), s, g, pan, 1600)
CL, CR = px(290), px(1630)   # where a card sits: on the left, under the series' tag, or on the right

# =============================================================================================================================
# 1. Watching the children: the opening. Japan, 1872: a low B flat in the empty room; the sliding door, as the teacher comes in; B flat
#    major for the new schools, and the mark, small and alone in the treble, as the children look up from their slates. Teaching, new
#    work: F major. 1877, schools across Japan: G minor under the one teacher; E flat major under the lesson nobody sees; the mark
#    breaks off before its last note as the lesson loses the children; G minor, low, as nobody learns why. The door slides open again
#    and the visitors come in: B flat major, open; groups: E flat major; the camera goes in close to the girl, and the mark again, with
#    the second player under it; the talk afterwards: F major; Mr Okada in at the door, and lesson study: B flat major in the middle.
#    The cycle, a note on each step as the voice names it; today: B flat major, fuller; the book handed over: E flat; the trial's
#    fractions, a short figure; the girl's folded strip, and the benefit: the mark, whole. The new analyst alone, and the grade handed
#    over: G minor; how people grow, three notes; and under the title card, the mark over B flat major, held, damped before the next
#    chapter. The chalk on the board has no sound
LV[0] = 0.85
lw = lambda lid, word, off=0: W('lesson', lid, word, off)
lc = lambda lid, off=0: G('lesson', lid, off)
END = E('lesson')
lo(Bb1, 0.4, 0.8, None, 1.4)
door(0.42, 0.75, 0.004, px(260)); door(5.22, 0.75, 0.0036, px(260))
chord((Bb2, F3, Bb3, D4), lw('when', 'Japan', 0.0), 0.6, step=0.15, ring=2.4)
card(lc('when', -0.2), 0.0035, CL)
mark(lw('when', 'child', -0.1), 0.5, step=0.2, last=1.4)
chord((F2, C3, F3, A3), lw('new', 'Teaching', 0.0), 0.5, step=0.14, ring=1.8)
# 1877: G minor under the single teacher, as the card says how many schools had one
card(lc('alone', 0.1), 0.0035, CL)
chord((G2, D3, G3, Bb3), lw('alone', 'teacher', -0.1), 0.5, step=0.16, ring=2.0)
# the teacher alone: the questions over the children, the second player's low D; nobody sees the lesson: E flat major
lo(D2, lw('see', 'understood', -0.3), 0.55, None, 0.8)
chord((Eb2, Bb2, Eb3, G3), lw('see', 'nobody', 0.1), 0.45, step=0.18, ring=1.6)
# the lesson loses the children: the mark breaks off before its last note; G minor, low, as nobody learns why
figure((Bb4, C5, D5), lw('lost', 'loses', 0.0), 0.45, step=0.26, ring=0.4, last=0.5)
chord((G2, D3, G3, Bb3), lw('lost', 'why', 0.2), 0.45, step=0.2, ring=1.5)
# the classroom opened: the door slides open and the visitors come in; B flat major, open; the door shut behind them
door(lc('open', -0.5), 0.75, 0.004, px(260))
chord((Bb1, F2, Bb2, D3, F3, Bb3), lw('open', 'opened', 0.1), 0.55, step=0.2, ring=2.6)
chord((Eb2, Bb2, Eb3, G3), lw('groups', 'together', 0.1), 0.45, step=0.14, ring=1.6)
door(lc('groups', 0.82), 0.75, 0.0036, px(260))
# the camera goes in close to the children, and the visitor bends by the girl: the mark again, the second player under it
mark(lc('watch', 0.3), 0.42, step=0.22, last=1.4, bass=((Bb2, 0, 0.9),))
# after the lesson, in the empty room: F major; Mr Okada in at the door; lesson study: B flat major in the middle
chord((F2, C3, F3, A3), lc('after', 0.1), 0.45, step=0.14, ring=1.6)
tE = lc('study', -0.5)
door(tE + 0.42, 0.75, 0.004, px(260)); door(tE + 3.22, 0.75, 0.0036, px(260))
chord((Bb2, F3, Bb3, D4, F4), lw('study', 'lesson', 0.0), 0.5, step=0.12, ring=2.0)
card(lc('study', 2.4), 0.0035, CL)
# the cycle on the board, and a note of B flat major at each step as the voice names it: goal, plan, teach, improve
for lid, word, m in (('cycle', 'goal', Bb3), ('cycle', 'plan', D4), ('teach', 'teaches', F4), ('teach', 'improve', Bb4)):
    fp(m, lw(lid, word, -0.1), 0.45, None, 1.0)
# today: 99 in 100, B flat major, fuller
card(lw('spread', 'Today', -0.2), 0.0035, CL)
chord((Bb1, F2, Bb2, F3, Bb3, D4), lw('spread', 'ninety', 0.0), 0.55, step=0.14, ring=2.2)
# the book handed to a colleague; E flat major as it carries lesson study to many countries
card(lc('world', 0.2), 0.0035, CL)
given(lw('world', 'book', 0.7), 0.004, px(500))
chord((Eb3, G3, Bb3, Eb4), lw('world', 'countries', 0.0), 0.45, step=0.12, ring=1.6, low=False)
# the trial: some teams with research on fractions, a short figure of F major
card(lc('trial', 0.2), 0.0035, CL)
figure((F4, A4, C5), lw('some', 'fractions', 0.0), 0.4, step=0.16, ring=0.5, last=1.0)
# their students understood fractions better: the girl holds up her strip, folded in thirds; the mark, whole, the benefit
card(lc('fractions', 0.4), 0.0035, CL)
paper(lc('fractions', 0.4), 0.3, 0.0035, px(900))
mark(lw('fractions', 'better', 0.1), 0.5, step=0.2, last=1.6, bass=((Bb2, 0, 0.6), (F2, 3, 1.0)))
# at work, alone: G minor; once a year, her manager hands her a grade
chord((G2, D3, G3, Bb3), lc('data', 0.2), 0.45, step=0.18, ring=1.6)
paper(lw('data', 'once a year', -0.8) + 2.8, 0.3, 0.0035, px(990))
# how people grow: goals, feedback, a next step, a note each
for word, m in (('goals', Bb3), ('feedback', D4), ('next', F4)):
    fp(m, lw('grow', word, -0.1), 0.42, None, 1.0)
# the title card: the mark over B flat major, held, damped before the next chapter
mark(lc('breath', 0.5), 0.5, step=0.22, last=3.4, bass=((Bb1, 0, 3.4), (F2, 0, 3.2)), until=END)
chord((Bb2, F3, Bb3, D4), lc('breath', 0.5 + 0.66), 0.42, step=0.0, ring=3.0, until=END, low=False)

# 2. Goals of her own: Ivy walks in to her new desk, and B flat major at the chapter's turn; the cards for her first day and for the
#    Friday; Ivy turns her notebook round for Helena, and a rising fourth as they agree the goals; her pen as she writes each one; the
#    call that comes up on her screen, and a note as Graham joins it; her pen again as she notes his question; like the teachers, she
#    chose: the mark, small, in the treble; the first goal met: she holds up the page, the route comes box by box, and B flat major
LV[0] = 0.9
gw = lambda lid, word, off=0: W('goals', lid, word, off)
gc = lambda lid, off=0: G('goals', lid, off)
chord((Bb2, F3, Bb3, D4), S0('goals') + 0.3, 0.45, step=0.14, ring=1.6)
card(gw('join', 'Monday', -0.3), 0.0035, CL)
gF = gw('write', 'On Friday', -0.5)
card(gF + 0.3, 0.0035, CR)
slide(gF + 1.2, 0.8, 0.003, px(980))
figure((F4, Bb4), gw('write', 'Friday', 0.0), 0.42, step=0.2, ring=0.5, last=1.2)
gN, gR, gH, gL = gc('route', -0.6), gc('real', -0.5), gc('hers', -0.5), gc('teachers', -0.5)
written('N1', pen, 0.0042, [(gN, gR), (gH, gL)])
gG, gq = gw('real', 'question', -0.3), gw('real', 'teaching rooms', -1.0)
ring(gR + 0.4, 0.0022, px(260))
joined(gG, Bb4, 0.002, px(260))
pen(gq + 1.7, 1.1, 0.004, px(475), 3)
mark(gw('teachers', 'chose', 0.0), 0.42, step=0.2, last=1.2)
card(gw('met', 'Thursday', -0.3), 0.0035, px(1410))
paper(gc('met', 1.9), 0.3, 0.0035, px(700))
slide(gw('met', 'whole route', -0.2), 2.8, 0.0028, px(570))
chord((Bb2, F3, Bb3, D4, F4), gw('met', 'met', 0.0), 0.45, step=0.12, ring=1.8, until=E('goals'))

# 3. Every Tuesday: E flat major at the turn, the one-to-one; Carmen's marker on her board as she writes what research found, G minor
#    where feedback made the work worse; Ivy's pen as she keeps the three parts; Tuesday 13 April: the week before, a cross and two
#    ticks on her screen, and B flat major on its impact; "you're brilliant" struck through; Radical Candor, on Carmen's second board:
#    F major; Tuesday 25 May: her change sent after four days, and G minor, small, on the rushed review; ask when it works: a rising
#    third; small and often: her pen, and B flat major
LV[0] = 0.9
tw = lambda lid, word, off=0: W('tuesday', lid, word, off)
tc = lambda lid, off=0: G('tuesday', lid, off)
chord((Eb2, Bb2, Eb3, G3), S0('tuesday') + 0.2, 0.45, step=0.16, ring=1.6)
card(tc('meet', 0.3), 0.0035, CL)
tK, tN, tA = tc('kluger', -0.6), tw('sbi', 'three parts', -0.8), tc('april', -0.5)
tS, tY, tO = tc('scott', -0.5), tc('may', -0.5), tc('works', -0.6)
written('A', marker, 0.004, [(tK, tN)])
chord((G2, D3, G3, Bb3), tw('third', 'third', -0.1), 0.42, step=0.18, ring=1.5)
written('N2', pen, 0.0042, [(tN, tA), (tO, E('tuesday'))])
card(tc('april', 0.1), 0.0035, CL)
tV = tw('april', 'reviewing', -0.3)
card(tV + 0.2, 0.0035, CR)
tap(tV + 0.8, 0.0032, px(360)); tap(tw('april', "Graham's", -0.2), 0.0032, px(360)); tap(tw('counts', 'people', -0.2), 0.0032, px(360))
chord((Bb2, F3, Bb3, D4), tw('counts', 'counts', 0.0), 0.45, step=0.14, ring=1.6)
slide(tw('not', 'which is', -0.1), 0.6, 0.003, px(700))
written('B', marker, 0.004, [(tS, tY)])
chord((F2, C3, F3, A3), tw('scott', 'directly', 0.1), 0.42, step=0.14, ring=1.4)
card(tc('may', 0.1), 0.0035, CL)
card(tw('may', 'to yourself', -0.1), 0.0035, CL)
pop(tc('rushed', -0.4), 0.0022, px(560))
chord((G2, D3, Bb3), tw('rushed', 'rushed', 0.1), 0.4, step=0.16, ring=1.2)
figure((D4, F4), tw('works', 'works', -0.4), 0.42, step=0.22, ring=0.5, last=1.1)
chord((Bb2, F3, Bb3, D4), tw('fresh', 'often', 0.0), 0.42, step=0.1, ring=1.4, until=E('tuesday'))

# 4. Both ways: F major at the turn, as Helena asks; Ivy tells her, and Helena's thanks: a falling sixth that lands; her pen in her own
#    notebook; lesson study, planned together: E flat major; the University Council, and Graham's note sent from his phone: B flat
#    major; who did each part: a note of F major as each one's tag comes; the team's credit, in public: B flat major, full
LV[0] = 0.9
bw = lambda lid, word, off=0: W('both', lid, word, off)
bc = lambda lid, off=0: G('both', lid, off)
chord((F2, C3, F3, A3), S0('both') + 0.2, 0.42, step=0.14, ring=1.5)
card(bc('june', -0.2), 0.0035, CL)
figure((Bb4, D4), bw('thanks', 'thanks', -0.1), 0.42, step=0.24, ring=0.5, last=1.2)
written('N3', pen, 0.0042, [(bw('thanks', 'From then', -0.6), bc('lesson', -0.5))])
chord((Eb2, Bb2, Eb3, G3), bw('lesson', 'together', 0.0), 0.42, step=0.14, ring=1.6)
card(bc('council', 0.7), 0.0035, CR)
pop(bw('council', 'writes', 0.2) + 1.8, 0.0022, px(575))
chord((Bb2, F3, Bb3, D4, F4), bw('council', 'thank', 0.0), 0.45, step=0.12, ring=1.8)
for wd, x, m in (("Ivy's", 570, F3), ("Jun's", 1758, A3), ("Sam's", 1230, C4), ("Mei's", 1530, F4)):
    fp(m, bw('parts', wd, -0.1), 0.4, px(x) * 0.4, 0.8)
chord((Bb1, F2, Bb2, D3, F3, Bb3), bw('credit', 'public', 0.1), 0.5, step=0.12, ring=2.0, until=E('both'))

# 5. The next step: Helena brings her a seedling in a pot, and it is in her hands: F major, her data product; her half year, all
#    three goals met: B flat major, and her pen as she looks back and forward; a growth conversation looks forward: E flat major;
#    December, at dusk, a low B flat; analyst, owner, coach: a tap as each step of her tag lights, the second player's note rising
#    under it, and on "coach" the mark returned, fuller, in the middle
LV[0] = 0.9
nw = lambda lid, word, off=0: W('next', lid, word, off)
nc = lambda lid, off=0: G('next', lid, off)
card(nw('july', 'Thursday', -0.3), 0.0035, px(1456))
tap(nw('july', 'Ivy owns', -0.2) + 1.0, 0.0035, px(650))
chord((F2, C3, F3, A3, C4), nw('july', 'owns', 0.0), 0.45, step=0.12, ring=1.6)
card(nc('mid', 0.1), 0.0035, CL)
chord((Bb2, F3, Bb3, D4, F4), nw('mid', 'met', 0.0), 0.45, step=0.12, ring=1.8)
written('N4', pen, 0.0042, [(nw('mid', 'half year', -0.35), nc('forward', -0.5))])
chord((Eb3, G3, Bb3, Eb4), nw('forward', 'forward', 0.0), 0.42, step=0.12, ring=1.4, low=False)
card(nc('dec', 0.1), 0.0035, CR); lo(Bb1, nc('dec', 0.1), 0.5, None, 1.0)
for i, (t, m) in enumerate(((nc('steps', -0.1), Bb1), (nw('steps', 'owner', -0.2), F2), (nw('steps', 'coach', -0.2), Bb2))):
    tap(t + 0.05, 0.003, px(1300)); lo(m, t + 0.08, 0.6, None, 0.6)
grown(nw('steps', 'coach', 0.25), 0.5, step=0.26, last=2.2, until=E('next'))

# 6. On Monday: back in a classroom of today, the mark, small, over the second player's B flat; what to do on Monday, in Ivy's
#    notebook: her pen, and B flat major as she marks the page done; leading the people who do it: E flat major; the next graduate's
#    first day; and the close: the small mark again, then the mark grown, in the middle, its last chord held into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
mark(mc('back', 0.3), 0.42, step=0.2, last=1.2, bass=((Bb2, 0, 0.8),))
written('N5', pen, 0.0042, [(mc('goals', -0.6), mc('module', -0.5))])
chord((Bb2, F3, Bb3, D4), next(k['t0'] for k in PEN['N5'] if k['s'] == 'star'), 0.42, step=0.12, ring=1.6)
chord((Eb2, Bb2, Eb3, G3), mc('module', 0.3), 0.42, step=0.16, ring=1.8)
card(mc('module', -0.1), 0.0035, CL)
e0 = mc('breath', 0.6)
mark(e0, 0.42, step=0.22, last=1.0, until=TOT)
grown(e0 + 1.3, 0.5, step=0.28, last=4.0, until=TOT)
fp(D4, e0 + 1.3 + 0.84 + 0.03, 0.38, None, 3.9, until=TOT)
