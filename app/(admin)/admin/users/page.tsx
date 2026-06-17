import { createClient } from '@/lib/supabase/server'
import { getAllUsers } from '@/lib/admin-data'
import StatsCards from '@/components/admin-dashboard/StatsCards'
import UsersTable from '@/components/admin-dashboard/UsersTable'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user!.id)
    .single()

  const users = await getAllUsers()
  const stats = {
    total: users.length,
    pending: users.filter((u) => u.status === 'pending').length,
    active: users.filter((u) => u.status === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">All Users</h1>
        <p className="text-slate-400 text-sm mt-1">Manage every account on the platform.</p>
      </div>
      <div className="mb-8">
        <StatsCards {...stats} />
      </div>
      <UsersTable users={users} isSuperAdmin={roleData?.role === 'super_admin'} />
    </div>
  )
}
