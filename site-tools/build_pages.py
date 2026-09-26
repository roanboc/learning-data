"""Turn Markdown pages into site pages. Run: python site-tools/build_pages.py (needs: pip install markdown)."""
import pathlib,re,markdown
ROOT=pathlib.Path(__file__).resolve().parents[1];TPL=(ROOT/'site-tools/page.html').read_text()
for md in sorted(list(ROOT.glob('journey/**/*.md'))+list(ROOT.glob('paths/**/*.md'))):
    text=md.read_text();m=re.search(r'^# (.+)$',text,re.M);title=(m.group(1) if m else md.stem).replace('*','')
    body=markdown.markdown(text,extensions=['tables','fenced_code','toc','attr_list'])
    base='../'*(len(md.relative_to(ROOT).parts)-1);out=md.with_suffix('.html')
    out.write_text(TPL.replace('{{title}}',title).replace('{{base}}',base).replace('{{body}}',body));print('built',out.relative_to(ROOT))
