# Borrowed rights: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py). A new
# palette, the one the series thread reserved for this film on 5 November 2026 after checking every score.py on main and on every branch
# (/mnt/project-files/agentic-data-engineering/series-3/palettes.md), with its partner taken by this film's thread that day: a kit and a
# gemshorn, both made here (music.py has neither).
#  - The kit (kit()), the dancing master's pocket fiddle of the 1600s and 1700s: a small, thin bowed string, played softly with no
#    vibrato, in a small room, as the master played it while a pupil learned the steps, never at the ball. It is the instrument of the
#    lesson, and of whoever borrows a person's rights: the one who holds a member's signed cover, and Jun's helper. Its body is tiny, so
#    its lowest notes are thin and its tone sits in the middle, nasal and plain; it is kept low in its range and soft, so it never reads
#    as a violin, nor as the viola d'amore of Memory: from one chat to the team (no sympathetic strings ring with it) or the muted
#    quartet of Governed in dbt (one small instrument, dry). Its open strings, G, D and A, are tuned pure, as a fiddler tunes them.
#  - The gemshorn (gem()), the soft horn flute of the late Middle Ages and after, a tenor, played low and plain, with the faint upper
#    partials of its horn and its breath: the person whose rights are lent (the member, Jun, Lucía, Noor, Clara). It sounds only for a
#    person, never for an agent, and stays an octave and more below the alto ocarina of Memory for the team.
#  - The person's phrase (PHRASE): D, B flat, D, F, A, B flat. The gemshorn plays it as the member signs his name, the frank; the kit
#    plays it whole where the helper has everything Jun may do; and narrowed (NARROW), on the kit's open strings only, nothing stopped:
#    the same tune with only the notes the open strings give (D, D, A, and D with A to close), where the helper learns in a sandbox.
#  - The mark, on the end card: the person's phrase whole on the gemshorn, then again on the kit's open strings only.
#  - A person decides or approves: the gemshorn's rising fifth, B flat to F (decide()), four times after the opening, each where a
#    person decides (Noor approves, Jun and Sam narrow, Noor approves production, Clara owns the planning agent).
#  - B-flat major for the person's own rights and for what's narrowed; G minor for the problem (the borrowed name, the step that would
#    approve as Jun); E-flat major at "Something had to change". No C minor chord: its third isn't pure in this tuning.
# The rules the module keeps (its briefs, 4 and 5 November 2026):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice, no drone held under it. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord is tuned pure (just intonation from B flat, see
#    hz()). No urgent pulse: nothing in this story is a rush. No post horn and no mail-coach tune: nothing borrowed from the opening's
#    Britain.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen (a pile of letters,
#    five stages springing in, the 38 steps) is one soft sound, never one for each.
# And everything stays low and soft, below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid):
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1840)  # this film's own randomness: the room, the bow, the breath, the paper

# ---- tuning: just intonation from B flat, so a chord's notes are whole-number ratios of each other and nothing beats. B-flat major
# (B flat D F), G minor (G B flat D), E-flat major (E flat G B flat), F major and D minor are all pure in this table, and the kit's open
# strings, G, D and A, are pure fifths; C with E flat or with G is not (32/27 and 40/27), so no C minor chord, and C sounds only with F
# or A
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
KEY = (58, 233.082)  # B flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the gemshorn's notes, low, and the kit's, from its open G up
G2, Bb2, D3, Eb3, F3, A3 = 43, 46, 50, 51, 53, 57
G3, Bb3, D4, Eb4, F4, G4, A4, Bb4 = 55, 58, 62, 63, 65, 67, 69, 70
OPEN = (G3, D4, A4)                       # the kit's open strings (its E is never played)
PHRASE = (D4, Bb3, D4, F4, A4, Bb4)       # the person's phrase, on the kit; the gemshorn plays it an octave down
NARROW = ((D4, 0.0), (D4, 0.72), (A4, 1.44), (D4, 1.80))  # the same tune on the open strings only: D, D, A, and D with A to close

# ---- the levels, set so the music's loud moments sit about -28 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the gemshorn a little under the kit; the effects about 16 dB
# under the music (FX scales them all)
KL, GL, FX = 0.080, 0.050, 1.4

# a small room round the players, the room where the lesson is: ringing on for under a second, nothing much above 1.8 kHz. Its level
# is set by what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), so a held note keeps its level, as the video
# guidelines ask, and each held note is set back to its level without the room (_held)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.015 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))
def _drift(n, depth):
    """a bow or a breath a little uneven, as a hand or a player is: a slow wander of a few percent, with no rhythm in it"""
    d = filt(R1.standard_normal(n).astype(np.float32), 'low', 1.5).astype(np.float64)
    return 1 + depth * d / max(1e-9, float(d.std()))

