import { useId, useState } from 'react'

/**
 * Accordéon type « expertises » (titres larges, ouverture au clic, un panneau ouvert à la fois).
 */
export function ExpertiseAccordion({ items, sectionLabel }) {
  const baseId = useId()
  const [openId, setOpenId] = useState(items[0]?.id ?? null)

  return (
    <div className="accordion" role="region" aria-label={sectionLabel}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const panelId = `${baseId}-panel-${item.id}`
        const headerId = `${baseId}-header-${item.id}`

        return (
          <div key={item.id} className={`accordion__item${isOpen ? ' accordion__item--open' : ''}`}>
            <button
              type="button"
              id={headerId}
              className="accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="accordion__trigger-text">
                <span className="accordion__kicker">{item.kicker}</span>
                <span className="accordion__title">{item.title}</span>
              </span>
              <span className="accordion__icon" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="accordion__panel"
              hidden={!isOpen}
            >
              <p className="accordion__lead">{item.summary}</p>
              <ul className="accordion__list">
                {item.bullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}
