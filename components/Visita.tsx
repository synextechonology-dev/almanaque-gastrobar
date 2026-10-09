"use client";

import { useEffect, useState } from "react";
import { site, enderecoCompleto, linkMapa, linkMapaEmbed, linkRota, type DiaSemana } from "@/lib/site";
import { NOMES_DIAS, agoraSaoPaulo, turnoTexto } from "@/lib/horarios";
import { linkWhatsApp } from "@/lib/whatsapp";
import StatusAberto from "./StatusAberto";
import Capitulo from "./Capitulo";
import { IconeInstagram, IconePino, IconeSeta, IconeWhatsapp } from "./Icons";

// Semana começando na quarta, que é quando a casa abre.
const ORDEM: DiaSemana[] = [3, 4, 5, 6, 0, 1, 2];

export default function Visita() {
  const [hoje, setHoje] = useState<DiaSemana | null>(null);
  useEffect(() => setHoje(agoraSaoPaulo().dia), []);

  return (
    <section id="visita" className="visita fundo-petroleo" aria-labelledby="visita-titulo">
      <div className="conteudo">
        <Capitulo n={6}>Como chegar</Capitulo>
        <h2 id="visita-titulo" className="titulo-secao visita__titulo" data-revelar>
          Fica no Centro. Procure o letreiro aceso.
        </h2>

        <div className="visita__grade">
          {/* Mapa do Google com cartão por cima e atalhos para abrir o app ou traçar a rota. */}
          <div className="visita__mapa" data-revelar>
            <div className="visita__mapa-moldura">
              <iframe
                title={`Mapa do Almanaque Gastrobar: ${enderecoCompleto}`}
                src={linkMapaEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="mapa-cartao">
              <p className="mapa-cartao__rotulo">
                <IconePino size={16} /> Você chega aqui
              </p>
              <p className="mapa-cartao__nome">{site.nome}</p>
              <p className="mapa-cartao__end">
                {site.endereco.rua} · {site.endereco.bairro}
              </p>
              <div className="mapa-cartao__acoes">
                <a href={linkMapa} target="_blank" rel="noopener noreferrer" className="botao botao--laranja botao--pequeno">
                  Abrir no Google Maps
                  <IconeSeta size={16} />
                </a>
                <a href={linkRota} target="_blank" rel="noopener noreferrer" className="botao botao--creme botao--pequeno">
                  Traçar rota
                </a>
              </div>
            </div>
          </div>

          <div className="visita__info">
            <address className="visita__endereco" data-revelar>
              <span className="visita__rotulo">Endereço</span>
              {site.endereco.rua}
              <br />
              {site.endereco.bairro}, {site.endereco.cidade} · {site.endereco.uf}
              <br />
              CEP {site.endereco.cep}
            </address>

            <div className="visita__horarios" data-revelar>
              <div className="visita__horarios-topo">
                <span className="visita__rotulo">Horários</span>
                <StatusAberto />
              </div>
              <table className="horarios">
                <caption className="sr">Horário de funcionamento</caption>
                <tbody>
                  {ORDEM.map((d) => {
                    const turnos = site.horarios[d];
                    return (
                      <tr key={d} className={`${hoje === d ? "horarios--hoje" : ""} ${turnos.length ? "" : "horarios--fechado"}`}>
                        <th scope="row">
                          {NOMES_DIAS[d]}
                          {hoje === d && <span className="horarios__hoje">hoje</span>}
                        </th>
                        <td>
                          {turnos.length
                            ? turnos.map((t) => `${turnoTexto(t)}${t.rotulo ? ` (${t.rotulo})` : ""}`).join(", ")
                            : "a casa descansa"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="visita__contatos" data-revelar>
              <span className="visita__rotulo">Pra falar com a gente</span>
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="contato">
                <IconeWhatsapp size={22} />
                <span>
                  <small>WhatsApp</small>
                  {site.whatsappExibicao}
                </span>
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="contato">
                <IconeInstagram size={22} />
                <span>
                  <small>Instagram</small>
                  {site.instagramUsuario}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
