# How it goes wrong: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the series thread on 4 November 2026 after checking every score.py on main and on every
# branch (/mnt/project-files/agentic-data-engineering/series-2/palettes.md): a trautonium and low bell plates. The trautonium is
# Friedrich Trautwein's electronic instrument of 1930, played by pressing a wire onto a rail: a neon tube's sawtooth, made soft by its
# filters, one note at a time, and under it its undertones, the subharmonics a divider makes from the note (Oskar Sala's Mixtur-
# Trautonium let a player switch them in). The bell plates are low ones, C3 to E4, struck softly with a felt mallet and damped by the
# player's hand. Both are made here (music.py has neither).
#  - The film's mark is a note with its undertone, resolved. Each failure turns on a trautonium note with an undertone that doesn't sit,
#    the seventh undertone, a seventh below the note (voiced at 4/7 of its pitch); each design resolves it: the player switches the
#    undertone to the octave below, or to the fifth below, and it sits. A divider is set by a switch, so the undertone moves at once,
#    with a short crossfade, never a slide. Each chapter takes its own note (G, A, E, D, C and F for the six ways), so no figure comes
#    back within 20 seconds; at the close the six resolve together, one after another, as the six cards turn green.
#  - Keys, all tuned pure (just intonation from C, see hz()): C minor for 1755, made by the trautonium's own undertones, as the
#    subharmonic series makes a minor chord (G, with C a twelfth below and E flat); C major for the city rebuilt and for the close.
#  - Under the opening: a bell plate for the hour, once; C minor under the city; the music thins under the trembling, a falling G, E flat,
#    C, and stops before "By most estimates": that line goes without music. One low C, alone, under the three failures, until "Something
#    had to change". C major comes in with the engineers' plan, then a note for each of the three designs, resolved; the bell plates
#    once more under the lower town today; the mark at "a few known ways", resolved as the team builds for it, into the title.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. After the opening, the mark sounds at each way's card and its resolution at the
#    design; the rest is silence and the room's soft sounds.
#  - Nothing trembles or pulses, no vibrato, no slides: each note is held steady, every chord tuned pure. The one urgent pulse is in A
#    loop all night (film.json lists "loop" in "urgent"): a soft, low trautonium note under the night's rounds, one to a round, stopping
#    at dawn.
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: paper as a card is laid down, a soft knock as a card turns over, keys as
#    the draft is written, a tap as the build strip turns, a breath of air as the wave runs in and as the flame stops at the wall, a
#    pencil for the engineers' plan and a quill for the parish's answers, and the clock's steps at night, one at a time.
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
R1 = np.random.default_rng(1755)  # this film's own randomness: the room

# ---- tuning: just intonation from C, so the notes of a chord, and a note and its undertones, are whole-number ratios of each other and
# nothing beats. C minor (C E flat G), C major (C E G) and every undertone below are pure here
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (48, 130.813)  # C 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
C3, E3, G3, C4, D4, Eb4, E4, F4, G4, A4 = 48, 52, 55, 60, 62, 63, 64, 65, 67, 69
# the undertones, as (ratio of the note's pitch, level): the seventh, a seventh below, that doesn't sit (the failure); the octave and
# the fifth below, where it sits (the design); C minor from G (its twelfth below, C, and its fifth undertone, E flat, voiced two
# octaves up); C major from E (its fifth undertone, C, voiced two octaves up and one)
SEV = ((4 / 7, 0.5),)
OCT = ((1 / 2, 0.55),)
FIF = ((2 / 3, 0.5),)
CMIN = ((1 / 3, 0.5), (4 / 5, 0.36))
CMAJ = ((4 / 5, 0.45), (2 / 5, 0.32))

# ---- the levels: the trautonium about as far under the voice as the module's other music (matched by loudness, not by peak), the bell
# plates a little under it, as they're struck; the effects about 12 dB under the music (FX scales them all). When the room was set by
# its gain where the notes are (4 November 2026), it rang 4 to 6 dB less, so the two were raised 4.6 and 5.4 dB to sound as loud as before
TL, BL, FX = 0.0425, 0.052, 1.55

