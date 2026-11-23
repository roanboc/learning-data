# A map people and agents can read: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The film keeps the palette it had when it closed The map before the data (it moved to open Continuous
# architecture on 23 November 2026; the four series' palettes file notes it there): for Babylon at night, from 652 BCE, a vibraphone,
# bowed and struck softly, over held chords of bowed bars in B-flat minor (no borrowed sound of Mesopotamia: no lyre or harp, no reed
# pipe, no drum, no chant; the story is told in the series' own voice). The bowed notes follow the watch as it passes from one
# watcher to the next; struck notes are the sky's lights and what the watchers write down. Then, for the present, a nylon string in
# D-flat major and its neighbours: each chapter's chord spread up on it as the chapter starts, and left to ring, and a nylon note for
# each thing that lands. In the present the vibraphone comes back, struck softly, wherever the map is read and gives an answer: as
# the agent finds each element, as Zofia gets her answer, as the watcher's test is passed. The series' mark (mark()), under the title
# and the end card: four notes rising like a tower's tiers, a fifth, a fourth and a third (D flat, A flat, D flat, F), on the
# vibraphone, struck, doubled by the nylon string, its last note held by a bowed bar.
# The series' sound (proposal.md, 20 October 2026), after the author found the first cut's music a constant bed:
#  - Music plays under the opening story. After it, music comes now and then: a chapter's chord as it starts, a note under a moment
#    on screen, or a pause without words. Nothing is held under the explaining, and nothing pulses: the first cut's warm pads under
#    every chapter, and its muted pulse under the map going stale, are gone.
#  - Nothing trembles: the vibraphone is played with its motor off, the flute without vibrato, and every note has one voice, so no
#    two voices a little out of tune beat on a phone's speaker. The nylon string's upper partials die away fast, so a fifth on it
#    can't beat either.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the
#    picture in src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: wooden knocks, paper, muffled keys, low felt notes, filtered below about 2.5 kHz. The
# vibraphone's upper partial rings higher than that, so it's played with its top taken off, at 2.4 kHz, like the nylon string.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, math as _math, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))

# ---- the series' instruments, all low-passed ----
def nylon(m, start, g=0.04, pan=0.0, sec=1.8):
    """a nylon string: a few harmonics that fade from the top, warm and short"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.4) * np.exp(-x * (1.2 + 1.6 * k)) for k in range(1, 8))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2200)), start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a note arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pencil(s, g=0.02, pan=0.0, sec=0.5):
    """a pencil on paper: a soft, short scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec), s, g, pan)
def press(s, g=0.1):
    """a stamp or a confirmation: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def ring_(m, start, g=0.03, pan=0.0, sec=3.4):
    """the nylon string, plucked softly and left to ring: its upper partials die away fast, so two strings a fifth apart never hold
    overtones long enough to beat"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.5) * np.exp(-x * (0.6 + 0.5 * k * k)) for k in range(1, 7))
    s = s * np.minimum(1, x / 0.004) * np.clip((sec - x) / 0.5, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g, pan)
def turn(ch, s, g=0.03, pan=0.0):
    """a chapter's chord as its first picture comes in, spread up on the nylon string and left to ring: after the opening story, the
    music comes now and then, at a turn, a moment or a pause, instead of being held under the voice"""
    for k, m in enumerate(ch):
        ring_(m, s + 0.12 * k, g * (1.0 if k == 0 else 0.8), pan - 0.3 + 0.15 * k)
def flute_(m, start, sec, g=0.04, pan=0.0):
    """a soft flute, held steady, without vibrato (nothing trembles), with a breath as it speaks"""
    f = mf(m); x = tt(sec); ph = 2 * np.pi * f * x
    s = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)
    br = filt(noise(sec), 'band', (f * 0.8, f * 2.2)) * 0.25 * (0.35 + 0.65 * np.exp(-x * 6))
    put(norm(((s + br) * env(sec, 0.12, min(0.4, sec * 0.4))).astype(np.float32)), start, g, pan)
def air(s, sec=0.9, g=0.03, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g, pan, 140, 900)

# ---- this film's own: the vibraphone, the night, and the map kept in its tool ----
def vib(m, start, g=0.012, pan=0.0, sec=3.4):
    """the vibraphone, struck softly with yarn mallets, its motor off: a long, round note, its fourth partial dying away fast, and the
    soft thump of the mallet; its top taken off at 2.4 kHz. In the present, where the map gives an answer, it's damped after about two
    seconds (sec=2.0), so an answer is a note, not a chord left hanging under the voice"""
    f = mf(m); x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x / 1.9) + 0.22 * np.sin(2 * np.pi * 4 * f * x + 0.7) * np.exp(-x / 0.35)
    s = s * np.minimum(1, x / 0.004) * np.clip((sec - x) / 0.35, 0, 1)
    s = s + 0.04 * filt(noise(sec), 'low', 700) * np.exp(-x * 70)
    put(norm(filt(s.astype(np.float32), 'low', 2400)), start, g, pan)
def bow(m, start, sec=4.0, g=0.012, pan=0.0, rise=None):
    """the vibraphone, bowed: a pure tone that swells in as the bow draws across the bar, with a faint rasp while it's drawn, then
    rings on, fading, when the bow leaves it"""
    f = mf(m); x = tt(sec); r = rise or min(1.6, sec * 0.4)
    e = np.where(x < r, np.sin(0.5 * np.pi * np.minimum(x / r, 1)) ** 2, np.exp(-(x - r) / (0.45 * sec))) * np.clip((sec - x) / 0.3, 0, 1)
    s = (np.sin(2 * np.pi * f * x) + 0.05 * np.sin(2 * np.pi * 4 * f * x)) * e
    s = s + 0.05 * filt(noise(sec), 'band', (f * 0.9, min(2200, f * 2.5))) * np.sin(np.pi * np.clip(x / r, 0, 1)) ** 2
    put(norm(filt(s.astype(np.float32), 'low', 2400)), start, g, pan)
def bars(ch, start, sec, g=0.022):
    """a chord of bowed bars, held: each note bowed in turn, a little apart, across the stereo field, each swelling slowly at its own
    pace as the bow is drawn again; pure tones, with a trace of the fourth partial"""
    x = tt(sec); n = len(ch)
    for i, m in enumerate(ch):
        ph = 2 * np.pi * mf(m) * x
        e = env(sec, 2.6, 3.0) * (0.78 + 0.22 * np.sin(2 * np.pi * (0.05 + 0.017 * i) * x + 1.3 * i))
        put(((np.sin(ph) + 0.04 * np.sin(4 * ph)) * e).astype(np.float32), start + 0.4 * i, g * 1.6 / n, -0.7 + 1.4 * i / max(1, n - 1))
