# A product with an owner: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for this film (PLAYBOOK.md: vary the sound itself): a harp and soft strings carry it; a celesta, small and close, marks
# the moments that land; and the series' mark, 1-5-4-8, plays on a horn under the title and the end card, the harp an octave above it.
# G major for the market round the bedesten; E-flat major for the university today. The turn comes on "Data has the same problem": the
# strings hold G and D, the notes the two keys share, while the bass falls a major third, from G to E-flat. Nothing imitates the music
# of the place or the time: no instrument, scale or rhythm is borrowed (AGENTS.md, Rights and respect).
# The celesta means the same all through. A question no one answers is the key's fifth rising a step, and left there: "who answers
# for it?" over the buyer in the 1520s, on the card nobody answers for, and on the owner's line of Anil's next list. A promise kept is
# the fifth rising to home: the buyers come back; data's answers turn gold; the card is complete; Clara signs; the check turns green;
# the corridor's card turns gold. The market has a sound of its own: the harp rolls its chord, G major, each time the story goes back
# to the bazaar.
# The series' sound (decided with the master data films, 20 October 2026; tools/quiet.py checks it):
#  - Music under the opening story and the title; after it, only at a chapter's turn (the card complete, the check that turns green,
#    the product retired), under a moment on screen, in the wordless pauses, softly under the film's last look at the market, and
#    under the end card: never a bed under the voice. After the opening, no chapter has music for more than half its length, or for
#    12 seconds without a break.
#  - No urgent pulse: no chapter turns on an error or a rush. Nothing loops; where the picture repeats (tags, pins, pages), the first
#    sounds and the rest are softer.
#  - Nothing trembles, and nothing beats on a phone's speaker: one voice to a note, held straight, and every note tuned pure over G,
#    so the two keys share G, C and D exactly. No chord sounds A with E, or F with C, the two fifths this tuning leaves impure.
#  - Every effect is something on screen, at the moment it appears, timed like the picture in src/scenes.js (the same word, and the
#    same offset), so sound and picture stay together when the voice is re-timed: paper, cloth, the inspector's rod, a pencil, a pen,
#    a highlighter, cork pins, a chair, a wall clock, a phone, a mouse's click, a rubber stamp, pages turning, a tag's string, a binder
#    drawn along a shelf, a breath of air for something carried across, and a soft wooden knock for each tag, card or speech bubble
#    that arrives. Everything is soft and stays below about 2.5 kHz (soften() at the end makes sure of it).

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    if i < 0:
        raise ValueError('%s/%s has no "%s"' % (sid, lid, word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid, off=0):
    """when a line ends, as the film's sc.ends has it"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
P = lambda x: max(-0.8, min(0.8, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan

# ---- the tuning: every note pure over G (MIDI 55), so held notes never beat. G major takes G A B C D E F#, E-flat major E-flat F G
# A-flat B-flat C D: the same ratios serve both, and the two keys share G, C and D exactly ----
JUST = (1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8)
def hz(m):
    d = m - 55
    return mf(55) * JUST[d % 12] * 2 ** (d // 12)

# ---- this film's instruments ----
def harp(m, start, g=0.03, pan=0.0, sec=None):
    """a harp string plucked softly with the flesh of the finger: round, its upper partials gone in a moment, a little of the finger
    at the start, and the string ringing on, the low strings longest, until a hand damps it; darkened"""
    f = hz(m); sec = sec or (3.6 if f < 200 else 3.0 if f < 420 else 2.4); x = tt(sec); r = 0.5 + f / 700
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) * k ** -1.7 * np.exp(-x * r * (1 + 0.7 * (k - 1) ** 1.4)) for k in range(1, 8))
    s = s * np.minimum(1, x / 0.004) + 0.04 * filt(noise(sec), 'band', (min(1.5 * f, 1200), min(5 * f, 2000)))[:len(x)] * np.exp(-x * 70)
    put(norm(filt(s.astype(np.float32), 'low', 1800)) * env(sec, 0.001, sec * 0.4), start, g, pan)
def roll(ms, start, g=0.022, gap=0.09, pan=(-0.45, 0.45), up=0):
    """a chord on the harp, rolled up from its lowest string; up=12 plays it an octave above the strings holding the same chord, so
    no string of the harp sounds a note the strings hold (two voices on one pitch can cancel each other)"""
    for k, m in enumerate(sorted(ms)):
        harp(m + up, start + k * gap, g * (1 - 0.05 * k), pan[0] + (pan[1] - pan[0]) * k / max(1, len(ms) - 1))
def market(start, g=0.02, n=6, up=0):
    """the market's chord: G major, rolled on the harp, each time the story goes back to the bazaar (n strings of it, from the top)"""
    roll([43, 50, 55, 59, 62, 67][-n:], start, g, 0.1, up=up)
def section(m, start, sec, g, pan, j=0, a=1.6):
    """one section of soft strings on one note, in tune, bowed in slowly over a seconds; the bow's weight breathes very slowly, no
    vibrato"""
    f = hz(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + j + k) * (1 / k) * np.exp(-0.35 * k) for k in range(1, 8))
    s = s * (1 + 0.05 * np.sin(2 * np.pi * (0.06 + 0.01 * j) * x + j)) * env(sec, a, 2.6)
    put(filt(s.astype(np.float32), 'low', 1400), start, g, pan)
