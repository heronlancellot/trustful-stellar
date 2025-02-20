/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@creit.tech/stellar-wallets-kit']
  },
};

export default nextConfig;
