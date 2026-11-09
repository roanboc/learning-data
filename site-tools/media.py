"""Keep published audio in GitHub Releases, with per-film checksum manifests.

index --tag audio-v1       record current MP3s in each film's audio.json
prepare --tag TAG --output DIR   stage the immutable release assets
fetch [--pages JSON|all]   restore only missing audio (all by default)
check                     validate manifests and any local copies
verify-remote             download and verify every replacement, without changing the checkout
untrack                   verify every remote replacement, then remove only Git's tracked copies
"""
import argparse
import functools
import hashlib
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = "https://github.com/roanboc/learning-data/releases/download/"


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def validate(entry, root=ROOT):
    if not isinstance(entry, dict) or set(entry) != {"path", "size", "sha256", "url"}:
        raise ValueError("audio entry needs path, size, sha256 and url")
    name = entry["path"]
    if not isinstance(name, str) or "\\" in name or not name.startswith("site/assets/") or not name.endswith(".mp3"):
        raise ValueError(f"invalid audio path: {name!r}")
    p = pathlib.PurePosixPath(name)
    if p.is_absolute() or name != p.as_posix() or ".." in p.parts or not (root / name).resolve().is_relative_to(root.resolve()):
        raise ValueError(f"audio path escapes checkout: {name}")
    if type(entry["size"]) is not int or entry["size"] <= 0 or not isinstance(entry["sha256"], str) or not re.fullmatch(r"[0-9a-f]{64}", entry["sha256"]):
        raise ValueError(f"invalid size or checksum for {name}")
    url = entry["url"]
    if not isinstance(url, str) or not re.fullmatch(re.escape(BASE) + r"audio-[A-Za-z0-9._-]+/" + entry["sha256"] + r"\.mp3", url):
        raise ValueError(f"audio URL must pin an audio release and its checksum: {name}")
    return entry


