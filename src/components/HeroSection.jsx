import React from 'react';
import logo from '../logo.svg';

const HeroSection = ({ onExplore }) => (
  <section className="flex flex-col-reverse md:flex-row items-center justify-between py-12 px-4 md:px-16 bg-[#f0f4fa] rounded-lg shadow mb-8">
    <div className="flex-1 text-center md:text-left">
      <h1 className="text-3xl md:text-4xl font-bold text-[#2e86de] mb-2">Student Convenience App</h1>
      <h2 className="text-xl font-bold text-[#00c897] mb-4">Helping Students Solve Campus Problems</h2>
      <p className="text-base text-gray-700 mb-6 max-w-lg">Empowering college students with tools for lost & found, delivery help, assignments, notes, events, forums, and more. Everything you need, in one place.</p>
      <button
        className="bg-[#ffb703] text-white font-bold px-8 py-3 rounded-full shadow hover:bg-[#ffa502] transition"
        onClick={onExplore}
      >
        Explore Features
      </button>
    </div>
    <div className="flex-1 flex justify-center mb-8 md:mb-0">
      <img src={logo} alt="Student Illustration" className="w-64 h-64 object-contain rounded-full bg-white shadow-lg p-4" />
    </div>
  </section>
);

export default HeroSection; 