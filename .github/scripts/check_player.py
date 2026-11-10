"""Compare a film's built and published player, on Windows as well as Linux."""
import argparse
import filecmp

import films


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("key")
    args = parser.parse_args()
    entry = next((f for f in films.films() if f["key"] == args.key), None)
    if entry is None:
        parser.error(f"unknown film key {args.key!r}")
    built = films.ROOT / entry["dir"] / entry["player"]
    published = films.ROOT / entry["site_player"]
    if not built.is_file() or not published.is_file() or not filecmp.cmp(built, published, shallow=False):
        parser.exit(1, f"{args.key}: rebuild and publish {built}; {published} differs or is missing\n")
    print(f"{args.key}: the site plays this build")


if __name__ == "__main__":
    main()
