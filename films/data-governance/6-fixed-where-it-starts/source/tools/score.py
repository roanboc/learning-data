# Fixed where it starts: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (PLAYBOOK.md: vary the sound itself, film to film; the series' brass, music box, clarinets, double reeds,
# strings, harp, guitar, pianos, flutes, celesta, glockenspiel and vibraphone are left to the films that have them):
#  - A glass harmonica holds the chords: glass bowls turning under a wet finger, nearly pure notes that bloom in slowly and ring on
#    when the finger lifts. It plays under the opening story, in Vienna in 1847, in E minor until the hands are washed and in G major
#    after; and after that only now and then, at a chapter's turn, under a moment on screen, or in a pause without words (the series'
#    sound, 20 October 2026): the present is in D major, and the end goes back to G for the series' mark.
#  - Handbells, struck softly with a padded mallet, mark the moments that land, and mean the same all through: one bell, D, where a
#    problem shows; the G under it, then the D again, where it starts; three rising for prevent, test and watch; one low bell, left to
#    ring, for what's wrong and still going on (the leak that never stops, the night of one in two).
#  - The glass has two figures of its own. A phrase of four falling notes, 5-3-2-1, is the fix made where the problem starts: as the
#    hands go into the basin, as the clamps go on, and as binder 15's line is marked green. A rising fifth is a fix that's become a
#    rule or a check: the cell turning green, the surprise that becomes a test, and the washing that became the rule in Vienna.
#  - The series' mark, four notes, 1-5-4-8, on the handbells, with the glass under them, plays under the title and the end card.
# The rules the series keeps:
#  - Nothing trembles, pulses or beats (the series, 20 October 2026): no urgent pulse, even on the night of one in two; every note has
#    one voice, with no vibrato and no tremolo; every chord is tuned pure (just intonation, from the key's own note, see hz()), and a
#    note two chords share is held through the change, so no two notes a little apart beat on a phone's speaker. tools/quiet.py
#    checks it, and that after the opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing loops. Where the picture repeats (the drips, the mop, the badges arriving), the sound plays the first few, then softer.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed. The drips
#    follow fw_drip() in src/plan.js drop by drop, while their bucket is in the shot.
# And everything stays low and soft: water, a tin bucket, iron clamps, wood, paper, a pen, muffled keys, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, math as _math, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def rel(sid, t):
    """a moment in the film, as seconds into its chapter"""
    return t - S0(sid)
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R6 = np.random.default_rng(6)  # this film's own randomness: the drops, the water, the paper

# ---- tuning: just intonation from the key's own note, so a chord's notes are whole-number ratios of each other and nothing beats.
# Vienna and the mark are in G (E minor is its relative minor); the present is in D, a pure fifth above it, so the notes the two keys
# share are the same pitch in both (only E moves, by a comma, and it's never held across a change of key). In G, the chord on A is left
# out (its fifth, A to E, isn't pure in this tuning); in D, the chord on E
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEYS = {'G': (55, 196.0, {8: 25 / 16}), 'D': (62, 294.0, {})}  # tonic (MIDI), its pitch, and notes tuned other than _JI (D sharp, for B major)
def hz(m, k='G'):
    t, f, alt = KEYS[k]; o, pc = divmod(m - t, 12)
    return f * 2 ** o * alt.get(pc, _JI[pc])

# ---- the levels: the glass sits about 21 dB under the voice while it speaks, as in the series' other films, and the bells a little
# over it; the effects about 12 dB under the music (FX scales them all)
GL, BL, FX = 0.034, 0.042, 1.3  # a glass note, a handbell, the effects

