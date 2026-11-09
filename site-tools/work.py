"""Start isolated video worktrees and execute the repository's regeneration/check workflow."""
import argparse
import hashlib
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]


def git(*args, root=ROOT):
    return subprocess.run(["git", *args], cwd=root, capture_output=True, text=True, check=True).stdout.strip()


def worktrees(root=ROOT):
    records = []
    for block in git("worktree", "list", "--porcelain", root=root).split("\n\n"):
        data = dict(line.split(" ", 1) for line in block.splitlines() if " " in line)
        if "worktree" in data:
            path = pathlib.Path(data["worktree"])
            marker = path / ".cache/video-workspace.json"
            records.append(dict(path=str(path), branch=data.get("branch", "detached"),
                                film=json.loads(marker.read_text(encoding="utf-8")) if marker.is_file() else None))
    return records


def start(film, branch, directory, base="origin/main", root=ROOT, fetch=True):
    git("check-ref-format", "--branch", branch, root=root)
    if fetch and base == "origin/main":
        git("fetch", "--filter=blob:none", "origin", "main", root=root)
    git("rev-parse", "--verify", base + "^{commit}", root=root)
    try:
        git("cat-file", "-e", base + ":site-tools/work.py", root=root)
    except subprocess.CalledProcessError:
        raise ValueError("base does not contain the workspace tools yet; commit them and use --base HEAD until they are merged") from None
    directory = pathlib.Path(directory).resolve()
    if directory.exists() or directory.is_relative_to(root.resolve()):
        raise ValueError("choose a new worktree directory outside the current checkout")
    common = pathlib.Path(git("rev-parse", "--git-common-dir", root=root))
    common = common if common.is_absolute() else root / common
    locks = common.resolve() / "learning-data-workspaces"
    locks.mkdir(parents=True, exist_ok=True)
    lock = locks / (hashlib.sha256(film["dir"].encode()).hexdigest() + ".lock")
    try:
        lock.mkdir()
    except FileExistsError:
        raise ValueError("another process is creating this film's workspace; retry after it finishes") from None
    try:
        for existing in worktrees(root):
            claim = existing["film"]
            if claim and claim["source"] == film["dir"]:
                raise ValueError(f"this film already has an isolated workspace: {existing['path']}")
        git("worktree", "add", "-b", branch, str(directory), base, root=root)
        marker = directory / ".cache/video-workspace.json"
        marker.parent.mkdir(parents=True, exist_ok=True)
        marker.write_text(json.dumps(dict(key=film["key"], source=film["dir"], base=git("rev-parse", base, root=root)), indent=2) + "\n", encoding="utf-8")
    finally:
        lock.rmdir()
    return directory


def refresh_and_check(base, root=ROOT):
    """Generated lists are rebuilt from their owners, then the affected runner decides what to execute."""
    for script in ("site-tools/build_series.py", "site-tools/build_pages.py", "site-tools/catalog.py"):
        command = [sys.executable, script] + (["--write"] if script.endswith("catalog.py") else [])
        subprocess.run(command, cwd=root, check=True)
    subprocess.run([sys.executable, ".github/scripts/affected.py", "--base", base, "--run"], cwd=root, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    begin = commands.add_parser("start", help="create a worktree without switching or changing the current checkout")
    begin.add_argument("film", help="release key, such as off-the-shelf-en")
    begin.add_argument("--branch")
    begin.add_argument("--directory", type=pathlib.Path)
    begin.add_argument("--base", default="origin/main")
    begin.add_argument("--no-fetch", action="store_true", help="use the existing local base when working offline")
    commands.add_parser("list", help="show video workspace ownership")
    check = commands.add_parser("check", help="regenerate shared indexes and execute only affected checks")
    check.add_argument("--base", default="origin/main")
    args = parser.parse_args()
    try:
        if args.command == "start":
            sys.path.insert(0, str(ROOT / ".github/scripts"))
            import films
            film = next((f for f in films.films() if f["key"] == args.film), None)
            if film is None:
                raise ValueError(f"unknown film key: {args.film}")
            branch = args.branch or "video/" + args.film
            directory = args.directory or ROOT.parent / (ROOT.name + "-worktrees") / args.film
            path = start(film, branch, directory, args.base, fetch=not args.no_fetch)
            print(f"Workspace: {path}\nBranch: {branch}\nFilm: {args.film}")
            print("Builds and audio stay isolated. Run site-tools/work.py check in this workspace before handing it off.")
        elif args.command == "list":
            print(json.dumps(worktrees(), indent=2))
        else:
            refresh_and_check(args.base)
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, str(error) + ("\n" + error.stderr if isinstance(error, subprocess.CalledProcessError) and error.stderr else "\n"))


if __name__ == "__main__":
    main()
