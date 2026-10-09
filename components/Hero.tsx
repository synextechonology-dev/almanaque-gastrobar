import Image from "next/image";
import StatusAberto from "./StatusAberto";
import Edicao from "./Edicao";
import Plaquinha from "./Plaquinha";
import Lanterna from "./Lanterna";
import { site } from "@/lib/site";

/*
 * Primeira impressão: é noite, a pessoa chega à porta do Almanaque e o letreiro acende.
 * O fundo é a própria fachada, desfocada como luz de rua vista de longe.
 * No computador, a fachada nítida vira uma porta em arco com a plaquinha de aberto/fechado.
 */
export default function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-titulo">
      <div className="hero__ambiente" aria-hidden>
        <Image src="/fotos/fachada-lateral.jpg" alt="" fill priority sizes="40vw" />
      </div>
      <div className="hero__brilho" aria-hidden />
      <span className="monograma hero__monograma" aria-hidden>
        A
      </span>
      <Lanterna />

      <div className="hero__miolo">
        <Edicao />

        <div className="hero__grade">
          <div className="hero__texto">
            <h1 id="hero-titulo" className="hero__letreiro">
              <Image src="/brand/logo-laranja.png" alt="Almanaque Gastrobar" width={521} height={118} priority />
            </h1>
            <p className="hero__slogan">{site.slogan}</p>
            <p className="hero__lede">
              Tem um letreiro aceso no Centro de Santa Cruz do Rio Pardo. Debaixo dele: grelhado no ponto, risoto que demorou
              pra chegar na cidade, drinque autoral e uma mesa esperando a história de hoje.
            </p>
            <div className="hero__acoes">
              <a href="#cardapio" className="botao botao--laranja">
                Abrir o cardápio
              </a>
              <a href="#reservas" className="botao botao--contorno">
                Guardar uma mesa
              </a>
            </div>
            <StatusAberto className="hero__status" />
          </div>

          <div className="hero__porta">
            <div className="hero__foto">
              <Image
                src="/fotos/fachada-frente.jpg"
                alt="Fachada do Almanaque Gastrobar à noite, com o letreiro aceso e lampiões na entrada"
                fill
                priority
                sizes="(min-width: 960px) 320px, 0px"
              />
            </div>
            <Plaquinha />
          </div>
        </div>
      </div>

      <a href="#historia" className="hero__descer" aria-label="Continuar lendo">
        <span>vire a página</span>
        <span className="hero__descer-linha" aria-hidden />
      </a>
    </section>
  );
}
