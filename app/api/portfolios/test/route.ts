import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // First try to get from database
    const { prisma } = await import('@/lib/prisma')
    
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        creator: true,
        team: true
      }
    })
    
    if (portfolios && portfolios.length > 0) {
      return NextResponse.json(portfolios)
    }
  } catch (dbError) {
    console.error('[Portfolios] Database error:', dbError)
  }

  // Fallback to test data if database fails
  const testData = [
    {
      id: '1',
      title: 'E-Commerce Platform Redesign',
      description: 'Complete UX/UI overhaul and frontend development',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600',
      liveUrl: 'https://example-shop.com',
      copyright: 'https://github.com/example/ecommerce',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      stack: ['React 18', 'Next.js', 'TypeScript', 'Prisma', 'Supabase'],
      isVisible: true,
      isFeatured: true,
      orderIndex: 1,
      category: 'Web Design & Development',
      complexity: 'full',
      projectDate: null,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
      creatorId: null,
      teamId: null,
      creator: null,
      team: null
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Native iOS and Android app with React Native',
      imageUrl: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=800&h=600',
      liveUrl: 'https://apps.apple.com/example',
      copyright: 'https://github.com/example/mobile-app',
      tags: ['React Native', 'Firebase', 'UI/UX'],
      stack: ['React Native', 'Expo', 'Firebase', 'Redux'],
      isVisible: true,
      isFeatured: true,
      orderIndex: 2,
      category: 'Mobile Development',
      complexity: 'full',
      projectDate: null,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
      creatorId: null,
      teamId: null,
      creator: null,
      team: null
    },
    {
      id: '3',
      title: 'Brand Identity System',
      description: 'Complete visual identity and design system',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600',
      liveUrl: null,
      copyright: null,
      tags: ['Branding', 'Design System', 'Typography', 'Color Theory'],
      stack: ['Figma', 'Adobe Creative Suite'],
      isVisible: true,
      isFeatured: false,
      orderIndex: 3,
      category: 'Branding',
      complexity: 'short',
      projectDate: null,
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2025-02-01'),
      creatorId: null,
      teamId: null,
      creator: null,
      team: null
    }
  ]

  return NextResponse.json(testData)
}
