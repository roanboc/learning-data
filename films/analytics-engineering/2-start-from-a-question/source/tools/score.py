# Start from a question: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). This film's palette, from the series plan: G major with a mixolydian colour (F natural) for the present,
# a solo cello in G minor for 1854, and the series' mark, 1-4-5-8, on a nylon-string guitar (a plucked string, darkened).
# The bed is a warm pad over a low open-fifth cello drone. Two rules, as in the opening film:
#  - Nothing loops. No pulse, walking bass, repeated figure or random notes: sustained chords that change with the chapters.
#  - Every sound is an event on screen, at the moment it appears. Each effect uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed.
# Everything stays low and soft, filtered below about 2.5 kHz: a pen nib on paper, a pump's creak (once), pins pressed into a
# map (soft knocks), muffled keys for code, a paper swipe for Mei's clause, a low stamp for her approval. No chimes or pings.

import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    """when a word of a line is spoken, as the film's kt_w() estimates it"""
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid, off=0):
    """when a line's voice ends (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
def _h(i, k=0):
    """a fixed pseudo-random number in 0..1, so the small variations are the same on every mix"""
    return ((i * 9301 + k * 49297 + 233280) % 233280) / 233280.0

# ---- soft sounds, all low-passed ----
def guitar(m, start, g=0.05, pan=0.0, sec=2.8, dark=1800):
    """a nylon-string guitar: a plucked string (Karplus-Strong), darkened by a soft averaging loop and a low-pass"""
    f = mf(m); N = max(2, int(round(SR / f))); n = int(sec * SR); rs = np.random.default_rng(int(m * 7 + 3))
    buf = filt(rs.uniform(-1, 1, N).astype(np.float32), 'low', 1600) if N > 16 else rs.uniform(-1, 1, N).astype(np.float32)
    y = np.zeros(n, np.float32); y[:N] = buf
    for i in range(N, n):
        y[i] = 0.996 * 0.5 * (y[i - N] + y[i - N - 1 if i - N - 1 >= 0 else i - N])
    x = tt(sec); y = y * np.minimum(1, x / 0.004) * env(sec, 0.004, 0.8)
    put(norm(filt(y, 'low', dark)), start, g, pan)
def cello(m, start, sec, g=0.03, pan=0.0):
    """a solo cello note: a bowed tone, slow in, slow out, filtered"""
    x = tt(sec); f = mf(m); vib = 0.004 * f * 2 * np.pi * np.minimum(1, x / 0.8)
    s = sum(np.sin(2 * np.pi * f * k * x + vib * np.sin(2 * np.pi * 5.0 * x) / 5.0 * k) * (1 / k) * np.exp(-0.35 * k) for k in range(1, 9))
    s = s * env(sec, min(0.7, sec / 3), min(1.2, sec / 3))
    put(norm(filt(s.astype(np.float32), 'low', 1800)), start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def pin(s, g=0.04, pan=0.0):
    """a pin pressed into a map: a short, low knock with a soft give"""
    x = tt(0.14); X(norm(filt((np.sin(2 * np.pi * 180 * x) * np.exp(-x * 45) + 0.3 * filt(noise(0.14), 'band', (300, 1200)) * np.exp(-x * 70)).astype(np.float32), 'low', 1200)), s, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def nib(s, g=0.02, pan=0.0, sec=0.12):
    """a steel nib on paper: a short, dry scratch, band-limited and low"""
    x = tt(sec); X(filt(noise(sec), 'band', (700, 2300)) * np.sin(np.pi * x / sec) * (0.7 + 0.3 * np.sin(2 * np.pi * 23 * x)), s, g, pan)
def press(s, g=0.1):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')
def lines(t0, n, per, g=0.02, pan=-0.3):
    """one muffled key per line of code, as each line is typed"""
    for k in range(n):
        tap(t0 + k * per, g * (0.85 + 0.3 * _h(k, n)), pan + 0.1 * (_h(k, 3) - 0.5))
def mark(start, root, g=0.07):
    """the series' four notes, 1-4-5-8, rising, on the guitar"""
    for i, iv in enumerate([0, 5, 7, 12]):
        guitar(root + iv, start + i * 0.36, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15, sec=3.4 if i == 3 else 2.4)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', fifth=0.018):
    """the chapter's chords over a low open fifth (G and D) on the cello"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=0)
    s0, s1 = span(sid, a, b)
    if fifth:
        drone(31, s0 - 2.0, s1 - s0 + 4.0, fifth, 'strings'); drone(38, s0 - 2.0, s1 - s0 + 4.0, fifth * 0.7, 'strings')

def creak(s, g=0.03, pan=0.1, sec=0.9):
    """a pump handle's low creak, once: a slow, rough, falling tone"""
    x = tt(sec); f = 140 - 40 * x / sec; ph = np.cumsum(2 * np.pi * f / SR)
    r = filt(noise(sec), 'band', (90, 600)) * 0.6
    sig = np.sin(ph) * (1 + r) * np.sin(np.pi * x / sec) ** 1.5 * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * x))
    X(norm(filt(sig.astype(np.float32), 'low', 900)), s, g, pan)

