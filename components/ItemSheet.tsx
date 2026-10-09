"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GrupoOpcoes, Item } from "@/lib/menu";
import { brl } from "@/lib/format";
import { useComanda, type Escolha } from "@/lib/comanda";
import { IconeFechar, IconeMais, IconeMenos } from "./Icons";

const NENHUM = "__nenhum";

function grupoVisivel(g: GrupoOpcoes, sel: Record<string, string>) {
  if (!g.aplicaSe) return true;
  return g.aplicaSe.opcoes.includes(sel[g.aplicaSe.grupo]);
}

/** Janela para escolher opções do prato (pão da burrata, fritas, corte, ponto, base do drinque...). */
export default function ItemSheet({ item, onFechar }: { item: Item; onFechar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { adicionar, abrir } = useComanda();
  const grupos = item.grupos ?? [];

  const [sel, setSel] = useState<Record<string, string>>(() =>
    Object.fromEntries(grupos.filter((g) => !g.obrigatorio).map((g) => [g.id, NENHUM]))
  );
  const [qtd, setQtd] = useState(1);
  const [obs, setObs] = useState("");
  const [faltando, setFaltando] = useState<string[]>([]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    document.body.classList.add("travado");
    return () => document.body.classList.remove("travado");
  }, []);

  const visiveis = grupos.filter((g) => grupoVisivel(g, sel));

  const unitario = useMemo(() => {
    let valor = item.preco ?? 0;
    for (const g of visiveis) {
      const o = g.opcoes.find((x) => x.id === sel[g.id]);
      if (!o || o.preco == null) continue;
      if (g.tipo === "base") valor = o.preco;
      if (g.tipo === "adicional") valor += o.preco;
    }
    return valor;
  }, [item.preco, visiveis, sel]);

  const temBaseSemEscolha = visiveis.some((g) => g.tipo === "base" && !sel[g.id]);

  function confirmar() {
    const falta = visiveis.filter((g) => g.obrigatorio && !sel[g.id]).map((g) => g.id);
    setFaltando(falta);
    if (falta.length) {
      document.getElementById(`grupo-${falta[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const escolhas: Escolha[] = visiveis
      .filter((g) => sel[g.id] && sel[g.id] !== NENHUM)
      .map((g) => {
        const o = g.opcoes.find((x) => x.id === sel[g.id])!;
        return { grupoId: g.id, grupo: g.rotulo ?? g.titulo, opcaoId: o.id, opcao: o.preco != null && g.tipo === "adicional" ? `${o.nome} (+${brl(o.preco)})` : o.nome };
      });
    adicionar(item, { precoUnitario: unitario, escolhas, obs, qtd });
    fechar();
  }

  function fechar() {
    ref.current?.close();
    onFechar();
  }

  return (
    <dialog
      ref={ref}
      className="folha"
      aria-labelledby="folha-titulo"
      onCancel={(e) => {
        e.preventDefault();
        fechar();
      }}
      onClick={(e) => {
        if (e.target === ref.current) fechar();
      }}
    >
      <div className="folha__papel">
        <div className="folha__topo">
          <h3 id="folha-titulo" className="folha__titulo">
            {item.nome}
          </h3>
          <button type="button" className="icone-botao" onClick={fechar} aria-label="Fechar">
            <IconeFechar size={22} />
          </button>
        </div>
        {item.desc && <p className="folha__desc">{Array.isArray(item.desc) ? item.desc.join(" · ") : item.desc}</p>}

        <div className="folha__grupos">
          {visiveis.map((g) => {
            const erro = faltando.includes(g.id) && !sel[g.id];
            return (
              <fieldset key={g.id} id={`grupo-${g.id}`} className={`grupo ${erro ? "grupo--erro" : ""}`}>
                <legend className="grupo__titulo">
                  {g.titulo.replace(/^Passo \d: /, "")}
                  <span className="grupo__tag">{g.obrigatorio ? "obrigatório" : "opcional"}</span>
                </legend>
                {erro && <p className="grupo__erro">Escolha uma opção para continuar.</p>}
                {!g.obrigatorio && (
                  <label className="opcao">
                    <input
                      type="radio"
                      name={g.id}
                      checked={sel[g.id] === NENHUM}
                      onChange={() => setSel((s) => ({ ...s, [g.id]: NENHUM }))}
                    />
                    <span className="opcao__nome">Sem adicional</span>
                  </label>
                )}
                {g.opcoes.map((o) => (
                  <label key={o.id} className="opcao">
                    <input
                      type="radio"
                      name={g.id}
                      checked={sel[g.id] === o.id}
                      onChange={() => setSel((s) => ({ ...s, [g.id]: o.id }))}
                    />
                    <span className="opcao__nome">
                      {o.nome}
                      {o.descricao && <small>{o.descricao}</small>}
                    </span>
                    {o.preco != null && (
                      <span className="opcao__preco">{g.tipo === "adicional" ? `+ ${brl(o.preco)}` : brl(o.preco)}</span>
                    )}
                  </label>
                ))}
              </fieldset>
            );
          })}

          <label className="campo">
            <span className="campo__rotulo">Alguma observação?</span>
            <textarea
              rows={2}
              maxLength={140}
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Ex.: sem tomate, molho à parte"
            />
          </label>
        </div>

        <div className="folha__rodape">
          <div className="qtd" aria-label="Quantidade">
            <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" disabled={qtd <= 1}>
              <IconeMenos size={18} />
            </button>
            <span aria-live="polite">{qtd}</span>
            <button type="button" onClick={() => setQtd((q) => Math.min(20, q + 1))} aria-label="Aumentar quantidade">
              <IconeMais size={18} />
            </button>
          </div>
          <button type="button" className="botao botao--laranja folha__confirmar" onClick={confirmar}>
            {temBaseSemEscolha ? "Adicionar à comanda" : `Adicionar · ${brl(unitario * qtd)}`}
          </button>
        </div>
        <button
          type="button"
          className="folha__ver"
          onClick={() => {
            fechar();
            abrir();
          }}
        >
          Ver minha comanda
        </button>
      </div>
    </dialog>
  );
}
