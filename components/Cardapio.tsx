"use client";

import { useState } from "react";
import Image from "next/image";
import { cardapio, type Item, type Secao } from "@/lib/menu";
import { precoCardapio } from "@/lib/format";
import { useComanda } from "@/lib/comanda";
import { IconeFolha, IconeMais } from "./Icons";
import ItemSheet from "./ItemSheet";
import Capitulo from "./Capitulo";
import { site } from "@/lib/site";

/**
 * Mostra molduras vazias onde ainda não há foto do prato.
 * Fica desligado enquanto as fotos não chegam: pratos sem foto aparecem só com o texto, sem buraco no layout.
 */
const MOSTRAR_ESPACO_DE_FOTO = false;

export default function Cardapio() {
  const [aba, setAba] = useState(cardapio[0].id);
  const [aberto, setAberto] = useState<Item | null>(null);
  const { adicionar } = useComanda();

  function pedir(item: Item) {
    if (item.grupos?.length) setAberto(item);
    else if (item.preco != null) adicionar(item, { precoUnitario: item.preco, escolhas: [], obs: "", qtd: 1 });
  }

  function trocarAba(id: string) {
    setAba(id);
    document.getElementById("cardapio-papel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="cardapio" className="cardapio fundo-noite" aria-labelledby="cardapio-titulo">
      <div className="conteudo">
        <header className="cardapio__cabeca">
          <Capitulo n={2}>O cardápio</Capitulo>
          <h2 id="cardapio-titulo" className="titulo-secao" data-revelar>
            Senta, que lá vem cardápio.
          </h2>
          <p className="cardapio__sub" data-revelar>
            Escolha sem pressa. Toque em <strong>Pedir</strong> pra separar na sua comanda; no fim, ela vai inteirinha pro nosso
            WhatsApp, {site.pedidos.aceitaEntrega ? "pra retirar no balcão ou receber em casa" : "pra retirar no balcão"}. Se
            preferir comer aqui, é só aparecer.
          </p>
        </header>

        <div className="abas" role="tablist" aria-label="Partes do cardápio">
          {cardapio.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              id={`aba-${a.id}`}
              aria-selected={aba === a.id}
              aria-controls={`painel-${a.id}`}
              className={`aba ${aba === a.id ? "aba--ativa" : ""}`}
              onClick={() => trocarAba(a.id)}
            >
              {a.titulo}
            </button>
          ))}
        </div>

        <article id="cardapio-papel" className="papel">
          <div className="papel__cabeca">
            <Image src="/brand/logo-petroleo.png" alt="Almanaque Gastrobar" width={521} height={118} className="papel__logo" />
            <span className="papel__rotulo">Cardápio</span>
          </div>

          {cardapio.map((a) => (
            <div
              key={a.id}
              id={`painel-${a.id}`}
              role="tabpanel"
              aria-labelledby={`aba-${a.id}`}
              hidden={aba !== a.id}
              className="papel__painel"
            >
              {a.secoes.map((s) => (s.passos ? <SecaoPassos key={s.id} secao={s} onMontar={pedir} /> : <SecaoLista key={s.id} secao={s} onPedir={pedir} />))}
            </div>
          ))}

          <div className="papel__rodape">
            <p className="papel__legenda">
              <IconeFolha size={16} /> Opção vegetariana
            </p>
            <p className="papel__fim">Boa comida, boas histórias.</p>
          </div>
        </article>
      </div>

      {aberto && <ItemSheet item={aberto} onFechar={() => setAberto(null)} />}
    </section>
  );
}

