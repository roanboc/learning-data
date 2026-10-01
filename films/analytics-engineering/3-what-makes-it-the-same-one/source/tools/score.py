# What makes it the same one: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). This film's own palette (the series plan): E-flat major, with C minor for the look-alikes of the past;
# low divided strings for the bed; a low bassoon line for 1880s Paris; and the series' mark, 1-4-5-8, on a vibraphone played with
# soft mallets, motor off, in a low register, at the title and the end.
# Two rules, as in film 1:
#  - Nothing loops. No pulse, walking bass, repeated figure or random notes: the bed is sustained chords that change with the
#    chapters, and the bassoon plays one line, once.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# Everything stays low and soft, filtered below about 2.5 kHz: wooden clicks, knocks, muffled keys, paper, low felt notes, thuds.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off

# ---- this film's instruments ----
def vibe(m, start, g=0.06, pan=0.0, sec=3.4):
    """a vibraphone, soft mallets, motor off: a pure bar tone with its fourth-octave partial, no bright attack"""
    f = mf(m); x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 0.75) + 0.16 * np.sin(2 * np.pi * f * 4.0 * x) * np.exp(-x * 4.5) + 0.05 * np.sin(2 * np.pi * f * 10 * x) * np.exp(-x * 14)
    s = s * np.minimum(1, x / 0.012)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g, pan)
def bassoon(m, start, sec, g=0.04, pan=-0.2):
    """a low bassoon: a reedy tone with its odd and even partials, darkened, with a slow breath in and out"""
    f = mf(m); x = tt(sec); vib = 1 + 0.003 * np.sin(2 * np.pi * 4.6 * x) * np.minimum(1, x / 0.8)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = sum(np.sin(k * ph) * w for k, w in ((1, 1), (2, 0.7), (3, 0.55), (4, 0.3), (5, 0.22), (6, 0.1)))
    s = s + 0.04 * filt(noise(sec), 'band', (300, 1200))
    put(norm(filt((s * env(sec, 0.12, min(0.6, sec * 0.4))).astype(np.float32), 'low', 1300)), start, g, pan)
# ---- soft sounds, all low-passed ----
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.04, pan=0.0):
    """a soft wooden knock, for a card or a key arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 220 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 480 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def click(s, g=0.035, pan=0.0):
    """brass calipers closing: a small wooden click, low and short"""
    x = tt(0.08); X(norm(filt((np.sin(2 * np.pi * 900 * x) * np.exp(-x * 120) + 0.5 * filt(noise(0.08), 'band', (500, 2000)) * np.exp(-x * 150)).astype(np.float32), 'low', 2200)), s, g, pan)
def tap(s, g=0.022, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.035, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def slide(s, g=0.04, pan=0.0, sec=0.7):
    """an oak drawer sliding: low rumbling noise, then a soft stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 900)) * np.sin(np.pi * x / sec) * (1 + 0.3 * np.sin(2 * np.pi * 22 * x)), s, g, pan); thud(s + sec * 0.9, g * 0.6)
def press(s, g=0.08):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.024):
    """a soft string swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'strings')
def run(t0, n, sec, g=0.018, pan=0.2):
    """a short muffled run of keys: a hash rolling out, once"""
    for k in range(n):
        tap(t0 + sec * k / n, g * (1 - 0.4 * k / n), pan)
def lines(t0, n, per, g=0.02, pan=-0.3):
    """one muffled key per line of code, as each line is typed"""
    for k in range(n):
        tap(t0 + k * per, g, pan)
def mark(start, root, g=0.075):
    """the series' four notes, 1-4-5-8, rising, on the vibraphone"""
    for i, iv in enumerate([0, 5, 7, 12]):
        vibe(root + iv, start + i * 0.38, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15, sec=4.2 if i == 3 else 3.0)
