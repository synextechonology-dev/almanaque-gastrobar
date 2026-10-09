"use client";

import { useEffect, useRef, useState } from "react";
import { useComanda } from "@/lib/comanda";
import { site } from "@/lib/site";
import { brl } from "@/lib/format";
import { agoraSaoPaulo, hora } from "@/lib/horarios";
import { linkWhatsApp, mensagemPedido, type DadosPedido } from "@/lib/whatsapp";
import { IconeFechar, IconeMais, IconeMenos, IconeWhatsapp } from "./Icons";
import { useStatus } from "./StatusAberto";

type Etapa = "itens" | "dados" | "enviado";

const CHAVE_DADOS = "almanaque:meus-dados";

const VAZIO: DadosPedido = {
  tipo: site.pedidos.aceitaRetirada ? "retirada" : "entrega",
  nome: "",
  telefone: "",
  quando: "agora",
  horario: "",
  pagamento: "",
  trocoPara: "",
  rua: "",
  numero: "",
  bairro: "",
  complemento: "",
  referencia: "",
  observacoes: "",
};

/** Horário agendado precisa cair dentro do funcionamento de hoje e depois de agora. */
function erroHorario(h: string): string | null {
  if (!h) return "Escolha o horário.";
  const { dia, min } = agoraSaoPaulo();
  const [hh, mm] = h.split(":").map(Number);
  const m = hh * 60 + mm;
  const turnos = site.horarios[dia];
  if (!turnos.length) return "Hoje a casa não abre. Faça o pedido em um dia de funcionamento.";
  const dentro = turnos.some((t) => {
    const [ah, am] = t.abre.split(":").map(Number);
    const [fh, fm] = t.fecha.split(":").map(Number);
    const fim = fh === 0 && fm === 0 ? 1440 : fh * 60 + fm;
    return m >= ah * 60 + am && m <= fim - 15;
  });
  if (!dentro) return `Hoje atendemos das ${turnos.map((t) => `${hora(t.abre)} às ${hora(t.fecha)}`).join(" e ")}.`;
  if (m < min + 20) return "Escolha um horário pelo menos 20 minutos à frente.";
  return null;
}