# chords (MIDI note numbers): G major with F natural (mixolydian), and G minor for 1854
GADD9 = [43, 50, 55, 57, 59]; CADD9 = [48, 55, 59, 62, 64]; FMAJ7 = [41, 48, 52, 57]; DSUS = [38, 45, 50, 55, 57]
EM7 = [40, 47, 50, 55]; AM7 = [45, 52, 55, 60]; G7SUS = [43, 50, 53, 55, 60]; GMAJ9 = [43, 50, 54, 57, 59]
GM = [43, 50, 55, 58]; CM = [48, 55, 60, 63]; EBMAJ7 = [39, 46, 50, 55]; DM_ = [38, 45, 50, 53]

# 1. One question, one map: a solo cello in G minor; the nib for the streets, the question, the buildings and each address;
#    the pump's creak once; a felt note as the question mark lifts; the title on the guitar
B1 = cq('map', 'breath')
for k, (m, a, d) in enumerate([(43, 0.4, 7.0), (46, 7.0, 6.0), (50, 12.6, 6.5), (48, 18.6, 5.0), (46, 23.2, 5.5)]):
    if a < B1:
        cello(m, S0('map') + a, min(d, B1 - a + 1.5), 0.03, -0.1 + 0.05 * k)
pad(GM, S0('map') + 0.2, B1 + 1.0, 0.018, 'strings')
s0, s1 = S0('map') + 1.0, G('map', 'asked', 0.4)
for k in range(int((s1 - s0) / 0.55)):  # the streets, stroke by stroke, never evenly
    nib(s0 + k * 0.55 + 0.2 * _h(k, 1), 0.012 + 0.006 * _h(k, 2), -0.3 + 0.6 * _h(k, 3), 0.18 + 0.12 * _h(k, 4))
q0 = W('map', 'asked', 'where'); nib(q0, 0.016, -0.4, 0.9); nib(q0 + 1.0, 0.014, -0.35, 0.8)
b0 = q0 + 2.15; nib(b0, 0.016, -0.1, 0.6); nib(b0 + 0.65, 0.016, 0.1, 0.6)
m0 = G('map', 'marks', 0.3); dt = (END('map', 'marks') - G('map', 'marks') + 0.3) / 25
for k in range(25):  # one scratch per address, as its bars are drawn
    nib(m0 + k * dt, 0.014 + 0.008 * _h(k, 5), -0.35 + 0.7 * _h(k, 6), 0.08 + 0.06 * _h(k, 7))
