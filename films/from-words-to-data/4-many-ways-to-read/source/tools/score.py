# Many ways to read: the music and sounds, played by tools/audio.py with the series' instruments (shared/tools/music.py).
# The film's palette is library jazz, in F major and D minor, at 84 beats a minute on a gentle swing: an electric piano comping
# on major-seventh and ninth chords, a walking plucked bass, brushes and a hi-hat chick on two and four. The card catalogue
# opens on the piano alone; the trio comes in with the argument. The data vault gets a low, organ-like pad; the stars get
# celesta sparkles. Effects: a drawer, cards flipping, a library date stamp, and the nodes, links and ticks of the diagrams.
# The groove keeps one beat grid for the whole film, so chapters join without a stumble.

BPM = 84; Q = 60 / BPM; BAR = 4 * Q; SW = 2 / 3   # a swung eighth falls two thirds of the way through the beat

# chords: the bass root, a rootless voicing for the electric piano, and a pad voicing
CH = {
    'F':   (41, [57, 60, 64, 67], [53, 57, 60, 64, 67]),   # Fmaj9
    'Dm':  (38, [53, 57, 60, 64], [50, 53, 57, 60, 64]),   # Dm9
    'Gm':  (43, [58, 62, 65, 69], [55, 58, 62, 65, 69]),   # Gm9
    'C':   (36, [52, 58, 62, 67], [48, 52, 55, 58, 62]),   # C9
    'Bb':  (46, [57, 62, 65, 69], [46, 50, 53, 57, 60]),   # Bbmaj9
    'Am':  (45, [55, 60, 64, 67], [45, 48, 52, 55, 60]),   # Am7
}
THIRD = {'F': 4, 'Dm': 3, 'Gm': 3, 'C': 4, 'Bb': 4, 'Am': 3}


# brushes, a snare slap and a hi-hat chick, on the music bus so they sit under the voice with the rest
def mbrush(s, g, pan=0.0, sec=0.6):
    x = tt(sec); put(filt(noise(sec), 'band', (1800, 7000)) * np.sin(np.pi * x / sec) ** 1.5, s, g, pan)


def mslap(s, g, pan=0.1):
    x = tt(0.14); put(filt(noise(0.14), 'band', (1200, 5200)) * np.exp(-x * 38), s, g, pan)


def mhat(s, g, pan=0.35):
    x = tt(0.06); put(filt(noise(0.06), 'high', 7000) * np.exp(-x * 80), s, g, pan)


def bars(s0, s1):
    """the bar lines of the film's one beat grid that fall between s0 and s1"""
    k = int(np.ceil(s0 / BAR - 1e-6)); out = []
    while k * BAR < s1 - 0.5:
        out.append(k * BAR); k += 1
    return out


def fade(t, s0, s1, f=2.0):
    return max(0.0, min(1.0, (t - s0) / f + 0.05, (s1 - t) / f))


def trio(s0, s1, chords, comp=0.05, walk=0.045, drums=0.016, busy=0):
    """the band over [s0, s1]: one chord a bar, cycling through chords"""
    bl = bars(s0, s1)
    for i, b in enumerate(bl):
        name = chords[i % len(chords)]; nxt = chords[(i + 1) % len(chords)]; root, vo, _ = CH[name]; f = fade(b, s0, s1)
        if comp:   # Charleston on odd bars, an anticipation on even ones, a little extra when busy
            hits = [0, 1 + SW] if i % 2 == 0 else [1, 2 + SW]
            if busy:
                hits = hits + [3 + SW]
            for h in hits:
                for j, m in enumerate(vo):
                    epiano(m, b + h * Q + j * 0.012, comp * f / len(vo) * (1.15 if h == 0 else 1), -0.25 + 0.15 * j, 1.4)
        if walk:   # root, third, fifth, and a chromatic step into the next root
            nr = CH[nxt][0]; line = [root, root + THIRD[name], root + 7, nr + (1 if (i % 2) else -1)]
            for j, m in enumerate(line):
                while m > 50:
                    m -= 12
                bass(m, b + j * Q, 0.62, walk * f * (1.1 if j == 0 else 1), -0.05)
        if drums:
            for j in range(4):
                mbrush(b + j * Q, drums * 0.55 * f, 0.15, Q * 0.95)
                if j % 2:
                    mslap(b + j * Q, drums * f, 0.1); mhat(b + j * Q, drums * 0.8 * f, 0.4)
                mhat(b + (j + SW) * Q, drums * 0.35 * f, -0.3)


