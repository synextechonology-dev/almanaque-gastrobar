"use client";

import { useState } from "react";
import Image from "next/image";
import { acharItem, destaques, type Item } from "@/lib/menu";
import { precoCardapio } from "@/lib/format";
import { useComanda } from "@/lib/comanda";
import ItemSheet from "./ItemSheet";
import Capitulo from "./Capitulo";
import { IconeMais } from "./Icons";

/**
 * Vitrine dos pratos que o dono quer destacar (lista em lib/menu.ts > destaques).
 * Sem foto, cada prato vira uma "lâmina" tipográfica com a inicial gigante; com foto, a foto entra no lugar.
 */
export default function DaCozinha() {
  const { adicionar } = useComanda();
  const [aberto, setAberto] = useState<Item | null>(null);
  const itens = destaques.map((id) => acharItem(id)?.item).filter(Boolean) as Item[];

  function pedir(item: Item) {
    if (item.grupos?.length) setAberto(item);
    else if (item.preco != null) adicionar(item, { precoUnitario: item.preco, escolhas: [], obs: "", qtd: 1 });
  }

  return (
    <section className="cozinha fundo-creme" aria-labelledby="cozinha-titulo">
      <div className="conteudo">
        <div className="cozinha__cabeca">
          <Capitulo n={3} className="capitulo--escuro">
            Feito com alma
          </Capitulo>
          <h2 id="cozinha-titulo" className="titulo-secao" data-revelar>
            Primeira vez aqui? Comece por estes.
          </h2>
          <p data-revelar>
            Quatro pratos que contam direitinho quem a gente é. Cada um leva o tempo que precisa, e vale cada minuto.
          </p>
        </div>

        <ol className="cozinha__grade">
          {itens.map((item, i) => {
            const texto = item.causo ?? (Array.isArray(item.desc) ? item.desc[0] : item.desc);
            return (
              <li key={item.id} className="lamina" data-revelar style={{ ["--atraso" as string]: `${i * 110}ms` }}>
                <div className={`lamina__arte ${item.foto ? "lamina__arte--foto" : ""}`}>
                  {item.foto ? (
                    <Image src={item.foto} alt={item.nome} fill sizes="(min-width: 1000px) 25vw, (min-width: 640px) 45vw, 80vw" />
                  ) : (
                    <span className="lamina__inicial" aria-hidden>
                      {item.nome.replace(/^[^A-Za-zÀ-ú]+/, "").charAt(0)}
                    </span>
                  )}
                  <span className="lamina__n">Nº {String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="lamina__corpo">
                  <h3 className="lamina__nome">{item.nome}</h3>
                  {texto && <p className="lamina__desc">{texto}</p>}
                  <div className="lamina__rodape">
                    {item.preco != null && <span className="lamina__preco">{precoCardapio(item.preco)}</span>}
                    <button type="button" className="pedir pedir--escuro" onClick={() => pedir(item)} aria-label={`Pedir ${item.nome}`}>
                      <IconeMais size={16} />
                      Pedir
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {aberto && <ItemSheet item={aberto} onFechar={() => setAberto(null)} />}
    </section>
  );
}
