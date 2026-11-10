"""Verified, content-addressed voice lines shared safely across video worktrees."""
import hashlib
import importlib.metadata
import json
import os
import pathlib
import platform
import shutil
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]


def sha256(path):
    with pathlib.Path(path).open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def input_key(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()


def cache_root():
    override = os.environ.get("LEARNING_DATA_VOICE_CACHE")
    if override:
        return pathlib.Path(override).expanduser().resolve()
    result = subprocess.run(["git", "rev-parse", "--git-common-dir"], cwd=ROOT, capture_output=True, text=True)
    if result.returncode == 0:
        common = pathlib.Path(result.stdout.strip())
        return (common if common.is_absolute() else ROOT / common).resolve() / "learning-data-cache/voices"
    return ROOT / ".cache/voices"


def atomic_copy(source, target):
    """Use copies, not hard links: editing one worktree must never edit the shared cache."""
    target = pathlib.Path(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=target.parent, suffix=target.suffix, delete=False) as stream:
        temporary = pathlib.Path(stream.name)
    try:
        shutil.copyfile(source, temporary)
        temporary.replace(target)
    finally:
        temporary.unlink(missing_ok=True)


class VoiceCache:
    def __init__(self, directory=None):
        self.directory = pathlib.Path(directory) if directory is not None else cache_root()

    def materialize(self, key, target, produce):
        """Return True only when synthesis ran. Unstamped legacy WAVs are never trusted."""
        if len(key) != 64 or any(c not in "0123456789abcdef" for c in key):
            raise ValueError("invalid voice cache key")
        folder = self.directory / key[:2] / key
        folder.mkdir(parents=True, exist_ok=True)
        stamp = folder / "sha256.txt"
        checksum = stamp.read_text().strip() if stamp.is_file() else ""
        named = len(checksum) == 64 and all(c in "0123456789abcdef" for c in checksum)
        blob = folder / (checksum + ".wav")
        valid = named and blob.is_file() and sha256(blob) == checksum
        generated = not valid
        if generated:
            with tempfile.TemporaryDirectory(dir=folder, prefix="synth-") as tmp:
                temporary = pathlib.Path(tmp) / "voice.wav"
                produce(temporary)
                if not temporary.is_file() or not temporary.stat().st_size:
                    raise ValueError("voice producer returned no audio")
                checksum = sha256(temporary)
                # Audio filenames are their checksums. Publishing the pointer last means
                # simultaneous writers cannot pair one WAV with another WAV's checksum.
                blob = folder / (checksum + ".wav")
                temporary.replace(blob)
                marker = pathlib.Path(tmp) / "sha256.txt"
                marker.write_text(checksum, encoding="ascii")
                marker.replace(stamp)
        target = pathlib.Path(target)
        if not target.is_file() or sha256(target) != checksum:
            atomic_copy(blob, target)
        return generated


class KokoroVoice:
    def __init__(self, models, settings, producer, directory=None):
        self.models, self.settings = pathlib.Path(models), settings
        self.cache, self.engine = VoiceCache(directory), None
        versions = {}
        for package in ("kokoro-onnx", "onnxruntime", "numpy", "soundfile"):
            try:
                versions[package] = importlib.metadata.version(package)
            except importlib.metadata.PackageNotFoundError:
                versions[package] = "unavailable"
        self.identity = dict(voice=settings["voice"], lang=settings["lang"], speed=settings["speed"],
                             model=sha256(self.models / "kokoro-v1.0.onnx"), voices=sha256(self.models / "voices-v1.0.bin"),
                             producer=sha256(producer), cache=sha256(__file__), versions=versions,
                             platform=[platform.system(), platform.machine()])

    def save(self, text, target):
        key = input_key(dict(self.identity, text=text))

        def synthesize(path):
            import numpy as np
            import soundfile as sf
            from kokoro_onnx import Kokoro
            if self.engine is None:
                self.engine = Kokoro(str(self.models / "kokoro-v1.0.onnx"), str(self.models / "voices-v1.0.bin"))
            voice = self.settings["voice"]
            if isinstance(voice, dict):
                voice = sum(w * self.engine.get_voice_style(n) for n, w in voice.items()).astype(np.float32)
            samples, sr = self.engine.create(text, voice=voice, speed=self.settings["speed"], lang=self.settings["lang"])
            nz = np.where(np.abs(samples) > 0.01)[0]
            samples = samples[max(0, nz[0] - 240):nz[-1] + 480] if len(nz) else samples
            sf.write(str(path), samples, sr)

        return self.cache.materialize(key, target, synthesize)
