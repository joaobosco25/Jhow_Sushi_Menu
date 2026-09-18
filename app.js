(() => {
  const menu = window.JOE_MENU || [];
  const cfg = window.JOE_CONFIG || {};
  const brl = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  let toastTimer;
  let qrBuilt = false;

  const normalize = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

  function allItems(){
    const out=[];
    menu.forEach(section => {
      const groups = section.groups || [{label:null, items:section.items || []}];
      groups.forEach(group => group.items.forEach(item => out.push({section, group, item})));
    });
    return out;
  }

  function renderCategories(){
    $('#categories').innerHTML = menu.map((s,i)=>`<button class="category ${i===0?'active':''}" data-target="${s.id}">${s.title}</button>`).join('');
    $$('.category').forEach(btn => btn.addEventListener('click', ()=> {
      document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth', block:'start'});
    }));
  }

  function itemCard(item){
    return `<article class="menu-item ${item.premium?'premium':''}">
      <div class="item-copy"><h4>${item.name}</h4>${item.desc?`<p>${item.desc}</p>`:''}</div>
      <div class="item-side"><span class="price">${brl.format(item.price)}</span></div>
    </article>`;
  }

  function renderMenu(){
    $('#menuGrid').innerHTML = menu.map(section => {
      let body='';
      if(section.groups){
        body = section.groups.map(group => `<div class="group"><div class="group-label">${group.label}</div><div class="items">${group.items.map(itemCard).join('')}</div></div>`).join('');
      } else {
        body = `<div class="items">${(section.items||[]).map(itemCard).join('')}</div>`;
      }
      return `<section class="menu-section reveal ${section.featured?'featured':''}" id="${section.id}">
        <div class="section-title"><div><small>${section.eyebrow||''}</small><h3>${section.title}</h3></div></div>${body}
      </section>`;
    }).join('');
  }

  function renderSearch(q=''){
    const n=normalize(q).trim();
    const items=allItems().filter(x=>!n || normalize(`${x.item.name} ${x.item.desc||''} ${x.section.title}`).includes(n)).slice(0,24);
    $('#searchResults').innerHTML=items.length?items.map(x=>`<div class="search-result"><div><strong>${x.item.name}</strong><small>${x.section.title} · ${brl.format(x.item.price)}</small></div></div>`).join(''):'<p style="color:#8c756d">Nenhum item encontrado.</p>';
  }

  function openLayer(el){ el.classList.add('open'); el.setAttribute('aria-hidden','false'); document.body.classList.add('locked'); }
  function closeLayer(el){ el.classList.remove('open'); el.setAttribute('aria-hidden','true'); if(!$('.modal.open')) document.body.classList.remove('locked'); }
  function showToast(text){ const t=$('#toast'); t.textContent=text; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),1800); }

  function canonicalUrl(){
    if(cfg.menuUrl) return cfg.menuUrl;
    const u=new URL(window.location.href);
    u.hash='';u.search='';
    if(u.protocol==='file:') return 'https://SEU-USUARIO.github.io/SEU-REPOSITORIO/';
    return u.href;
  }

  function buildQr(){
    if(qrBuilt) return;
    const url=canonicalUrl();
    $('#qrUrl').textContent=url;
    const mount=$('#qrcode'); mount.innerHTML='';
    if(window.QRCode){
      new QRCode(mount,{text:url,width:220,height:220,colorDark:'#190a08',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H});
      qrBuilt=true;
    } else {
      mount.innerHTML='<p style="max-width:220px;color:#8c756d">Não foi possível carregar o gerador de QR. Confira sua conexão e tente novamente.</p>';
    }
  }

  function downloadQr(){
    const canvas=$('#qrcode canvas'); const img=$('#qrcode img');
    if(canvas){ const a=document.createElement('a');a.download='jhow-sushi-house-qrcode.png';a.href=canvas.toDataURL('image/png');a.click(); return; }
    if(img?.src){ const a=document.createElement('a');a.download='jhow-sushi-house-qrcode.png';a.href=img.src;a.click(); return; }
    showToast('QR Code ainda não está disponível');
  }

  function observeReveal(){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
    $$('.reveal').forEach(el=>io.observe(el));
  }

  function categorySpy(){
    const sections=menu.map(s=>document.getElementById(s.id)).filter(Boolean);
    const io=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ $$('.category').forEach(b=>b.classList.toggle('active',b.dataset.target===e.target.id)); } }); },{rootMargin:'-35% 0px -55% 0px',threshold:0});
    sections.forEach(s=>io.observe(s));
  }

  function petals(){
    const host=$('#petals'); if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setInterval(()=>{
      if(document.hidden) return;
      const p=document.createElement('span');p.className='petal';p.style.left=Math.random()*100+'vw';p.style.setProperty('--drift',`${(Math.random()-.5)*180}px`);p.style.animationDuration=`${6+Math.random()*6}s`;p.style.transform=`rotate(${Math.random()*180}deg)`;host.appendChild(p);setTimeout(()=>p.remove(),13000);
    },780);
  }

  function init(){
    renderCategories();renderMenu();renderSearch();observeReveal();categorySpy();petals();
    setTimeout(()=>$('#preloader').classList.add('done'),650);
    window.addEventListener('scroll',()=>$('#topbar').classList.toggle('scrolled',scrollY>40),{passive:true});

    $('#openSearch').addEventListener('click',()=>{openLayer($('#searchModal'));setTimeout(()=>$('#searchInput').focus(),120)});
    $$('[data-close-search]').forEach(x=>x.addEventListener('click',()=>closeLayer($('#searchModal'))));
    $('#searchInput').addEventListener('input',e=>renderSearch(e.target.value));

    const openQr=()=>{openLayer($('#qrModal'));setTimeout(buildQr,60)};
    $('#openQr').addEventListener('click',openQr);$('#heroQr').addEventListener('click',openQr);
    $$('[data-close-qr]').forEach(x=>x.addEventListener('click',()=>closeLayer($('#qrModal'))));
    $('#downloadQr').addEventListener('click',downloadQr);

    document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.modal.open').forEach(closeLayer)}});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
