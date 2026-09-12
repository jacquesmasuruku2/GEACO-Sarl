import { SITE_CONTACT } from '../../data/siteContact'

/** Signature autorisée GEACO (traits noirs, fond transparent). */
export const DEFAULT_SERVICE_CARD_SIGNATURE = '/media/geaco/signature-autorisee.png'

function isHttpUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim())
}

function isUsableImageSrc(url) {
  if (typeof url !== 'string') return false
  const v = url.trim()
  return Boolean(v) && (v.startsWith('/') || /^https?:\/\//i.test(v))
}

function formatCardDate(value) {
  if (!value) return '—'
  const raw = String(value).slice(0, 10)
  const [y, m, d] = raw.split('-')
  if (!y || !m || !d) return raw
  return `${d}/${m}/${y}`
}

function textOrDash(value) {
  const v = String(value ?? '').trim()
  return v || '—'
}

/**
 * Résout les champs carte à partir d’une fiche personnel.
 */
export function resolveServiceCardData(row) {
  const lastName = String(row?.card_last_name ?? '').trim()
  const firstName = String(row?.card_first_name ?? '').trim()
  const displayName = String(row?.name ?? '').trim()
  const customSignature = String(row?.card_signature_url ?? '').trim()

  return {
    id: row?.id,
    lastName: lastName || displayName || '—',
    postName: textOrDash(row?.card_post_name),
    firstName: firstName || '—',
    sex: textOrDash(row?.card_sex),
    birthPlace: textOrDash(row?.card_birth_place),
    birthDate: formatCardDate(row?.card_birth_date),
    role: String(row?.role ?? '').trim() || '—',
    matricule: String(row?.card_matricule ?? '').trim() || '—',
    department: textOrDash(row?.card_department),
    address:
      String(row?.card_address ?? '').trim() ||
      SITE_CONTACT.offices.goma.shortAddress,
    photoUrl: isHttpUrl(row?.photo_url) ? String(row.photo_url).trim() : '',
    signatureUrl: isUsableImageSrc(customSignature)
      ? customSignature
      : DEFAULT_SERVICE_CARD_SIGNATURE,
    validUntil: formatCardDate(row?.card_valid_until),
    company: SITE_CONTACT.legalName,
    companyLong: SITE_CONTACT.legalNameLong,
  }
}

function CardField({ label, value }) {
  return (
    <div className="service-id-card__row">
      <span className="service-id-card__label">{label}</span>
      <span className="service-id-card__colon" aria-hidden="true">
        :
      </span>
      <span className="service-id-card__value">{value}</span>
    </div>
  )
}

/**
 * Carte de service GEACO —
 * en-tête GEACO (logo | textes | drapeau), corps style carte de service classique.
 */
export function ServiceIdCard({ member, className = '' }) {
  const data = resolveServiceCardData(member)

  return (
    <article className={`service-id-card ${className}`.trim()} data-card-id={data.id || undefined}>
      <div className="service-id-card__watermark" aria-hidden="true">
        <img src="/geaco-logo-transparent.png" alt="" />
      </div>

      <header className="service-id-card__header">
        <div className="service-id-card__header-side service-id-card__header-side--left">
          <img src="/geaco-logo-transparent.png" alt="" className="service-id-card__logo" />
        </div>

        <div className="service-id-card__header-center">
          <p className="service-id-card__header-line service-id-card__header-line--state">
            République démocratique du Congo
          </p>
          <p className="service-id-card__header-line service-id-card__header-line--sector">
            Agriculture · Construction · WASH
          </p>
          <p className="service-id-card__header-line service-id-card__header-line--org">
            {data.companyLong}
          </p>
        </div>

        <div className="service-id-card__header-side service-id-card__header-side--right">
          <img
            className="service-id-card__flag"
            src="/media/geaco/drapeau-rdc.webp"
            alt="Drapeau de la République démocratique du Congo"
          />
        </div>
      </header>

      <div className="service-id-card__body">
        <div className="service-id-card__main">
          <h2 className="service-id-card__title">CARTE DE SERVICE</h2>

          <div className="service-id-card__fields">
            <CardField label="Nom" value={data.lastName} />
            <CardField label="Post-nom" value={data.postName} />
            <CardField label="Prénom" value={data.firstName} />
            <CardField label="Sexe" value={data.sex} />
            <CardField label="Lieu de naissance" value={data.birthPlace} />
            <CardField label="Date de naissance" value={data.birthDate} />
            <CardField label="Fonction" value={data.role} />
            <CardField label="Matricule" value={data.matricule} />
            <CardField label="Département" value={data.department} />
          </div>
        </div>

        <div className="service-id-card__photo-col">
          <div className="service-id-card__photo">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="" crossOrigin="anonymous" />
            ) : (
              <span className="service-id-card__photo-empty">Photo</span>
            )}
          </div>
          <div className="service-id-card__signature">
            {data.signatureUrl ? (
              <img
                src={data.signatureUrl}
                alt=""
                crossOrigin={/^https?:\/\//i.test(data.signatureUrl) ? 'anonymous' : undefined}
              />
            ) : null}
          </div>
          <p className="service-id-card__sign-label">Signature autorisée</p>
          <p className="service-id-card__validity">Validité {data.validUntil}</p>
        </div>
      </div>

      <p className="service-id-card__footer">
        Les autorités civiles et militaires sont priées d’apporter assistance au titulaire de la présente
        carte.
      </p>
    </article>
  )
}
