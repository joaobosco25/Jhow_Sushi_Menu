# Jhow Sushi House — Cardápio Digital Premium

Versão **somente para visualização**, sem carrinho, sem botões `+` e sem fluxo de pedido.

## URL oficial e QR definitivo
O QR Code está fixado em:

`https://joaobosco25.github.io/Jhow_Sushi_Menu/`

Enquanto essa URL for mantida, o QR Code pode continuar sendo usado mesmo após futuras alterações de layout, itens e preços.

## Stack
- HTML5
- CSS3
- JavaScript puro
- GSAP 3
- GSAP ScrollTrigger
- Lenis Smooth Scroll
- SplitType
- QRCode.js
- GitHub Pages

## Animações / experiência premium
- preloader cinematográfico com timeline GSAP;
- reveal tipográfico por palavra com SplitType;
- parallax real do hero via ScrollTrigger;
- smooth scroll via Lenis sincronizado ao GSAP;
- marquee controlado por scroll;
- cards com stagger reveal;
- micro-parallax/tilt nos itens em desktop;
- botões magnéticos;
- cursor glow contextual;
- partículas decorativas animadas;
- manifesto com parallax e tipografia japonesa;
- barra de progresso de leitura;
- modais de busca e QR animados via GSAP;
- fallback para `prefers-reduced-motion`.

## Publicar no GitHub Pages
Substitua os arquivos do repositório `Jhow_Sushi_Menu` pelos arquivos desta pasta e faça commit/push na branch publicada pelo GitHub Pages.

Não altere `config.js` se quiser preservar o QR definitivo atual.


## Ajuste mobile do hero
Em telas de até 760px, o hero usa `assets/hero-mobile-dish.png`: somente o prato centralizado, sem texto embutido na imagem. Títulos, descrições e botões continuam como HTML/CSS. O desktop permanece usando `assets/hero.jpg` sem alteração.


## Correção mobile – navegação de categorias
- Corrigido deslocamento horizontal da página ao chegar em Bebidas/Sobremesas.
- A faixa de categorias agora rola internamente sem mover o viewport.
- Adicionadas contenções de largura/overflow para telas pequenas.
