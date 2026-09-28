# What's in a word: the music and sounds, played by tools/audio.py with the series' instruments (shared/tools/music.py).
# The film's palette is the oldest in the series: a kalimba, a breathy flute, a choir that sings "oo" and "ah", and a frame drum,
# in D, moving between Dorian (the past, the animals, the brain) and D major (the university, agreeing on paper).
# Graduation week opens on a celesta over a warm pad; the grassland has a hand-drum pulse; the rabbit hops on the marimba;
# the four offices' boundaries each ring one note of the series' motif; the clay tablet is pressed to the frame drum.

# chords (MIDI note numbers)
DMAJ9 = [50, 57, 61, 64, 66]; GMAJ7 = [43, 50, 54, 59, 62]; BM7 = [47, 54, 57, 62]; A6 = [45, 52, 57, 61, 66]
DM9 = [50, 53, 57, 60, 64]; G69 = [43, 50, 55, 59, 64]; AM7 = [45, 52, 55, 60]; CMAJ7 = [48, 55, 59, 64]; FMAJ7 = [41, 48, 52, 57]
EM7 = [40, 47, 50, 55, 59]; BM9 = [47, 54, 57, 61, 62]

# 1. Four answers: a bright, present-day opening; then the years roll back, and the title
prog('answers', [DMAJ9, GMAJ7], 0, cq('answers', 'back'), g=0.05, tone='warm')
motif('answers', [DMAJ9, GMAJ7], 0, cq('answers', 'back'), every=1.1, g=0.035, inst=celesta)
prog('answers', [BM7, DM9], cq('answers', 'back'), g=0.05, tone='choir-oo', bassg=0.03)
theme(G('answers', 'breath', 0.7), 62, kalimba, step=0.46, g=0.09)
flute(69, G('answers', 'breath', 2.3), 2.2, 0.035, 0.2)
# 2. Kinds without words: the kalimba, in Dorian, with the choir
prog('kinds', [DM9, G69, AM7, DM9], g=0.05, tone='choir-oo')
motif('kinds', [DM9, G69, AM7, DM9], every=1.25, g=0.04, inst=kalimba)
# 3. Calls that point: the grassland, with a hand-drum pulse that stops when the names begin
prog('calls', [DM9, CMAJ7, G69, DM9], g=0.045, tone='choir-ah', bassg=0.04)
pulse(S0('calls') + 0.5, G('calls', 'names', 0), 84, [(0, framedrum, 0.05, 0), (1.5, handdrum, 0.03, 0.3), (2, framedrum, 0.035, 0), (3, handdrum, 0.03, -0.3)])
motif('calls', [DM9, G69], cq('calls', 'names'), every=1.6, g=0.035, inst=kalimba)
flute(74, G('calls', 'ids', 0.5), 2.6, 0.03, -0.2); flute(69, G('calls', 'ids', 3.2), 2.8, 0.03, 0.2)
# 4. What words add: brighter, D major, a flute line over a harp
prog('words', [DMAJ9, A6, GMAJ7, DMAJ9], g=0.045, tone='warm')
motif('words', [DMAJ9, A6, GMAJ7, DMAJ9], every=1.4, g=0.04, inst=harp)
for i, (m, d) in enumerate([(74, 1.6), (76, 1.2), (78, 2.4), (76, 1.4), (73, 2.8)]):
    flute(m, G('words', 'combine', 0.4) + i * 1.7, d, 0.028, 0.15)
# 5. One idea, many forms: glassy and quiet, B minor, a celesta for each spark
prog('forms', [BM9, GMAJ7, EM7, BM9], g=0.05, tone='glass', bassg=0.03)
motif('forms', [BM9, GMAJ7], every=1.8, g=0.03, inst=celesta)
# 6. Which part do you mean? The rabbit hops on the marimba
prog('gavagai', [DMAJ9, GMAJ7, A6], g=0.04, tone='warm')
ostinato(S0('gavagai') + 0.6, G('gavagai', 'mean', 0), [62, 69, 66, 69, 62, 71, 66, 69], 0.3, marimba, 0.03, 0.2)
ostinato(G('gavagai', 'kids', 0), E('gavagai') - 0.5, [62, 66, 69, 74], 0.45, marimba, 0.025, -0.2)
# 7. Fuzzy edges: a wide choir; each office's boundary rings one note of the motif
prog('edges', [DMAJ9, BM7, GMAJ7, A6], g=0.05, tone='choir-ah')
motif('edges', [DMAJ9, BM7], 0, cq('edges', 'cred'), every=1.3, g=0.035, inst=kalimba)
for i, m in enumerate([62, 69, 71, 66]):
    tbell(m + 12, G('edges', 'cred', 6.5 + i * 0.9), 0.05, (i - 1.5) * 0.35, 3.5)
