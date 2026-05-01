'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { applyImageRulesToContainer } from '@/lib/image-rules'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Grid, Trash2, Plus
} from 'lucide-react'

interface TiptapEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-slate-200 dark:bg-white/20 text-slate-900 dark:text-white'
          : 'text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}

export function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Write your content here…',
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    immediatelyRender: false,
    content: (() => {
      try { return JSON.parse(value) } catch { return value }
    })(),
    onUpdate({ editor }) {
      onChange(JSON.stringify(editor.getJSON()))
      applyImageRulesToContainer(editor.view.dom)
    },
    editorProps: {
      attributes: {
        class:
          'tiptap-content min-h-[320px] px-4 py-3 text-sm text-slate-900 dark:text-white/90 leading-relaxed focus:outline-none prose prose-slate dark:prose-invert max-w-none',
      },
    },
  })

  useEffect(() => {
    if (editor) applyImageRulesToContainer(editor.view.dom)
  }, [editor])

  if (!editor) return null

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03]">
        {/* History */}
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Headings */}
        <ToolbarButton
          title="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Marks */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Inline Code"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Lists */}
        <ToolbarButton
          title="Bullet List"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Ordered List"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          title="Align Left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Align Center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Align Right"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Link */}
        <ToolbarButton
          title="Link"
          active={editor.isActive('link')}
          onClick={setLink}
        >
          <LinkIcon size={15} />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Table — insert */}
        <ToolbarButton
          title="Insert Table"
          active={editor.isActive('table')}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <Grid size={15} />
        </ToolbarButton>

        {/* Table controls — only visible when inside a table */}
        {editor.isActive('table') && (
          <>
            <ToolbarButton title="Add column before" onClick={() => editor.chain().focus().addColumnBefore().run()}>
              <Plus size={13} />
              <span className="text-[10px] leading-none">C←</span>
            </ToolbarButton>
            <ToolbarButton title="Add column after" onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <Plus size={13} />
              <span className="text-[10px] leading-none">C→</span>
            </ToolbarButton>
            <ToolbarButton title="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()}>
              <Trash2 size={13} />
              <span className="text-[10px] leading-none">Col</span>
            </ToolbarButton>
            <ToolbarButton title="Add row before" onClick={() => editor.chain().focus().addRowBefore().run()}>
              <Plus size={13} />
              <span className="text-[10px] leading-none">R↑</span>
            </ToolbarButton>
            <ToolbarButton title="Add row after" onClick={() => editor.chain().focus().addRowAfter().run()}>
              <Plus size={13} />
              <span className="text-[10px] leading-none">R↓</span>
            </ToolbarButton>
            <ToolbarButton title="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}>
              <Trash2 size={13} />
              <span className="text-[10px] leading-none">Row</span>
            </ToolbarButton>
            <ToolbarButton title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}>
              <Trash2 size={13} />
              <span className="text-[10px] leading-none">Tbl</span>
            </ToolbarButton>
            <ToolbarButton title="Merge cells" onClick={() => editor.chain().focus().mergeCells().run()}>
              <span className="text-[10px] leading-none font-medium">Merge</span>
            </ToolbarButton>
            <ToolbarButton title="Split cell" onClick={() => editor.chain().focus().splitCell().run()}>
              <span className="text-[10px] leading-none font-medium">Split</span>
            </ToolbarButton>
          </>
        )}
      </div>

      {/* Table styles */}
      <style>{`
        .tiptap-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5em 0;
          font-size: 0.9em;
          overflow: hidden;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }
        .dark .tiptap-content table {
          border-color: rgba(255,255,255,0.12);
        }
        .tiptap-content th,
        .tiptap-content td {
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          vertical-align: top;
          position: relative;
          min-width: 60px;
        }
        .dark .tiptap-content th,
        .dark .tiptap-content td {
          border-color: rgba(255,255,255,0.12);
        }
        .tiptap-content th {
          background: #f8fafc;
          font-weight: 600;
          text-align: left;
        }
        .dark .tiptap-content th {
          background: rgba(255,255,255,0.06);
        }
        .tiptap-content .selectedCell::after {
          background: rgba(99,102,241,0.15);
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .tiptap-content .column-resize-handle {
          background-color: #6366f1;
          bottom: -2px;
          pointer-events: none;
          position: absolute;
          right: -2px;
          top: 0;
          width: 3px;
        }
      `}</style>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
