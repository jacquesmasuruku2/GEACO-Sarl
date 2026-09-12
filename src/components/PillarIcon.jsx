/**
 * Icônes SVG inline pour les 3 piliers (sans dépendance externe).
 */
export function PillarIcon({ name, className = 'pillar-icon' }) {
  const common = {
    className,
    viewBox: '0 0 48 48',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  }

  if (name === 'agriculture') {
    return (
      <svg {...common}>
        <path
          d="M24 6c-2.5 8-8 14-14 18 8 0 14 2 18 8 4-6 10-8 18-8-6-4-11.5-10-14-18Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M24 24v16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M14 40h20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'construction') {
    return (
      <svg {...common}>
        <path d="M8 40V22l16-10 16 10v18" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M18 40V28h12v12" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M8 40h32" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }

  // wash
  return (
    <svg {...common}>
      <path
        d="M24 8c0 0-12 14-12 22a12 12 0 0 0 24 0c0-8-12-22-12-22Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M18 30c1.5 4 5 6 6 6s4.5-2 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