# ---- the glass harmonica
def glass(m, start, sec, g=GL, pan=0.0, k='G', ring=1.6):
    """a glass bowl turning under a wet finger: nearly a pure note, with a trace of the octave and the twelfth from the rubbing, that
    blooms in as the finger finds the rim (slower the lower it is), with the soft hush of the wet finger while it touches, and the
    bowl's own higher ring for a moment as it starts to sound; when the finger lifts, the bowl rings on and fades. It holds steady:
    no tremolo, no vibrato"""
    f = hz(m, k); n = int((sec + ring) * SR); x = np.arange(n, dtype=np.float32) / SR
    a = float(np.clip(0.5 * (196.0 / f) ** 0.7, 0.16, 0.6))
    e = np.where(x < a, np.sin(0.5 * np.pi * np.minimum(x / a, 1)) ** 2, 1.0)
    e = np.where(x > sec, np.exp(-(x - sec) / 0.45), e) * np.clip((sec + ring - x) / 0.08, 0, 1)
    ph = 2 * np.pi * f * x
    s = (np.sin(ph) + 0.055 * np.sin(2 * ph + 0.4) + 0.018 * np.sin(3 * ph + 1.1)) * e
    s = s + 0.04 * np.sin(2.76 * ph + 0.3) * np.exp(-x / 0.12) * np.minimum(1, x / 0.01)
    touch = np.clip(np.minimum(x / a, 1), 0, 1) * np.clip((sec - x) / 0.15, 0, 1)
    s = s + 0.016 * filt(noise(sec + ring)[:n], 'band', (f * 0.85, min(2200, f * 3))) * touch
    put(norm(filt(s.astype(np.float32), 'low', 2400)), start, g, pan)
def chords(prog, k='G', g=GL, gap=0.05):
    """chords on the glass, one after another: prog is [(start, end, [notes])]. A note two chords next to each other share is held
    through the change, by the same finger on the same bowl, so it neither stops nor doubles; the others lift as the next chord's
    bloom in, a few hundredths of a second apart, from the lowest up"""
    runs = []
    for i, (a, b, notes) in enumerate(prog):
        for j, m in enumerate(sorted(notes)):
            r = next((r for r in runs if r[0] == m and r[2] == i - 1), None)
            if r:
                r[1:3] = [b, i]
            else:
                runs.append([m, b, i, a + gap * j, j, len(notes)])
    for m, b, _, a, j, n in runs:
        glass(m, a, b - a, g * (1.0 if j == 0 else 0.82) / n ** 0.35, -0.45 + 0.9 * j / max(1, n - 1), k)
def phrase(notes, start, step=0.55, last=2.4, g=GL * 1.1, k='G', pan=0.15):
    """the glass's phrase: notes one after another, each ringing into the next, the last held"""
    for i, m in enumerate(notes):
        glass(m, start + i * step, last if i == len(notes) - 1 else step + 0.25, g, pan - 0.1 * i, k)
def fifth(m, start, sec=2.6, g=GL * 1.1, k='D', pan=0.0):
    """the glass's rising fifth: a note, then the fifth above it, both held"""
    glass(m, start, sec + 0.45, g, pan - 0.2, k); glass(m + 7, start + 0.45, sec, g * 0.9, pan + 0.2, k)

# ---- the handbells
def bell(m, start, g=BL, pan=0.0, k='G', damp=None):
    """a handbell, struck softly with a padded mallet: its note and, tuned pure, the twelfth above it, with a trace of its two
    higher partials, each dying away faster than the one below; the lower the bell, the longer it rings, until a hand damps it. One
    voice to each partial, so it rings steady, without the warble of a bell that's out of round"""
    f = hz(m, k); T = 8.0 * (196.0 / f) ** 0.6; sec = damp or min(0.85 * T, 8.0); x = tt(sec + 0.3)
    s = sum(a * np.sin(2 * np.pi * f * r * x + 0.6 * i) * np.exp(-6.9 * x / (T * d))
            for i, (r, a, d) in enumerate(((1.0, 1.0, 1.0), (3.0, 0.24, 0.55), (5.42, 0.05, 0.22), (8.47, 0.015, 0.1))) if f * r < 2300)
    s = s * np.minimum(1, x / 0.003) * np.clip((sec + 0.3 - x) / 0.3, 0, 1)
    s = s + 0.05 * filt(noise(sec + 0.3), 'band', (150, 900))[:len(x)] * np.exp(-x * 140)
    put(norm(filt(s.astype(np.float32), 'low', 2400)), start, g, pan)
def shows(s, g=BL * 0.9, pan=0.0):
    """where a problem shows: one bell, D"""
    bell(62, s, g, pan)
def starts(s, g=BL * 0.9, pan=0.0):
    """where it starts: the G under the D, then the D again"""
    bell(55, s, g, pan - 0.15); bell(62, s + 0.38, g * 0.85, pan + 0.15)
def mark(start, g=BL, k='G'):
    """the series' four notes, 1-5-4-8, on the handbells: G, D, C and the G above"""
    for i, iv in enumerate([0, 7, 5, 12]):
        bell(67 + iv, start + i * 0.45, g * (0.9 if i < 3 else 1.0), (i - 1.5) * 0.14, k)

