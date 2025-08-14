/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@creit.tech/stellar-wallets-kit"],
  },
  images: {
    domains: ["s3-alpha-sig.figma.com", "fontawesome.com", "cdn.jsdelivr.net"],
  },
};

export default nextConfig;
