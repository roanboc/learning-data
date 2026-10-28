# Change without surprises: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (PLAYBOOK.md: vary the sound itself, film to film; the series' brass band, music box, clarinets, double
# reeds, harp, guitar, pianos, flutes, celesta, glockenspiel, vibraphone, glass harmonica and handbells are left to the films that have them):
#  - Violas hold the chords, bowed close and soft, each note on one player's string, without vibrato. Under the opening story, in Sweden
#    in 1967, one chord in C holds while the cars stop and wait at ten to five; at five it moves to G through E minor, a chord the two
#    keys share, so the ear hears the change coming. Under the years before, the crash and the fear, the violas rest; on "Everyone had to
#    know" they come back in C, and the new key, G, returns on "surprised no one". After that the violas play only now and then (the
#    series' sound, 20 October 2026): at a chapter's turn, under a moment on screen, or in a pause without words. Each time the film goes
#    back to 1967 (chapters 5, 7, 8, 9 and 10), the opening's chord in C comes back for a moment, softly.
#  - A double bass, bowed, holds one low, soft C under the years before: the border, the road, the crash and the fear, with no pulse,
#    and it stops when the picture stops, before the two cars meet. Plucked, it lands once, softly, under Mei's red stamp.
#  - The violas, plucked, low and close, mark each owner writing their own line in Who uses what, and each owner saying they're ready,
#    one step higher each time.
#  - A flugelhorn plays the series' mark, four notes, 1-5-4-8, over the violas' G, under the title and the end card.
# The rules the series keeps:
#  - Nothing trembles, pulses or beats (the series, 20 October 2026): no urgent pulse; every note has one voice, with no vibrato and no
#    tremolo; every chord is tuned pure (just intonation, from the key's own note, see hz()), and a note two chords share is held
#    through the change, so no two notes a little apart beat on a phone's speaker. tools/quiet.py checks it, and that after the opening
#    no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing loops. Where the picture repeats (the booklets into the sack, the owners' lines, the feet on the pavement), the sound plays
#    the first few, then softer.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: engines idling, tyres, a ladder, cloth, paper, a pen, a stamp, a pin, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads
# (a line not voiced yet takes the length the film gives it, a word every 0.37 s, at least 1.3 s). wAt() falls back to the line's start
# when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + (_DUR.get(sid + '/' + lid) or max(1.3, len(ln['text'].split()) / 2.7)) * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R7 = np.random.default_rng(7007)  # this film's own randomness: the engines, the steps, the paper
sm = lambda u: np.clip(u, 0, 1) ** 2 * (3 - 2 * np.clip(u, 0, 1))

# ---- tuning: just intonation from the key's own note, so a chord's notes are whole-number ratios of each other and nothing beats.
# 1967 before five is in C; the change, the present and the mark are in G, a pure fifth above it (C is tuned from G), so the notes
# the two keys share are the same pitch in both: C, D, E, G and B. Only A moves, by a comma, and it's never held across a change of
# key. In C the chord on D is left out (its fifth, D to A, isn't pure in this tuning); in G, the chord on A
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEYS = {'G': (55, 196.0), 'C': (48, 196.0 / 1.5)}  # tonic (MIDI) and its pitch
def hz(m, k='G'):
    t, f = KEYS[k]; o, pc = divmod(m - t, 12)
    return f * 2 ** o * _JI[pc]

# ---- the levels: the violas sit about 21 dB under the voice while it speaks, as in the series' other films; the plucked notes and the
# flugelhorn a little over them; the effects about 12 dB under the music (FX scales them all)
VL, PZ, FL, DB, FX = 0.044, 0.052, 0.047, 0.052, 1.6

# ---- the strings: a bowed or plucked string sounds its note and the whole-number partials above it, coloured by the instrument's body
def _body(f, peaks):
    """how the instrument's wooden body colours a partial at f: its resonances, over a gentle fall towards the top"""
    return (1 + sum(a * np.exp(-((f - c) / w) ** 2) for c, a, w in peaks)) / (1 + (f / 1700) ** 2)
VIOLA = ((290, 0.9, 80), (470, 0.6, 110), (1050, 0.35, 260))
BASS = ((105, 0.9, 30), (210, 0.5, 60), (420, 0.3, 120))
def _bowed(f, sec, ring, peaks, att, tilt=1.3, bow=0.02):
    """a note bowed on one string: the bow finds the string slowly (att), the stroke swells a little and eases, and when the bow lifts the
    string rings on for a moment. Its partials are whole-number multiples of the note, and nothing wavers: no vibrato, no tremolo"""
    n = int((sec + ring) * SR); x = np.arange(n, dtype=np.float32) / SR
    e = np.where(x < att, np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2, 1.0) * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / max(sec, 0.1), 0, 1)))
    e = np.where(x > sec, np.exp(-(x - sec) / (0.3 * ring)), e) * np.clip((sec + ring - x) / 0.06, 0, 1)
    s = np.zeros(n, np.float32)
    for k in range(1, 14):
        if f * k > 2300:
            break
        s += (k ** -tilt * _body(f * k, peaks) * np.sin(2 * np.pi * f * k * x + 0.7 * k)).astype(np.float32)
    s = s * e + bow * filt(noise(sec + ring)[:n], 'band', (f * 1.5, min(2200, f * 8))) * e * np.clip(1.2 - x / (att * 3), 0.25, 1)
    return norm(filt(s.astype(np.float32), 'low', 2400))
