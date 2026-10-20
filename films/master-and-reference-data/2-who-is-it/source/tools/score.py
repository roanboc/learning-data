# Who is it?: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette is new for this film (PLAYBOOK.md: vary the sound itself, film to film), and it starts where the film does, in a
# sixteenth-century village and its court: a consort of viols holds the chords under that story, the voices coming in one after another,
# each in its own place across the room and changing bow at its own time, the way a court hears witnesses, and it comes back only for
# the last line and the end card; in between, the harp spreads each chapter's chord as it starts, and lets it die away; a lute is the
# village of Artigat, and its tune comes back when the man who came back is taken in; a harp is the roles, each on the note it has had
# since film 1 (the student D, the applicant E, the researcher G, the tutor A, the alumna the D above), so a record's role is heard as it
# arrives or is linked; a dulcian, the bassoon's ancestor, is the person: whenever someone stands in white paper as one person, it plays
# the D and the A above it, the notes film 1's cello gave her, and the two patients called Jo Lee get a short note each, a semitone
# apart, heard together only while they're merged by mistake; and the clarinet carries the series' mark, one note, its octave, its fifth
# and the note again (1-8-5-1), this time on A. The film starts in A minor, in Artigat in 1548, and ends in A major. A needle moving
# across a score is heard on the harp, a note for each step it passes, rising or falling with it. The effects are the paper's and the
# people's: a pencil or a quill, a card, a sheet, a few muffled keys, a stamp, footsteps on the road and on the court's stone, a wooden
# leg and its crutch, a seal pressed for each decision Mei writes down, the balance's creak, the lock.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops, and nothing is held under the explaining. The author found the consort, held under every chapter of the first cut,
#    tense under the explanations (20 October 2026), so after the opening story the music comes now and then: a chapter's chord on the
#    harp as it starts, a role's or the person's notes, the needle's steps, the village's tune as a real Martin might walk in.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#  - No pulse: the first cut's, under linking the two Aishas, went with the held chords. The picture, a cross and the balance carry it.
# And everything stays low and soft: knocks, paper, muffled keys, a pencil, low notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan
def cam(t, keys, d=1.6):
    """where the camera is at t, as src/scenes.js's m2_focus() moves it between its keys [time, x, y, zoom]: (x, zoom)"""
    x, z = keys[0][1], keys[0][3]
    for k in keys[1:]:
        u = 0.5 - 0.5 * np.cos(np.pi * min(1.0, max(0.0, (t - k[0]) / d)))
        if u <= 0:
            break
        x, z = x + (k[1] - x) * u, z + (k[3] - z) * u
    z = max(1.0, z); return min(max(x, 960 / z), 1920 - 960 / z), z
def sx(t, x, keys):
    """where something at x in the place is across the frame at t, through the camera"""
    cx, z = cam(t, keys); return 960 + (x - cx) * z
def Pc(t, x, keys):
    return P(sx(t, x, keys))
ease = lambda u: 0.5 - 0.5 * np.cos(np.pi * min(1.0, max(0.0, u)))  # the film's easeCam()

# ---- the film's instruments, all kept low ----
# the music's levels: the bed sits about 21 dB under the voice, as in the series' other films, and the notes over it a little less
BED, NOTE = 1.8, 1.8
def viol(m, start, sec, g=0.012, pan=0.0, seed=0, att=0.7, rel=1.5):
    """a viol, bowed without vibrato as a consort plays it: a reedy, slightly nasal tone that speaks slowly, swells a little on each
    bow, and changes bow every few seconds with a dip and a breath of rosin; nothing above about 1.5 kHz"""
    if sec <= 0.2:
        return
    f = mf(m); x = tt(sec); n = len(x); r = np.random.default_rng(abs(seed))
    # the bow: strokes of 2.6 to 4.2 seconds, the first already under way, so no two voices change bow together
    amp = np.ones(n, np.float32); bow = np.zeros(n, np.float32); a = -r.uniform(0.3, 2.4)
    while a < sec:
        b = a + r.uniform(2.6, 4.2); i0, i1 = max(0, int(a * SR)), min(n, int(b * SR))
        if i1 > i0:
            u = (x[i0:i1] - a) / (b - a)
            amp[i0:i1] = (0.86 + 0.14 * np.sin(np.pi * u)) * (0.62 + 0.38 * np.clip((x[i0:i1] - a) / 0.14, 0, 1))
            if a > 0:
                k = min(n - i0, int(0.12 * SR)); bow[i0:i0 + k] += np.exp(-np.arange(k) / SR * 30).astype(np.float32)
        a = b
    # the pitch, never quite still: the bow's weight, not a vibrato
    dr = 1 + 0.0011 * np.sin(2 * np.pi * (0.17 + 0.05 * r.random()) * x + 6 * r.random()) + 0.0005 * np.sin(2 * np.pi * 0.53 * x + 6 * r.random())
    ph = 2 * np.pi * np.cumsum(f * dr) / SR
    s = np.zeros(n, np.float32)
    for k in range(1, 19):
        fk = f * k
        if fk > 2300:
            break
        s += (np.sin(k * ph + 0.7 * k) * (1 / k ** 1.12) * (1 + 0.9 * np.exp(-((fk - 860) / 380) ** 2))).astype(np.float32)
    lo, hi = min(f * 2.0, 1100), min(f * 7.0, 2000)
    ros = filt(noise(sec), 'band', (lo, max(hi, lo * 1.5))) * (0.035 + 0.22 * bow)
    e = (np.sin(np.pi / 2 * np.clip(x / att, 0, 1)) ** 2 * np.clip((sec - x) / rel, 0, 1) ** 1.3).astype(np.float32)
    put(norm(filt(((s / 3.2 + ros) * amp * e).astype(np.float32), 'low', 1500)), start, g * BED, pan)
VPAN = [0.0, -0.42, 0.42, -0.72, 0.72, -0.18]
def consort(ch, start, sec, g=0.012):
    """a held chord on a consort of viols: the lowest first, the others coming in one after another, each in its own place"""
    for k, m in enumerate(ch):
        d = 0.34 * k
        viol(m, start + d, sec - d, g * (1.12 if k == 0 else 0.9), VPAN[k % len(VPAN)], seed=int(start * 100) * 7 + k)
