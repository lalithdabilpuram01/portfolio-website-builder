'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Check,
  Ban,
  RotateCcw,
  Trash2,
  KeyRound,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { Github, Linkedin, Twitter } from '@/components/icons/Brand'
import type { AdminUserView, AuditLogEntry } from '@/types/portfolio'

const actionLabels: Record<string, string> = {
  approved: 'Approved account',
  suspended: 'Suspended account',
  reinstated: 'Reinstated account',
  deleted: 'Deleted account',
  created: 'Created account',
  updated: 'Updated account',
}

export default function UserDetail({
  user,
  audit,
  isSuperAdmin,
}: {
  user: AdminUserView
  audit: AuditLogEntry[]
  isSuperAdmin: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [role, setRole] = useState(user.role)

  async function action(endpoint: string, method: 'POST' | 'DELETE' = 'POST') {
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success('Done')
      if (endpoint === 'delete') {
        router.push('/admin/users')
      } else {
        router.refresh()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(false)
    }
  }

  async function patch(body: Record<string, unknown>) {
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/user/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success('Done')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally {
      setBusy(false)
    }
  }

  const initials =
    user.full_name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || user.username[0].toUpperCase()

  const socials = [
    { url: user.github_url, show: user.show_github, icon: Github, label: 'GitHub' },
    { url: user.linkedin_url, show: user.show_linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: user.website_url, show: user.show_website, icon: Globe, label: 'Website' },
    { url: user.twitter_url, show: user.show_twitter, icon: Twitter, label: 'Twitter' },
  ]

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft size={16} /> Back to users
      </Link>

      {/* Header card */}
      <div
        className="rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row sm:items-center gap-5"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt="" className="w-20 h-20 rounded-2xl object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
            {initials}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{user.full_name || user.username}</h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs border capitalize ${
                user.status === 'active'
                  ? 'bg-green-500/15 text-green-400 border-green-500/30'
                  : user.status === 'pending'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-red-500/15 text-red-400 border-red-500/30'
              }`}
            >
              {user.status}
            </span>
          </div>
          {user.job_title && <p className="text-indigo-400 mt-0.5">{user.job_title}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Mail size={13} /> {user.email}
            </span>
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
            >
              <ExternalLink size={13} /> /{user.username}
            </a>
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {user.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-6">
          {user.bio && (
            <section
              className="rounded-2xl p-6 border border-white/5"
              style={{ background: 'rgba(15,23,42,0.5)' }}
            >
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Bio
              </h2>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{user.bio}</p>
            </section>
          )}

          <section
            className="rounded-2xl p-6 border border-white/5"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
              Social links & visibility
            </h2>
            <div className="space-y-3">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="flex items-center gap-3 text-sm">
                    <Icon size={16} className="text-slate-500" />
                    <span className="text-slate-300 w-20">{s.label}</span>
                    <span className="flex-1 text-slate-400 truncate">{s.url || '—'}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        s.show ? 'bg-green-500/15 text-green-400' : 'bg-slate-700/50 text-slate-500'
                      }`}
                    >
                      {s.show ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Files */}
          <section
            className="rounded-2xl p-6 border border-white/5"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
              Files
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Resume</span>
                <span className="text-slate-300">{user.resume_filename || 'None uploaded'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avatar</span>
                <span className="text-slate-300">{user.avatar_url ? 'Uploaded' : 'None'}</span>
              </div>
            </div>
          </section>

          {/* Audit log */}
          <section
            className="rounded-2xl p-6 border border-white/5"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
              Audit log
            </h2>
            {audit.length === 0 ? (
              <p className="text-slate-500 text-sm">No admin actions recorded.</p>
            ) : (
              <div className="space-y-3">
                {audit.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock size={13} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-200">
                        {actionLabels[a.action] || a.action}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(a.created_at).toLocaleString()}
                        {a.metadata?.reason ? ` · ${String(a.metadata.reason)}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: account + actions */}
        <div className="space-y-6">
          <section
            className="rounded-2xl p-6 border border-white/5"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
              Account
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Joined</span>
                <span className="text-slate-300">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last login</span>
                <span className="text-slate-300">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role</span>
                <span className="text-slate-300 capitalize">{user.role.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Theme</span>
                <span className="text-slate-300 capitalize">{user.selected_theme}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-4">
              Passwords are never displayed — Supabase does not expose them.
            </p>
          </section>

          <section
            className="rounded-2xl p-6 border border-white/5 space-y-3"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Actions
            </h2>

            {user.status === 'pending' && (
              <button
                onClick={() => action('approve')}
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-500 disabled:opacity-50"
              >
                <Check size={16} /> Approve
              </button>
            )}
            {user.status === 'active' && (
              <button
                onClick={() => action('suspend')}
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 disabled:opacity-50"
              >
                <Ban size={16} /> Suspend
              </button>
            )}
            {user.status === 'suspended' && (
              <button
                onClick={() => action('reinstate')}
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-500 disabled:opacity-50"
              >
                <RotateCcw size={16} /> Reinstate
              </button>
            )}

            <button
              onClick={() => patch({ action: 'reset_password' })}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 disabled:opacity-50"
            >
              <KeyRound size={16} /> Send password reset
            </button>

            {isSuperAdmin && user.role !== 'super_admin' && (
              <div>
                <label className="text-xs text-slate-500 block mb-1.5">Change role</label>
                <select
                  value={role}
                  onChange={(e) => {
                    const r = e.target.value as 'user' | 'admin'
                    setRole(r)
                    patch({ action: 'set_role', role: r })
                  }}
                  disabled={busy}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                >
                  <option value="user" className="bg-slate-800">User</option>
                  <option value="admin" className="bg-slate-800">Admin</option>
                </select>
              </div>
            )}

            <button
              onClick={() => action('delete', 'DELETE')}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50"
            >
              <Trash2 size={16} /> Delete user
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
