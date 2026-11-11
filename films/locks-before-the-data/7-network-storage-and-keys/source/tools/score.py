# Network, storage and keys: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 5 November 2026 against every score.py on main and on every branch, and against the module's other films
# (/mnt/project-files/data-protection/palettes.md): slap tubes and a bass flute, both made here (music.py has neither).
#  - Slap tubes: plain plastic water pipes, each cut to the length of one note, struck at the open end with a soft paddle. While the
#    paddle covers the mouth the pipe is stopped at that end, so it sounds its odd partials: a short, round, low pop at the pipe's own
#    pitch, nothing ringing on. Each pipe is a channel, and a note comes only where a pipe is struck at its mouth, as water was drawn
#    only at the tank: where water is drawn in Rome (at the tank for the basins, the baths and the houses; and, in D minor, at the holes
#    along the way), and in the hall where something is let through or shut. A few notes at a time, never a figure again and again.
#  - The bass flute: low and breathy, one voice, no vibrato, air through a long pipe. Held only under the opening, at the one door
#    switched on (Jun's hour at the storage), and at the end.
#  - F major for the city's water and the university; D minor for the holes in the channels (the opening's problem), and for the ways
#    around the catalog.
# The rules the module keeps (its briefs, 5 November 2026, as the governance and agent films did):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than
#    half its length, or for 12 seconds without a break. Rome's problem ends in silence: the flute stops as the basins run dry, and
#    "Nobody can say who draws what. The water has to go where it's owed, and someone has to know where it goes." has no music.
#  - Nothing trembles, pulses or beats: each note is one voice held steady, the partials are harmonic, and every note is tuned pure (just
#    intonation from D, see hz()), so F major and D minor are pure. No urgent pulse.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
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
def END(sid, lid):
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(97)  # this film's own randomness: the room, the breath, the smack of the paddle

# ---- tuning: just intonation from D, so the notes of a chord are whole-number ratios of each other and nothing beats. F major (F A C)
# and D minor (D F A) are pure in this table, and D with C (9/5) too
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
A2, C3, D3, F3, A3, C4, D4, F4 = 45, 48, 50, 53, 57, 60, 62, 65

# ---- the levels: the flute about as far under the voice as the series' other music (matched by loudness, not by peak), the pipes'
# pops a little under it at their loudest; the effects about 12 dB under the music (FX scales them all)
FL, SL, FX = 0.045, 0.069, 1.8

