# Power you switch on: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette this film reserved in the module's list (/mnt/project-files/data-protection/palettes.md, 5 November 2026), in no other
# score: a diaphone, the fog signal of lighthouses, and a square piano of the 1870s, both made here (music.py has neither).
#  - The diaphone is Hope-Jones's valve, made a fog signal by Northey in Toronto in 1903: air drives a piston in a slotted cylinder, so
#    its note is a reed's, rich and buzzing, with its horn's warmth near 400 Hz. Here it is played softly and low (G2 and D3), its buzz
#    kept under 2.5 kHz, one voice, at one pitch, with no vibrato, and never under the voice. It is the mark of a power switched on: one
#    note swells in as the power comes on, is held a moment in a pause without words, and falls as the power goes off, in the
#    diaphone's own short grunt, its air running down. It sounds four times: under the title, at the two switch-ons the film follows (in
#    the beat after the other specialist's yes), and after the last line, as Jun's power is switched on for a task and off again.
#  - The square piano is a parlour's piano of the 1870s, small and soft, in its middle and low range: thin strings, soft hammers, a short
#    ring. It plays the opening: a house's tune at night, broken off when the robbers come (the Delands' house in May 1875 has the same
#    tune); then the chapters' turns. It is dry and short, its dampers down, except while a power is switched on, when its pedal lets
#    the notes ring; the same chord, rung and then dry, tells a power on and then off.
#  - The one urgent pulse is the robbers' (film.json lists "taken" in "urgent"): their steps as their lanterns come down the street, a
#    low, dry E on the square piano on each step, on while the family is held and the vault opened, until something has to change.
#  - Keys, all tuned pure (just intonation from G, see hz()): G major and its chords that are pure here (G, C, D, E minor and B minor; A
#    minor isn't, so A is never held with E), E minor for the danger.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story (film.json's "story": the robbers and the time lock), and after it only at a
#    chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice.
#  - Nothing trembles or pulses (no tremolo, no vibrato) except the robbers' steps; the diaphone's fall is the one slide, as its air runs
#    out, and nothing else sounds while it falls.
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: paper as a card or a badge is laid down, a soft knock as a pill or a tag
#    lands, a tap as a tick lights or a slot of the dial fills, a breath of air as a line is drawn or something passes, a low thud as a
#    lock shows or a bolt holds, the bolts sliding back, a small tick from the clock in a time lock, a soft bell for the alert, and a low
#    click for a power switched on or off under the voice.
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
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1903)  # this film's own randomness: the room

# ---- tuning: just intonation from G, so the notes of a chord are whole-number ratios of each other and nothing beats. G major (G B D),
# C major (C E G), D major (D F# A), E minor (E G B) and B minor (B D F#) are pure here; A minor (A C E) isn't, so A is never held with E
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (43, 98.0)  # G 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
B1, E2, Fs2, G2, A2, B2, C3, D3, E3, Fs3, G3, A3, B3, C4, D4, E4, Fs4, G4, A4, B4 = 35, 40, 42, 43, 45, 47, 48, 50, 52, 54, 55, 57, 59, 60, 62, 64, 66, 67, 69, 71

# ---- the levels: the square piano about as far under the voice as the module's other music (matched by loudness, not by peak), the
# diaphone a little under it, as its buzz carries; the effects about 12 dB under the music (FX scales them all)
SL, DL, FX = 0.085, 0.05, 1.4

