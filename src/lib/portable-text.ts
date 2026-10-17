/**
 * Helper to extract plain text from Portable Text (Content rich text) blocks
 */

interface PortableTextBlock {
  children?: Array<{ text?: string }>
}

export function extractBioText(bio: unknown): string {
  if (typeof bio === 'string') return bio
  if (!Array.isArray(bio)) return ''

  return bio
    .filter((block): block is PortableTextBlock => {
      if (!block || typeof block !== 'object') return false
      return 'children' in block && Array.isArray((block as PortableTextBlock).children)
    })
    .map(
      (block) =>
        block.children
          ?.map((child) => (typeof child?.text === 'string' ? child.text : ''))
          .join(' ') ?? ''
    )
    .join(' ')
}

/**
 * Extract paragraphs from Portable Text blocks as string array
 */
export function extractBioParagraphs(bio: unknown): string[] {
  if (typeof bio === 'string') return [bio]
  if (!Array.isArray(bio)) return []

  return bio
    .filter((block): block is PortableTextBlock => {
      if (!block || typeof block !== 'object') return false
      return 'children' in block && Array.isArray((block as PortableTextBlock).children)
    })
    .map(
      (block) =>
        block.children
          ?.map((child) => (typeof child?.text === 'string' ? child.text : ''))
          .join(' ') ?? ''
    )
    .filter((paragraph) => paragraph.length > 0)
}
