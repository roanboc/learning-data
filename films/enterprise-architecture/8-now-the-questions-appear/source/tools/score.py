# Now the questions appear: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for Kerala's coast in 1997, a celesta over bowed string pads
# in A minor, and the sea itself, as slow, uneven waves of low, filtered noise (no borrowed Indian instruments: the story is told in the
# series' own voice). It darkens as the catch goes back into the sea, where a low, muted pulse rises under the waste and fades as the
# phones arrive. Then nylon-string plucks and a soft flute over warm pads, here in C major, for the present, and the series' own mark,
# four notes rising 1-3-5-8, on the flute and the nylon string together, at the title and the end. Back on the coast, near the end, the
# strings and the sea return, in A major now, as the phones spread. The celesta comes back, softly, wherever an answer reaches someone
# in time: as the skipper's price comes back, as the measure's light climbs to the goal it checks (in Grace's chain and in the
# skipper's), as Tomás's note gets its answer, and under the end card.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the chapters; nothing repeats in the background. The sea is
#    on screen for the whole first chapter, and each of its waves has its own length and size.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: wooden knocks, paper, muffled keys, low felt notes, filtered below about 2.5 kHz. The celesta's
# upper partials ring higher than that, so it's played with its top taken off, at 2.6 kHz, like the nylon string; the score then
# measures within the series' range above 4 kHz (PLAYBOOK.md), and needs no soften() over the whole of it.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)

# ---- the series' instruments, all low-passed ----
def nylon(m, start, g=0.04, pan=0.0, sec=1.8):
    """a nylon string: a few harmonics that fade from the top, warm and short"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.4) * np.exp(-x * (1.2 + 1.6 * k)) for k in range(1, 8))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2200)), start, g, pan)
def cel(m, start, g=0.04, pan=0.0):
    """the celesta, for the coast in 1997, and wherever an answer reaches someone in time: the library's celesta, its top taken off"""
    f = mf(m); x = tt(2.0)
    s = sum(np.sin(2 * np.pi * f * r * x + r) * np.exp(-x / d) * a for r, d, a in ((1, 1.1, 1), (4, 0.3, 0.3), (8.2, 0.08, 0.08)))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2600)), start, g, pan)
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

# ---- the coast's own sounds ----
def sea(s0, s1, g=0.03, seed=8, lo=110, hi=1300, waves=(5.5, 8.5), rise=4.0, fall=3.0, pans=(-0.55, 0.55)):
    """the sea, while it's on screen: slow waves of low, filtered noise, a train of them on each side, each wave its own length and
    size, so the two never fall into step; a low roll that's always there, and a wash that rises with each wave and falls back.
    On the music bus, so it settles under the voice like the chords do"""
    r = np.random.default_rng(seed); sec = s1 - s0; x = tt(sec); n = len(x)
    edge = (np.minimum(1, x / rise) * np.clip((sec - x) / fall, 0, 1)).astype(np.float32)
    for pan in pans:
        e = np.zeros(n, np.float32); t0 = -r.uniform(0, waves[0])
        while t0 < sec:
            d = r.uniform(*waves); a = r.uniform(0.5, 1.0); i0 = int(t0 * SR); m = int(d * SR); k = np.arange(m, dtype=np.float32) / m
            w = a * np.where(k < 0.35, np.sin(0.5 * np.pi * k / 0.35) ** 2, np.cos(0.5 * np.pi * (k - 0.35) / 0.65) ** 2)
            j0, j1 = max(0, i0), min(n, i0 + m)
            if j1 > j0:
                e[j0:j1] = np.maximum(e[j0:j1], w[j0 - i0:j1 - i0])
            t0 += d * r.uniform(0.5, 0.75)
        roll = filt(noise(sec), 'band', (lo, lo * 5)) * (0.4 + 0.6 * e)
        wash = filt(noise(sec), 'band', (lo * 3.5, hi)) * e ** 1.6
        put(((roll + 0.7 * wash) * edge).astype(np.float32), s0, g, pan)
