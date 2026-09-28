# Older than the systems: the music and sounds, played by tools/audio.py with the series' instruments (shared/tools/music.py).
# The palette goes from medieval to modern. The museum and the model underneath are in A, Aeolian and Dorian: organ and reed
# drones on open fifths, harp and lute plucks, and a tubular bell that tolls for the examinations and for each seal. From
# "Every system has a model inside" on, the systems of today bring glass pads and an electric piano, cleaner, in A minor,
# moving to C major as the model is written down and joined. The series' motif opens on the lute and closes on the bell and
# the electric piano, both in C, the relative major of A minor.

# chords (MIDI note numbers): open fifths for the past, sevenths and ninths for the present
A5 = [45, 52, 57, 64]; D5 = [50, 57, 62, 69]; G5 = [43, 50, 55, 62]; E5 = [40, 47, 52, 59]; C5 = [48, 55, 60, 67]; F5 = [41, 48, 53, 60]
ADOR = [45, 52, 57, 60, 66]; DMAJ = [50, 54, 57, 62]
AM7 = [45, 52, 55, 60, 64]; AM9 = [45, 52, 55, 59, 60, 64]; FMAJ7 = [41, 48, 52, 57, 60]; DM9 = [50, 53, 57, 60, 64]; EM7 = [40, 47, 50, 55, 59]
CMAJ7 = [48, 55, 59, 64]; CMAJ9 = [48, 55, 59, 62, 64]; FMAJ9 = [41, 48, 52, 55, 60]; G6 = [43, 50, 55, 59, 64]; GSUS = [43, 50, 55, 60, 62]


def lute_line(notes, s0, step, g=0.04, pan=0.0):
    for i, m in enumerate(notes):
        if m:
            lute(m, s0 + i * step, g * (0.85 + 0.3 * ((i * 7) % 5) / 4), pan + (i % 3 - 1) * 0.2)


