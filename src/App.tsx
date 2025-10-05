import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/contacts" element={<ContactListTable />} />
            <Route path="/admin/appointments" element={<AppointmentListTable />} />
          </Routes>
          <WhatsAppButton />
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