def pour(s, sec=2.4, g=0.03, pan=-0.6):
    """the catch, tipped from the baskets into the swash: a slither of fish and water that rises and falls, and small splashes in it"""
    x = tt(sec); body = norm(filt(noise(sec), 'band', (200, 1400)))
    drops = norm(filt(((rng.random(len(x)) < 0.004) * rng.standard_normal(len(x))).astype(np.float32), 'band', (300, 1500)))
    X(norm(((0.6 * body + drops) * np.sin(np.pi * x / sec) ** 1.3).astype(np.float32)), s, g, pan)
def wake(s, sec=2.6, g=0.02, pan=0.0):
    """a boat under way: water along the hull, low, rising and falling as it moves"""
    x = tt(sec); X(filt(noise(sec), 'band', (140, 900)) * np.sin(np.pi * x / sec) ** 2 * (1 + 0.25 * np.sin(2 * np.pi * 1.3 * x)), s, g, pan)
def dial(s, g=0.012, pan=-0.6):
    """a number keyed on the skipper's phone: three muffled keys"""
    for k in range(3):
        tap(s + k * 0.09, g * (0.8 + 0.1 * k), pan)
def rise(s, sec=1.2, g=0.03):
    """the wall between the network and retail, drawn down the frame: a low roll that grows with it and settles"""
    x = tt(sec); X(filt(noise(sec), 'low', 220) * np.sin(np.pi * x / sec) ** 1.5, s, g)

# chords (MIDI note numbers): A minor for the coast, F minor where the catch goes back, E as the phones arrive, A major as they spread,
# and E with its fourth, which shares its notes with both A major and C, for the question; C major and its neighbours for the present
AM9 = [45, 52, 55, 59, 60]; FMAJ7 = [41, 48, 52, 57]; DM9 = [38, 45, 48, 52, 53]; FMIN = [41, 48, 53, 56]; E7SUS = [40, 47, 50, 52, 57]
AMAJ9 = [45, 52, 56, 59, 61]; ESUS4 = [40, 47, 52, 57, 59]
CMAJ9 = [36, 43, 47, 50, 52]; FMAJ9 = [41, 48, 52, 55, 57]; GSUS4 = [43, 50, 55, 57, 60]; EM7 = [40, 47, 50, 55]; CMAJ7 = [36, 43, 47, 52]
def mark(start, root=48, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)


# 1. Where to land: bowed strings in A minor, and the sea, from the first view of the coast to the title. The celesta as Kerala is lit
#    and as the beach markets appear along the coast; water along the hulls as the boats come in. Muffled keys as the skippers wonder,
#    at sea, what the markets will pay, and water again as they go in not knowing. At Badagara, a low knock for each of the eleven
#    boats as it's counted; the surf, close, while the beach is on screen; the catch slithering into the swash; a knock for each crowd
#    of buyers, and a low note as they leave. A muted pulse, leaning on the semitone, under the waste, fading as the phones reach the
#    coast. Then the celesta as the towers come up; for each call, the skipper keying the number, and the celesta as each price comes
#    back, rising with it; a soft press as the price is agreed, water along the hull as the boat turns for its market, and a breath of
#    air as Chombala's buyers come down to the beach. Paper for the question, and softly for the morning drawn under it; a nylon note
#    as the choice lights; the celesta, twice, as the answer moves to "in time"; then C major, and the mark under the title
K = 'kerala'
tK = lambda lid, off=0: C(K, lid, off)
bed(K, [AM9], 0, cq(K, 'markets'), g=0.024, tone='strings', bassg=0.016)
bed(K, [FMAJ7, DM9], cq(K, 'markets'), cq(K, 'dump'), g=0.024, tone='strings', bassg=0.016)
bed(K, [FMIN], cq(K, 'dump'), cq(K, 'phones'), g=0.024, tone='strings', bassg=0.018)
bed(K, [E7SUS], cq(K, 'phones'), cq(K, 'act'), g=0.024, tone='strings', bassg=0.016)
bed(K, [ESUS4], cq(K, 'act'), cq(K, 'breath'), g=0.024, tone='strings', bassg=0.016)
sea(S0(K) + 0.8, E(K) + 0.5, 0.036)
cel(69, S0(K) + 1.8, 0.018, 0.2); cel(76, S0(K) + 2.15, 0.014, 0.25)
tMk = W(K, 'markets', 'beach markets', -0.4)
for k, m in enumerate([69, 72, 74, 76, 79]):
    cel(m, tMk + 0.05 + k * 0.165, 0.011, -0.3 + k * 0.15)
