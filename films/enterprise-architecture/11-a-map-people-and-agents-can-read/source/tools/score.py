# A map people and agents can read: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for the Pacific, in 1976 and in
# 2007 to 2026, a vibraphone, bowed and struck softly, over held chords of bowed bars in B-flat minor, and the open ocean itself, as
# long, low swells with no surf (no borrowed Pacific sound: no drums, no flutes of the islands, no slide guitar, no chant; the story is
# told in the series' own voice). The bowed notes follow the light as knowledge passes from navigator to apprentice; struck notes are
# the stars and the lights of the people who learn. Then nylon-string plucks and a soft flute over warm pads, here in D-flat major,
# for the present, and the series' own mark, four notes rising 1-3-5-8, on the flute and the nylon string together, at the title and
# the end. In the present the vibraphone comes back, struck softly, wherever the map is read and gives an answer: as the agent finds
# each element, as Zofia gets her answer, as the navigator's test is passed. A slow, muted pulse, leaning on the semitone, rises under
# the map going stale and fades as it moves to text. At the very end, as the meaning is handed over, From words to data's own four
# notes, 1-5-6-3, on its felt piano.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the chapters; nothing repeats in the background. The
#    ocean is on screen whenever it's heard, and each of its swells has its own length and size.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
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
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')
def air(s, sec=0.9, g=0.03, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g, pan, 140, 900)

# ---- this film's own: the vibraphone, the ocean, and the map kept as files ----
def vib(m, start, g=0.012, pan=0.0, sec=3.4):
    """the vibraphone, struck softly with yarn mallets: a long, round note, its fourth partial dying away fast, the slow tremolo
    of its motor, and the soft thump of the mallet; its top taken off at 2.4 kHz"""
    f = mf(m); x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x / 1.9) + 0.22 * np.sin(2 * np.pi * 4 * f * x + 0.7) * np.exp(-x / 0.35)
    s = s * np.minimum(1, x / 0.004) * (1 - 0.16 * (0.5 - 0.5 * np.cos(2 * np.pi * 5.0 * x)))
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
    """the Pacific's chords, sustained on bowed bars over a low hum: like prog(), each starts 2 s early and lasts 4 s longer, so the
    bed never drops out"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        bars(ch, s0 + i * d - 2.0, d + 4.0, g)
        if bassg:
            drone(ch[0] - 12, s0 + i * d - 2.0, d + 4.0, bassg, 'sine')
def ocean(s0, s1, g=0.03, seed=8, lo=70, hi=700, waves=(7.5, 11.5), rise=3.0, fall=3.0, pans=(-0.55, 0.55)):
    """the open ocean, while it's on screen: long, low swells under the canoe, a train of them on each side, each its own length
    and size, so the two never fall into step; a deep roll that's always there, and water rising with each swell. No surf: there's
    no shore. On the music bus, so it settles under the voice like the chords do"""
    r = np.random.default_rng(seed); sec = s1 - s0; x = tt(sec); n = len(x)
    edge = (np.minimum(1, x / rise) * np.clip((sec - x) / fall, 0, 1)).astype(np.float32)
    for pan in pans:
        e = np.zeros(n, np.float32); t0 = -r.uniform(0, waves[0])
        while t0 < sec:
            d = r.uniform(*waves); a = r.uniform(0.5, 1.0); i0 = int(t0 * SR); m = int(d * SR); k = np.arange(m, dtype=np.float32) / m
            w = a * np.where(k < 0.45, np.sin(0.5 * np.pi * k / 0.45) ** 2, np.cos(0.5 * np.pi * (k - 0.45) / 0.55) ** 2)
            j0, j1 = max(0, i0), min(n, i0 + m)
            if j1 > j0:
                e[j0:j1] = np.maximum(e[j0:j1], w[j0 - i0:j1 - i0])
            t0 += d * r.uniform(0.55, 0.8)
        roll = filt(noise(sec), 'band', (lo, lo * 4)) * (0.5 + 0.5 * e)
        wash = filt(noise(sec), 'band', (lo * 3, hi)) * e ** 2
        put(((roll + 0.5 * wash) * edge).astype(np.float32), s0, g, pan)
def heave(s, sec=3.4, g=0.02, pan=0.0):
    """one swell larger than the rest, lifting the canoe: a low rush of water that rises and falls back"""
    x = tt(sec); X(filt(noise(sec), 'band', (60, 420)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def wake(s, sec=2.6, g=0.02, pan=0.0):
    """the canoe under way: water along the hulls, low, rising and falling as it moves"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900)) * np.sin(np.pi * x / sec) ** 2 * (1 + 0.25 * np.sin(2 * np.pi * 1.1 * x)), s, g, pan)
def typing(s, sec, g=0.008, pan=0.0, seed=3):
    """someone typing: muffled keys in a human rhythm, quicker and slower, with a short stop between words"""
    r = np.random.default_rng(seed); t0 = s
    while t0 < s + sec:
        tap(t0, g * r.uniform(0.7, 1.1), pan + r.uniform(-0.05, 0.05))
        t0 += r.uniform(0.09, 0.17) + (r.uniform(0.15, 0.3) if r.random() < 0.18 else 0)
def slot(s, g=0.012, pan=0.0):
    """a file going into its folder: a short, soft slide of card on card, and a low knock as it settles"""
    x = tt(0.22); X(filt(noise(0.22), 'band', (300, 1500)) * np.sin(np.pi * x / 0.22) ** 2, s, g * 0.8, pan); knock(s + 0.18, g * 0.7, pan)
def scan(s, sec=2.0, g=0.008, pan=0.0):
    """the agent reading: a soft, low whisper that moves slowly between a lower and a higher band, like a page being read"""
    x = tt(sec); k = 0.5 + 0.5 * np.sin(2 * np.pi * 0.8 * x)
    lo, hi = filt(noise(sec), 'band', (300, 700)), filt(noise(sec), 'band', (700, 1400))
    X(((lo * (1 - k) + 0.7 * hi * k) * np.sin(np.pi * x / sec) ** 1.5).astype(np.float32), s, g, pan)

