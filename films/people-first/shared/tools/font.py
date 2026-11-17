"""Write the kit's handwriting font into its script: python films/people-first/shared/tools/font.py
src/kalam.js carries Kalam's two weights (fonts/Kalam-400-latin.woff2 and Kalam-700-latin.woff2, Google Fonts' Latin subsets, under
the SIL Open Font License 1.1: fonts/OFL-Kalam.txt), so a film's own script holds every letter it writes by hand and needs no
network: the video, the site's player and the checks all draw the same letters. Run it again only when the font files change."""
import base64, pathlib

HERE = pathlib.Path(__file__).resolve().parents[1]
HEAD = '''/* ===== The people kit: the handwriting font =====
   Notes in a book and words on a board are written by hand, so the kit carries a handwriting font of its own: Kalam, by Indian Type
   Foundry, under the SIL Open Font License 1.1 (fonts/OFL-Kalam.txt), in two weights: 400 for a pen, 700 for a heading or a board's
   marker. These are its Latin subsets from Google Fonts (version 18, checked 17 November 2026), carried in the film's own script,
   so the film looks the same in the video, in the site's player and in the checks, with no network. hand.js loads them before the
   film starts. Never edit this file: python tools/font.py writes it again from the two .woff2 files in fonts/. */
(K=>{K.KALAM={
%s};
})(PK);
'''
rows = ['%d:"data:font/woff2;base64,%s"' % (w, base64.b64encode((HERE / 'fonts' / ('Kalam-%d-latin.woff2' % w)).read_bytes()).decode()) for w in (400, 700)]
(HERE / 'src' / 'kalam.js').write_text(HEAD % ',\n'.join(rows))
print('wrote src/kalam.js: %d KB' % ((HERE / 'src' / 'kalam.js').stat().st_size // 1024))
