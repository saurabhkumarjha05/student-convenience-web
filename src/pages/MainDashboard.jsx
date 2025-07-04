import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaTruck, FaClipboardList, FaStickyNote, FaCalendarAlt, FaComments, FaTools } from 'react-icons/fa';

const features = [
  {
    name: 'Lost & Found',
    icon: <FaBoxOpen className="text-blue-500 text-3xl" />,
    route: '/lostfound',
    color: 'bg-blue-50',
  },
  {
    name: 'Delivery',
    icon: <FaTruck className="text-green-500 text-3xl" />,
    route: '/delivery',
    color: 'bg-green-50',
  },
  {
    name: 'Assignment',
    icon: <FaClipboardList className="text-yellow-500 text-3xl" />,
    route: '/assignment',
    color: 'bg-yellow-50',
  },
  {
    name: 'Notes',
    icon: <FaStickyNote className="text-purple-500 text-3xl" />,
    route: '/notes',
    color: 'bg-purple-50',
  },
  {
    name: 'Events',
    icon: <FaCalendarAlt className="text-pink-500 text-3xl" />,
    route: '/events',
    color: 'bg-pink-50',
  },
  {
    name: 'Forum',
    icon: <FaComments className="text-indigo-500 text-3xl" />,
    route: '/forum',
    color: 'bg-indigo-50',
  },
  {
    name: 'Tools',
    icon: <FaTools className="text-gray-500 text-3xl" />,
    route: '/tools',
    color: 'bg-gray-50',
  },
];

const MainDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" aria-label="Loading" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2 sm:px-4 md:px-8 lg:px-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-blue-800">Student Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 w-full max-w-5xl">
        {features.map((feature) => (
          <button
            key={feature.name}
            onClick={() => navigate(feature.route)}
            className={`flex flex-col items-center justify-center rounded-xl shadow-md p-8 transition hover:scale-105 hover:shadow-lg focus:outline-none ${feature.color}`}
          >
            {feature.icon}
            <span className="mt-4 text-lg font-semibold text-gray-700">{feature.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