# a room round the players: a small hall, ringing on for about a second and a half, and nothing much above 1.6 kHz. Its level is set
# by what it rings under 1.6 kHz (its gain there about one, so `room` is its share): scaled by all it rings, the room rang about 11 dB
# louder there than its share said, and moved a held note's level up or down by where its reflections met the note's own sound
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.6)).astype(np.float32))(np.arange(int(1.6 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.022 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3200)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room, a, b):
    """a held note in the room, at its own level: set back to the level it had before the room, measured over its body (a to b
    seconds, once it has come in and before it lets go). A note too short to have a body just goes into the room"""
    r = _room(s, room); i, j = int(a * SR), int(b * SR)
    if not room or j - i < int(0.3 * SR):
        return r
    return r * float(np.sqrt((s[i:j] ** 2).mean() / max(1e-12, (r[i:j] ** 2).mean())))

# ---- the trautonium: the neon tube's sawtooth, each partial falling as 1/k, softened by a low pass from `bright` Hz and given its
# voice by a gentle formant near 640 Hz. Held at one pitch: no vibrato, no slide
def _tone(f, x, bright):
    s = np.zeros(len(x))
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        s += (1 / k) / (1 + (fk / bright) ** 2) * (1 + 0.8 * np.exp(-((fk - 640) / 230) ** 2)) * np.sin(2 * np.pi * fk * x + 0.7 * k)
    return s

def traut(m, a, b, g=1.0, under=(), switch=None, att=0.22, rel=0.55, pan=0.0, room=0.3, bright=1100):
    """one trautonium note, m, from a to b: the wire pressed softly onto the rail and held. under: its undertones, as (ratio, level),
    each a darker voice at the note's pitch times the ratio. switch: (t, under2): at time t the player switches the undertones to
    under2, at once, with a crossfade of about a tenth of a second"""
    f = hz(m); sec = max(0.15, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    e = np.where(x < sec, np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2,
                 np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2 * (x < sec + rel))
    s = _tone(f, x, bright)
    ts = switch[0] - a if switch else None
    for r, gu in under:
        s = s + gu * _tone(f * r, x, bright * 0.7) * (np.clip((ts - x) / 0.09 + 0.5, 0, 1) if switch else 1.0)
    if switch:
        for r, gu in switch[1]:
            s = s + gu * _tone(f * r, x, bright * 0.7) * np.clip((x - ts) / 0.09 + 0.5, 0, 1)
    s *= e
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2400)
    put(_held(s, room, att, sec).astype(np.float32), a, g * TL, pan)

def mark(m, a, sec=2.6, g=0.9, pan=-0.1):
    """the mark, a failure: the note, and under it the seventh undertone, that doesn't sit"""
    traut(m, a, a + sec, g, SEV, att=0.3, rel=0.8, pan=pan)

def resolve(m, a, at, b, to=OCT, g=0.9, pan=-0.1):
    """a design: the same note, the seventh undertone under it at first; at `at` the player switches it to the octave or the fifth
    below, and it sits"""
    traut(m, a, b, g, SEV, (at, to), att=0.3, rel=0.9, pan=pan)

# ---- the bell plates: a low plate struck softly with a felt mallet: a round strike tone, a hum an octave below, a minor third and a
# fifth in it, as in a church bell, all tuned pure, and higher modes that die away quickly; the player damps it with a hand
_PLATE = ((0.5, 0.22, 2.4), (1.0, 1.0, 1.4), (1.2, 0.26, 1.0), (1.5, 0.16, 0.8), (2.0, 0.36, 0.7), (8 / 3, 0.09, 0.45), (3.0, 0.06, 0.35))
def plate(m, t0, g=1.0, pan=0.0, damp=1.7, room=0.42):
    """a bell plate struck at t0, damped after `damp` seconds"""
    f = hz(m); n = int((damp + 0.32) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for r, ar, d in _PLATE:
        if f * r < 2300:
            s += ar * np.exp(-x / d) * np.sin(2 * np.pi * f * r * x + 0.3 * r)
    s *= np.minimum(1, x / 0.009) * np.where(x < damp, 1.0, np.cos(0.5 * np.pi * np.minimum((x - damp) / 0.3, 1)) ** 2)
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 1900)
    put(_room(s, room).astype(np.float32), t0, g * BL, pan)

# ---- soft sounds, all low-passed
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card turning over, a card set down hard"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.011, pan=0.0):
    """a muffled key, a light click: a strip turning, a lock"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.009, pan=0.0, step=0.14):
    """a few keys typed, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.016, pan=0.0, sec=0.45):
    """a card or a sheet laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=1.4, g=0.007, pan=0.0):
    """a pencil drawing a line, or a quill writing: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def strike(s, g=0.01, pan=0.0, sec=0.6):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def air(s, sec=1.0, g=0.011, pan=0.0, lo=140, hi=900):
    """something passing: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def rumble(s, sec, g=0.03):
    """the ground shaking: a low swell of noise for as long as the picture shakes, felt more than heard"""
    s_air(s, sec, g * FX, 0.0, 35, 240)
def thud(s, g=0.022, pan=0.0):
    """a house falling, far off: a low, soft thud"""
    s_knock(s, g * FX, pan, 70)
def tick(s, g=0.007, pan=0.0):
    """a clock's step: one soft click"""
    x = tt(0.05); X(norm(filt(noise(0.05), 'band', (600, 2000))[:len(x)] * np.exp(-x * 140)), s, g * FX, pan)

