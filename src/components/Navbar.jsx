import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo + App Name */}
        <div className="flex items-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-blue-800">Student Convenience App</span>
        </div>
        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base px-2 py-1 transition font-semibold ${location.pathname === link.to ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              {link.label}
            </Link>
          ))}
          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="focus:outline-none">
              <img src="/logo192.png" alt="profile" className="h-8 w-8 rounded-full border-2 border-blue-200" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md py-2 w-56 z-50 border flex flex-col divide-y divide-gray-200">
                {!isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">👤 Profile</Link>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">🔑 Login</Link>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">📝 Signup</Link>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 w-full text-left font-semibold">👤 Profile View</Link>
                      <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">📊 Dashboard</Link>
                      <Link to="/activity" className="block px-4 py-2 hover:bg-gray-100 w-full text-left"> My Activity</Link>
                    </div>
                    <div className="flex flex-col">
                      <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">⚙️ Settings</Link>
                    </div>
                    <div className="flex flex-col">
                      <button onClick={() => { setIsLoggedIn(false); setMenuOpen(false); }} className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600">🚪 Logout</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen((v) => !v)} className="focus:outline-none">
            <svg className="h-8 w-8 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-md rounded-md py-4 px-6 w-64 z-50 border flex flex-col gap-2 divide-y divide-gray-200 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-2 text-base font-semibold ${location.pathname === link.to ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                {!isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">👤 Profile</Link>
                    <Link to="/login" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">🔑 Login</Link>
                    <Link to="/signup" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">📝 Signup</Link>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <Link to="/profile" className="block px-2 py-2 hover:bg-gray-100 w-full text-left font-semibold">👤 Profile View</Link>
                      <Link to="/dashboard" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">📊 Dashboard</Link>
                      <Link to="/activity" className="block px-2 py-2 hover:bg-gray-100 w-full text-left"> My Activity</Link>
                    </div>
                    <div className="flex flex-col">
                      <Link to="/settings" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">⚙️ Settings</Link>
                    </div>
                    <div className="flex flex-col">
                      <button onClick={() => { setIsLoggedIn(false); setMobileMenuOpen(false); }} className="block px-2 py-2 hover:bg-gray-100 w-full text-left text-red-600">🚪 Logout</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
