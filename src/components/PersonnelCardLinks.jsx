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

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 9.5H4V20h2.5V9.5ZM5.25 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM20 13.2c0-2.7-1.45-4.45-3.85-4.45-1.35 0-2.25.7-2.65 1.35V9.5H11V20h2.5v-5.55c0-1.45.7-2.4 1.95-2.4 1.15 0 1.8.75 1.8 2.35V20H20v-6.8Z" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 9h2.5V6.2C16.05 6.1 15.1 6 14 6c-2.2 0-3.7 1.35-3.7 3.85V12H8v3h2.3v7h3v-7H16l.5-3h-3.2V9.7c0-.85.4-1.7 1.7-1.7Z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="m5 7.5 7 5.2 7-5.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Liens contact sous le profil (email / réseaux).
 */
export function PersonnelCardLinks({ email, facebookUrl, linkedinUrl, labels, className = '' }) {
  const mail = trimEmail(email)
  const fb = trimHttpUrl(facebookUrl)
  const li = trimHttpUrl(linkedinUrl)
  if (!mail && !fb && !li) return null

  return (
    <div className={`personnel-profile__links ${className}`.trim()}>
      {li ? (
        <a
          className="personnel-profile__link"
          href={li}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={labels.linkedin}
          title={labels.linkedin}
        >
          <IconLinkedIn />
        </a>
      ) : null}
      {fb ? (
        <a
          className="personnel-profile__link"
          href={fb}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={labels.facebook}
          title={labels.facebook}
        >
          <IconFacebook />
        </a>
      ) : null}
      {mail ? (
        <a
          className="personnel-profile__link"
          href={`mailto:${mail}`}
          aria-label={labels.email}
          title={labels.email}
        >
          <IconMail />
        </a>
      ) : null}
    </div>
  )
}
