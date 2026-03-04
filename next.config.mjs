/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'miro.medium.com' },
      { protocol: 'https', hostname: 'cdn.dribbble.com' },
      { protocol: 'https', hostname: 'farooq-agent.web.app' },
      { protocol: 'https', hostname: 'heyheysaladin.web.app' },
      { protocol: 'https', hostname: 'heysaladindesign.web.app' },
      { protocol: 'https', hostname: 'thinksoft.id' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'pps.services.adobe.com' },
    ],
  },
}

export default nextConfig