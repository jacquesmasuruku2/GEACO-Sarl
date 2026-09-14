/**
 * Regroupe les lignes `site_personnel` par `section_order` (même ordre = même bloc).
 * Le titre affiché est celui de la première ligne du groupe.
 * @param {Array<Record<string, unknown>>} rows
 * @returns {Array<{ sectionOrder: number, title: string, members: Array<Record<string, unknown>> }>}
 */
export function groupPersonnelRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return []

  const sorted = [...rows].sort((a, b) => {
    const so = (a.section_order ?? 0) - (b.section_order ?? 0)
    if (so !== 0) return so
    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })

  /** @type {Array<{ sectionOrder: number, title: string, members: Array<Record<string, unknown>> }>} */
  const groups = []
  let currentOrder = null

  for (const row of sorted) {
    const ord = Number(row.section_order) || 0
    if (currentOrder !== ord) {
      currentOrder = ord
      groups.push({
        sectionOrder: ord,
        title: String(row.section_title ?? ''),
        members: [],
      })
    }
    const g = groups[groups.length - 1]
    g.members.push({
      id: row.id,
      slug: row.slug ?? '',
      name: row.name,
      role: row.role,
      focus: row.focus ?? '',
      bio: row.bio ?? '',
      photo_url: row.photo_url ?? '',
      email: row.email ?? '',
      facebook_url: row.facebook_url ?? '',
      linkedin_url: row.linkedin_url ?? '',
    })
  }

  return groups
}
