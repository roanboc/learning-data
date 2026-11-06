"""Build and publish the Spanish soundtrack: python tools/audio_es.py
Run from this film's source folder after tools/build.py. Spanish captions keep their original cue times; each line is
voiced at its natural rate, or faster only when needed to fit. The original score plays underneath. The output is
dist/soundtrack.es.mp3 and site/assets/decades-in-the-making/soundtrack.es.mp3; English files are not changed.
Voice files are cached in build/es_voice. Delete a line's cached files there after changing its Spanish wording."""
import asyncio
import json
import math
import pathlib
import re
import shutil
import subprocess
import sys

import edge_tts
import imageio_ffmpeg
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / "shared" / "tools"))
import run
from lang import *
import music
from playwright.sync_api import sync_playwright

FF = imageio_ffmpeg.get_ffmpeg_exe()
CACHE = BUILD / "es_voice"
VO = BUILD / "vo_es"
CACHE.mkdir(parents=True, exist_ok=True)
VO.mkdir(parents=True, exist_ok=True)
SAY_ES = {"story/rare": "Hacer libros es lento, y son escasos."}


def seconds(value):
    h, m, s = value.replace(",", ".").split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)


def captions():
    text = (ROOT.parent / "captions" / "es.srt").read_text(encoding="utf-8-sig")
    result = []
    for block in re.split(r"\r?\n\r?\n", text.strip()):
        rows = block.splitlines()
        match = re.match(r"(.+?) --> (.+)", rows[1])
        result.append({"start": seconds(match[1]), "end": seconds(match[2]), "text": " ".join(rows[2:])})
    return result


def decode(source, target, tempo=None):
    args = [FF, "-y", "-loglevel", "error", "-i", str(source)]
    if tempo:
        args += ["-af", f"atempo={tempo:.8f}"]
    subprocess.run(args + ["-ac", "1", "-ar", "24000", "-c:a", "pcm_s16le", str(target)], check=True)


def trim(source, target):
    x, sr = sf.read(str(source), dtype="float32")
    nz = np.flatnonzero(np.abs(x) > 0.008)
    if len(nz):
        a = max(0, int(nz[0] - 0.04 * sr))
        b = min(len(x), int(nz[-1] + 0.06 * sr))
        x = x[a:b]
    sf.write(str(target), x, sr)
    return len(x) / sr


async def save_tts(text, path, rate="+0%"):
    for attempt in range(3):
        try:
            await edge_tts.Communicate(text, "es-MX-DaliaNeural", rate=rate).save(str(path))
            return
        except Exception:
            if attempt == 2:
                raise
            await asyncio.sleep(2 * (attempt + 1))


