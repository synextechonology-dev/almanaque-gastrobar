"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { hojeISO, validarReserva, NOMES_DIAS, turnoTexto } from "@/lib/horarios";
import { linkWhatsApp, mensagemReserva } from "@/lib/whatsapp";
import { IconeWhatsapp } from "./Icons";
import Capitulo from "./Capitulo";

const OCASIOES = ["Aniversário", "Encontro a dois", "Comemoração", "Reunião de trabalho", "Só vontade mesmo"];

export default function Reservas() {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [pessoas, setPessoas] = useState(2);
  const [ocasiao, setOcasiao] = useState("");
  const [obs, setObs] = useState("");
  const [erro, setErro] = useState<{ campo: string; msg: string } | null>(null);
  const [minData, setMinData] = useState<string>();

  useEffect(() => setMinData(hojeISO()), []);

  if (!site.reservas.ativo) return null;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return mostrar("nome", "Diga em nome de quem fica a mesa.");
    const problema = validarReserva(data, horario);
    if (problema) return mostrar(!data || problema.includes("data") || problema.includes("dia") ? "data" : "horario", problema);
    setErro(null);
    window.open(linkWhatsApp(mensagemReserva({ nome, data, horario, pessoas, ocasiao, observacoes: obs })), "_blank", "noopener");
  }

  function mostrar(campo: string, msg: string) {
    setErro({ campo, msg });
    document.getElementById(`reserva-${campo}`)?.focus();
  }

  const diasAbertos = Object.entries(site.horarios)
    .filter(([, t]) => t.length)
    .sort(([a], [b]) => ((Number(a) + 4) % 7) - ((Number(b) + 4) % 7))
    .map(([dia, t]) => `${NOMES_DIAS[Number(dia)].replace("-feira", "")} · ${t.map(turnoTexto).join(", ")}`);

  return (
    <section id="reservas" className="reservas fundo-laranja" aria-labelledby="reservas-titulo">
      <div className="conteudo reservas__grade">
        <div className="reservas__texto">
          <Capitulo n={4} className="capitulo--escuro">
            Reservas
          </Capitulo>
          <h2 id="reservas-titulo" className="titulo-secao" data-revelar>
            A mesa do canto tá guardada.
          </h2>
          <p className="reservas__script" data-revelar>
            Só falta você e a história de hoje.
          </p>
          <p data-revelar>
            Diga o dia, a hora e quantos vêm. O pedido chega no nosso WhatsApp e a gente confirma a mesa por lá mesmo. Sem
            cadastro, sem aplicativo: do jeito que conversa de bar tem que ser.
          </p>
          <ul className="reservas__dias" data-revelar aria-label="Dias e horários para reserva">
            {diasAbertos.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>

        <form className="reservas__form" onSubmit={enviar} noValidate data-revelar>
          <p className="reservas__ticket">Pedido de mesa</p>
          <div className={`campo ${erro?.campo === "nome" ? "campo--erro" : ""}`}>
            <label className="campo__rotulo" htmlFor="reserva-nome">
              Em nome de
            </label>
            <input id="reserva-nome" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="reservas__linha">
            <div className={`campo ${erro?.campo === "data" ? "campo--erro" : ""}`}>
              <label className="campo__rotulo" htmlFor="reserva-data">
                Dia
              </label>
              <input id="reserva-data" type="date" min={minData} value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className={`campo ${erro?.campo === "horario" ? "campo--erro" : ""}`}>
              <label className="campo__rotulo" htmlFor="reserva-horario">
                Horário
              </label>
              <input id="reserva-horario" type="time" step={900} value={horario} onChange={(e) => setHorario(e.target.value)} />
            </div>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="reserva-pessoas">
                Pessoas
              </label>
              <select id="reserva-pessoas" value={pessoas} onChange={(e) => setPessoas(Number(e.target.value))}>
                {Array.from({ length: site.reservas.maxPessoas }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="reserva-ocasiao">
              É uma ocasião especial? (opcional)
            </label>
            <select id="reserva-ocasiao" value={ocasiao} onChange={(e) => setOcasiao(e.target.value)}>
              <option value="">Prefiro não dizer</option>
              {OCASIOES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="reserva-obs">
              Algum pedido para a mesa? (opcional)
            </label>
            <textarea id="reserva-obs" rows={2} maxLength={240} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ex.: cadeirinha para criança, mesa na área externa" />
          </div>

          {erro && (
            <p className="campo__erro" role="alert">
              {erro.msg}
            </p>
          )}

          <button type="submit" className="botao botao--petroleo">
            <IconeWhatsapp size={20} />
            Pedir a mesa pelo WhatsApp
          </button>
          <p className="reservas__nota">A mesa só fica garantida depois que a gente responder confirmando. Mais de {site.reservas.maxPessoas} pessoas? Chama no WhatsApp que a gente dá um jeito.</p>
        </form>
      </div>
    </section>
  );
}
