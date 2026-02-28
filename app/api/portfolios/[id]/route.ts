import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    console.log('Updating portfolio:', id, body)
    
    const data: any = {
      title: body.title,
      description: body.description || null,
      imageUrl: body.imageUrl || null,
      liveUrl: body.liveUrl || null,
      githubUrl: body.githubUrl || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      stack: Array.isArray(body.stack) ? body.stack : [],
      complexity: body.complexity || null,
      category: body.category || null,
      isVisible: Boolean(body.isVisible),
      isFeatured: Boolean(body.isFeatured),
      orderIndex: typeof body.orderIndex === 'number' ? body.orderIndex : 0,
      projectDate: body.projectDate ? new Date(body.projectDate) : null,
    }

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data
    })
    
    console.log('Portfolio updated successfully')
    return Response.json(portfolio)
  } catch (error: any) {
    console.error('PUT Error:', error)
    return Response.json({ 
      error: 'Failed to update portfolio',
      details: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    console.log('Deleting portfolio:', id)
    
    await prisma.portfolio.delete({
      where: { id }
    })
    
    console.log('Portfolio deleted successfully')
    return Response.json({ success: true })
  } catch (error: any) {
    console.error('DELETE Error:', error)
    return Response.json({ 
      error: 'Failed to delete portfolio',
      details: error.message 
    }, { status: 500 })
  }
}