def strings(ch, start, sec, g=0.028):
    """soft strings: each note of the chord one section, bowed in a little after the note below it, spread across the stereo field"""
    ms = sorted(ch); n = len(ms)
    for j, m in enumerate(ms):
        section(m, start + 0.22 * j, sec, g * 1.6 / n, -0.6 + 1.2 * j / max(1, n - 1), j, 1.6 + 0.22 * j)
def celesta(m, start, g=0.03, pan=0.0, sec=2.4):
    """a celesta, small and close: a steel bar struck by a felt hammer over its wooden box; the fundamental, round, a little of the
    octave, gone first, and the soft knock of the hammer"""
    f = hz(m); x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 1.4) + 0.16 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 4.5) + 0.04 * np.sin(2 * np.pi * 3 * f * x) * np.exp(-x * 10)
    s = s * np.minimum(1, x / 0.003) + 0.02 * filt(noise(sec), 'band', (300, 1400))[:len(x)] * np.exp(-x * 160)
    put(norm(filt(s.astype(np.float32), 'low', 2300)) * env(sec, 0.001, sec * 0.4), start, g, pan)
def promise(s, home=75, g=0.032, pan=0.0):
    """a promise kept: the fifth rising to home, the second note as it lands"""
    celesta(home - 5, s, g * 0.85, pan - 0.1); celesta(home, s + 0.3, g, pan + 0.1, 2.8)
def question(s, home=75, g=0.03, pan=0.0):
    """a question no one answers: the fifth rising a step, and left there"""
    celesta(home - 5, s, g * 0.85, pan - 0.1); celesta(home - 3, s + 0.36, g * 0.9, pan + 0.1, 2.8)
def horn(m, start, sec, g=0.05, pan=0.0):
    """one horn, played softly: it speaks with a breath of air and a slight rise into its pitch, its upper harmonics opening a moment
    after the lower, then held straight, without vibrato; round and dark"""
    f0 = hz(m); x = tt(sec).astype(np.float64); ph = 2 * np.pi * np.cumsum(f0 * (1 - 0.004 * np.exp(-x / 0.05))) / SR; s = np.zeros_like(x)
    for h in range(1, 12):
        F = h * f0
        if F > 1400:
            break
        s += np.sin(h * ph + 0.7 * h) * h ** -0.6 / (1 + (F / 480) ** 2) * np.clip((x - 0.012 * h) / (0.07 + 0.02 * h), 0, 1)
    s = s + filt(noise(sec), 'band', (250, 1200))[:len(x)] * (0.012 + 0.05 * np.exp(-x / 0.08))
    put(norm(filt((s * env(sec, 0.09, min(0.6, sec * 0.45))).astype(np.float32), 'low', 1500)), start, g, pan)
def mark(start, root=51, g=0.06):
    """the series' four notes, 1-5-4-8: one horn, the harp an octave above it"""
    for i, iv in enumerate([0, 7, 5, 12]):
        horn(root + iv, start + i * 0.45, 1.0 if i < 3 else 2.8, g * 0.8, (i - 1.5) * 0.12)
        harp(root + 12 + iv, start + i * 0.45, g * 0.42, (i - 1.5) * 0.15, 3.2 if i == 3 else 2.4)
def bed(segs, end, g=0.028):
    """the opening story's chords, one after another (each segment's start and chord), each blooming in under the end of the one
    before; a note the next chord keeps is held through the change, one section to a note, never bowed again"""
    starts = [s for s, _ in segs] + [end]
    for i, (s, ch) in enumerate(segs):
        ms = sorted(ch)
        for j, m in enumerate(ms):
            if i and m in segs[i - 1][1]:
                continue
            k = i
            while k + 1 < len(segs) and m in segs[k + 1][1]:
                k += 1
            section(m, s - 1.2 + 0.22 * j, starts[k + 1] - s + 3.2 - 0.22 * j, g * 1.6 / len(ms), max(-0.6, min(0.6, -0.6 + 1.2 * (m - 38) / 31)), j, 1.6)
def turn(ch, s, sec=6.0, g=0.024, notes=()):
    """a chapter's turn: the strings bloom on one chord and go, with a few notes of the harp over them"""
    strings(ch, s - 0.8, sec, g)
    for k, m in enumerate(notes):
        harp(m, s + 0.4 + 0.5 * k, 0.026, -0.3 + 0.3 * k)

# ---- soft sounds, all low-passed ----
def knock(s, g=0.016, pan=0.0, f=260):
    """a soft wooden knock: a tag, a card or a speech bubble arriving"""
    s_knock(s, g, pan, f)
