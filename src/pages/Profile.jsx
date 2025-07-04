import React, { useEffect, useState, useRef } from 'react';
import API from '../api/api';
import defaultAvatar from '../assets/default-avatar.png'; // You may need to add a default avatar image
import { Dialog } from '@headlessui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const fileInputRef = useRef();

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    college: '',
    role: ''
  });

  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(true);

  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/user/profile');
        setUser(res.data.user);
        setActivity(res.data.activity);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        college: user.college || '',
        role: user.role || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await API.get('/user/activity-timeline');
        setTimeline(res.data.activity);
      } catch (err) {
        // handle error
      } finally {
        setTimelineLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get('/user/leaderboard');
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        // handle error
      } finally {
        setLeaderboardLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
      // Upload to backend
      const formData = new FormData();
      formData.append('profilePic', file);
      try {
        const res = await API.post('/user/profile-pic', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      } catch (err) {
        alert('Failed to upload profile picture');
      }
    }
  };

  const openFilePicker = () => fileInputRef.current.click();

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/user/profile', editForm);
      setUser(res.data.user);
      setEditOpen(false);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 md:px-8 lg:px-16">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/logo192.png" alt="App Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-blue-700">SmartLearn</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">{user.firstName} {user.lastName}</span>
          <img
            src={user.profilePic || defaultAvatar}
            alt="Profile"
            className="h-10 w-10 rounded-full border object-cover"
          />
        </div>
      </nav>

      {/* Welcome Header */}
      <header className="px-8 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          Welcome back, {user.firstName} <span role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-gray-500 text-lg mt-1">{user.role || 'Student'}, {user.college}</p>
      </header>

      {/* Main Grid */}
      <main className="pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Profile Overview Card */}
          <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center md:items-start">
            <div className="relative group">
              <img
                src={profilePicPreview || user.profilePic || defaultAvatar}
                alt="Profile"
                className="h-24 w-24 rounded-full border-2 border-blue-200 object-cover shadow"
              />
              <button
                onClick={openFilePicker}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 transition-opacity opacity-80 group-hover:opacity-100"
                title="Change profile picture"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3h3z" />
                </svg>
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleProfilePicChange}
              />
            </div>
            <div className="mt-4 text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.college}</p>
              <p className="text-gray-500">{user.role}</p>
              <p className="text-gray-400 text-sm mt-2">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </section>

          {/* My Contributions Panel */}
          <section className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">My Contributions</h3>
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-600">{activity?.lostCount ?? 0}</span>
                <span className="text-gray-500 text-sm">Lost & Found</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-600">{activity?.deliveryCount ?? 0}</span>
                <span className="text-gray-500 text-sm">Deliveries</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-yellow-600">{activity?.notesCount ?? 0}</span>
                <span className="text-gray-500 text-sm">Notes Shared</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-purple-600">{activity?.forumCount ?? 0}</span>
                <span className="text-gray-500 text-sm">Forum Posts</span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 items-center md:items-start">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Quick Actions</h3>
              <button
              onClick={() => setEditOpen(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </section>
        </div>

        {/* Optional: Activity Timeline & Leaderboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Activity Timeline */}
          <section className="bg-white rounded-xl shadow p-6 md:col-span-2 flex flex-col">
            <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2M16 11.37V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6.37M7 17h.01M7 13h.01M17 17h.01M17 13h.01" /></svg>
              Activity Timeline (7 days)
            </h3>
            {timelineLoading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 animate-pulse">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timeline} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="lost" stroke="#3b82f6" name="Lost & Found" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="delivery" stroke="#10b981" name="Deliveries" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="notes" stroke="#f59e42" name="Notes" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="forum" stroke="#a78bfa" name="Forum Posts" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </section>
          {/* Friends Score / Leaderboard */}
          <section className="bg-white rounded-xl shadow p-6 flex flex-col">
            <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75L18.2 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.44 4.73L5.8 21z" /></svg>
              Friends Score
            </h3>
            {leaderboardLoading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 animate-pulse">Loading leaderboard...</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {leaderboard.map((u, i) => (
                  <li key={i} className="flex items-center gap-3 py-2">
                    <span className={`font-bold text-lg w-6 text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-500'}`}>{i + 1}</span>
                    <img src={u.profilePic || defaultAvatar} alt="avatar" className="h-8 w-8 rounded-full border object-cover" />
                    <span className="font-medium text-gray-700 flex-1">{u.firstName} {u.lastName}</span>
                    <span className="font-bold text-blue-600">{u.totalScore}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
          <Dialog.Panel className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md z-10">
            <Dialog.Title className="text-xl font-bold mb-4">Edit Profile</Dialog.Title>
            <form className="flex flex-col gap-4" onSubmit={handleEditSave}>
              <input className="border rounded px-3 py-2" name="firstName" placeholder="First Name" value={editForm.firstName} onChange={handleEditChange} />
              <input className="border rounded px-3 py-2" name="lastName" placeholder="Last Name" value={editForm.lastName} onChange={handleEditChange} />
              <input className="border rounded px-3 py-2" name="college" placeholder="College" value={editForm.college} onChange={handleEditChange} />
              <input className="border rounded px-3 py-2" name="role" placeholder="Role" value={editForm.role} onChange={handleEditChange} />
              <div className="flex gap-4 mt-6">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={() => setEditOpen(false)}>Cancel</button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Profile; 