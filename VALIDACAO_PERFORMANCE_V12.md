# Validação V12 — carregamento inicial

- `menu-data.v10.js` preservado sem alterações de conteúdo/preços.
- 74 referências de imagens do cardápio verificadas; nenhum arquivo ausente.
- Nenhum JavaScript externo bloqueia mais o carregamento inicial.
- Fontes do Google passaram a carregar de forma não bloqueante.
- Preloader não depende mais de GSAP e possui saída automática de segurança em menos de 1,3 s mesmo se o JavaScript principal falhar.
- Entrada normal remove o preloader assim que o conteúdo local é inicializado, com fade de 0,28 s.
- GSAP, ScrollTrigger, Lenis, SplitType e QRCode.js foram removidos do caminho crítico.
- QR Code passa a usar o PNG local já presente em `assets/`.
- Imagens dos itens continuam com `loading="lazy"` e `decoding="async"`.
- Animações de rolagem usam `IntersectionObserver`, sem loop contínuo no celular.
- Efeitos de ponteiro são restritos a dispositivos com mouse/hover.
- Sintaxe de `app.v12.js` validada com `node --check`.
- Links locais de CSS, JS e imagens do `index.html` verificados; nenhum arquivo ausente.
