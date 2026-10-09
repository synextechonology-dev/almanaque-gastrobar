import Image from "next/image";
import Capitulo from "./Capitulo";

/**
 * Fotos do lugar, em formato de retrato revelado.
 * Para trocar ou acrescentar, salve em /public/fotos e edite a lista.
 * As fotos atuais são pequenas (340 px), por isso ficam em tamanho de retrato, nunca em tela cheia.
 */
const FOTOS = [
  { src: "/fotos/fachada-frente.jpg", alt: "Entrada do Almanaque com lampiões acesos e floreiras de tijolo", legenda: "A entrada, lampião aceso." },
  { src: "/fotos/salao.jpg", alt: "Salão com parede de tijolos, plantas e luz baixa", legenda: "O salão, luz baixa." },
  { src: "/fotos/fachada-lateral.jpg", alt: "Esquina do Almanaque à noite, com o letreiro aceso e a varanda", legenda: "A esquina, num dia de jogo." },
];

export default function Espaco() {
  return (
    <section id="espaco" className="espaco fundo-noite" aria-labelledby="espaco-titulo">
      <span className="monograma espaco__monograma" aria-hidden>
        A
      </span>
      <div className="conteudo">
        <div className="espaco__cabeca">
          <Capitulo n={5}>O lugar</Capitulo>
          <h2 id="espaco-titulo" className="titulo-secao" data-revelar>
            Tijolo aparente, lampião aceso e cadeira que ninguém tem pressa de largar.
          </h2>
          <p data-revelar>
            Do lado de fora, os lampiões avisam que tem gente boa lá dentro. Do lado de dentro, luz baixa, planta pra todo lado
            e aquele barulho bom de mesa conversando. Chega pra jantar, fica pra mais uma rodada.
          </p>
        </div>

        <ul className="espaco__grade">
          {FOTOS.map((f, i) => (
            <li key={f.src} className={`retrato retrato--${i + 1}`} data-revelar style={{ ["--atraso" as string]: `${i * 120}ms` }}>
              <figure>
                <div className="retrato__foto">
                  <Image src={f.src} alt={f.alt} fill sizes="(min-width: 900px) 300px, (min-width: 600px) 30vw, 70vw" />
                </div>
                <figcaption className="retrato__legenda">
                  <span>Fig. {i + 1}</span> {f.legenda}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