def paper(s, g=0.02, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def cloth(s, g=0.016, pan=0.0, sec=0.6):
    """cloth handled: a soft, low rustle, duller than paper"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 700))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def rod(s, g=0.016, pan=0.0):
    """the inspector's rod laid down on the cloth: a low wooden tap, muffled by the cloth under it"""
    s_knock(s, g, pan, 170); cloth(s - 0.03, g * 0.5, pan, 0.16)
def pencil(s, sec=0.8, g=0.016, pan=0.0):
    """a pencil drawn on paper: graphite's grain, soft"""
    x = tt(sec); gr = np.abs(filt(noise(sec), 'low', 40))[:len(x)]; gr = gr / (gr.max() + 1e-6)
    X(filt(noise(sec), 'band', (500, 2200))[:len(x)] * (0.5 + 0.5 * gr) * env(sec, 0.04, 0.08), s, g, pan)
def tick(s, g=0.012, pan=0.0):
    """a pencil's short stroke"""
    pencil(s, 0.07, g, pan)
def pen(s, sec=1.2, g=0.013, pan=0.0):
    """a pen on paper: smoother than the pencil, a soft hiss that follows the hand"""
    x = tt(sec); gr = np.abs(filt(noise(sec), 'low', 12))[:len(x)]; gr = gr / (gr.max() + 1e-6)
    X(filt(noise(sec), 'band', (350, 1500))[:len(x)] * (0.4 + 0.6 * gr) * env(sec, 0.05, 0.1), s, g, pan)
def marker(s, sec=1.1, g=0.012, pan=0.0):
    """a felt-tip highlighter drawn along a line: a soft, even hiss, lower and smoother than a pencil"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1300))[:len(x)] * env(sec, 0.06, 0.1) * (0.85 + 0.15 * np.sin(2 * np.pi * 2.2 * x)), s, g, pan)
def pin(s, g=0.02, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g, pan, 360); s_tap(s + 0.004, g * 0.5, pan)
def unpin(s, g=0.01, pan=0.0):
    """a pin drawn out of cork: a small, dry pluck"""
    s_tap(s, g, pan); s_knock(s + 0.01, g * 0.4, pan, 420)
def slide(s, g=0.02, pan=0.0, sec=0.42):
    """a binder drawn forward along a wooden shelf: a low, rough slide, and a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5 * (1 + 0.4 * np.sin(2 * np.pi * 31 * x)), s, g, pan)
    s_knock(s + sec * 0.92, g * 0.5, pan, 200)
def air(s, sec=0.9, g=0.012, pan=0.0):
    """a breath of air, for something carried across, a light coming on, or a camera rising"""
    s_air(s, sec, g, pan)
def page(s, g=0.014, pan=0.0):
    """a page turning: a soft flutter, and the page laid down"""
    x = tt(0.34); X(filt(noise(0.34), 'band', (300, 1800))[:len(x)] * np.sin(np.pi * x / 0.34) ** 3 * (0.7 + 0.3 * np.sin(2 * np.pi * 14 * x)), s, g, pan)
    s_tap(s + 0.3, g * 0.3, pan)
def swing(s, g=0.012, pan=0.0):
    """a tag hung on its string: a short rasp of the string, and the card swinging"""
    x = tt(0.3); X(filt(noise(0.3), 'band', (300, 1200))[:len(x)] * np.sin(np.pi * x / 0.3) ** 1.5, s, g, pan); paper(s + 0.12, g * 0.6, pan, 0.3)
def stamp(s, g=0.028, pan=0.0):
    """a rubber stamp pressed on paper: a soft, low thump, and the paper under it"""
    s_knock(s, g, pan, 150); s_knock(s + 0.01, g * 0.5, pan, 260); paper(s, g * 0.4, pan, 0.12)
def chair(s, g=0.014, pan=0.0):
    """a chair taking someone's weight: a low wooden creak, and it settles"""
    x = tt(0.5); X(filt(noise(0.5), 'band', (150, 600))[:len(x)] * np.sin(np.pi * x / 0.5) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * (18 + 10 * x) * x)), s, g, pan)
    s_knock(s + 0.36, g * 0.5, pan, 150)
def clock(s, g=0.014, pan=0.0):
    """a wall clock's minute hand stepping onto the hour: a small, low clunk"""
    s_knock(s, g, pan, 300); s_knock(s + 0.012, g * 0.35, pan, 760)
_krng = np.random.default_rng(8)
def keys(s, n=5, g=0.011, pan=0.0, gap=0.15):
    """a phone's keys pressed, muffled, in an uneven run"""
    t0 = s
    for _ in range(n):
        s_tap(t0, g * float(_krng.uniform(0.7, 1.1)), pan); t0 += gap * float(_krng.uniform(0.7, 1.3))
