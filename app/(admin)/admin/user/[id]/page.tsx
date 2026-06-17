import { notFound } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import UserDetail from '@/components/admin-dashboard/UserDetail'
import type { AdminUserView, AuditLogEntry, Profile, UserRole } from '@/types/portfolio'

export const dynamic = 'force-dynamic'

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user: me },
  } = await supabase.auth.getUser()

  const { data: myRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', me!.id)
    .single()

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

  if (!profile) notFound()

  const userView: AdminUserView = {
    ...(profile as Profile),
    email: authUser?.user?.email ?? '',
    last_sign_in_at: authUser?.user?.last_sign_in_at ?? null,
    role: (roleData?.role as UserRole) ?? 'user',
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <UserDetail
        user={userView}
        audit={(audit ?? []) as AuditLogEntry[]}
        isSuperAdmin={myRole?.role === 'super_admin'}
      />
    </div>
  )
}