def viola(m, start, sec, g=VL, pan=0.0, k='G'):
    """one viola, bowed close and soft, without vibrato"""
    f = hz(m, k); put(_bowed(f, sec, 1.0, VIOLA, float(np.clip(0.55 * (196.0 / f) ** 0.6, 0.3, 0.75))), start, g, pan)
def chords(prog, k='G', g=VL, gap=0.06):
    """chords on the violas, one after another: prog is [(start, end, [notes])], or [(start, end, [notes], key)] for a chord in another
    key. A note two chords next to each other share, at the same pitch, is held through the change, by the same player on the same
    string, so it neither stops nor doubles; the others lift as the next chord's come in, a few hundredths of a second apart, from the
    lowest up"""
    runs = []
    for i, c in enumerate(prog):
        a, b, notes = c[:3]; kc = c[3] if len(c) > 3 else k
        for j, m in enumerate(sorted(notes)):
            r = next((r for r in runs if r[0] == m and abs(r[6] - hz(m, kc)) < 0.01 and r[2] == i - 1), None)
            if r:
                r[1:3] = [b, i]
            else:
                runs.append([m, b, i, a + gap * j, j, len(notes), hz(m, kc), kc])
    for m, b, _, a, j, n, _, kc in runs:
        viola(m, a, b - a, g * (1.0 if j == 0 else 0.85) / n ** 0.35, -0.4 + 0.8 * j / max(1, n - 1), kc)
def pizz(m, start, g=PZ, pan=0.0, k='G'):
    """a viola string plucked, low and close: its partials ring and fade, the higher ones first, over the soft thump of the finger"""
    f = hz(m, k); x = tt(1.8)
    s = sum(k_ ** -1.5 * _body(f * k_, VIOLA) * np.sin(2 * np.pi * f * k_ * x) * np.exp(-x * (2.6 + 1.7 * k_)) for k_ in range(1, 9) if f * k_ < 2300)
    s = s * np.minimum(1, x / 0.004) + 0.12 * filt(noise(1.8), 'band', (120, 700))[:len(x)] * np.exp(-x * 70)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g, pan)
def bass(m, start, sec, g=DB, pan=0.0, k='C'):
    """the double bass, bowed: one low, soft note, nothing in it moving"""
    put(_bowed(hz(m, k), sec, 1.4, BASS, 0.9, 1.1, 0.012), start, g, pan)
def bassPizz(m, start, g=DB, pan=0.0, k='G'):
    """the double bass, plucked once: a low, round note that rings a while"""
    f = hz(m, k); x = tt(3.2)
    s = sum(k_ ** -1.2 * _body(f * k_, BASS) * np.sin(2 * np.pi * f * k_ * x) * np.exp(-x * (1.1 + 1.3 * k_)) for k_ in range(1, 10) if f * k_ < 1600)
    s = s * np.minimum(1, x / 0.006) + 0.1 * filt(noise(3.2), 'band', (60, 400))[:len(x)] * np.exp(-x * 50)
    put(norm(filt(s.astype(np.float32), 'low', 1400)), start, g, pan)

# ---- the flugelhorn: a warm, dark brass note, softly tongued, its few low partials strongest, a breath at its start, no vibrato
def flugel(m, start, sec, g=FL, pan=0.0, k='G'):
    f = hz(m, k); n = int((sec + 0.5) * SR); x = np.arange(n, dtype=np.float32) / SR
    e = np.minimum(1, x / 0.07) ** 1.5 * (1 - 0.15 * np.clip((x - 0.1) / max(sec, 0.2), 0, 1))
    e = np.where(x > sec, np.exp(-(x - sec) / 0.12), e) * np.clip((sec + 0.5 - x) / 0.05, 0, 1)
    br = 1 + 0.5 * np.exp(-x / 0.09)  # a little brighter as the note speaks
    s = sum(np.exp(-0.62 * (k_ - 1) / br) * np.sin(2 * np.pi * f * k_ * x + 0.4 * k_) for k_ in range(1, 9) if f * k_ < 2300) * e
    s = s + 0.03 * filt(noise(sec + 0.5)[:n], 'band', (500, 1900)) * np.exp(-x / 0.06)
    put(norm(filt(s.astype(np.float32), 'low', 2300)), start, g, pan)
def mark(start, g=FL):
    """the series' four notes, 1-5-4-8, on the flugelhorn: G, D, C and the G above, each ringing into the next, the last held"""
    for i, iv in enumerate([0, 7, 5, 12]):
        flugel(55 + iv, start + i * 0.5, 0.62 if i < 3 else 2.4, g * (0.9 if i < 3 else 1.0), (i - 1.5) * 0.08)

# ---- soft sounds, all low-passed
def knock(s, g=0.03, pan=0.0, f=240):
    """a soft wooden knock: a card arriving, a carton set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.014, pan=0.0):
    """a fingertip on a phone's glass, or a tag landing"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.026, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pin(s, g=0.028, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def rubber(s, g=0.042, pan=0.0):
    """a rubber stamp on paper: a padded thump, and the paper under it"""
    x = tt(0.25); X(norm((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 22) + 0.5 * filt(noise(0.25), 'band', (200, 1200))[:len(x)] * np.exp(-x * 45)).astype(np.float32)), s, g * FX, pan)
