import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { formatNavLabel } from '../lib/formatNavLabel'
import { useSitePersonnel } from '../hooks/useSitePersonnel'
import { PersonnelCardLinks } from '../components/PersonnelCardLinks'

function isPhotoUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim())
}

export function Personnel() {
  const { t, locale } = useI18n()
  const staffGroups = t('personnel.staffGroups')
  const fallbackGroups = Array.isArray(staffGroups) ? staffGroups : []
  const { groups: dbGroups, loading, error: personnelError } = useSitePersonnel(locale)

  const fromDb = dbGroups.length > 0
  const displayGroups = fromDb
    ? dbGroups.map((g) => ({
        key: `db-${g.sectionOrder}`,
        title: g.title,
        members: g.members.map((m) => ({
          key: String(m.id),
          name: m.name,
          role: m.role,
          focus: m.focus,
          bio: m.bio,
          photo_url: m.photo_url,
          email: m.email,
          facebook_url: m.facebook_url,
          linkedin_url: m.linkedin_url,
        })),
      }))
    : fallbackGroups.map((g) => ({
        key: `i18n-${g.title}`,
        title: g.title,
        members: (g.members ?? []).map((m, i) => ({
          key: `${m.name}-${i}`,
          name: m.name,
          role: m.role,
          focus: m.focus,
          bio: m.bio,
          photo_url: m.photo_url,
          email: m.email,
          facebook_url: m.facebook_url,
          linkedin_url: m.linkedin_url,
        })),
      }))

  const linkLabels = {
    email: t('personnel.cardLinkEmail'),
    facebook: t('personnel.cardLinkFacebook'),
    linkedin: t('personnel.cardLinkLinkedin'),
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

      <section className="section personnel-showcase">
        <div className="container">
          <header className="personnel-showcase__head">
            <h2 className="personnel-showcase__title">{t('personnel.expertsTitle')}</h2>
            <p className="personnel-showcase__lead">{t('personnel.expertsLead')}</p>
          </header>

          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('personnel.loadingStaff')}</p>
          ) : (
            <>
              {personnelError ? (
                <p className="admin-error" role="alert" style={{ marginBottom: '1rem' }}>
                  {t('personnel.loadError')}: {personnelError.message}
                </p>
              ) : null}
              {fromDb ? <p className="personnel__source-note">{t('personnel.sourceDb')}</p> : null}
              {displayGroups.map((group) => (
                <div className="personnel__group" key={group.key}>
                  <h3 className="personnel__group-title">{group.title}</h3>
                  <div className="personnel-team-grid">
                    {group.members.map((member) => (
                      <article className="personnel-card personnel-card--modern" key={member.key}>
                        {isPhotoUrl(member.photo_url) ? (
                          <div className="personnel-card__media">
                            <img
                              src={String(member.photo_url).trim()}
                              alt={member.name}
                              loading="lazy"
                              decoding="async"
                            />
                            <PersonnelCardLinks
                              email={member.email}
                              facebookUrl={member.facebook_url}
                              linkedinUrl={member.linkedin_url}
                              labels={linkLabels}
                              className="personnel-card__links--overlay"
                            />
                          </div>
                        ) : null}
                        <div className="personnel-card__body">
                          <h3 className="personnel-card__name">{member.name}</h3>
                          <p className="personnel-card__role">{member.role}</p>
                          {member.focus ? <p className="personnel-card__focus">{member.focus}</p> : null}
                          {member.bio ? <p className="personnel-card__bio">{member.bio}</p> : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  )
}
