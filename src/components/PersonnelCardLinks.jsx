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
export function PersonnelCardLinks({ email, facebookUrl, linkedinUrl, labels }) {
  const mail = trimEmail(email)
  const fb = trimHttpUrl(facebookUrl)
  const li = trimHttpUrl(linkedinUrl)
  if (!mail && !fb && !li) return null

  return (
    <div className="personnel-card__links">
      {mail ? (
        <a className="personnel-card__link" href={`mailto:${mail}`}>
          {labels.email}
        </a>
      ) : null}
      {fb ? (
        <a className="personnel-card__link" href={fb} target="_blank" rel="noreferrer noopener">
          {labels.facebook}
        </a>
      ) : null}
      {li ? (
        <a className="personnel-card__link" href={li} target="_blank" rel="noreferrer noopener">
          {labels.linkedin}
        </a>
      ) : null}
    </div>
  )
}
