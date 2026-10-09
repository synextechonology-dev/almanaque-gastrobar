"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { site } from "./site";
import type { Item } from "./menu";

export type Escolha = { grupoId: string; grupo: string; opcaoId: string; opcao: string };

export type LinhaComanda = {
  chave: string;
  itemId: string;
  nome: string;
  precoUnitario: number;
  qtd: number;
  escolhas: Escolha[];
  obs: string;
  alcool: boolean;
};

type Salvo = { v: 1; linhas: LinhaComanda[]; atualizadoEm: number };

const CHAVE = "almanaque:comanda";
const VALIDADE_MS = site.pedidos.validadeComandaMin * 60 * 1000;

type Ctx = {
  linhas: LinhaComanda[];
  totalItens: number;
  subtotal: number;
  temAlcool: boolean;
  expiraEm: number | null;
  aberta: boolean;
  abrir: () => void;
  fechar: () => void;
  adicionar: (item: Item, dados: { precoUnitario: number; escolhas: Escolha[]; obs: string; qtd: number }) => void;
  alterarQtd: (chave: string, qtd: number) => void;
  remover: (chave: string) => void;
  limpar: () => void;
  aviso: string | null;
};

const ComandaCtx = createContext<Ctx | null>(null);

function ler(): Salvo | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as Salvo;
    if (dados.v !== 1 || Date.now() - dados.atualizadoEm > VALIDADE_MS) {
      localStorage.removeItem(CHAVE);
      return null;
    }
    return dados;
  } catch {
    return null;
  }
}

function gravar(linhas: LinhaComanda[]): number | null {
  try {
    if (!linhas.length) {
      localStorage.removeItem(CHAVE);
      return null;
    }
    const agora = Date.now();
    localStorage.setItem(CHAVE, JSON.stringify({ v: 1, linhas, atualizadoEm: agora } satisfies Salvo));
    return agora;
  } catch {
    return null;
  }
}

function assinatura(itemId: string, escolhas: Escolha[], obs: string) {
  return [itemId, ...escolhas.map((e) => `${e.grupoId}:${e.opcaoId}`).sort(), obs.trim().toLowerCase()].join("|");
}

export function ComandaProvider({ children }: { children: ReactNode }) {
  const [linhas, setLinhas] = useState<LinhaComanda[]>([]);
  const [atualizadoEm, setAtualizadoEm] = useState<number | null>(null);
  const [aberta, setAberta] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  // Só grava quando o cliente mexe na comanda; abrir o site não renova o prazo.
  const mexeu = useRef(false);

  // Carrega a comanda salva (descartando se passou de 1 hora).
  useEffect(() => {
    const salvo = ler();
    if (salvo) {
      setLinhas(salvo.linhas);
      setAtualizadoEm(salvo.atualizadoEm);
    }
  }, []);

  // Salva a cada mudança e renova o prazo de 1 hora.
  useEffect(() => {
    if (!mexeu.current) return;
    mexeu.current = false;
    setAtualizadoEm(gravar(linhas));
  }, [linhas]);

  // Esvazia a comanda quando o prazo vence com a página aberta.
  useEffect(() => {
    if (!atualizadoEm) return;
    const restante = atualizadoEm + VALIDADE_MS - Date.now();
    const t = window.setTimeout(() => {
      mexeu.current = true;
      setLinhas([]);
    }, Math.max(0, restante));
    return () => window.clearTimeout(t);
  }, [atualizadoEm]);

  // Aviso curto ao adicionar.
  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setAviso(null), 2600);
    return () => window.clearTimeout(t);
  }, [aviso]);

  const adicionar: Ctx["adicionar"] = useCallback((item, { precoUnitario, escolhas, obs, qtd }) => {
    mexeu.current = true;
    setLinhas((atual) => {
      const ass = assinatura(item.id, escolhas, obs);
      const igual = atual.find((l) => assinatura(l.itemId, l.escolhas, l.obs) === ass);
      if (igual) return atual.map((l) => (l === igual ? { ...l, qtd: l.qtd + qtd } : l));
      return [
        ...atual,
        {
          chave: `${item.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          itemId: item.id,
          nome: item.nome,
          precoUnitario,
          qtd,
          escolhas,
          obs: obs.trim(),
          alcool: Boolean(item.alcool),
        },
      ];
    });
    setAviso(`${qtd > 1 ? `${qtd}x ` : ""}${item.nome} na comanda`);
  }, []);

  const alterarQtd = useCallback((chave: string, qtd: number) => {
    mexeu.current = true;
    setLinhas((atual) => (qtd <= 0 ? atual.filter((l) => l.chave !== chave) : atual.map((l) => (l.chave === chave ? { ...l, qtd } : l))));
  }, []);

  const remover = useCallback((chave: string) => {
    mexeu.current = true;
    setLinhas((a) => a.filter((l) => l.chave !== chave));
  }, []);
  const limpar = useCallback(() => {
    mexeu.current = true;
    setLinhas([]);
  }, []);

  const valor = useMemo<Ctx>(() => {
    const totalItens = linhas.reduce((s, l) => s + l.qtd, 0);
    const subtotal = linhas.reduce((s, l) => s + l.qtd * l.precoUnitario, 0);
    return {
      linhas,
      totalItens,
      subtotal,
      temAlcool: linhas.some((l) => l.alcool),
      expiraEm: atualizadoEm ? atualizadoEm + VALIDADE_MS : null,
      aberta,
      abrir: () => setAberta(true),
      fechar: () => setAberta(false),
      adicionar,
      alterarQtd,
      remover,
      limpar,
      aviso,
    };
  }, [linhas, atualizadoEm, aberta, adicionar, alterarQtd, remover, limpar, aviso]);

  return <ComandaCtx.Provider value={valor}>{children}</ComandaCtx.Provider>;
}

export function useComanda(): Ctx {
  const ctx = useContext(ComandaCtx);
  if (!ctx) throw new Error("useComanda precisa estar dentro de <ComandaProvider>");
  return ctx;
}