def slide(s, g=0.022, pan=0.0, sec=0.42):
    """a binder or a ledger drawn along a wooden shelf: a low, rough slide, and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
    s_knock(s + sec * 0.92, g * 0.5 * FX, pan, 200)
def pencil(s, g=0.014, pan=0.0, sec=0.8):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def pen(s, g=0.013, pan=0.0, sec=0.9):
    """a pen writing a line: short strokes, unevenly, never quite in time"""
    x = tt(sec); e = np.zeros(len(x), np.float32); t0 = 0.0
    while t0 < sec - 0.06:
        d = R7.uniform(0.05, 0.13); i, j = int(t0 * SR), min(len(x), int((t0 + d) * SR))
        e[i:j] = np.maximum(e[i:j], np.sin(np.pi * np.arange(j - i) / max(1, j - i)) * R7.uniform(0.5, 1.0)); t0 += d + R7.uniform(0.0, 0.05)
    X(filt(noise(sec), 'band', (600, 2100))[:len(x)] * e, s, g * FX, pan)
def marker(s, g=0.016, pan=0.0, sec=1.0):
    """a highlighter drawn along a line, or a ring drawn round a day: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def rub(s, sec=0.9, g=0.014, pan=0.0):
    """a line rubbed out: an eraser's soft strokes, three or four, each a little shorter"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * (0.35 + 0.65 * np.abs(np.sin(np.pi * 2.2 * x / sec * 2))) * np.sin(np.pi * x / sec), s, g * FX, pan)
def clip(s, g=0.016, pan=0.0):
    """a paper clip slid on: two small, dull metal clicks"""
    for d, a in ((0.0, 1.0), (0.11, 0.6)):
        x = tt(0.08); X(norm(filt((np.sin(2 * np.pi * 1450 * x) * np.exp(-x * 120) + 0.5 * filt(noise(0.08), 'band', (700, 2000))[:len(x)] * np.exp(-x * 150)).astype(np.float32), 'low', 2200)), s + d, g * a * FX, pan)
def book(s, g=0.035, pan=0.0):
    """a ledger or a binder set down: a low, padded thud, and its pages"""
    x = tt(0.4); X(norm(filt((np.sin(2 * np.pi * 82 * x) * np.exp(-x * 14) + 0.4 * filt(noise(0.4), 'band', (100, 600))[:len(x)] * np.exp(-x * 40)).astype(np.float32), 'low', 900)), s, g * FX, pan)
    paper(s + 0.01, g * 0.4, pan, 0.25)
def cloth(s, sec=0.8, g=0.016, pan=0.0):
    """a cloth cover drawn off a sign or over it: a soft, low rustle"""
    x = tt(sec); X(filt(noise(sec), 'band', (180, 1300))[:len(x)] * np.sin(np.pi * x / sec) ** 1.2 * (0.6 + 0.4 * np.sin(np.pi * 3 * x / sec) ** 2), s, g * FX, pan)
def air(s, sec=0.9, g=0.018, pan=0.0):
    """things moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def step(s, g=0.012, pan=0.0):
    """a footstep on a pavement or a road: a soft heel, and the scuff of the sole"""
    s_knock(s, g * FX, pan, 130 + 30 * R7.uniform()); x = tt(0.12)
    X(filt(noise(0.12), 'band', (250, 1400))[:len(x)] * np.exp(-x * 40), s + 0.02, g * 0.5 * FX, pan)
def steps(s0, s1, per, g=0.012, pan=0.0, full=4):
    """a walk: a step every per seconds from s0 to s1, the first few at g, then softer"""
    for i, t in enumerate(np.arange(s0, s1, per)):
        step(t, g if i < full else g * 0.55, pan + (0.04 if i % 2 else -0.04))
def chair(s, g=0.012, pan=0.0):
    """a chair moved on a wooden floor: a short, low rub"""
    x = tt(0.3); X(filt(noise(0.3), 'band', (120, 700))[:len(x)] * np.sin(np.pi * x / 0.3) ** 2, s, g * FX, pan)

# ---- the street in 1967: engines, tyres and a tow truck, low and soft
def _pan(sig, s, g, p):
    """an effect that moves across the stereo field as it plays: p is its pan at each sample"""
    p = np.clip(p, -1, 1); X(sig * np.sqrt(0.5 * (1 - p)), s, g, -1.0); X(sig * np.sqrt(0.5 * (1 + p)), s, g, 1.0)
