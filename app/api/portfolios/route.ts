import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// GET all portfolios
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        creator: true,
        team: true
      }
    })
    return Response.json(portfolios || [])
  } catch (error) {
    console.error('GET Error:', error)
    return Response.json([], { status: 200 })
  }
}

// CREATE portfolio
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('=== RECEIVED BODY ===')
    console.log('body.creatorId:', body.creatorId)
    console.log('body.teamId:', body.teamId)
    
    // Build data object
    const data: any = {
      title: body.title,
      description: body.description || null,
      imageUrl: body.imageUrl || null,
      liveUrl: body.liveUrl || null,
      copyright: body.copyright || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      stack: Array.isArray(body.stack) ? body.stack : [],
      complexity: body.complexity || null,
      category: body.category || null,
      isVisible: Boolean(body.isVisible),
      isFeatured: Boolean(body.isFeatured),
      orderIndex: typeof body.orderIndex === 'number' ? body.orderIndex : 0,
      projectDate: body.projectDate ? new Date(body.projectDate) : null,
    }

    // Add foreign keys - CRITICAL: Check for non-empty string
    if (body.creatorId && body.creatorId !== '') {
      console.log('Adding creatorId:', body.creatorId)
      data.creatorId = body.creatorId
    }
    
    if (body.teamId && body.teamId !== '') {
      console.log('Adding teamId:', body.teamId)
      data.teamId = body.teamId
    }

    console.log('=== DATA TO PRISMA ===')
    console.log('data.creatorId:', data.creatorId)
    console.log('data.teamId:', data.teamId)

    const portfolio = await prisma.portfolio.create({
      data,
      include: {
        creator: true,
        team: true
      }
    })
    
    console.log('=== CREATED PORTFOLIO ===')
    console.log('portfolio.creatorId:', portfolio.creatorId)
    console.log('portfolio.teamId:', portfolio.teamId)
    console.log('portfolio.creator:', portfolio.creator)
    
    return Response.json(portfolio, { status: 201 })
    
  } catch (error: any) {
    console.error('=== POST ERROR ===')
    console.error('Error:', error)
    console.error('Message:', error.message)
    return Response.json({ 
      error: 'Failed to create portfolio',
      details: error.message 
    }, { status: 500 })
  }
}