def pads(s0, s1, chords, g=0.045, tone='warm', low=0):
    """a held pad under the band, one chord for every two bars; low shifts it an octave down (the vault's organ)"""
    bl = bars(s0, s1)[::2] or [s0]
    for i, b in enumerate(bl):
        ch = [m - 12 * low for m in CH[chords[i % len(chords)]][2]]
        pad(ch, b - 1.0, 2 * BAR + 2.5, g, tone)


def sparkle(s, root=77, g=0.035, pan=0.3):
    """celesta: a quick rising figure, for a star lighting up"""
    for k, iv in enumerate([0, 4, 7, 12]):
        celesta(root + iv, s + k * 0.09, g * (1 - 0.12 * k), pan - 0.2 + 0.13 * k)


# 1. One book, three cards: the piano alone in the reading room, then the bass; the present day brings the brushes; the title
S, E_ = S0('cards'), E('cards')
trio(S, G('cards', 'same', 0), ['F', 'Dm', 'Gm', 'C'], comp=0.045, walk=0, drums=0)
trio(G('cards', 'same', 0), G('cards', 'today', -0.3), ['F', 'Dm', 'Gm', 'C'], comp=0.045, walk=0.04, drums=0)
trio(G('cards', 'today', -0.3), E_ + 1.0, ['Bb', 'Am', 'Gm', 'C'], comp=0.04, walk=0.04, drums=0.012)
pads(S, E_, ['F', 'Dm'], g=0.04, tone='warm')
theme(G('cards', 'breath', 0.7), 65, epiano, step=0.46, g=0.09)
[celesta(m, G('cards', 'breath', 2.4) + k * 0.16, 0.03, 0.3) for k, m in enumerate([81, 84, 88])]
# 2. The argument: the whole trio, a little busier
trio(S0('argue'), E('argue') + 1.0, ['Dm', 'Gm', 'C', 'F'], comp=0.05, walk=0.048, drums=0.018, busy=1)
pads(S0('argue'), E('argue'), ['Dm', 'C'], g=0.035, tone='warm')
# 3. Integrate first: the core is still the trio; the vault brings a low organ pad and a slower, sparser band
trio(S0('integrate'), G('integrate', 'vault', 0.3), ['F', 'Dm', 'Gm', 'C'], comp=0.045, walk=0.045, drums=0.014)
trio(G('integrate', 'vault', 0.3), E('integrate') + 1.0, ['Dm', 'Bb', 'Gm', 'C'], comp=0.03, walk=0.04, drums=0.008)
pads(G('integrate', 'vault', -0.5), E('integrate'), ['Dm', 'Bb', 'Gm', 'C'], g=0.05, tone='organ', low=1)
# 4. Present for people: celesta sparkles over the trio, one for each star
trio(S0('present'), E('present') + 1.0, ['F', 'Am', 'Bb', 'C'], comp=0.045, walk=0.045, drums=0.016)
pads(S0('present'), E('present'), ['F', 'Bb'], g=0.035, tone='glass')
motif('present', [CH['F'][1], CH['Bb'][1]], every=1.5, g=0.028, inst=celesta)
# 5. Serve an entity: brighter, the hat a touch more present
trio(S0('serve'), E('serve') + 1.0, ['Bb', 'Am', 'Gm', 'C'], comp=0.045, walk=0.045, drums=0.018)
pads(S0('serve'), E('serve'), ['Bb', 'Gm'], g=0.035, tone='warm')
# 6. Where each lives: the whole platform, warm; the organ low under silver, celesta over gold; the band lifts in the breath
trio(S0('where'), E('where') + 1.0, ['F', 'Dm', 'Bb', 'C'], comp=0.045, walk=0.045, drums=0.016)
pads(S0('where'), E('where'), ['F', 'Bb'], g=0.045, tone='warm')
pads(G('where', 'silver', -0.5), G('where', 'gold', 1.0), ['Dm'], g=0.035, tone='organ', low=1)
# 7. Choosing: the trio, steady
trio(S0('choose'), E('choose') + 1.0, ['Dm', 'Gm', 'Bb', 'C'], comp=0.045, walk=0.045, drums=0.016)
pads(S0('choose'), E('choose'), ['Dm', 'Bb'], g=0.035, tone='warm')
# 8. Pull back: the band thins, the motif returns on the piano and the celesta, and it ends on F
trio(S0('end'), G('end', 'breath', 0.2), ['F', 'Dm', 'Gm', 'C'], comp=0.045, walk=0.045, drums=0.014)
pads(S0('end'), E('end') + 1.0, ['F', 'Bb', 'F'], g=0.045, tone='warm')
theme(G('end', 'breath', 0.6), 65, epiano, step=0.5, g=0.09); theme(G('end', 'breath', 0.85), 77, celesta, step=0.5, g=0.05)
bass(41, G('end', 'breath', 0.6), 2.5, 0.05, 0, False); [epiano(m, G('end', 'breath', 2.7), 0.02, -0.2 + 0.1 * j, 3.5) for j, m in enumerate(CH['F'][1])]

