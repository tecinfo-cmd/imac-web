import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://imac-dev-f8b98.ondigitalocean.app/imac/api/v1/elegibilidades/consulta-car?:path*",
      },
    ];
  },
  images: {
    domains: ["imac-image.nyc3.digitaloceanspaces.com"],
  },
};

export default nextConfig;
