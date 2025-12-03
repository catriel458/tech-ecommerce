import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      // Agregá otros dominios que uses para imágenes
      {
        protocol: "https",
        hostname: "**", // Esto permite cualquier dominio (menos seguro pero más flexible)
      },
    ],
  },
};

export default nextConfig;