# ---- the kit: a bowed string, its harmonics as the bow draws them (each about 1/k), shaped by a tiny body: little below 330 Hz, a
# small air resonance near 540 Hz, the wood near 1.1 and 1.7 kHz, and nothing above 2.4 kHz. The bow starts softly, the higher
# harmonics a moment after the first, with the faint rosin of the bow on the string; a stopped note dies quickly when the bow lifts,
# and an open string, with no finger on it, rings on. A note of a second or more swells a little and eases, once. No vibrato
def _body(fk):
    return (1 / np.sqrt(1 + (330 / fk) ** 4)) * (0.55 + 0.5 * np.exp(-((fk - 540) / 120) ** 2) + 0.9 * np.exp(-((fk - 1100) / 230) ** 2)
                                              + 0.6 * np.exp(-((fk - 1700) / 250) ** 2)) * np.exp(-max(0.0, fk - 2000) / 300)
def kit(m, a, b, g=1.0, att=0.10, pan=0.12, room=0.20, open_=False):
    """the kit bowing m (a note, or two notes together, a double stop) from a to b"""
    ms = m if isinstance(m, tuple) else (m,)
    sec = max(0.2, b - a); ring = 0.55 if open_ else 0.07
    n = int((sec + 6 * ring + 0.06) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for j, mm in enumerate(ms):
        f = hz(mm)
        for k in range(1, int(2400 // f) + 1):
            fk = f * k
            on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.1 * (k - 1))), 1)) ** 2
            off = np.where(x > sec, np.exp(-(x - sec) * (1 + (0.3 if open_ else 0.5) * (k - 1)) / ring), 1.0)
            s = s + _body(fk) / k ** 1.1 * on * off * np.sin(2 * np.pi * fk * x + 0.61 * k + 1.7 * j)
    if sec >= 1.0:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s * _drift(n, 0.02); s = s / max(1e-9, float(np.abs(s).max()))
    bow = np.where(x < sec, 1.0, np.exp(-(x - sec) * 30)) * (1 + 2.0 * np.exp(-x / 0.05))
    s = s + filt(noise(n / SR + 0.01)[:n], 'band', (900, 2300)) * 0.010 * bow
    put(_held(filt(s.astype(np.float32), 'low', 2400), room), a, g * KL, pan)
def phrase(notes, s, step=0.36, last=1.2, g=1.0, pan=0.12):
    """the kit plays notes one after another, each bowed in turn, the last held"""
    for i, m in enumerate(notes):
        kit(m, s + step * i, s + step * i + (last if i == len(notes) - 1 else step * 0.92), g * (0.9 if i == len(notes) - 1 else 0.8),
            att=0.06, pan=pan)
def narrow(s, g=1.0, pan=0.12):
    """the person's phrase on the kit's open strings only, nothing stopped: D, D, A, then D with A, ringing on"""
    for i, (m, t) in enumerate(NARROW):
        hold = 1.25 if i >= 2 else 0.62
        kit(m, s + t, s + t + hold - (0.36 if i == 3 else 0.0), g * (0.85 if i < 3 else 0.6), att=0.07, pan=pan, open_=True)

# ---- the gemshorn: a vessel flute of horn, so nearly a pure tone, with the faint upper partials of its cone and the breath through it,
# most of it at its own note; a soft chiff as each note speaks, its upper partials a moment after the first. Held steady, with no
# vibrato; a note of 1.2 s or more swells a little and eases, once; when the breath stops, the note stops
def gem(m, a, b, g=1.0, att=0.08, rel=0.10, pan=-0.12, room=0.24):
    f = hz(m); sec = max(0.25, b - a); n = int((sec + 6 * rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k, ak in ((1, 1.0), (2, 0.20), (3, 0.12), (4, 0.05), (5, 0.025)):
        if f * k > 1800:
            break
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.25 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (1 + 0.3 * (k - 1)) / rel), 1.0)
        s = s + ak * on * off * np.sin(2 * np.pi * f * k * x + 0.4 * k)
    if sec >= 1.2:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s * _drift(n, 0.015); s = s / max(1e-9, float(np.abs(s).max()))
    br = np.where(x < sec, 1.0, np.exp(-(x - sec) / 0.05))
    hb = filt(noise(n / SR + 0.01)[:n], 'band', (f * 0.86, f * 1.16)); hb = hb / max(1e-9, float(hb.std()))
    s = s + 0.03 * hb * br + filt(noise(n / SR + 0.01)[:n], 'band', (700, 1800)) * 0.006 * br
    s = s + filt(noise(n / SR + 0.01)[:n], 'band', (900, 2200)) * 0.04 * np.exp(-x / 0.02)
    put(_held(filt(s.astype(np.float32), 'low', 1800), room), a, g * GL, pan)
def gphrase(notes, s, step=0.32, last=1.0, g=1.0, pan=-0.12):
    """the gemshorn plays notes one after another, each with its own breath, the last held"""
    for i, m in enumerate(notes):
        gem(m, s + step * i, s + step * i + (last if i == len(notes) - 1 else step * 0.88), g * (0.95 if i == len(notes) - 1 else 0.85),
            att=0.05, rel=0.06, pan=pan)
