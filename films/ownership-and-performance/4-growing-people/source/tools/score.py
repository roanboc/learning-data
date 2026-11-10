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
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/gp_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays soft and below about 2.4 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1872)  # this film's own randomness: the room, the paper, the floor

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

def pin(s, g=0.0045, pan=0.0):
    """a sheet put up: a soft flap of paper, and the small press of its pin"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.19)[:n], 'band', (420, 1700)) * _hump(x, 0.06) * (x < 0.06)
    _fx(fl + 0.5 * _thud(n, 180, 0.014, 0.07), s, g, pan, 1800)
def tag(s, g=0.004, pan=0.0):
    """a tag or a pill set in place: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1100)) * np.exp(-x / 0.006) + 0.6 * _thud(n, 230, 0.011), s, g, pan, 1500)
def steps(s, n=4, g=0.0035, pan0=0.0, pan1=0.0, gap=0.42):
    """someone walking in: a few soft footfalls on a wooden floor, each low, with the boards' short ring"""
    for i in range(n):
        m = int(0.14 * SR); x = np.arange(m) / SR
        _fx(_thud(m, 120, 0.024) + 0.25 * filt(noise(0.16)[:m], 'band', (180, 520)) * np.exp(-x / 0.012), s + gap * i, g,
            pan0 + (pan1 - pan0) * i / max(1, n - 1), 900)
def pencil(s, sec=0.6, g=0.0045, pan=0.0, n=3):
    """a pencil on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 50)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (600, 1900)) * _hump(x, d, 0.7) * (0.35 + 0.65 * gr), t, g, pan, 2000)
def tick(s, g=0.0045, pan=0.0):
    """a tick or a cross drawn: two quick strokes of a pencil"""
    pencil(s, 0.22, g, pan, 2)
def book(s, g=0.005, pan=0.0):
    """a book laid on the table: a dull, soft landing, and its pages settling"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 105, 0.03) + 0.3 * filt(noise(0.32)[:n], 'band', (300, 1200)) * _hump(x, 0.16, 1.5), s, g, pan, 1300)
def rows(s, sec=1.4, g=0.003, pan=0.0):
    """many small things coming in at once (the schools, the teams, the weeks): one soft hush of paper that swells and fades, never a
    burst of taps"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1400)) * _hump(x, sec, 1.6), s, g, pan, 1500)
def rule(s, sec=1.0, g=0.003, pan=0.0):
    """a line drawn with a pencil and a rule: an even, dry rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (500, 1700)) * _hump(x, sec, 1.2) * gr, s, g, pan, 1800)
def block(s, g=0.004, pan=0.0):
    """a wooden block set down on the floor: one round, low knock"""
    n = int(0.2 * SR)
    _fx(_thud(n, 140, 0.03) + 0.4 * _thud(n, 310, 0.012), s, g, pan, 1100)

