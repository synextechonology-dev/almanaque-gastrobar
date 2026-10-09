"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useComanda } from "@/lib/comanda";
import { IconeComanda, IconeFechar } from "./Icons";
import { site } from "@/lib/site";
import { linkWhatsApp } from "@/lib/whatsapp";

const LINKS = [
  { href: "#historia", rotulo: "A casa" },
  { href: "#cardapio", rotulo: "Cardápio" },
  { href: "#reservas", rotulo: "Reservas" },
  { href: "#espaco", rotulo: "O lugar" },
  { href: "#visita", rotulo: "Como chegar" },
];

export default function Header() {
  const { totalItens, abrir } = useComanda();
  const [rolou, setRolou] = useState(false);
  const [menu, setMenu] = useState(false);

  const pavio = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const aoRolar = () => {
      setRolou(window.scrollY > 40);
      // O "pavio" no topo queima conforme a pessoa lê a página.
      const total = document.documentElement.scrollHeight - window.innerHeight;
      pavio.current?.style.setProperty("--lido", String(total > 0 ? Math.min(1, window.scrollY / total) : 0));
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("travado", menu);
  }, [menu]);

  return (
    <header className={`topo ${rolou || menu ? "topo--solido" : ""}`}>
      <span ref={pavio} className="topo__pavio" aria-hidden />
      <div className="topo__linha">
        <a href="#inicio" className="topo__logo" aria-label="Almanaque Gastrobar, início">
          <Image src="/brand/logo-creme.png" alt="" width={521} height={118} priority />
        </a>

        <nav className="topo__nav" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.rotulo}
            </a>
          ))}
        </nav>

        <div className="topo__acoes">
          <button type="button" className="topo__comanda" onClick={abrir} aria-label={`Abrir comanda, ${totalItens} itens`}>
            <IconeComanda size={20} />
            <span className="topo__comanda-txt">Comanda</span>
            {totalItens > 0 && <span className="contador">{totalItens}</span>}
          </button>
          <button
            type="button"
            className="topo__menu"
            aria-expanded={menu}
            aria-controls="menu-movel"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <IconeFechar size={22} /> : <span className="topo__menu-linhas" aria-hidden />}
            <span className="sr">{menu ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>

      <nav id="menu-movel" className={`menu-movel ${menu ? "menu-movel--aberto" : ""}`} aria-label="Menu" hidden={!menu}>
        <ol className="menu-movel__lista">
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenu(false)}>
                <span className="menu-movel__n">{String(i + 1).padStart(2, "0")}</span>
                {l.rotulo}
              </a>
            </li>
          ))}
        </ol>
        <div className="menu-movel__pe">
          <p className="menu-movel__slogan">{site.slogan}</p>
          <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
            WhatsApp {site.whatsappExibicao}
          </a>
          <span>
            {site.endereco.rua} · {site.endereco.bairro}
          </span>
        </div>
      </nav>
    </header>
  );
}