# 1. Same idea, new materials: a museum at night. Reed and organ on open fifths, harp in A Dorian; the bell for the rank and the seal
prog('materials', [A5, D5, A5, G5, A5], 0, cq('materials', 'breath'), g=0.045, tone='reed', bassg=0.03, btone='organ')
motif('materials', [ADOR, DMAJ, ADOR, G5, ADOR], 0.8, cq('materials', 'seal') + 3.4, every=1.5, g=0.035, inst=harp)
ostinato(G('materials', 'seal', 3.6), G('materials', 'idea', 3.0), [57, 64, 69, 64, 60, 64, 66, 64], 0.36, lute, 0.022, 0.25)
pad(A5, G('materials', 'breath', -0.4), 5.0, 0.05, 'organ')
theme(G('materials', 'breath', 0.7), 72, lute, step=0.44, g=0.085)
harp(60, G('materials', 'breath', 2.4), 0.03, -0.3); harp(64, G('materials', 'breath', 2.6), 0.03, 0.3)
# 2. The model underneath: the same five parts, on the lute over organ; glass enters with today's standard
prog('model', [ADOR, DMAJ, A5, E5], 0, cq('model', 'standard') - 1.0, g=0.045, tone='organ', bassg=0.03, btone='reed')
motif('model', [ADOR, DMAJ, A5, E5], 0.6, cq('model', 'standard') - 1.2, every=1.25, g=0.035, inst=lute)
prog('model', [AM9, FMAJ7, AM9], cq('model', 'standard') - 1.0, g=0.045, tone='glass', bassg=0.03)
motif('model', [AM9, FMAJ7, AM9], cq('model', 'standard') + 0.5, every=1.6, g=0.03, inst=harp)
drone(45, G('model', 'outlast', 0), E('model') - S0('model') - cq('model', 'outlast') + 2, 0.02, 'organ')
# 3. Every system has a model inside: the present, cleaner; glass and electric piano in A minor
prog('inside', [AM7, FMAJ7, DM9, AM7], g=0.05, tone='glass', bassg=0.035)
motif('inside', [AM7, FMAJ7, DM9, AM7], every=1.35, g=0.038, inst=epiano)
# 4. Where meanings meet: tension on the ring, a cold drone at Mars, and the hub resolving
prog('meet', [AM7, EM7], 0, cq('meet', 'mars') - 0.5, g=0.045, tone='glass', bassg=0.035)
ostinato(S0('meet') + 1.4, G('meet', 'pairs', 6.4), [69, 76, 72, 76], 0.32, pluck, 0.02, 0.2)
pad([33, 40, 45, 52], G('meet', 'mars', -0.8), cq('meet', 'hub') - cq('meet', 'mars') + 0.8, 0.05, 'strings')
drone(40, G('meet', 'mars', 0), 9.0, 0.02, 'reed')
prog('meet', [FMAJ7, G6, CMAJ7], cq('meet', 'hub') - 0.4, g=0.05, tone='glass', bassg=0.035)
motif('meet', [FMAJ7, G6, CMAJ7], cq('meet', 'hub') + 0.4, every=1.3, g=0.036, inst=epiano)
# 5. One person, many records: C major arrives, one learner linked
prog('person', [CMAJ7, AM7, FMAJ7, G6], g=0.05, tone='glass', bassg=0.035)
motif('person', [CMAJ7, AM7, FMAJ7, G6], every=1.4, g=0.036, inst=epiano)
# 6. Precise, but not yet technical: the pencil, then the model, and a steady pulse under the yardstick
prog('logical', [CMAJ9, FMAJ9, AM7, GSUS, CMAJ7], g=0.05, tone='glass', bassg=0.035)
motif('logical', [CMAJ9, FMAJ9, AM7], 0.4, cq('logical', 'still'), every=1.5, g=0.034, inst=epiano)
ostinato(G('logical', 'still', 2.4), E('logical') - 0.6, [60, 67, 64, 67], 0.42, marimba, 0.022, -0.15)
# 7. Who owns what: calm, C major, a harp for the people, an electric piano for the systems
prog('owners', [CMAJ7, G6, AM7, FMAJ7], g=0.05, tone='glass', bassg=0.035)
motif('owners', [CMAJ7, G6, AM7, FMAJ7], every=1.5, g=0.034, inst=epiano)
motif('owners', [CMAJ7, G6], 0.6, cq('owners', 'arch') + 3.0, every=2.2, g=0.026, inst=harp)
# 8. Pull back: joined in C; the organ of the past returns under the glass of the present; the motif on bell and electric piano
prog('end', [FMAJ7, CMAJ7], 0, cq('end', 'outlive'), g=0.05, tone='glass', bassg=0.035)
motif('end', [FMAJ7, CMAJ7], 0.4, cq('end', 'outlive'), every=1.4, g=0.034, inst=epiano)
prog('end', [C5, F5, C5], cq('end', 'outlive') - 0.3, g=0.04, tone='organ', bassg=0.03, btone='reed')
prog('end', [CMAJ9, FMAJ9, CMAJ9], cq('end', 'outlive') - 0.3, g=0.035, tone='glass', bassg=0)
lute_line([60, 64, 67, 72, 67, 64], G('end', 'outlive', 2.6), 0.5, 0.022)
theme(G('end', 'breath', 0.6), 60, tbell, step=0.52, g=0.06)
theme(G('end', 'breath', 0.62), 72, epiano, step=0.52, g=0.045)