# =============================================================================================================================
# 1. Watching the children: the opening. Japan, 1872: a low B flat in the empty room, B flat major for the new schools, and the mark, small
#    and alone in the treble, as the children come in. Teaching, new work: F major. 1877, schools across Japan: G minor under the four in
#    ten; E flat major under the lesson nobody sees; the mark breaks off before its last note as the lesson loses the children; G minor,
#    low. Nothing under "Something had to change". Opened: the visitors' footsteps, and B flat major, open; groups: E flat major; the
#    camera goes in close, and the mark again, with the second player under it; the reflection: F major; lesson study: B flat major in the
#    middle. The cycle, a note at each step; today: B flat major, fuller; the book: E flat; the trial's fractions, a short figure; the
#    benefit: the mark, whole. The new analyst alone: G minor; how people grow, three notes; and under the title card, the mark over
#    B flat major, held, damped before the next chapter
LV[0] = 0.85
lw = lambda lid, word, off=0: W('lesson', lid, word, off)
lc = lambda lid, off=0: G('lesson', lid, off)
END = E('lesson')
lo(Bb1, 0.4, 0.8, None, 1.4)
chord((Bb2, F3, Bb3, D4), lw('when', 'Japan', 0.0), 0.6, step=0.15, ring=2.4)
pin(lw('when', 'Japan', -0.2), 0.004, px(295))
mark(lw('when', 'child', -0.1), 0.5, step=0.2, last=1.4)
pin(lc('new', 0.1), 0.004, px(295))
chord((F2, C3, F3, A3), lw('new', 'Teaching', 0.0), 0.5, step=0.14, ring=1.8)
tag(lw('new', 'subjects', -0.1), 0.003, px(295)); tag(lw('new', 'few', -0.1), 0.003, px(295))
# 1877: the schools, a hush as they come in; G minor under the single teacher; a tag for each share
pin(lc('alone', 0.0), 0.004, px(960))
rows(lc('alone', 0.2), 1.4, 0.003, px(960))
chord((G2, D3, G3, Bb3), lw('alone', 'teacher', -0.1), 0.5, step=0.16, ring=2.0)
tag(lw('alone', 'teacher', 0.0), 0.0035, px(960)); tag(lw('alone', 'classroom', 0.0), 0.0035, px(960))
# the teacher alone: the questions over the children, the second player's low D; nobody sees the lesson: E flat major
lo(D2, lw('see', 'understood', -0.3), 0.55, None, 0.8)
tag(lw('see', 'nobody', -0.1), 0.0035, px(280))
chord((Eb2, Bb2, Eb3, G3), lw('see', 'nobody', 0.1), 0.45, step=0.18, ring=1.6)
# the lesson loses the children: the mark breaks off before its last note; G minor, low, as nobody learns why
figure((Bb4, C5, D5), lw('lost', 'loses', 0.0), 0.45, step=0.26, ring=0.4, last=0.5)
tag(lw('lost', 'behind', -0.2), 0.0035, px(1650)); tag(lw('lost', 'never', -0.2), 0.0035, px(1650))
chord((G2, D3, G3, Bb3), lw('lost', 'why', 0.2), 0.45, step=0.2, ring=1.5)
# the classroom opened: the visitors' footsteps from both sides, and B flat major, open
walkT = lw('open', 'opened', -0.2)
steps(walkT + 0.1, 4, 0.003, px(40), px(300), 0.42); steps(walkT + 0.5, 4, 0.003, px(1880), px(1620), 0.42)
chord((Bb1, F2, Bb2, D3, F3, Bb3), lw('open', 'opened', 0.1), 0.55, step=0.2, ring=2.6)
tag(lw('groups', 'watching', -0.3), 0.003, px(300)); tag(lw('groups', 'groups', -0.2), 0.003, px(300))
chord((Eb2, Bb2, Eb3, G3), lw('groups', 'together', 0.1), 0.45, step=0.14, ring=1.6)
# the camera goes in close to the children: the mark again, the second player under it; what the visitors look for, a tag each
mark(lc('watch', 0.3), 0.42, step=0.22, last=1.4, bass=((Bb2, 0, 0.9),))
for wd in ('answered', 'interested', 'questions'):
    tag(lw('watch', wd, -0.2), 0.003, px(1290))
# after the lesson: F major; what the children learned, where they got stuck; lesson study: B flat major in the middle
chord((F2, C3, F3, A3), lc('after', 0.1), 0.45, step=0.14, ring=1.6)
tag(lw('after', 'learned', -0.2), 0.0032, px(560)); tag(lw('after', 'stuck', -0.2), 0.0032, px(1360))
pin(lc('study', 0.1), 0.004, px(960)); tag(lw('study', 'Japanese', -0.6), 0.003, px(960))
chord((Bb2, F3, Bb3, D4, F4), lw('study', 'lesson', 0.0), 0.5, step=0.12, ring=2.0)
# the cycle drawn, and a note of B flat major at each step as it lights: goal, plan, teach, improve
rule(lc('cycle', 0.0), 2.2, 0.0028, px(960))
for lid, word, m in (('cycle', 'goal', Bb3), ('cycle', 'plan', D4), ('teach', 'teaches', F4), ('teach', 'improve', Bb4)):
    fp(m, lw(lid, word, -0.1), 0.45, None, 1.0)
