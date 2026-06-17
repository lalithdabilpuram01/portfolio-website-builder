import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'
import { sendAdminCreatedEmail } from '@/lib/resend'

function randomPassword() {
  return Math.random().toString(36).slice(-10) + 'A1!'
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, full_name, password, role } = await request.json()
  if (!email || !full_name) {
    return NextResponse.json({ error: 'email and full_name required' }, { status: 400 })
  }

  // Only super_admin can grant admin role
  const makeAdmin = role === 'admin' && admin.role === 'super_admin'

  const service = createServiceClient()
  const finalPassword = password || randomPassword()

  const { data: created, error } = await service.auth.admin.createUser({
    email,
    password: finalPassword,
    email_confirm: true,
    user_metadata: { full_name },
  })

  if (error || !created.user) {
    return NextResponse.json({ error: error?.message || 'Failed to create user' }, { status: 500 })
  }

  const newId = created.user.id

  // The handle_new_user trigger creates profile + role. Activate immediately and
  // optionally elevate the role.
  await service
    .from('profiles')
    .update({ status: 'active', approved_at: new Date().toISOString(), approved_by: admin.id })
    .eq('id', newId)

  if (makeAdmin) {
    await service.from('user_roles').update({ role: 'admin' }).eq('user_id', newId)
  }

  await service.from('audit_log').insert({
    admin_id: admin.id,
    action: 'created',
    target_user_id: newId,
    metadata: { email, role: makeAdmin ? 'admin' : 'user' },
  })

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
    await sendAdminCreatedEmail(email, finalPassword, appUrl)
  } catch {}

  return NextResponse.json({ ok: true, user_id: newId })
}