def ring(s, g=0.006, pan=0.0):
    """a call ringing at the other end, heard faintly from the phone at his ear: two short, soft purrs"""
    for k in range(2):
        x = tt(0.36); sig = (np.sin(2 * np.pi * 400 * x) + np.sin(2 * np.pi * 450 * x)) * env(0.36, 0.02, 0.06)
        X(filt(sig.astype(np.float32), 'low', 900), s + 0.56 * k, g, pan)
def click(s, g=0.012, pan=0.0):
    """a mouse's click, muffled: down and up"""
    s_tap(s, g, pan); s_tap(s + 0.07, g * 0.55, pan)

# chords (MIDI note numbers), tuned pure over G: G major for the market, E-flat major for the university
G9 = [43, 50, 59, 62, 69]; GM = [43, 50, 55, 59, 62]; GB = [43, 50, 55, 59, 62, 69]; CMAJ7 = [48, 55, 59, 64, 67]; CADD9 = [48, 55, 62, 64, 67]
EM7 = [40, 47, 55, 59, 62]; EM9 = [40, 47, 55, 59, 66]; DMAJ = [38, 45, 50, 54, 57]; DSUS = [38, 45, 50, 55, 57]; BM = [47, 54, 59, 62, 66]
EBMAJ7 = [39, 46, 55, 58, 62]; EB9 = [39, 46, 55, 58, 65]; EB = [39, 46, 51, 55, 58]; ABMAJ7 = [44, 51, 55, 60, 63]; AB9 = [44, 51, 58, 60, 63]
BBSUS = [46, 53, 58, 63, 65]; BB = [46, 53, 58, 62, 65]; CM7 = [48, 55, 58, 63, 67]; EB6 = [39, 46, 55, 60, 63]

# 1. Who stands behind it: the strings hold the story's chords, in G, and the harp rolls them as the story moves: the yard of 1461,
#    the hall's precious goods, the streets from above, the 1520s; the buyer's trouble in E minor, with "who answers for it?" on the
#    celesta, left open; buyers lost in B minor; a suspension for "a market this big needs order", and G again as the trades find
#    their streets; the guild, its officer, the inspector's rod; the buyer at the master's stall, and a promise kept as they come back.
#    Then the turn: "Data has the same problem", the strings keep G and D while the bass falls to E-flat; the three answers turn gold,
#    the celesta rising with them. The mark under the title, in E-flat
most, air_, y20, st = W('bazaar', 'hall', 'most', -0.25), G('bazaar', 'streets', -0.3), G('bazaar', 'y1520'), G('bazaar', 'harm', -0.3)
search, poor, short = W('bazaar', 'harm', 'searching'), W('bazaar', 'harm', 'poor'), W('bazaar', 'harm', 'sold short')
stop, order, named, g16 = W('bazaar', 'lose', 'stop'), G('bazaar', 'order', -0.3), G('bazaar', 'named'), G('bazaar', 'guild', -0.3)
off, mkt, insp = W('bazaar', 'check', 'officers'), W('bazaar', 'check', 'market', -0.2), W('bazaar', 'check', 'inspector')
cc = max(W('bazaar', 'check', 'inspector', 0.9), G('bazaar', 'short', -1.4)); sold, ans = W('bazaar', 'short', 'short'), W('bazaar', 'short', 'answers')
buyer, back = G('bazaar', 'buyer', -0.4), G('bazaar', 'back', -0.2)
data, same = G('bazaar', 'data', -0.3), W('bazaar', 'data', 'same problem')
prod, prom, some = W('bazaar', 'data', 'a product'), W('bazaar', 'data', 'a promise'), W('bazaar', 'data', 'someone')
eve, title = G('bazaar', 'breath', -0.2), G('bazaar', 'breath', 1.2)
bed([(S0('bazaar'), G9), (most, CMAJ7), (air_, EM7), (y20, DMAJ), (st, EM9), (short, CMAJ7), (stop, BM), (order, DSUS), (named, GM),
     (g16, CADD9), (off, DMAJ), (cc, EM7), (buyer, CMAJ7), (back, GB), (data, EBMAJ7), (prom, ABMAJ7), (eve, EB9)], E('bazaar') + 1.5)
roll(G9, S0('bazaar') + 0.3, 0.024, up=12)
knock(W('bazaar', 'hall', 'stone', 0.15), 0.014, P(600))
roll(CMAJ7, most + 0.1, 0.018, up=12); knock(W('bazaar', 'hall', 'precious', 0.05), 0.014, 0.0)
air(air_ - 0.1, 1.8, 0.012, 0.0); harp(62, y20 + 0.2, 0.022, 0.2); air(y20 + 0.6, 1.6, 0.008, 0.0); knock(W('bazaar', 'y1520', 'eight', 0.05), 0.014, 0.0)
for k, t0 in enumerate([search, poor, short]):
    knock(t0 + 0.05, 0.014 * (1 - 0.15 * k), P(790))
