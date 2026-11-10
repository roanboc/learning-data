# Five stages, not a switch: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the series thread on 5 November 2026 after checking every score.py on main and on every
# branch (/mnt/project-files/agentic-data-engineering/series-3/palettes.md): rototoms, alone. A rototom is a small tuned drum with no
# shell, a single head on a frame whose note is set by turning the drum on its stand: turned one way, the head tightens and the note
# rises. Here they're struck softly with felt mallets, dry and short, never rolled, high in their range (E flat 4 to C 5), so they never
# sound like the site's timpani or frame drum. Made here (music.py has none): each strike is the head's own modes, the ideal
# membrane's (1, 1.594, 2.136, 2.296, 2.653, 2.918 times its note), the lowest strongest and the rest dying away fast, with the felt's
# soft thump. No partner: the four partners still free on 5 November went to 3.2, 3.5, 3.6 and 3.7, and every other one checked is on
# the site or sounds like one (palettes.md, 3.1's note).
#  - Five drums, one for each stage, each sitting a whole step below its note (E flat, F, G, A flat, B flat) until its gate is passed,
#    then turned up to it (F, G, A, B flat, C: F major's first five notes). A turn is never heard as a slide: the player strikes, turns
#    the drum, and strikes again, so a person's decision that a gate is passed is heard as a drum turned up a step. An incident turns
#    one back down: C to B flat, when the night task moves down a stage, and up again on 30 October.
#  - The mark: the five notes rising, F, G, A, B flat, C. It sounds three times: as the title comes, when a person decides a gate is
#    passed (each drum turned up, as each gate's knob turns green), and on the end card.
#  - Keys, all tuned pure (just intonation from F, see hz()): D minor for the opening's problem, on a sixth drum, a low D, heard only
#    there; F major from 1987 on. New Zealand's three stages are F, A and C, each later one reached by a turn up after its test.
#  - Under the opening: D minor under the young driver and the car of friends at night; silence where the crashes, the hurt and the
#    dead are told, through "Something had to change"; F, A and C as the three signs spring up; a note for each stage as it's lit, the
#    restricted and the full licence each turned up a step after its test; the world's first; at the university, D again for every
#    right at once, then the five drums sprung low, not yet turned up, as the stages come; the mark into the title.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. After the opening, one drum at a time as a stage is lit or a task lands on its
#    stage; the rest is silence and the room's soft sounds.
#  - Nothing trembles, rolls or pulses (no chapter is urgent), no slides: each strike is single and dry.
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: a drum where a stage is lit or a task lands, paper as a card is laid
#    down, a pencil as the mandate is signed, a soft knock as the switch flips, a breath of air as a car passes.
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
R1 = np.random.default_rng(1987)  # this film's own randomness: the room

# ---- tuning: just intonation from F, so a turn up is a pure whole step (9 to 8) and F major's notes are whole-number ratios
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
KEY = (65, 349.228)  # F 4: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
D4, F4, G4, A4, Bb4, C5 = 62, 65, 67, 69, 70, 72
STAGE = (F4, G4, A4, Bb4, C5)          # the five drums, turned up: stage 1 to stage 5
BIG = [px(300 + 340 * i) for i in range(5)]          # where each stage stands when the stages fill the wall (FL.big)
SMALL = [px(785 + 237.6 * i) for i in range(5)]      # and when they're smaller, at the right (FL.small)

# ---- the levels: the rototoms about as far under the voice as the module's other music (matched by loudness, not by peak); the effects
# about 12 dB under the music (FX scales them all)
RL, FX = 0.105, 1.5

# a small, dry room round the drums: ringing on for under a second, nothing much above 1.6 kHz. Its level is set by what it rings
# under 1.6 kHz (its gain there about one, so `room` is its share), so the room never makes a note louder than its own level
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.014 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3200)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s

# ---- the rototom: the head's modes as (ratio to its note, level, how long it rings in seconds); struck about a third of the way in,
# so its note is strongest, and with felt, so its higher modes are soft and short
_MODES = ((1.0, 1.0, 0.40), (1.594, 0.40, 0.22), (2.136, 0.20, 0.15), (2.296, 0.14, 0.12), (2.653, 0.08, 0.09), (2.918, 0.05, 0.08))
def roto(m, t0, g=1.0, pan=0.0, low=False, room=0.18):
    """one rototom struck softly at t0: note m, or (low=True) the same drum a whole step below it, not yet turned up"""
    f = hz(m) * (8 / 9 if low else 1); n = int(1.6 * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for r, a, d in _MODES:
        fk = f * r
        if fk < 2300:
            # a struck head settles onto its note within a few hundredths of a second (0.4 % above it at first): not a slide
            s += a * np.exp(-x / d) * np.sin(2 * np.pi * fk * (x + 0.004 * 0.03 * (1 - np.exp(-x / 0.03))) + 0.4 * r)
    s *= np.minimum(1, x / 0.004)                                  # the felt: a soft edge to the strike
    th = filt(noise(0.04), 'low', 360)[:int(0.04 * SR)] * np.exp(-np.arange(int(0.04 * SR)) / SR / 0.009)
    s[:len(th)] += 0.12 * th / max(1e-9, float(np.abs(th).max()))  # and its soft thump
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2200)
    put(_room(s, room).astype(np.float32), t0, g * RL, pan)

