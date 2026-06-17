'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Education } from '@/types/portfolio'

interface Props {
  userId: string
  initial: Education[]
}

export default function EducationEditor({ userId, initial }: Props) {
  const supabase = createClient()
  const [items, setItems] = useState<Education[]>(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  async function add() {
    const { data, error } = await supabase
      .from('education')
      .insert({ user_id: userId, institution: '', degree: '', field: null, start_date: null, end_date: null, gpa: null, description: null, display_order: items.length })
      .select()
      .single()
    if (error) { toast.error(error.message); return }
    setItems((prev) => [...prev, data])
    setExpanded(data.id)
  }

  async function save(item: Education) {
    setSaving(item.id)
    const { error } = await supabase
      .from('education')
      .update({ institution: item.institution, degree: item.degree, field: item.field, start_date: item.start_date, end_date: item.end_date, gpa: item.gpa, description: item.description })
      .eq('id', item.id)
    setSaving(null)
    if (error) toast.error(error.message)
    else toast.success('Saved')
  }

  async function remove(id: string) {
    const { error } = await supabase.from('education').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function update(id: string, field: string, value: unknown) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <button
            type="button"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div>
              <div className="font-medium text-white">{item.degree || 'New education'}</div>
              <div className="text-sm text-slate-400">{item.institution}</div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={(e) => { e.stopPropagation(); remove(item.id) }} className="text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
              {expanded === item.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>
          </button>

          {expanded === item.id && (
            <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Degree *</label>
                  <input value={item.degree} onChange={(e) => update(item.id, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Institution *</label>
                  <input value={item.institution} onChange={(e) => update(item.id, 'institution', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Field of study</label>
                  <input value={item.field ?? ''} onChange={(e) => update(item.id, 'field', e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">GPA</label>
                  <input value={item.gpa ?? ''} onChange={(e) => update(item.id, 'gpa', e.target.value)}
                    placeholder="e.g. 3.8 / 4.0"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Start date</label>
                  <input type="month" value={item.start_date ?? ''} onChange={(e) => update(item.id, 'start_date', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">End date</label>
                  <input type="month" value={item.end_date ?? ''} onChange={(e) => update(item.id, 'end_date', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                <textarea rows={3} value={item.description ?? ''} onChange={(e) => update(item.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" />
              </div>
              <button onClick={() => save(item)} disabled={saving === item.id}
                className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {saving === item.id ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>
      ))}

      <button onClick={add} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors">
        <Plus size={16} /> Add education
      </button>
    </div>
  )
}