cloth(poor - 0.15, 0.014, P(787), 0.5); cloth(short - 0.2, 0.016, P(787), 0.6); question(short + 0.2, 79, 0.028, -0.1)
harp(47, stop + 0.2, 0.024, -0.2)
air(order, 1.4, 0.01, 0.0); roll(GM, named + 0.1, 0.02, up=12)
for k in range(3):
    knock(named + 0.65 + k * 0.8, 0.013 * (1 - 0.15 * k), (-0.4, 0.1, 0.4)[k])
knock(W('bazaar', 'guild', 'guild', 0.05), 0.014, P(330)); knock(W('bazaar', 'guild', 'rules', 0.05), 0.012, P(330)); knock(off + 0.05, 0.013, P(730))
cloth(off + 0.2, 0.012, P(700), 0.5); knock(insp + 0.05, 0.013, P(768))
for k in range(2):
    cloth(cc + 0.2 + k * 1.0, 0.01, P(700), 0.4); rod(cc + 0.2 + k * 1.0 + 0.85, 0.016, P(900 + 400 * k))
pencil(sold, 0.6, 0.016, 0.1); knock(sold + 0.25, 0.013, 0.1); harp(40, ans + 0.1, 0.024, -0.2)
for k, w in enumerate(['find', 'what', 'who']):
    knock(W('bazaar', 'buyer', w, 0.05), 0.013 * (1 - 0.12 * k), P(470))
promise(back + 0.35, 79, 0.03, 0.0); roll(GB, back + 0.1, 0.018, up=12)
paper(data + 0.1, 0.018, P(600), 0.5); roll(EBMAJ7, data + 0.2, 0.02, up=12)
for k in range(3):
    knock(same + 0.2 + 0.3 * k, 0.012 * (1 - 0.15 * k), P(1310))
promise(prod, 75, 0.03, 0.2); celesta(79, prom + 0.05, 0.026, 0.3); celesta(82, some + 0.05, 0.024, 0.4)
air(title, 1.2, 0.01, 0.0); mark(title + 0.6)

# 2. Nobody's table: the title's chord and the mark carry over and go. A binder drawn off the shelf, binder 22 open on the desk; Anil's
#    name card; on census day, the wall clock's hand reaching seven over an empty chart, and one low note of the harp; the sheet of
#    places; Anil's phone, its keys and the call ringing at the other end; a knock as each name is tagged and for Clara's speech bubble;
#    the card over the corridor, hung on its strings, and "who answers for it?" on the celesta, left open; the calendar's pages turning
#    to the next census day; and the strings bloom in the pause, into Planning's room
take, desk = G('late', 'policy', 0.2), W('late', 'policy', 'data is', -0.15)
slide(take - 0.1, 0.02, P(1180), 0.45); paper(desk + 0.1, 0.016, 0.1, 0.4)
fac = G('late', 'anil', -0.3); knock(fac + 0.55, 0.013, P(700))
seven = W('late', 'census', 'seven'); clock(seven, 0.014, P(1760)); harp(48, seven + 0.1, 0.024, 0.0)
paper(G('late', 'needed', -0.2), 0.016, 0.0, 0.4)
phone = G('late', 'asked', -0.8); keys(phone + 0.15, 5, 0.01, P(1000)); ring(phone + 0.95, 0.006, P(1000))
knock(W('late', 'asked', 'built', 0.05), 0.013, P(674)); knock(W('late', 'round', 'Noor designed', 0.05), 0.013, P(1380))
knock(W('late', 'round', 'Planning asked', 0.05), 0.013, P(540)); knock(W('late', 'round', 'Jun builds', 0.05), 0.014, P(420), 300)
fl, nobody = G('late', 'nobody', -0.4), W('late', 'nobody', 'nobody')
swing(fl + 0.25, 0.012, 0.0); question(nobody + 0.1, 75, 0.03, 0.0); knock(nobody + 0.05, 0.012, 0.0)
again = G('late', 'again', -0.3)
for k in range(5):
    page(again + 1.4 + 0.52 * k + 0.08, 0.014 if k == 0 else 0.009, P(1500))
knock(again + 4.25, 0.012, P(1500))
turn(EB9, S0('promise'), 5.5, 0.022, (63, 67))

# 3. Data with a promise: Yusuf's chair as he sits; the question written on its card, the card that answers it slid in; a breath as the
#    catalogue lights; each line of the card written in; then the card complete, the chapter's turn: the gold frame drawn round it, a
#    promise kept on the celesta, the strings and the harp; a pencil ring round its owner, a knock for each word that names it; Clara
#    pins it up, and it takes its place in the catalogue
chair(W('promise', 'sit', 'sits'), 0.014, P(1500))
q1, q2 = W('promise', 'question', 'what does', -0.1), W('promise', 'question', 'who keeps', -0.1)
pen(q1, 0.9, 0.013, 0.2); pen(q2, 0.6, 0.013, 0.2); paper(G('promise', 'write', -0.1), 0.018, 0.0, 0.5)
air(W('promise', 'write', 'catalogue', -0.6), 1.0, 0.009, 0.3)
for t0, d in [(W('promise', 'for', 'for', -0.2), 1.0), (W('promise', 'for', 'use', -0.1), 1.0), (W('promise', 'for', 'Clara', -0.2), 0.8), (G('promise', 'contract', 0.1), 1.8),
              (W('promise', 'levels', 'built', -0.1), 2.0), (W('promise', 'ask', 'ask', -0.2), 0.6), (W('promise', 'ask', 'version', 0.1), 0.9)]:
    pen(t0, d, 0.012, -0.1)
