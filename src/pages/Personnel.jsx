import { useEffect, useId, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { formatNavLabel } from '../lib/formatNavLabel'
import { useSitePersonnel } from '../hooks/useSitePersonnel'
import { PersonnelCardLinks } from '../components/PersonnelCardLinks'

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

function normalizeMember(m, key) {
  return {
    key,
    name: m.name,
    role: m.role,
    focus: m.focus,
    bio: m.bio,
    photo_url: m.photo_url,
    email: m.email,
    facebook_url: m.facebook_url,
    linkedin_url: m.linkedin_url,
  }
}

function MemberPortrait({ member, hasPhoto }) {
  if (hasPhoto) {
    return (
      <img
        src={String(member.photo_url).trim()}
        alt=""
        loading="lazy"
        decoding="async"
      />
    )
  }
  return (
    <span className="personnel-profile__initials" aria-hidden="true">
      {memberInitials(member.name)}
    </span>
  )
}

export function Personnel() {
  const { t, locale } = useI18n()
  const dialogTitleId = useId()
  const staffGroups = t('personnel.staffGroups')
  const fallbackGroups = Array.isArray(staffGroups) ? staffGroups : []
  const { groups: dbGroups, loading, error: personnelError } = useSitePersonnel(locale)
  const [selected, setSelected] = useState(null)

  const fromDb = dbGroups.length > 0
  const displayGroups = fromDb
    ? dbGroups.map((g) => ({
        key: `db-${g.sectionOrder}`,
        title: g.title,
        members: g.members.map((m) => normalizeMember(m, String(m.id))),
      }))
    : fallbackGroups.map((g) => ({
        key: `i18n-${g.title}`,
        title: g.title,
        members: (g.members ?? []).map((m, i) => normalizeMember(m, `${m.name}-${i}`)),
      }))

  const linkLabels = {
    email: t('personnel.cardLinkEmail'),
    facebook: t('personnel.cardLinkFacebook'),
    linkedin: t('personnel.cardLinkLinkedin'),
  }

  const totalMembers = displayGroups.reduce((n, g) => n + (g.members?.length ?? 0), 0)
  const selectedHasPhoto = selected ? isPhotoUrl(selected.photo_url) : false

  useEffect(() => {
    if (!selected) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') setSelected(null)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected])

  function openProfile(member) {
    setSelected(member)
  }

  function closeProfile() {
    setSelected(null)
  }

  return (
    <>
      <Seo title={t('personnel.metaTitle')} description={t('personnel.metaDesc')} path="/personnel" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { label: t('personnel.title') },
        ]}
        title={t('personnel.title')}
        lead={t('personnel.lead')}
        heroImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section personnel-page">
        <div className="container">
          <header className="personnel-page__intro">
            <p className="personnel-page__kicker">{t('personnel.expertsKicker')}</p>
            <h2 className="personnel-page__title">{t('personnel.expertsTitle')}</h2>
            <p className="personnel-page__lead">{t('personnel.expertsLead')}</p>
            {!loading && totalMembers > 0 ? (
              <p className="personnel-page__count">
                {totalMembers} {t('personnel.memberCountLabel')}
              </p>
            ) : null}
          </header>

          {loading ? <p className="personnel-page__status">{t('personnel.loadingStaff')}</p> : null}

          {!loading && personnelError ? (
            <p className="personnel-page__error" role="alert">
              {t('personnel.loadError')}: {personnelError.message}
            </p>
          ) : null}

          {!loading
            ? displayGroups.map((group) => (
                <div className="personnel-group" key={group.key}>
                  <div className="personnel-group__head">
                    <h3 className="personnel-group__title">{group.title}</h3>
                    <span className="personnel-group__rule" aria-hidden="true" />
                  </div>

                  <div className="personnel-grid">
                    {group.members.map((member) => {
                      const hasPhoto = isPhotoUrl(member.photo_url)
                      const openLabel = `${t('personnel.openProfile')} — ${member.name}`
                      return (
                        <article className="personnel-profile" key={member.key}>
                          <button
                            type="button"
                            className="personnel-profile__media personnel-profile__media--button"
                            data-has-photo={hasPhoto ? 'true' : 'false'}
                            onClick={() => openProfile(member)}
                            aria-label={openLabel}
                          >
                            <MemberPortrait member={member} hasPhoto={hasPhoto} />
                          </button>

                          <div className="personnel-profile__body">
                            <h4 className="personnel-profile__name">
                              <button
                                type="button"
                                className="personnel-profile__name-btn"
                                onClick={() => openProfile(member)}
                              >
                                {member.name}
                              </button>
                            </h4>
                            {member.role ? <p className="personnel-profile__role">{member.role}</p> : null}
                            {member.focus ? <p className="personnel-profile__focus">{member.focus}</p> : null}
                            {member.bio ? (
                              <p className="personnel-profile__bio personnel-profile__bio--preview">{member.bio}</p>
                            ) : null}
                            <button
                              type="button"
                              className="personnel-profile__more"
                              onClick={() => openProfile(member)}
                            >
                              {t('personnel.readProfile')}
                            </button>
                            <PersonnelCardLinks
                              email={member.email}
                              facebookUrl={member.facebook_url}
                              linkedinUrl={member.linkedin_url}
                              labels={linkLabels}
                            />
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              ))
            : null}
        </div>
      </section>

      {selected ? (
        <div className="personnel-modal" role="presentation">
          <button
            type="button"
            className="personnel-modal__backdrop"
            aria-label={t('personnel.closeProfile')}
            onClick={closeProfile}
          />
          <div
            className="personnel-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
          >
            <button
              type="button"
              className="personnel-modal__close"
              onClick={closeProfile}
              aria-label={t('personnel.closeProfile')}
            >
              ×
            </button>

            <div className="personnel-modal__layout">
              <div
                className="personnel-modal__media"
                data-has-photo={selectedHasPhoto ? 'true' : 'false'}
              >
                <MemberPortrait member={selected} hasPhoto={selectedHasPhoto} />
              </div>

              <div className="personnel-modal__content">
                <p className="personnel-modal__kicker">{t('personnel.profileLabel')}</p>
                <h2 id={dialogTitleId} className="personnel-modal__name">
                  {selected.name}
                </h2>
                {selected.role ? <p className="personnel-modal__role">{selected.role}</p> : null}
                {selected.focus ? <p className="personnel-modal__focus">{selected.focus}</p> : null}
                {selected.bio ? (
                  <p className="personnel-modal__bio">{selected.bio}</p>
                ) : (
                  <p className="personnel-modal__bio personnel-modal__bio--empty">{t('personnel.noBio')}</p>
                )}
                <PersonnelCardLinks
                  email={selected.email}
                  facebookUrl={selected.facebook_url}
                  linkedinUrl={selected.linkedin_url}
                  labels={linkLabels}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
