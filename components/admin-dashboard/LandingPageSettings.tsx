'use client'

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Upload, Globe } from 'lucide-react'
import type { SiteSettings } from '@/types/portfolio'

export default function LandingPageSettings({ initial }: { initial: SiteSettings | null }) {
  const [form, setForm] = useState({
    creator_name: initial?.creator_name ?? '',
    creator_tagline: initial?.creator_tagline ?? '',
    creator_bio: initial?.creator_bio ?? '',
    creator_picture_url: initial?.creator_picture_url ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload/creator', { method: 'POST', body: fd })
    const json = await res.json()
    setUploading(false)
    if (!res.ok) { toast.error(json.error); return }
    setForm((f) => ({ ...f, creator_picture_url: json.url }))
    toast.success('Photo uploaded')
  }

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/site-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (!res.ok) { toast.error('Failed to save'); return }
    toast.success('Landing page updated')
  }

  return (
    <section className="rounded-2xl p-6 border border-white/5" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Globe size={18} className="text-indigo-400" />
        <h2 className="text-lg font-semibold text-white">Landing page — Creator section</h2>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        This appears on the public homepage as the &quot;Created by&quot; section.
      </p>

      <div className="space-y-5">
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Your photo</label>
          <div className="flex items-center gap-4">
            {form.creator_picture_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.creator_picture_url} alt="Creator" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/30" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                <Upload size={20} />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Upload photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Your name</label>
          <input value={form.creator_name} onChange={(e) => setForm((f) => ({ ...f, creator_name: e.target.value }))}
            placeholder="e.g. Lalith Dabilpuram"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tagline</label>
          <input value={form.creator_tagline} onChange={(e) => setForm((f) => ({ ...f, creator_tagline: e.target.value }))}
            placeholder="e.g. Full-Stack Developer & Designer"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Bio / description</label>
          <textarea rows={4} value={form.creator_bio} onChange={(e) => setForm((f) => ({ ...f, creator_bio: e.target.value }))}
            placeholder="A short paragraph about yourself shown on the landing page…"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm resize-none" />
        </div>

        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </section>
  )
}