# ---- soft sounds, all low-passed
def knock(s, g=0.03, pan=0.0, f=240):
    """a soft wooden knock: a plate or a card arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.014, pan=0.0):
    """a muffled key, or a fingertip on a phone's glass"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.026, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pin(s, g=0.028, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def rubber(s, g=0.042, pan=0.0):
    """a rubber stamp on a card: a padded thump, and the card under it"""
    x = tt(0.25); X(norm((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 22) + 0.5 * filt(noise(0.25), 'band', (200, 1200))[:len(x)] * np.exp(-x * 45)).astype(np.float32)), s, g * FX, pan)
def slide(s, g=0.022, pan=0.0, sec=0.42):
    """a binder drawn out along a wooden shelf: a low, rough slide, and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
    s_knock(s + sec * 0.92, g * 0.5 * FX, pan, 200)
def pencil(s, g=0.014, pan=0.0, sec=0.8):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def pen(s, g=0.013, pan=0.0, sec=0.9):
    """a steel pen writing a line in the register: short strokes, unevenly, never quite in time"""
    x = tt(sec); e = np.zeros(len(x), np.float32); t0 = 0.0
    while t0 < sec - 0.06:
        d = R6.uniform(0.05, 0.13); i, j = int(t0 * SR), min(len(x), int((t0 + d) * SR))
        e[i:j] = np.maximum(e[i:j], np.sin(np.pi * np.arange(j - i) / max(1, j - i)) * R6.uniform(0.5, 1.0)); t0 += d + R6.uniform(0.0, 0.05)
    X(filt(noise(sec), 'band', (600, 2100))[:len(x)] * e, s, g * FX, pan)
def marker(s, g=0.016, pan=0.0, sec=1.3):
    """a highlighter drawn along a line: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def flutter(s, g=0.02, pan=0.0, sec=0.8):
    """a sheet of paper flying: a few soft flaps of air"""
    x = tt(sec); fl = 0.55 + 0.45 * np.sin(2 * np.pi * (7 + 3 * R6.uniform()) * x) ** 2
    X(filt(noise(sec), 'band', (200, 1300))[:len(x)] * fl * np.sin(np.pi * x / sec), s, g * FX, pan)
def book(s, g=0.035, pan=0.0):
    """a book set down on a desk: a low, padded thud, and its pages"""
    x = tt(0.4); X(norm(filt((np.sin(2 * np.pi * 82 * x) * np.exp(-x * 14) + 0.4 * filt(noise(0.4), 'band', (100, 600))[:len(x)] * np.exp(-x * 40)).astype(np.float32), 'low', 900)), s, g * FX, pan)
    paper(s + 0.01, g * 0.4, pan, 0.25)
def latch(s, g=0.02, pan=0.0):
    """a wooden door's latch lifted, and the door swinging on its hinges: a dull click and a breath of air, no creak"""
    s_knock(s, g * FX, pan, 300); s_air(s + 0.05, 0.6, g * 0.5 * FX, pan, 150, 700)
def shut(s, g=0.016, pan=0.0):
    """a door closing, softly: a low knock"""
    s_knock(s, g * FX, pan, 170)
