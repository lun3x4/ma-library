'use strict';
const $=s=>document.querySelector(s),au=$('#au');
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const U=Object.assign({likes:[],pins:['Liked Songs','Your Episodes'],dl:['Your Episodes'],rec:{},custom:[],sort:'alpha',grid:0},JSON.parse(localStorage.getItem('lib')||'{}'));
const save=()=>localStorage.setItem('lib',JSON.stringify(U));
const url=p=>p.split('/').map(encodeURIComponent).join('/');
const tog=(a,v)=>{const i=a.indexOf(v);i<0?a.push(v):a.splice(i,1)};
const fmt=s=>{s=Math.max(0,s|0);return(s/60|0)+':'+String(s%60).padStart(2,'0')};
let L={owner:'me',playlists:[],events:[],artists:{}},T=[],PL=[],Q=[],qi=-1,shuf=0,filt=null,q='',q2='',showS=0,tmr=0,tmrId,drag=0,TM,src='',cp='',lp=0,tp;

/* ---------- icons ---------- */
const S={
search:'<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 5 5"/>',
plus:'<path d="M12 4v16M4 12h16"/>',
home:'<path d="M3.5 10.5 12 3l8.5 7.5V21h-6v-6h-5v6h-6z"/>',
lib:'<path d="M5 3v18M10 3v18M15.5 5l4.5 16"/>',
sort:'<path d="m8 9 4-5 4 5M8 15l4 5 4-5"/>',
grid:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
list:'<path d="M4 6h16M4 12h16M4 18h16"/>',
down:'<path d="m5 9 7 7 7-7"/>',
back:'<path d="m15 5-7 7 7 7"/>',
x:'<path d="M6 6l12 12M18 6 6 18"/>',
ok:'<path d="m5 12.5 4.5 4.5L19 7"/>',
shuf:'<path d="M3 7h3.5c4.5 0 5.5 10 10 10H21M3 17h3.5c1.4 0 2.5-.7 3.4-1.8M14 8.8C14.9 7.7 15.9 7 17.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3"/>',
tmr:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9v5l2.5 2M9.5 2.5h5"/>',
dev:'<path d="M10 17H4V5h10v3"/><rect x="11" y="8" width="10" height="13" rx="2"/><circle cx="16" cy="15" r="2.5"/>',
share:'<path d="M12 15V3M8 7l4-4 4 4M5 11v9h14v-9"/>',
queue:'<rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/>'};
const F={
dots:'<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>',
play:'<path d="M7 4.5v15l13-7.5z"/>',
pause:'<rect x="6" y="4" width="4.2" height="16" rx="1"/><rect x="13.8" y="4" width="4.2" height="16" rx="1"/>',
next:'<path d="M6 5v14l10-7z"/><rect x="17" y="5" width="2.6" height="14" rx="1"/>',
prev:'<path d="M18 5v14L8 12z"/><rect x="4.4" y="5" width="2.6" height="14" rx="1"/>',
heart:'<path d="M12 21s-8.5-5.3-8.5-11.2A4.6 4.6 0 0 1 12 7.2a4.6 4.6 0 0 1 8.5 2.6C20.5 15.7 12 21 12 21z"/>',
pin:'<path d="M15 3l6 6-2.5 1-3 3 .5 4-1.5 1.5-4-4-5 5-1-1 5-5-4-4L8 8l3-3z"/>',
bm:'<path d="M6 3h12v18l-6-5-6 5z"/>'};
const C={
chk:'<circle cx="12" cy="12" r="11" fill="#1ed760"/><path d="m7 12.5 3.5 3.5L17 9" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
add:'<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5v9M7.5 12h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
dl:'<circle cx="12" cy="12" r="11" fill="#1ed760"/><path d="M12 6.5v9m-4-3.5 4 4 4-4" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
dlo:'<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v9m-4-3.5 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
};
const ic=(n,s=24)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" ${S[n]?'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"':F[n]?'fill="currentColor"':''}>${S[n]||F[n]||C[n]}</svg>`;

