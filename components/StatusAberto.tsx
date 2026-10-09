"use client";

import { useEffect, useState } from "react";
import { statusAgora, type Status } from "@/lib/horarios";

/** Mostra "Aberto agora, até 23h" ou a próxima abertura. Atualiza a cada minuto. */
export function useStatus(): Status | null {
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    const atualizar = () => setStatus(statusAgora());
    atualizar();
    const t = window.setInterval(atualizar, 60_000);
    return () => window.clearInterval(t);
  }, []);
  return status;
}

export default function StatusAberto({ curto = false, className = "" }: { curto?: boolean; className?: string }) {
  const status = useStatus();
  return (
    <span className={`status ${status?.aberto ? "status--aberto" : "status--fechado"} ${className}`} aria-live="polite">
      <span className="status__ponto" aria-hidden />
      {status ? (curto ? status.curto : status.texto) : " "}
    </span>
  );
}
