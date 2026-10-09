/**
 * Dados do restaurante.
 * Tudo que tiver "PREENCHER" ainda precisa ser confirmado com o Almanaque.
 * Veja o arquivo PREENCHER.md na raiz do projeto.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export type Turno = { abre: string; fecha: string; rotulo?: string };

export const site = {
  nome: "Almanaque Gastrobar",
  nomeCurto: "Almanaque",
  slogan: "Boa comida, boas histórias.",
  descricao:
    "Gastrobar em Santa Cruz do Rio Pardo. Grelhados, risotos, burgers, drinks autorais e carta de vinhos.",
  // URL final do site, sem barra no fim. PREENCHER quando o domínio estiver definido.
  url: "https://www.almanaquegastrobar.com.br",

  whatsapp: "5514998857779", // só números, com 55 + DDD
  whatsappExibicao: "(14) 99885-7779",
  instagram: "https://www.instagram.com/almanaque.gastrobar/",
  instagramUsuario: "@almanaque.gastrobar",

  endereco: {
    rua: "Av. Cel. Clementino Gonçalves, 104",
    bairro: "Centro",
    cidade: "Santa Cruz do Rio Pardo",
    uf: "SP",
    cep: "18900-340",
  },

  // Horário de funcionamento (horário de Brasília). "00:00" no fechamento = meia-noite.
  horarios: {
    0: [{ abre: "11:30", fecha: "15:00", rotulo: "almoço" }],
    1: [],
    2: [],
    3: [{ abre: "18:00", fecha: "23:00" }],
    4: [{ abre: "18:00", fecha: "23:00" }],
    5: [{ abre: "18:00", fecha: "00:00" }],
    6: [{ abre: "18:00", fecha: "00:00" }],
  } as Record<DiaSemana, Turno[]>,

  pedidos: {
    // PREENCHER: o restaurante faz entrega? Se não fizer, troque para false.
    aceitaEntrega: true,
    aceitaRetirada: true,
    // PREENCHER: taxa fixa em reais (ex.: 8). Deixe null para "a combinar no WhatsApp".
    taxaEntrega: null as number | null,
    // PREENCHER: pedido mínimo para entrega em reais. null = sem mínimo.
    pedidoMinimoEntrega: null as number | null,
    // PREENCHER: tempo médio, ex.: "40 a 60 min". null esconde a informação.
    tempoMedioEntrega: null as string | null,
    tempoMedioRetirada: null as string | null,
    // PREENCHER: formas de pagamento aceitas.
    pagamentos: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"],
    // A comanda é esvaziada 1 hora depois da última alteração.
    validadeComandaMin: 60,
  },

  reservas: {
    ativo: true,
    maxPessoas: 20,
  },

  // Crédito no rodapé. Troque ou deixe "" para esconder.
  creditoAgencia: { nome: "Synex", url: "" },
} as const;

export const enderecoCompleto = `${site.endereco.rua} - ${site.endereco.bairro}, ${site.endereco.cidade} - ${site.endereco.uf}, ${site.endereco.cep}`;

export const linkMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `Almanaque Gastrobar, ${enderecoCompleto}`
)}`;

/** Abre o Google Maps já traçando a rota de onde a pessoa está até o Almanaque. */
export const linkRota = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `Almanaque Gastrobar, ${enderecoCompleto}`
)}`;

export const linkMapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
  `Almanaque Gastrobar, ${enderecoCompleto}`
)}&output=embed`;
