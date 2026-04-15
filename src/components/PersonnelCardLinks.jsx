function trimHttpUrl(url) {
  if (typeof url !== 'string') return ''
  const u = url.trim()
  return /^https?:\/\//i.test(u) ? u : ''
}

function trimEmail(email) {
  if (typeof email !== 'string') return ''
  const e = email.trim()
  return e.includes('@') ? e : ''
}

/**
 * Liens contact en bas de carte personnel (après photo & texte).
 */
export function PersonnelCardLinks({ email, facebookUrl, linkedinUrl, labels, className = '' }) {
  const mail = trimEmail(email)
  const fb = trimHttpUrl(facebookUrl)
  const li = trimHttpUrl(linkedinUrl)
  if (!mail && !fb && !li) return null

  return (
    <div className={`personnel-card__links ${className}`.trim()}>
      {li ? (
        <a
          className="personnel-card__link personnel-card__link--icon"
          href={li}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={labels.linkedin}
          title={labels.linkedin}
        >
          in
        </a>
      ) : null}
      {fb ? (
        <a
          className="personnel-card__link personnel-card__link--icon"
          href={fb}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={labels.facebook}
          title={labels.facebook}
        >
          f
        </a>
      ) : null}
      {mail ? (
        <a className="personnel-card__link personnel-card__link--icon" href={`mailto:${mail}`} aria-label={labels.email} title={labels.email}>
          ✉
        </a>
      ) : null}
    </div>
  )
}
