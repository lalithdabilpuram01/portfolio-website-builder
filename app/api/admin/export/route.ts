import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getAllUsers } from '@/lib/admin-data'

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = await getAllUsers()
  const headers = [
    'username',
    'full_name',
    'email',
    'status',
    'role',
    'job_title',
    'location',
    'selected_theme',
    'created_at',
    'last_sign_in_at',
  ]

  const rows = users.map((u) =>
    headers.map((h) => csvEscape((u as unknown as Record<string, unknown>)[h])).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="users-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