# chords (MIDI note numbers). The Pacific on bowed bars, in B-flat minor: B-flat minor, G-flat, E-flat minor where knowledge is held by
# few and where Mau dies, F with its fourth for the navigator's test; D-flat major as land is sighted, as knowledge is passed on, and
# at dawn, fifty years on. The present on warm pads, in D-flat major and its neighbours, darkening to B-flat minor as the map goes stale
BBM9 = [46, 53, 56, 60, 61]; GBMAJ7 = [42, 49, 53, 58]; EBM9 = [39, 46, 49, 53, 54]; F7SUS = [41, 48, 51, 53, 58]
DBMAJ9 = [37, 44, 48, 51, 53]; GBMAJ9 = [42, 49, 53, 56, 58]; ABSUS4 = [44, 51, 56, 58, 61]; FM7 = [41, 48, 51, 56]; DBMAJ7 = [37, 44, 48, 53]
# the same chords for the bowed bars, voiced higher, where pure tones still carry
BBM9b = [46, 53, 56, 60, 61]; GBMAJ7b = [54, 58, 61, 65]; EBM9b = [51, 54, 58, 61, 65]; F7SUSb = [53, 58, 60, 63]
DBMAJ9b = [49, 56, 60, 63, 65]; ABSUSb = [56, 61, 63, 66]
def mark(start, root=49, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)


# 1. By the stars: bowed bars in B-flat minor, and the open ocean, from the first view of the canoe until the chart covers it, and
#    again from the ring to the title. Paper as the small chart of the route appears, a bowed note as the route is drawn on it, and a
#    breath of air as it's taken away; water along the hulls as Hōkūleʻa leaves. A bowed note as the navigator is lit; the
#    vibraphone, struck, as the stars rise ahead; one larger swell for "the swells", and a breath of air as the birds fly home. A bowed
#    note as the star compass is drawn round the canoe, struck notes as its points appear, and as a star rises at one. Land: a bowed
#    note as Mataiva rises on the horizon, the bars move to D-flat major, and swell as the harbour comes into view. The chart: paper,
#    then a struck note for each island that still held the knowledge, and a bowed note for each pass to an apprentice; a long bowed
#    note, in two, as it crosses to Hawaiʻi, a struck note as Nainoa is lit, and one for each he taught. Struck notes, rising, as what
#    a map lives by appears over the ring; a knock for the navigator's test, and a bowed note for its question; then the warm pads
#    of the present, and the mark under the title
K = 'stars'
pbed(K, [BBM9b, EBM9b], 0, cq(K, 'ring'))
pbed(K, [GBMAJ7b], cq(K, 'ring'), cq(K, 'land'))
pbed(K, [DBMAJ9b, GBMAJ7b], cq(K, 'land'), cq(K, 'few'))
pbed(K, [EBM9b, ABSUSb], cq(K, 'few'), cq(K, 'link'))
pbed(K, [DBMAJ9b], cq(K, 'link'), cq(K, 'test'))
pbed(K, [F7SUSb], cq(K, 'test'), cq(K, 'breath'))
ocean(S0(K) + 0.2, C(K, 'few', 0.3), 0.032, seed=5, fall=1.0)
ocean(C(K, 'link', -0.8), E(K) + 0.6, 0.026, seed=9, rise=1.0)
tLv, tNc = W(K, 'coast', 'leaves'), W(K, 'coast', 'no charts')
paper(tLv - 0.6, 0.02, 0.6, 0.6); bow(68, tLv - 0.1, 3.4, 0.011, 0.6); air(tNc + 0.2, 1.1, 0.012, 0.6)
wake(tLv + 0.3, 4.2, 0.016, -0.1)
bow(65, W(K, 'mau', 'Mau', -0.2), 4.2, 0.013, -0.2)
tSt = W(K, 'mau', 'stars')
for k, (m, pan) in enumerate([(77, 0.2), (80, 0.45), (73, -0.05)]):
    vib(m, tSt - 0.1 + k * 0.45, 0.009 - 0.001 * k, pan)
heave(W(K, 'mau', 'swells', -0.6), 3.4, 0.02, 0.1)
air(W(K, 'mau', 'birds', -0.1), 2.4, 0.008, 0.35)
tR = C(K, 'ring')
bow(70, tR + 0.1, 4.6, 0.013, 0.0)
for k, (m, pan) in enumerate([(61, -0.55), (68, 0.55)]):
    vib(m, tR + 0.8 + k * 1.1, 0.008, pan)
vib(77, W(K, 'ring', 'rise'), 0.009, 0.3)
bow(61, W(K, 'land', 'Mataiva', -0.3), 4.0, 0.013, 0.5)
bars([61, 65, 68, 73], W(K, 'land', 'Three days', -0.1), 4.5, 0.012)
tF = C(K, 'few')
paper(tF - 0.7, 0.022, 0.0, 0.8)
for i, (m, pan) in enumerate(zip([58, 61, 63, 65, 68, 70], [-0.3, -0.15, 0.0, 0.1, 0.2, 0.3])):
    vib(m, tF + 0.2 + i * 0.18, 0.007, pan)
tP = W(K, 'few', 'passed')
for i, m in enumerate([65, 68, 70, 73]):
    bow(m, tP + i * 0.35, 2.6, 0.009, -0.3 + 0.2 * i)