/* ---------- data ---------- */
const byId=id=>T.find(t=>t.id===id);
const likedPl=()=>({name:'Liked Songs',liked:1,tracks:U.likes.map(byId).filter(Boolean)});
const getPl=n=>n==='Liked Songs'?likedPl():L.playlists.find(p=>p.name===n)||(c=>c&&{name:n,custom:1,tracks:c.ids.map(byId).filter(Boolean)})(U.custom.find(c=>c.name===n));
const arts=()=>{const m={};T.forEach(t=>t.artist.split(/,\s*/).forEach(a=>(m[a]=m[a]||[]).push(t)));return m};
const hue=s=>Math.abs([...s].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7))%360;
const grad=n=>`background:linear-gradient(135deg,hsl(${hue(n)} 55% 42%),hsl(${(hue(n)+50)%360} 55% 26%))`;
const cv=(n,s,r)=>s?`<img class="cv${r?' rd':''}" src="${url(s)}" alt="">`:`<div class="cv${r?' rd':''}" style="${grad(n)}"><i>${e([...n][0]||'♪')}</i></div>`;
const lcv=()=>`<div class="cv" style="background:linear-gradient(135deg,#4500f5,#8d93f0 65%,#bfe9d6)">${ic('heart')}</div>`;
const epc=`<div class="cv" style="background:#056952"><span style="display:contents;color:#1ed760">${ic('bm')}</span></div>`;
const evc=v=>{const d=new Date(v.date+'T12:00');return`<div class="cv ev" style="${v.cover?`background-image:linear-gradient(#0007,#0007),url('${url(v.cover)}')`:grad(v.name)}"><small>${d.toLocaleString('en',{month:'short'})}</small><b>${d.getDate()}</b><small>${d.getFullYear()}</small></div>`};

function items(){
  const o=L.owner,a=[],h=n=>'#/pl/'+encodeURIComponent(n);
  a.push({key:'Liked Songs',n:'Liked Songs',sub:'Playlist • '+o,cv:lcv(),href:h('Liked Songs'),k:'pl'});
  a.push({key:'Your Episodes',n:'Your Episodes',sub:'Playlist • Saved & downloaded episodes',cv:epc,href:'#/ep',k:'ep'});
  L.playlists.forEach(p=>a.push({key:p.name,n:p.name,sub:'Playlist • '+o,cv:cv(p.name,p.cover),href:h(p.name),k:'pl'}));
  U.custom.forEach(c=>a.push({key:c.name,n:c.name,sub:'Playlist • '+o,cv:cv(c.name),href:h(c.name),k:'pl'}));
  (L.events||[]).forEach((v,i)=>a.push({key:'ev:'+i,n:v.name,sub:'Event • '+v.venue,cv:evc(v),href:'#/ev/'+i,k:'ev'}));
  Object.keys(arts()).forEach(n=>a.push({key:'ar:'+n,n,sub:'Artist',cv:cv(n,(L.artists||{})[n],1),href:'#/ar/'+encodeURIComponent(n),k:'ar'}));
  return a;
}
const FL={Playlists:i=>i.k=='pl'||i.k=='ep',Podcasts:i=>i.k=='ep',Artists:i=>i.k=='ar',Events:i=>i.k=='ev',Downloaded:i=>U.dl.includes(i.key)};
const SN={rec:'Recents',add:'Recently added',alpha:'Alphabetical',cr:'Creator'};
const so={alpha:(a,b)=>a.n.localeCompare(b.n),rec:(a,b)=>(U.rec[b.key]||0)-(U.rec[a.key]||0),add:(a,b)=>a.o-b.o,cr:(a,b)=>a.sub.localeCompare(b.sub)||a.n.localeCompare(b.n)};

function lst(){
  const ql=q.toLowerCase();
  const a=items().map((x,o)=>({...x,o})).filter(x=>(!filt||FL[filt](x))&&x.n.toLowerCase().includes(ql));
  a.sort((x,y)=>(U.pins.includes(y.key)-U.pins.includes(x.key))||so[U.sort](x,y));
  const on=x=>Q.length&&x.n==src?' g':'';
  if(!a.length)return'<p class="em">Nothing here yet</p>';
  if(U.grid)return`<div class="gr">${a.map(x=>`<a class="gc" href="${x.href}" data-key="${e(x.key)}">${x.cv}<b class="${on(x)}">${e(x.n)}</b><span>${e(x.sub)}</span></a>`).join('')}</div>`;
  return a.map(x=>`<a class="r" href="${x.href}" data-key="${e(x.key)}">${x.cv}<div class="rt"><b class="${on(x)}">${e(x.n)}</b><span>${U.pins.includes(x.key)?`<i>${ic('pin',14)}</i>`:''}${U.dl.includes(x.key)&&(x.k=='pl'||x.k=='ep')?`<i>${ic('dl',14)}</i>`:''}${e(x.sub)}</span></div></a>`).join('');
}
const tr=(t,i,thumb)=>`<div class="tk${t.id===Q[qi]?.id?' on':''}" data-a="play" data-v="${i}">${thumb?cv(t.pl,t.cover):''}<div class="tt"><b>${e(t.title)}</b><span>${U.likes.includes(t.id)?`<i class="ck">${ic('chk',16)}</i>`:''}${e(t.artist)}</span></div><button data-a="tm" data-v="${e(t.id)}">${ic('dots')}</button></div>`;
const back=`<div class="tp"><button data-a="back">${ic('back',28)}</button></div>`;
const fit=()=>{$('#view').style.paddingTop=$('#top').offsetHeight+'px'};
const lib=()=>{$('#top').innerHTML=libTop();$('#view').innerHTML=V.lib();fit()};
const gone=()=>{setTimeout(()=>{location.hash='#/lib'});return''};

/* ---------- views ---------- */
const V={};
const libTop=()=>`<header class="hd"><button class="av" data-a="prof" style="${grad('me')}">${e((L.owner[0]||'m').toUpperCase())}</button><h1>Your Library</h1><button data-a="ls">${ic('search',28)}</button><button data-a="add">${ic('plus',32)}</button></header>
${showS?`<div class="ib">${ic('search',18)}<input id="lq" placeholder="Search in Your Library" value="${e(q)}"></div>`:''}
<div class="chips">${filt?`<button class="ch x" data-a="chip" data-v="${filt}">${ic('x',14)}</button>`:''}${Object.keys(FL).filter(f=>!filt||f==filt).map(f=>`<button class="ch${f==filt?' on':''}" data-a="chip" data-v="${f}">${f}</button>`).join('')}</div>`;
V.lib=()=>{PL=[];return`<div class="sr"><button data-a="so">${ic('sort',22)}<span>${SN[U.sort]}</span></button><button data-a="vw">${ic(U.grid?'list':'grid',22)}</button></div><div id="list">${lst()}</div>`};

V.home=()=>{PL=[];const h=new Date().getHours(),a=items().filter(x=>x.k=='pl').slice(0,6),r=[...L.playlists].sort((x,y)=>(U.rec[y.name]||0)-(U.rec[x.name]||0)).slice(0,8);
return`<h1 class="pg">${h<12?'Good morning':h<18?'Good afternoon':'Good evening'}</h1><div class="qg">${a.map(x=>`<a href="${x.href}">${x.cv}<b>${e(x.n)}</b></a>`).join('')}</div>${r.length?`<h2>Your playlists</h2><div class="hs">${r.map(p=>`<a href="#/pl/${encodeURIComponent(p.name)}">${cv(p.name,p.cover)}<b>${e(p.name)}</b></a>`).join('')}</div>`:''}`};

const sres=()=>{const s=q2.toLowerCase();if(!s){PL=[];return`<h2>Browse all</h2><div class="bg">${L.playlists.map(p=>`<a href="#/pl/${encodeURIComponent(p.name)}" style="${grad(p.name)}">${e(p.name)}</a>`).join('')}</div>`}
  PL=T.filter(t=>(t.title+' '+t.artist+' '+t.pl).toLowerCase().includes(s));return PL.map((t,i)=>tr(t,i,1)).join('')||'<p class="em">No results found</p>'};
V.search=()=>`<h1 class="pg">Search</h1><div class="ib big">${ic('search',22)}<input id="si" placeholder="What do you want to listen to?" value="${e(q2)}"></div><div id="sres">${sres()}</div>`;


V.pl=n=>{const p=getPl(n);if(!p)return gone();PL=p.tracks;
return`${back}<div class="hero">${p.liked?lcv():cv(n,p.cover)}<h1>${e(n)}</h1><p>${e(L.owner)} • ${PL.length} songs</p></div>
<div class="ab"><button data-a="dlt" data-v="${e(n)}">${ic(U.dl.includes(n)?'dl':'dlo',28)}</button><button data-a="im" data-v="${e(n)}">${ic('dots',28)}</button><span></span><button data-a="shp" class="${shuf?'g':''}">${ic('shuf',28)}</button><button class="bp" data-a="pall">${ic('play',28)}</button></div>
${PL.map((t,i)=>tr(t,i)).join('')||'<p class="em">Nothing here yet. Add songs from any track’s ⋯ menu.</p>'}`};

V.ar=n=>{PL=arts()[n]||[];return`${back}<div class="hero">${cv(n,(L.artists||{})[n],1)}<h1>${e(n)}</h1><p>${PL.length} songs</p></div><div class="ab"><span></span><button data-a="shp" class="${shuf?'g':''}">${ic('shuf',28)}</button><button class="bp" data-a="pall">${ic('play',28)}</button></div><h2>Popular</h2>${PL.map((t,i)=>tr(t,i)).join('')}`};

V.ev=i=>{const v=(L.events||[])[i];if(!v)return gone();PL=[];const d=new Date(v.date+'T12:00');
return`${back}<div class="hero">${evc(v)}<h1>${e(v.name)}</h1><p>${d.toLocaleDateString('en',{dateStyle:'long'})} • ${e(v.venue)}</p></div>${v.url?`<p class="em"><a class="pill" href="${e(v.url)}" target="_blank" rel="noopener">Get tickets</a></p>`:''}`};
V.ep=()=>{PL=[];return`${back}<div class="hero">${epc}<h1>Your Episodes</h1><p>${e(L.owner)}</p></div><p class="em">Podcast episodes you save will show up here.</p>`};

function route(k){
  const v=$('#view'),st=k===1?v.scrollTop:0,h=location.hash.slice(2).split('/'),p=V[h[0]]?h[0]:'lib';
  cp=decodeURIComponent(h.slice(1).join('/'));
  $('#top').innerHTML=p=='lib'?libTop():'';v.dataset.p=p;
  v.innerHTML=V[p](cp);fit();v.scrollTop=st;
  if(k!==1){v.classList.remove('in');void v.offsetWidth;v.classList.add('in')}
  const t=['home','search'].includes(p)?p:'lib';
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v==t));
}