def bed(sid, chords, a=None, b=None, g=0.04, bassg=0.02):
    """the chapter's chords on low divided strings, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone='strings', bassg=bassg)

# chords (MIDI note numbers): E-flat major, and C minor for the past
EB = [39, 46, 51, 55, 58]; EBADD9 = [39, 46, 53, 55, 58]; AB = [44, 51, 55, 60]; ABM7 = [44, 51, 55, 58, 60]; BB = [46, 53, 58, 62]
CM = [36, 43, 48, 51, 55]; FM7 = [41, 48, 51, 56]; GSUS = [43, 50, 55, 60]; G7 = [43, 50, 53, 59]; CM9 = [36, 43, 50, 51, 55]; EBSUS = [39, 46, 51, 56, 58]

# 1. Look-alikes: C minor strings and one bassoon line for Paris; a click as the calipers close on each measure; the drawer slides;
#    paper for each Leavenworth card; low felt notes as the fingerprints draw; the title on the vibraphone, in E-flat
bed('west', [CM, ABM7, FM7, G7], 0, cq('west', 'breath'))
for k, (m, d) in enumerate([(48, 2.6), (51, 2.2), (50, 2.0), (46, 3.4)]):
    bassoon(m, S0('west') + 0.8 + sum(x[1] for x in [(48, 2.6), (51, 2.2), (50, 2.0), (46, 3.4)][:k]), d + 0.3, 0.032)
click(W('west', 'measure', 'Bertillon', -0.05), 0.035, -0.2)
click(W('west', 'measure', 'repeat', 0.4), 0.03, 0.1); paper(W('west', 'measure', 'repeat', -0.1), 0.025, -0.3, 0.9)
click(W('west', 'measure', 'measuring', -0.05), 0.035, 0.3)
slide(G('west', 'card', -0.6), 0.035, 0.4)
knock(W('west', 'card', 'filed', 0.9), 0.03, 0.4)
paper(G('west', 'story', 0.3), 0.03, -0.3); paper(G('west', 'story', 0.8), 0.03, 0.3)
soft(48, W('west', 'story', 'Fingerprints'), 0.035, -0.3); soft(51, W('west', 'story', 'Fingerprints', 0.5), 0.032, 0.3)
soft(43, G('west', 'bridge'), 0.035)
soft(51, W('west', 'bridge', 'Aisha'), 0.035)
bed('west', [EBADD9], cq('west', 'breath'), bassg=0.026)
mark(G('west', 'breath', 0.7), 51)
# 2. Three keys: E-flat; a felt note for her certificate; three knocks as the three keys lift out, panned by stream; a low note for "which learner?"
bed('three', [EB, AB, EBSUS, CM])
soft(58, W('three', 'aisha', 'graduate', -0.2), 0.032, 0.4)
for i, (lid, word) in enumerate([('keys', 'student ID'), ('keys', 'account'), ('typed', 'email')]):
    knock(W('three', lid, word), 0.04, -0.45 + i * 0.3)
soft(43, G('three', 'which', -0.2), 0.04, 0.2)
# 3. Profile first: a string swell as the agent arrives; a muffled key per line of the query; a knock for its result;
#    paper for each evidence card; a low note as the claim with no query greys out
bed('profile', [EB, BB, AB, EB])
swell([51, 58, 62, 65], G('profile', 'first', 0.8), 2.6, 0.02)
lines(G('profile', 'first', 1.6), 7, 0.43)
knock(W('profile', 'nulls', 'no student ID'), 0.035, -0.1)
paper(G('profile', 'shared', -0.1), 0.03, 0.4); paper(G('profile', 'orphans', -0.1), 0.03, 0.4)
paper(G('profile', 'guess', -0.7), 0.025, 0.4); soft(44, W('profile', 'guess', 'without'), 0.035, 0.3)
# 4. Key sets: paper as the seed lands; a knock as each prefix clips on; a felt note for "qualified"; keys for the macro's lines;
#    paper for the staging card; a soft tap as the dots fall away, a knock as the capitals drop
bed('sets', [EB, AB, BB, EB])
paper(S0('sets') + 0.4, 0.03, -0.4)
for i in range(3):
    knock(W('sets', 'set', 'short code', i * 0.35), 0.035, 0.1 + i * 0.12)
soft(58, W('sets', 'alike', 'Qualified'), 0.032, 0.4)
lines(W('sets', 'set', 'owner', 0.6), 4, 0.35)
paper(G('sets', 'case'), 0.03, -0.3)
tap(W('sets', 'case', 'spaces'), 0.025, 0.2); knock(W('sets', 'case', 'capitals'), 0.03, 0.2)
# 5. Rules, most trusted first: a knock as each rule's code and card land; three felt notes as Aisha's keys reach their rules;
#    a muffled key per result row; a swell as ninety keys fall into forty-six learners; paper for the rules in words; Mei's approval
bed('rules', [EB, AB, CM, BB, EB])
for lid in ['id', 'held', 'email', 'left']:
    knock(G('rules', lid, -0.15), 0.035, 0.3)
knock(G('rules', 'best', -0.35), 0.035, 0.3)
for i in range(3):
    soft([51, 55, 58][i], G('rules', 'aisha', 1.3 + 0.5 * i), 0.03, 0.4)
    tap(G('rules', 'aisha', 1.0 + 0.4 * i), 0.022, -0.3)
swell([51, 58, 63, 67], W('rules', 'aisha', 'ninety', -0.6), 3.4, 0.022)
knock(W('rules', 'aisha', 'ninety'), 0.03, -0.3); soft(55, W('rules', 'aisha', 'forty-six'), 0.035, -0.1)
paper(G('rules', 'owned', -0.1), 0.03, 0.3)
press(W('rules', 'owned', 'approved'), 0.07)
# 6. Keep them apart: a low felt note held as the look-alike is found; knocks for her account and the number it holds;
#    the rule lights; paper for the merge; a knock for the sixth credential; one muffled key per green tick; a low held note;
#    Mei's decision typed and stamped; the merge undoes with a rising note; keys for the code that keeps them apart
bed('apart', [CM, ABM7, FM7, EB, EB])
soft(39, S0('apart') + 0.6, 0.05); drone(39, S0('apart') + 0.6, 3.0, 0.016, 'strings')
knock(W('apart', 'other', 'platform account'), 0.035, 0.0); knock(W('apart', 'other', 'student ID field'), 0.035, 0.0)
soft(50, G('apart', 'merge', -0.1), 0.03, -0.1)
paper(W('apart', 'merge', 'merge them'), 0.03, -0.2, 0.8)
knock(W('apart', 'merge', 'six'), 0.04, -0.4)
for i in range(6):
    tap(W('apart', 'merge', 'every test', i * 0.25), 0.02, 0.5)
drone(36, W('apart', 'merge', 'every test'), 4.5, 0.02, 'strings')
lines(W('apart', 'decide', 'records'), 2, 0.6, 0.022, 0.1)
press(W('apart', 'decide', 'A person'), 0.08)
soft(51, W('apart', 'undo', 'merge undoes'), 0.035, -0.3); soft(58, W('apart', 'undo', 'merge undoes', 0.3), 0.03, -0.3)
knock(W('apart', 'undo', 'merge undoes', 0.3), 0.03, -0.4)
lines(W('apart', 'undo', 'code keeps'), 8, 0.2, 0.018, 0.0)
paper(W('apart', 'undo', 'test fails', -0.3), 0.03, 0.4)
# 7. The same hash everywhere: a short muffled run of keys as the hash rolls out; a knock and a dark note for the space;
#    paper for the macro, a knock for each step it names; the hash heals with a run and a rising note; felt notes for the two engines
bed('hash', [EB, BB, AB, EB])
run(W('hash', 'one', 'hashes', 0.5), 12, 1.0)
knock(W('hash', 'space', 'trailing space'), 0.035, -0.4); run(W('hash', 'space', 'trailing space', 0.5), 10, 1.0); soft(42, W('hash', 'space', 'trailing space', 0.4), 0.035, 0.1)
paper(G('hash', 'macro', -0.2), 0.03, 0.0); lines(G('hash', 'macro'), 5, 0.28, 0.018, 0.0)
for word in ['trims', 'upper case', 'marks a missing', 'joins']:
    knock(W('hash', 'macro', word), 0.028, -0.3)
run(W('hash', 'macro', 'joins', 0.9), 12, 1.0); soft(51, W('hash', 'macro', 'joins', 0.9), 0.03, 0.1); soft(58, W('hash', 'macro', 'joins', 1.4), 0.03, 0.1)
paper(G('hash', 'every', -0.3), 0.03, -0.3)
soft(55, W('hash', 'every', 'every engine', -0.2), 0.03, 0.3); soft(55, W('hash', 'every', 'every engine', 0.2), 0.03, 0.4)
knock(G('hash', 'beside', -0.2), 0.035, 0.3)
# 8. Codes, too: three knocks as the codes arrive, a swell as they fold into one meaning; paper for the map, keys for its lines;
#    Mei's office's approval; soft paper as the rows stack behind the key, a low note for the clock; the end on the vibraphone
bed('codes', [EB, AB, BB], 0, cq('codes', 'breath'))
for i in range(3):
    knock(W('codes', 'codes', 'same care', i * 0.4), 0.035, -0.5 + i * 0.25)
swell([51, 55, 58, 63], W('codes', 'codes', 'one meaning', -0.1), 2.4, 0.02); soft(55, W('codes', 'codes', 'studying', -0.1), 0.032, -0.3)
paper(G('codes', 'map', -0.3), 0.03, 0.4); lines(G('codes', 'map', -0.1), 9, 0.18, 0.016, 0.4)
paper(W('codes', 'map', "registrar's", -0.2), 0.025, 0.4); press(W('codes', 'map', 'approves'), 0.06)
for k in range(1, 5):
    paper(W('codes', 'next', 'many rows', k * 0.18 - 0.18), 0.02, 0.2, 0.3)
soft(44, W('codes', 'next', 'many versions'), 0.035, 0.4)
pad([39, 46, 51, 55, 58, 62], G('codes', 'breath'), 6.0, 0.04, 'strings'); drone(27, G('codes', 'breath'), 6.0, 0.026, 'strings')
mark(G('codes', 'breath', 0.8), 51, 0.08)
