/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/heysaladin',
        destination: '/about/team/heysaladin',
        permanent: true,
      },
      {
        source: '/hikari',
        destination: '/about/team/hikari',
        permanent: true,
      },
      {
        source: '/mitayani',
        destination: '/about/team/mitayani',
        permanent: true,
      },
      {
        source: '/dravenclaw',
        destination: '/about/team/dravenclaw',
        permanent: true,
      },
      {
        source: '/thinksoft',
        destination: '/about/team/thinksoft',
        permanent: true,
      },
    ]
  },
}

export default nextConfig