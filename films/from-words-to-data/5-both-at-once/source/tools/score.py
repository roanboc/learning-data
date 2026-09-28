# Both at once: the music and sounds, played by tools/audio.py with the series' instruments (shared/tools/music.py).
# The film's palette is electronic: synth-pluck arpeggios in sixteenths at about 100 bpm, over a soft kick and hi-hat, in E minor,
# moving to E major at the end. The two engines get two interlocking arpeggios, three against two, one on each side of the stereo field.
# The 1879 till is the odd one out: a felt-piano oom-pah in C, ragtime-flavoured, with the cash register's keys, bell and drawer.
# The title and the end card play the series' four-note motif on the pluck; at the end, a felt piano answers it, an echo of the till.
import json, pathlib

_V = json.loads((lambda s: s[s.index('{'):s.rindex('}') + 1])(pathlib.Path('src/vodur.js').read_text()))


def A(sid, cid, f=0.0, off=0.0):
    """a moment inside a narration line: f = 0 at its first word, 1 at its last (as bo_at in scenes.js)"""
    return G(sid, cid, f * _V[sid + '/' + cid] + off)


BEAT = 0.6  # 100 bpm
k_ = lambda s, g, p: kick(s, g)
h_ = lambda s, g, p: hat(s, g, p)
b_ = lambda s, g, p: brush(s, g, p, 0.12)


