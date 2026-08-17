import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "PlenaPet — Todo para una vida plena",
  description:
    "El petshop digital donde las familias encuentran todo lo que necesitan para cuidar bien a sus perros y gatos: alimentos, farmacia veterinaria, suplementos, higiene y accesorios, con entrega a domicilio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
