# Jhow Sushi House — GitHub Pages (v7 cache fix)

Versão preparada para corrigir divergência entre Live Server e GitHub Pages causada por cache de arquivos estáticos no navegador/CDN.

## O que foi alterado
- `style.css` -> `style.v7.css`
- `app.js` -> `app.v7.js`
- `menu-data.js` -> `menu-data.v7.js`
- `config.js` -> `config.v7.js`
- referências do `index.html` atualizadas
- cache-busting também aplicado às imagens principais
- mantida a correção mobile: imagem do prato separada e centralizada; o texto permanece em HTML/CSS
- mantida correção de overflow horizontal das categorias
- sobremesa Harumaky Chocolate: R$ 19,90 / 6 unidades
- QR permanece apontando para https://joaobosco25.github.io/Jhow_Sushi_Menu/

## Publicação
Substitua os arquivos da RAIZ do repositório pelos arquivos deste pacote, incluindo a pasta `assets/`.
Não envie a pasta externa do ZIP como subpasta: `index.html` deve ficar na raiz do repositório.

Depois do commit, aguarde o GitHub Pages concluir o deploy e abra novamente a URL.
