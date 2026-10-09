import { site } from "./site";
import { brl } from "./format";
import type { LinhaComanda } from "./comanda";
import { dataExtenso, hora } from "./horarios";

export function linkWhatsApp(mensagem?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export type DadosPedido = {
  tipo: "retirada" | "entrega";
  nome: string;
  telefone: string;
  quando: "agora" | "agendado";
  horario: string;
  pagamento: string;
  trocoPara: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  referencia: string;
  observacoes: string;
};

export function mensagemPedido(linhas: LinhaComanda[], d: DadosPedido, subtotal: number): string {
  const L: string[] = [];
  const entrega = d.tipo === "entrega";

  L.push(`*PEDIDO PELO SITE · ${entrega ? "ENTREGA" : "RETIRADA NO BALCÃO"}*`);
  L.push("");
  L.push(`*Nome:* ${d.nome.trim()}`);
  if (d.telefone.trim()) L.push(`*Telefone:* ${d.telefone.trim()}`);
  L.push(`*Para quando:* ${d.quando === "agora" ? "o quanto antes" : `hoje às ${hora(d.horario)}`}`);
  L.push("");
  L.push("*Itens*");
  for (const l of linhas) {
    L.push(`${l.qtd}x ${l.nome} · ${brl(l.qtd * l.precoUnitario)}`);
    for (const e of l.escolhas) L.push(`   ${e.grupo}: ${e.opcao}`);
    if (l.obs) L.push(`   Obs.: ${l.obs}`);
  }
  L.push("");
  L.push(`*Subtotal:* ${brl(subtotal)}`);
  if (entrega) {
    const taxa = site.pedidos.taxaEntrega;
    L.push(`*Taxa de entrega:* ${taxa == null ? "a confirmar" : brl(taxa)}`);
    if (taxa != null) L.push(`*Total:* ${brl(subtotal + taxa)}`);
  }
  let pagamento = d.pagamento;
  if (d.pagamento === "Dinheiro" && d.trocoPara.trim()) pagamento += ` (troco para R$ ${d.trocoPara.trim()})`;
  if (d.pagamento === "Dinheiro" && !d.trocoPara.trim()) pagamento += " (sem troco)";
  L.push(`*Pagamento:* ${pagamento}${entrega ? " na entrega" : " na retirada"}`);

  if (entrega) {
    L.push("");
    L.push("*Endereço de entrega*");
    L.push(`${d.rua.trim()}, ${d.numero.trim()} · ${d.bairro.trim()}`);
    if (d.complemento.trim()) L.push(`Complemento: ${d.complemento.trim()}`);
    if (d.referencia.trim()) L.push(`Referência: ${d.referencia.trim()}`);
  }

  if (d.observacoes.trim()) {
    L.push("");
    L.push(`*Observações:* ${d.observacoes.trim()}`);
  }
  return L.join("\n");
}

export type DadosReserva = {
  nome: string;
  data: string;
  horario: string;
  pessoas: number;
  ocasiao: string;
  observacoes: string;
};

export function mensagemReserva(r: DadosReserva): string {
  const L = [
    "*PEDIDO DE RESERVA PELO SITE*",
    "",
    `*Nome:* ${r.nome.trim()}`,
    `*Data:* ${dataExtenso(r.data)}`,
    `*Horário:* ${hora(r.horario)}`,
    `*Pessoas:* ${r.pessoas}`,
  ];
  if (r.ocasiao) L.push(`*Ocasião:* ${r.ocasiao}`);
  if (r.observacoes.trim()) L.push(`*Observações:* ${r.observacoes.trim()}`);
  L.push("", "Aguardo a confirmação da mesa. Obrigado!");
  return L.join("\n");
}