tB = W(K, 'teach', 'beyond')
bow(61, tB - 0.2, 3.0, 0.013, -0.4); bow(68, tB + 0.9, 3.0, 0.012, 0.35)
vib(73, W(K, 'teach', 'Nainoa'), 0.012, 0.45)
tO = W(K, 'teach', 'taught others')
for i, m in enumerate([68, 70, 73, 77]):
    vib(m, tO + 0.8 + i * 0.22, 0.007, 0.3 + 0.1 * i)
for word, m, pan in [('use it', 61, px(520)), ('keep it true', 65, 0.0), ('teach it', 68, px(1400))]:
    vib(m, W(K, 'link', word, -0.1), 0.01, pan)
knock(C(K, 'test', -0.1), 0.014, 0.0); bow(65, W(K, 'test', 'could'), 3.0, 0.011, 0.0)
bed(K, [DBMAJ9], cq(K, 'breath') + 0.4, None, g=0.03, tone='warm', bassg=0.022)
mark(G(K, 'breath', 1.6), 49)
# 2. Useful, so at risk: paper as Tomás's note goes up, a knock for the map; paper as each use is pinned beside it, and a nylon note,
#    rising, as the map is used; a muffled key for each week it's been used. A low note as it goes stale, and a slow, muted pulse,
#    leaning on the semitone, from there until it moves to text. Paper for the slides, a knock for the modelling tool and a key for
#    its lock; air as the copies fly to their decks, paper as they land, and a pencil as each drifts; knocks for the glossary and the
#    catalogue, and a low note that doesn't fit the chord for their different words. Air as the board pack's copy is lifted to the
#    front, a knock for "trusted", a low knock and a low note for "out of date"; air as Tomás fades; a knock for the navigator's
#    test, and a press and a low note for its cross
R = 'risk'
bed(R, [DBMAJ9, GBMAJ9], 0, cq(R, 'stale'))
bed(R, [BBM9, GBMAJ7], cq(R, 'stale'), cq(R, 'worse'))
bed(R, [EBM9, F7SUS], cq(R, 'worse'), None)
paper(S0(R) + 0.3, 0.03, px(330), 0.5)
knock(S0(R) + 0.6, 0.018, 0.0)
for word, pan, m in [("skipper's test", px(330), 61), ('rules', px(1590), 65), ('minister', px(1590), 68)]:
    t0 = W(R, 'used', word, -0.2); paper(t0, 0.022, pan, 0.4); nylon(m, t0 + 0.2, 0.016, 0.0)
tU = C(R, 'used')
for i in range(10):
    tap(tU + 0.4 + i * 0.45, 0.007, px(780 + i * 40))
soft(46, C(R, 'stale', 0.1), 0.022, 0.0)
urgent(C(R, 'stale', -0.2), S0('text') + 1.6, bpm=84, root=41, g=0.039, fade=2.2, steps=(0, 0, 1, 0))
for k in range(3):
    paper(C(R, 'slides', -0.1 + k * 0.12), 0.016, px(320), 0.35)
knock(W(R, 'slides', 'modelling tool', -0.2), 0.016, px(1580)); tap(W(R, 'slides', 'modelling tool', 0.1), 0.01, px(1748))
tC = C(R, 'copies')
for i, x in enumerate([800, 1130, 1460]):
    air(tC + 0.2 + i * 0.35, 1.1, 0.01, px((330 + x) / 2)); paper(tC + 1.2 + i * 0.35, 0.016, px(x), 0.35)
tCd = W(R, 'copies', 'drift')
for i, x in enumerate([800, 1130, 1460]):
    pencil(tCd - 0.2 + i * 0.25, 0.011, px(x), 0.3)
knock(W(R, 'copies', 'glossary', -0.2), 0.016, px(1580)); knock(W(R, 'copies', 'catalogue', -0.2), 0.016, px(1580))
soft(45, W(R, 'copies', 'own words'), 0.02, px(1580))
tW = C(R, 'worse'); air(tW - 0.1, 0.9, 0.014, 0.0)
tT = W(R, 'worse', 'trust'); knock(tT - 0.3, 0.014, -0.1)
s_knock(tT + 0.4, 0.016, 0.25, 160); soft(40, tT + 0.45, 0.02, 0.25)
air(C(R, 'fails', 0.3), 1.4, 0.01, px(1730))
tX = W(R, 'fails', 'fails')
knock(W(R, 'fails', 'nobody', -0.3), 0.014, 0.0)
press(tX, 0.022); soft(41, tX + 0.05, 0.022, 0.0)
# 3. From slides to text: paper as the slide gives way, and muffled keys as its boxes peel off into lines of text; a knock and a nylon
#    note for each of the six files, rising; air and paper as the rule's file opens, and a muffled key for each line as it's written;
#    a nylon note for its stable ID, a pencil as its name changes, a low nylon note for "IDs don't", a knock for each thing that
#    points to it; two nylon notes for the lines ArchiMate names; paper for day one's two rules, a key for each arrow, a press for the
#    tick; a knock and paper for the decision, keys for its lines, and a nylon note for its "why". Then the wordless moment: keys as the
#    repository's folders appear, air as the two files fly into it, and each one filed; a swell under it all
TX = 'text'
bed(TX, [DBMAJ9, ABSUS4, GBMAJ9, DBMAJ9], 0, cq(TX, 'breath'))
bed(TX, [GBMAJ9, DBMAJ7], cq(TX, 'breath'), None, g=0.034)
tM = W(TX, 'move', 'text')
paper(tM - 0.2, 0.02, 0.0, 0.5)
for i in range(12):
    tap(tM + 0.05 + i * 0.07, 0.006, -0.45 + 0.7 * ((i * 5) % 12) / 11)
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
nylon(61, W(TX, 'id', "IDs don't"), 0.014, -0.5)
for i in range(3):
    knock(W(TX, 'id', 'everything', i * 0.25 - 0.2), 0.014, px(1620))
