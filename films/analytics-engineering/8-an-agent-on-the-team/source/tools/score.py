# An agent on the team: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The series plan's palette for this film: E major, turning to C-sharp minor for The shortcut; the
# series' mark, 1-4-5-8, on a warm analogue synth (a filtered saw with a slow attack); a bed of analogue pads whose filter
# opens and closes slowly; strings for England in 1766.
# Two rules, as in the opening film:
#  - Nothing loops. No pulse, walking bass, repeated figure or random notes: the music is sustained chords that change with
#    the chapters.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# Everything stays low and soft: wooden knocks, muffled keys, paper, a pencil, low felt notes and a thud for the gold stamp,
# filtered below about 2.5 kHz. No chimes, pings, shimmers or bells.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid, off=0):
    """when a line's voice ends (the scenes' sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off

# ---- the analogue synth and its pad ----
def _saw(f, x, det=1.0):
    """a band-limited saw: harmonics up to about 2.4 kHz only"""
    n = max(1, min(24, int(2400 / (f * det))))
    return sum(np.sin(2 * np.pi * f * det * k * x + 0.3 * k) / k for k in range(1, n + 1))
def synth(m, start, g=0.05, pan=0.0, sec=2.6, att=0.12):
    """the mark's voice: two detuned saws, low-passed, with a slow attack and a long release"""
    f = mf(m); x = tt(sec); s = (_saw(f, x, 0.997) + _saw(f, x, 1.003)) * 0.5
    s = filt(s.astype(np.float32), 'low', 1300) * env(sec, att, sec * 0.6)
    put(norm(s), start, g, pan)
def apad(ch, start, sec, g=0.04):
    """an analogue pad: detuned saws through a filter that opens and closes once, slowly, over the chord"""
    x = tt(sec); lo = np.zeros_like(x); hi = np.zeros_like(x)
    for m in ch:
        f = mf(m); s = (_saw(f, x, 0.996) + _saw(f, x, 1.004)).astype(np.float32)
        lo += filt(s, 'low', 420); hi += filt(s, 'low', 1300)
    w = (0.5 - 0.5 * np.cos(2 * np.pi * x / sec)).astype(np.float32) * 0.7
    s = (lo * (1 - w) + hi * w) * env(sec, 2.2, 3.0) / len(ch)
    for pan, k in ((-0.6, 1.0), (0.6, 1.0)):
        put(s.astype(np.float32), start + (0.02 if pan > 0 else 0), g * k, pan)
def bed(sid, chords, a=None, b=None, g=0.034, bassg=0.02):
    """the chapter's chords, sustained, one after another, each starting 2 s early and lasting 4 s longer"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        apad(ch, s0 + i * d - 2.0, d + 4.0, g)
        if bassg:
            drone(ch[0] - 12, s0 + i * d - 2.0, d + 4.0, bassg)
def mark(start, root, g=0.075):
    """the series' four notes, 1-4-5-8, rising, on the synth"""
    for i, iv in enumerate([0, 5, 7, 12]):
        synth(root + iv, start + i * 0.36, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15, sec=3.4 if i == 3 else 2.2)

# ---- soft sounds, all low-passed ----
def soft(m, start, g=0.035, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.04, pan=0.0):
    """a soft wooden knock, for a card or a door arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def dknock(s, g=0.045, pan=0.0):
    """a muted double knock: a test that stopped something"""
    for k, d in enumerate((0.0, 0.16)):
        x = tt(0.2); X(norm(filt((np.sin(2 * np.pi * 150 * x) * np.exp(-x * 30)).astype(np.float32), 'low', 700)), s + d, g * (1 if k == 0 else 0.8), pan)
def tap(s, g=0.022, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def lines(t0, n, per, g=0.018, pan=-0.2):
    """one muffled key per line of code, as each line is typed"""
    for k in range(n):
        tap(t0 + k * per, g, pan)
def paper(s, g=0.035, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def ptick(s, g=0.03, pan=0.0):
    """the comparer's pencil mark: a short, low paper tick"""
    x = tt(0.09); X(norm(filt(noise(0.09), 'band', (180, 900)) * np.exp(-x * 45)), s, g, pan)
def quill(s, sec, g=0.022, pan=0.0, seed=1):
    """a quill writing: soft filtered scratches, each stroke its own length, never a pattern"""
    r = np.random.default_rng(seed); x = tt(sec); e = np.zeros_like(x); t = 0.0
    while t < sec - 0.2:
        d = 0.08 + 0.22 * r.random(); i0, i1 = int(t * SR), int(min(sec, t + d) * SR)
        e[i0:i1] = np.sin(np.pi * np.linspace(0, 1, i1 - i0)) * (0.5 + 0.5 * r.random()); t += d + 0.05 + 0.25 * r.random()
    X(filt(noise(sec), 'band', (500, 2200)) * e * env(sec, 0.3, 0.6), s, g, pan)