def engine(s, sec, g=0.012, pan=0.0, f0=27.0, rev=None, fade=(0.4, 0.6), pan1=None):
    """a car's engine: the low note of its firing and the partials above it, under a soft rumble. rev=(t, seconds, ratio) speeds it up as
    the car pulls away, from t seconds in; pan1 moves it to another side as it goes. It stays below about 900 Hz"""
    n = int(sec * SR); x = np.arange(n, dtype=np.float32) / SR; fr = np.full(n, f0, np.float32)
    if rev:
        fr = fr * (1 + (rev[2] - 1) * sm((x - rev[0]) / rev[1])).astype(np.float32)
    ph = 2 * np.pi * np.cumsum(fr) / SR; ph0 = R7.uniform(0, 6.3, 12)
    hum = sum(a * np.sin((k + 1) * ph + ph0[k]) for k, a in enumerate((0.35, 1.0, 0.8, 0.6, 0.45, 0.32, 0.22, 0.15, 0.1, 0.06, 0.04, 0.03)))
    sig = 0.5 * hum / 3.5 + filt(noise(sec)[:n], 'band', (55, 380)) * 0.8
    e = np.minimum(1, x / fade[0]) * np.clip((sec - x) / fade[1], 0, 1)
    if rev:
        e = e * (1 + 0.6 * sm((x - rev[0]) / rev[1]))
    sig = filt((sig * e).astype(np.float32), 'low', 900)
    if pan1 is None:
        X(sig, s, g * FX, pan)
    else:
        _pan(sig, s, g * FX, pan + (pan1 - pan) * sm(x / sec))
def passing(s, sec=1.6, g=0.016, pan0=0.3, pan1=0.6, f0=34.0):
    """a car going by: its tyres on the road swelling and fading as it passes, its engine's note falling a little, moving across"""
    n = int(sec * SR); x = np.arange(n, dtype=np.float32) / SR; u = x / sec
    e = np.exp(-((u - 0.55) / 0.22) ** 2)
    tyres = filt(noise(sec)[:n], 'band', (90, 1100))
    fr = f0 * (1.06 - 0.12 * sm((u - 0.4) / 0.3)); ph = 2 * np.pi * np.cumsum(fr) / SR
    hum = sum(a * np.sin((k + 1) * ph) for k, a in enumerate((0.3, 1.0, 0.7, 0.5, 0.3, 0.2)))
    _pan(filt(((tyres + 0.25 * hum / 3) * e).astype(np.float32), 'low', 1200), s, g * FX, pan0 + (pan1 - pan0) * u)
def road(s, sec, g=0.012, pan=0.0):
    """driving along a road: the steady roll of tyres, soft, rising and falling a little with the road"""
    n = int(sec * SR); x = np.arange(n, dtype=np.float32) / SR
    X(filt(noise(sec)[:n], 'band', (70, 700)) * np.minimum(1, x / 0.6) * np.clip((sec - x) / 0.6, 0, 1) * (0.85 + 0.15 * np.sin(2 * np.pi * x / 3.7)), s, g * FX, pan)
def chain(s, g=0.014, pan=0.0):
    """the tow truck's chain going taut: a few dull links, low-passed"""
    for d in (0.0, 0.07, 0.15):
        x = tt(0.12); X(norm(filt(sum(a * np.sin(2 * np.pi * fm * x) * np.exp(-x / dd) for fm, a, dd in ((640, 1.0, 0.03), (1530, 0.4, 0.02))).astype(np.float32), 'low', 2000)), s + d, g * FX * (1 - d * 2), pan)
def ladder(s, g=0.016, pan=0.0):
    """a foot shifting on a wooden ladder: a dull knock, and the rung's small creakless give"""
    s_knock(s, g * FX, pan, 190); s_knock(s + 0.05, g * 0.4 * FX, pan, 150)

# =============================================================================================================================
# 1. Five in the morning: the violas in C under the stopped cars, the engines idling; the cars cross to the right and wait, and at
#    ten to five the clock's hand jumps to five; at five the chord moves through E minor to G as the officer sends them on, and more
#    come, on the right. The years before on the double bass alone, one low C: the border, the road behind the lorry, the car that
#    comes the other way, the tow truck, and the grey night of what many feared; it stops with the picture, before the cars meet.
#    "Everyone had to know": the violas in C again, the commission's papers growing a year at a time, the covers changed at night,
#    the booklets into the sack, the milk set down; E minor on "surprised", and G on "no one", the morning traffic on the right;
#    the reports slid in, half as tall, and the pencil line; at five again, the cars set off, the officer lowers his glove, and the
#    mark plays under the title, the violas holding G into Today
every, cross, waited, drove, name = W('dawn', 'stop', 'every car'), G('dawn', 'cross', 0.2), W('dawn', 'cross', 'waited'), W('dawn', 'five', 'drove'), G('dawn', 'name')
border, road_, over, see = G('dawn', 'left', -0.2), G('dawn', 'wheel', -0.2), G('dawn', 'overtake'), W('dawn', 'overtake', "couldn't see")
crash, change, feared, many, meet = W('dawn', 'overtake', 'and many', -0.2), G('dawn', 'change'), G('dawn', 'feared', -0.1), W('dawn', 'feared', 'many feared'), W('dawn', 'feared', 'head on')
know, com, signs, night = G('dawn', 'know', -0.3), G('dawn', 'commission'), G('dawn', 'signs', -0.2), W('dawn', 'signs', 'covered')
bk, milk, huge, half, knew = G('dawn', 'booklet', -0.2), W('dawn', 'booklet', 'and the change', -0.1), G('dawn', 'huge', -0.2), G('dawn', 'half', -0.2), G('dawn', 'knew', -0.2)
breath, title, today = G('dawn', 'breath'), G('dawn', 'breath', 0.9), S0('board')
CM, EM, GM, FM, AM, DM = [48, 55, 64], [55, 59, 64], [55, 59, 62], [53, 57, 60], [57, 60, 64], [54, 57, 62]
chords([(0.4, G('dawn', 'five', -0.3), CM),  # the cars stop, cross and wait, ten to five
        (G('dawn', 'five', -0.3), drove + 0.2, EM, 'G'),  # five: the chord the two keys share
        (drove + 0.2, border - 0.3, GM, 'G')], 'C')  # and on, in G