def bed(keys, end, g=0.012):
    """the chapter's chords, each from its moment (a little early, so it has come in by then) until a little after the next one starts"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        consort(ch, t0 - 0.9, t1 - t0 + 2.4, g)
def turn(ch, s, g=0.012, pan=0.0):
    """a chapter's chord, spread up on the harp as its first picture comes in, and left to die away: after the opening story, the music
    comes now and then instead of being held under the voice"""
    for k, m in enumerate(ch[:5]):
        harp_(m, s + 0.13 * k, g * (1.1 if k == 0 else 0.85), pan - 0.3 + 0.15 * k, 3.4)
def harp_(m, start, g=0.03, pan=0.0, sec=2.8):
    """the harp, plucked and kept low: a role"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) * (1 / k ** 1.7) * np.exp(-x * (0.8 + 0.5 * k * k)) for k in range(1, 9))
    s = s * np.minimum(1, x / 0.003) + 0.03 * filt(noise(sec), 'band', (f * 2, min(f * 6, 2000))) * np.exp(-x * 60)
    put(norm(filt(s.astype(np.float32), 'low', 1800)), start, g * NOTE, pan)
ROLE = {'student': 50, 'applicant': 52, 'researcher': 55, 'tutor': 57, 'alumna': 62}  # each role's note, the same since film 1
def role(r, s, g=0.03, pan=0.0):
    harp_(ROLE[r], s, g, pan)
def lute_(m, start, g=0.03, pan=0.0, sec=1.9):
    """a lute: two strings to a course, a little apart in tune, plucked near the bridge's end of the string, and soon quiet"""
    f = mf(m); x = tt(sec); s = np.zeros_like(x)
    for det in (0.9991, 1.0009):
        s += sum(np.sin(2 * np.pi * f * det * k * x + 0.2 * k) * abs(np.sin(np.pi * k * 0.18)) / k ** 1.05 * np.exp(-x * (1.7 + 0.9 * k)) for k in range(1, 12))
    s = s * np.minimum(1, x / 0.002) + 0.04 * filt(noise(sec), 'band', (f * 3, 2200)) * np.exp(-x * 90)
    put(norm(filt(s.astype(np.float32), 'low', 2000)), start, g * NOTE, pan)
def village(s, g=0.032, pan=-0.25, notes=None):
    """Artigat's tune, on the lute: A minor spread upwards, then E, D, C, B, and home on A"""
    for dt, m, gg in notes or [(0, 45, 0.9), (0.17, 52, 0.75), (0.34, 57, 0.75), (0.51, 60, 0.7), (1.05, 64, 0.9), (1.6, 62, 0.8),
                               (2.0, 60, 0.8), (2.36, 59, 0.8), (2.8, 57, 0.95), (2.8, 52, 0.55), (2.83, 45, 0.7)]:
        lute_(m, s + dt, g * gg, pan)