frame = W('promise', 'product', 'data product', -0.1)
turn(AB9, frame, 8.0, 0.024); roll(EB9, frame + 0.1, 0.02, up=12); promise(frame + 0.45, 75, 0.032, 0.1)
for k, w in enumerate(['data,', 'a promise', 'an owner']):
    knock(W('promise', 'product', w, 0.05), 0.012 * (1 - 0.12 * k), P(1268))
pencil(W('promise', 'product', 'an owner'), 0.8, 0.014, 0.0)
pinT = G('promise', 'product', 4.4); pin(pinT + 0.35, 0.022, P(1372)); air(pinT + 0.5, 0.9, 0.01, P(910)); harp(70, pinT + 0.6, 0.022, P(910))

# 4. Who answers for what: Clara's card on the glass, and a soft knock for each thing she answers for; Mei's card; the market's chord
#    as the story goes back to the cap makers' street, a knock for the guild and for the master; the two gold tags, the meaning's owner
#    and the product's, two notes of the celesta a third apart, sounding together; the strings bloom in the pause, into the next room
knock(G('answers', 'clara', 0.3), 0.014, -0.3, 300)
for k, w in enumerate(['on time', 'keeps its', 'users are']):
    knock(W('answers', 'clara', w, 0.05), 0.011 * (1 - 0.1 * k), -0.3)
knock(W('answers', 'mei', 'Mei', -0.15), 0.014, 0.3, 300)
baz = G('answers', 'guild', -0.3); market(baz + 0.1, 0.02); knock(W('answers', 'guild', 'guild', 0.05), 0.013, P(607)); knock(W('answers', 'guild', 'each master', 0.05), 0.013, P(300))
celesta(75, W('answers', 'two', 'meaning', 0.05), 0.026, 0.3); celesta(79, W('answers', 'two', 'product', 0.05), 0.026, -0.3)
turn(EB6, S0('job'), 5.0, 0.02, (60,))

# 5. Wanting the job: a knock for "I'm not technical"; the notebook's page turned, the pen round the dashboard and each faculty, a knock
#    for each thing named; the three cards laid down by the product's card, the change request slid in; then the turn, as Clara unfolds
#    her arms and reaches for the pen: the strings, her pen as she signs, and a promise kept as "the promise" comes in gold
knock(W('job', 'didnt', "I'm", -0.1), 0.014, 0.2, 300)
book = G('job', 'depends', -0.4); page(book + 0.4, 0.016, 0.0)
dash, fac = W('job', 'depends', 'near-award', -0.1), W('job', 'depends', 'every faculty', -0.1)
pen(dash, 0.8, 0.012, -0.2); pen(fac, 0.6, 0.012, 0.2)
for k in range(1, 6):
    tick(fac + 0.35 + 0.3 * k, 0.01 if k == 1 else 0.007, 0.2 + 0.05 * k)
for k, t0 in enumerate([dash + 0.1, fac + 0.1, W('job', 'worth', 'a number'), W('job', 'worth', 'someone')]):
    knock(t0 + 0.05, 0.012 * (1 - 0.08 * k), (-0.3, 0.3, -0.3, 0.3)[k])
for k, (w, cx) in enumerate([('Jun', 940), ('Noor', 1150), ('Sam', 1360)]):
    t0 = W('job', 'comes', w, -0.1); paper(t0 + 0.2, 0.012, P(cx), 0.3); knock(t0 + 0.5, 0.012 * (1 - 0.1 * k), P(cx))
chg = W('job', 'comes', 'any change', -0.1); paper(chg, 0.018, 0.4, 0.6)
room, sign = END('job', 'comes', 0.1), G('job', 'code', 0.25)
turn(EB9, room + 0.3, 7.0, 0.022); pen(sign + 0.3, 1.2, 0.014, -0.1)
promise(W('job', 'code', 'promise'), 75, 0.03, -0.2); knock(W('job', 'code', 'promise', 0.05), 0.012, -0.2); knock(W('job', 'code', 'not the', 0.05), 0.01, 0.1)

