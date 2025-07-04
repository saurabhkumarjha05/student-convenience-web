import React, { useEffect, useState } from 'react';
import API from '../api/api';

const UserActivity = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const res = await API.get('/user/activity-timeline');
        setTimeline(res.data.activity || []);
      } catch (err) {
        setError('Failed to load activity.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" aria-label="Loading" /></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 md:px-8 lg:px-16 py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">My Activity</h1>
      {timeline.length === 0 ? (
        <div className="text-gray-500 text-center">No activity yet.</div>
      ) : (
        <ul className="space-y-4 max-w-2xl mx-auto">
          {timeline.map((item, idx) => (
            <li key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col">
              <div className="font-semibold text-blue-700">{item.type}</div>
              <div className="text-gray-700 mb-1">{item.description}</div>
              <div className="text-xs text-gray-400 self-end">{new Date(item.date || item.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserActivity; 