"""Turn the Markdown pages in site/ into site pages. Run: python site-tools/build_pages.py (needs: pip install markdown)."""
import pathlib,re,markdown
ROOT=pathlib.Path(__file__).resolve().parents[1];WEB=ROOT/'site';SITE='https://roanboc.github.io/learning-data/'
TPL={'en':(ROOT/'site-tools/page.html').read_text(),'es':(ROOT/'site-tools/page.es.html').read_text()}
for md in sorted(p for d in ['journey','paths','es/journey','es/paths'] for p in WEB.glob(d+'/**/*.md')):
    rel=md.relative_to(WEB);lang='es' if rel.parts[0]=='es' else 'en'
    text=md.read_text()
    body=markdown.markdown(text,extensions=['tables','fenced_code','toc','attr_list'],extension_configs={'toc':{'toc_depth':'2-2'}})  # [TOC] lists the sections (h2) only
    base='../'*(len(rel.parts)-1);out=md.with_suffix('.html')
    # the page's heading and its italic subtitle open the page on the dark hero, like every other page; the subtitle is also its description
    hm=re.match(r'\s*(<h1[^>]*>.*?</h1>)\s*<p><em>(.*?)</em></p>\s*',body,re.S)
    h1,lead=(hm.group(1),hm.group(2)) if hm else ('','')
    body=body[hm.end():] if hm else body
    desc=re.sub(r'<[^>]+>','',lead).replace('"','&quot;')
    # the language toggle links each page to the same page in the other language: journey/ and es/journey/
    here=rel.parent.as_posix()+'/';en=here[3:] if lang=='es' else here
    out.write_text(TPL[lang].replace('{{base}}',base).replace('{{site}}',SITE).replace('{{en}}',en).replace('{{es}}','es/'+en).replace('{{h1}}',h1).replace('{{lead}}',lead).replace('{{description}}',desc).replace('{{body}}',body));print('built',out.relative_to(ROOT))