def dulcian(m, start, sec, g=0.03, pan=0.0):
    """a dulcian, the bassoon's ancestor, played softly: a warm double reed, gently tongued, a slow vibrato that comes in late"""
    f = mf(m); x = tt(sec); vib = 1 + 0.003 * np.sin(2 * np.pi * 4.8 * x) * np.clip((x - 0.5) / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR; s = np.zeros_like(x)
    for k in range(1, 17):
        fk = f * k
        if fk > 2200:
            break
        s += np.sin(k * ph + 0.5 * k) * (1 / k) * (0.3 + np.exp(-((fk - 480) / 220) ** 2) + 0.5 * np.exp(-((fk - 1150) / 300) ** 2))
    br = filt(noise(sec), 'band', (300, 1500)) * 0.03 * np.exp(-x * 3)
    put(norm(filt(((s + br) * env(sec, 0.12, min(0.9, sec * 0.4))).astype(np.float32), 'low', 1800)), start, g * NOTE, pan)
def person(s, g=0.03, pan=0.0):
    """the person: the D, and the A above it, on the dulcian, the same two notes wherever someone stands in white paper as one person"""
    dulcian(50, s, 3.0, g, pan); dulcian(57, s + 0.55, 2.4, g * 0.55, pan + 0.15)
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet: odd harmonics, a breath as it speaks, a slow vibrato that comes in late (the series' mark is always on it)"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.0 * x) * np.clip((x - 0.35) / 0.5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def mark(start, root=57, g=0.05):
    """the series' mark, 1-8-5-1, on the clarinet, over the harp's root"""
    for i, iv in enumerate([0, 12, 7, 0]):
        clarinet(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    harp_(root - 12, start, g * 0.7); harp_(root - 12, start + 1.26, g * 0.55)
GAUGE = {'G': [43, 45, 47, 50, 52, 55, 57, 59, 62, 64, 67], 'Em': [40, 43, 45, 47, 50, 52, 55, 57, 59, 62, 64]}
def needle(t0, dur, score, scale, g=0.02, pan=0.0):
    """a needle moving across a score out of 100, from t0 for dur seconds, as score(u) says (u, 0 to 1, eased as the picture eases
    it): a harp note for each step of the scale it passes, rising or falling with it"""
    n = len(scale) - 1; idx = lambda v: int(round(v / 100 * n)); cur = idx(score(0))
    for u in np.linspace(0, 1, 600):
        j = idx(score(ease(u)))
        while j != cur:
            cur += 1 if j > cur else -1; harp_(scale[cur], t0 + u * dur, g, pan, 2.2)
score100 = lambda w: 100 / (1 + 2 ** -(w - 5.69))  # the film's m2_score(): a pair's weight as a score out of 100

# ---- the effects: the paper's, the people's ----
def quill(s, sec=0.6, g=0.016, pan=0.0):
    """a quill or a pencil writing: a soft scratch that flutters with the strokes"""
    x = tt(sec); fl = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 7.5 * x + 3 * np.sin(2 * np.pi * 1.3 * x)))
    X(filt(noise(sec), 'band', (700, 2200)) * fl * np.sin(np.pi * x / sec) ** 0.6, s, g, pan)
def tally(s, sec, g=0.012, pan=0.0):
    """tally marks, one after another, in a court clerk's quill: quick strokes, a little apart"""
    x = tt(sec); fl = np.abs(np.sin(2 * np.pi * 11 * x + 2 * np.sin(2 * np.pi * 0.9 * x))) ** 2
    X(filt(noise(sec), 'band', (650, 2000)) * fl * np.clip(x / 0.15, 0, 1) * np.clip((sec - x) / 0.2, 0, 1), s, g, pan)
def tick_(s, g=0.016, pan=0.0):
    """a pencil tick: two short strokes"""
    quill(s, 0.1, g, pan); quill(s + 0.09, 0.16, g * 0.8, pan)
def cross(s, g=0.016, pan=0.0):
    """a pencil cross: two strokes, one after the other"""
    quill(s, 0.14, g, pan); quill(s + 0.2, 0.14, g, pan)
def ring(s, sec=0.7, g=0.015, pan=0.0):
    """a pencil drawn round something: a scratch that swells once round and lifts"""
    x = tt(sec); X(filt(noise(sec), 'band', (600, 2000)) * np.sin(np.pi * x / sec) * (0.7 + 0.3 * np.sin(2 * np.pi * x / sec * 2)), s, g, pan)
def paper(s, g=0.03, pan=0.0, sec=0.45):
    """paper, softly: a card or a sheet picked up or set down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def brush(s, g=0.016, pan=0.0, sec=0.6):
    """a wet brush across the paper: a low, soft swish"""
    x = tt(sec); X(filt(noise(sec), 'band', (180, 1100)) * np.sin(np.pi * x / sec) ** 2 * (1 + 0.3 * np.sin(2 * np.pi * 3 * x)), s, g, pan)
def knock(s, g=0.022, pan=0.0, f=240):
    """a soft wooden knock: a card or a tag set down"""
    s_knock(s, g, pan, f)
def tap(s, g=0.014, pan=0.0):
    """a muffled key"""
    s_tap(s, g, pan)
def typing(s, sec, g=0.012, pan=0.0, n=6):
    """a few muffled keys, a little uneven, while something is typed in"""
    r = np.random.default_rng(abs(int(s * 1000)))
    for k in range(n):
        s_tap(s + (k + 0.3 * (r.random() - 0.5)) * sec / n, g * (0.75 + 0.25 * r.random()), pan)
def air(s, sec=0.7, g=0.02, pan=0.0):
    """a breath of air: a line drawn, a card sliding in"""
    s_air(s, sec, g, pan, 160, 1000)
def slide(s, sec, p0, p1, g=0.016):
    """a card slid along the paper, from one place to another: a soft hiss that travels with it"""
    x = tt(sec); nz = filt(noise(sec), 'band', (200, 1300)) * np.sin(np.pi * x / sec) ** 1.5; m = 8; L = len(x) // m
    for i in range(m):
        a, b = max(0, i * L - L // 2), min(len(x), (i + 1) * L + L // 2)
        w = np.hanning(b - a).astype(np.float32); X(nz[a:b] * w, s + a / SR, g, p0 + (p1 - p0) * (i + 0.5) / m)
def unlink(s, g=0.016, pan=0.0):
    """a link taken off: a breath of air that falls away"""
    s_air(s, 0.35, g, pan, 500, 1400); s_air(s + 0.18, 0.5, g * 0.8, pan, 150, 600)
def stamp(s, g=0.06, pan=0.0):
    """a stamp: a low thump and a knock, nothing bright"""
    x = tt(0.45); X(norm((np.sin(2 * np.pi * 70 * x) * np.exp(-x * 9) + 0.25 * filt(noise(0.45), 'low', 900) * np.exp(-x * 30)).astype(np.float32)), s, g, pan)
    s_knock(s + 0.01, g * 0.4, pan, 200)
def seal(s, g=0.05, pan=0.0):
    """a decision written down for good, like a seal pressed into wax: a low, soft thump, the wax giving, and a knock"""
    x = tt(0.4); th = np.sin(2 * np.pi * 62 * x) * np.exp(-x * 11)
    wx = filt(noise(0.4), 'band', (140, 800)) * np.exp(-x * 16) * np.minimum(1, x / 0.02)
    X(norm((th + 0.5 * wx).astype(np.float32)), s, g, pan); s_knock(s + 0.015, g * 0.35, pan, 190)
def step(s, g=0.02, pan=0.0, ground='earth'):
    """a footstep: a soft heel on the road's earth, with the toe's scuff after it, or on the court's stone; nothing above about 1.2 kHz"""
    sec = 0.16 if ground == 'earth' else 0.1; x = tt(sec); lo, hi, k, f0 = (90, 700, 32, 75) if ground == 'earth' else (140, 1100, 45, 95)
    X(norm((filt(noise(sec), 'band', (lo, hi)) * np.exp(-x * k) * np.minimum(1, x / 0.004) + 0.6 * np.sin(2 * np.pi * f0 * x) * np.exp(-x * 40)).astype(np.float32)), s, g, pan)
    if ground == 'earth':
        x2 = tt(0.09); X(filt(noise(0.09), 'band', (300, 1300)) * np.sin(np.pi * x2 / 0.09) ** 2, s + 0.07, g * 0.3, pan)
def peg(s, g=0.022, pan=0.0):
    """the real Martin's wooden leg on the court's stone, and his crutch landing with it: two hollow knocks"""
    s_knock(s, g, pan, 300); s_knock(s + 0.06, g * 0.6, pan, 420)
def walk(t0, x0, x1, v, hs, g, keys=None, ground='earth', wooden=False, big=None):
    """a walker's footsteps, as src/scenes.js walks them (m2_walkX, m2_stride, and m2_folk's twelve poses): from x0 towards x1 at v px a
    second from t0, a foot landing every half stride of 0.73 times hs, the near foot first, at a quarter stride (for the real Martin,
    the near leg is the wooden one); quieter as they near the frame's edge, and as big as they're drawn (big(x), 1 at full size)"""
    d, k = abs(x1 - x0), 0
    while True:
        dist = (0.25 + 0.5 * k) * 0.73 * hs
        if dist >= d:
            break
        t = t0 + dist / v; x = x0 + np.sign(x1 - x0) * dist; q = sx(t, x, keys) if keys else x
        a = min(1.0, max(0.0, (2000 - q) / 160), max(0.0, (q + 80) / 160)) * (big(x) if big else 1)
        if a > 0.01:
            (peg if wooden and k % 2 == 0 else (lambda s, g, p: step(s, g, p, ground)))(t, g * a, P(q))
        k += 1
def creak(s, sec=0.9, g=0.01, pan=0.0, f0=38, f1=70):
    """wood under a slow load, a bench as the judges lean, a balance tipping: a slow train of tiny catches, kept low"""
    x = tt(sec); r = np.random.default_rng(abs(int(s * 100))); ph = np.cumsum(f0 + (f1 - f0) * x / sec + 6 * np.sin(2 * np.pi * 1.7 * x)) / SR
    imp = (np.diff(np.floor(ph), prepend=0) > 0).astype(np.float32) * (0.5 + 0.5 * r.random(len(x))).astype(np.float32)
    X(norm(filt(imp, 'band', (420, 1200)) + 0.7 * filt(imp, 'band', (180, 420))) * np.sin(np.pi * x / sec) ** 1.5, s, g, pan)
def lock(s, g=0.03, pan=0.0):
    """a padlock closing: a low knock and the latch's soft click"""
    s_knock(s, g, pan, 170); x = tt(0.05); X(norm(filt(noise(0.05), 'band', (700, 1900)) * np.exp(-x * 120)), s + 0.06, g * 0.45, pan)
def swell(s, rise, fall, g=0.02, pan=0.0, lo=140, hi=900):
    """a wide, soft rush that rises and falls away: more lines than anyone could follow"""
    sec = rise + fall; x = tt(sec); e = np.where(x < rise, np.sin(np.pi / 2 * x / rise) ** 2, np.cos(np.pi / 2 * np.clip((x - rise) / fall, 0, 1)) ** 2)
    X(filt(noise(sec), 'band', (lo, hi)) * e.astype(np.float32), s, g, pan)

# chords (MIDI note numbers), low to high: kept between C2 and F#4, where viols sound
AM9 = [45, 52, 59, 60, 64]; FMAJ7 = [41, 48, 52, 57, 60]; C69 = [36, 43, 50, 52, 57]; G6SUS = [43, 50, 55, 57, 64]; DM9 = [38, 45, 53, 57, 64]
E7SUS4 = [40, 47, 52, 57, 62]; E7 = [40, 47, 50, 56, 62]; CMAJ9 = [36, 43, 52, 55, 59, 62]; AM7 = [45, 52, 55, 60, 64]; FMAJ9 = [41, 48, 52, 55, 57, 64]
G6 = [43, 50, 55, 59, 64]; CMAJ7 = [36, 43, 52, 55, 59]; BBMAJ9 = [46, 53, 57, 60, 62]; GM7 = [43, 50, 53, 58, 62]; C9SUS = [36, 43, 53, 58, 62]
DSUS2 = [38, 45, 50, 52, 57]; GMAJ9 = [43, 50, 54, 57, 59]; EM9 = [40, 47, 55, 59, 66]; GMAJ7 = [43, 50, 54, 59, 62]; BM7 = [47, 54, 57, 62, 66]
B7SUS4 = [47, 52, 54, 57, 64]; G9SUS = [43, 50, 53, 57, 60]; DM7 = [38, 45, 53, 57, 60]; DMAJ9 = [38, 45, 54, 57, 61, 64]
AMAJ9 = [45, 52, 56, 59, 61, 64]; A69 = [45, 52, 54, 59, 61]


# 1. Taken for one: A minor, and Artigat's tune on the lute. Martin's tag; his steps out of the village along the road; Bertrande's tag;
#    the steps of the man who comes back; what the village knew, ticked; the line from the village to him, and the tune again as
#    they take him in; his uncle's tag, and the question mark. The court: the record of the witnesses, three columns of tallies; the
#    name over him; the bench as the judges lean; a wooden leg and a crutch on the stone, the real Martin Guerre's tag, and the person's
#    two notes; the name struck through, and his own written in; the two lines from what the village knew; the series' mark on the title
J = 'guerre'; B = C(J, 'breath'); KV = [[0, 560, 720, 1.6], [W(J, 'left', 'left his', -0.4), 711, 620, 1.3], [C(J, 'court', -0.5), 600, 660, 1.42]]
tMar, tLeft, tWife, tBack, tKnew = W(J, 'left', 'Martin'), W(J, 'left', 'left his'), W(J, 'left', 'Bertrande'), C(J, 'back'), W(J, 'back', 'He knew')
tIn, tUnc, tCourt, tWit, tAgree = W(J, 'back', 'took him'), C(J, 'court'), W(J, 'court', 'In court'), W(J, 'court', 'a hundred'), W(J, 'court', "couldn't")
tLean, tMan, tReal, tTwo, tSo = W(J, 'leg', 'leaned'), W(J, 'leg', 'a man with'), W(J, 'leg', 'the real'), C(J, 'two'), W(J, 'two', 'so much')
KC = [[0, 960, 540, 1], [tMan - 0.3, 1140, 560, 1.1], [tTwo - 0.3, 960, 540, 1]]
bed([(S0(J), AM9), (tBack - 0.3, FMAJ7), (tIn - 0.3, C69), (tUnc - 0.3, G6SUS), (C(J, 'leg', -0.3), DM9), (tTwo - 0.3, E7SUS4), (tSo, E7), (B + 0.4, AM9)], E(J) + 1.0)
village(S0(J) + 0.3)
hAt = lambda x: (np.interp(x, [600, 800, 1040, 1300, 1560, 1820, 2080], [882, 886, 880, 870, 862, 856, 852]) + 18 - 600) / 300  # how big a walker on the road is drawn (m2_roadY, m2_hAt)
knock(tMar - 0.25, 0.022, Pc(tMar, 600, KV))
walk(tLeft - 0.25, 600, 1640, 175, 200, 0.02, KV, 'earth', big=hAt)
knock(tWife - 0.25, 0.02, Pc(tWife, 452, KV), 220)
walk(tBack + 0.25, 1580, 650, 175, 200, 0.02, KV, 'earth', big=hAt)
paper(tKnew - 0.3, 0.028, Pc(tKnew, 1120, KV))
for t0 in (W(J, 'back', 'the house'), W(J, 'back', 'the family'), W(J, 'back', 'their stories')):
    tick_(t0, 0.015, Pc(t0, 1326, KV))
air(tIn, 0.8, 0.018, Pc(tIn, 900, KV))
village(tIn + 0.35, 0.022, -0.1, [(0, 48, 0.8), (0.17, 55, 0.7), (0.34, 60, 0.7), (0.8, 64, 0.85), (1.3, 62, 0.75), (1.65, 60, 0.75), (1.98, 59, 0.75), (2.4, 57, 0.9), (2.42, 48, 0.6)])
knock(tUnc - 0.05, 0.02, Pc(tUnc, 230, KV), 200)
quill(tUnc + 0.4, 0.3, 0.016, Pc(tUnc, 330, KV))
paper(tWit - 0.3, 0.03, P(1550))
D = tAgree + 0.6 - tWit
for j, x in enumerate([1284, 1474, 1664]):
    a, b = tWit + D * j * 0.1 / 1.2, tWit + D * (1 + j * 0.1) / 1.2
    tally(a, b - a, 0.011, P(x))
knock(tCourt + 0.55, 0.02, P(400))
creak(tLean - 0.2, 1.0, 0.008, P(960)); creak(tMan + 0.6, 0.9, 0.006, P(960), 30, 52)
walk(tMan - 0.1, 2060, 1560, 200, 410, 0.024, KC, 'stone', wooden=True)
knock(tReal - 0.05, 0.022, Pc(tReal, 1560, KC))
person(tReal + 0.1, 0.026, Pc(tReal, 1560, KC))
quill(tTwo + 0.2, 0.45, 0.02, P(400)); quill(tTwo + 0.6, 0.9, 0.014, P(400))
paper(tSo - 0.3, 0.02, P(960), 0.6)
air(tSo, 0.7, 0.016, P(560)); air(tSo + 0.15, 0.7, 0.016, P(1360))
mark(B + 0.8)

# 2. Two words people confuse: C major. The two headings, a knock each; the master shelf, Linh in white paper and the person's notes, an
#    award, a supplier's crate, a meter, and their tags; the reference shelf, three short lists set down, the role types on their
#    roles' notes, and the standard's badge; the test sheet, its question typed in, the arrows and their tags; the faculties' card,
#    growing as it gets an owner and a history, slid over to the master side, and its badge
J = 'words'
tTwo, tM, tLinh, tR, tT = W(J, 'first', 'two words'), C(J, 'master'), W(J, 'master', 'Linh'), C(J, 'ref'), C(J, 'test')
tAsk, tThen, tPk, tRef, tList = W(J, 'test', 'is this'), W(J, 'test', "Then it's"), W(J, 'pick', 'pick a value'), W(J, 'pick', "it's reference"), W(J, 'line', 'a list')
tOwn, tLife, tBec = W(J, 'line', 'owners'), W(J, 'line', 'a life'), W(J, 'line', 'becomes')
turn(CMAJ9, S0(J) + 0.2)
knock(tTwo - 0.15, 0.018, P(520), 220); knock(tTwo + 0.35, 0.018, P(1400), 250)
knock(tM - 0.05, 0.02, P(460), 180)
person(tLinh - 0.1, 0.026, P(250))
for word, x, kind in [('an award', 440, 'paper'), ('a supplier', 630, 'crate'), ('a meter', 810, 'meter')]:
    t0 = W(J, 'master', word, -0.05)
    if kind == 'paper':
        paper(t0, 0.026, P(x))
    else:
        knock(t0, 0.024 if kind == 'crate' else 0.016, P(x), 150 if kind == 'crate' else 330)
for k, t0 in enumerate([C(J, 'many'), W(J, 'many', 'always'), W(J, 'many', 'matched')]):
    knock(t0 + 0.05, 0.014, P(240 + 230 * k), 230 + 20 * k)
knock(tR - 0.05, 0.02, P(1340), 180)
for word, x in [('countries', 1152), ('role types', 1404), ('statuses', 1656)]:
    paper(W(J, 'ref', word, -0.05), 0.024, P(x), 0.4)
for k, r in enumerate(['student', 'tutor', 'researcher']):
    role(r, W(J, 'ref', 'role types', 0.15 + 0.13 * k), 0.022, P(1404))
for k, word in enumerate(['Few rows', 'rarely', 'often']):
    knock(W(J, 'ref', word, 0.05), 0.014, P(1120 + 230 * k), 230 + 20 * k)
knock(W(J, 'ref', 'often', 0.35), 0.016, P(1100), 280)
paper(tT - 0.3, 0.03, P(960), 0.6)
typing(tAsk - 0.05, 0.9, 0.011, P(640), 7)
quill(tThen, 0.4, 0.014, P(1075)); knock(tThen + 0.25, 0.016, P(1278))
typing(tPk - 0.05, 0.9, 0.011, P(640), 7)
quill(tRef, 0.4, 0.014, P(1075)); knock(tRef + 0.25, 0.016, P(1302))
paper(tList - 0.2, 0.026, P(960))
paper(tOwn + 0.15, 0.014, P(960), 0.35); paper(tLife + 0.15, 0.014, P(960), 0.35)
slide(tBec - 0.1, 1.5, P(960), P(560), 0.012)
knock(tBec + 0.45, 0.018, P(700), 260)

# 3. A golden record: F major. The master record set down, and the person's notes, Linh in white paper on it; its badge; its ID
#    stamped on; its two tags; each best value typed in, and where it came from, on its role's note; her five records set down, each
#    linked on its role's note; the tag; the work email ringed, and the line to where it came from; the alumni office's link taken
#    off, and made again on the alumna's note
J = 'golden'
tB, tGold, tId, tBest, tLab, tLk, tKept = C(J, 'builds'), W(J, 'builds', 'golden'), C(J, 'id'), C(J, 'best'), W(J, 'best', 'labelled'), C(J, 'links'), W(J, 'links', 'each kept')
tVal, tLbl = W(J, 'undo', 'value by value'), W(J, 'undo', 'link by link')
turn(FMAJ9, S0(J) + 0.2)
paper(tB - 0.3, 0.034, P(960), 0.6)
person(tB - 0.1, 0.026, P(720))
knock(tGold + 0.1, 0.018, P(900), 260)
stamp(tId + 0.46, 0.06, P(1060))
knock(W(J, 'id', 'never changes', 0.05), 0.016, P(945)); knock(W(J, 'id', 'never reused', 0.05), 0.016, P(1188), 260)
for i in range(3):
    typing(tBest + 0.3 + i * 0.45, 0.45, 0.01, P(820), 3)
knock(tLab + 0.2, 0.014, P(1200), 280); role('student', tLab + 0.5, 0.024, P(1200)); role('tutor', tLab + 0.8, 0.024, P(1200))
for i, (k, x, r) in enumerate([('old', 280, 'student'), ('new', 280, 'student'), ('alumna', 280, 'alumna'), ('tutor', 1640, 'tutor'), ('researcher', 1640, 'researcher')]):
    t0 = tLk + 0.1 + i * 0.18
    paper(t0, 0.016, P(x), 0.35); role(r, t0 + 0.8, 0.02, P(x))
knock(tKept - 0.05, 0.016, P(280))
ring(tVal - 0.1, 0.7, 0.015, P(860)); air(tVal, 0.6, 0.016, P(1360))
unlink(tLbl, 0.016, P(400)); paper(tLbl + 0.05, 0.012, P(280), 0.5)
role('alumna', tLbl + 1.9, 0.022, P(400))

# 4. The duplicate check: D minor. Her old record and her new, on the student's note; the pencil line between them, stopped by a
#    cross; the paper's hush; the university's systems, a knock for each name and a patter of dots, its records; the check's tag; every
#    pair, a wide rush, and its two tags; the lines between records that share something, in pencil; the keys, a knock each; the queue
#    set down, its three rows, and their numbers ringed; Mei's name card
J = 'check'
tL, tNew, tR, tDup, tAcr, tBil = C(J, 'linh'), W(J, 'linh', 'a new student'), C(J, 'runs'), W(J, 'runs', 'a duplicate check'), W(J, 'runs', 'across'), C(J, 'billion')
tSh, tTh, tProp, tHere = C(J, 'share'), C(J, 'three'), W(J, 'three', 'proposes'), W(J, 'three', 'Here are')
kt = [W(J, 'share', 'an email'), W(J, 'share', 'a number'), W(J, 'share', 'a birth year')]
turn(DM9, S0(J) + 0.2)
paper(tL - 0.2, 0.026, P(400)); role('student', tL - 0.1, 0.026, P(400))
paper(tNew - 0.1, 0.026, P(1520)); role('student', tNew, 0.026, P(1520))
air(tNew + 0.4, 0.5, 0.012, P(1100)); cross(tNew + 1.0, 0.016, P(960))
air(tR - 0.4, 1.0, 0.012, 0.0)
SYS = [260, 610, 960, 1310, 1660]
for s, x in enumerate(SYS):
    knock(tAcr - 0.6 + s * 0.15, 0.014, P(x), 210 + 18 * s)
    for i in range(12):
        tap(tAcr - 0.5 + s * 0.15 + i * 0.03, 0.0045, P(x))
knock(tDup - 0.05, 0.018, P(960))
swell(tBil - 0.2, 1.0, 2.6, 0.016)
knock(W(J, 'billion', 'Fifty', -0.05), 0.016, P(700)); knock(W(J, 'billion', 'over a billion', -0.05), 0.016, P(1250), 200)
PAIRS = [((0, 3), (0, 9), 2), ((0, 9), (1, 5), 2), ((3, 2), (0, 3), 1), ((2, 7), (1, 5), 1), ((4, 4), (0, 6), 1), ((1, 1), (4, 8), 0), ((0, 11), (4, 10), 0), ((2, 2), (1, 9), 2), ((3, 8), (0, 1), 1), ((4, 1), (0, 4), 0)]
for i, (a, b, k) in enumerate(PAIRS):
    quill(kt[k] + 0.1 + (i % 3) * 0.12, 0.6, 0.008, P((SYS[a[0]] + SYS[b[0]]) / 2))
for i, x in enumerate([560, 900, 1340]):
    knock(kt[i] - 0.05, 0.016, P(x), 230 + 20 * i)
paper(tProp - 0.2, 0.032, P(960), 0.6)
for i in range(3):
    paper(tProp + 0.3 + i * 0.2, 0.012, P(960), 0.3)
    ring(tHere + 0.2 + i * 0.3, 0.3, 0.012, P(632))
knock(W(J, 'three', 'the steward', -0.15), 0.02, P(1650))

# 5. Back to study: G major. Her two student records set down; a tick for the same name, and the same birth date; the score rising to
#    93 on the harp, and the band it's in, ringed; the tag; her application, on the applicant's note, and "studied here" ringed; her
#    decision typed in; the gold link, and its decision sealed; the two cards slid into one, and the tag
J = 'first'; KF = [[0, 960, 540, 1], [C(J, 'pair', 0.3), 800, 450, 1.2], [C(J, 'score', -0.4), 1000, 520, 1.06], [C(J, 'before', -0.4), 960, 540, 1]]
tP, tS, t93, tLine, tBef, tLk, tOwn = C(J, 'pair'), C(J, 'score'), W(J, 'score', 'scores 93'), W(J, 'score', 'over the line'), C(J, 'before'), C(J, 'links'), W(J, 'merge', 'in its own')
turn(GMAJ9, S0(J) + 0.2)
paper(tP - 0.2, 0.026, Pc(tP, 400, KF)); paper(tP + 0.3, 0.026, Pc(tP + 0.3, 1120, KF))
for word in ('Same name', 'same birth'):
    t0 = W(J, 'pair', word); tick_(t0, 0.016, Pc(t0, 1354, KF))
needle(t93 - 0.7, 1.3, lambda u: 93 * u, GAUGE['G'], 0.018, Pc(t93, 800, KF))
ring(tLine, 0.7, 0.015, Pc(tLine, 1230, KF))
knock(W(J, 'term', 'checks', -0.15), 0.018, P(780))
paper(tBef - 0.1, 0.026, P(540)); role('applicant', tBef, 0.026, P(540))
ring(W(J, 'before', 'studied here'), 0.8, 0.015, P(560))
paper(tLk - 0.1, 0.026, P(1250)); typing(tLk + 0.05, 2.1, 0.01, P(1250), 11)
air(tLk + 0.3, 0.5, 0.014, P(760)); seal(tLk + 0.85, 0.05, P(760))
slide(tOwn - 0.4, 1.4, P(400), P(560), 0.012); knock(tOwn + 0.62, 0.016, P(810))

# 6. One digit apart: E minor. The sheet set down; the two records named, on the student's and the tutor's notes, and their values; each
#    row lit as it's weighed, a brush; what the matcher makes of it, in pencil; each weight moving the needle, heard on the harp; the
#    band it lands in, ringed; then the birth dates agreeing, the harp up to 93, and that band ringed
J = 'weights'
tSec, tNew, tHR, tAway, tT, tPer = C(J, 'second'), W(J, 'second', 'her new'), W(J, 'second', "HR's record"), W(J, 'weigh', 'takes it'), C(J, 'total'), W(J, 'total', 'so a person')
tAg, t93 = W(J, 'flip', 'agreed'), W(J, 'flip', '93')
rowT = [[W(J, 'names', 'Given name'), W(J, 'names', 'plus three')], [W(J, 'names', 'Family name'), W(J, 'names', 'plus two.')],
        [W(J, 'date', 'Birth date'), W(J, 'date', 'plus two point')], [W(J, 'date', 'Email'), W(J, 'date', 'minus')]]
turn(EM9, S0(J) + 0.2)
paper(tSec - 0.2, 0.034, P(960), 0.6)
role('student', tNew - 0.05, 0.024, P(520)); role('tutor', tHR - 0.05, 0.024, P(960))
for i in range(4):
    tap(tNew + 0.2 + i * 0.12, 0.011, P(520)); tap(tHR + 0.2 + i * 0.12, 0.011, P(960))
wsum = 0.0
for i, ((t0, t1), wt) in enumerate(zip(rowT, [3.2, 2.0, 2.4, -0.4])):
    brush(t0 - 0.25, 0.012, P(960), 0.5)
    quill(t0 + 0.3, 0.6, 0.012, P(1340))
    needle(t1 - 0.1, 0.7, (lambda w0, dw: lambda u: score100(w0 + dw * u))(wsum, wt), GAUGE['Em'], 0.018, P(960))
    wsum += wt
ring(tPer, 0.7, 0.015, P(1160))
brush(tAg - 0.3, 0.012, P(960), 0.5); paper(tAg - 0.1, 0.012, P(1000), 0.35); quill(tAg, 0.4, 0.01, P(1340))
needle(tAg + 0.2, t93 - tAg, lambda u: score100(wsum + 2.2 * u), GAUGE['Em'], 0.018, P(960))
ring(t93 + 0.1, 0.7, 0.015, P(1400))

# 7. It suggests, Mei decides: C major. The AI helper's note set down, its lines typed in
#    and the names shaded out; the note slid up out of the way, and the two tags; HR's card, on the tutor's note; her contract; the
#    typo ringed, and written; her decision typed in, and sealed; the two birth dates, on their systems' notes; the question mark;
#    the next film's tag
J = 'note'
tD, tHid, tSug, tMd, tAsk, tCon, tTy, tLk, tNx = (C(J, 'drafts'), W(J, 'drafts', 'names hidden'), W(J, 'asks', 'It suggests'), W(J, 'asks', 'Mei decides'),
                                                  W(J, 'asks', 'She asks'), W(J, 'asks', 'her contract'), W(J, 'asks', 'a typo'), C(J, 'links'), C(J, 'next'))
turn(CMAJ9, S0(J) + 0.2)
paper(tD - 0.1, 0.03, P(930), 0.5)
typing(W(J, 'drafts', 'drafts a note'), 0.9, 0.011, P(800), 7)
quill(tHid, 0.35, 0.01, P(760)); quill(tHid + 0.15, 0.3, 0.008, P(900))
typing(W(J, 'drafts', 'birth dates'), 1.0, 0.011, P(800), 7); typing(W(J, 'drafts', 'the HR email'), 1.1, 0.011, P(800), 8)
typing(tSug, 0.9, 0.011, P(800), 7); knock(tSug + 0.35, 0.016, P(930))
slide(tMd - 0.2, 1.2, P(930), P(930), 0.01); knock(tMd - 0.05, 0.018, P(1580), 260)
paper(tAsk - 0.1, 0.026, P(420)); role('tutor', tAsk, 0.024, P(420))
paper(tCon - 0.2, 0.03, P(910), 0.5)
ring(tTy, 0.6, 0.016, P(254)); quill(tTy + 0.4, 0.4, 0.016, P(420))
paper(tLk - 0.1, 0.026, P(890)); seal(tLk + 0.1, 0.05, P(700)); typing(tLk + 0.1, 1.9, 0.01, P(890), 10)
role('student', tNx + 0.1, 0.022, P(400)); role('tutor', tNx + 0.3, 0.022, P(400))
quill(tNx + 0.4, 0.3, 0.016, P(680))
knock(W(J, 'next', 'the next film', -0.05), 0.018, P(420))

# 8. Two Aishas: D minor. The learning platform's card; the student card, on the student's note; ticks for the same given name and number;
#    the family names, and a cross; the number ringed, "typed in by mistake" written; the score's tag; the dashed link; the result
#    slid across to the wrong student, and crossed; the balance, its creak as a false merge outweighs a missed match;
#    her decision typed in, and sealed; the lock; the tag
J = 'aisha'
tAcc, tKar, tRah, tMis = W(J, 'third', 'a learning'), W(J, 'third', "Aisha Karimi's"), W(J, 'rahman', "Aisha Rahman's"), W(J, 'rahman', 'typed in')
tLink, tSees, tTwo, tWo, tCost = W(J, 'results', 'Link them'), W(J, 'results', "sees the other's"), W(J, 'results', 'Two people'), C(J, 'worse'), W(J, 'worse', 'costs more')
tKeep, tBind = W(J, 'apart', 'keeps them'), W(J, 'apart', 'binds')
turn(DM9, S0(J) + 0.2)
paper(tAcc - 0.2, 0.026, P(420))
paper(tKar - 0.2, 0.026, P(1500)); role('student', tKar - 0.1, 0.024, P(1500))
tick_(tKar + 0.4, 0.015, P(960)); tick_(tKar + 0.7, 0.015, P(960))
tap(tRah, 0.012, P(420)); tap(tRah + 0.3, 0.012, P(1500)); cross(tRah + 0.6, 0.016, P(960))
ring(tMis, 0.6, 0.016, P(440)); quill(tMis - 0.1, 0.9, 0.012, P(400))
knock(G(J, 'third') + _DUR[J + '/third'] - 0.35, 0.018, P(960))
air(tLink, 0.6, 0.016, P(960))
paper(tLink + 0.4, 0.02, P(1500), 0.4); slide(tSees - 0.3, 1.2, P(1500), P(420), 0.014); cross(tTwo, 0.018, P(660))
creak(tCost, 1.0, 0.012, P(960), 34, 60); knock(tCost + 0.95, 0.014, P(800), 180)
paper(tKeep - 0.2, 0.026, P(960)); seal(tKeep, 0.05, P(780)); typing(tKeep + 0.05, 2.1, 0.01, P(960), 11)
lock(tBind - 0.05, 0.03, P(1220))
knock(tBind + 0.35, 0.016, P(960))

# 9. Link, don't destroy: F major. Her five records set down; Linh in white paper, and the person's notes; the two decisions' gold links,
#    each sealed; each record linked to her, on its role's note; "holds", in pencil; her ID's tag; the tag; a real Martin, as he might
#    walk in, faint, and a breath of the village's tune; HR's and the research office's links taken off, "undone", and made again on
#    their notes; the rule's card, crossed; the tag; the two student numbers ringed; then, wordless, her roles' notes and the person's D
J = 'link'; B = C(J, 'breath')
tF, tDec, tPt, tMar, tAny, tR, tCome = C(J, 'five'), W(J, 'five', 'Two decisions'), W(J, 'five', 'point to'), W(J, 'kept', 'a real Martin'), W(J, 'kept', 'any link'), C(J, 'rule'), W(J, 'rule', 'A student who')
turn(FMAJ9, S0(J) + 0.2)
LC = [('old', 340, 'student'), ('new', 960, 'student'), ('tutor', 1580, 'tutor'), ('alumna', 340, 'alumna'), ('researcher', 1580, 'researcher')]
for i, (k, x, r) in enumerate(LC):
    paper(tF + 0.1 + i * 0.15, 0.014, P(x), 0.35)
    role(r, tPt + 0.7 + i * 0.1, 0.02, P(x))
person(tF + 0.25, 0.024, 0.0)
for j, x in enumerate([650, 1270]):
    air(tDec + 0.1 + j * 0.4, 0.5, 0.012, P(x)); seal(tDec + 0.45 + j * 0.4, 0.04, P(x))
quill(tPt - 0.6, 0.45, 0.009, P(340)); quill(tPt - 0.4, 0.45, 0.009, P(1580))
knock(tPt + 0.25, 0.016, 0.0, 260)
knock(W(J, 'kept', 'each record', -0.05), 0.016, 0.0)
walk(tMar - 0.2, 2060, 1700, 190, 250, 0.01, None, 'stone', wooden=True)
village(tMar - 0.1, 0.012, 0.6, [(0, 64, 0.9), (0.55, 62, 0.8), (0.95, 60, 0.8), (1.3, 59, 0.8), (1.75, 57, 0.9)])
unlink(tAny, 0.016, P(1270)); slide(tAny, 0.7, P(1580), P(1640), 0.01); quill(tAny + 0.3, 0.5, 0.014, P(1250))
slide(tR - 0.1, 0.8, P(1640), P(1580), 0.01); role('tutor', tR + 0.5, 0.02, P(1580)); role('researcher', tR + 0.65, 0.02, P(1580))
paper(tR - 0.1, 0.022, P(470)); cross(W(J, 'rule', 'never one'), 0.016, P(770))
knock(tCome - 0.05, 0.016, P(380))
ring(tCome + 0.2, 0.6, 0.014, P(476)); ring(tCome + 0.45, 0.6, 0.014, P(1096))
for i, m in enumerate([50, 55, 57, 62]):
    harp_(m, B + 0.15 + i * 0.16, 0.018, -0.3 + 0.2 * i)
dulcian(50, B + 0.9, 2.6, 0.02, 0.0)

# 10. Elsewhere: D minor. The hospital's card; two patients in white paper, each on a note of their own, a semitone apart;
#     their wristbands; the bands slid together by mistake, and the two notes heard together; the test result slid to the wrong one,
#     and crossed; each number's issuer, a knock each; the bands slid apart, and the two notes heard one after the other; the result
#     slid back, and ticked; the tag
J = 'elsewhere'
tH, tToo, tMg, tRes, tWr, tI, tKeep, tUn = (C(J, 'hospital'), W(J, 'hospital', 'match people'), W(J, 'hospital', 'Merge two'), W(J, 'hospital', 'a test result'),
                                           W(J, 'hospital', 'the wrong one'), C(J, 'issuer'), W(J, 'issuer', 'keep each'), W(J, 'issuer', 'undoing'))
turn(DM9, S0(J) + 0.2)
paper(tH - 0.2, 0.032, P(960), 0.6)
dulcian(52, tToo - 0.2, 0.9, 0.02, P(640)); dulcian(53, tToo + 0.1, 0.9, 0.02, P(1280))
paper(tToo - 0.1, 0.016, P(640), 0.35); paper(tToo + 0.2, 0.016, P(1280), 0.35)
slide(tMg, 1.0, P(640), P(900), 0.01); slide(tMg, 1.0, P(1280), P(960), 0.01)
dulcian(52, tMg + 0.75, 1.1, 0.014, -0.1); dulcian(53, tMg + 0.75, 1.1, 0.014, 0.1)
paper(tToo + 0.6, 0.016, P(1560), 0.35); slide(tRes, 1.2, P(1560), P(360), 0.012); cross(tWr, 0.016, P(500))
knock(tKeep - 0.05, 0.014, P(700), 230); knock(tKeep + 0.1, 0.014, P(1260), 250)
slide(tUn, 1.0, P(900), P(640), 0.01); slide(tUn, 1.0, P(960), P(1280), 0.01)
dulcian(52, tUn + 0.7, 0.9, 0.016, P(640)); dulcian(53, tUn + 1.05, 0.9, 0.016, P(1280))
slide(tUn + 0.4, 1.2, P(360), P(1560), 0.012); tick_(tUn + 1.6, 0.015, P(1700))
knock(tUn + 0.65, 0.016, P(960))

# 11. Decided once: A major at the end. The pairs' card set down, its lines, a key each; its tag laid on; the comment underlined; the
#     queue's card and its rows; the test's card, its failing row a low knock, its owner; the links' card and its rows; the line, with
#     the consort back; the line carried down onto the end card, and the series' mark
J = 'once'; B = C(J, 'breath')
tQ, tWo, tDec, tQu, tFa, tWk, tOw, tMr, tLk, tWho, tK = (W(J, 'pairs', 'a query'), W(J, 'pairs', 'without comparing'), W(J, 'pairs', 'the decisions table'), W(J, 'pairs', "the person's queue"),
                                                         W(J, 'test', 'fails'), W(J, 'test', 'more than a week'), W(J, 'test', 'an owner'), W(J, 'links', 'the master records'),
                                                         W(J, 'links', 'their links'), W(J, 'links', 'who decided'), C(J, 'decide'))
turn(DMAJ9, S0(J) + 0.2)
# the last line and the end card: the consort comes back, as in Artigat, and holds A major, open and plain, to the end
consort([45, 52, 57, 61, 64], tK - 0.6, TOT + 1.0 - (tK - 0.6), 0.011)
paper(tQ - 0.3, 0.03, P(510), 0.5)
for i in range(5):
    tap(tQ + 0.3 + i * 0.18, 0.011, P(510))
paper(tQ + 1.1, 0.014, P(700), 0.3)
quill(tWo, 0.55, 0.012, P(400))
paper(tDec - 0.3, 0.03, P(1410), 0.5)
for i in range(4):
    tap(tDec + 0.2 + i * 0.15, 0.011, P(1410))
tap(tQu + 0.6, 0.011, P(1410))
paper(tFa - 0.4, 0.03, P(510), 0.5); tap(tFa, 0.011, P(510)); knock(tWk, 0.02, P(510), 120); tap(tOw - 0.1, 0.011, P(510))
paper(tMr - 0.4, 0.03, P(1410), 0.5)
for t0 in (tMr, tLk, tLk + 0.2, tLk + 0.4, tWho):
    tap(t0, 0.011, P(1410))
air(B + 0.3, 1.1, 0.014, 0.0)
mark(B + 1.0)
