'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/portfolio'
import Toggle from './Toggle'

type VisKey =
  | 'show_github'
  | 'show_linkedin'
  | 'show_website'
  | 'show_twitter'
  | 'show_resume'
  | 'show_email'
  | 'show_location'

const items: { key: VisKey; label: string; desc: string }[] = [
  { key: 'show_github', label: 'GitHub link', desc: 'Show your GitHub profile button' },
  { key: 'show_linkedin', label: 'LinkedIn link', desc: 'Show your LinkedIn profile button' },
  { key: 'show_website', label: 'Website link', desc: 'Show your personal website button' },
  { key: 'show_twitter', label: 'Twitter / X link', desc: 'Show your Twitter profile button' },
  { key: 'show_resume', label: 'Resume download', desc: 'Allow visitors to download your resume' },
  { key: 'show_email', label: 'Email address', desc: 'Display your email on your portfolio' },
  { key: 'show_location', label: 'Location', desc: 'Show where you are based' },
]

export default function VisibilityToggles({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const [state, setState] = useState<Record<VisKey, boolean>>({
    show_github: profile.show_github,
    show_linkedin: profile.show_linkedin,
    show_website: profile.show_website,
    show_twitter: profile.show_twitter,
    show_resume: profile.show_resume,
    show_email: profile.show_email,
    show_location: profile.show_location,
  })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.from('profiles').update(state).eq('id', profile.id)
    setSaving(false)
    if (error) return toast.error(error.message)
    toast.success('Visibility settings saved')
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/5 divide-y divide-white/5">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-5">
            <div>
              <div className="font-medium text-white">{item.label}</div>
              <div className="text-sm text-slate-500 mt-0.5">{item.desc}</div>
            </div>
            <Toggle
              checked={state[item.key]}
              onChange={(v) => setState((s) => ({ ...s, [item.key]: v }))}
              label={item.label}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {saving ? 'Saving...' : 'Save all'}
        </button>
      </div>
    </div>
  )
}
