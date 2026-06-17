'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactForm({
  username,
  accent = '#6366f1',
  variant = 'dark',
}: {
  username: string
  accent?: string
  variant?: 'dark' | 'light'
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const isDark = variant === 'dark'
  const inputClass = isDark
    ? 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none transition-colors'
    : 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none transition-colors'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_username: username,
          from_name: name,
          from_email: email,
          message,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send')
      }
      toast.success('Message sent!')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          className={inputClass}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ caretColor: accent }}
        />
        <input
          type="email"
          className={inputClass}
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ caretColor: accent }}
        />
      </div>
      <textarea
        className={`${inputClass} resize-none`}
        rows={5}
        placeholder="Your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ caretColor: accent }}
      />
      <button
        type="submit"
        disabled={sending}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
        style={{ background: accent }}
      >
        {sending ? 'Sending...' : 'Send a Message'}
      </button>
    </form>
  )
}
