import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import WhatsAppButton from './components/WhatsAppButton';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import Treatments from './pages/Treatments';
import BookAppointment from './pages/BookAppointment';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import ContactListTable from './components/ContactListTable';
import AppointmentListTable from './components/AppointmentListTable';
import AdminDashboard from './components/AdminDashboard';
import BlogAdmin from './components/BlogAdmin';

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <Layout>
                <Home />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/about" element={
              <Layout>
                <About />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/treatments" element={
              <Layout>
                <Treatments />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/book-appointment" element={
              <Layout>
                <BookAppointment />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/gallery" element={
              <Layout>
                <Gallery />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/testimonials" element={
              <Layout>
                <Testimonials />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/blog" element={
              <Layout>
                <Blog />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/blog/:slug" element={
              <Layout>
                <BlogPost />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <Contact />
                <WhatsAppButton />
              </Layout>
            } />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/contacts" element={<ContactListTable />} />
            <Route path="/admin/appointments" element={<AppointmentListTable />} />
            <Route path="/admin/blogs" element={<BlogAdmin />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
