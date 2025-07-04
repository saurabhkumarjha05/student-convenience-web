import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { useNotifications } from '../components/NotificationContext';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/forum');
      setPosts(res.data);
    } catch (err) {
      showNotification('Failed to load forum posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (file) formData.append('file', file);
      await API.post('/forum', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTitle('');
      setContent('');
      setFile(null);
      showNotification('Post added!');
      fetchPosts();
    } catch (err) {
      showNotification('Failed to add post');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/forum/${id}`);
      showNotification('Post deleted');
      fetchPosts();
    } catch (err) {
      showNotification('Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Forum</h1>
      <form className="bg-white rounded-xl shadow p-6 w-full max-w-md mb-8" onSubmit={handleAddPost}>
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Discussion Title"
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Add Post</button>
      </form>
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="text-gray-500 text-center">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-500 text-center">No posts yet.</div>
        ) : (
          <ul className="space-y-4">
            {posts.map(post => (
              <li key={post._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-blue-800">{post.title}</span>
                  <button onClick={() => handleDelete(post._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
                <div className="text-gray-700 mb-1">{post.content}</div>
                <div className="text-xs text-gray-400 self-end">{post.user?.firstName} {post.user?.lastName} | {new Date(post.createdAt).toLocaleString()}</div>
                {post.fileUrl && <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">Download</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Forum; 