# a small room round the players, ringing on for about a second and a quarter, and nothing much above 1.5 kHz. Its level is set by
# what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one, so `room` is its share), and a held note is set back to
# the level it had before the room (_held), so the room colours a note but never moves it
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.3)).astype(np.float32))(np.arange(int(1.3 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.02 * SR)] = 0; _IR /= _band(_IR)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
_HOP = SR // 100
def _frames(s):
    """a sound's energy in each 10 ms frame"""
    n = len(s) // _HOP
    return (s[:n * _HOP].astype(np.float64).reshape(n, _HOP) ** 2).sum(1)
def _body(e):
    """where a note is held, as the held-note check finds it: the frames within 3 dB of its own level after its first quarter second,
    smoothed over a tenth of a second, half a second of them or more; None for a note that isn't held"""
    if len(e) < 75:
        return None
    lv = np.convolve(e, np.ones(10) / 10, 'same')[25:]
    if lv.max() <= 0:
        return None
    on = np.nonzero(lv >= lv.max() * 10 ** -0.3)[0] + 25
    return on if len(on) >= 50 else None
def _held(s, room):
    """a note in the room, at its own level: where it is held, set back to the level it had before the room. A note that isn't held
    (a short one, or one that dies away at once) just goes into the room"""
    r = _room(s, room); on = _body(_frames(s)) if room else None
    if on is None:
        return r
    e0, e1 = _frames(s), _frames(r)
    return r * float(np.sqrt(e0[on].sum() / max(1e-12, e1[on].sum())))

# ---- the square piano: one string to a note here (no second string a little apart, so nothing beats), its partials whole multiples of
# the note, the soft hammer's roll-off (little above 1.5 kHz, less still when it's struck softly), the small soundboard's nasal hump
# near 700 Hz and a thin bass; a quick first decay and a short ring after it, shorter the higher the note. When its key is let go, its
# damper stops it within a tenth of a second; with the pedal down, it rings on until the pedal lifts
def _string(f, key, vel, ring=None):
    """one string at f Hz, struck at vel (0 to 1), its key held key seconds; ring: seconds until the pedal lifts (None: dry)"""
    end = key if ring is None else max(key, ring)
    n = int((end + 0.25) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    fc = 650 + 1000 * vel
    for k in range(1, 30):
        fk = f * k
        if fk > 2300:
            break
        a = k ** -1.1 / (1 + (fk / fc) ** 2) * (1 + 0.5 * np.exp(-((fk - 700) / 300) ** 2))
        if k == 1:
            a *= min(1.0, 0.45 + f / 300)
        t1 = 0.30 * (220 / f) ** 0.3 / (1 + 0.08 * k)
        t2 = 1.6 * (220 / f) ** 0.4 / (1 + 0.12 * k)
        s += a * (0.6 * np.exp(-x / t1) + 0.4 * np.exp(-x / t2)) * np.sin(2 * np.pi * fk * x + 0.7 * k * k)
    s += 0.05 * vel * np.exp(-x / 0.012) * np.sin(2 * np.pi * 85 * x)          # the hammer's soft knock on the string
    s *= np.minimum(1, x / 0.003) * np.where(x < end, 1.0, np.exp(-(x - end) / 0.05))
    return s

def sq(ms, t0, key=0.45, g=1.0, pan=0.0, vel=0.42, roll=0.0, ring=None, room=0.2):
    """the square piano: the notes ms struck together (a chord; roll spreads them from the lowest, as a hand does) or one note, at t0,
    each key held key seconds and then damped, or, with the pedal down, ringing until ring seconds after t0"""
    ms = sorted(ms) if isinstance(ms, (tuple, list)) else [ms]
    parts = [(roll * i, _string(hz(m), max(0.05, key - roll * i), vel * (1.0 if i in (0, len(ms) - 1) else 0.85),
                                None if ring is None else ring - roll * i)) for i, m in enumerate(ms)]
    out = np.zeros(max(int(d * SR) + len(p) for d, p in parts))
    for d, p in parts:
        i = int(d * SR); out[i:i + len(p)] += p
    s = filt((out / max(1e-9, float(np.abs(out).max()))).astype(np.float32), 'low', 2200)
    put(_held(s, room).astype(np.float32), t0, g * SL, pan)

def tune(notes, t0, beat, g=0.85, pan=0.08, vel=0.42, until=None):
    """a tune on the square piano: (beat, melody, bass, beats) from t0, each key held a little over half its length (dry); a bass note
    sounds under its melody note, softer. Notes from `until` on aren't played: the tune breaks off there"""
    for b, m, lo, n in notes:
        t = t0 + b * beat
        if until is not None and t >= until:
            break
        if m is not None:
            sq(m, t, key=0.62 * n * beat, g=g, pan=pan, vel=vel)
        if lo is not None:
            sq(lo, t, key=0.5 * n * beat, g=g * 0.7, pan=-pan, vel=vel * 0.85)

# ---- the diaphone: a reed's tone, buzzing, its partials falling a little more slowly than 1/k, with the horn's warmth near 400 Hz and
# little above 1.6 kHz; dark while the air comes and as it runs down, its buzz opening at full air. One voice, at one pitch, no vibrato.
# It swells in (att), holds (hold), and when its air is cut, its note falls (drop, a few tones) as the piston slows, over fall seconds
def dia(m, t0, hold, g=1.0, pan=0.0, att=0.5, fall=0.5, drop=0.76, room=0.22):
    f0 = hz(m); tf = att + hold; n = int((tf + fall + 0.1) * SR); x = np.arange(n, dtype=np.float64) / SR
    u = np.clip((x - tf) / fall, 0, 1)
    f = f0 * (1 - (1 - drop) * u ** 1.2)                                       # the fall, quickening as the piston slows
    ph = 2 * np.pi * np.cumsum(f) / SR
    air = np.where(x < att, np.sin(0.5 * np.pi * x / att) ** 2, 1.0) * (1 - u)   # the air: swells in, holds, runs down
    b = air ** 0.8                                                             # its buzz opens with the air and closes as it goes
    s = np.zeros(n)
    for k in range(1, 40):
        fk = f0 * k
        if fk > 2400:
            break
        bright = k ** -0.85 * (1 + 1.1 * np.exp(-((fk - 390) / 210) ** 2)) / (1 + (fk / 1500) ** 3)
        s += ((1 - b) * k ** -2.2 + b * bright) * np.sin(k * ph + 0.9 * k)
    s *= air
    # the air itself, softly: as it comes, and as it runs out (its own seed, so the note sounds the same each time it's made)
    breath = np.sin(np.pi * np.clip(x / att, 0, 1)) * (x < att) + np.sin(np.pi * u) * (u > 0)
    s += 0.025 * float(np.abs(s).max()) * filt(np.random.default_rng(int(t0 * 100)).standard_normal(n).astype(np.float32), 'band', (150, 700)) * breath
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2400)
    put(_held(s, room).astype(np.float32), t0, g * DL, pan)

# ---- soft sounds, all low-passed
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a pill or a tag landing"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.011, pan=0.0):
    """a muffled key, a light click: a tick lighting, a slot of the dial filling"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.014, pan=0.0, sec=0.45):
    """a card or a badge laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=1.0, g=0.009, pan=0.0, lo=140, hi=900):
    """something passing: a line drawn, a lantern going by, a slip moving: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def thud(s, g=0.02, pan=0.0):
    """a lock shown, a bolt that holds, a door shut: a low, soft thud"""
    s_knock(s, g * FX, pan, 78)
def bolts(s, sec=1.2, g=0.007, pan=0.0):
    """a vault's bolts sliding back: a low scrape that swells and stops, and the bolts home"""
    x = tt(sec); X(filt(noise(sec), 'band', (110, 520))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
    s_knock(s + sec - 0.08, g * 1.8 * FX, pan, 92)
def tick(s, g=0.0055, pan=0.0):
    """the clock in a time lock: a small, soft tick"""
    s_knock(s, g * FX, pan, 1250)
def bell(s, g=0.0085, pan=0.0, f=587.0):
    """the platform team's alert: a small soft bell, struck once, its partials under 2.5 kHz"""
    x = tt(1.8); sig = np.zeros(len(x))
    for r, a, d in ((1.0, 1.0, 0.8), (2.0, 0.3, 0.45), (2.76, 0.22, 0.3), (3.9, 0.07, 0.2)):
        if f * r < 2400:
            sig += a * np.exp(-x / d) * np.sin(2 * np.pi * f * r * x)
    X(filt(norm((sig * np.minimum(1, x / 0.003)).astype(np.float32)), 'low', 2200), s, g * FX, pan)
def switch(s, g=0.010, pan=0.0):
    """a power switched on or off under the voice: a soft, low click"""
    s_knock(s, g * FX, pan, 165); tap(s + 0.012, g * 0.45, pan)
def slots(t0, n=3, step=0.8, g=0.009, pan=0.0):
    """a dial's numbers going in: a tap as each of its slots fills, step seconds apart from t0"""
    for i in range(n):
        tap(t0 + i * step, g, pan)

# the house's tune at night, in G: a parlour song's line, the bass under it (beat, melody, bass, beats). The robbers' chapter plays it
# whole; the Delands' house in May 1875, and the way back to them at the end, play its start
HOUSE = [(0, D4, None, 1),
         (1, G4, G2, 2), (3, Fs4, None, 1), (4, E4, E2, 1), (5, D4, None, 1), (6, B3, None, 1),
         (7, C4, C3, 2), (9, B3, None, 1), (10, A3, D3, 2), (12, D4, None, 1),
         (13, G4, G2, 2), (15, Fs4, None, 1), (16, E4, C3, 2), (18, D4, None, 1),
         (19, A3, D3, 1), (20, B3, None, 1), (21, A3, None, 1), (22, G3, G2, 3)]

# =============================================================================================================================
# 1. Taken at night, the 1870s: the opening, on the square piano. A small town at night: the house's tune, softly, from a window,
#    under the bank, its vault and the numbers known to a few (the dial's three slots fill, a tap each; "Vault" drawn; "Known to a few").
#    The robbers: the tune breaks off on E minor, and a lantern passes the bank's window. Their lanterns come down the street: the pulse,
#    a low dry E on each step, on while the family is held, he is taken, and the vault opened (the dial's slots, the bolts sliding back,
#    the three pills), and while every banker's house is ringed in danger (E minor), until something has to change (C, then D)
kw = lambda lid, word, off=0: W('taken', lid, word, off)
kc = lambda lid, off=0: G('taken', lid, off)
k0 = S0('taken')
tune(HOUSE, k0 + 0.6, 0.75)
air(kw('vault', 'a strong room', -0.2), 0.6, 0.005, px(830), 200, 900)
T_row = kw('dial', 'a row of numbers')
slots(T_row + 0.7, 3, 0.8, 0.008, px(1240))
paper(kc('few', -0.2), 0.012, px(640))
sq((E2, B2, G3), kc('robbers', -0.25), key=0.6, g=0.72, vel=0.36, roll=0.02)
T_way = kw('robbers', 'a way round')
air(T_way - 0.6, 2.6, 0.005, px(240), 150, 600)
# the robbers' steps: from their lanterns' first step (tHome + 0.4 in src/scenes.js) until something has to change
T_home, T_hold, T_take, T_make = kc('home'), kw('hold', 'hold his family'), kw('hold', 'take him'), kw('hold', 'make him open')
step = lambda t, g, p: sq(E2, t, key=0.16, g=g, pan=p, vel=0.3, room=0.1)
step5 = lambda t, g, p: sq(B1, t, key=0.16, g=g, pan=p, vel=0.3, room=0.1)
pulse(T_home + 0.4, kc('change', 1.0), 100, [(0, step, 0.85, -0.12), (1, step, 0.62, 0.12), (2, step5, 0.75, -0.06), (3, step, 0.62, 0.12)], 1.0, 2.5)
air(T_home + 0.4, 3.6, 0.005, px(1400), 150, 600)
sq((E3, G3, B3), T_hold + 0.2, key=0.4, g=0.5, vel=0.32, pan=-0.05)
air(T_take, 3.6, 0.004, px(900), 150, 600)
slots(T_make + 0.7, 3, 0.8, 0.008, px(1240))
bolts(T_make + 2.4, 1.2, 0.007, px(1240))
for word in ('the right numbers', 'the right man', 'open the door'):
    knock(kw('stop', word, -0.1), 0.013, px(700), 230)
sq((B2, D3, Fs3), kw('stop', 'open the door', 0.15), key=0.45, g=0.55, vel=0.33)
sq((E2, B2, E3, G3), kw('danger', 'in danger', 0.1), key=0.6, g=0.68, vel=0.36, roll=0.025)
sq((C3, E3, G3), kc('change', 0.15), key=0.5, g=0.6, vel=0.34)
sq((D3, Fs3, A3), kc('change', 1.0), key=0.8, g=0.62, vel=0.34)

# 2. A lock with a clock, 1874 and 1875. Rochester: the clock maker's phrase in G, rising, as Sargent works at his bench; the clocks in
#    his lock light (two small ticks); set to the hour (the hands turned, a tap each), "Opens at 9:00". Until that hour (C major): the
#    dial's slots, the bolts that won't move (a thud), "Not before 9:00". The first fitted, in Morrison: G major, rolled. Great Barrington,
#    May 1875: the Delands' house plays the house's tune, broken off as the robbers' lanterns come; the windows go dark (E minor); Fred
#    is taken up the street (B minor, low). His bank: the dial's slots; the bolts won't move (a thud); the time lock shown (two ticks),
#    "Opens at 9:00", fitted on Tuesday: C major; the bonds taken (paper), the robbers flee (a lantern going), and the vault held: D, then
#    G. Now the houses' windows light one by one, a note each, rising; sold in the thousands. The university: the same problem (E minor);
#    the everyday accounts hold the greatest power, every hour of every day, so the pedal is down and the notes ring (G major, then a
#    rising G, B, D); whoever takes one takes all of it (E minor, ringing); great power, shut until it's needed: the last chord's dampers
#    come down as the power goes off. The title: the diaphone's G, swelling in, held, and let fall
cw = lambda lid, word, off=0: W('clock', lid, word, off)
cc = lambda lid, off=0: G('clock', lid, off)
c0 = S0('clock')
tune([(0, B3, G2, 1), (1, D4, None, 1), (2, G4, None, 2), (4, G4, C3, 1), (5, E4, None, 1), (6, Fs4, D3, 2), (8, G4, G2, 3)], c0 + 0.5, 0.7, g=0.8)
T_builds, T_sets = cw('sargent', 'builds clocks'), cw('evening', 'sets the hour')
tick(T_builds + 0.4, 0.0055, px(810)); tick(T_builds + 1.4, 0.0055, px(810))
for i in range(3):
    tap(T_sets + 0.1 + 0.4 * i, 0.007, px(810))
knock(T_sets + 1.25, 0.012, px(1000), 240)
sq((C3, G3, E4), cc('until', -0.2), key=0.5, g=0.58, vel=0.33)
T_noone, T_even = cw('until', 'no one can open'), cw('until', 'even with')
slots(T_noone + 0.75, 3, 0.75, 0.008, px(1240))
thud(T_even, 0.014, px(1240))
knock(T_even + 0.25, 0.012, px(1240), 220)
T_fitted = cw('first', 'the first is fitted')
paper(T_fitted - 0.15, 0.012, px(380), 0.5)
sq((G2, D3, B3, G4), T_fitted, key=0.8, g=0.66, vel=0.38, roll=0.03)
# the Delands' house: its tune, until the robbers' lanterns come (tEight - 1.0)
T_fri, T_eight, T_holdD = cc('friday'), cw('friday', 'eight robbers'), cw('friday', 'hold the Deland family')
tune(HOUSE, T_fri - 0.1, 0.75, g=0.8, until=T_eight - 1.1)
air(T_eight - 1.0, 3.0, 0.005, px(300), 150, 600)
sq((E2, B2, G3), T_holdD + 0.3, key=0.6, g=0.6, vel=0.34, roll=0.02)
T_takeF = cw('fred', 'take Fred Deland')
sq((B1, Fs2, D3), T_takeF + 0.2, key=0.6, g=0.56, vel=0.32)
air(T_takeF, 2.6, 0.004, px(900), 150, 600)
T_turns, T_wont, T_holds = cc('turns'), cw('turns', "won't move"), cc('holds')
slots(T_turns + 0.7, 3, 0.8, 0.008, px(1240))
thud(T_wont - 0.15, 0.014, px(1240))
tick(T_holds + 0.1, 0.0055, px(1240)); tick(T_holds + 1.1, 0.0055, px(1240))
knock(T_holds + 0.35, 0.012, px(1600), 240)
sq((C3, E3, G3), T_holds + 0.2, key=0.5, g=0.56, vel=0.33)
paper(cw('holds', 'put on three days', -0.15), 0.012, px(310), 0.5)
T_bonds, T_fled, T_shut = cw('flee', 'a few bonds'), cw('flee', 'and flee'), cw('flee', 'the vault stays shut')
paper(T_bonds, 0.009, px(300), 0.8)
air(T_fled - 0.2, 1.8, 0.006, px(300), 150, 700)
tap(T_shut + 0.05, 0.01, px(1622)); knock(T_shut + 0.1, 0.011, px(1656), 230)
sq((D3, Fs3, A3), T_shut + 0.2, key=0.5, g=0.58, vel=0.34)
sq((G2, D3, B3, G3), T_shut + 0.95, key=0.9, g=0.62, vel=0.36, roll=0.02)
T_nothing = cc('nothing')
for i, (m, x) in enumerate(((G3, 250), (B3, 780), (D4, 1290), (G4, 1750))):
    sq(m, T_nothing + 0.6 + 0.4 * i, key=0.3, g=0.58, vel=0.36, pan=px(x))
T_thou = cw('sells', 'in the thousands')
paper(T_thou - 0.25, 0.012, px(1490), 0.5)
sq((E3, G3, C4), T_thou, key=0.5, g=0.54, vel=0.33)
sq((E2, B2, G3), cc('same', -0.3), key=0.6, g=0.58, vel=0.33, roll=0.02)
# the power on in the everyday accounts: the pedal down from "greatest power" until it's shut ("shut until", tShutU + 0.2), the dampers
# then down on whatever still rings
T_great, T_hour, T_who, T_all, T_shutU = cw('accounts', 'greatest power'), cw('accounts', 'every hour'), cc('whoever'), cw('whoever', 'takes all of it'), cw('needs', 'shut until')
P_off = T_shutU + 0.2
sq((G2, D3, B3), T_great - 0.1, key=0.5, g=0.6, vel=0.38, ring=P_off - T_great + 0.1)
air(T_great, 0.8, 0.006, px(1250))
for i, m in enumerate((D4, G4, B4)):
    t_ = T_hour + 0.2 + 0.7 * i
    sq(m, t_, key=0.3, g=0.5, vel=0.34, ring=P_off - t_, pan=0.1)
knock(T_who + 0.5, 0.012, px(980), 230)
sq((E2, B2, G3), T_all - 0.1, key=0.5, g=0.58, vel=0.36, ring=P_off - T_all + 0.1, roll=0.02)
T_gp = cw('needs', 'great power')
sq((G2, D3, G3, B3), T_gp, key=0.4, g=0.56, vel=0.35, ring=P_off - T_gp)
# the title, in the quiet after the opening: the diaphone's G
dia(G2, cc('breath', 0.25), 1.7, 1.0, 0.0, att=0.6, fall=0.55)

# 3. Great power: the platform's hall. The catalog comes up (air); Mei's badge; her request's line, and the request reaching it (a tap);
#    the table; the storage; a file, in the clear; the back door (a knock); Walls, doors and keys; the admin settings; a table's history
#    put back (air, as it rewinds); the three powers by them (three knocks); the keepers. Until now: the powers' lines to the everyday
#    accounts; others' badges and theirs; never taken back; their email and every link. The turn: E minor, C, and D, held open
gw = lambda lid, word, off=0: W('great', lid, word, off)
gc = lambda lid, off=0: G('great', lid, off)
g0 = S0('great')
air(g0 + 0.2, 1.0, 0.006, px(1080), 200, 900)
paper(gc('catalog', 0.1), 0.012, px(270))
T_goes, T_req = gw('catalog', 'goes through'), gw('checks', 'every request')
air(T_goes - 0.3, 0.7, 0.005, px(700))
paper(T_goes + 0.25, 0.011, px(1090))
tap(T_req + 1.0, 0.008, px(810))
paper(gc('storage', -0.2), 0.011, px(870))
tap(gw('clear', 'no mask', -0.3), 0.008, px(900))
T_name = gw('clear', 'every name')
air(T_name - 0.3, 0.6, 0.005, px(560)); paper(T_name - 0.15, 0.012, px(1090))
knock(gc('door', -0.1), 0.012, px(1366), 170)
paper(gw('door', 'shut that back door', -0.3), 0.011, px(1665))
paper(gc('settings', 0.0), 0.011, px(1665))
paper(gc('restore', 0.0), 0.011, px(1665))
air(gw('restore', 'putting it back'), 1.6, 0.006, px(1665), 160, 800)
for i in range(3):
    knock(gc('power', 0.15 + 0.25 * i), 0.011, px(1500), 220 + 30 * i)
paper(gw('keepers', 'its keepers', -0.25), 0.012, px(330))
air(gw('sat', 'everyday accounts', -0.4), 0.8, 0.006, px(1000))
T_each, T_never = gw('others', 'each for one task'), gw('others', 'never come back')
for i, x in enumerate((840, 1310)):
    paper(T_each - 0.25 + 0.4 * i, 0.010, px(x)); knock(T_never - 0.15 + 0.3 * i, 0.011, px(x - 200), 220)
tap(gw('email', 'their email', -0.15), 0.008, px(560))
T_turn = END('great', 'others') + 0.3
sq((E2, B2, G3), T_turn, key=0.5, g=0.6, vel=0.35, roll=0.02)
sq((C3, G3, E4), T_turn + 0.75, key=0.5, g=0.58, vel=0.35)
sq((D3, A3, Fs4), T_turn + 1.5, key=0.8, g=0.6, vel=0.35)

# 4. A second account. The admin accounts laid down (Jun's, then Sam's); never for email or the web (a tap, then the cross); a passkey
#    (its sealed card, and a tap for its chip); his daily work (three knocks); the power leaving the everyday accounts, and the admin
#    accounts' dashed lines to it; "Off". Two locks (two thuds); the stolen everyday sign-in stops at the first (its tag lands, the lock
#    holds), the stolen admin account at the second; someone else's yes. The turn: B, D, E and G over D, held open
sw2 = lambda lid, word, off=0: W('second', lid, word, off)
sc2 = lambda lid, off=0: G('second', lid, off)
T_second = sw2('gets', 'a second account')
paper(T_second - 0.1, 0.012, px(840)); paper(T_second + 0.5, 0.010, px(840))
T_used = sw2('never', 'never used')
tap(T_used - 0.1, 0.008, px(1190)); knock(T_used + 0.35, 0.009, px(1190), 300)
T_pass = sw2('passkey', 'a passkey')
knock(T_pass - 0.2, 0.011, px(1310), 260); tap(T_pass + 0.15, 0.007, px(1250))
for i, word in enumerate(('writing code', 'testing it', 'watching the jobs')):
    knock(sw2('daily', word, -0.15), 0.010, px(700 + 170 * i), 280)
air(sc2('daily', -0.2), 1.0, 0.006, px(1200), 160, 800)
air(sc2('admin', -0.2), 0.8, 0.005, px(1300))
knock(sw2('none', "until it's switched on", 0.05), 0.012, px(1725), 220)
T_locks = sw2('locks', 'two locks')
thud(T_locks - 0.1, 0.012, px(1075)); thud(T_locks + 0.3, 0.012, px(1545))
T_stolen, T_steals = sc2('stolen'), sc2('steals')
knock(T_stolen + 0.7, 0.012, px(980), 230); thud(T_stolen + 1.4, 0.011, px(1075))
knock(T_steals + 0.8, 0.012, px(1450), 230); thud(sw2('steals', 'finds its power off', 0.05), 0.011, px(1545))
knock(sw2('steals', "can't switch it on alone", -0.15), 0.012, px(1650), 220)
tune([(0, B3, G2, 1), (1, D4, None, 1), (2, E4, C3, 1), (3, G4, D3, 1.6)], END('second', 'steals') + 0.3, 0.65, g=0.78)

# 5. Switched on for a task. The room makes way (air); what for: the card, and the admin account's line to it; which power, each glowing
#    as it's named (a tap), and the one the task needs carried into the card; a reason, a time (its day filling); Sam's line and his
#    yes; no one's own (a knock, its cross). In the beat after the yes, the power comes on: the diaphone's D, swelling in, held, let fall
#    before the voice. The alert: the team's panel, its bell. While it's on, the pedal is down: G, B and D rising, ringing, in the beat
#    after the alert. Recorded (a tap for each row); the time runs out and it's off ("Off"); in the beat after, the same chord, dry, its
#    dampers down. A time lock opened at its hour: the dial's slots, "Opens at 9:00", the bolts sliding back. Only for a task, only with
#    someone else's yes; it keeps them out too (a thud, "Kept out too"); a minute, and a yes. The turn: E, F sharp, G, over C, D and G
ww = lambda lid, word, off=0: W('switched', lid, word, off)
wc = lambda lid, off=0: G('switched', lid, off)
w0 = S0('switched')
air(w0 + 0.2, 1.8, 0.006, px(1000), 150, 800)
T_what = ww('what', 'what for')
paper(T_what - 0.25, 0.012, px(1480)); air(T_what - 0.2, 0.5, 0.005, px(1100))
for word in ('read the storage', 'change the settings', 'restore a table'):
    tap(ww('which', word), 0.007, px(1725))
T_move = END('switched', 'which') - 0.2
air(T_move, 1.3, 0.006, px(1500)); knock(T_move + 1.3, 0.011, px(1180), 260)
paper(ww('reason', 'in words', -0.2), 0.009, px(1480), 0.3)
tap(ww('time', 'four hours', 1.0), 0.008, px(1600))
T_samok, T_noone = ww('approves', "Sam approves Jun's"), ww('approves', 'no one approves')
air(T_samok - 0.2, 0.6, 0.005, px(1000)); tap(T_samok + 0.35, 0.01, px(1500))
air(T_noone - 0.2, 0.5, 0.005, px(900)); knock(T_noone + 0.25, 0.012, px(1075), 220)
T_on = END('switched', 'approves') + 0.3                 # tOn in src/scenes.js: the power comes on, in the beat after the yes
dia(D3, T_on - 0.22, 0.75, 1.0, px(1300), att=0.5, fall=0.45)
paper(T_on + 0.25, 0.009, px(1480))
bell(ww('alert', 'gets an alert', 0.02), 0.0085, px(1480))
T_by = ww('off', 'switches off by itself')
P_on = END('switched', 'alert') + 0.25
for i, m in enumerate((G3, B3, D4)):
    t_ = P_on + 0.35 * i
    sq(m, t_, key=0.3, g=0.52, vel=0.34, ring=T_by + 0.4 - t_, pan=0.05 * i)
for word in ('is recorded', 'its own name'):
    tap(ww('recorded', word), 0.008, px(1480))
tap(ww('off', 'as soon as'), 0.008, px(1480))
knock(T_by + 0.6, 0.012, px(1500), 220)
sq((G2, G3, B3, D4), END('switched', 'off') + 0.2, key=0.35, g=0.6, vel=0.36)
T_lock, T_hr = wc('lock'), ww('lock', 'at its hour')
knock(T_lock + 0.25, 0.011, px(1600), 230)
slots(T_lock + 0.6, 3, 0.7, 0.008, px(1240))
bolts(max(T_hr + 0.4, T_lock + 2.4), 1.2, 0.007, px(1240))
T_out = ww('slow', 'keeps them out')
thud(T_out - 0.1, 0.010, px(840)); knock(T_out + 0.05, 0.012, px(840), 220)
tap(ww('task', 'someone else says yes'), 0.008, px(1480))
paper(ww('costs', 'a minute', -0.25), 0.011, px(1480))
tune([(0, E4, C3, 1), (1, Fs4, D3, 1), (2, G4, (G2, D3), 2)], END('switched', 'costs') + 0.3, 0.7, g=0.78)

# 6. One morning. The load has stopped (its card); last night's file (a tap, its tag drawn); Jun's everyday account, refused. He switches
#    on: the card, his admin account's line to it, the power carried in; his reason, one hour; Sam's line, his yes; in the beat after it
#    the power comes on: the diaphone's D. The alert reaches the team (its bell) and matches the task (a tap). He opens the back door (air,
#    its latch) and the file; straight to the row; a date that doesn't exist (a knock, its coral line). While the power is on, the pedal
#    is down: E minor rising, ringing, in the beat after the date. The registrar's office, and which record to fix (the card goes up);
#    he switches off, the door shut (a thud): fourteen minutes; in the beat after it, G major, dry, its dampers down. The record (a tap
#    for each row). That night it runs clean: B, D and G, dry; could the next one be avoided; rows set aside; Mei sees it. The turn:
#    D, C, A and G, falling
mw = lambda lid, word, off=0: W('morning', lid, word, off)
mc = lambda lid, off=0: G('morning', lid, off)
paper(mw('stopped', 'has stopped', -0.25), 0.012, px(330))
T_file = mw('row', "last night's file")
tap(T_file - 0.2, 0.009, px(870)); air(T_file - 0.2, 0.5, 0.005, px(880))
paper(mc('cant', -0.25), 0.011, px(1650))
knock(mw('cant', 'the back door is shut', 0.15), 0.012, px(1450), 220)
T_sw = mc('switches')
paper(T_sw + 0.05, 0.012, px(1480)); air(T_sw + 0.1, 0.6, 0.005, px(1100))
T_read = mw('switches', 'read the storage')
air(T_read - 0.2, 1.3, 0.006, px(1500)); knock(T_read + 1.1, 0.011, px(1180), 260)
paper(mw('reason', "open last night's file", -0.25), 0.009, px(1480), 0.3)
tap(mw('switches', 'for one hour', 0.6), 0.008, px(1600))
air(mc('sam', -0.2), 0.6, 0.005, px(1000)); tap(mw('sam', 'and approves', 0.05), 0.01, px(1500))
dia(D3, END('morning', 'sam') + 0.05, 0.75, 1.0, px(1300), att=0.5, fall=0.45)   # lit in src/scenes.js: on from sc.ends.sam + 0.1
T_alert = mc('alert')
paper(T_alert - 0.25, 0.010, px(1480)); bell(T_alert + 0.22, 0.0085, px(1480)); tap(mw('alert', 'and matches'), 0.009, px(1480))
T_opens = mc('opens')
knock(T_opens + 0.2, 0.009, px(1366), 200); air(T_opens + 0.2, 1.2, 0.006, px(1366), 150, 700)
paper(T_opens + 0.85, 0.012, px(660))
air(mw('opens', 'goes straight', -0.2), 2.2, 0.004, px(660), 300, 1200)
knock(mw('date', 'the thirty-first', -0.15), 0.011, px(800), 200)
T_offS = mw('tells', 'and switches off')
P_on2 = END('morning', 'date') + 0.2
for i, m in enumerate((E3, G3, B3)):
    t_ = P_on2 + 0.35 * i
    sq(m, t_, key=0.3, g=0.5, vel=0.34, ring=T_offS - t_, pan=-0.05 * i)
paper(mc('tells', -0.05), 0.011, px(1665))
T_which = mw('tells', 'which record')
paper(T_which - 0.25, 0.011, px(1310)); air(T_which, 1.4, 0.005, px(1500))
thud(T_offS + 0.9, 0.012, px(1366))
paper(mc('fourteen', -0.35), 0.011, px(660))
sq((G2, D3, B3), END('morning', 'fourteen') + 0.2, key=0.35, g=0.6, vel=0.36)
for word in ('who switched on', 'what was read', 'when it ended'):
    tap(mw('record', word), 0.008, px(1480))
T_clean = mw('night', 'runs clean')
paper(T_clean - 0.25, 0.012, px(330))
for i, m in enumerate((B3, D4, G4)):
    sq(m, END('morning', 'night') + 0.15 + 0.3 * i, key=0.25, g=0.55, vel=0.35, pan=0.05)
paper(mw('asks', 'could the next one', -0.25), 0.011, px(1665))
paper(mw('aside', 'aside', -0.15), 0.012, px(1090))
air(mw('aside', 'the catalog guards', -0.2), 1.4, 0.004, px(1080), 200, 900)
T_see = mw('aside', 'to see')
paper(T_see - 0.35, 0.010, px(270)); air(T_see - 0.2, 0.6, 0.005, px(600))
tap(T_see + 0.25, 0.010, px(100)); knock(T_see + 0.3, 0.010, px(200), 260)
tune([(0, D4, B2, 1), (1, C4, None, 1), (2, A3, D3, 1), (3, G3, G2, 1)], END('morning', 'aside') + 0.2, 0.55, g=0.76)

# 7. Who gets one. Only Sam and Jun (a tick each). Never Mei, never Clara (their badges, "No admin account"); their work goes through the
#    catalog (their lines); for more, Clara asks the owner (her slip goes up), and Mei says yes: access, not power. Never an agent (it
#    comes in; "No admin account"); its proposal goes to Jun (the card goes up), he decides (a tick), and switches his own power on (a
#    low click); AI agents in data work; two emergency accounts, locked away; Who did what. The turn: the house's tune again, its start,
#    going back to Great Barrington
hw_ = lambda lid, word, off=0: W('who', lid, word, off)
hc_ = lambda lid, off=0: G('who', lid, off)
T_sj = hw_('only', 'Sam and Jun')
tap(T_sj - 0.15, 0.009, px(1400)); tap(T_sj + 0.25, 0.009, px(1400))
for word, cue in (('Mei Tanaka', 'business'), ('Clara Jensen', 'analysts')):
    t_ = hw_(cue, word)
    paper(t_ - 0.25, 0.011, px(270)); knock(t_ + 0.35, 0.011, px(200), 220)
air(hw_('through', 'which shows', -0.4), 0.8, 0.005, px(700))
T_ask, T_notp = hw_('ask', 'they ask'), hw_('ask', 'not for power')
paper(T_ask - 0.25, 0.010, px(500)); air(T_ask - 0.1, 1.6, 0.004, px(500))
tap(T_notp - 0.55, 0.010, px(430)); knock(T_notp - 0.15, 0.011, px(500), 260)
T_agent = hc_('agent')
air(T_agent - 0.2, 1.2, 0.005, px(1700)); knock(T_agent + 0.45, 0.011, px(1640), 220)
T_prop = hw_('propose', 'propose a task')
paper(T_prop - 0.25, 0.011, px(1400)); air(T_prop, 1.4, 0.004, px(1250))
tap(hw_('propose', 'a person decides', 0.05), 0.010, px(1430))
switch(hw_('propose', 'their own admin account', 0.05), 0.010, px(1500))
paper(hc_('rights', -0.15), 0.011, px(1410))
knock(hw_('exception', 'two emergency accounts', -0.15), 0.010, px(1630), 200)
paper(hc_('watched', -0.15), 0.011, px(1630))
tune(HOUSE, END('who', 'watched') + 0.3, 0.75, g=0.76, until=G('hour', 'numbers', -0.4))

# 8. Only at its hour. Great Barrington, 1875, in the morning: the dial's slots; the right numbers weren't enough (a thud); the vault
#    opens at its hour (the bolts sliding back; a tick, "Opens at 9:00"); in the beat after: G major, rolled, dry. On the platform: the
#    two locks (a thud); the right account isn't enough (its tag lands, the lock holds); off until it's switched on (a low click), for a
#    task, with someone else's yes, and off again; his everyday work, and nothing more (its tag lands, the first lock holds). After the
#    last line, Jun's power is switched on for a task, held a moment, and off: the diaphone's G, swelling in, held, let fall. The end
#    card: D, then G, dry
hw = lambda lid, word, off=0: W('hour', lid, word, off)
hc = lambda lid, off=0: G('hour', lid, off)
h0 = S0('hour')
slots(h0 + 1.7, 3, 0.8, 0.008, px(1240))
thud(hw('numbers', "weren't enough", -0.25), 0.012, px(1240))
T_opened = hc('opened')
bolts(T_opened + 0.3, 1.2, 0.007, px(1240))
tap(T_opened + 0.65, 0.010, px(1622)); knock(T_opened + 0.7, 0.011, px(1656), 230)
sq((G2, D3, B3, G4), END('hour', 'opened') + 0.2, key=0.9, g=0.62, vel=0.36, roll=0.03)
thud(hc('account', -0.15), 0.010, px(1310))
knock(hw('account', 'the right account', 0.4), 0.012, px(1450), 230); thud(hw('account', "isn't enough", 0.05), 0.010, px(1545))
T_task, T_yes = hw('off', 'for a task'), hw('off', 'someone else says yes')
switch(T_task - 0.15, 0.010, px(1545)); knock(T_task - 0.1, 0.011, px(1590), 230)
knock(T_yes - 0.15, 0.011, px(1740), 260); switch(T_yes + 1.65, 0.009, px(1545))
knock(hc('takes', 0.5), 0.012, px(980), 230); thud(hw('takes', 'nothing more', -0.35), 0.010, px(1075))
T_end = END('hour', 'great')                              # tEnd in src/scenes.js: on at tEnd + 0.2, off at tEnd + 1.9
dia(G2, T_end + 0.15, 1.25, 1.0, px(1300), att=0.5, fall=0.5)
P_card = hc('breath')
sq((D3, Fs3, A3), P_card + 0.4, key=0.6, g=0.58, vel=0.34)
sq((G2, D3, G3, B3), P_card + 1.2, key=1.6, g=0.62, vel=0.36, roll=0.03)