# effects
# 1. the cabinet's drawer, three cards, the shelf; arrows; the book moves and is re-stamped; two cards retyped; the wrong shelf
drawer(G('cards', 'catalogue', 2.6), 0.08, -0.5, 0.6)
[card(G('cards', 'catalogue', d), 0.06, -0.3 + k * 0.15) for k, d in enumerate([5.2, 6.0, 6.8])]
[link(G('cards', 'same', 1.2 + k * 0.3), 0.03, 0.3) for k in range(3)]; chime(G('cards', 'same', 0.2), 0.04, 1175, 0.4)
rustle(G('cards', 'step', 0.3), 0.04, 0.5, 1.2); stamp(G('cards', 'step', 1.4), 0.1, 0.5)
[card(G('cards', 'step', d), 0.05, -0.2) for d in (1.6, 2.0)]; [tick(G('cards', 'step', d + 0.45), 0.06, -0.2) for d in (1.6, 2.0)]
buzz(G('cards', 'step', 2.4), 0.03); thud(G('cards', 'step', 3.1), 0.06)
whoosh(G('cards', 'today', -0.1), 1.2, 0.06); [pop(G('cards', 'today', 2.0 + k * 0.3), 0.05, 0.2) for k in range(3)]
shimmer(G('cards', 'breath', 0.5), 0.05, 1397)
# 2. four shapes, four names, a new source, a job for each
[node(G('argue', 'four', d), 0.05, -0.6 + k * 0.4) for k, d in enumerate([5.1, 6.3, 7.2, 8.0])]
[pop(G('argue', 'names', d), 0.05, -0.6 + k * 0.4) for k, d in enumerate([1.5, 3.9, 2.9, 5.3])]
card(G('argue', 'new', 1.0), 0.06, 0.6); whoosh(G('argue', 'new', 1.0), 1.0, 0.05, 0.6); ping(G('argue', 'new', 2.6), 0.06, 0.5)
[link(G('argue', 'new', 3.0 + k * 0.15), 0.025, -0.6 + k * 0.4) for k in range(4)]; chime(G('argue', 'job', 1.2), 0.05, 1397)
# 3. sources; one meaning; the core's tables; hubs, a link, satellites; a new source; ticks; the audit; a wandering query
[link(G('integrate', 'many', 1.1 + k * 0.2), 0.03, -0.6) for k in range(3)]; node(G('integrate', 'many', 2.2), 0.05)
[node(G('integrate', 'core', 0.6 + k * 0.2), 0.03, -0.5 + k * 0.14, 1318) for k in range(8)]
node(G('integrate', 'vault', 1.8), 0.06, -0.4, 988); node(G('integrate', 'vault', 2.2), 0.06, 0.4, 988); link(G('integrate', 'vault', 6.6), 0.05)
[card(G('integrate', 'sat', d), 0.05, p) for d, p in ((0.1, -0.4), (0.5, 0.4), (0.9, 0), (2.1, -0.4))]
[tick(G('integrate', 'sat', d), 0.05, 0.2) for d in (3.7, 4.5)]
card(G('integrate', 'new', 0.0), 0.05, -0.7); link(G('integrate', 'new', 0.6), 0.04, -0.4); [pop(G('integrate', 'new', d), 0.06, p) for d, p in ((1.0, -0.3), (1.35, 0.4))]
[tick(G('integrate', 'new', 2.4 + k * 0.12), 0.05, -0.5 + k * 0.14) for k in range(8)]
ping(G('integrate', 'audit', 1.4), 0.05, -0.3); [woodblock(G('integrate', 'audit', 2.4 + k * 0.13), 0.02, -0.3 + k * 0.06, 700 + 40 * k) for k in range(10)]
# 4. three stars, sparkling; the copies of learner and date merge; a question crosses; conformed; the bus matrix fills
[sparkle(G("present", "star", d), 77 + k * 2, 0.035, -0.5 + k * 0.5) for k, d in enumerate([0.9, 2.7, 3.7])]
[link(G('present', 'share', d), 0.035, p) for d, p in ((0.4, -0.3), (1.6, 0.3))]; chime(G('present', 'share', 4.3), 0.05, 1568, 0)
[tick(G('present', 'conformed', 2.8 + k * 0.3), 0.05, -0.4 + k * 0.4) for k in range(3)]; node(G('present', 'conformed', 1.5), 0.05)
whoosh(G('present', 'bus', 0.2), 1.0, 0.04)
[tick(G('present', 'bus', 5.6 + i * 0.25 + j * 0.08), 0.03, -0.5 + j * 0.2) for i, row in enumerate([[1, 1, 1, 1, 1, 0], [1, 1, 1, 0, 1, 0], [1, 1, 1, 0, 1, 1], [1, 1, 1, 0, 1, 0]]) for j, v in enumerate(row) if v]
# 5. a learner; the row fills, column by column; a lookup; Genie asks; one filter; the columns multiply; a measure defined twice
pop(G('serve', 'one', 0.3), 0.05); [key(G('serve', 'row', d), 0.05, -0.4 + k * 0.2) for k, d in enumerate([0.4, 2.0, 3.2, 4.3, 5.2])]
[pop(G('serve', 'row', 5.9 + k * 0.3), 0.04, 0.3) for k in range(3)]; [node(G('serve', 'easy', d), 0.04, p) for d, p in ((0.6, -0.3), (1.4, 0.1), (2.6, 0.5))]
ping(G('serve', 'easy', 4.6), 0.05); ping(G('serve', 'genie', 0.2), 0.06, -0.5); sweep(G('serve', 'genie', 3.2), 0.6, 0.04, 2400, 700)
chime(G('serve', 'genie', 4.4), 0.06, 1568, 0.4); [tick(G('serve', 'cost', 1.0 + k * 0.08), 0.025, 0.5) for k in range(12)]; glitch(G('serve', 'cost', 2.5), 0.04)
# 6. the vaults light in turn; the semantic layer; the tools ask it
[node(G('where', 'place', d), 0.05, p, 1175) for d, p in ((0.5, -0.6), (0.9, 0), (1.3, 0.6))]
[card(G('where', 'silver', d), 0.04, -0.1) for d in (1.2, 2.2)]; [sparkle(G('where', 'gold', d), 79, 0.03, 0.5) for d in (0.6, 1.9)]
shimmer(G('where', 'sem', 0.3), 0.05, 1760); [ping(G('where', 'sem', 2.1 + k * 0.2), 0.04, 0.3 + k * 0.2) for k in range(3)]
# 7. three decisions; the library's cards return; one flickers out of step; per question, not per fashion
[card(G('choose', c, d), 0.05, p) for c, d, p in (('vault', 0.2, -0.6), ('star', 0.1, 0), ('wide', 0.1, 0.6))]
[chime(G('choose', c, d), 0.045, f, p) for c, d, f, p in (('vault', 4.4, 1175, -0.6), ('star', 2.5, 1397, 0), ('wide', 3.6, 1568, 0.6))]
[card(G('choose', 'copies', 1.9 + k * 0.3), 0.05, -0.5 + k * 0.5) for k in range(3)]; buzz(G('choose', 'copies', 4.6), 0.025)
stamp(G('choose', 'fashion', 0.2), 0.09); chime(G('choose', 'fashion', 2.2), 0.05, 1760)
# 8. a new satellite, nothing changed; rows counted in; a column added; the app and the analysts at one database
link(G('end', 'arrived', 0.4), 0.04, -0.4); pop(G('end', 'arrived', 0.9), 0.06, -0.5); tick(G('end', 'arrived', 3.3), 0.07, -0.5)
[tick(G('end', 'grew', 0.6 + k * 0.08), 0.025) for k in range(12)]; pop(G('end', 'grew', 2.7), 0.06, 0.5)
[link(G('end', 'next', d), 0.04, p) for d, p in ((0.8, -0.4), (1.0, 0.4))]; tone(G('end', 'next', 1.8), 0.04, 587)
bell(G('end', 'breath', 0.6), 0.07, 698)

# the band sits about 2 dB higher than the pads alone would: lift the music bus (the voice ducking still applies)
ML *= 1.3; MR *= 1.3
