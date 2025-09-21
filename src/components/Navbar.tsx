import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const routes = ['/', '/our-work', '/about', '/contact', '/places'];
  const labels = ['Home', 'Our Work', 'About', 'Contact', 'Places'];

  return (
    <nav className={`fixed top-0 w-full z-50 shadow-card transition-all duration-300 ease-in-out-expo ${
      menuOpen ? 'bg-white' : 'bg-black'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Navbar Top Row (Hidden when menuOpen is true) */}
        {!menuOpen && (
          <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-4 py-4">
            {/* Logo */}
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

            {/* Hamburger */}
            <button
              className="md:hidden text-white focus:outline-none px-2"
              onClick={toggleMenu}
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
            </button>

{/* Capsule Navigation - Desktop Only */}
<div className="hidden md:flex relative items-center space-x-1">
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
</div>





          </div>
        )}

        {/* Mobile Menu Open */}
        {menuOpen && (
        <div className="py-6 space-y-6 relative">
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-2 right-4 text-black hover:text-accent transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

            {/* Centered Logo / Title */}
            <div className="flex justify-center items-center gap-2">
              <span className="text-xl font-bold text-black">New</span>
              <img
                src="/images/logo2.png"
                alt="New SB Engineering Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-black">Engineering</span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-col space-y-4 px-4">
              {routes.map((path, i) => (
                <NavLink
                  key={path}
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
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
