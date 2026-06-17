'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Search, Check, Ban, RotateCcw, Trash2, Eye, UserPlus, Pencil } from 'lucide-react'
import type { AdminUserView, UserStatus } from '@/types/portfolio'
import AddUserModal from './AddUserModal'

const statusStyles: Record<UserStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  active: 'bg-green-500/15 text-green-400 border-green-500/30',
  suspended: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function UsersTable({
  users,
  isSuperAdmin,
}: {
  users: AdminUserView[]
  isSuperAdmin: boolean
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | UserStatus>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminUserView | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (filter !== 'all' && u.status !== filter) return false
      const q = search.toLowerCase()
      if (!q) return true
      return (
        (u.full_name ?? '').toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      )
    })
  }, [users, search, filter])

  async function action(
    endpoint: string,
    user_id: string,
    method: 'POST' | 'DELETE' = 'POST'
  ) {
    setBusyId(user_id)
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Action failed')
      toast.success('Done')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setBusyId(null)
      setDeleteTarget(null)
    }
  }

  function initials(u: AdminUserView) {
    return (
      u.full_name
        ?.split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || u.username[0].toUpperCase()
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Search by name, email, or username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | UserStatus)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all" className="bg-slate-800">All</option>
          <option value="pending" className="bg-slate-800">Pending</option>
          <option value="active" className="bg-slate-800">Active</option>
          <option value="suspended" className="bg-slate-800">Suspended</option>
        </select>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <UserPlus size={18} />
          Add user
        </button>
      </div>

      <div
        className="rounded-2xl border border-white/5 overflow-hidden"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-left">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                          {initials(u)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white flex items-center gap-1.5">
                          {u.full_name || u.username}
                          {u.role !== 'user' && (
                            <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-400 uppercase">
                              {u.role === 'super_admin' ? 'Super' : 'Admin'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-300">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs border capitalize ${statusStyles[u.status]}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {u.status === 'pending' && (
                        <button
                          onClick={() => action('approve', u.id)}
                          disabled={busyId === u.id}
                          title="Approve"
                          className="p-2 rounded-lg text-green-400 hover:bg-green-500/10 disabled:opacity-50"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {u.status === 'active' && (
                        <button
                          onClick={() => action('suspend', u.id)}
                          disabled={busyId === u.id}
                          title="Suspend"
                          className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10 disabled:opacity-50"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      {u.status === 'suspended' && (
                        <button
                          onClick={() => action('reinstate', u.id)}
                          disabled={busyId === u.id}
                          title="Reinstate"
                          className="p-2 rounded-lg text-green-400 hover:bg-green-500/10 disabled:opacity-50"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                      <Link
                        href={`/admin/user/${u.id}`}
                        title="View details"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/user/${u.id}`}
                        title="Edit"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        title="Delete"
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddUserModal isSuperAdmin={isSuperAdmin} onClose={() => setShowAdd(false)} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            className="rounded-2xl p-6 max-w-sm w-full border border-white/10"
            style={{ background: '#0f172a' }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete {deleteTarget.full_name || deleteTarget.username}?
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              This permanently deletes the user, their portfolio, and all files. This cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-slate-300 border border-white/10 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => action('delete', deleteTarget.id, 'DELETE')}
                disabled={busyId === deleteTarget.id}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium disabled:opacity-50"
              >
                {busyId === deleteTarget.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
