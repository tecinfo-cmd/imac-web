import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://imac-app-hom-3lq2b.ondigitalocean.app/mac/api/v1/elegibilidades/consulta-car?:path*",
      },
    ];
  },
  images: {
    domains: ["imac-image.nyc3.digitaloceanspaces.com"],
  },
};

export default nextConfig;
