import React, { useState, useEffect, useContext } from 'react';
// import Navbar from '../components/Navbar';
import { NotificationContext } from '../App';

const Settings = ({ isLoggedIn, setIsLoggedIn }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showNotification } = useContext(NotificationContext);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userSettings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotifications(parsed.notifications ?? true);
      setDarkMode(parsed.darkMode ?? false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify({ notifications, darkMode }));
  }, [notifications, darkMode]);

  const handleSave = (e) => {
    e.preventDefault();
    showNotification('Settings saved!');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 px-2 sm:px-0">
      {/* Navbar removed, handled by Layout */}
      <div className="container max-w-md mx-auto px-2 sm:px-4 py-8 flex flex-col items-center justify-center">
        <form className="bg-white rounded-xl shadow-lg w-full p-4 sm:p-8 space-y-6" onSubmit={handleSave}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-6 text-center">Settings</h2>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium text-sm sm:text-base">Enable Notifications</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications((v) => !v)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium text-sm sm:text-base">Dark Mode</span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((v) => !v)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save Settings
          </button>
          {saved && <div className="text-green-600 text-center font-semibold mt-2">Settings saved!</div>}
        </form>
      </div>
    </div>
  );
};

export default Settings; 