import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { NotificationContext } from '../App';

const Events = ({ isLoggedIn, setIsLoggedIn }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [events, setEvents] = useState([]);
  const { showNotification } = useContext(NotificationContext);

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('events');
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !eventDate) return;
    setEvents([
      { title, description, eventDate, date: new Date().toLocaleString() },
      ...events,
    ]);
    setTitle('');
    setDescription('');
    setEventDate('');
    showNotification('Event added!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 px-2 sm:px-0">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="container max-w-md mx-auto px-2 sm:px-4 py-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-full p-4 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">Events</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Event Title"
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
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition text-base sm:text-lg"
            >
              Submit
            </button>
          </form>
          <div className="mt-6 text-left">
            <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-2">Upcoming Events</h3>
            {events.length === 0 ? (
              <div className="text-gray-500">No events yet.</div>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {events.map((item, idx) => (
                  <li key={idx} className="bg-blue-50 rounded-lg p-3 shadow flex flex-col">
                    <span className="font-bold text-blue-800 text-sm sm:text-base">{item.title}</span>
                    <span className="text-gray-700 text-xs sm:text-sm mb-1">{item.description}</span>
                    <span className="text-xs text-gray-500">Event Date: {item.eventDate}</span>
                    <span className="text-xs text-gray-400 self-end">Added: {item.date}</span>
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

export default Events; 