tA = W(TX, 'fields', 'ArchiMate'); nylon(65, tA, 0.012, 0.35); nylon(70, tA + 0.12, 0.011, 0.4)
paper(W(TX, 'rules', 'two rules', -0.2), 0.018, px(1340), 0.4)
tap(W(TX, 'rules', 'evidence'), 0.01, 0.4); tap(W(TX, 'rules', 'whether'), 0.01, 0.45)
press(W(TX, 'rules', 'confirmed'), 0.018)
tD = C(TX, 'decisions')
knock(tD - 0.3, 0.016, px(1340)); paper(tD - 0.25, 0.02, px(1340), 0.4)
for i in range(7):
    tap(tD + 0.1 + i * 0.2, 0.006, px(1340))
nylon(68, W(TX, 'decisions', 'why'), 0.016, px(1340))
B_ = G(TX, 'breath')
for i in range(7):
    tap(B_ + i * 0.17, 0.007, px(300))
air(B_ + 0.3, 1.0, 0.012, 0.0); air(B_ + 0.6, 1.0, 0.012, 0.3)
slot(B_ + 1.25, 0.012, px(150)); slot(B_ + 1.55, 0.012, px(150))
swell([37, 44, 49, 53], B_ + 0.2, 3.2, 0.018)
# 4. Reviewed and versioned: a muffled key for each version in the history; air as the versions fly to their line under the
#    repository, and a knock as each lands; a knock and paper for the pull request, a pencil for each line of its change; a knock as
#    each owner is asked, a press and a nylon note as each approves; a nylon note as it's merged, and a knock as its version joins the
#    line. Paper as it folds; a knock for the checks, keys as they run down the repository, a key for each check, a press and a nylon
#    note for each that passes. Then a low note as the first turns amber, a knock for generating power's file, a low note for its
#    missing owner, and a soft knock for each version the check has flagged
RV = 'review'
bed(RV, [DBMAJ9, GBMAJ9, ABSUS4], 0, cq(RV, 'power'))
bed(RV, [EBM9, ABSUS4], cq(RV, 'power'), None)
tV = W(RV, 'repo', 'every version')
for i in range(4):
    tap(tV - 0.2 + i * 0.22, 0.008, px(1220))
f0 = C(RV, 'pr', -1.1)
air(f0, 1.6, 0.012, -0.2)
for i in range(4):
    knock(f0 + (3 - i) * 0.15 + 1.0, 0.009, px(120 + (3 - i) * 90))
knock(C(RV, 'pr', 0.05), 0.018, px(1220)); paper(C(RV, 'pr', 0.1), 0.022, px(1220), 0.45)
for i in range(4):
    pencil(W(RV, 'pr', 'line by line', -0.2 + i * 0.35), 0.01, px(1220), 0.35)
tap(C(RV, 'pr', 0.3), 0.008, px(300))
for who, d, m in [('Grace', 0.6, 65), ('Ama', 0.7, 68)]:
    knock(W(RV, 'owner', who, -0.2), 0.012, px(1500)); press(W(RV, 'owner', who, d), 0.016); nylon(m, W(RV, 'owner', who, d + 0.05), 0.016, px(1500))
tap(W(RV, 'owner', 'Ama'), 0.008, px(1220))
ap = W(RV, 'owner', 'obligations', 0.8)
nylon(73, ap, 0.018, px(1220)); knock(ap + 0.4, 0.012, px(480))
tCk = C(RV, 'checks')
paper(tCk - 0.9, 0.016, px(1220), 0.6); knock(tCk - 0.3, 0.016, px(1220))
for i in range(7):
    tap(tCk + 0.1 + i * 0.31, 0.006, px(300))
for word, m in [('Every element', None), ('Every rule', 65), ('Every measure', 68)]:
    tap(W(RV, 'list', word), 0.01, px(1220))
    if m:
        press(W(RV, 'list', word, 1.4), 0.014); nylon(m, W(RV, 'list', word, 1.45), 0.014, px(1220))
tPw = C(RV, 'power')
soft(44, tPw + 0.2, 0.022, px(1220)); knock(tPw + 0.5, 0.016, px(1450)); soft(39, tPw + 1.0, 0.02, px(1450))
for i in range(5):
    knock(tPw + 0.6 + i * 0.25, 0.007, px(140 + i * 80))
# 5. One map, many views: air as the threads run out from the map, and a knock for each view as it arrives; air as meaning runs along
#    them, one way; a nylon note, rising, as each view is named, and a key for each reader. Air as they move aside; a knock for dbt's
#    chip, paper for its model, keys for its owner and domain and a nylon note for its rules' IDs; the same for Databricks, with a
#    nylon note for its lineage. Paper for the glossary; air as the pencil goes to it, a low knock and a low note as it can't write
#    there; air as it goes to the map, a pencil as the fix is made there, air as the fix runs out along every thread, nylon notes as
#    the views follow, and a pencil and a nylon note as the glossary changes with them
VW = 'views'
bed(VW, [DBMAJ9, FM7, GBMAJ9, ABSUS4], 0, cq(VW, 'nobody'))
bed(VW, [GBMAJ9, DBMAJ9], cq(VW, 'nobody'), None)
tG = C(VW, 'gen')
air(tG + 0.4, 1.8, 0.014, 0.2)
for k in range(6):
    knock(tG + 0.9 + k * 0.15, 0.01, px(1320))
air(W(VW, 'gen', 'one way', -0.2), 1.4, 0.012, 0.25)
for k, (name, m) in enumerate(zip(['ArchiMate', 'glossary', 'conceptual', 'ontology', 'checks', 'heat'], [61, 63, 65, 68, 70, 73])):
    nylon(m, W(VW, 'list', name, -0.2), 0.015, px(1320))
for k in range(6):
    tap(C(VW, 'readers', 0.2 + k * 0.25), 0.008, px(1700))
