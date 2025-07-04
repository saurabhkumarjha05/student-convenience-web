import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNotifications } from '../components/NotificationContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/event');
      setEvents(res.data);
    } catch (err) {
      showNotification('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) return;
    try {
      await API.post('/event', { title, description, date });
      setTitle('');
      setDescription('');
      setDate('');
      showNotification('Event added!');
      fetchEvents();
    } catch (err) {
      showNotification('Failed to add event');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/event/${id}`);
      showNotification('Event deleted');
      fetchEvents();
    } catch (err) {
      showNotification('Failed to delete event');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" aria-label="Loading" /></div>;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <form className="bg-white rounded-xl shadow p-6 w-full max-w-md mb-8" onSubmit={handleAddEvent}>
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Event Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={3}
        />
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Add Event</button>
      </form>
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="text-gray-500 text-center">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-gray-500 text-center">No events yet.</div>
        ) : (
          <ul className="space-y-4">
            {events.map(event => (
              <li key={event._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-800">{event.title}</span>
                  <button onClick={() => handleDelete(event._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
                <div className="text-gray-700 mb-1">{event.description}</div>
                <div className="text-xs text-gray-400 self-end">Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'} | {new Date(event.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Events; 