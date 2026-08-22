/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@plenapet/ui", "@plenapet/database", "@plenapet/email"],
  experimental: {
    // La primera migración de catálogo sube CSV de VetShipping (cientos de
    // filas, columnas largas como el tsvector de búsqueda) por Server Action.
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