creak(W('map', 'marks', 'one pump', -0.1), 0.03)
soft(55, W('map', 'left', 'only'), 0.025, -0.2)
soft(62, G('map', 'bridge', 0.2), 0.03, 0.4)
pad([43, 50, 55, 59, 62], G('map', 'breath'), 5.0, 0.03, 'warm')
mark(G('map', 'breath', 0.7), 55)
# 2. The question: the present; a knock as the loop and each badge arrive; keys as the question types; a pin for the census number;
#    paper as the card turns into its YAML; a felt note for the label, and for the two hash functions
bed('ask', [GADD9, CADD9, FMAJ7, GADD9, DSUS])
knock(G('ask', 'step', -0.2), 0.035, -0.5)
knock(G('ask', 'text', -0.5), 0.04, 0.5)
t0, t1 = G('ask', 'text', -0.1), END('ask', 'text', -0.6)
lines(t0, 6, (t1 - t0) / 6, 0.016, 0.0)
knock(G('ask', 'decision', -0.2), 0.035, 0.0)
soft(59, W('ask', 'decision', 'places'), 0.025, 0.1)
knock(W('ask', 'wallet', 'wallet app', -0.2), 0.035, 0.7)
pin(W('ask', 'done', 'census report'), 0.05, 0.5)
paper(G('ask', 'real', -0.3), 0.03, -0.2, 1.2)
soft(62, W('ask', 'real', 'real'), 0.03, 0.2)
paper(W('ask', 'cloud', 'Databricks', -0.1), 0.02, 0.2, 0.6)
knock(W('ask', 'hash', 'connection', -0.3), 0.035, 0.5)
lines(W('ask', 'hash', 'turns a key', -0.2), 3, 0.2, 0.016, 0.0)
knock(W('ask', 'hash', 'into a hash', -0.1), 0.035, 0.0)
soft(55, W('ask', 'hash', 'hash', 0.3), 0.03, -0.2); soft(62, W('ask', 'hash', 'hash', 0.35), 0.026, 0.2)
# 3. The slice: paper as the glossary fans out; a pin as each of the four lights; paper as the rest drift off; keys for Noor's line
bed('slice', [EM7, CADD9, GADD9, DSUS])
paper(G('slice', 'glossary', 0.2), 0.03, 0.0, 1.6)
for j, word in enumerate(['a learner', 'a credential', 'an award', 'the credit']):
    pin(W('slice', 'four', word, -0.2), 0.045, -0.4 + j * 0.27)
soft(55, W('slice', 'four', 'the credit', -0.1), 0.026, 0.0)
paper(G('slice', 'out', 0.1), 0.025, -0.5, 1.2); paper(G('slice', 'out', 0.5), 0.022, 0.5, 1.2)
knock(G('slice', 'never', -0.2), 0.03, 0.5); knock(G('slice', 'never', 0.2), 0.03, 0.75)
lines(W('slice', 'never', 'wrote down'), 3, 0.85, 0.018, -0.2)
# 4. Written as YAML, drawn for people: paper as the blueprint settles; a key per line of YAML; three felt notes as its parts light;
#    a key per line of Mermaid as the diagram draws
bed('yaml', [CADD9, GADD9, AM7, G7SUS])
paper(S0('yaml') + 0.2, 0.03, 0.0, 1.2)
knock(G('yaml', 'once'), 0.035, -0.3)
lines(G('yaml', 'once', 0.2), 10, 0.18, 0.016, -0.3)
for j, word in enumerate(['a definition', 'an owner', 'the rule']):
    soft([55, 59, 62][j], W('yaml', 'learner', word, -0.1), 0.026, -0.3)
knock(G('yaml', 'diagram', -0.3), 0.035, 0.5)
lines(G('yaml', 'diagram', -0.1), 6, 3.4 / 6, 0.016, 0.5)
soft(57, W('yaml', 'read', 'anyone'), 0.03, 0.4)
# 5. Keys and owners: a pin as each key reaches its entity; paper as the prefixes lift; keys for the key sets; felt notes as the owners
#    arrive; a low note when the sources disagree, and Mei's note again when the owner decides
bed('owners', [GADD9, EM7, CADD9, FMAJ7, GADD9])
knock(G('owners', 'before'), 0.03, 0.0)
for j, (word, off) in enumerate([('student ID', -0.2), ('its code', -0.2), ('the ID its issuer', -0.2), ('the ID its issuer', 0.1)]):
    pin(W('owners', 'keys', word, off), 0.045, [-0.5, 0.5, 0.0, 0.15][j])
for i in range(3):
    paper(G('owners', 'sets', 0.3 + i * 0.2), 0.018, -0.6, 0.5)
lines(G('owners', 'sets', 1.0), 10, 0.16, 0.015, -0.1)
for i in range(3):
    soft([55, 59, 62][i], W('owners', 'mei', 'owns learner', i * 0.25 - 0.2), 0.022, -0.4 + i * 0.4)