# 6. Products and steps: ten rows of the register light up, the harp running up with them, a pin for each product's tag; a low breath as
#    the steps go grey; the market's chord and the inspector's rod; Tom's change request slides in and the check stamps it; his pen as he
#    names its product and its owner; then the check turns green, the chapter's turn: a pencil's tick, the strings, a promise kept; and
#    a knock for each kind of product
ten = W('steps', 'models', 'Ten')
for j, m in enumerate([63, 65, 67, 70, 72, 74, 75, 77, 79, 82]):
    harp(m, ten + 0.09 * j + 0.1, 0.012, -0.4 + 0.08 * j, 1.8)
tags = W('steps', 'models', 'each of')
for k in range(6):
    pin(tags + 0.42 * k + 0.3, 0.016 if k == 0 else 0.009, P(1500))
stepsT = W('steps', 'rest', 'steps'); air(stepsT - 0.2, 1.0, 0.008, -0.2); knock(stepsT + 0.2, 0.012, P(570))
baz = W('steps', 'goods', 'like goods', -0.25); market(baz + 0.1, 0.018)
for k in range(2):
    cloth(baz + 0.25 + 0.9 * k, 0.01, P(700), 0.4); rod(baz + 0.25 + 0.9 * k + 0.85, 0.016, P(900 + 400 * k))
tom = W('steps', 'goods', 'a table', -0.3); paper(tom + 0.2, 0.018, 0.0, 0.6); stamp(W('steps', 'goods', 'a table', 0.9) + 0.12, 0.026, P(700))
wr = W('steps', 'goods', 'or the', -0.8); pen(wr, 1.0, 0.013, 0.0); pen(wr + 1.15, 0.75, 0.013, 0.0)
back = END('steps', 'goods', -0.1)
tick(back + 0.5, 0.014, P(1300)); knock(back + 0.65, 0.012, P(1300)); turn(EBMAJ7, back + 0.2, 6.5, 0.024, (58, 63)); promise(back + 0.5, 75, 0.03, 0.2)
for k, w in enumerate(['close', 'some join', 'some serve']):
    t0 = W('steps', 'kinds', w, -0.1); paper(t0 + 0.05, 0.012, P(225 + 500 * k + 235), 0.3); knock(t0 + 0.45, 0.012 * (1 - 0.1 * k), P(225 + 500 * k + 235))

# 7. Known by name: the mailing list goes grey with a low breath; the record of who uses what slid over it; a knock for the learner
#    records' card and for each product that uses them; Mei looks up: "she knows who does", one note of the celesta; and the strings
#    bloom in the pause, into the board
air(W('readers', 'knows', 'mailing'), 0.8, 0.008, 0.0); paper(W('readers', 'knows', 'the record', -0.1), 0.018, 0.4, 0.7)
lr = W('readers', 'three', 'learner records', -0.4); knock(lr + 0.45, 0.013, -0.2)
for k, w in enumerate(['wallet', 'Planning', 'Finance']):
    knock(W('readers', 'three', w, -0.1), 0.012 * (1 - 0.1 * k), 0.1 + 0.15 * k)
knock(W('readers', 'mei', 'for everyone', 0.05), 0.012, P(1420)); knock(W('readers', 'mei', 'she knows', 0.05), 0.011, P(1420))
celesta(79, W('readers', 'mei', 'she knows', 0.15), 0.024, 0.3)
turn(EB9, S0('life'), 5.0, 0.02)

# 8. From draft to retired: the four steps painted along the board, four notes of the harp rising; Planning's card pinned at draft,
#    Clara's tick and one note of the celesta, the card unpinned and pinned again at active, a soft knock as its users come up; the card
#    with no name moved on to deprecated, its date tag hung, the arrow drawn and its users going; the calendar pinned up, the learner
#    records' card pinned and opened, edition 1 moved and pinned, its date tag hung; the calendar's pages turning to the end of March;
#    and the product retired, the chapter's turn: the slip moved to retired, the strings, and the harp low, home, as it greys
L = {'draft': P(420), 'active': P(780), 'deprecated': P(1140), 'retired': P(1500)}  # the four steps' places along the board, as pans
for i, m in enumerate([63, 67, 70, 75]):
    harp(m, G('life', 'life', 0.2 + i * 0.32), 0.022, -0.45 + 0.3 * i)
card, tk, act = W('life', 'draft', 'a draft', -0.3), W('life', 'draft', 'says it', 0.05), W('life', 'draft', 'and active', -0.2)
pin(card + 0.35, 0.02, L['draft']); pencil(tk, 0.35, 0.016, L['draft']); celesta(75, tk + 0.3, 0.024, L['draft'])
unpin(act - 0.1, 0.01, L['draft']); paper(act, 0.012, P(600), 0.6); pin(act + 0.75, 0.018, L['active'])
rely = W('life', 'draft', 'rely', -0.25)
for i in range(3):
    knock(rely + 0.2 * i + 0.25, 0.009 * (1 - 0.15 * i), L['active'], 320)
