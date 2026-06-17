'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Check, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Theme } from '@/types/portfolio'

const themePreviews: Record<string, { gradient: string; layout: React.ReactNode }> = {
  classic: {
    gradient: 'from-indigo-500 to-blue-600',
    layout: (
      <div className="flex gap-2 h-full">
        <div className="w-1/3 bg-white/20 rounded" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2 bg-white/30 rounded w-3/4" />
          <div className="h-1.5 bg-white/20 rounded w-1/2" />
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="h-4 bg-white/15 rounded" />
            <div className="h-4 bg-white/15 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  minimal: {
    gradient: 'from-slate-600 to-slate-800',
    layout: (
      <div className="space-y-2 h-full flex flex-col justify-center items-center text-center">
        <div className="h-2.5 bg-white/40 rounded w-1/2" />
        <div className="h-1.5 bg-white/25 rounded w-2/3" />
        <div className="h-1.5 bg-white/20 rounded w-1/3" />
        <div className="flex gap-1 mt-1">
          <div className="h-1.5 w-1.5 bg-white/30 rounded-full" />
          <div className="h-1.5 w-1.5 bg-white/30 rounded-full" />
          <div className="h-1.5 w-1.5 bg-white/30 rounded-full" />
        </div>
      </div>
    ),
  },
  bold: {
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    layout: (
      <div className="space-y-1.5 h-full">
        <div className="h-6 bg-white/30 rounded w-full" />
        <div className="grid grid-cols-3 gap-1 mt-2">
          <div className="h-5 bg-white/20 rounded" />
          <div className="h-5 bg-white/20 rounded" />
          <div className="h-5 bg-white/20 rounded" />
        </div>
      </div>
    ),
  },
}

export default function ThemePicker({
  themes,
  currentTheme,
  username,
}: {
  themes: Theme[]
  currentTheme: string
  username: string
}) {
  const supabase = createClient()
  const [selected, setSelected] = useState(currentTheme)
  const [saving, setSaving] = useState(false)

  async function selectTheme(slug: string) {
    if (slug === selected || saving) return
    const prev = selected
    setSelected(slug)
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ selected_theme: slug })
      .eq('username', username)
    setSaving(false)
    if (error) {
      setSelected(prev)
      toast.error(error.message)
      return
    }
    toast.success(`Theme set to ${slug}`)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <a
          href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink size={16} />
          Preview my portfolio
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {themes.map((theme) => {
          const preview = themePreviews[theme.slug] ?? themePreviews.classic
          const active = selected === theme.slug
          return (
            <button
              key={theme.id}
              onClick={() => selectTheme(theme.slug)}
              className={`group text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                active
                  ? 'border-indigo-500 scale-[1.02]'
                  : 'border-white/5 hover:border-white/20'
              }`}
              style={active ? { boxShadow: '0 0 30px rgba(99,102,241,0.3)' } : {}}
            >
              <div className={`h-32 p-4 bg-gradient-to-br ${preview.gradient} relative`}>
                {preview.layout}
                {active && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <Check size={14} className="text-indigo-600" />
                  </div>
                )}
              </div>
              <div className="p-4" style={{ background: 'rgba(15,23,42,0.7)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{theme.name}</h3>
                  {active && (
                    <span className="text-xs text-indigo-400 font-medium">Active</span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-1">{theme.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
