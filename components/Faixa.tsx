/** Faixa laranja correndo com o que sai da cozinha e do balcão. */
const PALAVRAS = [
  "Chope gelado",
  "Tornedor no ponto",
  "Risoto Suã",
  "Negroni defumado",
  "Burrata com tomate confit",
  "Bolinho de mandioca emporcalhado",
  "Jorge Amado",
  "Brownie chocolatudo",
  "Pipoquinha por conta da casa",
];

export default function Faixa() {
  const linha = (
    <>
      {PALAVRAS.map((p) => (
        <span key={p} className="faixa__item">
          {p}
          <span className="faixa__estrela">✦</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="faixa" aria-label={`Na casa: ${PALAVRAS.join(", ")}`} role="marquee">
      <div className="faixa__trilho" aria-hidden>
        <div className="faixa__grupo">{linha}</div>
        <div className="faixa__grupo">{linha}</div>
      </div>
    </div>
  );
}
