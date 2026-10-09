/** Rótulo de capítulo, como nas páginas do manual: "Nº 02 · O cardápio". */
export default function Capitulo({ n, children, className = "" }: { n: number; children: React.ReactNode; className?: string }) {
  return (
    <p className={`capitulo ${className}`}>
      <span className="capitulo__n">Nº {String(n).padStart(2, "0")}</span>
      <span className="capitulo__traco" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
