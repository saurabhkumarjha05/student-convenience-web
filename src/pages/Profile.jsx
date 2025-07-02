import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';

const Profile = ({ isLoggedIn, setIsLoggedIn }) => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    college: '',
    email: '',
  });

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 px-2 sm:px-0">
      {/* Navbar removed, handled by Layout */}
      <div className="container max-w-md mx-auto px-2 sm:px-4 py-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-full p-4 sm:p-8 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">Profile</h2>
          {editing ? (
            <form className="space-y-4" onSubmit={handleSave}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                value={profile.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="college"
                placeholder="College Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                value={profile.college}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                value={profile.email}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition text-base sm:text-lg"
              >
                Save
              </button>
            </form>
          ) : (
            <>
              <div className="text-xl sm:text-2xl font-bold text-blue-800">{profile.name || 'Your Name'}</div>
              <div className="text-gray-600 mb-2">College: {profile.college || 'Your College'}</div>
              <div className="text-gray-600 mb-4">Email: {profile.email || 'your@email.com'}</div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow transition w-full sm:w-auto"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 