soft(55, W('owners', 'mei', 'Mei', -0.1), 0.03, 0.3); soft(52, W('owners', 'mei', 'learning team', -0.1), 0.028, 0.3)
soft(41, W('owners', 'why', 'disagree', -0.2), 0.035, 0.0)
soft(55, W('owners', 'why', 'decides'), 0.03, 0.2)
# 6. Combine or split: a knock for the title, one as the microcredential card arrives; a muffled key as each row appears; felt notes for the two ticks, a low one for the
#    difference; a swell as they merge; knocks for the kinds; the certificate slides in and is turned away with a soft thud
bed('split', [CADD9, AM7, GADD9, FMAJ7, DSUS])
knock(G('split', 'harder', 0.2), 0.03, 0.0); knock(G('split', 'harder', 0.5), 0.035, -0.4)
tap(W('split', 'compare', 'what identifies', -0.1), 0.022, 0.0); tap(W('split', 'compare', 'its life', -0.1), 0.022, 0.0)
soft(59, W('split', 'compare', 'Compare its life', -0.3), 0.028, 0.0); soft(62, W('split', 'same', 'Both match'), 0.028, 0.0)
soft(46, W('split', 'same', 'credit points', -0.2), 0.03, 0.0)
swell([43, 50, 55, 59, 62], W('split', 'rule', 'one entity', -0.3), 2.6, 0.024)
for i in range(3):
    knock(W('split', 'rule', 'with kinds', 0.2 + i * 0.2), 0.028, -0.3 + i * 0.3)
lines(W('split', 'rule', 'with kinds', -0.1), 4, 0.15, 0.014, 0.0)
knock(W('split', 'rule', 'A different', -0.2), 0.03, 0.0)
paper(G('split', 'attend', -0.2), 0.025, 0.7, 2.0)
knock(W('split', 'attend', 'was there', -0.4), 0.03, -0.4)
thud(W('split', 'attend', 'stays out', -0.3), 0.06); soft(43, W('split', 'attend', 'stays out', -0.2), 0.03, 0.6)
# 7. The agent's draft: a teal swell as the agent wakes; paper for the skill; a key as each step lights; keys as the draft types;
#    a paper swipe as Mei writes her clause; a felt note for her tick and a low stamp for the approval; keys for the log
bed('draft', [EM7, CADD9, AM7, GADD9])
swell([50, 57, 62, 64], W('draft', 'agent', 'An AI agent', -0.2), 3.0, 0.02)
paper(W('draft', 'agent', 'a skill', -0.2), 0.028, 0.4, 0.7)
for word in ['Write the question', 'List only', 'Propose']:
    tap(W('draft', 'skill', word, -0.1), 0.022, 0.4)
lines(G('draft', 'miss', -0.6), 6, 0.4, 0.016, 0.3)
soft(46, W('draft', 'miss', 'let certificates', -0.2), 0.026, 0.3)
knock(G('draft', 'clause', -0.5), 0.028, 0.8)
paper(W('draft', 'clause', 'a certificate'), 0.035, 0.4, 1.6)
soft(62, W('draft', 'approve', 'approves', -0.1), 0.03, 0.7)
press(W('draft', 'approve', 'approves', 0.1), 0.08)
lines(W('draft', 'approve', 'in the log', -0.1), 4, 0.4, 0.016, 0.2)
# 8. Now, the sources: knocks as the picture assembles; a felt note for each count; a knock for each source, panned; Aisha three
#    times, three felt notes; a knock as station 2 lights; the mark on the guitar for the end
bed('next', [GADD9, CADD9, DSUS], 0, cq('next', 'breath'))
knock(S0('next') + 0.2, 0.03, 0.0); paper(S0('next') + 0.5, 0.025, 0.0, 0.9)
soft(55, S0('next') + 0.9, 0.022, -0.6); soft(52, S0('next') + 1.1, 0.022, 0.6)
for j, word in enumerate(['One question', 'Four things', 'Two owners', 'Nothing else']):
    soft([55, 59, 62, 67][j], W('next', 'count', word, -0.1), 0.024, [-0.5, 0.0, -0.6, 0.6][j])
for k in range(3):
    knock(G('next', 'sources', 0.1 + k * 0.3), 0.035, -0.5 + k * 0.5)
    soft([50, 55, 59][k], W('next', 'three', 'Aisha', k * 0.3), 0.03, -0.5 + k * 0.5)
knock(G('next', 'three', 2.4), 0.03, 0.7)
pad(GMAJ9, G('next', 'breath'), 6.0, 0.04, 'warm'); drone(31, G('next', 'breath'), 6.0, 0.02, 'strings'); drone(38, G('next', 'breath'), 6.0, 0.014, 'strings')
mark(G('next', 'breath', 0.8), 55, 0.075)