/* ---------- sheet / toast ---------- */
const sheet=h=>{$('#sheet').innerHTML=`<div class="bd" data-a="sx"></div><div class="sh">${h}</div>`;void $('#sheet').offsetWidth;$('#sheet').className='open'};
const sx=()=>{$('#sheet').className=''};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('on'),2000)};

/* ---------- player ---------- */
const setC=c=>document.documentElement.style.setProperty('--pc',c);
function col(t){const fb=()=>setC(`hsl(${hue(t.pl)} 60% 40%)`);if(!t.cover)return fb();const i=new Image();i.onload=()=>{try{const c=document.createElement('canvas').getContext('2d');c.canvas.width=c.canvas.height=1;c.drawImage(i,0,0,1,1);const d=c.getImageData(0,0,1,1).data;setC(`rgb(${d[0]},${d[1]},${d[2]})`)}catch(_){fb()}};i.onerror=fb;i.src=url(t.cover)}
function play(list,i,s){Q=list.slice();qi=i;src=s||Q[i].pl;load()}
function load(){const t=Q[qi];if(!t)return;au.src=url(t.src);au.play().catch(()=>{});U.rec[t.pl]=Date.now();save();col(t);pui();mui();ms(t);
  document.querySelectorAll('.tk').forEach(el=>el.classList.toggle('on',PL[el.dataset.v]?.id===t.id));if($('#list'))$('#list').innerHTML=lst()}
