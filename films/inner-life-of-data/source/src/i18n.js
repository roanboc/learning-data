/* ===== on-screen text in other languages: a language pack defines L10N={map,rules}; every string drawn or measured on a canvas is swapped for its translation, so layouts size to the translated text ===== */
if(typeof L10N!=="undefined"){const P=CanvasRenderingContext2D.prototype,M=L10N.map,R=L10N.rules||[];
  const tr=s=>{if(typeof s!=="string")return s;const v=M[s];if(v!=null)return v;for(const[re,f]of R){const m=s.match(re);if(m)return f(m);}return s;};
  ["fillText","strokeText","measureText"].forEach(k=>{const o=P[k];P[k]=function(s,...a){return o.call(this,tr(s),...a);};});}