wake(tK('markets', 0.6), 6.0, 0.012, 0.1)
tCh, tWo = W(K, 'blind', 'must choose'), W(K, 'blind', 'without knowing')
for j in range(0, 10, 2):
    tap(tCh - 0.1 + j * 0.08, 0.008, -0.2 + j * 0.06)
wake(tWo, 3.8, 0.014, 0.1)
cnt = W(K, 'dump', 'eleven crews')
for k in range(11):
    s_knock(cnt + k * 0.09, 0.009, -0.1 + k * 0.02, 210 + 9 * (k % 4))
tB0, tB1 = W(K, 'dump', 'their catch', -0.5), tK('phones', 0.3)
sea(tB0, tB1, 0.02, seed=21, lo=130, hi=1700, waves=(3.2, 5.0), rise=0.8, fall=0.8, pans=(-0.75, -0.35))
pour(W(K, 'dump', 'goes back'), 2.4, 0.032, -0.6)
for k, d in enumerate([0, 0.3]):
    knock(W(K, 'dump', 'twenty-seven', d), 0.014, 0.35 + 0.15 * k)
knock(W(K, 'dump', 'Within fifteen', 0.4), 0.01, 0.05)
soft(41, W(K, 'dump', 'leave with'), 0.022, 0.4); soft(36, W(K, 'dump', 'leave with', 0.9), 0.018, 0.4)
urgent(tK('dump', -0.2), tK('phones', 1.4), bpm=96, root=41, g=0.034, fade=1.6, steps=(0, 0, 1, 0))
cel(69, tK('phones', 0.25), 0.014, 0.1); cel(74, tK('phones', 0.6), 0.012, 0.15)
tC = W(K, 'phones', 'calls buyers')
for k, (d, m) in enumerate([(-0.1, 64), (0.55, 69), (1.2, 71)]):
    dial(tC + d, 0.01, -0.6); cel(m, tC + d + 0.5, 0.016, 0.0 + 0.15 * k)
tAg = W(K, 'phones', 'agrees')
press(tAg + 0.05, 0.022); cel(76, tAg + 0.1, 0.018, 0.3)
tOn = W(K, 'phones', 'only then')
wake(tOn, 3.2, 0.02, 0.2); air(tOn + 2.2, 1.4, 0.012, 0.25)
paper(W(K, 'act', 'what will', -0.3), 0.03, -0.4, 0.5)
paper(W(K, 'act', 'It mattered', -0.3), 0.016, -0.4, 0.4)
nylon(64, W(K, 'act', 'choosing', -0.1), 0.016, -0.4)
tAn = W(K, 'time', 'brought')
cel(69, tAn + 0.95, 0.016, -0.4); cel(76, tAn + 1.3, 0.018, -0.4)
bed(K, [CMAJ9], cq(K, 'breath') + 0.4, None, g=0.03, tone='warm', bassg=0.022)
mark(G(K, 'breath', 1.6), 48)
# 2. The backlog, read again: paper as Tomás's note goes up; muffled keys as the forty-two are dealt into their grid; a knock for the
#    count, and for each of the three read close; soft stamps as most are marked urgent; a low note as he can't tell which matter; a knock
#    for each layer of the map as it stacks, and a swell under it; a knock for the skipper's test, and a nylon note as it asks "who will"
L = 'backlog'
bed(L, [CMAJ9, AM9, FMAJ9, GSUS4])
paper(S0(L) + 0.3, 0.035, 0.0, 0.6)
tDeal = W(L, 'pile', 'their backlog')
for i in range(10):
    tap(tDeal + i * 0.19, 0.01, 0.65 - i * 0.12)
