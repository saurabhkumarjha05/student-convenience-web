import React, { useState, useEffect, useContext } from 'react';
import { NotificationContext } from '../App';

const LostFound = ({ isLoggedIn, setIsLoggedIn }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);
  const { showNotification } = useContext(NotificationContext);

  // Load items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('lostFoundItems');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lostFoundItems', JSON.stringify(items));
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setItems([
      { title, description, date: new Date().toLocaleString() },
      ...items,
    ]);
    setTitle('');
    setDescription('');
    showNotification('Item added!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 px-2 sm:px-0">
      <div className="container max-w-md mx-auto px-2 sm:px-4 py-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-full p-4 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">Lost &amp; Found</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Item Title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={3}
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition text-base sm:text-lg"
            >
              Submit
            </button>
          </form>
          <div className="mt-6 text-left">
            <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-2">Recent Reports</h3>
            {items.length === 0 ? (
              <div className="text-gray-500">No lost or found items yet.</div>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item, idx) => (
                  <li key={idx} className="bg-blue-50 rounded-lg p-3 shadow flex flex-col">
                    <span className="font-bold text-blue-800 text-sm sm:text-base">{item.title}</span>
                    <span className="text-gray-700 text-xs sm:text-sm mb-1">{item.description}</span>
                    <span className="text-xs text-gray-400 self-end">{item.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFound; 