const nx=()=>{if(!Q.length)return;qi=shuf&&Q.length>1?(r=>r===qi?(r+1)%Q.length:r)(Math.random()*Q.length|0):(qi+1)%Q.length;load()};
const pv=()=>{if(!Q.length)return;if(au.currentTime>3)au.currentTime=0;else{qi=(qi-1+Q.length)%Q.length;load()}};
function pui(){const t=Q[qi];if(!t)return;const l=U.likes.includes(t.id);
$('#player').innerHTML=`<div class="ph"><button data-a="pc">${ic('down',28)}</button><span>${e(src)}</span><button data-a="tm" data-v="${e(t.id)}">${ic('dots')}</button></div>
<div class="art">${cv(t.pl,t.cover)}</div>
<div class="pi"><div><h2>${e(t.title)}</h2><p>${e(t.artist)}</p></div><button data-a="like" data-v="${e(t.id)}">${ic(l?'chk':'add',32)}</button></div>
<input id="sk" type="range" min="0" max="1000" value="0"><div class="tm"><span id="cur">0:00</span><span id="rem">-0:00</span></div>
<div class="ct"><button data-a="sf" class="${shuf?'g':''}">${ic('shuf',28)}</button><button data-a="pv">${ic('prev',32)}</button><button class="big pp" data-s="34" data-a="pp">${ic(au.paused?'play':'pause',34)}</button><button data-a="nx">${ic('next',32)}</button><button data-a="tmr" class="${tmr?'g':''}">${ic('tmr',26)}</button></div>
<div class="ft"><button data-a="dev">${ic('dev',22)}</button><span style="display:flex"><button data-a="sh">${ic('share',22)}</button><button data-a="qu">${ic('queue',22)}</button></span></div>`;tu()}
function mui(){const t=Q[qi],m=$('#mini');if(!t){m.innerHTML='';return}
m.innerHTML=`<div class="mi" data-a="po">${cv(t.pl,t.cover)}<div class="mt"><b>${e(t.title)}</b><span>${e(t.artist)}</span></div><button data-a="dev">${ic('dev',24)}</button><button data-a="like" data-v="${e(t.id)}">${ic(U.likes.includes(t.id)?'chk':'add',26)}</button><button class="pp" data-s="28" data-a="pp">${ic(au.paused?'play':'pause',28)}</button><i class="mp"><i id="mb"></i></i></div>`;tu()}
const ppu=()=>document.querySelectorAll('.pp').forEach(b=>b.innerHTML=ic(au.paused?'play':'pause',+b.dataset.s));
function tu(){const d=au.duration||0,c=au.currentTime||0,s=$('#sk');
  if(s&&!drag){s.value=d?c/d*1000:0;s.style.setProperty('--p',s.value/10+'%')}
  if($('#cur')&&!drag){$('#cur').textContent=fmt(c);$('#rem').textContent='-'+fmt(d-c)}
  if($('#mb'))$('#mb').style.width=(d?c/d*100:0)+'%'}
