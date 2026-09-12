import { SITE_CONTACT } from '../../data/siteContact'

function isHttpUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim())
}

function formatValidUntil(value) {
  if (!value) return '—'
  const raw = String(value).slice(0, 10)
  const [y, m, d] = raw.split('-')
  if (!y || !m || !d) return raw
  return `${d}/${m}/${y}`
}

/**
 * Résout les champs carte à partir d’une fiche personnel.
 */
export function resolveServiceCardData(row) {
  const lastName = String(row?.card_last_name ?? '').trim()
  const firstName = String(row?.card_first_name ?? '').trim()
  const displayName = String(row?.name ?? '').trim()

  return {
    id: row?.id,
    lastName: lastName || displayName || '—',
    firstName: firstName || '—',
    role: String(row?.role ?? '').trim() || '—',
    matricule: String(row?.card_matricule ?? '').trim() || '—',
    address:
      String(row?.card_address ?? '').trim() ||
      SITE_CONTACT.offices.goma.shortAddress,
    photoUrl: isHttpUrl(row?.photo_url) ? String(row.photo_url).trim() : '',
    signatureUrl: isHttpUrl(row?.card_signature_url)
      ? String(row.card_signature_url).trim()
      : '',
    validUntil: formatValidUntil(row?.card_valid_until),
    company: SITE_CONTACT.legalName,
    companyLong: SITE_CONTACT.legalNameLong,
  }
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

          <dl className="service-id-card__fields">
            <div>
              <dt>Noms</dt>
              <dd>{data.lastName}</dd>
            </div>
            <div>
              <dt>Prénom</dt>
              <dd>{data.firstName}</dd>
            </div>
            <div>
              <dt>Fonction</dt>
              <dd>{data.role}</dd>
            </div>
            <div>
              <dt>Matricule</dt>
              <dd>{data.matricule}</dd>
            </div>
            <div>
              <dt>Adresse</dt>
              <dd>{data.address}</dd>
            </div>
          </dl>
        </div>

        <div className="service-id-card__photo-col">
          <div className="service-id-card__photo">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="" />
            ) : (
              <span className="service-id-card__photo-empty">Photo</span>
            )}
          </div>
          <div className="service-id-card__signature">
            {data.signatureUrl ? <img src={data.signatureUrl} alt="" /> : null}
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
