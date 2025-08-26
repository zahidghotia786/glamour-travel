/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow ALL https domains
      },
    ],
  },
    eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