def air(s, sec=0.9, g=0.018, pan=0.0):
    """things moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)

# ---- water, the leak and the repair
def plunge(s, g=0.03, pan=0.0):
    """hands going into the basin: a low swell of water, and a few small bubbles"""
    x = tt(0.9); X(filt(noise(0.9), 'band', (120, 900))[:len(x)] * np.sin(np.pi * np.minimum(x / 0.9, 1)) ** 2 * np.exp(-x * 2.5), s, g * FX, pan)
    for k in range(5):
        bubble(s + 0.08 + 0.1 * k + 0.05 * R6.uniform(), g * 0.35 * R6.uniform(0.5, 1.0), pan, R6.uniform(380, 820))
def bubble(s, g=0.01, pan=0.0, f=600):
    """one small bubble: a short note that rises as it closes"""
    x = tt(0.08); ph = 2 * np.pi * np.cumsum(f * (1 + 0.4 * (1 - np.exp(-x / 0.02)))) / SR
    X((np.sin(ph) * np.exp(-x / 0.022) * np.minimum(1, x / 0.002)).astype(np.float32), s, g * FX, pan)
def rub(s, sec=1.2, g=0.016, pan=0.0):
    """hands rubbed together under the water: a soft wash that comes and goes with them"""
    x = tt(sec); X(filt(noise(sec), 'band', (220, 1400))[:len(x)] * (0.4 + 0.6 * np.sin(np.pi * 3.2 * x) ** 2) * np.sin(np.pi * x / sec), s, g * FX, pan)
def drip(s, g=0.013, pan=0.0):
    """a drop landing in the tin bucket's water: a small plip, a bubble that rises as it closes, and the tin's dull ring under it"""
    f = 620 * (1 + 0.12 * R6.uniform(-1, 1)); x = tt(0.3)
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.45 * (1 - np.exp(-x / 0.014)))) / SR
    s_ = np.sin(ph) * np.exp(-x / 0.028) * np.minimum(1, x / 0.0015)
    s_ = s_ + 0.15 * sum(a * np.sin(2 * np.pi * fm * x) * np.exp(-x / d) for fm, a, d in ((410, 1.0, 0.07), (1060, 0.4, 0.04)))
    X(norm(filt(s_.astype(np.float32), 'low', 2000)), s, g * FX * R6.uniform(0.8, 1.0), pan)
def swish(s, g=0.016, pan=0.0, sec=0.6):
    """a wet mop drawn across the floor"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1100))[:len(x)] * np.sin(np.pi * x / sec) ** 1.4, s, g * FX, pan)
def tin(s, g=0.022, pan=0.0):
    """a tin bucket set down on the floor: a dull, low ring, damped by the water in it"""
    x = tt(0.5); X(norm(filt(sum(a * np.sin(2 * np.pi * fm * x) * np.exp(-x / d) for fm, a, d in ((236, 1.0, 0.16), (571, 0.45, 0.09), (1013, 0.2, 0.05))).astype(np.float32), 'low', 1800)), s, g * FX, pan)
    s_knock(s, g * 0.4 * FX, pan, 140)
def clamp_(s, g=0.03, pan=0.0):
    """a pipe clamp closed round a joint and tightened: a dull iron clink, then two short turns of its screw"""
    x = tt(0.5); X(norm(filt((sum(a * np.sin(2 * np.pi * fm * x) * np.exp(-x / d) for fm, a, d in ((318, 1.0, 0.12), (742, 0.4, 0.07), (1290, 0.15, 0.04)))
                               + 0.6 * np.sin(2 * np.pi * 95 * x) * np.exp(-x * 30)).astype(np.float32), 'low', 1800)), s, g * FX, pan)
    s_tap(s + 0.2, g * 0.35 * FX, pan); s_tap(s + 0.29, g * 0.3 * FX, pan)

# the drops, as src/plan.js draws them: fw_drip() lets one fall from each joint every 0.95 s (fewer as its rate falls, as a bucket
# comes or goes, or as the clamps go on), from its own phase (0.37 s more for each joint along), landing 0.78 s later. A drop is heard
# when it lands, while its shot is on screen and its joint is in the frame: the three joints at FW_LK, along the pipe
JOINTS, PER, FALL = (1356, 862, 318), 0.95, _math.sqrt(2 * (812 - 58 - 20) / 2400)
def _hash(n, s):
    x = _math.sin(n * 127.1 + s * 311.7) * 43758.5453123
    return x - _math.floor(x)
def drips(sid, t0, t1, rate, joints={0: (2, None)}, g=0.013):
    """the drops that land between t0 and t1 (seconds into the chapter), rate(i, t) as the shot draws it, from the joints in the shot:
    joints[i] is how many of joint i's are heard at g before the rest come softer, and how many are heard at all (None: all of them),
    so the leak in the middle of the shot keeps dripping and the others are only heard as they start. While a bucket comes or goes,
    or the clamps go on, the drops' timing shifts from frame to frame, so only the drops of a steady leak are heard"""
    for i, (full, most) in joints.items():
        jx, ph, seen, falling = JOINTS[i], 0.37 * i, 0, set()
        for t in np.arange(t0, t1, 0.004):
            r = rate(i, t)
            if r < 0.999:
                falling.clear(); continue
            per, tt_ = PER / max(0.3, r), t + ph; now = set()
            for n in range(int(_math.floor(tt_ / per)) - 2, int(_math.floor(tt_ / per)) + 1):
                if _hash(n, jx) > r * 1.15:
                    continue
                u = tt_ - n * per
                if u < FALL:
                    now.add(n)
                elif u < FALL + 0.5 and n in falling and (most is None or seen < most):
                    drip(S0(sid) + t, g * (1.0 if seen < full else 0.6), px(jx)); seen += 1
            falling = now
