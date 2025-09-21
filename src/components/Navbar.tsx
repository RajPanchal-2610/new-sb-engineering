import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // const routes = ['/', '/our-work', '/about', '/contact', '/places'];
  // const labels = ['Home', 'Our Work', 'About', 'Contact', 'Places'];

  const routes = ['/', '/our-work', '/about'];
  const labels = ['Home', 'Our Work', 'About'];

  return (
    <nav className={`fixed top-0 w-full z-50 shadow-card ${
      menuOpen ? 'bg-white' : 'bg-black transition-all duration-300 ease-in-out-expo'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
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
                className="text-xl sm:text-2xl font-bold text-white transition-colors duration-300 px-2"
              >
                <div className="flex items-center gap-1 sm:gap-2 transform hover:scale-105 transition-transform duration-300 ease-in-out-expo">
                  <span className="text-base sm:text-xl">New</span>
                  <img
                    src="/images/logo.png"
                    alt="New SB Engineering Logo"
                    className="h-8 sm:h-10 w-auto"
                  />
                  <span className="text-base sm:text-xl">Engineering</span>
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

{/* Capsule Navigation - Desktop Only */}
<motion.div 
  className="hidden md:flex relative items-center space-x-1"
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
>
  <div className="relative flex bg-transparent rounded-full p-0.5">
    {routes.map((path, i) => (
      <NavLink
        key={path}
        to={path}
        className={({ isActive }) =>
          `relative z-10 px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ease-in-out-expo transform ${
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
                    onClick={() => setMenuOpen(false)}
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
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