au.ontimeupdate=au.ondurationchange=tu;au.onplay=au.onpause=ppu;au.onended=nx;
function ms(t){if(!('mediaSession' in navigator))return;navigator.mediaSession.metadata=new MediaMetadata({title:t.title,artist:t.artist,album:t.pl,artwork:t.cover?[{src:url(t.cover)}]:[]});
  [['play',()=>au.play()],['pause',()=>au.pause()],['nexttrack',nx],['previoustrack',pv]].forEach(([a,f])=>{try{navigator.mediaSession.setActionHandler(a,f)}catch(_){}})}

/* ---------- actions ---------- */
const A={
go:v=>{location.hash='#/'+v},
back:()=>history.length>1?history.back():(location.hash='#/lib'),
chip:v=>{filt=filt==v?null:v;lib()},
ls:()=>{showS=!showS;q='';lib();$('#lq')?.focus()},
vw:()=>{U.grid=+!U.grid;save();lib()},
so:()=>sheet(`<h3>Sort by</h3>${Object.entries(SN).map(([k,v])=>`<button class="op${U.sort==k?' g':''}" data-a="ss" data-v="${k}">${v}${U.sort==k?ic('ok',20):''}</button>`).join('')}`),
ss:v=>{U.sort=v;save();sx();lib()},
add:()=>sheet(`<h3>Create</h3><button class="op" data-a="np">${ic('plus',28)}<span><b>Playlist</b><small>Build a playlist with songs</small></span></button>`),
np:()=>{sx();const n=(prompt('Playlist name')||'').trim();if(n&&!getPl(n)){U.custom.push({name:n,ids:[]});save();location.hash='#/pl/'+encodeURIComponent(n)}},
prof:()=>sheet(`<h3>${e(L.owner)}</h3><button class="op" data-a="rst">Reset likes, pins and playlists</button>`),
rst:()=>{if(confirm('Reset all local data?')){localStorage.removeItem('lib');location.reload()}},
im:k=>{const x=items().find(i=>i.key==k)||{n:k,cv:''},ro=/^(ar|ev):/.test(k);
  sheet(`<div class="shh">${x.cv}<b>${e(x.n)}</b></div><button class="op" data-a="pin" data-v="${e(k)}">${ic('pin')}${U.pins.includes(k)?'Unpin':'Pin'}</button>${ro?'':`<button class="op" data-a="dlt" data-v="${e(k)}">${ic('dlo')}${U.dl.includes(k)?'Remove download':'Download'}</button>`}${U.custom.some(c=>c.name==k)?`<button class="op" data-a="del" data-v="${e(k)}">${ic('x')}Delete playlist</button>`:''}`)},
pin:k=>{tog(U.pins,k);save();sx();route(1)},
dlt:k=>{tog(U.dl,k);save();sx();route(1);toast(U.dl.includes(k)?'Added to Downloaded':'Removed from Downloaded')},
del:k=>{U.custom=U.custom.filter(c=>c.name!=k);save();sx();location.hash='#/lib'},
play:i=>play(PL,+i,cp||'Search'),
pall:()=>PL.length&&play(PL,shuf?Math.random()*PL.length|0:0,cp),
shp:()=>{shuf=!shuf;route(1)},
tm:id=>{TM=id;const t=byId(id),l=U.likes.includes(id),inC=U.custom.some(c=>c.name==cp);
  sheet(`<div class="shh">${cv(t.pl,t.cover)}<div><b>${e(t.title)}</b><span>${e(t.artist)}</span></div></div><button class="op" data-a="like" data-v="${e(id)}">${ic(l?'chk':'add')}${l?'Remove from Liked Songs':'Add to Liked Songs'}</button><button class="op" data-a="atp">${ic('plus')}Add to playlist</button><button class="op" data-a="aq">${ic('queue')}Add to queue</button>${inC?`<button class="op" data-a="rmv">${ic('x')}Remove from this playlist</button>`:''}`)},
like:id=>{tog(U.likes,id);save();sx();pui();mui();route(1)},
atp:()=>sheet(`<h3>Add to playlist</h3>${U.custom.map(c=>`<button class="op" data-a="atc" data-v="${e(c.name)}">${ic('lib')}${e(c.name)}</button>`).join('')}<button class="op" data-a="np2">${ic('plus')}New playlist</button>`),
atc:n=>{const c=U.custom.find(c=>c.name==n);if(c&&!c.ids.includes(TM))c.ids.push(TM);save();sx();toast('Added to '+n);route(1)},
np2:()=>{sx();const n=(prompt('Playlist name')||'').trim();if(n&&!getPl(n)){U.custom.push({name:n,ids:[TM]});save();toast('Added to '+n);route(1)}},
rmv:()=>{const c=U.custom.find(c=>c.name==cp);if(c){c.ids=c.ids.filter(i=>i!=TM);save();sx();route(1)}},
aq:()=>{const t=byId(TM);sx();if(!Q.length)return play([t],0,t.pl);Q.push(t);toast('Added to queue')},
po:()=>$('#player').classList.add('open'),
pc:()=>$('#player').classList.remove('open'),
pp:()=>{if(Q.length)au.paused?au.play():au.pause()},
nx,pv,
sf:()=>{shuf=!shuf;pui()},
tmr:()=>sheet(`<h3>Sleep timer</h3>${[5,10,15,30,45,60].map(m=>`<button class="op${tmr==m?' g':''}" data-a="tset" data-v="${m}">${m} minutes</button>`).join('')}${tmr?`<button class="op" data-a="tset" data-v="0">Turn off timer</button>`:''}`),
tset:v=>{clearTimeout(tmrId);tmr=+v;if(tmr)tmrId=setTimeout(()=>{au.pause();tmr=0;pui()},tmr*60000);sx();pui();toast(tmr?`Sleep timer: ${tmr} min`:'Sleep timer off')},
qu:()=>sheet(`<h3>Queue</h3>${Q.map((t,i)=>`<button class="op${i==qi?' g':''}" data-a="qp" data-v="${i}"><span><b>${e(t.title)}</b><small>${e(t.artist)}</small></span></button>`).join('')}`),
qp:v=>{qi=+v;load();sx()},
sh:()=>{const t=Q[qi];navigator.share?navigator.share({title:t.title,text:`${t.title} — ${t.artist}`}).catch(()=>{}):toast('Sharing not supported here')},
dev:()=>toast('This device'),
toast:v=>toast(v),
sx};

