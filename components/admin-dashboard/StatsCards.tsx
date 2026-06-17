import { Users, Clock, CheckCircle, Ban } from 'lucide-react'

export default function StatsCards({
  total,
  pending,
  active,
  suspended,
}: {
  total: number
  pending: number
  active: number
  suspended: number
}) {
  const cards = [
    { label: 'Total Users', value: total, icon: Users, color: '#6366f1' },
    { label: 'Pending', value: pending, icon: Clock, color: '#f59e0b' },
    { label: 'Active', value: active, icon: CheckCircle, color: '#22c55e' },
    { label: 'Suspended', value: suspended, icon: Ban, color: '#ef4444' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div
            key={c.label}
            className="rounded-2xl p-5 border border-white/5"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">{c.value}</div>
                <div className="text-sm text-slate-400 mt-1">{c.label}</div>
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${c.color}20` }}
              >
                <Icon size={22} style={{ color: c.color }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
