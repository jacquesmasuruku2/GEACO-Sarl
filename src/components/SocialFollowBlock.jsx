import { SOCIAL_LINKS } from '../data/socialLinks'

/** Glyphe « f » Facebook (repère courant type Simple Icons, fond marque séparé). */
function IconFacebookMark() {
  return (
    <svg className="social-icon-btn__svg" viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
      <path
        fill="currentColor"
        d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.043.028 1.68.062V8.254h-1.147c-2.862 0-3.639 1.45-3.639 4.69V12.04h4.647l-.619 3.667h-4.028v7.98H9.101z"
      />
    </svg>
  )
}

/** Logo LinkedIn officiel (monochrome, fond marque séparé). */
function IconLinkedInMark() {
  return (
    <svg className="social-icon-btn__svg" viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  )
}

/** Icônes pour les boutons texte (page contact). */
function IconFacebookCard() {
  return (
    <svg className="social-btn__icon" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        fill="currentColor"
        d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.043.028 1.68.062V8.254h-1.147c-2.862 0-3.639 1.45-3.639 4.69V12.04h4.647l-.619 3.667h-4.028v7.98H9.101z"
      />
    </svg>
  )
}

function IconLinkedInCard() {
  return (
    <svg className="social-btn__icon" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  )
}

/**
 * Réseaux GEACO : page contact (carte + texte) ou footer (icônes seules sous la marque).
 * @param {{ title?: string, lead?: string, facebookLabel: string, linkedinLabel: string, navLabel?: string, variant?: 'card' | 'iconsOnly' }} props
 */
export function SocialFollowBlock({
  title,
  lead,
  facebookLabel,
  linkedinLabel,
  navLabel,
  variant = 'card',
}) {
  if (variant === 'iconsOnly') {
    return (
      <nav className="social-follow social-follow--icons-only" aria-label={navLabel || 'Social'}>
        <div className="social-follow__icons">
          <a
            className="social-icon-btn social-icon-btn--facebook"
            href={SOCIAL_LINKS.facebookGeacoAsbl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={facebookLabel}
          >
            <IconFacebookMark />
          </a>
          <a
            className="social-icon-btn social-icon-btn--linkedin"
            href={SOCIAL_LINKS.linkedinCompany}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={linkedinLabel}
          >
            <IconLinkedInMark />
          </a>
        </div>
      </nav>
    )
  }

  return (
    <div className="social-follow social-follow--card">
      {title ? <h2 className="social-follow__title">{title}</h2> : null}
      {lead ? <p className="social-follow__lead">{lead}</p> : null}
      <div className="social-follow__actions">
        <a
          className="social-btn social-btn--facebook"
          href={SOCIAL_LINKS.facebookGeacoAsbl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconFacebookCard />
          <span>{facebookLabel}</span>
        </a>
        <a
          className="social-btn social-btn--linkedin"
          href={SOCIAL_LINKS.linkedinCompany}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconLinkedInCard />
          <span>{linkedinLabel}</span>
        </a>
      </div>
    </div>
  )
}