document.addEventListener('click',ev=>{if(lp){lp=0;ev.preventDefault();return}const el=ev.target.closest('[data-a]');if(!el)return;ev.preventDefault();A[el.dataset.a]?.(el.dataset.v,el)});
document.addEventListener('touchstart',ev=>{const r=ev.target.closest('.r,.gc');if(r)tp=setTimeout(()=>{lp=1;A.im(r.dataset.key)},550)},{passive:true});
document.addEventListener('touchmove',()=>clearTimeout(tp),{passive:true});
document.addEventListener('touchend',()=>{clearTimeout(tp);setTimeout(()=>lp=0,350)},{passive:true});
document.addEventListener('contextmenu',ev=>{const r=ev.target.closest('.r,.gc');if(r){ev.preventDefault();A.im(r.dataset.key)}});
document.addEventListener('input',ev=>{const t=ev.target;
  if(t.id=='sk'){drag=1;t.style.setProperty('--p',t.value/10+'%');$('#cur').textContent=fmt(t.value/1000*(au.duration||0))}
  else if(t.id=='lq'){q=t.value;$('#list').innerHTML=lst()}
  else if(t.id=='si'){q2=t.value;$('#sres').innerHTML=sres()}});
document.addEventListener('change',ev=>{if(ev.target.id=='sk'){au.currentTime=ev.target.value/1000*(au.duration||0);drag=0}});