fin_ = lambda t, t0, d: min(1.0, max(0.0, (t - t0) / d))
def strokes(sid, a, b, n=4):
    """the mop's strokes, as fw_heldMop() swings it, sin(2.6 t) in the chapter's time: each heard at its middle, where it moves
    fastest; the first two, then softer, then no more"""
    for k, i in enumerate(range(int(np.ceil((rel(sid, a) + 0.3) * 2.6 / np.pi)), int(rel(sid, b) * 2.6 / np.pi) + 1)):
        if k < n:
            swish(S0(sid) + i * np.pi / 2.6 - 0.3, 0.016 if k < 2 else 0.01, px(1500))

# =============================================================================================================================
# 1. Two clinics: the glass under the whole story. E minor for the hospital and its two clinics, the doctors and the students, and
#    the autopsy room; a B major chord for Semmelweis' question; G major once the hands go into the lime. The fix's phrase as the
#    hands dip; C, D and G as the deaths fall to the second clinic's level; a bell where the fever shows, and the G under it where it
#    starts; the mark under the title, and the chord's D held into the present's first chord, D major, as Today comes up
reg = G('clinics', 'fall', -0.5); hands = W('clinics', 'wash', 'before', -0.2); ward = G('clinics', 'showed', -0.5)
c_hd = W('clinics', 'showed', 'hands'); c_shows = W('clinics', 'showed', 'showed'); dip = G('clinics', 'lesson', 2.9)
title = G('clinics', 'breath', 0.7); today = S0('monday')
EM, C_, GM, B_, D_ = [55, 59, 64], [55, 60, 64], [55, 59, 62], [59, 63, 66], [57, 62, 66]
chords([(0.4, G('clinics', 'first', -0.3), EM),
        (G('clinics', 'first', -0.3), G('clinics', 'second', -0.5), C_),
        (G('clinics', 'second', -0.5), G('clinics', 'looks', -0.4), GM),
        (G('clinics', 'looks', -0.4), W('clinics', 'looks', 'looks', -0.2), EM),
        (W('clinics', 'looks', 'looks', -0.2), G('clinics', 'autopsy', -0.2), B_),
        (G('clinics', 'autopsy', -0.2), W('clinics', 'autopsy', 'The midwives', -0.3), EM),
        (W('clinics', 'autopsy', 'The midwives', -0.3), G('clinics', 'wash', -0.3), C_),
        (G('clinics', 'wash', -0.3), reg, GM),
        (reg, W('clinics', 'fall', 'deaths', -0.2), C_),
        (W('clinics', 'fall', 'deaths', -0.2), W('clinics', 'fall', 'the level', -0.3), D_),
        (W('clinics', 'fall', 'the level', -0.3), ward, GM),
        (ward, W('clinics', 'showed', 'It started', -0.3), EM),
        (W('clinics', 'showed', 'It started', -0.3), W('clinics', 'lesson', 'not where', -0.2), [60, 64, 67]),  # C, the G above: the bells bring the G below
        (W('clinics', 'lesson', 'not where', -0.2), G('clinics', 'breath', -0.4), D_),
        (G('clinics', 'breath', -0.4), today - 0.25, GM),
        (today - 0.25, G('monday', 'binder', 2.0), D_)])  # Today: the D the mark ends on, and the present's chord
phrase([74, 71, 69, 67], hands + 1.0)  # the hands go into the lime: D, B, A, G
shows(c_shows + 0.05, pan=-0.2)
starts(c_hd - 0.05, pan=0.35)
mark(title + 0.55)
# the effects of 1847: the doors' plates, the doors, the water in the basin, the pen in the register
for w, p in [(W('clinics', 'first', 'doctors', -0.3), 875), (W('clinics', 'second', 'midwives', -0.3), 1415), (W('clinics', 'looks', 'Ignaz'), 1370)]:
    knock(w + 0.06, 0.02, px(p), 260)
