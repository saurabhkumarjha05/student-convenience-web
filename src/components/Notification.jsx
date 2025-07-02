import React, { useEffect } from 'react';

const Notification = ({ message, onClose, duration = 2000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-base sm:text-lg font-semibold animate-fade-in-out">
        {message}
      </div>
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out ${duration}ms both;
        }
      `}</style>
    </div>
  );
};

export default Notification; 