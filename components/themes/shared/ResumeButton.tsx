'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'

export default function ResumeButton({
  username,
  className,
  style,
  label = 'Download Resume',
}: {
  username: string
  className?: string
  style?: React.CSSProperties
  label?: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(`/api/resume/${username}`)
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Resume unavailable')
      window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not load resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDownload} disabled={loading} className={className} style={style}>
      <Download size={16} />
      {loading ? 'Loading...' : label}
    </button>
  )
}