come, mid = W('clinics', 'autopsy', 'come'), W('clinics', 'autopsy', 'midwives')
for o, c, p in [(come - 0.9, come + 1.6, 295), (come + 1.5, come + 3.7, 875), (mid + 0.5, None, 1415)]:  # the last closes as the shot dissolves
    latch(o + 0.08, 0.016, px(p))
    if c:
        shut(c - 0.05, 0.012, px(p))
plunge(G('clinics', 'wash', -0.4) + 0.8, 0.018, px(640))  # the doctor at the basin by the first clinic's door
plunge(hands + 0.95, 0.03, 0.0); rub(hands + 1.3, 1.3, 0.016)  # his hands, close, into the milky water, and rubbed
for k, d in enumerate([0, 0.7, 1.4, 2.0, 2.6]):  # each month written into the register; after two, softer
    pen(reg + 0.3 + d, 0.012 if k < 2 else 0.008, -0.2, 0.85)
pencil(W('clinics', 'fall', 'the level', -0.2), 0.012, 0.1, 1.0)  # the second clinic's level, dashed
plunge(W('clinics', 'showed', 'It started', 0.975), 0.016, px(1560))  # the doctor at the ward's door, washing on his way in
plunge(dip + 1.1, 0.024, 0.0)  # wordless: the hands in the basin again, and the water settling

# 2. Still amber: the present's chord, at the turn (above); binder 15 slid out and taken down, and its page; one cell amber; the issue
#    card pinned up, stamped closed with the old answer; the room with the leak, drop by drop, while the bucket's in the shot; the
#    staging code, the two wallets and the question between them, the two more buckets set down, Jun mopping; one low bell, left to
#    ring, as the leak never stops
take = G('monday', 'binder', 0.2)
slide(take - 0.4, 0.022, px(1420)); paper(take + 0.15, 0.016, 0.3, 0.3)
paper(W('monday', 'binder', 'the root', -0.5), 0.022, 0.0, 0.5)
tap(W('monday', 'amber', 'one cell'), 0.012, 0.1)
board = W('monday', 'issue', 'The first', -0.5)
pin(board + 0.25, 0.028, 0.0); rubber(W('monday', 'issue', 'cleaned', -0.15) + 0.12, 0.036, 0.05)
room, stg = G('monday', 'jun', -0.5), G('monday', 'jun', 1.2)
drips('monday', rel('monday', room), rel('monday', stg) + 0.25, lambda i, t: 1.0)
for w in [W('monday', 'jun', 'trimmed', -0.1), W('monday', 'jun', 'lower case', -0.2)]:
    tap(w, 0.012, 0.0)
wal = G('monday', 'wallet', -0.4)
knock(wal + 0.3, 0.018, -0.3, 300); knock(wal + 0.55, 0.018, 0.3, 300); tap(W('monday', 'wallet', 'two wallets'), 0.012, 0.0)
wide, fin2, mail = G('monday', 'others', -0.4), W('monday', 'others', 'every system'), W('monday', 'others', 'cleans', -0.4)
tin(fin2 + 0.25, 0.02, px(862)); tin(mail + 0.25, 0.018, px(318))
b_on = lambda i, t: [1.0, fin_(S0('monday') + t, fin2, 0.5), fin_(S0('monday') + t, mail, 0.5)][i]
mop = G('monday', 'mop', -0.4)
drips('monday', rel('monday', wide), rel('monday', mop) + 0.25, b_on, {0: (0, None), 1: (2, 2), 2: (2, 2)})
drips('monday', rel('monday', mop) + 0.25, ST['monday']['dur'] + 0.25, lambda i, t: 1.0)
strokes('monday', mop, E('monday'))
bell(45, W('monday', 'mop', 'stops', 0.45), BL * 1.05, 0.15, 'D', damp=7.5)  # the leak never stops: a low A, left to ring

# 3. Follow it back: the room still dripping; the lineage lit, card by card; Tom's plate; the phone's keys, and the suggestion picked;
#    the learners as saved; the bucket again, where it shows (the D), and the phone, where it starts (the G under it, and the D)
drips('back', 0, rel('back', G('back', 'path', -0.5)) + 0.25, lambda i, t: 1.0, {0: (0, None)})
wallet_, staging_ = W('back', 'path', 'wallet'), W('back', 'path', 'staging')
for k, w in enumerate([wallet_, (wallet_ + staging_) / 2, staging_, W('back', 'path', 'short-course'), W('back', 'path', 'sign-up')]):
    tap(w - 0.05, 0.012, 0.5 - 0.25 * k)