tDb, tDx = C(VW, 'dbt'), C(VW, 'dbx')
air(tDb - 1.5, 1.5, 0.012, px(1500))
knock(tDb - 0.2, 0.014, px(1650)); paper(tDb + 0.05, 0.02, px(980), 0.45)
tap(W(VW, 'dbt', 'owner', -0.1), 0.009, px(980)); tap(W(VW, 'dbt', 'domain', -0.1), 0.009, px(980))
nylon(68, W(VW, 'dbt', 'IDs', -0.1), 0.014, px(980))
knock(tDx - 0.2, 0.014, px(1650)); paper(tDx + 0.05, 0.02, px(980), 0.45)
for word in ['owner', 'tags', 'description']:
    tap(W(VW, 'dbx', word, -0.1), 0.009, px(980))
nylon(70, W(VW, 'dbx', 'lineage', -0.1), 0.014, px(980))
tN = C(VW, 'nobody')
paper(tN - 0.9, 0.018, px(980), 0.45)
pIn, pBl, pGo = tN - 0.3, W(VW, 'nobody', 'edits', 0.15), W(VW, 'nobody', 'fix', -0.3)
pAt = pGo + 0.9; pul = pAt + 0.15
air(pIn, 0.8, 0.008, px(1100))
s_knock(pBl, 0.016, px(1040), 150); soft(44, pBl + 0.05, 0.018, px(1040))
air(pGo, 0.9, 0.012, px(700)); pencil(pAt, 0.014, px(372), 0.5)
air(pul, 1.2, 0.014, 0.2)
for k, m in enumerate([61, 65, 68, 73]):
    nylon(m, pul + 0.9 + k * 0.14, 0.012, px(1300) + 0.1 * k)
pencil(pul + 1.1, 0.012, px(980), 0.6); nylon(73, pul + 1.15, 0.014, px(980))
# 6. An agent reads it: the vibraphone, struck, as the agent arrives, and a low whisper as it reads; a knock for each request and
#    change, and a key for the skipper's test; a struck note, rising, as it finds the decision, the capability and the owner; paper
#    for the dashboard request, and a low note as it reaches nothing. A pencil for "as for the social tariff"; a knock and a struck
#    note for each layer the agent walks through, falling as it goes down; a knock for the owners who must agree, and a key for each.
#    A knock for the column, air as the agent goes to the rules, a knock and a struck note for the rule it finds, keys for its lines,
#    struck notes for its owner and its reason. Paper for the answer, a pencil under its IDs, a key as a person opens a source, paper
#    as it opens, a pencil for what it says, and a press and a struck note as the answer checks out
RD = 'reads'
bed(RD, [GBMAJ9, DBMAJ9, ABSUS4, BBM9], 0, cq(RD, 'cites'))
bed(RD, [GBMAJ9, DBMAJ9], cq(RD, 'cites'), None)
tAg = C(RD, 'now')
vib(68, tAg - 0.3, 0.013, px(600)); air(tAg - 0.3, 0.8, 0.008, px(600)); scan(tAg + 0.3, 2.4, 0.008, px(570))
knock(C(RD, 'request', -0.1), 0.016, px(1270)); tap(W(RD, 'request', "skipper's", -0.2), 0.01, px(1000))
scan(W(RD, 'request', 'applies', -0.2), W(RD, 'request', 'decision') - W(RD, 'request', 'applies', -0.2), 0.007, px(570))
knock(W(RD, 'request', 'decision', -0.4), 0.012, px(1270))
for word, m in [('decision', 65), ('capability', 68), ('owner', 73)]:
    vib(m, W(RD, 'request', word, -0.1), 0.013, px(1270))
tNo = W(RD, 'request', 'nothing')
paper(tNo - 1.0, 0.016, px(1270), 0.4); soft(42, tNo - 0.1, 0.02, px(1560))
knock(C(RD, 'change', -0.1), 0.016, px(1270)); pencil(W(RD, 'change', 'social', -0.2), 0.01, px(1500), 0.4)
walk0 = W(RD, 'change', 'walks', -0.3)
scan(walk0, 2.9, 0.007, px(570))
for i, (row, m) in enumerate(zip([0, 2, 3, 5], [73, 70, 68, 63])):
    t0 = walk0 + row / 5 * 2.8; knock(t0, 0.01, px(1270)); vib(m, t0 + 0.03, 0.011, px(1270))
tOw = W(RD, 'change', 'owners')
knock(tOw - 0.3, 0.014, px(1270))
for i in range(3):
    tap(tOw + i * 0.3, 0.009, px(1270))
tK = C(RD, 'column')
knock(tK - 0.1, 0.016, px(1270)); tap(tK + 0.4, 0.009, px(1270)); air(tK + 0.2, 0.9, 0.01, px(570))
tRu = W(RD, 'column', 'rule')
scan(tK + 0.2, tRu + 0.5 - tK - 0.2, 0.007, px(570))
knock(tRu - 0.3, 0.014, px(1270)); vib(65, tRu - 0.25, 0.013, px(1270))
for i in range(4):
    tap(tRu - 0.1 + i * 0.2, 0.007, px(1270))