def swell(ch, s, sec=2.6, g=0.022):
    """a soft pad swell (the evidence card's sound), instead of a shimmer"""
    apad(ch, s, sec, g)
def stamp(s, g=0.09):
    """the gold stamp: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.35)

# chords (MIDI): E major and its neighbours; C-sharp minor for the shortcut
EMAJ9 = [40, 47, 51, 54, 56]; AMAJ9 = [45, 52, 56, 59, 61]; BSUS = [47, 54, 59, 61, 64]; CSM7 = [49, 52, 56, 59]
FSM9 = [42, 49, 52, 56, 57]; GSM7 = [44, 51, 54, 59]; ESUS = [40, 47, 52, 57, 59]; AMAJ7 = [45, 52, 56, 61]
CSM9 = [37, 44, 47, 52, 51]; FSM7 = [42, 49, 52, 57]; GS7SUS = [44, 51, 54, 61]; BMAJ = [47, 54, 59, 63]

# 1. Computed twice: strings for 1766; paper for the page and the letters; two quills far apart; the comparer's pencil; the press;
#    the analogue pad as the present arrives; the series' mark on the synth under the title
s0 = S0('almanac'); cP = G('almanac', 'posted'); cT = G('almanac', 'twice'); cB = G('almanac', 'bridge'); B = G('almanac', 'breath')
for i, ch in enumerate([EMAJ9, AMAJ9, ESUS, CSM7]):
    pad(ch, s0 + i * (cB - s0) / 4 - 2.0, (cB - s0) / 4 + 4.0, 0.034, 'strings')
paper(s0 + 0.5, 0.03, -0.1, 0.8)
t0 = W('almanac', 'posted', 'instructions', -0.2)
paper(t0, 0.04, 0.0, 0.6); paper(t0 + 0.5, 0.025, -0.4, 0.9); paper(t0 + 0.6, 0.025, 0.4, 0.9)
for i in range(2):
    knock(W('almanac', 'posted', 'at home', -0.2 + i * 0.25), 0.026, -0.4 + i * 0.6)
cC = W('almanac', 'twice', 'A comparer', -0.3)
# the quills write until the sheets start sliding to the comparer (mv > 0 in the scene)
quill(cT + 0.3, cC - (cT + 0.3), 0.024, -0.9, 3); quill(cT + 0.35, cC - (cT + 0.35), 0.022, 0.9, 8)
knock(cC - 0.2, 0.03, 0.0)
paper(cC, 0.03, -0.3, 1.2); paper(cC + 0.1, 0.03, 0.3, 1.2)
pT = W('almanac', 'twice', 'checked'); ptick(pT + 1.8, 0.035, -0.1); ptick(pT + 2.0, 0.025, -0.1); tap(pT + 2.6, 0.02, -0.1)
cP2 = W('almanac', 'twice', 'printed'); stamp(cP2 + 0.8, 0.05)
apad([52, 59, 63, 66], cB + 0.2, 6.0, 0.03)
knock(cB + 0.6, 0.03, 0.4); soft(64, W('almanac', 'bridge', 'an AI agent', -0.3), 0.03, 0.6)
apad(EMAJ9, B - 0.6, 6.0, 0.036); drone(28, B - 0.6, 6.0, 0.022)
mark(B + 0.7, 64)
# 2. Written down: a knock for each thing the agent can do; paper and keys as AGENTS.md opens; a knock as each skill is named;
#    paper as the process table opens, a note for the agent's part and one for who approves; a swell for the reviewed files
bed('skills', [EMAJ9, AMAJ9, FSM9, BSUS])
for k in ['read', 'run dbt', 'draft']:
    knock(W('skills', 'can', k), 0.03, 0.2)
cA = G('skills', 'agents'); paper(cA - 0.2, 0.035); lines(cA, 6, 0.36)
soft(64, W('skills', 'agents', 'may do'), 0.03, 0.4); soft(57, W('skills', 'agents', 'must not'), 0.032, 0.4)
for i, k in enumerate(['draft the conceptual model', 'profile a source', 'draft a model', 'reconcile and diff', 'review the metadata']):
    knock(W('skills', 'five', k, -0.2), 0.028, -0.5 + i * 0.1)
paper(W('skills', 'five', 'draft a model', -0.1), 0.025, 0.3); paper(W('skills', 'five', 'reconcile and diff', -0.1), 0.025, 0.3)
cPr = G('skills', 'process'); paper(cPr - 0.1, 0.035, 0.0, 0.7)
soft(59, W('skills', 'process', "the agent's part"), 0.03, -0.2); soft(64, W('skills', 'process', 'who approves'), 0.03, 0.2)
knock(W('skills', 'files', 'not a long prompt'), 0.03, -0.4)
swell([52, 59, 63, 68], W('skills', 'files', 'reviewed'), 3.0, 0.02)
# 3. Least access: a knock for the key card; a low note for the crossed badge; a knock for each door; a felt note as its own
#    wing opens; paper for the grants; a key for each count that passes the glass; a pencil scribble in its own room
bed('least', [EMAJ9, GSM7, AMAJ9])
knock(W('least', 'principal', 'service principal', -0.2), 0.035, -0.5)
soft(47, W('least', 'principal', 'never as a person', 0.3), 0.03, -0.5)
for i, k in enumerate(['sources', 'core', 'marts']):
    knock(W('least', 'reads', k, -0.1), 0.03, -0.2 + i * 0.2)
soft(64, W('least', 'reads', 'writes', -0.1), 0.03, 0.6)
paper(W('least', 'reads', 'writes', 0.6), 0.03, -0.2); lines(W('least', 'reads', 'writes', 0.7), 4, 0.35)
cS = G('least', 'samples'); paper(cS - 0.1, 0.025, -0.5)
for i in range(4):
    tap(W('least', 'samples', 'counts', i * 0.45 + 0.6), 0.022, -0.3 + i * 0.1)
paper(W('least', 'samples', 'small samples', -0.2), 0.025, 0.3)
quill(W('least', 'stays', 'gets wrong'), 1.0, 0.02, 0.7, 13)
# 4. Evidence: a knock for the claim and a swell as its query and result clip on; a knock for each claim seen before; paper as the
#    rule opens; the example clips together; paper for the decision, and Mei's gold tick as a low stamp; the unread claim slides back
bed('evidence', [EMAJ9, CSM7, AMAJ9, BSUS])
knock(S0('evidence') + 0.6, 0.03)
swell([52, 59, 64, 68], W('evidence', 'claim', 'the query', -0.1), 2.6, 0.02)
for i, k in enumerate(['no student ID', 'shared family email', 'a week late']):
    knock(W('evidence', 'four', k, -0.3), 0.03, -0.5 + i * 0.5)
cM = G('evidence', 'more'); paper(cM - 0.2, 0.035)
paper(W('evidence', 'more', 'example', -0.4), 0.025, -0.3)
swell([52, 59, 63, 68], W('evidence', 'more', 'example', 0.3), 2.4, 0.018)
soft(57, W('evidence', 'mei', 'asks Mei'), 0.03, 0.5)
paper(W('evidence', 'mei', 'records', -0.2), 0.03, -0.3)
stamp(W('evidence', 'mei', 'records a decision', 0.5), 0.06)
cG = G('evidence', 'guess'); knock(cG - 0.1, 0.028, 0.5); paper(W('evidence', 'guess', 'goes back'), 0.03, 0.6, 1.0)
# 5. The shortcut: the key turns to C-sharp minor; keys as the code and the draft are typed; the failing row as a muted double knock;
#    a low note as the withdrawal slides past census day; the struck line as a muted double knock; a rising felt pair for green
bed('shortcut', [EMAJ9, CSM9, FSM7, GS7SUS, CSM9, AMAJ9, EMAJ9])
paper(S0('shortcut') + 0.4, 0.03); lines(S0('shortcut') + 0.5, 6, 0.3)
rec = W('shortcut', 'refactor', 'by when it was recorded'); paper(rec - 0.3, 0.025, -0.3); lines(rec, 7, 0.23, 0.02, -0.3)
cF = G('shortcut', 'fails'); paper(cF - 0.2, 0.025, 0.3); lines(cF, 4, 0.3, 0.016, 0.3)
dknock(cF + 1.3, 0.05, 0.3); knock(W('shortcut', 'fails', 'Business'), 0.03, 0.3)
cY = G('shortcut', 'why'); paper(cY - 0.2, 0.025)
soft(44, W('shortcut', 'why', 'now looks like'), 0.035)
cW = G('shortcut', 'warn'); paper(cW - 0.3, 0.025, -0.3); tap(cW + 0.8, 0.02, -0.3)
soft(49, W('shortcut', 'warn', 'The build passes'), 0.03, 0.3)
cSt = G('shortcut', 'stop'); knock(cSt - 0.1, 0.03, 0.5)
dknock(W('shortcut', 'stop', 'stops it'), 0.055, -0.3)
paper(W('shortcut', 'stop', 'The rule', -0.3), 0.03)
paper(G('shortcut', 'news', -0.2), 0.025)
cX = G('shortcut', 'fix'); paper(cX - 0.3, 0.03); b2 = W('shortcut', 'fix', 'Business'); lines(b2 - 0.3, 4, 0.3)
soft(52, b2 + 0.4, 0.035); soft(59, b2 + 0.6, 0.03); soft(64, b2 + 0.8, 0.028)
# 6. Reconcile and diff: two knocks for two checks; a soft knock as each faculty's row lands on zero; a knock for each build;
#    keys as they're compared; a swell as the stack is rebuilt; paper as each diff opens; a low note for the empty diff
bed('validate', [EMAJ9, AMAJ9, BSUS, EMAJ9])
knock(W('validate', 'two', 'two checks', -0.1), 0.03, -0.3); knock(W('validate', 'two', 'two checks', 0.2), 0.03, 0.3)
for i, k in enumerate(['Two', 'three', 'five', 'and two']):
    knock(W('validate', 'reconcile', k), 0.026, 0.2)
soft(64, W('validate', 'reconcile', 'zero'), 0.03)
knock(W('validate', 'diff', 'build main'), 0.03, -0.4); knock(W('validate', 'diff', 'the branch'), 0.03, 0.0)
for i in range(4):
    tap(W('validate', 'diff', 'key by key', i * 0.2), 0.018, -0.2)
paper(G('validate', 'diff', 0.4), 0.025)
cSc = G('validate', 'scratch'); knock(cSc - 0.2, 0.026, 0.6)
swell([52, 59, 64, 68], W('validate', 'scratch', 'change in logic', 0.4), 2.4, 0.02)
cN = G('validate', 'none'); paper(cN - 0.2, 0.03); paper(W('validate', 'none', 'In the core', -0.2), 0.025)
soft(56, W('validate', 'none', 'With the fix'), 0.03); soft(52, W('validate', 'none', 'the diff is empty'), 0.035)
# 7. Review and ship: a felt note as it's marked ready; a key per heading; the evidence card's swell; one soft knock per CI check as it
#    appears; paper for the README, a swell as only what changed lights; the people arrive; the gold stamp, once for all three; the merge
bed('ship', [EMAJ9, AMAJ9, FSM9, BSUS, EMAJ9])
knock(S0('ship') + 0.2, 0.03, -0.4)
soft(64, W('ship', 'pr', 'ready'), 0.03, -0.4)
for k in ['what it changed', 'why', 'what it checked']:
    tap(W('ship', 'pr', k), 0.02, -0.4)
swell([52, 59, 63, 68], W('ship', 'pr', 'the evidence', -0.3), 2.6, 0.022)
paper(G('ship', 'ci', -0.2), 0.03, 0.4)
for tc in [W('ship', 'ci', 'builds the project'), W('ship', 'ci', 'generated docs'), W('ship', 'ci', 'generated docs', 0.7), W('ship', 'ci', 'metric'), W('ship', 'cloud', 'parses')]:
    knock(tc, 0.03, -0.4)
paper(W('ship', 'cloud', 'On dbt Cloud', -0.2), 0.03, 0.4)
swell([47, 54, 59, 63], W('ship', 'cloud', 'only what changed'), 2.4, 0.018)
cPe = G('ship', 'people')
for i in range(3):
    knock(cPe + i * 0.3, 0.025, 0.1 + i * 0.25)
soft(59, W('ship', 'people', 'the code', -0.1), 0.026, 0.1); soft(64, W('ship', 'people', 'the model', -0.1), 0.026, 0.4)
stamp(W('ship', 'people', 'its number', -0.1), 0.085)
soft(45, W('ship', 'approve', 'never merges', 0.6), 0.03, -0.4)
paper(W('ship', 'approve', 'recommends', -0.7), 0.03, 0.4)
knock(END('ship', 'approve', 0.5), 0.04, -0.4); soft(52, END('ship', 'approve', 0.55), 0.03, -0.4)
# 8. The same words, four places: paper as the pull request folds away; a felt note for merged; notes as steps 7 and 8 light; paper for
#    the skill; a knock for each place it reads; a knock for each copy, a low note as three drift; the mark on the synth for the end card
bed('next', [EMAJ9, AMAJ9, CSM7], 0, cq('next', 'breath'))
paper(S0('next') + 0.9, 0.03, -0.3, 0.9)
soft(64, max(W('next', 'merged', 'merged'), S0('next') + 1.9), 0.03)
soft(59, S0('next') + 1.3, 0.024, 0.6); soft(64, S0('next') + 1.35, 0.024, 0.6)
cMd = G('next', 'metadata'); paper(cMd - 0.2, 0.03)
for i in range(3):
    knock(W('next', 'metadata', 'beyond it', i * 0.25), 0.026, 0.5 + i * 0.1)
for i in range(4):
    knock(W('next', 'award', 'four places', i * 0.25), 0.028, -0.4 + i * 0.25)
soft(49, W('next', 'award', 'three'), 0.035); soft(55, W('next', 'award', 'three', 0.15), 0.02)
Bn = G('next', 'breath')
apad(EMAJ9, Bn - 0.4, 7.0, 0.04); drone(28, Bn - 0.4, 7.0, 0.024)
mark(Bn + 0.8, 64, 0.08)
