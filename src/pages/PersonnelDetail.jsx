import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { formatNavLabel } from '../lib/formatNavLabel'
import { useSitePersonnelBySlug } from '../hooks/useSitePersonnelBySlug'
import { PersonnelCardLinks } from '../components/PersonnelCardLinks'
import { personnelContactEmail } from '../data/personnelContacts'

function isPhotoUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim())
}

function memberInitials(name) {
  if (!name) return '?'
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function PersonnelDetail() {
  const { slug } = useParams()
  const { t, locale } = useI18n()
  const { member, loading, error } = useSitePersonnelBySlug(slug || '')

  const linkLabels = {
    email: t('personnel.cardLinkEmail'),
    facebook: t('personnel.cardLinkFacebook'),
    linkedin: t('personnel.cardLinkLinkedin'),
  }

  const hasPhoto = member ? isPhotoUrl(member.photo_url) : false
  const path = slug ? `/personnel/${slug}` : '/personnel'

  if (loading) {
    return (
      <>
        <Seo title={t('personnel.metaTitle')} description={t('personnel.metaDesc')} path={path} />
        <PageHero
          breadcrumbItems={[
            { href: '/', label: formatNavLabel(t('nav.home'), locale) },
            { href: '/personnel', label: t('personnel.title') },
            { label: '…' },
          ]}
          title={t('personnel.title')}
          lead={t('personnel.loadingStaff')}
        />
      </>
    )
  }

  if (error || !member) {
    return (
      <>
        <Seo title={t('personnel.metaTitle')} description={t('personnel.metaDesc')} path={path} />
        <PageHero
          breadcrumbItems={[
            { href: '/', label: formatNavLabel(t('nav.home'), locale) },
            { href: '/personnel', label: t('personnel.title') },
            { label: slug || '—' },
          ]}
          title={t('personnel.profileLabel')}
          lead={error?.message || t('personnel.noBio')}
        />
        <section className="section">
          <div className="container">
            <p>{t('personnel.loadError')}</p>
            <Link className="btn btn--primary" to="/personnel">
              {t('personnel.title')}
            </Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo
        title={`${member.name} — ${t('personnel.title')}`}
        description={member.role || t('personnel.metaDesc')}
        path={path}
      />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { href: '/personnel', label: t('personnel.title') },
          { label: member.name },
        ]}
        title={member.name}
        lead={member.role || t('personnel.profileLabel')}
      />

      <section className="section personnel-detail">
        <div className="container personnel-detail__layout">
          <div className="personnel-detail__media" data-has-photo={hasPhoto ? 'true' : 'false'}>
            {hasPhoto ? (
              <img src={String(member.photo_url).trim()} alt="" />
            ) : (
              <span className="personnel-profile__initials" aria-hidden="true">
                {memberInitials(member.name)}
              </span>
            )}
          </div>

          <div className="personnel-detail__content">
            <p className="personnel-modal__kicker">{t('personnel.profileLabel')}</p>
            <h2 className="personnel-modal__name">{member.name}</h2>
            {member.role ? <p className="personnel-modal__role">{member.role}</p> : null}
            {member.focus ? <p className="personnel-modal__focus">{member.focus}</p> : null}
            {member.bio ? (
              <p className="personnel-modal__bio">{member.bio}</p>
            ) : (
              <p className="personnel-modal__bio personnel-modal__bio--empty">{t('personnel.noBio')}</p>
            )}
            <PersonnelCardLinks
              email={personnelContactEmail({ slug, name: member.name, email: member.email })}
              facebookUrl={member.facebook_url}
              linkedinUrl={member.linkedin_url}
              labels={linkLabels}
            />
            <p style={{ marginTop: '1.25rem' }}>
              <Link className="btn btn--outline" to="/personnel">
                {t('personnel.title')}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
