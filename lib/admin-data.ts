import { createServiceClient } from '@/lib/supabase/server'
import type { AdminUserView, Profile, UserRole } from '@/types/portfolio'

/**
 * Fetches all users with their profile data, email, last sign-in, and role.
 * Service-role only — call from admin server components / routes.
 */
export async function getAllUsers(): Promise<AdminUserView[]> {
  const service = createServiceClient()

  const [{ data: profiles }, { data: roles }, authList] = await Promise.all([
    service.from('profiles').select('*').order('created_at', { ascending: false }),
    service.from('user_roles').select('user_id, role'),
    service.auth.admin.listUsers({ perPage: 1000 }),
  ])

  const roleMap = new Map<string, UserRole>()
  for (const r of roles ?? []) roleMap.set(r.user_id, r.role as UserRole)

  const authMap = new Map<string, { email: string; last_sign_in_at: string | null }>()
  for (const u of authList.data?.users ?? []) {
    authMap.set(u.id, {
      email: u.email ?? '',
      last_sign_in_at: u.last_sign_in_at ?? null,
    })
  }

  return (profiles ?? []).map((p: Profile) => ({
    ...p,
    email: authMap.get(p.id)?.email ?? '',
    last_sign_in_at: authMap.get(p.id)?.last_sign_in_at ?? null,
    role: roleMap.get(p.id) ?? 'user',
  }))
}
