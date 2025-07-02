import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Lost & Found',
    icon: '📦',
    description: 'Report or claim lost items on campus.',
    color: 'bg-yellow-100',
    route: '/lostfound',
  },
  {
    title: 'Delivery Help',
    icon: '🚚',
    description: 'Get delivery assistance inside college.',
    color: 'bg-blue-100',
    route: '/delivery',
  },
  {
    title: 'Assignments',
    icon: '📝',
    description: 'Share and access assignments easily.',
    color: 'bg-purple-100',
    route: '/assignment',
  },
  {
    title: 'Notes',
    icon: '📚',
    description: 'Upload and download subject notes.',
    color: 'bg-green-100',
    route: '/notes',
  },
  {
    title: 'Events',
    icon: '📅',
    description: 'Know about upcoming college events.',
    color: 'bg-pink-100',
    route: '/events',
  },
  {
    title: 'Forum',
    icon: '💬',
    description: 'Discuss doubts and share info with peers.',
    color: 'bg-indigo-100',
    route: '/forum',
  },
  {
    title: 'Tools',
    icon: '🛠️',
    description: 'Useful utilities like GPA calculator, etc.',
    color: 'bg-red-100',
    route: '/tools',
  },
];

const MainDashboard = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 px-2 sm:px-0">
      <div className="container max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-8 sm:mb-10 text-center">Welcome to Your Campus Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className={`w-full rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg hover:scale-105 transition duration-300 cursor-pointer flex flex-col items-center ${item.color}`}
              onClick={() => navigate(item.route)}
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-gray-700 text-center text-sm sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
