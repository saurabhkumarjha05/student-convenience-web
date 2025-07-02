import React from 'react';
import HeroBanner from '../components/HeroBanner';
import AboutSection from '../components/AboutSection';
import { useNavigate } from 'react-router-dom';

const Home = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/main-dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col px-2 sm:px-0">
      {/* Top Bar with Title and Nav is handled by Navbar */}
      <HeroBanner />
      <AboutSection />
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <button
          onClick={handleStart}
          className="mt-8 w-full max-w-xs sm:max-w-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-4 rounded-2xl shadow-xl text-xl sm:text-2xl font-bold transition-all duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
