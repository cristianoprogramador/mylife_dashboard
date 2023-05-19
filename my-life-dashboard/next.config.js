/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
