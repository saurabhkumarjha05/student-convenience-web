import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../components/NotificationContext';
import API from '../api/api';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
      showNotification('Login successful!');
      navigate('/main-dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-2 sm:px-0">
      {/* LEFT PANEL */}
      <div className="md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-900 fancy-font text-center">Student Convenience App</h1>
        <div className="w-full max-w-xs space-y-4 text-blue-700 font-semibold text-lg">
          <div>🔎 Lost & Found</div>
          <div>🚚 Delivery Help</div>
          <div>📚 Notes Sharing</div>
          <div>🎉 Events</div>
          <div>💬 Student Forum</div>
        </div>
        <p className="text-blue-800 text-center font-medium max-w-xs">
          <span className="font-bold">Empowering students</span> with all-in-one campus solutions!
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="md:w-1/2 flex justify-center items-center bg-white p-4 sm:p-0">
        <form onSubmit={handleSubmit} aria-label="Login form" className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-center text-blue-700">Login</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <label htmlFor="email" className="block font-medium">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
            aria-required="true"
            aria-invalid={!!error}
          />
          <label htmlFor="password" className="block font-medium">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
            aria-required="true"
            aria-invalid={!!error}
          />
          <div className="text-right">
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-sm text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