knock(W(L, 'pile', 'forty-two'), 0.018, 0.08)
for word, pan in [('reports', -0.45), ('dashboards', 0.08), ('extracts', 0.6)]:
    knock(W(L, 'pile', word, -0.1), 0.022, pan)
for k in range(4):
    press(W(L, 'pile', 'urgent', k * 0.13), 0.016)
soft(45, C(L, 'test', -0.2), 0.022, -0.6)
tMap = W(L, 'test', "Now there's")
for i in range(6):
    knock(tMap + 0.3 + i * 0.185, 0.011, 0.5)
swell([36, 43, 48, 55], tMap + 0.3, 3.0, 0.02)
knock(W(L, 'test', "skipper's test", -0.1), 0.02, 0.5); nylon(67, W(L, 'test', 'who will'), 0.02, 0.5)
# 3. Up from a request: a knock as the request arrives; a knock and a nylon note for each step it's traced up, rising, C, E, G, to
#    the goal; a press and the octave as it reaches the top. Then the lobby's dashboard: a knock; the skipper's three keys as his phone
#    is set beside it; a muffled key for the question and for the empty slot, and low felt notes for "no one" and "reaches nothing"
U = 'up'
bed(U, [CMAJ9, FMAJ9, GSUS4], 0, cq(U, 'lobby'))
bed(U, [AM9, DM9], cq(U, 'lobby'), None)
knock(C(U, 'first', 0.1), 0.022, -0.35)
for word, lid, m in [('to decide', 'first', 60), ('maintaining assets', 'climb', 64), ('replace assets', 'climb', 67)]:
    t0 = W(U, lid, word, -0.2); knock(t0, 0.014, -0.35); nylon(m, t0 + 0.05, 0.022, -0.35)
tap(W(U, 'first', "Grace's"), 0.012, -0.55)
top = W(U, 'climb', 'reaches the top')
press(top, 0.026); nylon(72, top + 0.05, 0.022, -0.35)
knock(C(U, 'lobby', 0.1), 0.022, 0.46)
dial(W(U, 'live', 'as live', -0.1), 0.01, 0.55)
tap(W(U, 'live', 'who decides'), 0.012, 0.46); tap(W(U, 'live', 'who decides', 0.4), 0.012, 0.46)
soft(45, W(U, 'live', 'No one'), 0.024, 0.46); soft(40, W(U, 'live', 'reaches nothing'), 0.022, 0.46)
# 4. Half of them: knocks and muffled keys as the goals, decisions and requests go up; air as all forty-two are traced; nylon notes,
#    rising, as the goals light; a low note for the regulator; a low note as the other half reach nothing; a knock for each of the three
#    read close; paper for each one's question, and air as they go back
H_ = 'half'
bed(H_, [CMAJ9, FMAJ9], 0, cq(H_, 'none'))
bed(H_, [AM9, EM7, DM9], cq(H_, 'none'), None)
for i, pan in enumerate([-0.7, -0.2, 0.32, 0.76]):
    knock(S0(H_) + 0.2 + i * 0.1, 0.012, pan)
for i in range(0, 7, 2):
    tap(S0(H_) + 0.4 + i * 0.06, 0.009, -0.8 + i * 0.27)
for i in range(4):
    tap(S0(H_) + 0.65 + i * 0.22, 0.008, -0.6 + i * 0.4)
