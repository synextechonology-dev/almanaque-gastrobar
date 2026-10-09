"use client";

import { useComanda } from "@/lib/comanda";
import { brl } from "@/lib/format";
import { IconeComanda } from "./Icons";

/** Barra fixa no rodapé do celular quando há itens, e aviso rápido ao adicionar. */
export default function BotaoComanda() {
  const { totalItens, subtotal, abrir, aviso, aberta } = useComanda();
  return (
    <>
      <div className="aviso" role="status" aria-live="polite">
        {aviso && <span className="aviso__txt">{aviso}</span>}
      </div>
      {totalItens > 0 && !aberta && (
        <button type="button" className="barra-comanda" onClick={abrir}>
          <IconeComanda size={20} />
          <span>
            Ver comanda <small>({totalItens} {totalItens === 1 ? "item" : "itens"})</small>
          </span>
          <strong>{brl(subtotal)}</strong>
        </button>
      )}
    </>
  );
}