# =============================================================================================================================
# 1. Rebuilt for the next one: the opening, under the trautonium and the bell plates. Lisbon at morning: a bell plate for the hour,
#    once, and C minor under the city, G with C and E flat under it. The ground shakes: the music thins, the undertones go, the note
#    falls to E flat and to C under the wave and the fires, and stops before "By most estimates"; the dead are held in silence. One low
#    C, alone, under the three failures, until "Something had to change". The engineers' plan: C major. The three designs, a note each,
#    rising C, E, G, each with the seventh undertone switched to the octave as its picture comes. The thirteen questions: paper, and a
#    quill. The lower town today: the bell plates, C, G and E. The university: the mark at "a few known ways", resolved as the team
#    builds for it, and held into the title, with the bell plate under it
lw = lambda lid, word, off=0: W('lisbon', lid, word, off)
lc = lambda lid, off=0: G('lisbon', lid, off)
l0 = S0('lisbon')
# the hour on All Saints' morning: one bell plate, low, across the river
plate(C3, l0 + 0.9, 1.0, -0.2, damp=1.8)
# C minor under the city, thinning when the ground shakes; E flat as the houses fall; C under the wave and the fires, stopping before
# the dead
P_gs, P_fall, P_fires = lw('shakes', 'the ground shakes'), lw('fall', 'fall'), lw('wave', 'fires burn')
traut(G4, l0 + 1.7, P_fall + 0.1, 0.85, CMIN, (P_gs, ((1 / 3, 0.3),)), att=1.6, rel=1.1)
traut(Eb4, P_fall - 0.1, P_fires + 0.1, 0.62, att=0.8, rel=1.0, pan=0.1)
traut(C4, P_fires - 0.1, lc('died', -1.0), 0.5, att=0.8, rel=0.6, pan=-0.05)
# the shaking, the houses falling, the wave running up the river (no roar)
rumble(P_gs - 0.1, lc('wave', -0.4) - P_gs, 0.03)
thud(P_fall + 0.25, 0.02, px(900))
air(lw('wave', 'a great wave', 0.6), 2.6, 0.012, px(1100), 110, 700)
# it had failed in every way at once: the three cards laid down, and one low C, alone, until something had to change
for i, word in enumerate(('walls that broke', 'fire that leapt', 'narrow, crowded lanes')):
    paper(lw('ways', word), 0.012, px(560 + 400 * i))
traut(C3, lc('failed', 0.3), END('lisbon', 'change') + 0.3, 0.7, att=1.4, rel=1.4)
# and the ground would shake again; rebuilt the old way, the city stands up again, and falls the same way
rumble(lw('again', 'shake again', -0.2), 1.6, 0.022)
P_same = lw('oldway', 'the same way')
rumble(P_same - 0.2, 1.8, 0.022); thud(P_same + 0.4, 0.016, px(980))
# the king's engineers: C major, and the plan drawn over the old lanes in pencil
traut(E4, lc('engineers', 0.3), lc('cage', -0.4), 0.7, CMAJ, att=1.2, rel=1.0, pan=0.05)
pencil(lw('engineers', 'rebuilt the lower town'), 3.2, 0.006, px(930))
# the three designs, a note each, rising C, E, G, each switched from the seventh to the octave as its picture comes: the cage bends;
# the flame stops at the wall (a breath of air); the long streets light up
resolve(C4, lw('cage', 'braced with crosses', -0.2), lw('cage', 'bends instead', 0.1), lc('firewall', -0.5), g=0.8)
P_fire = lw('firewall', 'so fire')
resolve(E4, lw('firewall', 'stone walls', -0.2), P_fire + 0.2, lc('streets', -0.4), g=0.8)
air(P_fire + 0.2, 1.1, 0.009, px(980))
P_wide = lw('streets', 'wide, straight streets')
resolve(G4, P_wide - 0.3, P_wide + 0.5, lc('questions', -0.3), g=0.8)
# the minister's thirteen questions: the sheet laid down, the letters out across the map; a parish priest writes his answers
paper(lc('questions', 0.1), 0.014, px(600))
air(lw('questions', 'thirteen questions', 0.3), 2.0, 0.006, px(1500), 300, 1200)
for word in ('when did it start', 'what fell', 'what did the sea do', 'had one struck before'):
    pencil(lw('asked', word, -0.1), 0.8, 0.005, px(1210))