vib(68, W(RD, 'column', 'owner', -0.1), 0.012, px(1270)); vib(70, W(RD, 'column', 'reason', -0.1), 0.012, px(1270))
tCi = C(RD, 'cites'); ck = W(RD, 'cites', 'check')
paper(tCi - 0.3, 0.024, px(1270), 0.5); pencil(W(RD, 'cites', 'IDs', -0.1), 0.01, px(1270), 0.5)
tap(ck - 0.1, 0.012, px(1400)); paper(ck + 0.1, 0.02, px(1490), 0.4); pencil(ck + 0.5, 0.01, px(1490), 0.6)
press(ck + 0.9, 0.018); vib(73, ck + 0.95, 0.013, px(1270))
# 7. An agent on the map: air as the agent goes into the map, and a knock and a struck note as it lands there, an actor; a knock and
#    paper for its file, keys for its lines; a knock for the outage agent's; a nylon note for what it may do, a low knock and a low
#    note for what it may not. Two knocks for the two sources, a low note that doesn't fit the chord for their disagreement, a key for
#    the arrow, paper and a nylon note for the question to the owner. A key for its owner, a press for the tick, a pencil as draft
#    becomes confirmed, and a press and a nylon note for that tick. Then a knock for the rule, a nylon note, rising, for each of its
#    three parts, a pencil as data models becomes the map, and a swell as it's applied
RG = 'rights'
bed(RG, [DBMAJ9, GBMAJ9, BBM9, ABSUS4], 0, cq(RG, 'same'))
bed(RG, [DBMAJ9], cq(RG, 'same'), None)
fa, fb = C(RG, 'on', -0.2), W(RG, 'on', 'map itself', 0.2)
air(fa, fb - fa, 0.012, -0.3); knock(fb - 0.1, 0.012, px(404)); vib(68, fb, 0.013, px(404))
tAc, rw, own = W(RG, 'on', 'actor'), W(RG, 'on', 'rights'), W(RG, 'owner', 'Tomás')
knock(tAc - 0.4, 0.016, px(1270)); paper(tAc - 0.35, 0.018, px(1270), 0.4)
for t0 in [tAc - 0.2, tAc, tAc + 0.2, rw - 0.3, rw - 0.05, rw + 0.2, rw + 0.45, rw + 0.9, rw + 1.1]:
    tap(t0, 0.007, px(1270))
knock(W(RG, 'on', 'outage', -0.5), 0.012, px(1270))
nylon(65, W(RG, 'may', 'read'), 0.016, px(1790)); s_knock(W(RG, 'may', 'may not'), 0.016, px(1790), 160); soft(44, W(RG, 'may', 'may not', 0.05), 0.018, px(1790))
tAs = C(RG, 'asks')
knock(tAs - 0.2, 0.012, px(900)); knock(tAs + 0.2, 0.012, px(1300))
soft(45, W(RG, 'asks', 'disagree', -0.1), 0.018, px(1100)); tap(tAs + 0.2, 0.009, px(1790))
tOq = W(RG, 'asks', 'owner')
paper(tOq - 0.4, 0.018, px(1678), 0.4); nylon(68, tOq, 0.014, px(1678))
tap(own - 0.2, 0.008, px(1270)); press(own + 0.5, 0.016); pencil(own + 0.8, 0.01, px(1270), 0.6)
press(own + 1.3, 0.016); nylon(73, own + 1.35, 0.016, px(1270))
tS = C(RG, 'same')
knock(tS - 0.3, 0.016, px(1270))
for word, m in [('Agents', 61), ('people', 65), ('every version', 68)]:
    nylon(m, W(RG, 'same', word, -0.1), 0.016, px(1270))
tAp = W(RG, 'same', 'applied')
pencil(tAp - 0.1, 0.01, px(1270), 0.6); swell([37, 44, 49, 53], tAp + 0.4, 3.0, 0.018)
# 8. People confirm: a knock and paper for the retail code, a key as the clause lights, a pencil for each line of the sentence the
#    regulator adds, written in as it's read; air as the agent leaves its folder, and a low whisper as it reads the rules; a
#    knock and a struck note for the rule it finds, keys for its lines and for retail's half, a struck note for its reason, a knock for
#    its pair. Air as the agent goes to its draft, a knock and paper for the pull request, a pencil for each line, a key for each check
#    and view it touches; a press and a nylon note as the head of retail confirms it, and two nylon notes as it's merged. Paper as it
#    folds, a knock and a nylon note for the new version, a knock and paper for the checks, keys as they change, and a press
CF = 'confirm'
bed(CF, [BBM9, GBMAJ9], 0, cq(CF, 'finds'))
bed(CF, [EBM9, ABSUS4], cq(CF, 'finds'), cq(CF, 'confirms'))
bed(CF, [DBMAJ9, GBMAJ9], cq(CF, 'confirms'), None)
knock(C(CF, 'code', -0.2), 0.018, px(1270)); paper(C(CF, 'code', -0.15), 0.022, px(1270), 0.5)
tap(C(CF, 'clause'), 0.01, px(1270))
tCl = C(CF, 'clause'); dCl = W(CF, 'clause', 'not') - tCl
pencil(tCl - 0.1, 0.011, px(1100), dCl * 44 / 95); pencil(tCl - 0.1 + dCl * 44 / 95, 0.011, px(1100), dCl * 51 / 95)
tFd = C(CF, 'finds'); tRe = W(CF, 'finds', 'reason')
air(tFd - 0.6, 0.8, 0.01, px(500)); scan(tFd + 0.2, tRe + 0.3 - tFd - 0.2, 0.008, px(450))
t1 = W(CF, 'finds', 'one rule')
knock(t1 - 0.3, 0.014, px(1270)); vib(65, t1 - 0.2, 0.013, px(1270))
for i in range(7):
    tap(t1 - 0.1 + i * 0.15, 0.006, px(1270))
tap(W(CF, 'finds', "retail's", -0.2), 0.009, px(1270)); vib(70, tRe - 0.2, 0.013, px(1270))
knock(W(CF, 'finds', 'half', -0.4), 0.012, px(1270))
tDr = C(CF, 'drafts')
air(tDr - 0.3, 0.9, 0.01, px(600)); knock(tDr - 0.1, 0.016, px(1270)); paper(tDr - 0.05, 0.02, px(1270), 0.45)
for i in range(4):
    pencil(W(CF, 'drafts', 'new words', -0.3 + i * 0.3), 0.01, px(1270), 0.3)
for i in range(3):
    tap(W(CF, 'drafts', 'check', -0.2 + i * 0.35), 0.009, px(1270))
