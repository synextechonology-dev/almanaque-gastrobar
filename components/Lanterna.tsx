"use client";

import { useEffect, useRef } from "react";

/** No computador, uma luz quente acompanha o mouse pelo início da página, como um lampião. */
export default function Lanterna() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const pai = el?.parentElement;
    if (!el || !pai) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let quadro = 0;
    const mover = (e: PointerEvent) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const r = pai.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
        el.classList.add("lanterna--acesa");
      });
    };
    const sair = () => el.classList.remove("lanterna--acesa");
    pai.addEventListener("pointermove", mover);
    pai.addEventListener("pointerleave", sair);
    return () => {
      cancelAnimationFrame(quadro);
      pai.removeEventListener("pointermove", mover);
      pai.removeEventListener("pointerleave", sair);
    };
  }, []);

  return <div ref={ref} className="lanterna" aria-hidden />;
}
