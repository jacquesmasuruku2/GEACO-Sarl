import { QRCodeSVG } from 'qrcode.react'
import { SITE_CONTACT } from '../../data/siteContact'
import { personnelProfileUrl, slugifyPersonnel } from '../../lib/personnelSlug'

/** Signature autorisée GEACO (traits noirs, fond transparent). */
export const DEFAULT_SERVICE_CARD_SIGNATURE = '/media/geaco/signature-autorisee.png'

/** Cachet officiel GEACO (accompagne la signature). */
export const SERVICE_CARD_OFFICIAL_STAMP = '/media/geaco/cachet-officiel.png'

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

/** Format type carte UPG : MM/YYYY */
function formatExpiryMonthYear(value) {
  if (!value) return '—'
  const raw = String(value).slice(0, 10)
  const [y, m] = raw.split('-')
  if (!y || !m) return raw
  return `${m}/${y}`
}

function textOrDash(value) {
  const v = String(value ?? '').trim()
  return v || '—'
}

/**
 * Contenu QR : URL du profil public (/personnel/:slug).
 */
export function buildServiceCardQrPayload(data) {
  return data.profileUrl || SITE_CONTACT.websiteUrl
}

/**
 * Résout les champs carte à partir d’une fiche personnel.
 */
export function resolveServiceCardData(row) {
  const lastName = String(row?.card_last_name ?? '').trim()
  const firstName = String(row?.card_first_name ?? '').trim()
  const displayName = String(row?.name ?? '').trim()
  const customSignature = String(row?.card_signature_url ?? '').trim()
  const slug = String(row?.slug ?? '').trim() || slugifyPersonnel(displayName)
  const profileUrl = personnelProfileUrl(
    { slug, name: displayName },
    SITE_CONTACT.websiteUrl,
  )

  return {
    id: row?.id,
    slug,
    profileUrl,
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
    expiryMonthYear: formatExpiryMonthYear(row?.card_valid_until),
    company: SITE_CONTACT.legalName,
    companyLong: SITE_CONTACT.legalNameLong,
    websiteDisplay: SITE_CONTACT.websiteDisplay,
    websiteUrl: SITE_CONTACT.websiteUrl,
    email: SITE_CONTACT.email,
    phone: SITE_CONTACT.phonePrimaryDisplay,
    officeAddress: SITE_CONTACT.offices.goma.address.replace(/\.\s*$/, ''),
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
 * Carte de service GEACO — recto
 * en-tête GEACO (logo | textes | drapeau), corps style carte de service classique.
 */
export function ServiceIdCard({ member, className = '' }) {
  const data = resolveServiceCardData(member)

  return (
    <article
      className={`service-id-card service-id-card--front ${className}`.trim()}
      data-card-id={data.id || undefined}
      data-card-face="recto"
    >
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
          <div className="service-id-card__photo-wrap">
            <div className="service-id-card__photo">
              {data.photoUrl ? (
                <img src={data.photoUrl} alt="" crossOrigin="anonymous" />
              ) : (
                <span className="service-id-card__photo-empty">Photo</span>
              )}
            </div>
          </div>
          <div className="service-id-card__sign-block">
            <img
              className="service-id-card__stamp"
              src={SERVICE_CARD_OFFICIAL_STAMP}
              alt=""
              aria-hidden="true"
            />
            <div className="service-id-card__signature">
              {data.signatureUrl ? (
                <img
                  src={data.signatureUrl}
                  alt=""
                  crossOrigin={/^https?:\/\//i.test(data.signatureUrl) ? 'anonymous' : undefined}
                />
              ) : null}
            </div>
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

/**
 * Verso — QR (infos carte), contacts, laissez-passer, expiration.
 */
export function ServiceIdCardBack({ member, className = '' }) {
  const data = resolveServiceCardData(member)
  const qrValue = buildServiceCardQrPayload(data)

  return (
    <article
      className={`service-id-card service-id-card--back ${className}`.trim()}
      data-card-id={data.id || undefined}
      data-card-face="verso"
    >
      <div className="service-id-card__watermark service-id-card__watermark--back" aria-hidden="true">
        <img src="/geaco-logo-transparent.png" alt="" />
      </div>

      <header className="service-id-card__back-header">
        <p>{data.companyLong.toUpperCase()}</p>
      </header>

      <div className="service-id-card__back-body">
        <div className="service-id-card__back-qr" aria-label="QR code de la carte de service">
          <QRCodeSVG
            value={qrValue}
            size={128}
            level="M"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#111111"
          />
        </div>

        <div className="service-id-card__back-contacts">
          <h3>Contacts</h3>
          <p>{data.officeAddress}</p>
          <p>{data.phone}</p>
          <p>{data.email}</p>
          <p>{data.websiteDisplay}</p>
          <p className="service-id-card__back-profile">Profil : /personnel/{data.slug}</p>
        </div>
      </div>

      <p className="service-id-card__pass">LAISSEZ-PASSER</p>

      <p className="service-id-card__expiry">Date d&apos;expiration : {data.expiryMonthYear}</p>

      <div className="service-id-card__stripe" aria-hidden="true" />

      <p className="service-id-card__back-assist">
        Les autorités tant civiles et militaires sont priées d’apporter assistance au porteur de la
        présente en cas de nécessité.
      </p>

      <footer className="service-id-card__back-footer">
        Cette carte est strictement personnelle et non transférable.
      </footer>
    </article>
  )
}
