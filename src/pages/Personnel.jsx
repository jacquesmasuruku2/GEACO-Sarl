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
  const pillars = t('personnel.pillars')
  const staffGroups = t('personnel.staffGroups')
  const pillarsList = Array.isArray(pillars) ? pillars : []
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

      <section className="section">
        <div className="container">
          <p style={{ maxWidth: 'var(--max-text)', color: 'var(--color-text-muted)' }}>{t('personnel.intro')}</p>

          <h2 className="section__title" style={{ marginTop: '2rem' }}>
            {t('personnel.pillarsTitle')}
          </h2>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', maxWidth: 'var(--max-text)' }}>
            {pillarsList.map((line) => (
              <li key={line} style={{ marginBottom: '0.45rem', color: 'var(--color-text-muted)' }}>
                {line}
              </li>
            ))}
          </ul>

          <h2 className="section__title" style={{ marginTop: '2.5rem' }}>
            {t('personnel.staffTitle')}
          </h2>

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
                  <div className="card-grid">
                    {group.members.map((member) => (
                      <article className="card personnel-card" key={member.key}>
                        {isPhotoUrl(member.photo_url) ? (
                          <div className="personnel-card__media">
                            <img
                              src={String(member.photo_url).trim()}
                              alt={member.name}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        ) : null}
                        <div className="personnel-card__body">
                          <h3 className="personnel-card__name">{member.name}</h3>
                          <p className="personnel-card__role">{member.role}</p>
                          {member.focus ? <p className="personnel-card__focus">{member.focus}</p> : null}
                          <p className="personnel-card__bio">{member.bio}</p>
                        </div>
                        <PersonnelCardLinks
                          email={member.email}
                          facebookUrl={member.facebook_url}
                          linkedinUrl={member.linkedin_url}
                          labels={linkLabels}
                        />
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
