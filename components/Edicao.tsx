"use client";

import { useEffect, useState } from "react";
import { dataDeHoje, faseDaLua, numeroEdicao, previsaoDeHoje, type Lua as TLua } from "@/lib/almanaque";
import Lua from "./Lua";

type Hoje = { data: string; edicao: number; lua: TLua; previsao: string };

/** Cabeçalho de almanaque: a edição de hoje, a lua e a previsão da casa. */
export default function Edicao() {
  const [hoje, setHoje] = useState<Hoje | null>(null);

  useEffect(() => {
    const atualizar = () => setHoje({ data: dataDeHoje(), edicao: numeroEdicao(), lua: faseDaLua(), previsao: previsaoDeHoje() });
    atualizar();
    const t = window.setInterval(atualizar, 5 * 60_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className={`edicao ${hoje ? "edicao--pronta" : ""}`}>
      <div className="edicao__linha">
        <span className="edicao__item edicao__item--nome">Edição de hoje{hoje && <> · nº {hoje.edicao}</>}</span>
        <span className="edicao__item edicao__item--data">{hoje?.data ?? " "}</span>
        <span className="edicao__item edicao__item--lua">
          {hoje && (
            <>
              <Lua lua={hoje.lua} size={16} />
              {hoje.lua.nome}
            </>
          )}
        </span>
      </div>
      <p className="edicao__previsao">{hoje?.previsao ?? " "}</p>
    </div>
  );
}
