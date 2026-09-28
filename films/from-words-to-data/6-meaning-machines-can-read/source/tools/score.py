# Meaning machines can read: the music and sounds, played by tools/audio.py with the series' instruments (shared/tools/music.py).
# The film's palette is crystalline: FM bells, glass pads and a celesta in C Lydian (C major with an F sharp, bright and a little
# unresolved), airy and slow. The history (Linnaeus, Wilkins, Nightingale) is played on a harp over strings; Genie is a pluck
# over glass; the semantic layer has a soft, steady pulse; the four floors each ring one bell, rising. The series' motif opens
# the title on FM bells and closes the film on bells and celesta.

# an FM bell for the music bus: a bright, inharmonic strike that softens as it rings
def fmbell(m, start, g=0.05, pan=0.0, sec=3.2):
    f = mf(m); x = tt(sec); idx = 2.4 * np.exp(-x * 2.2) + 0.25
    s = np.sin(2 * np.pi * f * x + idx * np.sin(2 * np.pi * f * 3.5 * x)) * np.exp(-x * 1.25) + 0.25 * np.sin(2 * np.pi * f * 2 * x) * np.exp(-x * 2.5)
    put(norm((s * np.minimum(1, x / 0.003)).astype(np.float32)), start, g, pan)

def softpluck(m, start, g=0.035, pan=0.0):
    pluck(m, start, g, pan, sec=1.1, bright=0.7)

# chords (MIDI note numbers), C Lydian
CL = [48, 55, 59, 64, 66]      # Cmaj7#11
DC = [48, 54, 57, 62, 66]      # D over C: the Lydian lift
EM = [40, 47, 52, 55, 59, 62]  # Em7
AM = [45, 52, 55, 60, 64]      # Am7
GM = [43, 50, 54, 59, 62]      # Gmaj7
BM = [47, 54, 57, 62, 66]      # Bm7

# 1. They tried before: strings and a harp, the past; the title on FM bells over glass
prog('before', [CL, AM, GM, DC], 0, cq('before', 'lesson'), g=0.05, tone='strings', bassg=0.03)
motif('before', [CL, AM, GM, DC], 0, cq('before', 'breath'), every=1.3, g=0.04, inst=harp)
prog('before', [EM, CL], cq('before', 'lesson'), g=0.05, tone='glass', bassg=0.03)
theme(G('before', 'breath', 0.7), 72, fmbell, step=0.5, g=0.07)
celesta(88, G('before', 'breath', 2.6), 0.03, 0.3)
# 2. Genie guesses: plucks over glass, until the guess goes wrong; then the bed drops to A minor
prog('guesses', [CL, DC], 0, cq('guesses', 'wrong') + 3.0, g=0.045, tone='glass', bassg=0.03)
ostinato(G('guesses', 'ask', 2.0), G('guesses', 'wrong', 4.4), [72, 79, 76, 78, 72, 79, 74, 78], 0.34, softpluck, 0.03, 0.15)
prog('guesses', [AM, EM], cq('guesses', 'wrong') + 3.0, g=0.045, tone='glass', bassg=0.035)
# 3. Four ways: glass and celesta, brighter; each floor rings a bell as it lights, rising; the four ring again in the pause
prog('four', [CL, DC, GM, CL], g=0.05, tone='glass', bassg=0.03)
motif('four', [CL, DC, GM, CL], every=1.5, g=0.03, inst=celesta)
for i, (cid, d) in enumerate([('gloss', 4.1), ('tax', 0.1), ('onto', 0.1), ('sem', 0.2)]):
    fmbell([72, 76, 79, 83][i], G('four', cid, d), 0.05, (i - 1.5) * 0.3)
for i in range(4):
    fmbell([72, 76, 79, 83][i] + 12, G('four', 'breath', 0.2 + i * 0.65), 0.035, (i - 1.5) * 0.3)
