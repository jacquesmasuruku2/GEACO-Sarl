import { SOCIAL_LINKS } from '../data/socialLinks'

function IconFacebook() {
  return (
    <svg className="social-btn__icon" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  )
}

function IconLinkedIn() {
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
 * Bloc CTA réseaux (Facebook GEACO ASBL + page LinkedIn entreprise).
 * @param {{ title: string, lead: string, facebookLabel: string, linkedinLabel: string, variant?: 'card' | 'footer' }} props
 */
export function SocialFollowBlock({ title, lead, facebookLabel, linkedinLabel, variant = 'card' }) {
  const wrapClass =
    variant === 'card'
      ? 'social-follow social-follow--card'
      : variant === 'footer'
        ? 'social-follow social-follow--footer'
        : 'social-follow'

  return (
    <div className={wrapClass}>
      <h2 className="social-follow__title">{title}</h2>
      <p className="social-follow__lead">{lead}</p>
      <div className="social-follow__actions">
        <a
          className="social-btn social-btn--facebook"
          href={SOCIAL_LINKS.facebookGeacoAsbl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconFacebook />
          <span>{facebookLabel}</span>
        </a>
        <a
          className="social-btn social-btn--linkedin"
          href={SOCIAL_LINKS.linkedinCompany}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconLinkedIn />
          <span>{linkedinLabel}</span>
        </a>
      </div>
    </div>
  )
}