chords([(know - 0.1, com + 0.6, CM),  # everyone had to know: the violas again, in C
        (com + 0.6, signs - 0.2, FM),
        (signs - 0.2, bk - 0.1, CM),
        (bk - 0.1, milk + 0.3, AM),
        (milk + 0.3, G('dawn', 'huge', -0.3), FM),
        (G('dawn', 'huge', -0.3), W('dawn', 'huge', 'surprised', -0.25), CM),
        (W('dawn', 'huge', 'surprised', -0.25), W('dawn', 'huge', 'no one', -0.2), EM, 'G'),  # "surprised no one": through E minor to G
        (W('dawn', 'huge', 'no one', -0.2), G('dawn', 'knew', -0.4), GM, 'G'),
        (G('dawn', 'knew', -0.4), W('dawn', 'knew', 'what they', -0.3), DM, 'G'),
        (W('dawn', 'knew', 'what they', -0.3), breath + 0.2, GM, 'G'),
        (breath + 0.2, today + 2.6, [55, 59, 62, 67], 'G')], 'C')  # the G opened out under the title, and held into Today
bass(36, border - 0.4, over - border - 0.1, DB * 0.9)  # the years before: one low C, bowed
bass(36, over - 0.5, feared - over + 0.3, DB * 0.85)  # the bow changes as the road turns to the crash
bass(36, feared - 0.2, meet + 0.1 - feared + 0.2, DB * 0.8)  # and stops with the picture, before the cars meet
mark(title + 0.55)
# the crossroads: the three cars idling at ten to five, the near one loudest; crossing to the right, and waiting; at five, each
# pulls away as it goes in the picture, the near one first, then the one coming towards us, then the far one; two more come
engine(0.0, drove + 2.2, 0.016, -0.05, 26.5, (drove, 1.6, 2.1), (0.3, 1.2))
engine(0.0, drove + 2.8, 0.008, 0.1, 28.2, (drove + 0.5, 1.6, 2.0), (0.6, 1.4))
engine(0.0, drove + 2.6, 0.006, -0.15, 29.6, (drove + 0.3, 1.6, 2.0), (0.6, 1.4))
cloth(0.6, 0.5, 0.008, 0.0)  # the officer's glove raised
for k, d in enumerate((0.0, 0.3, 0.6)):
    air(cross + d + 0.6, 1.6, 0.008 if k == 0 else 0.005, [0.0, 0.1, -0.1][k])  # each car swerving across to the right
s_knock(waited + 1.8, 0.016 * FX, 0.25, 170)  # the street clock's hand reaches five
cloth(drove - 0.5, 0.45, 0.008, 0.0)  # the officer's arm out
passing(name - 0.1, 2.2, 0.012, 0.2, 0.55); passing(name + 0.6, 2.4, 0.01, -0.1, -0.5)  # two more cars, on the right
# 1966, the border: a car beyond the barrier drives away on the right; this side, a Swedish car comes up on the left and stops
engine(border, 3.6, 0.007, 0.35, 30.0, None, (0.3, 2.0))
engine(border + 0.1, road_ - border + 0.2, 0.012, -0.25, 27.0, None, (1.8, 0.6))  # coming up, louder as it comes, then idling
# the road at dusk: behind the lorry, its engine low, the tyres rolling; he edges out, a car comes the other way, and he pulls back in
road(road_, crash - road_ + 0.3, 0.012, 0.0)
engine(road_, crash - road_ + 0.3, 0.012, 0.0, 19.0, None, (0.5, 0.5))  # the lorry
passing(see + 0.15, 1.4, 0.03, 0.25, 0.75, 38.0)  # out from behind the lorry, and past
air(see + 0.4, 0.7, 0.01, -0.1)  # pulled back in
# the tow truck pulls away the crumpled car; the officer writes, and looks up
engine(crash, feared - crash + 0.3, 0.012, -0.2, 22.0, (0.2, 1.2, 1.25), (0.5, 0.6))
chain(crash + 0.3, 0.012, -0.25)
pencil(crash + 0.6, 0.008, -0.55, 1.6)
# what many feared, at night, in grey: a car keeping right, and another coming at it on the same side; the picture stops, and so does
# every sound, before they meet
fz = meet + 0.1
engine(feared, fz - feared, 0.009, 0.15, 27.5, None, (0.6, 0.05))
engine(many, fz - many, 0.008, 0.3, 31.0, (0.0, fz - many, 1.25), (0.8, 0.05))
# 1963 to 1966: the commission's papers grow, a year at a time, and one of them writes
for k in range(3):
    paper(G('dawn', 'commission', 0.5 + 0.6 * k) + 0.05, 0.014 if k < 2 else 0.01, px(1250), 0.35)