# effects
# 1. clay, iron, a scroll, a seal; the shelf, the materials, one idea; the title
clay(G('materials', 'clay', 0.3), 0.08, -0.2)
[stone(G('materials', 'clay', 4.4 + k * 0.46), 0.035, 0.3 + (k % 3) * 0.1) for k in range(10)]
key(G('materials', 'guild', 0.3), 0.06, 0.1); [pop(G('materials', 'guild', 5.2 + k * 0.3), 0.05, (k - 1) * 0.3) for k in range(3)]; stamp(G('materials', 'guild', 6.3), 0.09, 0.2)
page(G('materials', 'exams', 0.2), 0.05, 0.1); tbell(45, G('materials', 'exams', 4.5), 0.07, -0.1, 5.0)
page(G('materials', 'seal', 0.2), 0.045, 0.2); seal(G('materials', 'seal', 3.0), 0.11, 0.1); tbell(40, G('materials', 'seal', 3.1), 0.06, 0.1, 5.0)
whoosh(G('materials', 'seal', 3.4), 2.4, 0.06)
page(G('materials', 'seal', 4.2), 0.04, 0.2); rustle(G('materials', 'seal', 5.7), 0.04, 0.3, 0.5); node(G('materials', 'seal', 6.8), 0.045, 0.4); node(G('materials', 'seal', 8.3), 0.05, 0.5, 2093); key(G('materials', 'seal', 8.5), 0.05, 0.5)
[tick(G('materials', 'idea', 0.3 + k * 0.12), 0.04, -0.7 + k * 0.2) for k in range(8)]; sweep(G('materials', 'idea', 2.0), 1.3, 0.035, 300, 900, 0); shimmer(G('materials', 'idea', 2.8), 0.04, 880)
shimmer(G('materials', 'breath', 0.5), 0.04, 1320)
# 2. a lens, five parts lit, three checks, three states; the model forms, the standard's words, the materials crumble
whoosh(G('model', 'parts', 0.6), 3.0, 0.03, -0.3)
for cid, d in (('issuer', 0.3), ('holder', 0.3), ('holder', 1.5), ('evidence', 0.3), ('evidence', 4.1), ('verify', 0.3)):
    node(G('model', cid, d), 0.045, 0.0, 1318)
