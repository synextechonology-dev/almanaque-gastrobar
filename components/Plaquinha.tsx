"use client";

import { useStatus } from "./StatusAberto";

/** Plaquinha pendurada na porta: vira de "Aberto" para "Fechado" conforme o horário de Brasília. */
export default function Plaquinha() {
  const status = useStatus();
  if (!status) return null;
  return (
    <div className={`plaquinha ${status.aberto ? "plaquinha--aberto" : ""}`} aria-hidden>
      <span className="plaquinha__fio" />
      <span className="plaquinha__placa">
        <strong>{status.aberto ? "Aberto" : "Fechado"}</strong>
        <small>{status.aberto ? "pode entrar" : status.curto.toLowerCase()}</small>
      </span>
    </div>
  );
}