pencil(know + 0.4, 0.008, px(470), 1.2)
# the night the covers changed: off the new sign, across, and over the old one; his foot shifts on the ladder as he reaches across
cloth(night, 0.9, 0.018, px(1300)); ladder(night + 0.95, 0.014, px(1100)); cloth(night + 1.5, 0.9, 0.016, px(900))
# the post office: the booklets into the sack, one by one; the first two at full, then softer
for i in range(6):
    paper(bk + 0.5 + i * 0.4 + 0.22, 0.016 if i < 2 else 0.008, 0.0, 0.18); s_knock(bk + 0.5 + i * 0.4 + 0.3, (0.01 if i < 2 else 0.005) * FX, 0.0, 180)
# the grocer's: the milk set down on the counter
knock(milk + 1.3, 0.024, px(1100), 220)
# the morning: traffic on the right, a bus among it, people walking towards us on the pavements
engine(huge, half - huge + 0.3, 0.012, 0.2, 21.0, None, (0.6, 0.6))  # the bus
road(huge, half - huge + 0.3, 0.01, 0.1)
passing(huge + 0.4, 2.0, 0.01, -0.2, -0.55); passing(huge + 2.2, 2.0, 0.008, -0.1, -0.45)
steps(huge + 0.35, half, 0.48, 0.008, -0.45, 3); steps(huge + 0.6, half, 0.5, 0.007, 0.5, 3)
# the police desk: the reports for 1967 slid in, half as tall, the hand goes, and the pencil line marks half
slide(half + 0.4, 0.016, 0.4, 1.1); pencil(half + 2.5, 0.012, 0.0, 0.9)
# at five: the near car sets off, the others go by; the tags as they're said; the officer lowers his glove
engine(knew, breath - knew + 1.0, 0.012, -0.05, 26.5, (0.6, 1.4, 1.9), (0.3, 1.2))
passing(knew + 0.8, 2.4, 0.008, 0.25, 0.55)
for w, x in [('what would', 1601), ('when', 1400), ('what they', 250)]:
    tap(W('dawn', 'knew', w) + 0.05, 0.01, px(x))
cloth(breath - 0.1, 0.6, 0.008, 0.0)

# 2. The change board: Today, the violas' G held from the title; the three tags; Jun walks up to the door; the notice's paper, its new
#    words; Mei signs it off, and the tick; Jun takes a form from the tray and writes; binder 19 slid off the shelf and opened; the
#    calendar's red ring; the board's form, "awards?" in pencil; the draft's card set on its day; one line scribbled, three left empty;
#    and, in the pause, the two questions, the second on a soft chord
for i in range(3):
    tap(W('board', 'same', 'three') + 0.25 * i + 0.05, 0.01, px([560, 960, 1360][i]))
steps(S0('board') + 0.6, W('board', 'award', 'word', -0.4), 0.52, 0.006, 0.4, 3)
paper(W('board', 'award', 'word', -0.2), 0.016, 0.0, 0.5)
sg = W('board', 'mei', 'signed', -0.1)
pen(sg + 0.25, 0.013, -0.1, 1.2); tap(sg + 1.65, 0.012, -0.1)
jun = G('board', 'jun', -0.2)
paper(jun + 0.6, 0.014, px(1480), 0.35)
pen(G('board', 'jun', 1.4), 0.013, 0.0, 1.2); pen(G('board', 'jun', 2.7), 0.012, 0.15, 0.45)
bd = G('board', 'binder', -0.2)
slide(bd + 0.4, 0.02, px(1300), 0.45); paper(W('board', 'binder', 'impact', -0.2) + 0.1, 0.016, 0.0, 0.45)
marker(W('board', 'practice', 'once'), 0.012, 0.0, 0.7)  # the next meeting ringed in red
pencil(W('board', 'practice', 'answered'), 0.012, 0.0, 0.9)
knock(W('board', 'next', 'draft') + 0.85, 0.016, -0.1, 300)
rem = W('board', 'nobody', 'remembers')
pencil(rem - 0.2, 0.01, 0.0, 1.0)
chords([(G('board', 'better', 1.7), G('board', 'better', 4.8), EM)], 'G', VL * 0.8)  # "Let's see what it reaches first."

# 3. Who uses what: Jun points at the board; the question mark in pencil; the register's new page pinned over the card; then each owner
#    writes their own line, a plucked note for each, one step higher each time: Mei, Clara, Marta, and Jun copying Finance's note in;
#    the foot of the page, and the violas' G as it's done
pencil(W('uses', 'nobody', 'answers', -0.2), 0.012, px(1000), 0.9)
st = G('uses', 'start')
paper(st, 0.016, 0.1, 0.4); pin(st + 0.5, 0.026, 0.1)
for k, (t, m, x) in enumerate([(W('uses', 'start', 'record', -0.3), 55, 900), (G('uses', 'lines', -1.1), 57, 1080),
                               (G('uses', 'lines', 0.6), 59, 1720), (W('uses', 'lines', 'and Jun', 0.1), 62, 1300)]):
    pen(t + 0.45, 0.012 if k < 2 else 0.009, px(x), 0.9); pizz(m, t + 0.5, PZ, px(x) * 0.5)
pen(W('uses', 'lines', 'and Jun', 2.0), 0.01, 0.0, 0.9)
chords([(E('uses') - 1.9, E('uses') + 1.4, GM)], 'G', VL * 0.85)