# the lower town today: the bell plates once more, C, G and E
plate(C4, lc('stands', 0.4), 0.85, -0.1, damp=1.6)
plate(G3, lw('stands', 'more than', 0.1), 0.8, 0.15, damp=1.6)
plate(E4, lw('first', 'built to withstand', -0.5), 0.75, 0.05, damp=1.6)
# the scientists' archive: the parishes' papers; the university: the census-day count laid down
paper(lc('read', 0.5), 0.012, px(980))
paper(lw('uni', 'census-day count'), 0.014, px(760))
# agents go wrong in a few known ways too: the six cards come up together, and the mark; the team expects each one, and builds for it:
# the seventh switched to the octave as the tray lights, held into the title over a bell plate
P_known = lw('known', 'a few known ways')
paper(P_known + 0.1, 0.012, px(1500), 0.9)
mark(C4, P_known + 0.2, 2.4, 0.8)
P_bfor = lw('builds', 'builds for it')
resolve(C4, lw('builds', 'expects each one', -0.1), P_bfor + 0.1, lc('breath', 3.6), g=0.8)
plate(C3, lc('breath', 0.3), 0.8, 0.0, damp=1.8)

# 2. A column that isn't there: the first way's card turns over in the row; the mark, on G. Jun's card; keys as the draft is written; a
#    tap as the build strip comes up, failing; the catalog's card; the build stops. The cage in Lisbon's walls takes the shock: G, its
#    seventh switched to the octave as the house sways and settles. The draft fixed, two keys, and the build strip, passing
cw = lambda lid, word, off=0: W('column', lid, word, off)
cc = lambda lid, off=0: G('column', lid, off)
knock(S0('column') + 1.3, 0.012, px(500))
mark(G4, cc('first', 0.05))
paper(cc('asks', 0.3), 0.012, px(760))
keys(cc('draft', 0.4), 5, 0.008, px(800))
tap(cw('sounds', 'no such column'), 0.011, px(800))
paper(cw('catalog', 'the catalog', 0.6), 0.012, px(800))
knock(cw('sandbox', 'stops the build'), 0.012, px(1420), 180)
P_takes = cw('shock', 'takes the shock')
resolve(G4, P_takes - 0.5, P_takes + 0.3, cc('fix', 0.3))
keys(cw('fix', 'fixes the line', 0.2), 2, 0.008, px(800))
tap(cw('fix', 'builds again'), 0.011, px(800))

# 3. A confident wrong number: the second way's card turns; the mark, on A. Clara's question laid down; the agent's answer comes at once,
#    and turns over to show what it counted; the census team's report. The parishes' three answers, side by side. Its query and a
#    second way to reach it: A, its seventh switched to the fifth below as the report comes; a tap where the two differ; the question
#    for Jun laid down
nw = lambda lid, word, off=0: W('number', lid, word, off)
nc = lambda lid, off=0: G('number', lid, off)
knock(S0('number') + 1.3, 0.012, px(620))
mark(A4, nc('second', 0.05))
paper(nc('clara', 0.3), 0.012, px(830))
knock(nw('once', 'at once'), 0.012, px(800), 260)
knock(nw('counted', 'every degree', 0.35), 0.013, px(800), 300)
paper(nc('had'), 0.012, px(800))
for i in range(3):
    paper(nc('parish', 0.2 + 0.25 * i), 0.01, px(400 + 560 * i))
tap(nw('query', 'with its query'), 0.01, px(560))
P_sec = nw('query', 'a second way')
paper(P_sec, 0.012, px(800))
resolve(A4, P_sec - 0.4, P_sec + 0.4, nc('differ', -0.6), FIF)
tap(nc('differ'), 0.011, px(1000))
paper(nc('person', 0.1), 0.012, px(800))

