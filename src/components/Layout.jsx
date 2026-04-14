import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { JsonLdOrganization } from './JsonLdOrganization'

export function Layout() {
  return (
    <>
      <JsonLdOrganization />
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
