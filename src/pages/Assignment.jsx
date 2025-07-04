import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNotifications } from '../components/NotificationContext';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/assignment');
      setAssignments(res.data);
    } catch (err) {
      showNotification('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('description', description);
      formData.append('deadline', deadline);
      if (file) formData.append('file', file);
      await API.post('/assignment', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubject('');
      setDescription('');
      setDeadline('');
      setFile(null);
      showNotification('Assignment added!');
      fetchAssignments();
    } catch (err) {
      showNotification('Failed to add assignment');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/assignment/${id}`);
      showNotification('Assignment deleted');
      fetchAssignments();
    } catch (err) {
      showNotification('Failed to delete assignment');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" aria-label="Loading" /></div>;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>
      <form className="bg-white rounded-xl shadow p-6 w-full max-w-md mb-8" onSubmit={handleAddAssignment}>
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
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
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          required
        />
        <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-3" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Add Assignment</button>
      </form>
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="text-gray-500 text-center">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="text-gray-500 text-center">No assignments yet.</div>
        ) : (
          <ul className="space-y-4">
            {assignments.map(assignment => (
              <li key={assignment._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-800">{assignment.subject}</span>
                  <button onClick={() => handleDelete(assignment._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
                <div className="text-gray-700 mb-1">{assignment.description}</div>
                <div className="text-xs text-gray-400 self-end">Deadline: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'N/A'} | {new Date(assignment.createdAt).toLocaleString()}</div>
                {assignment.fileUrl && <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">Download</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Assignment;