# 4. A test weakened to pass: the third way's card turns; the mark, on E. The researchers' card; the draft from An agent on the team,
#    its warn lit, struck through, and Jun's tick. Tests belong to people: E, its seventh switched to the octave as the plan's line for
#    tests lights. The pull request's list laid down; the agent's proposal, and Jun decides
tw = lambda lid, word, off=0: W('test', lid, word, off)
tc = lambda lid, off=0: G('test', lid, off)
knock(S0('test') + 1.3, 0.012, px(720))
mark(E4, tc('third', 0.05))
paper(tc('research', 0.2), 0.012, px(800))
paper(tc('team', 0.2), 0.012, px(800))
tap(tw('team', 'to warn'), 0.01, px(800))
strike(tw('team', 'Jun caught it', 0.4), 0.009, px(800))
P_wr = tw('people', 'written first')
paper(tc('people', 0.1), 0.012, px(830))
resolve(E4, P_wr - 0.3, P_wr + 0.3, P_wr + 3.0)
paper(tc('lists', 0.1), 0.012, px(850))
tap(tc('propose', 0.2), 0.01, px(700))
knock(tc('decides'), 0.012, px(600), 200)

# 5. A line hidden in a ticket: the fourth way's card turns; the mark, on D. Clara's ticket laid down; its hidden line appears in
#    silence. The agent's note to Jun; the security experts' list, and the three things it reads; an order, or data? What it reads is
#    data: D, its seventh switched to the fifth below as the rule comes, and the lock clicks on "send anything out". Lisbon's walls: the
#    flame stops, a breath of air
kw = lambda lid, word, off=0: W('ticket', lid, word, off)
kc = lambda lid, off=0: G('ticket', lid, off)
knock(S0('ticket') + 1.3, 0.012, px(840))
mark(D4, kc('fourth', 0.05))
paper(kc('hands', 0.5), 0.012, px(830))
paper(kc('didnt', 0.1), 0.012, px(800))
paper(kc('risk', 0.2), 0.012, px(800))
for word in ('a file', 'a table', 'a web page'):
    tap(kw('risk', word), 0.008, px(600 + 264 * ('a file', 'a table', 'a web page').index(word)))
tap(kw('tell', 'an order from data'), 0.009, px(800))
paper(kc('data', 0.1), 0.012, px(870))
resolve(D4, kc('data', 0.1), kc('data', 0.9), kw('data', 'send anything out', 0.8), FIF)
tap(kw('data', 'send anything out'), 0.012, px(700))
air(kc('walls', 0.6), 1.2, 0.009, px(980))

# 6. A loop all night: the fifth way's card turns, in the dark; the mark, on C, darker. The clock at eleven, one step; the build fails;
#    the agreed job; the copy that hasn't arrived. The night's rounds: the one urgent pulse, a soft low C from the trautonium, one to a
#    round, with the clock's step, slow for the first round and quick for the other nine, stopping at dawn. The morning: the limit's card;
#    the budget's card, and a breath of air as it empties. The new limits: C, its seventh switched to the octave as "stops when the same
#    error comes back" lights. The plain check, and its two answers
pw = lambda lid, word, off=0: W('loop', lid, word, off)
pc = lambda lid, off=0: G('loop', lid, off)
knock(S0('loop') + 1.3, 0.011, px(960))
traut(C4, pc('fifth', 0.05), pc('fifth', 2.65), 0.85, SEV, att=0.3, rel=0.8, pan=-0.1, bright=800)
tick(pw('eleven', 'At eleven'), 0.008, px(1650))
tap(pw('eleven', 'the census build fails'), 0.011, px(760))
paper(pw('eleven', 'its agreed job'), 0.011, px(760))
paper(pw('cause', "the student system's copy", -0.2), 0.011, px(760))
R0, P_ten, P_six = pw('round', 'changes something', -0.3), pc('ten'), pw('ten', 'until six')
RT = lambda i: R0 if i == 0 else P_ten - 0.2 + (i - 1) * (P_six + 0.5 - P_ten) / 8
for i in range(10):
    tick(RT(i) + 0.05, 0.008 if i < 2 else 0.006, px(1650))
