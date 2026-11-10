/* ===== A hundred records: the close's own piece =====
   hr_again(ctx, m, o)   on the margin card hr_margin returns (m), a dashed steel pointer for the next time they measure: o.v where it
                         stands, o.a; "Measured again" over it */
function hr_again(cx,m,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||!m)return;const mn=50,mx=100,x0=m.x+DQ_PAD+18,ws=m.w-2*DQ_PAD-36,px=x0+clamp((o.v-mn)/(mx-mn),0,1)*ws,sy=m.y+132;
  cx.save();cx.globalAlpha*=a;cx.strokeStyle=rgba(DQ.steel,0.9);cx.lineWidth=3;cx.setLineDash([8,7]);cx.beginPath();cx.moveTo(px-14,sy-6);cx.lineTo(px,sy+28);cx.lineTo(px+14,sy-6);cx.closePath();cx.stroke();
  cx.beginPath();cx.moveTo(px,sy-8);cx.lineTo(px,sy-30);cx.stroke();cx.setLineDash([]);
  dq_T(cx,"Measured again",clamp(px,m.x+DQ_PAD+110,m.x+m.w-DQ_PAD-110),m.y+m.h+40,{w:700,size:28,align:"center",col:"steel"});cx.restore();}
