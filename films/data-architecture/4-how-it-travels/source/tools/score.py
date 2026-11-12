# How it travels: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py),
# and checked by tools/quiet.py (the governance films' check: when the music plays, how often, how loud, no repeats, no beats, no pulse,
# held notes kept level).
#
# The film's palette (its row in the series' palette register, 12 November 2026): an autoharp and a euphonium, two instruments the site
# has, paired for the first time, as the register allows where nothing new fits (an assumption in the film's assumptions file, with the
# question on the author's checklist).
# The autoharp: fifteen strings, the F major scale from F 3 to F 5, strummed slowly across with a felt pick, from the bass up, one chord
# bar held down: the pick crosses every string, but only the strings of the pressed chord ring; the bar's felts damp the rest to a
# faint touch. The film's idea in one instrument: the home sends each change once, and each reader receives only what it may. It
# strums at a chapter's turn and under the opening story, and picks one string, alone, under a moment on screen. In the opening, it
# strums up and back down, as the same lines carried messages both ways.
# Its partner: a euphonium, alone, soft and low (F 2 to C 4), plain held notes at one level, no vibrato: where a message starts
# (Santiago answering in the opening; the network's meter data at the utility), under the autoharp's strings.
# Kept apart from the films that have them (Skills and workflows' autoharp, keeping a cornett's phrase; the euphoniums of How long, and
# then what, with drawers, and of Governed in Unity Catalog, in a low brass choir): the autoharp is strummed slowly, only where
# something is sent, and never under a cornett; the euphonium plays alone and low, never in a choir. There is no room round either: the
# instruments play dry, as the series' other films do. Nothing Chilean for Cybersyn (no Andean flutes, no charango, no rhythm of a
# dance), no truck or engine sounds as music, and no machine rhythm for the telex: the story is told in the series' own voice.
#
# Keys, tuned pure: F major, as just intonation from F (every chord's notes are whole-number ratios of each other, so no two held notes
# can beat on a phone's one speaker; no G minor chord, which isn't pure in it, and G and D never sound together); D minor and A minor
# for what goes wrong (the strike, goods running out, what the wall is there to stop, the queue nothing read); C major where something
# reaches those who need it, or a door opens (the trucks sent where they're needed most; every retailer alike; Data that moves, the
# next series); B flat major at a chapter's turn.
# The series' mark, at the title and at the end card: the root and its fifth, apart (F and C), then the third between them, A, which
# makes the chord, each one string of the autoharp, with the euphonium's low F under it.
# The film's own figure, *published once*: the euphonium gives one note at the home, and while it holds, one slow strum crosses every
# string and only the chord's strings ring. Where the network publishes each replaced reading once; under the light that runs along
# the flow on the map; and at the end, as the Mendozas' replaced reading reaches billing a minute later. In the shapes, where the home
# first sends its change, the two come apart: the euphonium as the home lights, the strum as the change goes.
#
# After the opening story, music comes now and then: a chapter's chord as its picture comes in, a string under a moment on screen, or a
# pause without words. Nothing is held under the explaining, nothing pulses, nothing trembles, and no figure comes back soon.
# Every sound is an event on screen, at the moment it appears: each uses the same word and offset as its picture in src/scenes.js, so
# sound and picture stay together when the voice is re-timed. Effects are soft, one at a time, and below about 2.4 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice
# reads. kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def px(x, cam=960):
    """where something drawn at x sits in the stereo field, with the camera centred on cam"""
    return max(-0.85, min(0.85, (x - cam) / 960 * 0.9))

# ---- levels: the music and the effects as loud as the governance films the author accepted (tools/quiet.py measures them) ----
MUS, FXG = 2.5, 1.6
_X = X
def X(sig, start, g=0.3, pan=0.0):
    _X(sig, start, g * FXG, pan)

