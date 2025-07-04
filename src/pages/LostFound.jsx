import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNotifications } from '../components/NotificationContext';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await API.get('/lostitem');
      setItems(res.data);
    } catch (err) {
      showNotification('Failed to load lost items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!item.trim() || !description.trim()) return;
    try {
      await API.post('/lostitem', { item, description, found });
      setItem('');
      setDescription('');
      setFound(false);
      showNotification('Lost item reported!');
      fetchItems();
    } catch (err) {
      showNotification('Failed to report item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/lostitem/${id}`);
      showNotification('Item deleted');
      fetchItems();
    } catch (err) {
      showNotification('Failed to delete item');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Lost &amp; Found</h1>
      <form className="bg-white rounded-xl shadow p-6 w-full max-w-md mb-8" onSubmit={handleAddItem}>
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Item Name"
          value={item}
          onChange={e => setItem(e.target.value)}
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
        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            checked={found}
            onChange={e => setFound(e.target.checked)}
            className="mr-2"
          />
          Mark as Found
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Report Item</button>
      </form>
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="text-gray-500 text-center">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500 text-center">No lost items yet.</div>
        ) : (
          <ul className="space-y-4">
            {items.map(lost => (
              <li key={lost._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-800">{lost.item}</span>
                  <button onClick={() => handleDelete(lost._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
                <div className="text-gray-700 mb-1">{lost.description}</div>
                <div className="text-xs text-gray-400 self-end">{lost.found ? 'Found' : 'Lost'} | {lost.user?.firstName} {lost.user?.lastName} | {new Date(lost.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LostFound;