def turn(m, a, b, g=1.0, pan=0.0):
    """a drum turned up a step: struck at a below its note, turned, and struck at b on its note (b at least a second after a, so
    the two never run together into a slide)"""
    roto(m, a, g * 0.9, pan, low=True); roto(m, b, g, pan)

def run(notes, t0, step, g=0.85, pans=None, low=False):
    """drums struck one after another, `step` seconds apart"""
    for i, m in enumerate(notes):
        roto(m, t0 + i * step, g, pans[i] if pans else 0.0, low=low)

def mark(t0, g=0.85, pans=None):
    """the mark: the five stages' notes rising, F, G, A, B flat, C"""
    run(STAGE, t0, 0.42, g, pans)

# ---- soft sounds, all low-passed
def paper(s, g=0.014, pan=0.0, sec=0.45):
    """a card laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=1.0, g=0.006, pan=0.0):
    """a pen signing: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft knock: a switch flipped"""
    s_knock(s, g * FX, pan, f)
def air(s, sec=1.6, g=0.008, pan=0.0, lo=120, hi=700):
    """a car passing on the road, far off: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)

# =============================================================================================================================
# 1. A licence in stages: the opening, under the rototoms. New Zealand in the 1980s: D minor, three drums, slow; the licence at fifteen;
#    the car of friends at night, one low D. Silence where the crashes, the hurt and the dead are told, and through the switch and
#    "Something had to change". 1987: F, A and C as the three signs spring up; the learner's F; the restricted licence turned up after
#    its test (G to A), and the full licence after another (B flat to C); C for the riskiest driving, last; the years after; the
#    world's first, F, A and C again. The university: F; every right at once, D; the five drums sprung low as the stages come, not
#    yet turned up; the mark into the title
lw = lambda lid, word, off=0: W('licence', lid, word, off)
lc = lambda lid, off=0: G('licence', lid, off)
l0 = S0('licence')
roto(D4, l0 + 0.9, 0.8, -0.2); roto(A4, l0 + 2.1, 0.7, 0.1); roto(F4, l0 + 3.3, 0.72, -0.05)
air(l0 + 1.0, 3.0, 0.007, px(900))                                    # the car going by in the hills
paper(lw('fifteen', 'get a licence'), 0.012, px(1290))
roto(A4, lw('fifteen', 'get a licence', 0.1), 0.7, px(1290))
air(lc('alone', 0.4), 3.4, 0.007, px(900))                            # the car of friends at night
roto(D4, lc('alone', 0.6), 0.65, 0.0)
knock(lw('switch', 'fully on', 0.05), 0.012, px(700))                 # the switch flips
P_three = lw('stages87', 'three stages')
run((F4, A4, C5), P_three + 0.06, 0.32, 0.75, [px(420), px(800), px(1180)])
roto(F4, lc('learner', 0.5), 0.7, px(420))
turn(A4, lc('restricted', 0.25), lw('restricted', 'a restricted licence'), 0.72, px(800))
turn(C5, lw('full', 'another test'), lw('full', 'the full licence'), 0.72, px(1180))
roto(C5, lc('last', 0.6), 0.6, px(1180))
paper(lc('fell', 0.3), 0.012, px(960))
roto(F4, lc('fell', 0.35), 0.62, px(700))
paper(lw('worked', 'fewer of those', -0.2), 0.012, px(960))
roto(A4, lw('worked', 'fewer of those', -0.1), 0.6, px(900))
paper(lw('first', "the world's first"), 0.012, px(960))
run((F4, A4, C5), lw('first', "the world's first", 0.1), 0.36, 0.62, [px(700), px(960), px(1220)])
roto(F4, lc('uni', 0.35), 0.62, px(1360))
paper(lw('anil', 'how many people', -0.2), 0.012, px(560))
paper(lw('risk', 'every right'), 0.012, px(540))
roto(D4, lw('risk', 'every right', 0.1), 0.62, px(540))
P_atime = lw('stage', 'a stage at a time')
run(STAGE, P_atime + 0.3, 0.28, 0.6, BIG, low=True)
mark(lc('breath', 0.5), 0.72, [px(760 + 100 * i) for i in range(5)])