low = lambda t, g, p: traut(C3, t, t + 0.2, g, att=0.03, rel=0.16, room=0.15, bright=650, pan=p)
pulse(R0, RT(1) - 0.3, 60 / ((RT(1) - R0) / 3), [(0, low, 0.75, 0.0)], 1.0, 0.4)
pulse(RT(1), P_six + 0.4, 60 / ((P_six + 0.5 - P_ten) / 8), [(0, low, 0.75, 0.0)], 1.0, 0.6)
paper(pc('counted', 0.2), 0.011, px(760))
P_week = pw('sam', "a week's budget")
paper(P_week - 0.3, 0.011, px(760))
air(P_week, 1.6, 0.007, px(760), 120, 600)
paper(pc('limits', 0.1), 0.012, px(800))
P_stw = pw('limits', 'stops when')
resolve(C4, pc('limits', 0.3), P_stw + 0.1, P_stw + 2.6)
paper(pc('plain', 0.2), 0.012, px(800)); tap(pc('plain', 0.5), 0.009, px(1060))
tap(pw('plain', 'nothing starts'), 0.01, px(620)); tap(pw('plain', 'Sam is told'), 0.01, px(900))

# 7. A simple job made complicated: the sixth way's card turns; the mark, on F. The film it comes from; the long way's card, and Docs in
#    one call; the plan that didn't name its tools. Jun asks for one column renamed; the pull request's nine files; the costs rise. Each
#    plan names its tools: F, its seventh switched to the octave as the line for tools lights; sent back. The plain script, its gear,
#    and the agent's card
sw = lambda lid, word, off=0: W('simple', lid, word, off)
sc_ = lambda lid, off=0: G('simple', lid, off)
knock(S0('simple') + 1.3, 0.012, px(1080))
mark(F4, sc_('sixth', 0.05))
paper(sc_('long', 0.2), 0.011, px(800))
paper(sw('long', 'thirty-eight web pages'), 0.012, px(650)); tap(sw('long', 'Docs gives'), 0.01, px(1000))
paper(sc_('tools'), 0.011, px(800))
paper(sc_('rename', 0.2), 0.011, px(700)); paper(sw('rename', 'nine changed files'), 0.012, px(760))
tap(sw('costs', 'to run'), 0.008, px(1030)); tap(sw('costs', 'to review'), 0.008, px(1200))
P_names = sw('names', 'names its tools')
paper(sc_('names', 0.1), 0.012, px(830))
resolve(F4, sc_('names', 0.2), P_names + 0.3, sw('names', 'Jun sends back', 1.4))
knock(sw('names', 'Jun sends back'), 0.012, px(760), 200)
paper(sc_('script', 0.2), 0.012, px(660)); tap(sc_('script', 0.5), 0.008, px(810))
paper(sc_('keep', 0.2), 0.012, px(1060))

# 8. Expect these: the six come down from the row (a breath of air), unfold (paper), and turn over one by one, a soft knock each, as
#    the six marks resolve one after another, each on its own note with its undertone sitting: G, A, E, D, C, F. Lisbon's builders: the
#    cage, the walls; the lower town still stands: the bell plates, C and E. Jun's team does the same: the count laid down; "stand
#    behind it": C major. The end card: a bell plate, and the mark, C, its seventh switched to the octave, held to the end
ew = lambda lid, word, off=0: W('expect', lid, word, off)
ec = lambda lid, off=0: G('expect', lid, off)
e0 = S0('expect')
air(e0 + 0.9, 1.2, 0.007, px(960), 200, 1000)
paper(e0 + 1.9, 0.011, px(960), 0.7)
P_des = ew('six', 'a design for each')
for i, (m, to) in enumerate(((G4, OCT), (A4, FIF), (E4, OCT), (D4, FIF), (C4, OCT), (F4, OCT))):
    t_ = P_des + 0.1 + 0.36 * i
    knock(t_, 0.008, px(540 + 840 * (i // 3)), 280)
    traut(m, t_, t_ + (1.4 if i == 5 else 0.34), 0.62, to, att=0.04, rel=0.5 if i == 5 else 0.12, pan=-0.3 + 0.12 * i)
P_still = ew('expected', 'the lower town still stands')
plate(C4, P_still, 0.7, -0.1, damp=1.5)
plate(E4, P_still + 1.1, 0.65, 0.1, damp=1.5)
paper(ew('same', 'the number the university reports'), 0.012, px(780))
P_stand = ew('count', 'stand behind it')
traut(E4, P_stand - 0.1, ec('expect', -0.4), 0.62, CMAJ, att=0.9, rel=0.9, pan=0.05)
P_end = ec('breath')
plate(C3, P_end + 0.3, 0.75, 0.0, damp=1.8)
resolve(C4, P_end + 0.6, P_end + 1.7, E('expect') - 0.9, g=0.72, pan=0.0)
