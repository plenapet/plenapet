import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  // Botón primario: fondo azul confianza, texto blanco (regla de marca)
  primary:
    "bg-azul-confianza text-white hover:bg-[#0f2333] focus-visible:ring-2 focus-visible:ring-azul-confianza focus-visible:ring-offset-2",
  // Botón secundario: fondo coral, texto azul confianza (regla de marca)
  secondary:
    "bg-coral-cercania text-azul-confianza hover:brightness-95 focus-visible:ring-2 focus-visible:ring-coral-cercania focus-visible:ring-offset-2",
  ghost:
    "bg-transparent text-azul-confianza border border-azul-confianza/20 hover:bg-azul-confianza/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-5 py-2.5",
  lg: "text-base px-6 py-3.5",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