air(C(H_, 'all', 0.2), 2.4, 0.016)
reach = W(H_, 'all', 'Twenty-one reach')
for i, (m, pan) in enumerate(zip([60, 64, 67, 72], [-0.7, -0.2, 0.32, 0.76])):
    nylon(m, reach + 0.6 + i * 0.15, 0.018, pan)
obl = W(H_, 'all', 'obligation'); knock(obl, 0.012, 0.44); soft(48, obl + 0.05, 0.02, 0.76)
soft(45, C(H_, 'none'), 0.022, 0.44)
for word, pan in [('needed once', -0.65), ('nobody acts', 0.0), ('nobody can', 0.65)]:
    knock(W(H_, 'none', word, -0.3), 0.02, pan)
for j, pan in enumerate([-0.5, 0.14, 0.79]):
    paper(W(H_, 'back', 'one question', j * 0.25), 0.024, pan, 0.4)
air(W(H_, 'back', 'goes back'), 1.7, 0.03)
air(W(H_, 'back', 'decide with', 0.4), 1.3, 0.024)
# 5. Down from a goal: a nylon note as the goal lands from above, and one for each row it implies, falling, G, E, C; air as the shape
#    moves aside; knocks for the goal, its outcome and each step of its path; a soft stamp for "how would anyone check?"; paper for the
#    planners' request; a press and two nylon notes as the two lines meet at one decision; then the celesta, rising, as the measure's
#    light climbs to the goal and crosses to the outcome, now checkable, with a soft press for its tick; C major for the wordless moment
D = 'down'
bed(D, [FMAJ9, DM9, AM9, GSUS4], 0, cq(D, 'breath'))
bed(D, [CMAJ9], cq(D, 'breath'), None, g=0.036)
r0 = W(D, 'way', 'the other way'); knock(r0 + 0.9, 0.014, 0.0); nylon(72, r0 + 0.95, 0.02, 0.0)
for word, m, n, pan in [('implies decisions', 67, 2, 0.0), ('needs questions', 64, 4, 0.0), ('needs a measure', 60, 4, 0.0)]:
    t0 = W(D, 'way', word, -0.2); nylon(m, t0, 0.02, pan)
    for j in range(n):
        tap(t0 + j * 0.08, 0.008, -0.5 + j * (1.0 / max(1, n - 1)))
air(C(D, 'better', -0.5), 1.6, 0.018, -0.3)
knock(W(D, 'better', 'Take'), 0.02, 0.08)
knock(W(D, 'better', 'a better network', -0.3), 0.016, 0.66)
press(W(D, 'better', 'nobody could', 0.1), 0.026)
for word in ['Its decision', 'its question']:
    knock(W(D, 'measure', word), 0.016, 0.08)
paper(W(D, 'measure', 'the planners asked'), 0.026, 0.67)
me = W(D, 'unit', 'The measure'); knock(me, 0.018, 0.08); soft(43, me + 0.05, 0.02, 0.08)
tap(W(D, 'unit', 'per year'), 0.012, 0.55)
meet = W(D, 'meet', 'meet at one')
press(meet, 0.028); nylon(60, meet + 0.02, 0.02, -0.15); nylon(67, meet + 0.1, 0.018, 0.15)
chk = W(D, 'meet', 'can be checked')
for k, m in enumerate([67, 72, 76]):
    cel(m, chk + 0.1 + k * 0.35, 0.016, 0.08)
