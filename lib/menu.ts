/**
 * Cardápio do Almanaque, transcrito do cardápio oficial (PDF).
 * Nomes, descrições e preços estão iguais ao original.
 *
 * Para trocar preço: altere `preco`.
 * Para colocar foto: salve em /public/pratos e preencha `foto` (ex.: "/pratos/tradica.jpg").
 */

export type Opcao = {
  id: string;
  nome: string;
  /** Em grupos "base", é o preço do item. Em grupos "adicional", soma ao preço. */
  preco?: number;
  descricao?: string;
};

export type GrupoOpcoes = {
  id: string;
  titulo: string;
  /** Nome curto usado na comanda e na mensagem do WhatsApp. */
  rotulo?: string;
  ajuda?: string;
  obrigatorio: boolean;
  /** "base" define o preço do item; "adicional" soma ao preço; "escolha" não mexe no preço. */
  tipo: "base" | "adicional" | "escolha";
  opcoes: Opcao[];
  /** Só aparece se outra escolha tiver sido feita (ex.: ponto da carne só para cortes bovinos). */
  aplicaSe?: { grupo: string; opcoes: string[] };
};

export type Item = {
  id: string;
  nome: string;
  desc?: string | string[];
  /** Preço em reais. Itens com grupo "base" podem não ter preço fixo. */
  preco?: number;
  veggie?: boolean;
  alcool?: boolean;
  /** Servido só no salão (não entra na comanda). */
  soNaCasa?: boolean;
  foto?: string;
  /** Frase curta usada só na vitrine "Comece por estes" (não aparece no cardápio). */
  causo?: string;
  grupos?: GrupoOpcoes[];
};

export type Bloco = { titulo?: string; itens: Item[] };

export type Secao = {
  id: string;
  titulo: string;
  chamada?: string;
  blocos: Bloco[];
  /** Quadro de adicionais exibido no fim da seção, como no cardápio impresso. */
  quadro?: { titulo: string; linhas: [string, string][]; nota?: string };
  /** Seção montada em passos (Grelhados acompanhados). */
  passos?: boolean;
  /** Seção mostra espaço de foto nos itens. */
  comFotos?: boolean;
};

export type Aba = { id: string; titulo: string; secoes: Secao[] };

/* ---------- Grupos reutilizados ---------- */

const PONTO: Omit<GrupoOpcoes, "id" | "aplicaSe"> = {
  titulo: "Ponto da carne",
  rotulo: "Ponto",
  obrigatorio: true,
  tipo: "escolha",
  opcoes: [
    { id: "mal", nome: "Mal passado" },
    { id: "ao-ponto", nome: "Ao ponto" },
    { id: "bem", nome: "Bem passado" },
  ],
};

const pontoSimples: GrupoOpcoes = { id: "ponto", ...PONTO };

const fritasAdicional: GrupoOpcoes = {
  id: "fritas",
  titulo: "Eu quero que acompanhe fritas!",
  rotulo: "Fritas",
  obrigatorio: false,
  tipo: "adicional",
  opcoes: [
    { id: "tradicionais", nome: "Fritas tradicionais", preco: 10 },
    { id: "cajun", nome: "Fritas cajun", preco: 12 },
  ],
};

const grelhadoNoRisoto: GrupoOpcoes[] = [
  {
    id: "grelhado",
    titulo: "Adicione um grelhado ao seu risoto",
    rotulo: "Grelhado",
    ajuda: "Opcional",
    obrigatorio: false,
    tipo: "adicional",
    opcoes: [
      { id: "entrecote", nome: "Entrecôte", preco: 29 },
      { id: "tornedor", nome: "Tornedor", preco: 38 },
      { id: "sobrecoxa", nome: "Sobrecoxa", preco: 21 },
    ],
  },
  { id: "ponto", ...PONTO, aplicaSe: { grupo: "grelhado", opcoes: ["entrecote", "tornedor"] } },
];

