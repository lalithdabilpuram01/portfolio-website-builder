'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, Plus, Star, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/types/portfolio'

const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors'

type FormState = {
  title: string
  description: string
  project_url: string
  github_url: string
  tech_stack: string
  is_featured: boolean
}

const emptyForm: FormState = {
  title: '',
  description: '',
  project_url: '',
  github_url: '',
  tech_stack: '',
  is_featured: false,
}

function SortableProject({
  project,
  onEdit,
  onDelete,
}: {
  project: Project
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="rounded-2xl p-5 border border-white/5 flex gap-4"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 mt-1"
      >
        <GripVertical size={20} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white truncate">{project.title}</h3>
          {project.is_featured && (
            <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />
          )}
        </div>
        {project.description && (
          <p className="text-sm text-slate-400 line-clamp-2 mb-2">{project.description}</p>
        )}
        {project.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-xs rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default function ProjectsEditor({
  initialProjects,
  userId,
}: {
  initialProjects: Project[]
  userId: string
}) {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(p: Project) {
    setForm({
      title: p.title,
      description: p.description ?? '',
      project_url: p.project_url ?? '',
      github_url: p.github_url ?? '',
      tech_stack: (p.tech_stack ?? []).join(', '),
      is_featured: p.is_featured,
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      project_url: form.project_url.trim() || null,
      github_url: form.github_url.trim() || null,
      tech_stack: form.tech_stack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      is_featured: form.is_featured,
    }

    if (editingId) {
      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()
      setSaving(false)
      if (error) return toast.error(error.message)
      setProjects((ps) => ps.map((p) => (p.id === editingId ? (data as Project) : p)))
      toast.success('Project updated')
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...payload, user_id: userId, display_order: projects.length })
        .select()
        .single()
      setSaving(false)
      if (error) return toast.error(error.message)
      setProjects((ps) => [...ps, data as Project])
      toast.success('Project added')
    }
    setShowForm(false)
    setForm(emptyForm)
    setEditingId(null)
  }

  async function confirmDelete() {
    if (!deleteId) return
    const { error } = await supabase.from('projects').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setProjects((ps) => ps.filter((p) => p.id !== deleteId))
    setDeleteId(null)
    toast.success('Project deleted')
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(projects, oldIndex, newIndex)
    setProjects(reordered)

    await Promise.all(
      reordered.map((p, i) =>
        supabase.from('projects').update({ display_order: i }).eq('id', p.id)
      )
    )
    toast.success('Order saved')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <Plus size={18} />
          Add project
        </button>
      </div>

      {projects.length === 0 && !showForm && (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
          <p className="text-slate-400">No projects yet. Add your first one!</p>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {projects.map((p) => (
              <SortableProject
                key={p.id}
                project={p}
                onEdit={() => openEdit(p)}
                onDelete={() => setDeleteId(p.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 border border-indigo-500/20 space-y-4"
          style={{ background: 'rgba(99,102,241,0.05)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">
              {editingId ? 'Edit project' : 'New project'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <input
            className={inputClass}
            placeholder="Project title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid md:grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="Live URL (https://...)"
              value={form.project_url}
              onChange={(e) => setForm({ ...form, project_url: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="GitHub URL (https://...)"
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            />
          </div>
          <input
            className={inputClass}
            placeholder="Tech stack (comma-separated: React, Node.js, Postgres)"
            value={form.tech_stack}
            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="w-4 h-4 rounded accent-indigo-600"
            />
            Mark as featured
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-medium text-white disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add project'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl font-medium text-slate-300 border border-white/10 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            className="rounded-2xl p-6 max-w-sm w-full border border-white/10"
            style={{ background: '#0f172a' }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Delete project?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-slate-300 border border-white/10 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
