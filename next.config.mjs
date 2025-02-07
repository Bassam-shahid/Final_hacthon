/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // ✅ Sanity images allow ho gayi
      },
    ],
  },
};

export default nextConfig;
