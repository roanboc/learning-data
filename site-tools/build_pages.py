"""Turn the Markdown pages in site/ into site pages. Run: python site-tools/build_pages.py (needs: pip install markdown)."""
import pathlib,re,markdown
ROOT=pathlib.Path(__file__).resolve().parents[1];WEB=ROOT/'site';SITE='https://roanboc.github.io/learning-data/'
TPL={'en':(ROOT/'site-tools/page.html').read_text(),'es':(ROOT/'site-tools/page.es.html').read_text()}
for md in sorted(p for d in ['journey','paths','es/journey','es/paths'] for p in WEB.glob(d+'/**/*.md')):
    rel=md.relative_to(WEB);lang='es' if rel.parts[0]=='es' else 'en'
    text=md.read_text();m=re.search(r'^# (.+)$',text,re.M);title=(m.group(1) if m else md.stem).replace('*','')
    body=markdown.markdown(text,extensions=['tables','fenced_code','toc','attr_list'])
    base='../'*(len(rel.parts)-1);out=md.with_suffix('.html')
    # the language toggle links each page to the same page in the other language: journey/ and es/journey/
    here=rel.parent.as_posix()+'/';en=here[3:] if lang=='es' else here
    out.write_text(TPL[lang].replace('{{title}}',title).replace('{{base}}',base).replace('{{site}}',SITE).replace('{{en}}',en).replace('{{es}}','es/'+en).replace('{{body}}',body));print('built',out.relative_to(ROOT))
