'use client'

import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FileText, Upload, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/portfolio'
import Toggle from './Toggle'

export default function ResumeUpload({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [filename, setFilename] = useState<string | null>(profile.resume_filename)
  const [hasResume, setHasResume] = useState(!!profile.resume_url)
  const [showResume, setShowResume] = useState(profile.show_resume)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be under 5 MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload/resume', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setFilename(file.name)
      setHasResume(true)
      toast.success('Resume uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete() {
    const { error } = await supabase
      .from('profiles')
      .update({ resume_url: null, resume_filename: null })
      .eq('id', profile.id)
    if (error) return toast.error(error.message)
    setFilename(null)
    setHasResume(false)
    toast.success('Resume removed')
  }

  async function toggleVisibility(v: boolean) {
    setShowResume(v)
    const { error } = await supabase
      .from('profiles')
      .update({ show_resume: v })
      .eq('id', profile.id)
    if (error) {
      setShowResume(!v)
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <section
        className="rounded-2xl p-6 border border-white/5"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        {hasResume ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center">
              <FileText className="text-red-400" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{filename || 'resume.pdf'}</div>
              <div className="text-xs text-slate-500">PDF document</div>
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 disabled:opacity-60"
            >
              Replace
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full py-10 rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 transition-colors flex flex-col items-center gap-3 text-slate-400 hover:text-white"
          >
            <Upload size={32} />
            <span className="font-medium">
              {uploading ? 'Uploading...' : 'Click to upload your resume'}
            </span>
            <span className="text-xs text-slate-500">PDF only, max 5 MB</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="hidden"
        />
      </section>

      <section
        className="rounded-2xl p-6 border border-white/5 flex items-center justify-between"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        <div>
          <div className="font-medium text-white">Show resume download</div>
          <div className="text-sm text-slate-500 mt-1">
            If off, visitors cannot download your resume from your portfolio.
          </div>
        </div>
        <Toggle checked={showResume} onChange={toggleVisibility} label="Show resume" />
      </section>
    </div>
  )
}
