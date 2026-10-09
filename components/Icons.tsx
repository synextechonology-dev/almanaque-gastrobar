/** Ícones em traço fino, como pede o manual de identidade. */
type P = { size?: number; className?: string; title?: string };

function Svg({ size = 24, className, title, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const IconeFolha = (p: P) => (
  <Svg {...p}>
    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
    <path d="M5 19 13 11" />
  </Svg>
);

export const IconeMais = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const IconeMenos = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const IconeFechar = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const IconeComanda = (p: P) => (
  <Svg {...p}>
    <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21V3Z" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </Svg>
);

export const IconeRelogio = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);

export const IconePino = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);

export const IconeInstagram = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </Svg>
);

export const IconeWhatsapp = (p: P) => (
  <Svg {...p}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1Z" />
    <path d="M9 9.2c0 3 2.6 5.8 5.8 5.8l1.2-1.3-1.8-.9-.9.9a4.5 4.5 0 0 1-2.4-2.4l.9-.9-.9-1.8L9 9.2Z" />
  </Svg>
);

export const IconeSeta = (p: P) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);

/* Os quatro pilares da casa (manual, seção 05). */
export const IconeChope = (p: P) => (
  <Svg {...p}>
    <path d="M6 8h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z" />
    <path d="M15 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
    <path d="M6 8a2.5 2.5 0 0 1 2-4 3 3 0 0 1 5 0 2.5 2.5 0 0 1 2 4" />
    <path d="M9 12v6M12 12v6" />
  </Svg>
);

export const IconeDrinque = (p: P) => (
  <Svg {...p}>
    <path d="M4 5h14l-7 8-7-8Z" />
    <path d="M11 13v7M7.5 20h7" />
    <circle cx="18" cy="5" r="2" />
  </Svg>
);

export const IconeLanche = (p: P) => (
  <Svg {...p}>
    <path d="M4 11a8 6 0 0 1 16 0H4Z" />
    <path d="M3.5 14h17" />
    <path d="M4 17h16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
  </Svg>
);

export const IconeMusica = (p: P) => (
  <Svg {...p}>
    <circle cx="15.5" cy="7.5" r="3.5" />
    <path d="M13 10 5 18l1 1 8-8" />
    <path d="M6 19l-2 2" />
  </Svg>
);