cel(79, chk + 1.25, 0.016, 0.6); press(chk + 1.2, 0.022)
# 6. A goal with no measure: knocks for the goal, the measured half and its measure, a soft press for its tick, a nylon note for
#    "measured"; a low note for the people who pay it; knocks for retail's decision and question, muffled keys for the homes and for
#    those falling behind; a low note for the empty slot; a knock for the register, muffled keys for its rings; paper for Farah's note,
#    a pencil for each year she has asked; a swell in E minor as a goal without a measure can't be steered
M_ = 'missing'
bed(M_, [AM9, DM9, FMAJ7, EM7])
knock(S0(M_) + 0.2, 0.02, 0.0)
lA = W(M_, 'afford', 'network charge', -0.2)
knock(lA + 0.3, 0.016, -0.6); knock(lA + 0.8, 0.016, -0.6); press(lA + 0.85, 0.016); nylon(64, lA + 1.2, 0.018, -0.6)
soft(45, W(M_, 'afford', 'but none'), 0.022, 0.2)
dc = W(M_, 'behind', 'Retail decides'); knock(dc, 0.016, 0.1); tap(dc + 0.5, 0.012, 0.1)
for k in range(4):
    tap(dc + 0.6 + k * 0.08, 0.008, 0.6 + k * 0.06)
qu = W(M_, 'behind', 'Its question'); knock(qu, 0.016, 0.1)
for k in range(5):
    tap(qu + 0.4 + k * 0.2, 0.008, 0.62 + 0.04 * k)
soft(40, qu + 0.9, 0.02, 0.1)
knock(W(M_, 'register', 'The hardship'), 0.018, 0.7)
help_ = W(M_, 'register', 'already getting')
for k in range(3):
    tap(help_ - 0.3 + k * 0.1, 0.011, 0.66 + 0.04 * k)
paper(W(M_, 'farah', 'asked for'), 0.03, -0.48, 0.5)
for k in range(3):
    pencil(W(M_, 'farah', 'for years', k * 0.25), 0.014, -0.6 + k * 0.1, 0.25)
swell([40, 47, 52, 55], W(M_, 'farah', 'A goal'), 3.0, 0.02)
# 7. What counts: knocks for the goal and its measure, and air as the measure moves up; a pencil as the timeline is drawn; a knock for
#    each report, and a nylon note for each span, the second lower than the first; a muffled key for each clock as it pulses; a
#    nylon note for "both are right", a low note for "neither"; paper for the definition, a pencil for each line of it, a nylon note as
#    the measure is drawn, and a soft press as each open question is answered; then a swell as everyone gets the same number, muffled
#    keys as the numbers roll to it, a nylon note for "in both", and a soft press for the reports' ticks
Q = 'count'
bed(Q, [CMAJ9, DM9], 0, cq(Q, 'clock'))
bed(Q, [EM7, AM9], cq(Q, 'clock'), cq(Q, 'define'))
bed(Q, [FMAJ9, GSUS4, CMAJ9], cq(Q, 'define'), None)
knock(S0(Q) + 0.6, 0.018, 0.0); knock(W(Q, 'two', 'new solar', -0.3), 0.016, 0.0)
air(W(Q, 'disagree', 'Two reports', -0.8), 1.0, 0.016, -0.3)
pencil(W(Q, 'disagree', 'Two reports', -0.2), 0.012, -0.2, 0.8)
r1, r2 = W(Q, 'disagree', 'thirty-four'), W(Q, 'disagree', 'twenty-one')
knock(r1 - 0.3, 0.02, 0.22); knock(r2 - 0.3, 0.02, 0.72)
nylon(69, r1 + 0.6, 0.018, 0.0); nylon(65, r2 + 0.6, 0.018, 0.15)
for k, pan in enumerate([-0.85, 0.85, -0.35, 0.7]):
    tap(W(Q, 'clock', 'start', k * 0.25), 0.012, pan)
nylon(64, W(Q, 'clock', 'Both are right'), 0.018, -0.27); soft(40, W(Q, 'clock', 'Neither'), 0.022, 0.31)
paper(C(Q, 'define'), 0.035, 0.0, 0.6)
for word in ['complete application', 'new meter', 'Monday', 'Grace writes']:
    pencil(W(Q, 'define', word), 0.014, 0.0, 0.4)
tFr = W(Q, 'define', 'complete application'); nylon(72, tFr + 0.8, 0.02, -0.1)
knock(C(Q, 'define', 0.3), 0.012, 0.75)
for word in ['complete application', 'Monday']:
    press(W(Q, 'define', word, 0.4), 0.016)