dep = W('life', 'dep', 'deprecated', -0.3); unpin(dep - 0.1, 0.01, L['active']); paper(dep, 0.012, P(960), 0.6); pin(dep + 0.75, 0.018, L['deprecated'])
swing(W('life', 'dep', 'a date', -0.15), 0.012, L['deprecated']); pencil(W('life', 'dep', 'its users', -0.1), 0.7, 0.014, P(900))
move = W('life', 'dep', 'asked to move', -0.05); air(move, 1.5, 0.009, P(850)); knock(move + 0.3, 0.011, P(900))
old = G('life', 'old', -0.25); unpin(old, 0.008, L['deprecated']); pin(old + 0.55, 0.016, P(1515))
pin(G('life', 'old', 0.45), 0.018, L['active']); paper(W('life', 'old', 'goes the', -0.35), 0.014, L['active'], 0.5)
ed = W('life', 'old', 'the same', 0.05); unpin(ed - 0.05, 0.009, L['active']); paper(ed + 0.1, 0.012, P(960), 0.8); pin(ed + 1.05, 0.016, L['deprecated'])
swing(G('life', 'old', 2.25), 0.011, L['deprecated'])
cal = W('life', 'first', 'so at', -0.15)
for k in range(5):
    page(cal + 0.42 * k + 0.08, 0.013 if k == 0 else 0.008, P(1515))
ret = W('life', 'first', 'retired', -0.3)
unpin(ret - 0.05, 0.009, L['deprecated']); paper(ret + 0.1, 0.012, P(1320), 0.6); pin(ret + 0.75, 0.016, L['retired'])
turn(ABMAJ7, ret + 0.1, 5.2, 0.022); harp(39, ret + 0.85, 0.026, 0.3); harp(46, ret + 1.25, 0.018, 0.1)

# 9. Found, and trusted: the mouse's click as Anil opens Planning's product, a breath as it opens, its three rows; the market's chord
#    and a knock for what the buyer knows; his pen on the sheet of places; the corridor's card turns gold, a promise kept, the
#    question of the second chapter answered; the highlighter along binder 22's line, and his pen under it. The film's last look at the
#    market, softly in G, then the turn into E-flat on the harp as governance does the same for data: the celesta rising with "find it",
#    "trust it", "build on it", and the harp with each owner's name in gold. Anil's next request slid up, his name written, and its empty owner's
#    line a question, left open. The strings and the mark under the end card
open_ = W('found', 'finds', 'its promise', -0.6)
click(open_ - 0.05, 0.012, P(1000)); air(open_ + 0.05, 0.7, 0.009, 0.0)
for k, w in enumerate(['its promise', 'its owner', 'where to ask']):
    knock(W('found', 'finds', w, 0.05), 0.009 * (1 - 0.1 * k), P(700), 320)
bz = G('found', 'like', -0.35); market(bz + 0.15, 0.016, 4)
for k, w in enumerate(['where to', 'what it', 'who stands']):
    knock(W('found', 'like', w, 0.05), 0.012 * (1 - 0.12 * k), P(470))
sheet = W('found', 'like', 'who stands', 0.6); paper(sheet - 0.1, 0.012, 0.0, 0.4); pen(sheet + 0.25, 1.6, 0.013, 0.2)
promise(W('found', 'late', 'Clara', -0.1), 75, 0.03, P(640))
marker(W('found', 'runs', 'runs'), 1.1, 0.012, -0.1); note = W('found', 'runs', 'a product', -0.1); pen(note, G('found', 'runs', 3.97) - note, 0.012, 0.0)
eveF, dataF = G('found', 'gives', -0.3), W('found', 'gives', 'Governance', -0.25)
strings(GM, eveF - 0.6, dataF - eveF + 1.8, 0.018); market(eveF + 0.1, 0.016, up=12); roll([39, 46, 55, 58], dataF + 0.1, 0.02, 0.12)
for k, (t0, m) in enumerate(zip([W('found', 'gives', 'people find', 0.25), W('found', 'gives', 'trust it'), W('found', 'gives', 'build on')], [75, 79, 82])):
    celesta(m, t0 + 0.05, 0.024, -0.3 + 0.3 * k); knock(t0 + 0.05, 0.01, P(660 + 300 * k))
own = G('found', 'own')
for i, m in enumerate([63, 67, 70, 75, 79, 82]):
    harp(m, own + 0.12 + i * 0.16, 0.016, -0.5 + 0.2 * i)
req = W('found', 'next', 'Next', 0.6); paper(req - 0.4, 0.016, 0.0, 0.7)
an = W('found', 'next', 'a list', 0.4); pen(an, 1.1, 0.013, -0.2)
question(W('found', 'next', 'an owner', 0.05), 75, 0.028, 0.1)
endc = G('found', 'breath', -0.2); air(endc, 1.2, 0.01, 0.0); strings(EB9, endc - 1.0, E('found') - endc + 2.0, 0.026)
mark(endc + 0.7)

# every effect above, 4 dB up together: the softest still reads on a phone's speaker, and the loudest stays about 20 dB under the voice
for b in (XL, XR):
    b *= 1.6
soften(2500)
