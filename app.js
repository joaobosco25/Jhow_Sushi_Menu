(() => {
  const menu = window.JOE_MENU || [];
  const cfg = window.JOE_CONFIG || {};
  const brl = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const cart = JSON.parse(localStorage.getItem('joe-cart') || '{}');
  let toastTimer;
  let qrBuilt = false;

  const normalize = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const uid = (sectionId, item, idx) => `${sectionId}-${idx}-${normalize(item.name).replace(/[^a-z0-9]+/g,'-')}`;

  function allItems(){
    const out=[];
    menu.forEach(section => {
      const groups = section.groups || [{label:null, items:section.items || []}];
      groups.forEach(group => group.items.forEach((item, idx) => out.push({section, group, item, id:uid(section.id,item,idx)})));
    });
    return out;
  }

  function renderCategories(){
    $('#categories').innerHTML = menu.map((s,i)=>`<button class="category ${i===0?'active':''}" data-target="${s.id}">${s.title}</button>`).join('');
    $$('.category').forEach(btn => btn.addEventListener('click', ()=> {
      document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth', block:'start'});
    }));
  }

  function itemCard(section, item, idx){
    const id = uid(section.id,item,idx);
    return `<article class="menu-item ${item.premium?'premium':''}" data-item-id="${id}">
      <div class="item-copy"><h4>${item.name}</h4>${item.desc?`<p>${item.desc}</p>`:''}</div>
      <div class="item-side"><span class="price">${brl.format(item.price)}</span><button class="add-btn" data-add="${id}" aria-label="Adicionar ${item.name}">+</button></div>
    </article>`;
  }

  function renderMenu(){
    $('#menuGrid').innerHTML = menu.map(section => {
      let body='';
      if(section.groups){
        body = section.groups.map(group => `<div class="group"><div class="group-label">${group.label}</div><div class="items">${group.items.map((it,i)=>itemCard(section,it,i)).join('')}</div></div>`).join('');
      } else {
        body = `<div class="items">${(section.items||[]).map((it,i)=>itemCard(section,it,i)).join('')}</div>`;
      }
      return `<section class="menu-section reveal ${section.featured?'featured':''}" id="${section.id}">
        <div class="section-title"><div><small>${section.eyebrow||''}</small><h3>${section.title}</h3></div></div>${body}
      </section>`;
    }).join('');
    $$('[data-add]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); addToCart(btn.dataset.add); }));
  }

  function findById(id){ return allItems().find(x => x.id === id); }
  function addToCart(id){ cart[id]=(cart[id]||0)+1; persist(); animateAdd(id); showToast('Adicionado ao pedido'); }
  function changeQty(id,delta){ cart[id]=(cart[id]||0)+delta; if(cart[id]<=0) delete cart[id]; persist(); }
  function persist(){ localStorage.setItem('joe-cart',JSON.stringify(cart)); renderCart(); }
  function cartSummary(){
    let total=0,count=0;
    Object.entries(cart).forEach(([id,qty])=>{ const f=findById(id); if(!f) return; total += f.item.price*qty; count += qty; });
    return {total,count};
  }

  function renderCart(){
    const entries = Object.entries(cart).map(([id,qty])=>({found:findById(id),id,qty})).filter(x=>x.found);
    const {total,count}=cartSummary();
    $('#cartCount').textContent=count;
    $('#cartFabTotal').textContent=brl.format(total);
    $('#cartTotal').textContent=brl.format(total);
    $('#cartFab').classList.toggle('show',count>0);
    $('#cartEmpty').style.display=count?'none':'block';
    $('#cartItems').style.display=count?'grid':'none';
    $('#cartItems').innerHTML=entries.map(({found,id,qty})=>`<div class="cart-line">
      <div><strong>${found.item.name}</strong><small>${brl.format(found.item.price)} cada</small></div>
      <div class="qty"><button data-qty="-1" data-id="${id}" aria-label="Diminuir">−</button><b>${qty}</b><button data-qty="1" data-id="${id}" aria-label="Aumentar">+</button></div>
    </div>`).join('');
    $$('[data-qty]').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.id,Number(b.dataset.qty))));
    const phone=(cfg.whatsappNumber||'').replace(/\D/g,'');
    $('#checkoutBtn').textContent = phone ? 'Enviar pedido pelo WhatsApp' : 'Copiar pedido';
    $('#checkoutHint').style.display = phone ? 'none' : 'block';
  }

  function orderText(){
    const entries=Object.entries(cart).map(([id,qty])=>({found:findById(id),qty})).filter(x=>x.found);
    const {total}=cartSummary();
    const lines=[`Olá! Gostaria de fazer um pedido no ${cfg.restaurantName||'Jhow Sushi House'}:`, ''];
    entries.forEach(({found,qty})=>lines.push(`${qty}x ${found.item.name} — ${brl.format(found.item.price*qty)}`));
    lines.push('',`Total: ${brl.format(total)}`);
    return lines.join('\n');
  }

  async function checkout(){
    const {count}=cartSummary(); if(!count){showToast('Adicione um item primeiro'); return;}
    const phone=(cfg.whatsappNumber||'').replace(/\D/g,'');
    const text=orderText();
    if(phone){ window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,'_blank','noopener'); }
    else { try{ await navigator.clipboard.writeText(text); showToast('Pedido copiado'); } catch{ showToast('Não foi possível copiar'); } }
  }

  function renderSearch(q=''){
    const n=normalize(q).trim();
    const items=allItems().filter(x=>!n || normalize(`${x.item.name} ${x.item.desc||''} ${x.section.title}`).includes(n)).slice(0,24);
    $('#searchResults').innerHTML=items.length?items.map(x=>`<div class="search-result"><div><strong>${x.item.name}</strong><small>${x.section.title} · ${brl.format(x.item.price)}</small></div><button data-search-add="${x.id}" aria-label="Adicionar ${x.item.name}">+</button></div>`).join(''):'<p style="color:#8c756d">Nenhum item encontrado.</p>';
    $$('[data-search-add]').forEach(b=>b.addEventListener('click',()=>addToCart(b.dataset.searchAdd)));
  }

  function openLayer(el){ el.classList.add('open'); el.setAttribute('aria-hidden','false'); document.body.classList.add('locked'); }
  function closeLayer(el){ el.classList.remove('open'); el.setAttribute('aria-hidden','true'); if(!$('.drawer.open,.modal.open')) document.body.classList.remove('locked'); }
  function showToast(text){ const t=$('#toast'); t.textContent=text; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),1800); }
  function animateAdd(id){ const card=$(`[data-item-id="${CSS.escape(id)}"]`); if(card){card.animate([{transform:'scale(1)'},{transform:'scale(1.015)'},{transform:'scale(1)'}],{duration:260});}}

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
    renderCategories();renderMenu();renderCart();renderSearch();observeReveal();categorySpy();petals();
    setTimeout(()=>$('#preloader').classList.add('done'),650);
    window.addEventListener('scroll',()=>$('#topbar').classList.toggle('scrolled',scrollY>40),{passive:true});

    $('#cartFab').addEventListener('click',()=>openLayer($('#cartDrawer')));
    $$('[data-close-cart]').forEach(x=>x.addEventListener('click',()=>closeLayer($('#cartDrawer'))));
    $('#checkoutBtn').addEventListener('click',checkout);

    $('#openSearch').addEventListener('click',()=>{openLayer($('#searchModal'));setTimeout(()=>$('#searchInput').focus(),120)});
    $$('[data-close-search]').forEach(x=>x.addEventListener('click',()=>closeLayer($('#searchModal'))));
    $('#searchInput').addEventListener('input',e=>renderSearch(e.target.value));

    const openQr=()=>{openLayer($('#qrModal'));setTimeout(buildQr,60)};
    $('#openQr').addEventListener('click',openQr);$('#heroQr').addEventListener('click',openQr);
    $$('[data-close-qr]').forEach(x=>x.addEventListener('click',()=>closeLayer($('#qrModal'))));
    $('#downloadQr').addEventListener('click',downloadQr);

    document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.drawer.open,.modal.open').forEach(closeLayer)}});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
