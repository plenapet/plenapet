/**
 * PLACEHOLDER DE MARCA — pendiente de reemplazo.
 *
 * El manual de marca prohíbe reconstruir el logotipo con tipografía o
 * recrear la huella/corazón libremente (ver "Logo — reglas duras" en
 * Marca/Resumen-marca.md). Este componente es un sustituto temporal para
 * poder navegar el sitio en desarrollo mientras se obtienen los archivos
 * vectoriales maestros (SVG/AI/EPS) — ver Pendientes/Preguntas-abiertas.md.
 * Debe reemplazarse por el archivo oficial antes de cualquier entrega real.
 */
import { brandColors } from "../tokens";

type LogoProps = {
  variant?: "color" | "inverted" | "mono";
  withTagline?: boolean;
  className?: string;
};

export function Logo({
  variant = "color",
  withTagline = false,
  className,
}: LogoProps) {
  const isInverted = variant === "inverted";
  const isMono = variant === "mono";

  const markColor = isInverted
    ? "#FFFFFF"
    : isMono
      ? brandColors.azulConfianza
      : brandColors.azulConfianza;
  const accentColor = isInverted
    ? "#FFFFFF"
    : isMono
      ? brandColors.azulConfianza
      : brandColors.coralCercania;

  return (
    <div className={className} aria-label="PlenaPet">
      <div className="flex items-center gap-2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="15" stroke={markColor} strokeWidth="3" />
          <path
            d="M16 22c-3.2-2.3-5.4-4.2-5.4-6.7 0-1.7 1.3-3 3-3 1 0 1.9.5 2.4 1.3.5-.8 1.4-1.3 2.4-1.3 1.7 0 3 1.3 3 3 0 2.5-2.2 4.4-5.4 6.7z"
            fill={accentColor}
          />
        </svg>
        <span className="font-sans font-bold text-xl leading-none">
          <span style={{ color: markColor }}>plena</span>
          <span style={{ color: accentColor }}>pet</span>
        </span>
      </div>
      {withTagline && (
        <p
          className="mt-0.5 text-xs font-normal"
          style={{ color: isInverted ? "#FFFFFF" : brandColors.grisPizarra }}
        >
          Todo para una vida plena.
        </p>
      )}
    </div>
  );
}
