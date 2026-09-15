import { Route, Routes, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Faq } from './pages/Faq'
import { Services } from './pages/Services'
import { ServiceDetail } from './pages/ServiceDetail'
import { Projects } from './pages/Projects'
import { ProjectDetail } from './pages/ProjectDetail'
import { ProjectSolutionCafe } from './pages/ProjectSolutionCafe'
import { Partnerships } from './pages/Partnerships'
import { Contact } from './pages/Contact'
import { QuoteRequest } from './pages/QuoteRequest'
import { Legal } from './pages/Legal'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Personnel } from './pages/Personnel'
import { PersonnelDetail } from './pages/PersonnelDetail'
import { Gallery } from './pages/Gallery'
import { Formations } from './pages/Formations'
import { FormationDetail } from './pages/FormationDetail'
import { CardApplication } from './pages/CardApplication'
import { AuthAdmin } from './pages/admin/AuthAdmin'
import { AdminPanel } from './pages/admin/AdminPanel'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<AuthAdmin />} />
        <Route path="/auth-admin" element={<Navigate to="/login" replace />} />
        <Route path="/auth-admin/panel" element={<AdminPanel />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/personnel/:slug" element={<PersonnelDetail />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/services/solution-cafe" element={<Navigate to="/projets/solution-cafe" replace />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projets/solution-cafe" element={<ProjectSolutionCafe />} />
          <Route path="/projets/construction" element={<Projects />} />
          <Route path="/projets/agriculture" element={<Projects />} />
          <Route path="/projets/agricoles" element={<Projects />} />
          <Route path="/projets/wash" element={<Projects />} />
          <Route path="/projets/:slug" element={<ProjectDetail />} />
          <Route path="/projets" element={<Projects />} />
          <Route path="/formations/:slug" element={<FormationDetail />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/candidature-carte" element={<CardApplication />} />
          <Route path="/partenariats" element={<Partnerships />} />
          <Route path="/devis" element={<QuoteRequest />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
