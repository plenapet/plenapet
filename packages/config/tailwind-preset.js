/**
 * Preset de Tailwind compartido — tokens tomados de
 * `vault obsiadian/PLENAPET/Marca/Resumen-marca.md`.
 * Cualquier cambio de paleta/tipografía se hace ahí primero, y se refleja aquí.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        "azul-confianza": "#17324D",
        "coral-cercania": "#F47A63",
        "aqua-bienestar": "#77C9C5",
        "crema-calido": "#FFF9F2",
        "gris-pizarra": "#52616D",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 50, 77, 0.06), 0 8px 24px rgba(23, 50, 77, 0.08)",
      },
    },
  },
};
