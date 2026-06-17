import { getAllUsers } from '@/lib/admin-data'
import PendingQueue from '@/components/admin-dashboard/PendingQueue'

export const dynamic = 'force-dynamic'

export default async function AdminPendingPage() {
  const users = await getAllUsers()
  const pending = users.filter((u) => u.status === 'pending')

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Approval Queue</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review and approve new signups before they go live.
        </p>
      </div>
      <PendingQueue users={pending} />
    </div>
  )
}
