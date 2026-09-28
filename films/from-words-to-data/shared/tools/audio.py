"""Mix the soundtrack: python tools/audio.py
Reads the film's timeline from dist/render.html (run tools/build.py first), lays each voiced line at its moment, plays the film's
own score (tools/score.py, written with the series' instruments in shared/tools/music.py), ducks the music under the voice,
and writes build/mix.wav and dist/soundtrack.mp3, loudness-normalised to -16 LUFS for the web. Then run tools/build.py again."""
import json, subprocess
import imageio_ffmpeg, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from lang import *
import music
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b, pg = render_page(p)
    info = pg.evaluate("filmInfo()")
    b.close()
json.dump(info, open(BUILD / 'timeline.json', 'w'))
SR = music.SR; TOT = info['total']; n = int(TOT * SR) + SR
music.init(n)
ST = {s['id']: s for s in info['scenes']}; music.ST.update(ST)
vo = np.zeros(n, np.float32)
for c in info['caps']:
    x, sr = sf.read(str(BUILD / 'vo' / ('%s__%s.wav' % (c['sid'], c['id']))), dtype='float32')
    x = resample_poly(x, 147, 80).astype(np.float32); i = int(c['s'] * SR); vo[i:i + len(x)] += x[:n - i]

# the score sees the instruments, and the film's timeline: G(chapter, cue, offset) is a cue's time in the film,
# S0(chapter) a chapter's start, E(chapter) its end, cq(chapter, cue) a cue's time inside its chapter
ns = {k: v for k, v in vars(music).items() if not k.startswith('_')}
ns.update(ST=ST, TOT=TOT, G=lambda sid, cid, off=0: ST[sid]['start'] + ST[sid]['cues'][cid] + off,
          S0=lambda sid: ST[sid]['start'], E=lambda sid: ST[sid]['start'] + ST[sid]['dur'], cq=lambda sid, cid: ST[sid]['cues'][cid])
exec(compile((ROOT / 'tools' / 'score.py').read_text(), str(ROOT / 'tools' / 'score.py'), 'exec'), ns)

# the music sits low under the voice (0.42) and lifts about 4 dB when the voice rests (0.67). It goes down in 0.4 s, just before a line,
# and comes back up over 1.2 s, starting 0.9 s after the line, so short pauses keep it down instead of making it pump
t = np.arange(n, dtype=np.float32) / SR; CR = 100; DK, LF = 0.42, 0.67; tg = np.full(int(TOT * CR) + CR, LF, np.float32)
for c in info['caps']:
    tg[int(max(0, c['s'] - 0.45) * CR):int((c['e'] + 0.9) * CR)] = DK
dk = np.empty_like(tg); v = LF
for i, x in enumerate(tg):
    v = max(x, v - (LF - DK) / (0.4 * CR)) if x < v else min(x, v + (LF - DK) / (1.2 * CR)); dk[i] = v
duck = np.interp(t, np.arange(len(dk), dtype=np.float32) / CR, dk).astype(np.float32)
fade = (np.clip((TOT - t) / 3.5, 0, 1) * np.clip(t / 1.5, 0, 1)).astype(np.float32)
L = vo * 0.95 + (music.ML * 0.87 * duck + music.XL * 0.6) * fade
R = vo * 0.95 + (music.MR * 0.87 * duck + music.XR * 0.6) * fade
pk = max(np.abs(L).max(), np.abs(R).max()); L /= pk / 0.9; R /= pk / 0.9
sf.write(str(BUILD / 'mix.wav'), np.stack([L, R], 1), SR, subtype='PCM_16')
FF = imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', str(BUILD / 'mix.wav'), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '112k', str(DIST / 'soundtrack.mp3')], check=True)
print('total %.1fs, mix written to build/mix.wav and dist/soundtrack.mp3' % TOT)
