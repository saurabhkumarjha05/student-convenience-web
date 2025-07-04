import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-2 sm:px-4 md:px-8 lg:px-16">
      {/* Top Navbar */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {/* Main content with spacing below fixed navbar */}
      <main className="flex-grow pt-16 px-4 sm:px-8">
        <Outlet />
        {/* Floating Forum Button */}
        <button
          onClick={() => navigate('/forum')}
          className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center text-3xl animate-bounce hover:bg-blue-700 focus:outline-none"
          title="Go to Forum"
        >
          <span role="img" aria-label="Forum">💬</span>
        </button>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
