import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "600", "700"],
});

const TITLE = "PlenaPet — Petshop online en Colombia | Todo para una vida plena";
const DESCRIPTION =
  "Petshop digital donde las familias encuentran todo lo que necesitan para cuidar bien a sus perros y gatos: alimentos, farmacia veterinaria, desparasitantes, suplementos, higiene y accesorios, con entrega a domicilio en Colombia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s" },
  description: DESCRIPTION,
  openGraph: {
    siteName: "PlenaPet",
    title: TITLE,
    description: DESCRIPTION,
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
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
