import { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  images: {
    // Configura o Next.js para otimizar imagens dentro da pasta 'public'
    domains: [], // Adicione domínios externos aqui, se necessário
  },
};

export default nextConfig;