# 8. Words drift: older, a reed drone and a lute
prog('drift', [DM9, CMAJ7, FMAJ7, DM9], g=0.045, tone='reed', bassg=0.04, btone='organ')
motif('drift', [DM9, CMAJ7, FMAJ7, DM9], every=1.2, g=0.04, inst=lute)
# 9. Agreed on paper: resolved and warm, D major, a felt piano
prog('paper', [DMAJ9, GMAJ7, BM7, A6, DMAJ9], g=0.05, tone='warm')
motif('paper', [DMAJ9, GMAJ7, BM7, A6, DMAJ9], every=1.5, g=0.04, inst=felt)
# 10. Pull back: the choir swells, the clay is pressed to a frame drum, the motif returns on the kalimba and the flute
prog('end', [GMAJ7, A6], 0, cq('end', 'clay'), g=0.045, tone='warm')
prog('end', [DM9, BM9, GMAJ7, DMAJ9], cq('end', 'clay'), g=0.055, tone='choir-ah', bassg=0.04)
def flute_note(m, s, g, p):
    flute(m, s, 0.9, g * 0.8, p)
theme(G('end', 'breath', 0.6), 62, kalimba, step=0.5, g=0.09); theme(G('end', 'breath', 0.85), 74, flute_note, step=0.5, g=0.05)