# today: 99 in 100, B flat major, fuller
pin(lw('spread', 'ninety', -0.3), 0.004, px(305))
chord((Bb1, F2, Bb2, F3, Bb3, D4), lw('spread', 'ninety', 0.0), 0.55, step=0.14, ring=2.2)
# the book laid down, its sheet; E flat major as it carries lesson study to many countries
book(lc('world', 0.0), 0.0045, px(635)); pin(lw('world', 'book', -0.2), 0.004, px(1200))
chord((Eb3, G3, Bb3, Eb4), lw('world', 'countries', 0.0), 0.45, step=0.12, ring=1.6, low=False)
# the trial: its sheet, the 39 teams as one hush; some, with research on fractions: the strip's sheet, and a short figure of F major
pin(lc('trial', 0.0), 0.004, px(620)); rows(lw('trial', 'thirty', -0.2), 1.6, 0.0028, px(1460))
tag(lw('some', 'Some', -0.1), 0.003, px(620))
pin(lw('some', 'fractions', -0.2), 0.004, px(1420))
figure((F4, A4, C5), lw('some', 'fractions', 0.0), 0.4, step=0.16, ring=0.5, last=1.0)
# their students understood fractions better: the mark, whole, the benefit
pin(lw('fractions', 'fractions', -0.3), 0.004, px(620)); tag(lw('fractions', 'another', -0.2), 0.003, px(620))
mark(lw('fractions', 'better', 0.1), 0.5, step=0.2, last=1.6, bass=((Bb2, 0, 0.6), (F2, 3, 1.0)))
# at work, alone: G minor; nobody sees her work, a grade once a year
chord((G2, D3, G3, Bb3), lc('data', 0.2), 0.45, step=0.18, ring=1.6)
tag(lw('data', 'nobody', -0.1), 0.0032, px(960)); tag(lw('data', 'once', -0.1), 0.0032, px(960))
# how people grow: goals, feedback, a next step, a pill and a note each
for word, m in (('goals', Bb3), ('feedback', D4), ('next', F4)):
    tag(lw('grow', word, -0.2), 0.003, px(960)); fp(m, lw('grow', word, -0.1), 0.42, None, 1.0)
# the title card: the mark over B flat major, held, damped before the next chapter
mark(lc('breath', 0.5), 0.5, step=0.22, last=3.4, bass=((Bb1, 0, 3.4), (F2, 0, 3.2)), until=END)
chord((Bb2, F3, Bb3, D4), lc('breath', 0.5 + 0.66), 0.42, step=0.0, ring=3.0, until=END, low=False)

# 2. Goals of her own: Ivy walks in, and B flat major at the chapter's turn; Helena's footsteps; her goals written, a pencil stroke for
#    each, and a rising fourth as they're agreed; like the teachers, she chose: the mark, small, in the treble; the first goal met: a tick,
#    and B flat major
LV[0] = 0.9
gw = lambda lid, word, off=0: W('goals', lid, word, off)
gc = lambda lid, off=0: G('goals', lid, off)
steps(S0('goals') + 0.4, 4, 0.003, px(-100), px(480), 0.42)
chord((Bb2, F3, Bb3, D4), S0('goals') + 0.3, 0.45, step=0.14, ring=1.6)
pin(gw('join', 'Ivy', -0.2), 0.004, px(1260)); tag(gw('join', 'job', -0.4), 0.003, px(1260)); tag(gw('join', 'statistics', -0.3), 0.003, px(1260))
steps(gc('helena', -0.3), 4, 0.003, px(1920), px(1420), 0.42)
tag(gw('helena', 'list', -0.2), 0.0035, px(970))
pin(gc('write', 0.0), 0.004, px(1280))
tag(gw('write', 'Friday', -0.2), 0.0035, px(1570))
figure((F4, Bb4), gw('write', 'Friday', 0.0), 0.42, step=0.2, ring=0.5, last=1.2)
for lid in ('route', 'pr', 'own'):
    pencil(gc(lid, 0.0), 0.6, 0.004, px(1280), 3)
