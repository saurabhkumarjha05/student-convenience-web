import React, { useState, useEffect, useContext } from 'react';
import { NotificationContext } from '../App';

const Notes = ({ isLoggedIn, setIsLoggedIn }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const { showNotification } = useContext(NotificationContext);

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('notes');
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setNotes([
      { title, content, date: new Date().toLocaleString() },
      ...notes,
    ]);
    setTitle('');
    setContent('');
    showNotification('Note added!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 px-2 sm:px-0">
      <div className="container max-w-md mx-auto px-2 sm:px-4 py-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-full p-4 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">Notes Sharing</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Note Title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Note Content"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={4}
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition text-base sm:text-lg"
            >
              Submit
            </button>
          </form>
          <div className="mt-6 text-left">
            <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-2">Recent Notes</h3>
            {notes.length === 0 ? (
              <div className="text-gray-500">No notes yet.</div>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {notes.map((item, idx) => (
                  <li key={idx} className="bg-blue-50 rounded-lg p-3 shadow flex flex-col">
                    <span className="font-bold text-blue-800 text-sm sm:text-base">{item.title}</span>
                    <span className="text-gray-700 text-xs sm:text-sm mb-1">{item.content}</span>
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

export default Notes; 