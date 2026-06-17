import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const service = createServiceClient()
  const { data } = await service.from('site_settings').select('*').eq('id', 1).single()
  return NextResponse.json(data ?? {})
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { creator_name, creator_tagline, creator_bio, creator_picture_url } = body

  const service = createServiceClient()
  const { error } = await service
    .from('site_settings')
    .update({ creator_name, creator_tagline, creator_bio, creator_picture_url, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
