# Who is it, really?: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette this film reserved in the module's list (/mnt/project-files/data-protection/palettes.md, 10 November 2026), in no other
# score: a crwth and a regal, both made here (music.py has neither).
#  - The crwth is the bowed lyre of Wales (played from the Middle Ages to about 1800, and again today from replicas): six gut strings
#    over a flat bridge, four bowed in pairs tuned an octave apart. Every note it bows sounds with its octave twin, two strings that must
#    agree, as the tally's two halves must match. Bowed softly, no vibrato, a few notes at a time, never a tune of its own tradition.
#  - The regal is the small organ of the 1500s whose beating reeds sit in short pipes: nasal and soft, the bellows drawn gently, no
#    tremulant; the gatekeeper's instrument (Monteverdi gave it to Charon, the ferryman who asks who would cross, in Orfeo, 1607). It
#    holds a few chords: under the opening, at a few chapter turns, where the story comes back, and under the end card.
#  - The mark: one note split into its two strings, the high one alone (the king's half, on the right) and the low one alone (the
#    commander's, on the left), then bowed together, G 3 and G 4 with the regal's G major, where the halves fit and where a request
#    proves who it is: twice in the opening, then four times (zero trust; Jin Bi's halves that matched; the tiger come back; the end).
#  - G major, tuned pure (just intonation from G, see hz()), with C major, D major, E minor and B minor, which are pure here too; E minor
#    for the problem (an order nobody gave, a token anyone could copy). A minor isn't pure here, so A is played only in D major.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story (film.json's "story": the two halves and the match), and after it only at a
#    chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice.
#  - Nothing trembles or pulses: no tremolo, no vibrato, no slides, no pulse (no chapter is urgent; the army on the march is a breath of
#    air and its torches, never a drum).
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: a card or a badge laid down (paper), a tag or a tick (a tap), a cross
#    or a coral slip (a low knock), a line drawn or something passing (a breath of air), the bamboo slips (a dry wooden clack).
# And everything stays low and soft, below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(257)  # this film's own randomness: the room and the bow

# ---- tuning: just intonation from G, so the notes of a chord are whole-number ratios of each other and nothing beats. G major (G B D),
# C major (C E G), D major (D F# A), E minor (E G B) and B minor (B D F#) are pure here; A minor (A C E) isn't, so A is played only in D
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (55, 195.998)  # G 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
E2, G2, B2, C3, D3, E3, Fs3, G3, A3, B3, C4, D4, E4, Fs4, G4, B4 = 40, 43, 47, 48, 50, 52, 54, 55, 57, 59, 60, 62, 64, 66, 67, 71

# ---- the levels: the crwth and the regal about as far under the voice as the module's other music (matched by loudness, not by
# peak); the effects about 12 dB under the music (FX scales them all)
CW, RG, FX = 0.06, 0.042, 1.4

# a small room round the players, ringing on for about a second and a quarter, and nothing much above 1.5 kHz. Its level is set by
# what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one, so `room` is its share), and a held note is set back to
# the level it had before the room (_held), so the room colours a note but never moves it
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.3)).astype(np.float32))(np.arange(int(1.3 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.02 * SR)] = 0; _IR /= _band(_IR)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room, a, b):
    """a held note in the room, at its own level: set back to the level it had before the room, measured over its body (a to b
    seconds, once it has come in and before it lets go). A note too short to have a body just goes into the room"""
    r = _room(s, room); i, j = int(a * SR), int(b * SR)
    if not room or j - i < int(0.3 * SR):
        return r
    return r * float(np.sqrt((s[i:j] ** 2).mean() / max(1e-12, (r[i:j] ** 2).mean())))
def _env(x, sec, att, rel):
    """come in over att (a soft bow, or the bellows), hold one level, let go over rel"""
    return np.where(x < sec, np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2,
                    np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2 * (x < sec + rel))