knock(G('back', 'box', -0.3) + 0.06, 0.018, px(1690), 260)
ph, cap, sug = W('back', 'box', 'phones', -0.4), W('back', 'box', 'capital'), W('back', 'space', 'picking')
for w in [ph + 0.9, cap + 0.45, cap + 0.85, sug + 0.35]:
    tap(w + 0.02, 0.013, 0.1)
tap(W('back', 'third', 'one email'), 0.012, 0.0)
bk, here = G('back', 'starts', -0.4), W('back', 'starts', 'starts here')
drips('back', rel('back', bk), rel('back', W('back', 'starts', 'but it', -0.2)) + 0.25, lambda i, t: 1.0)
strokes('back', bk, W('back', 'starts', 'but it', -0.2), 2)
shows(W('back', 'starts', 'shows', -0.05), pan=0.2)
starts(here - 0.05, pan=-0.3)

# 4. Fixed where it's typed: a chord for "this time"; the gold issue pinned, and a pencil for each of its lines; the box's setting
#    clicked; the keys, the suggestion, and the button; another learner's long press and paste; the old emails corrected, and the
#    clean-up taken out of staging. Then, wordless, the clamps go on, one at each joint, the last drops fall, and the fix's phrase
#    plays, in D: A, F sharp, E, D
chords([(G('entry', 'time', -0.9), G('entry', 'time', 2.6), [55, 59, 62, 67])], 'D', GL * 0.9)
pin(S0('entry') + 0.55, 0.028, 0.0)
for w in ['an owner', 'a cause', 'a date', 'a check']:
    pencil(W('entry', 'time', w, -0.1), 0.01, 0.0, 0.5)
tap(W('entry', 'email', 'an email box'), 0.016, 0.2)
eph, stop = W('entry', 'email', 'so phones', -0.4), W('entry', 'email', 'stop')
for w in [eph + 0.8, stop + 0.5, stop + 0.88, G('entry', 'trims', -0.3), W('entry', 'trims', 'saved', 0.3)]:
    tap(w + 0.02, 0.013, 0.1)
gr = G('entry', 'work', -0.4)
tap(gr + 0.7, 0.012, 0.1); tap(gr + 1.5, 0.013, 0.1)
fixw = W('entry', 'before', 'corrects')
for k in range(3):
    tap(fixw + 0.6 * k + 0.3, 0.011, 0.0)
paper(W('entry', 'before', 'can go'), 0.016, 0.1, 0.8)
eroom = G('entry', 'breath', -0.6)
for k, i in enumerate((0, 1, 2)):
    clamp_(eroom + 0.62 + 0.07 * k, 0.026, px(JOINTS[i]))
drips('entry', rel('entry', eroom), ST['entry']['dur'] + 0.25, lambda i, t: 1.0 - fin_(S0('entry') + t, eroom + 0.5, 0.7), {0: (1, None), 1: (1, None), 2: (1, None)}, 0.009)
phrase([69, 66, 64, 62], eroom + 1.45, k='D', last=3.2)

# 5. Should never fail: the sensor's tag, and the dashed line to who it tells; the cell turning green, on the glass's rising fifth; the
#    gold card stamped closed because the test passes
knock(max(W('never', 'stays', 'a test', -0.1), S0('never') + 2.4) + 0.06, 0.016, 0.0, 300)
owner = W('never', 'fails', 'its owner')
air(owner - 0.3, 0.8, 0.012, 0.4); knock(owner + 0.36, 0.016, 0.6, 300)
fifth(62, W('never', 'green', 'turns green', -0.05))
rubber(W('never', 'green', 'right where') + 0.12, 0.042, 0.25)

# 6. What no rule names: a dim chord for the night; the badges arriving, one by one, then softer; the tests' ticks; the wallet; the
#    morning, and monitoring's four panels; one low bell for one in two, left to ring, with no pulse; the alert flying to its owner
arr = G('unknown', 'night', 1.2)
chords([(G('unknown', 'night', -1.1), G('unknown', 'night', 1.9), [59, 62, 66])], 'D', GL * 0.8)
for k in range(8):
    tap(arr + 0.5 * k + 0.05, 0.012 if k < 3 else 0.007, px(500) + 0.04 * k)
