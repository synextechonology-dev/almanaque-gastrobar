"use client";

import { useEffect } from "react";

/**
 * Faz os blocos marcados com data-revelar surgirem ao entrar na tela.
 * Só esconde o que ainda está abaixo da dobra, então nada pisca e, sem JavaScript, tudo aparece normal.
 */
export default function Revelar() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("revelado");
          obs.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const alturaTela = window.innerHeight;
    document.querySelectorAll<HTMLElement>("[data-revelar]").forEach((el) => {
      if (el.getBoundingClientRect().top < alturaTela) return;
      el.classList.add("revelar");
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return null;
}
