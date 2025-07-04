import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNotifications } from '../components/NotificationContext';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await API.get('/note');
      setNotes(res.data);
    } catch (err) {
      showNotification('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (file) formData.append('file', file);
      await API.post('/note', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTitle('');
      setContent('');
      setFile(null);
      showNotification('Note added!');
      fetchNotes();
    } catch (err) {
      showNotification('Failed to add note');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/note/${id}`);
      showNotification('Note deleted');
      fetchNotes();
    } catch (err) {
      showNotification('Failed to delete note');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" aria-label="Loading" /></div>;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <form className="bg-white rounded-xl shadow p-6 w-full max-w-md mb-8" onSubmit={handleAddNote}>
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={3}
        />
        <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-3" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Add Note</button>
      </form>
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="text-gray-500 text-center">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-gray-500 text-center">No notes yet.</div>
        ) : (
          <ul className="space-y-4">
            {notes.map(note => (
              <li key={note._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-800">{note.title}</span>
                  <button onClick={() => handleDelete(note._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
                <div className="text-gray-700 mb-1">{note.content}</div>
                <div className="text-xs text-gray-400 self-end">{new Date(note.createdAt).toLocaleString()}</div>
                {note.fileUrl && <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">Download</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notes; 