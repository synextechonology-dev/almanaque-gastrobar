import type { Lua as TLua } from "@/lib/almanaque";

/**
 * Desenho da lua de hoje, visto do hemisfério sul:
 * aqui a lua crescente acende pelo lado esquerdo.
 */
export default function Lua({ lua, size = 18 }: { lua: TLua; size?: number }) {
  const r = 10;
  const rx = Math.abs(1 - 2 * lua.luz) * r;
  // Parte iluminada desenhada à direita; espelhada quando a luz está à esquerda.
  const luzNaDireita = !lua.crescendo;
  const d = `M12 2 A${r} ${r} 0 0 1 12 22 A${rx.toFixed(2)} ${r} 0 0 ${lua.luz > 0.5 ? 1 : 0} 12 2 Z`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="lua">
      <circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      {lua.luz > 0.02 && <path d={d} fill="currentColor" transform={luzNaDireita ? undefined : "matrix(-1 0 0 1 24 0)"} />}
    </svg>
  );
}
