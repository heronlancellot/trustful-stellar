/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@creit.tech/stellar-wallets-kit']
  }
};

export default nextConfig;
