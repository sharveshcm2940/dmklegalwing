import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { Footer, Header, ScrollToTop } from './components.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Ideology from './pages/Ideology.jsx';
import Organisation from './pages/Organisation.jsx';
import Districts from './pages/Districts.jsx';
import Activities from './pages/Activities.jsx';
import { NewsList, NewsDetail } from './pages/News.jsx';
import Resources from './pages/Resources.jsx';
import { AlbumList, AlbumView } from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';
import UtilityPage from './pages/UtilityPage.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminApp from './admin/AdminApp.jsx';

function LangShell() {
  const { lang } = useParams();
  if (lang !== 'ta' && lang !== 'en') {
    return <Navigate to="/ta" replace />;
  }
  return (
    <>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
    </>
  );
}

function LegacyRedirect({ to }) {
  return <Navigate to={`/ta${to}`} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/" element={<Navigate to="/ta" replace />} />
        <Route path="/index.html" element={<Navigate to="/ta" replace />} />

        {/* Legacy unprefixed shortcuts redirect to Tamil-first default */}
        <Route path="/about" element={<LegacyRedirect to="/about" />} />
        <Route path="/ideology" element={<LegacyRedirect to="/ideology" />} />
        <Route path="/organisation" element={<LegacyRedirect to="/organisation" />} />
        <Route path="/districts" element={<LegacyRedirect to="/districts" />} />
        <Route path="/activities" element={<LegacyRedirect to="/activities" />} />
        <Route path="/news" element={<LegacyRedirect to="/news" />} />
        <Route path="/legal-resources" element={<LegacyRedirect to="/legal-resources" />} />
        <Route path="/gallery" element={<LegacyRedirect to="/gallery" />} />
        <Route path="/contact" element={<LegacyRedirect to="/contact" />} />

        <Route path="/:lang" element={<LangShell />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="ideology" element={<Ideology />} />
          <Route path="organisation" element={<Organisation />} />
          <Route path="districts" element={<Districts />} />
          <Route path="activities" element={<Activities />} />
          <Route path="news" element={<NewsList />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="legal-resources" element={<Resources />} />
          <Route path="gallery" element={<AlbumList />} />
          <Route path="gallery/:id" element={<AlbumView />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<UtilityPage pageKey="privacy" />} />
          <Route path="terms" element={<UtilityPage pageKey="terms" />} />
          <Route path="disclaimer" element={<UtilityPage pageKey="disclaimer" />} />
          <Route path="accessibility" element={<UtilityPage pageKey="accessibility" />} />
          <Route path="copyright" element={<UtilityPage pageKey="copyright" />} />
          <Route path="takedown" element={<UtilityPage pageKey="takedown" />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/ta" replace />} />
      </Routes>
    </>
  );
}
