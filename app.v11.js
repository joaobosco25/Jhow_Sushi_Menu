(() => {
  const menu = window.JOE_MENU || [];
  const cfg = window.JOE_CONFIG || {};
  const brl = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  let lenis = null;
  let qrBuilt = false;
  let toastTimer;

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
    const host = $('#categories');
    host.innerHTML = menu.map((s,i)=>`<button class="category ${i===0?'active':''}" data-target="${s.id}">${s.title}</button>`).join('');
    $$('.category').forEach(btn => btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, {offset:-145, duration:1.15});
      else target.scrollIntoView({behavior:reducedMotion?'auto':'smooth', block:'start'});
    }));
  }

  function itemCard(item){
    const media = item.image
      ? `<div class="item-media"><img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async"></div>`
      : '';
    return `<article class="menu-item ${item.image?'has-image ':''}${item.premium?'premium':''}">
      ${media}
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
      return `<section class="menu-section ${section.featured?'featured':''}" id="${section.id}">
        <div class="section-title"><div><small>${section.eyebrow||''}</small><h3>${section.title}</h3></div></div>${body}
      </section>`;
    }).join('');
  }

  function renderSearch(q=''){
    const n=normalize(q).trim();
    const items=allItems().filter(x=>!n || normalize(`${x.item.name} ${x.item.desc||''} ${x.section.title}`).includes(n)).slice(0,30);
    $('#searchResults').innerHTML=items.length
      ? items.map(x=>`<div class="search-result"><div><strong>${x.item.name}</strong><small>${x.section.title} · ${brl.format(x.item.price)}</small></div></div>`).join('')
      : '<p style="color:#8c756d">Nenhum item encontrado.</p>';
  }

  function canonicalUrl(){
    if(cfg.menuUrl) return cfg.menuUrl;
    const u=new URL(window.location.href); u.hash=''; u.search='';
    return u.protocol === 'file:' ? 'https://joaobosco25.github.io/Jhow_Sushi_Menu/' : u.href;
  }

  function buildQr(){
    if(qrBuilt) return;
    const url=canonicalUrl();
    $('#qrUrl').textContent=url;
    const mount=$('#qrcode'); mount.innerHTML='';
    if(window.QRCode){
      new QRCode(mount,{text:url,width:220,height:220,colorDark:'#170c09',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H});
      qrBuilt=true;
    } else {
      mount.innerHTML='<p style="max-width:220px;color:#8c756d">Não foi possível carregar o gerador de QR. Confira sua conexão e tente novamente.</p>';
    }
  }

  function downloadQr(){
    const canvas=$('#qrcode canvas'); const img=$('#qrcode img');
    if(canvas){ const a=document.createElement('a');a.download='QR_Jhow_Sushi_Menu.png';a.href=canvas.toDataURL('image/png');a.click();return; }
    if(img?.src){ const a=document.createElement('a');a.download='QR_Jhow_Sushi_Menu.png';a.href=img.src;a.click();return; }
    showToast('QR Code ainda não está disponível');
  }

  function showToast(text){
    const t=$('#toast'); t.textContent=text; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),1800);
  }

  function setupSmoothScroll(){
    if(reducedMotion || !window.Lenis) return;
    lenis = new Lenis({duration:1.08, smoothWheel:true, wheelMultiplier:.88, touchMultiplier:1.05});
    if(window.gsap && window.ScrollTrigger){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => {lenis.raf(time); requestAnimationFrame(raf)}; requestAnimationFrame(raf);
    }
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const target=$(a.getAttribute('href')); if(!target) return;
      e.preventDefault(); lenis.scrollTo(target,{offset:-80,duration:1.2});
    }));
  }

  function setupSplitText(){
    if(!window.SplitType || reducedMotion) return;
    $$('.split-title').forEach(el => {
      if(el.dataset.splitReady) return;
      new SplitType(el,{types:'lines,words'});
      el.dataset.splitReady='1';
    });
  }

  function introAnimation(){
    const preloader=$('#preloader');
    if(reducedMotion || !window.gsap){ preloader.style.display='none'; $$('.premium-reveal').forEach(x=>{x.style.opacity=1;x.style.transform='none'}); return; }

    const tl=gsap.timeline({defaults:{ease:'power4.out'}});
    tl.to('.loader-line i',{x:'0%',duration:.85,ease:'power2.inOut'})
      .to('.loader-ring',{rotation:130,duration:1.05,ease:'power2.inOut'},'<')
      .to('.loader-logo-wrap img',{scale:1.05,duration:.6},'<.15')
      .to('.loader-line i',{x:'100%',duration:.55,ease:'power2.inOut'})
      .to('.preloader-inner',{y:-18,opacity:0,duration:.48},'-=.15')
      .to('.preloader-bg',{scale:1.22,duration:.8},'<')
      .to(preloader,{yPercent:-100,duration:.82,ease:'expo.inOut'})
      .set(preloader,{display:'none'})
      .from('.topbar',{y:-34,opacity:0,duration:.75},'-=.28')
      .from('.hero-mobile-media img',{scale:.9,opacity:0,y:18,duration:.82,ease:'power3.out'},'-=.48')
      .from('.hero-meta',{y:22,opacity:0,duration:.65},'-=.48')
      .from('.hero-title .word',{yPercent:115,opacity:0,rotate:2,stagger:.045,duration:.95,ease:'power4.out'},'-=.5')
      .from('.hero-desc',{y:26,opacity:0,duration:.7},'-=.55')
      .from('.hero-actions',{y:24,opacity:0,duration:.7},'-=.52')
      .from('.japan-seal',{scale:.7,opacity:0,rotation:-20,duration:.9,ease:'back.out(1.5)'},'-=.72')
      .from('.scroll-pulse',{opacity:0,y:12,duration:.5},'-=.5');
  }

  function scrollAnimations(){
    if(reducedMotion || !window.gsap || !window.ScrollTrigger){
      $$('.premium-reveal,.menu-section').forEach(x=>{x.style.opacity=1;x.style.transform='none'}); return;
    }
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.hero-media-inner',{
      yPercent:12, scale:1.14, ease:'none',
      scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.1}
    });
    gsap.to('.hero-content',{
      yPercent:18, opacity:.2, ease:'none',
      scrollTrigger:{trigger:'.hero',start:'35% top',end:'bottom top',scrub:1}
    });
    gsap.to('.japan-seal',{
      rotation:42,y:70,ease:'none',
      scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.1}
    });
    gsap.to('.liquid-a',{rotation:80,x:-45,y:85,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}});

    gsap.to('.marquee-track',{xPercent:-50,ease:'none',scrollTrigger:{trigger:'.marquee',start:'top bottom',end:'bottom top',scrub:1.8}});

    $$('.premium-reveal').forEach(el => {
      gsap.to(el,{opacity:1,y:0,duration:.95,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}});
    });

    $$('.menu-section').forEach(section => {
      gsap.from(section,{opacity:0,y:58,scale:.985,duration:1.05,ease:'power4.out',scrollTrigger:{trigger:section,start:'top 88%',once:true}});
      const cards=$$('.menu-item',section);
      gsap.from(cards,{opacity:0,y:24,stagger:.045,duration:.62,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 77%',once:true}});
      const title=$('.section-title',section);
      if(title) gsap.from(title,{opacity:0,x:-24,duration:.72,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 84%',once:true}});
    });

    gsap.to('.manifesto-bg',{yPercent:8,scale:1.06,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1.2}});
    gsap.to('.manifesto-kanji',{x:-80,rotation:-5,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1.4}});

    ScrollTrigger.create({
      start:0,end:'max',
      onUpdate:self => gsap.set('#pageProgress',{scaleX:self.progress})
    });
  }

  function categorySpy(){
    const sections=menu.map(s=>document.getElementById(s.id)).filter(Boolean);
    if(!sections.length) return;
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        $$('.category').forEach(b=>b.classList.toggle('active',b.dataset.target===e.target.id));
        const active=$(`.category[data-target="${e.target.id}"]`);
        const categoryHost=$('#categories');
        if(active && categoryHost){
          // Move apenas a faixa horizontal de categorias.
          // scrollIntoView() podia deslocar o viewport inteiro no mobile.
          const targetLeft = active.offsetLeft - (categoryHost.clientWidth - active.offsetWidth) / 2;
          categoryHost.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: reducedMotion ? 'auto' : 'smooth'
          });
        }
      });
    },{rootMargin:'-34% 0px -58% 0px',threshold:0});
    sections.forEach(s=>io.observe(s));
  }

  function setupPointerEffects(){
    if(!finePointer || reducedMotion) return;

    const orb=$('#cursorOrb');
    if(window.gsap){
      const xTo=gsap.quickTo(orb,'left',{duration:.55,ease:'power3'});
      const yTo=gsap.quickTo(orb,'top',{duration:.55,ease:'power3'});
      window.addEventListener('pointermove',e=>{orb.style.opacity='.9';xTo(e.clientX);yTo(e.clientY)},{passive:true});
    }

    $$('.magnetic').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const x=e.clientX-(r.left+r.width/2), y=e.clientY-(r.top+r.height/2);
        if(window.gsap) gsap.to(el,{x:x*.13,y:y*.13,duration:.35,ease:'power3.out'});
      });
      el.addEventListener('pointerleave',()=>window.gsap && gsap.to(el,{x:0,y:0,duration:.55,ease:'elastic.out(1,.45)'}));
    });

    $$('.menu-section').forEach(section=>{
      section.addEventListener('pointermove',e=>{
        const r=section.getBoundingClientRect();
        const px=((e.clientX-r.left)/r.width)*100, py=((e.clientY-r.top)/r.height)*100;
        section.style.setProperty('--mx',`${px}%`); section.style.setProperty('--my',`${py}%`);
      });
    });

    $$('.menu-item').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        if(!window.gsap) return;
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left-r.width/2)/r.width;
        const y=(e.clientY-r.top-r.height/2)/r.height;
        gsap.to(card,{x:x*4,y:y*4,rotationX:-y*1.5,rotationY:x*1.5,duration:.28,ease:'power2.out',transformPerspective:800});
      });
      card.addEventListener('pointerleave',()=>window.gsap && gsap.to(card,{x:0,y:0,rotationX:0,rotationY:0,duration:.5,ease:'power3.out'}));
    });
  }

  function ambientParticles(){
    if(reducedMotion) return;
    const host=$('#ambientParticles');
    const count=window.innerWidth<700?7:12;
    for(let i=0;i<count;i++){
      const p=document.createElement('span'); p.className='ambient-particle'; host.appendChild(p);
      const animate=()=>{
        const x=Math.random()*window.innerWidth;
        const drift=(Math.random()-.5)*220;
        const duration=8+Math.random()*8;
        if(window.gsap){
          gsap.set(p,{x,y:-40,rotation:Math.random()*180,scale:.65+Math.random()*.7,opacity:.15+Math.random()*.4});
          gsap.to(p,{x:x+drift,y:window.innerHeight+80,rotation:540+Math.random()*360,duration,ease:'none',delay:Math.random()*6,onComplete:animate});
        }
      };
      if(window.gsap){ gsap.set(p,{x:Math.random()*window.innerWidth}); animate(); }
    }
  }

  function openLayer(el){
    el.classList.add('open'); el.setAttribute('aria-hidden','false'); document.body.classList.add('locked');
    lenis?.stop();
    if(window.gsap && !reducedMotion){
      gsap.to($('.modal-backdrop',el),{opacity:1,duration:.32,ease:'power2.out'});
      gsap.to($('.modal-panel',el),{opacity:1,y:0,scale:1,duration:.55,ease:'power4.out'});
    } else {
      const b=$('.modal-backdrop',el), p=$('.modal-panel',el); if(b)b.style.opacity=1;if(p){p.style.opacity=1;p.style.transform='none'}
    }
  }

  function closeLayer(el){
    const done=()=>{el.classList.remove('open');el.setAttribute('aria-hidden','true');if(!$('.modal.open')){document.body.classList.remove('locked');lenis?.start();}};
    if(window.gsap && !reducedMotion){
      gsap.to($('.modal-backdrop',el),{opacity:0,duration:.25});
      gsap.to($('.modal-panel',el),{opacity:0,y:22,scale:.98,duration:.28,ease:'power2.in',onComplete:done});
    } else done();
  }

  function bindUI(){
    window.addEventListener('scroll',()=>$('#topbar').classList.toggle('scrolled',scrollY>30),{passive:true});

    $('#openSearch').addEventListener('click',()=>{openLayer($('#searchModal'));setTimeout(()=>$('#searchInput').focus(),180)});
    $$('[data-close-search]').forEach(x=>x.addEventListener('click',()=>closeLayer($('#searchModal'))));
    $('#searchInput').addEventListener('input',e=>renderSearch(e.target.value));

    const openQr=()=>{openLayer($('#qrModal'));setTimeout(buildQr,80)};
    $('#openQr').addEventListener('click',openQr); $('#heroQr').addEventListener('click',openQr);
    $$('[data-close-qr]').forEach(x=>x.addEventListener('click',()=>closeLayer($('#qrModal'))));
    $('#downloadQr').addEventListener('click',downloadQr);

    document.addEventListener('keydown',e=>{if(e.key==='Escape') $$('.modal.open').forEach(closeLayer)});
  }

  function init(){
    renderCategories();
    renderMenu();
    renderSearch();
    setupSmoothScroll();
    setupSplitText();
    bindUI();
    categorySpy();

    requestAnimationFrame(()=>{
      scrollAnimations();
      setupPointerEffects();
      ambientParticles();
      introAnimation();
      if(window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  document.addEventListener('DOMContentLoaded',init);
})();