tSm = C(Q, 'same')
swell([36, 43, 48, 52], tSm, 3.0, 0.02)
for k in range(6):
    tap(tSm + 0.25 + k * 0.16, 0.008, 0.22 if k % 2 == 0 else 0.72)
nylon(67, tSm + 0.7, 0.016, -0.1); press(tSm + 1.2, 0.022)
# 8. A home and an owner: a knock for each capability; paper as each measure's note goes up, and a nylon note as it hangs under its
#    capability, rising; a knock for each owner; a low felt note for each as the number moves; a swell for what an owner does
O = 'home'
bed(O, [FMAJ9, CMAJ9, AM9, GSUS4])
for i in range(8):
    knock(S0(O) + 0.2 + i * 0.06, 0.012, -0.82 + i * 0.234)
tap(W(O, 'home', 'home on the map'), 0.01, 0.0)
for k, (word, m, pan) in enumerate([('Interruptions', 60, -0.61), ('Days to connect', 64, 0.0), ('Households', 67, 0.61)]):
    t0 = W(O, 'homes', word, -0.1); paper(t0, 0.028, pan, 0.45); nylon(m, t0 + 0.7, 0.018, pan)
for t0, pan in [(W(O, 'owner', 'Grace'), -0.61), (W(O, 'owner', 'Grace', 0.3), 0.0), (W(O, 'owner', 'head of retail'), 0.61)]:
    knock(t0, 0.016, pan)
acts = W(O, 'means', 'acts when')
for k, (m, pan) in enumerate(zip([48, 50, 55], [-0.61, 0.0, 0.61])):
    soft(m, acts + k * 0.3, 0.018, pan)
swell([36, 43, 50, 55], W(O, 'means', 'An owner'), 3.0, 0.018)
# 9. By capability, not by request: muffled keys as the twenty-one go up and turn into reports; a knock for the count; a low roll as the
#    wall is drawn, and a low note as it stands; air as the reports fly to their products; a knock and a nylon note for each product,
#    rising, the last on retail's side; knocks for the owners, muffled keys as the questions fan out, a low note for "its own side"
B_ = 'build'
bed(B_, [CMAJ9, FMAJ9, CMAJ9, GSUS4])
for k in range(5):
    tap(S0(B_) + 0.2 + k * 0.14, 0.008, -0.7 + k * 0.35)
tBe = W(B_, 'reports', 'could become')
for k in range(6):
    tap(tBe + k * 0.15, 0.01, -0.7 + k * 0.28)
knock(W(B_, 'reports', 'twenty-one reports'), 0.018, 0.0)
dom = W(B_, 'group', 'the domain'); rise(dom - 0.2, 1.2, 0.03); soft(41, dom + 0.8, 0.02, 0.0)
four = W(B_, 'group', 'four data products'); air(four - 0.4, 1.4, 0.03)
for i, (m, pan) in enumerate(zip([60, 64, 67, 72], [-0.55, -0.55, -0.55, 0.5])):
    t0 = four + 0.2 + i * 0.25; knock(t0, 0.016, pan); nylon(m, t0 + 0.05, 0.018, pan)
for i, pan in enumerate([-0.55, -0.55, -0.55, 0.5]):
    knock(W(B_, 'each', 'one owner', i * 0.12), 0.012, pan)
for k in range(6):
    tap(W(B_, 'each', 'many questions', k * 0.11), 0.008, -0.1 if k % 2 == 0 else 0.85)
