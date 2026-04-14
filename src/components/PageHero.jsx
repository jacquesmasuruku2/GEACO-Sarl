import { Fragment } from 'react'
import { Link } from 'react-router-dom'

/**
 * Hero type pages expertises VINCI : fil d’Ariane, titre, chapô sur image + dégradé bleu/rouge.
 * @param {{ immersive?: boolean, heroImage?: string, actions?: import('react').ReactNode }} props
 */
export function PageHero({ title, lead, breadcrumbItems, immersive = true, heroImage, actions, children }) {
  const sectionClass = immersive ? 'page-hero page-hero--immersive' : 'page-hero page-hero--plain'
  const style =
    immersive && heroImage ? { ['--hero-image']: `url("${heroImage}")` } : undefined

  return (
    <section className={sectionClass} style={style}>
      {immersive ? <div className="page-hero__media" aria-hidden="true" /> : null}
      <div className="page-hero__inner">
        {breadcrumbItems?.length ? (
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            {breadcrumbItems.map((item, i) => (
              <Fragment key={`${item.label}-${i}`}>
                {i > 0 ? <span className="breadcrumb__sep">›</span> : null}
                {item.href ? (
                  <Link to={item.href}>{item.label}</Link>
                ) : (
                  <span aria-current="page">{item.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        ) : null}
        <h1>{title}</h1>
        {lead ? <p className="page-hero__lead">{lead}</p> : null}
        {actions ? <div className="page-hero__actions">{actions}</div> : null}
        {children}
      </div>
    </section>
  )
}
