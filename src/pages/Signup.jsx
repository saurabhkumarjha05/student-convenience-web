import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationContext } from '../App';

const Signup = ({ setIsLoggedIn }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [college, setCollege] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoggedIn(true);
    showNotification('Signup successful!');
    navigate('/main-dashboard');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-2 sm:px-0">
      {/* LEFT PANEL */}
      <div className="md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-2 fancy-font text-center">Student Convenience App</h1>
        <div className="w-full max-w-xs space-y-4">
          <div className="flex items-center gap-3 text-blue-700 text-base sm:text-lg font-semibold">
            <span role="img" aria-label="Lost & Found">🔎</span> Lost & Found
          </div>
          <div className="flex items-center gap-3 text-blue-700 text-base sm:text-lg font-semibold">
            <span role="img" aria-label="Delivery">🚚</span> Delivery Help
          </div>
          <div className="flex items-center gap-3 text-blue-700 text-base sm:text-lg font-semibold">
            <span role="img" aria-label="Notes">📚</span> Notes Sharing
          </div>
          <div className="flex items-center gap-3 text-blue-700 text-base sm:text-lg font-semibold">
            <span role="img" aria-label="Events">🎉</span> Events
          </div>
          <div className="flex items-center gap-3 text-blue-700 text-base sm:text-lg font-semibold">
            <span role="img" aria-label="Forum">💬</span> Student Forum
          </div>
        </div>
        <div className="mt-8 text-blue-800 text-center text-base max-w-xs">
          <span className="font-bold">Empowering students</span> with all-in-one campus solutions!
        </div>
      </div>
      {/* RIGHT PANEL */}
      <div className="md:w-1/2 flex justify-center items-center bg-white p-4 sm:p-0">
        <form onSubmit={handleSignup} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-700">Sign Up</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              required
            />
          </div>
          <input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md transition text-base sm:text-lg"
          >
            Sign Up
          </button>
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
