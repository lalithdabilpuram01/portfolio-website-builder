'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Globe } from 'lucide-react'
import { Github, Linkedin, Twitter } from '@/components/icons/Brand'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/portfolio'
import AvatarUpload from './AvatarUpload'
import Toggle from './Toggle'

const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors'

const socialLinks = [
  { field: 'github_url', show: 'show_github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  { field: 'linkedin_url', show: 'show_linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { field: 'website_url', show: 'show_website', label: 'Website', icon: Globe, placeholder: 'https://yoursite.com' },
  { field: 'twitter_url', show: 'show_twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://x.com/username' },
] as const

export default function ProfileEditor({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const [form, setForm] = useState<Profile>(profile)
  const [saving, setSaving] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [checkingUsername, setCheckingUsername] = useState(false)

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function checkUsername() {
    const clean = form.username.trim().toLowerCase()
    if (!clean) {
      setUsernameError('Username is required')
      return
    }
    if (!/^[a-z0-9_-]+$/.test(clean)) {
      setUsernameError('Only lowercase letters, numbers, - and _')
      return
    }
    if (clean === profile.username) {
      setUsernameError('')
      return
    }
    setCheckingUsername(true)
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', clean)
      .neq('id', profile.id)
      .maybeSingle()
    setCheckingUsername(false)
    setUsernameError(data ? 'Username is already taken' : '')
  }

  async function handleSave() {
    if (usernameError) {
      toast.error('Please fix the username before saving')
      return
    }
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        username: form.username.trim().toLowerCase(),
        job_title: form.job_title,
        bio: form.bio,
        location: form.location,
        github_url: form.github_url,
        linkedin_url: form.linkedin_url,
        website_url: form.website_url,
        twitter_url: form.twitter_url,
        avatar_url: form.avatar_url,
        show_github: form.show_github,
        show_linkedin: form.show_linkedin,
        show_website: form.show_website,
        show_twitter: form.show_twitter,
        show_email: form.show_email,
        show_location: form.show_location,
      })
      .eq('id', profile.id)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Profile saved')
  }

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <section
        className="rounded-2xl p-6 border border-white/5"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Profile photo</h2>
        <AvatarUpload
          currentUrl={form.avatar_url}
          fullName={form.full_name}
          onUploaded={(url) => update('avatar_url', url)}
        />
      </section>

      {/* Basic info */}
      <section
        className="rounded-2xl p-6 border border-white/5 space-y-4"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        <h2 className="text-lg font-semibold text-white mb-2">Basic information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full name</label>
            <input
              className={inputClass}
              value={form.full_name ?? ''}
              onChange={(e) => update('full_name', e.target.value)}
              placeholder="Jane Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              className={`${inputClass} ${usernameError ? 'border-red-500' : ''}`}
              value={form.username}
              onChange={(e) => {
                update('username', e.target.value)
                setUsernameError('')
              }}
              onBlur={checkUsername}
              placeholder="janedev"
            />
            {checkingUsername && <p className="text-xs text-slate-500 mt-1">Checking...</p>}
            {usernameError && <p className="text-xs text-red-400 mt-1">{usernameError}</p>}
            {!usernameError && !checkingUsername && (
              <p className="text-xs text-slate-500 mt-1">
                Portfolio URL: /{form.username || 'username'}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Job title</label>
          <input
            className={inputClass}
            value={form.job_title ?? ''}
            onChange={(e) => update('job_title', e.target.value)}
            placeholder="Full-Stack Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={4}
            value={form.bio ?? ''}
            onChange={(e) => update('bio', e.target.value)}
            placeholder="Tell visitors about yourself..."
          />
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-slate-300 mb-2">
            <span>Location</span>
            <span className="flex items-center gap-2 text-xs text-slate-500">
              Show on portfolio
              <Toggle
                checked={form.show_location}
                onChange={(v) => update('show_location', v)}
                label="Show location"
              />
            </span>
          </label>
          <input
            className={inputClass}
            value={form.location ?? ''}
            onChange={(e) => update('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-sm font-medium text-slate-300">Show email address</div>
            <div className="text-xs text-slate-500">Display your account email on your portfolio</div>
          </div>
          <Toggle
            checked={form.show_email}
            onChange={(v) => update('show_email', v)}
            label="Show email"
          />
        </div>
      </section>

      {/* Social links */}
      <section
        className="rounded-2xl p-6 border border-white/5 space-y-4"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        <h2 className="text-lg font-semibold text-white mb-1">Social links</h2>
        <p className="text-sm text-slate-500 mb-2">
          Add your links and toggle which ones appear on your portfolio.
        </p>
        {socialLinks.map(({ field, show, label, icon: Icon, placeholder }) => (
          <div key={field}>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Icon size={16} />
              {label}
            </label>
            <div className="flex items-center gap-3">
              <input
                className={inputClass}
                value={(form[field] as string) ?? ''}
                onChange={(e) => update(field, e.target.value)}
                placeholder={placeholder}
              />
              <Toggle
                checked={form[show] as boolean}
                onChange={(v) => update(show, v)}
                label={`Show ${label}`}
              />
            </div>
          </div>
        ))}
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {saving ? 'Saving...' : 'Save all changes'}
        </button>
      </div>
    </div>
  )
}
