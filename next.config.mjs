/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@creit.tech/stellar-wallets-kit']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: "https://trustful-stellar-backend-production.up.railway.app/:path*"
      }
    ]
  }
};

export default nextConfig;
