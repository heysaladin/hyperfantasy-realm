import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const TAGS_FILE = path.join(process.cwd(), 'data', 'tags.json')

function readTags(): { id: string; name: string }[] {
  try {
    return JSON.parse(fs.readFileSync(TAGS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeTags(tags: { id: string; name: string }[]) {
  fs.writeFileSync(TAGS_FILE, JSON.stringify(tags, null, 2))
}

export async function GET() {
  return NextResponse.json(readTags())
}

export async function POST(req: Request) {
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const tags = readTags()
  const newTag = { id: crypto.randomUUID(), name: name.trim() }
  tags.push(newTag)
  writeTags(tags)
  return NextResponse.json(newTag)
}

export async function PUT(req: Request) {
  const { id, name } = await req.json()
  if (!id || !name?.trim()) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const tags = readTags()
  const idx = tags.findIndex(t => t.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  tags[idx].name = name.trim()
  writeTags(tags)
  return NextResponse.json(tags[idx])
}

export async function PATCH(req: Request) {
  const { tags } = await req.json()
  if (!Array.isArray(tags)) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  writeTags(tags)
  return NextResponse.json(tags)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const tags = readTags().filter(t => t.id !== id)
  writeTags(tags)
  return NextResponse.json({ ok: true })
}