# 2. Five stages and their gates: F for the junior assistant, C for the team contributor. Each stage, as it's lit with its three facts,
#    on its drum, not yet turned up. The five gates come in silence; a person decides each is passed: the five drums turned up, one by
#    one as each knob turns green, the mark
sw = lambda lid, word, off=0: W('stages', lid, word, off)
sc_ = lambda lid, off=0: G('stages', lid, off)
roto(F4, sw('road', 'a junior assistant'), 0.62, BIG[0])
roto(C5, sw('road', 'a team contributor'), 0.62, BIG[4])
for i, lid in enumerate(('s1', 's2', 's3', 's4', 's5')):
    roto(STAGE[i], sc_(lid, 0.2), 0.6, BIG[i], low=True)
P_passed = sw('decide', 'has passed')
mark(P_passed - 0.3, 0.7, BIG)

# 3. One agent, four stages: the identity card laid down; each task's drum as its tag lands on its stage, turned up, since the agent
#    has passed those gates: F for a word about staff, A for a new question, B flat for a fix, C for the night task in test, and B flat
#    again for the same task in production. The road on the wall, laid down
tw = lambda lid, word, off=0: W('tasks', lid, word, off)
tc = lambda lid, off=0: G('tasks', lid, off)
paper(tw('own', 'since September', -0.2), 0.012, px(670))
for lid, st in (('word', 0), ('question', 2), ('fix', 3), ('night', 4), ('prod', 3)):
    roto(STAGE[st], tc(lid, 1.35), 0.6, SMALL[st])
paper(tc('driver', 0.3), 0.011, px(330))

# 4. Down a stage, and back: one night in October, the card laid down and one low D, the opening's problem; the model that wasn't its
#    own, its card laid down. Anil moves the night task down: C as it leaves stage 5, B flat as it lands on stage 4 (the drum turned back
#    down). The way back up laid down as a list; the mandate signed (a pen); the gate passed, B flat, and C as the task lands on stage 5
#    again (turned up)
dw = lambda lid, word, off=0: W('down', lid, word, off)
dc = lambda lid, off=0: G('down', lid, off)
paper(dc('oct', 0.2), 0.012, px(690))
roto(D4, dc('oct', 0.3), 0.6, px(690))
paper(dw('other', 'changed a model'), 0.012, px(720))
P_five = dw('moved', 'from five to four')
roto(C5, P_five, 0.62, SMALL[4]); roto(Bb4, P_five + 1.3, 0.62, SMALL[3])
paper(dc('back', 0.3), 0.012, px(730))
P_sig = dw('signed', 'signed its mandate')
paper(P_sig - 0.2, 0.012, px(740)); pencil(P_sig + 0.2, 0.9, 0.006, px(740))
P_up = dw('signed', 'went back up')
roto(C5, P_sig + 0.3, 0.6, SMALL[4], low=True)    # the gate passed: the stage-5 drum, still low
roto(C5, P_up + 1.3, 0.62, SMALL[4])

# 5. What never changes: the oak plinth comes in, F, the ground under every stage; the list laid down; a person approves production, A
#    as its pill comes; the law and the standard, laid down
nw = lambda lid, word, off=0: W('never', lid, word, off)
nc = lambda lid, off=0: G('never', lid, off)
P_never = nw('under', 'never change')
roto(F4, P_never - 0.2, 0.6, 0.0)
paper(P_never + 0.1, 0.011, px(480))
roto(A4, nw('here', 'always approves'), 0.58, BIG[4])
paper(nc('law', 0.2), 0.011, px(490)); paper(nw('iso', 'who is responsible', -0.3), 0.011, px(1160))

# 6. One kind of task at a time: the hills, and the car past the three signs, F, A and C as each is lit; the night task down a stage and
#    back, B flat and C; each stage written on the map, a drum for each line as it comes (F, A, B flat, C, B flat); Planning's tickets
#    land on stage 4, B flat; the answer laid down; the mark on the end card
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
c0, ce = S0('close'), cq('close', 'earned')
for u, m, x in ((0.2, F4, 420), (0.52, A4, 800), (0.84, C5, 1180)):
    roto(m, c0 + 0.2 + (u + 0.34) / 1.94 * (ce - 0.4), 0.55, px(x))
air(c0 + 0.6, 3.2, 0.006, px(900))
P_dn = cw('earned', 'back down')
roto(Bb4, P_dn + 0.9, 0.55, SMALL[3]); roto(C5, P_dn + 2.5, 0.55, SMALL[4])
P_beside = cw('map', 'beside its kind')
paper(cw('map', "the university's map", -0.2), 0.012, px(720))
run((F4, A4, Bb4, C5, Bb4), P_beside, 0.3, 0.55, [px(560 + 40 * i) for i in range(5)])
roto(Bb4, cw('monday', 'the planning agent', 1.4), 0.58, SMALL[3])
paper(cw('count', 'do more', -0.2), 0.012, px(1390))
mark(cc('breath', 0.6), 0.7, [px(760 + 100 * i) for i in range(5)])