pin(gw('real', 'Graham', -0.3), 0.004, px(590)); tag(gw('real', 'rooms', -0.2), 0.003, px(590))
pin(gc('hers', 0.0), 0.004, px(560)); pin(gw('hers', 'measures', -0.2), 0.004, px(1360))
tag(gw('hers', 'targets', -0.3), 0.0035, px(1360))
tag(gw('teachers', 'teachers', -0.2), 0.0035, px(560))
mark(gw('teachers', 'chose', 0.0), 0.42, step=0.2, last=1.2)
pin(gw('met', 'route', -0.4), 0.004, px(1370))
rule(gw('met', 'decision', -0.2), max(0.8, gw('met', 'sensors', 0) - gw('met', 'decision', -0.2) + 0.4), 0.0028, px(1370))
tick(gw('met', 'met', -0.2), 0.0045, px(480))
chord((Bb2, F3, Bb3, D4, F4), gw('met', 'met', 0.0), 0.45, step=0.12, ring=1.8, until=E('goals'))

# 3. Every Tuesday: E flat major at the turn, the one-to-one; the 600 results, the bar drawn, G minor where feedback made the work worse;
#    the task and the person, the arrow; the three parts; Tuesday 13 April: B flat major on its impact; Radical Candor: F major; Tuesday
#    25 May: G minor, small, on the rushed review; ask when it works: a rising third; small and often: the weeks, one hush, and B flat major
LV[0] = 0.9
tw = lambda lid, word, off=0: W('tuesday', lid, word, off)
tc = lambda lid, off=0: G('tuesday', lid, off)
chord((Eb2, Bb2, Eb3, G3), S0('tuesday') + 0.2, 0.45, step=0.16, ring=1.6)
pin(tw('meet', 'Tuesday', -0.2), 0.004, px(960)); tag(tw('meet', 'status', -0.2), 0.0035, px(960))
pin(tc('kluger', 0.0), 0.004, px(690)); tag(tw('kluger', 'Avraham', 0.0), 0.003, px(690))
rule(tw('third', 'helped', -0.3), 0.8, 0.0028, px(700)); tag(tw('third', 'helped', 0.0), 0.003, px(480))
chord((G2, D3, G3, Bb3), tw('third', 'third', -0.1), 0.42, step=0.18, ring=1.5)
tag(tw('third', 'third', 0.05), 0.003, px(1410))
tag(tc('person', 0.2), 0.0035, px(560))
rule(tw('person', 'person', -0.3), 0.8, 0.0028, px(950)); tag(tw('person', 'person', 0.25), 0.0035, px(1360))
pin(tc('sbi', 0.2), 0.004, px(960))
for wd, x in (('situation', 380), ('behaviour', 940), ('impact', 1500)):
    pin(tw('sbi', wd, -0.3), 0.0035, px(x))