conf = W(CF, 'confirms', 'confirms', 0.1)
press(conf, 0.026); nylon(61, conf + 0.05, 0.018, px(1600))
nylon(68, conf + 0.6, 0.016, px(1270)); nylon(73, conf + 0.72, 0.014, px(1270))
paper(C(CF, 'version', -0.7), 0.016, px(1270), 0.6)
tNv = W(CF, 'version', 'new version', -0.1)
knock(tNv, 0.014, px(300)); nylon(65, tNv + 0.05, 0.016, px(300))
tCh = W(CF, 'version', 'checks')
knock(tCh - 0.4, 0.014, px(1270)); paper(tCh - 0.35, 0.018, px(1270), 0.4)
tap(tCh - 0.1, 0.009, px(1270)); tap(W(CF, 'version', 'change', -0.1), 0.009, px(1270)); press(W(CF, 'version', 'change', 0.6), 0.014)
# 9. Day one, again: a knock for her badge, paper for the page of acronyms and the list of systems, and muffled keys as the list runs
#    on; the vibraphone, struck and bowed, as the map arrives on her desk; a knock for the chat, keys as she types her question, a
#    struck note, rising, for each part of the answer, and a pencil under its links; a knock and paper for her first change, keys as
#    she writes it, and a nylon note for Grace
AG = 'again'
bed(AG, [DBMAJ9, GBMAJ9], 0, cq(AG, 'map'))
bed(AG, [ABSUS4, DBMAJ9], cq(AG, 'map'), cq(AG, 'first'))
bed(AG, [GBMAJ9, DBMAJ9], cq(AG, 'first'), None)
knock(W(AG, 'day', 'badge', -0.2), 0.016, px(260)); paper(W(AG, 'day', 'acronyms', -0.2), 0.022, px(630), 0.45)
tLs = W(AG, 'day', 'list')
paper(tLs - 0.2, 0.02, px(1070), 0.45)
for k in range(8):
    tap(tLs + 0.1 + k * 0.19, 0.006 * (1 - 0.06 * k), px(1070))
tMp = C(AG, 'map')
vib(61, tMp - 0.2, 0.014, px(630)); bow(68, tMp - 0.1, 4.0, 0.011, px(630))
tAs2 = C(AG, 'asks'); ans = W(AG, 'gets', 'owner')
knock(tAs2 - 0.4, 0.016, px(820)); typing(tAs2 + 0.1, 2.6, 0.008, px(820))
for t0, m in [(ans - 0.2, 65), (W(AG, 'gets', 'two rules', -0.1), 68), (W(AG, 'gets', 'two rules', 0.4), 73)]:
    vib(m, t0, 0.013, px(820))
pencil(W(AG, 'gets', 'links', -0.1), 0.01, px(820), 0.6)
tFi = C(AG, 'first')
knock(tFi - 0.3, 0.016, px(820)); paper(tFi - 0.25, 0.02, px(820), 0.45)
typing(W(AG, 'first', 'drafted', -0.1), 0.9, 0.007, px(820), seed=5)
nylon(68, W(AG, 'first', 'Grace', 0.3), 0.016, px(820))
# 10. Still sailing: the bowed bars again, in B-flat minor. Paper for the chart; a bowed note as Mau's light comes up on Satawal, and
#     struck notes for the Hawaiians' lights; a bowed note for each of the five as they sail to Satawal, and a struck note as they
#     arrive. A bowed chord, G-flat, as light rings out from Mau and they become master navigators, struck notes for the eleven round
#     him, and one for Nainoa. E-flat minor, and a low bowed note, as Mau's light fades in 2010. Then bowed notes as the five sail
#     home, and a struck note for each one's first students as they light, rising; a bowed swell, in D-flat, as those teach others in
#     turn; a low bowed note as the first voyage, fifty years ago, is drawn again. At dawn, the ocean, and water along the hulls as
#     Hōkūleʻa sails on; a bowed note as the star compass is drawn round her, struck notes for its houses, and the vibraphone, struck
#     and bowed, as her navigator is lit, then the one learning beside them
SL = 'sailing'
s0s = S0(SL); tMa, tDi, tL, tF2, tH = W(SL, 'pwo', 'master'), W(SL, 'died', 'died'), W(SL, 'died', 'What he'), W(SL, 'now', 'first voyage'), W(SL, 'now', 'Hōkūleʻa')
pbed(SL, [BBM9b], 0, tMa - s0s)
pbed(SL, [GBMAJ7b], tMa - s0s, tDi - s0s)
pbed(SL, [EBM9b], tDi - s0s, tL - s0s)
pbed(SL, [ABSUSb, DBMAJ9b], tL - s0s, tH - s0s)
pbed(SL, [DBMAJ9b], tH - s0s, None)
paper(s0s + 0.1, 0.014, 0.0, 0.7)
bow(58, s0s + 0.2, 4.2, 0.012, -0.5)
vib(73, s0s + 0.35, 0.007, 0.35); vib(77, s0s + 0.65, 0.006, 0.45)
for i, m in enumerate([61, 65, 68, 70, 73]):
    bow(m, s0s + 0.7 + i * 0.16, 3.2, 0.008, 0.45 - 0.2 * i)
vib(68, s0s + 3.0, 0.009, -0.5)
bow(70, tMa - 0.1, 4.0, 0.014, -0.2); bow(77, tMa + 0.15, 3.6, 0.01, 0.1); vib(65, tMa, 0.012, -0.15)
for k, m in enumerate([68, 72, 73, 77]):
    vib(m, tMa + 0.25 + k * 0.14, 0.006, -0.3 + 0.2 * k)