def pbed(sid, chords, a=None, b=None, g=0.035, bassg=0.02):
    """the night's chords, sustained on bowed bars over a low hum: like prog(), each starts 2 s early and lasts 4 s longer, so the
    bed never drops out"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        bars(ch, s0 + i * d - 2.0, d + 4.0, g)
        if bassg:
            drone(ch[0] - 12, s0 + i * d - 2.0, d + 4.0, bassg, 'sine')
def stylus(s, sec=1.2, g=0.012, pan=0.0):
    """a reed stylus pressed into soft clay: short, low, dry marks, a few to a word, softer than a pencil on paper"""
    r = np.random.default_rng(int(s * 10) % 997); t0 = s
    while t0 < s + sec:
        x = tt(0.07); X(filt(noise(0.07), 'band', (300, 1400)) * np.exp(-x * 50), t0, g * r.uniform(0.6, 1.0), pan + r.uniform(-0.04, 0.04))
        t0 += r.uniform(0.16, 0.3)
def river(s, sec=1.8, g=0.012, pan=0.0):
    """the river's level, written at the month's end: low water moving slowly, rising and falling once"""
    x = tt(sec); X(filt(noise(sec), 'band', (90, 600)) * np.sin(np.pi * x / sec) ** 2 * (1 + 0.2 * np.sin(2 * np.pi * 0.7 * x)), s, g, pan)
def typing(s, sec, g=0.008, pan=0.0, seed=3):
    """someone typing: muffled keys in a human rhythm, quicker and slower, with a short stop between words"""
    r = np.random.default_rng(seed); t0 = s
    while t0 < s + sec:
        tap(t0, g * r.uniform(0.7, 1.1), pan + r.uniform(-0.05, 0.05))
        t0 += r.uniform(0.09, 0.17) + (r.uniform(0.15, 0.3) if r.random() < 0.18 else 0)
def slot(s, g=0.012, pan=0.0):
    """an element filed in the map: a short, soft slide of card on card, and a low knock as it settles"""
    x = tt(0.22); X(filt(noise(0.22), 'band', (300, 1500)) * np.sin(np.pi * x / 0.22) ** 2, s, g * 0.8, pan); knock(s + 0.18, g * 0.7, pan)
def scan(s, sec=2.0, g=0.008, pan=0.0):
    """the agent reading: a soft, low whisper that moves slowly between a lower and a higher band, like a page being read"""
    x = tt(sec); k = 0.5 + 0.5 * np.sin(2 * np.pi * 0.8 * x)
    lo, hi = filt(noise(sec), 'band', (300, 700)), filt(noise(sec), 'band', (700, 1400))
    X(((lo * (1 - k) + 0.7 * hi * k) * np.sin(np.pi * x / sec) ** 1.5).astype(np.float32), s, g, pan)

# chords (MIDI note numbers). Babylon at night on bowed bars, in B-flat minor: B-flat minor, E-flat minor for the eclipse's omen and the
# cloudy night, G-flat for the slow sky, F with its fourth where the watcher stops and for the watcher's test; D-flat major as the diary
# is kept, as its years fill, and today. The present on the nylon string, in D-flat major and its neighbours: each chapter starts on its own chord
BBM9 = [46, 53, 56, 60, 61]; GBMAJ7 = [42, 49, 53, 58]; EBM9 = [39, 46, 49, 53, 54]; F7SUS = [41, 48, 51, 53, 58]
DBMAJ9 = [37, 44, 48, 51, 53]; GBMAJ9 = [42, 49, 53, 56, 58]; ABSUS4 = [44, 51, 56, 58, 61]; FM7 = [41, 48, 51, 56]; DBMAJ7 = [37, 44, 48, 53]
# the same chords for the bowed bars, voiced higher, where pure tones still carry
BBM9b = [46, 53, 56, 60, 61]; GBMAJ7b = [54, 58, 61, 65]; EBM9b = [51, 54, 58, 61, 65]; F7SUSb = [53, 58, 60, 63]
DBMAJ9b = [49, 56, 60, 63, 65]; ABSUSb = [56, 61, 63, 66]
MARK = [49, 56, 61, 65]
def mark(start, g=0.06, step=0.42, hold=2.6):
    """the series' mark: four notes rising like a tower's tiers, a fifth, a fourth and a third (D flat, A flat, D flat, F), on the
    vibraphone, struck, doubled by the nylon string, its last note held by a bowed bar"""
    for i, m in enumerate(MARK):
        vib(m + 12, start + step * i, g * 0.2, (i - 1.5) * 0.12, sec=2.4 if i < 3 else 3.4)
        nylon(m, start + step * i, g, (i - 1.5) * 0.15, sec=1.6 if i < 3 else 2.4)
    bow(MARK[3] + 12, start + step * 3 + 0.1, hold + 0.6, g * 0.2, 0.0)


# 1. The watch: bowed bars in B-flat minor under Babylon at night, from the first view of the roof to the title. A stylus on clay as
#    the scholar writes; a low bowed note as the moon's eclipse crosses it, the omen; the vibraphone, struck, as a planet starts its
#    slow path, and again at its loop; a knock as the comparison comes up, and a struck note as one watcher's working life falls short
#    of it. A low bowed note as the watcher stops and is gone; a knock of clay on brick as his record is left on the parapet; a soft
#    knock as the next watcher takes it, and a struck note as he carries on. The diary: clay as it comes up, a stylus as its nights are
#    written, struck notes, rising, as the moon, the planets and the weather are named; at the month's end, low water for the river,
#    a knock for the prices and one for the city; a low bowed note for "I did not watch". Air as the diary draws back to a tablet, a
#    knock as the next half year's tablet comes beside it, and air for the arrow. Air as the tablets go to the line of years; a long
#    bowed note as they fill it; struck notes, rising, as each line of kings is named; a knock for its two ends. A bowed note, high,
#    for Venus's eight-year cycle and one, lower, for Jupiter's eighty-three; clay and a knock as the coming year's almanac comes up.
#    Air as the line reaches today; struck notes for the eclipse records, and a bowed note as the day grows longer. At the utility, the
#    present: the bars let go, and A-flat with its fourth is spread on the nylon string; a key for the lock, a low note as the map
#    stops; a nylon note, rising, for each person who keeps it with him. A knock for the watcher's test, and a bowed note for its
#    question over the bars in F; then the bars move to D-flat major, and the mark is heard under the title.
#    Every sound uses the same word and offset as its picture in src/scenes.js (the night1, clay, now and night2 shots)
K = 'watch'
pbed(K, [BBM9b, EBM9b, GBMAJ7b], 0, cq(K, 'need'))
pbed(K, [F7SUSb], cq(K, 'need'), cq(K, 'diary'))
pbed(K, [DBMAJ9b], cq(K, 'diary'), cq(K, 'month'))
pbed(K, [GBMAJ7b], cq(K, 'month'), cq(K, 'clouds'))
pbed(K, [EBM9b], cq(K, 'clouds'), cq(K, 'tablet'))
pbed(K, [ABSUSb], cq(K, 'tablet'), cq(K, 'years'))
pbed(K, [DBMAJ9b, GBMAJ7b, DBMAJ9b], cq(K, 'years'), cq(K, 'utility') - 1.5)
pbed(K, [F7SUSb], cq(K, 'test'), cq(K, 'breath'))
pbed(K, [DBMAJ9b], cq(K, 'breath') + 0.4, None, g=0.03, bassg=0.018)
# the roof at night (the camera's x, in the frame, for each sound's place)
stylus(W(K, 'city', 'writes down'), 1.6, 0.012, px(840))
bow(53, W(K, 'signs', 'eclipse', -0.1), 4.4, 0.012, px(1180))
tP = W(K, 'slow', 'some planets')
vib(77, tP - 0.1, 0.009, px(300), sec=3.0); vib(80, tP + 2.7, 0.008, px(1000), sec=3.0)
knock(W(K, 'slow', 'seventy', -0.4), 0.012, 0.0)
vib(70, W(K, 'slow', 'working life', -0.3), 0.009, px(700), sec=2.4)
bow(49, W(K, 'need', 'lost', -0.1), 4.0, 0.013, px(900))
knock(W(K, 'need', 'a record', -0.2), 0.012, px(980))
knock(W(K, 'need', 'read', -0.1), 0.009, px(1130))
vib(73, W(K, 'need', 'carry on', -0.2), 0.011, px(1130), sec=3.0)
# the diary, its years, and today
paper(C(K, 'diary', -0.6), 0.016, 0.0, 0.8)
stylus(W(K, 'diary', 'night after night', -0.3), 2.2, 0.01, px(960))
for word, m, x in [('the moon', 65, 870), ('the planets', 68, 1000), ('the weather', 73, 1330)]:
    vib(m, W(K, 'diary', word, -0.2), 0.008, px(x), sec=2.4)
river(W(K, 'month', 'river', -0.2), 1.8, 0.012, px(600))
knock(W(K, 'month', 'prices', -0.2), 0.01, px(900)); knock(W(K, 'month', 'what had happened', -0.2), 0.01, px(1400))
bow(51, W(K, 'clouds', 'I did not watch', -0.2), 3.0, 0.011, px(800))
air(C(K, 'tablet', -0.3), 1.5, 0.01, px(700))
knock(W(K, 'tablet', 'the next watcher', -0.3), 0.012, px(1040)); air(W(K, 'tablet', 'carried on', -0.3), 0.7, 0.008, px(815))
air(C(K, 'years', -0.3), 1.4, 0.01, px(400))
bow(56, W(K, 'years', 'nearly six hundred', -0.4), 5.6, 0.011, 0.0, rise=3.0)
for word, m, x in [('Babylonian', 61, 400), ('Persian', 63, 830), ('Greek', 65, 1350), ('Parthian', 68, 1660)]:
    vib(m, W(K, 'years', word, -0.2), 0.008, px(x), sec=2.4)
knock(W(K, 'years', 'youngest', -0.3), 0.01, 0.0)
bow(77, W(K, 'cycles', 'eight years', -0.3), 2.6, 0.009, px(1200)); bow(65, W(K, 'cycles', 'eighty-three', -0.3), 3.2, 0.011, px(1340))
tPr = W(K, 'cycles', 'to predict'); paper(tPr - 0.3, 0.014, px(1700), 0.45); knock(tPr - 0.2, 0.01, px(1700))
air(W(K, 'today', 'astronomers', -0.4), 1.8, 0.01, 0.0)
tEr = W(K, 'today', 'eclipse records'); vib(73, tEr, 0.008, px(400), sec=2.4); vib(80, tEr + 0.5, 0.007, px(600), sec=2.4)
bow(68, W(K, 'today', 'the day', -0.3), 3.4, 0.01, px(1300), rise=2.0)
# the utility, now
turn(ABSUS4, C(K, 'utility', -0.6), 0.026, 0.0)
tap(W(K, 'utility', 'only he', -0.2), 0.009, px(1200)); soft(46, W(K, 'utility', 'stops', -0.1), 0.018, 0.0)
tEv = W(K, 'outlive', 'everyone')
for i, (m, x) in enumerate([(68, 300), (70, 540), (73, 1380)]):
    nylon(m, tEv - 0.5 + i * 0.2, 0.012, px(x))
# Babylon again: the watcher's test, and the title
knock(C(K, 'test', -0.1), 0.014, 0.0); bow(65, W(K, 'test', 'could'), 3.0, 0.011, 0.0)
mark(G(K, 'breath', 1.5))
# 2. Useful, so at risk: paper as Tomás's note goes up, a knock for the map; paper as each use is pinned beside it, and a nylon note,
#    rising, as the map is used; a muffled key for each week it's been used. A low note as it goes stale, and nothing more: no pulse,
#    the picture greys on its own. The chapter's chord, D-flat, as Tomás's note goes up. Paper for the slides, a knock for the modelling tool and a key for
#    its lock; air as the copies fly to their decks, paper as they land, and a pencil as each drifts; knocks for the glossary and the
#    catalogue, and a low note that doesn't fit the chord for their different words. Air as the board pack's copy is lifted to the
#    front, a knock for "trusted", a low knock and a low note for "out of date"; air as Tomás fades; a knock for the watcher's
#    test, and a press and a low note for its cross. Before the copies, its applications: a knock for the IT service management
#    tool, muffled keys as one application's name is typed in by hand, air as it's carried up into the map and a knock as it lands;
#    a low knock for each of the three that have changed since, one low note, and a key for the tag that says so
R = 'risk'
turn(DBMAJ9, S0(R) + 0.3, 0.03, px(330))
paper(S0(R) + 0.3, 0.03, px(330), 0.5)
knock(S0(R) + 0.6, 0.018, 0.0)
for word, pan in [('requests', px(330)), ('rules', px(1590)), ('minister', px(1590))]:
    t0 = W(R, 'used', word, -0.2); paper(t0, 0.022, pan, 0.4)
    if word == 'requests':
        nylon(61, t0 + 0.2, 0.016, 0.0)
    else:
        knock(t0 + 0.2, 0.01, pan)
tU = C(R, 'used')
for i in range(10):
    tap(tU + 0.4 + i * 0.45, 0.007, px(780 + i * 40))
soft(46, C(R, 'stale', 0.1), 0.022, 0.0)
for k in range(3):
    paper(C(R, 'slides', -0.1 + k * 0.12), 0.016, px(320), 0.35)
knock(W(R, 'slides', 'modelling tool', -0.2), 0.016, px(1580)); tap(W(R, 'slides', 'modelling tool', 0.1), 0.01, px(1748))
tY = C(R, 'typed')
knock(tY + 0.1, 0.014, px(960)); typing(W(R, 'typed', 'typed'), 0.9, 0.007, px(960), seed=11)
tUp = W(R, 'typed', 'from', -0.2)
air(tUp, 1.1, 0.01, px(960)); knock(tUp + 1.0, 0.012, px(960))
tCh = W(R, 'typed', 'many')
for i, x in enumerate([760, 960, 1060]):
    s_knock(tCh + i * 0.25, 0.008, px(x), 170)
s_knock(tCh + 0.85, 0.012, px(960), 150); tap(W(R, 'typed', 'since', -0.3), 0.008, px(500))
tC = C(R, 'copies')
for i, x in enumerate([800, 1130, 1460]):
    air(tC + 0.2 + i * 0.35, 1.1, 0.01, px((330 + x) / 2)); paper(tC + 1.2 + i * 0.35, 0.016, px(x), 0.35)
tCd = W(R, 'copies', 'drift')
for i, x in enumerate([800, 1130, 1460]):
    pencil(tCd - 0.2 + i * 0.25, 0.011, px(x), 0.3)
knock(W(R, 'copies', 'glossary', -0.2), 0.016, px(1580)); knock(W(R, 'copies', 'catalogue', -0.2), 0.016, px(1580))
s_knock(W(R, 'copies', 'own words'), 0.014, px(1580), 150)
tW = C(R, 'worse'); air(tW - 0.1, 0.9, 0.014, 0.0)
tT = W(R, 'worse', 'trust'); knock(tT - 0.3, 0.014, -0.1)
s_knock(tT + 0.4, 0.016, 0.25, 160); thud(tT + 0.45, 0.06)
air(C(R, 'fails', 0.3), 1.4, 0.01, px(1730))
tX = W(R, 'fails', 'fails')
knock(W(R, 'fails', 'nobody', -0.3), 0.014, 0.0)
press(tX, 0.022); soft(41, tX + 0.05, 0.022, 0.0)
# 3. One map, many sources: the chapter's chord, F minor, as the map's window comes in, with air as the wall gives way, a knock for
#    the window, paper as the slide goes, and a ripple of soft keys as its boxes land in the graph; a key for each of the people who
#    use it, and a nylon note for the database and one for the graph. A breath of air as what's kept elsewhere empties. A knock and
#    paper for each source as it arrives, and a nylon note, rising; air along the threads as each source brings its elements in, and
#    a soft key as each one fills. Paper and a knock for billing's page, a nylon note for its source's ID, a press for "in step" and
#    air along the threads as they keep it in step. A key for "written in the map", a nylon note, rising, for each thing written
#    there, and air as the links light. Paper and a knock for the glossary's term, a key for who defined it and a press for the tick.
#    A knock and air along the threads for data integration, and three nylon notes as the map's own nodes light, for modelling
SO = 'sources'
tE = W(SO, 'move', 'enterprise')
turn(FM7, tE - 0.5, 0.028, px(600))
air(tE - 0.6, 1.2, 0.012, px(600)); knock(tE - 0.4, 0.014, px(600))
fl0 = tE - 0.1
paper(fl0, 0.014, px(960), 0.5)
for n in range(6):
    tap(fl0 + 1.1 + n * 0.14, 0.004, px(420 + n * 110))
for i in range(4):
    tap(W(SO, 'move', 'everyone', -0.1 + i * 0.3), 0.005, px(1120 - i * 46))
knock(W(SO, 'move', 'database'), 0.01, px(520)); knock(W(SO, 'move', 'graph'), 0.01, px(720))
air(W(SO, 'kept', 'already'), 0.9, 0.01, px(700))
for word, m in [('Strategy', 60), ('goals', 63), ('applications', 65)]:
    t0 = W(SO, 'where', word, -0.2); knock(t0, 0.013, px(1550)); paper(t0 + 0.05, 0.014, px(1550), 0.35)
    if word == 'Strategy':
        nylon(m, t0 + 0.25, 0.013, px(1550))
thr = lambda k: W(SO, 'in', 'brings', -0.3 + k * 0.4)
for k in range(3):
    air(thr(k) + 0.4, 0.8, 0.008, px(1200))
# what each source brings in (scenes.js D11_GN: row, place across, source) fills as its thread reaches it, from the right
for r, u, k in [(0, 0.12, 0), (0, 0.38, 1), (0, 0.62, 1), (1, 0.1, 0), (1, 0.3, 1), (4, 0.1, 2), (4, 0.3, 2), (4, 0.5, 2), (4, 0.7, 2),
                (5, 0.15, 2), (5, 0.38, 2), (5, 0.62, 2), (5, 0.85, 2)]:
    x = 380 + u * 740
    if r != 5:  # one key for each source's first rows; the last row fills without its own
        tap(thr(k) + 0.9 + (1166 - x) / 1400, 0.004, px(x))
tPg = W(SO, 'in', "source's", -0.3); paper(tPg, 0.014, px(760), 0.4); knock(tPg + 0.05, 0.012, px(760))
slot(W(SO, 'in', "source's ID", -0.1), 0.012, px(760))
press(W(SO, 'in', 'in step', -0.1), 0.014)
for k in range(3):
    air(W(SO, 'in', 'in step', k * 0.1), 0.9, 0.006, px(1200))
tap(W(SO, 'rest', 'written', -0.2), 0.008, px(700))
for word, m in [('capabilities', 56), ('rules', 60), ('decisions', 63), ('links', 68)]:
    nylon(m, W(SO, 'rest', word, -0.15), 0.012, px(900))
air(W(SO, 'rest', 'links'), 1.0, 0.008, px(700))
tGt = W(SO, 'terms', 'business object', -0.4); paper(tGt, 0.014, px(760), 0.4); knock(tGt + 0.05, 0.012, px(760))
tap(W(SO, 'terms', 'defined', -0.1), 0.008, px(600)); press(W(SO, 'terms', 'by the business', 0.3), 0.014)
tDI = W(SO, 'job', 'data integration')
knock(tDI - 0.3, 0.012, px(770))
for k in range(3):
    air(tDI - 0.1 + k * 0.12, 0.9, 0.008, px(1200))
tMo = W(SO, 'job', 'modelling')
for i, m in enumerate([53, 56, 60]):
    nylon(m, tMo + 0.1 + i * 0.2, 0.012, px(500 + i * 250))
# 4. Each element once: a knock and a nylon note for each of the six elements, rising; air and paper as the rule's page opens, and a
#    muffled key for each line as it's filled in; a nylon note for its stable ID, a pencil as its name changes, a low nylon note for
#    "IDs don't", a knock for each thing that points to it; two nylon notes for the lines ArchiMate names; paper for day one's two
#    rules, a key for each arrow, a press for the tick; a knock and paper for the decision, keys for its lines, and a nylon note for
#    its "why". Then the same element twice: a knock for its page in the tool, paper and keys for its text file, a key for "the
#    simplest approach", a knock for each tag of the utility's scale, and D-flat in two octaves, one on each side, for "the same
#    ideas". The chapter's chord, G-flat, as the six arrive. Then the wordless moment: keys as the map's side panel appears, air as
#    the element flies into it, and it's filed; under it, D-flat spread on the nylon string, and the flute, three notes falling home
TX = 'text'
turn(GBMAJ9, S0(TX) + 0.3, 0.028)
for i, (k, m) in enumerate(zip(['capability', 'step', 'domain', 'business object', 'rule', 'measure'], [61, 63, 65, 68, 70, 73])):
    t0 = W(TX, 'once', k, -0.15); pan = px(400 + (i % 3) * 560)
    knock(t0, 0.016, pan); nylon(m, t0 + 0.05, 0.016, pan)
tI = C(TX, 'id')
air(tI - 0.3, 0.8, 0.012, -0.3); paper(tI, 0.02, -0.3, 0.45)
for t0 in [tI, tI + 0.3, W(TX, 'fields', 'named as', -0.3), W(TX, 'fields', 'definition'), W(TX, 'fields', 'definition', 0.2),
           W(TX, 'fields', 'definition', 0.4), W(TX, 'fields', 'owner'), W(TX, 'fields', 'relationships'),
           W(TX, 'fields', 'relationships', 0.25), W(TX, 'fields', 'relationships', 0.5), W(TX, 'rules', 'evidence'), W(TX, 'rules', 'whether')]:
    tap(t0, 0.008, -0.35)
nylon(73, W(TX, 'id', 'stable ID'), 0.016, -0.5)
pencil(W(TX, 'id', 'Names change', 0.3), 0.012, -0.4, 0.9)
tap(W(TX, 'id', "IDs don't"), 0.009, -0.5)
for i in range(3):
    knock(W(TX, 'id', 'everything', i * 0.25 - 0.2), 0.014, px(1620))
tA = W(TX, 'fields', 'ArchiMate'); knock(tA, 0.01, 0.35)
paper(W(TX, 'rules', 'two rules', -0.2), 0.018, px(1340), 0.4)
tap(W(TX, 'rules', 'evidence'), 0.01, 0.4); tap(W(TX, 'rules', 'whether'), 0.01, 0.45)
press(W(TX, 'rules', 'confirmed'), 0.018)
tD = C(TX, 'decisions')
knock(tD - 0.3, 0.016, px(1340)); paper(tD - 0.25, 0.02, px(1340), 0.4)
for i in range(7):
    tap(tD + 0.1 + i * 0.2, 0.006, px(1340))
slot(W(TX, 'decisions', 'why'), 0.012, px(1340))
knock(C(TX, 'files', -0.3), 0.014, px(510))
tTF = W(TX, 'files', 'text files', -0.3); paper(tTF, 0.016, px(1410), 0.4)
for i in range(5):
    tap(tTF + 0.15 + i * 0.12, 0.006, px(1410))
tap(W(TX, 'files', 'simplest', -0.2), 0.008, px(1200))
for word, x in [('many sources', 220), ('many people', 560)]:
    knock(W(TX, 'scale', word, -0.2), 0.01, px(x))
tSm = W(TX, 'scale', 'Either way', 0.1); knock(tSm, 0.01, 0.0)
B_ = G(TX, 'breath')
for i in range(7):
    tap(B_ + i * 0.17, 0.007, px(300))
air(B_ + 0.3, 1.0, 0.012, -0.2)
slot(B_ + 1.25, 0.012, px(150))
turn(DBMAJ7, B_ + 0.2, 0.026, -0.2)
for i, (m, d) in enumerate([(68, 0.7), (65, 0.7), (61, 1.6)]):
    flute_(m, B_ + 0.6 + i * 0.62, d, 0.016, 0.1)
# 5. Reviewed and versioned: a muffled key for each version in the history, as who changed what is listed; air as the versions fly
#    to their line under the map's side panel, and a knock as each lands; a knock and paper for the change request, a pencil for each
#    line of its change; a knock as each owner is asked, a press and a nylon note as each approves; a nylon note as it's approved, and
#    a knock as its version joins the line. Paper as it folds; a knock for the checks, keys as they run down the side panel, a key for
#    each check, a press and a nylon note for each that passes. Then a low note as the first turns amber, a knock for generating
#    power's page, a low note for its missing owner, and a soft knock for each version the check has flagged. The chapter's chord,
#    A-flat with its fourth, as it starts
RV = 'review'
turn(ABSUS4, S0(RV) + 0.3, 0.028, px(1220))
for i in range(4):
    tap(W(RV, 'repo', 'who changed', -0.3 + i * 0.22), 0.008, px(1220))
f0 = C(RV, 'pr', -1.1)
air(f0, 1.6, 0.012, -0.2)
for i in range(4):
    knock(f0 + (3 - i) * 0.15 + 1.0, 0.009, px(120 + (3 - i) * 90))
knock(C(RV, 'pr', 0.05), 0.018, px(1220)); paper(C(RV, 'pr', 0.1), 0.022, px(1220), 0.45)
for i in range(4):
    pencil(W(RV, 'pr', 'proposed', -0.2 + i * 0.35), 0.01, px(1220), 0.35)
tap(C(RV, 'pr', 0.3), 0.008, px(300))
for who, d, m in [('Grace', 0.6, 65), ('Ama', 0.7, None)]:
    knock(W(RV, 'owner', who, -0.2), 0.012, px(1500)); press(W(RV, 'owner', who, d), 0.016)
    if m:
        nylon(m, W(RV, 'owner', who, d + 0.05), 0.016, px(1500))
tap(W(RV, 'owner', 'Ama'), 0.008, px(1220))
ap = W(RV, 'owner', 'obligations', 0.8)
slot(ap, 0.012, px(1220)); knock(ap + 0.4, 0.012, px(480))
tCk = C(RV, 'checks')
paper(tCk - 0.9, 0.016, px(1220), 0.6); knock(tCk - 0.3, 0.016, px(1220))
for i in range(7):
    tap(tCk + 0.1 + i * 0.31, 0.006, px(300))
for word, m in [('Every element', None), ('Every rule', 65), ('Every measure', 68)]:
    tap(W(RV, 'list', word), 0.01, px(1220))
    if m:
        press(W(RV, 'list', word, 1.4), 0.014)
tPw = C(RV, 'power')
soft(44, tPw + 0.2, 0.022, px(1220)); knock(tPw + 0.5, 0.016, px(1450)); soft(39, tPw + 1.0, 0.02, px(1450))
for i in range(5):
    knock(tPw + 0.6 + i * 0.25, 0.007, px(140 + i * 80))
# 6. One map, many views: air as the threads run out from the map, and a knock for each view as it arrives; air as meaning runs along
#    them, one way; a nylon note, rising, as each view is named, and a key for each reader. Air as they move aside; a knock for dbt's
#    chip, paper for its model, keys for its owner and domain and a nylon note for its rules' IDs; the same for Databricks, with a
#    nylon note for its lineage. Paper for the glossary; air as the pencil goes to it, a low knock and a low note as it can't write
#    there; air as it goes to the map, a pencil as the fix is made there, air as the fix runs out along every thread, nylon notes as
#    the views follow, and a pencil and a nylon note as the glossary changes with them. The chapter's chord, D-flat, as it starts
VW = 'views'
turn(DBMAJ9, S0(VW) + 0.3, 0.028)
tG = C(VW, 'gen')
air(tG + 0.4, 1.8, 0.014, 0.2)
for k in range(6):
    knock(tG + 0.9 + k * 0.15, 0.01, px(1320))
air(W(VW, 'gen', 'one way', -0.2), 1.4, 0.012, 0.25)
for k, (name, m) in enumerate(zip(['ArchiMate', 'glossary', 'conceptual', 'ontology', 'tests', 'heat'], [61, 63, 65, 68, 70, 73])):
    if k == 0:
        nylon(m, W(VW, 'list', name, -0.2), 0.015, px(1320))
    else:
        knock(W(VW, 'list', name, -0.2), 0.008, px(1320))
for k in range(6):
    tap(C(VW, 'readers', 0.2 + k * 0.25), 0.008, px(1700))
tDb, tDx = C(VW, 'dbt'), C(VW, 'dbx')
air(tDb - 1.5, 1.5, 0.012, px(1500))
knock(tDb - 0.2, 0.014, px(1650)); paper(tDb + 0.05, 0.02, px(980), 0.45)
tap(W(VW, 'dbt', 'owner', -0.1), 0.009, px(980)); tap(W(VW, 'dbt', 'domain', -0.1), 0.009, px(980))
tap(W(VW, 'dbt', 'IDs', -0.1), 0.009, px(980))
knock(tDx - 0.2, 0.014, px(1650)); paper(tDx + 0.05, 0.02, px(980), 0.45)
for word in ['owner', 'tags', 'description']:
    tap(W(VW, 'dbx', word, -0.1), 0.009, px(980))
tap(W(VW, 'dbx', 'lineage', -0.1), 0.009, px(980))
tN = C(VW, 'nobody')
paper(tN - 0.9, 0.018, px(980), 0.45)
pIn, pBl, pGo = tN - 0.3, W(VW, 'nobody', 'edits', 0.15), W(VW, 'nobody', 'fix', -0.3)
pAt = pGo + 0.9; pul = pAt + 0.15
air(pIn, 0.8, 0.008, px(1100))
s_knock(pBl, 0.016, px(1040), 150)
air(pGo, 0.9, 0.012, px(700)); pencil(pAt, 0.014, px(372), 0.5)
air(pul, 1.2, 0.014, 0.2)
for k, m in enumerate([61, 65, 68, 73]):
    nylon(m, pul + 0.9 + k * 0.14, 0.012, px(1300) + 0.1 * k)
pencil(pul + 1.1, 0.012, px(980), 0.6); nylon(73, pul + 1.15, 0.014, px(980))
# 7. An agent reads it: the vibraphone, struck, as the agent arrives, and a low whisper as it reads; a knock for each request and
#    change, and a key as it asks who will decide what with the answer; a struck note, rising, as it finds the decision, the capability and the owner; paper
#    for the dashboard request, and a low note as it reaches nothing. A pencil for "as for the social tariff"; a knock and a struck
#    note for each layer the agent walks through, falling as it goes down; a knock for the owners who must agree, and a key for each.
#    A knock for the column, air as the agent goes to the rules, a knock and a struck note for the rule it finds, keys for its lines,
#    struck notes for its owner and its reason. Paper for the answer, a pencil under its IDs, a key as a person opens a source, paper
#    as it opens, a pencil for what it says, and a press and a struck note as the answer checks out. The chapter's chord, G-flat
RD = 'reads'
turn(GBMAJ9, S0(RD) + 0.3, 0.028)
tAg = C(RD, 'now')
vib(68, tAg - 0.3, 0.013, px(600), sec=2.0); air(tAg - 0.3, 0.8, 0.008, px(600)); scan(tAg + 0.3, 2.4, 0.008, px(570))
knock(C(RD, 'request', -0.1), 0.016, px(1270)); tap(W(RD, 'request', 'asks', -0.2), 0.01, px(1000))
scan(W(RD, 'request', 'asks', -0.2), W(RD, 'request', 'decision') - W(RD, 'request', 'asks', -0.2), 0.007, px(570))
knock(W(RD, 'request', 'decision', -0.4), 0.012, px(1270))
for word, m in [('decision', 65), ('capability', 68), ('owner', 73)]:
    vib(m, W(RD, 'request', word, -0.1), 0.013, px(1270), sec=2.0)
tNo = W(RD, 'request', 'nothing')
paper(tNo - 1.0, 0.016, px(1270), 0.4); soft(42, tNo - 0.1, 0.02, px(1560))
knock(C(RD, 'change', -0.1), 0.016, px(1270)); pencil(W(RD, 'change', 'social', -0.2), 0.01, px(1500), 0.4)
walk0 = W(RD, 'change', 'walks', -0.3)
scan(walk0, 2.9, 0.007, px(570))
for i, (row, m) in enumerate(zip([0, 2, 3, 5], [73, 70, 68, 63])):
    t0 = walk0 + row / 5 * 2.8; knock(t0, 0.01, px(1270))
tOw = W(RD, 'change', 'owners')
knock(tOw - 0.3, 0.014, px(1270))
for i in range(3):
    tap(tOw + i * 0.3, 0.009, px(1270))
tK = C(RD, 'column')
knock(tK - 0.1, 0.016, px(1270)); tap(tK + 0.4, 0.009, px(1270)); air(tK + 0.2, 0.9, 0.01, px(570))
tRu = W(RD, 'column', 'rule')
scan(tK + 0.2, tRu + 0.5 - tK - 0.2, 0.007, px(570))
knock(tRu - 0.3, 0.014, px(1270)); slot(tRu - 0.25, 0.012, px(1270))
for i in range(4):
    tap(tRu - 0.1 + i * 0.2, 0.007, px(1270))
tap(W(RD, 'column', 'owner', -0.1), 0.009, px(1270)); tap(W(RD, 'column', 'reason', -0.1), 0.009, px(1270))
tCi = C(RD, 'cites'); ck = W(RD, 'cites', 'check')
paper(tCi - 0.3, 0.024, px(1270), 0.5); pencil(W(RD, 'cites', 'IDs', -0.1), 0.01, px(1270), 0.5)
tap(ck - 0.1, 0.012, px(1400)); paper(ck, 0.02, px(1270), 0.4); pencil(ck + 0.5, 0.01, px(1270), 0.6)
press(ck + 0.9, 0.018); vib(73, ck + 0.95, 0.013, px(1270), sec=2.0)
# 8. An agent on the map: air as the agent goes into the map, and a knock and a struck note as it lands there, in its application
#    layer; a knock and paper for its page, keys for its lines; a knock for the outage agent's; a nylon note for what it may do, a low knock and a low
#    note for what it may not. Two knocks for the two sources, a low note that doesn't fit the chord for their disagreement, a key for
#    the arrow, paper and a nylon note for the question to the owner. A key for its owner, a press for the tick, a pencil as draft
#    becomes confirmed, and a press and a nylon note for that tick. Then a knock for the rule, a nylon note, rising, for each of its
#    three parts, a pencil as data models becomes the map, and D-flat spread on the nylon string as it's applied. The chapter's
#    chord, B-flat minor, as it starts: the agent's limits
RG = 'rights'
turn(BBM9, S0(RG) + 0.3, 0.028)
fa, fb = C(RG, 'on', -0.2), W(RG, 'on', 'map itself', 0.2)
air(fa, fb - fa, 0.012, -0.3); knock(fb - 0.1, 0.012, px(404)); vib(68, fb, 0.013, px(404), sec=2.0)
tAc, tRl, rw, own = W(RG, 'on', 'software'), W(RG, 'on', 'role'), W(RG, 'on', 'rights'), W(RG, 'owner', 'Tomás')
knock(tAc - 0.4, 0.016, px(1270)); paper(tAc - 0.35, 0.018, px(1270), 0.4)
for t0 in [tAc - 0.2, tAc, tAc + 0.2, tRl - 0.1, rw - 0.3, rw - 0.05, rw + 0.2, rw + 0.45, rw + 0.9, rw + 1.1]:
    tap(t0, 0.007, px(1270))
knock(W(RG, 'on', 'outage', -0.5), 0.012, px(1270))
nylon(65, W(RG, 'may', 'read'), 0.016, px(1790)); s_knock(W(RG, 'may', 'may not'), 0.016, px(1790), 160)
tAs = C(RG, 'asks')
knock(tAs - 0.2, 0.012, px(900)); knock(tAs + 0.2, 0.012, px(1300))
s_knock(W(RG, 'asks', 'disagree', -0.1), 0.014, px(1100), 150); tap(tAs + 0.2, 0.009, px(1790))
tOq = W(RG, 'asks', 'owner')
paper(tOq - 0.4, 0.018, px(1678), 0.4); knock(tOq, 0.01, px(1678))
tap(own - 0.2, 0.008, px(1270)); press(own + 0.5, 0.016); pencil(own + 0.8, 0.01, px(1270), 0.6)
press(own + 1.3, 0.016)
tS = C(RG, 'same')
knock(tS - 0.3, 0.016, px(1270))
for word, m in [('Agents', 61), ('people', 65), ('every version', 68)]:
    nylon(m, W(RG, 'same', word, -0.1), 0.016, px(1270))
tAp = W(RG, 'same', 'applied')
pencil(tAp - 0.1, 0.01, px(1270), 0.6); turn([37, 44, 49, 53], tAp + 0.4, 0.024, px(1270))
# 9. People confirm: the chapter's chord, E-flat minor, as the retail code comes in: a knock and paper for it, a key as the clause
#    lights, a pencil for each line of the sentence the regulator adds, written in as it's read; air as the agent leaves its row,
#    and a low whisper as it reads the rules; a knock and a struck note for the rule it finds, keys for its lines and for retail's
#    half, a struck note for its reason, a knock for its pair. Air as the agent goes to its draft, a knock and paper for the change
#    request, a pencil for each line, a key for the tracking table and for each view it touches; a press and a nylon note as the head
#    of retail confirms it, two nylon notes as it's confirmed, and a knock and a nylon note as its version joins the line. Paper as it
#    folds; a knock and paper for the billing team's tracking table, a key for each bill, a pencil as its window is rewritten, and a
#    low knock and a low note as the bill past it shows as late
CF = 'confirm'
turn(EBM9, S0(CF) + 0.3, 0.028, px(1270))
knock(C(CF, 'code', -0.2), 0.018, px(1270)); paper(C(CF, 'code', -0.15), 0.022, px(1270), 0.5)
tap(C(CF, 'clause'), 0.01, px(1270))
tCl = C(CF, 'clause'); dCl = W(CF, 'clause', 'not') - tCl
pencil(tCl - 0.1, 0.011, px(1100), dCl * 44 / 95); pencil(tCl - 0.1 + dCl * 44 / 95, 0.011, px(1100), dCl * 51 / 95)
tFd = C(CF, 'finds'); tRe = W(CF, 'finds', 'reason')
air(tFd - 0.6, 0.8, 0.01, px(500)); scan(tFd + 0.2, tRe + 0.3 - tFd - 0.2, 0.008, px(450))
t1 = W(CF, 'finds', 'one rule')
knock(t1 - 0.3, 0.014, px(1270)); vib(65, t1 - 0.2, 0.013, px(1270), sec=2.0)
for i in range(7):
    tap(t1 - 0.1 + i * 0.15, 0.006, px(1270))
tap(W(CF, 'finds', "retail's", -0.2), 0.009, px(1270)); vib(70, tRe - 0.2, 0.013, px(1270), sec=2.0)
knock(W(CF, 'finds', 'half', -0.4), 0.012, px(1270))
tDr = C(CF, 'drafts')
air(tDr - 0.3, 0.9, 0.01, px(600)); knock(tDr - 0.1, 0.016, px(1270)); paper(tDr - 0.05, 0.02, px(1270), 0.45)
for i in range(4):
    pencil(W(CF, 'drafts', 'new words', -0.3 + i * 0.3), 0.01, px(1270), 0.3)
tTb, tTv = W(CF, 'drafts', 'tracking table'), W(CF, 'drafts', 'two views')
tap(tTb - 0.2, 0.009, px(1000)); tap(tTv - 0.2, 0.009, px(1300)); tap(tTv + 0.15, 0.009, px(1550))
conf = W(CF, 'confirms', 'confirms', 0.1)
press(conf, 0.026); nylon(61, conf + 0.05, 0.018, px(1600))
nylon(68, conf + 0.6, 0.016, px(1270)); nylon(73, conf + 0.72, 0.014, px(1270))
knock(conf + 0.9, 0.012, px(300)); nylon(65, conf + 0.95, 0.014, px(300))
paper(C(CF, 'track', -0.7), 0.016, px(1270), 0.6)
tTk = W(CF, 'track', 'tracking table')
knock(tTk - 0.4, 0.014, px(1270)); paper(tTk - 0.35, 0.018, px(1270), 0.4)
for i in range(3):
    tap(W(CF, 'track', 'each bill', -0.2 + i * 0.2), 0.008, px(1270))
pencil(W(CF, 'track', 'within', -0.1), 0.01, px(1100), 0.6)
tLt = W(CF, 'track', 'working days', 0.2)
s_knock(tLt, 0.014, px(1700), 160); thud(tLt + 0.05, 0.05)
# 10. Day one, again: a knock for her badge, paper for the page of acronyms and the list of systems, and muffled keys as the list runs
#    on; the vibraphone, struck and bowed, as the map arrives on her desk; a knock for the chat, keys as she types her question, a
#    struck note, rising, for each part of the answer, and a pencil under its links; a knock and paper for her first change, keys as
#    she writes it, and a nylon note for Grace. The chapter's chord, D-flat, as her first day starts
AG = 'again'
turn(DBMAJ9, S0(AG) + 0.3, 0.028, px(260))
knock(W(AG, 'day', 'badge', -0.2), 0.016, px(260)); paper(W(AG, 'day', 'acronyms', -0.2), 0.022, px(630), 0.45)
tLs = W(AG, 'day', 'list')
paper(tLs - 0.2, 0.02, px(1070), 0.45)
for k in range(8):
    tap(tLs + 0.1 + k * 0.19, 0.006 * (1 - 0.06 * k), px(1070))
tMp = C(AG, 'map')
vib(61, tMp - 0.2, 0.014, px(630), sec=2.0); bow(68, tMp - 0.1, 4.0, 0.011, px(630))
tAs2 = C(AG, 'asks'); ans = W(AG, 'gets', 'owner')
knock(tAs2 - 0.4, 0.016, px(820)); typing(tAs2 + 0.1, 2.6, 0.008, px(820))
for t0, m in [(ans - 0.2, 65), (W(AG, 'gets', 'two rules', -0.1), 68), (W(AG, 'gets', 'two rules', 0.4), 73)]:
    vib(m, t0, 0.013, px(820), sec=2.0)
pencil(W(AG, 'gets', 'links', -0.1), 0.01, px(820), 0.6)
tFi = C(AG, 'first')
knock(tFi - 0.3, 0.016, px(820)); paper(tFi - 0.25, 0.02, px(820), 0.45)
typing(W(AG, 'first', 'drafted', -0.1), 0.9, 0.007, px(820), seed=5)
knock(W(AG, 'first', 'Grace', 0.3), 0.01, px(820))
# 11. Back to the watch: Babylon again, now and then. The bowed bars in D-flat as the roof comes back; a knock of clay as each
#     watcher's tablet goes on the pile. Air as the line of years comes up, and struck notes, rising, as its kings light. At the
#     utility: a knock and paper for Zofia's change, a press as Grace confirms it; a press, a struck note and a bowed one as the
#     watcher's test is passed. By the summer: a knock as the map comes up, a breath of air as the thirty who keep it gather round it,
#     and a nylon note, rising, for each change an owner confirms; air as Tomás goes, and a card filed as a change is confirmed
#     without him
BK = 'back'
s0b = S0(BK)
bars(DBMAJ9b, s0b + 0.2, 4.4, 0.022)
for i in range(3):
    knock(s0b + 0.5 + i * 1.75 + 2.1, 0.01, px(1290))
air(C(BK, 'kings', -0.6), 1.0, 0.01, 0.0)
tKi = W(BK, 'kings', 'every king')
for i, (m, x) in enumerate(zip([61, 63, 65, 68], [400, 830, 1350, 1660])):
    vib(m, tKi - 0.2 + i * 0.25, 0.008, px(x), sec=2.4)
tCb = C(BK, 'confirm'); knock(tCb - 0.4, 0.014, px(600)); paper(tCb - 0.35, 0.018, px(600), 0.45)
press(W(BK, 'confirm', 'confirms', 0.1), 0.02)
tPs = W(BK, 'confirm', 'passes')
press(tPs, 0.018); vib(73, tPs + 0.05, 0.014, px(600), sec=2.0); bow(77, tPs + 0.2, 2.6, 0.01, px(600))
knock(C(BK, 'summer', -0.4), 0.014, px(610))
air(W(BK, 'summer', 'thirty', -0.2), 1.8, 0.01, px(610))
for i, m in enumerate([65, 68, 73]):
    nylon(m, W(BK, 'summer', 'confirm') + i * 0.6, 0.012, px(420 + i * 190))
tLf = W(BK, 'left', 'left'); air(tLf - 0.1, 1.2, 0.01, px(1800)); slot(tLf + 1.6, 0.012, px(820))
# 12. A map people and agents can read: how the map is kept, and how it changes, in six cards: D-flat spread on the nylon string as
#     the first comes up, and a soft knock as each of the others lands; paper and a knock for what's next. Under the end card, without
#     words, the bowed bars once more, the vibraphone, and the mark
Z = 'end'
turn([37, 44, 49, 53, 56], W(Z, 'answer', 'once', -0.2), 0.024, px(550))
for lid, word, x in [('answer', 'ID', 550), ('answer', 'every view', 550), ('keep', 'Review', 1370), ('keep', 'agents', 1370), ('keep', 'owners confirm', 1370)]:
    knock(W(Z, lid, word, -0.2), 0.011, px(x))
tNx = C(Z, 'next'); paper(tNx - 0.2, 0.016, 0.0, 0.45); knock(tNx - 0.15, 0.012, 0.0)
bars(DBMAJ9b, G(Z, 'breath', -0.2), E(Z) - G(Z, 'breath', -0.2) + 1.0, 0.016)
vib(77, G(Z, 'breath', 0.6), 0.012, 0.3)
mark(G(Z, 'breath', 1.4))