export default function Comanda() {
  const c = useComanda();
  const status = useStatus();
  const ref = useRef<HTMLDialogElement>(null);
  const [etapa, setEtapa] = useState<Etapa>("itens");
  const [d, setD] = useState<DadosPedido>(VAZIO);
  const [maior, setMaior] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [erros, setErros] = useState<Record<string, string>>({});

  // Abre e fecha o painel.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (c.aberta && !el.open) {
      el.showModal();
      document.body.classList.add("travado");
    }
    if (!c.aberta && el.open) {
      el.close();
      document.body.classList.remove("travado");
      if (etapa === "enviado") setEtapa("itens");
    }
  }, [c.aberta, etapa]);

  // Recupera nome e endereço salvos neste aparelho.
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_DADOS);
      if (salvo) setD((atual) => ({ ...atual, ...JSON.parse(salvo) }));
    } catch {}
  }, []);

  const set = <K extends keyof DadosPedido>(k: K, v: DadosPedido[K]) => {
    setD((a) => ({ ...a, [k]: v }));
    setErros((e) => {
      const { [k]: _, ...resto } = e;
      return resto;
    });
  };

  const entrega = d.tipo === "entrega";
  const taxa = entrega ? site.pedidos.taxaEntrega : null;
  const minimo = site.pedidos.pedidoMinimoEntrega;
  const abaixoMinimo = entrega && minimo != null && c.subtotal < minimo;

  function validar(): boolean {
    const e: Record<string, string> = {};
    if (!d.nome.trim()) e.nome = "Diga como você se chama para o pedido.";
    if (d.quando === "agendado") {
      const h = erroHorario(d.horario);
      if (h) e.horario = h;
    }
    if (!d.pagamento) e.pagamento = "Escolha a forma de pagamento.";
    if (entrega) {
      if (!d.rua.trim()) e.rua = "Informe a rua.";
      if (!d.numero.trim()) e.numero = "Informe o número.";
      if (!d.bairro.trim()) e.bairro = "Informe o bairro.";
    }
    if (c.temAlcool && !maior) e.maior = "Sua comanda tem bebida alcoólica. Confirme que tem 18 anos ou mais.";
    if (d.pagamento === "Dinheiro" && d.trocoPara.trim()) {
      const troco = Number(d.trocoPara.replace(/[^\d,.]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", "."));
      const total = c.subtotal + (taxa ?? 0);
      if (!Number.isFinite(troco) || troco < total) e.trocoPara = `O troco precisa ser para um valor acima de ${brl(total)}.`;
    }
    if (abaixoMinimo) e.minimo = `O pedido mínimo para entrega é ${brl(minimo!)}.`;
    setErros(e);
    const primeiro = Object.keys(e)[0];
    if (primeiro) document.getElementById(`campo-${primeiro}`)?.focus();
    return !primeiro;
  }

  function enviar() {
    if (!validar()) return;
    try {
      if (lembrar) {
        const { nome, telefone, rua, numero, bairro, complemento, referencia } = d;
        localStorage.setItem(CHAVE_DADOS, JSON.stringify({ nome, telefone, rua, numero, bairro, complemento, referencia }));
      } else localStorage.removeItem(CHAVE_DADOS);
    } catch {}
    window.open(linkWhatsApp(mensagemPedido(c.linhas, d, c.subtotal)), "_blank", "noopener");
    setEtapa("enviado");
  }

  const expira = c.expiraEm
    ? new Date(c.expiraEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })
    : null;

  return (
    <dialog
      ref={ref}
      className="comanda"
      aria-labelledby="comanda-titulo"
      onCancel={(e) => {
        e.preventDefault();
        c.fechar();
      }}
      onClick={(e) => {
        if (e.target === ref.current) c.fechar();
      }}
    >
      <div className="comanda__papel">
        <div className="comanda__topo">
          <div>
            <p className="comanda__casa">Almanaque · Gastrobar</p>
            <h2 id="comanda-titulo" className="comanda__titulo">
              {etapa === "dados" ? "Fechar pedido" : etapa === "enviado" ? "Pedido no WhatsApp" : "Sua comanda"}
            </h2>
          </div>
          <button type="button" className="icone-botao" onClick={c.fechar} aria-label="Fechar comanda">
            <IconeFechar size={22} />
          </button>
        </div>

        {/* ---------- Itens ---------- */}
        {etapa === "itens" && (
          <>
            {c.linhas.length === 0 ? (
              <div className="comanda__vazia">
                <p>Sua comanda está vazia.</p>
                <p>Escolha um prato no cardápio e toque em Pedir. Ele aparece aqui.</p>
                <a href="#cardapio" className="botao botao--petroleo" onClick={c.fechar}>
                  Ir para o cardápio
                </a>
              </div>
            ) : (
              <>
                <ul className="linhas">
                  {c.linhas.map((l) => (
                    <li key={l.chave} className="linha">
                      <div className="linha__info">
                        <p className="linha__nome">{l.nome}</p>
                        {l.escolhas.map((e) => (
                          <p key={e.grupoId} className="linha__detalhe">
                            {e.grupo.replace(/^Passo \d: /, "")}: {e.opcao}
                          </p>
                        ))}
                        {l.obs && <p className="linha__detalhe">Obs.: {l.obs}</p>}
                      </div>
                      <div className="linha__lado">
                        <span className="linha__valor">{brl(l.qtd * l.precoUnitario)}</span>
                        <div className="qtd qtd--pequena">
                          <button type="button" onClick={() => c.alterarQtd(l.chave, l.qtd - 1)} aria-label={l.qtd === 1 ? `Tirar ${l.nome}` : `Diminuir ${l.nome}`}>
                            <IconeMenos size={16} />
                          </button>
                          <span>{l.qtd}</span>
                          <button type="button" onClick={() => c.alterarQtd(l.chave, Math.min(20, l.qtd + 1))} aria-label={`Aumentar ${l.nome}`}>
                            <IconeMais size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="comanda__total">
                  <span>Subtotal</span>
                  <strong>{brl(c.subtotal)}</strong>
                </div>
                {expira && <p className="comanda__aviso">Sua comanda fica guardada até {expira}. Depois disso ela é esvaziada.</p>}
                <div className="comanda__acoes">
                  <button type="button" className="botao botao--laranja" onClick={() => setEtapa("dados")}>
                    Fechar pedido
                  </button>
                  <button type="button" className="link-botao" onClick={c.limpar}>
                    Esvaziar comanda
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ---------- Dados ---------- */}
        {etapa === "dados" && (
          <form
            className="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
          >
            {status && !status.aberto && (
              <p className="alerta">
                {status.texto}. Você pode mandar o pedido agora e ele será respondido quando a casa abrir.
              </p>
            )}

            <fieldset className="form__grupo">
              <legend className="campo__rotulo">Como você quer receber?</legend>
              <div className="alternar">
                {site.pedidos.aceitaRetirada && (
                  <label className={`alternar__op ${!entrega ? "alternar__op--ativa" : ""}`}>
                    <input type="radio" name="tipo" checked={!entrega} onChange={() => set("tipo", "retirada")} />
                    Retirar no balcão
                  </label>
                )}
                {site.pedidos.aceitaEntrega && (
                  <label className={`alternar__op ${entrega ? "alternar__op--ativa" : ""}`}>
                    <input type="radio" name="tipo" checked={entrega} onChange={() => set("tipo", "entrega")} />
                    Entrega
                  </label>
                )}
              </div>
              <p className="form__nota">
                {entrega
                  ? `Taxa de entrega: ${taxa == null ? "confirmada pelo restaurante no WhatsApp" : brl(taxa)}.${site.pedidos.tempoMedioEntrega ? ` Tempo médio: ${site.pedidos.tempoMedioEntrega}.` : ""}`
                  : `Retirada na ${site.endereco.rua}.${site.pedidos.tempoMedioRetirada ? ` Tempo médio: ${site.pedidos.tempoMedioRetirada}.` : ""}`}
              </p>
            </fieldset>

            <Campo id="nome" rotulo="Seu nome" erro={erros.nome}>
              <input id="campo-nome" autoComplete="name" value={d.nome} onChange={(e) => set("nome", e.target.value)} />
            </Campo>
            <Campo id="telefone" rotulo="Telefone (opcional)" erro={erros.telefone}>
              <input id="campo-telefone" type="tel" inputMode="tel" autoComplete="tel" value={d.telefone} onChange={(e) => set("telefone", e.target.value)} placeholder="Só se for outro número" />
            </Campo>

            {entrega && (
              <div className="form__endereco">
                <Campo id="rua" rotulo="Rua" erro={erros.rua} classe="campo--largo">
                  <input id="campo-rua" autoComplete="address-line1" value={d.rua} onChange={(e) => set("rua", e.target.value)} />
                </Campo>
                <Campo id="numero" rotulo="Número" erro={erros.numero}>
                  <input id="campo-numero" inputMode="numeric" value={d.numero} onChange={(e) => set("numero", e.target.value)} />
                </Campo>
                <Campo id="bairro" rotulo="Bairro" erro={erros.bairro}>
                  <input id="campo-bairro" value={d.bairro} onChange={(e) => set("bairro", e.target.value)} />
                </Campo>
                <Campo id="complemento" rotulo="Complemento (opcional)" classe="campo--largo">
                  <input id="campo-complemento" value={d.complemento} onChange={(e) => set("complemento", e.target.value)} placeholder="Apto, bloco, casa dos fundos" />
                </Campo>
                <Campo id="referencia" rotulo="Ponto de referência (opcional)" classe="campo--largo">
                  <input id="campo-referencia" value={d.referencia} onChange={(e) => set("referencia", e.target.value)} />
                </Campo>
              </div>
            )}

            <fieldset className="form__grupo">
              <legend className="campo__rotulo">Para quando?</legend>
              <div className="alternar">
                <label className={`alternar__op ${d.quando === "agora" ? "alternar__op--ativa" : ""}`}>
                  <input type="radio" name="quando" checked={d.quando === "agora"} onChange={() => set("quando", "agora")} />
                  O quanto antes
                </label>
                <label className={`alternar__op ${d.quando === "agendado" ? "alternar__op--ativa" : ""}`}>
                  <input type="radio" name="quando" checked={d.quando === "agendado"} onChange={() => set("quando", "agendado")} />
                  Agendar para hoje
                </label>
              </div>
              {d.quando === "agendado" && (
                <Campo id="horario" rotulo="Horário" erro={erros.horario}>
                  <input id="campo-horario" type="time" step={900} value={d.horario} onChange={(e) => set("horario", e.target.value)} />
                </Campo>
              )}
            </fieldset>

            <fieldset className="form__grupo" id="campo-pagamento" tabIndex={-1}>
              <legend className="campo__rotulo">Pagamento {entrega ? "na entrega" : "na retirada"}</legend>
              <div className="alternar alternar--quebra">
                {site.pedidos.pagamentos.map((p) => (
                  <label key={p} className={`alternar__op ${d.pagamento === p ? "alternar__op--ativa" : ""}`}>
                    <input type="radio" name="pagamento" checked={d.pagamento === p} onChange={() => set("pagamento", p)} />
                    {p}
                  </label>
                ))}
              </div>
              {erros.pagamento && <p className="campo__erro">{erros.pagamento}</p>}
              {d.pagamento === "Dinheiro" && (
                <Campo id="trocoPara" rotulo="Troco para quanto? (opcional)" erro={erros.trocoPara}>
                  <input id="campo-trocoPara" inputMode="decimal" value={d.trocoPara} onChange={(e) => set("trocoPara", e.target.value)} placeholder="Ex.: 200" />
                </Campo>
              )}
            </fieldset>

            <Campo id="observacoes" rotulo="Observações do pedido (opcional)">
              <textarea id="campo-observacoes" rows={2} maxLength={300} value={d.observacoes} onChange={(e) => set("observacoes", e.target.value)} placeholder="Ex.: interfone com defeito, ligar ao chegar" />
            </Campo>

            {c.temAlcool && (
              <label className={`check ${erros.maior ? "check--erro" : ""}`}>
                <input id="campo-maior" type="checkbox" checked={maior} onChange={(e) => { setMaior(e.target.checked); setErros(({ maior: _, ...r }) => r); }} />
                <span>Tenho 18 anos ou mais. Sei que posso precisar mostrar documento {entrega ? "na entrega" : "na retirada"}.</span>
              </label>
            )}
            {erros.maior && <p className="campo__erro">{erros.maior}</p>}

            <label className="check">
              <input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} />
              <span>Lembrar meu nome e endereço neste aparelho</span>
            </label>

            <div className="comanda__total">
              <span>Subtotal</span>
              <strong>{brl(c.subtotal)}</strong>
            </div>
            {entrega && taxa != null && (
              <div className="comanda__total comanda__total--final">
                <span>Total com entrega</span>
                <strong>{brl(c.subtotal + taxa)}</strong>
              </div>
            )}
            {erros.minimo && <p className="campo__erro">{erros.minimo}</p>}

            <div className="comanda__acoes">
              <button type="submit" className="botao botao--laranja">
                <IconeWhatsapp size={20} />
                Enviar pedido pelo WhatsApp
              </button>
              <button type="button" className="link-botao" onClick={() => setEtapa("itens")}>
                Voltar para a comanda
              </button>
            </div>
          </form>
        )}

        {/* ---------- Enviado ---------- */}
        {etapa === "enviado" && (
          <div className="comanda__vazia">
            <p>Abrimos o WhatsApp com o seu pedido escrito.</p>
            <p>Toque em enviar por lá. O pedido só chega ao Almanaque depois que a mensagem for enviada, e a casa confirma por lá mesmo.</p>
            <button
              type="button"
              className="botao botao--petroleo"
              onClick={() => window.open(linkWhatsApp(mensagemPedido(c.linhas, d, c.subtotal)), "_blank", "noopener")}
            >
              Abrir o WhatsApp de novo
            </button>
            <button
              type="button"
              className="link-botao"
              onClick={() => {
                c.limpar();
                setEtapa("itens");
                c.fechar();
              }}
            >
              Já enviei, pode esvaziar a comanda
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}

function Campo({ id, rotulo, erro, classe = "", children }: { id: string; rotulo: string; erro?: string; classe?: string; children: React.ReactNode }) {
  return (
    <div className={`campo ${erro ? "campo--erro" : ""} ${classe}`}>
      <label className="campo__rotulo" htmlFor={`campo-${id}`}>
        {rotulo}
      </label>
      {children}
      {erro && <p className="campo__erro">{erro}</p>}
    </div>
  );
}
