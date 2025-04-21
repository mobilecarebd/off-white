/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['server.offwhite.com.bd', 'offwhite.com.bd'],
    unoptimized: true
  },
  experimental: {
    optimizeCss: false
  },
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false
}

module.exports = nextConfig