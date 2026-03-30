'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronRight, GripVertical, MoreVertical, Pencil, Plus, Tag, Trash2, X } from 'lucide-react'

type TagItem = { id: string; name: string }

export default function AdminTagsPanel() {
  const [tags, setTags] = useState<TagItem[]>([])
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [menuId, setMenuId] = useState<string | null>(null)
  const dragIndex = useRef<number | null>(null)

  const fetchTags = () => {
    fetch('/api/tags')
      .then(r => r.json())
      .then(data => setTags(Array.isArray(data) ? data : []))
      .catch(() => setTags([]))
  }

  useEffect(() => { fetchTags() }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuId) return
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-tag-menu]')) setMenuId(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuId])

  const addTag = async () => {
    if (!newName.trim()) return
    await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setNewName('')
    fetchTags()
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    await fetch('/api/tags', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: editName.trim() }),
    })
    setEditId(null)
    fetchTags()
  }

  const deleteTag = async (id: string) => {
    await fetch('/api/tags', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setMenuId(null)
    fetchTags()
  }

  const saveOrder = (ordered: TagItem[]) => {
    fetch('/api/tags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: ordered }),
    })
  }

  // Drag & drop handlers
  const onDragStart = (index: number) => { dragIndex.current = index }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const next = [...tags]
    const [item] = next.splice(dragIndex.current, 1)
    next.splice(index, 0, item)
    dragIndex.current = index
    setTags(next)
  }

  const onDragEnd = () => {
    saveOrder(tags)
    dragIndex.current = null
  }

  return (
    <div className="border border-slate-300 dark:border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition text-left"
      >
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-slate-500 dark:text-white/40" aria-hidden="true" />
          <span className="font-semibold">Tag Shortcuts</span>
          <span className="text-xs text-slate-500 dark:text-white/40">— quick filters for /projects</span>
          {tags.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60">
              {tags.length}
            </span>
          )}
        </div>
        {open
          ? <ChevronDown size={16} className="text-slate-400 dark:text-white/30" aria-hidden="true" />
          : <ChevronRight size={16} className="text-slate-400 dark:text-white/30" aria-hidden="true" />}
      </button>

      {open && (
        <div className="p-4 space-y-3">
          {/* Add new */}
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addTag() }}
              placeholder="New tag shortcut…"
              className="flex-1 px-3 py-2 text-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-slate-400 dark:focus:border-white/30 transition placeholder:text-slate-400 dark:placeholder:text-white/30"
            />
            <button
              onClick={addTag}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm rounded-lg hover:opacity-80 transition"
            >
              <Plus size={14} aria-hidden="true" /> Add
            </button>
          </div>

          {/* Tags list */}
          {tags.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-white/40 text-center py-2">No tags yet. Add one above.</p>
          ) : (
            <div className="space-y-1">
              {tags.map((tag, index) => (
                <div
                  key={tag.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={e => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg"
                >
                  {/* Drag handle */}
                  <GripVertical
                    size={15}
                    className="text-slate-300 dark:text-white/20 cursor-grab active:cursor-grabbing flex-shrink-0"
                    aria-hidden="true"
                  />

                  {/* Name / inline edit */}
                  {editId === tag.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        autoFocus
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEdit(tag.id)
                          if (e.key === 'Escape') setEditId(null)
                        }}
                        className="flex-1 text-sm bg-transparent border-b border-slate-400 dark:border-white/40 outline-none"
                      />
                      <button
                        onClick={() => saveEdit(tag.id)}
                        className="text-green-600 dark:text-green-400 hover:opacity-70 transition flex-shrink-0"
                        aria-label="Save"
                      >
                        <Check size={13} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-slate-400 hover:opacity-70 transition flex-shrink-0"
                        aria-label="Cancel"
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1 text-sm text-slate-700 dark:text-white/70 select-none">
                      {tag.name}
                    </span>
                  )}

                  {/* 3-dots dropdown */}
                  {editId !== tag.id && (
                    <div className="relative flex-shrink-0" data-tag-menu>
                      <button
                        data-tag-menu
                        onClick={() => setMenuId(menuId === tag.id ? null : tag.id)}
                        className="p-1 rounded text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
                        aria-label={`Options for ${tag.name}`}
                      >
                        <MoreVertical size={14} aria-hidden="true" />
                      </button>

                      {menuId === tag.id && (
                        <div
                          data-tag-menu
                          className="absolute right-0 top-full mt-1 w-28 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-20"
                        >
                          <button
                            data-tag-menu
                            onClick={() => { setEditId(tag.id); setEditName(tag.name); setMenuId(null) }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                          >
                            <Pencil size={12} aria-hidden="true" /> Edit
                          </button>
                          <button
                            data-tag-menu
                            onClick={() => deleteTag(tag.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            <Trash2 size={12} aria-hidden="true" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