# 4. The ontology: glass, a little lower; sparse bells as the statements are written; the graph brighter
prog('ontology', [EM, CL, AM, DC], g=0.05, tone='glass', bassg=0.03)
motif('ontology', [EM, CL, AM, DC], every=1.7, g=0.03, inst=fmbell)
# 5. The semantic layer: a soft, steady pulse under glass, like a meter that always reads the same
prog('semantic', [DC, CL, DC, CL], g=0.045, tone='glass', bassg=0.035)
pulse(S0('semantic') + 0.6, E('semantic') - 0.4, 96, [(0, lambda s, g, p: kick(s, g), 0.035, 0), (1, shaker, 0.012, 0.3), (2, lambda s, g, p: kick(s, g), 0.025, 0), (3, shaker, 0.012, -0.3)])
ostinato(S0('semantic') + 0.6, E('semantic') - 0.4, [36, 36, 43, 36], 0.625, lambda m, s, g, p: bass(m, s, 0.5, g, p), 0.03, 0)
# 6. Standards: glass and strings together, the celesta for the shelf; the three definitions each ring a bell
prog('standards', [GM, DC, EM, CL], g=0.045, tone='glass', bassg=0.03)
prog('standards', [GM, CL], cq('standards', 'three'), g=0.025, tone='strings', bassg=0)
motif('standards', [GM, DC, EM, CL], every=1.4, g=0.03, inst=celesta)
for i, d in enumerate([2.4, 3.6, 4.7]):
    fmbell([79, 83, 78][i], G('standards', 'three', d), 0.04, (i - 1) * 0.4)
# 7. Genie, again: plucks over glass return, and resolve to C
prog('again', [CL, GM, DC, CL], g=0.045, tone='glass', bassg=0.03)
ostinato(S0('again') + 0.4, G('again', 'answer', 0.2), [72, 76, 79, 76, 74, 78, 79, 78], 0.36, softpluck, 0.028, -0.15)
motif('again', [CL, GM], cq('again', 'answer'), every=1.5, g=0.03, inst=celesta)
# 8. Pull back: glass and strings; the motif returns on bells and celesta
prog('end', [CL, EM, DC, CL], g=0.05, tone='glass', bassg=0.035)
prog('end', [CL, GM], cq('end', 'next'), g=0.025, tone='strings', bassg=0)
theme(G('end', 'breath', 0.6), 72, fmbell, step=0.52, g=0.07); theme(G('end', 'breath', 0.86), 84, celesta, step=0.52, g=0.04)

