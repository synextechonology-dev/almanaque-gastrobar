/**
 * O "almanaque do dia": data por extenso, fase da lua e a previsão da casa.
 * Tudo calculado no horário de Brasília, sem depender do fuso do aparelho.
 */
import { site, type DiaSemana } from "./site";
import { NOMES_DIAS, agoraSaoPaulo, hora } from "./horarios";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "quinta-feira, 9 de outubro" */
export function dataDeHoje(data = new Date()): string {
  const [a, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(data).split("-").map(Number);
  const dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
  return `${NOMES_DIAS[dia]}, ${d} de ${MESES[m - 1]}`;
}

/** Número da edição = dia do ano (1 a 366). */
export function numeroEdicao(data = new Date()): number {
  const [a, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(data).split("-").map(Number);
  return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(a, 0, 1)) / 86_400_000) + 1;
}

export type Lua = {
  nome: "Lua nova" | "Lua crescente" | "Lua cheia" | "Lua minguante";
  /** 0 a 1: quanto do disco está iluminado. */
  luz: number;
  crescendo: boolean;
};

const SINODICO = 29.530588853;
const LUA_NOVA_REF = Date.UTC(2000, 0, 6, 18, 14);

/** Fase da lua com os quatro nomes que todo almanaque usa. */
export function faseDaLua(data = new Date()): Lua {
  const dias = (data.getTime() - LUA_NOVA_REF) / 86_400_000;
  const idade = ((dias % SINODICO) + SINODICO) % SINODICO;
  const luz = (1 - Math.cos((2 * Math.PI * idade) / SINODICO)) / 2;
  const crescendo = idade < SINODICO / 2;
  let nome: Lua["nome"];
  if (idade < 1.85 || idade > 27.68) nome = "Lua nova";
  else if (idade < 12.92) nome = "Lua crescente";
  else if (idade < 16.61) nome = "Lua cheia";
  else nome = "Lua minguante";
  return { nome, luz, crescendo };
}

/** Próximo dia com a casa aberta, a partir de amanhã. */
function proximaAbertura(dia: DiaSemana): { quando: string; abre: string } | null {
  for (let i = 1; i <= 7; i++) {
    const d = ((dia + i) % 7) as DiaSemana;
    const t = site.horarios[d];
    if (t.length) return { quando: i === 1 ? "amanhã" : NOMES_DIAS[d].replace("-feira", ""), abre: hora(t[0].abre) };
  }
  return null;
}

const PREVISOES: Record<DiaSemana, string> = {
  0: "Previsão: almoço comprido, mesa grande e ninguém olhando o relógio.",
  1: "",
  2: "",
  3: "Previsão: meio de semana pedindo trégua. Risoto, vinho e conversa comprida.",
  4: "Previsão: quinta com cara de sexta. Negroni na mão e assunto bom na mesa.",
  5: "Previsão: chope gelado, casa cheia e história nova. Melhor reservar.",
  6: "Previsão: sábado de casa cheia. Quem reserva antes escolhe a mesa.",
};

/** A previsão do almanaque para hoje. Nos dias de folga, avisa quando o letreiro acende de novo. */
export function previsaoDeHoje(data = new Date()): string {
  const { dia } = agoraSaoPaulo(data);
  if (site.horarios[dia].length && PREVISOES[dia]) return PREVISOES[dia];
  if (site.horarios[dia].length) return "Previsão: noite boa pra uma mesa sem pressa.";
  const prox = proximaAbertura(dia);
  return prox
    ? `Hoje a casa descansa. Previsão: o letreiro acende de novo ${prox.quando}, às ${prox.abre}.`
    : "Hoje a casa descansa.";
}