tag(tw('sbi', 'Center', -0.2), 0.003, px(960))
tag(tc('april', 0.0), 0.003, px(960))
pin(tw('april', 'Wednesday', -0.3), 0.0035, px(380)); pin(tw('april', 'checked', -0.3), 0.0035, px(940)); pin(tw('counts', 'counts', -0.4), 0.0035, px(1500))
chord((Bb2, F3, Bb3, D4), tw('counts', 'counts', 0.0), 0.45, step=0.14, ring=1.6)
tag(tw('not', 'brilliant', -0.4), 0.0035, px(960)); tag(tw('not', 'brilliant', 0.0), 0.003, px(960))
tag(tw('not', 'did', -0.2), 0.0032, px(700)); tag(tw('not', 'changed', -0.2), 0.0032, px(1220))
tag(tc('scott', 0.2), 0.003, px(960)); pin(tw('scott', 'Candor', -0.6), 0.004, px(960))
tag(tw('scott', 'care', -0.2), 0.0032, px(700)); tag(tw('scott', 'challenge', -0.2), 0.0032, px(1220))
chord((F2, C3, F3, A3), tw('scott', 'directly', 0.1), 0.42, step=0.14, ring=1.4)
tag(tc('may', 0.0), 0.003, px(960))
pin(tw('may', 'Last', -0.3), 0.0035, px(380)); pin(tw('may', 'four', -0.6), 0.0035, px(940)); pin(tw('rushed', 'Jun', -0.3), 0.0035, px(1500))
chord((G2, D3, Bb3), tw('rushed', 'rushed', 0.1), 0.4, step=0.16, ring=1.2)
tag(tw('works', 'works', -0.6), 0.0035, px(960))
figure((D4, F4), tw('works', 'works', -0.4), 0.42, step=0.22, ring=0.5, last=1.1)
rows(tc('fresh', 0.0), 2.0, 0.0028, px(830))
tag(tw('fresh', 'often', -0.3), 0.003, px(830)); tag(tw('fresh', 'year', -0.8), 0.003, px(1430))
tick(tw('fresh', 'year', -0.2), 0.0045, px(1500))
chord((Bb2, F3, Bb3, D4), tw('fresh', 'often', 0.0), 0.42, step=0.1, ring=1.4, until=E('tuesday'))

# 4. Both ways: F major at the turn; Helena asks, Ivy tells her, a sheet each; thank you: a falling sixth that lands; lesson study,
#    planned together: E flat major; the University Council and Graham's note: B flat major; who did each part: a note of F major for
#    each name; the team's credit, in public: B flat major, full
LV[0] = 0.9
bw = lambda lid, word, off=0: W('both', lid, word, off)
bc = lambda lid, off=0: G('both', lid, off)
chord((F2, C3, F3, A3), S0('both') + 0.2, 0.42, step=0.14, ring=1.5)
pin(bw('asks', 'feedback', -0.4), 0.004, px(960)); pin(bc('june', 0.1), 0.004, px(960))
tag(bw('thanks', 'thanks', -0.3), 0.0035, px(960))
figure((Bb4, D4), bw('thanks', 'thanks', -0.1), 0.42, step=0.24, ring=0.5, last=1.2)
pin(bw('thanks', 'tried', -0.8), 0.004, px(960))
tag(bw('lesson', 'planned', -0.2), 0.0032, px(560)); tag(bw('lesson', 'talk', -0.2), 0.0032, px(1340))
chord((Eb2, Bb2, Eb3, G3), bw('lesson', 'together', 0.0), 0.42, step=0.14, ring=1.6)
pin(bc('council', 0.0), 0.004, px(560)); pin(bw('council', 'Graham', -0.2), 0.004, px(1400))
chord((Bb2, F3, Bb3, D4, F4), bw('council', 'thank', 0.0), 0.45, step=0.12, ring=1.8)
for wd, x, m in (('route', 700, F3), ('models', 1020, A3), ('sensors', 1340, C4), ('bookings', 1660, F4)):
    tag(bw('parts', wd, -0.2), 0.003, px(x)); fp(m, bw('parts', wd, -0.1), 0.4, px(x) * 0.4, 0.8)
tag(bw('credit', 'credit', -0.3), 0.0035, px(960))
chord((Bb1, F2, Bb2, D3, F3, Bb3), bw('credit', 'public', 0.1), 0.5, step=0.12, ring=2.0, until=E('both'))

