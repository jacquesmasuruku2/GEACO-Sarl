import { useLayoutEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { JsonLdOrganization } from './JsonLdOrganization'

export function Layout() {
  const { pathname } = useLocation()
  const [transition, setTransition] = useState(() => ({ pathname, direction: 'bottom' }))
  const direction =
    pathname === transition.pathname
      ? transition.direction
      : transition.direction === 'bottom'
        ? 'top'
        : 'bottom'

  useLayoutEffect(() => {
    if (pathname === transition.pathname) return
    setTransition({ pathname, direction })
  }, [direction, pathname, transition.pathname])

  return (
    <>
      <JsonLdOrganization />
      <Header />
      <main className="site-main">
        <div key={pathname} className={`page-transition page-transition--from-${direction}`}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}