/* swipe down to close the player */
(()=>{const P=$('#player');let sy=null,dy=0,t0=0;
  P.addEventListener('touchstart',ev=>{if(!P.classList.contains('open')||ev.target.closest('input')){sy=null;return}sy=ev.touches[0].clientY;dy=0;t0=Date.now()},{passive:true});
  P.addEventListener('touchmove',ev=>{if(sy==null)return;dy=ev.touches[0].clientY-sy;if(dy>0){P.style.transition='none';P.style.transform=`translateY(${dy}px)`}},{passive:true});
  const end=()=>{if(sy==null)return;P.style.transition='';P.style.transform='';if(dy>110||(dy>40&&Date.now()-t0<250))P.classList.remove('open');sy=null;dy=0};
  P.addEventListener('touchend',end);P.addEventListener('touchcancel',end)})();

/* ---------- init ---------- */
(async()=>{
  try{L=Object.assign(L,await(await fetch('Musics/library.json?'+Date.now())).json())}catch(_){}
  L.playlists.forEach(p=>p.tracks.forEach(t=>{t.pl=p.name;t.id=t.src;t.cover=p.cover}));
  T=L.playlists.flatMap(p=>p.tracks);
  $('#nav').innerHTML=[['home','Home','home'],['search','Search','search'],['lib','Your Library','lib']].map(([v,l,i])=>`<button data-a="go" data-v="${v}">${ic(i,26)}<span>${l}</span></button>`).join('');
  addEventListener('hashchange',route);route();
})();
