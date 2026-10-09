import Image from "next/image";
import Capitulo from "./Capitulo";
import { IconeChope, IconeDrinque, IconeLanche, IconeMusica } from "./Icons";

const PILARES = [
  { Icone: IconeChope, nome: "Chope", nota: "Gelado, com colarinho de respeito." },
  { Icone: IconeDrinque, nome: "Drinques", nota: "Clássicos bem feitos e autorais da casa." },
  { Icone: IconeLanche, nome: "Cozinha", nota: "Do burger que começou tudo ao tornedor." },
  { Icone: IconeMusica, nome: "Música", nota: "Trilha boa pra conversa render." },
];

export default function Historia() {
  return (
    <section id="historia" className="historia fundo-petroleo" aria-labelledby="historia-titulo">
      <span className="monograma historia__monograma" aria-hidden>
        A
      </span>
      <div className="conteudo">
        <Capitulo n={1}>A casa</Capitulo>

        <div className="historia__grade">
          <div className="historia__texto">
            {/* O verbete: a palavra do nome, explicada como num dicionário antigo. */}
            <dl className="verbete" data-revelar>
              <dt>
                <span className="verbete__palavra">al·ma·na·que</span>
                <span className="verbete__classe">substantivo masculino</span>
              </dt>
              <dd>
                <span className="verbete__n">1.</span> Livro de antigamente que juntava de tudo um pouco: calendário, fases da
                lua, receita, conselho e causo.
              </dd>
              <dd>
                <span className="verbete__n">2.</span> Em Santa Cruz do Rio Pardo, gastrobar onde cada mesa é uma página e cada
                noite, uma história pra contar.
              </dd>
            </dl>

            <h2 id="historia-titulo" className="titulo-secao" data-revelar>
              Um bar de bairro com alma de almanaque.
            </h2>
            <div className="historia__corpo" data-revelar>
              <p>
                O Almanaque nasceu da vontade de juntar gente, histórias e sabores num lugar só. Cada visita vira uma página
                nova do seu próprio almanaque de memórias: o aniversário que acabou tarde, o primeiro encontro, aquela sexta que
                ninguém esquece.
              </p>
              <p>
                Mais do que um gastrobar, é um convite à pausa, à lembrança e à celebração. Alma retrô, olhar contemporâneo e
                uma cozinha que não tem pressa, porque coisa boa leva o tempo que precisa.
              </p>
            </div>
          </div>

          <figure className="historia__foto" data-revelar>
            <div className="moldura historia__moldura">
              <Image
                src="/fotos/salao.jpg"
                alt="Salão do Almanaque com luz baixa, parede de tijolos e plantas"
                fill
                sizes="(min-width: 900px) 340px, 80vw"
              />
            </div>
            <figcaption>O salão, numa noite qualquer. Que nunca é qualquer.</figcaption>
          </figure>
        </div>

        <div className="pilares__cabeca" data-revelar>
          <p className="pilares__titulo">Quatro coisas que a gente leva a sério</p>
        </div>
        <ul className="pilares" aria-label="O que tem na casa">
          {PILARES.map(({ Icone, nome, nota }, i) => (
            <li key={nome} data-revelar style={{ ["--atraso" as string]: `${i * 90}ms` }}>
              <Icone size={34} />
              <span className="pilares__nome">{nome}</span>
              <span className="pilares__nota">{nota}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
