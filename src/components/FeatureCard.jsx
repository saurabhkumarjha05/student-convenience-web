import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:scale-105 hover:shadow-lg transition">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="font-bold text-lg text-[#2e86de] mb-1">{title}</div>
    <div className="text-gray-600 text-sm text-center">{description}</div>
  </div>
);

export default FeatureCard; 