soft(43, W(B_, 'each', 'own side'), 0.02, 0.0)
# 10. Back on the coast: the strings and the sea again, in A major now, through E with its fourth as the skippers learn what each
#     market will pay, and back to A as what changed is told. The celesta for each district the phones reach, rising, A, C sharp, E;
#     soft celesta notes, scattered, as boat after boat calls, and water along the hulls as they come in. A knock and a nylon note
#     for each step of the skipper's chain as it's traced up, rising, A, C sharp, E, to the goal an octave up; the celesta, rising, as
#     the light climbs from the measure to the goal, and a soft press for its tick; a swell as prices even out, and a knock and a
#     nylon note for each of the two outcomes after it
V = 'coast'
bed(V, [AMAJ9], 0, cq(V, 'knew'), g=0.026, tone='strings', bassg=0.016)
bed(V, [ESUS4], cq(V, 'knew'), cq(V, 'gain'), g=0.024, tone='strings', bassg=0.016)
bed(V, [AMAJ9], cq(V, 'gain'), None, g=0.026, tone='strings', bassg=0.016)
sea(S0(V) + 0.3, E(V) + 0.5, 0.03, seed=33)
for word, m, pan in [('phones spread', 69, 0.55), ('district by', 73, 0.3), ('district.', 76, 0.15)]:
    cel(m, W(V, 'spread', word), 0.014, pan)
tB = W(V, 'knew', 'boat after')
for k, m in enumerate([64, 69, 68, 73, 71, 76]):
    cel(m, tB - 0.4 + k * 0.33, 0.007, 0.15 + 0.08 * (k % 3))
wake(tB + 0.2, 5.0, 0.014, 0.35)
tGo = G(V, 'knew') + _DUR[V + '/knew'] + 0.3
for t0, m in [(W(V, 'knew', 'knew what', -0.3), 57), (W(V, 'knew', 'what each'), 61), (W(V, 'knew', 'before choosing', -0.1), 64), (tGo, 69)]:
    knock(t0, 0.014, -0.45); nylon(m, t0 + 0.05, 0.02, -0.45)
tWs = W(V, 'gain', 'The waste')
for k, m in enumerate([64, 69, 73]):
    cel(m, tWs - 0.85 + k * 0.35, 0.014, -0.45)
press(tWs + 0.1, 0.022); cel(76, tWs + 0.15, 0.016, -0.3)
swell([45, 52, 57, 61], W(V, 'gain', 'evened out', -0.3), 3.0, 0.018)
for word, m, pan in [('Crews earned', 69, -0.6), ('fish cost', 73, -0.25)]:
    t0 = W(V, 'gain', word); knock(t0, 0.012, pan); nylon(m, t0 + 0.05, 0.016, pan)
# 11. Questions that matter: paper as the notes come back; a soft press as Grace confirms each measure, paper for the draft; paper for
#     the answer, with the celesta, as Tomás's note gets one, and a pencil as it's written and as the dot on his question fills
#     halfway; paper for the next question; a swell as the three notes glow; the celesta once, under the end card, before the mark
Z = 'end'
bed(Z, [FMAJ9, CMAJ9, AM9, GSUS4], 0, cq(Z, 'breath'))
for d, pan in [(0.3, -0.55), (0.4, 0.62), (0.5, -0.55), (0.7, -0.55)]:
    paper(S0(Z) + d, 0.022, pan, 0.45)
press(W(Z, 'confirm', 'Grace', 0.3), 0.03); press(W(Z, 'confirm', 'definitions'), 0.026)
paper(W(Z, 'confirm', 'head of retail'), 0.022, -0.55, 0.4)
cA = C(Z, 'answer')
paper(cA, 0.035, 0.6, 0.5); cel(72, cA + 0.25, 0.014, 0.6)
pencil(cA + 0.2, 0.01, 0.6, 3.0); pencil(cA + 1.6, 0.014, 0.62, 0.4)
paper(W(Z, 'next', 'Next'), 0.03, 0.55, 0.5)
swell([36, 43, 48, 52], G(Z, 'breath', 0.2), 3.0, 0.02)
bed(Z, [CMAJ7], cq(Z, 'breath'), None, g=0.034, tone='strings', bassg=0.026)
cel(76, G(Z, 'breath', 0.6), 0.014, 0.3)
mark(G(Z, 'breath', 1.4), 48)