# ---- the crwth: a bowed gut string, its partials falling as 1/k, with the nasal ring of the small box (a hump near 320 Hz and another
# near 1.1 kHz) and little above 1.8 kHz; each note bowed with its octave twin (exactly twice its pitch, so the two never beat), unless
# one string sounds alone (twin=False: a half). A breath of the bow on the string under it, very soft
def _bowed(f, x, bright=1800):
    s = np.zeros(len(x))
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        s += k ** -1.0 / (1 + (fk / bright) ** 2) * (1 + 0.9 * np.exp(-((fk - 320) / 130) ** 2) + 0.55 * np.exp(-((fk - 1100) / 320) ** 2)) \
            * np.sin(2 * np.pi * fk * x + 0.7 * k)
    return s

def crwth(ms, a, b, g=1.0, att=0.22, rel=0.38, pan=0.0, room=0.3, twin=True):
    """the crwth: the notes ms bowed together, or one, from a to b; each with its octave twin above it unless twin is False"""
    ms = ms if isinstance(ms, (tuple, list)) else (ms,)
    sec = max(0.3, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n, dtype=np.float64) / SR; out = np.zeros(n)
    for m in ms:
        f = hz(m); out += _bowed(f, x)
        if twin:
            out += 0.62 * _bowed(2 * f, x)
    out *= _env(x, sec, att, rel)
    bow = filt(R1.standard_normal(n).astype(np.float32), 'band', (300, 1600)) * 0.012 * _env(x, sec, att * 0.6, rel * 0.6)
    s = filt(((out / max(1e-9, float(np.abs(out).max()))) + bow).astype(np.float32), 'low', 2200)
    put(_held(s, room, att, sec).astype(np.float32), a, g * CW, pan)

