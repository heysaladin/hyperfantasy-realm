import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const FILE = path.join(process.cwd(), 'data', 'settings.json')

function read(): Record<string, unknown> {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8')) } catch { return {} }
}

export async function GET() {
  return NextResponse.json(read())
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const settings = { ...read(), ...body }
  fs.writeFileSync(FILE, JSON.stringify(settings, null, 2))
  return NextResponse.json(settings)
}