for w in [W('unknown', 'pass', 'passes', -0.1), W('unknown', 'pass', 'a number', -0.1)]:
    tap(w + 0.1, 0.012, px(1050))
knock(G('unknown', 'wallet', -0.3) + 0.2, 0.016, px(1050), 300)
for w in ['when it arrives', 'how many rows', 'how many empty', 'spread']:
    knock(W('unknown', 'shape', w, -0.1) + 0.06, 0.014, px(1050), 320)
bell(47, W('unknown', 'usual', 'one in two', -0.05), BL * 1.05, 0.2, 'D', damp=6.5)  # one in two: a low B
knock(W('unknown', 'tells', 'the owner') + 0.05, 0.014, px(1200), 300)
air(W('unknown', 'tells', 'names', -0.2), 0.8, 0.016, 0.5)
knock(W('unknown', 'tells', 'the learning', -0.3) + 0.35, 0.016, 0.1, 280)

# 7. A surprise becomes a rule: the three microcredentials set back to five, and the badges sent again; the rule's lines typed, and
#    its owner; then three cards pinned, each on a bell, rising (prevent, test, watch), and the card that moves from watch to test,
#    on the glass's rising fifth: a surprise confirmed becomes a test
for k in range(3):
    tap(W('rule', 'cause', 'fixes', 0.35 * k + 0.2), 0.012, -0.2 + 0.2 * k)
send = W('rule', 'cause', 'sends')
tap(send, 0.016, 0.4); air(send + 0.25, 1.0, 0.014, 0.5)
mc = W('rule', 'rule', 'a microcredential')
for k in range(4):
    tap(mc - 0.2 + 0.35 * k + 0.1, 0.011, 0.0)
knock(W('rule', 'rule', 'with an owner') + 0.05, 0.016, 0.5, 300)
for k, (w, m) in enumerate([('Prevent', 62), ('Test what', 66), ('Watch', 69)]):
    t = W('rule', 'three', w, -0.1) + 0.25
    pin(t, 0.024, px([520, 960, 1400][k])); bell(m, t, BL * 0.85, px([520, 960, 1400][k]) * 0.6, 'D', damp=3.2)
conf = W('rule', 'every', 'confirm')
paper(conf - 0.1, 0.014, 0.2, 1.2)
fifth(62, conf - 0.15, 2.4)

# 8. Nobody to blame: the speech bubble; Vienna again, on the glass in E minor, the doctors at the basin and the red, rubbed hands;
#    the register; his paper set down, then his book; the open letters flying; the basin alone, on the glass's rising fifth, G to D:
#    washing became the rule; today's phone, the evidence, the sensor; and, wordless, binder 15's line marked green, on the fix's
#    phrase, then the mark under the end card, the glass holding G
knock(W('blame', 'blamed', 'help', -0.1) + 0.06, 0.018, 0.1, 280)
vi = G('blame', 'vienna', -0.5)
chords([(vi - 0.2, vi + 3.4, [55, 59, 64])], 'G', GL * 0.9)
plunge(vi + 0.4, 0.012, px(640))
bhd = W('blame', 'vienna', 'But the', -0.3)
rub(bhd + 0.8, 1.2, 0.014)
paper(G('blame', 'proof', -0.4) + 0.05, 0.014, 0.0, 0.4)
pt = W('blame', 'proof', 'He waited', -0.3)
paper(pt + 0.45, 0.02, -0.2, 0.35); book(W('blame', 'proof', 'publish') + 0.3, 0.03, 0.25)
for k in range(3):
    flutter(W('blame', 'letters', 'angry', -0.2 + 0.3 * k), 0.016, -0.2 - 0.15 * k, 0.8)
fifth(55, G('blame', 'after', -0.2), 2.4, k='G')  # the basin alone, the water still
hi, end = G('blame', 'breath', 0.5), G('blame', 'breath', 2.9)
marker(hi, 0.016, -0.1, 1.4); pencil(G('blame', 'breath', 2.0), 0.012, 0.3, 1.2)
phrase([69, 66, 64, 62], hi + 0.1, k='D', last=TOT - (hi + 0.1 + 3 * 0.55))  # its D held to the end, under the mark
chords([(end + 0.6, TOT, [55, 59])], 'G', GL * 0.85)
mark(end + 0.65)
