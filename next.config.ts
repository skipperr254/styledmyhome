import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ovfhuntfakvqisiqxmcs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "ovfhuntfakvqisiqxmcs.supabase.co",
        pathname: "/storage/v1/render/image/public/**",
      },
    ],
  },
};

export default nextConfig;
