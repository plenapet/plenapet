import type { ReactNode } from "react";

type BadgeTone = "neutral" | "aqua" | "coral" | "warning";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-azul-confianza/5 text-azul-confianza",
  aqua: "bg-aqua-bienestar/25 text-azul-confianza",
  coral: "bg-coral-cercania/15 text-[#B5482F]",
  warning: "bg-[#FFF1E0] text-[#8A4B00]",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