vib(73, W(SL, 'pwo', 'Nainoa', -0.1), 0.01, 0.0)
bow(53, tDi - 0.1, 5.0, 0.014, -0.2)
back = max(tL + 0.3 + i * 0.12 + 2.1 for i in range(5))
for i, m in enumerate([61, 65, 68, 70, 73]):
    bow(m, tL + 0.3 + i * 0.12, 3.0, 0.008, -0.4 + 0.2 * i)
_hash = lambda n, s: (lambda v: v - _math.floor(v))(_math.sin(n * 127.1 + s * 311.7) * 43758.5453123)  # the film's hash()
for i, m in enumerate([61, 63, 65, 68, 70]):
    vib(m, back - 0.3 + i * 0.22 + 0.8, 0.006, -0.3 + 0.15 * i)
g2 = [1.1 + i * 0.18 + j * 0.25 for i in range(5) for j in range(2) if _hash(i * 2 + j, 603) < 0.7]
bars([61, 65, 68, 73], back - 0.3 + min(g2) + 0.5, 4.0, 0.012)
bow(56, tF2 - 0.6, 4.2, 0.012, 0.25)
ocean(tH - 0.6, E(SL) + 0.6, 0.028, seed=13, rise=1.2)
wake(tH, 4.4, 0.014, 0.0)
bow(70, tH + 0.2, 4.0, 0.012, 0.0)
for k, m in enumerate([61, 65, 68, 73]):
    vib(m, tH + 0.6 + k * 0.5, 0.006, -0.6 + 0.4 * k)
tNav, tApp = W(SL, 'now', 'people Mau'), W(SL, 'now', 'people they')
vib(65, tNav - 0.15, 0.013, -0.3); bow(65, tNav - 0.2, 3.5, 0.009, -0.3)
vib(70, tApp - 0.15, 0.013, -0.15); bow(73, tApp - 0.1, 3.5, 0.009, -0.15)
# 11. The map before the data: a knock and paper for Zofia's change, a press as Grace confirms it, and two nylon notes as it's merged;
#     a knock for the navigator's test, and a press, a struck note and a bowed one as it's passed. Paper for Tomás's note, and for its
#     answer, and a pencil as the answer is written. Air as the wall goes; a knock for each layer of the map as it stacks, keys for the
#     films; a nylon note, rising, for each layer as its film lights, and the vibraphone for the films for data; struck notes falling
#     as a change walks down every layer; a swell as the map holds what the organisation means. Air as the films go; a knock as From
#     words to data arrives, air and a bowed note as the layers' meaning runs into it, and From words to data's four notes, 1-5-6-3,
#     on its felt piano, as it lights. A swell, the vibraphone once under the end card, and the mark
Z = 'end'
bed(Z, [GBMAJ9, DBMAJ9], 0, cq(Z, 'layers'))
bed(Z, [DBMAJ9, GBMAJ9, ABSUS4], cq(Z, 'layers'), cq(Z, 'over'))
bed(Z, [DBMAJ9], cq(Z, 'over'), cq(Z, 'breath'))
knock(S0(Z) + 0.1, 0.014, px(600)); paper(S0(Z) + 0.15, 0.018, px(600), 0.45)
tCz = W(Z, 'confirm', 'confirms')
press(tCz + 0.1, 0.02); nylon(68, tCz + 0.5, 0.016, px(600)); nylon(73, tCz + 0.62, 0.014, px(600))
knock(W(Z, 'confirm', 'The map', -0.3), 0.014, px(600))
tPs = W(Z, 'confirm', 'passes')
press(tPs, 0.018); vib(73, tPs + 0.05, 0.014, px(600)); bow(77, tPs + 0.2, 3.5, 0.01, px(600))
paper(C(Z, 'answer', -0.2), 0.024, px(660), 0.5); paper(W(Z, 'answer', 'answer:', -0.2), 0.028, px(700), 0.5)
pencil(W(Z, 'answer', 'a map'), 0.009, px(700), 4.4)
tLy = C(Z, 'layers')
air(tLy - 0.8, 1.0, 0.012, 0.0)
for l in range(6):
    knock(tLy - 0.5 + l * 0.27, 0.009, px(450))
for i in range(7):
    tap(tLy - 0.3 + i * 0.08, 0.006, px(1440))
knock(W(Z, 'layers', 'Layer', -0.1), 0.01, px(1440))
for word, m in zip(['who it serves', 'why it moves', 'what it must', 'how value', 'who does the work', 'what runs'], [61, 63, 65, 68, 70, 73]):
    nylon(m, W(Z, 'layers', word, -0.1), 0.015, 0.0)
for word, m in zip(['the questions', 'rules with', 'a change'], [68, 70, 73]):
    vib(m, W(Z, 'data', word, -0.1), 0.011, px(1440))
vib(77, C(Z, 'over', -0.1), 0.01, px(1440))
tWk = W(Z, 'data', 'walked')
for l, m in enumerate([73, 70, 68, 65, 63, 61]):
    vib(m, tWk + l * 0.22, 0.008, px(450))
swell([37, 44, 49, 53, 56], W(Z, 'over', 'holds'), 3.2, 0.02)
air(W(Z, 'over', 'Turning', -0.4), 0.8, 0.01, px(1440))
t0 = W(Z, 'over', 'into', -0.5)
knock(t0 + 0.05, 0.014, px(1450)); air(t0 + 0.4, 1.6, 0.014, 0.0); bow(61, t0 + 0.5, 3.5, 0.011, px(1100))
theme(W(Z, 'over', 'From'), 61, inst=felt, step=0.42, g=0.02, pan=px(1450))
swell([37, 44, 49, 53], G(Z, 'breath', 0.2), 3.0, 0.02)
bed(Z, [DBMAJ7], cq(Z, 'breath'), None, g=0.034, tone='warm', bassg=0.026)
vib(77, G(Z, 'breath', 0.6), 0.012, 0.3)
mark(G(Z, 'breath', 1.4), 49)