# effects
# 1. the bubble, four cards, their numbers, one word; the years roll back; the title
ping(G('answers', 'q', 0.6)); [pop(G('answers', 'four', 0.3 + k * 0.25), 0.07, (k - 1.5) * 0.3) for k in range(4)]
[tick(G('answers', 'nums', d + 0.2), 0.1, (k - 1.5) * 0.3) for k, d in enumerate([0.2, 2.4, 4.6, 6.9])]
[chime(G('answers', 'none', 1.0 + k * 0.3), 0.05, 1318, (k - 1.5) * 0.3) for k in range(4)]; sweep(G('answers', 'none', 2.6), 1.0, 0.04, 600, 2200)
whoosh(G('answers', 'back', 0.5), 2.0, 0.08); [tick(G('answers', 'back', 0.6 + 3.4 * (1 - (1 - k / 10) ** 2)), 0.07) for k in range(10)]
shimmer(G('answers', 'breath', 0.5), 0.05, 1175)
# 2. pecks, cards, the bee; concepts and their words
[woodblock(G('kinds', 'pigeons', 1.5 + k * 1.1), 0.05, -0.4, 1400) for k in range(6)]
bee(G('kinds', 'bees', 0.4), 0.035, 0.4, 2.2); bee(G('kinds', 'bees', 3.8), 0.035, 0.5, 1.8); [ping(G('kinds', 'bees', d), 0.05, 0.4) for d in (2.3, 5.3)]
buzz(G('kinds', 'noword', 0.3), 0.04); [node(G('kinds', 'first', 0.4 + k * 0.3), 0.05, (k - 1) * 0.5) for k in range(3)]; [pop(G('kinds', 'first', 1.8 + k * 0.2), 0.06) for k in range(3)]
# 3. three alarm calls, the hunters, and three names
vervet(G('calls', 'leopard', 0.3), 0.07, -0.2, 'leopard'); rustle(G('calls', 'leopard', 1.2), 0.05, -0.5, 1.0)
vervet(G('calls', 'eagle', 0.3), 0.07, -0.2, 'eagle'); cry(G('calls', 'eagle', -0.4), 0.035, 0.5); rustle(G('calls', 'eagle', 1.6), 0.05, 0.2, 1.0)
vervet(G('calls', 'snake', 0.3), 0.06, -0.2, 'snake'); hiss(G('calls', 'snake', -0.2), 0.03, 0.5, 1.2)
whistle(G('calls', 'names', 1.8), 0.035, -0.5); rumble(G('calls', 'names', 2.6), 0.07, 0); trill(G('calls', 'names', 3.4), 0.035, 0.5, 3000, 0.5)
[node(G('calls', 'ids', 0.3 + k * 0.5), 0.05, (k - 0.5) * 0.6) for k in range(2)]
# 4. a robin, the words, a record, the fossils
chirp(G('words', 'point', 0.2), 0.045, 0.2); chirp(G('words', 'root', 0.3), 0.04, 0.3, 3600, 2); [pop(G('words', 'root', 0.8 + k * 0.5), 0.06) for k in range(3)]
[card(G('words', 'combine', 1.2 + k * 0.4), 0.04, (k % 3 - 1) * 0.4) for k in range(8)]; seal(G('words', 'know', 4.2), 0.1); thud(G('words', 'fossil', 0.2), 0.12)
# 5. three sparks in the brain; the triangle, and its gap
[spark(G('forms', 'cell', d), 0.06, -0.3 + k * 0.3) for k, d in enumerate([2.6, 4.2, 6.0])]; chime(G('forms', 'one', 0.2), 0.05, 1568)
[node(G('forms', 'tri', d), 0.05, p) for d, p in ((0.6, -0.5), (1.2, 0), (3.0, 0.5))]; tone(G('forms', 'gap', 1.6), 0.05, 330)
# 6. the rabbit, the word, three meanings, a check, the grain
[woodblock(G('gavagai', 'rabbit', -2 + k * 0.52), 0.025, -0.3 + k * 0.05, 420) for k in range(8)]; pop(G('gavagai', 'rabbit', 3.2), 0.1)
[ping(G('gavagai', 'mean', d), 0.05, 0.4) for d in (0.4, 1.6, 2.8)]; chime(G('gavagai', 'kids', 1.0), 0.05, 1318); bell(G('gavagai', 'grain', 1.8), 0.08, 587)
# 7. birds, credentials
[chirp(G('edges', 'robin', 0.4 + k * 0.5), 0.03, (k % 3 - 1) * 0.5, 2800 + k * 200, 2) for k in range(4)]; [pop(G('edges', 'cred', 0.4 + k * 0.35), 0.05, (k % 3 - 1) * 0.4) for k in range(6)]
# 8. a roll, a folding sheet, a sealed letter, time passing
page(G('drift', 'cred', 2.8), 0.05); page(G('drift', 'cred', 5.4), 0.05, 0.4); seal(G('drift', 'still', 1.8), 0.1); whoosh(G('drift', 'move', 0.4), 3.2, 0.05, 0.3)
# 9. the pencil, the boxes, the stamp, the count
[scratch(G('paper', 'def', 0.2 + k * 1.0), 0.04, -0.2, 0.9) for k in range(4)]; [scratch(G('paper', 'kinds', d), 0.035, 0.1, 0.7) for d in (0.2, 0.8, 1.8, 3.2, 5.2)]
scratch(G('paper', 'recipe', 0.4), 0.03, -0.3, 0.6); scratch(G('paper', 'recipe', 1.8), 0.03, 0.3, 0.6); stamp(G('paper', 'owner', 2.4), 0.12)
[tick(G('paper', 'answer', 1.0 + k * 0.1), 0.05) for k in range(8)]; chime(G('paper', 'answer', 2.0), 0.08, 1175); [pop(G('paper', 'answer', 4.0 + k * 0.5), 0.05) for k in range(4)]
# 10. a contract, a merger that stalls, funding; the clay, pressed; the end
page(G('end', 'why', 0.4), 0.05); glitch(G('end', 'why', 3.0), 0.04); [pop(G('end', 'why', 4.6 + k * 0.15), 0.05) for k in range(3)]
[stone(G('end', 'clay', 0.8 + k * 0.42), 0.06, (k % 5 - 2) * 0.15) for k in range(11)]; [framedrum(G('end', 'clay', 0.8 + k * 1.68), 0.04) for k in range(3)]
[node(G('end', 'last', 0.4 + k * 0.6), 0.05, (k - 1) * 0.5) for k in range(3)]; bell(G('end', 'breath', 0.6), 0.09, 587)
