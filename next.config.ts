import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
};

// শুধু production build এ PWA apply করো
const isProd = process.env.NODE_ENV === "production";

export default isProd
  ? withPWAInit({
      dest: "public",
      register: true,
      disable: false,
      cacheOnFrontEndNav: false,
      aggressiveFrontEndNavCaching: false,
      reloadOnOnline: true,
      workboxOptions: {
        disableDevLogs: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: "NetworkOnly",
          },
        ],
      },
    })(nextConfig)
  : nextConfig;