# ---- just intonation from F ----
_JI = {0: 1.0, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def jf(m):
    """a note's pitch (MIDI numbering, F3 = 53) in just intonation from F"""
    o, r = divmod(m - 53, 12)
    return 174.6141 * 2.0 ** o * _JI[r]
F2, A2, C3, D3, F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4, Bb4, C5, D5, E5, F5 = 41, 45, 48, 50, 53, 55, 57, 58, 60, 62, 64, 65, 67, 69, 70, 72, 74, 76, 77

# ---- the autoharp: fifteen strings, the F major scale from F 3 to F 5; a chord bar's felts damp every string not in its chord ----
AH = [F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4, Bb4, C5, D5, E5, F5]
BAR = {'F': (5, 9, 0), 'Bb': (10, 2, 5), 'C': (0, 4, 7), 'Dm': (2, 5, 9), 'Am': (9, 0, 4)}   # each bar's chord, as pitch classes
_BOARD = [(210, 0.3), (460, 0.22), (950, 0.1)]          # its soundboard: a few broad lifts, which add no note of their own
def _string(m, ring=True):
    """one string as the felt pick crosses it. With its bar up it rings: its note and the whole-number partials of a plucked string, the
    felt taking the top off, the higher ones fading first, for a few seconds (a lower string longer). Where a felt holds it, the pick
    only touches it: a dull tap of its note, gone in a few hundredths of a second. Nothing above about 2.3 kHz"""
    f = jf(m)
    if ring:
        tau = 2.4 * (175.0 / f) ** 0.35; sec = min(4.2, tau * 3.0); x = tt(sec).astype(np.float64)
        s = sum((n ** -1.25) * np.exp(-0.3 * (n - 1)) * np.sin(2 * np.pi * f * n * x + 0.5 * n) * np.exp(-x * (1 + 0.55 * (n - 1)) / tau)
                for n in range(1, 12) if f * n < 2300)
        s = s * (1 - np.exp(-x / 0.003)) * np.clip((sec - x) / 0.3, 0, 1)
    else:
        sec = 0.14; x = tt(sec).astype(np.float64)
        s = 0.07 * (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(4 * np.pi * f * x)) * np.exp(-x / 0.022) * (1 - np.exp(-x / 0.004))
    felt = filt(noise(sec), 'low', 700)[:len(x)] * np.exp(-x / 0.008)
    return (s + 0.03 * felt / max(1e-9, float(np.abs(felt).max()))).astype(np.float32)
def _board(s):
    return (0.65 * s + sum(a * filt(s, 'band', (fc * 0.8, fc * 1.25)) for fc, a in _BOARD)).astype(np.float32)
def strum(bar, start, g=0.013, pan=0.0, step=0.07, down=False):
    """one slow strum with the bar for a chord held down: the felt pick crosses every string, one every step, from the bass up (or from
    the top down); the chord's strings ring and the rest are only touched. One sound, as the ear hears it"""
    pcs = BAR[bar]; ss = AH[::-1] if down else AH
    out = np.zeros(int((step * len(ss) + 4.4) * SR), np.float32)
    for i, m in enumerate(ss):
        a = _string(m, m % 12 in pcs); i0 = int(i * step * SR); out[i0:i0 + len(a)] += a[:len(out) - i0]
    put(norm(filt(_board(out), 'low', 2300)), start, g * MUS, pan)
def pick(m, start, g=0.011, pan=0.0):
    """one string picked alone with the felt, its bar up"""
    assert m in AH, 'the autoharp here has the F major scale from F 3 to F 5, not %d' % m
    put(norm(filt(_board(_string(m, True)), 'low', 2300)), start, g * MUS, pan)

# ---- the euphonium: alone, soft and low, plain held notes ----
_HORN = [(1, 1.0), (2, 0.5), (3, 0.28), (4, 0.15), (5, 0.08), (6, 0.04), (7, 0.02)]
def euph(m, start, sec=2.6, g=0.018, pan=0.0):
    """a euphonium's held note, soft and low (F 2 to C 4): a round tone, its fundamental strong and its upper harmonics faint, as a
    conical bore gives at a soft dynamic, every partial a whole multiple of the note; a breath to start it and a smooth swell in, one
    level while it holds, no vibrato, nothing trembles; a gentle release. Nothing above about 1.5 kHz"""
    assert F2 <= m <= C4, 'the euphonium here plays F 2 to C 4, not %d' % m
    f = jf(m); x = tt(sec).astype(np.float64)
    s = sum(a * np.sin(2 * np.pi * f * n * x + 0.7 * n) for n, a in _HORN if f * n < 1500)
    up = np.clip(x / 0.16, 0, 1); dn = np.clip((sec - x) / 0.5, 0, 1)
    s = s * (up * up * (3 - 2 * up)) * (dn * dn * (3 - 2 * dn))
    br = filt(noise(sec), 'band', (180, 900))[:len(x)] * np.exp(-x / 0.05)
    s = s + 0.035 * br / max(1e-9, float(np.abs(br).max()))
    put(norm(filt(s.astype(np.float32), 'low', 1500)), start, g * MUS, pan)

# ---- what they play ----
def damark(s, g=0.013, pan=0.0):
    """the series' mark: F and its fifth, C, apart, then the third between them, A, which makes the chord; the euphonium's low F under it"""
    pick(F4, s, g, pan - 0.3); pick(C5, s + 0.6, g, pan + 0.3)
    pick(A4, s + 1.3, g * 1.05, pan); euph(F2, s + 1.3, 3.0, g * 1.4, pan)
def published(home, s, g=0.012, pan=0.0, hpan=None):
    """the film's figure: the euphonium's note at the home, and while it holds, one slow strum of F major, only its strings ringing"""
    euph(F2, home, 2.9, g * 1.5, pan if hpan is None else hpan); strum('F', s, g, pan)

# ---- effects: soft, short, below about 2.4 kHz ----
def knock(s, g=0.012, pan=0.0):
    """a soft wooden knock, for a card or a sheet arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 230 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 510 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def pane(s, g=0.008, pan=0.0):
    """a pane of glass set down softly, for a tag or a mark: a dull tap, its ring gone at once"""
    x = tt(0.22); X(norm(filt((np.sin(2 * np.pi * 760 * x) * np.exp(-x * 30) + 0.35 * np.sin(2 * np.pi * 1630 * x) * np.exp(-x * 55)).astype(np.float32), 'low', 2000)), s, g, pan)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """a sheet laid down, a page turned, or a strip of paper: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pencil(s, sec=1.2, g=0.005, pan=0.0):
    """a pencil drawing on paper: a soft scratch that swells in and out, its strokes uneven, never a buzz"""
    x = tt(sec); r = np.random.default_rng(int(s * 100) % 997); k = np.zeros_like(x)
    t0 = 0.0
    while t0 < sec:
        d = r.uniform(0.12, 0.3); i0, i1 = int(t0 * SR), int(min(sec, t0 + d) * SR); u = np.linspace(0, 1, max(1, i1 - i0))
        k[i0:i1] = r.uniform(0.5, 1.0) * np.sin(np.pi * u) ** 2; t0 += d * r.uniform(0.9, 1.3)
    X(filt(noise(sec), 'band', (600, 2100)) * k * np.sin(np.pi * x / sec) ** 0.5, s, g, pan)
def press(s, g=0.016, pan=0.0):
    """something set down for good, or brought to a stop: a low thud and a knock, nothing bright"""
    x = tt(0.4); X(norm(filt((np.sin(2 * np.pi * 75 * x) * np.exp(-x * 11)).astype(np.float32) + 0.15 * noise(0.4) * np.exp(-x * 40), 'low', 900)), s, g * 1.4, pan)
    knock(s + 0.01, g * 0.45, pan)
def tick_(s, g=0.006, pan=0.0):
    """a cross drawn, or a lock set: a short soft click"""
    x = tt(0.07); X(norm(filt((np.sin(2 * np.pi * 1250 * x) * np.exp(-x * 80) + 0.3 * noise(0.07) * np.exp(-x * 120)).astype(np.float32), 'low', 2000)), s, g, pan)
def air(s, sec=0.9, g=0.008, pan=0.0, lo=140, hi=900):
    """things moving together, a line drawn out, or light running along one: a breath of low air"""
    s_air(s, sec, g * FXG, pan, lo, hi)
def telex(s, sec, g=0.004, pan=0.0):
    """a telex printing: one soft, muffled texture of keys, uneven, never a clatter or a rhythm"""
    x = tt(sec); r = np.random.default_rng(int(s * 10) % 991); k = np.zeros_like(x); t0 = 0.0
    while t0 < sec:
        i0 = int(t0 * SR); n = int(0.03 * SR); k[i0:i0 + n] += r.uniform(0.4, 1.0) * np.exp(-np.arange(min(n, len(k) - i0)) / (0.006 * SR)); t0 += r.uniform(0.07, 0.16)
    X(filt(noise(sec), 'band', (300, 1300)) * np.minimum(k, 1) * np.sin(np.pi * x / sec) ** 0.4, s, g, pan)

# ======================================================================================================================
# 1. The same lines: Chile, October 1972, under music: the telex lines from the north to the south (F major, lamp-lit); every
#    afternoon, each factory's numbers, one way, to Santiago; the truck owners' strike and those who joined it (D minor); trucks
#    standing still, goods running out (A minor); once a day, one way, crossed out; what the government needed to hear; the emergency
#    operations centre (B flat major); two thousand telexes read, and answered: the euphonium, as Santiago starts a message; the same
#    lines, both ways: a strum up and back down; the trucks still running, sent where they're needed most (C major). Then the utility:
#    Inés lists every path across the wall; eleven, four on the map; the title, to the series' mark. The opening story: music under it.
ST_ = 'strike'
strum('F', S0(ST_) + 0.5, 0.013, -0.1)                                                                  # Chile, 1972: F major
tLi = W(ST_, 'year', 'telex lines')
knock(tLi - 0.4, 0.010, px(1200)); air(tLi - 0.3, 2.8, 0.006, px(560), 200, 1000)                    # Cybersyn; its lines, drawn
pick(C5, W(ST_, 'year', 'north', 0.0), 0.011, px(660))                                                 # from the north
pick(F4, W(ST_, 'year', 'south', 0.0), 0.011, px(660))                                                 # to the south
tAf = W(ST_, 'daily', 'Every afternoon')
knock(tAf - 0.4, 0.009, px(980)); telex(tAf, 2.2, 0.004, px(1250))                                    # the factory; its telex prints
tOw = W(ST_, 'daily', 'one way')
paper(tOw - 0.3, 0.009, px(1300), 0.5); air(tOw, 1.4, 0.006, px(1450), 200, 1000)                     # the day's figures, one way
pick(C4, W(ST_, 'daily', 'to Santiago', 0.1), 0.011, px(1500))                                         # read in Santiago
tTo = W(ST_, 'strike', 'truck owners')
knock(C(ST_, 'strike', -0.5), 0.008, px(600)); strum('Dm', tTo - 0.2, 0.013, px(400))                 # the strike: D minor
for x, wd in [(1290, 'shopkeepers'), (1530, 'bank clerks'), (1770, 'others')]:
    pane(W(ST_, 'strike', wd, -0.3), 0.006, px(x))                                                     # those who joined it
press(W(ST_, 'goods', 'standing still', -0.2), 0.010, px(230))                                         # a truck, standing still
strum('Am', W(ST_, 'goods', 'run out', -0.2), 0.012, 0.0, 0.08)                                        # goods running out: A minor
paper(C(ST_, 'once', -0.4), 0.009, px(420), 0.5)                                                       # today's figures
tick_(W(ST_, 'once', "couldn't"), 0.005, px(770))                                                      # once a day: crossed out
knock(W(ST_, 'needed', 'where goods', -0.3), 0.009, px(1300))                                          # where are goods short?
knock(W(ST_, 'needed', 'which trucks', -0.3), 0.009, px(1300))                                         # which trucks can still run?
pick(G4, W(ST_, 'needed', 'as it happened', -0.1), 0.011, px(1150))                                    # as it happens
tEm = W(ST_, 'centre', 'emergency')
knock(tEm - 0.3, 0.009, px(500)); strum('Bb', tEm - 0.1, 0.012, px(500))                              # the operations centre: B flat
telex(W(ST_, 'read', 'two thousand', -0.3), 2.6, 0.004, px(1200))                                      # the telexes, read
euph(C3, W(ST_, 'read', 'answered', -0.1), 2.6, 0.018, px(1200))                                       # and answered: Santiago sends
tBd = W(ST_, 'both', 'both directions')
strum('F', tBd - 1.3, 0.012, px(700)); strum('F', tBd - 0.1, 0.011, px(700), down=True)              # both ways: up and back down
tTw = W(ST_, 'trucks', 'two hundred')
air(tTw - 0.2, 2.6, 0.006, px(600), 200, 900)                                                          # the trucks still running set off
strum('C', W(ST_, 'trucks', 'needed most', -0.2), 0.012, px(560))                                      # where they're needed most: C major
strum('F', C(ST_, 'utility', -0.4), 0.012, 0.0)                                                        # the utility: F major
pencil(W(ST_, 'utility', 'lists every path', 0.1), 2.4, 0.004, 0.0)                                   # Inés lists every path
pane(W(ST_, 'utility', 'the wall', 0.3), 0.006, 0.0)                                                   # the wall
pane(W(ST_, 'eleven', 'finds eleven', -0.1), 0.006, 0.0)                                               # eleven
tMa = W(ST_, 'eleven', 'on the map')
pick(D4, tMa + 0.1, 0.011, -0.1); pick(A4, tMa + 1.0, 0.011, 0.1)                                      # only four on the map
damark(C(ST_, 'breath', 1.1), 0.013, 0.0)                                                              # the title: the series' mark

# 2. Paths nobody drew: the database link, made for the complaints team; every connection point's readings, the other retailers'
#    among them; what the wall is there to stop (D minor); no owner at either end; when one end changes, it breaks; March: the
#    nightly script, the months to August, a queue nothing read (A minor); about 1,900 bills uncorrected. Now and then, from here on.
PA = 'paths'
pane(W(PA, 'link', 'database', -0.3), 0.006, px(843))                                                  # the database link
knock(W(PA, 'link', 'complaints team', -0.2), 0.008, px(1450))                                         # the complaints team
tEv = W(PA, 'all', 'every connection')
knock(tEv - 0.3, 0.009, px(960)); air(tEv, 1.6, 0.005, px(960), 200, 1000)                            # every reading, dot by dot
pick(E4, W(PA, 'all', 'other retailers', 0.1), 0.011, px(1100))                                       # the other retailers' among them
strum('Dm', W(PA, 'wall', 'there to stop', -0.1), 0.012, 0.0)                                         # what the wall is there to stop
knock(W(PA, 'wall', 'customer information', -0.2), 0.009, px(960))                                    # the rule's card
tNo = W(PA, 'owner', 'no owner')
tick_(tNo, 0.005, px(560)); tick_(tNo + 0.3, 0.005, px(1360))                                         # no owner at either end
press(W(PA, 'owner', 'breaks', -0.1), 0.010, px(1200))                                                 # it breaks
paper(C(PA, 'march', -0.1), 0.007, px(420), 0.4)                                                       # March
pane(W(PA, 'march', 'nightly script', -0.2), 0.006, px(780))                                           # the nightly script
tQu = W(PA, 'march', 'a queue')
for i in range(5):
    paper(tQu + 0.2 + 0.6 * i, 0.006, px(420), 0.3)                                                    # April, May... August
strum('Am', W(PA, 'march', 'nothing read', -0.1), 0.012, px(1460))                                    # a queue nothing read: A minor
press(W(PA, 'march', 'bills', -0.2), 0.010, px(1080))                                                  # about 1,900 bills uncorrected

# 3. What crosses: November; the Mendozas' meter, the radio mast down, nine days without readings; estimated, and billing used it; the
#    meter came back and sent what it stored, and the network replaced the estimate; the replacement at home; the agreed list, its five
#    parts written one by one; each retailer only its own, the group's own no differently (C major); nothing else crosses.
CR = 'crosses'
air(C(CR, 'meter', -0.6), 1.6, 0.005, 0.0, 200, 900)                                                   # to Quarry Lane
paper(C(CR, 'meter', 0.3), 0.007, px(170), 0.4)                                                        # November
press(W(CR, 'meter', 'radio mast', -0.1), 0.009, px(900))                                              # the radio mast, being mended
pick(A3, W(CR, 'meter', 'nine days', 0.1), 0.011, px(1530))                                            # nine days without readings
pencil(W(CR, 'est', 'estimated', -0.2), 1.4, 0.004, px(1530))                                          # the estimate, drawn in
knock(W(CR, 'est', 'billing used', -0.2), 0.008, px(1530))                                             # billing used it
air(W(CR, 'back', 'came back', -0.2), 1.4, 0.006, px(1200), 200, 1000)                                # the meter sends what it stored
pick(C4, W(CR, 'back', 'replaced', 0.1), 0.011, px(1530))                                              # the estimate, replaced
tRe = W(CR, 'list', 'the replacement')
air(tRe - 0.8, 1.4, 0.005, 0.0, 200, 900); knock(tRe, 0.008, px(220))                                 # down to the wall; the record
paper(W(CR, 'list', 'agreed list', -0.3), 0.008, px(360), 0.45)                                        # the agreed list
pane(C(CR, 'five', 0.6), 0.006, px(560))                                                               # five things
for wd in ['connection point', 'the days', 'the estimate', 'the readings', 'when it was replaced']:
    pencil(W(CR, 'parts', wd, -0.1), 0.6, 0.004, px(360))                                              # each part, written
knock(W(CR, 'own', 'Each retailer', -0.3), 0.008, px(1540))                                            # the retailers
air(W(CR, 'own', 'serves', -0.3), 1.6, 0.006, px(1000), 200, 1000)                                    # each its own
strum('C', W(CR, 'own', "group's own", -0.1), 0.012, px(1540))                                        # no differently: C major
tNe = W(CR, 'nothing', 'Nothing else')
for i in range(3):
    tick_(tNe + 0.2 + 0.3 * i, 0.005, px(940))                                                         # stopped at the wall

# 4. Three shapes: DAMA's three (B flat major); point to point, one wire; a wire for each new reader; one breaks, unseen; hub and
#    spoke, to the hub and back, as Cybersyn's factories sent to Santiago; publish and subscribe: the home (the euphonium), each change
#    sent once (the strum), each reader allowed subscribes; the three questions.
SH = 'shapes'
air(C(SH, 'choice', -0.8), 1.6, 0.005, 0.0, 200, 900)                                                  # on to the shapes
strum('Bb', W(SH, 'choice', 'DAMA', -0.2), 0.012, 0.0)                                                 # three shapes: B flat major
knock(C(SH, 'p2p', -0.2), 0.008, px(330))                                                              # point to point
pencil(W(SH, 'p2p', 'wired straight', -0.2), 0.8, 0.004, px(330))                                      # one wire
tNr = W(SH, 'wires', 'each new reader')
for i in range(3):
    pencil(tNr + 0.1 + 0.47 * i, 0.4, 0.004, px(330))                                                  # each new reader, a wire
tBr = W(SH, 'wires', 'break the other')
tick_(tBr, 0.005, px(400)); pick(D4, tBr + 0.2, 0.011, px(400))                                        # one breaks, unseen
knock(C(SH, 'hub', -0.2), 0.008, px(960))                                                              # hub and spoke
air(W(SH, 'hub', 'every system', -0.2), 2.0, 0.005, px(960), 200, 900)                                # to the hub and back
pick(C4, W(SH, 'hub', 'Cybersyn', 0.0), 0.011, px(960))                                                # as Cybersyn's factories sent
knock(C(SH, 'pubsub', -0.2), 0.008, px(1590))                                                          # publish and subscribe
euph(F2, W(SH, 'pubsub', 'the home', 0.1), 2.6, 0.018, px(1420))                                       # the home
strum('F', W(SH, 'pubsub', 'once', -0.2), 0.012, px(1590))                                             # each change, sent once
for x, wd in [(617, 'who reads it'), (960, 'when they act'), (1351, 'what each may see')]:
    pane(W(SH, 'three', wd, -0.2), 0.006, px(x))                                                       # the three questions

# 5. Published once: the readers, billing and customer service in each retailer; when each acts; each retailer only its own (a lock
#    on each); the network publishes each replaced reading once: the film's figure, and the three readings, each to its own retailer;
#    within the hour; the complaints team's link closed, and the complaints team reading the same messages.
ON = 'once'
air(C(ON, 'who', -0.8), 1.4, 0.005, 0.0, 200, 900)                                                     # back to the readers
knock(W(ON, 'who', 'billing', -0.2), 0.008, px(1540)); knock(W(ON, 'who', 'customer service', -0.2), 0.008, px(1540))
pencil(W(ON, 'when', 'next bill', -0.3), 0.7, 0.004, px(1640)); pencil(W(ON, 'when', 'on the phone', -0.3), 0.7, 0.004, px(1640))
tOo = W(ON, 'see', 'only its own')
for i in range(3):
    tick_(tOo - 0.2 + 0.2 * i, 0.005, px(1720))                                                        # a lock on each retailer
tPu = W(ON, 'so', 'publishes')
published(tPu - 0.6, tPu + 0.1, 0.012, px(900), px(220))                                              # published once: the figure
for i in range(3):
    air(tPu + 0.1 + 0.8 * i, 1.3, 0.005, px(1100), 200, 1000)                                          # each to its own retailer
knock(C(ON, 'hour', -0.2), 0.008, px(960)); pick(C5, W(ON, 'hour', 'soon enough'), 0.011, px(960))   # within the hour
tLc = W(ON, 'closed', 'link is closed')
tick_(tLc + 0.1, 0.005, px(980)); pick(E4, tLc + 0.3, 0.011, px(980))                                 # the link, closed
pane(W(ON, 'closed', 'same messages', 0.3), 0.006, px(1700))                                           # the complaints team too

# 6. Under a contract: the flow and the two teams at its ends (B flat major); nobody else's sign-off; each term, written; corrected
#    at home, never in the copy.
CT = 'contract'
air(C(CT, 'agreed', -1.0), 1.6, 0.005, 0.0, 200, 900)                                                  # on to the contract
strum('Bb', C(CT, 'agreed', -0.2), 0.012, 0.0)                                                         # a contract: B flat major
knock(W(CT, 'agreed', "Grace's", -0.2), 0.008, px(400)); knock(W(CT, 'agreed', "billing's", -0.2), 0.008, px(1700))
press(W(CT, 'nobody', 'nobody else', -0.1), 0.010, px(960))                                            # nobody else's sign-off
for lid, wd in [('agreed', 'agreed by'), ('what', 'what crosses'), ('soon', 'How soon'), ('late', 'late or wrong'), ('change', 'how it changes')]:
    pencil(W(CT, lid, wd, -0.1), 0.8, 0.004, px(700))                                                  # each term, written
pick(F4, W(CT, 'late', 'at home', 0.1), 0.011, px(800))                                                # corrected at home

# 7. On the map: the bands and the objects; the flow drawn across the wall; its shape, its contract and an owner at each end; eleven
#    paths: five flows, each with its contract, six closed; Data that moves, the next series (C major); the light along the flow:
#    the film's figure.
MP = 'map'
air(C(MP, 'drawn', -0.8), 1.6, 0.005, 0.0, 200, 900)                                                   # down to the map
knock(C(MP, 'drawn', 0.3), 0.008, px(960)); knock(W(MP, 'drawn', 'in meter data', -0.3), 0.008, px(400))  # the business object; the data objects
air(W(MP, 'drawn', 'across the wall', -0.1), 1.2, 0.006, px(960), 200, 1000)                          # the flow, across the wall
pane(W(MP, 'names', 'shape', -0.2), 0.006, px(960)); pane(W(MP, 'names', 'contract', -0.2), 0.006, px(960))
knock(W(MP, 'names', 'an owner', 0.0), 0.008, px(960))                                                 # an owner at each end
pane(C(MP, 'every', -0.1), 0.006, px(960))                                                             # eleven paths
tFi = C(MP, 'five')
pencil(tFi - 0.1, 1.2, 0.004, px(530))                                                                 # five flows
for i in range(3):
    tick_(tFi + 0.2 + 0.5 * i, 0.005, px(1400))                                                        # six closed
knock(W(MP, 'built', 'Data that moves', -0.3), 0.009, px(960))
strum('C', W(MP, 'built', 'Data that moves', -0.1), 0.012, 0.0)                                       # the next series: C major
published(C(MP, 'breath', 0.2), C(MP, 'breath', 0.8), 0.012, px(960), px(400))                        # the light along the flow

# 8. In time to act: Chile again (the opening's chord); new messages, many times a day, both ways (the strum up and back down); the
#    utility: every flow drawn, with its shape and its contract; the 29th of November, the nine stored days; replaced at 10:14, billing
#    has it a minute later: the figure, once more; the December bill; that month's count; who owns which data? (D, left open); the end
#    card, to the series' mark.
BK = 'back'
strum('F', C(BK, 'chile', -0.6), 0.013, -0.1)                                                          # Chile again: F major
air(W(BK, 'crossed', 'many times', -0.4), 2.0, 0.005, px(560), 200, 1000)                             # new messages along the lines
tBw = W(BK, 'crossed', 'both ways')
strum('F', tBw - 1.3, 0.011, px(700)); strum('F', tBw - 0.1, 0.010, px(700), down=True)              # both ways: up and back down
pencil(W(BK, 'utility', 'shape and its contract', -0.3), 0.9, 0.004, px(880))                        # each flow's contract
air(C(BK, 'mendoza', -0.7), 1.6, 0.005, 0.0, 200, 900)                                                 # to Quarry Lane
paper(W(BK, 'mendoza', 'twenty-ninth', -0.2), 0.007, px(1530), 0.4)                                   # the 29th of November
air(W(BK, 'mendoza', 'nine stored days', -0.5), 1.6, 0.006, px(700), 200, 1000)                       # the stored days, sent
tRp = W(BK, 'minute', 'replaced')
published(tRp - 0.5, tRp + 0.2, 0.012, px(1100), px(1530))                                            # replaced, and published
knock(W(BK, 'minute', 'a minute later', -0.3), 0.008, px(1300))                                        # billing has it
paper(C(BK, 'bill', -0.2), 0.009, px(1530), 0.5)                                                       # the December bill
tick_(W(BK, 'bill', 'charged', 0.2), 0.005, px(1800))                                                  # as read
press(W(BK, 'bill', 'nobody had to call', -0.1), 0.010, px(1530))                                      # nobody had to call
knock(W(BK, 'month', 'two thousand', -0.4), 0.009, px(960))                                            # that month
tick_(W(BK, 'nine', 'All but nine', -0.1), 0.005, px(580)); tick_(W(BK, 'nine', 'same day', -0.2), 0.005, px(580))
tWo = W(BK, 'next', 'who owns')
pane(tWo - 0.2, 0.006, 0.0); pick(D5, tWo + 0.1, 0.0105, 0.0)                                         # who owns which data? left open
damark(C(BK, 'breath', 0.9), 0.013, 0.0)                                                               # the end card: the mark