seal(G('model', 'verify', 1.8), 0.07, 0.1); scratch(G('model', 'verify', 2.6), 0.04, 0.3, 0.6); key(G('model', 'verify', 4.2), 0.06, 0.5); ping(G('model', 'verify', 4.6), 0.045, 0.5)
tone(G('model', 'verify', 5.4), 0.035, 330); glitch(G('model', 'verify', 6.3), 0.035, 0.3)
sweep(G('model', 'standard', -1.5), 1.8, 0.04, 400, 1600, 0); [link(G('model', 'standard', 0.2 + k * 0.25), 0.03, (k - 1.5) * 0.4) for k in range(4)]
[node(G('model', 'standard', d), 0.05, p) for d, p in ((4.2, -0.6), (4.8, -0.6), (5.4, 0.6), (6.1, 0.4), (6.8, 0.6))]
[stone(G('model', 'outlast', 1.0 + k * 0.18), 0.025, -0.6 + k * 0.17) for k in range(8)]; rustle(G('model', 'outlast', 1.2), 0.04, 0, 1.4); shimmer(G('model', 'outlast', 1.8), 0.045, 1047)
# 3. five systems, their models, the vendor's box; the vendors' words fill ours
[pop(G('inside', 'five', 0.5 + k * 0.3), 0.06, -0.8 + k * 0.4) for k in range(4)]
[node(G('inside', 'list', d), 0.045, -0.8 + k * 0.4) for k, d in enumerate((1.4, 3.4, 5.0, 6.6))]
whoosh(G('inside', 'bought', 0.0), 1.2, 0.06, 0.7); thud(G('inside', 'bought', 1.2), 0.08); drawer(G('inside', 'bought', 2.4), 0.05, 0.7, 0.6); node(G('inside', 'bought', 3.3), 0.05, 0.8); ping(G('inside', 'bought', 5.2), 0.045, 0.8)
[chime(G('inside', 'adopt', 0.3 + k * 0.3), 0.035, 1175, -0.8 + k * 0.4) for k in range(5)]
[pop(G('inside', 'vendors', 1.2 + k * 0.18), 0.045, -0.4 + k * 0.2) for k in range(5)]; tone(G('inside', 'vendors', 1.6), 0.04, 220)
# 4. ten links, three slips; the spacecraft lost; two units; the break; five spokes to one model
[link(G('meet', 'pairs', 0.6 + k * 0.32), 0.035, (k % 5 - 2) * 0.3) for k in range(10)]
[glitch(G('meet', 'pairs', 4.6 + k * 0.35), 0.03, (k - 1) * 0.5) for k in range(3)]
whoosh(G('meet', 'mars', 0.3), 2.6, 0.05, 0.4); glitch(G('meet', 'mars', 2.7), 0.06, 0.5); glitch(G('meet', 'mars', 2.95), 0.04, 0.5)
pop(G('meet', 'mars', 3.7), 0.05, -0.6); pop(G('meet', 'mars', 7.9), 0.05, -0.6)
chime(G('meet', 'both', 0.4), 0.04, 1318, -0.6); chime(G('meet', 'both', 0.9), 0.04, 1318, -0.6); glitch(G('meet', 'both', 1.9), 0.05, -0.5); buzz(G('meet', 'both', 2.0), 0.04)
shimmer(G('meet', 'hub', 0.8), 0.045, 1047); [link(G('meet', 'hub', 1.2 + k * 0.3), 0.04, (k - 2) * 0.4) for k in range(5)]; chime(G('meet', 'hub', 3.6), 0.05, 1568); bell(G('meet', 'hub', 5.8), 0.05, 523)
# 5. four IDs, five facts, one learner; one shared list
[pop(G('person', 'ids', d), 0.055, 0.0) for d in (3.1, 4.2, 5.2, 6.4)]
[link(G('person', 'facts', d - 0.2), 0.035, 0.6) for d in (0.5, 2.5, 3.9, 4.4, 4.9)]
[tick(G('person', 'master', 0.6 + k * 0.25), 0.05, 0.5) for k in range(5)]; sweep(G('person', 'master', 2.7), 0.9, 0.04, 600, 1500, -0.2); bell(G('person', 'master', 5.0), 0.05, 659)
ping(G('person', 'codes', 1.6), 0.04, -0.2); [node(G('person', 'codes', 3.4 + k * 0.3), 0.035, 0.3 + k * 0.1) for k in range(3)]; chime(G('person', 'codes', 6.5), 0.045, 1175, 0.3)
# 6. the pencil, the precise model, its rows, its relationships, its rule; the yardstick, fit and gap
scratch(G('logical', 'sketch', 0.2), 0.035, -0.3, 1.2); sweep(G('logical', 'sketch', 2.6), 1.1, 0.04, 500, 1800, 0)
[tick(G('logical', 'id', d), 0.045, 0.2) for d in (0.3, 1.9, 2.7, 3.2, 3.7)]; [tick(G('logical', 'attrs', d), 0.045, 0.3) for d in (2.8, 3.5, 4.5)]
[link(G('logical', 'card', d), 0.04, p) for d, p in ((2.2, -0.5), (3.0, -0.5), (3.6, 0.5), (5.0, 0.6))]
stamp(G('logical', 'rules', 0.3), 0.1, -0.5)
whoosh(G('logical', 'still', 2.6), 1.2, 0.04); [(node(G('logical', 'still', 3.8 + k * 0.2), 0.04, -0.7 + k * 0.2) if k < 5 else tone(G('logical', 'still', 3.8 + k * 0.2), 0.03, 247)) for k in range(8)]
[pop(G('logical', 'still', d), 0.05, p) for d, p in ((5.9, -0.4), (7.2, 0), (8.5, 0.4))]
# 7. owners appear; a change travels down, news travels up; the glossary's new version
[pop(G('owners', cid, d), 0.05, p) for cid, d, p in (('words', 1.9, -0.4), ('words', 4.3, 0.2), ('arch', 0.3, -0.4), ('arch', 3.4, -0.4))]
sweep(G('owners', 'down', 0.3), 3.2, 0.035, 1400, 500, 0.6); sweep(G('owners', 'down', 3.8), 2.6, 0.035, 500, 1400, 0.8); ping(G('owners', 'down', 6.0), 0.04, 0.8)
stamp(G('owners', 'stewards', 2.2), 0.09, 0.5)
# 8. mapped, not renamed; systems come and go; the model holds; the end
[link(G('end', 'joined', d), 0.045, 0) for d in (0.8, 2.8)]; chime(G('end', 'joined', 4.6), 0.05, 1047)
[pop(G('end', 'outlive', 0.3 + k * 0.55), 0.045, 0.1 + k * 0.15) for k in range(5)]
shimmer(G('end', 'last', 0.2), 0.04, 1047); [tick(G('end', 'last', 2.0 + k * 0.2), 0.035, 0.2 + k * 0.1) for k in range(5)]
tbell(45, G('end', 'breath', 0.3), 0.05, 0, 6.0)
