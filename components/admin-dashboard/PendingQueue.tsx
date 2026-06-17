'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Check, Trash2, Mail, Clock, Eye } from 'lucide-react'
import type { AdminUserView } from '@/types/portfolio'

function completeness(u: AdminUserView): number {
  const fields = [u.full_name, u.job_title, u.bio, u.location, u.avatar_url]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export default function PendingQueue({ users }: { users: AdminUserView[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  async function action(endpoint: string, user_id: string, method: 'POST' | 'DELETE' = 'POST') {
    setBusyId(user_id)
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Action failed')
      toast.success(endpoint === 'approve' ? 'User approved' : 'User removed')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setBusyId(null)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-20 rounded-2xl border border-dashed border-white/10">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <Check size={28} className="text-green-400" />
        </div>
        <p className="text-white font-medium">All caught up!</p>
        <p className="text-slate-500 text-sm mt-1">No pending users to review.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {users.map((u) => {
        const initials =
          u.full_name
            ?.split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || u.username[0].toUpperCase()
        const pct = completeness(u)
        return (
          <div
            key={u.id}
            className="rounded-2xl p-6 border border-white/5"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              {u.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">
                  {u.full_name || u.username}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
                  <Mail size={11} /> {u.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <Clock size={12} />
              Signed up {new Date(u.created_at).toLocaleDateString()}
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Profile completeness</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #22c55e)' }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => action('approve', u.id)}
                disabled={busyId === u.id}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-500 disabled:opacity-50 transition-colors"
              >
                <Check size={15} /> Approve
              </button>
              <Link
                href={`/admin/user/${u.id}`}
                className="px-3 py-2 rounded-lg text-slate-400 border border-white/10 hover:text-white hover:bg-white/5"
              >
                <Eye size={15} />
              </Link>
              <button
                onClick={() => action('delete', u.id, 'DELETE')}
                disabled={busyId === u.id}
                className="px-3 py-2 rounded-lg text-slate-400 border border-white/10 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
