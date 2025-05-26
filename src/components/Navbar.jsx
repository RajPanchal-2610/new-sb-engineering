import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy shadow-lg py-2' : 'bg-dark-blue py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-white hover:text-light-blue transition-colors duration-300"
          >
            <span className="inline-block transform hover:scale-105 transition-transform duration-300">
              New SB Engineering
            </span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `relative px-2 py-1 text-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-light-blue font-semibold' 
                    : 'text-white hover:text-light-blue'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-light-blue transform transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                    }`}
                  ></span>
                </>
              )}
            </NavLink>
            <NavLink 
              to="/our-work" 
              className={({ isActive }) => 
                `relative px-2 py-1 text-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-light-blue font-semibold' 
                    : 'text-white hover:text-light-blue'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Our Work
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-light-blue transform transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                    }`}
                  ></span>
                </>
              )}
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `relative px-2 py-1 text-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-light-blue font-semibold' 
                    : 'text-white hover:text-light-blue'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  About
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-light-blue transform transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                    }`}
                  ></span>
                </>
              )}
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `relative px-2 py-1 text-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-light-blue font-semibold' 
                    : 'text-white hover:text-light-blue'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Contact
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-light-blue transform transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                    }`}
                  ></span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-4 py-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-4 py-2 text-lg transition-colors duration-300 ${
                  isActive 
                    ? 'bg-navy text-light-blue font-semibold rounded-md' 
                    : 'text-white hover:bg-navy hover:text-light-blue rounded-md'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/our-work" 
              className={({ isActive }) => 
                `px-4 py-2 text-lg transition-colors duration-300 ${
                  isActive 
                    ? 'bg-navy text-light-blue font-semibold rounded-md' 
                    : 'text-white hover:bg-navy hover:text-light-blue rounded-md'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Our Work
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `px-4 py-2 text-lg transition-colors duration-300 ${
                  isActive 
                    ? 'bg-navy text-light-blue font-semibold rounded-md' 
                    : 'text-white hover:bg-navy hover:text-light-blue rounded-md'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `px-4 py-2 text-lg transition-colors duration-300 ${
                  isActive 
                    ? 'bg-navy text-light-blue font-semibold rounded-md' 
                    : 'text-white hover:bg-navy hover:text-light-blue rounded-md'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;




















