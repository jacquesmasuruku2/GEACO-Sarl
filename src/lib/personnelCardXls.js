import * as XLSX from 'xlsx'

/** En-têtes exacts du modèle Google Form / XLS GEACO. */
export const PERSONNEL_XLS_HEADERS = [
  'Nom',
  'Post-nom',
  'Prénom',
  'Sexe',
  'Date de naissance',
  'Lieu de naissance',
  'Votre photo passeport (Format Image)',
  'Fonction / Poste occupé au sein de GEACO SARL',
  'Département / Service',
  'Numéro de téléphone / WhatsApp',
  'Groupe sanguin',
]

const HEADER_ALIASES = {
  nom: 'last_name',
  'post-nom': 'post_name',
  'post nom': 'post_name',
  postnom: 'post_name',
  prenom: 'first_name',
  'prénom': 'first_name',
  sexe: 'sex',
  'date de naissance': 'birth_date',
  'lieu de naissance': 'birth_place',
  'votre photo passeport (format image)': 'photo_url',
  'votre photo passeport': 'photo_url',
  photo: 'photo_url',
  'photo passeport': 'photo_url',
  'fonction / poste occupe au sein de geaco sarl': 'role',
  'fonction / poste occupé au sein de geaco sarl': 'role',
  fonction: 'role',
  poste: 'role',
  'departement / service': 'department',
  'département / service': 'department',
  departement: 'department',
  'département': 'department',
  service: 'department',
  'numero de telephone / whatsapp': 'phone',
  'numéro de téléphone / whatsapp': 'phone',
  telephone: 'phone',
  'téléphone': 'phone',
  whatsapp: 'phone',
  'groupe sanguin': 'blood_group',
  email: 'email',
  'e-mail': 'email',
  mail: 'email',
}

function normalizeHeader(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}

function trimOrNull(v) {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

/** Excel serial date → YYYY-MM-DD */
function excelSerialToIso(serial) {
  const n = Number(serial)
  if (!Number.isFinite(n)) return null
  const utc = Math.round((n - 25569) * 86400 * 1000)
  const d = new Date(utc)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

function parseBirthDate(value) {
  if (value == null || value === '') return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'number') return excelSerialToIso(value)
  const raw = String(value).trim()
  if (!raw) return null
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const fr = raw.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (fr) {
    const dd = fr[1].padStart(2, '0')
    const mm = fr[2].padStart(2, '0')
    return `${fr[3]}-${mm}-${dd}`
  }
  const asNum = Number(raw)
  if (Number.isFinite(asNum) && asNum > 20000 && asNum < 80000) {
    return excelSerialToIso(asNum)
  }
  return null
}

function looksLikeUrl(value) {
  const s = String(value ?? '').trim()
  return /^https?:\/\//i.test(s)
}

/**
 * @param {Record<string, unknown>} row application-like row
 * @returns {Record<string, string|null>}
 */
export function applicationToXlsRow(row) {
  return {
    Nom: trimOrNull(row.last_name) ?? '',
    'Post-nom': trimOrNull(row.post_name) ?? '',
    Prénom: trimOrNull(row.first_name) ?? '',
    Sexe: trimOrNull(row.sex) ?? '',
    'Date de naissance': row.birth_date ? String(row.birth_date).slice(0, 10) : '',
    'Lieu de naissance': trimOrNull(row.birth_place) ?? '',
    'Votre photo passeport (Format Image)': trimOrNull(row.photo_url) ?? '',
    'Fonction / Poste occupé au sein de GEACO SARL': trimOrNull(row.role) ?? '',
    'Département / Service': trimOrNull(row.department) ?? '',
    'Numéro de téléphone / WhatsApp': trimOrNull(row.phone) ?? '',
    'Groupe sanguin': trimOrNull(row.blood_group) ?? '',
  }
}

/**
 * @param {Record<string, unknown>} row site_personnel row
 */
export function personnelToXlsRow(row) {
  return applicationToXlsRow({
    last_name: row.card_last_name || row.name,
    post_name: row.card_post_name,
    first_name: row.card_first_name,
    sex: row.card_sex,
    birth_date: row.card_birth_date,
    birth_place: row.card_birth_place,
    photo_url: row.photo_url,
    role: row.role,
    department: row.card_department || row.focus,
    phone: row.card_phone,
    blood_group: row.card_blood_group,
  })
}

/**
 * @param {Array<Record<string, unknown>>} rows
 * @param {string} filename
 */
export function downloadPersonnelXls(rows, filename = 'geaco-personnel-cartes.xlsx') {
  const sheetRows = rows.length
    ? rows
    : [
        Object.fromEntries(PERSONNEL_XLS_HEADERS.map((h) => [h, ''])),
      ]
  const ws = XLSX.utils.json_to_sheet(sheetRows, { header: PERSONNEL_XLS_HEADERS })
  ws['!cols'] = PERSONNEL_XLS_HEADERS.map((h) => ({ wch: Math.min(42, Math.max(14, h.length + 2)) }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Personnel')
  XLSX.writeFile(wb, filename)
}

/**
 * Parse un fichier .xlsx / .xls → lignes normalisées.
 * @param {ArrayBuffer} buffer
 * @returns {{ rows: Array<Record<string, string|null>>, errors: string[] }}
 */
export function parsePersonnelXls(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return { rows: [], errors: ['Fichier Excel vide.'] }
  const sheet = workbook.Sheets[sheetName]
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false, dateNF: 'yyyy-mm-dd' })
  if (!raw.length) {
    // Essayer avec raw:true pour dates numériques
    const rawNums = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true })
    if (!rawNums.length) return { rows: [], errors: ['Aucune ligne de données dans le fichier.'] }
    return normalizeParsedRows(rawNums)
  }
  return normalizeParsedRows(raw)
}

function normalizeParsedRows(rawRows) {
  const errors = []
  const rows = []

  rawRows.forEach((raw, index) => {
    const mapped = {}
    for (const [key, value] of Object.entries(raw)) {
      const field = HEADER_ALIASES[normalizeHeader(key)]
      if (!field) continue
      mapped[field] = value
    }

    const last_name = trimOrNull(mapped.last_name)
    const first_name = trimOrNull(mapped.first_name)
    const role = trimOrNull(mapped.role)
    if (!last_name && !first_name && !role) return

    if (!last_name || !first_name) {
      errors.push(`Ligne ${index + 2} : nom et prénom obligatoires.`)
      return
    }
    if (!role) {
      errors.push(`Ligne ${index + 2} (${last_name}) : fonction obligatoire.`)
      return
    }

    let photo_url = trimOrNull(mapped.photo_url)
    if (photo_url && !looksLikeUrl(photo_url)) {
      errors.push(
        `Ligne ${index + 2} (${last_name}) : la photo doit être une URL http(s) (images embarquées non lues).`,
      )
      photo_url = null
    }

    const emailRaw = trimOrNull(mapped.email)
    const email =
      emailRaw && /@/.test(emailRaw)
        ? emailRaw
        : `import.${Date.now().toString(36)}.${index}@geaco.local`

    rows.push({
      last_name,
      post_name: trimOrNull(mapped.post_name),
      first_name,
      sex: trimOrNull(mapped.sex),
      birth_date: parseBirthDate(mapped.birth_date),
      birth_place: trimOrNull(mapped.birth_place),
      photo_url,
      role,
      department: trimOrNull(mapped.department),
      phone: trimOrNull(mapped.phone),
      blood_group: trimOrNull(mapped.blood_group),
      email,
    })
  })

  return { rows, errors }
}
