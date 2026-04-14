import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Faq } from './pages/Faq'
import { Services } from './pages/Services'
import { ServiceDetail } from './pages/ServiceDetail'
import { Projects } from './pages/Projects'
import { Partnerships } from './pages/Partnerships'
import { Contact } from './pages/Contact'
import { Legal } from './pages/Legal'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Personnel } from './pages/Personnel'
import { AuthAdmin } from './pages/admin/AuthAdmin'
import { AdminPanel } from './pages/admin/AdminPanel'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/auth-admin" element={<AuthAdmin />} />
        <Route path="/auth-admin/panel" element={<AdminPanel />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projets" element={<Projects />} />
          <Route path="/partenariats" element={<Partnerships />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<Legal />} />
        </Route>
      </Routes>
    </>
  )
}