function SecaoLista({ secao, onPedir }: { secao: Secao; onPedir: (i: Item) => void }) {
  const compacta = !secao.comFotos && secao.blocos.every((b) => b.itens.every((i) => !i.desc));
  return (
    <section className="papel__secao" aria-labelledby={`sec-${secao.id}`}>
      <h3 id={`sec-${secao.id}`} className="papel__titulo">
        {secao.titulo}
      </h3>
      {secao.chamada && <p className="papel__chamada">{secao.chamada}</p>}

      {secao.blocos.map((b, i) => (
        <div key={i} className="papel__bloco">
          {b.titulo && <h4 className="papel__subtitulo">{b.titulo}</h4>}
          <ul className={`pratos ${compacta ? "pratos--compacta" : ""}`}>
            {b.itens.map((item) => (
              <Prato key={item.id} item={item} comFoto={Boolean(secao.comFotos)} compacto={compacta} onPedir={onPedir} />
            ))}
          </ul>
        </div>
      ))}

      {secao.quadro && (
        <aside className="quadro">
          <p className="quadro__titulo">{secao.quadro.titulo}</p>
          <ul>
            {secao.quadro.linhas.map(([nome, valor]) => (
              <li key={nome}>
                <span>{nome}</span>
                <span className="quadro__valor">{valor}</span>
              </li>
            ))}
          </ul>
          {secao.quadro.nota && <p className="quadro__nota">{secao.quadro.nota}</p>}
          <p className="quadro__dica">Você escolhe esse adicional quando tocar em Pedir.</p>
        </aside>
      )}
    </section>
  );
}

function Prato({ item, comFoto, compacto, onPedir }: { item: Item; comFoto: boolean; compacto: boolean; onPedir: (i: Item) => void }) {
  const base = item.grupos?.find((g) => g.tipo === "base");
  const temFoto = comFoto && Boolean(item.foto || MOSTRAR_ESPACO_DE_FOTO);
  const descricao = Array.isArray(item.desc) ? item.desc : item.desc ? [item.desc] : [];

  return (
    <li className={`prato ${temFoto ? "prato--foto" : ""} ${compacto ? "prato--compacto" : ""}`}>
      {temFoto && (
        <div className="prato__foto">
          {item.foto ? (
            <Image src={item.foto} alt={item.nome} fill sizes="96px" />
          ) : MOSTRAR_ESPACO_DE_FOTO ? (
            <span className="prato__foto-vazia">foto do prato</span>
          ) : null}
        </div>
      )}

      <div className="prato__corpo">
        <div className="prato__linha">
          <h4 className="prato__nome">
            {item.nome}
            {item.veggie && <IconeFolha size={16} className="prato__veggie" title="Opção vegetariana" />}
          </h4>
          {item.preco != null && <span className="prato__preco">{precoCardapio(item.preco)}</span>}
        </div>
        {descricao.map((d, i) => (
          <p key={i} className="prato__desc">
            {d}
          </p>
        ))}
        {base && item.preco == null && (
          <ul className="prato__variantes">
            {base.opcoes.map((o) => (
              <li key={o.id}>
                <span>{o.nome}</span>
                <span className="prato__preco">{precoCardapio(o.preco ?? 0)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="prato__acao">
        {item.soNaCasa ? (
          <span className="selo">Cortesia servida no salão</span>
        ) : (
          <button type="button" className="pedir" onClick={() => onPedir(item)} aria-label={`Pedir ${item.nome}`}>
            <IconeMais size={16} />
            Pedir
          </button>
        )}
      </div>
    </li>
  );
}

function SecaoPassos({ secao, onMontar }: { secao: Secao; onMontar: (i: Item) => void }) {
  const item = secao.blocos[0].itens[0];
  const passos = (item.grupos ?? []).filter((g) => !g.aplicaSe);
  return (
    <section className="papel__secao passos" aria-labelledby={`sec-${secao.id}`}>
      <h3 id={`sec-${secao.id}`} className="papel__titulo">
        {secao.titulo}
      </h3>
      <ol className="passos__lista">
        {passos.map((g) => (
          <li key={g.id} className="passo">
            <h4 className="papel__subtitulo">{g.titulo}</h4>
            {g.ajuda && <p className="papel__chamada">{g.ajuda}</p>}
            <ul className="pratos">
              {g.opcoes.map((o) => (
                <li key={o.id} className="prato prato--opcao">
                  <div className="prato__corpo">
                    <div className="prato__linha">
                      <span className="prato__nome">{o.nome}</span>
                      {o.preco != null && <span className="prato__preco">{precoCardapio(o.preco)}</span>}
                    </div>
                    {o.descricao && <p className="prato__desc">{o.descricao}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <button type="button" className="botao botao--petroleo passos__botao" onClick={() => onMontar(item)}>
        Montar meu grelhado
      </button>
    </section>
  );
}