# effects
# 1. a robin, the tree's labels, the name; Wilkins's chart spreading, then fading; forms, a list, a classification; the lesson; the title
chirp(G('before', 'linn', 0.4), 0.03, 0.4, 3400, 2); chime(G('before', 'linn', 2.8), 0.05, 1175, 0.3)
[card(G('before', 'linn', 4.1 + k * 0.45), 0.04, -0.5 + k * 0.25) for k in range(4)]; ping(G('before', 'linn', 6.6), 0.04, 0.4)
[scratch(G('before', 'wilkins', 0.5 + k * 0.9), 0.025, -0.3 + k * 0.2, 0.9) for k in range(4)]; whoosh(G('before', 'wilkins', 5.3), 1.6, 0.04, -0.2)
[page(G('before', 'night', 0.9 + k * 0.6), 0.045, (k - 1) * 0.5) for k in range(3)]; shimmer(G('before', 'night', 5.3), 0.035, 1320)
page(G('before', 'icd', 0.3), 0.04, -0.4); scratch(G('before', 'icd', 0.8), 0.03, -0.4, 2.4); whoosh(G('before', 'icd', 4.5), 0.8, 0.04, 0.3); node(G('before', 'icd', 4.8), 0.05, 0.4, 1318)
[tick(G('before', 'icd', 5.4 + 2.2 * (y - 1893) / 129), 0.03, -0.6 + 1.2 * (y - 1893) / 129) for y in (1893, 1900, 1909, 1920, 1929, 1938, 1948, 1955, 1965, 1975, 1990, 2022)]
[pop(G('before', 'lesson', k * 0.25), 0.045, (k - 1) * 0.5) for k in range(3)]; chime(G('before', 'lesson', 2.3), 0.04, 1318, -0.5); tone(G('before', 'lesson', 2.65), 0.03, 220); chime(G('before', 'lesson', 3.0), 0.04, 1568, 0.5)
bell(G('before', 'lesson', 3.2), 0.06, 523); shimmer(G('before', 'breath', 0.5), 0.045, 1568)
# 2. the question, Genie, the tables and the scan, two columns; the document no tool reads; the wrong guess; what it can read
ping(G('guesses', 'ask', 2.6), 0.05, -0.4); node(G('guesses', 'ask', 2.0), 0.04, -0.1, 1760)
[pop(G('guesses', 'finds', -0.2 + k * 0.15), 0.04, 0.3 + k * 0.15) for k in range(3)]; [link(G('guesses', 'finds', 0.3 + k * 0.35), 0.03, 0.2 + k * 0.2) for k in range(3)]
sweep(G('guesses', 'finds', 1.2), 3.8, 0.02, 700, 1800, 0.4); node(G('guesses', 'finds', 3.0), 0.05, 0.4, 1568); node(G('guesses', 'finds', 4.7), 0.05, 0.5, 1760)
page(G('guesses', 'wrong', 2.0), 0.045, 0.6); tone(G('guesses', 'wrong', 3.3), 0.035, 196)
glitch(G('guesses', 'wrong', 4.8), 0.07, -0.1); glitch(G('guesses', 'wrong', 5.05), 0.05, 0.1); chime(G('guesses', 'wrong', 5.6), 0.045, 1318, 0.2); buzz(G('guesses', 'wrong', 5.9), 0.035)
link(G('guesses', 'read', 0.2), 0.035, 0.3, 0.6); tone(G('guesses', 'read', 2.9), 0.03, 247)
# 3. four floors appear, each lights; content settles; the thread through all four
[tick(G('four', 'gloss', 0.3 + k * 0.3), 0.025, (k - 1.5) * 0.3) for k in range(4)]
[pop(G('four', cid, d + 0.4 + k * 0.5), 0.03, (k - 1) * 0.4) for cid, d in (('gloss', 4.1), ('sem', 0.2)) for k in range(3)]
[node(G('four', 'onto', 0.4 + k * 0.9), 0.035, (k - 1) * 0.4, 1568 + k * 200) for k in range(3)]; link(G('four', 'onto', 2.2), 0.03, 0.2)
[link(G('four', 'stack', 0.3 + k * 0.45), 0.035, 0, 0.45) for k in range(3)]; chime(G('four', 'stack', 1.6), 0.05, 1568)
# 4. statements, their parts and links; three conditions; the graph builds; Aisha lights; Aristotle's recipe, in pencil, then formal
pop(G('ontology', 'rules', 3.5), 0.045); node(G('ontology', 'rules', 4.1), 0.045, -0.3, 1568); node(G('ontology', 'rules', 4.4), 0.045, 0.3, 1318); link(G('ontology', 'rules', 4.5), 0.035)
pop(G('ontology', 'rules', 6.5), 0.045); node(G('ontology', 'rules', 7.1), 0.045, -0.4, 1568); node(G('ontology', 'rules', 7.4), 0.045, 0.3, 1318); link(G('ontology', 'rules', 7.5), 0.035)
[ping(G('ontology', 'rules', d), 0.035, -0.2 + k * 0.3) for k, d in enumerate((8.4, 9.1, 10.2))]
[node(G('ontology', 'graph', -0.1 + k * 0.25), 0.035, (k - 1.5) * 0.4, 1318 + k * 150) for k in range(4)]
[pop(G('ontology', 'graph', 3.8 + k * 0.3), 0.03, -0.5 + k * 0.15) for k in range(8)]; [link(G('ontology', 'graph', 5.0 + k * 0.28), 0.025, -0.4 + k * 0.1) for k in range(8)]
chime(G('ontology', 'graph', 7.6), 0.05, 1568, -0.5)
scratch(G('ontology', 'aristotle', 0.2), 0.03, -0.4, 1.8); scratch(G('ontology', 'aristotle', 1.8), 0.025, -0.4, 0.5); scratch(G('ontology', 'aristotle', 3.1), 0.025, -0.4, 0.6)
[tick(G('ontology', 'aristotle', 2.4 + k * 0.3), 0.03, 0.4) for k in range(6)]; link(G('ontology', 'aristotle', 3.6), 0.035, 0); stamp(G('ontology', 'aristotle', 4.3), 0.07, 0.3)
# 5. the metric's four parts; the tools, each asking the one definition; the definition shared
[tick(G('semantic', 'once', d), 0.035, 0) for d in (4.1, 4.8, 5.9, 6.9)]; chime(G('semantic', 'once', 3.3), 0.04, 1318)
[pop(G('semantic', 'tools', d), 0.04, p) for d, p in ((-0.2, -0.6), (0.4, -0.6), (1.1, 0.6))]
[link(G('semantic', 'tools', 1.7 + k * 0.35), 0.035, (-0.5, -0.5, 0.5)[k]) for k in range(3)]; [ding(G('semantic', 'tools', 2.2 + k * 0.35), 0.03, (-0.5, -0.5, 0.5)[k], 2093) for k in range(3)]
whoosh(G('semantic', 'open', 0.2), 0.8, 0.035); page(G('semantic', 'open', 0.5), 0.04)
# 6. a blank page; the shelf, group by group; digital credentials and their parts; three definitions; check, adopt, extend, record
page(G('standards', 'blank', 0.3), 0.04); [page(G('standards', 'blank', d), 0.045, -0.6 + k * 0.3) for k, d in enumerate((3.2, 3.7, 4.1, 4.5, 6.8))]; chime(G('standards', 'blank', 6.9), 0.04, 1568, 0.5)
[pop(G('standards', 'creds', 0.3 + k * 0.35), 0.035, -0.5) for k in range(3)]; card(G('standards', 'creds', 0.6), 0.04, 0.3); [tick(G('standards', 'creds', d), 0.035, 0.3) for d in (2.7, 3.2, 3.8)]
[page(G('standards', 'three', 0.5 + k * 0.25), 0.03, (k - 1) * 0.5) for k in range(3)]; [node(G('standards', 'three', 5.8 + k * 0.12), 0.03, (k - 1) * 0.5, 1245) for k in range(3)]; chime(G('standards', 'three', 6.6), 0.035, 1568)
[ping(G('standards', 'choose', d), 0.035, -0.5 + k * 0.33) for k, d in enumerate((1.1, 1.7, 2.2))]; stamp(G('standards', 'choose', 2.7), 0.08, 0.5)
[pop(G('standards', 'choose', 5.0 + k * 0.22), 0.03, 0.4) for k in range(4)]
# 7. the question again; Genie asks back; the answer, counted, and its definition; the comparison
ping(G('again', 'asks', -1.0), 0.035, -0.4); node(G('again', 'asks', 2.3), 0.05, 0.2, 1568); ping(G('again', 'asks', 2.5), 0.04, 0.3); pop(G('again', 'asks', 4.9), 0.04, -0.4)
[tick(G('again', 'answer', 0.3 + k * 0.1), 0.03, 0.1) for k in range(8)]; chime(G('again', 'answer', 1.2), 0.06, 1568, 0.2); card(G('again', 'answer', 1.1), 0.035, 0.5)
sweep(G('again', 'evid', 1.0), 1.2, 0.02, 400, 700, 0.2); sweep(G('again', 'evid', 1.6), 1.8, 0.025, 500, 1500, 0.3); chime(G('again', 'evid', 6.0), 0.04, 1318, 0.3)
# 8. the triangle's corners and edges; the word in Spanish; the idea in the ontology; the data; the end
[node(G('end', 'tri', 0.5 + k * 0.4), 0.03, (k - 1) * 0.5, 1175) for k in range(3)]
node(G('end', 'tri', 2.9), 0.05, -0.4, 1568); pop(G('end', 'tri', 4.6), 0.04, -0.4); node(G('end', 'tri', 5.0), 0.05, 0, 1760); link(G('end', 'tri', 5.2), 0.035, -0.2)
[node(G('end', 'tri', 5.6 + k * 0.3), 0.03, (k - 0.5) * 0.6, 2093) for k in range(2)]; link(G('end', 'tri', 7.5), 0.035, 0.2); node(G('end', 'tri', 7.9), 0.05, 0.4, 1318)
whoosh(G('end', 'next', 0.3), 1.0, 0.03); bell(G('end', 'breath', 0.6), 0.07, 523)
