import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const service = createServiceClient()

  const [{ data: profile }, { data: roleData }, { data: authUser }, { data: audit }] =
    await Promise.all([
      service.from('profiles').select('*').eq('id', id).single(),
      service.from('user_roles').select('role').eq('user_id', id).single(),
      service.auth.admin.getUserById(id),
      service
        .from('audit_log')
        .select('*')
        .eq('target_user_id', id)
        .order('created_at', { ascending: false }),
    ])

  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    user: {
      ...profile,
      email: authUser?.user?.email ?? null,
      last_sign_in_at: authUser?.user?.last_sign_in_at ?? null,
      role: roleData?.role ?? 'user',
    },
    audit: audit ?? [],
  })
}

// Update role (super_admin only) or send password reset
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const service = createServiceClient()

  if (body.action === 'set_role') {
    if (admin.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super_admin can change roles' }, { status: 403 })
    }
    const newRole = body.role as 'user' | 'admin'
    if (!['user', 'admin'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    const { error } = await service.from('user_roles').update({ role: newRole }).eq('user_id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await service.from('audit_log').insert({
      admin_id: admin.id,
      action: 'updated',
      target_user_id: id,
      metadata: { role: newRole },
    })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'reset_password') {
    const { data: authUser } = await service.auth.admin.getUserById(id)
    const email = authUser?.user?.email
    if (!email) return NextResponse.json({ error: 'No email on file' }, { status: 400 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
    const { error } = await service.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${appUrl}/login` },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
