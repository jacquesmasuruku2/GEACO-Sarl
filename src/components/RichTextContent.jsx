function parseInline(text) {
  const tokens = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\((https?:\/\/[^\s)]+)\))/g
  let cursor = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      tokens.push({ type: 'text', value: text.slice(cursor, match.index) })
    }
    const raw = match[0]
    if (raw.startsWith('**') && raw.endsWith('**')) {
      tokens.push({ type: 'strong', value: raw.slice(2, -2) })
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      tokens.push({ type: 'em', value: raw.slice(1, -1) })
    } else {
      const linkMatch = raw.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/)
      if (linkMatch) {
        tokens.push({ type: 'link', label: linkMatch[1], href: linkMatch[2] })
      } else {
        tokens.push({ type: 'text', value: raw })
      }
    }
    cursor = match.index + raw.length
  }

  if (cursor < text.length) {
    tokens.push({ type: 'text', value: text.slice(cursor) })
  }

  if (tokens.length === 0) {
    return [text]
  }

  return tokens.map((token, index) => {
    if (token.type === 'strong') return <strong key={index}>{token.value}</strong>
    if (token.type === 'em') return <em key={index}>{token.value}</em>
    if (token.type === 'link') {
      return (
        <a key={index} href={token.href} target="_blank" rel="noreferrer">
          {token.label}
        </a>
      )
    }
    return <span key={index}>{token.value}</span>
  })
}

function toBlocks(text) {
  const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trimEnd()
    if (!line.trim()) {
      i += 1
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      blocks.push({ type: `h${heading[1].length}`, text: heading[2].trim() })
      i += 1
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i += 1
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    const paragraph = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,3})\s+/.test(lines[i].trim())) {
      if (/^[-*]\s+/.test(lines[i].trim()) || /^\d+\.\s+/.test(lines[i].trim())) break
      paragraph.push(lines[i].trim())
      i += 1
    }
    blocks.push({ type: 'p', text: paragraph.join(' ') })
  }

  return blocks
}

/**
 * Mini rendu de texte enrichi de type Markdown (simple).
 * Supporte : # ## ###, **gras**, *italique*, listes (-, 1.) et liens [texte](https://...).
 */
export function RichTextContent({ value, className = '' }) {
  const blocks = toBlocks(value)
  if (!blocks.length) return null

  return (
    <div className={`rich-text-content ${className}`.trim()}>
      {blocks.map((block, index) => {
        if (block.type === 'h1') return <h1 key={index}>{parseInline(block.text)}</h1>
        if (block.type === 'h2') return <h2 key={index}>{parseInline(block.text)}</h2>
        if (block.type === 'h3') return <h3 key={index}>{parseInline(block.text)}</h3>
        if (block.type === 'ul') {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{parseInline(item)}</li>
              ))}
            </ul>
          )
        }
        if (block.type === 'ol') {
          return (
            <ol key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{parseInline(item)}</li>
              ))}
            </ol>
          )
        }
        return <p key={index}>{parseInline(block.text)}</p>
      })}
    </div>
  )
}
