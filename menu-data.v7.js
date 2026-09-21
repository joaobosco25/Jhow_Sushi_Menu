window.JOE_MENU = [
  {
    id: 'entradas',
    title: 'Entradas & Acompanhamentos',
    eyebrow: 'Para começar',
    items: [
      {name:'Sunomono', price:19.90, desc:'Salada leve de pepino japonês com gergelim (200g)'},
      {name:'Ceviche', price:19.90, desc:'Peixe marinado no limão com tempero especial (200g)'},
      {name:'Gyoza (Bovino / Suíno)', price:19.90, desc:'Pastéis orientais grelhados na chapa (6 unidades)'},
      {name:'Harumaki de Queijo', price:12.90, desc:'Rolinheiro de primavera crocante de queijo (6 un)'},
      {name:'Tartar de Salmão c/ Amêndoas', price:19.90, desc:'Salmão picado com lâminas de amêndoas (90g)'},
      {name:'Shimeji', price:22.90, desc:'Cogumelos salteados na manteiga e shoyu (200g)'},
      {name:'Camarão Empanado', price:29.90, desc:'Camarões crocantes (6 unidades)'},
      {name:'Tilápia Empanada (Individual)', price:19.90},
      {name:'Tilápia Empanada (Porção)', price:49.90},
      {name:'Porção Drumet Empanados', price:29.90},
      {name:'Gohan', price:9.90, desc:'Arroz japonês tradicional'},
      {name:'Arroz do Chef', price:19.90}
    ]
  },
  {
    id: 'quentes',
    title: 'Especiais & Pratos Quentes',
    eyebrow: 'Da cozinha',
    items: [
      {name:'Big Sushi Dog', price:19.90},
      {name:'JHOW Burguer de Salmão', price:29.90},
      {name:'Poke Salmão', price:39.90},
      {name:'Bentô de Salmão Grelhado', price:49.90},
      {name:'Bentô de Camarão Empanado', price:49.90},
      {name:'Yakisoba Misto (Indiv. 400g)', price:29.90, desc:'Carne, frango, legumes frescos, macarrão, shoyu e molho da casa'}
    ]
  },
  {
    id: 'temakis',
    title: 'Temakis',
    eyebrow: 'Clássicos',
    groups: [
      {label:'Com arroz', items:[
        {name:'Temaki Tradicional', price:19.90},
        {name:'Temaki Philadelphia', price:24.90},
        {name:'Temaki Salmão', price:24.90},
        {name:'Temaki Patê de Salmão Grelhado', price:24.90},
        {name:'Temaki Ebi Furai', price:34.90}
      ]},
      {label:'Sem arroz · 100% recheio', items:[
        {name:'Temaki Salmão', price:29.90},
        {name:'Temaki Hot', price:29.90},
        {name:'Temaki Philadelphia', price:34.00},
        {name:'Temaki Ebi Furai', price:42.90}
      ]}
    ]
  },
  {
    id: 'joys',
    title: 'Joys',
    eyebrow: '4 unidades',
    items: [
      {name:'Joy Salmão', price:29.90},
      {name:'Joy Geleia', price:35.00},
      {name:'Joy Maçaricado', price:35.90},
      {name:'Joy Polenguinho & Geleia de Pimenta', price:24.00, desc:'Salmão fresco, cubo de Polenguinho maçaricado e geleia de pimenta'}
    ]
  },
  {
    id: 'sashimis',
    title: 'Sashimis & Niguiris',
    eyebrow: 'Frescor',
    items: [
      {name:'Sashimi Salmão (6 un)', price:24.90},
      {name:'Sashimi Tilápia (6 un)', price:19.90},
      {name:'Sashimi Atum (6 un)', price:34.90},
      {name:'Niguiri Salmão (2 un)', price:9.90},
      {name:'Ussuzukuri Tilápia (10 fatias)', price:29.90},
      {name:'Ussuzukuri Salmão (10 fatias)', price:34.90}
    ]
  },
  {
    id: 'rolls',
    title: 'Rolls & Makis',
    eyebrow: 'Seleção da casa',
    items: [
      {name:'Hossomaki Sake Maki', price:19.90},
      {name:'Hot Roll (Tradicional)', price:24.00},
      {name:'Uramaki Philadelphia (10 un)', price:29.90},
      {name:'Uramaki Coroa (10 un)', price:34.90},
      {name:'Uramaki Ebi Furai', price:29.90},
      {name:'Neta Maki de Camarão (6 un)', price:39.90}
    ]
  },
  {
    id: 'combos',
    title: 'Combinados Especiais',
    eyebrow: 'Para compartilhar',
    featured: true,
    items: [
      {name:'Combinado Tókio (20 Peças)', price:59.90, desc:'5 niguiris salmão, 5 salmonmakis, 2 joys salmão, 3 uramakis salmão e 5 hot rolls'},
      {name:'Combinado Miyoshi Sushi', price:49.90, desc:'10 Hot Rolls + 1 Temaki à sua escolha'},
      {name:'Combo Hossomaki Filadélfia', price:32.90, desc:'10 peças de hossomaki Filadélfia com cream cheese, couve frita e gergelim'}
    ]
  },
  {
    id: 'grandes',
    title: 'Grandes Combinados',
    eyebrow: 'Experiência completa',
    featured: true,
    items: [
      {name:'Combinado Jhow Sushi (22 Peças)', price:69.90, desc:'4 Sashimis Salmão, 2 Niguiris Salmão, 4 Hossomakis Salmão, 4 Joys Salmão c/ Geleia, 6 Hot Rolls e 2 Mini Temakis'},
      {name:'Combinado Hamamatsu (28 Peças)', price:89.90, desc:'6 Sashimis, 4 Niguiris, 6 Hossomakis Salmão, 4 Uramakis Salmão, 2 Joys Salmão, 1 Temaki Salmão e 5 Hot Rolls'},
      {name:'Combinado Premium Isekai (60 Peças)', price:165.00, desc:'20 Uramakis Philadelphia, 20 Hot Rolls Philadelphia, 16 Sashimis Salmão e 4 Joys Salmão', premium:true}
    ]
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    eyebrow: 'Para acompanhar',
    groups: [
      {label:'Refrigerantes · R$ 7,90', items:[
        {name:'Coca', price:7.90},
        {name:'Coca Zero', price:7.90},
        {name:'Guaraná', price:7.90},
        {name:'Guaraná Zero', price:7.90},
        {name:'Sprite', price:7.90},
        {name:'Sprite Zero', price:7.90},
        {name:'Fanta Laranja', price:7.90},
        {name:'Fanta Uva', price:7.90},
        {name:'Água Tônica', price:7.90},
        {name:'Água Tônica Zero', price:7.90},
        {name:'Água sem Gás', price:5.90},
        {name:'Água com Gás', price:5.90}
      ]},
      {label:'Sucos · R$ 14,90', items:[
        {name:'Morango', price:14.90},
        {name:'Morango com Laranja', price:14.90},
        {name:'Abacaxi', price:14.90},
        {name:'Abacaxi com Hortelã', price:14.90},
        {name:'Limão', price:14.90},
        {name:'Laranja', price:14.90},
        {name:'Maracujá', price:14.90}
      ]},
      {label:'Cervejas Long Neck · R$ 11,90', items:[
        {name:'Heineken', price:11.90},
        {name:'Heineken Zero', price:11.90},
        {name:'Corona', price:11.90},
        {name:'Corona Zero', price:11.90},
        {name:'Stella Artois', price:11.90}
      ]}
    ]
  },
  {
    id: 'sobremesas',
    title: 'Sobremesas',
    eyebrow: 'Para finalizar',
    items: [
      {name:'Harumaky Chocolate', price:19.90, desc:'6 unidades'}
    ]
  }
];
