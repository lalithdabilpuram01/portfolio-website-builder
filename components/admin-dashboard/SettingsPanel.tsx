'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Download, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Theme } from '@/types/portfolio'
import Toggle from '@/components/user-dashboard/Toggle'

export default function SettingsPanel({ initialThemes }: { initialThemes: Theme[] }) {
  const supabase = createClient()
  const [themes, setThemes] = useState<Theme[]>(initialThemes)

  async function toggleTheme(slug: string, value: boolean) {
    const prev = themes
    setThemes((ts) => ts.map((t) => (t.slug === slug ? { ...t, is_active: value } : t)))
    const { error } = await supabase.from('themes').update({ is_active: value }).eq('slug', slug)
    if (error) {
      setThemes(prev)
      toast.error(error.message)
    } else {
      toast.success(`${slug} ${value ? 'enabled' : 'disabled'}`)
    }
  }

  function exportCsv() {
    window.location.href = '/api/admin/export'
  }

  return (
    <div className="space-y-6">
      {/* Theme management */}
      <section
        className="rounded-2xl p-6 border border-white/5"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Palette size={18} className="text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Theme management</h2>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          Control which themes users can select for their portfolios.
        </p>
        <div className="divide-y divide-white/5">
          {themes.map((theme) => (
            <div key={theme.id} className="flex items-center justify-between py-4">
              <div>
                <div className="font-medium text-white">{theme.name}</div>
                <div className="text-sm text-slate-500">{theme.description}</div>
              </div>
              <Toggle
                checked={theme.is_active}
                onChange={(v) => toggleTheme(theme.slug, v)}
                label={`Toggle ${theme.name}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section
        className="rounded-2xl p-6 border border-red-500/20"
        style={{ background: 'rgba(239,68,68,0.04)' }}
      >
        <h2 className="text-lg font-semibold text-white mb-1">Data export</h2>
        <p className="text-sm text-slate-500 mb-5">
          Download a CSV of all user accounts and their metadata.
        </p>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Download size={18} />
          Export all users (CSV)
        </button>
      </section>
    </div>
  )
}
