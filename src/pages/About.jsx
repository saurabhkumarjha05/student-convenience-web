import React from 'react';

const About = ({ isLoggedIn, setIsLoggedIn }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="container max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full p-8 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">About the App</h2>
        <p className="text-lg text-gray-700 leading-7 mb-4">Student Convenience App is your all-in-one campus portal, designed to make college life easier and more organized.</p>
        <ul className="text-left text-gray-600 list-disc list-inside mx-auto max-w-md space-y-2">
          <li>Lost & Found: Quickly report or find lost items.</li>
          <li>Delivery Help: Get or offer delivery assistance.</li>
          <li>Assignments & Notes: Share, manage, and access study materials.</li>
          <li>Events & Forums: Stay updated and connect with peers.</li>
          <li>Tools: Access calculators, planners, and more.</li>
        </ul>
      </div>
    </div>
  </div>
);

export default About;
