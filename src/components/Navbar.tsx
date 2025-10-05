import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Get session on first load
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    // Listen for changes in auth state (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // Cleanup
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // const routes = ['/', '/our-work', '/about', '/contact', '/places'];
  // const labels = ['Home', 'Our Work', 'About', 'Contact', 'Places'];

  const routes = ['/', '/our-work', '/about'];
  const labels = ['Home', 'Our Work', 'About'];

  return (
    <nav className={`fixed top-0 w-full z-50 shadow-card ${
      menuOpen ? 'bg-white' : 'bg-black/90 backdrop-blur-sm transition-all duration-300 ease-in-out-expo'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Navbar Top Row (Hidden when menuOpen is true) */}
        {!menuOpen && (
          <motion.div 
            className="flex justify-between items-center flex-wrap gap-2 sm:gap-4 -my-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link
                to="/"
                onClick={() => logEvent(analytics, 'logo_clicked', { source: 'navbar' })}
                className="text-xl sm:text-2xl lg:text-xl font-bold text-white transition-colors duration-300 px-2"
              >
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-2 transform hover:scale-105 transition-transform duration-300 ease-in-out-expo">
                  <span className="text-base sm:text-xl lg:text-lg">New</span>
                  <img
                    src="/images/logo.png"
                    alt="New SB Engineering Logo"
                    className="h-8 sm:h-10 lg:h-9 xl:h-10 w-auto"
                  />
                  <span className="text-base sm:text-xl lg:text-lg">Engineering</span>
                </div>
              </Link>
            </motion.div>

            {/* Hamburger */}
            <motion.button
              className="md:hidden text-white focus:outline-none px-2"
              onClick={toggleMenu}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>

{/* Desktop Navigation */}
<motion.div 
  className="hidden md:flex relative items-center space-x-4 lg:space-x-5 xl:space-x-6"
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
>
  {/* Capsule Navigation */}
  <div className="relative flex bg-transparent rounded-full p-0.5">
    {routes.map((path, i) => (
      <NavLink
        key={path}
        to={path}
        onClick={() => logEvent(analytics, 'nav_link_clicked', { page: labels[i], source: 'desktop_nav' })}
        className={({ isActive }) =>
          `relative z-10 px-5 py-1.5 lg:px-5 lg:py-1.5 xl:px-6 xl:py-2 text-sm lg:text-sm xl:text-base font-medium rounded-full transition-all duration-300 ease-in-out-expo transform ${
            isActive
              ? 'text-black'
              : 'text-white hover:scale-125'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute inset-0 bg-white rounded-full shadow-md z-[-1] transition-all duration-300 ease-in-out-expo scale-100"></span>
            )}
            {labels[i]}
          </>
        )}
      </NavLink>
    ))}
  </div>
  
  {/* Conditional Button */}
  {session ? (
    <Link to="/admin-panel" onClick={() => logEvent(analytics, 'admin_panel_clicked', { source: 'navbar' })} className="px-4 py-1.5 lg:px-5 lg:py-1.5 xl:px-6 xl:py-2 text-sm lg:text-sm xl:text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out-expo transform hover:scale-105">
      Admin Panel
    </Link>
  ) : (
    <Link to="/login" onClick={() => logEvent(analytics, 'login_clicked', { source: 'navbar' })} className="px-4 py-1.5 lg:px-5 lg:py-1.5 xl:px-6 xl:py-2 text-sm lg:text-sm xl:text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out-expo transform hover:scale-105">
      Login
    </Link>
  )}
</motion.div>





          </motion.div>
        )}

        {/* Mobile Menu Open */}
        {menuOpen && (
        <motion.div 
          className="py-6 space-y-6 relative"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close Button */}
          <motion.button
            onClick={() => setMenuOpen(false)}
            className="absolute top-2 right-4 text-black hover:text-accent transition-colors duration-300"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="mt-5 w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

            {/* Centered Logo / Title */}
            <motion.div 
              className="flex justify-center items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="text-xl font-bold text-black">New</span>
              <img
                src="/images/logo2.png"
                alt="New SB Engineering Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-black">Engineering</span>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex flex-col space-y-4 px-4">
              {routes.map((path, i) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                >
                  <NavLink
                    to={path}
                    onClick={() => {
                      logEvent(analytics, 'nav_link_clicked', { page: labels[i], source: 'mobile_nav' });
                      setMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-lg text-center rounded-md transition-all duration-300 ease-in-out-expo ${
                        isActive
                          ? 'bg-black text-white font-semibold shadow-card'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-black hover:shadow-hover'
                      }`
                    }
                  >
                    {labels[i]}
                  </NavLink>
                </motion.div>
              ))}
              
              {/* Mobile Conditional Button */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + routes.length * 0.1 }}
              >
                {session ? (
                  <Link 
                    to="/admin-panel"
                    onClick={() => {
                      logEvent(analytics, 'admin_panel_clicked', { source: 'mobile_nav' });
                      setMenuOpen(false);
                    }}
                    className="inline-block px-8 py-2 text-base text-center bg-blue-600 text-white font-medium rounded-md shadow-card hover:bg-blue-700 transition-all duration-300 ease-in-out-expo"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => {
                      logEvent(analytics, 'login_clicked', { source: 'mobile_nav' });
                      setMenuOpen(false);
                    }}
                    className="inline-block px-8 py-2 text-base text-center bg-blue-600 text-white font-medium rounded-md shadow-card hover:bg-blue-700 transition-all duration-300 ease-in-out-expo"
                  >
                    Login
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