async def make_voice(items):
    report = []
    for cap in items:
        key = cap["sid"] + "/" + cap["id"]
        name = cap["sid"] + "__" + cap["id"]
        text = SAY_ES.get(key, cap["text"])
        stem = CACHE / name
        base_mp3 = stem.with_suffix(".base.mp3")
        base_wav = stem.with_suffix(".base.wav")
        base_trim = stem.with_suffix(".trim.wav")
        if not base_trim.exists():
            await save_tts(text, base_mp3)
            decode(base_mp3, base_wav)
            trim(base_wav, base_trim)
        base_duration = sf.info(str(base_trim)).frames / sf.info(str(base_trim)).samplerate
        target = cap["end"] - cap["start"] - 0.06
        rate = "+0%"
        source = base_trim
        if base_duration > target:
            pct = min(100, max(1, math.ceil((base_duration / target - 1) * 100 + 3)))
            rate = f"+{pct}%"
            fit_mp3 = stem.with_suffix(".fit.mp3")
            fit_wav = stem.with_suffix(".fit.wav")
            fit_trim = stem.with_suffix(".fit.trim.wav")
            if not fit_trim.exists():
                await save_tts(text, fit_mp3, rate=rate)
                decode(fit_mp3, fit_wav)
                trim(fit_wav, fit_trim)
            fit_duration = sf.info(str(fit_trim)).frames / sf.info(str(fit_trim)).samplerate
            source = fit_trim
        else:
            fit_duration = base_duration
        final = VO / (name + ".wav")
        tempo = fit_duration / target if fit_duration > target else None
        if tempo:
            decode(source, final, tempo)
        else:
            shutil.copyfile(source, final)
        final_duration = sf.info(str(final)).frames / sf.info(str(final)).samplerate
        if final_duration > target + 0.03:
            raise RuntimeError(f"{key} does not fit: {final_duration:.3f}s > {target:.3f}s")
        report.append({**cap, "spoken_text": text, "voice": "es-MX-DaliaNeural", "rate": rate,
                       "base_duration": round(base_duration, 3), "final_duration": round(final_duration, 3),
                       "slot": round(target, 3), "post_tempo": round(tempo, 4) if tempo else None})
        print(f"{key}: {final_duration:.3f}s in {target:.3f}s at {rate}", flush=True)
    (CACHE / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")


def make_soundtrack(items, info):
    sr = music.SR
    total = info["total"]
    n = int(total * sr) + sr
    music.init(n)
    st = {s["id"]: s for s in info["scenes"]}
    ns = {k: v for k, v in vars(music).items() if not k.startswith("_")}
    ns.update(ST=st, TOT=total, G=lambda sid, cid, off=0: st[sid]["start"] + st[sid]["cues"][cid] + off,
              S0=lambda sid: st[sid]["start"], E=lambda sid: st[sid]["start"] + st[sid]["dur"],
              cq=lambda sid, cid: st[sid]["cues"][cid])
    score = ROOT / "tools" / "score.py"
    exec(compile(score.read_text(encoding="utf-8"), str(score), "exec"), ns)
    vo = np.zeros(n, np.float32)
    for cap in items:
        x, voice_sr = sf.read(str(VO / (cap["sid"] + "__" + cap["id"] + ".wav")), dtype="float32")
        x = resample_poly(x, sr, voice_sr).astype(np.float32)
        i = round(cap["start"] * sr)
        vo[i:i + len(x)] += x[:n - i]
    t = np.arange(n, dtype=np.float32) / sr
    cr = 100
    dk, lf = 0.42, 0.67
    tg = np.full(int(total * cr) + cr, lf, np.float32)
    for cap in items:
        voice = VO / (cap["sid"] + "__" + cap["id"] + ".wav")
        end = cap["start"] + sf.info(str(voice)).frames / 24000
        tg[int(max(0, cap["start"] - 0.45) * cr):int((end + 0.9) * cr)] = dk
    duck_control = np.empty_like(tg)
    value = lf
    for i, x in enumerate(tg):
        value = max(x, value - (lf - dk) / (0.4 * cr)) if x < value else min(x, value + (lf - dk) / (1.2 * cr))
        duck_control[i] = value
    duck = np.interp(t, np.arange(len(duck_control), dtype=np.float32) / cr, duck_control).astype(np.float32)
    fade = (np.clip((total - t) / 3.5, 0, 1) * np.clip(t / 1.5, 0, 1)).astype(np.float32)
    left = vo * 0.95 + (music.ML * 0.87 * duck + music.XL * 0.6) * fade
    right = vo * 0.95 + (music.MR * 0.87 * duck + music.XR * 0.6) * fade
    peak = max(np.abs(left).max(), np.abs(right).max())
    left /= peak / 0.9
    right /= peak / 0.9
    mix = BUILD / "mix.es.wav"
    sf.write(str(mix), np.stack([left, right], 1), sr, subtype="PCM_16")
    output = DIST / "soundtrack.es.mp3"
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", str(mix), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                    "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "112k", str(output)], check=True)
    published = REPO / "site" / "assets" / META["key"] / "soundtrack.es.mp3"
    shutil.copyfile(output, published)
    print(f"Spanish soundtrack: {output} and {published}", flush=True)


def main():
    rows = captions()
    with sync_playwright() as p:
        browser, page = render_page(p)
        info = page.evaluate("filmInfo()")
        browser.close()
    if len(rows) != len(info["caps"]) or len(rows) != 60:
        raise RuntimeError(f"Expected 60 Spanish captions matching the film, found {len(rows)}")
    items = []
    for row, cue in zip(rows, info["caps"]):
        # The voice uses the full Spanish caption window, including its extra 0.1 s hold.
        if abs(row["start"] - cue["s"]) > 0.002 or abs(row["end"] - cue["e"] - 0.1) > 0.002:
            raise RuntimeError(f"Spanish caption {row['text']} does not match the film's timing: {cue}")
        items.append({**row, "sid": cue["sid"], "id": cue["id"]})
    asyncio.run(make_voice(items))
    make_soundtrack(items, info)


if __name__ == "__main__":
    main()
