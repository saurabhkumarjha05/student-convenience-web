import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../components/NotificationContext';
import API from '../api/api';

const Signup = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', college: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.college) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        college: form.college
      });

      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
      showNotification('Signup successful!');
      navigate('/main-dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed.');
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
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6" aria-label="Signup form">
          <h2 className="text-3xl font-bold text-center text-blue-700">Sign Up</h2>
          {error && <div className="text-red-600 mt-2" role="alert">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required aria-required />
            <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required aria-required />
          </div>
          <input type="text" placeholder="College Name" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required aria-required />
          <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required aria-required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required aria-required />
          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md transition">
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