# a room round the players: small and dry, ringing on for about a second and a half, and nothing much above 1.6 kHz. Its level is set
# by what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own level after
# it (_held), as the video guidelines ask
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.5)).astype(np.float32))(np.arange(int(1.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(sig, amt):
    """a held note in the room, at its own level: the room's echoes meet a held note's own sound at its pitch, adding to it on one
    note and taking from it on another, so the note is set back to the level it had without the room, where it's held (within 3 dB
    of its own level, after its first quarter second), as tools/quiet.py measures it"""
    out = _room(sig, amt); h = SR // 100; k = len(sig) // h
    if not amt or k < 35:
        return out
    dry = (sig[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1); wet = (out[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1)
    lv = np.convolve(dry, np.ones(10) / 10, 'same')[25:]; on = np.nonzero(lv >= lv.max() * 10 ** -0.3)[0] + 25
    return out * np.float32(np.sqrt(dry[on].sum() / max(1e-12, wet[on].sum())))

# ---- the slap tubes: a pipe stopped at one end by the paddle sounds its odd partials (1, 3, 5, 7), each dying away faster than the one
# under it; the low pipes ring about a fifth of a second, the higher ones less. The paddle's meeting with the mouth: a dull smack of a
# few milliseconds, under 1.5 kHz. Nothing rings on, and nothing bends: each pop holds its pitch
_SLAP = ((1, 1.0), (3, 0.26), (5, 0.09), (7, 0.035))
def slap(m, a, g=1.0, pan=0.0, room=0.14):
    """one pipe, struck at its mouth at a"""
    f = hz(m); tau = 0.17 * (KEY[1] / f) ** 0.5; sec = min(1.1, 7 * tau + 0.05); n = int(sec * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k, ak in _SLAP:
        if f * k < 2300:
            s += ak * np.exp(-x * (1 + 0.6 * (k - 1)) / tau) * np.sin(2 * np.pi * f * k * x)
    s *= np.minimum(1.0, x / 0.002)
    m_ = int(0.04 * SR); sm = filt(R1.standard_normal(m_).astype(np.float32), 'band', (160, 1500)) * np.exp(-np.arange(m_) / SR / 0.005)
    s[:m_] += 0.22 * sm / max(1e-9, float(np.abs(sm).max()))
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2200)
    put(_held(s, room).astype(np.float32), a, g * SL, pan)

def slaps(a, notes, step, g=0.9, pan=0.0, fall=0.9):
    """a few pipes struck one after another, step apart (a list of steps for uneven ones), each a little softer than the one before"""
    t = a
    for i, m in enumerate(notes):
        slap(m, t, g * fall ** i, pan)
        if i + 1 < len(notes):
            t += step[i] if isinstance(step, (list, tuple)) else step

# ---- the bass flute: a low flute's tone, its fundamental strong and its upper partials weak, each partial speaking a moment after the one
# under it as the tone fills; steady while held, no vibrato. Its breath: air through the pipe, a band of noise round the note, steady,
# and a little more as the note starts (the chiff)
_BFL = (1.0, 0.3, 0.13, 0.055, 0.025, 0.012)
def bfl(m, a, b, g=1.0, att=0.35, rel=0.45, pan=-0.1, room=0.3, breath=0.06):
    """the bass flute, from a to b"""
    f = hz(m); sec = max(0.4, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    off = np.where(x < sec, 1.0, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2 * (x < sec + rel))
    for k, ak in enumerate(_BFL, 1):
        if f * k < 2300:
            on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.3 * (k - 1))), 1)) ** 2
            s += ak * on * np.sin(2 * np.pi * f * k * x + 0.7 * k)
    s *= off
    nz = filt(R1.standard_normal(n).astype(np.float32), 'band', (max(90.0, f * 0.8), min(1900.0, f * 5.0))).astype(np.float64)
    nz /= max(1e-9, float(nz.std()))
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2 * off
    s += breath * nz * e * (1 + 1.6 * np.exp(-x / 0.07))
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2300)
    put(_held(s, room).astype(np.float32), a, g * FL, pan)

def blong(m, a, b, g=1.0, pan=-0.1, most=6.0):
    """a long note: the flute takes a breath about every six seconds and goes on"""
    t = a
    while b - t > most + 1.0:
        bfl(m, t, t + most, g, pan=pan); t += most + 0.45
    bfl(m, t, b, g, pan=pan)

# ---- soft sounds in the places, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a tablet, a lock's bolt"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled click: a switch, a key"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.018, pan=0.0, sec=0.45):
    """a card or a page laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def stamp(s, g=0.018, pan=0.0):
    """a stamp pressed onto bronze, a mark onto a card: a dull, soft press"""
    s_knock(s, g * FX, pan, 170); s_tap(s + 0.006, g * 0.45 * FX, pan)
def strike(s, g=0.01, pan=0.0, sec=0.55):
    """a card struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def air(s, sec=0.8, g=0.01, pan=0.0, lo=140, hi=900):
    """something passing, a line of light drawn: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def water(s, sec=1.6, g=0.008, pan=0.0):
    """water running into a jar or a basin: a low, soft wash that swells in and out"""
    s_air(s, sec, g * FX, pan, 160, 700)
def stone(s, g=0.016, pan=0.0):
    """a stone set into a hole in the channel: a low, dull knock"""
    s_knock(s, g * FX, pan, 150)

# =============================================================================================================================
# 1. Holes in the channels: the opening, under the bass flute. The hills at dawn and the arches to the city: F, held. The tank: A; its
#    pipes carry the water on, and a pipe is struck for each use as it fills (the basins, the baths, the houses); the grant tied on.
#    Frontinus: C, as he takes the office. He measures: the card of ten thousand more, two pipes falling, and the flute turns to D minor.
#    The holes along the channel, each struck as it opens; the water-man's jar fills; the garden's pipe. The street: the secret pipes
#    bored up into the shops, three pipes struck, falling. "Only a little": the flute low on D; as the basins stop, it stops too, and
#    "Nobody can say who draws what. The water has to go where it's owed, and someone has to know where it goes." has no music
hw = lambda lid, word, off=0: W('holes', lid, word, off)
hc = lambda lid, off=0: G('holes', lid, off)
h0 = S0('holes')
blong(F3, h0 + 0.6, hc('tanks', -0.5), 0.9)
water(hw('aqueducts', 'under the ground', 0.2), 2.4, 0.007, px(900))
# the tank: A; a pipe for each use as it fills
blong(A3, hc('tanks', 0.1), hc('frontinus', -0.5), 0.85)
slap(F3, hw('uses', 'public basins', 0.15), 0.8, px(1500))
slap(A3, hw('uses', 'to baths', 0.15), 0.75, px(1600))
slap(C4, hw('uses', 'to houses', 0.1), 0.72, px(1700))
knock(hw('uses', 'a grant from the emperor', 0.3), 0.014, px(1310), 200)
# Frontinus takes the office: C
blong(C4, hc('frontinus', 0.0), hc('measures', 0.2), 0.8)
# he measures: ten thousand more than the records give out; two pipes falling, and D minor
P_more = hw('measures', 'ten thousand')
slaps(P_more + 0.05, (D4, A3), 0.35, 0.8, px(1500))
blong(D4, hc('measures', 0.5), hc('drawn', -0.6), 0.75)
# the holes along the channel, each struck as it opens; the water-man fills his jar at one
blong(A3, hc('drawn', 0.0), hc('pavements', -0.5), 0.8)
slaps(hc('drawn', 0.3), (D3, F3), 0.7, 0.85, px(900))
water(hw('watermen', 'divert it', 0.4), 2.2, 0.008, px(560))
slap(A2, hw('gardens', 'tap the channels', -0.2), 0.85, px(1120))
# the street: three secret pipes bored up into the shops from the main, struck as each reaches its shop
blong(F3, hc('pavements', 0.0), hc('little', -0.2), 0.8)
P_sec = hw('pavements', 'secret pipes')
slaps(P_sec + 0.95, (A3, F3, D3), 0.45, 0.8, px(700))
# only a little reaches the basins: the flute low on D; the basin runs dry, and the flute with it
bfl(D3, hw('little', 'only a little', 0.2), hc('stop', 1.4), 0.85)
knock(hc('nobody', 0.1), 0.012, px(820))

# 2. Only at the tank: the flute back on F as Frontinus holds the city to its rules. The holes closed, a stone in each. The bronze nozzle
#    at the tank: three pipes rise, F A C, the right way to draw; the stamp pressed; the grant laid with the records. The branch pipes
#    lifted out and the lead piled up, a few dull knocks. The gangs at the shaft: C, the two records laid down. "The
#    supply almost doubled": four pipes rising, and A held. The basin brims and the woman's jar fills: C. The shopkeeper draws by grant
#    at the tank: one pipe, F, and the flute home on F. The hall: the catalog is the tank, a pipe as its line reaches the files; its
#    three checks light, three pipes. "A hole in the channel": D, low, as the coral line runs round it. The title: F, and two pipes
tw = lambda lid, word, off=0: W('tank', lid, word, off)
tc = lambda lid, off=0: G('tank', lid, off)
t0 = S0('tank')
blong(F3, tc('rules', 0.0), tc('grant', -0.6), 0.85)
for i in range(3):
    stone(tc('none', 0.6 + 0.5 * i), 0.015, px((640, 1120, 1480)[i]))
P_noz = tw('grant', 'bronze nozzle')
blong(A3, tc('grant', 0.0), tc('lead', -0.3), 0.8)
slaps(P_noz + 0.1, (F3, A3, C4), 0.32, 0.8, px(1380))
stamp(tw('grant', 'stamped', 0.15), 0.016, px(1380))
paper(tc('records', 0.35), 0.014, px(760))
P_out = tw('lead', 'come out')
for i in range(4):
    knock(P_out + 0.8 + 0.7 * i, 0.010, px(820), 140)
paper(tw('lead', 'estimates the theft'), 0.012, px(1480))
blong(C4, tc('gangs', 0.0), tc('doubled', -0.2), 0.75)
paper(tw('written', 'the day before'), 0.014, px(780)); paper(tw('written', 'what each did'), 0.014, px(1380))
slaps(tc('doubled', 0.3), (F3, A3, C4, F4), 0.26, 0.8, px(500))
blong(A3, tc('doubled', 0.6), tc('people', -0.4), 0.8)
water(tw('people', 'ran for the people', 0.0), 2.4, 0.008, px(1560))
bfl(C4, tc('people', 0.0), tc('care', -0.3), 0.75)
P_care = tc('care', 0.4)
slap(F3, P_care, 0.8, px(1640)); water(P_care + 0.1, 1.8, 0.007, px(1640))
bfl(F3, tc('care', 0.6), tc('files', -0.4), 0.8)
# the hall: the catalog is the tank; a pipe as its line reaches the files; its checks light, one pipe each
P_cat = tw('files', 'its catalog is the tank')
bfl(A3, tc('files', 0.3), tc('hole', -0.3), 0.75)
slap(A3, P_cat + 0.6, 0.7, px(1000))
slaps(tc('draw', 0.6), (C4, D4, F4), 0.4, 0.7, px(640))
# every way around it is a hole in the channel: D, low, as the coral line runs round
P_hole = tw('hole', 'a hole in the channel')
slap(D3, P_hole + 0.2, 0.85, px(700))
bfl(D3, P_hole - 0.1, tc('breath', -0.2), 0.75)
# the title: F, and two pipes as the mark is drawn
P_tit = tc('breath')
bfl(F3, P_tit + 0.2, E('tank') - 0.6, 0.8)
slaps(P_tit + 0.7, (F3, C4), 0.45, 0.65, 0.0)

# 3. Nine ways around: no music at the turn but the rooms. The three workspaces, a pipe each as it lights, F A C. The storage's
#    containers, a breath of air; the catalog's line to the files. The two keys and the link, set down; the coral line to the storage;
#    the six people's badges, a few soft clicks. "Not one asks the catalog": two low pipes, D and A, falling. The files' card. The
#    doors on the internet, air. "Nobody did anything wrong": three pipes, C A F, settling
aw = lambda lid, word, off=0: W('around', lid, word, off)
ac = lambda lid, off=0: G('around', lid, off)
slaps(aw('platform', 'development', 0.05), (F3, A3, C4), [aw('platform', 'test', 0.05) - aw('platform', 'development', 0.05),
      aw('platform', 'production', 0.05) - aw('platform', 'test', 0.05)], 0.7, px(900))
air(aw('storage', 'a container for each area'), 1.0, 0.007, px(1675))
air(aw('only', 'the only way', 0.1), 0.8, 0.006, px(1200))
P_k1 = aw('keys', 'Two account keys')
knock(P_k1 + 0.05, 0.012, px(260)); knock(P_k1 + 0.65, 0.012, px(260))
air(P_k1 + 0.9, 1.6, 0.006, px(500))
knock(aw('link', 'A link signed', 0.05), 0.012, px(310))
P_six = aw('six', 'Six people')
for i in range(3):
    tap(P_six + 0.1 + 0.32 * i, 0.008, px(120 + 190 * i))
slaps(aw('nine', 'not one asks', 0.1), (D3, A2), 0.42, 0.75, px(500))
paper(aw('rows', 'no grant', -0.2), 0.012, px(1680))
air(aw('internet', 'a door on the internet', -0.2), 1.4, 0.007, px(1300))
slaps(aw('wrong', 'the quickest way', 0.35), (C4, A3, F3), 0.4, 0.6, px(1060))

# 4. Doors in, a short list out: the ways leave on a breath of air. The private doors drawn from each workspace: three pipes, C D F, as
#    they reach the network. People and jobs on the private path, air. The machines and the build service, a click each. The IP list's
#    card. Public access switched off, a click; the three doors on the internet shut, three pipes falling, A F C. The ways out: the
#    serverless cloud, the open lines; a table sent off, air. The network policy's card; its short list, two clicks; dry run's crosses,
#    a stroke. "Then it's on": the open lines cut, two pipes, F and C
pw = lambda lid, word, off=0: W('paths', lid, word, off)
pc = lambda lid, off=0: G('paths', lid, off)
air(S0('paths') + 0.1, 0.9, 0.006, px(300))
P_in = pw('endpoint', 'a door inside')
slaps(P_in + 0.5, (C4, D4, F4), 0.35, 0.65, px(640))
air(pw('path', 'a private path', 0.2), 1.6, 0.006, px(600))
tap(pw('machines', 'The machines', 0.5), 0.008, px(205)); tap(pw('machines', 'the build service', 0.5), 0.008, px(491))
paper(pw('list', 'an IP access list'), 0.012, px(340))
P_off = pw('off', 'switches public access off')
paper(P_off, 0.01, px(340)); tap(P_off + 1.0, 0.012, px(130))
slaps(pc('nodoor', 0.3), (A3, F3, C3), 0.35, 0.75, px(1300))
air(pw('serverless', 'reach anywhere', 0.1), 1.3, 0.007, px(1400))
air(pw('send', 'send a table', 0.2), 2.0, 0.006, px(1100))
paper(pw('policy', 'a network policy'), 0.012, px(340))
tap(pw('policy', "the catalog's own storage", 0.3), 0.008, px(1500)); tap(pw('policy', 'a short list', 0.3), 0.008, px(1500))
strike(pw('dry', 'what it would have blocked', 0.1), 0.008, px(1500))
slaps(pw('on', 'places on the list', 0.4), (F3, C4), 0.4, 0.65, px(1400))

# 5. One identity at the files: the storage's own door on the internet shut, one low pipe, C. Its pages: the private endpoints approved,
#    two clicks. Its account keys switched off, a click; the two keys and the link refused, three pipes falling, A F D, and a stroke
#    through each. The six roles go, air; the six through the catalog, a click on the green line. The catalog's own identity on the
#    files: one pipe, C, as its tag comes. The storage credential and the external locations: air along their lines. Every read through
#    the catalog: its checks light, C, then D and F. Rome's tank in its frame: two pipes, A and F
fw = lambda lid, word, off=0: W('files', lid, word, off)
fc = lambda lid, off=0: G('files', lid, off)
air(S0('files') + 0.2, 0.8, 0.005, px(1400))
P_pub = fw('public', 'public access off')
slap(C3, P_pub + 0.35, 0.8, px(1675))
tap(fw('public', 'its own private endpoints'), 0.008, px(1600)); tap(fw('public', 'its own private endpoints', 0.3), 0.008, px(1600))
P_ko = fw('keysoff', 'its account keys')
tap(P_ko + 0.85, 0.012, px(1150))
P_no = fw('nothing', 'open nothing')
slaps(P_no + 0.05, (A3, F3, D3), 0.3, 0.75, px(260))
for i in range(3):
    strike(P_no + 0.1 + 0.3 * i, 0.007, px(260))
air(fw('roles', 'roles go', 0.4), 1.0, 0.006, px(330))
tap(fw('roles', 'through the catalog', 0.5), 0.009, px(630))
slap(C4, fw('one', 'its access connector', 0.1), 0.75, px(1250))
air(fw('credential', 'an external location', 0.1), 1.3, 0.006, px(1420))
slap(C4, fw('every', 'checks the grant'), 0.65, px(1220))
slaps(fw('every', 'the masks'), (D4, F4), fw('every', 'filters') - fw('every', 'the masks'), 0.6, px(1300))
slaps(fw('rome', "Rome's tanks", 0.1), (A3, F3), 0.42, 0.65, px(1500))

# 6. Each catalog in its own workspace: every workspace reaching every catalog, a breath of air as the lines are drawn; the catalogs'
#    cards. A notebook in development could read production's records: one low pipe, D, as the coral line lights. The binding's page,
#    and its switch; the crossing lines go. Production's catalogs bound to production alone, F; test's to test and development's to
#    development, A and C. The storage credential bound the same way, its card. "A catalog isn't there": two pipes, F and D, falling
ww = lambda lid, word, off=0: W('walls', lid, word, off)
wc = lambda lid, off=0: G('walls', lid, off)
air(S0('walls') + 0.2, 0.8, 0.005, px(400))
air(ww('default', 'every workspace reaches', 0.5), 1.8, 0.007, px(640))
paper(ww('default', 'every workspace reaches'), 0.01, px(320))
slap(D3, ww('dev', "production's real records", 0.05), 0.8, px(700))
P_b = ww('binds', 'binds each catalog')
paper(P_b, 0.01, px(1500)); tap(P_b + 0.75, 0.011, px(1180)); air(P_b + 0.6, 0.9, 0.006, px(640))
slap(F3, ww('five', 'production alone', 0.05), 0.7, px(640))
P_tt, P_dd = ww('others', "test's to test"), ww('others', "development's to development")
slap(A3, P_tt + 0.05, 0.65, px(640)); slap(C4, P_dd + 0.05, 0.62, px(640))
paper(ww('same', 'bound the same way'), 0.012, px(1440))
paper(ww('grant', "a grant isn't enough"), 0.012, px(1440))
slaps(ww('grant', "a catalog isn't there", 0.05), (F3, D3), 0.42, 0.7, px(900))

# 7. The door you switch on: the door, and its lock, a knock and a click. The nightly load stops: one low pipe, D. Jun. The group for
#    admin accounts, its card; no one in it. Jun switches his power on: the bass flute comes in, A, the one door switched on; Sam
#    approves, a mark pressed. Jun comes in by the private path, air along it; the door opens: C, while he reads that one file, until he
#    switches off. The storage's own log, its card; the alert, a soft knock. Had he forgotten: the hour runs out, and the lock clicks.
#    Like the gangs in Rome: written down before, recorded as it's done, two pages; two pipes, C and F
sw_ = lambda lid, word, off=0: W('switch', lid, word, off)
scq = lambda lid, off=0: G('switch', lid, off)
P_st = sw_('shut', 'it stays shut')
knock(sw_('shut', 'one more door', 0.2), 0.012, px(1424), 200); tap(P_st + 0.1, 0.012, px(1424))
slap(D3, sw_('morning', 'the nightly load stops', 0.05), 0.8, px(900))
paper(sw_('group', 'one group'), 0.012, px(1500))
P_on, P_ap = sw_('on', 'switches on'), sw_('on', 'Sam approves')
paper(P_on, 0.012, px(340))
bfl(A3, P_on + 0.2, P_ap - 0.2, 0.85, att=0.5)
stamp(P_ap + 0.1, 0.016, px(200))
P_pp, P_of = sw_('reads', 'the private path'), sw_('reads', 'switches off')
air(P_pp, 1.4, 0.007, px(1000))
tap(P_pp + 1.2, 0.011, px(1424))
bfl(C4, P_pp + 1.25, P_of + 0.3, 0.8, att=0.4)
tap(P_of + 0.1, 0.011, px(1424))
paper(sw_('log', 'own log'), 0.012, px(1500))
knock(sw_('log', 'an alert', 0.1), 0.010, px(1400), 300)
P_it = sw_('forgot', 'shut by itself')
air(P_it - 0.4, 1.6, 0.005, px(560)); tap(P_it + 1.2, 0.012, px(560))
paper(sw_('gangs', 'written down before'), 0.012, px(300)); paper(sw_('gangs', "recorded as it's done"), 0.012, px(1500))
slaps(sw_('gangs', "recorded as it's done", 0.3), (C4, F3), 0.42, 0.65, px(960))

# 8. The university's own key: the files' locks come on, a soft click; the cloud provider's keys, sealed, a card. The vault, and the
#    storage's key in it: two pipes, F and C, rising. The storage uses the key, a click along its line; the platform team can't delete
#    it, a card; a new version every year: one pipe, A, as the ring of light goes round. A deleted key kept ninety days, a card. The
#    workspace's key, a click. The security team takes it back: struck through; nobody can read the files: two low pipes, F and D
kw = lambda lid, word, off=0: W('key', lid, word, off)
kc = lambda lid, off=0: G('key', lid, off)
P_enc = kw('always', 'always encrypted')
tap(P_enc + 0.1, 0.01, px(1675)); paper(P_enc + 0.4, 0.012, px(340))
P_v = kw('own', 'a vault')
air(P_v - 0.4, 0.9, 0.006, px(1675))
slaps(P_v + 0.4, (F3, C4), 0.45, 0.7, px(1675))
tap(kw('use', 'use the key', 0.1), 0.01, px(1600)); paper(kw('use', 'use the key'), 0.011, px(340))
paper(kw('cant', "can't delete it"), 0.011, px(340))
slap(A3, kw('version', 'a new version', 0.35), 0.7, px(1675)); paper(kw('version', 'a new version'), 0.01, px(340))
paper(kw('deleted', 'kept ninety days'), 0.011, px(340))
tap(kw('workspace', 'notebooks', 0.4), 0.01, px(1600)); paper(kw('workspace', 'notebooks'), 0.011, px(340))
P_bk = kw('back', 'take the key back')
paper(P_bk, 0.011, px(340)); strike(P_bk + 0.4, 0.009, px(1675))
slaps(kw('nobody', 'nobody can read', 0.1), (F3, D3), 0.45, 0.75, px(1675))

# 9. Only through the catalog: Rome's tank once more, the nozzle stamped: one pipe, C; the gangs' work written down, a page. The hall:
#    "only through the catalog", its three checks, C D F; the private doors, the short list, the key, a soft knock as each is named.
#    "Switched on for a task, and watched": the bass flute, A, as the door glows. The end card: the flute home on F, after the voice
ew = lambda lid, word, off=0: W('end', lid, word, off)
ec = lambda lid, off=0: G('end', lid, off)
P_nz = ew('rome', 'a stamped nozzle')
slap(C4, P_nz + 0.1, 0.7, px(1380)); stamp(P_nz + 0.15, 0.012, px(1380))
paper(ew('rome', 'written down', 0.2), 0.011, px(760))
slaps(ew('uni', 'only through the catalog', 0.1), (C4, D4, F4), 0.36, 0.65, px(1265))
for w_, x_ in (('private doors', 330), ('a short list out', 1290), ('a key', 1440)):
    knock(ew('doors', w_, 0.1), 0.010, px(x_), 260)
P_sw = ew('one', 'switched on')
bfl(A3, P_sw + 0.05, ew('one', 'watched', 0.6), 0.8, att=0.45)
bfl(F3, ec('breath', -2.6), E('end') - 1.2, 0.85, att=0.9, rel=1.2)
