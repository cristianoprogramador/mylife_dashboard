/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    typedRoutes: true,
    serverComponentsExternalPackages: ["mysql2"],
    // runtime: "edge",
  },
};
export default config;

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
