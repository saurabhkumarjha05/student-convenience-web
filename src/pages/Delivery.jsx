import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNotifications } from '../components/NotificationContext';

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [item, setItem] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await API.get('/delivery');
      setDeliveries(res.data);
    } catch (err) {
      showNotification('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDelivery = async (e) => {
    e.preventDefault();
    if (!item.trim() || !address.trim()) return;
    try {
      await API.post('/delivery', { item, address, status });
      setItem('');
      setAddress('');
      setStatus('pending');
      showNotification('Delivery request added!');
      fetchDeliveries();
    } catch (err) {
      showNotification('Failed to add delivery');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/delivery/${id}`);
      showNotification('Delivery deleted');
      fetchDeliveries();
    } catch (err) {
      showNotification('Failed to delete delivery');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Delivery Requests</h1>
      <form className="bg-white rounded-xl shadow p-6 w-full max-w-md mb-8" onSubmit={handleAddDelivery}>
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Item Description"
          value={item}
          onChange={e => setItem(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Delivery Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />
        <select
          className="border rounded px-3 py-2 w-full mb-3"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Add Delivery</button>
      </form>
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="text-gray-500 text-center">Loading deliveries...</div>
        ) : deliveries.length === 0 ? (
          <div className="text-gray-500 text-center">No deliveries yet.</div>
        ) : (
          <ul className="space-y-4">
            {deliveries.map(delivery => (
              <li key={delivery._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-800">{delivery.item}</span>
                  <button onClick={() => handleDelete(delivery._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
                <div className="text-gray-700 mb-1">Address: {delivery.address}</div>
                <div className="text-xs text-gray-400 self-end">Status: {delivery.status} | {new Date(delivery.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Delivery; 