def arp(s0, s1, chords, pat, step=0.15, g=0.03, pan=0.0, up=12, inst=pluck, fade=1.5, bright=1.0):
    """a pluck arpeggio through the chords, spread evenly over the span; pat indexes each chord's notes (past the top, an octave up)"""
    d = (s1 - s0) / len(chords); t = s0; k = 0
    while t < s1:
        ch = chords[min(len(chords) - 1, int((t - s0) / d))]; i = pat[k % len(pat)]; m = ch[i % len(ch)] + up + 12 * (i // len(ch))
        f = min(1, (t - s0) / fade + 0.05, (s1 - t) / fade)
        if inst is pluck:
            pluck(m, t, g * f, pan, 0.8, bright)
        else:
            inst(m, t, g * f, pan)
        t += step; k += 1


# chords (MIDI note numbers): E minor for the present, E major for the end, C for 1879
EM9 = [40, 47, 50, 54, 55]; CMAJ7 = [36, 43, 47, 52, 55]; AM9 = [45, 48, 52, 55, 59]; BM7 = [47, 50, 54, 57]; GMAJ7 = [43, 47, 50, 54]; D6 = [38, 45, 50, 54, 59]
EMAJ9 = [40, 47, 51, 54, 56]; AMAJ9 = [45, 49, 52, 56, 59]; CSM7 = [49, 52, 56, 59]; B6 = [47, 51, 54, 56]

# 1. The till: a ragtime oom-pah in C on the felt piano, from the first frame to the title
RAG = {'C': ([36, 43], [52, 55, 60]), 'G7': ([31, 38], [53, 55, 59]), 'F': ([41, 36], [53, 57, 60])}
BARS = ['C', 'C', 'G7', 'C', 'F', 'C', 'G7', 'C']
MEL = [[(0, 72), (0.5, 76), (1.5, 79), (2, 76), (3, 72), (3.5, 74)], [(0, 76), (0.5, 79), (1.5, 84), (2.5, 81), (3, 79)],
       [(0, 77), (0.5, 74), (1.5, 71), (2, 74), (3, 77), (3.5, 79)], [(0, 76), (1, 72), (2, 67), (3, 72)],
       [(0, 77), (0.5, 81), (1.5, 84), (2, 81), (3, 77), (3.5, 76)], [(0, 76), (0.5, 79), (1.5, 76), (2, 72), (3, 76)],
       [(0, 74), (0.5, 77), (1.5, 79), (2, 77), (3, 74), (3.5, 71)], [(0, 72), (1.5, 76), (2, 79), (3, 84)]]
RB = 60 / 104; bar0 = S0('till') + 0.5; tB = G('till', 'breath', 0); n = 0
while bar0 + n * 4 * RB < tB - 4 * RB + 0.3:
    s = bar0 + n * 4 * RB; ch = BARS[n % 8]; bs, cd = RAG[ch]
    for beat in range(4):
        if beat % 2 == 0:
            felt(bs[beat // 2] - (0 if ch != 'G7' else 0), s + beat * RB, 0.045, -0.2)
        else:
            [felt(m, s + beat * RB + 0.01 * j, 0.026, 0.1) for j, m in enumerate(cd)]
    for b, m in MEL[n % 8]:
        felt(m, s + b * RB + (0.03 if b % 1 else 0), 0.042, 0.25)
    n += 1
end_ = bar0 + n * 4 * RB
felt(36, end_, 0.05, -0.2); [felt(m, end_ + 0.02 * j, 0.035, 0.1) for j, m in enumerate([48, 52, 55, 60, 64, 72])]
# the title: out of 1879, into the present; the motif on the pluck, over a glassy E minor
pad(EM9, tB - 0.2, E('till') - tB + 3.5, 0.045, 'glass'); drone(28, tB, E('till') - tB + 3.0, 0.03)
theme(G('till', 'breath', 0.75), 64, pluck, step=0.3, g=0.075)
# 2. The distance: glass pads, a sparse pluck in eighths, a soft pulse from the moment the app writes
DIST = [EM9, CMAJ7, AM9, BM7]
prog('distance', DIST, g=0.045, tone='glass')
arp(S0('distance') + 0.6, E('distance') - 0.3, DIST, [0, 2, 4, 3, 2, 1], step=0.3, g=0.03, pan=-0.2, up=24)
pulse(G('distance', 'path', 0), E('distance') + 1.0, 100, [(0, k_, 0.03, 0), (1, h_, 0.012, 0.25), (2, k_, 0.022, 0), (3, h_, 0.012, -0.25)])
# 3. Two engines: two arpeggios, three against two, one for each store (rows on the left, columns on the right)
ENG = [EM9, GMAJ7, CMAJ7, D6]
prog('engines', ENG, g=0.045, tone='glass')
arp(S0('engines') + 0.3, E('engines'), ENG, [0, 2, 4], step=BEAT / 3, g=0.03, pan=-0.55, up=24)
arp(A('engines', 'two', 0.1), E('engines'), ENG, [1, 3], step=BEAT / 2, g=0.03, pan=0.55, up=24, bright=1.4)
pulse(S0('engines'), E('engines') + 0.8, 100, [(0, k_, 0.034, 0), (0.5, h_, 0.012, 0.25), (1, b_, 0.018, -0.1), (1.5, h_, 0.012, 0.25), (2, k_, 0.028, 0), (2.5, h_, 0.012, 0.25), (3, b_, 0.018, -0.1), (3.5, h_, 0.012, 0.25)])
# 4. In step: a driving line of sixteenths; it drops out when the award comes back to life, and returns in the right order
SYN = [EM9, CMAJ7, AM9, BM7]
prog('sync', SYN, g=0.045, tone='glass')
arp(S0('sync') + 0.3, A('sync', 'order', 0.3), SYN, [0, 2, 3, 4, 3, 2, 1, 2], step=0.15, g=0.027, pan=0.1, up=24, fade=1.0)
arp(A('sync', 'order', 0.62), E('sync'), [EM9, GMAJ7], [0, 2, 3, 4, 3, 2, 1, 2], step=0.15, g=0.027, pan=0.1, up=24, fade=1.0)
pulse(S0('sync'), A('sync', 'order', 0.3), 100, [(0, k_, 0.034, 0), (0.5, h_, 0.01, 0.2), (1, h_, 0.012, -0.2), (1.5, h_, 0.01, 0.2), (2.5, k_, 0.026, 0), (3, h_, 0.012, -0.2), (3.5, h_, 0.01, 0.2)], fade=1.5)
pulse(A('sync', 'order', 0.62), E('sync') + 0.8, 100, [(0, k_, 0.03, 0), (1, h_, 0.012, 0.2), (2, k_, 0.024, 0), (3, h_, 0.012, -0.2)], fade=1.5)
# 5. What it removes: the texture thins as each thing goes; the two ends meet on a warm chord
prog('removes', [CMAJ7, GMAJ7], g=0.045, tone='warm')
arp(S0('removes') + 0.2, E('removes') - 0.2, [CMAJ7, GMAJ7], [0, 2, 4, 2], step=0.3, g=0.028, pan=-0.1, up=24)
# 6. What it doesn't: darker, the pulse stops at the wrong count; the lesson on a held chord
DOE = [AM9, EM9, CMAJ7, BM7]
prog('doesnt', DOE, g=0.045, tone='strings', bassg=0.03)
arp(S0('doesnt') + 0.3, A('doesnt', 'revoked', 0.74), [AM9, EM9], [0, 2, 3, 2], step=0.3, g=0.028, pan=0.2, up=24)
pulse(S0('doesnt'), A('doesnt', 'revoked', 0.74, 1.0), 100, [(0, k_, 0.028, 0), (2, k_, 0.02, 0), (1, h_, 0.01, 0.2), (3, h_, 0.01, -0.2)], fade=1.0)
arp(A('doesnt', 'same', 0.0), E('doesnt'), [CMAJ7, BM7, EM9], [0, 2, 4, 3], step=0.3, g=0.026, pan=-0.2, up=24)
# 7. Data flowing back: brighter, higher plucks, the pulse back
BAK = [GMAJ7, D6, EM9, CMAJ7]
prog('back', BAK, g=0.045, tone='glass')
arp(S0('back') + 0.3, E('back'), BAK, [0, 1, 2, 3, 4, 3, 2, 1], step=0.15, g=0.026, pan=0.35, up=24, bright=1.6)
pulse(S0('back'), E('back') + 0.8, 100, [(0, k_, 0.03, 0), (0.5, h_, 0.011, 0.25), (1.5, h_, 0.011, -0.25), (2, k_, 0.024, 0), (2.5, h_, 0.011, 0.25), (3, b_, 0.016, 0), (3.5, h_, 0.011, -0.25)])
# 8. New questions: one chord per question, a steady pluck
QUE = [EM9, CMAJ7, GMAJ7, D6, BM7]
prog('questions', QUE, g=0.045, tone='glass')
arp(S0('questions') + 0.3, E('questions'), QUE, [0, 2, 4, 2, 3, 2, 1, 2], step=0.15, g=0.026, pan=-0.2, up=24)
pulse(S0('questions'), E('questions') + 1.5, 100, [(0, k_, 0.028, 0), (1, h_, 0.011, 0.2), (2, k_, 0.02, 0), (3, h_, 0.011, -0.2)], fade=2.0)
# 9. Pull back: E major, warm, the pluck slowing; the motif at the end card, answered by the felt piano from 1879
FIN = [EMAJ9, AMAJ9, CSM7, B6, EMAJ9]
prog('end', FIN, g=0.05, tone='warm')
arp(S0('end') + 0.3, G('end', 'breath', 0.4), FIN, [0, 2, 3, 4, 3, 2], step=0.3, g=0.03, pan=0.1, up=24)
theme(G('end', 'breath', 0.6), 64, pluck, step=0.34, g=0.075); theme(G('end', 'breath', 0.9), 76, felt, step=0.34, g=0.045)

# effects
# 1. the register: the first sale, the sales one by one, the evening going by, closing time; recording, counting, one place; the title
register(A('till', 'ritty', 0.8, -0.12), 0.08, 0.25)
[register(A('till', 'total', f, -0.12), 0.07, 0.25) for f in (0.22, 0.33, 0.44, 0.55)]
[key(A('till', 'total', 0.62) + k * 0.12, 0.035, 0.25) for k in range(11)]; ding(A('till', 'total', 0.8, 0.1), 0.09, 0.25, 1568); drawer(A('till', 'total', 0.8, 0.5), 0.05, 0.25)
node(A('till', 'wish', 0.0, 0.3), 0.05, -0.4); node(A('till', 'wish', 0.22, 0.3), 0.05, 0.4, 1760); chime(A('till', 'wish', 0.34, 0.3), 0.05, 1175)
whoosh(G('till', 'breath', 0.0), 1.4, 0.05); shimmer(G('till', 'breath', 0.5), 0.04, 1319)
# 2. the app writes, the copy goes overnight, gold lights, the sun; two people waiting; the distance
[key(G('distance', 'path', 0.3 + k * 0.45), 0.03, -0.6) for k in range(5)]; whoosh(A('distance', 'path', 0.36), 2.2, 0.05, -0.2)
[node(A('distance', 'path', f), 0.045, -0.1 + i * 0.2, [1319, 1568, 1976][i]) for i, f in enumerate((0.5, 0.62, 0.74))]; shimmer(A('distance', 'path', 0.86), 0.04, 1976)
pop(A('distance', 'now', 0.18), 0.07, -0.4); pop(A('distance', 'now', 0.44), 0.07, 0.3); [clock(A('distance', 'now', 0.2) + k * 0.6, 0.018, 0.3 * (-1) ** k) for k in range(12)]
sweep(G('distance', 'appeal', 0.2), 1.2, 0.04, 400, 1600)
# 3. one database; two stores; kept in step; synced both ways; the name
node(G('engines', 'one', -0.2), 0.05); pop(A('engines', 'two', 0.34), 0.06, -0.5); pop(A('engines', 'two', 0.52), 0.06, 0.5)
[link(A('engines', 'two', 0.62) + k * 0.23, 0.035, 0) for k in range(3)]; whoosh(G('engines', 'lake', -0.6), 1.2, 0.04)
link(A('engines', 'lake', 0.7), 0.04, 0.3); link(A('engines', 'lake', 0.74), 0.035, -0.3); chime(A('engines', 'htap', 0.3), 0.06, 1319); shimmer(A('engines', 'htap', 0.45), 0.035, 1976)
# 4. each change captured and applied; the keys; an update and a delete find their rows; the wrong order, the right order
for i, (cf, af) in enumerate(((0.26, 0.44), (0.36, 0.56), (0.46, 0.68))):
    key(A('sync', 'capture', cf), 0.045, -0.6); link(A('sync', 'capture', cf, 0.25), 0.03, -0.2); link(A('sync', 'capture', af), 0.035, 0.5)
[node(A('sync', 'capture', 0.8) + i * 0.35, 0.04, (i - 1) * 0.4, 1568 + i * 200) for i in range(3)]
[key(A('sync', 'keys', 0.24) + k * 0.09, 0.03, (k - 2) * 0.3) for k in range(5)]; node(A('sync', 'keys', 0.4, 0.3), 0.05, 0.2, 1760)
thud(A('sync', 'keys', 0.62), 0.05); link(A('sync', 'keys', 0.78), 0.035, 0.5)
pop(A('sync', 'order', 0.1), 0.06, -0.5); pop(A('sync', 'order', 0.26), 0.06, -0.5); glitch(A('sync', 'order', 0.42), 0.06, -0.3); glitch(A('sync', 'order', 0.42, 0.35), 0.045, -0.3)
pop(A('sync', 'order', 0.66), 0.06, 0.5); pop(A('sync', 'order', 0.76), 0.06, 0.5); chime(A('sync', 'order', 0.86), 0.07, 1319, 0.4); shimmer(G('sync', 'breath', 0.2), 0.035, 1760)
# 5. four things go; the two ends meet; real gains
for f in (0.1, 0.28, 0.5, 0.62):
    pop(A('removes', 'gone', f), 0.06); whoosh(A('removes', 'gone', f, 0.9), 0.5, 0.03)
sweep(A('removes', 'gone', 1.0, 0.5), 1.3, 0.04, 600, 1400); chime(G('removes', 'real', 0.2), 0.07, 1568); bell(G('removes', 'real', 0.3), 0.05, 784)
# 6. the count, straight from the app: wrong; the right count; today and census date; what still needs modelling; the lesson
tick(A('doesnt', 'direct', 0.4), 0.05); [tick(A('doesnt', 'revoked', 0.74) + k * 0.1, 0.04) for k in range(9)]
glitch(A('doesnt', 'revoked', 0.74, 1.0), 0.07); glitch(A('doesnt', 'revoked', 0.74, 1.25), 0.05); chime(A('doesnt', 'revoked', 0.74, 1.8), 0.06, 1175)
page(A('doesnt', 'same', 0.1), 0.04, 0.3); tone(A('doesnt', 'same', 0.4), 0.03, 330); tone(A('doesnt', 'same', 0.8), 0.03, 494)
[node(G('doesnt', 'model', d), 0.045, -0.4, 1319 + 180 * i) for i, d in enumerate((0.1, 0.7, 1.9))]; bell(A('doesnt', 'model', 0.48, 0.4), 0.07, 659)
# 7. flowing back; a suggestion; a flag; features calculated and served; an agent reads and writes
link(G('back', 'serve', 0.3), 0.035, 0.4); link(G('back', 'serve', 1.8), 0.03, 0.2); ping(A('back', 'serve', 0.56), 0.06, -0.4); node(A('back', 'serve', 0.78), 0.05, 0, 1760)
[pop(G('back', 'features', 0.2 + i * 0.3), 0.05, 0.6) for i in range(3)]; spark(A('back', 'features', 0.62), 0.05, 0.6)
[whoosh(A('back', 'features', 0.72) + i * 0.12, 0.4, 0.035, 0.2 - i * 0.3) for i in range(3)]; ding(A('back', 'features', 0.72, 0.6), 0.06, -0.4, 2637)
shimmer(G('back', 'agents', 0.2), 0.04, 1568); link(A('back', 'agents', 0.42), 0.04, 0.4); key(A('back', 'agents', 0.66), 0.045, -0.4); key(A('back', 'agents', 0.66, 0.1), 0.035, -0.4)
# 8. five questions, a slider, a wallet and a plan, one definition, a contract both ways
[card(t_, 0.05, -0.5) for t_ in (A('questions', 'truth', 0.36, -0.2), G('questions', 'sync', -0.2), G('questions', 'fresh', -0.2), G('questions', 'defs', -0.2), G('questions', 'contract', -0.2))]
[pop(A('questions', 'truth', f), 0.05, 0.3) for f in (0.5, 0.66, 0.82)]; link(G('questions', 'sync', 0.3), 0.035, 0.3); link(G('questions', 'sync', 1.2), 0.035, 0.3)
sweep(G('questions', 'fresh', 0.0), 1.4, 0.035, 500, 1500); pop(A('questions', 'fresh', 0.42), 0.06, 0.1); pop(A('questions', 'fresh', 0.72), 0.06, 0.6)
node(A('questions', 'defs', 0.3), 0.045, 0.3); thud(A('questions', 'defs', 0.78, 0.3), 0.04); chime(A('questions', 'defs', 0.78, 0.6), 0.05, 1568)
page(G('questions', 'contract', 0.1), 0.045, 0.3); link(A('questions', 'contract', 0.7), 0.04, 0.4); link(A('questions', 'contract', 0.7, 0.3), 0.04, -0.4)
# 9. the model, the two shapes, the platform, the lesson, next; the end card
[node(G('end', 'one', 0.4 + i * 0.25), 0.045, (i - 1) * 0.5, 1319 + 220 * i) for i in range(3)]; pop(A('end', 'one', 0.3), 0.05, -0.3); pop(A('end', 'one', 0.3, 0.2), 0.05, 0.3)
sweep(A('end', 'one', 0.55), 1.0, 0.035, 500, 1300); chime(G('end', 'tag', 0.2), 0.06, 1319); shimmer(G('end', 'next', 0.3), 0.035, 1760); bell(G('end', 'breath', 0.6), 0.08, 659)
