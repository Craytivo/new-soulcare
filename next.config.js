/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fail builds on ESLint and TypeScript errors (prevents bad deploys)
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      // Service sub-page redirects
      { source: '/individual', destination: '/services/individual', permanent: true },
      { source: '/group-therapy', destination: '/services/group-therapy', permanent: true },
      // Single Session Therapy is no longer offered
      { source: '/single-session', destination: '/services', permanent: true },
      { source: '/services/single-session', destination: '/services', permanent: true },
      { source: '/affordable', destination: '/services/affordable', permanent: true },
      // Team member redirects
      { source: '/anita-owusu', destination: '/about/anita-owusu', permanent: true },
      { source: '/baraka-mwangi', destination: '/about/baraka-mwangi', permanent: true },
      { source: '/christiana-takyi', destination: '/about/christiana-takyi', permanent: true },
      { source: '/davene-miller', destination: '/about/davene', permanent: true },
      { source: '/davene', destination: '/about/davene', permanent: true },
      {
        source: '/jessica-robinson-grant',
        destination: '/about/jessica-robinson-grant',
        permanent: true,
      },
      { source: '/josh-dale', destination: '/about/josh-dale', permanent: true },
      { source: '/khadian-williams', destination: '/about/khadian-williams', permanent: true },
      { source: '/natalia', destination: '/about/natalia', permanent: true },
      { source: '/natalia-willis', destination: '/about/natalia-willis', permanent: true },
      { source: '/natalie-mcdonald', destination: '/about/natalie-mcdonald', permanent: true },
      { source: '/nigel-miller', destination: '/about/nigel-miller', permanent: true },
      { source: '/oluseye-olumide', destination: '/about/oluseye-olumide', permanent: true },
      { source: '/princeton-owusu', destination: '/about', permanent: true },
      { source: '/about/princeton-owusu', destination: '/about', permanent: true },
      { source: '/princeton', destination: '/about', permanent: true },
      { source: '/about/princeton', destination: '/about', permanent: true },
      { source: '/sneha-christian', destination: '/about/sneha-christian', permanent: true },
    ]
  },
}

module.exports = nextConfig