# ---- the regal: a beating reed in a short pipe, its partials those of a narrow pulse (some strong, some weak), the pipe's hump near
# 700 Hz, rolled off above 1.5 kHz; the bellows drawn gently: each reed speaks a moment after the one below it, holds, and stops
def _reed(f, x, d=0.29):
    s = np.zeros(len(x))
    for k in range(1, int(2200 // f) + 1):
        fk = f * k
        s += abs(np.sin(np.pi * k * d)) / k / (1 + (fk / 1500) ** 2) * (1 + 0.8 * np.exp(-((fk - 700) / 260) ** 2)) * np.sin(2 * np.pi * fk * x + 1.1 * k)
    return s

def regal(ms, a, b, g=1.0, att=0.5, rel=0.6, pan=0.0, room=0.32, stag=0.03):
    """the regal: the chord ms held from a to b, the lowest reed first"""
    sec = max(0.3, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n, dtype=np.float64) / SR; out = np.zeros(n)
    for i, m in enumerate(sorted(ms)):
        dd = stag * i; xi = np.maximum(0.0, x - dd)
        out += np.where(x < dd, 0.0, _env(xi, sec - dd, att, rel)) * _reed(hz(m), xi) * (1.0 if i == 0 else 0.8)
    s = filt((out / max(1e-9, float(np.abs(out).max()))).astype(np.float32), 'low', 2000)
    put(_held(s, room, att + stag * len(ms), sec).astype(np.float32), a, g * RG, pan)

def mark(t0, sec=2.8, g=1.0, chord=(G2, D3, B3), rg=0.9):
    """the halves bowed together: G 3 and G 4 on the crwth (G 3 with its twin), the regal's G major under them"""
    crwth((G3,), t0, t0 + sec, g, att=0.3, rel=0.7, pan=0.0)
    regal(chord, t0, t0 + sec + 0.2, rg, att=0.6, rel=0.8, pan=0.0)

# ---- soft sounds, all low-passed
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a cross, a pill landing, a coral slip"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.011, pan=0.0):
    """a muffled key, a light click: a tag, a tick"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.013, pan=0.0, sec=0.45):
    """a card, a badge or a sheet laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=1.0, g=0.008, pan=0.0, lo=140, hi=900):
    """something passing: a line drawn, a torch carried, a card sliding in: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def clack(s, g=0.014, pan=0.0):
    """the bamboo slips of an order: a dry wooden clack, and its echo off the next slip"""
    s_knock(s, g * FX, pan, 330); s_knock(s + 0.05, g * 0.5 * FX, pan, 410)
def scratch_(s, sec=1.0, g=0.006, pan=0.0):
    """a pen signing: a soft, low scratch that swells and fades"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 3.1 * x))), s, g * FX, pan)
def fires(s, sec, g=0.004, pan=0.0):
    """campfires far off: one soft, low texture that swells in and out"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 700))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)

# =============================================================================================================================
# 1. Two halves: the opening, under the regal and the crwth. China, about 2,300 years ago: E minor on the regal as the road comes up,
#    and a slow line on the crwth. The army on the border (its fires), days from the capital; a messenger's torch along the road. The
#    order to raise troops: the slips' clack as the messenger holds them out, C major; "Who sent it?" An army on the march for an order
#    nobody gave: B minor, low, and the torches' air. The commander in his tent, and the man who brings it: one long note. Something has
#    to change: E minor, into the pause
hw = lambda lid, word, off=0: W('halves', lid, word, off)
hc = lambda lid, off=0: G('halves', lid, off)
h0 = S0('halves')
regal((E3, G3, B3), h0 + 0.6, hc('travel', -0.5), 0.9, att=1.8, rel=1.2)
crwth((B3,), hc('china', 0.2), hc('china', 2.0), 0.75, att=0.5, rel=0.6, pan=-0.05)
crwth((E4,), hc('china', 2.0), hc('war', 0.6), 0.7, att=0.4, rel=0.7, pan=0.05)
P_arm = hw('war', 'armies')
fires(P_arm - 0.2, 5.5, 0.004, px(1290))
crwth((D4,), hc('war', 2.6), hc('war', 4.4), 0.62, att=0.4, rel=0.6, pan=0.0)
crwth((B3,), hc('war', 4.4), hc('travel', 0.4), 0.62, att=0.4, rel=0.9, pan=0.0)
P_msg = hw('travel', 'travel with')
air(P_msg, 2.4, 0.006, px(900), 160, 800)
clack(hc('raise', 0.1), 0.013, px(620))
tap(hc('raise', 0.5), 0.009, px(820))
regal((C3, G3, E4), hc('raise', -0.1), hc('forged', 1.2), 0.75, att=0.9, rel=0.8)
tap(hw('forged', 'a forged'), 0.01, px(820))
crwth((B3,), hw('forged', 'a forged', 0.5), hw('forged', 'a forged', 1.7), 0.6, att=0.35, rel=0.5, pan=0.1)
crwth((C4,), hw('forged', 'a forged', 1.7), hw('forged', 'a forged', 2.7), 0.58, att=0.3, rel=0.5, pan=0.1)
crwth((B3,), hw('forged', 'a forged', 2.7), hc('die', 0.2), 0.58, att=0.3, rel=0.9, pan=0.1)
P_die = hc('die')
regal((B2, Fs3, B3), P_die - 0.1, P_die + 5.4, 0.72, att=1.2, rel=1.0)
air(P_die + 0.2, 6.2, 0.006, px(760), 110, 600)
knock(hw('die', 'nobody gave'), 0.012, px(1000), 200)
P_sees = hc('sees')
crwth((E4,), P_sees + 0.3, P_sees + 3.0, 0.6, att=0.6, rel=0.8, pan=0.2)
tap(hw('sees', 'the man who brings'), 0.009, px(1180))
regal((E3, B3, E4), hc('change', -0.2), E('halves') + 0.4, 0.8, att=0.9, rel=1.2)

# 2. When the halves match: still the opening. The answer, a tally: G major on the regal; as the seam lights along the tiger's back, its
#    two strings bowed together (the whole tiger), and as the halves part, each string alone: the high one to the right (the king's
#    half), the low one to the left (the commander's). Two tags. The order's slips; the halves fit, and the mark: bowed together, with
#    the regal's G major; "A match". The commander trusts the match: a cross and a tick. The museum in Xi'an: C major, and the gold's
#    glow; the rule, a tick and the beacon's dot. The power stays with the king: D major as the light comes up round the capital, and
#    the torch. A request is an order too: the platform, the two requests; "Who sent it?". Under the title card, the mark again
mw = lambda lid, word, off=0: W('match', lid, word, off)
mc = lambda lid, off=0: G('match', lid, off)
m0 = S0('match')
regal((G2, D3, B3), m0 + 0.3, mc('keeps', -0.4), 0.85, att=1.6, rel=1.0)
P_cut = mw('tally', 'cut in two')
crwth((G3,), P_cut, P_cut + 1.6, 0.7, att=0.4, rel=0.5)
crwth((G4,), P_cut + 1.6, P_cut + 3.6, 0.62, att=0.3, rel=0.8, pan=0.4, twin=False)
crwth((G3,), P_cut + 2.6, P_cut + 4.6, 0.62, att=0.3, rel=0.8, pan=-0.4, twin=False)
tap(mw('keeps', 'right half', -0.2), 0.009, px(1010))
tap(mw('keeps', 'the commander takes', 0.1), 0.009, px(260))
clack(mc('counts', 0.2), 0.012, px(1790))
tap(mc('counts', 0.5), 0.008, px(1440))
P_fit = mw('counts', 'fit together')
air(P_fit - 0.3, 2.0, 0.006, px(900), 160, 800)
mark(P_fit + 1.5, 2.6, 0.85)
knock(P_fit + 1.6, 0.011, px(1380), 280)
knock(mw('needn', 'the messenger', 0.25), 0.011, px(160), 200)
tap(mw('needn', 'only the match', 0.25), 0.01, px(160))
P_mus = mc('museum', -0.2)
regal((C3, E3, G3), P_mus + 0.2, mc('museum', 4.2), 0.7, att=1.0, rel=1.0)
crwth((E4,), mw('museum', 'forty characters', 0.2), mw('museum', 'forty characters', 2.4), 0.55, att=0.5, rel=0.8, pan=0.0)
tap(mw('museum', 'carries', 0.9), 0.008, px(965))
paper(mc('fifty', 0.2), 0.011, px(370))
tap(mw('fifty', 'the halves must match', 0.1), 0.009, px(110))
knock(mw('beacon', 'a beacon fire', 0.1), 0.01, px(110), 280)
P_pow = mc('power')
regal((D3, Fs3, A3), P_pow + 0.2, P_pow + 4.4, 0.75, att=1.0, rel=1.0)
air(mw('power', 'however far', -0.3), 3.6, 0.006, px(700), 160, 800)
paper(mc('order', 0.1), 0.011, px(1470))
air(mw('order', 'read these records'), 1.0, 0.006, px(260), 200, 900)
air(mw('order', 'change that table'), 1.0, 0.006, px(260), 200, 900)
tap(mw('really', 'proves who sent it', 0.1), 0.009, px(820))
tap(mw('really', 'proves who sent it', 0.5), 0.009, px(820))
mark(mc('breath', 0.4), 3.4, 0.9, chord=(G2, B2, D3, G3))

# 3. Nothing trusted without proof. The turn, today: C major on the regal as Sam comes up. Sam's tag; the platform; its records; the
#    nightly job and its line; Jun's token, laid down, and the name it signs in with; the door open to the internet. The wall: drawn
#    round the network, the discs inside it and out, ticks for those inside, crosses outside; a stolen password slides in, and is
#    trusted. No request trusted for where it comes from: one note. Says who it is, proves it, what it may do, what's usual: a tap for
#    each; the least it needs; the next, and "Not allowed". Zero trust: a cross, a tick, and the mark, into the pause
tw = lambda lid, word, off=0: W('trust', lid, word, off)
tc = lambda lid, off=0: G('trust', lid, off)
t0 = S0('trust')
regal((C3, G3, E4), t0 + 0.4, tc('sam', 2.8), 0.7, att=0.9, rel=0.9)
tap(tc('sam', 0.5), 0.009, px(400))
paper(tc('sam', 0.8), 0.012, px(1470))
tap(tw('two', "the registrar's records"), 0.008, px(1250))
knock(tw('two', 'a job', -0.15), 0.01, px(840), 260)
air(tw('two', 'loads'), 0.8, 0.006, px(1030), 200, 900)
paper(tw('token', "Jun Park's personal token", -0.2), 0.012, px(850))
tap(tw('token', 'the job is Jun', 0.1), 0.009, px(1250))
air(tw('open', 'open to the internet', -0.1), 1.0, 0.006, px(1800), 200, 900)
air(tc('wall', 0.1), 1.8, 0.007, px(960), 140, 700)
paper(tc('wall', 0.6), 0.01, px(960), 0.9)
tap(tw('wall', 'was trusted', 0.05), 0.009, px(950))
knock(tw('wall', 'whoever was inside', 0.05), 0.009, px(960), 210)
air(tw('stolen', 'a stolen password'), 1.8, 0.006, px(1150), 180, 900)
tap(tw('stolen', 'inside the wall', 0.05), 0.009, px(970))
knock(tw('stolen', 'inside the wall', 0.45), 0.01, px(1200), 210)
crwth((E4,), tc('where', 0.4), tc('where', 2.6), 0.55, att=0.5, rel=0.8)
paper(tc('proves', 0.05), 0.012, px(380))
air(tw('proves', 'says who it is'), 1.0, 0.005, px(380), 250, 1000)
for word in ('says who it is', 'and proves it', 'what that identity may do', "what's usual for it"):
    tap(tw('proves', word, 0.15), 0.009, px(830))
knock(tc('least', 0.05), 0.01, px(1160), 280)
tap(tw('least', 'the next request', 0.65), 0.008, px(830))
knock(tw('least', 'the next request', 1.45), 0.01, px(830), 210)
knock(tw('least', 'the next request', 1.85), 0.011, px(1160), 230)
paper(tc('zero', 0.05), 0.011, px(960))
knock(tw('zero', 'not trusting no one', 0.05), 0.01, px(550), 210)
tap(tw('zero', 'trusting nothing without proof', 0.05), 0.01, px(550))
mark(tw('zero', 'trusting nothing without proof', 0.6), 2.6, 0.8)

# 4. Three kinds of who: three places, a soft tap each; a person, a workload, an agent, one note each on the crwth as each is named (D,
#    G, B: a G major chord, built one string at a time). The gear and the sphere; no one at the keyboard. Each gets a name of its own:
#    the three badges laid down. Never a person's name, twice; what each one does, under its own name
ww = lambda lid, word, off=0: W('who', lid, word, off)
wc = lambda lid, off=0: G('who', lid, off)
for i, x in enumerate((380, 1010, 1600)):
    tap(wc('three', 0.3 + i * 0.2), 0.007, px(x))
crwth((D4,), wc('person', 0.05), wc('person', 1.7), 0.5, att=0.3, rel=0.7, pan=px(380), twin=False)
crwth((G3,), wc('workload', 0.05), wc('workload', 1.7), 0.5, att=0.3, rel=0.7, pan=px(1010), twin=False)
crwth((B3,), wc('agent', 0.05), wc('agent', 1.7), 0.5, att=0.3, rel=0.7, pan=px(1600), twin=False)
tap(ww('person', 'Mei Tanaka', 0.05), 0.008, px(200))
tap(ww('person', 'or Jun', 0.05), 0.008, px(650))
knock(wc('workload', 0.25), 0.009, px(1010), 260)
tap(ww('workload', 'with no one', 0.05), 0.008, px(1010))
air(wc('agent', 0.2), 1.0, 0.005, px(1600), 200, 900)
tap(wc('agent', 0.85), 0.008, px(1600))
for i, x in enumerate((330, 960, 1590)):
    paper(wc('own', i * 0.25), 0.01, px(x))
tap(ww('own', 'a person who answers', 0.1), 0.008, px(960))
knock(ww('borrow', 'A job never', 0.05), 0.01, px(960), 210)
knock(ww('borrow', 'neither does an agent', 0.05), 0.01, px(1590), 210)
tap(wc('module', 0.35), 0.008, px(1590))
for i, x in enumerate((330, 960, 1590)):
    tap(wc('shows', 0.25 + i * 0.3), 0.008, px(x))

# 5. Rights from a role. What may each one do?: one note. The whole learner table; the forty-one, one soft texture as they come; the
#    lines to the table; nine who moved on and still could: E minor, low. Rights go to a role, never to a person: C major. The map's
#    three roles; the group: what its work needs, and no more. Join, and leave: the disc slides in and out; rights gone. Mei's to say:
#    the crwth's D strings bowed together, into the pause
rw = lambda lid, word, off=0: W('role', lid, word, off)
rc = lambda lid, off=0: G('role', lid, off)
tap(rc('next', 0.05), 0.008, px(960))
crwth((E4,), rc('next', 0.3), rc('next', 2.0), 0.5, att=0.3, rel=0.7, pan=0.0, twin=False)
paper(rw('fortyone', 'the whole learner table'), 0.011, px(1470))
P_41 = rw('fortyone', 'forty-one')
paper(P_41, 0.008, px(440), 1.9)
air(rw('fortyone', 'by name'), 1.0, 0.005, px(800), 200, 900)
tap(rw('fortyone', 'the whole learner table', 0.65), 0.008, px(1300))
regal((E2, B2, G3), rc('nine', 0.3), rc('nine', 2.9), 0.65, att=0.8, rel=0.9)
knock(rc('nine', 0.45), 0.01, px(1300), 200)
paper(rc('never', 0.05), 0.011, px(500))
regal((C3, G3, C4, E4), rc('never', 0.2), rc('never', 2.9), 0.65, att=0.8, rel=0.9)
tap(rc('map', 0.25), 0.008, px(1150))
for word, x in (('a data owner', 350), ('an analytics engineer', 960), ('a data steward', 1570)):
    paper(rw('map', word), 0.009, px(x))
paper(rc('group', 0.25), 0.01, px(960))
tap(rw('group', 'holding what', 0.25), 0.008, px(700)); tap(rw('group', 'holding what', 0.65), 0.008, px(700))
knock(rw('group', 'no more', 0.05), 0.01, px(700), 210)
air(rw('join', 'Join the group', -0.2), 1.1, 0.005, px(1600), 200, 900)
tap(rw('join', 'Join the group', 0.85), 0.008, px(1460))
air(rw('join', 'leave it'), 1.1, 0.005, px(1600), 200, 900)
knock(rw('join', "they're gone", 0.05), 0.011, px(1760), 230)
paper(rc('mei', 0.35), 0.01, px(550))
tap(rw('mei', "is Mei's to say", 0.05), 0.008, px(400))
crwth((D4,), rw('mei', "is Mei's to say", 0.7), rw('mei', "is Mei's to say", 3.4), 0.55, att=0.5, rel=0.9, pan=0.15)

# 6. Joining, moving, leaving. The turn: G major on the regal, voiced high and thin, as joiners, movers and leavers come up. HR's
#    records into the directory, the directory into the groups: nobody has to remember. A joiner's badge: an account, no access yet.
#    The agreement: six lines; signed (a pen), C major; signed every year, in a group only while it's current; an agent's owner signs.
#    A mover goes from the old group to the new; a leaver's account off. The job that runs as Jun: when he moves, it stops: E minor
gw = lambda lid, word, off=0: W('change', lid, word, off)
gc = lambda lid, off=0: G('change', lid, off)
g0 = S0('change')
regal((D3, G3, B3, G4), g0 + 0.4, gc('follow', 3.0), 0.6, att=0.9, rel=0.9)
for word, x in (('join', 420), ('move', 960), ('leave', 1500)):
    tap(gw('follow', word, 0.05), 0.008, px(x))
paper(gc('hr', 0.2), 0.01, px(960))
paper(gw('hr', "from HR's records"), 0.01, px(350))
air(gw('hr', "from HR's records", 0.3), 0.7, 0.005, px(620), 200, 900)
paper(gw('hr', "from HR's records", 0.9), 0.01, px(1570))
air(gw('hr', "from HR's records", 1.0), 0.7, 0.005, px(1300), 200, 900)
tap(gw('hr', 'nobody has to remember', 0.05), 0.009, px(960))
paper(gc('joiner', 0.05), 0.011, px(390))
tap(gw('joiner', 'on the first day', 0.05), 0.008, px(390))
knock(gw('joiner', 'no access yet', 0.05), 0.01, px(390), 220)
paper(gc('sign', 0.05), 0.011, px(1290))
P_signs = gw('every', 'signs it')
scratch_(P_signs, 1.2, 0.006, px(1500))
regal((C3, G3, E4), P_signs + 0.3, P_signs + 2.9, 0.62, att=0.8, rel=0.9)
tap(gw('every', 'every year', 0.05), 0.008, px(900))
tap(gw('every', 'only while', 0.05), 0.008, px(900))
knock(gc('agent', 0.05), 0.009, px(170), 260)
tap(gw('agent', 'its owner signs', 0.05), 0.008, px(400))
paper(gc('mover', 0.05), 0.01, px(440)); paper(gc('mover', 0.25), 0.01, px(1480))
air(gw('mover', 'leaves the old group', 0.2), 1.8, 0.006, px(960), 200, 900)
tap(gw('mover', 'join the new one', 0.05), 0.008, px(1360))
knock(gw('leaver', 'turned off', 0.05), 0.011, px(300), 200)
paper(gc('jun', 0.05), 0.011, px(830))
tap(gc('jun', 0.65), 0.008, px(835))
air(gw('jun', 'when he moves'), 1.4, 0.005, px(1300), 200, 900)
knock(gw('jun', 'it stops', 0.05), 0.011, px(612), 210)
knock(gw('jun', 'or goes on', 0.05), 0.009, px(560), 230)
regal((E3, G3, B3), gw('jun', 'it stops', 0.3), E('change') - 0.2, 0.65, att=0.9, rel=1.0)

# 7. Think like an attacker. Sam, thinking like one; the four questions, a tap as each is asked; being someone else. The tallies had
#    that weak spot: the halves apart, the high string, then the low. Handan under siege: E minor, low, and its fires. Wei's court; the
#    king's half taken. At the camp, the halves fitted, and they matched: the mark. Jin Bi's doubt: one note; he was killed: E minor,
#    low. The army marched, by an order the king never gave. What a match proves: a tick, two crosses; Jin Bi's doubt kept, a question
#    at a time; the least it needs. A copy of Jun's token is Jun: the copy slides out, both lines, and E minor into the pause
aw = lambda lid, word, off=0: W('attacker', lid, word, off)
ac = lambda lid, off=0: G('attacker', lid, off)
tap(ac('before', 0.65), 0.009, px(400))
paper(ac('four', -0.2), 0.011, px(1290))
for lid, word in (('four', 'what are we working on?'), ('four', 'What can go wrong?'), ('do', 'What are we going to do about it?'), ('do', 'did we do a good enough job?')):
    tap(aw(lid, word, 0.05), 0.008, px(900))
knock(aw('trick', 'being someone else', 0.05), 0.01, px(1300), 210)
P_tal = ac('tallies')
crwth((G4,), P_tal + 0.3, P_tal + 1.9, 0.55, att=0.3, rel=0.7, pan=0.4, twin=False)
crwth((G3,), P_tal + 1.3, P_tal + 2.9, 0.55, att=0.3, rel=0.7, pan=-0.4, twin=False)
P_sg = ac('siege', -0.2)
regal((E2, B2, G3), P_sg + 0.3, P_sg + 4.6, 0.7, att=1.2, rel=1.1)
fires(P_sg + 0.2, 6.0, 0.004, px(1000))
tap(ac('wait', 0.35), 0.008, px(450))
tap(aw('wait', 'told it to wait', 0.05), 0.008, px(900))
tap(ac('wait', 1.05), 0.008, px(1240))
tap(ac('prince', 0.25), 0.008, px(450))
knock(aw('prince', "had the king's half taken", 0.6), 0.009, px(1240), 320)
P_mt = aw('fitted', 'they matched')
air(ac('fitted', 0.8), 2.2, 0.005, px(900), 160, 800)
mark(P_mt, 2.6, 0.8, chord=(G2, D3, G3, B3))
knock(P_mt + 0.1, 0.01, px(1380), 280)
tap(ac('doubt', 0.25), 0.008, px(300))
tap(aw('doubt', 'one man in a single chariot', 0.05), 0.008, px(1200))
crwth((E4,), aw('doubt', 'one man in a single chariot', 0.3), aw('doubt', 'one man in a single chariot', 2.6), 0.52, att=0.5, rel=0.8, pan=0.2, twin=False)
regal((E2, B2, E3), ac('killed', 0.3), ac('killed', 2.9), 0.62, att=0.8, rel=1.0)
P_mch = aw('killed', 'the army marched')
air(P_mch, 4.4, 0.006, px(700), 110, 600)
knock(aw('killed', 'an order the king never gave', 0.05), 0.01, px(400), 200)
paper(ac('proof', 0.05), 0.011, px(460))
tap(aw('proof', 'someone holds the half', 0.05), 0.008, px(130))
knock(aw('proof', 'not who they are', 0.05), 0.009, px(130), 210)
knock(aw('proof', 'or that the king sent them', 0.05), 0.009, px(130), 210)
paper(ac('keeps', 0.05), 0.011, px(1380))
for word in ('who is it', 'from where', 'on which device', 'asking for what', 'is that usual?'):
    tap(aw('keeps', word, 0.05), 0.007, px(970))
knock(aw('least', 'a proof can be stolen', 1.05), 0.01, px(1380), 280)
paper(ac('copy', 0.05), 0.011, px(700))
P_cp = aw('copy', "a copy of Jun's token")
air(P_cp, 1.0, 0.006, px(700), 200, 900)
air(P_cp + 1.1, 0.6, 0.005, px(1140), 200, 900)
tap(ac('copy', 1.05), 0.008, px(1500))
tap(aw('copy', 'is Jun', 0.05), 0.008, px(1500))
knock(aw('copy', 'is Jun', 0.35), 0.01, px(900), 210)
regal((E3, G3, B3, E4), aw('copy', 'is Jun', 0.6), E('attacker') - 0.2, 0.62, att=0.9, rel=1.0)

# 8. A name of its own. What are we going to do about it?: the four questions again, C major, and the third one lit. The job's badge:
#    its name read; owned by Sam; the loader role, what it may do and not; Mei agrees before its first sign-in: D major. Most security
#    starts here: the card, and three pills. The tiger, come back: the mark. Every request says who it is and gets the least it needs:
#    a tap for each, a tick for each, and the pill. Not yet: the badge, Jun's token still signing in, E minor, low; next, No secret to
#    lose. Under the end card, the mark once more, held to the end
ow = lambda lid, word, off=0: W('own', lid, word, off)
oc = lambda lid, off=0: G('own', lid, off)
o0 = S0('own')
paper(o0 + 0.6, 0.011, px(960))
regal((C3, E3, G3, C4), o0 + 0.6, ow('name', 'The nightly job', -0.5), 0.6, att=0.8, rel=0.8)
tap(o0 + 1.25, 0.008, px(600))
P_job = ow('name', 'The nightly job')
paper(P_job, 0.012, px(940))
air(ow('name', 'registrar-loader'), 1.2, 0.005, px(940), 250, 1000)
tap(ow('name', 'registrar-loader', 0.1), 0.009, px(1000))
tap(oc('owns', 0.05), 0.008, px(1000))
tap(oc('role', 0.05), 0.008, px(1000))
paper(oc('role', 0.6), 0.01, px(1580))
for word in ("read the registrar's nightly files", "write the registrar's tables"):
    tap(ow('may', word, 0.05), 0.008, px(1330))
knock(ow('may', 'nothing in any other area', 0.05), 0.01, px(1330), 210)
P_bef = ow('agrees', 'before the job ever signs in')
tap(P_bef + 0.05, 0.009, px(940))
regal((D3, Fs3, A3, D4), P_bef + 0.3, P_bef + 2.9, 0.6, att=0.8, rel=0.9)
paper(oc('nist', 0.05), 0.012, px(960))
for word in ('known', 'checked', 'given the least it needs'):
    knock(ow('nist', word, 0.05), 0.008, px(700), 300)
mark(oc('tiger', 0.4), 3.2, 0.8, chord=(G2, B2, D3, B3))
for i in range(3):
    tap(oc('every', 0.35 + i * 0.3), 0.007, px(500))
for i in range(3):
    tap(ow('every', 'get the least it needs', 0.05 + i * 0.25), 0.008, px(1200))
knock(ow('every', 'get the least it needs', 0.85), 0.01, px(960), 280)
paper(oc('notyet', 0.05), 0.012, px(550))
P_tok = ow('notyet', "with Jun's token")
paper(P_tok, 0.01, px(1270))
air(P_tok + 0.3, 0.6, 0.005, px(900), 200, 900)
regal((E2, B2, G3), P_tok + 0.4, P_tok + 2.8, 0.58, att=0.8, rel=0.9)
tap(P_tok + 1.65, 0.008, px(1270))
mark(oc('breath', 0.5), E('own') - oc('breath', 0.5) - 1.2, 0.85, chord=(G2, D3, G3, B3, D4))