def decide(s, g=1.0, hold=1.3, pan=-0.12):
    """a person decides or approves: the gemshorn's rising fifth, B flat to F"""
    gem(Bb2, s, s + 0.40, g * 0.9, rel=0.08, pan=pan); gem(F3, s + 0.46, s + 0.46 + hold, g, rel=0.14, pan=pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap: a row lit, a key"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.008, pan=0.0, step=0.13):
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.011, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def flick(s, g=0.010, pan=0.0):
    """a page flicked over: short and light"""
    paper(s, g, pan, 0.16)
def slide(s, g=0.010, pan=0.0, sec=0.5):
    """a sheet slid across the table: a soft, short brush of paper on wood, and its small stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2 * np.exp(-x / sec), s, g * FX, pan)
    s_knock(s + sec * 0.85, g * 0.4 * FX, pan, 300)
def stamp(s, g=0.016, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.009, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.011, pan=0.0):
    """a choice made on screen: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def seal(s, g=0.013, pan=0.0):
    """a seal pressed into warm wax: a soft, low press, and the wax giving under it"""
    s_knock(s, g * FX, pan, 150); x = tt(0.16)
    X(filt(noise(0.16), 'band', (250, 1100))[:len(x)] * np.sin(np.pi * np.minimum(1, x / 0.16)) * np.exp(-x / 0.06), s + 0.01, g * 0.5 * FX, pan)
def quill(s, sec=1.0, g=0.006, pan=0.0):
    """a quill writing: a dry, light scratch, stroke by stroke, played as one sound"""
    x = tt(sec); n = len(x); k = np.zeros(n, np.float32); t = 0.0
    while t < sec - 0.05:
        d = R1.uniform(0.08, 0.16); a_, b_ = int(t * SR), min(n, int((t + d) * SR))
        if b_ > a_:
            k[a_:b_] = np.sin(np.pi * np.linspace(0, 1, b_ - a_)) ** 1.5 * R1.uniform(0.6, 1.0)
        t += d + R1.uniform(0.02, 0.06)
    X(filt(noise(sec), 'band', (1100, 2300))[:n] * k * np.minimum(1, np.minimum(x, sec - x) / 0.05), s, g * FX, pan)
def coin(s, g=0.009, pan=0.0):
    """a penny set down on wood: a dull, short clink, and the wood under it"""
    x = tt(0.25).astype(np.float64)
    c = sum(a_ * np.sin(2 * np.pi * f * x + p) * np.exp(-x / d) for f, a_, d, p in ((1240, 1.0, 0.045, 0.3), (1810, 0.5, 0.03, 1.1), (2260, 0.25, 0.02, 2.0)))
    X(filt(norm((c * np.minimum(1, x / 0.002)).astype(np.float32)), 'low', 2400), s, g * FX, pan); s_knock(s, g * 0.7 * FX, pan, 380)
def pile(s, sec=1.4, g=0.008, pan=0.0):
    """letters piling up on the counter: one soft rustle that grows and settles, never a letter at a time"""
    x = tt(sec); e = np.sin(0.5 * np.pi * np.minimum(1, x / (0.7 * sec))) ** 2 * np.cos(0.5 * np.pi * np.clip((x - 0.7 * sec) / (0.3 * sec), 0, 1)) ** 2
    X(filt(noise(sec), 'band', (220, 1500))[:len(x)] * e, s, g * FX, pan)

# =============================================================================================================================
# 1. A name that travels free: the opening, with music all through it.
#    Britain in the 1700s: the home chord, B flat, the gemshorn's low B flat under the kit. A letter sealed (the seal), turned over
#    (a flick), its charge written (the quill); the kit a step up for each thing it costs more for. A member of parliament: the
#    gemshorn's F, open. He signs the cover: the quill, and the gemshorn plays the person's phrase, his name. Whoever holds it can use
#    his privilege: G minor. Family and friends: the kit, gently. Blank covers given away (three sheets), sold (a penny), signatures
#    copied: the kit plays the start of his phrase, in another hand. The post carries free letters (the pile); everyone else pays
#    dearly: the kit falls, B flat to G. Nobody can tell who sent it: the gemshorn's low G. Rules to narrow it: the kit's D, the quill
#    for the address and the date. Seven million a year still free: the pile, G minor. Something had to change: E flat. Rowland Hill's
#    pamphlet slides in; a cheap post: the kit's F; Parliament agrees: a person decides, B flat to F. The penny post: B-flat major,
#    the notice pinned. Franking ends: a knock. Letters more than double: the piles, and the kit rising, D to B flat. Every letter pays
#    its own way: the penny, the PAID stamp, B flat. Today: Jun's helper on his sign-in; with everything Jun may do, the kit plays the
#    person's phrase whole; narrowed, in a sandbox, again on its open strings only. A name of its own: the kit's B flat, alone. The
#    title card: the home chord
F = lambda lid, word, off=0: W('frank', lid, word, off)
f0 = S0('frank')
gem(Bb2, f0 + 0.4, f0 + 2.8, 0.75, att=0.6, rel=0.5)
kit((D4, F4), f0 + 0.5, f0 + 2.6, 0.7, att=0.4)
knock(G('frank', 'folded', 0.05), 0.010, px(540), 260)
seal(F('folded', 'sealed', -0.15), 0.013, px(1300))
flick(F('folded', 'the person', -0.55), 0.010, px(1300))
quill(F('folded', 'pays', 0.0), 0.9, 0.006, px(1560))
kit(D4, F('costs', 'further', 0.0), F('costs', 'further', 1.0), 0.55)
kit(F4, F('costs', 'more sheets', 0.0), F('costs', 'more sheets', 1.1), 0.55)
# a member of parliament may send his letters free: the gemshorn's F, open
gem(F3, F('member', 'free', -0.35), F('member', 'free', 1.3), 0.6, att=0.3, rel=0.3)
# he signs the cover: the quill, and his phrase on the gemshorn as his name goes on it
quill(F('frank', 'his name', -0.2), 1.4, 0.006, px(1300))
gphrase(tuple(m - 12 for m in PHRASE), F('frank', 'his name', -0.1), 0.34, 1.3, 0.85)
# whoever holds a cover he has signed can use his privilege: G minor, as the amber card springs in
gem(G2, G('frank', 'holds', 0.1), G('frank', 'holds', 2.0), 0.7, att=0.35, rel=0.4)
kit((Bb3, D4), G('frank', 'holds', 0.15), G('frank', 'holds', 1.8), 0.55, att=0.25)
# members sign covers for family and friends: the kit, gently
kit(F4, G('frank', 'family', 0.3), G('frank', 'family', 1.2), 0.45); kit(D4, G('frank', 'family', 0.75), G('frank', 'family', 1.9), 0.45)
# signed blank covers given away (each sheet laid down), even sold (a penny), signatures copied: the start of his phrase, in another hand
for i in range(3):
    paper(G('frank', 'blank', 0.2 + 0.35 * i), 0.009, px((280, 700, 1120)[i] + 260), 0.3)
coin(F('blank', 'sold', 0.0), 0.009, px(1000))
paper(F('blank', 'copied', -0.2), 0.009, px(1460), 0.3)
phrase(PHRASE[:3], F('blank', 'copied', -0.1), 0.32, 0.8, 0.6)
# the post carries free letters no member ever sent (the pile grows); everyone else pays dearly: the kit falls, B flat, A, G
pile(G('frank', 'carries', 0.0), 1.6, 0.008, px(1250))
pile(F('carries', 'pays dearly', -0.3), 0.9, 0.006, px(1560))
phrase((Bb3, 57, G3), F('carries', 'pays dearly', -0.25), 0.34, 1.0, 0.6, pan=px(1560) * 0.4)
# nobody can tell who really sent it: the gemshorn's low G as the card comes
gem(G2, F('tell', 'who really sent', -0.15), F('tell', 'who really sent', 2.3), 0.7, att=0.5, rel=0.5)
# rules to narrow it: the kit's D; the address written in his own hand, then the town and the date
kit(D4, G('frank', 'rules', 0.1), G('frank', 'rules', 1.2), 0.5)
quill(F('y1764', 'the whole address', -0.2), 2.2, 0.006, px(1200))
quill(F('y1784', 'the town', 0.0), 1.8, 0.006, px(1450))
for w_ in ('the day in words', 'posted that same day'):
    tap(F('y1784', w_, 0.0), 0.007, px(560))
# still, about seven million letters a year travel free: the pile grows again, and G minor under the amber card
pile(G('frank', 'gap', 0.0), 1.4, 0.008, px(1250))
gem(G2, F('gap', 'seven million', -0.3), F('gap', 'seven million', 1.6), 0.65, att=0.4, rel=0.4)
kit(D4, F('gap', 'seven million', -0.25), F('gap', 'seven million', 0.4), 0.5); kit(Bb3, F('gap', 'seven million', 0.45), F('gap', 'seven million', 1.5), 0.5)
# something had to change: E-flat major as the camera moves in
gem(Bb2, G('frank', 'change', 0.05), G('frank', 'change', 2.1), 0.7, att=0.4, rel=0.4)
kit((Eb4, G4), G('frank', 'change', 0.1), G('frank', 'change', 1.9), 0.55, att=0.3)
# Rowland Hill's pamphlet slides in; a cheap post, paid by its sender: the kit's F; Parliament agrees: a person decides
slide(G('frank', 'hill', 0.15), 0.010, px(1240), 0.6)
kit(F4, F('hill', 'a cheap post', -0.3), F('hill', 'a cheap post', 1.1), 0.55)
decide(G('frank', 'parl', 0.05), 0.85, 1.2)
# the penny post begins: the notice pinned, and B-flat major as its lines come; franking ends, a knock
knock(G('frank', 'penny', 0.1), 0.012, px(1375), 220)
gem(Bb2, F('penny', 'the penny post', -0.2), F('penny', 'the penny post', 2.4), 0.75, att=0.35, rel=0.5)
kit((F4, Bb4), F('penny', 'the penny post', -0.15), F('penny', 'the penny post', 2.1), 0.6, att=0.3)
knock(G('frank', 'ends', 0.05), 0.012, px(1375), 240)
# in a year, letters more than double: 1839's pile and 1840's, and the kit rising, D to B flat
pile(F('double', 'seventy-six', -0.3), 0.9, 0.007, px(1250))
pile(F('double', 'a hundred and seventy', -0.3), 1.2, 0.008, px(1560))
kit(D4, F('double', 'seventy-six', -0.2), F('double', 'seventy-six', 0.8), 0.5)
kit(Bb4, F('double', 'a hundred and seventy', -0.2), F('double', 'a hundred and seventy', 1.1), 0.5)
# a letter is cheap for everyone, and every letter pays its own way: the penny, the PAID stamp, and B flat
coin(G('frank', 'own', 0.3), 0.009, px(820))
stamp(F('own', 'every letter', -0.1), 0.015, px(1300))
gem(D3, F('own', 'every letter', -0.05), F('own', 'every letter', 1.6), 0.6, att=0.3, rel=0.4)
kit((Bb3, F4), F('own', 'every letter', 0.0), F('own', 'every letter', 1.5), 0.55, att=0.25)
# today, at the university: Jun's helper on his sign-in (its glow); with everything Jun may do, the kit plays the person's phrase whole
air(G('frank', 'uni', 0.3), 0.9, 0.007, px(250), 180, 900)
tap(F('uni', 'his sign-in', 0.0), 0.008, px(250))
phrase(PHRASE, F('uni', 'everything', 0.0), 0.36, 1.2, 0.75, pan=-0.1)
# narrowed, those borrowed rights let it learn, safely, in a sandbox: the same tune on the kit's open strings only; the sandbox, a draft
narrow(G('frank', 'learn', 0.6), 0.75, pan=-0.1)
air(F('learn', 'in a sandbox', -0.3), 0.8, 0.007, px(1630), 160, 800); knock(F('learn', 'in a sandbox', 0.2), 0.010, px(1630), 220)
paper(F('learn', 'in a sandbox', 0.4), 0.008, px(1630), 0.3)
# once it works for the team, it needs a name of its own: the planning agent comes; the kit's B flat, alone
knock(G('frank', 'name', 0.2), 0.010, px(1640), 260)
kit(Bb4, F('name', 'a name of its own', 0.0), F('name', 'a name of its own', 1.3), 0.5)
# the title card: the home chord, B flat, the gemshorn's low B flat under the kit
tT = G('frank', 'breath', 0.25)
gem(Bb2, tT, tT + 2.8, 0.75, att=0.6, rel=0.6)
kit((D4, F4), tT + 0.1, tT + 2.5, 0.65, att=0.45)

# 2. Where everyone starts: the gemshorn's B flat, and the kit comes in on the same note, as the card says a helper starts on its
#    person's sign-in; Planning's tickets laid down; the five stages spring in as one soft sound; the first three stages, a kit note
#    rising for each (B flat, D, F); the sign-in stays Jun's: the gemshorn's B flat
St = lambda lid, word, off=0: W('start', lid, word, off)
gem(Bb2, G('start', 'every', 0.25), G('start', 'every', 1.9), 0.6, att=0.35, rel=0.4)
kit(Bb3, G('start', 'every', 0.45), G('start', 'every', 1.8), 0.5)
knock(G('start', 'every', 0.2), 0.010, px(960), 240)
tap(St('quick', 'nothing to set up', 0.0), 0.008, px(700)); tap(St('quick', 'whatever', 0.0), 0.008, px(700))
for i, w_ in enumerate(('a new column', 'a filter', 'a new mart')):
    knock(St('tickets', w_, -0.2), 0.010, px(825 + 400 * i), 250)
air(G('start', 'three', 0.2), 1.1, 0.007, px(1260), 180, 900); knock(G('start', 'three', 0.2), 0.010, px(1260), 230)
tap(G('start', 'three', 1.4), 0.007, px(1100))
for lid, m in (('s1', Bb3), ('s2', D4), ('s3', F4)):
    kit(m, G('start', lid, 0.15), G('start', lid, 1.25), 0.5, pan=px(1100) * 0.4)
gem(Bb2, St('each', 'The sign-in stays', 0.0), St('each', 'The sign-in stays', 1.8), 0.6, att=0.3, rel=0.4)

# 3. Everything Jun can do: his rights, a row at a time; on his sign-in, all of it at every stage: the kit plays the person's phrase
#    whole. Friday: the page turns; Planning's ticket and the workload agent's pull request laid down, and the line from one to the
#    other; the workload agent comes (it has a name of its own: no music for it). The helper's next step, approve it as Jun Park: G
#    minor. The 38th step: the prompts stack, one soft sound. He says no: a click, and the gemshorn's B flat. On Monday he reviews it;
#    Noor approves it for production: a person decides. Had Jun said yes: the gemshorn's low G under the record that would have been
Wd = lambda lid, word, off=0: W('wide', lid, word, off)
knock(G('wide', 'wide', -0.2), 0.010, px(940), 240)
for w_ in ('he builds', 'reviews', 'approves'):
    tap(Wd('wide', w_, 0.0), 0.007, px(700))
phrase(PHRASE, Wd('all', 'at every stage', -0.2), 0.36, 1.2, 0.7, pan=-0.1)
flick(G('wide', 'friday', 0.0), 0.009, px(800))
paper(G('wide', 'ticket', 0.0), 0.010, px(920), 0.35); tap(Wd('ticket', "Monday's board", -0.2), 0.007, px(760))
paper(G('wide', 'waits', 0.0), 0.010, px(1540), 0.35); tap(G('wide', 'waits', 0.4), 0.007, px(1220))
air(G('wide', 'whose', 0.0), 0.9, 0.007, px(1700), 180, 900); knock(G('wide', 'whose', 0.3), 0.010, px(1700), 260)
tap(Wd('whose', 'proposed', 0.0), 0.007, px(1700))
tap(G('wide', 'review', 0.0), 0.007, px(1540)); tap(Wd('review', 'its checks', 0.0), 0.007, px(1540))
paper(G('wide', 'next', -0.1), 0.009, px(920), 0.3)
gem(G2, G('wide', 'next', 0.0), G('wide', 'next', 2.3), 0.7, att=0.35, rel=0.4)
kit((Bb3, D4), G('wide', 'next', 0.05), G('wide', 'next', 2.1), 0.55, att=0.3)
air(G('wide', 'step', 0.2), 1.2, 0.006, px(920), 300, 1400)
click(Wd('no', 'says no', 0.0), 0.011, px(1100))
gem(Bb2, Wd('no', 'says no', 0.05), Wd('no', 'says no', 1.6), 0.65, att=0.12, rel=0.3)
tap(G('wide', 'monday', 0.3), 0.007, px(1540))
decide(Wd('monday', 'Noor approves', 0.0), 0.8, 1.3, pan=px(1540) * 0.3)
tap(G('wide', 'nobody', 0.0), 0.007, px(800)); tap(Wd('nobody', 'the helper was finishing', 0.0), 0.007, px(800))
paper(Wd('record', 'approved by Jun Park', -0.4), 0.008, px(960), 0.35)
gem(G2, Wd('record', 'approved by Jun Park', -0.35), Wd('record', 'approved by Jun Park', 1.6), 0.55, att=0.5, rel=0.5)

# 4. Who did what?: Jun's log laid down; who really did each step comes in beside it: the kit's A, left open. Anil's old log, and its
#    personal key. Had the helper approved, with a person's name on it: G minor. To every tool it is Jun: the three tools set down. A
#    confused deputy: the doc, and the kit falls a step, B flat to A. In the wrong hands: the kit's low A. Words hidden in a ticket, a
#    stolen sign-in, faster: the ticket laid down, a tap for each. Excessive agency: the kit falls a step from the top, B flat to A
Wh = lambda lid, word, off=0: W('who', lid, word, off)
paper(G('who', 'reads', 0.0), 0.010, px(1050), 0.4)
kit(A4, Wh('log', 'his helper did', -0.25), Wh('log', 'his helper did', 1.0), 0.5)
paper(G('who', 'anil', 0.1), 0.010, px(1050), 0.4); tap(G('who', 'anil', 0.6), 0.007, px(800)); tap(Wh('anil', "couldn't tell", -0.3), 0.007, px(1300))
knock(G('who', 'agent', 0.0), 0.010, px(1050), 240)
for w_ in ('approved by an agent',):
    tap(Wh('agent', w_, 0.0), 0.007, px(800))
gem(G2, Wh('agent', "a person's name", 0.0), Wh('agent', "a person's name", 2.0), 0.65, att=0.3, rel=0.4)
kit(D4, Wh('agent', "a person's name", 0.05), Wh('agent', "a person's name", 1.7), 0.5)
for i in range(3):
    knock(G('who', 'stop', 0.15 * i), 0.009, px(775 + 290 * i), 250)
tap(G('who', 'stop', 0.6), 0.007, px(800)); tap(G('who', 'stop', 1.4), 0.007, px(800))
paper(G('who', 'deputy', 0.0), 0.010, px(1050), 0.4)
kit(Bb3, G('who', 'deputy', 0.2), G('who', 'deputy', 0.75), 0.5); kit(57, G('who', 'deputy', 0.8), G('who', 'deputy', 2.0), 0.5)
tap(G('who', 'purpose', 0.0), 0.007, px(800)); tap(Wh('purpose', 'for a purpose', 0.0), 0.007, px(800))
kit(57, G('who', 'hands', 0.05), G('who', 'hands', 1.6), 0.5, pan=-0.05)
paper(Wh('steer', 'Words hidden', -0.2), 0.009, px(990), 0.35); tap(Wh('steer', 'Words hidden', 0.4), 0.007, px(990))
tap(Wh('steer', 'a stolen sign-in', 0.0), 0.007, px(1520)); tap(Wh('steer', 'faster', 0.0), 0.007, px(1520))
paper(G('who', 'experts', 0.0), 0.010, px(1050), 0.4)
kit(Bb4, G('who', 'experts', 0.15), G('who', 'experts', 0.7), 0.45); kit(A4, G('who', 'experts', 0.75), G('who', 'experts', 1.9), 0.45)

# 5. Narrowed: Saltzer and Schroeder's page laid down; the fewest rights the job needs: B-flat major, the gemshorn under the kit. From
#    Monday, Jun and Sam narrow what the helper borrows: a person decides. The development workspace, its tools that only read; none of
#    them writes, approves, merges or grants: a tap for each. Its sandbox: the person's phrase on the kit's open strings only, as the
#    sandbox comes; the draft flies into it; its branch. Samples with names masked: a lock. What stays Jun's: the gemshorn's B flat,
#    and a lock for each. The page for agents: laid down, its lines typed
Nw = lambda lid, word, off=0: W('narrow', lid, word, off)
paper(G('narrow', 'least', 0.6), 0.010, px(1050), 0.4)
tap(G('narrow', 'fewest', 0.0), 0.007, px(900))
gem(Bb2, Nw('fewest', 'the fewest rights', -0.2), Nw('fewest', 'the fewest rights', 1.7), 0.6, att=0.35, rel=0.4)
kit((D4, F4), Nw('fewest', 'the fewest rights', -0.15), Nw('fewest', 'the fewest rights', 1.5), 0.5, att=0.3)
flick(G('narrow', 'monday', 0.0), 0.009, px(800))
decide(Nw('monday', 'Jun and Sam', 0.0), 0.8, 1.2, pan=px(1690) * 0.3)
knock(G('narrow', 'dev', 0.0), 0.010, px(1070), 240)
for i in range(3):
    tap(Nw('dev', 'with tools', 0.15 * i), 0.007, px(794 + 272 * i))
lock(Nw('dev', 'with tools', 0.6), 0.008, px(1070))
tap(G('narrow', 'none', 0.2), 0.007, px(700))
for w_ in ('approves', 'merges', 'grants'):
    tap(Nw('none', w_, 0.0), 0.007, px(700))
air(G('narrow', 'sandbox', 0.0), 0.8, 0.007, px(1270), 160, 800); knock(G('narrow', 'sandbox', 0.4), 0.010, px(1270), 220)
narrow(G('narrow', 'sandbox', 0.2), 0.7, pan=-0.1)
air(Nw('sandbox', 'a schema', -0.6), 1.1, 0.006, px(700), 200, 1000); paper(Nw('sandbox', 'a schema', 0.5), 0.008, px(1100), 0.3)
paper(Nw('sandbox', 'a branch', 0.0), 0.008, px(1400), 0.3)
paper(G('narrow', 'samples', 0.0), 0.009, px(950), 0.35); lock(Nw('samples', 'names masked', 0.0), 0.008, px(950))
gem(Bb2, G('narrow', 'stays', 0.1), G('narrow', 'stays', 1.9), 0.6, att=0.3, rel=0.4)
for w_ in ('approve,', 'merge', 'change production', 'an approved test', 'grant a right'):
    lock(Nw('stays', w_, 0.0), 0.007, px(700))
paper(G('narrow', 'page', 0.0), 0.010, px(1070), 0.4)
keys(Nw('page', 'every helper', -0.2), 4, 0.007, px(1000), 0.55)
kit((Bb3, F4), Nw('page', 'every helper', 0.0), Nw('page', 'every helper', 1.6), 0.45, att=0.3)

# 6. Allowed, then checked: at the second stage, Jun allows the step: a click, and the gemshorn's D. A helper's own setting: its card,
#    the choice made. A productivity feature, not a security boundary: the maker's words laid down, the gemshorn's low G under the
#    kit's B flat. The boundary is in its tools: a lock, the tools set down, and B flat. At the third: the plan, set before it starts;
#    allowed and blocked written on it; its result, with its evidence. Jun checks it; Noor approves production: a person decides. Jun
#    owns his helper's work: the gemshorn's B flat. An agent never approves: the page, and a tap for each "no"
Ch = lambda lid, word, off=0: W('checked', lid, word, off)
tap(G('checked', 'allow', 0.0), 0.007, px(760)); paper(G('checked', 'allow', 0.2), 0.009, px(920), 0.3)
click(Ch('allow', 'allows', 0.0), 0.011, px(1060))
gem(D3, Ch('allow', 'allows', 0.05), Ch('allow', 'allows', 1.4), 0.6, att=0.15, rel=0.3)
knock(G('checked', 'setting', 0.0), 0.010, px(1540), 240); tap(Ch('setting', 'go on without asking', 0.1), 0.008, px(1540))
paper(G('checked', 'boundary', 0.0), 0.009, px(1540), 0.35)
gem(G2, G('checked', 'boundary', 0.15), G('checked', 'boundary', 2.0), 0.6, att=0.4, rel=0.4)
kit(Bb3, G('checked', 'boundary', 0.2), G('checked', 'boundary', 1.8), 0.45)
lock(G('checked', 'now', 0.0), 0.009, px(800))
for i in range(2):
    knock(G('checked', 'now', 0.3 + 0.15 * i), 0.009, px(775 + 290 * i), 250)
knock(G('checked', 'now', 0.6), 0.009, px(1370), 230)
kit((Bb3, F4), G('checked', 'now', 0.1), G('checked', 'now', 1.7), 0.5, att=0.3)
tap(Ch('now', 'a read', 0.0), 0.007, px(800)); tap(Ch('now', 'a draft', 0.0), 0.007, px(1370))
tap(G('checked', 'third', 0.0), 0.007, px(760)); paper(G('checked', 'third', 0.3), 0.009, px(960), 0.35)
tap(Ch('third', 'within a plan', 0.0), 0.007, px(800))
tap(G('checked', 'written', 0.2), 0.007, px(800)); tap(Ch('written', 'blocked', 0.0), 0.007, px(800))
paper(Ch('written', 'its evidence', -0.4), 0.009, px(1570), 0.35); click(Ch('written', 'its evidence', 0.2), 0.010, px(1570))
tap(G('checked', 'against', 0.2), 0.007, px(800))
decide(Ch('against', 'Noor approves', 0.0), 0.8, 1.3, pan=-0.05)
gem(Bb2, G('checked', 'answers', 0.1), G('checked', 'answers', 1.7), 0.55, att=0.3, rel=0.4)
knock(G('checked', 'never', 0.0), 0.010, px(1050), 240)
tap(Ch('never', 'not its own', 0.0), 0.007, px(800)); tap(Ch('never', "another agent's", 0.0), 0.007, px(800))

# 7. For learning, in a sandbox: Lucía joins Planning: the gemshorn's D, a person new to the team. Her rights, which are few: their
#    card; names masked and nothing written to production: a lock each. In its sandbox it helps her learn: the sandbox, and her drafts
#    laid in it. Borrowed rights are for learning, in a sandbox: the person's phrase on the kit's open strings only.
#    The opening's cover, framed: narrowed in 1764 and 1784, but who really sent it: the gemshorn's low G. Every letter paying its own
#    way: the PAID stamp, B-flat major. A helper for the team needs a name of its own: the planning agent comes, and the kit's B flat,
#    alone. Planning's tickets fly to it; Clara Jensen owns it: a person decides. Its place on the university's map: drawn in, no
#    music. The end card: the mark, the person's phrase whole on the gemshorn, then on the kit's open strings only
Le = lambda lid, word, off=0: W('learning', lid, word, off)
knock(G('learning', 'lucia', 0.3), 0.010, px(950), 240)
gem(D3, G('learning', 'lucia', 0.35), G('learning', 'lucia', 1.8), 0.6, att=0.3, rel=0.4)
tap(Le('hers', 'on her sign-in', -0.2), 0.008, px(250))
knock(G('learning', 'masked', -0.2), 0.009, px(950), 240)
lock(G('learning', 'masked', 0.2), 0.008, px(780)); lock(Le('masked', 'nothing written', 0.0), 0.008, px(1100))
tap(Le('masked', 'from her first day', 0.0), 0.007, px(800))
air(G('learning', 'learns', 0.0), 0.8, 0.007, px(1240), 160, 800); knock(G('learning', 'learns', 0.4), 0.010, px(1240), 220)
paper(G('learning', 'learns', 0.5), 0.008, px(1100), 0.3); paper(G('learning', 'learns', 0.9), 0.008, px(1380), 0.3)
tap(Le('learns', 'every draft waits', 0.0), 0.007, px(800))
knock(G('learning', 'takeaway', 0.0), 0.011, px(1170), 230)
narrow(G('learning', 'takeaway', 0.1), 0.75, pan=-0.05)
knock(G('learning', 'narrowed', 0.1), 0.010, px(980), 220); tap(G('learning', 'narrowed', 0.6), 0.007, px(1500))
gem(G2, Le('narrowed', "but a member's name", 0.0), Le('narrowed', "but a member's name", 2.0), 0.6, att=0.4, rel=0.4)
stamp(G('learning', 'paid', 0.5), 0.014, px(980))
gem(Bb2, G('learning', 'paid', 0.5), G('learning', 'paid', 2.2), 0.6, att=0.3, rel=0.4)
kit((D4, F4), G('learning', 'paid', 0.55), G('learning', 'paid', 2.0), 0.5, att=0.3)
air(G('learning', 'team', 0.0), 0.8, 0.007, px(250), 180, 900); knock(G('learning', 'team', 0.5), 0.010, px(950), 240)
kit(Bb4, Le('team', 'a name of its own', 0.0), Le('team', 'a name of its own', 1.3), 0.45, pan=-0.1)
air(Le('planning', 'the planning agent', 0.2), 1.3, 0.006, px(700), 200, 1000); knock(Le('planning', 'the planning agent', 1.45), 0.009, px(300), 260)
knock(Le('planning', 'the planning agent', 1.2), 0.009, px(950), 240)
decide(Le('planning', 'Clara Jensen', -0.1), 0.8, 1.3, pan=-0.2)
knock(Le('map', 'a place', -0.2), 0.010, px(1490), 240); air(Le('map', 'a place', 0.0), 1.6, 0.006, px(1490), 200, 1000)
tap(Le('map', 'like every colleague', 0.0), 0.007, px(1490))
# the end card: the person's phrase whole on the gemshorn, then again on the kit's open strings only; nothing rings past the end
# (the mix fades the last 3.5 s, so the mark starts as the card comes and the kit's last notes ring into that fade)
tE = G('learning', 'breath', -0.2)
gphrase(tuple(m - 12 for m in PHRASE), tE, 0.28, 0.8, 0.85)
narrow(tE + 1.8, 0.75, pan=-0.05)
