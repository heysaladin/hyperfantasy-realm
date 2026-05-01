import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Promise
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params  // ← await params

  try {
    const body = await request.json()
    
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content || null,
        coverImage: body.coverImage || null,
        tags: body.tags || [],
        isPublished: body.isPublished || false,
        ...(body.index !== undefined && { index: Number(body.index) }),
      }
    })
    
    return Response.json(blog)
  } catch (error: any) {
    console.error('PUT Error:', error)
    return Response.json({ 
      error: 'Failed to update blog',
      details: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Promise
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params  // ← await params

  try {
    await prisma.blog.delete({
      where: { id }
    })
    
    return Response.json({ success: true })
  } catch (error: any) {
    console.error('DELETE Error:', error)
    return Response.json({ 
      error: 'Failed to delete blog',
      details: error.message 
    }, { status: 500 })
  }
}