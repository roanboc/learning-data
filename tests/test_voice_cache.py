import contextlib
import io
import json
import os
import pathlib
import runpy
import struct
import sys
import tempfile
import types
import unittest
import wave
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "site-tools"))
from voice_cache import VoiceCache, input_key, sha256


class VoiceCacheTests(unittest.TestCase):
    def test_reuses_only_matching_inputs_and_never_links_worktrees(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            cache = VoiceCache(root / "cache")
            made = []
            def produce(path):
                made.append(path)
                path.write_bytes(b"generated voice")
            key = input_key(dict(text="hello", voice="one"))
            a, b = root / "branch-a/line.wav", root / "branch-b/line.wav"
            self.assertTrue(cache.materialize(key, a, produce))
            self.assertFalse(cache.materialize(key, b, produce))
            self.assertEqual(len(made), 1)
            a.write_bytes(b"edited")
            self.assertEqual(b.read_bytes(), b"generated voice")
            self.assertFalse(cache.materialize(key, a, produce))
            self.assertEqual(a.read_bytes(), b"generated voice")
            self.assertTrue(cache.materialize(input_key(dict(text="new words", voice="one")), a, produce))

    def test_corrupt_cache_is_regenerated_and_failed_production_preserves_target(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            cache, key, target = VoiceCache(root / "cache"), input_key("hello"), root / "out.wav"
            cache.materialize(key, target, lambda p: p.write_bytes(b"good"))
            blob = next((root / "cache").rglob("*.wav"))
            blob.write_bytes(b"corrupt")
            self.assertTrue(cache.materialize(key, target, lambda p: p.write_bytes(b"repaired")))
            def fail(path):
                path.write_bytes(b"partial")
                raise RuntimeError("synthesis failed")
            with self.assertRaises(RuntimeError):
                cache.materialize(input_key("other"), target, fail)
            self.assertEqual(target.read_bytes(), b"repaired")

    def test_parallel_writers_publish_consistent_audio(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            cache, key = VoiceCache(root / "cache"), input_key("same words")
            def run(i):
                target = root / f"branch-{i}.wav"
                cache.materialize(key, target, lambda p: p.write_bytes(b"voice"))
                return target.read_bytes()
            with ThreadPoolExecutor(max_workers=4) as pool:
                self.assertEqual(list(pool.map(run, range(8))), [b"voice"] * 8)

    def test_actual_tts_scripts_invalidate_edited_lines_and_keep_timing_guard(self):
        # Exercise the real loops with a tiny deterministic backend, without downloading
        # models or installing audio packages in the planner job.
        class Absolute(list):
            def __gt__(self, value):
                return [x > value for x in self]
        np = types.ModuleType("numpy")
        np.abs = lambda samples: Absolute(abs(x) for x in samples)
        np.where = lambda flags: ([i for i, value in enumerate(flags) if value],)
        sf = types.ModuleType("soundfile")
        def write(path, samples, sr):
            with wave.open(str(path), "wb") as stream:
                stream.setparams((1, 2, sr, 0, "NONE", "not compressed"))
                stream.writeframes(b"".join(struct.pack("<h", int(x * 32767)) for x in samples))
        def info(path):
            with wave.open(str(path)) as stream:
                return types.SimpleNamespace(frames=stream.getnframes(), samplerate=stream.getframerate())
        sf.write, sf.info = write, info
        kokoro = types.ModuleType("kokoro_onnx")
        spoken = []
        class FakeKokoro:
            def __init__(self, *args):
                pass
            def create(self, text, **kwargs):
                spoken.append(text)
                return [0.2] * (len(text) * 1000), 8000
        kokoro.Kokoro = FakeKokoro
        scripts = list((ROOT / "films").rglob("tts.py"))
        scripts = [p for p in scripts if "KokoroVoice(" in p.read_text()]
        self.assertEqual(len(scripts), 7)
        for script in scripts:
            with self.subTest(script=str(script)), tempfile.TemporaryDirectory() as tmp:
                root = pathlib.Path(tmp)
                models, build = root / "models", root / "build"
                models.mkdir(); (build / "vo").mkdir(parents=True)
                for name in ("kokoro-v1.0.onnx", "voices-v1.0.bin"):
                    (models / name).write_bytes(b"test-model")
                narration, timings = root / "narration.js", root / "vodur.js"
                narration.write_text(json.dumps(dict(scene=dict(vo=[dict(id="one", text="hello")]))))
                lang = types.ModuleType("lang")
                lang.ROOT, lang.MODELS, lang.BUILD, lang.PACK = root, models, build, root / "i18n"
                lang.NARR, lang.VODUR, lang.EN, lang.META = narration, timings, True, {}
                lang.load_obj = lambda p: json.loads(p.read_text()[p.read_text().index("{"):p.read_text().rindex("}") + 1])
                modules = dict(numpy=np, soundfile=sf, kokoro_onnx=kokoro, lang=lang, imageio_ffmpeg=types.ModuleType("imageio_ffmpeg"))
                def run(*args):
                    with patch.dict(sys.modules, modules), patch.dict(os.environ, LEARNING_DATA_VOICE_CACHE=str(root / "cache")), \
                         patch.object(sys, "argv", [str(script), *args]), contextlib.redirect_stdout(io.StringIO()):
                        runpy.run_path(str(script), run_name="__main__")
                before = len(spoken)
                run(); run()
                self.assertEqual(len(spoken) - before, 1)
                narration.write_text(json.dumps(dict(scene=dict(vo=[dict(id="one", text="new words")]))))
                run()
                self.assertEqual(len(spoken) - before, 2)
                run("--keep-timings")
                previous = timings.read_bytes()
                narration.write_text(json.dumps(dict(scene=dict(vo=[dict(id="one", text="a much longer edited line")]))))
                with self.assertRaises(SystemExit):
                    run("--keep-timings")
                self.assertEqual(timings.read_bytes(), previous)
                (models / "voices-v1.0.bin").write_bytes(b"updated model")
                run()
                self.assertEqual(len(spoken) - before, 4)


if __name__ == "__main__":
    unittest.main()