/* ---------- Cardápio ---------- */

export const cardapio: Aba[] = [
  {
    id: "petiscos",
    titulo: "Pra começar",
    secoes: [
      {
        id: "cortesia",
        titulo: "Cortesia da casa",
        blocos: [
          {
            itens: [
              {
                id: "pipoquinha",
                nome: "Pipoquinha de tira gosto",
                desc: "Pipoca com gostinho de quero mais e o tempero é secreto. Quer tentar descobrir?",
                soNaCasa: true,
              },
            ],
          },
        ],
      },
      {
        id: "beliscos",
        titulo: "Beliscos",
        chamada: "Vamos começar por aqui?",
        comFotos: true,
        blocos: [
          {
            itens: [
              {
                id: "burrata",
                nome: "Burrata com Tomate Confit",
                veggie: true,
                preco: 69,
                causo: "Burrata artesanal, tomatinho confit e pão quentinho do lado. O pão é pra não sobrar nada no prato.",
                desc: "Burrata de qualidade artesanal, confit de tomate cereja, prato de rúcula e manjericão feitos na casa. Acompanha focaccia tostada ou pão de azeite quentinho.",
                grupos: [
                  {
                    id: "pao",
                    titulo: "Acompanha",
                    rotulo: "Acompanha",
                    obrigatorio: true,
                    tipo: "escolha",
                    opcoes: [
                      { id: "focaccia", nome: "Focaccia tostada" },
                      { id: "pao-azeite", nome: "Pão de azeite quentinho" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "compartilhar",
        titulo: "Para compartilhar",
        chamada: "Impossível pedir um só",
        comFotos: true,
        blocos: [
          {
            itens: [
              {
                id: "croqueta",
                nome: "Croqueta de pamonha com alho poró",
                preco: 34,
                desc: "Croqueta espanhola de milho verde e alho poró, crocante por fora e cremosa por dentro. Servido com aioli de páprica e molho de pimenta.",
              },
              {
                id: "bolinho-mandioca",
                nome: "Bolinho de mandioca emporcalhado",
                preco: 34,
                desc: "Mandioca, porco desfiado braseado em seu próprio caldo com cerveja preta e blend de queijos, sequinho e muito saboroso. Servido com aioli de páprica, aioli de ervas e molho de pimenta.",
              },
              {
                id: "franguinho",
                nome: "Franguinho frito do Alma",
                preco: 40,
                desc: "Sobrecoxa de frango no empanento super crocante ao estilo Kentucky a la minute envoltos em um delicioso molho buffalo a base de manteiga.",
              },
              {
                id: "kf-flor",
                nome: "KF flor - Versão Veggie",
                veggie: true,
                preco: 36,
                desc: "Versão veggie do nosso Franguinho Frito do Alma, quem não pegou a piada do nome tente mais uma vez! Couve flor frita, douradinha e crocante, essa versão veggie briga de frente com o franguinho.",
              },
              {
                id: "milanesa",
                nome: "Milanesa com fonduta de queijo",
                preco: 64,
                causo: "Mignon empanado à moda “milanga” argentina, cortado à palito e afogado em fonduta de queijo. Pede pra mesa toda.",
                desc: "Mignon empanado à moda “milanga” Argentina, tenra e suculenta, cortada à palito e generosamente regada com fonduta de queijo.",
              },
            ],
          },
        ],
      },
      {
        id: "alma-brasileira",
        titulo: "Alma Brasileira",
        chamada: "Clássico é clássico, mas esses são com o nosso jeito!",
        comFotos: true,
        blocos: [
          {
            itens: [
              {
                id: "dadinho",
                nome: "Dadinho de tapioca com melaço picante",
                veggie: true,
                preco: 32,
                desc: "Clássico Dadinho de tapioca na nossa versão. Mais queijudo, aromatizado com ervas e servido com melaço picante.",
              },
            ],
          },
        ],
      },
      {
        id: "batatinhas",
        titulo: "As batatinhas com Alma",
        chamada: "O difícil é parar na primeira",
        comFotos: true,
        blocos: [
          {
            itens: [
              {
                id: "batata-tradicional",
                nome: "Batatas tradicionais",
                veggie: true,
                preco: 28,
                desc: "Batatas fritas fininhas e crocantes à francesa servidas com maionese do Alma aromatizada com alecrim.",
              },
              {
                id: "batata-cajun",
                nome: "Batatas Cajun",
                veggie: true,
                preco: 34,
                desc: "Fritas envoltas por tempero levemente picante norte-americano ao estilo Cajun servidas com aioli de páprica.",
              },
              {
                id: "batata-caccio",
                nome: "Batatas Caccio e Peppe",
                veggie: true,
                preco: 40,
                desc: "Espuma de parmesão, chuvinha de parmesão e um toque de pimenta do reino.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "burgers",
    titulo: "Burgers",
    secoes: [
      {
        id: "burgers-sandubas",
        titulo: "Burgers & Sandubas",
        chamada: "Para honrar onde tudo começou!",
        comFotos: true,
        quadro: {
          titulo: "Eu quero que acompanhe fritas!",
          linhas: [
            ["+ Tradicionais", "+10"],
            ["+ Cajuns", "+12"],
          ],
        },
        blocos: [
          {
            itens: [
              {
                id: "alma-chicken",
                nome: "Alma Chicken Sanduíche",
                preco: 35,
                desc: "Sobrecoxa empanada ao estilo Kentucky fried chicken envolta por molho buffalo, pão brioche, queijo prato, picles de cebola agridoce e aioli de páprica.",
                grupos: [fritasAdicional],
              },
              {
                id: "tradica",
                nome: "Tradiça",
                preco: 36,
                desc: "Angus 160g, pão brioche, picles de cebola agridoce, queijo prato, farofa de bacon, tomate, alface e maionese do Alma aromatizada com alecrim.",
                grupos: [fritasAdicional],
              },
              {
                id: "burger",
                nome: "Burger",
                preco: 34,
                desc: "Angus 160g, pão brioche, queijo e maionese do Alma aromatizada com alecrim.",
                grupos: [fritasAdicional],
              },
              {
                id: "bacon",
                nome: "Bacon",
                preco: 38,
                desc: "Angus 160g, pão brioche, queijo prato, farofa de bacon e maionese do Alma aromatizada com alecrim.",
                grupos: [fritasAdicional],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "pratos",
    titulo: "Pratos",
    secoes: [
      {
        id: "risotos",
        titulo: "Risotos",
        chamada: "Finalmente eles chegaram na cidade!",
        comFotos: true,
        quadro: {
          titulo: "Adicione um grelhado ao seu risoto e seja mais feliz:",
          linhas: [
            ["Risoto de sua preferência + Entrecôte", "+ R$ 29"],
            ["Risoto de sua preferência + Tornedor", "+ R$ 38"],
            ["Risoto de sua preferência + Sobrecoxa", "+ R$ 21"],
          ],
          nota: "*Valores adicionais ao risoto",
        },
        blocos: [
          {
            itens: [
              {
                id: "risoto-caprese",
                nome: "Risoto Caprese",
                veggie: true,
                preco: 60,
                desc: "Base de caldo de legumes, passata de tomate italiano, mussarela de búfala, tomatinho confit, manjericão e molho pesto.",
                grupos: grelhadoNoRisoto,
              },
              {
                id: "risoto-sua",
                nome: "Risoto Suã",
                preco: 60,
                causo: "Caldo de suã, picles de cebola queimada e óleo de salsa. O risoto que demorou, mas finalmente chegou na cidade.",
                desc: "Base de caldo de suã, mini brotos, picles de cebola queimada e óleo de salsa.",
                grupos: grelhadoNoRisoto,
              },
            ],
          },
        ],
      },
      {
        id: "grelhados",
        titulo: "Grelhados • fogo & ponto",
        chamada: "Com muito carinho, nossa sugestões prontas.",
        comFotos: true,
        blocos: [
          {
            itens: [
              {
                id: "entrecote-paris",
                nome: "L’Entrecôte de Paris",
                preco: 79,
                desc: "Entrecôte/Ancho, fritas à francesa, salada verde e steak sauce L’ancienne à base de mostarda e creme de leite. Fica um absurdo de bom. Não deixe de raspar o prato até a última gota.",
                grupos: [pontoSimples],
              },
              {
                id: "tornedor-alma",
                nome: "Tornedor do Alma",
                preco: 88,
                causo: "Mignon alto, nosso arrozinho especial e um molho gravy de receita secreta. Secreta mesmo: nem adianta perguntar.",
                desc: "Tornedor/Mignon alto, fritas à francesa, nosso arrozinho mais do que especial (ovo mexido, panko crocante, salsinha, manteiga e lascas de alho) e steak sauce/molho gravy à base de um rico caldo de carnes, inspirado nos bistrôs parisienses com suas receitas secretas transmitidas por gerações (a nossa não seria diferente, também é secreta).",
                grupos: [pontoSimples],
              },
              {
                id: "sobrecoxa-alma",
                nome: "Sobrecoxa desossada do Alma",
                preco: 70,
                desc: "Sobrecoxa marinada ao nosso jeitinho especial pra deixar aquela pelinha crocante e douradinha, purê de batatas lisinho embebido pelo nosso molho gravy e molho gremolata acompanhando o corte.",
              },
            ],
          },
        ],
      },
      {
        id: "grelhados-escolha",
        titulo: "Grelhados acompanhados • À sua escolha",
        passos: true,
        blocos: [
          {
            itens: [
              {
                id: "grelhado-escolha",
                nome: "Grelhado acompanhado",
                grupos: [
                  {
                    id: "corte",
                    titulo: "Passo 1: Escolha seu corte",
                    rotulo: "Corte",
                    obrigatorio: true,
                    tipo: "base",
                    opcoes: [
                      {
                        id: "entrecote",
                        nome: "Entrecôte/Ancho",
                        preco: 72,
                        descricao:
                          "Oriundo do começo do contra filé para os Franceses “L’Entrecote” e para os hermanitos Argentinos “Bife Ancho”.",
                      },
                      {
                        id: "tornedor",
                        nome: "Tornedor/Mignon",
                        preco: 80,
                        descricao: "O corte mais nobre, alto e tenro do filé mignon",
                      },
                      {
                        id: "sobrecoxa",
                        nome: "Sobrecoxa desossada",
                        preco: 66,
                        descricao: "Marinada do nosso jeitinho especial",
                      },
                    ],
                  },
                  { id: "ponto", ...PONTO, aplicaSe: { grupo: "corte", opcoes: ["entrecote", "tornedor"] } },
                  {
                    id: "acompanhamento",
                    titulo: "Passo 2: Escolha seu acompanhamento",
                    rotulo: "Acompanhamento",
                    ajuda: "*Um acompanhamento por corte",
                    obrigatorio: true,
                    tipo: "escolha",
                    opcoes: [
                      { id: "pure", nome: "Purê de batata", descricao: "Clássico de bistrô, bem amanteigado, liso e aveludado. Você vai se surpreender!" },
                      { id: "fritas", nome: "Fritas", descricao: "Tradicionais à francesa" },
                      { id: "arrozinho", nome: "Nosso arrozinho", descricao: "Ovo mexido, panko crocante e douradinha, salsinha manteiga e lascas de alho" },
                      { id: "salada", nome: "Salada verde", descricao: "Seleção de folhas verdes do dia e vinagrete de cebola caramelizada" },
                    ],
                  },
                  {
                    id: "molho",
                    titulo: "Passo 3: Escolha seu molho",
                    rotulo: "Molho",
                    ajuda: "*Um molho por corte",
                    obrigatorio: true,
                    tipo: "escolha",
                    opcoes: [
                      { id: "gremolata", nome: "Gremolata", descricao: "Cebolinha, azeite de oliva, tomilho e zesty de limão siciliano" },
                      { id: "ancienne", nome: "L’ancienne", descricao: "A base de mostarda L’ancienne e creme de leite" },
                      { id: "gravy", nome: "Steak suave/gravy", descricao: "Demi glacé de caldo de carne, reduzido com cerveja preta e ervas aromáticas" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "especial",
        titulo: "Especial",
        chamada: "Surpreende até os mais desconfiados",
        comFotos: true,
        blocos: [
          {
            itens: [
              {
                id: "parmegiana-beringela",
                nome: "Parmegiana de beringela",
                veggie: true,
                preco: 55,
                desc: "Beringela empanada, com molho de tomate rústico da casa, acompanha arroz e fritas",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "doces",
    titulo: "Doces",
    secoes: [
      {
        id: "sobremesas",
        titulo: "Sobremesas",
        chamada: "O grand finale que você merece",
        comFotos: true,
        blocos: [
          {
            itens: [
              {
                id: "duo-brigadeiro",
                nome: "Duo Brigadeiro de colher",
                preco: 16,
                desc: ["Brigadeiro de cacau 100% com caramelo crocante e flor de sal", "Brigadeiro de paçoca"],
              },
              {
                id: "brownie",
                nome: "Brownie chocolatudo",
                preco: 23,
                desc: "Brownie de chocolate, servido com sorvete de creme e finalizado com ganache de chocolate",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "drinks",
    titulo: "Drinks e vinhos",
    secoes: [
      {
        id: "carta-drinks",
        titulo: "Carta de drinks",
        chamada: "Para acompanhar (ou para resolver)",
        blocos: [
          {
            titulo: "Espumantes & Clássicos",
            itens: [
              { id: "aperol", nome: "Aperol Spritz", preco: 32, alcool: true, desc: "Espumante, aperol e água com gás" },
              { id: "mimosa", nome: "Mimosa", preco: 28, alcool: true, desc: "Espumante e suco de laranja" },
              { id: "negroni", nome: "Negroni", preco: 30, alcool: true, desc: "Gin, Vermouth rosso e Campari" },
              { id: "negroni-defumado", nome: "Negroni Defumado", preco: 35, alcool: true, desc: "Gin, Vermouth rosso e Campari - finalizado com aroma defumado marcante" },
            ],
          },
          {
            titulo: "Gin",
            itens: [
              { id: "gin-classico", nome: "Gin clássico", preco: 34, alcool: true, desc: "Gin, água tônica e especiarias" },
              { id: "gin-almanaque", nome: "Gin Almanaque", preco: 36, alcool: true, desc: "Gin, água tônica, especiarias e xarope de acerola" },
              { id: "fitzgerald", nome: "Fitzgerald", preco: 35, alcool: true, desc: "Gin, suco de limão siciliano, xarope de açúcar e Angostura Orange" },
            ],
          },
          {
            titulo: "Autorais",
            itens: [
              { id: "sun", nome: "Sun", preco: 36, alcool: true, desc: "Campari, suco de maracujá coado, xarope de mel com baunilha" },
              {
                id: "tres-limoes",
                nome: "3 limões",
                alcool: true,
                desc: "Mix de limão rosa, taiti e siciliano, xarope de açúcar e gelo melaço",
                grupos: [
                  {
                    id: "base",
                    titulo: "Escolha a base",
                    rotulo: "Base",
                    obrigatorio: true,
                    tipo: "base",
                    opcoes: [
                      { id: "smirnoff", nome: "Smirnoff", preco: 27 },
                      { id: "absolut", nome: "Absolut", preco: 30 },
                      { id: "sagatiba", nome: "Sagatiba (cachaça)", preco: 25 },
                    ],
                  },
                ],
              },
              {
                id: "moscow-mule",
                nome: "Moscow mule",
                alcool: true,
                desc: "Vodka, xarope de gengibre, suco de limão e espuma da casa",
                grupos: [
                  {
                    id: "base",
                    titulo: "Escolha a vodka",
                    rotulo: "Vodka",
                    obrigatorio: true,
                    tipo: "base",
                    opcoes: [
                      { id: "smirnoff", nome: "Smirnoff", preco: 30 },
                      { id: "absolut", nome: "Absolut", preco: 32 },
                    ],
                  },
                ],
              },
              { id: "jorge-amado", nome: "Jorge Amado", preco: 32, alcool: true, desc: "Suco de maracujá coado, suco de limão, xarope de especiarias, cachaça, caviar de maracujá" },
            ],
          },
        ],
      },
      {
        id: "vinhos",
        titulo: "Carta de vinhos",
        chamada: "Na dúvida, vai de vinho",
        blocos: [
          {
            itens: [
              { id: "cosecha-merlot", nome: "Cosecha Tarapacá Merlot (Chile)", preco: 68, alcool: true, desc: "Vinho macio e frutado, com notas de ameixa e leve toque herbal. Fácil de beber, ótimo para o dia a dia." },
              { id: "casillero-merlot", nome: "Casillero del Diablo Reserva Merlot (Chile)", preco: 92, alcool: true, desc: "Merlot mais estruturado, com frutas maduras, toques de baunilha e taninos suaves. Equilibrado e elegante." },
              { id: "tarapaca-pinot", nome: "Tarapacá Reserva Pinot Noir (Chile)", preco: 98, alcool: true, desc: "Leve e delicado, com notas de frutas vermelhas e leve especiaria. Fresco, versátil e muito gastronômico." },
            ],
          },
        ],
      },
      {
        id: "drinks-sem-alcool",
        titulo: "Drinks não alcoólicos",
        chamada: "O lado sóbrio da mesa também brinda",
        blocos: [
          {
            itens: [
              { id: "moscow-sem", nome: "Moscow mule", preco: 26, desc: "Água de coco, xarope de gengibre, suco de limão e espuma da casa" },
              { id: "jorge-amado-sem", nome: "Jorge Amado", preco: 26, desc: "Suco de maracujá coado, suco de limão, xarope de especiarias, água de coco e caviar de maracujá" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "bebidas",
    titulo: "Bebidas",
    secoes: [
      {
        id: "cervejas-600",
        titulo: "Cervejas 600ml",
        blocos: [
          {
            itens: [
              { id: "heineken-600", nome: "Heineken", preco: 19, alcool: true },
              { id: "original-600", nome: "Original", preco: 17, alcool: true },
              { id: "spaten-600", nome: "Spaten", preco: 17, alcool: true },
              { id: "stella-600", nome: "Stella Artois", preco: 17, alcool: true },
              { id: "amstel-600", nome: "Amstel", preco: 16, alcool: true },
            ],
          },
        ],
      },
      {
        id: "chope",
        titulo: "Chope",
        blocos: [
          {
            itens: [
              { id: "chope-heineken", nome: "Heineken", preco: 14, alcool: true },
              { id: "chope-brahma", nome: "Brahma", preco: 13, alcool: true },
              { id: "chope-amstel", nome: "Amstel", preco: 12, alcool: true },
            ],
          },
        ],
      },
      {
        id: "long-neck",
        titulo: "Long neck",
        blocos: [
          {
            itens: [
              { id: "ln-heineken", nome: "Heineken", preco: 12.9, alcool: true },
              { id: "ln-heineken-zero", nome: "Heineken Zero", preco: 12.9 },
              { id: "ln-spaten", nome: "Spaten", preco: 14, alcool: true },
              { id: "ln-corona", nome: "Corona", preco: 15, alcool: true },
              { id: "ln-corona-zero", nome: "Corona Zero", preco: 15 },
              { id: "ln-stella", nome: "Stella Artois", preco: 14, alcool: true },
              { id: "ln-stella-gold", nome: "Stella Pure Gold", preco: 15, alcool: true },
              { id: "ln-michelob", nome: "Michelob Ultra", preco: 15, alcool: true },
              { id: "ln-blue-moon", nome: "Blue Moon", preco: 17, alcool: true },
              { id: "chopp-vinho", nome: "Chopp de vinho Stempel", preco: 17, alcool: true },
            ],
          },
        ],
      },
      {
        id: "doses",
        titulo: "Doses",
        chamada: "As bebidas tradicionais para quem é raiz",
        blocos: [
          {
            itens: [
              { id: "buchanans", nome: "Buchanan’s Deluxe 12 Anos", preco: 35, alcool: true },
              { id: "jack", nome: "Jack Daniel’s", preco: 18, alcool: true },
              { id: "red-label", nome: "Johnnie Walker Red Label", preco: 18, alcool: true },
              { id: "licor-43", nome: "Licor 43", preco: 30, alcool: true },
              { id: "ballena", nome: "Ballena", preco: 22, alcool: true },
              { id: "campari", nome: "Campari", preco: 16, alcool: true },
              { id: "santo-sertao", nome: "Santo Sertão", preco: 16, alcool: true },
              { id: "santo-sertao-cafe", nome: "Santo Sertão Café", preco: 16, alcool: true },
              { id: "santo-sertao-banana", nome: "Santo Sertão Banana", preco: 16, alcool: true },
              { id: "santo-sertao-canela", nome: "Santo Sertão Canela", preco: 16, alcool: true },
            ],
          },
        ],
      },
      {
        id: "nao-alcoolicas",
        titulo: "Bebidas não alcoólicas",
        blocos: [
          {
            itens: [
              { id: "red-bull", nome: "Red Bull", preco: 18 },
              { id: "red-bull-zero", nome: "Red Bull Zero", preco: 18 },
              { id: "coca", nome: "Coca-Cola", preco: 7 },
              { id: "coca-zero", nome: "Coca-Cola Zero", preco: 7 },
              { id: "pepsi-black", nome: "Pepsi Black", preco: 7.8 },
              { id: "guarana", nome: "Guaraná Antarctica", preco: 8 },
              { id: "guarana-zero", nome: "Guaraná Antarctica Zero", preco: 8 },
              { id: "schweppes", nome: "Schweppes Citrus", preco: 8 },
              { id: "tonica", nome: "Tônica", preco: 8 },
              { id: "tonica-zero", nome: "Tônica Zero", preco: 8 },
              { id: "agua", nome: "Água", preco: 6 },
              { id: "agua-gas", nome: "Água com gás", preco: 6 },
            ],
          },
        ],
      },
      {
        id: "sucos",
        titulo: "Sucos",
        blocos: [
          {
            itens: [
              { id: "suco-morango-laranja", nome: "Morango, laranja e espuma de gengibre", preco: 16 },
              { id: "suco-frutas-vermelhas", nome: "Frutas vermelhas", preco: 16 },
              { id: "suco-morango", nome: "Morango", preco: 14 },
              { id: "suco-maracuja", nome: "Maracujá", preco: 12 },
              { id: "suco-laranja", nome: "Laranja", preco: 12 },
            ],
          },
        ],
      },
    ],
  },
];

/** Busca um item pelo id em todo o cardápio. */
export function acharItem(id: string): { item: Item; secao: Secao } | null {
  for (const aba of cardapio)
    for (const secao of aba.secoes)
      for (const bloco of secao.blocos)
        for (const item of bloco.itens) if (item.id === id) return { item, secao };
  return null;
}

/** Pratos da vitrine "Da cozinha" (fotos grandes). Troque pelos que o dono quiser destacar. */
export const destaques: string[] = ["tornedor-alma", "burrata", "milanesa", "risoto-sua"];