@functools.lru_cache(maxsize=8)
def inventory(root=ROOT):
    out = {}
    for path in sorted((root / "films").rglob("audio.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        if set(data) != {"version", "files"} or type(data["version"]) is not int or data["version"] != 1 or not isinstance(data["files"], list) or not data["files"]:
            raise ValueError(f"{path}: unsupported audio manifest")
        for e in data["files"]:
            validate(e, root)
            if e["path"] in out:
                raise ValueError(f"{path}: duplicate audio owner: {e['path']}")
            out[e["path"]] = e
    return out


def available(path):
    """A logical site asset may live in the checkout or be declared in a validated manifest."""
    if path.is_file():
        return True
    return path.relative_to(ROOT).as_posix() in inventory()


def matches(path, entry):
    return path.is_file() and path.stat().st_size == entry["size"] and digest(path) == entry["sha256"]


def cache_state(root):
    path = root / ".cache/audio-state.json"
    state = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    if not isinstance(state, dict) or not all(isinstance(k, str) and isinstance(v, str) and re.fullmatch(r"[0-9a-f]{64}", v) for k, v in state.items()):
        raise ValueError(f"invalid verified-audio cache: {path}")
    return state


def save_state(root, state):
    path = root / ".cache/audio-state.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state, sort_keys=True, indent=2) + "\n", encoding="utf-8")


def fetch(entries, root=ROOT):
    state = cache_state(root)
    for entry in entries.values():
        target = root / entry["path"]
        current = digest(target) if target.is_file() else None
        if current != entry["sha256"]:
            if current is not None and current != state.get(entry["path"]):
                raise ValueError(f"local audio differs: {target}; index your edits instead of overwriting them")
            download(entry, target)
            print("Fetched " + entry["path"], flush=True)
        elif target.stat().st_size != entry["size"]:
            raise ValueError(f"local audio size differs: {target}")
        state[entry["path"]] = entry["sha256"]
    save_state(root, state)


def download(entry, target):
    """Write only verified bytes, atomically. A failed download never replaces a usable file."""
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        request = urllib.request.Request(entry["url"], headers={"User-Agent": "learning-data-media"})
        with urllib.request.urlopen(request, timeout=60) as response, tempfile.NamedTemporaryFile(dir=target.parent, prefix=".audio-", delete=False) as out:
            temporary = pathlib.Path(out.name)
            count, sha = 0, hashlib.sha256()
            while chunk := response.read(1024 * 1024):
                count += len(chunk)
                if count > entry["size"]:
                    raise ValueError(f"download too large: {entry['path']}")
                sha.update(chunk)
                out.write(chunk)
        if count != entry["size"] or sha.hexdigest() != entry["sha256"]:
            raise ValueError(f"download checksum mismatch: {entry['path']}")
        temporary.replace(target)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def selected(page_scope, entries):
    if page_scope == "all":
        return entries
    pages = json.loads(page_scope)
    if not isinstance(pages, list) or not all(isinstance(p, str) for p in pages):
        raise ValueError("--pages needs a JSON list of page keys, or all")
    sys.path.insert(0, str(ROOT / ".github/scripts"))
    import affected
    loaded = affected.loads()
    missing = set(pages) - set(loaded)
    if missing:
        raise ValueError(f"unknown pages: {sorted(missing)}")
    refs = {ref for page in pages for ref in loaded[page]}
    owners = {pathlib.PurePosixPath(ref).parent.as_posix() for ref in refs if ref.endswith((".mp3", ".js"))}
    return {p: e for p, e in entries.items() if p.removeprefix("site/") in refs or
            pathlib.PurePosixPath(p.removeprefix("site/")).parent.as_posix() in owners}


def index(tag):
    if not re.fullmatch(r"audio-[A-Za-z0-9._-]+", tag):
        raise ValueError("audio tags must start audio- and contain only letters, digits, dots, hyphens and underscores")
    seen = set()
    for release in sorted((ROOT / "films").rglob("release.json")):
        paths = set()
        for film in json.loads(release.read_text(encoding="utf-8")):
            player = ROOT / film["site_player"]
            if player.name in ("film.js", "film.es.js"):
                paths.update(player.parent.glob("soundtrack*.mp3"))
            else:
                paths.add(player.with_suffix(".mp3"))
        paths = sorted(p for p in paths if p.is_file())
        entries = []
        previous = json.loads(release.with_name("audio.json").read_text(encoding="utf-8"))["files"] if release.with_name("audio.json").exists() else []
        # Files not fetched in a lean checkout retain their existing release pointer.
        by_path = {e["path"]: e for e in previous}
        for p in paths:
            sha = digest(p)
            name = p.relative_to(ROOT).as_posix()
            old = by_path.get(name)
            by_path[name] = old if old and old["sha256"] == sha else dict(path=name, size=p.stat().st_size, sha256=sha, url=BASE + tag + "/" + sha + ".mp3")
        for name, entry in sorted(by_path.items()):
            if name in seen:
                raise ValueError(f"audio belongs to two films: {name}")
            seen.add(name)
            entries.append(validate(entry))
        if entries:
            release.with_name("audio.json").write_text(json.dumps(dict(version=1, files=entries), indent=2) + "\n", encoding="utf-8")
    unowned = {p.relative_to(ROOT).as_posix() for p in (ROOT / "site/assets").rglob("*.mp3")} - seen
    if unowned:
        raise ValueError(f"audio without a release owner: {sorted(unowned)}")
    inventory.cache_clear()
    print(f"Indexed {len(seen)} audio files; unchanged files keep their original release URLs.")


def verify_remote(entries):
    with tempfile.TemporaryDirectory(prefix="learning-data-audio-") as tmp:
        for entry in entries.values():
            download(entry, pathlib.Path(tmp) / "verified.mp3")
            print("Verified " + entry["path"], flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=("index", "prepare", "fetch", "check", "verify-remote", "untrack"))
    parser.add_argument("--tag")
    parser.add_argument("--output", type=pathlib.Path)
    parser.add_argument("--pages", default="all")
    args = parser.parse_args()
    try:
        if args.command == "index":
            if not args.tag:
                parser.error("index requires --tag")
            index(args.tag)
            return
        entries = inventory()
        if not entries:
            raise ValueError("no audio manifests found: run index first")
        if args.command == "prepare":
            if not args.tag or not args.output:
                parser.error("prepare requires --tag and --output")
            args.output.mkdir(parents=True, exist_ok=True)
            for entry in entries.values():
                if urllib.parse.urlsplit(entry["url"]).path.split("/")[-2] != args.tag:
                    continue  # older immutable assets remain in their original release
                source = ROOT / entry["path"]
                if not matches(source, entry):
                    raise ValueError(f"missing or modified audio: {source}; index the intended audio before publishing")
                target = args.output / (entry["sha256"] + ".mp3")
                shutil.copyfile(source, target)
            if not list(args.output.glob("*.mp3")):
                raise ValueError("no audio files belong to this release tag")
        elif args.command == "fetch":
            fetch(selected(args.pages, entries))
        elif args.command == "check":
            unowned = {p.relative_to(ROOT).as_posix() for p in (ROOT / "site/assets").rglob("*.mp3")} - set(entries)
            if unowned:
                raise ValueError(f"audio needs indexing: {sorted(unowned)}")
            for entry in entries.values():
                path = ROOT / entry["path"]
                if path.exists() and not matches(path, entry):
                    raise ValueError(f"local audio differs from manifest: {path}")
            print(f"{len(entries)} audio pointers valid; local copies match their checksums. Use verify-remote to check release availability.")
        else:
            if args.command == "untrack":
                for entry in entries.values():
                    path = ROOT / entry["path"]
                    if path.exists() and not matches(path, entry):
                        raise ValueError(f"uncommitted audio edits: {path}; index them before untracking")
            verify_remote(entries)
            if args.command == "untrack":
                state = cache_state(ROOT)
                state.update({e["path"]: e["sha256"] for e in entries.values() if (ROOT / e["path"]).is_file()})
                save_state(ROOT, state)
                subprocess.run(["git", "--literal-pathspecs", "rm", "--cached", "--ignore-unmatch", "--", *entries], cwd=ROOT, check=True)
                print("Removed verified audio from Git's index. Local copies are retained; commit the staged removal.")
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, str(error) + "\n")


if __name__ == "__main__":
    main()
