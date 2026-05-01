type TiptapMark = { type: string; attrs?: Record<string, any> }
type TiptapNode = {
  type: string
  text?: string
  attrs?: Record<string, any>
  marks?: TiptapMark[]
  content?: TiptapNode[]
}

function applyMarks(text: string, marks: TiptapMark[] = []): string {
  return marks.reduce((out, mark) => {
    switch (mark.type) {
      case 'bold':      return `<strong>${out}</strong>`
      case 'italic':    return `<em>${out}</em>`
      case 'underline': return `<u>${out}</u>`
      case 'strike':    return `<s>${out}</s>`
      case 'code':      return `<code>${out}</code>`
      case 'link': {
        const href = mark.attrs?.href ?? '#'
        const target = mark.attrs?.target ?? '_blank'
        return `<a href="${href}" target="${target}">${out}</a>`
      }
      default: return out
    }
  }, text)
}

function nodeToHtml(node: TiptapNode): string {
  if (node.type === 'text') {
    const escaped = (node.text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return applyMarks(escaped, node.marks)
  }

  const inner = (node.content ?? []).map(nodeToHtml).join('')
  const align = node.attrs?.textAlign ? ` style="text-align:${node.attrs.textAlign}"` : ''

  switch (node.type) {
    case 'doc':           return inner
    case 'paragraph':     return `<p${align}>${inner}</p>`
    case 'heading':       return `<h${node.attrs?.level ?? 1}${align}>${inner}</h${node.attrs?.level ?? 1}>`
    case 'bulletList':    return `<ul>${inner}</ul>`
    case 'orderedList':   return `<ol>${inner}</ol>`
    case 'listItem':      return `<li>${inner}</li>`
    case 'blockquote':    return `<blockquote>${inner}</blockquote>`
    case 'codeBlock':     return `<pre><code>${inner}</code></pre>`
    case 'hardBreak':     return '<br>'
    case 'horizontalRule':return '<hr>'
    case 'image': {
      const src   = node.attrs?.src   ?? ''
      const alt   = node.attrs?.alt   ?? ''
      const title = node.attrs?.title ? ` title="${node.attrs.title}"` : ''
      return `<figure style="margin:1em 0;text-align:center;"><img src="${src}" alt="${alt}"${title} data-responsive-img style="display:inline-block;height:auto;max-width:100%;border-radius:0.5rem;" /></figure>`
    }
    case 'table':      return `<table>${inner}</table>`
    case 'tableRow':   return `<tr>${inner}</tr>`
    case 'tableHeader':return `<th>${inner}</th>`
    case 'tableCell':  return `<td>${inner}</td>`
    default:              return inner
  }
}

function nodeToText(node: TiptapNode): string {
  if (node.type === 'text') return node.text ?? ''
  const inner = (node.content ?? []).map(nodeToText).join('')
  if (node.type === 'hardBreak') return '\n'
  if (['paragraph', 'heading', 'blockquote'].includes(node.type)) return inner + '\n'
  return inner
}

function parseTiptapJSON(content: string | null | undefined): TiptapNode | null {
  if (!content) return null
  try {
    const json = JSON.parse(content)
    if (json?.type === 'doc') return json as TiptapNode
  } catch {}
  return null
}

/** Returns HTML — use for full article display */
export function resolveContent(content: string | null | undefined): string {
  if (!content) return ''
  const json = parseTiptapJSON(content)
  if (json) return nodeToHtml(json)
  return content
}

/** Returns plain text — use for excerpts and list previews */
export function resolveContentAsText(content: string | null | undefined): string {
  if (!content) return ''
  const json = parseTiptapJSON(content)
  if (json) return nodeToText(json).trim()
  return content.replace(/<[^>]*>/g, '')
}