# 4. The impact note: the note clipped on, its three headings written; the box; the register's five lines washed gold; the list of five;
#    the tags, who asked and who didn't; the names, and a quick look at each owner; Marta, who leads the wallet team
clip(W('note', 'note', 'impact', 0.5), 0.016, 0.3)
for w in ('what', 'whether', 'who'):
    pen(W('note', 'note', w), 0.011, 0.35, 0.8)
pen(W('note', 'draft', 'relabels', 0.1), 0.012, -0.2, 1.5)
for i in range(5):
    marker(W('note', 'five', 'five', 0.25 * i), 0.008 if i < 2 else 0.005, 0.0, 0.4)
pen(G('note', 'five', 2.35), 0.011, 0.35, 1.4)
for i in range(2):
    tap(W('note', 'asked', 'asked', 0.2 * i + 0.1), 0.012, 0.4)
for w in ('dashboard', 'forecast', 'wallet'):
    tap(W('note', 'didnt', w, -0.2), 0.009, 0.4)
for w, x in [('Mei', 1184), ('Clara', 1320), ('Finance', 1456), ('Marta', 1592)]:
    pen(W('note', 'owners', w, -0.1), 0.009, px(x), 0.6)
chords([(W('note', 'owners', 'who leads', -0.1), E('note') + 1.2, [55, 59, 64])], 'G', VL * 0.75)  # Marta, in the meeting room

# 5. Breaking or not? The dashboard: the big microcredential drops out; Finance's forecast moves; the wallet; the table, the same, its
#    row turned red; 1967 for a moment, the opening's chord in C as the cars cross together; Mei's stamp, "breaks", on the double bass
#    plucked once, and her initials
air(W('breaks', 'drop', 'drop out', -0.1), 1.3, 0.01, 0.2)
tap(W('breaks', 'wallet', 'as awards', -0.2) + 0.3, 0.012, 0.0)
rd = G('breaks', 'road', -0.2)
chords([(rd - 0.1, rd + 3.2, CM)], 'C', VL * 0.8)
sw = W('breaks', 'road', 'switching', 0.2)
engine(rd, 3.4, 0.008, 0.0, 26.5, None, (0.3, 0.8))
for d in (0.0, 0.3, 0.6):
    air(sw + d + 0.6, 1.6, 0.006, 0.0)
stp = W('breaks', 'decides', 'this one', -0.1) + 0.5
rubber(stp, 0.04, 0.3); bassPizz(40, stp, DB, 0.0)  # the low E, under the red
pen(stp + 0.7, 0.011, 0.3, 0.6)

# 6. Add, don't break: the first box crossed out and a new one written; the new column slides in, its yes cells lit, Mei's rule card;
#    the three lines that use credentials washed gold; the new note written; and, side by side, its "no" and the tick, on a short G
cr = G('adds', 'adds', 0.2)
pencil(cr, 0.012, -0.2, 0.6); pen(cr + 0.7, 0.012, -0.2, 1.4)
slide(W('adds', 'mark', 'one new mark'), 0.012, 0.3, 0.8)
paper(W('adds', 'mark', 'yes or no', -0.3), 0.012, 0.5, 0.5)
for j in range(3):
    marker(W('adds', 'lists', 'only what', 0.25 * j), 0.007, 0.0, 0.4)
pen(W('adds', 'lists', 'the two', -0.1), 0.011, 0.35, 1.2); pen(W('adds', 'lists', 'three owners'), 0.01, 0.35, 1.1)
no = W('adds', 'nothing', 'breaks', -0.1)
pen(no, 0.011, 0.45, 0.6)
chords([(no + 0.3, E('adds') + 1.0, GM)], 'G', VL * 0.75)

# 7. The old edition: a line rubbed out of edition 1, and a red cross; edition 2 slid in along the shelf; 1967 for a moment, the pole
#    and its covered sign, on the opening's chord; the tag tied on, and its swing
rub(W('edition', 'cant', 'taking'), 0.9, 0.012, px(400))
marker(W('edition', 'cant', 'away', -0.3), 0.01, px(700), 0.5)
slide(W('edition', 'beside', 'new edition', -0.15), 0.02, 0.5, 1.4)
pl = W('edition', 'beside', 'like', -0.2)
chords([(pl - 0.1, pl + 2.8, CM)], 'C', VL * 0.75)
paper(W('edition', 'beside', 'until', -0.1), 0.012, px(300), 0.4)
air(W('edition', 'last', 'last resort', -0.25), 1.2, 0.006, px(300))

# 8. In their words: Marta's name lit, and "didn't ask"; Jun's note written in their words, his first try struck through; the booklet
#    slid in, 1967 for a moment, the opening's chord in C, and its three tags lifted onto the note; who will help, and his name; Marta's
#    nod, on a plucked note; and in the pause, "Thursday" in her notebook
marker(W('words', 'told', 'who must', -0.1), 0.01, -0.2, 0.6); tap(W('words', 'told', "didn't", -0.1), 0.012, -0.1)
wr = W('words', 'writes', 'writes to', 0.2)
pen(wr, 0.012, 0.3, 1.4); pen(wr + 1.6, 0.008, 0.3, 1.4); pencil(W('words', 'writes', 'not his', -0.1), 0.012, -0.4, 0.9)
bo = G('words', 'booklet', -0.3)
paper(bo + 0.2, 0.014, 0.6, 0.7)
chords([(bo + 0.1, bo + 3.4, CM)], 'C', VL * 0.7)
for w in ('what changes', 'from when', 'what to do'):
    air(W('words', 'booklet', w, 0.1), 0.7, 0.006, 0.3); tap(W('words', 'booklet', w, 0.75), 0.01, 0.2)
