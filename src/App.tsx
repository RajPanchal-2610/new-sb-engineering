
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Preloader from './components/Preloader';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import OurWork from './pages/OurWork.jsx';
import Places from './pages/Places.jsx';
import type { JSX } from 'react';
import LoginPage from './pages/LoginPage.js';
import AdminPanel from './pages/AdminPanel.js';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent(): JSX.Element {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen w-full">
      {!isLoginPage && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
        >
          <Header />
        </motion.div>
      )}
      <motion.main 
        className={`flex-grow w-full ${!isLoginPage ? 'mt-16' : ''}`}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.8, ease: "easeOut" }}
      > 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/places" element={<Places />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </motion.main>
      {!isLoginPage && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 2.4, ease: "easeOut" }}
        >
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

function App(): JSX.Element {
  const [loading, setLoading] = useState(() => {
    // Skip preloader if navigating to /our-work
    return !window.location.pathname.includes('/our-work');
  });

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  return (
    <>
      <AnimatePresence>
        {loading && <Preloader />}
      </AnimatePresence>
      <AnimatePresence>
        {!loading && (
          <motion.div
            className="min-h-screen bg-white md:bg-gray-100 md:p-4 md:flex md:items-center md:justify-center xl:bg-white xl:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="w-full md:max-w-6xl xl:max-w-none bg-white md:rounded-2xl xl:rounded-none md:shadow-2xl xl:shadow-none overflow-visible"
              initial={{ 
                scale: 0.7, 
                opacity: 0,
                y: 100
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: 0
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut",
                delay: 0.5
              }}
            >
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;






