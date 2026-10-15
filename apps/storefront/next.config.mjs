/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@plenapet/ui", "@plenapet/database", "@plenapet/email"],
  experimental: {
    // CSV de VetShipping (cientos de filas) + hasta 5 fotos de producto por
    // Server Action en la pantalla de edición de catálogo.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
