import Image from "next/image";
import { site } from "@/lib/site";

export default function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className="rodape fundo-noite">
      <span className="monograma rodape__monograma" aria-hidden>
        A
      </span>
      <div className="conteudo rodape__grade">
        <p className="rodape__slogan">{site.slogan}</p>
        <p className="rodape__fimdaedicao">Fim desta edição. A próxima página quem escreve é você.</p>
        <div className="rodape__linha">
          <Image src="/brand/logo-laranja.png" alt="Almanaque Gastrobar" width={521} height={118} className="rodape__logo" />
          <nav className="rodape__nav" aria-label="Rodapé">
            <a href="#cardapio">Cardápio</a>
            <a href="#reservas">Reservas</a>
            <a href="#espaco">O lugar</a>
            <a href="#visita">Como chegar</a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </nav>
        </div>
        <p className="rodape__fino">
          © {ano} {site.nome} · {site.endereco.cidade}, {site.endereco.uf}. Beba com moderação. Venda de bebidas alcoólicas
          proibida para menores de 18 anos.
          {site.creditoAgencia.nome && (
            <>
              {" "}
              Site por{" "}
              {site.creditoAgencia.url ? (
                <a href={site.creditoAgencia.url} target="_blank" rel="noopener noreferrer">
                  {site.creditoAgencia.nome}
                </a>
              ) : (
                site.creditoAgencia.nome
              )}
              .
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
