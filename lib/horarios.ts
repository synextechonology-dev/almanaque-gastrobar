import { site, type DiaSemana, type Turno } from "./site";

export const NOMES_DIAS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
] as const;

const NOMES_CURTOS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"] as const;

/** "18:00" -> 1080. Fechamento "00:00" vira 1440 (meia-noite do mesmo turno). */
function minutos(hhmm: string, fechamento = false): number {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m;
  return fechamento && total === 0 ? 24 * 60 : total;
}

/** "18:00" -> "18h", "11:30" -> "11h30", "00:00" -> "meia-noite" */
export function hora(hhmm: string): string {
  if (hhmm === "00:00") return "meia-noite";
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

export function turnoTexto(t: Turno): string {
  return `${hora(t.abre)} às ${hora(t.fecha)}`;
}

/** Dia da semana e minutos do dia no horário de Brasília, independente do fuso do aparelho. */
export function agoraSaoPaulo(data = new Date()): { dia: DiaSemana; min: number } {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(data);
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? "";
  const dias = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    dia: dias.indexOf(get("weekday")) as DiaSemana,
    min: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export type Status = { aberto: boolean; texto: string; curto: string };

export function statusAgora(data = new Date()): Status {
  const { dia, min } = agoraSaoPaulo(data);
  const hoje = site.horarios[dia];

  for (const t of hoje) {
    if (min >= minutos(t.abre) && min < minutos(t.fecha, true)) {
      return { aberto: true, texto: `Aberto agora, até ${hora(t.fecha)}`, curto: "Aberto agora" };
    }
  }

  // Próxima abertura: ainda hoje ou nos próximos dias.
  for (const t of hoje) {
    if (min < minutos(t.abre)) {
      return { aberto: false, texto: `Fechado agora. Abre hoje às ${hora(t.abre)}`, curto: `Abre às ${hora(t.abre)}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const d = ((dia + i) % 7) as DiaSemana;
    const turnos = site.horarios[d];
    if (turnos.length) {
      const quando = i === 1 ? "amanhã" : NOMES_CURTOS[d];
      return {
        aberto: false,
        texto: `Fechado agora. Abre ${quando} às ${hora(turnos[0].abre)}`,
        curto: `Abre ${quando} às ${hora(turnos[0].abre)}`,
      };
    }
  }
  return { aberto: false, texto: "Fechado", curto: "Fechado" };
}

/** Dia da semana de uma data "AAAA-MM-DD" (sem depender de fuso). */
export function diaDaData(iso: string): DiaSemana {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay() as DiaSemana;
}

/** Data de hoje em São Paulo no formato AAAA-MM-DD. */
export function hojeISO(data = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(data);
}

/**
 * Valida data e horário de uma reserva. Retorna a mensagem de erro ou null.
 * Aceita horários do início do turno até 1 hora antes de fechar.
 */
export function validarReserva(dataISO: string, horario: string): string | null {
  if (!dataISO) return "Escolha a data da reserva.";
  if (dataISO < hojeISO()) return "Essa data já passou. Escolha hoje ou um dia à frente.";
  const dia = diaDaData(dataISO);
  const turnos = site.horarios[dia];
  if (!turnos.length) return `Não abrimos na ${NOMES_DIAS[dia]}. Escolha outro dia.`;
  if (!horario) return "Escolha o horário da reserva.";
  const m = minutos(horario);
  const ok = turnos.some((t) => m >= minutos(t.abre) && m <= minutos(t.fecha, true) - 60);
  if (!ok) {
    const t = turnos[0];
    const ultimo = minutos(t.fecha, true) - 60;
    const ultimoTxt = hora(`${String(Math.floor(ultimo / 60) % 24).padStart(2, "0")}:${String(ultimo % 60).padStart(2, "0")}`);
    return `Na ${NOMES_DIAS[dia]} recebemos reservas das ${hora(t.abre)} às ${ultimoTxt}.`;
  }
  if (dataISO === hojeISO()) {
    const { min } = agoraSaoPaulo();
    if (m <= min) return "Esse horário de hoje já passou. Escolha um mais tarde.";
  }
  return null;
}

/** Formata "AAAA-MM-DD" como "sexta-feira, 10/10". */
export function dataExtenso(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${NOMES_DIAS[diaDaData(iso)]}, ${d}/${m}`;
}