pen(G('words', 'help'), 0.012, 0.0, 1.3)
pizz(62, W('words', 'half', 'telling', 0.1), PZ * 0.9, 0.15)
nb8 = G('words', 'half') + (_DUR.get('words/half') or 2.1) + 0.5  # the notebook, in the pause
pencil(nb8 + 0.4, 0.012, 0.0, 1.1)

# 9. Ready: the draft held up, and its card; the census report's card; 1967 for a moment, the cars waiting at ten to five, on the
#    opening's chord and their engines; each owner's line lit, a nod and a plucked note, one step higher each time, a tick and "ready";
#    Jun's stamp, "in · today"; and Thursday, Jun and Marta at work, on a soft G
paper(S0('ready') + 0.3, 0.012, 0.0, 0.4)
knock(W('ready', 'wed', 'counts', -0.2) + 0.3, 0.014, 0.0, 300); knock(W('ready', 'wed', 'next run', -0.6) + 0.3, 0.014, 0.0, 300)
ca = G('ready', 'wait', -0.25)
chords([(ca - 0.1, ca + 3.0, CM)], 'C', VL * 0.75)
engine(ca, 2.8, 0.009, 0.0, 26.5, None, (0.3, 0.8)); engine(ca, 2.8, 0.005, 0.15, 29.6, None, (0.3, 0.8))
for j, (m, x) in enumerate([(59, 1630), (62, 1630), (67, 1630)]):
    t0 = W('ready', 'wait', 'Mei', -0.15) + 1.0 * j
    marker(t0 - 0.2, 0.006, 0.0, 0.35); pizz(m, t0 + 0.35, PZ, 0.35); tap(t0 + 0.85, 0.008, 0.35)
ps = W('ready', 'goes', 'goes in', 0.15)
rubber(ps, 0.04, -0.2)
th = W('ready', 'goes', 'today', 0.2)
chords([(th + 0.2, E('ready') + 0.6, GM)], 'G', VL * 0.75)
tap(th + 0.9, 0.006, 0.1); tap(th + 1.3, 0.005, 0.1)  # the laptop's keys

# 10. A step, not a meeting: binder 19's line lifts off the page as a gold card; Yusuf reaches up with it to the form on the data team's
#     board; it lands, and becomes the box every request has, each owner's ready washed green; Anil's line written in, a plucked note;
#     the calendar's monthly circle fades, and the note goes over "once a month"; the request, in today; today ringed in gold; the
#     register, nothing broke; the two reports' cards, joined, D to G; 1967 for a moment, the morning, the traffic flowing and the
#     officer walking off; an ordinary day, a note clipped to another request; one question, its card and its empty owner; the mark
#     under the end card, the violas holding G
lf = W('step', 'shelf', 'leaves', -0.3)
paper(lf, 0.014, 0.3, 0.8); air(lf + 0.9, 1.0, 0.008, 0.4)
fm = W('step', 'every', 'carries', -0.2)
cloth(fm - 1.0, 0.7, 0.006, -0.1)  # the reach up
knock(fm + 0.8, 0.016, 0.1, 300)  # the card on the form
air(W('step', 'every', 'impact', -0.1), 0.8, 0.006, 0.1)  # and it becomes the box
marker(W('step', 'every', 'owners', -0.2), 0.008, 0.2, 0.5)
six = W('step', 'team', 'adds', -0.1)
pen(six, 0.012, 0.3, 1.5); pizz(64, six + 0.2, PZ * 0.85, 0.35)
paper(W('step', 'board', 'when', -0.1), 0.012, 0.0, 0.4)
marker(W('step', 'today', 'today', -0.1), 0.012, -0.2, 0.8)
jn = W('step', 'broke', 'agree', -0.3)
chords([(jn + 0.1, jn + 1.0, DM), (jn + 1.0, jn + 3.4, GM)], 'G', VL * 0.8)
mo = G('step', 'morning', -0.4)
chords([(mo + 0.2, mo + 3.6, CM)], 'C', VL * 0.7)
engine(mo, 4.2, 0.01, 0.2, 21.0, None, (0.6, 0.8)); road(mo, 4.2, 0.008, 0.1)
passing(mo + 0.6, 2.0, 0.008, -0.2, -0.55)
steps(mo + 0.5, mo + 3.9, 0.45, 0.007, 0.2, 3)
paper(G('step', 'idea', 0.2), 0.01, 0.6, 0.7); clip(G('step', 'idea', 0.2) + 0.75, 0.014, 0.35)
paper(W('step', 'late', 'a table', -0.2), 0.012, -0.5, 0.5); pen(W('step', 'late', 'who answers', -0.1), 0.01, -0.5, 0.9)
end = G('step', 'breath', -0.2)
chords([(end + 0.5, TOT, [55, 59, 62])], 'G', VL * 0.85)
mark(end + 0.75)