# 5. The next step: her data product, F major; her half year, all three goals met: B flat major; looking forward: E flat major; December,
#    a low B flat in the evening; analyst, owner, coach: a block set down for each step, the second player's note rising under it, and on
#    "coach" the mark returned, fuller, in the middle
LV[0] = 0.9
nw = lambda lid, word, off=0: W('next', lid, word, off)
nc = lambda lid, off=0: G('next', lid, off)
pin(nw('july', 'July', -0.2), 0.004, px(1300))
chord((F2, C3, F3, A3, C4), nw('july', 'owns', 0.0), 0.45, step=0.12, ring=1.6)
for wd, off in (('counts', -0.2), ('refreshed', -0.2)):
    tag(nw('july', wd, off), 0.003, px(1300))
pin(nc('mid', 0.0), 0.004, px(960))
chord((Bb2, F3, Bb3, D4, F4), nw('mid', 'met', 0.0), 0.45, step=0.12, ring=1.8)
pin(nw('well', 'well', -0.4), 0.004, px(530)); pin(nw('well', 'differently', -0.4), 0.004, px(1390))
pin(nw('wants', 'wants', -0.4), 0.004, px(960)); tag(nw('wants', 'teach', -0.2), 0.003, px(960))
tag(nc('forward', 0.1), 0.003, px(960))
tag(nw('forward', 'wants', -0.3), 0.0032, px(640)); tag(nw('forward', 'needs', -0.3), 0.0032, px(1280))
chord((Eb3, G3, Bb3, Eb4), nw('forward', 'forward', 0.0), 0.42, step=0.12, ring=1.4, low=False)
pin(nc('dec', 0.0), 0.004, px(960)); lo(Bb1, nc('dec', 0.1), 0.5, None, 1.0)
pin(nc('coach', 0.15), 0.004, px(960))
a0 = nw('steps', 'Analyst', -0.3); span = nw('steps', 'coach', 0.0) + 0.3 - a0
for i, (m, x) in enumerate(((Bb1, 560), (F2, 960), (Bb2, 1360))):
    block(a0 + span * i / 3 + 0.05, 0.004, px(x)); lo(m, a0 + span * i / 3 + 0.08, 0.6, None, 0.6)
grown(nw('steps', 'coach', 0.25), 0.5, step=0.26, last=2.2, until=E('next'))

# 6. On Monday: back in a classroom of today, the mark, small, over the second player's B flat; the three things the teachers did, a pill
#    each; Helena's three; the four things to do on Monday, a sheet each, and B flat major on the last; leading the people who do it:
#    E flat major; the last line's three pills; and the close: the small mark again, then the mark grown, in the middle, its last chord
#    held into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
mark(mc('back', 0.3), 0.42, step=0.2, last=1.2, bass=((Bb2, 0, 0.8),))
for wd in ('goal', 'eyes', 'better'):
    tag(mw('way', wd, -0.2), 0.003, px(960))
for wd in ('goals', 'feedback', 'next'):
    tag(mw('helena', wd, -0.2), 0.003, px(1390))
pin(mc('goals', 0.2), 0.004, px(530)); pin(mw('feedback', 'feedback', -0.4), 0.004, px(1390))
pin(mw('ask', 'Ask', -0.2), 0.004, px(530)); pin(mw('forward', 'Look', -0.2), 0.004, px(1390))
chord((Bb2, F3, Bb3, D4), mw('forward', 'public', 0.1), 0.42, step=0.12, ring=1.6)
tag(mw('module', 'Leading', -0.3), 0.003, px(960))
chord((Eb2, Bb2, Eb3, G3), mc('module', 0.3), 0.42, step=0.16, ring=1.8)
for wd, x in (('goals', 420), ('weekly', 960), ('next', 1500)):
    tag(mw('take', wd, -0.1), 0.003, px(x))
e0 = mc('breath', 0.6)
mark(e0, 0.42, step=0.22, last=1.0, until=TOT)
grown(e0 + 1.3, 0.5, step=0.28, last=4.0, until=TOT)
fp(D4, e0 + 1.3 + 0.84 + 0.03, 0.38, None, 3.9, until=TOT)
