'use client'

import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Skill, SkillLevel } from '@/types/portfolio'

const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors'

const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert']

const levelColors: Record<SkillLevel, string> = {
  beginner: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  advanced: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  expert: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

export default function SkillsEditor({
  initialSkills,
  userId,
}: {
  initialSkills: Skill[]
  userId: string
}) {
  const supabase = createClient()
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState<SkillLevel>('intermediate')
  const [saving, setSaving] = useState(false)

  const categories = useMemo(
    () => Array.from(new Set(skills.map((s) => s.category).filter(Boolean))) as string[],
    [skills]
  )

  const grouped = useMemo(() => {
    const map: Record<string, Skill[]> = {}
    for (const s of skills) {
      const key = s.category || 'Other'
      if (!map[key]) map[key] = []
      map[key].push(s)
    }
    return map
  }, [skills])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Skill name is required')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('skills')
      .insert({
        user_id: userId,
        name: name.trim(),
        category: category.trim() || null,
        level,
        display_order: skills.length,
      })
      .select()
      .single()
    setSaving(false)
    if (error) return toast.error(error.message)
    setSkills((s) => [...s, data as Skill])
    setName('')
    toast.success('Skill added')
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) return toast.error(error.message)
    setSkills((s) => s.filter((sk) => sk.id !== id))
    toast.success('Skill removed')
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAdd}
        className="rounded-2xl p-6 border border-white/5 space-y-4"
        style={{ background: 'rgba(15,23,42,0.5)' }}
      >
        <h2 className="text-lg font-semibold text-white">Add a skill</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            className={inputClass}
            placeholder="Skill name (e.g. React)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Category (e.g. Frontend)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="skill-categories"
          />
          <datalist id="skill-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <select
            className={inputClass}
            value={level}
            onChange={(e) => setLevel(e.target.value as SkillLevel)}
          >
            {levels.map((l) => (
              <option key={l} value={l} className="bg-slate-800 capitalize">
                {l}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <Plus size={18} />
          {saving ? 'Adding...' : 'Add skill'}
        </button>
      </form>

      {skills.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
          <p className="text-slate-400">No skills yet. Add some above!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div
              key={cat}
              className="rounded-2xl p-5 border border-white/5"
              style={{ background: 'rgba(15,23,42,0.5)' }}
            >
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                {cat}
              </h3>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((s) => (
                  <div
                    key={s.id}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${
                      s.level ? levelColors[s.level] : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    <span className="font-medium">{s.name}</span>
                    {s.level && <span className="text-xs opacity-70 capitalize">· {s.level}</span>}
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
